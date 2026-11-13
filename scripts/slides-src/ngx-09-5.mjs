/**
 * ngx-09-5 — Nginx · Chapter 9 · Lesson 9.5 "Deploying without dropping a request" (deck video + web, 13/11/2026).
 * Bài web: nginx-9-5-deploy-khong-rot-request. Output THẬT (scratchpad/ngx/demo/n9-5.txt; nginx/1.24.0, 2 worker, tải giả tai.py mỗi request một kết nối):
 * 400 request + 3 lần reload ⇒ 400 × 200 · đổi cả bể (symlink be-hien-tai.conf ⇒ be-moi) giữa 200 request ⇒ 200 × 200 (bể cũ 22/21/20, may-4=137) ·
 * stop + start thay cho reload ⇒ 55 × 200, 345 × lỗi kết nối · đổi sang bể MỚI nhưng HỎNG (trả 500): nginx -t ok, reload ok ⇒ 50 × 500, error.log 0 dòng;
 * hỏi thẳng backend mới trước ⇒ curl 500 ⇒ KHÔNG đổi ⇒ 50 × 200 · tải chậm lúc reload ⇒ "worker process is shutting down", tải xong 200 3000000 byte ·
 * DNS: tên trong proxy_pass VÀ trong upstream đều giữ địa chỉ cũ tới khi reload, reload thì CẢ HAI phân giải lại (web cũ nói proxy_pass không — sai).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n9-5:file:/root/hong.js": "// hong.js — bản build MỚI nhưng HỎNG (thiếu biến môi trường…): vẫn nghe cổng 9507, mọi request trả 500\nrequire('http').createServer((q, r) => { r.statusCode = 500; r.end('Error: DATABASE_URL is not set\\n'); }).listen(9507, '127.0.0.1');\n",
 "n9-5:file:/root/tai.py": "# tai.py <url> <n> <song song> — tải giả: n request, mỗi request MỘT kết nối mới; đếm theo máy trả lời / mã lỗi / lỗi kết nối\nimport sys, collections, urllib.request, urllib.error\nfrom concurrent.futures import ThreadPoolExecutor\nurl, n, c = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])\ndef mot(_):\n    try:\n        with urllib.request.urlopen(url, timeout=5) as r: return f'{r.status}:{r.read().decode().strip()}'\n    except urllib.error.HTTPError as e: return f'{e.code}:loi-http'\n    except Exception: return 'LOI-KET-NOI'\nkq = list(ThreadPoolExecutor(c).map(mot, range(n)))\nma = collections.Counter(k.split(':')[0] for k in kq)\nmay = collections.Counter(k.split(':', 1)[1] for k in kq if k.startswith('200:'))\nprint('  ' + '  '.join(f'{v} x {k}' for k, v in sorted(ma.items())), '  |  ' + '  '.join(f'{k}={v}' for k, v in sorted(may.items())))\n",
 "n9-5:file:/tmp/ng/conf/be-cu.conf": "server 127.0.0.1:9501; server 127.0.0.1:9502; server 127.0.0.1:9503;\n",
 "n9-5:file:/tmp/ng/conf/be-moi.conf": "server 127.0.0.1:9504;\n",
 "n9-5:file:/tmp/ng/conf/be-hong.conf": "server 127.0.0.1:9507;\n",
 "n9-5:file:/tmp/ng/conf/dp.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nworker_processes 2;\nevents {}\nhttp {\n  access_log off;\n  upstream deu { include /tmp/ng/conf/be-hien-tai.conf; }   # bể = một tệp include, đổi bằng symlink\n  server {\n    listen 8080;\n    location / { proxy_pass http://deu; }\n  }\n}\n",
 "n9-5:setup": "",
 "n9-5:reload": "400 request dang chay (4 luong song song), nap lai cau hinh BA lan giua chung:\n$ (python3 tai.py http://127.0.0.1:8080/ 400 4 &); for k in 1 2 3; do sleep 0.25; nginx -s reload; done\n  400 x 200   |  may-1=135  may-2=133  may-3=132",
 "n9-5:doibe": "200 request bac ngang qua lan doi ca be: be-cu (may-1..3) -> be-moi (may-4):\n$ (python3 tai.py http://127.0.0.1:8080/ 200 2 &); sleep 0.4; ln -sfn be-moi.conf be-hien-tai.conf && nginx -t && nginx -s reload\n  200 x 200   |  may-1=22  may-2=21  may-3=20  may-4=137",
 "n9-5:restart": "Cung tai do, nhung \"khoi dong lai\" (stop + start) thay vi nap lai:\n$ ln -sfn be-cu.conf be-hien-tai.conf; nginx -s reload       # quay về bể cũ\n$ (python3 tai.py http://127.0.0.1:8080/ 400 4 &); sleep 0.3; nginx -s stop; sleep 0.2; nginx\n  55 x 200  345 x LOI-KET-NOI   |  may-1=19  may-2=18  may-3=18",
 "n9-5:hong": "Doi sang mot be MOI nhung HONG (song, nghe cong, tra 500):\n$ ln -sfn be-hong.conf be-hien-tai.conf && nginx -t && nginx -s reload && echo \"nginx -t: ok, nap lai: ok\"\nnginx -t: ok, nap lai: ok\n$ python3 tai.py http://127.0.0.1:8080/ 50 2\n  50 x 500   |  \n$ wc -l < error.log\n0\nBuoc con thieu: hoi THANG backend moi (bo qua nginx) TRUOC khi nap lai:\n$ ln -sfn be-cu.conf be-hien-tai.conf; nginx -s reload       # quay về bể cũ\n$ curl -fsS http://127.0.0.1:9507/ && ln -sfn be-hong.conf be-hien-tai.conf && nginx -s reload || echo \"=> KHONG doi be: backend moi chua dung\"\ncurl: (22) The requested URL returned error: 500\n=> KHONG doi be: backend moi chua dung\n$ python3 tai.py http://127.0.0.1:8080/ 50 2\n  50 x 200   |  may-1=17  may-2=17  may-3=16",
 "n9-5:file:/tmp/ng/conf/cham.conf": "pid       /tmp/ng/logs/cham.pid;\nerror_log /tmp/ng/logs/cham.log;\nworker_processes 1;\nevents {}\nhttp { access_log off; server { listen 8081; location / { root /tmp/ng; limit_rate 200k; } } }\n",
 "n9-5:cu": "Mot luot tai cham (gioi han 200 KB/s) dang chay luc nap lai:\n$ (curl -s -o /dev/null -w 'tai xong: %{http_code} %{size_download} byte\\n' http://127.0.0.1:8081/to.bin &); sleep 1; nginx -s reload; sleep 1; ps -eo pid,cmd | grep '[n]ginx:'\n  19108 nginx: master process nginx -c /tmp/ng/conf/cham.conf\n  19109 nginx: worker process is shutting down\n  19122 nginx: worker process\n$ sleep 14; cat /tmp/ng/tai.txt; ps -eo pid,cmd | grep '[n]ginx:'\ntai xong: 200 3000000 byte\n  19108 nginx: master process nginx -c /tmp/ng/conf/cham.conf\n  19122 nginx: worker process",
 "n9-5:file:/root/ip.js": "// ip.js <địa chỉ> — trả lời \"o-<địa chỉ>\" để thấy nginx đang gọi ĐỊA CHỈ nào\nconst ip = process.argv[2];\nrequire('http').createServer((q, r) => r.end(`o-${ip}\\n`)).listen(9510, ip);\n",
 "n9-5:file:/tmp/ng/conf/dns.conf": "pid       /tmp/ng/logs/dns.pid;\nerror_log /tmp/ng/logs/dns.log;\nevents {}\nhttp {\n  access_log off;\n  upstream ten { server be.test:9510; }\n  server {\n    listen 8082;\n    location /pp/ { proxy_pass http://be.test:9510; }   # tên trần TRONG proxy_pass\n    location /up/ { proxy_pass http://ten; }           # tên trong khối upstream\n  }\n}\n",
 "n9-5:dns": "$ grep be.test /etc/hosts; printf 'proxy_pass: %s   upstream: %s\\n' $(curl -s 127.0.0.1:8082/pp/) $(curl -s 127.0.0.1:8082/up/)\n127.0.0.2 be.test\nproxy_pass: o-127.0.0.2   upstream: o-127.0.0.2\n$ echo '127.0.0.3 be.test' > /etc/hosts    # đổi địa chỉ của tên (như container được dựng lại)\n127.0.0.3 be.test\n$ printf 'CHUA nap lai -> proxy_pass: %s   upstream: %s\\n' $(curl -s 127.0.0.1:8082/pp/) $(curl -s 127.0.0.1:8082/up/)\nCHUA nap lai -> proxy_pass: o-127.0.0.2   upstream: o-127.0.0.2\n$ nginx -s reload; printf 'SAU nap lai  -> proxy_pass: %s   upstream: %s\\n' $(curl -s 127.0.0.1:8082/pp/) $(curl -s 127.0.0.1:8082/up/)\nSAU nap lai  -> proxy_pass: o-127.0.0.3   upstream: o-127.0.0.3"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, seq, tiers, meter } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-09-5', code: 'NGX 9.5', title: 'Deploying without dropping a request', sub: 'Chapter 9 · Lesson 9.5' };
const O = (k) => { const v = DU_LIEU[`n9-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };

export const S = [
  { cover: true, nhan: 'Chapter 9 · Lesson 9.5', t: 'Deploying without<br>dropping a request', sub: 'The upstream block is a list you can change under live traffic — the reload publishes it',
    en: 'Lesson 9.5. Section zero said nginx dash s reload replaces the workers without dropping a connection. This is where that property becomes a deployment strategy: the upstream block is a list you can change under live traffic, and the reload is what publishes the change.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three reloads under load: zero errors — and what a reload really does</li>
    <li>Swap the whole pool mid-traffic with one symlink</li>
    <li>Restart is not reload: measured, most requests failed</li>
    <li>A reload publishes a config — it does not check the new backends</li>
    <li>Rolling, blue-green, canary, draining</li></ul>`,
    en: 'Five takeaways: three reloads under load with zero errors, and what a reload does; swapping a whole pool with one symlink; restart is not reload; a reload does not check the new backends; and the deployment patterns this enables.' },
  { t: 'Reloading three times under load', body: tn(O('reload'), { fs: 20, wrap: 84 }) + meter([['answered 200', 400, '#009639'], ['errors', 0, '#c0392b']], { don: 'of 400', rh: 40, fs: 19, nhan: 300 }) + steps([
      'The master reads the new config and starts NEW workers — listening sockets are inherited, no port is ever unbound',
      'OLD workers stop accepting, finish what is in flight, then exit',
      'So a reload is safe whenever you want: deploy script, certificate hook, config tool',
      `Always ${c('nginx -t && nginx -s reload')} — a broken config fails the reload and only the error log says so`,
    ]),
    en: 'Four hundred requests running, four threads, reload three times in the middle: four hundred times two hundred, not one error. The master starts new workers with the new config — the listening sockets are inherited — and the old workers finish what they were doing, then exit. Always test first: nginx dash t and then reload.' },
  { t: 'What a reload actually does', body: seq(['you', 'master', 'old workers', 'new workers', 'clients'], [
      [0, 1, 'nginx -s reload (SIGHUP)'], [1, 1, 'parse + test the new config'], [1, 3, 'fork — inherit the listening sockets', '#009639'],
      [1, 2, 'graceful shutdown: stop accepting', '#b85a2b'], [4, 3, 'NEW connections', '#009639'], [2, 4, 'in-flight requests finish on the OLD config', '#b85a2b', true],
    ], { w: 1110, rh: 50, fs: 17 }) + box('A request that started before the reload finishes under the old config', 'That is exactly right — and it is why a reload never drops a connection, while a stop never waits for one.', 'lam'),
    en: 'What a reload actually does. The master parses and tests the new config, forks new workers that inherit the listening sockets, and tells the old workers to stop accepting. New connections go to the new workers; requests already in flight finish on the old config. Nothing is refused, nothing is cut.' },
  { t: 'Swapping the whole pool mid-traffic', body: ngc(`upstream deu { include /tmp/ng/conf/be-hien-tai.conf; }   # the pool = one include file
# be-cu.conf : server …:9501; server …:9502; server …:9503;
# be-moi.conf: server …:9504;`, { sm: true, hl: [1] }) + tn(O('doibe'), { fs: 18, wrap: 88 }) +
    meter([['old pool (may-1..3), before the reload', 63, '#2563eb', '22 + 21 + 20'], ['new pool (may-4), after the reload', 137, '#009639'], ['errors', 0, '#c0392b']], { don: 'requests', rh: 40, fs: 18, nhan: 400 }),
    en: 'Swapping the whole pool mid traffic. The pool is one include file, pointed at by a symlink. Two hundred requests, and halfway through the symlink moves from the old pool of three machines to the new one, then a reload. Sixty three answered by the old pool, one hundred thirty seven by the new one, zero errors.' },
  { t: 'Restart is not reload', body: tn(O('restart'), { fs: 17, wrap: 92 }) +
    meter([['reload × 3 — answered', 400, '#009639', 'of 400'], ['stop + start — answered', 55, '#c0392b', 'of 400'], ['stop + start — connection refused', 345, '#c0392b']], { don: '', rh: 40, fs: 18, nhan: 400 }) +
    box('systemctl restart nginx in a deploy script is an outage you wrote yourself', 'reload keeps the master, the listening sockets and every open connection. stop + start drops all of them — here for about 0.2 s, and 345 of 400 requests got "connection refused".', 'do2'),
    en: 'Restart is not reload. The same load, but stop and start instead of reload: fifty five answered, three hundred forty five refused. A reload keeps the master, the sockets and every connection; a restart drops them. Anything in a deploy script that says systemctl restart nginx is a brief outage that a reload would not cause.' },
  { t: 'A reload does not test your backends', body: tn(O('hong'), { fs: 14, wrap: 112 }) +
    box('nginx -t: ok · reload: ok · 50 × 500 · error.log: 0 lines', 'Up and listening ⇒ nothing failed at the connection level, so passive checks (9.3) never noticed. The missing step: one curl to the NEW backend, bypassing nginx, BEFORE the reload.', 'do2'),
    en: 'The trap. Switch to a pool that is up but broken — a build missing its database setting. Nginx dash t says ok, the reload says ok, and fifty requests get fifty five hundreds, with zero lines in the error log. The missing step is one curl straight to the new backend before the reload: it returned five hundred, so the switch never happened, and users kept getting two hundred.' },
  { t: 'Old workers can linger — correctly', body: tn(O('cu'), { fs: 17, wrap: 92 }) + icards([
      ['loop', 'In-flight work keeps the old worker alive', 'a 3 MB download at 200 KB/s outlived the reload: "worker process is shutting down", then 200 and every byte'],
      ['power', 'worker_shutdown_timeout', 'bounds the wait when long downloads or WebSockets would keep old workers for hours'],
      ['eye', 'Two generations side by side is normal', 'after a reload, ps shows old workers until their last request ends'],
    ], 3),
    en: 'Old workers can linger, and that is correct. A slow three megabyte download was running during the reload: ps showed the old worker as shutting down next to the new one, and the download finished with two hundred and every byte. Worker shutdown timeout bounds the wait when long downloads or WebSockets would keep old workers for hours.' },
  { t: 'Reload DOES re-resolve names — measured', body: ngc(`upstream ten { server be.test:9510; }
location /pp/ { proxy_pass http://be.test:9510; }   # a bare name in proxy_pass
location /up/ { proxy_pass http://ten; }           # a name inside upstream`, { sm: true }) + tn(O('dns'), { fs: 15, wrap: 104 }) +
    box('Both forms: resolved at load, stale until the next reload, re-resolved BY the reload', 'proxy_pass AND upstream alike. Containers that change address between deploys: reload after each change, or use a resolver + a variable in proxy_pass (re-resolved per TTL).', 'xanh'),
    en: 'Does a reload re-resolve DNS names? Measured: the name be dot test pointed at one address; we changed it. Before the reload, both the bare name in proxy pass and the name in the upstream block still went to the old address. After the reload, both went to the new one. A reload re-resolves both; between reloads, both are stale.' },
  { t: 'The deployment patterns this enables', body: tiers([
      ['wrench', 'Rolling', 'one node: down + reload, deploy, back + reload — capacity −1 node', '#008a34'],
      ['loop', 'Blue-green', 'two full pools, switch the list (the symlink) — rollback = same edit', '#2563eb'],
      ['gauge', 'Canary', 'new weight=1 beside old weight=9 ⇒ a tenth of traffic; watch errors', '#7c3aed'],
      ['power', 'Draining', 'down stops NEW requests; wait for the longest one, then stop it', '#b85a2b'],
    ], { th: 72, gap: 26 }),
    en: 'The patterns. Rolling: take one node down, deploy it, put it back. Blue green: two full pools, switch the list — the swap we measured, with rollback as the same edit in reverse. Canary: weight the new build low and watch the error rate. Draining: down stops new requests, then wait for the longest one before stopping the process.' },
  { t: 'Blue-green in one include file — the script', body: ngc(`# /etc/nginx/be-hien-tai.conf  ->  be-xanh.conf  or  be-luc.conf
upstream api { include /etc/nginx/be-hien-tai.conf; keepalive 32; }

# deploy.sh — the order matters
curl -fsS http://10.0.2.11:3000/health || exit 1     # 1) ask the NEW backend directly
ln -sfn be-luc.conf /etc/nginx/be-hien-tai.conf      # 2) point the list at it
nginx -t && nginx -s reload                          # 3) test, then publish
# 4) a request loop during the switch: count the errors (expect 0)
# rollback = ln -sfn be-xanh.conf …  &&  nginx -t && nginx -s reload`, { hl: [5, 6, 7] }) +
    box('The upstream block is data, the reload is atomic', 'Changing which machines serve your traffic is a text edit and a signal — no load balancer to reconfigure, no DNS to wait for, no connection dropped.', 'lam'),
    en: 'Blue green in one include file. The order matters: first ask the new backend directly and stop if it fails; then point the symlink at it; then test and reload; and keep a request loop running to count errors. Rolling back is the same symlink edit in reverse. The upstream block is data, and the reload is atomic.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('reload', 'new workers, old ones finish'),
      kw('restart', 'stop + start: drops everything'),
      kw('blue-green', 'two pools, switch the list'),
      kw('canary', 'weight=1 vs weight=9'),
      kw('rolling / draining', 'down, deploy, back'),
      kw('worker_shutdown_timeout', 'bound the old workers'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: reload, restart, blue green, canary, rolling and draining, and worker shutdown timeout.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'A request loop + three reloads — count failures',
      'Swap the pool with a symlink mid-loop',
      'Same loop, stop + start instead — count again',
      'Point at a broken backend — then add the curl check first',
    ]), box('Keep these', `<ul><li>reload: 400 × 200</li><li>restart: an outage</li><li>curl the new backend BEFORE reloading</li><li>reload re-resolves names</li></ul>`, 'lam'), ''),
    en: 'Your turn: a request loop with three reloads; a pool swap with a symlink; the same loop with stop and start; and a broken backend, then the curl check first. Keep: reload gave four hundred out of four hundred; restart is an outage; curl the new backend before reloading; and a reload re-resolves names.' },
];
export const slides = lamDeck({ chuong: 'Chapter 9 — Load balancing across several backends', bai: '9.5' }, S);
