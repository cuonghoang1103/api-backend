/**
 * ngx-03-4 — Nginx · Chapter 3 · Lesson 3.4 "Timeouts: what each one measures, and the 200 that lies" (deck video + web, 12/11/2026). Bài web: nginx-3-4-timeout.
 * Output THẬT (scratchpad/ngx/demo/n3-4.txt; nginx/1.24.0): im lặng ⇒ 504 sau 2 s; cổng không ai nghe ⇒ 502 ngay (connect timeout không dùng tới);
 * 4 mẩu × 400 ms, read_timeout 1 s ⇒ 200 đủ 88 byte; 1 mẩu rồi im 5 s, read_timeout 1 s ⇒ 200 sau 1 s, 0 byte; mặc định 60 s ⇒ 200 sau 5 s, 24 byte.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n3-4:file:/root/cham.js": "// ba upstream \"khó tính\" để đo timeout:\n//  9103 — nhả 4 mẩu, mỗi mẩu cách 400 ms (tổng 1,6 s)\n//  9105 — nhận kết nối nhưng KHÔNG BAO GIỜ trả lời\n//  9106 — nhả 1 mẩu rồi IM 5 giây, rồi mẩu cuối\nconst http = require('http');\nhttp.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/plain' }); let i = 0; const t = setInterval(() => { i++; res.write(`manh ${i} `.repeat(3) + '\\n'); if (i === 4) { clearInterval(t); res.end(); } }, 400); }).listen(9103, '127.0.0.1');\nhttp.createServer(() => {}).listen(9105, '127.0.0.1');\nhttp.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/plain' }); res.write('manh dau tien\\n'); setTimeout(() => res.end('manh cuoi\\n'), 5000); }).listen(9106, '127.0.0.1');\n",
 "n3-4:file:/tmp/ng/conf/to.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8080;\n    location /im-lang/      { proxy_read_timeout 2s;    proxy_pass http://127.0.0.1:9105/; }\n    location /khong-ai/     { proxy_connect_timeout 2s; proxy_pass http://127.0.0.1:9999/; }\n    location /nho-giot/     { proxy_read_timeout 1s;    proxy_pass http://127.0.0.1:9103/; }\n    location /im-giua/      { proxy_read_timeout 1s;    proxy_pass http://127.0.0.1:9106/; }\n    location /im-giua-60/   {                           proxy_pass http://127.0.0.1:9106/; }\n  }\n}\n",
 "n3-4:file:/root/do-to.sh": "for p in \"$@\"; do\n  r=$(curl -s -o /dev/null -w '%{http_code} sau %{time_total}s, nhan %{size_download} byte' \"http://127.0.0.1:8080$p\")\n  printf '%-14s -> %s\\n' \"$p\" \"$r\"\ndone\n",
 "n3-4:setup": "",
 "n3-4:nam": "$ bash do-to.sh /im-lang/ /khong-ai/ /nho-giot/ /im-giua/ /im-giua-60/\n/im-lang/      -> 504 sau 2.006859s, nhan 176 byte\n/khong-ai/     -> 502 sau 0.000291s, nhan 166 byte\n/nho-giot/     -> 200 sau 1.621668s, nhan 88 byte\n/im-giua/      -> 200 sau 1.005448s, nhan 0 byte\n/im-giua-60/   -> 200 sau 5.006176s, nhan 24 byte\n$ grep -oE '(upstream timed out|connect\\(\\) failed)[^,]*' /tmp/ng/logs/error.log\nupstream timed out (110: Connection timed out) while reading response header from upstream\nconnect() failed (111: Connection refused) while connecting to upstream\nupstream timed out (110: Connection timed out) while reading upstream",
 "n3-4:tieude": "$ curl -s -D - -o /dev/null http://127.0.0.1:8080/im-giua/ | head -n 4\nHTTP/1.1 200 OK\nServer: nginx/1.24.0 (Ubuntu)\nDate: Thu, 12 Nov 2026 12:50:51 GMT\nContent-Type: text/plain"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, seq, icards, cmp, box, two, steps, kw, c } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-03-4', code: 'NGX 3.4', title: 'Timeouts: what each one measures, and the 200 that lies', sub: 'Chapter 3 · Lesson 3.4' };
const O = (k) => { const v = DU_LIEU[`n3-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const CONF = () => O('file:/tmp/ng/conf/to.conf').split('\n').filter((l) => /location/.test(l)).map((l) => l.trim().replace(/\s+/g, ' ')).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.4', t: 'Timeouts: what each one measures,<br>and the 200 that lies', sub: 'They look like one knob with several names. They are not: each measures a different gap, and one of them reports SUCCESS with an empty body',
    en: 'Lesson 3.4. The timeout directives look like one knob with several names. Each measures a different gap, two give different status codes for what feels like the same failure, and one gives a 200 with an empty body.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Five failure shapes, timed for real</li>
    <li>connect, send and read — three different gaps</li>
    <li>502 vs 504, and why the error log matters more than the code</li>
    <li>The 200 with zero bytes</li>
    <li>How to choose the numbers</li></ul>`,
    en: 'Five takeaways: five failures timed; the three gaps; 502 versus 504; the empty 200; and choosing values.' },
  { t: 'Five failure shapes, measured', body: ngc(CONF(), { sm: true }) + tn(O('nam').replace(/http:\/\/127\.0\.0\.1:8080/g, ''), { fs: 14 }),
    en: 'Five locations. An upstream that never answers: 504 after two seconds. A port nobody listens on: 502 immediately. Four chunks over 1.6 seconds with a one-second read timeout: 200, complete. One chunk then five seconds of silence: 200 after one second with zero bytes. Same with the default sixty seconds: 200 after five seconds, 24 bytes.' },
  { t: 'Three timers, three different gaps', body: seq(['nginx', 'upstream'], [
      [0, 1, 'connect …  ⏱ proxy_connect_timeout (handshake only)', '#2563eb'],
      [0, 1, 'send request …  ⏱ proxy_send_timeout (between two writes)', '#7c3aed'],
      [1, 0, 'response header …  ⏱ proxy_read_timeout (between two reads)', '#c0392b'],
      [1, 0, 'body chunk …  ⏱ read timer RESETS', '#c0392b'],
      [1, 0, 'body chunk …  ⏱ read timer RESETS', '#c0392b']], { w: 1110, rh: 54, fs: 18 }) +
    box('proxy_read_timeout is the gap BETWEEN reads, not the total', 'That is why 1.6 s of trickling passed a 1 s timeout: no single gap was longer than 400 ms.', 'lam'),
    en: 'Three timers measure three gaps: connect only covers the TCP handshake, send the gap between two writes, and read the gap between two reads. The read timer resets with every chunk, which is why 1.6 seconds of trickling passed a one-second timeout.' },
  { t: '502 vs 504 — read the error log, not the code', body: tn(O('nam').split('\n').slice(-4).join('\n'), { fs: 16 }) + cmp(['Code', 'error.log says', 'Meaning'], [
      ['<b>504</b>', 'upstream timed out (110) while reading response header', 'connected, but the app did not answer in time'],
      ['<b>502</b>', 'connect() failed (111: Connection refused)', 'nothing listening — refused instantly, the timeout never ran'],
      ['<b>200</b>, short body', 'upstream timed out (110) while reading upstream', 'died mid-body — the next row'],
    ]),
    en: 'Read the error log, not the status. 504 with "while reading response header": the app did not answer in time. 502 with "connection refused": nothing was listening and the connect timeout never even ran. And a timeout "while reading upstream" hides behind a 200.' },
  { t: 'Trap: the 200 that lies', body: tn(O('tieude'), { fs: 16 }) + two(
      box('Headers were already sent', 'Nginx had sent <code>200 OK</code> and started the body when the upstream went silent. When the read timer fires there is no way back: the connection just ends — 0 bytes, status 200.', 'do2'),
      box('Every layer above calls it SUCCESS', 'Access log, load balancer, monitoring: 200. Only error.log says "timed out while reading upstream". Alert on that line.', 'lam')),
    en: 'The trap: the response headers, 200 OK, were already sent before the silence. When the read timer fires, Nginx can only close the connection. The client got 200 and zero bytes, and every layer above calls it success — only the error log tells the truth.' },
  { t: 'Choosing the numbers', body: ngc(`http {
  proxy_connect_timeout 5s;    # a LAN handshake takes ms; long = a dead host
  proxy_send_timeout    30s;
  proxy_read_timeout    60s;   # the slowest NORMAL gap of your app, plus margin
}
location /su-kien/ {           # streaming endpoint: a deliberate exception
  proxy_read_timeout 1h;
  proxy_pass http://app;
}`, { sm: true, hl: [4, 7] }) + icards([
      ['clock', 'Short connect', 'A dead backend fails fast, so the next one can be tried (Chapter 9).'],
      ['gauge', 'Read = slowest normal gap', 'Measure your p99 gap; do not copy 600 s from a blog.'],
      ['warn', 'Exceptions per route', 'Long reads only where the app really streams or waits.'],
    ], 3),
    en: 'Choosing values: a short connect timeout so dead hosts fail fast; a read timeout equal to the slowest normal gap of your app plus margin; and long reads only as deliberate per-route exceptions such as a streaming endpoint.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('proxy_connect_timeout', 'TCP handshake to the upstream'),
      kw('proxy_send_timeout', 'gap between two writes to the upstream'),
      kw('proxy_read_timeout', 'gap between two reads — resets per chunk'),
      kw('502 Bad Gateway', 'could not talk to the upstream'),
      kw('504 Gateway Timeout', 'upstream too slow to answer'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the three proxy timeouts, 502 Bad Gateway and 504 Gateway Timeout.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build the three slow upstreams`,
      `Reproduce 504, 502, the trickle and the empty 200`,
      `Read each line in ${c('error.log')}`,
      `Set values from YOUR app's slowest normal gap`,
      `Log ${c('$upstream_response_time')} for a day before choosing`,
    ]), box('Keep these', `<ul><li>Each timer is a GAP</li><li>Error log names the phase</li><li>A 200 can be empty</li><li>Long timeouts only per route</li></ul>`, 'lam'), ''),
    en: 'Your turn: reproduce all five failures and read the error log lines. Keep: each timeout is a gap, and the error log names the phase.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — Reverse proxy', bai: '3.4' }, S);
