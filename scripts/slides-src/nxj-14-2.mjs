/*DU_LIEU*/
const DU_LIEU = {
 "n14-2:file:src/lib/cart-bai.ts": "// lib/cart-bai.ts — đoạn mã của bài, chép nguyên (+ export)\nimport { create } from 'zustand';\nexport const useCart = create((set) => ({\n  items: [],\n  add:    (item) => set((s) => ({ items: [...s.items, item] })),\n  clear:  () => set({ items: [] }),\n}));\n",
 "n14-2:file:src/lib/cart.ts": "// lib/cart.ts — cùng store, có kiểu: create<Cart>()(…) (hai cặp ngoặc)\nimport { create } from 'zustand';\n\nexport type Item = { id: number; ten: string };\ntype Cart = {\n  items: Item[];\n  note: string;\n  add: (item: Item) => void;\n  setNote: (note: string) => void;\n  clear: () => void;\n};\n\nexport const useCart = create<Cart>()((set) => ({\n  items: [],\n  note: '',\n  add: (item) => set((s) => ({ items: [...s.items, item] })),\n  setNote: (note) => set({ note }),\n  clear: () => set({ items: [] }),\n}));\n",
 "n14-2:bai": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit\nsrc/lib/cart-bai.ts(5,12): error TS7006: Parameter 'item' implicitly has an 'any' type.\nsrc/lib/cart-bai.ts(5,26): error TS7006: Parameter 's' implicitly has an 'any' type.\n$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ ngoài React: gọi store từ một script Node (không component, không Provider)\nsubscribe: 1 món\nsubscribe: 2 món\ngetState().items = [{\"id\":1,\"ten\":\"Phở\"},{\"id\":2,\"ten\":\"Bún\"}]",
 "n14-2:file:src/app/gio/Phan.tsx": "'use client';\n// app/gio/Phan.tsx — ba component đọc store theo ba cách, mỗi lần render in một dòng console\nimport { useCart } from '@/lib/cart';\n\nexport function DemMon() {\n  const n = useCart((s) => s.items.length);          // selector: chỉ phần items.length\n  console.log('render DemMon');\n  return <p id=\"dem\">{n} món</p>;\n}\n\nexport function GhiChu() {\n  const note = useCart((s) => s.note);               // selector: chỉ phần note\n  console.log('render GhiChu');\n  return <p id=\"note\">Ghi chú: {note}</p>;\n}\n\nexport function CaStore() {\n  const { items } = useCart();                       // BẪY: không selector ⇒ theo dõi CẢ store\n  console.log('render CaStore');\n  return <p id=\"ca\">CaStore thấy {items.length} món</p>;\n}\n\nexport function Nut() {\n  const add = useCart((s) => s.add);\n  const setNote = useCart((s) => s.setNote);\n  return (\n    <div className=\"flex gap-2\">\n      <button id=\"them\" onClick={() => add({ id: Date.now(), ten: 'Phở' })} className=\"rounded bg-black px-3 text-white\">Thêm món</button>\n      <button id=\"ghi\" onClick={() => setNote(String(Math.random()).slice(2, 6))} className=\"rounded border px-3\">Sửa ghi chú</button>\n    </div>\n  );\n}\n",
 "n14-2:file:src/app/gio/page.tsx": "// app/gio/page.tsx — KHÔNG có Provider nào: store là một module\nimport { DemMon, GhiChu, CaStore, Nut } from './Phan';\n\nexport default function Trang() {\n  return <main className=\"space-y-1 p-4 text-lg\"><DemMon /><GhiChu /><CaStore /><Nut /></main>;\n}\n",
 "n14-2:file:src/app/gio-ctx/Phan.tsx": "'use client';\n// app/gio-ctx/Phan.tsx — CÙNG giao diện bằng Context: một value chứa items + note\nimport { createContext, useContext, useState } from 'react';\nimport type { Item } from '@/lib/cart';\n\ntype V = { items: Item[]; note: string; add: (i: Item) => void; setNote: (n: string) => void };\nconst Ctx = createContext<V | null>(null);\nconst dung = () => { const v = useContext(Ctx); if (!v) throw new Error('thiếu CartProvider'); return v; };\n\nexport function CartProvider({ children }: { children: React.ReactNode }) {\n  const [items, setItems] = useState<Item[]>([]);\n  const [note, setNote] = useState('');\n  const add = (i: Item) => setItems((s) => [...s, i]);\n  return <Ctx.Provider value={{ items, note, add, setNote }}>{children}</Ctx.Provider>;\n}\n\nexport function DemMon() { const { items } = dung(); console.log('render DemMon'); return <p id=\"dem\">{items.length} món</p>; }\nexport function GhiChu() { const { note } = dung(); console.log('render GhiChu'); return <p id=\"note\">Ghi chú: {note}</p>; }\nexport function Nut() {\n  const { add, setNote } = dung();\n  return (\n    <div className=\"flex gap-2\">\n      <button id=\"them\" onClick={() => add({ id: Date.now(), ten: 'Phở' })} className=\"rounded bg-black px-3 text-white\">Thêm món</button>\n      <button id=\"ghi\" onClick={() => setNote(String(Math.random()).slice(2, 6))} className=\"rounded border px-3\">Sửa ghi chú</button>\n    </div>\n  );\n}\n",
 "n14-2:file:src/app/gio-ctx/page.tsx": "import { CartProvider, DemMon, GhiChu, Nut } from './Phan';\nexport default function Trang() {\n  return <main className=\"space-y-1 p-4 text-lg\"><CartProvider><DemMon /><GhiChu /><Nut /></CartProvider></main>;\n}\n",
 "n14-2:render": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/gio'\n✓ Compiled successfully in 6.1s\n├ ○ /gio\n└ ○ /gio-ctx\n$ Chromium: mở trang · bấm \"Sửa ghi chú\" 3 lần · bấm \"Thêm món\" 2 lần — đếm dòng \"render …\" trong console\nZustand  · DemMon 3 lần · GhiChu 4 lần · CaStore 6 lần · 2 món · Ghi chú: xxxx\nContext  · DemMon 6 lần · GhiChu 6 lần · 2 món · Ghi chú: xxxx",
 "n14-2:file:src/app/gio-obj/page.tsx": "'use client';\n// app/gio-obj/page.tsx — BẪY v5: selector trả về OBJECT MỚI mỗi lần gọi\nimport { useCart } from '@/lib/cart';\n\nexport default function Trang() {\n  const { n, note } = useCart((s) => ({ n: s.items.length, note: s.note }));\n  return <p id=\"dem\" className=\"p-4 text-lg\">{n} món · {note}</p>;\n}\n",
 "n14-2:file:src/app/gio-shallow/page.tsx": "'use client';\n// app/gio-shallow/page.tsx — SỬA: useShallow so từng khoá của object\nimport { useShallow } from 'zustand/react/shallow';\nimport { useCart } from '@/lib/cart';\n\nexport default function Trang() {\n  const { n, note } = useCart(useShallow((s) => ({ n: s.items.length, note: s.note })));\n  return <p id=\"dem\" className=\"p-4 text-lg\">{n} món · {note}</p>;\n}\n",
 "n14-2:shallow": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/gio-obj|/gio-shallow|rror|Maximum|getServerSnapshot' | head -12\n✓ Compiled successfully in 843ms\n├ ○ /gio-obj\n└ ○ /gio-shallow\n$ Chromium + next dev: console của hai trang\nobj-dev · 2 dòng lỗi/cảnh báo · (không có #dem)\n   error · The result of getServerSnapshot should be cached to avoid an infinite loop\n   pageerror · Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limi\nshallow-dev · 0 dòng lỗi/cảnh báo · 0 món · ",
 "n14-2:file:src/lib/user.ts": "// lib/user.ts — store MODULE: trên máy chủ, một bản dùng chung cho MỌI request\nimport { create } from 'zustand';\nexport const useUser = create<{ ten: string | null }>()(() => ({ ten: null }));\n",
 "n14-2:file:src/app/ro/KhoiTao.tsx": "'use client';\n// app/ro/KhoiTao.tsx — BẪY: nạp props vào store NGAY LÚC RENDER (chạy cả khi render trên máy chủ)\nimport { useUser } from '@/lib/user';\nexport function KhoiTao({ ten }: { ten: string }) {\n  useUser.setState({ ten });\n  return null;\n}\n",
 "n14-2:file:src/app/ro/Chao.tsx": "'use client';\nimport { useUser } from '@/lib/user';\nexport function Chao() {\n  const ten = useUser((s) => s.ten);\n  return <p id=\"chao\">Xin chào {ten ?? 'khách'}</p>;\n}\nexport function DocThang() {\n  return <p id=\"gs\">getState(): {useUser.getState().ten ?? 'khách'}</p>;   // đọc thẳng store, không qua hook\n}\n",
 "n14-2:file:src/app/ro/page.tsx": "// app/ro/page.tsx — đọc cookie u (đã đăng nhập) rồi đưa tên vào store\nimport { cookies } from 'next/headers';\nimport { KhoiTao } from './KhoiTao';\nimport { Chao, DocThang } from './Chao';\n\nexport default async function Trang() {\n  const u = (await cookies()).get('u')?.value;\n  return <main className=\"p-4 text-lg\">{u && <KhoiTao ten={u} />}<Chao /><DocThang /></main>;\n}\n",
 "n14-2:file:src/app/ro2/UserStore.tsx": "'use client';\n// app/ro2/UserStore.tsx — SỬA: mỗi request (và mỗi tab) một store riêng, tạo trong component, phát qua Context\nimport { createContext, useContext, useState } from 'react';\nimport { createStore, useStore, type StoreApi } from 'zustand';\n\ntype U = { ten: string | null };\nconst Ctx = createContext<StoreApi<U> | null>(null);\n\nexport function UserStoreProvider({ ten, children }: { ten: string | null; children: React.ReactNode }) {\n  const [store] = useState(() => createStore<U>()(() => ({ ten })));\n  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;\n}\nexport function useUser<T>(chon: (s: U) => T): T {\n  const store = useContext(Ctx);\n  if (!store) throw new Error('thiếu UserStoreProvider');\n  return useStore(store, chon);\n}\nexport function Chao() {\n  const ten = useUser((s) => s.ten);\n  return <p id=\"chao\">Xin chào {ten ?? 'khách'}</p>;\n}\n",
 "n14-2:file:src/app/ro2/page.tsx": "import { cookies } from 'next/headers';\nimport { UserStoreProvider, Chao } from './UserStore';\n\nexport default async function Trang() {\n  const u = (await cookies()).get('u')?.value ?? null;\n  return <main className=\"p-4 text-lg\"><UserStoreProvider ten={u}><Chao /></UserStoreProvider></main>;\n}\n",
 "n14-2:ro": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/ro'\n✓ Compiled successfully in 26.3s\n├ ƒ /ro\n└ ƒ /ro2\n$ curl: An đăng nhập (cookie u=An), rồi một KHÁCH không cookie — mỗi trang hai dòng: hook · getState()\n/ro   An    → Xin chào khách  ·  getState(): An\n/ro   khách → Xin chào khách  ·  getState(): An\n/ro2  An    → Xin chào An\n/ro2  khách → Xin chào khách\n$ rồi Binh đăng nhập, rồi lại một khách\n/ro   u=Binh → Xin chào khách  ·  getState(): Binh\n/ro   khách → Xin chào khách  ·  getState(): Binh",
 "n14-2:file:src/lib/gio.ts": "// lib/gio.ts — giỏ hàng lưu localStorage (persist)\nimport { create } from 'zustand';\nimport { persist, createJSONStorage } from 'zustand/middleware';\n\nexport const useGio = create<{ n: number; them: () => void }>()(\n  persist((set) => ({ n: 0, them: () => set((s) => ({ n: s.n + 1 })) }), {\n    name: 'gio',\n    storage: createJSONStorage(() => localStorage),\n  }),\n);\n",
 "n14-2:file:src/app/gio-luu/page.tsx": "'use client';\nimport { useGio } from '@/lib/gio';\nexport default function Trang() {\n  const n = useGio((s) => s.n);\n  return <p id=\"dem\" className=\"p-4 text-lg\">{n} món trong giỏ</p>;\n}\n",
 "n14-2:file:src/lib/gio2.ts": "// lib/gio2.ts — SỬA: không tự nạp lúc tạo store (skipHydration), nạp SAU lần vẽ đầu\nimport { create } from 'zustand';\nimport { persist, createJSONStorage } from 'zustand/middleware';\n\nexport const useGio2 = create<{ n: number; them: () => void }>()(\n  persist((set) => ({ n: 0, them: () => set((s) => ({ n: s.n + 1 })) }), {\n    name: 'gio',\n    storage: createJSONStorage(() => localStorage),\n    skipHydration: true,\n  }),\n);\n",
 "n14-2:file:src/app/gio-luu2/page.tsx": "'use client';\nimport { useEffect } from 'react';\nimport { useGio2 } from '@/lib/gio2';\nexport default function Trang() {\n  useEffect(() => { useGio2.persist.rehydrate(); }, []);\n  const n = useGio2((s) => s.n);\n  return <p id=\"dem\" className=\"p-4 text-lg\">{n} món trong giỏ</p>;\n}\n",
 "n14-2:persist": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/gio-luu|zustand|storage' | head\n✓ Compiled successfully in 6.2s\n├ ○ /gio-luu\n└ ○ /gio-luu2\n$ curl -s 127.0.0.1:19398/gio-luu | grep -oE 'id=\"dem\"[^>]*>[^/]*' | sed -E 's/<!-- -->//g; s/.*>//' | sed 's/^/HTML máy chủ \\/gio-luu: /'\nHTML máy chủ /gio-luu: 0 món trong giỏ<\n$ Chromium: localStorage.gio = { n: 3 } rồi tải lại trang (next start)\n/gio-luu  · 3 món trong giỏ · 0 lỗi console\n/gio-luu2 · 3 món trong giỏ · 0 lỗi console\n$ grep -m1 -i 'zustand persist' ~/.rtq-nxj/nen-c14s.log | cut -c1-150 || echo '(log máy chủ: không có cảnh báo persist)'",
 "n14-2:file:tdz3.mjs": "// tdz3.mjs — vì sao: create() CHƯA trả về khi persist nạp localStorage (đồng bộ) và gọi onRehydrateStorage\nconst kho = new Map([['auth-storage', JSON.stringify({ state: { user: { id: 1, ten: 'An' }, isAuthenticated: true }, version: 0 })]]);\nglobalThis.localStorage = { getItem: (k) => kho.get(k) ?? null, setItem: (k, v) => kho.set(k, v), removeItem: (k) => kho.delete(k) };\nconst { create } = await import('zustand');\nconst { persist, createJSONStorage } = await import('zustand/middleware');\nconsole.log('1 · bắt đầu create()');\nconst useAuthStore = create()(persist(() => ({ user: null, isHydrated: false }), {\n  name: 'auth-storage', storage: createJSONStorage(() => localStorage),\n  onRehydrateStorage: () => () => {\n    console.log('2 · onRehydrateStorage chạy — create() vẫn chưa trả về');\n    try { useAuthStore.setState({ isHydrated: true }); } catch (e) { console.log('   ' + e.constructor.name + ': ' + e.message); }\n  },\n}));\nconsole.log('3 · create() trả về · isHydrated =', useAuthStore.getState().isHydrated);\nconst useSua = create()(persist((set) => ({ user: null, isHydrated: false, daNap: () => set({ isHydrated: true }) }), {\n  name: 'auth-storage', storage: createJSONStorage(() => localStorage),\n  onRehydrateStorage: () => (state) => state?.daNap(),          // SỬA: gọi action của chính state, không chạm biến useSua\n}));\nconsole.log('4 · bản sửa · isHydrated =', useSua.getState().isHydrated, '· user =', JSON.stringify(useSua.getState().user));\n",
 "n14-2:tdz": "$ frontend/: zustand 4.5.7 (node_modules thật của kho) — chép ĐÚNG khuôn onRehydrateStorage của src/store/authStore.ts:179-199\nzustand 4.5.7\nlocalStorage CÓ · user = {\"id\":1,\"ten\":\"An\"} · isHydrated = false · isLoading = true\nlocalStorage rỗng · user = null · isHydrated = false · isLoading = true\n$ node tdz3.mjs\n1 · bắt đầu create()\n2 · onRehydrateStorage chạy — create() vẫn chưa trả về\n   ReferenceError: Cannot access 'useAuthStore' before initialization\n3 · create() trả về · isHydrated = false\n4 · bản sửa · isHydrated = true · user = {\"id\":1,\"ten\":\"An\"}",
 "n14-2:ro4": "$ CÙNG các tệp /ro, /ro2 — chỉ đổi zustand 5.1.0 → 4.5.7 (bản cuongthai.com đang dùng)\nzustand 4.5.7\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/ro'\n✓ Compiled successfully in 21.9s\n├ ƒ /ro\n└ ƒ /ro2\n$ curl: An đăng nhập (cookie u=An), rồi một KHÁCH không cookie — mỗi trang hai dòng: hook · getState()\n/ro   An    → Xin chào khách  ·  getState(): An\n/ro   khách → Xin chào khách  ·  getState(): An\n/ro2  An    → Xin chào An\n/ro2  khách → Xin chào khách\n$ rồi Binh đăng nhập, rồi lại một khách\n/ro   u=Binh → Xin chào khách  ·  getState(): Binh\n/ro   khách → Xin chào khách  ·  getState(): Binh",
 "n14-2:persist4": "$ CÙNG /gio-luu, /gio-luu2 — zustand 4.5.7\nzustand 4.5.7\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/gio-luu'\n✓ Compiled successfully in 7.4s\n├ ○ /gio-luu\n└ ○ /gio-luu2\n$ Chromium: localStorage.gio = { n: 3 } rồi tải lại trang (next start, zustand 4.5.7)\n/gio-luu  · 3 món trong giỏ · 0 lỗi console\n/gio-luu2 · 3 món trong giỏ · 0 lỗi console",
 "anh-nxj-14-2:gio": {
  "url": "http://127.0.0.1:19398/gio",
  "vp": [
   520,
   200
  ],
  "rect": {},
  "console": [
   {
    "kieu": "log",
    "chu": "render DemMon"
   },
   {
    "kieu": "log",
    "chu": "render GhiChu"
   },
   {
    "kieu": "log",
    "chu": "render CaStore"
   },
   {
    "kieu": "log",
    "chu": "render GhiChu"
   },
   {
    "kieu": "log",
    "chu": "render CaStore"
   },
   {
    "kieu": "log",
    "chu": "render GhiChu"
   },
   {
    "kieu": "log",
    "chu": "render CaStore"
   },
   {
    "kieu": "log",
    "chu": "render GhiChu"
   },
   {
    "kieu": "log",
    "chu": "render CaStore"
   },
   {
    "kieu": "log",
    "chu": "render DemMon"
   },
   {
    "kieu": "log",
    "chu": "render CaStore"
   },
   {
    "kieu": "log",
    "chu": "render DemMon"
   },
   {
    "kieu": "log",
    "chu": "render CaStore"
   }
  ],
  "ketQua": {
   "cuoi": "2 món · Ghi chú: xxxx"
  }
 },
 "anh-nxj-14-2:gio-ctx": {
  "url": "http://127.0.0.1:19398/gio-ctx",
  "vp": [
   520,
   200
  ],
  "rect": {},
  "console": [
   {
    "kieu": "log",
    "chu": "render DemMon"
   },
   {
    "kieu": "log",
    "chu": "render GhiChu"
   },
   {
    "kieu": "log",
    "chu": "render DemMon"
   },
   {
    "kieu": "log",
    "chu": "render GhiChu"
   },
   {
    "kieu": "log",
    "chu": "render DemMon"
   },
   {
    "kieu": "log",
    "chu": "render GhiChu"
   },
   {
    "kieu": "log",
    "chu": "render DemMon"
   },
   {
    "kieu": "log",
    "chu": "render GhiChu"
   },
   {
    "kieu": "log",
    "chu": "render DemMon"
   },
   {
    "kieu": "log",
    "chu": "render GhiChu"
   },
   {
    "kieu": "log",
    "chu": "render DemMon"
   },
   {
    "kieu": "log",
    "chu": "render GhiChu"
   }
  ],
  "ketQua": {
   "cuoi": "2 món · Ghi chú: xxxx"
  }
 },
 "anh-nxj-14-2:obj-dev": {
  "url": "http://127.0.0.1:19399/gio-obj",
  "vp": [
   900,
   560
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
   },
   {
    "kieu": "error",
    "chu": "The result of getServerSnapshot should be cached to avoid an infinite loop"
   },
   {
    "kieu": "pageerror",
    "chu": "Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops."
   }
  ],
  "ketQua": {
   "dem": "(không có #dem)"
  }
 },
 "anh-nxj-14-2:shallow-dev": {
  "url": "http://127.0.0.1:19399/gio-shallow",
  "vp": [
   520,
   120
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
   "dem": "0 món · "
  }
 },
 "anh-nxj-14-2:luu": {
  "url": "http://127.0.0.1:19398/gio-luu",
  "vp": [
   520,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "dem": "3 món trong giỏ"
  }
 },
 "anh-nxj-14-2:luu2": {
  "url": "http://127.0.0.1:19398/gio-luu2",
  "vp": [
   520,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "dem": "3 món trong giỏ"
  }
 },
 "anh-nxj-14-2:luu4": {
  "url": "http://127.0.0.1:19398/gio-luu",
  "vp": [
   520,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "dem": "3 món trong giỏ"
  }
 },
 "anh-nxj-14-2:luu24": {
  "url": "http://127.0.0.1:19398/gio-luu2",
  "vp": [
   520,
   120
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "dem": "3 món trong giỏ"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-14-2', code: 'NXJ 14.2', title: 'Client global state with Zustand', sub: 'Chapter 14 · Lesson 14.2' };
const O = (k) => { const v = DU_LIEU[`n14-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-14-2:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ (app|lib)\//.test(l)).join('\n');
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-14-2', ten, { vp: 520, ...o });
const en = (s) => s.replace(/ món/g, ' items').replace('Ghi chú', 'Note').replace(/ lần/g, '×').replace('khách', 'guest').replace('Xin chào', 'Hello').replace('trong giỏ', 'in the cart').replace(/lỗi console/g, 'console errors');
const bocViet = (s) => s.replace(/\/\/ .*$/gm, (m) => (/[ạ-ỹđ]/i.test(m) ? '' : m)).replace(/[ \t]+$/gm, '');

// ── số đo (n14-2 · Next.js 16.4.6 · React 19.3.0 · zustand 5.1.0 / 4.5.7 · Chromium)
const TSC = doan('bai', 'npx next typegen'), TSC2 = doan('bai', "echo 'tsc: 0 lỗi'"), NGOAI = doan('bai', 'ngoài React');
const RD = doan('render', 'Chromium'), Z = RD[0], CX = RD[1];
const rc = (s) => Object.fromEntries([...s.matchAll(/(\w+) (\d+) lần/g)].map((m) => [m[1], Number(m[2])]));
const RZ = rc(Z), RC = rc(CX);
const SH = doan('shallow', 'Chromium');
const RO = doan('ro', 'curl:'), RO2 = doan('ro', 'Binh'), RO4 = doan('ro4', 'curl:');
const PS = O('persist').split('\n').filter((l) => /^HTML|^\/gio-luu /.test(l)), PS4 = doan('persist4', 'Chromium').filter((l) => /^\/gio-luu /.test(l));
const TDZ = doan('tdz', 'frontend/'), TDZ3 = doan('tdz', 'node tdz3.mjs');
if (TSC.filter((l) => /TS7006/.test(l)).length !== 2 || !/0 lỗi/.test(TSC2[0])) throw new Error('tsc đổi');
if (!(RZ.DemMon === 3 && RZ.GhiChu === 4 && RZ.CaStore === 6 && RC.DemMon === 6 && RC.GhiChu === 6)) throw new Error('đếm render đổi');
if (!/getServerSnapshot should be cached/.test(SH.join('\n')) || !/Maximum update depth/.test(SH.join('\n')) || !/shallow-dev · 0 dòng/.test(SH.join('\n'))) throw new Error('shallow đổi');
if (!/khách → Xin chào khách  ·  getState\(\): An/.test(RO.join('\n')) || !/khách → Xin chào khách  ·  getState\(\): Binh/.test(RO2.join('\n')) || !/\/ro2  An    → Xin chào An/.test(RO.join('\n')) || RO.join() !== RO4.join()) throw new Error('rò đổi');
if (!/0 món/.test(PS[0]) || !/3 món trong giỏ · 0 lỗi/.test(PS[1]) || !/3 món trong giỏ · 0 lỗi/.test(PS4[0])) throw new Error('persist đổi');
if (!/isHydrated = false · isLoading = true/.test(TDZ[1]) || !/ReferenceError: Cannot access 'useAuthStore' before initialization/.test(TDZ3.join('\n')) || !/bản sửa · isHydrated = true/.test(TDZ3.join('\n'))) throw new Error('tdz đổi');

const CART = bo(F('src/lib/cart.ts')).split('\n').filter((l) => l.trim() && !/^import/.test(l)).join('\n').replace(/\n  clear: .*$/m, '').replace('  add: (item) => set((s) => ({ items: [...s.items, item] })),', '  add: (item) =>\n    set((s) => ({ items: [...s.items, item] })),');
const PHAN = bocViet(bo(F('src/app/gio/Phan.tsx'))).split('\n');
const lay = (ten) => { const i = PHAN.findIndex((l) => l.includes(`function ${ten}()`)); return PHAN.slice(i, PHAN.indexOf('}', i) + 1).join('\n'); };
const tr = (s) => s.replace('// selector: chỉ phần items.length', '// selector: only items.length').replace('// selector: chỉ phần note', '// selector: only note').replace('// BẪY: không selector ⇒ theo dõi CẢ store', '// TRAP: no selector ⇒ the WHOLE store');
const PH = bo(F('src/app/gio/Phan.tsx')).split('\n');
const fn = (ten) => { const i = PH.findIndex((l) => l.includes(`function ${ten}()`)); return tr(PH.slice(i, PH.indexOf('}', i) + 1).join('\n')).replace(/\s+\/\/ (selector|TRAP).*$/gm, ''); };
const OBJ = bo(F('src/app/gio-obj/page.tsx')).split('\n').find((l) => l.includes('useCart(')).trim().replace('= useCart((s) => ', '= useCart(\n  (s) => ').replace(' }));', ' })\n);');
const SHW = bo(F('src/app/gio-shallow/page.tsx')).split('\n').find((l) => l.includes('useCart(')).trim().replace('= useCart(useShallow((s) => ', '= useCart(\n  useShallow((s) => ').replace(' })));', ' }))\n);');
const KT = bo(F('src/app/ro/KhoiTao.tsx')).split('\n').filter((l) => l.trim() && l !== "'use client';" && !/^import/.test(l)).join('\n').replace(/^\/\/ .*\n/m, '');
const US = bo(F('src/app/ro2/UserStore.tsx')).split('\n');
const PROV = US.slice(US.findIndex((l) => l.includes('export function UserStoreProvider')), US.findIndex((l) => l.includes('export function UserStoreProvider')) + 4).join('\n');
const GIO = 'type Gio = { n: number; them: () => void };\n' + bo(F('src/lib/gio.ts')).split('\n').filter((l) => l.trim() && !/^import/.test(l)).join('\n').replace('create<{ n: number; them: () => void }>()(', 'create<Gio>()(').replace('persist((set) => ({ n: 0, them: () => set((s) => ({ n: s.n + 1 })) }), {', 'persist((set) => ({\n    n: 0,\n    them: () => set((s) => ({ n: s.n + 1 })),\n  }), {');
const TDZF = F('tdz3.mjs').split('\n');
const TDZC0 = TDZF.slice(TDZF.findIndex((l) => l.startsWith('const useAuthStore')), TDZF.findIndex((l) => l.startsWith("console.log('3"))).join('\n').replace("console.log('2 · onRehydrateStorage chạy — create() vẫn chưa trả về');", "console.log('2 · …');").replace(/\n\s+try \{ useAuthStore\.setState\(\{ isHydrated: true \}\); \} catch \(e\) \{ console\.log\('   ' \+ e\.constructor\.name \+ ': ' \+ e\.message\); \}/, '\n    useAuthStore.setState({ isHydrated: true });   // TDZ');
const TDZC = TDZC0.replace('create()(persist(() => ({ user: null, isHydrated: false }), {', 'create()(persist(\n  () => ({ user: null, isHydrated: false }), {').replace("name: 'auth-storage', storage: createJSONStorage(() => localStorage),", "name: 'auth-storage',\n  storage: createJSONStorage(() => localStorage),");
const rows = (ls) => ls.map((l) => l.replace(/\s+/g, ' ').replace('/ro An → ', '').split(' → '));

export const S = [
  { cover: true, nhan: 'Chapter 14 · Lesson 14.2', t: 'Client global state<br>with Zustand', sub: 'A store without a Provider, selectors measured in render counts, the selector that loops forever, a store shared by every request on the server — and the persist flag that never flips',
    en: 'Lesson fourteen point two: client global state with Zustand. A store without a Provider; selectors measured in render counts; the selector that loops forever; a store shared by every request on the server; and the persist flag that never flips.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>create&lt;T&gt;()(…)</code>: a typed store — the lesson's untyped one is two <code>TS7006</code></li>
    <li>Selectors: ${RZ.DemMon} renders instead of ${RC.DemMon} — measured against Context</li>
    <li>Two traps: the whole store (${RZ.CaStore} renders), and a new object per call (infinite loop)</li>
    <li>Next.js: a module store on the <b>server</b> is shared by every request</li>
    <li><code>persist</code>: when it really loads, and why <code>isHydrated</code> can stay <code>false</code></li></ul>`,
    en: 'Five takeaways: a typed store, where the lesson\'s untyped one gives two TS seven zero zero six errors; selectors, three renders instead of six, measured against Context; two selector traps; a module store on the server shared by every request; and persist, including why an isHydrated flag can stay false forever.' },
  { t: "A store in a few lines — the lesson's code, and tsc", body: two(D(tsx(bocViet(bo(F('src/lib/cart-bai.ts'))).trim(), { sm: true, hl: [4] }), tn(['$ npx tsc --noEmit', ...TSC].join('\n'), { fs: 13, wrap: 60, title: 'tsc (real)' })),
    D(tsx(CART, { sm: true, hl: [10, 11, 12] }), box('create&lt;Cart&gt;()(…)', 'Two pairs of parentheses: the first takes the type, the second the initializer. Now <code>item</code> and <code>s</code> have types — <code>tsc</code>: ' + TSC2[0].replace('tsc: 0 lỗi', '0 errors') + '.', 'xanh')), 'r64'),
    en: 'A store in a few lines. The lesson\'s code in strict TypeScript: two TS seven zero zero six errors, item and s are implicitly any. Give the store its type with create of Cart, then a second pair of parentheses with the initializer. Zero errors.' },
  { t: 'A store is a module — no Provider, usable outside React', body: two(D(tn(['$ npx tsx -e "import { useCart } from \'./src/lib/cart\'; … subscribe … getState().add(…) ×2"', ...NGOAI].join('\n'), { fs: 15, wrap: 58, title: 'a plain Node script (real)' }),
      box('What that shows', 'No component, no Provider, not even a browser: <code>useCart.getState()</code> reads and calls actions, <code>subscribe</code> is told about every <code>set</code>. A socket callback or a utility can do the same.', 'lam')),
    D(box('In components', '<code>useCart(selector)</code> subscribes the component to <b>one slice</b>. No <code>&lt;Provider&gt;</code> anywhere in the tree — the page imports the module.', 'xanh'),
      box('Easy to abuse', 'Anything can write to it from anywhere. Keep writes in the store\'s own actions; and keep it <b>client state</b> — server data belongs to a cache tool (14.1).', 'do2')), ''),
    en: 'A store is a module. A plain Node script can subscribe and call actions, with no component and no Provider. In components, useCart with a selector subscribes to one slice. Easy to abuse: anything can write from anywhere, so keep writes in the store\'s actions, and keep it for client state.' },
  { t: 'Selectors, measured: Zustand vs Context', body: two(D(tsx(fn('DemMon') + '\n' + fn('GhiChu'), { sm: true, hl: [2, 7] }), B('gio', { url: 'localhost:3000/gio', h: 175, w: 440 })),
    D(cmp(['Component', 'Zustand', 'Context'], [
        ['DemMon', `<b>${RZ.DemMon}</b>`, `${RC.DemMon}`],
        ['GhiChu', `<b>${RZ.GhiChu}</b>`, `${RC.GhiChu}`],
      ]), box('How it was counted', 'Chromium, production build: open the page, click <i>Edit note</i> ×3, <i>Add item</i> ×2 — every <code>console.log(\'render …\')</code> counted. 1 first render + 2 adds = 3. With Context, every consumer re-renders on every change: 1 + 5 = 6.', 'lam')), ''),
    en: 'Selectors, measured in a production build. Open the page, edit the note three times, add an item twice. With a selector, the counter rendered three times: once plus two adds; the note four times. With Context, both rendered six times, because every consumer re-renders on every change of the value.' },
  { t: 'Trap 1 — reading the whole store', body: two(D(tsx(fn('CaStore'), { sm: true, hl: [2] }), tn([`# same five clicks · console "render …" counts`, en(Z)].join('\n'), { fs: 14, wrap: 60, title: 'Chromium (real)' })),
    D(box('Measured', `<code>const { items } = useCart()</code> renders <b>${RZ.CaStore}</b> times — every note edit too. No selector = the whole store.`, 'do2'),
      box('Fix', 'Select what you show: <code>useCart((s) =&gt; s.items.length)</code>.', 'xanh')), ''),
    en: 'Trap one: reading the whole store. Destructuring items from useCart with no selector re-rendered six times in the same five clicks, including every note edit, though it only shows a count. Select exactly what you show.' },
  { t: 'Trap 2 — a selector that returns a new object (zustand 5)', body: two(D(tsx(OBJ, { sm: true }), B('obj-dev', { vp: 900, url: 'localhost:3000/gio-obj · next dev', h: 360, w: 480 })),
    D(tn(['# next dev · Chromium console', ...SH.filter((l) => /^obj-dev|^ {3}/.test(l)).map((l) => l.replace('dòng lỗi/cảnh báo', 'errors').replace('(không có #dem)', '(page not rendered)').slice(0, 150))].join('\n'), { fs: 12, wrap: 54, title: 'console (real)' }),
      tsx(SHW, { sm: true }), box('Read it', 'A fresh <code>{ n, note }</code> on every call never equals the last one, so React re-renders forever. <code>useShallow</code> compares key by key: ' + (/shallow-dev · 0 dòng/.test(SH.join()) ? '<b>0 errors</b>, the page renders.' : '?'), 'xanh')), ''),
    en: 'Trap two, in zustand five: a selector that returns a new object every call. React reports getServerSnapshot should be cached, then Maximum update depth exceeded, and the page never renders. Wrap the selector in useShallow, which compares key by key: zero errors.' },
  { t: 'Next.js: a module store on the server is shared by every request', body: two(D(tsx(KT, { sm: true, hl: [2] }), tn(['# curl /ro: An logs in (cookie u=An), then a guest;', '# then Binh, then a guest', ...RO.slice(0, 2), ...RO2].join('\n').replace(/khách/g, 'guest').replace(/Xin chào/g, 'Hello').replace(/\s+·\s+/g, ' · '), { fs: 13, wrap: 56, title: 'curl (real) · zustand 5.1.0 and 4.5.7 alike' })),
    D(box('What leaked', 'One module, one server process. <code>KhoiTao</code> wrote An\'s name while rendering An\'s page; the <b>guest</b> after her read it with <code>getState()</code>. Same in zustand 4.5.7 (cuongthai.com).', 'do2'),
      tsx(PROV.replace('{ ten: string | null; children: React.ReactNode }', 'Props').replace('const [store] = useState(() => createStore<U>()(() => ({ ten })));', 'const [store] = useState(() =>\n    createStore<U>()(() => ({ ten })));'), { sm: true }), box('Fix: one store per request', 'Created inside a component, handed down by Context: ' + RO.slice(2).map((l) => l.replace(/\s+/g, ' ').replace(/khách/g, 'guest').replace(/Xin chào/g, 'Hello')).join(' · ') + '.', 'xanh')), ''),
    en: 'Specific to Next.js: a module store on the server is shared by every request. KhoiTao wrote An\'s name into the store while rendering her page; the guest who came next read An with getState. Then Binh, and the next guest saw Binh. Same in zustand four point five, the version cuongthai.com runs. The fix: create one store per request inside a component, and hand it down through Context.' },
  { t: 'persist: when the stored value really arrives', body: two(D(tsx(GIO, { sm: true, hl: [7, 8] }), tn(['$ curl /gio-luu   # first HTML', en(PS[0].replace(/<$/, '').replace('HTML máy chủ', 'server HTML')), '# Chromium: localStorage.gio = { n: 3 }, reload', ...[PS[1] + ' (5.1.0)', PS4[0] + ' (4.5.7)'].map((l) => en(l.replace('HTML máy chủ', 'server HTML')))].join('\n'), { fs: 13, wrap: 60, title: 'curl + Chromium (real)' })),
    D(B('luu', { url: 'localhost:3000/gio-luu · after load', h: 60, w: 470 }),
      box('Measured', 'The server has no <code>localStorage</code>: its HTML says <b>0</b>. The browser shows <b>3</b> with <b>no</b> hydration error in 5.1.0 or 4.5.7 — the hook renders the initial state while hydrating, then the stored one. The user sees 0, then 3.', 'lam'),
      box('Not "after mount"', 'With a synchronous storage like <code>localStorage</code>, persist reads it <b>inside <code>create()</code></b>, at import — before any component mounts (next slide).', 'xanh')), ''),
    en: 'persist: when the stored value really arrives. The server has no localStorage, so its HTML says zero. In the browser the page shows three with no hydration error, in both versions, because the hook renders the initial state while hydrating, then the stored one. And with localStorage, persist reads it inside create, at import, before anything mounts.' },
  { t: 'The isHydrated flag that never flips — cuongthai.com', body: two(D(tsx(TDZC, { sm: true, hl: [7] }), tn(['$ node tdz3.mjs', ...TDZ3].join('\n').replace(/vẫn chưa trả về/g, 'has not returned yet').replace('chạy —', 'runs —').replace('bắt đầu', 'start').replace('trả về', 'returned').replace('bản sửa', 'fixed'), { fs: 13, wrap: 60, title: 'zustand (real)' })),
    D(tn(["# authStore.ts:179-199 pattern · zustand 4.5.7", ...TDZ.slice(1).map((l) => l.replace(/ · user = .*? · /, ' · ').replace('localStorage CÓ', 'with a stored user').replace('localStorage rỗng', 'empty storage'))].join('\n'), { fs: 13, wrap: 46, title: 'replica (real)' }),
      box('Why', 'The callback runs while <code>create()</code> is still executing: <code>useAuthStore</code> is not assigned yet ⇒ <code>ReferenceError</code>, swallowed. The user is restored; <code>isHydrated</code> stays <code>false</code>.', 'do2'),
      box('Fix', 'Call an action on the <code>state</code> it receives: <code>state?.daNap()</code>.', 'xanh')), ''),
    en: 'The isHydrated flag that never flips. The callback runs while create is still executing, so the store variable does not exist yet: a ReferenceError, swallowed. The user is restored but isHydrated stays false. A replica of cuongthai.com\'s authStore pattern: false, with or without a stored user. The fix: call an action on the state the callback receives.' },
  { t: 'cuongthai.com: which tool holds what', body: icards([
      ['box', 'Zustand · 32 files', 'Feature stores: cart, orders, chat, music, notifications… <code>useAuthStore</code> (persisted as <code>auth-storage</code>) is used in 149 files.'],
      ['layers', 'Context · 2 providers', '<code>ThemeContext</code> and <code>LocaleContext</code> — app-wide, slow-changing values.'],
      ['warn', 'The trap above, shipped', '<code>authStore.ts:179-199</code> — <code>isHydrated</code> cannot flip from <code>onRehydrateStorage</code>; <code>useDashboardStore</code> and <code>/profile</code> already work around it.'],
      ['check', 'What the lesson says', 'Not "auth in Context": auth is a persisted Zustand store; theme and locale are Context.'],
    ], 2),
    en: 'cuongthai.com: thirty-two files use Zustand stores, and useAuthStore, persisted as auth-storage, is used in one hundred forty-nine files. Context holds only theme and locale. And the isHydrated trap is in authStore, lines one seventy-nine to one ninety-nine; two places already work around it.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Store', 'state + actions in one module'), kw('create&lt;T&gt;()(…)', 'a typed store'), kw('Selector', 'subscribe to one slice'), kw('useShallow', 'compare an object key by key'),
      kw('getState / subscribe', 'use the store outside React'), kw('Per-request store', 'createStore + Context on the server'), kw('persist', 'save to localStorage'), kw('onRehydrateStorage', 'runs inside create()'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: store; create of T with two pairs of parentheses; selector; useShallow; getState and subscribe; the per-request store; persist; and onRehydrateStorage, which runs inside create.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Type a store with ${c('create<T>()(…)')}; read it in two distant components`,
      `Log renders; compare a selector with ${c('const { items } = useCart()')}`,
      `Return ${c('{ a, b }')} from a selector; read the error; fix it with ${c('useShallow')}`,
      `Persist it; set ${c('localStorage')} by hand; compare the first HTML with the screen`,
    ]), box('Keep these', `<ul><li>Select exactly what you show</li><li>New object ⇒ useShallow</li><li>On the server, a module store is everyone's</li><li>Never touch the store variable in onRehydrateStorage</li><li>Client state only</li></ul>`, 'lam'), ''),
    en: 'Your turn: type a store and read it in two distant components; log renders with a selector and without; return an object from a selector and fix it with useShallow; persist the store and compare the first HTML with the screen. Keep: select exactly what you show, and remember a module store on the server belongs to everyone.' },
];
export const slides = lamDeck({ chuong: 'Chapter 14 — State management: client and server state', bai: '14.2' }, S);
