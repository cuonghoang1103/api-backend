/**
 * ngx-11-2 — Nginx · Chapter 11 · Lesson 11.2 "What nginx -t proves, and what it does not" (deck video + web, 13/11/2026).
 * Bài web: nginx-11-2-nginx-t-chung-minh-gi. Output THẬT (scratchpad/ngx/demo/n11-2.txt; nginx/1.24.0): 8 cấu hình một lỗi — -t CHẶN 4 (thiếu ;, host không phân giải,
 * location trùng, thiếu tệp chứng chỉ), QUA 4 ⇒ chạy thật: root sai 404, IP:cổng chết 502, biến không phân giải 502 "could not be resolved", location bị che 200 "regex" ·
 * đĩa vs bộ nhớ: sửa tệp, -t successful, vẫn PHIEN BAN 1 tới khi reload; giờ master < giờ sửa tệp · reload cấu hình hỏng: lệnh reload thoát 1, máy chủ vẫn bản 2;
 * restart (pkill + start) với cấu hình hỏng ⇒ không ai trả lời (000).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n11-2:file:/root/lam_tep.sh": "# lam_tep.sh — sinh 8 cấu hình, mỗi cái MỘT lỗi; khung chung giống nhau\nkhung() { printf 'pid /tmp/ng/logs/t.pid;\\nerror_log /tmp/ng/logs/t-error.log;\\nevents {}\\nhttp {\\n  access_log off;\\n  server {\\n    listen 8090;\\n%b\\n  }\\n}\\n' \"$1\" > /tmp/ng/t/$2.conf; }\nkhung '    location / { return 200 \"ok\\\\n\" }'                                            1-thieu-cham-phay\nkhung '    location / { proxy_pass http://khong-he-co-ten-may-nay.invalid; }'                2-host-khong-phan-giai\nkhung '    location /a { return 200; }\\n    location /a { return 204; }'                    3-location-trung\nkhung '    listen 8443 ssl; ssl_certificate /tmp/ng/khong-co.crt; ssl_certificate_key /tmp/ng/khong-co.key;' 4-thieu-chung-chi\nkhung '    location / { root /tmp/ng/khong-ton-tai; }'                                      5-root-khong-ton-tai\nkhung '    location / { proxy_pass http://127.0.0.1:9999; }'                                6-ip-cong-chet\nkhung '    resolver 192.168.65.7 valid=30s; resolver_timeout 2s;\\n    location / { set $be \"http://khong-he-co-ten-may-nay.invalid\"; proxy_pass $be; }' 7-bien-khong-phan-giai\nkhung '    location ~ ^/api { return 200 \"regex\\\\n\"; }\\n    location /api/v1 { return 200 \"tien to - khong bao gio toi\\\\n\"; }' 8-location-bi-che\n",
 "n11-2:file:/root/thu_t.sh": "# thu_t.sh — đưa từng cấu hình qua nginx -t: CHẶN (in dòng [emerg]) hay QUA\nfor f in /tmp/ng/t/*.conf; do\n  ten=$(basename $f .conf); r=$(nginx -t -c $f 2>&1)\n  if echo \"$r\" | grep -q 'successful'; then printf '%-24s -t QUA\\n' $ten\n  else printf '%-24s -t CHAN  %s\\n' $ten \"$(echo \"$r\" | grep -o '\\[emerg\\].*' | head -1 | sed 's/ in \\/tmp.*//' | cut -c1-70)\"; fi\ndone\n",
 "n11-2:file:/root/chay_qua.sh": "# chay_qua.sh — 4 cấu hình QUA -t: chạy thật từng cái, gửi một request, in mã + dòng error.log\nfor ten in 5-root-khong-ton-tai 6-ip-cong-chet 7-bien-khong-phan-giai 8-location-bi-che; do\n  pkill -f 'nginx: master.*t/' 2>/dev/null; sleep 0.3; : > /tmp/ng/logs/t-error.log\n  nginx -c /tmp/ng/t/$ten.conf; sleep 0.3\n  p=/; [ $ten = 8-location-bi-che ] && p=/api/v1/x\n  ma=$(curl -s -o /tmp/ng/than -w '%{http_code}' --max-time 5 http://127.0.0.1:8090$p)\n  printf '%-24s -> %s  %s\\n' $ten $ma \"$(grep -o '\\[error\\].*' /tmp/ng/logs/t-error.log | head -1 | sed 's/, client.*//' | cut -c1-80)$( [ $ten = 8-location-bi-che ] && echo \"than: $(cat /tmp/ng/than)\")\"\n  nginx -s stop -c /tmp/ng/t/$ten.conf 2>/dev/null; sleep 0.3\ndone\n",
 "n11-2:setup": "",
 "n11-2:tam": "$ bash thu_t.sh\n1-thieu-cham-phay        -t CHAN  [emerg] 22600#22600: unexpected \"}\"\n2-host-khong-phan-giai   -t CHAN  [emerg] 22611#22611: host not found in upstream \"khong-he-co-ten-may-n\n3-location-trung         -t CHAN  [emerg] 22622#22622: duplicate location \"/a\"\n4-thieu-chung-chi        -t CHAN  [emerg] 22633#22633: cannot load certificate \"/tmp/ng/khong-co.crt\": B\n5-root-khong-ton-tai     -t QUA\n6-ip-cong-chet           -t QUA\n7-bien-khong-phan-giai   -t QUA\n8-location-bi-che        -t QUA",
 "n11-2:chayqua": "$ bash chay_qua.sh\n5-root-khong-ton-tai     -> 404  [error] 22674#22674: *1 \"/tmp/ng/khong-ton-tai/index.html\" is not found (2: No s\n6-ip-cong-chet           -> 502  [error] 22689#22689: *1 connect() failed (111: Connection refused) while connect\n7-bien-khong-phan-giai   -> 502  [error] 22704#22704: *1 khong-he-co-ten-may-nay.invalid could not be resolved (3\n8-location-bi-che        -> 200  than: regex",
 "n11-2:file:/tmp/ng/conf/v.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp { access_log off; server { listen 8080; location / { return 200 \"PHIEN BAN 1\\n\"; } } }\n",
 "n11-2:dia": "$ curl -s 127.0.0.1:8080/\nPHIEN BAN 1\n$ sed -i 's/PHIEN BAN 1/PHIEN BAN 2/' /tmp/ng/conf/v.conf; nginx -t -c /tmp/ng/conf/v.conf 2>&1 | tail -1\nnginx: configuration file /tmp/ng/conf/v.conf test is successful\n$ curl -s 127.0.0.1:8080/      # đã sửa đĩa, CHƯA reload\nPHIEN BAN 1\n$ echo \"master khoi dong: $(ps -o lstart= -p $(cat /tmp/ng/logs/nginx.pid))\"; echo \"tep sua luc     : $(date -r /tmp/ng/conf/v.conf)\"\nmaster khoi dong: Fri Nov 13 01:48:43 2026\ntep sua luc     : Fri Nov 13 01:48:44 UTC 2026\n$ nginx -s reload -c /tmp/ng/conf/v.conf 2>/dev/null; sleep 0.5; curl -s 127.0.0.1:8080/\nPHIEN BAN 2",
 "n11-2:hong": "$ sed -i 's/PHIEN BAN 2\\\\n\"; }/PHIEN BAN 3\\\\n\"; }}/' /tmp/ng/conf/v.conf; nginx -s reload -c /tmp/ng/conf/v.conf 2>&1 | grep -o '\\[emerg\\].*'; echo \"ma thoat cua lenh reload: ${PIPESTATUS[0]}\"\n[emerg] 22809#22809: unexpected \"}\" in /tmp/ng/conf/v.conf:4\nma thoat cua lenh reload: 1\n$ curl -s 127.0.0.1:8080/      # reload với cấu hình hỏng: máy chủ vẫn SỐNG, vẫn bản 2\nPHIEN BAN 2\n$ pkill nginx; sleep 0.5; nginx -c /tmp/ng/conf/v.conf 2>&1 | grep -o '\\[emerg\\].*'     # RESTART = dừng rồi bật lại\n[emerg] 22830#22830: unexpected \"}\" in /tmp/ng/conf/v.conf:4\n$ curl -s -o /dev/null -w 'ma: %{http_code}\\n' --max-time 3 127.0.0.1:8080/   # không ai trả lời nữa\nma: 000"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, tiers, vsd } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-11-2', code: 'NGX 11.2', title: 'What nginx -t proves, and what it does not', sub: 'Chapter 11 · Lesson 11.2' };
