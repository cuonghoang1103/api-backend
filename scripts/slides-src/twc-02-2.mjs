/*DU_LIEU*/
const DU_LIEU = {
 "t2-2:file:tw.config.js": "module.exports = { content: ['./page.html'] };\n",
 "t2-2:file:in.css": "@tailwind utilities;\n",
 "t2-2:file:page.html": "<!-- page.html — luu y: khong co lop \"group\", khong co lop \"peer\" -->\n<div class=\"group-hover:opacity-50 peer-checked:block\"></div>\n",
 "t2-2:v3": "$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 92ms.\n$ cat out.css\n.group:hover .group-hover\\:opacity-50 {\n  opacity: 0.5\n}\n\n.peer:checked ~ .peer-checked\\:block {\n  display: block\n}\n$ grep -oE 'class=\"[^\"]*\"' page.html | tr ' \"' '\\n\\n' | grep -cxE 'group|peer'\n0",
 "t2-2:file:ten.html": "<div class=\"group/item group-hover/item:underline\n            peer/x peer-checked/x:flex\"></div>\n",
 "t2-2:file:tw2.config.js": "module.exports = { content: ['./ten.html'] };\n",
 "t2-2:ten3": "$ npx tailwindcss -c tw2.config.js -i in.css -o out2.css 2>&1 | tail -1\nDone in 90ms.\n$ cat out2.css\n.group\\/item:hover .group-hover\\/item\\:underline {\n  text-decoration-line: underline\n}\n\n.peer\\/x:checked ~ .peer-checked\\/x\\:flex {\n  display: flex\n}",
 "t2-2:file:page4.html": "<div class=\"group-hover:opacity-50 peer-checked:block group-hover/item:underline in-hover:underline\"></div>\n",
 "t2-2:v4": "$ npx @tailwindcss/cli -i in.css -o out.css 2>&1 | tail -1\nDone in 29ms\n$ sed -n '/^@layer utilities {/,/^}/p' out.css | grep -E '^ *(@|\\.|:)'\n@layer utilities {\n  @media (hover: hover) {\n    :is(:where(.group):hover .group-hover\\:opacity-50) {\n    :is(:where(.group\\/item):hover .group-hover\\/item\\:underline) {\n  :is(:where(.peer):checked ~ .peer-checked\\:block) {\n  @media (hover: hover) {\n    :where(:hover) .in-hover\\:underline {",
 "t2-2:file:group.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"space-y-3 p-4 text-xl\">\n  <div id=\"a\" class=\"rounded bg-slate-100 p-3\">A · thiếu group\n    <span id=\"a1\" class=\"rounded bg-cyan-600 px-3 text-white group-hover:opacity-30\">icon</span></div>\n  <div id=\"b\" class=\"group rounded bg-slate-100 p-3\">B · group trên tổ tiên\n    <span id=\"b1\" class=\"rounded bg-cyan-600 px-3 text-white group-hover:opacity-30\">icon</span></div>\n  <div id=\"c\" class=\"rounded bg-slate-100 p-3\">C · group CÙNG thẻ\n    <span id=\"c1\" class=\"group rounded bg-cyan-600 px-3 text-white group-hover:opacity-30\">icon</span></div>\n</body></html>\n",
 "t2-2:file:peer.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"space-y-4 p-4 text-xl\">\n  <div class=\"flex flex-col gap-1\">\n    <label id=\"l1\" class=\"font-bold text-slate-500 peer-focus:text-blue-600\">Email (nhãn TRƯỚC)</label>\n    <input id=\"i1\" class=\"peer rounded border-2 border-slate-300 p-1\" placeholder=\"nhãn đứng trước ô nhập\" /></div>\n  <div class=\"flex flex-col gap-1\">\n    <input id=\"i2\" class=\"peer order-2 rounded border-2 border-slate-300 p-1\" placeholder=\"nhãn đứng sau ô nhập\" />\n    <label id=\"l2\" class=\"order-1 font-bold text-slate-500 peer-focus:text-blue-600\">Email (nhãn SAU, kéo lên bằng order-1)</label></div>\n</body></html>\n",
 "t2-2:file:long.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"space-y-3 p-4 text-xl\">\n  <div id=\"o1\" class=\"group rounded bg-slate-100 p-3\"><span id=\"h1\">Thẻ ngoài (group trần) — rê chuột ở đây</span>\n    <div class=\"group mt-2 rounded bg-white p-2\">hàng trong: <span id=\"t1\" class=\"group-hover:underline group-hover:text-red-600\">tên mục</span></div></div>\n  <div id=\"o2\" class=\"group rounded bg-slate-100 p-3\"><span id=\"h2\">Thẻ ngoài (group trần) — rê chuột ở đây</span>\n    <div class=\"group/item mt-2 rounded bg-white p-2\">hàng trong: <span id=\"t2\" class=\"group-hover/item:underline group-hover/item:text-red-600\">tên mục</span></div></div>\n</body></html>\n",
 "t2-2:chrome": "$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 103ms.\n$ grep -E '^\\.(group|peer)' out.css\n.group\\/item:hover .group-hover\\/item\\:text-red-600 {\n.group:hover .group-hover\\:text-red-600 {\n.group\\/item:hover .group-hover\\/item\\:underline {\n.group:hover .group-hover\\:underline {\n.group:hover .group-hover\\:opacity-30 {\n.peer:focus ~ .peer-focus\\:text-blue-600 {",
 "t2-2:kho": "$ git grep -l 'group-hover:' -- 'src/*.tsx' | wc -l\n     161\n$ for f in $(git grep -l 'group-hover:' -- 'src/*.tsx'); do grep -qE \"(className=[\\\"'{\\`]|[\\\"' \\`])group[\\\"' \\`]\" \"$f\" || echo \"$f\"; done | wc -l\n       2\n$ for f in $(git grep -l 'group-hover:' -- 'src/*.tsx'); do grep -qE \"(className=[\\\"'{\\`]|[\\\"' \\`])group[\\\"' \\`]\" \"$f\" || echo \"$f\"; done | head -4\nsrc/app/admin/user-codes/page.tsx\nsrc/components/doiKhang/MinhHoa.tsx\n$ git grep -ohE 'group/[a-z-]+' -- 'src/*.tsx' | sort | uniq -c | sort -rn | head -5\n   2 group/row\n   1 group/w\n   1 group/vol\n   1 group/track\n   1 group/title\n$ git grep -ohE 'className=\"[^\"]*\"' -- 'src/*.tsx' | tr ' \"' '\\n\\n' | grep -cxE 'group|group/[a-z-]+'\n219\n$ git grep -ohE 'className=\"[^\"]*\"' -- 'src/*.tsx' | tr ' \"' '\\n\\n' | grep -cx 'peer'\n2\n$ git grep -n 'group-hover:opacity-100' -- src/app/admin/user-codes/page.tsx\nsrc/app/admin/user-codes/page.tsx:102:                      <Check className=\"w-4 h-4 text-neon-violet opacity-0 group-hover:opacity-100\" />\n$ git grep -c -wE 'group' -- src/app/admin/user-codes/page.tsx\nsrc/app/admin/user-codes/page.tsx:1\n$ git grep -n 'group-hover:' -- src/components/doiKhang/MinhHoa.tsx\nsrc/components/doiKhang/MinhHoa.tsx:11:const NHAC = 'transition-transform duration-500 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none';\n$ git grep -n 'className=\"group relative' -- src/components/doiKhang/SanhDoiKhang.tsx\nsrc/components/doiKhang/SanhDoiKhang.tsx:55:      className=\"group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0f0d22]/80 shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)] transition-colors hover:border-white/20\"\n$ git grep -ohE 'peer-[a-z-]+:' -- 'src/*.tsx' | sort | uniq -c\n   2 peer-empty:",
 "t2-2:file:in.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"space-y-3 p-4 text-xl\">\n  <div id=\"x\" class=\"rounded bg-slate-100 p-3\">một thẻ KHÁC, không liên quan</div>\n  <div class=\"rounded bg-slate-100 p-3\"><span id=\"s\" class=\"in-hover:underline in-hover:text-red-600\">chữ có in-hover:</span></div>\n</body></html>\n",
 "t2-2:v4in": "$ npx @tailwindcss/cli -i in.css -o out.css 2>&1 | tail -1\nDone in 30ms\n$ grep -B1 -A3 'in-hover\\\\:underline {' out.css\n    }\n    :where(:hover) .in-hover\\:underline {\n      text-decoration-line: underline;\n    }\n  }",
 "anh-twc-2-2:nhom0": {
  "url": "http://127.0.0.1:20111/gpc/group.html",
  "vp": [
   560,
   250
  ],
  "rect": {
   "#a": [
    16,
    16,
    528,
    52
   ],
   "#b": [
    16,
    80,
    528,
    52
   ],
   "#c": [
    16,
    144,
    528,
    52
   ]
  },
  "console": [],
  "ketQua": {
   "op": "[[\"a1\",\"1\"],[\"b1\",\"1\"],[\"c1\",\"1\"]]"
  }
 },
 "anh-twc-2-2:nhomA": {
  "url": "http://127.0.0.1:20111/gpc/group.html",
  "vp": [
   560,
   250
  ],
  "rect": {
   "#a": [
    16,
    16,
    528,
    52
   ],
   "#b": [
    16,
    80,
    528,
    52
   ],
   "#c": [
    16,
    144,
    528,
    52
   ]
  },
  "console": [],
  "ketQua": {
   "op": "[[\"a1\",\"1\"],[\"b1\",\"1\"],[\"c1\",\"1\"]]"
  }
 },
 "anh-twc-2-2:nhomB": {
  "url": "http://127.0.0.1:20111/gpc/group.html",
  "vp": [
   560,
   250
  ],
  "rect": {
   "#a": [
    16,
    16,
    528,
    52
   ],
   "#b": [
    16,
    80,
    528,
    52
   ],
   "#c": [
    16,
    144,
    528,
    52
   ]
  },
  "console": [],
  "ketQua": {
   "op": "[[\"a1\",\"1\"],[\"b1\",\"0.3\"],[\"c1\",\"1\"]]"
  }
 },
 "anh-twc-2-2:nhomC": {
  "url": "http://127.0.0.1:20111/gpc/group.html",
  "vp": [
   560,
   250
  ],
  "rect": {
   "#a": [
    16,
    16,
    528,
    52
   ],
   "#b": [
    16,
    80,
    528,
    52
   ],
   "#c": [
    16,
    144,
    528,
    52
   ]
  },
  "console": [],
  "ketQua": {
   "op": "[[\"a1\",\"1\",false],[\"b1\",\"1\",false],[\"c1\",\"1\",true]]"
  }
 },
 "anh-twc-2-2:peer1": {
  "url": "http://127.0.0.1:20111/gpc/peer.html",
  "vp": [
   560,
   230
  ],
  "rect": {
   "#l1": [
    16,
    16,
    528,
    28
   ],
   "#i1": [
    16,
    48,
    528,
    40
   ],
   "#l2": [
    16,
    104,
    528,
    28
   ],
   "#i2": [
    16,
    136,
    528,
    40
   ]
  },
  "console": [],
  "ketQua": {
   "mau": "[[\"l1\",\"rgb(100, 116, 139)\",\"i1\"],[\"l2\",\"rgb(100, 116, 139)\",\"i1\"]]"
  }
 },
 "anh-twc-2-2:peer2": {
  "url": "http://127.0.0.1:20111/gpc/peer.html",
  "vp": [
   560,
   230
  ],
  "rect": {
   "#l1": [
    16,
    16,
    528,
    28
   ],
   "#i1": [
    16,
    48,
    528,
    40
   ],
   "#l2": [
    16,
    104,
    528,
    28
   ],
   "#i2": [
    16,
    136,
    528,
    40
   ]
  },
  "console": [],
  "ketQua": {
   "mau": "[[\"l1\",\"rgb(100, 116, 139)\",\"i2\"],[\"l2\",\"rgb(37, 99, 235)\",\"i2\"]]"
  }
 },
 "anh-twc-2-2:long": {
  "url": "http://127.0.0.1:20111/gpc/long.html",
  "vp": [
   560,
   300
  ],
  "rect": {
   "#o1": [
    16,
    16,
    528,
    104
   ],
   "#o2": [
    16,
    132,
    528,
    104
   ],
   "#t1": [
    141,
    74,
    71,
    23
   ],
   "#t2": [
    141,
    190,
    71,
    23
   ]
  },
  "console": [],
  "ketQua": {
   "t1": "[[\"t1\",\"underline\",\"rgb(220, 38, 38)\"]]",
   "t2": "[[\"t2\",\"none\",\"rgb(0, 0, 0)\"]]"
  }
 },
 "anh-twc-2-2:long1": {
  "url": "http://127.0.0.1:20111/gpc/long.html",
  "vp": [
   560,
   300
  ],
  "rect": {
   "#o1": [
    16,
    16,
    528,
    104
   ],
   "#o2": [
    16,
    132,
    528,
    104
   ],
   "#t1": [
    141,
    74,
    71,
    23
   ],
   "#t2": [
    141,
    190,
    71,
    23
   ]
  },
  "console": []
 },
 "anh-twc-2-2:inhover": {
  "url": "http://127.0.0.1:20111/gp4/in.html",
  "vp": [
   560,
   150
  ],
  "rect": {
   "#x": [
    16,
    16,
    528,
    52
   ],
   "#s": [
    28,
    94,
    142,
    23
   ]
  },
  "console": [],
  "ketQua": {
   "s": "[\"s\",\"underline\",true]"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, html, css, tsx, tn, br, box, two, steps, kw, c, cmp } from './_twc-chung.mjs';

export const deck = { key: 'twc-02-2', code: 'TWC 2.2', title: 'group and peer, and how they fail SILENTLY', sub: 'Chapter 2 · Lesson 2.2' };
const O = (k) => { const v = DU_LIEU[`t2-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-2-2:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-02-2', ten, { vp: 560, ...o });

// ── số đo (chạy thật t2-2 · Tailwind 3.4.19 + 4.3.5 · Chromium · frontend/, 14/11/2026)
const V3 = doan('v3', 'cat out.css').join('\n').trim(), DEM = doan('v3', "grep -oE 'class")[0];
const TEN = doan('ten3', 'cat out2.css').join('\n').trim();
const V4 = doan('v4', 'grep -E').join('\n').trim(), V4IN = doan('v4in', 'grep -B1').join('\n').trim();
const op = (k) => Object.fromEntries(JSON.parse(A(k).ketQua.op).map(([i, v]) => [i, v]));
const OA = op('nhomA'), OB = op('nhomB'), OC = op('nhomC');
const mau = (k) => Object.fromEntries(JSON.parse(A(k).ketQua.mau).map(([i, m]) => [i, m]));
const P1 = mau('peer1'), P2 = mau('peer2');
const L1 = JSON.parse(A('long').ketQua.t1)[0], L2 = JSON.parse(A('long').ketQua.t2)[0], IN = JSON.parse(A('inhover').ketQua.s);
const SO = (dau) => doan('kho', dau)[0].trim();
const NFILE = +SO("git grep -l 'group-hover:'"), NTHIEU = +SO('done | wc -l'), NGROUP = +SO("grep -cxE 'group"), NPEER = +SO("grep -cx 'peer'");
const THIEU = doan('kho', '| head -4').map((l) => l.trim());
const UC = doan('kho', 'group-hover:opacity-100')[0], MH = doan('kho', 'MinhHoa.tsx')[0], SD = doan('kho', 'SanhDoiKhang.tsx')[0];
const PEMPTY = doan('kho', "peer-[a-z-]+:")[0].trim();
if (DEM !== '0' || !V3.includes('.group:hover .group-hover\\:opacity-50') || !TEN.includes('.group\\/item:hover')) throw new Error('đầu ra đổi');
if (OA.a1 !== '1' || OB.b1 !== '0.3' || OC.c1 !== '1' || P1.l1 !== P1.l2 || P2.l2 === P2.l1 || L1[1] !== 'underline' || L2[1] !== 'none' || IN[1] !== 'underline') throw new Error('số đo Chromium đổi');
if (NFILE !== 161 || NTHIEU !== 2 || !UC.includes(':102:') || !SD.includes(':55:')) throw new Error('số đo kho đổi');
const PAGE = `<!-- page.html — luu y: khong co lop "group", khong co lop "peer" -->
<div class="group-hover:opacity-50 peer-checked:block"></div>`;
const PEER = `<label id="l1"
  class="font-bold text-slate-500
         peer-focus:text-blue-600">
  Email (nhãn TRƯỚC)</label>
<input id="i1"
  class="peer rounded border-2
         border-slate-300 p-1"
  placeholder="nhãn đứng trước ô nhập" />`;
const PEER2 = `<input id="i2"
  class="peer order-2 rounded border-2
         border-slate-300 p-1"
  placeholder="nhãn đứng sau ô nhập" />
<label id="l2"
  class="order-1 font-bold text-slate-500
         peer-focus:text-blue-600">
  Email (nhãn SAU, kéo lên bằng order-1)</label>`;
const bo = (x) => x.replace(/\s+/g, '');
if (!bo(O('file:page.html')).includes(bo(PAGE))) throw new Error('mã hiển thị KHÔNG khớp page.html');
if (!bo(O('file:peer.html')).includes(bo(PEER)) || !bo(O('file:peer.html')).includes(bo(PEER2))) throw new Error('mã hiển thị KHÔNG khớp peer.html');
const rgb = (s) => s.replace('rgb(100, 116, 139)', 'slate-500').replace('rgb(37, 99, 235)', '<b>blue-600</b>');

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.2', t: 'group and peer,<br>and how they fail SILENTLY', sub: 'Two variants that involve a second element — and break by producing perfectly valid CSS that never matches. Reproduced in Chromium, and found in this site\'s own code',
    en: 'Lesson two point two. Group-hover and peer-checked are the two variants that involve a second element, and both fail the same way: perfectly valid CSS that never matches. Understanding that failure is worth more than memorising the syntax.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Proof that the build <b>succeeds</b> and the CSS is <b>correct</b> — and nothing ever matches</li>
    <li>The two structures side by side: <b>descendant</b> (space) vs <b>sibling</b> (<code>~</code>)</li>
    <li>Why <code>~</code> only points <b>forward</b>, and what that does to your DOM order</li>
    <li>Named groups for nesting — and the bleed they fix, measured</li>
    <li>A real silent bug in this site's code, and Tailwind 4's <code>in-*</code></li></ul>`,
    en: 'Five takeaways: proof that the build succeeds and nothing matches; the two structures, descendant and sibling; why the tilde only points forward; named groups and the bleed they fix; and a real silent bug in this site, plus Tailwind four in-star.' },
  { t: 'Proving the silent failure', body: two(D(html(PAGE, { sm: true }), tn([`$ npx tailwindcss -c tw.config.js -i in.css -o out.css`, doan('v3', 'npx tailwindcss')[0], `$ grep -oE 'class="[^"]*"' page.html | tr ' "' '\\n\\n' | grep -cxE 'group|peer'`, DEM].join('\n'), { fs: 15, wrap: 60, title: 'Tailwind 3.4.19 (real)' })),
    D(css(V3, { sm: true }), box('Read it', 'The build <b>succeeds</b>. The rules are generated and syntactically perfect. And they can <b>never</b> match: no element has <code>group</code> or <code>peer</code> (counted: <b>0</b>). No build warning, no console error, and the class attribute in the browser looks right.', 'do2')), 'r46'),
    en: 'Proving it. A file uses group-hover and peer-checked, but never declares group or peer: counted, zero. The build succeeds, the CSS is generated and perfect, and it can never match. No warning at build time, no console error at runtime.' },
  { t: 'Why this is WORSE than an error', body: cmp(['failure', 'evidence it leaves', 'where you see it'], [
      ['class missing from the CSS', 'the rule is <b>absent</b>', '<code>grep</code> the built CSS — 0 hits'],
      ['two utilities conflict', 'both rules shown, one <b>struck through</b>', 'DevTools → Styles'],
      ['<code>group-hover:</code> without <code>group</code>', 'a rule that is <b>present and correct</b>', 'nowhere — the element shows the class as applied'],
    ], { hl: [2] }) + box('The only way to see it', 'Notice that the <b>selector</b> demands an ancestor (or an earlier sibling) you did not provide. You have to read the <b>generated selector</b>, not the class list.', 'lam'),
    en: 'Why this is worse than an error. A missing class leaves no rule; a conflict shows a struck-through rule in DevTools. This leaves a rule that is present and correct. The only way to see it is to read the generated selector and ask what second element it waits for.' },
  { t: 'Two structures, side by side', body: two(D(css(V3.split('\n\n')[0], { sm: true }), box('group — DESCENDANT', 'A <b>space</b> separates the parts, so the styled element can be at <b>any depth</b> inside the group. Direction: parent → child. Needs <code>group</code> on an <b>ancestor</b>.', 'lam')),
    D(css(V3.split('\n\n')[1], { sm: true }), box('peer — SIBLING', 'A <code>~</code> separates them, so both must share a <b>parent</b>, and the styled element must come <b>after</b> the peer. Needs <code>peer</code> on an <b>earlier sibling</b>.', 'xanh'))),
    en: 'Two structures, side by side. Group: a space, so the styled element can be at any depth inside the group; it needs group on an ancestor. Peer: a tilde, so both share a parent and the styled element must come after; it needs peer on an earlier sibling.' },
  { t: 'Chromium: three cards, one hovered at a time', body: two(D(B('nhomB', { url: 'gpc/group.html · Tailwind 3.4.19 · card B hovered', h: 215, w: 560 }),
      `<div style="font-size:17px;color:#475569;margin-top:8px">icon class: <code>group-hover:opacity-30</code> · measured with <code>getComputedStyle(icon).opacity</code></div>`),
    D(cmp(['card', 'where group is', 'icon opacity when hovered'], [
        ['A', 'nowhere', `<b>${OA.a1}</b> — nothing happens`],
        ['B', 'on the card (ancestor)', `<b>${OB.b1}</b> ✓`],
        ['C', 'on the <b>same</b> element', `<b>${OC.c1}</b> — nothing happens`],
      ], { hl: [1] }), box('Trap: group on the same element', '<code>.group:hover .group-hover\\:x</code> has a descendant <b>space</b>, so the two classes must be on <b>different</b> elements. On one element the rule asks the element to be its own ancestor — nothing satisfies that, and it never throws.', 'do2')), 'r46'),
    en: 'Chromium. Three cards, the icon has group-hover opacity thirty. Card A has no group: hovered, opacity stays one. Card B has group on the card: zero point three. Card C puts group on the same element as the icon: still one. The rule asks the element to be its own ancestor.' },
  { t: 'Directionality: ~ only points FORWARD', body: two(D(html(PEER, { sm: true }), B('peer1', { url: 'peer.html · first input focused', h: 186, w: 540 })),
    D(html(PEER2, { sm: true }), B('peer2', { url: 'peer.html · second input focused', h: 186, w: 540 }),
      cmp(['focused', 'label BEFORE input', 'label AFTER input'], [['input 1', rgb(P1.l1), '—'], ['input 2', '—', rgb(P2.l2)]])), ''),
    en: 'Directionality. The tilde only matches siblings that come after. A label placed before its input never turns blue on focus: measured, it stays slate. Put the input first in the DOM and pull the label up visually with order one: focus, and it turns blue. CSS has no previous-sibling selector.' },
  { t: 'Named groups, for when they nest', body: two(D(css(TEN, { sm: true }), box('Read it', 'The <code>/item</code> suffix becomes part of <b>both</b> class names, so the selector only pairs a named group with variants carrying the <b>same</b> name.', 'lam')),
    D(B('long1', { url: 'long.html · OUTER card hovered (row 1: bare group)', h: 250, w: 520 }),
      cmp(['outer card hovered', 'inner text'], [['inner <code>group</code> (bare)', `<b>${L1[1]}</b>, red — bleeds`], ['inner <code>group/item</code>', `<b>${L2[1]}</b> ✓`]]),
      box('So', 'A bare <code>group-hover:</code> matches <b>every</b> <code>group</code> ancestor, so hovering anywhere on the outer card lights the inner row. It reads as "hover is broken", not "my groups are ambiguous".', 'do2')), 'r46'),
    en: 'Named groups. A bare group inside another is ambiguous: hovering the outer card underlines the inner row too, measured in Chromium. With group slash item, the suffix is part of both class names, and hovering the outer card does nothing to the inner row.' },
  { t: 'The diagnosis table', body: cmp(['symptom', 'check'], [
      ['class IS in the CSS but nothing happens', 'read the generated <b>selector</b>: a space or <code>~</code> means it needs a second element'],
      ['<code>group-hover:</code> does nothing', 'is <code>group</code> on an <b>ancestor</b> — not the same element, not a sibling?'],
      ['<code>peer-*</code> does nothing', 'is <code>peer</code> on a <b>sibling</b>, and does it come <b>before</b> the styled element in the DOM?'],
      ['hovering the outer card triggers inner styles', 'unnamed nested groups — add <code>/name</code> to both the group and its variants'],
      ['works here, not there', 'the component was <b>moved</b> and lost its <code>group</code> ancestor'],
    ]),
    en: 'The diagnosis table. Class in the CSS but nothing happens: read the selector. Group-hover does nothing: is group on an ancestor? Peer does nothing: is peer on an earlier sibling? Outer hover bleeds: name the groups. Works here, not there: the component lost its group ancestor.' },
  { t: 'Measured in this site: one coupling, one REAL bug', body: two(D(tn([`$ git grep -l 'group-hover:' -- 'src/*.tsx' | wc -l`, String(NFILE), '$ # files with group-hover: but NO "group" class in the same file', String(NTHIEU), ...THIEU].join('\n'), { fs: 13, wrap: 52, title: 'frontend/ · 14/11/2026 (real)' }),
      box('Invisible coupling (works)', `<code>MinhHoa.tsx</code> only says <code>group-hover:</code>; the <code>group</code> lives in its parent <code>SanhDoiKhang.tsx:55</code>. It works only inside that parent — the file's own comment is the only documentation.`, 'lam')),
    D(tsx(UC.replace(/^[^:]+:\d+:\s*/, '').replace('className=', '\n  className=').replace(' opacity-0', '\n    opacity-0'), { sm: true }), box('A real silent bug', `<code>admin/user-codes/page.tsx:102</code>: a check icon with <code>opacity-0 group-hover:opacity-100</code> inside a <code>&lt;button&gt;</code> that has <b>no</b> <code>group</code> — the only line of the file containing the word is line 102 itself. The icon can <b>never</b> appear on hover. Fix: add <code>group</code> to the button (line 95).`, 'do2')), 'r46'),
    en: 'Measured in this site. One hundred sixty-one files use group-hover; only two have no group class in the same file. One is an invisible coupling that works, because the parent declares group. The other is a real silent bug: a check icon inside a button with no group. It can never appear.' },
  { t: 'peer and named groups in this site', body: two(D(tn([`$ git grep -ohE 'className="[^"]*"' … | grep -cxE 'group|group/[a-z-]+'`, String(NGROUP), `$ … | grep -cx 'peer'`, String(NPEER), `$ git grep -ohE 'peer-[a-z-]+:' -- 'src/*.tsx' | sort | uniq -c`, PEMPTY].join('\n'), { fs: 14, wrap: 54, title: 'frontend/ · 14/11/2026 (real)' })),
    D(box('Read it', `<b>${NGROUP}</b> elements declare a group; only <b>${NPEER}</b> declare a peer, both used by <code>peer-empty:</code> in <code>IssueDetail.tsx</code> — a <code>div.peer</code> followed by a hidden "no links" paragraph that appears when the div is empty. Peer first, styled sibling second: the correct direction.`, 'xanh'),
      box('Design consequence', 'A component that contains <code>group-hover:</code> is <b>not self-contained</b>. Either put <code>group</code> on its own root so it carries its dependency, or document the requirement in a comment.', 'lam')), 'r46'),
    en: 'Peer and named groups in this site. Two hundred nineteen elements declare a group; only two declare a peer, both for peer-empty, where the peer comes first and the hidden message follows: the correct direction. A component with group-hover is not self-contained: carry group on its own root, or document it.' },
  { t: 'Tailwind 4: same shapes, plus in-*', body: two(D(tn(["$ … out.css | grep -E '^ *(@|\\.|:)'", ...V4.split('\n')].join('\n'), { fs: 13, wrap: 58, title: 'Tailwind 4.3.5 (real)' }),
      box('Unchanged failure modes', 'Still a descendant space, still a forward-only <code>~</code>, now inside <code>:is(:where(.group)…)</code> and <code>@media (hover: hover)</code>. Everything in this lesson applies.', 'xanh')),
    D(B('inhover', { url: 'gp4/in.html · an UNRELATED box hovered', h: 150, w: 560 }),
      box('New: in-hover: needs no group — and that is the catch', `<code>in-hover:</code> compiles to <code>:where(:hover) .x</code>: <b>any</b> hovered ancestor. <code>&lt;html&gt;</code> and <code>&lt;body&gt;</code> are hovered whenever the mouse is on the page, so hovering an unrelated box underlines the text (measured: <b>${IN[1]}</b>). Use it inside a bounded region, or keep a named <code>group</code>.`, 'do2')), 'r46'),
    en: 'Tailwind four: the same shapes inside is and where, plus a new in-star variant that needs no group. That is the catch: it means any hovered ancestor, and html and body are always hovered when the mouse is on the page. Hovering an unrelated box underlined the text.' },
  { t: 'In real life — and the attacker\'s view', body: two(D(box('Every day', 'A menu that opens on <code>group-hover:</code> works with a mouse — a phone has no hover, so it needs a tap target too. Login forms with floating labels (<code>peer-focus:</code>), a "show password" checkbox (<code>peer-checked:</code>).', 'lam'),
      box('What if…', '…someone copies <code>MinhHoa.tsx</code> into a new page without its <code>group</code> parent? The lift-on-hover disappears silently and nobody files a bug — nothing looks broken.', 'xanh')),
    D(box('The attacker\'s view: hiding is not protecting', 'An <code>opacity-0</code> / <code>hidden</code> admin control is still in the DOM. Anyone opens DevTools, deletes the class and clicks. The real check must live on the <b>server</b>.', 'do2'),
      box('And phishing', 'Fake login pages copy floating labels and polish exactly. Polish proves nothing: read the <b>address bar</b>.', 'ok')), 'r46'),
    en: 'In real life: hover menus need a tap target on phones; floating labels and show-password toggles are peer. What if a component is copied without its group parent? It breaks silently. And the attacker view: hiding with CSS is not protection; anyone can delete the class in DevTools, so the server must check.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('silent failure', 'valid CSS that never matches'), kw('group', 'descendant: needs an ancestor'), kw('peer', 'sibling ~: needs an earlier sibling'),
      kw('forward-only ~', 'CSS has no previous-sibling selector'), kw('group/name', 'named groups stop the bleed'), kw('invisible coupling', 'needs group from its parent'),
      kw('peer-empty:', 'show a message when the peer is empty'), kw('in-hover: (v4)', 'any hovered ancestor — even body'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: silent failure; group, a descendant; peer, a sibling; the forward-only tilde; named groups; invisible coupling; peer-empty; and Tailwind four in-hover, any hovered ancestor.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Write ${c('group-hover:opacity-50')} with no ${c('group')}: build, grep the rule, hover — nothing`,
      'Put the label BEFORE a peer input, then after it with order-1: compare the colour on focus',
      `Nest two bare ${c('group')}s, hover the outer one; then rename the inner to ${c('group/item')}`,
      `Run the "group-hover: without group" loop on your own project and open every hit`,
    ]), box('Keep these', '<ul><li>Valid CSS that never matches is the failure mode</li><li>Space ⇒ an ancestor; ~ ⇒ an EARLIER sibling</li><li>Nested groups need names</li><li>A component with group-hover: carries a hidden dependency</li></ul>', 'lam'), ''),
    en: 'Your turn: write group-hover with no group and watch nothing happen; put a label before and after a peer input; nest two bare groups and then name them; and run the group-hover-without-group search on your own project. Keep: valid CSS that never matches is the failure mode.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — Variants, and what they compile to', bai: '2.2' }, S);
