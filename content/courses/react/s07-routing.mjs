import { gallery, slide } from './_slides.mjs';

/**
 * React — Chương 7: Định tuyến và cấu trúc (soạn 25/09/2026 từ khung).
 * GIỮ slug khung: rx-7-1-router · rx-7-2-layout · rx-7-3-cau-truc · rx-7-4-sang-nextjs (type LESSON).
 * Thêm rx-7-0-slides (DOCUMENT), rx-7-5-du-an (bài 🛠), rx-7-6-kiem-tra (QUIZ).
 * Mọi output trong bài chạy THẬT 25/09/2026 trên máy dựng bài: dự án thử SCRATCH/rx/du-an/ch07 (+ ch07-thu cho phép đo
 * trình duyệt, ch07-thu-dom cho lỗi trộn react-router-dom, ch07-next cho Next.js)
 * (react 19.3.0 · react-router 8.4.0 · vite 8.3.1 · vitest 5.0.1 · typescript 6.0.3 · @tanstack/react-query 5.103.2 ·
 *  zustand 5.0.15 · msw 2.15 · oxlint 1.85.0 · next 16.3.6 · Chromium qua Playwright).
 * Mã dài trong bài nằm ở hằng SN, output ở hằng OUT — sinh tự động từ chính các file/log đã chạy (tsc -b sạch, vitest xanh).
 * Deck: scripts/slides-src/rx-07.mjs (29 slide).
 */

const H = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '&#96;').replace(/\$\{/g, '&#36;{');
const pre = (lang, s) => '<pre><code class="language-' + lang + '">' + H(s) + '</code></pre>';
const out = (s) => '<div class="out">' + H(s) + '</div>';
const LINK = (href, ico, title, sub) => '<a class="link-card" href="' + href + '" target="_blank" rel="noopener"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';

/* ─── Mã trong bài: SINH TỰ ĐỘNG từ dự án thử ch07 (tsc -b sạch + vitest xanh 25/09/2026) — đừng sửa tay ─── */
const SN = {
  menu: "/** Thanh menu. Bài 7.1 còn phải đặt nó vào TỪNG trang — Bài 7.2 sẽ gom lại bằng layout. */\nexport function Menu() {\n  return (\n    <nav aria-label=\"Menu chính\">\n      <NavLink to=\"/\" end>\n        Trang chủ\n      </NavLink>{' '}\n      <NavLink to=\"/bac-si\">Đội ngũ bác sĩ</NavLink>{' '}\n      <NavLink to=\"/lich-hen\">Lịch hẹn</NavLink>\n    </nav>\n  );\n}",
  trangDanhSach: "export function TrangDanhSach() {\n  return (\n    <>\n      <Menu />\n      <h1>Đội ngũ bác sĩ</h1>\n      <ul>\n        {danhSachBacSi.map((bs) => (\n          <li key={bs.id}>\n            {/* to là CHUỖI đường dẫn — ghép id vào bằng template literal */}\n            <Link to={`/bac-si/${bs.id}`}>{bs.ten}</Link>\n          </li>\n        ))}\n      </ul>\n    </>\n  );\n}",
  trangChiTiet: "import { Link, useParams } from 'react-router';\nimport { ChiTietBacSi, useChiTietBacSi, useDatLichStore } from '@/features/bac-si';\nimport { ChonKhungGio } from '@/features/dat-lich';\nimport { LoiApi } from '@/shared/api/http';\nimport { duongDan } from '@/shared/duong-dan';\nimport { useTieuDeTrang } from '@/shared/hooks/useTieuDeTrang';\nimport { LoiTaiDuLieu } from '@/shared/ui/LoiTaiDuLieu';\n\n/** /bac-si/:id — TRANG ghép hai tính năng: hồ sơ bác sĩ (bac-si) + chọn giờ (dat-lich). */\nexport function TrangChiTietBacSi() {\n  const { id = '' } = useParams<'id'>(); // = '' : route này luôn có :id, nhưng kiểu vẫn là string | undefined\n  const { data: bacSi, isPending, error, refetch, isFetching } = useChiTietBacSi(id);\n  const yeuThich = useDatLichStore((s) => s.yeuThich);\n  const doiYeuThich = useDatLichStore((s) => s.doiYeuThich);\n  useTieuDeTrang(bacSi ? `${bacSi.ten} · Phòng khám An Tâm` : 'Phòng khám An Tâm');\n\n  const quayLai = (\n    <Link className=\"nut nut-lui\" to={duongDan.bacSi}>\n      ← Danh sách bác sĩ\n    </Link>\n  );\n\n  if (isPending) return <p aria-busy=\"true\">Đang tải thông tin bác sĩ…</p>;\n  if (error instanceof LoiApi && error.status === 404) {\n    return (\n      <section>\n        <h2>Không có bác sĩ này</h2>\n        <p>Đường dẫn có thể đã cũ hoặc gõ nhầm (“{id}”).</p>\n        {quayLai}\n      </section>\n    );\n  }\n  if (!bacSi) {\n    return <LoiTaiDuLieu tieuDe=\"Không tải được thông tin bác sĩ\" loi={error!} onThuLai={() => refetch()} dangThuLai={isFetching} />;\n  }\n  return (\n    <div className=\"trang-chi-tiet\">\n      {quayLai}\n      <ChiTietBacSi bacSi={bacSi} laYeuThich={yeuThich.includes(bacSi.id)} onDoiYeuThich={doiYeuThich} />\n      <ChonKhungGio bacSiId={bacSi.id} />\n    </div>\n  );\n}",
  nutDatLich: "/** Điều hướng BẰNG CODE: sau khi làm xong một việc (đặt lịch) thì chuyển trang. */\nexport function NutDatLich({ bacSiId }: { bacSiId: string }) {\n  const navigate = useNavigate();\n  return (\n    <button type=\"button\" onClick={() => navigate('/lich-hen', { state: { vuaDat: bacSiId } })}>\n      Đặt lịch\n    </button>\n  );\n}",
  routesBai1: "/** Bảng route của Bài 7.1: phẳng, mỗi URL một component. '*' khớp mọi thứ còn lại ⇒ trang 404. */\nexport const routesBai1: RouteObject[] = [\n  { path: '/', Component: TrangChu },\n  { path: '/bac-si', Component: TrangDanhSach },\n  { path: '/bac-si/:id', Component: TrangChiTiet },\n  { path: '/lich-hen', Component: TrangLichHen },\n  { path: '*', Component: TrangKhongThay },\n];",
  danhSachLoc: "export function TrangDanhSachLoc() {\n  const [sp, setSp] = useSearchParams(); // sp là URLSearchParams của URL hiện tại\n  const ck = sp.get('ck'); // null nếu URL không có ?ck=\n  const q = sp.get('q') ?? ''; // ?? : null/undefined thì lấy ''\n  const ds = danhSachBacSi.filter(\n    (bs) => (ck === null || bs.chuyenKhoa === ck) && bs.ten.toLowerCase().includes(q.toLowerCase()),\n  );\n\n  function datChuyenKhoa(moi: ChuyenKhoa | null) {\n    // Dạng hàm (prev) => …: sửa TỪ bản hiện tại, giữ nguyên ?q=\n    setSp((prev) => {\n      const p = new URLSearchParams(prev);\n      if (moi === null) p.delete('ck');\n      else p.set('ck', moi);\n      return p;\n    });\n  }\n\n  return (\n    <>\n      <div role=\"group\" aria-label=\"Chuyên khoa\">\n        <button type=\"button\" aria-pressed={ck === null} onClick={() => datChuyenKhoa(null)}>\n          Tất cả\n        </button>\n        {CAC_CHUYEN_KHOA.map((k) => (\n          <button key={k} type=\"button\" aria-pressed={ck === k} onClick={() => datChuyenKhoa(k)}>\n            {TEN_CHUYEN_KHOA[k]}\n          </button>\n        ))}\n      </div>\n      <label>\n        Tìm bác sĩ\n        <input\n          value={q}\n          onChange={(e) =>\n            // replace: true ⇒ gõ 5 phím KHÔNG sinh 5 mục lịch sử (Back không phải bấm 5 lần)\n            setSp(\n              (prev) => {\n                const p = new URLSearchParams(prev);\n                if (e.target.value === '') p.delete('q');\n                else p.set('q', e.target.value);\n                return p;\n              },\n              { replace: true },\n            )\n          }\n        />\n      </label>\n      <p>Tìm thấy {ds.length} bác sĩ</p>\n    </>\n  );\n}",
  veRouter: "/** Router trong BỘ NHỚ (không đụng thanh địa chỉ thật) — cách test route không cần trình duyệt. */\nfunction veRouter(routes: RouteObject[], url: string) {\n  const router = createMemoryRouter(routes, { initialEntries: [url] });\n  render(<RouterProvider router={router} />);\n  return router;\n}",
  testLink: "test('mở \"/\" rồi bấm Link ⇒ đổi trang, không tải lại', async () => {\n  const router = veRouter(routesBai1, '/');\n  expect(screen.getByRole('heading', { name: 'Phòng khám An Tâm' })).toBeInTheDocument();\n  await userEvent.click(screen.getByRole('link', { name: 'Xem đội ngũ bác sĩ →' }));\n  expect(screen.getByRole('heading', { name: 'Đội ngũ bác sĩ' })).toBeInTheDocument();\n  console.log('[7.1 link] pathname =', router.state.location.pathname, '· historyAction =', router.state.historyAction);\n});",
  testSearch: "test('useSearchParams: chip đẩy mục lịch sử, ô tìm thay mục hiện tại', async () => {\n  const router = veRouter([{ path: '/bac-si', Component: TrangDanhSachLoc }], '/bac-si');\n  expect(screen.getByText('Tìm thấy 6 bác sĩ')).toBeInTheDocument();\n\n  await userEvent.click(screen.getByRole('button', { name: 'Nhi' }));\n  console.log('[7.1 search] sau chip Nhi:', router.state.location.search, router.state.historyAction, '→', screen.getByText(/Tìm thấy/).textContent);\n\n  await userEvent.type(screen.getByLabelText('Tìm bác sĩ'), 'vy');\n  console.log('[7.1 search] sau gõ \"vy\":', decodeURIComponent(router.state.location.search), router.state.historyAction, '→', screen.getByText(/Tìm thấy/).textContent);\n\n  await act(() => router.navigate(-1)); // nút Back\n  console.log('[7.1 search] sau 1 lần Back:', router.state.location.search || '(rỗng)', '→', screen.getByText(/Tìm thấy/).textContent);\n  expect(screen.getByText('Tìm thấy 6 bác sĩ')).toBeInTheDocument();\n});",
  mainThu: "import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport { createBrowserRouter, Outlet } from 'react-router';\nimport { RouterProvider } from 'react-router/dom';\nimport { BoDem, TrangBacSi, TrangChiTiet, TrangChu } from './App';\nimport './index.css';\n\nfunction Khung() {\n  return (\n    <>\n      <BoDem />\n      <Outlet />\n    </>\n  );\n}\n\nconst router = createBrowserRouter([\n  {\n    Component: Khung,\n    children: [\n      { path: '/', Component: TrangChu },\n      { path: '/bac-si', Component: TrangBacSi },\n      { path: '/bac-si/:id', Component: TrangChiTiet },\n    ],\n  },\n]);\n\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <RouterProvider router={router} />\n  </StrictMode>,\n);",
  boDem: "/** Đếm số lần TẢI TRANG thật (tải lại HTML + JS) — sống trong sessionStorage nên không mất khi tải lại. */\nconst soLanTai = Number(sessionStorage.getItem('so-lan-tai') ?? '0') + 1;\nsessionStorage.setItem('so-lan-tai', String(soLanTai));\n\nexport function TrangChu() {\n  return (\n    <>\n      <Menu />\n      <h1>Phòng khám An Tâm</h1>\n      <p><Link to=\"/bac-si\">Sang /bac-si bằng &lt;Link&gt;</Link></p>\n      <p><a href=\"/bac-si\">Sang /bac-si bằng &lt;a href&gt;</a></p>\n    </>\n  );\n}",
  doLink: "req = [];\nawait p.getByRole('link', { name: 'Sang /bac-si bằng <Link>' }).click();\nawait p.getByRole('heading', { name: 'Đội ngũ bác sĩ' }).waitFor();\nawait p.waitForLoadState('networkidle');\nconsole.log('[sau <Link>] ', await doc(), '· request:', req.length, req.length ? JSON.stringify(req) : '');",
  tronDom: "import { render, screen } from '@testing-library/react';\nimport { createMemoryRouter } from 'react-router';\nimport { RouterProvider } from 'react-router/dom';\nimport { Link } from 'react-router-dom'; // ← bài trên mạng / FER202 viết vậy\nimport { expect, test } from 'vitest';\n\nfunction TrangChu() {\n  return <Link to=\"/bac-si\">Đội ngũ bác sĩ</Link>;\n}\n\ntest('trộn react-router-dom (v7) vào app dùng react-router (v8)', () => {\n  const router = createMemoryRouter([{ path: '/', Component: TrangChu }]);\n  render(<RouterProvider router={router} />);\n  expect(screen.getByRole('link')).toBeInTheDocument();\n});",
  loiUseParams: "import { useParams } from 'react-router';\nimport { danhSachBacSi } from '../src/du-lieu/bac-si';\n\nfunction timBacSi(id: string) {\n  return danhSachBacSi.find((bs) => bs.id === id);\n}\n\nexport function TrangChiTiet() {\n  const { id } = useParams<'id'>();\n  const bacSi = timBacSi(id); // ✗ id có thể là undefined\n  return <h1>{bacSi?.ten}</h1>;\n}",
  khungChinh: "export function KhungChinh() {\n  useEffect(() => {\n    demMount.khung++; // effect rỗng deps chạy MỘT lần mỗi lần mount\n  }, []);\n  return (\n    <>\n      <header>\n        <strong>Phòng khám An Tâm</strong>\n        <nav aria-label=\"Menu chính\">\n          <NavLink to=\"/\" end>\n            Trang chủ\n          </NavLink>{' '}\n          <NavLink to=\"/bac-si\">Bác sĩ</NavLink> <NavLink to=\"/lich-hen\">Lịch hẹn</NavLink>\n        </nav>\n      </header>\n      <main>\n        <Outlet />\n      </main>\n      <footer>© Phòng khám An Tâm</footer>\n    </>\n  );\n}",
  khungBacSi: "export function KhungBacSi() {\n  return (\n    <div className=\"hai-cot\">\n      <ul aria-label=\"Danh sách bác sĩ\">\n        {danhSachBacSi.map((bs) => (\n          <li key={bs.id}>\n            {/* đường dẫn TƯƠNG ĐỐI: \"bs-2\" nằm dưới route hiện tại ⇒ /bac-si/bs-2 */}\n            <NavLink to={bs.id}>{bs.ten}</NavLink>\n          </li>\n        ))}\n      </ul>\n      <section aria-label=\"Chi tiết\">\n        <Outlet />\n      </section>\n    </div>\n  );\n}",
  taiBacSi: "/** loader chạy TRƯỚC khi vẽ route. Không có bác sĩ ⇒ ném một \"response lỗi\" 404 cho ErrorBoundary gần nhất. */\nexport function taiBacSi({ params }: LoaderFunctionArgs) {\n  const bs = danhSachBacSi.find((b) => b.id === params.id);\n  if (!bs) throw data(`Không có bác sĩ ${params.id}`, { status: 404 });\n  return bs;\n}\n\nexport function ChiTietBacSi() {\n  const bs = useLoaderData<typeof taiBacSi>(); // kiểu suy ra từ loader: BacSi\n  return (\n    <article>\n      <h2>{bs.ten}</h2>\n      <p>\n        {TEN_CHUYEN_KHOA[bs.chuyenKhoa]} · {bs.namKinhNghiem} năm\n      </p>\n    </article>\n  );\n}",
  loiChiTiet: "/** ErrorBoundary của route: lỗi ở loader HOẶC lúc render của route này (và route con không có boundary riêng). */\nexport function LoiChiTiet() {\n  const loi = useRouteError(); // kiểu unknown — phải tự hỏi \"lỗi loại gì?\"\n  if (isRouteErrorResponse(loi)) {\n    return (\n      <p role=\"alert\">\n        {loi.status} — {String(loi.data)}\n      </p>\n    );\n  }\n  return <p role=\"alert\">Có lỗi: {loi instanceof Error ? loi.message : 'không rõ'}</p>;\n}",
  storeDangNhap: "interface DangNhapState {\n  nguoiDung: string | null;\n  dangNhap: (ten: string) => void;\n  dangXuat: () => void;\n}\nexport const useDangNhapStore = create<DangNhapState>()((set) => ({\n  nguoiDung: null,\n  dangNhap: (ten) => set({ nguoiDung: ten }),\n  dangXuat: () => set({ nguoiDung: null }),\n}));",
  yeuCau: "/** Cách 1 — component gác cổng (layout route không có path): chưa đăng nhập thì vẽ <Navigate>, rồi thì vẽ <Outlet>. */\nexport function YeuCauDangNhap({ thayThe = true }: { thayThe?: boolean }) {\n  const nguoiDung = useDangNhapStore((s) => s.nguoiDung);\n  const location = useLocation();\n  if (!nguoiDung) {\n    // replace: thay mục lịch sử \"/lich-hen\" bằng \"/dang-nhap\" ⇒ Back không đưa người dùng quay lại cổng bị chặn\n    return <Navigate to=\"/dang-nhap\" replace={thayThe} state={{ tu: location.pathname }} />;\n  }\n  return <Outlet />;\n}",
  trangDangNhap: "import { Navigate, useLocation } from 'react-router';\nimport { FormDangNhap, useDangNhapStore } from '@/features/dang-nhap';\nimport { duongDan } from '@/shared/duong-dan';\nimport { useTieuDeTrang } from '@/shared/hooks/useTieuDeTrang';\n\nexport function TrangDangNhap() {\n  const nguoiDung = useDangNhapStore((s) => s.nguoiDung);\n  const dangNhap = useDangNhapStore((s) => s.dangNhap);\n  // ?. : state có thể null (vào thẳng /dang-nhap) · ?? : không có thì về trang chủ\n  const tu = (useLocation().state as { tu?: string } | null)?.tu ?? duongDan.trangChu;\n  useTieuDeTrang('Đăng nhập · Phòng khám An Tâm');\n\n  // Đăng nhập xong store đổi ⇒ trang vẽ lại ⇒ nhánh này đưa người dùng về trang định vào.\n  // replace: Back không quay lại form đăng nhập. (Đã đăng nhập mà mở thẳng /dang-nhap cũng đi qua đây.)\n  if (nguoiDung) return <Navigate to={tu} replace />;\n  return (\n    <section className=\"trang-dang-nhap\">\n      <h2>Đăng nhập</h2>\n      <p>Đăng nhập để xem và huỷ lịch hẹn của bạn.</p>\n      <FormDangNhap onDangNhap={dangNhap} />\n    </section>\n  );\n}",
  canDangNhap: "/** Cách 2 — middleware (Data Mode): chạy TRƯỚC loader và trước khi vẽ. Ném redirect ⇒ không loader nào của nhánh chạy. */\nexport const canDangNhap: MiddlewareFunction = ({ request }) => {\n  if (!useDangNhapStore.getState().nguoiDung) {\n    const tu = new URL(request.url).pathname;\n    throw redirect(`/dang-nhap?tu=${encodeURIComponent(tu)}`);\n  }\n};",
  trang404: "export function TrangKhongThay() {\n  const { '*': phanCon } = useParams(); // route \"*\" đặt phần còn lại của URL vào params['*']\n  return (\n    <>\n      <h1>404 — Không có trang “/{phanCon}”</h1>\n      <Link to=\"/\">Về trang chủ</Link>\n    </>\n  );\n}",
  routesBai2: "/** Cây route đầy đủ của bài: một layout bọc tất cả, 404 nằm TRONG layout (vẫn có menu). */\nexport function taoRoutesBai2({ cachChan = 'component', thayThe = true }: { cachChan?: 'component' | 'middleware'; thayThe?: boolean } = {}): RouteObject[] {\n  const lichHen: RouteObject = { path: 'lich-hen', loader: taiLichHen, Component: TrangLichHen };\n  return [\n    {\n      path: '/',\n      Component: KhungChinh,\n      children: [\n        { index: true, Component: TrangChu },\n        {\n          path: 'bac-si',\n          Component: KhungBacSi,\n          children: [\n            { index: true, Component: ChuaChonBacSi },\n            { path: ':id', loader: taiBacSi, Component: ChiTietBacSi, ErrorBoundary: LoiChiTiet },\n          ],\n        },\n        cachChan === 'component'\n          ? { element: <YeuCauDangNhap thayThe={thayThe} />, children: [lichHen] }\n          : { middleware: [canDangNhap], children: [lichHen] },\n        { path: 'dang-nhap', element: <TrangDangNhap thayThe={thayThe} /> },\n        { path: '*', Component: TrangKhongThay },\n      ],\n    },\n  ];\n}",
  testBack: "for (const thayThe of [true, false]) {\n  test(`chặn bằng component, replace=${thayThe}: đăng nhập xong bấm Back mấy lần mới về trang chủ?`, async () => {\n    const router = veRouter('/', { thayThe });\n    await userEvent.click(await screen.findByRole('link', { name: 'Lịch hẹn' }));\n    expect(await screen.findByRole('heading', { name: 'Đăng nhập' })).toBeInTheDocument();\n    const buoc: string[] = [router.state.location.pathname];\n    await userEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }));\n    expect(await screen.findByRole('heading', { name: 'Lịch hẹn của tôi' })).toBeInTheDocument();\n    buoc.push(router.state.location.pathname);\n    let soLanBack = 0;\n    while (router.state.location.pathname !== '/' && soLanBack < 5) {\n      await act(() => router.navigate(-1));\n      soLanBack++;\n      buoc.push(`Back→${router.state.location.pathname}`);\n    }\n    console.log(`[7.2 chan replace=${thayThe}]`, buoc.join(' · '), `⇒ ${soLanBack} lần Back`);\n    expect(soLanBack).toBe(thayThe ? 1 : 3);\n  });\n}",
  nextLayout: "import Link from 'next/link';\nimport type { ReactNode } from 'react';\n\n// app/layout.tsx = layout GỐC: bọc MỌI trang (giống route cha có <Outlet /> của React Router).\nexport default function RootLayout({ children }: { children: ReactNode }) {\n  return (\n    <html lang=\"vi\">\n      <body>\n        <header>\n          <strong>Phòng khám An Tâm</strong>{' '}\n          <nav>\n            <Link href=\"/\">Trang chủ</Link> <Link href=\"/bac-si\">Bác sĩ</Link>\n          </nav>\n        </header>\n        <main>{children}</main>\n      </body>\n    </html>\n  );\n}",
  nextDanhSach: "import Link from 'next/link';\nimport { danhSachBacSi } from '../../du-lieu/bac-si';\n\n// Server Component (mặc định): chạy trên MÁY CHỦ lúc build/lúc có request, không gửi mã này xuống trình duyệt.\nexport default function TrangDanhSach() {\n  return (\n    <>\n      <h1>Đội ngũ bác sĩ</h1>\n      <ul>\n        {danhSachBacSi.map((bs) => (\n          <li key={bs.id}>\n            <Link href={`/bac-si/${bs.id}`}>{bs.ten}</Link>\n          </li>\n        ))}\n      </ul>\n    </>\n  );\n}",
  nextChiTiet: "import { notFound } from 'next/navigation';\nimport { danhSachBacSi } from '../../../du-lieu/bac-si';\nimport { TEN_CHUYEN_KHOA } from '../../../du-lieu/chuyen-khoa';\nimport { NutYeuThich } from './NutYeuThich';\n\n// Thư mục [id] = tham số động (như ':id' của React Router). Dựng sẵn 6 trang HTML lúc build:\nexport function generateStaticParams() {\n  return danhSachBacSi.map((bs) => ({ id: bs.id }));\n}\n\n// Next 15+: params là một Promise ⇒ component là async và phải await.\nexport default async function TrangChiTiet({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;\n  const bs = danhSachBacSi.find((b) => b.id === id);\n  if (!bs) notFound(); // → app/not-found.tsx, mã HTTP 404\n  return (\n    <article>\n      <h1>{bs.ten}</h1>\n      <p>\n        {TEN_CHUYEN_KHOA[bs.chuyenKhoa]} · {bs.namKinhNghiem} năm kinh nghiệm\n      </p>\n      <p>{bs.gioiThieu}</p>\n      <NutYeuThich />\n    </article>\n  );\n}",
  nextNut: "'use client'; // cần useState + onClick ⇒ Client Component: mã này MỚI được gửi xuống trình duyệt\n\nimport { useState } from 'react';\n\nexport function NutYeuThich() {\n  const [thich, setThich] = useState(false);\n  return (\n    <button type=\"button\" aria-pressed={thich} onClick={() => setThich((t) => !t)}>\n      {thich ? '♥ Đã yêu thích' : '♡ Yêu thích'}\n    </button>\n  );\n}",
  tsPaths: "// tsconfig.app.json (trích)\n  \"jsx\": \"react-jsx\",\n\n  /* Chương 7: \"@/…\" = \"src/…\" — import xuyên thư mục không còn chuỗi ../../../ */\n  \"paths\": { \"@/*\": [\"./src/*\"] },",
  viteConfig: "/// <reference types=\"vitest/config\" />\nimport react from '@vitejs/plugin-react'\nimport { defineConfig } from 'vite'\n\n// https://vite.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n  // Chương 7: đọc \"paths\" của tsconfig ⇒ \"@/…\" chạy ở dev server VÀ Vitest (build thì Rolldown tự đọc).\n  // Một nguồn duy nhất: alias khai ở tsconfig.app.json, không khai lần hai ở đây.\n  resolve: { tsconfigPaths: true },\n  test: {\n    environment: 'jsdom',\n    setupFiles: ['./src/test/setup.ts'],\n  },\n})",
  oxlint: "{\n  \"$schema\": \"./node_modules/oxlint/configuration_schema.json\",\n  \"plugins\": [\"react\", \"typescript\", \"oxc\", \"import\"],\n  \"rules\": {\n    \"react/rules-of-hooks\": \"error\",\n    \"react/only-export-components\": [\"warn\", { \"allowConstantExport\": true }],\n    \"import/no-cycle\": \"error\",\n    \"no-restricted-imports\": [\"error\", { \"patterns\": [\n      { \"group\": [\"../../**\"], \"message\": \"Lên hai cấp thư mục trở lên thì viết '@/…'.\" },\n      { \"group\": [\"@/features/*/**\"], \"message\": \"Chỉ đi qua cửa của tính năng: '@/features/<tên>' (index.ts).\" }\n    ] }]\n  },\n  \"overrides\": [\n    {\n      \"files\": [\"src/shared/**\"],\n      \"rules\": {\n        \"no-restricted-imports\": [\"error\", { \"patterns\": [\n          { \"group\": [\"../../**\"], \"message\": \"Lên hai cấp thư mục trở lên thì viết '@/…'.\" },\n          { \"group\": [\"@/features/*\", \"@/pages/*\", \"@/app/*\"], \"message\": \"shared/ là tầng dưới cùng: không import features/, pages/, app/.\" }\n        ] }]\n      }\n    },\n    {\n      \"files\": [\"src/features/**\"],\n      \"rules\": {\n        \"no-restricted-imports\": [\"error\", { \"patterns\": [\n          { \"group\": [\"../../**\"], \"message\": \"Lên hai cấp thư mục trở lên thì viết '@/…'.\" },\n          { \"group\": [\"@/features/*\", \"@/pages/*\", \"@/app/*\"], \"message\": \"Tính năng không import tính năng khác (hay pages/, app/). Ghép chúng ở pages/.\" }\n        ] }]\n      }\n    },\n    {\n      \"files\": [\"src/pages/**\"],\n      \"rules\": {\n        \"no-restricted-imports\": [\"error\", { \"patterns\": [\n          { \"group\": [\"../../**\"], \"message\": \"Lên hai cấp thư mục trở lên thì viết '@/…'.\" },\n          { \"group\": [\"@/features/*/**\"], \"message\": \"Chỉ đi qua cửa của tính năng: '@/features/<tên>' (index.ts).\" },\n          { \"group\": [\"@/app/*\"], \"message\": \"pages/ không import app/ (app/ mới là nơi ghép pages vào router).\" }\n        ] }]\n      }\n    }\n  ]\n}",
  duongDan: "/**\n * Mọi đường dẫn của app ở MỘT chỗ. Component viết duongDan.chiTietBacSi(id) thay vì tự ghép chuỗi\n * `/bac-si/${id}` ở mười nơi — đổi URL một ngày nào đó là sửa một file, và gõ sai tên là tsc báo.\n */\nexport const duongDan = {\n  trangChu: '/',\n  bacSi: '/bac-si',\n  chiTietBacSi: (id: string) => `/bac-si/${id}`,\n  /** khungGioId nằm trên đường dẫn; bác sĩ + ngày đi kèm trên ?… vì API tra khung giờ theo (bác sĩ, ngày). */\n  datLich: (khungGioId: string, bacSiId: string, ngay: string) =>\n    `/dat-lich/${khungGioId}?${new URLSearchParams({ bacSi: bacSiId, ngay })}`,\n  lichHen: '/lich-hen',\n  dangNhap: '/dang-nhap',\n};",
  indexBacSi: "/**\n * CỬA DUY NHẤT của tính năng \"bác sĩ\". Bên ngoài (pages/, app/) chỉ import từ '@/features/bac-si';\n * mọi file khác trong thư mục này là chi tiết bên trong, đổi tên/dời chỗ thoải mái (lint chặn import xuyên cửa).\n */\nexport { KhuBacSi } from './KhuBacSi';\nexport { ChiTietBacSi } from './components/ChiTietBacSi';\nexport { useBacSi } from './hooks/useBacSi';\nexport { useChiTietBacSi } from './hooks/useChiTietBacSi';\nexport { useDatLichStore } from './dat-lich-store';",
  indexDatLich: "/** CỬA DUY NHẤT của tính năng \"đặt lịch\": chọn giờ, form bệnh nhân, gửi yêu cầu. */\nexport { ChonKhungGio } from './ChonKhungGio';\nexport { docNgay } from './doc-ngay';\nexport { FormDatLich } from './FormDatLich';\nexport { useKhungGio } from './useKhungGio';\nexport { useDatLich } from './useDatLich';\nexport { datLichSchema, type DatLich } from './schema'; // máy chủ giả (src/mocks) kiểm lại bằng CHÍNH schema của form",
  danhSachLichHenProps: "interface DanhSachLichHenProps {\n  /** Chương 7: tên bác sĩ do TRANG truyền vào — tính năng lịch hẹn không import tính năng bác sĩ. */\n  tenBacSi: (bacSiId: string) => string;\n}",
  trangLichHen: "import { useLocation } from 'react-router';\nimport { useBacSi } from '@/features/bac-si';\nimport { DanhSachLichHen } from '@/features/lich-hen';\nimport { useTieuDeTrang } from '@/shared/hooks/useTieuDeTrang';\n\n/** /lich-hen — nằm SAU cổng YeuCauDangNhap (xem app/router.tsx). */\nexport function TrangLichHen() {\n  const { data: bacSi } = useBacSi();\n  const vuaDat = (useLocation().state as { vuaDat?: string } | null)?.vuaDat; // do TrangDatLich gửi qua navigate(…, { state })\n  useTieuDeTrang('Lịch hẹn của tôi · Phòng khám An Tâm');\n  const tenBacSi = (id: string) => bacSi?.find((b) => b.id === id)?.ten ?? id;\n  return (\n    <>\n      {vuaDat && (\n        <p className=\"gui-xong\" role=\"status\">\n          Đã gửi yêu cầu đặt lịch. Mã lịch hẹn: {vuaDat}. Phòng khám sẽ gọi lại để xác nhận.\n        </p>\n      )}\n      <DanhSachLichHen tenBacSi={tenBacSi} />\n    </>\n  );\n}",
  routerTsx: "import type { RouteObject } from 'react-router';\nimport { YeuCauDangNhap } from '@/features/dang-nhap';\nimport { Trang404 } from '@/pages/Trang404';\nimport { TrangChiTietBacSi } from '@/pages/TrangChiTietBacSi';\nimport { TrangChu } from '@/pages/TrangChu';\nimport { TrangDangNhap } from '@/pages/TrangDangNhap';\nimport { TrangDanhSachBacSi } from '@/pages/TrangDanhSachBacSi';\nimport { TrangDatLich } from '@/pages/TrangDatLich';\nimport { TrangLichHen } from '@/pages/TrangLichHen';\nimport { KhungTrang } from './KhungTrang';\nimport { TrangLoi } from './TrangLoi';\n\n/**\n * Bảng route của cả app — MỘT chỗ nhìn ra mọi URL. Là dữ liệu thường nên test dùng lại được\n * (createMemoryRouter(routes, …) trong src/test/render.tsx), còn main.tsx dùng createBrowserRouter(routes).\n */\nexport const routes: RouteObject[] = [\n  {\n    path: '/',\n    Component: KhungTrang, // header + menu + <Outlet /> + footer: vẽ MỘT lần\n    ErrorBoundary: TrangLoi, // lỗi lúc render ở bất kỳ trang nào ⇒ vẫn còn khung, không trắng màn hình\n    children: [\n      { index: true, Component: TrangChu },\n      { path: 'bac-si', Component: TrangDanhSachBacSi },\n      { path: 'bac-si/:id', Component: TrangChiTietBacSi },\n      {\n        Component: YeuCauDangNhap, // layout KHÔNG path: cổng cho mọi trang con bên trong\n        children: [\n          { path: 'dat-lich/:khungGioId', Component: TrangDatLich }, // đặt lịch = lịch hẹn của AI ⇒ cần đăng nhập\n          { path: 'lich-hen', Component: TrangLichHen },\n        ],\n      },\n      { path: 'dang-nhap', Component: TrangDangNhap }, // NGOÀI cổng — trong cổng là màn hình trắng (Bài 7.2)\n      { path: '*', Component: Trang404 },\n    ],\n  },\n];",
  khungTrang: "import { Outlet, ScrollRestoration } from 'react-router';\nimport { RanhGioiLoi } from '@/shared/ui/RanhGioiLoi';\nimport { VungThongBao } from '@/shared/ui/VungThongBao';\nimport { Footer } from './Footer';\nimport { Header } from './Header';\n\n/** Layout gốc: mọi trang vẽ vào <Outlet />. */\nexport function KhungTrang() {\n  return (\n    <>\n      <Header />\n      <main className=\"noi-dung\">\n        <RanhGioiLoi>\n          <Outlet />\n        </RanhGioiLoi>\n      </main>\n      <Footer />\n      <VungThongBao />\n      <ScrollRestoration /> {/* sang trang mới thì cuộn lên đầu; Back thì về đúng chỗ cũ */}\n    </>\n  );\n}",
  headerNav: "<nav className=\"menu\" aria-label=\"Menu chính\">\n  <NavLink to={duongDan.trangChu} end>\n    Trang chủ\n  </NavLink>\n  <NavLink to={duongDan.bacSi}>Bác sĩ</NavLink>\n  <NavLink to={duongDan.lichHen}>\n    Lịch hẹn của tôi{nguoiDung && <span className=\"huy-hieu\" aria-label=\"Số lịch hẹn\">{soLichHen ?? '…'}</span>}\n  </NavLink>\n</nav>",
  headerDangXuat: "onClick={async () => {\n  // RỜI trang trước, xoá đăng nhập SAU. Làm ngược lại: store đổi ⇒ cổng của /lich-hen (vẫn đang\n  // trên màn hình) vẽ lại và đẩy sang /dang-nhap trước — đo ở Bài 7.5. navigate() trả Promise từ React Router 7.\n  await navigate(duongDan.trangChu, { replace: true });\n  dangXuat();\n}}",
  trangLoi: "import { isRouteErrorResponse, Link, useRouteError } from 'react-router';\nimport { duongDan } from '@/shared/duong-dan';\n\n/** ErrorBoundary của route gốc: lỗi không ai bắt ở dưới thì tới đây — thay cho \"Unexpected Application Error!\". */\nexport function TrangLoi() {\n  const loi = useRouteError(); // unknown: phải tự hỏi \"lỗi loại gì?\"\n  const thongDiep = isRouteErrorResponse(loi)\n    ? `${loi.status} — ${loi.statusText}`\n    : loi instanceof Error\n      ? loi.message\n      : 'Lỗi không rõ';\n  return (\n    <main className=\"noi-dung\" role=\"alert\">\n      <h2>Có lỗi xảy ra</h2>\n      <p>{thongDiep}</p>\n      <Link to={duongDan.trangChu}>Về trang chủ</Link>\n    </main>\n  );\n}",
  mainTsx: "import { QueryClientProvider } from '@tanstack/react-query';\nimport { ReactQueryDevtools } from '@tanstack/react-query-devtools';\nimport { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport { createBrowserRouter } from 'react-router';\nimport { RouterProvider } from 'react-router/dom';\nimport './app/app.css';\nimport { taoQueryClient } from './app/query-client';\nimport { routes } from './app/router';\nimport './index.css';\n\nconst queryClient = taoQueryClient(); // MỘT client cho cả app, tạo NGOÀI component (không tạo lại mỗi lần render)\nconst router = createBrowserRouter(routes); // Chương 7: cũng vậy — router tạo MỘT lần, ngoài cây React\n\n/** App này chưa có máy chủ thật (tới Chương 14) ⇒ luôn bật API giả. Dự án có backend: chỉ bật khi dev. */\nasync function batApiGia() {\n  const { worker } = await import('./mocks/browser'); // import động: mã MSW tách ra file riêng\n  await worker.start({ onUnhandledRequest: 'bypass', quiet: true });\n}\n\nbatApiGia().then(() => {\n  createRoot(document.getElementById('root')!).render(\n    <StrictMode>\n      <QueryClientProvider client={queryClient}>\n        <RouterProvider router={router} />\n        <ReactQueryDevtools initialIsOpen={false} /> {/* chỉ có mặt khi dev; build production tự bỏ */}\n      </QueryClientProvider>\n    </StrictMode>,\n  );\n});",
  yeuCauDangNhap: "import { Navigate, Outlet, useLocation } from 'react-router';\nimport { duongDan } from '@/shared/duong-dan';\nimport { useDangNhapStore } from './dang-nhap-store';\n\n/**\n * Layout route KHÔNG path, bọc các trang cần đăng nhập. Chưa đăng nhập ⇒ sang /dang-nhap, mang theo\n * \"trang định vào\" (cả ?… lẫn #…) để đăng nhập xong quay lại đúng chỗ. replace: Back không quay về cổng bị chặn.\n * Chỉ là TRẢI NGHIỆM — API thật phải tự từ chối request thiếu token (Chương 14).\n */\nexport function YeuCauDangNhap() {\n  const nguoiDung = useDangNhapStore((s) => s.nguoiDung);\n  const { pathname, search, hash } = useLocation();\n  if (!nguoiDung) {\n    return <Navigate to={duongDan.dangNhap} replace state={{ tu: pathname + search + hash }} />;\n  }\n  return <Outlet />;\n}",
  dangNhapStore: "/**\n * Đăng nhập GIẢ LẬP của Chương 7: chỉ nhớ \"ai đang dùng máy\" để có trang cần đăng nhập mà chặn.\n * Chưa có mật khẩu, chưa có token — Chương 14 làm đăng nhập thật (POST /api/dang-nhap).\n * persist: F5 ở /lich-hen không bị đá ra trang đăng nhập.\n */\nexport const useDangNhapStore = create<DangNhapState>()(\n  persist(\n    (set) => ({\n      nguoiDung: null,\n      dangNhap: (nd) => set({ nguoiDung: nd }),\n      dangXuat: () => set({ nguoiDung: null }),\n    }),\n    {\n      name: 'phong-kham-dang-nhap',\n      storage: createJSONStorage(() => localStorage),\n      partialize: (s) => ({ nguoiDung: s.nguoiDung }),\n      version: 1,\n    },\n  ),\n);",
  useBoLocUrl: "import { useSearchParams } from 'react-router';\nimport { docBoLoc, taoSearch, type BoLoc } from '../logic/bo-loc-url';\n\n/**\n * Bộ lọc danh sách bác sĩ trên URL (?ck=…&q=…). Chương 5 tự viết bằng pushState + popstate;\n * Chương 7 giao phần \"ống nước\" cho useSearchParams của React Router. Phần KIỂM (docBoLoc) ở lại:\n * URL là thứ người dùng gõ tay được.\n */\nexport function useBoLocUrl() {\n  const [sp, setSp] = useSearchParams();\n  const boLoc = docBoLoc(sp.toString());\n\n  /** cach 'push': thêm một mục lịch sử (Back quay lại được) · 'replace': sửa mục hiện tại (hợp khi gõ phím). */\n  function datBoLoc(moi: Partial<BoLoc>, cach: 'push' | 'replace' = 'push') {\n    setSp(new URLSearchParams(taoSearch({ ...boLoc, ...moi })), { replace: cach === 'replace' });\n  }\n\n  return [boLoc, datBoLoc] as const;\n}",
  theBacSiLink: "{coLienKet && (\n  <Link className=\"nut nut-chinh\" to={duongDan.chiTietBacSi(bacSi.id)} aria-label={`Xem chi tiết ${bacSi.ten}`}>\n    Xem chi tiết\n  </Link>\n)}",
  chonKhungGio: "import { Link, useSearchParams } from 'react-router';\nimport { duongDan } from '@/shared/duong-dan';\nimport { hienGio, hienNgay, NGAY_KHAM } from '@/shared/logic/thoi-gian';\nimport { LuoiGioKhung } from '@/shared/ui/KhungXuong';\nimport { LoiTaiDuLieu } from '@/shared/ui/LoiTaiDuLieu';\nimport { docNgay } from './doc-ngay';\nimport { useKhungGio } from './useKhungGio';\n\n/**\n * Bước \"chọn giờ\" của luồng đặt lịch. Chương 5 giữ ngày và khung giờ trong reducer; Chương 7 đưa NGÀY lên URL\n * (?ngay=…, replace — đổi ngày không đẻ lịch sử) và mỗi khung còn trống là một LINK sang /dat-lich/:khungGioId.\n */\nexport function ChonKhungGio({ bacSiId }: { bacSiId: string }) {\n  const [sp, setSp] = useSearchParams();\n  const ngay = docNgay(sp);\n  const khungGioQ = useKhungGio(bacSiId, ngay);\n\n  return (\n    <section className=\"chon-gio\" aria-label=\"Chọn giờ khám\">\n      <h3>Chọn giờ khám</h3>\n      <div className=\"chip-hang\" role=\"group\" aria-label=\"Chọn ngày\">\n        {NGAY_KHAM.map((n) => (\n          <button\n            key={n}\n            type=\"button\"\n            className=\"chip\"\n            aria-pressed={n === ngay}\n            onClick={() => setSp({ ngay: n }, { replace: true })}\n          >\n            {hienNgay(n)}\n          </button>\n        ))}\n      </div>\n      {khungGioQ.isPending ? (\n        <LuoiGioKhung />\n      ) : khungGioQ.isError && !khungGioQ.data ? (\n        <LoiTaiDuLieu\n          tieuDe=\"Không tải được giờ khám\"\n          loi={khungGioQ.error}\n          onThuLai={() => khungGioQ.refetch()}\n          dangThuLai={khungGioQ.isFetching}\n        />\n      ) : (\n        <ul className=\"lua-chon\" aria-busy={khungGioQ.isPlaceholderData} style={{ opacity: khungGioQ.isPlaceholderData ? 0.5 : 1 }}>\n          {khungGioQ.data?.map((kg) => (\n            <li key={kg.id}>\n              {kg.conTrong && !khungGioQ.isPlaceholderData ? (\n                <Link className=\"nut\" to={duongDan.datLich(kg.id, bacSiId, ngay)}>\n                  {hienGio(kg.batDau)}\n                </Link>\n              ) : (\n                <span className=\"nut kin\" aria-disabled=\"true\">\n                  {hienGio(kg.batDau)} (kín)\n                </span>\n              )}\n            </li>\n          ))}\n        </ul>\n      )}\n    </section>\n  );\n}",
  docNgay: "import { NGAY_KHAM } from '@/shared/logic/thoi-gian';\n\n/** '?ngay=2026-10-02' → '2026-10-02' nếu là một ngày khám; lạ/thiếu ⇒ ngày đầu tiên. URL là dữ liệu người dùng gõ được. */\nexport function docNgay(sp: URLSearchParams): string {\n  const ngay = sp.get('ngay');\n  return ngay !== null && NGAY_KHAM.includes(ngay) ? ngay : NGAY_KHAM[0];\n}",
  trangDatLich: "import { Link, useNavigate, useParams, useSearchParams } from 'react-router';\nimport { useBacSi } from '@/features/bac-si';\nimport { docNgay, FormDatLich, useDatLich, useKhungGio, type DatLich } from '@/features/dat-lich';\nimport { duongDan } from '@/shared/duong-dan';\nimport { useTieuDeTrang } from '@/shared/hooks/useTieuDeTrang';\nimport { hienGio } from '@/shared/logic/thoi-gian';\n\n/**\n * /dat-lich/:khungGioId?bacSi=bs-2&ngay=2026-10-01 — bước điền thông tin. Mọi thứ trang cần đều nằm trên URL\n * ⇒ F5, Back, gửi link cho người nhà đều ra đúng khung giờ này (Chương 5 thì mất hết khi F5).\n */\nexport function TrangDatLich() {\n  const { khungGioId = '' } = useParams<'khungGioId'>();\n  const [sp] = useSearchParams();\n  const bacSiId = sp.get('bacSi') ?? '';\n  const ngay = docNgay(sp);\n  const navigate = useNavigate();\n  const bacSiQ = useBacSi();\n  const khungGioQ = useKhungGio(bacSiId || null, ngay);\n  const datLich = useDatLich();\n  useTieuDeTrang('Đặt lịch · Phòng khám An Tâm');\n\n  const bacSi = bacSiQ.data?.find((bs) => bs.id === bacSiId);\n  const khungGio = khungGioQ.data?.find((kg) => kg.id === khungGioId);\n\n  if (bacSiQ.isPending || (bacSiId && khungGioQ.isPending)) return <p aria-busy=\"true\">Đang tải khung giờ…</p>;\n  if (!bacSi || !khungGio) {\n    return (\n      <section>\n        <h2>Không tìm thấy khung giờ này</h2>\n        <Link to={duongDan.bacSi}>← Chọn lại bác sĩ</Link>\n      </section>\n    );\n  }\n  if (!khungGio.conTrong && !datLich.isPending) {\n    return (\n      <section>\n        <h2>Khung giờ {hienGio(khungGio.batDau)} đã có người đặt</h2>\n        <Link to={duongDan.chiTietBacSi(bacSi.id) + `?ngay=${ngay}`}>← Chọn giờ khác</Link>\n      </section>\n    );\n  }\n\n  async function gui(thongTin: DatLich) {\n    const lichHen = await datLich.mutateAsync({ ...thongTin, bacSiId, khungGioId }); // lỗi ⇒ ném ⇒ form hiện ở đầu\n    // replace: Back từ \"Lịch hẹn của tôi\" không quay về một form đã gửi rồi\n    navigate(duongDan.lichHen, { replace: true, state: { vuaDat: lichHen.id } });\n  }\n\n  return (\n    <section className=\"trang-dat-lich\">\n      <h2>Đặt lịch khám</h2>\n      <dl className=\"tom-tat\">\n        <dt>Bác sĩ</dt>\n        <dd>{bacSi.ten}</dd>\n        <dt>Giờ khám</dt>\n        <dd>{hienGio(khungGio.batDau)}</dd>\n      </dl>\n      <FormDatLich bacSi={bacSi} onGui={gui} nhanNut=\"Xác nhận đặt lịch\" />\n    </section>\n  );\n}",
  renderTs: "/** Chương 7: vẽ CẢ APP (đúng bảng route thật) ở một URL — test đi từ trang này sang trang khác như người dùng. */\nexport function veTrang(url: string, queryClient = taoClientTest()) {\n  const router = createMemoryRouter(routes, { initialEntries: [url] });\n  const kq = render(\n    <QueryClientProvider client={queryClient}>\n      <RouterProvider router={router} />\n    </QueryClientProvider>,\n  );\n  return { ...kq, router, queryClient };\n}",
  renderVoiRouter: "/**\n * Chương 7: vẽ MỘT component có Link/useSearchParams bên trong một router bộ nhớ (component có Link mà\n * không có router ⇒ lỗi). url: URL bắt đầu, vd '/bac-si?ck=nhi'.\n */\nexport function renderVoiRouter(ui: ReactNode, url = '/', queryClient = taoClientTest()) {\n  const router = createMemoryRouter([{ path: '*', element: ui }], { initialEntries: [url] });\n  const kq = render(\n    <QueryClientProvider client={queryClient}>\n      <RouterProvider router={router} />\n    </QueryClientProvider>,\n  );\n  return { ...kq, router, queryClient };\n}",
  setupDong: "useDangNhapStore.setState(useDangNhapStore.getInitialState(), true); // Chương 7: đăng nhập giả",
  testLuong: "test('đặt lịch trọn luồng qua URL: /bac-si/bs-2 → /dat-lich/:khungGioId → /lich-hen', async () => {\n  useDangNhapStore.setState({ nguoiDung: ANH });\n  const user = userEvent.setup();\n  const { router } = veTrang('/bac-si/bs-2');\n  await user.click(await screen.findByRole('link', { name: '14:00 · 01/10/2026' }));\n  expect(router.state.location.pathname).toBe('/dat-lich/bs-2-2026-10-01-1400');\n  expect(router.state.location.search).toBe('?bacSi=bs-2&ngay=2026-10-01');\n  expect(await screen.findByRole('heading', { name: 'Đặt lịch khám' })).toBeInTheDocument();\n\n  await user.type(screen.getByLabelText('Họ và tên'), ANH.hoTen);\n  await user.type(screen.getByLabelText('Số điện thoại'), ANH.soDienThoai);\n  await user.type(screen.getByLabelText('Ngày sinh'), '1995-03-14');\n  await user.type(screen.getByLabelText('Lý do khám'), 'Bé ho khan 3 ngày');\n  await user.click(screen.getByRole('button', { name: 'Xác nhận đặt lịch' }));\n\n  expect(await screen.findByText(/Mã lịch hẹn: lh-1/)).toBeInTheDocument();\n  expect(router.state.location.pathname).toBe('/lich-hen');\n  expect(router.state.historyAction).toBe('REPLACE'); // Back không quay về form đã gửi\n  expect(await screen.findByText('BS. Trần Thu Hà')).toBeInTheDocument();\n  expect(db.lichHen()).toHaveLength(1);\n});",
  testDangNhap: "test('/lich-hen chưa đăng nhập ⇒ /dang-nhap; đăng nhập xong ⇒ quay lại /lich-hen, Back 1 lần về trang chủ', async () => {\n  const user = userEvent.setup();\n  const { router } = veTrang('/');\n  await user.click(screen.getByRole('link', { name: 'Lịch hẹn của tôi' }));\n  expect(await screen.findByRole('heading', { name: 'Đăng nhập' })).toBeInTheDocument();\n  expect(router.state.historyAction).toBe('REPLACE');\n  await user.type(screen.getByLabelText('Họ và tên'), ANH.hoTen);\n  await user.type(screen.getByLabelText('Số điện thoại'), ANH.soDienThoai);\n  await user.click(screen.getByRole('button', { name: 'Đăng nhập' }));\n  expect(await screen.findByRole('heading', { name: /^Lịch hẹn của tôi/ })).toBeInTheDocument();\n  expect(router.state.location.pathname).toBe('/lich-hen');\n  await act(() => router.navigate(-1));\n  expect(router.state.location.pathname).toBe('/');\n});",
  testQuayLai: "test('chưa đăng nhập bấm một khung giờ ⇒ đăng nhập ⇒ quay lại ĐÚNG /dat-lich/…?bacSi=…&ngay=…', async () => {\n  const user = userEvent.setup();\n  const { router } = veTrang('/bac-si/bs-4?ngay=2026-10-02');\n  await user.click(await screen.findByRole('link', { name: '08:00 · 02/10/2026' }));\n  expect(await screen.findByRole('heading', { name: 'Đăng nhập' })).toBeInTheDocument();\n  await user.type(screen.getByLabelText('Họ và tên'), ANH.hoTen);\n  await user.type(screen.getByLabelText('Số điện thoại'), ANH.soDienThoai);\n  await user.click(screen.getByRole('button', { name: 'Đăng nhập' }));\n  expect(await screen.findByRole('heading', { name: 'Đặt lịch khám' })).toBeInTheDocument();\n  expect(router.state.location.pathname + router.state.location.search).toBe('/dat-lich/bs-4-2026-10-02-0800?bacSi=bs-4&ngay=2026-10-02');\n});",
  testDangXuat: "test('đăng xuất ở /lich-hen ⇒ về trang chủ (REPLACE), mở lại /lich-hen ⇒ trang đăng nhập', async () => {\n  useDangNhapStore.setState({ nguoiDung: ANH });\n  const user = userEvent.setup();\n  const { router } = veTrang('/lich-hen');\n  await screen.findByRole('heading', { name: /^Lịch hẹn của tôi/ });\n  await user.click(screen.getByRole('button', { name: 'Đăng xuất' }));\n  await waitFor(() => expect(router.state.location.pathname).toBe('/'));\n  expect(router.state.historyAction).toBe('REPLACE');\n  await act(() => router.navigate('/lich-hen'));\n  expect(await screen.findByRole('heading', { name: 'Đăng nhập' })).toBeInTheDocument();\n});",
  headerSai: "onClick={() => {\n  dangXuat();\n  navigate(duongDan.trangChu, { replace: true });\n}}",
  vongSchema: "// src/features/lich-hen/schema.ts (thử rồi GỠ)\nimport { z } from 'zod';\nimport { benhNhanSchema } from '@/features/dat-lich';\n\nexport const lichHenSchema = z.object({ id: z.string(), benhNhan: benhNhanSchema });\n\n// src/features/dat-lich/useDatLich.ts (thêm một dòng)\nimport { useLichHen } from '@/features/lich-hen';\n\n// src/features/dat-lich/index.ts (xếp A→Z: useDatLich lên đầu)\nexport { useDatLich } from './useDatLich';\n…\nexport { benhNhanSchema, datLichSchema, type DatLich } from './schema';",
  fDangNhapStore: "import { create } from 'zustand';\nimport { createJSONStorage, persist } from 'zustand/middleware';\n\nexport interface NguoiDung {\n  hoTen: string;\n  soDienThoai: string;\n}\n\ninterface DangNhapState {\n  nguoiDung: NguoiDung | null;\n  dangNhap: (nd: NguoiDung) => void;\n  dangXuat: () => void;\n}\n\n/**\n * Đăng nhập GIẢ LẬP của Chương 7: chỉ nhớ \"ai đang dùng máy\" để có trang cần đăng nhập mà chặn.\n * Chưa có mật khẩu, chưa có token — Chương 14 làm đăng nhập thật (POST /api/dang-nhap).\n * persist: F5 ở /lich-hen không bị đá ra trang đăng nhập.\n */\nexport const useDangNhapStore = create<DangNhapState>()(\n  persist(\n    (set) => ({\n      nguoiDung: null,\n      dangNhap: (nd) => set({ nguoiDung: nd }),\n      dangXuat: () => set({ nguoiDung: null }),\n    }),\n    {\n      name: 'phong-kham-dang-nhap',\n      storage: createJSONStorage(() => localStorage),\n      partialize: (s) => ({ nguoiDung: s.nguoiDung }),\n      version: 1,\n    },\n  ),\n);",
  fFormDangNhap: "import { useState, type SubmitEvent } from 'react';\nimport type { NguoiDung } from './dang-nhap-store';\n\n/** Form đăng nhập giả lập: họ tên + số điện thoại, kiểm tối thiểu (Chương 14 thay bằng đăng nhập thật). */\nexport function FormDangNhap({ onDangNhap }: { onDangNhap: (nd: NguoiDung) => void }) {\n  const [hoTen, setHoTen] = useState('');\n  const [soDienThoai, setSoDienThoai] = useState('');\n  const [loi, setLoi] = useState<string | null>(null);\n\n  function gui(ev: SubmitEvent<HTMLFormElement>) {\n    ev.preventDefault();\n    const sdt = soDienThoai.replace(/[\\s.-]/g, '');\n    if (hoTen.trim().length < 2 || !/^0\\d{9}$/.test(sdt)) {\n      setLoi('Nhập họ tên và số điện thoại 10 số.');\n      return;\n    }\n    onDangNhap({ hoTen: hoTen.trim(), soDienThoai: sdt });\n  }\n\n  return (\n    <form className=\"form-dat-lich\" onSubmit={gui} noValidate aria-label=\"Đăng nhập\">\n      {loi && (\n        <p className=\"loi-chung\" role=\"alert\">\n          {loi}\n        </p>\n      )}\n      <label htmlFor=\"dn-hoTen\">Họ và tên</label>\n      <input id=\"dn-hoTen\" autoComplete=\"name\" value={hoTen} onChange={(e) => setHoTen(e.target.value)} />\n      <label htmlFor=\"dn-sdt\">Số điện thoại</label>\n      <input id=\"dn-sdt\" type=\"tel\" autoComplete=\"tel\" value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)} />\n      <button type=\"submit\" className=\"nut nut-chinh\">\n        Đăng nhập\n      </button>\n    </form>\n  );\n}",
  fIndexDangNhap: "/** CỬA DUY NHẤT của tính năng \"đăng nhập\" (giả lập tới Chương 14). */\nexport { useDangNhapStore, type NguoiDung } from './dang-nhap-store';\nexport { FormDangNhap } from './FormDangNhap';\nexport { YeuCauDangNhap } from './YeuCauDangNhap';",
  fIndexLichHen: "/** CỬA DUY NHẤT của tính năng \"lịch hẹn của tôi\". */\nexport { DanhSachLichHen } from './DanhSachLichHen';\nexport { useHuyLichHen, useLichHen } from './useLichHen';",
  fUseLichHen: "/** Chương 7: `batDau` = false khi chưa đăng nhập (Header không gọi API lịch hẹn cho người lạ). */\nexport function useLichHen({ batDau = true }: { batDau?: boolean } = {}) {\n  return useQuery({\n    queryKey: khoa.lichHen,\n    queryFn: ({ signal }) => api.lichHen(signal),\n    enabled: batDau,\n  });\n}",
  fDanhSachLichHen: "import { hienGio } from '@/shared/logic/thoi-gian';\nimport { LoiTaiDuLieu } from '@/shared/ui/LoiTaiDuLieu';\nimport type { TrangThaiLichHen } from '@/types';\nimport { useHuyLichHen, useLichHen } from './useLichHen';\n\nconst TEN_TRANG_THAI: Record<TrangThaiLichHen, string> = {\n  'cho-xac-nhan': 'Chờ xác nhận',\n  'da-xac-nhan': 'Đã xác nhận',\n  'da-huy': 'Đã huỷ',\n};\n\ninterface DanhSachLichHenProps {\n  /** Chương 7: tên bác sĩ do TRANG truyền vào — tính năng lịch hẹn không import tính năng bác sĩ. */\n  tenBacSi: (bacSiId: string) => string;\n}\n\nexport function DanhSachLichHen({ tenBacSi }: DanhSachLichHenProps) {\n  const { data: lichHen, isPending, error, refetch, isFetching } = useLichHen();\n  const huy = useHuyLichHen();\n\n  return (\n    <section className=\"lich-hen\" aria-label=\"Lịch hẹn của tôi\">\n      <h2>Lịch hẹn của tôi {lichHen && `(${lichHen.length})`}</h2>\n      {isPending ? (\n        <p className=\"goi-y\" aria-busy=\"true\">\n          Đang tải lịch hẹn…\n        </p>\n      ) : !lichHen ? (\n        <LoiTaiDuLieu tieuDe=\"Không tải được lịch hẹn\" loi={error!} onThuLai={() => refetch()} dangThuLai={isFetching} />\n      ) : lichHen.length === 0 ? (\n        <p className=\"goi-y\">Chưa có lịch hẹn nào.</p>\n      ) : (\n        <ul>\n          {lichHen.map((lh) => (\n            <li key={lh.id} className={lh.trangThai}>\n              <strong>{tenBacSi(lh.bacSiId)}</strong> · {hienGio(lh.batDau)} · {lh.benhNhan.hoTen} ·{' '}\n              <span className=\"trang-thai\">{TEN_TRANG_THAI[lh.trangThai]}</span>\n              {lh.trangThai === 'cho-xac-nhan' && (\n                <button type=\"button\" className=\"nut nut-nho\" onClick={() => huy.mutate(lh)} aria-label={`Huỷ lịch ${lh.id}`}>\n                  Huỷ\n                </button>\n              )}\n            </li>\n          ))}\n        </ul>\n      )}\n    </section>\n  );\n}",
  fTheBacSi: "import { Link } from 'react-router';\nimport { TEN_CHUYEN_KHOA } from '@/du-lieu/chuyen-khoa';\nimport { duongDan } from '@/shared/duong-dan';\nimport type { BacSi } from '@/types';\n\ninterface TheBacSiProps {\n  bacSi: BacSi;\n  noiBat?: boolean; // dấu ? = không bắt buộc\n  laYeuThich?: boolean;\n  /** Chương 7: \"Xem chi tiết\" là một LINK tới /bac-si/:id (mở tab mới được), không còn là nút mở khung bên cạnh. */\n  coLienKet?: boolean;\n  onDoiYeuThich?: (id: string) => void;\n}\n\nexport function TheBacSi({ bacSi, noiBat = false, laYeuThich = false, coLienKet = false, onDoiYeuThich }: TheBacSiProps) {\n  const lop = ['the-bac-si', noiBat && 'noi-bat'].filter(Boolean).join(' ');\n  return (\n    <article className={lop} aria-label={bacSi.ten}>\n      <h3>{bacSi.ten}</h3>\n      <p className=\"chuyen-khoa\">{TEN_CHUYEN_KHOA[bacSi.chuyenKhoa]}</p>\n      <p>{bacSi.namKinhNghiem} năm kinh nghiệm</p>\n      {noiBat && <p className=\"nhan\">Bác sĩ lâu năm</p>}\n      <div className=\"hang-nut\">\n        {coLienKet && (\n          <Link className=\"nut nut-chinh\" to={duongDan.chiTietBacSi(bacSi.id)} aria-label={`Xem chi tiết ${bacSi.ten}`}>\n            Xem chi tiết\n          </Link>\n        )}\n        {onDoiYeuThich && (\n          <button\n            type=\"button\"\n            className=\"nut nut-tim\"\n            aria-label={`Yêu thích ${bacSi.ten}`}\n            aria-pressed={laYeuThich}\n            onClick={() => onDoiYeuThich(bacSi.id)}\n          >\n            {laYeuThich ? '♥' : '♡'}\n          </button>\n        )}\n      </div>\n    </article>\n  );\n}",
  fChiTietBacSi: "import { TEN_CHUYEN_KHOA } from '@/du-lieu/chuyen-khoa';\nimport type { BacSi } from '@/types';\n\ninterface ChiTietBacSiProps {\n  bacSi: BacSi;\n  laYeuThich: boolean;\n  onDoiYeuThich: (id: string) => void;\n}\n\nexport function ChiTietBacSi({ bacSi, laYeuThich, onDoiYeuThich }: ChiTietBacSiProps) {\n  return (\n    <section className=\"chi-tiet\" aria-label={`Chi tiết ${bacSi.ten}`}>\n      <h2>{bacSi.ten}</h2>\n      <p className=\"chuyen-khoa\">\n        {TEN_CHUYEN_KHOA[bacSi.chuyenKhoa]} · {bacSi.namKinhNghiem} năm kinh nghiệm\n      </p>\n      <p>{bacSi.gioiThieu}</p>\n      <button type=\"button\" className=\"nut\" aria-pressed={laYeuThich} onClick={() => onDoiYeuThich(bacSi.id)}>\n        {laYeuThich ? '♥ Bỏ yêu thích' : '♡ Thêm vào yêu thích'}\n      </button>\n    </section>\n  );\n}",
  fUseChiTiet: "import { useQuery } from '@tanstack/react-query';\nimport { khoa } from '@/shared/api/khoa';\nimport { api } from '@/shared/api/phong-kham';\n\n/** Một bác sĩ theo id (GET /api/bac-si/:id). id lạ ⇒ API trả 404 ⇒ query lỗi với LoiApi status 404. */\nexport function useChiTietBacSi(id: string) {\n  return useQuery({\n    queryKey: khoa.chiTietBacSi(id),\n    queryFn: ({ signal }) => api.bacSi(id, signal),\n    staleTime: 5 * 60_000,\n  });\n}",
  fKhuBacSi: "import { Link } from 'react-router';\nimport { duongDan } from '@/shared/duong-dan';\nimport { DanhSachBacSiKhung } from '@/shared/ui/KhungXuong';\nimport { LoiTaiDuLieu } from '@/shared/ui/LoiTaiDuLieu';\nimport { ChipChuyenKhoa } from './components/ChipChuyenKhoa';\nimport { DanhSachBacSi } from './components/DanhSachBacSi';\nimport { OTimBacSi } from './components/OTimBacSi';\nimport { useDatLichStore } from './dat-lich-store';\nimport { useBacSi } from './hooks/useBacSi';\nimport { useBoLocUrl } from './hooks/useBoLocUrl';\nimport { locBacSi } from './logic/loc-bac-si';\n\n/** Nội dung trang /bac-si: lọc + tìm (trên URL), lưới bác sĩ, và danh sách yêu thích. Chi tiết giờ là một TRANG riêng. */\nexport function KhuBacSi() {\n  const { data: danhSachBacSi, isPending, isError, error, refetch, isFetching } = useBacSi();\n  const [{ chuyenKhoa, tuKhoa }, datBoLoc] = useBoLocUrl();\n  const yeuThich = useDatLichStore((s) => s.yeuThich);\n  const doiYeuThich = useDatLichStore((s) => s.doiYeuThich);\n\n  const ds = danhSachBacSi ?? [];\n  const danhSachLoc = locBacSi(ds, chuyenKhoa, tuKhoa);\n  const dsYeuThich = ds.filter((bs) => yeuThich.includes(bs.id));\n\n  let noiDung;\n  if (isPending) {\n    noiDung = <DanhSachBacSiKhung />;\n  } else if (!danhSachBacSi) {\n    noiDung = <LoiTaiDuLieu tieuDe=\"Không tải được danh sách bác sĩ\" loi={error!} onThuLai={() => refetch()} dangThuLai={isFetching} />;\n  } else if (danhSachBacSi.length === 0) {\n    noiDung = <p className=\"rong\">Phòng khám chưa có bác sĩ nào nhận lịch.</p>;\n  } else {\n    noiDung = (\n      <>\n        {isError && (\n          <p className=\"bang-cu\" role=\"status\">\n            Không làm mới được danh sách — đang hiện bản đã tải lúc trước.\n          </p>\n        )}\n        <DanhSachBacSi\n          danhSach={danhSachLoc}\n          yeuThich={yeuThich}\n          coLienKet\n          onDoiYeuThich={doiYeuThich}\n          thongBaoRong=\"Không tìm thấy bác sĩ phù hợp.\"\n        />\n      </>\n    );\n  }\n\n  return (\n    <>\n      <div className=\"thanh-loc\">\n        <ChipChuyenKhoa giaTri={chuyenKhoa} onDoi={(ck) => datBoLoc({ chuyenKhoa: ck })} />\n        <OTimBacSi tuKhoa={tuKhoa} onDoi={(q) => datBoLoc({ tuKhoa: q }, 'replace')} />\n      </div>\n      <div className=\"bo-cuc\">\n        <div>{noiDung}</div>\n        <aside>\n          <section className=\"yeu-thich\" aria-label=\"Danh sách yêu thích\">\n            <h3>Yêu thích ({dsYeuThich.length})</h3>\n            {dsYeuThich.length === 0 ? (\n              <p>Chưa có bác sĩ nào.</p>\n            ) : (\n              <ul>\n                {dsYeuThich.map((bs) => (\n                  <li key={bs.id}>\n                    <Link to={duongDan.chiTietBacSi(bs.id)}>{bs.ten}</Link>\n                  </li>\n                ))}\n              </ul>\n            )}\n          </section>\n        </aside>\n      </div>\n    </>\n  );\n}",
  fHeader: "import { Link, NavLink, useNavigate } from 'react-router';\nimport { useDangNhapStore } from '@/features/dang-nhap';\nimport { useLichHen } from '@/features/lich-hen';\nimport { duongDan } from '@/shared/duong-dan';\n\nexport function Header() {\n  const nguoiDung = useDangNhapStore((s) => s.nguoiDung);\n  const dangXuat = useDangNhapStore((s) => s.dangXuat);\n  const navigate = useNavigate();\n  // Chưa đăng nhập ⇒ không gọi API lịch hẹn (batDau: false).\n  const { data } = useLichHen({ batDau: nguoiDung !== null });\n  const soLichHen = data?.filter((lh) => lh.trangThai !== 'da-huy').length;\n\n  return (\n    <header className=\"header\">\n      <div>\n        <h1>\n          <Link to={duongDan.trangChu}>Phòng khám An Tâm</Link>\n        </h1>\n        <p>Mở cửa 7:30–20:00, thứ Hai đến thứ Bảy</p>\n      </div>\n      <nav className=\"menu\" aria-label=\"Menu chính\">\n        <NavLink to={duongDan.trangChu} end>\n          Trang chủ\n        </NavLink>\n        <NavLink to={duongDan.bacSi}>Bác sĩ</NavLink>\n        <NavLink to={duongDan.lichHen}>\n          Lịch hẹn của tôi{nguoiDung && <span className=\"huy-hieu\" aria-label=\"Số lịch hẹn\">{soLichHen ?? '…'}</span>}\n        </NavLink>\n      </nav>\n      <div className=\"tai-khoan\">\n        {nguoiDung ? (\n          <>\n            <span>Chào, {nguoiDung.hoTen}</span>\n            <button\n              type=\"button\"\n              className=\"nut nut-nho\"\n              onClick={async () => {\n                // RỜI trang trước, xoá đăng nhập SAU. Làm ngược lại: store đổi ⇒ cổng của /lich-hen (vẫn đang\n                // trên màn hình) vẽ lại và đẩy sang /dang-nhap trước — đo ở Bài 7.5. navigate() trả Promise từ React Router 7.\n                await navigate(duongDan.trangChu, { replace: true });\n                dangXuat();\n              }}\n            >\n              Đăng xuất\n            </button>\n          </>\n        ) : (\n          <Link to={duongDan.dangNhap}>Đăng nhập</Link>\n        )}\n      </div>\n    </header>\n  );\n}",
  fTrangChu: "import { Link } from 'react-router';\nimport { duongDan } from '@/shared/duong-dan';\nimport { useTieuDeTrang } from '@/shared/hooks/useTieuDeTrang';\nimport { TrangThaiMoCua } from '@/shared/ui/TrangThaiMoCua';\n\nexport function TrangChu() {\n  useTieuDeTrang('Phòng khám An Tâm');\n  return (\n    <section className=\"trang-chu\">\n      <h2>Đặt lịch khám không cần xếp hàng</h2>\n      <p>Chọn bác sĩ, chọn giờ còn trống, điền thông tin — phòng khám gọi lại xác nhận trong ngày.</p>\n      <TrangThaiMoCua />\n      <Link className=\"nut nut-chinh\" to={duongDan.bacSi}>\n        Xem đội ngũ bác sĩ →\n      </Link>\n    </section>\n  );\n}",
  fTrangDanhSach: "import { KhuBacSi } from '@/features/bac-si';\nimport { useTieuDeTrang } from '@/shared/hooks/useTieuDeTrang';\n\nexport function TrangDanhSachBacSi() {\n  useTieuDeTrang('Đội ngũ bác sĩ · Phòng khám An Tâm');\n  return <KhuBacSi />;\n}",
  fTrang404: "import { Link, useLocation } from 'react-router';\nimport { duongDan } from '@/shared/duong-dan';\nimport { useTieuDeTrang } from '@/shared/hooks/useTieuDeTrang';\n\nexport function Trang404() {\n  const { pathname } = useLocation();\n  useTieuDeTrang('Không tìm thấy trang · Phòng khám An Tâm');\n  return (\n    <section className=\"trang-404\">\n      <h2>404 — Không có trang “{pathname}”</h2>\n      <p>Đường dẫn có thể đã cũ hoặc gõ nhầm.</p>\n      <Link className=\"nut nut-chinh\" to={duongDan.trangChu}>\n        Về trang chủ\n      </Link>\n    </section>\n  );\n}",
  fRender: "import { QueryClient, QueryClientProvider } from '@tanstack/react-query';\nimport { render } from '@testing-library/react';\nimport type { ReactNode } from 'react';\nimport { createMemoryRouter } from 'react-router';\nimport { RouterProvider } from 'react-router/dom';\nimport { taoQueryClient } from '@/app/query-client';\nimport { routes } from '@/app/router';\n\n/** QueryClient MỚI cho MỖI test: cache không rò từ test này sang test khác. Không thử lại (test lỗi khỏi đợi 7 giây). */\nexport function taoClientTest(): QueryClient {\n  const qc = taoQueryClient();\n  qc.setDefaultOptions({ queries: { retry: false, gcTime: Infinity } });\n  return qc;\n}\n\nexport function renderVoiQuery(ui: ReactNode, queryClient = taoClientTest()) {\n  const kq = render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);\n  return { ...kq, queryClient };\n}\n\n/**\n * Chương 7: vẽ MỘT component có Link/useSearchParams bên trong một router bộ nhớ (component có Link mà\n * không có router ⇒ lỗi). url: URL bắt đầu, vd '/bac-si?ck=nhi'.\n */\nexport function renderVoiRouter(ui: ReactNode, url = '/', queryClient = taoClientTest()) {\n  const router = createMemoryRouter([{ path: '*', element: ui }], { initialEntries: [url] });\n  const kq = render(\n    <QueryClientProvider client={queryClient}>\n      <RouterProvider router={router} />\n    </QueryClientProvider>,\n  );\n  return { ...kq, router, queryClient };\n}\n\n/** Chương 7: vẽ CẢ APP (đúng bảng route thật) ở một URL — test đi từ trang này sang trang khác như người dùng. */\nexport function veTrang(url: string, queryClient = taoClientTest()) {\n  const router = createMemoryRouter(routes, { initialEntries: [url] });\n  const kq = render(\n    <QueryClientProvider client={queryClient}>\n      <RouterProvider router={router} />\n    </QueryClientProvider>,\n  );\n  return { ...kq, router, queryClient };\n}",
  fSetup: "import '@testing-library/jest-dom/vitest';\nimport { cleanup } from '@testing-library/react';\nimport { afterAll, afterEach, beforeAll } from 'vitest';\nimport { useDangNhapStore } from '@/features/dang-nhap';\nimport { useDatLichStore } from '@/features/bac-si';\nimport { datLaiDuLieu } from '@/mocks/co-so-du-lieu';\nimport { server } from '@/mocks/node';\nimport { useThongBaoStore } from '@/shared/store/thong-bao-store';\n\n// Chương 6: API giả chạy suốt bộ test. Request nào KHÔNG có handler ⇒ test hỏng ngay (đỡ gọi nhầm ra mạng thật).\nbeforeAll(() => server.listen({ onUnhandledRequest: 'error' }));\nafterAll(() => server.close());\n\n// Vitest mặc định globals: false ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.\nafterEach(() => {\n  cleanup();\n  server.resetHandlers(); // bỏ các handler một test tự thêm bằng server.use(...)\n  datLaiDuLieu(); // \"cơ sở dữ liệu\" giả về như mới\n  // Chương 5: những thứ sống NGOÀI component nên cleanup() không dọn — test trước để lại là test sau thấy.\n  window.history.replaceState(null, '', '/');\n  useDatLichStore.setState(useDatLichStore.getInitialState(), true);\n  useDangNhapStore.setState(useDangNhapStore.getInitialState(), true); // Chương 7: đăng nhập giả\n  useThongBaoStore.setState(useThongBaoStore.getInitialState(), true);\n  localStorage.clear(); // bản lưu của persist — xoá SAU cùng: setState ở trên lại ghi xuống localStorage\n});",
  fRouterTest: "import { act, screen, waitFor, within } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\nimport { describe, expect, test } from 'vitest';\nimport { useDangNhapStore } from '@/features/dang-nhap';\nimport { db, khungGioTrongNgay } from '@/mocks/co-so-du-lieu';\nimport { veTrang } from '@/test/render';\n\nconst ANH = { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567' };\n\n/** Tiêu chí đạt của \"🛠 Tự gõ tiếp dự án\" Chương 7 — đi qua app THẬT (đúng bảng route) như một người dùng. */\ndescribe('Chương 7 — định tuyến của app phòng khám', () => {\n  test('\"/\" ⇒ trang chủ trong layout; bấm menu \"Bác sĩ\" ⇒ /bac-si với 6 bác sĩ', async () => {\n    const user = userEvent.setup();\n    const { router } = veTrang('/');\n    expect(screen.getByRole('heading', { level: 1, name: 'Phòng khám An Tâm' })).toBeInTheDocument();\n    expect(screen.getByRole('link', { name: 'Trang chủ' })).toHaveAttribute('aria-current', 'page');\n    await user.click(screen.getByRole('link', { name: 'Bác sĩ' }));\n    expect(await screen.findAllByRole('article')).toHaveLength(6);\n    expect(router.state.location.pathname).toBe('/bac-si');\n    expect(document.title).toBe('Đội ngũ bác sĩ · Phòng khám An Tâm');\n  });\n\n  test('\"Xem chi tiết\" ⇒ /bac-si/bs-2: hồ sơ + chọn giờ, tiêu đề tab theo bác sĩ', async () => {\n    const user = userEvent.setup();\n    const { router } = veTrang('/bac-si');\n    await user.click(await screen.findByRole('link', { name: 'Xem chi tiết BS. Trần Thu Hà' }));\n    expect(await screen.findByRole('heading', { level: 2, name: 'BS. Trần Thu Hà' })).toBeInTheDocument();\n    expect(router.state.location.pathname).toBe('/bac-si/bs-2');\n    const chonGio = screen.getByRole('region', { name: 'Chọn giờ khám' });\n    expect(await within(chonGio).findAllByRole('listitem')).toHaveLength(4);\n    expect(document.title).toBe('BS. Trần Thu Hà · Phòng khám An Tâm');\n  });\n\n  test('đổi ngày khám ⇒ ?ngay= trên URL, REPLACE (không đẻ lịch sử)', async () => {\n    const user = userEvent.setup();\n    const { router } = veTrang('/bac-si/bs-2');\n    await user.click(await screen.findByRole('button', { name: '02/10/2026' }));\n    expect(router.state.location.search).toBe('?ngay=2026-10-02');\n    expect(router.state.historyAction).toBe('REPLACE');\n    expect(screen.getByRole('button', { name: '02/10/2026' })).toHaveAttribute('aria-pressed', 'true');\n  });\n\n  test('/bac-si/bs-99 ⇒ API trả 404 ⇒ \"Không có bác sĩ này\", menu vẫn còn', async () => {\n    veTrang('/bac-si/bs-99');\n    expect(await screen.findByRole('heading', { name: 'Không có bác sĩ này' })).toBeInTheDocument();\n    expect(screen.getByRole('navigation', { name: 'Menu chính' })).toBeInTheDocument();\n    expect(screen.getByRole('link', { name: '← Danh sách bác sĩ' })).toHaveAttribute('href', '/bac-si');\n  });\n\n  test('URL lạ ⇒ trang 404 NẰM TRONG layout', () => {\n    veTrang('/tin-tuc/khai-truong');\n    expect(screen.getByRole('heading', { name: '404 — Không có trang “/tin-tuc/khai-truong”' })).toBeInTheDocument();\n    expect(screen.getByRole('navigation', { name: 'Menu chính' })).toBeInTheDocument();\n  });\n\n  test('/lich-hen chưa đăng nhập ⇒ /dang-nhap; đăng nhập xong ⇒ quay lại /lich-hen, Back 1 lần về trang chủ', async () => {\n    const user = userEvent.setup();\n    const { router } = veTrang('/');\n    await user.click(screen.getByRole('link', { name: 'Lịch hẹn của tôi' }));\n    expect(await screen.findByRole('heading', { name: 'Đăng nhập' })).toBeInTheDocument();\n    expect(router.state.historyAction).toBe('REPLACE');\n    await user.type(screen.getByLabelText('Họ và tên'), ANH.hoTen);\n    await user.type(screen.getByLabelText('Số điện thoại'), ANH.soDienThoai);\n    await user.click(screen.getByRole('button', { name: 'Đăng nhập' }));\n    expect(await screen.findByRole('heading', { name: /^Lịch hẹn của tôi/ })).toBeInTheDocument();\n    expect(router.state.location.pathname).toBe('/lich-hen');\n    await act(() => router.navigate(-1));\n    expect(router.state.location.pathname).toBe('/');\n  });\n\n  test('đặt lịch trọn luồng qua URL: /bac-si/bs-2 → /dat-lich/:khungGioId → /lich-hen', async () => {\n    useDangNhapStore.setState({ nguoiDung: ANH });\n    const user = userEvent.setup();\n    const { router } = veTrang('/bac-si/bs-2');\n    await user.click(await screen.findByRole('link', { name: '14:00 · 01/10/2026' }));\n    expect(router.state.location.pathname).toBe('/dat-lich/bs-2-2026-10-01-1400');\n    expect(router.state.location.search).toBe('?bacSi=bs-2&ngay=2026-10-01');\n    expect(await screen.findByRole('heading', { name: 'Đặt lịch khám' })).toBeInTheDocument();\n\n    await user.type(screen.getByLabelText('Họ và tên'), ANH.hoTen);\n    await user.type(screen.getByLabelText('Số điện thoại'), ANH.soDienThoai);\n    await user.type(screen.getByLabelText('Ngày sinh'), '1995-03-14');\n    await user.type(screen.getByLabelText('Lý do khám'), 'Bé ho khan 3 ngày');\n    await user.click(screen.getByRole('button', { name: 'Xác nhận đặt lịch' }));\n\n    expect(await screen.findByText(/Mã lịch hẹn: lh-1/)).toBeInTheDocument();\n    expect(router.state.location.pathname).toBe('/lich-hen');\n    expect(router.state.historyAction).toBe('REPLACE'); // Back không quay về form đã gửi\n    expect(await screen.findByText('BS. Trần Thu Hà')).toBeInTheDocument();\n    expect(db.lichHen()).toHaveLength(1);\n  });\n\n  test('mở thẳng link /dat-lich/… của một khung ĐÃ KÍN ⇒ báo, có đường chọn giờ khác', async () => {\n    useDangNhapStore.setState({ nguoiDung: ANH });\n    const kin = khungGioTrongNgay('bs-2', '2026-10-01').find((kg) => !kg.conTrong)!;\n    veTrang(`/dat-lich/${kin.id}?bacSi=bs-2&ngay=2026-10-01`);\n    expect(await screen.findByRole('heading', { name: /đã có người đặt$/ })).toBeInTheDocument();\n    expect(screen.getByRole('link', { name: '← Chọn giờ khác' })).toHaveAttribute('href', '/bac-si/bs-2?ngay=2026-10-01');\n  });\n\n  test('chưa đăng nhập bấm một khung giờ ⇒ đăng nhập ⇒ quay lại ĐÚNG /dat-lich/…?bacSi=…&ngay=…', async () => {\n    const user = userEvent.setup();\n    const { router } = veTrang('/bac-si/bs-4?ngay=2026-10-02');\n    await user.click(await screen.findByRole('link', { name: '08:00 · 02/10/2026' }));\n    expect(await screen.findByRole('heading', { name: 'Đăng nhập' })).toBeInTheDocument();\n    await user.type(screen.getByLabelText('Họ và tên'), ANH.hoTen);\n    await user.type(screen.getByLabelText('Số điện thoại'), ANH.soDienThoai);\n    await user.click(screen.getByRole('button', { name: 'Đăng nhập' }));\n    expect(await screen.findByRole('heading', { name: 'Đặt lịch khám' })).toBeInTheDocument();\n    expect(router.state.location.pathname + router.state.location.search).toBe('/dat-lich/bs-4-2026-10-02-0800?bacSi=bs-4&ngay=2026-10-02');\n  });\n\n  test('bộ lọc trên URL sống qua \"tải lại\": /bac-si?ck=nhi ⇒ 2 bác sĩ', async () => {\n    veTrang('/bac-si?ck=nhi');\n    expect(await screen.findByRole('heading', { name: 'Đội ngũ bác sĩ (2)' })).toBeInTheDocument();\n  });\n\n  test('đăng xuất ở /lich-hen ⇒ về trang chủ (REPLACE), mở lại /lich-hen ⇒ trang đăng nhập', async () => {\n    useDangNhapStore.setState({ nguoiDung: ANH });\n    const user = userEvent.setup();\n    const { router } = veTrang('/lich-hen');\n    await screen.findByRole('heading', { name: /^Lịch hẹn của tôi/ });\n    await user.click(screen.getByRole('button', { name: 'Đăng xuất' }));\n    await waitFor(() => expect(router.state.location.pathname).toBe('/'));\n    expect(router.state.historyAction).toBe('REPLACE');\n    await act(() => router.navigate('/lich-hen'));\n    expect(await screen.findByRole('heading', { name: 'Đăng nhập' })).toBeInTheDocument();\n  });\n});",
  fPhongKham: "/** Thân request đặt lịch. Chương 7: khai bằng kiểu CHUNG (types.ts) — shared/ không được import từ features/. */\nexport type YeuCauDatLich = Pick<LichHen, 'bacSiId' | 'khungGioId' | 'benhNhan' | 'lyDo'>;",
  fCss: ".header h1 a { color: inherit; text-decoration: none; }\n.menu { display: flex; gap: 6px; }\n.menu a { color: #e0f2fe; text-decoration: none; padding: 6px 12px; border-radius: 999px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }\n.menu a:hover { background: rgba(255, 255, 255, .12); }\n.menu a.active { background: #fff; color: #0e7490; }\n.menu .huy-hieu { background: #f59e0b; color: #fff; padding: 0 8px; font-size: 12px; }\n.tai-khoan { display: flex; align-items: center; gap: 10px; font-size: 14px; }\n.tai-khoan a { color: #fff; font-weight: 600; }\n.nut-nho { padding: 3px 10px; font-size: 13px; margin-left: 6px; }\na.nut { display: inline-block; text-decoration: none; color: inherit; }\na.nut.nut-chinh { color: #fff; }\n.trang-chu { background: #fff; border: 1px solid #cbd5e1; border-radius: 16px; padding: 28px 32px; max-width: 640px; }\n.trang-chu p { color: #334155; }\n.trang-chi-tiet { display: grid; gap: 14px; max-width: 760px; }\n.trang-chi-tiet .nut-lui { justify-self: start; margin-top: 0; }\n.chi-tiet h2 { margin: 0 0 4px; }\n.chon-gio { background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px 18px; }\n.chon-gio h3 { margin: 0 0 10px; font-size: 17px; }\n.chon-gio .lua-chon { list-style: none; padding: 0; margin: 12px 0 0; }\n.nut.kin { opacity: .45; cursor: not-allowed; }\n.trang-dat-lich, .trang-dang-nhap, .trang-404 { max-width: 560px; }\n.trang-dat-lich .tom-tat, .tom-tat { display: grid; grid-template-columns: 110px 1fr; gap: 4px 10px; margin: 0 0 4px; font-size: 15px; }\n.tom-tat dt { color: #64748b; } .tom-tat dd { margin: 0; font-weight: 600; }\n.lich-hen .nut-nho { margin-left: 8px; }",
};

/* ─── Output THẬT (vitest --reporter=verbose, tsc, vite build, oxlint, npm, next build, curl, Playwright + Chromium) ─── */
const OUT = {
  link: "[7.1 link] pathname = /bac-si · historyAction = PUSH",
  navlink: "[7.1 navlink] Trang chủ       class=\"\" aria-current=null\n[7.1 navlink] Đội ngũ bác sĩ  class=\"active\" aria-current=page\n[7.1 navlink] Lịch hẹn        class=\"\" aria-current=null",
  navigate: "[7.1 navigate] pathname = /lich-hen · state = {\"vuaDat\":\"bs-4\"}",
  search: "[7.1 search] sau chip Nhi: ?ck=nhi PUSH → Tìm thấy 2 bác sĩ\n[7.1 search] sau gõ \"vy\": ?ck=nhi&q=vy REPLACE → Tìm thấy 1 bác sĩ\n[7.1 search] sau 1 lần Back: (rỗng) → Tìm thấy 6 bác sĩ",
  bai1Tong: " ✓ mở \"/\" rồi bấm Link ⇒ đổi trang, không tải lại\n ✓ \"/bac-si/:id\" ⇒ useParams đọc được id\n ✓ id không có thật ⇒ trang chi tiết tự báo, KHÔNG phải 404 của router\n ✓ đường dẫn lạ ⇒ route \"*\" (404)\n ✓ NavLink tự gắn aria-current=\"page\" + class \"active\"\n ✓ useNavigate: bấm \"Đặt lịch\" ⇒ sang /lich-hen, mang theo state\n ✓ useSearchParams: chip đẩy mục lịch sử, ô tìm thay mục hiện tại\n Test Files  1 passed (1)\n      Tests  7 passed (7)",
  linkVsA: "[truoc]       Số lần tải trang: 1 · Bộ đếm useState: 3\n[sau <Link>]  Số lần tải trang: 1 · Bộ đếm useState: 3 · request: 0 \n[sau <a>]     Số lần tải trang: 2 · Bộ đếm useState: 0 · request: 3 [\"document /bac-si\",\"script /assets/index-CQM_6-Wp.js\",\"stylesheet /assets/index-DOCfO5vB.css\"]",
  npm: "$ npm ls react-router\nphong-kham@0.0.0\n`-- react-router@8.4.0\n\n\n$ npm view react-router dist-tags.latest\n8.4.0\n$ npm view react-router-dom dist-tags.latest\n7.18.4\n$ npm view react-router-dom@latest dependencies\n{ 'react-router': '7.18.4' }",
  npmDom: "$ npm install react-router-dom\n  run `npm fund` for details\nfound 0 vulnerabilities\nphong-kham@0.0.0\n+-- react-router-dom@7.18.4\n| `-- react-router@7.18.4\n`-- react-router@8.4.0",
  tronDom: "Error handled by React Router default ErrorBoundary: TypeError: Cannot destructure property 'basename' of 'React10.useContext(...)' as it is null.\n    at LinkWithRef (…/node_modules/react-router-dom/node_modules/react-router/dist/development/chunk-OB3PAWPO.mjs:10619:11)\n    …\nThe above error occurred in the <Link> component.",
  tscUseParams: "$ npx tsc -p vi-du-sai --noEmit\nvi-du-sai/use-params.tsx(10,26): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.\n  Type 'undefined' is not assignable to type 'string'.",
  preview: "vite preview GET / → 200\nvite preview GET /bac-si → 200\nvite preview GET /bac-si/bs-2 → 200\nvite preview GET /khong-co → 200",
  staticF5: "python3 -m http.server GET / → 200\npython3 -m http.server GET /bac-si → 404\npython3 -m http.server GET /bac-si/bs-2 → 404\n<!DOCTYPE HTML>\n<html lang=\"en\">\n    <head>\n        <meta charset=\"utf-8\">\n        <title>Error response</title>",
  layout: "[7.2 layout] 4 lần đổi trang · KhungChinh mount: 1 lần",
  long: "[7.2 long] pathname = /bac-si/bs-4 · matches = / › bac-si › :id",
  loi: "[7.2 loi] alert = 404 — Không có bác sĩ bs-99 · danh sách còn: true",
  chan: "[7.2 chan replace=true] /dang-nhap · /lich-hen · Back→/ ⇒ 1 lần Back\n[7.2 chan replace=false] /dang-nhap · /lich-hen · Back→/dang-nhap · Back→/lich-hen · Back→/ ⇒ 3 lần Back",
  middleware: "[7.2 middleware] loader lịch hẹn đã chạy: component = 1 lần · middleware = 0 lần · URL = /dang-nhap?tu=%2Flich-hen",
  hydrate: "No `HydrateFallback` element provided to render during initial hydration",
  vong: "[vong] body = \"<div></div>\"\n[vong] cổng đã vẽ 1 lần · URL = /dang-nhap · thấy \"Đăng nhập\": false",
  bai2Tong: " ✓ đi qua 4 trang ⇒ layout chỉ mount MỘT lần, header luôn còn\n ✓ /bac-si (index) ⇒ gợi ý; bấm một bác sĩ ⇒ chi tiết hiện CẠNH danh sách\n ✓ loader ném 404 ⇒ ErrorBoundary của route con; danh sách (route cha) vẫn còn\n ✓ URL lạ ⇒ route \"*\" TRONG layout (vẫn có menu)\n ✓ chặn bằng component, replace=true: đăng nhập xong bấm Back mấy lần mới về trang chủ?\n ✓ chặn bằng component, replace=false: đăng nhập xong bấm Back mấy lần mới về trang chủ?\n ✓ chưa đăng nhập: component gác cổng KHÔNG chặn được loader, middleware thì chặn\n Test Files  1 passed (1)\n      Tests  7 passed (7)",
  nextBuild: "$ npx next build\n▲ Next.js 16.3.6 (Turbopack)\n✓ Compiled successfully in 3.9s\n✓ Generating static pages using 3 workers (10/10) in 276ms\nRoute (app)\n┌ ○ /\n├ ○ /_not-found\n├ ○ /bac-si\n└   /bac-si/[id]\n  ├ ● /bac-si/bs-1\n  ├ ● /bac-si/bs-2\n  ├ ● /bac-si/bs-3\n  └ ● [+3 more paths]\n○  (Static)  prerendered as static content\n●  (SSG)     prerendered as static HTML (uses generateStaticParams)",
  nextCurl: "$ curl -s localhost:5173/bac-si/bs-2 | grep -o \"<h1>[^<]*</h1>\"\n<h1>BS. Trần Thu Hà</h1>\n$ curl -s -o /dev/null -w \"%{http_code}\" localhost:5173/bac-si/bs-99\n404",
  spaCurl: "$ curl -s localhost:5174/bac-si/bs-2 | grep -c \"<h1>\"\n0\n$ curl -s localhost:5174/bac-si/bs-2 | sed -n '/<body>/,/<\\/body>/p'\n  <body>\n    <div id=\"root\"></div>\n  </body>",
  nextLoi: "$ npx next build\n▲ Next.js 16.3.6 (Turbopack)\n> Build error occurred\nError: Turbopack build failed with 1 error:\n./app/thu-loi/page.tsx:1:10\nError: You're importing a module that depends on `useState` into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the `\"use client\"` directive.\n    Learn more: https://nextjs.org/docs/app/api-reference/directives/use-client",
  tscDon: "$ npx tsc -p tsconfig.app.json --noEmit\nsrc/App.tsx(2,24): error TS2307: Cannot find module './components/Footer' or its corresponding type declarations.\nsrc/App.tsx(3,24): error TS2307: Cannot find module './components/Header' or its corresponding type declarations.\nsrc/App.tsx(4,26): error TS2307: Cannot find module './components/KhuBacSi' or its corresponding type declarations.\n…\n# 100 lỗi trong 35 file: 81 × TS2307, 17 × TS7006, 2 × TS2339",
  buildThieuAlias: "$ npx vite build   # tsconfig có \"paths\", vite.config CHƯA có tsconfigPaths\ndist/assets/index-2EJGV3h_.js    491.06 kB │ gzip: 153.73 kB\n✓ built in 734ms",
  vitestThieu: "$ npx vitest run   # cùng lúc đó\nError: Failed to resolve import \"@/features/dang-nhap\" from \"src/test/setup.ts\". Does the file exist?\n…\n Test Files  20 failed (20)\n      Tests  no tests",
  devThieu: "$ npx vite --port 5176   # dev server, cùng lúc đó\nGET /src/pages/TrangChu.tsx → 500\n[vite] Internal server error: Failed to resolve import \"@/shared/duong-dan\" from \"src/pages/TrangChu.tsx\". Does the file exist?",
  buildKhongPaths: "$ npx vite build   # BỎ \"paths\" khỏi tsconfig\nError: [vite]: Rolldown failed to resolve import \"@/features/dat-lich/schema\" from \"src/mocks/handlers.ts\".",
  vitestSau: "$ npx vitest run   # sau khi thêm resolve: { tsconfigPaths: true }\n Test Files  20 passed (20)\n      Tests  83 passed (83)",
  oxlintViPham: "$ npx oxlint src\nsrc/features/bac-si/components/TheBacSi.tsx:2:1: error eslint(no-restricted-imports): '../../../du-lieu/chuyen-khoa' import is restricted …\n    help: Lên hai cấp thư mục trở lên thì viết '@/…'.\nsrc/features/lich-hen/DanhSachLichHen.tsx:1:1: error eslint(no-restricted-imports): '@/features/bac-si' import is restricted …\n    help: Tính năng không import tính năng khác (hay pages/, app/). Ghép chúng ở pages/.\nsrc/shared/ui/LoiTaiDuLieu.tsx:1:1: error eslint(no-restricted-imports): '@/features/dang-nhap' import is restricted …\n    help: shared/ là tầng dưới cùng: không import features/, pages/, app/.\nsrc/pages/TrangChiTietBacSi.tsx:1:1: error eslint(no-restricted-imports): '@/features/bac-si/hooks/useBacSi' import is restricted …\n    help: Chỉ đi qua cửa của tính năng: '@/features/<tên>' (index.ts).",
  oxlintSach: "$ npx oxlint src && echo \"exit $?\"\n# 0 lỗi (13 cảnh báo cũ ở src/vi-du và FormDatLich.test)\nexit 0",
  vongTrinhDuyet: "[vite dev] h2 đầu tiên = null · pageerror = Cannot access 'benhNhanSchema' before initialization\n[vite build + preview] h2 đầu tiên = \"Đội ngũ bác sĩ (6)\" · pageerror = (không có)",
  vongVitest: "[vong vitest] lichHenSchema.shape.benhNhan = undefined\nError: Invalid element at key \"benhNhan\": expected a Zod schema",
  vongVitestTong: "$ npx vitest run   # toàn bộ dự án, CÓ vòng tròn\n Test Files  21 passed (21)\n      Tests  94 passed (94)",
  oxlintVong: "$ npx oxlint src/features\nsrc/features/dat-lich/index.ts:2:28: error import(no-cycle): Dependency cycle detected\nsrc/features/lich-hen/index.ts:4:31: error import(no-cycle): Dependency cycle detected\nsrc/features/lich-hen/schema.ts:2:32: error import(no-cycle): Dependency cycle detected\nsrc/features/dat-lich/useDatLich.ts:5:28: error import(no-cycle): Dependency cycle detected",
  buildTruoc: "# trước Chương 7 (một trang, chưa có router)\ndist/assets/index-D0V9EEDn.js    391.80 kB │ gzip: 121.97 kB\n✓ built in 603ms",
  buildSau: "# sau Chương 7 (react-router 8.4.0, 7 route)\ndist/assets/index-BYnmmUn6.js    491.08 kB │ gzip: 153.74 kB\n✓ built in 709ms",
  vitestDuAn: "$ npx tsc -b && npx vitest run\n Test Files  19 passed (19)\n      Tests  80 passed (80)",
  dangXuatSai: "× src/app/router.test.tsx > Chương 7 — định tuyến của app phòng khám > đăng xuất ở /lich-hen ⇒ về trang chủ (REPLACE), mở lại /lich-hen ⇒ trang đăng nhập\n   → expected '/dang-nhap' to be '/' // Object.is equality\n      Tests  1 failed | 9 passed (10)",
  chup: "✓ danh-sach.jpg ← /bac-si?ck=nhi · title=\"Đội ngũ bác sĩ · Phòng khám An Tâm\"\n✓ chi-tiet.jpg ← /bac-si/bs-2 · title=\"BS. Trần Thu Hà · Phòng khám An Tâm\"\n[bấm 14:00, chưa đăng nhập] URL = /dang-nhap\n✓ dang-nhap.jpg ← /dang-nhap · title=\"Đăng nhập · Phòng khám An Tâm\"\n[đăng nhập xong] URL = /dat-lich/bs-2-2026-10-01-1400?bacSi=bs-2&ngay=2026-10-01\n✓ dat-lich.jpg ← /dat-lich/bs-2-2026-10-01-1400?bacSi=bs-2&ngay=2026-10-01 · title=\"Đặt lịch · Phòng khám An Tâm\"\n✓ lich-hen.jpg ← /lich-hen · title=\"Lịch hẹn của tôi · Phòng khám An Tâm\"\n[Back từ /lich-hen] URL = /bac-si/bs-2\n✓ khong-co.jpg ← /bac-si/bs-99 · title=\"Phòng khám An Tâm\"\n✓ 404.jpg ← /tin-tuc/khai-truong · title=\"Không tìm thấy trang · Phòng khám An Tâm\"\n[F5 /bac-si/bs-4?ngay=2026-10-02] ngày đang chọn = 02/10/2026",
  oxlintSaoMot: "$ npx oxlint src   # lần đầu: \"@/features/*/*\" và \"../../*\" (một dấu sao)\nsrc/features/lich-hen/DanhSachLichHen.tsx:1:1: error eslint(no-restricted-imports): '@/features/bac-si' import is restricted …\n    help: Tính năng không import tính năng khác (hay pages/, app/). Ghép chúng ở pages/.\nsrc/shared/ui/LoiTaiDuLieu.tsx:1:1: error eslint(no-restricted-imports): '@/features/dang-nhap' import is restricted …\n    help: shared/ là tầng dưới cùng: không import features/, pages/, app/.\n# chỉ 2 trên 4 chỗ phạm luật bị bắt",
  routerTests: "$ npx vitest run src/app/router.test.tsx --reporter=verbose\n ✓ \"/\" ⇒ trang chủ trong layout; bấm menu \"Bác sĩ\" ⇒ /bac-si với 6 bác sĩ\n ✓ \"Xem chi tiết\" ⇒ /bac-si/bs-2: hồ sơ + chọn giờ, tiêu đề tab theo bác sĩ\n ✓ đổi ngày khám ⇒ ?ngay= trên URL, REPLACE (không đẻ lịch sử)\n ✓ /bac-si/bs-99 ⇒ API trả 404 ⇒ \"Không có bác sĩ này\", menu vẫn còn\n ✓ URL lạ ⇒ trang 404 NẰM TRONG layout\n ✓ /lich-hen chưa đăng nhập ⇒ /dang-nhap; đăng nhập xong ⇒ quay lại /lich-hen, Back 1 lần về trang chủ\n ✓ đặt lịch trọn luồng qua URL: /bac-si/bs-2 → /dat-lich/:khungGioId → /lich-hen\n ✓ mở thẳng link /dat-lich/… của một khung ĐÃ KÍN ⇒ báo, có đường chọn giờ khác\n ✓ chưa đăng nhập bấm một khung giờ ⇒ đăng nhập ⇒ quay lại ĐÚNG /dat-lich/…?bacSi=…&ngay=…\n ✓ bộ lọc trên URL sống qua \"tải lại\": /bac-si?ck=nhi ⇒ 2 bác sĩ\n ✓ đăng xuất ở /lich-hen ⇒ về trang chủ (REPLACE), mở lại /lich-hen ⇒ trang đăng nhập\n      Tests  11 passed (11)",
  duAnTong: "$ npx tsc -b && npx vitest run && npx vite build\n Test Files  19 passed (19)\n      Tests  80 passed (80)\ndist/assets/index-BYnmmUn6.js    491.08 kB │ gzip: 153.74 kB\n✓ built in 709ms",
  buildKhongPathsNgan: "Error: [vite]: Rolldown failed to resolve import \"@/features/dat-lich/schema\" from \"src/mo",
  buildSoSanh: "# trước Chương 7 (một trang, chưa có router)\ndist/assets/index-D0V9EEDn.js    391.80 kB │ gzip: 121.97 kB\n✓ built in 603ms\n\n# sau Chương 7 (react-router 8.4.0, 7 route)\ndist/assets/index-BYnmmUn6.js    491.08 kB │ gzip: 153.74 kB\n✓ built in 709ms",
};

export default {
  title: 'Chapter 7 — Routing and structure|||Chương 7 — Định tuyến và cấu trúc',
  description: 'Nhiều trang và tổ chức dự án: React Router 8 (Data Mode) với route, link, tham số, layout lồng nhau, ErrorBoundary theo route, chặn trang cần đăng nhập bằng layout route hoặc middleware; cấu trúc thư mục theo tính năng với luật phụ thuộc kiểm bằng lint; và khi nào nên sang Next.js — mọi hành vi đo thật bằng Vitest, Chromium và next build.',
  lessons: [

    /* ─────────────────────────── 7.0 ─────────────────────────── */
    {
      title: '7.0 — Chapter 7 slides: routing and structure in pictures|||7.0 — Slide Chương 7: định tuyến và cấu trúc bằng hình',
      slug: 'rx-7-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 29 slide của Chương 7: router trong SPA, Link so với a href đo trên Chromium, React Router 8 và cái bẫy react-router-dom, useSearchParams, F5 trên máy chủ tĩnh, layout lồng, ErrorBoundary theo route, cổng đăng nhập, replace và middleware, cấu trúc theo tính năng với lint, alias @/, barrel vòng tròn, SPA so với Next.js, và dự án bảy route.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Slides</span>
<h2>The whole chapter in 29 slides</h2>
<p class="lead">Chapter 6 connected the clinic app to an API. This chapter gives it addresses: every screen gets its own URL, a layout that renders once, error pages that stay inside the frame, pages that need a login, and a folder structure that a linter keeps honest. At the end you will know when a single-page app is enough and when a team reaches for Next.js instead.</p>
<p>Slides 3–8 belong to Lesson 7.1 (what a router does, <code>Link</code> versus <code>&lt;a href&gt;</code> measured in Chromium, React Router 8 and the <code>react-router-dom</code> trap, the route table, <code>useSearchParams</code>, F5 on a static host), 9–14 to 7.2 (layout routes, nested routes, route error boundaries, the login gate, <code>replace</code>, middleware), 15–19 to 7.3 (feature folders, one-way dependencies, lint rules, the <code>@/</code> alias, barrel cycles), 20–24 to 7.4 (empty SPA HTML versus Next.js HTML, routes as folders, <code>next build</code>, Server Components, when to switch). Slides 25–26 show the finished project, then come the common mistakes, a cheat sheet and the "keep building the project" checklist. Every number, error message and screenshot is real: measured on 25 September 2026 with React 19.3.0, react-router 8.4.0, Vite 8.3.1, Vitest 5.0.1, oxlint 1.85.0, Next.js 16.3.6 and a real Chromium driven by Playwright.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Slide</span>
<h2>Cả chương trong 29 slide</h2>
<p class="lead">Chương 6 nối app phòng khám với một API. Chương này cho nó địa chỉ: mỗi màn hình một URL, một layout vẽ đúng một lần, trang lỗi nằm yên trong khung, những trang cần đăng nhập, và một cấu trúc thư mục được linter giữ cho ngay ngắn. Hết chương, bạn biết khi nào một ứng dụng một trang là đủ và khi nào một nhóm chọn Next.js.</p>
<p>Slide 3–8 thuộc Bài 7.1 (router làm gì, <code>Link</code> so với <code>&lt;a href&gt;</code> đo trên Chromium, React Router 8 và cái bẫy <code>react-router-dom</code>, bảng route, <code>useSearchParams</code>, F5 trên máy chủ tĩnh), 9–14 thuộc 7.2 (layout route, route lồng, ErrorBoundary theo route, cổng đăng nhập, <code>replace</code>, middleware), 15–19 thuộc 7.3 (thư mục theo tính năng, phụ thuộc một chiều, luật lint, alias <code>@/</code>, barrel vòng tròn), 20–24 thuộc 7.4 (HTML rỗng của SPA so với HTML của Next.js, route thành thư mục, <code>next build</code>, Server Component, khi nào nên chuyển). Slide 25–26 là dự án hoàn chỉnh, rồi tới sai lầm hay gặp, bảng tra nhanh và danh sách "tự gõ tiếp dự án". Mọi con số, thông báo lỗi và ảnh chụp đều THẬT: đo ngày 25/09/2026 bằng React 19.3.0, react-router 8.4.0, Vite 8.3.1, Vitest 5.0.1, oxlint 1.85.0, Next.js 16.3.6 và một Chromium thật do Playwright điều khiển.</p>
</div>
${gallery('rx-07', [
  [1, 'Bìa — Chương 7: Định tuyến và cấu trúc'],
  [2, 'Bản đồ chương: từ một trang dài thành bảy route có cấu trúc'],
  [3, 'Router đọc URL rồi chọn component — không tải lại trang'],
  [4, 'Link giữ app sống — a href tải lại từ đầu (đo trên Chromium)'],
  [5, 'React Router 8 chỉ còn gói react-router — trộn bản 7 là sập'],
  [6, 'Bảng route: mỗi mẫu URL một component, :id là tham số, * là 404'],
  [7, 'useSearchParams: chip thì push, ô tìm thì replace'],
  [8, 'F5 ở /bac-si/bs-2: máy chủ tĩnh trả 404 nếu không có fallback'],
  [9, 'Layout route: khung vẽ một lần, Outlet đổi phần ruột'],
  [10, 'Cây route lồng nhau = cây giao diện lồng nhau'],
  [11, 'ErrorBoundary theo route: lỗi ở chi tiết, danh sách vẫn sống'],
  [12, 'Chặn trang cần đăng nhập bằng một layout route gác cổng'],
  [13, 'Quên replace: đăng nhập xong phải bấm Back ba lần'],
  [14, 'Middleware chặn trước loader — cổng component thì không'],
  [15, 'Xếp theo loại file → xếp theo tính năng'],
  [16, 'Luật phụ thuộc một chiều: app → pages → features → shared'],
  [17, 'Mỗi tính năng một cửa index.ts — lint chặn đi cửa sau'],
  [18, 'Alias @/: build xanh chưa chắc dev và test xanh'],
  [19, 'Barrel vòng tròn: tsc và Vitest không thấy, trình duyệt thì sập'],
  [20, 'SPA gửi HTML rỗng — Next.js gửi HTML có sẵn nội dung'],
  [21, 'Route của React Router ↔ thư mục app/ của Next.js'],
  [22, 'next build dựng sẵn sáu trang bác sĩ'],
  [23, "Server Component mặc định, 'use client' khi cần tương tác"],
  [24, 'Khi nào cần Next.js — khi nào Vite SPA là đủ'],
  [25, 'Dự án sau Chương 7: bảy trang dưới một layout'],
  [26, 'Đặt lịch đi theo URL: chọn giờ → đăng nhập → form → lịch hẹn'],
  [27, 'Sai lầm hay gặp ở Chương 7'],
  [28, 'Bảng tra nhanh Chương 7'],
  [29, 'Tự gõ tiếp dự án: route, layout, cổng và thư mục theo tính năng'],
])}
`,
    },

    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — React Router basics: routes, links, params — and what changed since v6|||7.1 — React Router căn bản: route, link, tham số — và những gì đã đổi từ bản 6',
      slug: 'rx-7-1-router',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Router làm gì trong một SPA, React Router 8 chỉ còn gói react-router (react-router-dom dừng ở 7.x — trộn vào là sập), bảng route kiểu Data Mode, Link so với a href đo trên Chromium, useParams, NavLink, useNavigate, useSearchParams thay hook tự viết, test bằng createMemoryRouter và vì sao F5 ở trang con ra 404 trên máy chủ tĩnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>React Router basics: routes, links, params — and what changed since v6</h2>
<p class="lead">Until now the clinic app has been one long page: the doctor list, the booking flow and "my appointments" all stacked on top of each other. Real apps have pages — a list you can bookmark, a detail page you can send to a friend, a back button that goes back. In a single-page app (SPA) nobody gives you those for free: the browser loads <code>index.html</code> once, and from then on <em>your JavaScript</em> decides what a URL means. That job is called routing, and the library almost every React company uses for it is React Router.</p>
<p>The examples live in <code>src/vi-du/bai1.tsx</code> and <code>src/vi-du/bai1.test.tsx</code> of the chapter's test project (React 19.3.0, <strong>react-router 8.4.0</strong>, Vitest 5.0.1). The browser measurements come from a small separate Vite project driven by Playwright in a real Chromium. One warning before we start: most tutorials online — and the FER202 slides — are written for React Router <strong>6</strong>. Version 8 (the current one, as of 09/2026) keeps the ideas but changed the package name and the recommended setup, and mixing the two is a crash you will see later in this lesson.</p>

<h3>One page, many URLs: what a router actually does</h3>
${slide('rx-07', 3, 'Router đọc URL rồi chọn component — không tải lại trang')}
<p>A classic website has one HTML file per page. Click a link, the browser throws the current page away, asks the server for the next HTML file, and starts from zero: every JavaScript variable is gone, every <code>useState</code> is back to its initial value. An SPA does it differently. The server sends one almost-empty <code>index.html</code> and one JavaScript bundle; after that, "changing page" means <strong>changing the URL in the address bar without asking the server</strong>, and rendering a different component for the new URL.</p>
<p>You already did half of this by hand in Lesson 5.4: <code>history.pushState</code> changes the URL without reloading, and the <code>popstate</code> event tells you when the user presses Back. A router is that code, finished and generalised:</p>
<ul>
<li>a <strong>route table (bảng route)</strong> that maps URL patterns such as <code>/bac-si/:id</code> to components;</li>
<li>a <strong>link component</strong> that turns a click into <code>pushState</code> instead of a page load;</li>
<li>hooks that tell any component "what is the current URL, and what are its parameters";</li>
<li>and — the part that is hard to write yourself — <strong>nested routes</strong>, layouts, error pages, redirects and data loading, which Lesson 7.2 covers.</li>
</ul>
<p><strong>Try it step by step</strong> — what happens when the user clicks <code>&lt;Link to="/bac-si"&gt;</code>:</p>
<ol>
<li>The browser fires a normal click on an <code>&lt;a href="/bac-si"&gt;</code> element (a <code>Link</code> <em>is</em> a real <code>&lt;a&gt;</code> in the DOM).</li>
<li>React Router's click handler calls <code>event.preventDefault()</code>, so the browser does <strong>not</strong> start loading a new document.</li>
<li>It calls <code>history.pushState(…, '/bac-si')</code>: the address bar changes and a new history entry is added.</li>
<li>The router matches <code>/bac-si</code> against the route table, finds the component, and updates its state inside <code>React.startTransition</code> (so React can keep the old screen until the new one is ready).</li>
<li>React renders the new component and commits only what changed to the DOM. The JavaScript heap, every store and every cache are still there.</li>
</ol>

<h3>Installing it — and the package-name trap</h3>
${slide('rx-07', 5, 'React Router 8 chỉ còn gói react-router — trộn bản 7 là sập')}
<p>The test project already has the router installed. This is what npm says about it and about the package every older tutorial tells you to install:</p>
${out(OUT.npm)}
<p>Read those four answers carefully, because they explain a lot of confused Stack Overflow questions:</p>
<ul>
<li>The package is called <code>react-router</code> and its latest version is <strong>8.4.0</strong>. Everything — <code>Link</code>, <code>useParams</code>, <code>createBrowserRouter</code> — is imported from <code>'react-router'</code>. The only thing that needs the DOM is <code>RouterProvider</code>, imported from <code>'react-router/dom'</code>.</li>
<li><code>react-router-dom</code> was the name in v6. In v7 it became a thin re-export of <code>react-router</code>, and <strong>v8 removed it</strong> (the v8 changelog: <em>"Remove react-router-dom package"</em>). Its latest version on npm is therefore frozen at <strong>7.18.4</strong>, and it depends on <code>react-router@7.18.4</code>.</li>
</ul>
<p>So <code>npm install react-router-dom</code> still "works" — it just installs a <em>second, older</em> copy of the router next to yours:</p>
${out(OUT.npmDom)}
<p>Two routers means two separate React contexts. A <code>Link</code> imported from <code>react-router-dom</code> looks for <em>its</em> router context, finds nothing (your <code>RouterProvider</code> belongs to the other copy), and crashes on the first render. This test reproduces it exactly as a student would, by pasting an import from an older tutorial:</p>
${pre('tsx', SN.tronDom)}
${out(OUT.tronDom)}
<p>The message says nothing about versions — "cannot destructure property 'basename' of … as it is null" — which is why this costs people an afternoon. In the browser you get React Router's default error screen, "Unexpected Application Error!", shown on the slide.</p>
<div class="pitfall co-tieu-de"><strong>Trap — two routers in <code>node_modules</code>.</strong> Symptom: a <code>Link</code>, <code>useNavigate</code> or <code>useParams</code> throws "…useContext(…) as it is null" or "may be used only in the context of a &lt;Router&gt; component", even though the component is obviously inside <code>RouterProvider</code>. Check: <code>npm ls react-router react-router-dom</code> — if you see two versions of <code>react-router</code>, that is the bug. Fix: <code>npm uninstall react-router-dom</code>, then replace every <code>'react-router-dom'</code> import with <code>'react-router'</code> (and <code>RouterProvider</code> with <code>'react-router/dom'</code>). One search-and-replace; the API names did not change.</div>
<p>React Router 8 also offers three "modes", and the docs choose the mode by which top-level API you use:</p>
<table>
<thead><tr><th>Mode</th><th>Top-level API</th><th>What you get</th></tr></thead>
<tbody>
<tr><td>Declarative</td><td><code>&lt;BrowserRouter&gt;</code> + <code>&lt;Routes&gt;&lt;Route&gt;</code></td><td>URL matching, links, params — the v6 style you see in FER202</td></tr>
<tr><td><strong>Data</strong></td><td><code>createBrowserRouter([...])</code> + <code>&lt;RouterProvider&gt;</code></td><td>everything above + <code>loader</code>, <code>action</code>, <code>ErrorBoundary</code>, <code>middleware</code>, pending states</td></tr>
<tr><td>Framework</td><td>Vite plugin + <code>routes.ts</code> + route modules</td><td>everything above + type-safe params, code splitting, SSR/SSG — a full framework like Next.js</td></tr>
</tbody>
</table>
<p>This course uses <strong>Data Mode</strong>: it is plain React + Vite (no extra build plugin to learn), the route table is ordinary data you can test, and it unlocks error boundaries and middleware, which Lesson 7.2 needs. Framework Mode is the subject of the comparison in Lesson 7.4.</p>

<h3>Your first route table</h3>
${slide('rx-07', 6, 'Bảng route: mỗi mẫu URL một component, :id là tham số, * là 404')}
<p>In Data Mode the routes are an array of plain objects, created <strong>outside</strong> any component. Each object says "for this <code>path</code>, render this <code>Component</code>":</p>
${pre('tsx', SN.routesBai1)}
<ul>
<li><code>path: '/bac-si/:id'</code> — a segment starting with <code>:</code> is a <strong>dynamic segment (đoạn động)</strong>: it matches any single value (<code>bs-2</code>, <code>abc</code>) and hands it to the component as a parameter named <code>id</code>.</li>
<li><code>path: '*'</code> — a <strong>splat (đoạn "bắt tất")</strong>: matches whatever no other route matched. It is how you make a 404 page. Order in the array does not matter: React Router ranks routes by how specific they are, so <code>/bac-si</code> always beats <code>*</code>.</li>
<li><code>Component: TrangChu</code> passes the component itself (the function). You will also see <code>element: &lt;TrangChu /&gt;</code> — an already-created element — which you need when you want to pass props, as Lesson 7.2 does. Both are valid; pick <code>Component</code> when there are no props.</li>
</ul>
<p>Then create the router once and render it. This is the entry file of the browser test project:</p>
${pre('tsx', SN.mainThu)}
<div class="callout"><p><strong>JS quick reminder — why "outside any component"?</strong> A component function runs again on every render. If you wrote <code>const router = createBrowserRouter(…)</code> inside <code>App</code>, every render would build a brand-new router and throw away the old one's state (current location, pending navigations). Code at the top level of a module runs <strong>once</strong>, when the file is first imported. The docs say it directly: data routers "should not be held in React state… create your router once outside of the React tree".</p></div>

<h3><code>Link</code>, not <code>&lt;a href&gt;</code> — measured</h3>
${slide('rx-07', 4, 'Link giữ app sống — a href tải lại từ đầu (đo trên Chromium)')}
<p>"Just use <code>Link</code>" is easy to say. Here is what the difference costs, measured. The browser project keeps a counter in <code>useState</code> in a component that stays on screen, and counts real page loads in <code>sessionStorage</code> (which survives a reload):</p>
${pre('tsx', SN.boDem)}
<p>A Playwright script presses "Tăng bộ đếm" three times, then clicks the <code>Link</code>, comes back, and clicks the plain <code>&lt;a href&gt;</code>, recording every network request in between:</p>
${pre('js', SN.doLink)}
${out(OUT.linkVsA)}
<ul>
<li><strong><code>Link</code>: 0 requests</strong>. Same document (page loads still 1), and the counter is still 3 — every <code>useState</code>, Zustand store and TanStack Query cache survived.</li>
<li><strong><code>&lt;a href&gt;</code>: 3 requests</strong> — the HTML document, the 313 kB JavaScript bundle and the CSS, all over again. Page loads went to 2 and the counter is back to 0. On this tiny app it is fast on localhost; on a phone on 4G with a real app it is a white flash and a second or two of nothing, and any unsaved form is gone.</li>
</ul>
<p>Plain <code>&lt;a&gt;</code> is still right for links that <em>leave</em> the SPA: another website, a PDF to download, a page served by a different app on the same domain. For every link <em>inside</em> your app, use <code>Link</code>. Because a <code>Link</code> renders a real <code>&lt;a href&gt;</code>, the user keeps everything they expect from a link: Ctrl/⌘-click to open in a new tab, "Copy link address", hover to see the URL.</p>

<h3><code>useParams</code>: parameters are strings — and may be missing</h3>
<p>The detail page reads <code>:id</code> from the URL with <code>useParams</code>:</p>
${pre('tsx', SN.trangChiTiet)}
<div class="callout"><p><strong>JS quick reminder — <code>const { id } = useParams&lt;'id'&gt;()</code>.</strong> <code>useParams()</code> returns an object like <code>{ id: 'bs-2' }</code>. The curly braces on the left are <em>destructuring (tách thuộc tính)</em>: "take the property <code>id</code> out of that object and put it in a variable named <code>id</code>". It is short for <code>const params = useParams(); const id = params.id;</code>. The <code>&lt;'id'&gt;</code> tells TypeScript which keys exist, so a typo like <code>params.ib</code> is an error. And <code>{&#96;/bac-si/&#36;{bs.id}&#96;}</code> in the list page is a <em>template literal</em>: a string in backticks where <code>&#36;{…}</code> inserts a value — <code>'/bac-si/' + bs.id</code>, written more readably.</p></div>
<p>Look at the type React Router gives you: <code>Params&lt;'id'&gt;</code> is <code>{ readonly id: string | undefined }</code>. Not <code>string</code>. The router cannot promise that the parameter exists, because the same component could be mounted under a route that has no <code>:id</code>. TypeScript makes you face that:</p>
${pre('tsx', SN.loiUseParams)}
${out(OUT.tscUseParams)}
<p>The fix is not <code>id!</code> (the "trust me" operator). Handle the case: <code>TrangChiTiet</code> above looks the doctor up with <code>find</code>, which accepts <code>undefined</code> happily and returns <code>undefined</code>, and then renders a clear "Không có bác sĩ …" message. Two different "not found"s exist here, and the tests keep them apart:</p>
<ul>
<li><code>/bac-si/bs-99</code> <strong>matches</strong> the route <code>/bac-si/:id</code> — the URL shape is fine, the <em>data</em> does not exist. The page itself must say so (in Lesson 7.2 a <code>loader</code> will throw a proper 404 for it).</li>
<li><code>/khong-co/trang/nay</code> matches <strong>no</strong> route except <code>*</code> — the router's 404.</li>
</ul>
<p>Parameters are always strings. <code>/lich-hen/42</code> gives you <code>'42'</code>; convert and validate yourself (<code>Number(id)</code>, then <code>Number.isInteger</code>) — the URL is user input, exactly like the query string in Lesson 5.4.</p>

<h3><code>NavLink</code>: a link that knows it is the current page</h3>
<p>A menu should show where you are. <code>NavLink</code> is a <code>Link</code> that compares its <code>to</code> with the current URL:</p>
${pre('tsx', SN.menu)}
<p>Rendered at <code>/bac-si/bs-2</code>, the test prints what each link got:</p>
${out(OUT.navlink)}
<ul>
<li>The active link gets <code>class="active"</code> (style it in CSS: <code>nav a.active { font-weight: 700 }</code>) and <strong><code>aria-current="page"</code></strong>, which screen readers announce as "current page". You get accessibility for free — do not strip it.</li>
<li>"Đội ngũ bác sĩ" (<code>/bac-si</code>) is active on <code>/bac-si/bs-2</code> too: by default a <code>NavLink</code> is active when the URL <em>starts with</em> its path, which is what you want for a section in a menu.</li>
<li>"Trang chủ" has <code>end</code>: active only on exactly <code>/</code>. Without <code>end</code> a link to <code>/</code> would be a prefix of every URL.</li>
<li>Need another class name? <code>className={({ isActive }) =&gt; isActive ? 'dang-chon' : ''}</code> — <code>className</code> accepts a function that receives the state.</li>
</ul>

<h3><code>useNavigate</code>: navigating from code</h3>
<p>Sometimes the page changes because something <em>finished</em>, not because the user clicked a link: the booking was saved, the login succeeded. For that there is <code>useNavigate</code>:</p>
${pre('tsx', SN.nutDatLich)}
${out(OUT.navigate)}
<ul>
<li><code>navigate('/lich-hen')</code> pushes a history entry, like a <code>Link</code>. <code>navigate('/lich-hen', { replace: true })</code> <em>replaces</em> the current entry — use it after a form submit so that Back does not return to a form that was already sent (Lesson 7.2 measures what forgetting <code>replace</code> does).</li>
<li><code>state</code> travels with the navigation and is read on the next page with <code>useLocation().state</code>. It lives in <code>history.state</code>: it survives F5 in the same tab but is <strong>not in the URL</strong>, so a shared link does not carry it. Good for "just booked, show a thank-you"; bad for anything the page needs to work.</li>
<li><code>navigate(-1)</code> is the Back button.</li>
</ul>
<p>Rule of thumb: if the user clicks something that <em>goes somewhere</em>, render a <code>Link</code> (it is a real link, keyboard and screen-reader friendly, openable in a new tab). Use <code>navigate</code> only <em>after</em> an action — a button that saves and then moves on.</p>

<h3><code>useSearchParams</code>: goodbye, hand-written URL hook</h3>
${slide('rx-07', 7, 'useSearchParams: chip thì push, ô tìm thì replace')}
<p>In Lesson 5.4 you wrote <code>useBoLocUrl</code> yourself: <code>pushState</code>, <code>replaceState</code>, a <code>popstate</code> listener with cleanup, and a trap where <code>pushState</code> alone did not re-render. With a router, all of that is one hook. <code>useSearchParams</code> returns the current query string as a <code>URLSearchParams</code> and a setter that navigates:</p>
${pre('tsx', SN.danhSachLoc)}
<div class="callout"><p><strong>JS quick reminder — two operators in this code.</strong> <code>sp.get('q') ?? ''</code> uses <em>nullish coalescing</em>: "if the left side is <code>null</code> or <code>undefined</code>, use the right side". (Unlike <code>||</code>, it does not replace <code>''</code> or <code>0</code>.) <code>setSp((prev) =&gt; …)</code> passes a function instead of a value — the same "updater" idea as <code>setState(x =&gt; x + 1)</code> in Chapter 2: you build the next params from the <em>current</em> ones, so setting <code>ck</code> keeps <code>q</code>.</p></div>
<p>The test clicks the "Nhi" chip, types "vy" into the search box, then presses Back once:</p>
${pre('tsx', SN.testSearch)}
${out(OUT.search)}
<ul>
<li>The chip produced a <strong>PUSH</strong> — a new history entry, so Back undoes the filter.</li>
<li>Two keystrokes with <code>{ replace: true }</code> produced <strong>REPLACE</strong>s — no extra entries. That is why one Back jumps straight from "Nhi + vy" to the unfiltered list. Without <code>replace</code> the user would press Back once per keystroke, the same 7-versus-0 history entries you measured in Lesson 5.4.</li>
<li>No <code>popstate</code> listener, no forgotten re-render: the router owns the URL, and every component that reads <code>useSearchParams</code> re-renders when it changes.</li>
</ul>
<p>What does <em>not</em> go away: validating what you read. <code>sp.get('ck')</code> can be <code>'tim-mach'</code> or <code>'toString'</code> if someone edits the URL. The project keeps Lesson 5.4's <code>docBoLoc</code> for that and only swaps the plumbing — you will do exactly that in the project lesson.</p>

<h3>Testing routes without a browser</h3>
<p><code>createBrowserRouter</code> reads the real address bar. In a test you want to <em>choose</em> the starting URL and inspect where the app went, so there is <code>createMemoryRouter</code>: the same router, with its history kept in memory.</p>
${pre('tsx', SN.veRouter)}
${pre('tsx', SN.testLink)}
${out(OUT.link)}
<p>Because the router object is returned, a test can read <code>router.state.location</code> (where are we?), <code>router.state.historyAction</code> (did that push or replace?) and call <code>router.navigate(-1)</code> (press Back). All seven tests of the lesson:</p>
${out(OUT.bai1Tong)}

<h3>F5 on a sub-page: the server must know the fallback</h3>
${slide('rx-07', 8, 'F5 ở /bac-si/bs-2: máy chủ tĩnh trả 404 nếu không có fallback')}
<p>Routing happens in the browser. But when the user presses F5 on <code>/bac-si/bs-2</code>, or opens that link from Zalo, the browser asks the <strong>server</strong> for <code>/bac-si/bs-2</code> — and after <code>vite build</code>, the server only has <code>index.html</code> and some files in <code>assets/</code>. What it answers depends on the server. Measured on the built browser project, first with <code>vite preview</code>, then with Python's plain static file server:</p>
${out(OUT.preview)}
${out(OUT.staticF5)}
<p><code>vite preview</code> answers 200 for every path because it knows it is serving an SPA and falls back to <code>index.html</code> (even <code>/khong-co</code> gets 200 — the <em>router</em> shows the 404 page afterwards). A plain static server looks for a file named <code>bac-si</code>, finds none, and returns its own 404 page: your app never even loads. This is the most common "it worked on my machine" bug when a student first deploys an SPA.</p>
<div class="pitfall co-tieu-de"><strong>Trap — deep links break only after deployment.</strong> Everything works in <code>npm run dev</code> and <code>vite preview</code>, and clicking through the deployed site works too (those are client-side navigations). Only F5 or opening a shared link on a sub-page returns 404. Fix it on the <strong>server</strong>: every path that is not a real file must return <code>index.html</code>. nginx: <code>try_files $uri /index.html;</code> · Netlify: a <code>_redirects</code> file with <code>/* /index.html 200</code> · Vercel/Cloudflare Pages: SPA mode or a rewrite rule. Test it after every deploy by opening a sub-page URL directly.</div>
<p>⏳ Not run for real here: deploying to an actual host (nginx, Netlify, Vercel) — this machine only ran <code>vite preview</code> and a local static server. <!-- CHAY-O-MAY: deploy dist/ của dự án lên một host tĩnh thật (Netlify/nginx), mở thẳng /bac-si/bs-2 trước và sau khi thêm fallback, chụp màn hình 404 và 200 --> The course's GitHub Actions deploy is in <a href="/courses/github-actions">/courses/github-actions</a>.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202 labs install <code>react-router-dom</code>, wrap the app in <code>&lt;BrowserRouter&gt;</code> and write <code>&lt;Routes&gt;&lt;Route path="/products/:id" element={&lt;Detail /&gt;} /&gt;&lt;/Routes&gt;</code> inside <code>App</code> — React Router 6, Declarative Mode — and sometimes navigate with <code>&lt;a href&gt;</code> or <code>window.location.href = …</code>. → A new project in 2026 installs <code>react-router</code> 8 only, defines routes as data with <code>createBrowserRouter</code> outside the component tree, renders <code>&lt;RouterProvider&gt;</code> from <code>react-router/dom</code>, uses <code>Link</code>/<code>NavLink</code> for every in-app link, keeps filters in <code>useSearchParams</code>, and tests routes with <code>createMemoryRouter</code>. · <em>Why:</em> the data router is what enables loaders, error boundaries and middleware (Lesson 7.2); a route table as data is testable; and <code>react-router-dom</code> is frozen at 7.x, so copying v6 tutorials into a v8 project silently installs a second router. The v6 JSX style is not wrong — it still runs in Declarative Mode, and you will meet it in older company codebases. When you do, the component and hook names are the same; only the setup around them differs.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "How does client-side routing work in an SPA, and why use <code>&lt;Link&gt;</code> instead of <code>&lt;a&gt;</code>?"</p>
<p>The server serves one HTML file; the router maps the URL to components in the browser. <code>Link</code> renders a real anchor but intercepts the click: <code>preventDefault</code>, <code>history.pushState</code> to change the URL, then re-render for the new route — no document request, so state, stores and caches survive (measured: 0 requests versus 3 and a reset counter for <code>&lt;a href&gt;</code>). Back/Forward fire <code>popstate</code>, which the router listens to. Because the server only knows <code>index.html</code>, production hosting needs a fallback that returns <code>index.html</code> for unknown paths, or deep links and F5 return 404. Plain <code>&lt;a&gt;</code> is still correct for external links and downloads.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> add a "Chuyên khoa" page to the lesson's route table: <code>/chuyen-khoa/:ma</code> lists the doctors of one specialty.</p><ol>
<li>In <code>src/vi-du/bai1.tsx</code>, write <code>TrangChuyenKhoa</code>: read <code>ma</code> with <code>useParams&lt;'ma'&gt;()</code>; if it is not a key of <code>TEN_CHUYEN_KHOA</code> (use <code>Object.hasOwn</code>), render <code>&lt;h1&gt;Không có chuyên khoa …&lt;/h1&gt;</code>; otherwise an <code>h1</code> with the specialty name and a list of <code>Link</code>s to each doctor's detail page.</li>
<li>Add the route to <code>routesBai1</code> and a <code>NavLink</code> "Khoa Nhi" (<code>/chuyen-khoa/nhi</code>) to <code>Menu</code>.</li>
<li>In <code>bai1.test.tsx</code>: <code>/chuyen-khoa/nhi</code> shows exactly 2 doctor links; <code>/chuyen-khoa/tim-mach</code> shows the "Không có" heading; on <code>/chuyen-khoa/nhi</code> the "Khoa Nhi" link has <code>aria-current="page"</code>; clicking "BS. Vũ Thảo Vy" lands on <code>/bac-si/bs-6</code> (check <code>router.state.location.pathname</code>).</li>
</ol><p><strong>Done when:</strong> <code>npx vitest run src/vi-du/bai1.test.tsx</code> shows 11 passing tests, <code>npx tsc -b</code> prints nothing, and <code>npm ls react-router-dom</code> prints <code>(empty)</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">SPA (single-page app)</span><span class="v">one HTML document; JavaScript swaps the content when the URL changes</span></div>
<div class="kv"><span class="k">route table</span><span class="v">the array that maps URL patterns to components (<code>createBrowserRouter([...])</code>)</span></div>
<div class="kv"><span class="k">dynamic segment <code>:id</code></span><span class="v">a path part that matches any value and becomes a param</span></div>
<div class="kv"><span class="k">splat <code>*</code></span><span class="v">matches whatever else; used for the 404 route; value in <code>params['*']</code></span></div>
<div class="kv"><span class="k"><code>Link</code> / <code>NavLink</code></span><span class="v">in-app links without a page load; <code>NavLink</code> adds <code>active</code> + <code>aria-current</code></span></div>
<div class="kv"><span class="k"><code>useSearchParams</code></span><span class="v">read/write the query string through the router (push or replace)</span></div>
<div class="kv"><span class="k"><code>createMemoryRouter</code></span><span class="v">a router whose history lives in memory — for tests</span></div>
<div class="kv"><span class="k">SPA fallback</span><span class="v">server rule: unknown paths return <code>index.html</code></span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A router maps URLs to components in the browser; changing page = <code>pushState</code> + re-render, not a new document.</li>
<li>React Router 8: install <code>react-router</code> only, import <code>RouterProvider</code> from <code>react-router/dom</code>. <code>react-router-dom</code> is frozen at 7.18.4 and mixing it in crashes at the first <code>Link</code>.</li>
<li>Data Mode: routes as an array created once outside components; <code>:id</code> for params, <code>*</code> for 404.</li>
<li><code>Link</code> kept the counter at 3 with 0 requests; <code>&lt;a href&gt;</code> fired 3 requests and reset it to 0.</li>
<li><code>useParams</code> gives <code>string | undefined</code>; handle both "no such data" and "no such route". <code>NavLink</code> marks the current page; <code>navigate</code> is for after an action; <code>useSearchParams</code> replaces the Chapter 5 hook.</li>
<li>F5 on a sub-page needs an <code>index.html</code> fallback on the server: 200 on <code>vite preview</code>, 404 on a plain static server.</li>
</ul>

${LINK('https://reactrouter.com/start/modes', '📄', 'React Router — Picking a Mode', 'Declarative, Data and Framework Mode, and the table of which API works in which.')}
${LINK('https://reactrouter.com/start/data/routing', '📄', 'React Router — Routing (Data Mode)', 'Route objects, nested routes, dynamic segments, optional segments and splats.')}
${LINK('https://reactrouter.com/upgrading/v7', '📄', 'React Router — Upgrading from v7', 'What v8 removed, including the react-router-dom package.')}
${LINK('https://react.dev/learn/build-a-react-app-from-scratch#routing', '📄', 'react.dev — Build a React app from scratch: Routing', 'Why an SPA needs a router, and which routers the React team lists.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>React Router căn bản: route, link, tham số — và những gì đã đổi từ bản 6</h2>
<p class="lead">Tới giờ app phòng khám là một trang dài: danh sách bác sĩ, luồng đặt lịch và "lịch hẹn của tôi" chồng lên nhau. App thật có nhiều trang — một danh sách lưu bookmark được, một trang chi tiết gửi được cho bạn bè, một nút Back quay về đúng chỗ. Trong một ứng dụng một trang (SPA), không ai cho sẵn những thứ đó: trình duyệt tải <code>index.html</code> đúng một lần, từ đó trở đi <em>JavaScript của bạn</em> quyết định một URL nghĩa là gì. Việc đó gọi là <strong>routing (định tuyến)</strong>, và thư viện gần như mọi công ty React dùng cho nó là React Router.</p>
<p>Ví dụ ở <code>src/vi-du/bai1.tsx</code> và <code>src/vi-du/bai1.test.tsx</code> của dự án thử (React 19.3.0, <strong>react-router 8.4.0</strong>, Vitest 5.0.1). Phép đo trên trình duyệt lấy từ một dự án Vite nhỏ riêng, do Playwright điều khiển trên một Chromium thật. Một lời cảnh báo trước khi bắt đầu: phần lớn bài hướng dẫn trên mạng — và slide FER202 — viết cho React Router <strong>6</strong>. Bản 8 (bản hiện tại, tính đến 09/2026) giữ nguyên ý tưởng nhưng đổi tên gói và cách dựng khuyên dùng, và trộn hai bản với nhau là một cú sập bạn sẽ thấy ngay trong bài này.</p>

<h3>Một trang, nhiều URL: router thật ra làm gì</h3>
${slide('rx-07', 3, 'Router đọc URL rồi chọn component — không tải lại trang')}
<p>Website kiểu cũ có mỗi trang một file HTML. Bấm một link, trình duyệt vứt trang hiện tại, hỏi máy chủ file HTML kế tiếp, rồi bắt đầu lại từ số 0: mọi biến JavaScript mất sạch, mọi <code>useState</code> về giá trị ban đầu. SPA làm khác. Máy chủ gửi một <code>index.html</code> gần như rỗng và một gói JavaScript; sau đó "đổi trang" nghĩa là <strong>đổi URL trên thanh địa chỉ mà không hỏi máy chủ</strong>, rồi vẽ một component khác cho URL mới.</p>
<p>Bạn đã tự làm một nửa việc này ở Bài 5.4: <code>history.pushState</code> đổi URL mà không tải lại, sự kiện <code>popstate</code> báo khi người dùng bấm Back. Router chính là đoạn mã đó, làm cho xong và làm cho tổng quát:</p>
<ul>
<li>một <strong>bảng route</strong> nối mẫu URL như <code>/bac-si/:id</code> với component;</li>
<li>một <strong>component link</strong> biến cú bấm thành <code>pushState</code> thay vì tải trang;</li>
<li>các hook cho bất kỳ component nào biết "URL hiện tại là gì, tham số của nó là gì";</li>
<li>và — phần khó tự viết — <strong>route lồng nhau</strong>, layout, trang lỗi, chuyển hướng và tải dữ liệu, là nội dung Bài 7.2.</li>
</ul>
<p><strong>Chạy thử từng bước</strong> — chuyện gì xảy ra khi người dùng bấm <code>&lt;Link to="/bac-si"&gt;</code>:</p>
<ol>
<li>Trình duyệt bắn một cú click bình thường lên thẻ <code>&lt;a href="/bac-si"&gt;</code> (một <code>Link</code> <em>chính là</em> một thẻ <code>&lt;a&gt;</code> thật trong DOM).</li>
<li>Hàm xử lý click của React Router gọi <code>event.preventDefault()</code>, nên trình duyệt <strong>không</strong> bắt đầu tải tài liệu mới.</li>
<li>Nó gọi <code>history.pushState(…, '/bac-si')</code>: thanh địa chỉ đổi và lịch sử có thêm một mục.</li>
<li>Router so <code>/bac-si</code> với bảng route, tìm ra component, rồi cập nhật state của nó bên trong <code>React.startTransition</code> (để React giữ màn hình cũ tới khi màn mới sẵn sàng).</li>
<li>React vẽ component mới và chỉ sửa DOM chỗ khác. Bộ nhớ JavaScript, mọi store, mọi cache vẫn nguyên.</li>
</ol>

<h3>Cài đặt — và cái bẫy tên gói</h3>
${slide('rx-07', 5, 'React Router 8 chỉ còn gói react-router — trộn bản 7 là sập')}
<p>Dự án thử đã cài sẵn router. Đây là những gì npm nói về nó, và về cái gói mà mọi bài hướng dẫn cũ bảo bạn cài:</p>
${out(OUT.npm)}
<p>Đọc kỹ bốn câu trả lời đó, vì chúng giải thích rất nhiều câu hỏi rối trên Stack Overflow:</p>
<ul>
<li>Gói tên là <code>react-router</code>, bản mới nhất <strong>8.4.0</strong>. Mọi thứ — <code>Link</code>, <code>useParams</code>, <code>createBrowserRouter</code> — import từ <code>'react-router'</code>. Thứ duy nhất cần tới DOM là <code>RouterProvider</code>, import từ <code>'react-router/dom'</code>.</li>
<li><code>react-router-dom</code> là tên ở bản 6. Sang bản 7 nó chỉ còn là lớp vỏ xuất lại <code>react-router</code>, và <strong>bản 8 đã gỡ bỏ nó</strong> (changelog v8: <em>"Remove react-router-dom package"</em>). Vì thế bản mới nhất của nó trên npm đứng yên ở <strong>7.18.4</strong>, và nó phụ thuộc <code>react-router@7.18.4</code>.</li>
</ul>
<p>Nên <code>npm install react-router-dom</code> vẫn "chạy được" — chỉ là nó cài <em>thêm một bản router thứ hai, cũ hơn</em>, nằm cạnh bản của bạn:</p>
${out(OUT.npmDom)}
<p>Hai router nghĩa là hai context React tách biệt. Một <code>Link</code> import từ <code>react-router-dom</code> đi tìm context router <em>của nó</em>, không thấy gì (vì <code>RouterProvider</code> của bạn thuộc bản kia), và sập ngay lần render đầu. Test này tái hiện đúng như cách một sinh viên hay làm — dán một dòng import từ bài hướng dẫn cũ:</p>
${pre('tsx', SN.tronDom)}
${out(OUT.tronDom)}
<p>Thông báo không nói gì về phiên bản — "cannot destructure property 'basename' of … as it is null" — nên chuyện này tốn của người ta cả buổi chiều. Trên trình duyệt, bạn thấy màn hình lỗi mặc định của React Router, "Unexpected Application Error!", có trên slide.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — hai router trong <code>node_modules</code>.</strong> Triệu chứng: <code>Link</code>, <code>useNavigate</code> hay <code>useParams</code> ném "…useContext(…) as it is null" hoặc "may be used only in the context of a &lt;Router&gt; component", dù component rõ ràng nằm trong <code>RouterProvider</code>. Kiểm: <code>npm ls react-router react-router-dom</code> — thấy hai phiên bản <code>react-router</code> là đúng bệnh. Chữa: <code>npm uninstall react-router-dom</code>, rồi đổi mọi import <code>'react-router-dom'</code> thành <code>'react-router'</code> (riêng <code>RouterProvider</code> thành <code>'react-router/dom'</code>). Một lần tìm-và-thay; tên API không đổi.</div>
<p>React Router 8 còn có ba "chế độ" (mode), và tài liệu chọn mode theo API cấp cao nhất bạn dùng:</p>
<table>
<thead><tr><th>Mode</th><th>API cấp cao nhất</th><th>Bạn được gì</th></tr></thead>
<tbody>
<tr><td>Declarative</td><td><code>&lt;BrowserRouter&gt;</code> + <code>&lt;Routes&gt;&lt;Route&gt;</code></td><td>khớp URL, link, tham số — kiểu bản 6 bạn thấy ở FER202</td></tr>
<tr><td><strong>Data</strong></td><td><code>createBrowserRouter([...])</code> + <code>&lt;RouterProvider&gt;</code></td><td>tất cả những thứ trên + <code>loader</code>, <code>action</code>, <code>ErrorBoundary</code>, <code>middleware</code>, trạng thái đang chuyển trang</td></tr>
<tr><td>Framework</td><td>plugin Vite + <code>routes.ts</code> + route module</td><td>tất cả những thứ trên + tham số có kiểu, tự chia nhỏ mã, SSR/SSG — một framework đầy đủ như Next.js</td></tr>
</tbody>
</table>
<p>Khoá này dùng <strong>Data Mode</strong>: vẫn là React + Vite thuần (không thêm plugin build nào phải học), bảng route là dữ liệu thường nên test được, và nó mở khoá error boundary cùng middleware mà Bài 7.2 cần. Framework Mode là một vế của phép so sánh ở Bài 7.4.</p>

<h3>Bảng route đầu tiên</h3>
${slide('rx-07', 6, 'Bảng route: mỗi mẫu URL một component, :id là tham số, * là 404')}
<p>Ở Data Mode, route là một mảng object bình thường, tạo <strong>bên ngoài</strong> mọi component. Mỗi object nói "với <code>path</code> này, vẽ <code>Component</code> này":</p>
${pre('tsx', SN.routesBai1)}
<ul>
<li><code>path: '/bac-si/:id'</code> — đoạn bắt đầu bằng <code>:</code> là <strong>dynamic segment (đoạn động)</strong>: nó khớp một giá trị bất kỳ (<code>bs-2</code>, <code>abc</code>) và trao cho component dưới dạng tham số tên <code>id</code>.</li>
<li><code>path: '*'</code> — <strong>splat (đoạn "bắt tất")</strong>: khớp mọi thứ mà không route nào khác khớp. Đó là cách làm trang 404. Thứ tự trong mảng không quan trọng: React Router xếp hạng route theo độ cụ thể, nên <code>/bac-si</code> luôn thắng <code>*</code>.</li>
<li><code>Component: TrangChu</code> truyền chính component (cái hàm). Bạn cũng sẽ gặp <code>element: &lt;TrangChu /&gt;</code> — một element đã tạo sẵn — cần khi muốn truyền props, như Bài 7.2 làm. Cả hai đều đúng; không có props thì chọn <code>Component</code>.</li>
</ul>
<p>Rồi tạo router một lần và vẽ nó. Đây là file khởi động của dự án thử trên trình duyệt:</p>
${pre('tsx', SN.mainThu)}
<div class="callout"><p><strong>JS nhắc nhanh — vì sao "bên ngoài mọi component"?</strong> Hàm component chạy lại mỗi lần render. Nếu viết <code>const router = createBrowserRouter(…)</code> bên trong <code>App</code>, mỗi lần render sẽ dựng một router mới tinh và vứt state của cái cũ (vị trí hiện tại, lượt chuyển trang đang dở). Mã ở cấp cao nhất của một module chạy <strong>đúng một lần</strong>, lúc file được import lần đầu. Tài liệu nói thẳng: data router "không nên giữ trong state React… hãy tạo router một lần, bên ngoài cây React".</p></div>

<h3><code>Link</code>, không phải <code>&lt;a href&gt;</code> — đo thật</h3>
${slide('rx-07', 4, 'Link giữ app sống — a href tải lại từ đầu (đo trên Chromium)')}
<p>"Cứ dùng <code>Link</code>" thì nói dễ. Đây là cái giá của sự khác biệt, đo thật. Dự án trình duyệt giữ một bộ đếm trong <code>useState</code> ở một component luôn nằm trên màn hình, và đếm số lần tải trang thật trong <code>sessionStorage</code> (thứ sống qua tải lại):</p>
${pre('tsx', SN.boDem)}
<p>Một script Playwright bấm "Tăng bộ đếm" ba lần, rồi bấm <code>Link</code>, quay về, rồi bấm thẻ <code>&lt;a href&gt;</code> trần, ghi lại mọi request mạng ở giữa:</p>
${pre('js', SN.doLink)}
${out(OUT.linkVsA)}
<ul>
<li><strong><code>Link</code>: 0 request</strong>. Vẫn tài liệu cũ (số lần tải trang vẫn 1), bộ đếm vẫn 3 — mọi <code>useState</code>, store Zustand và cache TanStack Query còn nguyên.</li>
<li><strong><code>&lt;a href&gt;</code>: 3 request</strong> — tài liệu HTML, gói JavaScript 313 kB và CSS, tải lại từ đầu. Số lần tải trang lên 2, bộ đếm về 0. App bé tí trên localhost thì nhanh; trên điện thoại dùng 4G với một app thật thì là một cú chớp trắng, một hai giây trống trơn, và form gõ dở biến mất.</li>
</ul>
<p><code>&lt;a&gt;</code> trần vẫn đúng cho link <em>rời khỏi</em> SPA: sang website khác, tải một file PDF, sang một trang do app khác phục vụ trên cùng tên miền. Mọi link <em>bên trong</em> app thì dùng <code>Link</code>. Vì <code>Link</code> vẽ ra một <code>&lt;a href&gt;</code> thật, người dùng vẫn có mọi thứ họ chờ đợi ở một đường link: Ctrl/⌘-click mở tab mới, "Sao chép địa chỉ liên kết", rê chuột xem URL.</p>

<h3><code>useParams</code>: tham số là chuỗi — và có thể không có</h3>
<p>Trang chi tiết đọc <code>:id</code> từ URL bằng <code>useParams</code>:</p>
${pre('tsx', SN.trangChiTiet)}
<div class="callout"><p><strong>JS nhắc nhanh — <code>const { id } = useParams&lt;'id'&gt;()</code>.</strong> <code>useParams()</code> trả về một object kiểu <code>{ id: 'bs-2' }</code>. Cặp ngoặc nhọn bên trái là <em>destructuring (tách thuộc tính)</em>: "lấy thuộc tính <code>id</code> ra khỏi object đó, đặt vào biến tên <code>id</code>". Nó là cách viết ngắn của <code>const params = useParams(); const id = params.id;</code>. Phần <code>&lt;'id'&gt;</code> báo TypeScript có những khoá nào, nên gõ nhầm <code>params.ib</code> là lỗi. Còn <code>{&#96;/bac-si/&#36;{bs.id}&#96;}</code> ở trang danh sách là <em>template literal</em>: chuỗi trong dấu backtick, <code>&#36;{…}</code> chèn giá trị vào — tức <code>'/bac-si/' + bs.id</code>, viết cho dễ đọc.</p></div>
<p>Nhìn kiểu React Router đưa cho bạn: <code>Params&lt;'id'&gt;</code> là <code>{ readonly id: string | undefined }</code>. Không phải <code>string</code>. Router không hứa được là tham số có mặt, vì cùng một component có thể được gắn dưới một route không có <code>:id</code>. TypeScript bắt bạn đối mặt với chuyện đó:</p>
${pre('tsx', SN.loiUseParams)}
${out(OUT.tscUseParams)}
<p>Cách chữa không phải <code>id!</code> (toán tử "tin tôi đi"). Hãy xử lý trường hợp đó: <code>TrangChiTiet</code> ở trên tìm bác sĩ bằng <code>find</code> — nhận <code>undefined</code> vô tư và trả về <code>undefined</code> — rồi vẽ một thông báo rõ ràng "Không có bác sĩ …". Ở đây có hai kiểu "không tìm thấy" khác nhau, và các test giữ chúng tách bạch:</p>
<ul>
<li><code>/bac-si/bs-99</code> <strong>khớp</strong> route <code>/bac-si/:id</code> — hình dạng URL đúng, chỉ là <em>dữ liệu</em> không tồn tại. Chính trang đó phải nói ra (Bài 7.2 sẽ cho một <code>loader</code> ném 404 đàng hoàng).</li>
<li><code>/khong-co/trang/nay</code> <strong>không</strong> khớp route nào ngoài <code>*</code> — 404 của router.</li>
</ul>
<p>Tham số luôn là chuỗi. <code>/lich-hen/42</code> cho bạn <code>'42'</code>; tự đổi kiểu và tự kiểm (<code>Number(id)</code>, rồi <code>Number.isInteger</code>) — URL là dữ liệu người dùng nhập, y như chuỗi truy vấn ở Bài 5.4.</p>

<h3><code>NavLink</code>: link biết mình là trang hiện tại</h3>
<p>Menu nên cho biết bạn đang ở đâu. <code>NavLink</code> là một <code>Link</code> biết so <code>to</code> của nó với URL hiện tại:</p>
${pre('tsx', SN.menu)}
<p>Vẽ ở <code>/bac-si/bs-2</code>, test in ra mỗi link nhận được gì:</p>
${out(OUT.navlink)}
<ul>
<li>Link đang chọn được <code>class="active"</code> (tô bằng CSS: <code>nav a.active { font-weight: 700 }</code>) và <strong><code>aria-current="page"</code></strong>, thứ trình đọc màn hình đọc thành "trang hiện tại". Khả năng tiếp cận có sẵn — đừng gỡ nó đi.</li>
<li>"Đội ngũ bác sĩ" (<code>/bac-si</code>) cũng sáng ở <code>/bac-si/bs-2</code>: mặc định một <code>NavLink</code> sáng khi URL <em>bắt đầu bằng</em> đường dẫn của nó — đúng ý bạn với một mục trong menu.</li>
<li>"Trang chủ" có <code>end</code>: chỉ sáng khi đúng <code>/</code>. Thiếu <code>end</code>, link tới <code>/</code> là tiền tố của mọi URL.</li>
<li>Cần tên class khác? <code>className={({ isActive }) =&gt; isActive ? 'dang-chon' : ''}</code> — <code>className</code> nhận một hàm có tham số là trạng thái.</li>
</ul>

<h3><code>useNavigate</code>: điều hướng bằng code</h3>
<p>Có lúc trang đổi vì một việc vừa <em>xong</em>, không phải vì người dùng bấm link: lịch hẹn đã lưu, đăng nhập đã thành công. Cho việc đó có <code>useNavigate</code>:</p>
${pre('tsx', SN.nutDatLich)}
${out(OUT.navigate)}
<ul>
<li><code>navigate('/lich-hen')</code> đẩy thêm một mục lịch sử, như <code>Link</code>. <code>navigate('/lich-hen', { replace: true })</code> <em>thay</em> mục hiện tại — dùng sau khi gửi form, để Back không quay lại một form đã gửi rồi (Bài 7.2 đo chuyện quên <code>replace</code>).</li>
<li><code>state</code> đi kèm lượt chuyển trang, trang sau đọc bằng <code>useLocation().state</code>. Nó sống trong <code>history.state</code>: qua được F5 trong cùng tab nhưng <strong>không nằm trên URL</strong>, nên link chia sẻ không mang theo. Hợp cho "vừa đặt xong, hiện lời cảm ơn"; không hợp cho thứ trang cần để chạy được.</li>
<li><code>navigate(-1)</code> là nút Back.</li>
</ul>
<p>Quy tắc: người dùng bấm vào thứ gì <em>dẫn đi đâu đó</em> thì vẽ <code>Link</code> (một link thật, dùng được bằng bàn phím và trình đọc màn hình, mở được ở tab mới). Chỉ dùng <code>navigate</code> <em>sau</em> một hành động — một nút lưu xong rồi mới chuyển.</p>

<h3><code>useSearchParams</code>: tạm biệt hook URL tự viết</h3>
${slide('rx-07', 7, 'useSearchParams: chip thì push, ô tìm thì replace')}
<p>Ở Bài 5.4 bạn tự viết <code>useBoLocUrl</code>: <code>pushState</code>, <code>replaceState</code>, một listener <code>popstate</code> có cleanup, và một cái bẫy là <code>pushState</code> một mình không làm render lại. Có router rồi, tất cả gói trong một hook. <code>useSearchParams</code> trả về chuỗi truy vấn hiện tại dưới dạng <code>URLSearchParams</code> cùng một hàm set có điều hướng:</p>
${pre('tsx', SN.danhSachLoc)}
<div class="callout"><p><strong>JS nhắc nhanh — hai toán tử trong đoạn này.</strong> <code>sp.get('q') ?? ''</code> dùng <em>nullish coalescing</em>: "vế trái là <code>null</code> hoặc <code>undefined</code> thì lấy vế phải". (Khác <code>||</code>, nó không thay <code>''</code> hay <code>0</code>.) <code>setSp((prev) =&gt; …)</code> truyền một hàm thay vì một giá trị — cùng ý tưởng "hàm cập nhật" với <code>setState(x =&gt; x + 1)</code> ở Chương 2: bạn dựng params kế tiếp từ params <em>hiện tại</em>, nên đặt <code>ck</code> vẫn giữ <code>q</code>.</p></div>
<p>Test bấm chip "Nhi", gõ "vy" vào ô tìm, rồi bấm Back một lần:</p>
${pre('tsx', SN.testSearch)}
${out(OUT.search)}
<ul>
<li>Chip sinh ra một <strong>PUSH</strong> — một mục lịch sử mới, nên Back huỷ được lần lọc.</li>
<li>Hai phím gõ với <code>{ replace: true }</code> sinh ra các <strong>REPLACE</strong> — không thêm mục nào. Vì thế một lần Back nhảy thẳng từ "Nhi + vy" về danh sách chưa lọc. Thiếu <code>replace</code>, người dùng phải bấm Back mỗi phím một lần — đúng chuyện 7 mục so với 0 mục lịch sử bạn đã đo ở Bài 5.4.</li>
<li>Không listener <code>popstate</code>, không quên render lại: router làm chủ URL, và mọi component đọc <code>useSearchParams</code> tự render lại khi nó đổi.</li>
</ul>
<p>Thứ <em>không</em> biến mất: kiểm những gì đọc được. <code>sp.get('ck')</code> có thể là <code>'tim-mach'</code> hay <code>'toString'</code> nếu ai đó sửa URL. Dự án giữ <code>docBoLoc</code> của Bài 5.4 cho việc đó và chỉ thay phần ống nước — bạn sẽ làm đúng như vậy ở bài dự án.</p>

<h3>Test route không cần trình duyệt</h3>
<p><code>createBrowserRouter</code> đọc thanh địa chỉ thật. Trong test, bạn muốn <em>chọn</em> URL bắt đầu và xem app đã đi tới đâu, nên có <code>createMemoryRouter</code>: cùng một router, chỉ là lịch sử giữ trong bộ nhớ.</p>
${pre('tsx', SN.veRouter)}
${pre('tsx', SN.testLink)}
${out(OUT.link)}
<p>Vì hàm trả router ra, test đọc được <code>router.state.location</code> (đang ở đâu?), <code>router.state.historyAction</code> (vừa push hay replace?) và gọi được <code>router.navigate(-1)</code> (bấm Back). Cả bảy test của bài:</p>
${out(OUT.bai1Tong)}

<h3>F5 ở một trang con: máy chủ phải biết đường lui</h3>
${slide('rx-07', 8, 'F5 ở /bac-si/bs-2: máy chủ tĩnh trả 404 nếu không có fallback')}
<p>Định tuyến diễn ra trong trình duyệt. Nhưng khi người dùng bấm F5 ở <code>/bac-si/bs-2</code>, hay mở link đó từ Zalo, trình duyệt hỏi <strong>máy chủ</strong> đường dẫn <code>/bac-si/bs-2</code> — mà sau <code>vite build</code>, máy chủ chỉ có <code>index.html</code> và vài file trong <code>assets/</code>. Nó trả lời gì tuỳ máy chủ. Đo trên bản build của dự án trình duyệt, lần đầu với <code>vite preview</code>, lần sau với máy chủ file tĩnh trần của Python:</p>
${out(OUT.preview)}
${out(OUT.staticF5)}
<p><code>vite preview</code> trả 200 cho mọi đường dẫn vì nó biết mình đang phục vụ một SPA và lùi về <code>index.html</code> (kể cả <code>/khong-co</code> cũng được 200 — <em>router</em> vẽ trang 404 sau đó). Máy chủ tĩnh trần đi tìm một file tên <code>bac-si</code>, không thấy, và trả trang 404 của chính nó: app của bạn còn chưa kịp tải. Đây là lỗi "máy em chạy được mà" phổ biến nhất khi sinh viên deploy SPA lần đầu.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — link sâu chỉ hỏng sau khi deploy.</strong> Mọi thứ chạy trong <code>npm run dev</code> và <code>vite preview</code>, bấm qua lại trên site đã deploy cũng chạy (đó là điều hướng phía trình duyệt). Chỉ F5 hoặc mở link chia sẻ tới một trang con là ra 404. Chữa ở <strong>máy chủ</strong>: mọi đường dẫn không phải file thật phải trả về <code>index.html</code>. nginx: <code>try_files $uri /index.html;</code> · Netlify: file <code>_redirects</code> với dòng <code>/* /index.html 200</code> · Vercel/Cloudflare Pages: chế độ SPA hoặc một luật rewrite. Kiểm sau mỗi lần deploy bằng cách mở thẳng URL một trang con.</div>
<p>⏳ Chưa chạy thật: deploy lên một host thật (nginx, Netlify, Vercel) — máy dựng bài chỉ chạy <code>vite preview</code> và một máy chủ tĩnh cục bộ. <!-- CHAY-O-MAY: deploy dist/ của dự án lên một host tĩnh thật (Netlify/nginx), mở thẳng /bac-si/bs-2 trước và sau khi thêm fallback, chụp màn hình 404 và 200 --> Phần deploy bằng GitHub Actions nằm ở khoá <a href="/courses/github-actions">/courses/github-actions</a>.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Bài lab FER202 cài <code>react-router-dom</code>, bọc app trong <code>&lt;BrowserRouter&gt;</code> và viết <code>&lt;Routes&gt;&lt;Route path="/products/:id" element={&lt;Detail /&gt;} /&gt;&lt;/Routes&gt;</code> ngay trong <code>App</code> — React Router 6, Declarative Mode — đôi khi chuyển trang bằng <code>&lt;a href&gt;</code> hay <code>window.location.href = …</code>. → Một dự án mới năm 2026 chỉ cài <code>react-router</code> 8, khai route dưới dạng dữ liệu bằng <code>createBrowserRouter</code> ngoài cây component, vẽ <code>&lt;RouterProvider&gt;</code> từ <code>react-router/dom</code>, dùng <code>Link</code>/<code>NavLink</code> cho mọi link trong app, giữ bộ lọc bằng <code>useSearchParams</code>, và test route bằng <code>createMemoryRouter</code>. · <em>Vì sao:</em> data router là thứ mở ra loader, error boundary và middleware (Bài 7.2); bảng route là dữ liệu nên test được; và <code>react-router-dom</code> đã đứng yên ở 7.x, nên chép bài hướng dẫn bản 6 vào dự án bản 8 là âm thầm cài thêm một router thứ hai. Kiểu JSX của bản 6 không sai — nó vẫn chạy ở Declarative Mode, và bạn sẽ gặp nó trong mã cũ của công ty. Khi gặp, tên component và hook vẫn thế; chỉ phần dựng xung quanh là khác.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Định tuyến phía client trong SPA hoạt động thế nào, và vì sao dùng <code>&lt;Link&gt;</code> thay cho <code>&lt;a&gt;</code>?"</p>
<p>Máy chủ phục vụ một file HTML; router nối URL với component ngay trong trình duyệt. <code>Link</code> vẽ ra một thẻ a thật nhưng chặn cú click: <code>preventDefault</code>, <code>history.pushState</code> để đổi URL, rồi render lại cho route mới — không có request tài liệu nào, nên state, store và cache còn nguyên (đo thật: 0 request, so với 3 request và bộ đếm về 0 của <code>&lt;a href&gt;</code>). Back/Forward bắn <code>popstate</code>, router nghe sự kiện đó. Vì máy chủ chỉ biết <code>index.html</code>, lúc chạy thật cần một luật fallback trả <code>index.html</code> cho đường dẫn lạ, không thì link sâu và F5 ra 404. <code>&lt;a&gt;</code> trần vẫn đúng cho link ra ngoài và tải file.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> thêm trang "Chuyên khoa" vào bảng route của bài: <code>/chuyen-khoa/:ma</code> liệt kê bác sĩ của một chuyên khoa.</p><ol>
<li>Trong <code>src/vi-du/bai1.tsx</code>, viết <code>TrangChuyenKhoa</code>: đọc <code>ma</code> bằng <code>useParams&lt;'ma'&gt;()</code>; nếu nó không phải khoá của <code>TEN_CHUYEN_KHOA</code> (dùng <code>Object.hasOwn</code>) thì vẽ <code>&lt;h1&gt;Không có chuyên khoa …&lt;/h1&gt;</code>; ngược lại vẽ một <code>h1</code> tên chuyên khoa và danh sách <code>Link</code> tới trang chi tiết từng bác sĩ.</li>
<li>Thêm route vào <code>routesBai1</code> và một <code>NavLink</code> "Khoa Nhi" (<code>/chuyen-khoa/nhi</code>) vào <code>Menu</code>.</li>
<li>Trong <code>bai1.test.tsx</code>: <code>/chuyen-khoa/nhi</code> hiện đúng 2 link bác sĩ; <code>/chuyen-khoa/tim-mach</code> hiện tiêu đề "Không có"; ở <code>/chuyen-khoa/nhi</code> link "Khoa Nhi" có <code>aria-current="page"</code>; bấm "BS. Vũ Thảo Vy" thì tới <code>/bac-si/bs-6</code> (kiểm <code>router.state.location.pathname</code>).</li>
</ol><p><strong>Đạt khi:</strong> <code>npx vitest run src/vi-du/bai1.test.tsx</code> báo 11 test xanh, <code>npx tsc -b</code> không in gì, và <code>npm ls react-router-dom</code> in <code>(empty)</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">SPA (ứng dụng một trang)</span><span class="v">một tài liệu HTML; JavaScript thay nội dung khi URL đổi</span></div>
<div class="kv"><span class="k">bảng route</span><span class="v">mảng nối mẫu URL với component (<code>createBrowserRouter([...])</code>)</span></div>
<div class="kv"><span class="k">dynamic segment <code>:id</code> (đoạn động)</span><span class="v">một phần đường dẫn khớp giá trị bất kỳ, thành tham số</span></div>
<div class="kv"><span class="k">splat <code>*</code></span><span class="v">khớp mọi thứ còn lại; dùng cho route 404; giá trị ở <code>params['*']</code></span></div>
<div class="kv"><span class="k"><code>Link</code> / <code>NavLink</code></span><span class="v">link trong app không tải trang; <code>NavLink</code> thêm <code>active</code> + <code>aria-current</code></span></div>
<div class="kv"><span class="k"><code>useSearchParams</code></span><span class="v">đọc/ghi chuỗi truy vấn qua router (push hoặc replace)</span></div>
<div class="kv"><span class="k"><code>createMemoryRouter</code></span><span class="v">router giữ lịch sử trong bộ nhớ — dùng cho test</span></div>
<div class="kv"><span class="k">SPA fallback (đường lui)</span><span class="v">luật ở máy chủ: đường dẫn lạ trả về <code>index.html</code></span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Router nối URL với component ngay trong trình duyệt; đổi trang = <code>pushState</code> + render lại, không phải tải tài liệu mới.</li>
<li>React Router 8: chỉ cài <code>react-router</code>, import <code>RouterProvider</code> từ <code>react-router/dom</code>. <code>react-router-dom</code> đứng yên ở 7.18.4, trộn vào là sập ngay <code>Link</code> đầu tiên.</li>
<li>Data Mode: route là một mảng tạo một lần ngoài component; <code>:id</code> cho tham số, <code>*</code> cho 404.</li>
<li><code>Link</code> giữ bộ đếm ở 3 với 0 request; <code>&lt;a href&gt;</code> bắn 3 request và đưa nó về 0.</li>
<li><code>useParams</code> cho <code>string | undefined</code>; xử lý cả "không có dữ liệu" lẫn "không có route". <code>NavLink</code> đánh dấu trang hiện tại; <code>navigate</code> dành cho sau một hành động; <code>useSearchParams</code> thay hook của Chương 5.</li>
<li>F5 ở trang con cần máy chủ lùi về <code>index.html</code>: 200 với <code>vite preview</code>, 404 với máy chủ tĩnh trần.</li>
</ul>

${LINK('https://reactrouter.com/start/modes', '📄', 'React Router — Picking a Mode', 'Declarative, Data và Framework Mode, kèm bảng API nào chạy ở mode nào.')}
${LINK('https://reactrouter.com/start/data/routing', '📄', 'React Router — Routing (Data Mode)', 'Route object, route lồng, đoạn động, đoạn tuỳ chọn và splat.')}
${LINK('https://reactrouter.com/upgrading/v7', '📄', 'React Router — Upgrading from v7', 'Những gì bản 8 đã gỡ, gồm cả gói react-router-dom.')}
${LINK('https://react.dev/learn/build-a-react-app-from-scratch#routing', '📄', 'react.dev — Build a React app from scratch: Routing', 'Vì sao SPA cần router, và các router nhóm React liệt kê.')}
</div>
`,
    },

    /* ─────────────────────────── 7.2 ─────────────────────────── */
    {
      title: '7.2 — Layouts, nested routes, route errors and pages that need a login|||7.2 — Layout, route lồng nhau, lỗi theo route và trang cần đăng nhập',
      slug: 'rx-7-2-layout',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Layout route với Outlet (đo: 4 lần đổi trang, layout mount đúng 1 lần), route lồng cho danh sách + chi tiết, index route, loader ném 404 cho ErrorBoundary gần nhất, trang 404 trong layout, chặn trang cần đăng nhập bằng layout route gác cổng (quên replace: phải bấm Back 3 lần) hoặc middleware (chặn cả loader), và vì sao chặn ở frontend chỉ là trải nghiệm, không phải bảo mật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Layouts, nested routes, route errors and pages that need a login</h2>
<p class="lead">Lesson 7.1 ended with a small embarrassment: every page rendered <code>&lt;Menu /&gt;</code> itself. Five pages, five copies — and each navigation unmounted the old menu and mounted a new one. Real apps have a frame that stays (header, menu, footer) and a middle that changes; a list that stays while its detail changes beside it; an error in one panel that should not blank the whole screen; and pages that only a logged-in user may open. React Router expresses all four with one idea: <strong>routes nest, and so does the UI</strong>.</p>
<p>The examples are in <code>src/vi-du/bai2.tsx</code> and <code>src/vi-du/bai2.test.tsx</code> (react-router 8.4.0, Zustand 5.0.15). Every number below is printed by those tests.</p>

<h3>Layout routes: draw the frame once, swap the middle with <code>&lt;Outlet /&gt;</code></h3>
${slide('rx-07', 9, 'Layout route: khung vẽ một lần, Outlet đổi phần ruột')}
<p>A <strong>layout route</strong> is a route whose component renders the shared frame plus an <code>&lt;Outlet /&gt;</code> — a placeholder where the matching child route is drawn. The frame of the lesson counts how many times it gets mounted:</p>
${pre('tsx', SN.khungChinh)}
<p>Then the routes become a tree: the layout at <code>/</code>, the pages as its <code>children</code>. Child paths are <em>relative</em> — <code>'bac-si'</code> under <code>'/'</code> means <code>/bac-si</code>:</p>
${pre('tsx', SN.routesBai2)}
<p>The test logs in, visits the home page, then clicks through four pages — "Bác sĩ", a doctor, "Lịch hẹn", "Trang chủ" — checking the menu is on screen after each click:</p>
${out(OUT.layout)}
<p>One mount for four navigations. The header, the menu and anything inside the frame — a search box with text in it, an open dropdown, a playing video — are the <em>same</em> component instances the whole time; only the part inside <code>&lt;Outlet /&gt;</code> is swapped. With a menu copied into every page, each click would unmount and remount it.</p>
<ul>
<li><strong><code>index: true</code></strong> marks the <strong>index route</strong>: the child shown at the parent's own URL. <code>{ index: true, Component: TrangChu }</code> is what appears at exactly <code>/</code>. An index route has no path and no children.</li>
<li>A route with a component but <strong>no <code>path</code></strong> is a <em>pathless layout</em>: it wraps its children without adding anything to the URL. The login guard later in this lesson is exactly that.</li>
<li>The 404 route <code>*</code> sits <em>inside</em> the layout, so a wrong URL still shows the menu and a way home. Put it outside and a typo gives the user a bare page with no navigation.</li>
</ul>

<h3>Nested routes = nested screens: list on the left, detail on the right</h3>
${slide('rx-07', 10, 'Cây route lồng nhau = cây giao diện lồng nhau')}
<p>Layouts are not only for the whole app. <code>/bac-si</code> can itself be a layout: the doctor list on the left and an <code>&lt;Outlet /&gt;</code> on the right for whichever doctor is selected:</p>
${pre('tsx', SN.khungBacSi)}
<p><code>&lt;NavLink to={bs.id}&gt;</code> has no leading slash: it is a <strong>relative link</strong>, resolved against the route it is rendered in, so <code>bs-2</code> inside <code>/bac-si</code> becomes <code>/bac-si/bs-2</code>. Move the whole section to <code>/phong-kham/bac-si</code> one day and the links follow.</p>
<p><strong>Try it step by step</strong> — the user clicks "BS. Phạm Ngọc Lan" on <code>/bac-si</code>:</p>
<ol>
<li>The URL becomes <code>/bac-si/bs-4</code>. The router walks the tree and finds a <em>chain</em> of matches, from the root down.</li>
<li>Each matched route renders its component; each parent's <code>&lt;Outlet /&gt;</code> renders the next one in the chain.</li>
<li><code>KhungChinh</code> and <code>KhungBacSi</code> were already on screen and stay mounted; only the index child ("Chọn một bác sĩ…") is replaced by <code>ChiTietBacSi</code>.</li>
</ol>
${out(OUT.long)}
<p><code>router.state.matches</code> is that chain: <code>/</code> › <code>bac-si</code> › <code>:id</code>. Reading URL from left to right is reading the screen from outside in.</p>

<h3>Loaders and route error boundaries: an error stays in its panel</h3>
${slide('rx-07', 11, 'ErrorBoundary theo route: lỗi ở chi tiết, danh sách vẫn sống')}
<p>In Data Mode a route can have a <strong><code>loader</code></strong>: a function the router calls <em>before</em> rendering the route, with the URL params. What it returns is read in the component with <code>useLoaderData</code>. If it <strong>throws</strong>, the router does not render the component at all; it renders the nearest <strong><code>ErrorBoundary</code></strong> instead:</p>
${pre('tsx', SN.taiBacSi)}
${pre('tsx', SN.loiChiTiet)}
<ul>
<li><code>throw data(message, { status: 404 })</code> throws a <em>route error response</em> — an error that carries an HTTP-like status. <code>isRouteErrorResponse(loi)</code> recognises it, so the boundary can say "404" for missing data and something else for a crash.</li>
<li><code>useRouteError()</code> returns <code>unknown</code>, on purpose: anything can be thrown in JavaScript (a string, a number, an <code>Error</code>). The code narrows it before touching <code>.status</code> or <code>.message</code>.</li>
<li><code>useLoaderData&lt;typeof taiBacSi&gt;()</code> infers the type from the loader — no hand-written interface to drift.</li>
</ul>
${out(OUT.loi)}
<p>The boundary sits on the <code>:id</code> route, so the error replaces <em>only</em> the detail panel: the list, which belongs to the parent route, is still there and still clickable. Errors <strong>bubble up</strong> to the nearest route that has an <code>ErrorBoundary</code>; with none at all you get React Router's default "Unexpected Application Error!" page from Lesson 7.1. Put one at the root (for "something is badly broken") and one on each panel that can fail on its own.</p>
<p>The same test also printed a line on stderr:</p>
${out(OUT.hydrate)}
<p>When the <em>first</em> page the app opens has a loader, there is a moment before the loader finishes when the router has nothing to show. <code>HydrateFallback</code> (a route field, like <code>ErrorBoundary</code>) is what it renders during that moment — a spinner or a skeleton. Without it the router renders nothing and warns you, as above.</p>
<div class="callout"><p><strong>Loaders or TanStack Query?</strong> Chapter 6 already gives you loading, error and caching states with TanStack Query inside components, and the project keeps doing that. Loaders shine when the data is needed <em>before</em> the page can render at all (the router can start fetching in parallel with loading the page's code). Companies that use both often call <code>queryClient.ensureQueryData(...)</code> inside the loader, so the router starts the fetch early and TanStack Query still owns the cache. Know that the pattern exists; you do not need it to build this project.</p></div>

<h3>Pages that need a login: a layout route as a gatekeeper</h3>
${slide('rx-07', 12, 'Chặn trang cần đăng nhập bằng một layout route gác cổng')}
<p>"My appointments" must not open for someone who is not logged in: it should send them to the login page and, once logged in, bring them back to where they were going. The lesson fakes the login state with a tiny Zustand store (real tokens come in Chapter 14):</p>
${pre('tsx', SN.storeDangNhap)}
<p>The guard is a pathless layout route. Not logged in → render <code>&lt;Navigate&gt;</code>, which redirects as soon as it renders; logged in → render <code>&lt;Outlet /&gt;</code>, so the protected children appear as if the guard were not there:</p>
${pre('tsx', SN.yeuCau)}
${pre('tsx', SN.trangDangNhap)}
<div class="callout"><p><strong>JS quick reminder — <code>(location.state as { tu?: string } | null)?.tu ?? sp.get('tu') ?? '/'</code>.</strong> Read it left to right. <code>as …</code> tells TypeScript the shape we expect, because <code>location.state</code> is typed <code>any</code>. <code>?.</code> is <em>optional chaining</em>: if the thing on the left is <code>null</code> or <code>undefined</code>, stop and give <code>undefined</code> instead of crashing on <code>.tu</code>. Each <code>??</code> then says "if that is still nothing, try the next option". Result: the page the user wanted, or <code>/</code>.</p></div>
<p>Wrapping any group of routes in <code>{ element: &lt;YeuCauDangNhap /&gt;, children: [...] }</code> protects all of them. The guard does not care which pages are inside — adding a protected page is adding a child.</p>

<h3>The <code>replace</code> that saves the Back button — measured</h3>
${slide('rx-07', 13, 'Quên replace: đăng nhập xong phải bấm Back ba lần')}
<p>Both redirects in the guard flow use <code>replace</code>. To see why, the test runs the same story with and without it: start at <code>/</code>, click "Lịch hẹn", get bounced to the login page, log in, arrive at "Lịch hẹn của tôi" — then press Back until the home page appears:</p>
${pre('tsx', SN.testBack)}
${out(OUT.chan)}
<p>With <code>replace</code>, the history is just <code>/</code> → <code>/lich-hen</code>: the login page <em>replaced</em> the blocked entry, and the successful login <em>replaced</em> the login page. One Back, home. Without it the history keeps every step, and the user travels back through a login page they no longer need (showing a login form to a logged-in user) and a page they are already on. Three presses of Back for one navigation feels broken, and on mobile, where Back is a system gesture, users get stuck in a loop.</p>
<div class="pitfall co-tieu-de"><strong>Trap — the login page behind its own gate.</strong> Put the login route <em>inside</em> the guard (for example because the guard wraps the whole layout) and a logged-out user can never reach the login form. Measured with a guard that wraps both <code>/lich-hen</code> and <code>/dang-nhap</code>, opening <code>/lich-hen</code>:</div>
${out(OUT.vong)}
<p>The URL did change to <code>/dang-nhap</code> — but the page is an empty <code>&lt;div&gt;</code>: the guard sits above the login page too, sees "not logged in", and renders <code>&lt;Navigate&gt;</code> (which draws nothing) instead of the <code>&lt;Outlet /&gt;</code>. No error, no warning — a blank screen. The login page, the 404 page and every public page must live outside the guard. When a guard "blocks everything" or "does nothing", draw the route tree on paper and check which branch each page is in.</p>

<h3>Middleware: stop the request before anything loads</h3>
${slide('rx-07', 14, 'Middleware chặn trước loader — cổng component thì không')}
<p>The component guard has a blind spot that only shows up once routes have loaders. The router runs <strong>all loaders of the matched branch before rendering anything</strong> — and the guard <em>is</em> rendering. So by the time <code>YeuCauDangNhap</code> decides to redirect, the loader of "Lịch hẹn" has already run. Data Mode in v8 has a tool that runs earlier: route <strong><code>middleware</code></strong>, functions that run in order before the loaders of a navigation. Throwing <code>redirect(...)</code> there cancels the navigation before any loader starts:</p>
${pre('tsx', SN.canDangNhap)}
<p>The last test opens <code>/lich-hen</code> while logged out, once with each guard, and counts how often the (fake) appointments loader ran:</p>
${out(OUT.middleware)}
<table>
<thead><tr><th></th><th>Component guard (<code>&lt;Navigate&gt;</code>)</th><th>Middleware (<code>throw redirect</code>)</th></tr></thead>
<tbody>
<tr><td>Runs</td><td>while rendering, after loaders</td><td>before loaders, before rendering</td></tr>
<tr><td>Loader of the protected page (measured)</td><td>ran 1 time</td><td>ran 0 times</td></tr>
<tr><td>Reacts when the user logs out while on the page</td><td>yes — it re-renders from the store</td><td>no — only runs on the next navigation</td></tr>
<tr><td>Carries "where to go back"</td><td><code>location.state</code> (not in the URL)</td><td><code>?tu=/lich-hen</code> (in the URL, survives a shared link)</td></tr>
<tr><td>Works in Declarative Mode</td><td>yes</td><td>no (Data/Framework Mode only)</td></tr>
</tbody>
</table>
<p>Both are used in industry. If your pages fetch in components with TanStack Query — as this project does — the protected component is never rendered for a logged-out user, so nothing is fetched and the component guard is enough; the project uses it, and logs out with a <code>navigate</code>. If your routes use loaders, use middleware so that protected data is never requested.</p>
<div class="callout"><p><strong>Common interview question.</strong> "How do you protect a route in React? Is that secure?"</p>
<p>Wrap the protected routes in a layout route that checks the auth state and renders <code>&lt;Navigate to="/login" replace state={{ from }} /&gt;</code> or the <code>&lt;Outlet /&gt;</code>; in React Router's Data Mode, a route middleware that throws <code>redirect()</code> does it before any loader runs. Use <code>replace</code> so Back does not return to the blocked page, and send the user back to where they were after login. But it is <strong>not security</strong>: all frontend code is downloaded and can be read or changed in DevTools. The guard is UX; the real protection is the API refusing requests without a valid token (401/403). A good answer says both halves.</p></div>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>In FER202 projects each "private" page often starts with <code>useEffect(() =&gt; { if (!localStorage.getItem('user')) navigate('/login') }, [])</code>, the header and footer are pasted into every page or rendered around <code>&lt;Routes&gt;</code> in <code>App</code>, and errors either blank the screen or are caught with <code>try/catch</code> around <code>fetch</code>. → At work the frame is a layout route with <code>&lt;Outlet /&gt;</code>; protected pages are grouped under one guard (a layout route or middleware) with <code>replace</code> and a "return to" location; each route that can fail has an <code>ErrorBoundary</code>; and the 404 page lives inside the layout. · <em>Why:</em> the <code>useEffect</code> check runs <strong>after</strong> the private page has already rendered once (and started its requests), so its content flashes on screen; forgetting it on one page leaves that page open; and it pushes instead of replaces, breaking Back. One guard in the route tree cannot be forgotten page by page. The FER202 way still works in a small lab — and you will find it in older codebases, where moving it into a layout route is a classic first refactor.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> add a protected "Tài khoản" page with a working "Đăng xuất" button.</p><ol>
<li>In <code>bai2.tsx</code>, write <code>TrangTaiKhoan</code>: shows <code>Xin chào, {nguoiDung}</code> from <code>useDangNhapStore</code> and a button "Đăng xuất" that calls <code>dangXuat()</code> then <code>navigate('/', { replace: true })</code>.</li>
<li>In <code>taoRoutesBai2</code>, put <code>{ path: 'tai-khoan', Component: TrangTaiKhoan }</code> <em>next to</em> <code>lichHen</code> inside the same guard (both branches: component and middleware). Add a <code>NavLink</code> "Tài khoản" to the menu.</li>
<li>Tests: logged out, <code>/tai-khoan</code> ends on the login page (both guards); logged in, it greets "Nguyễn Thị Ánh"; clicking "Đăng xuất" lands on <code>/</code> with <code>historyAction</code> equal to <code>'REPLACE'</code>, and afterwards navigating to <code>/tai-khoan</code> shows the login page again.</li>
</ol><p><strong>Done when:</strong> <code>npx vitest run src/vi-du/bai2.test.tsx</code> is all green (at least 10 tests), <code>npx tsc -b</code> prints nothing, and <code>demMount.khung</code> is still 1 after the logout navigation.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">layout route</span><span class="v">a route whose component renders a shared frame and an <code>&lt;Outlet /&gt;</code> for its children</span></div>
<div class="kv"><span class="k"><code>&lt;Outlet /&gt;</code></span><span class="v">the placeholder where the matched child route is rendered</span></div>
<div class="kv"><span class="k">index route</span><span class="v">the child shown at the parent's own URL (<code>index: true</code>)</span></div>
<div class="kv"><span class="k">relative link</span><span class="v"><code>to</code> without a leading <code>/</code>, resolved against the current route</span></div>
<div class="kv"><span class="k"><code>loader</code></span><span class="v">function the router runs before rendering a route; read with <code>useLoaderData</code></span></div>
<div class="kv"><span class="k">route <code>ErrorBoundary</code></span><span class="v">component shown instead of a route when its loader or render throws; errors bubble to the nearest one</span></div>
<div class="kv"><span class="k">route guard</span><span class="v">a layout route (or middleware) that redirects when access is not allowed</span></div>
<div class="kv"><span class="k"><code>middleware</code></span><span class="v">functions that run before the loaders of a navigation; can <code>throw redirect()</code></span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A layout route renders the frame once and swaps its <code>&lt;Outlet /&gt;</code>: 4 navigations, 1 mount. Index routes fill the parent's own URL; the 404 route belongs inside the layout.</li>
<li>Nested routes make nested screens: <code>/bac-si/bs-4</code> matches <code>/</code> › <code>bac-si</code> › <code>:id</code>, and only the innermost part changes. Relative links follow their route.</li>
<li>A loader that throws <code>data(…, { status: 404 })</code> renders the nearest <code>ErrorBoundary</code>; the list in the parent route stays usable. <code>useRouteError</code> is <code>unknown</code> — narrow it with <code>isRouteErrorResponse</code>.</li>
<li>Guard protected pages with a pathless layout route: <code>&lt;Navigate replace state={{ tu }} /&gt;</code> or <code>&lt;Outlet /&gt;</code>. Forgetting <code>replace</code> cost 3 Backs instead of 1.</li>
<li>Middleware runs before loaders: the protected loader ran 0 times instead of 1. Component guards react to logout; middleware does not.</li>
<li>Frontend guards are UX. Security is the API answering 401/403.</li>
</ul>

${LINK('https://reactrouter.com/start/data/routing', '📄', 'React Router — Routing: nested, layout and index routes', 'Outlet, layout routes without a path, index routes and prefix routes.')}
${LINK('https://reactrouter.com/start/data/data-loading', '📄', 'React Router — Data Loading (Data Mode)', 'loader, useLoaderData and when the router calls them.')}
${LINK('https://reactrouter.com/how-to/error-boundary', '📄', 'React Router — Error Boundaries', 'ErrorBoundary, useRouteError, isRouteErrorResponse and how errors bubble.')}
${LINK('https://reactrouter.com/how-to/middleware', '📄', 'React Router — Middleware', 'Client middleware in Data Mode, including the authentication redirect example.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Layout, route lồng nhau, lỗi theo route và trang cần đăng nhập</h2>
<p class="lead">Bài 7.1 kết thúc bằng một chỗ hơi ngượng: trang nào cũng tự vẽ <code>&lt;Menu /&gt;</code>. Năm trang, năm bản sao — và mỗi lần chuyển trang là gỡ menu cũ, gắn menu mới. App thật có một cái khung đứng yên (header, menu, footer) và phần ruột thay đổi; một danh sách đứng yên trong khi chi tiết bên cạnh thay đổi; một lỗi ở một khung không được làm trắng cả màn hình; và những trang chỉ người đã đăng nhập mới mở được. React Router diễn đạt cả bốn bằng một ý: <strong>route lồng nhau, và giao diện cũng lồng nhau y như vậy</strong>.</p>
<p>Ví dụ ở <code>src/vi-du/bai2.tsx</code> và <code>src/vi-du/bai2.test.tsx</code> (react-router 8.4.0, Zustand 5.0.15). Mọi con số dưới đây do chính các test đó in ra.</p>

<h3>Layout route: vẽ khung một lần, đổi phần ruột bằng <code>&lt;Outlet /&gt;</code></h3>
${slide('rx-07', 9, 'Layout route: khung vẽ một lần, Outlet đổi phần ruột')}
<p><strong>Layout route</strong> là route mà component của nó vẽ cái khung dùng chung cộng một <code>&lt;Outlet /&gt;</code> — một "chỗ trống" để route con đang khớp vẽ vào. Khung của bài đếm xem nó bị gắn (mount) bao nhiêu lần:</p>
${pre('tsx', SN.khungChinh)}
<p>Rồi bảng route thành một cái cây: layout ở <code>/</code>, các trang là <code>children</code> của nó. Đường dẫn con là <em>tương đối</em> — <code>'bac-si'</code> dưới <code>'/'</code> nghĩa là <code>/bac-si</code>:</p>
${pre('tsx', SN.routesBai2)}
<p>Test đăng nhập, mở trang chủ, rồi bấm qua bốn trang — "Bác sĩ", một bác sĩ, "Lịch hẹn", "Trang chủ" — sau mỗi cú bấm kiểm menu vẫn trên màn hình:</p>
${out(OUT.layout)}
<p>Một lần mount cho bốn lần chuyển trang. Header, menu và mọi thứ trong khung — một ô tìm đang có chữ, một dropdown đang mở, một video đang phát — là <em>cùng</em> những instance component suốt thời gian đó; chỉ phần bên trong <code>&lt;Outlet /&gt;</code> được thay. Với menu chép vào từng trang, mỗi cú bấm là một lần gỡ ra gắn lại.</p>
<ul>
<li><strong><code>index: true</code></strong> đánh dấu <strong>index route (route mặc định)</strong>: route con hiện ở chính URL của cha. <code>{ index: true, Component: TrangChu }</code> là thứ xuất hiện khi URL đúng bằng <code>/</code>. Index route không có path và không có con.</li>
<li>Route có component nhưng <strong>không có <code>path</code></strong> là một <em>layout không đường dẫn</em>: nó bọc các con mà không thêm gì vào URL. Cái cổng đăng nhập ở phần sau chính là loại này.</li>
<li>Route 404 <code>*</code> nằm <em>bên trong</em> layout, nên gõ sai URL vẫn thấy menu và đường về trang chủ. Đặt nó ra ngoài thì gõ nhầm một chữ là người dùng gặp một trang trơn trọi không có đường đi đâu.</li>
</ul>

<h3>Route lồng = màn hình lồng: danh sách bên trái, chi tiết bên phải</h3>
${slide('rx-07', 10, 'Cây route lồng nhau = cây giao diện lồng nhau')}
<p>Layout không chỉ dành cho cả app. Chính <code>/bac-si</code> cũng làm layout được: danh sách bác sĩ bên trái và một <code>&lt;Outlet /&gt;</code> bên phải cho bác sĩ đang được chọn:</p>
${pre('tsx', SN.khungBacSi)}
<p><code>&lt;NavLink to={bs.id}&gt;</code> không có dấu gạch chéo đầu: đó là <strong>link tương đối</strong>, tính từ route nơi nó được vẽ, nên <code>bs-2</code> bên trong <code>/bac-si</code> thành <code>/bac-si/bs-2</code>. Một ngày cả khu này dời sang <code>/phong-kham/bac-si</code> thì các link tự đi theo.</p>
<p><strong>Chạy thử từng bước</strong> — người dùng bấm "BS. Phạm Ngọc Lan" ở <code>/bac-si</code>:</p>
<ol>
<li>URL thành <code>/bac-si/bs-4</code>. Router đi dọc cây và tìm ra một <em>chuỗi</em> route khớp, từ gốc xuống.</li>
<li>Mỗi route khớp vẽ component của nó; <code>&lt;Outlet /&gt;</code> của mỗi cha vẽ mắt xích kế tiếp trong chuỗi.</li>
<li><code>KhungChinh</code> và <code>KhungBacSi</code> đã có trên màn hình và vẫn giữ nguyên; chỉ route con mặc định ("Chọn một bác sĩ…") được thay bằng <code>ChiTietBacSi</code>.</li>
</ol>
${out(OUT.long)}
<p><code>router.state.matches</code> chính là chuỗi đó: <code>/</code> › <code>bac-si</code> › <code>:id</code>. Đọc URL từ trái sang phải là đọc màn hình từ ngoài vào trong.</p>

<h3>Loader và ErrorBoundary theo route: lỗi nằm yên trong khung của nó</h3>
${slide('rx-07', 11, 'ErrorBoundary theo route: lỗi ở chi tiết, danh sách vẫn sống')}
<p>Ở Data Mode, route có thể có <strong><code>loader</code></strong>: một hàm router gọi <em>trước</em> khi vẽ route, với tham số của URL. Thứ nó trả về được đọc trong component bằng <code>useLoaderData</code>. Nếu nó <strong>ném lỗi</strong>, router không vẽ component nữa; nó vẽ <strong><code>ErrorBoundary</code></strong> gần nhất:</p>
${pre('tsx', SN.taiBacSi)}
${pre('tsx', SN.loiChiTiet)}
<ul>
<li><code>throw data(thongBao, { status: 404 })</code> ném một <em>route error response</em> — một lỗi mang mã trạng thái kiểu HTTP. <code>isRouteErrorResponse(loi)</code> nhận ra nó, nên boundary nói được "404" cho dữ liệu không có và nói khác cho một cú sập.</li>
<li><code>useRouteError()</code> trả về <code>unknown</code>, có chủ ý: JavaScript cho ném bất cứ thứ gì (một chuỗi, một số, một <code>Error</code>). Mã phải thu hẹp kiểu trước khi đụng tới <code>.status</code> hay <code>.message</code>.</li>
<li><code>useLoaderData&lt;typeof taiBacSi&gt;()</code> suy kiểu từ chính loader — không có interface viết tay nào để lệch nhau.</li>
</ul>
${out(OUT.loi)}
<p>Boundary nằm ở route <code>:id</code>, nên lỗi chỉ thay <em>đúng</em> khung chi tiết: danh sách — thuộc route cha — vẫn còn và vẫn bấm được. Lỗi <strong>nổi lên</strong> tới route gần nhất có <code>ErrorBoundary</code>; không có cái nào thì bạn gặp trang mặc định "Unexpected Application Error!" của React Router ở Bài 7.1. Đặt một cái ở gốc (cho "hỏng nặng rồi") và một cái ở mỗi khung có thể hỏng riêng.</p>
<p>Cũng test đó in ra một dòng trên stderr:</p>
${out(OUT.hydrate)}
<p>Khi trang <em>đầu tiên</em> app mở có loader, có một khoảnh khắc loader chưa xong mà router chưa có gì để vẽ. <code>HydrateFallback</code> (một field của route, giống <code>ErrorBoundary</code>) là thứ nó vẽ trong khoảnh khắc đó — một vòng xoay hay một khung xương. Không có thì router không vẽ gì và cảnh báo như trên.</p>
<div class="callout"><p><strong>Loader hay TanStack Query?</strong> Chương 6 đã cho bạn trạng thái đang tải, lỗi và cache bằng TanStack Query ngay trong component, và dự án tiếp tục làm vậy. Loader tỏa sáng khi dữ liệu cần có <em>trước</em> thì trang mới vẽ được (router bắt đầu tải song song với tải mã của trang). Công ty dùng cả hai thường gọi <code>queryClient.ensureQueryData(...)</code> trong loader, để router bắt đầu tải sớm mà TanStack Query vẫn giữ cache. Biết là có mẫu đó; dựng dự án này thì không cần.</p></div>

<h3>Trang cần đăng nhập: một layout route làm người gác cổng</h3>
${slide('rx-07', 12, 'Chặn trang cần đăng nhập bằng một layout route gác cổng')}
<p>"Lịch hẹn của tôi" không được mở cho người chưa đăng nhập: phải đưa họ sang trang đăng nhập, và đăng nhập xong thì đưa về đúng chỗ họ định tới. Bài giả lập trạng thái đăng nhập bằng một store Zustand tí hon (token thật để Chương 14):</p>
${pre('tsx', SN.storeDangNhap)}
<p>Người gác cổng là một layout route không đường dẫn. Chưa đăng nhập → vẽ <code>&lt;Navigate&gt;</code>, thứ chuyển hướng ngay khi được vẽ; đã đăng nhập → vẽ <code>&lt;Outlet /&gt;</code>, nên các trang được bảo vệ hiện ra như thể không có cổng nào:</p>
${pre('tsx', SN.yeuCau)}
${pre('tsx', SN.trangDangNhap)}
<div class="callout"><p><strong>JS nhắc nhanh — <code>(location.state as { tu?: string } | null)?.tu ?? sp.get('tu') ?? '/'</code>.</strong> Đọc từ trái sang phải. <code>as …</code> báo TypeScript hình dạng ta chờ, vì <code>location.state</code> có kiểu <code>any</code>. <code>?.</code> là <em>optional chaining</em>: thứ bên trái là <code>null</code> hay <code>undefined</code> thì dừng và cho <code>undefined</code>, thay vì sập khi đọc <code>.tu</code>. Mỗi <code>??</code> sau đó nói "vẫn chưa có gì thì thử phương án kế". Kết quả: trang người dùng định tới, hoặc <code>/</code>.</p></div>
<p>Bọc bất kỳ nhóm route nào trong <code>{ element: &lt;YeuCauDangNhap /&gt;, children: [...] }</code> là bảo vệ cả nhóm. Cổng không quan tâm bên trong có những trang nào — thêm một trang cần đăng nhập là thêm một con.</p>

<h3>Chữ <code>replace</code> cứu nút Back — đo thật</h3>
${slide('rx-07', 13, 'Quên replace: đăng nhập xong phải bấm Back ba lần')}
<p>Cả hai lần chuyển hướng trong luồng gác cổng đều dùng <code>replace</code>. Để thấy vì sao, test chạy cùng một câu chuyện, có và không có nó: bắt đầu ở <code>/</code>, bấm "Lịch hẹn", bị đẩy sang trang đăng nhập, đăng nhập, tới "Lịch hẹn của tôi" — rồi bấm Back tới khi thấy trang chủ:</p>
${pre('tsx', SN.testBack)}
${out(OUT.chan)}
<p>Có <code>replace</code>, lịch sử chỉ là <code>/</code> → <code>/lich-hen</code>: trang đăng nhập đã <em>thay</em> mục bị chặn, và lần đăng nhập thành công đã <em>thay</em> trang đăng nhập. Một lần Back, về nhà. Không có nó, lịch sử giữ mọi bước, và người dùng phải đi lùi qua một trang đăng nhập họ không còn cần (hiện form đăng nhập cho người đã đăng nhập) và một trang họ đang đứng. Ba lần Back cho một lần chuyển trang là cảm giác app hỏng, và trên điện thoại, nơi Back là cử chỉ của hệ điều hành, người dùng bị kẹt trong vòng lặp.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — trang đăng nhập nằm sau chính cái cổng của nó.</strong> Đặt route đăng nhập <em>bên trong</em> cổng (ví dụ vì cổng bọc cả layout) là người chưa đăng nhập không bao giờ tới được form đăng nhập. Đo với một cổng bọc cả <code>/lich-hen</code> lẫn <code>/dang-nhap</code>, mở <code>/lich-hen</code>:</div>
${out(OUT.vong)}
<p>URL có đổi sang <code>/dang-nhap</code> — nhưng trang chỉ là một <code>&lt;div&gt;</code> rỗng: cổng nằm phía trên cả trang đăng nhập, thấy "chưa đăng nhập", và vẽ <code>&lt;Navigate&gt;</code> (thứ không vẽ gì) thay cho <code>&lt;Outlet /&gt;</code>. Không lỗi, không cảnh báo — một màn hình trắng. Trang đăng nhập, trang 404 và mọi trang công khai phải nằm ngoài cổng. Khi cổng "chặn tất cả" hoặc "chẳng chặn gì", vẽ cây route ra giấy và kiểm từng trang nằm ở nhánh nào.</p>

<h3>Middleware: chặn trước khi bất cứ thứ gì được tải</h3>
${slide('rx-07', 14, 'Middleware chặn trước loader — cổng component thì không')}
<p>Cổng bằng component có một điểm mù, chỉ lộ ra khi route có loader. Router chạy <strong>mọi loader của nhánh khớp trước khi vẽ bất cứ thứ gì</strong> — mà người gác cổng thì <em>là</em> một lần vẽ. Nên tới lúc <code>YeuCauDangNhap</code> quyết định chuyển hướng, loader của "Lịch hẹn" đã chạy xong. Data Mode ở bản 8 có một công cụ chạy sớm hơn: <strong><code>middleware</code></strong> của route, các hàm chạy theo thứ tự trước các loader của một lượt chuyển trang. Ném <code>redirect(...)</code> ở đó là huỷ lượt chuyển trang trước khi loader nào bắt đầu:</p>
${pre('tsx', SN.canDangNhap)}
<p>Test cuối mở <code>/lich-hen</code> khi chưa đăng nhập, mỗi loại cổng một lần, và đếm loader lịch hẹn (giả) đã chạy bao nhiêu lần:</p>
${out(OUT.middleware)}
<table>
<thead><tr><th></th><th>Cổng bằng component (<code>&lt;Navigate&gt;</code>)</th><th>Middleware (<code>throw redirect</code>)</th></tr></thead>
<tbody>
<tr><td>Chạy lúc</td><td>đang vẽ, sau loader</td><td>trước loader, trước khi vẽ</td></tr>
<tr><td>Loader của trang được bảo vệ (đo)</td><td>chạy 1 lần</td><td>chạy 0 lần</td></tr>
<tr><td>Phản ứng khi người dùng đăng xuất lúc đang ở trang</td><td>có — nó render lại theo store</td><td>không — chỉ chạy ở lượt chuyển trang sau</td></tr>
<tr><td>Mang theo "đường quay về"</td><td><code>location.state</code> (không nằm trên URL)</td><td><code>?tu=/lich-hen</code> (trên URL, sống qua link chia sẻ)</td></tr>
<tr><td>Dùng được ở Declarative Mode</td><td>có</td><td>không (chỉ Data/Framework Mode)</td></tr>
</tbody>
</table>
<p>Ngoài công ty người ta dùng cả hai. Nếu trang lấy dữ liệu trong component bằng TanStack Query — như dự án này — thì component được bảo vệ không bao giờ được vẽ cho người chưa đăng nhập, nên chẳng có gì bị tải và cổng bằng component là đủ; dự án dùng nó, và đăng xuất kèm một lần <code>navigate</code>. Nếu route dùng loader thì dùng middleware, để dữ liệu được bảo vệ không bao giờ bị gọi tới.</p>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Bạn bảo vệ một route trong React thế nào? Như vậy có an toàn không?"</p>
<p>Bọc các route cần bảo vệ trong một layout route kiểm trạng thái đăng nhập, vẽ <code>&lt;Navigate to="/login" replace state={{ from }} /&gt;</code> hoặc <code>&lt;Outlet /&gt;</code>; ở Data Mode của React Router, một middleware của route ném <code>redirect()</code> làm việc đó trước khi loader nào chạy. Dùng <code>replace</code> để Back không quay lại trang bị chặn, và đăng nhập xong thì đưa người dùng về chỗ cũ. Nhưng đó <strong>không phải bảo mật</strong>: mọi mã frontend đều bị tải về và đọc hay sửa được trong DevTools. Cổng là trải nghiệm người dùng; bảo vệ thật là API từ chối request không có token hợp lệ (401/403). Câu trả lời tốt nói đủ cả hai nửa.</p></div>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Trong đồ án FER202, mỗi trang "riêng tư" thường mở đầu bằng <code>useEffect(() =&gt; { if (!localStorage.getItem('user')) navigate('/login') }, [])</code>, header và footer được dán vào từng trang hoặc vẽ quanh <code>&lt;Routes&gt;</code> trong <code>App</code>, còn lỗi thì hoặc làm trắng màn hình, hoặc bị bắt bằng <code>try/catch</code> quanh <code>fetch</code>. → Đi làm, cái khung là một layout route có <code>&lt;Outlet /&gt;</code>; các trang cần bảo vệ gom dưới một cổng (layout route hoặc middleware) có <code>replace</code> và "chỗ quay về"; mỗi route có thể hỏng có <code>ErrorBoundary</code> riêng; trang 404 nằm trong layout. · <em>Vì sao:</em> kiểm tra bằng <code>useEffect</code> chạy <strong>sau</strong> khi trang riêng tư đã vẽ một lần (và đã bắt đầu gọi API), nên nội dung của nó nháy lên màn hình; quên nó ở một trang là trang đó bỏ ngỏ; và nó push chứ không replace, làm hỏng Back. Một cổng nằm trong cây route thì không thể quên theo từng trang. Cách FER202 vẫn chạy trong một bài lab nhỏ — và bạn sẽ gặp nó trong mã cũ, nơi dời nó vào một layout route là một lần refactor kinh điển đầu tiên.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> thêm trang "Tài khoản" cần đăng nhập, có nút "Đăng xuất" chạy đúng.</p><ol>
<li>Trong <code>bai2.tsx</code>, viết <code>TrangTaiKhoan</code>: hiện <code>Xin chào, {nguoiDung}</code> lấy từ <code>useDangNhapStore</code> và một nút "Đăng xuất" gọi <code>dangXuat()</code> rồi <code>navigate('/', { replace: true })</code>.</li>
<li>Trong <code>taoRoutesBai2</code>, đặt <code>{ path: 'tai-khoan', Component: TrangTaiKhoan }</code> <em>cạnh</em> <code>lichHen</code> trong cùng một cổng (cả hai nhánh: component và middleware). Thêm <code>NavLink</code> "Tài khoản" vào menu.</li>
<li>Test: chưa đăng nhập, <code>/tai-khoan</code> kết thúc ở trang đăng nhập (cả hai loại cổng); đã đăng nhập thì chào "Nguyễn Thị Ánh"; bấm "Đăng xuất" thì tới <code>/</code> với <code>historyAction</code> bằng <code>'REPLACE'</code>, và sau đó chuyển tới <code>/tai-khoan</code> lại thấy trang đăng nhập.</li>
</ol><p><strong>Đạt khi:</strong> <code>npx vitest run src/vi-du/bai2.test.tsx</code> xanh hết (ít nhất 10 test), <code>npx tsc -b</code> không in gì, và <code>demMount.khung</code> vẫn là 1 sau lần chuyển trang khi đăng xuất.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">layout route</span><span class="v">route mà component vẽ cái khung chung và một <code>&lt;Outlet /&gt;</code> cho các con</span></div>
<div class="kv"><span class="k"><code>&lt;Outlet /&gt;</code></span><span class="v">chỗ trống nơi route con đang khớp được vẽ vào</span></div>
<div class="kv"><span class="k">index route (route mặc định)</span><span class="v">route con hiện ở chính URL của cha (<code>index: true</code>)</span></div>
<div class="kv"><span class="k">link tương đối</span><span class="v"><code>to</code> không có <code>/</code> đầu, tính từ route hiện tại</span></div>
<div class="kv"><span class="k"><code>loader</code></span><span class="v">hàm router chạy trước khi vẽ route; đọc bằng <code>useLoaderData</code></span></div>
<div class="kv"><span class="k"><code>ErrorBoundary</code> của route</span><span class="v">component hiện thay route khi loader hay lúc vẽ ném lỗi; lỗi nổi lên tới cái gần nhất</span></div>
<div class="kv"><span class="k">route guard (cổng chặn)</span><span class="v">layout route (hoặc middleware) chuyển hướng khi không được phép vào</span></div>
<div class="kv"><span class="k"><code>middleware</code></span><span class="v">các hàm chạy trước loader của một lượt chuyển trang; ném được <code>redirect()</code></span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Layout route vẽ khung một lần và thay <code>&lt;Outlet /&gt;</code>: 4 lần chuyển trang, 1 lần mount. Index route lấp URL của chính cha; route 404 thuộc về bên trong layout.</li>
<li>Route lồng tạo màn hình lồng: <code>/bac-si/bs-4</code> khớp <code>/</code> › <code>bac-si</code> › <code>:id</code>, và chỉ phần trong cùng thay đổi. Link tương đối đi theo route của nó.</li>
<li>Loader ném <code>data(…, { status: 404 })</code> thì ErrorBoundary gần nhất được vẽ; danh sách ở route cha vẫn dùng được. <code>useRouteError</code> là <code>unknown</code> — thu hẹp bằng <code>isRouteErrorResponse</code>.</li>
<li>Chặn trang cần đăng nhập bằng một layout route không đường dẫn: <code>&lt;Navigate replace state={{ tu }} /&gt;</code> hoặc <code>&lt;Outlet /&gt;</code>. Quên <code>replace</code>: 3 lần Back thay vì 1.</li>
<li>Middleware chạy trước loader: loader được bảo vệ chạy 0 lần thay vì 1. Cổng bằng component phản ứng khi đăng xuất; middleware thì không.</li>
<li>Cổng ở frontend là trải nghiệm. Bảo mật là API trả 401/403.</li>
</ul>

${LINK('https://reactrouter.com/start/data/routing', '📄', 'React Router — Routing: route lồng, layout và index', 'Outlet, layout route không đường dẫn, index route và prefix route.')}
${LINK('https://reactrouter.com/start/data/data-loading', '📄', 'React Router — Data Loading (Data Mode)', 'loader, useLoaderData và lúc nào router gọi chúng.')}
${LINK('https://reactrouter.com/how-to/error-boundary', '📄', 'React Router — Error Boundaries', 'ErrorBoundary, useRouteError, isRouteErrorResponse và cách lỗi nổi lên.')}
${LINK('https://reactrouter.com/how-to/middleware', '📄', 'React Router — Middleware', 'Middleware phía client ở Data Mode, gồm ví dụ chuyển hướng khi chưa đăng nhập.')}
</div>
`,
    },

    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — Project structure that scales: feature folders, one-way dependencies|||7.3 — Cấu trúc dự án mở rộng được: thư mục theo tính năng, phụ thuộc một chiều',
      slug: 'rx-7-3-cau-truc',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dời 73 file của app phòng khám từ xếp-theo-loại sang app/ · pages/ · features/ · shared/ (tsc báo 100 lỗi và đó là danh sách việc), alias @/ với tsconfig paths (build xanh mà dev và Vitest đỏ — đo thật), mỗi tính năng một cửa index.ts, luật phụ thuộc một chiều kiểm bằng oxlint, và barrel vòng tròn làm trắng trang ở dev server trong khi tsc lẫn Vitest vẫn xanh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Project structure that scales: folders by feature, one-way dependencies, rules a linter enforces</h2>
<p class="lead">At the start of this chapter the clinic app had 73 files under <code>src/</code>, sorted by <em>what kind of file</em> they are: <code>components/</code>, <code>hooks/</code>, <code>logic/</code>, <code>store/</code>. That is how every tutorial starts and it is fine for a lab. Then a ticket arrives — "doctors can be filtered by years of experience" — and you open four folders to find the code of one feature. This lesson reorganises the project the way most React teams do in 2026, measures what breaks along the way, and turns the rules into lint errors so that nobody has to remember them.</p>
<p>Everything is done on the chapter's project (the one you will build in the project lesson). Commands: <code>npx tsc</code>, <code>npx vitest run</code>, <code>npx vite build</code>, the Vite dev server in a real Chromium, and <strong>oxlint 1.85.0</strong> (the linter the Vite template ships with).</p>

<h3>By file type: fine while small, painful as it grows</h3>
${slide('rx-07', 15, 'Xếp theo loại file → xếp theo tính năng')}
<p>Before this chapter, the folders held: <code>components/</code> 24 files, <code>hooks/</code> 13, <code>logic/</code> 9, <code>store/</code> 3, plus <code>schema/</code>, <code>api/</code>, <code>dat-lich/</code>, <code>mocks/</code>. The "doctor" feature alone — card, list, filter chips, search box, detail, list page, two hooks, three logic files, the favourites store — was spread over <strong>four</strong> of them. Sorting by type answers "where are all the hooks?", a question nobody asks at work. The questions people ask are "where is everything about booking?" and "can I delete the reviews feature without breaking checkout?"</p>
<p>Sorting by <strong>feature (tính năng)</strong> answers those. After this lesson the "doctor" feature is one folder, and deleting a feature is deleting one folder.</p>

<h3>Four layers: <code>app/</code>, <code>pages/</code>, <code>features/</code>, <code>shared/</code></h3>
${slide('rx-07', 16, 'Luật phụ thuộc một chiều: app → pages → features → shared')}
<table>
<thead><tr><th>Folder</th><th>What lives there</th><th>May import</th></tr></thead>
<tbody>
<tr><td><code>app/</code></td><td>the route table, the root layout, the header, the QueryClient — things that exist once</td><td>everything below</td></tr>
<tr><td><code>pages/</code></td><td>one component per route; <strong>composes</strong> features (the doctor page = doctor profile + time picker)</td><td><code>features/*</code> (through their <code>index.ts</code>), <code>shared/</code></td></tr>
<tr><td><code>features/&lt;name&gt;/</code></td><td>everything of one feature: components, hooks, store, logic, tests, and an <code>index.ts</code></td><td><code>shared/</code> only — <strong>never another feature</strong></td></tr>
<tr><td><code>shared/</code></td><td>code that knows no feature exists: API client, generic UI (error box, skeletons, toasts), generic hooks, date helpers</td><td>nothing above it</td></tr>
</tbody>
</table>
<p>The contract files of the course keep their places (<code>src/types.ts</code>, <code>src/du-lieu/</code>, <code>src/mocks/</code>) and count as shared. The one rule that matters most: <strong>dependencies point one way — down</strong>. <code>app → pages → features → shared</code>. This is the "unidirectional codebase" that the widely used Bulletproof React guide recommends too.</p>
<p><strong>Try it step by step</strong> — where does a new file go? Ask in this order:</p>
<ol>
<li>Is it used by exactly one feature? → inside that feature's folder.</li>
<li>Does it combine two features on one screen? → <code>pages/</code>.</li>
<li>Would it still make sense in a completely different app (a date formatter, a <code>useDebounce</code>, an error box)? → <code>shared/</code>.</li>
<li>Is it wiring for the whole app (router, providers, layout)? → <code>app/</code>.</li>
</ol>
<p>The rule "features never import each other" forces one small design change in the project. "My appointments" needs doctors' <em>names</em>, which belong to the doctor feature. Before, <code>LichHenCuaToi</code> called <code>useBacSi()</code> itself. Now the appointments component asks for what it needs as a prop, and the <em>page</em> — which is allowed to see both features — provides it:</p>
${pre('tsx', SN.danhSachLichHenProps)}
${pre('tsx', SN.trangLichHen)}
<p>That is dependency injection without any library: the feature declares "give me a function that turns an id into a name"; whoever composes the screen decides where the names come from. The appointments feature can now be tested — and reused — without the doctor feature.</p>

<h3>Moving 73 files: 100 TypeScript errors are your to-do list</h3>
<p>The move itself is <code>mv</code> (or drag-and-drop in the editor). Right after moving, before touching a single import:</p>
${out(OUT.tscDon)}
<p>Do not panic at 100. Read the codes: <strong>TS2307</strong> "Cannot find module" is every import whose target moved — that is the real list. <strong>TS7006</strong> "implicitly has an 'any' type" and <strong>TS2339</strong> are <em>consequences</em>: once a module cannot be found, TypeScript no longer knows the types of what it exported, so callbacks that use them lose their types too. Fix the 81 missing modules and the other 19 disappear by themselves. Two practical tips: VS Code updates imports automatically when you move a file <em>inside the editor</em> (not in a terminal), and <code>tsc</code> is the check that you did not miss one — run it until it prints nothing.</p>

<h3>The <code>@/</code> alias: one source of truth — and a green build that lies</h3>
${slide('rx-07', 18, 'Alias @/: build xanh chưa chắc dev và test xanh')}
<p>With deeper folders, relative imports turn into <code>'../../../du-lieu/chuyen-khoa'</code>. Everyone counts dots wrong, and moving a file breaks them again. An <strong>alias</strong> gives the <code>src/</code> folder a fixed name: <code>'@/du-lieu/chuyen-khoa'</code> works from any depth. It has to be declared where the tools can read it. The project declares it once, in TypeScript's config:</p>
${pre('json', SN.tsPaths)}
<p>Now <code>tsc</code> understands <code>@/</code>. Here is what happened next, in order — the lesson is in the middle line:</p>
${out(OUT.buildThieuAlias)}
${out(OUT.vitestThieu)}
${out(OUT.devThieu)}
<p>The production <strong>build passed</strong> — Vite 8 bundles with Rolldown, which reads <code>paths</code> from <code>tsconfig</code> on its own (remove <code>paths</code> and it fails too: <code>${H(OUT.buildKhongPathsNgan)}…</code>). But the <strong>dev server</strong> answered 500 and <strong>Vitest</strong> failed all 20 test files: both go through Vite's own resolver, where tsconfig paths are <em>off</em> by default (<code>resolve.tsconfigPaths</code>, default <code>false</code>, per the Vite docs). One setting fixes both, and the alias stays declared in one place:</p>
${pre('ts', SN.viteConfig)}
${out(OUT.vitestSau)}
<div class="pitfall co-tieu-de"><strong>Trap — "the build is green" is not "the project works".</strong> Here the CI step <code>vite build</code> would have passed while every developer's <code>npm run dev</code> showed a 500 and every test failed. The reverse also happens (tests green, build red). After changing configuration — aliases, plugins, environment variables — run all three: <code>npx tsc -b</code>, <code>npx vitest run</code>, <code>npx vite build</code>, and open the dev server once. Also resist the older fix of declaring the alias a second time in <code>resolve.alias</code>: two sources of truth drift apart the first time someone adds <code>@/assets</code> to only one of them.</div>

<h3>One door per feature: <code>index.ts</code></h3>
${slide('rx-07', 17, 'Mỗi tính năng một cửa index.ts — lint chặn đi cửa sau')}
<p>Each feature exports what the outside may use from a single file — its <strong>public API</strong>. Everything else in the folder is private and can be renamed or moved freely:</p>
${pre('ts', SN.indexBacSi)}
${pre('ts', SN.indexDatLich)}
<p>Pages then import <code>from '@/features/bac-si'</code>, never <code>from '@/features/bac-si/hooks/useChiTietBacSi'</code>. A file that re-exports others like this is called a <strong>barrel</strong>. Barrels have a real cost, and it is fair to say so: the Bulletproof React guide now advises <em>against</em> feature barrels, because in development Vite has to load every module a barrel re-exports, and because barrels make import cycles easy — the section after next shows one. This project keeps them small (only what pages actually use — five names for the doctor feature) and lets the linter forbid cycles. Importing files directly and enforcing boundaries with a path rule is an equally valid team decision; what matters is that the boundary exists and is checked.</p>

<h3>Turning the rules into lint errors</h3>
<p>Conventions written in a README are forgotten on the first Friday afternoon. oxlint's <code>no-restricted-imports</code> rule, with per-folder <code>overrides</code>, turns the four layers into errors:</p>
${pre('json', SN.oxlint)}
<p>Then four deliberate violations — one per rule — to check that the checker checks:</p>
${out(OUT.oxlintViPham)}
<p>Every message points at the rule in plain Vietnamese, so a new teammate learns the architecture from the error. With the four lines removed, the whole <code>src/</code> lints clean:</p>
${out(OUT.oxlintSach)}
<div class="callout"><p><strong>JS quick reminder — <code>*</code> versus <code>**</code> in these patterns.</strong> The first version of this config used <code>"@/features/*/*"</code> and <code>"../../*"</code>. It looked right. Measured:</p></div>
${out(OUT.oxlintSaoMot)}
<p>A single <code>*</code> matches <strong>one</strong> path segment, so <code>@/features/*/*</code> matched <code>@/features/bac-si/KhuBacSi</code> but not <code>@/features/bac-si/hooks/useBacSi</code> (three segments after <code>features</code>), and <code>../../*</code> missed <code>../../../du-lieu/chuyen-khoa</code>. <code>**</code> matches any number of segments. The general lesson is the one this course keeps repeating: <em>test the checker</em> — a lint rule that never fires looks exactly like a codebase that never breaks it.</p>

<h3>Barrel cycles: <code>tsc</code> and Vitest say nothing, the browser goes blank</h3>
${slide('rx-07', 19, 'Barrel vòng tròn: tsc và Vitest không thấy, trình duyệt thì sập')}
<p>Why forbid features importing each other, if TypeScript is happy? Here is the bug the rule prevents, reproduced on the real project and then removed. Someone adds a schema to the appointments feature that reuses the patient schema from the booking feature, and the booking hook starts reading appointments:</p>
${pre('ts', SN.vongSchema)}
<p>Now <code>dat-lich</code> imports <code>lich-hen</code> and <code>lich-hen</code> imports <code>dat-lich</code>: an <strong>import cycle</strong>. Four tools, four answers:</p>
${out(OUT.vongVitestTong)}
${out(OUT.vongTrinhDuyet)}
${out(OUT.vongVitest)}
${out(OUT.oxlintVong)}
<ul>
<li><code>tsc</code>: no error. Types do not care about evaluation order.</li>
<li>Vitest: all 94 tests green — because no test happened to call <code>lichHenSchema</code>. A throwaway test that does shows why: <code>benhNhan</code> is <code>undefined</code> inside the schema.</li>
<li>Production build: works — the bundler happened to order the modules safely.</li>
<li><strong>Dev server in Chromium: blank page</strong>, "Cannot access 'benhNhanSchema' before initialization".</li>
<li>oxlint <code>import/no-cycle</code>: four errors, one per file in the cycle. The only tool that tells you <em>before</em> it hurts.</li>
</ul>
<div class="callout"><p><strong>JS quick reminder — why "before initialization"?</strong> ES modules run their top-level code once, in dependency order: a module's imports run first. In a cycle, one module must start before the other has finished. Here the browser started <code>dat-lich/index.ts</code>, which (first line) imported <code>useDatLich</code>, which imported <code>lich-hen</code>, whose <code>schema.ts</code> ran <code>z.object({ benhNhan: benhNhanSchema })</code> <em>immediately</em> — while <code>dat-lich/schema.ts</code>, which declares <code>benhNhanSchema</code> with <code>const</code>, had not run yet. A <code>const</code> that exists but has not been initialised is in the <strong>temporal dead zone (TDZ)</strong>; touching it throws a <code>ReferenceError</code>. Functions declared with <code>function</code> are hoisted and survive this; top-level <code>const</code> values (schemas, stores, objects) do not.</p></div>
<p>The fix is structural, not a reordering trick: code both features need — here the patient schema — moves <em>down</em> to <code>shared/</code>, and the two features stop knowing about each other.</p>

<h3><code>shared/</code>: only code that knows no feature exists</h3>
<p><code>shared/</code> is the easiest folder to ruin: "I'll just put it in shared" until it holds half the app. The test is the one from the step list: would this file make sense in a different app? The project's <code>shared/</code> holds the API client (<code>http.ts</code>, the query keys, the typed calls), generic UI (<code>LoiTaiDuLieu</code>, skeletons, <code>RanhGioiLoi</code>, <code>VungThongBao</code>, <code>TrangThaiMoCua</code>), generic hooks (<code>useDebounce</code>, <code>useLocalStorage</code>, <code>useTieuDeTrang</code>) — and one new file, every URL of the app in one place:</p>
${pre('ts', SN.duongDan)}
<p>Components write <code>duongDan.chiTietBacSi(bs.id)</code> instead of assembling <code>'/bac-si/' + id</code> in ten places; renaming a URL is a one-file change, and a typo is a TypeScript error instead of a 404. Tests stay next to the file they test (<code>TheBacSi.tsx</code> + <code>TheBacSi.test.tsx</code>), so moving a component moves its test with it.</p>
<p><strong>When NOT to do all this.</strong> A one-week lab with five components does not need four layers, lint overrides and barrels — folders by type are fine there. Structure pays off when several people work on the code for months. Don't create empty folders "for later", don't split a feature into <code>components/hooks/utils</code> sub-folders until it has more than a handful of files (the project's <code>lich-hen</code> is three flat files), and don't invent a fifth layer. Some teams go further with Feature-Sliced Design (layers such as <code>entities</code> and <code>widgets</code>); the principle — one-way dependencies, public APIs, checked by a tool — is the same.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202 projects are usually <code>src/components/</code> with every component, maybe <code>src/pages/</code>, a <code>src/redux/</code> folder with <code>actions/</code>, <code>reducers/</code> and <code>types/</code> sorted by type, and imports like <code>'../../../components/Header'</code>. → At work you usually find folders by feature, a small shared layer, an alias such as <code>@/</code>, and boundaries enforced by lint (ESLint's <code>import/no-restricted-paths</code> or <code>no-restricted-imports</code>, oxlint, or dependency-cruiser in CI). · <em>Why:</em> a team of five changes one feature per ticket; when a feature lives in one folder, a pull request touches one folder, code owners can be assigned per folder, and a feature can be deleted cleanly. The by-type layout is not wrong for a semester project — it is how Redux's own old tutorials were organised, and you will meet it in older codebases. Redux Toolkit itself moved to "feature folders" (one slice file per feature) for the same reason.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "How do you structure a medium-sized React project?"</p>
<p>By feature, not by file type: <code>features/&lt;name&gt;</code> holds a feature's components, hooks, state and tests, and exposes a small public API; a <code>shared</code> layer holds code that knows nothing about features; pages or the app layer compose features. Dependencies go one way (app → features → shared), features never import each other, and I enforce that with lint rules and an import-cycle check, because conventions nobody checks decay. I use a path alias configured in one place, and keep tests next to the code. For a small app I would not add all that — structure should follow the size of the team and codebase.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> move the patient schema to where both features can use it, and prove the cycle cannot come back.</p><ol>
<li>Create <code>src/shared/logic/benh-nhan-schema.ts</code> and move <code>benhNhanSchema</code> (and the helpers it needs: the phone regex, <code>tuoiTai</code>) into it. <code>features/dat-lich/schema.ts</code> imports it from <code>'@/shared/logic/benh-nhan-schema'</code>.</li>
<li>Add <code>features/lich-hen/schema.ts</code> with <code>lichHenSchema = z.object({ id: z.string(), benhNhan: benhNhanSchema })</code> importing from <code>shared</code>, export it from <code>lich-hen/index.ts</code>, and write one test that parses a valid appointment and rejects one with a 5-digit phone number.</li>
<li>Now try to cheat: in <code>features/lich-hen/schema.ts</code>, import <code>benhNhanSchema</code> from <code>'@/features/dat-lich'</code> instead.</li>
</ol><p><strong>Done when:</strong> with step 3 in place, <code>npx oxlint src</code> reports the <code>no-restricted-imports</code> error on that line (and exits non-zero); after reverting it, <code>npx oxlint src</code> has 0 errors, <code>npx tsc -b</code> prints nothing, and <code>npx vitest run</code> is all green including your new test.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">feature folder</span><span class="v">one folder per feature, holding all its code and tests</span></div>
<div class="kv"><span class="k">layers</span><span class="v"><code>app → pages → features → shared</code>; each may import only from below</span></div>
<div class="kv"><span class="k">public API / barrel</span><span class="v">the <code>index.ts</code> that re-exports what outsiders may use</span></div>
<div class="kv"><span class="k">path alias <code>@/</code></span><span class="v">a fixed name for <code>src/</code>, declared in <code>tsconfig</code> <code>paths</code></span></div>
<div class="kv"><span class="k"><code>resolve.tsconfigPaths</code></span><span class="v">Vite option that makes the dev server and Vitest read tsconfig <code>paths</code> (default <code>false</code>)</span></div>
<div class="kv"><span class="k">import cycle</span><span class="v">A imports B and B imports A (directly or through barrels)</span></div>
<div class="kv"><span class="k">TDZ (temporal dead zone)</span><span class="v">a <code>const</code>/<code>let</code> that exists but is not initialised yet; reading it throws</span></div>
<div class="kv"><span class="k"><code>no-restricted-imports</code></span><span class="v">lint rule that forbids import paths matching patterns, per folder via overrides</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>By-type folders spread one feature over four folders; by-feature folders put it in one, and deleting a feature is deleting a folder.</li>
<li>Four layers with one-way dependencies: <code>app → pages → features → shared</code>. Pages compose features; features never import each other (pass what you need as props).</li>
<li>Moving 73 files produced 100 tsc errors — 81 real (TS2307), 19 consequences. <code>tsc</code> is the to-do list.</li>
<li>Declare <code>@/</code> once in <code>tsconfig</code> <code>paths</code> and set <code>resolve.tsconfigPaths: true</code>: without it the build passed while the dev server returned 500 and 20 test files failed.</li>
<li>Each feature has a small <code>index.ts</code>; oxlint rules (with <code>**</code>, not <code>*</code>) block back doors, cross-feature and upward imports.</li>
<li>A barrel cycle passed tsc and 94 tests and still blanked the dev server with a TDZ error; <code>import/no-cycle</code> caught it.</li>
</ul>

${LINK('https://vite.dev/config/shared-options#resolve-tsconfigpaths', '📄', 'Vite — resolve.tsconfigPaths', 'The option (default false) that lets the dev server and Vitest use tsconfig paths.')}
${LINK('https://www.typescriptlang.org/tsconfig/#paths', '📄', 'TypeScript — paths', 'How path aliases are declared and resolved by the compiler.')}
${LINK('https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-restricted-imports.html', '📄', 'oxlint — no-restricted-imports', 'Patterns, messages and per-folder overrides.')}
${LINK('https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md', '📄', 'Bulletproof React — Project Structure', 'Feature folders, unidirectional dependencies, and its current advice on barrels.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Cấu trúc dự án mở rộng được: thư mục theo tính năng, phụ thuộc một chiều, luật do lint giữ</h2>
<p class="lead">Đầu chương này, app phòng khám có 73 file trong <code>src/</code>, xếp theo <em>loại file</em>: <code>components/</code>, <code>hooks/</code>, <code>logic/</code>, <code>store/</code>. Mọi bài hướng dẫn đều bắt đầu như vậy và với một bài lab thì ổn. Rồi một ticket tới — "cho lọc bác sĩ theo số năm kinh nghiệm" — và bạn phải mở bốn thư mục để tìm mã của một tính năng. Bài này sắp xếp lại dự án theo cách phần lớn nhóm React làm năm 2026, đo những gì hỏng dọc đường, và biến các luật thành lỗi lint để không ai phải nhớ.</p>
<p>Mọi thứ làm trên dự án của chương (chính dự án bạn sẽ dựng ở bài dự án). Lệnh dùng: <code>npx tsc</code>, <code>npx vitest run</code>, <code>npx vite build</code>, dev server của Vite trên một Chromium thật, và <strong>oxlint 1.85.0</strong> (linter có sẵn trong template Vite).</p>

<h3>Xếp theo loại file: nhỏ thì ổn, lớn lên thì khổ</h3>
${slide('rx-07', 15, 'Xếp theo loại file → xếp theo tính năng')}
<p>Trước chương này, các thư mục chứa: <code>components/</code> 24 file, <code>hooks/</code> 13, <code>logic/</code> 9, <code>store/</code> 3, cộng <code>schema/</code>, <code>api/</code>, <code>dat-lich/</code>, <code>mocks/</code>. Riêng tính năng "bác sĩ" — thẻ, danh sách, chip lọc, ô tìm, chi tiết, khu danh sách, hai hook, ba file logic, store yêu thích — rải trên <strong>bốn</strong> thư mục trong số đó. Xếp theo loại trả lời câu "mọi hook nằm đâu?", câu mà đi làm chẳng ai hỏi. Câu người ta hỏi là "mọi thứ về đặt lịch nằm đâu?" và "xoá tính năng đánh giá có làm hỏng thanh toán không?".</p>
<p>Xếp theo <strong>tính năng (feature)</strong> trả lời được những câu đó. Hết bài này, tính năng "bác sĩ" là một thư mục, và xoá một tính năng là xoá một thư mục.</p>

<h3>Bốn tầng: <code>app/</code>, <code>pages/</code>, <code>features/</code>, <code>shared/</code></h3>
${slide('rx-07', 16, 'Luật phụ thuộc một chiều: app → pages → features → shared')}
<table>
<thead><tr><th>Thư mục</th><th>Chứa gì</th><th>Được import</th></tr></thead>
<tbody>
<tr><td><code>app/</code></td><td>bảng route, layout gốc, header, QueryClient — những thứ chỉ có một</td><td>mọi tầng bên dưới</td></tr>
<tr><td><code>pages/</code></td><td>mỗi route một component; <strong>ghép</strong> các tính năng (trang bác sĩ = hồ sơ bác sĩ + bộ chọn giờ)</td><td><code>features/*</code> (qua <code>index.ts</code> của chúng), <code>shared/</code></td></tr>
<tr><td><code>features/&lt;tên&gt;/</code></td><td>mọi thứ của một tính năng: component, hook, store, logic, test, và một <code>index.ts</code></td><td>chỉ <code>shared/</code> — <strong>không bao giờ tính năng khác</strong></td></tr>
<tr><td><code>shared/</code></td><td>mã không biết tính năng nào tồn tại: API client, UI chung (hộp lỗi, khung xương, thông báo nổi), hook chung, hàm xử lý ngày</td><td>không gì ở trên nó</td></tr>
</tbody>
</table>
<p>Các file cố định theo hợp đồng của khoá giữ nguyên chỗ (<code>src/types.ts</code>, <code>src/du-lieu/</code>, <code>src/mocks/</code>) và tính là tầng dùng chung. Luật quan trọng nhất: <strong>phụ thuộc chỉ đi một chiều — đi xuống</strong>. <code>app → pages → features → shared</code>. Đây cũng là "codebase một chiều" mà hướng dẫn Bulletproof React (được dùng rất rộng) khuyên.</p>
<p><strong>Chạy thử từng bước</strong> — một file mới nằm ở đâu? Hỏi theo thứ tự:</p>
<ol>
<li>Chỉ đúng một tính năng dùng nó? → trong thư mục của tính năng đó.</li>
<li>Nó ghép hai tính năng trên một màn hình? → <code>pages/</code>.</li>
<li>Nó vẫn có nghĩa trong một app khác hẳn (hàm định dạng ngày, <code>useDebounce</code>, hộp báo lỗi)? → <code>shared/</code>.</li>
<li>Nó là dây nối cho cả app (router, provider, layout)? → <code>app/</code>.</li>
</ol>
<p>Luật "tính năng không import nhau" buộc dự án đổi một chỗ thiết kế nhỏ. "Lịch hẹn của tôi" cần <em>tên</em> bác sĩ, mà tên thuộc về tính năng bác sĩ. Trước đây <code>LichHenCuaToi</code> tự gọi <code>useBacSi()</code>. Giờ component lịch hẹn xin thứ nó cần qua prop, và <em>trang</em> — nơi được thấy cả hai tính năng — đưa cho nó:</p>
${pre('tsx', SN.danhSachLichHenProps)}
${pre('tsx', SN.trangLichHen)}
<p>Đó là tiêm phụ thuộc (dependency injection) mà chẳng cần thư viện nào: tính năng tuyên bố "cho tôi một hàm biến id thành tên"; ai ghép màn hình thì quyết định tên lấy từ đâu. Tính năng lịch hẹn giờ test được — và dùng lại được — mà không cần tính năng bác sĩ.</p>

<h3>Dời 73 file: 100 lỗi TypeScript là danh sách việc của bạn</h3>
<p>Bản thân việc dời chỉ là <code>mv</code> (hoặc kéo-thả trong editor). Ngay sau khi dời, chưa sửa một import nào:</p>
${out(OUT.tscDon)}
<p>Đừng hoảng vì con số 100. Đọc mã lỗi: <strong>TS2307</strong> "Cannot find module" là mọi import mà đích đã dời đi — đó mới là danh sách thật. <strong>TS7006</strong> "implicitly has an 'any' type" và <strong>TS2339</strong> là <em>hệ quả</em>: một module không tìm thấy thì TypeScript không còn biết kiểu của thứ nó export, nên các callback dùng chúng cũng mất kiểu theo. Sửa 81 module thiếu là 19 lỗi còn lại tự biến mất. Hai mẹo thực tế: VS Code tự sửa import khi bạn dời file <em>ngay trong editor</em> (không phải trong terminal), và <code>tsc</code> là phép kiểm rằng bạn không sót chỗ nào — chạy tới khi nó không in gì.</p>

<h3>Alias <code>@/</code>: một nguồn sự thật — và một bản build xanh biết nói dối</h3>
${slide('rx-07', 18, 'Alias @/: build xanh chưa chắc dev và test xanh')}
<p>Thư mục sâu hơn thì import tương đối thành <code>'../../../du-lieu/chuyen-khoa'</code>. Ai cũng đếm nhầm dấu chấm, và dời một file là chúng lại gãy. <strong>Alias (bí danh)</strong> cho thư mục <code>src/</code> một cái tên cố định: <code>'@/du-lieu/chuyen-khoa'</code> dùng được ở mọi độ sâu. Nó phải khai ở chỗ các công cụ đọc được. Dự án khai đúng một lần, trong cấu hình TypeScript:</p>
${pre('json', SN.tsPaths)}
<p>Giờ <code>tsc</code> hiểu <code>@/</code>. Đây là những gì xảy ra tiếp theo, theo thứ tự — bài học nằm ở dòng giữa:</p>
${out(OUT.buildThieuAlias)}
${out(OUT.vitestThieu)}
${out(OUT.devThieu)}
<p>Bản <strong>build production chạy qua</strong> — Vite 8 đóng gói bằng Rolldown, và Rolldown tự đọc <code>paths</code> trong <code>tsconfig</code> (bỏ <code>paths</code> đi thì nó cũng hỏng: <code>${H(OUT.buildKhongPathsNgan)}…</code>). Nhưng <strong>dev server</strong> trả 500 và <strong>Vitest</strong> hỏng cả 20 file test: cả hai đi qua bộ phân giải riêng của Vite, nơi tsconfig paths <em>tắt</em> theo mặc định (<code>resolve.tsconfigPaths</code>, mặc định <code>false</code>, theo tài liệu Vite). Một dòng cấu hình chữa cả hai, và alias vẫn chỉ khai ở một chỗ:</p>
${pre('ts', SN.viteConfig)}
${out(OUT.vitestSau)}
<div class="pitfall co-tieu-de"><strong>Bẫy — "build xanh" không có nghĩa là "dự án chạy".</strong> Ở đây, bước CI <code>vite build</code> sẽ qua trong khi <code>npm run dev</code> của mọi lập trình viên ra 500 và mọi test đều hỏng. Chiều ngược lại cũng xảy ra (test xanh, build đỏ). Sau khi đổi cấu hình — alias, plugin, biến môi trường — chạy đủ ba lệnh: <code>npx tsc -b</code>, <code>npx vitest run</code>, <code>npx vite build</code>, và mở dev server một lần. Cũng đừng dùng cách chữa cũ là khai alias lần hai trong <code>resolve.alias</code>: hai nguồn sự thật sẽ lệch nhau ngay lần đầu có người thêm <code>@/assets</code> vào chỉ một bên.</div>

<h3>Mỗi tính năng một cửa: <code>index.ts</code></h3>
${slide('rx-07', 17, 'Mỗi tính năng một cửa index.ts — lint chặn đi cửa sau')}
<p>Mỗi tính năng export những gì bên ngoài được dùng từ đúng một file — <strong>public API</strong> của nó. Mọi thứ khác trong thư mục là riêng tư, đổi tên hay dời chỗ thoải mái:</p>
${pre('ts', SN.indexBacSi)}
${pre('ts', SN.indexDatLich)}
<p>Trang khi đó import <code>from '@/features/bac-si'</code>, không bao giờ <code>from '@/features/bac-si/hooks/useChiTietBacSi'</code>. File xuất lại các file khác như thế gọi là <strong>barrel</strong>. Barrel có cái giá thật, và nói cho công bằng: hướng dẫn Bulletproof React hiện khuyên <em>không</em> dùng barrel cho tính năng, vì lúc dev Vite phải tải mọi module mà barrel xuất lại, và vì barrel làm vòng import rất dễ xảy ra — phần sau nữa cho thấy một cái. Dự án này giữ barrel nhỏ (chỉ thứ các trang thật sự dùng — năm cái tên cho tính năng bác sĩ) và để linter cấm vòng tròn. Import thẳng từng file và giữ ranh giới bằng một luật đường dẫn cũng là một quyết định đúng của nhóm; điều quan trọng là ranh giới có tồn tại và có người kiểm.</p>

<h3>Biến luật thành lỗi lint</h3>
<p>Quy ước viết trong README sẽ bị quên vào chiều thứ Sáu đầu tiên. Luật <code>no-restricted-imports</code> của oxlint, cùng <code>overrides</code> theo từng thư mục, biến bốn tầng thành lỗi:</p>
${pre('json', SN.oxlint)}
<p>Rồi bốn lỗi cố tình — mỗi luật một cái — để kiểm rằng bộ kiểm có kiểm:</p>
${out(OUT.oxlintViPham)}
<p>Mỗi thông báo nói rõ luật bằng tiếng Việt, nên người mới vào nhóm học kiến trúc ngay từ thông báo lỗi. Gỡ bốn dòng đó ra, cả <code>src/</code> sạch:</p>
${out(OUT.oxlintSach)}
<div class="callout"><p><strong>JS nhắc nhanh — <code>*</code> và <code>**</code> trong các mẫu này.</strong> Bản đầu của cấu hình dùng <code>"@/features/*/*"</code> và <code>"../../*"</code>. Nhìn thì đúng. Đo thật:</p></div>
${out(OUT.oxlintSaoMot)}
<p>Một dấu <code>*</code> khớp <strong>một</strong> đoạn đường dẫn, nên <code>@/features/*/*</code> khớp <code>@/features/bac-si/KhuBacSi</code> nhưng không khớp <code>@/features/bac-si/hooks/useBacSi</code> (ba đoạn sau <code>features</code>), và <code>../../*</code> để lọt <code>../../../du-lieu/chuyen-khoa</code>. <code>**</code> khớp bao nhiêu đoạn cũng được. Bài học chung là điều khoá này cứ nhắc mãi: <em>kiểm cái bộ kiểm</em> — một luật lint không bao giờ bắn trông y hệt một codebase không bao giờ phạm luật.</p>

<h3>Barrel vòng tròn: <code>tsc</code> và Vitest im lặng, trình duyệt trắng trang</h3>
${slide('rx-07', 19, 'Barrel vòng tròn: tsc và Vitest không thấy, trình duyệt thì sập')}
<p>Vì sao cấm tính năng import nhau, khi TypeScript vẫn vui vẻ? Đây là con bug mà luật đó chặn, tái hiện trên chính dự án rồi gỡ ra. Ai đó thêm vào tính năng lịch hẹn một schema dùng lại schema bệnh nhân của tính năng đặt lịch, và hook đặt lịch bắt đầu đọc lịch hẹn:</p>
${pre('ts', SN.vongSchema)}
<p>Giờ <code>dat-lich</code> import <code>lich-hen</code>, và <code>lich-hen</code> import <code>dat-lich</code>: một <strong>vòng import (import cycle)</strong>. Bốn công cụ, bốn câu trả lời:</p>
${out(OUT.vongVitestTong)}
${out(OUT.vongTrinhDuyet)}
${out(OUT.vongVitest)}
${out(OUT.oxlintVong)}
<ul>
<li><code>tsc</code>: không lỗi nào. Kiểu không quan tâm thứ tự chạy.</li>
<li>Vitest: cả 94 test xanh — vì chẳng test nào tình cờ gọi <code>lichHenSchema</code>. Một test viết thử để gọi nó cho thấy lý do: <code>benhNhan</code> bên trong schema là <code>undefined</code>.</li>
<li>Bản build production: chạy — bộ đóng gói tình cờ xếp module theo thứ tự an toàn.</li>
<li><strong>Dev server trên Chromium: trắng trang</strong>, "Cannot access 'benhNhanSchema' before initialization".</li>
<li>oxlint <code>import/no-cycle</code>: bốn lỗi, mỗi file trong vòng một lỗi. Công cụ duy nhất báo cho bạn <em>trước khi</em> nó gây đau.</li>
</ul>
<div class="callout"><p><strong>JS nhắc nhanh — vì sao "before initialization"?</strong> ES module chạy mã cấp cao nhất của nó đúng một lần, theo thứ tự phụ thuộc: import của một module chạy trước. Trong một vòng, buộc có một module phải bắt đầu trước khi module kia chạy xong. Ở đây trình duyệt bắt đầu <code>dat-lich/index.ts</code>, dòng đầu import <code>useDatLich</code>, file đó import <code>lich-hen</code>, và <code>schema.ts</code> của nó chạy <code>z.object({ benhNhan: benhNhanSchema })</code> <em>ngay lập tức</em> — trong khi <code>dat-lich/schema.ts</code>, nơi khai <code>benhNhanSchema</code> bằng <code>const</code>, còn chưa chạy. Một <code>const</code> đã tồn tại mà chưa được gán giá trị nằm trong <strong>vùng chết tạm thời (TDZ — temporal dead zone)</strong>; đụng vào nó là ném <code>ReferenceError</code>. Hàm khai bằng <code>function</code> được "kéo lên" (hoisting) nên sống sót; giá trị <code>const</code> cấp cao nhất (schema, store, object) thì không.</p></div>
<p>Cách chữa nằm ở cấu trúc, không phải mẹo đổi thứ tự: thứ cả hai tính năng cùng cần — ở đây là schema bệnh nhân — chuyển <em>xuống</em> <code>shared/</code>, và hai tính năng thôi biết về nhau.</p>

<h3><code>shared/</code>: chỉ chứa mã không biết tính năng nào tồn tại</h3>
<p><code>shared/</code> là thư mục dễ bị làm hỏng nhất: "cứ bỏ vào shared" cho tới khi nó chứa nửa cái app. Phép thử là câu hỏi trong danh sách bước: file này có còn nghĩa trong một app khác không? <code>shared/</code> của dự án chứa API client (<code>http.ts</code>, query key, các lời gọi có kiểu), UI chung (<code>LoiTaiDuLieu</code>, khung xương, <code>RanhGioiLoi</code>, <code>VungThongBao</code>, <code>TrangThaiMoCua</code>), hook chung (<code>useDebounce</code>, <code>useLocalStorage</code>, <code>useTieuDeTrang</code>) — và một file mới, mọi URL của app ở một chỗ:</p>
${pre('ts', SN.duongDan)}
<p>Component viết <code>duongDan.chiTietBacSi(bs.id)</code> thay vì tự ghép <code>'/bac-si/' + id</code> ở mười nơi; đổi một URL là sửa một file, và gõ nhầm là lỗi TypeScript chứ không phải một trang 404. Test nằm ngay cạnh file nó kiểm (<code>TheBacSi.tsx</code> + <code>TheBacSi.test.tsx</code>), nên dời component là dời luôn test của nó.</p>
<p><strong>Khi nào KHÔNG làm hết những thứ này.</strong> Một bài lab một tuần với năm component không cần bốn tầng, override lint và barrel — thư mục theo loại là ổn. Cấu trúc chỉ đáng công khi nhiều người cùng làm trên mã trong nhiều tháng. Đừng tạo thư mục rỗng "để dành", đừng chia một tính năng thành <code>components/hooks/utils</code> khi nó chưa có quá vài file (<code>lich-hen</code> của dự án chỉ là ba file phẳng), và đừng bịa ra tầng thứ năm. Có nhóm đi xa hơn với Feature-Sliced Design (thêm các tầng như <code>entities</code>, <code>widgets</code>); nguyên lý — phụ thuộc một chiều, public API, có công cụ kiểm — vẫn là một.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Đồ án FER202 thường là <code>src/components/</code> chứa mọi component, có thể thêm <code>src/pages/</code>, một thư mục <code>src/redux/</code> với <code>actions/</code>, <code>reducers/</code>, <code>types/</code> xếp theo loại, và import kiểu <code>'../../../components/Header'</code>. → Đi làm, bạn thường gặp thư mục theo tính năng, một tầng dùng chung nhỏ, một alias như <code>@/</code>, và ranh giới được lint giữ (<code>import/no-restricted-paths</code> hay <code>no-restricted-imports</code> của ESLint, oxlint, hoặc dependency-cruiser trong CI). · <em>Vì sao:</em> một nhóm năm người, mỗi ticket đổi một tính năng; tính năng nằm trong một thư mục thì pull request chạm một thư mục, giao người phụ trách (code owner) theo thư mục được, và xoá một tính năng sạch sẽ. Cách xếp theo loại không sai cho một đồ án học kỳ — chính bài hướng dẫn cũ của Redux từng xếp như vậy, và bạn sẽ gặp nó trong mã cũ. Bản thân Redux Toolkit đã chuyển sang "feature folders" (mỗi tính năng một file slice) cũng vì lý do này.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Bạn tổ chức một dự án React cỡ vừa thế nào?"</p>
<p>Theo tính năng, không theo loại file: <code>features/&lt;tên&gt;</code> chứa component, hook, state và test của một tính năng, và lộ ra một public API nhỏ; tầng <code>shared</code> chứa mã không biết gì về tính năng; trang hoặc tầng app ghép các tính năng. Phụ thuộc đi một chiều (app → features → shared), tính năng không import nhau, và em giữ điều đó bằng luật lint cùng một phép kiểm vòng import, vì quy ước không ai kiểm sẽ mục dần. Em dùng path alias khai ở một chỗ, và để test cạnh mã. Với app nhỏ thì em không thêm hết những thứ đó — cấu trúc nên đi theo độ lớn của nhóm và của mã.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> chuyển schema bệnh nhân tới chỗ cả hai tính năng dùng được, và chứng minh vòng tròn không quay lại được.</p><ol>
<li>Tạo <code>src/shared/logic/benh-nhan-schema.ts</code> và dời <code>benhNhanSchema</code> (cùng các hàm nó cần: regex số điện thoại, <code>tuoiTai</code>) vào đó. <code>features/dat-lich/schema.ts</code> import nó từ <code>'@/shared/logic/benh-nhan-schema'</code>.</li>
<li>Thêm <code>features/lich-hen/schema.ts</code> với <code>lichHenSchema = z.object({ id: z.string(), benhNhan: benhNhanSchema })</code> import từ <code>shared</code>, export nó qua <code>lich-hen/index.ts</code>, và viết một test parse được một lịch hẹn hợp lệ và từ chối một lịch hẹn có số điện thoại 5 chữ số.</li>
<li>Giờ thử ăn gian: trong <code>features/lich-hen/schema.ts</code>, import <code>benhNhanSchema</code> từ <code>'@/features/dat-lich'</code>.</li>
</ol><p><strong>Đạt khi:</strong> còn bước 3 thì <code>npx oxlint src</code> báo lỗi <code>no-restricted-imports</code> đúng dòng đó (và thoát khác 0); gỡ bước 3 thì <code>npx oxlint src</code> 0 lỗi, <code>npx tsc -b</code> không in gì, <code>npx vitest run</code> xanh hết kể cả test mới.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">feature folder (thư mục tính năng)</span><span class="v">mỗi tính năng một thư mục, chứa mọi mã và test của nó</span></div>
<div class="kv"><span class="k">tầng (layer)</span><span class="v"><code>app → pages → features → shared</code>; mỗi tầng chỉ import tầng dưới</span></div>
<div class="kv"><span class="k">public API / barrel</span><span class="v"><code>index.ts</code> xuất lại những gì bên ngoài được dùng</span></div>
<div class="kv"><span class="k">path alias <code>@/</code> (bí danh đường dẫn)</span><span class="v">tên cố định cho <code>src/</code>, khai trong <code>paths</code> của <code>tsconfig</code></span></div>
<div class="kv"><span class="k"><code>resolve.tsconfigPaths</code></span><span class="v">tuỳ chọn của Vite cho dev server và Vitest đọc <code>paths</code> (mặc định <code>false</code>)</span></div>
<div class="kv"><span class="k">import cycle (vòng import)</span><span class="v">A import B và B import A (trực tiếp hoặc qua barrel)</span></div>
<div class="kv"><span class="k">TDZ (vùng chết tạm thời)</span><span class="v"><code>const</code>/<code>let</code> đã tồn tại mà chưa được gán; đọc nó là ném lỗi</span></div>
<div class="kv"><span class="k"><code>no-restricted-imports</code></span><span class="v">luật lint cấm đường import khớp mẫu, theo từng thư mục qua override</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thư mục theo loại rải một tính năng ra bốn nơi; thư mục theo tính năng gom về một, và xoá tính năng là xoá một thư mục.</li>
<li>Bốn tầng, phụ thuộc một chiều: <code>app → pages → features → shared</code>. Trang ghép tính năng; tính năng không import nhau (cần gì thì nhận qua prop).</li>
<li>Dời 73 file sinh 100 lỗi tsc — 81 lỗi thật (TS2307), 19 lỗi hệ quả. <code>tsc</code> là danh sách việc.</li>
<li>Khai <code>@/</code> một lần trong <code>paths</code> của <code>tsconfig</code> và bật <code>resolve.tsconfigPaths: true</code>: thiếu nó, build qua mà dev server trả 500 và 20 file test hỏng.</li>
<li>Mỗi tính năng một <code>index.ts</code> nhỏ; luật oxlint (dùng <code>**</code>, không phải <code>*</code>) chặn cửa sau, import xuyên tính năng và import ngược lên.</li>
<li>Một vòng barrel qua được tsc và 94 test mà vẫn làm trắng dev server bằng lỗi TDZ; <code>import/no-cycle</code> bắt được nó.</li>
</ul>

${LINK('https://vite.dev/config/shared-options#resolve-tsconfigpaths', '📄', 'Vite — resolve.tsconfigPaths', 'Tuỳ chọn (mặc định false) cho dev server và Vitest dùng paths của tsconfig.')}
${LINK('https://www.typescriptlang.org/tsconfig/#paths', '📄', 'TypeScript — paths', 'Cách khai path alias và cách trình biên dịch phân giải nó.')}
${LINK('https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-restricted-imports.html', '📄', 'oxlint — no-restricted-imports', 'Mẫu, thông báo và override theo từng thư mục.')}
${LINK('https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md', '📄', 'Bulletproof React — Project Structure', 'Thư mục theo tính năng, phụ thuộc một chiều, và lời khuyên hiện tại về barrel.')}
</div>
`,
    },

    /* ─────────────────────────── 7.4 ─────────────────────────── */
    {
      title: '7.4 — From React to Next.js: what changes, when you need it, and how our routes map|||7.4 — Từ React sang Next.js: khác gì, khi nào cần, và route của ta chuyển sang thế nào',
      slug: 'rx-7-4-sang-nextjs',
      type: 'LESSON',
      isFreePreview: true,
      description: 'SPA gửi HTML rỗng còn Next.js gửi HTML có sẵn nội dung (đo bằng curl), bảng chuyển route React Router sang thư mục app/ của Next.js 16, next build dựng sẵn sáu trang bác sĩ, Server Component và "use client" (lỗi build thật khi quên), và bảng quyết định khi nào Vite SPA là đủ — trỏ sang khoá Next.js.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>From React to Next.js: what changes, when you need it, and how our routes map</h2>
<p class="lead">Job ads say "React" and then, two lines later, "Next.js". They are not competitors: Next.js <em>is</em> React — the same components, hooks and JSX — plus a server, a file-based router, and rendering strategies that a Vite SPA does not have. This lesson moves a slice of the clinic app to Next.js 16 so that you can see, with real output, what actually changes, what stays, and when the extra machinery is worth it. The full course is at <a href="/courses/nextjs">/courses/nextjs</a>; this is the bridge.</p>
<p>The Next.js project is <code>ch07-next</code> (next 16.3.6, react 19.3.0, the same <code>du-lieu/bac-si.ts</code> and <code>types.ts</code> as the Vite app). The SPA it is compared with is the browser project from Lesson 7.1, built with <code>vite build</code> and served with <code>vite preview</code>.</p>

<h3>The first difference: what the server sends</h3>
${slide('rx-07', 20, 'SPA gửi HTML rỗng — Next.js gửi HTML có sẵn nội dung')}
<p>Ask both apps for the page of BS. Trần Thu Hà the way a crawler, a link-preview bot or a slow phone first sees it: raw HTML, no JavaScript executed.</p>
${out(OUT.spaCurl)}
${out(OUT.nextCurl)}
<p>The SPA's HTML has <strong>zero</strong> <code>&lt;h1&gt;</code> tags: the body is an empty <code>&lt;div id="root"&gt;</code>, and the doctor's name only exists after the browser downloads, parses and runs the JavaScript bundle (313 kB in Lesson 7.1), and React renders. Next.js answers with the name already in the HTML (5,604 bytes for the whole page), and answers with a <em>real</em> 404 status for a doctor that does not exist — the SPA answers 200 for every path and draws its 404 page afterwards.</p>
<p>Three names you will hear for this:</p>
<ul>
<li><strong>CSR — client-side rendering (vẽ ở trình duyệt)</strong>: the SPA. HTML is empty; the browser builds the page.</li>
<li><strong>SSR — server-side rendering (vẽ ở máy chủ mỗi request)</strong>: the server runs your React components for each request and sends finished HTML; the browser then <em>hydrates</em> it (attaches event handlers) to make it interactive.</li>
<li><strong>SSG — static site generation (dựng sẵn lúc build)</strong>: the same as SSR, but done once at build time, producing HTML files — which is what the next section shows.</li>
</ul>
<p>Why companies care: pages people find through search or share on social apps (a clinic's doctor profiles, a shop's products, a blog) want content in the HTML; phones on slow networks see text before the JavaScript arrives. Pages behind a login (a dashboard, "my appointments") mostly do not care — nobody searches for them.</p>

<h3>Our routes, as folders</h3>
${slide('rx-07', 21, 'Route của React Router ↔ thư mục app/ của Next.js')}
<p>Next.js has no route table. In its App Router, <strong>the folder structure under <code>app/</code> is the route table</strong>: each folder is a URL segment, a <code>page.tsx</code> inside makes it a page, and special file names play the roles Lesson 7.2 gave to route fields. The clinic's routes, translated:</p>
<table>
<thead><tr><th>React Router (this chapter)</th><th>Next.js App Router</th></tr></thead>
<tbody>
<tr><td><code>{ index: true, Component: TrangChu }</code> at <code>/</code></td><td><code>app/page.tsx</code></td></tr>
<tr><td><code>{ path: 'bac-si', Component: … }</code></td><td><code>app/bac-si/page.tsx</code></td></tr>
<tr><td><code>{ path: 'bac-si/:id' }</code> + <code>useParams()</code></td><td><code>app/bac-si/[id]/page.tsx</code> + the <code>params</code> prop</td></tr>
<tr><td>layout route with <code>&lt;Outlet /&gt;</code></td><td><code>layout.tsx</code> with <code>{children}</code> (one per folder, nested automatically)</td></tr>
<tr><td>route <code>ErrorBoundary</code></td><td><code>error.tsx</code> (a Client Component)</td></tr>
<tr><td><code>HydrateFallback</code> / pending UI</td><td><code>loading.tsx</code> (a Suspense boundary for the segment)</td></tr>
<tr><td><code>{ path: '*' }</code> / <code>throw data(…, { status: 404 })</code></td><td><code>not-found.tsx</code> / <code>notFound()</code></td></tr>
<tr><td>guard layout route / <code>middleware</code></td><td>a check in the layout or page on the server, or <code>proxy.ts</code> (Next 16 renamed <code>middleware.ts</code> to <code>proxy.ts</code>)</td></tr>
<tr><td><code>&lt;Link to="/bac-si"&gt;</code> (from <code>react-router</code>)</td><td><code>&lt;Link href="/bac-si"&gt;</code> (from <code>next/link</code>) — note <code>href</code>, not <code>to</code></td></tr>
<tr><td><code>useNavigate()</code></td><td><code>useRouter()</code> from <code>next/navigation</code> → <code>router.push()</code> / <code>router.replace()</code></td></tr>
<tr><td><code>useSearchParams()</code></td><td><code>useSearchParams()</code> from <code>next/navigation</code> (read-only), or the <code>searchParams</code> prop</td></tr>
</tbody>
</table>
<p>The root layout plays the role of <code>KhungChinh</code>. Note that it renders <code>&lt;html&gt;</code> and <code>&lt;body&gt;</code> itself — there is no <code>index.html</code> in a Next.js app:</p>
${pre('tsx', SN.nextLayout)}
<p>The list page is almost the Vite component, with <code>href</code> instead of <code>to</code>:</p>
${pre('tsx', SN.nextDanhSach)}

<h3><code>next build</code> pre-renders six doctor pages</h3>
${slide('rx-07', 22, 'next build dựng sẵn sáu trang bác sĩ')}
<p>The detail page is where the model differs most:</p>
${pre('tsx', SN.nextChiTiet)}
<div class="callout"><p><strong>JS quick reminder — <code>async</code> / <code>await</code>.</strong> A function marked <code>async</code> always returns a Promise (a "value that arrives later"). Inside it, <code>await something</code> pauses that function until the Promise settles and gives you its value — without blocking anything else. In Next.js 15 and later, <code>params</code> is a Promise, so the page component is <code>async</code> and writes <code>const { id } = await params;</code>. Server Components are allowed to be async; components in a Vite SPA are not.</p></div>
<ul>
<li><strong>The component reads the data directly</strong> — <code>danhSachBacSi.find(…)</code>, no <code>useQuery</code>, no <code>useEffect</code>, no loading state. It runs on the server (at build time here), where the data is. With a real database it would <code>await db.bacSi.findUnique(…)</code> right there.</li>
<li><code>generateStaticParams</code> lists which <code>id</code>s to pre-render. <code>notFound()</code> is the <code>throw data(…, { status: 404 })</code> of Lesson 7.2.</li>
</ul>
${out(OUT.nextBuild)}
<p>The legend at the bottom is the point: <code>○</code> pages are static, <code>●</code> pages were generated from <code>generateStaticParams</code> — six HTML files, one per doctor, created at build time. A CDN can serve them like images. The Vite build, for comparison, produces one <code>index.html</code> for every URL.</p>

<h3>Server Components by default, <code>'use client'</code> when you need interaction</h3>
${slide('rx-07', 23, "Server Component mặc định, 'use client' khi cần tương tác")}
<p>Everything in <code>app/</code> is a <strong>Server Component</strong> unless you say otherwise: it runs on the server, its code is <em>not</em> sent to the browser, and it cannot use state, effects or event handlers — because there is no browser where it runs. Anything interactive goes into a file that starts with <code>'use client'</code>:</p>
${pre('tsx', SN.nextNut)}
<p>The page stays a Server Component and simply renders <code>&lt;NutYeuThich /&gt;</code>; Next.js sends only the button's code to the browser. What happens when you forget — say you copy a component from the Vite app as it is:</p>
${out(OUT.nextLoi)}
<div class="pitfall co-tieu-de"><strong>Trap — porting a Vite component and forgetting it ran in the browser.</strong> Every component of this course's app uses at least one of <code>useState</code>, <code>useEffect</code>, <code>onClick</code>, TanStack Query hooks, Zustand stores, <code>localStorage</code> or <code>window</code>. In Next.js each of those must live below a <code>'use client'</code> boundary, or the build fails as above (hooks) or crashes on the server (<code>window is not defined</code>). The fix is not to put <code>'use client'</code> on every file — that throws away what Next.js gives you — but to push interactivity to the leaves: the page and the list stay on the server, the heart button, the filter chips and the booking form become client components.</div>
<p>For the clinic app, the split would be roughly: doctor list, doctor profile, specialty pages → Server Components (pre-rendered, SEO); filter chips + search box, time-slot picker, booking form (React Hook Form), "my appointments" with cancel → Client Components; TanStack Query stays for the client parts that fetch after interaction.</p>

<h3>When you need Next.js — and when a Vite SPA is enough</h3>
${slide('rx-07', 24, 'Khi nào cần Next.js — khi nào Vite SPA là đủ')}
<table>
<thead><tr><th>Question</th><th>Vite SPA + React Router is fine</th><th>Reach for Next.js (or React Router Framework Mode)</th></tr></thead>
<tbody>
<tr><td>Do pages need to be found by search / previewed when shared?</td><td>No — admin tools, dashboards, apps behind a login</td><td>Yes — product pages, profiles, blog, landing pages</td></tr>
<tr><td>Where does it deploy?</td><td>Any static host / CDN (just files)</td><td>A Node server or a platform that runs one (static export exists but drops the server features)</td></tr>
<tr><td>Who owns the backend?</td><td>A separate API team (Spring, .NET, Node) — the frontend only calls it</td><td>The frontend team also wants server code close to the UI (route handlers, server actions)</td></tr>
<tr><td>First paint on slow phones matters?</td><td>Less — users open it once and stay</td><td>More — every visit is a cold visit</td></tr>
<tr><td>Team experience</td><td>Plain React is enough</td><td>Team must learn the server/client boundary, caching and a new deploy model</td></tr>
</tbody>
</table>
<p>React Router's <strong>Framework Mode</strong> (Lesson 7.1's third mode) is the middle road: keep React Router, add its Vite plugin, and get SSR/SSG and route modules — no need to rewrite routes into folders. Next.js is the more common requirement in Vietnamese job ads; Framework Mode is easier to adopt from an existing React Router app. ⏳ Not run for real here: this lesson did not build a Framework Mode project. <!-- CHAY-O-MAY: npx create-react-router@latest, chuyển 3 route bac-si sang routes.ts + route module, so sánh curl HTML với bản Next.js ở trên --></p>
<p>This course's clinic app stays a Vite SPA on purpose: the booking flow is interactive, "my appointments" is behind a login, and learning React without a server in the way is simpler. A real clinic would probably put its public doctor pages on Next.js — which is exactly the project in <a href="/courses/nextjs">/courses/nextjs</a>.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202 builds every project as a client-rendered SPA (Create React App in the older slides), and SEO, first load and the server are simply not part of the syllabus; "multiple pages" means React Router, full stop. → At work, the first architecture question is <em>which pages need server rendering</em>: public, searchable pages go to Next.js (or another SSR framework) with Server Components by default; logged-in, highly interactive tools are often still a Vite SPA like this course's app, served from a CDN and talking to a separate API. · <em>Why:</em> an empty HTML shell is invisible to anything that does not run JavaScript and slow on weak phones, while a server adds cost, deployment complexity and a new class of bugs (server/client boundary). Neither is "the modern way" — picking per page is. The SPA you learn in FER202 is exactly what many internal company tools still are, and everything you learn in this course (components, hooks, state, TanStack Query, forms) carries straight into Next.js.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "What is the difference between CSR, SSR and SSG, and when would you use each?"</p>
<p>CSR: the server sends an empty shell and JavaScript builds the page in the browser — simple hosting, good for apps behind a login, but no content in the initial HTML. SSR: the server renders HTML for each request, then the browser hydrates it — fresh, SEO-friendly, needs a running server. SSG: HTML is rendered once at build time and served as static files — fastest, cheapest, good for content that changes rarely (doctor profiles), can be combined with revalidation. In Next.js App Router, Server Components render on the server by default and <code>'use client'</code> marks the interactive parts. I would pick per page: SSG/SSR for public pages, CSR for the logged-in dashboard.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> add pre-rendered specialty pages to the Next.js project.</p><ol>
<li>Create <code>app/chuyen-khoa/[ma]/page.tsx</code>: <code>generateStaticParams</code> returns the four keys of <code>TEN_CHUYEN_KHOA</code>; the page (async, <code>await params</code>) calls <code>notFound()</code> for an unknown key, otherwise renders an <code>h1</code> with the specialty name and a list of <code>Link</code>s (<code>next/link</code>) to each doctor of that specialty.</li>
<li>Add a <code>'use client'</code> component <code>BoDemLuotXem</code> with a button that counts clicks, and render it on the specialty page.</li>
<li>Run <code>npx next build</code>, then <code>npx next start -p 5175</code> and <code>curl -s localhost:5175/chuyen-khoa/nhi | grep -o "BS\\. [^<]*"</code>.</li>
</ol><p><strong>Done when:</strong> the build output lists <code>/chuyen-khoa/[ma]</code> with <code>●</code> paths, the curl prints "BS. Trần Thu Hà" and "BS. Vũ Thảo Vy" from the raw HTML, <code>/chuyen-khoa/tim-mach</code> returns status 404, and removing <code>'use client'</code> from the counter makes the build fail with the error shown in this lesson.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">CSR</span><span class="v">client-side rendering: empty HTML, the browser builds the page with JavaScript</span></div>
<div class="kv"><span class="k">SSR</span><span class="v">server-side rendering: HTML rendered on the server per request</span></div>
<div class="kv"><span class="k">SSG</span><span class="v">static site generation: HTML rendered once at build time</span></div>
<div class="kv"><span class="k">hydration</span><span class="v">React attaching event handlers to server-rendered HTML in the browser</span></div>
<div class="kv"><span class="k">App Router</span><span class="v">Next.js routing where folders under <code>app/</code> are URL segments and <code>page.tsx</code> is a page</span></div>
<div class="kv"><span class="k">Server Component</span><span class="v">runs only on the server; its code is not sent to the browser; no state or events</span></div>
<div class="kv"><span class="k"><code>'use client'</code></span><span class="v">marks a file (and what it imports) as client code that can use hooks and events</span></div>
<div class="kv"><span class="k"><code>generateStaticParams</code></span><span class="v">tells Next.js which dynamic paths to pre-render at build time</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Next.js is React plus a server: same components and hooks, different routing and rendering.</li>
<li>Measured: the SPA's HTML for <code>/bac-si/bs-2</code> has 0 <code>&lt;h1&gt;</code>; Next.js sends <code>&lt;h1&gt;BS. Trần Thu Hà&lt;/h1&gt;</code> and a real 404 status for <code>bs-99</code>.</li>
<li>Folders are routes: <code>app/bac-si/[id]/page.tsx</code> ≈ <code>{ path: 'bac-si/:id' }</code>; <code>layout.tsx</code>, <code>error.tsx</code>, <code>loading.tsx</code>, <code>not-found.tsx</code> replace layout routes, ErrorBoundary, pending UI and 404. <code>Link</code> takes <code>href</code>.</li>
<li><code>next build</code> pre-rendered six doctor pages (<code>●</code>) from <code>generateStaticParams</code>; <code>params</code> is a Promise.</li>
<li>Server Components by default; <code>useState</code> without <code>'use client'</code> fails the build. Push interactivity to the leaves.</li>
<li>Choose per page: public, searchable pages → SSR/SSG; logged-in interactive tools → a Vite SPA is often enough.</li>
</ul>

${LINK('https://nextjs.org/docs/app/getting-started/layouts-and-pages', '📄', 'Next.js — Layouts and Pages', 'Folders as routes, page.tsx, layout.tsx and dynamic segments.')}
${LINK('https://nextjs.org/docs/app/getting-started/server-and-client-components', '📄', 'Next.js — Server and Client Components', "What runs where, and how 'use client' draws the boundary.")}
${LINK('https://react.dev/reference/rsc/server-components', '📄', 'react.dev — Server Components', 'The React feature Next.js App Router is built on.')}
${LINK('https://react.dev/learn/creating-a-react-app', '📄', 'react.dev — Creating a React App', 'Why the React team recommends a framework such as Next.js or React Router for new apps.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Từ React sang Next.js: khác gì, khi nào cần, và route của ta chuyển sang thế nào</h2>
<p class="lead">Tin tuyển dụng ghi "React", rồi hai dòng sau ghi "Next.js". Chúng không phải đối thủ: Next.js <em>chính là</em> React — cùng component, cùng hook, cùng JSX — cộng thêm một máy chủ, một router dựa trên file, và những cách render mà một SPA Vite không có. Bài này chuyển một lát của app phòng khám sang Next.js 16 để bạn thấy, bằng output thật, cái gì thực sự đổi, cái gì giữ nguyên, và khi nào bộ máy thêm vào đáng công. Khoá đầy đủ ở <a href="/courses/nextjs">/courses/nextjs</a>; bài này là cây cầu.</p>
<p>Dự án Next.js là <code>ch07-next</code> (next 16.3.6, react 19.3.0, cùng <code>du-lieu/bac-si.ts</code> và <code>types.ts</code> với app Vite). SPA để so là dự án trình duyệt của Bài 7.1, build bằng <code>vite build</code> và phục vụ bằng <code>vite preview</code>.</p>

<h3>Khác biệt đầu tiên: máy chủ gửi về cái gì</h3>
${slide('rx-07', 20, 'SPA gửi HTML rỗng — Next.js gửi HTML có sẵn nội dung')}
<p>Hỏi cả hai app trang của BS. Trần Thu Hà theo cách một con bot tìm kiếm, một bot xem trước link hay một chiếc điện thoại chậm nhìn thấy đầu tiên: HTML thô, chưa chạy dòng JavaScript nào.</p>
${out(OUT.spaCurl)}
${out(OUT.nextCurl)}
<p>HTML của SPA có <strong>0</strong> thẻ <code>&lt;h1&gt;</code>: thân trang là một <code>&lt;div id="root"&gt;</code> rỗng, và tên bác sĩ chỉ xuất hiện sau khi trình duyệt tải, đọc và chạy gói JavaScript (313 kB ở Bài 7.1) rồi React vẽ. Next.js trả lời với cái tên có sẵn trong HTML (5.604 byte cho cả trang), và trả mã 404 <em>thật</em> cho bác sĩ không tồn tại — còn SPA trả 200 cho mọi đường dẫn rồi mới vẽ trang 404 của nó.</p>
<p>Ba cái tên bạn sẽ nghe cho chuyện này:</p>
<ul>
<li><strong>CSR — client-side rendering (vẽ ở trình duyệt)</strong>: chính là SPA. HTML rỗng; trình duyệt tự dựng trang.</li>
<li><strong>SSR — server-side rendering (vẽ ở máy chủ mỗi request)</strong>: máy chủ chạy component React cho từng request và gửi HTML hoàn chỉnh; trình duyệt sau đó <em>hydrate</em> (gắn hàm xử lý sự kiện) để trang tương tác được.</li>
<li><strong>SSG — static site generation (dựng sẵn lúc build)</strong>: giống SSR, nhưng làm một lần lúc build, ra các file HTML — đúng như phần sau cho thấy.</li>
</ul>
<p>Vì sao công ty quan tâm: những trang người ta tìm qua công cụ tìm kiếm hay chia sẻ trên mạng xã hội (hồ sơ bác sĩ của phòng khám, trang sản phẩm, blog) cần nội dung nằm sẵn trong HTML; điện thoại mạng yếu thấy chữ trước khi JavaScript về tới. Những trang sau đăng nhập (bảng điều khiển, "lịch hẹn của tôi") phần lớn không cần — chẳng ai tìm kiếm chúng.</p>

<h3>Route của ta, dưới dạng thư mục</h3>
${slide('rx-07', 21, 'Route của React Router ↔ thư mục app/ của Next.js')}
<p>Next.js không có bảng route. Trong App Router của nó, <strong>cấu trúc thư mục dưới <code>app/</code> chính là bảng route</strong>: mỗi thư mục là một đoạn URL, có <code>page.tsx</code> bên trong thì nó thành một trang, và những tên file đặc biệt đóng vai mà Bài 7.2 giao cho các field của route. Các route của phòng khám, dịch sang:</p>
<table>
<thead><tr><th>React Router (chương này)</th><th>Next.js App Router</th></tr></thead>
<tbody>
<tr><td><code>{ index: true, Component: TrangChu }</code> ở <code>/</code></td><td><code>app/page.tsx</code></td></tr>
<tr><td><code>{ path: 'bac-si', Component: … }</code></td><td><code>app/bac-si/page.tsx</code></td></tr>
<tr><td><code>{ path: 'bac-si/:id' }</code> + <code>useParams()</code></td><td><code>app/bac-si/[id]/page.tsx</code> + prop <code>params</code></td></tr>
<tr><td>layout route có <code>&lt;Outlet /&gt;</code></td><td><code>layout.tsx</code> có <code>{children}</code> (mỗi thư mục một cái, tự lồng nhau)</td></tr>
<tr><td><code>ErrorBoundary</code> của route</td><td><code>error.tsx</code> (một Client Component)</td></tr>
<tr><td><code>HydrateFallback</code> / giao diện đang chờ</td><td><code>loading.tsx</code> (một ranh giới Suspense cho đoạn đó)</td></tr>
<tr><td><code>{ path: '*' }</code> / <code>throw data(…, { status: 404 })</code></td><td><code>not-found.tsx</code> / <code>notFound()</code></td></tr>
<tr><td>layout route gác cổng / <code>middleware</code></td><td>kiểm trong layout hay page ở máy chủ, hoặc <code>proxy.ts</code> (Next 16 đổi tên <code>middleware.ts</code> thành <code>proxy.ts</code>)</td></tr>
<tr><td><code>&lt;Link to="/bac-si"&gt;</code> (từ <code>react-router</code>)</td><td><code>&lt;Link href="/bac-si"&gt;</code> (từ <code>next/link</code>) — để ý là <code>href</code>, không phải <code>to</code></td></tr>
<tr><td><code>useNavigate()</code></td><td><code>useRouter()</code> từ <code>next/navigation</code> → <code>router.push()</code> / <code>router.replace()</code></td></tr>
<tr><td><code>useSearchParams()</code></td><td><code>useSearchParams()</code> từ <code>next/navigation</code> (chỉ đọc), hoặc prop <code>searchParams</code></td></tr>
</tbody>
</table>
<p>Layout gốc đóng vai <code>KhungChinh</code>. Để ý nó tự vẽ <code>&lt;html&gt;</code> và <code>&lt;body&gt;</code> — app Next.js không có <code>index.html</code>:</p>
${pre('tsx', SN.nextLayout)}
<p>Trang danh sách gần như y component bên Vite, chỉ đổi <code>to</code> thành <code>href</code>:</p>
${pre('tsx', SN.nextDanhSach)}

<h3><code>next build</code> dựng sẵn sáu trang bác sĩ</h3>
${slide('rx-07', 22, 'next build dựng sẵn sáu trang bác sĩ')}
<p>Trang chi tiết là chỗ mô hình khác nhiều nhất:</p>
${pre('tsx', SN.nextChiTiet)}
<div class="callout"><p><strong>JS nhắc nhanh — <code>async</code> / <code>await</code>.</strong> Hàm đánh dấu <code>async</code> luôn trả về một Promise (một "giá trị tới sau"). Bên trong nó, <code>await x</code> tạm dừng chính hàm đó tới khi Promise xong và đưa bạn giá trị của nó — không chặn việc gì khác. Từ Next.js 15, <code>params</code> là một Promise, nên component trang là <code>async</code> và viết <code>const { id } = await params;</code>. Server Component được phép async; component trong một SPA Vite thì không.</p></div>
<ul>
<li><strong>Component đọc dữ liệu trực tiếp</strong> — <code>danhSachBacSi.find(…)</code>, không <code>useQuery</code>, không <code>useEffect</code>, không trạng thái đang tải. Nó chạy ở máy chủ (ở đây là lúc build), nơi có dữ liệu. Với một cơ sở dữ liệu thật, nó sẽ <code>await db.bacSi.findUnique(…)</code> ngay tại chỗ.</li>
<li><code>generateStaticParams</code> liệt kê những <code>id</code> cần dựng sẵn. <code>notFound()</code> là <code>throw data(…, { status: 404 })</code> của Bài 7.2.</li>
</ul>
${out(OUT.nextBuild)}
<p>Chú giải ở cuối mới là điểm chính: trang <code>○</code> là tĩnh, trang <code>●</code> được sinh từ <code>generateStaticParams</code> — sáu file HTML, mỗi bác sĩ một file, tạo ra lúc build. CDN phục vụ chúng như phục vụ ảnh. Bản build Vite, để so, ra đúng một <code>index.html</code> cho mọi URL.</p>

<h3>Mặc định là Server Component, <code>'use client'</code> khi cần tương tác</h3>
${slide('rx-07', 23, "Server Component mặc định, 'use client' khi cần tương tác")}
<p>Mọi thứ trong <code>app/</code> là <strong>Server Component</strong> trừ khi bạn nói khác: nó chạy ở máy chủ, mã của nó <em>không</em> được gửi xuống trình duyệt, và nó không dùng được state, effect hay hàm xử lý sự kiện — vì chỗ nó chạy làm gì có trình duyệt. Thứ gì tương tác thì đưa vào một file mở đầu bằng <code>'use client'</code>:</p>
${pre('tsx', SN.nextNut)}
<p>Trang vẫn là Server Component và chỉ việc vẽ <code>&lt;NutYeuThich /&gt;</code>; Next.js chỉ gửi mã của cái nút xuống trình duyệt. Chuyện gì xảy ra khi bạn quên — chẳng hạn chép nguyên một component từ app Vite sang:</p>
${out(OUT.nextLoi)}
<div class="pitfall co-tieu-de"><strong>Bẫy — chép component Vite sang mà quên rằng nó từng chạy trong trình duyệt.</strong> Component nào của app trong khoá này cũng dùng ít nhất một trong: <code>useState</code>, <code>useEffect</code>, <code>onClick</code>, hook TanStack Query, store Zustand, <code>localStorage</code> hay <code>window</code>. Ở Next.js, mỗi thứ đó phải nằm dưới một ranh giới <code>'use client'</code>, không thì build hỏng như trên (hook) hoặc sập ở máy chủ (<code>window is not defined</code>). Cách chữa không phải là gắn <code>'use client'</code> lên mọi file — làm vậy là vứt đi thứ Next.js cho bạn — mà là đẩy phần tương tác xuống lá: trang và danh sách ở lại máy chủ, nút trái tim, chip lọc và form đặt lịch thành client component.</div>
<p>Với app phòng khám, cách chia đại khái là: danh sách bác sĩ, hồ sơ bác sĩ, trang chuyên khoa → Server Component (dựng sẵn, tốt cho SEO); chip lọc + ô tìm, bộ chọn giờ khám, form đặt lịch (React Hook Form), "lịch hẹn của tôi" có nút huỷ → Client Component; TanStack Query ở lại cho các phần client lấy dữ liệu sau khi người dùng tương tác.</p>

<h3>Khi nào cần Next.js — và khi nào một SPA Vite là đủ</h3>
${slide('rx-07', 24, 'Khi nào cần Next.js — khi nào Vite SPA là đủ')}
<table>
<thead><tr><th>Câu hỏi</th><th>Vite SPA + React Router là ổn</th><th>Nên dùng Next.js (hoặc React Router Framework Mode)</th></tr></thead>
<tbody>
<tr><td>Trang có cần được tìm thấy / xem trước khi chia sẻ?</td><td>Không — công cụ quản trị, bảng điều khiển, app sau đăng nhập</td><td>Có — trang sản phẩm, hồ sơ, blog, trang giới thiệu</td></tr>
<tr><td>Deploy ở đâu?</td><td>Host tĩnh / CDN bất kỳ (chỉ là file)</td><td>Một máy chủ Node hoặc nền tảng chạy nó (có static export nhưng mất các tính năng máy chủ)</td></tr>
<tr><td>Ai giữ backend?</td><td>Một đội API riêng (Spring, .NET, Node) — frontend chỉ việc gọi</td><td>Đội frontend muốn có mã máy chủ sát giao diện (route handler, server action)</td></tr>
<tr><td>Lần vẽ đầu trên điện thoại yếu có quan trọng?</td><td>Ít — người dùng mở một lần rồi ở lại</td><td>Nhiều — lần ghé nào cũng là lần ghé "lạnh"</td></tr>
<tr><td>Kinh nghiệm của nhóm</td><td>React thuần là đủ</td><td>Nhóm phải học ranh giới máy chủ/trình duyệt, cache và cách deploy mới</td></tr>
</tbody>
</table>
<p><strong>Framework Mode</strong> của React Router (mode thứ ba ở Bài 7.1) là con đường ở giữa: giữ React Router, thêm plugin Vite của nó, là có SSR/SSG và route module — không phải viết lại route thành thư mục. Next.js là yêu cầu phổ biến hơn trong tin tuyển dụng ở Việt Nam; Framework Mode thì dễ áp vào một app React Router đang có. ⏳ Chưa chạy thật: bài này không dựng dự án Framework Mode. <!-- CHAY-O-MAY: npx create-react-router@latest, chuyển 3 route bac-si sang routes.ts + route module, so sánh curl HTML với bản Next.js ở trên --></p>
<p>App phòng khám của khoá này cố ý giữ là SPA Vite: luồng đặt lịch nhiều tương tác, "lịch hẹn của tôi" nằm sau đăng nhập, và học React khi không có máy chủ chen vào thì đơn giản hơn. Một phòng khám thật có lẽ sẽ đặt các trang bác sĩ công khai lên Next.js — chính là dự án ở <a href="/courses/nextjs">/courses/nextjs</a>.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>FER202 dựng mọi dự án thành một SPA vẽ ở trình duyệt (Create React App ở các slide cũ), còn SEO, lần tải đầu và máy chủ đơn giản là không nằm trong syllabus; "nhiều trang" nghĩa là React Router, hết. → Đi làm, câu hỏi kiến trúc đầu tiên là <em>trang nào cần render ở máy chủ</em>: trang công khai, cần được tìm thấy thì sang Next.js (hoặc một framework SSR khác) với Server Component làm mặc định; công cụ sau đăng nhập, nhiều tương tác thì thường vẫn là một SPA Vite như app của khoá này, phục vụ từ CDN và gọi một API riêng. · <em>Vì sao:</em> một cái vỏ HTML rỗng là vô hình với mọi thứ không chạy JavaScript và chậm trên điện thoại yếu, còn máy chủ thì thêm chi phí, thêm phức tạp khi deploy và thêm một loại bug mới (ranh giới máy chủ/trình duyệt). Không bên nào là "cách hiện đại" — chọn theo từng trang mới là. SPA bạn học ở FER202 chính là thứ nhiều công cụ nội bộ của công ty vẫn đang là, và mọi thứ bạn học trong khoá này (component, hook, state, TanStack Query, form) mang thẳng sang Next.js được.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "CSR, SSR và SSG khác nhau thế nào, và khi nào dùng cái nào?"</p>
<p>CSR: máy chủ gửi một cái vỏ rỗng, JavaScript dựng trang trong trình duyệt — host đơn giản, hợp cho app sau đăng nhập, nhưng HTML ban đầu không có nội dung. SSR: máy chủ vẽ HTML cho từng request, rồi trình duyệt hydrate — dữ liệu mới, tốt cho SEO, cần một máy chủ đang chạy. SSG: HTML vẽ một lần lúc build và phục vụ như file tĩnh — nhanh nhất, rẻ nhất, hợp cho nội dung ít đổi (hồ sơ bác sĩ), có thể kết hợp làm mới định kỳ. Ở Next.js App Router, Server Component mặc định render ở máy chủ và <code>'use client'</code> đánh dấu phần tương tác. Em sẽ chọn theo trang: SSG/SSR cho trang công khai, CSR cho bảng điều khiển sau đăng nhập.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> thêm trang chuyên khoa dựng sẵn vào dự án Next.js.</p><ol>
<li>Tạo <code>app/chuyen-khoa/[ma]/page.tsx</code>: <code>generateStaticParams</code> trả về bốn khoá của <code>TEN_CHUYEN_KHOA</code>; trang (async, <code>await params</code>) gọi <code>notFound()</code> với khoá lạ, ngược lại vẽ một <code>h1</code> tên chuyên khoa và danh sách <code>Link</code> (<code>next/link</code>) tới từng bác sĩ của chuyên khoa đó.</li>
<li>Thêm một component <code>'use client'</code> tên <code>BoDemLuotXem</code> có nút đếm số lần bấm, và vẽ nó trên trang chuyên khoa.</li>
<li>Chạy <code>npx next build</code>, rồi <code>npx next start -p 5175</code> và <code>curl -s localhost:5175/chuyen-khoa/nhi | grep -o "BS\\. [^<]*"</code>.</li>
</ol><p><strong>Đạt khi:</strong> output build liệt kê <code>/chuyen-khoa/[ma]</code> với các đường dẫn <code>●</code>, lệnh curl in ra "BS. Trần Thu Hà" và "BS. Vũ Thảo Vy" từ HTML thô, <code>/chuyen-khoa/tim-mach</code> trả mã 404, và bỏ <code>'use client'</code> khỏi bộ đếm thì build hỏng đúng lỗi trong bài.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">CSR</span><span class="v">vẽ ở trình duyệt: HTML rỗng, trình duyệt dựng trang bằng JavaScript</span></div>
<div class="kv"><span class="k">SSR</span><span class="v">vẽ ở máy chủ: HTML được render trên máy chủ cho từng request</span></div>
<div class="kv"><span class="k">SSG</span><span class="v">dựng sẵn: HTML render một lần lúc build</span></div>
<div class="kv"><span class="k">hydration (hydrate)</span><span class="v">React gắn hàm xử lý sự kiện vào HTML do máy chủ vẽ, ngay trong trình duyệt</span></div>
<div class="kv"><span class="k">App Router</span><span class="v">cách định tuyến của Next.js: thư mục dưới <code>app/</code> là đoạn URL, <code>page.tsx</code> là một trang</span></div>
<div class="kv"><span class="k">Server Component</span><span class="v">chỉ chạy ở máy chủ; mã không gửi xuống trình duyệt; không có state hay sự kiện</span></div>
<div class="kv"><span class="k"><code>'use client'</code></span><span class="v">đánh dấu một file (và những gì nó import) là mã client, dùng được hook và sự kiện</span></div>
<div class="kv"><span class="k"><code>generateStaticParams</code></span><span class="v">báo Next.js những đường dẫn động nào cần dựng sẵn lúc build</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Next.js là React cộng một máy chủ: cùng component và hook, khác cách định tuyến và cách render.</li>
<li>Đo thật: HTML của SPA cho <code>/bac-si/bs-2</code> có 0 thẻ <code>&lt;h1&gt;</code>; Next.js gửi <code>&lt;h1&gt;BS. Trần Thu Hà&lt;/h1&gt;</code> và mã 404 thật cho <code>bs-99</code>.</li>
<li>Thư mục là route: <code>app/bac-si/[id]/page.tsx</code> ≈ <code>{ path: 'bac-si/:id' }</code>; <code>layout.tsx</code>, <code>error.tsx</code>, <code>loading.tsx</code>, <code>not-found.tsx</code> thay cho layout route, ErrorBoundary, giao diện chờ và 404. <code>Link</code> nhận <code>href</code>.</li>
<li><code>next build</code> dựng sẵn sáu trang bác sĩ (<code>●</code>) từ <code>generateStaticParams</code>; <code>params</code> là một Promise.</li>
<li>Mặc định là Server Component; <code>useState</code> mà thiếu <code>'use client'</code> là build hỏng. Đẩy phần tương tác xuống lá.</li>
<li>Chọn theo từng trang: trang công khai, cần tìm thấy → SSR/SSG; công cụ sau đăng nhập, nhiều tương tác → SPA Vite thường là đủ.</li>
</ul>

${LINK('https://nextjs.org/docs/app/getting-started/layouts-and-pages', '📄', 'Next.js — Layouts and Pages', 'Thư mục là route, page.tsx, layout.tsx và đoạn động.')}
${LINK('https://nextjs.org/docs/app/getting-started/server-and-client-components', '📄', 'Next.js — Server and Client Components', "Cái gì chạy ở đâu, và 'use client' vạch ranh giới thế nào.")}
${LINK('https://react.dev/reference/rsc/server-components', '📄', 'react.dev — Server Components', 'Tính năng của React mà App Router của Next.js dựng lên trên.')}
${LINK('https://react.dev/learn/creating-a-react-app', '📄', 'react.dev — Creating a React App', 'Vì sao nhóm React khuyên dùng một framework như Next.js hay React Router cho app mới.')}
</div>
`,
    },

    /* ─────────────────────────── 7.5 ─────────────────────────── */
    {
      title: '7.5 — Build it: seven routes, one layout, a login gate and feature folders|||7.5 — Tự dựng: bảy route, một layout, cổng đăng nhập và thư mục theo tính năng',
      slug: 'rx-7-5-du-an',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bài 🛠 của chương: từ dự án sau Chương 6, dựng bảy route dưới một layout (danh sách, hồ sơ + chọn giờ, đặt lịch, lịch hẹn, đăng nhập, 404), đặt lịch hoàn toàn theo URL, cổng đăng nhập có đường quay về, dời mã sang features/ + shared/ với lint giữ ranh giới — kế hoạch, từng bước, 11 test tiêu chí đạt, ảnh chụp Chromium thật và lời giải đầy đủ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5 · 🛠 Project</span>
<h2>Build it: seven routes, one layout, a login gate and feature folders</h2>
<p class="lead">Time to turn the one long page into an app with addresses. By the end of this lesson every screen of the clinic has its own URL, the booking flow survives F5 and a shared link at every step, "My appointments" asks for a login and brings you back afterwards, and the code lives in feature folders that a linter keeps apart. You type it; the tests below tell you when you are done.</p>

<h3>What you will build</h3>
${slide('rx-07', 25, 'Dự án sau Chương 7: bảy trang dưới một layout')}
<table>
<thead><tr><th>URL</th><th>Page</th><th>Login</th></tr></thead>
<tbody>
<tr><td><code>/</code></td><td>home: opening hours (Chapter 4's <code>TrangThaiMoCua</code>) and a link to the doctors</td><td></td></tr>
<tr><td><code>/bac-si</code></td><td>doctor list, filters and search on the URL (<code>?ck=&amp;q=</code>), favourites</td><td></td></tr>
<tr><td><code>/bac-si/:id</code></td><td>doctor profile + time picker; the day is on the URL (<code>?ngay=</code>); unknown id ⇒ "Không có bác sĩ này"</td><td></td></tr>
<tr><td><code>/dat-lich/:khungGioId?bacSi=&amp;ngay=</code></td><td>patient form (Chapter 3), then <code>POST /api/lich-hen</code> (Chapter 6)</td><td>🔒</td></tr>
<tr><td><code>/lich-hen</code></td><td>my appointments, with cancel (Chapter 6)</td><td>🔒</td></tr>
<tr><td><code>/dang-nhap</code></td><td>simulated login (name + phone; the real one is Chapter 14)</td><td></td></tr>
<tr><td><code>*</code></td><td>404 inside the layout</td><td></td></tr>
</tbody>
</table>
<p><strong>Starting point: the project after Chapter 6</strong> — in particular <code>src/api/</code> (<code>http.ts</code>, <code>khoa.ts</code>, <code>phong-kham.ts</code>), the hooks <code>useBacSi</code>, <code>useKhungGio</code>, <code>useDatLich</code>, <code>useLichHen</code>/<code>useHuyLichHen</code>, <code>src/mocks/</code> (MSW), <code>FormDatLich</code> + <code>schema/dat-lich.ts</code>, <code>KhuBacSi</code>, <code>LichHenCuaToi</code>, <code>useBoLocUrl</code> + <code>logic/bo-loc-url.ts</code>, <code>store/dat-lich-store.ts</code> and <code>src/test/render.tsx</code>. Measured on that starting point: 21 test files, 81 tests, all green. <code>react-router</code> 8.4.0 is already in <code>package.json</code> of the course template; if yours lacks it: <code>npm install react-router</code> — <strong>not</strong> <code>react-router-dom</code> (Lesson 7.1).</p>

<h3>Plan before typing</h3>
${slide('rx-07', 26, 'Đặt lịch đi theo URL: chọn giờ → đăng nhập → form → lịch hẹn')}
<p>Three decisions, made on paper first:</p>
<ol>
<li><strong>Where does each piece of state live now?</strong> Chapter 5 kept the booking steps in a reducer. With routes, the steps <em>are</em> URLs: the doctor is <code>:id</code>, the day is <code>?ngay=</code>, the slot is <code>:khungGioId</code>. Everything the booking page needs is in its address, so F5, Back and "send this link to my mother" all work. The reducer and its <code>LuongDatLich</code> component are deleted (with their 13 tests). What stays out of the URL: favourites (Zustand, personal), server data (TanStack Query), "just booked lh-1" (<code>location.state</code> — nice to show once, not needed to work).</li>
<li><strong>Which pages need a login?</strong> "My appointments", obviously. And the booking form: an appointment belongs to someone. Putting <code>/dat-lich</code> behind the gate has a second benefit measured below — the "just booked" message survives.</li>
<li><strong>Which folder does each file go to?</strong> Lesson 7.3's four questions. The one real design change: <code>DanhSachLichHen</code> (was <code>LichHenCuaToi</code>) receives <code>tenBacSi</code> as a prop instead of calling the doctor feature.</li>
</ol>
${out(OUT.chup)}
<p>That is the whole flow driven in a real Chromium (<code>vite preview</code>): clicking 14:00 while logged out lands on <code>/dang-nhap</code>; logging in returns to the <em>exact</em> booking URL including <code>?bacSi=bs-2&amp;ngay=2026-10-01</code>; after sending, <strong>one</strong> Back goes to the doctor page — the login page and the sent form were replaced, not stacked. F5 on <code>/bac-si/bs-4?ngay=2026-10-02</code> keeps 02/10 selected.</p>

<h3>🛠 Keep building the project</h3>
${slide('rx-07', 29, 'Tự gõ tiếp dự án: route, layout, cổng và thư mục theo tính năng')}
<div class="callout ok"><p><strong>Starting point:</strong> the project after Chapter 6 (files listed above). Do the steps in order; run <code>npx tsc -b</code> after each one.</p><ol>
<li><strong>Move to feature folders</strong> (Lesson 7.3): create <code>app/</code>, <code>pages/</code>, <code>features/{bac-si,dat-lich,lich-hen,dang-nhap}/</code>, <code>shared/{api,ui,hooks,logic,store}/</code>; move the files; add <code>"paths": { "@/*": ["./src/*"] }</code> to <code>tsconfig.app.json</code> and <code>resolve: { tsconfigPaths: true }</code> to <code>vite.config.ts</code>; fix imports until <code>tsc</code> is silent. Delete <code>LuongDatLich</code>, <code>luong-dat-lich.ts</code>, <code>App.tsx</code> and their tests.</li>
<li><strong><code>shared/duong-dan.ts</code></strong>: every URL of the app as a constant or a function.</li>
<li><strong><code>features/dang-nhap/</code></strong>: <code>useDangNhapStore</code> (Zustand + <code>persist</code>, key <code>phong-kham-dang-nhap</code>), <code>FormDangNhap</code> (name ≥ 2 characters, 10-digit phone), <code>YeuCauDangNhap</code> (guard layout: <code>&lt;Navigate replace state={{ tu }}&gt;</code> with <code>pathname + search + hash</code>), <code>index.ts</code>.</li>
<li><strong>Doctor feature</strong>: <code>TheBacSi</code> gets <code>coLienKet</code> — "Xem chi tiết" becomes a <code>Link</code> to <code>/bac-si/:id</code>; <code>useBoLocUrl</code> keeps its signature but uses <code>useSearchParams</code>; new <code>useChiTietBacSi(id)</code> (<code>GET /api/bac-si/:id</code>); <code>KhuBacSi</code> loses the side panel; <code>index.ts</code>.</li>
<li><strong>Booking feature</strong>: <code>ChonKhungGio</code> (day chips write <code>?ngay=</code> with <code>replace</code>; free slots are <code>Link</code>s to <code>duongDan.datLich(...)</code>; taken ones are not links), <code>doc-ngay.ts</code>, <code>index.ts</code> (also exports <code>datLichSchema</code> for <code>src/mocks/handlers.ts</code>).</li>
<li><strong>Appointments feature</strong>: <code>DanhSachLichHen({ tenBacSi })</code>; <code>useLichHen({ batDau })</code> so the header does not call the API for a logged-out visitor.</li>
<li><strong>Pages</strong>: <code>TrangChu</code>, <code>TrangDanhSachBacSi</code>, <code>TrangChiTietBacSi</code> (404 from the API ⇒ "Không có bác sĩ này"), <code>TrangDatLich</code> (everything from the URL; after <code>mutateAsync</code> → <code>navigate('/lich-hen', { replace: true, state: { vuaDat } })</code>), <code>TrangLichHen</code>, <code>TrangDangNhap</code>, <code>Trang404</code>. Each sets its tab title with Chapter 4's <code>useTieuDeTrang</code>.</li>
<li><strong><code>app/</code></strong>: <code>router.tsx</code> (the table), <code>KhungTrang</code> (<code>Header</code> + <code>&lt;Outlet /&gt;</code> inside <code>RanhGioiLoi</code> + <code>Footer</code> + <code>VungThongBao</code> + <code>ScrollRestoration</code>), <code>Header</code> (<code>NavLink</code>s, count badge, log out), <code>TrangLoi</code> (root <code>ErrorBoundary</code>); <code>main.tsx</code> creates the router once. Tests: <code>renderVoiRouter</code> and <code>veTrang</code> in <code>test/render.tsx</code>, reset the login store in <code>test/setup.ts</code>, update the old tests that now contain links.</li>
<li><strong>Lint</strong>: copy Lesson 7.3's <code>.oxlintrc.json</code>; <code>npx oxlint src</code> must report 0 errors.</li>
</ol>
<p><strong>Done when</strong> — copy this file to <code>src/app/router.test.tsx</code>, unchanged:</p></div>
${pre('tsx', SN.fRouterTest)}
${out(OUT.routerTests)}
${out(OUT.duAnTong)}
<p>…and <code>npx oxlint src</code> exits 0, and in <code>npm run dev</code> your screens look like the screenshots on slides 25 and 26. The main bundle grew from 391.80 kB to 491.08 kB (+99.28 kB, +31.77 kB gzip) — that is the router; Chapter 8 splits it per route with lazy loading.</p>
${out(OUT.buildSoSanh)}

<details><summary>Solution</summary>
<p>Run on the chapter's project on 25/09/2026: <code>npx tsc -b</code> prints nothing, <code>npx vitest run</code> gives 19 test files / 80 tests passed, <code>npx vite build</code> finishes in 709 ms, <code>npx oxlint src</code> exits 0. Files that only moved and changed imports (<code>FormDatLich</code>, <code>schema.ts</code>, <code>useKhungGio</code>, <code>useDatLich</code>, the logic files, the Chapter 6 API files, <code>LoiTaiDuLieu</code>, <code>KhungXuong</code>, …) are not repeated. Configuration (<code>tsconfig.app.json</code>, <code>vite.config.ts</code>, <code>.oxlintrc.json</code>) and <code>shared/duong-dan.ts</code> are exactly as in Lesson 7.3. <code>Trang404</code> is Lesson 7.2's <code>TrangKhongThay</code> reading <code>useLocation().pathname</code>; styling (the <code>.menu</code>, <code>.chon-gio</code> and <code>a.nut</code> classes in <code>app/app.css</code>) is up to you — the tests do not check it.</p>
<p><strong>app/router.tsx</strong></p>
${pre('tsx', SN.routerTsx)}
<p><strong>main.tsx</strong></p>
${pre('tsx', SN.mainTsx)}
<p><strong>app/KhungTrang.tsx</strong> (<code>TrangLoi</code> is Lesson 7.2's <code>LoiChiTiet</code> with a link home)</p>
${pre('tsx', SN.khungTrang)}
<p><strong>app/Header.tsx</strong></p>
${pre('tsx', SN.fHeader)}
<p><strong>features/dang-nhap/</strong> — store, form, guard, door</p>
${pre('ts', SN.fDangNhapStore)}
${pre('tsx', SN.fFormDangNhap)}
${pre('tsx', SN.yeuCauDangNhap)}
${pre('ts', SN.fIndexDangNhap)}
<p><strong>features/bac-si/</strong> — the card's link, the URL filter on the router, one doctor by id</p>
${pre('tsx', SN.fTheBacSi)}
${pre('ts', SN.useBoLocUrl)}
${pre('ts', SN.fUseChiTiet)}
${pre('ts', SN.indexBacSi)}
<p><strong>features/dat-lich/</strong> — time picker and the day on the URL</p>
${pre('tsx', SN.chonKhungGio)}
${pre('ts', SN.docNgay)}
${pre('ts', SN.indexDatLich)}
<p><strong>features/lich-hen/</strong> — <code>DanhSachLichHen</code> is <code>LichHenCuaToi</code> with the <code>tenBacSi</code> prop; the hook gains <code>batDau</code></p>
${pre('ts', SN.fUseLichHen)}
${pre('ts', SN.fIndexLichHen)}
<p><strong>pages/</strong></p>
${pre('tsx', SN.trangChiTiet)}
${pre('tsx', SN.trangDatLich)}
${pre('tsx', SN.trangLichHen)}
${pre('tsx', SN.trangDangNhap)}
<p><strong>shared/api/phong-kham.ts</strong> — the request type no longer comes from a feature</p>
${pre('ts', SN.fPhongKham)}
<p><strong>test/render.tsx</strong> — two new helpers (and one new line in <code>test/setup.ts</code>: <code>${H(SN.setupDong)}</code>)</p>
${pre('tsx', SN.fRender)}
</details>

<h3>Mistakes, one last time</h3>
<p><strong>Logging out in the wrong order.</strong> The first version of the header's button did the obvious thing:</p>
${pre('tsx', SN.headerSai)}
${out(OUT.dangXuatSai)}
<p>The test expected <code>/</code> and got <code>/dang-nhap</code>. <code>dangXuat()</code> changes the store <em>synchronously</em>; the guard of <code>/lich-hen</code>, still on screen, re-renders, sees "not logged in" and renders <code>&lt;Navigate to="/dang-nhap"&gt;</code> — and that navigation wins over ours. The fix: leave first, forget the user second. Since React Router 7, <code>navigate()</code> returns a Promise you can <code>await</code>:</p>
${pre('tsx', SN.headerDangXuat)}
<p><strong>Losing <code>location.state</code> at the gate.</strong> In the first run of the screenshot script, <code>/dat-lich</code> was still outside the gate and the visitor was logged out: the booking was saved, <code>navigate('/lich-hen', { state: { vuaDat } })</code> ran — and the guard of <code>/lich-hen</code> immediately replaced that entry with <code>/dang-nhap</code> and a <em>new</em> state (<code>{ tu }</code>). After logging in, the list showed the appointment but the "Mã lịch hẹn" message was gone. <code>location.state</code> belongs to one history entry; any redirect in between drops it. Putting <code>/dat-lich</code> behind the gate (so the visitor logs in <em>before</em> booking) fixed it — the final screenshot on slide 26 shows the message.</p>
<p><strong>Forgetting that tests render components outside a router.</strong> The moment <code>TheBacSi</code> contains a <code>Link</code>, every test that renders it with plain <code>render()</code> fails, because a <code>Link</code> needs a router above it. That is why <code>renderVoiRouter</code> exists; old tests switch to it, and they gain the ability to check <code>href</code>, <code>router.state.location</code> and <code>historyAction</code>.</p>
<div class="pitfall co-tieu-de"><strong>Trap — trusting the URL in the booking page.</strong> <code>/dat-lich/…?bacSi=bs-2&amp;ngay=2026-10-01</code> is typed by users and shared by users. <code>TrangDatLich</code> therefore validates everything it reads: the day goes through <code>docNgay</code> (unknown ⇒ first clinic day), the doctor and slot are looked up in the data (missing ⇒ "Không tìm thấy khung giờ này"), and a slot that is already taken shows "đã có người đặt" with a link back — the test "mở thẳng link … khung ĐÃ KÍN" pins it. The server (MSW here) checks again, as it must.</div>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>A FER202 booking or shopping flow often keeps the chosen item and step in component state or Redux, redirects with <code>window.location.href</code> after submitting, and checks login in each page's <code>useEffect</code>. → At work the flow is addressed by URLs (<code>/doctors/:id</code> → <code>/book/:slotId?…</code> → <code>/appointments</code>), each step readable from its URL, redirects use <code>replace</code>, one guard protects a group of routes and returns the user to where they were, and the whole flow is covered by tests that drive the real route table in memory. · <em>Why:</em> users press F5, Back, open links in new tabs and send them to others; support staff reproduce bugs from a URL; and a flow tested end-to-end through routes catches the ordering bugs (like logout above) that component tests miss. The Redux-held flow still works while the tab stays open — which is exactly the condition users break first.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "Walk me through adding routing to an existing React app."</p>
<p>Install the router, create the route table once outside the tree, and introduce a root layout route with an <code>Outlet</code> so the header and footer render once. Turn each screen into a route and each in-app link into <code>Link</code>/<code>NavLink</code>; move state that should survive F5 and be shareable (ids, filters, steps) onto the URL, validating what you read. Add an error boundary at the root and a 404 route inside the layout, guard private routes with a layout route or middleware using <code>replace</code> and a return path, configure the host's SPA fallback, and update tests to render inside a memory router — then add route-level tests for the main flows.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> give each appointment its own protected page.</p><ol>
<li>Add <code>duongDan.chiTietLichHen(id)</code> and a route <code>lich-hen/:id</code> <em>inside</em> the gate, rendered by a new <code>pages/TrangChiTietLichHen.tsx</code>: it reads <code>:id</code>, finds the appointment in <code>useLichHen()</code>'s data, shows doctor, time, patient, reason and status, or "Không có lịch hẹn này" for an unknown id.</li>
<li>In <code>DanhSachLichHen</code>, make the doctor's name a <code>Link</code> to that page.</li>
<li>Add two tests to <code>router.test.tsx</code>: logged out, <code>/lich-hen/lh-1</code> ends on the login page and returns to <code>/lich-hen/lh-1</code> after logging in; logged in with one appointment in the fake database, <code>/lich-hen/lh-1</code> shows its reason and <code>/lich-hen/lh-99</code> shows "Không có lịch hẹn này".</li>
</ol><p><strong>Done when:</strong> <code>npx vitest run src/app/router.test.tsx</code> shows 13 passing tests, the whole suite stays green, and <code>npx oxlint src</code> still reports 0 errors (the new page imports features only through their <code>index.ts</code>).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">URL-driven flow</span><span class="v">a multi-step flow whose steps and choices live in the URL</span></div>
<div class="kv"><span class="k">route table</span><span class="v"><code>app/router.tsx</code>: one array, used by <code>createBrowserRouter</code> and by tests</span></div>
<div class="kv"><span class="k">guard layout route</span><span class="v"><code>YeuCauDangNhap</code>: pathless route that redirects or renders <code>&lt;Outlet /&gt;</code></span></div>
<div class="kv"><span class="k">return path</span><span class="v">the <code>tu</code> location carried to the login page so the user comes back</span></div>
<div class="kv"><span class="k"><code>location.state</code></span><span class="v">data attached to one history entry; lost when a redirect replaces it</span></div>
<div class="kv"><span class="k"><code>ScrollRestoration</code></span><span class="v">scrolls to top on new pages, restores position on Back</span></div>
<div class="kv"><span class="k">memory router test</span><span class="v">rendering the real routes with <code>createMemoryRouter</code> to test navigation</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Seven routes under one layout: home, list, doctor + time picker, booking, appointments, login, 404.</li>
<li>The booking flow lives in URLs (<code>:id</code>, <code>?ngay=</code>, <code>:khungGioId?bacSi=&amp;ngay=</code>): F5 and shared links work; the Chapter 5 reducer is gone.</li>
<li>The gate protects <code>/dat-lich</code> and <code>/lich-hen</code>, carries the full return path, and uses <code>replace</code>: one Back after booking returns to the doctor page (measured in Chromium).</li>
<li>Log out by navigating first, then clearing the store; otherwise the guard wins (measured: <code>/dang-nhap</code> instead of <code>/</code>).</li>
<li>Code moved to <code>app/ · pages/ · features/ · shared/</code> with <code>@/</code> and lint rules; 19 test files / 80 tests, 11 of them driving the real route table.</li>
<li>The router added 99.28 kB (31.77 kB gzip) to the bundle — Chapter 8 splits it per route.</li>
</ul>

${LINK('https://reactrouter.com/start/data/routing', '📄', 'React Router — Routing (Data Mode)', 'Layouts, index routes, dynamic segments and splats used in this project.')}
${LINK('https://reactrouter.com/start/modes', '📄', 'React Router — Picking a Mode', 'Why this project uses createBrowserRouter + RouterProvider.')}
${LINK('https://react.dev/learn/build-a-react-app-from-scratch#routing', '📄', 'react.dev — Routing in an app built from scratch', 'What a router must handle: nested routes, params, query parameters.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5 · 🛠 Dự án</span>
<h2>Tự dựng: bảy route, một layout, cổng đăng nhập và thư mục theo tính năng</h2>
<p class="lead">Tới lúc biến cái trang dài thành một app có địa chỉ. Hết bài này, mọi màn hình của phòng khám có URL riêng, luồng đặt lịch sống qua F5 và qua link chia sẻ ở mọi bước, "Lịch hẹn của tôi" đòi đăng nhập rồi đưa bạn về đúng chỗ, và mã nằm trong thư mục theo tính năng được linter giữ tách bạch. Bạn tự gõ; các test bên dưới cho biết khi nào xong.</p>

<h3>Thứ bạn sẽ dựng</h3>
${slide('rx-07', 25, 'Dự án sau Chương 7: bảy trang dưới một layout')}
<table>
<thead><tr><th>URL</th><th>Trang</th><th>Đăng nhập</th></tr></thead>
<tbody>
<tr><td><code>/</code></td><td>trang chủ: giờ mở cửa (<code>TrangThaiMoCua</code> của Chương 4) và link sang danh sách bác sĩ</td><td></td></tr>
<tr><td><code>/bac-si</code></td><td>danh sách bác sĩ, lọc và tìm trên URL (<code>?ck=&amp;q=</code>), yêu thích</td><td></td></tr>
<tr><td><code>/bac-si/:id</code></td><td>hồ sơ bác sĩ + bộ chọn giờ; ngày nằm trên URL (<code>?ngay=</code>); id lạ ⇒ "Không có bác sĩ này"</td><td></td></tr>
<tr><td><code>/dat-lich/:khungGioId?bacSi=&amp;ngay=</code></td><td>form bệnh nhân (Chương 3), rồi <code>POST /api/lich-hen</code> (Chương 6)</td><td>🔒</td></tr>
<tr><td><code>/lich-hen</code></td><td>lịch hẹn của tôi, có huỷ (Chương 6)</td><td>🔒</td></tr>
<tr><td><code>/dang-nhap</code></td><td>đăng nhập giả lập (họ tên + SĐT; đăng nhập thật ở Chương 14)</td><td></td></tr>
<tr><td><code>*</code></td><td>404 nằm trong layout</td><td></td></tr>
</tbody>
</table>
<p><strong>Điểm xuất phát: dự án sau Chương 6</strong> — cụ thể là <code>src/api/</code> (<code>http.ts</code>, <code>khoa.ts</code>, <code>phong-kham.ts</code>), các hook <code>useBacSi</code>, <code>useKhungGio</code>, <code>useDatLich</code>, <code>useLichHen</code>/<code>useHuyLichHen</code>, <code>src/mocks/</code> (MSW), <code>FormDatLich</code> + <code>schema/dat-lich.ts</code>, <code>KhuBacSi</code>, <code>LichHenCuaToi</code>, <code>useBoLocUrl</code> + <code>logic/bo-loc-url.ts</code>, <code>store/dat-lich-store.ts</code> và <code>src/test/render.tsx</code>. Đo trên điểm xuất phát đó: 21 file test, 81 test, xanh hết. <code>react-router</code> 8.4.0 đã có sẵn trong <code>package.json</code> của template khoá; nếu dự án của bạn chưa có: <code>npm install react-router</code> — <strong>không phải</strong> <code>react-router-dom</code> (Bài 7.1).</p>

<h3>Lên kế hoạch trước khi gõ</h3>
${slide('rx-07', 26, 'Đặt lịch đi theo URL: chọn giờ → đăng nhập → form → lịch hẹn')}
<p>Ba quyết định, làm trên giấy trước:</p>
<ol>
<li><strong>Mỗi mẩu state giờ sống ở đâu?</strong> Chương 5 giữ các bước đặt lịch trong một reducer. Có route rồi thì các bước <em>chính là</em> URL: bác sĩ là <code>:id</code>, ngày là <code>?ngay=</code>, khung giờ là <code>:khungGioId</code>. Mọi thứ trang đặt lịch cần đều nằm trong địa chỉ của nó, nên F5, Back và "gửi link này cho mẹ" đều chạy. Reducer và component <code>LuongDatLich</code> bị xoá (kèm 13 test của chúng). Thứ ở ngoài URL: yêu thích (Zustand, của riêng người dùng), dữ liệu máy chủ (TanStack Query), "vừa đặt lh-1" (<code>location.state</code> — hiện một lần cho đẹp, không cần để trang chạy).</li>
<li><strong>Trang nào cần đăng nhập?</strong> "Lịch hẹn của tôi", hiển nhiên. Và form đặt lịch: lịch hẹn là của một ai đó. Đặt <code>/dat-lich</code> sau cổng còn có một cái lợi thứ hai, đo ở dưới — dòng "vừa đặt" không bị mất.</li>
<li><strong>Mỗi file vào thư mục nào?</strong> Bốn câu hỏi của Bài 7.3. Chỗ thiết kế thật sự đổi: <code>DanhSachLichHen</code> (trước là <code>LichHenCuaToi</code>) nhận <code>tenBacSi</code> qua prop thay vì gọi sang tính năng bác sĩ.</li>
</ol>
${out(OUT.chup)}
<p>Đó là cả luồng chạy trên Chromium thật (<code>vite preview</code>): chưa đăng nhập mà bấm 14:00 thì tới <code>/dang-nhap</code>; đăng nhập xong quay về <em>đúng</em> URL đặt lịch, kể cả <code>?bacSi=bs-2&amp;ngay=2026-10-01</code>; gửi xong, <strong>một</strong> lần Back là về trang bác sĩ — trang đăng nhập và form đã gửi bị thay, không chồng lên nhau. F5 ở <code>/bac-si/bs-4?ngay=2026-10-02</code> vẫn giữ ngày 02/10.</p>

<h3>🛠 Tự gõ tiếp dự án</h3>
${slide('rx-07', 29, 'Tự gõ tiếp dự án: route, layout, cổng và thư mục theo tính năng')}
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau Chương 6 (các file liệt kê ở trên). Làm theo thứ tự; sau mỗi bước chạy <code>npx tsc -b</code>.</p><ol>
<li><strong>Dời sang thư mục theo tính năng</strong> (Bài 7.3): tạo <code>app/</code>, <code>pages/</code>, <code>features/{bac-si,dat-lich,lich-hen,dang-nhap}/</code>, <code>shared/{api,ui,hooks,logic,store}/</code>; dời file; thêm <code>"paths": { "@/*": ["./src/*"] }</code> vào <code>tsconfig.app.json</code> và <code>resolve: { tsconfigPaths: true }</code> vào <code>vite.config.ts</code>; sửa import tới khi <code>tsc</code> im lặng. Xoá <code>LuongDatLich</code>, <code>luong-dat-lich.ts</code>, <code>App.tsx</code> cùng test của chúng.</li>
<li><strong><code>shared/duong-dan.ts</code></strong>: mọi URL của app, dạng hằng hoặc hàm.</li>
<li><strong><code>features/dang-nhap/</code></strong>: <code>useDangNhapStore</code> (Zustand + <code>persist</code>, khoá <code>phong-kham-dang-nhap</code>), <code>FormDangNhap</code> (họ tên ≥ 2 ký tự, SĐT 10 số), <code>YeuCauDangNhap</code> (layout gác cổng: <code>&lt;Navigate replace state={{ tu }}&gt;</code> với <code>pathname + search + hash</code>), <code>index.ts</code>.</li>
<li><strong>Tính năng bác sĩ</strong>: <code>TheBacSi</code> có thêm <code>coLienKet</code> — "Xem chi tiết" thành <code>Link</code> tới <code>/bac-si/:id</code>; <code>useBoLocUrl</code> giữ nguyên chữ ký nhưng dùng <code>useSearchParams</code>; thêm <code>useChiTietBacSi(id)</code> (<code>GET /api/bac-si/:id</code>); <code>KhuBacSi</code> bỏ khung chi tiết bên cạnh; <code>index.ts</code>.</li>
<li><strong>Tính năng đặt lịch</strong>: <code>ChonKhungGio</code> (chip ngày ghi <code>?ngay=</code> bằng <code>replace</code>; khung còn trống là <code>Link</code> tới <code>duongDan.datLich(...)</code>; khung đã kín không phải link), <code>doc-ngay.ts</code>, <code>index.ts</code> (xuất cả <code>datLichSchema</code> cho <code>src/mocks/handlers.ts</code>).</li>
<li><strong>Tính năng lịch hẹn</strong>: <code>DanhSachLichHen({ tenBacSi })</code>; <code>useLichHen({ batDau })</code> để header không gọi API cho khách chưa đăng nhập.</li>
<li><strong>Trang</strong>: <code>TrangChu</code>, <code>TrangDanhSachBacSi</code>, <code>TrangChiTietBacSi</code> (API trả 404 ⇒ "Không có bác sĩ này"), <code>TrangDatLich</code> (mọi thứ lấy từ URL; sau <code>mutateAsync</code> → <code>navigate('/lich-hen', { replace: true, state: { vuaDat } })</code>), <code>TrangLichHen</code>, <code>TrangDangNhap</code>, <code>Trang404</code>. Mỗi trang đặt tiêu đề tab bằng <code>useTieuDeTrang</code> của Chương 4.</li>
<li><strong><code>app/</code></strong>: <code>router.tsx</code> (bảng route), <code>KhungTrang</code> (<code>Header</code> + <code>&lt;Outlet /&gt;</code> bọc trong <code>RanhGioiLoi</code> + <code>Footer</code> + <code>VungThongBao</code> + <code>ScrollRestoration</code>), <code>Header</code> (<code>NavLink</code>, huy hiệu đếm, đăng xuất), <code>TrangLoi</code> (<code>ErrorBoundary</code> gốc); <code>main.tsx</code> tạo router một lần. Test: thêm <code>renderVoiRouter</code> và <code>veTrang</code> vào <code>test/render.tsx</code>, reset store đăng nhập trong <code>test/setup.ts</code>, sửa các test cũ giờ có link bên trong.</li>
<li><strong>Lint</strong>: chép <code>.oxlintrc.json</code> của Bài 7.3; <code>npx oxlint src</code> phải báo 0 lỗi.</li>
</ol>
<p><strong>Đạt khi</strong> — chép nguyên file này vào <code>src/app/router.test.tsx</code>, không sửa:</p></div>
${pre('tsx', SN.fRouterTest)}
${out(OUT.routerTests)}
${out(OUT.duAnTong)}
<p>…và <code>npx oxlint src</code> thoát với mã 0, và trong <code>npm run dev</code> các màn hình của bạn giống ảnh chụp ở slide 25 và 26. Gói JS chính tăng từ 391,80 kB lên 491,08 kB (+99,28 kB, +31,77 kB gzip) — đó là router; Chương 8 chia nó theo route bằng tải lười.</p>
${out(OUT.buildSoSanh)}

<details><summary>Lời giải</summary>
<p>Chạy trên dự án của chương ngày 25/09/2026: <code>npx tsc -b</code> không in gì, <code>npx vitest run</code> cho 19 file test / 80 test xanh, <code>npx vite build</code> xong trong 709 ms, <code>npx oxlint src</code> thoát 0. Những file chỉ dời chỗ và đổi import (<code>FormDatLich</code>, <code>schema.ts</code>, <code>useKhungGio</code>, <code>useDatLich</code>, các file logic, file API của Chương 6, <code>LoiTaiDuLieu</code>, <code>KhungXuong</code>, …) không chép lại. Cấu hình (<code>tsconfig.app.json</code>, <code>vite.config.ts</code>, <code>.oxlintrc.json</code>) và <code>shared/duong-dan.ts</code> y như Bài 7.3. <code>Trang404</code> là <code>TrangKhongThay</code> của Bài 7.2, đọc <code>useLocation().pathname</code>; phần style (các lớp <code>.menu</code>, <code>.chon-gio</code>, <code>a.nut</code> trong <code>app/app.css</code>) tuỳ bạn — test không kiểm nó.</p>
<p><strong>app/router.tsx</strong></p>
${pre('tsx', SN.routerTsx)}
<p><strong>main.tsx</strong></p>
${pre('tsx', SN.mainTsx)}
<p><strong>app/KhungTrang.tsx</strong> (<code>TrangLoi</code> chính là <code>LoiChiTiet</code> của Bài 7.2 thêm link về trang chủ)</p>
${pre('tsx', SN.khungTrang)}
<p><strong>app/Header.tsx</strong></p>
${pre('tsx', SN.fHeader)}
<p><strong>features/dang-nhap/</strong> — store, form, cổng, cửa</p>
${pre('ts', SN.fDangNhapStore)}
${pre('tsx', SN.fFormDangNhap)}
${pre('tsx', SN.yeuCauDangNhap)}
${pre('ts', SN.fIndexDangNhap)}
<p><strong>features/bac-si/</strong> — link của thẻ, bộ lọc URL chạy trên router, một bác sĩ theo id</p>
${pre('tsx', SN.fTheBacSi)}
${pre('ts', SN.useBoLocUrl)}
${pre('ts', SN.fUseChiTiet)}
${pre('ts', SN.indexBacSi)}
<p><strong>features/dat-lich/</strong> — bộ chọn giờ và ngày trên URL</p>
${pre('tsx', SN.chonKhungGio)}
${pre('ts', SN.docNgay)}
${pre('ts', SN.indexDatLich)}
<p><strong>features/lich-hen/</strong> — <code>DanhSachLichHen</code> là <code>LichHenCuaToi</code> cộng prop <code>tenBacSi</code>; hook có thêm <code>batDau</code></p>
${pre('ts', SN.fUseLichHen)}
${pre('ts', SN.fIndexLichHen)}
<p><strong>pages/</strong></p>
${pre('tsx', SN.trangChiTiet)}
${pre('tsx', SN.trangDatLich)}
${pre('tsx', SN.trangLichHen)}
${pre('tsx', SN.trangDangNhap)}
<p><strong>shared/api/phong-kham.ts</strong> — kiểu của request không còn lấy từ một tính năng</p>
${pre('ts', SN.fPhongKham)}
<p><strong>test/render.tsx</strong> — hai helper mới (và một dòng mới trong <code>test/setup.ts</code>: <code>${H(SN.setupDong)}</code>)</p>
${pre('tsx', SN.fRender)}
</details>

<h3>Sai lầm, lần cuối</h3>
<p><strong>Đăng xuất sai thứ tự.</strong> Bản đầu của nút trong header làm điều hiển nhiên:</p>
${pre('tsx', SN.headerSai)}
${out(OUT.dangXuatSai)}
<p>Test chờ <code>/</code> mà nhận <code>/dang-nhap</code>. <code>dangXuat()</code> đổi store <em>ngay lập tức</em>; cổng của <code>/lich-hen</code>, vẫn đang trên màn hình, vẽ lại, thấy "chưa đăng nhập" và vẽ <code>&lt;Navigate to="/dang-nhap"&gt;</code> — lần chuyển trang đó thắng lần của ta. Cách chữa: rời trang trước, quên người dùng sau. Từ React Router 7, <code>navigate()</code> trả về một Promise để <code>await</code>:</p>
${pre('tsx', SN.headerDangXuat)}
<p><strong>Mất <code>location.state</code> ở cổng.</strong> Ở lần chạy đầu của script chụp ảnh, <code>/dat-lich</code> còn nằm ngoài cổng và khách chưa đăng nhập: lịch hẹn được lưu, <code>navigate('/lich-hen', { state: { vuaDat } })</code> chạy — và cổng của <code>/lich-hen</code> lập tức thay mục lịch sử đó bằng <code>/dang-nhap</code> cùng một state <em>mới</em> (<code>{ tu }</code>). Đăng nhập xong, danh sách có lịch hẹn nhưng dòng "Mã lịch hẹn" biến mất. <code>location.state</code> thuộc về một mục lịch sử; lần chuyển hướng nào chen giữa cũng làm rơi nó. Đưa <code>/dat-lich</code> vào sau cổng (để khách đăng nhập <em>trước</em> khi đặt) là chữa được — ảnh chụp cuối ở slide 26 có dòng đó.</p>
<p><strong>Quên rằng test vẽ component bên ngoài router.</strong> Ngay khi <code>TheBacSi</code> chứa một <code>Link</code>, mọi test vẽ nó bằng <code>render()</code> trần đều hỏng, vì <code>Link</code> cần một router ở phía trên. Vì thế mới có <code>renderVoiRouter</code>; test cũ chuyển sang dùng nó, và được thêm khả năng kiểm <code>href</code>, <code>router.state.location</code> và <code>historyAction</code>.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — tin URL ở trang đặt lịch.</strong> <code>/dat-lich/…?bacSi=bs-2&amp;ngay=2026-10-01</code> là thứ người dùng gõ và người dùng chia sẻ. Nên <code>TrangDatLich</code> kiểm mọi thứ nó đọc: ngày đi qua <code>docNgay</code> (lạ ⇒ ngày khám đầu tiên), bác sĩ và khung giờ được tra trong dữ liệu (không có ⇒ "Không tìm thấy khung giờ này"), và khung đã có người đặt thì báo "đã có người đặt" kèm link quay lại — test "mở thẳng link … khung ĐÃ KÍN" ghim điều đó. Máy chủ (ở đây là MSW) kiểm lại lần nữa, như nó phải làm.</div>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Luồng đặt hàng hay đặt lịch ở FER202 thường giữ món đã chọn và bước hiện tại trong state của component hoặc Redux, gửi xong thì chuyển trang bằng <code>window.location.href</code>, và kiểm đăng nhập trong <code>useEffect</code> của từng trang. → Đi làm, luồng được đánh địa chỉ bằng URL (<code>/doctors/:id</code> → <code>/book/:slotId?…</code> → <code>/appointments</code>), mỗi bước đọc được từ URL của nó, chuyển hướng dùng <code>replace</code>, một cổng bảo vệ cả nhóm route và đưa người dùng về chỗ cũ, và cả luồng được phủ bằng test chạy bảng route thật trong bộ nhớ. · <em>Vì sao:</em> người dùng bấm F5, Back, mở link ở tab mới và gửi cho người khác; bộ phận hỗ trợ tái hiện lỗi từ một URL; và một luồng được test xuyên suốt qua route bắt được những lỗi thứ tự (như vụ đăng xuất ở trên) mà test component bỏ lọt. Luồng giữ trong Redux vẫn chạy chừng nào tab còn mở — đó chính là điều kiện người dùng phá đầu tiên.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Bạn thêm định tuyến vào một app React đang có như thế nào?"</p>
<p>Cài router, tạo bảng route một lần ngoài cây component, và thêm một layout route gốc có <code>Outlet</code> để header, footer vẽ một lần. Biến mỗi màn hình thành một route và mỗi link trong app thành <code>Link</code>/<code>NavLink</code>; dời những state cần sống qua F5 và chia sẻ được (id, bộ lọc, bước) lên URL, có kiểm giá trị đọc được. Thêm error boundary ở gốc và route 404 trong layout, chặn các route riêng tư bằng layout route hoặc middleware dùng <code>replace</code> và đường quay về, cấu hình SPA fallback ở host, và sửa test để vẽ trong memory router — rồi thêm test ở mức route cho các luồng chính.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> cho mỗi lịch hẹn một trang riêng, cần đăng nhập.</p><ol>
<li>Thêm <code>duongDan.chiTietLichHen(id)</code> và route <code>lich-hen/:id</code> <em>trong</em> cổng, vẽ bằng <code>pages/TrangChiTietLichHen.tsx</code> mới: đọc <code>:id</code>, tìm lịch hẹn trong dữ liệu của <code>useLichHen()</code>, hiện bác sĩ, giờ, bệnh nhân, lý do và trạng thái, hoặc "Không có lịch hẹn này" với id lạ.</li>
<li>Trong <code>DanhSachLichHen</code>, cho tên bác sĩ thành <code>Link</code> tới trang đó.</li>
<li>Thêm hai test vào <code>router.test.tsx</code>: chưa đăng nhập, <code>/lich-hen/lh-1</code> kết thúc ở trang đăng nhập và quay về <code>/lich-hen/lh-1</code> sau khi đăng nhập; đã đăng nhập và cơ sở dữ liệu giả có một lịch hẹn, <code>/lich-hen/lh-1</code> hiện lý do khám còn <code>/lich-hen/lh-99</code> hiện "Không có lịch hẹn này".</li>
</ol><p><strong>Đạt khi:</strong> <code>npx vitest run src/app/router.test.tsx</code> báo 13 test xanh, cả bộ test vẫn xanh, và <code>npx oxlint src</code> vẫn 0 lỗi (trang mới chỉ import tính năng qua <code>index.ts</code> của chúng).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">luồng theo URL</span><span class="v">luồng nhiều bước mà các bước và lựa chọn nằm trên URL</span></div>
<div class="kv"><span class="k">bảng route</span><span class="v"><code>app/router.tsx</code>: một mảng, dùng cho <code>createBrowserRouter</code> lẫn test</span></div>
<div class="kv"><span class="k">layout route gác cổng</span><span class="v"><code>YeuCauDangNhap</code>: route không path, chuyển hướng hoặc vẽ <code>&lt;Outlet /&gt;</code></span></div>
<div class="kv"><span class="k">đường quay về</span><span class="v">vị trí <code>tu</code> mang sang trang đăng nhập để người dùng được đưa về</span></div>
<div class="kv"><span class="k"><code>location.state</code></span><span class="v">dữ liệu gắn với một mục lịch sử; mất khi một lần chuyển hướng thay mục đó</span></div>
<div class="kv"><span class="k"><code>ScrollRestoration</code></span><span class="v">sang trang mới thì cuộn lên đầu, Back thì trả về chỗ cũ</span></div>
<div class="kv"><span class="k">test bằng memory router</span><span class="v">vẽ đúng bảng route thật bằng <code>createMemoryRouter</code> để test điều hướng</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bảy route dưới một layout: trang chủ, danh sách, bác sĩ + chọn giờ, đặt lịch, lịch hẹn, đăng nhập, 404.</li>
<li>Luồng đặt lịch nằm trên URL (<code>:id</code>, <code>?ngay=</code>, <code>:khungGioId?bacSi=&amp;ngay=</code>): F5 và link chia sẻ đều chạy; reducer của Chương 5 được gỡ.</li>
<li>Cổng bảo vệ <code>/dat-lich</code> và <code>/lich-hen</code>, mang đủ đường quay về, dùng <code>replace</code>: đặt xong một lần Back là về trang bác sĩ (đo trên Chromium).</li>
<li>Đăng xuất: chuyển trang trước, xoá store sau; ngược lại cổng thắng (đo: <code>/dang-nhap</code> thay vì <code>/</code>).</li>
<li>Mã dời sang <code>app/ · pages/ · features/ · shared/</code> với <code>@/</code> và luật lint; 19 file test / 80 test, 11 test chạy bảng route thật.</li>
<li>Router làm gói JS tăng 99,28 kB (31,77 kB gzip) — Chương 8 chia nó theo route.</li>
</ul>

${LINK('https://reactrouter.com/start/data/routing', '📄', 'React Router — Routing (Data Mode)', 'Layout, index route, đoạn động và splat dùng trong dự án.')}
${LINK('https://reactrouter.com/start/modes', '📄', 'React Router — Picking a Mode', 'Vì sao dự án dùng createBrowserRouter + RouterProvider.')}
${LINK('https://react.dev/learn/build-a-react-app-from-scratch#routing', '📄', 'react.dev — Routing khi tự dựng app', 'Những gì router phải lo: route lồng, tham số, query.')}
</div>
`,
    },

    /* ─────────────────────────── 7.6 — QUIZ ─────────────────────────── */
    {
      title: '7.6 — Chapter 7 quiz|||7.6 — Kiểm tra Chương 7',
      slug: 'rx-7-6-kiem-tra',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống trên đúng những gì Chương 7 đã đo: hai router trong node_modules, Link so với a href, kiểu của useParams, F5 trên máy chủ tĩnh, replace khi chặn trang, middleware so với cổng component, alias chỉ khai ở tsconfig, barrel vòng tròn, "use client" của Next.js và thứ tự đăng xuất.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>Chapter 7 quiz</h2>
<p class="lead">Ten situations taken from what this chapter actually ran — the outputs are real, so is the right answer. 15 minutes. Each explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can set up React Router 8 in Data Mode and explain why <code>react-router-dom</code> must not be installed next to it.</li>
<li>I can explain what <code>Link</code> does differently from <code>&lt;a href&gt;</code>, and why F5 on a sub-page needs a server fallback.</li>
<li>I can build a layout route with <code>&lt;Outlet /&gt;</code>, nested routes, an index route, a 404 route and a route <code>ErrorBoundary</code>.</li>
<li>I can protect routes with a guard layout route or middleware, using <code>replace</code> and a return path.</li>
<li>I can organise a project into <code>app/ · pages/ · features/ · shared/</code>, configure the <code>@/</code> alias, and enforce the rules with lint.</li>
<li>I can say when a Vite SPA is enough and when a page should be server-rendered with Next.js.</li>
</ul>
${slide('rx-07', 28, 'Bảng tra nhanh Chương 7')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Kiểm tra Chương 7</h2>
<p class="lead">Mười tình huống lấy từ chính những gì chương này đã chạy — output là thật, đáp án cũng vậy. 15 phút. Mỗi lời giải nói vì sao đáp án đúng là đúng và vì sao phương án hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi dựng được React Router 8 ở Data Mode và giải thích được vì sao không được cài <code>react-router-dom</code> cạnh nó.</li>
<li>Tôi giải thích được <code>Link</code> làm gì khác <code>&lt;a href&gt;</code>, và vì sao F5 ở trang con cần máy chủ có đường lui.</li>
<li>Tôi dựng được layout route có <code>&lt;Outlet /&gt;</code>, route lồng, index route, route 404 và <code>ErrorBoundary</code> theo route.</li>
<li>Tôi chặn được route bằng layout route gác cổng hoặc middleware, dùng <code>replace</code> và đường quay về.</li>
<li>Tôi tổ chức được dự án thành <code>app/ · pages/ · features/ · shared/</code>, cấu hình alias <code>@/</code>, và giữ luật bằng lint.</li>
<li>Tôi nói được khi nào một SPA Vite là đủ và khi nào một trang nên render ở máy chủ bằng Next.js.</li>
</ul>
${slide('rx-07', 28, 'Bảng tra nhanh Chương 7')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Your project uses react-router 8.4.0. You paste `import { Link } from "react-router-dom"` from an old tutorial and run `npm install react-router-dom`. The first render shows "Unexpected Application Error! Cannot destructure property ‘basename’ of …useContext(…) as it is null". What is the real cause?|||Dự án dùng react-router 8.4.0. Bạn dán `import { Link } from "react-router-dom"` từ một bài hướng dẫn cũ và chạy `npm install react-router-dom`. Lần render đầu hiện "Unexpected Application Error! Cannot destructure property ‘basename’ of …useContext(…) as it is null". Nguyên nhân thật là gì?',
            options: [
              'react-router-dom is frozen at 7.18.4 and brings its own react-router@7.18.4, so there are two routers with two separate contexts; the v7 Link finds no router of its own|||react-router-dom đứng ở 7.18.4 và kéo theo react-router@7.18.4 riêng, nên có hai router với hai context tách biệt; Link bản 7 không thấy router nào của nó',
              'The Link is rendered outside RouterProvider; moving it inside the layout fixes it|||Link được vẽ ngoài RouterProvider; dời nó vào trong layout là hết',
              'React Router 8 renamed Link to NavLink, so the old name no longer exists|||React Router 8 đổi tên Link thành NavLink nên tên cũ không còn tồn tại',
              'The route table was created inside a component, so the context is recreated on every render|||Bảng route được tạo bên trong component nên context bị tạo lại mỗi lần render',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: npm shows react-router-dom@7.18.4 → react-router@7.18.4 next to react-router@8.4.0: two copies, two React contexts. The component is inside RouterProvider — but the provider belongs to the other copy. Fix: uninstall react-router-dom and import everything from "react-router" (RouterProvider from "react-router/dom"). Link still exists in v8, and the route-table placement does not produce this error.|||VI: npm cho thấy react-router-dom@7.18.4 → react-router@7.18.4 nằm cạnh react-router@8.4.0: hai bản, hai context React. Component có nằm trong RouterProvider — nhưng provider đó thuộc bản kia. Cách chữa: gỡ react-router-dom và import mọi thứ từ "react-router" (RouterProvider từ "react-router/dom"). Phương án "Link nằm ngoài RouterProvider" hấp dẫn vì thông báo giống hệt, nhưng ở đây component rõ ràng nằm trong; Link vẫn tồn tại ở bản 8.',
          },
          {
            question: 'In the browser test project, "Tăng bộ đếm" (a useState counter in the layout) was pressed 3 times. Then the user clicks a plain `<a href="/bac-si">`. What does the measurement show?|||Trong dự án thử trên trình duyệt, nút "Tăng bộ đếm" (bộ đếm useState trong layout) được bấm 3 lần. Rồi người dùng bấm một thẻ `<a href="/bac-si">` trần. Phép đo cho thấy gì?',
            options: [
              '0 network requests and the counter stays at 3, because React Router intercepts every anchor|||0 request mạng và bộ đếm vẫn là 3, vì React Router chặn mọi thẻ a',
              'Only the JavaScript bundle is requested again; the counter stays at 3|||Chỉ gói JavaScript được tải lại; bộ đếm vẫn là 3',
              '3 requests (document, JS, CSS), page loads goes from 1 to 2 and the counter is back to 0|||3 request (tài liệu, JS, CSS), số lần tải trang từ 1 lên 2 và bộ đếm về 0',
              'The browser shows a 404 because /bac-si is not a file on the server|||Trình duyệt báo 404 vì /bac-si không phải một file trên máy chủ',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured in Chromium: <Link> → 0 requests, counter 3; <a href> → document /bac-si, the 313 kB script and the stylesheet, page loads 2, counter 0. React Router only intercepts clicks on its own Link components, not on plain anchors. There is no 404 here because vite preview falls back to index.html; a plain static server would 404 — that is the F5 problem, not this one.|||VI: Đo trên Chromium: <Link> → 0 request, bộ đếm 3; <a href> → document /bac-si, file script 313 kB và stylesheet, số lần tải trang 2, bộ đếm 0. React Router chỉ chặn cú click trên Link của nó, không chặn thẻ a trần. Không có 404 vì vite preview lùi về index.html; máy chủ tĩnh trần mới trả 404 — đó là chuyện F5, không phải câu này.',
          },
          {
            question: 'You write `const { id } = useParams<"id">(); const bacSi = timBacSi(id);` where `function timBacSi(id: string)`. What does `npx tsc` say?|||Bạn viết `const { id } = useParams<"id">(); const bacSi = timBacSi(id);` với `function timBacSi(id: string)`. `npx tsc` nói gì?',
            options: [
              'Nothing: the route is /bac-si/:id, so TypeScript knows id is a string|||Không gì cả: route là /bac-si/:id nên TypeScript biết id là string',
              'TS2345: Argument of type "string | undefined" is not assignable to parameter of type "string"|||TS2345: Argument of type "string | undefined" is not assignable to parameter of type "string"',
              'TS2307: Cannot find module "react-router"|||TS2307: Cannot find module "react-router"',
              'An error only at runtime, when the URL has no id|||Chỉ lỗi lúc chạy, khi URL không có id',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Params<"id"> is { readonly id: string | undefined }. In Data Mode without Framework Mode typegen, TypeScript does not know which route renders the component, so it cannot promise the param exists — the lesson printed exactly TS2345. Handle undefined (find() accepts it, or a default `= ""`), do not silence it with `id!`.|||VI: Params<"id"> là { readonly id: string | undefined }. Ở Data Mode (không có sinh kiểu của Framework Mode), TypeScript không biết route nào vẽ component, nên không hứa được tham số có mặt — bài đã in đúng TS2345. Xử lý undefined (find() nhận được, hoặc gán mặc định `= ""`), đừng bịt nó bằng `id!`. Phương án "không lỗi vì route là /bac-si/:id" hấp dẫn nhưng component không biết mình nằm ở route nào.',
          },
          {
            question: 'The built app is served by `python3 -m http.server`. Clicking from "/" to "/bac-si/bs-2" works. The user presses F5 on /bac-si/bs-2. What happens, and what is the fix?|||Bản build được phục vụ bằng `python3 -m http.server`. Bấm từ "/" sang "/bac-si/bs-2" chạy bình thường. Người dùng bấm F5 ở /bac-si/bs-2. Chuyện gì xảy ra, chữa thế nào?',
            options: [
              'The router shows its own 404 page; add a path: "*" route|||Router hiện trang 404 của nó; thêm route path: "*"',
              'The page reloads normally, because the router saved the URL in sessionStorage|||Trang tải lại bình thường, vì router đã lưu URL vào sessionStorage',
              'A blank page, because React Router needs HydrateFallback on reload|||Trang trắng, vì React Router cần HydrateFallback khi tải lại',
              'The server answers 404 (no file named bac-si) and the app never loads; configure the server to return index.html for unknown paths|||Máy chủ trả 404 (không có file tên bac-si) và app không kịp tải; cấu hình máy chủ trả index.html cho đường dẫn lạ',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured: http.server GET /bac-si/bs-2 → 404 with its own "Error response" HTML, while vite preview → 200. The browser asks the server for that path; only index.html exists. The router never runs, so a "*" route cannot help — that route handles unknown URLs after the app has loaded. Fix on the host: nginx try_files $uri /index.html, Netlify _redirects, SPA mode on Vercel/Cloudflare.|||VI: Đo thật: http.server GET /bac-si/bs-2 → 404 kèm trang "Error response" của nó, còn vite preview → 200. Trình duyệt hỏi máy chủ đúng đường dẫn đó; máy chủ chỉ có index.html. Router không hề chạy, nên route "*" vô dụng — route đó xử lý URL lạ SAU khi app đã tải. Chữa ở host: nginx try_files $uri /index.html, Netlify _redirects, chế độ SPA trên Vercel/Cloudflare.',
          },
          {
            question: 'Guard flow: start at "/", click "Lịch hẹn" (protected), get redirected to the login page, log in, arrive at "/lich-hen". Both redirects are written WITHOUT replace. How many Back presses to reach "/" (measured)?|||Luồng gác cổng: bắt đầu ở "/", bấm "Lịch hẹn" (cần đăng nhập), bị chuyển sang trang đăng nhập, đăng nhập, tới "/lich-hen". Cả hai lần chuyển hướng đều KHÔNG có replace. Phải bấm Back mấy lần mới về "/" (đo thật)?',
            options: [
              '1 — React Router removes the login page from history automatically|||1 — React Router tự gỡ trang đăng nhập khỏi lịch sử',
              '2 — once for the login page, once for the protected page|||2 — một lần cho trang đăng nhập, một lần cho trang được bảo vệ',
              '3 — Back goes /dang-nhap, then /lich-hen, then /|||3 — Back lần lượt về /dang-nhap, /lich-hen, rồi mới /',
              'Never — the guard sends Back to the login page forever|||Không bao giờ — cổng đẩy Back về trang đăng nhập mãi mãi',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The test printed "/dang-nhap · /lich-hen · Back→/dang-nhap · Back→/lich-hen · Back→/ ⇒ 3 lần Back"; with replace on both redirects it was 1. Without replace every step stays in history, including the blocked /lich-hen entry and the login page. "2" is tempting but forgets the first, blocked /lich-hen entry.|||VI: Test in ra "/dang-nhap · /lich-hen · Back→/dang-nhap · Back→/lich-hen · Back→/ ⇒ 3 lần Back"; có replace ở cả hai lần chuyển hướng thì là 1. Thiếu replace, mọi bước ở lại trong lịch sử, kể cả mục /lich-hen bị chặn và trang đăng nhập. "2" hấp dẫn nhưng quên mất mục /lich-hen bị chặn lúc đầu.',
          },
          {
            question: 'A protected route has a loader that fetches the user’s appointments. A logged-out user opens it. The guard is either (a) a layout component rendering <Navigate>, or (b) a route middleware that throws redirect(). How many times does the loader run?|||Một route cần đăng nhập có loader tải lịch hẹn của người dùng. Người chưa đăng nhập mở nó. Cổng là (a) một layout component vẽ <Navigate>, hoặc (b) một middleware của route ném redirect(). Loader chạy mấy lần?',
            options: [
              '(a) once, (b) zero times — loaders run before rendering, middleware runs before loaders|||(a) một lần, (b) không lần nào — loader chạy trước khi vẽ, middleware chạy trước loader',
              '(a) zero, (b) zero — both stop the navigation before any data is loaded|||(a) không, (b) không — cả hai đều chặn trước khi tải dữ liệu',
              '(a) zero, (b) once — middleware runs after loaders|||(a) không, (b) một lần — middleware chạy sau loader',
              '(a) twice in StrictMode, (b) once|||(a) hai lần trong StrictMode, (b) một lần',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured: "component = 1 lần · middleware = 0 lần". The data router runs all loaders of the matched branch before rendering anything, and the component guard IS rendering — too late. Middleware runs before the loaders, so throwing redirect() cancels the navigation first. Either way, the real protection is the API refusing requests without a token.|||VI: Đo thật: "component = 1 lần · middleware = 0 lần". Data router chạy mọi loader của nhánh khớp trước khi vẽ bất cứ thứ gì, mà cổng bằng component CHÍNH LÀ lúc vẽ — quá muộn. Middleware chạy trước loader, nên ném redirect() là huỷ lượt chuyển trang trước. Phương án "cả hai đều chặn" hấp dẫn nhưng sai với cổng component. Dù cách nào, bảo vệ thật vẫn là API từ chối request thiếu token.',
          },
          {
            question: 'The app’s tsconfig.app.json has "paths": { "@/*": ["./src/*"] } and vite.config.ts has no resolve.tsconfigPaths. What did the chapter measure?|||tsconfig.app.json có "paths": { "@/*": ["./src/*"] } còn vite.config.ts không có resolve.tsconfigPaths. Chương đã đo được gì?',
            options: [
              'Everything works: Vite always reads tsconfig paths|||Mọi thứ đều chạy: Vite luôn đọc paths của tsconfig',
              'vite build passes, but the dev server answers 500 and Vitest fails all 20 test files ("Failed to resolve import")|||vite build qua, nhưng dev server trả 500 và Vitest hỏng cả 20 file test ("Failed to resolve import")',
              'tsc fails with TS2307 because paths needs baseUrl|||tsc hỏng với TS2307 vì paths cần baseUrl',
              'Nothing works, including the build; the alias must be declared again in resolve.alias|||Không gì chạy, kể cả build; alias phải khai lại trong resolve.alias',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The production build (Rolldown) read tsconfig paths and passed; the dev server and Vitest go through Vite’s resolver, where tsconfigPaths defaults to false: GET /src/pages/TrangChu.tsx → 500, "Test Files 20 failed (20)". Adding resolve: { tsconfigPaths: true } fixed both while keeping one source of truth. Declaring the alias again in resolve.alias also works but creates a second source that drifts.|||VI: Bản build production (Rolldown) tự đọc paths và qua; dev server và Vitest đi qua bộ phân giải của Vite, nơi tsconfigPaths mặc định false: GET /src/pages/TrangChu.tsx → 500, "Test Files 20 failed (20)". Thêm resolve: { tsconfigPaths: true } chữa cả hai mà vẫn một nguồn sự thật. Khai lại alias trong resolve.alias cũng chạy nhưng tạo nguồn thứ hai dễ lệch; và build thì KHÔNG hỏng.',
          },
          {
            question: 'features/lich-hen imports benhNhanSchema from "@/features/dat-lich" and uses it at module top level; features/dat-lich imports from "@/features/lich-hen". tsc: 0 errors. Vitest: 94 tests green. Which tool reported the problem before a user saw a blank page?|||features/lich-hen import benhNhanSchema từ "@/features/dat-lich" và dùng ngay ở cấp cao nhất của module; features/dat-lich import từ "@/features/lich-hen". tsc: 0 lỗi. Vitest: 94 test xanh. Công cụ nào báo lỗi trước khi người dùng thấy trang trắng?',
            options: [
              'vite build — it refuses to bundle circular imports|||vite build — nó từ chối đóng gói import vòng tròn',
              'React, with a warning "circular dependency detected" in the console|||React, bằng cảnh báo "circular dependency detected" trong console',
              'oxlint’s import/no-cycle rule, with one error per file in the cycle|||luật import/no-cycle của oxlint, mỗi file trong vòng một lỗi',
              'None — only the dev server in the browser shows it|||Không công cụ nào — chỉ dev server trên trình duyệt mới lộ ra',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured: the production build ran fine ("Đội ngũ bác sĩ (6)"), the dev server threw "Cannot access ‘benhNhanSchema’ before initialization" (a TDZ error), and oxlint import/no-cycle printed 4 errors. So "only the dev server shows it" is how you find it too late; lint finds it before. React has no such warning, and vite build did not refuse the cycle.|||VI: Đo thật: bản build production chạy bình thường ("Đội ngũ bác sĩ (6)"), dev server ném "Cannot access ‘benhNhanSchema’ before initialization" (lỗi TDZ), và oxlint import/no-cycle in 4 lỗi. "Chỉ dev server mới lộ ra" là cách bạn phát hiện quá muộn; lint phát hiện trước. React không có cảnh báo như vậy, và vite build không từ chối vòng tròn.',
          },
          {
            question: 'You move a Vite component that uses useState and onClick into app/thu-loi/page.tsx of a Next.js 16 project, without adding anything. What does `npx next build` do?|||Bạn chép một component Vite dùng useState và onClick vào app/thu-loi/page.tsx của một dự án Next.js 16, không thêm gì. `npx next build` làm gì?',
            options: [
              'Builds fine; the page is rendered in the browser like in Vite|||Build bình thường; trang được vẽ ở trình duyệt như bên Vite',
              'Builds, but the button does nothing because the page is static|||Build được, nhưng nút không làm gì vì trang là tĩnh',
              'Fails because every page must be an async function|||Hỏng vì mọi trang phải là hàm async',
              'Fails: "You’re importing a module that depends on useState into a React Server Component module…", fix by adding "use client" to the file|||Hỏng: "You’re importing a module that depends on useState into a React Server Component module…", chữa bằng cách thêm "use client" vào file',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Files in app/ are Server Components by default and cannot use state or events. The real build failed with exactly that message and pointed to the "use client" directive. Pages may be async, but do not have to be. Better than marking the whole page: keep the page on the server and move only the interactive button into a "use client" file.|||VI: File trong app/ mặc định là Server Component và không dùng được state hay sự kiện. Lần build thật hỏng đúng với thông báo đó và trỏ tới chỉ thị "use client". Trang được phép async nhưng không bắt buộc. Tốt hơn đánh dấu cả trang: giữ trang ở máy chủ và chỉ đưa cái nút tương tác vào một file "use client".',
          },
          {
            question: 'On /lich-hen (behind a component guard) the "Đăng xuất" button runs `dangXuat(); navigate("/", { replace: true });`. Where does the user end up (measured), and what is the fix?|||Ở /lich-hen (sau một cổng bằng component), nút "Đăng xuất" chạy `dangXuat(); navigate("/", { replace: true });`. Người dùng kết thúc ở đâu (đo thật), chữa thế nào?',
            options: [
              'At "/" — navigate always wins because it is called last|||Ở "/" — navigate luôn thắng vì nó được gọi sau cùng',
              'At "/dang-nhap": clearing the store makes the guard re-render and redirect first; fix with `await navigate("/", { replace: true }); dangXuat();`|||Ở "/dang-nhap": xoá store làm cổng vẽ lại và chuyển hướng trước; chữa bằng `await navigate("/", { replace: true }); dangXuat();`',
              'At "/lich-hen" — the page does not react to store changes|||Ở "/lich-hen" — trang không phản ứng khi store đổi',
              'An infinite loop between "/" and "/dang-nhap"|||Một vòng lặp vô hạn giữa "/" và "/dang-nhap"',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The route test failed with "expected ‘/dang-nhap’ to be ‘/’". dangXuat() updates the store synchronously, the guard still on screen re-renders and renders <Navigate to="/dang-nhap">, which beats our navigation. Since React Router 7 navigate() returns a Promise: leave first, then clear the user. "navigate is called last so it wins" is the tempting intuition the measurement disproved.|||VI: Test route hỏng với "expected ‘/dang-nhap’ to be ‘/’". dangXuat() đổi store ngay lập tức, cổng còn trên màn hình vẽ lại và vẽ <Navigate to="/dang-nhap">, lần chuyển này thắng lần của ta. Từ React Router 7, navigate() trả về Promise: rời trang trước, xoá người dùng sau. "navigate gọi sau cùng nên thắng" là trực giác hấp dẫn mà phép đo đã bác bỏ.',
          },
        ],
      },
    },

  ],
};
