/**
 * ngx-07-1 — Nginx · Chapter 7 · Lesson 7.1 "limit_req: three burst modes, three very different sites" (deck video + web, 13/11/2026).
 * Bài web: nginx-7-1-limit-req. Output THẬT (scratchpad/ngx/demo/n7-1.txt; nginx/1.24.0; rate=2r/s mỗi IP, phục vụ TỆP TĨNH):
 * ⚠ limit_req + `return 200` ⇒ 10/10 = 200 (return chạy ở pha rewrite, TRƯỚC pha preaccess của limit_req).
 * Lần lượt 10 request: A không burst ⇒ 200 + 9×503; B burst=5 ⇒ 10×200 mất 4,51 s; C burst=5 nodelay ⇒ 6×200 + 4×503 mất 0,04 s.
 * CÙNG LÚC 10 request: B ⇒ 6×200 4×503 mất 2,51 s; C ⇒ 6×200 4×503 mất 0,01 s. limit_req_status 429 (burst=1 nodelay) ⇒ 200 200 429 429 429;
 * error.log "limiting requests, excess: 0.990 by zone "cham"".
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n7-1:file:/tmp/ng/conf/req.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  root /tmp/ng/site;                                             # tệp tĩnh: limit_req chạy ở pha preaccess, SAU return\n  limit_req_zone $binary_remote_addr zone=cham:10m rate=2r/s;   # 2 request/giây mỗi IP = 1 cái mỗi 500 ms\n  server { listen 8080; location / { limit_req zone=cham;                  } }   # A\n  server { listen 8081; location / { limit_req zone=cham burst=5;          } }   # B\n  server { listen 8082; location / { limit_req zone=cham burst=5 nodelay;  } }   # C\n  server { listen 8083; location / { limit_req zone=cham burst=1 nodelay; limit_req_status 429; } }\n}\n",
 "n7-1:file:/root/ban.sh": "#!/bin/bash\n# ban.sh <cổng> <số request> [song] — bắn N request (lần lượt, hoặc \"song\" = cùng lúc), in mã trạng thái + tổng thời gian\np=$1; n=$2; s=$(date +%s%N)\nif [ \"$3\" = song ]; then for i in $(seq $n); do curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:$p/ & done | sort | uniq -c | awk '{printf \"%s x %s   \", $1, $2}'; wait\nelse for i in $(seq $n); do curl -s -o /dev/null -w '%{http_code} ' http://127.0.0.1:$p/; done; fi\nprintf '(mat %s s)\\n' $(awk -v a=$s -v b=$(date +%s%N) 'BEGIN{printf \"%.2f\", (b-a)/1e9}')\n",
 "n7-1:setup": "",
 "n7-1:file:/tmp/ng/conf/ret.conf": "pid       /tmp/ng/logs/ret.pid;\nerror_log /tmp/ng/logs/ret.log;\nevents {}\nhttp {\n  access_log off;\n  limit_req_zone $binary_remote_addr zone=r2:10m rate=2r/s;\n  server { listen 8089; location / { limit_req zone=r2; return 200 \"ok\\n\"; } }\n}\n",
 "n7-1:return": "$ printf 'limit_req + return 200 : '; bash ban.sh 8089 10\nlimit_req + return 200 : 200 200 200 200 200 200 200 200 200 200 (mat 0.04 s)",
 "n7-1:bacach": "$ printf 'A) khong burst      '; bash ban.sh 8080 10; sleep 3\nA) khong burst      200 503 503 503 503 503 503 503 503 503 (mat 0.04 s)\n$ printf 'B) burst=5          '; bash ban.sh 8081 10; sleep 3\nB) burst=5          200 200 200 200 200 200 200 200 200 200 (mat 4.51 s)\n$ printf 'C) burst=5 nodelay  '; bash ban.sh 8082 10; sleep 3\nC) burst=5 nodelay  200 200 200 200 200 200 503 503 503 503 (mat 0.04 s)",
 "n7-1:cungluc": "$ printf 'B) burst=5, 10 CUNG LUC         '; bash ban.sh 8081 10 song; sleep 3\nB) burst=5, 10 CUNG LUC         6 x 200   4 x 503   (mat 2.51 s)\n$ printf 'C) burst=5 nodelay, 10 CUNG LUC '; bash ban.sh 8082 10 song; sleep 3\nC) burst=5 nodelay, 10 CUNG LUC 6 x 200   4 x 503   (mat 0.01 s)",
 "n7-1:ma": "$ : > /tmp/ng/logs/error.log; printf 'mac dinh           : '; bash ban.sh 8080 4; sleep 3\nmac dinh           : 200 503 503 503 (mat 0.04 s)\n$ printf 'limit_req_status 429: '; bash ban.sh 8083 5\nlimit_req_status 429: 200 200 429 429 429 (mat 0.02 s)\n$ grep -m1 -o 'limiting requests.*zone \"cham\"' /tmp/ng/logs/error.log\nlimiting requests, excess: 0.990 by zone \"cham\"",
 "n7-1:file:/tmp/ng/conf/delay.conf": "pid       /tmp/ng/logs/delay.pid;\nerror_log /tmp/ng/logs/delay.log;\nevents {}\nhttp {\n  access_log off;\n  root /tmp/ng/site;\n  limit_req_zone $binary_remote_addr zone=d2:10m rate=2r/s;\n  server { listen 8084; location / { limit_req zone=d2 burst=8 delay=3; } }   # 3 cái đầu của đợt dồn đi ngay, phần sau xếp hàng\n}\n",
 "n7-1:file:/root/tung.sh": "#!/bin/bash\n# tung.sh <cổng> <số request> — bắn N request CÙNG LÚC, in thời gian + mã của TỪNG cái (xếp theo thời gian)\nfor i in $(seq $2); do curl -s -o /dev/null -w '%{time_total} %{http_code}\\n' http://127.0.0.1:$1/ & done | sort -n | awk '{printf \"  #%-2d %5.2f s  %s\\n\", NR, $1, $2}'; wait\n",
 "n7-1:delay": "$ echo 'burst=8 delay=3, 10 CUNG LUC:'; bash tung.sh 8084 10\nburst=8 delay=3, 10 CUNG LUC:\n  #1   0.00 s  503\n  #2   0.00 s  200\n  #3   0.00 s  200\n  #4   0.00 s  200\n  #5   0.00 s  200\n  #6   0.51 s  200\n  #7   1.00 s  200\n  #8   1.50 s  200\n  #9   2.00 s  200\n  #10  2.50 s  200"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, seq, meter } from './_ngx-chung.mjs';


/** Dòng thời gian 6 request được nhận (đo thật: B giãn 0 → 2,51 s; C cả sáu ở 0,01 s) + 4 cái bị từ chối ở 0. */
const dongTG = () => {
  const W = 1110, x0 = 250, sx = (t) => x0 + t * 300;
  let s = `<svg viewBox="0 0 ${W} 250" width="${W}" height="250" font-family="Arial">`;
  for (let t = 0; t <= 2.5; t += 0.5) s += `<line x1="${sx(t)}" y1="20" x2="${sx(t)}" y2="220" stroke="#e2e8f0" stroke-width="2"/><text x="${sx(t)}" y="244" text-anchor="middle" font-size="18" fill="#64748b">${t.toFixed(1)} s</text>`;
  const lane = (y, ten, mau, ts) => {
    s += `<text x="10" y="${y + 8}" font-size="21" font-weight="800" fill="${mau}">${ten}</text><line x1="${x0}" y1="${y}" x2="${W - 20}" y2="${y}" stroke="${mau}" stroke-width="3"/>`;
    ts.forEach((t, i) => { s += `<circle cx="${sx(t) + (t === 0 ? i * 9 : 0)}" cy="${y}" r="13" fill="${mau}"/>`; });
    s += `<g transform="translate(${x0 - 34},${y - 40})">${[0, 1, 2, 3].map((k) => `<text x="${k * 15}" y="0" font-size="17" font-weight="800" fill="#c0392b">✗</text>`).join('')}<text x="66" y="0" font-size="17" font-weight="800" fill="#c0392b">4 × 503 at once</text></g>`;
  };
  lane(70, 'B  burst=5', '#2563eb', [0, 0.5, 1, 1.5, 2, 2.5]);
  lane(170, 'C  nodelay', '#008a34', [0, 0, 0, 0, 0, 0]);
  s += `<text x="${sx(2.5)}" y="${54}" text-anchor="middle" font-size="18" font-weight="700" fill="#2563eb">last of six: 2.51 s</text>`;
  s += `<text x="${sx(0.7)}" y="${154}" font-size="18" font-weight="700" fill="#008a34">all six: 0.01 s</text>`;
  return s + '</svg>';
};

