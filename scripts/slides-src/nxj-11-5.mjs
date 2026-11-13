/*DU_LIEU*/
const DU_LIEU = {
 "n11-5:file:src/app/photo/[id]/page.tsx": "// app/photo/[id]/page.tsx — trang THẬT, đầy đủ (tải thẳng, tải lại, liên kết chia sẻ)\nexport default async function Photo({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;\n  console.log(`[photo] trang đầy đủ /photo/${id}`);\n  return <main className=\"p-4 font-sans\"><h1 className=\"text-3xl font-bold\">🖼️ Ảnh số {id} — TRANG ĐẦY ĐỦ</h1><p className=\"mt-2\">bình luận, ảnh lớn, ảnh liên quan…</p></main>;\n}\n",
 "n11-5:file:src/app/feed2/page.tsx": "// cây thư mục ĐÚNG NHƯ BÀI: feed2/(.)photo — (.) = cùng cấp với feed2 ⇒ chặn /feed2/photo/..., KHÔNG chặn /photo/...\nimport Link from 'next/link';\nexport default function Feed2() {\n  return (\n    <main className=\"p-4 font-sans\">\n      <h1 className=\"text-2xl font-bold\">📰 Bảng tin (cây của bài)</h1>\n      <div className=\"mt-3 flex gap-6 text-xl text-blue-600 underline\"><Link id=\"q1\" href=\"/photo/1\">/photo/1</Link><Link id=\"q2\" href=\"/feed2/photo/1\">/feed2/photo/1</Link></div>\n    </main>\n  );\n}\n",
 "n11-5:file:src/app/feed2/(.)photo/[id]/page.tsx": "export default async function Chan({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;\n  console.log(`[feed2/(.)photo] chặn ${id}`);\n  return <p className=\"p-4 text-2xl font-sans\">feed2/(.)photo chặn được: ảnh {id} — MODAL</p>;\n}\n",
 "n11-5:bai": "$ npm run build      # đúng cây thư mục của bài: feed2/(.)photo/[id] + photo/[id]\n> Build error occurred\nError: Turbopack build failed with 1 error:\nError: Interception routes must have a canonical route\n- /feed2/(.)photo/[id] (expected /feed2/photo/[id])",
 "n11-5:file:src/app/feed/layout.tsx": "// app/feed/layout.tsx — trang danh sách + khe @modal nằm đè lên\nexport default function FeedLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {\n  return <>{children}{modal}</>;\n}\n",
 "n11-5:file:src/app/feed/page.tsx": "import Link from 'next/link';\nexport default function Feed() {\n  console.log('[feed] render danh sách');\n  return (\n    <main className=\"p-4 font-sans\">\n      <h1 className=\"text-2xl font-bold\">📰 Bảng tin</h1>\n      <div className=\"mt-3 grid grid-cols-3 gap-3\">\n        {[1, 2, 3].map((id) => <Link key={id} id={`p${id}`} href={`/photo/${id}`} className=\"rounded border p-6 text-center text-4xl\">🖼️ {id}</Link>)}\n      </div>\n    </main>\n  );\n}\n",
 "n11-5:file:src/app/feed/@modal/default.tsx": "export default function Default() { return null; }\n",
 "n11-5:file:src/app/feed/@modal/(..)photo/[id]/page.tsx": "// app/feed/@modal/(..)photo/[id]/page.tsx — CHẶN /photo/[id] khi đi từ /feed (điều hướng mềm) ⇒ hiện thành modal\nimport Modal from '@/app/_comp/Modal';\nexport default async function PhotoModal({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;\n  console.log(`[modal] chặn /photo/${id}`);\n  return <Modal>🖼️ Ảnh số {id} — MODAL</Modal>;\n}\n",
 "n11-5:file:src/app/_comp/Modal.tsx": "'use client';\n// hai cách đóng để so: đổi state cục bộ vs router.back()\nimport { useState } from 'react';\nimport { useRouter } from 'next/navigation';\nexport default function Modal({ children }: { children: React.ReactNode }) {\n  const router = useRouter();\n  const [open, setOpen] = useState(true);\n  if (!open) return null;\n  return (\n    <div className=\"fixed inset-0 flex items-center justify-center bg-black/50\">\n      <div id=\"modal\" className=\"rounded-xl bg-white p-6 text-2xl font-sans\">\n        {children}\n        <div className=\"mt-4 flex gap-3 text-base\">\n          <button id=\"dong-state\" onClick={() => setOpen(false)} className=\"rounded border px-3 py-1\">Đóng (setOpen)</button>\n          <button id=\"dong-back\" onClick={() => router.back()} className=\"rounded border px-3 py-1\">Đóng (router.back)</button>\n        </div>\n      </div>\n    </div>\n  );\n}\n",
 "n11-5:trang": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build\n✓ Compiled successfully in 510ms\n├ ○ /feed\n├ ƒ /feed/(..)photo/[id]\n└ ƒ /photo/[id]\n$ for u in /feed /photo/1 /photo/9; do printf '%-16s HTTP %s\\n' \"$u\" \"$(curl -s -o /dev/null -w '%{http_code}' localhost:19390$u)\"; done\n/feed            HTTP 200\n/photo/1         HTTP 200\n/photo/9         HTTP 200\n$ curl -s localhost:19390/photo/1 | sed 's/<!-- -->//g' | grep -o 'Ảnh số 1 — [^<]*'\nẢnh số 1 — TRANG ĐẦY ĐỦ",
 "n11-5:ketqua": "$ node -e \"const d=require('$HOME/Documents/video-bai-giang/scratchpad/nxj/demo/out/anh-nxj-11-5.json'); for (const k of ['mem','cung','f5','dong-state','dong-back']) { const q=d[k]?.ketQua ?? {}; console.log(k.padEnd(10), '·', Object.entries(q).map(([a,b])=>a+'='+b).join(' · ')) }\"\nmem        · duong=/photo/1 · modal=true · feedVanDuoi=true\ncung       · modal=false · h1=🖼️ Ảnh số 1 — TRANG ĐẦY ĐỦ\nf5         · modal=false · h1=🖼️ Ảnh số 1 — TRANG ĐẦY ĐỦ\ndong-state · duong=/photo/1 · modal=false · sauF5=🖼️ Ảnh số 1 — TRANG ĐẦY ĐỦ\ndong-back  · duong=/feed · modal=false\n# log máy chủ trong lúc Chromium chạy 6 kịch bản trên:\n[modal] chặn /photo/1\n[photo] trang đầy đủ /photo/1\n[modal] chặn /photo/1\n[photo] trang đầy đủ /photo/1\n[modal] chặn /photo/1\n[photo] trang đầy đủ /photo/1\n[modal] chặn /photo/1",
 "n11-5:kho": "$ find frontend/src/app -type d -name '(.)*' -o -name '(..)*' -o -name '(...)*' | wc -l      # kho cuongthai.com\n0\n$ grep -n \"openCommentModal\\|replaceState\" frontend/src/app/feed/page.tsx | sed -n …\n210:      .openCommentModal(tid, commentId && Number.isFinite(commentId) ? commentId : undefined);\n219:          url.searchParams.delete('post');\n222:        if (commentId && url.searchParams.get('comment') === String(commentId)) {\n226:        if (changed) window.history.replaceState({}, '', url.toString());"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, br, tree, seq } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-11-5', code: 'NXJ 11.5', title: 'Intercepting routes: the modal pattern', sub: 'Chapter 11 · Lesson 11.5' };
