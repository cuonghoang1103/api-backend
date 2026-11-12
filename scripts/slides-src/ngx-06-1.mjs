/**
 * ngx-06-1 — Nginx · Chapter 6 · Lesson 6.1 "The certificate chain, and the intermediate everyone forgets" (deck video + web, 12/11/2026).
 * Bài web: nginx-6-1-chuoi-chung-chi. Output THẬT (scratchpad/ngx/demo/n6-1.txt; nginx/1.24.0 · OpenSSL 3.0 · Ubuntu 24.04): chuỗi 3 tầng dựng bằng openssl
 * (Lab Root CA → Lab Intermediate CA → vidu.com, SAN vidu.com + www); 8443 fullchain ⇒ 2 chứng chỉ, Verify 0; 8444 chỉ lá ⇒ 1 chứng chỉ, Verify 21, curl (60);
 * nối bằng IP không -servername ⇒ chứng chỉ MẶC ĐỊNH (Verify 18); nối bằng TÊN ⇒ OpenSSL 3 tự gửi SNI; checkend 21 ngày / 100 ngày; RSA 2048 vs ECDSA 256 cùng khối;
 * `http2 on;` trên 1.24.0 ⇒ unknown directive; thay tệp trên đĩa ⇒ nginx vẫn gửi serial CŨ tới khi reload.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n6-1:file:/root/tao-chuoi.sh": "#!/bin/bash\n# tao-chuoi.sh — dựng một chuỗi 3 tầng THẬT: Root CA -> Trung gian -> lá vidu.com (SAN vidu.com, www.vidu.com)\nset -e; mkdir -p /root/pki && cd /root/pki\nopenssl req -x509 -newkey rsa:2048 -nodes -keyout root.key -out root.crt -days 3650 -subj \"/CN=Lab Root CA\" 2>/dev/null\nopenssl req -newkey rsa:2048 -nodes -keyout tg.key -out tg.csr -subj \"/CN=Lab Intermediate CA\" 2>/dev/null\nprintf 'basicConstraints=critical,CA:TRUE,pathlen:0\\nkeyUsage=critical,keyCertSign,cRLSign\\n' > tg.ext\nopenssl x509 -req -in tg.csr -CA root.crt -CAkey root.key -CAcreateserial -out tg.crt -days 1825 -extfile tg.ext 2>/dev/null\nopenssl req -newkey rsa:2048 -nodes -keyout la.key -out la.csr -subj \"/CN=vidu.com\" 2>/dev/null\nprintf 'subjectAltName=DNS:vidu.com,DNS:www.vidu.com\\nbasicConstraints=CA:FALSE\\nextendedKeyUsage=serverAuth\\n' > la.ext\nopenssl x509 -req -in la.csr -CA tg.crt -CAkey tg.key -CAcreateserial -out la.crt -days 90 -extfile la.ext 2>/dev/null\ncat la.crt tg.crt > fullchain.crt\n# lá ECDSA cùng tên (để một khối server giữ HAI chứng chỉ)\nopenssl req -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -nodes -keyout la-ec.key -out la-ec.csr -subj \"/CN=vidu.com\" 2>/dev/null\nopenssl x509 -req -in la-ec.csr -CA tg.crt -CAkey tg.key -CAcreateserial -out la-ec.crt -days 90 -extfile la.ext 2>/dev/null\ncat la-ec.crt tg.crt > fullchain-ec.crt\n# máy MẶC ĐỊNH: chứng chỉ tự ký, tên khác — để thử SNI\nopenssl req -x509 -newkey rsa:2048 -nodes -keyout md.key -out md.crt -days 30 -subj \"/CN=may-mac-dinh\" 2>/dev/null\nfor f in root tg la; do printf '%-5s ' $f.crt; openssl x509 -in $f.crt -noout -subject -issuer | paste -sd' '; done\n",
 "n6-1:file:/tmp/ng/conf/chuoi.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {                                   # máy MẶC ĐỊNH của cổng 8443\n    listen 8443 ssl default_server;\n    ssl_certificate     /root/pki/md.crt;\n    ssl_certificate_key /root/pki/md.key;\n    return 200 \"may mac dinh\\n\";\n  }\n  server {                                   # ĐÚNG: lá + trung gian\n    listen 8443 ssl;\n    server_name vidu.com www.vidu.com;\n    ssl_certificate     /root/pki/fullchain.crt;\n    ssl_certificate_key /root/pki/la.key;\n    ssl_certificate     /root/pki/fullchain-ec.crt;   # cặp thứ hai: ECDSA\n    ssl_certificate_key /root/pki/la-ec.key;\n    return 200 \"xin chao tu vidu.com\\n\";\n  }\n  server {                                   # SAI: chỉ mỗi cái lá\n    listen 8444 ssl;\n    server_name vidu.com;\n    ssl_certificate     /root/pki/la.crt;\n    ssl_certificate_key /root/pki/la.key;\n    return 200 \"xin chao tu vidu.com\\n\";\n  }\n}\n",
 "n6-1:setup": "",
 "n6-1:chuoi": "$ bash tao-chuoi.sh\nroot.crt subject=CN = Lab Root CA issuer=CN = Lab Root CA\ntg.crt subject=CN = Lab Intermediate CA issuer=CN = Lab Root CA\nla.crt subject=CN = vidu.com issuer=CN = Lab Intermediate CA",
 "n6-1:haicong": "$ for p in 8443 8444; do echo \"== cong $p\"; openssl s_client -connect 127.0.0.1:$p -servername vidu.com -CAfile pki/root.crt </dev/null 2>&1 | grep -E '^ [0-9] s:|Verify return code'; done\n== cong 8443\n 0 s:CN = vidu.com\n 1 s:CN = Lab Intermediate CA\nVerify return code: 0 (ok)\n== cong 8444\n 0 s:CN = vidu.com\nVerify return code: 21 (unable to verify the first certificate)\n$ curl -s --cacert pki/root.crt https://vidu.com:8443/\nxin chao tu vidu.com\n$ curl -sS --cacert pki/root.crt https://vidu.com:8444/\ncurl: (60) SSL certificate problem: unable to get local issuer certificate\nMore details here: https://curl.se/docs/sslcerts.html\n\ncurl failed to verify the legitimacy of the server and therefore could not\nestablish a secure connection to it. To learn more about this situation and\nhow to fix it, please visit the web page mentioned above.",
 "n6-1:sni": "$ openssl s_client -connect 127.0.0.1:8443 -CAfile pki/root.crt </dev/null 2>&1 | grep -E '^ [0-9] s:|Verify return code'\n 0 s:CN = may-mac-dinh\nVerify return code: 18 (self-signed certificate)\n$ openssl s_client -connect vidu.com:8443 -CAfile pki/root.crt </dev/null 2>&1 | grep -E '^ [0-9] s:|Verify return code'\n 0 s:CN = vidu.com\n 1 s:CN = Lab Intermediate CA\nVerify return code: 0 (ok)",
 "n6-1:han": "$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2>/dev/null | openssl x509 -noout -dates -subject\nnotBefore=Nov 12 15:50:36 2026 GMT\nnotAfter=Feb 10 15:50:36 2027 GMT\nsubject=CN = vidu.com\n$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2>/dev/null | openssl x509 -noout -text | grep -A1 'Subject Alternative Name'\n            X509v3 Subject Alternative Name: \n                DNS:vidu.com, DNS:www.vidu.com\n$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2>/dev/null | openssl x509 -noout -checkend $((21*86400))\nCertificate will not expire\n$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2>/dev/null | openssl x509 -noout -checkend $((100*86400))\nCertificate will expire",
 "n6-1:haikhoa": "$ for c in ECDHE-RSA-AES128-GCM-SHA256 ECDHE-ECDSA-AES128-GCM-SHA256; do printf '%-32s' $c; openssl s_client -connect 127.0.0.1:8443 -servername vidu.com -tls1_2 -cipher $c </dev/null 2>&1 | grep -E 'Server public key' ; done\nECDHE-RSA-AES128-GCM-SHA256     Server public key is 2048 bit\nECDHE-ECDSA-AES128-GCM-SHA256   Server public key is 256 bit",
 "n6-1:file:/tmp/ng/conf/h2.conf": "events {}\nhttp {\n  server {\n    listen 9443 ssl;\n    http2 on;\n    ssl_certificate     /root/pki/fullchain.crt;\n    ssl_certificate_key /root/pki/la.key;\n  }\n}\n",
 "n6-1:http2": "$ nginx -v\nnginx version: nginx/1.24.0 (Ubuntu)\n$ nginx -t -c /tmp/ng/conf/h2.conf\n2026/11/12 15:50:37 [emerg] 3706#3706: unknown directive \"http2\" in /tmp/ng/conf/h2.conf:5\nnginx: configuration file /tmp/ng/conf/h2.conf test failed",
 "n6-1:giahan": "$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2>/dev/null | openssl x509 -noout -serial\nserial=5A149BF0E5BC69E3B738D18BC45E5FB746867169\n$ cd pki && openssl x509 -req -in la.csr -CA tg.crt -CAkey tg.key -CAcreateserial -out la.crt -days 90 -extfile la.ext 2>/dev/null && cat la.crt tg.crt > fullchain.crt && openssl x509 -in la.crt -noout -serial | sed 's/^/tren dia: /'\ntren dia: serial=5A149BF0E5BC69E3B738D18BC45E5FB74686716B\n$ echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2>/dev/null | openssl x509 -noout -serial | sed 's/^/nginx dang gui: /'\nnginx dang gui: serial=5A149BF0E5BC69E3B738D18BC45E5FB746867169\n$ nginx -s reload -c /tmp/ng/conf/chuoi.conf; sleep 0.5; echo | openssl s_client -connect 127.0.0.1:8443 -servername vidu.com 2>/dev/null | openssl x509 -noout -serial | sed 's/^/sau reload: /'\nsau reload: serial=5A149BF0E5BC69E3B738D18BC45E5FB74686716B\n2026/11/12 15:54:07 [notice] 5790#5790: signal process started"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, flow, seq } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-06-1', code: 'NGX 6.1', title: 'The certificate chain, and the intermediate everyone forgets', sub: 'Chapter 6 · Lesson 6.1' };
const O = (k) => { const v = DU_LIEU[`n6-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const goc = (s) => s.replace(/\/tmp\/ng\/conf\//g, '').replace(/\/root\/pki\//g, 'pki/');

export const S = [
  { cover: true, nhan: 'Chapter 6 · Lesson 6.1', t: 'The certificate chain,<br>and the intermediate everyone forgets', sub: 'Four lines turn HTTPS on. One wrong file name makes it work in your browser and fail for everybody else',
    en: 'Lesson 6.1. Four lines turn HTTPS on. One wrong file name makes it work perfectly in your own browser and fail for a large share of real clients. We build a real three-level chain and measure both files.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The four lines — and the <code>http2</code> line that changed syntax</li>
    <li>What a chain is, and why there are TWO files</li>
    <li>fullchain vs the leaf alone, measured</li>
    <li>SNI: which certificate you are actually handed</li>
    <li>Reading a certificate from outside: dates, names, expiry</li>
    <li>Two keys in one block, and a renewal that does nothing until reload</li></ul>`,
    en: 'Six takeaways: the four lines; what a chain is; fullchain against the leaf alone; SNI; reading a certificate from outside; and two keys in one block plus a renewal that does nothing until you reload.' },
  { t: 'Four lines — and the http2 line that moved', to: true, body: ngc(`server {
  listen 443 ssl;
  http2 on;               # nginx >= 1.25.1 only
  server_name vidu.com;
  ssl_certificate     /etc/letsencrypt/live/vidu.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/vidu.com/privkey.pem;
}`, { sm: true, hl: [3, 5, 6] }) +
    tn(goc(O('http2')), { fs: 15, wrap: 110 }) + (box('Check your version first', 'Up to 1.25.0 HTTP/2 is a parameter: <code>listen 443 ssl http2;</code>. From 1.25.1 it is its own directive. Ubuntu 24.04 ships <b>1.24.0</b> — the new form does not even load.', 'do2')),
    en: 'Four lines: listen with ssl, the server name, the certificate and the key. The http2 line changed syntax: up to 1.25.0 it is a parameter of listen, from 1.25.1 its own directive. On Ubuntu 24.04, nginx 1.24, the new form fails with unknown directive.' },
  { t: 'What a chain is, and why there are TWO files', body: flow([
      { t: 'Root CA', s: 'in every trust store', mau: '#64748b' }, { t: 'Intermediate CA', s: 'signed by root — only YOU send it', mau: '#e0590b' },
      { t: 'Your leaf', s: 'your names · 90 days', mau: '#008a34' }], { h: 150 }) +
    cmp(['File (certbot)', 'Contains', 'Goes into'], [
      ['<code>fullchain.pem</code>', 'leaf + intermediate, in that order', '<code>ssl_certificate</code> ✔'],
      ['<code>cert.pem</code>', 'the leaf ALONE', 'nothing — this is the trap'],
      ['<code>privkey.pem</code>', 'the private key — never leaves the server', '<code>ssl_certificate_key</code>'],
    ], { hl: [1] }) + box('Why it "works on my machine"', 'Browsers CACHE intermediates they have seen on other sites, and some fetch a missing one themselves. A fresh phone, an Android app, curl or a payment gateway does not — they fail.', 'do2'),
    en: 'A chain has three levels. The root is in every trust store. The intermediate is signed by the root and signs your certificate — but it is not in any trust store, so the client can only get it from you. That is why ssl certificate must point at fullchain, never at cert dot pem.' },
  { t: 'Measured: fullchain vs the leaf alone', body: tn(goc(O('haicong')).split('\n').slice(0, 9).join('\n'), { fs: 14, wrap: 110 }) +
    two(box('Port 8443 — fullchain', '2 certificates sent · <b>Verify return code: 0 (ok)</b> · curl prints the page.', 'xanh'),
      box('Port 8444 — the leaf alone', '1 certificate sent · <b>Verify return code: 21</b> · curl (60): <i>unable to get local issuer certificate</i>.', 'do2')),
    en: 'Measured with a client that trusts only the root, like a fresh browser. Fullchain: two certificates sent, verify code zero, curl gets the page. The leaf alone: one certificate, code twenty one, and curl refuses. Your own browser may still show a padlock — it cached the intermediate.' },
  { t: 'SNI: which certificate you are actually handed', body: tn(goc(O('sni')), { fs: 15, wrap: 110 }) +
    seq(['client', 'nginx :8443'], [[0, 1, 'ClientHello — no name (connected by IP)'], [1, 0, 'default_server: CN = may-mac-dinh', '#c0392b'], [0, 1, 'ClientHello + SNI vidu.com'], [1, 0, 'vidu.com + intermediate', '#008a34']], { w: 1110, rh: 44 }),
    en: 'SNI is the name the client sends inside the handshake. Connected by IP, OpenSSL sends no name, so you get the default server\'s certificate. Connected by a name, OpenSSL 3 sends it by itself. When you check an origin by its IP — behind a CDN — always add minus servername.' },
  { t: 'Reading a certificate from outside', body: tn(goc(O('han')), { fs: 13, wrap: 120 }) + icards([
      ['clock', 'Dates', '<code>-dates</code>: notBefore / notAfter — Let\'s Encrypt gives 90 days'],
      ['list', 'Names (SAN)', 'the ONLY names it is valid for — the Common Name is ignored'],
      ['warn', 'A cron alarm', '<code>-checkend $((21*86400))</code> — "will expire" ⇒ wake someone'],
    ], 3),
    en: 'Reading a certificate from outside: the dates; the Subject Alternative Names, the only names it is valid for; and checkend, which answers will it expire within twenty one days. Run that last one in cron and you never learn about an expiry from a user.' },
  { t: 'Two keys in one block: RSA and ECDSA', to: true, body: ngc(`ssl_certificate     fullchain.crt;      # RSA 2048
ssl_certificate_key la.key;
ssl_certificate     fullchain-ec.crt;   # ECDSA P-256
ssl_certificate_key la-ec.key;`, { sm: true }) + tn(goc(O('haikhoa')).replace(/^\$ for c in .*$/m, '$ for c in ECDHE-RSA-… ECDHE-ECDSA-…; do openssl s_client -tls1_2 -cipher $c … | grep "Server public key"; done'), { fs: 15, wrap: 110 }) +
    box('Nginx picks per client', 'A client that offers ECDSA gets the 256-bit key — a cheaper handshake (Lesson 6.3 measures it). An old client still gets RSA. The private keys stay readable by root only.', 'lam'),
    en: 'One server block can hold two certificate pairs. Repeat the two lines, and Nginx chooses per client: a client offering ECDSA got the two hundred fifty six bit key, an RSA-only client got the two thousand forty eight bit one.' },
  { t: 'Renewed on disk is not renewed in Nginx', body: tn(goc(O('giahan')), { fs: 13, wrap: 120 }) +
    flow([{ t: 'certbot renew', s: 'day 60 of 90' }, { t: 'new file on disk', s: 'Nginx does not look', mau: '#e0590b' }, { t: 'nginx -s reload', s: 'deploy hook', mau: '#2563eb' }, { t: 'new serial served', s: 'verified from outside', mau: '#008a34' }], { h: 130 }),
    en: 'A renewal is two steps. We replaced the certificate on disk: Nginx kept sending the OLD serial number. Only after reload did the new one go out. With certbot, the deploy hook is where that reload belongs — and the ACME path on port 80 must stay reachable, Lesson 6.5.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('ssl_certificate / _key', 'the chained file and its private key'),
      kw('fullchain.pem vs cert.pem', 'leaf + intermediate, or the leaf alone'),
      kw('Intermediate CA', 'not in any trust store — only you can send it'),
      kw('SAN', 'the exact names a certificate is valid for'),
      kw('SNI', 'the name sent in the handshake; picks the server block'),
      kw('Verify return code 21', 'the signature of a missing intermediate'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: ssl certificate and key, fullchain against cert, the intermediate CA, SAN, SNI, and verify return code twenty one.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build a three-level chain with ${c('openssl')}`,
      `Serve fullchain on one port, the leaf alone on another`,
      `Check both with ${c('s_client -CAfile root.crt')}`,
      `Connect by IP without ${c('-servername')}; see the default`,
      `Replace the file; compare the serial before and after reload`,
    ]), box('Keep these', `<ul><li>Always fullchain</li><li>Code 21 = missing intermediate</li><li>By IP ⇒ add -servername</li><li>Renew = file + reload</li></ul>`, 'lam'), ''),
    en: 'Your turn: build a chain, serve both files, check them with a client that trusts only the root, connect by IP without a name, and replace the file before and after reload. Keep: always fullchain; code twenty one means a missing intermediate; renewing is a file plus a reload.' },
];
export const slides = lamDeck({ chuong: 'Chapter 6 — TLS and HTTP/2', bai: '6.1' }, S);
