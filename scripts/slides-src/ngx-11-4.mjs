/**
 * ngx-11-4 — Nginx · Chapter 11 · Lesson 11.4 "From a status code to the cause" (deck video + web, 13/11/2026).
 * Bài web: nginx-11-4-tu-ma-trang-thai-toi-nguyen-nhan. Output THẬT (scratchpad/ngx/demo/n11-4.txt; nginx/1.24.0): 7 request ⇒ 200 404 403 200 502 502 404 + 5 dòng error log ·
 * header 12.142 byte: /up/ ⇒ 502 "upstream sent too big header", /up32/ (proxy_buffer_size 32k) ⇒ 200 · worker = nobody; tệp 600 ⇒ 403, thư mục thiếu x ⇒ 403,
 * CÙNG một dòng (13: Permission denied); namei -l chỉ ra "drw-r--r-- kin" · proxy_read_timeout 1s + backend 3 s ⇒ 504 sau 1,0 s, "(110) while reading response header";
 * client bỏ cuộc sau 0,5 s ⇒ access log 499.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n11-4:file:/root/up.js": "// up.js — backend cổng 9610 khoẻ mạnh: /binh-thuong nhỏ; /header-to trả 200 với một header 12 KB (cookie to); /cham ngủ 3 s\nrequire('http').createServer((q, r) => {\n  if (q.url.startsWith('/header-to')) { r.setHeader('Set-Cookie', 'phien=' + 'x'.repeat(12000)); return r.end('ok\\n'); }\n  if (q.url.startsWith('/cham')) return setTimeout(() => r.end('cham\\n'), 3000);\n  r.end('ok binh thuong\\n');\n}).listen(9610, '127.0.0.1');\n",
 "n11-4:file:/tmp/ng/conf/f.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log /tmp/ng/logs/access.log;\n  server {\n    listen 8080;\n    root /tmp/ng/web;\n    location /tep/  { alias /tmp/ng/web/; }\n    location /up/   { proxy_read_timeout 1s; proxy_pass http://127.0.0.1:9610/; }\n    location /up32/ { proxy_buffer_size 32k; proxy_buffers 8 32k; proxy_busy_buffers_size 64k; proxy_pass http://127.0.0.1:9610/; }\n    location /chet/ { proxy_pass http://127.0.0.1:9999/; }\n  }\n}\n",
 "n11-4:file:/root/bay.sh": "# bay.sh — bảy request vào cùng một máy chủ, in mã; rồi phần thông báo của error log (bỏ ngày giờ/pid/client)\nfor p in /tep/cong-khai.txt /tep/khong-co.txt /tep/kin/kho.txt /up/binh-thuong /up/header-to /chet/x /khong-co-location-nao; do\n  printf '  %-26s -> %s\\n' $p $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080$p)\ndone\necho '--- error log ---'\nsed -E 's/^.*\\*[0-9]+ //; s/, client.*//' /tmp/ng/logs/error.log\n",
 "n11-4:setup": "",
 "n11-4:bay": "$ bash bay.sh\n  /tep/cong-khai.txt         -> 200\n  /tep/khong-co.txt          -> 404\n  /tep/kin/kho.txt           -> 403\n  /up/binh-thuong            -> 200\n  /up/header-to              -> 502\n  /chet/x                    -> 502\n  /khong-co-location-nao     -> 404\n--- error log ---\nopen() \"/tmp/ng/web/khong-co.txt\" failed (2: No such file or directory)\nopen() \"/tmp/ng/web/kin/kho.txt\" failed (13: Permission denied)\nupstream sent too big header while reading response header from upstream\nconnect() failed (111: Connection refused) while connecting to upstream\nopen() \"/tmp/ng/web/khong-co-location-nao\" failed (2: No such file or directory)",
 "n11-4:header": "$ curl -s -D- -o /dev/null http://127.0.0.1:9610/header-to | wc -c      # backend thật sự gửi bao nhiêu byte header\n12142\n$ for p in /up/header-to /up32/header-to; do printf '%-18s -> %s\\n' $p $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080$p); done\n/up/header-to      -> 502\n/up32/header-to    -> 200",
 "n11-4:quyen": "$ ps -o user= -p $(pgrep -f 'nginx: worker' | head -1)        # worker chạy dưới người dùng nào\nnobody\n$ ls -l /tmp/ng/web/kin/kho.txt; curl -s -o /dev/null -w '/tep/kin/kho.txt -> %{http_code}\\n' http://127.0.0.1:8080/tep/kin/kho.txt     # TỆP mất quyền đọc\n-rw------- 1 root root 7 Nov 13 01:50 /tmp/ng/web/kin/kho.txt\n/tep/kin/kho.txt -> 403\n$ chmod 644 /tmp/ng/web/kin/kho.txt; chmod 644 /tmp/ng/web/kin; ls -ld /tmp/ng/web/kin; curl -s -o /dev/null -w '/tep/kin/kho.txt -> %{http_code}\\n' http://127.0.0.1:8080/tep/kin/kho.txt     # THƯ MỤC mất quyền x\ndrw-r--r-- 2 root root 4096 Nov 13 01:50 /tmp/ng/web/kin\n/tep/kin/kho.txt -> 403\n$ sed -E 's/^.*\\*[0-9]+ //; s/, client.*//' /tmp/ng/logs/error.log\nopen() \"/tmp/ng/web/kin/kho.txt\" failed (13: Permission denied)\nopen() \"/tmp/ng/web/kin/kho.txt\" failed (13: Permission denied)\n$ namei -l /tmp/ng/web/kin/kho.txt\nf: /tmp/ng/web/kin/kho.txt\ndrwxr-xr-x root root /\ndrwxrwxrwt root root tmp\ndrwxr-xr-x root root ng\ndrwxr-xr-x root root web\ndrw-r--r-- root root kin\n-rw-r--r-- root root kho.txt",
 "n11-4:timeout": "$ curl -s -o /dev/null -w '/up/cham -> %{http_code}  (%{time_total} s)\\n' http://127.0.0.1:8080/up/cham\n/up/cham -> 504  (1.002754 s)\n$ sed -E 's/^.*\\*[0-9]+ //; s/, client.*//' /tmp/ng/logs/error.log\nupstream timed out (110: Connection timed out) while reading response header from upstream\n$ curl -s -o /dev/null --max-time 0.5 http://127.0.0.1:8080/up/cham; sleep 1.2; tail -1 /tmp/ng/logs/access.log | awk '{print \"access log:\", $7, \"->\", $9}'    # client bỏ cuộc trước\naccess log: /up/cham -> 499"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, tiers, vsd } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-11-4', code: 'NGX 11.4', title: 'From a status code to the cause', sub: 'Chapter 11 · Lesson 11.4' };
