/**
 * ngx-05-4 — Nginx · Chapter 5 · Lesson 5.4 "The stampede: 20 requests, 20 upstream calls or 1" (deck video + web, 12/11/2026). Bài web: nginx-5-4-con-giam-dap.
 * Output THẬT (scratchpad/ngx/demo/n5-4.txt; nginx/1.24.0; upstream mất đúng 1 s/request, ĐẾM lượt): 20 request đồng thời vào mục chưa cache —
 * không lock ⇒ upstream bị gọi 20 lần, ai cũng ~1,01 s; proxy_cache_lock ⇒ 1 lần. Thời gian chờ: 1 worker ⇒ khi 1,01 s, khi người chờ 1,51 s;
 * 4 worker ⇒ cả ba lượt: nhanh nhất 1,00 s, trung vị 1,51 s, chậm nhất 1,51 s (người chờ dò lại mỗi 500 ms).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n5-4:file:/root/cham1s.js": "// upstream (cổng 9204): mỗi request mất ĐÚNG 1 giây; đếm số lần bị gọi — /dem trả con số, không tính vào đếm\nlet n = 0;\nrequire('http').createServer((req, res) => {\n  if (req.url === '/dem') { res.end(`${n}\\n`); return; }\n  n++; setTimeout(() => res.end(`lan goi thu ${n}\\n`), 1000);\n}).listen(9204, '127.0.0.1');\n",
 "n5-4:file:/tmp/ng/conf/lock.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  proxy_cache_path /tmp/ng/cache1 levels=1:2 keys_zone=kho1:10m;\n  proxy_cache_path /tmp/ng/cache2 levels=1:2 keys_zone=kho2:10m;\n  server { listen 8080; location / { proxy_cache kho1; proxy_cache_valid 200 60s; proxy_pass http://127.0.0.1:9204; } }\n  server { listen 8081; location / { proxy_cache kho2; proxy_cache_valid 200 60s; proxy_cache_lock on; proxy_pass http://127.0.0.1:9204; } }\n}\n",
 "n5-4:file:/root/dong-thoi.py": "# dong-thoi.py <cổng> <đường dẫn> — 20 request CÙNG LÚC, in số lần upstream thật sự bị gọi + thời gian từng request\nimport sys, time, threading, urllib.request\ncong, p = sys.argv[1], sys.argv[2]\ntruoc = int(urllib.request.urlopen('http://127.0.0.1:9204/dem').read()); tg = []\ndef mot():\n    t = time.time(); urllib.request.urlopen(f'http://127.0.0.1:{cong}{p}').read(); tg.append(time.time() - t)\nt0 = time.time(); ds = [threading.Thread(target=mot) for _ in range(20)]\n[x.start() for x in ds]; [x.join() for x in ds]; tong = time.time() - t0\nsau = int(urllib.request.urlopen('http://127.0.0.1:9204/dem').read()); tg.sort()\nprint(f'upstream bi goi {sau - truoc:2d} lan · tong={tong:.2f}s nhanh nhat={tg[0]:.2f}s cham nhat={tg[-1]:.2f}s trung vi={tg[10]:.2f}s')\n",
 "n5-4:setup": "",
 "n5-4:giamdap": "$ printf 'KHONG proxy_cache_lock  '; python3 dong-thoi.py 8080 /api/danh-sach\nKHONG proxy_cache_lock  upstream bi goi 20 lan · tong=1.02s nhanh nhat=1.02s cham nhat=1.02s trung vi=1.02s\n$ printf 'CO proxy_cache_lock     '; python3 dong-thoi.py 8081 /api/danh-sach\nCO proxy_cache_lock     upstream bi goi  1 lan · tong=1.01s nhanh nhat=1.00s cham nhat=1.01s trung vi=1.00s",
 "n5-4:lap": "=== lap lai 3 lan, moi lan mot duong dan MOI (chua co trong cache) ===\n$ for i in 1 2 3; do printf 'KHONG lock  '; python3 dong-thoi.py 8080 /moi-$i; printf 'CO lock     '; python3 dong-thoi.py 8081 /moi-$i; done\nKHONG lock  upstream bi goi 20 lan · tong=1.02s nhanh nhat=1.01s cham nhat=1.01s trung vi=1.01s\nCO lock     upstream bi goi  1 lan · tong=1.01s nhanh nhat=1.01s cham nhat=1.01s trung vi=1.01s\nKHONG lock  upstream bi goi 20 lan · tong=1.02s nhanh nhat=1.01s cham nhat=1.01s trung vi=1.01s\nCO lock     upstream bi goi  1 lan · tong=1.52s nhanh nhat=1.01s cham nhat=1.51s trung vi=1.51s\nKHONG lock  upstream bi goi 20 lan · tong=1.02s nhanh nhat=1.01s cham nhat=1.01s trung vi=1.01s\nCO lock     upstream bi goi  1 lan · tong=1.01s nhanh nhat=1.00s cham nhat=1.01s trung vi=1.01s",
 "n5-4:bonworker": "$ ps -C nginx -o cmd= | grep -c 'worker process'\n4\n$ for i in 1 2 3 4 5 6; do printf 'CO lock, 4 worker  '; python3 dong-thoi.py 8081 /bon-$i; done\nCO lock, 4 worker  upstream bi goi  1 lan · tong=1.51s nhanh nhat=1.00s cham nhat=1.51s trung vi=1.51s\nCO lock, 4 worker  upstream bi goi  1 lan · tong=1.52s nhanh nhat=1.02s cham nhat=1.51s trung vi=1.51s\nCO lock, 4 worker  upstream bi goi  1 lan · tong=1.52s nhanh nhat=1.01s cham nhat=1.52s trung vi=1.51s\nCO lock, 4 worker  upstream bi goi  1 lan · tong=1.52s nhanh nhat=1.01s cham nhat=1.51s trung vi=1.51s\nCO lock, 4 worker  upstream bi goi  1 lan · tong=1.51s nhanh nhat=1.00s cham nhat=1.51s trung vi=1.01s\nCO lock, 4 worker  upstream bi goi  1 lan · tong=1.02s nhanh nhat=1.01s cham nhat=1.02s trung vi=1.01s"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, meter, seq } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-05-4', code: 'NGX 5.4', title: 'The stampede: 20 requests, 20 upstream calls or 1', sub: 'Chapter 5 · Lesson 5.4' };
const O = (k) => { const v = DU_LIEU[`n5-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };

export const S = [
  { cover: true, nhan: 'Chapter 5 · Lesson 5.4', t: 'The stampede:<br>20 requests, 20 upstream calls or 1', sub: 'A cache is empty exactly when traffic is highest — after a deploy, after an expiry. Everybody misses at once',
    en: 'Lesson 5.4. A cache entry is missing exactly when it hurts most: right after it expires, with traffic arriving. Every request misses at the same moment, and every one goes to the upstream.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Twenty requests at once, counted at the upstream</li>
    <li>proxy_cache_lock: one goes, the rest wait</li>
    <li>What waiting costs — measured with 1 and 4 workers</li>
    <li>The two timeouts of the lock</li>
    <li>Three cures ranked, and spotting one in the log</li></ul>`,
    en: 'Five takeaways: a counted stampede; the cache lock; what waiting costs with one and with four workers; the lock timeouts; and three cures ranked, plus how to spot one in your log.' },
  { t: 'Twenty at once, counted', body: tn(O('file:/root/dong-thoi.py').split('\n').slice(1).join('\n'), { fs: 12, wrap: 130 }) +
    tn(O('giamdap'), { fs: 15, wrap: 120 }),
    en: 'A small script fires twenty requests at the same instant at a path that takes the upstream one second, and counts how many times the upstream was really called. Without a lock: twenty times. With proxy cache lock: once.' },
  { t: 'One goes, nineteen wait', body: meter([['no lock: upstream calls', 20, '#c0392b'], ['proxy_cache_lock: upstream calls', 1, '#2f9d58']], { don: 'calls', rh: 38, fs: 19, nhan: 420 }) +
    ngc(`location /api/danh-sach {
  proxy_cache kho;  proxy_cache_valid 200 60s;
  proxy_cache_lock          on;
  proxy_cache_lock_timeout  5s;   # a waiter gives up after this and asks upstream itself
  proxy_cache_lock_age      5s;   # a leader slower than this: let another one try
}`, { sm: true, hl: [3] }) + seq(['20 clients', 'nginx (lock)', 'upstream (1 s)'], [[0, 1, '20 × GET /api/danh-sach — all miss'], [1, 2, 'ONE request goes up'], [1, 1, '19 wait — re-check every 500 ms', '#7c3aed'], [2, 1, '200 after 1 s — stored', '#008a34'], [1, 0, 'all 20 answered from the new entry', '#008a34']], { w: 1110, rh: 34, fs: 16 }),
    en: 'One request goes to the upstream, the other nineteen wait for its answer. The lock has two timeouts: how long a waiter waits before asking the upstream itself, and how long a slow leader keeps the lock.' },
  { t: 'What waiting costs', body: tn(O('lap').split('\n').filter((l) => /^(KHONG|CO)/.test(l)).join('\n') + '\n' + O('bonworker').split('\n').filter((l) => /^CO lock, 4/.test(l)).join('\n'), { fs: 13, wrap: 130 }) +
    two(box('Waiters re-check every 500 ms', 'With 4 workers, six runs: the slowest took 1.51 s in five of them, the median 1.51 s in four. The leader always took 1.00 s.', 'do2'),
      box('Not every run pays', 'One worker: one run in three paid 1.51 s. Four workers: one run in six paid nothing. Measure on the worker count you really run — several times.', 'lam')),
    en: 'What waiting costs. With four workers, six runs: the leader always took one second, and the slowest took one and a half in five runs out of six — waiters re-check every half second. Not every run pays, so measure on the worker count you really run, several times.' },
  { t: 'The trade', body: cmp(['', 'No lock', 'proxy_cache_lock'], [
      ['upstream calls for one miss', '20', '<b>1</b>'],
      ['slowest client', '~1.01 s', '~1.51 s in 5 of 6 runs (4 workers)'],
      ['risk', 'the backend falls over at every expiry', 'a slow leader makes everyone wait'],
    ]) + box('The better cure: never let it be empty', '<code>proxy_cache_use_stale updating</code> + <code>proxy_cache_background_update on</code>: everyone gets the old copy at once while ONE request refreshes it — Lesson 5.5.', 'xanh'),
    en: 'The trade: one upstream call instead of twenty, paid for with half a second for the waiters, and the risk that a slow leader holds everyone. The better cure is to never let the entry be empty: serve the stale copy while one request refreshes it — the next lesson.' },
  { t: 'Three cures, ranked — and how to spot a stampede', body: cmp(['', 'Cure', 'Use it when'], [
      ['1', '<code>proxy_cache_use_stale updating</code> + <code>background_update on</code>', 'slightly old data is fine — nobody waits (Lesson 5.5)'],
      ['2', '<code>proxy_cache_lock on</code>', 'the data MUST be fresh: a price, a stock level, a balance'],
      ['3', 'a longer TTL', 'always first: 10 s → 60 s = six times fewer stampedes, no downside'],
    ]) + two(box('Spot it in the access log', 'Log <code>$upstream_cache_status</code>: a stampede is a burst of MISS lines for ONE URI within milliseconds, repeating exactly one TTL apart.', 'lam'),
      box('And cover the bad path', '<code>proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;</code> — without it, a failing backend gets one more failed request at every expiry.', 'do2')),
    en: 'Three cures, ranked. First, serve stale while one request updates — nobody waits. Second, the lock, when data must be fresh. Third, a longer TTL, which has no downside at all. To spot a stampede, look for a burst of MISS lines for one URI, one TTL apart. And cover the bad path with use stale on errors.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Cache stampede', 'every request misses at once'),
      kw('proxy_cache_lock', 'one request fills the entry, the rest wait'),
      kw('proxy_cache_lock_timeout', 'how long a waiter waits'),
      kw('proxy_cache_lock_age', 'how long a slow leader keeps the lock'),
      kw('Thundering herd', 'another name for the stampede'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: cache stampede, proxy cache lock, lock timeout, lock age, and thundering herd.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Make an upstream that takes 1 s and counts calls`,
      `Fire 20 requests at once — with and without the lock`,
      `Repeat with ${c('worker_processes 4')}; read the slowest`,
      `Try ${c('proxy_cache_use_stale updating')} (Lesson 5.5)`,
    ]), box('Keep these', `<ul><li>A miss under load = a stampede</li><li>The lock: 20 calls → 1</li><li>Waiters pay ~0.5 s</li><li>Stale-while-updating is better</li></ul>`, 'lam'), ''),
    en: 'Your turn: build the slow counting upstream, fire twenty at once with and without the lock, repeat with four workers, then try serving stale. Keep: a miss under load is a stampede; the lock turns twenty calls into one; waiters pay half a second.' },
];
export const slides = lamDeck({ chuong: 'Chapter 5 — A cache in front of the app', bai: '5.4' }, S);
