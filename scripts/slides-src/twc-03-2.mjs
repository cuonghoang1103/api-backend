/*DU_LIEU*/
const DU_LIEU = {
 "t3-2:file:tw.config.js": "module.exports = { content: ['./*.html'] };\n",
 "t3-2:file:in.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n",
 "t3-2:file:page.html": "<div class=\"mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12\n            mt-16 mt-20 mt-24 mt-32\"></div>\n<div class=\"mt-px mt-0 mt-0.5 mt-1.5 mt-2.5\"></div>\n<div class=\"pt-1 p-2 px-3 py-4 pl-5\"></div>\n",
 "t3-2:v3": "$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 89ms.\n$ grep -o '^\\.mt-[0-9]*' out.css | tr '\\n' ' '\n.mt-1 .mt-10 .mt-12 .mt-16 .mt-2 .mt-20 .mt-24 .mt-3 .mt-32 .mt-4 .mt-8 \n$ grep -o '^\\.mt-[0-9]*' out.css | tail -1\n.mt-8",
 "t3-2:file:tron.html": "<div class=\"mt-px mt-0 mt-0.5 mt-1 mt-1.5 mt-2 mt-2.5 mt-8 mt-10 mt-32\"></div>\n",
 "t3-2:file:tron.config.js": "module.exports = { content: ['./tron.html'] };\n",
 "t3-2:tron3": "$ npx tailwindcss -c tron.config.js -i in.css -o tron.css 2>&1 | tail -1\nDone in 91ms.\n$ grep -oE '^\\.mt-[^ ]+' tron.css | tr '\\n' ' '\n.mt-0 .mt-0\\.5 .mt-1 .mt-1\\.5 .mt-10 .mt-2 .mt-2\\.5 .mt-32 .mt-8 .mt-px ",
 "t3-2:file:nhom.html": "<div class=\"pt-1 p-2 px-3 py-4 pl-5\"></div>\n",
 "t3-2:file:nhom.config.js": "module.exports = { content: ['./nhom.html'] };\n",
 "t3-2:nhom3": "$ npx tailwindcss -c nhom.config.js -i in.css -o nhom.css 2>&1 | tail -1\nDone in 83ms.\n$ grep -oE '^\\.[a-z]+-[0-9]+' nhom.css | tr '\\n' ' '\n.p-2 .px-3 .py-4 .pl-5 .pt-1 ",
 "t3-2:v4": "$ npx @tailwindcss/cli -i in.css -o ../ps4o/out.css 2>&1 | tail -1\nDone in 26ms\n$ grep -oE '^ *\\.mt-[^ ]+' ../ps4o/out.css | tr -d ' ' | tr '\\n' ' '\n.mt-0 .mt-0\\.5 .mt-1 .mt-1\\.5 .mt-2 .mt-2\\.5 .mt-3 .mt-4 .mt-8 .mt-10 .mt-12 .mt-16 .mt-20 .mt-24 .mt-32 .mt-px \n$ grep -oE '^ *\\.p[a-z]?-[0-9]+' ../ps4o/out.css | tr -d ' ' | tr '\\n' ' '\n.p-2 .px-3 .py-4 .pt-1 .pl-5 ",
 "t3-2:file:sap.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"bg-white p-4 text-base\">\n  <div class=\"border-t-4 border-slate-300\"><div id=\"m\" class=\"mt-8 mt-32 rounded bg-cyan-100 px-2\">mt-8 mt-32</div></div>\n  <div id=\"p\" class=\"p-4 px-8 mt-4 rounded bg-amber-100\">p-4 px-8</div>\n  <div id=\"t\" class=\"text-sm text-lg mt-4 rounded bg-slate-100 px-2\">text-sm text-lg</div>\n</body></html>\n",
 "t3-2:file:v4/in.css": "@import \"tailwindcss\";\n",
 "t3-2:file:v4/sap.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"bg-white p-4 text-base\">\n  <div class=\"border-t-4 border-slate-300\"><div id=\"m\" class=\"mt-8 mt-32 rounded bg-cyan-100 px-2\">mt-8 mt-32</div></div>\n  <div id=\"p\" class=\"p-4 px-8 mt-4 rounded bg-amber-100\">p-4 px-8</div>\n  <div id=\"t\" class=\"text-sm text-lg mt-4 rounded bg-slate-100 px-2\">text-sm text-lg</div>\n</body></html>\n",
 "t3-2:chrome": "$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 141ms.\n$ cd v4 && npx @tailwindcss/cli -i in.css -o ../../psc4o.css 2>&1 | tail -1 && cp ../../psc4o.css out.css\nDone in 23ms",
 "t3-2:file:the.jsx": "export const A = () => <div className=\"mt-2 mt-10\" />;          // tinh: hai mt-*\nexport const B = () => <div className=\"p-4 px-8\" />;            // khac pham vi\nexport const C = () => <div className=\"text-sm text-red-500\" />; // khac thuoc tinh\nexport const D = ({ extra }) => <div className={`mt-2 ${extra}`} />; // dong: extra = \"mt-10\"\n",
 "t3-2:lint3": "$ npx eslint the.jsx\n\n/Users/admin/.rtq-twc/lab/lint3/the.jsx\n  1:29  error  Classnames mt-2, mt-10 are conflicting!  tailwindcss/no-contradicting-classname\n\n✖ 1 problem (1 error, 0 warnings)\n$ cat .eslintrc.cjs\nmodule.exports = { root: true, parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },\n  plugins: ['tailwindcss'], settings: { tailwindcss: { config: __dirname + '/tw.config.js' } },\n  rules: { 'tailwindcss/no-contradicting-classname': 'error' } };",
 "t3-2:lint4": "$ npx eslint the.jsx\n\n/Users/admin/.rtq-twc/lab/lint4/the.jsx\n  1:40  error  'mt-2' conflicts with 'mt-10'  tailwindcss/no-contradicting-classname\n  1:45  error  'mt-10' conflicts with 'mt-2'  tailwindcss/no-contradicting-classname\n\n✖ 2 problems (2 errors, 0 warnings)",
 "t3-2:file:lint-kho.sh": "#!/bin/bash\n# lint-kho.sh — luat no-contradicting-classname tren MOI tep .tsx cua frontend/ (CHI DOC), config tailwind THAT cua kho.\n# Chay theo lo 40 tep x 4 luong; lo nao lam plugin SAP thi chay lai tung tep de khoanh dung tep.\nK=/Users/admin/.rtq-twc/lab/kho; T=$(mktemp -d)\n(cd $K && git ls-files 'src/*.tsx') | sed \"s#^#$K/#\" > $T/ds; split -l 40 $T/ds $T/b_\nls $T/b_* | xargs -P 4 -I{} sh -c 'npx eslint --no-eslintrc -c kho.cjs -f unix --no-ignore $(cat {}) > {}.out 2>&1'\ntouch $T/le.out\nfor b in $(grep -l \"Oops\" $T/b_*.out | sed 's/\\.out$//'); do while read f; do\n  npx eslint --no-eslintrc -c kho.cjs -f unix --no-ignore \"$f\" > $T/f.out 2>&1\n  if grep -q Oops $T/f.out; then echo \"plugin SAP tren: ${f#$K/}\"; else cat $T/f.out >> $T/le.out; fi\ndone < $b; done\necho \"tep .tsx: $(wc -l < $T/ds | tr -d ' ')\"\ncat $T/b_*.out $T/le.out | grep conflicting | sed -e \"s#$K/##\" -e \"s#/Users/admin/Downloads/api-backend/frontend/##\" -e 's/ \\[Error.*//' | sort -u > $T/kq\necho \"xung dot tinh: $(wc -l < $T/kq | tr -d ' ')\"\ncat $T/kq; rm -rf $T\n",
 "t3-2:kholint": "$ bash lint-kho.sh\nplugin SAP tren: src/components/notes/NoteEditor.tsx\ntep .tsx: 1677\nxung dot tinh: 15\nsrc/app/admin/stats/page.tsx:190:21: Classnames font-heading, font-mono are conflicting!\nsrc/components/hoc-tap/LichHoc.tsx:82:14: Classnames relative, sticky are conflicting!\nsrc/components/music/GlobalMusicPlayer.tsx:178:7: Classnames sm:mx-6, sm:mx-0 are conflicting!\nsrc/components/notes/NoteResourcePanel.tsx:111:14: Classnames dark:text-slate-500, dark:text-slate-600 are conflicting!\nsrc/components/notes/NoteResourcePanel.tsx:123:105: Classnames dark:text-slate-500, dark:text-slate-600 are conflicting!\nsrc/components/notes/NoteResourcePanel.tsx:164:14: Classnames dark:text-slate-500, dark:text-slate-600 are conflicting!\nsrc/components/notes/NoteResourcePanel.tsx:180:101: Classnames dark:text-slate-500, dark:text-slate-600 are conflicting!\nsrc/components/notes/NotesSearch.tsx:105:20: Classnames dark:text-slate-500, dark:text-slate-600 are conflicting!\nsrc/components/notes/SubjectView.tsx:47:14: Classnames dark:text-slate-500, dark:text-slate-600 are conflicting!\nsrc/components/notes/VocabTable.tsx:142:32: Classnames dark:text-slate-500, dark:text-slate-600 are conflicting!\nsrc/components/notes/VocabTable.tsx:188:48: Classnames dark:text-slate-500, dark:text-slate-600, dark:hover:text-slate-400 are conflicting!\nsrc/components/notes/VocabTable.tsx:197:50: Classnames dark:text-slate-500, dark:text-slate-600 are conflicting!\nsrc/components/studio/CreateProjectModal.tsx:268:9: Classnames block, flex are conflicting!\nsrc/components/studio/CreateProjectModal.tsx:302:2: Classnames block, flex are conflicting!\nsrc/components/studio/CreateProjectModal.tsx:499:2: Classnames block, flex are conflicting!",
 "t3-2:file:music.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"bg-slate-950 p-0 text-white\">\n  <!-- chuoi lop THAT: frontend/src/components/music/GlobalMusicPlayer.tsx:178 -->\n  <div class=\"relative mt-[170px] h-12 bg-slate-700 px-4 leading-[3rem]\">thanh nhạc (cha)\n    <div id=\"m\" class=\"absolute bottom-full left-0 right-0 mb-2 mx-3 sm:mx-6 max-w-3xl sm:left-auto sm:right-6 sm:mx-0 bg-darkcard/95 backdrop-blur-md border border-darkborder rounded-2xl shadow-2xl z-[65] overflow-hidden p-3\">khung danh sách phát (dòng 178)</div>\n  </div>\n</body></html>\n",
 "t3-2:music": "$ npx tailwindcss -c ../kho/tailwind.config.ts --content ./music.html -i in.css -o out.css 2>&1 | tail -1\nDone in 119ms.\n$ grep -B1 -A3 -E '^  \\.sm\\\\:mx-(0|6) \\{' out.css\n\n  .sm\\:mx-0 {\n    margin-left: 0px;\n    margin-right: 0px;\n  }\n\n  .sm\\:mx-6 {\n    margin-left: 1.5rem;\n    margin-right: 1.5rem;\n  }\n$ grep -n 'sm:mx-6\\|sm:mx-0' ../kho/src/components/music/GlobalMusicPlayer.tsx\n178:      className=\"absolute bottom-full left-0 right-0 mb-2 mx-3 sm:mx-6 max-w-3xl sm:left-auto sm:right-6 sm:mx-0 bg-darkcard/95 backdrop-blur-md border border-darkborder rounded-2xl shadow-2xl z-[65] overflow-hidden\"",
 "t3-2:file:them.html": "<div class=\"mt-8 mt-18 mt-32\"></div>\n",
 "t3-2:file:them.config.js": "module.exports = { content: ['./them.html'], theme: { extend: { spacing: { 18: '4.5rem' } } } };\n",
 "t3-2:file:goc.html": "<div class=\"mt-8 mt-32\"></div>\n",
 "t3-2:file:goc.config.js": "module.exports = { content: ['./goc.html'] };\n",
 "t3-2:them": "$ npx tailwindcss -c goc.config.js -i in.css -o goc.css 2>&1 | tail -1 && grep -oE '^\\.mt-[0-9]+' goc.css | tr '\\n' ' '\nDone in 86ms.\n.mt-32 .mt-8 \n$ npx tailwindcss -c them.config.js -i in.css -o them.css 2>&1 | tail -1 && grep -oE '^\\.mt-[0-9]+' them.css | tr '\\n' ' '\nDone in 92ms.\n.mt-18 .mt-32 .mt-8 ",
 "t3-2:file:an.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"bg-white p-4 text-lg\">\n  <p>Gói Pro · 99.000đ/tháng · tự gia hạn</p>\n  <!-- PR \"chinh mau link\": nguoi review doc thay `block` o CUOI chuoi -->\n  <a id=\"h\" href=\"#\" class=\"hidden text-red-600 underline font-bold block\">Huỷ gia hạn</a>\n  <p class=\"mt-2 text-sm text-slate-500\">(dòng dưới link)</p>\n</body></html>\n",
 "t3-2:file:v4/an.html": "<!doctype html><html><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"out.css\"></head>\n<body class=\"bg-white p-4 text-lg\">\n  <p>Gói Pro · 99.000đ/tháng · tự gia hạn</p>\n  <a id=\"h\" href=\"#\" class=\"hidden text-red-600 underline font-bold block\">Huỷ gia hạn</a>\n  <p class=\"mt-2 text-sm text-slate-500\">(dòng dưới link)</p>\n</body></html>\n",
 "t3-2:an": "$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2>&1 | tail -1\nDone in 104ms.\n$ grep -nE '^\\.(block|hidden) ' out.css\n573:.block {\n577:.hidden {\n$ cd v4 && npx @tailwindcss/cli -i in.css -o ../../psc4o.css 2>&1 | tail -1 && cp ../../psc4o.css out.css\nDone in 24ms\n$ grep -nE '^ *\\.(block|hidden) \\{' v4/out.css\n191:  .block {\n194:  .hidden {",
 "anh-twc-3-2:sap3": {
  "url": "http://127.0.0.1:20116/psc/sap.html",
  "vp": [
   560,
   300
  ],
  "rect": {
   "#m": [
    16,
    52,
    528,
    24
   ],
   "#p": [
    16,
    92,
    528,
    56
   ],
   "#t": [
    16,
    164,
    528,
    20
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"m\":\"32px\",\"pt\":\"16px\",\"pl\":\"32px\",\"t\":\"14px\"}"
  }
 },
 "anh-twc-3-2:sap4": {
  "url": "http://127.0.0.1:20116/psc/v4/sap.html",
  "vp": [
   560,
   300
  ],
  "rect": {
   "#m": [
    16,
    148,
    528,
    24
   ],
   "#p": [
    16,
    188,
    528,
    56
   ],
   "#t": [
    16,
    260,
    528,
    20
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"m\":\"128px\",\"pt\":\"16px\",\"pl\":\"32px\",\"t\":\"14px\"}"
  }
 },
 "anh-twc-3-2:music800": {
  "url": "http://127.0.0.1:20116/psk/music.html",
  "vp": [
   800,
   240
  ],
  "rect": {
   "#m": [
    512,
    88,
    240,
    74
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"ml\":\"24px\",\"mr\":\"24px\"}"
  }
 },
 "anh-twc-3-2:music500": {
  "url": "http://127.0.0.1:20116/psk/music.html",
  "vp": [
   500,
   240
  ],
  "rect": {
   "#m": [
    12,
    88,
    476,
    74
   ]
  },
  "console": [],
  "ketQua": {
   "s": "{\"ml\":\"12px\",\"mr\":\"12px\"}"
  }
 },
 "anh-twc-3-2:an3": {
  "url": "http://127.0.0.1:20116/psc/an.html",
  "vp": [
   560,
   160
  ],
  "rect": {
   "#h": null
  },
  "console": [],
  "ketQua": {
   "s": "{\"d\":\"none\",\"cls\":\"hidden text-red-600 underline font-bold block\"}"
  }
 },
 "anh-twc-3-2:an4": {
  "url": "http://127.0.0.1:20116/psc/v4/an.html",
  "vp": [
   560,
   160
  ],
  "rect": {
   "#h": null
  },
  "console": [],
  "ketQua": {
   "s": "{\"d\":\"none\",\"cls\":\"hidden text-red-600 underline font-bold block\"}"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, html, css, tsx, tn, br, box, two, steps, kw, c, cmp } from './_twc-chung.mjs';

export const deck = { key: 'twc-03-2', code: 'TWC 3.2', title: 'Reading the sort: why mt-8 beats mt-32', sub: 'Chapter 3 · Lesson 3.2' };
const O = (k) => { const v = DU_LIEU[`t3-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-twc-3-2:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) r.push(ls[j]); return r; };
const B = (ten, o) => br('twc-03-2', ten, { vp: 560, ...o });
const bo = (x) => x.replace(/\s+/g, '');

// ── số đo (chạy thật t3-2 · Tailwind 3.4.19 + 4.3.5 · eslint-plugin-tailwindcss 3.18.3 / 4.4.0 · Chromium · frontend/, 14/11/2026)
const ORD3 = doan('v3', "tr '\\n'")[0].trim(), WIN3 = doan('v3', 'out.css | tail -1')[0].trim();
const TRON3 = doan('tron3', 'grep -oE')[0].trim();
const NHOM3 = doan('nhom3', 'grep -oE')[0].trim();
const ORD4 = doan('v4', "'^ *\\.mt-")[0].trim(), NHOM4 = doan('v4', "'^ *\\.p[a-z]")[0].trim();
const s = (k) => JSON.parse(A(k).ketQua.s);
const S3 = s('sap3'), S4 = s('sap4'), M8 = s('music800'), M5 = s('music500'), H3 = s('an3'), H4 = s('an4');
const L3 = doan('lint3', 'npx eslint').filter((l) => l.trim()).map((l) => l.replace('/Users/admin/.rtq-twc/lab/lint3/', '')).join('\n');
const L4 = doan('lint4', 'npx eslint').filter((l) => l.trim()).map((l) => l.replace('/Users/admin/.rtq-twc/lab/lint4/', '')).join('\n');
const KL = doan('kholint', 'bash lint-kho.sh');
const NTEP = +KL.find((l) => l.startsWith('tep .tsx:')).split(':')[1], NXD = +KL.find((l) => l.startsWith('xung dot tinh:')).split(':')[1];
const SAP = KL.find((l) => l.startsWith('plugin SAP')).replace('plugin SAP tren: ', '');
const KQ = KL.filter((l) => l.startsWith('src/'));
const MUSIC_CSS = doan('music', 'grep -B1').join('\n').trim();
const MUSIC_SRC = doan('music', "grep -n 'sm:mx-6")[0];
const GOC = doan('them', 'goc.config')[1].trim(), THEM = doan('them', 'them.config')[1].trim();
const AN3 = doan('an', "grep -nE '^\\.(block").join('\n'), AN4 = doan('an', "grep -nE '^ *").join('\n');
if (ORD3 !== '.mt-1 .mt-10 .mt-12 .mt-16 .mt-2 .mt-20 .mt-24 .mt-3 .mt-32 .mt-4 .mt-8' || WIN3 !== '.mt-8') throw new Error('phép sắp v3 đổi');
if (!ORD4.endsWith('.mt-24 .mt-32 .mt-px') || NHOM3 !== '.p-2 .px-3 .py-4 .pl-5 .pt-1' || NHOM4 !== '.p-2 .px-3 .py-4 .pt-1 .pl-5') throw new Error('phép sắp v4/nhóm đổi');
if (S3.m !== '32px' || S4.m !== '128px' || S3.pt !== '16px' || S3.pl !== '32px' || S3.t !== '14px' || S4.t !== '14px') throw new Error('số đo Chromium đổi');
if (M8.ml !== '24px' || M5.ml !== '12px' || H3.d !== 'none' || H4.d !== 'none') throw new Error('số đo music/hidden đổi');
if (NTEP !== 1677 || NXD !== 15 || !SAP.includes('NoteEditor.tsx') || !MUSIC_SRC.startsWith('178:')) throw new Error('số đo kho đổi');
if (GOC !== '.mt-32 .mt-8' || THEM !== '.mt-18 .mt-32 .mt-8') throw new Error('phép thử thêm khoá đổi');
const THE = `export const A = () => <div className="mt-2 mt-10" />;          // tinh: hai mt-*
export const B = () => <div className="p-4 px-8" />;            // khac pham vi
export const C = () => <div className="text-sm text-red-500" />; // khac thuoc tinh
export const D = ({ extra }) => <div className={\`mt-2 \${extra}\`} />; // dong: extra = "mt-10"`;
if (!bo(O('file:the.jsx')).includes(bo(THE))) throw new Error('mã hiển thị KHÔNG khớp the.jsx');
const PAGE = `<div class="mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12
            mt-16 mt-20 mt-24 mt-32"></div>`;
if (!bo(O('file:page.html')).includes(bo(PAGE))) throw new Error('mã hiển thị KHÔNG khớp page.html');
const nhom = (k) => KQ.filter((l) => l.includes(k)).length;
const wr = (t, n) => t.split(' ').reduce((a, w) => { const l = a[a.length - 1]; if ((l + ' ' + w).length > n && l) a.push(w); else a[a.length - 1] = l ? l + ' ' + w : w; return a; }, ['']).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.2', t: 'Reading the sort:<br>why mt-8 beats mt-32', sub: 'Generated order has two halves — one designed, one accidental. Tailwind 3 sorts values as strings, Tailwind 4 as numbers; a linter catches the static cases, and this site has 15 of them',
    en: 'Lesson three point two. Lesson three point one showed that generated order decides. This lesson asks what generated order actually is. It has two halves: one sensible, one surprising. Knowing which half you are in tells you whether to trust your intuition.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Within one property group, Tailwind 3 sorts values as <b>strings</b>: <code>mt-8</code> beats <code>mt-32</code></li>
    <li>Tailwind 4 sorts as <b>numbers</b> — the winner flips on upgrade, the bug stays</li>
    <li>Across groups, a <b>designed</b> order you can trust: <code>p</code> → <code>px/py</code> → sides</li>
    <li>The rule: same property, same scope = a <b>bug</b>, never an override</li>
    <li>A linter catches the static ones — this site has <b>15</b>, one with a visible effect</li></ul>`,
    en: 'Five takeaways: Tailwind three sorts values within a group as strings, so mt-eight beats mt-thirty-two; Tailwind four sorts them as numbers; across groups there is a designed order you can trust; same property and scope is always a bug; and a linter finds fifteen in this site.' },
  { t: 'The surprising half: WITHIN one property group', body: two(D(html(PAGE, { sm: true }), tn(['$ grep -o \'^\\.mt-[0-9]*\' out.css | tr \'\\n\' \' \'', wr(ORD3, 46), "$ grep -o '^\\.mt-[0-9]*' out.css | tail -1", WIN3 + '      <- generated LAST => WINS'].join('\n'), { fs: 15, wrap: 56, title: 'Tailwind 3.4.19 (real)' })),
    D(B('sap3', { url: 'psc/sap.html · Tailwind 3.4.19', h: 190, w: 540 }),
      box('Read the order', '1, 10, 12, 16, 2, 20, 24, 3, 32, 4, 8 — <b>dictionary</b> order, not numeric: "10" comes before "2" because the character "1" &lt; "2". Not the first written (<code>mt-1</code>), not the last written (<code>mt-32</code>), not the biggest. <code>mt-8</code> wins because "8" sorts last. Chromium: <b>' + S3.m + '</b> for <code>mt-8 mt-32</code>.', 'do2')), 'r46'),
    en: 'The surprising half. Put eleven margin-top classes on one element and read the output. One, ten, twelve, sixteen, two: dictionary order, not numeric. The last one generated is mt-eight, so it wins. Not the first written, not the last, not the biggest. Chromium measures thirty-two pixels.' },
  { t: 'Mixed keys: px, 0.5, 2.5 — and a claim to correct', body: two(D(tn(['$ grep -oE \'^\\.mt-[^ ]+\' tron.css   # mt-px … mt-32', wr(TRON3, 46)].join('\n'), { fs: 15, wrap: 56, title: 'Tailwind 3.4.19 (real)' }),
      tn(['$ grep -oE \'^ *\\.mt-[^ ]+\' out.css   # Tailwind 4.3.5', wr(ORD4, 46)].join('\n'), { fs: 15, wrap: 56, title: 'Tailwind 4.3.5 (real)' })),
    D(box('Why strings in Tailwind 3', 'The scale mixes <code>px</code>, <code>0.5</code>, <code>2.5</code> and <code>32</code>. Sorting the keys as text gives <b>one</b> deterministic order for all of them — <code>px</code> simply lands last.', 'lam'),
      box('Correction (measured)', 'The old lesson said string sort is "the only definable order". Tailwind 4 proves otherwise: it sorts the numbers <b>numerically</b> and puts <code>px</code> after them. String sort was a <b>choice</b>, and Tailwind 4 changed it.', 'do2')), 'r46'),
    en: 'Mixed keys. Tailwind three sorts px, zero point five and thirty-two as text, so px lands last. The old lesson called this the only definable order. Tailwind four proves otherwise: numbers in numeric order, px after them. String sort was a choice, and version four changed it.' },
  { t: 'Tailwind 4: numeric sort — the winner FLIPS', body: two(D(tn(['# Tailwind 3.4.19', wr(ORD3, 46), '# Tailwind 4.3.5', wr(ORD4, 46)].join('\n'), { fs: 15, wrap: 56, title: 'generated order (real)' })),
    D(B('sap4', { url: 'psc/v4/sap.html · Tailwind 4.3.5', h: 290, w: 400 }),
      cmp(['class', 'Tailwind 3', 'Tailwind 4'], [['<code>mt-8 mt-32</code> → margin-top', `<b>${S3.m}</b>`, `<b>${S4.m}</b>`]], { hl: [0] }),
      box('Still a bug', 'Same line, <b>4×</b> the margin after an upgrade. One class was always dead code; only which one changed.', 'do2')), 'r46'),
    en: 'Tailwind four sorts numerically, so mt-thirty-two is generated last and wins: one hundred twenty-eight pixels instead of thirty-two. The same line of code renders four times the margin after an upgrade. It is still a bug: one class was always dead; only which one changed.' },
  { t: 'The sensible half: ACROSS property groups', body: two(D(tn(['$ grep -oE \'^\\.[a-z]+-[0-9]+\' nhom.css   # "pt-1 p-2 px-3 py-4 pl-5"', NHOM3, '# Tailwind 4.3.5', NHOM4].join('\n'), { fs: 15, wrap: 56, title: 'real output' }),
      box('Designed order', 'Broadest first (<code>p</code>, all four sides), then <b>axes</b> (<code>px</code>, <code>py</code>), then single <b>sides</b>. The narrower the intent, the later it is generated — so it wins, reliably, in both versions.', 'xanh')),
    D(cmp(['<code>p-4 px-8</code>', 'Tailwind 3', 'Tailwind 4'], [['padding-top', S3.pt, S4.pt], ['padding-left', `<b>${S3.pl}</b>`, `<b>${S4.pl}</b>`]]),
      box('Trust this one', '"4 everywhere, 8 horizontally" — exactly what anyone means by <code>p-4 px-8</code>. A broad utility plus a narrower override is a <b>legitimate, readable</b> pattern, stable across versions.', 'ok')), 'r46'),
    en: 'The sensible half: across groups. Broadest first, p for all sides, then the axes px and py, then single sides. The narrower utility is generated later and wins, by design, in both versions. P-four px-eight measures sixteen top and thirty-two left: four everywhere, eight horizontally.' },
  { t: 'Words, not numbers: text-sm vs text-lg', body: two(D(html('<div id="t" class="text-sm text-lg">text-sm text-lg</div>', { sm: true }),
      cmp(['<code>text-sm text-lg</code>', 'Tailwind 3', 'Tailwind 4'], [['font-size', `<b>${S3.t}</b> (= text-sm)`, `<b>${S4.t}</b> (= text-sm)`]], { hl: [0] })),
    D(box('Read it', 'Size names are words, sorted <b>alphabetically</b> in both versions: "lg" &lt; "sm", so <code>text-sm</code> is generated after <code>text-lg</code> and wins. The bigger size loses. "Bigger wins" is not a rule anywhere.', 'do2'),
      box('Where this comes from', 'Usually a template string that meant to choose <b>one</b> branch, but concatenated <b>both</b> — <code>`text-sm ${big ? \'text-lg\' : \'\'}`</code>. Lesson 3.4 fixes it at runtime.', 'lam')), 'r46'),
    en: 'Words, not numbers. Text-sm text-lg measures fourteen pixels in both versions: size names are sorted alphabetically, lg before sm, so text-sm wins. The bigger size loses. This usually comes from a template string that meant to choose one branch but concatenated both.' },
  { t: 'The rule that falls out', body: cmp(['example', 'verdict', 'why'], [
      ['<code>p-4 px-8</code>', '<b>OK</b>', 'different scope; the narrower one is generated later by design — readable, stable'],
      ['<code>mt-4 mb-4</code>', '<b>OK</b>', 'two different properties — no conflict exists'],
      ['<code>mt-2 mt-10</code>', '<b style="color:#b91c1c">BUG</b>', 'same property, same scope — one is dead code; the sort picks which (and v4 picks differently)'],
      ['<code>text-sm text-lg</code>', '<b style="color:#b91c1c">BUG</b>', 'same — typical when a template string concatenates both branches'],
    ], { hl: [2, 3] }) + box('The one question', 'Is it the <b>same property at the same scope</b>? Yes ⇒ it is a mistake, not an override. A reviewer who bans both <code>p-4 px-8</code> and <code>mt-2 mt-10</code> loses a useful pattern; one who allows both ships the bug.', 'lam'),
    en: 'The rule. P-four px-eight: fine, different scope. Mt-four mb-four: fine, different properties. Mt-two mt-ten: a bug, one is dead code. Text-sm text-lg: the same. The one question to ask in review: is it the same property at the same scope? If yes, it is a mistake, not an override.' },
  { t: 'Let a linter find them: no-contradicting-classname', body: D(tsx(THE, { sm: true }),
    two(tn(['$ npx eslint the.jsx   # eslint 8 + plugin 3.18.3', L3].join('\n'), { fs: 13, wrap: 52, title: 'Tailwind 3 (real)' }),
      tn(['$ npx eslint the.jsx   # eslint 9 + plugin 4.4.0', L4].join('\n'), { fs: 13, wrap: 52, title: 'Tailwind 4 (real)' }), ''),
    box('Static vs dynamic', 'Only case A is flagged; B and C are correctly allowed. Case D only becomes <code>mt-2 mt-10</code> at <b>runtime</b>, so it is structurally invisible to any linter — that is why lesson 3.4\'s runtime merge is still needed.', 'lam')),
    en: 'Let a linter find them. Eslint-plugin-tailwindcss, rule no-contradicting-classname, in both its Tailwind three and Tailwind four versions, flags only case A, mt-two mt-ten. B and C are correctly allowed. D, the dynamic one, is invisible to any linter: it only exists at runtime.' },
  { t: `Measured in this site: ${NXD} static conflicts in ${NTEP.toLocaleString('en-US')} files`, body: two(D(tn(['$ bash lint-kho.sh   # every frontend/src/**/*.tsx, real tailwind.config.ts', `plugin crashed on: ${SAP}`, `tsx files: ${NTEP}`, `static conflicts: ${NXD}`].join('\n'), { fs: 15, wrap: 56, title: 'eslint-plugin-tailwindcss 3.18.3 · 14/11/2026 (real)' }),
      cmp(['kind', 'count'], [['<code>dark:text-slate-500 dark:text-slate-600</code> (Notes)', nhom('dark:text-slate-500')], ['<code>block … flex</code>', nhom('block, flex')], ['<code>relative sticky</code>', nhom('relative, sticky')], ['<code>font-heading font-mono</code>', nhom('font-heading')], ['<code>sm:mx-6 … sm:mx-0</code>', nhom('sm:mx-6')]])),
    D(box('Read it', `${NXD} conflicts in ${NTEP} files: the team mostly avoids them. Most are harmless dead classes (<code>relative</code> next to <code>sticky</code>, a duplicated <code>dark:</code> colour). One has a <b>visible</b> effect — next slide.`, 'xanh'),
      box('A tool limit, measured', `The plugin <b>crashed</b> on <code>${SAP.replace('src/components/', '')}</code> ("Node must be provided…"). Run it in batches, or one crashing file hides the whole report — the first full run printed <b>0</b> conflicts.`, 'do2')), 'r46'),
    en: 'Measured in this site. The linter over every component with the real config: fifteen static conflicts in one thousand six hundred seventy-seven files. Most are harmless dead classes. One file crashed the plugin, and a single crash made the first full run report zero, so run it in batches.' },
  { t: 'One real bug — FIXED 14/11: the music player margin', body: two(D(tsx(wr(MUSIC_SRC.replace(/^178:\s*/, ''), 58), { sm: true }), css(MUSIC_CSS, { sm: true }), box('Read it', 'Built with this site\'s <b>real</b> config: <code>.sm\\:mx-0</code> comes <b>before</b> <code>.sm\\:mx-6</code>. The author wrote <code>sm:mx-0</code> last to cancel the margin next to <code>sm:right-6</code>; it is dead.', 'do2')),
    D(B('music800', { url: 'psk/music.html · GlobalMusicPlayer.tsx:178 class string · 800px', h: 240, w: 560, vp: 800 }),
      cmp(['window', 'margin-left / right'], [['500px (below sm)', `${M5.ml} (mx-3)`], ['800px (sm)', `<b>${M8.ml}</b> — mx-0 ignored`]], { hl: [1] }),
      box('Effect — and the fix', 'The playlist panel sat <b>48px</b> from the right edge instead of the 24px of <code>right-6</code>. Measured above (before the fix); reported with file:line + repro, and fixed on 14/11/2026 by deleting <code>sm:mx-6</code> (<code>42250e8c6</code>).', 'ok')), 'r46'),
    en: 'One real bug. The music player popup writes sm mx-six and later sm mx-zero, to cancel the margin. Built with this site\'s real config, mx-zero is generated first, so it is dead: at eight hundred pixels the margin is twenty-four, and the panel sat forty-eight pixels from the edge instead of twenty-four. It was fixed on November fourteenth by deleting sm mx-six.' },
  { t: 'Trap: "adding a scale value silently flips winners"', body: two(D(tn(['$ # mt-8 mt-32 with the default scale', GOC, '$ # same, after extend.spacing: { 18: \'4.5rem\' }', THEM].join('\n'), { fs: 15, wrap: 56, title: 'Tailwind 3.4.19 (real)' }),
      box('Correction (measured)', 'The old lesson warned that adding ONE custom value can silently change which class wins elsewhere. Measured: adding <code>18</code> slots it in, but <code>.mt-32</code> still precedes <code>.mt-8</code>. A string sort never reorders an existing pair.', 'do2')),
    D(box('What really flips winners', '<ul><li><b>Upgrading</b> Tailwind 3 → 4 (string → numeric sort)</li><li><b>Renaming</b> a key (e.g. <code>sm</code> → <code>small</code>)</li><li>Changing which <b>property</b> a custom utility sets</li></ul>', 'xanh'),
      box('Trap: treating p-4 px-8 and mt-2 mt-10 alike', 'They look identical and are opposite in nature: a designed override vs undefined behaviour that happens to be deterministic — which is why the bug looks intentional.', 'lam')), 'r46'),
    en: 'Two traps. The old lesson warned that adding one scale value can silently flip winners. Measured: adding eighteen leaves mt-thirty-two before mt-eight; string sort never reorders an existing pair. What really flips winners is upgrading to Tailwind four. And never treat p-four px-eight like mt-two mt-ten.' },
  { t: 'In real life — and the attacker\'s view', body: two(D(box('Every day', 'Your phone or GitHub lists <code>Lesson 10.pdf</code> before <code>Lesson 2.pdf</code> — the same dictionary sort. Windows Explorer sorts "naturally", like Tailwind 4. Same files, two orders.', 'lam'),
      box('What if…', '…you upgrade to Tailwind 4 with <code>mt-2 mt-10</code> still in the code? The dead class comes back to life: measured 32px → 128px on the same line.', 'xanh')),
    D(B('an3', { url: 'psc/an.html · Tailwind 3.4.19', h: 150, w: 520 }),
      box('The attacker\'s view: a review that reads left-to-right', `A PR "fixes the link colour": <code>class="hidden text-red-600 underline font-bold block"</code>. The reviewer sees <code>block</code> last and assumes visible. <code>.hidden</code> is generated after <code>.block</code> — display <b>${H3.d}</b> in both versions. The "Cancel renewal" link is gone. Defend with this lint rule in CI and a <code>toBeVisible()</code> test.`, 'do2')), 'r46'),
    en: 'In real life: your phone lists lesson ten before lesson two, the same dictionary sort. The attacker view: a pull request adds hidden at the start of a long class string ending in block. The reviewer reads block last; hidden wins in both versions and the cancel link disappears. Lint in CI, test visibility.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('lexicographic sort', 'v3: "10" before "2"'), kw('numeric sort', 'v4: 2 < 10 < 32, then px'), kw('semantic hierarchy', 'p → px/py → pt/pl'),
      kw('across-group override', 'p-4 px-8: trustworthy'), kw('within-group conflict', 'mt-2 mt-10: always a bug'), kw('deterministic but arbitrary', 'reproducible, so it looks intended'),
      kw('no-contradicting-classname', 'lint rule — static cases only'), kw('dead class', 'present in markup, never applied'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: lexicographic sort in version three; numeric sort in version four; the semantic hierarchy across groups; across-group override; within-group conflict; deterministic but arbitrary; the no-contradicting-classname lint rule; and dead class.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Put ${c('mt-1 … mt-32')} on one element; read the order in Tailwind 3 and 4`,
      `Measure ${c('mt-8 mt-32')}, ${c('p-4 px-8')} and ${c('text-sm text-lg')} in DevTools`,
      `Install ${c('eslint-plugin-tailwindcss')} and enable ${c('no-contradicting-classname')}`,
      'Lint your project in batches; open every hit and delete the dead class',
    ]), box('Keep these', '<ul><li>Across groups: designed order, trust it</li><li>Within a group: v3 string, v4 numeric — never rely on either</li><li>Same property + same scope = bug</li><li>Lint catches static conflicts, not runtime ones</li></ul>', 'lam'), ''),
    en: 'Your turn: read the order of eleven margin classes in both versions; measure three conflicts in DevTools; install the lint rule; and lint your project in batches, deleting every dead class. Keep: across groups, trust the order; within a group, never rely on it.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — Conflicts, where the model leaks', bai: '3.2' }, S);
