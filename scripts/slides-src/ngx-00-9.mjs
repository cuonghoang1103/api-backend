/**
 * ngx-00-9 — Nginx · Section 0 · Start here (2/2) "What to know first, and how to study this course" (deck video + web, 12/11/2026).
 * Bài web: nginx-0-0-bat-dau-2. Output THẬT (scratchpad/ngx/demo/n0-9.txt; container ngx-lab, nginx/1.24.0 · Ubuntu 24.04): vòng học
 * sửa → nginx -t → reload → curl; thiếu dấu chấm phẩy ⇒ "unexpected "}"" dòng 8, reload bị chặn, bản cũ vẫn chạy; reload không tức thì.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-9:file:/tmp/ng/conf/nginx.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log /tmp/ng/logs/access.log;\n  server {\n    listen 8080;\n    location / { return 200 \"phien ban MOT\\n\"; }\n  }\n}\n",
 "n0-9:setup": "",
 "n0-9:vong1": "$ id -un\nhoc\n$ nginx -c /tmp/ng/conf/nginx.conf -t\nnginx: the configuration file /tmp/ng/conf/nginx.conf syntax is ok\nnginx: configuration file /tmp/ng/conf/nginx.conf test is successful\n$ nginx -c /tmp/ng/conf/nginx.conf\n$ curl -s http://127.0.0.1:8080/\nphien ban MOT",
 "n0-9:sai": "$ grep -n 'return' /tmp/ng/conf/nginx.conf\n8:    location / { return 200 \"phien ban HAI\\n\" }\n$ nginx -c /tmp/ng/conf/nginx.conf -t\n2026/11/12 11:17:26 [emerg] 1331#1331: unexpected \"}\" in /tmp/ng/conf/nginx.conf:8\nnginx: configuration file /tmp/ng/conf/nginx.conf test failed\n$ nginx -c /tmp/ng/conf/nginx.conf -t && nginx -c /tmp/ng/conf/nginx.conf -s reload\n2026/11/12 11:17:27 [emerg] 1345#1345: unexpected \"}\" in /tmp/ng/conf/nginx.conf:8\nnginx: configuration file /tmp/ng/conf/nginx.conf test failed\n$ curl -s http://127.0.0.1:8080/\nphien ban MOT",
 "n0-9:dung": "$ grep -n 'return' /tmp/ng/conf/nginx.conf\n8:    location / { return 200 \"phien ban HAI\\n\"; }\n$ nginx -c /tmp/ng/conf/nginx.conf -t && nginx -c /tmp/ng/conf/nginx.conf -s reload\nnginx: the configuration file /tmp/ng/conf/nginx.conf syntax is ok\nnginx: configuration file /tmp/ng/conf/nginx.conf test is successful\n2026/11/12 11:17:27 [notice] 1367#1367: signal process started\n$ curl -s http://127.0.0.1:8080/\nphien ban HAI\n$ ss -ltnp | grep 8080\nLISTEN 0      511          0.0.0.0:8080      0.0.0.0:*    users:((\"nginx\",pid=1375,fd=5),(\"nginx\",pid=1309,fd=5))"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, flow, icards, cmp, box, two, steps, kw, c, sh, tbl } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-00-9', code: 'NGX 0.9', title: 'What to know first, and how to study this course', sub: 'Section 0 · Start here (2/2)' };
const O = (k) => { const v = DU_LIEU[`n0-9:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };

export const S = [
  { cover: true, nhan: 'Section 0 · Start here (2/2)', t: 'What to know first,<br>and how to study this course', sub: 'An honest checklist before you begin — and the one habit that makes every chapter stick: run it, do not just read it',
    en: 'Start here, part two: an honest checklist of what you need before the course, and the way to study it.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The four things you should already be comfortable with</li>
    <li>The three things you do NOT need — no server, no domain, no root</li>
    <li>The study loop: edit → <code>nginx -t</code> → reload → <code>curl</code></li>
    <li>What happens when the loop catches a mistake, run for real</li>
    <li>How to read the numbers in this course</li></ul>`,
    en: 'Five takeaways: the prerequisites, what you do not need, the study loop, a real mistake caught by that loop, and how to read the measured numbers in this course.' },
  { t: 'What you should already know', body: icards([
      ['code', 'A terminal', 'Open a shell, run a command, read its output. That is the whole tooling requirement.'],
      ['loop', 'Request and response', 'A client sends an HTTP request; the server answers with a status code.'],
      ['list', 'Headers', 'Requests and responses carry name: value lines — Host, Content-Type…'],
      ['server', 'A Linux machine or Docker', 'Any Linux box, a VM, WSL, or Docker Desktop — every example runs on one.'],
    ], 2) + box('Not sure? Fill the gap first', 'Linux &amp; Bash 9.2 (curl) · Web Foundations 6.1 (request/response) and 6.4 (headers) — links under this lesson.', 'lam'),
    en: 'Four prerequisites: a terminal, the idea of a request and a response, what headers are, and any Linux machine or Docker. If one of them is shaky, the related lessons are linked under this one.' },
  { t: 'What you do NOT need', body: icards([
      ['shield', 'A server, a domain, or root', 'Every config runs on ONE machine with ONE command, on port 8080 — no root, no systemd.'],
      ['page', 'Any nginx.conf experience', 'Section 0 builds the smallest working file before any chapter adds a directive.'],
      ['plug', 'A specific backend language', 'The app behind the proxy is just something answering on a port — a few small Node servers here.'],
    ], 3) + cmp(['Port', 'Needs root?', 'Used in this course for'], [
      ['80 / 443', 'yes (below 1024)', 'only in explanations — production'],
      ['8080–8089', 'no', 'every example you run'],
      ['3000, 3001…', 'no', 'the small apps behind the proxy'],
    ]),
    en: 'What you do not need: a server, a domain or root — everything listens on port 8080; any previous nginx.conf experience; or a particular backend language. Ports below 1024 need root, so the course stays above them.' },
  { t: 'Two ways to get a running nginx', body: two(
      sh(`# Ubuntu / Debian
sudo apt-get update && sudo apt-get install -y nginx
nginx -v
# nginx version: nginx/1.24.0 (Ubuntu)`, { title: 'on a Linux machine' }),
      sh(`# Docker — nothing installed on your machine
docker run --rm -p 8080:80 \\
  -v "$PWD/nginx.conf:/etc/nginx/nginx.conf:ro" \\
  nginx:1.27-alpine`, { title: 'with Docker' })) +
    tbl(['What', 'Ubuntu package', 'In this course'], [['main config', '<code>/etc/nginx/nginx.conf</code>', '<code>/tmp/ng/conf/nginx.conf</code> (your own file, via -c)'], ['logs', '<code>/var/log/nginx/</code>', '<code>/tmp/ng/logs/</code>'], ['started by', 'systemd, as root', 'you, as a normal user']]) +
    box('This course uses nginx/1.24.0', 'The version Ubuntu 24.04 ships. Directives and defaults change between releases, so when your output differs, check your version first.', 'lam'),
    en: 'Two ways to get Nginx: install the package on Linux, or run the official image in Docker with your config mounted. The course output comes from nginx 1.24.0, the version Ubuntu 24.04 ships.' },
  { t: 'The study loop — four steps, every time', to: true, body: flow([
      { t: 'Edit', s: 'a file in /tmp/ng/conf' }, { t: 'nginx -t', s: 'check before anything', mau: '#008a34' },
      { t: 'start / reload', s: 'nginx -c … / -s reload' }, { t: 'curl', s: 'look at what it DOES' }], { h: 200, fs: 24 }) +
    ngc(`# the one-line habit: test, and reload ONLY if the test passed
nginx -c /tmp/ng/conf/nginx.conf -t && nginx -c /tmp/ng/conf/nginx.conf -s reload`) +
    box('Reading a config tells you what it SAYS; running it tells you what it DOES', 'The two are not the same — that difference is what most of this course is about.', 'xanh'),
    en: 'The study loop has four steps: edit a file, test it with nginx -t, start or reload, and send a request with curl. Join the test and the reload with && so a broken file never reaches the running server.' },
  { t: 'The loop in practice: version ONE', body: ngc(O('file:/tmp/ng/conf/nginx.conf'), { sm: true, hl: [8] }) + tn(O('vong1'), { wrap: 110, fs: 14 }) +
    box('', '<b>No root:</b> the first line says <code>hoc</code> — an ordinary user.', 'xanh'),
    en: 'A real run. The configuration returns the text "phien ban MOT". Test, start with -c, and curl: version one answers.' },
  { t: 'A mistake caught by nginx -t', body: tn(O('sai'), { wrap: 110, fs: 15 }) +
    two(box('What went wrong', `The edit dropped one ${c(';')}. Nginx reports ${c('unexpected "}"')} on line 8 — the line where it noticed, which is not always the line you broke.`, 'do2'),
      box('What did NOT happen', 'Because of <code>&amp;&amp;</code>, the reload never ran. The server kept serving version ONE — no outage.', 'xanh')),
    en: 'Now an edit that forgets one semicolon. nginx -t fails with unexpected "}" on line 8, the && stops the reload, and curl still gets version one. The broken file never reached the running server.' },
  { t: 'Fix, reload — and reload is not instant', body: tn(O('dung'), { wrap: 110, fs: 15 }) +
    box('Real observation', `In our first run, a ${c('curl')} sent in the same instant as the reload still got version ONE: the master starts new workers and retires the old ones over a few milliseconds. Wait a moment, then check.`, 'lam'),
    en: 'Put the semicolon back, test, reload: version two. One real detail: a request sent at the very same instant as the reload still got the old answer, because reload replaces workers gradually. Give it a moment before checking.' },
  { t: 'How to read the numbers in this course', body: cmp(['What you see', 'Where it came from', 'How to use it'], [
      ['Output blocks', 'a real run on nginx/1.24.0', 'copy the command, compare with yours'],
      ['Timings in ms', 'one machine, one moment', 'compare ratios, not the exact numbers'],
      ['"Not in favour of Nginx"', 'printed as measured', 'the honest result is part of the lesson'],
      ['Your output differs', 'version, OS, or config', 'check nginx -v and nginx -T first'],
    ]) + box('The rule', 'Every claim here was measured, not inferred from documentation — and when the measurement is unflattering, it is printed anyway.', 'xanh'),
    en: 'How to read the course: output blocks are real runs; timings depend on the machine, so compare ratios; unflattering results are printed as measured; and if your output differs, check the version and the effective config first.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Request / response', 'the client\'s HTTP message and the server\'s answer with a status code'),
      kw('Header', 'a name: value line carried by a request or response, e.g. Host'),
      kw('nginx -c', 'run Nginx from a config file you choose'),
      kw('nginx -t', 'test the whole config without touching the running server'),
      kw('Port 8080', 'a high port anyone can bind without root'),
      kw('-s reload', 'apply a new config without dropping connections'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: request and response, header, nginx -c to run your own file, nginx -t to test, port 8080 which needs no root, and -s reload to apply a new configuration.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Get nginx: ${c('apt-get install nginx')} or ${c('docker run nginx')}`,
      `Write the 10-line file; ${c('nginx -c … -t')}, then start it`,
      `Break it on purpose: delete one ${c(';')} and read the error`,
      `Fix it; ${c('-t && -s reload')}; curl until you see the new answer`,
    ]), box('Keep these', `<ul><li>You need a terminal, HTTP basics, Linux or Docker</li><li>No server, domain or root — port 8080</li><li>Always <code>nginx -t</code> before reload</li><li>Run it, don't just read it</li></ul>`, 'lam'), ''),
    en: 'Your turn: install or pull Nginx, run the ten-line file, break it on purpose and read the error, then fix and reload until curl shows the new answer. Keep the habit: always test before reload, and run everything you read.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — The problem, and a build that runs', bai: 'Start 2/2' }, S);
