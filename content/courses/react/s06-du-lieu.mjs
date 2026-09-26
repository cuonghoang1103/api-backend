import { gallery, slide } from './_slides.mjs';

/**
 * React — Chương 6: Lấy dữ liệu (soạn 25/09/2026 từ khung).
 * GIỮ slug khung: rx-6-1-fetch · rx-6-2-tanstack · rx-6-3-mutation · rx-6-4-loi-api (type LESSON). Thêm rx-6-0-slides, rx-6-5-kiem-tra.
 * Mọi output trong bài chạy THẬT 25/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch06
 * (react 19.3.0 · @tanstack/react-query 5.103.2 · @tanstack/react-query-devtools 5.103.2 · msw 2.15.0 · vite 8.3.1 ·
 *  vitest 5.0.1 · typescript 6.0.3 · @testing-library/react 16.3.3 · jsdom 30.1.1 · Chromium qua Playwright).
 * Mã dài trong bài nằm ở hằng SN — sinh tự động từ chính các file đã chạy (tsc -b sạch, 112 test xanh — 81 của dự án + 31 của các ví dụ trong bài).
 * Deck: scripts/slides-src/rx-06.mjs (29 slide). Cuộc đua đo trong Chromium thật (MSW trong trình duyệt, trễ ngẫu nhiên).
 */

const H = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '&#96;').replace(/\$\{/g, '&#36;{');
const pre = (lang, s) => '<pre><code class="language-' + lang + '">' + H(s) + '</code></pre>';
const out = (s) => '<div class="out">' + H(s) + '</div>';
const LINK = (href, ico, title, sub) => '<a class="link-card" href="' + href + '" target="_blank" rel="noopener"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';
const S6 = (n, c) => slide('rx-06', n, c);
const NL = String.fromCharCode(10);
/** Lọc / cắt dòng của một output thật (chỉ chọn dòng, không sửa chữ). */
const LOC = (s, f) => s.split(NL).filter(f).join(NL);
const DAU = (s, a, b) => s.split(NL).slice(a, b).join(NL);


/* ─── Mã trong bài: SINH TỰ ĐỘNG từ dự án thử ch06 (tsc -b sạch + vitest xanh 25/09/2026) — đừng sửa tay ─── */
const SN = {
 "handlers": "import { http, HttpResponse } from 'msw';\nimport { datLichSchema } from '../schema/dat-lich';\nimport type { TrangThaiLichHen } from '../types';\nimport { db, khungGioTrongNgay } from './co-so-du-lieu';\nimport { dieuKhien, treMang } from './dieu-khien';\n\nconst loi500 = () => HttpResponse.json({ loi: 'Máy chủ đang bận, thử lại sau' }, { status: 500 });\n\n/** Sáu API của phòng khám (hợp đồng dự án, mục 5). Mỗi handler: \"request khớp đường dẫn này thì trả cái này\". */\nexport const handlers = [\n  http.get('/api/bac-si', async () => {\n    await treMang();\n    if (dieuKhien.loi.has('bac-si')) return loi500();\n    return HttpResponse.json(dieuKhien.rong ? [] : db.bacSi());\n  }),\n\n  http.get('/api/bac-si/:id', async ({ params }) => {\n    await treMang();\n    const bs = db.bacSi().find((b) => b.id === params.id);\n    if (!bs) return HttpResponse.json({ loi: `Không có bác sĩ ${String(params.id)}` }, { status: 404 });\n    return HttpResponse.json(bs);\n  }),\n\n  http.get('/api/bac-si/:id/khung-gio', async ({ params, request }) => {\n    await treMang();\n    if (dieuKhien.loi.has('khung-gio')) return loi500();\n    const ngay = new URL(request.url).searchParams.get('ngay') ?? '';\n    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(ngay)) {\n      return HttpResponse.json({ loi: 'Thiếu ?ngay=YYYY-MM-DD' }, { status: 400 });\n    }\n    if (!db.bacSi().some((b) => b.id === params.id)) {\n      return HttpResponse.json({ loi: 'Không có bác sĩ này' }, { status: 404 });\n    }\n    return HttpResponse.json(khungGioTrongNgay(String(params.id), ngay));\n  }),\n\n  http.post('/api/lich-hen', async ({ request }) => {\n    await treMang();\n    if (dieuKhien.loi.has('dat-lich')) return loi500();\n    const body = (await request.json()) as { bacSiId: string; khungGioId: string } & Record<string, unknown>;\n    const kq = datLichSchema.safeParse(body); // máy chủ kiểm LẠI bằng chính schema của form (Bài 3.3)\n    if (!kq.success) return HttpResponse.json({ loi: 'Dữ liệu không hợp lệ' }, { status: 400 });\n    const kg = db.timKhungGio(body.khungGioId);\n    if (!kg || kg.bacSiId !== body.bacSiId) return HttpResponse.json({ loi: 'Không có khung giờ này' }, { status: 404 });\n    if (kq.data.benhNhan.soDienThoai === '0999999999') {\n      return HttpResponse.json({ loi: 'Số điện thoại này đang có một lịch chờ xác nhận' }, { status: 409 });\n    }\n    if (!kg.conTrong) return HttpResponse.json({ loi: 'Khung giờ này vừa có người đặt' }, { status: 409 });\n    kg.conTrong = false;\n    const lh = db.themLichHen({ bacSiId: kg.bacSiId, khungGioId: kg.id, batDau: kg.batDau, ...kq.data, trangThai: 'cho-xac-nhan' });\n    return HttpResponse.json(lh, { status: 201 });\n  }),\n\n  http.get('/api/lich-hen', async () => {\n    await treMang();\n    return HttpResponse.json(db.lichHen());\n  }),\n\n  http.patch('/api/lich-hen/:id', async ({ params, request }) => {\n    await treMang();\n    if (dieuKhien.loi.has('huy')) return loi500();\n    const { trangThai } = (await request.json()) as { trangThai: TrangThaiLichHen };\n    const lh = db.suaLichHen(String(params.id), { trangThai });\n    if (!lh) return HttpResponse.json({ loi: 'Không có lịch hẹn này' }, { status: 404 });\n    if (trangThai === 'da-huy') {\n      const kg = db.timKhungGio(lh.khungGioId);\n      if (kg) kg.conTrong = true; // huỷ ⇒ khung giờ mở lại\n    }\n    return HttpResponse.json(lh);\n  }),\n];",
 "handlersGet": "import { http, HttpResponse } from 'msw';\nimport { datLichSchema } from '../schema/dat-lich';\nimport type { TrangThaiLichHen } from '../types';\nimport { db, khungGioTrongNgay } from './co-so-du-lieu';\nimport { dieuKhien, treMang } from './dieu-khien';\n\nconst loi500 = () => HttpResponse.json({ loi: 'Máy chủ đang bận, thử lại sau' }, { status: 500 });\n\n/** Sáu API của phòng khám (hợp đồng dự án, mục 5). Mỗi handler: \"request khớp đường dẫn này thì trả cái này\". */\nexport const handlers = [\n  http.get('/api/bac-si', async () => {\n    await treMang();\n    if (dieuKhien.loi.has('bac-si')) return loi500();\n    return HttpResponse.json(dieuKhien.rong ? [] : db.bacSi());\n  }),\n\n  http.get('/api/bac-si/:id', async ({ params }) => {\n    await treMang();\n    const bs = db.bacSi().find((b) => b.id === params.id);\n    if (!bs) return HttpResponse.json({ loi: `Không có bác sĩ ${String(params.id)}` }, { status: 404 });\n    return HttpResponse.json(bs);\n  }),\n\n  http.get('/api/bac-si/:id/khung-gio', async ({ params, request }) => {\n    await treMang();\n    if (dieuKhien.loi.has('khung-gio')) return loi500();\n    const ngay = new URL(request.url).searchParams.get('ngay') ?? '';\n    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(ngay)) {\n      return HttpResponse.json({ loi: 'Thiếu ?ngay=YYYY-MM-DD' }, { status: 400 });\n    }\n    if (!db.bacSi().some((b) => b.id === params.id)) {\n      return HttpResponse.json({ loi: 'Không có bác sĩ này' }, { status: 404 });\n    }\n    return HttpResponse.json(khungGioTrongNgay(String(params.id), ngay));\n  }),\n  // … POST /api/lich-hen, GET /api/lich-hen, PATCH /api/lich-hen/:id — Bài 6.3\n];",
 "handlersPost": "  http.post('/api/lich-hen', async ({ request }) => {\n    await treMang();\n    if (dieuKhien.loi.has('dat-lich')) return loi500();\n    const body = (await request.json()) as { bacSiId: string; khungGioId: string } & Record<string, unknown>;\n    const kq = datLichSchema.safeParse(body); // máy chủ kiểm LẠI bằng chính schema của form (Bài 3.3)\n    if (!kq.success) return HttpResponse.json({ loi: 'Dữ liệu không hợp lệ' }, { status: 400 });\n    const kg = db.timKhungGio(body.khungGioId);\n    if (!kg || kg.bacSiId !== body.bacSiId) return HttpResponse.json({ loi: 'Không có khung giờ này' }, { status: 404 });\n    if (kq.data.benhNhan.soDienThoai === '0999999999') {\n      return HttpResponse.json({ loi: 'Số điện thoại này đang có một lịch chờ xác nhận' }, { status: 409 });\n    }\n    if (!kg.conTrong) return HttpResponse.json({ loi: 'Khung giờ này vừa có người đặt' }, { status: 409 });\n    kg.conTrong = false;\n    const lh = db.themLichHen({ bacSiId: kg.bacSiId, khungGioId: kg.id, batDau: kg.batDau, ...kq.data, trangThai: 'cho-xac-nhan' });\n    return HttpResponse.json(lh, { status: 201 });\n  }),",
 "mainMsw": "/** App này chưa có máy chủ thật (tới Chương 14) ⇒ luôn bật API giả. Dự án có backend: chỉ bật khi dev. */\nasync function batApiGia() {\n  const { worker } = await import('./mocks/browser'); // import động: mã MSW tách ra file riêng\n  await worker.start({ onUnhandledRequest: 'bypass', quiet: true });\n}\n\nbatApiGia().then(() => {\n  createRoot(document.getElementById('root')!).render(\n    <StrictMode>\n      <QueryClientProvider client={queryClient}>\n        <App />\n        <ReactQueryDevtools initialIsOpen={false} /> {/* chỉ có mặt khi dev; build production tự bỏ */}\n      </QueryClientProvider>\n    </StrictMode>,\n  );\n});",
 "setupMsw": "// Chương 6: API giả chạy suốt bộ test. Request nào KHÔNG có handler ⇒ test hỏng ngay (đỡ gọi nhầm ra mạng thật).\nbeforeAll(() => server.listen({ onUnhandledRequest: 'error' }));\nafterAll(() => server.close());",
 "coSoDuLieu": "import { danhSachBacSi } from '../du-lieu/bac-si';\nimport type { LichHenCoGio } from '../api/phong-kham';\nimport type { BacSi, KhungGio } from '../types';\n\n/**\n * \"Cơ sở dữ liệu\" của máy chủ GIẢ — chỉ là vài biến trong bộ nhớ.\n * Trình duyệt: sống tới khi F5. Test: setup.ts gọi datLaiDuLieu() sau mỗi test để test sau bắt đầu sạch.\n */\nconst GIO = ['08:00', '09:30', '14:00', '15:30'];\n\nlet bacSi: BacSi[] = [];\nlet khungGio: KhungGio[] = [];\nlet lichHen: LichHenCoGio[] = [];\nlet dem = 0;\n\n/** Khung giờ của một bác sĩ trong một ngày: sinh ra lần đầu có người hỏi, rồi nhớ lại (để đặt lịch làm nó \"kín\"). */\nexport function khungGioTrongNgay(bacSiId: string, ngay: string): KhungGio[] {\n  const ma = `${bacSiId}-${ngay}`;\n  if (!khungGio.some((kg) => kg.id.startsWith(ma))) {\n    const so = Number(bacSiId.slice(3)) + Number(ngay.slice(8, 10)); // bs-3 + ngày 01 = 4\n    khungGio.push(\n      ...GIO.map((g, k) => ({\n        id: `${ma}-${g.replace(':', '')}`, // 'bs-2-2026-10-01-1400'\n        bacSiId,\n        batDau: `${ngay}T${g}:00+07:00`,\n        conTrong: (so + k) % 4 !== 0, // mỗi ngày một khung đã kín sẵn, ở chỗ khác nhau\n      })),\n    );\n  }\n  return khungGio.filter((kg) => kg.id.startsWith(ma));\n}\n\nexport const db = {\n  bacSi: () => bacSi,\n  timKhungGio: (id: string) => khungGio.find((kg) => kg.id === id),\n  lichHen: () => lichHen,\n  themLichHen(lh: Omit<LichHenCoGio, 'id'>): LichHenCoGio {\n    const moi = { ...lh, id: `lh-${++dem}` };\n    lichHen = [...lichHen, moi];\n    return moi;\n  },\n  suaLichHen(id: string, sua: Partial<LichHenCoGio>): LichHenCoGio | undefined {\n    const cu = lichHen.find((lh) => lh.id === id);\n    if (!cu) return undefined;\n    const moi = { ...cu, ...sua };\n    lichHen = lichHen.map((lh) => (lh.id === id ? moi : lh));\n    return moi;\n  },\n};\n\nexport function datLaiDuLieu() {\n  bacSi = danhSachBacSi.map((bs) => ({ ...bs }));\n  khungGio = [];\n  lichHen = [];\n  dem = 0;\n}\ndatLaiDuLieu();",
 "dieuKhien": "import { delay } from 'msw';\n\n/**\n * Núm vặn \"mạng giả\" — CHỈ để học và để chụp ảnh các trạng thái. Đọc từ URL của trang lúc tải:\n *   ?tre=2000        mọi câu trả lời chậm 2 giây      ?tre=vo-han   treo mãi (xem skeleton)\n *   ?tre=ngau-nhien  chậm ngẫu nhiên 100–1500 ms (tái hiện cuộc đua)\n *   ?loi=bac-si,huy  những API này trả 500             ?rong=1       danh sách bác sĩ rỗng\n * Không có tham số (và trong test) ⇒ delay() của MSW: 100–400 ms ngẫu nhiên trên trình duyệt, 5 ms trong Node.\n */\nconst q = new URLSearchParams(globalThis.location?.search ?? '');\n\nexport const dieuKhien = {\n  tre: q.get('tre'),\n  loi: new Set((q.get('loi') ?? '').split(',').filter(Boolean)),\n  rong: q.get('rong') === '1',\n};\n\nexport async function treMang() {\n  const t = dieuKhien.tre;\n  if (t === 'vo-han') return delay('infinite');\n  if (t === 'ngau-nhien') return delay(100 + Math.floor(Math.random() * 1400));\n  if (t && Number.isFinite(Number(t))) return delay(Number(t));\n  return delay(); // \"realistic\": trình duyệt 100–400 ms, Node 5 ms\n}",
 "browser": "import { setupWorker } from 'msw/browser';\nimport { handlers } from './handlers';\n\n/** Trình duyệt: Service Worker (public/mockServiceWorker.js) chặn fetch và hỏi các handler. */\nexport const worker = setupWorker(...handlers);",
 "node": "import { setupServer } from 'msw/node';\nimport { handlers } from './handlers';\n\n/** Node (Vitest): cùng các handler, chặn ở tầng module http/fetch của Node — không có Service Worker. */\nexport const server = setupServer(...handlers);",
 "setup": "import '@testing-library/jest-dom/vitest';\nimport { cleanup } from '@testing-library/react';\nimport { afterAll, afterEach, beforeAll } from 'vitest';\nimport { datLaiDuLieu } from '../mocks/co-so-du-lieu';\nimport { server } from '../mocks/node';\nimport { useDatLichStore } from '../store/dat-lich-store';\nimport { useThongBaoStore } from '../store/thong-bao-store';\n\n// Chương 6: API giả chạy suốt bộ test. Request nào KHÔNG có handler ⇒ test hỏng ngay (đỡ gọi nhầm ra mạng thật).\nbeforeAll(() => server.listen({ onUnhandledRequest: 'error' }));\nafterAll(() => server.close());\n\n// Vitest mặc định globals: false ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.\nafterEach(() => {\n  cleanup();\n  server.resetHandlers(); // bỏ các handler một test tự thêm bằng server.use(...)\n  datLaiDuLieu(); // \"cơ sở dữ liệu\" giả về như mới\n  // Chương 5: ba thứ sống NGOÀI component nên cleanup() không dọn — test trước để lại là test sau thấy.\n  window.history.replaceState(null, '', '/'); // URL (?ck=…&q=…)\n  useDatLichStore.setState(useDatLichStore.getInitialState(), true); // store Zustand (biến của module)\n  useThongBaoStore.setState(useThongBaoStore.getInitialState(), true);\n  localStorage.clear(); // bản lưu của persist — xoá SAU cùng: setState ở trên lại ghi xuống localStorage\n});",
 "main": "import { QueryClientProvider } from '@tanstack/react-query';\nimport { ReactQueryDevtools } from '@tanstack/react-query-devtools';\nimport { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App.tsx';\nimport './index.css';\nimport { taoQueryClient } from './query-client.ts';\n\nconst queryClient = taoQueryClient(); // MỘT client cho cả app, tạo NGOÀI component (không tạo lại mỗi lần render)\n\n/** App này chưa có máy chủ thật (tới Chương 14) ⇒ luôn bật API giả. Dự án có backend: chỉ bật khi dev. */\nasync function batApiGia() {\n  const { worker } = await import('./mocks/browser'); // import động: mã MSW tách ra file riêng\n  await worker.start({ onUnhandledRequest: 'bypass', quiet: true });\n}\n\nbatApiGia().then(() => {\n  createRoot(document.getElementById('root')!).render(\n    <StrictMode>\n      <QueryClientProvider client={queryClient}>\n        <App />\n        <ReactQueryDevtools initialIsOpen={false} /> {/* chỉ có mặt khi dev; build production tự bỏ */}\n      </QueryClientProvider>\n    </StrictMode>,\n  );\n});",
 "http": "/** Lỗi từ API, mang theo mã HTTP để giao diện (và retry) quyết định cách xử lý. */\nexport class LoiApi extends Error {\n  readonly status: number;\n  constructor(status: number, message: string) {\n    super(message);\n    this.name = 'LoiApi';\n    this.status = status;\n  }\n}\n\n/**\n * Gọi API rồi đọc JSON. Việc fetch KHÔNG tự làm: fetch chỉ ném lỗi khi MẤT MẠNG (không tới được máy chủ).\n * 404/500 vẫn là \"thành công\" với fetch (res.ok = false) ⇒ phải tự kiểm và tự ném.\n */\nexport async function goiApi<T>(duongDan: string, init?: RequestInit): Promise<T> {\n  const res = await fetch(duongDan, init);\n  if (!res.ok) {\n    const than = (await res.json().catch(() => null)) as { loi?: string } | null;\n    throw new LoiApi(res.status, than?.loi ?? `HTTP ${res.status}`);\n  }\n  return (await res.json()) as T;\n}",
 "api": "import type { DatLich } from '../schema/dat-lich';\nimport type { BacSi, KhungGio, LichHen, TrangThaiLichHen } from '../types';\nimport { goiApi } from './http';\n\n/** Lịch hẹn như API trả về: LichHen + giờ bắt đầu của khung giờ (máy chủ ghép sẵn, đỡ một lần gọi). */\nexport type LichHenCoGio = LichHen & { batDau: string };\n\n/** Mọi lời gọi API của app ở MỘT chỗ. Component không bao giờ tự viết fetch. */\nexport const api = {\n  danhSachBacSi: (signal?: AbortSignal) => goiApi<BacSi[]>('/api/bac-si', { signal }),\n\n  bacSi: (id: string, signal?: AbortSignal) => goiApi<BacSi>(`/api/bac-si/${id}`, { signal }),\n\n  khungGio: (bacSiId: string, ngay: string, signal?: AbortSignal) =>\n    goiApi<KhungGio[]>(`/api/bac-si/${bacSiId}/khung-gio?ngay=${ngay}`, { signal }),\n\n  datLich: (duLieu: DatLich & { bacSiId: string; khungGioId: string }) =>\n    goiApi<LichHenCoGio>('/api/lich-hen', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify(duLieu),\n    }),\n\n  lichHen: (signal?: AbortSignal) => goiApi<LichHenCoGio[]>('/api/lich-hen', { signal }),\n\n  doiTrangThai: (id: string, trangThai: TrangThaiLichHen) =>\n    goiApi<LichHenCoGio>(`/api/lich-hen/${id}`, {\n      method: 'PATCH',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ trangThai }),\n    }),\n};",
 "khoa": "/**\n * Query key của cả app ở MỘT chỗ (\"query key factory\"). Key là MẢNG, đi từ chung tới riêng:\n * invalidate ['bac-si'] làm cũ MỌI thứ bắt đầu bằng 'bac-si' — cả danh sách lẫn khung giờ của từng bác sĩ.\n */\nexport const khoa = {\n  bacSi: ['bac-si'] as const,\n  chiTietBacSi: (id: string) => ['bac-si', id] as const,\n  khungGio: (bacSiId: string, ngay: string) => ['bac-si', bacSiId, 'khung-gio', ngay] as const,\n  lichHen: ['lich-hen'] as const,\n};",
 "bai1": "import { useEffect, useState } from 'react';\nimport type { BacSi } from '../types';\n\n// ── 1. Cách ai cũng viết lần đầu: fetch trong effect, KHÔNG dọn dẹp ──\nexport function HoSoNgayThat({ id }: { id: string }) {\n  const [bacSi, setBacSi] = useState<BacSi | null>(null);\n  useEffect(() => {\n    fetch(`/api/bac-si/${id}`)\n      .then((res) => res.json())\n      .then((duLieu: BacSi) => setBacSi(duLieu)); // ✗ câu trả lời nào về SAU CÙNG thì thắng\n  }, [id]);\n  return <p>Hồ sơ: {bacSi ? bacSi.ten : 'Đang tải…'}</p>;\n}\n\n// ── 2. Cờ bỏ qua: câu trả lời của lượt cũ về muộn thì lờ đi ──\nexport function HoSoCoBoQua({ id }: { id: string }) {\n  const [bacSi, setBacSi] = useState<BacSi | null>(null);\n  useEffect(() => {\n    let boQua = false;\n    fetch(`/api/bac-si/${id}`)\n      .then((res) => res.json())\n      .then((duLieu: BacSi) => {\n        if (!boQua) setBacSi(duLieu);\n      });\n    return () => {\n      boQua = true; // id đổi (hoặc component biến mất) ⇒ lượt này hết giá trị\n    };\n  }, [id]);\n  return <p>Hồ sơ: {bacSi ? bacSi.ten : 'Đang tải…'}</p>;\n}\n\n// ── 3. AbortController: HUỶ hẳn request cũ (tab Network ghi \"canceled\") ──\nexport function HoSoCoHuy({ id }: { id: string }) {\n  const [bacSi, setBacSi] = useState<BacSi | null>(null);\n  useEffect(() => {\n    const boHuy = new AbortController();\n    fetch(`/api/bac-si/${id}`, { signal: boHuy.signal })\n      .then((res) => res.json())\n      .then((duLieu: BacSi) => setBacSi(duLieu))\n      .catch((loi: unknown) => {\n        if (boHuy.signal.aborted) return; // chính mình huỷ ⇒ không phải lỗi, lờ đi\n        throw loi; // lỗi thật (mất mạng…) thì để nó nổi lên\n      });\n    return () => boHuy.abort();\n  }, [id]);\n  return <p>Hồ sơ: {bacSi ? bacSi.ten : 'Đang tải…'}</p>;\n}",
 "useFetch": "import { useEffect, useState } from 'react';\nimport { goiApi } from '../api/http';\n\n/** Ba trạng thái loại trừ nhau: không thể vừa \"đang tải\" vừa \"có lỗi\" (union có nhãn — Bài 2.4). */\nexport type KetQuaFetch<T> =\n  | { trangThai: 'dang-tai' }\n  | { trangThai: 'loi'; loi: Error }\n  | { trangThai: 'xong'; duLieu: T };\n\n/**\n * Hook tự viết \"đủ dùng\": huỷ lượt cũ, bắt lỗi HTTP, ba trạng thái. ~30 dòng — và VẪN thiếu:\n * cache (mở lại màn là tải lại), gộp request trùng, thử lại, làm mới khi quay lại tab, làm cũ sau khi ghi.\n */\nexport function useFetch<T>(duongDan: string): KetQuaFetch<T> {\n  const [kq, setKq] = useState<KetQuaFetch<T>>({ trangThai: 'dang-tai' });\n  const [duongDanCu, setDuongDanCu] = useState(duongDan);\n  if (duongDan !== duongDanCu) {\n    // đổi URL ⇒ về \"đang tải\" NGAY trong lần render này (Bài 4.2: chỉnh state khi prop đổi, không cần effect)\n    setDuongDanCu(duongDan);\n    setKq({ trangThai: 'dang-tai' });\n  }\n  useEffect(() => {\n    const boHuy = new AbortController();\n    goiApi<T>(duongDan, { signal: boHuy.signal })\n      .then((duLieu) => setKq({ trangThai: 'xong', duLieu }))\n      .catch((loi: unknown) => {\n        if (boHuy.signal.aborted) return;\n        setKq({ trangThai: 'loi', loi: loi instanceof Error ? loi : new Error(String(loi)) });\n      });\n    return () => boHuy.abort();\n  }, [duongDan]);\n  return kq;\n}",
 "bai2": "/** Cùng việc với HoSoCoHuy (Bài 6.1) — không useState, không useEffect, không cờ, không cuộc đua. */\nexport function HoSoQuery({ id }: { id: string }) {\n  const { data, isPending, isError, error } = useQuery({\n    queryKey: khoa.chiTietBacSi(id), // ['bac-si', id] — key đổi ⇒ một query KHÁC; kết quả của key cũ không bao giờ đè lên key mới\n    queryFn: ({ signal }) => api.bacSi(id, signal),\n  });\n  if (isPending) return <p>Hồ sơ: Đang tải…</p>;\n  if (isError) return <p role=\"alert\">Lỗi: {error.message}</p>;\n  return <p>Hồ sơ: {data.ten}</p>;\n}",
 "useBacSi": "import { useQuery } from '@tanstack/react-query';\nimport { khoa } from '../api/khoa';\nimport { api } from '../api/phong-kham';\n\n/** Danh sách bác sĩ. Ít khi đổi ⇒ coi là \"tươi\" trong 5 phút: mở lại màn hình không gọi lại API. */\nexport function useBacSi() {\n  return useQuery({\n    queryKey: khoa.bacSi,\n    queryFn: ({ signal }) => api.danhSachBacSi(signal), // signal: TanStack huỷ request khi không ai cần nữa\n    staleTime: 5 * 60_000,\n  });\n}",
 "useKhungGio": "import { keepPreviousData, useQuery } from '@tanstack/react-query';\nimport { khoa } from '../api/khoa';\nimport { api } from '../api/phong-kham';\n\n/**\n * Khung giờ của một bác sĩ trong một ngày. Đổi bác sĩ/ngày = đổi key = một mục cache KHÁC.\n * - enabled: chưa chọn bác sĩ thì KHÔNG gọi (query phụ thuộc).\n * - staleTime 30 giây: khung giờ đổi thường xuyên (người khác đặt), nên chỉ tin cache một lúc ngắn.\n * - placeholderData: keepPreviousData — đổi ngày thì giữ lưới giờ của ngày cũ (mờ đi) trong lúc tải, thay vì nháy trắng.\n */\nexport function useKhungGio(bacSiId: string | null, ngay: string) {\n  return useQuery({\n    queryKey: khoa.khungGio(bacSiId ?? '', ngay),\n    queryFn: ({ signal }) => api.khungGio(bacSiId!, ngay, signal), // ! : enabled bảo đảm bacSiId không null ở đây\n    enabled: bacSiId !== null,\n    staleTime: 30_000,\n    placeholderData: keepPreviousData,\n  });\n}",
 "render": "import { QueryClient, QueryClientProvider } from '@tanstack/react-query';\nimport { render } from '@testing-library/react';\nimport type { ReactNode } from 'react';\nimport { taoQueryClient } from '../query-client';\n\n/** QueryClient MỚI cho MỖI test: cache không rò từ test này sang test khác. Không thử lại (test lỗi khỏi đợi 7 giây). */\nexport function taoClientTest(): QueryClient {\n  const qc = taoQueryClient();\n  qc.setDefaultOptions({ queries: { retry: false, gcTime: Infinity } });\n  return qc;\n}\n\n/**\n * Bọc bằng `wrapper` (không bọc tay quanh ui): rerender() cũng được bọc lại.\n * Bọc tay thì rerender(<X />) vẽ X KHÔNG có Provider ⇒ \"No QueryClient set\".\n */\nexport function renderVoiQuery(ui: ReactNode, queryClient = taoClientTest()) {\n  const wrapper = ({ children }: { children: ReactNode }) => (\n    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>\n  );\n  return { ...render(ui, { wrapper }), queryClient };\n}",
 "useDatLich": "import { useMutation, useQueryClient } from '@tanstack/react-query';\nimport { khoa } from '../api/khoa';\nimport { api } from '../api/phong-kham';\nimport type { DatLich } from '../schema/dat-lich';\n\nexport type YeuCauDatLich = DatLich & { bacSiId: string; khungGioId: string };\n\n/**\n * Đặt lịch = GHI lên máy chủ ⇒ useMutation (không phải useQuery). Xong thì báo cache rằng hai thứ đã CŨ:\n * khung giờ của bác sĩ đó (một khung vừa kín) và danh sách lịch hẹn (vừa thêm một). TanStack tự tải lại\n * những query đang có người xem.\n * onSettled (không phải onSuccess): 409 \"vừa có người đặt\" nghĩa là lưới giờ trên màn hình ĐÃ CŨ — lỗi cũng phải làm mới.\n */\nexport function useDatLich() {\n  const queryClient = useQueryClient();\n  return useMutation({\n    mutationFn: (yc: YeuCauDatLich) => api.datLich(yc),\n    onSettled: (_lichHen, _loi, yc) =>\n      Promise.all([\n        queryClient.invalidateQueries({ queryKey: ['bac-si', yc.bacSiId, 'khung-gio'] }),\n        queryClient.invalidateQueries({ queryKey: khoa.lichHen }),\n      ]), // trả Promise ⇒ mutation còn \"pending\" tới khi dữ liệu mới về: không có khoảnh khắc hiện dữ liệu cũ\n    meta: { tuXuLyLoi: true }, // lỗi đặt lịch hiện ngay trong luồng, không cần thông báo nổi\n  });\n}",
 "useLichHen": "import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';\nimport { khoa } from '../api/khoa';\nimport { api, type LichHenCoGio } from '../api/phong-kham';\n\nexport function useLichHen() {\n  return useQuery({\n    queryKey: khoa.lichHen,\n    queryFn: ({ signal }) => api.lichHen(signal),\n  });\n}\n\n/**\n * Huỷ lịch với CẬP NHẬT LẠC QUAN: sửa cache ngay (màn hình hiện \"Đã huỷ\" tức thì), gửi PATCH sau.\n * Lỗi ⇒ trả cache về bản chụp cũ. Xong (dù được hay lỗi) ⇒ invalidate để khớp lại với máy chủ.\n */\nexport function useHuyLichHen() {\n  const queryClient = useQueryClient();\n  return useMutation({\n    mutationFn: (lh: LichHenCoGio) => api.doiTrangThai(lh.id, 'da-huy'),\n    onMutate: async (lh) => {\n      await queryClient.cancelQueries({ queryKey: khoa.lichHen }); // chặn một lần tải đang bay về đè lên bản lạc quan\n      const truoc = queryClient.getQueryData<LichHenCoGio[]>(khoa.lichHen); // chụp lại để hoàn tác\n      queryClient.setQueryData<LichHenCoGio[]>(khoa.lichHen, (cu) =>\n        cu?.map((x) => (x.id === lh.id ? { ...x, trangThai: 'da-huy' } : x)),\n      );\n      return { truoc }; // → tham số thứ ba của onError/onSettled\n    },\n    onError: (_loi, _id, ketQua) => {\n      queryClient.setQueryData(khoa.lichHen, ketQua?.truoc); // hoàn tác\n    },\n    onSettled: (_kq, _loi, lh) =>\n      Promise.all([\n        queryClient.invalidateQueries({ queryKey: khoa.lichHen }),\n        queryClient.invalidateQueries({ queryKey: ['bac-si', lh.bacSiId, 'khung-gio'] }), // khung giờ mở lại\n      ]),\n    meta: { thongBaoLoi: 'Không huỷ được lịch hẹn — đã hoàn tác' },\n  });\n}",
 "bai3": "import { useMutation, useQueryClient } from '@tanstack/react-query';\nimport { khoa } from '../api/khoa';\nimport { api, type LichHenCoGio } from '../api/phong-kham';\n\n/** Bản \"thiếu một dòng\" của useHuyLichHen: KHÔNG cancelQueries trước khi sửa cache (Bài 6.3 — bẫy). */\nexport function useHuyThieuCancel() {\n  const queryClient = useQueryClient();\n  return useMutation({\n    mutationFn: (lh: LichHenCoGio) => api.doiTrangThai(lh.id, 'da-huy'),\n    onMutate: (lh) => {\n      const truoc = queryClient.getQueryData<LichHenCoGio[]>(khoa.lichHen);\n      queryClient.setQueryData<LichHenCoGio[]>(khoa.lichHen, (cu) =>\n        cu?.map((x) => (x.id === lh.id ? { ...x, trangThai: 'da-huy' } : x)),\n      );\n      return { truoc };\n    },\n    onError: (_l, _v, kq) => queryClient.setQueryData(khoa.lichHen, kq?.truoc),\n    onSettled: () => queryClient.invalidateQueries({ queryKey: khoa.lichHen }),\n  });\n}",
 "queryClient": "import { MutationCache, QueryClient } from '@tanstack/react-query';\nimport { LoiApi } from './api/http';\nimport { useThongBaoStore } from './store/thong-bao-store';\n\n/** Lỗi 4xx (sai yêu cầu, không có, không được phép) thử lại cũng vô ích. Chỉ thử lại lỗi mạng và 5xx. */\nexport function nenThuLai(soLanDaHong: number, loi: Error) {\n  if (loi instanceof LoiApi && loi.status >= 400 && loi.status < 500) return false;\n  return soLanDaHong < 3;\n}\n\nexport function taoQueryClient() {\n  return new QueryClient({\n    defaultOptions: {\n      queries: { retry: nenThuLai },\n    },\n    // Một chỗ cho MỌI mutation: lỗi ⇒ thông báo nổi, trừ mutation tự hiện lỗi tại chỗ (meta.tuXuLyLoi).\n    mutationCache: new MutationCache({\n      onError: (loi, _bien, _kq, mutation) => {\n        if (mutation.meta?.tuXuLyLoi) return;\n        const loiRieng = mutation.meta?.thongBaoLoi;\n        useThongBaoStore.getState().hien(typeof loiRieng === 'string' ? loiRieng : loi.message);\n      },\n    }),\n  });\n}",
 "thongBaoStore": "import { create } from 'zustand';\n\nexport interface ThongBao {\n  id: number;\n  noiDung: string;\n  loai: 'loi' | 'thanh-cong';\n}\n\ninterface ThongBaoState {\n  ds: ThongBao[];\n  hien: (noiDung: string, loai?: ThongBao['loai']) => void;\n  an: (id: number) => void;\n}\n\nlet dem = 0;\n/** Thông báo nổi (\"toast\"): state CỦA GIAO DIỆN ⇒ Zustand. Tự ẩn sau 5 giây. */\nexport const useThongBaoStore = create<ThongBaoState>()((set, get) => ({\n  ds: [],\n  hien: (noiDung, loai = 'loi') => {\n    const id = ++dem;\n    set((s) => ({ ds: [...s.ds, { id, noiDung, loai }] }));\n    setTimeout(() => get().an(id), 5000);\n  },\n  an: (id) => set((s) => ({ ds: s.ds.filter((t) => t.id !== id) })),\n}));",
 "vungThongBao": "import { useThongBaoStore } from '../store/thong-bao-store';\n\n/** Vùng thông báo nổi, đặt MỘT lần ở gốc app. role=\"status\": trình đọc màn hình đọc khi có thông báo mới. */\nexport function VungThongBao() {\n  const ds = useThongBaoStore((s) => s.ds);\n  const an = useThongBaoStore((s) => s.an);\n  return (\n    <div className=\"vung-thong-bao\" role=\"status\">\n      {ds.map((t) => (\n        <div key={t.id} className={`thong-bao ${t.loai}`}>\n          <span>{t.noiDung}</span>\n          <button type=\"button\" aria-label=\"Đóng thông báo\" onClick={() => an(t.id)}>\n            ×\n          </button>\n        </div>\n      ))}\n    </div>\n  );\n}",
 "ranhGioiLoi": "import { Component, type ErrorInfo, type ReactNode } from 'react';\n\ninterface Props {\n  children: ReactNode;\n  onThuLai?: () => void;\n}\ninterface State {\n  loi: Error | null;\n}\n\n/**\n * Error boundary (\"ranh giới lỗi\"): bắt lỗi ném ra LÚC RENDER ở mọi component con, vẽ màn dự phòng\n * thay vì để cả trang trắng. React 19 vẫn CHƯA có cách viết nó bằng function ⇒ đây là chỗ hiếm hoi\n * còn dùng class component (hoặc cài gói react-error-boundary — nó bọc đúng class này).\n */\nexport class RanhGioiLoi extends Component<Props, State> {\n  state: State = { loi: null };\n\n  static getDerivedStateFromError(loi: Error): State {\n    return { loi }; // lần render sau vẽ màn dự phòng\n  }\n\n  componentDidCatch(loi: Error, info: ErrorInfo) {\n    console.error('[RanhGioiLoi]', loi.message, info.componentStack?.split('\\n')[1]?.trim()); // app thật: gửi về Sentry…\n  }\n\n  render() {\n    if (this.state.loi) {\n      return (\n        <div className=\"hop-loi\" role=\"alert\">\n          <p>\n            <strong>Phần này gặp sự cố.</strong>\n          </p>\n          <p>{this.state.loi.message}</p>\n          <button\n            type=\"button\"\n            className=\"nut\"\n            onClick={() => {\n              this.props.onThuLai?.();\n              this.setState({ loi: null });\n            }}\n          >\n            Tải lại phần này\n          </button>\n        </div>\n      );\n    }\n    return this.props.children;\n  }\n}",
 "khungXuong": "/**\n * Skeleton (\"khung xương\"): hình dáng của nội dung sắp tới, đúng kích thước thẻ thật ⇒ lúc dữ liệu về,\n * trang không nhảy (không layout shift). aria-busy + một dòng chữ ẩn để trình đọc màn hình biết đang tải.\n */\nexport function DanhSachBacSiKhung({ soThe = 6 }: { soThe?: number }) {\n  return (\n    <section aria-busy=\"true\" aria-label=\"Đang tải danh sách bác sĩ\">\n      <div className=\"khung-xuong-dong rong-40\" />\n      <div className=\"luoi-bac-si\">\n        {Array.from({ length: soThe }, (_, i) => (\n          <div key={i} className=\"the-bac-si khung-xuong-the\" aria-hidden=\"true\">\n            <div className=\"khung-xuong-dong rong-70\" />\n            <div className=\"khung-xuong-dong rong-40\" />\n            <div className=\"khung-xuong-dong rong-55\" />\n            <div className=\"khung-xuong-nut\" />\n          </div>\n        ))}\n      </div>\n      <p className=\"chi-doc-man-hinh\">Đang tải danh sách bác sĩ…</p>\n    </section>\n  );\n}\n\nexport function LuoiGioKhung() {\n  return (\n    <div className=\"lua-chon\" aria-busy=\"true\" aria-label=\"Đang tải khung giờ\">\n      {Array.from({ length: 4 }, (_, i) => (\n        <div key={i} className=\"khung-xuong-nut rong-gio\" aria-hidden=\"true\" />\n      ))}\n    </div>\n  );\n}",
 "loiTaiDuLieu": "import { LoiApi } from '../api/http';\n\ninterface LoiTaiDuLieuProps {\n  tieuDe: string;\n  loi: Error;\n  onThuLai: () => void;\n  dangThuLai: boolean;\n}\n\n/** Hộp lỗi dùng chung: nói CHUYỆN GÌ hỏng bằng lời người dùng, và cho một nút làm lại. */\nexport function LoiTaiDuLieu({ tieuDe, loi, onThuLai, dangThuLai }: LoiTaiDuLieuProps) {\n  const matMang = !(loi instanceof LoiApi); // fetch ném TypeError khi không tới được máy chủ\n  return (\n    <div className=\"hop-loi\" role=\"alert\">\n      <p>\n        <strong>{tieuDe}</strong>\n      </p>\n      <p>{matMang ? 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.' : loi.message}</p>\n      <button type=\"button\" className=\"nut\" onClick={onThuLai} disabled={dangThuLai}>\n        {dangThuLai ? 'Đang thử lại…' : 'Thử lại'}\n      </button>\n    </div>\n  );\n}",
 "bai4": "import { QueryErrorResetBoundary, useQuery } from '@tanstack/react-query';\nimport { RanhGioiLoi } from '../components/RanhGioiLoi';\nimport { api } from '../api/phong-kham';\n\n/** Component có BUG khi render (dữ liệu thiếu trường) — ranh giới lỗi bắt, phần còn lại của trang vẫn chạy. */\nexport function TheCoBug({ gioiThieu }: { gioiThieu?: string }) {\n  return <p>{gioiThieu!.slice(0, 20)}…</p>; // ✗ ! nói dối TypeScript: gioiThieu có thể undefined\n}\n\n/** throwOnError: lỗi của query không trả về `error` nữa mà NÉM lên ranh giới lỗi gần nhất. */\nfunction HoSoNem({ id }: { id: string }) {\n  const { data } = useQuery({\n    queryKey: ['bac-si', id],\n    queryFn: ({ signal }) => api.bacSi(id, signal),\n    throwOnError: true,\n  });\n  return <p>Hồ sơ: {data ? data.ten : 'Đang tải…'}</p>;\n}\n\n/** QueryErrorResetBoundary: bấm \"Tải lại phần này\" ⇒ query lỗi được xoá lỗi và tải lại thật (không vẽ lại lỗi cũ). */\nexport function HoSoCoRanhGioi({ id }: { id: string }) {\n  return (\n    <QueryErrorResetBoundary>\n      {({ reset }) => (\n        <RanhGioiLoi onThuLai={reset}>\n          <HoSoNem id={id} />\n        </RanhGioiLoi>\n      )}\n    </QueryErrorResetBoundary>\n  );\n}",
 "app": "import './App.css';\nimport { Footer } from './components/Footer';\nimport { Header } from './components/Header';\nimport { KhuBacSi } from './components/KhuBacSi';\nimport { LichHenCuaToi } from './components/LichHenCuaToi';\nimport { LuongDatLich } from './components/LuongDatLich';\nimport { RanhGioiLoi } from './components/RanhGioiLoi';\nimport { VungThongBao } from './components/VungThongBao';\n\nexport default function App() {\n  return (\n    <>\n      <Header />\n      <main className=\"noi-dung\">\n        <RanhGioiLoi>\n          <KhuBacSi />\n        </RanhGioiLoi>\n        <div className=\"hang-duoi\">\n          <RanhGioiLoi>\n            <LuongDatLich />\n          </RanhGioiLoi>\n          <RanhGioiLoi>\n            <LichHenCuaToi />\n          </RanhGioiLoi>\n        </div>\n      </main>\n      <Footer />\n      <VungThongBao />\n    </>\n  );\n}",
 "khuBacSi": "import { useState } from 'react';\nimport { useBacSi } from '../hooks/useBacSi';\nimport { useBoLocUrl } from '../hooks/useBoLocUrl';\nimport { locBacSi } from '../logic/loc-bac-si';\nimport { useDatLichStore } from '../store/dat-lich-store';\nimport { ChiTietBacSi } from './ChiTietBacSi';\nimport { ChipChuyenKhoa } from './ChipChuyenKhoa';\nimport { DanhSachBacSi } from './DanhSachBacSi';\nimport { DanhSachBacSiKhung } from './KhungXuong';\nimport { LoiTaiDuLieu } from './LoiTaiDuLieu';\nimport { OTimBacSi } from './OTimBacSi';\n\nexport function KhuBacSi() {\n  // Chương 6: danh sách bác sĩ là dữ liệu của MÁY CHỦ ⇒ TanStack Query giữ, không phải state của component.\n  const { data: danhSachBacSi, isPending, isError, error, refetch, isFetching } = useBacSi();\n  // Chương 5: mỗi mẩu state về đúng nhà của nó.\n  const [{ chuyenKhoa, tuKhoa }, datBoLoc] = useBoLocUrl(); // lọc/tìm → URL (chia sẻ được, F5 không mất)\n  const yeuThich = useDatLichStore((s) => s.yeuThich); // yêu thích → store toàn app (có persist)\n  const doiYeuThich = useDatLichStore((s) => s.doiYeuThich);\n  const [bacSiDangChonId, setBacSiDangChonId] = useState<string | null>(null); // chỉ màn này cần ⇒ ở lại đây\n\n  const ds = danhSachBacSi ?? []; // chưa có dữ liệu ⇒ mảng rỗng, để các phép tính dưới không phải hỏi \"có chưa?\"\n  const danhSachLoc = locBacSi(ds, chuyenKhoa, tuKhoa);\n  const bacSiDangChon = ds.find((bs) => bs.id === bacSiDangChonId) ?? null;\n  const dsYeuThich = ds.filter((bs) => yeuThich.includes(bs.id));\n\n  // Bốn trạng thái, theo đúng thứ tự: đang tải lần đầu → lỗi mà CHƯA có gì để hiện → rỗng → có dữ liệu.\n  let noiDung;\n  if (isPending) {\n    noiDung = <DanhSachBacSiKhung />;\n  } else if (!danhSachBacSi) {\n    noiDung = <LoiTaiDuLieu tieuDe=\"Không tải được danh sách bác sĩ\" loi={error!} onThuLai={() => refetch()} dangThuLai={isFetching} />;\n  } else if (danhSachBacSi.length === 0) {\n    noiDung = <p className=\"rong\">Phòng khám chưa có bác sĩ nào nhận lịch.</p>;\n  } else {\n    noiDung = (\n      <>\n        {isError && (\n          <p className=\"bang-cu\" role=\"status\">\n            Không làm mới được danh sách — đang hiện bản đã tải lúc trước.\n          </p>\n        )}\n        <DanhSachBacSi\n          danhSach={danhSachLoc}\n          bacSiDangChonId={bacSiDangChonId}\n          yeuThich={yeuThich}\n          onXemChiTiet={setBacSiDangChonId}\n          onDoiYeuThich={doiYeuThich}\n          thongBaoRong=\"Không tìm thấy bác sĩ phù hợp.\"\n        />\n      </>\n    );\n  }\n\n  return (\n    <>\n      <div className=\"thanh-loc\">\n        <ChipChuyenKhoa giaTri={chuyenKhoa} onDoi={(ck) => datBoLoc({ chuyenKhoa: ck })} />\n        <OTimBacSi tuKhoa={tuKhoa} onDoi={(q) => datBoLoc({ tuKhoa: q }, 'replace')} />\n      </div>\n      <div className=\"bo-cuc\">\n        <div>{noiDung}</div>\n        <aside>\n          {bacSiDangChon ? (\n            <ChiTietBacSi\n              bacSi={bacSiDangChon}\n              laYeuThich={yeuThich.includes(bacSiDangChon.id)}\n              onDoiYeuThich={doiYeuThich}\n              onDong={() => setBacSiDangChonId(null)}\n            />\n          ) : (\n            <p className=\"goi-y\">Bấm “Xem chi tiết” trên một bác sĩ để xem giới thiệu.</p>\n          )}\n          <section className=\"yeu-thich\" aria-label=\"Danh sách yêu thích\">\n            <h3>Yêu thích ({dsYeuThich.length})</h3>\n            {dsYeuThich.length === 0 ? (\n              <p>Chưa có bác sĩ nào.</p>\n            ) : (\n              <ul>\n                {dsYeuThich.map((bs) => (\n                  <li key={bs.id}>{bs.ten}</li>\n                ))}\n              </ul>\n            )}\n          </section>\n        </aside>\n      </div>\n    </>\n  );\n}",
 "khuBacSiTrangThai": "  // Bốn trạng thái, theo đúng thứ tự: đang tải lần đầu → lỗi mà CHƯA có gì để hiện → rỗng → có dữ liệu.\n  let noiDung;\n  if (isPending) {\n    noiDung = <DanhSachBacSiKhung />;\n  } else if (!danhSachBacSi) {\n    noiDung = <LoiTaiDuLieu tieuDe=\"Không tải được danh sách bác sĩ\" loi={error!} onThuLai={() => refetch()} dangThuLai={isFetching} />;\n  } else if (danhSachBacSi.length === 0) {\n    noiDung = <p className=\"rong\">Phòng khám chưa có bác sĩ nào nhận lịch.</p>;\n  } else {\n    noiDung = (\n      <>\n        {isError && (\n          <p className=\"bang-cu\" role=\"status\">\n            Không làm mới được danh sách — đang hiện bản đã tải lúc trước.\n          </p>\n        )}\n        <DanhSachBacSi\n          danhSach={danhSachLoc}\n          bacSiDangChonId={bacSiDangChonId}\n          yeuThich={yeuThich}\n          onXemChiTiet={setBacSiDangChonId}\n          onDoiYeuThich={doiYeuThich}\n          thongBaoRong=\"Không tìm thấy bác sĩ phù hợp.\"\n        />\n      </>\n    );\n  }",
 "luongDatLich": "import { useReducer } from 'react';\nimport { TEN_CHUYEN_KHOA } from '../du-lieu/chuyen-khoa';\nimport { LUONG_BAN_DAU, luongDatLichReducer } from '../dat-lich/luong-dat-lich';\nimport { useBacSi } from '../hooks/useBacSi';\nimport { useDatLich } from '../hooks/useDatLich';\nimport { useKhungGio } from '../hooks/useKhungGio';\nimport { hienGio, hienNgay, NGAY_KHAM } from '../logic/thoi-gian';\nimport { FormDatLich } from './FormDatLich';\nimport { LuoiGioKhung } from './KhungXuong';\nimport { LoiTaiDuLieu } from './LoiTaiDuLieu';\n\nconst TEN_BUOC = ['Chọn bác sĩ', 'Chọn giờ khám', 'Thông tin bệnh nhân', 'Xác nhận'];\n\nexport function LuongDatLich() {\n  const [state, dispatch] = useReducer(luongDatLichReducer, LUONG_BAN_DAU);\n  const bacSiQ = useBacSi(); // CÙNG key với KhuBacSi ⇒ dùng chung cache, không gọi API lần hai\n  const khungGioQ = useKhungGio(state.bacSiId, state.ngay);\n  const datLich = useDatLich();\n\n  const bacSi = bacSiQ.data?.find((bs) => bs.id === state.bacSiId) ?? null;\n  const khungGio = khungGioQ.data?.find((kg) => kg.id === state.khungGioId) ?? null;\n\n  function xacNhan() {\n    if (!bacSi || !khungGio || !state.thongTin) return;\n    datLich.mutate({ ...state.thongTin, bacSiId: bacSi.id, khungGioId: khungGio.id });\n  }\n\n  if (datLich.isSuccess) {\n    return (\n      <section className=\"luong\" aria-label=\"Đặt lịch khám\">\n        <p className=\"gui-xong\" role=\"status\">\n          Đã đặt lịch với {bacSi?.ten} lúc {hienGio(datLich.data.batDau)}. Mã lịch hẹn: {datLich.data.id}.\n        </p>\n        <button\n          type=\"button\"\n          className=\"nut\"\n          onClick={() => {\n            datLich.reset(); // xoá kết quả của lần gửi trước\n            dispatch({ type: 'lam-lai' });\n          }}\n        >\n          Đặt lịch khác\n        </button>\n      </section>\n    );\n  }\n\n  return (\n    <section className=\"luong\" aria-label=\"Đặt lịch khám\">\n      <h2>Đặt lịch khám</h2>\n      <ol className=\"cac-buoc\">\n        {TEN_BUOC.map((ten, i) => (\n          <li key={ten} aria-current={state.buoc === i + 1 ? 'step' : undefined}>\n            {i + 1}. {ten}\n          </li>\n        ))}\n      </ol>\n      <h3>\n        Bước {state.buoc}/4 — {TEN_BUOC[state.buoc - 1]}\n      </h3>\n\n      {state.buoc === 1 && (\n        <div className=\"lua-chon\">\n          {bacSiQ.isPending && <LuoiGioKhung />}\n          {bacSiQ.data?.map((bs) => (\n            <button\n              key={bs.id}\n              type=\"button\"\n              className=\"nut\"\n              aria-pressed={bs.id === state.bacSiId}\n              onClick={() => dispatch({ type: 'chon-bac-si', bacSiId: bs.id })}\n            >\n              {bs.ten} · {TEN_CHUYEN_KHOA[bs.chuyenKhoa]}\n            </button>\n          ))}\n        </div>\n      )}\n\n      {state.buoc === 2 && bacSi && (\n        <>\n          <div className=\"chip-hang\" aria-label=\"Chọn ngày\">\n            {NGAY_KHAM.map((ngay) => (\n              <button\n                key={ngay}\n                type=\"button\"\n                className=\"chip\"\n                aria-pressed={ngay === state.ngay}\n                onClick={() => dispatch({ type: 'chon-ngay', ngay })}\n              >\n                {hienNgay(ngay)}\n              </button>\n            ))}\n          </div>\n          {khungGioQ.isPending ? (\n            <LuoiGioKhung />\n          ) : khungGioQ.isError && !khungGioQ.data ? (\n            <LoiTaiDuLieu\n              tieuDe=\"Không tải được giờ khám\"\n              loi={khungGioQ.error}\n              onThuLai={() => khungGioQ.refetch()}\n              dangThuLai={khungGioQ.isFetching}\n            />\n          ) : (\n            // isPlaceholderData: đang hiện giờ của NGÀY CŨ trong lúc tải ngày mới ⇒ làm mờ và khoá bấm\n            <div className=\"lua-chon\" aria-busy={khungGioQ.isPlaceholderData} style={{ opacity: khungGioQ.isPlaceholderData ? 0.5 : 1 }}>\n              {khungGioQ.data?.map((kg) => (\n                <button\n                  key={kg.id}\n                  type=\"button\"\n                  className=\"nut\"\n                  disabled={!kg.conTrong || khungGioQ.isPlaceholderData}\n                  aria-pressed={kg.id === state.khungGioId}\n                  onClick={() => dispatch({ type: 'chon-khung-gio', khungGioId: kg.id })}\n                >\n                  {hienGio(kg.batDau)}\n                  {kg.conTrong ? '' : ' (kín)'}\n                </button>\n              ))}\n            </div>\n          )}\n        </>\n      )}\n\n      {state.buoc === 3 && bacSi && (\n        <FormDatLich\n          bacSi={bacSi}\n          nhanNut=\"Tiếp tục\"\n          giaTriDau={state.thongTin ?? undefined}\n          onGui={async (thongTin) => dispatch({ type: 'nhap-thong-tin', thongTin })}\n        />\n      )}\n\n      {state.buoc === 4 && bacSi && khungGio && state.thongTin && (\n        <div className=\"tom-tat\">\n          <dl>\n            <dt>Bác sĩ</dt>\n            <dd>{bacSi.ten}</dd>\n            <dt>Giờ khám</dt>\n            <dd>{hienGio(khungGio.batDau)}</dd>\n            <dt>Bệnh nhân</dt>\n            <dd>\n              {state.thongTin.benhNhan.hoTen} · {state.thongTin.benhNhan.soDienThoai}\n            </dd>\n            <dt>Lý do</dt>\n            <dd>{state.thongTin.lyDo}</dd>\n          </dl>\n          {datLich.isError && (\n            <p className=\"loi-chung\" role=\"alert\">\n              {datLich.error.message}\n            </p>\n          )}\n          <button type=\"button\" className=\"nut nut-chinh\" disabled={datLich.isPending} onClick={xacNhan}>\n            {datLich.isPending ? 'Đang gửi…' : 'Xác nhận đặt lịch'}\n          </button>\n        </div>\n      )}\n\n      {state.buoc > 1 && (\n        <button\n          type=\"button\"\n          className=\"nut nut-lui\"\n          disabled={datLich.isPending}\n          onClick={() => {\n            datLich.reset(); // lỗi của lần gửi trước không còn đúng khi người dùng quay lại sửa\n            dispatch({ type: 'quay-lai' });\n          }}\n        >\n          ← Quay lại\n        </button>\n      )}\n    </section>\n  );\n}",
 "luongDau": "export function LuongDatLich() {\n  const [state, dispatch] = useReducer(luongDatLichReducer, LUONG_BAN_DAU);\n  const bacSiQ = useBacSi(); // CÙNG key với KhuBacSi ⇒ dùng chung cache, không gọi API lần hai\n  const khungGioQ = useKhungGio(state.bacSiId, state.ngay);\n  const datLich = useDatLich();\n\n  const bacSi = bacSiQ.data?.find((bs) => bs.id === state.bacSiId) ?? null;\n  const khungGio = khungGioQ.data?.find((kg) => kg.id === state.khungGioId) ?? null;\n\n  function xacNhan() {\n    if (!bacSi || !khungGio || !state.thongTin) return;\n    datLich.mutate({ ...state.thongTin, bacSiId: bacSi.id, khungGioId: khungGio.id });\n  }",
 "luongBuoc4": "      {state.buoc === 4 && bacSi && khungGio && state.thongTin && (\n        <div className=\"tom-tat\">\n          <dl>\n            <dt>Bác sĩ</dt>\n            <dd>{bacSi.ten}</dd>\n            <dt>Giờ khám</dt>\n            <dd>{hienGio(khungGio.batDau)}</dd>\n            <dt>Bệnh nhân</dt>\n            <dd>\n              {state.thongTin.benhNhan.hoTen} · {state.thongTin.benhNhan.soDienThoai}\n            </dd>\n            <dt>Lý do</dt>\n            <dd>{state.thongTin.lyDo}</dd>\n          </dl>\n          {datLich.isError && (\n            <p className=\"loi-chung\" role=\"alert\">\n              {datLich.error.message}\n            </p>\n          )}\n          <button type=\"button\" className=\"nut nut-chinh\" disabled={datLich.isPending} onClick={xacNhan}>\n            {datLich.isPending ? 'Đang gửi…' : 'Xác nhận đặt lịch'}\n          </button>\n        </div>\n      )}",
 "lichHenDs": "export function LichHenCuaToi() {\n  const { data: lichHen, isPending, error, refetch, isFetching } = useLichHen();\n  const { data: bacSi } = useBacSi();\n  const huy = useHuyLichHen();\n\n  return (\n    <section className=\"lich-hen\" aria-label=\"Lịch hẹn của tôi\">\n      <h2>Lịch hẹn của tôi {lichHen && `(${lichHen.length})`}</h2>\n      {isPending ? (\n        <p className=\"goi-y\" aria-busy=\"true\">\n          Đang tải lịch hẹn…\n        </p>\n      ) : !lichHen ? (\n        <LoiTaiDuLieu tieuDe=\"Không tải được lịch hẹn\" loi={error!} onThuLai={() => refetch()} dangThuLai={isFetching} />\n      ) : lichHen.length === 0 ? (\n        <p className=\"goi-y\">Chưa có lịch hẹn nào.</p>\n      ) : (\n        <ul>\n          {lichHen.map((lh) => (\n            <li key={lh.id} className={lh.trangThai}>\n              <strong>{bacSi?.find((b) => b.id === lh.bacSiId)?.ten ?? lh.bacSiId}</strong> · {hienGio(lh.batDau)} ·{' '}\n              {lh.benhNhan.hoTen} · <span className=\"trang-thai\">{TEN_TRANG_THAI[lh.trangThai]}</span>\n              {lh.trangThai === 'cho-xac-nhan' && (\n                <button type=\"button\" className=\"nut nut-nho\" onClick={() => huy.mutate(lh)} aria-label={`Huỷ lịch ${lh.id}`}>\n                  Huỷ\n                </button>\n              )}\n            </li>\n          ))}\n        </ul>\n      )}\n    </section>\n  );\n}",
 "reducerDau": "/**\n * Mọi thứ luồng đặt lịch 4 bước cần nhớ — MỘT object, đổi qua MỘT hàm.\n * Chương 6: \"đang gửi / lỗi gửi / đã đặt\" RỜI khỏi đây — đó là trạng thái của một lần GHI lên máy chủ,\n * và useMutation (hooks/useDatLich.ts) giữ nó. Reducer chỉ còn giữ lựa chọn của người dùng.\n */\nexport interface LuongDatLich {\n  buoc: Buoc;\n  bacSiId: string | null;\n  ngay: string;\n  khungGioId: string | null;\n  thongTin: DatLich | null; // họ tên, SĐT, ngày sinh, lý do — từ FormDatLich (Chương 3)\n}\n\nexport type HanhDongDatLich =\n  | { type: 'chon-bac-si'; bacSiId: string }\n  | { type: 'chon-ngay'; ngay: string }\n  | { type: 'chon-khung-gio'; khungGioId: string }\n  | { type: 'nhap-thong-tin'; thongTin: DatLich }\n  | { type: 'quay-lai' }\n  | { type: 'lam-lai' };",
 "luongReducer": "import { NGAY_KHAM } from '../logic/thoi-gian';\nimport type { DatLich } from '../schema/dat-lich';\n\nexport type Buoc = 1 | 2 | 3 | 4;\n\n/**\n * Mọi thứ luồng đặt lịch 4 bước cần nhớ — MỘT object, đổi qua MỘT hàm.\n * Chương 6: \"đang gửi / lỗi gửi / đã đặt\" RỜI khỏi đây — đó là trạng thái của một lần GHI lên máy chủ,\n * và useMutation (hooks/useDatLich.ts) giữ nó. Reducer chỉ còn giữ lựa chọn của người dùng.\n */\nexport interface LuongDatLich {\n  buoc: Buoc;\n  bacSiId: string | null;\n  ngay: string;\n  khungGioId: string | null;\n  thongTin: DatLich | null; // họ tên, SĐT, ngày sinh, lý do — từ FormDatLich (Chương 3)\n}\n\nexport type HanhDongDatLich =\n  | { type: 'chon-bac-si'; bacSiId: string }\n  | { type: 'chon-ngay'; ngay: string }\n  | { type: 'chon-khung-gio'; khungGioId: string }\n  | { type: 'nhap-thong-tin'; thongTin: DatLich }\n  | { type: 'quay-lai' }\n  | { type: 'lam-lai' };\n\nexport const LUONG_BAN_DAU: LuongDatLich = {\n  buoc: 1,\n  bacSiId: null,\n  ngay: NGAY_KHAM[0],\n  khungGioId: null,\n  thongTin: null,\n};\n\n/** Reducer THUẦN: không gọi API, không đọc giờ, không sửa state cũ — chỉ (state, action) → state mới. */\nexport function luongDatLichReducer(state: LuongDatLich, action: HanhDongDatLich): LuongDatLich {\n  switch (action.type) {\n    case 'chon-bac-si':\n      // Đổi bác sĩ ⇒ khung giờ cũ thuộc bác sĩ khác ⇒ bỏ. Thông tin bệnh nhân thì giữ (vẫn là người đó).\n      return { ...state, buoc: 2, bacSiId: action.bacSiId, khungGioId: state.bacSiId === action.bacSiId ? state.khungGioId : null };\n    case 'chon-ngay':\n      if (state.buoc !== 2 || action.ngay === state.ngay) return state;\n      return { ...state, ngay: action.ngay, khungGioId: null };\n    case 'chon-khung-gio':\n      if (state.bacSiId === null) return state;\n      return { ...state, buoc: 3, khungGioId: action.khungGioId };\n    case 'nhap-thong-tin':\n      if (state.khungGioId === null) return state;\n      return { ...state, buoc: 4, thongTin: action.thongTin };\n    case 'quay-lai':\n      return state.buoc === 1 ? state : { ...state, buoc: (state.buoc - 1) as Buoc };\n    case 'lam-lai':\n      return LUONG_BAN_DAU;\n    default: {\n      const conSot: never = action; // quên một loại hành động ⇒ tsc báo ở đây\n      return conSot;\n    }\n  }\n}",
 "lichHenCuaToi": "import { useBacSi } from '../hooks/useBacSi';\nimport { useHuyLichHen, useLichHen } from '../hooks/useLichHen';\nimport { hienGio } from '../logic/thoi-gian';\nimport type { TrangThaiLichHen } from '../types';\nimport { LoiTaiDuLieu } from './LoiTaiDuLieu';\n\nconst TEN_TRANG_THAI: Record<TrangThaiLichHen, string> = {\n  'cho-xac-nhan': 'Chờ xác nhận',\n  'da-xac-nhan': 'Đã xác nhận',\n  'da-huy': 'Đã huỷ',\n};\n\nexport function LichHenCuaToi() {\n  const { data: lichHen, isPending, error, refetch, isFetching } = useLichHen();\n  const { data: bacSi } = useBacSi();\n  const huy = useHuyLichHen();\n\n  return (\n    <section className=\"lich-hen\" aria-label=\"Lịch hẹn của tôi\">\n      <h2>Lịch hẹn của tôi {lichHen && `(${lichHen.length})`}</h2>\n      {isPending ? (\n        <p className=\"goi-y\" aria-busy=\"true\">\n          Đang tải lịch hẹn…\n        </p>\n      ) : !lichHen ? (\n        <LoiTaiDuLieu tieuDe=\"Không tải được lịch hẹn\" loi={error!} onThuLai={() => refetch()} dangThuLai={isFetching} />\n      ) : lichHen.length === 0 ? (\n        <p className=\"goi-y\">Chưa có lịch hẹn nào.</p>\n      ) : (\n        <ul>\n          {lichHen.map((lh) => (\n            <li key={lh.id} className={lh.trangThai}>\n              <strong>{bacSi?.find((b) => b.id === lh.bacSiId)?.ten ?? lh.bacSiId}</strong> · {hienGio(lh.batDau)} ·{' '}\n              {lh.benhNhan.hoTen} · <span className=\"trang-thai\">{TEN_TRANG_THAI[lh.trangThai]}</span>\n              {lh.trangThai === 'cho-xac-nhan' && (\n                <button type=\"button\" className=\"nut nut-nho\" onClick={() => huy.mutate(lh)} aria-label={`Huỷ lịch ${lh.id}`}>\n                  Huỷ\n                </button>\n              )}\n            </li>\n          ))}\n        </ul>\n      )}\n    </section>\n  );\n}",
 "header": "import { useLichHen } from '../hooks/useLichHen';\n\nexport function Header() {\n  // Chương 6: số lịch hẹn là dữ liệu của MÁY CHỦ ⇒ đọc từ cache TanStack Query (cùng key với LichHenCuaToi — một request).\n  const { data } = useLichHen();\n  const soLichHen = data?.filter((lh) => lh.trangThai !== 'da-huy').length;\n  return (\n    <header className=\"header\">\n      <div>\n        <h1>Phòng khám An Tâm</h1>\n        <p>Mở cửa 7:30–20:00, thứ Hai đến thứ Bảy</p>\n      </div>\n      <p className=\"huy-hieu\" aria-label=\"Số lịch hẹn của tôi\">\n        Lịch hẹn của tôi: {soLichHen ?? '…'}\n      </p>\n    </header>\n  );\n}",
 "store": "import { create } from 'zustand';\nimport { createJSONStorage, persist } from 'zustand/middleware';\nimport { doiYeuThich } from '../logic/yeu-thich';\n\ninterface DatLichState {\n  yeuThich: string[];\n  doiYeuThich: (bacSiId: string) => void;\n}\n\n/**\n * State CỦA NGƯỜI DÙNG, dùng ở nhiều nơi xa nhau và cần sống qua F5 ⇒ một store Zustand có persist.\n * Chương 6: `lichHen` RỜI store — lịch hẹn giờ nằm trên máy chủ (GET /api/lich-hen), TanStack Query giữ bản sao.\n * Hai bản sao của cùng một dữ liệu máy chủ (store + cache) là công thức cho \"màn này nói 2, màn kia nói 3\".\n */\nexport const useDatLichStore = create<DatLichState>()(\n  persist(\n    (set) => ({\n      yeuThich: [],\n      doiYeuThich: (bacSiId) => set((s) => ({ yeuThich: doiYeuThich(s.yeuThich, bacSiId) })),\n    }),\n    {\n      name: 'phong-kham-dat-lich',\n      storage: createJSONStorage(() => localStorage),\n      partialize: (s) => ({ yeuThich: s.yeuThich }),\n      version: 2,\n      // bản lưu version 1 (Chương 5) còn mảng lichHen ⇒ bỏ nó đi, giữ yêu thích\n      migrate: (cu) => ({ yeuThich: (cu as { yeuThich?: string[] }).yeuThich ?? [] }),\n    },\n  ),\n);",
 "thoiGian": "/** Ba ngày khám mở đặt lịch (cố định để test và ảnh chụp lặp lại được; app thật tính từ hôm nay). */\nexport const NGAY_KHAM = ['2026-10-01', '2026-10-02', '2026-10-03'];\n\n/** '2026-10-01T09:30:00+07:00' → '09:30 · 01/10/2026' (cắt chuỗi, không phụ thuộc múi giờ của máy chạy). */\nexport function hienGio(iso: string): string {\n  const [ngay, gioPhut] = [iso.slice(0, 10), iso.slice(11, 16)];\n  return `${gioPhut} · ${hienNgay(ngay)}`;\n}\n\n/** '2026-10-01' → '01/10/2026' */\nexport function hienNgay(ngay: string): string {\n  const [n, t, d] = ngay.split('-');\n  return `${d}/${t}/${n}`;\n}",
 "cssCh6": "/* ── Chương 6: đang tải, lỗi, rỗng, thông báo ── */\n@keyframes lap-lanh { from { background-position: -200px 0; } to { background-position: calc(200px + 100%) 0; } }\n.khung-xuong-dong, .khung-xuong-nut { border-radius: 8px; background: #e2e8f0 linear-gradient(90deg, #e2e8f0, #f1f5f9, #e2e8f0) no-repeat; background-size: 200px 100%; animation: lap-lanh 1.2s ease-in-out infinite; }\n.khung-xuong-dong { height: 14px; margin: 8px 0; }\n.khung-xuong-the { min-height: 132px; }\n.khung-xuong-the .khung-xuong-dong:first-child { height: 18px; }\n.khung-xuong-nut { height: 30px; width: 110px; margin-top: 14px; }\n.khung-xuong-nut.rong-gio { width: 150px; margin-top: 0; }\n.rong-40 { width: 40%; } .rong-55 { width: 55%; } .rong-70 { width: 70%; }\n@media (prefers-reduced-motion: reduce) { .khung-xuong-dong, .khung-xuong-nut { animation: none; } }\n.chi-doc-man-hinh { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }\n.hop-loi { background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 12px 16px; color: #9f1239; }\n.hop-loi p { margin: 0 0 8px; }\n.bang-cu { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; border-radius: 10px; padding: 6px 12px; font-size: 14px; margin: 0 0 12px; }\n.vung-thong-bao { position: fixed; right: 20px; bottom: 20px; display: grid; gap: 8px; z-index: 10; }\n.thong-bao { display: flex; gap: 12px; align-items: center; padding: 10px 14px; border-radius: 10px; box-shadow: 0 6px 20px rgba(15, 23, 42, .18); font-size: 14px; }\n.thong-bao.loi { background: #9f1239; color: #fff; }\n.thong-bao.thanh-cong { background: #166534; color: #fff; }\n.thong-bao button { background: none; border: 0; color: inherit; font-size: 18px; cursor: pointer; }\n.nut-nho { font-size: 12px; padding: 1px 8px; margin-left: 8px; }\n.lich-hen li.da-huy { color: #94a3b8; text-decoration: line-through; }\n.luong .chip-hang { margin-bottom: 12px; }",
 "tHandlers": "import { expect, test } from 'vitest';\n\n/** Gọi API giả như app gọi: fetch thường — MSW (setup.ts) chặn ở tầng mạng của Node. */\nconst goi = async (duong: string, init?: RequestInit) => {\n  const res = await fetch(duong, init);\n  return { status: res.status, body: await res.json() };\n};\nconst benhNhan = { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567', ngaySinh: '1995-03-14' };\nconst post = (body: unknown) => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });\n\ntest('GET /api/bac-si và /api/bac-si/:id', async () => {\n  const ds = await goi('/api/bac-si');\n  expect(ds.status).toBe(200);\n  expect(ds.body).toHaveLength(6);\n  expect((await goi('/api/bac-si/bs-4')).body.ten).toBe('BS. Phạm Ngọc Lan');\n  expect(await goi('/api/bac-si/bs-99')).toEqual({ status: 404, body: { loi: 'Không có bác sĩ bs-99' } });\n});\n\ntest('GET khung giờ: 4 khung/ngày, thiếu ?ngay ⇒ 400', async () => {\n  const kg = await goi('/api/bac-si/bs-2/khung-gio?ngay=2026-10-01');\n  expect(kg.body.map((k: { batDau: string }) => k.batDau.slice(11, 16))).toEqual(['08:00', '09:30', '14:00', '15:30']);\n  expect((await goi('/api/bac-si/bs-2/khung-gio')).status).toBe(400);\n});\n\ntest('POST /api/lich-hen: 201, khung giờ thành kín, đặt lại ⇒ 409', async () => {\n  await goi('/api/bac-si/bs-2/khung-gio?ngay=2026-10-01');\n  const yc = { bacSiId: 'bs-2', khungGioId: 'bs-2-2026-10-01-1400', benhNhan, lyDo: 'Khám' };\n  const lan1 = await goi('/api/lich-hen', post(yc));\n  expect(lan1.status).toBe(201);\n  expect(lan1.body).toMatchObject({ id: 'lh-1', trangThai: 'cho-xac-nhan', batDau: '2026-10-01T14:00:00+07:00' });\n  const kg = await goi('/api/bac-si/bs-2/khung-gio?ngay=2026-10-01');\n  expect(kg.body.find((k: { id: string }) => k.id === yc.khungGioId).conTrong).toBe(false);\n  expect(await goi('/api/lich-hen', post(yc))).toEqual({ status: 409, body: { loi: 'Khung giờ này vừa có người đặt' } });\n  expect((await goi('/api/lich-hen', post({ ...yc, lyDo: '' }))).status).toBe(400); // máy chủ kiểm lại bằng schema\n});\n\ntest('PATCH /api/lich-hen/:id huỷ ⇒ khung giờ mở lại', async () => {\n  await goi('/api/bac-si/bs-2/khung-gio?ngay=2026-10-01');\n  await goi('/api/lich-hen', post({ bacSiId: 'bs-2', khungGioId: 'bs-2-2026-10-01-0800', benhNhan, lyDo: 'Khám' }));\n  const huy = await goi('/api/lich-hen/lh-1', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trangThai: 'da-huy' }) });\n  expect(huy.body.trangThai).toBe('da-huy');\n  const kg = await goi('/api/bac-si/bs-2/khung-gio?ngay=2026-10-01');\n  expect(kg.body.find((k: { id: string }) => k.id === 'bs-2-2026-10-01-0800').conTrong).toBe(true);\n  expect((await goi('/api/lich-hen')).body).toHaveLength(1);\n});",
 "tLichHen": "import { screen } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\nimport { http, HttpResponse } from 'msw';\nimport { expect, test } from 'vitest';\nimport { db, khungGioTrongNgay } from '../mocks/co-so-du-lieu';\nimport { server } from '../mocks/node';\nimport { renderVoiQuery } from '../test/render';\nimport { LichHenCuaToi } from './LichHenCuaToi';\nimport { VungThongBao } from './VungThongBao';\n\nfunction coMotLichHen() {\n  khungGioTrongNgay('bs-2', '2026-10-01');\n  db.themLichHen({\n    bacSiId: 'bs-2', khungGioId: 'bs-2-2026-10-01-0800', batDau: '2026-10-01T08:00:00+07:00', lyDo: 'Khám', trangThai: 'cho-xac-nhan',\n    benhNhan: { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567', ngaySinh: '1995-03-14' },\n  });\n}\n\ntest('tải từ API: tên bác sĩ, giờ, trạng thái', async () => {\n  coMotLichHen();\n  renderVoiQuery(<LichHenCuaToi />);\n  expect(screen.getByText('Đang tải lịch hẹn…')).toBeInTheDocument();\n  expect(await screen.findByText('BS. Trần Thu Hà')).toBeInTheDocument();\n  expect(screen.getByRole('listitem')).toHaveTextContent('BS. Trần Thu Hà · 08:00 · 01/10/2026 · Nguyễn Thị Ánh · Chờ xác nhận');\n});\n\ntest('huỷ: hiện \"Đã huỷ\" ngay (lạc quan), máy chủ cũng đã huỷ', async () => {\n  coMotLichHen();\n  const user = userEvent.setup();\n  renderVoiQuery(<LichHenCuaToi />);\n  await user.click(await screen.findByRole('button', { name: 'Huỷ lịch lh-1' }));\n  expect(screen.getByText('Đã huỷ')).toBeInTheDocument();\n  expect(screen.queryByRole('button', { name: 'Huỷ lịch lh-1' })).not.toBeInTheDocument();\n  await screen.findByText('Lịch hẹn của tôi (1)');\n  expect(db.lichHen()[0].trangThai).toBe('da-huy');\n});\n\ntest('huỷ lỗi ⇒ hoàn tác + thông báo nổi', async () => {\n  coMotLichHen();\n  server.use(http.patch('/api/lich-hen/:id', () => HttpResponse.json({ loi: 'Máy chủ đang bận' }, { status: 500 })));\n  const user = userEvent.setup();\n  renderVoiQuery(<><LichHenCuaToi /><VungThongBao /></>);\n  await user.click(await screen.findByRole('button', { name: 'Huỷ lịch lh-1' }));\n  expect(await screen.findByText('Không huỷ được lịch hẹn — đã hoàn tác')).toBeInTheDocument();\n  expect(screen.getByText('Chờ xác nhận')).toBeInTheDocument();\n});",
 "tLuong": "import { screen, within } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\nimport { http, HttpResponse } from 'msw';\nimport { expect, test } from 'vitest';\nimport { db } from '../mocks/co-so-du-lieu';\nimport { server } from '../mocks/node';\nimport { renderVoiQuery } from '../test/render';\nimport { LuongDatLich } from './LuongDatLich';\n\nasync function dienThongTin(user: ReturnType<typeof userEvent.setup>, sdt = '0901 234 567') {\n  await user.type(screen.getByLabelText('Họ và tên'), 'Nguyễn Thị Ánh');\n  await user.type(screen.getByLabelText('Số điện thoại'), sdt);\n  await user.type(screen.getByLabelText('Ngày sinh'), '1995-03-14');\n  await user.type(screen.getByLabelText('Lý do khám'), 'Bé ho khan 3 ngày');\n  await user.click(screen.getByRole('button', { name: 'Tiếp tục' }));\n}\n\nasync function denBuoc4(user: ReturnType<typeof userEvent.setup>, gio = '14:00 · 01/10/2026', sdt?: string) {\n  await user.click(await screen.findByRole('button', { name: /BS\\. Trần Thu Hà/ }));\n  await user.click(await screen.findByRole('button', { name: gio }));\n  await dienThongTin(user, sdt);\n}\n\ntest('đi đủ 4 bước ⇒ POST /api/lich-hen, máy chủ có 1 lịch hẹn đúng khung giờ', async () => {\n  const user = userEvent.setup();\n  renderVoiQuery(<LuongDatLich />);\n  expect(screen.getByRole('heading', { name: 'Bước 1/4 — Chọn bác sĩ' })).toBeInTheDocument();\n  await denBuoc4(user);\n  const tomTat = screen.getByRole('heading', { name: 'Bước 4/4 — Xác nhận' }).parentElement!;\n  expect(within(tomTat).getByText('0901234567', { exact: false })).toBeInTheDocument();\n  await user.click(screen.getByRole('button', { name: 'Xác nhận đặt lịch' }));\n  expect(screen.getByRole('button', { name: 'Đang gửi…' })).toBeDisabled();\n  expect(await screen.findByRole('status')).toHaveTextContent('Đã đặt lịch với BS. Trần Thu Hà lúc 14:00 · 01/10/2026. Mã lịch hẹn: lh-1.');\n  expect(db.lichHen()).toHaveLength(1);\n  expect(db.lichHen()[0]).toMatchObject({ bacSiId: 'bs-2', khungGioId: 'bs-2-2026-10-01-1400', trangThai: 'cho-xac-nhan' });\n});\n\ntest('khung giờ đã kín thì không bấm được; đổi ngày ⇒ tải giờ của ngày khác', async () => {\n  const user = userEvent.setup();\n  renderVoiQuery(<LuongDatLich />);\n  await user.click(await screen.findByRole('button', { name: /BS\\. Nguyễn Minh An/ }));\n  expect(await screen.findByRole('button', { name: '14:00 · 01/10/2026 (kín)' })).toBeDisabled();\n  await user.click(screen.getByRole('button', { name: '02/10/2026' }));\n  expect(await screen.findByRole('button', { name: '09:30 · 02/10/2026 (kín)' })).toBeDisabled();\n  expect(screen.getByRole('button', { name: '14:00 · 02/10/2026' })).toBeEnabled();\n});\n\ntest('quay lại từ bước 4 ⇒ form bước 3 còn nguyên thông tin đã gõ', async () => {\n  const user = userEvent.setup();\n  renderVoiQuery(<LuongDatLich />);\n  await denBuoc4(user, '08:00 · 01/10/2026');\n  await user.click(screen.getByRole('button', { name: '← Quay lại' }));\n  expect(screen.getByLabelText('Họ và tên')).toHaveValue('Nguyễn Thị Ánh');\n  expect(screen.getByLabelText('Số điện thoại')).toHaveValue('0901234567');\n});\n\ntest('máy chủ trả 409 ⇒ ở lại bước 4, hiện lỗi của máy chủ, bấm lại được', async () => {\n  const user = userEvent.setup();\n  renderVoiQuery(<LuongDatLich />);\n  await denBuoc4(user, '08:00 · 01/10/2026', '0999 999 999');\n  await user.click(screen.getByRole('button', { name: 'Xác nhận đặt lịch' }));\n  expect(await screen.findByRole('alert')).toHaveTextContent('Số điện thoại này đang có một lịch chờ xác nhận');\n  expect(screen.getByRole('button', { name: 'Xác nhận đặt lịch' })).toBeEnabled();\n  expect(db.lichHen()).toHaveLength(0);\n});\n\ntest('người khác đặt mất khung giờ trong lúc mình điền form ⇒ 409, lưới giờ tải lại thấy \"kín\"', async () => {\n  const user = userEvent.setup();\n  renderVoiQuery(<LuongDatLich />);\n  await denBuoc4(user);\n  db.timKhungGio('bs-2-2026-10-01-1400')!.conTrong = false; // \"người khác\" vừa đặt\n  await user.click(screen.getByRole('button', { name: 'Xác nhận đặt lịch' }));\n  expect(await screen.findByRole('alert')).toHaveTextContent('Khung giờ này vừa có người đặt');\n  await user.click(screen.getByRole('button', { name: '← Quay lại' }));\n  await user.click(screen.getByRole('button', { name: '← Quay lại' }));\n  expect(await screen.findByRole('button', { name: '14:00 · 01/10/2026 (kín)' })).toBeDisabled();\n});\n\ntest('lỗi 500 khi tải giờ ⇒ hộp lỗi + nút Thử lại chạy được', async () => {\n  let lan = 0;\n  server.use(\n    http.get('/api/bac-si/:id/khung-gio', () => {\n      lan += 1;\n      if (lan === 1) return HttpResponse.json({ loi: 'Máy chủ đang bận, thử lại sau' }, { status: 500 });\n      return undefined; // lần sau: rơi xuống handler gốc\n    }),\n  );\n  const user = userEvent.setup();\n  renderVoiQuery(<LuongDatLich />);\n  await user.click(await screen.findByRole('button', { name: /BS\\. Trần Thu Hà/ }));\n  expect(await screen.findByRole('alert')).toHaveTextContent('Máy chủ đang bận, thử lại sau');\n  await user.click(screen.getByRole('button', { name: 'Thử lại' }));\n  expect(await screen.findByRole('button', { name: '08:00 · 01/10/2026' })).toBeEnabled();\n});",
 "tHeader": "import { screen } from '@testing-library/react';\nimport { expect, test } from 'vitest';\nimport { db } from '../mocks/co-so-du-lieu';\nimport { renderVoiQuery } from '../test/render';\nimport { Header } from './Header';\n\ntest('Header đọc số lịch hẹn từ API (qua cache), đang tải thì hiện …', async () => {\n  db.themLichHen({\n    bacSiId: 'bs-1', khungGioId: 'x', batDau: '2026-10-01T08:00:00+07:00', lyDo: 'Khám', trangThai: 'cho-xac-nhan',\n    benhNhan: { hoTen: 'A', soDienThoai: '0901234567', ngaySinh: '2000-01-01' },\n  });\n  renderVoiQuery(<Header />);\n  expect(screen.getByLabelText('Số lịch hẹn của tôi')).toHaveTextContent('Lịch hẹn của tôi: …');\n  expect(await screen.findByText('Lịch hẹn của tôi: 1')).toBeInTheDocument();\n});",
 "tStore": "import { expect, test } from 'vitest';\nimport { useDatLichStore } from './dat-lich-store';\n\ntest('doiYeuThich bật rồi tắt, trả mảng mới', () => {\n  const truoc = useDatLichStore.getState().yeuThich;\n  useDatLichStore.getState().doiYeuThich('bs-4');\n  expect(useDatLichStore.getState().yeuThich).toEqual(['bs-4']);\n  expect(useDatLichStore.getState().yeuThich).not.toBe(truoc);\n  useDatLichStore.getState().doiYeuThich('bs-4');\n  expect(useDatLichStore.getState().yeuThich).toEqual([]);\n});\n\ntest('persist chỉ ghi yêu thích (lịch hẹn đã lên máy chủ), version 2', () => {\n  useDatLichStore.getState().doiYeuThich('bs-2');\n  const luu = JSON.parse(localStorage.getItem('phong-kham-dat-lich')!);\n  expect(luu).toEqual({ state: { yeuThich: ['bs-2'] }, version: 2 });\n});\n\ntest('bản lưu cũ version 1 (còn lichHen) ⇒ migrate giữ yêu thích, bỏ lichHen', async () => {\n  localStorage.setItem('phong-kham-dat-lich', JSON.stringify({ state: { yeuThich: ['bs-6'], lichHen: [{ id: 'lh-9' }] }, version: 1 }));\n  await useDatLichStore.persist.rehydrate();\n  expect(useDatLichStore.getState().yeuThich).toEqual(['bs-6']);\n  expect(useDatLichStore.getState()).not.toHaveProperty('lichHen');\n});",
 "tKhuDau": "import { renderVoiQuery } from '../test/render';\nimport { KhuBacSi } from './KhuBacSi';\n\n/** Chương 6: danh sách tới từ API ⇒ render rồi ĐỢI thẻ đầu tiên xuất hiện. */\nasync function moKhuBacSi() {\n  renderVoiQuery(<KhuBacSi />);\n  await screen.findByRole('heading', { name: /^Đội ngũ bác sĩ/ });",
 "tBai1Dua": "/** bs-1 trả lời CHẬM (900 ms), bs-2 NHANH (100 ms) — như mạng di động thật. Đếm request bắt đầu / bị huỷ. */\nfunction mangCham() {\n  const nhatKy = { batDau: [] as string[], biHuy: [] as string[] };\n  server.use(\n    http.get('/api/bac-si/:id', async ({ params, request }) => {\n      const id = String(params.id);\n      nhatKy.batDau.push(id);\n      request.signal.addEventListener('abort', () => nhatKy.biHuy.push(id));\n      await delay(id === 'bs-1' ? 900 : 100);\n      return HttpResponse.json(danhSachBacSi.find((b) => b.id === id));\n    }),\n  );\n  return nhatKy;",
 "pkgMsw": "{\n  \"msw\": {\n    \"workerDirectory\": [\n      \"public\"\n    ]\n  }\n}"
};

/* ─── Output THẬT (rút gọn bằng "…") — chạy 25/09/2026 trên máy dựng bài ─── */
const OUT = {
 "mswInit": "$ npx msw init public --save\nCopying the worker script at \".../phong-kham/public\"...\n\nWorker script successfully copied!\n  - public\n\nContinue by describing the network in your application:\n\nhttps://mswjs.io/docs/quick-start\n\nUpdating \"msw.workerDirectory\" at \".../phong-kham/package.json\"...",
 "fetch404": "$ npx vitest run src/vi-du/bai1.test.tsx -t \"404\" --reporter=verbose\n[fetch 404] { ok: false, status: 404, body: { loi: 'Không có bác sĩ bs-99' } }\n[goiApi 404] true 404 Không có bác sĩ bs-99\n ✓ src/vi-du/bai1.test.tsx > 6.1 — fetch và lỗi HTTP > fetch KHÔNG ném lỗi khi 404 — phải tự kiểm res.ok",
 "duaTest": "$ npx vitest run src/vi-du/bai1.test.tsx -t \"cuộc đua\" --reporter=verbose\n[ngây thơ (không dọn dẹp)] đang xem bs-2 · t≈300ms: \"Hồ sơ: BS. Trần Thu Hà\" · t≈1200ms: \"Hồ sơ: BS. Nguyễn Minh An\" · request: bs-1,bs-2 · bị huỷ: —\n[cờ bỏ qua] đang xem bs-2 · t≈300ms: \"Hồ sơ: BS. Trần Thu Hà\" · t≈1200ms: \"Hồ sơ: BS. Trần Thu Hà\" · request: bs-1,bs-2 · bị huỷ: —\n[AbortController] đang xem bs-2 · t≈300ms: \"Hồ sơ: BS. Trần Thu Hà\" · t≈1200ms: \"Hồ sơ: BS. Trần Thu Hà\" · request: bs-1,bs-2 · bị huỷ: bs-1\n[useQuery] t≈1200ms: \"Hồ sơ: BS. Trần Thu Hà\" · request: bs-1,bs-2 · bị huỷ: bs-1 · cache bs-1: undefined\n ✓ … > ngây thơ (không dọn dẹp) 1207ms\n ✓ … > cờ bỏ qua 1162ms\n ✓ … > AbortController 1160ms\n ✓ … > useQuery (Bài 6.2): không cần cờ, không có cuộc đua 1214ms",
 "duaChromium": "$ node do-cuoc-dua.mjs 30        # Chromium thật, vite dev + MSW trong trình duyệt, ?tre=ngau-nhien\nvòng  1: bấm Bảo → Hà → Lan · đang chọn Phạm Ngọc Lan · ✗(Lê Quốc Bảo) ✓ ✓ ✓\nvòng  2: bấm An → Hà → Lan · đang chọn Phạm Ngọc Lan · ✗(Trần Thu Hà) ✓ ✓ ✓\nvòng  3: bấm Bảo → An → Vy · đang chọn Vũ Thảo Vy · ✓ ✓ ✓ ✓\nvòng  4: bấm Vy → An → Huy · đang chọn Hoàng Đức Huy · ✓ ✓ ✓ ✓\nvòng  5: bấm Vy → An → Vy · đang chọn Vũ Thảo Vy · ✗(Nguyễn Minh An) ✓ ✓ ✓\n…\nvòng 29: bấm An → Huy → Vy · đang chọn Vũ Thảo Vy · ✗(Nguyễn Minh An) ✓ ✓ ✓\nvòng 30: bấm Lan → An → Hà · đang chọn Trần Thu Hà · ✗(Phạm Ngọc Lan) ✓ ✓ ✓\n\nTổng 30 vòng — số vòng hiện SAI bác sĩ:\n  ① fetch trong effect, không dọn dẹp    18/30\n  ② cờ bỏ qua (boQua)                    0/30\n  ③ AbortController                      0/30\n  ④ useQuery                             0/30",
 "strict": "$ node do-strict.mjs             # Chromium thật, vite dev, <StrictMode> như main.tsx\n[vite dev + <StrictMode>] mở trang, chỉ vẽ MỘT ô, đếm request MSW nhận được:\n  ① fetch trong effect, không dọn dẹp      2 request GET /api/bac-si/bs-1\n  ② cờ bỏ qua (boQua)                      2 request GET /api/bac-si/bs-1\n  ③ AbortController                        2 request GET /api/bac-si/bs-1\n  ④ useQuery                               2 request GET /api/bac-si/bs-1\n  ⑤ useQuery, queryFn không nhận signal    1 request GET /api/bac-si/bs-1",
 "useFetch": "[useFetch] request: bs-1,bs-2,bs-2\n ✓ src/vi-du/bai1.test.tsx > 6.1 — useFetch tự viết > đúng khi đổi id nhanh, báo lỗi 404 — nhưng mở lại là tải lại (không cache) 1522ms",
 "abortRealm": "⎯⎯⎯⎯ Unhandled Rejection ⎯⎯⎯⎯⎯\nAbortError: This operation was aborted\n ❯ new DOMException node:internal/per_context/domexception:76:18\n ❯ AbortController.abort node:internal/abort_controller:504:18\n ❯ src/vi-du/bai1.tsx:44:24\n     44|     return () => boHuy.abort();",
 "bai1All": "$ npx vitest run src/vi-du/bai1.test.tsx\n Test Files  1 passed (1)\n      Tests  7 passed (7)",
 "noClient": "$ npx vitest run src/hooks/useBoLocUrl.test.tsx\n FAIL  src/hooks/useBoLocUrl.test.tsx > mở link có sẵn ?ck=nhi&q=vy ⇒ danh sách đã lọc ngay\n FAIL  src/hooks/useBoLocUrl.test.tsx > bấm chip ⇒ URL đổi (push); gõ tìm ⇒ URL đổi (replace, không đẻ thêm lịch sử)\n FAIL  src/hooks/useBoLocUrl.test.tsx > nút Back của trình duyệt ⇒ bộ lọc lùi theo\nError: No QueryClient set, use QueryClientProvider to set one\n ❯ useQueryClient node_modules/@tanstack/react-query/src/QueryClientProvider.tsx:29:11\n ❯ useBaseQuery node_modules/@tanstack/react-query/src/useBaseQuery.ts:53:18\n ❯ useQuery node_modules/@tanstack/react-query/src/useQuery.ts:292:10\n ❯ useBacSi src/hooks/useBacSi.ts:7:10",
 "statusLog": "$ npx vitest run src/vi-du/bai2.test.tsx -t \"status\" --reporter=verbose\npending/fetching isPending=true isFetching=true isLoading=true data=—\nsuccess/idle isPending=false isFetching=false isLoading=false data=6\n— invalidateQueries(['bac-si']) —\nsuccess/fetching isPending=false isFetching=true isLoading=false data=6\n[chưa chọn bác sĩ] status=pending fetchStatus=idle isPending=true isLoading=false · request: 0\n[chọn bs-2] request: /api/bac-si/bs-2/khung-gio?ngay=2026-10-01 · 4 khung giờ",
 "cacheLog": "$ npx vitest run src/vi-du/bai2.test.tsx -t \"cache\" --reporter=verbose\n[gộp trùng] 3 component dùng useBacSi() ⇒ 1 request: /api/bac-si\n[staleTime 5 phút] lần 2 render đầu tiên: \"Lần 2: 6 bác sĩ\" · tổng request: 1\n[staleTime 0] lần 2 render đầu tiên: \"Lần 2: 6 bác sĩ (đang làm mới)\" · tổng request: 2\n[focus, cả hai còn tươi] request: 0\n[focus, khung giờ đã cũ] request: /api/bac-si/bs-1/khung-gio?ngay=2026-10-01\n[invalidate ['bac-si','bs-1']] tải lại: /api/bac-si/bs-1/khung-gio?ngay=2026-10-01\n[invalidate ['bac-si']] tải lại: /api/bac-si, /api/bac-si/bs-1/khung-gio?ngay=2026-10-01, /api/bac-si/bs-2/khung-gio?ngay=2026-10-02\n[vừa đổi sang 02/10] isPlaceholderData=true isPending=false data[0]=2026-10-01T08:00:00+07:00\n[ngày mới về] data[0]=2026-10-02T08:00:00+07:00\n[gcTime 100ms] ngay khi tháo: còn · sau 150ms: đã xoá\n Test Files  1 passed (1)\n      Tests  9 passed (9)",
 "devtoolsInstall": "$ npm i -D @tanstack/react-query-devtools\n…\nfound 0 vulnerabilities\n$ node -p \"require('@tanstack/react-query-devtools/package.json').version\"\n5.103.2",
 "mutateLog": "$ npx vitest run src/vi-du/bai3.test.tsx -t \"useMutation\" --reporter=verbose\n[mutate] status: idle → pending → success · data.id=lh-1\n[mutate] request: GET /api/bac-si/bs-2/khung-gio → POST /api/lich-hen → GET /api/bac-si/bs-2/khung-gio · 14:00 conTrong=false\n[bấm đúp] 2 POST · được | lỗi: Khung giờ này vừa có người đặt\n[mutate] không ném · error.message = \"Không có khung giờ này\"\n[mutateAsync] ném: \"Không có khung giờ này\"\n ✓ … > trạng thái của mutate(): idle → pending → success, rồi khung giờ tự tải lại 148ms\n ✓ … > mutation KHÔNG gộp trùng: gọi mutate hai lần ⇒ hai POST, lần hai 409 15ms\n ✓ … > mutateAsync ném lỗi (phải try/catch); mutate thì không 64ms",
 "bay409": "$ npx vitest run src/components/LuongDatLich.test.tsx      # useDatLich còn dùng onSuccess\n   × người khác đặt mất khung giờ trong lúc mình điền form ⇒ 409, lưới giờ tải lại thấy \"kín\" 1321ms\nTestingLibraryElementError: Unable to find role=\"button\" and name \"14:00 · 01/10/2026 (kín)\"\n Test Files  1 failed (1)\n      Tests  1 failed | 5 passed (6)\n$ # đổi onSuccess → onSettled, chạy lại\n Test Files  1 passed (1)\n      Tests  6 passed (6)",
 "lacQuan": "$ npx vitest run src/vi-du/bai3.test.tsx -t \"lạc quan\" --reporter=verbose\n[lạc quan] \"Đã huỷ\" hiện sau 2 ms · máy chủ lúc đó: cho-xac-nhan\n[lạc quan] máy chủ xác nhận sau ~400 ms: da-huy\n[hoàn tác] bấm Huỷ: Đã huỷ → sau khi 500 về: Chờ xác nhận → thông báo: \"Không huỷ được lịch hẹn — đã hoàn tác\"\n[thiếu cancelQueries] 0ms cho-xac-nhan → 22ms da-huy → 303ms cho-xac-nhan → 932ms da-huy\n[có cancelQueries] 0ms cho-xac-nhan → 23ms da-huy\n ✓ … > màn hình đổi NGAY, trước khi máy chủ trả lời 640ms\n ✓ … > máy chủ lỗi ⇒ hoàn tác về \"Chờ xác nhận\" + thông báo nổi 347ms\n ✓ … > thiếu cancelQueries: một lần tải lại đang bay về ĐÈ lên bản lạc quan (màn hình nháy ngược) 2670ms",
 "retryLog": "$ npx vitest run src/vi-du/bai4.test.tsx -t \"retry\" --reporter=verbose\n[retry mặc định] gọi lúc (ms): 31, 1042, 3047, 7050 · failureCount: 0→1→2→3→4 · error sau 7050 ms: \"Máy chủ đang bận, thử lại sau\"\n[nenThuLai] 404: gọi 1 lần\n[nenThuLai] 500: gọi 4 lần\n ✓ … > mặc định của TanStack: 3 lần thử lại, chờ 1 s → 2 s → 4 s 7071ms\n ✓ … > nenThuLai của dự án: 404 không thử lại, 500 thì có 123ms",
 "loiChromium": "$ node chup-app.mjs loi          # Chromium thật, vite preview, ?loi=bac-si\nhộp lỗi hiện sau 7492 ms (retry 3 lần: 1 s + 2 s + 4 s)\n[error] Failed to load resource: the server responded with a status of 500 (Internal Server Error)\n[error] Failed to load resource: the server responded with a status of 500 (Internal Server Error)\n[error] Failed to load resource: the server responded with a status of 500 (Internal Server Error)\n✓ loi",
 "trangThaiLog": "$ npx vitest run src/vi-du/bai4.test.tsx --reporter=verbose\n ✓ … > bốn trạng thái của KhuBacSi > đang tải: skeleton có aria-busy 197ms\n ✓ … > bốn trạng thái của KhuBacSi > lỗi ⇒ hộp lỗi; Thử lại ⇒ có dữ liệu 84ms\n ✓ … > bốn trạng thái của KhuBacSi > rỗng ⇒ câu thông báo, không phải lưới trống 17ms\n[làm mới lỗi] status=error · data còn 6 bác sĩ · error=\"Máy chủ đang bận, thử lại sau\"\n ✓ … > bốn trạng thái của KhuBacSi > đã có dữ liệu mà làm mới lỗi ⇒ GIỮ danh sách + dải cảnh báo 57ms",
 "ranhGioiLog": "[ranh giới lỗi] Phần này gặp sự cố.Cannot read properties of undefined (reading 'slice')Tải lại phần này | khu bên cạnh: \"Khu lịch hẹn vẫn chạy\"\n[componentDidCatch] [RanhGioiLoi] Cannot read properties of undefined (reading 'slice')\n ✓ … > ranh giới lỗi > bug lúc render trong MỘT khu ⇒ chỉ khu đó hiện màn dự phòng 11ms\n[throwOnError] số lần gọi API: 2\n ✓ … > ranh giới lỗi > throwOnError + QueryErrorResetBoundary: lỗi lên ranh giới, bấm tải lại ⇒ gọi API lần nữa 30ms",
 "build": "$ npx vite build        # TRƯỚC chương (dự án sau Chương 5)\ndist/index.html                   0.46 kB │ gzip:   0.29 kB\ndist/assets/index-D24NHkjr.css    4.96 kB │ gzip:   1.40 kB\ndist/assets/index-BCCP4XlS.js   350.90 kB │ gzip: 109.80 kB\n$ npx vite build        # SAU chương\ndist/index.html                    0.46 kB │ gzip:   0.29 kB\ndist/assets/index-Z7O0MhFI.css     6.57 kB │ gzip:   1.93 kB\ndist/assets/index-D0V9EEDn.js    391.80 kB │ gzip: 121.97 kB\ndist/assets/browser-B0njgBNh.js  425.52 kB │ gzip: 160.22 kB\n✓ built in 674ms",
 "datXong": "$ npx tsc -b && npx vitest run\n RUN  v5.0.1 ~/phong-kham\n\n Test Files  21 passed (21)\n      Tests  81 passed (81)",
 "truocChuong": "$ npx vitest run         # dự án sau Chương 5, TRƯỚC khi làm chương này\n Test Files  19 passed (19)\n      Tests  72 passed (72)",
 "keyThieu": "$ npx vitest run src/vi-du/bai2.test.tsx -t \"key thiếu\" --reporter=verbose\n[key thiếu bacSiId] đang xem bs-2 · data[0].bacSiId=bs-1 · request: /api/bac-si/bs-1/khung-gio?ngay=2026-10-01\n ✓ … > queryKey ['khung-gio'] dùng chung cho mọi bác sĩ ⇒ đổi bác sĩ vẫn thấy giờ của người cũ 195ms",
 "bai4Tom": "$ npx vitest run src/vi-du/bai4.test.tsx --reporter=verbose\n ✓ … > mặc định của TanStack: 3 lần thử lại, chờ 1 s → 2 s → 4 s 7071ms\n ✓ … > nenThuLai của dự án: 404 không thử lại, 500 thì có 123ms\n ✓ … > bốn trạng thái của KhuBacSi > đang tải: skeleton có aria-busy 197ms\n ✓ … > bốn trạng thái của KhuBacSi > lỗi ⇒ hộp lỗi; Thử lại ⇒ có dữ liệu 84ms\n ✓ … > bốn trạng thái của KhuBacSi > rỗng ⇒ câu thông báo, không phải lưới trống 17ms\n ✓ … > bốn trạng thái của KhuBacSi > đã có dữ liệu mà làm mới lỗi ⇒ GIỮ danh sách + dải cảnh báo 57ms\n ✓ … > ranh giới lỗi > bug lúc render trong MỘT khu ⇒ chỉ khu đó hiện màn dự phòng 11ms\n ✓ … > ranh giới lỗi > throwOnError + QueryErrorResetBoundary: lỗi lên ranh giới, bấm tải lại ⇒ gọi API lần nữa 30ms\n Test Files  1 passed (1)\n      Tests  8 passed (8)"
};

/* ─── Sơ đồ mermaid trong bài (≤ 10 nút, nhãn ngắn; khối EN nhãn tiếng Anh, khối VI nhãn tiếng Việt) ─── */
/** Sơ đồ mermaid: trang học đọc textContent của <code class="language-mermaid"> rồi vẽ (LearnPageClient → mermaidRuntime). */
const MM = (src) => '<pre><code class="language-mermaid">' + H(src.trim()) + '</code></pre>';
const LM = (...dong) => MM(dong.join('\n'));
const SD = {
  /* 6.1 */
  mswVi: LM(
    'flowchart TB',
    '  C["Component gọi fetch /api/bac-si"] --> F{"App đang chạy ở đâu?"}',
    '  F -->|"trình duyệt"| W["Service Worker: public/mockServiceWorker.js"]',
    '  F -->|"Node · Vitest"| N["setupServer vá mạng của Node"]',
    '  W --> HD["CÙNG một bộ handlers"]',
    '  N --> HD',
    '  HD --> DB[("CSDL trong bộ nhớ: 201, 404, 409 thật")]',
    '  N -. "request không có handler" .-> X["onUnhandledRequest: error, test hỏng"]',
  ),
  mswEn: LM(
    'flowchart TB',
    '  C["Component calls fetch /api/bac-si"] --> F{"Where is the app running?"}',
    '  F -->|"browser"| W["Service Worker: public/mockServiceWorker.js"]',
    '  F -->|"Node · Vitest"| N["setupServer patches Node networking"]',
    '  W --> HD["The SAME handlers"]',
    '  N --> HD',
    '  HD --> DB[("In-memory database: real 201, 404, 409")]',
    '  N -. "request with no handler" .-> X["onUnhandledRequest: error, test fails"]',
  ),
  suaDuaVi: LM(
    'sequenceDiagram',
    '  participant U as Người dùng',
    '  participant E as Effect của hồ sơ',
    '  participant S as API',
    '  U->>E: mở bs-1',
    '  E->>S: GET bs-1 (chậm 900 ms)',
    '  U->>E: 50 ms sau đổi sang bs-2',
    '  E->>E: dọn lần chạy bs-1: boQua = true, abort()',
    '  E->>S: GET bs-2 (100 ms)',
    '  S-->>E: bs-2 về trước: setBacSi(Trần Thu Hà)',
    '  S--xE: bs-1 về sau: bị bỏ qua (cờ) hoặc đã huỷ (abort)',
    '  Note over U,S: Không dọn thì bs-1 ghi đè: hiện Nguyễn Minh An',
  ),
  suaDuaEn: LM(
    'sequenceDiagram',
    '  participant U as User',
    '  participant E as Profile effect',
    '  participant S as API',
    '  U->>E: open bs-1',
    '  E->>S: GET bs-1 (slow, 900 ms)',
    '  U->>E: 50 ms later, switch to bs-2',
    '  E->>E: clean up the bs-1 run: boQua = true, abort()',
    '  E->>S: GET bs-2 (100 ms)',
    '  S-->>E: bs-2 first: setBacSi(Trần Thu Hà)',
    '  S--xE: bs-1 later: ignored (flag) or cancelled (abort)',
    '  Note over U,S: With no cleanup, bs-1 overwrites it: Nguyễn Minh An',
  ),
  strictVi: LM(
    'sequenceDiagram',
    '  participant R as React dev + StrictMode',
    '  participant E as Effect tải hồ sơ',
    '  participant S as MSW',
    '  R->>E: mount, effect chạy lần 1',
    '  E->>S: GET bs-1 (request 1)',
    '  R->>E: thử unmount: cleanup (boQua / abort)',
    '  R->>E: mount lại, effect chạy lần 2',
    '  E->>S: GET bs-1 (request 2)',
    '  S-->>E: chỉ câu trả lời của lần 2 được setState',
    '  Note over R,S: Production chỉ 1 request. Chữa bằng cleanup, đừng xoá StrictMode',
  ),
  strictEn: LM(
    'sequenceDiagram',
    '  participant R as React dev + StrictMode',
    '  participant E as Profile-loading effect',
    '  participant S as MSW',
    '  R->>E: mount, effect runs (1st)',
    '  E->>S: GET bs-1 (request 1)',
    '  R->>E: test unmount: cleanup (boQua / abort)',
    '  R->>E: mount again, effect runs (2nd)',
    '  E->>S: GET bs-1 (request 2)',
    '  S-->>E: only the 2nd answer reaches setState',
    '  Note over R,S: Production sends 1 request. Fix with cleanup, never remove StrictMode',
  ),
  /* 6.2 */
  khoaVi: LM(
    'flowchart TB',
    '  R["[bac-si] · danh sách bác sĩ"] --> B1["[bac-si, bs-1] · một bác sĩ"]',
    '  R --> B2["[bac-si, bs-2] · một bác sĩ"]',
    '  B1 --> K1["[bac-si, bs-1, khung-gio, ngày]"]',
    '  B2 --> K2["[bac-si, bs-2, khung-gio, ngày]"]',
    '  I1["invalidate [bac-si]"] -. "làm cũ CẢ nhánh" .-> R',
    '  I2["invalidate [bac-si, bs-1]"] -. "chỉ nhánh bs-1" .-> B1',
  ),
  khoaEn: LM(
    'flowchart TB',
    '  R["[bac-si] · doctor list"] --> B1["[bac-si, bs-1] · one doctor"]',
    '  R --> B2["[bac-si, bs-2] · one doctor"]',
    '  B1 --> K1["[bac-si, bs-1, khung-gio, date]"]',
    '  B2 --> K2["[bac-si, bs-2, khung-gio, date]"]',
    '  I1["invalidate [bac-si]"] -. "stales the WHOLE branch" .-> R',
    '  I2["invalidate [bac-si, bs-1]"] -. "only the bs-1 branch" .-> B1',
  ),
  vongDoiVi: LM(
    'flowchart TB',
    '  A["Component mount với key K"] --> B{"Cache đã có K?"}',
    '  B -->|"chưa"| C["isPending: skeleton, gọi queryFn"]',
    '  B -->|"có"| D["Vẽ NGAY dữ liệu trong cache"]',
    '  D --> E{"Còn trong staleTime?"}',
    '  E -->|"tươi"| F["Không gửi request nào"]',
    '  E -->|"cũ"| G["Refetch nền: isFetching (cả khi focus lại tab, có mạng lại)"]',
    '  H["Component cuối dùng K unmount"] --> I["Giữ thêm gcTime, mặc định 5 phút, rồi xoá"]',
  ),
  vongDoiEn: LM(
    'flowchart TB',
    '  A["A component mounts with key K"] --> B{"Is K in the cache?"}',
    '  B -->|"no"| C["isPending: skeleton, call queryFn"]',
    '  B -->|"yes"| D["Draw the cached data IMMEDIATELY"]',
    '  D --> E{"Still within staleTime?"}',
    '  E -->|"fresh"| F["No request at all"]',
    '  E -->|"stale"| G["Background refetch: isFetching (also on tab focus, reconnect)"]',
    '  H["Last component using K unmounts"] --> I["Kept for gcTime, 5 minutes by default, then removed"]',
  ),
  gopVi: LM(
    'flowchart TB',
    '  A["KhuBacSi: useBacSi()"] --> K["key [bac-si]"]',
    '  B["Bước 1 luồng đặt lịch: useBacSi()"] --> K',
    '  C["Danh sách lịch hẹn, lấy tên: useBacSi()"] --> K',
    '  K --> R["1 request GET /api/bac-si"]',
    '  R --> X[("Một mục cache, ba component cùng đọc")]',
  ),
  gopEn: LM(
    'flowchart TB',
    '  A["KhuBacSi: useBacSi()"] --> K["key [bac-si]"]',
    '  B["Booking flow step 1: useBacSi()"] --> K',
    '  C["Appointment list, for names: useBacSi()"] --> K',
    '  K --> R["1 request GET /api/bac-si"]',
    '  R --> X[("One cache entry, read by three components")]',
  ),
  /* 6.3 */
  mutationVi: LM(
    'sequenceDiagram',
    '  participant N as Người dùng',
    '  participant M as useDatLich (mutation)',
    '  participant S as API giả',
    '  participant C as Cache',
    '  N->>M: mutate(bác sĩ, khung 14:00, thông tin)',
    '  Note over M: idle → pending',
    '  M->>S: POST /api/lich-hen',
    '  S-->>M: 201 (hoặc 409: đã có người đặt)',
    '  M->>C: onSettled: invalidate khung giờ của bác sĩ + lich-hen',
    '  C->>S: GET khung giờ (chỉ query đang hiện)',
    '  S-->>C: 14:00 conTrong = false',
    '  Note over M: success khi dữ liệu mới đã về (onSettled trả Promise)',
  ),
  mutationEn: LM(
    'sequenceDiagram',
    '  participant N as User',
    '  participant M as useDatLich (mutation)',
    '  participant S as Fake API',
    '  participant C as Cache',
    '  N->>M: mutate(doctor, 14:00 slot, details)',
    '  Note over M: idle → pending',
    '  M->>S: POST /api/lich-hen',
    '  S-->>M: 201 (or 409: already taken)',
    '  M->>C: onSettled: invalidate the doctor slots + lich-hen',
    '  C->>S: GET slots (only queries on screen)',
    '  S-->>C: 14:00 conTrong = false',
    '  Note over M: success once fresh data is in (onSettled returns a Promise)',
  ),
  lacQuanVi: LM(
    'flowchart TB',
    '  A["Bấm Huỷ"] --> B["onMutate ① cancelQueries [lich-hen]"]',
    '  B --> C["② getQueryData: chụp danh sách cũ"]',
    '  C --> D["③ setQueryData: hiện Đã huỷ NGAY"]',
    '  D --> E["④ return bản chụp, rồi gửi request huỷ"]',
    '  E --> F{"Máy chủ trả lời?"}',
    '  F -->|"lỗi"| G["onError: đặt lại bản chụp"]',
    '  F -->|"thành công"| H["Giữ Đã huỷ"]',
    '  G --> I["⑤ onSettled: invalidate, lấy sự thật từ máy chủ"]',
    '  H --> I',
  ),
  lacQuanEn: LM(
    'flowchart TB',
    '  A["Click Huỷ"] --> B["onMutate ① cancelQueries [lich-hen]"]',
    '  B --> C["② getQueryData: snapshot the old list"]',
    '  C --> D["③ setQueryData: show Đã huỷ AT ONCE"]',
    '  D --> E["④ return the snapshot, then send the cancel request"]',
    '  E --> F{"Server answer?"}',
    '  F -->|"error"| G["onError: put the snapshot back"]',
    '  F -->|"success"| H["Keep Đã huỷ"]',
    '  G --> I["⑤ onSettled: invalidate, fetch the truth"]',
    '  H --> I',
  ),
  /* 6.4 */
  thuTuVi: LM(
    'flowchart TB',
    '  A{"① isPending?"} -->|"có"| S["Skeleton đúng hình"]',
    '  A -->|"không"| B{"② Không có dữ liệu nào?"}',
    '  B -->|"đúng: hỏng, chưa từng có"| E["Hộp lỗi + nút Thử lại"]',
    '  B -->|"có dữ liệu"| C{"③ length === 0?"}',
    '  C -->|"có"| R["Câu báo rỗng, không tô đỏ"]',
    '  C -->|"không"| D["④ Danh sách, thêm dải vàng nếu isError"]',
  ),
  thuTuEn: LM(
    'flowchart TB',
    '  A{"① isPending?"} -->|"yes"| S["Skeleton in the right shape"]',
    '  A -->|"no"| B{"② No data at all?"}',
    '  B -->|"true: failed, never had any"| E["Error box + Thử lại button"]',
    '  B -->|"has data"| C{"③ length === 0?"}',
    '  C -->|"yes"| R["Empty sentence, no red"]',
    '  C -->|"no"| D["④ The list, plus a yellow strip if isError"]',
  ),
  thuLaiVi: LM(
    'flowchart TB',
    '  A["queryFn ném lỗi"] --> B{"nenThuLai: LoiApi 4xx?"}',
    '  B -->|"có: 404, 400"| X["Không thử lại: error ngay, 1 lần gọi"]',
    '  B -->|"không: mất mạng, 5xx"| C{"Mới hỏng dưới 3 lần?"}',
    '  C -->|"có"| D["Chờ 1 s, rồi 2 s, rồi 4 s, gọi lại"]',
    '  D --> A',
    '  C -->|"không"| E["status = error sau 4 lần gọi, khoảng 7 s"]',
  ),
  thuLaiEn: LM(
    'flowchart TB',
    '  A["queryFn throws"] --> B{"nenThuLai: LoiApi 4xx?"}',
    '  B -->|"yes: 404, 400"| X["No retry: error at once, 1 call"]',
    '  B -->|"no: network, 5xx"| C{"Failed fewer than 3 times?"}',
    '  C -->|"yes"| D["Wait 1 s, then 2 s, then 4 s, call again"]',
    '  D --> A',
    '  C -->|"no"| E["status = error after 4 calls, about 7 s"]',
  ),
  ranhGioiVi: LM(
    'flowchart TB',
    '  App["App"] --> R1["RanhGioiLoi"]',
    '  App --> R2["RanhGioiLoi"]',
    '  App --> R3["RanhGioiLoi"]',
    '  R1 --> K["KhuBacSi"]',
    '  R2 --> L["LuongDatLich: vẫn chạy"]',
    '  R3 --> LH["LichHenCuaToi: vẫn chạy"]',
    '  K -->|"một thẻ ném lỗi lúc render"| F["RanhGioiLoi gần nhất vẽ thay: Phần này gặp sự cố"]',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class F xau',
    '  class L,LH tot',
  ),
  ranhGioiEn: LM(
    'flowchart TB',
    '  App["App"] --> R1["RanhGioiLoi"]',
    '  App --> R2["RanhGioiLoi"]',
    '  App --> R3["RanhGioiLoi"]',
    '  R1 --> K["KhuBacSi"]',
    '  R2 --> L["LuongDatLich: still works"]',
    '  R3 --> LH["LichHenCuaToi: still works"]',
    '  K -->|"one card throws while rendering"| F["The nearest RanhGioiLoi draws instead: Phần này gặp sự cố"]',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class F xau',
    '  class L,LH tot',
  ),
};

const L0 = {
  slug: 'rx-6-0-slides',
  type: 'DOCUMENT',
  isFreePreview: true,
  title: '6.0 — Chapter 6 slides: data fetching in pictures|||6.0 — Slide Chương 6: lấy dữ liệu bằng hình',
  description: 'Bộ 29 slide của Chương 6: API giả bằng MSW, fetch không ném lỗi với 404, cuộc đua đo trong Chromium (18/30 lần sai người), TanStack Query với key, staleTime/gcTime, status/fetchStatus, DevTools, mutation và invalidate, cập nhật lạc quan và hoàn tác, skeleton, thử lại, ranh giới lỗi, thông báo nổi.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Slides</span>
<h2>The whole chapter in 29 slides</h2>
<p class="lead">Until now every doctor, time slot and appointment in the clinic app lived in a TypeScript file. This chapter moves them to where real data lives: behind an API. You fake that API with MSW so the app cannot tell the difference, watch hand-written fetching go wrong in a real browser, then hand the whole job to TanStack Query — reading, caching, refreshing, writing, optimistic updates, and honest loading, error and empty states.</p>
<p>Slides 3–8 belong to Lesson 6.1 (server state, MSW, <code>res.ok</code>, the race condition measured in Chromium, <code>AbortController</code>, what a hand-rolled <code>useFetch</code> still lacks), 9–14 to 6.2 (<code>useQuery</code>, query keys, <code>staleTime</code> and <code>gcTime</code>, <code>status</code> vs <code>fetchStatus</code>, deduplication, DevTools), 15–19 to 6.3 (<code>useMutation</code>, invalidation, why a 409 must refresh too, optimistic cancel with rollback, the flicker you get without <code>cancelQueries</code>) and 20–25 to 6.4 (skeletons, error vs empty, retries measured, keeping stale data, error boundaries, toasts). Then come the finished app, the common mistakes, a cheat sheet and the "keep building the project" checklist. Every number and screenshot is real: measured on 25 September 2026 with React 19.3.0, TanStack Query 5.103.2, MSW 2.15.0, Vitest 5.0.1 and a real Chromium driven by Playwright.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Slide</span>
<h2>Cả chương trong 29 slide</h2>
<p class="lead">Tới giờ, mọi bác sĩ, khung giờ và lịch hẹn của app phòng khám đều nằm trong một file TypeScript. Chương này chuyển chúng về đúng chỗ dữ liệu thật sống: sau một API. Bạn làm giả API đó bằng MSW để app không phân biệt được thật giả, xem cách tự viết fetch hỏng ra sao trong một trình duyệt thật, rồi giao cả việc cho TanStack Query — đọc, cache, làm mới, ghi, cập nhật lạc quan, và các trạng thái đang tải, lỗi, rỗng cho tử tế.</p>
<p>Slide 3–8 thuộc Bài 6.1 (state server, MSW, <code>res.ok</code>, cuộc đua đo trong Chromium, <code>AbortController</code>, những gì một <code>useFetch</code> tự viết vẫn thiếu), 9–14 thuộc 6.2 (<code>useQuery</code>, query key, <code>staleTime</code> và <code>gcTime</code>, <code>status</code> và <code>fetchStatus</code>, gộp request trùng, DevTools), 15–19 thuộc 6.3 (<code>useMutation</code>, invalidate, vì sao lỗi 409 cũng phải làm mới, huỷ lịch lạc quan có hoàn tác, màn hình nháy ngược khi thiếu <code>cancelQueries</code>), 20–25 thuộc 6.4 (skeleton, lỗi khác rỗng, thử lại đo thật, giữ dữ liệu cũ, ranh giới lỗi, thông báo nổi). Sau đó là app hoàn chỉnh, sai lầm hay gặp, bảng tra nhanh và danh sách "tự gõ tiếp dự án". Mọi con số và ảnh chụp là THẬT: đo ngày 25/09/2026 bằng React 19.3.0, TanStack Query 5.103.2, MSW 2.15.0, Vitest 5.0.1 và một Chromium thật do Playwright điều khiển.</p>
</div>
${gallery('rx-06', [
  [1, 'Bìa — Chương 6: Lấy dữ liệu'],
  [2, 'Bản đồ chương'],
  [3, 'State client và state server'],
  [4, 'MSW trả lời thay máy chủ — trình duyệt và Node'],
  [5, 'fetch không ném lỗi với 404: tự kiểm res.ok'],
  [6, 'Cuộc đua đo trong Chromium: 18/30 lần sai người'],
  [7, 'Dòng thời gian cuộc đua: câu trả lời về sau cùng thắng'],
  [8, 'useFetch tự viết vẫn thiếu năm thứ · StrictMode'],
  [9, 'useQuery: một key, một hàm tải'],
  [10, 'Query key là địa chỉ trong cache'],
  [11, 'Vòng đời một mục cache: tươi, cũ, xoá'],
  [12, 'status và fetchStatus'],
  [13, 'Gộp request trùng, staleTime, focus, gcTime — đo thật'],
  [14, 'DevTools của TanStack Query — ảnh chụp thật'],
  [15, 'Luồng một mutation và invalidate'],
  [16, '409 nghĩa là lưới giờ đã cũ — onSettled'],
  [17, 'Mutation không gộp trùng · mutate và mutateAsync'],
  [18, 'Cập nhật lạc quan: onMutate, onError, onSettled'],
  [19, 'Thiếu cancelQueries: màn hình nháy ngược'],
  [20, 'Skeleton đúng hình — ảnh chụp thật'],
  [21, 'Lỗi và rỗng — hai ảnh chụp thật'],
  [22, 'Thử lại 3 lần: 1 s, 2 s, 4 s'],
  [23, 'Làm mới lỗi thì giữ dữ liệu · keepPreviousData'],
  [24, 'Ranh giới lỗi'],
  [25, 'Thông báo nổi cho lỗi của mutation'],
  [26, 'Sai lầm hay gặp ở Chương 6'],
  [27, 'Bảng tra nhanh Chương 6'],
  [28, 'Kết quả chương'],
  [29, 'Tự gõ tiếp dự án'],
])}
`,
};


const L1 = {
  slug: 'rx-6-1-fetch',
  type: 'LESSON',
  isFreePreview: true,
  title: '6.1 — Fetching in effects and why it hurts: MSW, a measured race, AbortController|||6.1 — Fetch trong effect, và vì sao đau đầu: MSW, cuộc đua đo thật, AbortController',
  description: 'State server khác state client; dựng sáu API giả bằng MSW cho cả trình duyệt lẫn test; fetch không ném lỗi với 404; cuộc đua khi fetch trong effect đo trong Chromium thật (18/30 lần hiện sai bác sĩ); cờ bỏ qua, AbortController, StrictMode, và những gì một useFetch tự viết vẫn thiếu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Fetching in effects, and why it hurts: a fake API, a race condition measured, AbortController</h2>
<p class="lead">Every list in the clinic app so far came from a TypeScript file. Real apps get their data from a server, and the moment data travels over a network three new things appear: it takes time, it can fail, and it can arrive in the wrong order. This lesson builds a fake API that behaves like a real one, writes the fetch-in-an-effect code everyone writes first, and then measures — in a real Chromium — how often it shows the wrong doctor.</p>

<p>Starting point: the project after Chapter 5 (store, URL filters, four-step booking flow; 19 test files, 72 tests green). Nothing in this lesson touches the production components yet — Lesson 6.2 does that. Here you build the API and learn precisely what goes wrong without a data library, so that you can explain it in an interview and recognise it in an old codebase.</p>

<h3>Server data is not your state — you only hold a snapshot</h3>
${S6(3, 'State client và state server')}
<p>Chapters 2–5 were about <strong>client state</strong>: which step of the booking flow you are on, which chip is selected, which doctors are favourites. Only this browser knows it, and your code is its owner. When you call <code>setBuoc(2)</code>, the step <em>is</em> 2.</p>
<p>The list of doctors, the free time slots and the appointments are <strong>server state</strong>. The server owns them. What your component holds is a copy taken at some moment — and three things are true of every such copy:</p>
<ul>
<li><strong>It takes time to get.</strong> There is a moment where you have nothing to show.</li>
<li><strong>Getting it can fail.</strong> The network drops, the server returns 500, the doctor was deleted (404).</li>
<li><strong>It goes stale without telling you.</strong> Another patient books 14:00 while you are filling in the form. Your screen still says "free".</li>
</ul>
<table>
<thead><tr><th></th><th>Client state</th><th>Server state</th></tr></thead>
<tbody>
<tr><td>Owner</td><td>your code</td><td>the server (and everyone else who writes to it)</td></tr>
<tr><td>Available</td><td>immediately</td><td>after a request — maybe never</td></tr>
<tr><td>Correct</td><td>always (you just set it)</td><td>only at the moment it was fetched</td></tr>
<tr><td>Tools in this course</td><td><code>useState</code>, <code>useReducer</code>, Zustand, the URL</td><td>TanStack Query (Lesson 6.2)</td></tr>
</tbody>
</table>
<p>Most "state management" pain in React apps comes from treating the second column like the first: copying server data into <code>useState</code> or a Redux store and then trying to keep the copy in sync by hand.</p>
<div class="callout"><p><strong>JS quick reminder — Promise and async/await.</strong> <code>fetch(url)</code> does not return data; it returns a <em>Promise</em> — an object that will hold the result later. <code>await</code> (allowed inside an <code>async</code> function) pauses <em>that function</em> until the Promise settles and gives you the value; the rest of the page keeps running. If the Promise fails, <code>await</code> throws, so you catch it with <code>try/catch</code>. <code>.then(fn)</code> is the older way to say the same thing.</p></div>

<h3>A fake API the app cannot tell apart from a real one: MSW</h3>
${S6(4, 'MSW trả lời thay máy chủ — trình duyệt và Node')}
<p>Chapter 3 faked the server with a function that waited 800 ms (<code>guiYeuCauDatLich</code>). That was fine for one form, but the component called that function directly — it was not making a network request, so nothing about loading, errors, caching or cancelling was real. <strong>MSW (Mock Service Worker)</strong> fakes the API at the <em>network</em> level instead: your code calls <code>fetch('/api/bac-si')</code> exactly as it will in production, and MSW answers.</p>
<ul>
<li>In the <strong>browser</strong> it installs a Service Worker (a script the browser runs between the page and the network) that forwards each request to your handlers.</li>
<li>In <strong>Node</strong> (Vitest) there is no Service Worker, so <code>setupServer()</code> patches Node's own networking. <em>The same handlers</em> serve both — one fake API for the app and for every test.</li>
</ul>
<p>The package is already in the project template (msw 2.15.0). The browser half needs one file copied into <code>public/</code>:</p>
${out(OUT.mswInit)}
<p>The handlers implement the six endpoints fixed in the course project contract. Each one says: "a request matching this method and path gets this response".</p>
${pre('ts', SN.handlersGet)}
<div class="callout"><p><strong>JS quick reminder — three bits of syntax in that file.</strong> <code>async ({ params, request }) =&gt; …</code> is an arrow function whose single argument is an object; the braces <em>destructure</em> it, pulling out two of its properties as variables (<code>params.id</code> is the <code>:id</code> part of the path). <code>searchParams.get('ngay') ?? ''</code>: <code>??</code> means "if the left side is <code>null</code> or <code>undefined</code>, use the right side". <code>dieuKhien.rong ? [] : db.bacSi()</code> is the ternary operator — "if … then … else …" in one expression.</p></div>
<p>Three details make this fake behave like a real server:</p>
<ul>
<li><strong>A small in-memory database</strong> (<code>src/mocks/co-so-du-lieu.ts</code>): booking a slot really marks it taken, cancelling really frees it, and the test setup resets it after every test. The full file is in the project solution at the end of Lesson 6.4.</li>
<li><strong>Real status codes</strong>: 404 for an unknown doctor, 400 for a missing <code>?ngay=</code>, 409 when a slot was already taken, 201 for a created appointment.</li>
<li><strong>Latency.</strong> <code>await delay()</code> with no argument waits a random 100–400 ms in the browser and 5 ms in Node — read in msw's own source (<code>MIN_SERVER_RESPONSE_TIME = 100</code>, <code>MAX_SERVER_RESPONSE_TIME = 400</code>, <code>NODE_SERVER_RESPONSE_TIME = 5</code>). For demos, <code>src/mocks/dieu-khien.ts</code> reads knobs from the page URL: <code>?tre=2000</code> slows every answer, <code>?tre=vo-han</code> hangs forever, <code>?tre=ngau-nhien</code> waits 100–1500 ms at random, <code>?loi=bac-si</code> makes that endpoint return 500, <code>?rong=1</code> returns an empty doctor list.</li>
</ul>
<p>Wiring it up is two small files and two places that start them — the browser worker in <code>main.tsx</code> <em>before</em> the first render (so the very first request already has an answer), and the Node server in the test setup:</p>
${pre('ts', SN.browser)}
${pre('ts', SN.node)}
${pre('tsx', SN.mainMsw)}
${pre('ts', SN.setupMsw)}
<p><code>onUnhandledRequest: 'error'</code> in tests is a safety net: a request with no handler fails the test instead of silently going out to the internet. In the browser the app uses <code>'bypass'</code> so Vite's own requests pass through untouched. This app has no real backend until Chapter 14, so it always starts the fake API; a project with a real server starts it only in development (<code>if (import.meta.env.DEV)</code>).</p>
${SD.mswEn}

<h3>fetch has two steps — and it does not throw on 404</h3>
${S6(5, 'fetch không ném lỗi với 404: tự kiểm res.ok')}
<p><code>fetch</code> resolves as soon as the server sends <em>headers</em>. The body comes later, through a second Promise: <code>res.json()</code>. And — the part that bites everyone once — <code>fetch</code> only rejects when the request could not be made at all (no network, DNS failure, blocked by CORS). A 404 or a 500 is, for <code>fetch</code>, a perfectly successful conversation: you get a <code>Response</code> with <code>ok: false</code>.</p>
${out(OUT.fetch404)}
<p>So every app has one small function that turns "HTTP said no" into a thrown error, and every API call goes through it:</p>
${pre('ts', SN.http)}
<p>Every call in the app then lives in one object, <code>api</code> in <code>src/api/phong-kham.ts</code> (<code>api.danhSachBacSi(signal)</code>, <code>api.khungGio(bacSiId, ngay, signal)</code>, <code>api.datLich(…)</code>…) — components never write <code>fetch</code> themselves. <code>LoiApi</code> keeps the status code. That matters twice later: the UI shows a different message for "server said no" than for "could not reach the server" (Lesson 6.4), and the retry rule refuses to retry a 404 (retrying cannot make a missing doctor appear).</p>
<div class="callout"><p><strong>JS quick reminder — <code>class … extends Error</code>.</strong> A class is a template for objects. <code>extends Error</code> means a <code>LoiApi</code> <em>is</em> an <code>Error</code> (so <code>throw</code>, <code>catch</code> and <code>instanceof Error</code> all work) with one extra field. <code>super(message)</code> runs the parent's constructor first. You will rarely write classes in React code — this and the error boundary in Lesson 6.4 are the two places in this course.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — the "doctor" with no name.</strong> Code: <code>fetch(url).then(r =&gt; r.json()).then(setBacSi)</code>. The doctor was deleted, the API returns 404 with <code>{ loi: 'Không có bác sĩ bs-99' }</code>. <code>fetch</code> does not throw, <code>r.json()</code> parses the error body, and <code>setBacSi</code> stores <code>{ loi: … }</code> as if it were a doctor. The page renders a card with an empty name and no error anywhere. TypeScript cannot help: the cast said "this is a <code>BacSi</code>". Always go through one function that checks <code>res.ok</code>.</p></div>

<h3>The code everyone writes first: fetch inside useEffect</h3>
<p>Chapter 4 showed effects synchronising with "something outside React". A network request is the most common something. Here is a doctor profile that loads by id — the version you will find in countless tutorials and FER202 projects:</p>
${pre('tsx', SN.bai1)}
<p>The first component, <code>HoSoNgayThat</code>, looks fine and works on a fast Wi-Fi. The other two are the two standard fixes. Before reading them, watch the first one fail.</p>

<h3>The race, measured in a real Chromium</h3>
${S6(6, 'Cuộc đua đo trong Chromium: 18/30 lần sai người')}
<p>An example page puts four versions side by side, all showing the doctor with the same <code>id</code>: ① the first component, ② with an ignore flag, ③ with <code>AbortController</code>, ④ with <code>useQuery</code> from Lesson 6.2. The page is opened with <code>?tre=ngau-nhien</code>, so each answer takes a random 100–1500 ms — like a mobile network. A Playwright script clicks three doctors 60 ms apart, like a receptionist scrolling through the list, waits until every answer has arrived, and compares each box with the doctor actually selected. Thirty rounds:</p>
${out(OUT.duaChromium)}
<p>Eighteen times out of thirty the first version showed a doctor the user was no longer looking at — with no error, no warning, nothing in the console. On the office Wi-Fi, where answers arrive quickly and in order, nobody can reproduce it. That is what makes it a classic bug report: "sometimes the profile shows the previous person".</p>
${S6(7, 'Dòng thời gian cuộc đua: câu trả lời về sau cùng thắng')}
<p>The mechanism is on the timeline. Opening <code>bs-1</code> starts a slow request (900 ms). 50 ms later the user switches to <code>bs-2</code>, whose request is fast (100 ms). The fast answer arrives first and the screen correctly shows Trần Thu Hà. Then the slow answer for <code>bs-1</code> arrives — and its <code>.then</code> still calls <code>setBacSi</code>, because nothing told it that it no longer matters. <strong>Whichever answer arrives last wins, even if it answers an old question.</strong> The test reproduces exactly that timeline with fixed delays (<code>server.use(…)</code> replaces the doctor handler for one test: <code>bs-1</code> waits 900 ms, everything else 100 ms), so it gives the same result every run:</p>
${out(OUT.duaTest)}

<h3>Two fixes: an ignore flag, and AbortController</h3>
<p><strong>② The ignore flag.</strong> Each run of the effect creates its own <code>let boQua = false</code>. When <code>id</code> changes, React runs the <em>previous</em> run's cleanup, which sets <em>that run's</em> <code>boQua</code> to <code>true</code>. The slow answer still arrives, but its <code>.then</code> checks the flag and does nothing. The request is not stopped — it is ignored.</p>
<div class="callout"><p><strong>JS quick reminder — why each run has its own flag (closure).</strong> A function remembers the variables that existed where it was created. The <code>.then</code> callback and the cleanup were both created inside the same effect run, so they share <em>that run's</em> <code>boQua</code>. The next run creates a brand-new <code>boQua</code>. That is a <em>closure</em>, and it is the whole trick; Lesson 4.3 went through it step by step.</p></div>
<p><strong>③ AbortController</strong> goes one step further and actually cancels the request. <code>new AbortController()</code> gives you a <code>signal</code> to pass to <code>fetch</code> and an <code>abort()</code> method; calling <code>abort()</code> in the cleanup stops the download (the browser's Network tab shows the request as "canceled") and makes the <code>fetch</code> Promise reject with an <code>AbortError</code>. You catch that one and ignore it — it is not a real error, you caused it. In the test above, the log line "bị huỷ: bs-1" is MSW seeing the request's signal abort.</p>
<p>Which one? react.dev's own advice is to prefer the flag as the baseline, because an abort signal only protects the <code>fetch</code> itself — if more asynchronous steps are chained after it, only a flag checked right before <code>setState</code> covers them. In practice you combine both: abort to save bandwidth, check before setting state.</p>
${SD.suaDuaEn}
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>instanceof DOMException</code> works in the browser and fails in the test.</strong> The first version of <code>HoSoCoHuy</code> ignored the cancellation with <code>if (loi instanceof DOMException &amp;&amp; loi.name === 'AbortError') return;</code>. In Chromium that works. In Vitest the error comes from Node's <code>AbortController</code>, whose <code>DOMException</code> is a different class from the one jsdom puts on <code>window</code> — <code>instanceof</code> says <code>false</code>, the code re-throws, and the run ends with:</p>
${out(OUT.abortRealm)}
<p>Ask the question you actually care about: <code>if (boHuy.signal.aborted) return;</code> — "did <em>I</em> cancel this?". It is true in every environment.</p></div>

<h3>StrictMode: two requests in development, on purpose</h3>
<p>Open the Network tab while developing and every effect-based fetch appears twice. That is not a bug in your code: in development, <code>&lt;StrictMode&gt;</code> mounts every component, immediately unmounts it, and mounts it again, precisely to expose effects that forget to clean up. Measured in Chromium with the example page, drawing one box at a time:</p>
${out(OUT.strict)}
<p>Two things to take from this. First, versions ②③ are correct <em>despite</em> the double request — the first run is cleaned up, so its answer is ignored or aborted. Do not "fix" the double request by removing <code>StrictMode</code> or by adding a "have I fetched already?" ref; you would only hide the missing cleanup. StrictMode only does this in development (react.dev: <em>StrictMode</em> reference). Second, even <code>useQuery</code> sent two requests here. TanStack Query's documentation explains why: when your query function <em>consumes</em> the <code>signal</code>, the library is allowed to cancel the query when its last component unmounts — and StrictMode's unmount does exactly that. Without the signal (⑤), the second mount finds the request already in flight and joins it: one request.</p>
${SD.strictEn}

<h3>Doing it properly by hand: a useFetch hook — and what it still lacks</h3>
${S6(8, 'useFetch tự viết vẫn thiếu năm thứ · StrictMode')}
<p>Chapter 4 taught you to move repeated effect logic into a custom hook. Here is a careful one: three mutually exclusive states in a tagged union (Lesson 2.4), reset to "loading" during render when the URL changes (Lesson 4.2), abort on cleanup, HTTP errors through <code>goiApi</code>:</p>
${pre('ts', SN.useFetch)}
${out(OUT.useFetch)}
<p>It is correct: no race, errors shown. But look at the request log: <code>bs-1, bs-2, bs-2</code>. Unmounting and mounting the same profile again fetched <code>bs-2</code> a second time and showed "Đang tải…" in between, because a hook's state dies with its component. To make this production-grade you would still have to add:</p>
<ol>
<li><strong>A cache</strong> shared by all components, so going back to a screen is instant.</li>
<li><strong>Deduplication</strong>: the header, the list and the booking flow all need the doctors — one request, not three.</li>
<li><strong>Retries</strong> with back-off for network blips and 5xx.</li>
<li><strong>Refreshing</strong> when the user returns to the tab or the network comes back.</li>
<li><strong>Invalidation</strong>: after booking, mark the time slots as stale everywhere.</li>
</ol>
<p>Each of those is a few dozen lines and a few subtle bugs. That is the job of a data-fetching library, and it is why react.dev's own reference says: if you do not use a framework, "consider using or building a client-side cache", naming TanStack Query first.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202 slides load data in <code>componentDidMount</code> (class component) or <code>useEffect(() =&gt; { axios.get(…).then(res =&gt; setData(res.data)) }, [])</code>, sometimes through a Redux thunk that dispatches <code>FETCH_START</code>/<code>FETCH_SUCCESS</code>/<code>FETCH_ERROR</code> into a store. → Companies in 2026 use <strong>TanStack Query</strong> (or the data layer of a framework like Next.js) for server state and keep Redux/Zustand for client state only. · <em>Why:</em> the FER202 way is not wrong — for one screen in an assignment it works, and you will meet it in older company codebases. But it has no cleanup (the race above), no cache, and it copies server data into a store that then has to be kept in sync by hand. A library removes whole categories of bugs instead of fixing them one by one.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "What is a race condition when fetching in <code>useEffect</code>, and how do you prevent it?"</p>
<p>Idea of an answer: when the dependency (say <code>id</code>) changes quickly, several requests are in flight and they can resolve in any order; the last one to resolve calls <code>setState</code> and wins, even if it answers an old <code>id</code>. Fix: return a cleanup that sets an "ignore" flag for that run (and/or aborts it with <code>AbortController</code>), so only the current run may set state. In a real app I would use TanStack Query, where each <code>queryKey</code> is its own cache entry, so an old answer can never overwrite a new one.</p></div>

<h3>When to fetch in an effect — and when NOT to</h3>
<ul>
<li><strong>Acceptable:</strong> a tiny standalone widget with no caching needs, a prototype, or a learning exercise — always with a cleanup.</li>
<li><strong>Not for app data:</strong> anything shown in more than one place, anything the user navigates back to, anything written to as well as read. That is TanStack Query from the next lesson.</li>
<li><strong>Never:</strong> fetching in an event handler's place. A POST that happens <em>because the user clicked</em> belongs in the click handler (or a mutation, Lesson 6.3), not in an effect that watches some "shouldSubmit" state.</li>
</ul>

<h3>Try it step by step</h3>
<ol>
<li>In the project, run <code>npx msw init public --save</code> and check that <code>public/mockServiceWorker.js</code> exists and <code>package.json</code> has a <code>msw.workerDirectory</code> field.</li>
<li>Create <code>src/mocks/handlers.ts</code>, <code>browser.ts</code>, <code>node.ts</code> as above; start the worker in <code>main.tsx</code>. Run <code>npm run dev</code>, open DevTools → Console and type <code>await (await fetch('/api/bac-si')).json()</code>: six doctors.</li>
<li>Type <code>(await fetch('/api/bac-si/bs-99')).ok</code>: <code>false</code>, and no exception.</li>
<li>Build the four-box example page, open it with <code>?tre=ngau-nhien</code>, click quickly across the doctors and watch box ①.</li>
<li>Open the Network tab, switch doctors quickly with version ③ only: some requests end as "(canceled)".</li>
<li>Run the lesson's tests:</li>
</ol>
${out(OUT.bai1All)}

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the receptionist wants to search doctors on the server: <code>GET /api/bac-si?q=lan</code>.</p><ol>
<li>Extend the <code>GET /api/bac-si</code> handler: read <code>q</code> from <code>new URL(request.url).searchParams</code>, and when present return only doctors whose name contains it (reuse the accent-insensitive matching from <code>loc-bac-si.ts</code>).</li>
<li>Write a test in <code>src/mocks/handlers.test.ts</code>: <code>fetch('/api/bac-si?q=lan')</code> returns exactly one doctor, BS. Phạm Ngọc Lan; <code>?q=xyz</code> returns <code>[]</code>.</li>
<li>Write <code>KetQuaTim({ q })</code> that fetches <code>/api/bac-si?q=…</code> in an effect with <code>AbortController</code>, and a test in the style of <code>mangCham()</code>: the answer for <code>"l"</code> takes 900 ms, the one for <code>"lan"</code> 100 ms; after switching, the screen must show only the result for <code>"lan"</code>.</li>
</ol><p><strong>Done when:</strong> both tests are green, <code>npx tsc -b</code> is clean, and in the browser typing fast with <code>?tre=ngau-nhien</code> never leaves an old result on screen.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">server state (state máy chủ)</span><span class="v">data owned by the server; the client only holds a snapshot that can be stale</span></div>
<div class="kv"><span class="k">MSW (Mock Service Worker)</span><span class="v">fakes an API at the network level — Service Worker in the browser, <code>setupServer</code> in Node</span></div>
<div class="kv"><span class="k">handler</span><span class="v"><code>http.get(path, resolver)</code>: which requests to answer and with what</span></div>
<div class="kv"><span class="k">res.ok</span><span class="v"><code>true</code> for status 200–299; <code>fetch</code> does not throw for 404/500</span></div>
<div class="kv"><span class="k">race condition (cuộc đua)</span><span class="v">several async results arrive in an unexpected order; the last one wins even if it is outdated</span></div>
<div class="kv"><span class="k">AbortController / signal</span><span class="v">cancels a <code>fetch</code>; the Promise rejects with <code>AbortError</code></span></div>
<div class="kv"><span class="k">cleanup</span><span class="v">the function an effect returns; runs before the next run and on unmount</span></div>
<div class="kv"><span class="k">StrictMode</span><span class="v">development-only double mount that exposes missing cleanups</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Server state is a copy that takes time, can fail and goes stale — treat it differently from client state.</li>
<li>MSW fakes the API at the network level; the same handlers serve the browser and every test.</li>
<li><code>fetch</code> only throws when the network fails; check <code>res.ok</code> in one wrapper that throws a typed error.</li>
<li>Fetching in an effect without cleanup shows the wrong data — 18 of 30 rounds in Chromium with realistic latency.</li>
<li>An ignore flag or <code>AbortController</code> in the cleanup fixes the race; StrictMode's double request in development is expected.</li>
<li>A careful <code>useFetch</code> is still missing cache, deduplication, retries, refresh and invalidation — the reason for TanStack Query.</li>
</ul>

${LINK('https://react.dev/learn/synchronizing-with-effects#fetching-data', '📄', 'react.dev — Synchronizing with Effects: fetching data', 'Cleanup that ignores or aborts, and why development shows two requests.')}
${LINK('https://react.dev/learn/you-might-not-need-an-effect#fetching-data', '📄', 'react.dev — You Might Not Need an Effect: fetching data', 'The race condition explained, and the useData custom hook.')}
${LINK('https://react.dev/reference/react/useEffect#what-are-good-alternatives-to-data-fetching-in-effects', '📄', 'react.dev — Alternatives to data fetching in Effects', 'Why frameworks and client-side caches such as TanStack Query exist.')}
${LINK('https://mswjs.io/docs/quick-start', '📄', 'MSW — Quick start', 'Handlers, setupWorker for the browser, setupServer for Node.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/API/AbortController', '📄', 'MDN — AbortController', 'signal, abort(), and the AbortError it produces.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Fetch trong effect, và vì sao đau đầu: API giả, cuộc đua đo thật, AbortController</h2>
<p class="lead">Mọi danh sách trong app phòng khám tới giờ đều lấy từ một file TypeScript. App thật lấy dữ liệu từ máy chủ, và ngay khi dữ liệu phải đi qua mạng, ba điều mới xuất hiện: nó mất thời gian, nó có thể hỏng, và nó có thể về sai thứ tự. Bài này dựng một API giả cư xử y như API thật, viết đoạn "fetch trong effect" mà ai cũng viết lần đầu, rồi đo — trong một Chromium thật — xem nó hiện sai bác sĩ bao nhiêu lần.</p>

<p>Điểm xuất phát: dự án sau Chương 5 (store, bộ lọc trên URL, luồng đặt lịch 4 bước; 19 file test, 72 test xanh). Bài này chưa đụng tới component thật của app — Bài 6.2 làm việc đó. Ở đây bạn dựng API và hiểu thật chính xác chuyện gì hỏng khi không có thư viện dữ liệu, để giải thích được lúc phỏng vấn và nhận ra nó trong một dự án cũ.</p>

<h3>Dữ liệu của máy chủ không phải state của bạn — bạn chỉ giữ một bản chụp</h3>
${S6(3, 'State client và state server')}
<p>Chương 2–5 nói về <strong>state client (state của giao diện)</strong>: đang ở bước nào của luồng đặt lịch, chip nào đang chọn, bác sĩ nào được yêu thích. Chỉ trình duyệt này biết nó, và code của bạn là chủ. Gọi <code>setBuoc(2)</code> thì bước <em>là</em> 2.</p>
<p>Danh sách bác sĩ, khung giờ còn trống và lịch hẹn là <strong>state server (state máy chủ)</strong>. Máy chủ là chủ của chúng. Thứ component của bạn giữ là một bản chép lấy vào một lúc nào đó — và bản chép nào cũng có ba tính chất:</p>
<ul>
<li><strong>Lấy về mất thời gian.</strong> Có một khoảnh khắc bạn chưa có gì để hiện.</li>
<li><strong>Lấy có thể hỏng.</strong> Mất mạng, máy chủ trả 500, bác sĩ đã bị xoá (404).</li>
<li><strong>Nó cũ đi mà không báo.</strong> Một bệnh nhân khác đặt mất 14:00 trong lúc bạn đang điền form. Màn hình của bạn vẫn ghi "còn trống".</li>
</ul>
<table>
<thead><tr><th></th><th>State client</th><th>State server</th></tr></thead>
<tbody>
<tr><td>Ai là chủ</td><td>code của bạn</td><td>máy chủ (và mọi người khác cùng ghi vào nó)</td></tr>
<tr><td>Có khi nào</td><td>ngay lập tức</td><td>sau một request — có khi không bao giờ</td></tr>
<tr><td>Đúng khi nào</td><td>luôn luôn (bạn vừa đặt nó)</td><td>chỉ đúng vào lúc lấy về</td></tr>
<tr><td>Công cụ trong khoá</td><td><code>useState</code>, <code>useReducer</code>, Zustand, URL</td><td>TanStack Query (Bài 6.2)</td></tr>
</tbody>
</table>
<p>Phần lớn nỗi khổ "quản lý state" trong app React đến từ việc đối xử với cột thứ hai như cột thứ nhất: chép dữ liệu máy chủ vào <code>useState</code> hay một store Redux, rồi cố tay giữ bản chép đó khớp với máy chủ.</p>
<div class="callout"><p><strong>JS nhắc nhanh — Promise và async/await.</strong> <code>fetch(url)</code> không trả về dữ liệu; nó trả về một <em>Promise</em> (lời hứa) — một object sẽ chứa kết quả vào lúc sau. <code>await</code> (chỉ dùng được trong hàm <code>async</code>) tạm dừng <em>riêng hàm đó</em> cho tới khi Promise xong và đưa bạn giá trị; phần còn lại của trang vẫn chạy. Promise hỏng thì <code>await</code> ném lỗi, nên bắt bằng <code>try/catch</code>. <code>.then(fn)</code> là cách viết cũ hơn của cùng một việc.</p></div>

<h3>Một API giả mà app không phân biệt được: MSW</h3>
${S6(4, 'MSW trả lời thay máy chủ — trình duyệt và Node')}
<p>Chương 3 giả máy chủ bằng một hàm đợi 800 ms (<code>guiYeuCauDatLich</code>). Với một form thì đủ, nhưng component gọi thẳng hàm đó — không có request mạng nào cả, nên mọi thứ về đang tải, lỗi, cache hay huỷ đều không thật. <strong>MSW (Mock Service Worker)</strong> giả API ở tầng <em>mạng</em>: code của bạn gọi <code>fetch('/api/bac-si')</code> y như khi lên production, và MSW trả lời.</p>
<ul>
<li>Trên <strong>trình duyệt</strong>, nó cài một Service Worker (một script trình duyệt chạy đứng giữa trang và mạng) chuyển từng request tới các handler của bạn.</li>
<li>Trong <strong>Node</strong> (Vitest) không có Service Worker, nên <code>setupServer()</code> chặn ngay tầng mạng của Node. <em>Cùng một bộ handler</em> phục vụ cả hai — một API giả cho app và cho mọi test.</li>
</ul>
<p>Gói đã có sẵn trong template dự án (msw 2.15.0). Nửa trình duyệt cần chép một file vào <code>public/</code>:</p>
${out(OUT.mswInit)}
<p>Các handler hiện thực sáu API đã chốt trong hợp đồng dự án của khoá. Mỗi handler nói: "request khớp phương thức và đường dẫn này thì trả thứ này".</p>
${pre('ts', SN.handlersGet)}
<div class="callout"><p><strong>JS nhắc nhanh — ba cú pháp trong file đó.</strong> <code>async ({ params, request }) =&gt; …</code> là arrow function nhận MỘT tham số là object; cặp ngoặc nhọn <em>destructuring</em> (bóc tách) nó, lấy hai thuộc tính ra thành hai biến (<code>params.id</code> là phần <code>:id</code> của đường dẫn). <code>searchParams.get('ngay') ?? ''</code>: <code>??</code> nghĩa là "vế trái là <code>null</code> hoặc <code>undefined</code> thì lấy vế phải". <code>dieuKhien.rong ? [] : db.bacSi()</code> là toán tử ba ngôi — "nếu … thì … không thì …" gói trong một biểu thức.</p></div>
<p>Ba chi tiết làm API giả này cư xử như máy chủ thật:</p>
<ul>
<li><strong>Một "cơ sở dữ liệu" nhỏ trong bộ nhớ</strong> (<code>src/mocks/co-so-du-lieu.ts</code>): đặt một khung giờ là nó kín thật, huỷ là nó mở lại thật, và phần cài đặt test xoá sạch nó sau mỗi test. File đầy đủ nằm trong lời giải dự án ở cuối Bài 6.4.</li>
<li><strong>Mã trạng thái thật</strong>: 404 khi không có bác sĩ, 400 khi thiếu <code>?ngay=</code>, 409 khi khung giờ đã có người đặt, 201 khi tạo được lịch hẹn.</li>
<li><strong>Độ trễ.</strong> <code>await delay()</code> không tham số đợi ngẫu nhiên 100–400 ms trên trình duyệt và 5 ms trong Node — đọc trong chính mã nguồn của msw (<code>MIN_SERVER_RESPONSE_TIME = 100</code>, <code>MAX_SERVER_RESPONSE_TIME = 400</code>, <code>NODE_SERVER_RESPONSE_TIME = 5</code>). Để minh hoạ, <code>src/mocks/dieu-khien.ts</code> đọc "núm vặn" từ URL của trang: <code>?tre=2000</code> làm mọi câu trả lời chậm 2 giây, <code>?tre=vo-han</code> treo mãi, <code>?tre=ngau-nhien</code> chậm ngẫu nhiên 100–1500 ms, <code>?loi=bac-si</code> làm API đó trả 500, <code>?rong=1</code> trả danh sách bác sĩ rỗng.</li>
</ul>
<p>Nối vào app là hai file nhỏ và hai chỗ khởi động chúng — worker trình duyệt trong <code>main.tsx</code>, <em>trước</em> lần render đầu (để ngay request đầu tiên đã có người trả lời), và server Node trong phần cài đặt test:</p>
${pre('ts', SN.browser)}
${pre('ts', SN.node)}
${pre('tsx', SN.mainMsw)}
${pre('ts', SN.setupMsw)}
<p><code>onUnhandledRequest: 'error'</code> trong test là lưới an toàn: request nào không có handler thì test hỏng ngay, thay vì lặng lẽ gọi ra Internet. Trên trình duyệt app dùng <code>'bypass'</code> để request của chính Vite đi qua bình thường. App này chưa có backend thật cho tới Chương 14 nên luôn bật API giả; dự án có máy chủ thật thì chỉ bật khi dev (<code>if (import.meta.env.DEV)</code>).</p>
${SD.mswVi}

<h3>fetch có hai bước — và nó không ném lỗi với 404</h3>
${S6(5, 'fetch không ném lỗi với 404: tự kiểm res.ok')}
<p><code>fetch</code> xong ngay khi máy chủ gửi <em>header</em>. Phần thân tới sau, qua một Promise thứ hai: <code>res.json()</code>. Và — chỗ ai cũng bị cắn một lần — <code>fetch</code> chỉ báo lỗi (reject) khi không gửi được request (mất mạng, lỗi DNS, bị CORS chặn). Với <code>fetch</code>, 404 hay 500 là một cuộc nói chuyện hoàn toàn thành công: bạn nhận một <code>Response</code> có <code>ok: false</code>.</p>
${out(OUT.fetch404)}
<p>Vì vậy app nào cũng có một hàm nhỏ biến "HTTP nói không" thành một lỗi được ném ra, và mọi lời gọi API đều đi qua nó:</p>
${pre('ts', SN.http)}
<p>Mọi lời gọi của app nằm trong một object, <code>api</code> ở <code>src/api/phong-kham.ts</code> (<code>api.danhSachBacSi(signal)</code>, <code>api.khungGio(bacSiId, ngay, signal)</code>, <code>api.datLich(…)</code>…) — component không bao giờ tự viết <code>fetch</code>. <code>LoiApi</code> giữ lại mã trạng thái. Điều đó có ích hai lần về sau: giao diện hiện câu khác nhau cho "máy chủ từ chối" và "không tới được máy chủ" (Bài 6.4), và luật thử lại từ chối thử lại một lỗi 404 (thử bao nhiêu lần thì bác sĩ không có vẫn không có).</p>
<div class="callout"><p><strong>JS nhắc nhanh — <code>class … extends Error</code>.</strong> Class là khuôn để đúc object. <code>extends Error</code> nghĩa là một <code>LoiApi</code> <em>là</em> một <code>Error</code> (nên <code>throw</code>, <code>catch</code>, <code>instanceof Error</code> đều chạy) có thêm một trường. <code>super(message)</code> chạy hàm dựng của lớp cha trước. Trong code React bạn hiếm khi viết class — đây và ranh giới lỗi ở Bài 6.4 là hai chỗ duy nhất trong khoá.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "bác sĩ" không có tên.</strong> Code: <code>fetch(url).then(r =&gt; r.json()).then(setBacSi)</code>. Bác sĩ đã bị xoá, API trả 404 kèm <code>{ loi: 'Không có bác sĩ bs-99' }</code>. <code>fetch</code> không ném lỗi, <code>r.json()</code> đọc thân báo lỗi, và <code>setBacSi</code> cất <code>{ loi: … }</code> như thể đó là một bác sĩ. Trang vẽ một thẻ có tên trống và không có lỗi nào ở đâu cả. TypeScript không cứu được: phép ép kiểu đã nói "đây là <code>BacSi</code>". Luôn đi qua một hàm có kiểm <code>res.ok</code>.</p></div>

<h3>Cách ai cũng viết lần đầu: fetch trong useEffect</h3>
<p>Chương 4 cho thấy effect dùng để đồng bộ với "thứ gì đó bên ngoài React". Request mạng là thứ phổ biến nhất. Đây là hồ sơ bác sĩ tải theo id — phiên bản bạn sẽ gặp trong vô số bài hướng dẫn và đồ án FER202:</p>
${pre('tsx', SN.bai1)}
<p>Component đầu tiên, <code>HoSoNgayThat</code>, trông ổn và chạy tốt trên Wi-Fi nhanh. Hai cái sau là hai cách chữa tiêu chuẩn. Trước khi đọc chúng, hãy xem cái đầu tiên hỏng.</p>

<h3>Cuộc đua, đo trong một Chromium thật</h3>
${S6(6, 'Cuộc đua đo trong Chromium: 18/30 lần sai người')}
<p>Một trang ví dụ đặt bốn phiên bản cạnh nhau, cùng hiện bác sĩ có cùng <code>id</code>: ① component đầu tiên, ② có cờ bỏ qua, ③ có <code>AbortController</code>, ④ dùng <code>useQuery</code> của Bài 6.2. Trang mở với <code>?tre=ngau-nhien</code>, mỗi câu trả lời mất ngẫu nhiên 100–1500 ms — như mạng di động. Một script Playwright bấm ba bác sĩ cách nhau 60 ms, như lễ tân lướt qua danh sách, đợi mọi câu trả lời về, rồi so từng ô với bác sĩ đang thật sự được chọn. Ba mươi vòng:</p>
${out(OUT.duaChromium)}
<p>Mười tám trên ba mươi lần, phiên bản đầu tiên hiện một bác sĩ mà người dùng đã không còn xem — không lỗi, không cảnh báo, console trống trơn. Trên Wi-Fi văn phòng, câu trả lời về nhanh và đúng thứ tự, không ai tái hiện được. Đó là lý do nó thành một báo lỗi kinh điển: "thỉnh thoảng hồ sơ hiện người trước đó".</p>
${S6(7, 'Dòng thời gian cuộc đua: câu trả lời về sau cùng thắng')}
<p>Cơ chế nằm trên dòng thời gian. Mở <code>bs-1</code> khởi động một request chậm (900 ms). 50 ms sau người dùng chuyển sang <code>bs-2</code>, request nhanh (100 ms). Câu trả lời nhanh về trước và màn hình hiện đúng Trần Thu Hà. Rồi câu trả lời chậm của <code>bs-1</code> về — và <code>.then</code> của nó vẫn gọi <code>setBacSi</code>, vì chẳng ai bảo nó rằng nó đã hết giá trị. <strong>Câu trả lời nào về sau cùng thì thắng, kể cả khi nó trả lời một câu hỏi cũ.</strong> Test tái hiện đúng dòng thời gian đó bằng độ trễ cố định (<code>server.use(…)</code> thay handler bác sĩ trong riêng một test: <code>bs-1</code> đợi 900 ms, còn lại 100 ms), nên lần chạy nào kết quả cũng như nhau:</p>
${out(OUT.duaTest)}

<h3>Hai cách chữa: cờ bỏ qua, và AbortController</h3>
<p><strong>② Cờ bỏ qua.</strong> Mỗi lượt chạy effect tạo một <code>let boQua = false</code> của riêng nó. Khi <code>id</code> đổi, React chạy cleanup của lượt <em>trước</em>, đặt <code>boQua</code> <em>của lượt đó</em> thành <code>true</code>. Câu trả lời chậm vẫn về, nhưng <code>.then</code> của nó kiểm cờ và không làm gì. Request không bị dừng — nó bị lờ đi.</p>
<div class="callout"><p><strong>JS nhắc nhanh — vì sao mỗi lượt có một cờ riêng (closure).</strong> Một hàm nhớ các biến tồn tại ở nơi nó được tạo ra. Hàm trong <code>.then</code> và hàm cleanup đều được tạo trong cùng một lượt chạy effect, nên chúng dùng chung <code>boQua</code> <em>của lượt đó</em>. Lượt sau tạo một <code>boQua</code> hoàn toàn mới. Đó là <em>closure</em> (bao đóng), và đó là toàn bộ mánh; Bài 4.3 đã đi qua từng bước.</p></div>
<p><strong>③ AbortController</strong> đi thêm một bước: huỷ hẳn request. <code>new AbortController()</code> cho bạn một <code>signal</code> để đưa vào <code>fetch</code> và một hàm <code>abort()</code>; gọi <code>abort()</code> trong cleanup sẽ dừng việc tải (tab Network của trình duyệt ghi request là "canceled") và làm Promise của <code>fetch</code> reject với lỗi <code>AbortError</code>. Bạn bắt lỗi đó và lờ đi — nó không phải lỗi thật, chính bạn gây ra nó. Trong test ở trên, dòng log "bị huỷ: bs-1" là MSW thấy signal của request bị abort.</p>
<p>Chọn cái nào? react.dev khuyên lấy cờ làm mức nền, vì signal chỉ bảo vệ bản thân <code>fetch</code> — nếu sau đó còn chuỗi bước bất đồng bộ khác, chỉ một cờ kiểm ngay trước <code>setState</code> mới che được hết. Thực tế người ta kết hợp: abort để đỡ tốn băng thông, kiểm cờ trước khi đặt state.</p>
${SD.suaDuaVi}
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>instanceof DOMException</code> chạy trên trình duyệt, hỏng trong test.</strong> Phiên bản đầu của <code>HoSoCoHuy</code> lờ việc huỷ bằng <code>if (loi instanceof DOMException &amp;&amp; loi.name === 'AbortError') return;</code>. Trong Chromium thì chạy. Trong Vitest, lỗi đến từ <code>AbortController</code> của Node, mà <code>DOMException</code> của Node là một class KHÁC với class jsdom gắn lên <code>window</code> — <code>instanceof</code> trả <code>false</code>, code ném lại lỗi, và lượt chạy kết thúc bằng:</p>
${out(OUT.abortRealm)}
<p>Hãy hỏi đúng câu bạn cần: <code>if (boHuy.signal.aborted) return;</code> — "có phải <em>chính mình</em> huỷ không?". Câu đó đúng ở mọi môi trường.</p></div>

<h3>StrictMode: hai request khi dev, cố ý</h3>
<p>Mở tab Network lúc đang dev, mọi fetch trong effect đều hiện hai lần. Không phải bug trong code của bạn: khi dev, <code>&lt;StrictMode&gt;</code> gắn mọi component, tháo ngay, rồi gắn lại — chính để lộ những effect quên dọn dẹp. Đo trong Chromium với trang ví dụ, mỗi lần chỉ vẽ một ô:</p>
${out(OUT.strict)}
<p>Hai điều rút ra. Một, phiên bản ②③ đúng <em>dù</em> có hai request — lượt đầu đã được dọn, nên câu trả lời của nó bị lờ hoặc bị huỷ. Đừng "sửa" hai request bằng cách bỏ <code>StrictMode</code> hay thêm một ref "đã tải chưa?"; bạn chỉ giấu đi chỗ thiếu dọn dẹp. StrictMode chỉ làm việc này khi dev (react.dev, trang tham khảo <em>StrictMode</em>). Hai, ngay cả <code>useQuery</code> cũng gửi hai request ở đây. Tài liệu TanStack Query giải thích: khi hàm tải của bạn <em>dùng</em> <code>signal</code>, thư viện được phép huỷ query khi component cuối cùng tháo ra — và lần tháo của StrictMode làm đúng điều đó. Không dùng signal (⑤), lần gắn thứ hai thấy request đang bay và nhập vào nó: một request.</p>
${SD.strictVi}

<h3>Tự viết cho tử tế: hook useFetch — và những gì nó vẫn thiếu</h3>
${S6(8, 'useFetch tự viết vẫn thiếu năm thứ · StrictMode')}
<p>Chương 4 dạy bạn gom logic effect lặp lại vào một custom hook. Đây là một cái viết cẩn thận: ba trạng thái loại trừ nhau bằng union có nhãn (Bài 2.4), về "đang tải" ngay trong lúc render khi URL đổi (Bài 4.2), abort trong cleanup, lỗi HTTP qua <code>goiApi</code>:</p>
${pre('ts', SN.useFetch)}
${out(OUT.useFetch)}
<p>Nó đúng: không cuộc đua, có hiện lỗi. Nhưng nhìn nhật ký request: <code>bs-1, bs-2, bs-2</code>. Tháo rồi gắn lại đúng hồ sơ đó là tải <code>bs-2</code> lần hai và hiện "Đang tải…" ở giữa, vì state của hook chết theo component. Muốn dùng được cho production, bạn còn phải thêm:</p>
<ol>
<li><strong>Cache</strong> dùng chung cho mọi component, để quay lại một màn hình là hiện ngay.</li>
<li><strong>Gộp request trùng</strong>: Header, danh sách và luồng đặt lịch đều cần bác sĩ — một request, không phải ba.</li>
<li><strong>Thử lại</strong> có giãn cách cho lúc mạng chập chờn và lỗi 5xx.</li>
<li><strong>Làm mới</strong> khi người dùng quay lại tab hay có mạng trở lại.</li>
<li><strong>Làm cũ (invalidate)</strong>: đặt lịch xong thì đánh dấu khung giờ là cũ ở mọi nơi.</li>
</ol>
<p>Mỗi thứ là vài chục dòng và vài bug khó thấy. Đó là việc của một thư viện lấy dữ liệu, và là lý do trang tham khảo của react.dev viết: nếu không dùng framework, "hãy cân nhắc dùng hoặc tự dựng một cache phía client", và kể tên TanStack Query đầu tiên.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Slide FER202 tải dữ liệu trong <code>componentDidMount</code> (class component) hoặc <code>useEffect(() =&gt; { axios.get(…).then(res =&gt; setData(res.data)) }, [])</code>, có khi qua một Redux thunk dispatch <code>FETCH_START</code>/<code>FETCH_SUCCESS</code>/<code>FETCH_ERROR</code> vào store. → Công ty năm 2026 dùng <strong>TanStack Query</strong> (hoặc tầng dữ liệu của framework như Next.js) cho state server, và chỉ để Redux/Zustand giữ state client. · <em>Vì sao:</em> cách của FER202 không sai — với một màn hình trong bài tập thì chạy tốt, và bạn sẽ gặp lại nó trong các dự án cũ ở công ty. Nhưng nó không có dọn dẹp (cuộc đua ở trên), không có cache, và chép dữ liệu máy chủ vào một store mà sau đó phải tự tay giữ cho khớp. Một thư viện xoá hẳn cả nhóm bug thay vì vá từng cái.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Race condition khi fetch trong <code>useEffect</code> là gì, và bạn tránh nó thế nào?"</p>
<p>Ý trả lời: khi dependency (ví dụ <code>id</code>) đổi nhanh, nhiều request cùng bay và chúng có thể xong theo bất kỳ thứ tự nào; request xong sau cùng gọi <code>setState</code> và thắng, kể cả khi nó trả lời một <code>id</code> cũ. Cách chữa: trả về một cleanup đặt cờ "bỏ qua" cho lượt đó (và/hoặc huỷ nó bằng <code>AbortController</code>), để chỉ lượt hiện tại được đặt state. Trong app thật tôi dùng TanStack Query, nơi mỗi <code>queryKey</code> là một mục cache riêng, nên câu trả lời cũ không thể đè lên câu trả lời mới.</p></div>

<h3>Khi nào fetch trong effect — khi nào KHÔNG</h3>
<ul>
<li><strong>Chấp nhận được:</strong> một widget nhỏ đứng riêng không cần cache, một bản nháp, một bài tập để học — luôn kèm cleanup.</li>
<li><strong>Không dùng cho dữ liệu của app:</strong> thứ hiện ở nhiều chỗ, thứ người dùng quay lại xem, thứ vừa đọc vừa ghi. Đó là TanStack Query từ bài sau.</li>
<li><strong>Không bao giờ:</strong> dùng effect thay chỗ của event handler. Một POST xảy ra <em>vì người dùng bấm</em> thuộc về hàm xử lý bấm (hay một mutation, Bài 6.3), không thuộc về một effect canh chừng state "cần gửi".</li>
</ul>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Trong dự án, chạy <code>npx msw init public --save</code>, kiểm <code>public/mockServiceWorker.js</code> đã có và <code>package.json</code> có trường <code>msw.workerDirectory</code>.</li>
<li>Tạo <code>src/mocks/handlers.ts</code>, <code>browser.ts</code>, <code>node.ts</code> như trên; khởi động worker trong <code>main.tsx</code>. Chạy <code>npm run dev</code>, mở DevTools → Console, gõ <code>await (await fetch('/api/bac-si')).json()</code>: sáu bác sĩ.</li>
<li>Gõ <code>(await fetch('/api/bac-si/bs-99')).ok</code>: <code>false</code>, và không có exception nào.</li>
<li>Dựng trang ví dụ bốn ô, mở với <code>?tre=ngau-nhien</code>, bấm nhanh qua các bác sĩ và nhìn ô ①.</li>
<li>Mở tab Network, chỉ để phiên bản ③, đổi bác sĩ thật nhanh: vài request kết thúc bằng "(canceled)".</li>
<li>Chạy test của bài:</li>
</ol>
${out(OUT.bai1All)}

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> lễ tân muốn tìm bác sĩ phía máy chủ: <code>GET /api/bac-si?q=lan</code>.</p><ol>
<li>Mở rộng handler <code>GET /api/bac-si</code>: đọc <code>q</code> từ <code>new URL(request.url).searchParams</code>; có <code>q</code> thì chỉ trả bác sĩ có tên chứa nó (dùng lại phép so không dấu trong <code>loc-bac-si.ts</code>).</li>
<li>Viết test trong <code>src/mocks/handlers.test.ts</code>: <code>fetch('/api/bac-si?q=lan')</code> trả đúng một bác sĩ, BS. Phạm Ngọc Lan; <code>?q=xyz</code> trả <code>[]</code>.</li>
<li>Viết <code>KetQuaTim({ q })</code> tải <code>/api/bac-si?q=…</code> trong effect có <code>AbortController</code>, và một test theo kiểu <code>mangCham()</code>: câu trả lời cho <code>"l"</code> mất 900 ms, cho <code>"lan"</code> mất 100 ms; sau khi đổi, màn hình chỉ được hiện kết quả của <code>"lan"</code>.</li>
</ol><p><strong>Đạt khi:</strong> hai test xanh, <code>npx tsc -b</code> sạch, và trên trình duyệt gõ nhanh với <code>?tre=ngau-nhien</code> không bao giờ để lại kết quả cũ trên màn hình.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">server state (state máy chủ)</span><span class="v">dữ liệu máy chủ làm chủ; phía client chỉ giữ một bản chụp có thể đã cũ</span></div>
<div class="kv"><span class="k">MSW (Mock Service Worker)</span><span class="v">giả API ở tầng mạng — Service Worker trên trình duyệt, <code>setupServer</code> trong Node</span></div>
<div class="kv"><span class="k">handler</span><span class="v"><code>http.get(đường dẫn, hàm trả lời)</code>: trả lời request nào, trả gì</span></div>
<div class="kv"><span class="k">res.ok</span><span class="v"><code>true</code> với mã 200–299; <code>fetch</code> không ném lỗi với 404/500</span></div>
<div class="kv"><span class="k">race condition (cuộc đua)</span><span class="v">nhiều kết quả bất đồng bộ về sai thứ tự; cái về sau cùng thắng dù đã cũ</span></div>
<div class="kv"><span class="k">AbortController / signal</span><span class="v">huỷ một <code>fetch</code>; Promise reject với <code>AbortError</code></span></div>
<div class="kv"><span class="k">cleanup (dọn dẹp)</span><span class="v">hàm effect trả về; chạy trước lượt sau và khi component tháo ra</span></div>
<div class="kv"><span class="k">StrictMode</span><span class="v">gắn hai lần CHỈ khi dev, để lộ chỗ thiếu dọn dẹp</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>State server là bản chép: mất thời gian, có thể hỏng, và cũ đi — đối xử khác với state client.</li>
<li>MSW giả API ở tầng mạng; cùng bộ handler phục vụ trình duyệt và mọi test.</li>
<li><code>fetch</code> chỉ ném lỗi khi mạng hỏng; kiểm <code>res.ok</code> trong MỘT hàm bọc ném lỗi có kiểu.</li>
<li>Fetch trong effect không dọn dẹp hiện sai dữ liệu — 18/30 vòng trong Chromium với độ trễ như thật.</li>
<li>Cờ bỏ qua hoặc <code>AbortController</code> trong cleanup chữa được cuộc đua; hai request của StrictMode khi dev là bình thường.</li>
<li><code>useFetch</code> viết cẩn thận vẫn thiếu cache, gộp request, thử lại, làm mới và làm cũ — lý do dùng TanStack Query.</li>
</ul>

${LINK('https://react.dev/learn/synchronizing-with-effects#fetching-data', '📄', 'react.dev — Synchronizing with Effects: fetching data', 'Cleanup bỏ qua hoặc huỷ, và vì sao khi dev thấy hai request.')}
${LINK('https://react.dev/learn/you-might-not-need-an-effect#fetching-data', '📄', 'react.dev — You Might Not Need an Effect: fetching data', 'Giải thích cuộc đua, và custom hook useData.')}
${LINK('https://react.dev/reference/react/useEffect#what-are-good-alternatives-to-data-fetching-in-effects', '📄', 'react.dev — Lựa chọn thay cho fetch trong effect', 'Vì sao có framework và cache phía client như TanStack Query.')}
${LINK('https://mswjs.io/docs/quick-start', '📄', 'MSW — Quick start', 'Handler, setupWorker cho trình duyệt, setupServer cho Node.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/API/AbortController', '📄', 'MDN — AbortController', 'signal, abort(), và lỗi AbortError nó sinh ra.')}
</div>
`,
};


const L2 = {
  slug: 'rx-6-2-tanstack',
  type: 'LESSON',
  isFreePreview: true,
  title: '6.2 — TanStack Query: useQuery, query keys, staleTime/gcTime, status vs fetchStatus|||6.2 — TanStack Query: useQuery, query key, staleTime/gcTime, status và fetchStatus',
  description: 'Thay fetch trong effect bằng useQuery: một QueryClient cho cả app, query key là địa chỉ trong cache (đi từ chung tới riêng), staleTime/gcTime và các lần tự làm mới, status khác fetchStatus, gộp request trùng, enabled, DevTools, và cách test với MSW — mọi hành vi đo thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>TanStack Query: one key, one fetch function — and a cache that does the rest</h2>
<p class="lead">Lesson 6.1 ended with a list of five things a hand-written fetch hook still lacks. TanStack Query is those five things, written and tested by other people. You give it a <em>key</em> (where the data lives in the cache) and a <em>function</em> (how to get it); it gives you the data, the loading and error states, and a cache shared by every component. This lesson moves the doctor list and the time slots of the clinic app onto it, and measures what the cache actually does.</p>

<p>The versions used here: <code>@tanstack/react-query</code> 5.103.2 (already in the project template) and <code>@tanstack/react-query-devtools</code> 5.103.2. Everything described is version 5; if you read an old tutorial with <code>useQuery('key', fn)</code> or <code>cacheTime</code>, that is version 3/4 — the ideas carry over, the names changed.</p>

<h3>One QueryClient for the whole app</h3>
<p>The cache lives in a <code>QueryClient</code>. You create one, outside any component, and hand it down through <code>QueryClientProvider</code> — the same Context mechanism as Lesson 5.1, so any component below can reach the cache:</p>
${pre('tsx', SN.main)}
<p>Two rules. <strong>Create the client once, outside components.</strong> Written inside <code>App</code>, a new client — with a new, empty cache — would be created on every render of <code>App</code>. <strong>Every component that calls <code>useQuery</code> must be under the provider</strong>, and tests are no exception. When Chapter 5's URL-filter tests rendered <code>&lt;KhuBacSi /&gt;</code> without it, all three failed immediately:</p>
${out(OUT.noClient)}
<p>The client's defaults (retry rules, a global error toast) come from <code>taoQueryClient()</code> in <code>src/query-client.ts</code>, which Lesson 6.4 builds.</p>

<h3>useQuery: a key and a function</h3>
${S6(9, 'useQuery: một key, một hàm tải')}
<p>Every query in the app lives in its own small hook, so components ask for data by meaning (<code>useBacSi()</code>), not by URL:</p>
${pre('ts', SN.useBacSi)}
${pre('ts', SN.api)}
<p>Reading it line by line:</p>
<ul>
<li><strong><code>queryKey</code></strong> — an array that names this piece of data in the cache. Same key anywhere in the app means the same cache entry.</li>
<li><strong><code>queryFn</code></strong> — any function that returns a Promise of the data, and <em>throws</em> when it fails (that is why <code>goiApi</code> from 6.1 throws on 404/500). TanStack calls it with a context object; <code>({ signal })</code> destructures the <code>AbortSignal</code> the library manages, so it can cancel a request nobody needs any more.</li>
<li><strong><code>staleTime</code></strong> — how long a result counts as fresh (next sections).</li>
</ul>
<p>What comes back is an object with the data and its state. <code>KhuBacSi</code> takes what it needs in one destructuring line — <code>const { data: danhSachBacSi, isPending, isError, error, refetch, isFetching } = useBacSi();</code> (<code>data: danhSachBacSi</code> renames <code>data</code> while destructuring) — and draws four states from it, which Lesson 6.4 covers in detail. Here is the same profile component as in 6.1, on <code>useQuery</code>:</p>
${pre('tsx', SN.bai2)}
<p>No <code>useState</code>, no <code>useEffect</code>, no ignore flag. And no race: in the same deterministic test as 6.1 (open <code>bs-1</code> taking 900 ms, switch to <code>bs-2</code> taking 100 ms), the result is correct — and the log shows the library aborted the abandoned <code>bs-1</code> request itself, because the query function passes the <code>signal</code> on:</p>
${out('[useQuery] t≈1200ms: "Hồ sơ: BS. Trần Thu Hà" · request: bs-1,bs-2 · bị huỷ: bs-1 · cache bs-1: undefined')}
<p>Why there is no race <em>by design</em>: <code>['bac-si', 'bs-1']</code> and <code>['bac-si', 'bs-2']</code> are two different cache entries. The slow answer for <code>bs-1</code> can only ever be written into the <code>bs-1</code> entry; the component, now subscribed to <code>bs-2</code>, never reads it.</p>
<div class="callout"><p><strong>JS quick reminder — <code>as const</code> and <code>60_000</code>.</strong> <code>['bac-si'] as const</code> tells TypeScript "this exact, read-only array", so the key's type is <code>readonly ['bac-si']</code> rather than <code>string[]</code> — typos become type errors. <code>60_000</code> is just <code>60000</code>; the underscore is a digit separator for readability.</p></div>

<h3>A query key is an address in the cache — from general to specific</h3>
${S6(10, 'Query key là địa chỉ trong cache')}
<p>Keys are arrays, and TanStack compares them <em>by prefix</em> when you invalidate. The clinic app arranges them like folders: everything about doctors starts with <code>'bac-si'</code>, a single doctor adds the id, their time slots add <code>'khung-gio'</code> and the date:</p>
${pre('ts', SN.khoa)}
${out(LOC(OUT.cacheLog, (d) => d.startsWith('$') || d.startsWith('[invalidate')))}
<p>Invalidating <code>['bac-si', 'bs-1']</code> refreshed only that doctor's slots; invalidating <code>['bac-si']</code> refreshed the list <em>and</em> every doctor's slots. Lesson 6.3 relies on this: after a booking, "everything under this doctor's time slots is stale".</p>
${SD.khoaEn}
<p>The rule that matters most: <strong>everything the query function uses must be in the key.</strong> The key is also the dependency list — when it changes, TanStack fetches. Leave a variable out and the cache cannot tell the requests apart:</p>
${out(OUT.keyThieu)}
<div class="pitfall co-tieu-de"><p><strong>Trap — every doctor shows the first doctor's time slots.</strong> A time-slot query written as <code>queryKey: ['khung-gio']</code> with <code>bacSiId</code> used only inside <code>queryFn</code>. The first doctor loads correctly. Switch to another doctor: the key did not change, so there is nothing to fetch — the measured test above still shows <code>bs-1</code>'s slots while viewing <code>bs-2</code>, with a single request in the log. The fix is the key <code>['bac-si', bacSiId, 'khung-gio', ngay]</code>. Keeping every key in one file (<code>api/khoa.ts</code>, a "query key factory") makes this mistake visible in review.</p></div>

<h3>Fresh, stale, unused, gone: staleTime and gcTime</h3>
${S6(11, 'Vòng đời một mục cache: tươi, cũ, xoá')}
<p>Each cache entry moves through a life cycle, and two numbers control it:</p>
<ul>
<li><strong><code>staleTime</code> — how long the data counts as fresh.</strong> Default: <code>0</code>, i.e. stale the moment it arrives. Fresh data is served from the cache without any request. Stale data is <em>still shown immediately</em>, but TanStack also refetches it in the background when a new component mounts with that key, when the window regains focus, or when the network reconnects (the official "important defaults" page).</li>
<li><strong><code>gcTime</code> — how long unused data is kept.</strong> Default: 5 minutes after the last component using the key unmounts. Then it is garbage-collected. (Version 4 called this <code>cacheTime</code>.)</li>
</ul>
<p>Measured in the lesson's tests:</p>
${out(LOC(OUT.cacheLog, (d) => ['staleTime', 'focus', 'gcTime'].some((k) => d.includes(k))))}
<p>Read it slowly. With <code>staleTime</code> of five minutes, mounting the list again rendered six doctors on the <em>first</em> render and sent no request. With the default <code>0</code>, it also rendered six doctors immediately — "(đang làm mới)" shows a background refetch was running — and sent a second request. Returning to the tab refetched only the query that was stale. With <code>gcTime</code> set to 100 ms for the test, the entry survived unmounting and was gone 150 ms later.</p>
${SD.vongDoiEn}
<p>So <code>staleTime</code> is a product decision about each kind of data. The clinic app sets:</p>
<table>
<thead><tr><th>Data</th><th>staleTime</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Doctors (<code>useBacSi</code>)</td><td>5 minutes</td><td>changes a few times a year; refetching on every screen is waste</td></tr>
<tr><td>Time slots (<code>useKhungGio</code>)</td><td>30 seconds</td><td>other patients book them; a short trust window, then refresh</td></tr>
<tr><td>My appointments (<code>useLichHen</code>)</td><td>0 (default)</td><td>small, and must be right after every change</td></tr>
</tbody>
</table>

<h3>status says "do I have data?", fetchStatus says "am I on the network?"</h3>
${S6(12, 'status và fetchStatus')}
<p>A query has two separate states, and mixing them up is the source of most flickering spinners:</p>
${out(OUT.statusLog)}
<ul>
<li><strong><code>status</code></strong>: <code>'pending'</code> (no data yet), <code>'error'</code>, <code>'success'</code>. Shorthands: <code>isPending</code>, <code>isError</code>, <code>isSuccess</code>.</li>
<li><strong><code>fetchStatus</code></strong>: <code>'fetching'</code> (a request is running, first load <em>or</em> background), <code>'paused'</code> (offline), <code>'idle'</code>. Shorthand: <code>isFetching</code>.</li>
<li><strong><code>isLoading</code></strong> = <code>isPending &amp;&amp; isFetching</code>: "no data, and fetching it now".</li>
</ul>
<p>The practical rule: draw the skeleton on <code>isPending</code>; show at most a small indicator on <code>isFetching</code>. The fourth line of the log is the case people miss — a query that is <em>disabled</em>:</p>
${pre('ts', SN.useKhungGio)}
<p>Before a doctor is chosen, <code>enabled: false</code> keeps the query from running. Its status is <code>pending</code> forever (it has no data) but it is not fetching, so <code>isLoading</code> is <code>false</code>. Code that shows a spinner on <code>isPending</code> for a disabled query spins until the end of time — which is why the booking flow only renders the slot grid at step 2, once a doctor exists. <code>placeholderData: keepPreviousData</code> is for changing the date: Lesson 6.4 shows it.</p>
<div class="callout"><p><strong>JS quick reminder — the <code>!</code> after <code>bacSiId</code>.</strong> <code>bacSiId!</code> is TypeScript's <em>non-null assertion</em>: "trust me, this is not <code>null</code> here". It is safe only because <code>enabled</code> guarantees the function never runs while <code>bacSiId</code> is <code>null</code>. Use it sparingly: unlike <code>?.</code> it checks nothing at runtime.</p></div>

<h3>Three components, one request</h3>
${S6(13, 'Gộp request trùng, staleTime, focus, gcTime — đo thật')}
<p>After this lesson, three places in the app need the doctors: the doctor area, step 1 of the booking flow and the appointments list (for names). They all call <code>useBacSi()</code>. Measured:</p>
${out(LOC(OUT.cacheLog, (d) => d.startsWith('[gộp')))}
<p>This is <em>deduplication</em>: while a request for a key is in flight, every other component asking for that key joins it. It is also why the header's appointment counter and the "My appointments" list can both call <code>useLichHen()</code> without doubling traffic. Chapter 5 made the appointment list a Zustand store; now it is server data, so it moved to the cache, and the store keeps only favourites (a client preference). Two copies of the same server data — one in a store, one in the cache — is how you get "this screen says 2, that one says 3".</p>
${SD.gopEn}

<h3>DevTools: look at the cache instead of guessing</h3>
${S6(14, 'DevTools của TanStack Query — ảnh chụp thật')}
${out(OUT.devtoolsInstall)}
<p><code>&lt;ReactQueryDevtools initialIsOpen={false} /&gt;</code> inside the provider (see <code>main.tsx</code> above) adds a floating button in development; it renders nothing in a production build (the package checks <code>process.env.NODE_ENV</code>). The screenshot was taken after booking one appointment: four entries, the number on the left is how many components are watching each, green is fresh, yellow is stale (<code>["lich-hen"]</code>, <code>staleTime</code> 0), and the <em>disabled</em> entry is the booking flow's time-slot query before a doctor was chosen — a disabled query still has a cache entry. When a screen shows something unexpected, open this first: is the key what you think it is? Is the data stale? Is it fetching?</p>

<h3>What it costs: the bundle, measured</h3>
${out(OUT.build)}
<p>The main bundle grew from 350.90 kB (109.80 kB gzipped) to 391.80 kB (121.97 kB gzipped): about 12 kB over the network for TanStack Query plus this chapter's new components. The DevTools add nothing to the production build. The separate 425 kB <code>browser-….js</code> is MSW, split off by the dynamic <code>import()</code> in <code>main.tsx</code>; a project with a real backend starts MSW only in development, and that file disappears from the build.</p>

<h3>Testing components that use TanStack Query</h3>
<p>Tests need a provider too — and each test needs its <em>own</em> client, or data cached by one test leaks into the next:</p>
${pre('tsx', SN.render)}
${pre('ts', SN.setup)}
<p>Three details are worth copying. <code>retry: false</code>: otherwise a test that expects an error waits for three retries (about 7 seconds, measured in Lesson 6.4). Render through the <code>wrapper</code> option rather than wrapping the element by hand: <code>rerender(&lt;X id="bs-2" /&gt;)</code> re-uses the wrapper, while a hand-wrapped first render leaves the second one without a provider — the "No QueryClient set" error again, which is exactly what happened in this chapter's first draft of the race test. And the test itself changes shape: data arrives asynchronously, so you <code>await screen.findBy…</code> instead of <code>getBy…</code> — Chapter 9 goes deeper.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202 keeps fetched data in Redux: a thunk dispatches <code>FETCH_DOCTORS_START</code>, calls axios, dispatches <code>SUCCESS</code> with the data or <code>FAILURE</code> with the error, and a reducer stores <code>{ loading, error, items }</code> — per resource. → At work the same thing is <code>useQuery({ queryKey, queryFn })</code>, and the store (Zustand or Redux Toolkit) keeps only client state. · <em>Why:</em> the Redux version is not wrong and you will maintain it in older projects (Redux Toolkit even ships RTK Query for exactly this reason). But every resource needs its own actions and reducer, there is no cache expiry, no deduplication, no background refresh, and nothing stops two screens from holding two different copies. TanStack Query replaces all of that per resource with one hook.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "What is the difference between <code>staleTime</code> and <code>gcTime</code>?"</p>
<p>Idea of an answer: <code>staleTime</code> decides when data stops being fresh — while fresh it is served from the cache with no request; once stale it is still shown, but refetched in the background on mount, window focus or reconnect. The default is 0. <code>gcTime</code> decides how long data with no component using it stays in memory before being deleted; default 5 minutes. So <code>staleTime</code> is about <em>requests</em>, <code>gcTime</code> is about <em>memory</em>. I set <code>staleTime</code> per kind of data, based on how often it really changes.</p></div>

<h3>When to use TanStack Query — and when NOT to</h3>
<ul>
<li><strong>Use it</strong> for anything that comes from a server: lists, details, anything shown in several places or revisited.</li>
<li><strong>Do not use it</strong> for client state: the current step, an open dialog, form input (that is <code>useState</code>, React Hook Form, Zustand or the URL).</li>
<li><strong>Do not copy</strong> query data into <code>useState</code> "to edit it" — read it where you need it; derive with <code>select</code> or plain code during render.</li>
<li><strong>In Next.js</strong> with Server Components, much of the reading happens on the server (Lesson 7.4 and the Next.js course); TanStack Query is still common for client-side interactivity.</li>
</ul>

<h3>Try it step by step</h3>
<ol>
<li>Wrap <code>&lt;App /&gt;</code> in <code>QueryClientProvider</code> with a client created at module level.</li>
<li>Write <code>api/khoa.ts</code>, <code>api/phong-kham.ts</code> and <code>hooks/useBacSi.ts</code>; in <code>KhuBacSi</code> replace the imported <code>danhSachBacSi</code> with <code>useBacSi()</code>. The existing tests go red with "No QueryClient set" — switch them to <code>renderVoiQuery</code> and <code>await findBy…</code>.</li>
<li>Install the DevTools, open the app, open the panel: one <code>["bac-si"]</code> entry.</li>
<li>Choose a doctor in the booking flow: a <code>["bac-si","bs-1","khung-gio","2026-10-01"]</code> entry appears. Switch to another tab of the browser and back after 30 seconds: watch it refetch.</li>
<li>Run the lesson's tests:</li>
</ol>
${out(DAU(OUT.cacheLog, -2))}

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the detail panel should load a doctor by id (<code>GET /api/bac-si/:id</code>) — but when the list is already cached, it should appear instantly, without a spinner.</p><ol>
<li>Write <code>useChiTietBacSi(id: string | null)</code> with key <code>khoa.chiTietBacSi(id)</code>, <code>enabled: id !== null</code>.</li>
<li>Add <code>placeholderData: () =&gt; queryClient.getQueryData&lt;BacSi[]&gt;(khoa.bacSi)?.find((b) =&gt; b.id === id)</code> (get <code>queryClient</code> from <code>useQueryClient()</code>).</li>
<li>Test A: with an empty cache, the hook starts <code>isPending</code> and ends with the doctor. Test B: after <code>queryClient.setQueryData(khoa.bacSi, danhSachBacSi)</code>, the <em>first</em> render already has the doctor (<code>isPlaceholderData</code> is <code>true</code>) and one request still goes out.</li>
</ol><p><strong>Done when:</strong> both tests are green, <code>npx tsc -b</code> is clean, and in DevTools you can see the <code>["bac-si","bs-2"]</code> entry next to <code>["bac-si"]</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">QueryClient / Provider</span><span class="v">the cache, created once and handed down through Context</span></div>
<div class="kv"><span class="k">queryKey</span><span class="v">array naming the data in the cache; also the dependency list; matched by prefix</span></div>
<div class="kv"><span class="k">queryFn</span><span class="v">returns a Promise of the data, throws on failure; receives <code>signal</code></span></div>
<div class="kv"><span class="k">staleTime (thời gian tươi)</span><span class="v">how long data is served with no request; default 0</span></div>
<div class="kv"><span class="k">gcTime (thời gian giữ)</span><span class="v">how long unused data stays in memory; default 5 minutes</span></div>
<div class="kv"><span class="k">status / fetchStatus</span><span class="v">"do I have data?" vs "is a request running?"</span></div>
<div class="kv"><span class="k">enabled</span><span class="v"><code>false</code> ⇒ the query does not run (pending, but not loading)</span></div>
<div class="kv"><span class="k">deduplication (gộp trùng)</span><span class="v">many components, same key, one request</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>One <code>QueryClient</code>, created outside components, provided at the root — and a fresh one per test with <code>retry: false</code>.</li>
<li><code>useQuery({ queryKey, queryFn })</code> replaces state + effect + flag; each key is its own cache entry, so old answers cannot overwrite new ones.</li>
<li>Put everything the query uses in the key, arranged from general to specific; invalidation matches by prefix.</li>
<li><code>staleTime</code> (default 0) controls requests, <code>gcTime</code> (default 5 min) controls memory; stale data is still shown while it refreshes.</li>
<li>Skeleton on <code>isPending</code>, small indicator on <code>isFetching</code>; a disabled query is pending but not loading.</li>
<li>Same key in three components = one request; DevTools shows the cache as it really is.</li>
</ul>

${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults', '📄', 'TanStack Query — Important Defaults', 'staleTime 0, refetch on mount/focus/reconnect, gcTime 5 minutes, 3 retries.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/query-keys', '📄', 'TanStack Query — Query Keys', 'Arrays, hashing, and why every variable belongs in the key.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/queries', '📄', 'TanStack Query — Queries', 'status, fetchStatus and the states a query can be in.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation', '📄', 'TanStack Query — Query Cancellation', 'The signal, and when a query is cancelled.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/testing', '📄', 'TanStack Query — Testing', 'A fresh QueryClient per test, retry: false.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>TanStack Query: một key, một hàm tải — và một cache lo phần còn lại</h2>
<p class="lead">Bài 6.1 kết thúc bằng năm thứ mà một hook fetch tự viết vẫn thiếu. TanStack Query chính là năm thứ đó, do người khác viết và test. Bạn đưa nó một <em>key</em> (dữ liệu nằm ở đâu trong cache) và một <em>hàm</em> (lấy nó bằng cách nào); nó trả lại dữ liệu, trạng thái đang tải và lỗi, và một cache dùng chung cho mọi component. Bài này chuyển danh sách bác sĩ và khung giờ của app phòng khám sang nó, và đo xem cache thật sự làm gì.</p>

<p>Phiên bản dùng ở đây: <code>@tanstack/react-query</code> 5.103.2 (có sẵn trong template dự án) và <code>@tanstack/react-query-devtools</code> 5.103.2. Mọi thứ mô tả là bản 5; nếu đọc bài hướng dẫn cũ thấy <code>useQuery('key', fn)</code> hay <code>cacheTime</code>, đó là bản 3/4 — ý tưởng giữ nguyên, tên đã đổi.</p>

<h3>Một QueryClient cho cả app</h3>
<p>Cache nằm trong một <code>QueryClient</code>. Bạn tạo MỘT cái, ở ngoài mọi component, rồi đưa xuống qua <code>QueryClientProvider</code> — đúng cơ chế Context của Bài 5.1, nên mọi component bên dưới đều với tới cache:</p>
${pre('tsx', SN.main)}
<p>Hai luật. <strong>Tạo client một lần, ngoài component.</strong> Viết bên trong <code>App</code> thì mỗi lần <code>App</code> render lại tạo một client mới — kèm một cache mới tinh, trống rỗng. <strong>Mọi component gọi <code>useQuery</code> phải nằm dưới provider</strong>, test cũng không ngoại lệ. Khi các test bộ lọc URL của Chương 5 render <code>&lt;KhuBacSi /&gt;</code> mà không có nó, cả ba hỏng ngay:</p>
${out(OUT.noClient)}
<p>Mặc định của client (luật thử lại, thông báo lỗi chung) đến từ <code>taoQueryClient()</code> trong <code>src/query-client.ts</code>, Bài 6.4 sẽ dựng nó.</p>

<h3>useQuery: một key và một hàm</h3>
${S6(9, 'useQuery: một key, một hàm tải')}
<p>Mỗi query trong app sống trong một hook nhỏ riêng, để component xin dữ liệu theo <em>ý nghĩa</em> (<code>useBacSi()</code>), không theo URL:</p>
${pre('ts', SN.useBacSi)}
${pre('ts', SN.api)}
<p>Đọc từng dòng:</p>
<ul>
<li><strong><code>queryKey</code></strong> — một mảng đặt tên cho mẩu dữ liệu này trong cache. Cùng key ở bất kỳ đâu trong app là cùng một mục cache.</li>
<li><strong><code>queryFn</code></strong> — hàm bất kỳ trả về Promise của dữ liệu, và <em>ném lỗi</em> khi hỏng (vì vậy <code>goiApi</code> của 6.1 ném lỗi với 404/500). TanStack gọi nó kèm một object ngữ cảnh; <code>({ signal })</code> bóc lấy <code>AbortSignal</code> do thư viện quản lý, để nó huỷ được request không còn ai cần.</li>
<li><strong><code>staleTime</code></strong> — kết quả được coi là tươi trong bao lâu (các mục sau).</li>
</ul>
<p>Thứ trả về là một object chứa dữ liệu và trạng thái của nó. <code>KhuBacSi</code> lấy thứ nó cần bằng một dòng destructuring — <code>const { data: danhSachBacSi, isPending, isError, error, refetch, isFetching } = useBacSi();</code> (<code>data: danhSachBacSi</code> là đổi tên <code>data</code> ngay lúc bóc) — rồi vẽ bốn trạng thái từ đó, Bài 6.4 nói kỹ. Đây là component hồ sơ y như ở 6.1, viết bằng <code>useQuery</code>:</p>
${pre('tsx', SN.bai2)}
<p>Không <code>useState</code>, không <code>useEffect</code>, không cờ bỏ qua. Và không cuộc đua: trong đúng bài test cố định của 6.1 (mở <code>bs-1</code> mất 900 ms, chuyển sang <code>bs-2</code> mất 100 ms), kết quả đúng — và log cho thấy chính thư viện đã huỷ request <code>bs-1</code> bị bỏ dở, vì hàm tải có chuyền <code>signal</code> đi:</p>
${out('[useQuery] t≈1200ms: "Hồ sơ: BS. Trần Thu Hà" · request: bs-1,bs-2 · bị huỷ: bs-1 · cache bs-1: undefined')}
<p>Vì sao <em>từ thiết kế</em> đã không có cuộc đua: <code>['bac-si', 'bs-1']</code> và <code>['bac-si', 'bs-2']</code> là hai mục cache khác nhau. Câu trả lời chậm của <code>bs-1</code> chỉ có thể ghi vào mục <code>bs-1</code>; component, lúc này theo dõi <code>bs-2</code>, không bao giờ đọc nó.</p>
<div class="callout"><p><strong>JS nhắc nhanh — <code>as const</code> và <code>60_000</code>.</strong> <code>['bac-si'] as const</code> bảo TypeScript "đúng mảng này, chỉ đọc", nên kiểu của key là <code>readonly ['bac-si']</code> chứ không phải <code>string[]</code> — gõ sai thành lỗi kiểu. <code>60_000</code> chính là <code>60000</code>; dấu gạch dưới chỉ để phân cách chữ số cho dễ đọc.</p></div>

<h3>Query key là địa chỉ trong cache — đi từ chung tới riêng</h3>
${S6(10, 'Query key là địa chỉ trong cache')}
<p>Key là mảng, và TanStack so chúng <em>theo tiền tố</em> khi bạn invalidate. App phòng khám xếp key như thư mục: mọi thứ về bác sĩ bắt đầu bằng <code>'bac-si'</code>, một bác sĩ thêm id, khung giờ của họ thêm <code>'khung-gio'</code> và ngày:</p>
${pre('ts', SN.khoa)}
${out(LOC(OUT.cacheLog, (d) => d.startsWith('$') || d.startsWith('[invalidate')))}
<p>Invalidate <code>['bac-si', 'bs-1']</code> chỉ làm mới khung giờ của bác sĩ đó; invalidate <code>['bac-si']</code> làm mới danh sách <em>và</em> khung giờ của mọi bác sĩ. Bài 6.3 dựa vào điều này: đặt lịch xong thì "mọi thứ dưới khung giờ của bác sĩ này đã cũ".</p>
${SD.khoaVi}
<p>Luật quan trọng nhất: <strong>mọi thứ hàm tải dùng phải nằm trong key.</strong> Key cũng chính là danh sách phụ thuộc — key đổi thì TanStack tải. Bỏ sót một biến là cache không phân biệt được các request:</p>
${out(OUT.keyThieu)}
<div class="pitfall co-tieu-de"><p><strong>Bẫy — bác sĩ nào cũng hiện khung giờ của bác sĩ đầu tiên.</strong> Một query khung giờ viết <code>queryKey: ['khung-gio']</code>, còn <code>bacSiId</code> chỉ dùng bên trong <code>queryFn</code>. Bác sĩ đầu tiên tải đúng. Chuyển sang bác sĩ khác: key không đổi, nên chẳng có gì để tải — test đo ở trên vẫn hiện khung giờ của <code>bs-1</code> khi đang xem <code>bs-2</code>, với đúng một request trong log. Cách sửa là key <code>['bac-si', bacSiId, 'khung-gio', ngay]</code>. Gom mọi key vào một file (<code>api/khoa.ts</code>, một "query key factory") giúp lỗi này lộ ra khi review.</p></div>

<h3>Tươi, cũ, không ai xem, bị xoá: staleTime và gcTime</h3>
${S6(11, 'Vòng đời một mục cache: tươi, cũ, xoá')}
<p>Mỗi mục cache đi qua một vòng đời, do hai con số điều khiển:</p>
<ul>
<li><strong><code>staleTime</code> — dữ liệu được coi là tươi trong bao lâu.</strong> Mặc định: <code>0</code>, tức là cũ ngay khi vừa về. Dữ liệu tươi được lấy từ cache, không có request nào. Dữ liệu cũ <em>vẫn hiện ngay</em>, nhưng TanStack còn tải lại nó ở nền khi một component mới gắn vào với key đó, khi cửa sổ được focus lại, hoặc khi có mạng lại (trang "important defaults" chính thức).</li>
<li><strong><code>gcTime</code> — dữ liệu không ai dùng được giữ bao lâu.</strong> Mặc định: 5 phút sau khi component cuối cùng dùng key đó tháo ra. Rồi bị dọn đi. (Bản 4 gọi là <code>cacheTime</code>.)</li>
</ul>
<p>Đo trong test của bài:</p>
${out(LOC(OUT.cacheLog, (d) => ['staleTime', 'focus', 'gcTime'].some((k) => d.includes(k))))}
<p>Đọc chậm. Với <code>staleTime</code> năm phút, gắn lại danh sách hiện sáu bác sĩ ngay lần render <em>đầu tiên</em> và không gửi request nào. Với mặc định <code>0</code>, nó cũng hiện sáu bác sĩ ngay — "(đang làm mới)" cho thấy một lần tải nền đang chạy — và gửi request thứ hai. Quay lại tab thì chỉ query đã cũ được tải lại. Với <code>gcTime</code> đặt 100 ms cho test, mục cache sống qua lần tháo và biến mất 150 ms sau.</p>
${SD.vongDoiVi}
<p>Vậy <code>staleTime</code> là quyết định sản phẩm cho từng loại dữ liệu. App phòng khám đặt:</p>
<table>
<thead><tr><th>Dữ liệu</th><th>staleTime</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Bác sĩ (<code>useBacSi</code>)</td><td>5 phút</td><td>một năm đổi vài lần; màn nào cũng tải lại là phí</td></tr>
<tr><td>Khung giờ (<code>useKhungGio</code>)</td><td>30 giây</td><td>bệnh nhân khác đặt; tin trong một lúc ngắn rồi làm mới</td></tr>
<tr><td>Lịch hẹn của tôi (<code>useLichHen</code>)</td><td>0 (mặc định)</td><td>nhỏ, và phải đúng sau mỗi lần thay đổi</td></tr>
</tbody>
</table>

<h3>status nói "có dữ liệu chưa?", fetchStatus nói "có đang gọi mạng không?"</h3>
${S6(12, 'status và fetchStatus')}
<p>Một query có hai trạng thái tách biệt, và nhầm chúng là gốc của đa số vòng xoay nhấp nháy:</p>
${out(OUT.statusLog)}
<ul>
<li><strong><code>status</code></strong>: <code>'pending'</code> (chưa có dữ liệu), <code>'error'</code>, <code>'success'</code>. Viết tắt: <code>isPending</code>, <code>isError</code>, <code>isSuccess</code>.</li>
<li><strong><code>fetchStatus</code></strong>: <code>'fetching'</code> (đang có request, tải lần đầu <em>hoặc</em> tải nền), <code>'paused'</code> (mất mạng), <code>'idle'</code>. Viết tắt: <code>isFetching</code>.</li>
<li><strong><code>isLoading</code></strong> = <code>isPending &amp;&amp; isFetching</code>: "chưa có gì, và đang đi lấy".</li>
</ul>
<p>Luật dùng hằng ngày: vẽ skeleton khi <code>isPending</code>; khi <code>isFetching</code> thì cùng lắm hiện một chỉ báo nhỏ. Dòng thứ tư của log là ca người ta hay quên — một query bị <em>tắt</em>:</p>
${pre('ts', SN.useKhungGio)}
<p>Trước khi chọn bác sĩ, <code>enabled: false</code> giữ query không chạy. Status của nó là <code>pending</code> mãi mãi (nó chưa có dữ liệu) nhưng không fetching, nên <code>isLoading</code> là <code>false</code>. Code hiện vòng xoay khi <code>isPending</code> cho một query bị tắt sẽ xoay tới tận thế — vì vậy luồng đặt lịch chỉ vẽ lưới giờ ở bước 2, khi đã có bác sĩ. <code>placeholderData: keepPreviousData</code> dùng khi đổi ngày: Bài 6.4 cho xem.</p>
<div class="callout"><p><strong>JS nhắc nhanh — dấu <code>!</code> sau <code>bacSiId</code>.</strong> <code>bacSiId!</code> là <em>non-null assertion</em> của TypeScript: "tin tôi đi, chỗ này không phải <code>null</code>". Nó an toàn chỉ vì <code>enabled</code> bảo đảm hàm không bao giờ chạy khi <code>bacSiId</code> là <code>null</code>. Dùng dè sẻn: khác <code>?.</code>, nó không kiểm gì lúc chạy.</p></div>

<h3>Ba component, một request</h3>
${S6(13, 'Gộp request trùng, staleTime, focus, gcTime — đo thật')}
<p>Sau bài này, ba chỗ trong app cần danh sách bác sĩ: khu bác sĩ, bước 1 của luồng đặt lịch và danh sách lịch hẹn (để lấy tên). Cả ba gọi <code>useBacSi()</code>. Đo thật:</p>
${out(LOC(OUT.cacheLog, (d) => d.startsWith('[gộp')))}
<p>Đó là <em>gộp request trùng</em> (deduplication): trong lúc request của một key đang bay, component nào xin cùng key đó thì nhập vào nó. Cũng vì vậy mà bộ đếm lịch hẹn trên Header và danh sách "Lịch hẹn của tôi" cùng gọi <code>useLichHen()</code> mà không gấp đôi lưu lượng. Chương 5 để danh sách lịch hẹn trong store Zustand; giờ nó là dữ liệu máy chủ nên chuyển sang cache, còn store chỉ giữ yêu thích (một lựa chọn phía client). Hai bản chép của cùng dữ liệu máy chủ — một trong store, một trong cache — chính là cách bạn nhận được "màn này nói 2, màn kia nói 3".</p>
${SD.gopVi}

<h3>DevTools: nhìn cache thay vì đoán</h3>
${S6(14, 'DevTools của TanStack Query — ảnh chụp thật')}
${out(OUT.devtoolsInstall)}
<p><code>&lt;ReactQueryDevtools initialIsOpen={false} /&gt;</code> đặt trong provider (xem <code>main.tsx</code> ở trên) thêm một nút nổi khi dev; bản build production nó không vẽ gì (gói tự kiểm <code>process.env.NODE_ENV</code>). Ảnh chụp sau khi đặt một lịch: bốn mục, số bên trái là số component đang theo dõi mục đó, xanh là tươi, vàng là cũ (<code>["lich-hen"]</code>, <code>staleTime</code> 0), còn mục <em>disabled</em> là query khung giờ của luồng đặt lịch lúc chưa chọn bác sĩ — query bị tắt vẫn có mục cache. Màn hình hiện thứ gì lạ thì mở cái này trước tiên: key có đúng như bạn nghĩ không? Dữ liệu có đang cũ không? Có đang tải không?</p>

<h3>Cái giá: kích thước bundle, đo thật</h3>
${out(OUT.build)}
<p>Bundle chính tăng từ 350.90 kB (nén gzip 109.80 kB) lên 391.80 kB (121.97 kB): khoảng 12 kB qua mạng cho TanStack Query cộng các component mới của chương. DevTools không thêm gì vào bản build production. File <code>browser-….js</code> 425 kB tách riêng là MSW, nhờ <code>import()</code> động trong <code>main.tsx</code>; dự án có backend thật chỉ bật MSW khi dev, và file đó biến khỏi bản build.</p>

<h3>Test component dùng TanStack Query</h3>
<p>Test cũng cần provider — và mỗi test cần client <em>riêng</em>, không thì dữ liệu test trước cache lại rò sang test sau:</p>
${pre('tsx', SN.render)}
${pre('ts', SN.setup)}
<p>Ba chi tiết đáng chép. <code>retry: false</code>: không thì test chờ lỗi phải đợi ba lần thử lại (khoảng 7 giây, đo ở Bài 6.4). Render qua tuỳ chọn <code>wrapper</code> thay vì tự bọc phần tử: <code>rerender(&lt;X id="bs-2" /&gt;)</code> dùng lại wrapper, còn lần render đầu tự bọc tay thì lần thứ hai không có provider — lại lỗi "No QueryClient set", đúng điều đã xảy ra với bản nháp đầu của test cuộc đua trong chương này. Và bản thân test đổi dáng: dữ liệu về bất đồng bộ nên bạn <code>await screen.findBy…</code> thay vì <code>getBy…</code> — Chương 9 đi sâu hơn.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>FER202 giữ dữ liệu tải về trong Redux: một thunk dispatch <code>FETCH_DOCTORS_START</code>, gọi axios, dispatch <code>SUCCESS</code> kèm dữ liệu hoặc <code>FAILURE</code> kèm lỗi, và reducer cất <code>{ loading, error, items }</code> — cho từng loại dữ liệu. → Đi làm, việc đó là <code>useQuery({ queryKey, queryFn })</code>, còn store (Zustand hay Redux Toolkit) chỉ giữ state client. · <em>Vì sao:</em> bản Redux không sai và bạn sẽ bảo trì nó ở dự án cũ (Redux Toolkit còn kèm RTK Query vì đúng lý do này). Nhưng mỗi loại dữ liệu cần action và reducer riêng, không có hết hạn cache, không gộp request, không làm mới nền, và chẳng gì ngăn hai màn hình giữ hai bản chép khác nhau. TanStack Query thay tất cả những thứ đó bằng một hook cho mỗi loại dữ liệu.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "<code>staleTime</code> và <code>gcTime</code> khác nhau thế nào?"</p>
<p>Ý trả lời: <code>staleTime</code> quyết định khi nào dữ liệu hết tươi — còn tươi thì lấy từ cache, không request; đã cũ thì vẫn hiện, nhưng được tải lại ở nền khi gắn component, khi focus cửa sổ hay khi có mạng lại. Mặc định 0. <code>gcTime</code> quyết định dữ liệu không còn component nào dùng được giữ trong bộ nhớ bao lâu trước khi xoá; mặc định 5 phút. Tức <code>staleTime</code> là chuyện <em>request</em>, <code>gcTime</code> là chuyện <em>bộ nhớ</em>. Tôi đặt <code>staleTime</code> theo từng loại dữ liệu, dựa vào việc nó thật sự đổi thường xuyên cỡ nào.</p></div>

<h3>Khi nào dùng TanStack Query — khi nào KHÔNG</h3>
<ul>
<li><strong>Dùng</strong> cho mọi thứ đến từ máy chủ: danh sách, chi tiết, thứ hiện ở nhiều chỗ hay người dùng quay lại xem.</li>
<li><strong>Không dùng</strong> cho state client: bước hiện tại, hộp thoại đang mở, chữ đang gõ trong form (đó là <code>useState</code>, React Hook Form, Zustand hay URL).</li>
<li><strong>Không chép</strong> dữ liệu query vào <code>useState</code> "để sửa" — đọc nó ở nơi cần; tính toán thêm bằng <code>select</code> hoặc code thường lúc render.</li>
<li><strong>Trong Next.js</strong> với Server Components, phần lớn việc đọc diễn ra trên máy chủ (Bài 7.4 và khoá Next.js); TanStack Query vẫn phổ biến cho phần tương tác phía client.</li>
</ul>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Bọc <code>&lt;App /&gt;</code> trong <code>QueryClientProvider</code> với client tạo ở cấp module.</li>
<li>Viết <code>api/khoa.ts</code>, <code>api/phong-kham.ts</code> và <code>hooks/useBacSi.ts</code>; trong <code>KhuBacSi</code> thay <code>danhSachBacSi</code> import tĩnh bằng <code>useBacSi()</code>. Test cũ đỏ với "No QueryClient set" — chuyển chúng sang <code>renderVoiQuery</code> và <code>await findBy…</code>.</li>
<li>Cài DevTools, mở app, mở bảng: một mục <code>["bac-si"]</code>.</li>
<li>Chọn một bác sĩ trong luồng đặt lịch: xuất hiện mục <code>["bac-si","bs-1","khung-gio","2026-10-01"]</code>. Chuyển sang tab khác của trình duyệt rồi quay lại sau 30 giây: xem nó tải lại.</li>
<li>Chạy test của bài:</li>
</ol>
${out(DAU(OUT.cacheLog, -2))}

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> khung chi tiết nên tải bác sĩ theo id (<code>GET /api/bac-si/:id</code>) — nhưng khi danh sách đã có trong cache thì phải hiện ngay, không vòng xoay.</p><ol>
<li>Viết <code>useChiTietBacSi(id: string | null)</code> với key <code>khoa.chiTietBacSi(id)</code>, <code>enabled: id !== null</code>.</li>
<li>Thêm <code>placeholderData: () =&gt; queryClient.getQueryData&lt;BacSi[]&gt;(khoa.bacSi)?.find((b) =&gt; b.id === id)</code> (lấy <code>queryClient</code> từ <code>useQueryClient()</code>).</li>
<li>Test A: cache trống thì hook bắt đầu <code>isPending</code> và kết thúc có bác sĩ. Test B: sau <code>queryClient.setQueryData(khoa.bacSi, danhSachBacSi)</code>, lần render <em>đầu tiên</em> đã có bác sĩ (<code>isPlaceholderData</code> là <code>true</code>) và vẫn có một request đi.</li>
</ol><p><strong>Đạt khi:</strong> hai test xanh, <code>npx tsc -b</code> sạch, và trong DevTools thấy mục <code>["bac-si","bs-2"]</code> cạnh <code>["bac-si"]</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">QueryClient / Provider</span><span class="v">cái cache, tạo một lần và đưa xuống qua Context</span></div>
<div class="kv"><span class="k">queryKey</span><span class="v">mảng đặt tên dữ liệu trong cache; cũng là danh sách phụ thuộc; so theo tiền tố</span></div>
<div class="kv"><span class="k">queryFn</span><span class="v">trả Promise của dữ liệu, ném lỗi khi hỏng; nhận <code>signal</code></span></div>
<div class="kv"><span class="k">staleTime (thời gian tươi)</span><span class="v">dữ liệu được dùng mà không request trong bao lâu; mặc định 0</span></div>
<div class="kv"><span class="k">gcTime (thời gian giữ)</span><span class="v">dữ liệu không ai dùng ở lại bộ nhớ bao lâu; mặc định 5 phút</span></div>
<div class="kv"><span class="k">status / fetchStatus</span><span class="v">"có dữ liệu chưa?" và "có request đang chạy không?"</span></div>
<div class="kv"><span class="k">enabled</span><span class="v"><code>false</code> ⇒ query không chạy (pending nhưng không loading)</span></div>
<div class="kv"><span class="k">deduplication (gộp trùng)</span><span class="v">nhiều component, cùng key, một request</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một <code>QueryClient</code>, tạo ngoài component, cấp ở gốc — và mỗi test một client mới với <code>retry: false</code>.</li>
<li><code>useQuery({ queryKey, queryFn })</code> thay cho state + effect + cờ; mỗi key là một mục cache riêng nên câu trả lời cũ không đè được câu mới.</li>
<li>Mọi thứ query dùng phải nằm trong key, xếp từ chung tới riêng; invalidate so theo tiền tố.</li>
<li><code>staleTime</code> (mặc định 0) điều khiển request, <code>gcTime</code> (mặc định 5 phút) điều khiển bộ nhớ; dữ liệu cũ vẫn hiện trong lúc làm mới.</li>
<li>Skeleton khi <code>isPending</code>, chỉ báo nhỏ khi <code>isFetching</code>; query bị tắt là pending nhưng không loading.</li>
<li>Cùng key ở ba component = một request; DevTools cho thấy cache đúng như nó đang là.</li>
</ul>

${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults', '📄', 'TanStack Query — Important Defaults', 'staleTime 0, làm mới khi gắn/focus/có mạng, gcTime 5 phút, thử lại 3 lần.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/query-keys', '📄', 'TanStack Query — Query Keys', 'Key là mảng, cách băm, và vì sao mọi biến phải nằm trong key.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/queries', '📄', 'TanStack Query — Queries', 'status, fetchStatus và các trạng thái của một query.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation', '📄', 'TanStack Query — Query Cancellation', 'signal, và khi nào một query bị huỷ.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/testing', '📄', 'TanStack Query — Testing', 'Mỗi test một QueryClient mới, retry: false.')}
</div>
`,
};


const L3 = {
  slug: 'rx-6-3-mutation',
  type: 'LESSON',
  isFreePreview: true,
  title: '6.3 — Mutations and optimistic updates: useMutation, invalidation, rollback|||6.3 — Mutation và cập nhật lạc quan: useMutation, invalidate, hoàn tác khi lỗi',
  description: 'Ghi lên máy chủ bằng useMutation: đặt lịch qua POST rồi invalidate khung giờ và lịch hẹn, vì sao phải làm mới ở onSettled (bắt được bằng một test đỏ thật), mutate và mutateAsync, mutation không gộp trùng, huỷ lịch lạc quan có hoàn tác, và màn hình nháy ngược đo được khi thiếu cancelQueries.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Mutations and optimistic updates: write, then tell the cache what went stale</h2>
<p class="lead">Reading is half of an app. The clinic's patients book appointments and cancel them — they <em>write</em> to the server. A write has its own states (sending, failed, done), it is never deduplicated, and after it succeeds some of your cached reads are wrong. This lesson turns booking into a mutation, makes the cache refresh the right things afterwards, then makes cancelling feel instant with an optimistic update — and measures what happens when one line is missing.</p>

<h3>Reading is a query, writing is a mutation</h3>
${S6(15, 'Luồng một mutation và invalidate')}
<p>The fake API from Lesson 6.1 accepts a booking and marks the slot as taken — or refuses with 409 if it already was:</p>
${pre('ts', SN.handlersPost)}
<p>On the client, a write is <code>useMutation</code>. Unlike <code>useQuery</code> it does not run by itself; it gives you a <code>mutate</code> function to call when the user acts:</p>
${pre('ts', SN.useDatLich)}
<ul>
<li><strong><code>mutationFn</code></strong> receives the <em>variables</em> you pass to <code>mutate(…)</code> and returns a Promise — here the POST.</li>
<li><strong><code>onSettled</code></strong> runs after success <em>and</em> after failure. It invalidates two keys: that doctor's time slots (one was just taken) and the appointment list (one was just added). Invalidation marks the entries stale and refetches the ones a component is currently showing.</li>
<li>It <strong>returns the Promise</strong> of <code>Promise.all([…])</code>, so the mutation stays <code>pending</code> until the fresh data has arrived. Without the <code>return</code> there is a brief moment where the mutation says "done" but the screen still shows the old slots.</li>
<li><strong><code>meta</code></strong> is free-form information for the global error handler of Lesson 6.4 (this mutation shows its own error, so no toast).</li>
</ul>
<div class="callout"><p><strong>JS quick reminder — <code>Promise.all</code>.</strong> <code>Promise.all([p1, p2])</code> starts nothing new; it returns one Promise that finishes when <em>all</em> the given Promises have finished (and fails as soon as one fails). Here the two invalidations run at the same time and the mutation waits for both.</p></div>
<p>Measured in the lesson's test — a component that shows the slots and books 14:00:</p>
${out(DAU(OUT.mutateLog, 0, 3))}
<p>The status went <code>idle → pending → success</code>, the POST sat between two GETs of the same slots, and after the second GET the 14:00 slot is <code>conTrong=false</code> in the cache — nobody had to update it by hand.</p>
${SD.mutationEn}
<p>The booking flow of Chapter 5 kept <code>dangGui</code>, <code>loiGui</code> and <code>daDat</code> in its reducer. Those three are exactly the state of one write to the server, and the mutation now owns them (<code>isPending</code>, <code>error</code>, <code>data</code>). Keeping both would be two sources of truth for the same thing, so the reducer shrinks to the user's choices:</p>
${pre('ts', SN.reducerDau)}
${pre('tsx', SN.luongDau)}
${pre('tsx', SN.luongBuoc4)}
<p><code>datLich.reset()</code> (called by "Đặt lịch khác" and by "← Quay lại") clears the previous attempt's result or error, so an old error message does not follow the user back to step 3.</p>

<h3>A 409 is information: refresh on onSettled, not only onSuccess</h3>
${S6(16, '409 nghĩa là lưới giờ đã cũ — onSettled')}
<p>The first version of <code>useDatLich</code> used <code>onSuccess</code> — the example in most tutorials. A test written from the user's point of view caught the problem: the patient picks 14:00, fills in the form; meanwhile someone else books 14:00; the patient confirms and gets 409 "Khung giờ này vừa có người đặt"; they go back to step 2 to choose another time… and 14:00 is still shown as free, because the slot grid was cached less than 30 seconds ago and nothing told the cache it was wrong.</p>
${out(OUT.bay409)}
<div class="pitfall co-tieu-de"><p><strong>Trap — refreshing only on success.</strong> A 409 Conflict (or a 404 for something that was deleted, or a 412) literally means "the data you based this request on is out of date". It is the strongest possible reason to refetch. <code>onSettled</code> runs on both outcomes; use it for invalidation unless you have a reason not to. The test that caught it is in the project (<code>LuongDatLich.test.tsx</code>, "người khác đặt mất khung giờ…").</p></div>

<h3>Mutations are not deduplicated — and mutate vs mutateAsync</h3>
${S6(17, 'Mutation không gộp trùng · mutate và mutateAsync')}
<p>Three components asking for the same query share one request. Two calls to <code>mutate</code> are two writes — the library cannot know whether you meant to book twice:</p>
${out(DAU(OUT.mutateLog, 3, 6))}
<p>The fake server refused the second POST with 409, which is what a real booking API must do. On the screen, the button is <code>disabled={datLich.isPending}</code> and says "Đang gửi…" (Lesson 3.3 measured why a disabled button alone does not stop two submits in the same tick; the form step still has its ref guard).</p>
<table>
<thead><tr><th></th><th><code>mutate(x)</code></th><th><code>await mutateAsync(x)</code></th></tr></thead>
<tbody>
<tr><td>Returns</td><td>nothing</td><td>a Promise of the result</td></tr>
<tr><td>On error</td><td>the error lands in <code>mutation.error</code>; nothing is thrown</td><td>the Promise <strong>rejects</strong> — you must <code>try/catch</code></td></tr>
<tr><td>Use when</td><td>a button starts it and the UI reads the mutation's state</td><td>you need to wait and then do something else (close a dialog, navigate)</td></tr>
</tbody>
</table>
<p>The log above shows both: <code>mutate</code> with an unknown slot did not throw, its message sat in <code>error.message</code>; <code>mutateAsync</code> with the same input threw. An un-caught <code>mutateAsync</code> is an unhandled Promise rejection — prefer <code>mutate</code> unless you need to await.</p>

<h3>Optimistic update: change the cache first, send after, roll back on failure</h3>
${S6(18, 'Cập nhật lạc quan: onMutate, onError, onSettled')}
<p>Cancelling an appointment almost always succeeds, and the user wants to see it cancelled <em>now</em>, not after a round trip. An <strong>optimistic update</strong> writes the expected result into the cache immediately, sends the request, and puts the old value back if the server says no. The appointment list moved from the Chapter 5 store to the server (<code>GET /api/lich-hen</code>), so it lives in the query cache:</p>
${pre('ts', SN.useLichHen)}
<p>The recipe has five steps, and each one is there for a reason:</p>
<ol>
<li><strong><code>cancelQueries</code></strong> — stop any refetch of <code>['lich-hen']</code> that is already in flight, so it cannot land on top of the optimistic value (the next section measures what happens without it).</li>
<li><strong>Snapshot</strong> — <code>getQueryData</code> keeps the current list.</li>
<li><strong><code>setQueryData</code></strong> — write the optimistic list (same list, that appointment now <code>'da-huy'</code>). Always a <em>new</em> array with <em>new</em> objects (<code>map</code> + spread) — the cache follows the same immutability rule as state (Lesson 2.3).</li>
<li><strong>Return the snapshot</strong> — whatever <code>onMutate</code> returns arrives as the third argument of <code>onError</code> and <code>onSettled</code>.</li>
<li><strong><code>onError</code> restores it, <code>onSettled</code> invalidates</strong> — after success or failure, fetch the truth from the server.</li>
</ol>
${SD.lacQuanEn}
${pre('tsx', SN.lichHenDs)}
${out(DAU(OUT.lacQuan, 0, 4))}
<p>"Đã huỷ" appeared 2 ms after the click, while the server still said <code>cho-xac-nhan</code>; the server caught up about 400 ms later. When the fake server returned 500 instead, the list went back to "Chờ xác nhận" and a toast said so (Lesson 6.4 builds the toast). The screenshot on slide 25 is the same scenario in Chromium, with <code>?loi=huy</code>.</p>
<div class="callout"><p><strong>JS quick reminder — <code>cu?.map(…)</code>.</strong> <code>setQueryData</code> hands you the current cached value, which may be <code>undefined</code> if nothing was cached yet. <code>cu?.map(…)</code> calls <code>map</code> only when <code>cu</code> exists, otherwise gives <code>undefined</code> — so the updater never crashes on an empty cache.</p></div>
<p>TanStack's documentation also describes a lighter form: do not touch the cache, just render <code>mutation.variables</code> as an extra, faded item while <code>isPending</code>. It needs no rollback and suits the case where the optimistic item appears in only one place. Here the header counter and the list both read <code>['lich-hen']</code>, so changing the cache updates both at once.</p>

<h3>The missing line: without cancelQueries the screen flickers back</h3>
${S6(19, 'Thiếu cancelQueries: màn hình nháy ngược')}
<p>To see why step 1 matters, the lesson has a copy of the hook without <code>cancelQueries</code>:</p>
${pre('ts', SN.bai3)}
<p>The test starts a refetch of the list (as happens when the user returns to the tab), and 20 ms later clicks "Huỷ". The fake GET reads the database <em>when it receives the request</em> — before the cancel — and answers 300 ms later, like a real server. Recording every value the cache holds:</p>
${out(LOC(OUT.lacQuan, (d) => d.includes('cancelQueries]')))}
<p>Without <code>cancelQueries</code>: "Đã huỷ" at 22 ms, then at 303 ms the old GET lands and overwrites it with "Chờ xác nhận", and only at 932 ms does the final invalidation bring "Đã huỷ" back. The user sees the cancel happen, un-happen, and happen again. With <code>cancelQueries</code> the in-flight GET is cancelled and the value never changes after 23 ms.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — the cancel that "undoes itself" for a moment.</strong> Bug report: "I cancel an appointment, it says cancelled, then it jumps back to pending, then it's cancelled again." It only happens when a refetch is in flight at the moment of the click — after returning to the tab, right after another mutation, on a slow network — so it is intermittent. The fix is the first line of <code>onMutate</code>: <code>await queryClient.cancelQueries({ queryKey })</code> for every key you are about to overwrite.</p></div>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202 projects often write with <code>axios.post</code> in a submit handler, then either reload the whole page, call the list fetch again by hand, or dispatch an <code>ADD_APPOINTMENT</code> action that pushes the new item into a Redux array. → At work: <code>useMutation</code> for the write, <code>invalidateQueries</code> for "what is stale now", and optimistic updates only where the result is predictable and reversible. · <em>Why:</em> pushing into a local array assumes you know exactly what the server stored (ids, computed fields, status) and silently drifts when you do not; reloading throws away everything. Invalidation asks the server for the truth and refreshes only what is on screen. You will still see the Redux pattern in older projects — it works if every writer remembers to update every copy.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "What is an optimistic update, and how do you roll it back?"</p>
<p>Idea of an answer: update the UI (in TanStack Query: the cache, via <code>setQueryData</code> in <code>onMutate</code>) as if the request had succeeded, before the server answers, so the app feels instant. In <code>onMutate</code> I first cancel in-flight queries for that key so they cannot overwrite it, take a snapshot, write the new value and return the snapshot; <code>onError</code> restores the snapshot; <code>onSettled</code> invalidates to resync with the server. I only do it for actions that almost always succeed and can be reversed — not for things like payments or bookings that the server often rejects.</p></div>

<h3>When to be optimistic — and when NOT to</h3>
<ul>
<li><strong>Optimistic:</strong> cancel, like/favourite, mark as read, reorder, toggle a setting — near-certain success, easy to reverse, and the user expects instant feedback.</li>
<li><strong>Wait for the server:</strong> booking (the server often says 409), payments, anything that creates an id the UI needs, anything whose failure would confuse the user after they had "seen" it succeed.</li>
<li><strong>Always:</strong> invalidate afterwards. Optimistic is a display trick; the server stays the source of truth.</li>
</ul>

<h3>Try it step by step</h3>
<ol>
<li>Add the POST and PATCH handlers; write <code>useDatLich</code> with <code>onSettled</code> and wire it into step 4 of the booking flow. Remove <code>dangGui</code>/<code>loiGui</code>/<code>daDat</code> from the reducer and let <code>tsc</code> show you every place that still uses them.</li>
<li>Book 14:00 with DevTools open: watch <code>["bac-si","bs-2","khung-gio",…]</code> turn to fetching and back, and 14:00 become "(kín)".</li>
<li>In the Console, book the same slot again with <code>fetch</code>: 409.</li>
<li>Write <code>useLichHen</code>/<code>useHuyLichHen</code>; move <code>lichHen</code> out of the Zustand store (bump its <code>version</code> and <code>migrate</code> the old saved data).</li>
<li>Open the app with <code>?loi=huy</code>, book, then cancel: "Đã huỷ", then back to "Chờ xác nhận" and a toast.</li>
<li>Run the lesson's tests:</li>
</ol>
${out(LOC(OUT.lacQuan, (d) => d.startsWith(' ✓')))}

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the receptionist confirms appointments: <code>PATCH /api/lich-hen/:id</code> with <code>{ trangThai: 'da-xac-nhan' }</code>. It should feel instant.</p><ol>
<li>Write <code>useXacNhanLichHen()</code> following the five-step recipe (cancel, snapshot, set, return, restore + invalidate).</li>
<li>In <code>LichHenCuaToi</code>, add a "Xác nhận" button next to each <code>cho-xac-nhan</code> appointment.</li>
<li>Test A: after clicking, "Đã xác nhận" is on screen <em>before</em> the (delayed 400 ms) server answer, and the server ends up <code>da-xac-nhan</code>. Test B: with <code>server.use(http.patch(…, () =&gt; HttpResponse.json({ loi: '…' }, { status: 500 })))</code>, the row goes back to "Chờ xác nhận".</li>
</ol><p><strong>Done when:</strong> both tests are green and <code>npx tsc -b</code> is clean. To watch the rollback with your own eyes in the browser, add a knob of your own to <code>dieu-khien.ts</code> — the existing <code>?loi=huy</code> only breaks cancelling.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">mutation</span><span class="v">a write to the server (POST/PATCH/DELETE); runs when you call <code>mutate</code></span></div>
<div class="kv"><span class="k">variables</span><span class="v">what you pass to <code>mutate(…)</code>; the argument of <code>mutationFn</code> and every callback</span></div>
<div class="kv"><span class="k">invalidateQueries</span><span class="v">mark matching queries stale and refetch the ones on screen</span></div>
<div class="kv"><span class="k">onSettled</span><span class="v">runs after success or error — the place for invalidation</span></div>
<div class="kv"><span class="k">optimistic update (cập nhật lạc quan)</span><span class="v">show the expected result before the server confirms</span></div>
<div class="kv"><span class="k">rollback (hoàn tác)</span><span class="v">restore the snapshot taken in <code>onMutate</code> when the write fails</span></div>
<div class="kv"><span class="k">cancelQueries</span><span class="v">stop in-flight refetches so they cannot overwrite an optimistic value</span></div>
<div class="kv"><span class="k">409 Conflict</span><span class="v">"your data is out of date" — e.g. the slot was just taken</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>useMutation</code> for writes; the mutation owns "sending / failed / done", so the reducer keeps only the user's choices.</li>
<li>After a write, <code>invalidateQueries</code> the keys that changed — in <code>onSettled</code>, because a 409 means the screen is stale too.</li>
<li>Return the invalidation Promise so the mutation stays pending until fresh data arrives.</li>
<li>Mutations are never deduplicated: disable the button while pending, and let the server refuse duplicates.</li>
<li>Optimistic recipe: cancel → snapshot → set → return snapshot → restore on error → invalidate on settle.</li>
<li>Without <code>cancelQueries</code> an in-flight GET overwrote the optimistic value at 303 ms — measured flicker.</li>
</ul>

${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/mutations', '📄', 'TanStack Query — Mutations', 'mutate, mutateAsync, callbacks and their order.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates', '📄', 'TanStack Query — Optimistic Updates', 'Via the UI (variables) and via the cache (onMutate + rollback).')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation', '📄', 'TanStack Query — Query Invalidation', 'Prefix matching and which queries get refetched.')}
${LINK('https://react.dev/learn/updating-arrays-in-state', '📄', 'react.dev — Updating Arrays in State', 'map + spread: the same immutability rule applies to cached data.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Mutation và cập nhật lạc quan: ghi, rồi báo cache chỗ nào đã cũ</h2>
<p class="lead">Đọc chỉ là một nửa của app. Bệnh nhân của phòng khám đặt lịch và huỷ lịch — họ <em>ghi</em> lên máy chủ. Một lần ghi có trạng thái riêng (đang gửi, hỏng, xong), không bao giờ được gộp trùng, và sau khi nó thành công thì vài thứ bạn đang cache đã sai. Bài này biến việc đặt lịch thành một mutation, bắt cache làm mới đúng những thứ cần làm mới sau đó, rồi làm việc huỷ lịch có cảm giác tức thì bằng cập nhật lạc quan — và đo xem chuyện gì xảy ra khi thiếu một dòng.</p>

<h3>Đọc là query, ghi là mutation</h3>
${S6(15, 'Luồng một mutation và invalidate')}
<p>API giả của Bài 6.1 nhận một yêu cầu đặt lịch và đánh dấu khung giờ đã kín — hoặc từ chối bằng 409 nếu nó đã kín từ trước:</p>
${pre('ts', SN.handlersPost)}
<p>Phía client, một lần ghi là <code>useMutation</code>. Khác <code>useQuery</code>, nó không tự chạy; nó đưa bạn hàm <code>mutate</code> để gọi khi người dùng hành động:</p>
${pre('ts', SN.useDatLich)}
<ul>
<li><strong><code>mutationFn</code></strong> nhận <em>variables</em> (biến) bạn truyền vào <code>mutate(…)</code> và trả về một Promise — ở đây là POST.</li>
<li><strong><code>onSettled</code></strong> chạy sau khi thành công <em>và</em> sau khi hỏng. Nó invalidate hai key: khung giờ của bác sĩ đó (một khung vừa kín) và danh sách lịch hẹn (vừa thêm một). Invalidate đánh dấu các mục là cũ và tải lại những mục đang có component hiện.</li>
<li>Nó <strong>trả về Promise</strong> của <code>Promise.all([…])</code>, nên mutation còn <code>pending</code> tới khi dữ liệu mới về. Thiếu <code>return</code> là có một khoảnh khắc mutation báo "xong" mà màn hình vẫn hiện khung giờ cũ.</li>
<li><strong><code>meta</code></strong> là thông tin tự do cho bộ xử lý lỗi chung của Bài 6.4 (mutation này tự hiện lỗi của nó, nên không cần thông báo nổi).</li>
</ul>
<div class="callout"><p><strong>JS nhắc nhanh — <code>Promise.all</code>.</strong> <code>Promise.all([p1, p2])</code> không khởi động gì mới; nó trả về MỘT Promise xong khi <em>mọi</em> Promise được đưa vào đều xong (và hỏng ngay khi một cái hỏng). Ở đây hai lần invalidate chạy cùng lúc và mutation đợi cả hai.</p></div>
<p>Đo trong test của bài — một component hiện khung giờ và đặt 14:00:</p>
${out(DAU(OUT.mutateLog, 0, 3))}
<p>Status đi <code>idle → pending → success</code>, POST nằm giữa hai lần GET cùng khung giờ, và sau lần GET thứ hai khung 14:00 trong cache là <code>conTrong=false</code> — không ai phải tự tay sửa nó.</p>
${SD.mutationVi}
<p>Luồng đặt lịch của Chương 5 giữ <code>dangGui</code>, <code>loiGui</code> và <code>daDat</code> trong reducer. Ba thứ đó chính là trạng thái của một lần ghi lên máy chủ, và giờ mutation giữ chúng (<code>isPending</code>, <code>error</code>, <code>data</code>). Giữ cả hai là hai nguồn sự thật cho cùng một thứ, nên reducer co lại chỉ còn lựa chọn của người dùng:</p>
${pre('ts', SN.reducerDau)}
${pre('tsx', SN.luongDau)}
${pre('tsx', SN.luongBuoc4)}
<p><code>datLich.reset()</code> (nút "Đặt lịch khác" và "← Quay lại" gọi nó) xoá kết quả hay lỗi của lần thử trước, để một câu báo lỗi cũ không theo người dùng quay về bước 3.</p>

<h3>409 là thông tin: làm mới ở onSettled, không chỉ onSuccess</h3>
${S6(16, '409 nghĩa là lưới giờ đã cũ — onSettled')}
<p>Phiên bản đầu của <code>useDatLich</code> dùng <code>onSuccess</code> — ví dụ trong đa số bài hướng dẫn. Một test viết theo góc nhìn người dùng đã bắt được vấn đề: bệnh nhân chọn 14:00, điền form; trong lúc đó người khác đặt mất 14:00; bệnh nhân bấm xác nhận và nhận 409 "Khung giờ này vừa có người đặt"; họ quay lại bước 2 để chọn giờ khác… và 14:00 vẫn hiện là còn trống, vì lưới giờ mới được cache chưa tới 30 giây và chẳng có gì báo cho cache biết nó sai.</p>
${out(OUT.bay409)}
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chỉ làm mới khi thành công.</strong> Lỗi 409 Conflict (hay 404 cho thứ đã bị xoá, hay 412) nghĩa đen là "dữ liệu bạn dựa vào để gửi request này đã cũ". Đó là lý do mạnh nhất để tải lại. <code>onSettled</code> chạy ở cả hai kết cục; dùng nó cho invalidate trừ khi có lý do khác. Test bắt được lỗi này nằm trong dự án (<code>LuongDatLich.test.tsx</code>, "người khác đặt mất khung giờ…").</p></div>

<h3>Mutation không gộp trùng — và mutate khác mutateAsync</h3>
${S6(17, 'Mutation không gộp trùng · mutate và mutateAsync')}
<p>Ba component xin cùng một query thì dùng chung một request. Hai lần gọi <code>mutate</code> là hai lần ghi — thư viện không thể biết bạn có định đặt hai lần hay không:</p>
${out(DAU(OUT.mutateLog, 3, 6))}
<p>Máy chủ giả từ chối POST thứ hai bằng 409, đúng điều một API đặt lịch thật phải làm. Trên màn hình, nút có <code>disabled={datLich.isPending}</code> và chữ "Đang gửi…" (Bài 3.3 đã đo vì sao chỉ khoá nút thì chưa chặn được hai lần gửi trong cùng một nhịp; bước form vẫn giữ chốt ref của nó).</p>
<table>
<thead><tr><th></th><th><code>mutate(x)</code></th><th><code>await mutateAsync(x)</code></th></tr></thead>
<tbody>
<tr><td>Trả về</td><td>không gì</td><td>Promise của kết quả</td></tr>
<tr><td>Khi lỗi</td><td>lỗi nằm trong <code>mutation.error</code>; không ném gì</td><td>Promise <strong>reject</strong> — phải <code>try/catch</code></td></tr>
<tr><td>Dùng khi</td><td>một nút khởi động nó và giao diện đọc trạng thái mutation</td><td>cần đợi xong rồi làm việc khác (đóng hộp thoại, chuyển trang)</td></tr>
</tbody>
</table>
<p>Log ở trên cho thấy cả hai: <code>mutate</code> với một khung giờ không tồn tại không ném gì, câu báo nằm trong <code>error.message</code>; <code>mutateAsync</code> với cùng đầu vào thì ném. Một <code>mutateAsync</code> không ai bắt là một Promise bị reject bỏ rơi — cứ dùng <code>mutate</code> trừ khi cần đợi.</p>

<h3>Cập nhật lạc quan: sửa cache trước, gửi sau, hỏng thì hoàn tác</h3>
${S6(18, 'Cập nhật lạc quan: onMutate, onError, onSettled')}
<p>Huỷ lịch hẹn gần như luôn thành công, và người dùng muốn thấy nó huỷ <em>ngay</em>, không phải sau một vòng đi về. <strong>Cập nhật lạc quan</strong> (optimistic update) ghi kết quả mong đợi vào cache ngay lập tức, gửi request, và đặt lại giá trị cũ nếu máy chủ nói không. Danh sách lịch hẹn đã chuyển từ store của Chương 5 lên máy chủ (<code>GET /api/lich-hen</code>), nên nó sống trong cache query:</p>
${pre('ts', SN.useLichHen)}
<p>Công thức có năm bước, bước nào cũng có lý do:</p>
<ol>
<li><strong><code>cancelQueries</code></strong> — dừng mọi lần tải lại <code>['lich-hen']</code> đang bay, để nó không đáp xuống đè lên giá trị lạc quan (mục sau đo chuyện gì xảy ra khi thiếu nó).</li>
<li><strong>Chụp lại</strong> — <code>getQueryData</code> giữ danh sách hiện tại.</li>
<li><strong><code>setQueryData</code></strong> — ghi danh sách lạc quan (vẫn danh sách đó, lịch hẹn kia giờ là <code>'da-huy'</code>). Luôn là mảng <em>mới</em> với object <em>mới</em> (<code>map</code> + spread) — cache theo đúng luật bất biến như state (Bài 2.3).</li>
<li><strong>Trả bản chụp về</strong> — thứ <code>onMutate</code> trả về sẽ tới làm tham số thứ ba của <code>onError</code> và <code>onSettled</code>.</li>
<li><strong><code>onError</code> trả lại, <code>onSettled</code> invalidate</strong> — dù được hay hỏng, lấy sự thật từ máy chủ về.</li>
</ol>
${SD.lacQuanVi}
${pre('tsx', SN.lichHenDs)}
${out(DAU(OUT.lacQuan, 0, 4))}
<p>"Đã huỷ" hiện 2 ms sau cú bấm, trong khi máy chủ vẫn ghi <code>cho-xac-nhan</code>; khoảng 400 ms sau máy chủ mới theo kịp. Khi máy chủ giả trả 500, danh sách quay về "Chờ xác nhận" và một thông báo nổi báo điều đó (Bài 6.4 dựng thông báo). Ảnh chụp ở slide 25 là đúng kịch bản đó trong Chromium, với <code>?loi=huy</code>.</p>
<div class="callout"><p><strong>JS nhắc nhanh — <code>cu?.map(…)</code>.</strong> <code>setQueryData</code> đưa bạn giá trị đang cache, có thể là <code>undefined</code> nếu chưa có gì. <code>cu?.map(…)</code> chỉ gọi <code>map</code> khi <code>cu</code> tồn tại, không thì cho <code>undefined</code> — hàm cập nhật không bao giờ vỡ khi cache trống.</p></div>
<p>Tài liệu TanStack còn tả một dạng nhẹ hơn: không đụng cache, chỉ vẽ <code>mutation.variables</code> thành một mục thêm, mờ đi, trong lúc <code>isPending</code>. Không cần hoàn tác, hợp với khi mục lạc quan chỉ hiện ở một chỗ. Ở đây bộ đếm trên Header và danh sách cùng đọc <code>['lich-hen']</code>, nên sửa cache là cập nhật cả hai một lúc.</p>

<h3>Dòng bị thiếu: không có cancelQueries thì màn hình nháy ngược</h3>
${S6(19, 'Thiếu cancelQueries: màn hình nháy ngược')}
<p>Để thấy vì sao cần bước 1, bài có một bản chép của hook nhưng thiếu <code>cancelQueries</code>:</p>
${pre('ts', SN.bai3)}
<p>Test khởi động một lần tải lại danh sách (như khi người dùng quay lại tab), và 20 ms sau bấm "Huỷ". GET giả đọc cơ sở dữ liệu <em>lúc nhận request</em> — trước khi huỷ — và trả lời sau 300 ms, như máy chủ thật. Ghi lại mọi giá trị cache đã giữ:</p>
${out(LOC(OUT.lacQuan, (d) => d.includes('cancelQueries]')))}
<p>Thiếu <code>cancelQueries</code>: "Đã huỷ" lúc 22 ms, rồi tới 303 ms GET cũ đáp xuống đè thành "Chờ xác nhận", và phải tới 932 ms lần invalidate cuối mới mang "Đã huỷ" trở lại. Người dùng thấy việc huỷ xảy ra, bị rút lại, rồi xảy ra lần nữa. Có <code>cancelQueries</code> thì GET đang bay bị huỷ và giá trị không đổi nữa kể từ 23 ms.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — lần huỷ "tự rút lại" trong chốc lát.</strong> Báo lỗi: "Tôi huỷ một lịch hẹn, nó báo đã huỷ, rồi nhảy về chờ xác nhận, rồi lại đã huỷ." Chỉ xảy ra khi đúng lúc bấm có một lần tải lại đang bay — vừa quay lại tab, ngay sau một mutation khác, mạng chậm — nên lúc có lúc không. Cách sửa là dòng đầu của <code>onMutate</code>: <code>await queryClient.cancelQueries({ queryKey })</code> cho mọi key bạn sắp ghi đè.</p></div>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Đồ án FER202 hay ghi bằng <code>axios.post</code> trong hàm submit, rồi hoặc tải lại cả trang, hoặc tự tay gọi lại hàm tải danh sách, hoặc dispatch action <code>ADD_APPOINTMENT</code> đẩy mục mới vào một mảng Redux. → Đi làm: <code>useMutation</code> cho việc ghi, <code>invalidateQueries</code> cho "giờ cái gì đã cũ", và cập nhật lạc quan chỉ ở nơi kết quả đoán trước được và đảo ngược được. · <em>Vì sao:</em> đẩy vào mảng cục bộ là giả định bạn biết chính xác máy chủ đã lưu gì (id, trường tính toán, trạng thái) và âm thầm lệch khi bạn không biết; tải lại trang thì vứt hết mọi thứ. Invalidate hỏi máy chủ sự thật và chỉ làm mới thứ đang trên màn hình. Bạn vẫn sẽ gặp kiểu Redux trong dự án cũ — nó chạy nếu mọi chỗ ghi đều nhớ cập nhật mọi bản chép.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Optimistic update là gì, hoàn tác nó thế nào?"</p>
<p>Ý trả lời: cập nhật giao diện (với TanStack Query: cache, bằng <code>setQueryData</code> trong <code>onMutate</code>) như thể request đã thành công, trước khi máy chủ trả lời, để app có cảm giác tức thì. Trong <code>onMutate</code> tôi huỷ các query đang bay của key đó trước để chúng không ghi đè, chụp lại giá trị cũ, ghi giá trị mới và trả bản chụp về; <code>onError</code> đặt lại bản chụp; <code>onSettled</code> invalidate để đồng bộ lại với máy chủ. Tôi chỉ làm vậy với thao tác gần như luôn thành công và đảo ngược được — không làm với thanh toán hay đặt lịch, thứ máy chủ hay từ chối.</p></div>

<h3>Khi nào lạc quan — khi nào KHÔNG</h3>
<ul>
<li><strong>Lạc quan:</strong> huỷ, thích/yêu thích, đánh dấu đã đọc, sắp xếp lại, bật/tắt một cài đặt — gần như chắc chắn thành công, dễ đảo ngược, và người dùng chờ phản hồi tức thì.</li>
<li><strong>Đợi máy chủ:</strong> đặt lịch (máy chủ hay trả 409), thanh toán, thứ tạo ra id mà giao diện cần, thứ mà nếu hỏng sẽ làm người dùng bối rối sau khi đã "thấy" nó thành công.</li>
<li><strong>Luôn luôn:</strong> invalidate sau đó. Lạc quan chỉ là mẹo hiển thị; máy chủ vẫn là nguồn sự thật.</li>
</ul>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Thêm handler POST và PATCH; viết <code>useDatLich</code> với <code>onSettled</code> và nối vào bước 4 của luồng đặt lịch. Bỏ <code>dangGui</code>/<code>loiGui</code>/<code>daDat</code> khỏi reducer và để <code>tsc</code> chỉ cho bạn mọi chỗ còn dùng chúng.</li>
<li>Đặt 14:00 khi đang mở DevTools: xem <code>["bac-si","bs-2","khung-gio",…]</code> chuyển sang fetching rồi trở lại, và 14:00 thành "(kín)".</li>
<li>Trong Console, đặt lại đúng khung đó bằng <code>fetch</code>: 409.</li>
<li>Viết <code>useLichHen</code>/<code>useHuyLichHen</code>; đưa <code>lichHen</code> ra khỏi store Zustand (tăng <code>version</code> và <code>migrate</code> bản lưu cũ).</li>
<li>Mở app với <code>?loi=huy</code>, đặt lịch, rồi huỷ: "Đã huỷ", rồi về "Chờ xác nhận" kèm một thông báo nổi.</li>
<li>Chạy test của bài:</li>
</ol>
${out(LOC(OUT.lacQuan, (d) => d.startsWith(' ✓')))}

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> lễ tân xác nhận lịch hẹn: <code>PATCH /api/lich-hen/:id</code> với <code>{ trangThai: 'da-xac-nhan' }</code>. Phải có cảm giác tức thì.</p><ol>
<li>Viết <code>useXacNhanLichHen()</code> theo công thức năm bước (huỷ, chụp, ghi, trả về, đặt lại + invalidate).</li>
<li>Trong <code>LichHenCuaToi</code>, thêm nút "Xác nhận" cạnh mỗi lịch <code>cho-xac-nhan</code>.</li>
<li>Test A: bấm xong, "Đã xác nhận" hiện <em>trước</em> câu trả lời của máy chủ (chậm 400 ms), và máy chủ cuối cùng là <code>da-xac-nhan</code>. Test B: với <code>server.use(http.patch(…, () =&gt; HttpResponse.json({ loi: '…' }, { status: 500 })))</code>, dòng đó quay về "Chờ xác nhận".</li>
</ol><p><strong>Đạt khi:</strong> hai test xanh, <code>npx tsc -b</code> sạch. Muốn tận mắt thấy hoàn tác trên trình duyệt thì thêm một núm riêng vào <code>dieu-khien.ts</code> — núm <code>?loi=huy</code> có sẵn chỉ làm hỏng việc huỷ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">mutation</span><span class="v">một lần ghi lên máy chủ (POST/PATCH/DELETE); chạy khi bạn gọi <code>mutate</code></span></div>
<div class="kv"><span class="k">variables (biến)</span><span class="v">thứ truyền vào <code>mutate(…)</code>; tham số của <code>mutationFn</code> và mọi callback</span></div>
<div class="kv"><span class="k">invalidateQueries</span><span class="v">đánh dấu các query khớp là cũ và tải lại những cái đang trên màn hình</span></div>
<div class="kv"><span class="k">onSettled</span><span class="v">chạy sau thành công hay lỗi — chỗ để invalidate</span></div>
<div class="kv"><span class="k">optimistic update (cập nhật lạc quan)</span><span class="v">hiện kết quả mong đợi trước khi máy chủ xác nhận</span></div>
<div class="kv"><span class="k">rollback (hoàn tác)</span><span class="v">đặt lại bản chụp lấy trong <code>onMutate</code> khi ghi hỏng</span></div>
<div class="kv"><span class="k">cancelQueries</span><span class="v">dừng các lần tải lại đang bay để chúng không đè giá trị lạc quan</span></div>
<div class="kv"><span class="k">409 Conflict</span><span class="v">"dữ liệu của bạn đã cũ" — ví dụ khung giờ vừa bị đặt mất</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>useMutation</code> cho việc ghi; mutation giữ "đang gửi / hỏng / xong", nên reducer chỉ còn giữ lựa chọn của người dùng.</li>
<li>Ghi xong thì <code>invalidateQueries</code> các key đã đổi — trong <code>onSettled</code>, vì 409 nghĩa là màn hình cũng đã cũ.</li>
<li>Trả về Promise của invalidate để mutation còn pending tới khi dữ liệu mới về.</li>
<li>Mutation không bao giờ gộp trùng: khoá nút khi đang gửi, và để máy chủ từ chối bản trùng.</li>
<li>Công thức lạc quan: huỷ → chụp → ghi → trả bản chụp → hỏng thì đặt lại → xong thì invalidate.</li>
<li>Thiếu <code>cancelQueries</code>, một GET đang bay đã đè giá trị lạc quan lúc 303 ms — màn hình nháy ngược đo được.</li>
</ul>

${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/mutations', '📄', 'TanStack Query — Mutations', 'mutate, mutateAsync, các callback và thứ tự của chúng.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates', '📄', 'TanStack Query — Optimistic Updates', 'Qua giao diện (variables) và qua cache (onMutate + hoàn tác).')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation', '📄', 'TanStack Query — Query Invalidation', 'Khớp theo tiền tố và query nào được tải lại.')}
${LINK('https://react.dev/learn/updating-arrays-in-state', '📄', 'react.dev — Updating Arrays in State', 'map + spread: luật bất biến áp dụng cả cho dữ liệu trong cache.')}
</div>
`,
};


const L4 = {
  slug: 'rx-6-4-loi-api',
  type: 'LESSON',
  isFreePreview: true,
  title: '6.4 — Loading, error and empty states: skeletons, retries, error boundaries, toasts|||6.4 — Đang tải, lỗi và rỗng: skeleton, thử lại, ranh giới lỗi, thông báo nổi',
  description: 'Bốn trạng thái của mọi khu dữ liệu và thứ tự kiểm đúng; skeleton đúng hình; lỗi khác rỗng; thử lại mặc định đo được (1 s, 2 s, 4 s — hộp lỗi sau ~7 giây) và luật không thử lại lỗi 4xx; làm mới lỗi thì giữ dữ liệu; ranh giới lỗi bằng class; thông báo nổi cho mutation — và mục tự gõ tiếp dự án.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Loading, error and empty states: honest screens for data that is not there yet</h2>
<p class="lead">With data coming over a network, every area of the screen can be in four situations: nothing yet, broken, empty, or fine — and sometimes "fine, but the refresh just broke". Apps that feel solid handle all of them on purpose. This lesson gives the clinic app a skeleton for loading, separate messages for errors and emptiness, a retry rule, a way to keep showing good data when a refresh fails, error boundaries for bugs, and a toast for failed writes — each measured or photographed in a real browser.</p>

<h3>Four states, checked in the right order</h3>
<p><code>KhuBacSi</code> decides what to draw with one chain of <code>if</code>s. The order is the whole point:</p>
${pre('tsx', SN.khuBacSiTrangThai)}
<table>
<thead><tr><th>Order</th><th>Condition</th><th>Draw</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>isPending</code></td><td>skeleton — nothing to show yet</td></tr>
<tr><td>2</td><td><code>!danhSachBacSi</code> (so: failed, with no data at all)</td><td>error box with "Thử lại"</td></tr>
<tr><td>3</td><td><code>length === 0</code></td><td>an "empty" sentence — not an error</td></tr>
<tr><td>4</td><td>otherwise</td><td>the list, plus a yellow strip if <code>isError</code> (a refresh failed)</td></tr>
</tbody>
</table>
<p>Step 2 asks "is there <em>no data</em>?", not "is there an error?". The difference matters as soon as a background refresh fails — section 5 below measures it. <code>error!</code> is the non-null assertion from Lesson 6.2: once the query is not pending and has no data, TanStack guarantees an error exists.</p>
${SD.thuTuEn}

<h3>Loading: a skeleton in the right shape</h3>
${S6(20, 'Skeleton đúng hình — ảnh chụp thật')}
${pre('tsx', SN.khungXuong)}
<ul>
<li><strong>Same size as the real cards</strong>, so when the data arrives nothing jumps (no layout shift — a Core Web Vitals metric).</li>
<li><strong>Only for <code>isPending</code>.</strong> A background refresh keeps the old data on screen; flashing a skeleton over data the user is reading is worse than no indicator at all.</li>
<li><strong>Accessible:</strong> <code>aria-busy="true"</code> on the region and a visually hidden sentence, so a screen reader says "loading" instead of reading six empty boxes. The shimmer animation is switched off under <code>prefers-reduced-motion</code>.</li>
<li><strong>Everything that does not depend on the data draws immediately</strong> — the chips, the search box and the favourites panel are there in the screenshot.</li>
</ul>
<p>The screenshot was taken with <code>?tre=vo-han</code>: the fake API never answers, so the skeleton stays on screen as long as you like.</p>

<h3>Error and empty are two different things</h3>
${S6(21, 'Lỗi và rỗng — hai ảnh chụp thật')}
${pre('tsx', SN.loiTaiDuLieu)}
<p>An error message has three parts: <strong>what</strong> failed ("Không tải được danh sách bác sĩ"), <strong>why</strong> in the user's words (the server's message, or "check your network" when <code>fetch</code> itself threw — which is why <code>LoiApi</code> exists), and <strong>what to do</strong> (a "Thử lại" button that calls <code>refetch()</code> and disables itself while it runs). <code>role="alert"</code> makes screen readers announce it at once.</p>
<p>An empty list is not a failure: the request worked and the answer was <code>[]</code>. It gets a calm sentence and no red. Mixing the two — showing "No doctors found" when the request actually failed — sends users away from a clinic that has six doctors.</p>
<p>How long did the error box take to appear in Chromium, with the doctor endpoint returning 500?</p>
${out(OUT.loiChromium)}
<p>Seven and a half seconds. The three 500s in the console are three of the four attempts — which leads to retries.</p>

<h3>Retries: three by default, 1 s → 2 s → 4 s</h3>
${S6(22, 'Thử lại 3 lần: 1 s, 2 s, 4 s')}
<p>TanStack Query retries a failed query three times, waiting 1 s, 2 s, then 4 s (the delay doubles, capped at 30 s). Measured with a plain <code>new QueryClient()</code> and an endpoint that always answers 500:</p>
${out(OUT.retryLog)}
<p>Four calls at 31, 1042, 3047 and 7050 ms; <code>failureCount</code> climbed from 0 to 4; only then did the query become <code>error</code>. For a network blip that is exactly right — the user never sees an error. For a 404 it is seven seconds of pointless waiting: the doctor does not exist and will not exist on the fourth try. The project's client therefore retries only what can recover:</p>
${pre('ts', SN.queryClient)}
<p>Measured: 404 → one call, 500 → four. While retries are running, the query exposes <code>failureCount</code> and <code>failureReason</code> if you want to show "Đang thử lại lần 2…". In tests set <code>retry: false</code> (Lesson 6.2), or every error test waits seven seconds.</p>
${SD.thuLaiEn}
<div class="callout"><p><strong>JS quick reminder — <code>instanceof</code> with a class.</strong> <code>loi instanceof LoiApi</code> is <code>true</code> only for errors created with <code>new LoiApi(…)</code> — the ones that carry an HTTP status. A <code>TypeError</code> from a dropped connection is not a <code>LoiApi</code>, so it falls through to "retry". (The cross-realm trap of Lesson 6.1 does not apply here: <code>LoiApi</code> is your own class, defined once.)</p></div>

<h3>A refresh failed? Keep the data you have</h3>
${S6(23, 'Làm mới lỗi thì giữ dữ liệu · keepPreviousData')}
<p>When a query that already has data fails to refresh, TanStack sets <code>status</code> to <code>'error'</code> — <em>and keeps the data</em>:</p>
${out(OUT.trangThaiLog)}
<div class="pitfall co-tieu-de"><p><strong>Trap — the list that vanishes when the Wi-Fi hiccups.</strong> <code>if (isError) return &lt;LoiTaiDuLieu … /&gt;;</code> placed before the list. The user has been reading six doctors for a minute, switches tabs and back, the background refetch fails once (after its retries) — and the six doctors are replaced by a red box, although the data is still in the cache and perfectly usable. Check <code>!data</code> for the error screen, and show a small "could not refresh — showing earlier data" strip when both data and error exist. The project test "đã có dữ liệu mà làm mới lỗi" keeps it that way.</p></div>
<p>The same idea applies when the <em>key</em> changes. Choosing another date in step 2 is a new key with no data; without help, the grid would flash to a skeleton and back. <code>placeholderData: keepPreviousData</code> in <code>useKhungGio</code> keeps showing the previous date's slots while the new ones load, and <code>isPlaceholderData</code> tells the component to fade them and disable the buttons — the screenshot on the slide was taken with <code>?tre=1500</code>, 300 ms after clicking 02/10. The test log shows the timeline: right after the switch, <code>isPlaceholderData=true</code> with <code>isPending=false</code> and the first slot still from 01/10; then the 02/10 slots arrive.</p>

<h3>Error boundaries: one broken area, not a white page</h3>
${S6(24, 'Ranh giới lỗi')}
<p>Everything so far handled <em>expected</em> failures — the network, the server. A bug is different: a component throws while rendering (reading a property of <code>undefined</code>, say), and without protection React unmounts the whole tree — a blank page. An <strong>error boundary</strong> catches errors thrown during rendering in its children and draws a fallback instead:</p>
${pre('tsx', SN.ranhGioiLoi)}
<p>It has to be a class: React 19 still has no hook equivalent for <code>getDerivedStateFromError</code> / <code>componentDidCatch</code> — react.dev says so on the <code>Component</code> reference page and points to the <code>react-error-boundary</code> package, which wraps exactly this class for you. <code>getDerivedStateFromError</code> switches to the fallback on the next render; <code>componentDidCatch</code> is where a real app reports the error (Sentry and the like). The app wraps each area separately, so a bug in one leaves the others working:</p>
${pre('tsx', SN.app)}
${pre('tsx', SN.bai4)}
${out(OUT.ranhGioiLog)}
<p>What a boundary does <strong>not</strong> catch: errors in event handlers, in <code>setTimeout</code>, in Promises — those do not happen during rendering. That is why data errors are shown inline from <code>isError</code>, and why a query can opt in with <code>throwOnError: true</code> when you <em>want</em> its error to go to the nearest boundary. Pair it with <code>QueryErrorResetBoundary</code>: its <code>reset</code> clears the query's error, so "Tải lại phần này" really fetches again instead of re-throwing the cached error — measured above: two calls to the API.</p>
${SD.ranhGioiEn}

<h3>Toasts for failed writes — registered once for the whole app</h3>
${S6(25, 'Thông báo nổi cho lỗi của mutation')}
<p>A failed <em>read</em> belongs where the data would be. A failed <em>write</em> is different: the user just clicked something and may already be looking elsewhere, so it gets a toast. Rather than repeating <code>onError</code> in every mutation, the <code>MutationCache</code> in <code>taoQueryClient()</code> (above) handles all of them: each mutation can set <code>meta.thongBaoLoi</code> for its own sentence, or <code>meta.tuXuLyLoi</code> when it already shows the error in place (booking does, in step 4). The toast list itself is UI state, so it lives in a tiny Zustand store:</p>
${pre('ts', SN.thongBaoStore)}
${pre('tsx', SN.vungThongBao)}
<p><code>role="status"</code> is the polite live region — read when the screen reader is idle, unlike <code>role="alert"</code> which interrupts. Toasts disappear after five seconds, so never put the <em>only</em> copy of important information in one; the cancelled-then-restored appointment is still visible in the list.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202 projects usually have a <code>loading</code> boolean and an <code>error</code> string in state (or in a Redux slice): <code>if (loading) return &lt;Spinner /&gt;</code> from React-Bootstrap, errors as <code>alert(err.message)</code> or a red line, and nothing for "empty" or "refresh failed". → At work: skeletons shaped like the content, inline errors with a retry button, a distinct empty state, retries for transient failures only, error boundaries per area for bugs, and one global toast for failed writes. · <em>Why:</em> the spinner approach is not wrong for an assignment with one fetch. In a product, a full-screen spinner on every refetch, an error that wipes readable data, and "no results" shown for a server failure each cost real users. You will still meet <code>loading</code> flags in older code — they work; they just leave these cases to chance.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "What does an error boundary catch, and what doesn't it?"</p>
<p>Idea of an answer: it catches errors thrown while rendering, in lifecycle methods and constructors of the components below it, and shows a fallback instead of unmounting the whole app. It does not catch errors in event handlers, asynchronous code (<code>setTimeout</code>, Promises), server-side rendering, or in the boundary itself. It must be a class component (<code>getDerivedStateFromError</code>, <code>componentDidCatch</code>) or come from <code>react-error-boundary</code>. For data errors I show them inline from the query state, and use <code>throwOnError</code> plus <code>QueryErrorResetBoundary</code> when I want a query error to go to a boundary.</p></div>

<h3>When to use what</h3>
<ul>
<li><strong>Skeleton</strong> for a first load of content with a known shape; a small inline spinner for a button or a background refresh; <strong>never</strong> a full-page spinner that hides data already on screen.</li>
<li><strong>Inline error + "Thử lại"</strong> for failed reads; <strong>toast</strong> for failed writes; <strong>error boundary</strong> for bugs, one per independent area.</li>
<li><strong>Retry</strong> network errors and 5xx; <strong>never</strong> retry 4xx; in tests, retry nothing.</li>
<li><strong>Empty state</strong> is a normal answer: say what is empty and, if possible, what to do (clear the filter, choose another date).</li>
</ul>

<h3>Try it step by step</h3>
<ol>
<li>Open the app with <code>?tre=vo-han</code>: skeleton. With <code>?rong=1</code>: the empty sentence. With <code>?loi=bac-si</code>: wait about 7 seconds for the error box; click "Thử lại" (it fails again — the knob is still on).</li>
<li>With DevTools → Network throttling "Slow 3G", open the booking flow and switch dates: the old slots fade instead of disappearing.</li>
<li>In <code>TheBacSi</code>, temporarily write <code>{(undefined as unknown as string).slice(0)}</code>: only the doctor area shows "Phần này gặp sự cố", the booking flow still works. Remove it.</li>
<li>Book an appointment, then open <code>?loi=huy</code> in the same tab and cancel it: toast bottom-right, row restored.</li>
<li>Run the lesson's tests (the retry test really waits seven seconds):</li>
</ol>
${out(OUT.bai4Tom)}

<h3>🛠 Keep building the project</h3>
<p><strong>Starting point:</strong> the project after Chapter 5 (<code>src/store/dat-lich-store.ts</code> with favourites and appointments, <code>src/dat-lich/luong-dat-lich.ts</code>, <code>LuongDatLich</code>, <code>LichHenCuaToi</code>, <code>useBoLocUrl</code>, the static <code>src/du-lieu/bac-si.ts</code> and <code>khung-gio.ts</code>, the fake <code>logic/gui-dat-lich.ts</code>; 19 test files, 72 tests green). Goal: the app talks to the six API endpoints through MSW and TanStack Query, with honest loading, error and empty states.</p>
${out(OUT.truocChuong)}
<ol>
<li><strong>Fake API.</strong> <code>npx msw init public --save</code>; create <code>src/mocks/co-so-du-lieu.ts</code>, <code>dieu-khien.ts</code>, <code>handlers.ts</code> (six endpoints), <code>browser.ts</code>, <code>node.ts</code>. Start the worker in <code>main.tsx</code> before rendering; start the server in <code>src/test/setup.ts</code> and reset handlers and the database after each test.</li>
<li><strong>API layer.</strong> <code>src/api/http.ts</code> (<code>goiApi</code> + <code>LoiApi</code>), <code>src/api/phong-kham.ts</code> (<code>api</code>, type <code>LichHenCoGio</code>), <code>src/api/khoa.ts</code> (keys).</li>
<li><strong>Queries.</strong> <code>src/query-client.ts</code> (<code>taoQueryClient</code>, <code>nenThuLai</code>, global toast), <code>QueryClientProvider</code> + DevTools in <code>main.tsx</code>; hooks <code>useBacSi</code>, <code>useKhungGio</code>. <code>KhuBacSi</code> reads <code>useBacSi()</code> and draws four states; <code>test/render.tsx</code> for tests.</li>
<li><strong>Booking as a mutation.</strong> <code>useDatLich</code> (invalidate in <code>onSettled</code>); the reducer loses <code>dangGui</code>/<code>loiGui</code>/<code>daDat</code> and gains <code>ngay</code> + <code>'chon-ngay'</code>; step 2 shows date chips and the slot grid from <code>useKhungGio</code> with <code>keepPreviousData</code>; delete <code>logic/gui-dat-lich.ts</code> and <code>du-lieu/khung-gio.ts</code> (move <code>hienGio</code> to <code>logic/thoi-gian.ts</code>).</li>
<li><strong>Appointments on the server.</strong> <code>useLichHen</code> + <code>useHuyLichHen</code> (optimistic, with rollback); <code>LichHenCuaToi</code> and <code>Header</code> read the cache; remove <code>lichHen</code> from the store (persist <code>version: 2</code> + <code>migrate</code>).</li>
<li><strong>Safety nets.</strong> <code>KhungXuong</code>, <code>LoiTaiDuLieu</code>, <code>RanhGioiLoi</code> around each area in <code>App</code>, <code>VungThongBao</code> + <code>thong-bao-store</code>.</li>
</ol>
<p><strong>Done when</strong> — the tests below are copied into the project <em>first</em> (run them, see red, then write code until green), together with the updated <code>KhuBacSi</code>/<code>App</code>/<code>useBoLocUrl</code> tests that render through <code>renderVoiQuery</code> and wait with <code>findBy…</code>:</p>
${pre('ts', SN.tHandlers)}
${pre('tsx', SN.tLichHen)}
${pre('tsx', SN.tHeader)}
${out(OUT.datXong)}
<p>…and the app in the browser looks like slide 28: book 14:00 with BS. Trần Thu Hà, the success message shows the appointment id, "Lịch hẹn của tôi (1)" lists it, and 14:00 is "(kín)" when you book again.</p>
<details><summary>Solution</summary>
<p>Everything below ran on 25 September 2026: <code>npx tsc -b</code> clean, <code>npx vitest run</code> 21 files / 81 tests green, <code>npx vite build</code> as on slide 28. Files already shown in full in this chapter are not repeated: <code>http.ts</code>, <code>useBacSi.ts</code>, <code>khoa.ts</code>, <code>phong-kham.ts</code>, <code>main.tsx</code>, <code>render.tsx</code>, <code>setup.ts</code> (Lesson 6.2), <code>useKhungGio.ts</code> (6.2), <code>useDatLich.ts</code>, <code>useLichHen.ts</code>, the reducer types and the <code>LuongDatLich</code> excerpts (6.3), <code>KhungXuong</code>, <code>LoiTaiDuLieu</code>, <code>RanhGioiLoi</code>, <code>App</code>, <code>query-client.ts</code>, <code>thong-bao-store.ts</code>, <code>VungThongBao</code> (this lesson).</p>
${pre('ts', SN.coSoDuLieu)}
${pre('ts', SN.dieuKhien)}
${pre('ts', SN.handlers)}
${pre('ts', SN.thoiGian)}
${pre('ts', SN.store)}
${pre('tsx', SN.header)}
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> when the doctor list fails, users stare at a skeleton for seven seconds with no idea retries are happening.</p><ol>
<li>In <code>KhuBacSi</code>, while <code>isPending</code> and <code>failureCount &gt; 0</code>, show under the skeleton: "Máy chủ chưa trả lời, đang thử lại lần {failureCount}…" (<code>role="status"</code>).</li>
<li>Test with a client whose <code>retryDelay</code> is 50 ms and <code>retry: 2</code>, and an endpoint that fails twice then succeeds: the text "đang thử lại lần 1" appears, then the six doctors, and no error box ever appears.</li>
<li>Second test: endpoint returns 404 → the error box appears with no "đang thử lại" text (your <code>nenThuLai</code> rule).</li>
</ol><p><strong>Done when:</strong> both tests are green, <code>npx tsc -b</code> is clean, and with <code>?loi=bac-si</code> in the browser you can read the retry counter going up before the error box appears.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">skeleton (khung xương)</span><span class="v">placeholder in the shape of the coming content; avoids layout shift</span></div>
<div class="kv"><span class="k">empty state (trạng thái rỗng)</span><span class="v">a successful answer with nothing in it — not an error</span></div>
<div class="kv"><span class="k">retry / retryDelay</span><span class="v">3 retries, 1 s → 2 s → 4 s by default; custom rule per error</span></div>
<div class="kv"><span class="k">failureCount</span><span class="v">how many attempts have failed so far (while still retrying)</span></div>
<div class="kv"><span class="k">keepPreviousData</span><span class="v">show the old key's data while the new key loads; <code>isPlaceholderData</code></span></div>
<div class="kv"><span class="k">error boundary (ranh giới lỗi)</span><span class="v">class component catching render errors below it and drawing a fallback</span></div>
<div class="kv"><span class="k">throwOnError</span><span class="v">send a query's error to the nearest error boundary</span></div>
<div class="kv"><span class="k">toast (thông báo nổi)</span><span class="v">short-lived message, here for failed mutations; <code>role="status"</code></span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Four states in order: pending → no data (error) → empty → data (+ strip if a refresh failed).</li>
<li>Skeleton only on the first load, in the content's shape, with <code>aria-busy</code>; keep data on screen during refreshes.</li>
<li>Errors say what failed, why, and offer a retry; an empty list is a calm sentence, not red text.</li>
<li>Default retries took the error box to ~7 s (measured); retry network/5xx only, never 4xx; <code>retry: false</code> in tests.</li>
<li>Error boundaries (still classes in React 19) catch render bugs per area; <code>throwOnError</code> + <code>QueryErrorResetBoundary</code> for query errors you want there.</li>
<li>Failed writes → one global toast via <code>MutationCache</code>, with <code>meta</code> to customise or opt out.</li>
</ul>

${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/query-retries', '📄', 'TanStack Query — Query Retries', 'retry, retryDelay, failureCount and failureReason.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/placeholder-query-data', '📄', 'TanStack Query — Placeholder Query Data', 'placeholderData, keepPreviousData, isPlaceholderData.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/suspense', '📄', 'TanStack Query — Suspense', 'throwOnError, error boundaries and QueryErrorResetBoundary.')}
${LINK('https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary', '📄', 'react.dev — Catching rendering errors with an error boundary', 'getDerivedStateFromError, componentDidCatch, react-error-boundary.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Trạng thái đang tải, lỗi và rỗng: màn hình trung thực cho dữ liệu chưa có mặt</h2>
<p class="lead">Khi dữ liệu đi qua mạng, mọi khu trên màn hình đều có thể ở bốn tình huống: chưa có gì, hỏng, rỗng, hoặc ổn — và đôi khi "ổn, nhưng lần làm mới vừa hỏng". App có cảm giác chắc chắn là app xử lý hết các tình huống đó một cách có chủ đích. Bài này cho app phòng khám một skeleton lúc tải, câu báo riêng cho lỗi và cho rỗng, một luật thử lại, cách giữ dữ liệu tốt khi làm mới hỏng, ranh giới lỗi cho bug, và thông báo nổi cho lần ghi thất bại — mỗi thứ đều được đo hoặc chụp trong trình duyệt thật.</p>

<h3>Bốn trạng thái, kiểm theo đúng thứ tự</h3>
<p><code>KhuBacSi</code> quyết định vẽ gì bằng một chuỗi <code>if</code>. Thứ tự là toàn bộ vấn đề:</p>
${pre('tsx', SN.khuBacSiTrangThai)}
<table>
<thead><tr><th>Thứ tự</th><th>Điều kiện</th><th>Vẽ</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>isPending</code></td><td>skeleton — chưa có gì để hiện</td></tr>
<tr><td>2</td><td><code>!danhSachBacSi</code> (tức: hỏng mà không có chút dữ liệu nào)</td><td>hộp lỗi có nút "Thử lại"</td></tr>
<tr><td>3</td><td><code>length === 0</code></td><td>một câu "rỗng" — không phải lỗi</td></tr>
<tr><td>4</td><td>còn lại</td><td>danh sách, kèm dải vàng nếu <code>isError</code> (lần làm mới hỏng)</td></tr>
</tbody>
</table>
<p>Bước 2 hỏi "có phải <em>không có dữ liệu</em>?", chứ không hỏi "có lỗi không?". Khác biệt đó lộ ra ngay khi một lần làm mới nền thất bại — mục 5 dưới đây đo nó. <code>error!</code> là non-null assertion của Bài 6.2: khi query không còn pending mà không có dữ liệu, TanStack bảo đảm có một lỗi.</p>
${SD.thuTuVi}

<h3>Đang tải: skeleton đúng hình</h3>
${S6(20, 'Skeleton đúng hình — ảnh chụp thật')}
${pre('tsx', SN.khungXuong)}
<ul>
<li><strong>Cùng kích thước thẻ thật</strong>, nên dữ liệu về không có gì nhảy (không layout shift — một chỉ số Core Web Vitals).</li>
<li><strong>Chỉ khi <code>isPending</code>.</strong> Làm mới nền thì giữ dữ liệu cũ trên màn hình; chớp skeleton đè lên thứ người dùng đang đọc còn tệ hơn không có chỉ báo nào.</li>
<li><strong>Tiếp cận được:</strong> <code>aria-busy="true"</code> trên vùng đó và một câu ẩn khỏi mắt, để trình đọc màn hình nói "đang tải" thay vì đọc sáu hộp trống. Hiệu ứng lấp lánh tắt khi người dùng bật <code>prefers-reduced-motion</code>.</li>
<li><strong>Thứ gì không phụ thuộc dữ liệu thì vẽ ngay</strong> — chip, ô tìm và khung yêu thích đều có mặt trong ảnh chụp.</li>
</ul>
<p>Ảnh chụp với <code>?tre=vo-han</code>: API giả không bao giờ trả lời, nên skeleton nằm trên màn hình bao lâu tuỳ bạn.</p>

<h3>Lỗi và rỗng là hai chuyện khác nhau</h3>
${S6(21, 'Lỗi và rỗng — hai ảnh chụp thật')}
${pre('tsx', SN.loiTaiDuLieu)}
<p>Một câu báo lỗi có ba phần: <strong>cái gì</strong> hỏng ("Không tải được danh sách bác sĩ"), <strong>vì sao</strong> bằng lời của người dùng (câu của máy chủ, hoặc "kiểm tra mạng" khi chính <code>fetch</code> ném lỗi — đó là lý do có <code>LoiApi</code>), và <strong>làm gì bây giờ</strong> (nút "Thử lại" gọi <code>refetch()</code> và tự khoá trong lúc chạy). <code>role="alert"</code> khiến trình đọc màn hình đọc nó ngay.</p>
<p>Danh sách rỗng không phải thất bại: request chạy tốt và câu trả lời là <code>[]</code>. Nó nhận một câu bình thản, không màu đỏ. Trộn hai thứ — hiện "Không tìm thấy bác sĩ" khi thật ra request hỏng — là đuổi người dùng khỏi một phòng khám có sáu bác sĩ.</p>
<p>Hộp lỗi mất bao lâu để hiện trong Chromium, khi API bác sĩ trả 500?</p>
${out(OUT.loiChromium)}
<p>Bảy giây rưỡi. Ba dòng 500 trong console là ba trong bốn lần gọi — dẫn tới chuyện thử lại.</p>

<h3>Thử lại: ba lần mặc định, 1 s → 2 s → 4 s</h3>
${S6(22, 'Thử lại 3 lần: 1 s, 2 s, 4 s')}
<p>TanStack Query thử lại một query hỏng ba lần, đợi 1 s, 2 s, rồi 4 s (khoảng đợi gấp đôi, tối đa 30 s). Đo với một <code>new QueryClient()</code> trần và một API luôn trả 500:</p>
${out(OUT.retryLog)}
<p>Bốn lần gọi lúc 31, 1042, 3047 và 7050 ms; <code>failureCount</code> tăng từ 0 lên 4; lúc đó query mới thành <code>error</code>. Với mạng chập chờn thì đúng hệt điều cần — người dùng không bao giờ thấy lỗi. Với 404 thì là bảy giây chờ vô ích: bác sĩ không tồn tại và lần thứ tư cũng không tồn tại. Vì vậy client của dự án chỉ thử lại thứ có thể tự khỏi:</p>
${pre('ts', SN.queryClient)}
<p>Đo thật: 404 → một lần gọi, 500 → bốn. Trong lúc đang thử lại, query có <code>failureCount</code> và <code>failureReason</code> nếu bạn muốn hiện "Đang thử lại lần 2…". Trong test đặt <code>retry: false</code> (Bài 6.2), không thì mỗi test lỗi đợi bảy giây.</p>
${SD.thuLaiVi}
<div class="callout"><p><strong>JS nhắc nhanh — <code>instanceof</code> với class.</strong> <code>loi instanceof LoiApi</code> chỉ <code>true</code> với lỗi tạo bằng <code>new LoiApi(…)</code> — loại mang mã HTTP. Một <code>TypeError</code> do rớt kết nối không phải <code>LoiApi</code>, nên nó rơi xuống nhánh "thử lại". (Bẫy "khác môi trường" của Bài 6.1 không áp dụng ở đây: <code>LoiApi</code> là class của chính bạn, định nghĩa một lần.)</p></div>

<h3>Làm mới hỏng? Giữ dữ liệu đang có</h3>
${S6(23, 'Làm mới lỗi thì giữ dữ liệu · keepPreviousData')}
<p>Khi một query đã có dữ liệu mà làm mới thất bại, TanStack đặt <code>status</code> thành <code>'error'</code> — <em>và giữ nguyên dữ liệu</em>:</p>
${out(OUT.trangThaiLog)}
<div class="pitfall co-tieu-de"><p><strong>Bẫy — danh sách biến mất khi Wi-Fi chập chờn.</strong> <code>if (isError) return &lt;LoiTaiDuLieu … /&gt;;</code> đặt trước danh sách. Người dùng đang đọc sáu bác sĩ được một phút, chuyển tab rồi quay lại, lần làm mới nền hỏng một lần (sau các lần thử lại) — và sáu bác sĩ bị thay bằng một hộp đỏ, dù dữ liệu vẫn còn trong cache và dùng được hoàn toàn. Hỏi <code>!data</code> cho màn lỗi, và hiện một dải nhỏ "không làm mới được — đang hiện bản trước" khi có cả dữ liệu lẫn lỗi. Test "đã có dữ liệu mà làm mới lỗi" của dự án giữ cho nó đúng như vậy.</p></div>
<p>Cùng ý tưởng đó áp dụng khi <em>key</em> đổi. Chọn ngày khác ở bước 2 là một key mới chưa có dữ liệu; không làm gì thì lưới giờ sẽ chớp thành skeleton rồi quay lại. <code>placeholderData: keepPreviousData</code> trong <code>useKhungGio</code> giữ khung giờ của ngày trước trong lúc ngày mới tải, và <code>isPlaceholderData</code> bảo component làm mờ chúng và khoá nút — ảnh trên slide chụp với <code>?tre=1500</code>, 300 ms sau khi bấm 02/10. Log test cho thấy dòng thời gian: ngay sau khi đổi, <code>isPlaceholderData=true</code> với <code>isPending=false</code> và khung đầu tiên vẫn của 01/10; rồi khung giờ 02/10 về.</p>

<h3>Ranh giới lỗi: một khu hỏng, không phải cả trang trắng</h3>
${S6(24, 'Ranh giới lỗi')}
<p>Mọi thứ tới giờ xử lý thất bại <em>có thể lường trước</em> — mạng, máy chủ. Bug thì khác: một component ném lỗi lúc render (đọc thuộc tính của <code>undefined</code>, chẳng hạn), và không có gì che chắn thì React tháo cả cây — trang trắng. Một <strong>error boundary (ranh giới lỗi)</strong> bắt lỗi ném ra lúc render ở các component con và vẽ một màn dự phòng thay vào:</p>
${pre('tsx', SN.ranhGioiLoi)}
<p>Nó phải là class: React 19 vẫn chưa có hook tương đương <code>getDerivedStateFromError</code> / <code>componentDidCatch</code> — react.dev ghi rõ trên trang tham khảo <code>Component</code> và chỉ sang gói <code>react-error-boundary</code>, thứ bọc sẵn đúng class này cho bạn. <code>getDerivedStateFromError</code> chuyển sang màn dự phòng ở lần render sau; <code>componentDidCatch</code> là chỗ app thật báo lỗi về (Sentry và các dịch vụ tương tự). App bọc từng khu riêng, nên bug ở một khu để các khu kia vẫn chạy:</p>
${pre('tsx', SN.app)}
${pre('tsx', SN.bai4)}
${out(OUT.ranhGioiLog)}
<p>Thứ ranh giới lỗi <strong>không</strong> bắt: lỗi trong event handler, trong <code>setTimeout</code>, trong Promise — chúng không xảy ra lúc render. Vì vậy lỗi dữ liệu được hiện tại chỗ từ <code>isError</code>, và một query có thể chủ động bật <code>throwOnError: true</code> khi bạn <em>muốn</em> lỗi của nó lên ranh giới gần nhất. Đi kèm <code>QueryErrorResetBoundary</code>: <code>reset</code> của nó xoá lỗi của query, nên "Tải lại phần này" tải lại thật thay vì ném lại lỗi đang cache — đo ở trên: hai lần gọi API.</p>
${SD.ranhGioiVi}

<h3>Thông báo nổi cho lần ghi hỏng — đăng ký một lần cho cả app</h3>
${S6(25, 'Thông báo nổi cho lỗi của mutation')}
<p>Một lần <em>đọc</em> hỏng thuộc về đúng chỗ dữ liệu lẽ ra hiện. Một lần <em>ghi</em> hỏng thì khác: người dùng vừa bấm gì đó và có thể đã nhìn sang chỗ khác, nên nó nhận một thông báo nổi. Thay vì lặp <code>onError</code> ở mọi mutation, <code>MutationCache</code> trong <code>taoQueryClient()</code> (ở trên) xử lý tất cả: mỗi mutation có thể đặt <code>meta.thongBaoLoi</code> cho câu riêng của nó, hoặc <code>meta.tuXuLyLoi</code> khi nó đã tự hiện lỗi tại chỗ (đặt lịch làm vậy, ở bước 4). Danh sách thông báo là state của giao diện, nên nó sống trong một store Zustand bé xíu:</p>
${pre('ts', SN.thongBaoStore)}
${pre('tsx', SN.vungThongBao)}
<p><code>role="status"</code> là vùng thông báo lịch sự — đọc khi trình đọc màn hình rảnh, khác <code>role="alert"</code> chen ngang ngay. Thông báo tự tắt sau năm giây, nên đừng bao giờ để bản <em>duy nhất</em> của thông tin quan trọng trong đó; lịch hẹn bị huỷ rồi được hoàn tác vẫn nhìn thấy trong danh sách.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Đồ án FER202 thường có một cờ <code>loading</code> và một chuỗi <code>error</code> trong state (hoặc trong một slice Redux): <code>if (loading) return &lt;Spinner /&gt;</code> của React-Bootstrap, lỗi thì <code>alert(err.message)</code> hay một dòng chữ đỏ, còn "rỗng" hay "làm mới hỏng" thì không có gì. → Đi làm: skeleton đúng hình nội dung, lỗi tại chỗ có nút thử lại, trạng thái rỗng riêng, chỉ thử lại lỗi tạm thời, ranh giới lỗi cho từng khu để chặn bug, và một thông báo nổi chung cho lần ghi hỏng. · <em>Vì sao:</em> cách spinner không sai cho một bài tập có một lần fetch. Trong sản phẩm thật, spinner phủ cả trang mỗi lần làm mới, lỗi xoá mất dữ liệu đang đọc được, và "không có kết quả" hiện ra khi máy chủ hỏng — mỗi thứ đều làm mất người dùng thật. Bạn vẫn sẽ gặp cờ <code>loading</code> trong code cũ — nó chạy; chỉ là nó để các tình huống này cho may rủi.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Error boundary bắt được gì, và không bắt được gì?"</p>
<p>Ý trả lời: nó bắt lỗi ném ra lúc render, trong các phương thức vòng đời và hàm dựng của component bên dưới nó, rồi hiện màn dự phòng thay vì tháo cả app. Nó không bắt lỗi trong event handler, code bất đồng bộ (<code>setTimeout</code>, Promise), render phía máy chủ, hay lỗi của chính nó. Nó phải là class component (<code>getDerivedStateFromError</code>, <code>componentDidCatch</code>) hoặc lấy từ <code>react-error-boundary</code>. Lỗi dữ liệu thì tôi hiện tại chỗ từ trạng thái query, và dùng <code>throwOnError</code> cùng <code>QueryErrorResetBoundary</code> khi muốn lỗi query lên ranh giới.</p></div>

<h3>Khi nào dùng cái gì</h3>
<ul>
<li><strong>Skeleton</strong> cho lần tải đầu của nội dung có hình dạng biết trước; vòng xoay nhỏ tại chỗ cho một nút hay lần làm mới nền; <strong>không bao giờ</strong> spinner phủ cả trang che dữ liệu đang có.</li>
<li><strong>Lỗi tại chỗ + "Thử lại"</strong> cho lần đọc hỏng; <strong>thông báo nổi</strong> cho lần ghi hỏng; <strong>ranh giới lỗi</strong> cho bug, mỗi khu độc lập một cái.</li>
<li><strong>Thử lại</strong> lỗi mạng và 5xx; <strong>không bao giờ</strong> thử lại 4xx; trong test, không thử lại gì.</li>
<li><strong>Trạng thái rỗng</strong> là một câu trả lời bình thường: nói cái gì đang rỗng và, nếu được, nên làm gì (bỏ bộ lọc, chọn ngày khác).</li>
</ul>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Mở app với <code>?tre=vo-han</code>: skeleton. Với <code>?rong=1</code>: câu rỗng. Với <code>?loi=bac-si</code>: đợi khoảng 7 giây mới thấy hộp lỗi; bấm "Thử lại" (vẫn hỏng — núm vẫn đang bật).</li>
<li>Bật DevTools → Network throttling "Slow 3G", vào luồng đặt lịch và đổi ngày: khung giờ cũ mờ đi thay vì biến mất.</li>
<li>Trong <code>TheBacSi</code>, tạm viết <code>{(undefined as unknown as string).slice(0)}</code>: chỉ khu bác sĩ hiện "Phần này gặp sự cố", luồng đặt lịch vẫn chạy. Xoá đi.</li>
<li>Đặt một lịch, rồi mở <code>?loi=huy</code> trong cùng tab và huỷ nó: thông báo góc dưới phải, dòng lịch hẹn được trả lại.</li>
<li>Chạy test của bài (test thử lại thật sự đợi bảy giây):</li>
</ol>
${out(OUT.bai4Tom)}

<h3>🛠 Tự gõ tiếp dự án</h3>
<p><strong>Điểm xuất phát:</strong> dự án sau Chương 5 (<code>src/store/dat-lich-store.ts</code> có yêu thích và lịch hẹn, <code>src/dat-lich/luong-dat-lich.ts</code>, <code>LuongDatLich</code>, <code>LichHenCuaToi</code>, <code>useBoLocUrl</code>, dữ liệu tĩnh <code>src/du-lieu/bac-si.ts</code> và <code>khung-gio.ts</code>, máy chủ giả <code>logic/gui-dat-lich.ts</code>; 19 file test, 72 test xanh). Mục tiêu: app nói chuyện với sáu API qua MSW và TanStack Query, có đủ trạng thái đang tải, lỗi và rỗng.</p>
${out(OUT.truocChuong)}
<ol>
<li><strong>API giả.</strong> <code>npx msw init public --save</code>; tạo <code>src/mocks/co-so-du-lieu.ts</code>, <code>dieu-khien.ts</code>, <code>handlers.ts</code> (sáu API), <code>browser.ts</code>, <code>node.ts</code>. Khởi động worker trong <code>main.tsx</code> trước khi render; khởi động server trong <code>src/test/setup.ts</code> và đặt lại handler cùng cơ sở dữ liệu sau mỗi test.</li>
<li><strong>Tầng API.</strong> <code>src/api/http.ts</code> (<code>goiApi</code> + <code>LoiApi</code>), <code>src/api/phong-kham.ts</code> (<code>api</code>, kiểu <code>LichHenCoGio</code>), <code>src/api/khoa.ts</code> (các key).</li>
<li><strong>Query.</strong> <code>src/query-client.ts</code> (<code>taoQueryClient</code>, <code>nenThuLai</code>, thông báo lỗi chung), <code>QueryClientProvider</code> + DevTools trong <code>main.tsx</code>; hook <code>useBacSi</code>, <code>useKhungGio</code>. <code>KhuBacSi</code> đọc <code>useBacSi()</code> và vẽ bốn trạng thái; <code>test/render.tsx</code> cho test.</li>
<li><strong>Đặt lịch thành mutation.</strong> <code>useDatLich</code> (invalidate trong <code>onSettled</code>); reducer bỏ <code>dangGui</code>/<code>loiGui</code>/<code>daDat</code> và thêm <code>ngay</code> + <code>'chon-ngay'</code>; bước 2 hiện chip ngày và lưới giờ từ <code>useKhungGio</code> có <code>keepPreviousData</code>; xoá <code>logic/gui-dat-lich.ts</code> và <code>du-lieu/khung-gio.ts</code> (chuyển <code>hienGio</code> sang <code>logic/thoi-gian.ts</code>).</li>
<li><strong>Lịch hẹn lên máy chủ.</strong> <code>useLichHen</code> + <code>useHuyLichHen</code> (lạc quan, có hoàn tác); <code>LichHenCuaToi</code> và <code>Header</code> đọc cache; bỏ <code>lichHen</code> khỏi store (persist <code>version: 2</code> + <code>migrate</code>).</li>
<li><strong>Lưới an toàn.</strong> <code>KhungXuong</code>, <code>LoiTaiDuLieu</code>, <code>RanhGioiLoi</code> bọc từng khu trong <code>App</code>, <code>VungThongBao</code> + <code>thong-bao-store</code>.</li>
</ol>
<p><strong>Đạt khi</strong> — chép các test dưới đây vào dự án <em>trước</em> (chạy, thấy đỏ, rồi viết code tới khi xanh), cùng với các test <code>KhuBacSi</code>/<code>App</code>/<code>useBoLocUrl</code> đã sửa để render qua <code>renderVoiQuery</code> và đợi bằng <code>findBy…</code>:</p>
${pre('ts', SN.tHandlers)}
${pre('tsx', SN.tLichHen)}
${pre('tsx', SN.tHeader)}
${out(OUT.datXong)}
<p>…và app trên trình duyệt giống slide 28: đặt 14:00 với BS. Trần Thu Hà, câu thành công hiện mã lịch hẹn, "Lịch hẹn của tôi (1)" liệt kê nó, và đặt lại thì 14:00 là "(kín)".</p>
<details><summary>Lời giải</summary>
<p>Mọi thứ dưới đây đã chạy ngày 25/09/2026: <code>npx tsc -b</code> sạch, <code>npx vitest run</code> 21 file / 81 test xanh, <code>npx vite build</code> như slide 28. Các file đã in đủ trong chương không lặp lại: <code>http.ts</code> (Bài 6.1), <code>useBacSi.ts</code>, <code>khoa.ts</code>, <code>phong-kham.ts</code>, <code>main.tsx</code>, <code>render.tsx</code>, <code>setup.ts</code>, <code>useKhungGio.ts</code> (Bài 6.2), <code>useDatLich.ts</code>, <code>useLichHen.ts</code>, kiểu của reducer và các đoạn <code>LuongDatLich</code> (Bài 6.3), <code>KhungXuong</code>, <code>LoiTaiDuLieu</code>, <code>RanhGioiLoi</code>, <code>App</code>, <code>query-client.ts</code>, <code>thong-bao-store.ts</code>, <code>VungThongBao</code> (bài này).</p>
${pre('ts', SN.coSoDuLieu)}
${pre('ts', SN.dieuKhien)}
${pre('ts', SN.handlers)}
${pre('ts', SN.thoiGian)}
${pre('ts', SN.store)}
${pre('tsx', SN.header)}
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> khi danh sách bác sĩ hỏng, người dùng nhìn skeleton suốt bảy giây mà không biết đang có thử lại.</p><ol>
<li>Trong <code>KhuBacSi</code>, khi <code>isPending</code> và <code>failureCount &gt; 0</code>, hiện dưới skeleton: "Máy chủ chưa trả lời, đang thử lại lần {failureCount}…" (<code>role="status"</code>).</li>
<li>Test với một client có <code>retryDelay</code> 50 ms và <code>retry: 2</code>, và một API hỏng hai lần rồi mới trả được: chữ "đang thử lại lần 1" xuất hiện, rồi tới sáu bác sĩ, và hộp lỗi không bao giờ hiện.</li>
<li>Test thứ hai: API trả 404 → hộp lỗi hiện mà không có chữ "đang thử lại" nào (luật <code>nenThuLai</code> của bạn).</li>
</ol><p><strong>Đạt khi:</strong> hai test xanh, <code>npx tsc -b</code> sạch, và với <code>?loi=bac-si</code> trên trình duyệt bạn đọc được bộ đếm thử lại tăng dần trước khi hộp lỗi hiện.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">skeleton (khung xương)</span><span class="v">chỗ giữ chỗ mang hình dạng nội dung sắp tới; tránh layout shift</span></div>
<div class="kv"><span class="k">empty state (trạng thái rỗng)</span><span class="v">câu trả lời thành công nhưng không có gì — không phải lỗi</span></div>
<div class="kv"><span class="k">retry / retryDelay</span><span class="v">mặc định 3 lần, 1 s → 2 s → 4 s; luật riêng theo từng loại lỗi</span></div>
<div class="kv"><span class="k">failureCount</span><span class="v">số lần đã hỏng tới giờ (trong lúc vẫn đang thử lại)</span></div>
<div class="kv"><span class="k">keepPreviousData</span><span class="v">hiện dữ liệu của key cũ trong lúc key mới tải; <code>isPlaceholderData</code></span></div>
<div class="kv"><span class="k">error boundary (ranh giới lỗi)</span><span class="v">class component bắt lỗi render bên dưới nó và vẽ màn dự phòng</span></div>
<div class="kv"><span class="k">throwOnError</span><span class="v">đẩy lỗi của query lên ranh giới lỗi gần nhất</span></div>
<div class="kv"><span class="k">toast (thông báo nổi)</span><span class="v">câu báo ngắn tự tắt, ở đây cho mutation hỏng; <code>role="status"</code></span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bốn trạng thái theo thứ tự: đang tải → không có dữ liệu (lỗi) → rỗng → có dữ liệu (+ dải báo nếu làm mới hỏng).</li>
<li>Skeleton chỉ cho lần tải đầu, đúng hình nội dung, có <code>aria-busy</code>; khi làm mới thì giữ dữ liệu trên màn hình.</li>
<li>Câu lỗi nói cái gì hỏng, vì sao, và cho nút thử lại; danh sách rỗng là một câu bình thản, không phải chữ đỏ.</li>
<li>Thử lại mặc định đẩy hộp lỗi tới ~7 giây (đo thật); chỉ thử lại lỗi mạng/5xx, không bao giờ 4xx; <code>retry: false</code> trong test.</li>
<li>Ranh giới lỗi (React 19 vẫn là class) chặn bug khi render theo từng khu; <code>throwOnError</code> + <code>QueryErrorResetBoundary</code> cho lỗi query muốn đưa lên đó.</li>
<li>Ghi hỏng → một thông báo nổi chung qua <code>MutationCache</code>, dùng <code>meta</code> để đổi câu hoặc bỏ qua.</li>
</ul>

${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/query-retries', '📄', 'TanStack Query — Query Retries', 'retry, retryDelay, failureCount và failureReason.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/placeholder-query-data', '📄', 'TanStack Query — Placeholder Query Data', 'placeholderData, keepPreviousData, isPlaceholderData.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/suspense', '📄', 'TanStack Query — Suspense', 'throwOnError, ranh giới lỗi và QueryErrorResetBoundary.')}
${LINK('https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary', '📄', 'react.dev — Bắt lỗi render bằng error boundary', 'getDerivedStateFromError, componentDidCatch, react-error-boundary.')}
</div>
`,
};


const L5 = {
  slug: 'rx-6-5-kiem-tra',
  type: 'QUIZ',
  isFreePreview: true,
  title: '6.5 — Chapter 6 quiz: data fetching|||6.5 — Kiểm tra Chương 6: lấy dữ liệu',
  description: 'Mười câu tình huống về fetch trong effect và cuộc đua, res.ok, query key, staleTime, enabled, invalidate sau mutation, cập nhật lạc quan, mutate và mutateAsync, thử lại và ranh giới lỗi — mỗi câu có giải thích.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>Chapter 6 quiz: data fetching</h2>
<p class="lead">Ten situations taken from the clinic app and from the measurements in this chapter. Most ask "what happens on screen?" rather than for a definition. Every answer comes with an explanation of why it is right and why the most tempting wrong answer is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain why fetching in <code>useEffect</code> without cleanup can show the wrong data, and fix it two ways.</li>
<li>I know that <code>fetch</code> does not throw on 404/500 and where to check <code>res.ok</code>.</li>
<li>I can write a <code>useQuery</code> with a correct key, and say what <code>staleTime</code>, <code>gcTime</code> and <code>enabled</code> change.</li>
<li>I can tell <code>isPending</code>, <code>isFetching</code> and <code>isLoading</code> apart.</li>
<li>I can write a mutation that invalidates the right keys, and an optimistic update with rollback.</li>
<li>I know what the default retries do and what an error boundary catches.</li>
</ul>
${S6(27, 'Bảng tra nhanh Chương 6')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Kiểm tra Chương 6: lấy dữ liệu</h2>
<p class="lead">Mười tình huống lấy từ app phòng khám và từ các phép đo trong chương. Đa số hỏi "màn hình hiện gì?" thay vì hỏi định nghĩa. Câu nào cũng có giải thích vì sao đáp án đúng, và vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được vì sao fetch trong <code>useEffect</code> không có cleanup có thể hiện sai dữ liệu, và sửa được bằng hai cách.</li>
<li>Tôi biết <code>fetch</code> không ném lỗi với 404/500 và phải kiểm <code>res.ok</code> ở đâu.</li>
<li>Tôi viết được một <code>useQuery</code> có key đúng, và nói được <code>staleTime</code>, <code>gcTime</code>, <code>enabled</code> thay đổi điều gì.</li>
<li>Tôi phân biệt được <code>isPending</code>, <code>isFetching</code> và <code>isLoading</code>.</li>
<li>Tôi viết được mutation invalidate đúng key, và cập nhật lạc quan có hoàn tác.</li>
<li>Tôi biết thử lại mặc định làm gì và ranh giới lỗi bắt được gì.</li>
</ul>
${S6(27, 'Bảng tra nhanh Chương 6')}
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A profile loads with useEffect(() => { fetch("/api/bac-si/" + id).then(r => r.json()).then(setBacSi); }, [id]) — no cleanup. The user opens bs-1 (answer takes 900 ms) and 50 ms later switches to bs-2 (answer takes 100 ms). What is on screen after one second?|||Hồ sơ tải bằng useEffect(() => { fetch("/api/bac-si/" + id).then(r => r.json()).then(setBacSi); }, [id]) — không có cleanup. Người dùng mở bs-1 (trả lời mất 900 ms) và 50 ms sau chuyển sang bs-2 (mất 100 ms). Sau một giây màn hình hiện gì?',
        options: [
          'bs-2, because the effect re-ran with the new id|||bs-2, vì effect đã chạy lại với id mới',
          'bs-1 — the slow answer arrived last and overwrote bs-2|||bs-1 — câu trả lời chậm về sau cùng và đè lên bs-2',
          'bs-2, because React cancels the previous effect’s fetch automatically|||bs-2, vì React tự huỷ fetch của lượt effect trước',
          'An error: React refuses to set state from an outdated effect|||Lỗi: React từ chối đặt state từ một effect đã cũ',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: bs-2’s answer arrives at ~150 ms and shows the right doctor, then bs-1’s arrives at ~900 ms and its .then still calls setBacSi — the last answer wins (the chapter measured 18/30 wrong rounds in Chromium). The tempting "React cancels it" is false: React runs your cleanup, but there is none here; it never cancels a fetch by itself.|||VI: câu trả lời của bs-2 về lúc ~150 ms và hiện đúng bác sĩ, rồi câu của bs-1 về lúc ~900 ms và .then của nó vẫn gọi setBacSi — câu về sau cùng thắng (chương đo 18/30 vòng sai trong Chromium). Phương án "React tự huỷ" là sai: React chạy cleanup của bạn, mà ở đây không có cleanup; nó không bao giờ tự huỷ fetch.',
      },
      {
        question: 'const bs = await (await fetch("/api/bac-si/bs-99")).json(); — the API answers 404 with { loi: "Không có bác sĩ bs-99" }. What happens?|||const bs = await (await fetch("/api/bac-si/bs-99")).json(); — API trả 404 kèm { loi: "Không có bác sĩ bs-99" }. Chuyện gì xảy ra?',
        options: [
          'fetch rejects, so the line throws a TypeError|||fetch reject, nên dòng này ném TypeError',
          'res.json() throws because the status is not 200|||res.json() ném lỗi vì mã không phải 200',
          'Nothing throws: bs is { loi: "Không có bác sĩ bs-99" }|||Không có gì ném: bs là { loi: "Không có bác sĩ bs-99" }',
          'bs is undefined because 404 responses have no body|||bs là undefined vì phản hồi 404 không có thân',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: fetch only rejects when the request cannot be made (network, DNS, CORS). A 404 is a normal Response with ok: false, and res.json() happily parses the error body — measured in Lesson 6.1. That is why goiApi checks res.ok and throws LoiApi. "fetch rejects" is what most people expect and is exactly the trap.|||VI: fetch chỉ reject khi không gửi được request (mạng, DNS, CORS). 404 là một Response bình thường với ok: false, và res.json() vui vẻ đọc thân báo lỗi — đo ở Bài 6.1. Vì vậy goiApi kiểm res.ok và ném LoiApi. "fetch reject" là điều đa số người nghĩ và chính là cái bẫy.',
      },
      {
        question: 'useQuery({ queryKey: ["khung-gio"], queryFn: () => api.khungGio(bacSiId, ngay) }). The user views bs-1’s slots, then picks bs-2. What does the grid show?|||useQuery({ queryKey: ["khung-gio"], queryFn: () => api.khungGio(bacSiId, ngay) }). Người dùng xem khung giờ của bs-1, rồi chọn bs-2. Lưới giờ hiện gì?',
        options: [
          'Still bs-1’s slots — the key did not change, so nothing is fetched|||Vẫn khung giờ của bs-1 — key không đổi nên không tải gì',
          'bs-2’s slots, because queryFn is a new function on every render|||Khung giờ của bs-2, vì queryFn là hàm mới mỗi lần render',
          'A skeleton forever, because the cache entry is locked|||Skeleton mãi mãi, vì mục cache bị khoá',
          'A TypeScript error: every variable used in queryFn must be in the key|||Lỗi TypeScript: mọi biến dùng trong queryFn phải nằm trong key',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: the key is the cache address and the dependency list. Same key ⇒ same entry, already has data ⇒ no request; the lesson’s test logged data[0].bacSiId = bs-1 while viewing bs-2, with one request. A new queryFn does not trigger a fetch. TypeScript does not check this (an ESLint plugin can), so D is wrong too.|||VI: key là địa chỉ trong cache và là danh sách phụ thuộc. Cùng key ⇒ cùng mục, đã có dữ liệu ⇒ không request; test của bài ghi data[0].bacSiId = bs-1 khi đang xem bs-2, với đúng một request. queryFn mới không kích hoạt việc tải. TypeScript không kiểm điều này (một plugin ESLint thì có), nên D cũng sai.',
      },
      {
        question: 'A query uses the default staleTime. Its component unmounts and mounts again 20 seconds later. What does the user see?|||Một query dùng staleTime mặc định. Component của nó tháo ra rồi gắn lại sau 20 giây. Người dùng thấy gì?',
        options: [
          'A skeleton, because the cache was cleared on unmount|||Skeleton, vì cache đã bị xoá khi tháo',
          'The cached data, and no request is sent for 5 minutes|||Dữ liệu trong cache, và không có request nào trong 5 phút',
          'An error, because stale data cannot be displayed|||Lỗi, vì không được hiện dữ liệu cũ',
          'The cached data immediately, while a background refetch runs|||Dữ liệu trong cache ngay lập tức, trong lúc một lần tải nền chạy',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: default staleTime is 0, so the data is stale — but stale data is still shown at once; the new mount triggers a background refetch (measured: "Lần 2: 6 bác sĩ (đang làm mới)", 2 requests). Option B mixes up gcTime (5 minutes, memory) with staleTime (requests). The cache is not cleared on unmount — gcTime keeps it.|||VI: staleTime mặc định là 0 nên dữ liệu đã cũ — nhưng dữ liệu cũ vẫn được hiện ngay; lần gắn mới kích hoạt một lần tải nền (đo: "Lần 2: 6 bác sĩ (đang làm mới)", 2 request). Phương án B nhầm gcTime (5 phút, bộ nhớ) với staleTime (request). Cache không bị xoá khi tháo — gcTime giữ nó.',
      },
      {
        question: 'useKhungGio(null, "2026-10-01") has enabled: bacSiId !== null. Before a doctor is chosen, what are status and isLoading?|||useKhungGio(null, "2026-10-01") có enabled: bacSiId !== null. Trước khi chọn bác sĩ, status và isLoading là gì?',
        options: [
          'status "success", isLoading false — a disabled query is considered done|||status "success", isLoading false — query bị tắt được coi là xong',
          'status "pending", isLoading false — no data, but not fetching|||status "pending", isLoading false — chưa có dữ liệu, nhưng không đang tải',
          'status "pending", isLoading true — it waits for enabled|||status "pending", isLoading true — nó đang đợi enabled',
          'status "error", because the query function would crash on null|||status "error", vì hàm tải sẽ vỡ với null',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: status is about data (none yet ⇒ pending); fetchStatus is about the network (disabled ⇒ idle). isLoading = isPending && isFetching = false — measured: "status=pending fetchStatus=idle isPending=true isLoading=false · request: 0". A spinner driven by isPending would spin forever here; C is the common misunderstanding.|||VI: status nói về dữ liệu (chưa có ⇒ pending); fetchStatus nói về mạng (bị tắt ⇒ idle). isLoading = isPending && isFetching = false — đo được: "status=pending fetchStatus=idle isPending=true isLoading=false · request: 0". Vòng xoay theo isPending sẽ xoay mãi ở đây; C là cách hiểu sai phổ biến.',
      },
      {
        question: 'A patient chooses 14:00, fills the form, someone else books 14:00, the patient confirms and gets 409. Back at step 2, 14:00 is still shown as free. useDatLich invalidates the slots in onSuccess. What is the fix?|||Bệnh nhân chọn 14:00, điền form, người khác đặt mất 14:00, bệnh nhân xác nhận và nhận 409. Quay lại bước 2, 14:00 vẫn hiện còn trống. useDatLich invalidate khung giờ trong onSuccess. Sửa thế nào?',
        options: [
          'Set staleTime: 0 on the slot query so it always refetches|||Đặt staleTime: 0 cho query khung giờ để nó luôn tải lại',
          'Call window.location.reload() in onError|||Gọi window.location.reload() trong onError',
          'Invalidate in onSettled, so a failed booking refreshes the slots too|||Invalidate trong onSettled, để đặt lịch hỏng cũng làm mới khung giờ',
          'Retry the mutation until it succeeds|||Thử lại mutation cho tới khi thành công',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: a 409 means "your data is stale" — the strongest reason to refetch. onSuccess never runs on failure; onSettled runs on both. The chapter caught this with a real red test that turned green after the switch. staleTime: 0 is tempting but does not help: going back re-renders the same mounted query, and a stale query only refetches on mount/focus/reconnect or invalidation. Retrying a 409 books nothing.|||VI: 409 nghĩa là "dữ liệu của bạn đã cũ" — lý do mạnh nhất để tải lại. onSuccess không chạy khi hỏng; onSettled chạy ở cả hai kết cục. Chương bắt được lỗi này bằng một test đỏ thật và xanh lại sau khi đổi. staleTime: 0 nghe hấp dẫn nhưng không giúp: quay lại chỉ render lại query đang gắn, và query cũ chỉ tải lại khi gắn/focus/có mạng lại hoặc khi bị invalidate. Thử lại một lỗi 409 thì không đặt được gì.',
      },
      {
        question: 'An optimistic cancel skips await queryClient.cancelQueries(...) in onMutate. A refetch of ["lich-hen"] was already in flight when the user clicked "Huỷ". What does the user see?|||Một lần huỷ lạc quan bỏ qua await queryClient.cancelQueries(...) trong onMutate. Một lần tải lại ["lich-hen"] đang bay đúng lúc người dùng bấm "Huỷ". Người dùng thấy gì?',
        options: [
          '"Đã huỷ", then "Chờ xác nhận" when the old GET lands, then "Đã huỷ" again|||"Đã huỷ", rồi "Chờ xác nhận" khi GET cũ về tới, rồi lại "Đã huỷ"',
          '"Đã huỷ" immediately and nothing else — the in-flight GET is ignored|||"Đã huỷ" ngay và không gì khác — GET đang bay bị lờ đi',
          '"Chờ xác nhận" until the server answers, because onMutate waits for the GET|||"Chờ xác nhận" tới khi máy chủ trả lời, vì onMutate đợi GET',
          'An error toast, because two requests touched the same key|||Thông báo lỗi, vì hai request cùng đụng một key',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: measured: "0ms cho-xac-nhan → 22ms da-huy → 303ms cho-xac-nhan → 932ms da-huy" without cancelQueries, versus "→ 23ms da-huy" and nothing more with it. The GET read the database before the cancel and wrote the old list over the optimistic one. B is what happens only when you do cancel.|||VI: đo được: "0ms cho-xac-nhan → 22ms da-huy → 303ms cho-xac-nhan → 932ms da-huy" khi thiếu cancelQueries, so với "→ 23ms da-huy" rồi thôi khi có. GET đã đọc cơ sở dữ liệu trước lúc huỷ và ghi danh sách cũ đè lên bản lạc quan. B chỉ đúng khi bạn CÓ cancel.',
      },
      {
        question: 'onClick={async () => { await huy.mutateAsync(lh); dong(); }} — the server answers 500. Which statement is true?|||onClick={async () => { await huy.mutateAsync(lh); dong(); }} — máy chủ trả 500. Câu nào đúng?',
        options: [
          'dong() still runs, because mutateAsync never throws|||dong() vẫn chạy, vì mutateAsync không bao giờ ném',
          'The error is stored in huy.error and the Promise resolves with undefined|||Lỗi được cất vào huy.error và Promise xong với undefined',
          'mutate and mutateAsync behave the same; only the name differs|||mutate và mutateAsync hành xử như nhau; chỉ khác tên',
          'The Promise rejects: dong() is skipped and, without try/catch, it is an unhandled rejection|||Promise reject: dong() bị bỏ qua và, không có try/catch, đó là một rejection không ai bắt',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: mutateAsync returns a Promise that rejects on error (measured: "[mutateAsync] ném: …"), so the line after await never runs and the rejection escapes the handler. mutate does not throw — the error lands in mutation.error (measured: "[mutate] không ném"). B describes mutate, not mutateAsync — the tempting mix-up. The error is also stored in huy.error in both cases, but only mutateAsync throws.|||VI: mutateAsync trả Promise reject khi lỗi (đo: "[mutateAsync] ném: …"), nên dòng sau await không chạy và lỗi thoát khỏi hàm xử lý. mutate không ném — lỗi nằm trong mutation.error (đo: "[mutate] không ném"). B tả mutate chứ không phải mutateAsync — chỗ dễ nhầm. Lỗi cũng được cất trong huy.error ở cả hai trường hợp, nhưng chỉ mutateAsync ném.',
      },
      {
        question: 'With a plain new QueryClient() (library defaults), the doctor endpoint always returns 500. When does the error box appear?|||Với new QueryClient() trần (mặc định của thư viện), API bác sĩ luôn trả 500. Khi nào hộp lỗi hiện?',
        options: [
          'Immediately after the first 500|||Ngay sau lần 500 đầu tiên',
          'After about 7 seconds: 4 attempts, waiting 1 s, 2 s and 4 s between them|||Sau khoảng 7 giây: 4 lần gọi, đợi 1 s, 2 s và 4 s giữa chúng',
          'After 30 seconds, the maximum retry delay|||Sau 30 giây, khoảng đợi tối đa của retry',
          'Never — queries retry forever until they succeed|||Không bao giờ — query thử lại mãi tới khi thành công',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: default retry is 3 with exponential backoff (1 s, 2 s, 4 s, capped at 30 s). Measured: calls at 31, 1042, 3047, 7050 ms, error after the fourth; in Chromium the box appeared after 7492 ms. 30 s is only the cap on a single delay. That is also why tests set retry: false, and why the project skips retries for 4xx.|||VI: retry mặc định là 3 với khoảng đợi tăng gấp đôi (1 s, 2 s, 4 s, tối đa 30 s). Đo: gọi lúc 31, 1042, 3047, 7050 ms, lỗi sau lần thứ tư; trong Chromium hộp lỗi hiện sau 7492 ms. 30 s chỉ là trần của một lần đợi. Cũng vì vậy test đặt retry: false, và dự án không thử lại lỗi 4xx.',
      },
      {
        question: 'Each area of App is wrapped in <RanhGioiLoi>. Which of these errors does the boundary around KhuBacSi catch?|||Mỗi khu của App được bọc trong <RanhGioiLoi>. Ranh giới quanh KhuBacSi bắt được lỗi nào?',
        options: [
          'An error thrown inside the onClick handler of a "Xem chi tiết" button|||Lỗi ném ra trong hàm onClick của nút "Xem chi tiết"',
          'A rejected Promise from a fetch inside setTimeout|||Một Promise bị reject từ fetch trong setTimeout',
          'TheBacSi reading .slice of undefined while rendering|||TheBacSi đọc .slice của undefined lúc render',
          'An error thrown inside RanhGioiLoi’s own render method|||Lỗi ném ra trong chính phương thức render của RanhGioiLoi',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: boundaries catch errors thrown during rendering (and lifecycle methods) of the components below them — measured: "Cannot read properties of undefined (reading ’slice’)" became "Phần này gặp sự cố" while the next area kept working. Event handlers and async code run outside rendering, so A and B are not caught (show those errors yourself, or use throwOnError for queries). A boundary cannot catch its own error — that goes to the next boundary up.|||VI: ranh giới bắt lỗi ném ra lúc render (và trong phương thức vòng đời) của các component bên dưới — đo: "Cannot read properties of undefined (reading ’slice’)" thành "Phần này gặp sự cố" trong khi khu bên cạnh vẫn chạy. Event handler và code bất đồng bộ chạy ngoài lúc render, nên A và B không bị bắt (tự hiện các lỗi đó, hoặc dùng throwOnError cho query). Ranh giới không bắt được lỗi của chính nó — lỗi đó đi lên ranh giới phía trên.',
      },
    ],
  },
};


export default {
  title: 'Chapter 6 — Data fetching|||Chương 6 — Lấy dữ liệu',
  description: 'Lấy dữ liệu theo cách công ty làm: API giả bằng MSW cho cả trình duyệt lẫn test, vì sao fetch trong effect sinh cuộc đua (đo thật trong Chromium), TanStack Query với cache, query key, staleTime/gcTime và trạng thái, mutation có invalidate và cập nhật lạc quan, cùng các trạng thái đang tải, lỗi, rỗng, thử lại và ranh giới lỗi.',
  lessons: [L0, L1, L2, L3, L4, L5],
};
