/**
 * ngx-05-3 — Nginx · Chapter 5 · Lesson 5.3 "Who decides how long: the precedence chain, measured" (deck video + web, 12/11/2026). Bài web: nginx-5-3-ai-quyet-dinh-thoi-han.
 * Output THẬT (scratchpad/ngx/demo/n5-3.txt; nginx/1.24.0; proxy_cache_valid 200 10s cho cả bốn): A upstream không khai ⇒ EXPIRED ở t=12s (10 s của cấu hình);
 * B Cache-Control: max-age=2 ⇒ EXPIRED ở t=3s; C = B + proxy_ignore_headers Cache-Control ⇒ lại 10 s; D X-Accel-Expires: 2 + max-age=600 ⇒ EXPIRED ở t=3s;
 * client KHÔNG nhận X-Accel-Expires (0 dòng).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n5-3:file:/root/han.js": "// upstream (cổng 9203): /a không khai gì · /b Cache-Control: max-age=2 · /d X-Accel-Expires: 2 + Cache-Control: max-age=600\nrequire('http').createServer((req, res) => {\n  const h = { 'Content-Type': 'text/plain' };\n  if (req.url.startsWith('/b') || req.url.startsWith('/c')) h['Cache-Control'] = 'max-age=2';\n  if (req.url.startsWith('/d')) { h['X-Accel-Expires'] = '2'; h['Cache-Control'] = 'max-age=600'; }\n  res.writeHead(200, h); res.end('ok\\n');\n}).listen(9203, '127.0.0.1');\n",
 "n5-3:file:/tmp/ng/conf/han.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  proxy_cache_path /tmp/ng/cache levels=1:2 keys_zone=kho:10m;\n  server {\n    listen 8080;\n    add_header X-Cache-Status $upstream_cache_status always;\n    proxy_cache kho;\n    proxy_cache_valid 200 10s;\n    location /a { proxy_pass http://127.0.0.1:9203; }\n    location /b { proxy_pass http://127.0.0.1:9203; }\n    location /c { proxy_ignore_headers Cache-Control; proxy_pass http://127.0.0.1:9203; }\n    location /d { proxy_pass http://127.0.0.1:9203; }\n  }\n}\n",
 "n5-3:file:/root/moc.py": "# moc.py <đường dẫn> <các mốc giây…> — xin đúng tại từng mốc (tính từ lần đầu), in X-Cache-Status\nimport sys, time, urllib.request\np, mocs = sys.argv[1], [float(x) for x in sys.argv[2:]]; t0 = time.time(); ra = []\nfor m in mocs:\n    time.sleep(max(0, t0 + m - time.time()))\n    r = urllib.request.urlopen('http://127.0.0.1:8080' + p); r.read()\n    ra.append(f\"t={m:g}s {r.headers.get('X-Cache-Status'):<8}\")\nprint(' '.join(ra))\n",
 "n5-3:setup": "",
 "n5-3:bonca": "$ printf 'A) khong khai gi, valid 10s           '; python3 moc.py /a 0 3 6 9 12\nA) khong khai gi, valid 10s           t=0s MISS     t=3s HIT      t=6s HIT      t=9s HIT      t=12s EXPIRED \n$ printf 'B) Cache-Control: max-age=2           '; python3 moc.py /b 0 1 2 3\nB) Cache-Control: max-age=2           t=0s MISS     t=1s HIT      t=2s HIT      t=3s EXPIRED \n$ printf 'C) B + proxy_ignore_headers           '; python3 moc.py /c 0 3 6 9 12\nC) B + proxy_ignore_headers           t=0s MISS     t=3s HIT      t=6s HIT      t=9s HIT      t=12s EXPIRED \n$ printf 'D) X-Accel-Expires: 2 + max-age=600   '; python3 moc.py /d 0 1 2 3\nD) X-Accel-Expires: 2 + max-age=600   t=0s MISS     t=1s HIT      t=2s HIT      t=3s EXPIRED \n$ curl -s -o /dev/null -D - http://127.0.0.1:8080/d | tr -d '\\r' | grep -ciE '^(x-accel-expires)'\n0",
 "n5-3:file:/root/rieng.js": "// upstream (cổng 9204): /p trả Cache-Control: private, max-age=60 (trang cá nhân) · mọi đường khác 404\nlet n = 0;\nrequire('http').createServer((req, res) => {\n  n++;\n  if (req.url.startsWith('/p')) { res.writeHead(200, { 'Cache-Control': 'private, max-age=60' }); return res.end(`trang rieng, lan goi ${n}\\n`); }\n  res.writeHead(404); res.end(`khong co, lan goi ${n}\\n`);\n}).listen(9204, '127.0.0.1');\n",
 "n5-3:file:/tmp/ng/conf/bay.conf": "pid       /tmp/ng/logs/bay.pid;\nerror_log /tmp/ng/logs/bay.log;\nevents {}\nhttp {\n  access_log off;\n  proxy_cache_path /tmp/ng/cache2 levels=1:2 keys_zone=kho2:10m;\n  server {\n    listen 8081;\n    add_header X-Cache-Status $upstream_cache_status always;\n    proxy_cache kho2;\n    proxy_cache_valid 200 10m;\n    proxy_cache_valid 404 1m;\n    location /p   { proxy_pass http://127.0.0.1:9204; }\n    location /ep/ { proxy_ignore_headers Cache-Control; proxy_pass http://127.0.0.1:9204/p/; }\n    location /mat { proxy_pass http://127.0.0.1:9204; }\n  }\n}\n",
 "n5-3:bay": "$ for i in 1 2; do curl -s -D - http://127.0.0.1:8081/p/toi | tr -d '\\r' | grep -E 'X-Cache|lan goi' | paste -sd' '; done\nX-Cache-Status: MISS trang rieng, lan goi 1\nX-Cache-Status: MISS trang rieng, lan goi 2\n$ for i in 1 2; do curl -s -D - http://127.0.0.1:8081/ep/toi | tr -d '\\r' | grep -E 'X-Cache|lan goi' | paste -sd' '; done\nX-Cache-Status: MISS trang rieng, lan goi 3\nX-Cache-Status: HIT trang rieng, lan goi 3\n$ for i in 1 2; do curl -s -D - http://127.0.0.1:8081/mat | tr -d '\\r' | grep -E '^HTTP|X-Cache|lan goi' | paste -sd' '; done\nHTTP/1.1 404 Not Found X-Cache-Status: MISS khong co, lan goi 4\nHTTP/1.1 404 Not Found X-Cache-Status: HIT khong co, lan goi 4"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, flow } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-05-3', code: 'NGX 5.3', title: 'Who decides how long: the precedence chain, measured', sub: 'Chapter 5 · Lesson 5.3' };
const O = (k) => { const v = DU_LIEU[`n5-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const DONG = () => O('bonca').split('\n').filter((l) => /^[A-D]\)/.test(l)).map((l) => l.replace(/\s+$/, '')).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 5 · Lesson 5.3', t: 'Who decides how long:<br>the precedence chain, measured', sub: 'Your config says ten seconds. The upstream can overrule it — and one header overrules them both',
    en: 'Lesson 5.3. Your config says ten seconds. The upstream can overrule that with its own header, and one special header overrules both. Four cases, measured to the second.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Four cases, timed to the second</li>
    <li>The upstream's Cache-Control beats proxy_cache_valid</li>
    <li>proxy_ignore_headers takes the decision back</li>
    <li>X-Accel-Expires beats everything — and stays private</li>
    <li>The ignore trap, and one lifetime per status code</li>
    <li>Which lever to reach for</li></ul>`,
    en: 'Six takeaways: four timed cases; the upstream beats your config; ignore headers takes control back; X-Accel-Expires beats everything and never reaches the client; the ignore trap and per-status lifetimes; and which lever to reach for.' },
  { t: 'The setup: same config, four upstream answers', body: ngc(O('file:/tmp/ng/conf/han.conf').split('\n').slice(9, 15).map((l) => l.replace(/^ {4}/, '')).join('\n'), { sm: true, hl: [2, 5] }) +
    cmp(['Path', 'Upstream sends'], [
      ['<code>/a</code>', 'nothing about caching'], ['<code>/b</code>', '<code>Cache-Control: max-age=2</code>'],
      ['<code>/c</code>', 'the same as /b — but the location ignores it'], ['<code>/d</code>', '<code>X-Accel-Expires: 2</code> AND <code>Cache-Control: max-age=600</code>'],
    ]),
    en: 'The setup. Every location has proxy cache valid two hundred, ten seconds. The upstream answers four ways: nothing; max-age two; the same max-age but ignored by the config; and X-Accel-Expires two together with max-age six hundred.' },
  { t: 'Four cases, timed', body: tn(DONG(), { fs: 15, wrap: 120 }) + icards([
      ['clock', 'A — 10 s', 'nothing from upstream ⇒ the config decides'],
      ['warn', 'B — 2 s', 'Cache-Control from upstream BEATS the config'],
      ['shield', 'C — 10 s again', 'proxy_ignore_headers: the config takes it back'],
      ['bolt', 'D — 2 s', 'X-Accel-Expires beats Cache-Control: max-age=600'],
    ], 2),
    en: 'Four cases. A: nothing from upstream, expired after the configured ten seconds. B: the upstream\'s max-age two won — expired at three seconds. C: with proxy ignore headers, back to ten. D: X-Accel-Expires two beat max-age six hundred.' },
  { t: 'The chain, highest first', to: true, body: flow([
      { t: 'X-Accel-Expires', s: 'from upstream, Nginx-only' }, { t: 'Cache-Control / Expires', s: 'from upstream' },
      { t: 'proxy_cache_valid', s: 'your config' }, { t: 'not cached', s: 'nothing applies', mau: '#c0392b' }], { h: 240 }) +
    two(box('proxy_ignore_headers', 'removes a step from the chain: <code>proxy_ignore_headers Cache-Control Expires;</code> makes your config decide again.', 'lam'),
      box('X-Accel-Expires never leaves Nginx', 'Measured: 0 such lines reached the client. The browser still sees <code>max-age=600</code>.', 'xanh')),
    en: 'The chain, highest first: X-Accel-Expires, then the upstream\'s Cache-Control or Expires, then your proxy cache valid, then nothing. proxy ignore headers removes a step. And X-Accel-Expires never reached the client: zero lines.' },
  { t: 'The trap: ignoring Cache-Control ignores private too', body: tn(O('bay').split('\n').map((l) => l.replace(/ \| tr -d .*$/, '')).join('\n'), { fs: 16, wrap: 110 }) +
    two(box('Same upstream, same <code>private</code> page', '<code>/p/</code> obeys it: MISS, MISS — never stored. <code>/ep/</code> has <code>proxy_ignore_headers Cache-Control</code>: the second visitor got the FIRST visitor\'s private page (HIT, call 3).', 'do'),
      box('One lifetime per status code', '<code>proxy_cache_valid 200 10m;</code><br><code>proxy_cache_valid 404 1m;</code><br>The 404 above was a HIT on the second request — scanners stop reaching the app.', 'xanh')),
    en: 'The trap. proxy ignore headers Cache-Control does not only drop the lifetime: it drops private, no-store and no-cache too. Measured: the private page was never stored on the normal path, but on the ignoring path the second visitor got the first one\'s page. And per-status lifetimes: a 404 cached for a minute was a HIT the second time.' },
  { t: 'Two audiences, two lifetimes', body: ngc(`# the app answers:
Cache-Control: max-age=600      # for BROWSERS: keep it 10 minutes
X-Accel-Expires: 2               # for NGINX: refresh every 2 seconds`, { sm: true }) +
    cmp(['You want', 'Use'], [
      ['the app decides, per response', 'upstream <code>Cache-Control</code> (B)'],
      ['ops decides, whatever the app says', '<code>proxy_ignore_headers</code> + <code>proxy_cache_valid</code> (C)'],
      ['a short shared cache, a long browser cache', '<code>X-Accel-Expires</code> + <code>Cache-Control</code> (D)'],
    ]),
    en: 'Two audiences, two lifetimes. Case D is useful: browsers keep the page ten minutes, Nginx refreshes it every two seconds. Let the app decide with Cache-Control, let operations decide with ignore headers, or split the two with X-Accel-Expires.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('proxy_cache_valid', 'the config\'s lifetime — lowest priority'),
      kw('Cache-Control: max-age', 'the upstream\'s lifetime — beats the config'),
      kw('proxy_ignore_headers', 'drop a header from the decision'),
      kw('X-Accel-Expires', 'Nginx-only lifetime; highest; not forwarded'),
      kw('EXPIRED', 'the entry was stale; upstream asked again'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: proxy cache valid, Cache-Control max-age, proxy ignore headers, X-Accel-Expires, and EXPIRED.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build the four upstream answers`,
      `Request each at fixed seconds; note where EXPIRED appears`,
      `Add ${c('proxy_ignore_headers')} to one`,
      `Check whether the client ever sees ${c('X-Accel-Expires')}`,
      `Log ${c('$upstream_cache_status')} from day one`,
    ]), box('Keep these', `<ul><li>Upstream beats config</li><li>ignore_headers takes it back</li><li>X-Accel-Expires beats all</li><li>EXPIRED = went upstream again</li></ul>`, 'lam'), ''),
    en: 'Your turn: build the four answers, request them at fixed seconds, add ignore headers to one, and check the client headers, and put upstream cache status in your log format from day one. Keep: the upstream beats the config, ignore headers takes it back, X-Accel-Expires beats all.' },
];
export const slides = lamDeck({ chuong: 'Chapter 5 — A cache in front of the app', bai: '5.3' }, S);
