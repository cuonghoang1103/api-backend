/**
 * ngx-09-2 — Nginx · Chapter 9 · Lesson 9.2 "Sticky routing, and the word that saves 47% of your users" (deck video + web, 13/11/2026).
 * Bài web: nginx-9-2-dinh-tuyen-dinh. Output THẬT (scratchpad/ngx/demo/n9-2.txt; nginx/1.24.0, backend Node may.js):
 * hash $arg_nguoi và hash … consistent đều ghim (an/binh/cuong/dung) · thêm may-4 + reload: hash thường 43/60 đổi = 72%, consistent 15/60 = 25%
 * (lý thuyết ~25%) · giết may-3 (cấu hình không đổi): trong 37 / 42 người vốn không ở may-3 ⇒ 0 người đổi máy · khoá rỗng ⇒ round robin 2/2/2 ·
 * cookie phien=abc123 ⇒ luôn may-2 · ip_hash: 20 client cùng /24 (203.0.113.x) ⇒ may-1=20; 20 client khác /24 ⇒ 6/7/7.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n9-2:file:/root/anh_xa.py": "# anh_xa.py luu|so|chet <ten> — ánh xạ 60 \"người dùng\" -> máy, qua CẢ hai bể (/thuong/ = hash, /bien/ = hash consistent)\nimport json, sys, urllib.request\nNGUOI = [f'nguoi-{i}' for i in range(1, 61)]\ndef hoi(be, u):\n    return urllib.request.urlopen(f'http://127.0.0.1:8080/{be}/?nguoi={u}').read().decode().strip()\nlenh, ten = sys.argv[1], sys.argv[2]\nmoi = {be: {u: hoi(be, u) for u in NGUOI} for be in ('thuong', 'bien')}\nif lenh == 'luu':\n    json.dump(moi, open(f'/tmp/ng/{ten}.json', 'w')); print('da ghi anh xa cua 60 nguoi dung'); sys.exit()\ncu = json.load(open(f'/tmp/ng/{ten}.json'))\nfor be, nhan in (('thuong', 'hash thuong    '), ('bien', 'hash consistent')):\n    if lenh == 'so':\n        doi = sum(cu[be][u] != moi[be][u] for u in NGUOI)\n        print(f'  {nhan} : {doi}/60 doi may   = {round(100 * doi / 60)}%')\n    else:   # chet: chỉ xét những người TRƯỚC ĐÓ không ở may-3\n        ngoai = [u for u in NGUOI if cu[be][u] != 'may-3']\n        doi = sum(cu[be][u] != moi[be][u] for u in ngoai)\n        print(f'  trong {len(ngoai)} nguoi VON KHONG o may-3 ({nhan.strip()}) : {doi} nguoi bi doi may ({round(100 * doi / len(ngoai))}%)')\n",
 "n9-2:file:/tmp/ng/conf/ba.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  upstream thuong { hash $arg_nguoi;            server 127.0.0.1:9501; server 127.0.0.1:9502; server 127.0.0.1:9503; }\n  upstream bien   { hash $arg_nguoi consistent; server 127.0.0.1:9501; server 127.0.0.1:9502; server 127.0.0.1:9503; }\n  upstream phien  { hash $cookie_phien consistent; server 127.0.0.1:9501; server 127.0.0.1:9502; server 127.0.0.1:9503; }\n  upstream theoip { ip_hash;                    server 127.0.0.1:9501; server 127.0.0.1:9502; server 127.0.0.1:9503; }\n  server {\n    listen 8080;\n    location /thuong/ { proxy_pass http://thuong; }\n    location /bien/   { proxy_pass http://bien; }\n    location /phien/  { proxy_pass http://phien; }\n  }\n  server {                                   # 8081: client thật lấy từ X-Forwarded-For (như sau CDN, bài 7.2)\n    listen 8081;\n    set_real_ip_from 127.0.0.1;\n    real_ip_header   X-Forwarded-For;\n    location / { proxy_pass http://theoip; }\n  }\n}\n",
 "n9-2:setup": "",
 "n9-2:file:/root/ghim.sh": "# ghim.sh <bể> — 4 \"người dùng\", mỗi người gọi 3 lần liên tiếp: vào máy nào?\nfor u in an binh cuong dung; do\n  printf 'nguoi=%-6s -> ' $u\n  for k in 1 2 3; do printf '%s  ' $(curl -s \"http://127.0.0.1:8080/$1/?nguoi=$u\"); done; echo\ndone\n",
 "n9-2:ghim": "$ bash ghim.sh thuong\nnguoi=an     -> may-2  may-2  may-2  \nnguoi=binh   -> may-1  may-1  may-1  \nnguoi=cuong  -> may-3  may-3  may-3  \nnguoi=dung   -> may-3  may-3  may-3  \n$ bash ghim.sh bien\nnguoi=an     -> may-3  may-3  may-3  \nnguoi=binh   -> may-1  may-1  may-1  \nnguoi=cuong  -> may-2  may-2  may-2  \nnguoi=dung   -> may-2  may-2  may-2  ",
 "n9-2:them": "$ python3 anh_xa.py luu truoc\nda ghi anh xa cua 60 nguoi dung\n$ cp bon.conf lb.conf && nginx -t && nginx -s reload     # thêm may-4 vào CẢ HAI bể\n$ python3 anh_xa.py so truoc\n  hash thuong     : 43/60 doi may   = 72%\n  hash consistent : 15/60 doi may   = 25%",
 "n9-2:chet": "$ python3 anh_xa.py luu truoc2\nda ghi anh xa cua 60 nguoi dung\n$ pkill -f 'may.js may-3'     # giết may-3 — cấu hình KHÔNG đổi\n$ python3 anh_xa.py chet truoc2\n  trong 37 nguoi VON KHONG o may-3 (hash thuong) : 0 nguoi bi doi may (0%)\n  trong 42 nguoi VON KHONG o may-3 (hash consistent) : 0 nguoi bi doi may (0%)",
 "n9-2:rong": "$ bash dem.sh http://127.0.0.1:8080/bien/ 6      # KHÔNG có ?nguoi ⇒ khoá RỖNG\nmay-1=2  may-2=2  may-3=2  \n$ for k in 1 2 3 4 5; do printf '%s  ' $(curl -s -b 'phien=abc123' http://127.0.0.1:8080/phien/); done; echo\nmay-2  may-2  may-2  may-2  may-2  ",
 "n9-2:file:/root/ip.sh": "# ip.sh <mẫu địa chỉ có %d> — 20 client (X-Forwarded-For, nginx tin 127.0.0.1) qua bể ip_hash: đếm máy\nfor i in $(seq 20); do curl -s -H \"X-Forwarded-For: $(printf \"$1\" $i)\" http://127.0.0.1:8081/; done | sort | uniq -c | awk '{printf \"%s=%s  \", $2, $1} END {print \"\"}'\n",
 "n9-2:ip": "$ bash ip.sh '203.0.113.%d'\nmay-1=20  \n$ bash ip.sh '10.%d.0.1'\nmay-1=6  may-2=7  may-3=7  "
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, meter } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-09-2', code: 'NGX 9.2', title: 'Sticky routing, and the word that saves 47% of your users', sub: 'Chapter 9 · Lesson 9.2' };
const O = (k) => { const v = DU_LIEU[`n9-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const MAU = ['#2563eb', '#b85a2b', '#7c3aed', '#009639'];

/** Hình: trái = hash % 3 rồi % 4 (12 khoá, ô đổi màu = đổi máy); phải = vòng băm, may-4 chen vào chỉ lấy MỘT cung. Minh hoạ, không phải số đo. */
function haiCach() {
  const W = 1110, H = 330;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  s += `<text x="20" y="28" font-size="22" font-weight="800" fill="#262626">Plain hash: server = hash(key) % N</text>`;
  const o = 46;
  for (let h = 0; h < 12; h++) {
    const x = 20 + h * o;
    const a = h % 3, b = h % 4, doi = a !== b;
    s += `<text x="${x + 20}" y="62" text-anchor="middle" font-size="15" fill="#666">k${h}</text>`;
    s += `<rect x="${x}" y="70" width="40" height="40" rx="7" fill="${MAU[a]}"/><text x="${x + 20}" y="96" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">${a + 1}</text>`;
    s += `<rect x="${x}" y="150" width="40" height="40" rx="7" fill="${MAU[b]}" stroke="${doi ? '#c0392b' : 'none'}" stroke-width="4"/><text x="${x + 20}" y="176" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">${b + 1}</text>`;
  }
  s += `<text x="20" y="135" font-size="18" fill="#444">% 3  (may-1, may-2, may-3)</text><text x="20" y="215" font-size="18" fill="#444">% 4  (may-4 added)</text>`;
  s += `<text x="20" y="252" font-size="22" font-weight="800" fill="#c0392b">9 of 12 keys land somewhere new</text>`;
  s += `<text x="20" y="282" font-size="17" fill="#666">red border = this key's server changed (illustration)</text>`;
  const cx = 880, cy = 196, r = 108;
  s += `<text x="${cx}" y="28" text-anchor="middle" font-size="22" font-weight="800" fill="#262626">consistent: a ring</text>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#d6d3d1" stroke-width="10"/>`;
  const arc = (g0, g1, m) => { const p = (g) => [cx + r * Math.cos((g - 90) * Math.PI / 180), cy + r * Math.sin((g - 90) * Math.PI / 180)];
    const [x0, y0] = p(g0), [x1, y1] = p(g1); return `<path d="M${x0},${y0} A${r},${r} 0 ${g1 - g0 > 180 ? 1 : 0} 1 ${x1},${y1}" fill="none" stroke="${m}" stroke-width="10"/>`; };
  s += arc(0, 120, MAU[0]) + arc(120, 240, MAU[1]) + arc(240, 300, MAU[3]) + arc(300, 360, MAU[2]);
  const ten = [[120, 'may-1', MAU[0]], [240, 'may-2', MAU[1]], [360, 'may-3', MAU[2]], [300, 'may-4', MAU[3]]];
  for (const [g, t, m] of ten) { const x = cx + (r + 34) * Math.cos((g - 90) * Math.PI / 180), y = cy + (r + 34) * Math.sin((g - 90) * Math.PI / 180);
    s += `<circle cx="${cx + r * Math.cos((g - 90) * Math.PI / 180)}" cy="${cy + r * Math.sin((g - 90) * Math.PI / 180)}" r="11" fill="${m}"/><text x="${x}" y="${y + 6}" text-anchor="middle" font-size="17" font-weight="700" fill="${m}">${t}</text>`; }
  s += `<text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="17" fill="#444">a key belongs to the</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="17" fill="#444">next server clockwise</text>`;
  s += `<text x="${cx}" y="${H - 6}" text-anchor="middle" font-size="19" font-weight="800" fill="#009639">may-4 takes ONE arc — only those keys move</text>`;
  return s + '</svg>';
}

