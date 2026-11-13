/**
 * ngx-10-1 — Nginx · Chapter 10 · Lesson 10.1 "What the default log leaves out" (deck video + web, 13/11/2026).
 * Bài web: nginx-10-1-log-mac-dinh-bo-sot. Output THẬT (scratchpad/ngx/demo/n10-1.txt; nginx/1.24.0, backend Node 9600):
 * cùng 3 request (/binh-thuong · /cham 600 ms · /loi 500) ghi CÙNG LÚC vào combined và huu_dung ⇒ combined không có thời gian/máy/mã upstream;
 * huu_dung: 0.008/0.008 · 0.605/0.604 · 500/500 · rewrite /cu/x ⇒ "/cu/binh-thuong" -> "/binh-thuong" · thử lại ⇒ "0.000, 0.001" "127.0.0.1:9601, 127.0.0.1:9600"
 * "502, 200" · error_page ⇒ $status 200 / $upstream_status 500 · cache MISS rồi HIT ("- - -") · Host giả may-quet.invalid ·
 * awk '$3 > 0.5' bắt đúng /cham · MỚI: dòng thử lại có ", " làm LỆCH cột ⇒ awk đếm $5/$12 ra "0.001" và "->".
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n10-1:file:/root/app.js": "// app.js — backend cổng 9600: /binh-thuong nhanh · /cham 600 ms · /loi 500\nrequire('http').createServer((q, r) => {\n  if (q.url.startsWith('/cham')) return setTimeout(() => r.end('ok nhung cham\\n'), 600);\n  if (q.url.startsWith('/loi')) { r.statusCode = 500; return r.end('loi ung dung\\n'); }\n  r.end('ok binh thuong\\n');\n}).listen(9600, '127.0.0.1');\n",
 "n10-1:file:/tmp/ng/conf/log.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  log_format huu_dung '$remote_addr $status $request_time $upstream_response_time '\n                      '$upstream_addr $upstream_status \"$request_method $request_uri\" -> \"$uri\" '\n                      '$body_bytes_sent $upstream_cache_status \"$http_user_agent\" $host';\n  proxy_cache_path /tmp/ng/cache keys_zone=c:1m;\n  upstream app { server 127.0.0.1:9600; }\n  upstream hai { server 127.0.0.1:9601; server 127.0.0.1:9600; }   # 9601: không ai nghe\n  server {\n    listen 8080;\n    access_log /tmp/ng/logs/combined.log combined;   # mặc định\n    access_log /tmp/ng/logs/huu.log huu_dung;        # viết cho một con PROXY — cùng lúc\n    location /        { proxy_pass http://app; }\n    location /cu/     { rewrite ^/cu/(.*)$ /$1 last; }                  # $request_uri ≠ $uri\n    location /thu-lai/ { proxy_pass http://hai/; }                       # thử lại ⇒ danh sách\n    location /trang-loi { proxy_intercept_errors on; error_page 500 = @dep; proxy_pass http://app/loi; }\n    location @dep     { return 200 \"trang loi dep\\n\"; }                 # $status 200, upstream 500\n    location /anh/    { proxy_cache c; proxy_cache_valid 200 1m; proxy_pass http://app/binh-thuong; }\n  }\n}\n",
 "n10-1:setup": "",
 "n10-1:ba": "$ for p in binh-thuong cham loi; do curl -s -o /dev/null http://127.0.0.1:8080/$p; done\n$ cat /tmp/ng/logs/combined.log\n127.0.0.1 - - [13/Nov/2026:00:38:08 +0000] \"GET /binh-thuong HTTP/1.1\" 200 25 \"-\" \"curl/8.5.0\"\n127.0.0.1 - - [13/Nov/2026:00:38:09 +0000] \"GET /cham HTTP/1.1\" 200 24 \"-\" \"curl/8.5.0\"\n127.0.0.1 - - [13/Nov/2026:00:38:09 +0000] \"GET /loi HTTP/1.1\" 500 23 \"-\" \"curl/8.5.0\"\n$ cat /tmp/ng/logs/huu.log\n127.0.0.1 200 0.008 0.008 127.0.0.1:9600 200 \"GET /binh-thuong\" -> \"/binh-thuong\" 25 - \"curl/8.5.0\" 127.0.0.1\n127.0.0.1 200 0.605 0.604 127.0.0.1:9600 200 \"GET /cham\" -> \"/cham\" 24 - \"curl/8.5.0\" 127.0.0.1\n127.0.0.1 500 0.002 0.001 127.0.0.1:9600 500 \"GET /loi\" -> \"/loi\" 23 - \"curl/8.5.0\" 127.0.0.1",
 "n10-1:them": "$ curl -s -o /dev/null http://127.0.0.1:8080/cu/binh-thuong          # rewrite … last\n$ curl -s -o /dev/null http://127.0.0.1:8080/thu-lai/binh-thuong     # máy đầu chết ⇒ thử lại\n$ curl -s -o /dev/null http://127.0.0.1:8080/trang-loi               # error_page chen vào\n$ for k in 1 2; do curl -s -o /dev/null http://127.0.0.1:8080/anh/x; done   # bộ đệm: lần 1, lần 2\n$ curl -s -o /dev/null -H 'Host: may-quet.invalid' -A 'quet/1.0' http://127.0.0.1:8080/binh-thuong\n$ cat huu.log\n127.0.0.1 200 0.001 0.001 127.0.0.1:9600 200 \"GET /cu/binh-thuong\" -> \"/binh-thuong\" 25 - \"curl/8.5.0\" 127.0.0.1\n127.0.0.1 200 0.002 0.000, 0.001 127.0.0.1:9601, 127.0.0.1:9600 502, 200 \"GET /thu-lai/binh-thuong\" -> \"/thu-lai/binh-thuong\" 25 - \"curl/8.5.0\" 127.0.0.1\n127.0.0.1 200 0.001 0.001 127.0.0.1:9600 500 \"GET /trang-loi\" -> \"/trang-loi\" 14 - \"curl/8.5.0\" 127.0.0.1\n127.0.0.1 200 0.002 0.001 127.0.0.1:9600 200 \"GET /anh/x\" -> \"/anh/x\" 25 MISS \"curl/8.5.0\" 127.0.0.1\n127.0.0.1 200 0.000 - - - \"GET /anh/x\" -> \"/anh/x\" 25 HIT \"curl/8.5.0\" 127.0.0.1\n127.0.0.1 200 0.002 0.002 127.0.0.1:9600 200 \"GET /binh-thuong\" -> \"/binh-thuong\" 25 - \"quet/1.0\" may-quet.invalid",
 "n10-1:hoi": "$ awk '$3 > 0.5' huu.log                         # request nào chậm hơn nửa giây?\n127.0.0.1 200 0.608 0.608 127.0.0.1:9600 200 \"GET /cham\" -> \"/cham\" 24 - \"curl/8.5.0\" 127.0.0.1\n$ awk '{ print $12 }' huu.log | sort | uniq -c     # bộ đệm: HIT hay MISS? (- = không qua cache)\n     10 -\n      1 ->\n      1 HIT\n      1 MISS\n$ awk '{ print $5 }' huu.log | sort | uniq -c      # máy nào trả lời bao nhiêu?\n      1 -\n      1 0.001\n     11 127.0.0.1:9600"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, tiers, cap } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-10-1', code: 'NGX 10.1', title: 'What the default log leaves out', sub: 'Chapter 10 · Lesson 10.1' };
const O = (k) => { const v = DU_LIEU[`n10-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const L = (k, a, b) => O(k).split('\n').slice(a, b).join('\n');

/** Hình: một dòng huu_dung, mỗi trường một nhãn bên dưới. */
function moXe() {
  const W = 1110, H = 210;
  const truong = [['127.0.0.1', 'client', '#64748b'], ['200', '$status', '#009639'], ['0.605', '$request_time', '#2563eb'], ['0.604', '$upstream_response_time', '#2563eb'],
    ['127.0.0.1:9600', '$upstream_addr', '#7c3aed'], ['200', '$upstream_status', '#009639'], ['"GET /cham"', 'method + $request_uri', '#b85a2b'], ['-> "/cham"', '$uri', '#b85a2b'], ['24', 'bytes', '#64748b'], ['-', 'cache', '#c0392b']];
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  let x = 6;
  truong.forEach(([v, nhan, m], i) => {
    const w = Math.max(v.length * 12.2 + 18, 58);
    s += `<rect x="${x}" y="20" width="${w}" height="44" rx="8" fill="${m}18" stroke="${m}" stroke-width="2"/><text x="${x + w / 2}" y="49" text-anchor="middle" font-family="monospace" font-size="20" font-weight="700" fill="${m}">${v.replace(/</g, '&lt;')}</text>`;
    const y = 96 + (i % 3) * 36;
    s += `<line x1="${x + w / 2}" y1="66" x2="${x + w / 2}" y2="${y - 16}" stroke="${m}" stroke-width="1.5"/><text x="${x + w / 2}" y="${y}" text-anchor="middle" font-size="16" font-weight="700" fill="${m}">${nhan}</text>`;
    x += w + 8;
  });
  return s + '</svg>';
}

