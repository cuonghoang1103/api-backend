/**
 * ngx-10-4 — Nginx · Chapter 10 · Lesson 10.4 "The error log: levels, anatomy, and the one setting that fills a disk" (deck video + web, 13/11/2026).
 * Bài web: nginx-10-4-error-log-va-cac-muc. Output THẬT (scratchpad/ngx/demo/n10-4.txt; nginx/1.24.0 Ubuntu, có --with-debug):
 * một dòng connect() failed (111) ⇒ 502 · bốn thông điệp: 111 ⇒ 502 · 110 upstream timed out ⇒ 504 · 2 open() failed ⇒ 404 · 13 Permission denied ⇒ 403 ·
 * 4 request (ok · chết · thiếu tệp · quá giờ) ở 5 mức (đếm SAU khởi động): crit 0 · error 3/710 · warn 3/710 · notice 3/710 · info 7/1062 ·
 * debug: MỘT request /ok = 85 dòng / 5853 byte · debug_connection: nền debug + IP khác 518 dòng (không lọc) · nền info + IP khác 7 · nền info + đúng IP 448 ·
 * thừa kế: server a ⇒ goc.log, server b có error_log riêng ⇒ chỉ rieng-b.log, server c hai error_log (warn + crit) ⇒ c-du 1 dòng, c-nghiem-trong 0.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n10-4:file:/root/mau.conf": "# mẫu cấu hình: @MUC@ = mức error_log, @THEM@ = dòng thêm trong events\npid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log @MUC@;\nevents { @THEM@ }\nhttp {\n  access_log off;\n  server {\n    listen 8080 default_server;\n    server_name _;\n    root /tmp/ng/www;\n    location /chet  { proxy_pass http://127.0.0.1:9999; }                              # không ai nghe\n    location /cham  { proxy_read_timeout 300ms; proxy_pass http://127.0.0.1:9600; }    # backend ngủ 600 ms\n    location /kin/  { alias /tmp/ng/kin/; }                                            # worker (nobody) không vào được\n    location = /ok  { return 200 \"ok\\n\"; }\n  }\n}\n",
 "n10-4:file:/root/chay_muc.sh": "# chay_muc.sh <mức> [dòng events] — khởi động nginx ở mức đó, XOÁ log sau khi khởi động, gửi 4 request\n# (ok · upstream chết · tệp không có · quá giờ), in số dòng + byte của error.log\npkill nginx 2>/dev/null; sleep 0.3\nsed -e \"s/@MUC@/$1/\" -e \"s|@THEM@|$2|\" /root/mau.conf > /tmp/ng/conf/muc.conf\nnginx -c /tmp/ng/conf/muc.conf; sleep 0.3; : > /tmp/ng/logs/error.log\nfor p in ok.txt chet khong-co.txt cham; do curl -s -o /dev/null --max-time 2 http://127.0.0.1:8080/$p; done; sleep 0.2\nprintf '%-7s %3s dong, %5s byte\\n' $1 $(wc -l < /tmp/ng/logs/error.log) $(stat -c %s /tmp/ng/logs/error.log)\n",
 "n10-4:setup": "",
 "n10-4:mot": "$ curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/chet; tail -1 error.log\n502\n2026/11/13 00:45:29 [error] 20646#20646: *7 connect() failed (111: Connection refused) while connecting to upstream, client: 127.0.0.1, server: _, request: \"GET /chet HTTP/1.1\", upstream: \"http://127.0.0.1:9999/chet\", host: \"127.0.0.1:8080\"",
 "n10-4:bon": "$ for p in chet cham khong-co.txt kin/bi-mat.txt; do curl -s -o /dev/null -w \"$p -> %{http_code}\\n\" http://127.0.0.1:8080/$p; done\nchet -> 502\ncham -> 504\nkhong-co.txt -> 404\nkin/bi-mat.txt -> 403\n$ grep -oE '\\[error\\] [0-9#]+: \\*[0-9]+ [^,]+' error.log\n[error] 20646#20646: *9 connect() failed (111: Connection refused) while connecting to upstream\n[error] 20646#20646: *11 upstream timed out (110: Connection timed out) while reading response header from upstream\n[error] 20646#20646: *13 open() \"/tmp/ng/www/khong-co.txt\" failed (2: No such file or directory)\n[error] 20646#20646: *14 open() \"/tmp/ng/kin/bi-mat.txt\" failed (13: Permission denied)",
 "n10-4:muc": "$ for m in crit error warn notice info; do bash chay_muc.sh $m; done\ncrit      0 dong,     0 byte\nerror     3 dong,   710 byte\nwarn      3 dong,   710 byte\nnotice    3 dong,   710 byte\ninfo      7 dong,  1062 byte",
 "n10-4:debug": "$ nginx -V 2>&1 | grep -o with-debug\nwith-debug\n$ pkill nginx; sleep 0.3; sed -e 's/@MUC@/debug/' -e 's|@THEM@||' mau.conf > /tmp/ng/conf/dbg.conf; nginx -c /tmp/ng/conf/dbg.conf; sleep 0.5; a=$(wc -l < /tmp/ng/logs/error.log); b=$(stat -c %s /tmp/ng/logs/error.log); curl -s -o /dev/null http://127.0.0.1:8080/ok; sleep 0.3; c=$(wc -l < /tmp/ng/logs/error.log); d=$(stat -c %s /tmp/ng/logs/error.log); echo \"MOT request /ok o muc debug: $((c-a)) dong / $((d-b)) byte\"\nMOT request /ok o muc debug: 85 dong / 5853 byte",
 "n10-4:dbgconn": "$ bash chay_muc.sh debug 'debug_connection 10.99.99.99;'   # nền debug + debug_connection IP khác\ndebug   518 dong, 35831 byte\n$ bash chay_muc.sh info  'debug_connection 10.99.99.99;'   # nền info + IP khác\ninfo      7 dong,  1062 byte\n$ bash chay_muc.sh info  'debug_connection 127.0.0.1;'     # nền info + ĐÚNG IP của mình\ninfo    448 dong, 31311 byte",
 "n10-4:file:/tmp/ng/conf/ke.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/goc.log;                  # mức chính\nevents {}\nhttp {\n  access_log off;\n  server { listen 8080; server_name a.vidu;                                              location / { proxy_pass http://127.0.0.1:9999; } }\n  server { listen 8080; server_name b.vidu; error_log /tmp/ng/logs/rieng-b.log;           location / { proxy_pass http://127.0.0.1:9999; } }\n  server { listen 8080; server_name c.vidu; error_log /tmp/ng/logs/c-du.log warn;\n                                            error_log /tmp/ng/logs/c-nghiem-trong.log crit; location / { proxy_pass http://127.0.0.1:9999; } }\n}\n",
 "n10-4:ke": "$ pkill nginx; sleep 0.3; nginx -c /tmp/ng/conf/ke.conf; sleep 0.3; for h in a b c; do curl -s -o /dev/null -H \"Host: $h.vidu\" http://127.0.0.1:8080/x; done\n$ for f in goc rieng-b c-du c-nghiem-trong; do printf '%-15s %s dong: ' $f.log $(wc -l < /tmp/ng/logs/$f.log); grep -o 'server: [a-z.]*' /tmp/ng/logs/$f.log | tr '\\n' ' '; echo; done\ngoc.log         1 dong: server: a.vidu \nrieng-b.log     1 dong: server: b.vidu \nc-du.log        1 dong: server: c.vidu \nc-nghiem-trong.log 0 dong: "
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, meter, tiers } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-10-4', code: 'NGX 10.4', title: 'The error log: levels, anatomy, and the one setting that fills a disk', sub: 'Chapter 10 · Lesson 10.4' };
const O = (k) => { const v = DU_LIEU[`n10-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };

/** Hình: một dòng error log, mỗi phần một nhãn. */
function giaiPhau() {
  const W = 1110, H = 210;
  const p = [['2026/11/13 00:45:29', 'local time — no log_format', '#64748b'], ['[error]', 'severity', '#c0392b'], ['20646#20646:', 'pid # thread', '#7c3aed'], ['*7', 'connection no.', '#009639'],
    ['connect() failed (111: Connection refused)', 'syscall + errno', '#b85a2b'], ['upstream: "http://127.0.0.1:9999/chet"', 'the exact URL tried', '#2563eb']];
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  let x = 4, y = 18;
  p.forEach(([v, nhan, m], i) => {
    const w = v.length * 10.6 + 16;
    if (x + w > W) { x = 4; y += 100; }
    s += `<rect x="${x}" y="${y}" width="${w}" height="38" rx="7" fill="${m}18" stroke="${m}" stroke-width="2"/><text x="${x + w / 2}" y="${y + 26}" text-anchor="middle" font-family="monospace" font-size="17" font-weight="700" fill="${m}">${v}</text>`;
    s += `<line x1="${x + w / 2}" y1="${y + 40}" x2="${x + w / 2}" y2="${y + 46 + (i % 2) * 22}" stroke="${m}" stroke-width="1.5"/><text x="${x + w / 2}" y="${y + 62 + (i % 2) * 22}" text-anchor="middle" font-size="16" font-weight="700" fill="${m}">${nhan}</text>`;
    x += w + 10;
  });
  return s + '</svg>';
}

