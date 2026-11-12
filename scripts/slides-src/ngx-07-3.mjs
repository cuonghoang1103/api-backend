/**
 * ngx-07-3 — Nginx · Chapter 7 · Lesson 7.3 "limit_conn, and the attack it does not stop" (deck video + web, 13/11/2026).
 * Bài web: nginx-7-3-limit-conn. Output THẬT (scratchpad/ngx/demo/n7-3.txt; nginx/1.24.0; upstream Node mất 1,5 s mỗi request):
 * 6 request cùng lúc: limit_conn 2 ⇒ 2×200 4×503 · không giới hạn ⇒ 6×200; log "limiting connections by zone "ketnoi"".
 * Slowloris 20 kết nối nhỏ giọt header 8 s: không giới hạn ⇒ sống 20 · limit_conn 2 ⇒ sống 20 · client_header_timeout 2s ⇒ đóng 20.
 * Băng thông: tệp 6 MB, limit_rate_after 2m + limit_rate 1m ⇒ 4,25 s; không bóp ⇒ 0,004 s.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n7-3:file:/root/cham.js": "// upstream (cổng 9301): mỗi request mất 1,5 giây\nrequire('http').createServer((req, res) => setTimeout(() => res.end('xong\\n'), 1500)).listen(9301, '127.0.0.1');\n",
 "n7-3:file:/tmp/ng/conf/conn.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents { worker_connections 1024; }\nhttp {\n  access_log off;\n  limit_conn_zone $binary_remote_addr zone=ketnoi:10m;\n  server { listen 8080; location / { limit_conn ketnoi 2; proxy_pass http://127.0.0.1:9301; } }          # có limit_conn\n  server { listen 8081; location / { proxy_pass http://127.0.0.1:9301; } }                               # không giới hạn\n  server { listen 8082; limit_conn ketnoi 2; location / { proxy_pass http://127.0.0.1:9301; } }          # slowloris + limit_conn\n  server { listen 8083; client_header_timeout 2s; location / { proxy_pass http://127.0.0.1:9301; } }     # slowloris + timeout 2s\n}\n",
 "n7-3:file:/root/cham-header.py": "# cham-header.py <cổng> — mở 20 kết nối, mỗi cái gửi MỘT dòng header mỗi 0,5 s, KHÔNG BAO GIỜ gửi dòng trống kết thúc (khuôn slowloris)\nimport socket, sys, time\ncong = int(sys.argv[1]); ds = []\nfor i in range(20):\n    s = socket.create_connection(('127.0.0.1', cong)); s.send(b'GET / HTTP/1.1\\r\\nHost: x\\r\\n'); ds.append(s)\nt0 = time.time()\nwhile time.time() - t0 < 8:\n    for s in ds:\n        try: s.send(b'X-a: b\\r\\n')\n        except OSError: pass\n    time.sleep(0.5)\nsong = 0\nfor s in ds:\n    try:\n        s.settimeout(0.2); s.send(b'X-a: b\\r\\n'); d = s.recv(1)\n        song += 0 if d == b'' else 1\n    except socket.timeout: song += 1\n    except OSError: pass\nprint(f'sau 8s: con song {song}, bi dong {20 - song}')\n",
 "n7-3:setup": "",
 "n7-3:sauyeucau": "$ : > /tmp/ng/logs/error.log; for p in 8080 8081; do printf 'cong %s: ' $p; for i in $(seq 6); do curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:$p/ & done | sort | uniq -c | awk '{printf \"%s x %s  \", $1, $2}'; wait; echo; done\ncong 8080: 2 x 200  4 x 503  \ncong 8081: 6 x 200  \n$ grep -m1 -o 'limiting connections by zone \"ketnoi\"' /tmp/ng/logs/error.log\nlimiting connections by zone \"ketnoi\"",
 "n7-3:slowloris": "$ for p in 8081 8082 8083; do printf 'cong %s: ' $p; python3 cham-header.py $p; done\ncong 8081: sau 8s: con song 20, bi dong 0\ncong 8082: sau 8s: con song 20, bi dong 0\ncong 8083: sau 8s: con song 0, bi dong 20",
 "n7-3:file:/tmp/ng/conf/rate.conf": "pid       /tmp/ng/logs/rate.pid;\nerror_log /tmp/ng/logs/rate.log;\nevents {}\nhttp {\n  access_log off;\n  root /tmp/ng/site;\n  server { listen 8084; location / { limit_rate_after 2m; limit_rate 1m; } }   # 2 MB đầu hết tốc lực, phần sau 1 MB/s mỗi kết nối\n  server { listen 8085; }                                                       # không bóp\n}\n",
 "n7-3:bangthong": "$ for p in 8085 8084; do curl -s -o /dev/null -w \"cong $p: %{size_download} byte trong %{time_total} s\\n\" http://127.0.0.1:$p/to.bin; done\ncong 8085: 6291456 byte trong 0.004147 s\ncong 8084: 6291456 byte trong 4.245322 s"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, meter, path } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-07-3', code: 'NGX 7.3', title: 'limit_conn, and the attack it does not stop', sub: 'Chapter 7 · Lesson 7.3' };
const O = (k) => { const v = DU_LIEU[`n7-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const KQ = (k) => O(k).split('\n').filter((l) => !l.startsWith('$ ')).join('\n');

/** Vòng đời một kết nối: limit_conn chỉ đếm từ lúc header đọc xong. */
const vongDoi = () => {
  const W = 1110, H = 250, o = [
    ['accept', 'TCP connection open', '#64748b', ''],
    ['reading header', 'slowloris lives HERE', '#c0392b', 'client_header_timeout'],
    ['request in progress', 'limit_conn counts HERE', '#009639', 'limit_conn · limit_req'],
    ['reading body', 'uploads', '#2563eb', 'client_body_timeout'],
    ['sending response', 'slow readers', '#7c3aed', 'send_timeout'],
  ];
  const bw = 194, gap = 26;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs><marker id="mv" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>`;
  o.forEach(([t, sub, mau, ai], i) => {
    const x = 6 + i * (bw + gap);
    s += `<rect x="${x}" y="40" width="${bw}" height="96" rx="14" fill="${mau}16" stroke="${mau}" stroke-width="${i === 1 || i === 2 ? 4 : 2.4}"/>`;
    s += `<text x="${x + bw / 2}" y="80" text-anchor="middle" font-size="19" font-weight="800" fill="${mau}">${t}</text><text x="${x + bw / 2}" y="110" text-anchor="middle" font-size="15" fill="#444">${sub}</text>`;
    if (ai) s += `<text x="${x + bw / 2}" y="170" text-anchor="middle" font-size="15" font-weight="700" fill="${mau}" font-family="monospace">${ai}</text>`;
    if (i < o.length - 1) s += `<line x1="${x + bw + 2}" y1="88" x2="${x + bw + gap - 3}" y2="88" stroke="#b85a2b" stroke-width="3" marker-end="url(#mv)"/>`;
  });
  s += `<rect x="${6 + 2 * (bw + gap) - 6}" y="20" width="${3 * bw + 2 * gap + 12}" height="130" rx="18" fill="none" stroke="#009639" stroke-width="2.5" stroke-dasharray="8 6"/><text x="${6 + 2 * (bw + gap) + 300}" y="14" text-anchor="middle" font-size="16" font-weight="800" fill="#009639">counted by limit_conn</text>`;
  s += `<text x="${W / 2}" y="${H - 22}" text-anchor="middle" font-size="18" font-weight="700" fill="#c0392b">a slowloris connection never leaves "reading header" — so limit_conn never sees it</text>`;
  return s + '</svg>';
};

export const S = [
  { cover: true, nhan: 'Chapter 7 · Lesson 7.3', t: 'limit_conn, and the attack<br>it does not stop', sub: 'It caps connections in progress — and does nothing against slowloris',
    en: 'Lesson 7.3. Rate limits count requests over time. Another resource runs out first: connection slots. limit conn caps them per client, works exactly as advertised — and does nothing against the attack people deploy it for.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>limit_conn counts connections IN PROGRESS</li>
    <li>Bandwidth per connection: limit_rate</li>
    <li>Slowloris: 20 dripping connections, measured three ways</li>
    <li>Where a connection is when each limit sees it</li>
    <li>Four directives, four resources — none overlaps</li></ul>`,
    en: 'Five takeaways: limit conn counts connections in progress; bandwidth per connection; slowloris measured three ways; where a connection is when each limit sees it; and four directives guarding four different resources.' },
  { t: 'It works: six slow requests, one IP', body: two(ngc(`limit_conn_zone $binary_remote_addr zone=ketnoi:10m;

server {                       # upstream takes 1.5 s
  location / {
    limit_conn ketnoi 2;       # 2 in flight per IP
    proxy_pass http://127.0.0.1:9301;
  }
}`, { hl: [5] }), tn(KQ('sauyeucau').replace('cong 8080', 'limit_conn 2').replace('cong 8081', 'no limit    '), { fs: 18, wrap: 50 }), 'r64') + icards([
      ['count', 'counts what is OPEN now', 'not requests per second — how many are in flight for this key right now'],
      ['page', 'right for slow endpoints', 'one client holding 20 big downloads is a LOW rate — limit_req misses it'],
      ['layers', 'set it GENEROUSLY', 'browsers open up to 6 per origin: 10–20 for a site, 2 for downloads'],
    ], 3),
    en: 'It works. Upstream takes one and a half seconds, limit conn two, six requests at once: two got two hundred, four got five oh three, and the error log says limiting connections by zone. Without the limit all six passed. It counts what is open right now, not requests per second — the right tool for slow endpoints and downloads. Set it generously: a browser opens up to six connections per origin.' },
  { t: 'Bandwidth per connection: limit_rate', body: ngc(`location /tai-xuong/ {
  limit_conn       ketnoi 2;  # how many at once
  limit_rate_after 2m;        # the first 2 MB at full speed
  limit_rate       1m;        # then 1 MB/s per connection
}`, { hl: [3, 4] }) + tn(KQ('bangthong').replace('cong 8085', 'no limit_rate     ').replace('cong 8084', '2m fast, then 1m/s'), { fs: 17, wrap: 100 }) +
    meter([['6 MB, no limit_rate', 0.004, '#64748b'], ['6 MB, limit_rate_after 2m + limit_rate 1m', 4.25, '#009639']], { don: 's', rh: 48, fs: 20, nhan: 480 }),
    en: 'Pair it with limit rate for bandwidth. A six megabyte file: unthrottled it took four milliseconds. With limit rate after two megabytes and limit rate one megabyte per second, it took four point two five seconds — two megabytes at full speed, then four at one per second. Small files stay fast; only the long tail is squeezed. Nobody is refused.' },
  { t: 'And now the attack it does not stop', body: tn(KQ('slowloris').replace('cong 8081', 'no limit_conn       ').replace('cong 8082', 'limit_conn 2        ').replace('cong 8083', 'client_header_timeout 2s'), { fs: 17, wrap: 100 }) +
    two(box('Slowloris, measured', '20 connections, each sends ONE header line every 0.5 s and NEVER sends the blank line that ends the headers. After 8 s: still 20 alive — with or without limit_conn.', 'do2'),
      box('What stopped it', '<code>client_header_timeout 2s</code> closed all 20. The default is 60 s — far too generous. The limit people reach for is the wrong one entirely.', 'xanh')),
    en: 'Now the attack. Twenty connections, each dripping one header line every half second and never finishing. After eight seconds, with no limit: twenty alive. With limit conn two: still twenty alive. With client header timeout two seconds: all twenty closed. The directive people reach for does nothing; the timeout does everything.' },
  { t: 'Why: where the connection is when each limit sees it', body: vongDoi() + box('limit_conn counts connections whose request header has been READ', 'A slowloris connection is still in the "reading header" phase forever. From nginx\'s point of view no request has started — there is nothing to count. Only the timeout of that phase can close it.', 'lam'),
    en: 'Why? Follow a connection through its life: accept, reading header, request in progress, reading body, sending the response. Limit conn counts only from the moment the header has been read. A slowloris connection never leaves the reading header phase, so it is never counted. Each phase has its own timeout, and that timeout is the only thing that guards it.' },
  { t: 'A defensive http block', body: ngc(`http {
  # Against dripping: cut connections that never finish
  client_header_timeout 10s;   # default 60s — too generous
  client_body_timeout   10s;
  send_timeout          10s;   # a client reading too slowly
  keepalive_timeout     30s;

  # Against slot hogging: connections IN PROGRESS per IP
  limit_conn_zone $binary_remote_addr zone=conn:10m;
  limit_conn_status 429;
  server {
    limit_conn conn 20;                       # ordinary pages: generous
    location /tai-xuong/ { limit_conn conn 2; limit_rate_after 5m; limit_rate 1m; }
  }
}`, { hl: [3, 4, 5, 12, 13] }),
    en: 'A defensive http block. Against dripping: client header timeout, client body timeout and send timeout at ten seconds, keepalive thirty. Against slot hogging: limit conn twenty per IP for ordinary pages, status four twenty nine, and a tight two plus a bandwidth cap for downloads.' },
  { t: 'What still matters around it', body: icards([
      ['cpu', 'Nginx survives slowloris better than most', 'an idle connection costs one file descriptor and a small buffer, not a thread'],
      ['server', 'worker_connections is the REAL ceiling', 'when slots run out the error log says "worker_connections are not enough"'],
      ['clock', 'Short timeouts have a real cost', 'they measure the GAP between two reads (Lesson 3.4) — test an upload on a throttled link before going below 10 s'],
      ['layers', 'Per instance, like limit_req', 'three nginx behind a load balancer = three times the connections you configured'],
    ], 2),
    en: 'Around it. Nginx survives slowloris better than thread per connection servers: an idle connection costs a file descriptor, not a thread. Worker connections is the real ceiling, and the error log says so when it runs out. Short timeouts have a cost — they measure the gap between reads, so test a slow upload before going under ten seconds. And it is per instance.' },
  { t: 'What each limit actually defends', body: cmp(['Directive', 'Resource it guards', 'Stops', 'Does nothing against'], [
      ['limit_req', 'RATE — backend throughput', 'a script firing 1,000 fast requests', 'ONE slow request'],
      ['limit_conn', 'CONCURRENCY — slots', 'one client holding 20 slots with complete requests', 'connections that never finish a request'],
      ['client_*_timeout', 'DURATION of half-done work', 'open connections making no progress (slowloris)', 'complete, valid requests'],
      ['client_max_body_size', 'SIZE (Lesson 7.4)', 'one request eating disk or memory', 'many small requests'],
    ], { hl: [2] }) + box('Before trusting a limit, write down WHAT it counts', 'Then ask whether the thing you fear consumes that resource. The middle row of the slowloris test is that assumption, tested: a correct limit, enforced correctly, irrelevant to the attack.', 'do2'),
    en: 'What each limit defends. Limit req guards rate. Limit conn guards concurrency. The client timeouts guard duration of unfinished work — the only slowloris defence. Client max body size guards size, lesson seven point four. Four resources, no overlap. Before trusting a limit, write down what it counts, and ask whether the thing you fear consumes it.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('limit_conn_zone / limit_conn', 'connections in progress per key'),
      kw('connection in progress', 'request header already read'),
      kw('slowloris', 'drips headers forever, never counted'),
      kw('client_header_timeout', 'the real slowloris defence'),
      kw('limit_rate / limit_rate_after', 'bandwidth per connection'),
      kw('worker_connections', 'the real ceiling on open connections'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: limit conn zone and limit conn, a connection in progress, slowloris, client header timeout, limit rate and limit rate after, and worker connections.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `A 1.5 s upstream, ${c('limit_conn 2')}, six requests at once`,
      `A 6 MB file with ${c('limit_rate_after 2m')} + ${c('limit_rate 1m')}`,
      `Run the 20-connection dripper with and without limit_conn`,
      `Set ${c('client_header_timeout 2s')} and run it again`,
      `Fill in the four-row table for your own config`,
    ]), box('Keep these', `<ul><li>limit_conn counts requests in progress</li><li>Slowloris is never counted</li><li>Timeouts stop it</li><li>Four limits, four resources</li></ul>`, 'lam'), ''),
    en: 'Your turn: six requests at once against a slow upstream with limit conn two; a large file with limit rate; the twenty connection dripper with and without limit conn; then the header timeout. Keep: limit conn counts requests in progress; slowloris is never counted; timeouts stop it; four limits, four resources.' },
];
export const slides = lamDeck({ chuong: 'Chapter 7 — Limits: rate, connections, size', bai: '7.3' }, S);
