/**
 * ngx-01-5 — Nginx · Chapter 1 · Lesson 1.5 "Three sites, wired end to end" (deck video + web, 12/11/2026). Bài web: nginx-1-5-bo-cuc-nhieu-site.
 * Output THẬT (scratchpad/ngx/demo/n1-5.txt; nginx/1.24.0): sites-available + liên kết mềm sites-enabled (00-default · 10-vidu · 20-api · 30-blog · 90-admin);
 * tám Host ⇒ 200/301/200/200/444/444/200/200; 127.0.0.1:8081 Host bất kỳ ⇒ ADMIN; bỏ cờ + đổi tên 00- ⇒ 99- ⇒ host lạ được 301 về trang chủ; trả cờ ⇒ 444.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n1-5:file:/tmp/ng/etc/nginx.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log /tmp/ng/logs/access.log;\n  absolute_redirect off;\n  include /tmp/ng/etc/sites-enabled/*.conf;\n}\n",
 "n1-5:file:/tmp/ng/etc/sites-available/00-default.conf": "# khoi bat-tat: KHONG server_name that, tu choi moi host la\nserver {\n  listen 8080 default_server;\n  server_name _;\n  access_log /tmp/ng/logs/mac-dinh.log;\n  return 444;\n}\n",
 "n1-5:file:/tmp/ng/etc/sites-available/10-vidu.conf": "server { listen 8080; server_name www.vidu.com; return 301 http://vidu.com:8080$request_uri; }\nserver { listen 8080; server_name vidu.com;     return 200 \"APEX + WWW\\n\"; }\n",
 "n1-5:file:/tmp/ng/etc/sites-available/20-api.conf": "server { listen 8080; server_name api.vidu.com; return 200 \"API\\n\"; }\n",
 "n1-5:file:/tmp/ng/etc/sites-available/30-blog.conf": "server { listen 8080; server_name blog.vidu.com; return 200 \"BLOG\\n\"; }\n",
 "n1-5:file:/tmp/ng/etc/sites-available/90-admin.conf": "server { listen 127.0.0.1:8081 default_server; server_name admin.vidu.com; return 200 \"ADMIN\\n\"; }\n",
 "n1-5:file:/root/bang.sh": "for h in vidu.com www.vidu.com api.vidu.com blog.vidu.com admin.vidu.com khong-ai-biet.com vidu.com. VIDU.COM; do\n  r=$(curl -s -o /tmp/than -w '%{http_code} %{redirect_url}' -H \"Host: $h\" http://127.0.0.1:8080/gio-hang)\n  c=${r%% *}; t=$([ \"$c\" = 200 ] && tr -d '\\n' < /tmp/than || echo -); [ \"$c\" = 000 ] && t=\"- (444)\"\n  printf '%-18s -> %-4s %-12s %s\\n' \"$h\" \"$c\" \"$t\" \"${r#* }\"; : > /tmp/than\ndone\n",
 "n1-5:setup": "",
 "n1-5:cay": "$ ls -l /tmp/ng/etc/sites-enabled/ | awk 'NR>1{print $9, $10, $11}'\n00-default.conf -> ../sites-available/00-default.conf\n10-vidu.conf -> ../sites-available/10-vidu.conf\n20-api.conf -> ../sites-available/20-api.conf\n30-blog.conf -> ../sites-available/30-blog.conf\n90-admin.conf -> ../sites-available/90-admin.conf\n$ nginx -c /tmp/ng/etc/nginx.conf -t 2>&1 | tail -1 && nginx -c /tmp/ng/etc/nginx.conf\nnginx: configuration file /tmp/ng/etc/nginx.conf test is successful\n$ nginx -T -c /tmp/ng/etc/nginx.conf 2>/dev/null | grep -nE '^# configuration file|listen'\n1:# configuration file /tmp/ng/etc/nginx.conf:\n11:# configuration file /tmp/ng/etc/sites-enabled/00-default.conf:\n14:  listen 8080 default_server;\n20:# configuration file /tmp/ng/etc/sites-enabled/10-vidu.conf:\n21:server { listen 8080; server_name www.vidu.com; return 301 http://vidu.com:8080$request_uri; }\n22:server { listen 8080; server_name vidu.com;     return 200 \"APEX + WWW\\n\"; }\n24:# configuration file /tmp/ng/etc/sites-enabled/20-api.conf:\n25:server { listen 8080; server_name api.vidu.com; return 200 \"API\\n\"; }\n27:# configuration file /tmp/ng/etc/sites-enabled/30-blog.conf:\n28:server { listen 8080; server_name blog.vidu.com; return 200 \"BLOG\\n\"; }\n30:# configuration file /tmp/ng/etc/sites-enabled/90-admin.conf:\n31:server { listen 127.0.0.1:8081 default_server; server_name admin.vidu.com; return 200 \"ADMIN\\n\"; }",
 "n1-5:tamtruonghop": "$ bash /root/bang.sh\nvidu.com           -> 200  APEX + WWW   \nwww.vidu.com       -> 301  -            http://vidu.com:8080/gio-hang\napi.vidu.com       -> 200  API          \nblog.vidu.com      -> 200  BLOG         \nadmin.vidu.com     -> 000  - (444)      \nkhong-ai-biet.com  -> 000  - (444)      \nvidu.com.          -> 200  APEX + WWW   \nVIDU.COM           -> 200  APEX + WWW   \n$ curl -s -H 'Host: bat-ky-cai-gi.com' http://127.0.0.1:8081/\nADMIN",
 "n1-5:doiten": "=== Bo co default_server. Tep van ten 00-default.conf ===\n$ bash /root/bang.sh | grep khong-ai-biet\nkhong-ai-biet.com  -> 000  - (444)      \n=== CUNG cau hinh. Chi doi ten tep: 00-default.conf -> 99-default.conf ===\n$ ls /tmp/ng/etc/sites-enabled/\n10-vidu.conf\n20-api.conf\n30-blog.conf\n90-admin.conf\n99-default.conf\n$ bash /root/bang.sh | grep khong-ai-biet\nkhong-ai-biet.com  -> 301  -            http://vidu.com:8080/gio-hang\n=== Tra lai co default_server (ten tep van la 99-) ===\n$ bash /root/bang.sh | grep -E 'khong-ai-biet|^vidu.com '\nvidu.com           -> 200  APEX + WWW   \nkhong-ai-biet.com  -> 000  - (444)      "
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, flow, tiers, icards, cmp, box, two, steps, kw, c } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-01-5', code: 'NGX 1.5', title: 'Three sites, wired end to end', sub: 'Chapter 1 · Lesson 1.5' };
const O = (k) => { const v = DU_LIEU[`n1-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.replace(/\/tmp\/ng\/etc\//g, '/etc/nginx/');

export const S = [
  { cover: true, nhan: 'Chapter 1 · Lesson 1.5', t: 'Three sites,<br>wired end to end', sub: 'Three sites and an admin page on one machine, a file each, plus a default that refuses — then rename ONE file and watch the behaviour change',
    en: 'Lesson 1.5. The whole chapter assembled: three sites and an admin page on one machine, a file each, plus a refusing default. Then we rename one file and watch the behaviour change.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A layout that scales: one file per site, available vs enabled</li>
    <li>All eight cases, measured in one table</li>
    <li>Why the admin port answers ANY Host</li>
    <li>Renaming one file changes routing — measured</li>
    <li>A four-item checklist for the whole chapter</li></ul>`,
    en: 'Five takeaways: the layout, eight measured cases, the admin port trap, the rename experiment, and a checklist for the whole chapter.' },
  { t: 'The layout on disk', body: two(ngc(`/etc/nginx/
├── nginx.conf            # http level + ONE include
├── sites-available/      # every site, enabled or not
│   ├── 00-default.conf   # catch-all, refuses
│   ├── 10-vidu.conf      # apex + www
│   ├── 20-api.conf
│   ├── 30-blog.conf
│   └── 90-admin.conf     # its own port
└── sites-enabled/        # symlinks: ln -s on, rm off`, { sm: true }), ngc(bo(O('file:/tmp/ng/etc/nginx.conf')), { sm: true, hl: [7, 8] })) +
    tn(bo(O('cay')).split('\n').slice(0, 6).join('\n'), { fs: 14 }),
    en: 'The layout: nginx.conf holds only the http level and one include line. Every site lives in its own file under sites-available; sites-enabled holds symlinks. Turning a site on is ln -s, turning it off is rm — the config file stays.' },
  { t: 'Four habits behind the layout', body: icards([
      ['page', '1 · One file per site', 'A site is a unit you switch on and off without touching lines another site depends on.'],
      ['list', '2 · Number the files', 'The glob loads in sorted order; a prefix makes that order visible instead of accidental.'],
      ['link', '3 · available vs enabled', 'Take a site down WITHOUT deleting its config — what you need at 2 a.m.'],
      ['search', '4 · Read the result with nginx -T', 'The assembled config, every include expanded, in load order.'],
    ], 2),
    en: 'Four habits. One file per site. Numbered file names, so the load order is visible. Available versus enabled, so you can disable a site without deleting its configuration. And read the final result with nginx -T.' },
  { t: 'All eight cases, measured', body: tn(bo(O('tamtruonghop')), { fs: 16 }) +
    two(box('Dot and case handled by Nginx', '<code>vidu.com.</code> (trailing dot) and <code>VIDU.COM</code> both reached the apex.', 'xanh'),
      box('admin.vidu.com on :8080 ⇒ 444', 'The admin block is not on this port at all, so the refusing default answers.', 'lam')),
    en: 'Eight Hosts on port 8080. vidu.com is served; www is redirected to the apex; api and blog are served; admin.vidu.com and an unknown name get 444 from the default; a trailing dot and capital letters still reach the apex.' },
  { t: 'Trap: the admin port answers ANY Host', body: ngc(bo(O('file:/tmp/ng/etc/sites-available/90-admin.conf')), { sm: true }) +
    tn(bo(O('tamtruonghop')).split('\n').slice(-2).join('\n'), { fs: 16 }) +
    box('Port 8081 is a different listen GROUP — with its own default', 'The admin block is the ONLY block on 127.0.0.1:8081, so it is that group\'s default and every request lands there whatever the Host says. Its server_name is decoration. Loopback is what protects it.', 'do2') +
    two(box('From another machine', '127.0.0.1 is not reachable from outside: the connection is refused before any Host is read.', 'xanh'),
      box('Change it to listen 8081', '…and the admin panel answers the whole Internet, for any Host. One edit, no warning from <code>nginx -t</code>.', 'do2')),
    en: 'The admin block listens on 127.0.0.1:8081 with default_server. It is the only block on that address, so every request to port 8081 lands there whatever the Host says — its server_name is decoration. What protects it is listening on loopback.' },
  { t: 'Rename ONE file — change nothing else', body: tn(bo(O('doiten')), { fs: 15 }),
    en: 'The experiment. Remove the default_server flag but keep the name 00-default.conf: unknown hosts still get 444, because the file loads first. Rename it to 99-default.conf: now unknown hosts get a 301 to the home page. Put the flag back: 444 again, and the real sites are untouched.' },
  { t: 'Why the rename changed routing', body: flow([
      { t: '99-default', s: 'now loads LAST' }, { t: '10-vidu.conf', s: 'first file on :8080', mau: '#c0392b' },
      { t: 'www redirect block', s: 'first block = implicit default', mau: '#c0392b' }, { t: 'unknown host → 301', s: 'sent to your home page', mau: '#c0392b' }], { h: 170 }) +
    icards([
      ['warn', 'No directive changed', 'No error, nginx -t is happy — only the load order moved.'],
      ['shield', 'The flag cuts the dependency', 'default_server pins the fallback; file names stop mattering (third run).'],
      ['cut', 'A redirect is a WORSE default', 'It makes your site answer for names you never registered and gives scanners a working endpoint.'],
    ], 3),
    en: 'Why: renamed to 99, the default loads last, so 10-vidu.conf becomes the first file on port 8080, and its first block — the www redirect — becomes the implicit default. No directive changed, no error appeared. The flag is what removes the dependency on file order.' },
  { t: 'The whole chapter in one picture', body: tiers([
      ['plug', '1 · Address and port choose the GROUP', 'Lesson 1.1 — specific IP beats wildcard', '#008a34'],
      ['filter', '2 · Host chooses the BLOCK inside the group', 'Lesson 1.2 — exact, *., .*, regex', '#2563eb'],
      ['shield', '3 · Nothing matched → that group\'s default', 'Lesson 1.3 — flag, or accidental first-loaded', '#7c3aed'],
      ['map', '4 · Only now: location', 'Chapter 2 — the block is final', '#b85a2b'],
    ], { th: 70, gap: 22 }),
    en: 'The chapter in one picture: the address and port choose the group; the Host chooses the block inside it; if nothing matches, that group\'s default; and only then does location matching start, in Chapter 2.' },
  { t: 'Checklist for every server you run', body: cmp(['Check', 'How'], [
      ['One refusing default PER listen group', 'count distinct address:port pairs; 80, 443 and an admin port need THREE'],
      ['No real site is the default by accident', '<code>nginx -T | grep -n \'listen\\|server_name\'</code>, read top down'],
      ['Every redirect target is a constant', 'grep <code>return 30</code>; <code>absolute_redirect off;</code> at http'],
      ['Reload, then MEASURE again', '<code>nginx -t &amp;&amp; nginx -s reload</code>, rerun the curl table — ten seconds'],
    ]) + box('"Passes the syntax check" ≠ "routes correctly"', 'Most puzzling Nginx behaviour is a directive working perfectly inside a block you did not expect to be chosen.', 'xanh'),
    en: 'A checklist: one refusing default per listen group; no real site as an accidental default; every redirect target a constant; and after every reload, rerun the curl table. Passing the syntax check is not the same claim as routing correctly.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('sites-available / sites-enabled', 'real files vs symlinks that switch them on'),
      kw('include glob', 'sites-enabled/*.conf loads in sorted order'),
      kw('listen group', 'all blocks on one address:port — each has its own default'),
      kw('Implicit default', 'the first-loaded block when no flag is set'),
      kw('www → apex', 'a tiny block with only a constant return 301'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: sites-available and sites-enabled, the include glob and its sorted order, a listen group, the implicit default, and the tiny www-to-apex redirect block.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build the five files and the symlinks; run ${c('nginx -T')}`,
      `Run the eight-Host curl table`,
      `Remove ${c('default_server')}, rename 00- to 99-, rerun`,
      `Put the flag back and prove the file name no longer matters`,
      `Send a junk Host to ${c('127.0.0.1:8081')} and read who answers`,
    ]), box('Keep these', `<ul><li>One file per site, symlinks to enable</li><li>Each listen group has its own default</li><li>Never let file order decide</li><li>Measure after every reload</li></ul>`, 'lam'), ''),
    en: 'Your turn: build the layout, run the eight-Host table, do the rename experiment, and put the flag back. Keep: one file per site, a default per listen group, never let file order decide, and measure after every reload.' },
];
export const slides = lamDeck({ chuong: 'Chapter 1 — How a request finds a server block', bai: '1.5' }, S);
