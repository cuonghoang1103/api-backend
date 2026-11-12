/**
 * ngx-02-4 — Nginx · Chapter 2 · Lesson 2.4 "root and alias, and the missing slash that leaks files" (deck video + web, 12/11/2026). Bài web: nginx-2-4-root-va-alias.
 * Output THẬT (scratchpad/ngx/demo/n2-4.txt; nginx/1.24.0): $request_filename của root (có/không "/" cuối như nhau) vs alias (thiếu "/" ⇒ www2anh ⇒ 404);
 * location /tep + alias ⇒ /tep../bi-mat.txt ĐỌC ĐƯỢC tệp ngoài thư mục; vá /tep/ ⇒ không còn khớp; grep nginx -T tìm location thiếu "/" có alias; alias trong regex cần $1.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n2-4:setup": "",
 "n2-4:file:/tmp/ng/conf/root.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8080;\n    location /r1/ { root  /tmp/ng/www;   add_header X-File $request_filename always; }\n    location /r2/ { root  /tmp/ng/www/;  add_header X-File $request_filename always; }\n    location /a1/ { alias /tmp/ng/www2/; add_header X-File $request_filename always; }\n    location /a2/ { alias /tmp/ng/www2;  add_header X-File $request_filename always; }\n  }\n}\n",
 "n2-4:bonkhoi": "$ for u in /r1/anh/a.txt /r2/anh/a.txt /a1/anh/a.txt /a2/anh/a.txt; do printf '%-15s -> ' $u; curl -s -o /dev/null -D - \"http://127.0.0.1:8080$u\" | awk '/^HTTP/{c=$2} /^X-File/{f=$2} END{print c, f}'; done\n/r1/anh/a.txt   -> 200 /tmp/ng/www/r1/anh/a.txt\n/r2/anh/a.txt   -> 200 /tmp/ng/www/r2/anh/a.txt\n/a1/anh/a.txt   -> 200 /tmp/ng/www2/anh/a.txt\n/a2/anh/a.txt   -> 404 /tmp/ng/www2anh/a.txt",
 "n2-4:file:/tmp/ng/conf/ro.conf": "pid       /tmp/ng/logs/ro.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8081;\n    location /tep { alias /tmp/ng/kho/cong-khai/; }\n    location /    { return 200 \"khong khop khoi alias\\n\"; }\n  }\n}\n",
 "n2-4:ro": "=== location /tep  (THIEU dau / cuoi) ===\n$ for u in /tep/ok.txt /tep../bi-mat.txt /tep../../etc/hostname; do printf '%-24s -> ' $u; curl -s --path-as-is \"http://127.0.0.1:8081$u\"; done\n/tep/ok.txt              -> OK\n/tep../bi-mat.txt        -> BI-MAT: mat khau CSDL\n/tep../../etc/hostname   -> khong khop khoi alias\n=== SAU KHI VA: location /tep/  (CO dau / cuoi) ===\n$ for u in /tep/ok.txt /tep../bi-mat.txt; do printf '%-24s -> ' $u; curl -s --path-as-is \"http://127.0.0.1:8081$u\"; done\n/tep/ok.txt              -> OK\n/tep../bi-mat.txt        -> khong khop khoi alias",
 "n2-4:soi": "$ nginx -T -c /tmp/ng/conf/ro.conf 2>/dev/null | grep -nE 'location\\s+[^~=^ ]*[^/ ]\\s*\\{.*alias'\n$ cp /tmp/ng/conf/ro.conf /tmp/ng/conf/ro-sai.conf && sed -i 's#location /tep/ {#location /tep {#' /tmp/ng/conf/ro-sai.conf\n$ nginx -T -c /tmp/ng/conf/ro-sai.conf 2>/dev/null | grep -nE 'location\\s+[^~=^ ]*[^/ ]\\s*\\{.*alias'\n9:    location /tep { alias /tmp/ng/kho/cong-khai/; }",
 "n2-4:file:/tmp/ng/conf/rx.conf": "pid       /tmp/ng/logs/rx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8082;\n    location ~ ^/anh/(.+)$ { alias /tmp/ng/www2/anh/$1; }\n  }\n}\n",
 "n2-4:regex": "$ curl -s http://127.0.0.1:8082/anh/a.txt\nOK alias",
 "n2-4:file:/tmp/ng/conf/rx-sai.conf": "pid       /tmp/ng/logs/rxs.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8083;\n    location ~ ^/anh/ { alias /tmp/ng/www2/anh/; }\n  }\n}\n",
 "n2-4:rxsai": "$ for u in /anh/a.txt /anh/khac.txt; do printf '%-14s -> ' $u; curl -s -o /dev/null -w '%{http_code}\\n' \"http://127.0.0.1:8083$u\"; done\n/anh/a.txt     -> 404\n/anh/khac.txt  -> 404\n$ grep -o 'open() \"[^\"]*\" failed ([^)]*)' /tmp/ng/logs/error.log | tail -n 2\nopen() \"/tmp/ng/www2/anh/\" failed (2: No such file or directory)\nopen() \"/tmp/ng/www2/anh/\" failed (2: No such file or directory)"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, seq } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-02-4', code: 'NGX 2.4', title: 'root and alias, and the missing slash that leaks files', sub: 'Chapter 2 · Lesson 2.4' };
const O = (k) => { const v = DU_LIEU[`n2-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.replace(/^\$ for u in ([^;]*); do .*$/gm, (_, a) => `$ for u in ${a}; do curl --path-as-is …$u; done`).replace(/\/tmp\/ng\//g, '/srv/');

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.4', t: 'root and alias,<br>and the missing slash that leaks files', sub: 'Two directives that look interchangeable and are not: one APPENDS, the other REPLACES — and that difference is how a config serves files it was never meant to',
    en: 'Lesson 2.4. Once a block is chosen, something must turn the URI into a path on disk. root and alias look interchangeable and are not: one appends, the other replaces — and that is how a configuration ends up serving files it should not.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>root APPENDS the whole URI; alias REPLACES the matched part</li>
    <li>root forgives a trailing slash; alias does not — measured</li>
    <li>The most famous Nginx misconfiguration: one missing character</li>
    <li>Finding it in your own config with one grep</li>
    <li>alias in a regex location needs a capture</li></ul>`,
    en: 'Five takeaways: append versus replace; root forgiving a trailing slash while alias does not; the famous one-character file leak; a grep to find it; and alias inside a regex location.' },
  { t: 'The difference in one sentence', body: cmp(['', 'root', 'alias'], [
      ['Path on disk', '<b>root + $uri</b> — the whole URI is APPENDED', '<b>alias + (the part NOT matched)</b> — the matched prefix is REPLACED'],
      ['The location name', 'stays in the disk path', 'disappears from the disk path'],
      ['Requires', 'a real folder named like the URL under root', 'nothing — map a URL onto ANY folder'],
      ['Use it', 'by default', 'only when URL and folder names must differ'],
    ]) + two(ngc(`location /tinh/ { root /var/www; }
# GET /tinh/a.css → /var/www/tinh/a.css`, { sm: true }), ngc(`location /tai-lieu/ { alias /srv/docs/; }
# GET /tai-lieu/a.pdf → /srv/docs/a.pdf`, { sm: true })),
    en: 'root appends the whole URI to the folder, so the location name stays in the path. alias replaces the matched part, so the location name disappears. Prefer root; reach for alias only when the URL prefix and the folder name have to differ.' },
  { t: 'Measured: what path Nginx actually builds', body: ngc(O('file:/tmp/ng/conf/root.conf').split('\n').slice(7, 11).map((l) => l.trim().replace(/ add_header X-File \$request_filename always;/, '').replace(/\/tmp\/ng\//g, '/srv/')).join('\n'), { sm: true, hl: [4] }) +
    tn(bo(O('bonkhoi')).replace(/^\$ for u in ([^;]*); do .*$/m, (_, a) => `$ for u in ${a}; do curl …; done   # status + $request_filename`), { fs: 15 }) +
    box('root forgives the trailing slash; alias is a literal string replacement', 'Both roots built the same path. <code>alias /srv/www2</code> without the slash glued the pieces: <code>/srv/www2anh/a.txt</code> ⇒ 404.', 'do2'),
    en: 'Measured with $request_filename. Both root spellings, with or without a trailing slash, built the same path. alias with the slash worked; alias without it glued the pieces together — www2anh — and got 404. alias is a literal string replacement.' },
  { t: 'The missing slash that leaks files', body: two(ngc(`# WRONG — the location has no trailing /
location /tep { alias /srv/kho/cong-khai/; }

# on disk:
#   /srv/kho/bi-mat.txt        ← secret
#   /srv/kho/cong-khai/ok.txt  ← public`, { sm: true, hl: [2] }),
      seq(['client', 'nginx', 'disk'], [[0, 1, 'GET /tep../bi-mat.txt'], [1, 1, 'prefix /tep matches!', '#c0392b'], [1, 1, 'drop "/tep" → "../bi-mat.txt"', '#c0392b'], [1, 2, '/srv/kho/cong-khai/../bi-mat.txt', '#c0392b'], [2, 0, '200 — the secret', '#c0392b', true]], { w: 560, rh: 46, fs: 15 })) +
    tn(bo(O('ro')).split('=== SAU')[0].trim(), { fs: 14 }),
    en: 'The famous misconfiguration. location /tep without a trailing slash, alias to the public folder. /tep is a prefix, and a prefix does not stop at a slash, so it matches /tep../bi-mat.txt. alias drops /tep, appends ../bi-mat.txt, and the file one level up is served: the secret.' },
  { t: 'Why it works — and the one-character fix', body: icards([
      ['filter', 'Prefixes are characters', '"/tep" matches "/tep.." too — Lesson 2.1.'],
      ['cut', 'alias cuts and pastes text', 'It removes the matched part and glues the rest on — "../" included.'],
      ['shield', 'A real ".." segment is resolved', '/tep../../etc/hostname did NOT match: only the glued form escapes.'],
    ], 3) + ngc(`# RIGHT — both sides end with /
location /tep/ { alias /srv/kho/cong-khai/; }
# often better: rename the folder and use root, no replacement at all
location /tep/ { root /srv/kho/cong-khai-goc; }`, { hl: [2] }) +
    box('After the fix', '<code>/tep../bi-mat.txt</code> no longer matches the alias block at all (measured).', 'xanh'),
    en: 'Why it works: prefixes are characters, alias cuts and pastes text, and normalisation only resolves real dot-dot segments, not the glued form. The fix is one character: end both the location and the alias with a slash — or rename the folder and use root.' },
  { t: 'Check your own config in one grep', body: ngc(`# every non-regex location WITHOUT a trailing / that uses alias
nginx -T 2>/dev/null | grep -nE 'location\\s+[^~=^ ]*[^/ ]\\s*\\{.*alias'`) +
    tn(bo(O('soi')).replace(/\/srv\/conf\//g, ''), { fs: 15 }) +
    box('Empty output = clean', 'The fixed config prints nothing; the broken copy prints line 9. Multi-line blocks need a second look, but this catches the one-liners.', 'lam'),
    en: 'Check your own configuration with one grep over nginx -T: every non-regex location without a trailing slash that uses alias. The fixed config prints nothing; the broken copy prints the offending line.' },
  { t: 'alias inside a regex location needs a capture', body: two(ngc(O('file:/tmp/ng/conf/rx.conf').split('\n').slice(7, 8).map((l) => l.trim().replace(/\/tmp\/ng\//g, '/srv/')).join('\n'), { sm: true }), tn(O('regex'), { fs: 15 })) +
    two(ngc(O('file:/tmp/ng/conf/rx-sai.conf').split('\n').slice(7, 8).map((l) => '# WRONG — no capture\n' + l.trim().replace(/\/tmp\/ng\//g, '/srv/')).join('\n'), { sm: true }),
      tn(bo(O('rxsai')).replace(/\/tmp\/ng\//g, '/srv/').replace(/^\$ for u in ([^;]*);.*$/m, (_, a) => `$ for u in ${a}; do curl …$u; done`).replace(/^\$ grep .*$/m, '$ grep open() error.log'), { fs: 14, wrap: 52 })) +
    box('No "matched part" to drop in a regex', 'Without <code>$1</code> every URL opens the alias path ITSELF — measured: both files 404, and error.log shows the same folder twice. Rebuild the path with a capture, or ask whether a plain prefix with root would do.', 'lam'),
    en: 'In a regex location there is no literal matched part to drop, so alias must rebuild the path from a capture: alias /srv/www2/anh/$1. When you write this, check whether a plain prefix with root would be simpler.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('root', 'appends the whole URI to a folder'),
      kw('alias', 'replaces the matched prefix with a folder'),
      kw('$request_filename', 'the disk path Nginx will open'),
      kw('$document_root', 'the root in effect for the request'),
      kw('alias traversal', '/tep../x via a location without trailing /'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: root, alias, $request_filename, $document_root, and the alias traversal through a location without a trailing slash.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Print ${c('$request_filename')} for root and alias, with and without /`,
      `Build ${c('location /tep')} + alias; fetch ${c('/tep../bi-mat.txt')}`,
      `Fix it with ${c('/tep/')}; fetch again`,
      `Run the grep over ${c('nginx -T')} on your own server`,
      `Run ${c('nginx -T')} and list every alias: could each one be a root?`,
    ]), box('Keep these', `<ul><li>root appends, alias replaces</li><li>Prefer root</li><li>alias: slash on BOTH sides</li><li>Grep for it</li></ul>`, 'lam'), ''),
    en: 'Your turn: print the built paths, reproduce the leak, fix it with a trailing slash, and run the grep on your own server.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — Which location wins', bai: '2.4' }, S);
