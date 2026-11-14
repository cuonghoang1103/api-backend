/*DU_LIEU*/
const DU_LIEU = {
 "n17-4:file:src/app/og/layout.tsx": "// app/og/layout.tsx — a section layout with \"site-wide\" Open Graph (like a root layout)\nimport type { Metadata } from 'next';\nexport const metadata: Metadata = {\n  openGraph: { title: 'CT Lab', description: 'The lab site', url: 'https://example.com', images: ['/og-site.png'] },\n};\nexport default function L({ children }: LayoutProps<'/og'>) { return <>{children}</>; }\n",
 "n17-4:file:src/app/og/bai/page.tsx": "// app/og/bai/page.tsx — a deep page that only sets its own title\nimport type { Metadata } from 'next';\nexport const metadata: Metadata = { title: 'Lesson 17.4 — Open Graph' };\nexport default function P() { return <h1>Lesson 17.4</h1>; }\n",
 "n17-4:file:src/app/og/dung/page.tsx": "// app/og/dung/page.tsx — a deep page that sets its own openGraph (url relative, resolved by metadataBase)\nimport type { Metadata } from 'next';\nexport const metadata: Metadata = {\n  title: 'Lesson 17.4 — Open Graph',\n  openGraph: { title: 'Lesson 17.4 — Open Graph', description: 'Why a pasted link becomes a card', url: '/og/dung' },\n};\nexport default function P() { return <h1>Lesson 17.4</h1>; }\n",
 "n17-4:file:src/app/og/the/[slug]/page.tsx": "// app/og/the/[slug]/page.tsx — one page per article\nexport default async function P({ params }: PageProps<'/og/the/[slug]'>) { return <h1>Article {(await params).slug}</h1>; }\n",
 "n17-4:file:src/app/og/the/[slug]/opengraph-image.tsx": "// app/og/the/[slug]/opengraph-image.tsx — a card image generated per article\nimport { ImageResponse } from 'next/og';\nexport const size = { width: 1200, height: 630 };\nexport const contentType = 'image/png';\nexport default async function Image({ params }: { params: Promise<{ slug: string }> }) {\n  const { slug } = await params;\n  return new ImageResponse(\n    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111827', color: 'white', fontSize: 72 }}>\n      ▲ Article: {slug}\n    </div>,\n    size,\n  );\n}\n",
 "n17-4:lab": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n# no metadataBase yet: how are the relative URLs resolved?\n$ npm run build 2>&1 | grep -iE 'metadataBase|Compiled|/og/|opengraph|rror' | sed 's/^[┌├└] //' | head -12\n✓ Compiled successfully in 3.2s\n⚠ metadataBase property in metadata export is not set for resolving social open graph or twitter images, using \"http://localhost:3000\". See https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase\n○ /og/bai\n○ /og/dung\nƒ /og/the/[slug]\nƒ /og/the/[slug]/opengraph-image",
 "n17-4:the": "# what Facebook's scraper reads (it ignores everything but these tags)\n$ curl -s localhost:3000/og/bai -A facebookexternalhit/1.1 | grep -oE '<title>[^<]*</title>|<meta property=\"og:[a-z:]+\" content=\"[^\"]*\"'\n<title>Lesson 17.4 — Open Graph</title>\n<meta property=\"og:title\" content=\"CT Lab\"\n<meta property=\"og:description\" content=\"The lab site\"\n<meta property=\"og:url\" content=\"https://example.com\"\n<meta property=\"og:image\" content=\"http://localhost:3000/og-site.png\"\n$ curl -s localhost:3000/og/dung -A facebookexternalhit/1.1 | grep -oE '<title>[^<]*</title>|<meta property=\"og:[a-z:]+\" content=\"[^\"]*\"'\n<title>Lesson 17.4 — Open Graph</title>\n<meta property=\"og:title\" content=\"Lesson 17.4 — Open Graph\"\n<meta property=\"og:description\" content=\"Why a pasted link becomes a card\"\n<meta property=\"og:url\" content=\"/og/dung\"\n$ curl -s localhost:3000/og/the/hello | grep -oE '<meta property=\"og:image[a-z:]*\" content=\"[^\"]*\"'\n<meta property=\"og:image\" content=\"http://localhost:19322/og/the/hello/opengraph-image?dbbc30bb4b8536aa\"\n<meta property=\"og:image:type\" content=\"image/png\"\n<meta property=\"og:image:width\" content=\"1200\"\n<meta property=\"og:image:height\" content=\"630\"\n$ curl -s localhost:3000/og/the/hello/opengraph-image -o card.png -w '%{http_code} %{content_type} %{size_download} byte\\n'; file card.png\n200 image/png 24053 byte\ncard.png: PNG image data, 1200 x 630, 8-bit/color RGBA, non-interlaced",
 "n17-4:base": "# fix 1: metadataBase in the root layout · fix 2: no url in the shared openGraph\n$ grep -n \"metadataBase\" src/app/layout.tsx; grep -n \"openGraph\" src/app/og/layout.tsx\n16:  metadataBase: new URL(\"https://example.com\"),\n4:  openGraph: { title: 'CT Lab', description: 'The lab site', images: ['/og-site.png'] },\n$ npm run build 2>&1 | grep -iE 'metadataBase|Compiled|rror' | head -4\n✓ Compiled successfully in 324ms\n$ curl -s localhost:3000/og/bai -A facebookexternalhit/1.1 | grep -oE '<meta property=\"og:(url|title|image)\" content=\"[^\"]*\"'\n<meta property=\"og:title\" content=\"CT Lab\"\n<meta property=\"og:image\" content=\"https://example.com/og-site.png\"\n$ curl -s localhost:3000/og/the/hello | grep -oE '<meta property=\"og:image\" content=\"[^\"]*\"'\n<meta property=\"og:image\" content=\"https://example.com/og/the/hello/opengraph-image?dbbc30bb4b8536aa\"",
 "n17-4:kho": "$ grep -n \"metadataBase\" frontend/src/app/layout.tsx\n150:  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://cuongthai.com'),\n$ git show 07aa3f99e --format='%h %ad %s' --date=short -s\n07aa3f99e 2026-07-23 fix(seo): drop hardcoded homepage og:url + canonical from root layout\n$ git show 07aa3f99e --format= -- frontend/src/app/layout.tsx | grep -E \"^-.*url: 'https://cuongthai.com'|^-.*canonical\"\n-    url: 'https://cuongthai.com',\n-    canonical: 'https://cuongthai.com',\n$ find frontend/src/app -name 'opengraph-image.tsx' | wc -l | sed 's/^ */opengraph-image.tsx: /'\nopengraph-image.tsx: 15\n$ curl -s https://cuongthai.com/courses/nextjs -A facebookexternalhit/1.1 | grep -oE '<meta property=\"og:(url|title|image)\" content=\"[^\"]{0,80}' | head -4\n<meta property=\"og:title\" content=\"Next.js: The React Framework\n<meta property=\"og:url\" content=\"https://cuongthai.com/courses/nextjs\n<meta property=\"og:image\" content=\"https://media.cuongthai.com/images/course-covers/nextjs.png?v=4",
 "n17-4:dung": ""
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, icards, path, thucTe4 } from './_nxj-chung.mjs';

