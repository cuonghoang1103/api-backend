/**
 * ngx-00-8 — Nginx · Section 0 · Start here (1/2) "What this course is, and why Nginx is worth learning" (deck video + web, 12/11/2026).
 * Bài web: nginx-0-0-bat-dau-1. Output THẬT (scratchpad/ngx/demo/n0-8.txt trong dự án video; container ngx-lab, nginx/1.24.0 · Ubuntu 24.04):
 * một nginx vừa tự trả lời /static/ vừa proxy / sang ứng dụng Node :3000; ứng dụng thấy Host "127.0.0.1:3000" (mồi cho Chương 3).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-8:file:/root/app.js": "// ứng dụng nhỏ của bạn: nghe 127.0.0.1:3000, trả lại vài thông tin của request nó nhận được\nrequire('http').createServer((req, res) => {\n  res.setHeader('Content-Type', 'application/json');\n  res.end(JSON.stringify({ app: 'node:3000', url: req.url, host: req.headers.host, ip: req.socket.remoteAddress }) + '\\n');\n}).listen(3000, '127.0.0.1');\n",
 "n0-8:file:/tmp/ng/conf/nginx.conf": "events {}\nhttp {\n  access_log /tmp/ng/logs/access.log;\n  server {\n    listen 8080;\n    location /static/ { return 200 \"tep tinh: nginx tu tra loi\\n\"; }\n    location /        { proxy_pass http://127.0.0.1:3000; }\n  }\n}\n",
 "n0-8:setup": "",
 "n0-8:chay": "$ nginx -v\nnginx version: nginx/1.24.0 (Ubuntu)\n$ nginx -c /tmp/ng/conf/nginx.conf -t\nnginx: the configuration file /tmp/ng/conf/nginx.conf syntax is ok\nnginx: configuration file /tmp/ng/conf/nginx.conf test is successful\n$ nginx -c /tmp/ng/conf/nginx.conf\n$ curl -s http://127.0.0.1:3000/api/hello\n{\"app\":\"node:3000\",\"url\":\"/api/hello\",\"host\":\"127.0.0.1:3000\",\"ip\":\"127.0.0.1\"}\n$ curl -s http://127.0.0.1:8080/api/hello\n{\"app\":\"node:3000\",\"url\":\"/api/hello\",\"host\":\"127.0.0.1:3000\",\"ip\":\"127.0.0.1\"}\n$ curl -s http://127.0.0.1:8080/static/logo.png\ntep tinh: nginx tu tra loi\n$ curl -sI http://127.0.0.1:8080/api/hello | grep -iE '^(HTTP|server|content-type)'\nHTTP/1.1 200 OK\nServer: nginx/1.24.0 (Ubuntu)\nContent-Type: application/json\n$ tail -n 2 /tmp/ng/logs/access.log\n127.0.0.1 - - [12/Nov/2026:10:57:01 +0000] \"GET /static/logo.png HTTP/1.1\" 200 27 \"-\" \"curl/8.5.0\"\n127.0.0.1 - - [12/Nov/2026:10:57:01 +0000] \"HEAD /api/hello HTTP/1.1\" 200 0 \"-\" \"curl/8.5.0\""
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, seq, path, icards, cmp, box, two, steps, kw, c, tbl } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-00-8', code: 'NGX 0.8', title: 'What this course is, and why Nginx is worth learning', sub: 'Section 0 · Start here (1/2)' };
const O = (k) => { const v = DU_LIEU[`n0-8:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const lenh = (blk, re) => { const ls = O(blk).split('\n'); const i = ls.findIndex((l) => re.test(l)); const out = [ls[i]]; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) out.push(ls[j]); return out.join('\n'); };

export const S = [
  { cover: true, nhan: 'Section 0 · Start here (1/2)', t: 'What this course is,<br>and why Nginx is worth learning', sub: 'The server in front of your server — read, write and debug a real configuration instead of pasting one from a blog',
    en: 'Start here, part one: what this course is, and why Nginx is worth your time as a backend developer.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Where Nginx stands — the first thing a request touches, the last thing it leaves</li>
    <li>What a reverse proxy is, in one sentence and one real run</li>
    <li>The map of the course: Section 0 and eleven chapters</li>
    <li>Why it is worth learning even if a platform hides it from you</li>
    <li>How every claim in this course is made: measured, not asserted</li></ul>`,
    en: 'Five takeaways: where Nginx stands in a production stack, what a reverse proxy is, the map of the course, why it is worth learning even behind a managed platform, and the rule of the course — every claim is measured.' },
  { t: 'Where Nginx stands: the first hop and the last', body: path([
      { t: 'Browser', s: 'GET /api/hello' }, { t: 'Nginx :443', s: 'TLS · rules · cache', on: true }, { t: 'Your app :3000', s: 'business logic' }, { t: 'Database', s: 'PostgreSQL…' }],
      { nhan: ['public', 'private', 'SQL'] }) +
    icards([
      ['shield', 'Faces the Internet', 'Clients talk to Nginx, never directly to your process.'],
      ['server', 'Talks to your app privately', 'Your app listens on 127.0.0.1 — invisible from outside.'],
      ['layers', 'One place for edge work', 'TLS, static files, caching, limits, load balancing.'],
    ], 3) + box('Without it', 'Every app re-implements TLS, gzip, static files and rate limits — in every language you deploy. With it, the app does only its own job.', 'do2'),
    en: 'In most production stacks Nginx is the first thing a request touches and the last thing it leaves. The browser talks to Nginx on the public port; Nginx talks to your application on a private port. That single position is what makes it useful.' },
  { t: 'A reverse proxy, in one sentence', body: seq(['Client', 'nginx :8080', 'app :3000'], [
      [0, 1, 'GET /api/hello'], [1, 2, 'GET /api/hello  (new connection)'], [2, 1, '200 {"app":"node:3000"…}', '#2f9d58'], [1, 0, '200 — same body, Server: nginx', '#2f9d58'],
      [0, 1, 'GET /static/logo.png'], [1, 1, 'answered by nginx itself', '#7c3aed'], [1, 0, '200 "tep tinh…"', '#2f9d58']], { rh: 46 }) +
    box('Reverse proxy', 'A server that stands in front of your application: the client talks to it, and it quietly talks to your app on a private port.', 'lam'),
    en: 'A reverse proxy is a server that stands in front of your application: the client talks to it, and it talks to your app on a private port. Some requests it forwards; others, like static files, it answers by itself.' },
  { t: 'One real run: nginx in front of a small Node app', body: ngc(O('file:/tmp/ng/conf/nginx.conf'), { sm: true, hl: [6, 7] }) +
      tn([lenh('chay', /nginx -c .* -t$/), lenh('chay', /3000\/api/), lenh('chay', /8080\/api/), lenh('chay', /static/)].join('\n'), { wrap: 110, fs: 15 }),
    en: 'This is a real run on nginx 1.24.0. Ten lines of configuration: /static/ is answered by Nginx itself, everything else is forwarded to a Node app on port 3000. Asking the app directly and asking through Nginx return the same body.' },
  { t: 'The response says who answered — and the app was fooled', body: tn([lenh('chay', /curl -sI/), lenh('chay', /tail -n 2/)].join('\n'), { wrap: 100, fs: 15 }) +
    two(box('Server: nginx/1.24.0', 'The client sees Nginx, not Node. Your app is hidden behind it — that is the point.', 'xanh'),
      box('host: "127.0.0.1:3000"', 'Through the proxy the app saw Nginx\'s address and its own port, not the client\'s. Chapter 3 fixes exactly this with six headers.', 'do2')),
    en: 'The response header says Server: nginx — the client never sees Node. And the app, asked through the proxy, reported host 127.0.0.1:3000: it did not see the real host or the real client. Chapter 3 is about telling the app the truth.' },
  { t: 'The map of the course', body: icards([
      ['bolt', 'Section 0 · Setup', 'What Nginx is for, install, master/worker, the smallest config'],
      ['map', 'Ch 1–2 · Routing', 'Which server block, then which location wins'],
      ['plug', 'Ch 3 · Reverse proxy', 'proxy_pass, headers, buffering, timeouts, WebSocket'],
      ['page', 'Ch 4–5 · Static & cache', 'Bytes from disk; a cache in front of your app'],
      ['key', 'Ch 6 · TLS & HTTP/2', 'Certificates, ciphers, handshake cost, HTTPS redirect'],
      ['filter', 'Ch 7–9 · Limits, rewrites, load balancing', 'Rate and size caps, map, upstream pools'],
      ['search', 'Ch 10–11 · Logs & diagnosis', 'See what happens; make Nginx confess what it did'],
      ['test', 'Every chapter', 'Real configs, real output, a quiz, Code Lab practice'],
    ], 4),
    en: 'Section 0 builds a running server. Chapters 1 and 2 are routing — which server block, then which location. Chapter 3 is the reverse proxy. Chapters 4 and 5 are static files and caching. Chapter 6 is TLS and HTTP/2. Chapters 7 to 9 are limits, rewrites and load balancing. Chapters 10 and 11 are logs and diagnosis.' },
  { t: 'Why it is worth your time', body: icards([
      ['server', 'It is almost everywhere', 'Even when a managed platform or a CDN hides it, that thing IS a reverse proxy with a different config language.'],
      ['cut', 'It peels off the boring half', 'Slow connections, disk reads, TLS and junk requests are exactly what one application process does badly.'],
      ['warn', 'Its failures are learnable', 'Most incidents come from a short list of rules — inheritance, location priority, header replacement.'],
    ], 3) + box('The promise of this course', 'By the end you can read, write and debug a real configuration — because you will have run every one of them yourself.', 'xanh'),
    en: 'Three reasons. It is almost everywhere — platforms and CDNs are proxies too. It peels the boring half of the work off your application. And its failures come from a short list of rules that this course measures, so you will recognise them on sight.' },
  { t: 'The same ideas on every platform', body: cmp(['Concept', 'In Nginx', 'Elsewhere'], [
      ['Forward to the app', c('proxy_pass'), 'Kubernetes Ingress backend · Vercel/Fly routing'],
      ['Terminate HTTPS', c('ssl_certificate'), 'load balancer listener · CDN edge certificate'],
      ['Cache responses', c('proxy_cache'), 'CDN cache rules · Cache-Control at the edge'],
      ['Spread load', c('upstream { … }'), 'target groups · service endpoints'],
      ['Turn away abuse', c('limit_req'), 'WAF / rate-limit rules'],
    ]) + box('Learn it once', 'Nginx is the version you can run on your own laptop and whose source you can read — the concepts transfer to all the others.', 'lam'),
    en: 'Every concept in this course reappears on other platforms under another name: forwarding, terminating HTTPS, caching, spreading load, turning away abuse. Nginx is the version you can run locally and inspect, so learning it teaches you all of them.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Reverse proxy', 'a server in front of your app; clients talk to it'),
      kw('Upstream', 'the backend service Nginx forwards to'),
      kw('TLS termination', 'HTTPS handled at the proxy; the app speaks plain HTTP'),
      kw('Edge', 'the layer before your code: limits, cache, redirects'),
      kw('Directive', 'one configuration instruction, e.g. listen, proxy_pass'),
    ].join('')}</div>` + tbl(['Port', 'Who listens', 'Reachable from'], [['8080 / 443', 'nginx', 'the Internet'], ['3000', 'your app (127.0.0.1)', 'only this machine']]),
    en: 'Five words for the whole course. Reverse proxy: a server in front of your app. Upstream: the backend it forwards to. TLS termination: HTTPS handled at the proxy. Edge: the layer before your code. Directive: one configuration instruction.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Run the ten-line config from this lesson with ${c('nginx -c')}`,
      `Ask the app directly on :3000, then through :8080`,
      `Compare the ${c('Server')} header of both answers`,
      `Read the two lines ${c('access.log')} wrote`,
    ]), box('Keep these', `<ul><li>Nginx is the first hop and the last</li><li>Reverse proxy = front door for your app</li><li>Platforms and CDNs are proxies too</li><li>Every claim here is measured on nginx 1.24.0</li></ul>`, 'lam'), ''),
    en: 'Your turn: run the ten-line configuration, ask the app directly and through Nginx, compare the Server header, and read the access log. Keep four ideas: first hop and last, front door for your app, every platform is a proxy, every claim is measured.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — The problem, and a build that runs', bai: 'Start 1/2' }, S);
