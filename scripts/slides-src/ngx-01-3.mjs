/**
 * ngx-01-3 — Nginx · Chapter 1 · Lesson 1.3 "The default server, and the page you did not mean to publish" (deck video + web, 12/11/2026). Bài web: nginx-1-3-may-chu-mac-dinh.
 * Output THẬT (scratchpad/ngx/demo/n1-3.txt; nginx/1.24.0): 8080 không khai ⇒ khối ĐẦU TIÊN; 8081 default_server ở khối thứ hai ⇒ cờ thắng vị trí;
 * 8082 default + return 444 ⇒ curl 52; 8443 ssl default + chứng chỉ tự ký + 444 ⇒ bắt tay xong rồi đóng (curl 52); thiếu chứng chỉ ⇒ nginx 1.24 TỪ CHỐI
 * khởi động: no "ssl_certificate" is defined for the "listen ... ssl" directive (bài web nói client nhận lỗi TLS — đã sửa).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-3:setup": "",
 "n1-3:file:/tmp/ng/conf/macdinh.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  # cong 8080: KHONG khai gi\n  server { listen 8080; server_name a.vidu.com; return 200 \"8080 · khoi DAU TIEN (a.vidu.com)\\n\"; }\n  server { listen 8080; server_name b.vidu.com; return 200 \"8080 · khoi thu hai (b.vidu.com)\\n\"; }\n  # cong 8081: default_server o khoi THU HAI\n  server { listen 8081; server_name c.vidu.com; return 200 \"8081 · c.vidu.com\\n\"; }\n  server { listen 8081 default_server; server_name _; return 200 \"8081 · MAC DINH tuong minh\\n\"; }\n  # cong 8082: mac dinh TU CHOI\n  server { listen 8082 default_server; server_name _; return 444; }\n  server { listen 8082; server_name d.vidu.com; return 200 \"8082 · d.vidu.com\\n\"; }\n}\n",
 "n1-3:bacong": "$ for p in \"8080 a.vidu.com\" \"8080 b.vidu.com\" \"8080 la-hoac.com\" \"8081 c.vidu.com\" \"8081 la-hoac.com\" \"8082 d.vidu.com\" \"8082 la-hoac.com\"; do set -- $p; printf '%-5s %-12s -> ' $1 $2; curl -s -H \"Host: $2\" http://127.0.0.1:$1/ || echo \"(curl thoat ma $?: khong co phan hoi)\"; done\n8080  a.vidu.com   -> 8080 · khoi DAU TIEN (a.vidu.com)\n8080  b.vidu.com   -> 8080 · khoi thu hai (b.vidu.com)\n8080  la-hoac.com  -> 8080 · khoi DAU TIEN (a.vidu.com)\n8081  c.vidu.com   -> 8081 · c.vidu.com\n8081  la-hoac.com  -> 8081 · MAC DINH tuong minh\n8082  d.vidu.com   -> 8082 · d.vidu.com\n8082  la-hoac.com  -> (curl thoat ma 52: khong co phan hoi)",
 "n1-3:file:/tmp/ng/conf/tls.conf": "pid       /tmp/ng/logs/tls.pid;\nerror_log /tmp/ng/logs/tls-error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8443 ssl default_server;\n    server_name _;\n    ssl_certificate     /tmp/ng/conf/tam.crt;\n    ssl_certificate_key /tmp/ng/conf/tam.key;\n    return 444;\n  }\n}\n",
 "n1-3:file:/tmp/ng/conf/tls-thieu.conf": "events {}\nhttp {\n  server {\n    listen 8444 ssl default_server;\n    server_name _;\n    return 444;\n  }\n}\n",
 "n1-3:tls": "$ curl -sk -m 3 https://127.0.0.1:8443/ -H 'Host: la-hoac.com' || echo \"(curl thoat ma $?: bat tay TLS xong, roi dong ket noi — 444)\"\n(curl thoat ma 52: bat tay TLS xong, roi dong ket noi — 444)\n$ nginx -t -c /tmp/ng/conf/tls-thieu.conf\n2026/11/12 12:04:08 [emerg] 1987#1987: no \"ssl_certificate\" is defined for the \"listen ... ssl\" directive in /tmp/ng/conf/tls-thieu.conf:3\nnginx: configuration file /tmp/ng/conf/tls-thieu.conf test failed",
 "n1-3:kiemtra": "$ nginx -T -c /tmp/ng/conf/macdinh.conf 2>/dev/null | grep -n 'default_server'\n10:  # cong 8081: default_server o khoi THU HAI\n12:  server { listen 8081 default_server; server_name _; return 200 \"8081 · MAC DINH tuong minh\\n\"; }\n14:  server { listen 8082 default_server; server_name _; return 444; }\n$ curl -s -o /dev/null -w '%{http_code}\\n' -H 'Host: khong-ton-tai.invalid' http://127.0.0.1:8081/\n200"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, tbl } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-01-3', code: 'NGX 1.3', title: 'The default server, and the page you did not mean to publish', sub: 'Chapter 1 · Lesson 1.3' };
const O = (k) => { const v = DU_LIEU[`n1-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.replace(/\/tmp\/ng\/conf\//g, '').replace(/^\d{4}\/\d\d\/\d\d \d\d:\d\d:\d\d /gm, '');
const vong = (s) => s.replace(/^\$ for p in .*$/m, '$ for p in "8080 a.vidu.com" … "8082 la-hoac.com"; do curl -s -H "Host: …" http://127.0.0.1:$port/; done');

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.3', t: 'The default server,<br>and the page you did not mean to publish', sub: 'When NO name matches, Nginx still picks a block — and if you did not say which, it picks one for a reason unrelated to your intent',
    en: 'Lesson 1.3. When no server_name matches, that is not an error and not a 404: Nginx still picks a block. If you did not say which, it picks one for a reason that has nothing to do with your intent.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Every port ALWAYS has a default — measured on three ports</li>
    <li>How an internal page ends up answering the whole Internet</li>
    <li>Two good defaults: refuse with 444, or redirect</li>
    <li>Why the default on 443 still needs a certificate</li>
    <li>Testing the path nobody tests</li></ul>`,
    en: 'Five takeaways: every port always has a default; how an accidental default exposes an internal page; the two good choices, refuse or redirect; why the TLS default still needs a certificate; and how to test the path nobody tests.' },
  { t: 'Three ports, three behaviours, measured', body: ngc(bo(O('file:/tmp/ng/conf/macdinh.conf')).split('\n').slice(5, 15).filter((l) => l.trim()).map((l) => l.replace(/\s+return 200 "([^"]*)\\n";/, ' # $1').replace(/server \{ /, '').replace(/ \}$/, '')).join('\n'), { sm: true, hl: [6, 8] }) +
    tn(vong(O('bacong')), { fs: 14 }),
    en: 'Port 8080 declares nothing: an unknown Host lands on the first block. Port 8081 puts default_server on the second block: the flag wins, not the position. Port 8082 has a default that returns 444: curl gets no response at all, exit code 52.' },
  { t: 'Every port ALWAYS has a default', body: cmp(['Port', 'What you wrote', 'Unknown Host lands on'], [
      ['8080', 'nothing', 'the FIRST block on that port — file order, not intent'],
      ['8081', '<code>default_server</code> on the 2nd block', 'the flagged block, wherever it is in the file'],
      ['8082', '<code>default_server</code> + <code>return 444</code>', 'nothing — the connection is closed'],
    ], { hl: [2] }) + box('You only choose whether it is ON PURPOSE', 'There is no configuration in which the default does not exist. One per address:port — Lesson 1.1.', 'lam'),
    en: 'The rule: every port always has a default server. If you do not flag one, it is the first block in file order. You only get to choose whether the default is deliberate.' },
  { t: 'How an internal page answers the whole Internet', body: tbl(['sites-enabled/ (loaded alphabetically)', 'First block on :443'], [
      ['<code>admin.conf</code> — internal dashboard', '⚠️ YES — it is the implicit default'],
      ['<code>www.conf</code> — the public site', 'no'],
    ]) + icards([
      ['warn', 'A scanner hits your IP', 'No Host, or a junk Host ⇒ nothing matches ⇒ the default.'],
      ['shield', 'It gets the admin panel', 'Not because a line says so — because admin sorts before www.'],
      ['search', 'Nothing in the config looks wrong', 'nginx -t is happy; only a request with a junk Host reveals it.'],
    ], 3),
    en: 'The accidental default is how an internal page answers the Internet. Files load alphabetically, so admin.conf comes before www.conf, and its block becomes the implicit default on port 443. A scanner hitting your IP with no Host gets the admin panel.' },
  { t: 'Two deliberate defaults', body: two(ngc(`# A — REFUSE. When every real site has a name.
server {
  listen 80  default_server;
  listen 443 ssl default_server;
  server_name _;       # never matches
  ssl_certificate     /etc/nginx/tls/tam.crt;
  ssl_certificate_key /etc/nginx/tls/tam.key;
  return 444;          # close, send nothing
}`, { sm: true, hl: [9] }), ngc(`# B — REDIRECT. When humans arrive by mistake.
server {
  listen 80 default_server;
  server_name _;
  return 301 https://vidu.com$request_uri;
}`, { sm: true, hl: [5] })) + icards([
      ['cut', '444 is Nginx-only', 'Not a real HTTP status: close the connection, reveal nothing, not even the server version.'],
      ['type', 'server_name _ is not syntax', 'Just an invalid hostname that never matches. The FLAG does the work.'],
    ], 2) +
    box('What the client sees', 'A: <code>curl: (52) Empty reply from server</code> — no status, no headers, no version. B: <code>301</code> with <code>Location: https://vidu.com/…</code>, the path kept.', 'lam'),
    en: 'Two deliberate defaults. A: refuse — default_server with return 444, which closes the connection without sending anything. B: redirect humans to the main site with a 301. server_name underscore is not special syntax, just a name that never matches; the flag does the work.' },
  { t: 'The default on 443 still needs a certificate', body: tn(bo([O('tls'), ''].join('\n')).replace(/\n$/, ''), { wrap: 112, fs: 14 }) + two(
      box('With a self-signed certificate', 'The TLS handshake completes first, THEN Nginx sees the Host and returns 444: curl exit 52, empty reply. A clean refusal.', 'xanh'),
      box('Without one, nginx 1.24 refuses to START', '<code>no "ssl_certificate" is defined for the "listen ... ssl" directive</code> — caught by <code>nginx -t</code>, before any client sees a broken handshake.', 'do2')),
    en: 'TLS is negotiated before Nginx sees a single HTTP header, so the default on port 443 needs a certificate — a self-signed one is enough. With it, the handshake completes and 444 closes the connection. Without it, Nginx 1.24 refuses to start: nginx -t reports no ssl_certificate defined.' },
  { t: 'Refuse or redirect?', body: cmp(['Situation', 'Choose', 'Why'], [
      ['API, internal tool — reached only through DNS you control', '<b>444</b>', 'a request with no matching name is a scanner; give it nothing'],
      ['Consumer site; vidu.com and www.vidu.com; an old domain', '<b>301</b>', 'humans mistype; a redirect is friendlier than silence'],
      ['A real page happens to be first', '<b>never</b>', 'it answers every scan and every stale DNS record'],
    ]) + ngc(`server {                       # give the default its OWN log
  listen 80 default_server;
  server_name _;
  access_log /var/log/nginx/mac-dinh.log;   # a clean record of who probes your IP
  return 444;
}`, { sm: true, hl: [4] }),
    en: 'Refuse when every legitimate request has a name — an API or an internal tool. Redirect when humans arrive by mistake. Never let a real page be the default by accident. And give the default its own access log: a clean record of who probes your address.' },
  { t: 'Test the path nobody tests', body: tn(bo(O('kiemtra')), { wrap: 112, fs: 15 }) +
    box('One curl with a junk Host, per environment', 'Every request you send during development carries a Host that matches. The default server is the ONE path normal use never touches — so it stays wrong for years.', 'lam') +
    two(box('Good answer', 'exit 52 (a 444 default) or a 301 to your main site — chosen on purpose.', 'xanh'),
      box('Bad answer', '200 with a real page — whichever block happened to load first. Fix it today.', 'do2')),
    en: 'Test the path nobody tests. nginx -T piped to grep shows which ports have a default_server. Then one curl with a nonsense Host shows exactly what a stranger sees — here 200 on port 8081, the explicit default.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Default server', 'the block that handles a request when no server_name matches'),
      kw('default_server', 'the listen flag that makes the choice explicit — once per address:port'),
      kw('Implicit default', 'without the flag, the FIRST block on that address:port'),
      kw('return 444', 'close the connection, send nothing — Nginx-only'),
      kw('server_name _', 'a name that never matches; the flag does the work'),
      kw('Self-signed certificate', 'enough for the TLS default to refuse cleanly'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: default server, the default_server flag, implicit default, return 444, server_name underscore, and a self-signed certificate for the TLS default.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Three ports: no flag, flag on the 2nd block, flag + ${c('return 444')}`,
      `Send a junk Host to each; read what comes back`,
      `Remove the certificate from the 443 default; run ${c('nginx -t')}`,
      `Give the default its own ${c('access_log')}`,
    ]), box('Keep these', `<ul><li>Every port has a default — choose it</li><li>The flag beats file order</li><li>444 for APIs, 301 for humans</li><li>Test with a junk Host</li></ul>`, 'lam'), ''),
    en: 'Your turn: reproduce the three ports, send junk Hosts, break the TLS default and read nginx -t, and give the default its own log. Keep: every port has a default, so choose it; the flag beats file order; 444 for APIs, 301 for humans.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — How a request finds a server block', bai: '1.3' }, S);
