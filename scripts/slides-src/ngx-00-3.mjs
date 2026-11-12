/**
 * ngx-00-3 — Nginx · Section 0 · Lesson 0.3 "The smallest config that runs, and how Nginx reads it" (deck video + web, 12/11/2026). Bài web: nginx-0-3-cau-hinh-dau-tien.
 * Output THẬT (scratchpad/ngx/demo/n0-3.txt; ngx-lab, nginx/1.24.0): tệp mười dòng chạy, "xin chao"; thừa hưởng X-Tang: http / location / server;
 * bốn header bảo mật ở http BIẾN MẤT khi location thêm một add_header; thiếu ";" ⇒ báo ở dòng SAU (sai1.conf:5); worker_connections trong server ⇒
 * "not allowed here"; thiếu events ⇒ "no "events" section"; nginx -T in cả tệp include.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-3:file:/tmp/ng/conf/nginx.conf": "worker_processes  1;\nerror_log         /tmp/ng/logs/error.log warn;\npid               /tmp/ng/logs/nginx.pid;\n\nevents {\n  worker_connections 1024;\n}\n\nhttp {\n  access_log /tmp/ng/logs/access.log;\n\n  server {\n    listen      8080;\n    server_name _;\n\n    location / {\n      return 200 \"xin chao\\n\";\n    }\n  }\n}\n",
 "n0-3:setup": "",
 "n0-3:muoidong": "$ nginx -c /tmp/ng/conf/nginx.conf -t\nnginx: the configuration file /tmp/ng/conf/nginx.conf syntax is ok\nnginx: configuration file /tmp/ng/conf/nginx.conf test is successful\n$ nginx -c /tmp/ng/conf/nginx.conf\n$ curl -si http://127.0.0.1:8080/ | head -n 3; curl -s http://127.0.0.1:8080/\nHTTP/1.1 200 OK\nServer: nginx/1.24.0 (Ubuntu)\nDate: Thu, 12 Nov 2026 10:59:40 GMT\nxin chao\n$ tail -n 1 /tmp/ng/logs/access.log; wc -l < /tmp/ng/logs/error.log\n127.0.0.1 - - [12/Nov/2026:10:59:40 +0000] \"GET / HTTP/1.1\" 200 9 \"-\" \"curl/8.5.0\"\n0",
 "n0-3:file:/tmp/ng/conf/thua.conf": "pid       /tmp/ng/logs/thua.pid;\nerror_log /tmp/ng/logs/error.log warn;\nevents {}\nhttp {\n  access_log off;\n  add_header X-Tang \"http\" always;\n\n  server {\n    listen 8081;\n    location /thua-huong { return 200 \"thua huong\\n\"; }\n    location /ghi-de {\n      add_header X-Tang \"location\" always;\n      return 200 \"ghi de\\n\";\n    }\n  }\n  server {\n    listen 8082;\n    add_header X-Tang \"server\" always;\n    location / { return 200 \"server\\n\"; }\n  }\n}\n",
 "n0-3:thuahuong": "$ for u in 8081/thua-huong 8081/ghi-de 8082/; do printf '%-16s -> ' $u; curl -sI http://127.0.0.1:$u | grep -i '^x-tang'; done\n8081/thua-huong  -> X-Tang: http\n8081/ghi-de      -> X-Tang: location\n8082/            -> X-Tang: server",
 "n0-3:file:/tmp/ng/conf/bon.conf": "pid       /tmp/ng/logs/bon.pid;\nerror_log /tmp/ng/logs/error.log warn;\nevents {}\nhttp {\n  access_log off;\n  add_header X-Frame-Options        \"DENY\" always;\n  add_header X-Content-Type-Options \"nosniff\" always;\n  add_header Referrer-Policy        \"no-referrer\" always;\n  add_header Strict-Transport-Security \"max-age=31536000\" always;\n  server {\n    listen 8083;\n    location /trang  { return 200 \"ok\\n\"; }\n    location /tai-ve {\n      add_header Content-Disposition \"attachment\" always;\n      return 200 \"ok\\n\";\n    }\n  }\n}\n",
 "n0-3:bonheader": "$ curl -sI http://127.0.0.1:8083/trang  | grep -iE '^(x-|referrer|strict|content-disp)'\nX-Frame-Options: DENY\nX-Content-Type-Options: nosniff\nReferrer-Policy: no-referrer\nStrict-Transport-Security: max-age=31536000\n$ curl -sI http://127.0.0.1:8083/tai-ve | grep -iE '^(x-|referrer|strict|content-disp)'\nContent-Disposition: attachment",
 "n0-3:file:/tmp/ng/conf/sai1.conf": "events {}\nhttp {\n  server {\n    listen 8084\n    location / { return 200 \"ok\\n\"; }\n  }\n}\n",
 "n0-3:file:/tmp/ng/conf/sai2.conf": "events {}\nhttp {\n  server {\n    listen 8084;\n    worker_connections 512;\n  }\n}\n",
 "n0-3:file:/tmp/ng/conf/sai3.conf": "http {\n  server { listen 8084; }\n}\n",
 "n0-3:loi": "$ nginx -t -c /tmp/ng/conf/sai1.conf\n2026/11/12 10:59:40 [emerg] 1200#1200: directive \"listen\" is not terminated by \";\" in /tmp/ng/conf/sai1.conf:5\nnginx: configuration file /tmp/ng/conf/sai1.conf test failed\n$ nginx -t -c /tmp/ng/conf/sai2.conf\n2026/11/12 10:59:40 [emerg] 1208#1208: \"worker_connections\" directive is not allowed here in /tmp/ng/conf/sai2.conf:5\nnginx: configuration file /tmp/ng/conf/sai2.conf test failed\n$ nginx -t -c /tmp/ng/conf/sai3.conf\nnginx: the configuration file /tmp/ng/conf/sai3.conf syntax is ok\n2026/11/12 10:59:40 [emerg] 1216#1216: no \"events\" section in configuration\nnginx: configuration file /tmp/ng/conf/sai3.conf test failed",
 "n0-3:file:/tmp/ng/conf/conf.d/api.conf": "server {\n  listen 8085;\n  location / { return 200 \"api\\n\"; }\n}\n",
 "n0-3:file:/tmp/ng/conf/goc.conf": "events {}\nhttp {\n  include /tmp/ng/conf/conf.d/*.conf;\n}\n",
 "n0-3:include": "$ nginx -T -c /tmp/ng/conf/goc.conf 2>/dev/null\n# configuration file /tmp/ng/conf/goc.conf:\nevents {}\nhttp {\n  include /tmp/ng/conf/conf.d/*.conf;\n}\n\n# configuration file /tmp/ng/conf/conf.d/api.conf:\nserver {\n  listen 8085;\n  location / { return 200 \"api\\n\"; }\n}"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, cay, icards, cmp, box, two, steps, kw, c } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-00-3', code: 'NGX 0.3', title: 'The smallest config that runs, and how Nginx reads it', sub: 'Section 0 · Lesson 0.3' };
const O = (k) => { const v = DU_LIEU[`n0-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const lenh = (blk, re) => { const ls = O(blk).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && re.test(l)); const out = [ls[i]]; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) out.push(ls[j]); return out.join('\n'); };
const hop = (ten, mau, trong = '', ghi = '') => `<div style="border:3px solid ${mau};border-radius:12px;padding:8px 12px;margin-top:8px;background:${mau}10"><div style="font:800 20px Arial;color:${mau}">${ten}${ghi ? `<span style="font:400 16px Arial;color:#555"> — ${ghi}</span>` : ''}</div>${trong}</div>`;

export const S = [
  { cover: true, nhan: 'Section 0 · Lesson 0.3', t: 'The smallest config that runs,<br>and how Nginx reads it', sub: 'Not a program — a TREE of nested contexts with one inheritance rule. Ten lines, then the rule that explains "I set it and it does nothing"',
    en: 'Lesson 0.3. A Nginx configuration is not a program — it is a tree of nested contexts with an inheritance rule. Ten working lines, then the one rule that explains why a setting you definitely wrote definitely has no effect.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Ten lines that run — and why each one is there</li>
    <li>The five contexts: main, events, http → server → location</li>
    <li>Three real syntax errors and what <code>nginx -t</code> says</li>
    <li>Inheritance, measured: down, never sideways</li>
    <li>The trap: <code>add_header</code> REPLACES, it does not add</li></ul>`,
    en: 'Five takeaways: the ten-line file, the contexts, three real syntax errors, inheritance measured on a running server, and the trap where add_header replaces instead of adding.' },
  { t: 'Ten lines, each with a reason', body: two(ngc(O('file:/tmp/ng/conf/nginx.conf').split('\n').filter((l) => l.trim()).join('\n'), { sm: true }),
      tn([lenh('muoidong', /-t$/), lenh('muoidong', /curl/), lenh('muoidong', /tail/)].join('\n'), { wrap: 50, fs: 14 })) +
    box('', '<code>error_log</code> — first place to look · <code>pid</code> — where signals find the master · <code>events</code> — required', 'lam'),
    en: 'Ten lines. worker_processes, error_log and pid at the top; an events block, which is required; then http, one server listening on 8080, and one location that returns "xin chao". It runs, the access log gets one line, and the error log stays empty.' },
  { t: 'A tree of contexts, not a program', body: two(
      `<div style="font-family:Consolas,monospace">${hop('main', '#7c3aed', hop('events', '#2563eb', '', 'how connections are accepted') + hop('http', '#008a34', hop('server', '#b85a2b', hop('location', '#c0392b', '', 'a group of URLs'), 'one site, one port'), 'everything HTTP'), 'outside every brace')}</div>`,
      cmp(['Context', 'Holds'], [
        ['main', 'worker_processes · user · pid · error_log'],
        ['events', 'worker_connections — required, even empty'],
        ['http', 'everything web: logs, types, gzip, servers'],
        ['server', 'one site: listen, server_name'],
        ['location', 'one group of URLs: root, proxy_pass, return'],
        ['stream', 'TCP/UDP proxying — outside this course'],
      ])),
    en: 'The configuration is a tree. main is outside every brace. events says how connections are accepted and must exist. http holds everything web; inside it, server is one site, and location is one group of URLs. stream is the TCP and UDP sibling, outside this course.' },
  { t: 'Three real errors, and what nginx -t says', body: tn(O('loi'), { wrap: 112, fs: 14 }) + icards([
      ['warn', 'Missing ;', 'Reported on line 5 — the line AFTER the one you broke. When a line looks fine, check the one above it.'],
      ['cut', 'Wrong context', '"directive is not allowed here" — every directive lists the contexts it may live in.'],
      ['list', 'Missing events', 'Syntax is ok, the test still fails: <code>no "events" section</code>.'],
    ], 3),
    en: 'Three real mistakes. A missing semicolon after listen is reported on line five — the next line. worker_connections inside a server block: not allowed here. And a file without an events block: the syntax is fine but the test fails.' },
  { t: 'error_log and access_log are different files', body: cmp(['', 'error_log', 'access_log'], [
      ['Writes', 'problems of the server itself', 'one line per request'],
      ['Examples', 'permission denied · upstream unreachable · config warnings', 'IP · time · request line · status · size'],
      ['Context', 'main (and others)', 'http, server, location'],
      ['First look when', 'something is broken', 'you need to know who asked what'],
    ]) + tn(lenh('muoidong', /tail/), { fs: 15 }) +
    box('Diagnosing with the wrong one wastes hours', 'A 403 shows as one line in access_log; the reason — 13: Permission denied — is only in error_log. Chapter 11 is built on reading both.', 'do2'),
    en: 'Two different logs. error_log records problems of the server itself; access_log records one line per request. Here the request produced one access line and zero error lines. Looking in the wrong file is the most common wasted hour.' },
  { t: 'Inheritance, measured', body: two(ngc(O('file:/tmp/ng/conf/thua.conf').split('\n').slice(3).join('\n'), { sm: true, hl: [3, 8, 14] }),
      tn(O('thuahuong'), { wrap: 52, fs: 15 })) +
    box('Line 2 is the whole lesson', 'Setting <code>X-Tang</code> again in the location did not ADD a second header — the http one disappeared. One header, not two.', 'do2'),
    en: 'Inheritance measured. X-Tang is set to "http" at the http level. A location that sets nothing inherits "http". A location that sets it again gets only "location". A server that sets it gets "server". The value nearest wins, and the outer one is gone.' },
  { t: 'Down the tree, never sideways', body: cay({ t: 'http · X-Tang: http', s: 'set at the top', mau: '#008a34' }, [
      { t: 'server :8081', s: 'sets nothing', mau: '#475569' }, { t: 'server :8082', s: 'X-Tang: server', mau: '#b85a2b' }], { w: 1110, h: 200 }) +
    cay({ t: 'server :8081 (inherits "http")', mau: '#475569' }, [
      { t: '/thua-huong', s: '→ X-Tang: http', mau: '#008a34' }, { t: '/ghi-de', s: '→ X-Tang: location', mau: '#c0392b' }], { w: 1110, h: 200 }),
    en: 'Inheritance goes down the tree, never sideways. Something set in http applies to every server and location below it. Something set in one server never reaches another server. Shared settings belong at the http level or in an included file.' },
  { t: 'The trap: array directives REPLACE', body: (ngc(O('file:/tmp/ng/conf/bon.conf').split('\n').slice(5, 17).filter((l) => l.trim() && !/access_log|listen/.test(l)).map((l) => l.replace(/\s+"/, ' "')).join('\n'), { sm: true, hl: [1, 2, 3, 4, 8] }) +
      tn(O('bonheader').replace(/http:\/\/127\.0\.0\.1:8083/g, '').replace(/ +\| grep .*$/gm, ' | grep …'), { fs: 13 })) +
    box('', '<b>No warning, no error, nginx -t happy:</b> ONE <code>add_header</code> in <code>/tai-ve</code> and the four inherited ones are gone. Same for <code>proxy_set_header</code>.', 'do2'),
    en: 'The trap. Four security headers at the http level; /trang gets all four. Then someone adds one add_header to the /tai-ve location — and there, all four disappear. No warning, no error, and nginx -t is happy. proxy_set_header behaves the same way.' },
  { t: 'Scalar directives are simple; arrays surprise', body: cmp(['Kind', 'Examples', 'At a lower level…'], [
      ['Scalar (one value)', '<code>root</code> · <code>client_max_body_size</code> · <code>proxy_read_timeout</code>', 'the nearest one wins — as you expect'],
      ['Array (many values)', '<code>add_header</code> · <code>proxy_set_header</code>', 'ONE line there throws away ALL of the inherited ones'],
    ]) + icards([
      ['layers', 'Fix 1: repeat them', 'Write all four headers again in the location that adds one.'],
      ['page', 'Fix 2: include a file', 'Put the set in <code>security-headers.conf</code> and <code>include</code> it everywhere.'],
      ['search', 'Check with curl -I', 'Never trust reading — look at the response headers per location.'],
    ], 3),
    en: 'Scalar directives such as root or client_max_body_size behave as expected: the nearest one wins. Array directives — add_header and proxy_set_header — are replaced as a whole. Fix it by repeating them, or by including one shared file everywhere, and check with curl -I.' },
  { t: 'include is a text paste — and nginx -T shows the result', body: tn(O('include'), { fs: 15 }) +
    box('include inherits the context where it lands', 'The included text is inserted VERBATIM at that point. The same file included in http or in a location can mean different things. <code>nginx -T</code> prints every file in one document — the definitive answer to "does this apply here?".', 'lam'),
    en: 'include is a text paste: the file is inserted verbatim where the include line is, and inherits that context. nginx -T, capital T, prints the whole effective configuration with every included file, each one labelled.' },
  { t: 'Reading a config you have never seen', to: true, giua: true, body: steps([
      'How many <b>server</b> blocks — and which <code>listen</code> + <code>server_name</code> does each have?',
      'Inside the one you care about: which <b>location</b> blocks, and of which kind (Chapter 2)?',
      'Which directives are set at <b>http</b> that a location is quietly <b>overriding</b>?',
    ]) + ngc(`nginx -T 2>/dev/null | grep -nE '^\\s*(server|listen|server_name|location|add_header|include)'`) +
    box('Answer the three on the output of nginx -T', 'Much faster than reading the files top to bottom — it rebuilds the intent of a config you did not write.', 'xanh'),
    en: 'Three questions for any configuration you did not write: how many server blocks and what do they listen on; which locations are in the one you care about; and which http-level directives a location is overriding. Answer them on the output of nginx -T.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Context', 'a nested scope: main, events, http, server, location'),
      kw('events block', 'required; holds worker_connections'),
      kw('http → server → location', 'three nested levels where nearly all work happens'),
      kw('Inheritance', 'directives apply DOWN to child blocks, never sideways'),
      kw('Array-valued directive', 'add_header / proxy_set_header — replaced, not merged'),
      kw('include', 'a verbatim text paste that inherits the context where it lands'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: context, the events block, the http-server-location chain, inheritance, array-valued directives that are replaced rather than merged, and include as a verbatim text paste.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Run the ten-line file; break one ${c(';')} and read where it is reported`,
      `Set ${c('X-Tang')} at http, override it in one location, curl -I both`,
      `Put four headers at http, add ONE in a location, count them`,
      `Split a server into ${c('conf.d/')} and read ${c('nginx -T')}`,
    ]), box('Keep these', `<ul><li>A config is a tree of contexts</li><li>Inheritance goes down, never sideways</li><li>add_header / proxy_set_header REPLACE</li><li>nginx -T is the effective truth</li></ul>`, 'lam'), ''),
    en: 'Your turn: break a semicolon, reproduce the inheritance test, count the security headers after adding one in a location, and split a server into conf.d and read nginx -T. Keep: a tree of contexts, inheritance goes down, arrays replace, nginx -T tells the truth.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — The problem, and a build that runs', bai: '0.3' }, S);
