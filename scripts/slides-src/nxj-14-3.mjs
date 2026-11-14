/*DU_LIEU*/
const DU_LIEU = {
 "n14-3:file:src/app/q-bai/page.tsx": "'use client';\n// app/q-bai/page.tsx — đoạn mã của bài, chép nguyên (+ export default)\nimport { useQuery } from '@tanstack/react-query';\n\nexport default function Posts() {\n  const { data, isLoading, error } = useQuery({\n    queryKey: ['posts'],\n    queryFn: () => fetch('/api/posts').then(r => r.json()),\n  });\n  if (isLoading) return <Spinner />;\n  if (error) return <p>Failed to load</p>;\n  return <List items={data} />;\n}\n",
 "n14-3:bai": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit\nsrc/app/q-bai/page.tsx(10,26): error TS2304: Cannot find name 'Spinner'.\nsrc/app/q-bai/page.tsx(12,11): error TS2304: Cannot find name 'List'.\n$ thay <Spinner /> bằng <p>Đang tải…</p>, <List items={data} /> bằng một <ul> — rồi build\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|q-bai|QueryClient|Error occurred|Export encountered' | head -6\n✓ Compiled successfully in 4.2s\nError occurred prerendering page \"/q-bai\". Read more: https://nextjs.org/docs/messages/prerender-error\nError: No QueryClient set, use QueryClientProvider to set one\nExport encountered an error on /q-bai/page: /q-bai, exiting the build.",
 "n14-3:file:src/app/q/Providers.tsx": "'use client';\n// app/q/Providers.tsx — MỘT QueryClient cho mỗi tab trình duyệt (useState giữ nó qua mọi lần render)\nimport { QueryClient, QueryClientProvider } from '@tanstack/react-query';\nimport { useState } from 'react';\n\nexport function Providers({ children }: { children: React.ReactNode }) {\n  const [qc] = useState(() => new QueryClient());\n  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;\n}\n",
 "n14-3:file:src/app/q/layout.tsx": "import { Providers } from './Providers';\nexport default function Layout({ children }: LayoutProps<'/q'>) {\n  return <Providers>{children}</Providers>;\n}\n",
 "n14-3:file:src/app/q/usePosts.ts": "'use client';\n// app/q/usePosts.ts — một hook dùng chung: cùng queryKey ⇒ cùng một mục cache\nimport { useQuery } from '@tanstack/react-query';\nimport type { Post } from '@/lib/kho';\n\nexport const usePosts = (staleTime = 0) =>\n  useQuery({\n    queryKey: ['posts'],\n    queryFn: (): Promise<Post[]> => fetch('/api/posts').then((r) => r.json()),\n    staleTime,\n  });\n",
 "n14-3:file:src/app/q/hai/page.tsx": "'use client';\n// app/q/hai/page.tsx — HAI component cùng hỏi ['posts'] (như /sai của bài 14.1)\nimport { usePosts } from '../usePosts';\n\nfunction DemBai() {\n  const { data } = usePosts();\n  return <p id=\"dem\" className=\"font-bold\">{data?.length ?? '…'} bài</p>;\n}\nfunction DanhSach() {\n  const { data, isLoading } = usePosts();\n  if (isLoading) return <p>Đang tải…</p>;\n  return <ul id=\"ds\">{data!.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;\n}\nexport default function Trang() {\n  return <main className=\"p-4 text-lg\"><DemBai /><DanhSach /></main>;\n}\n",
 "n14-3:file:src/app/q/a/page.tsx": "'use client';\n// app/q/a/page.tsx — staleTime mặc định 0\nimport Link from 'next/link';\nimport { usePosts } from '../usePosts';\n\nexport default function A() {\n  const { data, isLoading, isFetching } = usePosts(0);\n  return (\n    <main className=\"p-4 text-lg\">\n      <p id=\"tt\">{isLoading ? 'Đang tải…' : isFetching ? `${data!.length} bài · đang tải lại nền` : `${data!.length} bài`}</p>\n      <ul id=\"ds\">{data?.map((p) => <li key={p.id}>{p.title}</li>)}</ul>\n      <Link id=\"di\" href=\"/q/b\" className=\"underline\">sang trang B</Link>\n    </main>\n  );\n}\n",
 "n14-3:file:src/app/q/a60/page.tsx": "'use client';\n// app/q/a60/page.tsx — CÙNG trang, staleTime 60 giây\nimport Link from 'next/link';\nimport { usePosts } from '../usePosts';\n\nexport default function A60() {\n  const { data, isLoading, isFetching } = usePosts(60_000);\n  return (\n    <main className=\"p-4 text-lg\">\n      <p id=\"tt\">{isLoading ? 'Đang tải…' : isFetching ? `${data!.length} bài · đang tải lại nền` : `${data!.length} bài`}</p>\n      <ul id=\"ds\">{data?.map((p) => <li key={p.id}>{p.title}</li>)}</ul>\n      <Link id=\"di\" href=\"/q/b?ve=a60\" className=\"underline\">sang trang B</Link>\n    </main>\n  );\n}\n",
 "n14-3:file:src/app/q/b/page.tsx": "'use client';\nimport Link from 'next/link';\nimport { useSearchParams } from 'next/navigation';\nimport { Suspense } from 'react';\nfunction Ve() { const ve = useSearchParams().get('ve') ?? 'a'; return <Link id=\"ve\" href={`/q/${ve}`} className=\"underline\">về trang A</Link>; }\nexport default function B() {\n  return <main className=\"p-4 text-lg\"><p>Trang B</p><Suspense><Ve /></Suspense></main>;\n}\n",
 "n14-3:file:src/app/q/dua/page.tsx": "'use client';\n// app/q/dua/page.tsx — bài 1 trả chậm (1.500 ms), bài 2 trả nhanh (200 ms): bấm 1 rồi bấm 2 ngay\nimport { useEffect, useState } from 'react';\nimport { useQuery } from '@tanstack/react-query';\nimport type { Post } from '@/lib/kho';\n\nconst lay = (id: number): Promise<Post> => fetch(`/api/posts/${id}?ms=${id === 1 ? 1500 : 200}`).then((r) => r.json());\n\nfunction TayEffect({ id }: { id: number }) {                 // tự viết bằng useEffect, không dọn dẹp\n  const [post, setPost] = useState<Post | null>(null);\n  useEffect(() => { lay(id).then(setPost); }, [id]);\n  return <p id=\"effect\">useEffect: {post?.title ?? '…'}</p>;\n}\nfunction BangQuery({ id }: { id: number }) {                  // useQuery: khoá ['post', id]\n  const { data } = useQuery({ queryKey: ['post', id], queryFn: () => lay(id) });\n  return <p id=\"query\">useQuery: {data?.title ?? '…'}</p>;\n}\nexport default function Trang() {\n  const [id, setId] = useState(0);\n  return (\n    <main className=\"space-y-1 p-4 text-lg\">\n      <button id=\"b1\" onClick={() => setId(1)} className=\"mr-2 rounded border px-3\">Bài 1</button>\n      <button id=\"b2\" onClick={() => setId(2)} className=\"rounded border px-3\">Bài 2</button>\n      <p id=\"chon\">đang chọn: bài {id}</p>\n      {id > 0 && <><TayEffect id={id} /><BangQuery id={id} /></>}\n    </main>\n  );\n}\n",
 "n14-3:file:src/app/q/khoa/page.tsx": "'use client';\n// app/q/khoa/page.tsx — BẪY: query key chứa thứ MỚI mỗi lần render\nimport { useQuery } from '@tanstack/react-query';\nimport type { Post } from '@/lib/kho';\n\nexport default function Trang() {\n  const { data, status } = useQuery({\n    queryKey: ['posts', Date.now()],\n    queryFn: (): Promise<Post[]> => fetch('/api/posts?ms=100').then((r) => r.json()),\n  });\n  return <p id=\"tt\" className=\"p-4 text-lg\">{status} · {data?.length ?? '…'} bài</p>;\n}\n",
 "n14-3:file:src/app/q/dau/page.tsx": "// app/q/dau/page.tsx — Server Component đọc trang đầu; TanStack Query nhận nó làm initialData\nimport { kho } from '@/lib/kho';\nimport { DanhSach } from './DanhSach';\nexport const dynamic = 'force-dynamic';\nexport default function Trang() {\n  return <main className=\"p-4 text-lg\"><DanhSach dau={kho.posts} /></main>;\n}\n",
 "n14-3:file:src/app/q/dau/DanhSach.tsx": "'use client';\nimport { useQuery } from '@tanstack/react-query';\nimport type { Post } from '@/lib/kho';\n\nexport function DanhSach({ dau }: { dau: Post[] }) {\n  const { data } = useQuery({\n    queryKey: ['posts'],\n    queryFn: (): Promise<Post[]> => fetch('/api/posts').then((r) => r.json()),\n    initialData: dau,\n    staleTime: 30_000,                     // vừa lấy trên máy chủ ⇒ đừng tải lại ngay\n  });\n  return <ul id=\"ds\">{data.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;\n}\n",
 "n14-3:nap": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/q/'\n✓ Compiled successfully in 4.0s\n├ ○ /q/a\n├ ○ /q/a60\n├ ○ /q/b\n├ ƒ /q/dau\n├ ○ /q/dua\n├ ○ /q/hai\n└ ○ /q/khoa\n$ curl HTML đầu tiên: /q/hai (useQuery) và /q/dau (Server Component + initialData)\n/q/hai  · <li> trong HTML: 0 · Đang tải…\n/q/dau  · <li> trong HTML: 3 · \n$ Chromium: request /api/posts khi mở /q/hai (hai component) và /q/dau (initialData)\n/q/hai  · request /api/posts: 1 · 3 bài · 3 dòng\n/q/dau  · request /api/posts: 0 · 3 dòng\n$ Chromium: A → B → về A (đọc màn hình 30 ms sau khi bấm) · rồi tab ẩn → hiện lại · rồi tab khác thêm bài → hiện lại\nstaleTime 0\n   1 mở A                     3 bài · 3 dòng\n   1 mở A · request           1\n   2 về A sau 30 ms           3 bài · đang tải lại nền · 3 dòng\n   3 về A sau 930 ms          3 bài · 3 dòng\n   3 về A · request           2\n   4 tab ẩn → hiện · request  3\n   5 tab khác thêm → hiện     4 bài · 4 dòng\n   5 · request                4\nstaleTime 60 s\n   1 mở A                     3 bài · 3 dòng\n   1 mở A · request           1\n   2 về A sau 30 ms           3 bài · 3 dòng\n   3 về A sau 930 ms          3 bài · 3 dòng\n   3 về A · request           1\n   4 tab ẩn → hiện · request  1\n   5 tab khác thêm → hiện     3 bài · 3 dòng\n   5 · request                1\n$ Chromium /q/dua: bấm Bài 1 (chậm 1.500 ms) rồi Bài 2 (nhanh 200 ms) ngay sau đó, chờ 2,5 s\n0,4 s      useEffect: Server Component · useQuery: …\n2,5 s      useEffect: Học Next.js · useQuery: Server Component\n$ Chromium /q/khoa: queryKey ['posts', Date.now()] — mở trang 3 giây\nrequest /api/posts trong 3 s: 34 · pending · … bài",
 "n14-3:kho": "$ sed -n '17,28p' src/lib/queryClient.ts\n  return new QueryClient({\n    defaultOptions: {\n      queries: {\n        staleTime: 5 * 60 * 1000,\n        gcTime: 30 * 60 * 1000,\n        retry: 2,\n        refetchOnWindowFocus: false,\n        refetchOnReconnect: true,\n      },\n      mutations: { retry: 1 },\n    },\n  });\n$ sed -n '34,38p' src/lib/queryClient.ts\n  if (typeof window === 'undefined') return makeClient(); // server: per-request\n  if (!browserClient) browserClient = makeClient();\n  return browserClient;\n}",
 "anh-nxj-14-3:hai": {
  "url": "http://127.0.0.1:19398/q/hai",
  "vp": [
   520,
   200
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19398/q/hai",
    "ma": 200,
    "loai": "document",
    "kt": 8479
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0br_nx9p6cta_.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15162
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0li7vzj18bfpo.js",
    "ma": 200,
    "loai": "script",
    "kt": 34200
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/2gw46a30fkv6-.js",
    "ma": 200,
    "loai": "script",
    "kt": 10662
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/2hvx0tpfqfzip.js",
    "ma": 200,
    "loai": "script",
    "kt": 15786
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1ih_xdjbzj5sn.js",
    "ma": 200,
    "loai": "script",
    "kt": 8717
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0izyfntsursrj.js",
    "ma": 200,
    "loai": "script",
    "kt": 164356
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   }
  ],
  "console": [],
  "ketQua": {
   "cuoi": "3 bài · 3 dòng"
  }
 },
 "anh-nxj-14-3:dau": {
  "url": "http://127.0.0.1:19398/q/dau",
  "vp": [
   520,
   160
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19398/q/dau",
    "ma": 200,
    "loai": "document",
    "kt": 8147
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0br_nx9p6cta_.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15162
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0li7vzj18bfpo.js",
    "ma": 200,
    "loai": "script",
    "kt": 34200
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/2gw46a30fkv6-.js",
    "ma": 200,
    "loai": "script",
    "kt": 10662
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/2hvx0tpfqfzip.js",
    "ma": 200,
    "loai": "script",
    "kt": 15786
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/2bqlg4lq8_suk.js",
    "ma": 200,
    "loai": "script",
    "kt": 8379
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0izyfntsursrj.js",
    "ma": 200,
    "loai": "script",
    "kt": 164356
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "cuoi": "3 dòng"
  }
 },
 "anh-nxj-14-3:di-ve30": {
  "url": "http://127.0.0.1:19398/q/a",
  "vp": [
   520,
   220
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-3:di": {
  "url": "http://127.0.0.1:19398/q/a",
  "vp": [
   520,
   220
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19398/q/a",
    "ma": 200,
    "loai": "document",
    "kt": 8755
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0br_nx9p6cta_.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15162
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0li7vzj18bfpo.js",
    "ma": 200,
    "loai": "script",
    "kt": 34200
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/2gw46a30fkv6-.js",
    "ma": 200,
    "loai": "script",
    "kt": 10662
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/2hvx0tpfqfzip.js",
    "ma": 200,
    "loai": "script",
    "kt": 15786
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0ow0czn9ky9_2.js",
    "ma": 200,
    "loai": "script",
    "kt": 623
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0izyfntsursrj.js",
    "ma": 200,
    "loai": "script",
    "kt": 164356
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/2mm6173nt5l4_.js",
    "ma": 200,
    "loai": "script",
    "kt": 15976
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/q/b?_rsc=vwEbqZXFGJmzX7N_",
    "ma": 200,
    "loai": "fetch",
    "kt": 480
   },
   {
    "url": "http://127.0.0.1:19398/q/b?_rsc=mtMrpCbIZC1kZn0S",
    "ma": 200,
    "loai": "fetch",
    "kt": 4210
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3zdwng07g5fef.js",
    "ma": 200,
    "loai": "script",
    "kt": 8314
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   },
   {
    "url": "http://127.0.0.1:19398/q/a?_rsc=9JeBDJKsubJXBK22",
    "ma": 200,
    "loai": "fetch",
    "kt": 480
   },
   {
    "url": "http://127.0.0.1:19398/q/a?_rsc=QJs4OwtYsYY0rwu0",
    "ma": 200,
    "loai": "fetch",
    "kt": 4346
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   }
  ],
  "console": [],
  "ketQua": {
   "1 mở A": "3 bài · 3 dòng",
   "1 mở A · request": 1,
   "2 về A sau 30 ms": "3 bài · đang tải lại nền · 3 dòng",
   "3 về A sau 930 ms": "3 bài · 3 dòng",
   "3 về A · request": 2,
   "4 tab ẩn → hiện · request": 3,
   "5 tab khác thêm → hiện": "4 bài · 4 dòng",
   "5 · request": 4
  }
 },
 "anh-nxj-14-3:di60-ve30": {
  "url": "http://127.0.0.1:19398/q/a60",
  "vp": [
   520,
   220
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-3:di60": {
  "url": "http://127.0.0.1:19398/q/a60",
  "vp": [
   520,
   220
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19398/q/a60",
    "ma": 200,
    "loai": "document",
    "kt": 8766
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0br_nx9p6cta_.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15162
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0li7vzj18bfpo.js",
    "ma": 200,
    "loai": "script",
    "kt": 34200
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/2gw46a30fkv6-.js",
    "ma": 200,
    "loai": "script",
    "kt": 10662
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/39f2mzcidv1g2.js",
    "ma": 200,
    "loai": "script",
    "kt": 632
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/2hvx0tpfqfzip.js",
    "ma": 200,
    "loai": "script",
    "kt": 15786
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0izyfntsursrj.js",
    "ma": 200,
    "loai": "script",
    "kt": 164356
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/2mm6173nt5l4_.js",
    "ma": 200,
    "loai": "script",
    "kt": 15976
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/q/b?ve=a60&_rsc=eaxW0cWC0pbA1PKp",
    "ma": 200,
    "loai": "fetch",
    "kt": 480
   },
   {
    "url": "http://127.0.0.1:19398/q/b?ve=a60&_rsc=hobSuiFy6SrJ6x7G",
    "ma": 200,
    "loai": "fetch",
    "kt": 4210
   },
   {
    "url": "http://127.0.0.1:19398/q/b?_rsc=eaxW0cWC0pbA1PKp",
    "ma": 200,
    "loai": "fetch",
    "kt": 480
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3zdwng07g5fef.js",
    "ma": 200,
    "loai": "script",
    "kt": 8314
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   },
   {
    "url": "http://127.0.0.1:19398/q/a60?_rsc=9JeBDJKsubJXBK22",
    "ma": 200,
    "loai": "fetch",
    "kt": 482
   },
   {
    "url": "http://127.0.0.1:19398/q/a60?_rsc=WtX4h0YC4aedQxKZ",
    "ma": 200,
    "loai": "fetch",
    "kt": 4348
   }
  ],
  "console": [],
  "ketQua": {
   "1 mở A": "3 bài · 3 dòng",
   "1 mở A · request": 1,
   "2 về A sau 30 ms": "3 bài · 3 dòng",
   "3 về A sau 930 ms": "3 bài · 3 dòng",
   "3 về A · request": 1,
   "4 tab ẩn → hiện · request": 1,
   "5 tab khác thêm → hiện": "3 bài · 3 dòng",
   "5 · request": 1
  }
 },
 "anh-nxj-14-3:dua-04": {
  "url": "http://127.0.0.1:19398/q/dua",
  "vp": [
   520,
   200
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-3:dua": {
  "url": "http://127.0.0.1:19398/q/dua",
  "vp": [
   520,
   200
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "0,4 s": "useEffect: Server Component · useQuery: …",
   "2,5 s": "useEffect: Học Next.js · useQuery: Server Component"
  }
 },
 "anh-nxj-14-3:khoa": {
  "url": "http://127.0.0.1:19398/q/khoa",
  "vp": [
   520,
   100
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19398/q/khoa",
    "ma": 200,
    "loai": "document",
    "kt": 8455
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0br_nx9p6cta_.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15162
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0li7vzj18bfpo.js",
    "ma": 200,
    "loai": "script",
    "kt": 34200
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/2gw46a30fkv6-.js",
    "ma": 200,
    "loai": "script",
    "kt": 10662
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0o7p37qc7kt3j.js",
    "ma": 200,
    "loai": "script",
    "kt": 8380
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/2hvx0tpfqfzip.js",
    "ma": 200,
    "loai": "script",
    "kt": 15786
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0izyfntsursrj.js",
    "ma": 200,
    "loai": "script",
    "kt": 164356
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   },
   {
    "url": "http://127.0.0.1:19398/api/posts?ms=100",
    "ma": 200,
    "loai": "fetch",
    "kt": 124
   }
  ],
  "console": [],
  "ketQua": {
   "tt": "pending · … bài"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-14-3', code: 'NXJ 14.3', title: 'Server state on the client with TanStack Query', sub: 'Chapter 14 · Lesson 14.3' };
const O = (k) => { const v = DU_LIEU[`n14-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-14-3:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ (app|lib)\//.test(l)).join('\n');
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-14-3', ten, { vp: 520, ...o });
const en = (s) => s.replace(/ bài/g, ' posts').replace(/ dòng/g, ' rows').replace('đang tải lại nền', 'refetching in background').replace('trong HTML', 'in HTML').replace('Đang tải…', '"Đang tải…" (loading)');

// ── số đo (n14-3 · Next.js 16.4.6 · @tanstack/react-query 5.107.1 · Chromium)
const TSC = doan('bai', 'npx next typegen'), BUILD = doan('bai', 'npm run build');
const ROUTES = doan('nap', 'npm run build'), HTML = doan('nap', 'curl HTML'), REQ = doan('nap', 'request /api/posts khi mở');
const DI = A('di').ketQua, DI60 = A('di60').ketQua, DUA = A('dua').ketQua, KH = doan('nap', '/q/khoa');
const KHO = O('kho');
if (!/TS2304: Cannot find name 'Spinner'/.test(TSC.join()) || !/No QueryClient set, use QueryClientProvider to set one/.test(BUILD.join('\n'))) throw new Error('bài đổi');
if (!/request \/api\/posts: 1 · 3 bài/.test(REQ[0]) || !/request \/api\/posts: 0 · 3 dòng/.test(REQ[1]) || !/<li> trong HTML: 0 · Đang tải…/.test(HTML[0]) || !/<li> trong HTML: 3/.test(HTML[1])) throw new Error('dedupe đổi');
if (!/đang tải lại nền/.test(DI['2 về A sau 30 ms']) || DI['3 về A · request'] !== 2 || DI['4 tab ẩn → hiện · request'] !== 3 || !/^4 bài/.test(DI['5 tab khác thêm → hiện'])) throw new Error('stale 0 đổi');
if (/đang tải lại/.test(DI60['2 về A sau 30 ms']) || DI60['5 · request'] !== 1 || !/^3 bài/.test(DI60['5 tab khác thêm → hiện'])) throw new Error('stale 60 đổi');
if (!/useEffect: Học Next.js · useQuery: Server Component/.test(DUA['2,5 s'])) throw new Error('đua đổi');
const nKhoa = Number(KH[0].match(/3 s: (\d+)/)[1]); if (!(nKhoa > 10) || !/pending/.test(KH[0])) throw new Error('khoá đổi');

const PROV = bo(F('src/app/q/Providers.tsx')).split('\n').filter((l) => l.trim() && !/^\/\/ app/.test(l)).join('\n').replace(/^\/\/ .*\n/m, '');
const HAI = bo(F('src/app/q/hai/page.tsx')).split('\n');
const HAI2 = HAI.slice(HAI.findIndex((l) => l.startsWith('function DemBai')), HAI.findIndex((l) => l.startsWith('export default'))).join('\n').trim().replace(' className="font-bold"', '').replace('return <ul id="ds">{data!.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;', 'return <ul id="ds">\n    {data!.map((p) => <li key={p.id}>{p.title}</li>)}\n  </ul>;');
const DUAF = bo(F('src/app/q/dua/page.tsx')).split('\n');
const DUA2 = [DUAF.find((l) => l.includes('useEffect(() =>')).trim(), DUAF.find((l) => l.includes("queryKey: ['post', id]")).trim()].join('\n').replace(/ +\/\/.*$/gm, '').replace('useEffect(() => { lay(id).then(setPost); }, [id]);', 'useEffect(() => {\n  lay(id).then(setPost);   // no cleanup\n}, [id]);').replace("const { data } = useQuery({ queryKey: ['post', id], queryFn: () => lay(id) });", "const { data } = useQuery({\n  queryKey: ['post', id],\n  queryFn: () => lay(id),\n});");
const KHF = bo(F('src/app/q/khoa/page.tsx')).split('\n').find((l) => l.includes('queryKey')).trim();
const DAUF = bo(F('src/app/q/dau/DanhSach.tsx')).split('\n');
const DAU2 = DAUF.slice(DAUF.findIndex((l) => l.includes('useQuery({')), DAUF.findIndex((l) => l.includes('});')) + 1).join('\n').replace('// vừa lấy trên máy chủ ⇒ đừng tải lại ngay', '// just fetched on the server');
const vi2 = (o) => Object.entries(o).filter(([k]) => !/request/.test(k)).map(([k, v]) => [k.replace(/^\d /, '').replace('mở A', 'open A').replace('về A sau', 'back to A after').replace('tab khác thêm → hiện', 'other tab adds, refocus'), en(v)]);
const rq = (o) => [o['1 mở A · request'], o['3 về A · request'], o['4 tab ẩn → hiện · request'], o['5 · request']];

export const S = [
  { cover: true, nhan: 'Chapter 14 · Lesson 14.3', t: 'Server state on the client<br>with TanStack Query', sub: 'One request for two components, cached data shown while it refetches, the race from Chapter 5 gone — and the query key that fires 34 requests in three seconds',
    en: 'Lesson fourteen point three: server state on the client with TanStack Query. One request for two components; cached data shown while it refetches; the race from earlier gone; and a query key that fires thirty-four requests in three seconds.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The lesson's code needs a <code>QueryClientProvider</code> — the build says so</li>
    <li>Same key ⇒ <b>one</b> request and one cache entry for every component</li>
    <li>Stale-while-revalidate: cached data at once, a refetch behind it — and <code>staleTime</code></li>
    <li>Refetch on focus, and the race that disappears with a key per id</li>
    <li>The unstable-key trap, and how it fits with Server Components (<code>initialData</code>)</li></ul>`,
    en: 'Five takeaways: the provider the lesson\'s code needs; one request per key for every component; stale-while-revalidate and staleTime; refetch on focus and the race that disappears; and the unstable-key trap, plus how a query meets a Server Component.' },
  { t: "The lesson's code — and what the build says", body: two(D(tsx(bo(F('src/app/q-bai/page.tsx').replace("// app/q-bai/page.tsx — đoạn mã của bài, chép nguyên (+ export default)\n", '')).replace('<p>Đang tải…</p>', '<Spinner />').replace(/<ul>\{\(data as .*<\/ul>/, '<List items={data} />'), { sm: true, hl: [9, 11] }), tn(['$ npx tsc --noEmit', ...TSC].join('\n'), { fs: 13, wrap: 60, title: 'tsc (real)' })),
    D(tn(['# Spinner and List replaced by plain elements, then:', '$ npm run build', ...BUILD].join('\n'), { fs: 13, wrap: 52, title: 'next build (real)' }),
      box('Read it', '<code>Spinner</code> and <code>List</code> are not defined anywhere — <code>TS2304</code>. Fix those and the <b>build</b> stops: the page is prerendered, <code>useQuery</code> runs, and there is no <code>QueryClient</code> above it.', 'do2')), 'r64'),
    en: 'The lesson\'s code, as written: Spinner and List are not defined, TS two three zero four. Replace them with plain elements and run the build: it stops while prerendering the page, No QueryClient set, use QueryClientProvider to set one.' },
  { t: 'The provider: one QueryClient per browser tab', body: two(D(tsx(PROV, { sm: true, hl: [5] }), tsx(bo(F('src/app/q/layout.tsx')), { sm: true }), tn(['$ npm run build', ...ROUTES.slice(0, 4), '…'].join('\n'), { fs: 14, wrap: 50, title: 'next build (real)' })),
    D(box('Why useState(() =&gt; new QueryClient())', 'The client is the cache. Created once per mount and kept across renders — not at module level, where on the server it would be shared by every request (the leak measured in 14.2).', 'xanh'),
      box('Why a separate file', '<code>QueryClientProvider</code> uses context, so it needs <code>\'use client\'</code>; the layout stays a Server Component and only wraps it.', 'lam')), ''),
    en: 'The provider. A QueryClient is the cache, so create it once per mount with useState, never at module level, where on the server one client would be shared by every request, the leak measured in fourteen point two. The provider file is a client component; the layout stays a Server Component.' },
  { t: 'Same key, one request — for every component', body: two(D(tsx(HAI2, { sm: true, hl: [2, 6] }), tn(['$ curl the first HTML', ...HTML, '# Chromium · requests to /api/posts', ...REQ].map((l) => en(l)).join('\n'), { fs: 13, wrap: 60, title: 'curl + Chromium (real)' })),
    D(B('hai', { url: 'localhost:3000/q/hai', h: 170, w: 420 }), box('Measured', 'The two components from 14.1 again, now both calling <code>usePosts()</code> with key <code>[\'posts\']</code>: <b>1</b> request (it was 2), one cache entry, and they cannot disagree.', 'xanh'),
      box('Still client-fetched', 'The first HTML has 0 rows and the loading text — the data arrives after JavaScript, as in 14.1.', 'do2')), ''),
    en: 'Same key, one request. The two components from fourteen point one, now both using the same query key: one request instead of two, one cache entry, so they cannot disagree. But it is still fetched on the client: the first HTML has zero rows and the loading text.' },
  { t: 'Stale-while-revalidate: cached at once, refetched behind it', body: two(D(B('di-ve30', { url: 'back to /q/a — 30 ms after the click', h: 150, w: 470 }), cmp(['Step', 'staleTime 0 (default)', 'staleTime 60 s'], vi2(DI).map(([k, v], i) => [k, v, vi2(DI60)[i][1]]).slice(0, 3))),
    D(tn(['# requests to /api/posts after: open · back to A · refocus · other tab + refocus', 'staleTime 0   ' + rq(DI).join(' → '), 'staleTime 60s ' + rq(DI60).join(' → ')].join('\n'), { fs: 14, wrap: 56, title: 'Chromium (real)' }),
      box('Read it', 'Back on A, the cached list is on screen <b>30 ms</b> after the click — no spinner — while a background refetch runs (<code>isFetching</code>). With <code>staleTime: 60_000</code> the data counts as fresh: shown, not refetched.', 'xanh')), ''),
    en: 'Stale-while-revalidate. Go to page B and back: thirty milliseconds after the click the cached list is already on screen, with no spinner, while a refetch runs behind it. With staleTime sixty seconds, the data counts as fresh: it is shown and not refetched at all.' },
  { t: 'Refetch on focus — the write from another tab, noticed', body: two(D(cmp(['After another tab adds a post, then refocus', 'shows'], [['staleTime 0', `<b>${en(DI['5 tab khác thêm → hiện'])}</b> ✓`], ['staleTime 60 s', en(DI60['5 tab khác thêm → hiện']) + ' (fresh by your rule)'], ['14.1, useState copies', '3 posts · 4 rows ✗ (nobody noticed)']]),
      tn(['# frontend/src/lib/queryClient.ts:17-28', ...KHO.split('\n').slice(1, 13)].join('\n'), { fs: 12, wrap: 56, title: 'cuongthai.com (real)' })),
    D(box('Measured', 'With the default <code>staleTime: 0</code>, hiding and showing the tab refetched (+1 request), and the post added from another tab appeared. In 14.1 the hand-made copies never noticed.', 'xanh'),
      box('cuongthai.com chose the other end', '<code>staleTime: 5 min</code>, <code>refetchOnWindowFocus: false</code>, <code>retry: 2</code>: fewer requests, and a write from elsewhere shows after five minutes, or after an invalidation (14.4).', 'lam')), ''),
    en: 'Refetch on focus. With the default staleTime zero, showing the tab again refetched, and a post added from another tab appeared; in fourteen point one nobody noticed. cuongthai.com chose the other end: staleTime five minutes and no refetch on focus, so a write from elsewhere appears later, or after an invalidation.' },
  { t: 'The race from Chapter 5 — gone', body: two(D(tsx(DUA2, { sm: true }), B('dua-04', { url: '/q/dua · 0.4 s after clicking 2', h: 200, w: 440 })),
    D(tn(['# click "Bài 1" (1,500 ms) then "Bài 2" (200 ms) at once', ...Object.entries(DUA).map(([k, v]) => `${k.replace(',', '.')}  ${v}`)].join('\n'), { fs: 13, wrap: 44, title: 'Chromium (real)' }),
      box('Read it', 'Selected: post 2. The hand-written effect showed post 2, then the slow answer for post 1 arrived and <b>overwrote</b> it: the screen ends on the wrong post. <code>useQuery</code> keeps each answer under its own key <code>[\'post\', id]</code> and shows the key you are on.', 'do2')), ''),
    en: 'The race, gone. Click post one, which answers in one and a half seconds, then post two, which answers in two hundred milliseconds. The hand-written effect shows post two, then the slow answer for post one arrives and overwrites it: the screen ends on the wrong post. useQuery files each answer under its own key and shows the one you are on.' },
  { t: 'Trap — a key with something new in it every render', body: two(D(tsx(KHF, { sm: true }), tn(['# Chromium · /q/khoa open for 3 seconds', KH[0].replace('trong', 'in').replace(' bài', ' posts')].join('\n'), { fs: 15, wrap: 52, title: 'Chromium (real)' })),
    D(box('Measured', `<code>Date.now()</code> makes a new key on every render. Each answer re-renders the component, which builds a new key, which starts a new query: <b>${nKhoa} requests in 3 seconds</b>, and the status never leaves <code>pending</code>.`, 'do2'),
      box('What is fine', 'An object such as <code>[\'notes\', { filters }]</code> rebuilt on every render is hashed by value — same content, same key. Only put values in the key that identify the data.', 'xanh')), ''),
    en: 'The trap: a key with something new in it on every render. Date dot now makes a new key each time, each answer re-renders, which starts another query: thirty-four requests in three seconds, and the status never leaves pending. An object rebuilt on each render is fine, because the key is hashed by value.' },
  { t: 'With Server Components: the first page from the server', body: two(D(tsx(DAU2, { sm: true, hl: [4, 5] }), tn(['$ curl the first HTML', ...HTML, '# Chromium · requests to /api/posts', REQ[1]].map((l) => en(l)).join('\n'), { fs: 13, wrap: 60, title: 'curl + Chromium (real)' })),
    D(box('The pattern', 'The page (a Server Component) reads the first page and passes it down; the client component hands it to <code>useQuery</code> as <code>initialData</code>. The HTML has <b>3</b> rows; the browser makes <b>0</b> requests while <code>staleTime</code> holds.', 'xanh'),
      box('Do not move everything to the client', 'Initial, SEO-relevant data belongs to Server Components (Chapter 10). Use the query for what changes while the user watches: load more, polling, filters.', 'lam')), ''),
    en: 'With Server Components. The page reads the first page on the server and passes it to the client component as initialData. The HTML now has three rows, and the browser makes zero requests while staleTime holds. Keep the initial, SEO-relevant data on the server; use the query for what changes while the user watches.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('QueryClient', 'the cache'), kw('QueryClientProvider', 'puts it above the tree'), kw('Query key', 'what the data is'), kw('Dedupe', 'same key ⇒ one request'),
      kw('staleTime', 'how long data counts as fresh'), kw('isFetching', 'a background refetch'), kw('Refetch on focus', 'back to the tab ⇒ refresh'), kw('initialData', 'start from server data'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: QueryClient, the cache; QueryClientProvider; the query key; dedupe; staleTime; isFetching for a background refetch; refetch on focus; and initialData.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Add a ${c('QueryClientProvider')} with ${c('useState(() => new QueryClient())')}`,
      `Two components, one key: count requests in DevTools → Network`,
      `Go away and back; set ${c('staleTime')} and compare`,
      `Click a slow then a fast id: compare ${c('useEffect')} with ${c('useQuery')}`,
    ]), box('Keep these', `<ul><li>The key is the identity of the data</li><li>Same key ⇒ one request, one cache</li><li>staleTime decides refetching</li><li>Nothing new-every-render in a key</li><li>First page from the server</li></ul>`, 'lam'), ''),
    en: 'Your turn: add the provider; put two components on one key and count requests; navigate away and back with different staleTimes; and race a slow id against a fast one. Keep: the key is the identity of the data, and staleTime decides refetching.' },
];
export const slides = lamDeck({ chuong: 'Chapter 14 — State management: client and server state', bai: '14.3' }, S);
