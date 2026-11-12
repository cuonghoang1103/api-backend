/**
 * ngx-07-5 — Nginx · Chapter 7 · Lesson 7.5 "One defensive layer, assembled and measured" (deck video + web, 13/11/2026).
 * Bài web: nginx-7-5-lop-phong-thu. Output THẬT (scratchpad/ngx/demo/n7-5.txt; nginx/1.24.0; upstream Node đọc hết thân rồi trả 200):
 * /api/ 50 request CÙNG LÚC ⇒ 28×200 22×429 (16 dòng log "limiting connections by zone "ket"" — limit_conn 20 cắt); 50 LẦN LƯỢT ⇒ 44×200 6×429.
 * /api/dang-nhap 8 ⇒ 4×200 4×429 + Retry-After: 6 · /tai-len/ 2MB ⇒ 200 · 60MB ⇒ 413 gửi 0 byte · /api/ 2MB ⇒ 413.
 * Chung vùng (cổng 8081): 45 request /api/ rồi tải lên 2MB ⇒ 429, log "excess: 40.440 by zone "chung""; nghỉ 3 s ⇒ 200; vùng riêng (8080) ⇒ 200.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n7-5:file:/root/api.js": "// upstream \"api\" (cổng 9501): đọc hết thân rồi trả 200\nrequire('http').createServer((req, res) => { req.on('data', () => {}); req.on('end', () => res.end('ok\\n')); }).listen(9501, '127.0.0.1');\n",
 "n7-5:file:/tmp/ng/conf/lop.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  upstream api { server 127.0.0.1:9501; }\n  set_real_ip_from 10.0.0.0/8;          # CHỈ proxy của bạn (ở lab: không ai ⇒ $remote_addr giữ nguyên)\n  real_ip_header    X-Forwarded-For;\n  real_ip_recursive on;\n  limit_req_zone  $binary_remote_addr zone=chung:10m  rate=20r/s;\n  limit_req_zone  $binary_remote_addr zone=login:10m  rate=10r/m;\n  limit_req_zone  $binary_remote_addr zone=upload:10m rate=2r/s;\n  limit_conn_zone $binary_remote_addr zone=ket:10m;\n  limit_req_status  429;\n  limit_conn_status 429;\n  client_header_timeout 10s;\n  client_body_timeout   10s;\n  send_timeout          10s;\n  keepalive_timeout     30s;\n  client_max_body_size 1m;\n  client_body_temp_path /tmp/ng/body;\n  server {                                   # 8080: ĐÚNG — mỗi mục đích một vùng\n    listen 8080;\n    limit_conn ket 20;\n    location /api/dang-nhap { limit_req zone=login burst=3 nodelay; add_header Retry-After 6 always; proxy_pass http://api; }\n    location /api/          { limit_req zone=chung burst=40 nodelay; proxy_pass http://api; }\n    location /tai-len/      { limit_req zone=upload burst=5; limit_conn ket 2; client_max_body_size 50m; proxy_pass http://api; }\n  }\n  server {                                   # 8081: SAI — tải lên dùng CHUNG vùng với /api/\n    listen 8081;\n    location /api/          { limit_req zone=chung burst=40 nodelay; proxy_pass http://api; }\n    location /tai-len/      { limit_req zone=chung burst=40 nodelay; client_max_body_size 50m; proxy_pass http://api; }\n  }\n}\n",
 "n7-5:setup": "",
 "n7-5:dotuyen": "$ printf '/api/ ban 50 request CUNG LUC      -> '; for i in $(seq 50); do curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/api/x & done | sort | uniq -c | awk '{printf \"%s: %s   \", $2, $1}'; echo\n/api/ ban 50 request CUNG LUC      -> 200: 28   429: 22   \n$ grep -c 'limiting connections by zone \"ket\"' /tmp/ng/logs/error.log | sed 's/^/  ^ tu choi boi limit_conn ket 20: /'; sleep 3\n  ^ tu choi boi limit_conn ket 20: 16\n$ printf '/api/ ban 50 request LAN LUOT     -> '; for i in $(seq 50); do curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/api/x; done | sort | uniq -c | awk '{printf \"%s: %s   \", $2, $1}'; echo; sleep 3\n/api/ ban 50 request LAN LUOT     -> 200: 44   429: 6   \n$ printf '/api/dang-nhap ban 8 request      -> '; for i in $(seq 8); do printf '%s ' $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/api/dang-nhap); done; echo; curl -s -D - -o /dev/null http://127.0.0.1:8080/api/dang-nhap | tr -d '\\r' | grep -i '^retry-after'\n/api/dang-nhap ban 8 request      -> 200 200 200 200 429 429 429 429 \nRetry-After: 6\n$ curl -s -o /dev/null -w '/tai-len/ than 2MB (tran 50m)      -> %{http_code}\\n' --data-binary @2mb.bin http://127.0.0.1:8080/tai-len/x; sleep 1\n/tai-len/ than 2MB (tran 50m)      -> 200\n$ curl -s -o /dev/null -w '/tai-len/ than 60MB                -> %{http_code}, da GUI LEN %{size_upload} byte\\n' --data-binary @60mb.bin http://127.0.0.1:8080/tai-len/x\n/tai-len/ than 60MB                -> 413, da GUI LEN 0 byte\n$ curl -s -o /dev/null -w '/api/ than 2MB (tran 1m)          -> %{http_code}\\n' --data-binary @2mb.bin http://127.0.0.1:8080/api/x\n/api/ than 2MB (tran 1m)          -> 413",
 "n7-5:chungvung": "$ sleep 3; : > /tmp/ng/logs/error.log; for i in $(seq 45); do curl -s -o /dev/null http://127.0.0.1:8081/api/x & done; wait; curl -s -o /dev/null -w 'cong 8081 (chung vung): 45 request /api/, roi tai len 2MB -> %{http_code}\\n' --data-binary @2mb.bin http://127.0.0.1:8081/tai-len/x\ncong 8081 (chung vung): 45 request /api/, roi tai len 2MB -> 429\n$ grep -m1 -oE 'limiting requests, excess: [0-9.]+ by zone \"chung\"' /tmp/ng/logs/error.log\nlimiting requests, excess: 40.440 by zone \"chung\"\n$ sleep 3; curl -s -o /dev/null -w 'nghi 3 giay, gui LAI                           -> %{http_code}\\n' --data-binary @2mb.bin http://127.0.0.1:8081/tai-len/x\nnghi 3 giay, gui LAI                           -> 200\n$ sleep 3; for i in $(seq 45); do curl -s -o /dev/null http://127.0.0.1:8080/api/x & done; wait; curl -s -o /dev/null -w 'cong 8080 (vung rieng): 45 request /api/, roi tai len 2MB -> %{http_code}\\n' --data-binary @2mb.bin http://127.0.0.1:8080/tai-len/x\ncong 8080 (vung rieng): 45 request /api/, roi tai len 2MB -> 200"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, meter, tiers } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-07-5', code: 'NGX 7.5', title: 'One defensive layer, assembled and measured', sub: 'Chapter 7 · Lesson 7.5' };
const O = (k) => { const v = DU_LIEU[`n7-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const KQ = (k) => O(k).split('\n').filter((l) => !l.startsWith('$ ')).join('\n');

/** Hai location gọi CÙNG một vùng ⇒ một cái xô; vùng riêng ⇒ hai cái xô. */
const xoChung = () => {
  const W = 1110, H = 250;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs><marker id="mx" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>`;
  const loc = (x, y, t, mau) => `<rect x="${x}" y="${y}" width="190" height="52" rx="10" fill="${mau}14" stroke="${mau}" stroke-width="2.5"/><text x="${x + 95}" y="${y + 33}" text-anchor="middle" font-size="19" font-weight="800" fill="${mau}" font-family="monospace">${t}</text>`;
  const xo = (x, y, t, mau, day) => `<path d="M${x} ${y} L${x + 30} ${y + 130} L${x + 170} ${y + 130} L${x + 200} ${y}" fill="${mau}12" stroke="${mau}" stroke-width="3"/><rect x="${x + 32}" y="${y + 130 - day}" width="136" height="${day}" fill="${mau}55"/><text x="${x + 100}" y="${y + 160}" text-anchor="middle" font-size="18" font-weight="800" fill="${mau}">${t}</text>`;
  s += `<text x="20" y="22" font-size="20" font-weight="800" fill="#c0392b">BEFORE — one zone, one bucket</text>`;
  s += loc(10, 50, '/api/', '#2563eb') + loc(10, 150, '/tai-len/', '#7c3aed');
  s += `<line x1="202" y1="76" x2="300" y2="120" stroke="#b85a2b" stroke-width="2.5" marker-end="url(#mx)"/><line x1="202" y1="176" x2="300" y2="140" stroke="#b85a2b" stroke-width="2.5" marker-end="url(#mx)"/>`;
  s += xo(305, 50, 'zone=chung (full)', '#c0392b', 118);
  s += `<text x="${600}" y="22" font-size="20" font-weight="800" fill="#009639">AFTER — one zone per purpose</text>`;
  s += loc(590, 50, '/api/', '#2563eb') + loc(590, 150, '/tai-len/', '#7c3aed');
  s += `<line x1="782" y1="76" x2="830" y2="76" stroke="#b85a2b" stroke-width="2.5" marker-end="url(#mx)"/><line x1="782" y1="176" x2="830" y2="176" stroke="#b85a2b" stroke-width="2.5" marker-end="url(#mx)"/>`;
  s += `<rect x="836" y="50" width="250" height="52" rx="10" fill="#c0392b12" stroke="#c0392b" stroke-width="2"/><text x="961" y="83" text-anchor="middle" font-size="18" font-weight="800" fill="#c0392b">zone=chung (full)</text>`;
  s += `<rect x="836" y="150" width="250" height="52" rx="10" fill="#00963914" stroke="#009639" stroke-width="2.5"/><text x="961" y="183" text-anchor="middle" font-size="18" font-weight="800" fill="#009639">zone=upload — untouched</text>`;
  return s + '</svg>';
};

export const S = [
  { cover: true, nhan: 'Chapter 7 · Lesson 7.5', t: 'One defensive layer,<br>assembled and measured', sub: 'Four axes in one config — and the probe that found what reading it never would',
    en: 'Lesson 7.5. Four axes, four lessons, and the only way to know they cooperate is to build it and probe it. Here is the config, and one probe that found a real interaction you cannot see by reading the file.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Five layers, in the order you build them</li>
    <li>Every route probed — four behave exactly as written</li>
    <li>50 at once vs. 50 in a row: limit_conn joins in</li>
    <li>The fifth: one shared zone, one failed upload</li>
    <li>What this layer can never do</li></ul>`,
    en: 'Five takeaways: five layers in build order; every route probed; fifty at once versus fifty in a row; the shared zone that failed a valid upload; and what this layer can never do.' },
  { t: 'Five layers, in the order you build them', body: tiers([
      ['key', '1 · IDENTITY — real_ip first (7.2)', 'every limit keyed on a wrong address looks fine', '#7c3aed'],
      ['layers', '2 · ZONES — one per purpose', 'chung 20r/s · login 10r/m · upload 2r/s · ket', '#2563eb'],
      ['flag', '3 · STATUS — 429, not 503 (7.1)', 'limit_req_status · limit_conn_status', '#0f8b8d'],
      ['clock', '4 · TIME — against dripping (7.3)', 'header/body/send 10s · keepalive 30s', '#c28a00'],
      ['box', '5 · SIZE — tight default, loosen in place (7.4)', 'client_max_body_size 1m', '#c0392b'],
    ], { th: 62, gap: 14 }) + box('Then probe every route, reading error.log as you go', 'Size and timeouts have no downside and need no tuning. Rate limits come last, with numbers from your own access log.', 'lam'),
    en: 'Five layers, in build order. Identity first, real IP, because every limit keyed on a wrong address fails while looking fine. Then zones, one per purpose. Then honest status codes. Then timeouts against dripping, and a tight size default. Rate numbers come from your own access log. Then probe every route.' },
  { t: 'The server block', body: ngc(`server {
  limit_conn ket 20;                         # per-IP ceiling for the whole server

  location /api/dang-nhap {
    limit_req zone=login burst=3 nodelay;    # 4 tries, then 429
    add_header Retry-After 6 always;
    proxy_pass http://api;
  }
  location /api/ {
    limit_req zone=chung burst=40 nodelay;   # a whole page load goes through
    proxy_pass http://api;
  }
  location /tai-len/ {
    limit_req zone=upload burst=5;           # ITS OWN zone — see slide 7
    limit_conn ket 2;                        # REPLACES the server's 20 (2.3)
    client_max_body_size 50m;                # loosened only here
    proxy_pass http://api;
  }
}`, { hl: [5, 10, 14, 15, 16] }),
    en: 'The server block. Twenty connections per IP for the whole server. The login route: ten per minute, burst three nodelay, plus Retry After six. The API: twenty per second, burst forty nodelay, so a page load goes through. The upload route: its own zone, two connections — which replaces the server level twenty, by the array rule of lesson two point three — and fifty megabytes, only here.' },
  { t: 'Each route, probed', body: tn(KQ('dotuyen').split('\n').filter((l) => !/CUNG LUC|tu choi boi/.test(l)).join('\n'), { fs: 16, wrap: 110 }) + cmp(['Route', 'Probe', 'Result', 'As written?'], [
      ['/api/dang-nhap', '8 requests', '4 × 200 · 4 × 429 + Retry-After: 6', '✓'],
      ['/tai-len/', '2 MB body', '200', '✓'],
      ['/tai-len/', '60 MB body', '413, 0 bytes sent', '✓'],
      ['/api/', '2 MB body', '413 — the tight 1m default', '✓'],
    ], {}),
    en: 'Each route, probed. Login: four passed, four got four twenty nine with Retry After six. Upload: two megabytes passed; sixty megabytes got four thirteen with zero bytes sent. And the same two megabytes on the API route got four thirteen from the tight default — because the loose ceiling is fenced into one location.' },
  { t: '50 at once vs. 50 in a row', body: tn(KQ('dotuyen').split('\n').filter((l) => /CUNG LUC|LAN LUOT|tu choi boi/.test(l)).join('\n'), { fs: 17, wrap: 110 }) +
    meter([['50 at once — 200', 28, '#009639'], ['50 at once — 429 (16 from limit_conn ket 20)', 22, '#c0392b'], ['50 in a row — 200', 44, '#009639'], ['50 in a row — 429', 6, '#c0392b']], { don: '', rh: 44, fs: 19, nhan: 560 }) +
    box('A page load is not 50 parallel connections', 'Fired at once, 50 connections hit limit_conn ket 20 before limit_req even counted — 16 log lines say so. A browser reuses 6 connections (HTTP/1.1) or 1 (HTTP/2), so measure the way your clients really connect.', 'do2'),
    en: 'Fifty at once versus fifty in a row. At once: twenty eight passed and twenty two got four twenty nine — sixteen of them from limit conn twenty, not from the rate limit. In a row: forty four passed, six refused, the burst of forty plus what refilled. A real page load reuses six connections, or one with HTTP two, so probe the way your clients really connect.' },
  { t: 'And the line that is NOT right', body: xoChung() + tn(KQ('chungvung'), { fs: 18, wrap: 100 }),
    en: 'The line that was not right. The first version used zone chung on both the API and the upload route. Forty five API requests, then one valid two megabyte upload: four twenty nine. The error log names it — excess forty point four four, by zone chung. Three seconds later the same upload passes. With a zone per purpose, the upload passes at once.' },
  { t: 'A zone is a shared budget', body: two(box('What the user sees', 'Their upload failed because the page they had open just called the API a lot. The bug report says "uploads are flaky" — and it will NOT reproduce when tested alone.', 'do2'),
      box('The fix is one word', 'zone=upload instead of zone=chung. Rule: two locations share a zone only when you WANT them to compete for one budget.', 'xanh')) + icards([
      ['page', 'temp files show up in error.log', '"a client request body is buffered to a temporary file" — your signal to size client_body_buffer_size'],
      ['plug', 'an app that answers without reading the body', 'breaks uploads: 502 + "writev() failed (32: Broken pipe)" — reject early, but drain the body'],
      ['merge', 'limit_conn at location REPLACES server', 'the upload route\'s 2 is the only one in force there (array rule, 2.3)'],
      ['server', 'every number is per nginx instance', 'three behind a load balancer = three of each limit'],
    ], 2),
    en: 'A zone is a shared budget. The user sees a flaky upload that never reproduces alone; the fix is one word. The probes also showed: temp file lines in the error log; an upstream that answers without reading the body breaks uploads with a broken pipe; a location limit conn replaces the server one; and every number is per instance.' },
  { t: 'What this layer can never do', body: icards([
      ['shield', 'Stop a distributed attack', '10,000 addresses at 1 r/s each are all inside every per-client limit — that is a CDN or scrubbing job'],
      ['lock', 'Know what a request MEANS', 'nginx cannot tell a failed login from a good one — "lock after 5 wrong passwords" belongs to the app'],
      ['eye', 'Protect what it does not stand in front of', 'bind apps to localhost or a private network; check with ss -ltn that nothing listens publicly'],
      ['test', 'Be finished before you probe it', 'five probes found four right and one wrong — normal, and the reason to probe instead of review'],
    ], 2),
    en: 'What this layer can never do. It cannot stop a distributed attack: ten thousand addresses at one request per second each are inside every per client limit. It cannot know what a request means: failed logins belong to the app. It cannot protect a backend reachable around it — check with ss. And it is not done until you probe it.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('defensive layer', 'identity, rate, connections, size'),
      kw('identity first', 'real_ip before any limit'),
      kw('zone per purpose', 'one budget per worry'),
      kw('shared-zone starvation', 'API traffic starves uploads'),
      kw('probe vs review', 'testing finds what reading misses'),
      kw('per-instance limits', 'each nginx enforces its own'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the defensive layer, identity first, a zone per purpose, shared zone starvation, probing versus reviewing, and per instance limits.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build the layer: identity, zones, status, time, size`,
      `Probe login ×8, upload 2 MB and 60 MB, API 2 MB`,
      `Fire 50 at once AND 50 in a row — count limit_conn lines`,
      `Put ${c('zone=chung')} on both routes, starve the upload, read the log`,
      `Fix it with one word`,
    ]), box('Keep these', `<ul><li>Identity first</li><li>One zone per purpose</li><li>Probe every route, read error.log</li><li>Per client only — not DDoS</li></ul>`, 'lam'), ''),
    en: 'Your turn: build the layer in order, probe every route, fire fifty at once and fifty in a row, then share one zone between two routes, starve the upload, read the log, and fix it with one word. Keep: identity first; one zone per purpose; probe every route reading the error log; this layer is per client, not a DDoS defence.' },
];
export const slides = lamDeck({ chuong: 'Chapter 7 — Limits: rate, connections, size', bai: '7.5' }, S);
