/**
 * ngx-01-1 — Nginx · Chapter 1 · Lesson 1.1 "listen, and the address:port pair" (deck video + web, 12/11/2026). Bài web: nginx-1-1-listen.
 * Output THẬT (scratchpad/ngx/demo/n1-1.txt; ngx-lab, nginx/1.24.0): listen 8090 + listen 127.0.0.2:8090 ⇒ 127.0.0.2 tới khối CỤ THỂ, 127.0.0.1 tới
 * khối đại diện; ss chỉ thấy MỘT socket 0.0.0.0:8090 (nginx gộp, phân xử bằng địa chỉ đích); 127.0.0.1:8091 không tới được từ IP container (curl 7);
 * duplicate default server / duplicate listen options (reuseport); bind() 98; [::]:8094 CHỈ IPv6 (ipv6only=on mặc định — dòng chú thích "dùng chung
 * IPv4" của bài web SAI); ssl ở một khối ⇒ khối kia cùng cổng cũng TLS (400 plain HTTP … HTTPS port).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-1:setup": "",
 "n1-1:file:/tmp/ng/conf/listen.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server { listen 8090;                return 200 \"A  listen 8090 (dai dien 0.0.0.0)\\n\"; }\n  server { listen 127.0.0.2:8090;      return 200 \"B  listen 127.0.0.2:8090 (cu the)\\n\"; }\n  server { listen 127.0.0.1:8091;      return 200 \"C  listen 127.0.0.1:8091 (chi loopback)\\n\"; }\n}\n",
 "n1-1:socket": "$ nginx -c /tmp/ng/conf/listen.conf -t 2>&1 | tail -1 && nginx -c /tmp/ng/conf/listen.conf\nnginx: configuration file /tmp/ng/conf/listen.conf test is successful\n$ ss -tlnp | grep nginx | awk '{print $4, $6}' | sort\n0.0.0.0:8090 users:((\"nginx\",pid=1430,fd=4))\n127.0.0.1:8091 users:((\"nginx\",pid=1430,fd=5))\n$ curl -s http://127.0.0.1:8090/\nA  listen 8090 (dai dien 0.0.0.0)\n$ curl -s http://127.0.0.2:8090/\nB  listen 127.0.0.2:8090 (cu the)\n$ curl -s http://127.0.0.1:8091/\nC  listen 127.0.0.1:8091 (chi loopback)\n$ hostname -I\n172.17.0.5 \n$ curl -s -m 2 http://$(hostname -I | awk '{print $1}'):8091/ || echo \"curl: that bai (ma thoat $?)\"\ncurl: that bai (ma thoat 7)\n$ curl -s http://$(hostname -I | awk '{print $1}'):8090/\nA  listen 8090 (dai dien 0.0.0.0)",
 "n1-1:file:/tmp/ng/conf/hai-default.conf": "events {}\nhttp {\n  server { listen 8092 default_server; return 200 \"mot\\n\"; }\n  server { listen 8092 default_server; return 200 \"hai\\n\"; }\n}\n",
 "n1-1:file:/tmp/ng/conf/reuse.conf": "events {}\nhttp {\n  server { listen 8093 reuseport; return 200 \"mot\\n\"; }\n  server { listen 8093 reuseport; return 200 \"hai\\n\"; }\n}\n",
 "n1-1:file:/tmp/ng/conf/trung-cong.conf": "pid /tmp/ng/logs/trung.pid;\nerror_log /tmp/ng/logs/trung-error.log;\nevents {}\nhttp {\n  server { listen 8090; return 200 \"x\\n\"; }\n}\n",
 "n1-1:loi": "$ nginx -t -c /tmp/ng/conf/hai-default.conf\n2026/11/12 11:54:37 [emerg] 1525#1525: a duplicate default server for 0.0.0.0:8092 in /tmp/ng/conf/hai-default.conf:4\nnginx: configuration file /tmp/ng/conf/hai-default.conf test failed\n$ nginx -t -c /tmp/ng/conf/reuse.conf\n2026/11/12 11:54:37 [emerg] 1533#1533: duplicate listen options for 0.0.0.0:8093 in /tmp/ng/conf/reuse.conf:4\nnginx: configuration file /tmp/ng/conf/reuse.conf test failed\n$ nginx -c /tmp/ng/conf/trung-cong.conf; tail -n 3 /tmp/ng/logs/trung-error.log\n2026/11/12 11:54:37 [emerg] 1549#1549: bind() to 0.0.0.0:8090 failed (98: Address already in use)\n2026/11/12 11:54:37 [emerg] 1549#1549: bind() to 0.0.0.0:8090 failed (98: Address already in use)\n2026/11/12 11:54:37 [emerg] 1549#1549: still could not bind()\nnginx: [emerg] bind() to 0.0.0.0:8090 failed (98: Address already in use)\nnginx: [emerg] bind() to 0.0.0.0:8090 failed (98: Address already in use)\nnginx: [emerg] bind() to 0.0.0.0:8090 failed (98: Address already in use)\nnginx: [emerg] bind() to 0.0.0.0:8090 failed (98: Address already in use)\nnginx: [emerg] bind() to 0.0.0.0:8090 failed (98: Address already in use)\nnginx: [emerg] still could not bind()\n$ ss -tlnp 'sport = :8090'\nState  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess\nLISTEN 0      511          0.0.0.0:8090      0.0.0.0:*    users:((\"nginx\",pid=1430,fd=4))",
 "n1-1:file:/tmp/ng/conf/v6.conf": "pid /tmp/ng/logs/v6.pid;\nerror_log /tmp/ng/logs/v6-error.log;\nevents {}\nhttp {\n  server { listen [::]:8094; return 200 \"chi IPv6\\n\"; }\n}\n",
 "n1-1:ipv6": "$ cat /proc/sys/net/ipv6/conf/all/disable_ipv6\n0\n$ nginx -c /tmp/ng/conf/v6.conf && ss -tlnp 'sport = :8094' | awk 'NR>1{print $4}'\n[::]:8094\n$ curl -s -m 2 http://[::1]:8094/\nchi IPv6\n$ curl -s -m 2 http://127.0.0.1:8094/ || echo \"curl IPv4: that bai (ma thoat $?)\"\ncurl IPv4: that bai (ma thoat 7)",
 "n1-1:file:/tmp/ng/conf/ssl.conf": "pid /tmp/ng/logs/ssl.pid;\nerror_log /tmp/ng/logs/ssl-error.log;\nevents {}\nhttp {\n  ssl_certificate     /tmp/ng/conf/cert.pem;\n  ssl_certificate_key /tmp/ng/conf/key.pem;\n  server { listen 8095 ssl; server_name a.test; return 200 \"a.test\\n\"; }\n  server { listen 8095;     server_name b.test; return 200 \"b.test\\n\"; }\n}\n",
 "n1-1:ssl": "$ nginx -t -c /tmp/ng/conf/ssl.conf\nnginx: the configuration file /tmp/ng/conf/ssl.conf syntax is ok\nnginx: configuration file /tmp/ng/conf/ssl.conf test is successful\n$ nginx -c /tmp/ng/conf/ssl.conf; curl -s -m 2 http://127.0.0.1:8095/ -H 'Host: b.test' | head -c 120; echo\n<html>\n<head><title>400 The plain HTTP request was sent to HTTPS port</title></head>\n<body>\n<center><h1>400 Bad Reque\n$ curl -sk -m 2 https://127.0.0.1:8095/ -H 'Host: b.test'\nb.test"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, flow, icards, cmp, box, two, steps, kw, c, tbl } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-01-1', code: 'NGX 1.1', title: 'listen, and the address:port pair', sub: 'Chapter 1 · Lesson 1.1' };
const O = (k) => { const v = DU_LIEU[`n1-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const lenh = (blk, re) => { const ls = O(blk).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && re.test(l)); const out = [ls[i]]; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) out.push(ls[j]); return out.join('\n'); };
const bo = (s) => s.replace(/\/tmp\/ng\/conf\//g, '').replace(/^\d{4}\/\d\d\/\d\d \d\d:\d\d:\d\d /gm, '');

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.1', t: 'listen,<br>and the address:port pair', sub: 'Choosing a server block happens in TWO stages — and almost every explanation skips the first one: the socket',
    en: 'Chapter 1, lesson 1.1. Before Nginx compares any domain name, it narrows the candidates to the blocks listening on the exact socket that received the connection.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What <code>listen</code> actually declares — and the two-stage choice</li>
    <li>A specific address beats the wildcard — measured</li>
    <li>127.0.0.1 is a real security measure</li>
    <li>Flags that belong to the PORT, not to the block</li>
    <li>Port taken, IPv6, and reading a config by port</li></ul>`,
    en: 'Five takeaways: what listen declares and the two-stage choice; specific address beats wildcard; loopback as real security; flags that belong to the port; and three practical checks — a taken port, IPv6, and reading by port.' },
  { t: 'What listen actually declares', body: ngc(`listen 80;                  # every IPv4 address, port 80 — same as 0.0.0.0:80
listen 127.0.0.1:8080;      # loopback ONLY — nothing off the machine can reach it
listen 192.0.2.10:443 ssl;  # one specific address, with TLS — Chapter 6
listen [::]:80;             # IPv6 ONLY (ipv6only=on is nginx's default) — measured below
listen 8080 default_server; # the default server FOR THIS PORT — Lesson 1.3

server {                    # one block may listen on SEVERAL sockets
  listen 80;
  listen 443 ssl;
  server_name vidu.com;
}`, { hl: [2, 4] }) + box('listen is a SOCKET', 'An address and a port. A block only becomes a candidate for a connection that arrived on that socket — its server_name is never even looked at otherwise.', 'lam'),
    en: 'listen declares a socket: an address and a port. Port alone means every IPv4 address; 127.0.0.1 means loopback only; a specific address can carry flags like ssl. And [::]:80 is IPv6 only — ipv6only=on is Nginx\'s default, which we will measure.' },
  { t: 'Two stages, in this order', to: true, giua: true, body: flow([
      { t: '1 · socket', s: 'address:port of the connection', mau: '#008a34' }, { t: '2 · server_name', s: 'Host header, 4 priority levels' },
      { t: '3 · default', s: 'nothing matched → per port' }, { t: '4 · location', s: 'only now — Chapter 2' }], { h: 180, fs: 22 }) +
    icards([
      ['filter', 'Stage 1 is a filter', 'Blocks listening elsewhere are not candidates at all.'],
      ['search', 'Stage 2 picks inside the group', 'Only among blocks on that socket — Lesson 1.2.'],
      ['shield', 'Every group has a default', 'Even when you did not choose one — Lesson 1.3.'],
    ], 3) + box('So: when a request lands in the wrong place', 'First ask which SOCKET it arrived on — only then look at names.', 'lam'),
    en: 'Four steps. First the socket: which address and port the connection arrived on. Second, inside that group, the Host header is compared with server_name. Third, if nothing matches, the default server of that port. Only then, location — Chapter 2.' },
  { t: 'Measured: a specific address beats the wildcard', body: ngc(bo(O('file:/tmp/ng/conf/listen.conf')).split('\n').slice(4, 9).map((l) => l.replace(/\s+return 200 "([^"]*)\\n";/, ' # $1')).join('\n'), { sm: true }) + two(
      tn(bo([lenh('socket', /^\$ curl -s http:\/\/127\.0\.0\.1:8090/), lenh('socket', /127\.0\.0\.2/), lenh('socket', /ss -tlnp/)].join('\n')), { wrap: 52, fs: 14 }),
    box('One socket on 0.0.0.0:8090 — two blocks', 'ss shows a single listening socket. Nginx binds the wildcard once and, for each connection, looks at the address it ARRIVED on: 127.0.0.2 goes to the specific block B, every other address to A.', 'xanh')),
    en: 'Block A listens on port 8090 on every address; block B on 127.0.0.2:8090 only. A request to 127.0.0.2 reaches B; to 127.0.0.1, A. ss shows only one socket: Nginx binds the wildcard and decides by the address each connection arrived on.' },
  { t: '127.0.0.1 is a real security measure', body: tn(bo([lenh('socket', /8091\/$/), lenh('socket', /hostname -I$/), lenh('socket', /8091\/ \|\|/), lenh('socket', /8090\/$/)].join('\n')).replace(/\$\(hostname -I \| awk '\{print \$1\}'\)/g, '$IP'), { wrap: 100, fs: 15 }) +
    two(box('Not reachable — by construction', 'The block on 127.0.0.1:8091 answers on the machine, and the container\'s own network address gets <code>curl</code> exit code 7: connection refused. No firewall rule involved.', 'xanh'),
      box('Use it for admin and status pages', 'A mistaken location, an auth bug, a missing firewall rule — none can expose a socket that is not listening where anyone can connect.', 'lam')),
    en: 'Block C listens only on 127.0.0.1:8091. From the machine itself it answers; from the container\'s network address 172.17.0.5, curl exits with code 7, connection refused. Binding admin pages to loopback is real security, not configuration luck.' },
  { t: 'Flags belong to the PORT, not to the block', body: cmp(['Flag on listen', 'What it changes', 'Rule'], [
      ['<code>default_server</code>', 'which block answers when no name matches', 'ONE block per address:port'],
      ['<code>ssl</code>', 'the port speaks TLS', 'applies to EVERY block on that port'],
      ['<code>http2</code>', 'the port speaks HTTP/2 (1.24)', 'per port'],
      ['<code>reuseport</code>', 'one listening socket per worker', 'may appear ONCE per address:port'],
    ]) + tn(bo([lenh('loi', /hai-default/), lenh('loi', /reuse/)].join('\n')), { wrap: 110, fs: 14 }),
    en: 'default_server, ssl, http2 and reuseport are properties of the listening socket, not of a block. Real errors: two default_server flags on port 8092 — a duplicate default server; reuseport twice on 8093 — duplicate listen options.' },
  { t: 'ssl on ONE block makes the whole port TLS', body: ngc(bo(O('file:/tmp/ng/conf/ssl.conf')).split('\n').slice(4, 10).join('\n'), { sm: true, hl: [4, 5] }) +
    tn(bo([lenh('ssl', /8095\/ -H 'Host: b.test' \|/), lenh('ssl', /https/)].join('\n')), { wrap: 110, fs: 14 }) +
    box('b.test never wrote "ssl" — and still speaks only TLS', 'Plain HTTP to port 8095 gets 400 "The plain HTTP request was sent to HTTPS port". Think "how is THIS PORT configured", not "how is this block configured".', 'do2'),
    en: 'a.test listens on 8095 with ssl; b.test on the same port without it. A plain HTTP request for b.test gets 400: plain HTTP sent to an HTTPS port. Over HTTPS, b.test answers. The flag belongs to the port, so it applies to every block on it.' },
  { t: 'Port already taken? Ask ss, do not read configs', body: tn(bo([lenh('loi', /trung-cong/).split('\n').slice(0, 5).join('\n'), '…', lenh('loi', /ss -tlnp/)].join('\n')), { wrap: 112, fs: 14 }) +
    box('98: Address already in use', 'Something else holds that port — usually an old Nginx that did not exit, or Apache. <code>ss -tlnp</code> names the process and its pid, faster than any amount of reading.', 'lam'),
    en: 'Starting a second configuration on port 8090 fails: bind to 0.0.0.0:8090 failed, 98, Address already in use. ss -tlnp names the process holding the port — here the first Nginx, pid 1430.' },
  { t: 'IPv6 usually needs its own listen line', body: tn(bo(O('ipv6')).replace(/\|\| echo/, '|| echo'), { wrap: 112, fs: 15 }) +
    two(box('Measured on nginx 1.24', '<code>listen [::]:8094;</code> answers on <code>[::1]</code> and refuses IPv4 (curl exit 7): <code>ipv6only=on</code> is the default.', 'xanh'),
      box('So write both', `${c('listen 80;')} and ${c('listen [::]:80;')} — a site that works from one network and times out from another is very often this.`, 'lam')),
    en: 'A block with listen [::]:8094 answers over IPv6 and refuses IPv4: ipv6only is on by default. So a dual-stack site needs both listen 80 and listen [::]:80.' },
  { t: 'Read a config by PORT, not by FILE', body: ngc(`# every listen and server_name in effect — includes expanded
nginx -T | grep -nE '^\\s*(listen|server_name)'
# who is REALLY listening, and which process
ss -tlnp | grep nginx`) + icards([
      ['search', 'Ask the right question', '"Which blocks share port 443, and which one is the default?" — not "what does this file say?"'],
      ['layers', 'Two sites stepping on each other', 'One grep over nginx -T shows it on one screen; reading file by file never will.'],
      ['warn', 'Behind a proxy', '$scheme says http even if the user typed https — Chapter 3 and 11 fix that with forwarded headers.'],
    ], 3),
    en: 'Read a configuration by port, not by file: nginx -T piped to grep for listen and server_name shows every block per port on one screen, and ss -tlnp shows what is really listening.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('listen', 'the address:port socket a server block is attached to'),
      kw('address:port pair', 'the FIRST filter — blocks on other sockets are not candidates'),
      kw('0.0.0.0 vs 127.0.0.1', 'every interface vs loopback only'),
      kw('default_server / ssl / reuseport', 'flags of the SOCKET — once per address:port'),
      kw('ipv6only=on', '[::]:80 serves IPv6 only; add listen 80 for IPv4'),
      kw('ss -tlnp', 'which process really holds a port'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: listen, the address:port pair, wildcard versus loopback, socket flags like default_server, ssl and reuseport, ipv6only, and ss -tlnp.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Two blocks: ${c('listen 8090')} and ${c('listen 127.0.0.2:8090')}; curl both addresses`,
      `Bind a block to ${c('127.0.0.1')}; try it from another address`,
      `Put ${c('ssl')} on one of two blocks on a port; send plain HTTP to the other`,
      `Start a second nginx on a used port; find the owner with ${c('ss -tlnp')}`,
    ]), box('Keep these', `<ul><li>Socket first, name second</li><li>Specific address beats wildcard</li><li>Loopback = unreachable by design</li><li>Flags belong to the port</li></ul>`, 'lam'), ''),
    en: 'Your turn: specific versus wildcard, loopback reachability, ssl on one block of a shared port, and a port conflict found with ss. Keep: socket first, specific beats wildcard, loopback is unreachable by design, flags belong to the port.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — How a request finds a server block', bai: '1.1' }, S);
