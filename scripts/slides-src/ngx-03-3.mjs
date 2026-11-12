/**
 * ngx-03-3 — Nginx · Chapter 3 · Lesson 3.3 "Buffering, and what REALLY breaks streaming" (deck video + web, 12/11/2026). Bài web: nginx-3-3-dem-va-luong-chay.
 * Output THẬT (scratchpad/ngx/demo/n3-3.txt; nginx/1.24.0, upstream 4 mẩu × 400 ms, đo thời điểm gói tới tại socket — do.py):
 * trực tiếp ⇒ 4 gói; buffering ON + proxy_http_version 1.0 (mặc định) ⇒ 1 gói lúc 1,62 s; buffering OFF ⇒ 4 gói; proxy_http_version 1.1 + buffering ON ⇒ 4 gói;
 * gzip ON (client xin gzip) + buffering ON ⇒ 1 gói, kể cả với 1.1; gzip ON + buffering OFF ⇒ 4 gói; X-Accel-Buffering: no ⇒ 4 gói dù gzip ON.
 * KHÁC bài web: web nói buffering ON không chặn luồng — chỉ đúng khi upstream nói HTTP/1.1 (chunked); mặc định 1.0 thì CHẶN.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n3-3:file:/root/nho-giot.js": "// upstream nhả 4 mẩu, mỗi mẩu cách nhau 400 ms (cổng 9103); cổng 9104 giống hệt nhưng gửi thêm \"X-Accel-Buffering: no\"\nconst http = require('http');\nconst chay = (xab) => (req, res) => {\n  const h = { 'Content-Type': 'text/plain' }; if (xab) h['X-Accel-Buffering'] = 'no';\n  res.writeHead(200, h);\n  let i = 0; const t = setInterval(() => { i++; res.write(`manh ${i} `.repeat(3) + '\\n'); if (i === 4) { clearInterval(t); res.end(); } }, 400);\n};\nhttp.createServer(chay(false)).listen(9103, '127.0.0.1');\nhttp.createServer(chay(true)).listen(9104, '127.0.0.1');\n",
 "n3-3:file:/root/do.py": "# do.py <cổng> <đường dẫn> [gzip] — đọc THẲNG từ socket, in thời điểm mỗi gói dữ liệu của phần THÂN tới (tính từ lúc gửi request)\nimport socket, sys, time\nport, path = int(sys.argv[1]), sys.argv[2]\nae = 'Accept-Encoding: gzip\\r\\n' if len(sys.argv) > 3 else ''\ns = socket.create_connection(('127.0.0.1', port))\nt0 = time.time(); s.sendall(f'GET {path} HTTP/1.1\\r\\nHost: x\\r\\n{ae}Connection: close\\r\\n\\r\\n'.encode())\nbuf, moc, het_header = b'', [], False\nwhile True:\n    d = s.recv(65536)\n    if not d: break\n    t = time.time() - t0\n    if not het_header:\n        buf += d\n        if b'\\r\\n\\r\\n' in buf:\n            het_header = True\n            than = buf.split(b'\\r\\n\\r\\n', 1)[1]\n            if than: moc.append(t)\n        continue\n    moc.append(t)\nprint('  '.join(f'goi #{i+1} {x:.2f}s' for i, x in enumerate(moc)) + ('' if len(moc) > 1 else '   ... HET. MOT goi duy nhat.'))\n",
 "n3-3:file:/tmp/ng/conf/dem.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  gzip_types text/plain;\n  server { listen 8081; location / { proxy_pass http://127.0.0.1:9103; } }\n  server { listen 8082; location / { proxy_buffering off; proxy_pass http://127.0.0.1:9103; } }\n  server { listen 8083; gzip on; location / { proxy_pass http://127.0.0.1:9103; } location /xab { proxy_pass http://127.0.0.1:9104; } }\n  server { listen 8084; gzip on; location / { proxy_buffering off; proxy_pass http://127.0.0.1:9103; } }\n  server { listen 8085; gzip on; location / { gzip off; proxy_pass http://127.0.0.1:9103; } }\n}\n",
 "n3-3:setup": "",
 "n3-3:sauca": "$ python3 do.py 9103 / gzip\ngoi #1 0.41s  goi #2 0.81s  goi #3 1.22s  goi #4 1.62s\n$ python3 do.py 8081 / gzip\ngoi #1 1.62s   ... HET. MOT goi duy nhat.\n$ python3 do.py 8082 / gzip\ngoi #1 0.41s  goi #2 0.82s  goi #3 1.23s  goi #4 1.63s  goi #5 1.63s\n$ python3 do.py 8083 / gzip\ngoi #1 1.62s   ... HET. MOT goi duy nhat.\n$ python3 do.py 8084 / gzip\ngoi #1 0.40s  goi #2 0.81s  goi #3 1.21s  goi #4 1.61s  goi #5 1.61s\n$ python3 do.py 8085 / gzip\ngoi #1 1.62s   ... HET. MOT goi duy nhat.",
 "n3-3:xab": "$ python3 do.py 8083 /xab gzip\ngoi #1 0.40s  goi #2 0.81s  goi #3 1.21s  goi #4 1.61s  goi #5 1.61s\n$ python3 do.py 8083 / gzip\ngoi #1 1.62s   ... HET. MOT goi duy nhat.",
 "n3-3:khonggzip": "$ python3 do.py 8083 /\ngoi #1 1.62s   ... HET. MOT goi duy nhat.",
 "n3-3:file:/tmp/ng/conf/dem11.conf": "pid       /tmp/ng/logs/dem11.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server { listen 8086; location / { proxy_http_version 1.1; proxy_pass http://127.0.0.1:9103; } }\n  server { listen 8087; gzip on; gzip_types text/plain; location / { proxy_http_version 1.1; proxy_pass http://127.0.0.1:9103; } }\n}\n",
 "n3-3:http11": "$ python3 do.py 8086 /\ngoi #1 0.41s  goi #2 0.81s  goi #3 1.21s  goi #4 1.61s\n$ python3 do.py 8087 / gzip\ngoi #1 1.62s   ... HET. MOT goi duy nhat."
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, js, icards, cmp, box, two, steps, kw, c, tbl } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-03-3', code: 'NGX 3.3', title: 'Buffering, and what REALLY breaks streaming', sub: 'Chapter 3 · Lesson 3.3' };
const O = (k) => { const v = DU_LIEU[`n3-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.replace(/goi #(\d) /g, '#$1 ').replace(/   \.\.\. HET\. MOT goi duy nhat\./g, '  ← ONE packet');

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.3', t: 'Buffering,<br>and what REALLY breaks streaming', sub: '"Turn off proxy_buffering" is repeated so often nobody measures it. Here is the measurement — packet times at the socket',
    en: 'Lesson 3.3. Every server-sent-events tutorial behind Nginx says: turn off proxy_buffering. We measure it instead, with packet arrival times at the socket.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A stream measured at the socket — direct and through eight configurations</li>
    <li>When proxy_buffering holds a stream — and when it does not</li>
    <li>gzip: the other thing that swallows a stream</li>
    <li>X-Accel-Buffering: no — the app fixes ONE response itself</li>
    <li>Why you should not switch buffering off globally</li></ul>`,
    en: 'Five takeaways: the measurement; when buffering holds a stream; gzip as the other culprit; the per-response header; and why not to disable buffering globally.' },
  { t: 'The measurement setup', body: tn(O('sauca').split('\n').slice(0, 2).join('\n'), { fs: 15 }) + cmp(['Port', 'Server block in dem.conf', 'What differs'], [
      ['8081', '<code>proxy_pass</code> only', 'nothing — the defaults'],
      ['8082', '+ <code>proxy_buffering off</code>', 'buffering'],
      ['8083', '<code>gzip on</code> + <code>proxy_pass</code> (and <code>/xab</code> → 9104)', 'compression'],
      ['8084', '<code>gzip on</code> + <code>proxy_buffering off</code>', 'both'],
      ['8085', '<code>gzip on</code>, then <code>gzip off</code> in the location', 'compression switched back off'],
    ]) +
    box('do.py reads the raw socket', 'It sends the request and prints the time each data packet of the BODY arrives — a stream is "4 packets 400 ms apart"; a held response is "one packet at the end".', 'lam'),
    en: 'The upstream writes four chunks 400 milliseconds apart. Five Nginx servers differ only in buffering and gzip. A small Python script reads the raw socket and prints when each body packet arrives.' },
  { t: 'Six configurations, timed at the socket', body: tbl(['Path', 'Packets arrive at'], [
      ['direct to the upstream', bo(O('sauca').split('\n')[1])],
      ['proxy, buffering ON (HTTP/1.0 upstream — default)', bo(O('sauca').split('\n')[3])],
      ['proxy, buffering OFF', bo(O('sauca').split('\n')[5])],
      ['gzip ON + buffering ON', bo(O('sauca').split('\n')[7])],
      ['gzip ON + buffering OFF', bo(O('sauca').split('\n')[9])],
      ['gzip OFF in the location, buffering ON', bo(O('sauca').split('\n')[11])],
    ], { hl: [1, 3, 5] }),
    en: 'Six rows. Direct: four packets. Through a default proxy with buffering on: one packet at 1.62 seconds — the stream is held. Buffering off: four packets. gzip on with buffering on: one packet. gzip on with buffering off: four. gzip off but buffering on: one again.' },
  { t: 'The detail nobody mentions: the upstream protocol', body: tn(bo(O('http11')), { fs: 17 }) + two(
      box('HTTP/1.1 upstream + buffering ON ⇒ it streams', 'With <code>proxy_http_version 1.1</code> the upstream sends chunked data and Nginx passes each chunk on as it arrives — four packets.', 'xanh'),
      box('…until gzip is involved', 'Same 1.1 upstream, client asks for gzip: one packet at the end. gzip collects data to compress it.', 'do2')),
    en: 'The detail nobody mentions: with the default HTTP/1.0 upstream, buffering holds the stream; with proxy_http_version 1.1 and chunked data, buffering on still streamed — four packets. But add gzip and it is one packet again.' },
  { t: 'What actually holds a stream', body: cmp(['Upstream protocol', 'gzip for this response', 'proxy_buffering on', 'proxy_buffering off'], [
      ['HTTP/1.0 (default)', 'no', '<b>held</b> — one packet', 'streams'],
      ['HTTP/1.1 (chunked)', 'no', 'streams', 'streams'],
      ['HTTP/1.1', '<b>yes</b>', '<b>held</b> — one packet', 'streams'],
    ]) + box('The folklore is half right', 'Many guides say buffering never blocks a stream. Measured on 1.24 that is true only with an HTTP/1.1 upstream; with the default 1.0 it does block. gzip blocks either way unless buffering is off.', 'do2'),
    en: 'The table: with the default HTTP/1.0 upstream, buffering on holds the stream. With HTTP/1.1, it streams — unless gzip is applied to the response. Buffering off streams in every case. The common claim that buffering never blocks is only half right.' },
  { t: 'Fix it per response: X-Accel-Buffering: no', body: tn(bo(O('xab')), { fs: 17 }) +
    box('The app decides for ONE response', 'The upstream sends <code>X-Accel-Buffering: no</code> on the streaming route only. Nginx streams it — gzip still on, no config line changed — while every other response keeps the benefits of buffering.', 'xanh'),
    en: 'The cleanest fix: the application sends X-Accel-Buffering: no on just the streaming responses. Measured with gzip still on: four packets for /xab, one packet for the normal route. No configuration change.' },
  { t: 'What proxy_buffering is FOR', body: icards([
      ['bolt', 'Frees the upstream fast', 'Nginx reads the whole response at backend speed, then trickles it to a slow phone — your app process is free again.'],
      ['shield', 'Protects against slow clients', 'Thousands of slow downloads hold cheap Nginx buffers, not expensive app workers.'],
      ['warn', 'Global off = all of that lost', 'One streaming endpoint is ONE route; turn buffering off in that location, or send the header — not in http{}.'],
    ], 3) + ngc(`location /su-kien/ {          # the one streaming route
  proxy_buffering off;         # or let the app send X-Accel-Buffering: no
  proxy_http_version 1.1;
  proxy_pass http://app;
}`, { sm: true }),
    en: 'What buffering is for: Nginx reads the whole response at backend speed and then serves slow clients itself, so your application is freed quickly. Turning it off globally loses that for every response; scope it to the one streaming route.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('proxy_buffering', 'read the upstream response into Nginx buffers'),
      kw('Streaming / SSE', 'data sent in pieces as it is produced'),
      kw('chunked', 'HTTP/1.1 body in pieces — needs proxy_http_version 1.1'),
      kw('gzip', 'collects data to compress it ⇒ can hold a stream'),
      kw('X-Accel-Buffering: no', 'per-response switch sent by the upstream'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: proxy_buffering, streaming and server-sent events, chunked transfer, gzip, and the X-Accel-Buffering header.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Run the 4-chunk upstream and ${c('do.py')}`,
      `Time it direct, buffering on/off, with and without ${c('proxy_http_version 1.1')}`,
      `Ask for gzip; watch the stream collapse`,
      `Send ${c('X-Accel-Buffering: no')} from the app`,
    ]), box('Keep these', `<ul><li>Measure at the socket</li><li>1.0 upstream + buffering ⇒ held</li><li>gzip holds unless buffering off</li><li>Fix per route, not globally</li></ul>`, 'lam'), ''),
    en: 'Your turn: measure the stream in each configuration, add gzip, and fix it with the per-response header. Keep: measure, do not repeat folklore.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — Reverse proxy', bai: '3.3' }, S);
