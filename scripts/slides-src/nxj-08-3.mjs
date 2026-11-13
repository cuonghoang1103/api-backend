/*DU_LIEU*/
const DU_LIEU = {
 "n8-3:file:src/app/shop/layout.tsx": "import Link from 'next/link';\nimport Dem from './Dem';\n\nexport default function ShopLayout({ children }: LayoutProps<'/shop'>) {\n  return (\n    <div className=\"flex gap-4 p-4 font-sans\">\n      <aside className=\"w-60 space-y-2 rounded border p-2\">\n        <p>🛒 Sidebar của shop</p>\n        <Dem ten=\"layout\" />\n        <nav className=\"flex flex-col\">\n          <Link id=\"link-a\" href=\"/shop/a\">Link → /shop/a</Link>\n          <Link id=\"link-b\" href=\"/shop/b\">Link → /shop/b</Link>\n          <a id=\"a-b\" href=\"/shop/b\">&lt;a href&gt; → /shop/b</a>\n        </nav>\n      </aside>\n      <main className=\"flex-1 rounded border p-2\">{children}</main>\n    </div>\n  );\n}\n",
 "n8-3:file:src/app/shop/template.tsx": "import Dem from './Dem';\n\nexport default function ShopTemplate({ children }: { children: React.ReactNode }) {\n  return <div className=\"space-y-2\"><Dem ten=\"template\" />{children}</div>;\n}\n",
 "n8-3:file:src/app/shop/Dem.tsx": "'use client';\nimport { useEffect, useState } from 'react';\n\n// Bộ đếm có state + đếm số lần GẮN (mount) — ghi vào sessionStorage để sống qua cả lần tải lại trang\nexport default function Dem({ ten }: { ten: string }) {\n  const [n, setN] = useState(0);\n  const [gan, setGan] = useState(0);\n  useEffect(() => {\n    const k = Number(sessionStorage.getItem('gan-' + ten) ?? 0) + 1;\n    sessionStorage.setItem('gan-' + ten, String(k));\n    setGan(k);\n  }, [ten]);\n  return (\n    <button id={'dem-' + ten} onClick={() => setN(n + 1)} className=\"block rounded border px-2\">\n      {ten}: {n} · đã gắn {gan} lần\n    </button>\n  );\n}\n",
 "n8-3:file:src/app/shop/a/page.tsx": "import Dem from '../Dem';\n\nexport default function TrangA() {\n  return <><h1>Trang A</h1><Dem ten=\"page-a\" /></>;\n}\n",
 "n8-3:file:src/app/shop/b/page.tsx": "import Dem from '../Dem';\n\nexport default function TrangB() {\n  return <><h1>Trang B</h1><Dem ten=\"page-b\" /></>;\n}\n",
 "n8-3:file:src/app/sp/layout.tsx": "import Link from 'next/link';\nimport DuongDan from './DuongDan';\n\nexport default async function SpLayout({ children, params }: LayoutProps<'/sp'>) {\n  const p = await params;\n  const luc = new Date().toISOString().slice(11, 23);\n  console.log('[sp/layout] render · params =', JSON.stringify(p), '·', luc);\n  return (\n    <div className=\"space-y-2 p-4 font-sans\">\n      <p id=\"lay\">layout: render lúc {luc} · params = {JSON.stringify(p)}</p>\n      <DuongDan />\n      <nav className=\"space-x-4\"><Link id=\"sp1\" href=\"/sp/1\">→ /sp/1</Link><Link id=\"sp2\" href=\"/sp/2\">→ /sp/2</Link></nav>\n      <main className=\"rounded border p-2\">{children}</main>\n    </div>\n  );\n}\n",
 "n8-3:file:src/app/sp/DuongDan.tsx": "'use client';\nimport { usePathname } from 'next/navigation';\n\nexport default function DuongDan() {\n  return <p id=\"duong\">usePathname() = {usePathname()}</p>;\n}\n",
 "n8-3:file:src/app/sp/[id]/page.tsx": "export default async function SanPham({ params }: PageProps<'/sp/[id]'>) {\n  const { id } = await params;\n  const luc = new Date().toISOString().slice(11, 23);\n  console.log('[sp/[id]] render · id =', id, '·', luc);\n  return <p id=\"trang\">page: sản phẩm {id} · render lúc {luc}</p>;\n}\n",
 "n8-3:file:src/app/chu-thich/layout.tsx": "// chép đúng hình dạng đoạn mã của bài web (root layout), đổi html/body thành div vì đây là layout lồng\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return (\n    <div lang=\"vi\">\n      <div>\n        <nav>SiteNav</nav>\n        {children}          // page đang active render ở đây\n      </div>\n    </div>\n  );\n}\n",
 "n8-3:file:src/app/chu-thich/page.tsx": "export default function Trang() {\n  return <p>Nội dung trang</p>;\n}\n",
 "n8-3:trang": "$ find src/app/shop src/app/sp src/app/chu-thich -type f | sort\nsrc/app/chu-thich/layout.tsx\nsrc/app/chu-thich/page.tsx\nsrc/app/shop/a/page.tsx\nsrc/app/shop/b/page.tsx\nsrc/app/shop/Dem.tsx\nsrc/app/shop/layout.tsx\nsrc/app/shop/template.tsx\nsrc/app/sp/[id]/page.tsx\nsrc/app/sp/DuongDan.tsx\nsrc/app/sp/layout.tsx\n$ npm run build\n✓ Compiled successfully in 3.8s\nRoute (app)\n├ ○ /chu-thich\n├ ○ /shop/a\n├ ○ /shop/b\n└ ƒ /sp/[id]\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand\n$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npx eslint src/app/chu-thich/layout.tsx 2>&1 | grep -E 'error|warning|problem' | sed 's#.*/c8/my-app/##'\n  7:19  error  Comments inside children section of tag should be placed inside braces  react/jsx-no-comment-textnodes\n✖ 1 problem (1 error, 0 warnings)",
 "n8-3:mo": "$ curl -s localhost:19373/chu-thich | grep -o '<nav>SiteNav</nav>.*ở đây</div>' | sed 's#<!--[^>]*-->##g'\n<nav>SiteNav</nav><p>Nội dung trang</p>          // page đang active render ở đây</div>",
 "n8-3:log": "$ npx next start   (log máy chủ: tải /sp/1 rồi bấm Link sang /sp/2)\n[sp/layout] render · params = {} · 12:01:43.192\n[sp/[id]] render · id = 1 · 12:01:43.192\n[sp/[id]] render · id = 2 · 12:01:44.507",
 "n8-3:gocbat": "$ npm run build   (đã xoá app/layout.tsx)\n▲ Next.js 16.4.6 (Turbopack)\n✓ Running next.config.ts took 193ms\n> Build error occurred\nError: Turbopack build failed with 5 errors:\n./src/app/about/page.tsx\nError: about/page.tsx doesn't have a root layout. To fix this error, make sure every page has a root layout.\n./src/app/blog/latest/page.tsx\nError: blog/latest/page.tsx doesn't have a root layout. To fix this error, make sure every page has a root layout.\n./src/app/blog/page.tsx\nError: blog/page.tsx doesn't have a root layout. To fix this error, make sure every page has a root layout.",
 "n8-3:thuc": "$ grep -n \"SiteNav\\|AuthProvider\\|MusicAudioController\" frontend/src/app/layout.tsx | grep -v import\n403: <AuthProvider>\n404: {/* Must be inside AuthProvider so useAuth() works if any future\n417: <SiteNav />\n422: destination now lives in SiteNav's mega menus. `.app-main` is\n429: <MusicAudioController />\n449: </AuthProvider>\n$ sed -n '417p;424,426p;429,431p' frontend/src/app/layout.tsx\n              <SiteNav />\n            <main className=\"app-main min-h-screen w-full\">\n              {children}\n            </main>\n              <MusicAudioController />\n              <MusicHistoryRecorder />\n              <GlobalMusicPlayer />",
 "anh-nxj-8-3:shop-truoc": {
  "url": "http://127.0.0.1:19373/shop/a",
  "vp": [
   640,
   260
  ],
  "rect": {
   "aside": [
    16,
    16,
    240,
    156
   ],
   "main": [
    272,
    16,
    352,
    156
   ],
   "#dem-layout": [
    25,
    57,
    179,
    26
   ],
   "#dem-template": [
    281,
    25,
    200,
    26
   ],
   "#dem-page-a": [
    281,
    91,
    187,
    26
   ],
   "#link-b": [
    25,
    115,
    222,
    24
   ],
   "#a-b": [
    25,
    139,
    222,
    24
   ]
  },
  "console": []
 },
 "anh-nxj-8-3:shop-link": {
  "url": "http://127.0.0.1:19373/shop/b",
  "vp": [
   640,
   260
  ],
  "rect": {
   "aside": [
    16,
    16,
    240,
    156
   ],
   "main": [
    272,
    16,
    352,
    156
   ],
   "#dem-layout": [
    25,
    57,
    179,
    26
   ],
   "#dem-template": [
    281,
    25,
    204,
    26
   ],
   "#dem-page-a": null,
   "#link-b": [
    25,
    115,
    222,
    24
   ],
   "#a-b": [
    25,
    139,
    222,
    24
   ]
  },
  "console": []
 },
 "anh-nxj-8-3:shop-a": {
  "url": "http://127.0.0.1:19373/shop/a",
  "vp": [
   640,
   260
  ],
  "rect": {
   "aside": [
    16,
    16,
    240,
    156
   ],
   "main": [
    272,
    16,
    352,
    156
   ],
   "#dem-layout": [
    25,
    57,
    184,
    26
   ],
   "#dem-template": [
    281,
    25,
    204,
    26
   ],
   "#dem-page-a": null,
   "#link-b": [
    25,
    115,
    222,
    24
   ],
   "#a-b": [
    25,
    139,
    222,
    24
   ]
  },
  "console": [],
  "ketQua": {
   "truoc": [
    "layout: 3 · đã gắn 1 lần",
    "template: 2 · đã gắn 1 lần",
    "page-a: 2 · đã gắn 1 lần"
   ],
   "sauLink": [
    "layout: 3 · đã gắn 1 lần",
    "template: 0 · đã gắn 2 lần",
    "page-b: 0 · đã gắn 1 lần"
   ],
   "docLink": "1 document · /shop/b",
   "sauA": [
    "layout: 0 · đã gắn 2 lần",
    "template: 0 · đã gắn 3 lần",
    "page-b: 0 · đã gắn 2 lần"
   ]
  }
 },
 "anh-nxj-8-3:sp-1": {
  "url": "http://127.0.0.1:19373/sp/1",
  "vp": [
   640,
   220
  ],
  "rect": {
   "#lay": [
    16,
    16,
    608,
    24
   ],
   "#duong": [
    16,
    48,
    608,
    24
   ],
   "#trang": [
    25,
    121,
    590,
    24
   ],
   "#sp2": [
    91,
    81,
    62,
    21
   ]
  },
  "console": []
 },
 "anh-nxj-8-3:sp": {
  "url": "http://127.0.0.1:19373/sp/1",
  "vp": [
   640,
   220
  ],
  "rect": {
   "#lay": [
    16,
    16,
    608,
    24
   ],
   "#duong": [
    16,
    48,
    608,
    24
   ],
   "#trang": [
    25,
    121,
    590,
    24
   ],
   "#sp2": [
    91,
    81,
    62,
    21
   ]
  },
  "console": [],
  "ketQua": {
   "truoc": [
    "layout: render lúc 12:01:43.192 · params = {}",
    "usePathname() = /sp/1",
    "page: sản phẩm 1 · render lúc 12:01:43.192"
   ],
   "sau": [
    "layout: render lúc 12:01:43.192 · params = {}",
    "usePathname() = /sp/2",
    "page: sản phẩm 2 · render lúc 12:01:44.507"
   ]
  }
 },
 "anh-nxj-8-3:chu": {
  "url": "http://127.0.0.1:19373/chu-thich",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": []
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, br, tree } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-08-3', code: 'NXJ 8.3', title: 'Nested layouts: shared UI that survives navigation', sub: 'Chapter 8 · Lesson 8.3' };
const O = (k) => { const v = DU_LIEU[`n8-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-8-3:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-08-3', ten, o);
const lay = (k, ...re) => { const s = O(k); const l = s.split('\n').filter((x) => !x.startsWith('$ ') && re.some((r) => r.test(x))); if (!l.length) throw new Error('không thấy dòng trong ' + k); return l.join('\n'); };
const SH = AN('shop-a').ketQua, SP = AN('sp').ketQua;
const J = (a) => JSON.stringify(a);
if (J(SH.truoc) !== J(['layout: 3 · đã gắn 1 lần', 'template: 2 · đã gắn 1 lần', 'page-a: 2 · đã gắn 1 lần']) || J(SH.sauLink) !== J(['layout: 3 · đã gắn 1 lần', 'template: 0 · đã gắn 2 lần', 'page-b: 0 · đã gắn 1 lần'])
  || J(SH.sauA) !== J(['layout: 0 · đã gắn 2 lần', 'template: 0 · đã gắn 3 lần', 'page-b: 0 · đã gắn 2 lần'])) throw new Error('số đo shop 8.3 đổi');
if (SP.truoc[0] !== SP.sau[0] || !/params = \{\}/.test(SP.sau[0]) || SP.sau[1] !== 'usePathname() = /sp/2' || SP.truoc[2] === SP.sau[2]) throw new Error('số đo sp 8.3 đổi');
for (const [k, s] of [['trang', 'tsc: 0 lỗi'], ['trang', 'react/jsx-no-comment-textnodes'], ['mo', '// page đang active render ở đây'], ['gocbat', "doesn't have a root layout"], ['log', 'id = 2']])
  if (!O(k).includes(s)) throw new Error(`số đo 8.3 đổi: ${k} thiếu "${s}"`);
if ((O('log').match(/\[sp\/layout\]/g) || []).length !== 1) throw new Error('layout phải render đúng 1 lần');
const nest = (tang) => tang.reduceRight((trong, [ten, mo, mau]) => `<div style="border:3px solid ${mau};border-radius:14px;padding:8px 14px 10px;background:${mau}12;margin-top:6px"><div style="font:800 21px Arial;color:${mau}">${ten}</div><div style="font:17px Arial;color:#475569;margin-bottom:4px">${mo}</div>${trong}</div>`, '');
const td = (t) => t.replace(/ · đã gắn (\d) lần/, ' · mounted $1×');

export const S = [
  { cover: true, nhan: 'Chapter 8 · Lesson 8.3', t: 'Nested layouts', sub: 'Shared UI that wraps a subtree — and survives navigation. Measured: what stays, what resets, what the server re-renders',
    en: 'Lesson eight point three: nested layouts — shared UI that wraps a part of the app and survives navigation. We measure exactly what stays, what resets, and what the server renders again.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The shape of a layout: it receives <code>children</code> and decides where the page goes</li>
    <li>Nested layouts follow folders: root → section → page</li>
    <li>The key behaviour, measured: a layout does <b>not</b> remount when you navigate with <code>&lt;Link&gt;</code></li>
    <li><code>template.tsx</code> — the sibling that remounts every time</li>
    <li>The pitfalls: route params in a layout, and a comment that shows up on the page</li></ul>`,
    en: 'Five takeaways: the shape of a layout; nested layouts follow folders; the key behaviour, measured — a layout does not remount on Link navigation; template, the sibling that does remount; and two pitfalls: route params in a layout, and a comment that appears on the page.' },
  { t: 'The shape of a layout — the root one is required', body: two(tsx(`// app/layout.tsx — the root layout (required)
export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <SiteNav />
        {children}   {/* the active page renders here */}
      </body>
    </html>
  );
}`, { sm: true, hl: [7] }), D(box('children = the slot', 'A layout always receives <code>children</code> and decides where it goes. The active route is nested into that slot — the "children as a slot" idea of Chapter 2, applied by the router.', 'xanh'),
      box('Only the root layout', 'owns <code>&lt;html&gt;</code> and <code>&lt;body&gt;</code>. Delete it and <code>next build</code> fails: <i>' + lay('gocbat', /about\/page\.tsx doesn't have/).replace(/^Error: /, '') + '</i>', 'lam')), '') +
      box('Typed for you (Next.js 16)', 'create-next-app writes <code>{ children }: LayoutProps&lt;"/"&gt;</code> — a type generated from your folders, so <code>children</code> (and later <code>params</code>) are checked.', 'xanh'),
    en: 'The shape of a layout. It receives children and decides where they go: the active page renders in that slot — the children-as-a-slot idea from chapter two, now applied by the router. The root layout at the top of app is required and is the only one that owns html and body. We deleted it and the build failed: about page dot tsx does not have a root layout.' },
  { t: 'Nested layouts follow the folders', body: two(tree(['app/', '  layout.tsx        // wraps EVERYTHING', '  page.tsx          // /', '  dashboard/', '*    layout.tsx      // wraps /dashboard/* only', '    page.tsx        // /dashboard', '    settings/', '      page.tsx      // /dashboard/settings'], { fs: 20 }),
      D(nest([['app/layout.tsx', 'html · body · SiteNav', '#111827'], ['dashboard/layout.tsx', 'sidebar of the dashboard', '#0070f3'], ['settings/page.tsx', 'the content', '#1f8a3b']]),
        box('/dashboard/settings', 'root layout → dashboard layout → settings page. A sidebar written once in <code>dashboard/layout.tsx</code> appears on every route below it, and nowhere else.', 'lam')), ''),
    en: 'Nested layouts follow the folders. Visiting slash dashboard slash settings composes three files: the root layout, then the dashboard layout, then the settings page. Each layout wraps the next one. A sidebar written once in the dashboard layout appears on every route under dashboard, and nowhere else.' },
  { t: 'Measured: a Link keeps the layout mounted', body: two(D(B('shop-truoc', { vp: 640, h: 160, w: 540, url: '/shop/a — after clicking 3 · 2 · 2' })), D(B('shop-link', { vp: 640, h: 160, w: 540, url: '/shop/b — after clicking a <Link>' })), '') +
      cmp(['Counter (state · mounts)', 'on /shop/a', 'after <code>&lt;Link&gt;</code> → /shop/b'], [
        ['in <code>shop/layout.tsx</code>', td(SH.truoc[0]), `<b>${td(SH.sauLink[0])}</b>`],
        ['in <code>shop/template.tsx</code>', td(SH.truoc[1]), td(SH.sauLink[1])],
        ['in the page', td(SH.truoc[2]), td(SH.sauLink[2])],
      ], { hl: [0] }) + box('Only the layout kept its state', 'Same click history, three different fates: the layout counter survived the navigation, the template and the page started from zero.', 'xanh'),
    en: 'Measured on next start. The shop layout, its template and each page hold a counter that also counts how many times it was mounted. On slash shop slash a we clicked three, two and two times. Then a Link to shop b: the layout still shows three and was mounted once — it never unmounted. The template reset to zero and mounted a second time; page b is new.' },
  { t: 'Why: client navigation swaps only the slot', body: two(steps([
      'You click a <code>&lt;Link&gt;</code>: no new document is loaded',
      'Next.js fetches only the segments that changed (the page)',
      'It swaps them into the slot; the shared layout stays mounted',
      'State, scroll position and playing media in the layout survive',
    ]), box('What you get', 'A music player in a layout keeps playing. An open sidebar stays open. The nav keeps its scroll. No remount, no flash.', 'xanh') +
      box('Measured', `<code>performance.getEntriesByType('navigation')</code> after the Link: <b>${SH.docLink}</b> — still the first document; only the URL changed.`, 'lam'), ''),
    en: 'Why does the layout survive? With a Link no new document is loaded: Next.js fetches only the segments that changed and swaps them into the slot, while the shared layout stays mounted. So its state, its scroll position and any playing media survive. We checked: after the Link there was still exactly one navigation entry — the first document.' },
  { t: 'The contrast: a plain &lt;a href&gt; destroys everything', body: cmp(['Counter (state · mounts)', 'after <code>&lt;Link&gt;</code>', 'after <code>&lt;a href&gt;</code> → /shop/b'], [
      ['layout', td(SH.sauLink[0]), `<b>${td(SH.sauA[0])}</b>`],
      ['template', td(SH.sauLink[1]), td(SH.sauA[1])],
      ['page', td(SH.sauLink[2]), td(SH.sauA[2])],
    ], { hl: [0] }) + two(box('Full page reload', 'A plain anchor makes the browser load a new document: the whole app restarts, every layout mounts again, in-memory state is lost — the layout counter is back to 0.', 'do2'),
      box('Rule', 'Inside the app, internal links go through <code>&lt;Link&gt;</code> (lesson 8.4). Keep plain <code>&lt;a&gt;</code> for external URLs.', 'xanh'), ''),
    en: 'The contrast: a plain anchor tag to the same URL. The browser loads a new document, the whole app restarts and every layout mounts again. The layout counter went from three back to zero and its mount count rose to two. That is why internal links go through Link — the next lesson — and plain anchors are for external sites.' },
  { t: 'layout vs template', body: two(tsx(`// app/shop/template.tsx
export default function ShopTemplate(
  { children }
) {
  return <div>
    <Dem ten="template" />
    {children}
  </div>;
}`, { sm: true }), cmp(['', 'layout.tsx', 'template.tsx'], [
      ['on navigation between children', 'stays mounted', '<b>remounts</b> (a new instance)'],
      ['its state', 'kept (layout: 3 → 3)', 'reset (template: 2 → 0)'],
      ['effects with []', 'run once', 'run again on every navigation'],
      ['use it for', '99 times in 100', 'per-page enter animation, reset-per-page state'],
    ], { hl: [1] }), '') + box('Same shape, opposite lifetime', 'Both receive <code>children</code>. Reach for <code>template.tsx</code> only when you really want a fresh instance each time.', 'lam'),
    en: 'Layout versus template. A template looks exactly like a layout — it receives children — but it remounts on every navigation. Measured: the template counter went from two to zero and its mount count rose by one each time. Use it only when you really want a fresh instance per page, such as replaying an enter animation. Ninety-nine times in a hundred you want a layout.' },
  { t: 'Measured: on navigation the server renders only the page', body: two(tsx(`// app/sp/layout.tsx (Server Component)
const p = await params;
const luc = new Date().toISOString().slice(11, 23);
console.log('[sp/layout] render', p, luc);

// app/sp/[id]/page.tsx
console.log('[sp/[id]] render', id, luc);`, { sm: true }), tn(lay('log', /\[sp/), { fs: 16, title: 'server log: load /sp/1, then <Link> to /sp/2 (real)' }), '') +
      cmp(['On screen', 'on /sp/1', 'after <code>&lt;Link&gt;</code> → /sp/2'], [
        ['layout (server)', SP.truoc[0].replace('layout: ', ''), `<b>${SP.sau[0].replace('layout: ', '')}</b> (same)`],
        ['usePathname() (client)', SP.truoc[1].replace('usePathname() = ', ''), `<b>${SP.sau[1].replace('usePathname() = ', '')}</b>`],
        ['page (server)', SP.truoc[2].replace('page: ', ''), SP.sau[2].replace('page: ', '')],
      ], { hl: [0] }),
    en: 'What does the server do on navigation? The layout and page both log when they render. Load slash sp slash one: both render. Click a Link to sp two: the server log gains only the page line. On screen the layout\'s render time is unchanged, the page\'s time is new — and a small client component using usePathname did update to slash sp slash two.' },
  { t: 'Pitfall: reading the current route in a layout', body: two(D(box('The layout cannot even see the child\'s id', `<code>app/sp/layout.tsx</code> printed <b>params = {}</b>. A layout receives the params of its <b>own</b> segment (and parents), not of the pages below it.`, 'do2'),
      box('And it does not re-render', 'Anything a layout derives from the URL — a breadcrumb, a tab title — is captured on its first render and goes stale while the page updates. It looks like a cache bug. It is the very mechanism that makes navigation cheap.', 'lam')),
      D(tsx(O('file:src/app/sp/DuongDan.tsx').trim(), { sm: true, hl: [5] }), box('The fix', 'Whatever must follow the current route belongs in the <b>page</b>, or in a small Client Component inside the layout that calls <code>usePathname()</code> — measured: <code>/sp/1 → /sp/2</code>.', 'xanh')), ''),
    en: 'The pitfall: reading the current route in a layout. Our sp layout printed params as an empty object — a layout gets the params of its own segment, not of the pages below it. And it does not re-render on navigation, so anything it derives from the URL, like a breadcrumb, goes stale while the page updates. The fix: put it in the page, or in a small Client Component that calls usePathname.' },
  { t: 'Pitfall in the lesson snippet: // after {children}', body: tsx(O('file:src/app/chu-thich/layout.tsx').trim().split('\n').slice(1).join('\n'), { sm: true, hl: [6] }) +
      tn(lay('mo', /SiteNav/) + '\n' + lay('trang', /tsc: 0/, /jsx-no-comment-textnodes/), { fs: 15, title: 'curl · tsc · eslint (real)' }) +
      two(B('chu', { vp: 640, h: 96, w: 530, url: 'localhost:3000/chu-thich', mark: [[0, 47, 300, 26, '']] }),
      box('Between JSX tags, // is text', 'TypeScript and <code>next build</code> are happy; the words appear on the page. Only ESLint\'s <code>react/jsx-no-comment-textnodes</code> catches it. Write <code>{/* … */}</code>.', 'do2'), ''),
    en: 'A pitfall we measured in the lesson\'s own snippet. The root layout example put a double-slash comment after children, between JSX tags. There it is not a comment — it is text. TypeScript and the build pass, and the words appear on the page; only ESLint\'s jsx-no-comment-textnodes rule catches it. Inside JSX, comments go in curly braces with slash-star.' },
  { t: 'cuongthai.com depends on this', body: two(D(tn(O('thuc').split('\n').filter((l) => !l.startsWith('$ ')).slice(-7).join('\n'), { fs: 18, title: 'frontend/src/app/layout.tsx (real excerpt)' })),
      D(box('The durable shell lives in layouts', 'Top nav, login state, theme — all above the page slot in the root layout. Going from <code>/feed</code> to <code>/courses</code> never remounts the shell or drops the session in memory.', 'xanh'),
        box('The music feature', 'The audio controller and player sit <b>after</b> <code>{children}</code>, in the layout — not in a page. That is why audio started on one page keeps playing while you browse.', 'lam')), ''),
    en: 'Cuongthai dot com depends on exactly this. In its root layout the site nav comes before the main slot, and the music audio controller and player come after it — in the layout, not in any page. So going from feed to courses never remounts the shell or drops the session, and audio started on one page keeps playing while you browse.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Nested layout', 'a layout.tsx in a sub-folder, wrapping its pages'), kw('Persistence', 'a layout does not remount when navigating between its children'),
      kw('children', 'where the inner layout or page renders'), kw('Segment', 'one folder level in app/ that can own a layout'),
      kw('template.tsx', 'like a layout, but remounts on every navigation'), kw('Root layout', 'required; the only one with html and body'),
      kw('usePathname()', 'client hook for the current path'), kw('Layout vs page state', 'layout state survives; page state resets'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: nested layout; persistence; children; segment; template; root layout; usePathname; and layout state versus page state.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Add a ${c('layout.tsx')} with a sidebar in a sub-folder; navigate between its pages with ${c('<Link>')}`,
      'Put a counter in the layout and one in the page: which one survives?',
      `Swap the ${c('<Link>')} for ${c('<a href>')} and count again`,
      `Log in a layout and in a page; navigate and read the server log. Then show the path with ${c('usePathname()')}`,
    ]), box('Keep these', `<ul><li>Layouts nest like folders; children = slot</li><li>Link: the layout stays mounted</li><li><code>&lt;a href&gt;</code>: everything remounts</li><li>Route-dependent UI belongs in the page</li></ul>`, 'lam'), ''),
    en: 'Your turn: add a nested layout with a sidebar and navigate with Link; put a counter in the layout and one in the page and see which survives; swap Link for a plain anchor and count again; and log in both layout and page, read the server log, then show the path with usePathname. Keep: layouts nest like folders; Link keeps the layout; a plain anchor remounts everything; route-dependent UI belongs in the page.' },
];
export const slides = lamDeck({ chuong: 'Chapter 8 — The App Router: routing by folders', bai: '8.3' }, S);
