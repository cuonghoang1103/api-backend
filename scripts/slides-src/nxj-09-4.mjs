/*DU_LIEU*/
const DU_LIEU = {
 "n9-4:file:src/app/props/XemKieu.tsx": "'use client';\nimport type { ReactNode } from 'react';\n\n// Nhận đủ loại giá trị từ máy chủ, in ra phía trình duyệt nó THẬT SỰ là gì\nfunction kieu(v: unknown): string {\n  if (v === null) return 'null';\n  if (v === undefined) return 'undefined';\n  if (v instanceof Date) return 'Date ✓ ' + v.toISOString().slice(0, 10);\n  if (v instanceof Map) return 'Map ✓ size ' + v.size;\n  if (v instanceof Set) return 'Set ✓ size ' + v.size;\n  if (Array.isArray(v)) return 'Array [' + v.join(', ') + ']';\n  if (typeof v === 'bigint') return 'bigint ✓ ' + v.toString() + 'n';\n  if (typeof v === 'object') return 'object ' + JSON.stringify(v);\n  return typeof v + ' ' + String(v);\n}\n\nexport default function XemKieu(props: Record<string, unknown> & { phanTu: ReactNode }) {\n  return (\n    <table id=\"bang\" className=\"font-mono text-sm\">\n      <tbody>\n        {Object.entries(props).filter(([k]) => k !== 'phanTu').map(([k, v]) => (\n          <tr key={k}><td className=\"pr-4\">{k}</td><td>{kieu(v)}</td></tr>\n        ))}\n        <tr><td className=\"pr-4\">phanTu</td><td>{props.phanTu}</td></tr>\n      </tbody>\n    </table>\n  );\n}\n",
 "n9-4:file:src/app/props/page.tsx": "import XemKieu from './XemKieu';\n\nexport default function TrangProps() {\n  return (\n    <main className=\"p-4\">\n      <XemKieu\n        chuoi=\"xin chào\" so={42} dung={true} rong={null} khongCo={undefined}\n        mang={[1, 2, 3]} doiTuong={{ id: 7, ten: 'An' }}\n        ngay={new Date('2026-11-13T00:00:00Z')} map={new Map([['a', 1], ['b', 2]])} tap={new Set(['x', 'y'])}\n        lon={BigInt('9007199254740993')}\n        phanTu={<b>element JSX do máy chủ render</b>}\n      />\n    </main>\n  );\n}\n",
 "n9-4:trang": "$ find src/app/props -type f | sort\nsrc/app/props/page.tsx\nsrc/app/props/XemKieu.tsx\n$ npm run build\n✓ Compiled successfully in 2.7s\nRoute (app)\n├ ○ /props\n○  (Static)   prerendered as static content\nƒ  (Dynamic)  server-rendered on demand",
 "n9-4:mo": "$ curl -s localhost:3000/props | grep -o '{…chuoi … render…}'   (props của XemKieu trong RSC payload, đã bỏ dấu thoát)\n{\"chuoi\":\"xin chào\",\"so\":42,\"dung\":true,\"rong\":null,\"khongCo\":\"$undefined\",\"mang\":[1,2,3],\"doiTuong\":{\"id\":7,\"ten\":\"An\"},\"ngay\":\"$D2026-11-13T00:00:00.000Z\",\"map\":\"$Qa\",\"tap\":\"$Wb\",\"lon\":\"$n9007199254740993\",\"phanTu\":[\"$\",\"b\",null,{\"children\":\"element JSX do máy chủ render\"}]",
 "n9-4:dung": "",
 "n9-4:file:src/app/bay-ham/NutThich.tsx": "'use client';\n\nexport default function NutThich({ onLike }: { onLike: () => void }) {\n  return <button onClick={onLike}>♥ Thích</button>;\n}\n",
 "n9-4:file:src/app/bay-ham/page.tsx": "import NutThich from './NutThich';\n\nexport default function Trang() {\n  return <NutThich onLike={() => console.log('lưu vào DB')} />;\n}\n",
 "n9-4:bayham": "$ npm run build   (Server Component truyền một hàm thường)\nError occurred prerendering page \"/bay-ham\". Read more: https://nextjs.org/docs/messages/prerender-error\nError: Event handlers cannot be passed to Client Component props.\n  {onLike: function onLike}\nExport encountered an error on /bay-ham/page: /bay-ham, exiting the build.",
 "n9-4:file:src/app/bay-lop/Gia.tsx": "'use client';\n\nexport default function Gia({ gia }: { gia: unknown }) {\n  return <p>{String(gia)}</p>;\n}\n",
 "n9-4:file:src/app/bay-lop/page.tsx": "import Gia from './Gia';\n\n// Giống Decimal của Prisma: một THỰC THỂ CLASS, không phải object thường\nclass Decimal {\n  constructor(private v: string) {}\n  toString() { return this.v; }\n}\n\nexport default function Trang() {\n  return <Gia gia={new Decimal('199000.50')} />;\n}\n",
 "n9-4:baylop": "$ npm run build   (truyền một thực thể class, kiểu Decimal của Prisma)\nError occurred prerendering page \"/bay-lop\". Read more: https://nextjs.org/docs/messages/prerender-error\nError: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.\nExport encountered an error on /bay-lop/page: /bay-lop, exiting the build.",
 "n9-4:file:src/app/bay-sym/Nhan.tsx": "'use client';\n\nexport default function Nhan({ the }: { the: symbol }) {\n  return <p>{String(the)}</p>;\n}\n",
 "n9-4:file:src/app/bay-sym/page.tsx": "import Nhan from './Nhan';\n\nexport default function Trang() {\n  return <Nhan the={Symbol('vai-tro')} />;\n}\n",
 "n9-4:baysym": "$ npm run build   (truyền một Symbol)\nError occurred prerendering page \"/bay-sym\". Read more: https://nextjs.org/docs/messages/prerender-error\nError: Only global symbols received from Symbol.for(...) can be passed to Client Components. The symbol Symbol.for(vai-tro) cannot be found among global symbols.\nExport encountered an error on /bay-sym/page: /bay-sym, exiting the build.",
 "n9-4:file:src/app/props/ho-so/TheTen.tsx": "'use client';\n\ntype NguoiDung = { id: number; ten: string; email: string; matKhauHash: string };\n\n// Component chỉ HIỆN tên — nhưng nhận nguyên object\nexport default function TheTen({ nguoi }: { nguoi: NguoiDung }) {\n  return <p id=\"ten\">👤 {nguoi.ten}</p>;\n}\n",
 "n9-4:file:src/app/props/ho-so/page.tsx": "import TheTen from './TheTen';\n\n// Giả lập một dòng lấy từ CSDL (prisma.user.findUnique) — có cả cột nhạy cảm\nconst nguoi = { id: 7, ten: 'An', email: 'an@vi-du.test', matKhauHash: 'HASH-GIA-LAP-khong-phai-that' };\n\nexport default function HoSo() {\n  return <TheTen nguoi={nguoi} />;\n}\n",
 "n9-4:locot": "$ npm run build\n✓ Compiled successfully in 121ms\n├ ○ /props/ho-so",
 "n9-4:locotmo": "$ curl -s localhost:19383/props/ho-so | grep -o '<p id=\"ten\">[^/]*</p>' | sed 's#<!-- -->##g'\n<p id=\"ten\">👤 An</p>\n$ curl -s localhost:19383/props/ho-so | grep -o 'matKhauHash[^,}]*' | head -2\nmatKhauHash\\\":\\\"HASH-GIA-LAP-khong-phai-that\\\"\n$ node rsc.mjs http://localhost:19383/props/ho-so 'matKhau' | cut -c1-260\nHTML 7613 byte · trong đó RSC payload 4920 byte\n8:[[\"children\",{\"s\":\"__PAGE__\",\"h\":512,\"d\":{\"r\":[\"$\",\"$1\",\"c\",{\"children\":[[\"$\",\"$La\",null,{\"nguoi\":{\"id\":7,\"ten\":\"An\",\"email\":\"an@vi-du.test\",\"matKhauHash\":\"HASH-GIA-LAP-khong-phai-that\"}}],[[\"$\",\"script\",\"script-0\",{\"src\":\"/_next/static/chunks/3gcyzup1igqjb.",
 "n9-4:locotdung": "",
 "n9-4:file:src/app/bay-ham2/Gia.tsx": "'use client';\n\nexport default function Gia({ tinhGia }: { tinhGia: (x: number) => number }) {\n  return <p>{tinhGia(100)}</p>;\n}\n",
 "n9-4:file:src/app/bay-ham2/page.tsx": "import Gia from './Gia';\n\nexport default function Trang() {\n  return <Gia tinhGia={(x) => x * 2} />;\n}\n",
 "n9-4:bayham2": "$ npm run build   (hàm thường, tên prop KHÔNG bắt đầu bằng on)\nError occurred prerendering page \"/bay-ham2\". Read more: https://nextjs.org/docs/messages/prerender-error\nError: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with \"use server\". Or maybe you meant to call this function rather than return it.\n  {tinhGia: function tinhGia}\nExport encountered an error on /bay-ham2/page: /bay-ham2, exiting the build.",
 "anh-nxj-9-4:props": {
  "url": "http://127.0.0.1:19383/props",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#bang": [
    16,
    16,
    327,
    220
   ]
  },
  "console": [],
  "ketQua": {
   "bang": [
    "chuoi → string xin chào",
    "so → number 42",
    "dung → boolean true",
    "rong → null",
    "mang → Array [1, 2, 3]",
    "doiTuong → object {\"id\":7,\"ten\":\"An\"}",
    "ngay → Date ✓ 2026-11-13",
    "map → Map ✓ size 2",
    "tap → Set ✓ size 2",
    "lon → bigint ✓ 9007199254740993n",
    "phanTu → element JSX do máy chủ render"
   ]
  }
 },
 "anh-nxj-9-4:ho-so": {
  "url": "http://127.0.0.1:19383/props/ho-so",
  "vp": [
   640,
   90
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "manHinh": "KHÔNG hiện trên màn hình",
   "html": "CÓ trong HTML tải về"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, br, flow } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-09-4', code: 'NXJ 9.4', title: 'Across the boundary: props must serialize', sub: 'Chapter 9 · Lesson 9.4' };
const O = (k) => { const v = DU_LIEU[`n9-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-9-4:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-09-4', ten, o);
const lay = (k, ...re) => { const s = O(k); const l = s.split('\n').filter((x) => !x.startsWith('$ ') && re.some((r) => r.test(x))); if (!l.length) throw new Error('không thấy dòng trong ' + k); return l.join('\n'); };
const goc = (src) => src.trim().split('\n').filter((l) => !/^\s*\/\//.test(l)).map((l) => l.replace(/\s+\/\/ .*$/, '')).join('\n');
const BANG = AN('props').ketQua.bang, HS = AN('ho-so').ketQua;
if (BANG.length !== 11 || BANG.some((r) => r.startsWith('khongCo')) || !BANG.includes('ngay → Date ✓ 2026-11-13') || !BANG.includes('lon → bigint ✓ 9007199254740993n') || !BANG.includes('map → Map ✓ size 2')) throw new Error('bảng kiểu 9.4 đổi');
if (HS.manHinh !== 'KHÔNG hiện trên màn hình' || HS.html !== 'CÓ trong HTML tải về') throw new Error('số đo ho-so 9.4 đổi');
for (const [k, s] of [['mo', '"ngay":"$D2026-11-13T00:00:00.000Z"'], ['mo', '"lon":"$n9007199254740993"'], ['mo', '"khongCo":"$undefined"'], ['bayham', 'Event handlers cannot be passed to Client Component props'],
  ['bayham2', 'Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server"'], ['baylop', 'Only plain objects, and a few built-ins'], ['baysym', 'Only global symbols received from Symbol.for(...)'],
  ['locotmo', 'matKhauHash\\":\\"HASH-GIA-LAP'], ['locotmo', '<p id="ten">👤 An</p>']])
  if (!O(k).includes(s)) throw new Error(`số đo 9.4 đổi: ${k} thiếu "${s}"`);
const PROPS = lay('mo', /chuoi/);
const tach = (s) => s.replace(/,"(?=[a-zA-Z]+":)/g, ',\n "');

export const S = [
  { cover: true, nhan: 'Chapter 9 · Lesson 9.4', t: 'Across the boundary:<br>props must serialize', sub: 'Server → client props travel as data in the RSC payload. Measured: what survives, the exact errors for what does not — and what leaks',
    en: 'Lesson nine point four: across the boundary, props must serialize. Props from a Server Component to a Client Component travel as data in the RSC payload. We measure what survives, the exact errors for what does not, and what quietly leaks.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why props from server to client become <b>data on the wire</b></li>
    <li>Measured: strings, numbers, arrays, objects — and also <code>Date</code>, <code>Map</code>, <code>Set</code>, <code>BigInt</code>, JSX elements</li>
    <li>Measured: the exact errors for a function, a class instance (like Prisma's <code>Decimal</code>) and a <code>Symbol</code></li>
    <li>Two fixes for "I need a function": a handler in the client, or a Server Action</li>
    <li>The quiet one: passing a whole DB row ships <b>every column</b> to the browser</li></ul>`,
    en: 'Five takeaways: why server-to-client props become data on the wire; measured — what survives, including Date, Map, Set, BigInt and JSX; the exact errors for a function, a class instance and a Symbol; two fixes for needing a function; and the quiet one — a whole database row ships every column.' },
  { t: 'Props from server to client must survive the wire', body: flow([
      { t: 'Server Component', s: 'renders <XemKieu …props>', mau: '#111827' }, { t: 'serialize', s: 'props → RSC payload text', mau: '#b85a2b' },
      { t: 'the wire', s: 'inside the HTML / a fetch', mau: '#475569' }, { t: 'deserialize', s: 'text → values again', mau: '#b85a2b' }, { t: 'Client Component', s: 'hydrates with those props', mau: '#0070f3' },
    ], { h: 140, fs: 18 }) + two(box('Crosses fine', 'Strings, numbers, booleans, <code>null</code>, arrays and plain objects of those. React\'s serializer also handles <code>Date</code>, <code>Map</code>, <code>Set</code>, <code>BigInt</code> and JSX elements — measured next.', 'xanh'),
      box('Does not cross', 'Plain functions, class instances (things with methods), non-global symbols. They carry <b>behaviour</b>, not just data — and behaviour cannot be written down as text.', 'do2'), '') +
      cmp(['One value, three places', 'on the server', 'in the RSC payload', 'in the browser'], [
        ['a Date', "<code>new Date('2026-11-13T00:00:00Z')</code>", '<code>' + PROPS.match(/"ngay":"[^"]+"/)[0] + '</code>', BANG.find((r) => r.startsWith('ngay')).replace('ngay → ', '')],
        ['a BigInt', "<code>BigInt('9007199254740993')</code>", '<code>' + PROPS.match(/"lon":"[^"]+"/)[0] + '</code>', BANG.find((r) => r.startsWith('lon')).replace('lon → ', '')],
      ], { hl: [] }),
    en: 'Why must props serialize? A Server Component renders a Client Component with props. Those props are serialized into the RSC payload, travel inside the HTML or a fetch, and are turned back into values in the browser, where the client component hydrates with them. Data crosses fine. Behaviour — functions, class instances — cannot be written down as text.' },
  { t: 'Measured: what actually arrives in the browser', body: tsx(goc(O('file:src/app/props/page.tsx')).split('\n').slice(5, 12).join('\n'), { sm: true }) +
      two(tn(PROPS, { fs: 13, wrap: 58, title: 'the props inside the RSC payload (real)' }),
      D(B('props', { vp: 640, h: 236, w: 470, url: 'localhost:3000/props — what the client sees' }),
        box('Read the markers', '<code>$D</code> Date · <code>$Q</code> Map · <code>$W</code> Set · <code>$n</code> BigInt — each arrives as the real type (✓). <code>undefined</code>: the key <code>khongCo</code> is simply absent.', 'lam')), ''),
    en: 'Measured: what actually arrives. The page passes a string, number, boolean, null, undefined, an array, an object, a Date, a Map, a Set, a BigInt and a JSX element. In the payload, Date is written with a dollar-D marker, Map with Q, Set with W, BigInt with n. In the browser each arrives as its real type. And undefined simply disappears: the key is absent.' },
  { t: 'Measured: passing a function', body: two(D(tsx(goc(O('file:src/app/bay-ham/page.tsx')), { sm: true, hl: [4] }),
      tn(lay('bayham', /Event handlers|onLike/), { fs: 15, wrap: 58, title: 'npm run build — a prop named onLike (real)' })),
      D(tsx(goc(O('file:src/app/bay-ham2/page.tsx')), { sm: true, hl: [4] }),
        tn(lay('bayham2', /Functions cannot|tinhGia/), { fs: 14, wrap: 46, title: 'npm run build — prop tinhGia (real)' })), 'r64') +
      box('Same mistake, two messages', 'A prop whose name starts with <code>on…</code> is treated as an event handler: <i>"Event handlers cannot be passed…"</i>. Any other name: <i>"Functions cannot be passed directly… unless … \'use server\'"</i>. Both stop <code>next build</code> while prerendering.', 'do2'),
    en: 'Measured: passing a function. A prop named onLike gives: event handlers cannot be passed to Client Component props. A function prop with another name, tinhGia, gives the message you will search for: functions cannot be passed directly to Client Components unless you mark it with use server. Both stop next build while prerendering.' },
  { t: 'Measured: a class instance and a Symbol', body: two(D(tsx(goc(O('file:src/app/bay-lop/page.tsx')).split('\n').slice(2).join('\n'), { sm: true, hl: [2, 8] }),
      tn(lay('baylop', /Only plain objects/), { fs: 15, wrap: 58, title: 'npm run build — a Decimal-like class (real)' })),
      D(tsx(goc(O('file:src/app/bay-sym/page.tsx')), { sm: true, hl: [4] }),
        tn(lay('baysym', /Only global symbols/), { fs: 15, wrap: 58, title: 'npm run build — Symbol("vai-tro") (real)' }),
        box('Why Prisma bites here', 'Prisma returns <code>Decimal</code> columns as instances of a class. Pass the row straight through and you hit exactly this error. <code>BigInt</code> ids are fine (previous slide).', 'lam')), ''),
    en: 'A class instance and a Symbol. We made a small Decimal class, like Prisma\'s: only plain objects and a few built-ins can be passed; classes are not supported. A Symbol: only global symbols from Symbol dot for can be passed. This is why a Prisma row with a Decimal column fails at the boundary — while a BigInt id crosses fine.' },
  { t: 'The fix for "I need a function"', body: two(D(steps([
      '<b>Define the handler in the Client Component.</b> Pass the plain data it needs (<code>postId</code>) and let the client own <code>onClick</code> — event handlers belong there anyway',
      '<b>If it must run on the server</b> (write to the DB), make it a <b>Server Action</b>: a function marked <code>\'use server\'</code>. React sends a <i>reference</i>, not code — Chapter 12',
    ])), D(tsx(`// ✓ data in, behaviour stays in the client
<LikeButton postId={post.id} count={post.likes} />

// LikeButton.tsx
'use client';
export default function LikeButton({ postId, count }) {
  const [n, setN] = useState(count);
  return <button onClick={() => setN(n + 1)}>♥ {n}</button>;
}`, { sm: true, hl: [2] }), '<div class="cap">pattern — the full like button with a Server Action is built in Chapter 12</div>'), ''),
    en: 'The fix for I need a function. Option one: define the handler inside the Client Component; pass only the plain data it needs, like the post id, and let the client own onClick. Option two: if it must run on the server, make it a Server Action — React sends a reference, not code. That is chapter twelve.' },
  { t: 'What crosses the server → client boundary', body: cmp(['Value', 'Crosses?', 'Measured'], [
      ['string · number · boolean · null', '✓', 'same value'],
      ['array · plain object', '✓', '<code>[1, 2, 3]</code> · <code>{"id":7,"ten":"An"}</code>'],
      ['<code>Date</code> · <code>Map</code> · <code>Set</code> · <code>BigInt</code>', '✓ real type', '<code>$D</code> · <code>$Q</code> · <code>$W</code> · <code>$n</code> in the payload'],
      ['JSX element', '✓', 'rendered output (the slot of 9.3)'],
      ['<code>undefined</code>', '≈', 'the key is dropped'],
      ['function · class instance · <code>Symbol()</code>', '✗ build error', 'the three messages above'],
      ['Server Action (<code>\'use server\'</code>)', '✓ as a reference', 'Chapter 12'],
    ], { hl: [5] }),
    en: 'The cheat sheet. Primitives, arrays and plain objects cross unchanged. Date, Map, Set and BigInt arrive as their real types. A JSX element crosses as rendered output. Undefined crosses as a missing key. A plain function, a class instance or a local Symbol stops the build. A Server Action crosses as a reference — chapter twelve.' },
  { t: 'Pitfall, measured: the whole row reaches the browser', body: two(D(tsx(goc(O('file:src/app/props/ho-so/page.tsx')).replace(", email:", ",\n  email:").replace(", matKhauHash:", ",\n  matKhauHash:"), { sm: true, hl: [4, 5, 8] }),
      tsx(goc(O('file:src/app/props/ho-so/TheTen.tsx')).split('\n').slice(4).join('\n'), { sm: true, hl: [2] })),
      D(B('ho-so', { vp: 640, h: 80, w: 420, url: '/props/ho-so — on screen' }),
        tn(lay('locotmo', /matKhauHash|"nguoi"/).replace(/,\[\["\$","script".*$/m, '…'), { fs: 13, wrap: 44, title: 'curl · RSC payload (real)' }),
        box('Not on screen — but in the page', 'Screen: only "👤 An" — the hash is <b>not</b> displayed. The HTML every visitor downloads: the email <b>and</b> <code>matKhauHash</code> (Chromium checked both). The serializer sends what you pass, not what you render.', 'do2')), 'r64'),
    en: 'The quiet pitfall, measured. A profile page passes a whole user row to a client component that only shows the name. On screen: just An. But the HTML every visitor downloads contains the email and the password hash, inside the RSC payload. The serializer sends what you pass, not what you render.' },
  { t: 'The fix: map to an explicit shape at the boundary', body: two(tsx(`// ✗ every column crosses
<TheTen nguoi={user} />

// ✓ pick exactly what the component needs
<TheTen ten={user.ten} />

// ✓ or select it in the query (Prisma)
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, ten: true },
});

// ✓ convert odd types yourself (Decimal → string)
const gia = product.price.toString();`, { hl: [5, 10, 14] }),
      D(box('Rule', 'At the boundary, write the <b>shape</b> the client needs. Pick fields, convert <code>Decimal</code> to a string or number, drop everything else.', 'xanh'),
        box('Two wins', 'No "Only plain objects" surprises the day a <code>Decimal</code> column appears — and nothing sensitive in the HTML of a public page.', 'lam')), ''),
    en: 'The fix: map to an explicit shape at the boundary. Pick exactly the fields the client component needs, or select them in the Prisma query, and convert odd types like Decimal yourself. Two wins: no plain-object surprise when a Decimal column appears, and nothing sensitive in the HTML.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Serializable', 'can be written as data and rebuilt on the other side'), kw('Boundary prop', 'a prop passed from a Server to a Client Component'),
      kw('RSC payload', 'the serialized stream React sends to the browser'), kw('Plain data', 'strings, numbers, booleans, arrays, plain objects'),
      kw('Built-ins that cross', 'Date, Map, Set, BigInt — arrive as real types'), kw('Not serializable', 'functions, class instances, local symbols'),
      kw('Server Action as prop', 'crosses as a reference, not as code'), kw('Explicit shape', 'pick and convert fields at the boundary'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: serializable; boundary prop; RSC payload; plain data; built-ins that cross; not serializable; Server Action as prop; and explicit shape.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Pass a string, a number, a ${c('Date')} and a ${c('Map')} to a client component; print ${c('instanceof')} for each`,
      `Pass ${c('onLike={() => …}')}, then ${c('tinhGia={(x) => …}')}: read both errors`,
      `Pass a class instance; then convert it to a plain value`,
      `Pass a whole object with a secret field; ${c('curl')} the page and grep for it — then pick fields`,
    ]), box('Keep these', `<ul><li>Boundary props are data in the RSC payload</li><li>Date/Map/Set/BigInt/JSX cross; functions, classes, symbols do not</li><li>Handlers live in the client; server work = Server Action</li><li>Pass only the fields the client needs</li></ul>`, 'lam'), ''),
    en: 'Your turn: pass a string, a number, a Date and a Map and print instanceof for each; pass onLike, then tinhGia, and read both errors; pass a class instance, then convert it; pass a whole object with a secret field, curl the page and grep — then pick fields. Keep: boundary props are data; built-ins cross, behaviour does not; handlers live in the client; pass only what the client needs.' },
];
export const slides = lamDeck({ chuong: 'Chapter 9 — Server Components vs Client Components', bai: '9.4' }, S);
