/**
 * ngx-08-4 — Nginx · Chapter 8 · Lesson 8.4 "return, error_page, and the blocks nobody can call" (deck video + web, 13/11/2026).
 * Bài web: nginx-8-4-return-error-page. Output THẬT (scratchpad/ngx/demo/n8-4.txt; nginx/1.24.0):
 * error_page 404 /trang-loi ⇒ 404 · "=" ⇒ 200 · "=200" ⇒ 200 (cùng thân uri=[/trang-loi]) · internal gọi thẳng ⇒ 404, qua error_page ⇒ 200 ·
 * @du-phong ⇒ uri=[/goi-ten/x] (không đổi) · @json trả 404 ⇒ 404; @json trả 200 ⇒ 200 (BẪY) · X-Accel-Redirect: không quyền 403, có quyền 200 + nội dung,
 * gọi thẳng /tep-rieng/ ⇒ 404 · return 204 · return "$remote_addr" ⇒ text/plain · /health ⇒ 200 ok.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n8-4:file:/root/kiem-quyen.js": "// upstream (cổng 9801): ?ok=1 ⇒ thân RỖNG + X-Accel-Redirect (nginx gửi tệp); không ⇒ 403\nrequire('http').createServer((req, res) => {\n  if (req.url.includes('ok=1')) { res.writeHead(200, { 'X-Accel-Redirect': '/tep-rieng/hop-dong.pdf' }); return res.end(); }\n  res.writeHead(403); res.end('khong co quyen\\n');\n}).listen(9801, '127.0.0.1');\n",
 "n8-4:file:/tmp/ng/conf/loi.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8080;\n    location = /trang-loi { return 200 \"TRANG LOI: uri=[$uri]\\n\"; }\n    location /loi-giu/ { error_page 404      /trang-loi; return 404; }   # không dấu =\n    location /loi-doi/ { error_page 404 =    /trang-loi; return 404; }   # dấu = trần\n    location /loi-200/ { error_page 404 =200 /trang-loi; return 404; }   # =200 tường minh\n    location /noi-bo   { internal; return 200 \"noi bo\\n\"; }\n    location /thu-noi-bo/ { error_page 404 = /noi-bo; return 404; }\n    location /goi-ten/ { try_files /khong-co-dau @du-phong; }\n    location @du-phong { return 200 \"DA VAO @du-phong: uri=[$uri]\\n\"; }\n    location /api-dung/ { error_page 404 = @json_404;  return 404; }\n    location @json_404  { default_type application/json; return 404 '{\"loi\":\"khong tim thay\"}\\n'; }\n    location /api-sai/  { error_page 404 = @json_sai;  return 404; }\n    location @json_sai  { default_type application/json; return 200 '{\"loi\":\"khong tim thay\"}\\n'; }   # BẪY\n    location /tai/      { proxy_pass http://127.0.0.1:9801; }               # ứng dụng kiểm quyền\n    location /tep-rieng/ { internal; alias /tmp/ng/rieng-tu/; }\n    location = /ghi     { return 204; }\n    location = /ip      { return 200 \"$remote_addr\\n\"; }\n    location = /health  { access_log off; return 200 \"ok\\n\"; }\n  }\n}\n",
 "n8-4:setup": "",
 "n8-4:baciach": "$ for p in loi-giu loi-doi loi-200; do printf '/%s/ -> ma=' $p; curl -s -w '%{http_code}' -o /tmp/than \"http://127.0.0.1:8080/$p/x\"; printf '   %s' \"$(cat /tmp/than)\"; echo; done\n/loi-giu/ -> ma=404   TRANG LOI: uri=[/trang-loi]\n/loi-doi/ -> ma=200   TRANG LOI: uri=[/trang-loi]\n/loi-200/ -> ma=200   TRANG LOI: uri=[/trang-loi]",
 "n8-4:noibo": "$ printf 'goi THANG /noi-bo              -> '; curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/noi-bo\ngoi THANG /noi-bo              -> 404\n$ printf 'qua error_page tu /thu-noi-bo/ -> '; curl -s -w '%{http_code}  ' -o /tmp/than http://127.0.0.1:8080/thu-noi-bo/x; cat /tmp/than\nqua error_page tu /thu-noi-bo/ -> 200  noi bo\n$ printf '/goi-ten/x -> '; curl -s -w '%{http_code}  ' -o /tmp/than http://127.0.0.1:8080/goi-ten/x; cat /tmp/than\n/goi-ten/x -> 200  DA VAO @du-phong: uri=[/goi-ten/x]",
 "n8-4:json": "$ for p in api-dung api-sai; do printf '/%s/x -> ma=' $p; curl -s -w '%{http_code}' -o /tmp/than \"http://127.0.0.1:8080/$p/x\"; printf '   %s' \"$(cat /tmp/than)\"; echo; done\n/api-dung/x -> ma=404   {\"loi\":\"khong tim thay\"}\n/api-sai/x -> ma=200   {\"loi\":\"khong tim thay\"}",
 "n8-4:accel": "$ printf 'KHONG quyen         -> '; curl -s -w '%{http_code}  ' -o /tmp/than 'http://127.0.0.1:8080/tai/hop-dong'; cat /tmp/than\nKHONG quyen         -> 403  khong co quyen\n$ printf 'CO quyen (?ok=1)    -> '; curl -s -w '%{http_code}  ' -o /tmp/than 'http://127.0.0.1:8080/tai/hop-dong?ok=1'; cat /tmp/than\nCO quyen (?ok=1)    -> 200  NOI DUNG HOP DONG (tep rieng tu)\n$ printf 'goi THANG /tep-rieng/hop-dong.pdf -> '; curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/tep-rieng/hop-dong.pdf\ngoi THANG /tep-rieng/hop-dong.pdf -> 404",
 "n8-4:return": "$ for p in ghi ip health; do printf '/%-7s -> ' $p; curl -s -w '%{http_code} %{content_type}  ' -o /tmp/than http://127.0.0.1:8080/$p; cat /tmp/than; echo; done\n/ghi     -> 204   \n/ip      -> 200 text/plain  127.0.0.1\n\n/health  -> 200 text/plain  ok"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, seq } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-08-4', code: 'NGX 8.4', title: 'return, error_page, and the blocks nobody can call', sub: 'Chapter 8 · Lesson 8.4' };
const O = (k) => { const v = DU_LIEU[`n8-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const KQ = (k) => O(k).split('\n').filter((l) => !l.startsWith('$ ')).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 8 · Lesson 8.4', t: 'return, error_page,<br>and the blocks nobody can call', sub: 'Responses made by the config itself — and a status code that depends on one equals sign',
    en: 'Lesson 8.4. Not every response comes from a file or an upstream. Some are produced by the configuration itself, and the directives that do it have exact behaviour that a quick read gets wrong — starting with a status code that depends on one equals sign.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>error_page</code> three ways: keep, take, or set the code</li>
    <li><code>internal</code>, and named locations that keep <code>$uri</code></li>
    <li>X-Accel-Redirect: the app checks, nginx sends the bytes</li>
    <li>The bare = trap that turns every 404 into 200</li>
    <li><code>return</code>, and when it is enough</li></ul>`,
    en: 'Five takeaways: error page three ways; internal and named locations; X Accel Redirect; the bare equals trap; and return, with when it is enough.' },
  { t: 'error_page, three ways', body: ngc(`location = /trang-loi { return 200 "TRANG LOI: uri=[$uri]\\n"; }
location /loi-giu/ { error_page 404      /trang-loi; return 404; }   # no =
location /loi-doi/ { error_page 404 =    /trang-loi; return 404; }   # bare =
location /loi-200/ { error_page 404 =200 /trang-loi; return 404; }   # =200`, { hl: [2, 3, 4] }) + tn(KQ('baciach'), { fs: 17, wrap: 110 }) + cmp(['Form', 'Final code', 'Use it when'], [
      ['error_page 404 /page', 'the ORIGINAL (404)', 'a real error page — honest status, not indexed'],
      ['error_page 404 = /page', 'the HANDLER\'s (200)', 'rarely: "not found" really is a valid empty result'],
      ['error_page 404 =NNN /page', 'NNN, explicitly', 'you mean it: 403 =404 hides that something exists'],
    ], { hl: [1] }),
    en: 'Error page three ways. The same page, three spellings, two different codes. No equals sign keeps the original four oh four. A bare equals sign takes the handler\'s code: two hundred — a soft four oh four that gets missing pages indexed. Equals followed by a number sets it explicitly.' },
  { t: 'Why the page prints its own $uri', body: icards([
      ['loop', 'An error page is an internal redirect (2.5)', '$uri becomes the error page\'s path and location matching runs again — another block answers'],
      ['check', 'No = keeps the honest code', 'search engines and clients both see a real miss'],
      ['warn', 'Bare = is a soft 404', 'the handler returned 200, so the client got 200 for a page that does not exist'],
      ['flag', '=NNN when you mean a different code', 'error_page 403 =404 /404.html; hides that something exists'],
    ], 2),
    en: 'Why the page printed slash trang loi rather than the original path: an error page is an internal redirect, the mechanism of lesson two point five. The URI changes and location matching runs again. Keep the honest code without an equals sign; use equals a number only when you mean a different code.' },
  { t: 'Blocks reachable only from inside', body: ngc(`location /noi-bo { internal; return 200 "noi bo\\n"; }
location /thu-noi-bo/ { error_page 404 = /noi-bo; return 404; }

location /goi-ten/ { try_files /khong-co-dau @du-phong; }
location @du-phong { return 200 "DA VAO @du-phong: uri=[$uri]\\n"; }`, { sm: true, hl: [1, 5] }) + tn(KQ('noibo'), { fs: 16, wrap: 110 }) + icards([
      ['lock', 'internal: a direct request gets 404', 'still answers internal redirects — error_page, try_files, X-Accel-Redirect, rewrite … last'],
      ['key', 'A named location keeps $uri', 'the fallback still sees what was asked: /goi-ten/x — a path fallback would have overwritten it'],
      ['link', 'A named location has no URL', '/@du-phong is just an ordinary path — @name exists only as a target for try_files, error_page, proxy_next_upstream'],
    ], 3),
    en: 'Blocks reachable only from inside. Internal turns a direct request into four oh four — measured — while the same block still answered through error page. A named location kept the URI: the fallback saw slash goi ten slash x, what was really asked. And a named location has no URL at all.' },
  { t: 'X-Accel-Redirect: the app checks, nginx sends', body: seq(['client', 'nginx', 'app (checks access)', 'disk'], [
      [0, 1, 'GET /tai/hop-dong?ok=1'], [1, 2, 'proxy_pass'], [2, 1, 'EMPTY body + X-Accel-Redirect: /tep-rieng/hop-dong.pdf', '#009639'],
      [1, 3, 'internal location /tep-rieng/ (alias)'], [3, 1, 'the file bytes', '#64748b', true], [1, 0, '200 + file — the app never streamed a byte', '#009639'],
    ], { w: 1110, rh: 48, fs: 17 }) + tn(KQ('accel'), { fs: 16, wrap: 110 }),
    en: 'X Accel Redirect. The application checks access, then returns an empty response with the header X Accel Redirect naming a path. Nginx serves the file from an internal location. Measured: without permission, four oh three from the app; with it, two hundred and the file; and calling the private path directly, four oh four. The app never streams a byte, and the file has no public URL.' },
  { t: 'The bare = trap', body: ngc(`location /api-dung/ { error_page 404 = @json_404; return 404; }
location @json_404 {
  default_type application/json;
  return 404 '{"loi":"khong tim thay"}';   # handler says 404
}
location /api-sai/ { error_page 404 = @json_sai; return 404; }
location @json_sai {
  default_type application/json;
  return 200 '{"loi":"khong tim thay"}';   # handler says 200 !
}`, { sm: true, hl: [4, 9] }) + tn(KQ('json'), { fs: 17, wrap: 110 }) +
    box('Every 404 on your API becomes a 200 with an error body', 'Bare = takes the HANDLER\'s code. Client libraries do not treat a 200 as an error, so failures become silent empty results. Want the handler\'s code? Say so with bare =, on purpose. Want the original? Drop the = entirely.', 'do2'),
    en: 'The trap. With a bare equals sign the code comes from the handler. A JSON handler ending in return four oh four is fine; the same handler ending in return two hundred turned the miss into a two hundred with an error body — measured. Client libraries will not treat it as an error.' },
  { t: 'return, and when it is enough', body: tn(KQ('return'), { fs: 17, wrap: 110 }) + icards([
      ['bolt', 'return CODE', 'return 204 for a beacon, 444 to close without answering (1.3), 403 for a blocked path — no file, no upstream'],
      ['type', 'return CODE "text"', 'variables are interpolated: an echo endpoint in one line — set default_type, or it is text/plain'],
      ['link', 'return 3xx URL', 'the redirect form — prefer it to rewrite … permanent for FIXED targets (8.1)'],
      ['pulse', '/health as a return', 'never touches the app — alive while the app restarts: decide whether that is what you want'],
    ], 2),
    en: 'Return. A two oh four with no body; an echo of the client address, announced as text plain; a health check that never touches the app. Return a code, a code with text, or a three hundred code with a URL. A health check built from return stays alive while the app restarts — decide whether that is what you want.' },
  { t: 'Patterns for production', body: ngc(`# Private files: the app checks access, nginx sends the bytes
location /tep-rieng/ {
  internal;                       # direct request ⇒ 404
  alias /srv/rieng-tu/;
}

# Error pages: keep the code, and do not expose the pages
error_page 404 /404.html;
error_page 500 502 503 504 /50x.html;
location = /404.html { internal; root /srv/loi; }
location = /50x.html { internal; root /srv/loi; }

# APIs: JSON errors, not HTML (7.4) — the handler returns 404 itself
error_page 404 = @json_404;
location @json_404 { default_type application/json; return 404 '{"loi":"khong tim thay"}'; }`, { hl: [3, 8, 10, 15] }),
    en: 'Patterns for production. Private files behind an internal location, served with X Accel Redirect. Error pages that keep the code and are themselves internal. And JSON errors for an API, where the handler returns four oh four itself.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('return', 'answer from config alone'),
      kw('error_page', 'map a code to a page'),
      kw('bare =', 'take the handler\'s code'),
      kw('internal', 'direct request ⇒ 404'),
      kw('named location', '@name, keeps $uri, no URL'),
      kw('X-Accel-Redirect', 'app checks, nginx sends'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: return, error page, the bare equals sign, internal, named location, and X Accel Redirect.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Three ${c('error_page 404')} spellings — read the codes`,
      `An ${c('internal')} block: direct vs. through error_page`,
      `try_files into ${c('@du-phong')} — print $uri`,
      'A tiny app that returns X-Accel-Redirect',
      `A JSON handler that returns 200 behind ${c('=')} — see the trap`,
    ]), box('Keep these', `<ul><li>No = keeps the code</li><li>Bare = takes the handler's</li><li>internal ⇒ 404 from outside</li><li>@name keeps $uri</li></ul>`, 'lam'), ''),
    en: 'Your turn: three error page spellings; an internal block; a named fallback printing the URI; an app returning X Accel Redirect; and the JSON handler trap. Keep: no equals keeps the code; a bare equals takes the handler\'s; internal is four oh four from outside; a named location keeps the URI.' },
];
export const slides = lamDeck({ chuong: 'Chapter 8 — Rewrite, map, and the directives to avoid', bai: '8.4' }, S);
