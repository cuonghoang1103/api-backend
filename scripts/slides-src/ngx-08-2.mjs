/**
 * ngx-08-2 — Nginx · Chapter 8 · Lesson 8.2 "Why 'if is evil', measured three ways" (deck video + web, 13/11/2026).
 * Bài web: nginx-8-2-if-la-quy-du. Output THẬT (scratchpad/ngx/demo/n8-2.txt; nginx/1.24.0):
 * 1) if + return: ?x=1 ⇒ "if THAY x=1", ?x=2 ⇒ "if KHONG thay" · 2) add_header trong if: ?x=1 ⇒ CHỈ X-Trong-If, ?x=2 ⇒ CHỈ X-Ngoai-If ·
 * 3) if + try_files: ?x=2 ⇒ 200, ?x=1 ⇒ 404 (+ X-Da-Vao-If) · map thay if: Googlebot ⇒ X-Bot: co, Mozilla ⇒ không header; GET ⇒ DOC, POST/PUT ⇒ GHI;
 * khoá ghép "$arg_a:$arg_b" ⇒ a=1&b=1 CO, còn lại khong.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n8-2:file:/tmp/ng/conf/if.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  upstream doc { server 127.0.0.1:8091; }\n  upstream ghi { server 127.0.0.1:8092; }\n  server { listen 8091; return 200 \"upstream DOC\\n\"; }\n  server { listen 8092; return 200 \"upstream GHI\\n\"; }\n\n  map $http_user_agent $la_bot { default \"\"; \"~*bot\" \"co\"; }\n  map $request_method $dich_upstream { default \"http://doc\"; POST \"http://ghi\"; PUT \"http://ghi\"; }\n  map \"$arg_a:$arg_b\" $ca_hai { default \"khong\"; \"~^1:1$\" \"CO\"; }       # phép AND bằng khoá ghép\n\n  server {\n    listen 8080;\n    root /tmp/ng/www;\n    location /if-a/ {                                    # 1) if + return: CHẠY đúng\n      if ($arg_x = \"1\") { return 200 \"if THAY x=1\\n\"; }\n      return 200 \"if KHONG thay\\n\";\n    }\n    location /if-nguy/ {                                 # 2) add_header trong if\n      if ($arg_x = \"1\") { add_header X-Trong-If \"co\" always; }\n      add_header X-Ngoai-If \"co\" always;\n      return 200 \"xem header\\n\";\n    }\n    location /if-tryfiles/ {                             # 3) if + try_files\n      if ($arg_x = \"1\") { add_header X-Da-Vao-If \"co\" always; }\n      try_files /dich =404;\n    }\n    location /map-bot/ { add_header X-Bot $la_bot always; return 200 \"xem header\\n\"; }\n    location /api/     { proxy_pass $dich_upstream; }\n    location /and/     { return 200 \"a=1 VA b=1 ? $ca_hai\\n\"; }\n  }\n}\n",
 "n8-2:setup": "",
 "n8-2:do1": "$ for x in 1 2; do printf '?x=%s -> ' $x; curl -s \"http://127.0.0.1:8080/if-a/?x=$x\"; done\n?x=1 -> if THAY x=1\n?x=2 -> if KHONG thay",
 "n8-2:do2": "$ for x in 1 2; do printf '?x=%s -> ' $x; curl -s -D - -o /dev/null \"http://127.0.0.1:8080/if-nguy/?x=$x\" | tr -d '\\r' | grep -iE '^x-(trong|ngoai)' | tr '\\n' ' '; echo; done\n?x=1 -> X-Trong-If: co \n?x=2 -> X-Ngoai-If: co ",
 "n8-2:do3": "$ for x in 2 1; do printf '?x=%s -> ' $x; curl -s -D - -o /dev/null \"http://127.0.0.1:8080/if-tryfiles/?x=$x\" | tr -d '\\r' | grep -iE '^HTTP|^x-da' | tr '\\n' ' '; echo; done\n?x=2 -> HTTP/1.1 200 OK \n?x=1 -> HTTP/1.1 404 Not Found X-Da-Vao-If: co ",
 "n8-2:thaythe": "$ for ua in 'Mozilla/5.0' 'Googlebot/2.1'; do printf '%-14s -> ' \"$ua\"; curl -s -D - -o /dev/null -A \"$ua\" http://127.0.0.1:8080/map-bot/ | tr -d '\\r' | grep -iE '^x-bot' || echo '(khong co X-Bot)'; done\nMozilla/5.0    -> (khong co X-Bot)\nGooglebot/2.1  -> X-Bot: co\n$ for m in GET POST PUT; do printf '%-4s /api/ -> ' $m; curl -s -X $m http://127.0.0.1:8080/api/; done\nGET  /api/ -> upstream DOC\nPOST /api/ -> upstream GHI\nPUT  /api/ -> upstream GHI\n$ for q in 'a=1&b=1' 'a=1&b=0' 'a=0&b=1'; do printf '%-8s -> ' \"$q\"; curl -s \"http://127.0.0.1:8080/and/?$q\"; done\na=1&b=1  -> a=1 VA b=1 ? CO\na=1&b=0  -> a=1 VA b=1 ? khong\na=0&b=1  -> a=1 VA b=1 ? khong"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-08-2', code: 'NGX 8.2', title: 'Why "if is evil", measured three ways', sub: 'Chapter 8 · Lesson 8.2' };
const O = (k) => { const v = DU_LIEU[`n8-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const KQ = (k) => O(k).split('\n').filter((l) => !l.startsWith('$ ')).join('\n');

/** Khối if = location lồng vô danh: khi điều kiện đúng, request do khối LỒNG xử lý. */
const longNhau = () => {
  const W = 1110, H = 300;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  s += `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="18" fill="#eef4ff" stroke="#2563eb" stroke-width="3"/>`;
  s += `<text x="34" y="46" font-size="22" font-weight="800" fill="#2563eb" font-family="monospace">location /if-tryfiles/ { … }</text>`;
  s += `<text x="34" y="86" font-size="19" fill="#1e3a8a" font-family="monospace">root /tmp/ng/www;   try_files /dich =404;   ← content handler lives HERE</text>`;
  s += `<rect x="60" y="112" width="640" height="160" rx="16" fill="#fff4ea" stroke="#c0392b" stroke-width="3" stroke-dasharray="9 6"/>`;
  s += `<text x="84" y="148" font-size="20" font-weight="800" fill="#c0392b" font-family="monospace">if ($arg_x = "1") — an ANONYMOUS nested location</text>`;
  s += `<text x="84" y="186" font-size="19" fill="#7c2d12" font-family="monospace">add_header X-Da-Vao-If "co" always;</text>`;
  s += `<text x="84" y="224" font-size="19" fill="#7c2d12">no try_files · no content handler · nothing to serve</text>`;
  s += `<text x="84" y="256" font-size="18" font-weight="700" fill="#c0392b">?x=1 ⇒ the request is handled HERE ⇒ 404</text>`;
  s += `<text x="740" y="170" font-size="20" font-weight="800" fill="#009639">?x=2 ⇒ the OUTER block</text><text x="740" y="200" font-size="20" font-weight="800" fill="#009639">handles it ⇒ 200</text>`;
  return s + '</svg>';
};

