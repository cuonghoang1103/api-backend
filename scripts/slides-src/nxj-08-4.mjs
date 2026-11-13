/*DU_LIEU*/
const DU_LIEU = {
 "n8-4:file:src/app/dh/layout.tsx": "import NavItem from './NavItem';\n\nexport default function DhLayout({ children }: LayoutProps<'/dh'>) {\n  return (\n    <div className=\"space-y-3 p-4 font-sans\">\n      <nav className=\"flex flex-wrap gap-2\">\n        <NavItem href=\"/dh\" label=\"Trang chủ\" />\n        <NavItem href=\"/dh/a\" label=\"Khoá học\" />\n        <NavItem href=\"/dh/b\" label=\"Blog (===)\" />\n        <NavItem href=\"/dh/b\" label=\"Blog (startsWith)\" ca />\n        <a id=\"a-tran\" href=\"/dh/a\" className=\"rounded border border-dashed px-2\">&lt;a&gt; Khoá học</a>\n      </nav>\n      <main className=\"rounded border p-2\">{children}</main>\n    </div>\n  );\n}\n",
 "n8-4:file:src/app/dh/NavItem.tsx": "'use client';\nimport Link from 'next/link';\nimport { usePathname } from 'next/navigation';\n\nexport default function NavItem({ href, label, ca = false }: { href: string; label: string; ca?: boolean }) {\n  const pathname = usePathname();\n  const active = ca ? pathname.startsWith(href) : pathname === href;   // ca = tô cả mục\n  return (\n    <Link href={href} className={active ? 'rounded bg-black px-2 text-white' : 'rounded border px-2'}>\n      {label}\n    </Link>\n  );\n}\n",
 "n8-4:file:src/app/dh/page.tsx": "import Link from 'next/link';\n\nexport default function DhHome() {\n  return <><h1>Trang chủ</h1><Link id=\"toi-dang-nhap\" href=\"/dh/dang-nhap\">→ Đăng nhập</Link></>;\n}\n",
 "n8-4:file:src/app/dh/a/page.tsx": "export default function KhoaHoc() {\n  return <h1>Khoá học</h1>;\n}\n",
 "n8-4:file:src/app/dh/b/page.tsx": "export default function Blog() {\n  return <h1>Blog</h1>;\n}\n",
 "n8-4:file:src/app/dh/b/c/page.tsx": "export default function BaiViet() {\n  return <h1>Blog › một bài viết</h1>;\n}\n",
 "n8-4:file:src/app/dh/dang-nhap/page.tsx": "import LoginButton from './LoginButton';\n\nexport default function DangNhap() {\n  return <><h1>Đăng nhập</h1><LoginButton /></>;\n}\n",
 "n8-4:file:src/app/dh/dang-nhap/LoginButton.tsx": "'use client';\nimport { useRouter } from 'next/navigation';\n\nconst login = () => new Promise((r) => setTimeout(r, 300));   // giả lập gọi API đăng nhập\n\nexport default function LoginButton() {\n  const router = useRouter();\n  async function onPush() { await login(); router.push('/dh/a'); }       // chuyển cảnh client, bằng code\n  async function onReplace() { await login(); router.replace('/dh/a'); } // thay mục lịch sử hiện tại\n  return (\n    <p className=\"space-x-2\">\n      <button id=\"push\" onClick={onPush} className=\"rounded border px-2\">Đăng nhập (push)</button>\n      <button id=\"replace\" onClick={onReplace} className=\"rounded border px-2\">Đăng nhập (replace)</button>\n    </p>\n  );\n}\n",
 "n8-4:file:src/app/dh/cu/page.tsx": "import { redirect } from 'next/navigation';\n\nexport default function TrangCu() {\n  redirect('/dh/a');                        // ném ra một lỗi đặc biệt ⇒ không dòng nào sau đây chạy\n  console.log('[dh/cu] dòng này KHÔNG BAO GIỜ in');\n}\n",
 "n8-4:trang": "$ npm run build\n✓ Compiled successfully in 1738ms\n├ ○ /dh\n├ ○ /dh/a\n├ ○ /dh/b\n├ ○ /dh/b/c\n├ ○ /dh/cu\n├ ○ /dh/dang-nhap\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand",
 "n8-4:mo": "$ curl -s -o /dev/null -w 'GET /dh/cu → %{http_code} · Location: %{redirect_url}\\n' localhost:19376/dh/cu\nGET /dh/cu → 307 · Location: http://localhost:19376/dh/a\n$ curl -s localhost:19376/dh | grep -o '<a[^>]*href=\"/dh/a\"[^>]*>[^<]*</a>' | head -2\n<a class=\"rounded border px-2\" href=\"/dh/a\">Khoá học</a>\n<a id=\"a-tran\" href=\"/dh/a\" class=\"rounded border border-dashed px-2\">&lt;a&gt; Khoá học</a>",
 "n8-4:file:src/app/dh/sai/page.tsx": "'use client';\nimport { useRouter } from 'next/router';            // ⚠ đường import của Pages Router\n\nexport default function Sai() {\n  const router = useRouter();\n  return <button onClick={() => router.push('/dh/a')}>Đi</button>;\n}\n",
 "n8-4:baysai": "$ npm run build\nError occurred prerendering page \"/dh/sai\". Read more: https://nextjs.org/docs/messages/prerender-error\nError: NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted\n    at <unknown> (src/app/dh/sai/page.tsx:5:18)\nExport encountered an error on /dh/sai/page: /dh/sai, exiting the build.",
 "n8-4:file:src/app/dh/sv/page.tsx": "import { useRouter } from 'next/navigation';      // không có 'use client'\n\nexport default function Sv() {\n  const router = useRouter();\n  return <button onClick={() => router.push('/dh/a')}>Đi</button>;\n}\n",
 "n8-4:baysv": "$ npm run build\n./src/app/dh/sv/page.tsx:1:10\nError: You're importing a module that depends on `useRouter` into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the `\"use client\"` directive.",
 "n8-4:thuc": "$ cd frontend/src && for m in \"next/link\" \"next/navigation\" \"next/router\"; do printf '%-16s %s tệp\\n' \"$m\" \"$(grep -rlE \"from ['\\\"]$m['\\\"]\" . | wc -l)\"; done\nnext/link        388 tệp\nnext/navigation  325 tệp\nnext/router      0 tệp\n$ grep -rhoE \"\\b(usePathname|useRouter|useSearchParams|redirect)\\(\" frontend/src | sort | uniq -c | sort -rn\n 207 useRouter(\n 106 useSearchParams(\n  78 usePathname(\n  17 redirect(",
 "anh-nxj-8-4:pf-link": {
  "url": "http://127.0.0.1:19376/dh/a",
  "vp": [
   640,
   200
  ],
  "rect": {
   "nav": [
    16,
    16,
    608,
    26
   ],
   "#a-tran": [
    451,
    16,
    117,
    26
   ],
   "main": [
    16,
    54,
    608,
    42
   ]
  },
  "console": []
 },
 "anh-nxj-8-4:pf-start": {
  "url": "http://127.0.0.1:19376/dh",
  "vp": [
   640,
   200
  ],
  "rect": {
   "nav": [
    16,
    16,
    608,
    26
   ],
   "#a-tran": [
    451,
    16,
    117,
    26
   ],
   "main": [
    16,
    54,
    608,
    42
   ]
  },
  "console": [],
  "ketQua": {
   "prefetch": [
    "/dh?_rsc=oDf-RApdnkI8BiOT",
    "/dh/a?_rsc=oDf-RApdnkI8BiOT",
    "/dh/b?_rsc=oDf-RApdnkI8BiOT",
    "/dh/dang-nhap?_rsc=oDf-RApdnkI8BiOT",
    "/dh?_rsc=F6UdIIpG-IdC_5LS",
    "/dh/a?_rsc=u9oFRaNCQY9W4IUo",
    "/dh/b?_rsc=3O3OrpvaLR4FE9qn",
    "/dh/dang-nhap?_rsc=J9OzNy5_4j7hMQk0"
   ],
   "truocClick": 21,
   "sauLink": {
    "url": "/dh/a",
    "moc": "vẫn-trang-cũ",
    "doc": 1,
    "moi": [
     "/dh/dang-nhap?_rsc=oDf-RApdnkI8BiOT",
     "/dh?_rsc=F6UdIIpG-IdC_5LS",
     "/dh/a?_rsc=u9oFRaNCQY9W4IUo",
     "/dh/b?_rsc=3O3OrpvaLR4FE9qn",
     "/dh/dang-nhap?_rsc=J9OzNy5_4j7hMQk0",
     "/_next/static/chunks/1qiqkn8vvg8fh.js"
    ]
   },
   "sauClick": 21,
   "sauA": {
    "url": "/dh/a",
    "moc": null,
    "tai": 18
   }
  }
 },
 "anh-nxj-8-4:pf-dev": {
  "url": "http://127.0.0.1:19377/dh",
  "vp": [
   640,
   200
  ],
  "rect": {},
  "console": [
   {
    "kieu": "info",
    "chu": "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold"
   },
   {
    "kieu": "log",
    "chu": "[HMR] connected"
   }
  ],
  "ketQua": {
   "prefetch": []
  }
 },
 "anh-nxj-8-4:active-c": {
  "url": "http://127.0.0.1:19376/dh/b/c",
  "vp": [
   640,
   150
  ],
  "rect": {
   "nav": [
    16,
    16,
    608,
    26
   ]
  },
  "console": []
 },
 "anh-nxj-8-4:active-b": {
  "url": "http://127.0.0.1:19376/dh/b",
  "vp": [
   640,
   150
  ],
  "rect": {
   "nav": [
    16,
    16,
    608,
    26
   ]
  },
  "console": []
 },
 "anh-nxj-8-4:login-truoc": {
  "url": "http://127.0.0.1:19376/dh/dang-nhap",
  "vp": [
   640,
   200
  ],
  "rect": {
   "#push": [
    25,
    87,
    146,
    26
   ],
   "#replace": [
    179,
    87,
    165,
    26
   ]
  },
  "console": []
 },
 "anh-nxj-8-4:login": {
  "url": "http://127.0.0.1:19376/dh",
  "vp": [
   640,
   200
  ],
  "rect": {
   "#push": null,
   "#replace": null
  },
  "console": [],
  "ketQua": {
   "sauPush": {
    "url": "/dh/a",
    "moc": "giu"
   },
   "backSauPush": "/dh/dang-nhap",
   "sauReplace": "/dh/a",
   "backSauReplace": "/dh"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, br, icards } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-08-4', code: 'NXJ 8.4', title: 'Navigation: Link, useRouter and the active link', sub: 'Chapter 8 · Lesson 8.4' };
const O = (k) => { const v = DU_LIEU[`n8-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-8-4:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-08-4', ten, o);
const lay = (k, ...re) => { const s = O(k); const l = s.split('\n').filter((x) => !x.startsWith('$ ') && re.some((r) => r.test(x))); if (!l.length) throw new Error('không thấy dòng trong ' + k); return l.join('\n'); };
const P = AN('pf-start').ketQua, DV = AN('pf-dev').ketQua, LG = AN('login').ketQua;
if (P.prefetch.length !== 8 || P.truocClick !== P.sauClick || P.sauLink.moc !== 'vẫn-trang-cũ' || P.sauLink.doc !== 1 || P.sauA.moc !== null || DV.prefetch.length !== 0) throw new Error('số đo prefetch 8.4 đổi');
if (LG.sauPush.url !== '/dh/a' || LG.backSauPush !== '/dh/dang-nhap' || LG.backSauReplace !== '/dh') throw new Error('số đo push/replace 8.4 đổi');
for (const [k, s] of [['mo', '307 · Location: http://localhost:19376/dh/a'], ['baysai', 'NextRouter was not mounted'], ['baysv', 'depends on `useRouter`'], ['thuc', 'next/router      0 tệp']])
  if (!O(k).includes(s)) throw new Error(`số đo 8.4 đổi: ${k} thiếu "${s}"`);
if (O('trang').includes('KHÔNG BAO GIỜ')) throw new Error('dòng sau redirect() không được in');
const PF = [...new Set(P.prefetch.map((u) => u.split('?')[0]))];

export const S = [
  { cover: true, nhan: 'Chapter 8 · Lesson 8.4', t: 'Navigation:<br>Link, useRouter, the active link', sub: 'Move between routes without reloading the page — measured in the network panel and the history stack',
    en: 'Lesson eight point four: navigation — Link, useRouter and the active link. How to move between routes without reloading the page, measured in the network panel and in the browser history.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>&lt;Link&gt;</code> renders a real <code>&lt;a&gt;</code> — but navigates on the client</li>
    <li>Prefetch: what is downloaded before you click (and why dev shows nothing)</li>
    <li><code>useRouter()</code> from <code>next/navigation</code>: <code>push</code> vs <code>replace</code>, measured</li>
    <li>The active link with <code>usePathname()</code>: <code>===</code> vs <code>startsWith</code></li>
    <li><code>redirect()</code> on the server, and the <code>next/router</code> trap</li></ul>`,
    en: 'Five takeaways: Link renders a real anchor but navigates on the client; prefetch, and why dev shows none; useRouter with push versus replace; the active link with usePathname; and redirect on the server, plus the next slash router trap.' },
  { t: 'Link, not a bare anchor', body: tsx(`import Link from 'next/link';
<Link href="/courses">Khoá học</Link>`, {}) + tn(lay('mo', /href="\/dh\/a"/), { fs: 17, title: 'curl /dh — the HTML that Link produced: a real <a href> (real)' }) +
      icards([['bolt', 'Client transition', 'on a normal click Next.js intercepts it and fetches only the changed segments (8.3)'], ['clock', 'Prefetch', 'the target is downloaded in the background, before the click'], ['eye', 'Still a real link', 'accessible, right-click "open in new tab", crawlers follow it']], 3),
    en: 'Use Link, not a bare anchor. In the HTML that Next.js sends, a Link is a real anchor with an href — so accessibility, right-click open in a new tab and search crawlers all work. The difference is on a normal click: Next.js intercepts it, fetches only the changed segments, and keeps the layouts mounted.' },
  { t: 'Measured: Link vs a bare &lt;a&gt;', body: cmp(['After one click to /dh/a (next start)', '<code>&lt;Link&gt;</code>', 'bare <code>&lt;a href&gt;</code>'], [
      ['new network requests on click', `<b>${P.sauClick - P.truocClick}</b> (already prefetched)`, `full reload — ${P.sauA.tai} resources downloaded again`],
      ['a JS variable set on the old page', `<b>still there</b> ("${P.sauLink.moc}")`, '<b>gone</b> (null) — the app restarted'],
      ['documents loaded', `${P.sauLink.doc} — the first one`, 'a new one'],
    ], { hl: [0, 1] }) + two(B('pf-link', { vp: 640, h: 110, w: 520, url: 'localhost:3000/dh/a — after the Link' }),
      box('The beginner bug', 'A bare <code>&lt;a href&gt;</code> to an internal page restarts the whole app: every layout remounts, in-memory state is lost, music stops, prefetch is wasted. Keep bare <code>&lt;a&gt;</code> for <b>external</b> URLs (with <code>target="_blank" rel="noopener"</code>).', 'do2'), ''),
    en: `Measured on next start. We set a JavaScript variable on the page, then clicked a Link: zero new network requests, because the target was already prefetched, and the variable was still there — same document. Then a bare anchor to the same URL: the variable was gone, the app restarted and ${P.sauA.tai} resources were downloaded again. Keep bare anchors for external sites.` },
  { t: 'Prefetch: downloaded before you click', body: two(D(tn(P.prefetch.map((u) => u.replace(/\?_rsc=.*/, '?_rsc=…')).join('\n'), { fs: 17, title: 'next start · /dh after 2.5 s, no click (real)' })),
      D(cmp(['', 'prefetch requests'], [['<code>next start</code>', `<b>${P.prefetch.length}</b> (${PF.length} links in view × 2)`], ['<code>next dev</code>', `<b>${DV.prefetch.length}</b>`]], { hl: [0] }),
        box('How it works', 'When a <code>&lt;Link&gt;</code> enters the viewport, Next.js fetches that route\'s RSC payload (<code>?_rsc=</code>) in the background. The click then needs nothing new.', 'lam'),
        box('Measure prefetch on a production build', 'Prefetching is a production behaviour — under <code>next dev</code> we counted none. Judge "is navigation instant?" on <code>next build &amp;&amp; next start</code>.', 'do2')), ''),
    en: `Prefetch. We opened slash dh on next start and waited two and a half seconds without clicking: ${P.prefetch.length} requests with an underscore rsc parameter — two for each of the ${PF.length} links on screen. That is the RSC payload of each target, fetched in the background. Under next dev we counted zero, so judge whether navigation feels instant on a production build.` },
  { t: 'Navigating from code: useRouter', body: two(tsx(`'use client';
import { useRouter } from 'next/navigation';

export default function LoginButton() {
  const router = useRouter();
  async function onPush() {
    await login();
    router.push('/dh/a');     // client transition
  }
  async function onReplace() {
    await login();
    router.replace('/dh/a');  // replace history entry
  }
  …
}`, { sm: true, hl: [2, 8, 12] }), D(cmp(['After clicking, then pressing Back', 'Back goes to'], [
      ['<code>router.push(\'/dh/a\')</code>', `<code>${LG.backSauPush}</code> — the login page`], ['<code>router.replace(\'/dh/a\')</code>', `<code>${LG.backSauReplace}</code> — the login page is gone`],
    ], { hl: [1] }), box('Which one after a login?', '<code>replace</code>: pressing Back should not return to a login form you already submitted. <code>push</code> for normal "go to" actions.', 'xanh'),
      box('Client-only', 'A hook that uses browser state ⇒ only in a Client Component, hence <code>\'use client\'</code>.', 'lam')), ''),
    en: 'Navigating from code: useRouter, imported from next slash navigation. After a successful login we navigate in code. Measured: with push, the Back button returned to the login page; with replace, Back skipped it and went to the page before. So after a login, replace is usually right. It is a hook that uses browser state, so it only works in a Client Component.' },
  { t: 'The router methods', body: icards([
      ['flag', 'router.push(url)', 'go to url, add a history entry'], ['loop', 'router.replace(url)', 'go to url, replace the current entry'],
      ['map', 'router.back()', 'like the browser Back button'], ['clock', 'router.refresh()', 're-fetch the Server Components of this route, keep client state'],
      ['bolt', 'router.prefetch(url)', 'download a route ahead of time by hand'], ['search', 'useSearchParams()', 'read the ?query string (sibling hook)'],
    ], 3) + box('All from next/navigation', 'The App Router split the old router into separate hooks: <code>useRouter</code> to move, <code>usePathname</code> for the path, <code>useSearchParams</code> for the query.', 'lam'),
    en: 'The router methods: push adds a history entry; replace swaps the current one; back is the Back button; refresh re-fetches the Server Components of the current route while keeping client state; prefetch downloads a route ahead by hand. And useSearchParams reads the query string. All from next slash navigation.' },
  { t: 'Highlight the active link: usePathname', body: two(tsx(`'use client';
export default function NavItem(
  { href, label, ca }
) {
  const pathname = usePathname();
  const active = ca
    ? pathname.startsWith(href) // section
    : pathname === href;        // exact
  return (
    <Link href={href}
      className={active ? 'on' : ''}>
      {label}
    </Link>
  );
}`, { hl: [5, 6, 7] }),
      D(B('active-c', { vp: 640, h: 60, w: 540, url: 'localhost:3000/dh/b/c', mark: [[300, 16, 140, 26, 'startsWith ✓']] }), '<div style="height:10px"></div>', B('active-b', { vp: 640, h: 60, w: 540, url: 'localhost:3000/dh/b', mark: [[208, 16, 236, 26, '=== and startsWith']] }),
        box('=== vs startsWith', 'On <code>/dh/b/c</code> only the <code>startsWith</code> link lights up — the whole section. Exact <code>===</code> lights up only on <code>/dh/b</code>. Keep <code>===</code> for the home link: every path starts with it.', 'xanh')), ''),
    en: 'Highlight the active link with usePathname. The NavItem compares the current path with its href. On slash dh slash b slash c, only the startsWith version lights up — it marks the whole section — while the exact comparison lights up only on slash dh slash b itself. Keep the exact comparison for the home link, because every path starts with it.' },
  { t: 'redirect() — on the server', to: true, body: two(tsx(`import { redirect }
  from 'next/navigation';

export default function TrangCu() {
  redirect('/dh/a');   // throws
  console.log(
    '[dh/cu] dòng này KHÔNG BAO GIỜ in');
}`, { hl: [5] }), D(tn(lay('mo', /307/), { fs: 17, title: 'curl /dh/cu (real)' }),
      box('It throws', '<code>redirect()</code> throws a special error that Next.js turns into a redirect — <b>no line after it runs</b>: the log line never appeared, not even during the build.', 'lam'),
      box('Where it belongs', 'Server Components and Server Actions (Chapter 12). In a Client Component, after an action, use <code>router.push</code>.', 'xanh')), ''),
    en: 'redirect, on the server. This page calls redirect to slash dh slash a and then logs a line. curl gets status three oh seven with the new location. redirect throws a special error, so nothing after it runs — the log line never appeared, not even during the build. Use it in Server Components and Server Actions; in a Client Component use router push.' },
  { t: 'Pitfall: useRouter from next/router', body: tsx(`'use client';
import { useRouter } from 'next/router';   // ⚠ Pages Router`, {}) + tn(lay('baysai', /prerendering/, /NextRouter/), { fs: 16, title: 'npm run build (real)' }) +
      cmp(['Old (Pages Router)', 'App Router — from <code>next/navigation</code>'], [
        ['<code>useRouter()</code> from <code>next/router</code> — move + path + query', '<code>useRouter()</code> — move'], ['<code>router.pathname</code>', '<code>usePathname()</code>'], ['<code>router.query</code>', '<code>useSearchParams()</code> / <code>params</code>'],
      ], { hl: [0] }) + box('The error says nothing about imports', '"NextRouter was not mounted" sends people looking for a missing provider. On Next.js 16 it already fails the build while prerendering. When a routing hook acts strange, check the import line first.', 'do2'),
    en: 'The pitfall: importing useRouter from next slash router, the Pages Router hook. On Next.js sixteen this page already broke the build while prerendering, with "NextRouter was not mounted" — a message that says nothing about the import and sends people looking for a missing provider. The App Router split it into useRouter, usePathname and useSearchParams, all from next slash navigation.' },
  { t: 'Pitfall: useRouter without "use client"', body: tsx(O('file:src/app/dh/sv/page.tsx').trim(), { hl: [1] }) + tn(lay('baysv', /^Error: You're importing/, /^\.\/src/), { fs: 16, title: 'npm run build (real)' }) +
      two(box('Same family as 8.1', 'Every hook — <code>useState</code>, <code>useRouter</code>, <code>usePathname</code> — needs a Client Component. A page without <code>\'use client\'</code> is a Server Component.', 'lam'),
        box('The fix', 'Keep the page on the server; move the button that navigates into a small Client Component — exactly <code>LoginButton</code> and <code>NavItem</code> above.', 'xanh'), ''),
    en: 'The second pitfall: useRouter in a page without use client. The build stops at compile time: you are importing a module that depends on useRouter into a React Server Component. The fix is the pattern used above: keep the page on the server and move the navigating button into a small Client Component, like LoginButton and NavItem.' },
  { t: 'On cuongthai.com', body: two(tn(lay('thuc', /tệp$/), { fs: 19, title: 'imports in frontend/src (real)' }), tn(lay('thuc', /^\s*\d+ (use|redirect)/), { fs: 19, title: 'calls in frontend/src (real)' }), '') +
      box('What the numbers say', '388 files import <code>Link</code>; 325 import from <code>next/navigation</code>; <b>0</b> from <code>next/router</code> — the old import never crept in. <code>useRouter</code> (207 calls) is the workhorse; <code>usePathname</code> (78) powers the active tabs of the nav.', 'xanh'),
    en: 'On cuongthai dot com: three hundred eighty-eight files import Link, three hundred twenty-five import from next slash navigation, and zero from next slash router. useRouter is called two hundred seven times, useSearchParams one hundred six, usePathname seventy-eight — that is what lights up the active tab in the site nav — and redirect seventeen times.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Link', 'Next.js component for client navigation, renders a real &lt;a&gt;'), kw('Client navigation', 'change route without reloading the page'),
      kw('Prefetch', 'download linked routes ahead, on production builds'), kw('usePathname', 'hook returning the current path (active link)'),
      kw('useRouter', 'navigate from code: push, replace, back, refresh'), kw('push vs replace', 'add a history entry vs replace the current one'),
      kw('redirect()', 'server-side redirect; throws, nothing after it runs'), kw('next/navigation', 'App Router navigation module — never next/router'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: Link; client navigation; prefetch; usePathname; useRouter; push versus replace; redirect; and next slash navigation.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Replace an internal ${c('<a href>')} with ${c('<Link href>')}; set a variable on the page and check it survives the click`,
      `On ${c('next start')}, open DevTools → Network and watch the ${c('?_rsc=')} prefetches before you click`,
      `Highlight the active link with ${c('usePathname()')}; try ${c('===')} and ${c('startsWith')}`,
      `After a fake login call ${c('router.push')}, then ${c('router.replace')}, and press Back each time`,
    ]), box('Keep these', `<ul><li><code>&lt;Link&gt;</code> inside, <code>&lt;a&gt;</code> for external</li><li>Prefetch: measure on <code>next start</code></li><li>After login: <code>replace</code></li><li>Always <code>next/navigation</code></li></ul>`, 'lam'), ''),
    en: 'Your turn: replace an internal anchor with Link and check a variable survives; watch the prefetches in the network panel on next start; highlight the active link with both comparisons; and after a fake login try push and replace and press Back. Keep: Link inside the app, anchors for external sites; measure prefetch on next start; replace after login; always next slash navigation.' },
];
export const slides = lamDeck({ chuong: 'Chapter 8 — The App Router: routing by folders', bai: '8.4' }, S);
