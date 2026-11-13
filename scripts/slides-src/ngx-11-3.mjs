/**
 * ngx-11-3 — Nginx · Chapter 11 · Lesson 11.3 "Reading a configuration you did not write" (deck video + web, 13/11/2026).
 * Bài web: nginx-11-3-doc-cau-hinh-nguoi-khac-viet. Output THẬT (scratchpad/ngx/demo/n11-3.txt; nginx/1.24.0): main.conf 7 dòng ⇒ nginx -T 29 dòng, 4 tệp được đọc
 * (nginx.conf.bak KHÔNG) · hai server_name shop.vidu ⇒ [warn] conflicting server name … ignored + test successful; 10-shop.conf thắng; sao lưu shop-old.conf KHỚP *.conf
 * ⇒ 2 cảnh báo, 5 tệp; đổi tên 10-shop → 30-shop ⇒ kẻ thắng thành CU (20-cu.conf) · kế thừa proxy_set_header: /ke-thua/ đủ Host/X-Real-IP/X-Forwarded-Proto;
 * /rieng/ (khai MỘT header riêng) ⇒ host 127.0.0.1:9601, mất hai cái kia; /snippet/ (include lại) ⇒ đủ cả bốn.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n11-3:file:/root/soi.js": "// soi.js — backend cổng 9601: in đúng 4 header nó NHẬN được (thiếu ⇒ \"(KHONG CO)\")\nrequire('http').createServer((q, r) => {\n  const h = ['host', 'x-real-ip', 'x-forwarded-proto', 'x-yeu-cau-rieng'];\n  r.end(h.map((k) => `  ${k.padEnd(19)} = ${q.headers[k] ?? '(KHONG CO)'}`).join('\\n') + '\\n');\n}).listen(9601, '127.0.0.1');\n",
 "n11-3:file:/tmp/ng/conf/main.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  include /tmp/ng/conf/conf.d/*.conf;\n}\n",
 "n11-3:file:/tmp/ng/conf/conf.d/10-shop.conf": "server {\n  listen 8080; server_name shop.vidu;\n  location / { return 200 \"SHOP (10-shop.conf)\\n\"; }\n  include /tmp/ng/conf/conf.d/api.inc;\n}\n",
 "n11-3:file:/tmp/ng/conf/conf.d/api.inc": "# tep nay do \"ai do\" them vao 8 thang truoc\nlocation /api/ {\n    proxy_pass http://127.0.0.1:9601/;\n    proxy_set_header Host $host;\n}\n",
 "n11-3:file:/tmp/ng/conf/conf.d/20-cu.conf": "server {\n  listen 8080; server_name shop.vidu;\n  location / { return 200 \"CU (20-cu.conf)\\n\"; }\n}\n",
 "n11-3:setup": "",
 "n11-3:T": "$ ls /tmp/ng/conf/conf.d/\n10-shop.conf\n20-cu.conf\napi.inc\nnginx.conf.bak\n$ nginx -T -c /tmp/ng/conf/main.conf 2>/dev/null | wc -l; wc -l < /tmp/ng/conf/main.conf\n29\n7\n$ nginx -T -c /tmp/ng/conf/main.conf 2>/dev/null | grep '^# configuration file'\n# configuration file /tmp/ng/conf/main.conf:\n# configuration file /tmp/ng/conf/conf.d/10-shop.conf:\n# configuration file /tmp/ng/conf/conf.d/api.inc:\n# configuration file /tmp/ng/conf/conf.d/20-cu.conf:\n$ nginx -T -c /tmp/ng/conf/main.conf 2>/dev/null | sed -n '/api.inc:/,/^}/p'\n# configuration file /tmp/ng/conf/conf.d/api.inc:\n# tep nay do \"ai do\" them vao 8 thang truoc\nlocation /api/ {\n    proxy_pass http://127.0.0.1:9601/;\n    proxy_set_header Host $host;\n}",
 "n11-3:trung": "$ nginx -t -c /tmp/ng/conf/main.conf 2>&1 | sed 's/^nginx: //'\n2026/11/13 01:49:24 [warn] 22968#22968: conflicting server name \"shop.vidu\" on 0.0.0.0:8080, ignored\nthe configuration file /tmp/ng/conf/main.conf syntax is ok\nconfiguration file /tmp/ng/conf/main.conf test is successful\n$ curl -s -H 'Host: shop.vidu' 127.0.0.1:8080/      # ai thắng?\nSHOP (10-shop.conf)\n$ cp /tmp/ng/conf/conf.d/10-shop.conf /tmp/ng/conf/conf.d/shop-old.conf     # sao lưu kiểu \"-old.conf\": KHỚP mẫu *.conf\n$ nginx -t -c /tmp/ng/conf/main.conf 2>&1 | grep -c '\\[warn\\]'; nginx -T -c /tmp/ng/conf/main.conf 2>/dev/null | grep '^# configuration file'\n2\n# configuration file /tmp/ng/conf/main.conf:\n# configuration file /tmp/ng/conf/conf.d/10-shop.conf:\n# configuration file /tmp/ng/conf/conf.d/api.inc:\n# configuration file /tmp/ng/conf/conf.d/20-cu.conf:\n# configuration file /tmp/ng/conf/conf.d/shop-old.conf:\n$ nginx -T -c /tmp/ng/conf/main.conf 2>/dev/null | grep -E '^# configuration file|server_name'\n# configuration file /tmp/ng/conf/main.conf:\n# configuration file /tmp/ng/conf/conf.d/10-shop.conf:\n  listen 8080; server_name shop.vidu;\n# configuration file /tmp/ng/conf/conf.d/api.inc:\n# configuration file /tmp/ng/conf/conf.d/20-cu.conf:\n  listen 8080; server_name shop.vidu;\n# configuration file /tmp/ng/conf/conf.d/shop-old.conf:\n  listen 8080; server_name shop.vidu;\n$ mv 10-shop.conf 30-shop.conf      # đổi tên tệp\nCU (20-cu.conf)",
 "n11-3:file:/tmp/ng/conf/kt.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8081; server_name shop.vidu;\n    proxy_set_header Host              $host;\n    proxy_set_header X-Real-IP         $remote_addr;\n    proxy_set_header X-Forwarded-Proto $scheme;\n    location /ke-thua/ { proxy_pass http://127.0.0.1:9601/; }\n    location /rieng/ {\n        proxy_set_header X-Yeu-Cau-Rieng \"co\";   # MOT header rieng\n        proxy_pass http://127.0.0.1:9601/;\n    }\n    location /snippet/ {\n        include /tmp/ng/conf/snippets/proxy-headers.conf;   # ba dong chung, include lai\n        proxy_set_header X-Yeu-Cau-Rieng \"co\";\n        proxy_pass http://127.0.0.1:9601/;\n    }\n  }\n}\n",
 "n11-3:file:/tmp/ng/conf/snippets/proxy-headers.conf": "proxy_set_header Host              $host;\nproxy_set_header X-Real-IP         $remote_addr;\nproxy_set_header X-Forwarded-Proto $scheme;\n",
 "n11-3:kethua": "$ for p in ke-thua rieng snippet; do echo \"=== /$p/\"; curl -s -H 'Host: shop.vidu' 127.0.0.1:8081/$p/; done\n=== /ke-thua/\n  host                = shop.vidu\n  x-real-ip           = 127.0.0.1\n  x-forwarded-proto   = http\n  x-yeu-cau-rieng     = (KHONG CO)\n=== /rieng/\n  host                = 127.0.0.1:9601\n  x-real-ip           = (KHONG CO)\n  x-forwarded-proto   = (KHONG CO)\n  x-yeu-cau-rieng     = co\n=== /snippet/\n  host                = shop.vidu\n  x-real-ip           = 127.0.0.1\n  x-forwarded-proto   = http\n  x-yeu-cau-rieng     = co"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, tiers, flow } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-11-3', code: 'NGX 11.3', title: 'Reading a configuration you did not write', sub: 'Chapter 11 · Lesson 11.3' };
const O = (k) => { const v = DU_LIEU[`n11-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const L = (k, a, b) => O(k).split('\n').slice(a, b).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 11 · Lesson 11.3', t: 'Reading a configuration<br>you did not write', sub: 'What it REALLY says is not what any single file says',
    en: 'Lesson 11.3. A production Nginx configuration is rarely one file. It is nginx dot conf including conf dot d, including snippets, written by several people over several years. Before you change anything, you need to know what it really says — and that is not what any single file says.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>nginx -T</code>: the whole config, includes expanded</li>
    <li>Which files are REALLY read — and the backup that sneaks in</li>
    <li>Two files claiming one name: a warning, and a silent loser</li>
    <li>One <code>proxy_set_header</code> that loses three others</li>
    <li>A five-step reading order for a server you just inherited</li></ul>`,
    en: 'Five takeaways: nginx dash capital T; which files are really read; two files claiming one name; one proxy set header that loses three others; and a reading order for a server you just inherited.' },
  { t: 'nginx -T: the whole thing, expanded', body: flow([{ t: 'main.conf', s: '7 lines', mau: '#64748b' }, { t: 'include conf.d/*.conf', s: 'glob, alphabetical', mau: '#b85a2b' }, { t: '10-shop.conf → api.inc', s: 'include inside', mau: '#2563eb' }, { t: 'nginx -T', s: '29 lines, every file named', mau: '#009639' }], { h: 88, fs: 17 }) +
    tn(O('T'), { fs: 13, wrap: 115 }),
    en: 'Dash t tests; dash capital T tests and prints the whole effective configuration with every include expanded in place. A seven line main file becomes twenty nine lines, and every file pulled in is announced by a configuration file comment. Those comment lines answer a question nobody thinks to ask: which files are actually being read? The directory holds nginx dot conf dot bak — it is not in the list, because it does not match the glob.' },
  { t: 'The backup that DOES match the glob', body: tn(L('trung', 6, 14), { fs: 16, wrap: 93 }) + two(icards([
      ['check', 'site.conf.old, nginx.conf.bak', 'do not match *.conf — harmless'],
      ['warn', 'site-old.conf, test.conf, copy.conf', 'match *.conf — every server block loaded a SECOND time'],
    ], 1), box('ls shows what EXISTS', 'Only the "# configuration file" list from nginx -T shows what nginx READ. Here a copy named shop-old.conf turned one warning into two and loaded a fifth file.', 'do2'), ''),
    en: 'The trap is the backup that does match. cp site dot conf site dot conf dot old is harmless. cp site dot conf site dash old dot conf loads a second copy of every server block in it. Measured: one copy named shop dash old dot conf — two warnings instead of one, and a fifth file in the list. Listing the directory tells you what exists; only this list tells you what Nginx read.' },
  { t: 'Two files claim the same name', body: tn(L('trung', 0, 6) + '\n' + L('trung', 23, 25), { fs: 16, wrap: 93 }) + cmp(['', 'duplicate location', 'duplicate server_name'], [
      ['nginx -t', '[emerg] — refused', '[warn] … ignored — test is successful'],
      ['who wins', '—', 'the FIRST one parsed: glob order = alphabetical'],
      ['the loser', '—', 'all its routes, TLS, limits: dead, silently'],
    ], { hl: [2] }),
    en: 'Two server blocks in two files, both server name shop dot vidu on the same port. One warning line, and test is successful. Nginx keeps the first block it parsed and ignores the rest. Includes expand in glob order — alphabetical — so ten dash shop beats twenty dash cu. Rename one file and the winner changes: thirty dash shop, and now the old site answers. Everything in the losing block is dead, and the only sign is one warning line during a reload nobody watched.' },
  { t: 'Two greps worth running on any server you inherit', body: ngc(`# every warning this time — "conflicting server name" among them
nginx -t 2>&1 | grep -i warn

# every name, and the file that declares it
nginx -T 2>/dev/null | grep -E '^# configuration file|server_name'`, { hl: [2, 5] }) + tn(L('trung', 14, 23), { fs: 17, wrap: 88 }),
    en: 'Two greps worth running on any server you take over. The first prints every warning of this test — conflicting server name among them. The second prints every server name together with the file that declares it: here shop dot vidu appears in three files.' },
  { t: 'One proxy_set_header loses three others', body: two(ngc(`server {
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-Proto $scheme;
  location /ke-thua/ {
    proxy_pass http://127.0.0.1:9601/;
  }
  location /rieng/ {
    proxy_set_header X-Yeu-Cau-Rieng "co"; # ONE
    proxy_pass http://127.0.0.1:9601/;
  }
}`, { sm: true, hl: [9] }), tn(O('kethua').split('\n').slice(0, 11).join('\n'), { fs: 15, wrap: 54 }), '') +
    box('Measured at the backend', '/rieng/ added one unrelated header and lost X-Real-IP, lost X-Forwarded-Proto, and Host fell back to nginx\'s default — the upstream address 127.0.0.1:9601. Rate limits keyed on the client IP, audit logs, absolute URLs built from Host: broken on ONE route.', 'do2'),
    en: 'The inheritance question. Three proxy set header lines at server level. One location adds nothing, another adds exactly one unrelated header. Measured at the backend: the first gets all three. The second lost the real IP, lost the forwarded protocol, and Host fell back to the upstream address. Everything else still works — which is what makes it dangerous, and it happens on exactly one route.' },
  { t: 'The fix is a snippet — because of the rule', body: two(ngc(`# snippets/proxy-headers.conf
proxy_set_header Host              $host;
proxy_set_header X-Real-IP         $remote_addr;
proxy_set_header X-Forwarded-Proto $scheme;

location /snippet/ {
  include snippets/proxy-headers.conf;
  proxy_set_header X-Yeu-Cau-Rieng "co";
  proxy_pass http://127.0.0.1:9601/;
}`, { sm: true, hl: [7] }), tn(O('kethua').split('\n').slice(11).join('\n'), { fs: 16, wrap: 60 }), '') + icards([
      ['list', 'Array-type directives', 'add_header, proxy_set_header, fastcgi_param, error_log, access_log, limit_req, limit_conn'],
      ['merge', 'All or nothing', 'the child inherits the whole list — or declares its own and inherits none'],
    ], 1),
    en: 'The fix is a snippet, and it exists because of the rule, not for tidiness. Put the shared lines in one file and include it wherever a location adds a header of its own. Measured: the snippet location gets all four. The directives that behave this way are the array types: add header, proxy set header, fastcgi param, error log, access log, limit req, limit conn — all or nothing.' },
  { t: 'A reading order for a server you just inherited', body: tiers([
      ['page', '1 · nginx -T > config-full.txt', 'read the expanded text, never the files one by one — and keep it to diff later', '#009639'],
      ['search', '2 · grep "# configuration file"', 'which files are real; anything unexpected is a live surprise', '#2563eb'],
      ['map', '3 · grep -E "listen|server_name"', 'the doors in, and which block is default_server (Chapter 1)', '#7c3aed'],
      ['tree', '4 · for your route: list every location', 'apply Chapter 2 — then check with the X-Kh header of 11.1', '#b85a2b'],
      ['layers', '5 · trace array-type directives up the tree', 'the winner declares one? everything above is gone', '#c0392b'],
    ], { th: 64, gap: 18 }),
    en: 'A reading order for a server you just inherited. One: dump nginx dash capital T to a file and read that. Two: grep the configuration file lines. Three: grep listen and server name — the doors in. Four: for your route, list every location and apply Chapter 2, then confirm with the header from 11.1. Five: trace the array type directives up the tree.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('nginx -T', 'whole config, includes expanded'),
      kw('# configuration file', 'the files really read'),
      kw('include glob order', 'alphabetical'),
      kw('conflicting server name', 'a warning; first wins'),
      kw('array-type directives', 'all or nothing'),
      kw('snippet', 'one file, included everywhere'),
    ].join('')}</div>` + cmp(['Array-type directive', 'Child declares none', 'Child declares ONE'], [
      ['proxy_set_header', 'inherits all', 'Host, X-Real-IP, X-Forwarded-Proto: gone'],
      ['add_header', 'inherits all', 'security headers: gone (11.1, 11.5)'],
      ['access_log / error_log', 'inherits', 'replaced (10.3, 10.4)'],
    ]) + flow([{ t: 'nginx -T', mau: '#009639' }, { t: 'files read', mau: '#2563eb' }, { t: 'listen · server_name', mau: '#7c3aed' }, { t: 'locations', mau: '#b85a2b' }, { t: 'array directives', mau: '#c0392b' }], { h: 120, fs: 18 }), to: true,
    en: 'Key terms: nginx dash capital T, the configuration file lines, include glob order, conflicting server name, array type directives, and the snippet.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'main.conf + conf.d/*.conf — dump nginx -T, list the files read',
      `Add a ${c('-old.conf')} copy — count the warnings`,
      'Two blocks, one server_name — find the winner, rename, find it again',
      'One proxy_set_header in a location — read what the backend receives',
    ]), box('Keep these', `<ul><li>read nginx -T, not single files</li><li>the file list beats ls</li><li>duplicate name = warning, first wins</li><li>one proxy_set_header loses the rest</li></ul>`, 'lam'), ''),
    en: 'Your turn: dump the expanded config and list the files read; add a dash old dot conf copy and count the warnings; two blocks with one name — find the winner, rename a file, find it again; and one proxy set header in a location, read at the backend. Keep: read nginx dash capital T; the file list beats ls; a duplicate name is only a warning; one proxy set header loses the rest.' },
];
export const slides = lamDeck({ chuong: 'Chapter 11 — Diagnosis: making Nginx tell you what it did', bai: '11.3' }, S);
