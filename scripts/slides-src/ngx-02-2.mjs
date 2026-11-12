/**
 * ngx-02-2 — Nginx · Chapter 2 · Lesson 2.2 "The URI that is matched is NOT the one that was sent" (deck video + web, 12/11/2026). Bài web: nginx-2-2-uri-duoc-chuan-hoa.
 * Output THẬT (scratchpad/ngx/demo/n2-2.txt; nginx/1.24.0, curl --path-as-is): tám cách viết /quan-tri (giải mã %, gạch chéo lặp, . và ..; KHÔNG hạ chữ);
 * /x.PHP thoát regex; /x.php/them ⇒ vẫn regex; %00 ⇒ 400; $uri vs $request_uri; query không bao giờ tham gia khớp.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n2-2:setup": "",
 "n2-2:file:/tmp/ng/conf/uri.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log /tmp/ng/logs/access.log;\n  server {\n    listen 8080;\n    location /quan-tri { return 200 \"TRUNG /quan-tri   uri=[$uri]\\n\"; }\n    location ~ \\.php   { return 200 \"TRUNG regex .php  uri=[$uri]\\n\"; }\n    location /         { return 200 \"cong khai         uri=[$uri]  request_uri=[$request_uri]\\n\"; }\n  }\n}\n",
 "n2-2:file:/root/bang22.sh": "for u in \"$@\"; do printf '%-26s -> ' \"$u\"; curl -s --path-as-is \"http://127.0.0.1:8080$u\" || echo; done\n",
 "n2-2:tamcach": "$ bash bang22.sh /quan-tri /%71uan-tri /QUAN-TRI //quan-tri /cong-khai/../quan-tri /./quan-tri /quan-tri/../cong-khai /quan%2Dtri\n/quan-tri                  -> TRUNG /quan-tri   uri=[/quan-tri]\n/%71uan-tri                -> TRUNG /quan-tri   uri=[/quan-tri]\n/QUAN-TRI                  -> cong khai         uri=[/QUAN-TRI]  request_uri=[/QUAN-TRI]\n//quan-tri                 -> TRUNG /quan-tri   uri=[/quan-tri]\n/cong-khai/../quan-tri     -> TRUNG /quan-tri   uri=[/quan-tri]\n/./quan-tri                -> TRUNG /quan-tri   uri=[/quan-tri]\n/quan-tri/../cong-khai     -> cong khai         uri=[/cong-khai]  request_uri=[/quan-tri/../cong-khai]\n/quan%2Dtri                -> TRUNG /quan-tri   uri=[/quan-tri]",
 "n2-2:haicach": "$ bash bang22.sh /x.php /x.PHP /x.pHp /x.php/them-duong-dan\n/x.php                     -> TRUNG regex .php  uri=[/x.php]\n/x.PHP                     -> cong khai         uri=[/x.PHP]  request_uri=[/x.PHP]\n/x.pHp                     -> cong khai         uri=[/x.pHp]  request_uri=[/x.pHp]\n/x.php/them-duong-dan      -> TRUNG regex .php  uri=[/x.php/them-duong-dan]\n$ curl -s --path-as-is -o /dev/null -w '%{http_code}\\n' 'http://127.0.0.1:8080/x.php%00.jpg'\n400",
 "n2-2:bien": "$ curl -s --path-as-is 'http://127.0.0.1:8080/cong-khai//x/%41?trang=2'\ncong khai         uri=[/cong-khai/x/A]  request_uri=[/cong-khai//x/%41?trang=2]\n$ tail -n 1 /tmp/ng/logs/access.log\n127.0.0.1 - - [12/Nov/2026:12:25:59 +0000] \"GET /cong-khai//x/%41?trang=2 HTTP/1.1\" 200 80 \"-\" \"curl/8.5.0\"",
 "n2-2:query": "$ curl -s 'http://127.0.0.1:8080/?quan-tri=1'\ncong khai         uri=[/]  request_uri=[/?quan-tri=1]"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, flow, icards, cmp, box, two, steps, kw, c } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-02-2', code: 'NGX 2.2', title: 'The URI that is matched is NOT the one that was sent', sub: 'Chapter 2 · Lesson 2.2' };
const O = (k) => { const v = DU_LIEU[`n2-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.replace(/  request_uri=\[[^\]]*\]/g, '').replace(/^\$ bash bang22.sh (.*)$/m, (_, a) => `$ for u in ${a.split(' ').slice(0, 3).join(' ')} …; do curl --path-as-is …$u; done`);

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.2', t: 'The URI that is matched<br>is NOT the one that was sent', sub: 'Locations match $uri — a NORMALISED path — not the raw bytes of the request line. Knowing exactly what the normaliser does separates "my location does not match" from a security incident',
    en: 'Lesson 2.2. The algorithm of 2.1 runs on $uri, a normalised path, not on the raw bytes of the request line. Knowing exactly what the normaliser does is the difference between a location that does not match and a security incident.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Eight spellings of the same path — measured</li>
    <li>The three things the normaliser does, and the one it does not</li>
    <li>Why a location cannot fence anything into a subtree</li>
    <li>Two spellings that behave differently, one that is rejected</li>
    <li>$request_uri, $uri, $args — where each form lives</li></ul>`,
    en: 'Five takeaways: eight spellings measured; what normalisation does and does not; why a location is not a fence; case and NUL bytes; and the variables that hold each form.' },
  { t: 'Eight spellings of one path, measured', body: ngc(O('file:/tmp/ng/conf/uri.conf').split('\n').slice(7, 10).map((l) => l.trim().replace(/  request_uri=\[\$request_uri\]/, '')).join('\n'), { sm: true }) +
    tn(bo(O('tamcach')), { fs: 15 }),
    en: 'Three blocks: /quan-tri, a .php regex and the catch-all. Eight spellings of /quan-tri, sent with curl --path-as-is so curl does not clean them first. Six reach the admin block; uppercase and a path that resolves elsewhere do not.' },
  { t: 'What the normaliser does — before matching', to: true, body: flow([
      { t: '1 · decode %XX', s: '%71 → q · %2D → -' }, { t: '2 · merge //', s: '//quan-tri → /quan-tri' },
      { t: '3 · resolve . and ..', s: 'textually, FIRST' }, { t: '✗ case', s: 'NOT lowercased', mau: '#c0392b' }], { h: 170 }) +
    icards([
      ['shield', 'The reassuring half', 'You cannot sneak past a location by re-spelling the path: encoding, double slashes and ../ are resolved first.'],
      ['warn', 'Case is untouched', '/QUAN-TRI fell through to location /. Prefix locations are case-sensitive; only ~* ignores case.'],
    ], 2) + tn('$ bash bang22.sh /%71uan-tri //quan-tri /QUAN-TRI\n' + O('tamcach').split('\n').filter((l) => /^\/(%71|\/q|QUAN)/.test(l)).join('\n'), { fs: 15 }),
    en: 'Three steps before matching: percent-decoding, merging repeated slashes, and resolving dot and dot-dot. And one thing it does not do: case is left alone, so /QUAN-TRI fell through to the catch-all.' },
  { t: 'Trap: a location cannot fence anything into a subtree', body: two(
      ngc(`# meant: serve ONLY under /cong-khai
location /cong-khai/ { root /srv/site; }
location /quan-tri   { deny all; }`, { sm: true }),
      tn(bo(O('tamcach')).split('\n').filter((l) => /cong-khai|^\$/.test(l)).join('\n'), { fs: 14, wrap: 52 })) +
    box('The /cong-khai/ block is never even asked', '<code>/cong-khai/../quan-tri</code> is resolved to <code>/quan-tri</code> BEFORE matching — it goes straight to the admin block. Protection belongs on the block that serves the sensitive path, not on a neighbour.', 'do2'),
    en: 'The flip side: because /cong-khai/../quan-tri is resolved to /quan-tri before matching, the block written for /cong-khai is never asked. A location cannot fence requests into a subtree; protect the block that serves the sensitive path.' },
  { t: 'Two spellings behave differently, one is rejected', body: tn(bo(O('haicach')), { fs: 15 }) + two(
      box('Case escapes a case-sensitive regex', '<code>/x.PHP</code> and <code>/x.pHp</code> left the <code>~ \\.php</code> handler for location /. Use <code>~*</code> when the extension decides who handles it.', 'do2'),
      box('NUL byte ⇒ 400', '<code>/x.php%00.jpg</code> is refused by Nginx itself. <code>/x.php/them-duong-dan</code> still matches the regex — anchor with <code>$</code> if that matters.', 'lam')),
    en: '/x.PHP and /x.pHp escape the case-sensitive .php regex and land on the catch-all. /x.php followed by more path still matches the unanchored regex. And a NUL byte, %00, gets 400 from Nginx before any block runs.' },
  { t: 'Where each form lives', body: tn(O('bien'), { wrap: 110, fs: 15 }) + cmp(['Variable', 'Holds', 'Use it for'], [
      ['<code>$request_uri</code>', 'RAW bytes after the method, with query string', 'logs, signatures — attacker input'],
      ['<code>$uri</code>', 'normalised path, no query; CHANGES on internal redirects', 'matching, try_files'],
      ['<code>$args</code> / <code>$query_string</code>', 'everything after ?', 'never used for location matching'],
      ['<code>$request_filename</code>', 'the file Nginx will open, after root/alias', 'Lesson 2.4'],
    ]),
    en: 'Measured: one request; $uri is /cong-khai/x/A, normalised, while the access log and $request_uri keep the raw //x/%41?trang=2. $args holds the query, which never takes part in matching. $request_filename comes after root or alias.' },
  { t: 'The query string never takes part in matching', body: tn(O('query'), { fs: 17 }) + icards([
      ['filter', 'No location for ?x=1', 'A location simply cannot match a query parameter — surprising if you know application routers.'],
      ['map', 'Need that?', 'It is a job for <code>map</code> (Chapter 8) or for the application.'],
      ['search', 'Debug habit', 'Print the variable before editing config: a temporary <code>return 200 "$uri"</code>.'],
    ], 3),
    en: 'A request for /?quan-tri=1 matched location slash: the query never takes part. If routing on a parameter is needed, that is a job for map or for the application. And the habit: print the variable before changing configuration.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('$uri', 'normalised path used for matching'),
      kw('$request_uri', 'raw request target, query included'),
      kw('Normalisation', 'decode %XX, merge //, resolve . and ..'),
      kw('Case-sensitive', 'prefixes and ~; only ~* ignores case'),
      kw('--path-as-is', 'curl flag: send the path exactly as typed'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: $uri, $request_uri, normalisation, case sensitivity, and curl --path-as-is.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Send the eight spellings with ${c('curl --path-as-is')}`,
      `Print ${c('$uri')} and ${c('$request_uri')} side by side`,
      `Try ${c('/x.PHP')}; switch the regex to ${c('~*')}`,
      `Send ${c('/x.php%00.jpg')} and read the status`,
    ]), box('Keep these', `<ul><li>Matching sees the normalised $uri</li><li>Encoding and ../ cannot sneak past a block</li><li>…and a block cannot fence a subtree</li><li>Case is NOT normalised</li></ul>`, 'lam'), ''),
    en: 'Your turn: send the eight spellings, print the two variables, fix the case escape with ~*, and see the NUL byte refused. Keep: matching sees the normalised URI, and case is not normalised.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — Which location wins', bai: '2.2' }, S);
