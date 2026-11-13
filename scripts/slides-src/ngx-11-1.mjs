/**
 * ngx-11-1 — Nginx · Chapter 11 · Lesson 11.1 "Making Nginx tell you which block handled the request" (deck video + web, 13/11/2026).
 * Bài web: nginx-11-1-bat-nginx-khai-ra. Output THẬT (scratchpad/ngx/demo/n11-1.txt; nginx/1.24.0): bản ngây thơ — X-Kh-Loc có ở 4/5, X-Kh-Server chỉ ở
 * /gioi-thieu (location KHÔNG có add_header riêng) · bản chạy được (một add_header + set $khop) — /api/v1 báo ~ ^/api (khối /api/v1 là mã chết), tên lạ ⇒
 * server=_, up= xen kẽ 9601/9602 · thiếu always ⇒ mất trên 404 · khoá bằng map: 127.0.0.1 thấy, 127.0.0.2 ⇒ 0 header.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n11-1:file:/root/may.js": "// may.js <ten> <cong> — backend nhỏ, trả tên của chính nó\nconst [ten, cong] = process.argv.slice(2);\nrequire('http').createServer((q, r) => r.end(`${ten}\\n`)).listen(+cong, '127.0.0.1');\n",
 "n11-1:file:/root/hoi.sh": "# hoi.sh <cổng> <tên header> — 4–5 request, in đúng dòng header chẩn đoán (hoặc \"(khong co)\")\nc=$1; h=$2; shift 2\nfor x in \"shop.vidu /gio-hang\" \"shop.vidu /api/v1/nguoi-dung\" \"shop.vidu /api/v1\" \"shop.vidu /gioi-thieu\" \"khong-biet.vidu /bat-ky\"; do\n  set -- $x; v=$(curl -s -D- -o /dev/null -H \"Host: $1\" http://127.0.0.1:$c$2 | grep -i \"^$h:\" | tr -d '\\r')\n  printf '%-16s %-22s -> %s\\n' $1 $2 \"${v:-(khong co $h)}\"\ndone\n",
 "n11-1:file:/tmp/ng/conf/kh.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  upstream be { server 127.0.0.1:9601; server 127.0.0.1:9602; }\n  # 8080: phiên bản NGÂY THƠ — một header ở mức server + một header trong mỗi location\n  server {\n    listen 8080 default_server; server_name shop.vidu;\n    add_header X-Kh-Server \"shop.vidu\" always;\n    location = /gio-hang { add_header X-Kh-Loc \"= /gio-hang\" always;         return 200 \"chinh xac\\n\"; }\n    location ~ ^/api     { add_header X-Kh-Loc \"~ ^/api\" always;             return 200 \"regex\\n\"; }\n    location /api/v1     { add_header X-Kh-Loc \"/api/v1 (tien to)\" always;   return 200 \"tien to\\n\"; }\n    location /gioi-thieu {                                                    return 200 \"khong add_header rieng\\n\"; }\n    location /           { add_header X-Kh-Loc \"/ (tien to)\" always;         return 200 \"goc\\n\"; }\n  }\n  # 8081: phiên bản CHẠY ĐƯỢC — MỘT add_header ở mức server, mỗi location chỉ set $khop\n  server {\n    listen 8081; server_name shop.vidu;\n    set $khop \"(khong dat)\";\n    add_header X-Kh \"server=$server_name loc=$khop up=$upstream_addr\" always;\n    location = /gio-hang { set $khop \"= /gio-hang\";       return 200 \"chinh xac\\n\"; }\n    location ~ ^/api     { set $khop \"~ ^/api\";           proxy_pass http://be; }\n    location /api/v1     { set $khop \"/api/v1 (tien to)\"; return 200 \"tien to\\n\"; }\n    location /           { set $khop \"/ (tien to)\";       return 200 \"goc\\n\"; }\n  }\n  server {\n    listen 8081 default_server; server_name _;\n    set $khop \"/\";\n    add_header X-Kh \"server=_ loc=$khop\" always;\n    location / { return 404; }\n  }\n  # 8082: thiếu always ⇒ header không có trên 404\n  server {\n    listen 8082; server_name shop.vidu;\n    add_header X-Kh-Khong-Always \"co\" ;\n    add_header X-Kh-Always \"co\" always;\n    location = /ok { return 200 \"ok\\n\"; }\n    location /     { return 404; }\n  }\n  # 8083: KHOÁ bằng map — chỉ địa chỉ 127.0.0.1 thấy header\n  map $remote_addr $kh_debug { default \"\"; \"127.0.0.1\" \"server=$server_name loc=$khop\"; }\n  server {\n    listen 8083; server_name shop.vidu;\n    set $khop \"/ (tien to)\";\n    add_header X-Kh $kh_debug always;\n    location / { return 200 \"goc\\n\"; }\n  }\n}\n",
 "n11-1:setup": "",
 "n11-1:ngaytho": "$ nginx -t -c /tmp/ng/conf/kh.conf 2>&1 | tail -1\nnginx: configuration file /tmp/ng/conf/kh.conf test is successful\n$ bash hoi.sh 8080 X-Kh-Loc\nshop.vidu        /gio-hang              -> X-Kh-Loc: = /gio-hang\nshop.vidu        /api/v1/nguoi-dung     -> X-Kh-Loc: ~ ^/api\nshop.vidu        /api/v1                -> X-Kh-Loc: ~ ^/api\nshop.vidu        /gioi-thieu            -> (khong co X-Kh-Loc)\nkhong-biet.vidu  /bat-ky                -> X-Kh-Loc: / (tien to)\n$ bash hoi.sh 8080 X-Kh-Server\nshop.vidu        /gio-hang              -> (khong co X-Kh-Server)\nshop.vidu        /api/v1/nguoi-dung     -> (khong co X-Kh-Server)\nshop.vidu        /api/v1                -> (khong co X-Kh-Server)\nshop.vidu        /gioi-thieu            -> X-Kh-Server: shop.vidu\nkhong-biet.vidu  /bat-ky                -> (khong co X-Kh-Server)",
 "n11-1:tachrieng": "$ curl -s -D- -o /dev/null -H 'Host: shop.vidu' http://127.0.0.1:8080/gioi-thieu | grep -i '^x-kh'   # location KHÔNG có add_header riêng\nX-Kh-Server: shop.vidu\n$ curl -s -D- -o /dev/null -H 'Host: shop.vidu' http://127.0.0.1:8080/gio-hang | grep -i '^x-kh'     # location CÓ add_header riêng\nX-Kh-Loc: = /gio-hang",
 "n11-1:chayduoc": "$ bash hoi.sh 8081 X-Kh\nshop.vidu        /gio-hang              -> X-Kh: server=shop.vidu loc== /gio-hang up=\nshop.vidu        /api/v1/nguoi-dung     -> X-Kh: server=shop.vidu loc=~ ^/api up=127.0.0.1:9601\nshop.vidu        /api/v1                -> X-Kh: server=shop.vidu loc=~ ^/api up=127.0.0.1:9602\nshop.vidu        /gioi-thieu            -> X-Kh: server=shop.vidu loc=/ (tien to) up=\nkhong-biet.vidu  /bat-ky                -> X-Kh: server=_ loc=/\n$ for i in 1 2 3; do curl -s -D- -o /dev/null -H 'Host: shop.vidu' http://127.0.0.1:8081/api/don-hang | grep -i '^x-kh' | tr -d '\\r'; done\nX-Kh: server=shop.vidu loc=~ ^/api up=127.0.0.1:9601\nX-Kh: server=shop.vidu loc=~ ^/api up=127.0.0.1:9602\nX-Kh: server=shop.vidu loc=~ ^/api up=127.0.0.1:9601",
 "n11-1:always": "$ for p in /ok /khong-co; do echo \"== $p\"; curl -s -D- -o /dev/null -H 'Host: shop.vidu' http://127.0.0.1:8082$p | grep -iE '^HTTP|^x-kh' | tr -d '\\r'; done\n== /ok\nHTTP/1.1 200 OK\nX-Kh-Khong-Always: co\nX-Kh-Always: co\n== /khong-co\nHTTP/1.1 404 Not Found\nX-Kh-Always: co",
 "n11-1:khoa": "$ curl -s -D- -o /dev/null http://127.0.0.1:8083/ | grep -i '^x-kh'                          # từ 127.0.0.1 (địa chỉ của mình)\nX-Kh: server=shop.vidu loc=/ (tien to)\n$ curl -s -D- -o /dev/null --interface 127.0.0.2 http://127.0.0.1:8083/ | grep -ic '^x-kh'   # từ địa chỉ KHÁC\n0"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, cay, vsd } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-11-1', code: 'NGX 11.1', title: 'Making Nginx tell you which block handled the request', sub: 'Chapter 11 · Lesson 11.1' };
const O = (k) => { const v = DU_LIEU[`n11-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };

export const S = [
  { cover: true, nhan: 'Chapter 11 · Lesson 11.1', t: 'Making Nginx tell you<br>which block handled the request', sub: 'Stop deducing the rules from a file someone else wrote — make the server say it',
    en: 'Lesson 11.1, the first lesson of the last chapter. Almost every Nginx incident comes down to two questions: which server block took this request, and which location inside it. Chapters 1 and 2 measured the rules. In production you do not want to re-derive them from a file someone else wrote — you want the server to say it out loud.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>One response header that names the server and the location</li>
    <li>The trap: <code>add_header</code> in a location REPLACES every inherited one</li>
    <li>The version that works: one <code>add_header</code> + <code>set $khop</code></li>
    <li><code>always</code> — or the header vanishes exactly on 404 and 502</li>
    <li>Lock it to your own address with <code>map</code>, then remove it</li></ul>`,
    en: 'Five takeaways: one header that names the server and location; the trap where add header in a location replaces every inherited one; the version that works; why always matters; and locking the header to your own address.' },
  { t: 'The naive version: one header per block', body: ngc(`server {
  listen 8080 default_server; server_name shop.vidu;
  add_header X-Kh-Server "shop.vidu" always;
  location = /gio-hang { add_header X-Kh-Loc "= /gio-hang" always; … }
  location ~ ^/api     { add_header X-Kh-Loc "~ ^/api" always; … }
  location /api/v1     { add_header X-Kh-Loc "/api/v1 (tien to)" always; … }
  location /gioi-thieu { return 200 "…"; }   # NO add_header here
  location /           { add_header X-Kh-Loc "/ (tien to)" always; … }
}`, { sm: true, hl: [3] }) + tn(O('ngaytho'), { fs: 13, wrap: 115 }),
    en: 'The naive version: a header at server level naming the server, and one in each location naming the location. nginx dash t is happy. Five requests: the location header is there wherever a location declared one. The server header is missing from four of the five — it appears only on the one location that declared no header of its own.' },
  { t: 'The trap: add_header REPLACES, it does not add', body: two(cay({ t: 'server: add_header', s: 'X-Kh-Server', mau: '#b85a2b' }, [
      { t: 'location /gioi-thieu', s: 'no add_header ⇒ inherits', mau: '#009639' },
      { t: 'location = /gio-hang', s: 'own add_header ⇒ ALL inherited gone', mau: '#c0392b' },
    ], { w: 560, h: 260, fs: 18 }), tn(O('tachrieng'), { fs: 15, wrap: 54 }), '') +
    box('Not just the same name — every one of them', 'Array-type directives are inherited only while the child declares none. Declare one and the whole inherited set disappears — the same rule as error_log in 10.4. This is how a Strict-Transport-Security set once at server level silently stops being sent on the routes that later grew their own Cache-Control.', 'do2'),
    en: 'The trap, isolated: a location with no add header inherits the server one; a location with its own add header loses it. Not just a header with the same name — all of them. Array type directives are inherited only while the child declares none, the same rule as error log in ten point four. This is exactly how a security header set once at server level stops being sent on the routes that later grew their own header.' },
  { t: 'The version that works: one add_header, one variable', body: ngc(`server {
  listen 8081; server_name shop.vidu;
  set $khop "(khong dat)";
  # ONE add_header — no location can hide it
  add_header X-Kh "server=$server_name loc=$khop up=$upstream_addr" always;
  location = /gio-hang { set $khop "= /gio-hang";       return 200 "…"; }
  location ~ ^/api     { set $khop "~ ^/api";           proxy_pass http://be; }
  location /api/v1     { set $khop "/api/v1 (tien to)"; return 200 "…"; }
  location /           { set $khop "/ (tien to)";       return 200 "…"; }
}`, { sm: true, hl: [5] }) + tn(O('chayduoc').split('\n').slice(0, 6).join('\n'), { fs: 15, wrap: 100 }),
    en: 'The version that works: keep exactly one add header, at server level, and let each location write into a variable that the header reads. The header is built when the response goes out, after the location ran, so it sees whatever the matching location set. Five requests, one of them to a name no server block claims.' },
  { t: 'What the five lines prove', body: icards([
      ['flag', 'server=_ ⇒ default_server', 'an unknown name fell to the default block (Chapter 1) — the fastest way to spot a new domain pointed at your IP'],
      ['trash', '/api/v1 ⇒ ~ ^/api: dead code', 'the regex wins over the prefix (Chapter 2), so location /api/v1 is never reached — its rules never run'],
      ['server', 'up= names the backend', 'three requests: 9601, 9602, 9601 — round robin (Chapter 9), now visible per request'],
      ['eye', 'nginx -t knew none of this', 'it parses; only a request shows which block won'],
    ], 2) + tn(O('chayduoc').split('\n').slice(6).join('\n'), { fs: 16, wrap: 93 }),
    en: 'What the lines prove. Server underscore: an unknown name fell to the default server. Slash api slash v one reported the regex: the prefix block is dead code, and whatever rules sit in it never run. And the upstream address names the backend — three requests alternate between ninety six oh one and ninety six oh two, round robin made visible.' },
  { t: 'always — or it vanishes exactly where you need it', body: tn(O('always'), { fs: 19, wrap: 78 }) + vsd(`<code>add_header X-Kh …;</code><br>only on 2xx and some 3xx`, `<code>add_header X-Kh … always;</code><br>also on 404, 403, 502…`, '✗ Without always', '✓ With always') +
    box('The requests you most need explained are the failures', 'Without always the diagnostic header is missing on exactly the 404s, 403s and 502s you are trying to explain.', 'lam'),
    en: 'Always. Without it, add header fires only on two hundreds and a few redirects. Measured: on the 404 the header without always is gone, the one with always is still there. And the requests you most need explained are exactly the failures.' },
  { t: 'Reading it from the client', body: ngc(`# every header, no body
curl -s -D- -o /dev/null https://cuongthai.com/api/v1/bai-viet

# only the diagnostic line
curl -s -D- -o /dev/null https://cuongthai.com/duong-dan | grep -i '^x-kh'

# pretend to be another domain without touching DNS
curl -s -D- -o /dev/null -H 'Host: shop.vidu' http://127.0.0.1/duong-dan`, { hl: [8] }) + box('The last form is the one to remember', 'It asks one specific server, on one port, to answer as if it were one specific domain — test a server_name before its DNS record exists, and tell an Nginx problem from a problem somewhere between client and Nginx.', 'xanh'),
    en: 'Reading it from the client: dash capital D dash prints the headers, dash o dev null drops the body, grep keeps the diagnostic line. The last form is the one to remember: a Host header against one specific address tests a server name before DNS exists, and tells you whether the problem is Nginx or something in between.' },
  { t: 'Then lock it — or remove it', body: two(ngc(`map $remote_addr $kh_debug {
  default       "";   # empty ⇒ no header
  "127.0.0.1"   "server=$server_name loc=$khop";
}
server {
  add_header X-Kh $kh_debug always;
}`, { sm: true, hl: [2, 3] }), tn(O('khoa'), { fs: 14, wrap: 54 }), '') +
    icards([
      ['warn', 'Free reconnaissance', 'names, routing, which backend answered — told to anyone who asks'],
      ['lock', 'map, from Chapter 8', 'an empty value sends no header: everyone else sees nothing'],
      ['check', 'Same shape as debug_connection', 'full detail for one address, silence for the rest (10.4)'],
    ], 3) +
    box('When the question is answered', 'Delete the add_header line and reload. A diagnostic header is a debugging tool, not a feature.', 'xanh'),
    en: 'Then lock it, or remove it. These headers tell anyone who asks how your configuration is built — free reconnaissance. A map from Chapter 8 sends the value only to your address; an empty value sends no header at all. Measured: from one twenty seven zero zero one the header is there, from one twenty seven zero zero two, zero headers.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('add_header', 'any variable into a response header'),
      kw('set $khop', 'per-location value, read later'),
      kw('always', 'also on 4xx and 5xx'),
      kw('server=_', 'fell to default_server'),
      kw('$upstream_addr', 'which backend served it'),
      kw('map lock', 'only your address sees it'),
    ].join('')}</div>` + cmp(['Location declares add_header?', 'Server-level headers on its responses'], [
      ['no', 'all inherited'],
      ['yes — even one, even unrelated', 'NONE — the whole inherited set is gone'],
    ], { hl: [1] }), to: true,
    en: 'Key terms: add header, set khop, always, server underscore, upstream addr, and the map lock. And the one rule underneath: declare even one add header in a location and the whole inherited set is gone.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'A server with four locations, one header per block — find which header vanished',
      `One ${c('add_header … always')} at server level, ${c('set $khop')} in each location`,
      'Five requests incl. an unknown Host — find the dead location',
      `Lock it with ${c('map $remote_addr')}, check from another address`,
    ]), box('Keep these', `<ul><li>make the server say it</li><li>add_header in a location replaces all</li><li>always, or 4xx/5xx stay silent</li><li>lock it, then remove it</li></ul>`, 'lam'), ''),
    en: 'Your turn: four locations with one header each, and find the header that vanished; then one add header with always plus set khop; five requests including an unknown host, and find the dead location; then lock it with a map and check from another address. Keep: make the server say it; add header in a location replaces all; always; lock it, then remove it.' },
];
export const slides = lamDeck({ chuong: 'Chapter 11 — Diagnosis: making Nginx tell you what it did', bai: '11.1' }, S);
