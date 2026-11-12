/**
 * ngx-08-1 — Nginx · Chapter 8 · Lesson 8.1 "rewrite and its four flags, measured" (deck video + web, 13/11/2026).
 * Bài web: nginx-8-1-rewrite. Output THẬT (scratchpad/ngx/demo/n8-1.txt; nginx/1.24.0):
 * last ⇒ 200 DICH uri=[/dich] request_uri=[/f-last/abc] · redirect ⇒ 302 Location …/dich?tu=redirect · permanent ⇒ 301 · không cờ ⇒ uri=[/buoc-2-abc]
 * break + return ⇒ TỆP (return KHÔNG chạy), y hệt break không return · đích có scheme, không cờ ⇒ 302 · query nối vào (args=[utm=x&id=7]) / dấu ? ⇒ args=[]
 * vòng a↔b ⇒ 500 + "rewrite or internal redirection cycle while processing "/vong-b"".
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n8-1:file:/tmp/ng/conf/rw.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8080;\n    root /tmp/ng/site;\n    location /dich        { return 200 \"DICH: uri=[$uri] request_uri=[$request_uri] args=[$args]\\n\"; }\n    location /f-last/     { rewrite ^/f-last/(.*)$      /dich last; }\n    location /f-redirect/ { rewrite ^/f-redirect/(.*)$  /dich?tu=redirect redirect; }\n    location /f-permanent/{ rewrite ^/f-permanent/(.*)$ /dich?tu=permanent permanent; }\n    location /f-khong/    { rewrite ^/f-khong/(.*)$ /buoc-1-$1;            # không cờ: đi tiếp\n                            rewrite ^/buoc-1-(.*)$  /buoc-2-$1;\n                            return 200 \"sau HAI rewrite: uri=[$uri]\\n\"; }\n    location /f-break/    { rewrite ^/f-break/(.*)$  /dich break;          # break rồi return: return có chạy không?\n                            return 200 \"RETURN NAY CO CHAY KHONG?\\n\"; }\n    location /f-break2/   { rewrite ^/f-break2/(.*)$ /dich break; }       # break, không có return\n    location /f-scheme/   { rewrite ^/f-scheme/(.*)$ http://vidu.com/$1; } # KHÔNG cờ nhưng đích có scheme\n    location /f-q1/       { rewrite ^/f-q1/(.*)$ /dich  last; }            # query string được NỐI vào\n    location /f-q2/       { rewrite ^/f-q2/(.*)$ /dich? last; }            # dấu ? ở cuối: VỨT query string\n    location /vong-a      { rewrite ^ /vong-b last; }                      # hai khối viết lại qua lại\n    location /vong-b      { rewrite ^ /vong-a last; }\n  }\n}\n",
 "n8-1:setup": "",
 "n8-1:bonco": "$ curl -s http://127.0.0.1:8080/f-last/abc\nDICH: uri=[/dich] request_uri=[/f-last/abc] args=[]\n$ curl -s -o /dev/null -w '%{http_code}  Location: %{redirect_url}\\n' http://127.0.0.1:8080/f-redirect/abc\n302  Location: http://127.0.0.1:8080/dich?tu=redirect\n$ curl -s -o /dev/null -w '%{http_code}  Location: %{redirect_url}\\n' http://127.0.0.1:8080/f-permanent/abc\n301  Location: http://127.0.0.1:8080/dich?tu=permanent\n$ curl -s http://127.0.0.1:8080/f-khong/abc\nsau HAI rewrite: uri=[/buoc-2-abc]",
 "n8-1:break": "$ curl -s http://127.0.0.1:8080/f-break/abc\nTEP DICH (tep tinh /dich trong root)\n$ curl -s http://127.0.0.1:8080/f-break2/abc\nTEP DICH (tep tinh /dich trong root)",
 "n8-1:luat": "$ curl -s -o /dev/null -w 'KHONG co, dich co scheme -> %{http_code}  Location: %{redirect_url}\\n' http://127.0.0.1:8080/f-scheme/abc\nKHONG co, dich co scheme -> 302  Location: http://vidu.com/abc\n$ curl -s 'http://127.0.0.1:8080/f-q1/abc?utm=x&id=7'\nDICH: uri=[/dich] request_uri=[/f-q1/abc?utm=x&id=7] args=[utm=x&id=7]\n$ curl -s 'http://127.0.0.1:8080/f-q2/abc?utm=x&id=7'\nDICH: uri=[/dich] request_uri=[/f-q2/abc?utm=x&id=7] args=[]\n$ curl -s -o /dev/null -w 'vong-a <-> vong-b -> %{http_code}\\n' http://127.0.0.1:8080/vong-a; grep -m1 -o 'rewrite or internal redirection cycle[^,]*' /tmp/ng/logs/error.log\nvong-a <-> vong-b -> 500\nrewrite or internal redirection cycle while processing \"/vong-b\""
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, path } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-08-1', code: 'NGX 8.1', title: 'rewrite and its four flags, measured', sub: 'Chapter 8 · Lesson 8.1' };
const O = (k) => { const v = DU_LIEU[`n8-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const KQ = (k) => O(k).split('\n').filter((l) => !l.startsWith('$ ')).join('\n');

/** Giải phẫu một lệnh rewrite: regex · thay thế · cờ. */
const giaiPhau = () => {
  const W = 1110, H = 200, phan = [['rewrite', 70, '#64748b', 'directive'], ['^/f-last/(.*)$', 330, '#2563eb', 'regex on $uri'], ['/dich', 170, '#009639', 'replacement'], ['last', 120, '#c0392b', 'the FLAG']];
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="monospace">`;
  let x = 20;
  phan.forEach(([t, w, mau, nhan]) => {
    s += `<rect x="${x}" y="40" width="${w + 80}" height="70" rx="12" fill="${mau}14" stroke="${mau}" stroke-width="3"/><text x="${x + (w + 80) / 2}" y="85" text-anchor="middle" font-size="26" font-weight="800" fill="${mau}">${t}</text>`;
    s += `<text x="${x + (w + 80) / 2}" y="150" text-anchor="middle" font-size="19" font-weight="700" fill="${mau}" font-family="Arial">${nhan}</text>`;
    x += w + 100;
  });
  s += `<text x="${W / 2}" y="190" text-anchor="middle" font-size="18" fill="#444" font-family="Arial">the regex and replacement build the new path — the FLAG decides what happens to the request next</text>`;
  return s + '</svg>';
};

export const S = [
  { cover: true, nhan: 'Chapter 8 · Lesson 8.1', t: 'rewrite and its four flags,<br>measured', sub: 'A regex, a replacement and a flag — the flag is the part that matters',
    en: 'Lesson 8.1. A rewrite is a regular expression, a replacement and a flag. The flag is the part that matters, and one of the four does something the configuration does not look like it does.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Four flags, one probe each: last, break, redirect, permanent</li>
    <li>What <code>break</code> silently skips — including <code>return</code></li>
    <li>A scheme in the replacement forces a 302</li>
    <li>The trailing <code>?</code>, and the 10-cycle limit</li>
    <li>When not to use rewrite at all, and how to debug one</li></ul>`,
    en: 'Five takeaways: four flags with one probe each; what break silently skips; a scheme forcing a redirect; the trailing question mark and the cycle limit; and when not to use rewrite at all, plus how to debug one.' },
  { t: 'Anatomy of one rewrite', body: giaiPhau() + ngc(`location /dich        { return 200 "DICH: uri=[$uri] request_uri=[$request_uri] args=[$args]\\n"; }
location /f-last/     { rewrite ^/f-last/(.*)$      /dich last; }
location /f-redirect/ { rewrite ^/f-redirect/(.*)$  /dich?tu=redirect redirect; }
location /f-permanent/{ rewrite ^/f-permanent/(.*)$ /dich?tu=permanent permanent; }
location /f-khong/    { rewrite ^/f-khong/(.*)$ /buoc-1-$1;     # no flag: keep going
                        rewrite ^/buoc-1-(.*)$  /buoc-2-$1;
                        return 200 "sau HAI rewrite: uri=[$uri]\\n"; }`, { hl: [1] }),
    en: 'Anatomy. The directive, a regex matched against the URI, a replacement, and the flag. One target block, /dich, prints the URI it sees and the original request URI, so every probe can show where the request ended up.' },
  { t: 'Four flags, one probe each', body: tn(KQ('bonco'), { fs: 16, wrap: 110 }) + cmp(['Flag', 'What happens next', 'Seen by the browser?'], [
      ['last', 'location matching RUNS AGAIN with the new $uri — another block answers', 'no'],
      ['break', 'stop rewriting, STAY in this block, serve the new $uri here', 'no'],
      ['redirect / permanent', '302 / 301 with a Location header — the client must ask again', 'yes, one round trip'],
      ['(no flag)', 'rewrite and CONTINUE — later rewrites see the new value', 'no'],
    ], { hl: [0] }),
    en: 'Four flags. Last: the request ended in the /dich block — the URI changed, the request URI did not, so logs stay honest. Redirect and permanent: three oh two and three oh one with a Location header; the browser must ask again. No flag: two rewrites chained into /buoc-2-abc.' },
  { t: 'last vs. break: where the request goes', body:
      path([{ t: 'last: /f-last/abc', s: 'rewrite … last' }, { t: 'match again', s: 'the 5-step location search', on: true }, { t: 'location /dich', s: 'ANOTHER block answers' }], { h: 140, fs: 21 }) +
      path([{ t: 'break: /f-break/abc', s: 'rewrite … break' }, { t: 'stay here', s: 'rewrite module stops', on: true, mau: '#c0392b' }, { t: 'root + /dich', s: 'THIS block serves the file' }], { h: 140, fs: 21 }) +
    two(box('last = an internal redirect you trigger on purpose', 'The same mechanism as try_files in Lesson 2.5: $uri becomes the new path and the whole location search runs again. Ten of them and the request dies.', 'lam'),
      box('break = use the new $uri right here', 'Exactly what you want in front of a proxy_pass or a root. It also does something else — next slide.', 'do2')),
    en: 'Last versus break. Last is an internal redirect you trigger on purpose: the URI changes and the whole location search runs again, so another block answers. Break stops rewriting and stays: the new URI is served by this block, which is what you want before a proxy pass or a root.' },
  { t: 'What break does that the config does not show', body: two(ngc(`location /f-break/ {
  rewrite ^/f-break/(.*)$ /dich break;
  return 200 "DOES THIS RETURN RUN?";
}
location /f-break2/ {
  rewrite ^/f-break2/(.*)$ /dich break;
}`, { hl: [3] }), tn(KQ('break'), { fs: 16, wrap: 50 }), 'r64') +
    box('break stops the WHOLE rewrite module — and return belongs to it', 'The two blocks answered identically: the file. The return after break never ran — and neither does any rewrite, set or if below a break. The docs say "stops processing the current set of ngx_http_rewrite_module directives"; you have to know return is one of them. proxy_pass is not, so rewrite … break; then proxy_pass is fine.', 'do2'),
    en: 'The trap. A block with rewrite break followed by return two hundred, and a block with only the rewrite. Both answered with the file — identical — which proves the return never ran. Break stops the whole rewrite module, and return, set and if belong to it. Proxy pass does not, so rewrite break then proxy pass is correct.' },
  { t: 'Rules that make rewrite predictable', body: tn(KQ('luat'), { fs: 15, wrap: 110 }) + icards([
      ['link', 'A scheme forces a redirect', 'replacement starts with http://, https:// or $scheme ⇒ 302, flag or not'],
      ['filter', 'The query string is APPENDED', 'unless the replacement ends with ? — then it is dropped (args=[])'],
      ['loop', '10 internal redirects ⇒ 500', '"rewrite or internal redirection cycle" — two blocks rewriting into each other'],
      ['layers', 'server-level rewrites run FIRST', 'on the original URI, before any location is chosen — they change WHICH block wins'],
    ], 2),
    en: 'Rules. With no flag but a replacement that starts with a scheme, nginx sent a three oh two anyway. The query string was appended — args utm and id — until a trailing question mark dropped it. Two blocks rewriting into each other died with five hundred and the cycle message. And rewrites at server level run first, on the original URI, changing which block wins.' },
  { t: 'Right, wrong, and usually unnecessary', body: ngc(`# RIGHT: fix the path, then forward — break BEFORE proxy_pass
location /cu/ {
  rewrite ^/cu/(.*)$ /moi/$1 break;
  proxy_pass http://api;            # not a rewrite directive ⇒ still runs
}

# RIGHT: a URL that really moved — tell the browser
rewrite ^/bai-viet/(\\d+)$ /tin/$1 permanent;

# WRONG: return after break — it never runs
# location /x/ { rewrite ^ /y break; return 200 "..."; }

# And usually no rewrite at all:
location = /cu-cu-cu { return 301 /moi; }   # cheaper, clearer`, { hl: [3, 4, 8, 14] }),
    en: 'Right and wrong. Fix the path then forward, with break before proxy pass. Tell the browser when a URL really moved, with permanent. Never put return after break. And usually you need no rewrite at all: an exact location with return three oh one is cheaper and clearer.' },
  { t: 'When NOT to use rewrite at all', body: icards([
      ['page', 'A fixed path moved → return 301', 'location = /gia { return 301 /bang-gia; } — no regex, short-circuits step 1 of matching'],
      ['merge', 'A prefix moved → return + $request_uri', 'location /cu/ { return 301 /moi$request_uri; } keeps /cu/ — use rewrite only to CUT or reshape the path'],
      ['map', 'Choosing a value → map (8.3)', 'map computes it once, lazily, at http level — a chain of rewrites setting variables is slower and harder to read'],
      ['plug', 'Changing the path on proxy → proxy_pass with a URI', 'proxy_pass http://api/; already replaces the matched prefix (3.1) — two mechanisms for one job'],
    ], 2),
    en: 'When not to use rewrite. A fixed path that moved: return three oh one. A prefix that moved: return with the request URI — careful, it keeps the old prefix. Choosing a value: map, lesson eight point three. Changing the path on the way to a proxy: proxy pass with a URI already does it.' },
  { t: 'How to debug a rewrite', body: two(steps([
      'Add, temporarily, to the block you THINK handles it:',
      `${c('return 200 "$uri | $request_uri | $args";')}`,
      'Send ONE request',
      'Did it fire? What did it build? Are you in the block you think?',
      'Remove the line when done',
    ]), box('Faster than reading regexes', 'Reading a chain of regular expressions is slower and — as the break measurement shows — can be confidently wrong. One request with one debug return answers all three questions at once.', 'lam'), 'r64'),
    en: 'Debugging a rewrite: add a temporary return that prints the URI, the request URI and the args to the block you think handles the request, and send one request. You see at once whether the rewrite fired, what it produced, and whether you are in the block you think.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('rewrite', 'regex + replacement + flag'),
      kw('last', 'match locations again'),
      kw('break', 'stay; skips return/set/if below'),
      kw('redirect / permanent', '302 / 301 to the browser'),
      kw('(no flag)', 'rewrite and continue'),
      kw('rewrite cycle', '10 internal redirects ⇒ 500'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: rewrite, last, break, redirect and permanent, no flag, and the rewrite cycle.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `One target block that prints ${c('$uri')} and ${c('$request_uri')}`,
      'Four blocks, one flag each — curl them',
      `${c('break')} followed by ${c('return')}: which one answers?`,
      `A replacement with ${c('http://')} and no flag; then add a trailing ${c('?')}`,
      'Two blocks that rewrite into each other — read error.log',
    ]), box('Keep these', `<ul><li>The flag decides</li><li>break skips return below it</li><li>Scheme in target ⇒ 302</li><li>Fixed move ⇒ return 301</li></ul>`, 'lam'), ''),
    en: 'Your turn: one block that prints the URI, four blocks with one flag each, break followed by return, a scheme in the replacement and a trailing question mark, and a rewrite cycle. Keep: the flag decides; break skips return; a scheme in the target forces a redirect; a fixed move is a return three oh one.' },
];
export const slides = lamDeck({ chuong: 'Chapter 8 — Rewrite, map, and the directives to avoid', bai: '8.1' }, S);
