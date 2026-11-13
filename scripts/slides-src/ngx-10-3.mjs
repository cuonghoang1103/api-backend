/**
 * ngx-10-3 — Nginx · Chapter 10 · Lesson 10.3 "Not logging: off, if=, buffer=, and what logging really costs" (deck video + web, 13/11/2026).
 * Bài web: nginx-10-3-khong-ghi-log-va-gia-cua-no. Output THẬT (scratchpad/ngx/demo/n10-3.txt; nginx/1.24.0, 1 worker, ab -k 900 request/1 kết nối):
 * access_log off ⇒ CẢ HAI log ở server đều 0 dòng; khai lại một log trong location ⇒ chỉ log đó 3 dòng · if=$dang_chu_y: log đầy đủ 4 dòng, log lỗi 1 dòng (500) ·
 * strace: writev 1800 (900 về client + 900 lên upstream) ở cả ba; log thường write=900; log đệm write=1 trong cửa sổ, 2 lần khi qua flush (đệm 64k đầy +
 * flush), 900 dòng 67.500 byte · thời gian 5×900: tắt 133 µs (±6), thường 139 (±11), đệm 130 (±4) — trong nhiễu · flush=5s: dòng hiện ở t=5s.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n10-3:file:/tmp/ng/conf/it.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nworker_processes 1;\nevents {}\nhttp {\n  log_format huu_dung '$remote_addr $status $request_time $upstream_response_time $upstream_addr '\n                      '$upstream_status \"$request_uri\" -> \"$uri\" $body_bytes_sent';\n  log_format json escape=json '{\"ma\":$status,\"uri\":\"$request_uri\"}';\n  map $status $dang_chu_y { ~^[23] 0; default 1; }          # 2xx/3xx: không đáng chú ý\n  upstream app { server 127.0.0.1:9600; keepalive 8; }\n  server {                                                   # 8080: off và if=\n    listen 8080;\n    access_log /tmp/ng/logs/huu-dung.log huu_dung;           # khai ở server: HAI log\n    access_log /tmp/ng/logs/json.log json;\n    access_log /tmp/ng/logs/loi.log huu_dung if=$dang_chu_y; # và một log CHỈ LỖI\n    location = /health  { access_log off; return 200 \"ok\\n\"; }\n    location = /health2 { access_log /tmp/ng/logs/json.log json; return 200 \"ok\\n\"; }   # giữ MỘT log: khai lại\n    location / { proxy_http_version 1.1; proxy_set_header Connection \"\"; proxy_pass http://app; }\n  }\n  server {                                                   # 8081: ba cách ghi, còn lại giống hệt\n    listen 8081;\n    proxy_http_version 1.1; proxy_set_header Connection \"\";\n    location /log-tat/    { access_log off;                                        proxy_pass http://app/binh-thuong; }\n    location /log-thuong/ { access_log /tmp/ng/logs/thuong.log huu_dung;           proxy_pass http://app/binh-thuong; }\n    location /log-dem/    { access_log /tmp/ng/logs/dem.log huu_dung buffer=64k flush=5s; proxy_pass http://app/binh-thuong; }\n  }\n}\n",
 "n10-3:file:/root/dem_syscall.sh": "# dem_syscall.sh <đường dẫn> — strace worker trong lúc ab gửi 900 request trên MỘT kết nối keepalive; đếm write/writev\nW=$(pgrep -f 'nginx: worker' | head -1)\nstrace -f -e trace=write,writev -c -p $W -o /tmp/ng/st.txt 2>/dev/null & S=$!; sleep 0.5\nab -q -k -n 900 -c 1 \"http://127.0.0.1:8081$1\" > /dev/null 2>&1; sleep 0.3; kill -INT $S; wait $S 2>/dev/null\nprintf '%-13s' \"$1\"; awk '$NF==\"writev\"||$NF==\"write\"{printf \"%s=%s calls  \", $NF, $4}' /tmp/ng/st.txt; echo\n",
 "n10-3:file:/root/do_tg.sh": "# do_tg.sh <đường dẫn> — 5 lượt × 900 request (ab -k, một kết nối): thời gian TB mỗi request (µs)\nfor k in 1 2 3 4 5; do ab -q -k -n 900 -c 1 \"http://127.0.0.1:8081$1\" 2>/dev/null | awk '/Time per request.*\\(mean\\)$/{print $4*1000}'; done | awk '{a[NR]=$1; s+=$1; printf \"%5.0f \", $1} END {m=s/NR; for(i in a) v+=(a[i]-m)^2; printf \"-> TB %.0f us (do lech chuan %.0f)\", m, sqrt(v/NR)}'\n",
 "n10-3:setup": "",
 "n10-3:off": "$ for k in 1 2 3; do curl -s -o /dev/null http://127.0.0.1:8080/health; done; wc -l /tmp/ng/logs/huu-dung.log /tmp/ng/logs/json.log\n0 /tmp/ng/logs/huu-dung.log\n0 /tmp/ng/logs/json.log\n0 total\n$ for k in 1 2 3; do curl -s -o /dev/null http://127.0.0.1:8080/health2; done; wc -l /tmp/ng/logs/huu-dung.log /tmp/ng/logs/json.log\n 0 /tmp/ng/logs/huu-dung.log\n 3 /tmp/ng/logs/json.log\n 3 total",
 "n10-3:if": "$ for p in binh-thuong cham loi khong-co-dau; do curl -s -o /dev/null http://127.0.0.1:8080/$p; done\n$ echo '=== huu-dung.log (DAY DU) ==='; cat huu-dung.log; echo '=== loi.log (if=$dang_chu_y) ==='; cat loi.log\n=== huu-dung.log (DAY DU) ===\n127.0.0.1 200 0.006 0.006 127.0.0.1:9600 200 \"/binh-thuong\" -> \"/binh-thuong\" 15\n127.0.0.1 200 0.601 0.601 127.0.0.1:9600 200 \"/cham\" -> \"/cham\" 14\n127.0.0.1 500 0.001 0.000 127.0.0.1:9600 500 \"/loi\" -> \"/loi\" 13\n127.0.0.1 200 0.001 0.001 127.0.0.1:9600 200 \"/khong-co-dau\" -> \"/khong-co-dau\" 15\n=== loi.log (if=$dang_chu_y) ===\n127.0.0.1 500 0.001 0.000 127.0.0.1:9600 500 \"/loi\" -> \"/loi\" 13",
 "n10-3:syscall": "$ for p in /log-tat/ /log-thuong/ /log-dem/; do bash dem_syscall.sh $p; done\n/log-tat/    writev=1800 calls  \n/log-thuong/ writev=1800 calls  write=900 calls  \n/log-dem/    writev=1800 calls  write=1 calls  ",
 "n10-3:xuong": "$ strace -e trace=write -c -p $W &  ab -k -n 900 -c 1 http://127.0.0.1:8081/log-dem/; sleep 6   # đợi qua flush=5s\nso lan goi write(): 2\n$ echo \"so dong trong log: $(wc -l < /tmp/ng/logs/dem.log)   kich thuoc: $(stat -c %s /tmp/ng/logs/dem.log) byte\"\nso dong trong log: 900   kich thuoc: 67500 byte",
 "n10-3:tg": "$ for p in /log-tat/ /log-thuong/ /log-dem/; do printf '%-13s' $p; bash do_tg.sh $p; echo; done\n/log-tat/      143   131   138   129   125 -> TB 133 us (do lech chuan 6)\n/log-thuong/   128   129   150   154   134 -> TB 139 us (do lech chuan 11)\n/log-dem/      138   130   131   128   125 -> TB 130 us (do lech chuan 4)",
 "n10-3:flush": "$ curl -s -o /dev/null http://127.0.0.1:8081/log-dem/; for s in 0 1 2 3 4 5 6 7; do echo \"t=${s}s  so dong trong log: $(wc -l < /tmp/ng/logs/dem.log)\"; sleep 1; done\nt=0s  so dong trong log: 0\nt=1s  so dong trong log: 0\nt=2s  so dong trong log: 0\nt=3s  so dong trong log: 0\nt=4s  so dong trong log: 0\nt=5s  so dong trong log: 1\nt=6s  so dong trong log: 1\nt=7s  so dong trong log: 1"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, meter, tiers } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-10-3', code: 'NGX 10.3', title: 'Not logging: off, if=, buffer=, and what logging really costs', sub: 'Chapter 10 · Lesson 10.3' };
const O = (k) => { const v = DU_LIEU[`n10-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };

/** Hình: dòng thời gian 900 request — log thường: 900 vạch write(); log đệm: một vạch khi 64 KB đầy + một vạch lúc flush. */
function vachWrite() {
  const W = 1110, H = 200, x0 = 250, x1 = 1080;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  const hang = (y, ten, mau, vach, ghi) => {
    s += `<text x="${x0 - 14}" y="${y + 6}" text-anchor="end" font-size="19" font-weight="700" fill="${mau}">${ten}</text><line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="#cbd5e1" stroke-width="2"/>`;
    vach.forEach((x) => { s += `<line x1="${x}" y1="${y - 16}" x2="${x}" y2="${y + 16}" stroke="${mau}" stroke-width="${vach.length > 50 ? 1 : 4}"/>`; });
    s += `<text x="${x1}" y="${y - 24}" text-anchor="end" font-size="16" font-weight="700" fill="${mau}">${ghi}</text>`;
  };
  hang(50, 'access_log off', '#64748b', [], 'write() = 0');
  hang(110, 'unbuffered', '#c0392b', Array.from({ length: 90 }, (_, i) => x0 + 6 + i * 7.5), 'write() = 900 — one per request');
  hang(170, 'buffer=64k flush=5s', '#009639', [x0 + 690, x1 - 20], 'write() = 2 — buffer full + flush');
  return s + '</svg>';
}