const O = (k) => { const v = DU_LIEU[`n11-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };

/** Hình: hai cột "-t chặn" / "-t cho qua" với 8 lỗi. */
function haiCot() {
  const W = 1110, H = 256;
  const chan = ['missing ;', 'upstream host not resolvable', 'duplicate location', 'certificate file missing'];
  const qua = ['root → missing directory', 'proxy_pass → dead IP:port', 'proxy_pass via a variable', 'location shadowed by a regex'];
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  const cot = (x, tieu, ds, mau, phu) => {
    s += `<rect x="${x}" y="4" width="540" height="${H - 8}" rx="16" fill="${mau}10" stroke="${mau}" stroke-width="3"/>`;
    s += `<text x="${x + 270}" y="44" text-anchor="middle" font-size="26" font-weight="800" fill="${mau}">${tieu}</text>`;
    s += `<text x="${x + 270}" y="72" text-anchor="middle" font-size="17" fill="#555">${phu}</text>`;
    ds.forEach((t, i) => { s += `<text x="${x + 30}" y="${110 + i * 38}" font-size="21" font-weight="700" fill="#262626">${i + 1}. ${t}</text>`; });
  };
  cot(4, 'nginx -t BLOCKS', chan, '#009639', 'knowable by READING the config + touching files');
  cot(566, 'nginx -t PASSES', qua, '#c0392b', 'depends on the world at request time');
  return s + '</svg>';
}

export const S = [
  { cover: true, nhan: 'Chapter 11 · Lesson 11.2', t: 'What nginx -t proves,<br>and what it does not', sub: '"test is successful" answers "will it load" — not "will it serve"',
    en: 'Lesson 11.2. nginx dash t is the last thing everyone runs before a reload, and it is worth knowing exactly what "test is successful" means. It parses the configuration, resolves the names it can, and opens the files it must. It does not run a single request.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Eight broken configs through <code>-t</code>: four blocked, four pass</li>
    <li>What the four that pass do at request time</li>
    <li>Names resolved at load time — and the variable escape hatch</li>
    <li><code>-t</code> reads the DISK, the server runs from MEMORY</li>
    <li>A broken reload is safe; a broken restart is an outage</li></ul>`,
    en: 'Five takeaways: eight broken configs, four blocked and four passed; what the four that pass do at request time; names resolved at load time; the disk against memory; and why a broken reload is safe but a broken restart is an outage.' },
  { t: 'Eight broken configs, through nginx -t', body: tn(O('tam'), { fs: 14, wrap: 107 }) + haiCot(),
    en: 'Eight configurations, each with exactly one mistake. nginx dash t blocks four: a missing semicolon, an upstream host that does not resolve, a duplicate location, a missing certificate file. It passes the other four. The split is not arbitrary: the first group is knowable by reading the configuration and touching the filesystem; the second depends on the world at the moment a request arrives.' },
  { t: 'The four it passes — run for real', body: tn(O('chayqua'), { fs: 16, wrap: 93 }) + cmp(['Passed -t', 'First request', 'What you see'], [
      ['root → missing directory', '404', 'open() … failed (2: No such file) — a deploy-path typo'],
      ['proxy_pass → dead IP:port', '502', 'connect() failed (111) — the container never came up'],
      ['proxy_pass via a variable', '502', 'could not be resolved — DNS at request time'],
      ['location shadowed by a regex', '200', '"regex" — the wrong block answered, no error anywhere'],
    ], { hl: [3] }),
    en: 'The four that pass, run for real with one request each. Root pointing at a missing directory: four oh four. Proxy pass to a dead address: five oh two. A variable that does not resolve: five oh two, could not be resolved. And the shadowed location: two hundred, from the wrong block, with no error anywhere — the most dangerous of the four.' },
  { t: 'Names are resolved when the config loads', body: two(icards([
      ['warn', 'DNS can block your reload', 'a DNS outage does not degrade the proxy — it stops nginx reloading at all, and says "host not found in upstream", like a typo'],
      ['loop', 'Stale until the next reload', 'a backend that changes IP is called at the old address until someone reloads (measured in 9.5)'],
    ], 1), ngc(`# the escape hatch: a VARIABLE forces
# resolution at request time
resolver 127.0.0.53 valid=30s;
set $backend "http://api.noi-bo.vidu:3000";
location /api/ { proxy_pass $backend; }`, { sm: true, hl: [5] }), '') + box('The trade', 'You exchange a failure to start for a 502 at runtime — and gain the ability to follow an address that moves. That is exactly why the variable form sits in the "passes" column.', 'lam'),
    en: 'Names in proxy pass and upstream are resolved when the configuration loads. A DNS outage does not weaken the proxy; it stops the reload, with a message that sounds like a typo. And a backend that changes address keeps being called at the old one until the next reload. The escape hatch is a variable plus a resolver: resolution moves to request time, which is why that form passes the test.' },
  { t: 'The bigger trap: -t reads the DISK, the server runs MEMORY', body: tn(O('dia'), { fs: 16, wrap: 93 }) +
    box('"test is successful" was about a file the running server had never read', 'The same is true of nginx -T: it dumps the config on disk, not the one in memory. The practical check: the master\'s start time against the file\'s modification time — master 01:48:43, file 01:48:44 ⇒ not reloaded since the edit.', 'do2'),
    en: 'The bigger trap. A running server, a file edited on disk, no reload. nginx dash t says successful, and the server still answers version one — the test described a file the running server never read. nginx dash capital T has the same blind spot. The practical check is the master start time against the file modification time: the master started before the edit, so nobody reloaded. After the reload: version two.' },
  { t: 'A broken reload is safe — a broken restart is an outage', body: tn(O('hong'), { fs: 16, wrap: 93 }) + vsd(`<code>nginx -s reload</code> with a broken file<br>⇒ exits 1, the running server keeps version 2`, `<code>stop</code> + <code>start</code> with the same file<br>⇒ nothing listens — every client gets no answer`, '✓ reload: refused, still serving', '✗ restart: down'),
    en: 'A broken reload is safe: the reload command parses the new file first, fails with exit code one, and the running server keeps serving version two. The same broken file with a restart — stop, then start — is an outage: the new master refuses to start and nothing answers. The rule from 9.5 again: reload, never restart.' },
  { t: 'Two questions, two different tools', body: tiers([
      ['check', '"Will this config load?"', 'nginx -t — syntax, files, names resolvable right now', '#009639'],
      ['test', '"Will this config SERVE correctly?"', 'only requests: a smoke test of real routes', '#2563eb'],
      ['eye', '"Is the server running what I think?"', 'master start time vs file mtime — or reload and re-test', '#c0392b'],
    ], { th: 82, gap: 30 }) + box('This project\'s deploy does exactly this', 'deploy.sh smoke-tests core routes after every deploy and fails on a 404 — 401 or 200 means mounted, 404 means a stale or partial build.', 'xanh'),
    en: 'Two questions, two tools. Will it load: nginx dash t. Will it serve correctly: only requests can answer that — a smoke test of real routes after every deploy, which is exactly what this project\'s deploy script does. And is the server running what I think: compare the master start time with the file, or reload and test again.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('nginx -t', 'will it LOAD'),
      kw('nginx -T', 'the config on DISK, expanded'),
      kw('load-time resolution', 'names fixed until reload'),
      kw('resolver + $var', 'resolve per request'),
      kw('smoke test', 'will it SERVE'),
      kw('reload vs restart', 'refused vs down'),
    ].join('')}</div>` + haiCot(), to: true,
    en: 'Key terms: nginx dash t, nginx dash capital T, load time resolution, resolver with a variable, smoke test, and reload against restart.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Write the eight broken configs — run -t on each',
      'Start the four that pass — send one request each',
      'Edit a running server\'s file, -t, curl — then reload',
      'Reload a broken file, then restart it — compare',
    ]), box('Keep these', `<ul><li>-t: will it load, not will it serve</li><li>only requests prove routing</li><li>-t reads disk, server runs memory</li><li>reload, never restart</li></ul>`, 'lam'), ''),
    en: 'Your turn: the eight broken configs through dash t; start the four that pass and send one request each; edit a running server\'s file, test, curl, then reload; and reload a broken file, then restart it. Keep: dash t means will it load, not will it serve; only requests prove routing; the test reads the disk while the server runs from memory; reload, never restart.' },
];
export const slides = lamDeck({ chuong: 'Chapter 11 — Diagnosis: making Nginx tell you what it did', bai: '11.2' }, S);
