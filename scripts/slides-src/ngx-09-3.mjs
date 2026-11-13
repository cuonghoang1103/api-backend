/**
 * ngx-09-3 — Nginx · Chapter 9 · Lesson 9.3 "When a backend dies: thirty requests, zero errors" (deck video + web, 13/11/2026).
 * Bài web: nginx-9-3-khi-backend-chet. Output THẬT (scratchpad/ngx/demo/n9-3.txt; nginx/1.24.0, error_log mức warn):
 * giết may-2 ⇒ 30 request: may-1=15 may-3=15, 0 lỗi; error.log 1× connect() failed (111) + 1× upstream server temporarily disabled ([warn]) ·
 * sống lại: NGAY 15/15, sau 11 s 10/9/11 · backup: hai máy chính 10/10, giết may-2 ⇒ may-1=20 (backup vẫn đứng yên), giết cả may-1 ⇒ may-3=20 ·
 * POST mặc định tới máy chết giữa chừng ⇒ 502, đơn ghi 1 lần; non_idempotent ⇒ 200 nhưng đơn ghi 2 lần · cả bể chết ⇒ 502 ×3, "no live upstreams".
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n9-3:file:/root/dem.sh": "# dem.sh <url> <n> [song song] — gửi n request, đếm máy nào trả lời; mã lỗi HTTP (>= 400) đếm vào LOI\nurl=$1; n=$2; p=${3:-1}\nseq $n | xargs -P $p -I{} sh -c \"curl -s -f '$url' || echo LOI\" | sort | uniq -c | awk '{printf \"%s=%s  \", $2, $1} END {print \"\"}'\n",
 "n9-3:file:/root/don.js": "// don.js <tên> <cổng> [hong] — nhận POST /don: GHI đơn vào /tmp/ng/don.log; \"hong\" ⇒ ghi xong thì CHẾT giữa chừng (cắt kết nối, không trả lời)\nconst [ten, cong, hong] = process.argv.slice(2);\nrequire('http').createServer((q, r) => {\n  q.on('data', () => {}); q.on('end', () => {\n    require('fs').appendFileSync('/tmp/ng/don.log', `${ten} da ghi don\\n`);\n    if (hong) return q.socket.destroy();\n    r.end(`${ten}: da tao don\\n`);\n  });\n}).listen(+cong, '127.0.0.1');\n",
 "n9-3:file:/tmp/ng/conf/hc.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log warn;   # mức warn: để thấy dòng \"temporarily disabled\"\nevents {}\nhttp {\n  access_log off;\n  upstream ba {                              # KHÔNG viết gì ⇒ mặc định max_fails=1 fail_timeout=10s\n    server 127.0.0.1:9501; server 127.0.0.1:9502; server 127.0.0.1:9503;\n  }\n  upstream du_phong { server 127.0.0.1:9501; server 127.0.0.1:9502; server 127.0.0.1:9503 backup; }\n  upstream don_a { server 127.0.0.1:9505; server 127.0.0.1:9506; }\n  upstream don_b { server 127.0.0.1:9505; server 127.0.0.1:9506; }\n  upstream chet_het { server 127.0.0.1:9601; server 127.0.0.1:9602; }   # không ai nghe ở hai cổng này\n  server {\n    listen 8080;\n    location /ba/       { proxy_pass http://ba; }\n    location /du-phong/ { proxy_pass http://du_phong; }\n    location /don-mac-dinh/  { proxy_pass http://don_a/don; }                       # mặc định: error timeout\n    location /don-nguy-hiem/ { proxy_next_upstream error timeout non_idempotent;    # \"cho chắc ăn\"\n                               proxy_pass http://don_b/don; }\n    location /chet-het/ { proxy_pass http://chet_het; }\n  }\n}\n",
 "n9-3:setup": "",
 "n9-3:giet": "$ bash dem.sh http://127.0.0.1:8080/ba/ 30        # trước khi giết\nmay-1=10  may-2=10  may-3=10  \n$ pkill -f 'may.js may-2'                       # giết may-2\n$ bash dem.sh http://127.0.0.1:8080/ba/ 30        # sau khi giết\nmay-1=15  may-3=15  \n$ grep -oE 'connect\\(\\) failed[^,]*|temporarily disabled' error.log | sort | uniq -c\n      1 connect() failed (111: Connection refused)\n      1 upstream server temporarily disabled",
 "n9-3:songlai": "$ node may.js may-2 9502 &                      # may-2 sống lại\n$ bash dem.sh http://127.0.0.1:8080/ba/ 30        # NGAY sau khi sống lại\nmay-1=15  may-3=15  \n$ sleep 11; bash dem.sh http://127.0.0.1:8080/ba/ 30   # sau 11 giây (fail_timeout 10s)\nmay-1=10  may-2=9  may-3=11  ",
 "n9-3:backup": "$ bash dem.sh http://127.0.0.1:8080/du-phong/ 20  # hai máy chính sống\nmay-1=10  may-2=10  \n$ pkill -f 'may.js may-2'; bash dem.sh http://127.0.0.1:8080/du-phong/ 20\nmay-1=20  \n$ pkill -f 'may.js may-1'; bash dem.sh http://127.0.0.1:8080/du-phong/ 20\nmay-3=20  ",
 "n9-3:post": "$ curl -s -o /dev/null -w '%{http_code}\\n' -X POST -d 'sp=ao' http://127.0.0.1:8080/don-mac-dinh/\n502\n$ cat /tmp/ng/don.log\nmay-hong da ghi don\n$ curl -s -w '%{http_code}\\n' -X POST -d 'sp=ao' http://127.0.0.1:8080/don-nguy-hiem/\nmay-tot: da tao don\n200\n$ cat /tmp/ng/don.log\nmay-hong da ghi don\nmay-tot da ghi don",
 "n9-3:chethet": "$ for k in 1 2 3; do curl -s -o /dev/null -w '%{http_code} ' http://127.0.0.1:8080/chet-het/; done; echo\n502 502 502 \n$ grep -o 'no live upstreams' error.log | uniq -c\n      2 no live upstreams"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, seq, tiers } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-09-3', code: 'NGX 9.3', title: 'When a backend dies: thirty requests, zero errors', sub: 'Chapter 9 · Lesson 9.3' };
const O = (k) => { const v = DU_LIEU[`n9-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };

/** Dòng thời gian kiểm tra sức khoẻ THỤ ĐỘNG (fail_timeout 10 s) — theo đúng phép đo. */
function dongThoiGian() {
  const W = 1110, H = 270, y = 150, x0 = 50, x1 = 1060;
  const X = (t) => x0 + (t / 13) * (x1 - x0);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  s += `<rect x="${X(1)}" y="${y - 24}" width="${X(11) - X(1)}" height="48" rx="8" fill="#fdecea" stroke="#c0392b" stroke-width="2"/>`;
  s += `<text x="${(X(1) + X(11)) / 2}" y="${y + 8}" text-anchor="middle" font-size="20" font-weight="700" fill="#c0392b">may-2 out of rotation — fail_timeout 10 s</text>`;
  s += `<line x1="${x0}" y1="${y + 44}" x2="${x1}" y2="${y + 44}" stroke="#94a3b8" stroke-width="3"/>`;
  const moc = [[0, 'kill may-2', '#c0392b', -1, 'start'], [1, '1st request refused → RETRIED on may-3', '#c0392b', 1, 'start'], [4, 'may-2 alive again — still unused', '#7c3aed', -1, 'middle'],
    [11, 'window over: next request IS the probe', '#2563eb', 1, 'end'], [12, 'back in rotation: 10 / 9 / 11', '#009639', -1, 'end']];
  for (const [t, ten, m, up, neo] of moc) {
    s += `<circle cx="${X(t)}" cy="${y + 44}" r="10" fill="${m}"/>`;
    s += `<line x1="${X(t)}" y1="${up > 0 ? y + 54 : y - 30}" x2="${X(t)}" y2="${up > 0 ? y + 76 : y - 52}" stroke="${m}" stroke-width="2"/>`;
    s += `<text x="${X(t)}" y="${up > 0 ? y + 98 : y - 60}" text-anchor="${neo}" font-size="20" font-weight="700" fill="${m}">${ten}</text>`;
  }
  s += `<text x="${x0}" y="${H - 4}" font-size="16" fill="#666">t = 0 s</text><text x="${X(11)}" y="${H - 4}" text-anchor="middle" font-size="16" fill="#666">≈ 11 s</text>`;
  return s + '</svg>';
}

