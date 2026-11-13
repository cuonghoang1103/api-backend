/**
 * ngx-10-5 — Nginx · Chapter 10 · Lesson 10.5 "stub_status: seven numbers, and the one that says you are dropping traffic" (deck video + web, 13/11/2026).
 * Bài web: nginx-10-5-stub-status. Output THẬT (scratchpad/ngx/demo/n10-5.txt; nginx/1.24.0, 1 worker):
 * /trang-thai chỉ cho 10.0.0.0/8 ⇒ 127.0.0.1 nhận 403 · nhàn rỗi Active 1 · 20 request song song tới /cham ⇒ Active 21, Writing 21 · 8 kết nối keepalive im lặng ⇒
 * Active 9, Waiting 8 · worker_connections 4 + 40 kết nối /cham ⇒ 39 client không có phản hồi (000), accepts 42 handled 4 requests 3, 38× "worker_connections are not
 * enough" · 30 request rời ⇒ accepts +31, 1,0 request/kết nối; một kết nối keepalive ⇒ accepts +2 requests +31, 15,5 (chính trang trạng thái tự đếm mình).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n10-5:file:/tmp/ng/conf/ss.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nworker_processes 1;\nevents {}\nhttp {\n  access_log off;\n  keepalive_timeout 60s;\n  server {\n    listen 8080;\n    location = /trang-thai {\n      stub_status;\n      allow 10.0.0.0/8;          # chỉ mạng nội bộ\n      deny all;\n    }\n    location = /tt { stub_status; }                       # bản không chặn — để đo trong lab\n    location / { proxy_pass http://127.0.0.1:9600; }\n  }\n}\n",
 "n10-5:file:/tmp/ng/conf/it-ket-noi.conf": "pid       /tmp/ng/logs/nho.pid;\nerror_log /tmp/ng/logs/nho.log;\nworker_processes 1;\nevents { worker_connections 4; }                          # CỐ Ý quá nhỏ\nhttp {\n  access_log off;\n  server { listen 8081; location = /tt { stub_status; } location / { proxy_pass http://127.0.0.1:9600; } }\n}\n",
 "n10-5:file:/root/giu_mo.py": "# giu_mo.py <n> <giây> — mở n kết nối keepalive, mỗi cái gửi MỘT request rồi giữ im lặng\nimport socket, sys, time\nds = []\nfor i in range(int(sys.argv[1])):\n    s = socket.create_connection(('127.0.0.1', 8080))\n    s.sendall(b'GET /binh-thuong HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n'); s.recv(4096); ds.append(s)\ntime.sleep(float(sys.argv[2]))\n",
 "n10-5:setup": "",
 "n10-5:chan": "$ curl -s -o /dev/null -w '127.0.0.1 hoi /trang-thai (chi cho 10.0.0.0/8): %{http_code}\\n' http://127.0.0.1:8080/trang-thai\n127.0.0.1 hoi /trang-thai (chi cho 10.0.0.0/8): 403\n$ curl -s http://127.0.0.1:8080/tt\nActive connections: 1 \nserver accepts handled requests\n 2 2 2 \nReading: 0 Writing: 1 Waiting: 0 ",
 "n10-5:rww": "$ curl -s 127.0.0.1:8080/tt | sed -n '1p;4p'     # nhàn rỗi\n=== nhan roi ===\nActive connections: 1 \nReading: 0 Writing: 1 Waiting: 0 \n$ for i in $(seq 20); do curl -s -o /dev/null 127.0.0.1:8080/cham & done; sleep 0.3; curl -s 127.0.0.1:8080/tt | sed -n '1p;4p'\n=== 20 request song song toi /cham (600 ms) ===\nActive connections: 21 \nReading: 0 Writing: 21 Waiting: 0 \n$ python3 giu_mo.py 8 3 & sleep 1; curl -s 127.0.0.1:8080/tt | sed -n '1p;4p'\n=== 8 ket noi keepalive DANG MO nhung im lang ===\nActive connections: 9 \nReading: 0 Writing: 1 Waiting: 8 \n$ sleep 3; echo '=== sau khi dong het ==='; curl -s http://127.0.0.1:8080/tt | sed -n '1p;4p'\n=== sau khi dong het ===\nActive connections: 1 \nReading: 0 Writing: 1 Waiting: 0 ",
 "n10-5:roi": "$ curl -s 127.0.0.1:8081/tt | sed -n '2,3p'     # worker_connections 4\n=== truoc khi ep tai (worker_connections 4) ===\nserver accepts handled requests\n 1 1 1 \n$ for i in $(seq 40); do curl -s -o /dev/null --max-time 4 -w '%{http_code}\\n' 127.0.0.1:8081/cham & done | sort | uniq -c\n40 client nhan:  39 000  1 200    (000 = khong co phan hoi nao)\n$ echo '=== sau khi ep tai ==='; curl -s http://127.0.0.1:8081/tt | sed -n '2,3p'\n=== sau khi ep tai ===\nserver accepts handled requests\n 42 4 3 \n$ grep -o 'worker_connections are not enough' nho.log | uniq -c\n     38 worker_connections are not enough",
 "n10-5:file:/root/tile.sh": "# tile.sh — đếm accepts/handled/requests TRƯỚC và SAU 30 request: rời rạc, rồi trên MỘT kết nối keepalive\nso() { curl -s http://127.0.0.1:8080/tt | sed -n 3p; }\na=($(so)); for i in $(seq 30); do curl -s -o /dev/null http://127.0.0.1:8080/binh-thuong; done; b=($(so))\necho \"30 request, KHONG keepalive: accepts +$((b[0]-a[0]))  handled +$((b[1]-a[1]))  requests +$((b[2]-a[2]))  -> $(echo \"scale=1; ($((b[2]-a[2])))/($((b[0]-a[0])))\" | bc) request/ket noi\"\na=($(so)); curl -s $(for i in $(seq 30); do printf 'http://127.0.0.1:8080/binh-thuong '; done) > /dev/null; b=($(so))\necho \"30 request, CO keepalive  : accepts +$((b[0]-a[0]))  handled +$((b[1]-a[1]))  requests +$((b[2]-a[2]))  -> $(echo \"scale=1; ($((b[2]-a[2])))/($((b[0]-a[0])))\" | bc) request/ket noi\"\n",
 "n10-5:tile": "$ bash tile.sh\n30 request, KHONG keepalive: accepts +31  handled +31  requests +31  -> 1.0 request/ket noi\n30 request, CO keepalive  : accepts +2  handled +2  requests +31  -> 15.5 request/ket noi"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, meter, tiers } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-10-5', code: 'NGX 10.5', title: 'stub_status: seven numbers, and the one that says you are dropping traffic', sub: 'Chapter 10 · Lesson 10.5' };
const O = (k) => { const v = DU_LIEU[`n10-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };

/** Hình: bảy con số, mỗi số một thẻ chú thích — vẽ như bảng điều khiển. */
function bayConSo() {
  const W = 1110, H = 250;
  const o = [['Active', '1', 'open client connections now (incl. this one)', '#009639'], ['accepts', '2', 'taken off the kernel queue — total', '#2563eb'], ['handled', '2', 'actually served — total', '#c0392b'], ['requests', '2', 'HTTP requests — total', '#2563eb'],
    ['Reading', '0', 'reading a request header', '#7c3aed'], ['Writing', '1', 'past the header, not finished (incl. waiting on upstream)', '#b85a2b'], ['Waiting', '0', 'idle keepalive', '#64748b']];
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  o.forEach(([ten, so, ghi, m], i) => {
    const cot = i < 4 ? i : i - 4, hang = i < 4 ? 0 : 1, w = 266, x = 6 + cot * (w + 10) + (hang ? 138 : 0), y = 8 + hang * 122;
    s += `<rect x="${x}" y="${y}" width="${w}" height="110" rx="12" fill="${m}12" stroke="${m}" stroke-width="2.5"/>`;
    s += `<text x="${x + 16}" y="${y + 32}" font-size="21" font-weight="800" fill="${m}">${ten}</text><text x="${x + w - 16}" y="${y + 40}" text-anchor="end" font-family="monospace" font-size="34" font-weight="800" fill="${m}">${so}</text>`;
    const tu = ghi.split(' '), dong = ['', ''];
    tu.forEach((t) => { if ((dong[0] + ' ' + t).length < 30 && !dong[1]) dong[0] += (dong[0] ? ' ' : '') + t; else dong[1] += (dong[1] ? ' ' : '') + t; });
    s += `<text x="${x + 16}" y="${y + 70}" font-size="15" fill="#444">${dong[0]}</text><text x="${x + 16}" y="${y + 92}" font-size="15" fill="#444">${dong[1]}</text>`;
  });
  return s + '</svg>';
}

