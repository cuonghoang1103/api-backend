/**
 * ngx-05-2 — Nginx · Chapter 5 · Lesson 5.2 "What gets cached, and the leak when something should not" (deck video + web, 12/11/2026). Bài web: nginx-5-2-cai-gi-duoc-cache.
 * Output THẬT (scratchpad/ngx/demo/n5-2.txt; nginx/1.24.0): Set-Cookie / Cache-Control: private / 500 (valid chỉ khai 200) ⇒ MISS, MISS — không vào cache;
 * GET MISS→HIT, HEAD HIT (chung mục), POST không đặt biến; /ho-so in Authorization, KHÔNG Cache-Control: A (token) MISS · khách vãng lai HIT
 * thấy hồ sơ A · B (token khác) HIT thấy hồ sơ A — RÒ RỈ (Nginx không nhìn Authorization).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n5-2:file:/root/tu.js": "// upstream \"đủ kiểu\" (cổng 9202): /cookie đặt Set-Cookie · /private Cache-Control: private · /loi trả 500 · /ho-so in Authorization · còn lại 200\nlet n = 0;\nrequire('http').createServer((req, res) => {\n  n++; const h = { 'Content-Type': 'text/plain' };\n  if (req.url === '/cookie') h['Set-Cookie'] = 'phien=abc';\n  if (req.url === '/private') h['Cache-Control'] = 'private';\n  const ma = req.url === '/loi' ? 500 : 200;\n  res.writeHead(ma, h);\n  res.end(req.url === '/ho-so' ? `HO SO CUA: ${req.headers.authorization || '(khach vang lai)'}\\n` : `lan goi thu ${n}\\n`);\n}).listen(9202, '127.0.0.1');\n",
 "n5-2:file:/tmp/ng/conf/cache.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  proxy_cache_path /tmp/ng/cache levels=1:2 keys_zone=kho:10m;\n  server {\n    listen 8080;\n    add_header X-Cache-Status $upstream_cache_status always;\n    location / { proxy_cache kho; proxy_cache_valid 200 1m; proxy_pass http://127.0.0.1:9202; }\n  }\n}\n",
 "n5-2:file:/root/hai-lan.sh": "# hai-lan.sh <đường dẫn> [phương thức] — gửi 2 lần, in X-Cache-Status mỗi lần\nfor i in 1 2; do s=$(curl -s -o /dev/null -D - -X ${2:-GET} \"http://127.0.0.1:8080$1\" | tr -d '\\r' | awk -F': ' '/^X-Cache-Status/{print $2}'); printf 'lan %s %-8s ' $i \"${s:-(rong)}\"; done; echo\n",
 "n5-2:setup": "",
 "n5-2:khongcache": "$ for u in /cookie /private /loi; do printf '%-9s ' $u; bash hai-lan.sh $u; done\n/cookie   lan 1 MISS     lan 2 MISS     \n/private  lan 1 MISS     lan 2 MISS     \n/loi      lan 1 MISS     lan 2 MISS     \n=== phuong thuc ===\n$ printf 'GET  '; bash hai-lan.sh /pt\nGET  lan 1 MISS     lan 2 HIT      \n$ printf 'HEAD ' ; curl -s -I http://127.0.0.1:8080/pt | tr -d '\\r' | grep X-Cache\nHEAD X-Cache-Status: HIT\n$ printf 'POST '; bash hai-lan.sh /pt POST\nPOST lan 1 (rong)   lan 2 (rong)   ",
 "n5-2:roori": "$ printf '1. A co token     '; curl -s -D /tmp/h -H 'Authorization: Bearer TOKEN-CUA-A' http://127.0.0.1:8080/ho-so | tr -d '\\n'; printf '   '; grep -i x-cache /tmp/h | tr -d '\\r'\n1. A co token     HO SO CUA: Bearer TOKEN-CUA-A   X-Cache-Status: MISS\n$ printf '2. khach vang lai '; curl -s -D /tmp/h http://127.0.0.1:8080/ho-so | tr -d '\\n'; printf '   '; grep -i x-cache /tmp/h | tr -d '\\r'\n2. khach vang lai HO SO CUA: Bearer TOKEN-CUA-A   X-Cache-Status: HIT\n$ printf '3. B token khac   '; curl -s -D /tmp/h -H 'Authorization: Bearer TOKEN-CUA-B' http://127.0.0.1:8080/ho-so | tr -d '\\n'; printf '   '; grep -i x-cache /tmp/h | tr -d '\\r'\n3. B token khac   HO SO CUA: Bearer TOKEN-CUA-A   X-Cache-Status: HIT",
 "n5-2:file:/tmp/ng/conf/va.conf": "pid       /tmp/ng/logs/va.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  proxy_cache_path /tmp/ng/cache-va levels=1:2 keys_zone=kho_va:10m;\n  server {\n    listen 8081;\n    add_header X-Cache-Status $upstream_cache_status always;\n    location / {\n      proxy_cache kho_va; proxy_cache_valid 200 1m;\n      proxy_cache_bypass $http_authorization;   # có token ⇒ KHÔNG trả từ cache\n      proxy_no_cache     $http_authorization;   # có token ⇒ KHÔNG lưu\n      proxy_pass http://127.0.0.1:9202;\n    }\n  }\n}\n",
 "n5-2:va": "$ printf '1. A co token     '; curl -s -D /tmp/h -H 'Authorization: Bearer TOKEN-CUA-A' http://127.0.0.1:8081/ho-so | tr -d '\\n'; printf '   '; grep -i x-cache /tmp/h | tr -d '\\r'\n1. A co token     HO SO CUA: Bearer TOKEN-CUA-A   X-Cache-Status: BYPASS\n$ printf '2. khach vang lai '; curl -s -D /tmp/h http://127.0.0.1:8081/ho-so | tr -d '\\n'; printf '   '; grep -i x-cache /tmp/h | tr -d '\\r'\n2. khach vang lai HO SO CUA: (khach vang lai)   X-Cache-Status: MISS\n$ printf '3. B token khac   '; curl -s -D /tmp/h -H 'Authorization: Bearer TOKEN-CUA-B' http://127.0.0.1:8081/ho-so | tr -d '\\n'; printf '   '; grep -i x-cache /tmp/h | tr -d '\\r'\n3. B token khac   HO SO CUA: Bearer TOKEN-CUA-B   X-Cache-Status: BYPASS"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-05-2', code: 'NGX 5.2', title: 'What gets cached, and the leak when something should not', sub: 'Chapter 5 · Lesson 5.2' };
const O = (k) => { const v = DU_LIEU[`n5-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };

export const S = [
  { cover: true, nhan: 'Chapter 5 · Lesson 5.2', t: 'What gets cached,<br>and the leak when something should not', sub: 'Nginx refuses some responses on its own. It never looks at who asked — so one missing header serves user A\'s page to everybody',
    en: 'Lesson 5.2. Nginx refuses to cache some responses by itself. But it never looks at who asked. One missing header, and user A\'s private page is served to everybody.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three responses Nginx refuses to store</li>
    <li>GET, HEAD and POST</li>
    <li>The leak: one user's page served to everyone</li>
    <li>Why Authorization does not protect you</li>
    <li>Three ways to make it safe</li></ul>`,
    en: 'Five takeaways: three responses Nginx refuses to store; how methods behave; the leak; why the Authorization header does not protect you; and three ways to make it safe.' },
  { t: 'Three responses that never enter the cache', body: tn(O('khongcache').replace(/^\$ for u in .*$/m, '$ for u in /cookie /private /loi; do bash hai-lan.sh $u; done'), { fs: 17 }) +
    cmp(['Upstream sends', 'Twice', 'Why'], [
      ['<code>Set-Cookie</code>', 'MISS, MISS', 'a cookie is per person — Nginx will not store it'],
      ['<code>Cache-Control: private</code>', 'MISS, MISS', 'the upstream said "only for this browser"'],
      ['a <code>500</code>', 'MISS, MISS', '<code>proxy_cache_valid</code> listed only 200'],
    ]),
    en: 'Three responses never entered the cache: one with Set-Cookie, one with Cache-Control private, and a 500, because proxy cache valid listed only 200. Each was a MISS twice.' },
  { t: 'Methods: GET and HEAD share, POST is never cached', body: tn(O('khongcache').split('=== phuong thuc ===')[1].trim(), { fs: 17 }) +
    icards([
      ['check', 'GET', 'MISS then HIT'],
      ['link', 'HEAD', 'HIT on the SAME entry as GET'],
      ['cut', 'POST', 'not cached at all — the status variable is not even set'],
    ], 3),
    en: 'Methods. GET was MISS then HIT. HEAD hit the same entry. POST is not cached at all: the cache status variable was not even set.' },
  { t: 'The leak', body: tn(O('roori').replace(/^\$ printf '(\d\.[^']*)'; curl .*$/gm, '$ curl … /ho-so    # $1'), { fs: 15, wrap: 110 }) +
    box('Nobody did anything unusual', 'The upstream returned a personal page with NO Cache-Control. Nginx stored it under <code>/ho-so</code> — and served A\'s profile to a visitor with no token and to B.', 'do2'),
    en: 'The leak. The upstream returns each user\'s profile, with no Cache-Control. User A asks: MISS. A visitor with no token: HIT — and sees A\'s profile. User B, with a different token: HIT — A\'s profile again.' },
  { t: 'Why Authorization does not protect you', body: cmp(['Request carries', 'Is it in the key?', 'Does Nginx skip the cache?'], [
      ['<code>Authorization: Bearer …</code>', 'no', '<b>no</b> — Nginx does not look at it'],
      ['<code>Cookie: phien=…</code>', 'no', '<b>no</b> — only a Set-Cookie in the RESPONSE stops storing'],
      ['a different query string', 'yes', 'different entry'],
    ], { hl: [1] }) + box('The cache key is the URL', 'Two people asking for the same URL get the same answer. Personal data must be kept out — by the upstream, or by the config.', 'lam'),
    en: 'Why. The Authorization header is not part of the key, and Nginx does not skip the cache because of it. A cookie in the request does not either; only a Set-Cookie in the response stops storing. The key is the URL.' },
  { t: 'Three ways to make it safe', body: ngc(`# 1 — the upstream says so (best): personal answers carry
#     Cache-Control: private   (or no-store)
# 2 — never cache that route
location /ho-so { proxy_cache off; proxy_pass http://app; }
# 3 — skip the cache when the request is personal
proxy_cache_bypass $http_authorization $cookie_phien;
proxy_no_cache     $http_authorization $cookie_phien;`, { sm: true, hl: [4, 6, 7] }) +
    tn('# way 3, measured (bypass + no_cache on $http_authorization):\n' + O('va').split('\n').filter((l) => /^\d\./.test(l)).join('\n'), { fs: 15 }) +
    box('bypass vs no_cache', '<code>proxy_cache_bypass</code> = do not ANSWER from the cache; <code>proxy_no_cache</code> = do not STORE the answer. For personal requests you want both.', 'xanh'),
    en: 'Three ways to be safe. Best: the upstream marks personal answers private. Or switch the cache off on that route. Or skip it whenever the request carries a token or a session cookie: proxy cache bypass to not answer from cache, proxy no cache to not store. Measured: A and B got BYPASS and their own profiles; the visitor got a MISS and nobody else\'s data.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Set-Cookie', 'in a response ⇒ not stored'),
      kw('Cache-Control: private', 'only for this browser ⇒ not stored'),
      kw('proxy_cache_valid', 'only the listed codes are stored'),
      kw('proxy_cache_bypass', 'do not answer from the cache'),
      kw('proxy_no_cache', 'do not store the answer'),
      kw('Cache leak', 'one user\'s response served to another'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: Set-Cookie, Cache-Control private, proxy cache valid, proxy cache bypass, proxy no cache, and cache leak.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Return Set-Cookie, private and a 500; request each twice`,
      `Compare GET, HEAD and POST`,
      `Build ${c('/ho-so')} without Cache-Control; ask as A, nobody, B`,
      `Fix it with ${c('proxy_cache_bypass')} + ${c('proxy_no_cache')}`,
      `Pass when A and B show ${c('BYPASS')} and the visitor never sees a profile`,
    ]), box('Keep these', `<ul><li>Nginx never checks who asked</li><li>The key is the URL</li><li>Personal ⇒ private, or bypass</li><li>Test as two different users</li></ul>`, 'lam'), ''),
    en: 'Your turn: make the three refused responses, compare methods, reproduce the leak as two users and a visitor, then fix it. Keep: Nginx never checks who asked; the key is the URL; personal answers must be private or bypassed; test as two users.' },
];
export const slides = lamDeck({ chuong: 'Chapter 5 — A cache in front of the app', bai: '5.2' }, S);