// ── số đo (n17-4 · lab c17 · Next.js 16.4.6 · next start 19322 · curl -A facebookexternalhit/1.1)
export const deck = { key: 'nxj-17-4', code: 'NXJ 17.4', title: 'Open Graph: how a shared link looks', sub: 'Chapter 17 · Lesson 17.4' };
const O = (k) => { const v = DU_LIEU[`n17-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ ') && !ls[j].startsWith('# '); j++) if (ls[j].trim() && !/^(✓ Running|▲|- )/.test(ls[j].trim())) r.push(ls[j]); return r; };
const F = (p) => O(`file:${p}`).trim();
const gon = (ls) => ls.map((l) => l.replace(/^<meta property="/, '').replace(/" content="/, ' = ').replace(/"$/, ''));

const BUILD = doan('lab', 'npm run build');
const WARN = BUILD.find((l) => /metadataBase/.test(l)).replace(/ See https:.*$/, '');
const BAI = gon(doan('the', '/og/bai')), DUNG = gon(doan('the', '/og/dung')), IMG = gon(doan('the', '/og/the/hello |'));
const CARD = doan('the', 'opengraph-image -o card.png');
const FIX = doan('base', 'metadataBase" src/app/layout.tsx'), BAI2 = gon(doan('base', '/og/bai')), IMG2 = gon(doan('base', '/og/the/hello |'));
const KHO = O('kho').split('\n');
if (!BAI.some((l) => l === 'og:url = https://example.com') || !BAI2.every((l) => !/og:url/.test(l)) || !/1200 x 630/.test(CARD.join())) throw new Error('số đo đổi');
const H_LAYOUT = "// app/og/layout.tsx — \"site-wide\" Open Graph\nexport const metadata = {\n  openGraph: {\n    title: 'CT Lab', description: 'The lab site',\n    url: 'https://example.com',\n    images: ['/og-site.png'] },\n};\n\n// app/og/bai/page.tsx — a deep page, own title only\nexport const metadata = { title: 'Lesson 17.4 — Open Graph' };";
const H_IMG = "// app/og/the/[slug]/opengraph-image.tsx\nimport { ImageResponse } from 'next/og';\nexport const size = { width: 1200, height: 630 };\nexport default async function Image({ params }) {\n  const { slug } = await params;\n  return new ImageResponse(\n    <div style={{ …, fontSize: 72 }}>▲ Article: {slug}</div>,\n    size);\n}";
if (!/url: 'https:\/\/example.com'/.test(F('src/app/og/layout.tsx')) || !/new ImageResponse/.test(F('src/app/og/the/[slug]/opengraph-image.tsx'))) throw new Error('mã lab đổi');

export const S = [
  { cover: true, nhan: 'Chapter 17 · Lesson 17.4', t: 'Open Graph:<br>how a shared<br>link looks', sub: 'Measured as Facebook’s scraper: an inherited og:url that sends every link home, an og:image on localhost, and a card image generated per article',
    en: 'Lesson seventeen point four: Open Graph, how a shared link looks. We read pages as Facebook\'s scraper does: an inherited og:url that sends every link home, an image on localhost, and a card generated per article.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A link card = a few <code>og:</code> meta tags the platform reads — nothing else</li>
    <li><code>openGraph</code> in a layout is <b>inherited</b>: a fixed <code>og:url</code> sends every link home</li>
    <li>No <code>metadataBase</code> ⇒ images on <code>http://localhost:3000</code> (a warning nobody reads)</li>
    <li><code>opengraph-image.tsx</code> ⇒ a real 1200×630 PNG per article</li>
    <li>cuongthai.com had the og:url bug — fixed 23/07/2026</li></ul>`,
    en: 'Five takeaways. A link card is just a few og meta tags. openGraph in a layout is inherited, so a fixed og:url sends every link home. Without metadataBase, images point to localhost. opengraph-image renders a real image per article. And cuongthai.com had exactly the og:url bug.' },
  { t: 'From a pasted link to a card', body: path([
      { t: 'you paste', s: 'a link in Messenger / Zalo' }, { t: 'the scraper', s: 'GET · facebookexternalhit', on: true }, { t: 'og: tags', s: 'title · description · image · url' }, { t: 'the card', s: 'cached by the platform' },
    ], { nhan: ['fetch', 'read', 'render'] }) + icards([
      ['type', 'og:title / og:description', 'the headline and the grey text on the card'],
      ['eye', 'og:image', 'the picture — 1200×630 is the safe size; must be an absolute URL'],
      ['link', 'og:url', 'where the card points — Messenger opens <b>this</b>, not the address you pasted'],
    ], 3) + box('Open Graph (OG)', 'A standard set of <code>&lt;meta property="og:…"&gt;</code> tags. The platform does not guess — it reads exactly these.', 'lam'),
    en: 'From a pasted link to a card. The platform\'s scraper downloads your page and reads the og tags: title, description, image and url. og:url matters most: Messenger opens that address, not the one you pasted. The platform then caches the card.' },
  { t: 'Measured: what the scraper reads on a deep page', to: true, body: two(D(tsx(H_LAYOUT, { sm: true, hl: [5, 10] })),
    D(tn(['$ curl -s localhost:3000/og/bai -A facebookexternalhit/1.1 | grep -oE "<title>|og:…"', ...BAI].join('\n'), { fs: 13, wrap: 54, title: 'curl as the scraper (real)' }),
      box('Three bugs, no error', '<b>og:url</b> = the site root ⇒ the card opens the homepage. <b>og:title</b> = the layout\'s, not the page\'s. <b>og:image</b> = <code>http://localhost:3000/…</code>. The page builds and looks fine in a browser.', 'do2')), ''),
    en: 'Measured on a deep page that sets only its own title. The scraper reads og:url equal to the site root, so the card opens the homepage. og:title is the layout\'s, not the page\'s. And the image points to localhost. No error anywhere.' },
  { t: 'cuongthai.com, 23 July 2026: every shared link opened “/”', body: two(D(tn(KHO.slice(KHO.findIndex((l) => l.includes('git show 07aa3f99e --format=\'%h')), KHO.findIndex((l) => l.includes("find frontend"))).join('\n'), { fs: 14, wrap: 60, title: 'git (real)' })),
    D(box('One line in the root layout', 'The root layout set <code>openGraph.url</code> and a canonical to <code>https://cuongthai.com</code>. Every page inherited them: deep links to the feed, notes, Code Lab… previewed and opened as the homepage.', 'do2'),
      box('The fix: say less', 'Remove the fixed url from the shared metadata. With no <code>og:url</code> the platform uses the address it scraped; pages that need one set their own.', 'xanh')), ''),
    en: 'This happened on cuongthai.com. The root layout set a fixed og:url and canonical to the homepage. Every page inherited them, so shared deep links opened the homepage. The fix on the twenty-third of July was to remove the fixed url from the shared metadata.' },
  { t: 'metadataBase: relative URLs need a host', body: two(D(tn(['$ npm run build', WARN].join('\n'), { fs: 14, wrap: 58, title: 'next build (real)' }),
      tn(['$ curl -s localhost:3000/og/dung -A facebookexternalhit/1.1 | grep og:', ...DUNG].join('\n'), { fs: 14, wrap: 58, title: 'curl (real) · url: \'/og/dung\'' })),
    D(tsx('// app/layout.tsx\nexport const metadata = {\n  metadataBase: new URL("https://example.com"),\n  …\n};', { hl: [3] }),
      box('Without it', 'Images resolve to <code>http://localhost:3000</code> — only a build warning. A relative <code>og:url</code> stays <code>/og/dung</code>, which no platform can open.', 'do2'),
      box('With it', 'Every relative image and url becomes <code>https://example.com/…</code>. cuongthai.com sets it from <code>NEXT_PUBLIC_APP_URL</code>.', 'xanh')), ''),
    en: 'metadataBase. Without it, the build only warns, and images resolve to localhost three thousand. A relative og:url stays slash og slash dung, which no platform can open. Set metadataBase in the root layout and every relative URL becomes absolute.' },
  { t: 'A card per article: opengraph-image.tsx', body: two(D(tsx(H_IMG, { sm: true, hl: [3, 6] }), tn(['$ curl -s …/og/the/hello | grep og:image', ...IMG].join('\n'), { fs: 13, wrap: 58, title: 'curl (real)' })),
    D(br('nxj-17-4', 'card-hello', { url: 'localhost:3000/og/the/hello/opengraph-image', vp: 1200, h: 630, w: 480 }),
      tn(['$ curl -s <og:image> -o card.png -w "%{http_code} %{content_type} %{size_download}"; file card.png', ...CARD].join('\n'), { fs: 13, wrap: 56, title: 'the generated image (real)' })), ''),
    en: 'A card per article. opengraph-image.tsx renders JSX into a PNG. Next.js adds the og:image tags with width and height for you. Fetched for real: status two hundred, image png, twelve hundred by six hundred thirty pixels.' },
  { t: 'After the fix — and one trap left', body: two(D(tn(['$ grep -n metadataBase src/app/layout.tsx; grep -n openGraph src/app/og/layout.tsx', ...FIX, '$ curl -s localhost:3000/og/bai -A facebookexternalhit/1.1 | grep og:', ...BAI2, '$ curl -s localhost:3000/og/the/hello | grep og:image', ...IMG2].join('\n'), { fs: 13, wrap: 60, title: 'after the fix (real)' })),
    D(box('Fixed', 'No <code>og:url</code> ⇒ the platform uses the address it scraped. Images are absolute on the real domain.', 'xanh'),
      box('Still wrong: og:title', '<code>og:title</code> is still <i>CT Lab</i>: a page\'s <code>title</code> does not flow into a parent\'s <code>openGraph</code>. Give each page its own <code>openGraph.title</code> (or use <code>generateMetadata</code>).', 'do2')), ''),
    en: 'After the fix: no og:url, so the platform uses the address it scraped, and the images are absolute. One trap is left: og:title is still the layout\'s, because a page\'s title does not flow into its parent\'s openGraph. Give each page its own openGraph title.' },
  { t: 'Trap: the platform caches the first card', body: steps([
      'The first share scrapes the page — often while it is half-built',
      'Facebook, Zalo, Slack, LinkedIn and X cache that card, often for days',
      'You fix the tags; the old card keeps showing — no error anywhere',
      'Re-scrape on demand: Facebook Sharing Debugger, LinkedIn Post Inspector; or add <code>?v=2</code> to the shared URL',
    ]) + box('Check before the first share', '<code>curl -s &lt;url&gt; -A facebookexternalhit/1.1 | grep og:</code> — the same tags the platform will cache.', 'lam'),
    en: 'Trap: the platform caches the first card. The first share scrapes the page, often while it is half-built, and the card is cached for days. Fixing the tags changes nothing until you re-scrape with the platform\'s debugger. So check with curl before the first share.' },
  { t: 'cuongthai.com today', body: two(D(tn(KHO.filter((l, i) => i < KHO.findIndex((x) => x.includes("git show 07aa3f99e --format='%h")) || i >= KHO.findIndex((x) => x.includes('find frontend'))).join('\n'), { fs: 13, wrap: 66, title: 'frontend/ + production (real)' })),
    D(box('metadataBase from the environment', '<code>NEXT_PUBLIC_APP_URL</code>, falling back to the real domain — so images are never on localhost.', 'xanh'),
      box('15 opengraph-image files', 'Course, blog, repos… pages draw their own card. The course page now reports its own <code>og:url</code> and a course cover as <code>og:image</code>.', 'xanh')), ''),
    en: 'cuongthai.com today: metadataBase comes from the environment with the real domain as fallback. Fifteen opengraph-image files draw per-page cards. The course page reports its own og:url and its cover image.' },
  { t: 'Not learning in a vacuum: real life, what if, the attacker', to: true, body: thucTe4({
      doi: ['💬', 'Pasting a link into Zalo or Messenger', ['the card = og:title + og:image of that page', 'wrong og:url ⇒ a tap opens the homepage']],
      neu: ['🖼️', 'og:image points to localhost?', ['the build warned; nobody read it', 'every share shows a broken picture']],
      xau: ['🎣', 'A phishing page copies a bank’s card', ['same logo + title in the chat preview', 'the card proves nothing about the domain']],
      phong: ['🛡️', 'Read the domain, not the card', ['check the address before typing a password', 'your site: curl -A facebookexternalhit before sharing']],
    }),
    en: 'Real life: you paste a link into Zalo or Messenger, and the card is just that page\'s og title and image; a wrong og:url opens the homepage. What if og:image points to localhost? Every share shows a broken picture. Attackers copy a bank\'s card on a phishing page: the card proves nothing about the domain. Read the address, not the card.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Open Graph', 'og: meta tags for link cards'), kw('Scraper', 'the platform\'s bot that reads them'), kw('og:url', 'where the card points'), kw('og:image', '1200×630, absolute URL'),
      kw('metadataBase', 'the host for relative URLs'), kw('Metadata inheritance', 'layouts pass openGraph down'), kw('opengraph-image.tsx', 'a PNG per record'), kw('Card cache', 'the first share sticks'),
      kw('Canonical', 'the one true URL of a page'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: Open Graph; the scraper; og:url, where the card points; og:image; metadataBase; metadata inheritance; opengraph-image; the card cache; and the canonical URL.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Put ${c("openGraph.url")} in a layout; curl a deep page as ${c('facebookexternalhit')}`,
      `Remove ${c('metadataBase')}; read the build warning and the og:image`,
      `Add ${c('opengraph-image.tsx')}; download the image and check 1200×630`,
      'Share a page twice after changing its title — then re-scrape it',
    ]), box('Keep these', `<ul><li>The card is only the og: tags</li><li>No fixed og:url in shared layouts</li><li>Always set metadataBase</li><li>Check with curl before the first share</li></ul>`, 'lam'), ''),
    en: 'Your turn: put an openGraph url in a layout and curl a deep page as Facebook\'s scraper; remove metadataBase and read the warning; add opengraph-image and check the size; then change a title after sharing and re-scrape it.' },
];
export const slides = lamDeck({ chuong: 'Chapter 17 — Rendering strategies and SEO', bai: '17.4' }, S);