export const deck = { key: 'ngx-07-1', code: 'NGX 7.1', title: 'limit_req: three burst modes, three very different sites', sub: 'Chapter 7 · Lesson 7.1' };
const O = (k) => { const v = DU_LIEU[`n7-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const KQ = (k) => O(k).split('\n').filter((l) => !l.startsWith('$ ')).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 7 · Lesson 7.1', t: 'limit_req: three burst modes,<br>three very different sites', sub: 'Same rate, three ways to write it — one rejects, one queues, one lets a burst through at once',
    en: 'Lesson 7.1. The same rate written three ways gives three very different sites: one rejects everything above the rate, one queues it, one lets a burst through at once. And one directive placement makes the limit do nothing at all.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The leaky bucket: rate, burst, nodelay</li>
    <li>The trap: <code>limit_req</code> never sees a <code>return</code></li>
    <li>Ten requests in a row, three configs</li>
    <li>Ten requests at once: queue, pass, or delay=N</li>
    <li>503 or 429, and the line in error.log</li></ul>`,
    en: 'Five takeaways: the leaky bucket; the return trap; ten requests in a row; ten at once, including the middle setting delay equals N; and the status code plus the log line.' },
  { t: 'The leaky bucket', body: two(ngc(`limit_req_zone $binary_remote_addr zone=cham:10m rate=2r/s;
location / {
  limit_req zone=cham;                  # A
  limit_req zone=cham burst=5;          # B  (one of the three)
  limit_req zone=cham burst=5 nodelay;  # C
}`, { sm: true, hl: [1] }), icards([
      ['gauge', 'rate=2r/s', 'one request every 500 ms leaks out — per key (here: per IP)'],
      ['layers', 'burst=5', 'a waiting room for 5 extra requests; they are DELAYED to the rate'],
      ['bolt', 'nodelay', 'the waiting room is still counted, but its requests go through AT ONCE'],
    ], 1), 'r64'),
    en: 'The leaky bucket. Rate two per second means one request leaks out every five hundred milliseconds, per key. Burst five is a waiting room for five extra requests, delayed to the rate. Nodelay keeps counting the room but lets its requests through immediately.' },
  { t: 'Trap: limit_req never sees a return', body: tn(O('return'), { fs: 15, wrap: 110 }) +
    seq(['client', 'rewrite phase', 'preaccess (limit_req)', 'content'], [[0, 1, 'GET /'], [1, 0, 'return 200 — answered HERE', '#c0392b'], [1, 2, '(never reached)', '#94a3b8', true]], { w: 1110, rh: 44 }) +
    box('Test a limit on a real file or a real proxy_pass', 'All demos below serve a static file. A <code>return</code> in the same location answers before the limiter runs — 10 out of 10 were 200.', 'do2'),
    en: 'The trap first. With limit req in front of return two hundred, ten out of ten requests passed. Return answers in the rewrite phase, before the preaccess phase where limit req lives. Test limits on a real file or a real proxy pass.' },
  { t: 'Ten requests in a row', body: tn(KQ('bacach'), { fs: 15, wrap: 110 }) +
    cmp(['', 'Result', 'What the user feels'], [
      ['A — no burst', '1 × 200, 9 × 503', 'a page with 10 assets breaks'],
      ['B — burst=5', '10 × 200 in 4.51 s', 'nothing fails — everything is slow'],
      ['C — burst=5 nodelay', '6 × 200, 4 × 503 in 0.04 s', 'fast up to the burst, then refused'],
    ], { hl: [3] }),
    en: 'Ten requests one after another. A: one passed, nine got five oh three. B: all ten passed, but it took four and a half seconds because each waited its turn. C: six passed instantly — the one allowed plus five from the burst — and four were refused.' },
  { t: 'Ten requests at once', body: tn(KQ('cungluc'), { fs: 15, wrap: 110 }) +
    dongTG() +
    box('Same count, different clock', 'At once, both accepted 6 and refused 4. B made the last of the six wait 2.5 s; C answered all six immediately. For a page load, nodelay is almost always what you want.', 'lam'),
    en: 'Ten at once. Both modes accepted six and refused four. The difference is the clock: B queued the extra five and the last one waited two and a half seconds; C answered all six at once. For a page that loads many files together, nodelay is almost always the right mode.' },
  { t: 'delay=N: the setting in the middle', body: two(tn(KQ('delay'), { fs: 15, wrap: 70 }), icards([
      ['bolt', 'nodelay — interactive', 'a page fires many calls at once; none should wait behind the limiter'],
      ['clock', 'queue — expensive backend', 'reports, image resizes, LLM calls: waiting beats a refusal'],
      ['layers', 'delay=N — both', 'the first N of a burst go at once, the rest are queued to the rate'],
      ['warn', 'no burst — almost never', 'only where a 2nd request within 500 ms is abuse by itself (reset e-mail, SMS)'],
    ], 1), 'r64'),
    en: 'The setting in the middle: burst eight delay three, ten requests at once. Four answered at once — the one allowed plus three from delay — then five were released every five hundred milliseconds, and one was refused. Nodelay for interactive traffic, a queue for expensive backends, delay N when you need both, and no burst almost never.' },
  { t: 'Reading the rate you set', body: icards([
      ['loop', 'rate = refill speed', '10r/s is one token every 100 ms, not a counter reset each second'],
      ['count', 'rate=30r/m exists', 'per-minute limits for e-mail, exports, anything slow by nature'],
      ['eye', 'limit_req_log_level warn', 'refusals stop drowning among real errors; or log $limit_req_status'],
      ['pulse', 'pick numbers from the log', 'p99 requests per IP per second of NORMAL traffic, then a burst = one page load'],
    ], 2) + ngc(`limit_req_zone $binary_remote_addr zone=giay:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=gio:10m  rate=600r/m;

location /api/ {
  limit_req zone=giay burst=20 nodelay;  # a normal burst
  limit_req zone=gio  burst=100;         # a slow, steady scraper
  limit_req_status 429;
}`, { sm: true, hl: [5, 6] }),
    en: 'Reading the rate. Rate is a refill speed: ten per second is one token every hundred milliseconds, not a counter reset each second. Per minute exists. Two zones can apply to one location — a generous per second limit plus a strict longer one, both enforced. Log refusals at warn, and pick the numbers from your access log: the ninety ninth percentile of normal traffic per IP, plus a burst that covers one page load.' },
  { t: '503 or 429, and the log line', body: tn(KQ('ma'), { fs: 15, wrap: 110 }) +
    two(box('limit_req_status 429', 'The default 503 says "server broken". 429 Too Many Requests says "slow down" — clients and monitoring read it correctly.', 'xanh'),
      box('error.log tells you how far over', '<code>excess: 0.990</code> = how many requests above the rate this key is. The zone name tells you which rule fired.', 'lam')),
    en: 'Status and log. The default is five oh three, which says the server is broken. Set limit req status four twenty nine: too many requests. And the error log line gives the excess and the zone name, so you know which rule fired and by how much.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('limit_req_zone', 'the key, the shared memory, and the rate'),
      kw('rate=2r/s', 'one request leaks out every 500 ms'),
      kw('burst', 'a waiting room above the rate'),
      kw('nodelay', 'the waiting room passes at once'),
      kw('limit_req_status 429', 'the honest status code'),
      kw('preaccess phase', 'where limit_req runs — after return'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: limit req zone, the rate, burst, nodelay, limit req status four twenty nine, and the preaccess phase.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Serve a static file behind ${c('rate=2r/s')}`,
      `Try ${c('return 200')} first — and see nothing is limited`,
      `Ten in a row: no burst, ${c('burst=5')}, ${c('burst=5 nodelay')}`,
      `Ten at once with ${c('&')} — time both modes, then ${c('delay=3')}`,
      `Switch to 429 and read the error.log line`,
    ]), box('Keep these', `<ul><li>limit_req skips return</li><li>burst queues, nodelay passes</li><li>A page = many requests at once</li><li>Use 429</li></ul>`, 'lam'), ''),
    en: 'Your turn: serve a file behind the limit, try return first and see it ignored, run the three modes in a row and at once, then switch to four twenty nine. Keep: limit req skips return; burst queues, nodelay passes; a page is many requests at once; use four twenty nine.' },
];
export const slides = lamDeck({ chuong: 'Chapter 7 — Limits: rate, connections, size', bai: '7.1' }, S);
