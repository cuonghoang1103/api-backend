/**
 * ngx-02-1 — Nginx · Chapter 2 · Lesson 2.1 "The four kinds of location, and the order they are tried" (deck video + web, 12/11/2026). Bài web: nginx-2-1-bon-loai-location.
 * Output THẬT (scratchpad/ngx/demo/n2-1.txt; nginx/1.24.0): bảy khối chồng lấn × mười hai URI (khớp bảng bài web); kéo tiền tố lên đầu tệp không đổi gì;
 * hai regex đổi thứ tự ⇒ đổi kết quả; location /api khớp /apiary, /api-docs.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n2-1:setup": "",
 "n2-1:file:/tmp/ng/conf/loc.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8080;\n    location = /a            { return 200 \"1. = /a            (khop CHINH XAC)\\n\"; }\n    location ^~ /a/tinh      { return 200 \"2. ^~ /a/tinh      (tien to UU TIEN)\\n\"; }\n    location ~ \\.php         { return 200 \"3. ~ .php          (regex, phan biet hoa thuong)\\n\"; }\n    location ~* \\.(jpg|gif)  { return 200 \"4. ~* .jpg .gif    (regex, KHONG phan biet hoa thuong)\\n\"; }\n    location /a/tinh/sau     { return 200 \"5. /a/tinh/sau     (tien to thuong, DAI hon #2)\\n\"; }\n    location /a              { return 200 \"6. /a              (tien to thuong)\\n\"; }\n    location /               { return 200 \"7. /               (tien to bat-tat)\\n\"; }\n  }\n}\n",
 "n2-1:file:/root/bang21.sh": "for u in /a /a/ /ab /a/tinh /a/tinh/x /a/tinh/sau/y /a/tinh/anh.jpg /a/x.php /A/X.JPG /a/x.PHP /khac /; do\n  printf '%-18s -> ' \"$u\"; curl -s \"http://127.0.0.1:8080$u\"\ndone\n",
 "n2-1:baykhoi": "$ bash bang21.sh\n/a                 -> 1. = /a            (khop CHINH XAC)\n/a/                -> 6. /a              (tien to thuong)\n/ab                -> 6. /a              (tien to thuong)\n/a/tinh            -> 2. ^~ /a/tinh      (tien to UU TIEN)\n/a/tinh/x          -> 2. ^~ /a/tinh      (tien to UU TIEN)\n/a/tinh/sau/y      -> 5. /a/tinh/sau     (tien to thuong, DAI hon #2)\n/a/tinh/anh.jpg    -> 2. ^~ /a/tinh      (tien to UU TIEN)\n/a/x.php           -> 3. ~ .php          (regex, phan biet hoa thuong)\n/A/X.JPG           -> 4. ~* .jpg .gif    (regex, KHONG phan biet hoa thuong)\n/a/x.PHP           -> 6. /a              (tien to thuong)\n/khac              -> 7. /               (tien to bat-tat)\n/                  -> 7. /               (tien to bat-tat)",
 "n2-1:dichuyen": "=== Tien to: keo len dau file KHONG doi gi — dai nhat van thang ===\n$ curl -s http://127.0.0.1:8082/a/tinh/sau/x\ntien to /a/tinh/sau (dai hon)\n=== Regex: DOI THU TU la doi ket qua ===\n$ curl -s http://127.0.0.1:8082/a/anh.jpg\nregex .jpg (viet TRUOC)\n$ curl -s http://127.0.0.1:8083/a/anh.jpg\nregex /a/...jpg (viet TRUOC)",
 "n2-1:file:/tmp/ng/conf/api.conf": "pid       /tmp/ng/logs/api.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8081;\n    location /api  { return 200 \"khoi /api\\n\"; }\n    location /api/ { return 200 \"khoi /api/\\n\"; }\n    location /     { return 200 \"khoi /\\n\"; }\n  }\n}\n",
 "n2-1:apiary": "$ for u in /api /api/ /api/users /apiary /api-docs; do printf '%-12s -> ' \"$u\"; curl -s \"http://127.0.0.1:8081$u\"; done\n/api         -> khoi /api\n/api/        -> khoi /api/\n/api/users   -> khoi /api/\n/apiary      -> khoi /api\n/api-docs    -> khoi /api",
 "n2-1:file:/tmp/ng/conf/thutu.conf": "pid       /tmp/ng/logs/thutu.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8082;\n    location /a               { return 200 \"tien to /a  (keo len DAU file)\\n\"; }\n    location /a/tinh/sau      { return 200 \"tien to /a/tinh/sau (dai hon)\\n\"; }\n    location ~ \\.jpg          { return 200 \"regex .jpg (viet TRUOC)\\n\"; }\n    location ~ /a/.*\\.jpg     { return 200 \"regex /a/...jpg (viet SAU)\\n\"; }\n  }\n  server {\n    listen 8083;\n    location ~ /a/.*\\.jpg     { return 200 \"regex /a/...jpg (viet TRUOC)\\n\"; }\n    location ~ \\.jpg          { return 200 \"regex .jpg (viet SAU)\\n\"; }\n  }\n}\n"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, tiers, icards, cmp, box, two, steps, kw, c, tbl } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-02-1', code: 'NGX 2.1', title: 'The four kinds of location, and the order they are tried', sub: 'Chapter 2 · Lesson 2.1' };
const O = (k) => { const v = DU_LIEU[`n2-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const conf = () => O('file:/tmp/ng/conf/loc.conf').split('\n').filter((l) => /location/.test(l)).map((l) => l.trim().replace(/\{ return 200 "([^"]*)\\n"; \}/, (_, x) => `{ … }  # ${x.split('(')[0].trim()}`)).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.1', t: 'The four kinds of location,<br>and the order they are tried', sub: 'Nginx does NOT read locations top to bottom and take the first match. Ten minutes to the real algorithm — and a whole class of confusion is gone',
    en: 'Chapter 2, lesson 2.1. Almost everyone starts with the same wrong model: Nginx reads the location blocks top to bottom and takes the first match. It does not.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The four kinds: <code>=</code>, <code>^~</code>, regex <code>~</code> / <code>~*</code>, plain prefix</li>
    <li>Seven overlapping blocks, twelve URIs — measured</li>
    <li>The five-step algorithm that produces every row</li>
    <li>Prefixes race by LENGTH, regexes race by POSITION</li>
    <li>The trap: a prefix does not stop at a slash</li></ul>`,
    en: 'Five takeaways: the four kinds of location; a table of seven overlapping blocks and twelve URIs; the five-step algorithm; why prefixes race by length and regexes by position; and why a prefix does not stop at a slash.' },
  { t: 'Seven blocks, deliberately overlapping', body: ngc(conf(), { sm: true }) + icards([
      ['check', '= exact', 'equal, character for character'],
      ['shield', '^~ preferred prefix', 'a prefix that blocks the regex step'],
      ['code', '~ / ~* regex', 'case-sensitive / case-insensitive'],
      ['filter', 'plain prefix', '"the URI starts with…"'],
    ], 4),
    en: 'Seven blocks that overlap on purpose: an exact match on /a, a preferred prefix /a/tinh, two regexes, a longer plain prefix, a plain prefix /a and the catch-all slash.' },
  { t: 'Twelve URIs, measured on nginx 1.24', body: tn(O('baykhoi').replace(/^\$ bash bang21.sh$/m, '$ for u in /a /a/ /ab … /; do curl -s localhost:8080$u; done'), { fs: 15 }) +
    box('Not "top to bottom" in any consistent way', '/a/x.php skips blocks 1 and 2 and lands on 3; /a/tinh/anh.jpg stops at 2 and never reaches 4, although 4 obviously matches. One algorithm produces all twelve rows.', 'do2'),
    en: 'Twelve URIs, measured. Read once and it is clearly not top to bottom: /a/x.php skips blocks one and two to land on three, while /a/tinh/anh.jpg stops at two and never reaches four. A single algorithm produces every row.' },
  { t: 'The algorithm, in the order Nginx runs it', body: tiers([
      ['check', '1 · Any EXACT match?', '= /uri equal to the URI ⇒ use it, STOP', '#008a34'],
      ['filter', '2 · Find the LONGEST matching prefix', 'plain and ^~ alike — remember it, commit nothing', '#2563eb'],
      ['shield', '3 · Does that longest prefix carry ^~ ?', 'yes ⇒ use it, SKIP the regexes', '#7c3aed'],
      ['code', '4 · Try regexes in FILE ORDER', 'the first match wins outright', '#c0392b'],
      ['map', '5 · No regex matched ⇒ the remembered prefix', 'none at all ⇒ 404', '#b85a2b'],
    ], { th: 64, gap: 18 }),
    en: 'The algorithm: one, any exact match ends the search. Two, find the longest matching prefix and remember it. Three, if that prefix carries ^~, use it and skip regexes. Four, try regexes in file order; the first match wins. Five, otherwise use the remembered prefix.' },
  { t: 'Reading four rows back out of the algorithm', body: tbl(['URI', 'What happened', 'Block'], [
      ['<code>/a</code>', 'step 1 fires — nothing else is asked', '1 · = /a'],
      ['<code>/a/</code>', 'one character breaks the exact match ⇒ longest prefix /a', '6 · /a'],
      ['<code>/a/tinh/anh.jpg</code>', 'longest prefix is ^~ /a/tinh ⇒ regexes skipped', '2 · ^~ /a/tinh'],
      ['<code>/a/x.php</code>', 'longest prefix /a is plain ⇒ regex runs and wins', '3 · ~ \\.php'],
    ]) + box('= means EQUAL, not "starts with"', 'That is why <code>location = /</code> is the cheapest way to serve a busy home page: one comparison, no prefix walk, no regex scan.', 'xanh'),
    en: 'Four rows read back. /a fires step one. /a/ breaks the exact match by one character and falls to the longest prefix /a. /a/tinh/anh.jpg is stopped at step three by ^~. And /a/x.php has a plain longest prefix, so the regex runs and wins.' },
  { t: 'Prefixes race by LENGTH, regexes by POSITION', body: tn(O('dichuyen'), { fs: 16 }) + two(
      box('Moving a PREFIX block changes nothing', '/a written first in the file still lost to the longer /a/tinh/sau.', 'lam'),
      box('Moving a REGEX block can change everything', 'Same two regexes in swapped order ⇒ /a/anh.jpg lands on a different block.', 'do2')),
    en: 'Measured: a prefix block moved to the top of the file changes nothing — the longer prefix still wins. Two regexes in swapped order send the same URI to a different block. Prefixes race by length; regexes race by position.' },
  { t: '^~ is about the regexes, not about prefix rank', body: cmp(['Directive', 'What it changes', 'What it does NOT change'], [
      ['<code>location = /x</code>', 'ends matching immediately', '— (it is not a prefix at all)'],
      ['<code>location ^~ /x</code>', 'skips step 4 when it is the LONGEST prefix', 'does not beat a LONGER plain prefix'],
      ['<code>location /</code>', 'the floor — prefix of everything, always shortest', 'wins only when nothing else does'],
    ]) + box('Deleting location / does not harden anything', 'Misses just become 404s produced by Nginx instead of by your handler. Lesson 2.3 shows ^~ losing its protection to a longer prefix.', 'lam'),
    en: '^~ does not make a prefix stronger than a longer prefix — step two still chooses by length. It only decides whether step four runs. And location slash is the floor: it matches everything and wins only when nothing else does.' },
  { t: 'Trap: a prefix does NOT stop at a slash', body: two(ngc(O('file:/tmp/ng/conf/api.conf').split('\n').slice(6, 10).map((l) => l.trim()).join('\n'), { sm: true }), tn(O('apiary'), { wrap: 56, fs: 15 })) +
    box('location /api also catches /apiary and /api-docs', '"/api" means "the URI starts with the four characters /api" — not "the first path segment is api". Harmless until one of those is a path you did not mean to proxy. Use <code>/api/</code>.', 'do2') +
    two(box('The usual fix', '<code>location /api/ { … }</code> for the tree, plus <code>location = /api { return 301 /api/; }</code> for the bare word.', 'xanh'),
      box('With proxy_pass it is automatic', 'A prefix ending in / that uses proxy_pass answers a request for <code>/api</code> with a 301 to <code>/api/</code> by itself — when no other block matches it.', 'lam')),
    en: 'The trap: location /api is a prefix of four characters. It caught /apiary and /api-docs as well. If you mean the folder, write /api/ with the trailing slash.' },
  { t: 'Using this in real life', to: true, body: steps([
      'A request went to the wrong block? Do NOT read the file top to bottom.',
      'Run the five steps in your head with THAT exact URI.',
      'Four times out of five the answer appears at step 2: a prefix you forgot was longer.',
      'Confirm with one temporary <code>return 200 "$uri"</code> — never by guessing.',
    ]) + ngc(`# exact match for the hot path: one comparison, done
location = /healthz { access_log off; return 200 "ok\\n"; }`),
    en: 'In real life: when a request lands in the wrong block, run the five steps with that exact URI instead of reading the file top to bottom. Most of the time step two reveals a longer prefix you forgot about.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('location = /uri', 'exact match — ends the search'),
      kw('location ^~ /p', 'preferred prefix — skips regexes when longest'),
      kw('location ~ / ~*', 'regex, case-sensitive / insensitive, file order'),
      kw('plain prefix', '"starts with"; the longest one wins'),
      kw('location /', 'the floor that matches everything'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: exact match, preferred prefix, case-sensitive and case-insensitive regex, plain prefix, and location slash as the floor.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build the seven blocks; curl the twelve URIs`,
      `Move a prefix block to the top; prove nothing changes`,
      `Swap two regexes; watch one URI change block`,
      `Write ${c('location /api')}; curl ${c('/apiary')}`,
    ]), box('Keep these', `<ul><li>Exact ends everything</li><li>Longest prefix, then ^~?, then regex by order</li><li>Length for prefixes, position for regexes</li><li>A prefix is characters, not segments</li></ul>`, 'lam'), ''),
    en: 'Your turn: rebuild the table, prove that moving a prefix changes nothing, swap two regexes, and see /api catch /apiary. Keep the five steps.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — Which location wins', bai: '2.1' }, S);