const O = (k) => { const v = DU_LIEU[`n11-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };

/** Hình: một mã ⇒ nhiều nguyên nhân; dòng error log tách chúng. */
function maNhanh() {
  const W = 1110, H = 250;
  const nhom = [['404', '#2563eb', ['file missing under a location', 'no location matched → server root']], ['502', '#c0392b', ['backend down (111)', 'header too big — backend healthy']], ['403', '#b85a2b', ['file not readable', 'a directory without x']]];
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  nhom.forEach(([ma, m, ds], k) => {
    const x = 8 + k * 370;
    s += `<rect x="${x}" y="6" width="350" height="${H - 12}" rx="16" fill="${m}10" stroke="${m}" stroke-width="3"/>`;
    s += `<text x="${x + 175}" y="62" text-anchor="middle" font-size="46" font-weight="900" fill="${m}">${ma}</text>`;
    ds.forEach((t, i) => {
      s += `<line x1="${x + 175}" y1="76" x2="${x + 90 + i * 170}" y2="120" stroke="${m}" stroke-width="2.5"/><rect x="${x + 12 + i * 170}" y="122" width="156" height="104" rx="10" fill="#fff" stroke="${m}" stroke-width="2"/>`;
      const dong = []; t.split(' ').forEach((q) => { if (dong.length && (dong[dong.length - 1] + ' ' + q).length <= 16) dong[dong.length - 1] += ' ' + q; else dong.push(q); });
      dong.slice(0, 4).forEach((ln, r) => { s += `<text x="${x + 90 + i * 170}" y="${148 + r * 22}" text-anchor="middle" font-size="17" font-weight="700" fill="#262626">${ln}</text>`; });
    });
  });
  return s + '</svg>';
}

export const S = [
  { cover: true, nhan: 'Chapter 11 · Lesson 11.4', t: 'From a status code<br>to the cause', sub: 'A status code narrows it to a family — the error log line names the culprit',
    en: 'Lesson 11.4. A status code narrows a problem to a family. It never names the incident, because unrelated failures share one code. The error log line is what separates them — and one of the cases here is a five oh two produced by a perfectly healthy backend.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Seven requests, one server: the codes and the five log lines</li>
    <li>The 502 that is NOT the backend's fault</li>
    <li>Two identical 404s — the resolved path tells them apart</li>
    <li>A 403 that hides which permission is missing — <code>namei -l</code></li>
    <li>502 vs 504 vs 499, and a ladder to walk in order</li></ul>`,
    en: 'Five takeaways: seven requests and five log lines; the five oh two that is not the backend\'s fault; two identical four oh fours; a four oh three that hides which permission is missing; and five oh two against five oh four against four ninety nine, with a ladder to walk.' },
  { t: 'Seven requests into one server', body: tn(O('bay'), { fs: 16, wrap: 93 }) + box('Two 404s · two 502s · one 403 — five log lines tell them apart', 'The code names a FAMILY; the error log line names the culprit.', 'lam'),
    en: 'Seven requests into one server. Two four oh fours with two different causes and the same message; two five oh twos with completely different causes; and a four oh three whose message does not say which of two things broke. One by one.' },
  { t: 'The 502 that is not the backend\'s fault', body: tn(O('header'), { fs: 16, wrap: 93 }) + two(ngc(`location /up/ {
  proxy_buffer_size   32k;  # response HEADERS only
  proxy_buffers     8 32k;  # the BODY
  proxy_busy_buffers_size 64k;
  proxy_pass http://127.0.0.1:9610/;
}`, { sm: true, hl: [2] }), box('upstream sent too big header', 'The backend answered 200 with valid HTTP — a 12 KB Set-Cookie. Nginx reads response headers into ONE fixed buffer (4 or 8 KB); if they do not fit, it gives up: 502. Works in development with a small session cookie, breaks in production.', 'do2'), ''),
    en: 'The five oh two that is not the backend\'s fault. The backend is healthy and answered two hundred, with twelve kilobytes of headers — a big cookie. Nginx reads response headers into one fixed buffer of four or eight kilobytes; if they do not fit, it returns five oh two with upstream sent too big header. Look only at the code and you restart a backend that never failed. The fix: size proxy buffer size for the largest header you really send — measured, thirty two k gives two hundred.' },
  { t: 'Two 404s that look identical', body: cmp(['Resolved path in the error line', 'What it means', 'Look at'], [
      ['/tmp/ng/web/khong-co.txt', 'a location matched; the FILE is missing', 'the deploy: is the file there, root vs alias (Chapter 4)'],
      ['/tmp/ng/web/khong-co-location-nao', 'a ROUTE served as a file: NO location matched', 'the router: a route never mounted, or a stale build'],
    ]) + box('This is exactly the distinction behind deploy.sh\'s smoke test', 'An unauthenticated GET that returns 401 or 200 proves the route is mounted; 404 means it is not. The resolved path in the error log tells you which 404 you have.', 'lam'),
    en: 'Two four oh fours, same code, same kind of message. The resolved path is the only thing that tells them apart. A path under your document root with a real file name: a location matched and the file is missing — check the deploy. A path that looks like a route: no location took it, and Nginx is trying to serve an API path as a file — the problem is routing, not the filesystem.' },
  { t: 'The 403 that does not say which permission', body: tn(O('quyen'), { fs: 13, wrap: 115 }) + box('Same line, byte for byte — namei -l shows the guilty component', 'The worker (nobody) needs READ on the file and EXECUTE on every directory: drw-r--r-- on kin/ breaks it.', 'do2'),
    en: 'The four oh three. Thirteen, permission denied, has two different causes and Nginx prints the same line for both. Measured: the file without read permission — four oh three; the file readable but its directory without x — four oh three, identical line. namei dash l lists every component with its permissions, and the guilty one, drw r r on kin, shows at a glance. Pair it with the worker\'s user: nobody.' },
  { t: '502 vs 504 vs 499 — and 413 / 400', body: tn(O('timeout'), { fs: 17, wrap: 88 }) + cmp(['Code', 'What happened', 'The log says'], [
      ['502', 'nginx did not get a usable response', 'refused (111), reset, DNS, too big header'],
      ['504', 'nginx waited and gave up', 'timed out (110) — while connecting = network · while reading header = slow app'],
      ['499', 'the CLIENT gave up first', 'access log only — a latency alarm dressed as an error'],
      ['413 / 400', 'refused before any of that', 'client_max_body_size (Ch. 7) · oversized request headers'],
    ], { hl: [2] }),
    en: 'Five oh two: Nginx got no usable response. Five oh four: it waited and gave up — measured, proxy read timeout of one second against a three second backend, five oh four after one second, timed out while reading response header. Four ninety nine: the client gave up first — a client with half a second patience leaves four ninety nine in the access log. Rising four ninety nines are a latency alarm, invisible if you only alert on five hundreds.' },
  { t: 'The ladder — in order, each step rules out the rest', body: tiers([
      ['power', '1 · Does nginx answer at all?', 'curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/ on the box', '#64748b'],
      ['map', '2 · Which block handled it?', 'the X-Kh header of 11.1', '#7c3aed'],
      ['list', '3 · What does the error log say?', 'grep the *N of that request (10.4) — the resolved path, the errno', '#c0392b'],
      ['server', '4 · Is it the backend?', 'curl the upstream directly, bypassing nginx', '#2563eb'],
      ['eye', '5 · Is it the config you think?', 'nginx -T, file list, master start time (11.2, 11.3)', '#009639'],
    ], { th: 64, gap: 18 }),
    en: 'The ladder, in order, because each step rules out everything below it. One: does Nginx answer at all, curl on the box itself. Two: which block handled it — the header from 11.1. Three: what does the error log say for that request. Four: is it the backend — curl the upstream directly. Five: is the running config the one you think.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('too big header', '502 from a healthy backend'),
      kw('proxy_buffer_size', 'response headers only'),
      kw('resolved path', 'which 404'),
      kw('namei -l', 'which permission'),
      kw('504', 'a timeout — which one'),
      kw('499', 'the client left first'),
    ].join('')}</div>` + maNhanh(), to: true,
    en: 'Key terms: too big header, proxy buffer size, the resolved path, namei dash l, five oh four, and four ninety nine.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Seven routes on one server — record the code AND the log line',
      `A 12 KB header — 502, then fix with ${c('proxy_buffer_size 32k')}`,
      `Break the file, then the directory — ${c('namei -l')}`,
      'A slow backend: 504 with a timeout, 499 with an impatient client',
    ]), box('Keep these', `<ul><li>a code is a family, the log line is the cause</li><li>502 ≠ backend dead</li><li>the resolved path splits the 404s</li><li>499 is a latency alarm</li></ul>`, 'lam'), ''),
    en: 'Your turn: seven routes, recording code and log line; a twelve kilobyte header, then the buffer fix; break the file, then the directory, and read namei; a slow backend for five oh four and an impatient client for four ninety nine. Keep: a code is a family, the log line is the cause; five oh two does not mean the backend is dead; the resolved path splits the four oh fours; four ninety nine is a latency alarm.' },
];
export const slides = lamDeck({ chuong: 'Chapter 11 — Diagnosis: making Nginx tell you what it did', bai: '11.4' }, S);