export const S = [
  { cover: true, nhan: 'Chapter 10 · Lesson 10.5', t: 'stub_status: seven numbers,<br>and the one that says you are dropping traffic', sub: 'Logs describe requests that finished — not connections open now, or the ones refused',
    en: 'Lesson 10.5. Logs tell you about requests that finished. They cannot tell you how many connections are open right now, or that Nginx just refused one. Stub status is the built in answer: seven integers, no dependencies, and one of them is the difference between a busy server and a failing one.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Turning it on — and why allow/deny is not optional</li>
    <li>The seven numbers, and what Writing really means</li>
    <li>Waiting: idle keepalive, measured</li>
    <li>accepts ≠ handled: the counter for traffic you silently dropped</li>
    <li>requests ÷ accepts — and the page that counts itself</li></ul>`,
    en: 'Five takeaways: turning it on, with allow and deny; the seven numbers and what Writing really means; Waiting as idle keepalive; accepts against handled, the counter for dropped traffic; and requests divided by accepts.' },
  { t: 'Turning it on', body: two(ngc(`location = /trang-thai {
  stub_status;
  access_log off;    # polled every few s
  allow 10.0.0.0/8;  # internal only
  deny all;
}`, { hl: [4, 5] }), icards([
      ['lock', 'allow / deny is not optional', 'it tells an attacker your live connection count and traffic rate'],
      ['map', 'location =, not a prefix', 'a prefix captures everything beneath it (2.1)'],
    ], 1), '') + tn(O('chan'), { fs: 18, wrap: 110 }),
    en: 'Turning it on: stub status in an exact location, access log off because a monitor polls it every few seconds, and allow and deny. Measured: from an address outside the allowed range, four oh three. The unrestricted copy used in this lab shows the whole output: seven numbers.' },
  { t: 'The seven numbers', body: bayConSo() + box('Three are totals since start, four are "right now"', 'accepts, handled and requests only ever grow — read them as rates by subtracting two samples. Active, Reading, Writing and Waiting are a snapshot.', 'lam'),
    en: 'The seven numbers. Active: open client connections now, including the one asking. Accepts, handled and requests: totals since start — read them as rates by subtracting two samples. Reading: receiving a request header. Writing: past the header and not finished. Waiting: idle keepalive connections.' },
  { t: 'Reading / Writing / Waiting, measured', body: tn(O('rww'), { fs: 14, wrap: 126 }) + icards([
      ['pulse', 'Writing 21', '20 in flight + this one, blocked on a 600 ms upstream'],
      ['stack', 'Waiting 8', 'idle keepalive — healthy'],
      ['check', 'Back to 1', 'Active counts this request'],
    ], 3),
    en: 'Measured. Twenty requests to a backend that sleeps six hundred milliseconds: Active twenty one, Writing twenty one — Writing does not mean sending bytes, it means past the request header, which for a proxy is mostly time blocked on the backend. Eight idle keepalive connections: Waiting eight. A large Waiting is healthy; it matters only near the connection limit.' },
  { t: 'accepts ≠ handled: the number nobody looks at', body: tn(O('roi'), { fs: 14, wrap: 126 }) +
    meter([['accepts', 42, '#2563eb'], ['handled', 4, '#c0392b'], ['requests', 3, '#64748b']], { don: '', rh: 30, fs: 16, nhan: 200 }) +
    box('38 connections accepted, then dropped', 'worker_connections 4, forty slow requests: 39 clients got NO response at all (curl 000) — no status code, nothing in the access log. Only accepts − handled and the [alert] lines show it.', 'do2'),
    en: 'The number nobody looks at. A server deliberately limited to four worker connections, hit with forty slow requests. Thirty nine clients got no response at all. Accepts forty two, handled four. Thirty eight connections were taken off the kernel queue and dropped, and the error log said worker connections are not enough thirty eight times. In the access log, those requests do not exist.' },
  { t: 'Alerting on the gap', body: tiers([
      ['flag', 'Alert on the gap', 'sample twice, subtract: accepts − handled growing = an outage', '#c0392b'],
      ['plug', 'Cause 1: worker_connections', 'a proxied request uses TWO slots — client + upstream', '#b85a2b'],
      ['box', 'Cause 2: file descriptors', 'raise worker_rlimit_nofile; "Too many open files"', '#2563eb'],
      ['cpu', 'The ceiling is a product', 'workers × connections — 4 × 1024 ≈ 2048 proxied', '#7c3aed'],
    ], { th: 70, gap: 26 }),
    en: 'Alert on the difference, not the values: any growth in accepts minus handled is an outage in progress. The usual cause is worker connections — and a proxied request uses two slots, so a proxy runs out at half the number you would guess. The second cause is file descriptors. The ceiling is workers times connections.' },
  { t: 'A derived number: requests per connection', body: tn(O('tile'), { fs: 17, wrap: 110 }) +
    meter([['separate curls — requests per connection', 1.0, '#c0392b'], ['one keepalive connection — measured', 15.5, '#2563eb'], ['…without the status page counting itself', 30, '#009639']], { don: '', rh: 40, fs: 17, nhan: 420 }) +
    box('The status page counts itself', 'Each sample adds one connection and one request. Here it dragged 30 → 15.5 — a 48% error from one poll. A monitor polling every 5 s adds 17,280 connections a day.', 'do2'),
    en: 'A derived number: requests divided by accepts is a direct readout of keepalive. Thirty separate curls: one point zero. Thirty requests on one keepalive connection: fifteen point five — but the true value is thirty. The status page counts itself: each sample adds one connection and one request, and here one poll halved the ratio.' },
  { t: 'What stub_status cannot tell you', body: cmp(['Missing', 'Why it matters', 'Get it from'], [
      ['status codes', '100% 502s looks identical to healthy — every response counts as handled', 'the access log (10.1, 10.2)'],
      ['latency', 'Writing hints at slow upstreams but measures nothing', '$request_time / $upstream_response_time'],
      ['per-site / per-upstream', 'seven numbers for the whole server', 'the log, or vts / njs / NGINX Plus'],
      ['continuity', 'a restart zeroes the totals (a reload keeps them)', 'a monitor that handles counter resets'],
    ]) + box('Two layers cover most of it', 'stub_status for connection health · the access log + a shipper for request health.', 'xanh'),
    en: 'What it cannot tell you: no status codes — a server returning only five oh twos looks healthy; no latency; no per site or per upstream breakdown; and a restart zeroes the totals. Stub status for connection health, the access log for request health — together they cover most of what a commercial dashboard shows.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('stub_status', 'seven built-in counters'),
      kw('Writing', 'incl. waiting on upstream'),
      kw('Waiting', 'idle keepalive'),
      kw('accepts − handled', 'dropped connections'),
      kw('requests ÷ accepts', 'keepalive readout'),
      kw('worker_connections', '×2 for a proxy'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: stub status, Writing, Waiting, accepts minus handled, requests divided by accepts, and worker connections.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'stub_status behind allow/deny — check the 403',
      '20 slow requests in parallel — read Writing',
      'Idle keepalive connections — read Waiting',
      'worker_connections 4 + 40 requests — read accepts vs handled',
    ]), box('Keep these', `<ul><li>allow/deny, always</li><li>Writing includes the upstream wait</li><li>alert on accepts − handled</li><li>the page counts itself</li></ul>`, 'lam'), ''),
    en: 'Your turn: stub status behind allow and deny; twenty slow requests and read Writing; idle keepalive and read Waiting; four worker connections and forty requests, then read accepts against handled. Keep: allow and deny always; Writing includes the upstream wait; alert on accepts minus handled; the page counts itself.' },
];
export const slides = lamDeck({ chuong: 'Chapter 10 — Logs, and seeing what is happening', bai: '10.5' }, S);
