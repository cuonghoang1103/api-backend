/**
 * ngx-08-3 — Nginx · Chapter 8 · Lesson 8.3 "map: the lookup table that replaces every if" (deck video + web, 13/11/2026).
 * Bài web: nginx-8-3-map. Output THẬT (scratchpad/ngx/demo/n8-3.txt; nginx/1.24.0):
 * ?v= / gi-do ⇒ MAC-DINH · a ⇒ khop-chinh-xac-a · so-42 ⇒ regex-bat-duoc-42 · HOA-abc / hoa-abc ⇒ regex-khong-phan-biet ·
 * hostnames: vidu.com chinh · api.vidu.com con · vidu.vn moi-duoi · khac.com khac · nối map: noi_tiep=[day-la-regex] ·
 * khoá ghép: co:co ⇒ CA HAI, còn lại khong; a=x:y&b=z và a=x&b=y:z ĐỀU thành khoá [x:y:z] (đụng nhau) ·
 * bảng chuyển hướng trong tệp: /cu/gioi-thieu ⇒ 301 /ve-chung-toi … · /khac ⇒ 200.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n8-3:file:/tmp/ng/conf/chuyen-huong.map": "/cu/gioi-thieu   /ve-chung-toi;\n/cu/bang-gia     /gia;\n/blog/2019/xin-chao  /tin/xin-chao;\n",
 "n8-3:file:/tmp/ng/conf/map.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  map $arg_v $ket_qua {\n    default          \"MAC-DINH\";\n    \"a\"              \"khop-chinh-xac-a\";\n    \"~^so-(\\d+)$\"    \"regex-bat-duoc-$1\";     # ~  phân biệt hoa thường, nhóm bắt dùng được\n    \"~*^HOA\"         \"regex-khong-phan-biet\"; # ~* không phân biệt\n  }\n  map $http_host $nhom {\n    hostnames;\n    default    \"khac\";\n    vidu.com   \"chinh\";\n    *.vidu.com \"con\";\n    vidu.*     \"moi-duoi\";\n  }\n  map $ket_qua $noi_tiep { default \"khac\"; \"MAC-DINH\" \"day-la-mac-dinh\"; \"~^regex-\" \"day-la-regex\"; }   # map đọc kết quả map khác\n  map \"$arg_a:$arg_b\" $ca_hai { default \"khong\"; \"~^co:co$\" \"CA HAI deu co\"; }\n  map $request_uri $dich_cu { include /tmp/ng/conf/chuyen-huong.map; }       # bảng chuyển hướng trong tệp riêng\n  server {\n    listen 8080;\n    location /k/   { return 200 \"?v=$arg_v -> $ket_qua\\n\"; }\n    location /h/   { return 200 \"Host: $http_host -> $nhom\\n\"; }\n    location /n/   { return 200 \"ket_qua=[$ket_qua] noi_tiep=[$noi_tiep]\\n\"; }\n    location /and/ { return 200 \"a=$arg_a b=$arg_b -> $ca_hai   (khoa ghep: [$arg_a:$arg_b])\\n\"; }\n    location /     { if ($dich_cu) { return 301 $dich_cu; }  return 200 \"khong co trong bang: $request_uri\\n\"; }\n  }\n}\n",
 "n8-3:setup": "",
 "n8-3:bonkhoa": "$ for v in '' a so-42 HOA-abc hoa-abc gi-do; do curl -s \"http://127.0.0.1:8080/k/?v=$v\"; done\n?v= -> MAC-DINH\n?v=a -> khop-chinh-xac-a\n?v=so-42 -> regex-bat-duoc-42\n?v=HOA-abc -> regex-khong-phan-biet\n?v=hoa-abc -> regex-khong-phan-biet\n?v=gi-do -> MAC-DINH",
 "n8-3:hostnames": "$ for h in vidu.com api.vidu.com vidu.vn khac.com; do curl -s -H \"Host: $h\" http://127.0.0.1:8080/h/; done\nHost: vidu.com -> chinh\nHost: api.vidu.com -> con\nHost: vidu.vn -> moi-duoi\nHost: khac.com -> khac\n$ curl -s 'http://127.0.0.1:8080/n/?v=so-42'\nket_qua=[regex-bat-duoc-42] noi_tiep=[day-la-regex]",
 "n8-3:ghep": "$ for q in 'a=co&b=co' 'a=co&b=khong' 'a=khong&b=co'; do curl -s \"http://127.0.0.1:8080/and/?$q\"; done\na=co b=co -> CA HAI deu co   (khoa ghep: [co:co])\na=co b=khong -> khong   (khoa ghep: [co:khong])\na=khong b=co -> khong   (khoa ghep: [khong:co])\n$ for q in 'a=x:y&b=z' 'a=x&b=y:z'; do curl -s \"http://127.0.0.1:8080/and/?$q\"; done\na=x:y b=z -> khong   (khoa ghep: [x:y:z])\na=x b=y:z -> khong   (khoa ghep: [x:y:z])",
 "n8-3:bang": "$ for u in /cu/gioi-thieu /cu/bang-gia /blog/2019/xin-chao /khac; do curl -s -o /dev/null -w \"$u -> %{http_code} %{redirect_url}\\n\" http://127.0.0.1:8080$u; done\n/cu/gioi-thieu -> 301 http://127.0.0.1:8080/ve-chung-toi\n/cu/bang-gia -> 301 http://127.0.0.1:8080/gia\n/blog/2019/xin-chao -> 301 http://127.0.0.1:8080/tin/xin-chao\n/khac -> 200 "
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, path } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-08-3', code: 'NGX 8.3', title: 'map: the lookup table that replaces every if', sub: 'Chapter 8 · Lesson 8.3' };
const O = (k) => { const v = DU_LIEU[`n8-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const KQ = (k) => O(k).split('\n').filter((l) => !l.startsWith('$ ')).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 8 · Lesson 8.3', t: 'map: the lookup table<br>that replaces every if', sub: 'Declared at http level, evaluated lazily, restructures nothing',
    en: 'Lesson 8.3. A map declares: given this variable, produce that one. It lives at http level, it is evaluated lazily, and it restructures nothing — which is exactly why it can safely do the job lesson eight point two measured breaking.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Four kinds of key, measured</li>
    <li>How a lookup runs: exact hash → regex in order → default</li>
    <li>hostnames, and one map reading another</li>
    <li>The AND nginx does not have — and the separator trap</li>
    <li>A redirect table in its own file</li></ul>`,
    en: 'Five takeaways: four kinds of key; how a lookup runs; hostnames and chaining; the and that nginx does not have, with its separator trap; and a redirect table kept in its own file.' },
  { t: 'Four kinds of key, measured', body: two(ngc(`map $arg_v $ket_qua {
  default        "MAC-DINH";
  "a"            "khop-chinh-xac-a";
  "~^so-(\\d+)$"  "regex-bat-duoc-$1";
  "~*^HOA"       "regex-khong-phan-biet";
}
location /k/ { return 200 "?v=$arg_v -> $ket_qua\\n"; }`, { hl: [3, 4, 5] }), tn(KQ('bonkhoa'), { fs: 19, wrap: 40 }), 'r64') +
    cmp(['Key form', 'Means', 'Measured'], [['"a"', 'exact string', 'a ⇒ khop-chinh-xac-a'], ['"~…"', 'regex, case-sensitive', 'so-42 ⇒ regex-bat-duoc-42'], ['"~*…"', 'regex, case-insensitive', 'hoa-abc ⇒ regex-khong-phan-biet'], ['default', 'everything else', 'gi-do ⇒ MAC-DINH']], {}) +
    box('~ is case-sensitive, ~* is not — and $1 works on the right', 'so-42 produced regex-bat-duoc-42: the capture group of the key is usable in the value. hoa-abc matched ~*^HOA. Anything else fell to default.', 'lam'),
    en: 'Four kinds of key. An empty v and an unknown v fell to the default. a matched the exact key. so forty two matched the regex, and the capture group appeared on the right: regex bat duoc forty two. And the case insensitive regex matched both upper and lower case.' },
  { t: 'How one lookup runs', body: path([{ t: 'exact keys', s: 'ONE hash lookup', on: true }, { t: 'regex keys', s: '~ and ~*, in ORDER' }, { t: 'default', s: 'or "" if not declared', mau: '#64748b' }], { h: 150, fs: 22 }) + icards([
      ['db', 'Exact keys are a HASH TABLE', 'not a scan — a thousand-line map is as fast as a three-line one; the right structure for a redirect table'],
      ['search', 'Regex keys are tried IN ORDER', 'after every exact key missed; capture groups work in the value'],
      ['power', 'default catches the rest', 'without it the result is "" — which switches off an add_header or a limit_req; declare it anyway'],
      ['clock', 'It costs NOTHING until read', 'lazy: a map only one location uses does no work for any other request'],
    ], 2),
    en: 'How a lookup runs. Exact keys first, as one hash lookup — a thousand line map is as fast as a three line one. Then regex keys, in order. Then default; without one the result is an empty string, which switches things off. And nothing is computed until something reads the variable.' },
  { t: 'hostnames, and one map reading another', body: two(ngc(`map $http_host $nhom {
  hostnames;
  default    "khac";
  vidu.com   "chinh";
  *.vidu.com "con";
  vidu.*     "moi-duoi";
}
map $ket_qua $noi_tiep {
  default    "khac";
  "MAC-DINH" "day-la-mac-dinh";
  "~^regex-" "day-la-regex";
}`, { sm: true, hl: [2, 8] }), tn(KQ('hostnames'), { fs: 16, wrap: 50 }), 'r64') + icards([
      ['flag', 'hostnames turns on wildcards', '*.name and name.* like server_name (Ch.1), label by label — without it they are literal strings'],
      ['link', 'Chaining builds anything complex', 'one map normalises, the next classifies, a third decides — each a flat table you can read alone'],
    ], 2),
    en: 'Host names mode turns on the wildcard forms, the same as server name in chapter one: api dot vidu matched star dot vidu, vidu dot vn matched vidu dot star. And one map can read another: so forty two went through the first map, then the second classified it as a regex result.' },
  { t: 'The AND nginx does not have', body: two(ngc(`map "$arg_a:$arg_b" $ca_hai {
  default     "khong";
  "~^co:co$"  "CA HAI deu co";
}`, { hl: [1] }), tn(KQ('ghep').replace(/   \(khoa ghep/g, '\n   (khoa ghep'), { fs: 15, wrap: 50 }), 'r64') +
    box('The separator matters', 'a=x:y&amp;b=z and a=x&amp;b=y:z both built the SAME key x:y:z. A colon is fine for flags you control; for user input use a character that cannot occur in a URL, such as \\x1f.', 'do2'),
    en: 'There is no and operator. Build one string from both variables and match a pattern against it: only co and co matched. But the separator matters: a equals x colon y with b equals z, and a equals x with b equals y colon z, produced the same key. For user input, use a separator that cannot occur.' },
  { t: 'A redirect table in its own file', body: ngc(`map $request_uri $dich_cu {
  include /etc/nginx/chuyen-huong.map;
}
location / {
  if ($dich_cu) { return 301 $dich_cu; }     # if + return: OK (8.2)
}`, { hl: [2, 5] }) + two(ngc(`# chuyen-huong.map — one pair per line
/cu/gioi-thieu       /ve-chung-toi;
/cu/bang-gia         /gia;
/blog/2019/xin-chao  /tin/xin-chao;`, { sm: true }), tn(KQ('bang'), { fs: 12, wrap: 70 })) +
    box('Someone who does not know nginx can edit it', 'A thousand-line redirect table lives in its own file, as one hash lookup. And the only if is an if with a return — the one shape that is safe.', 'xanh'),
    en: 'A redirect table in its own file: one old path and one new path per line, included into a map. Measured: each old path got a three oh one to its new home, and an unknown path got two hundred. Someone who does not know nginx can edit the file, and the only if left is an if with a return.' },
  { t: 'Three map patterns you can use today', body: ngc(`# 1) A header per environment — no if at all
map $http_host $moi_truong { default "san-xuat"; "~^thu-nghiem" "thu-nghiem"; }
add_header X-Moi-Truong $moi_truong always;

# 2) The redirect table (previous slide)
map $request_uri $dich_cu { include /etc/nginx/chuyen-huong.map; }

# 3) Exempt internal addresses from a rate limit
map $binary_remote_addr $khoa_gioi_han {
  default    $binary_remote_addr;
  "~^\\x7f"   "";                      # empty = NOT limited (7.2)
}
limit_req_zone $khoa_gioi_han zone=chung:10m rate=20r/s;`, { hl: [3, 6, 11] }),
    en: 'Three patterns. A header per environment, with no if. The redirect table. And exempting internal addresses from a rate limit: the map returns an empty key, and an empty key is not limited — the rule from lesson seven point two.' },
  { t: 'More of map, and the shift in thinking', body: icards([
      ['page', 'include pulls the table out', 'map … { include file.map; } — one "key value;" pair per line'],
      ['loop', 'volatile switches off the caching', 'the value is computed once per request; volatile; recomputes it after an internal redirect changes $uri'],
      ['layers', 'Declarative, not imperative', 'a map is a TABLE from input to output; if is a command that does not fit, so nginx builds a nested location'],
      ['check', 'Write the table instead', 'every time you want a condition, write the table — after a few times it feels natural'],
    ], 2),
    en: 'More of map. Include pulls the table into its own file. Volatile switches off the once per request caching, rarely needed. And the shift in thinking: nginx configuration is declarative, and map is the declarative way to express a decision. If is imperative and does not fit — which is why it becomes a nested location.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('map', 'given this, produce that'),
      kw('default', 'catches the rest'),
      kw('exact vs regex keys', 'hash first, then ~ / ~* in order'),
      kw('hostnames', '*.name and name.*'),
      kw('chaining', 'one map reads another'),
      kw('volatile', 'recompute every time'),
      kw('include', 'the table in its own file'),
      kw('lazy', 'computed only when read'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: map, default, exact versus regex keys, hostnames, chaining, and volatile.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'A map with an exact, a ~ and a ~* key plus default — six requests',
      `${c('hostnames;')} with *.name and name.* — four Host headers`,
      'Chain a second map on the first',
      `Build ${c('"$arg_a:$arg_b"')} — then make two inputs collide`,
      'Move three redirects into an included file',
    ]), box('Keep these', `<ul><li>Exact = hash, regex = in order</li><li>Lazy, once per request</li><li>Empty value switches off</li><li>AND = combined key</li></ul>`, 'lam'), ''),
    en: 'Your turn: the four kinds of key, host names, a chained map, a combined key and a collision, and a redirect table in a file. Keep: exact keys are a hash, regex keys go in order; map is lazy and computed once; an empty value switches things off; and is a combined key.' },
];
export const slides = lamDeck({ chuong: 'Chapter 8 — Rewrite, map, and the directives to avoid', bai: '8.3' }, S);
