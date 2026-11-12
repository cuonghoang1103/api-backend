/**
 * ngx-01-4 — Nginx · Chapter 1 · Lesson 1.4 "The Host header is client INPUT, and so is $host" (deck video + web, 12/11/2026). Bài web: nginx-1-4-host-la-dau-vao.
 * Output THẬT (scratchpad/ngx/demo/n1-4.txt; nginx/1.24.0): $host/$http_host/$server_name/$scheme với Host thường, Host giả, Host "ViDu.CoM.:9999";
 * 301 dựng từ $host ⇒ Location kẻ tấn công; hằng số ⇒ an toàn; Nginx TỰ 301 thư mục thiếu "/" ⇒ Location: http://ke-tan-cong.com:8080/thu-muc/;
 * absolute_redirect off ⇒ Location: /thu-muc/; proxy mặc định ⇒ upstream thấy 127.0.0.1:3000; proxy_set_header Host $host ⇒ ke-tan-cong.com; "vidu.com.." ⇒ 400.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-4:setup": "",
 "n1-4:file:/tmp/ng/conf/host.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8080;\n    server_name vidu.com;\n    root /tmp/ng/www;\n    location = /bien { return 200 \"host=$host\\nhttp_host=$http_host\\nserver_name=$server_name\\nscheme=$scheme\\n\"; }\n    location = /chuyen-huong-hong { return 301 https://$host$request_uri; }\n    location = /chuyen-huong-dung { return 301 https://vidu.com$request_uri; }\n  }\n}\n",
 "n1-4:bienhost": "$ curl -s -H 'Host: vidu.com' http://127.0.0.1:8080/bien\nhost=vidu.com\nhttp_host=vidu.com\nserver_name=vidu.com\nscheme=http\n$ curl -s -H 'Host: ke-tan-cong.com' http://127.0.0.1:8080/bien\nhost=ke-tan-cong.com\nhttp_host=ke-tan-cong.com\nserver_name=vidu.com\nscheme=http\n$ curl -s -H 'Host: ViDu.CoM.:9999' http://127.0.0.1:8080/bien\nhost=vidu.com\nhttp_host=ViDu.CoM.:9999\nserver_name=vidu.com\nscheme=http",
 "n1-4:chuyenhuong": "$ curl -sI -H 'Host: ke-tan-cong.com' http://127.0.0.1:8080/chuyen-huong-hong | grep -E '^(HTTP|Location)'\nHTTP/1.1 301 Moved Permanently\nLocation: https://ke-tan-cong.com/chuyen-huong-hong\n$ curl -sI -H 'Host: ke-tan-cong.com' http://127.0.0.1:8080/chuyen-huong-dung | grep -E '^(HTTP|Location)'\nHTTP/1.1 301 Moved Permanently\nLocation: https://vidu.com/chuyen-huong-dung\n$ curl -sI -H 'Host: ke-tan-cong.com' http://127.0.0.1:8080/thu-muc | grep -E '^(HTTP|Location)'\nHTTP/1.1 301 Moved Permanently\nLocation: http://ke-tan-cong.com:8080/thu-muc/",
 "n1-4:va": "$ grep -n absolute_redirect /tmp/ng/conf/host.conf\n6:  absolute_redirect off;\n$ curl -sI -H 'Host: ke-tan-cong.com' http://127.0.0.1:8080/thu-muc | grep -E '^(HTTP|Location)'\nHTTP/1.1 301 Moved Permanently\nLocation: /thu-muc/",
 "n1-4:file:/root/app.js": "// ứng dụng nhỏ của bạn: nghe 127.0.0.1:3000, trả lại vài thông tin của request nó nhận được\nrequire('http').createServer((req, res) => {\n  res.setHeader('Content-Type', 'application/json');\n  res.end(JSON.stringify({ app: 'node:3000', url: req.url, host: req.headers.host, ip: req.socket.remoteAddress }) + '\\n');\n}).listen(3000, '127.0.0.1');\n",
 "n1-4:file:/tmp/ng/conf/proxy.conf": "pid       /tmp/ng/logs/proxy.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server { listen 8081; server_name vidu.com; location / { proxy_pass http://127.0.0.1:3000; } }\n  server { listen 8082; server_name vidu.com; location / { proxy_pass http://127.0.0.1:3000; proxy_set_header Host $host; } }\n}\n",
 "n1-4:proxyhost": "$ curl -s -H 'Host: ke-tan-cong.com' http://127.0.0.1:8081/dat-lai-mat-khau\n{\"app\":\"node:3000\",\"url\":\"/dat-lai-mat-khau\",\"host\":\"127.0.0.1:3000\",\"ip\":\"127.0.0.1\"}\n$ curl -s -H 'Host: ke-tan-cong.com' http://127.0.0.1:8082/dat-lai-mat-khau\n{\"app\":\"node:3000\",\"url\":\"/dat-lai-mat-khau\",\"host\":\"ke-tan-cong.com\",\"ip\":\"127.0.0.1\"}\n$ curl -s -o /dev/null -w '%{http_code}\\n' -H 'Host: vidu.com..' http://127.0.0.1:8081/\n400"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, seq, icards, cmp, box, two, steps, kw, c } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-01-4', code: 'NGX 1.4', title: 'The Host header is client INPUT, and so is $host', sub: 'Chapter 1 · Lesson 1.4' };
const O = (k) => { const v = DU_LIEU[`n1-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const lenh = (blk, re) => { const ls = O(blk).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && re.test(l)); const out = [ls[i]]; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) out.push(ls[j]); return out.join('\n'); };
const gon = (s) => s.replace(/http:\/\/127\.0\.0\.1:808\d/g, '…').replace(/ \| grep -E '\^\(HTTP\|Location\)'/g, '');

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.4', t: 'The Host header is client INPUT,<br>and so is $host', sub: 'It chose your server block — that does not make it trustworthy. Everything built from it carries the client\'s choice with it',
    en: 'Lesson 1.4. Lessons 1.1 to 1.3 used the Host header to choose a server block, so it is tempting to think it has been validated by the time your directives run. It has not: it is a string the client typed.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>$host, $http_host, $server_name, $scheme — which ones the client controls</li>
    <li>Where it escapes: a redirect that sends victims elsewhere</li>
    <li>The redirect Nginx writes for you — and how to turn it off</li>
    <li>Your app inherits the hole through proxy_set_header Host</li>
    <li>The one-line rule: build from config, read from request</li></ul>`,
    en: 'Five takeaways: which variables the client controls; how a redirect leaks it; the redirect Nginx writes on its own; how your application inherits the problem; and a one-line rule.' },
  { t: 'Same request, two Hosts — measured', body: two(tn(gon(lenh('bienhost', /Host: vidu.com'/)), { fs: 16 }), tn(gon(lenh('bienhost', /ke-tan-cong/)), { fs: 16 })) +
    tn(gon(lenh('bienhost', /ViDu/)), { fs: 16 }) +
    box('Only ONE value did not move when the client lied: $server_name', 'It is what YOU wrote in the config. $host and $http_host come from the request. $host is cleaned (lowercase, no port, no trailing dot); $http_host is raw.', 'do2'),
    en: 'The same location printing four variables. With a normal Host and with an attacker\'s Host, host and http_host change; server_name does not — it is what you wrote. With ViDu.CoM. and a port, $host is cleaned to vidu.com while $http_host keeps every character.' },
  { t: 'Four variables, four sources', body: cmp(['Variable', 'Comes from', 'Client controls it?'], [
      ['<code>$http_host</code>', 'the raw Host header, port included', '<b>yes</b> — every character'],
      ['<code>$host</code>', 'Host, lowercased, port and trailing dot removed', '<b>yes</b> — cleaned, not validated'],
      ['<code>$server_name</code>', 'the name on the matched block, from YOUR config', 'no — the only safe one'],
      ['<code>$scheme</code>', 'this hop\'s protocol', 'honest — but only about THIS hop (Chapter 3)'],
    ], { hl: [2] }),
    en: 'Four variables. http_host is the raw header. host is the same value, cleaned but not validated. server_name comes from your configuration — the only one the client cannot touch. scheme is honest, but only about this hop: behind a TLS-terminating proxy it says http.' },
  { t: 'Where it escapes: the redirect', body: tn(gon([lenh('chuyenhuong', /hong/), lenh('chuyenhuong', /dung/)].join('\n')), { fs: 16 }) +
    two(box('Built from $host', '<code>return 301 https://$host$request_uri;</code> — the attacker chooses where your victims are sent.', 'do2'),
      box('Built from a constant', '<code>return 301 https://vidu.com$request_uri;</code> — the same request is harmless.', 'xanh')),
    en: 'Where it escapes: a redirect. Built from $host, the Location points to the attacker\'s domain — your server sends the victim there. The same redirect written with a constant domain is harmless.' },
  { t: 'Trap: the redirect you never wrote', body: tn(gon(lenh('chuyenhuong', /thu-muc/)), { fs: 17 }) +
    seq(['client (fake Host)', 'nginx', 'browser follows'], [[0, 1, 'GET /thu-muc  Host: ke-tan-cong.com'], [1, 1, 'directory without "/" → automatic 301', '#7c3aed'],
      [1, 0, 'Location: http://ke-tan-cong.com:8080/thu-muc/', '#c0392b'], [0, 2, 'goes to the attacker\'s host', '#c0392b', true]], { rh: 48, fs: 17 }) +
    box('A config with no $host at all still emits it', 'An audit that greps for $host finds nothing.', 'do2'),
    en: 'The trap that catches careful people: a request for a directory without the trailing slash. Nginx adds the slash with an automatic 301 — and builds the Location from $host. A configuration with no $host anywhere still emits an attacker-controlled absolute redirect.' },
  { t: 'The fix at the root', body: ngc(`http {
  absolute_redirect       off;  # Location: /thu-muc/  (relative, no host)
  server_name_in_redirect on;   # if absolute is needed: use the CONFIGURED name
  port_in_redirect        off;  # drop ":8080", wrong behind a proxy
}
# and in your own redirects: the target is a CONSTANT
return 301 https://vidu.com$request_uri;   # RIGHT
# return 301 https://$host$request_uri;   # WRONG — the client picks the target`, { hl: [2, 7] }) +
    tn(gon(O('va')).replace(/^\$ grep -n absolute_redirect .*\n.*\n/, ''), { fs: 16 }),
    en: 'The fix at the root: absolute_redirect off at the http level makes Nginx\'s own redirects relative — measured: Location becomes /thu-muc/. If you need absolute ones, server_name_in_redirect uses the configured name. And your own redirect targets are constants.' },
  { t: 'Your app inherits the hole', body: tn(gon(O('proxyhost')).replace(/'Host: ke-tan-cong.com' …\/dat/g, "'Host: ke-tan-cong.com' …/dat"), { wrap: 112, fs: 15 }) +
    two(box('Default proxy: the app sees 127.0.0.1:3000', 'Nginx does NOT forward the client\'s Host by default.', 'lam'),
      box('proxy_set_header Host $host', 'Almost every real config adds it, because the app needs the name — and now the app receives the attacker\'s string. A password-reset link built from it is Host header poisoning.', 'do2')),
    en: 'Your application inherits the problem. A default proxy sends the app 127.0.0.1:3000 as the host. Almost every real configuration adds proxy_set_header Host $host — and then the app receives ke-tan-cong.com. A password-reset link built from it is a poisoning attack.' },
  { t: 'Two more places it leaks', body: icards([
      ['db', 'The cache key', 'Key a proxy cache on $host and a fake-Host request can store a response real users will read — cache poisoning, Chapter 5. Use $server_name.'],
      ['list', 'The logs', 'Logging $host is useful — and the field is written by the attacker. Treat it as DATA; never interpolate it into a query or a shell command.'],
      ['shield', 'The default server enforces', 'A refusing default (Lesson 1.3) means an unknown Host never reaches a named block at all.'],
      ['warn', 'Do not validate with a regex', 'Trailing dots, userinfo @, mixed scripts — let server_name match and the default refuse the rest.'],
    ], 2) + box('Malformed is rejected early', 'Host <code>vidu.com..</code> got 400 before any block was chosen.', 'lam'),
    en: 'Two more leaks: the cache key, where a fake Host can poison what real users read, and the logs, where the field is attacker-written data. The refusing default server is the enforcement point, and you should not try to validate hosts with a regex yourself.' },
  { t: 'The one-line rule', body: cmp(['', 'From CONFIG (safe)', 'From the REQUEST (fine only to read)'], [
      ['Location of a redirect', '<code>https://vidu.com$request_uri</code>', '—'],
      ['Links in emails, cookie Domain', 'the configured name', '—'],
      ['Cache key', '<code>$server_name</code> or nothing', '—'],
      ['Logs, routing, a captured subdomain', '—', '<code>$host</code> is fine — it only affects that one request'],
    ]) + box('Anything you send BACK to the client is built from your config', 'Anything you merely LOOK at may come from the request.', 'xanh'),
    en: 'The one-line rule: anything you send back to the client — a Location, a link, a cookie domain, a cache key — is built from your configuration. Anything you only look at — logs, routing, a captured subdomain — may come from the request.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('$http_host', 'raw Host header, port included'),
      kw('$host', 'cleaned Host — still client-chosen'),
      kw('$server_name', 'from your config — client cannot change it'),
      kw('absolute_redirect off', 'Nginx\'s own redirects become relative'),
      kw('Host header poisoning', 'an app builds links from an attacker\'s Host'),
      kw('return 444', 'the refusing default that blocks unknown Hosts'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: $http_host, $host, $server_name, absolute_redirect off, Host header poisoning, and the refusing default server.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Print ${c('$host $http_host $server_name')} with a fake Host`,
      `Redirect with ${c('$host')}, then with a constant; compare Location`,
      `Request a directory without ${c('/')}; then set ${c('absolute_redirect off')}`,
      `Proxy with and without ${c('proxy_set_header Host $host')}`,
    ]), box('Keep these', `<ul><li>Host is input, $host too</li><li>$server_name is yours</li><li>absolute_redirect off at http</li><li>Build from config, read from request</li></ul>`, 'lam'), ''),
    en: 'Your turn: print the variables with a fake Host, compare a $host redirect with a constant one, see Nginx\'s automatic redirect and turn it relative, and proxy with and without forwarding Host.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — How a request finds a server block', bai: '1.4' }, S);