export const S = [
  { cover: true, nhan: 'Chapter 8 · Lesson 8.2', t: 'Why "if is evil",<br>measured three ways', sub: 'Three blocks, three probes — the third turns a working file into a 404 because of a query parameter',
    en: 'Lesson 8.2. "If is evil" is the title of a page on nginx\'s own wiki. It sounds like a style opinion until you reproduce what it says: three blocks, three probes, and the third turns a working file into a four oh four because of a query parameter.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Probe 1: <code>if</code> + <code>return</code> works — and that is the problem</li>
    <li>Probe 2: a header disappears</li>
    <li>Probe 3: a 200 becomes a 404</li>
    <li>Why: an if block is a nested location</li>
    <li>What to write instead: <code>map</code></li></ul>`,
    en: 'Five takeaways: probe one works, which is the problem; probe two loses a header; probe three turns two hundred into four oh four; why — an if block is a nested location; and what to write instead.' },
  { t: 'Probe 1: it works — and that is the problem', body: ngc(`location /if-a/ {
  if ($arg_x = "1") { return 200 "if THAY x=1\\n"; }
  return 200 "if KHONG thay\\n";
}`, { hl: [2] }) + tn(KQ('do1'), { fs: 18, wrap: 100 }) + box('return and rewrite are the ONLY two things if really supports', 'Exactly as written. This is the case that teaches people if is fine — and it is, because return and rewrite are the two directives if is built for. Everything else is where it breaks.', 'lam'),
    en: 'Probe one. If x equals one, return; otherwise another return. Measured: exactly as written. This is the case that teaches people if is fine — and it is, because return and rewrite are the only two directives if really supports.' },
  { t: 'Probe 2: a header disappears', body: ngc(`location /if-nguy/ {
  if ($arg_x = "1") { add_header X-Trong-If "co" always; }
  add_header X-Ngoai-If "co" always;
  return 200 "xem header\\n";
}`, { hl: [2, 3] }) + tn(KQ('do2'), { fs: 18, wrap: 100 }) + cmp(['Request', 'Headers sent', 'What the config "says"'], [
      ['?x=1', 'ONLY X-Trong-If', 'both headers'],
      ['?x=2', 'ONLY X-Ngoai-If', 'the outer header'],
    ], { hl: [0] }),
    en: 'Probe two. A header inside the if, another outside. With x equals one, only the inside header was sent; otherwise only the outside one. The two never appear together — the config reads like "add one more", the behaviour is "replace them all".' },
  { t: 'Why: an if block is a nested location', body: icards([
      ['layers', 'Not a conditional statement', 'nginx creates an anonymous location inside the outer one; when the condition is true, the NESTED block handles the request'],
      ['merge', 'So array inheritance applies (2.3)', 'one add_header in the child REPLACES the inherited list — the outer header is dropped'],
      ['shield', 'Security headers vanish on ONE condition', 'an if adding a debug or CORS header silently removes every security header of the location'],
      ['warn', 'Only when the condition is true', 'correct when you test, wrong for exactly the requests that match — no review or quick check catches it'],
    ], 2),
    en: 'Why. An if block is not a conditional statement: nginx builds an anonymous location inside the outer one, and when the condition holds that nested block handles the request. So the array inheritance rule of lesson two point three applies: one add header in the child replaces the whole inherited list. Security headers vanish on one condition, and only when it is true.' },
  { t: 'Probe 3: a 200 becomes a 404', body: two(ngc(`location /if-tryfiles/ {
  root /tmp/ng/www;
  if ($arg_x = "1") { add_header X-Da-Vao-If "co" always; }
  try_files /dich =404;
}`, { sm: true, hl: [3, 4] }), tn(KQ('do3'), { fs: 15, wrap: 34 }), 'r64') + longNhau(),
    en: 'Probe three. A real file, served with try files, and a conditional header beside it. Without x: two hundred. With x equals one: four oh four, plus the header. The if made a nested location; try files belongs to the outer one. When the condition matches, the nested block — with no try files and no content handler — has nothing to serve.' },
  { t: 'What to write instead: map', body: ngc(`map $http_user_agent $la_bot {
  default  "";
  "~*bot"  "co";
}
add_header X-Bot $la_bot always;   # empty ⇒ not sent
map $request_method $dich_upstream {
  default  "http://doc";
  POST     "http://ghi";
  PUT      "http://ghi";
}
location /api/ { proxy_pass $dich_upstream; }
map "$arg_a:$arg_b" $ca_hai { default "khong"; "~^1:1$" "CO"; }`, { sm: true, hl: [5, 11, 12] }) + tn(KQ('thaythe'), { fs: 15, wrap: 110 }),
    en: 'What to write instead: map. A user agent containing bot sets a variable, and add header with an empty value sends nothing — measured: Googlebot got the header, a browser did not. The method chooses the upstream: GET went to the read upstream, POST and PUT to the write one. And two conditions become one combined key: only a equals one and b equals one matched.' },
  { t: 'map vs. if', body: icards([
      ['clock', 'map is LAZY, evaluated once', 'on first reference in a request, then remembered — an if is evaluated every time the block is entered'],
      ['power', 'An EMPTY map result switches things off', 'add_header with "" sends nothing; limit_req with an empty key does not apply'],
      ['server', 'if at SERVER level with return is fine', 'the warnings are about if INSIDE a location — the classic HTTPS redirect is exactly that shape'],
      ['link', 'Two conditions ⇒ a combined key', 'there is no &&: map "$a:$b" … { "~^co:co$" 1; } — nesting two ifs is impossible anyway'],
    ], 2) + ngc(`# still RIGHT — the body is only return or rewrite:
if ($host != "vidu.com")   { return 301 https://vidu.com$request_uri; }
if ($request_uri ~ "^/cu/") { rewrite ^/cu/(.*)$ /moi/$1 permanent; }`, { hl: [2, 3] }) + box('The page is real', 'nginx\'s own wiki has a page titled "If is Evil". The three probes above are what it means — not a style preference.', 'lam'),
    en: 'Map versus if. Map is lazy and computed once per request. An empty result switches the thing off. If at server level with a return is a normal, safe pattern — the HTTPS redirect is exactly that. And two conditions need a combined key, because there is no and operator.' },
  { t: 'The rule', body: cmp(['Inside a location, in an if block', 'Safe?', 'Measured'], [
      ['return', '✓', 'probe 1: exactly as written'],
      ['rewrite', '✓', 'the other directive if is built for'],
      ['add_header', '✗', 'probe 2: replaces the outer headers'],
      ['try_files / root / proxy_pass', '✗', 'probe 3: 200 becomes 404'],
    ], { hl: [2, 3] }) + box('Why this lesson has little nuance', 'The rule "only return and rewrite" is easy to remember, costs nothing, and makes probe 3 impossible. The nuanced version needs every person who ever edits the file to remember which directives are safe. map covers the rest and reads better.', 'do2'),
    en: 'The rule: inside a location, an if block holds only return or rewrite. Add header, try files, root, proxy pass — each is a bug waiting for its query string. The nuanced version requires everyone who edits the file to remember which directives are safe; the simple rule makes probe three impossible.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('if', 'inside a location: return / rewrite only'),
      kw('nested location', 'what an if block really is'),
      kw('array inheritance', 'one add_header replaces them all'),
      kw('soft failure', 'breaks only when the condition holds'),
      kw('map', 'the fix — lazy, once, at http level'),
      kw('combined key', '"$a:$b" for AND'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: if, nested location, array inheritance, soft failure, map, and the combined key.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Probe 1: ${c('if')} + ${c('return')} with ?x=1 and ?x=2`,
      'Probe 2: one add_header inside, one outside — curl -D -',
      `Probe 3: ${c('if')} beside ${c('try_files')} — find the 404`,
      `Rewrite both with ${c('map')}`,
      `Express "a=1 AND b=1" with a combined key`,
    ]), box('Keep these', `<ul><li>if = nested location</li><li>Only return / rewrite inside</li><li>Breaks only when it matches</li><li>Use map instead</li></ul>`, 'lam'), ''),
    en: 'Your turn: the three probes, then rewrite them with map, and express an and condition with a combined key. Keep: an if is a nested location; inside a location use it only with return or rewrite; it breaks only when it matches; use map instead.' },
];
export const slides = lamDeck({ chuong: 'Chapter 8 — Rewrite, map, and the directives to avoid', bai: '8.2' }, S);
