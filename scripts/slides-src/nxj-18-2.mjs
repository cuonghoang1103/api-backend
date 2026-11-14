/*DU_LIEU*/
const DU_LIEU = {
 "n18-2:file:src/app/anh/img/page.tsx": "// app/anh/img/page.tsx — a plain <img>: the browser downloads the original file\nexport default function Page() {\n  return (\n    <main className=\"mx-auto max-w-2xl p-4\">\n      <img id=\"hero\" src=\"/dalat.jpg\" alt=\"Da Lat\" width={4000} height={3000} style={{ width: '100%', height: 'auto' }} />\n    </main>\n  );\n}\n",
 "n18-2:file:src/app/anh/next/page.tsx": "// app/anh/next/page.tsx — <Image> with width/height only (no sizes)\nimport Image from 'next/image';\nexport default function Page() {\n  return (\n    <main className=\"mx-auto max-w-2xl p-4\">\n      <Image id=\"hero\" src=\"/dalat.jpg\" alt=\"Da Lat\" width={4000} height={3000} style={{ width: '100%', height: 'auto' }} />\n    </main>\n  );\n}\n",
 "n18-2:file:src/app/anh/sizes/page.tsx": "// app/anh/sizes/page.tsx — the same <Image>, plus sizes: \"how wide will it be on screen?\"\nimport Image from 'next/image';\nexport default function Page() {\n  return (\n    <main className=\"mx-auto max-w-2xl p-4\">\n      <Image id=\"hero\" src=\"/dalat.jpg\" alt=\"Da Lat\" width={4000} height={3000} sizes=\"(max-width: 672px) 100vw, 672px\" style={{ width: '100%', height: 'auto' }} />\n    </main>\n  );\n}\n",
 "n18-2:file:src/app/anh/nhieu/page.tsx": "// app/anh/nhieu/page.tsx — six photos down a long page, with <Image> (lazy by default)\nimport Image from 'next/image';\nexport default function Page() {\n  return (\n    <main className=\"mx-auto max-w-2xl p-4\">\n      {[1, 2, 3, 4, 5, 6].map((i) => (\n        <section key={i} style={{ height: 1600 }}>\n          <h2>Photo {i}</h2>\n          <Image src={`/p${i}.jpg`} alt={`photo ${i}`} width={4000} height={3000} sizes=\"(max-width: 672px) 100vw, 672px\" style={{ width: '100%', height: 'auto' }} />\n        </section>\n      ))}\n    </main>\n  );\n}\n",
 "n18-2:file:src/app/anh/nhieu-img/page.tsx": "// app/anh/nhieu-img/page.tsx — the same six photos with plain <img>\nexport default function Page() {\n  return (\n    <main className=\"mx-auto max-w-2xl p-4\">\n      {[1, 2, 3, 4, 5, 6].map((i) => (\n        <section key={i} style={{ height: 1600 }}>\n          <h2>Photo {i}</h2>\n          <img src={`/p${i}.jpg`} alt={`photo ${i}`} width={4000} height={3000} style={{ width: '100%', height: 'auto' }} />\n        </section>\n      ))}\n    </main>\n  );\n}\n",
 "n18-2:file:src/app/anh/mot/page.tsx": "// app/anh/mot/page.tsx — a hero photo + eleven photos further down; preload ONLY the hero (the LCP image)\nimport Image from 'next/image';\nexport default function Page() {\n  return (\n    <main>\n      {Array.from({ length: 12 }, (_, i) => (\n        <section key={i} style={{ minHeight: i ? 1000 : 0 }}>\n          <Image id={`p${i + 1}`} src={`/p${i + 1}.jpg`} alt=\"\" width={4000} height={3000} sizes=\"100vw\" preload={i === 0} style={{ width: '100%', height: 'auto' }} />\n        </section>\n      ))}\n    </main>\n  );\n}\n",
 "n18-2:file:src/app/anh/tat/page.tsx": "// app/anh/tat/page.tsx — the same page, but EVERY image says preload (the old `priority` on all)\nimport Image from 'next/image';\nexport default function Page() {\n  return (\n    <main>\n      {Array.from({ length: 12 }, (_, i) => (\n        <section key={i} style={{ minHeight: i ? 1000 : 0 }}>\n          <Image id={`p${i + 1}`} src={`/p${i + 1}.jpg`} alt=\"\" width={4000} height={3000} sizes=\"100vw\" preload style={{ width: '100%', height: 'auto' }} />\n        </section>\n      ))}\n    </main>\n  );\n}\n",
 "n18-2:lab": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/anh/|rror|arn' | sed 's/^[┌├└] //'\n✓ Compiled successfully in 3.2s\n○ /anh/img\n○ /anh/mot\n○ /anh/next\n○ /anh/nhieu\n○ /anh/nhieu-img\n○ /anh/sizes\n○ /anh/tat\n$ curl -s http://127.0.0.1:19326/anh/next | grep -o '<img[^>]*id=\"hero\"[^>]*>' | grep -oE '(loading|srcSet|sizes)=\"[^\"]*\"' | sed 's/&amp;/\\&/g; s/, \\//,\\n        \\//g'\nloading=\"lazy\"\nsrcSet=\"/_next/image?url=%2Fdalat.jpg&w=3840&q=75 1x\"\n$ curl -s http://127.0.0.1:19326/anh/sizes | grep -o '<img[^>]*id=\"hero\"[^>]*>' | grep -oE '(loading|srcSet|sizes)=\"[^\"]*\"' | sed 's/&amp;/\\&/g; s/, \\//,\\n        \\//g'\nloading=\"lazy\"\nsizes=\"(max-width: 672px) 100vw, 672px\"\nsrcSet=\"/_next/image?url=%2Fdalat.jpg&w=640&q=75 640w,\n        /_next/image?url=%2Fdalat.jpg&w=750&q=75 750w,\n        /_next/image?url=%2Fdalat.jpg&w=828&q=75 828w,\n        /_next/image?url=%2Fdalat.jpg&w=1080&q=75 1080w,\n        /_next/image?url=%2Fdalat.jpg&w=1200&q=75 1200w,\n        /_next/image?url=%2Fdalat.jpg&w=1920&q=75 1920w,\n        /_next/image?url=%2Fdalat.jpg&w=2048&q=75 2048w,\n        /_next/image?url=%2Fdalat.jpg&w=3840&q=75 3840w\"\n$ curl -s http://127.0.0.1:19326/anh/tat | grep -o '<link rel=\"preload\" as=\"image\"' | wc -l | sed 's/^ */anh\\/tat · <link rel=preload as=image>: /'; curl -s http://127.0.0.1:19326/anh/mot | grep -o '<link rel=\"preload\" as=\"image\"' | wc -l | sed 's/^ */anh\\/mot · <link rel=preload as=image>: /'\nanh/tat · <link rel=preload as=image>: 12\nanh/mot · <link rel=preload as=image>: 1",
 "n18-2:toiuu": "$ for i in 1 2; do curl -s -o /dev/null -w '…' \"localhost:3000/_next/image?url=/dalat.jpg&w=750&q=75\" -H 'accept: image/webp'; done\n200 · 37374 B · 0.175936s · image/webp · X-Nextjs-Cache: MISS\n200 · 37374 B · 0.011407s · image/webp · X-Nextjs-Cache: HIT\n$ curl -s -o /dev/null -w \"%{http_code} · %{size_download} B\\n\" \"http://127.0.0.1:19326/_next/image?url=%2Fdalat.jpg&w=750&q=75\" -H 'accept: image/avif,image/webp,*/*'; curl -s -o /dev/null -w \"%{http_code} · %{content_type}\\n\" \"http://127.0.0.1:19326/_next/image?url=%2Fdalat.jpg&w=750&q=75\" -H 'accept: image/avif,*/*'\n200 · 37374 B\n200 · image/jpeg",
 "n18-2:chan": "$ curl -s -w \" · HTTP %{http_code}\\n\" \"http://127.0.0.1:19326/_next/image?url=https%3A%2F%2Fevil.example%2Fx.png&w=750&q=75\"\n\"url\" parameter is not allowed · HTTP 400\n$ curl -s -w \" · HTTP %{http_code}\\n\" \"http://127.0.0.1:19326/_next/image?url=%2Fdalat.jpg&w=751&q=75\"\n\"w\" parameter (width) of 751 is not allowed · HTTP 400\n$ curl -s -w \" · HTTP %{http_code}\\n\" \"http://127.0.0.1:19326/_next/image?url=%2Fdalat.jpg&w=750&q=100\"\n\"q\" parameter (quality) of 100 is not allowed · HTTP 400",
 "n18-2:dung": "",
 "n18-2:file:src/app/anh/xa/page.tsx": "// app/anh/xa/page.tsx — a photo from ANOTHER host, without images.remotePatterns\nimport Image from 'next/image';\nexport default function Page() {\n  return <Image src=\"https://images.unsplash.com/photo-1528127269322-539801943592\" alt=\"Ha Long\" width={1200} height={800} />;\n}\n",
 "n18-2:xa": "$ npm run build 2>&1 | grep -E 'Compiled|/anh/xa|rror' | sed 's/^[┌├└] //'\n✓ Compiled successfully in 498ms\n○ /anh/xa\n$ curl -s http://127.0.0.1:19326/anh/xa | grep -o 'src=\"/_next/image[^\"]*\"' | head -1\nsrc=\"/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1528127269322-539801943592&amp;w=3840&amp;q=75\"\n$ curl -s -w \" · HTTP %{http_code}\\n\" \"http://127.0.0.1:19326/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1528127269322-539801943592&w=3840&q=75\"\n\"url\" parameter is not allowed · HTTP 400\n$ curl -s --retry 30 --retry-connrefused --retry-delay 1 -o /dev/null -w 'next dev /anh/xa → HTTP %{http_code}\\n' http://127.0.0.1:19327/anh/xa\nnext dev /anh/xa → HTTP 500\n$ grep -o 'Invalid src prop[^,]*,[^`]*' <log next dev>\nInvalid src prop (https://images.unsplash.com/photo-1528127269322-539801943592) on `next/image`, hostname \"images.unsplash.com\" is not configured under images in your `next.config.js`",
 "n18-2:kho": "$ grep -n \"unoptimized\" next.config.js\n39:    unoptimized: true,\n63:    // the user picks a song. `unoptimized: true` above already\n$ grep -rln \"next/image\" src | wc -l | sed 's/^ */tệp import next\\/image: /'\ntệp import next/image: 31\n$ curl -s https://cuongthai.com/ -A Mozilla/5.0 | grep -o '/_next/image' | wc -l | sed 's/^ */cuongthai.com: số lần \\/_next\\/image trong HTML: /'\ncuongthai.com: số lần /_next/image trong HTML: 0\n$ curl -s https://cuongthai.com/ -A Mozilla/5.0 | grep -o '<img[^>]*data-nimg[^>]*>' | grep -o 'src=\"[^\"]*\"' | head -2 | sed 's/^/<Image> (data-nimg) ⇒ /'\n<Image> (data-nimg) ⇒ src=\"/playground/social/share-image.png\"",
 "anh-nxj-18-2:img": {
  "url": "http://localhost:19326/anh/img",
  "vp": [
   640,
   400
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19326/anh/img",
    "ma": 200,
    "loai": "document",
    "kt": 7628
   },
   {
    "url": "http://localhost:19326/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/3a6lpaobvrenx.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14732
   },
   {
    "url": "http://localhost:19326/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19326/dalat.jpg",
    "ma": 200,
    "loai": "image",
    "kt": 4547569
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "img ⇒": "/dalat.jpg · image/jpeg · 4,441 KB · on screen 608×456 px"
  }
 },
 "anh-nxj-18-2:next": {
  "url": "http://localhost:19326/anh/next",
  "vp": [
   640,
   400
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19326/anh/next",
    "ma": 200,
    "loai": "document",
    "kt": 7991
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/3a6lpaobvrenx.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14732
   },
   {
    "url": "http://localhost:19326/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19326/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/0i9bfanyibmja.js",
    "ma": 200,
    "loai": "script",
    "kt": 15725
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fdalat.jpg&w=3840&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 710784
   }
  ],
  "console": [],
  "ketQua": {
   "next ⇒": "/_next/image?url=/dalat.jpg&w=3840&q=75 · image/webp · 694 KB · on screen 608×456 px"
  }
 },
 "anh-nxj-18-2:sizes": {
  "url": "http://localhost:19326/anh/sizes",
  "vp": [
   640,
   400
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19326/anh/sizes",
    "ma": 200,
    "loai": "document",
    "kt": 8475
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/3a6lpaobvrenx.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14732
   },
   {
    "url": "http://localhost:19326/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19326/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/0i9bfanyibmja.js",
    "ma": 200,
    "loai": "script",
    "kt": 15725
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fdalat.jpg&w=1920&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 195334
   }
  ],
  "console": [],
  "ketQua": {
   "sizes ⇒": "/_next/image?url=/dalat.jpg&w=1920&q=75 · image/webp · 191 KB · on screen 608×456 px"
  }
 },
 "anh-nxj-18-2:nhieu": {
  "url": "http://localhost:19326/anh/nhieu",
  "vp": [
   640,
   800
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19326/anh/nhieu",
    "ma": 200,
    "loai": "document",
    "kt": 13839
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/3a6lpaobvrenx.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14732
   },
   {
    "url": "http://localhost:19326/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19326/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/0i9bfanyibmja.js",
    "ma": 200,
    "loai": "script",
    "kt": 15725
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp1.jpg&w=640&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 29170
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp3.jpg&w=640&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 29170
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp2.jpg&w=640&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 29170
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp5.jpg&w=640&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 29170
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp6.jpg&w=640&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 29170
   }
  ],
  "console": [],
  "ketQua": {
   "nhieu ⇒ at load": "3 photo requests · 85 KB",
   "nhieu ⇒ after scrolling to the end": "5 photo requests · 142 KB"
  }
 },
 "anh-nxj-18-2:nhieu-img": {
  "url": "http://localhost:19326/anh/nhieu-img",
  "vp": [
   640,
   800
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19326/anh/nhieu-img",
    "ma": 200,
    "loai": "document",
    "kt": 10282
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/3a6lpaobvrenx.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14732
   },
   {
    "url": "http://localhost:19326/p1.jpg",
    "ma": 200,
    "loai": "image",
    "kt": 4547569
   },
   {
    "url": "http://localhost:19326/p2.jpg",
    "ma": 200,
    "loai": "image",
    "kt": 4547569
   },
   {
    "url": "http://localhost:19326/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19326/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19326/p3.jpg",
    "ma": 200,
    "loai": "image",
    "kt": 4547569
   },
   {
    "url": "http://localhost:19326/p5.jpg",
    "ma": 200,
    "loai": "image",
    "kt": 4547569
   },
   {
    "url": "http://localhost:19326/p6.jpg",
    "ma": 200,
    "loai": "image",
    "kt": 4547569
   },
   {
    "url": "http://localhost:19326/p4.jpg",
    "ma": 200,
    "loai": "image",
    "kt": 4547569
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "nhieu-img ⇒ at load": "6 photo requests · 26,646 KB"
  }
 },
 "anh-nxj-18-2:mot": {
  "url": "http://localhost:19326/anh/mot",
  "vp": [
   1280,
   800
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19326/anh/mot",
    "ma": 200,
    "loai": "document",
    "kt": 19405
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/3a6lpaobvrenx.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14732
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp1.jpg&w=1920&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 195334
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19326/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19326/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/0i9bfanyibmja.js",
    "ma": 200,
    "loai": "script",
    "kt": 15725
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp2.jpg&w=1920&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 195334
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp3.jpg&w=1920&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 195334
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "mot ⇒ preload 1 · slow 4G": "hero downloaded at 3,768 ms · 2 other images sharing the line (382 KB)"
  }
 },
 "anh-nxj-18-2:tat": {
  "url": "http://localhost:19326/anh/tat",
  "vp": [
   1280,
   800
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19326/anh/tat",
    "ma": 200,
    "loai": "document",
    "kt": 24643
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/3a6lpaobvrenx.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14732
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp1.jpg&w=1920&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 195334
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp2.jpg&w=1920&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 195334
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp3.jpg&w=1920&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 195334
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp4.jpg&w=1920&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 195334
   },
   {
    "url": "http://localhost:19326/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19326/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp5.jpg&w=1920&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 195334
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp6.jpg&w=1920&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 195334
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp7.jpg&w=1920&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 195334
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp8.jpg&w=1920&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 195334
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp9.jpg&w=1920&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 195334
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp10.jpg&w=1920&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 195334
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/0i9bfanyibmja.js",
    "ma": 200,
    "loai": "script",
    "kt": 15725
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp11.jpg&w=1920&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 195334
   },
   {
    "url": "http://localhost:19326/_next/image?url=%2Fp12.jpg&w=1920&q=75",
    "ma": 200,
    "loai": "image",
    "kt": 195334
   }
  ],
  "console": [],
  "ketQua": {
   "tat ⇒ preload 12 · slow 4G": "hero downloaded at 5,824 ms · 11 other images sharing the line (2,098 KB)"
  }
 },
 "anh-nxj-18-2:xa": {
  "url": "http://localhost:19326/anh/xa",
  "vp": [
   640,
   300
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19326/anh/xa",
    "ma": 200,
    "loai": "document",
    "kt": 8039
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/3a6lpaobvrenx.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14732
   },
   {
    "url": "http://localhost:19326/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19326/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/0i9bfanyibmja.js",
    "ma": 200,
    "loai": "script",
    "kt": 15725
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19326/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1528127269322-539801943592&w=3840&q=75",
    "ma": 400,
    "loai": "image",
    "kt": 30
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19326/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 400 (Bad Request)"
   }
  ]
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, icards, meter, thucTe4 } from './_nxj-chung.mjs';