export const S = [
  { cover: true, nhan: 'Chapter 9 · Lesson 9.3', t: 'When a backend dies:<br>thirty requests, zero errors', sub: 'Kill a process mid-flight, count what the clients received',
    en: 'Lesson 9.3. A pool of backends is only worth having if losing one is invisible. Nginx does that with no health-check configuration at all, using a mechanism that is easy to misread — so this lesson kills a process mid-flight and counts what the clients received.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Kill one of three: the first request is retried, nobody sees an error</li>
    <li>Passive health checks are the default — and recovery is a timer</li>
    <li><code>backup</code>: used only when every primary is dead</li>
    <li>The retry that places an order twice: <code>non_idempotent</code></li>
    <li>What the pool cannot save you from</li></ul>`,
    en: 'Five takeaways: kill one of three and nobody sees an error; passive health checks are the default and recovery is a timer; backup is used only when every primary is dead; the retry that places an order twice; and what the pool cannot save you from.' },
  { t: 'Kill one of three, keep sending', body: ngc(`error_log /tmp/ng/logs/error.log warn;   # warn: to SEE the "disabled" line
upstream ba {                              # nothing written ⇒ max_fails=1 fail_timeout=10s
  server …:9501; server …:9502; server …:9503;
}`, { sm: true, hl: [1, 2] }) + tn(O('giet'), { fs: 18, wrap: 110 }),
    en: 'Three backends, no health-check settings at all. Thirty requests: ten, ten, ten. Kill machine two. Thirty more: fifteen and fifteen — not a single five oh two. The error log has exactly one connect failed and one upstream server temporarily disabled — and that second line is a warning, so you only see it with the error log at warn level.' },
  { t: 'What happened to the one request that hit the dead box', body: seq(['client', 'nginx', 'may-2 (dead)', 'may-3'], [
      [0, 1, 'GET /ba/'], [1, 2, 'connect()', '#c0392b'], [2, 1, '111: Connection refused', '#c0392b', true],
      [1, 3, 'SAME request, next server', '#009639'], [3, 1, '200 may-3', '#009639', true], [1, 0, '200 — one response, no trace of the retry', '#009639'],
    ], { w: 1110, rh: 44, fs: 17, ghi: [[2, 'may-2 marked unavailable for fail_timeout (10 s)']] }) + icards([
      ['loop', 'Retried, not reported', 'error + timeout are retried by default (proxy_next_upstream)'],
      ['lock', 'Then marked unavailable', 'one failure (max_fails=1) ⇒ out for 10 s — the cost is paid once'],
      ['flag', 'Bounded', 'proxy_next_upstream_tries (0 = unlimited) and _timeout cap the walk'],
    ], 3),
    en: 'What happened to the one request that hit the dead machine. Nginx tried to connect, got refused, and reissued the same request to the next server. The client got one answer and never learned anything happened. Then the server was marked unavailable for ten seconds, so the retry cost is paid once, not per request. Tries and timeout bound the walk.' },
  { t: 'How it comes back', body: tn(O('songlai'), { fs: 18, wrap: 110 }) + dongThoiGian(),
    en: 'How it comes back. Restart machine two and send thirty requests immediately: still fifteen and fifteen — it is healthy but unused. After eleven seconds: ten, nine, eleven. Recovery is a timer, not a probe. Nginx simply tries again after fail timeout, and the first request after the window is the probe.' },
  { t: 'Passive checks: what they are, and are not', body: icards([
      ['pulse', 'Recovery is a timer, not a probe', 'nginx never checks whether the box came back — a long fail_timeout keeps healthy capacity idle'],
      ['test', 'The first request after the window is the probe', 'if it fails, out for another fail_timeout — one unlucky client every 10 s while it stays broken'],
      ['gauge', 'max_fails=1 is aggressive — and usually right', 'works-or-not backends: 1; a flaky network path: higher'],
      ['eye', 'Active health checks are NGINX Plus only', 'health_check (probe /health on a schedule) is commercial; open source has the passive mechanism'],
    ], 2),
    en: 'What passive checks are and are not. Recovery is a timer. The first request after the window is the probe, so one unlucky client pays the retry cost every ten seconds while a backend stays broken. Max fails one is aggressive and usually right. And active health checks, probing slash health on a schedule, are a commercial feature.' },
  { t: 'backup, measured', body: two(ngc(`upstream du_phong {
  server …:9501;
  server …:9502;
  server …:9503 backup;   # last resort
}`, { sm: true, hl: [4] }), cmp(['State', 'Who answered 20'], [
      ['both primaries alive', 'may-1 = 10 · may-2 = 10'],
      ['may-2 killed', 'may-1 = 20 — backup still idle'],
      ['may-1 killed too', 'may-3 = 20 — backup steps in'],
    ], { hl: [2] }), '') + tn(O('backup'), { fs: 17, wrap: 110 }) +
    box('Backup means "every primary is dead", not "one is missing"', 'One primary down: the survivor takes everything and the backup stays idle. It is a last resort — a cold spare, not extra capacity.', 'lam'),
    en: 'Backup, measured. Two primaries alive: ten and ten. Kill one primary: machine one takes all twenty — the backup still does nothing. Kill the other primary too: now the backup takes all twenty. Backup means every primary is dead, not "one is missing".' },
  { t: 'The retry that places the order twice', body: ngc(`location /don-mac-dinh/  { proxy_pass http://don_a/don; }          # default: error timeout
location /don-nguy-hiem/ { proxy_next_upstream error timeout non_idempotent;   # "for reliability"
                           proxy_pass http://don_b/don; }`, { sm: true, hl: [2] }) + two(tn(O('post'), { fs: 15, wrap: 58 }),
    box('A backend that records the order and dies before answering', 'Default: POST is NOT resent once it reached a backend ⇒ the client gets 502, the order exists once. With non_idempotent the client gets a clean 200 — and the order was written TWICE (may-hong and may-tot). Leave non_idempotent out; make writes safe to retry with an idempotency key.', 'do2'), ''),
    en: 'The retry that places the order twice. A backend records the order, then dies before answering. By default a post is not resent once it reached a backend: the client gets five oh two and the order exists once. Add non idempotent "for reliability" and the client gets a clean two hundred — and the order was written twice.' },
  { t: 'What the pool cannot save you from', body: tn(O('chethet'), { fs: 18, wrap: 88 }) + tiers([
      ['warn', 'A backend that answers WRONGLY', '200 with empty data, a stale build — passive checks see only failures', '#c0392b'],
      ['server', 'All backends failing at once', '502 + "no live upstreams" — proxy_cache_use_stale (5.5) helps more', '#b85a2b'],
      ['gauge', 'A SLOW backend, not a dead one', 'passes every check — least_conn shrinks its share (9.1)', '#2563eb'],
      ['layers', 'Each nginx has its own view', 'two proxies track failures separately — confusing, rarely harmful', '#7c3aed'],
    ], { th: 58, gap: 16 }),
    en: 'What the pool cannot save you from. When every backend is dead, every client gets five oh two and the log says no live upstreams — measured, three out of three. A backend that answers wrongly stays in rotation forever. A slow backend passes every check; least conn shrinks its share. And two Nginx instances keep separate views of who is failing.' },
  { t: 'An upstream you can lose a machine from', body: ngc(`upstream api {
  server 10.0.1.11:3000 max_fails=2 fail_timeout=5s;
  server 10.0.1.12:3000 max_fails=2 fail_timeout=5s;
  server 10.0.1.13:3000 backup;        # only when both boxes above are dead
  keepalive 32;
}
location /api/ {
  proxy_next_upstream         error timeout http_502 http_503 http_504;
  # NO non_idempotent ⇒ a POST is never resent
  proxy_next_upstream_tries   2;
  proxy_next_upstream_timeout 5s;
  proxy_connect_timeout       2s;      # fail fast, move on fast
  proxy_pass http://api/;
}`, { hl: [2, 4, 9, 10, 12] }) + box('Test it before you need it', 'Kill a backend while a request loop runs and count what the clients got. Thirty requests and zero errors is a healthy pool; anything else means the retry path is misconfigured — find out on a Tuesday, not during an incident.', 'lam'),
    en: 'An upstream you can lose a machine from: two failures within five seconds take a server out; a backup for when both are gone; retry on errors, timeouts and gateway codes, but never with non idempotent; at most two tries within five seconds; and a short connect timeout so a dead box is skipped fast. Then test it: kill a backend under load and count.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('passive health check', 'judged from real failures'),
      kw('max_fails / fail_timeout', '1 failure ⇒ out 10 s'),
      kw('proxy_next_upstream', 'when to retry elsewhere'),
      kw('non_idempotent', 'also resend POST — dangerous'),
      kw('backup', 'only when all primaries are dead'),
      kw('no live upstreams', 'the whole pool is down'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: passive health check, max fails and fail timeout, proxy next upstream, non idempotent, backup, and no live upstreams.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Kill one of three under a request loop — count errors',
      'Restart it: count at once, then after 11 s',
      `A ${c('backup')}: kill one primary, then both`,
      'A backend that dies mid-POST: default vs. non_idempotent',
    ]), box('Keep these', `<ul><li>first failure is retried, then 10 s out</li><li>recovery is a timer, not a probe</li><li>backup = every primary dead</li><li>never retry writes</li></ul>`, 'lam'), ''),
    en: 'Your turn: kill one of three under load; restart it and count at once and after eleven seconds; a backup with one and then both primaries killed; and a backend that dies mid post. Keep: the first failure is retried, then ten seconds out; recovery is a timer; backup means every primary is dead; never retry writes.' },
];
export const slides = lamDeck({ chuong: 'Chapter 9 — Load balancing across several backends', bai: '9.3' }, S);