export const S = [
  { cover: true, nhan: 'Chapter 10 · Lesson 10.3', t: 'Not logging: off, if=, buffer=,<br>and what logging really costs', sub: 'Count the syscalls, then time the requests — the two disagree',
    en: 'Lesson 10.3. Every Nginx tuning guide tells you to turn off the access log for speed. This lesson measures that claim two ways — by counting the syscalls it removes, and by timing the requests. The two measurements disagree, and the disagreement is the point.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three ways to write less — and they are not interchangeable</li>
    <li><code>access_log off</code> silences EVERY log of that context</li>
    <li><code>if=</code>: a small errors-only log next to the full one</li>
    <li><code>buffer=</code>: 900 syscalls become 2 — and nothing gets faster</li>
    <li>What buffering costs instead: delay and loss</li></ul>`,
    en: 'Five takeaways: three ways to write less; access log off silences every log of its context; if equals for an errors-only log; buffer turns nine hundred syscalls into two, and nothing gets faster; and what buffering costs instead.' },
  { t: 'Three ways to write less', body: ngc(`# 1. Off entirely for one location — destroys the data
location = /health { access_log off; return 200 "ok\\n"; }

# 2. Only when a variable is not empty and not "0" — filters it
map $status $dang_chu_y { ~^[23] 0; default 1; }
access_log /var/log/nginx/loi.log huu_dung if=$dang_chu_y;

# 3. Collect in memory, write now and then — keeps all of it
access_log /var/log/nginx/access.log huu_dung buffer=64k flush=5s;`, { hl: [2, 6, 9] }) + icards([
      ['trash', 'off', 'the data is gone'], ['filter', 'if=', 'only the lines you care about'], ['pulse', 'buffer=', 'all of it — later'],
    ], 3),
    en: 'Three ways to write less, and they do different things. Off destroys the data. If equals filters it: Nginx writes the line unless the variable is empty or zero. Buffer keeps all of it and only changes when it reaches the disk.' },
  { t: 'access_log off is all-or-nothing', body: tn(O('off'), { fs: 16, wrap: 106 }) + two(box('off silenced BOTH logs of the server', 'Two access_log lines at server level, one access_log off in the location: zero lines in either file. There is no "drop just this one".', 'do2'), box('To keep one: re-declare it', 'location = /health2 { access_log …/json.log json; } ⇒ json.log got its 3 lines, huu-dung.log none. And use location = so it is exactly one URI (2.1).', 'lam'), ''),
    en: 'The trap: off is all or nothing. The server declares two logs; one access log off in the health location silenced both — three requests, zero lines in either. To keep one, re-declare it inside the location: the JSON log got its three lines and the other none. And use location equals, so it applies to exactly one URI.' },
  { t: 'if= — keep only the interesting lines', body: tn(O('if'), { fs: 15, wrap: 132 }) + box('Two logs, one set of requests', 'Four requests: the full log has four lines, the errors-only log one (the 500). Keep the full log for days and the small one for a year — map on $request_time instead and it becomes a slow-request log.', 'xanh'),
    en: 'If equals. A map from Chapter 8: two and three hundred codes map to zero, everything else to one. Four requests — three successes and one five hundred — wrote four lines to the full log and exactly one to the errors-only log, because both access log directives are active at once. Keep the small one for a year.' },
  { t: 'buffer= — the syscalls, counted', body: tn([O('syscall'), O('xuong')].join('\n'), { fs: 16, wrap: 108 }) + vachWrite(),
    en: 'Buffer — the syscalls, counted with strace over nine hundred requests on one keepalive connection. Writev, eighteen hundred, is the traffic itself: nine hundred responses to the client and nine hundred requests to the backend. Unbuffered logging adds exactly one write per request: nine hundred. Buffered: one write when the sixty four kilobyte buffer filled, one more at the flush — two writes for nine hundred lines, sixty seven thousand five hundred bytes, none lost.' },
  { t: 'So how much faster is it? — it is not', body: tn(O('tg'), { fs: 17, wrap: 110 }) +
    meter([['access_log off', 133, '#64748b', '±6'], ['unbuffered (900 writes)', 139, '#c0392b', '±11'], ['buffer=64k (2 writes)', 130, '#009639', '±4']], { don: 'µs / request', rh: 40, fs: 18, nhan: 330 }) +
    box('Every difference is smaller than the run-to-run spread', 'Five rounds of 900 requests each, this course\'s lab (a proxied request costs ~130–140 µs here). An append to a page-cached file is about a microsecond — one part in a hundred, inside the noise.', 'lam'),
    en: 'So how much faster is it? It is not. Five rounds of nine hundred requests for each: about one hundred thirty three microseconds with logging off, one hundred thirty nine unbuffered, one hundred thirty buffered — and the spread of a single configuration is up to eleven. Nine hundred syscalls are real, and they cost less than the noise.' },
  { t: 'Read the null result honestly', body: icards([
      ['test', 'What was measured', 'one worker, one keepalive connection, a local disk with a warm page cache, a tiny response, no TLS, loopback'],
      ['warn', 'Where it WOULD show', 'a network filesystem, a saturated disk, a synchronous mount, a full log partition — write() stops being a memcpy'],
      ['check', 'What it does establish', '"turn off the access log for speed" buys nothing measurable on an ordinary box — and costs you every answer about production'],
      ['gauge', 'The real reason for buffer=', 'a million syscalls a day on a shared, I/O-throttled box shows up somewhere — iowait, a noisy neighbour'],
    ], 2),
    en: 'Read the null result honestly. It was one worker on a local disk with a warm page cache. On a network filesystem, a saturated disk or a synchronous mount it could show. What it establishes: on an ordinary server, turning off the access log for speed buys nothing measurable and costs you the ability to answer questions about production.' },
  { t: 'What buffering costs instead', body: tn(O('flush'), { fs: 17, wrap: 110 }) + two(box('Delay — "my logging is broken"', 'One request, and the line appeared only at t = 5 s. On a quiet server you tail -f, see nothing and go hunting a broken log_format. Debug with buffer= removed.', 'do2'), box('Loss', 'Lines still in the buffer are lost on SIGKILL or power loss — the requests you would most want to read. reload/stop flush first. Never buffer an audit log.', 'do2'), ''),
    en: 'What buffering costs instead. Delay: one request, and the line appeared in the file only at five seconds. On a quiet server you tail the log, see nothing, and go hunting for a broken format. And loss: lines still in the buffer are gone if the worker is killed or the power fails. A reload flushes first, but never buffer an audit log.' },
  { t: 'The order to reach for them', body: tiers([
      ['check', '1 · Log everything, unbuffered', 'the default — costs nothing you can detect, and it is the only record', '#009639'],
      ['trash', '2 · access_log off for health checks only', 'location = /health — not for speed, for signal', '#64748b'],
      ['filter', '3 · A second, filtered log with if=', 'errors only, or slow only — keep it for a year', '#2563eb'],
      ['pulse', '4 · buffer= after you measure', 'constrained I/O — accept delay and loss knowingly', '#b85a2b'],
    ], { th: 72, gap: 26 }),
    en: 'The order: log everything, unbuffered — the default. Turn the access log off for health checks only, for signal rather than speed. Add a second, filtered log with if equals. And reach for buffer only when you have measured a reason. The setting genuinely worth fearing is the error log at debug level — lesson ten point four.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('access_log off', 'every log of the context'),
      kw('if=$var', 'skip when "" or "0"'),
      kw('buffer=64k', 'write when full'),
      kw('flush=5s', '…or when this old'),
      kw('writev / write', 'traffic / log syscalls'),
      kw('strace -c', 'count the syscalls'),
    ].join('')}</div>` + vachWrite() + meter([['off', 133, '#64748b', '±6'], ['900 writes', 139, '#c0392b', '±11'], ['2 writes', 130, '#009639', '±4']], { don: 'µs / request', rh: 34, fs: 17, nhan: 200 }), to: true,
    en: 'Key terms: access log off, if equals, buffer, flush, writev against write, and strace dash c.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Two logs at server level + access_log off in one location',
      `An errors-only log with ${c('map')} + ${c('if=')}`,
      'strace -c the worker: off vs unbuffered vs buffer=',
      'One request through flush=5s — watch the file each second',
    ]), box('Keep these', `<ul><li>off = every log, gone</li><li>if= = a small log worth keeping</li><li>buffer= saves syscalls, not time</li><li>buffer = delay + loss</li></ul>`, 'lam'), ''),
    en: 'Your turn: two logs and access log off in one location; an errors-only log with map and if; strace the worker for each of the three; and one request through a five second flush. Keep: off silences every log; if equals gives a small log worth keeping; buffer saves syscalls, not time; and buffering means delay and loss.' },
];
export const slides = lamDeck({ chuong: 'Chapter 10 — Logs, and seeing what is happening', bai: '10.3' }, S);