// ── số đo (n18-2 · lab c18 · Next.js 16.4.6 · next start 19326 / next dev 19327 · Chromium 640×400 DPR 2 · CDP slow 4G 150 ms / 1638 Kbps)
export const deck = { key: 'nxj-18-2', code: 'NXJ 18.2', title: 'The Image component', sub: 'Chapter 18 · Lesson 18.2' };
const O = (k) => { const v = DU_LIEU[`n18-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-18-2:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const kq = (k) => Object.values(AN(k).ketQua);
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (khoi, dau) => { const l = O(khoi).split('\n'); const i = l.findIndex((x) => x.startsWith('$ ') && x.includes(dau)); if (i < 0) throw new Error('thiếu lệnh ' + dau); const r = []; for (let j = i + 1; j < l.length && !l[j].startsWith('$ '); j++) r.push(l[j]); return r; };
const so = (s, re) => +s.match(re)[1].replace(/,/g, '');
const KBn = (s) => so(s, /· ([\d,]+) KB ·/);
const IMG = kq('img')[0], NEXT = kq('next')[0], SIZ = kq('sizes')[0];
const W_ = (s) => so(s, /w=(\d+)/);
const [NH0, NH1] = kq('nhieu'), [NI0] = kq('nhieu-img');
const MOT = kq('mot')[0], TAT = kq('tat')[0];
const HERO = (s) => so(s, /hero downloaded at ([\d,]+) ms/), CUNG = (s) => so(s, /(\d+) other images/), CUNGKB = (s) => so(s, /\(([\d,]+) KB\)/);
const SRC_NEXT = doan('lab', 'anh/next |'), SRC_SIZ = doan('lab', 'anh/sizes |');
const PRE = doan('lab', 'anh/tat |');
const MISS = doan('toiuu', 'for i in 1 2'), AVIF = doan('toiuu', 'image/avif,image/webp');
const CHAN = O('chan').split('\n');
const XA_B = doan('xa', 'npm run build'), XA_SRC = doan('xa', 'anh/xa |'), XA_400 = doan('xa', 'images.unsplash.com%2Fphoto'), XA_DEV = doan('xa', 'next dev /anh/xa'), XA_LOG = doan('xa', 'Invalid src prop');
const KHO = O('kho').split('\n');
const K = (n) => n.toLocaleString('en-US');
if (!/sizes="\(max-width: 672px\) 100vw, 672px"/.test(O('file:src/app/anh/sizes/page.tsx')) || !/preload=\{i === 0\}/.test(O('file:src/app/anh/mot/page.tsx'))) throw new Error('mã lab đổi');
const H_SWAP = "// before — a plain <img>\n<img src=\"/dalat.jpg\" alt=\"Da Lat\"\n     width={4000} height={3000} />\n\n// after — one import, one tag\nimport Image from 'next/image';\n<Image src=\"/dalat.jpg\" alt=\"Da Lat\"\n       width={4000} height={3000}\n       sizes=\"(max-width: 672px) 100vw, 672px\" />";
const H_XA = "// app/anh/xa/page.tsx — another host, no config\n<Image src=\"https://images.unsplash.com/photo-…\"\n       alt=\"Ha Long\" width={1200} height={800} />\n\n// next.config.ts — the fix\nimages: {\n  remotePatterns: [\n    { protocol: 'https', hostname: 'images.unsplash.com' },\n  ],\n}";
const H_PRE = "// Next.js 16: `priority` is deprecated → `preload`\n<Image src=\"/hero.jpg\" … preload />   // the ONE LCP image\n\n// node_modules/next/…/get-img-props.d.ts\n/** @deprecated Use `preload` prop instead. */\npriority?: boolean;";

export const S = [
  { cover: true, nhan: 'Chapter 18 · Lesson 18.2', t: 'The Image component:<br>fast pictures<br>(almost) for free', sub: 'The camera photo from 18.1, served three ways on a phone — and the one prop that decides whether the savings happen',
    en: 'Lesson eighteen point two: the Image component, fast pictures almost for free. The camera photo from the last lesson, served three ways on a phone, and the one prop that decides whether the savings happen.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Same photo on a phone: <code>&lt;img&gt;</code> <b>${K(KBn(IMG))} KB</b> · <code>&lt;Image&gt;</code> <b>${K(KBn(NEXT))} KB</b> · <code>&lt;Image sizes&gt;</code> <b>${K(KBn(SIZ))} KB</b></li>
    <li>Without <code>sizes</code>, a wide image gets <b>one</b> candidate: w=${W_(NEXT)}</li>
    <li>WebP by default — AVIF only if you turn it on; lazy loading below the fold</li>
    <li>Next.js 16: <code>priority</code> is deprecated — <code>preload</code>, on <b>one</b> image</li>
    <li>A remote host without <code>remotePatterns</code>: error in dev, a <b>silent 400</b> in production</li></ul>`,
    en: `Five takeaways. The same photo on a phone: a plain img sends ${K(KBn(IMG))} kilobytes; the Image component ${K(KBn(NEXT))}; with sizes, ${K(KBn(SIZ))}. Without sizes a wide image gets one candidate. WebP by default. preload replaces priority. And a remote host without configuration fails silently in production.` },
  { t: 'One import, one tag', body: two(D(tsx(H_SWAP, { hl: [6, 7, 9] })), D(icards([
      ['gauge', 'Right-sized', 'A <code>srcset</code> of widths; the browser picks one for the screen — <b>if you tell it how wide</b> (<code>sizes</code>).'],
      ['cut', 'Modern format', 'Re-encoded to <b>WebP</b> on the server (AVIF only if configured).'],
      ['eye', 'Lazy by default', '<code>loading="lazy"</code>: far-below images wait until you scroll near.'],
      ['layers', 'No layout shift', '<code>width</code>/<code>height</code> give the aspect ratio, so space is reserved (CLS, 17.5).'],
    ], 1)), 'r46'),
    en: 'One import and one tag. The Image component gives four things: a set of sizes so the browser picks one, if you tell it how wide the image will be; WebP re-encoded on the server; lazy loading by default; and reserved space from width and height.' },
  { t: 'Measured: the same photo, three ways', body: two(D(meter([
      ['img tag · original JPEG', KBn(IMG), '#dc2626'], ['Image · no sizes', KBn(NEXT), '#ea580c'], ['Image + sizes', KBn(SIZ), '#16a34a'],
    ], { don: 'KB', w: 560, nhan: 230, fs: 16 }), tn([`img   ⇒ ${IMG}`, `next  ⇒ ${NEXT}`, `sizes ⇒ ${SIZ}`].join('\n'), { fs: 13, wrap: 62, title: 'Chromium 640×400 · DPR 2 · Resource Timing (real)' })),
    D(br('nxj-18-2', 'sizes', { url: 'localhost:3000/anh/sizes', vp: 640, h: 400, w: 470 }),
      box('Same pixels on screen', `All three show the photo at 608 × 456 CSS px. Bytes: ${K(KBn(IMG))} → ${K(KBn(SIZ))} KB, about ${Math.round((1 - KBn(SIZ) / KBn(IMG)) * 100)}% less — with <code>sizes</code>.`, 'lam')), 'r64'),
    en: `Measured on a phone-sized screen with a pixel ratio of two. The plain img downloads the original JPEG: ${K(KBn(IMG))} kilobytes. The Image component without sizes: a WebP of ${K(KBn(NEXT))}. With sizes: ${K(KBn(SIZ))}. Same picture on screen, about ${Math.round((1 - KBn(SIZ) / KBn(IMG)) * 100)} percent fewer bytes.` },
  { t: 'The trap: no sizes = one huge candidate', to: true, body: two(D(tn(['$ curl …/anh/next | grep srcSet', ...SRC_NEXT].join('\n'), { fs: 14, wrap: 64, title: '<Image width={4000}> without sizes (real HTML)' }),
      tn(['$ curl …/anh/sizes | grep srcSet', ...SRC_SIZ].join('\n'), { fs: 13, wrap: 64, title: 'with sizes (real HTML)' })),
    D(box('width/height are the file, not the screen', `Without <code>sizes</code>, Next.js assumes the image is shown at its <code>width</code> (4000 px) and offers only 1x/2x candidates — capped at 3840. The phone downloads w=${W_(NEXT)}.`, 'do2'),
      box('sizes = “how wide on screen?”', `<code>(max-width: 672px) 100vw, 672px</code>: full width on small screens, 672 px otherwise. Now there are 8 candidates and the phone (608 px × DPR 2) picks w=${W_(SIZ)}.`, 'lam')), 'r64'),
    en: `The trap. Width and height describe the file, not the screen. Without sizes, Next.js offers a single candidate, the three thousand eight hundred and forty pixel version. With sizes, it offers eight widths, and the phone picks ${W_(SIZ)}.` },
  { t: 'What the server does: resize, re-encode, cache', body: two(D(tn(['$ for i in 1 2; do curl "/_next/image?url=/dalat.jpg&w=750&q=75" -H "accept: image/webp"; done', ...MISS, '$ curl … -H "accept: image/avif,image/webp,*/*"', AVIF[0], '$ curl … -H "accept: image/avif,*/*"', AVIF[1]].join('\n'), { fs: 13, wrap: 66, title: 'the optimizer, real responses' })),
    D(box('First request does the work', 'MISS: resize 4000 → 750 px with sharp and encode WebP; the result is cached on disk (<code>.next/cache/images</code>). HIT: served from the cache in milliseconds.', 'lam'),
      box('AVIF is not on by default', 'Next.js 16 defaults to <code>formats: [\'image/webp\']</code>. A browser that asks only for AVIF gets the original JPEG back. To serve AVIF: <code>images.formats: [\'image/avif\', \'image/webp\']</code>.', 'do2')), 'r64'),
    en: 'What the server does. The first request resizes and re-encodes to WebP, then caches the result: a miss, then a hit in milliseconds. AVIF is not on by default: a browser asking only for AVIF gets the original JPEG. Turn it on in images formats.' },
  { t: 'Lazy loading: only what is near the screen', body: two(D(meter([
      ['img tag × 6 · at load', so(NI0, /· ([\d,]+) KB/), '#dc2626'], ['Image × 6 · at load', so(NH0, /· ([\d,]+) KB/), '#16a34a'], ['Image × 6 · after scrolling', so(NH1, /· ([\d,]+) KB/), '#0070f3'],
    ], { don: 'KB', w: 560, nhan: 240, fs: 16 }), tn([`nhieu-img ⇒ ${NI0}`, `nhieu     ⇒ ${NH0}`, `nhieu     ⇒ ${NH1} (after scrolling to the end)`].join('\n'), { fs: 13, wrap: 64, title: 'six photos down a long page (real)' })),
    D(box('“Lazy” is not “only visible”', 'Chrome starts lazy images a little <b>before</b> they reach the screen (a distance threshold), so the next one is ready when you scroll. Jumping straight to the end skips the ones in between.', 'lam'),
      box('Never lazy-load the hero', 'The image at the top is the LCP element — it should start immediately. That is what <code>preload</code> is for.', 'do2')), 'r64'),
    en: `Lazy loading. Six photos down a long page: plain img tags downloaded all six at load, ${K(so(NI0, /· ([\d,]+) KB/))} kilobytes. The Image component downloaded only the ones near the screen. Lazy is not only visible: Chrome starts slightly ahead.` },
  { t: 'preload (was priority): one image, not twelve', to: true, body: two(D(tsx(H_PRE, { hl: [2, 5] }), tn([...PRE, `mot ⇒ ${MOT}`, `tat ⇒ ${TAT}`].join('\n'), { fs: 13, wrap: 64, title: 'slow 4G (CDP 150 ms · 1.6 Mbps) — real' })),
    D(meter([['preload on the hero only', HERO(MOT), '#16a34a'], ['preload on all 12', HERO(TAT), '#dc2626']], { don: 'ms', w: 440, nhan: 200, fs: 16 }),
      box('Why more is slower', `Twelve preloads = ${CUNG(TAT)} other images (${K(CUNGKB(TAT))} KB) share the slow line with the hero, instead of ${CUNG(MOT)} (${K(CUNGKB(MOT))} KB). The hero — your LCP — arrives ${K(HERO(TAT) - HERO(MOT))} ms later.`, 'do2'),
      box('Which one is “the one”?', 'The LCP element: Lighthouse names it (“Largest Contentful Paint element”), and DevTools → Performance marks it. Usually the hero photo at the top.', 'lam')), 'r46'),
    en: `preload, formerly priority. Next.js sixteen deprecates priority in favour of preload. Measured on slow 4G: preload on the hero only, the hero arrived at ${K(HERO(MOT))} milliseconds. Preload on all twelve: ${K(HERO(TAT))}. Twelve images share the line with your LCP.` },
  { t: 'A photo from another host', body: two(D(tsx(H_XA, { hl: [2, 7, 8], sm: true })),
      D(box('Production fails silently', 'The build is green and the page is ○ static. In the browser the image request gets <b>400</b> and shows a broken icon. Only <code>next dev</code> shows the clear “hostname is not configured” error — so test remote images in dev.', 'do2')), '')
      + tn(['$ npm run build', ...XA_B, '$ next start · curl /anh/xa', ...XA_SRC.map((l) => l.replace(/&amp;/g, '&')), ...XA_400, '$ next dev · curl /anh/xa', ...XA_DEV, ...XA_LOG].join('\n'), { fs: 13, wrap: 118, title: 'production vs dev (real)' }),
    en: 'A photo from another host without remotePatterns. Production: the build is green, the page is static, and the image request gets a four hundred, a broken image with no error anywhere. Only the dev server shows the clear message: hostname is not configured.' },
  { t: 'The guard rails — and why they exist', body: two(D(tn(CHAN.join('\n'), { fs: 14, wrap: 64, title: 'curl /_next/image with values Next.js did not offer (real)' })),
    D(box('Not an open proxy', 'Without <code>remotePatterns</code>, your server would download and resize <b>any</b> URL on the internet for anyone — free bandwidth and CPU for an attacker, and a way to reach hosts behind your firewall.', 'do2'),
      box('Not a CPU furnace', `Only widths from <code>deviceSizes</code>/<code>imageSizes</code> and qualities in <code>qualities</code> (default <b>[75]</b>) are accepted. Otherwise an attacker could ask for w=1, 2, 3 … each a fresh resize (a MISS cost ${Math.round(+MISS[0].match(/([\d.]+)s/)[1] * 1000)} ms here).`, 'lam')), 'r46'),
    en: 'The guard rails. A URL not allowed, a width that was not offered, a quality not in the list: all four hundred. Without them your server would be an open image proxy, and an attacker could request endless widths, each a fresh resize that costs CPU.' },
  { t: 'cuongthai.com: Image without the optimizer', body: two(D(tn(KHO.join('\n'), { fs: 14, wrap: 64, title: 'frontend/ + cuongthai.com (real)' })),
    D(box('unoptimized: true', 'Set in <code>next.config.js</code> since 09/06/2026. Every <code>&lt;Image&gt;</code> on the site renders a plain <code>&lt;img&gt;</code> to the original file: you keep reserved space and lazy loading, but get <b>no resizing and no WebP</b>.', 'do2'),
      box('Why would anyone turn it off?', 'The commit does not say. Common reasons: images already live on a CDN (here R2), and resizing on a small server costs CPU and disk. The usual alternatives: resize once at upload time, or use a CDN image service via a custom <code>loader</code>.', 'lam')), 'r64'),
    en: 'cuongthai.com sets unoptimized true. Thirty-one files import next image, but the home page HTML contains zero optimizer URLs: you keep reserved space and lazy loading, but no resizing and no WebP. Why turn it off? The commit does not say; resizing on a small server costs CPU, so the alternatives are resizing at upload time or a CDN image service.' },
  { t: 'Not learning in a vacuum: real life, what if, the attacker', to: true, body: thucTe4({
      doi: ['📱', 'Zalo / Facebook already do this', ['you send a 4 MB photo, they deliver a small one', 'your site should too: same idea, Image + sizes']],
      neu: ['❓', 'What if you forget sizes?', [`the phone still downloads w=${W_(NEXT)}`, `${K(KBn(NEXT))} KB instead of ${K(KBn(SIZ))} KB — no error, no warning`]],
      xau: ['🕵️', 'An open image proxy', ['resize any URL, any width, for free', 'Next.js blocks it: url / w / q → 400']],
      phong: ['🛡️', 'Configure, then look', ['remotePatterns tight; sizes on every wide image', 'DevTools: check which w= the phone picked']],
    }),
    en: 'Real life: chat apps already shrink the photos you send; your site should too. What if you forget sizes? The phone still downloads the biggest version, with no warning. An attacker would love an open image proxy; Next.js blocks it with four hundreds. Configure tightly, then look in DevTools.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('next/image', '&lt;Image&gt; — resize, re-encode, lazy'), kw('srcset', 'candidate widths'), kw('sizes', 'how wide on screen'), kw('/_next/image', 'the optimizer endpoint'),
      kw('WebP / AVIF', 'WebP default · AVIF opt-in'), kw('Lazy loading', 'load when near the screen'), kw('preload', 'was priority — the ONE LCP image'), kw('remotePatterns', 'allow-list of hosts'),
      kw('unoptimized', 'plain img, no resizing'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: next image; srcset; sizes; the optimizer endpoint; WebP and AVIF; lazy loading; preload, formerly priority; remotePatterns; and unoptimized.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Put a camera photo in ${c('public/')}; show it with ${c('<img>')}, then ${c('<Image>')} without ${c('sizes')}`,
      `DevTools (phone mode): read which ${c('w=')} was downloaded and its size`,
      `Add ${c('sizes')}; measure again. Then mark the hero ${c('preload')}`,
      `Try a remote URL without ${c('remotePatterns')} in dev and in a build`,
    ]), box('Keep these', `<ul><li>Image + <b>sizes</b> on wide images</li><li>WebP by default, AVIF opt-in</li><li>preload on one image</li><li>remotePatterns tight — test in dev</li></ul>`, 'lam'), ''),
    en: 'Your turn: show a camera photo with img, then with Image without sizes, and read which width was downloaded. Add sizes and measure again; mark the hero as preload. Then try a remote URL without configuration, in dev and in a build.' },
];
export const slides = lamDeck({ chuong: 'Chapter 18 — Performance: images, JavaScript and fonts', bai: '18.2' }, S);
