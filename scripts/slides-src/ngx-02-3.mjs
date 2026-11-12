/**
 * ngx-02-3 — Nginx · Chapter 2 · Lesson 2.3 "Choosing a block also chooses which directives apply" (deck video + web, 12/11/2026). Bài web: nginx-2-3-chon-khoi-chon-luon-chi-thi.
 * Output THẬT (scratchpad/ngx/demo/n2-3.txt; nginx/1.24.0): / ⇒ chỉ X-Trong-Location (X-Tang-Server mất); /anh.jpg ⇒ Expires + X-Tang-Server; /anh-2.jpg ⇒ chỉ X-Rieng;
 * snippet include ⇒ đủ ba header + Cache-Control, quên include ⇒ chỉ Cache-Control; ^~ /a/tinh mất tác dụng dưới /a/tinh/sau ⇒ regex D thắng; hai regex ⇒ cái viết trước.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n2-3:setup": "",
 "n2-3:file:/tmp/ng/conf/pham-vi.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8080;\n    root /tmp/ng/site;\n    add_header X-Tang-Server \"co-o-tang-server\" always;\n    location / {\n      add_header X-Trong-Location \"co-o-location\" always;\n    }\n    location ~* \\.(jpg|png)$ {\n      expires 7d;\n    }\n    location = /anh-2.jpg {\n      add_header X-Rieng \"chi-cua-khoi-nay\" always;\n      return 200 \"anh 2\\n\";\n    }\n  }\n}\n",
 "n2-3:baurl": "$ for u in / /anh.jpg /anh-2.jpg; do echo \"--- $u ---\"; curl -sI \"http://127.0.0.1:8080$u\" | grep -iE '^(HTTP|X-|Expires|Cache-Control)'; done\n--- / ---\nHTTP/1.1 200 OK\nX-Trong-Location: co-o-location\n--- /anh.jpg ---\nHTTP/1.1 200 OK\nExpires: Thu, 19 Nov 2026 12:26:00 GMT\nCache-Control: max-age=604800\nX-Tang-Server: co-o-tang-server\n--- /anh-2.jpg ---\nHTTP/1.1 200 OK\nX-Rieng: chi-cua-khoi-nay",
 "n2-3:file:/tmp/ng/conf/snippets/header-bao-mat.conf": "add_header Strict-Transport-Security \"max-age=31536000\" always;\nadd_header X-Content-Type-Options    \"nosniff\" always;\nadd_header X-Frame-Options           \"SAMEORIGIN\" always;\n",
 "n2-3:file:/tmp/ng/conf/snippet.conf": "pid       /tmp/ng/logs/snip.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8081;\n    root /tmp/ng/site;\n    include /tmp/ng/conf/snippets/header-bao-mat.conf;\n    location /static/ {\n      include /tmp/ng/conf/snippets/header-bao-mat.conf;\n      add_header Cache-Control \"public, max-age=31536000, immutable\" always;\n      return 200 \"tinh\\n\";\n    }\n    location /quen/ {\n      add_header Cache-Control \"public, max-age=31536000, immutable\" always;\n      return 200 \"quen include\\n\";\n    }\n  }\n}\n",
 "n2-3:snippet": "$ for u in /static/a.css /quen/a.css; do echo \"--- $u ---\"; curl -sI \"http://127.0.0.1:8081$u\" | grep -iE '^(Strict|X-|Cache-Control)'; done\n--- /static/a.css ---\nStrict-Transport-Security: max-age=31536000\nX-Content-Type-Options: nosniff\nX-Frame-Options: SAMEORIGIN\nCache-Control: public, max-age=31536000, immutable\n--- /quen/a.css ---\nCache-Control: public, max-age=31536000, immutable",
 "n2-3:file:/tmp/ng/conf/trot.conf": "pid       /tmp/ng/logs/trot.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8082;\n    location = /             { return 200 \"A\\n\"; }\n    location ^~ /a/tinh      { return 200 \"B  ^~ /a/tinh\\n\"; }\n    location /a/tinh/sau     { return 200 \"C  /a/tinh/sau (thuong, DAI hon B)\\n\"; }\n    location ~ /a/.*\\.jpg    { return 200 \"D  ~ /a/.*\\\\.jpg\\n\"; }\n    location ~ \\.jpg         { return 200 \"E  ~ \\\\.jpg\\n\"; }\n    location /               { return 200 \"F\\n\"; }\n  }\n}\n",
 "n2-3:trot": "$ for u in /a/tinh/anh.jpg /a/tinh/sau/anh.jpg /b/anh.jpg /a/anh.jpg; do printf '%-22s -> ' $u; curl -s \"http://127.0.0.1:8082$u\"; done\n/a/tinh/anh.jpg        -> B  ^~ /a/tinh\n/a/tinh/sau/anh.jpg    -> D  ~ /a/.*\\.jpg\n/b/anh.jpg             -> E  ~ \\.jpg\n/a/anh.jpg             -> D  ~ /a/.*\\.jpg",
 "n2-3:trotva": "$ for u in /a/tinh/anh.jpg /a/tinh/sau/anh.jpg /a/anh.jpg; do printf '%-22s -> ' $u; curl -s \"http://127.0.0.1:8083$u\"; done\n/a/tinh/anh.jpg        -> B  ^~ /a/tinh\n/a/tinh/sau/anh.jpg    -> C  ^~ /a/tinh/sau (DA VA)\n/a/anh.jpg             -> D  ~ /a/.*\\.jpg",
 "n2-3:file:/tmp/ng/conf/trot-va.conf": "pid       /tmp/ng/logs/trotva.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8083;\n    location ^~ /a/tinh      { return 200 \"B  ^~ /a/tinh\\n\"; }\n    location ^~ /a/tinh/sau  { return 200 \"C  ^~ /a/tinh/sau (DA VA)\\n\"; }\n    location ~ /a/.*\\.jpg    { return 200 \"D  ~ /a/.*\\\\.jpg\\n\"; }\n    location /               { return 200 \"F\\n\"; }\n  }\n}\n"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, cay } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-02-3', code: 'NGX 2.3', title: 'Choosing a block also chooses which directives apply', sub: 'Chapter 2 · Lesson 2.3' };
const O = (k) => { const v = DU_LIEU[`n2-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.replace(/^\$ for u in ([^;]*); do .*$/m, (_, a) => `$ for u in ${a}; do curl -sI …$u; done`).replace(/\/tmp\/ng\/conf\//g, '');

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.3', t: 'Choosing a block also chooses<br>which directives apply', sub: 'A location picks a POINT on the config tree, and everything that applies is resolved from there — with one quiet exception that erases security headers',
    en: 'Lesson 2.3. Choosing a location does not only choose who handles the request. It picks a point on the configuration tree, and everything that applies is resolved from there — with one quiet exception that erases security headers.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>One server, three URLs, three different sets of headers — measured</li>
    <li>Scalar directives inherit down; array directives only when the child is silent</li>
    <li>How a site loses its security headers on exactly one path</li>
    <li>The fix: one snippet, included everywhere</li>
    <li>How ^~ loses its protection to a longer plain prefix</li></ul>`,
    en: 'Five takeaways: three URLs with three header sets; how scalar and array directives inherit; how security headers vanish on one path; the snippet fix; and how ^~ quietly stops protecting.' },
  { t: 'One server, three URLs, three sets of headers', body: two(ngc(O('file:/tmp/ng/conf/pham-vi.conf').split('\n').slice(8, 20).map((l) => l.replace(/^    /, '')).join('\n'), { hl: [1, 3, 9] }),
      tn(bo(O('baurl')), { fs: 15, wrap: 40 }), 'r64') +
    box('Read the three answers', '<code>/</code> lost X-Tang-Server: its location has an add_header of its own. <code>/anh.jpg</code> kept it — <code>expires</code> is not add_header, so it did not cut the inheritance. <code>/anh-2.jpg</code> shows ONLY X-Rieng.', 'lam'),
    en: 'One server. X-Tang-Server is set at the server level. Location slash adds its own header — and the server one disappears. The image regex sets none — so it inherits the server header. The exact /anh-2.jpg block adds X-Rieng — and both others are gone.' },
  { t: 'Two inheritance rules', body: cmp(['Kind', 'Examples', 'Child says nothing', 'Child says ONE thing'], [
      ['Scalar', '<code>root</code>, <code>client_max_body_size</code>, <code>proxy_read_timeout</code>', 'inherits the parent value', 'overrides — for itself only'],
      ['Array', '<code>add_header</code>, <code>proxy_set_header</code>, <code>fastcgi_param</code>', 'inherits the WHOLE parent list', 'REPLACES the whole list'],
    ]) + cay({ t: 'server · X-Tang-Server', mau: '#008a34' }, [
      { t: 'location /', s: '+1 ⇒ loses the server one', mau: '#c0392b' }, { t: '~* \\.(jpg|png)$', s: 'silent ⇒ inherits', mau: '#2563eb' }, { t: '= /anh-2.jpg', s: '+1 ⇒ loses it too', mau: '#c0392b' }], { w: 1110, h: 200 }),
    en: 'Two rules. A scalar directive inherits down and a child can override it for itself. An array directive is inherited whole only when the child is silent; one entry in the child replaces the entire list. No half merge, and no warning.' },
  { t: 'Trap: losing security headers on exactly one path', body: icards([
      ['shield', 'At server level', 'HSTS, nosniff, X-Frame-Options, a CSP — every page has them.'],
      ['page', 'Then: one Cache-Control', 'Someone adds <code>add_header Cache-Control …</code> to <code>location /static/</code>.'],
      ['warn', 'Result', 'Every static file loses ALL four security headers. nginx -t is happy; the response is 200.'],
    ], 3) + box('Invisible until someone looks', 'Nothing in the file hints that adding one line deleted four. Check per location with <code>curl -I</code>, never by reading.', 'do2'),
    en: 'This is how sites lose security headers on exactly one path: four headers at the server level, then one Cache-Control line in the static location, and every static file loses all four. Nginx -t is happy and the response is 200.' },
  { t: 'The fix: one snippet, included everywhere', body: ngc(O('file:/tmp/ng/conf/snippets/header-bao-mat.conf'), { sm: true }) +
    ngc(O('file:/tmp/ng/conf/snippet.conf').split('\n').slice(10, 18).map((l) => l.replace(/^    /, '').replace(/\/tmp\/ng\/conf\//, '/etc/nginx/')).join('\n'), { sm: true, hl: [2, 7] }) +
    tn(bo(O('snippet')), { fs: 13 }),
    en: 'The fix: put the security headers in one snippet file and include it in every block that has its own add_header. /static/ includes it and gets all three plus Cache-Control; /quen/ forgot the include and gets only Cache-Control.' },
  { t: 'And the block choice itself can slip', to: true, body: two(ngc(O('file:/tmp/ng/conf/trot.conf').split('\n').slice(7, 13).map((l) => l.trim().replace(/\{ return 200 "([^"]*)\\n"; \}/, (_, x) => `# ${x.split(' ')[0]}`)).join('\n'), { sm: true, hl: [2, 3] }),
      tn(O('trot').replace(/^\$ for u in ([^;]*); do .*$/m, (_, a) => `$ for u in ${a}; do curl …$u; done`), { fs: 14, wrap: 54 })) +
    box('^~ only protects while it is the LONGEST match', 'Adding a plain <code>/a/tinh/sau</code> for one sub-branch quietly re-opened every regex below it: /a/tinh/sau/anh.jpg went to regex D. And of two matching regexes, the one written first won.', 'do2') +
    two(box('The fix', 'Give the sub-branch its own <code>^~</code>: <code>location ^~ /a/tinh/sau</code>. Measured: /a/tinh/sau/anh.jpg goes back to C.', 'xanh'),
      box('Order between regexes', 'Two regexes that both match: the FIRST in the file wins, not the most specific (Lesson 2.1).', 'lam')),
    en: 'The choice itself can slip. ^~ on /a/tinh blocked the regexes — until a longer plain prefix /a/tinh/sau was added. Below it, the longest prefix is plain again, so the regex D ran and won. Between two regexes, the first in the file won.' },
  { t: 'What to check when a directive "does not take"', body: cmp(['Ask', 'How'], [
      ['Which block actually handled it?', 'temporary <code>add_header X-Loc "name" always;</code> per block, or Lesson 11.1'],
      ['Does that block set its own add_header / proxy_set_header?', 'then the parent list is GONE there'],
      ['Is a longer plain prefix beating your ^~?', 'run the five steps of Lesson 2.1 with that URI'],
      ['Is the value scalar?', 'then the nearest level wins — look up the tree with nginx -T'],
    ]) + box('A location is a SCOPE, not just a route', 'It decides who answers AND which configuration answers with it.', 'xanh'),
    en: 'When a directive does not take: find which block really handled the request, check whether that block sets its own array directive, check for a longer plain prefix beating your ^~, and for scalars look up the tree with nginx -T.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Scalar directive', 'one value; nearest level wins'),
      kw('Array directive', 'a list; replaced as a whole by one child entry'),
      kw('Snippet', 'a small file included where a list must be repeated'),
      kw('Scope', 'the point on the tree that resolves every directive'),
      kw('^~ protection', 'only while it is the longest matching prefix'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: scalar directive, array directive, snippet, scope, and the condition under which ^~ protects.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Rebuild the three-URL server; ${c('curl -I')} each URL`,
      `Move the security headers into a snippet; include it`,
      `Add a plain ${c('/a/tinh/sau')}; watch a regex win below it`,
      `Swap two regexes; see which one wins`,
    ]), box('Keep these', `<ul><li>A block is a scope</li><li>Arrays: one line replaces all</li><li>Repeat via a snippet</li><li>^~ only while longest</li></ul>`, 'lam'), ''),
    en: 'Your turn: reproduce the three header sets, move headers into a snippet, add a longer prefix under a ^~ and watch a regex win, and swap two regexes.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — Which location wins', bai: '2.3' }, S);
