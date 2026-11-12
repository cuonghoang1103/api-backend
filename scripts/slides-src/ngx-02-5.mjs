/**
 * ngx-02-5 — Nginx · Chapter 2 · Lesson 2.5 "try_files, and the internal redirect that runs everything again" (deck video + web, 12/11/2026). Bài web: nginx-2-5-try-files-chuyen-huong-noi-bo.
 * Output THẬT (scratchpad/ngx/demo/n2-5.txt; nginx/1.24.0): SPA ⇒ index; =404 + error_page ⇒ khối /loi-404 chạy, mã vẫn 404; dự phòng /dich-cuoi ⇒ khớp lại, $uri đổi,
 * $request_uri giữ; index ⇒ khối = /thu-muc/index.html; vòng lặp ⇒ 500 + "rewrite or internal redirection cycle"; internal; ⇒ 404 khi gọi thẳng.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n2-5:setup": "",
 "n2-5:file:/tmp/ng/conf/try.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  root /tmp/ng/www;\n  server {\n    listen 8080;\n    location /spa/     { try_files $uri $uri/ /index.html; }\n    location /chat/    { try_files $uri =404; error_page 404 /loi-404; }\n    location /di-vong/ { try_files $uri /dich-cuoi; }\n    location /dich-cuoi { return 200 \"DA CHAY LAI KHOP LOCATION: uri=[$uri] request_uri=[$request_uri]\\n\"; }\n    location = /thu-muc/index.html { return 200 \"DA VAO KHOI = /thu-muc/index.html, uri=[$uri]\\n\"; }\n    location = /loi-404 { return 200 \"KHOI error_page: uri=[$uri]\\n\"; }\n    location /vong-lap/ { try_files $uri /vong-lap/khong-bao-gio-co.html; }\n    location /noi-bo/ { internal; return 200 \"chi cho chuyen huong noi bo\\n\"; }\n  }\n}\n",
 "n2-5:tryfiles": "=== A: du phong la mot URI ===\n$ for u in /spa/khong-co-gi /spa/sau/nua/nua; do printf '%-20s -> ' $u; curl -s -w ' [%{http_code}]\\n' \"http://127.0.0.1:8080$u\" | tr -d '\\n'; echo; done\n/spa/khong-co-gi     -> INDEX SPA [200]\n/spa/sau/nua/nua     -> INDEX SPA [200]\n=== B: du phong la =404 (kem error_page 404 /loi-404) ===\n$ curl -s -w ' [%{http_code}]\\n' http://127.0.0.1:8080/chat/khong-co\nKHOI error_page: uri=[/loi-404]\n [404]\n=== C: du phong tro toi mot location KHAC ===\n$ curl -s http://127.0.0.1:8080/di-vong/khong-co\nDA CHAY LAI KHOP LOCATION: uri=[/dich-cuoi] request_uri=[/di-vong/khong-co]",
 "n2-5:index": "$ curl -s http://127.0.0.1:8080/thu-muc/\nDA VAO KHOI = /thu-muc/index.html, uri=[/thu-muc/index.html]",
 "n2-5:vonglap": "$ curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/vong-lap/x\n500\n$ grep -o 'rewrite or internal redirection cycle[^,]*' /tmp/ng/logs/error.log | tail -n 1\nrewrite or internal redirection cycle while internally redirecting to \"/vong-lap/khong-bao-gio-co.html\"",
 "n2-5:internal": "$ curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/noi-bo/x\n404"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, tiers, icards, cmp, box, two, steps, kw, c, seq } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-02-5', code: 'NGX 2.5', title: 'try_files, and the internal redirect that runs everything again', sub: 'Chapter 2 · Lesson 2.5' };
const O = (k) => { const v = DU_LIEU[`n2-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const CONF = () => O('file:/tmp/ng/conf/try.conf').split('\n');

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.5', t: 'try_files, and the internal redirect<br>that runs everything again', sub: 'Choosing a location is not always ONE decision: three ordinary directives rewrite $uri mid-request and send matching back to step one',
    en: 'Lesson 2.5. So far choosing a location looked like one decision. It is not always: three ordinary directives can rewrite $uri in the middle of a request and send the whole matching algorithm back to step one.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>try_files, in the exact order it tries</li>
    <li>The last argument is special: a URI or a code</li>
    <li>Internal redirects re-run location matching — measured</li>
    <li>index and error_page do the same</li>
    <li>Building a redirect loop on purpose — and avoiding it</li></ul>`,
    en: 'Five takeaways: how try_files walks its arguments; why the last one is special; internal redirects that re-run matching; index and error_page doing the same; and a deliberate redirect loop.' },
  { t: 'try_files, in the order it tries', body: ngc(CONF().slice(10, 14).map((l) => l.trim()).join('\n'), { sm: true }) +
    tn(O('tryfiles'), { wrap: 110, fs: 14 }),
    en: 'Three uses measured. A, an SPA: any missing path under /spa/ falls back to /index.html. B, =404: the request ends right there — here an error_page then runs. C, a fallback to another location: the /dich-cuoi block ran, with a new $uri.' },
  { t: 'Four rules', body: tiers([
      ['list', '1 · Arguments are tried LEFT to RIGHT', '$uri = that file · $uri/ = a folder of that name · first that EXISTS is served', '#2563eb'],
      ['warn', '2 · The LAST argument is not tried — it is USED', '=404 ⇒ end with that code · a URI ⇒ internal redirect', '#c0392b'],
      ['loop', '3 · An internal redirect RESETS $uri and RE-MATCHES', 'the five steps of 2.1 run again — another block may win', '#7c3aed'],
      ['cut', '4 · Ten of them and Nginx gives up', '500 + one line in error.log', '#b85a2b'],
    ], { th: 70, gap: 20 }),
    en: 'Four rules. Arguments are tried left to right; the first one that exists is served. The last argument is not tried but used: a code ends the request, a URI triggers an internal redirect. That redirect resets $uri and re-runs matching. And after ten of them Nginx gives up with a 500.' },
  { t: 'Row C: a different block ran', body: seq(['client', 'location /di-vong/', 'location /dich-cuoi'], [
      [0, 1, 'GET /di-vong/khong-co'], [1, 1, 'try_files: $uri missing', '#7c3aed'], [1, 1, 'last arg ⇒ $uri = /dich-cuoi, MATCH AGAIN', '#7c3aed'],
      [1, 2, 'internal redirect (no 3xx, no new request)', '#7c3aed', true], [2, 0, '200 uri=[/dich-cuoi] request_uri=[/di-vong/khong-co]', '#2f9d58']], { rh: 50, fs: 17 }) +
    box('$request_uri NEVER changes', 'It keeps what the client sent through every internal redirect — the right variable for logs, rate-limit keys and signatures; the wrong one for routing decisions after a redirect.', 'lam'),
    en: 'Row C in slow motion. The file is missing, so the last argument sets $uri to /dich-cuoi and matching runs again. A different block answers — no 3xx, no new request. $request_uri still holds the original path.' },
  { t: 'index and error_page redirect internally too', body: tn([O('index'), O('tryfiles').split('\n').slice(4, 7).join('\n')].join('\n'), { wrap: 110, fs: 15 }) + two(
      box('index rewrites the URI before serving', 'The separate block <code>= /thu-muc/index.html</code> fired: index set $uri to the index file and matched again.', 'lam'),
      box('error_page keeps the original status', 'The handler returned 200, the client still got 404. Write <code>error_page 404 =200 /loi-404;</code> to change it — the = is a different statement.', 'lam')),
    en: 'index and error_page do the same. /thu-muc/ reached a separate exact block for its index.html. And error_page 404 ran its own block, but the status stayed 404 — use the equals form to change it.' },
  { t: 'Building the loop on purpose', body: ngc(CONF().filter((l) => /vong-lap/.test(l)).map((l) => l.trim()).join('\n'), { sm: true }) +
    tn(O('vonglap'), { wrap: 110, fs: 15 }) +
    box('A 500 with no application involved', 'The fallback URI falls into the SAME block, which tries again, and again. The fallback must be served by a block that cannot send it back.', 'do2') +
    two(box('Not a hang, not a crash', 'Nginx counts internal redirects and gives up after 10 — the request ends at once with 500.', 'lam'),
      box('Found in one grep', 'Search error.log for <code>redirection cycle</code>: the line names the URI that looped.', 'lam')),
    en: 'A loop built on purpose: the fallback points to a file that does not exist, under the same location. It redirects into itself until Nginx gives up: 500, and one line in the error log about an internal redirection cycle.' },
  { t: 'Safe patterns', body: two(ngc(`# fallback into a block that cannot come back
location /spa/ { try_files $uri $uri/ /spa-index; }
location = /spa-index {
  root /srv/spa;
  try_files /index.html =404;   # else a REAL 404
}`, { sm: true }), ngc(`# reachable only through internal redirects
location /noi-bo/ {
  internal;
  return 200 "only for internal redirects";
}`, { sm: true })) + tn(O('internal'), { fs: 15 }) +
    cmp(['Fallback', 'Effect'], [['<code>=404</code>', 'stops immediately — cheapest, honest status'], ['<code>/some-uri</code>', 'internal redirect — must land somewhere that cannot loop'], ['<code>@name</code>', 'a named location: no request can match it, only try_files / error_page reach it']]) +
    box('Rule of thumb', 'The last argument of try_files must never lead back into the same try_files.', 'xanh'),
    en: 'Safe patterns: send the fallback into a block that cannot return to the same try_files, and finish it with a real =404. Mark helper blocks internal: a direct request to /noi-bo/ got 404.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('try_files', 'test files left to right; the last argument is used, not tested'),
      kw('Internal redirect', 'change $uri and re-run location matching, no 3xx'),
      kw('=404', 'end the request with that code, here'),
      kw('error_page', 'internal redirect on a status; keeps it unless =code'),
      kw('internal;', 'block reachable only through internal redirects'),
      kw('redirection cycle', '10 internal redirects ⇒ 500'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: try_files, internal redirect, =404, error_page, internal, and the redirection cycle limit.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build the SPA fallback and the ${c('=404')} block; curl both`,
      `Print ${c('$uri')} and ${c('$request_uri')} after a fallback`,
      `Build the loop; find the line in ${c('error.log')}`,
      `Mark a block ${c('internal;')} and call it directly`,
    ]), box('Keep these', `<ul><li>Matching happens per internal redirect</li><li>The last try_files argument is used</li><li>Prefer =404 when nothing sensible exists</li><li>Never fall back into yourself</li></ul>`, 'lam'), ''),
    en: 'Your turn: build both fallbacks, print the two variables, reproduce the loop and find it in the log, and test an internal block. Keep: matching runs once per internal redirect.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — Which location wins', bai: '2.5' }, S);
