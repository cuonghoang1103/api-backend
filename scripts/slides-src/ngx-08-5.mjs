/**
 * ngx-08-5 — Nginx · Chapter 8 · Lesson 8.5 "A real URL migration, assembled and measured" (deck video + web, 13/11/2026).
 * Bài web: nginx-8-5-chuyen-doi-url. Output THẬT (scratchpad/ngx/demo/n8-5.txt; nginx/1.24.0):
 * bảng: /gioi-thieu, /lien-he.html, /san-pham/cu-1 ⇒ 301 đúng đích · mẫu: /bai-viet/123 ⇒ /tin/123, /danh-muc/sach/trang/4 ⇒ /c/sach?trang=4 ·
 * không khớp: /moi 200, /tin/999 200, /khong-co-gi 404 · chuỗi /rat-cu: 301 → /gioi-thieu; -L ⇒ 200, 2 chặng · vòng /vong-a: -L ⇒ 5 chặng, curl thoát 47,
 * error.log 0 dòng · kiem-bang.py: 6 cặp, 3 dòng CHUOI.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n8-5:file:/tmp/ng/conf/chuyen-huong.map": "/gioi-thieu      /ve-chung-toi;\n/lien-he.html    /lien-he;\n/san-pham/cu-1   /san-pham/moi-1;\n/rat-cu          /gioi-thieu;\n/vong-a          /vong-b;\n/vong-b          /vong-a;\n",
 "n8-5:file:/tmp/ng/conf/doi.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  map $uri $dich_bang { default \"\"; include /tmp/ng/conf/chuyen-huong.map; }      # 1) bảng 1-1 trong tệp riêng\n  map $uri $dich_mau {                                                             # 2) quy tắc theo MẪU\n    default \"\";\n    \"~^/bai-viet/(\\d+)$\"            \"/tin/$1\";\n    \"~^/danh-muc/(.+)/trang/(\\d+)$\" \"/c/$1?trang=$2\";\n  }\n  map \"$dich_bang:$dich_mau\" $dich {                                               # 3) gộp: bảng thắng\n    default      \"\";\n    \"~^([^:]+):\" \"$1\";\n    \"~^:(.+)$\"   \"$1\";\n  }\n  server {\n    listen 8080;\n    if ($dich) { return 301 $dich; }                                               # 4) MỘT chỗ thi hành\n    location = /moi { return 200 \"TRANG MOI\\n\"; }\n    location = /ve-chung-toi { return 200 \"VE CHUNG TOI\\n\"; }\n    location /tin/  { return 200 \"TIN: uri=[$uri]\\n\"; }\n    location /      { return 404 \"khong tim thay\\n\"; }\n  }\n}\n",
 "n8-5:file:/root/kiem-bang.py": "# kiem-bang.py — bộ kiểm bảng chuyển hướng (chạy trong CI): đích nào cũng là KHOÁ ⇒ một chuỗi hoặc một vòng\nimport sys\ncap = {}\nfor line in open(sys.argv[1]):\n    p = line.strip().rstrip(';').split()\n    if len(p) == 2: cap[p[0]] = p[1]\nprint('so cap:', len(cap))\nfor k, v in cap.items():\n    if v in cap: print(f'CHUOI: {k} -> {v} -> {cap[v]}')\n",
 "n8-5:setup": "",
 "n8-5:do": "$ for u in /gioi-thieu /lien-he.html /san-pham/cu-1 /bai-viet/123 /danh-muc/sach/trang/4 /moi /tin/999 /khong-co-gi; do printf '%-24s -> ' $u; curl -s -o /tmp/than -w '%{http_code}  %{redirect_url}' http://127.0.0.1:8080$u; [ -s /tmp/than ] && grep -qv '<' /tmp/than && printf '  %s' \"$(cat /tmp/than)\"; echo; done\n/gioi-thieu              -> 301  http://127.0.0.1:8080/ve-chung-toi\n/lien-he.html            -> 301  http://127.0.0.1:8080/lien-he\n/san-pham/cu-1           -> 301  http://127.0.0.1:8080/san-pham/moi-1\n/bai-viet/123            -> 301  http://127.0.0.1:8080/tin/123\n/danh-muc/sach/trang/4   -> 301  http://127.0.0.1:8080/c/sach?trang=4\n/moi                     -> 200    TRANG MOI\n/tin/999                 -> 200    TIN: uri=[/tin/999]\n/khong-co-gi             -> 404    khong tim thay",
 "n8-5:chuoi": "$ printf '/rat-cu  khong theo : '; curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\\n' http://127.0.0.1:8080/rat-cu\n/rat-cu  khong theo : 301 -> http://127.0.0.1:8080/gioi-thieu\n$ printf '/rat-cu  theo -L    : '; curl -s -L -o /dev/null -w '%{http_code}, so chang=%{num_redirects}, cuoi=%{url_effective}\\n' http://127.0.0.1:8080/rat-cu\n/rat-cu  theo -L    : 200, so chang=2, cuoi=http://127.0.0.1:8080/ve-chung-toi\n$ printf '/vong-a  theo -L    : '; curl -s -L --max-redirs 5 -o /dev/null -w '%{http_code}, so chang=%{num_redirects}\\n' http://127.0.0.1:8080/vong-a; echo \"  (curl thoat ma $?)\"\n/vong-a  theo -L    : 301, so chang=5\n  (curl thoat ma 47)\n$ grep -c . /tmp/ng/logs/error.log || echo '  error.log: 0 dong — nginx KHONG biet co vong'\n0\n  error.log: 0 dong — nginx KHONG biet co vong",
 "n8-5:kiem": "$ python3 kiem-bang.py /tmp/ng/conf/chuyen-huong.map\nso cap: 6\nCHUOI: /rat-cu -> /gioi-thieu -> /ve-chung-toi\nCHUOI: /vong-a -> /vong-b -> /vong-a\nCHUOI: /vong-b -> /vong-a -> /vong-b"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, box, two, steps, kw, c, tiers } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-08-5', code: 'NGX 8.5', title: 'A real URL migration, assembled and measured', sub: 'Chapter 8 · Lesson 8.5' };
const O = (k) => { const v = DU_LIEU[`n8-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const KQ = (k) => O(k).split('\n').filter((l) => !l.startsWith('$ ')).join('\n');

/** Vòng chuyển hướng NGOÀI: mỗi 301 kết thúc một request; vòng chỉ tồn tại phía client. */
const vongNgoai = () => {
  const W = 1110, H = 210;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs><marker id="mv8" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#c0392b"/></marker></defs>`;
  s += `<rect x="20" y="60" width="220" height="90" rx="14" fill="#eef4ff" stroke="#2563eb" stroke-width="3"/><text x="130" y="112" text-anchor="middle" font-size="22" font-weight="800" fill="#2563eb">browser</text>`;
  s += `<rect x="870" y="60" width="220" height="90" rx="14" fill="#e6f6ec" stroke="#009639" stroke-width="3"/><text x="980" y="102" text-anchor="middle" font-size="22" font-weight="800" fill="#14532d">nginx</text><text x="980" y="130" text-anchor="middle" font-size="16" fill="#444">sees 5 NORMAL requests</text>`;
  for (let i = 0; i < 5; i++) {
    const y = 30 + i * 34, v = i % 2 ? '/vong-b' : '/vong-a';
    s += `<line x1="250" y1="${y + 10}" x2="860" y2="${y + 10}" stroke="#c0392b" stroke-width="2" marker-end="url(#mv8)" stroke-dasharray="${i ? '0' : '0'}"/><text x="555" y="${y + 4}" text-anchor="middle" font-size="16" font-weight="700" fill="#c0392b">GET ${v} → 301 ${i % 2 ? '/vong-a' : '/vong-b'}</text>`;
  }
  s += `<text x="${W / 2}" y="${H - 4}" text-anchor="middle" font-size="18" font-weight="800" fill="#c0392b">no 500 · no error.log line · the browser gives up: "too many redirects"</text>`;
  return s + '</svg>';
};