export const S = [
  { cover: true, nhan: 'Chapter 9 · Lesson 9.2', t: 'Sticky routing, and the word<br>that saves 47% of your users', sub: 'Two ways to pin a client — they differ by one word, measured when the pool changes',
    en: 'Lesson 9.2. Sometimes a client has to keep reaching the same backend: an in-memory session, a per-node cache, a WebSocket that reconnects. Nginx offers two ways to arrange that. They differ by one word, and the difference shows up exactly when it matters.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>hash</code> on a key pins a client to one backend</li>
    <li>Adding a server: plain hash moved 72% of users, <code>consistent</code> 25%</li>
    <li>A dead server reshuffles nobody else — in either mode</li>
    <li>Why <code>ip_hash</code> is the wrong key more often than it looks</li>
    <li>Pin by session — or better, do not need pinning at all</li></ul>`,
    en: 'Five takeaways: hash on a key pins a client; when a server is added, plain hash moved seventy two percent of users and consistent only twenty five; a dead server reshuffles nobody else; why ip hash is often the wrong key; and pinning by session, or not needing it at all.' },
  { t: 'Both forms pin a client, measured', body: ngc(`upstream thuong { hash $arg_nguoi;            server …:9501; server …:9502; server …:9503; }
upstream bien   { hash $arg_nguoi consistent; server …:9501; server …:9502; server …:9503; }`, { sm: true, hl: [2] }) + tn(O('ghim'), { fs: 18, wrap: 110 }),
    en: 'Two pools over the same three backends, keyed on the argument nguoi. Each user calls three times in a row. Both forms pin: every user lands on the same machine three times out of three. The difference only shows when the pool of servers changes.' },
  { t: 'Two ways to map a key to a server', body: haiCach() + box('', 'Plain hash is the key modulo the pool size — change the size and almost every key moves. consistent puts servers on a ring; a new server steals only the arc in front of it.', 'lam'),
    en: 'Why. Plain hash is the key modulo the number of servers. Go from three to four and almost every key lands somewhere new: in this illustration, nine of twelve. Consistent places servers on a ring; a key belongs to the next server clockwise. A new server steals only the arc in front of it, so only those keys move.' },
  { t: 'Add one machine to a pool of three', body: tn(O('them'), { fs: 18, wrap: 110 }) +
    meter([['plain hash: users moved', 72, '#c0392b', '43 of 60'], ['consistent: users moved', 25, '#009639', '15 of 60'], ['theoretical minimum', 25, '#64748b', '1 in 4 must move']], { don: '%', rh: 46, fs: 19, nhan: 330 }) +
    box('72 − 25 = 47% of your users', 'With sessions kept in memory, that difference is how many logged-in users get logged out at once — on a deploy that ADDED capacity.', 'do2'),
    en: 'Measured. Sixty users mapped before and after adding machine four and reloading. Plain hash: forty three of sixty moved, seventy two percent. Consistent: fifteen of sixty, twenty five percent — right on the theoretical minimum of one in four. With sessions in memory, that difference is forty seven percent of your users logged out on a deploy that added capacity.' },
  { t: 'Reading 72% against 25%', body: icards([
      ['cut', 'Plain hash is key modulo pool size', 'change the size, almost every key moves — sessions in memory: 72% logged out at once'],
      ['loop', 'consistent places servers on a ring', 'each key → next server clockwise; a new server steals one arc — 25%, the minimum'],
      ['flag', 'One word, and not the default', 'hash $x; without it is what most configs contain — invisible until the day you scale'],
      ['link', 'The same algorithm as memcached\'s ketama', 'if you have configured a distributed cache, you know this setting under another name'],
    ], 2),
    en: 'Reading it. Plain hash is key modulo pool size. Consistent places servers on a ring. The word costs nothing, and it is not the default — most configs omit it because the difference is invisible until the day you scale. It is the same scheme as memcached\'s ketama.' },
  { t: 'And the thing both forms do identically', body: tn(O('chet'), { fs: 18, wrap: 110 }) +
    box('A failed server does not reshuffle anybody else — in either mode', 'nginx marks it unavailable but keeps its place, so only the users pinned to it move. consistent matters when the server LIST changes (an edit + reload), not when a machine simply goes down. Both feel like "we lost a backend"; only one of them reshuffles your users.', 'xanh'),
    en: 'And the thing both forms do the same. Kill machine three without touching the config. Of the thirty seven users not on machine three under plain hash, zero moved; of the forty two under consistent, zero moved. A failed server keeps its place. Consistent matters when the server list changes, not when a machine goes down.' },
  { t: 'ip_hash keys on the network, not the person', body: tn(O('ip'), { fs: 19, wrap: 110 }) + icards([
      ['count', 'IPv4: only the first three octets', 'measured: 20 clients in 203.0.113.x → all on may-1; 20 different /24s → 6 / 7 / 7'],
      ['server', 'NAT and mobile gateways', 'a whole company shares one address — and one backend'],
      ['warn', 'Wifi → mobile data', 'the address changes, the client is silently reassigned and loses its session'],
      ['shield', 'Behind a CDN without real_ip', '$remote_addr is the proxy (3.2) — everyone maps to ONE backend'],
    ], 2),
    en: 'The trap. Ip hash keys on the client address. For IPv4 it uses only the first three octets — measured: twenty clients in one slash twenty four all landed on machine one, while twenty different networks spread six, seven, seven. A corporate NAT or a mobile gateway is one backend; a client that moves from wifi to mobile loses its session; behind a CDN without real IP, everyone maps to one machine.' },
  { t: 'Pin by session — or do not pin at all', body: two(ngc(`# pin by SESSION, not by network address
upstream api {
  hash $cookie_phien consistent;
  server 10.0.1.11:3000;  server 10.0.1.12:3000;
}
# best: NO pinning — session in Redis / a signed JWT`, { sm: true, hl: [3] }), box('Empty key ⇒ normal balancing', 'No cookie yet ⇒ $cookie_phien is empty ⇒ round robin (2 / 2 / 2 below). Correct: the backend answering the first request is the one that sets the cookie.', 'lam'), '') + tn(O('rong'), { fs: 18, wrap: 88 }) + icards([
      ['key', 'Same cookie → same box', 'phien=abc123 → may-2, five times out of five'],
      ['loop', 'No cookie → round robin', '2 / 2 / 2 — the first request is not pinned'],
      ['stack', 'Better: pin nothing', 'session in Redis or a signed JWT → any box serves any request'],
    ], 3),
    en: 'Pin by session, not by network. Hash on the session cookie, consistent. Measured: the same cookie went to machine two five times out of five. A request with no cookie has an empty key and falls back to round robin — two, two, two — which is correct: the backend that handles it sets the cookie. Better still, keep the session in Redis or a signed token and pin nothing.' },
  { t: 'Choosing the key', body: cmp(['Key', 'NAT / CDN', 'Client changes network', 'Pool edit'], [
      ['ip_hash', 'everyone behind it → one box', 'reassigned, session lost', 'most users move'],
      ['hash $cookie_phien consistent', 'fine', 'fine — the cookie travels', '≈ 1 / n move'],
      ['hash $http_x_api_key consistent', 'fine', 'fine', '≈ 1 / n move'],
      ['no pinning (Redis / JWT)', 'fine', 'fine', 'nobody notices'],
    ], { hl: [3] }) + icards([
      ['wrench', 'Draining still moves users', 'down + reload is a list change — consistent moves only that node\'s keys'],
      ['lock', 'NGINX Plus has real sticky cookies', 'open source: hash … consistent on a session cookie is the closest'],
      ['test', 'Measure it on your own pool', 'fixed cookie × a few hundred requests, add a server, count who moved'],
    ], 3),
    en: 'Choosing the key. Ip hash breaks behind NAT and CDNs and when a client changes network. A session cookie or an API key, with consistent, survives all of that and moves about one in n users on a pool edit. No pinning at all is best. Draining a node is still a list change; and in the open source version, hash consistent on a cookie is the closest thing to a sticky cookie.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('sticky routing', 'one client → one backend'),
      kw('hash $key', 'pick by hashing a key'),
      kw('consistent', 'a ring: only ~1/n move'),
      kw('ketama', 'memcached\'s same scheme'),
      kw('ip_hash', 'first 3 octets of IPv4'),
      kw('empty key', '⇒ round robin'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: sticky routing, hash on a key, consistent, ketama, ip hash, and the empty-key fallback.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Two pools: ${c('hash $arg_nguoi')} with and without ${c('consistent')}`,
      'Record 60 users, add a fourth server, reload, count who moved',
      'Kill one backend — count who moved among the others',
      `${c('ip_hash')} behind real_ip: one /24 vs. twenty different ones`,
    ]), box('Keep these', `<ul><li>plain hash: 72% moved</li><li>consistent: 25% — the minimum</li><li>a dead server moves only its own users</li><li>ip_hash keys on a network, not a person</li></ul>`, 'lam'), ''),
    en: 'Your turn: two pools with and without consistent; record sixty users, add a server, count who moved; kill a backend and count again; and ip hash with one network against twenty. Keep: plain hash moved seventy two percent; consistent twenty five, the minimum; a dead server moves only its own users; ip hash keys on a network, not a person.' },
];
export const slides = lamDeck({ chuong: 'Chapter 9 — Load balancing across several backends', bai: '9.2' }, S);
