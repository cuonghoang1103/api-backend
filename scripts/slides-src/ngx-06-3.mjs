/**
 * ngx-06-3 — Nginx · Chapter 6 · Lesson 6.3 "What a handshake costs, and why reusing connections is everything" (deck video + web, 12/11/2026).
 * Bài web: nginx-6-3-gia-cua-bat-tay. Output THẬT (scratchpad/ngx/demo/n6-3.txt; nginx/1.24.0; loopback, máy dùng chung ⇒ "số đo của khoá"):
 * curl tách giai đoạn: TCP 0,25 ms · TLS xong 3,1 ms; 20 lần: TLS 1.3 trung vị 2,29 ms · TLS 1.2 2,41 ms; RSA 3,00 ms · ECDSA 2,66 ms;
 * 100 request qua 1 kết nối = 0,23 ms/request · qua 100 kết nối = 7,58 ms/request (~33×); nối lại phiên TLS 1.2: cache ⇒ 5/5 Reused, không cache ⇒ 0;
 * log $ssl_session_reused: có cache ". r r", không ". . ." (cả TLS 1.2 lẫn 1.3), bắt tay nối lại 0,4–1,2 ms.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n6-3:file:/tmp/ng/conf/phien.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  log_format tls '$connection $connection_requests $ssl_protocol $ssl_session_reused';\n  ssl_certificate     /root/pki/fullchain.crt;      # RSA 2048\n  ssl_certificate_key /root/pki/la.key;\n  ssl_certificate     /root/pki/fullchain-ec.crt;   # ECDSA P-256\n  ssl_certificate_key /root/pki/la-ec.key;\n  ssl_session_tickets off;\n  server {                                   # CÓ cache phiên dùng chung\n    listen 8443 ssl;\n    server_name vidu.com;\n    ssl_session_cache   shared:SSL:10m;\n    ssl_session_timeout 1d;\n    access_log /tmp/ng/logs/8443.log tls;\n    return 200 \"ok\\n\";\n  }\n  server {                                   # KHÔNG cache phiên (mặc định: none)\n    listen 8445 ssl;\n    server_name vidu.com;\n    access_log /tmp/ng/logs/8445.log tls;\n    return 200 \"ok\\n\";\n  }\n}\n",
 "n6-3:file:/root/do-tls.sh": "#!/bin/bash\n# do-tls.sh <số lần> <cờ curl…> — trung vị + nhỏ nhất của RIÊNG phần TLS (time_appconnect - time_connect), mili giây\nn=$1; shift\nfor i in $(seq $n); do curl -s -o /dev/null --cacert /root/pki/root.crt -w '%{time_connect} %{time_appconnect}\\n' \"$@\"; done |\n  awk '{printf \"%.3f\\n\", ($2-$1)*1000}' | sort -n | awk '{a[NR]=$1} END {printf \"trung vi %.2f ms (min %.2f)\\n\", a[int((NR+1)/2)], a[1]}'\n",
 "n6-3:file:/root/tai-dung.sh": "#!/bin/bash\n# tai-dung.sh — 100 request: một lệnh curl (MỘT kết nối, tái dùng) vs 100 lệnh curl (100 kết nối riêng)\nU=https://vidu.com:8443/; : > /tmp/ng/logs/8443.log\nt0=$(date +%s%N); curl -s --cacert /root/pki/root.crt $(for i in $(seq 100); do printf -- '-o /dev/null %s ' $U; done); t1=$(date +%s%N)\nk1=$(cut -d' ' -f1 /tmp/ng/logs/8443.log | sort -u | wc -l); : > /tmp/ng/logs/8443.log\nt2=$(date +%s%N); for i in $(seq 100); do curl -s -o /dev/null --cacert /root/pki/root.crt $U; done; t3=$(date +%s%N)\nk2=$(cut -d' ' -f1 /tmp/ng/logs/8443.log | sort -u | wc -l)\nawk -v a=$(( (t1-t0)/1000 )) -v b=$(( (t3-t2)/1000 )) -v k1=$k1 -v k2=$k2 'BEGIN {\n  printf \"100 request qua %3d ket noi : %6.0f ms tong = %5.2f ms/request\\n\", k1, a/1000, a/100000\n  printf \"100 request qua %3d ket noi : %6.0f ms tong = %5.2f ms/request\\n\", k2, b/1000, b/100000 }'\n",
 "n6-3:setup": "",
 "n6-3:giaidoan": "$ curl -s -o /dev/null --cacert pki/root.crt -w 'TCP xong %{time_connect}s | TLS xong %{time_appconnect}s | byte dau %{time_starttransfer}s | tong %{time_total}s\\n' https://vidu.com:8443/\nTCP xong 0.000247s | TLS xong 0.003105s | byte dau 0.003283s | tong 0.003313s",
 "n6-3:tls1312": "$ for v in 1.3 1.2; do printf 'TLS %s : ' $v; bash do-tls.sh 20 --tlsv$v --tls-max $v https://vidu.com:8443/; done\nTLS 1.3 : trung vi 2.29 ms (min 2.03)\nTLS 1.2 : trung vi 2.41 ms (min 2.14)",
 "n6-3:rsaec": "$ for c in ECDHE-RSA-AES128-GCM-SHA256 ECDHE-ECDSA-AES128-GCM-SHA256; do printf '%-31s: ' $c; bash do-tls.sh 20 --tlsv1.2 --tls-max 1.2 --ciphers $c https://vidu.com:8443/; done\nECDHE-RSA-AES128-GCM-SHA256    : trung vi 3.00 ms (min 2.73)\nECDHE-ECDSA-AES128-GCM-SHA256  : trung vi 2.66 ms (min 2.15)",
 "n6-3:taidung": "$ bash tai-dung.sh\n100 request qua   1 ket noi :     23 ms tong =  0.23 ms/request\n100 request qua 100 ket noi :    758 ms tong =  7.58 ms/request",
 "n6-3:noilai": "$ for p in 8443 8445; do printf 'cong %s, 6 lan noi (1 + 5 lan noi lai), Reused: ' $p; openssl s_client -connect 127.0.0.1:$p -servername vidu.com -tls1_2 -reconnect </dev/null 2>/dev/null | grep -c '^Reused'; done\ncong 8443, 6 lan noi (1 + 5 lan noi lai), Reused: 5\ncong 8445, 6 lan noi (1 + 5 lan noi lai), Reused: 0\n$ for v in 1.2 1.3; do for p in 8443 8445; do : > /tmp/ng/logs/$p.log; curl -s -H 'Connection: close' --tlsv$v --tls-max $v --cacert pki/root.crt -w '%{time_connect} %{time_appconnect}\\n' -o /dev/null https://vidu.com:$p/ -o /dev/null https://vidu.com:$p/ -o /dev/null https://vidu.com:$p/ | awk '{printf \"%.1fms \", ($2-$1)*1000}' > /tmp/ng/ms; sleep 0.2; printf 'TLS %s cong %s  log: %-38s TLS: %s\\n' $v $p \"$(cut -d' ' -f1,4 /tmp/ng/logs/$p.log | paste -sd'|')\" \"$(cat /tmp/ng/ms)\"; done; done\nTLS 1.2 cong 8443  log: 195 .|196 r|197 r                      TLS: 2.3ms 0.5ms 0.4ms \nTLS 1.2 cong 8445  log: 198 .|199 .|200 .                      TLS: 2.3ms 1.2ms 1.0ms \nTLS 1.3 cong 8443  log: 201 .|202 r|203 r                      TLS: 2.3ms 0.8ms 1.2ms \nTLS 1.3 cong 8445  log: 204 .|205 .|206 .                      TLS: 2.1ms 1.3ms 1.2ms "
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, meter, seq } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-06-3', code: 'NGX 6.3', title: 'What a handshake costs, and why reuse is everything', sub: 'Chapter 6 · Lesson 6.3' };
const O = (k) => { const v = DU_LIEU[`n6-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const gon = (s) => s.replace(/\$ for v in 1\.2 1\.3; do for p in 8443 8445; do : >.*$/m, "$ for v in 1.2 1.3; do for p in 8443 8445; do curl -H 'Connection: close' … 3 URL … ; done; done")
  .replace(/\$ for p in 8443 8445; do printf 'cong %s, 6 lan .*$/m, '$ for p in 8443 8445; do openssl s_client … -tls1_2 -reconnect | grep -c ^Reused; done')
  .replace(/\$ curl -s -o \/dev\/null --cacert pki\/root.crt -w .*$/m, "$ curl -s -o /dev/null -w '…%{time_connect}…%{time_appconnect}…' https://vidu.com:8443/");

export const S = [
  { cover: true, nhan: 'Chapter 6 · Lesson 6.3', t: 'What a handshake costs,<br>and why reuse is everything', sub: 'People argue about TLS 1.3 vs 1.2. The number that matters is how many handshakes you do at all',
    en: 'Lesson 6.3. People argue about TLS one point three against one point two, or RSA against ECDSA. Measured, those differ by a fraction of a millisecond. The number that matters is how many handshakes you do at all.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The handshake, separated from everything else</li>
    <li>TLS 1.3 vs 1.2, RSA vs ECDSA — the small differences</li>
    <li>100 requests: one connection vs one hundred</li>
    <li>Session resumption, visible in the access log</li>
    <li>The four lines in the http block</li></ul>`,
    en: 'Five takeaways: the handshake measured on its own; the small differences between versions and key types; one connection against a hundred; session resumption in the log; and the four lines to write.' },
  { t: 'The handshake, separated', body: tn(gon(O('giaidoan')), { fs: 14, wrap: 120 }) +
    seq(['curl', 'nginx :8443'], [[0, 1, 'TCP SYN → SYN-ACK → ACK   (0.25 ms)'], [0, 1, 'ClientHello'], [1, 0, 'ServerHello + certificate + key share', '#e0590b'], [0, 1, 'Finished'], [0, 1, 'GET /', '#2563eb'], [1, 0, '200 ok — first byte', '#008a34']], { w: 1110, rh: 40 }),
    en: 'curl can split one request into phases. TCP was ready after a quarter of a millisecond, TLS after about three: almost the whole cost of this request is the handshake. The gap between connect and app connect is the handshake and nothing else.' },
  { t: 'Versions and key types: small differences', body: tn(O('tls1312') + '\n' + O('rsaec'), { fs: 13, wrap: 120 }) +
    meter([['TLS 1.3', 2.29, '#008a34'], ['TLS 1.2', 2.41, '#2563eb'], ['TLS 1.2 · RSA 2048', 3.00, '#c0392b'], ['TLS 1.2 · ECDSA P-256', 2.66, '#008a34']], { don: 'ms (median of 20)', rh: 44, fs: 19, nhan: 330 }),
    en: 'Twenty handshakes each, median. TLS one point three, two point two nine milliseconds; one point two, two point four one. RSA three milliseconds, ECDSA two point six six. Real, but tenths of a millisecond. These are the course\'s numbers, on a shared loopback machine.' },
  { t: 'The number that matters: reuse', body: tn(O('taidung'), { fs: 15, wrap: 110 }) +
    meter([['100 requests, ONE connection', 0.23, '#008a34'], ['100 requests, 100 connections', 7.58, '#c0392b']], { don: 'ms per request', rh: 64, fs: 21, nhan: 420 }) +
    box('About 33 times', 'Part of 7.58 ms is starting a curl process each time — but the handshake is paid 100 times instead of once. Keepalive, HTTP/2, resumption: everything that keeps a connection open is worth more than any cipher choice.', 'lam'),
    en: 'The number that matters. One hundred requests over one connection: a quarter of a millisecond each. Over one hundred connections: seven and a half. Part of that is starting curl each time, but the handshake is paid a hundred times instead of once.' },
  { t: 'Session resumption, in the access log', body: tn(gon(O('noilai')), { fs: 13, wrap: 120 }) +
    cmp(['', 'shared:SSL:10m', 'no session cache (default: none)'], [
      ['openssl -reconnect, TLS 1.2', '<b>5 / 5</b> reused', '0 / 5'],
      ['<code>$ssl_session_reused</code> in the log', '<code>. r r</code>', '<code>. . .</code>'],
      ['resumed handshake', '~0.4–1.2 ms', 'full handshake every time'],
    ], { hl: [1] }),
    en: 'Session resumption. With the shared session cache, five reconnections out of five reused the session, and the log variable shows dot, r, r. Without it: dot, dot, dot — a full handshake every time, for TLS one point two and one point three alike.' },
  { t: 'The four lines in the http block', body: two(ngc(`http {
  ssl_session_cache   shared:SSL:10m;  # ~40,000
  ssl_session_timeout 1d;
  ssl_session_tickets off;
  keepalive_timeout   75s;             # default
}`, { sm: true, hl: [2, 4] }), icards([
      ['warn', 'Default is none', 'without the cache every reconnect is a full handshake'],
      ['key', 'shared:', 'one cache for every worker — per-worker caches miss'],
      ['lock', 'Tickets off', 'Nginx never rotates the ticket key; a long-lived key weakens forward secrecy'],
    ], 1), 'r64'),
    en: 'The four lines: a shared session cache of ten megabytes, about forty thousand sessions; a one day timeout; session tickets off, because Nginx never rotates the ticket key by itself; and keepalive, which is already on by default and does the heaviest lifting.' },
  { t: 'Verify it on your own server', body: icards([
      ['gauge', 'curl splits the phases', '<code>-w \'%{time_connect} %{time_appconnect}\'</code> — the gap is the handshake'],
      ['page', 'Log the resumption rate', '<code>$ssl_session_reused</code> near zero for returning visitors = cache missing, too small, or a load balancer scattering clients'],
      ['count', 'Connections next to requests', '<code>ss -tn state established \'( sport = :443 )\' | wc -l</code> — one request per connection means keepalive is not working'],
      ['key', 'Try ECDSA', 'add a second pair next to RSA and re-run the same measurement'],
    ], 2),
    en: 'To verify on your own server: let curl split the phases; log the resumption variable; count established connections next to the request rate; and try an ECDSA certificate next to RSA, then measure again.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Handshake', 'the setup before the first encrypted byte'),
      kw('time_appconnect', 'curl: when TLS was ready'),
      kw('Keepalive', 'reuse one connection for many requests'),
      kw('ssl_session_cache shared:SSL:10m', 'resumption across all workers'),
      kw('ssl_session_tickets', 'stateless resumption — off unless you rotate keys'),
      kw('$ssl_session_reused', '"r" when a session was resumed'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the handshake, time app connect, keepalive, the shared session cache, session tickets, and the session reused variable.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Split one request with ${c('curl -w')}`,
      `20 handshakes each: TLS 1.3 vs 1.2, RSA vs ECDSA`,
      `100 requests: one curl vs 100 curls`,
      `Log ${c('$ssl_session_reused')}; add the session cache; compare`,
      `Count established connections next to requests with ${c('ss -tn')}`,
    ]), box('Keep these', `<ul><li>A handshake ≈ milliseconds</li><li>A reused request ≈ a quarter of one</li><li>Turn on the shared cache</li><li>Tickets off</li></ul>`, 'lam'), ''),
    en: 'Your turn: split a request with curl, time the versions and key types, compare one connection with a hundred, and log session reuse before and after adding the cache. Keep: a handshake costs milliseconds; a reused request a fraction of one.' },
];
export const slides = lamDeck({ chuong: 'Chapter 6 — TLS and HTTP/2', bai: '6.3' }, S);
