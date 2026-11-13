/**
 * ngx-07-2 — Nginx · Chapter 7 · Lesson 7.2 "What to key the limit on, and the key that can be forged" (deck video + web, 13/11/2026).
 * Bài web: nginx-7-2-khoa-gioi-han. Output THẬT (scratchpad/ngx/demo/n7-2.txt; nginx/1.24.0; rate=1r/m burst=2 nodelay ⇒ 3 qua rồi 429):
 * A $binary_remote_addr, 5 người qua cùng máy: 200 200 200 429 429 · B khoá từ XFF: 5×200 · C kẻ gian đổi XFF: 8×200 ·
 * E real_ip chỉ tin 10.9.9.9 (request tới từ 127.0.0.1 ⇒ XFF bị bỏ qua): 200 200 200 429 429 · D $uri: mỗi đường dẫn 200 200 200 429 ·
 * F khoá RỖNG (X-Api-Key nội bộ) ⇒ 5×200, không header ⇒ 200 200 200 429 429 · G proxy tin cậy 127.0.0.1 + real_ip_recursive,
 * phần đầu XFF giả mạo, IP thật nối cuối ⇒ 200 200 200 429 429, log "client: 203.0.113.7".
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n7-2:file:/tmp/ng/conf/khoa.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  root /tmp/ng/site;\n  limit_req_status 429;\n  map $http_x_forwarded_for $ip_that { \"\" $remote_addr; ~^(?<dau>[^,\\s]+) $dau; }   # phần tử ĐẦU của X-Forwarded-For\n  limit_req_zone $binary_remote_addr zone=theo_ip:10m  rate=1r/m;\n  limit_req_zone $ip_that            zone=theo_xff:10m rate=1r/m;\n  limit_req_zone $binary_remote_addr zone=theo_ip2:10m rate=1r/m;   # cùng khoá với A, vùng riêng cho phép đo E\n  limit_req_zone $uri                zone=theo_uri:10m rate=1r/m;\n  server { listen 8080; location / { limit_req zone=theo_ip  burst=2 nodelay; } }                  # A\n  server { listen 8081; location / { limit_req zone=theo_xff burst=2 nodelay; } }                  # B, C\n  server { listen 8082; set_real_ip_from 10.9.9.9; real_ip_header X-Forwarded-For;                 # E: chỉ tin proxy 10.9.9.9\n           location / { limit_req zone=theo_ip2 burst=2 nodelay; } }\n  server { listen 8083; location / { limit_req zone=theo_uri burst=2 nodelay; } }                  # D\n}\n",
 "n7-2:file:/root/nam-nguoi.sh": "#!/bin/bash\n# nam-nguoi.sh <cổng> — 5 \"người dùng\" khác nhau (X-Forwarded-For 203.0.113.1..5), mỗi người MỘT request, đều đi qua cùng máy 127.0.0.1\nfor i in 1 2 3 4 5; do printf '%s:%s  ' $i $(curl -s -o /dev/null -w '%{http_code}' -H \"X-Forwarded-For: 203.0.113.$i\" http://127.0.0.1:$1/); done; echo\n",
 "n7-2:setup": "",
 "n7-2:bacau": "$ printf 'A) khoa $binary_remote_addr : '; bash nam-nguoi.sh 8080\nA) khoa $binary_remote_addr : 1:200  2:200  3:200  4:429  5:429  \n$ printf 'B) khoa $ip_that (tu XFF)   : '; bash nam-nguoi.sh 8081\nB) khoa $ip_that (tu XFF)   : 1:200  2:200  3:200  4:200  5:200  \n$ printf 'C) B + ke tan cong DOI XFF  : '; for i in $(seq 8); do printf '%s ' $(curl -s -o /dev/null -w '%{http_code}' -H \"X-Forwarded-For: 198.51.100.$RANDOM\" http://127.0.0.1:8081/); done; echo\nC) B + ke tan cong DOI XFF  : 200 200 200 200 200 200 200 200 \n$ printf 'E) real_ip, chi tin proxy 10.9.9.9, ke tan cong doi XFF: '; for i in $(seq 5); do printf '%s ' $(curl -s -o /dev/null -w '%{http_code}' -H \"X-Forwarded-For: 198.51.100.$i\" http://127.0.0.1:8082/); done; echo\nE) real_ip, chi tin proxy 10.9.9.9, ke tan cong doi XFF: 200 200 200 429 429 ",
 "n7-2:uri": "$ for u in a b; do printf '/uri/%s x4: ' $u; for i in 1 2 3 4; do printf '%s ' $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8083/uri/$u); done; echo; done\n/uri/a x4: 200 200 200 429 \n/uri/b x4: 200 200 200 429 ",
 "n7-2:file:/tmp/ng/conf/them.conf": "pid       /tmp/ng/logs/them.pid;\nerror_log /tmp/ng/logs/them.log;\nevents {}\nhttp {\n  access_log off;\n  root /tmp/ng/site;\n  limit_req_status 429;\n  map $http_x_api_key $gioi_han { default $binary_remote_addr; \"khoa-noi-bo\" \"\"; }   # khoá RỖNG ⇒ không giới hạn\n  limit_req_zone $gioi_han           zone=mien:10m rate=1r/m;\n  limit_req_zone $binary_remote_addr zone=tin:10m  rate=1r/m;\n  server { listen 8084; location / { limit_req zone=mien burst=2 nodelay; } }                     # F: miễn trừ bằng khoá rỗng\n  server { listen 8085; set_real_ip_from 127.0.0.1; real_ip_header X-Forwarded-For; real_ip_recursive on;   # G: proxy tin cậy = 127.0.0.1\n           location / { limit_req zone=tin burst=2 nodelay; } }\n}\n",
 "n7-2:them": "$ printf 'F) khong header         : '; for i in $(seq 5); do printf '%s ' $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8084/); done; echo\nF) khong header         : 200 200 200 429 429 \n$ printf 'F) X-Api-Key: khoa-noi-bo: '; for i in $(seq 5); do printf '%s ' $(curl -s -o /dev/null -w '%{http_code}' -H 'X-Api-Key: khoa-noi-bo' http://127.0.0.1:8084/); done; echo\nF) X-Api-Key: khoa-noi-bo: 200 200 200 200 200 \n$ printf 'G) gia mao dau XFF, proxy noi IP that vao cuoi: '; for i in $(seq 5); do printf '%s ' $(curl -s -o /dev/null -w '%{http_code}' -H \"X-Forwarded-For: 198.51.100.$i, 203.0.113.7\" http://127.0.0.1:8085/); done; echo\nG) gia mao dau XFF, proxy noi IP that vao cuoi: 200 200 200 429 429 \n$ grep -m1 'zone \"tin\"' /tmp/ng/logs/them.log | grep -oE 'limiting.*zone \"tin\", client: [0-9.]+'\nlimiting requests, excess: 3.000 by zone \"tin\", client: 203.0.113.7"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, meter, path } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-07-2', code: 'NGX 7.2', title: 'What to key the limit on, and the key that can be forged', sub: 'Chapter 7 · Lesson 7.2' };
const O = (k) => { const v = DU_LIEU[`n7-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const KQ = (k) => O(k).split('\n').filter((l) => !l.startsWith('$ ')).join('\n');

/** Năm người dùng sau MỘT proxy: nginx chỉ thấy địa chỉ TCP của proxy. */
const sauProxy = () => {
  const W = 1110, H = 270;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs><marker id="mp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>`;
  for (let i = 0; i < 5; i++) {
    const y = 18 + i * 50;
    s += `<rect x="10" y="${y}" width="230" height="40" rx="10" fill="#eef4ff" stroke="#2563eb" stroke-width="2"/><text x="125" y="${y + 27}" text-anchor="middle" font-size="18" font-weight="700" fill="#1e3a8a">user ${i + 1} · 203.0.113.${i + 1}</text>`;
    s += `<line x1="242" y1="${y + 20}" x2="402" y2="135" stroke="#b85a2b" stroke-width="2.4" marker-end="url(#mp)"/>`;
  }
  s += `<rect x="410" y="90" width="250" height="90" rx="14" fill="#fff8e1" stroke="#c28a00" stroke-width="3"/><text x="535" y="128" text-anchor="middle" font-size="21" font-weight="800" fill="#8a6100">office NAT / CDN</text><text x="535" y="160" text-anchor="middle" font-size="18" fill="#555">one address: 127.0.0.1</text>`;
  s += `<line x1="662" y1="135" x2="790" y2="135" stroke="#b85a2b" stroke-width="3" marker-end="url(#mp)"/><text x="726" y="122" text-anchor="middle" font-size="16" fill="#b85a2b">TCP</text>`;
  s += `<rect x="796" y="70" width="300" height="130" rx="14" fill="#e6f6ec" stroke="#009639" stroke-width="3"/><text x="946" y="106" text-anchor="middle" font-size="22" font-weight="800" fill="#14532d">nginx</text><text x="946" y="140" text-anchor="middle" font-size="17" fill="#333">$binary_remote_addr</text><text x="946" y="170" text-anchor="middle" font-size="19" font-weight="800" fill="#c0392b">= the proxy, for all 5</text>`;
  return s + '</svg>';
};