export const S = [
  { cover: true, nhan: 'Chapter 8 · Lesson 8.5', t: 'A real URL migration,<br>assembled and measured', sub: 'Three maps and ONE place that acts — about twenty lines',
    en: 'Lesson 8.5. Changing a site\'s URL structure means every old path in the world now points at nothing. The config that fixes it is this whole chapter working together, and it fits in about twenty lines.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three maps — table, patterns, merge — and ONE enforcement point</li>
    <li>Eight probes: table, patterns, untouched</li>
    <li>The chain and the loop nginx cannot see</li>
    <li>A twelve-line checker for CI</li>
    <li>The order to run a migration: 302 first</li></ul>`,
    en: 'Five takeaways: three maps and one enforcement point; eight probes; the chain and the loop nginx cannot see; a twelve line checker; and the order to run a migration.' },
  { t: 'Three maps and ONE place that acts', body: ngc(`map $uri $dich_bang { default ""; include /etc/nginx/chuyen-huong.map; }   # 1) one-to-one table
map $uri $dich_mau {                                                      # 2) PATTERN rules
  default "";
  "~^/bai-viet/(\\d+)$"            "/tin/$1";
  "~^/danh-muc/(.+)/trang/(\\d+)$" "/c/$1?trang=$2";
}
map "$dich_bang:$dich_mau" $dich {                                        # 3) merge: the TABLE wins
  default      "";
  "~^([^:]+):" "$1";
  "~^:(.+)$"   "$1";
}
server {
  if ($dich) { return 301 $dich; }                                        # 4) ONE enforcement point
}`, { hl: [1, 4, 5, 9, 13] }),
    en: 'The config. One: a one to one table in its own file. Two: pattern rules, where capture groups rebuild the new shape — even turning a path segment into a query parameter. Three: a map on the combined key merges them, and the table wins. Four: one place acts, an if with a return at server level.' },
  { t: 'Eight probes', body: tn(KQ('do'), { fs: 17, wrap: 110 }) + icards([
      ['db', 'The table: one-off moves', 'pages that moved for their own reasons — a thousand lines is still ONE hash lookup'],
      ['code', 'The patterns: structural change', 'one regex covers a million URLs, and can move a segment into the query'],
      ['check', 'No match ⇒ untouched', '$dich is empty, the request goes through exactly as before'],
    ], 3),
    en: 'Eight probes. Three table entries got three oh one to their new homes. Two pattern rules: an article id became slash tin, and a category page became slash c with a page parameter. And three URLs matched nothing and went through untouched: two hundred, two hundred, four oh four.' },
  { t: 'Why this shape', body: tiers([
      ['db', '1 · TABLE — exceptions', 'include file · editable by non-nginx people · one hash lookup', '#2563eb'],
      ['code', '2 · PATTERNS — the structure', 'a few regexes, capture groups rebuild the path', '#7c3aed'],
      ['merge', '3 · MERGE — explicit priority', 'combined key (8.3): a specific exception beats a general rule', '#c28a00'],
      ['flag', '4 · ONE enforcement point', 'if ($dich) return 301 — every URL checked once, at server level', '#009639'],
    ], { th: 74, gap: 22 }) + box('Easy to verify', 'Every decision is a table and exactly one place acts on the result. "What happens to this URL?" is answered by reading two data files and probing one directive — not by simulating a file of scattered rewrites in your head.', 'lam'),
    en: 'Why this shape. The table handles exceptions; patterns handle the structure; the merge gives an explicit priority; and one enforcement point checks every URL once. Every decision is a table and one place acts on it — so the whole migration can be checked by reading two data files and probing one directive.' },
  { t: 'The probe that found a problem', body: tn(KQ('chuoi'), { fs: 16, wrap: 110 }) + vongNgoai(),
    en: 'The probe that found a problem. Slash rat cu pointed at slash gioi thieu, which itself had moved: followed, it took two hops. And slash vong a and vong b pointed at each other: curl gave up after five hops. The error log had zero lines — nginx saw five perfectly normal requests.' },
  { t: 'Why nginx cannot protect you here', body: two(box('The 10-cycle limit of 2.5 does NOT apply', 'That limit is for INTERNAL redirects inside one request. Each 301 ENDS a request; the loop exists only across separate requests from the client. Nginx has no way to know two ordinary responses form a cycle.', 'do2'),
      box('A chain is the mild version', '/rat-cu reaches its target after TWO hops: it works, but costs an extra round trip and dilutes the signal a 301 is meant to carry to search engines.', 'cam')) +
    box('It is a property of the TABLE, not of the config', 'So the check belongs where the table is edited — in CI, next slide.', 'lam'),
    en: 'Why nginx cannot help. The ten cycle limit of lesson two point five is for internal redirects within one request. Each three oh one ends a request, so the loop exists only across requests, on the client side. A chain is the mild version: it works, but costs a hop and dilutes the signal. Both are properties of the table, so the check belongs where the table is edited.' },
  { t: 'A table checker for CI — twelve lines', body: ngc(`# kiem-bang.py — run in CI
import sys
cap = {}
for line in open(sys.argv[1]):
    p = line.strip().rstrip(';').split()
    if len(p) == 2: cap[p[0]] = p[1]
print('so cap:', len(cap))
# any TARGET that is also a KEY = a chain or a loop
for k, v in cap.items():
    if v in cap: print(f'CHUOI: {k} -> {v} -> {cap[v]}')`, { sm: true, hl: [9, 10] }) + tn(KQ('kiem'), { fs: 17, wrap: 110 }) +
    box('Flatten chains at the source', '/rat-cu must point STRAIGHT at /ve-chung-toi. The checker finds every case in one pass, and the rewrite is mechanical: take the final target of each chain.', 'xanh'),
    en: 'A checker for CI, twelve lines: read the pairs, and report every target that is also a key — that is a chain or a loop. It found all three cases. Flatten chains at the source: slash rat cu must point straight at its final target.' },
  { t: 'Rules for a migration that cannot go wrong', body: icards([
      ['clock', '301 is CACHED by browsers', 'sometimes forever — a wrong 301 is hard to take back. Ship 302 first, confirm with real traffic, then switch'],
      ['link', 'Keep old URLs working', 'a 404 loses the path AND the ranking; a 301 moves both — one hash lookup per request'],
      ['eye', 'Log $dich', 'a year later you see which old URLs are still requested — drop the rest, and learn who links to you'],
      ['list', 'Export the old URL list FIRST', 'from access logs, sitemap or database — you cannot build the table from URLs you no longer know'],
    ], 2),
    en: 'Rules. Browsers cache three oh one, sometimes forever, so ship three oh two first and switch after real traffic confirms the targets — a one character diff. Keep old URLs working: a four oh four loses the path and the ranking. Log the target, to retire entries later. And export the old URL list before changing anything.' },
  { t: 'The order to run a migration', body: steps([
      '<b>Export</b> the old URLs (access log, sitemap, database) BEFORE changing anything',
      '<b>Patterns first</b>, table second — most of a migration is structure; only true exceptions go in the table',
      `<b>Run the chain checker</b>, then probe every pattern with ${c('curl')} and read the Location`,
      `<b>Ship with 302</b>, watch real traffic, then change it to ${c('301')} — a one-character diff`,
    ]) + box('Eight probes covered the whole config', 'A real migration wants one probe per pattern plus a random sample from the table.', 'lam'),
    en: 'The order: export the old URLs first; write patterns first and keep only real exceptions in the table; run the chain checker and probe every pattern; ship with three oh two, watch, then switch to three oh one.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('redirect table', 'old ⇒ new, in an include file'),
      kw('pattern rule', 'one regex, many URLs'),
      kw('composite key', 'merge with explicit priority'),
      kw('single enforcement point', 'if ($dich) return 301'),
      kw('redirect chain', 'an extra hop'),
      kw('redirect loop', 'invisible to nginx'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the redirect table, a pattern rule, the composite key, a single enforcement point, a redirect chain, and a redirect loop.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Build the three maps and one if + return',
      'Probe the eight URLs and read every Location',
      `Add a chain and a loop; follow them with ${c('curl -L')}`,
      'Run the checker; flatten the chain',
      'Switch everything to 302 — then back to 301',
    ]), box('Keep these', `<ul><li>Table + patterns + merge</li><li>One enforcement point</li><li>Loops are invisible to nginx</li><li>302 first, 301 later</li></ul>`, 'lam'), ''),
    en: 'Your turn: build the maps, probe the eight URLs, add a chain and a loop and follow them, run the checker and flatten, and practise the three oh two then three oh one switch. Keep: table, patterns and merge; one enforcement point; loops are invisible to nginx; three oh two first.' },
];
export const slides = lamDeck({ chuong: 'Chapter 8 — Rewrite, map, and the directives to avoid', bai: '8.5' }, S);
