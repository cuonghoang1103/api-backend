/**
 * ngx-05-5 — Nginx · Chapter 5 · Lesson 5.5 "Serving stale: staying up while the backend is down" (deck video + web, 12/11/2026). Bài web: nginx-5-5-phuc-vu-ban-cu.
 * Output THẬT (scratchpad/ngx/demo/n5-5.txt; nginx/1.24.0; valid 3 s; upstream in PID tiến trình): nạp MISS → HIT; GIẾT upstream; mục còn tươi ⇒ HIT 200;
 * hết hạn + use_stale ⇒ STALE 200 bản cũ; hết hạn, không use_stale ⇒ EXPIRED 502; đường chưa từng cache ⇒ MISS 502; upstream sống lại ⇒ request đầu STALE (trả ngay),
 * request kế ⇒ HIT với bản của tiến trình MỚI (background_update đã làm mới phía sau).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n5-5:file:/root/dem2.js": "// upstream (cổng 9205): đếm số lần bị gọi, in ra trong thân\nlet n = 0;\nrequire('http').createServer((req, res) => { n++; res.end(`ban cua tien trinh ${process.pid}, lan goi thu ${n}\\n`); }).listen(9205, '127.0.0.1');\n",
 "n5-5:file:/tmp/ng/conf/stale.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  proxy_cache_path /tmp/ng/cache levels=1:2 keys_zone=kho:10m;\n  server {\n    listen 8080;\n    add_header X-Cache-Status $upstream_cache_status always;\n    proxy_cache kho;\n    proxy_cache_valid 200 3s;\n    location /co-stale/   { proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;\n                            proxy_cache_background_update on; proxy_pass http://127.0.0.1:9205; }\n    location /khong-stale/ { proxy_pass http://127.0.0.1:9205; }\n  }\n}\n",
 "n5-5:file:/root/xin.sh": "# xin.sh <nhãn> <đường dẫn> — in X-Cache-Status, mã và dòng đầu của thân\nr=$(curl -s -D /tmp/h \"http://127.0.0.1:8080$2\" | head -n 1); printf '%-38s %-8s %s  %s\\n' \"$1\" \"$(tr -d '\\r' < /tmp/h | awk -F': ' '/^X-Cache-Status/{print $2}')\" \"$(head -n1 /tmp/h | awk '{print $2}')\" \"$r\"\n",
 "n5-5:setup": "",
 "n5-5:cu": "$ bash xin.sh '1. nap cache (co stale)' /co-stale/a; bash xin.sh '   nap cache (khong stale)' /khong-stale/a\n1. nap cache (co stale)                MISS     200  ban cua tien trinh 2492, lan goi thu 1\n   nap cache (khong stale)             MISS     200  ban cua tien trinh 2492, lan goi thu 2\n$ bash xin.sh '2. ngay sau do' /co-stale/a\n2. ngay sau do                         HIT      200  ban cua tien trinh 2492, lan goi thu 1\n... GIET tien trinh upstream ...\n$ pkill -f '[d]em2.js'; sleep 0.3\n$ bash xin.sh '3. muc con TUOI, use_stale bat' /co-stale/a\n3. muc con TUOI, use_stale bat         HIT      200  ban cua tien trinh 2492, lan goi thu 1\n$ sleep 4; bash xin.sh '4. muc HET HAN, use_stale bat' /co-stale/a\n4. muc HET HAN, use_stale bat          STALE    200  ban cua tien trinh 2492, lan goi thu 1\n$ bash xin.sh '5. muc HET HAN, use_stale TAT' /khong-stale/a\n5. muc HET HAN, use_stale TAT          EXPIRED  502  <html>\n$ bash xin.sh '6. duong dan CHUA TUNG cache' /co-stale/moi\n6. duong dan CHUA TUNG cache           MISS     502  <html>\n... upstream song lai ...\n$ bash xin.sh '7. request dau sau khi song lai' /co-stale/a; sleep 0.3\n7. request dau sau khi song lai        STALE    200  ban cua tien trinh 2492, lan goi thu 1\n$ bash xin.sh '8. request ke tiep' /co-stale/a\n8. request ke tiep                     HIT      200  ban cua tien trinh 2661, lan goi thu 1"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, flow, seq } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-05-5', code: 'NGX 5.5', title: 'Serving stale: staying up while the backend is down', sub: 'Chapter 5 · Lesson 5.5' };
const O = (k) => { const v = DU_LIEU[`n5-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const BANG = () => O('cu').split('\n').filter((l) => !l.startsWith('$ ')).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 5 · Lesson 5.5', t: 'Serving stale:<br>staying up while the backend is down', sub: 'An expired copy is still a correct page from a minute ago. With two lines, users get it instead of a 502',
    en: 'Lesson 5.5. An expired copy is still a perfectly good page from a minute ago. With two directives, users get it instead of a 502 while the backend is down, and nobody waits while it refreshes.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Kill the upstream — what each request gets</li>
    <li>STALE vs EXPIRED vs MISS, side by side</li>
    <li>Background update: answer at once, refresh behind</li>
    <li>What stale can NOT save</li>
    <li>The production block — and what to monitor once it hides 5xx</li></ul>`,
    en: 'Five takeaways: what each request gets with the upstream dead; stale, expired and miss side by side; background update; what stale cannot save; and the production block, plus what to monitor once it hides the errors.' },
  { t: 'Two locations, one dead upstream', body: ngc(O('file:/tmp/ng/conf/stale.conf').split('\n').slice(9, 14).map((l) => l.replace(/^ {4}/, '')).join('\n'), { sm: true, hl: [3, 4] }) +
    icards([
      ['loop', 'valid 3 s', 'entries go stale fast, so we can watch it'],
      ['server', 'upstream prints its PID', 'so we can tell an old copy from a new one'],
      ['warn', 'then we kill it', 'pkill — a crash, mid-traffic'],
    ], 3) + flow([{ t: 'client', s: 'xin.sh: status + body' }, { t: 'nginx + cache', s: 'valid 3 s · two locations', mau: '#008a34' }, { t: 'upstream :9205', s: 'prints its PID — then killed', mau: '#c0392b' }], { h: 130 }),
    en: 'Two locations on the same upstream: one with use stale and background update, one without. Entries are fresh for only three seconds. The upstream prints its process id, so an old copy and a new one look different. Then we kill it.' },
  { t: 'The upstream dies', body: tn(BANG(), { fs: 15, wrap: 120 }) + two(box('Rows 3–6: one outage, four outcomes', 'fresh HIT 200 · STALE 200 · EXPIRED 502 · MISS 502', 'do2'), box('Rows 7–8: the recovery', 'STALE at once, then the NEW process id — nobody waited', 'xanh')),
    en: 'The upstream dies. A fresh entry: still a HIT. An expired entry with use stale: STALE, 200, the old page. An expired entry without it: EXPIRED, 502. A path never cached: MISS, 502 — nothing to fall back on. When the upstream returns, the first request still gets STALE at once; the next one gets the new process\'s page.' },
  { t: 'STALE, EXPIRED, MISS', to: true, body: cmp(['Upstream dead and…', 'use_stale', 'User sees'], [
      ['entry still fresh', 'either', '<b>200</b> HIT — the cache never asked'],
      ['entry expired', '<b>on</b>', '<b>200</b> STALE — the page from a moment ago'],
      ['entry expired', 'off', '<b>502</b> EXPIRED'],
      ['never cached', 'either', '<b>502</b> MISS — stale needs something stored'],
    ], { hl: [2] }) + box('Stale protects only what was already cached', 'Warm the pages that matter. A cold path behind a dead backend is still a 502.', 'do2'),
    en: 'Side by side: a fresh entry is a HIT either way. An expired entry is STALE with use stale, and a 502 without it. A path that was never cached is a 502 whatever you configure: stale can only serve what was stored.' },
  { t: 'Background update: answer now, refresh behind', body: tn(O('cu').split('\n').filter((l) => /^(7|8)\./.test(l)).join('\n'), { fs: 15, wrap: 120 }) +
    two(box('Request 7: STALE, at once', 'The first request after recovery did NOT wait for the upstream: it got the old copy immediately.', 'lam'),
      box('Request 8: the NEW copy', 'Meanwhile one background request refreshed the entry — the PID changed. Nobody waited.', 'xanh')) +
    seq(['request 7, 8', 'nginx', 'upstream (back)'], [[0, 1, 'request 7: entry expired'], [1, 0, 'STALE 200 — at once', '#e0590b'], [1, 2, 'background refresh (nobody waits)', '#7c3aed', true], [2, 1, '200 — new PID, stored', '#008a34'], [0, 1, 'request 8'], [1, 0, 'HIT — the new copy', '#008a34']], { w: 1110, rh: 38 }),
    en: 'Background update. Request seven, the first after recovery, got the old copy immediately. Behind it, one request refreshed the entry: request eight already shows the new process id. Nobody waited.' },
  { t: 'The production block', body: ngc(`location /api/ {
  proxy_cache kho;
  proxy_cache_valid 200 60s;
  proxy_cache_use_stale error timeout updating
                        http_500 http_502 http_503 http_504;
  proxy_cache_background_update on;
  proxy_cache_lock on;              # Lesson 5.4 — for the very first fill
  proxy_pass http://api;
}`, { sm: true, hl: [4, 6] }) +
    cmp(['Word in use_stale', 'Serves stale when…'], [
      ['<code>error</code>, <code>timeout</code>', 'the upstream cannot be reached or is too slow'],
      ['<code>http_5xx</code>', 'the upstream answers with that error'],
      ['<code>updating</code>', 'another request is already refreshing it — no stampede'],
    ]),
    en: 'The production block: use stale on error, timeout, updating, and the five hundred codes; background update on; and the cache lock for the very first fill. updating is the word that ends the stampede from the last lesson.' },
  { t: 'Stale changes what you must watch', body: icards([
      ['clock', 'No time limit by default', 'a copy is served until <code>inactive</code> or max_size removes it — a day-long outage serves a day-old page. <code>proxy_cache_valid</code> does not stop it.'],
      ['eye', 'Alert on STALE, not on 5xx', 'the 5xx at the edge is exactly what you removed. Count STALE lines per minute in the access log and alert above a small threshold.'],
      ['warn', 'Only real failures', '<code>error timeout http_502 http_503 http_504</code> — never <code>http_403</code> or <code>http_404</code>: those are answers, not failures.'],
      ['loop', 'Another backend first', '<code>proxy_next_upstream error timeout http_502…</code> tries the next server before stale is needed (Chapter 9).'],
    ], 2) + box('Tell the user when it matters', '<code>add_header X-Cache-Status $upstream_cache_status always;</code> — and on a page where freshness matters, show "updated a moment ago".', 'lam'),
    en: 'Stale changes what you must watch. There is no time limit unless inactive removes the copy. Alert on STALE, not on five hundreds, because those are what you removed. Only list real failures, never 403 or 404. Let proxy next upstream try another backend first. And tell the user when freshness matters.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('proxy_cache_use_stale', 'when an expired copy may be served'),
      kw('STALE', 'an expired copy was served'),
      kw('updating', 'serve stale while one request refreshes'),
      kw('proxy_cache_background_update', 'refresh behind the user\'s back'),
      kw('Cold path', 'never cached — stale cannot save it'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: proxy cache use stale, STALE, updating, background update, and a cold path.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Two locations, one with use_stale; a 3 s validity`,
      `Warm both, kill the upstream, request each`,
      `Request a path never cached`,
      `Start the upstream again; request twice; compare the PID`,
      `Add a STALE count to your log and alert on it`,
    ]), box('Keep these', `<ul><li>Stale beats a 502</li><li>Only cached pages are saved</li><li>updating ends the stampede</li><li>background_update: no waiting</li></ul>`, 'lam'), ''),
    en: 'Your turn: two locations with a short validity, warm them, kill the upstream, request a cold path, then restart and compare the process ids. Keep: stale beats a 502; only cached pages are saved; updating ends the stampede; background update means nobody waits.' },
];
export const slides = lamDeck({ chuong: 'Chapter 5 — A cache in front of the app', bai: '5.5' }, S);
