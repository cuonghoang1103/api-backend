/**
 * ngx-06-2 — Nginx · Chapter 6 · Lesson 6.2 "Which protocol and which cipher are actually used" (deck video + web, 12/11/2026).
 * Bài web: nginx-6-2-giao-thuc-va-bo-ma. Output THẬT (scratchpad/ngx/demo/n6-2.txt; nginx/1.24.0 · OpenSSL 3.0): 8443 không khai gì, 8444 khai ssl_protocols
 * TLSv1.2 TLSv1.3 + 6 bộ mã ECDHE. Cả hai tự thương lượng TLSv1.3 TLS_AES_256_GCM_SHA384; -tls1/-tls1_1 ⇒ CLIENT tự từ chối (no protocols available);
 * client hạ SECLEVEL=0 chịu TLS 1.0 ⇒ MÁY CHỦ từ chối (alert protocol version) ở cả hai cổng. Quét 89 bộ mã TLS 1.2: 8444 nhận 3, 8443 nhận 27 — 16 cái không ECDHE.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n6-2:file:/tmp/ng/conf/tls.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  ssl_certificate     /root/pki/fullchain.crt;\n  ssl_certificate_key /root/pki/la.key;\n  server {                                   # MẶC ĐỊNH: không khai gì\n    listen 8443 ssl;\n    return 200 \"mac dinh\\n\";\n  }\n  server {                                   # HIỆN ĐẠI: khai tường minh\n    listen 8444 ssl;\n    ssl_protocols TLSv1.2 TLSv1.3;\n    ssl_prefer_server_ciphers off;\n    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;\n    return 200 \"hien dai\\n\";\n  }\n}\n",
 "n6-2:file:/root/bat-tay.sh": "#!/bin/bash\n# bat-tay.sh <cổng> [cờ openssl…] — bắt tay một lần, in giao thức + bộ mã, hoặc dòng lỗi\no=$(openssl s_client -connect 127.0.0.1:$1 -servername vidu.com \"${@:2}\" </dev/null 2>&1)\nif grep -q '^New, TLS' <<<\"$o\"; then grep -m1 '^New, ' <<<\"$o\" | sed 's/^New, //'; else grep -m1 -oE 'no protocols available|alert protocol version|alert handshake failure|wrong version number|no ciphers available' <<<\"$o\" || echo '(that bai)'; fi\n",
 "n6-2:file:/root/quet-bo-ma.sh": "#!/bin/bash\n# quet-bo-ma.sh <cổng> — thử TỪNG bộ mã TLS 1.2 mà OpenSSL biết (kể cả loại yếu, SECLEVEL=0), đếm cái được chấp nhận\nok=(); tong=0\nfor c in $(openssl ciphers -s -tls1_2 'ALL:COMPLEMENTOFALL:@SECLEVEL=0' | tr ':' ' '); do\n  tong=$((tong+1))\n  openssl s_client -connect 127.0.0.1:$1 -servername vidu.com -tls1_2 -cipher \"$c:@SECLEVEL=0\" </dev/null >/dev/null 2>&1 && ok+=(\"$c\")\ndone\necho \"cong $1: ${#ok[@]} chap nhan / $((tong-${#ok[@]})) tu choi (thu $tong bo ma TLS 1.2)\"\nprintf '%s\\n' \"${ok[@]}\" > /tmp/ng/ok-$1.txt\n",
 "n6-2:setup": "",
 "n6-2:giaothuc": "$ for p in 8443 8444; do printf 'cong %s tu thuong luong : ' $p; bash bat-tay.sh $p; done\ncong 8443 tu thuong luong : TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384\ncong 8444 tu thuong luong : TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384\n$ for v in tls1 tls1_1 tls1_2 tls1_3; do printf '%-8s 8443: %-46s 8444: %s\\n' -$v \"$(bash bat-tay.sh 8443 -$v)\" \"$(bash bat-tay.sh 8444 -$v)\"; done\n-tls1    8443: no protocols available                         8444: no protocols available\n-tls1_1  8443: no protocols available                         8444: no protocols available\n-tls1_2  8443: TLSv1.2, Cipher is ECDHE-RSA-AES256-GCM-SHA384 8444: TLSv1.2, Cipher is ECDHE-RSA-AES256-GCM-SHA384\n-tls1_3  8443: TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384      8444: TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384\n$ for p in 8443 8444; do printf 'cong %s, client CHIU TLS 1.0 : ' $p; bash bat-tay.sh $p -tls1 -cipher 'DEFAULT:@SECLEVEL=0'; done\ncong 8443, client CHIU TLS 1.0 : alert protocol version\ncong 8444, client CHIU TLS 1.0 : alert protocol version",
 "n6-2:boma": "$ bash quet-bo-ma.sh 8444; cat /tmp/ng/ok-8444.txt\ncong 8444: 3 chap nhan / 86 tu choi (thu 89 bo ma TLS 1.2)\nECDHE-RSA-AES256-GCM-SHA384\nECDHE-RSA-CHACHA20-POLY1305\nECDHE-RSA-AES128-GCM-SHA256\n$ bash quet-bo-ma.sh 8443; grep -v ECDHE /tmp/ng/ok-8443.txt | wc -l; grep -v ECDHE /tmp/ng/ok-8443.txt | paste -sd' '\ncong 8443: 27 chap nhan / 62 tu choi (thu 89 bo ma TLS 1.2)\n16\nAES256-GCM-SHA384 AES256-CCM8 AES256-CCM ARIA256-GCM-SHA384 AES128-GCM-SHA256 AES128-CCM8 AES128-CCM ARIA128-GCM-SHA256 AES256-SHA256 CAMELLIA256-SHA256 AES128-SHA256 CAMELLIA128-SHA256 AES256-SHA CAMELLIA256-SHA AES128-SHA CAMELLIA128-SHA"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, meter, seq } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-06-2', code: 'NGX 6.2', title: 'Which protocol and which cipher are actually used', sub: 'Chapter 6 · Lesson 6.2' };
const O = (k) => { const v = DU_LIEU[`n6-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const CONF = () => O('file:/tmp/ng/conf/tls.conf').split('\n');
const gon = (s) => s.replace(/\$ for v in tls1 tls1_1 tls1_2 tls1_3; do .*$/m, '$ for v in tls1 tls1_1 tls1_2 tls1_3; do … bat-tay.sh 8443 -$v … 8444 -$v; done')
  .replace(/\$ for p in 8443 8444; do printf 'cong %s tu .*$/m, '$ for p in 8443 8444; do bash bat-tay.sh $p; done')
  .replace(/\$ for p in 8443 8444; do printf 'cong %s, client .*$/m, "$ for p in 8443 8444; do bash bat-tay.sh $p -tls1 -cipher 'DEFAULT:@SECLEVEL=0'; done");

export const S = [
  { cover: true, nhan: 'Chapter 6 · Lesson 6.2', t: 'Which protocol and which cipher<br>are actually used', sub: 'Reading the config tells you what you asked for. Only a handshake tells you what the server accepts',
    en: 'Lesson 6.2. Reading the configuration tells you what you asked for. Only real handshakes tell you what the server accepts. We try every protocol version and eighty nine ciphers, one by one.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Two servers: the defaults, and three explicit lines</li>
    <li>Protocol versions, measured from both sides</li>
    <li>89 ciphers tried one by one</li>
    <li>Forward secrecy: what the 16 extra ciphers give up</li>
    <li>The lines to write, and how to read it from outside</li></ul>`,
    en: 'Five takeaways: the defaults against explicit lines; protocol versions from both sides; eighty nine ciphers one by one; what forward secrecy is; and the lines to write.' },
  { t: 'The setup: defaults vs explicit', body: ngc(CONF().slice(8, 20).join('\n').replace(/ssl_ciphers (\S{40})\S+;/, 'ssl_ciphers $1…;'), { sm: true, hl: [8, 9, 10] }) +
    two(box('Port 8443', 'no <code>ssl_protocols</code>, no <code>ssl_ciphers</code> — whatever nginx 1.24 + OpenSSL 3 decide', 'lam'),
      box('Port 8444', 'TLS 1.2 + 1.3 only · six ECDHE ciphers · let the client choose the order', 'xanh')),
    en: 'The setup. Port 8443 declares nothing. Port 8444 has three explicit lines: only TLS one point two and one point three, six ECDHE ciphers, and prefer server ciphers off so the client picks the order.' },
  { t: 'Protocol versions, measured from both sides', body: tn(gon(O('giaothuc')), { fs: 13, wrap: 120 }) +
    seq(['client', 'nginx'], [[0, 0, '-tls1: client refuses itself (no protocols available)', '#64748b'], [0, 1, 'client lowered to SECLEVEL=0 offers TLS 1.0'], [1, 0, 'alert protocol version — the SERVER refuses', '#c0392b']], { w: 1110, rh: 44 }),
    en: 'Left alone, both ports negotiated TLS one point three. Forcing one point two works on both. Forcing one point zero or one point one, the CLIENT refused by itself. When we lowered the client\'s security level so it would offer one point zero, the SERVER refused: alert protocol version.' },
  { t: '89 ciphers, tried one by one', body: tn(O('boma').replace(/; cat \/tmp\/ng\/ok-8444.txt/, '; cat ok-8444.txt').replace(/; grep -v ECDHE \/tmp\/ng\/ok-8443.txt \| wc -l; grep -v ECDHE \/tmp\/ng\/ok-8443.txt \| paste -sd' '/, ' # then: which have NO ECDHE?'), { fs: 13, wrap: 120 }) +
    meter([['8444 explicit — accepted', 3, '#008a34'], ['8443 default — accepted', 27, '#2563eb'], ['8443 — without ECDHE (no forward secrecy)', 16, '#c0392b']], { don: 'ciphers', rh: 46, fs: 19, nhan: 440 }),
    en: 'Every TLS one point two cipher that OpenSSL knows, eighty nine of them, tried one handshake each. The explicit block accepted three, all ECDHE with RSA, because our certificate is RSA. The default block accepted twenty seven, and sixteen of them have no ECDHE at all.' },
  { t: 'Forward secrecy: what the 16 give up', body: cmp(['', 'ECDHE-… (forward secret)', 'AES128-SHA, AES256-GCM-… (RSA key exchange)'], [
      ['session key made from', 'a fresh throw-away key pair, every handshake', 'the server\'s long-lived private key'],
      ['someone recorded traffic, then steals the key', 'old sessions stay sealed', '<b>every recorded session decrypts</b>'],
      ['in TLS 1.3', 'the only option', 'removed from the protocol'],
    ], { hl: [2] }) + box('Not dangerous — just wider than needed', 'No export ciphers, no RC4, no TLS 1.0 among the 27. But 16 trade forward secrecy for nothing a modern client needs. Three explicit lines remove them.', 'lam'),
    en: 'Forward secrecy. With ECDHE, each session key comes from a throw-away key pair, so a key stolen later cannot open recorded traffic. Without it, the session key is protected by the server\'s long-lived key: steal that, and every recorded session opens. TLS one point three removed that mode entirely.' },
  { t: 'The lines to write', body: two(ngc(`ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:
            ECDHE-RSA-AES128-GCM-SHA256:
            ECDHE-ECDSA-AES256-GCM-SHA384:
            ECDHE-RSA-AES256-GCM-SHA384:
            ECDHE-ECDSA-CHACHA20-POLY1305:
            ECDHE-RSA-CHACHA20-POLY1305;`, { sm: true, hl: [1, 3] }),
    box('Six entries, three accepted', 'One ECDSA + one RSA per algorithm. Our certificate is RSA, so the three ECDSA entries sat idle — exactly the 3 measured.', 'xanh') +
    box('Do not hand-maintain it', 'Take the list from Mozilla\'s SSL configuration generator ("intermediate"), give it your nginx and OpenSSL versions. It is maintained; your notes are not.', 'lam'), 'r64') + tn(O('boma').split('\n').slice(0, 2).join('\n').replace(/; cat \/tmp\/ng\/ok-8444\.txt/, ''), { fs: 15 }),
    en: 'The lines to write: two protocols, prefer server ciphers off, and six ECDHE ciphers, written here on several lines for reading — in the real file it is one string. With an RSA certificate only three are usable. Take the list from Mozilla\'s generator, which is maintained.' },
  { t: 'Read it from outside', body: icards([
      ['test', 'One handshake per cipher', '<code>openssl s_client -tls1_2 -cipher NAME</code> — a completed handshake means accepted. It cannot lie about what the build supports.'],
      ['page', 'Log what users negotiate', 'add <code>$ssl_protocol</code> and <code>$ssl_cipher</code> to the access log — real numbers decide whether dropping TLS 1.2 breaks anyone.'],
      ['eye', 'SSL Labs for a public site', 'a large matrix of simulated clients, names the exact old Android or Java that fails. Run it after each TLS change.'],
      ['shield', 'Mozilla generator', 'pick "intermediate" unless you have a reason; paste what it produces.'],
    ], 2),
    en: 'Reading it from outside: one handshake per cipher, as we did; the protocol and cipher variables in your access log, which show what real users negotiate; SSL Labs for a public site; and Mozilla\'s generator for the list itself.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('ssl_protocols', 'which TLS versions the server accepts'),
      kw('ssl_ciphers', 'the cipher list for TLS ≤ 1.2'),
      kw('ECDHE', 'ephemeral key exchange — forward secrecy'),
      kw('Forward secrecy', 'a stolen key cannot open recorded sessions'),
      kw('alert protocol version', 'the server refused the version offered'),
      kw('$ssl_protocol / $ssl_cipher', 'log fields: what was negotiated'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: ssl protocols, ssl ciphers, ECDHE, forward secrecy, alert protocol version, and the two log variables.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Two servers: no TLS lines, and the three explicit lines`,
      `Force ${c('-tls1')}, ${c('-tls1_2')}, ${c('-tls1_3')} at each`,
      `Lower the client to ${c('@SECLEVEL=0')} — who refuses now?`,
      `Loop over ${c('openssl ciphers -s -tls1_2')}; count accepted`,
      `List the accepted ones without ECDHE`,
    ]), box('Keep these', `<ul><li>Measure handshakes, not config</li><li>Defaults are wide, not broken</li><li>ECDHE = forward secrecy</li><li>Three explicit lines</li></ul>`, 'lam'), ''),
    en: 'Your turn: two servers, force each version, lower the client and see who refuses, loop over every cipher, and list the accepted ones without ECDHE. Keep: measure handshakes, not config; the defaults are wide, not broken; ECDHE means forward secrecy.' },
];
export const slides = lamDeck({ chuong: 'Chapter 6 — TLS and HTTP/2', bai: '6.2' }, S);
