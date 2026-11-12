/**
 * ngx-03-1 — Nginx · Chapter 3 · Lesson 3.1 "proxy_pass, and the slash that rewrites the path" (deck video + web, 12/11/2026). Bài web: nginx-3-1-proxy-pass.
 * Output THẬT (scratchpad/ngx/demo/n3-1.txt; nginx/1.24.0, upstream vọng lại vong.js :9101): /a ⇒ nguyên vẹn, /b/ ⇒ cắt, /c/ ⇒ /khac/, /d ⇒ /xxx;
 * location /e + proxy_pass …/ ⇒ "//nguoi/1" và /enguoi ⇒ /nguoi; regex + $1; rewrite … break thắng đường dẫn proxy_pass; proxy_pass có URI trong regex ⇒ lỗi.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n3-1:file:/root/vong.js": "// upstream \"vọng lại\": in đúng cái nó nhận — dòng request và mọi header — để thấy proxy đã gửi gì\nrequire('http').createServer((req, res) => {\n  const h = Object.entries(req.headers).map(([k, v]) => `${k}: ${v}`).join('\\n');\n  res.setHeader('Content-Type', 'text/plain');\n  res.end(`${req.method} ${req.url} HTTP/${req.httpVersion}\\n${h}\\n`);\n}).listen(9101, '127.0.0.1');\n",
 "n3-1:setup": "",
 "n3-1:file:/tmp/ng/conf/pass.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8092;\n    location /a/ { proxy_pass http://127.0.0.1:9101; }\n    location /b/ { proxy_pass http://127.0.0.1:9101/; }\n    location /c/ { proxy_pass http://127.0.0.1:9101/khac/; }\n    location /d  { proxy_pass http://127.0.0.1:9101/xxx; }\n    location /e  { proxy_pass http://127.0.0.1:9101/; }\n    location ~ ^/anh/(.+)$ { proxy_pass http://127.0.0.1:9101/media/$1; }\n    location /cu/ {\n      rewrite ^/cu/(.*)$ /moi/$1 break;\n      proxy_pass http://127.0.0.1:9101/khong-dung-toi/;\n    }\n  }\n}\n",
 "n3-1:boncach": "$ for p in /a/nguoi/1 /b/nguoi/1 /c/nguoi/1 /d/nguoi/1; do printf '%-12s -> upstream nhan: ' $p; curl -s \"http://127.0.0.1:8092$p\" | head -n 1; done\n/a/nguoi/1   -> upstream nhan: GET /a/nguoi/1 HTTP/1.0\n/b/nguoi/1   -> upstream nhan: GET /nguoi/1 HTTP/1.0\n/c/nguoi/1   -> upstream nhan: GET /khac/nguoi/1 HTTP/1.0\n/d/nguoi/1   -> upstream nhan: GET /xxx/nguoi/1 HTTP/1.0",
 "n3-1:lech": "$ for p in /e/nguoi/1 /enguoi /anh/a.png /cu/x?y=1; do printf '%-12s -> upstream nhan: ' $p; curl -s \"http://127.0.0.1:8092$p\" | head -n 1; done\n/e/nguoi/1   -> upstream nhan: GET //nguoi/1 HTTP/1.0\n/enguoi      -> upstream nhan: GET /nguoi HTTP/1.0\n/anh/a.png   -> upstream nhan: GET /media/a.png HTTP/1.0\n/cu/x?y=1    -> upstream nhan: GET /moi/x?y=1 HTTP/1.0",
 "n3-1:file:/tmp/ng/conf/rx-sai.conf": "events {}\nhttp { server { listen 8093; location ~ ^/anh/ { proxy_pass http://127.0.0.1:9101/media/; } } }\n",
 "n3-1:regexloi": "$ nginx -t -c /tmp/ng/conf/rx-sai.conf\n2026/11/12 12:46:04 [emerg] 3626#3626: \"proxy_pass\" cannot have URI part in location given by regular expression, or inside named location, or inside \"if\" statement, or inside \"limit_except\" block in /tmp/ng/conf/rx-sai.conf:2\nnginx: configuration file /tmp/ng/conf/rx-sai.conf test failed"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, js, icards, cmp, box, two, steps, kw, c, seq } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-03-1', code: 'NGX 3.1', title: 'proxy_pass, and the slash that rewrites the path', sub: 'Chapter 3 · Lesson 3.1' };
const O = (k) => { const v = DU_LIEU[`n3-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const vong = (s) => s.replace(/^\$ for p in ([^;]*); do .*$/m, (_, a) => `$ for p in ${a}; do curl -s "localhost:8092$p" | head -1; done`);
const CONF = () => O('file:/tmp/ng/conf/pass.conf').split('\n').filter((l) => /location|rewrite|proxy_pass/.test(l)).map((l) => l.trim());

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.1', t: 'proxy_pass,<br>and the slash that rewrites the path', sub: 'One core job — take the request and replay it to something else — and one rule that hangs on whether the URL you wrote HAS a path',
    en: 'Chapter 3, lesson 3.1. A reverse proxy has one core job: replay the request it received to something else. proxy_pass does that, and the most important thing about it is one rule that depends on whether the URL you wrote has a path.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Four spellings, and exactly what the upstream receives</li>
    <li>No path ⇒ the URI goes as is; a path ⇒ it REPLACES the matched prefix</li>
    <li>The slash pair that must match — and what happens when it does not</li>
    <li>Regex locations and rewrite: when the rule stops applying</li>
    <li>How to check any proxy in one command</li></ul>`,
    en: 'Five takeaways: four spellings measured; the pass-through versus replace rule; matching slashes; regex and rewrite cases; and a one-command check.' },
  { t: 'An upstream that echoes what it receives', body: js(O('file:/root/vong.js'), { sm: true }) +
    box('Measure, do not guess', 'Point the proxy at something that prints the request line it got. Every row in this lesson is what Node printed.', 'lam') + two(
      box('Line 1 = the request line Nginx built', 'method, path, HTTP version — then every header, one per line. Lesson 3.2 reads those headers.', 'xanh'),
      box('Why not just read the access log?', '<code>$request</code> in the access log is what the CLIENT sent — not what went upstream. Only the upstream can tell you that.', '')),
    en: 'The measuring tool: a tiny Node server on port 9101 that prints the request line and every header it receives. Whatever it prints is exactly what Nginx sent.' },
  { t: 'Four spellings, measured', body: ngc(CONF().slice(0, 4).join('\n'), { sm: true }) + tn(vong(O('boncach')), { fs: 16 }) +
    cmp(['proxy_pass URL', 'Behaves like', 'Result'], [['no path', 'root (2.4)', 'URI sent unchanged'], ['with a path — even just /', 'alias (2.4)', 'matched prefix REPLACED by that path']]),
    en: 'Four spellings. /a/ with no path in the URL: the upstream received /a/nguoi/1 unchanged. /b/ with a bare slash: the prefix was cut. /c/ with /khac/: replaced by /khac/. /d with /xxx: replaced by /xxx.' },
  { t: 'Cut and paste, like alias', body: seq(['client', 'nginx  location /b/', 'upstream :9101'], [
      [0, 1, 'GET /b/nguoi/1'], [1, 1, 'matched "/b/" ⇒ cut it', '#7c3aed'], [1, 1, 'paste the proxy_pass path "/"', '#7c3aed'], [1, 2, 'GET /nguoi/1', '#2f9d58']], { rh: 56, fs: 18 }) +
    box('Choose by asking what the UPSTREAM expects', 'If the API\'s own routes are /nguoi/1 — replace. If they are /a/nguoi/1 — pass through. Neither is more correct.', 'xanh'),
    en: 'With a path, Nginx cuts the part the location matched and pastes the proxy_pass path in its place — exactly like alias. Choose the form by asking what routes the upstream itself expects.' },
  { t: 'Trap: the two slashes must agree', body: ngc(`location /e  { proxy_pass http://127.0.0.1:9101/; }   # location WITHOUT /, path WITH /`, { sm: true }) +
    tn(vong(O('lech')).split('\n').slice(0, 3).join('\n'), { fs: 16 }) +
    two(box('/e/nguoi/1 ⇒ //nguoi/1', 'The matched "/e" is cut, "/nguoi/1" is pasted after "/": a double slash some frameworks treat as a different route.', 'do2'),
      box('/enguoi ⇒ /nguoi', 'A prefix does not stop at a slash (2.1): even a neighbouring path is rewritten. Write <code>location /e/</code> with <code>proxy_pass …/</code>.', 'do2')) +
    box('The rule', 'If proxy_pass has a path, end the location and the path the same way — <code>location /e/</code> with <code>proxy_pass http://…/;</code>. Or give proxy_pass no path at all.', 'xanh'),
    en: 'The trap: location /e without a slash and proxy_pass ending in a slash. /e/nguoi/1 became //nguoi/1, and /enguoi became /nguoi — a neighbouring path rewritten too. The two slashes must agree.' },
  { t: 'Where the rule stops applying', body: ngc(CONF().slice(5).join('\n'), { sm: true }) + tn(vong(O('lech')).split('\n').filter((l, i) => i === 0 || /anh|cu/.test(l)).join('\n'), { fs: 14 }) +
    tn(O('regexloi').replace(/\/tmp\/ng\/conf\//g, ''), { fs: 13 }) +
    box('Regex location: no URI part allowed', 'Rebuild the path yourself with captures. And after <code>rewrite … break</code>, the REWRITTEN URI is sent — the proxy_pass path is ignored.', 'lam'),
    en: 'In a regex location proxy_pass may not carry a path — nginx -t refuses it — so you rebuild it with a capture: /anh/a.png became /media/a.png. And inside a block with rewrite … break, the rewritten URI is sent: /cu/x became /moi/x, the proxy_pass path was ignored.' },
  { t: 'Which form for which situation', body: cmp(['Situation', 'Write', 'Upstream receives'], [
      ['The app owns the same URL space', '<code>location /api/ { proxy_pass http://app; }</code>', '/api/users'],
      ['The app is mounted under a prefix it does not know', '<code>location /api/ { proxy_pass http://app/; }</code>', '/users'],
      ['A different path on the app', '<code>location /cu/ { proxy_pass http://app/moi/; }</code>', '/moi/…'],
      ['Regex location', '<code>proxy_pass http://app/media/$1;</code>', 'rebuilt by hand'],
    ]) + box('Check any proxy with one command', 'Point it at an echo server, curl ONE URL through it, read the path the upstream printed — everything else is guessing.', 'xanh'),
    en: 'Which form: pass-through when the app owns the same URL space; a trailing slash when the app is mounted under a prefix it does not know; another path to remap; captures in a regex location. And always check with an echo server.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('proxy_pass', 'replay the request to an upstream'),
      kw('URL without a path', 'URI passed through unchanged'),
      kw('URL with a path', 'matched prefix replaced by that path'),
      kw('Upstream', 'the backend Nginx forwards to'),
      kw('Echo server', 'prints what it received — the honest test'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: proxy_pass, URL without a path, URL with a path, upstream, and the echo server.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Run the echo server; build the four locations`,
      `Curl ${c('/a/ /b/ /c/ /d')} and read the upstream path`,
      `Build ${c('location /e')} + ${c('proxy_pass …/')}; curl ${c('/enguoi')}`,
      `Try a URI part in a regex location; read ${c('nginx -t')}`,
    ]), box('Keep these', `<ul><li>No path: as is. Path: replace</li><li>Slashes must agree</li><li>Regex: rebuild with $1</li><li>Check with an echo server</li></ul>`, 'lam'), ''),
    en: 'Your turn: build the four locations against the echo server, reproduce the slash mismatch, and read the regex error. Keep the replace rule and check with an echo server.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — Reverse proxy', bai: '3.1' }, S);