const O = (k) => { const v = DU_LIEU[`n11-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-11-5', ten, { vp: 640, ...o });
const F = (p) => O(`file:${p}`).trim();
const goc = (s) => s.replace(/\s+\/\/ .*$/gm, '');
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ /.test(l)).join('\n');
const dongs = (k, re) => { const l = O(k).split('\n').filter((x) => !x.startsWith('$ ') && re.test(x)); if (!l.length) throw new Error('không thấy dòng trong ' + k + ' ' + re); return l; };

// ── số đo (chặn: dữ liệu đổi ⇒ deck không dựng)
const BAI = dongs('bai', /Interception routes must have|expected/);
const BUILD = dongs('trang', /^[├└┌] [○ƒ] \//);
const KQ = Object.fromEntries(dongs('ketqua', /^(mem|cung|f5|dong-state|dong-back) /).map((l) => { const [k, ...r] = l.split(' · '); return [k.trim(), Object.fromEntries(r.map((x) => x.split('=')))]; }));
const LOG = dongs('ketqua', /^\[(modal|photo)\]/);
const KHO = O('kho').split('\n').filter((l) => /^\d+$/.test(l.trim()))[0];
const KHO_FEED = dongs('kho', /^\d+:/);
if (!BAI.some((l) => /expected \/feed2\/photo\/\[id\]/.test(l))) throw new Error('lỗi cây của bài đổi');
if (BUILD.join() !== '├ ○ /feed,├ ƒ /feed/(..)photo/[id],└ ƒ /photo/[id]') throw new Error('build đổi');
if (KQ.mem.duong !== '/photo/1' || KQ.mem.modal !== 'true' || KQ.mem.feedVanDuoi !== 'true' || KQ.cung.modal !== 'false' || KQ.f5.modal !== 'false') throw new Error('mềm/cứng đổi');
if (KQ['dong-state'].duong !== '/photo/1' || KQ['dong-state'].modal !== 'false' || !/TRANG ĐẦY ĐỦ/.test(KQ['dong-state'].sauF5) || KQ['dong-back'].duong !== '/feed') throw new Error('đóng modal đổi');
if (KHO !== '0') throw new Error('kho đổi');

const MODAL_PAGE = goc(bo(F('src/app/feed/@modal/(..)photo/[id]/page.tsx')));
const MODAL = goc(bo(F('src/app/_comp/Modal.tsx'))).replace(/ className="[^"]*"/g, '');

export const S = [
  { cover: true, nhan: 'Chapter 11 · Lesson 11.5', t: 'Intercepting routes:<br>the modal pattern', sub: 'Click a photo: a modal over the feed, the URL is the photo\'s. Load that URL: the full page. Measured: the lesson\'s folder tree fails to build on Next.js 16, the working tree, and how to close the modal',
    en: 'Lesson eleven point five: intercepting routes, the modal pattern. Click a photo in a feed and it opens in a modal, while the address bar shows the photo\'s own URL; load that URL directly and you get the full page. We measure the lesson\'s folder tree, which fails to build on Next.js sixteen, the tree that works, and how to close the modal correctly.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>One URL, two presentations: soft navigation ⇒ modal, hard load ⇒ full page</li>
    <li>The lesson's tree <code>feed/(.)photo</code> does not build: <code>(.)</code> is relative</li>
    <li>The tree that works: an <code>@modal</code> slot + <code>(..)photo</code> + the real page</li>
    <li>Closing: <code>setOpen(false)</code> leaves the URL behind; <code>router.back()</code> does not</li>
    <li>How cuongthai.com does its comment modal today — and what this pattern would change</li></ul>`,
    en: 'Five takeaways: one URL, two presentations; the lesson\'s folder tree does not build, because the dot marker is relative; the tree that works, with a modal slot, a double-dot interceptor and the real page; closing — local state leaves the URL behind, router dot back does not; and how cuongthai dot com does its comment modal today.' },
  { t: 'One URL, two presentations', body: two(D(seq(['you', '/feed', '/photo/1'], [[0, 1, 'open /feed'], [0, 2, 'click a photo (soft)', '#0070f3'], [2, 1, 'intercepted → modal over feed', '#0070f3', true], [0, 2, 'reload / shared link (hard)', '#b91c1c'], [2, 0, 'the real full page', '#1f8a3b', true]], { w: 560, rh: 44, fs: 15, top: 56 }),
      box('Read it', 'A <b>soft</b> navigation (a <code>&lt;Link&gt;</code> click inside the app) is intercepted: the photo renders <b>over</b> the feed, the URL becomes <code>/photo/1</code>. A <b>hard</b> load (refresh, a shared link) is not: Next serves the real page.', 'lam')),
    D(B('mem', { url: 'click → /photo/1 (soft)', h: 260, w: 500 }), B('cung', { url: 'load /photo/1 (hard)', h: 120, w: 500 }))),
    en: 'One URL, two presentations. A soft navigation — clicking a link inside the app — is intercepted: the photo renders over the feed, and the address bar shows slash photo slash one. A hard load — a refresh or a shared link — is not intercepted: Next serves the real, full page.' },
  { t: 'The lesson\'s tree, built: Next.js 16 says no', body: two(D(tree(['app/', '   photo/[id]/page.tsx          // the real page', '   feed2/                       // the lesson\'s tree', '     page.tsx', '*    (.)photo/[id]/page.tsx     // the interceptor'], { fs: 18 }),
      tn(['$ npm run build', ...BAI].join('\n'), { fs: 15, wrap: 56, title: 'next build 16.4.6 (real) — the lesson\'s tree' })),
    D(box('Why', '<code>(.)</code> means "the <b>same level as this folder</b>". Inside <code>feed/</code> it intercepts <code>/feed/photo/[id]</code> — a URL that does not exist — so Next demands that canonical route. To reach <code>/photo/[id]</code> from <code>feed/</code> you go one level up: <code>(..)photo</code>.', 'do2'),
      box('The rule it enforces', 'Every interceptor must have a real page at the URL it intercepts — the page that hard loads and shared links will hit.', 'xanh')), 'r64'),
    en: 'The lesson\'s tree, built on Next.js sixteen: the build fails — interception routes must have a canonical route, expected slash feed2 slash photo slash id. A dot in parentheses means the same level as this folder, so inside feed it intercepts slash feed slash photo, which does not exist. To reach slash photo from feed, go one level up with two dots.' },
  { t: 'The tree that works — measured', body: two(tree(['app/', '   feed/', '     layout.tsx               // {children}{modal}', '     page.tsx                 // the list', '*    @modal/default.tsx       // null', '*    @modal/(..)photo/[id]/page.tsx', '   photo/[id]/page.tsx        // the real page'], { fs: 17 }),
      D(tn(['$ npm run build', ...BUILD].join('\n'), { fs: 16, title: 'next build 16.4.6 (real)' }),
        box('Three parts', 'An <code>@modal</code> slot (11.4) so the photo renders <b>over</b> the list · <code>(..)photo</code> one level up from <code>feed</code> · the real <code>photo/[id]</code> page.', 'lam')), '') +
    tsx(MODAL_PAGE, { sm: true, hl: [5, 6] }),
    en: 'The tree that works. The feed layout renders children and a modal slot; the slot has a default returning null; the interceptor lives at feed slash at-modal slash double-dot photo; and the real photo page stays where it is. The build lists the interceptor as its own dynamic route.' },
  { t: 'Measured in Chromium: soft vs hard', body: cmp(['Scenario (real)', 'URL', 'modal', 'what renders'], [
      ['click 🖼️1 on /feed', KQ.mem.duong, KQ.mem.modal, `the feed stays under it (${KQ.mem.feedVanDuoi === 'true' ? 'list still in the DOM' : '—'})`],
      ['load /photo/1 directly', '/photo/1', KQ.cung.modal, KQ.cung.h1],
      ['click, then reload', '/photo/1', KQ.f5.modal, KQ.f5.h1],
    ], { hl: [0] }) + two(tn(LOG.slice(0, 4).join('\n'), { fs: 15, title: 'server log (real) — which file rendered' }),
      box('Read it', 'The same URL rendered by two different files: <code>[modal]</code> from <code>(..)photo</code> when you came from the feed, <code>[photo]</code> from the real page on a hard load. Shareable — and the feed stays mounted behind the modal.', 'xanh'), ''),
    en: 'Measured in Chromium. Clicking photo one on the feed: the URL is slash photo slash one, the modal is there, and the list is still in the page underneath. Loading the same URL directly, or reloading after the click: no modal, the full page. The server log shows two different files rendering the same URL.' },
  { t: 'The markers: relative to the interceptor\'s folder', body: cmp(['Marker', 'Meaning', 'From app/feed/@modal/…', 'Measured'], [
      ['<code>(.)</code>', 'same level', '<code>(.)photo</code> ⇒ <code>/feed/photo/…</code>', 'build error (no canonical page)'],
      ['<code>(..)</code>', 'one level up', '<code>(..)photo</code> ⇒ <code>/photo/…</code>', 'works'],
      ['<code>(..)(..)</code>', 'two levels up', '—', 'docs'],
      ['<code>(...)</code>', 'from the app root', '<code>(...)photo</code> ⇒ <code>/photo/…</code>', 'docs'],
    ], { hl: [1] }) + box('Remember', 'Levels count <b>route segments</b>, not folders: <code>@modal</code> (a slot) and <code>(group)</code> folders do not count. Pick the marker from the folder that holds the interceptor.', 'lam'),
    en: 'The markers are relative to the folder that holds the interceptor, and they count route segments, not folders — slots and route groups do not count. A single dot is the same level; two dots, one level up; two double-dots, two levels; three dots, from the app root. We measured the first two.' },
  { t: 'Trap: closing with setOpen(false)', body: tsx(MODAL.split('\n').filter((l) => !/^\s*<div|^\s*<\/div|^\s*\{children\}|^import|^'use client'|^\s*return \($|^\s*\);$|^\}$/.test(l)).map((l) => l.replace(/ id="[^"]*"/, '')).join('\n'), { sm: true, hl: [5, 6] }) +
    two(D(cmp(['Close with', 'URL after', 'modal', 'then reload'], [
        ['<code>setOpen(false)</code>', KQ['dong-state'].duong, KQ['dong-state'].modal, 'full photo page'],
        ['<code>router.back()</code>', KQ['dong-back'].duong, KQ['dong-back'].modal, 'the feed'],
      ], { hl: [0] }),
      box('Why', 'The modal is a <b>route</b>: closing it is a navigation. <code>setOpen(false)</code> only hides the box — the URL still says <code>/photo/1</code>.', 'do2')),
    B('dong-state-giua', { url: 'after setOpen(false) — URL still /photo/1', h: 200, w: 520 }), ''),
    en: 'The trap: closing the modal with local state. setOpen false hides the box, but the URL still says slash photo slash one, so a reload lands on the full photo page instead of the feed. router dot back is a navigation: the URL returns to slash feed and the modal disappears for good.' },
  { t: 'cuongthai.com: a store-driven modal + ?post=N', body: two(D(tn([`$ find frontend/src/app -type d -name '(.)*' -o -name '(..)*' …`, KHO, '$ grep -n … frontend/src/app/feed/page.tsx', ...KHO_FEED].join('\n'), { fs: 14, wrap: 70, title: 'the course\'s own repo (real)' })),
    D(box('What the site does today', '<b>0</b> intercepting routes. The comment modal is opened by a store (<code>openCommentModal</code>); a deep link <code>/feed?post=N&amp;comment=M</code> opens it, then <code>replaceState</code> strips the params. Clicking "Bình luận" does not change the URL.', 'lam'),
      box('What this pattern would change', 'Each post would get its own URL while the modal is open — share it, reload it, press Back — with the full post page for hard loads. Cost: a real post page, a slot and an interceptor.', '')), 'r64'),
    en: 'This course\'s own site does it differently today: zero intercepting routes. The comment modal is opened from a store, a deep link with post equals N opens it, and replaceState then strips the parameter, so clicking comment does not change the URL. With intercepting routes, each open post would have its own shareable URL, with a real post page behind it.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Intercepting route', 'render a route in the current layout on soft nav'), kw('Soft vs hard navigation', 'Link click ⇒ intercepted · load/reload ⇒ real page'),
      kw('(.) (..) (...)', 'same level · one up · from the root — route segments'), kw('Canonical route', 'the real page an interceptor must have'),
      kw('@modal slot', 'renders the modal over the page (11.4)'), kw('default.tsx', 'null when no modal is open'),
      kw('router.back()', 'close = navigate back, not hide'), kw('Shareable URL', 'the modal\'s URL loads the full page'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: intercepting route; soft versus hard navigation; the dot markers; the canonical route; the modal slot; default dot tsx; router dot back; and the shareable URL.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build the lesson's tree ${c('feed/(.)photo/[id]')} and read the build error`,
      `Move it to ${c('feed/@modal/(..)photo/[id]')}, add ${c('@modal/default.tsx')} and the layout's ${c('modal')} prop`,
      `Click a photo: modal + new URL · reload: the full page`,
      `Close with ${c('setOpen(false)')}, then reload; switch to ${c('router.back()')}`,
    ]), box('Keep these', `<ul><li>Soft ⇒ modal · hard ⇒ the real page</li><li>Markers count route segments from the interceptor's folder</li><li>Always ship the real page (Next 16 enforces it)</li><li><code>@modal</code> slot + <code>default.tsx</code></li><li>Close with <code>router.back()</code></li></ul>`, 'lam'), ''),
    en: 'Your turn: build the lesson\'s tree and read the build error; move the interceptor into a modal slot with two dots, add the default and the layout prop; click a photo and reload; then close with local state and reload, and switch to router dot back. Keep: soft gives the modal, hard gives the real page; markers count route segments from the interceptor\'s folder; always ship the real page; a modal slot with a default; close with router dot back.' },
];
export const slides = lamDeck({ chuong: 'Chapter 11 — Advanced routing', bai: '11.5' }, S);