export const S = [
  { cover: true, nhan: 'Chapter 10 · Lesson 10.1', t: 'What the default log<br>leaves out', sub: 'The combined format was built for a file server — nginx is doing something else',
    en: 'Lesson 10.1. The combined format was designed for a web server that serves files. Every chapter of this course has been about Nginx doing something else, and none of what it does is visible in that format.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The same requests, two formats — and what combined cannot answer</li>
    <li>Total time vs. upstream time: whose fault is the delay</li>
    <li><code>$upstream_addr</code>, <code>$upstream_status</code>, <code>$uri</code>, cache status, <code>$host</code></li>
    <li>A retry turns a field into a list — and breaks your awk</li>
    <li>Log fields are user input</li></ul>`,
    en: 'Five takeaways: the same requests in two formats; total time against upstream time; the upstream address, upstream status, URI, cache status and host; how a retry turns a field into a list; and why log fields are user input.' },
  { t: 'The same three requests, two formats', body: ngc(`log_format huu_dung '$remote_addr $status $request_time $upstream_response_time '
                    '$upstream_addr $upstream_status "$request_method $request_uri" -> "$uri" '
                    '$body_bytes_sent $upstream_cache_status "$http_user_agent" $host';
access_log /tmp/ng/logs/combined.log combined;   # the default
access_log /tmp/ng/logs/huu.log huu_dung;        # written for a PROXY — at the same time`, { sm: true, hl: [5] }) + tn(O('ba'), { fs: 15, wrap: 128 }),
    en: 'Two access log lines in one server, so every request is written in both formats at once. Three requests: a fast one, a slow one, an error. The combined lines say the slow request was a two hundred, like the fast one — nothing more. The proxy format says it took six hundred and five milliseconds, that the backend took six hundred and four, which backend it was, and what it answered.' },
  { t: 'One line, field by field', body: moXe() + icards([
      ['gauge', '$request_time vs $upstream_response_time', 'client waited 0.605, backend took 0.604 — the backend IS the delay; a gap = nginx or the client'],
      ['server', '$upstream_addr names the machine', 'with a pool (Chapter 9): "the slow ones all hit one backend" becomes answerable'],
      ['flag', '$upstream_status ≠ $status', '200 to the client, 500 upstream = an error_page stepped in'],
      ['loop', '$request_uri and $uri', 'show rewrites and internal redirects (2.5, 8.1) instead of you deducing them'],
    ], 2),
    en: 'One line, field by field. Request time is how long the client waited; upstream response time is how long the backend took — here the same, so the backend is the whole delay. Upstream addr names the machine. Upstream status can differ from status. And request URI next to URI shows every rewrite.' },
  { t: 'Five more requests the default cannot explain', body: tn(O('them'), { fs: 13, wrap: 140 }) + cmp(['Request', 'What the proxy format showed'], [
      ['/cu/binh-thuong', '"/cu/binh-thuong" -> "/binh-thuong" — the rewrite, visible'],
      ['/thu-lai/…', '"0.000, 0.001" · "…:9601, …:9600" · "502, 200" — a RETRY'],
      ['/trang-loi', '$status 200, $upstream_status 500 — error_page intervened'],
      ['/anh/x twice', 'MISS, then HIT with "- - -": the cache answered alone'],
      ['Host: may-quet.invalid', 'a forged host from a scanner — only $host shows it'],
    ], { hl: [1] }),
    en: 'Five more. The rewrite shows both URIs. The retry shows a comma separated list in three fields at once: two times, two machines, two statuses. The error page shows two hundred to the client and five hundred upstream. The cache shows miss and then hit, with no upstream at all. And the scanner\'s forged host is only visible because host is logged.' },
  { t: 'Questions you can now answer with one awk', body: cap('huu.log = the six lines above + seven more requests (six fast, one slow /cham)') + tn(O('hoi'), { fs: 17, wrap: 112 }) +
    box('NEW: one retry line shifted every column after it', 'The retry wrote "0.000, 0.001" and "127.0.0.1:9601, 127.0.0.1:9600" — a comma and a SPACE. awk splits on spaces, so on that line $5 became "0.001" and $12 became "->". Your counts are silently wrong. This is the strongest argument for the JSON format of Lesson 10.2.', 'do2'),
    en: 'Questions you can now answer with one awk, after seven more requests — six fast, one slow. Requests slower than half a second: exactly the slow one. Cache hit or miss, and which machine answered. But look closely: one machine is named zero point zero zero one, and one cache status is an arrow. The retry line has a comma and a space inside its fields, and every column after it shifted. The counts are silently wrong.' },
  { t: 'What to reach for when', body: tiers([
      ['gauge', '"The site is slow"', 'awk \'$3 > 1\' — then compare $request_time with $upstream_response_time', '#2563eb'],
      ['server', '"Some users get errors"', 'count non-2xx per $upstream_addr: one bad node, or the app', '#c0392b'],
      ['layers', '"Is the cache working"', 'count $upstream_cache_status over the last hour', '#009639'],
      ['loop', '"What changed after the deploy"', 'the same query on two windows — a two-minute check', '#7c3aed'],
    ], { th: 70, gap: 26 }),
    en: 'What to reach for. The site is slow: filter by request time, then compare it with upstream time. Some users get errors: group non two hundreds by upstream address. Is the cache working: count cache status. What changed after the deploy: run the same query on two windows.' },
  { t: 'Log fields are user input', body: two(icards([
      ['warn', 'Written by the client', '$http_user_agent, $http_referer, $request_uri, $host — anything at all'],
      ['shield', 'combined escapes as \\x22', 'safe to read by eye — not valid JSON, not CSV, not safe in a shell'],
      ['lock', 'Two rules', 'escape=json when a machine reads it (10.2) · never build a command or query from a log field'],
    ], 1), ngc(`# do NOT log $request alone:
#   "GET /x HTTP/1.1" in one quoted string
# log the parts instead:
"$request_method $request_uri"`, { sm: true }) + box('Same rule as $host in 1.4', 'One layer further out: the log shipper, the dashboard, the script that greps it.', 'lam'), ''),
    en: 'The trap. User agent, referer, request URI and host are all written by the client. The combined format escapes quotes as backslash x twenty two — safe to read, but not valid JSON and not safe to paste into a shell. Use escape json when a machine reads the log, and never build a command from a log field. And log the method and URI separately rather than the whole request line.' },
  { t: 'A format worth using — set it before you need it', body: ngc(`log_format huu_dung
  '$remote_addr $status $request_time $upstream_response_time '
  '$upstream_addr $upstream_status '
  '"$request_method $request_uri" -> "$uri" '
  '$body_bytes_sent $upstream_cache_status '
  '"$http_referer" "$http_user_agent" $host';
access_log /var/log/nginx/access.log huu_dung;`, { sm: true, hl: [2, 3, 5] }) + box('A log format only helps retroactively', 'The incident you want to investigate happened before you improved the format. One line and a reload, no measurable cost (10.3 measures it) — the difference between "the API was slow at 3 a.m." and "slow at 3 a.m. on backend 2, serving cache misses".', 'lam'),
    en: 'A format worth using. Set it before you need it: a log format only helps retroactively, because the incident you want to investigate already happened. It costs one line and a reload, and lesson ten point three measures that it costs nothing you can detect.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('log_format', 'name + template'),
      kw('$request_time', 'what the client waited'),
      kw('$upstream_response_time', 'what the backend took'),
      kw('$upstream_addr', 'which machine'),
      kw('$upstream_cache_status', 'HIT / MISS / …'),
      kw('a, b list', 'a retry — and shifted columns'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: log format, request time, upstream response time, upstream addr, upstream cache status, and the comma separated list a retry produces.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Two access_log lines: combined + your own format',
      'A fast, a slow and a failing request — read both',
      'A rewrite, a retry, an error_page, a cache hit',
      `${c("awk '$3 > 0.5'")} — then count a column and spot the shift`,
    ]), box('Keep these', `<ul><li>total vs upstream time = whose delay</li><li>log the machine, the status, both URIs</li><li>a comma = a retry</li><li>log fields are user input</li></ul>`, 'lam'), ''),
    en: 'Your turn: two access logs, combined and your own; a fast, a slow and a failing request; a rewrite, a retry, an error page and a cache hit; then awk, and spot the shifted column. Keep: total against upstream time tells whose delay it is; log the machine, both statuses, both URIs; a comma means a retry; log fields are user input.' },
];
export const slides = lamDeck({ chuong: 'Chapter 10 — Logs, and seeing what is happening', bai: '10.1' }, S);
