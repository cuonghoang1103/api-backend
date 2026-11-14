/*DU_LIEU*/
const DU_LIEU = {
 "n14-4:file:src/app/q-bai-m/useAddPost.ts": "'use client';\n// app/q-bai-m/useAddPost.ts — đoạn mã của bài, chép nguyên (+ export)\nimport { useMutation, useQueryClient } from '@tanstack/react-query';\n\nexport function useAddPost() {\n  const qc = useQueryClient();\n  return useMutation({\n    mutationFn: (post) => fetch('/api/posts', { method: 'POST', body: JSON.stringify(post) }),\n    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),  // refetch the list\n  });\n}\n",
 "n14-4:bai": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ dùng hook của bài như bài nói: m.mutate({ title: 'Zustand' })\nsrc/app/q-bai-m/Thu.tsx(3,58): error TS2345: Argument of type '{ title: string; }' is not assignable to parameter of type 'void'.",
 "n14-4:file:src/app/q/Providers.tsx": "'use client';\nimport { QueryClient, QueryClientProvider } from '@tanstack/react-query';\nimport { useState } from 'react';\nexport function Providers({ children }: { children: React.ReactNode }) {\n  const [qc] = useState(() => new QueryClient());\n  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;\n}\n",
 "n14-4:file:src/app/q/layout.tsx": "import { Providers } from './Providers';\nexport default function Layout({ children }: LayoutProps<'/q'>) {\n  return <Providers>{children}</Providers>;\n}\n",
 "n14-4:file:src/app/q/m/ghi.ts": "'use client';\n// app/q/m/ghi.ts — năm cách ghi một bài mới, cùng một danh sách ['posts']\nimport { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';\nimport type { Post } from '@/lib/kho';\n\nexport const usePosts = () =>\n  useQuery({ queryKey: ['posts'], queryFn: (): Promise<Post[]> => fetch('/api/posts').then((r) => r.json()) });\n\n// gửi lên máy chủ — fetch KHÔNG ném lỗi với 4xx/5xx, phải tự kiểm r.ok\nconst guiKhongKiem = (title: string) =>\n  fetch('/api/posts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title }) });\nconst gui = async (title: string): Promise<Post> => {\n  const r = await guiKhongKiem(title);\n  if (!r.ok) throw new Error(`HTTP ${r.status}`);\n  return r.json();\n};\n\n// 1 · ghi, KHÔNG vô hiệu hoá\nexport function useThemKhong() {\n  return useMutation({ mutationFn: gui });\n}\n\n// 2 · ghi, rồi vô hiệu hoá ['posts'] ⇒ tự tải lại\nexport function useThemInvalidate() {\n  const qc = useQueryClient();\n  return useMutation({\n    mutationFn: gui,\n    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),\n  });\n}\n\n// 3 · BẪY: mutationFn trả về Response mà không kiểm r.ok\nexport function useThemKhongKiemOk() {\n  return useMutation({ mutationFn: guiKhongKiem });\n}\n\n// 4 · lạc quan, KHÔNG quay lui\nexport function useThemLacQuan() {\n  const qc = useQueryClient();\n  return useMutation({\n    mutationFn: gui,\n    onMutate: (title) => {\n      qc.setQueryData<Post[]>(['posts'], (cu = []) => [...cu, { id: -1, title }]);\n    },\n  });\n}\n\n// 5 · lạc quan, CÓ quay lui\nexport function useThemLacQuanQuayLui() {\n  const qc = useQueryClient();\n  return useMutation({\n    mutationFn: gui,\n    onMutate: async (title) => {\n      await qc.cancelQueries({ queryKey: ['posts'] });                 // dừng mọi lần tải đang bay, kẻo nó đè lên\n      const truoc = qc.getQueryData<Post[]>(['posts']);                // chụp lại\n      qc.setQueryData<Post[]>(['posts'], (cu = []) => [...cu, { id: -1, title }]);\n      return { truoc };\n    },\n    onError: (_loi, _title, ctx) => qc.setQueryData(['posts'], ctx?.truoc),   // trả về đúng bản chụp\n    onSettled: () => qc.invalidateQueries({ queryKey: ['posts'] }),           // rồi đồng bộ với sự thật\n  });\n}\n",
 "n14-4:file:src/app/q/m/[kieu]/page.tsx": "'use client';\n// app/q/m/[kieu]/page.tsx — cùng một giao diện, đổi cách ghi theo URL\nimport { useParams } from 'next/navigation';\nimport { usePosts, useThemKhong, useThemInvalidate, useThemKhongKiemOk, useThemLacQuan, useThemLacQuanQuayLui } from '../ghi';\n\nconst CACH = { khong: useThemKhong, inv: useThemInvalidate, ok: useThemKhongKiemOk, lac: useThemLacQuan, lui: useThemLacQuanQuayLui };\n\nexport default function Trang() {\n  const { kieu } = useParams<{ kieu: keyof typeof CACH }>();\n  const { data } = usePosts();\n  const m = CACH[kieu]();\n  return (\n    <main className=\"space-y-1 p-4 text-lg\">\n      <p id=\"tt\">{data?.length ?? '…'} bài · mutation: {m.status}</p>\n      <ul id=\"ds\">{data?.map((p) => <li key={p.id}>{p.title}</li>)}</ul>\n      <button id=\"them\" onClick={() => m.mutate('Zustand')} className=\"mr-2 rounded bg-black px-3 text-white\">Thêm \"Zustand\"</button>\n      <button id=\"loi\" onClick={() => m.mutate('loi')} className=\"rounded border px-3\">Thêm \"loi\" (máy chủ từ chối)</button>\n    </main>\n  );\n}\n",
 "n14-4:file:src/app/q/saved/page.tsx": "'use client';\n// app/q/saved/page.tsx — CHÉP khuôn frontend/src/app/saved/page.tsx:63 + 98-111 (cache giữ OBJECT { collections }, bản chụp lại là MẢNG)\nimport { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';\nimport type { Post } from '@/lib/kho';\n\nconst KEY = ['collections'];\nexport default function Trang() {\n  const qc = useQueryClient();\n  const q = useQuery({ queryKey: KEY, queryFn: async () => ({ collections: (await (await fetch('/api/posts')).json()) as Post[] }) });\n  const collections = q.data?.collections ?? [];\n  const xoa = useMutation({\n    mutationFn: async (id: number) => { const r = await fetch(`/api/posts/${id}?xoa=1`, { method: 'DELETE' }); if (!r.ok) throw new Error(`HTTP ${r.status}`); },\n    onMutate: async (id) => {\n      const prev = collections;                                        // ← MẢNG\n      qc.setQueryData(KEY, (old: { collections: Post[] } | undefined) =>\n        old ? { ...old, collections: old.collections.filter((c) => c.id !== id) } : old);\n      return { prev };\n    },\n    onError: (_err, _vars, ctx) => { if (ctx?.prev) qc.setQueryData(KEY, ctx.prev); },   // ← ghi MẢNG vào chỗ của OBJECT\n  });\n  return (\n    <main className=\"space-y-1 p-4 text-lg\">\n      <p id=\"tt\">{collections.length} bộ sưu tập · mutation: {xoa.status}</p>\n      <ul id=\"ds\">{collections.map((c) => <li key={c.id}>{c.title} <button className=\"xoa underline\" onClick={() => xoa.mutate(c.id)}>xoá</button></li>)}</ul>\n    </main>\n  );\n}\n",
 "n14-4:chay": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/q/'\n✓ Compiled successfully in 7.1s\n├ ƒ /q/m/[kieu]\n└ ○ /q/saved\n$ curl: tuyến DELETE /api/posts/[id] chưa có ⇒ máy chủ trả gì (để thử nhánh lỗi)\nDELETE /api/posts/1 → HTTP 405\n$ Chromium: mỗi trang bấm một nút, đọc màn hình ở 50 ms và 1.200 ms sau khi bấm, rồi F5\n/q/m/khong\n    0 trước khi bấm  3 bài · mutation: idle · Học Next.js, Server Component, Cache\n    1 sau 50 ms      3 bài · mutation: pending · Học Next.js, Server Component, Cache\n    2 sau 1.200 ms   3 bài · mutation: success · Học Next.js, Server Component, Cache\n    3 sau F5         4 bài · mutation: idle · Học Next.js, Server Component, Cache, Zustand\n    request: GET 200, GET 200, POST 201, GET 200\n/q/m/inv\n    0 trước khi bấm  3 bài · mutation: idle · Học Next.js, Server Component, Cache\n    1 sau 50 ms      3 bài · mutation: pending · Học Next.js, Server Component, Cache\n    2 sau 1.200 ms   4 bài · mutation: success · Học Next.js, Server Component, Cache, Zustand\n    3 sau F5         4 bài · mutation: idle · Học Next.js, Server Component, Cache, Zustand\n    request: GET 200, GET 200, POST 201, GET 200, GET 200\n/q/m/ok\n    0 trước khi bấm  3 bài · mutation: idle · Học Next.js, Server Component, Cache\n    1 sau 50 ms      3 bài · mutation: pending · Học Next.js, Server Component, Cache\n    2 sau 1.200 ms   3 bài · mutation: success · Học Next.js, Server Component, Cache\n    3 sau F5         3 bài · mutation: idle · Học Next.js, Server Component, Cache\n    request: GET 200, GET 200, POST 500, GET 200\n/q/m/lac\n    0 trước khi bấm  3 bài · mutation: idle · Học Next.js, Server Component, Cache\n    1 sau 50 ms      4 bài · mutation: pending · Học Next.js, Server Component, Cache, loi\n    2 sau 1.200 ms   4 bài · mutation: error · Học Next.js, Server Component, Cache, loi\n    3 sau F5         3 bài · mutation: idle · Học Next.js, Server Component, Cache\n    request: GET 200, GET 200, POST 500, GET 200\n/q/m/lui\n    0 trước khi bấm  3 bài · mutation: idle · Học Next.js, Server Component, Cache\n    1 sau 50 ms      4 bài · mutation: pending · Học Next.js, Server Component, Cache, loi\n    2 sau 1.200 ms   3 bài · mutation: error · Học Next.js, Server Component, Cache\n    3 sau F5         3 bài · mutation: idle · Học Next.js, Server Component, Cache\n    request: GET 200, GET 200, POST 500, GET 200, GET 200\n/q/saved\n    0 trước khi bấm  3 bộ sưu tập · mutation: idle · Học Next.js, Server Component, Cache\n    1 sau 50 ms      0 bộ sưu tập · mutation: error · \n    2 sau 1.200 ms   0 bộ sưu tập · mutation: error · \n    3 sau F5         3 bộ sưu tập · mutation: idle · Học Next.js, Server Component, Cache\n    request: GET 200, GET 200, DELETE 405, GET 200",
 "n14-4:kho": "$ for p in useMutation invalidateQueries setQueryData onMutate; do printf '%-18s %s tệp\\n' $p \"$(grep -rl $p src | wc -l | tr -d ' ')\"; done\nuseMutation        194 tệp\ninvalidateQueries  192 tệp\nsetQueryData       62 tệp\nonMutate           10 tệp\n$ sed -n '63p;98,111p' src/app/saved/page.tsx\n  const collections = collectionsQuery.data?.collections ?? [];\n  // ── Delete collection ────────────────────────────────────────\n  const deleteCollection = useMutation({\n    mutationFn: (id: number) => socialApi.deleteCollectionV2(id),\n    onMutate: async (id) => {\n      // Optimistic remove from local list.\n      const prev = collections;\n      qc.setQueryData([...socialKeys.all, 'collections'], (old: any) =>\n        old ? { ...old, collections: old.collections.filter((c: any) => c.id !== id) } : old,\n      );\n      return { prev };\n    },\n    onError: (_err, _vars, ctx) => {\n      if (ctx?.prev) qc.setQueryData([...socialKeys.all, 'collections'], ctx.prev as any);\n      toast.error('Xoá thất bại');",
 "anh-nxj-14-4:khong-50": {
  "url": "http://127.0.0.1:19398/q/m/khong",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-4:khong-1200": {
  "url": "http://127.0.0.1:19398/q/m/khong",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-4:khong": {
  "url": "http://127.0.0.1:19398/q/m/khong",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19398/q/m/khong",
    "ma": 200,
    "loai": "document",
    "kt": 8849
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/32ayk1wc40l4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 12029
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
   },
   {
    "url": "http://127.0.0.1:19398/q/m/khong",
    "ma": 200,
    "loai": "document",
    "kt": 8849
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/32ayk1wc40l4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 12029
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 201,
    "loai": "fetch",
    "kt": 26,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"title\":\"Zustand\"}",
    "ms": 2442,
    "ve": 2741
   },
   {
    "url": "http://127.0.0.1:19398/q/m/khong",
    "ma": 200,
    "loai": "document",
    "kt": 8849
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/32ayk1wc40l4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 12029
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 122
   }
  ],
  "console": [],
  "ketQua": {
   "0 trước khi bấm": "3 bài · mutation: idle · Học Next.js, Server Component, Cache",
   "1 sau 50 ms": "3 bài · mutation: pending · Học Next.js, Server Component, Cache",
   "2 sau 1.200 ms": "3 bài · mutation: success · Học Next.js, Server Component, Cache",
   "3 sau F5": "4 bài · mutation: idle · Học Next.js, Server Component, Cache, Zustand"
  }
 },
 "anh-nxj-14-4:inv-50": {
  "url": "http://127.0.0.1:19398/q/m/inv",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-4:inv-1200": {
  "url": "http://127.0.0.1:19398/q/m/inv",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-4:inv": {
  "url": "http://127.0.0.1:19398/q/m/inv",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19398/q/m/inv",
    "ma": 200,
    "loai": "document",
    "kt": 8843
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/32ayk1wc40l4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 12029
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
    "kt": 122
   },
   {
    "url": "http://127.0.0.1:19398/q/m/inv",
    "ma": 200,
    "loai": "document",
    "kt": 8843
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/32ayk1wc40l4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 12029
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 201,
    "loai": "fetch",
    "kt": 26,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"title\":\"Zustand\"}",
    "ms": 2350,
    "ve": 2655
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 122
   },
   {
    "url": "http://127.0.0.1:19398/q/m/inv",
    "ma": 200,
    "loai": "document",
    "kt": 8843
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/32ayk1wc40l4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 12029
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 122
   }
  ],
  "console": [],
  "ketQua": {
   "0 trước khi bấm": "3 bài · mutation: idle · Học Next.js, Server Component, Cache",
   "1 sau 50 ms": "3 bài · mutation: pending · Học Next.js, Server Component, Cache",
   "2 sau 1.200 ms": "4 bài · mutation: success · Học Next.js, Server Component, Cache, Zustand",
   "3 sau F5": "4 bài · mutation: idle · Học Next.js, Server Component, Cache, Zustand"
  }
 },
 "anh-nxj-14-4:ok-50": {
  "url": "http://127.0.0.1:19398/q/m/ok",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-4:ok-1200": {
  "url": "http://127.0.0.1:19398/q/m/ok",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 500 (Internal Server Error)"
   }
  ]
 },
 "anh-nxj-14-4:ok": {
  "url": "http://127.0.0.1:19398/q/m/ok",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19398/q/m/ok",
    "ma": 200,
    "loai": "document",
    "kt": 8840
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/32ayk1wc40l4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 12029
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
    "kt": 122
   },
   {
    "url": "http://127.0.0.1:19398/q/m/ok",
    "ma": 200,
    "loai": "document",
    "kt": 8840
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/32ayk1wc40l4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 12029
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 500,
    "loai": "fetch",
    "kt": 34,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"title\":\"loi\"}",
    "ms": 2350,
    "ve": 2654
   },
   {
    "url": "http://127.0.0.1:19398/q/m/ok",
    "ma": 200,
    "loai": "document",
    "kt": 8840
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/32ayk1wc40l4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 12029
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 500 (Internal Server Error)"
   }
  ],
  "ketQua": {
   "0 trước khi bấm": "3 bài · mutation: idle · Học Next.js, Server Component, Cache",
   "1 sau 50 ms": "3 bài · mutation: pending · Học Next.js, Server Component, Cache",
   "2 sau 1.200 ms": "3 bài · mutation: success · Học Next.js, Server Component, Cache",
   "3 sau F5": "3 bài · mutation: idle · Học Next.js, Server Component, Cache"
  }
 },
 "anh-nxj-14-4:lac-50": {
  "url": "http://127.0.0.1:19398/q/m/lac",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-4:lac-1200": {
  "url": "http://127.0.0.1:19398/q/m/lac",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 500 (Internal Server Error)"
   }
  ]
 },
 "anh-nxj-14-4:lac": {
  "url": "http://127.0.0.1:19398/q/m/lac",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19398/q/m/lac",
    "ma": 200,
    "loai": "document",
    "kt": 8843
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/32ayk1wc40l4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 12029
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
   },
   {
    "url": "http://127.0.0.1:19398/q/m/lac",
    "ma": 200,
    "loai": "document",
    "kt": 8843
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/32ayk1wc40l4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 12029
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 500,
    "loai": "fetch",
    "kt": 34,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"title\":\"loi\"}",
    "ms": 2352,
    "ve": 2657
   },
   {
    "url": "http://127.0.0.1:19398/q/m/lac",
    "ma": 200,
    "loai": "document",
    "kt": 8843
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/32ayk1wc40l4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 12029
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 500 (Internal Server Error)"
   }
  ],
  "ketQua": {
   "0 trước khi bấm": "3 bài · mutation: idle · Học Next.js, Server Component, Cache",
   "1 sau 50 ms": "4 bài · mutation: pending · Học Next.js, Server Component, Cache, loi",
   "2 sau 1.200 ms": "4 bài · mutation: error · Học Next.js, Server Component, Cache, loi",
   "3 sau F5": "3 bài · mutation: idle · Học Next.js, Server Component, Cache"
  }
 },
 "anh-nxj-14-4:lui-50": {
  "url": "http://127.0.0.1:19398/q/m/lui",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-14-4:lui-1200": {
  "url": "http://127.0.0.1:19398/q/m/lui",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 500 (Internal Server Error)"
   }
  ]
 },
 "anh-nxj-14-4:lui": {
  "url": "http://127.0.0.1:19398/q/m/lui",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19398/q/m/lui",
    "ma": 200,
    "loai": "document",
    "kt": 8843
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/32ayk1wc40l4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 12029
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
   },
   {
    "url": "http://127.0.0.1:19398/q/m/lui",
    "ma": 200,
    "loai": "document",
    "kt": 8843
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/32ayk1wc40l4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 12029
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 500,
    "loai": "fetch",
    "kt": 34,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"title\":\"loi\"}",
    "ms": 2340,
    "ve": 2643
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   },
   {
    "url": "http://127.0.0.1:19398/q/m/lui",
    "ma": 200,
    "loai": "document",
    "kt": 8843
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/32ayk1wc40l4w.js",
    "ma": 200,
    "loai": "script",
    "kt": 12029
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 500 (Internal Server Error)"
   }
  ],
  "ketQua": {
   "0 trước khi bấm": "3 bài · mutation: idle · Học Next.js, Server Component, Cache",
   "1 sau 50 ms": "4 bài · mutation: pending · Học Next.js, Server Component, Cache, loi",
   "2 sau 1.200 ms": "3 bài · mutation: error · Học Next.js, Server Component, Cache",
   "3 sau F5": "3 bài · mutation: idle · Học Next.js, Server Component, Cache"
  }
 },
 "anh-nxj-14-4:saved-50": {
  "url": "http://127.0.0.1:19398/q/saved",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 405 (Method Not Allowed)"
   }
  ]
 },
 "anh-nxj-14-4:saved-1200": {
  "url": "http://127.0.0.1:19398/q/saved",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 405 (Method Not Allowed)"
   }
  ]
 },
 "anh-nxj-14-4:saved": {
  "url": "http://127.0.0.1:19398/q/saved",
  "vp": [
   560,
   260
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19398/q/saved",
    "ma": 200,
    "loai": "document",
    "kt": 8505
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3nv2w375na-s_.js",
    "ma": 200,
    "loai": "script",
    "kt": 11228
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
   },
   {
    "url": "http://127.0.0.1:19398/q/saved",
    "ma": 200,
    "loai": "document",
    "kt": 8505
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3nv2w375na-s_.js",
    "ma": 200,
    "loai": "script",
    "kt": 11228
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   },
   {
    "url": "http://127.0.0.1:19398/api/posts/1?xoa=1",
    "ma": 405,
    "loai": "fetch",
    "kt": 0,
    "pt": "DELETE",
    "than": "",
    "ms": 2348,
    "ve": 2352
   },
   {
    "url": "http://127.0.0.1:19398/q/saved",
    "ma": 200,
    "loai": "document",
    "kt": 8505
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3bz87h_ba6qsk.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15134
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/0k0w9bzudl0-o.js",
    "ma": 200,
    "loai": "script",
    "kt": 166862
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
    "url": "http://127.0.0.1:19398/_next/static/chunks/0-i01mn519me-.js",
    "ma": 200,
    "loai": "script",
    "kt": 7270
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3u55o-anq19m4.js",
    "ma": 200,
    "loai": "script",
    "kt": 19152
   },
   {
    "url": "http://127.0.0.1:19398/_next/static/chunks/3nv2w375na-s_.js",
    "ma": 200,
    "loai": "script",
    "kt": 11228
   },
   {
    "url": "http://127.0.0.1:19398/api/posts",
    "ma": 200,
    "loai": "fetch",
    "kt": 95
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 405 (Method Not Allowed)"
   }
  ],
  "ketQua": {
   "0 trước khi bấm": "3 bộ sưu tập · mutation: idle · Học Next.js, Server Component, Cache",
   "1 sau 50 ms": "0 bộ sưu tập · mutation: error · ",
   "2 sau 1.200 ms": "0 bộ sưu tập · mutation: error · ",
   "3 sau F5": "3 bộ sưu tập · mutation: idle · Học Next.js, Server Component, Cache"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-14-4', code: 'NXJ 14.4', title: 'Mutations and cache invalidation', sub: 'Chapter 14 · Lesson 14.4' };
const O = (k) => { const v = DU_LIEU[`n14-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-14-4:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ (app|lib)\//.test(l)).join('\n');
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-14-4', ten, { vp: 560, ...o });
const en = (s) => String(s).replace(/ bài/g, ' posts').replace(/ bộ sưu tập/g, ' collections').replace(/ · Học Next.js.*$/, '').replace(/ · $/, '');
const K = (k) => Object.entries(A(k).ketQua).map(([m, v]) => [m.replace(/^\d /, '').replace('trước khi bấm', 'before').replace('sau', 'after').replace('1.200', '1,200'), en(v)]);
const REQ = (k) => A(k).mang.filter((x) => x.url.includes('/api/posts')).map((x) => (x.pt || 'GET') + ' ' + x.ma).join(' · ');

// ── số đo (n14-4 · Next.js 16.4.6 · TanStack Query 5.107.1 · Chromium)
const TSC = doan('bai', 'npx next typegen'), TSC2 = doan('bai', 'mutate({ title');
const KQ = (k) => A(k).ketQua;
if (!/0 lỗi/.test(TSC[0]) || !/TS2345: Argument of type '\{ title: string; \}' is not assignable to parameter of type 'void'/.test(TSC2[0])) throw new Error('tsc đổi');
if (!/^3 bài · mutation: success/.test(KQ('khong')['2 sau 1.200 ms']) || !/^4 bài/.test(KQ('khong')['3 sau F5'])) throw new Error('khong đổi');
if (!/^4 bài · mutation: success/.test(KQ('inv')['2 sau 1.200 ms']) || !/POST 201 · GET 200 · GET 200$/.test(REQ('inv'))) throw new Error('inv đổi');
if (!/mutation: success/.test(KQ('ok')['2 sau 1.200 ms']) || !/POST 500/.test(REQ('ok'))) throw new Error('ok đổi');
if (!/^4 bài · mutation: error .*loi$/.test(KQ('lac')['2 sau 1.200 ms']) || !/^3 bài/.test(KQ('lac')['3 sau F5'])) throw new Error('lac đổi');
if (!/^4 bài .*loi$/.test(KQ('lui')['1 sau 50 ms']) || !/^3 bài · mutation: error/.test(KQ('lui')['2 sau 1.200 ms'])) throw new Error('lui đổi');
if (!/^3 bộ/.test(KQ('saved')['0 trước khi bấm']) || !/^0 bộ sưu tập · mutation: error/.test(KQ('saved')['2 sau 1.200 ms']) || !/^3 bộ/.test(KQ('saved')['3 sau F5'])) throw new Error('saved đổi');

const GHI = bo(F('src/app/q/m/ghi.ts')).split('\n');
const fn = (ten) => { const i = GHI.findIndex((l) => l.includes(`function ${ten}()`)); let j = i; while (GHI[j] !== '}') j++; return GHI.slice(i, j + 1).join('\n'); };
const kv = (s) => s.replace(/ +\/\/ .*$/gm, '').replace("qc.setQueryData<Post[]>(['posts'], (cu = []) => [...cu, { id: -1, title }]);", "qc.setQueryData<Post[]>(['posts'], (cu = []) =>\n        [...cu, { id: -1, title }]);").replace("onError: (_loi, _title, ctx) => qc.setQueryData(['posts'], ctx?.truoc),", "onError: (_loi, _title, ctx) =>\n      qc.setQueryData(['posts'], ctx?.truoc),");
const GUI = GHI.slice(GHI.findIndex((l) => l.startsWith('const guiKhongKiem')), GHI.findIndex((l) => l.startsWith('};')) + 1).join('\n').replace("fetch('/api/posts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title }) });", "fetch('/api/posts', { method: 'POST', … });");
const SAVED = O('kho').split('\n'); const SV = SAVED.slice(SAVED.findIndex((l) => l.startsWith('$ sed')) + 1).join('\n').replace(/^ {2}/gm, '');
const LUI = kv(fn('useThemLacQuanQuayLui'));
const tb = (k) => cmp(['', 'screen · mutation'], K(k).map(([m, v]) => [m, `${v.replace(/ · mutation: (\w+)/, '')} · <b>${(v.match(/mutation: (\w+)/) || [])[1]}</b>`]));

export const S = [
  { cover: true, nhan: 'Chapter 14 · Lesson 14.4', t: 'Mutations and<br>cache invalidation', sub: 'Five ways to write the same post, measured at 50 ms and 1.2 s: no invalidation, invalidation, fetch that never throws, optimistic without and with rollback — and a rollback on cuongthai.com that empties the list',
    en: 'Lesson fourteen point four: mutations and cache invalidation. Five ways to write the same post, measured at fifty milliseconds and one point two seconds, and a rollback on cuongthai.com that empties the list.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The lesson's hook compiles — and cannot be called with a post (<code>void</code>)</li>
    <li>A write with no invalidation: success, and a stale screen</li>
    <li><code>fetch</code> does not throw on 500 — the mutation says <i>success</i></li>
    <li>Optimistic updates: instant, and you owe a rollback — measured both ways</li>
    <li>A rollback that restores the wrong shape — on cuongthai.com</li></ul>`,
    en: 'Five takeaways: the lesson\'s hook compiles but cannot be called with a post; a write without invalidation; fetch does not throw on a five hundred; optimistic updates with and without rollback; and a rollback on cuongthai.com that restores the wrong shape.' },
  { t: "The lesson's hook — compiles, and cannot take a post", body: two(D(tsx(bo(F('src/app/q-bai-m/useAddPost.ts')).replace("'use client';\n", '').trim(), { sm: true, hl: [7] }), tn(['$ npx tsc --noEmit', ...TSC, "$ # use it as the lesson says: m.mutate({ title: 'Zustand' })", ...TSC2].join('\n').replace('tsc: 0 lỗi', 'tsc: 0 errors'), { fs: 13, wrap: 60, title: 'tsc (real)' })),
    D(box('Read it', 'No type on <code>post</code> ⇒ the variables are inferred as <code>void</code>. The hook compiles; <b>calling</b> it with a post is <code>TS2345</code>.', 'do2'),
      box('Fix', '<code>mutationFn: (post: { title: string }) =&gt; …</code> — now every <code>mutate(…)</code> is checked.', 'xanh')), ''),
    en: 'The lesson\'s hook compiles, but post has no type, so TanStack infers the variables as void, and calling mutate with a post is TS two three four five. Type the variables, and every call is checked.' },
  { t: 'A write with no invalidation: success, and a stale screen', body: two(D(tsx(kv(fn('useThemKhong')) + '\n\n' + kv(fn('useThemInvalidate')).replace("onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),", "onSuccess: () =>\n      qc.invalidateQueries({ queryKey: ['posts'] }),"), { sm: true, hl: [8, 9] }), B('khong-1200', { url: '/q/m/khong · 1.2 s after "Add"', h: 160, w: 470 })),
    D(tb('khong'), tn(['# requests to /api/posts', 'no invalidation   ' + REQ('khong'), 'invalidate        ' + REQ('inv')].join('\n'), { fs: 13, wrap: 60, title: 'Chromium (real)' }),
      box('Measured', 'No invalidation: server 4, screen 3, mutation <b>success</b>. With <code>invalidateQueries</code>: POST, then GET — ' + en(KQ('inv')['2 sau 1.200 ms']).replace(/ · mutation.*/, '') + ' at 1.2 s.', 'xanh')), ''),
    en: 'A write with no invalidation. The mutation reports success, the server has four posts, and the screen still says three until F5. With invalidateQueries in onSuccess, the POST is followed by a GET, and after one point two seconds the screen shows four.' },
  { t: 'fetch does not throw on 500 — so the mutation says success', body: two(D(tsx(kv(GUI), { sm: true, hl: [1, 4] }), B('ok-1200', { url: '/q/m/ok · server answered 500', h: 200, w: 470 })),
    D(tb('ok'), tn(['# requests to /api/posts', REQ('ok')].join('\n'), { fs: 14, wrap: 60, title: 'Chromium (real)' }),
      box('Read it', 'The server said <b>500</b>; the mutation says <b>success</b> — because <code>fetch</code> only rejects on a network failure. <code>onSuccess</code> runs, <code>onError</code> never does. Check <code>r.ok</code> and throw (<code>gui</code>), or use a client that rejects on non-2xx (axios, as cuongthai.com does).', 'do2')), ''),
    en: 'fetch does not throw on a five hundred. The server rejected the post, and the mutation still says success, because fetch only rejects when the network fails. onSuccess runs and onError never does. Check r dot ok and throw, or use a client like axios that rejects on any non-two-hundred status.' },
  { t: 'Optimistic, with no rollback: a row that never happened', body: two(D(tsx(kv(fn('useThemLacQuan')), { sm: true, hl: [6] }), B('lac-1200', { url: '/q/m/lac · 1.2 s · server said 500', h: 230, w: 470, mark: [[14, 140, 60, 30, '']] })),
    D(tb('lac'), box('Measured', 'The "loi" row appears at 50 ms — before the server answers — and is <b>still there</b> at 1.2 s, with mutation <b>error</b>. The user believes it saved. Only F5 removes it.', 'do2')), ''),
    en: 'Optimistic, with no rollback. The new row appears at fifty milliseconds, before the server answers, and it is still there after one point two seconds, although the mutation failed. The user believes it saved; only F5 removes it.' },
  { t: 'Optimistic, with rollback — the full pattern', body: two(D(tsx(LUI, { sm: true, hl: [5, 6, 7, 8, 11, 12, 13] })),
    D(tn(['# server answers 500 · screen after the click', ...K('lui').map(([m, v]) => `${m.padEnd(16)} ${v.replace(' · mutation:', ' ·')}`), '# requests to /api/posts', REQ('lui')].join('\n'), { fs: 13, wrap: 46, title: 'Chromium (real)' }),
      box('Four steps', '<b>cancel</b> fetches in flight (so one cannot overwrite you) · <b>snapshot</b> · write the guess · on error <b>restore the snapshot</b>, then <code>onSettled</code> <b>invalidate</b> to sync with the truth.', 'xanh')), ''),
    en: 'Optimistic, with rollback. Cancel any fetch in flight, so it cannot overwrite your guess; take a snapshot; write the guess; on error restore the snapshot; and on settled, invalidate to sync with the truth. Measured: four rows at fifty milliseconds, three again at one point two seconds.' },
  { t: 'cuongthai.com: a rollback that empties the list', body: two(D(tn(['$ sed -n \'63p;98,111p\' frontend/src/app/saved/page.tsx', ...SV.split('\n')].join('\n'), { fs: 11, wrap: 76, title: 'frontend/ (real)' })),
    D(tb('saved'), box('Why', 'Cache: <code>{ collections: [...] }</code>. Snapshot: the <b>array</b>. On error the array replaces the object ⇒ <code>data?.collections</code> is <code>undefined</code> ⇒ <b>0</b> shown instead of 3 (replica, delete fails with 405).', 'do2'),
      box('Fix', '<code>const prev = qc.getQueryData(key)</code> — the whole entry; <code>cancelQueries</code> first.', 'xanh')), ''),
    en: 'cuongthai.com: a rollback that empties the list. The cache holds an object with a collections field, but the snapshot is the array. When the delete fails, the array is written where the object was, and the list shows zero instead of three. Measured on a replica. The fix: snapshot the cache entry itself with getQueryData, and cancel queries first.' },
  { t: 'Two write paths, one rule', body: icards([
      ['bolt', 'Server Action + revalidatePath', 'Chapter 12: write on the server, then refresh the server cache.'],
      ['loop', 'useMutation + invalidateQueries', 'This lesson: write from the client, then refresh the client cache.'],
      ['check', 'The rule', 'A write is finished only when the cache that shows it is refreshed. No invalidation = a stale screen.'],
      ['db', 'cuongthai.com', '194 files use <code>useMutation</code>, 192 call <code>invalidateQueries</code>, 62 <code>setQueryData</code>, 10 <code>onMutate</code>.'],
    ], 2),
    en: 'Two write paths, one rule: a Server Action with revalidatePath, or useMutation with invalidateQueries. Either way, a write is finished only when the cache that shows it is refreshed. On cuongthai.com, one hundred ninety-four files use useMutation, and one hundred ninety-two call invalidateQueries.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('useMutation', 'run a write'), kw('invalidateQueries', 'mark stale ⇒ refetch'), kw('r.ok', 'fetch does not throw on 4xx/5xx'), kw('Optimistic update', 'show it before the server confirms'),
      kw('onMutate', 'cancel · snapshot · guess'), kw('Rollback', 'restore the snapshot on error'), kw('onSettled', 'sync with the truth'), kw('Snapshot shape', 'the cache entry, not a field of it'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: useMutation; invalidateQueries; r dot ok; optimistic update; onMutate; rollback; onSettled; and the shape of the snapshot.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Type the variables of a ${c('useMutation')}; call ${c('mutate')} with a post`,
      `Write without ${c('invalidateQueries')}; watch the stale screen; add it`,
      `Make the server answer 500; read ${c('status')}; add the ${c('r.ok')} check`,
      `Optimistic update: break the server; first with no rollback, then with all four steps`,
    ]), box('Keep these', `<ul><li>Write ⇒ invalidate</li><li>fetch: check r.ok</li><li>Optimistic ⇒ owe a rollback</li><li>Snapshot the whole cache entry</li><li>cancelQueries before the guess</li></ul>`, 'lam'), ''),
    en: 'Your turn: type a mutation; write without invalidation and then with it; make the server answer five hundred and add the r dot ok check; and build an optimistic update, first with no rollback, then with all four steps. Keep: write, then invalidate; and snapshot the whole cache entry.' },
];
export const slides = lamDeck({ chuong: 'Chapter 14 — State management: client and server state', bai: '14.4' }, S);
