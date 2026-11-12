/**
 * ngx-06-5 — Nginx · Chapter 6 · Lesson 6.5 "The redirect to HTTPS, HSTS, and how renewal silently breaks" (deck video + web, 12/11/2026).
 * Bài web: nginx-6-5-chuyen-huong-va-hsts. Output THẬT (scratchpad/ngx/demo/n6-5.txt; nginx/1.24.0): khối A (8080, đích HẰNG SỐ, ACME đứng trên) ⇒ /gio-hang 301
 * https://vidu.com/gio-hang, ACME 200 "thu-thach-acme", Host lạ vẫn về vidu.com; khối B (8081, return 301 https://$host…) ⇒ Host ke-tan-cong.com ⇒ Location
 * https://ke-tan-cong.com/gio-hang, ACME ⇒ 301 (gia hạn CHẾT). HSTS: 8443 có Strict-Transport-Security max-age=63072000; includeSubDomains; 8444 và cổng 80 KHÔNG có;
 * www.vidu.com ⇒ 301 https://vidu.com/gio-hang.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n6-5:file:/tmp/ng/conf/hsts.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  ssl_certificate     /root/pki/fullchain.crt;\n  ssl_certificate_key /root/pki/la.key;\n  server {                                   # A) ĐÚNG: đích HẰNG SỐ, ACME đứng TRÊN cú chuyển hướng\n    listen 8080;\n    server_name vidu.com www.vidu.com;\n    location /.well-known/acme-challenge/ { root /tmp/ng/acme; }\n    location / { return 301 https://vidu.com$request_uri; }\n  }\n  server {                                   # B) SAI: một dòng return phủ CẢ khối, đích lấy từ $host\n    listen 8081;\n    return 301 https://$host$request_uri;\n  }\n  server {                                   # HTTPS có HSTS\n    listen 8443 ssl;\n    server_name vidu.com;\n    add_header Strict-Transport-Security \"max-age=63072000; includeSubDomains\" always;\n    return 200 \"trang chu\\n\";\n  }\n  server {                                   # HTTPS KHÔNG có HSTS\n    listen 8444 ssl;\n    server_name vidu.com;\n    return 200 \"trang chu\\n\";\n  }\n  server {                                   # www -> apex, đích vẫn là hằng số\n    listen 8443 ssl;\n    server_name www.vidu.com;\n    return 301 https://vidu.com$request_uri;\n  }\n}\n",
 "n6-5:file:/root/xin80.sh": "#!/bin/bash\n# xin80.sh <cổng> <Host> <đường dẫn> — in mã + Location (hoặc thân) của một request HTTP thường\nr=$(curl -s -D - -H \"Host: $2\" http://127.0.0.1:$1$3 | tr -d '\\r')\nprintf '%-22s %-34s -> %s  %s\\n' \"Host: $2\" \"$3\" \"$(head -1 <<<\"$r\" | cut -d' ' -f2)\" \"$(grep -i '^location:' <<<\"$r\" || tail -1 <<<\"$r\")\"\n",
 "n6-5:setup": "",
 "n6-5:congtam": "$ for d in /gio-hang /.well-known/acme-challenge/abc; do printf 'A '; bash xin80.sh 8080 vidu.com $d; done; printf 'A '; bash xin80.sh 8080 ke-tan-cong.com /gio-hang\nA Host: vidu.com         /gio-hang                          -> 301  Location: https://vidu.com/gio-hang\nA Host: vidu.com         /.well-known/acme-challenge/abc    -> 200  thu-thach-acme\nA Host: ke-tan-cong.com  /gio-hang                          -> 301  Location: https://vidu.com/gio-hang\n$ for d in /gio-hang /.well-known/acme-challenge/abc; do printf 'B '; bash xin80.sh 8081 vidu.com $d; done; printf 'B '; bash xin80.sh 8081 ke-tan-cong.com /gio-hang\nB Host: vidu.com         /gio-hang                          -> 301  Location: https://vidu.com/gio-hang\nB Host: vidu.com         /.well-known/acme-challenge/abc    -> 301  Location: https://vidu.com/.well-known/acme-challenge/abc\nB Host: ke-tan-cong.com  /gio-hang                          -> 301  Location: https://ke-tan-cong.com/gio-hang",
 "n6-5:hsts": "$ for p in 8443 8444; do printf 'cong %s (https): ' $p; curl -s -D - -o /dev/null --cacert pki/root.crt https://vidu.com:$p/ | tr -d '\\r' | grep -i '^strict-transport' || echo 'KHONG co'; done; printf 'cong 8080 (http) : '; curl -s -D - -o /dev/null -H 'Host: vidu.com' http://127.0.0.1:8080/ | tr -d '\\r' | grep -i '^strict-transport' || echo 'KHONG co'\ncong 8443 (https): Strict-Transport-Security: max-age=63072000; includeSubDomains\ncong 8444 (https): KHONG co\ncong 8080 (http) : KHONG co\n$ curl -s -o /dev/null -w 'www.vidu.com -> %{http_code} %{redirect_url}\\n' --cacert pki/root.crt https://www.vidu.com:8443/gio-hang\nwww.vidu.com -> 301 https://vidu.com/gio-hang"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, flow, seq, vsd } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-06-5', code: 'NGX 6.5', title: 'The redirect to HTTPS, HSTS, and how renewal silently breaks', sub: 'Chapter 6 · Lesson 6.5' };
const O = (k) => { const v = DU_LIEU[`n6-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const DONG = (k, chu) => O(k).split('\n').filter((l) => l.startsWith(chu)).join('\n');
const gon = (s) => s.replace(/^\$ for p in 8443 8444; do printf .*$/m, "$ for p in 8443 8444; do curl -sD - https://vidu.com:$p/ | grep -i strict; done; curl -sD - http://…:8080/ | grep -i strict");

export const S = [
  { cover: true, nhan: 'Chapter 6 · Lesson 6.5', t: 'The redirect to HTTPS, HSTS,<br>and how renewal silently breaks', sub: 'One line on port 80 can hand attackers your redirect AND stop your certificate from renewing — 60 days later',
    en: 'Lesson 6.5. One careless line on port 80 can let anyone choose where your redirect points, and stop your certificate from renewing — which you discover sixty days later.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Two port-80 blocks, measured side by side</li>
    <li>Why <code>$host</code> in the target is an open door</li>
    <li>The ACME path must sit ABOVE the redirect</li>
    <li>HSTS: what it does, and where it starts</li>
    <li>Starting HSTS small — and the full block</li></ul>`,
    en: 'Five takeaways: two port eighty blocks measured; why dollar host in the target is an open door; the ACME path above the redirect; what HSTS does and where it starts; and starting it small.' },
  { t: 'Two port-80 blocks, measured', body: vsd(ngc(`server {
  listen 80;
  return 301 https://$host$request_uri;
}`, { sm: true }),
    ngc(`server {
  listen 80;
  server_name vidu.com www.vidu.com;
  location /.well-known/acme-challenge/ { root /var/www/certbot; }
  location / { return 301 https://vidu.com$request_uri; }
}`, { sm: true }), '✗ B — one line, target from $host', '✓ A — constant target, ACME first') +
    tn(DONG('congtam', 'A ') + '\n' + DONG('congtam', 'B '), { fs: 14, wrap: 120 }),
    en: 'Two blocks on port eighty. B is the one-liner everybody copies: return three oh one to https colon dollar host. A names its server, serves the ACME path first, and redirects to a constant. Read the two outputs side by side.' },
  { t: '$host in the target is an open door', body: tn(DONG('congtam', 'B Host: ke-tan-cong') + '\n' + DONG('congtam', 'A Host: ke-tan-cong'), { fs: 15, wrap: 110 }) +
    seq(['attacker / scanner', 'your nginx :80', 'victim\'s browser'], [[0, 1, 'GET /gio-hang  Host: ke-tan-cong.com'], [1, 0, 'B: 301 → https://ke-tan-cong.com/gio-hang', '#c0392b'], [0, 2, 'link through YOUR domain …'], [2, 2, '… lands on the attacker\'s host', '#c0392b']], { w: 1110, rh: 44 }) +
    box('The Host header is client input (Lesson 1.4)', 'Block A answered the same request with https://vidu.com/gio-hang — a constant target cannot be steered.', 'xanh'),
    en: 'Why dollar host is an open door. Sent with a fake Host, block B redirected to the attacker\'s domain: your server now hands out redirects to wherever the client says. The Host header is client input, Lesson 1.4. Block A answered with vidu dot com, always.' },
  { t: 'ACME must sit ABOVE the redirect', body: tn(DONG('congtam', 'A Host: vidu.com') + '\n' + DONG('congtam', 'B Host: vidu.com'), { fs: 14, wrap: 120 }) +
    seq(["Let's Encrypt", 'nginx :80', 'certbot'], [[2, 1, 'writes the token to /var/www/certbot'], [0, 1, 'GET /.well-known/acme-challenge/abc'], [1, 0, 'A: 200 token → renewal passes', '#008a34'], [1, 0, 'B: 301 → https… → renewal FAILS, silently', '#c0392b', true]], { w: 1110, rh: 44 }),
    en: 'Renewal. Let\'s Encrypt checks your domain by fetching a token over plain HTTP, on port eighty. Block A served it: two hundred, renewal passes. Block B redirected it: three oh one, renewal fails — silently, and you find out when the certificate expires sixty days later.' },
  { t: 'HSTS: what it does, and where it starts', body: tn(gon(O('hsts')), { fs: 14, wrap: 120 }) +
    flow([{ t: 'http://vidu.com', s: 'first visit — unprotected', mau: '#c0392b' }, { t: '301 → https', s: 'no HSTS on HTTP' }, { t: 'HTTPS + HSTS header', s: 'browser remembers', mau: '#2563eb' }, { t: 'next time', s: 'https directly, no HTTP at all', mau: '#008a34' }], { h: 140 }) +
    box('Port 80 had no HSTS — correctly', 'A browser ignores HSTS received over plain HTTP: anyone in the middle could have added or removed it. Send it from the HTTPS server, with <code>always</code>.', 'lam'),
    en: 'HSTS tells the browser: for this long, never use plain HTTP for this site. It is only sent, and only honoured, over HTTPS — port eighty correctly had none. So the very first visit is still unprotected; every visit after that goes straight to HTTPS.' },
  { t: 'Start HSTS small', body: cmp(['Stage', 'Header', 'If something is wrong'], [
      ['week 1', '<code>max-age=300</code>', 'browsers forget in 5 minutes'],
      ['after a quiet week', '<code>max-age=63072000; includeSubDomains</code>', 'two years — every subdomain must have HTTPS'],
      ['only if you are sure', '<code>; preload</code> + hstspreload.org', 'baked into browsers — removal takes months'],
    ], { hl: [1] }) + two(box('Always use "always"', 'Without it, a 404 or a 500 carries no HSTS header (Lesson 2.3).', 'lam'),
      box('A broken HTTPS + long HSTS', 'Users cannot click through the warning. An expired certificate becomes an outage.', 'do2')),
    en: 'Start small. Five minutes for the first week, so a mistake is forgotten quickly. Then two years with include subdomains, which means every subdomain must work over HTTPS. Preload is nearly irreversible. Add always, and remember: with long HSTS, an expired certificate is an outage.' },
  { t: 'The whole block', body: ngc(`server {                                   # port 80: ACME first, constant target
  listen 80;  listen [::]:80;
  server_name vidu.com www.vidu.com;
  location /.well-known/acme-challenge/ { root /var/www/certbot; }
  location / { return 301 https://vidu.com$request_uri; }
}
server {                                   # HTTPS, HSTS starting small
  listen 443 ssl http2;                    # nginx 1.24 syntax (Lesson 6.4)
  server_name vidu.com;
  add_header Strict-Transport-Security "max-age=300" always;
}
server {                                   # www → apex, constant target (Lesson 1.5)
  listen 443 ssl;
  server_name www.vidu.com;
  return 301 https://vidu.com$request_uri;
}`, { sm: true, hl: [4, 5, 10, 15] }) + tn(O('hsts').split('\n').slice(-1).join('\n'), { fs: 14 }),
    en: 'The whole block: port eighty with the ACME path first and a constant target; HTTPS with HSTS starting at five minutes; and www redirected to the bare domain with a constant target — measured: www dot vidu dot com went to https vidu dot com.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('return 301 https://…', 'the redirect to HTTPS — keep the target constant'),
      kw('$host', 'client input — never the target of a redirect'),
      kw('ACME challenge', '/.well-known/acme-challenge/, fetched over HTTP'),
      kw('HSTS', 'browser: use HTTPS only, for max-age seconds'),
      kw('includeSubDomains / preload', 'wider and nearly permanent'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the redirect to HTTPS, dollar host, the ACME challenge, HSTS, and include subdomains with preload.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build blocks A and B on two ports`,
      `Send ${c('Host: ke-tan-cong.com')} to both; read Location`,
      `Request the ACME path on both`,
      `Add HSTS with ${c('max-age=300 always')}; check https AND http`,
      `Request www and check the redirect target is constant`,
    ]), box('Keep these', `<ul><li>Constant redirect target</li><li>ACME above the redirect</li><li>HSTS only over HTTPS</li><li>Start at 300 seconds</li></ul>`, 'lam'), ''),
    en: 'Your turn: build both blocks, send a fake Host to each, request the ACME path on both, then add HSTS and check HTTPS and HTTP. Keep: a constant target; ACME above the redirect; HSTS only over HTTPS; start at three hundred seconds.' },
];
export const slides = lamDeck({ chuong: 'Chapter 6 — TLS and HTTP/2', bai: '6.5' }, S);