/** X-Forwarded-For đọc từ PHẢI sang TRÁI, bỏ qua địa chỉ được tin. */
const tuPhai = () => {
  const W = 1110, H = 210;
  const o = [['198.51.100.3', 'written by the client', '#c0392b', 'forged — never reached'], ['203.0.113.7', 'appended by YOUR proxy', '#009639', '← first untrusted: the client'], ['127.0.0.1', 'TCP peer (trusted proxy)', '#64748b', '← trusted: skip']];
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs><marker id="mr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#2563eb"/></marker></defs>`;
  o.forEach(([ip, sub, mau, nhan], i) => {
    const x = 20 + i * 370;
    s += `<rect x="${x}" y="20" width="330" height="86" rx="14" fill="${mau}14" stroke="${mau}" stroke-width="3"/><text x="${x + 165}" y="58" text-anchor="middle" font-size="24" font-weight="800" fill="${mau}" font-family="monospace">${ip}</text><text x="${x + 165}" y="88" text-anchor="middle" font-size="17" fill="#444">${sub}</text>`;
    s += `<text x="${x + 165}" y="140" text-anchor="middle" font-size="18" font-weight="800" fill="${mau}">${nhan}</text>`;
  });
  s += `<line x1="1080" y1="182" x2="60" y2="182" stroke="#2563eb" stroke-width="3" marker-end="url(#mr)"/><text x="570" y="204" text-anchor="middle" font-size="17" font-weight="700" fill="#2563eb">real_ip_recursive on: read right → left, skip set_real_ip_from addresses, stop at the first one you do not trust</text>`;
  return s + '</svg>';
};

export const S = [
  { cover: true, nhan: 'Chapter 7 · Lesson 7.2', t: 'What to key the limit on,<br>and the key that can be forged', sub: 'A limiter is a counter and a key — the key is where limits really break',
    en: 'Lesson 7.2. A rate limiter is one counter and one key. Lesson 7.1 was about the counter; the key is where limits really break — and both obvious choices break, in opposite directions.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>One limiter = one counter + one key</li>
    <li>Three keys, three behaviours: too strict, right, gone</li>
    <li>The fix: correct <code>$remote_addr</code> with real_ip</li>
    <li>Other keys: API key, <code>$uri</code>, the empty key</li>
    <li>Sizing the zone, and one question before trusting any limit</li></ul>`,
    en: 'Five takeaways: a limiter is a counter plus a key; three keys give three behaviours; the fix with real IP; other keys including the empty key; and sizing the zone, plus the one question to ask before trusting any limit.' },
  { t: 'Who is "the client" when everyone shares a proxy?', body: sauProxy() + two(
      box('$binary_remote_addr', 'The TCP peer address. It cannot be forged, and it is 4 bytes — that is why it exists. But behind a proxy it is the PROXY.', 'xanh'),
      box('X-Forwarded-For', 'A header the client sends. It names the real user — and it says whatever the client wants it to say (Lesson 3.2).', 'do2')),
    en: 'Who is the client? Five users behind one office NAT or one CDN all arrive from the same address. Binary remote addr is the TCP peer: it cannot be forged, but behind a proxy it is the proxy. X forwarded for names the real user, but it is a header the client writes.' },
  { t: 'Three measurements, one config each', body: tn(KQ('bacau').split('\n').slice(0, 3).join('\n'), { fs: 15, wrap: 110 }) +
    ngc(`map $http_x_forwarded_for $ip_that { "" $remote_addr; ~^(?<dau>[^,\\s]+) $dau; }
limit_req_zone $binary_remote_addr zone=theo_ip:10m  rate=1r/m;   # A
limit_req_zone $ip_that            zone=theo_xff:10m rate=1r/m;   # B, C`, { sm: true }) +
    cmp(['Key', 'Measured', 'Verdict'], [
      ['A — $binary_remote_addr', '5 users: 200 200 200 429 429', 'TOO STRICT — everyone shares one bucket'],
      ['B — first X-Forwarded-For', '5 users: 5 × 200', 'right — one bucket each'],
      ['C — same as B, attacker changes XFF', '8 × 200 out of 8', 'GONE — a new bucket every request'],
    ], { hl: [2] }),
    en: 'Three measurements. Rate one per minute, burst two: each key gets three requests. A, keyed on the address: the five users share the proxy address, so users four and five get four twenty nine. B, keyed on X forwarded for: five out of five pass. C, the same B, but the attacker changes the header on every request: eight out of eight pass. The limit is not weaker — it is gone.' },
  { t: 'The fix: correct $remote_addr, then key on it', body: ngc(`set_real_ip_from 10.0.0.0/8;       # ONLY proxies YOU run
set_real_ip_from 172.16.0.0/12;
real_ip_header   X-Forwarded-For;
real_ip_recursive on;
limit_req_zone $binary_remote_addr zone=theo-ip:10m rate=10r/s;   # key on the CORRECTED address`, { hl: [1, 4] }) +
    tn(KQ('bacau').split('\n').slice(3).join('\n').replace('E) real_ip, chi tin proxy 10.9.9.9, ke tan cong doi XFF: ', 'E) trust only 10.9.9.9 · request from 127.0.0.1 · attacker changes XFF: '), { fs: 17, wrap: 110 }) +
    path([{ t: 'request from 127.0.0.1', s: 'XFF: 198.51.100.$i (forged)' }, { t: 'peer trusted?', s: 'only 10.9.9.9 ⇒ no, ignore XFF', on: true }, { t: '$remote_addr = 127.0.0.1', s: 'same key every time ⇒ limited', mau: '#c0392b' }], { h: 130, fs: 20 }) +
    box('Never 0.0.0.0/0, never a whole private range', 'set_real_ip_from must list only the CDN and load balancers you run. Too wide, and a forged header from inside the range rewrites $remote_addr to anything — you are back at row C.', 'do2'),
    en: 'The fix is to correct remote addr itself: set real IP from with the proxies you really run, real IP header X forwarded for, recursive on, then key on binary remote addr. Measured: trusting only one proxy, a request from anywhere else has its header ignored, so changing it does nothing — three pass, two get four twenty nine. Never trust zero slash zero, or a whole private range.' },
  { t: 'real_ip_recursive: read from the right', body: tuPhai() +
    tn(KQ('them').split('\n').slice(2).join('\n').replace('G) gia mao dau XFF, proxy noi IP that vao cuoi: ', 'G) trusted proxy 127.0.0.1, forged head of XFF: '), { fs: 17, wrap: 110 }) +
    box('Why the right end?', 'Each proxy APPENDS the address it saw. Everything to the left of your own proxy\'s entry was written before it reached you — by the client. So the last address you do not trust is the real client.', 'lam'),
    en: 'Why recursive on matters. Every proxy appends the address it saw, so X forwarded for grows to the right. Nginx reads from the right, skips addresses you trust, and stops at the first one you do not: that is the real client. Measured through a trusted proxy with a forged head: three pass, two get four twenty nine, and the error log names the real client, two oh three dot zero dot one one three dot seven.' },
  { t: 'Other keys, and when they are the right one', body: tn(KQ('uri') + '\n' + KQ('them').split('\n').slice(0, 2).join('\n'), { fs: 15, wrap: 110 }) + icards([
      ['key', '$http_x_api_key', 'one quota per customer — only if the key is CHECKED somewhere'],
      ['page', '$uri', 'a global ceiling for one expensive endpoint, whoever asks'],
      ['layers', 'network range', 'map a /24 into one key — blunts a cloud range, also groups innocent users'],
      ['power', 'empty key', 'an empty value is NOT limited — how you exempt traffic, or exempt everything by accident'],
    ], 2),
    en: 'Other keys. Keyed on the URI, each path got its own quota: three then four twenty nine, per path. The empty key: with the internal API key the map returns an empty string, and five out of five passed — an empty key is not limited. That is how you exempt traffic, and how you exempt everything by accident. An API key is a good per customer key only if something checks it.' },
  { t: 'Sizing the zone', body: icards([
      ['db', '10m ≈ 160,000 IPv4 keys', 'about 64 bytes each on 64-bit; allocated once at start-up, so guessing high costs nothing'],
      ['trash', 'Full? the oldest are evicted', 'least recently used entries go; if none can be freed the request is refused and logged'],
      ['cpu', 'Shared by all workers', 'one counter — per-worker counters with 4 workers would be 4× looser'],
      ['server', 'Per instance, not per cluster', 'three nginx behind a load balancer enforce three independent limits'],
    ], 2) + meter([['configured on each nginx', 10, '#2563eb'], ['what clients really get with 3 instances', 30, '#c0392b']], { don: 'r/s', rh: 46, fs: 20, nhan: 470 }) +
    box('Must the rate hold across the whole cluster?', 'Then the counter belongs in a shared store — the Redis pattern (one counter, many servers), not limit_req_zone.', 'lam'),
    en: 'Sizing the zone. Ten megabytes hold about one hundred sixty thousand IPv4 keys at sixty four bytes each, allocated once at start up. When it fills, the oldest entries are evicted and the error log says so — that means too small, not an attack. The zone is shared by all workers, so the limit is real. But it is per instance: three nginx behind a load balancer give three times the rate you wrote.' },
  { t: 'One question before you trust any limit', body: two(steps([
      `Ask: <b>can the client change this value?</b>`,
      `Yes, and nothing checks it ⇒ the limit is decoration`,
      `Test like row C: 8 requests, change ONLY the key, count the 200s`,
      `Order: fix ${c('$remote_addr')} first, log it, check one known client`,
      `Then add limits keyed on it`,
    ]), box('Worse than no limit', 'A limit whose key the attacker chooses looks like a defence in every config review — and does nothing. Same directive, three keys: right, too strict, and nothing at all.', 'do2'), 'r64'),
    en: 'Before trusting any limit, ask one question: can the client change this value? If yes and nothing checks it, the limit is decoration — worse than none, because it passes a config review. Test it like row C. And build in order: fix remote addr, log it, verify with a known client, then add limits.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('rate-limit key', 'what the limiter counts by'),
      kw('$binary_remote_addr', 'TCP peer — cannot be forged'),
      kw('X-Forwarded-For', 'client-written header'),
      kw('set_real_ip_from', 'the proxies you trust'),
      kw('real_ip_recursive on', 'rightmost untrusted address'),
      kw('empty key', 'not limited at all'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the rate limit key, binary remote addr, X forwarded for, set real IP from, real IP recursive, and the empty key.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Five "users" through one address: key on ${c('$binary_remote_addr')}`,
      `Key on X-Forwarded-For — then forge it 8 times`,
      `Add ${c('set_real_ip_from')} for one proxy and repeat`,
      `Exempt one internal key with an empty map value`,
      `Log ${c('$remote_addr')} and check it is the real client`,
    ]), box('Keep these', `<ul><li>The key is where limits break</li><li>Raw XFF = no limit</li><li>Fix $remote_addr, then key on it</li><li>Empty key = exempt</li></ul>`, 'lam'), ''),
    en: 'Your turn: key on the address and watch five users share it; key on the header and forge it; add real IP for one proxy and repeat; exempt an internal key with an empty value; log remote addr and check it. Keep: the key is where limits break; raw X forwarded for is no limit; fix remote addr, then key on it; an empty key is exempt.' },
];
export const slides = lamDeck({ chuong: 'Chapter 7 — Limits: rate, connections, size', bai: '7.2' }, S);