export const S = [
  { cover: true, nhan: 'Chapter 10 · Lesson 10.4', t: 'The error log: levels, anatomy,<br>and the one setting that fills a disk', sub: 'Different rules from the access log — and one level that writes sixty times more',
    en: 'Lesson 10.4. The access log records what happened. The error log records why it went wrong, and it is a different file with different rules — a different inheritance model, eight severity levels, and one level that produces sixty times more data per request than an access log line.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>One error line, taken apart — and the *N that ties a request together</li>
    <li>Four errno numbers, four status codes</li>
    <li>Eight levels, measured — and why crit hides an outage</li>
    <li>debug: 85 lines for one tiny request; debug_connection grants, never restricts</li>
    <li>A lower error_log replaces the inherited one</li></ul>`,
    en: 'Five takeaways: one error line taken apart; four errno numbers and four status codes; the levels, measured; debug, and how debug connection really works; and inheritance — a lower error log replaces the inherited one.' },
  { t: 'One line, taken apart', body: tn(O('mot'), { fs: 15, wrap: 118 }) + giaiPhau() + box('*7 is a handle, not decoration', 'Every line nginx writes about one client connection carries the same number — across modules and phases. grep \'\\*7 \' error.log gives you that request\'s whole story in order. At debug level it is the only way to read the file at all.', 'lam'),
    en: 'One line, taken apart, produced by pointing proxy pass at a port with nothing listening. Local time, in a fixed format — there is no log format for the error log. The severity. Process and thread. Star seven, the connection number. The syscall and its errno. And the exact upstream URL Nginx tried. The connection number is the most useful field: grep for it and you get one request\'s whole story.' },
  { t: 'Four errno numbers, four status codes', body: tn(O('bon'), { fs: 14, wrap: 126 }) + cmp(['errno', 'Message', 'Client gets', 'Look at'], [
      ['111', 'Connection refused', '502', 'backend down, or on another address'],
      ['110', 'upstream timed out (reading header)', '504', 'proxy_read_timeout — a slow app'],
      ['2', 'open() … No such file', '404', 'the resolved path (Chapter 4)'],
      ['13', 'open() … Permission denied', '403', 'x on EVERY directory in the path'],
    ], { hl: [3] }),
    en: 'Four numbers you will meet. One hundred eleven, connection refused: the client gets five oh two — the backend is down or listening elsewhere. One hundred ten, timed out: five oh four, and the message tells you which timeout. Two, no such file: four oh four, with the fully resolved path printed for free. Thirteen, permission denied: four oh three — measured here with a directory the worker could not enter.' },
  { t: 'The levels, measured', body: tn(O('muc'), { fs: 18, wrap: 110 }) +
    meter([['crit', 0, '#c0392b', 'a 502, a 404 and a 504 — invisible'], ['error', 710, '#b85a2b'], ['warn', 710, '#009639', 'the right default'], ['notice', 710, '#2563eb'], ['info', 1062, '#7c3aed']], { don: 'byte', rh: 38, fs: 17, nhan: 200 }),
    en: 'The levels, measured. Eight levels from emerg to debug; setting one means this and everything more severe. The same four requests at five levels, counted after startup: crit wrote nothing at all — a dead backend, a missing file and a timeout, all invisible. Error, warn and notice wrote the same three lines. Info added a few more. Warn is the right production default.' },
  { t: 'debug: one tiny request, measured', body: tn(O('debug'), { fs: 16, wrap: 108 }) +
    meter([['one combined access-log line (~95)', 95, '#64748b'], ['error log at debug — ONE /ok request', 5853, '#c0392b']], { don: 'byte', rh: 44, fs: 18, nhan: 360 }) +
    box('debug left on is how a disk fills', '85 lines for location = /ok { return 200 } — no proxy, no TLS, no file. A real request is several times that. At a million requests a day: gigabytes, usually on the partition that also holds your database.', 'do2'),
    en: 'Debug: the Ubuntu package is built with debug support. One request to a location that just returns ok — no proxying, no TLS, no file access — wrote eighty five lines, five thousand eight hundred fifty three bytes. About sixty times an access log line, for the cheapest request the server can serve. Debug goes on to answer one question and comes off immediately.' },
  { t: 'debug_connection grants — it does not restrict', body: tn(O('dbgconn'), { fs: 16, wrap: 128 }) + two(box('Measured', 'Base debug + debug_connection 10.99.99.99: 518 lines — no filtering at all. Base info + another IP: 7. Base info + MY IP: 448. It raises matching connections FROM the base level.', 'lam'), ngc(`# RIGHT: base warn, only your IP gets debug
error_log /var/log/nginx/error.log warn;
events {
  debug_connection 203.0.113.42;   # your IP
  debug_connection 10.0.0.0/8;     # or a range
}`, { sm: true, hl: [2, 4] }), '') + meter([['base debug + another IP', 518, '#c0392b', 'everyone'], ['base info + another IP', 7, '#64748b', 'nobody raised'], ['base info + MY IP', 448, '#009639', 'only mine']], { don: 'lines', rh: 40, fs: 17, nhan: 300 }),
    en: 'The trap: debug connection does not restrict. With the base already at debug, adding it for another address changed nothing — five hundred eighteen lines. It only raises matching connections from whatever the base is. So the right production setup is a base of warn, with debug connection for your own IP: everyone else stays quiet, you get full debug.' },
  { t: 'A lower error_log replaces — it does not add', body: ngc(`error_log /tmp/ng/logs/goc.log;                                   # main level
server { server_name a.vidu; … }                                    # inherits goc.log
server { server_name b.vidu; error_log …/rieng-b.log; … }           # replaces it
server { server_name c.vidu; error_log …/c-du.log warn;             # several in ONE context:
                             error_log …/c-nghiem-trong.log crit; … } # each gets messages at its level`, { sm: true, hl: [3, 4, 5] }) + tn(O('ke').split('\n').slice(1).join('\n'), { fs: 16, wrap: 108 }) +
    box('In a container: error_log stderr warn;', 'docker logs sees it and the collector picks it up (the official image symlinks the files to /dev/stderr). A file inside a container nobody opens is not a log.', 'lam'),
    en: 'Inheritance. Server a has no error log and its failure went to the main level file. Server b declares its own, and its failure went only there — absent from the main file. Server c declares two in one context, warn and crit: the warn file got the line, the crit file nothing. In a container, log to standard error.' },
  { t: 'An empty log is not a measurement', body: icards([
      ['warn', 'Empty is consistent with two stories', '"the thing did not happen" — or "the thing never ran"'],
      ['eye', 'Read the unfiltered file', 'a tidy grep can hide the six lines of "bind() failed (98: Address already in use)" that explain everything'],
      ['check', 'Confirm the process started', 'before concluding anything from an absence — the web lesson\'s own first run was exactly this'],
    ], 3) + box('Checklist for production', 'error_log … warn · one crit-only file if you want a quiet pager · debug only via debug_connection · stderr in containers · grep \'*N \' to follow one request.', 'xanh'),
    en: 'An empty log is not a measurement. It is equally consistent with "it did not happen" and "it never ran". Before concluding anything from an absence, confirm the process started, and read the unfiltered file. Checklist: warn, an optional crit file, debug only through debug connection, standard error in containers, and grep the connection number.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('error_log … level', 'this and more severe'),
      kw('*N', 'the connection number'),
      kw('errno 111 / 110 / 2 / 13', '502 / 504 / 404 / 403'),
      kw('debug', '~85 lines per tiny request'),
      kw('debug_connection', 'raise one client to debug'),
      kw('inheritance', 'lower error_log replaces'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: error log and its level, the connection number, errno one hundred eleven, one hundred ten, two and thirteen, debug, debug connection, and inheritance.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'A dead upstream, a slow one, a missing file, a locked directory',
      'Replay them at crit, error, warn, info — count the lines',
      'One request at debug — then debug_connection with base warn',
      'Two servers, one with its own error_log — where did each line go?',
    ]), box('Keep these', `<ul><li>warn in production</li><li>crit hides outages</li><li>debug only via debug_connection</li><li>grep '*N ' for one request</li></ul>`, 'lam'), ''),
    en: 'Your turn: four failures; replay them at four levels; one request at debug, then debug connection with a warn base; two servers with different error logs. Keep: warn in production; crit hides outages; debug only through debug connection; grep the connection number to follow one request.' },
];
export const slides = lamDeck({ chuong: 'Chapter 10 — Logs, and seeing what is happening', bai: '10.4' }, S);
