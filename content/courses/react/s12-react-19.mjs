import { gallery, slide } from './_slides.mjs';

/**
 * React — Chương 12 (MỚI): React 19 & concurrent (soạn 26/09/2026 theo content/courses/react/_HOP-DONG.md, mục 4c + 11).
 * Section mới: bài đầu rx-12-0-slides (DOCUMENT), bốn bài dạy rx-12-1-suspense-use · rx-12-2-transition · rx-12-3-actions ·
 * rx-12-4-compiler-rsc (LESSON), quiz rx-12-5-kiem-tra (QUIZ, 10 câu). "🛠 Tự gõ tiếp dự án" rải MỖI bài một bước (4 bước).
 * Mọi mã dài và mọi output trong bài chạy THẬT 26/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch12 — chép từ
 * ảnh chụp sau-ch08 (Chương 9–11 soạn song song, chưa có ảnh chụp), rồi làm bốn bước của chương này.
 * Ảnh chụp dự án sau chương: SCRATCH/rx/du-an/sau-ch12.
 * (react 19.3.0 · react-dom 19.3.0 · vite 8.3.1 · typescript 6.0.3 · vitest 5.0.2 · jsdom 29.1.1 · react-router 8.4.0 ·
 *  @tanstack/react-query 5.103.3 · msw 2.15.0 · @testing-library/react 16.3.3 · babel-plugin-react-compiler 1.0.0 +
 *  @rolldown/plugin-babel 0.2.4 + @babel/core 7.29.7 · Chromium 149 qua Playwright, CPU chậm 4× bằng CDP).
 * Mã dài trong bài nằm ở hằng SN, output ở hằng OUT — sinh tự động từ chính các file/log đã chạy (tsc -b sạch, vitest xanh).
 * Sơ đồ: mermaid ngay trong bài (<pre><code class="language-mermaid">), 2–3 sơ đồ mỗi bài dạy, nhãn VI ở khối VI, EN ở khối EN.
 * Server Components / Server Actions chỉ ở mức khái niệm — phần thật nằm ở khoá Next.js (Chương 9–12), có link-card "Học tiếp".
 * Deck: scripts/slides-src/rx-12.mjs.
 */

const H = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '&#96;').replace(/\$\{/g, '&#36;{');
const pre = (lang, s) => '<pre><code class="language-' + lang + '">' + H(s) + '</code></pre>';
const out = (s) => '<div class="out">' + H(s) + '</div>';
const LINK = (href, ico, title, sub) => '<a class="link-card" href="' + href + '" target="_blank" rel="noopener"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';
/** Link trong site (không mở tab mới). */
const LINK_TRONG = (href, ico, title, sub) => '<a class="link-card" href="' + href + '"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';
/** Sơ đồ mermaid: trang học đọc textContent của <code class="language-mermaid"> rồi vẽ (LearnPageClient → mermaidRuntime). */
const MM = (src) => '<pre><code class="language-mermaid">' + H(src.trim()) + '</code></pre>';

/* ─── Mã trong bài: SINH TỰ ĐỘNG từ dự án thử ch12 (tsc -b sạch + vitest xanh 26/09/2026) — đừng sửa tay ─── */
const SN = {
  trangCu: "export function TrangChiTietBacSi() {\n  const { id = '' } = useParams<'id'>(); // = '' : route này luôn có :id, nhưng kiểu vẫn là string | undefined\n  const { data: bacSi, isPending, error, refetch, isFetching } = useChiTietBacSi(id);\n  const yeuThich = useDatLichStore((s) => s.yeuThich);\n  const doiYeuThich = useDatLichStore((s) => s.doiYeuThich);\n  useTieuDeTrang(bacSi ? `${bacSi.ten} · Phòng khám An Tâm` : 'Phòng khám An Tâm');\n\n  const quayLai = (\n    <Link className=\"nut nut-lui\" to={duongDan.bacSi}>\n      ← Danh sách bác sĩ\n    </Link>\n  );\n\n  if (isPending) return <p aria-busy=\"true\">Đang tải thông tin bác sĩ…</p>;\n  if (error instanceof LoiApi && error.status === 404) {\n    return (\n      <section>\n        <h2>Không có bác sĩ này</h2>\n        <p>Đường dẫn có thể đã cũ hoặc gõ nhầm (“{id}”).</p>\n        {quayLai}\n      </section>\n    );\n  }\n  if (!bacSi) {\n    return <LoiTaiDuLieu tieuDe=\"Không tải được thông tin bác sĩ\" loi={error!} onThuLai={() => refetch()} dangThuLai={isFetching} />;\n  }\n  return (\n    <div className=\"trang-chi-tiet\">\n      {quayLai}\n      <ChiTietBacSi bacSi={bacSi} laYeuThich={yeuThich.includes(bacSi.id)} onDoiYeuThich={doiYeuThich} />\n      <ChonKhungGio bacSiId={bacSi.id} />\n    </div>\n  );\n}",
  hoSoSai: "export function HoSoSai({ id }: { id: string }) {\n  const bacSi = use(api.bacSi(id)); // lần render sau (khi promise cũ xong) lại gọi api.bacSi ⇒ promise mới ⇒ treo tiếp\n  return <h2>{bacSi.ten}</h2>;\n}",
  hoSoDung: "const kho = new Map<string, Promise<BacSi>>();\nfunction taiBacSi(id: string): Promise<BacSi> {\n  let hua = kho.get(id);\n  if (!hua) {\n    hua = api.bacSi(id);\n    kho.set(id, hua);\n  }\n  return hua;\n}\n\nexport function HoSoDung({ id }: { id: string }) {\n  const bacSi = use(taiBacSi(id)); // lần 1: treo; promise xong ⇒ React vẽ lại ⇒ CÙNG promise, đã có kết quả ⇒ đi tiếp\n  return <h2>{bacSi.ten}</h2>;\n}",
  hoSoTanStack: "export function HoSoTanStack({ id }: { id: string }) {\n  const { data: bacSi } = useSuspenseQuery(truyVanChiTietBacSi(id)); // data luôn có — không có isPending\n  return <h2>{bacSi.ten}</h2>;\n}",
  gioMoCua: "export const MuiGio = createContext('Asia/Ho_Chi_Minh');\nexport function GioMoCua({ hien }: { hien: boolean }) {\n  if (!hien) return null; // useContext ở dưới dòng này là phạm luật hook; use() thì được\n  const muiGio = use(MuiGio);\n  return <p>Giờ mở cửa tính theo {muiGio}</p>;\n}",
  hua: "import type { EnsureQueryDataOptions, QueryClient, QueryKey } from '@tanstack/react-query';\n\n/**\n * Chương 12: kho PROMISE cho use(). use(promise) đòi CÙNG một promise qua mọi lần render — promise mới mỗi lần\n * render là treo mãi (React: \"A component was suspended by an uncached promise\"). Kho này sống NGOÀI React,\n * mỗi QueryClient một ngăn (WeakMap: test tạo client mới ⇒ kho mới, không rò giữa các test).\n */\nconst kho = new WeakMap<QueryClient, Map<string, Promise<unknown>>>();\n\nfunction ngan(queryClient: QueryClient) {\n  let m = kho.get(queryClient);\n  if (!m) kho.set(queryClient, (m = new Map()));\n  return m;\n}\n\n/** Cùng queryKey ⇒ cùng promise. Dữ liệu vẫn vào cache TanStack (ensureQueryData), nên useQuery ở chỗ khác dùng lại được. */\nexport function layHua<T, K extends QueryKey>(queryClient: QueryClient, truyVan: EnsureQueryDataOptions<T, Error, T, K>): Promise<T> {\n  const m = ngan(queryClient);\n  const k = JSON.stringify(truyVan.queryKey);\n  let hua = m.get(k) as Promise<T> | undefined;\n  if (!hua) {\n    hua = queryClient.ensureQueryData(truyVan);\n    m.set(k, hua);\n  }\n  return hua;\n}\n\n/** Promise đã LỖI thì lỗi mãi ⇒ nút \"Thử lại\" phải quên nó đi để lần render sau tạo promise mới. */\nexport function quenHua(queryClient: QueryClient, queryKey: QueryKey) {\n  ngan(queryClient).delete(JSON.stringify(queryKey));\n}",
  truyVan: "export const truyVanChiTietBacSi = (id: string) =>\n  queryOptions({\n    queryKey: khoa.chiTietBacSi(id),\n    queryFn: ({ signal }) => api.bacSi(id, signal),\n    staleTime: 5 * 60_000,\n  });",
  hoSoBacSi: "import { useQueryClient } from '@tanstack/react-query';\nimport { use } from 'react';\nimport { layHua } from '@/shared/api/hua';\nimport { useTieuDeTrang } from '@/shared/hooks/useTieuDeTrang';\nimport { useDatLichStore } from '../dat-lich-store';\nimport { truyVanChiTietBacSi } from '../hooks/useChiTietBacSi';\nimport { ChiTietBacSi } from './ChiTietBacSi';\n\n/**\n * Chương 12: đọc hồ sơ bác sĩ bằng use(promise). Promise CHƯA xong ⇒ component \"treo\" (suspend) và <Suspense>\n * gần nhất vẽ fallback; promise LỖI ⇒ lỗi được ném cho error boundary gần nhất. Không còn isPending, không còn\n * `if (!bacSi)`: tới được dòng sau use() là chắc chắn đã có dữ liệu.\n * Promise lấy từ kho layHua (sống ngoài React) — tự tạo `api.bacSi(id)` ngay ở đây là treo mãi (Bài 12.1).\n */\nexport function HoSoBacSi({ id }: { id: string }) {\n  const bacSi = use(layHua(useQueryClient(), truyVanChiTietBacSi(id)));\n  const laYeuThich = useDatLichStore((s) => s.yeuThich.includes(bacSi.id));\n  const doiYeuThich = useDatLichStore((s) => s.doiYeuThich);\n  useTieuDeTrang(`${bacSi.ten} · Phòng khám An Tâm`);\n  return <ChiTietBacSi bacSi={bacSi} laYeuThich={laYeuThich} onDoiYeuThich={doiYeuThich} />;\n}",
  trangMoi: "import { useQueryClient } from '@tanstack/react-query';\nimport { Suspense } from 'react';\nimport { Link, useParams } from 'react-router';\nimport { HoSoBacSi, truyVanChiTietBacSi } from '@/features/bac-si';\nimport { ChonKhungGio } from '@/features/dat-lich';\nimport { LoiApi } from '@/shared/api/http';\nimport { quenHua } from '@/shared/api/hua';\nimport { duongDan } from '@/shared/duong-dan';\nimport { HoSoBacSiKhung } from '@/shared/ui/KhungXuong';\nimport { RanhGioiLoi } from '@/shared/ui/RanhGioiLoi';\n\n/**\n * /bac-si/:id — TRANG ghép hai tính năng: hồ sơ bác sĩ (bac-si) + chọn giờ (dat-lich).\n * Chương 12: hồ sơ đọc bằng use() trong <Suspense>; ChonKhungGio nằm NGOÀI <Suspense> nên được vẽ — và bắt đầu\n * tải giờ khám — cùng lúc với hồ sơ. Trước đây trang `return` sớm khi hồ sơ chưa về ⇒ giờ khám phải xếp hàng sau.\n */\nexport function TrangChiTietBacSi() {\n  const { id = '' } = useParams<'id'>(); // = '' : route này luôn có :id, nhưng kiểu vẫn là string | undefined\n  const queryClient = useQueryClient();\n\n  return (\n    <div className=\"trang-chi-tiet\">\n      <Link className=\"nut nut-lui\" to={duongDan.bacSi}>\n        ← Danh sách bác sĩ\n      </Link>\n      {/* key={id}: sang bác sĩ khác thì ranh giới lỗi bắt đầu lại, không mang lỗi của trang trước */}\n      <RanhGioiLoi\n        key={id}\n        onThuLai={() => quenHua(queryClient, truyVanChiTietBacSi(id).queryKey)}\n        thayThe={(loi) =>\n          loi instanceof LoiApi && loi.status === 404 ? (\n            <section>\n              <h2>Không có bác sĩ này</h2>\n              <p>Đường dẫn có thể đã cũ hoặc gõ nhầm (“{id}”).</p>\n            </section>\n          ) : null\n        }\n      >\n        <Suspense fallback={<HoSoBacSiKhung />}>\n          <HoSoBacSi id={id} />\n        </Suspense>\n        <ChonKhungGio bacSiId={id} />\n      </RanhGioiLoi>\n    </div>\n  );\n}",
  ranhGioi: "  render() {\n    if (this.state.loi) {\n      const rieng = this.props.thayThe?.(this.state.loi);\n      if (rieng) return rieng;\n      return (",
  veTrangCho: "/**\n * Chương 12: như veTrang, nhưng CHỜ trong `await act(async …)`. BẮT BUỘC cho trang có component đọc dữ liệu bằng\n * use()/Suspense (vd /bac-si/:id): component \"treo\" bên trong một act() ĐỒNG BỘ (render thường, hay một cú click)\n * thì React bỏ dở phần việc còn lại — fallback đứng mãi, test hết giờ (đo thật: \"Đang tải thông tin bác sĩ…\" sau 1,5 s).\n */\nexport async function veTrangCho(url: string, queryClient = taoClientTest()) {\n  let kq!: ReturnType<typeof veTrang>;\n  await act(async () => {\n    kq = veTrang(url, queryClient);\n  });\n  return kq;\n}",
  test121: "test('12.1 — hồ sơ và giờ khám tải song song: giờ khám bắt đầu TRƯỚC khi hồ sơ về', async () => {\n  const nhatKy: string[] = [];\n  server.use(\n    http.get('/api/bac-si/:id', async ({ params }) => {\n      nhatKy.push('bắt đầu hồ sơ');\n      await delay(200); // hồ sơ chậm hẳn\n      nhatKy.push('xong hồ sơ');\n      return HttpResponse.json(danhSachBacSi.find((b) => b.id === params.id));\n    }),\n  );\n  server.events.on('request:start', ({ request }) => {\n    if (request.url.includes('/khung-gio')) nhatKy.push('bắt đầu giờ khám');\n  });\n  await veTrangCho('/bac-si/bs-2');\n  expect(await screen.findByRole('heading', { level: 2, name: 'BS. Trần Thu Hà' })).toBeInTheDocument();\n  expect(nhatKy.indexOf('bắt đầu giờ khám')).toBeLessThan(nhatKy.indexOf('xong hồ sơ'));\n  server.events.removeAllListeners();\n});",
  test121b: "test('12.1 — API hồ sơ lỗi 500 ⇒ hộp lỗi; \"Tải lại phần này\" ⇒ promise MỚI ⇒ hiện hồ sơ', async () => {\n  const user = userEvent.setup();\n  server.use(http.get('/api/bac-si/:id', () => HttpResponse.json({ loi: 'Máy chủ đang bận' }, { status: 500 }), { once: true }));\n  await veTrangCho('/bac-si/bs-2');\n  expect(await screen.findByRole('alert')).toHaveTextContent('Máy chủ đang bận');\n  const nut = screen.getByRole('button', { name: 'Tải lại phần này' });\n  await act(async () => user.click(nut)); // click làm hồ sơ \"treo\" lại ⇒ await act\n  expect(await screen.findByRole('heading', { level: 2, name: 'BS. Trần Thu Hà' })).toBeInTheDocument();\n});",
  timThuong: "export function TimThuong({ ds }: { ds: BacSi[] }) {\n  const [tuKhoa, setTuKhoa] = useState('');\n  return (\n    <>\n      <label className=\"o-tim\">\n        Tìm theo tên\n        <input type=\"search\" value={tuKhoa} onChange={(e) => setTuKhoa(e.target.value)} />\n      </label>\n      <DanhSach ds={ds} tuKhoa={tuKhoa} />\n    </>\n  );\n}",
  timTre: "export function TimTre({ ds }: { ds: BacSi[] }) {\n  const [tuKhoa, setTuKhoa] = useState('');\n  const tuKhoaTre = useDeferredValue(tuKhoa); // lần render khẩn: vẫn là giá trị CŨ ⇒ DanhSach (memo) được bỏ qua\n  const dangCu = tuKhoa !== tuKhoaTre; // danh sách đang hiện kết quả của từ khoá cũ\n  return (\n    <>\n      <label className=\"o-tim\">\n        Tìm theo tên\n        <input type=\"search\" value={tuKhoa} onChange={(e) => setTuKhoa(e.target.value)} />\n      </label>\n      <div style={{ opacity: dangCu ? 0.6 : 1 }} aria-busy={dangCu}>\n        <DanhSach ds={ds} tuKhoa={tuKhoaTre} />\n      </div>\n    </>\n  );\n}",
  timChuyen: "export function TimChuyen({ ds }: { ds: BacSi[] }) {\n  const [tuKhoa, setTuKhoa] = useState('');\n  const [boLoc, setBoLoc] = useState('');\n  const [dangLoc, startTransition] = useTransition();\n  return (\n    <>\n      <label className=\"o-tim\">\n        Tìm theo tên\n        <input\n          type=\"search\"\n          value={tuKhoa}\n          onChange={(e) => {\n            setTuKhoa(e.target.value); // khẩn: ô gõ hiện chữ ngay\n            startTransition(() => setBoLoc(e.target.value)); // không khẩn: vẽ lại danh sách, bị ngắt được\n          }}\n        />\n      </label>\n      {dangLoc && <p role=\"status\">Đang lọc…</p>}\n      <DanhSach ds={ds} tuKhoa={boLoc} />\n    </>\n  );\n}",
  timChuyenSai: "export function TimChuyenSai({ ds }: { ds: BacSi[] }) {\n  const [tuKhoa, setTuKhoa] = useState('');\n  const [, startTransition] = useTransition();\n  return (\n    <>\n      <label className=\"o-tim\">\n        Tìm theo tên\n        <input type=\"search\" value={tuKhoa} onChange={(e) => startTransition(() => setTuKhoa(e.target.value))} />\n      </label>\n      <DanhSach ds={ds} tuKhoa={tuKhoa} />\n    </>\n  );\n}",
  danhSachMemo: "export const DanhSach = memo(function DanhSach({ ds, tuKhoa }: { ds: BacSi[]; tuKhoa: string }) {\n  const loc = locBacSi(ds, 'tat-ca', tuKhoa);\n  return (\n    <section aria-labelledby=\"tieu-de-bac-si\">\n      <h2 id=\"tieu-de-bac-si\">Đội ngũ bác sĩ ({loc.length})</h2>\n      <div className=\"luoi-bac-si\">\n        {loc.map((bs) => (\n          <TheNho key={bs.id} bs={bs} />\n        ))}\n      </div>\n    </section>\n  );\n});",
  rrSetState: "if (reactDomFlushSyncImpl && flushSync) reactDomFlushSyncImpl(() => setStateImpl(newState));\nelse if (useTransitions === false) setStateImpl(newState);\nelse React$1.startTransition(() => {\n  if (useTransitions === true) setOptimisticState((s) => getOptimisticRouterState(s, newState));\n  setStateImpl(newState);\n});\nreturn;",
  rrFlushSyncDoc: "  /** Wraps the initial state update for this navigation in a {@link https://react.dev/reference/react-dom/flushSync ReactDOM.flushSync} call instead of the default {@link https://react.dev/reference/react/startTransition React.startTransition} */\n  flushSync?: boolean;",
  oTimCu: "export function OTimBacSi({ tuKhoa, onDoi }: OTimBacSiProps) {\n  return (\n    <label className=\"o-tim\">\n      Tìm theo tên\n      <input\n        type=\"search\"\n        value={tuKhoa}\n        placeholder=\"vd: Lan, Huy…\"\n        onChange={(e) => onDoi(e.target.value)}\n      />\n    </label>\n  );\n}",
  khuCu: "<OTimBacSi tuKhoa={tuKhoa} onDoi={(q) => datBoLoc({ tuKhoa: q }, 'replace')} />",
  flushSyncThu: "  function datBoLoc(moi: Partial<BoLoc>, cach: 'push' | 'replace' = 'push', { khan = false } = {}) {\n    setSp(new URLSearchParams(taoSearch({ ...boLoc, ...moi })), { replace: cach === 'replace', flushSync: khan });\n  }",
  oTimMoi: "import { useState } from 'react';\nimport { useNavigationType } from 'react-router';\n\ninterface OTimBacSiProps {\n  tuKhoa: string; // từ khoá trên URL (?q=)\n  onDoi: (moi: string) => void;\n}\n\n/**\n * Chương 12: chữ trong ô là state RIÊNG của ô, cập nhật KHẨN (ngay trong lúc gõ). URL — và danh sách đọc từ URL —\n * đi sau trong một transition (React Router tự bọc mọi lần đổi URL trong startTransition). Trước đây ô lấy `value`\n * thẳng từ URL: URL đổi trong transition ⇒ React trả ô về chữ cũ ⇒ gõ nhanh trên 1000 bác sĩ MẤT CHỮ (đo thật, Bài 12.2).\n */\nexport function OTimBacSi({ tuKhoa, onDoi }: OTimBacSiProps) {\n  const [go, setGo] = useState(tuKhoa);\n  const loaiDieuHuong = useNavigationType(); // 'PUSH' | 'REPLACE' | 'POP'\n  // URL đổi mà KHÔNG phải do ô này (bấm menu, Back/Forward) ⇒ ô theo URL. Ô gõ luôn ghi URL bằng REPLACE.\n  // \"Điều chỉnh state khi prop đổi\" ngay trong lúc render (Bài 4.2), không dùng useEffect.\n  const [tuKhoaDaThay, setTuKhoaDaThay] = useState(tuKhoa);\n  if (tuKhoa !== tuKhoaDaThay) {\n    setTuKhoaDaThay(tuKhoa);\n    if (loaiDieuHuong !== 'REPLACE') setGo(tuKhoa);\n  }\n  return (\n    <div className=\"o-tim-boc\">\n      <label className=\"o-tim\">\n        Tìm theo tên\n        <input\n          type=\"search\"\n          value={go}\n          placeholder=\"vd: Lan, Huy…\"\n          onChange={(e) => {\n            setGo(e.target.value); // khẩn: chữ hiện ngay\n            onDoi(e.target.value); // không khẩn: URL + danh sách, trong transition của Router\n          }}\n        />\n      </label>\n      {go !== tuKhoa && (\n        <span className=\"dang-loc\" aria-hidden=\"true\">\n          Đang lọc…\n        </span>\n      )}\n    </div>\n  );\n}",
  test122: "test('12.2 — ô tìm hiện chữ NGAY dù URL chưa kịp đổi (onDoi không làm gì)', async () => {\n  const user = userEvent.setup();\n  renderVoiRouter(<OTimBacSi tuKhoa=\"\" onDoi={() => {}} />, '/bac-si');\n  await user.type(screen.getByLabelText('Tìm theo tên'), 'huy');\n  expect(screen.getByLabelText('Tìm theo tên')).toHaveValue('huy');\n});",
  test122c: "test('12.2 — URL đổi từ NGOÀI ô tìm (menu \"Bác sĩ\", rồi Back) ⇒ chữ trong ô theo URL', async () => {\n  const user = userEvent.setup();\n  const { router } = veTrang('/bac-si?q=huy');\n  expect(await screen.findByRole('heading', { name: 'Đội ngũ bác sĩ (1)' })).toBeInTheDocument();\n  expect(screen.getByLabelText('Tìm theo tên')).toHaveValue('huy');\n  await user.click(screen.getByRole('link', { name: 'Bác sĩ' })); // PUSH /bac-si — không còn ?q\n  expect(await screen.findByRole('heading', { name: 'Đội ngũ bác sĩ (6)' })).toBeInTheDocument();\n  expect(screen.getByLabelText('Tìm theo tên')).toHaveValue('');\n  await act(() => router.navigate(-1)); // Back (POP) về /bac-si?q=huy\n  expect(await screen.findByRole('heading', { name: 'Đội ngũ bác sĩ (1)' })).toBeInTheDocument();\n  expect(screen.getByLabelText('Tìm theo tên')).toHaveValue('huy');\n});",
  doGo: "      window.addEventListener('keydown', (e) => {\n        const muon = e.key === 'Backspace' ? o.value.slice(0, -1) : o.value + e.key; // chữ ô PHẢI hiện sau phím này\n        const rec = { phim: e.key, t0: performance.now(), chu: null, ds: null, tieuDe0: document.querySelector('#tieu-de-bac-si')?.textContent ?? '' };\n        window.__phim.push(rec);\n        const doi = () => {\n          const bay = performance.now();\n          if (rec.chu == null && o.value === muon) rec.chu = bay - rec.t0;\n          const td = document.querySelector('#tieu-de-bac-si')?.textContent ?? document.querySelector('.rong')?.textContent ?? '';\n          if (rec.ds == null && td !== rec.tieuDe0) rec.ds = bay - rec.t0;\n          if ((rec.chu == null || rec.ds == null) && bay - rec.t0 < 5000) requestAnimationFrame(doi);\n        };\n        requestAnimationFrame(doi);\n      }, true);",
  huyCu: "export function useHuyLichHen() {\n  const queryClient = useQueryClient();\n  return useMutation({\n    mutationFn: (lh: LichHenCoGio) => api.doiTrangThai(lh.id, 'da-huy'),\n    onMutate: async (lh) => {\n      await queryClient.cancelQueries({ queryKey: khoa.lichHen }); // chặn một lần tải đang bay về đè lên bản lạc quan\n      const truoc = queryClient.getQueryData<LichHenCoGio[]>(khoa.lichHen); // chụp lại để hoàn tác\n      queryClient.setQueryData<LichHenCoGio[]>(khoa.lichHen, (cu) =>\n        cu?.map((x) => (x.id === lh.id ? { ...x, trangThai: 'da-huy' } : x)),\n      );\n      return { truoc }; // → tham số thứ ba của onError/onSettled\n    },\n    onError: (_loi, _id, ketQua) => {\n      queryClient.setQueryData(khoa.lichHen, ketQua?.truoc); // hoàn tác\n    },\n    onSettled: (_kq, _loi, lh) =>\n      Promise.all([\n        queryClient.invalidateQueries({ queryKey: khoa.lichHen }),\n        queryClient.invalidateQueries({ queryKey: ['bac-si', lh.bacSiId, 'khung-gio'] }), // khung giờ mở lại\n      ]),\n    meta: { thongBaoLoi: 'Không huỷ được lịch hẹn — đã hoàn tác' },\n  });\n}",
  huyMoi: "export function useHuyLichHen() {\n  const queryClient = useQueryClient();\n  return useMutation({\n    mutationFn: (lh: LichHenCoGio) => api.doiTrangThai(lh.id, 'da-huy'),\n    onSettled: (_kq, _loi, lh) =>\n      Promise.all([\n        queryClient.invalidateQueries({ queryKey: khoa.lichHen }), // mutateAsync CHỜ cả việc tải lại này xong\n        queryClient.invalidateQueries({ queryKey: ['bac-si', lh.bacSiId, 'khung-gio'] }), // khung giờ mở lại\n      ]),\n    meta: { thongBaoLoi: 'Không huỷ được lịch hẹn — đã hoàn tác' },\n  });\n}",
  danhSachLichHen: "export function DanhSachLichHen({ tenBacSi }: DanhSachLichHenProps) {\n  const { data: lichHen, isPending, error, refetch, isFetching } = useLichHen();\n  const huy = useHuyLichHen();\n  // Chương 12: bản \"lạc quan\" của danh sách. Ngoài Action: y hệt lichHen. Trong Action: lichHen + các lần danhDauHuy.\n  // Action kết thúc (được hay lỗi) ⇒ React bỏ bản lạc quan, quay về lichHen — lúc đó đã là dữ liệu thật mới tải lại.\n  const [lichHienThi, danhDauHuy] = useOptimistic(lichHen, (ds, id: string) =>\n    ds?.map((x) => (x.id === id ? { ...x, trangThai: 'da-huy' as const } : x)),\n  );\n  const [dangLuu, startTransition] = useTransition();\n\n  function huyLich(lh: LichHenCoGio) {\n    startTransition(async () => {\n      danhDauHuy(lh.id); // màn hình: \"Đã huỷ\" NGAY\n      try {\n        await huy.mutateAsync(lh); // chờ PATCH + tải lại danh sách (onSettled)\n      } catch {\n        // lỗi đã được MutationCache báo bằng thông báo nổi; KHÔNG ném tiếp — lỗi thoát khỏi Action là sập tới error boundary\n      }\n    });\n  }\n\n  return (\n    <section className=\"lich-hen\" aria-label=\"Lịch hẹn của tôi\">\n      <h2>Lịch hẹn của tôi {lichHen && `(${lichHen.length})`}</h2>\n      {dangLuu && <p role=\"status\">Đang lưu…</p>}\n      …",
  nutHuy: "              {lh.trangThai === 'cho-xac-nhan' && (\n                <button type=\"button\" className=\"nut nut-nho\" onClick={() => huyLich(lh)} aria-label={`Huỷ lịch ${lh.id}`}>\n                  Huỷ\n                </button>\n              )}",
  guiGopY: "const TRONG: GiaTriForm = { hoTen: '', soSao: '5', noiDung: '' };\nconst BAN_DAU: TrangThaiGopY = { ketQua: 'chua-gui', giaTri: TRONG };\n\n/**\n * Chương 12: ACTION của form. React gọi nó với (state lần trước, FormData của form); cái nó TRẢ VỀ là state mới.\n * Hàm async: trong lúc chờ, useFormStatus().pending = true. Không cần useState cho từng ô, không cần onSubmit,\n * không cần e.preventDefault().\n */\nexport async function guiGopY(_truoc: TrangThaiGopY, formData: FormData): Promise<TrangThaiGopY> {\n  const giaTri: GiaTriForm = {\n    hoTen: String(formData.get('hoTen') ?? '').trim(),\n    soSao: String(formData.get('soSao') ?? '5'),\n    noiDung: String(formData.get('noiDung') ?? '').trim(),\n  };\n  if (giaTri.noiDung.length < 10) return { ketQua: 'loi-nhap', loiNoiDung: 'Viết ít nhất 10 ký tự.', giaTri };\n  if (giaTri.noiDung.length > 500) return { ketQua: 'loi-nhap', loiNoiDung: 'Tối đa 500 ký tự.', giaTri };\n  try {\n    const { id } = await api.guiGopY({ hoTen: giaTri.hoTen, soSao: Number(giaTri.soSao), noiDung: giaTri.noiDung });\n    return { ketQua: 'da-gui', maGopY: id, giaTri: TRONG };\n  } catch (loi) {\n    // TRẢ lỗi về làm state — đừng ném: lỗi ném ra khỏi Action sẽ bay tới error boundary gần nhất\n    return { ketQua: 'loi-may-chu', loiMayChu: loi instanceof Error ? loi.message : 'Không gửi được góp ý', giaTri };\n  }\n}",
  nutGui: "function NutGui() {\n  const { pending } = useFormStatus();\n  return (\n    <button type=\"submit\" className=\"nut nut-chinh\" disabled={pending}>\n      {pending ? 'Đang gửi…' : 'Gửi góp ý'}\n    </button>\n  );\n}",
  formGopY: "export function FormGopY() {\n  const [trangThai, formAction] = useActionState(guiGopY, BAN_DAU);\n  const { giaTri } = trangThai;\n  return (\n    <section className=\"gop-y\" aria-labelledby=\"tieu-de-gop-y\">\n      <h2 id=\"tieu-de-gop-y\">Góp ý sau khi khám</h2>\n      {/* React 19 tự RESET form (ô không điều khiển) sau mỗi lần Action chạy xong — kể cả khi có lỗi.\n          defaultValue lấy từ state ⇒ reset xong ô vẫn hiện đúng chữ vừa gõ; gửi được thì state trả về ô trống. */}\n      <form action={formAction} noValidate>\n        <fieldset className=\"chip-hang chon-ngay\">\n          <legend>Bạn chấm mấy sao?</legend>\n          {[1, 2, 3, 4, 5].map((n) => (\n            <label key={n} className=\"chip\">\n              <input type=\"radio\" name=\"soSao\" value={n} defaultChecked={giaTri.soSao === String(n)} aria-label={`${n} sao`} />\n              {'★'.repeat(n)}\n            </label>\n          ))}\n        </fieldset>\n        <label className=\"o-nhap\">\n          Họ tên (không bắt buộc)\n          <input name=\"hoTen\" defaultValue={giaTri.hoTen} autoComplete=\"name\" />\n        </label>\n        <label className=\"o-nhap\">\n          Góp ý của bạn\n          <textarea\n            name=\"noiDung\"\n            rows={4}\n            defaultValue={giaTri.noiDung}\n            aria-invalid={trangThai.loiNoiDung ? true : undefined}\n            aria-describedby={trangThai.loiNoiDung ? 'loi-noi-dung' : undefined}\n          />\n        </label>\n        {trangThai.loiNoiDung && (\n          <p id=\"loi-noi-dung\" className=\"loi\">\n            {trangThai.loiNoiDung}\n          </p>\n        )}\n        {trangThai.ketQua === 'loi-may-chu' && (\n          <p className=\"hop-loi\" role=\"alert\">\n            {trangThai.loiMayChu}\n          </p>\n        )}\n        {trangThai.ketQua === 'da-gui' && (\n          <p className=\"gui-xong\" role=\"status\">\n            Cảm ơn bạn! Phòng khám đã nhận góp ý (mã {trangThai.maGopY}).\n          </p>\n        )}\n        <NutGui />\n      </form>\n    </section>\n  );\n}",
  apiGopY: "/** Chương 12: một góp ý sau khi khám (POST /api/gop-y). hoTen để trống = góp ý ẩn danh. */\nexport interface GopY {\n  hoTen: string;\n  soSao: number; // 1–5\n  noiDung: string; // 10–500 ký tự\n}\n\n// trong object api:\n  guiGopY: (gopY: GopY) =>\n    goiApi<{ id: string }>('/api/gop-y', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify(gopY),\n    }),",
  mswGopY: "  // Chương 12: góp ý. Máy chủ kiểm LẠI (form ở trình duyệt kiểm rồi vẫn phải kiểm — ai cũng gọi thẳng API được).\n  http.post('/api/gop-y', async ({ request }) => {\n    await treMang();\n    if (dieuKhien.loi.has('gop-y')) return loi500();\n    const { soSao, noiDung } = (await request.json()) as GopY;\n    const doDai = String(noiDung ?? '').trim().length;\n    if (!(soSao >= 1 && soSao <= 5) || doDai < 10 || doDai > 500) {\n      return HttpResponse.json({ loi: 'Góp ý không hợp lệ' }, { status: 400 });\n    }\n    return HttpResponse.json({ id: `gy-${++soGopY}` }, { status: 201 });\n  }),",
  formMatChu: "export function FormMatChu() {\n  const [trangThai, formAction, dangGui] = useActionState(guiGopY, BAN_DAU);\n  return (\n    <form action={formAction}>\n      <label>\n        Góp ý của bạn\n        <textarea name=\"noiDung\" /> {/* không defaultValue từ state */}\n      </label>\n      {trangThai.loiNoiDung && <p>{trangThai.loiNoiDung}</p>}\n      <button type=\"submit\" disabled={dangGui}>\n        Gửi góp ý\n      </button>\n    </form>\n  );\n}",
  formKieuCu: "export function FormKieuCu() {\n  const [noiDung, setNoiDung] = useState('');\n  const [loi, setLoi] = useState<string | null>(null);\n  const [dangGui, setDangGui] = useState(false);\n  const [xong, setXong] = useState(false);\n  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {\n    e.preventDefault(); // quên dòng này ⇒ trình duyệt tải lại trang\n    setDangGui(true);\n    const kq = await guiGopY(BAN_DAU, new FormData(e.currentTarget));\n    setDangGui(false);\n    setLoi(kq.loiNoiDung ?? kq.loiMayChu ?? null);\n    if (kq.ketQua === 'da-gui') {\n      setXong(true);\n      setNoiDung('');\n    }\n  }\n  return (\n    <form onSubmit={onSubmit}>\n      <label>\n        Góp ý của bạn\n        <textarea name=\"noiDung\" value={noiDung} onChange={(e) => setNoiDung(e.target.value)} />\n      </label>\n      {loi && <p>{loi}</p>}\n      {xong && <p>Cảm ơn bạn!</p>}\n      <button type=\"submit\" disabled={dangGui}>\n        Gửi góp ý\n      </button>\n    </form>\n  );\n}",
  lacQuanSai: "export function TimLacQuanSai() {\n  const [thich, setThich] = useState(false);\n  const [thichHienThi, datThich] = useOptimistic(thich);\n  return (\n    <button type=\"button\" aria-pressed={thichHienThi} onClick={() => { datThich(true); setThich(true); }}>\n      ♡\n    </button>\n  );\n}",
  nemLoi: "export function NutNemLoi() {\n  const [, startTransition] = useTransition();\n  return (\n    <button\n      type=\"button\"\n      onClick={() =>\n        startTransition(async () => {\n          await Promise.resolve();\n          throw new Error('Không huỷ được lịch hẹn');\n        })\n      }\n    >\n      Huỷ\n    </button>\n  );\n}",
  formNutSai: "export function FormNutSai() {\n  const { pending } = useFormStatus(); // đọc trạng thái của form CHA — ở đây không có form cha nào\n  const [, formAction] = useActionState(async () => {\n    await new Promise((r) => setTimeout(r, 200));\n    return null;\n  }, null);\n  return (\n    <form action={formAction}>\n      <button type=\"submit\" disabled={pending}>\n        {pending ? 'Đang gửi…' : 'Gửi góp ý'}\n      </button>\n    </form>\n  );\n}",
  test123a: "test('12.3 — bấm Huỷ ⇒ \"Đã huỷ\" + \"Đang lưu…\" NGAY, trước khi máy chủ trả lời; máy chủ xong ⇒ hết \"Đang lưu…\"', async () => {\n  server.use(http.patch('/api/lich-hen/:id', async () => { await delay(300); return HttpResponse.json({ ...db.suaLichHen('lh-1', { trangThai: 'da-huy' }) }); }));\n  const dong = await veVaBamHuy();\n  expect(dong).toHaveTextContent('Đã huỷ'); // lạc quan: chưa có trả lời nào từ máy chủ\n  expect(screen.getByText('Đang lưu…')).toBeInTheDocument();\n  await waitFor(() => expect(screen.queryByText('Đang lưu…')).not.toBeInTheDocument());\n  expect(dong).toHaveTextContent('Đã huỷ'); // dữ liệu THẬT (tải lại sau khi huỷ) cũng là \"Đã huỷ\" — không nháy về\n});",
  test123b: "test('12.3 — nội dung quá ngắn ⇒ lỗi ngay dưới ô, KHÔNG gọi API, chữ đã gõ còn nguyên', async () => {\n  const user = userEvent.setup();\n  let soLanGoi = 0;\n  server.events.on('request:start', ({ request }) => { if (request.url.endsWith('/api/gop-y')) soLanGoi++; });\n  renderVoiQuery(<FormGopY />);\n  await user.type(screen.getByLabelText('Góp ý của bạn'), 'Tốt');\n  await user.click(screen.getByRole('button', { name: 'Gửi góp ý' }));\n  expect(await screen.findByText('Viết ít nhất 10 ký tự.')).toBeInTheDocument();\n  expect(screen.getByLabelText('Góp ý của bạn')).toHaveValue('Tốt'); // React 19 tự reset form sau action — phải giữ lại\n  expect(screen.getByLabelText('Góp ý của bạn')).toHaveAttribute('aria-invalid', 'true');\n  expect(soLanGoi).toBe(0);\n  server.events.removeAllListeners();\n});",
  viteConfig: "/// <reference types=\"vitest/config\" />\nimport babel from '@rolldown/plugin-babel'\nimport react, { reactCompilerPreset } from '@vitejs/plugin-react'\nimport { defineConfig } from 'vite'\n\n// https://vite.dev/config/\nexport default defineConfig(({ mode }) => ({\n  plugins: [\n    react(),\n    // Chương 12: React Compiler 1.0 cho CẢ app (dev, build, Vitest). Cần @babel/core 7 — bản 8 làm compiler âm thầm\n    // bỏ qua component có prop mặc định (Bài 8.2). src/app/compiler.test.ts canh để không component nào bị bỏ qua.\n    babel({ presets: [reactCompilerPreset()] }),\n  ],\n  resolve: {\n    // Chương 7: đọc \"paths\" của tsconfig ⇒ \"@/…\" chạy ở dev server VÀ Vitest (build thì Rolldown tự đọc).\n    tsconfigPaths: true,\n    // Chương 8: `vite build --mode profiling` ⇒ dùng bản react-dom CÓ BẬT đo, để <Profiler> vẫn báo số trên bản build.\n    alias: mode === 'profiling' ? [{ find: /^react-dom\\/client$/, replacement: 'react-dom/profiling' }] : [],\n  },\n  test: {\n    environment: 'jsdom',\n    setupFiles: ['./src/test/setup.ts'],\n  },\n}))",
  compilerTest: "/// <reference types=\"node\" />\nimport { transformSync } from '@babel/core';\nimport { readdirSync, readFileSync } from 'node:fs';\nimport { expect, test } from 'vitest';\n\n/**\n * Tiêu chí đạt 🛠 Chương 12 — bước 4/4: React Compiler BẬT cho cả app, và KHÔNG âm thầm bỏ qua component nào.\n * Compiler gặp chỗ không hiểu thì để nguyên component đó, không báo gì lúc build (Bài 8.2) ⇒ test này hỏi thẳng logger.\n */\nconst cacFile = readdirSync('src', { recursive: true, encoding: 'utf8' })\n  .filter((f) => /\\.tsx$/.test(f) && !/\\.test\\.tsx$/.test(f) && !f.startsWith('vi-du') && !f.startsWith('test'))\n  .map((f) => `src/${f}`);\n\ntest('12.4 — vite.config.ts bật React Compiler (reactCompilerPreset qua @rolldown/plugin-babel)', () => {\n  expect(readFileSync('vite.config.ts', 'utf8')).toMatch(/reactCompilerPreset\\(\\)/);\n});\n\ntest('12.4 — mọi component .tsx trong src/ đều được compiler biên dịch', () => {\n  const daBienDich: string[] = [];\n  const boQua: string[] = [];\n  for (const f of cacFile) {\n    transformSync(readFileSync(f, 'utf8'), {\n      filename: f, babelrc: false, configFile: false,\n      parserOpts: { plugins: ['typescript', 'jsx'] },\n      plugins: [['babel-plugin-react-compiler', { logger: { logEvent: (_: string, e: { kind: string; fnName?: string; detail?: { reason?: string; options?: { reason?: string } } }) => {\n        if (e.kind === 'CompileSuccess') daBienDich.push(`${f} · ${e.fnName}`);\n        else if (e.kind === 'CompileError' || e.kind === 'CompileSkip' || e.kind === 'PipelineError') boQua.push(`${f} · ${e.kind}: ${e.detail?.reason ?? e.detail?.options?.reason ?? ''}`);\n      } } }]],\n    });\n  }\n  expect(boQua).toEqual([]);\n  expect(daBienDich.length).toBeGreaterThanOrEqual(32);\n});",
  bai4: "'use client'; // chỉ thị của Server Components — Vite (không có RSC) coi đây là một chuỗi, không làm gì\nimport { api } from '@/shared/api/phong-kham';\n\n/** Viết \"kiểu Server Component\" (async + await ngay trong component) — nhưng đây là app Vite, chạy ở TRÌNH DUYỆT. */\nexport async function HoSoKieuServer({ id }: { id: string }) {\n  const bacSi = await api.bacSi(id);\n  return <h2>{bacSi.ten}</h2>;\n}",
};

/* ─── Output THẬT (Vitest, vite build, Chromium qua Playwright) — chép nguyên văn ─── */
const OUT = {
  chiTietTruoc: "[trước · Ch8 (useQuery, return sớm)] Chromium 149.0.7827.55 · API chậm 800 ms · trung vị 3 lần · tính từ lúc bấm \"Xem chi tiết\"\n  thấy hồ sơ bác sĩ: 881 ms · thấy giờ khám: 1689 ms\n  request (lần cuối, tính từ request đầu): bac-si/bs-2 0→807 ms · bac-si/bs-2/khung-gio 810→1617 ms",
  chiTietSau: "[sau · use() + Suspense] Chromium 149.0.7827.55 · API chậm 800 ms · trung vị 3 lần · tính từ lúc bấm \"Xem chi tiết\"\n  thấy hồ sơ bác sĩ: 856 ms · thấy giờ khám: 884 ms\n  request (lần cuối, tính từ request đầu): bac-si/bs-2 0→811 ms · bac-si/bs-2/khung-gio 7→863 ms",
  bai1: "[HoSoSai (promise tạo trong component)] sau 500 ms: vẫn \"Đang tải…\" · 66 request /api/bac-si/bs-2 · console.error: 0\n[HoSoDung (kho promise ngoài component)] sau 500 ms: thấy hồ sơ · 1 request /api/bac-si/bs-2 · console.error: 0\n[HoSoTanStack (useSuspenseQuery)] sau 500 ms: thấy hồ sơ · 1 request /api/bac-si/bs-2 · console.error: 0\n[veTrang (render thường)] sau 1,5 giây: vẫn \"Đang tải thông tin bác sĩ…\" · ô giờ khám: 0\n  console.error: A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n[veTrangCho (await act)] sau 1,5 giây: thấy hồ sơ · ô giờ khám: 4\n      Tests  6 passed (6)",
  bai1Compiler: "[HoSoSai (promise tạo trong component)] sau 500 ms: vẫn \"Đang tải…\" · 72 request /api/bac-si/bs-2 · console.error: 0\n[HoSoDung (kho promise ngoài component)] sau 500 ms: thấy hồ sơ · 1 request /api/bac-si/bs-2 · console.error: 0\n[HoSoTanStack (useSuspenseQuery)] sau 500 ms: thấy hồ sơ · 1 request /api/bac-si/bs-2 · console.error: 0",
  tieuChi121Truoc: "   × 12.1 — hồ sơ và giờ khám tải song song: giờ khám bắt đầu TRƯỚC khi hồ sơ về 345ms\n   × 12.1 — hồ sơ đang tải: khung xương hồ sơ (aria-busy) và lưới giờ khám cùng có mặt 21ms\n   × 12.1 — API hồ sơ lỗi 500 ⇒ hộp lỗi; \"Tải lại phần này\" ⇒ promise MỚI ⇒ hiện hồ sơ 25ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯\nAssertionError: expected 2 to be less than 1\nTestingLibraryElementError: Unable to find an accessible element with the role \"region\" and name \"Đang tải hồ sơ bác sĩ\"\nTestingLibraryElementError: Unable to find an accessible element with the role \"button\" and name \"Tải lại phần này\"\n      Tests  3 failed (3)",
  tieuChi121Sau: " Test Files  1 passed (1)\n      Tests  3 passed (3)",
  goTruocNguyen: "[trước · Ch8 (value từ URL)] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ · gõ nguyen cách 30 ms · trung vị 5 lần\n  phím \"n\": chữ hiện sau   93 ms · danh sách đổi sau   93 ms · Event Timing   24 ms\n  phím \"g\": chữ hiện sau   73 ms · danh sách đổi sau   53 ms · Event Timing   16 ms\n  phím \"u\": chữ hiện sau   37 ms · danh sách đổi sau   37 ms · Event Timing   24 ms\n  phím \"y\": chữ hiện sau   16 ms · danh sách đổi sau    4 ms · Event Timing    0 ms\n  phím \"e\": chữ hiện sau   16 ms · danh sách đổi sau    7 ms · Event Timing    0 ms\n  phím \"n\": chữ hiện sau   18 ms · danh sách đổi sau    4 ms · Event Timing    0 ms\n  ô tìm cuối cùng (5 lần): \"nuyen\" \"nuyen\" \"nuyen\" \"nguyen\" \"nuyen\" · thẻ còn lại: 0",
  goTruocXoa: "[trước · Ch8 (value từ URL)] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ · gõ huy⌫⌫⌫ cách 60 ms · trung vị 5 lần\n  phím \"h\": chữ hiện sau  101 ms · danh sách đổi sau  101 ms · Event Timing   24 ms\n  phím \"u\": chữ hiện sau   58 ms · danh sách đổi sau   58 ms · Event Timing   32 ms\n  phím \"y\": chữ hiện sau   24 ms · danh sách đổi sau   24 ms · Event Timing    0 ms\n  phím \"⌫\": chữ hiện sau   50 ms · danh sách đổi sau   50 ms · Event Timing    0 ms\n  phím \"⌫\": chữ hiện sau  138 ms · danh sách đổi sau  138 ms · Event Timing    0 ms\n  phím \"⌫\": chữ hiện sau  123 ms · danh sách đổi sau  123 ms · Event Timing   40 ms\n  ô tìm cuối cùng (5 lần): \"\" \"\" \"\" \"\" \"\" · thẻ còn lại: 1000",
  goFlushNguyen: "[thử · flushSync] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ · gõ nguyen cách 30 ms · trung vị 5 lần\n  phím \"n\": chữ hiện sau   79 ms · danh sách đổi sau   79 ms · Event Timing  104 ms\n  phím \"g\": chữ hiện sau   40 ms · danh sách đổi sau   40 ms · Event Timing   56 ms\n  phím \"u\": chữ hiện sau   23 ms · danh sách đổi sau   23 ms · Event Timing   32 ms\n  phím \"y\": chữ hiện sau   12 ms · danh sách đổi sau    — ms · Event Timing   16 ms\n  phím \"e\": chữ hiện sau   11 ms · danh sách đổi sau    — ms · Event Timing   16 ms\n  phím \"n\": chữ hiện sau   11 ms · danh sách đổi sau    — ms · Event Timing   16 ms\n  ô tìm cuối cùng (5 lần): \"nguyen\" \"nguyen\" \"nguyen\" \"nguyen\" \"nguyen\" · thẻ còn lại: 101",
  goFlushXoa: "[thử · flushSync] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ · gõ huy⌫⌫⌫ cách 60 ms · trung vị 5 lần\n  phím \"h\": chữ hiện sau   64 ms · danh sách đổi sau   64 ms · Event Timing   88 ms\n  phím \"u\": chữ hiện sau   41 ms · danh sách đổi sau   41 ms · Event Timing   56 ms\n  phím \"y\": chữ hiện sau   20 ms · danh sách đổi sau   20 ms · Event Timing   32 ms\n  phím \"⌫\": chữ hiện sau   43 ms · danh sách đổi sau   43 ms · Event Timing   56 ms\n  phím \"⌫\": chữ hiện sau  122 ms · danh sách đổi sau  122 ms · Event Timing  152 ms\n  phím \"⌫\": chữ hiện sau   81 ms · danh sách đổi sau   81 ms · Event Timing  112 ms\n  ô tìm cuối cùng (5 lần): \"\" \"\" \"\" \"\" \"\" · thẻ còn lại: 1000",
  goSauNguyen: "[sau · ô tìm có state riêng] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ · gõ nguyen cách 30 ms · trung vị 5 lần\n  phím \"n\": chữ hiện sau   15 ms · danh sách đổi sau  123 ms · Event Timing   32 ms\n  phím \"g\": chữ hiện sau    7 ms · danh sách đổi sau   67 ms · Event Timing   16 ms\n  phím \"u\": chữ hiện sau   12 ms · danh sách đổi sau   45 ms · Event Timing   40 ms\n  phím \"y\": chữ hiện sau    5 ms · danh sách đổi sau    — ms · Event Timing    0 ms\n  phím \"e\": chữ hiện sau    4 ms · danh sách đổi sau    — ms · Event Timing    0 ms\n  phím \"n\": chữ hiện sau    5 ms · danh sách đổi sau    — ms · Event Timing    0 ms\n  ô tìm cuối cùng (5 lần): \"nguyen\" \"nguyen\" \"nguyen\" \"nguyen\" \"nguyen\" · thẻ còn lại: 101",
  goSauXoa: "[sau · ô tìm có state riêng] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ · gõ huy⌫⌫⌫ cách 60 ms · trung vị 5 lần\n  phím \"h\": chữ hiện sau   15 ms · danh sách đổi sau  105 ms · Event Timing   32 ms\n  phím \"u\": chữ hiện sau   12 ms · danh sách đổi sau   59 ms · Event Timing   40 ms\n  phím \"y\": chữ hiện sau    5 ms · danh sách đổi sau   25 ms · Event Timing    0 ms\n  phím \"⌫\": chữ hiện sau    5 ms · danh sách đổi sau   56 ms · Event Timing    0 ms\n  phím \"⌫\": chữ hiện sau    5 ms · danh sách đổi sau  145 ms · Event Timing    0 ms\n  phím \"⌫\": chữ hiện sau    8 ms · danh sách đổi sau  122 ms · Event Timing   40 ms\n  ô tìm cuối cùng (5 lần): \"\" \"\" \"\" \"\" \"\" · thẻ còn lại: 1000",
  goCuoi: "[cuối Ch12 · compiler bật] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ · gõ nguyen cách 30 ms · trung vị 5 lần\n  phím \"n\": chữ hiện sau   15 ms · danh sách đổi sau  127 ms · Event Timing   32 ms\n  phím \"g\": chữ hiện sau    7 ms · danh sách đổi sau   69 ms · Event Timing   16 ms\n  phím \"u\": chữ hiện sau   12 ms · danh sách đổi sau   51 ms · Event Timing   40 ms\n  phím \"y\": chữ hiện sau    8 ms · danh sách đổi sau    — ms · Event Timing   16 ms\n  phím \"e\": chữ hiện sau    6 ms · danh sách đổi sau    — ms · Event Timing    0 ms\n  phím \"n\": chữ hiện sau    5 ms · danh sách đổi sau    — ms · Event Timing    0 ms\n  ô tìm cuối cùng (5 lần): \"nguyen\" \"nguyen\" \"nguyen\" \"nguyen\" \"nguyen\" · thẻ còn lại: 101",
  bai2Thuong: "[bai2 · thuong] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ · gõ huy⌫⌫⌫ cách 60 ms · trung vị 5 lần\n  phím \"h\": chữ hiện sau   33 ms · danh sách đổi sau   33 ms · Event Timing   56 ms\n  phím \"u\": chữ hiện sau   17 ms · danh sách đổi sau   17 ms · Event Timing   32 ms\n  phím \"y\": chữ hiện sau    9 ms · danh sách đổi sau    9 ms · Event Timing   16 ms\n  phím \"⌫\": chữ hiện sau   21 ms · danh sách đổi sau   21 ms · Event Timing   32 ms\n  phím \"⌫\": chữ hiện sau   49 ms · danh sách đổi sau   49 ms · Event Timing   64 ms\n  phím \"⌫\": chữ hiện sau   32 ms · danh sách đổi sau   32 ms · Event Timing   48 ms\n  ô tìm cuối cùng (5 lần): \"\" \"\" \"\" \"\" \"\" · thẻ còn lại: 1000",
  bai2Tre: "[bai2 · tre] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ · gõ huy⌫⌫⌫ cách 60 ms · trung vị 5 lần\n  phím \"h\": chữ hiện sau    8 ms · danh sách đổi sau   44 ms · Event Timing   24 ms\n  phím \"u\": chữ hiện sau    3 ms · danh sách đổi sau   25 ms · Event Timing   16 ms\n  phím \"y\": chữ hiện sau    2 ms · danh sách đổi sau   16 ms · Event Timing    0 ms\n  phím \"⌫\": chữ hiện sau    3 ms · danh sách đổi sau   31 ms · Event Timing    0 ms\n  phím \"⌫\": chữ hiện sau    3 ms · danh sách đổi sau   59 ms · Event Timing    0 ms\n  phím \"⌫\": chữ hiện sau    4 ms · danh sách đổi sau   58 ms · Event Timing   16 ms\n  ô tìm cuối cùng (5 lần): \"\" \"\" \"\" \"\" \"\" · thẻ còn lại: 1000",
  bai2Chuyen: "[bai2 · chuyen] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ · gõ huy⌫⌫⌫ cách 60 ms · trung vị 5 lần\n  phím \"h\": chữ hiện sau    9 ms · danh sách đổi sau   47 ms · Event Timing   32 ms\n  phím \"u\": chữ hiện sau    3 ms · danh sách đổi sau   29 ms · Event Timing   16 ms\n  phím \"y\": chữ hiện sau    3 ms · danh sách đổi sau   18 ms · Event Timing   16 ms\n  phím \"⌫\": chữ hiện sau    3 ms · danh sách đổi sau   29 ms · Event Timing    0 ms\n  phím \"⌫\": chữ hiện sau    3 ms · danh sách đổi sau   60 ms · Event Timing   16 ms\n  phím \"⌫\": chữ hiện sau    4 ms · danh sách đổi sau   60 ms · Event Timing   24 ms\n  ô tìm cuối cùng (5 lần): \"\" \"\" \"\" \"\" \"\" · thẻ còn lại: 1000",
  bai2ChuyenSai: "[bai2 · chuyen-sai] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ · gõ huy⌫⌫⌫ cách 60 ms · trung vị 5 lần\n  phím \"h\": chữ hiện sau   39 ms · danh sách đổi sau   39 ms · Event Timing   16 ms\n  phím \"u\": chữ hiện sau   22 ms · danh sách đổi sau   22 ms · Event Timing    0 ms\n  phím \"y\": chữ hiện sau   18 ms · danh sách đổi sau   18 ms · Event Timing    0 ms\n  phím \"⌫\": chữ hiện sau   28 ms · danh sách đổi sau   28 ms · Event Timing    0 ms\n  phím \"⌫\": chữ hiện sau   58 ms · danh sách đổi sau   58 ms · Event Timing    0 ms\n  phím \"⌫\": chữ hiện sau   53 ms · danh sách đổi sau   53 ms · Event Timing   16 ms\n  ô tìm cuối cùng (5 lần): \"\" \"\" \"\" \"\" \"\" · thẻ còn lại: 1000",
  bai2SaiNhanh: "[bai2 · chuyen-sai · gõ liền] Chromium 149.0.7827.55 · CPU chậm 6× · 1000 bác sĩ · gõ nguyen cách 10 ms · trung vị 5 lần\n  phím \"n\": chữ hiện sau   65 ms · danh sách đổi sau   65 ms · Event Timing   32 ms\n  phím \"g\": chữ hiện sau    — ms · danh sách đổi sau   60 ms · Event Timing   48 ms\n  phím \"u\": chữ hiện sau   35 ms · danh sách đổi sau   35 ms · Event Timing   24 ms\n  phím \"y\": chữ hiện sau   19 ms · danh sách đổi sau   58 ms · Event Timing   16 ms\n  phím \"e\": chữ hiện sau   14 ms · danh sách đổi sau   41 ms · Event Timing   16 ms\n  phím \"n\": chữ hiện sau   16 ms · danh sách đổi sau   34 ms · Event Timing    0 ms\n  ô tìm cuối cùng (5 lần): \"nuyen\" \"nuyen\" \"nuyen\" \"en\" \"nuyen\" · thẻ còn lại: 0",
  bai2ThuongNhanh: "  ô tìm cuối cùng (5 lần): \"nguyen\" \"nguyen\" \"nguyen\" \"nguyen\" \"nguyen\" · thẻ còn lại: 101",
  bai2TreNhanh: "  ô tìm cuối cùng (5 lần): \"nguyen\" \"nguyen\" \"nguyen\" \"nguyen\" \"nguyen\" · thẻ còn lại: 101",
  tieuChi122Truoc: " × 12.2 — ô tìm hiện chữ NGAY dù URL chưa kịp đổi (onDoi không làm gì) 95ms\n ✓ 12.2 — gõ \"vy\" ⇒ URL ?q=vy (REPLACE) và danh sách lọc theo\n ✓ 12.2 — URL đổi từ NGOÀI ô tìm (menu \"Bác sĩ\", rồi Back) ⇒ chữ trong ô theo URL\nExpected the element to have value:\n  huy\nReceived:\n\n      Tests  1 failed | 2 passed (3)",
  bai3: "[FormMatChu (không defaultValue)] sau lỗi \"Viết ít nhất 10 ký tự.\": ô góp ý = \"\"\n[FormGopY (defaultValue từ state)] sau lỗi \"Viết ít nhất 10 ký tự.\": ô góp ý = \"Tốt\"\n[FormKieuCu (value + onSubmit)] sau lỗi \"Viết ít nhất 10 ký tự.\": ô góp ý = \"Tốt\"\n[useOptimistic ngoài transition] console.error: An optimistic state update occurred outside a transition or action. To fix, move the update to an action, or wrap with startTransition.\n[Action ném lỗi] màn hình: Phần này gặp sự cố.Không huỷ được lịch hẹnTải lại phần này\n[useFormStatus ở component vẽ form] ngay sau khi bấm: \"Gửi góp ý\" · sau 300 ms: \"Gửi góp ý\"\n      Tests  6 passed (6)",
  tieuChi123Truoc: " × gop-y/FormGopY.test.tsx > 12.3 — nội dung quá ngắn ⇒ lỗi ngay dưới ô, KHÔNG gọi API, chữ đã gõ còn nguyên 19ms\n × gop-y/FormGopY.test.tsx > 12.3 — gửi hợp lệ ⇒ nút \"Đang gửi…\" bị khoá trong lúc chờ ⇒ cảm ơn, form trống lại 50ms\n × gop-y/FormGopY.test.tsx > 12.3 — máy chủ lỗi ⇒ báo lỗi, chữ còn nguyên để gửi lại 2ms\n × lich-hen/DanhSachLichHen.test.tsx > 12.3 — bấm Huỷ ⇒ \"Đã huỷ\" + \"Đang lưu…\" NGAY, trước khi máy chủ trả lời; máy chủ xong ⇒ hết \"Đang lưu…\" 123ms\n ✓ lich-hen/DanhSachLichHen.test.tsx > 12.3 — máy chủ lỗi 500 ⇒ tự quay về \"Chờ xác nhận\", báo \"đã hoàn tác\", trang KHÔNG sập 138ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯\n      Tests  4 failed | 1 passed (5)",
  tieuChi123Sau: " ✓ gop-y/FormGopY.test.tsx > 12.3 — nội dung quá ngắn ⇒ lỗi ngay dưới ô, KHÔNG gọi API, chữ đã gõ còn nguyên 124ms\n ✓ lich-hen/DanhSachLichHen.test.tsx > 12.3 — bấm Huỷ ⇒ \"Đã huỷ\" + \"Đang lưu…\" NGAY, trước khi máy chủ trả lời; máy chủ xong ⇒ hết \"Đang lưu…\" 446ms\n ✓ gop-y/FormGopY.test.tsx > 12.3 — gửi hợp lệ ⇒ nút \"Đang gửi…\" bị khoá trong lúc chờ ⇒ cảm ơn, form trống lại 340ms\n ✓ gop-y/FormGopY.test.tsx > 12.3 — máy chủ lỗi ⇒ báo lỗi, chữ còn nguyên để gửi lại 91ms\n ✓ lich-hen/DanhSachLichHen.test.tsx > 12.3 — máy chủ lỗi 500 ⇒ tự quay về \"Chờ xác nhận\", báo \"đã hoàn tác\", trang KHÔNG sập 151ms\n      Tests  5 passed (5)",
  bai4: "[async component, client] sau 500 ms: màn hình: \"Đang tải…\" · 68 request\n  console.error: <HoSoKieuServer> is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.\n      Tests  1 passed (1)",
  compilerCaApp: "app/Footer.tsx · Footer: ĐÃ biên dịch (1 ô nhớ)\napp/Header.tsx · Header: ĐÃ biên dịch (19 ô nhớ)\napp/KhungTrang.tsx · KhungTrang: ĐÃ biên dịch (10 ô nhớ)\napp/TrangLoi.tsx · TrangLoi: ĐÃ biên dịch (8 ô nhớ)\nfeatures/bac-si/components/ChipChuyenKhoa.tsx · ChipChuyenKhoa: ĐÃ biên dịch (5 ô nhớ)\nfeatures/bac-si/components/ChiTietBacSi.tsx · ChiTietBacSi: ĐÃ biên dịch (20 ô nhớ)\nfeatures/bac-si/components/DanhSachBacSi.tsx · DanhSachBacSi: ĐÃ biên dịch (20 ô nhớ)\nfeatures/bac-si/components/HoSoBacSi.tsx · HoSoBacSi: ĐÃ biên dịch (9 ô nhớ)\nfeatures/bac-si/components/OTimBacSi.tsx · OTimBacSi: ĐÃ biên dịch (11 ô nhớ)\nfeatures/bac-si/components/TheBacSi.tsx · TheBacSi: ĐÃ biên dịch (30 ô nhớ)\nfeatures/bac-si/KhuBacSi.tsx · KhuBacSi: ĐÃ biên dịch (57 ô nhớ)\nfeatures/dang-nhap/FormDangNhap.tsx · FormDangNhap: ĐÃ biên dịch (20 ô nhớ)\nfeatures/dang-nhap/YeuCauDangNhap.tsx · YeuCauDangNhap: ĐÃ biên dịch (3 ô nhớ)\nfeatures/dat-lich/ChonKhungGio.tsx · ChonKhungGio: ĐÃ biên dịch (16 ô nhớ)\nfeatures/dat-lich/FormDatLich.tsx · FormDatLich: ĐÃ biên dịch (61 ô nhớ)\nfeatures/gop-y/FormGopY.tsx · NutGui: ĐÃ biên dịch (3 ô nhớ)\nfeatures/gop-y/FormGopY.tsx · FormGopY: ĐÃ biên dịch (27 ô nhớ)\nfeatures/lich-hen/DanhSachLichHen.tsx · DanhSachLichHen: ĐÃ biên dịch (19 ô nhớ)\npages/Trang404.tsx · Trang404: ĐÃ biên dịch (6 ô nhớ)\npages/TrangChiTietBacSi.tsx · TrangChiTietBacSi: ĐÃ biên dịch (16 ô nhớ)\npages/TrangChu.tsx · TrangChu: ĐÃ biên dịch (1 ô nhớ)\npages/TrangDangNhap.tsx · TrangDangNhap: ĐÃ biên dịch (6 ô nhớ)\npages/TrangDanhSachBacSi.tsx · TrangDanhSachBacSi: ĐÃ biên dịch (1 ô nhớ)\npages/TrangDatLich.tsx · TrangDatLich: ĐÃ biên dịch (53 ô nhớ)\npages/TrangLichHen.tsx · TrangLichHen: ĐÃ biên dịch (10 ô nhớ)\nshared/dev/DoRender.tsx · DoRender: ĐÃ biên dịch (3 ô nhớ)\nshared/ui/KhungXuong.tsx · DanhSachBacSiKhung: ĐÃ biên dịch (6 ô nhớ)\nshared/ui/KhungXuong.tsx · LuoiGioKhung: ĐÃ biên dịch (1 ô nhớ)\nshared/ui/KhungXuong.tsx · HoSoBacSiKhung: ĐÃ biên dịch (1 ô nhớ)\nshared/ui/LoiTaiDuLieu.tsx · LoiTaiDuLieu: ĐÃ biên dịch (12 ô nhớ)\nshared/ui/TrangThaiMoCua.tsx · TrangThaiMoCua: ĐÃ biên dịch (2 ô nhớ)\nshared/ui/VungThongBao.tsx · VungThongBao: ĐÃ biên dịch (7 ô nhớ)",
  compilerChromium: "[profiling · không compiler · memo tay] Chromium 149.0.7827.55 · CPU chậm 4× · 200 bác sĩ\n  bấm ♡ (7 lần): commit/lần = 1,1,1,1,1,1,1 | actualDuration trung vị = 1.8 ms | baseDuration = 5.0 ms | tương tác (Event Timing) trung vị = 0.0 ms\n  gõ \"h\": commit = 2 | actualDuration = 10.4 ms | tương tác = 24.0 ms\n  gõ \"u\": commit = 2 | actualDuration = 3.5 ms | tương tác = 0.0 ms\n  gõ \"y\": commit = 2 | actualDuration = 1.0 ms | tương tác = 16.0 ms\n  thẻ còn lại sau khi gõ \"huy\": 17\n[profiling · compiler + memo tay] Chromium 149.0.7827.55 · CPU chậm 4× · 200 bác sĩ\n  bấm ♡ (7 lần): commit/lần = 1,1,1,1,1,1,1 | actualDuration trung vị = 1.2 ms | baseDuration = 6.7 ms | tương tác (Event Timing) trung vị = 0.0 ms\n  gõ \"h\": commit = 2 | actualDuration = 8.9 ms | tương tác = 24.0 ms\n  gõ \"u\": commit = 2 | actualDuration = 2.7 ms | tương tác = 0.0 ms\n  gõ \"y\": commit = 2 | actualDuration = 2.3 ms | tương tác = 0.0 ms\n  thẻ còn lại sau khi gõ \"huy\": 17\n[profiling · không compiler · memo tay] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ\n  bấm ♡ (7 lần): commit/lần = 1,1,1,1,1,1,1 | actualDuration trung vị = 4.5 ms | baseDuration = 18.7 ms | tương tác (Event Timing) trung vị = 24.0 ms\n  gõ \"h\": commit = 2 | actualDuration = 36.6 ms | tương tác = 24.0 ms\n  gõ \"u\": commit = 2 | actualDuration = 13.1 ms | tương tác = 16.0 ms\n  gõ \"y\": commit = 2 | actualDuration = 5.1 ms | tương tác = 0.0 ms\n  thẻ còn lại sau khi gõ \"huy\": 84\n[profiling · compiler + memo tay] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ\n  bấm ♡ (7 lần): commit/lần = 1,1,1,1,1,1,1 | actualDuration trung vị = 4.2 ms | baseDuration = 20.9 ms | tương tác (Event Timing) trung vị = 24.0 ms\n  gõ \"h\": commit = 2 | actualDuration = 27.6 ms | tương tác = 24.0 ms\n  gõ \"u\": commit = 2 | actualDuration = 11.4 ms | tương tác = 16.0 ms\n  gõ \"y\": commit = 2 | actualDuration = 6.6 ms | tương tác = 0.0 ms\n  thẻ còn lại sau khi gõ \"huy\": 84\n[profiling · compiler, BỎ memo tay] Chromium 149.0.7827.55 · CPU chậm 4× · 200 bác sĩ\n  bấm ♡ (7 lần): commit/lần = 1,1,1,1,1,1,1 | actualDuration trung vị = 2.1 ms | baseDuration = 5.8 ms | tương tác (Event Timing) trung vị = 0.0 ms\n  gõ \"h\": commit = 2 | actualDuration = 10.3 ms | tương tác = 24.0 ms\n  gõ \"u\": commit = 2 | actualDuration = 4.6 ms | tương tác = 0.0 ms\n  gõ \"y\": commit = 2 | actualDuration = 2.3 ms | tương tác = 16.0 ms\n  thẻ còn lại sau khi gõ \"huy\": 17\n[profiling · compiler, BỎ memo tay] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ\n  bấm ♡ (7 lần): commit/lần = 1,1,1,1,1,1,1 | actualDuration trung vị = 7.1 ms | baseDuration = 21.6 ms | tương tác (Event Timing) trung vị = 24.0 ms\n  gõ \"h\": commit = 2 | actualDuration = 32.9 ms | tương tác = 24.0 ms\n  gõ \"u\": commit = 2 | actualDuration = 12.8 ms | tương tác = 16.0 ms\n  gõ \"y\": commit = 2 | actualDuration = 6.4 ms | tương tác = 0.0 ms\n  thẻ còn lại sau khi gõ \"huy\": 84",
  compilerBuild: "vite.config.ts lần 1: built in 162ms\nvite.config.ts lần 2: built in 159ms\nvite.config.ts lần 3: built in 157ms\ndist-thu-3/assets/index-wUoNGbUe.js          366.04 kB │ gzip: 115.01 kB\nvite.compiler.config.ts lần 1: built in 727ms\nvite.compiler.config.ts lần 2: built in 736ms\nvite.compiler.config.ts lần 3: built in 754ms\ndist-thu-3/assets/index-C8rXKKJm.js             362.32 kB │ gzip: 114.96 kB",
  compilerVitestThoiGian: "[vite.config.ts]       Tests  42 passed (42)\n[vite.config.ts]    Duration  6.36s (tests 44%, environment 32%, setup 14%, transform 8%, import 2%)\n[vite.compiler.config.ts]       Tests  42 passed (42)\n[vite.compiler.config.ts]    Duration  7.13s (tests 36%, environment 26%, transform 24%, setup 12%, import 2%)",
  tieuChi124Truoc: " × compiler.test.ts > 12.4 — vite.config.ts bật React Compiler (reactCompilerPreset qua @rolldown/plugin-babel) 6ms\n ✓ compiler.test.ts > 12.4 — mọi component .tsx trong src/ đều được compiler biên dịch 541ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\nAssertionError: expected '/// <reference types=\"vitest/config\" …' to match /reactCompilerPreset\\(\\)/\n      Tests  1 failed | 1 passed (2)",
  tieuChi124BatLoi: "   × 12.4 — vite.config.ts bật React Compiler (reactCompilerPreset qua @rolldown/plugin-babel) 6ms\n   × 12.4 — mọi component .tsx trong src/ đều được compiler biên dịch 507ms\n+   \"src/pages/TrangChu.tsx · CompileError: (BuildHIR::lowerExpression) Support UpdateExpression where argument is a global\",",
  linkContext: "[jsdom · 1000 bác sĩ · flushSync + useDeferredValue · gõ \"h\"] lần commit KHẨN (DanhSachBacSi không chạy):\n  thẻ CÓ link \"Xem chi tiết\"   → actualDuration = 21.9 ms\n  thẻ KHÔNG link (coLienKet={false}) → actualDuration = 0.5 ms",
  tieuChiSau: "✓ bac-si/OTimBacSi.test.tsx > 12.2 — ô tìm hiện chữ NGAY dù URL chưa kịp đổi (onDoi không làm gì)\n✓ gop-y/FormGopY.test.tsx > 12.3 — nội dung quá ngắn ⇒ lỗi ngay dưới ô, KHÔNG gọi API, chữ đã gõ còn nguyên\n✓ bac-si/OTimBacSi.test.tsx > 12.2 — gõ \"vy\" ⇒ URL ?q=vy (REPLACE) và danh sách lọc theo\n✓ bac-si/OTimBacSi.test.tsx > 12.2 — URL đổi từ NGOÀI ô tìm (menu \"Bác sĩ\", rồi Back) ⇒ chữ trong ô theo URL\n✓ TrangChiTietBacSi.test.tsx > 12.1 — hồ sơ và giờ khám tải song song: giờ khám bắt đầu TRƯỚC khi hồ sơ về\n✓ TrangChiTietBacSi.test.tsx > 12.1 — hồ sơ đang tải: khung xương hồ sơ (aria-busy) và lưới giờ khám cùng có mặt\n✓ TrangChiTietBacSi.test.tsx > 12.1 — API hồ sơ lỗi 500 ⇒ hộp lỗi; \"Tải lại phần này\" ⇒ promise MỚI ⇒ hiện hồ sơ\n✓ lich-hen/DanhSachLichHen.test.tsx > 12.3 — bấm Huỷ ⇒ \"Đã huỷ\" + \"Đang lưu…\" NGAY, trước khi máy chủ trả lời; máy chủ xong ⇒ hết \"Đang lưu…\"\n✓ compiler.test.ts > 12.4 — vite.config.ts bật React Compiler (reactCompilerPreset qua @rolldown/plugin-babel)\n✓ compiler.test.ts > 12.4 — mọi component .tsx trong src/ đều được compiler biên dịch\n✓ lich-hen/DanhSachLichHen.test.tsx > 12.3 — máy chủ lỗi 500 ⇒ tự quay về \"Chờ xác nhận\", báo \"đã hoàn tác\", trang KHÔNG sập\n✓ gop-y/FormGopY.test.tsx > 12.3 — gửi hợp lệ ⇒ nút \"Đang gửi…\" bị khoá trong lúc chờ ⇒ cảm ơn, form trống lại\n✓ gop-y/FormGopY.test.tsx > 12.3 — máy chủ lỗi ⇒ báo lỗi, chữ còn nguyên để gửi lại\n✓ gop-y/FormGopY.test.tsx > 12.3 — axe: form góp ý không có lỗi nào (kể cả lúc đang báo lỗi)",
  cuoiVitest: " Test Files  10 passed (10)\n      Tests  45 passed (45)",
  cuoiBuild: "dist/assets/index-BcgerpH3.css              7.50 kB │ gzip:   2.26 kB\ndist/assets/compiler-runtime-Dc66hXTW.js    8.94 kB │ gzip:   3.36 kB\ndist/assets/form-BJU6EDfn.js              116.41 kB │ gzip:  36.41 kB\ndist/assets/index-_NSF5cbI.js             362.32 kB │ gzip: 114.96 kB\n✓ built in 803ms",
};

/* ─── Sơ đồ mermaid trong bài (≤ 10 nút, nhãn ngắn; khối EN nhãn tiếng Anh, khối VI nhãn tiếng Việt) ─── */
const L = (...dong) => MM(dong.join('\n'));
const SD = {
  /* 12.1 */
  treoVi: L(
    'sequenceDiagram',
    '  participant C as HoSoBacSi',
    '  participant R as React',
    '  participant S as Suspense gần nhất',
    '  participant P as Promise hồ sơ',
    '  C->>P: use(promise) — chưa xong',
    '  C-->>R: "treo" (suspend)',
    '  R->>S: vẽ fallback (khung xương)',
    '  P-->>R: xong, có dữ liệu',
    '  R->>C: render lại, use() trả về bác sĩ',
    '  R->>S: thay fallback bằng hồ sơ thật',
  ),
  treoEn: L(
    'sequenceDiagram',
    '  participant C as HoSoBacSi',
    '  participant R as React',
    '  participant S as Nearest Suspense',
    '  participant P as Profile promise',
    '  C->>P: use(promise) — not settled',
    '  C-->>R: suspends',
    '  R->>S: show fallback (skeleton)',
    '  P-->>R: settled, data ready',
    '  R->>C: render again, use() returns the doctor',
    '  R->>S: swap fallback for the real profile',
  ),
  khoHuaVi: L(
    'flowchart TB',
    '  A["HoSoBacSi render"] --> B{"Kho đã có promise cho khoá này?"}',
    '  B -->|"có"| C["Trả CÙNG promise"]',
    '  B -->|"chưa"| D["ensureQueryData, cất vào kho"]',
    '  D --> C',
    '  C --> E["use(promise)"]',
    '  X["✗ api.bacSi(id) ngay trong render"] --> Y["Promise MỚI mỗi lần"]',
    '  Y --> Z["Treo mãi: 63 request / 0,5 s"]',
    '  classDef sai fill:#3a1414,stroke:#f85149,color:#fff',
    '  class X,Y,Z sai',
  ),
  khoHuaEn: L(
    'flowchart TB',
    '  A["HoSoBacSi renders"] --> B{"Store already holds a promise for this key?"}',
    '  B -->|"yes"| C["Return the SAME promise"]',
    '  B -->|"no"| D["ensureQueryData, keep it"]',
    '  D --> C',
    '  C --> E["use(promise)"]',
    '  X["✗ api.bacSi(id) inside render"] --> Y["NEW promise every time"]',
    '  Y --> Z["Suspends forever: 63 requests / 0.5 s"]',
    '  classDef sai fill:#3a1414,stroke:#f85149,color:#fff',
    '  class X,Y,Z sai',
  ),
  cayTrangVi: L(
    'flowchart TB',
    '  T["TrangChiTietBacSi"] --> L["Link ← Danh sách"]',
    '  T --> E["RanhGioiLoi key=id (404 · 500)"]',
    '  E --> S["Suspense fallback = khung xương"]',
    '  S --> H["HoSoBacSi: use(promise) — treo"]',
    '  E --> G["ChonKhungGio: useQuery — tải NGAY"]',
    '  classDef treo fill:#3a2a0a,stroke:#ffc233,color:#fff',
    '  classDef chay fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class H treo',
    '  class G chay',
  ),
  cayTrangEn: L(
    'flowchart TB',
    '  T["TrangChiTietBacSi"] --> L["Link ← Doctor list"]',
    '  T --> E["RanhGioiLoi key=id (404 · 500)"]',
    '  E --> S["Suspense fallback = skeleton"]',
    '  S --> H["HoSoBacSi: use(promise) — suspended"]',
    '  E --> G["ChonKhungGio: useQuery — loads NOW"]',
    '  classDef treo fill:#3a2a0a,stroke:#ffc233,color:#fff',
    '  classDef chay fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class H treo',
    '  class G chay',
  ),
  /* 12.2 */
  haiViecVi: L(
    'flowchart TB',
    '  K["Gõ phím h"] --> U["Cập nhật KHẨN: chữ trong ô"]',
    '  K --> N["Cập nhật KHÔNG khẩn: URL + danh sách"]',
    '  U --> P["Vẽ ngay: thấy chữ h"]',
    '  N --> R["Render nền, nhả tay mỗi ~5 ms"]',
    '  R --> Q{"Có phím mới?"}',
    '  Q -->|"có"| B["Bỏ bản dở, làm lại với chữ mới"]',
    '  Q -->|"không"| C["Commit danh sách"]',
  ),
  haiViecEn: L(
    'flowchart TB',
    '  K["Key h pressed"] --> U["URGENT update: text in the box"]',
    '  K --> N["NON-urgent update: URL + list"]',
    '  U --> P["Paint now: h is visible"]',
    '  N --> R["Render in background, yield every ~5 ms"]',
    '  R --> Q{"New key pressed?"}',
    '  Q -->|"yes"| B["Drop the draft, restart with new text"]',
    '  Q -->|"no"| C["Commit the list"]',
  ),
  matChuVi: L(
    'sequenceDiagram',
    '  participant N as Người gõ',
    '  participant O as Ô tìm (value từ URL)',
    '  participant R as React Router',
    '  participant D as React',
    '  N->>O: gõ n (ô: "n")',
    '  O->>R: setSearchParams q=n',
    '  R->>D: startTransition(đổi URL)',
    '  D->>O: URL chưa đổi ⇒ trả ô về ""',
    '  N->>O: gõ g vào ô "" (ô: "g")',
    '  D-->>O: transition xong ⇒ "n", rồi "ng" hoặc mất g',
  ),
  matChuEn: L(
    'sequenceDiagram',
    '  participant N as Typist',
    '  participant O as Search box (value from URL)',
    '  participant R as React Router',
    '  participant D as React',
    '  N->>O: types n (box: "n")',
    '  O->>R: setSearchParams q=n',
    '  R->>D: startTransition(change URL)',
    '  D->>O: URL not changed yet ⇒ box back to ""',
    '  N->>O: types g into "" (box: "g")',
    '  D-->>O: transition done ⇒ "n", then "ng" or g is lost',
  ),
  chonHookVi: L(
    'flowchart TB',
    '  A{"Có một cập nhật làm màn hình chậm?"} -->|"không"| Z["Không cần gì"]',
    '  A -->|"có"| B{"Bạn tự gọi hàm set của nó?"}',
    '  B -->|"có"| C["useTransition: startTransition(() => set…)"]',
    '  B -->|"không, giá trị đến qua prop/URL"| D["useDeferredValue(giá trị)"]',
    '  C --> E["Phần chậm phải memo được"]',
    '  D --> E',
    '  F["Chữ trong ô input"] --> G["LUÔN khẩn — không bao giờ trong transition"]',
  ),
  chonHookEn: L(
    'flowchart TB',
    '  A{"Does one update make the screen slow?"} -->|"no"| Z["Nothing needed"]',
    '  A -->|"yes"| B{"Do you call its setter yourself?"}',
    '  B -->|"yes"| C["useTransition: startTransition(() => set…)"]',
    '  B -->|"no, value arrives as prop/URL"| D["useDeferredValue(value)"]',
    '  C --> E["The slow part must be memoisable"]',
    '  D --> E',
    '  F["Text inside an input"] --> G["ALWAYS urgent — never in a transition"]',
  ),
  /* 12.3 */
  huyVi: L(
    'sequenceDiagram',
    '  participant N as Người dùng',
    '  participant C as DanhSachLichHen',
    '  participant M as Máy chủ (PATCH)',
    '  N->>C: bấm Huỷ',
    '  C->>C: startTransition(async), danhDauHuy(id)',
    '  C-->>N: "Đã huỷ" + "Đang lưu…" ngay',
    '  C->>M: mutateAsync — PATCH rồi tải lại danh sách',
    '  M-->>C: xong (hoặc lỗi 500)',
    '  C->>C: Action kết thúc ⇒ bỏ bản lạc quan',
    '  C-->>N: dữ liệu thật: "Đã huỷ" (hoặc "Chờ xác nhận")',
  ),
  huyEn: L(
    'sequenceDiagram',
    '  participant N as User',
    '  participant C as DanhSachLichHen',
    '  participant M as Server (PATCH)',
    '  N->>C: clicks Cancel',
    '  C->>C: startTransition(async), danhDauHuy(id)',
    '  C-->>N: "Đã huỷ" + "Đang lưu…" at once',
    '  C->>M: mutateAsync — PATCH then refetch the list',
    '  M-->>C: done (or 500 error)',
    '  C->>C: Action ends ⇒ optimistic copy dropped',
    '  C-->>N: real data: "Đã huỷ" (or "Chờ xác nhận")',
  ),
  formActionVi: L(
    'flowchart TB',
    '  A["Bấm Gửi góp ý"] --> B["React gọi guiGopY(state cũ, FormData)"]',
    '  B --> C["useFormStatus: pending = true"]',
    '  C --> D{"Hàm trả về gì?"}',
    '  D -->|"loi-nhap / loi-may-chu"| E["state mới + chữ đã gõ"]',
    '  D -->|"da-gui"| F["state mới + ô trống"]',
    '  E --> G["Render lại, rồi React RESET form"]',
    '  F --> G',
    '  G --> H["Ô hiện lại defaultValue lấy từ state"]',
  ),
  formActionEn: L(
    'flowchart TB',
    '  A["Click Send feedback"] --> B["React calls guiGopY(previous state, FormData)"]',
    '  B --> C["useFormStatus: pending = true"]',
    '  C --> D{"What does it return?"}',
    '  D -->|"loi-nhap / loi-may-chu"| E["new state + typed text"]',
    '  D -->|"da-gui"| F["new state + empty fields"]',
    '  E --> G["Re-render, then React RESETS the form"]',
    '  F --> G',
    '  G --> H["Fields show the defaultValue taken from state"]',
  ),
  loiActionVi: L(
    'flowchart TB',
    '  A["Lỗi xảy ra trong Action"] --> B{"Bắt bằng try/catch?"}',
    '  B -->|"có"| C["Trả về làm state / báo thông báo"]',
    '  C --> D["useOptimistic tự quay về dữ liệu thật"]',
    '  B -->|"không"| E["Lỗi bay tới error boundary gần nhất"]',
    '  E --> F["Cả vùng thành: Phần này gặp sự cố"]',
    '  classDef sai fill:#3a1414,stroke:#f85149,color:#fff',
    '  class E,F sai',
  ),
  loiActionEn: L(
    'flowchart TB',
    '  A["Error inside an Action"] --> B{"Caught with try/catch?"}',
    '  B -->|"yes"| C["Return it as state / show a toast"]',
    '  C --> D["useOptimistic falls back to real data"]',
    '  B -->|"no"| E["Error goes to the nearest error boundary"]',
    '  E --> F["Whole area becomes: Phần này gặp sự cố"]',
    '  classDef sai fill:#3a1414,stroke:#f85149,color:#fff',
    '  class E,F sai',
  ),
  /* 12.4 */
  compilerVi: L(
    'flowchart TB',
    '  A["File .tsx của bạn"] --> B["Vite: plugin-react + Babel + React Compiler"]',
    '  B --> C{"Code theo Rules of React?"}',
    '  C -->|"có"| D["Chèn bộ nhớ đệm (ô nhớ)"]',
    '  C -->|"không"| E["Để nguyên, KHÔNG báo gì"]',
    '  E --> F["compiler.test.ts hỏi logger ⇒ đỏ"]',
    '  D --> G["Profiler: đo lại trước/sau"]',
    '  classDef sai fill:#3a2a0a,stroke:#ffc233,color:#fff',
    '  class E sai',
  ),
  compilerEn: L(
    'flowchart TB',
    '  A["Your .tsx file"] --> B["Vite: plugin-react + Babel + React Compiler"]',
    '  B --> C{"Follows the Rules of React?"}',
    '  C -->|"yes"| D["Insert memo cache (slots)"]',
    '  C -->|"no"| E["Leave it as is, say NOTHING"]',
    '  E --> F["compiler.test.ts asks the logger ⇒ red"]',
    '  D --> G["Profiler: re-measure before/after"]',
    '  classDef sai fill:#3a2a0a,stroke:#ffc233,color:#fff',
    '  class E sai',
  ),
  rscVi: L(
    'flowchart TB',
    '  subgraph MC["Máy chủ (Next.js)"]',
    '    S["Server Component: async, đọc DB, 0 KB JS"]',
    '    A["Server Action: use server"]',
    '  end',
    '  subgraph TD["Trình duyệt"]',
    '    C["Client Component: use client, state, onClick"]',
    '  end',
    '  S -->|"kết quả render (RSC payload)"| C',
    '  C -->|"form action gọi"| A',
  ),
  rscEn: L(
    'flowchart TB',
    '  subgraph MC["Server (Next.js)"]',
    '    S["Server Component: async, reads DB, 0 KB JS"]',
    '    A["Server Action: use server"]',
    '  end',
    '  subgraph TD["Browser"]',
    '    C["Client Component: use client, state, onClick"]',
    '  end',
    '  S -->|"render result (RSC payload)"| C',
    '  C -->|"form action calls"| A',
  ),
};

const L0 = {
    title: '12.0 — Chapter 12 slides: React 19 and concurrent rendering in pictures|||12.0 — Slide Chương 12: React 19 và concurrent bằng hình',
    slug: 'rx-12-0-slides',
    type: 'DOCUMENT',
    isFreePreview: true,
    description: 'Cả Chương 12 trong 29 slide: Suspense và use(), ô tìm mất chữ vì transition, useTransition và useDeferredValue, Actions, useOptimistic, useActionState, React Compiler cho cả app và Server Components ở mức khái niệm.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Slides</span>
<h2>The whole chapter in 29 slides</h2>
<p class="lead">React 19 added a set of tools that all answer one question: what should the screen do while something is not ready yet? Data that has not arrived (Suspense, <code>use()</code>), a re-render that is too slow to block typing (<code>useTransition</code>, <code>useDeferredValue</code>), a request to the server that has not answered (Actions, <code>useOptimistic</code>, <code>useActionState</code>, <code>useFormStatus</code>). This chapter uses each of them on the clinic app — and measures, because two of them hide bugs that only show up on a slow machine or in a test.</p>
<p>Slides 3–8 belong to Lesson 12.1 (Suspense, <code>use(promise)</code> and why the promise must be cached, the doctor page that loaded in a queue, the real screen with a suspended profile, errors thrown by <code>use()</code>, and the test that hangs when a component suspends inside <code>act()</code>), 9–15 to Lesson 12.2 (urgent vs non-urgent updates, the Chapter 8 search box that <strong>loses letters</strong>, the React Router line that causes it, <code>flushSync</code>, choosing between <code>useTransition</code> and <code>useDeferredValue</code>, the fix and its numbers), 16–21 to Lesson 12.3 (Actions, <code>useOptimistic</code> for cancelling an appointment, <code>&lt;form action&gt;</code> with <code>useActionState</code>, the automatic form reset, three traps), 22–26 to Lesson 12.4 (React Compiler for the whole app, its numbers and its price, a test that guards it, and Server Components as a concept that needs a framework). Slide 27 lists common mistakes, 28 is the cheat sheet for the quiz, 29 the four project steps. Everything was measured on 26 September 2026 with React 19.3.0, Vite 8.3.1, Vitest 5.0.2, React Router 8.4.0, TanStack Query 5.103.3 and Chromium 149 driven by Playwright, CPU slowed 4×. Two results worth a second look: typing "nguyen" quickly into the Chapter 8 search box over 1000 doctors produced <strong>"nuyen" in 4 runs out of 5</strong> (slide 10), and the doctor page went from 1689 ms to 884 ms without making a single request faster (slide 5).</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Slide</span>
<h2>Cả chương trong 29 slide</h2>
<p class="lead">React 19 thêm một loạt công cụ cùng trả lời một câu hỏi: trong lúc một thứ gì đó CHƯA sẵn sàng, màn hình nên làm gì? Dữ liệu chưa về (Suspense, <code>use()</code>), một lần vẽ lại quá chậm đến mức chặn cả việc gõ phím (<code>useTransition</code>, <code>useDeferredValue</code>), một yêu cầu gửi máy chủ chưa có trả lời (Actions, <code>useOptimistic</code>, <code>useActionState</code>, <code>useFormStatus</code>). Chương này dùng từng công cụ trên app phòng khám — và đo, vì hai trong số đó giấu những lỗi chỉ lộ ra trên máy chậm hoặc trong test.</p>
<p>Slide 3–8 thuộc Bài 12.1 (Suspense, <code>use(promise)</code> và vì sao promise phải được giữ trong kho, trang bác sĩ từng tải kiểu xếp hàng, màn hình thật khi hồ sơ đang "treo", lỗi ném ra từ <code>use()</code>, và cái test đứng im khi component treo bên trong <code>act()</code>), 9–15 thuộc Bài 12.2 (cập nhật khẩn và không khẩn, ô tìm của Chương 8 <strong>mất chữ</strong>, dòng code trong React Router gây ra chuyện đó, <code>flushSync</code>, chọn giữa <code>useTransition</code> và <code>useDeferredValue</code>, cách sửa và số đo), 16–21 thuộc Bài 12.3 (Actions, <code>useOptimistic</code> khi huỷ lịch, <code>&lt;form action&gt;</code> với <code>useActionState</code>, chuyện React tự reset form, ba cái bẫy), 22–26 thuộc Bài 12.4 (React Compiler cho cả app, số đo và cái giá của nó, một test canh nó, và Server Components ở mức khái niệm — thứ cần một framework). Slide 27 là các sai lầm hay gặp, 28 là bảng tra nhanh cho bài kiểm tra, 29 là bốn bước tự gõ tiếp dự án. Mọi số liệu đo ngày 26/09/2026 bằng React 19.3.0, Vite 8.3.1, Vitest 5.0.2, React Router 8.4.0, TanStack Query 5.103.3 và Chromium 149 do Playwright điều khiển, CPU bị làm chậm 4 lần. Hai kết quả đáng nhìn hai lần: gõ nhanh "nguyen" vào ô tìm của Chương 8 trên 1000 bác sĩ ra <strong>"nuyen" 4 trên 5 lần</strong> (slide 10), và trang chi tiết bác sĩ từ 1689 ms còn 884 ms mà không làm request nào nhanh hơn (slide 5).</p>
</div>
${gallery('rx-12', [[1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Suspense: treo thì vẽ fallback'], [4, 'use() cần CÙNG một promise'], [5, 'Trang cũ tải nối đuôi: 1689 ms'], [6, 'Hồ sơ treo, giờ khám đã hiện'], [7, 'Lỗi trong use() tới error boundary'], [8, 'Test: treo trong act() đồng bộ'], [9, 'Mỗi phím: việc khẩn và không khẩn'], [10, 'Ô tìm Chương 8 mất chữ'], [11, 'Router bọc URL trong startTransition'], [12, 'flushSync: hết mất chữ, chặn tay'], [13, 'useTransition hay useDeferredValue'], [14, 'Ô tìm state riêng: chữ ≤ 15 ms'], [15, 'Chữ hiện trước, danh sách đi sau'], [16, 'Action: hàm async trong transition'], [17, 'useOptimistic: Đã huỷ ngay'], [18, 'onMutate 15 dòng → useOptimistic'], [19, 'form action + useActionState'], [20, 'Reset form: giữ chữ bằng state'], [21, 'Ba bẫy của Action'], [22, 'Compiler: 32/32 component'], [23, 'Compiler và memo tay: số đo'], [24, 'Cái giá của compiler'], [25, 'Test canh compiler'], [26, 'Server Components cần framework'], [27, 'Sai lầm hay gặp'], [28, 'Bảng tra nhanh'], [29, 'Tự gõ tiếp dự án']])}
`,
};

/* Output cắt sẵn cho Bài 12.1 (ngoài template literal: bộ kiểm cấm gạch chéo ngược trong thân bài) */
const O1 = {
  kho: OUT.bai1.split('\n').slice(0, 3).join('\n'),
  act: OUT.bai1.split('\n').slice(3, 6).join('\n'),
};
const L1 = {
    title: '12.1 — Suspense for data and use(): let the tree wait, not your if-statements|||12.1 — Suspense cho dữ liệu và use(): để cây component chờ, không phải chuỗi if',
    slug: 'rx-12-1-suspense-use',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Suspense và use(promise) thay cho chuỗi isPending/if, vì sao promise phải nằm trong kho (tạo trong component là 63 request trong nửa giây), trang bác sĩ hết tải nối đuôi (1689 → 884 ms), lỗi đi tới error boundary, và bẫy act() khi test.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>Suspense for data and use(): let the tree wait, not your if-statements</h2>
<p class="lead">Since Chapter 6 every screen that loads data has started with the same three lines: <code>if (isPending) …</code>, <code>if (error) …</code>, then the real content. It works, but it has a cost you have probably not noticed: while the first request is pending, the component <em>returns early</em>, so nothing below it is rendered — and whatever those children would have loaded waits in a queue. This lesson replaces the if-chain with React's own mechanism for "not ready yet", <strong>Suspense</strong>, and the new React 19 hook that plugs data into it, <strong><code>use()</code></strong>. On the doctor page it cuts the time to a usable screen from 1689 ms to 884 ms without making any request faster.</p>
<p>Setup: the clinic app as it was after Chapter 8 (React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2, React Router 8.4.0, TanStack Query 5.103.3, MSW 2.15.0; Chromium 149 via Playwright for timings). Small experiments that are not part of the app live in <code>src/vi-du/bai1.tsx</code>.</p>

<h3>Suspense: a component may say "I am not ready", a boundary decides what to show</h3>
${slide('rx-12', 3, 'Suspense: a component that is not ready suspends, the nearest boundary shows its fallback')}
<p>Suspense (literally "hanging in the air") is a contract between a component and a parent it does not know. The component says, in the middle of rendering: "I cannot finish yet, I am waiting for this promise". React stops rendering that part of the tree, walks <em>up</em> to the nearest <code>&lt;Suspense fallback={…}&gt;</code> and shows the fallback there instead. When the promise settles, React renders the component again, and this time it can finish.</p>
${SD.treoEn}
<div class="callout"><p><strong>JS quick reminder — a Promise in one paragraph.</strong> A Promise is an object representing a value that will exist <em>later</em> (the result of a request, a timer…). It is in one of three states: <em>pending</em> (not yet), <em>fulfilled</em> (has a value) or <em>rejected</em> (has an error). <code>await p</code> inside an <code>async</code> function pauses that function until <code>p</code> settles. <code>p.then(f)</code> registers <code>f</code> to run when it is fulfilled. Two calls to <code>fetch(url)</code> create two <em>different</em> promises even if the URL is identical — keep this in mind, it is the whole of the next section.</p></div>
<p>Three things change in the way you write components:</p>
<ul>
<li><strong>The loading state moves out of the component.</strong> The component that reads data no longer has an <code>isPending</code> branch; the parent decides, with one <code>fallback</code>, what "loading" looks like for a whole region.</li>
<li><strong>The code after the read can assume the data exists.</strong> No <code>bacSi?.ten</code>, no <code>if (!bacSi) return …</code>.</li>
<li><strong>The error state moves too</strong> — to the nearest error boundary (Chapter 7 built <code>RanhGioiLoi</code>; we reuse it below).</li>
</ul>
<p>Suspense itself is old: <code>React.lazy</code> + <code>&lt;Suspense&gt;</code> for code splitting has worked since React 16.6, and Chapter 8 used it. What React 19 adds is an official way for <em>your</em> code to suspend on <em>data</em>: the <code>use</code> API.</p>

<h3><code>use(promise)</code> — and why the promise must come from a store</h3>
${slide('rx-12', 4, 'use() needs the SAME promise on every render — creating it in the component means 63 requests in half a second')}
<p><code>use(promise)</code> returns the promise's value if it is fulfilled, throws its error if it is rejected, and suspends if it is pending. It is not a normal hook: it may be called inside <code>if</code> and after an early <code>return</code> (more on that below). The obvious first attempt:</p>
${pre('tsx', SN.hoSoSai)}
<p>It type-checks, and it never shows the doctor. Measured in Vitest (<code>src/vi-du/bai1.test.tsx</code>, MSW answering in 5 ms):</p>
${out(O1.kho)}
<p>Why? The first render calls <code>api.bacSi('bs-2')</code> — promise #1 — and suspends. A component that suspends <em>before its first commit</em> leaves nothing behind: no state, no refs, nothing React could remember it by. When promise #1 settles, React renders <code>HoSoSai</code> again <em>from scratch</em>, which calls <code>api.bacSi</code> again — promise #2, pending, suspend. Around and around, 63 requests in half a second, with the fallback on screen the whole time. The fix is to keep the promise somewhere that outlives the render: a store keyed by the doctor's id.</p>
${pre('tsx', SN.hoSoDung)}
${SD.khoHuaEn}
<div class="callout"><p><strong>JS quick reminder — <code>Map</code>.</strong> <code>new Map()</code> is a dictionary: <code>m.set(k, v)</code> stores, <code>m.get(k)</code> reads (or <code>undefined</code>), <code>m.has(k)</code> checks. Unlike a plain object, keys can be any value, including objects. A <code>WeakMap</code> is a Map whose keys must be objects and which does not keep those objects alive — when nothing else references the key, the entry disappears by itself. We use one below to give every <code>QueryClient</code> its own store.</p></div>
<p>The third row is what most teams actually write: TanStack Query already <em>is</em> such a store. <code>useSuspenseQuery</code> has the same contract as <code>use()</code> — suspend while loading, throw on error — and its <code>data</code> is never <code>undefined</code>:</p>
${pre('tsx', SN.hoSoTanStack)}
<p>React's documentation says it directly: creating promises inside a Client Component is not supported, "except via a Suspense-compatible library or framework" (the text of React 19's own warning, found in <code>react-dom</code>'s source). The rule to remember: <strong>whoever calls <code>use(promise)</code> must receive the same promise object on every render</strong> — from a cache, from a library, or from a parent that already committed.</p>
<div class="pitfall co-tieu-de"><strong>Trap — <code>use(fetch(…))</code>, <code>use(api.x())</code>, <code>use(somethingAsync())</code> in a component.</strong> In our run it produced no warning at all (<code>console.error: 0</code>): the component is recreated from scratch each time, so React never sees "a different promise in the same component". What you see instead is a loading state that never ends and a network tab full of identical requests. React Compiler does not save you either — we re-ran the same test with the compiler enabled in Lesson 12.4 and got 72 requests.</div>

<h3>The doctor page: from a queue to two requests at once</h3>
${slide('rx-12', 5, 'The old page loaded in a queue: the time slots waited 807 ms for the profile')}
<p>Here is the page as Chapter 7–8 left it. Read it looking for one thing: what happens to <code>ChonKhungGio</code> while the profile is loading?</p>
${pre('tsx', SN.trangCu)}
<p>While <code>isPending</code> is true, the function returns a paragraph. <code>ChonKhungGio</code> is never rendered, so its <code>useQuery</code> never starts. Only when the profile arrives does the time picker mount and ask for the time slots. Measured in Chromium with every API delayed 800 ms (<code>?tre=800</code>), from the click on "Xem chi tiết":</p>
${out(OUT.chiTietTruoc)}
<p>That is a <strong>request waterfall</strong> ("thác nước request"): the second request starts at 810 ms, after the first finished, although it never needed the first one's data — <code>ChonKhungGio</code> only needs the id, which is in the URL. The if-chain caused it, not the network.</p>
<p>With Suspense, the page stops returning early. The part that needs the profile suspends inside its own boundary; everything else renders immediately:</p>
${SD.cayTrangEn}
<p>The store, written once for the whole app on top of TanStack Query's cache (so data read through <code>use()</code> is also available to any <code>useQuery</code> with the same key):</p>
${pre('ts', SN.hua)}
<p>The query "recipe", written once and used both ways (<code>queryOptions</code> is a typed helper from TanStack Query; it returns the same object you would pass to <code>useQuery</code>):</p>
${pre('ts', SN.truyVan)}
<p>The component that reads the profile — note what is <em>missing</em>: no <code>isPending</code>, no <code>if (!bacSi)</code>, no optional chaining:</p>
${pre('tsx', SN.hoSoBacSi)}
<p>And the page, which now only arranges regions:</p>
${pre('tsx', SN.trangMoi)}
<p>Same measurement, same 800 ms delay:</p>
${out(OUT.chiTietSau)}
<table>
<thead><tr><th>Chromium, API 800 ms, from the click</th><th>Chapter 8 (if-chain)</th><th>Chapter 12 (Suspense + <code>use()</code>)</th></tr></thead>
<tbody>
<tr><td>Profile visible</td><td>881 ms</td><td>856 ms</td></tr>
<tr><td>Time slots visible</td><td>1689 ms</td><td><strong>884 ms</strong></td></tr>
<tr><td>Time-slot request starts</td><td>810 ms after the profile request</td><td><strong>7 ms</strong> after</td></tr>
</tbody></table>
${slide('rx-12', 6, 'Real screen: the profile is still suspended, the time slots are already there')}
<p>To take that screenshot, the mock API got one more knob: <code>?tre-ho-so=vo-han</code> makes only <code>GET /api/bac-si/:id</code> hang forever. The skeleton (<code>HoSoBacSiKhung</code>) has the same box as the real profile, so nothing jumps when the data arrives (Chapter 6's rule for skeletons still holds).</p>
<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202, a detail page is a class component that calls <code>fetch</code> in <code>componentDidMount</code>, keeps <code>loading</code> and <code>data</code> in <code>this.state</code>, and renders <code>{this.state.loading ? &lt;Spinner /&gt; : …}</code> — the Chapter 6 version with hooks is the same shape. → At work in 2026, the data is read through a Suspense-compatible layer (<code>useSuspenseQuery</code>, a framework loader, or <code>use()</code> on a cached promise), and loading/error UI is placed with <code>&lt;Suspense&gt;</code> and an error boundary around <em>regions</em> of the page. · <em>Why:</em> the if-chain is correct but it serialises everything below it and repeats the same three branches in every component; boundaries let independent parts load in parallel and keep one loading design per region. The FER202 way is not wrong — you will still meet it in every codebase older than React 18, and <code>useQuery</code> with <code>isPending</code> is still perfectly fine for a single isolated widget.</p></div>

<h3>Errors: <code>use()</code> throws, an error boundary catches</h3>
${slide('rx-12', 7, 'A rejected promise goes to the nearest error boundary — 404 gets its own screen, 500 gets a retry button')}
<p>When the promise is rejected, <code>use()</code> throws the error during render. React treats it like any render error: it goes up to the nearest error boundary. Chapter 7's <code>RanhGioiLoi</code> needed one addition — a way to show a <em>specific</em> screen for a specific error (the 404 page the old if-chain had):</p>
${pre('tsx', SN.ranhGioi)}
<p>In the page (above) the boundary gets <code>thayThe</code> for 404, <code>onThuLai</code> for everything else, and <code>key={id}</code> so that moving to another doctor starts with a clean boundary. The retry button has one subtle job: a rejected promise stays rejected forever, so "try again" must <strong>forget</strong> it (<code>quenHua</code>) before the boundary re-renders its children — otherwise <code>use()</code> reads the same rejected promise and throws again at once.</p>
<div class="pitfall co-tieu-de"><strong>Trap — deleting the failed promise automatically.</strong> "Just remove it from the store when it fails" sounds tidy. It causes the same endless loop as the uncached promise: the error boundary renders, React retries the child, the store is empty, a new request starts, fails, is removed… A 404 would hammer the server forever. Keep the rejection until a <em>person</em> asks to retry.</div>

<h3><code>use</code> is not a hook: it may run after an early return</h3>
<p><code>use</code> also reads context. The difference from <code>useContext</code> is the one rule it does not follow — it may be called conditionally:</p>
${pre('tsx', SN.gioMoCua)}
<p>This matters when a component returns early for most renders and only needs a context in one branch. Everything else about hooks still applies to the <em>other</em> hooks in the component (all <code>useState</code>/<code>useEffect</code> calls must still run in the same order).</p>

<h3>Testing Suspense: a component that suspends inside a synchronous <code>act()</code> never comes back</h3>
${slide('rx-12', 8, 'Tests: suspending inside a synchronous act() leaves the fallback on screen forever')}
<p>The moment the doctor page used <code>use()</code>, six existing tests (Chapter 7 routing tests and the Chapter 8 axe test) failed with a timeout, and the page in the test DOM said "Đang tải thông tin bác sĩ…" forever — while the real browser worked. Measured in isolation:</p>
${out(O1.act)}
<p>Testing Library's <code>render()</code> and every <code>user.click()</code> run inside React's <code>act()</code>. When a component suspends inside a <em>synchronous</em> <code>act()</code>, React warns once and drops the rest of the queued work — here the retry after the promise settles, and even the effects of <code>ChonKhungGio</code> (0 time slots: its request was never sent). The fix is to <strong>await an async <code>act()</code></strong> around whatever makes something suspend. The project gets a helper next to <code>veTrang</code>:</p>
${pre('tsx', SN.veTrangCho)}
<p>and a click that navigates to the doctor page becomes <code>await act(async () =&gt; user.click(xem))</code>. Tests of pages that do not suspend stay as they were.</p>
<div class="callout"><p><strong>Common interview question.</strong> "What is Suspense and how does it work with data fetching in React 19?"</p>
<p>Suspense is a boundary with a fallback. When a component inside it suspends — because it read a promise that is still pending, through <code>use()</code> or a library like <code>useSuspenseQuery</code>, or because a <code>React.lazy</code> chunk is loading — React shows the nearest fallback and renders the component again when the promise settles. The data layer must return the <em>same</em> promise across renders (a cache), otherwise it suspends forever. Errors go to an error boundary. The practical benefit is that loading states are placed per region by the parent and independent regions load in parallel instead of in a waterfall — on my project the detail page went from 1.69 s to 0.88 s.</p></div>
<div class="callout"><p><strong>Common interview question.</strong> "What is the difference between <code>use</code> and other hooks?"</p>
<p><code>use</code> is an API, not a hook in the strict sense: it can be called inside conditions and loops and after an early return. It reads either a promise (suspending until it resolves) or a context. It still must be called during render of a component or hook, not in an event handler. The promise must be stable — created outside render or taken from a cache.</p></div>

<h3>🛠 Keep building the project — step 1/4: the doctor profile through <code>use()</code> and Suspense</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after Chapter 8 (<code>src/pages/TrangChiTietBacSi.tsx</code> with the <code>isPending</code> chain, <code>src/shared/ui/RanhGioiLoi.tsx</code>, <code>src/test/render.tsx</code> with <code>veTrang</code>).</p><ol>
<li>Create <code>src/shared/api/hua.ts</code> with <code>layHua(queryClient, truyVan)</code> and <code>quenHua(queryClient, queryKey)</code> (one <code>Map</code> per <code>QueryClient</code> inside a <code>WeakMap</code>).</li>
<li>In <code>useChiTietBacSi.ts</code>, extract <code>truyVanChiTietBacSi(id)</code> with <code>queryOptions</code>; keep <code>useChiTietBacSi</code> working on top of it. Export both from the feature's <code>index.ts</code>.</li>
<li>Add <code>HoSoBacSi</code> (reads with <code>use(layHua(…))</code>, sets the tab title) and <code>HoSoBacSiKhung</code> in <code>KhungXuong.tsx</code> (<code>section.chi-tiet</code>, <code>aria-busy</code>, <code>aria-label="Đang tải hồ sơ bác sĩ"</code>).</li>
<li>Give <code>RanhGioiLoi</code> an optional <code>thayThe(loi)</code> prop. Rewrite the page as in the lesson: <code>ChonKhungGio</code> <em>outside</em> <code>&lt;Suspense&gt;</code>, both inside the boundary.</li>
<li>Add <code>veTrangCho</code> to <code>src/test/render.tsx</code>; switch the tests that open <code>/bac-si/:id</code> to it, and wrap the "Xem chi tiết" click in <code>await act(async () =&gt; …)</code>.</li>
</ol>
<p><strong>Done when:</strong> the three tests below are green (<code>src/pages/TrangChiTietBacSi.test.tsx</code>) and so are all earlier tests; <code>npx tsc -b</code> prints nothing.</p></div>
${pre('tsx', SN.test121)}
${pre('tsx', SN.test121b)}
<p>Run against the Chapter 8 page, the same file gives:</p>
${out(OUT.tieuChi121Truoc)}
<details><summary>Solution</summary>
<p>All files are printed in full above: <code>hua.ts</code>, <code>truyVanChiTietBacSi</code>, <code>HoSoBacSi.tsx</code>, the page, the <code>RanhGioiLoi</code> render part, and <code>veTrangCho</code>. Two details people miss: <code>ChonKhungGio</code> must be a sibling of <code>&lt;Suspense&gt;</code>, not a child (inside it, it would wait for the profile again), and <code>key={id}</code> on the boundary. Run on 26/09/2026: <code>npx tsc -b</code> printed nothing; <code>npx vitest run</code> → all files green at this step, 23 tests.</p>
${out(OUT.tieuChi121Sau)}
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> feel the three failure modes with your own hands.</p><ol>
<li>In <code>HoSoBacSi</code>, replace <code>use(layHua(useQueryClient(), truyVanChiTietBacSi(id)))</code> with <code>use(api.bacSi(id))</code>. Open <code>/bac-si/bs-2</code> with the Network tab open. Count the requests for 3 seconds, then undo.</li>
<li>Move <code>&lt;ChonKhungGio /&gt;</code> <em>inside</em> <code>&lt;Suspense&gt;</code>. Run the first 12.1 test. Read the failure message, then undo.</li>
<li>In one routing test that opens <code>/bac-si/bs-2</code>, change <code>await veTrangCho(…)</code> back to <code>veTrang(…)</code>. Run it and find React's warning in the output.</li>
</ol><p><strong>Done when:</strong> step 1 shows dozens of identical <code>/api/bac-si/bs-2</code> requests and a skeleton that never leaves; step 2 fails with <code>expected 2 to be less than 1</code> (the slots start after the profile ended); step 3 times out and prints "A component suspended inside an &#96;act&#96; scope…"; after undoing everything, <code>npx vitest run</code> is green.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Suspense</span><span class="v">a boundary with a <code>fallback</code>; shows it while any component inside is suspended</span></div>
<div class="kv"><span class="k">suspend (treo)</span><span class="v">a component stops rendering because it is waiting for a promise</span></div>
<div class="kv"><span class="k"><code>use()</code></span><span class="v">React 19 API: reads a promise (suspends/throws) or a context; allowed inside conditions</span></div>
<div class="kv"><span class="k">cached promise</span><span class="v">the same promise object returned on every render for the same key</span></div>
<div class="kv"><span class="k">request waterfall</span><span class="v">requests that run one after another although they did not depend on each other</span></div>
<div class="kv"><span class="k"><code>useSuspenseQuery</code></span><span class="v">TanStack Query's Suspense version of <code>useQuery</code>; <code>data</code> is always defined</span></div>
<div class="kv"><span class="k">error boundary</span><span class="v">class component that catches render errors below it, including a rejected <code>use()</code></span></div>
<div class="kv"><span class="k"><code>act()</code></span><span class="v">test helper that flushes React work; must be awaited when something suspends</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Suspense moves "loading" out of the component: it suspends, the nearest <code>&lt;Suspense&gt;</code> shows the fallback, React retries when the promise settles.</li>
<li><code>use(promise)</code> needs the same promise every render; <code>use(api.x())</code> in render made 63 requests in 0.5 s and never showed data. Use a store, <code>useSuspenseQuery</code>, or a promise from a committed parent.</li>
<li>The old if-chain caused a waterfall; with the profile inside its own boundary and the time picker outside, the page went from 1689 ms to 884 ms.</li>
<li>A rejected promise goes to an error boundary; retry must forget the rejected promise first.</li>
<li><code>use</code> can run after an early return — for promises and for context.</li>
<li>In tests, render and interactions that make a component suspend must be inside <code>await act(async …)</code>.</li>
</ul>

${LINK('https://react.dev/reference/react/Suspense', '📄', 'react.dev — &lt;Suspense&gt;', 'Fallback, nested boundaries, what triggers it.')}
${LINK('https://react.dev/reference/react/use', '📄', 'react.dev — use', 'Reading promises and context; caching caveats.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/suspense', '🗃', 'TanStack Query — Suspense', 'useSuspenseQuery and error resets.')}
${LINK('https://react.dev/reference/react/act', '🧪', 'react.dev — act', 'Why async work must be awaited in tests.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Suspense cho dữ liệu và use(): để cây component chờ, không phải chuỗi if</h2>
<p class="lead">Từ Chương 6, màn hình nào tải dữ liệu cũng mở đầu bằng ba dòng quen thuộc: <code>if (isPending) …</code>, <code>if (error) …</code>, rồi mới tới nội dung thật. Cách đó chạy đúng, nhưng có một cái giá mà có lẽ bạn chưa để ý: trong lúc request đầu tiên chưa về, component <em>return sớm</em>, nên mọi thứ bên dưới nó chưa được vẽ — và thứ mà những component con đó lẽ ra đã tải thì phải xếp hàng chờ. Bài này thay chuỗi if bằng cơ chế "chưa sẵn sàng" của chính React, <strong>Suspense</strong>, và hook mới của React 19 để cắm dữ liệu vào cơ chế đó, <strong><code>use()</code></strong>. Trên trang chi tiết bác sĩ, nó rút thời gian tới lúc dùng được màn hình từ 1689 ms xuống 884 ms mà không làm request nào nhanh hơn.</p>
<p>Chuẩn bị: app phòng khám như sau Chương 8 (React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2, React Router 8.4.0, TanStack Query 5.103.3, MSW 2.15.0; đo thời gian bằng Chromium 149 qua Playwright). Các thí nghiệm nhỏ không thuộc app nằm ở <code>src/vi-du/bai1.tsx</code>.</p>

<h3>Suspense: component được quyền nói "tôi chưa xong", một ranh giới quyết định hiện gì</h3>
${slide('rx-12', 3, 'Suspense: component chưa có dữ liệu thì treo, ranh giới gần nhất vẽ fallback')}
<p>Suspense (nghĩa đen: "treo lơ lửng") là một giao kèo giữa một component và một component cha mà nó không hề biết. Giữa lúc đang render, component nói: "tôi chưa làm xong được, tôi đang chờ promise này". React dừng render phần cây đó, đi <em>ngược lên</em> tới <code>&lt;Suspense fallback={…}&gt;</code> gần nhất và vẽ fallback ở đó. Khi promise xong, React render lại component, và lần này nó làm xong được.</p>
${SD.treoVi}
<div class="callout"><p><strong>JS nhắc nhanh — Promise trong một đoạn.</strong> Promise là một object đại diện cho một giá trị sẽ có <em>sau này</em> (kết quả một request, một bộ hẹn giờ…). Nó ở một trong ba trạng thái: <em>pending</em> (chưa xong), <em>fulfilled</em> (đã có giá trị) hoặc <em>rejected</em> (đã có lỗi). <code>await p</code> trong một hàm <code>async</code> tạm dừng hàm đó tới khi <code>p</code> xong. <code>p.then(f)</code> đăng ký <code>f</code> chạy khi nó có giá trị. Gọi <code>fetch(url)</code> hai lần tạo ra hai promise <em>khác nhau</em>, dù URL y hệt — nhớ câu này, cả mục sau xoay quanh nó.</p></div>
<p>Ba thứ đổi trong cách bạn viết component:</p>
<ul>
<li><strong>Trạng thái "đang tải" dời ra khỏi component.</strong> Component đọc dữ liệu không còn nhánh <code>isPending</code>; component cha quyết định, bằng MỘT <code>fallback</code>, "đang tải" trông thế nào cho cả một vùng.</li>
<li><strong>Code phía sau dòng đọc dữ liệu được coi như dữ liệu đã có.</strong> Không <code>bacSi?.ten</code>, không <code>if (!bacSi) return …</code>.</li>
<li><strong>Trạng thái lỗi cũng dời đi</strong> — tới error boundary gần nhất (Chương 7 đã dựng <code>RanhGioiLoi</code>; bên dưới ta dùng lại nó).</li>
</ul>
<p>Bản thân Suspense không mới: <code>React.lazy</code> + <code>&lt;Suspense&gt;</code> để chia code đã chạy từ React 16.6, và Chương 8 đã dùng. Cái React 19 thêm vào là một cách chính thức để code <em>của bạn</em> treo khi chờ <em>dữ liệu</em>: API <code>use</code>.</p>

<h3><code>use(promise)</code> — và vì sao promise phải lấy từ một cái kho</h3>
${slide('rx-12', 4, 'use() cần CÙNG một promise mỗi lần render — tạo trong component là 63 request trong nửa giây')}
<p><code>use(promise)</code> trả về giá trị của promise nếu nó đã xong, ném lỗi của nó nếu nó bị từ chối, và treo nếu nó còn pending. Nó không phải hook bình thường: gọi được trong <code>if</code> và sau một <code>return</code> sớm (nói thêm ở dưới). Cách thử đầu tiên ai cũng nghĩ ra:</p>
${pre('tsx', SN.hoSoSai)}
<p>tsc không phàn nàn gì, và nó không bao giờ hiện được bác sĩ. Đo trong Vitest (<code>src/vi-du/bai1.test.tsx</code>, MSW trả lời sau 5 ms):</p>
${out(O1.kho)}
<p>Vì sao? Lần render đầu gọi <code>api.bacSi('bs-2')</code> — promise số 1 — rồi treo. Một component treo <em>trước lần commit đầu tiên</em> thì không để lại gì cả: không state, không ref, không có gì để React nhận ra nó là "ai". Khi promise số 1 xong, React render <code>HoSoSai</code> lại <em>từ đầu</em>, và nó lại gọi <code>api.bacSi</code> — promise số 2, pending, treo. Cứ thế vòng quanh, 63 request trong nửa giây, fallback đứng trên màn hình suốt. Cách sửa là cất promise ở một chỗ sống lâu hơn một lần render: một cái kho, khoá theo id bác sĩ.</p>
${pre('tsx', SN.hoSoDung)}
${SD.khoHuaVi}
<div class="callout"><p><strong>JS nhắc nhanh — <code>Map</code>.</strong> <code>new Map()</code> là một cuốn từ điển: <code>m.set(k, v)</code> cất, <code>m.get(k)</code> đọc (không có thì <code>undefined</code>), <code>m.has(k)</code> kiểm tra. Khác object thường, khoá là giá trị gì cũng được, kể cả object. <code>WeakMap</code> là một Map mà khoá bắt buộc là object và nó không giữ object đó sống — khi không còn ai tham chiếu tới khoá, mục đó tự biến mất. Bên dưới ta dùng một WeakMap để mỗi <code>QueryClient</code> có một kho riêng.</p></div>
<p>Dòng thứ ba là thứ phần lớn đội thật sự viết: TanStack Query vốn đã <em>là</em> một cái kho như thế. <code>useSuspenseQuery</code> có cùng giao kèo với <code>use()</code> — treo khi đang tải, ném lỗi khi hỏng — và <code>data</code> của nó không bao giờ là <code>undefined</code>:</p>
${pre('tsx', SN.hoSoTanStack)}
<p>Tài liệu React nói thẳng: tạo promise bên trong một Client Component là chưa được hỗ trợ, "trừ khi qua một thư viện hoặc framework tương thích Suspense" (nguyên văn câu cảnh báo của React 19, tìm thấy trong mã nguồn <code>react-dom</code>). Quy tắc cần nhớ: <strong>ai gọi <code>use(promise)</code> thì phải nhận CÙNG một object promise ở mọi lần render</strong> — từ một cache, từ một thư viện, hoặc từ một component cha đã commit.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — <code>use(fetch(…))</code>, <code>use(api.x())</code>, <code>use(hamAsync())</code> ngay trong component.</strong> Trong lần chạy của ta nó không in một cảnh báo nào (<code>console.error: 0</code>): component bị tạo lại từ đầu mỗi lần, nên React không bao giờ thấy "một promise khác trong cùng một component". Thứ bạn thấy là một trạng thái đang tải không bao giờ dứt và tab Network đầy những request giống hệt nhau. React Compiler cũng không cứu được — ở Bài 12.4 ta chạy lại đúng test này với compiler bật và đếm được 72 request.</div>

<h3>Trang chi tiết bác sĩ: từ xếp hàng sang hai request cùng lúc</h3>
${slide('rx-12', 5, 'Trang cũ tải nối đuôi: giờ khám phải chờ hồ sơ 807 ms')}
<p>Đây là trang như Chương 7–8 để lại. Đọc nó và tìm đúng một điều: <code>ChonKhungGio</code> làm gì trong lúc hồ sơ còn đang tải?</p>
${pre('tsx', SN.trangCu)}
<p>Khi <code>isPending</code> còn đúng, hàm trả về một đoạn chữ. <code>ChonKhungGio</code> không được vẽ, nên <code>useQuery</code> của nó không chạy. Chỉ khi hồ sơ về, bộ chọn giờ mới được mount và mới đi hỏi khung giờ. Đo trong Chromium với mọi API chậm 800 ms (<code>?tre=800</code>), tính từ lúc bấm "Xem chi tiết":</p>
${out(OUT.chiTietTruoc)}
<p>Đó là một <strong>thác nước request</strong> (request waterfall): request thứ hai bắt đầu ở 810 ms, sau khi request đầu xong, dù nó chẳng cần gì từ request đầu — <code>ChonKhungGio</code> chỉ cần id, mà id có sẵn trên URL. Chuỗi if gây ra chuyện này, không phải mạng.</p>
<p>Với Suspense, trang thôi return sớm. Phần cần hồ sơ thì treo trong ranh giới của riêng nó; mọi thứ khác được vẽ ngay:</p>
${SD.cayTrangVi}
<p>Cái kho, viết một lần cho cả app, dựng trên cache của TanStack Query (nên dữ liệu đọc qua <code>use()</code> cũng có sẵn cho mọi <code>useQuery</code> cùng khoá):</p>
${pre('ts', SN.hua)}
<p>"Công thức" truy vấn, viết một lần, dùng được hai kiểu (<code>queryOptions</code> là hàm trợ giúp có kiểu của TanStack Query; nó trả về đúng object bạn vẫn đưa cho <code>useQuery</code>):</p>
${pre('ts', SN.truyVan)}
<p>Component đọc hồ sơ — để ý thứ đã <em>biến mất</em>: không <code>isPending</code>, không <code>if (!bacSi)</code>, không dấu <code>?.</code>:</p>
${pre('tsx', SN.hoSoBacSi)}
<p>Và trang, giờ chỉ còn việc sắp xếp các vùng:</p>
${pre('tsx', SN.trangMoi)}
<p>Cùng phép đo, cùng độ trễ 800 ms:</p>
${out(OUT.chiTietSau)}
<table>
<thead><tr><th>Chromium, API 800 ms, tính từ lúc bấm</th><th>Chương 8 (chuỗi if)</th><th>Chương 12 (Suspense + <code>use()</code>)</th></tr></thead>
<tbody>
<tr><td>Thấy hồ sơ</td><td>881 ms</td><td>856 ms</td></tr>
<tr><td>Thấy giờ khám</td><td>1689 ms</td><td><strong>884 ms</strong></td></tr>
<tr><td>Request giờ khám bắt đầu</td><td>810 ms sau request hồ sơ</td><td><strong>7 ms</strong> sau</td></tr>
</tbody></table>
${slide('rx-12', 6, 'Màn hình thật: hồ sơ còn treo, giờ khám đã hiện')}
<p>Để chụp được ảnh này, API giả có thêm một núm vặn: <code>?tre-ho-so=vo-han</code> làm riêng <code>GET /api/bac-si/:id</code> treo mãi. Khung xương (<code>HoSoBacSiKhung</code>) có cùng khung với hồ sơ thật, nên lúc dữ liệu về không có gì nhảy (luật về khung xương của Chương 6 vẫn giữ).</p>
<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202, trang chi tiết là một class component gọi <code>fetch</code> trong <code>componentDidMount</code>, giữ <code>loading</code> và <code>data</code> trong <code>this.state</code>, rồi vẽ <code>{this.state.loading ? &lt;Spinner /&gt; : …}</code> — bản hook của Chương 6 cũng cùng hình dáng đó. → Đi làm năm 2026, dữ liệu được đọc qua một lớp tương thích Suspense (<code>useSuspenseQuery</code>, loader của framework, hoặc <code>use()</code> trên một promise đã cache), và giao diện đang tải/lỗi được đặt bằng <code>&lt;Suspense&gt;</code> cùng error boundary quanh từng <em>vùng</em> của trang. · <em>Vì sao:</em> chuỗi if chạy đúng nhưng nó bắt mọi thứ bên dưới phải xếp hàng, và lặp lại đúng ba nhánh đó ở mọi component; ranh giới cho các phần độc lập tải song song và giữ một kiểu "đang tải" cho mỗi vùng. Cách FER202 không sai — bạn sẽ gặp nó ở mọi codebase cũ hơn React 18, và <code>useQuery</code> với <code>isPending</code> vẫn hoàn toàn ổn cho một widget đứng riêng.</p></div>

<h3>Lỗi: <code>use()</code> ném, error boundary bắt</h3>
${slide('rx-12', 7, 'Promise bị từ chối đi tới error boundary gần nhất — 404 có màn riêng, 500 có nút thử lại')}
<p>Khi promise bị từ chối, <code>use()</code> ném lỗi ngay trong lúc render. React đối xử với nó như mọi lỗi render: đi ngược lên error boundary gần nhất. <code>RanhGioiLoi</code> của Chương 7 cần thêm đúng một thứ — cách hiện một màn <em>riêng</em> cho một loại lỗi riêng (màn 404 mà chuỗi if cũ từng có):</p>
${pre('tsx', SN.ranhGioi)}
<p>Trong trang (ở trên), ranh giới nhận <code>thayThe</code> cho 404, <code>onThuLai</code> cho mọi lỗi khác, và <code>key={id}</code> để sang bác sĩ khác thì bắt đầu với một ranh giới sạch. Nút thử lại có một việc tinh tế: promise đã bị từ chối thì bị từ chối mãi mãi, nên "thử lại" phải <strong>quên</strong> nó đi (<code>quenHua</code>) trước khi ranh giới vẽ lại con — nếu không <code>use()</code> đọc lại đúng promise hỏng đó và ném lỗi ngay lập tức.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — tự động xoá promise hỏng khỏi kho.</strong> "Lỗi thì xoá khỏi kho là xong" nghe gọn gàng. Nó gây đúng vòng lặp vô tận của promise không cache: error boundary vẽ, React thử lại con, kho trống, request mới chạy, hỏng, bị xoá… Một lỗi 404 sẽ nện máy chủ mãi mãi. Giữ lại promise hỏng tới khi một <em>con người</em> bấm thử lại.</div>

<h3><code>use</code> không phải hook: nó chạy được sau một return sớm</h3>
<p><code>use</code> cũng đọc được context. Khác biệt với <code>useContext</code> nằm ở đúng một luật mà nó không phải theo — được gọi có điều kiện:</p>
${pre('tsx', SN.gioMoCua)}
<p>Điều này có ích khi component return sớm ở phần lớn các lần render và chỉ cần context ở một nhánh. Mọi luật khác của hook vẫn áp dụng cho các hook <em>khác</em> trong component (mọi lời gọi <code>useState</code>/<code>useEffect</code> vẫn phải chạy cùng một thứ tự).</p>

<h3>Test Suspense: component treo bên trong một <code>act()</code> đồng bộ thì không bao giờ quay lại</h3>
${slide('rx-12', 8, 'Test: treo bên trong act() đồng bộ thì fallback đứng mãi')}
<p>Ngay khi trang bác sĩ dùng <code>use()</code>, sáu test đang có (các test định tuyến của Chương 7 và test axe của Chương 8) hỏng vì hết giờ, và trang trong DOM của test ghi "Đang tải thông tin bác sĩ…" mãi mãi — trong khi trình duyệt thật vẫn chạy đúng. Đo riêng:</p>
${out(O1.act)}
<p><code>render()</code> của Testing Library và mọi <code>user.click()</code> đều chạy bên trong <code>act()</code> của React. Khi một component treo bên trong một <code>act()</code> <em>đồng bộ</em>, React cảnh báo một lần rồi bỏ luôn phần việc còn xếp hàng — ở đây là lần thử lại sau khi promise xong, và cả effect của <code>ChonKhungGio</code> (0 ô giờ khám: request của nó chưa từng được gửi). Cách sửa là <strong>await một <code>act()</code> async</strong> quanh bất cứ thứ gì làm một component treo. Dự án có thêm một hàm trợ giúp cạnh <code>veTrang</code>:</p>
${pre('tsx', SN.veTrangCho)}
<p>và cú bấm dẫn sang trang bác sĩ trở thành <code>await act(async () =&gt; user.click(xem))</code>. Test của những trang không treo giữ nguyên.</p>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Suspense là gì, và nó làm việc với việc lấy dữ liệu trong React 19 thế nào?"</p>
<p>Suspense là một ranh giới có fallback. Khi một component bên trong nó treo — vì đọc một promise còn pending qua <code>use()</code> hay một thư viện như <code>useSuspenseQuery</code>, hoặc vì một chunk <code>React.lazy</code> đang tải — React hiện fallback gần nhất và render lại component khi promise xong. Lớp dữ liệu phải trả về <em>cùng</em> một promise giữa các lần render (một cache), nếu không nó treo mãi. Lỗi đi tới error boundary. Lợi ích thực tế là trạng thái đang tải được cha đặt theo từng vùng, và các vùng độc lập tải song song thay vì kiểu thác nước — trong dự án của em, trang chi tiết từ 1,69 giây còn 0,88 giây.</p></div>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "<code>use</code> khác các hook khác chỗ nào?"</p>
<p><code>use</code> là một API, không phải hook theo nghĩa chặt: gọi được trong điều kiện, vòng lặp và sau một return sớm. Nó đọc hoặc một promise (treo tới khi xong) hoặc một context. Nó vẫn phải được gọi trong lúc render một component hay hook, không phải trong hàm xử lý sự kiện. Promise phải ổn định — tạo ngoài lúc render hoặc lấy từ cache.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 1/4: hồ sơ bác sĩ qua <code>use()</code> và Suspense</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau Chương 8 (<code>src/pages/TrangChiTietBacSi.tsx</code> còn chuỗi <code>isPending</code>, <code>src/shared/ui/RanhGioiLoi.tsx</code>, <code>src/test/render.tsx</code> có <code>veTrang</code>).</p><ol>
<li>Tạo <code>src/shared/api/hua.ts</code> với <code>layHua(queryClient, truyVan)</code> và <code>quenHua(queryClient, queryKey)</code> (mỗi <code>QueryClient</code> một <code>Map</code>, cất trong một <code>WeakMap</code>).</li>
<li>Trong <code>useChiTietBacSi.ts</code>, tách <code>truyVanChiTietBacSi(id)</code> bằng <code>queryOptions</code>; giữ <code>useChiTietBacSi</code> chạy trên nó. Export cả hai từ <code>index.ts</code> của tính năng.</li>
<li>Thêm <code>HoSoBacSi</code> (đọc bằng <code>use(layHua(…))</code>, đặt tiêu đề tab) và <code>HoSoBacSiKhung</code> trong <code>KhungXuong.tsx</code> (<code>section.chi-tiet</code>, <code>aria-busy</code>, <code>aria-label="Đang tải hồ sơ bác sĩ"</code>).</li>
<li>Cho <code>RanhGioiLoi</code> một prop không bắt buộc <code>thayThe(loi)</code>. Viết lại trang như trong bài: <code>ChonKhungGio</code> nằm <em>ngoài</em> <code>&lt;Suspense&gt;</code>, cả hai trong ranh giới lỗi.</li>
<li>Thêm <code>veTrangCho</code> vào <code>src/test/render.tsx</code>; chuyển các test mở <code>/bac-si/:id</code> sang nó, và bọc cú bấm "Xem chi tiết" trong <code>await act(async () =&gt; …)</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> ba test dưới đây xanh (<code>src/pages/TrangChiTietBacSi.test.tsx</code>) và mọi test cũ vẫn xanh; <code>npx tsc -b</code> không in gì.</p></div>
${pre('tsx', SN.test121)}
${pre('tsx', SN.test121b)}
<p>Chạy trên trang của Chương 8, cùng file đó cho ra:</p>
${out(OUT.tieuChi121Truoc)}
<details><summary>Lời giải</summary>
<p>Mọi file đã in đầy đủ ở trên: <code>hua.ts</code>, <code>truyVanChiTietBacSi</code>, <code>HoSoBacSi.tsx</code>, trang, phần render của <code>RanhGioiLoi</code>, và <code>veTrangCho</code>. Hai chi tiết hay sót: <code>ChonKhungGio</code> phải là anh em của <code>&lt;Suspense&gt;</code>, không phải con (nằm trong thì nó lại chờ hồ sơ), và <code>key={id}</code> trên ranh giới. Chạy ngày 26/09/2026: <code>npx tsc -b</code> không in gì; <code>npx vitest run</code> → mọi file xanh ở bước này, 23 test.</p>
${out(OUT.tieuChi121Sau)}
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> tự tay cảm nhận ba kiểu hỏng.</p><ol>
<li>Trong <code>HoSoBacSi</code>, thay <code>use(layHua(useQueryClient(), truyVanChiTietBacSi(id)))</code> bằng <code>use(api.bacSi(id))</code>. Mở <code>/bac-si/bs-2</code> với tab Network đang mở. Đếm request trong 3 giây, rồi hoàn tác.</li>
<li>Dời <code>&lt;ChonKhungGio /&gt;</code> vào <em>trong</em> <code>&lt;Suspense&gt;</code>. Chạy test 12.1 đầu tiên. Đọc thông báo lỗi, rồi hoàn tác.</li>
<li>Trong một test định tuyến mở <code>/bac-si/bs-2</code>, đổi <code>await veTrangCho(…)</code> về <code>veTrang(…)</code>. Chạy và tìm cảnh báo của React trong output.</li>
</ol><p><strong>Đạt khi:</strong> bước 1 thấy hàng chục request <code>/api/bac-si/bs-2</code> giống hệt nhau và một khung xương không bao giờ biến mất; bước 2 hỏng với <code>expected 2 to be less than 1</code> (giờ khám bắt đầu sau khi hồ sơ xong); bước 3 hết giờ và in "A component suspended inside an &#96;act&#96; scope…"; hoàn tác hết thì <code>npx vitest run</code> xanh.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Suspense</span><span class="v">ranh giới có <code>fallback</code>; hiện fallback khi có component bên trong đang treo</span></div>
<div class="kv"><span class="k">treo (suspend)</span><span class="v">component ngừng render vì đang chờ một promise</span></div>
<div class="kv"><span class="k"><code>use()</code></span><span class="v">API của React 19: đọc promise (treo/ném lỗi) hoặc context; được gọi trong điều kiện</span></div>
<div class="kv"><span class="k">promise đã cache</span><span class="v">cùng một object promise trả về ở mọi lần render với cùng khoá</span></div>
<div class="kv"><span class="k">thác nước request (request waterfall)</span><span class="v">các request chạy nối đuôi dù không phụ thuộc nhau</span></div>
<div class="kv"><span class="k"><code>useSuspenseQuery</code></span><span class="v">bản Suspense của <code>useQuery</code> trong TanStack Query; <code>data</code> luôn có</span></div>
<div class="kv"><span class="k">error boundary (ranh giới lỗi)</span><span class="v">class component bắt lỗi render bên dưới nó, kể cả <code>use()</code> bị từ chối</span></div>
<div class="kv"><span class="k"><code>act()</code></span><span class="v">hàm trợ giúp test đẩy việc của React chạy xong; phải await khi có thứ bị treo</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Suspense dời "đang tải" ra khỏi component: nó treo, <code>&lt;Suspense&gt;</code> gần nhất hiện fallback, React thử lại khi promise xong.</li>
<li><code>use(promise)</code> cần cùng một promise ở mọi lần render; <code>use(api.x())</code> trong render tạo 63 request trong 0,5 giây và không bao giờ hiện dữ liệu. Dùng kho, <code>useSuspenseQuery</code>, hoặc promise từ một cha đã commit.</li>
<li>Chuỗi if cũ gây thác nước request; hồ sơ trong ranh giới riêng, bộ chọn giờ ở ngoài ⇒ trang từ 1689 ms còn 884 ms.</li>
<li>Promise bị từ chối đi tới error boundary; thử lại thì phải quên promise hỏng trước.</li>
<li><code>use</code> chạy được sau một return sớm — cho cả promise lẫn context.</li>
<li>Trong test, render và thao tác làm component treo phải nằm trong <code>await act(async …)</code>.</li>
</ul>

${LINK('https://react.dev/reference/react/Suspense', '📄', 'react.dev — &lt;Suspense&gt;', 'Fallback, ranh giới lồng nhau, cái gì kích hoạt nó.')}
${LINK('https://react.dev/reference/react/use', '📄', 'react.dev — use', 'Đọc promise và context; lưu ý về cache.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/suspense', '🗃', 'TanStack Query — Suspense', 'useSuspenseQuery và reset lỗi.')}
${LINK('https://react.dev/reference/react/act', '🧪', 'react.dev — act', 'Vì sao việc async phải được await trong test.')}
</div>
`,
};

/* Output cắt sẵn cho Bài 12.2 */
const O2 = {
  cuoiNguyen: OUT.goTruocNguyen.split('\n').slice(-1)[0],
};
const L2 = {
    title: '12.2 — useTransition and useDeferredValue: keep typing urgent, let the list wait|||12.2 — useTransition và useDeferredValue: gõ phím là việc khẩn, danh sách thì chờ được',
    slug: 'rx-12-2-transition',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Cập nhật khẩn và không khẩn, useTransition và useDeferredValue đo trên 1000 bác sĩ với CPU chậm 4×, và một lỗi thật: ô tìm của Chương 8 mất chữ vì React Router bọc URL trong startTransition — "nguyen" thành "nuyen" 4/5 lần, sửa xong chữ hiện sau ≤ 15 ms.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>useTransition and useDeferredValue: keep typing urgent, let the list wait</h2>
<p class="lead">Chapter 8 measured the search box on a 1000-doctor list and concluded "typing is the next thing to fix — with virtualization or <code>useDeferredValue</code>". This lesson does the second half, and on the way finds something worse than slowness: typing "nguyen" quickly into the Chapter 8 box on a slow machine produced <strong>"nuyen"</strong> in 4 runs out of 5. The letter was not slow — it was gone. The cause is one line inside React Router, and understanding it requires exactly the idea this lesson is about: React 18+ has two kinds of updates, and a text input must never be the second kind.</p>
<p>Setup: the project after step 1/4. All timings: production build, Chromium 149 via Playwright, CPU slowed 4× through the DevTools protocol, 1000 doctors (<code>?nhieu=1000</code>), median of 5 runs. The script <code>do/do-go.mjs</code> presses real keys and, for every key, measures three things: when the letter <em>appears in the box</em> (checked every animation frame), when the list heading changes, and the browser's own Event Timing for that key (what INP is built from).</p>
${pre('js', SN.doGo)}

<h3>Two kinds of updates: urgent and not urgent</h3>
${slide('rx-12', 9, 'Every keystroke is two jobs: the text in the box (urgent) and the list (not urgent)')}
<p>Until React 18, every state update was treated the same way: once React started rendering, it rendered to the end, and the browser could not paint anything — not even the letter you just typed — until it finished. React 18 introduced <strong>concurrent rendering</strong> ("render đồng thời"): React can prepare a new version of the screen <em>in the background</em>, stop every few milliseconds to let the browser handle input and paint, and throw that draft away if something more important arrives. You opt in per update, by marking it as a <strong>transition</strong> ("chuyển cảnh" — an update that is allowed to take a while).</p>
${SD.haiViecEn}
<p>So every keystroke in a search box is really two jobs. The letter in the box is <strong>urgent</strong>: people notice a delay above roughly 50–100 ms between pressing a key and seeing it. The filtered list is <strong>not urgent</strong>: nobody reads 1000 cards between two keystrokes, and it is fine if the list shows the result for "hu" while you are already typing "huy". Two hooks let you express that split.</p>
<div class="callout"><p><strong>JS quick reminder — "the main thread".</strong> JavaScript in a browser page runs on one thread, the same one that handles clicks and keys and paints the screen. While a function runs (for example React rendering 1000 cards), nothing else happens: the key you pressed waits in a queue. That is why "the render took 60 ms" means "the page was frozen for 60 ms". Concurrent rendering does not make rendering faster; it cuts it into ~5 ms slices so the queue gets a turn in between.</p></div>

<h3><code>useTransition</code>: you mark the slow update yourself</h3>
<p><code>const [isPending, startTransition] = useTransition()</code>. Anything you set inside <code>startTransition(() =&gt; …)</code> is a transition. While it has not been committed, <code>isPending</code> is <code>true</code> — free "working on it" state. The correct way to use it in a search box is <strong>two states</strong>: one for the text (set normally, urgent) and one for the filter (set in the transition):</p>
${pre('tsx', SN.timChuyen)}
<p>All four experiments in <code>src/vi-du/bai2.tsx</code> render the same memoised list of 1000 cards:</p>
${pre('tsx', SN.danhSachMemo)}
<p>The baseline, one state for both the box and the list:</p>
${pre('tsx', SN.timThuong)}
<p>Typing "huy" and then deleting it with three Backspaces (the deletions are the expensive part: the list grows back to 1000 cards):</p>
${out(OUT.bai2Thuong)}
${out(OUT.bai2Chuyen)}
<p>In the baseline the letter appears only when the whole list has been rendered — 49 ms for the second Backspace. With a transition the letter appears in 3–9 ms, the list follows 18–60 ms later, and the Event Timing of the heaviest key drops from 64 ms to 32 ms.</p>

<h3><code>useDeferredValue</code>: the value arrives from outside, you let a copy lag behind</h3>
<p>Sometimes you do not own the <code>set…</code> call: the value arrives as a prop, from the URL, from a store. <code>useDeferredValue(value)</code> gives you a second copy of it that <em>lags</em>: during an urgent render it still holds the previous value, and React schedules a background render to catch it up.</p>
${pre('tsx', SN.timTre)}
${out(OUT.bai2Tre)}
<p>Practically the same numbers as <code>useTransition</code> — they are the same mechanism seen from two sides. One condition makes or breaks both: <strong>the slow part must be skippable during the urgent render</strong>. Here <code>DanhSach</code> is wrapped in <code>memo</code> and receives <code>tuKhoaTre</code>; during the urgent render that prop has not changed, so React skips the list entirely. Without <code>memo</code>, the urgent render would re-render the list anyway and nothing would improve (react.dev says the same in the <code>useDeferredValue</code> reference).</p>
${SD.chonHookEn}
<table>
<thead><tr><th></th><th><code>useTransition</code></th><th><code>useDeferredValue</code></th></tr></thead>
<tbody>
<tr><td>You write</td><td><code>startTransition(() =&gt; setX(v))</code></td><td><code>const xTre = useDeferredValue(x)</code></td></tr>
<tr><td>Use when</td><td>you call the setter</td><td>the value comes from a prop, URL, store</td></tr>
<tr><td>"Working" flag</td><td><code>isPending</code></td><td><code>x !== xTre</code></td></tr>
<tr><td>Also accepts</td><td>async functions (Actions, Lesson 12.3)</td><td>an initial value: <code>useDeferredValue(x, '')</code></td></tr>
<tr><td>Needs</td><td colspan="2">the slow subtree to be memoised (or compiled by React Compiler)</td></tr>
</tbody></table>
<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202, a slow search box is fixed with a debounce — <code>setTimeout</code> in <code>onChange</code>, or lodash <code>debounce</code> — so the list filters only after the user stops typing for 300 ms (Chapter 4 built <code>useDebounce</code> the same way). → At work with React 18+, when the cost is <em>rendering</em> (not a network request), teams reach for <code>useDeferredValue</code>/<code>useTransition</code> first: no fixed delay, fast machines show results immediately, slow machines degrade smoothly. · <em>Why:</em> a debounce makes every user wait 300 ms, even on a fast laptop, and still blocks the thread when it finally fires. Debounce is still the right tool when each keystroke would <em>call an API</em> — deferring the render does not reduce requests.</p></div>

<h3>The trap: the input's own value inside a transition</h3>
<p>What if you put the <em>text</em> itself in the transition — one state, set inside <code>startTransition</code>?</p>
${pre('tsx', SN.timChuyenSai)}
${out(OUT.bai2ChuyenSai)}
<p>At CPU 4× and a key every 60 ms it only looks slow (the letter now waits for the list again). Type faster on a slower machine — CPU 6×, a key every 10 ms — and compare the final contents of the box across 5 runs:</p>
${out(OUT.bai2ThuongNhanh)}
${out(OUT.bai2TreNhanh)}
${out(OUT.bai2SaiNhanh)}
<p>Letters disappear. The mechanism, step by step:</p>
${SD.matChuEn}
<p>A controlled input (<code>value={…}</code>) must show the state React has <em>committed</em>. When you type "n", the browser puts "n" in the box, React runs <code>onChange</code>, but the state update is a transition and has not been committed — so React restores the box to the committed value, "". If the next key arrives before the transition commits, the browser appends it to "" — and when the transitions finally commit, one of the letters is missing. react.dev's <code>useTransition</code> page has a section for exactly this: a transition cannot be used to control a text input.</p>
<div class="pitfall co-tieu-de"><strong>Trap — wrapping the input's setter in <code>startTransition</code> "to make typing faster".</strong> In a quick manual test on a fast laptop nothing goes wrong; the bug needs a slow render and a fast typist, which is exactly the customer on a cheap Android phone. The rule has no exceptions: the value shown <em>inside</em> an input is always an urgent update. Put the expensive thing that depends on it — a list, a chart, a preview — behind a transition or a deferred value.</div>

<h3>Our app had this bug since Chapter 7</h3>
${slide('rx-12', 10, 'Measured: the Chapter 8 search box loses letters — "nguyen" became "nuyen" 4 times out of 5')}
<p>The Chapter 8 search box, unchanged since Chapter 7: its <code>value</code> comes straight from the URL (<code>?q=</code>), and <code>KhuBacSi</code> writes the URL on every keystroke with <code>replace</code>:</p>
${pre('tsx', SN.oTimCu)}
${pre('tsx', SN.khuCu)}
<p>Nobody wrapped anything in <code>startTransition</code>. Yet, typing "nguyen" with a key every 30 ms on 1000 doctors:</p>
${out(OUT.goTruocNguyen)}
<p>4 runs out of 5 lost the "g". The "huy" + three Backspaces run shows why it feels sluggish even when nothing is lost: the letter appears <em>exactly when</em> the list changes (same number in both columns), up to 138 ms after the key.</p>
${out(OUT.goTruocXoa)}
${slide('rx-12', 11, 'The cause: React Router wraps every URL update in startTransition')}
<p>The transition is React Router's. <code>RouterProvider</code> applies every navigation — including <code>setSearchParams</code> — like this (from <code>node_modules/react-router/dist/development/lib/components.js</code>, version 8.4.0):</p>
${pre('js', SN.rrSetState)}
<p>and the type definitions document the one escape hatch (<code>NavigateOptions</code> in <code>lib/context.d.ts</code>):</p>
${pre('ts', SN.rrFlushSyncDoc)}
<p>So an input whose <code>value</code> is the URL is, by construction, an input controlled by a transition — the exact pattern react.dev warns against. It is a very common pattern (Chapter 7 taught it, and so do many tutorials); it only breaks when rendering the new URL is slow enough for the next key to arrive first. With 6 doctors that never happens. With 1000 it happens most of the time.</p>

<h3>Fix one: <code>flushSync</code> — correct, but it blocks the keyboard</h3>
${slide('rx-12', 12, 'flushSync stops the lost letters but blocks the keyboard: up to 152 ms for one key')}
<p>The documented option first: navigate with <code>flushSync: true</code>, which makes the URL update synchronous again:</p>
${pre('ts', SN.flushSyncThu)}
${out(OUT.goFlushNguyen)}
${out(OUT.goFlushXoa)}
<p>No more lost letters. But now every key renders everything before the browser may paint — Event Timing up to 152 ms, the letter up to 122 ms late. And adding <code>useDeferredValue</code> for the list on top did not help (measured during the investigation: 54–70 ms for the first key). The reason is a subtle one: <strong>a URL change reaches every <code>&lt;Link&gt;</code> through context</strong>, and context skips <code>memo</code>. Each doctor card has a "Xem chi tiết" <code>Link</code>; <code>Link</code> reads the router's location context to compute its <code>href</code>; when the location changes, all 1000 of them re-render in the urgent render, even inside a memoised list. Measured in jsdom, same urgent render with and without links on the cards:</p>
${out(OUT.linkContext)}
<div class="callout"><p><strong>JS/React quick reminder — context and <code>memo</code>.</strong> <code>memo</code> skips a component when its <em>props</em> are unchanged. A component that reads a context with <code>useContext</code> (or through a hook like <code>useLocation</code>) re-renders whenever that context's value changes, wherever it sits in the tree and whether or not its parent was skipped. That is why a "global" context that changes often is expensive (Chapter 5 made the same point about one big context for the whole app).</p></div>

<h3>Fix two: the text in the box is the box's own state</h3>
${slide('rx-12', 13, 'useTransition or useDeferredValue: same mechanism, different place — and never the input itself')}
<p>The lesson from the experiments: keep the urgent path <em>tiny</em>. Typing should update one small component — the box — and nothing that reads the URL. The URL, and the list that reads it, can then follow in React Router's transition, which is exactly what we want for them. So the box gets its own state:</p>
${pre('tsx', SN.oTimMoi)}
<p>Three details make it correct:</p>
<ul>
<li><strong><code>value={go}</code></strong>: the box shows its own state, set synchronously in <code>onChange</code>. It never waits for the URL, so it can never be reset to an old URL value.</li>
<li><strong>Following the URL when it changes for other reasons.</strong> Clicking "Bác sĩ" in the menu (PUSH to <code>/bac-si</code>) or pressing Back (POP) must update the box. The box always writes with REPLACE, so the rule is "adopt the new URL value unless the navigation was a REPLACE". It is done during render with the "adjust state when a prop changes" pattern from Lesson 4.2, not with an effect.</li>
<li><strong>"Đang lọc…"</strong> shows while <code>go !== tuKhoa</code> — the box is ahead of the URL. It is <code>aria-hidden</code>: it flickers on every key and would be noise for a screen reader.</li>
</ul>
<p>Where is <code>useTransition</code>? Inside React Router — the URL update, and the 1000 <code>Link</code>s that react to it, already run in its transition. Our job was to stop the input from being part of it. (The explicit <code>useTransition</code> in the project comes in Lesson 12.3, where we need <code>isPending</code>.)</p>
${slide('rx-12', 14, 'Search box with its own state: the letter appears within 15 ms, the list follows')}
${out(OUT.goSauNguyen)}
${out(OUT.goSauXoa)}
<table>
<thead><tr><th>Chromium, CPU 4×, 1000 doctors (median of 5)</th><th>Chapter 8</th><th><code>flushSync</code></th><th>Own state (final)</th></tr></thead>
<tbody>
<tr><td>"nguyen" typed every 30 ms — final text</td><td>"nuyen" 4/5</td><td>"nguyen" 5/5</td><td><strong>"nguyen" 5/5</strong></td></tr>
<tr><td>Slowest letter to appear ("huy⌫⌫⌫")</td><td>138 ms</td><td>122 ms</td><td><strong>15 ms</strong></td></tr>
<tr><td>Slowest Event Timing ("huy⌫⌫⌫")</td><td>40 ms</td><td>152 ms</td><td><strong>40 ms</strong></td></tr>
<tr><td>List updated after the heaviest key</td><td>138 ms</td><td>122 ms</td><td>145 ms</td></tr>
</tbody></table>
<p>Read the last row honestly: the list is not faster — it still has to mount up to 1000 cards with 1000 links. What changed is that nobody waits for it. Making the list itself cheaper is Chapter 13's job (virtualization: render only the cards on screen).</p>
${slide('rx-12', 15, 'Real screen: the letter is in the box, the list still shows 1000 doctors and "Đang lọc…"')}
<p>The screenshot was taken with the CPU slowed 40× (only to catch the moment): "h" is in the box, "Đang lọc…" is next to it, and the heading still says 1000.</p>
<div class="callout"><p><strong>Common interview question.</strong> "What is the difference between <code>useTransition</code> and <code>useDeferredValue</code>? When would you use them instead of debounce?"</p>
<p>Both mark work as non-urgent so React can render it in the background, interrupt it, and keep urgent updates like typing responsive. <code>useTransition</code> wraps a state update you trigger and gives <code>isPending</code>; <code>useDeferredValue</code> takes a value you receive (prop, URL, store) and returns a lagging copy. Both only help if the slow part can be skipped in the urgent render — memoised or compiled. I use them when the cost is rendering; I use debounce when each change triggers a network request. And I never put the input's own value in a transition — I measured a search box losing letters exactly because the router wrapped URL updates in <code>startTransition</code>.</p></div>
<div class="callout"><p><strong>Common interview question.</strong> "What does 'concurrent rendering' mean in React 18/19?"</p>
<p>React can prepare a render without committing it: it works in small slices, yields to the browser between them, and may discard an unfinished render if a more urgent update arrives. It is opt-in per update through transitions, deferred values and Suspense. It does not make rendering faster; it changes <em>priority</em>, so the page stays responsive while expensive work continues.</p></div>

<h3>🛠 Keep building the project — step 2/4: a search box that never loses a letter</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after step 1/4 (<code>src/features/bac-si/components/OTimBacSi.tsx</code> with <code>value={tuKhoa}</code> straight from the URL).</p><ol>
<li>Give <code>OTimBacSi</code> its own state <code>go</code>, initialised from <code>tuKhoa</code>; <code>onChange</code> sets it, then calls <code>onDoi</code>.</li>
<li>Follow URL changes that did not come from the box: keep <code>tuKhoaDaThay</code> in state, compare during render, adopt the URL value unless <code>useNavigationType() === 'REPLACE'</code>.</li>
<li>Wrap label + a small <code>&lt;span className="dang-loc" aria-hidden="true"&gt;Đang lọc…&lt;/span&gt;</code> (only while <code>go !== tuKhoa</code>) in <code>div.o-tim-boc</code>; the label's text must stay exactly "Tìm theo tên".</li>
<li>Do not use <code>flushSync</code>, and do not wrap anything in <code>startTransition</code> — measure with <code>do/do-go.mjs</code> if you have Playwright.</li>
</ol>
<p><strong>Done when:</strong> the three tests in <code>src/features/bac-si/OTimBacSi.test.tsx</code> are green, the Chapter 8 test "gõ tìm huy: thẻ còn lại KHÔNG chạy lại" is still green, and (optional, Chromium) <code>node do/do-go.mjs --phim "n,g,u,y,e,n" --cach 30</code> ends with "nguyen" 5 times.</p></div>
${pre('tsx', SN.test122)}
${pre('tsx', SN.test122c)}
<p>Against the Chapter 8 box, the first test fails (the other two pass — the old box did follow the URL):</p>
${out(OUT.tieuChi122Truoc)}
<details><summary>Solution</summary>
<p><strong>src/features/bac-si/components/OTimBacSi.tsx</strong> is printed in full in the section "Fix two" above, plus two CSS rules in <code>src/index.css</code>: <code>.o-tim-boc { display: flex; align-items: center; gap: 10px; }</code> and <code>.dang-loc { font-size: 0.85em; color: #64748b; }</code>. <code>KhuBacSi</code> does not change: it still passes <code>tuKhoa</code> from the URL and writes with <code>'replace'</code>. Run on 26/09/2026: <code>npx tsc -b</code> printed nothing; <code>npx vitest run src/features</code> → 2 files, 6 tests green; the whole suite 32 tests at this step.</p>
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> reproduce the lost letter in the isolated demo, then fix it two ways.</p><ol>
<li>Build and open <code>/thu-go.html?kieu=chuyen-sai&amp;nhieu=1000</code> (<code>npx vite build --config vite.vi-du.config.ts</code>, then <code>npx vite preview</code>). In Chrome DevTools → Performance, set CPU to "6× slowdown". Type "nguyen" as fast as you can, five times (clear the box between tries). Write down what the box contains.</li>
<li>Switch to <code>?kieu=tre</code> and repeat.</li>
<li>In <code>TimChuyenSai</code>, keep <em>one</em> state but fix it with <code>useDeferredValue</code> only (no <code>startTransition</code>): what must you change, and what must <code>DanhSach</code> receive?</li>
</ol><p><strong>Done when:</strong> step 1 shows at least one wrong word (the measured runs gave "nuyen" and "en"); step 2 shows "nguyen" every time; your step-3 version shows "nguyen" every time and <code>npx tsc -b</code> is clean.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">concurrent rendering</span><span class="v">React renders in interruptible slices and may discard an unfinished render</span></div>
<div class="kv"><span class="k">transition</span><span class="v">an update marked non-urgent; old UI stays interactive until it commits</span></div>
<div class="kv"><span class="k"><code>useTransition</code></span><span class="v">returns <code>[isPending, startTransition]</code>; updates inside are transitions</span></div>
<div class="kv"><span class="k"><code>useDeferredValue</code></span><span class="v">returns a copy of a value that lags behind during urgent renders</span></div>
<div class="kv"><span class="k">urgent update</span><span class="v">must show immediately: typing, clicking, toggling</span></div>
<div class="kv"><span class="k"><code>flushSync</code></span><span class="v">forces an update to render and commit synchronously</span></div>
<div class="kv"><span class="k">Event Timing / INP</span><span class="v">browser measurement of how long an interaction took until the next paint</span></div>
<div class="kv"><span class="k">debounce</span><span class="v">run something only after input stops for N ms — right for network requests</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every keystroke is an urgent update (the letter) plus possibly non-urgent work (the list); transitions let React do the second in interruptible slices.</li>
<li><code>useTransition</code> when you call the setter (gives <code>isPending</code>); <code>useDeferredValue</code> when the value arrives from outside. Both need the slow part to be memoised.</li>
<li>Never put an input's own value in a transition: measured, "nguyen" became "nuyen"/"en".</li>
<li>React Router wraps every URL update in <code>startTransition</code>; an input whose <code>value</code> is the URL lost letters in 4/5 runs on 1000 doctors.</li>
<li><code>flushSync</code> fixes correctness but blocks (152 ms): a URL change re-renders every <code>Link</code> through context, past <code>memo</code>.</li>
<li>Fix: the box keeps its own state (letter ≤ 15 ms), follows the URL on PUSH/POP, and lets the URL and list follow in the router's transition.</li>
</ul>

${LINK('https://react.dev/reference/react/useTransition', '📄', 'react.dev — useTransition', 'isPending, and why a transition cannot control an input.')}
${LINK('https://react.dev/reference/react/useDeferredValue', '📄', 'react.dev — useDeferredValue', 'Stale content while typing; memo is required.')}
${LINK('https://reactrouter.com/api/hooks/useSearchParams', '🧭', 'React Router — useSearchParams', 'setSearchParams and its navigate options (flushSync).')}
${LINK('https://web.dev/articles/inp', '⏱', 'web.dev — Interaction to Next Paint', 'The metric behind Event Timing; 200 ms is "good".')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>useTransition và useDeferredValue: gõ phím là việc khẩn, danh sách thì chờ được</h2>
<p class="lead">Chương 8 đo ô tìm trên danh sách 1000 bác sĩ và kết luận "gõ phím là chỗ cần sửa tiếp — bằng virtualization hoặc <code>useDeferredValue</code>". Bài này làm vế thứ hai, và dọc đường tìm ra một thứ tệ hơn cả chậm: gõ nhanh "nguyen" vào ô tìm của Chương 8 trên máy chậm ra <strong>"nuyen"</strong> 4 trên 5 lần. Chữ không chậm — chữ biến mất. Thủ phạm là một dòng bên trong React Router, và muốn hiểu nó thì cần đúng ý tưởng của bài này: từ React 18 có hai loại cập nhật, và một ô nhập chữ không bao giờ được thuộc loại thứ hai.</p>
<p>Chuẩn bị: dự án sau bước 1/4. Mọi số đo: bản build production, Chromium 149 qua Playwright, CPU bị làm chậm 4 lần qua giao thức DevTools, 1000 bác sĩ (<code>?nhieu=1000</code>), lấy trung vị của 5 lần chạy. Script <code>do/do-go.mjs</code> bấm phím thật và, với mỗi phím, đo ba thứ: lúc chữ <em>hiện trong ô</em> (dò ở mỗi khung hình), lúc tiêu đề danh sách đổi, và Event Timing của chính trình duyệt cho phím đó (thứ mà chỉ số INP dựa vào).</p>
${pre('js', SN.doGo)}

<h3>Hai loại cập nhật: khẩn và không khẩn</h3>
${slide('rx-12', 9, 'Mỗi phím gõ là hai việc: chữ trong ô (khẩn) và danh sách (không khẩn)')}
<p>Trước React 18, mọi lần cập nhật state đều như nhau: React đã bắt đầu render là render tới cùng, và trình duyệt không vẽ được gì — kể cả chữ bạn vừa gõ — cho tới khi xong. React 18 đưa vào <strong>concurrent rendering</strong> (render đồng thời): React có thể chuẩn bị một phiên bản màn hình mới <em>ở nền</em>, cứ vài mili giây lại dừng để trình duyệt xử lý phím và vẽ, và vứt bản nháp đó đi nếu có việc quan trọng hơn tới. Bạn bật nó cho từng cập nhật, bằng cách đánh dấu cập nhật đó là một <strong>transition</strong> ("chuyển cảnh" — một cập nhật được phép mất thời gian).</p>
${SD.haiViecVi}
<p>Vậy mỗi phím gõ vào ô tìm thực ra là hai việc. Chữ trong ô là việc <strong>khẩn</strong>: người dùng thấy ngay nếu từ lúc bấm tới lúc thấy chữ trễ quá khoảng 50–100 ms. Danh sách đã lọc là việc <strong>không khẩn</strong>: không ai đọc 1000 thẻ giữa hai phím gõ, và danh sách đang hiện kết quả cho "hu" trong khi bạn đã gõ tới "huy" cũng chẳng sao. Có hai hook để nói ra sự phân chia đó.</p>
<div class="callout"><p><strong>JS nhắc nhanh — "luồng chính".</strong> JavaScript trong một trang web chạy trên một luồng duy nhất, cũng chính luồng xử lý cú bấm, phím gõ và vẽ màn hình. Trong lúc một hàm đang chạy (ví dụ React đang render 1000 thẻ), không có gì khác xảy ra: phím bạn vừa bấm phải chờ trong hàng đợi. Vì thế "render mất 60 ms" nghĩa là "trang đứng hình 60 ms". Concurrent rendering không làm render nhanh hơn; nó cắt việc render thành từng lát ~5 ms để hàng đợi có lượt chen vào giữa.</p></div>

<h3><code>useTransition</code>: bạn tự đánh dấu cập nhật chậm</h3>
<p><code>const [isPending, startTransition] = useTransition()</code>. Mọi thứ bạn set bên trong <code>startTransition(() =&gt; …)</code> là một transition. Trong lúc nó chưa commit, <code>isPending</code> là <code>true</code> — trạng thái "đang làm" có sẵn, miễn phí. Cách dùng đúng cho ô tìm là <strong>hai state</strong>: một cho chữ (set bình thường, khẩn) và một cho bộ lọc (set trong transition):</p>
${pre('tsx', SN.timChuyen)}
<p>Cả bốn thí nghiệm trong <code>src/vi-du/bai2.tsx</code> vẽ cùng một danh sách 1000 thẻ đã memo:</p>
${pre('tsx', SN.danhSachMemo)}
<p>Bản gốc, một state cho cả ô lẫn danh sách:</p>
${pre('tsx', SN.timThuong)}
<p>Gõ "huy" rồi xoá bằng ba lần Backspace (các lần xoá mới là phần đắt: danh sách phình lại về 1000 thẻ):</p>
${out(OUT.bai2Thuong)}
${out(OUT.bai2Chuyen)}
<p>Ở bản gốc, chữ chỉ hiện khi cả danh sách đã render xong — 49 ms cho lần Backspace thứ hai. Có transition, chữ hiện sau 3–9 ms, danh sách theo sau 18–60 ms, và Event Timing của phím nặng nhất tụt từ 64 ms xuống 32 ms.</p>

<h3><code>useDeferredValue</code>: giá trị đến từ bên ngoài, bạn cho một bản sao đi chậm lại</h3>
<p>Có lúc bạn không phải người gọi <code>set…</code>: giá trị đến qua prop, từ URL, từ store. <code>useDeferredValue(giaTri)</code> cho bạn một bản sao thứ hai của nó đi <em>trễ</em>: trong lần render khẩn nó vẫn giữ giá trị cũ, và React lên lịch một lần render nền để đuổi kịp.</p>
${pre('tsx', SN.timTre)}
${out(OUT.bai2Tre)}
<p>Gần như y hệt số của <code>useTransition</code> — hai hook là cùng một cơ chế nhìn từ hai phía. Có một điều kiện quyết định cả hai: <strong>phần chậm phải bỏ qua được trong lần render khẩn</strong>. Ở đây <code>DanhSach</code> được bọc <code>memo</code> và nhận <code>tuKhoaTre</code>; trong lần render khẩn prop đó chưa đổi, nên React bỏ qua cả danh sách. Không có <code>memo</code>, lần render khẩn vẫn vẽ lại danh sách và chẳng có gì khá lên (react.dev nói đúng điều này trong trang về <code>useDeferredValue</code>).</p>
${SD.chonHookVi}
<table>
<thead><tr><th></th><th><code>useTransition</code></th><th><code>useDeferredValue</code></th></tr></thead>
<tbody>
<tr><td>Bạn viết</td><td><code>startTransition(() =&gt; setX(v))</code></td><td><code>const xTre = useDeferredValue(x)</code></td></tr>
<tr><td>Dùng khi</td><td>bạn là người gọi hàm set</td><td>giá trị đến từ prop, URL, store</td></tr>
<tr><td>Cờ "đang làm"</td><td><code>isPending</code></td><td><code>x !== xTre</code></td></tr>
<tr><td>Nhận thêm</td><td>hàm async (Actions, Bài 12.3)</td><td>giá trị ban đầu: <code>useDeferredValue(x, '')</code></td></tr>
<tr><td>Cần</td><td colspan="2">cây con chậm được memo (hoặc được React Compiler biên dịch)</td></tr>
</tbody></table>
<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202, ô tìm chậm được chữa bằng debounce — <code>setTimeout</code> trong <code>onChange</code>, hoặc <code>debounce</code> của lodash — để danh sách chỉ lọc khi người dùng ngừng gõ 300 ms (Chương 4 cũng dựng <code>useDebounce</code> theo cách đó). → Đi làm với React 18+, khi cái giá nằm ở <em>render</em> (không phải ở request mạng), các đội dùng <code>useDeferredValue</code>/<code>useTransition</code> trước: không có độ trễ cố định, máy nhanh thấy kết quả ngay, máy chậm thì chậm dần một cách êm. · <em>Vì sao:</em> debounce bắt MỌI người dùng chờ 300 ms, kể cả trên laptop nhanh, và khi nó chạy vẫn chặn luồng như thường. Debounce vẫn là công cụ đúng khi mỗi phím gõ sẽ <em>gọi API</em> — hoãn render không làm giảm số request.</p></div>

<h3>Cái bẫy: chính giá trị của ô input nằm trong transition</h3>
<p>Nếu bạn đưa chính <em>chữ</em> vào transition — một state, set bên trong <code>startTransition</code> — thì sao?</p>
${pre('tsx', SN.timChuyenSai)}
${out(OUT.bai2ChuyenSai)}
<p>Ở CPU 4× và mỗi phím cách nhau 60 ms, nó chỉ trông có vẻ chậm (chữ lại phải chờ danh sách). Gõ nhanh hơn trên máy chậm hơn — CPU 6×, mỗi phím cách 10 ms — rồi so chữ cuối cùng trong ô qua 5 lần chạy:</p>
${out(OUT.bai2ThuongNhanh)}
${out(OUT.bai2TreNhanh)}
${out(OUT.bai2SaiNhanh)}
<p>Chữ biến mất. Cơ chế, từng bước:</p>
${SD.matChuVi}
<p>Một ô input có điều khiển (<code>value={…}</code>) phải hiện đúng state mà React đã <em>commit</em>. Khi bạn gõ "n", trình duyệt đặt "n" vào ô, React chạy <code>onChange</code>, nhưng cập nhật state là một transition và chưa commit — nên React trả ô về giá trị đã commit, "". Nếu phím tiếp theo tới trước khi transition commit, trình duyệt nối nó vào "" — và khi các transition cuối cùng commit, một chữ đã mất. Trang <code>useTransition</code> của react.dev có hẳn một mục cho đúng chuyện này: không dùng transition để điều khiển một ô nhập chữ.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — bọc hàm set của ô input trong <code>startTransition</code> "cho gõ nhanh hơn".</strong> Thử tay nhanh trên laptop mạnh thì chẳng có gì sai; lỗi cần một lần render chậm và một người gõ nhanh, tức đúng người dùng đang cầm chiếc điện thoại Android rẻ tiền. Luật này không có ngoại lệ: giá trị hiện <em>bên trong</em> ô input luôn là cập nhật khẩn. Thứ đắt tiền phụ thuộc vào nó — danh sách, biểu đồ, bản xem trước — mới đặt sau transition hay giá trị trễ.</div>

<h3>App của ta dính lỗi này từ Chương 7</h3>
${slide('rx-12', 10, 'Đo thật: ô tìm Chương 8 mất chữ — "nguyen" thành "nuyen" 4 trên 5 lần')}
<p>Ô tìm của Chương 8, không đổi từ Chương 7: <code>value</code> của nó lấy thẳng từ URL (<code>?q=</code>), và <code>KhuBacSi</code> ghi URL ở mỗi phím gõ bằng <code>replace</code>:</p>
${pre('tsx', SN.oTimCu)}
${pre('tsx', SN.khuCu)}
<p>Không ai bọc gì trong <code>startTransition</code> cả. Vậy mà gõ "nguyen", mỗi phím cách 30 ms, trên 1000 bác sĩ:</p>
${out(OUT.goTruocNguyen)}
<p>4 trên 5 lần mất chữ "g". Lần chạy "huy" + ba Backspace cho thấy vì sao nó có cảm giác ì ngay cả khi không mất chữ: chữ hiện <em>đúng lúc</em> danh sách đổi (hai cột cùng một số), trễ tới 138 ms sau khi bấm.</p>
${out(OUT.goTruocXoa)}
${slide('rx-12', 11, 'Thủ phạm: React Router bọc mọi lần đổi URL trong startTransition')}
<p>Transition đó là của React Router. <code>RouterProvider</code> áp dụng mọi lần điều hướng — kể cả <code>setSearchParams</code> — như sau (trích <code>node_modules/react-router/dist/development/lib/components.js</code>, bản 8.4.0):</p>
${pre('js', SN.rrSetState)}
<p>và file định nghĩa kiểu ghi lại lối thoát duy nhất (<code>NavigateOptions</code> trong <code>lib/context.d.ts</code>):</p>
${pre('ts', SN.rrFlushSyncDoc)}
<p>Vậy một ô input có <code>value</code> là URL, theo đúng cấu tạo, là một ô input bị một transition điều khiển — đúng cái mẫu react.dev cảnh báo. Mẫu này rất phổ biến (Chương 7 dạy nó, rất nhiều bài hướng dẫn cũng dạy); nó chỉ vỡ khi việc render URL mới đủ chậm để phím kế tiếp tới trước. Với 6 bác sĩ chuyện đó không bao giờ xảy ra. Với 1000 bác sĩ nó xảy ra phần lớn các lần.</p>

<h3>Cách sửa thứ nhất: <code>flushSync</code> — đúng, nhưng chặn bàn phím</h3>
${slide('rx-12', 12, 'flushSync hết mất chữ nhưng chặn bàn phím: tới 152 ms cho một phím')}
<p>Thử lựa chọn có trong tài liệu trước: điều hướng với <code>flushSync: true</code>, làm cho việc đổi URL đồng bộ trở lại:</p>
${pre('ts', SN.flushSyncThu)}
${out(OUT.goFlushNguyen)}
${out(OUT.goFlushXoa)}
<p>Hết mất chữ. Nhưng giờ mỗi phím phải render mọi thứ xong trình duyệt mới được vẽ — Event Timing tới 152 ms, chữ trễ tới 122 ms. Và thêm <code>useDeferredValue</code> cho danh sách lên trên cũng không đỡ (đo trong lúc điều tra: phím đầu vẫn 54–70 ms). Lý do khá tinh: <strong>việc đổi URL tới được MỌI <code>&lt;Link&gt;</code> qua context</strong>, mà context thì đi xuyên qua <code>memo</code>. Mỗi thẻ bác sĩ có một <code>Link</code> "Xem chi tiết"; <code>Link</code> đọc context vị trí (location) của router để tính <code>href</code>; vị trí đổi thì cả 1000 cái render lại ngay trong lần render khẩn, dù nằm trong một danh sách đã memo. Đo trong jsdom, cùng lần render khẩn, thẻ có và không có link:</p>
${out(OUT.linkContext)}
<div class="callout"><p><strong>JS/React nhắc nhanh — context và <code>memo</code>.</strong> <code>memo</code> bỏ qua một component khi <em>props</em> của nó không đổi. Một component đọc context bằng <code>useContext</code> (hoặc qua một hook như <code>useLocation</code>) sẽ render lại mỗi khi giá trị context đó đổi, dù nó nằm ở đâu trong cây và dù cha nó có được bỏ qua hay không. Vì thế một context "toàn cục" đổi liên tục là đắt (Chương 5 cũng nói điều này về một context to cho cả app).</p></div>

<h3>Cách sửa thứ hai: chữ trong ô là state của chính cái ô</h3>
${slide('rx-12', 13, 'useTransition hay useDeferredValue: cùng cơ chế, khác chỗ đặt — và không bao giờ là chính ô input')}
<p>Bài học từ các thí nghiệm: giữ con đường khẩn thật <em>nhỏ</em>. Gõ phím chỉ nên cập nhật một component nhỏ — cái ô — và không đụng thứ gì đọc URL. Khi đó URL, và danh sách đọc URL, cứ việc theo sau trong transition của React Router, đúng thứ ta muốn cho chúng. Vậy cái ô có state riêng:</p>
${pre('tsx', SN.oTimMoi)}
<p>Ba chi tiết làm nó đúng:</p>
<ul>
<li><strong><code>value={go}</code></strong>: ô hiện state của chính nó, được set đồng bộ trong <code>onChange</code>. Nó không bao giờ chờ URL, nên không bao giờ bị trả về một giá trị URL cũ.</li>
<li><strong>Theo URL khi URL đổi vì lý do khác.</strong> Bấm "Bác sĩ" trên menu (PUSH tới <code>/bac-si</code>) hay bấm Back (POP) phải cập nhật ô. Ô luôn ghi URL bằng REPLACE, nên luật là "nhận giá trị URL mới trừ khi lần điều hướng đó là REPLACE". Việc này làm ngay trong lúc render theo mẫu "điều chỉnh state khi prop đổi" của Bài 4.2, không dùng effect.</li>
<li><strong>"Đang lọc…"</strong> hiện khi <code>go !== tuKhoa</code> — ô đang đi trước URL. Nó mang <code>aria-hidden</code>: nó nhấp nháy ở mỗi phím và sẽ là tiếng ồn với trình đọc màn hình.</li>
</ul>
<p><code>useTransition</code> ở đâu? Ở trong React Router — việc đổi URL, và 1000 <code>Link</code> phản ứng theo nó, vốn đã chạy trong transition của nó. Việc của ta là kéo ô input ra khỏi transition đó. (<code>useTransition</code> viết tường minh trong dự án sẽ xuất hiện ở Bài 12.3, nơi ta cần <code>isPending</code>.)</p>
${slide('rx-12', 14, 'Ô tìm có state riêng: chữ hiện trong 15 ms, danh sách theo sau')}
${out(OUT.goSauNguyen)}
${out(OUT.goSauXoa)}
<table>
<thead><tr><th>Chromium, CPU 4×, 1000 bác sĩ (trung vị 5 lần)</th><th>Chương 8</th><th><code>flushSync</code></th><th>State riêng (bản cuối)</th></tr></thead>
<tbody>
<tr><td>Gõ "nguyen", mỗi phím 30 ms — chữ cuối cùng</td><td>"nuyen" 4/5</td><td>"nguyen" 5/5</td><td><strong>"nguyen" 5/5</strong></td></tr>
<tr><td>Chữ hiện chậm nhất ("huy⌫⌫⌫")</td><td>138 ms</td><td>122 ms</td><td><strong>15 ms</strong></td></tr>
<tr><td>Event Timing chậm nhất ("huy⌫⌫⌫")</td><td>40 ms</td><td>152 ms</td><td><strong>40 ms</strong></td></tr>
<tr><td>Danh sách đổi sau phím nặng nhất</td><td>138 ms</td><td>122 ms</td><td>145 ms</td></tr>
</tbody></table>
<p>Đọc dòng cuối cho trung thực: danh sách không nhanh hơn — nó vẫn phải mount tới 1000 thẻ với 1000 link. Cái đổi là không ai phải chờ nó nữa. Làm chính danh sách rẻ đi là việc của Chương 13 (virtualization: chỉ vẽ các thẻ đang nằm trên màn hình).</p>
${slide('rx-12', 15, 'Màn hình thật: chữ đã ở trong ô, danh sách còn 1000 bác sĩ và "Đang lọc…"')}
<p>Ảnh chụp với CPU chậm 40 lần (chỉ để bắt kịp khoảnh khắc): "h" đã ở trong ô, "Đang lọc…" nằm cạnh, và tiêu đề vẫn ghi 1000.</p>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "<code>useTransition</code> và <code>useDeferredValue</code> khác nhau thế nào? Khi nào dùng chúng thay cho debounce?"</p>
<p>Cả hai đánh dấu một việc là không khẩn để React render nó ở nền, ngắt được, và giữ cho các cập nhật khẩn như gõ phím luôn nhanh. <code>useTransition</code> bọc một cập nhật state do mình gọi và cho <code>isPending</code>; <code>useDeferredValue</code> nhận một giá trị mình được đưa (prop, URL, store) và trả về một bản sao đi trễ. Cả hai chỉ có ích nếu phần chậm bỏ qua được trong lần render khẩn — đã memo hoặc đã được compiler biên dịch. Em dùng chúng khi cái giá nằm ở render; dùng debounce khi mỗi lần đổi sẽ gọi mạng. Và em không bao giờ đưa chính giá trị của ô input vào transition — em đã đo được một ô tìm mất chữ đúng vì router bọc việc đổi URL trong <code>startTransition</code>.</p></div>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "'Concurrent rendering' trong React 18/19 nghĩa là gì?"</p>
<p>React có thể chuẩn bị một lần render mà chưa commit nó: làm từng lát nhỏ, nhường trình duyệt giữa các lát, và có thể vứt một lần render dở dang nếu có cập nhật khẩn hơn tới. Nó bật theo từng cập nhật qua transition, giá trị trễ và Suspense. Nó không làm render nhanh hơn; nó đổi <em>thứ tự ưu tiên</em>, để trang vẫn phản hồi trong lúc việc nặng tiếp tục chạy.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 2/4: ô tìm không bao giờ mất chữ</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau bước 1/4 (<code>src/features/bac-si/components/OTimBacSi.tsx</code> còn <code>value={tuKhoa}</code> lấy thẳng từ URL).</p><ol>
<li>Cho <code>OTimBacSi</code> một state riêng <code>go</code>, khởi tạo từ <code>tuKhoa</code>; <code>onChange</code> set nó, rồi mới gọi <code>onDoi</code>.</li>
<li>Theo các lần URL đổi không do ô gây ra: giữ <code>tuKhoaDaThay</code> trong state, so sánh ngay lúc render, nhận giá trị URL trừ khi <code>useNavigationType() === 'REPLACE'</code>.</li>
<li>Bọc label + một <code>&lt;span className="dang-loc" aria-hidden="true"&gt;Đang lọc…&lt;/span&gt;</code> (chỉ khi <code>go !== tuKhoa</code>) trong <code>div.o-tim-boc</code>; chữ của label phải giữ đúng "Tìm theo tên".</li>
<li>Không dùng <code>flushSync</code>, không bọc gì trong <code>startTransition</code> — đo bằng <code>do/do-go.mjs</code> nếu bạn có Playwright.</li>
</ol>
<p><strong>Đạt khi:</strong> ba test trong <code>src/features/bac-si/OTimBacSi.test.tsx</code> xanh, test của Chương 8 "gõ tìm huy: thẻ còn lại KHÔNG chạy lại" vẫn xanh, và (không bắt buộc, Chromium) <code>node do/do-go.mjs --phim "n,g,u,y,e,n" --cach 30</code> kết thúc với "nguyen" cả 5 lần.</p></div>
${pre('tsx', SN.test122)}
${pre('tsx', SN.test122c)}
<p>Chạy trên ô tìm của Chương 8, test đầu hỏng (hai test sau qua — ô cũ vốn theo URL):</p>
${out(OUT.tieuChi122Truoc)}
<details><summary>Lời giải</summary>
<p><strong>src/features/bac-si/components/OTimBacSi.tsx</strong> in đầy đủ ở mục "Cách sửa thứ hai" phía trên, cộng hai luật CSS trong <code>src/index.css</code>: <code>.o-tim-boc { display: flex; align-items: center; gap: 10px; }</code> và <code>.dang-loc { font-size: 0.85em; color: #64748b; }</code>. <code>KhuBacSi</code> không đổi: vẫn truyền <code>tuKhoa</code> từ URL và ghi bằng <code>'replace'</code>. Chạy ngày 26/09/2026: <code>npx tsc -b</code> không in gì; <code>npx vitest run src/features</code> → 2 file, 6 test xanh; cả bộ 32 test ở bước này.</p>
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> tái hiện chữ bị mất trong bản thí nghiệm riêng, rồi sửa bằng hai cách.</p><ol>
<li>Build và mở <code>/thu-go.html?kieu=chuyen-sai&amp;nhieu=1000</code> (<code>npx vite build --config vite.vi-du.config.ts</code>, rồi <code>npx vite preview</code>). Trong Chrome DevTools → Performance, đặt CPU "6× slowdown". Gõ "nguyen" nhanh hết sức, năm lần (xoá ô giữa các lần). Ghi lại chữ còn trong ô.</li>
<li>Đổi sang <code>?kieu=tre</code> và làm lại.</li>
<li>Trong <code>TimChuyenSai</code>, giữ <em>một</em> state nhưng sửa chỉ bằng <code>useDeferredValue</code> (không <code>startTransition</code>): phải đổi gì, và <code>DanhSach</code> phải nhận gì?</li>
</ol><p><strong>Đạt khi:</strong> bước 1 ra ít nhất một chữ sai (các lần đo ra "nuyen" và "en"); bước 2 lần nào cũng "nguyen"; bản bước 3 của bạn lần nào cũng "nguyen" và <code>npx tsc -b</code> sạch.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">concurrent rendering (render đồng thời)</span><span class="v">React render theo từng lát ngắt được và có thể vứt một lần render dở</span></div>
<div class="kv"><span class="k">transition</span><span class="v">cập nhật được đánh dấu không khẩn; giao diện cũ vẫn dùng được tới khi nó commit</span></div>
<div class="kv"><span class="k"><code>useTransition</code></span><span class="v">trả về <code>[isPending, startTransition]</code>; cập nhật bên trong là transition</span></div>
<div class="kv"><span class="k"><code>useDeferredValue</code></span><span class="v">trả về một bản sao của giá trị, đi trễ trong các lần render khẩn</span></div>
<div class="kv"><span class="k">cập nhật khẩn (urgent)</span><span class="v">phải hiện ngay: gõ phím, bấm, bật tắt</span></div>
<div class="kv"><span class="k"><code>flushSync</code></span><span class="v">ép một cập nhật render và commit đồng bộ ngay</span></div>
<div class="kv"><span class="k">Event Timing / INP</span><span class="v">phép đo của trình duyệt: một tương tác mất bao lâu tới lần vẽ kế tiếp</span></div>
<div class="kv"><span class="k">debounce</span><span class="v">chỉ chạy sau khi ngừng gõ N ms — hợp cho request mạng</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi phím gõ là một cập nhật khẩn (chữ) cộng có thể một việc không khẩn (danh sách); transition cho React làm việc thứ hai theo từng lát ngắt được.</li>
<li><code>useTransition</code> khi bạn gọi hàm set (có <code>isPending</code>); <code>useDeferredValue</code> khi giá trị đến từ ngoài. Cả hai cần phần chậm được memo.</li>
<li>Không bao giờ đưa giá trị của chính ô input vào transition: đo được "nguyen" thành "nuyen"/"en".</li>
<li>React Router bọc mọi lần đổi URL trong <code>startTransition</code>; ô input có <code>value</code> là URL mất chữ 4/5 lần trên 1000 bác sĩ.</li>
<li><code>flushSync</code> sửa được tính đúng nhưng chặn tay (152 ms): đổi URL làm mọi <code>Link</code> render lại qua context, xuyên qua <code>memo</code>.</li>
<li>Cách sửa: ô giữ state riêng (chữ ≤ 15 ms), theo URL khi PUSH/POP, để URL và danh sách theo sau trong transition của router.</li>
</ul>

${LINK('https://react.dev/reference/react/useTransition', '📄', 'react.dev — useTransition', 'isPending, và vì sao transition không điều khiển được ô input.')}
${LINK('https://react.dev/reference/react/useDeferredValue', '📄', 'react.dev — useDeferredValue', 'Hiện nội dung cũ trong lúc gõ; bắt buộc có memo.')}
${LINK('https://reactrouter.com/api/hooks/useSearchParams', '🧭', 'React Router — useSearchParams', 'setSearchParams và các tuỳ chọn điều hướng (flushSync).')}
${LINK('https://web.dev/articles/inp', '⏱', 'web.dev — Interaction to Next Paint', 'Chỉ số đứng sau Event Timing; 200 ms là "tốt".')}
</div>
`,
};

/* Output cắt sẵn cho Bài 12.3 */
const O3 = {
  reset: OUT.bai3.split('\n').slice(0, 3).join('\n'),
  lacQuan: OUT.bai3.split('\n')[3],
  nemLoi: OUT.bai3.split('\n')[4],
  formStatus: OUT.bai3.split('\n')[5],
};
const L3 = {
    title: '12.3 — Actions: useOptimistic, useActionState, useFormStatus and form action|||12.3 — Actions: useOptimistic, useActionState, useFormStatus và form action',
    slug: 'rx-12-3-actions',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Action là hàm async chạy trong transition: huỷ lịch lạc quan bằng useOptimistic (tự quay về khi lỗi), form góp ý bằng form action + useActionState + useFormStatus, bẫy React tự reset form làm mất chữ, và ba bẫy khác đo thật.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>Actions: useOptimistic, useActionState, useFormStatus and form action</h2>
<p class="lead">Lessons 12.1 and 12.2 dealt with reading: data that is not here yet, a list that is slow to draw. This lesson is about writing — sending something to the server and deciding what the screen shows before it answers. React 19 calls such a function an <strong>Action</strong> and gives it four helpers. We use them for two things in the clinic app: cancelling an appointment (the screen says "Đã huỷ" at once and quietly goes back if the server refuses) and a new feedback form (validation, "sending…", errors, success — with no <code>useState</code> per field and no <code>onSubmit</code>).</p>
<p>Setup: the project after step 2/4 (React 19.3.0, TanStack Query 5.103.3, MSW 2.15.0, Vitest 5.0.2). Experiments live in <code>src/vi-du/bai3.tsx</code>.</p>

<h3>What React 19 calls an Action</h3>
${slide('rx-12', 16, 'An Action is an async function run inside a transition: isPending covers the whole wait')}
<p>In Lesson 12.2, <code>startTransition</code> received a normal function. Since React 19 it also accepts an <code>async</code> function, and then <code>isPending</code> stays <code>true</code> for the <em>whole</em> function — including every <code>await</code> — not just for the render. That async function is an Action. You meet it in three places:</p>
<ul>
<li><code>startTransition(async () =&gt; { … })</code> from <code>useTransition</code> — the general form;</li>
<li><code>&lt;form action={fn}&gt;</code> — React calls <code>fn(formData)</code> as an Action when the form is submitted;</li>
<li><code>useActionState(fn, initialState)</code> — an Action whose return value becomes state.</li>
</ul>
<div class="callout"><p><strong>JS quick reminder — <code>async</code>/<code>await</code> and <code>try/catch</code>.</strong> An <code>async</code> function always returns a Promise. Inside it, <code>await p</code> waits for <code>p</code>; if <code>p</code> is rejected, <code>await</code> <em>throws</em> at that line, and the nearest <code>try { … } catch (loi) { … }</code> around it receives the error. Without a <code>try/catch</code>, the error rejects the function's own Promise — and who handles that depends on who called it. For Actions, the answer is "an error boundary", which is why the traps section matters.</p></div>

<h3><code>useOptimistic</code>: show the result before the server confirms</h3>
${slide('rx-12', 17, 'useOptimistic: "Đã huỷ" appears at once and falls back to real data when the Action ends')}
<p><code>const [hienThi, themLacQuan] = useOptimistic(thatSu, capNhat)</code>. Outside an Action, <code>hienThi</code> is simply <code>thatSu</code>. Inside an Action, every <code>themLacQuan(x)</code> applies <code>capNhat(hienThi, x)</code> on top. When the Action ends — success or failure — React throws the optimistic layer away and <code>hienThi</code> is <code>thatSu</code> again. The trick is to make sure <code>thatSu</code> is already the new server data by then:</p>
${pre('tsx', SN.danhSachLichHen)}
${SD.huyEn}
<p>The two lines that matter most are the <code>await huy.mutateAsync(lh)</code> and the empty <code>catch</code>. <code>mutateAsync</code> (TanStack Query) resolves only after <code>onSettled</code> has finished, and our <code>onSettled</code> <em>returns</em> the invalidation promises — so by the time the Action ends, the list has been refetched and already says "Đã huỷ". If the server fails, <code>mutateAsync</code> throws, we swallow it (the global <code>MutationCache</code> from Chapter 6 already shows "Không huỷ được lịch hẹn — đã hoàn tác"), the Action ends, and the row goes back to "Chờ xác nhận" by itself. The button renders <code>onClick={() =&gt; huyLich(lh)}</code>:</p>
${pre('tsx', SN.nutHuy)}

<h3>Chapter 6 did this with <code>onMutate</code> — what changes</h3>
${slide('rx-12', 18, 'From onMutate + snapshot + manual rollback to useOptimistic')}
<p>Chapter 6 built the same behaviour inside TanStack Query:</p>
${pre('ts', SN.huyCu)}
<p>After this lesson the mutation only sends and refreshes:</p>
${pre('ts', SN.huyMoi)}
<table>
<thead><tr><th></th><th>Chapter 6: <code>onMutate</code></th><th>Chapter 12: <code>useOptimistic</code></th></tr></thead>
<tbody>
<tr><td>Where the optimistic value lives</td><td>in the shared query cache</td><td>in one component, only during the Action</td></tr>
<tr><td>Rollback on error</td><td>by hand: snapshot + <code>setQueryData</code> in <code>onError</code></td><td>automatic when the Action ends</td></tr>
<tr><td>Race with a refetch in flight</td><td>by hand: <code>cancelQueries</code></td><td>not needed: the cache is never touched</td></tr>
<tr><td>Other components (e.g. the Header badge)</td><td>see the optimistic value at once</td><td>see the change when the refetch lands</td></tr>
<tr><td>"Saving…" flag</td><td><code>isPending</code> of the mutation</td><td><code>isPending</code> of the transition</td></tr>
</tbody></table>
<p>The fourth row is a real trade-off, read straight from the code: the Header counts appointments from the same cache (<code>data?.filter(…).length</code>), so with <code>useOptimistic</code> its badge changes when the server has answered, not at the click. When many parts of the page must show the optimistic value, keep the cache approach; when one list is the only place that cares, <code>useOptimistic</code> is shorter and cannot forget to roll back.</p>

<h3><code>&lt;form action&gt;</code> + <code>useActionState</code>: the return value is the new state</h3>
${slide('rx-12', 19, 'form action + useActionState: new state = whatever the Action returns')}
<p>The feedback form below the appointment list has a star rating, an optional name and a message of 10–500 characters. The whole logic is one function — React calls it with the previous state and the form's <code>FormData</code>, and what it returns becomes the next state:</p>
${pre('tsx', SN.guiGopY)}
<p>The API call and the mock server, which validates again (a browser check never replaces a server check — anyone can call the API directly):</p>
${pre('ts', SN.apiGopY)}
${pre('ts', SN.mswGopY)}
<p>The button reads the pending state of the form it sits in, with <code>useFormStatus</code> from <code>react-dom</code> — no prop needed:</p>
${pre('tsx', SN.nutGui)}
<p>And the form:</p>
${pre('tsx', SN.formGopY)}
${SD.formActionEn}
<div class="callout"><p><strong>JS quick reminder — <code>FormData</code>.</strong> <code>new FormData(formElement)</code> (or what React hands to an Action) collects every field that has a <code>name</code>: <code>fd.get('noiDung')</code> returns its value as a string (or a <code>File</code>, or <code>null</code> if absent). Radio buttons with the same <code>name</code> give the value of the checked one. That is why the fields have <code>name</code> and no <code>value</code>/<code>onChange</code>: they are <em>uncontrolled</em>, the browser keeps their text.</p></div>
<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202, a form is <code>onSubmit={handleSubmit}</code> with <code>e.preventDefault()</code>, one <code>useState</code> per field, a <code>loading</code> state and an <code>error</code> state set by hand around <code>await axios.post(…)</code> (sometimes dispatched through a Redux thunk). → At work in 2026 there are two good answers: React Hook Form + Zod (Chapter 3) for rich client-side forms like booking, and <code>&lt;form action&gt;</code> + <code>useActionState</code> for simple forms — and it is the native model in Next.js, where the Action can be a Server Action. · <em>Why:</em> the Action version has no <code>preventDefault</code> to forget, no loading flag to reset in a <code>finally</code>, and the submit button learns about "sending" by itself. The hand-written version is not wrong (we wrote it below as <code>FormKieuCu</code> and it works); it is simply more places to make a mistake.</p></div>

<h3>React resets the form after the Action — even when it failed</h3>
${slide('rx-12', 20, 'React 19 resets the form after the Action: without defaultValue from state, the text is gone')}
<p>After an Action submitted through <code>&lt;form action&gt;</code> finishes, React 19 resets the form — uncontrolled fields go back to their <code>defaultValue</code>. That is lovely after a success (the form is empty for the next message) and terrible after a validation error (the user's text is gone). Three versions of the same form, type "Tốt" and press send:</p>
${pre('tsx', SN.formMatChu)}
${out(O3.reset)}
<p><code>FormMatChu</code> loses the text. <code>FormGopY</code> keeps it because the Action returns what was typed (<code>giaTri</code>) and the fields use <code>defaultValue={giaTri.noiDung}</code>: React re-renders with the new default first, then resets to it. <code>FormKieuCu</code> — the pre-19 way — keeps it too, because its textarea is controlled:</p>
${pre('tsx', SN.formKieuCu)}
<p>The real screen, after sending "Tốt": the text is still there, the field is marked <code>aria-invalid</code>, and the message is tied to it with <code>aria-describedby</code> (axe reports zero violations for this state in the project's test).</p>
<div class="pitfall co-tieu-de"><strong>Trap — "my form clears itself on error".</strong> Nothing is wrong with your state; it is the automatic reset. Either return the submitted values and use them as <code>defaultValue</code> (this lesson), or make the fields controlled. Do not try to "prevent" the reset with <code>e.preventDefault()</code> — with <code>action</code> there is no submit handler to put it in.</div>

<h3>Three more traps, measured</h3>
${slide('rx-12', 21, 'Three Action traps: throwing, optimistic updates outside a transition, useFormStatus outside the form')}
<p><strong>1 — Throwing out of an Action.</strong> An error that escapes an Action is rethrown during render, so the nearest error boundary takes over:</p>
${pre('tsx', SN.nemLoi)}
${out(O3.nemLoi)}
${SD.loiActionEn}
<p><strong>2 — Calling the optimistic setter outside an Action.</strong></p>
${pre('tsx', SN.lacQuanSai)}
${out(O3.lacQuan)}
<p><strong>3 — <code>useFormStatus</code> in the component that renders the <code>&lt;form&gt;</code>.</strong> It reads the status of a <em>parent</em> form; the component that renders the form has none, so <code>pending</code> is always <code>false</code> — measured, the label never changes (compare with the project's <code>NutGui</code>, whose test sees "Đang gửi…"):</p>
${pre('tsx', SN.formNutSai)}
${out(O3.formStatus)}
<div class="callout"><p><strong>Common interview question.</strong> "What are Actions in React 19? What do <code>useActionState</code>, <code>useFormStatus</code> and <code>useOptimistic</code> do?"</p>
<p>An Action is an async function run in a transition — through <code>startTransition</code>, <code>&lt;form action&gt;</code> or <code>useActionState</code> — so React tracks its pending state until it finishes. <code>useActionState(fn, initial)</code> returns <code>[state, dispatch, isPending]</code>, and <code>fn(prevState, payload)</code>'s return value becomes the next state — good for form results and errors. <code>useFormStatus</code> lets a component inside a form read whether that form is submitting. <code>useOptimistic</code> shows a temporary value during an Action and drops it automatically when the Action ends, so the real data must be refreshed before it ends. Errors inside Actions should be caught and returned, otherwise they reach the error boundary.</p></div>
<div class="callout"><p><strong>Common interview question.</strong> "Would you still use React Hook Form in React 19?"</p>
<p>Yes, for forms with rich client-side validation, many fields, dynamic arrays or field-level errors while typing — like our booking form with Zod. For a small form whose logic is "send, show the result", <code>&lt;form action&gt;</code> + <code>useActionState</code> is less code; in Next.js it also works with Server Actions and progressive enhancement. They can also be combined.</p></div>

<h3>🛠 Keep building the project — step 3/4: optimistic cancel and a feedback form</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after step 2/4 (<code>src/features/lich-hen/useLichHen.ts</code> with <code>onMutate</code>, <code>DanhSachLichHen.tsx</code> calling <code>huy.mutate(lh)</code>, <code>src/pages/TrangLichHen.tsx</code>).</p><ol>
<li><code>useHuyLichHen</code>: remove <code>onMutate</code>/<code>onError</code>, keep <code>onSettled</code> returning the invalidations and the <code>meta.thongBaoLoi</code>.</li>
<li><code>DanhSachLichHen</code>: <code>useOptimistic</code> over <code>lichHen</code>, <code>useTransition</code>, a <code>huyLich</code> Action with <code>try/catch</code>; show <code>&lt;p role="status"&gt;Đang lưu…&lt;/p&gt;</code> while pending.</li>
<li>Add <code>GopY</code> + <code>api.guiGopY</code>, and the <code>POST /api/gop-y</code> handler (validates again, 201 <code>{ id: 'gy-N' }</code>).</li>
<li>Create <code>src/features/gop-y/</code> (<code>FormGopY.tsx</code> with <code>guiGopY</code>, <code>NutGui</code>; <code>index.ts</code>) and render <code>&lt;FormGopY /&gt;</code> under the list in <code>TrangLichHen</code>. Labels exactly: "Góp ý của bạn", "Họ tên (không bắt buộc)", radios named "1 sao"…"5 sao".</li>
</ol>
<p><strong>Done when:</strong> <code>src/features/lich-hen/DanhSachLichHen.test.tsx</code> (2 tests) and <code>src/features/gop-y/FormGopY.test.tsx</code> (4 tests, including axe) are green, with everything else.</p></div>
${pre('tsx', SN.test123a)}
${pre('tsx', SN.test123b)}
<p>Against the step-2 project (with an empty <code>FormGopY</code> stub so the file compiles), the Chapter 6 cancel still passes its error test — rollback worked there too — but nothing else does:</p>
${out(OUT.tieuChi123Truoc)}
<details><summary>Solution</summary>
<p>All code is printed above: <code>useHuyLichHen</code>, the beginning of <code>DanhSachLichHen</code> and its button, <code>GopY</code>/<code>api.guiGopY</code>, the MSW handler (plus <code>let soGopY = 0;</code> at the top of <code>handlers.ts</code> and <code>delay</code> imported from <code>msw</code>), and the whole <code>FormGopY.tsx</code> (<code>guiGopY</code>, <code>NutGui</code>, <code>FormGopY</code>). CSS: the stars reuse <code>chip-hang chon-ngay</code>; <code>app.css</code> gets <code>.gop-y</code>, <code>.o-nhap</code> and a red border for <code>textarea[aria-invalid='true']</code>. Run on 26/09/2026: <code>npx tsc -b</code> printed nothing; <code>npx vitest run</code> → 42 tests green at this step (45 after the axe test and step 4).</p>
${out(OUT.tieuChi123Sau)}
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> break the cancel on purpose, three ways.</p><ol>
<li>Remove the <code>try/catch</code> around <code>await huy.mutateAsync(lh)</code>. Run the "máy chủ lỗi 500" test.</li>
<li>Put it back, but replace <code>await huy.mutateAsync(lh)</code> with <code>huy.mutate(lh)</code> (no await). Run the first 12.3 test.</li>
<li>Put it back. In <code>useHuyLichHen</code>, make <code>onSettled</code> not return the <code>Promise.all</code> (use braces without <code>return</code>). Run both tests and watch the row.</li>
</ol><p><strong>Done when:</strong> you can explain each failure: step 1 — the error escapes the Action: the 500 test fails and Vitest reports an unhandled error <code>{ status: 500 }</code> (in the app, an error boundary would take over); step 2 — the Action ends immediately, so the optimistic "Đã huỷ" is dropped before the server answers and both 12.3 tests fail; step 3 — the Action ends before the refetch, so the first test fails: the row is back to "Chờ xác nhận" when "Đang lưu…" disappears. Undo everything and the suite is green.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Action</span><span class="v">an async function run inside a transition; React tracks its pending state until it finishes</span></div>
<div class="kv"><span class="k"><code>useOptimistic</code></span><span class="v">temporary value shown during an Action, dropped automatically when it ends</span></div>
<div class="kv"><span class="k"><code>useActionState</code></span><span class="v"><code>[state, dispatch, isPending]</code>; the Action's return value becomes state</span></div>
<div class="kv"><span class="k"><code>useFormStatus</code></span><span class="v">from <code>react-dom</code>; a child of a form reads whether that form is submitting</span></div>
<div class="kv"><span class="k"><code>&lt;form action={fn}&gt;</code></span><span class="v">React calls <code>fn(formData)</code> as an Action on submit, then resets the form</span></div>
<div class="kv"><span class="k">uncontrolled field</span><span class="v">input with <code>name</code>/<code>defaultValue</code>, its text kept by the browser</span></div>
<div class="kv"><span class="k">optimistic update</span><span class="v">show the expected result before the server confirms, roll back on failure</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An Action is an async function in a transition; <code>isPending</code> covers every <code>await</code>.</li>
<li><code>useOptimistic</code> + <code>await mutateAsync</code> (which waits for the refetch) gives "Đã huỷ" at the click and an automatic fallback on error — no snapshot, no manual rollback.</li>
<li>Trade-off: the optimistic value is local; components reading the cache see the change after the refetch.</li>
<li><code>&lt;form action&gt;</code> + <code>useActionState</code>: validate, call the API, return the new state; <code>useFormStatus</code> in a child for "Đang gửi…".</li>
<li>React resets the form after the Action: return the typed values and use them as <code>defaultValue</code>, or the text is lost (measured: "" vs "Tốt").</li>
<li>Catch errors inside Actions (uncaught ⇒ error boundary), call optimistic setters only inside Actions, use <code>useFormStatus</code> only below the form.</li>
</ul>

${LINK('https://react.dev/reference/react/useOptimistic', '📄', 'react.dev — useOptimistic', 'Optimistic state during an Action.')}
${LINK('https://react.dev/reference/react/useActionState', '📄', 'react.dev — useActionState', 'State from the result of an Action.')}
${LINK('https://react.dev/reference/react-dom/hooks/useFormStatus', '📄', 'react.dev — useFormStatus', 'Pending state of the parent form.')}
${LINK('https://react.dev/reference/react-dom/components/form', '📄', 'react.dev — &lt;form&gt;', 'The action prop and the automatic reset.')}
${LINK_TRONG('/courses/nextjs', '▲', 'Next up: Next.js course, Chapter 12 — Server Actions', 'The same form, with the Action running on the server.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Actions: useOptimistic, useActionState, useFormStatus và form action</h2>
<p class="lead">Bài 12.1 và 12.2 lo chuyện đọc: dữ liệu chưa về, danh sách vẽ chậm. Bài này lo chuyện ghi — gửi một thứ lên máy chủ và quyết định màn hình hiện gì trước khi máy chủ trả lời. React 19 gọi một hàm như thế là <strong>Action</strong> và cho nó bốn công cụ đi kèm. Ta dùng chúng cho hai việc trong app phòng khám: huỷ lịch hẹn (màn hình báo "Đã huỷ" ngay và lặng lẽ quay lại nếu máy chủ từ chối) và một form góp ý mới (kiểm dữ liệu, "đang gửi…", lỗi, thành công — không <code>useState</code> cho từng ô, không <code>onSubmit</code>).</p>
<p>Chuẩn bị: dự án sau bước 2/4 (React 19.3.0, TanStack Query 5.103.3, MSW 2.15.0, Vitest 5.0.2). Các thí nghiệm nằm ở <code>src/vi-du/bai3.tsx</code>.</p>

<h3>React 19 gọi cái gì là Action</h3>
${slide('rx-12', 16, 'Action là hàm async chạy trong transition: isPending phủ trọn lúc chờ')}
<p>Ở Bài 12.2, <code>startTransition</code> nhận một hàm bình thường. Từ React 19 nó nhận được cả hàm <code>async</code>, và khi đó <code>isPending</code> giữ <code>true</code> suốt <em>cả</em> hàm — gồm mọi <code>await</code> — chứ không chỉ lúc render. Hàm async đó là một Action. Bạn gặp nó ở ba chỗ:</p>
<ul>
<li><code>startTransition(async () =&gt; { … })</code> lấy từ <code>useTransition</code> — dạng tổng quát;</li>
<li><code>&lt;form action={fn}&gt;</code> — React gọi <code>fn(formData)</code> như một Action khi form được gửi;</li>
<li><code>useActionState(fn, stateBanDau)</code> — một Action mà giá trị trả về trở thành state.</li>
</ul>
<div class="callout"><p><strong>JS nhắc nhanh — <code>async</code>/<code>await</code> và <code>try/catch</code>.</strong> Hàm <code>async</code> luôn trả về một Promise. Bên trong nó, <code>await p</code> chờ <code>p</code>; nếu <code>p</code> bị từ chối, <code>await</code> <em>ném lỗi</em> ngay tại dòng đó, và <code>try { … } catch (loi) { … }</code> gần nhất bao quanh sẽ nhận lỗi. Không có <code>try/catch</code> thì lỗi làm Promise của chính hàm bị từ chối — và ai xử lý thì tuỳ ai gọi hàm. Với Action, câu trả lời là "error boundary", nên mục các cái bẫy bên dưới rất quan trọng.</p></div>

<h3><code>useOptimistic</code>: hiện kết quả trước khi máy chủ xác nhận</h3>
${slide('rx-12', 17, 'useOptimistic: "Đã huỷ" hiện ngay và tự quay về dữ liệu thật khi Action xong')}
<p><code>const [hienThi, themLacQuan] = useOptimistic(thatSu, capNhat)</code>. Ngoài Action, <code>hienThi</code> chính là <code>thatSu</code>. Trong Action, mỗi lần <code>themLacQuan(x)</code> áp <code>capNhat(hienThi, x)</code> lên trên. Khi Action kết thúc — được hay hỏng — React vứt lớp lạc quan đi và <code>hienThi</code> lại là <code>thatSu</code>. Mẹo là bảo đảm tới lúc đó <code>thatSu</code> đã là dữ liệu mới từ máy chủ:</p>
${pre('tsx', SN.danhSachLichHen)}
${SD.huyVi}
<p>Hai dòng quan trọng nhất là <code>await huy.mutateAsync(lh)</code> và cái <code>catch</code> rỗng. <code>mutateAsync</code> (TanStack Query) chỉ xong khi <code>onSettled</code> đã chạy xong, mà <code>onSettled</code> của ta <em>trả về</em> các promise invalidate — nên lúc Action kết thúc, danh sách đã được tải lại và đã ghi "Đã huỷ". Nếu máy chủ hỏng, <code>mutateAsync</code> ném lỗi, ta nuốt nó (<code>MutationCache</code> chung từ Chương 6 đã hiện "Không huỷ được lịch hẹn — đã hoàn tác"), Action kết thúc, và dòng đó tự quay về "Chờ xác nhận". Nút gọi <code>onClick={() =&gt; huyLich(lh)}</code>:</p>
${pre('tsx', SN.nutHuy)}

<h3>Chương 6 làm việc này bằng <code>onMutate</code> — cái gì thay đổi</h3>
${slide('rx-12', 18, 'Từ onMutate + chụp bản cũ + hoàn tác tay sang useOptimistic')}
<p>Chương 6 dựng cùng hành vi đó bên trong TanStack Query:</p>
${pre('ts', SN.huyCu)}
<p>Sau bài này, mutation chỉ còn gửi và làm mới:</p>
${pre('ts', SN.huyMoi)}
<table>
<thead><tr><th></th><th>Chương 6: <code>onMutate</code></th><th>Chương 12: <code>useOptimistic</code></th></tr></thead>
<tbody>
<tr><td>Giá trị lạc quan nằm ở đâu</td><td>trong cache truy vấn dùng chung</td><td>trong một component, chỉ trong lúc Action chạy</td></tr>
<tr><td>Hoàn tác khi lỗi</td><td>tự làm: chụp bản cũ + <code>setQueryData</code> trong <code>onError</code></td><td>tự động khi Action kết thúc</td></tr>
<tr><td>Đua với một lần tải lại đang bay</td><td>tự làm: <code>cancelQueries</code></td><td>không cần: cache không bị đụng</td></tr>
<tr><td>Component khác (vd huy hiệu trên Header)</td><td>thấy giá trị lạc quan ngay</td><td>thấy thay đổi khi lần tải lại về</td></tr>
<tr><td>Cờ "Đang lưu…"</td><td><code>isPending</code> của mutation</td><td><code>isPending</code> của transition</td></tr>
</tbody></table>
<p>Dòng thứ tư là một đánh đổi thật, đọc thẳng từ code: Header đếm lịch hẹn từ cùng cache đó (<code>data?.filter(…).length</code>), nên với <code>useOptimistic</code> huy hiệu của nó đổi khi máy chủ đã trả lời, không phải lúc bấm. Khi nhiều phần của trang phải cùng hiện giá trị lạc quan, giữ cách dùng cache; khi chỉ một danh sách quan tâm, <code>useOptimistic</code> ngắn hơn và không thể quên hoàn tác.</p>

<h3><code>&lt;form action&gt;</code> + <code>useActionState</code>: giá trị trả về là state mới</h3>
${slide('rx-12', 19, 'form action + useActionState: state mới = thứ Action trả về')}
<p>Form góp ý dưới danh sách lịch hẹn có chấm sao, họ tên không bắt buộc và nội dung 10–500 ký tự. Toàn bộ logic là một hàm — React gọi nó với state lần trước và <code>FormData</code> của form, và thứ nó trả về trở thành state kế tiếp:</p>
${pre('tsx', SN.guiGopY)}
<p>Lời gọi API và máy chủ giả, nơi kiểm lại một lần nữa (kiểm ở trình duyệt không bao giờ thay được kiểm ở máy chủ — ai cũng gọi thẳng API được):</p>
${pre('ts', SN.apiGopY)}
${pre('ts', SN.mswGopY)}
<p>Nút gửi đọc trạng thái đang gửi của form chứa nó, bằng <code>useFormStatus</code> từ <code>react-dom</code> — không cần prop:</p>
${pre('tsx', SN.nutGui)}
<p>Và form:</p>
${pre('tsx', SN.formGopY)}
${SD.formActionVi}
<div class="callout"><p><strong>JS nhắc nhanh — <code>FormData</code>.</strong> <code>new FormData(phanTuForm)</code> (hay thứ React đưa cho Action) gom mọi ô có <code>name</code>: <code>fd.get('noiDung')</code> trả về giá trị dạng chuỗi (hoặc một <code>File</code>, hoặc <code>null</code> nếu không có). Các radio cùng <code>name</code> cho giá trị của cái đang được chọn. Vì thế các ô có <code>name</code> mà không có <code>value</code>/<code>onChange</code>: chúng là ô <em>không điều khiển</em> (uncontrolled), trình duyệt giữ chữ của chúng.</p></div>
<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202, một form là <code>onSubmit={handleSubmit}</code> kèm <code>e.preventDefault()</code>, mỗi ô một <code>useState</code>, một state <code>loading</code> và một state <code>error</code> tự set quanh <code>await axios.post(…)</code> (có khi đi qua một Redux thunk). → Đi làm năm 2026 có hai câu trả lời tốt: React Hook Form + Zod (Chương 3) cho form phía client nhiều luật như form đặt lịch, và <code>&lt;form action&gt;</code> + <code>useActionState</code> cho form đơn giản — đó cũng là mô hình gốc trong Next.js, nơi Action có thể là một Server Action. · <em>Vì sao:</em> bản Action không có <code>preventDefault</code> để quên, không có cờ loading phải nhớ reset trong <code>finally</code>, và nút gửi tự biết đang gửi. Bản tự viết không sai (ta viết nó bên dưới thành <code>FormKieuCu</code> và nó chạy đúng); nó chỉ nhiều chỗ để sai hơn.</p></div>

<h3>React reset form sau Action — kể cả khi Action báo lỗi</h3>
${slide('rx-12', 20, 'React 19 reset form sau Action: không lấy defaultValue từ state là mất chữ')}
<p>Sau khi một Action gửi qua <code>&lt;form action&gt;</code> chạy xong, React 19 reset form — các ô không điều khiển quay về <code>defaultValue</code>. Sau khi gửi thành công thì tuyệt (form trống cho góp ý tiếp theo), sau lỗi kiểm dữ liệu thì tệ (chữ người dùng mất sạch). Ba phiên bản của cùng một form, gõ "Tốt" rồi bấm gửi:</p>
${pre('tsx', SN.formMatChu)}
${out(O3.reset)}
<p><code>FormMatChu</code> mất chữ. <code>FormGopY</code> giữ được vì Action trả về thứ đã gõ (<code>giaTri</code>) và các ô dùng <code>defaultValue={giaTri.noiDung}</code>: React render lại với giá trị mặc định mới trước, rồi mới reset về nó. <code>FormKieuCu</code> — cách trước React 19 — cũng giữ được, vì textarea của nó có điều khiển:</p>
${pre('tsx', SN.formKieuCu)}
<p>Màn hình thật, sau khi gửi "Tốt": chữ vẫn còn, ô được đánh dấu <code>aria-invalid</code>, và câu báo lỗi gắn với ô bằng <code>aria-describedby</code> (axe báo 0 lỗi cho trạng thái này trong test của dự án).</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — "form của tôi tự xoá khi có lỗi".</strong> State của bạn không sai gì cả; đó là lần reset tự động. Hoặc trả về giá trị đã gửi và dùng làm <code>defaultValue</code> (bài này), hoặc cho các ô có điều khiển. Đừng cố "chặn" reset bằng <code>e.preventDefault()</code> — với <code>action</code> không có hàm xử lý submit nào để đặt nó vào.</div>

<h3>Thêm ba cái bẫy, đo thật</h3>
${slide('rx-12', 21, 'Ba bẫy của Action: ném lỗi, cập nhật lạc quan ngoài transition, useFormStatus ngoài form')}
<p><strong>1 — Ném lỗi ra khỏi Action.</strong> Lỗi thoát ra khỏi Action được ném lại trong lúc render, nên error boundary gần nhất chiếm chỗ:</p>
${pre('tsx', SN.nemLoi)}
${out(O3.nemLoi)}
${SD.loiActionVi}
<p><strong>2 — Gọi hàm set lạc quan ngoài Action.</strong></p>
${pre('tsx', SN.lacQuanSai)}
${out(O3.lacQuan)}
<p><strong>3 — <code>useFormStatus</code> ở chính component vẽ <code>&lt;form&gt;</code>.</strong> Nó đọc trạng thái của form <em>cha</em>; component vẽ form thì không có form cha nào, nên <code>pending</code> luôn <code>false</code> — đo thật, chữ trên nút không bao giờ đổi (so với <code>NutGui</code> của dự án, có test thấy "Đang gửi…"):</p>
${pre('tsx', SN.formNutSai)}
${out(O3.formStatus)}
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Actions trong React 19 là gì? <code>useActionState</code>, <code>useFormStatus</code> và <code>useOptimistic</code> làm gì?"</p>
<p>Action là một hàm async chạy trong transition — qua <code>startTransition</code>, <code>&lt;form action&gt;</code> hoặc <code>useActionState</code> — nên React theo dõi trạng thái đang chạy tới khi nó xong. <code>useActionState(fn, banDau)</code> trả về <code>[state, dispatch, isPending]</code>, và giá trị trả về của <code>fn(stateTruoc, duLieu)</code> trở thành state kế tiếp — hợp cho kết quả và lỗi của form. <code>useFormStatus</code> cho một component nằm trong form biết form đó có đang gửi không. <code>useOptimistic</code> hiện một giá trị tạm trong lúc Action chạy và tự bỏ nó khi Action xong, nên dữ liệu thật phải được làm mới trước khi Action kết thúc. Lỗi trong Action nên được bắt và trả về, nếu không nó tới error boundary.</p></div>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Có React 19 rồi, còn dùng React Hook Form không?"</p>
<p>Còn, cho form nhiều luật kiểm phía client, nhiều ô, mảng động hay báo lỗi từng ô trong lúc gõ — như form đặt lịch dùng Zod của ta. Với một form nhỏ mà logic chỉ là "gửi, hiện kết quả", <code>&lt;form action&gt;</code> + <code>useActionState</code> ít code hơn; trong Next.js nó còn chạy với Server Actions và progressive enhancement. Hai thứ cũng kết hợp được.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 3/4: huỷ lịch lạc quan và form góp ý</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau bước 2/4 (<code>src/features/lich-hen/useLichHen.ts</code> còn <code>onMutate</code>, <code>DanhSachLichHen.tsx</code> gọi <code>huy.mutate(lh)</code>, <code>src/pages/TrangLichHen.tsx</code>).</p><ol>
<li><code>useHuyLichHen</code>: bỏ <code>onMutate</code>/<code>onError</code>, giữ <code>onSettled</code> trả về các lần invalidate và <code>meta.thongBaoLoi</code>.</li>
<li><code>DanhSachLichHen</code>: <code>useOptimistic</code> trên <code>lichHen</code>, <code>useTransition</code>, một Action <code>huyLich</code> có <code>try/catch</code>; hiện <code>&lt;p role="status"&gt;Đang lưu…&lt;/p&gt;</code> khi đang chạy.</li>
<li>Thêm <code>GopY</code> + <code>api.guiGopY</code>, và handler <code>POST /api/gop-y</code> (kiểm lại, trả 201 <code>{ id: 'gy-N' }</code>).</li>
<li>Tạo <code>src/features/gop-y/</code> (<code>FormGopY.tsx</code> có <code>guiGopY</code>, <code>NutGui</code>; <code>index.ts</code>) và vẽ <code>&lt;FormGopY /&gt;</code> dưới danh sách trong <code>TrangLichHen</code>. Nhãn đúng từng chữ: "Góp ý của bạn", "Họ tên (không bắt buộc)", radio tên "1 sao"…"5 sao".</li>
</ol>
<p><strong>Đạt khi:</strong> <code>src/features/lich-hen/DanhSachLichHen.test.tsx</code> (2 test) và <code>src/features/gop-y/FormGopY.test.tsx</code> (4 test, gồm axe) xanh, cùng mọi test khác.</p></div>
${pre('tsx', SN.test123a)}
${pre('tsx', SN.test123b)}
<p>Chạy trên dự án sau bước 2 (với một <code>FormGopY</code> rỗng để file biên dịch được), bản huỷ của Chương 6 vẫn qua test lỗi — ở đó hoàn tác cũng chạy — nhưng không gì khác qua:</p>
${out(OUT.tieuChi123Truoc)}
<details><summary>Lời giải</summary>
<p>Mọi đoạn code đã in ở trên: <code>useHuyLichHen</code>, phần đầu <code>DanhSachLichHen</code> và nút của nó, <code>GopY</code>/<code>api.guiGopY</code>, handler MSW (thêm <code>let soGopY = 0;</code> ở đầu <code>handlers.ts</code> và import <code>delay</code> từ <code>msw</code>), và toàn bộ <code>FormGopY.tsx</code> (<code>guiGopY</code>, <code>NutGui</code>, <code>FormGopY</code>). CSS: hàng sao dùng lại <code>chip-hang chon-ngay</code>; <code>app.css</code> thêm <code>.gop-y</code>, <code>.o-nhap</code> và viền đỏ cho <code>textarea[aria-invalid='true']</code>. Chạy ngày 26/09/2026: <code>npx tsc -b</code> không in gì; <code>npx vitest run</code> → 42 test xanh ở bước này (45 sau test axe và bước 4).</p>
${out(OUT.tieuChi123Sau)}
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> cố tình làm hỏng việc huỷ lịch, theo ba cách.</p><ol>
<li>Bỏ <code>try/catch</code> quanh <code>await huy.mutateAsync(lh)</code>. Chạy test "máy chủ lỗi 500".</li>
<li>Trả lại, nhưng thay <code>await huy.mutateAsync(lh)</code> bằng <code>huy.mutate(lh)</code> (không await). Chạy test 12.3 đầu tiên.</li>
<li>Trả lại. Trong <code>useHuyLichHen</code>, cho <code>onSettled</code> không trả về <code>Promise.all</code> (dùng ngoặc nhọn mà không <code>return</code>). Chạy cả hai test và quan sát dòng lịch.</li>
</ol><p><strong>Đạt khi:</strong> bạn giải thích được từng lần hỏng: bước 1 — lỗi thoát khỏi Action: test lỗi 500 hỏng và Vitest báo một lỗi không ai bắt <code>{ status: 500 }</code> (trong app, error boundary sẽ chiếm chỗ); bước 2 — Action kết thúc ngay, nên "Đã huỷ" lạc quan bị bỏ trước khi máy chủ trả lời và cả hai test 12.3 hỏng; bước 3 — Action kết thúc trước lần tải lại, nên test đầu hỏng: lúc "Đang lưu…" biến mất thì dòng đã quay về "Chờ xác nhận". Hoàn tác hết thì bộ test xanh.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Action</span><span class="v">hàm async chạy trong transition; React theo dõi trạng thái đang chạy tới khi xong</span></div>
<div class="kv"><span class="k"><code>useOptimistic</code></span><span class="v">giá trị tạm hiện trong lúc Action chạy, tự bỏ khi Action xong</span></div>
<div class="kv"><span class="k"><code>useActionState</code></span><span class="v"><code>[state, dispatch, isPending]</code>; giá trị Action trả về thành state</span></div>
<div class="kv"><span class="k"><code>useFormStatus</code></span><span class="v">từ <code>react-dom</code>; component con của form đọc form đó có đang gửi không</span></div>
<div class="kv"><span class="k"><code>&lt;form action={fn}&gt;</code></span><span class="v">React gọi <code>fn(formData)</code> như Action khi gửi, rồi reset form</span></div>
<div class="kv"><span class="k">ô không điều khiển (uncontrolled)</span><span class="v">input có <code>name</code>/<code>defaultValue</code>, chữ do trình duyệt giữ</span></div>
<div class="kv"><span class="k">cập nhật lạc quan (optimistic update)</span><span class="v">hiện kết quả mong đợi trước khi máy chủ xác nhận, hỏng thì quay về</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Action là hàm async trong transition; <code>isPending</code> phủ mọi <code>await</code>.</li>
<li><code>useOptimistic</code> + <code>await mutateAsync</code> (chờ cả lần tải lại) cho "Đã huỷ" ngay lúc bấm và tự quay về khi lỗi — không chụp bản cũ, không hoàn tác tay.</li>
<li>Đánh đổi: giá trị lạc quan là cục bộ; component đọc cache thấy thay đổi sau lần tải lại.</li>
<li><code>&lt;form action&gt;</code> + <code>useActionState</code>: kiểm, gọi API, trả về state mới; <code>useFormStatus</code> ở component con cho "Đang gửi…".</li>
<li>React reset form sau Action: trả về giá trị đã gõ và dùng làm <code>defaultValue</code>, nếu không chữ mất (đo được: "" so với "Tốt").</li>
<li>Bắt lỗi trong Action (không bắt ⇒ error boundary), chỉ gọi hàm set lạc quan trong Action, chỉ dùng <code>useFormStatus</code> bên dưới form.</li>
</ul>

${LINK('https://react.dev/reference/react/useOptimistic', '📄', 'react.dev — useOptimistic', 'State lạc quan trong lúc Action chạy.')}
${LINK('https://react.dev/reference/react/useActionState', '📄', 'react.dev — useActionState', 'State lấy từ kết quả của Action.')}
${LINK('https://react.dev/reference/react-dom/hooks/useFormStatus', '📄', 'react.dev — useFormStatus', 'Trạng thái đang gửi của form cha.')}
${LINK('https://react.dev/reference/react-dom/components/form', '📄', 'react.dev — &lt;form&gt;', 'Prop action và lần reset tự động.')}
${LINK_TRONG('/courses/nextjs', '▲', 'Học tiếp: khoá Next.js, Chương 12 — Server Actions', 'Cùng form này, nhưng Action chạy trên máy chủ.')}
</div>
`,
};

/* Output cắt sẵn cho Bài 12.4 */
const O4 = {
  caAppDau: OUT.compilerCaApp.split('\n').slice(0, 11).join('\n') + '\n… (32 dòng, dòng nào cũng "ĐÃ biên dịch")',
  hoSoSaiCompiler: OUT.bai1Compiler.split('\n')[0],
  asyncClient: OUT.bai4.split('\n').slice(0, 2).join('\n'),
};
const L4 = {
    title: '12.4 — React Compiler for the whole app, and Server Components as a concept|||12.4 — React Compiler cho cả app, và Server Components ở mức khái niệm',
    slug: 'rx-12-4-compiler-rsc',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Bật React Compiler trong vite.config cho cả app (32/32 component được biên dịch), đo trước/sau cùng memo tay, trả giá build chậm 4,7× và +5 kB JS, viết test canh compiler không âm thầm bỏ qua component; rồi Server Components và Server Actions ở mức khái niệm — thứ cần một framework như Next.js.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>React Compiler for the whole app, and Server Components as a concept</h2>
<p class="lead">Chapter 8 tried React Compiler on two files, found the trap where Babel 8 made it silently skip <code>TheBacSi</code>, and promised: "Chapter 12 turns the compiler on for the whole app and measures it properly". That is the first half of this lesson — including what it costs and a test that makes "silently skipped" impossible. The second half is about the part of React 19 this course will <em>not</em> build: Server Components and Server Actions. You will see exactly what they are, why they cannot run in a Vite app (we tried, and measured what happens), and where the course that teaches them starts.</p>
<p>Setup: the project after step 3/4 — <code>babel-plugin-react-compiler</code> 1.0.0, <code>@rolldown/plugin-babel</code> 0.2.4 and <code>@babel/core</code> 7.29.7 were installed in Chapter 8 (version 7, not 8: see Lesson 8.2). Timings: Chromium 149, CPU 4×, a <code>--mode profiling</code> build so <code>&lt;Profiler&gt;</code> reports numbers, median of 7 clicks.</p>

<h3>One place to turn it on: <code>vite.config.ts</code></h3>
${slide('rx-12', 22, 'Compiler on for the whole app: all 32 components compiled')}
<div class="callout warn"><p><strong>⚠️ Found later, in Chapter 9:</strong> "32/32 compiled" does not mean "32/32 correct". With the compiler on, <code>FormDatLich</code> kept showing a validation error after it was fixed, and hid the second field's error — React Hook Form mutates its <code>errors</code> object in place, while compiled code compares by identity. The fix and the test that catches it are in <a href="/courses/react/learn?lessonSlug=rx-9-1-testing-library">Lesson 9.1</a>. Turning the compiler on for a whole app is only safe together with tests that exercise the UI.</p></div>
<p>Chapter 8 kept the compiler in a separate <code>vite.compiler.config.ts</code> for experiments. Now it moves into the real config, so dev server, <code>vite build</code> and Vitest all run compiled code:</p>
${pre('ts', SN.viteConfig)}
${SD.compilerEn}
<p>Before trusting the build, ask the compiler what it did. The Chapter 8 script <code>do/kiem-compiler.mjs</code> runs Babel with the compiler's logger over every component file:</p>
${out(O4.caAppDau)}
<p>32 components out of 32, plus every custom hook (<code>useBoLocUrl</code>, <code>useHuyLichHen</code>…), including this chapter's new code: <code>OTimBacSi</code> with its "adjust state during render" pattern, <code>FormGopY</code> with <code>useActionState</code>, <code>DanhSachLichHen</code> with <code>useOptimistic</code>. The only thing not listed is <code>RanhGioiLoi</code> — a class component, which the compiler does not touch. With the compiler on, the whole suite still passes (42 tests at that point, 7.13 s instead of 6.36 s).</p>
<div class="callout"><p><strong>JS quick reminder — what "memo cache slots" means.</strong> The compiler rewrites your component so that it keeps an array of previous values between renders (via React's internal <code>useMemoCache</code>). For each piece of JSX or each computed value, it stores the inputs and the result; on the next render, if the inputs are identical (<code>Object.is</code>), it reuses the result. "30 slots" means 30 such remembered values. It is the same idea as <code>useMemo</code>, written for you, at a finer grain than you would write by hand.</p></div>

<h3>Measured: what the compiler adds on top of hand-written <code>memo</code></h3>
${slide('rx-12', 23, 'Compiler + hand memo: ♡ 1.8 → 1.2 ms; compiler alone without memo: 2.1 ms (7.1 ms on 1000)')}
<p>Same script as Chapter 8 (<code>do/do-chromium.mjs</code>): click ♡ seven times, then type "huy", with 200 and 1000 doctors. Three builds: no compiler (the Chapter 8 state, <code>memo(TheBacSi)</code> by hand), compiler with the hand-written <code>memo</code> kept, compiler with it removed.</p>
${out(OUT.compilerChromium)}
<table>
<thead><tr><th>Chromium, CPU 4×, <code>actualDuration</code></th><th>No compiler, <code>memo</code> by hand</th><th>Compiler + <code>memo</code></th><th>Compiler, no <code>memo</code></th></tr></thead>
<tbody>
<tr><td>♡, 200 doctors</td><td>1.8 ms</td><td><strong>1.2 ms</strong></td><td>2.1 ms</td></tr>
<tr><td>♡, 1000 doctors</td><td>4.5 ms</td><td><strong>4.2 ms</strong></td><td>7.1 ms</td></tr>
<tr><td>type "h", 1000 doctors</td><td>36.6 ms</td><td><strong>27.6 ms</strong></td><td>32.9 ms</td></tr>
</tbody></table>
<p>Three honest conclusions. The compiler helps a little on top of good hand-written memoisation (1.8 → 1.2 ms). It does <em>not</em> fully replace <code>memo(TheBacSi)</code> here: without it, the list still calls 1000 card functions per click (Chapter 8 explained why — the <code>.map</code> depends on the favourites array), so we keep that one <code>memo</code>. And all these numbers are far below the 16.7 ms of a 60 Hz frame for a click — the compiler is not what makes this app fast; measuring and fixing the right spot (Lessons 8.2, 12.2) did that. Note also "commit = 2" when typing: since step 2/4 each key is one small urgent commit (the box) plus one transition commit (URL and list).</p>

<h3>What it costs</h3>
${slide('rx-12', 24, 'The price: build 4.7× slower, +5.2 kB of JavaScript, Vitest +0.8 s')}
${out(OUT.compilerBuild)}
${out(OUT.cuoiBuild)}
<ul>
<li><strong>Build time:</strong> 157–162 ms → 727–754 ms (about 4.7×): every file now goes through Babel. On a 30-file app that is nothing; on a large app it is minutes, which is why the Vite template's README says the compiler is off by default "because of its impact on dev &amp; build performances".</li>
<li><strong>JavaScript:</strong> the main file shrank to 362.32 kB, but Rolldown split out a shared chunk it named <code>compiler-runtime</code> (8.94 kB — it contains React's shared code plus the compiler's runtime helper). Together 371.26 kB against 366.04 kB: <strong>+5.2 kB</strong> (gzip +3.3 kB), the price of the cache code in every component.</li>
<li><strong>Tests:</strong> 6.36 s → 7.13 s for the suite (the "transform" share went from 8% to 24%).</li>
</ul>
<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202, performance is a slide about <code>shouldComponentUpdate</code>/<code>PureComponent</code>, and in React-hooks code people add <code>useMemo</code>/<code>useCallback</code> by habit. → At work on a new React 19 codebase in 2026, a common setup is: React Compiler on in the build, a lint rule or a test that reports components it could not compile, hand-written <code>memo</code> only where a measurement still shows a gap (like our list). · <em>Why:</em> the compiler never forgets a dependency and covers code nobody would bother to memoise; but it silently skips code that breaks the Rules of React, and it costs build time — so teams verify it instead of assuming it. In older codebases you will still see hand-written <code>useMemo</code> everywhere; leave it unless a measurement says otherwise.</p></div>

<h3>A test that makes "silently skipped" impossible</h3>
${slide('rx-12', 25, 'A test guards the compiler: one line of soLanVe++ turns it red')}
<p>The compiler's failure mode is silence: a component it cannot handle is left as it was, the build is green, the app works, only slower. So the project gets a test that asks the logger about every <code>.tsx</code> file in <code>src/</code> and fails if anything was skipped:</p>
${pre('ts', SN.compilerTest)}
<p>Before the config change, the first test fails (the second already passes — the code was compilable, it just was not compiled):</p>
${out(OUT.tieuChi124Truoc)}
<p>And here is what it catches. Someone adds a harmless-looking render counter to <code>TrangChu</code> — <code>let soLanVe = 0;</code> outside the component, <code>soLanVe++</code> inside:</p>
${out(OUT.tieuChi124BatLoi)}
<p>Modifying a variable that lives outside the component during render breaks the Rules of React (render must be pure), so the compiler refuses <code>TrangChu</code>. Without the test, nobody would know. <code>package.json</code> gets a script for it: <code>"kiem:compiler": "vitest run src/app/compiler.test.ts"</code>.</p>
<div class="pitfall co-tieu-de"><strong>Trap — expecting the compiler to fix wrong code.</strong> It optimises correct code; it does not repair incorrect code. Lesson 12.1's uncached-promise experiment, re-run with the compiler on: <code>HoSoSai</code> is reported as compiled, and it still never shows the doctor — the compiler's cache lives in the component, and a component that suspends before its first commit has no cache to keep.</div>
${out(O4.hoSoSaiCompiler)}

<h3>Server Components: React that runs only on the server</h3>
${slide('rx-12', 26, 'Server Components: components that run on the server and send no JS — they need a framework')}
<p>Everything in this course runs in the browser: Vite builds JavaScript, the browser downloads it, React renders there. React 19 also defines a second kind of component that runs <strong>only on a server</strong>, ahead of time or per request:</p>
${SD.rscEn}
<ul>
<li><strong>Server Components</strong> (the default in a framework like Next.js' App Router) may be <code>async</code> and <code>await</code> a database query directly in their body. Their code is never sent to the browser — only their rendered result (the "RSC payload"). They cannot use state, effects or event handlers.</li>
<li><strong>Client Components</strong> start with the directive <code>'use client'</code> at the top of the file. They are what we wrote in this whole course: state, effects, <code>onClick</code>. A Server Component can render a Client Component and pass it serialisable props.</li>
<li><strong>Server Actions / Server Functions</strong> are functions marked <code>'use server'</code>. A Client Component can pass one to <code>&lt;form action&gt;</code> or call it; the framework turns the call into a request to the server. That is Lesson 12.3's <code>useActionState</code> form — with <code>guiGopY</code> running on the server, no <code>/api/gop-y</code> to write.</li>
</ul>
<p>These need a bundler and a server that understand the directives and stream the payload — a framework. A Vite single-page app does not have one. What happens if you write a "server-style" component in our Vite app anyway?</p>
${pre('tsx', SN.bai4)}
${out(O4.asyncClient)}
<p>React 19 on the client refuses async components (the component re-runs and re-fetches — 68 requests in half a second — and the fallback never leaves), and the <code>'use client'</code> line at the top is just an unused string here: there is no server side for it to separate from. This is the precise boundary of this course: <strong>React the library</strong> — everything that runs in the browser, which is also what Client Components are made of. Server Components, Server Actions, streaming and caching on the server are taught where they actually run: the Next.js course, Chapters 9–12.</p>
<table>
<thead><tr><th></th><th>This course (Vite SPA)</th><th>Next.js App Router</th></tr></thead>
<tbody>
<tr><td>Where components run</td><td>browser</td><td>server by default, browser with <code>'use client'</code></td></tr>
<tr><td>Read data</td><td>TanStack Query, <code>use()</code> on a cached promise</td><td><code>await</code> in a Server Component</td></tr>
<tr><td>Send a form</td><td><code>&lt;form action&gt;</code> + API call (Lesson 12.3)</td><td><code>&lt;form action&gt;</code> + Server Action</td></tr>
<tr><td>JavaScript sent</td><td>all components</td><td>only Client Components</td></tr>
<tr><td>Hosting</td><td>static files (Chapter 14)</td><td>a Node/edge server or a platform</td></tr>
</tbody></table>
<div class="callout"><p><strong>Common interview question.</strong> "What are React Server Components, and how do they differ from SSR?"</p>
<p>SSR renders the same client components to HTML on the server for the first load, then the browser downloads all their JavaScript and hydrates them. Server Components are components whose code never reaches the browser: they render on the server, can read data directly with <code>await</code>, and send a serialised result; only components marked <code>'use client'</code> ship JavaScript and can use state and events. They need framework support (Next.js App Router is the common one). Server Actions are functions marked <code>'use server'</code> that client code — typically a form's <code>action</code> — can call as if local. In a Vite SPA none of this exists; I would use TanStack Query and API routes instead.</p></div>
<div class="callout"><p><strong>Common interview question.</strong> "What does React Compiler do, and would you enable it?"</p>
<p>It is a build-time Babel plugin (1.0 since October 2025) that inserts memoisation into components and hooks that follow the Rules of React, and silently skips those that do not. I would enable it on a React 19 project, but verify it: a check that fails when a component is skipped, and a Profiler measurement before and after. In my project it compiled all 32 components, made a click 1.8 → 1.2 ms on top of hand-written memo, cost about 5 kB of JS and made the build ~4.7× slower; one hand-written <code>memo</code> on a list item was still worth keeping.</p></div>

<h3>🛠 Keep building the project — step 4/4: React Compiler for the whole app, guarded by a test</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after step 3/4 (<code>vite.config.ts</code> without the compiler, <code>vite.compiler.config.ts</code> from Chapter 8, <code>@babel/core</code> 7).</p><ol>
<li>Move <code>babel({ presets: [reactCompilerPreset()] })</code> into <code>vite.config.ts</code>; delete <code>vite.compiler.config.ts</code>.</li>
<li>Create <code>src/app/compiler.test.ts</code> as in the lesson (it needs <code>/// &lt;reference types="node" /&gt;</code> because the app's tsconfig only loads browser types).</li>
<li>Add <code>"kiem:compiler": "vitest run src/app/compiler.test.ts"</code> to <code>package.json</code>.</li>
<li>Keep <code>memo(TheBacSi)</code> — the table above says it still helps.</li>
</ol>
<p><strong>Done when:</strong> <code>npm run kiem:compiler</code> passes 2 tests, <code>npx vitest run</code> is fully green (45 tests across 10 files on the build machine), <code>npx tsc -b</code> prints nothing, and <code>npx vite build</code> lists a <code>compiler-runtime-*.js</code> chunk.</p></div>
${out(OUT.cuoiVitest)}
<details><summary>Solution</summary>
<p><code>vite.config.ts</code> and <code>src/app/compiler.test.ts</code> are printed in full above. All fourteen criteria tests of the chapter, run on 26/09/2026 after step 4 (the Chapter 7–8 tests are green too):</p>
${out(OUT.tieuChiSau)}
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> make the compiler refuse your code, read why, fix it the React way.</p><ol>
<li>In <code>TheBacSi</code>, mutate a prop at the top of the function: <code>bacSi.gioiThieu = bacSi.gioiThieu.trim();</code>. Run <code>npm run kiem:compiler</code>.</li>
<li>Undo it. In <code>KhuBacSi</code>, count renders with a ref: <code>const lanVe = useRef(0); lanVe.current++;</code>. Run it again.</li>
<li>Rewrite both without breaking the rules: compute a new value instead of mutating (<code>const gioiThieu = bacSi.gioiThieu.trim();</code>), and count renders with the Chapter 8 tools (<code>useDemRender</code>, <code>&lt;Profiler&gt;</code>) instead of a ref.</li>
</ol><p><strong>Done when:</strong> step 1 turns the second 12.4 test red with <code>TheBacSi.tsx · CompileError: This value cannot be modified</code>, step 2 with <code>KhuBacSi.tsx · CompileError: Cannot access refs during render</code> (both measured with <code>babel-plugin-react-compiler</code> 1.0.0), and after step 3 <code>npm run kiem:compiler</code> is green again.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">React Compiler</span><span class="v">Babel plugin that inserts memoisation into code following the Rules of React</span></div>
<div class="kv"><span class="k">Rules of React</span><span class="v">render is pure: no mutating props, state or outside variables, no side effects</span></div>
<div class="kv"><span class="k">memo cache slot</span><span class="v">one remembered value in a compiled component</span></div>
<div class="kv"><span class="k">compiler logger</span><span class="v">option that reports CompileSuccess / CompileError per function</span></div>
<div class="kv"><span class="k">Server Component</span><span class="v">component that runs only on the server; may be async; ships no JS</span></div>
<div class="kv"><span class="k">Client Component</span><span class="v">component marked <code>'use client'</code>; state, effects, events; runs in the browser</span></div>
<div class="kv"><span class="k">Server Action</span><span class="v">function marked <code>'use server'</code>, callable from client code (e.g. a form's action)</span></div>
<div class="kv"><span class="k">RSC payload</span><span class="v">the serialised render result a server sends for Server Components</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>React Compiler is on in <code>vite.config.ts</code>: all 32 components and every hook compiled, 45 tests green.</li>
<li>Measured: ♡ 1.8 → 1.2 ms (200), 4.5 → 4.2 ms (1000) on top of hand memo; without <code>memo(TheBacSi)</code> it is 7.1 ms at 1000, so that one <code>memo</code> stays.</li>
<li>Price: build 4.7× slower, +5.2 kB JS (+3.3 kB gzip), Vitest +0.8 s.</li>
<li>The compiler silently skips code that breaks the Rules of React; <code>compiler.test.ts</code> turns that into a red test (e.g. <code>soLanVe++</code>).</li>
<li>It does not fix wrong code: an uncached promise still loops (72 requests).</li>
<li>Server Components/Actions run on a server and need a framework; in Vite an async component is refused (68 requests, "async Client Component"). Learn them in the Next.js course, Chapters 9–12.</li>
</ul>

${LINK('https://react.dev/learn/react-compiler', '🤖', 'react.dev — React Compiler', 'Installation, incremental adoption, debugging.')}
${LINK('https://react.dev/reference/rules', '📏', 'react.dev — Rules of React', 'What the compiler relies on.')}
${LINK('https://react.dev/reference/rsc/server-components', '🖥', 'react.dev — Server Components', 'The concept, from the React team.')}
${LINK('https://react.dev/reference/rsc/server-functions', '🖥', 'react.dev — Server Functions', "'use server' and forms.")}
${LINK_TRONG('/courses/nextjs', '▲', 'Next up: Next.js course — Chapters 9–12', 'Server vs Client Components, data fetching and caching, advanced routing, Server Actions.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>React Compiler cho cả app, và Server Components ở mức khái niệm</h2>
<p class="lead">Chương 8 thử React Compiler trên hai file, tìm ra cái bẫy Babel 8 làm nó âm thầm bỏ qua <code>TheBacSi</code>, và hứa: "Chương 12 bật compiler cho cả app và đo kỹ". Đó là nửa đầu bài này — kèm cái giá phải trả và một test làm cho chuyện "âm thầm bỏ qua" không thể xảy ra. Nửa sau nói về phần React 19 mà khoá này sẽ <em>không</em> dựng: Server Components và Server Actions. Bạn sẽ thấy chính xác chúng là gì, vì sao chúng không chạy được trong app Vite (ta đã thử, và đo xem chuyện gì xảy ra), và khoá nào dạy chúng.</p>
<p>Chuẩn bị: dự án sau bước 3/4 — <code>babel-plugin-react-compiler</code> 1.0.0, <code>@rolldown/plugin-babel</code> 0.2.4 và <code>@babel/core</code> 7.29.7 đã cài từ Chương 8 (bản 7, không phải 8: xem Bài 8.2). Số đo: Chromium 149, CPU 4×, bản build <code>--mode profiling</code> để <code>&lt;Profiler&gt;</code> báo số, trung vị của 7 cú bấm.</p>

<h3>Một chỗ để bật: <code>vite.config.ts</code></h3>
${slide('rx-12', 22, 'Bật compiler cho cả app: cả 32 component được biên dịch')}
<div class="callout warn"><p><strong>⚠️ Phát hiện sau, ở Chương 9:</strong> "32/32 được biên dịch" không có nghĩa là "32/32 chạy đúng". Bật compiler xong, <code>FormDatLich</code> vẫn hiện lỗi dù đã sửa đúng, và giấu mất lỗi của ô thứ hai — React Hook Form sửa object <code>errors</code> tại chỗ, còn mã đã biên dịch so bằng danh tính. Cách sửa và test bắt được lỗi này ở <a href="/courses/react/learn?lessonSlug=rx-9-1-testing-library">Bài 9.1</a>. Bật compiler cho cả app chỉ an toàn khi đi kèm test chạy thật giao diện.</p></div>
<p>Chương 8 để compiler trong một file riêng <code>vite.compiler.config.ts</code> cho việc thử. Giờ nó chuyển vào cấu hình thật, nên dev server, <code>vite build</code> và Vitest đều chạy code đã biên dịch:</p>
${pre('ts', SN.viteConfig)}
${SD.compilerVi}
<p>Trước khi tin bản build, hãy hỏi compiler xem nó đã làm gì. Script <code>do/kiem-compiler.mjs</code> của Chương 8 chạy Babel kèm logger của compiler qua mọi file component:</p>
${out(O4.caAppDau)}
<p>32 trên 32 component, cộng mọi custom hook (<code>useBoLocUrl</code>, <code>useHuyLichHen</code>…), kể cả code mới của chương này: <code>OTimBacSi</code> với mẫu "điều chỉnh state trong lúc render", <code>FormGopY</code> với <code>useActionState</code>, <code>DanhSachLichHen</code> với <code>useOptimistic</code>. Thứ duy nhất không có tên là <code>RanhGioiLoi</code> — một class component, thứ compiler không đụng tới. Bật compiler, cả bộ test vẫn qua (lúc đó 42 test, 7,13 giây thay vì 6,36 giây).</p>
<div class="callout"><p><strong>JS nhắc nhanh — "ô nhớ" (memo cache slot) là gì.</strong> Compiler viết lại component của bạn để nó giữ một mảng các giá trị cũ giữa các lần render (qua <code>useMemoCache</code> nội bộ của React). Với mỗi mẩu JSX hay mỗi giá trị tính ra, nó cất đầu vào và kết quả; lần render sau, nếu đầu vào y hệt (<code>Object.is</code>), nó dùng lại kết quả. "30 ô nhớ" nghĩa là 30 giá trị được nhớ như thế. Cùng ý tưởng với <code>useMemo</code>, được viết hộ bạn, ở mức chi tiết hơn mức bạn chịu tự viết.</p></div>

<h3>Số đo: compiler thêm được gì trên nền <code>memo</code> viết tay</h3>
${slide('rx-12', 23, 'Compiler + memo tay: ♡ 1,8 → 1,2 ms; compiler mà bỏ memo: 2,1 ms (7,1 ms với 1000)')}
<p>Cùng script với Chương 8 (<code>do/do-chromium.mjs</code>): bấm ♡ bảy lần, rồi gõ "huy", với 200 và 1000 bác sĩ. Ba bản build: không compiler (trạng thái Chương 8, <code>memo(TheBacSi)</code> viết tay), compiler và giữ <code>memo</code> tay, compiler và bỏ <code>memo</code> tay.</p>
${out(OUT.compilerChromium)}
<table>
<thead><tr><th>Chromium, CPU 4×, <code>actualDuration</code></th><th>Không compiler, <code>memo</code> tay</th><th>Compiler + <code>memo</code></th><th>Compiler, bỏ <code>memo</code></th></tr></thead>
<tbody>
<tr><td>♡, 200 bác sĩ</td><td>1,8 ms</td><td><strong>1,2 ms</strong></td><td>2,1 ms</td></tr>
<tr><td>♡, 1000 bác sĩ</td><td>4,5 ms</td><td><strong>4,2 ms</strong></td><td>7,1 ms</td></tr>
<tr><td>gõ "h", 1000 bác sĩ</td><td>36,6 ms</td><td><strong>27,6 ms</strong></td><td>32,9 ms</td></tr>
</tbody></table>
<p>Ba kết luận trung thực. Compiler giúp thêm một chút trên nền memo tay đã tốt (1,8 → 1,2 ms). Nó <em>không</em> thay hẳn được <code>memo(TheBacSi)</code> ở đây: bỏ nó đi, danh sách vẫn gọi 1000 hàm thẻ mỗi cú bấm (Chương 8 đã giải thích — vòng <code>.map</code> phụ thuộc vào mảng yêu thích), nên ta giữ cái <code>memo</code> đó. Và mọi con số đều thấp xa 16,7 ms của một khung hình 60 Hz cho một cú bấm — compiler không phải thứ làm app này nhanh; đo và sửa đúng chỗ (Bài 8.2, 12.2) mới là thứ làm được. Để ý thêm "commit = 2" khi gõ: từ bước 2/4 mỗi phím là một commit khẩn nhỏ (cái ô) cộng một commit transition (URL và danh sách).</p>

<h3>Cái giá</h3>
${slide('rx-12', 24, 'Cái giá: build chậm 4,7 lần, thêm 5,2 kB JavaScript, Vitest thêm 0,8 giây')}
${out(OUT.compilerBuild)}
${out(OUT.cuoiBuild)}
<ul>
<li><strong>Thời gian build:</strong> 157–162 ms → 727–754 ms (khoảng 4,7 lần): mọi file giờ đi qua Babel. App 30 file thì không đáng gì; app lớn thì là vài phút, vì thế README của template Vite ghi compiler mặc định tắt "vì ảnh hưởng tới hiệu năng dev và build".</li>
<li><strong>JavaScript:</strong> file chính nhỏ đi còn 362,32 kB, nhưng Rolldown tách ra một chunk dùng chung mà nó đặt tên <code>compiler-runtime</code> (8,94 kB — chứa phần code dùng chung của React cộng hàm trợ giúp của compiler). Cộng lại 371,26 kB so với 366,04 kB: <strong>+5,2 kB</strong> (gzip +3,3 kB), giá của phần code bộ nhớ đệm trong mọi component.</li>
<li><strong>Test:</strong> 6,36 s → 7,13 s cho cả bộ (phần "transform" từ 8% lên 24%).</li>
</ul>
<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202, hiệu năng là một slide về <code>shouldComponentUpdate</code>/<code>PureComponent</code>, và trong code dùng hook người ta thêm <code>useMemo</code>/<code>useCallback</code> theo thói quen. → Đi làm với codebase React 19 mới năm 2026, cách thiết lập hay gặp là: React Compiler bật trong build, một luật lint hoặc một test báo các component nó không biên dịch được, <code>memo</code> viết tay chỉ ở chỗ số đo vẫn thấy hụt (như danh sách của ta). · <em>Vì sao:</em> compiler không bao giờ quên một phụ thuộc và phủ cả những chỗ không ai buồn memo; nhưng nó âm thầm bỏ qua code phạm Rules of React, và nó tốn thời gian build — nên các đội kiểm nó chứ không mặc định tin. Ở codebase cũ bạn vẫn sẽ thấy <code>useMemo</code> viết tay khắp nơi; cứ để đó trừ khi số đo nói khác.</p></div>

<h3>Một test làm chuyện "âm thầm bỏ qua" không thể xảy ra</h3>
${slide('rx-12', 25, 'Một test canh compiler: một dòng soLanVe++ là test đỏ')}
<p>Kiểu hỏng của compiler là im lặng: component nó không xử lý được thì để nguyên, build xanh, app chạy, chỉ chậm hơn. Vậy dự án có thêm một test hỏi logger về mọi file <code>.tsx</code> trong <code>src/</code> và hỏng nếu có gì bị bỏ qua:</p>
${pre('ts', SN.compilerTest)}
<p>Trước khi đổi cấu hình, test đầu hỏng (test thứ hai đã qua — code biên dịch được, chỉ là chưa được biên dịch):</p>
${out(OUT.tieuChi124Truoc)}
<p>Và đây là thứ nó bắt được. Ai đó thêm một bộ đếm render trông vô hại vào <code>TrangChu</code> — <code>let soLanVe = 0;</code> bên ngoài component, <code>soLanVe++</code> bên trong:</p>
${out(OUT.tieuChi124BatLoi)}
<p>Sửa một biến sống bên ngoài component trong lúc render là phạm Rules of React (render phải thuần khiết), nên compiler từ chối <code>TrangChu</code>. Không có test này, không ai biết. <code>package.json</code> có thêm một script cho nó: <code>"kiem:compiler": "vitest run src/app/compiler.test.ts"</code>.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — mong compiler sửa hộ code sai.</strong> Nó tối ưu code đúng; nó không chữa code sai. Chạy lại thí nghiệm promise không cache của Bài 12.1 với compiler bật: <code>HoSoSai</code> được báo là đã biên dịch, và vẫn không bao giờ hiện được bác sĩ — bộ nhớ đệm của compiler sống trong component, mà component treo trước lần commit đầu tiên thì không có bộ nhớ nào để giữ.</div>
${out(O4.hoSoSaiCompiler)}

<h3>Server Components: React chỉ chạy trên máy chủ</h3>
${slide('rx-12', 26, 'Server Components: component chạy ở máy chủ, không gửi JS — cần một framework')}
<p>Mọi thứ trong khoá này chạy ở trình duyệt: Vite dựng JavaScript, trình duyệt tải về, React render ở đó. React 19 còn định nghĩa loại component thứ hai chạy <strong>chỉ trên máy chủ</strong>, trước hoặc theo từng request:</p>
${SD.rscVi}
<ul>
<li><strong>Server Components</strong> (mặc định trong một framework như App Router của Next.js) được phép <code>async</code> và <code>await</code> truy vấn cơ sở dữ liệu ngay trong thân. Code của chúng không bao giờ được gửi xuống trình duyệt — chỉ kết quả render (gọi là "RSC payload"). Chúng không dùng được state, effect hay hàm xử lý sự kiện.</li>
<li><strong>Client Components</strong> mở đầu file bằng chỉ thị <code>'use client'</code>. Chúng là thứ ta viết suốt khoá này: state, effect, <code>onClick</code>. Server Component vẽ được Client Component và truyền cho nó props tuần tự hoá được.</li>
<li><strong>Server Actions / Server Functions</strong> là các hàm đánh dấu <code>'use server'</code>. Client Component truyền được một hàm như thế cho <code>&lt;form action&gt;</code> hoặc gọi nó; framework biến lời gọi thành một request lên máy chủ. Đó chính là form <code>useActionState</code> của Bài 12.3 — với <code>guiGopY</code> chạy trên máy chủ, không phải tự viết <code>/api/gop-y</code>.</li>
</ul>
<p>Những thứ này cần một bundler và một máy chủ hiểu các chỉ thị đó và truyền payload — tức một framework. App một trang của Vite không có. Nếu cứ viết một component "kiểu máy chủ" trong app Vite của ta thì sao?</p>
${pre('tsx', SN.bai4)}
${out(O4.asyncClient)}
<p>React 19 phía client từ chối component async (component chạy lại và tải lại — 68 request trong nửa giây — và fallback không bao giờ biến mất), còn dòng <code>'use client'</code> ở đầu file ở đây chỉ là một chuỗi vô dụng: không có phía máy chủ nào để tách ra. Đây chính là ranh giới của khoá này: <strong>React thư viện</strong> — mọi thứ chạy ở trình duyệt, cũng là chất liệu làm nên Client Components. Server Components, Server Actions, streaming và cache phía máy chủ được dạy ở nơi chúng thật sự chạy: khoá Next.js, Chương 9–12.</p>
<table>
<thead><tr><th></th><th>Khoá này (Vite SPA)</th><th>Next.js App Router</th></tr></thead>
<tbody>
<tr><td>Component chạy ở đâu</td><td>trình duyệt</td><td>máy chủ theo mặc định, trình duyệt khi có <code>'use client'</code></td></tr>
<tr><td>Đọc dữ liệu</td><td>TanStack Query, <code>use()</code> trên promise đã cache</td><td><code>await</code> trong Server Component</td></tr>
<tr><td>Gửi form</td><td><code>&lt;form action&gt;</code> + gọi API (Bài 12.3)</td><td><code>&lt;form action&gt;</code> + Server Action</td></tr>
<tr><td>JavaScript gửi xuống</td><td>mọi component</td><td>chỉ Client Components</td></tr>
<tr><td>Chỗ chạy</td><td>file tĩnh (Chương 14)</td><td>một máy chủ Node/edge hoặc một nền tảng</td></tr>
</tbody></table>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "React Server Components là gì, khác SSR thế nào?"</p>
<p>SSR render chính các client component thành HTML trên máy chủ cho lần tải đầu, rồi trình duyệt tải hết JavaScript của chúng và hydrate. Server Components là component mà code không bao giờ xuống trình duyệt: chúng render trên máy chủ, đọc dữ liệu trực tiếp bằng <code>await</code>, và gửi đi một kết quả đã tuần tự hoá; chỉ component có <code>'use client'</code> mới mang JavaScript theo và dùng được state, sự kiện. Chúng cần framework hỗ trợ (App Router của Next.js là phổ biến nhất). Server Actions là các hàm có <code>'use server'</code> mà code phía client — thường là <code>action</code> của form — gọi như hàm cục bộ. Trong một SPA Vite thì không có những thứ này; em dùng TanStack Query và API thay vào.</p></div>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "React Compiler làm gì, anh/chị có bật nó không?"</p>
<p>Đó là một plugin Babel chạy lúc build (bản 1.0 từ tháng 10/2025) chèn memo vào component và hook tuân theo Rules of React, và âm thầm bỏ qua những cái không tuân. Em sẽ bật nó cho dự án React 19, nhưng có kiểm: một phép kiểm hỏng khi có component bị bỏ qua, và đo Profiler trước/sau. Trong dự án của em nó biên dịch cả 32 component, làm cú bấm từ 1,8 xuống 1,2 ms trên nền memo tay, tốn khoảng 5 kB JS và build chậm ~4,7 lần; một cái <code>memo</code> viết tay trên thẻ danh sách vẫn đáng giữ.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 4/4: React Compiler cho cả app, có test canh</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau bước 3/4 (<code>vite.config.ts</code> chưa có compiler, <code>vite.compiler.config.ts</code> từ Chương 8, <code>@babel/core</code> 7).</p><ol>
<li>Chuyển <code>babel({ presets: [reactCompilerPreset()] })</code> vào <code>vite.config.ts</code>; xoá <code>vite.compiler.config.ts</code>.</li>
<li>Tạo <code>src/app/compiler.test.ts</code> như trong bài (cần <code>/// &lt;reference types="node" /&gt;</code> vì tsconfig của app chỉ nạp kiểu cho trình duyệt).</li>
<li>Thêm <code>"kiem:compiler": "vitest run src/app/compiler.test.ts"</code> vào <code>package.json</code>.</li>
<li>Giữ <code>memo(TheBacSi)</code> — bảng số đo ở trên cho thấy nó vẫn có ích.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>npm run kiem:compiler</code> qua 2 test, <code>npx vitest run</code> xanh hết (45 test trong 10 file trên máy dựng bài), <code>npx tsc -b</code> không in gì, và <code>npx vite build</code> liệt kê một chunk <code>compiler-runtime-*.js</code>.</p></div>
${out(OUT.cuoiVitest)}
<details><summary>Lời giải</summary>
<p><code>vite.config.ts</code> và <code>src/app/compiler.test.ts</code> in đầy đủ ở trên. Toàn bộ mười bốn test tiêu chí của chương, chạy ngày 26/09/2026 sau bước 4 (các test của Chương 7–8 cũng xanh):</p>
${out(OUT.tieuChiSau)}
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> làm compiler từ chối code của bạn, đọc lý do, sửa theo cách của React.</p><ol>
<li>Trong <code>TheBacSi</code>, sửa thẳng một prop ở đầu hàm: <code>bacSi.gioiThieu = bacSi.gioiThieu.trim();</code>. Chạy <code>npm run kiem:compiler</code>.</li>
<li>Hoàn tác. Trong <code>KhuBacSi</code>, đếm render bằng một ref: <code>const lanVe = useRef(0); lanVe.current++;</code>. Chạy lại.</li>
<li>Viết lại cả hai mà không phạm luật: tính ra một giá trị mới thay vì sửa (<code>const gioiThieu = bacSi.gioiThieu.trim();</code>), và đếm render bằng công cụ của Chương 8 (<code>useDemRender</code>, <code>&lt;Profiler&gt;</code>) thay vì ref.</li>
</ol><p><strong>Đạt khi:</strong> bước 1 làm test 12.4 thứ hai đỏ với <code>TheBacSi.tsx · CompileError: This value cannot be modified</code>, bước 2 với <code>KhuBacSi.tsx · CompileError: Cannot access refs during render</code> (cả hai đo bằng <code>babel-plugin-react-compiler</code> 1.0.0), và sau bước 3 <code>npm run kiem:compiler</code> xanh trở lại.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">React Compiler</span><span class="v">plugin Babel chèn memo vào code tuân theo Rules of React</span></div>
<div class="kv"><span class="k">Rules of React (Quy tắc của React)</span><span class="v">render thuần khiết: không sửa props, state hay biến bên ngoài, không tác dụng phụ</span></div>
<div class="kv"><span class="k">ô nhớ (memo cache slot)</span><span class="v">một giá trị được nhớ trong component đã biên dịch</span></div>
<div class="kv"><span class="k">logger của compiler</span><span class="v">tuỳ chọn báo CompileSuccess / CompileError cho từng hàm</span></div>
<div class="kv"><span class="k">Server Component</span><span class="v">component chỉ chạy trên máy chủ; được async; không gửi JS</span></div>
<div class="kv"><span class="k">Client Component</span><span class="v">component có <code>'use client'</code>; state, effect, sự kiện; chạy ở trình duyệt</span></div>
<div class="kv"><span class="k">Server Action</span><span class="v">hàm có <code>'use server'</code>, code phía client gọi được (vd action của form)</span></div>
<div class="kv"><span class="k">RSC payload</span><span class="v">kết quả render đã tuần tự hoá mà máy chủ gửi cho Server Components</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>React Compiler bật trong <code>vite.config.ts</code>: cả 32 component và mọi hook được biên dịch, 45 test xanh.</li>
<li>Số đo: ♡ 1,8 → 1,2 ms (200), 4,5 → 4,2 ms (1000) trên nền memo tay; bỏ <code>memo(TheBacSi)</code> thì 7,1 ms ở 1000, nên cái <code>memo</code> đó ở lại.</li>
<li>Cái giá: build chậm 4,7 lần, +5,2 kB JS (+3,3 kB gzip), Vitest thêm 0,8 giây.</li>
<li>Compiler âm thầm bỏ qua code phạm Rules of React; <code>compiler.test.ts</code> biến chuyện đó thành test đỏ (vd <code>soLanVe++</code>).</li>
<li>Nó không chữa code sai: promise không cache vẫn lặp (72 request).</li>
<li>Server Components/Actions chạy trên máy chủ và cần framework; trong Vite component async bị từ chối (68 request, "async Client Component"). Học chúng ở khoá Next.js, Chương 9–12.</li>
</ul>

${LINK('https://react.dev/learn/react-compiler', '🤖', 'react.dev — React Compiler', 'Cài đặt, áp dụng dần, gỡ lỗi.')}
${LINK('https://react.dev/reference/rules', '📏', 'react.dev — Rules of React', 'Thứ compiler dựa vào.')}
${LINK('https://react.dev/reference/rsc/server-components', '🖥', 'react.dev — Server Components', 'Khái niệm, từ chính đội React.')}
${LINK('https://react.dev/reference/rsc/server-functions', '🖥', 'react.dev — Server Functions', "'use server' và form.")}
${LINK_TRONG('/courses/nextjs', '▲', 'Học tiếp: khoá Next.js — Chương 9–12', 'Server vs Client Component, lấy dữ liệu và cache, định tuyến chuyên sâu, Server Actions.')}
</div>
`,
};

const Q = {
    title: '12.5 — Chapter 12 quiz|||12.5 — Kiểm tra Chương 12',
    slug: 'rx-12-5-kiem-tra',
    type: 'QUIZ',
    isFreePreview: true,
    description: 'Mười câu tình huống về Suspense, use(), useTransition, useDeferredValue, Actions, useOptimistic, useActionState, React Compiler và Server Components — mỗi câu có giải thích.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Quiz</span>
<h2>Chapter 12 quiz</h2>
<p class="lead">Ten situations taken from this chapter's project and measurements. Most questions show a few lines of code and ask what the screen or the test does. 15 minutes.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain why <code>use(api.bacSi(id))</code> inside a component never shows data, and fix it.</li>
<li>I can place <code>&lt;Suspense&gt;</code> so independent parts of a page load in parallel.</li>
<li>I can choose between <code>useTransition</code> and <code>useDeferredValue</code>, and I know which value must never be in a transition.</li>
<li>I can build an optimistic cancel with <code>useOptimistic</code> that falls back by itself on error.</li>
<li>I can build a form with <code>&lt;form action&gt;</code>, <code>useActionState</code> and <code>useFormStatus</code> that keeps the text after an error.</li>
<li>I can turn React Compiler on, check what it skipped, and say what Server Components need.</li>
</ul>
${slide('rx-12', 28, 'Chapter 12 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra</span>
<h2>Kiểm tra Chương 12</h2>
<p class="lead">Mười tình huống lấy từ dự án và các phép đo của chương. Phần lớn câu hỏi đưa vài dòng code và hỏi màn hình hay test sẽ làm gì. 15 phút.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được vì sao <code>use(api.bacSi(id))</code> trong component không bao giờ hiện dữ liệu, và sửa được.</li>
<li>Tôi đặt được <code>&lt;Suspense&gt;</code> để các phần độc lập của trang tải song song.</li>
<li>Tôi chọn được giữa <code>useTransition</code> và <code>useDeferredValue</code>, và biết giá trị nào không bao giờ được nằm trong transition.</li>
<li>Tôi làm được huỷ lịch lạc quan bằng <code>useOptimistic</code> tự quay về khi lỗi.</li>
<li>Tôi làm được form bằng <code>&lt;form action&gt;</code>, <code>useActionState</code> và <code>useFormStatus</code> mà vẫn giữ chữ sau khi báo lỗi.</li>
<li>Tôi bật được React Compiler, kiểm được nó bỏ qua gì, và nói được Server Components cần gì.</li>
</ul>
${slide('rx-12', 28, 'Bảng tra nhanh Chương 12')}
</div>
`,
    quiz: {
      timeLimitSeconds: 900,
      questions: [
        {
          question: "A component does const bs = use(api.bacSi(id)) inside <Suspense fallback=\"Loading…\">. The API answers in 5 ms. What happens?|||Một component viết const bs = use(api.bacSi(id)) bên trong <Suspense fallback=\"Đang tải…\">. API trả lời sau 5 ms. Chuyện gì xảy ra?",
          options: [
            'The fallback stays forever while identical requests keep being sent|||Fallback đứng mãi trong khi các request giống hệt nhau cứ được gửi đi',
            'The doctor appears after about 5 ms|||Bác sĩ hiện ra sau khoảng 5 ms',
            'TypeScript refuses to compile the call|||TypeScript không cho biên dịch lời gọi đó',
            'React throws "use can only be called in an if"|||React ném lỗi "use chỉ được gọi trong if"',
          ],
          correctIndex: 0,
          points: 1,
          explanation: "EN: Each render calls api.bacSi again and gets a NEW promise; a component that suspends before its first commit keeps nothing, so every retry suspends again (measured: 63 requests in 0.5 s, fallback forever). 'After 5 ms' would be true only if the promise came from a cache — the same promise on every render.|||VI: Mỗi lần render lại gọi api.bacSi và nhận một promise MỚI; component treo trước lần commit đầu không giữ lại gì, nên lần thử lại nào cũng treo tiếp (đo được: 63 request trong 0,5 giây, fallback đứng mãi). \"Sau 5 ms\" chỉ đúng khi promise lấy từ một cache — cùng một promise ở mọi lần render.",
        },
        {
          question: "On the doctor page, the profile is read with use() inside <Suspense>. Where must <ChonKhungGio> (which loads the time slots with useQuery) go so both requests start together?|||Trên trang bác sĩ, hồ sơ đọc bằng use() trong <Suspense>. Phải đặt <ChonKhungGio> (tải giờ khám bằng useQuery) ở đâu để hai request bắt đầu cùng lúc?",
          options: [
            'Inside the same <Suspense>, next to the profile|||Trong cùng <Suspense>, cạnh hồ sơ',
            'Outside that <Suspense>, as its sibling|||Ngoài <Suspense> đó, làm anh em với nó',
            'Inside the profile component, after use()|||Bên trong component hồ sơ, sau dòng use()',
            'It does not matter, React starts all queries in parallel|||Không quan trọng, React tự chạy mọi query song song',
          ],
          correctIndex: 1,
          points: 1,
          explanation: "EN: useQuery starts fetching when its component commits. Inside the suspended boundary it would not commit until the profile arrived — the waterfall again (measured: the 12.1 test fails with 'expected 2 to be less than 1'). As a sibling it commits immediately: time slots started 7 ms after the profile instead of 810 ms.|||VI: useQuery bắt đầu tải khi component của nó commit. Nằm trong ranh giới đang treo thì nó không commit tới khi hồ sơ về — lại thác nước (đo được: test 12.1 hỏng với 'expected 2 to be less than 1'). Làm anh em thì nó commit ngay: giờ khám bắt đầu 7 ms sau hồ sơ thay vì 810 ms.",
        },
        {
          question: "A Vitest test calls veTrang('/bac-si/bs-2') (a plain render) on a page that reads data with use(). What do you see?|||Một test Vitest gọi veTrang('/bac-si/bs-2') (render thường) trên trang đọc dữ liệu bằng use(). Bạn thấy gì?",
          options: [
            'The test passes, jsdom does not support Suspense so data shows at once|||Test qua, jsdom không hỗ trợ Suspense nên dữ liệu hiện ngay',
            'A TypeScript error: veTrang must be awaited|||Lỗi TypeScript: veTrang phải được await',
            'The fallback stays, findBy times out, and React warns that a component suspended inside a non-awaited act|||Fallback đứng yên, findBy hết giờ, và React cảnh báo có component treo trong một act không được await',
            'MSW refuses the request because the test is synchronous|||MSW từ chối request vì test là đồng bộ',
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: Testing Library renders inside a synchronous act(); when something suspends there, React drops the rest of the queued work — even ChonKhungGio's effects (0 time slots after 1.5 s). Rendering inside await act(async …) (veTrangCho) fixes it. It is not a TypeScript error: veTrang is synchronous and type-checks fine.|||VI: Testing Library render bên trong một act() đồng bộ; có thứ treo ở đó thì React bỏ luôn phần việc còn xếp hàng — kể cả effect của ChonKhungGio (0 ô giờ sau 1,5 giây). Render trong await act(async …) (veTrangCho) là hết. Không phải lỗi TypeScript: veTrang đồng bộ và qua kiểm kiểu bình thường.",
        },
        {
          question: "const [q, setQ] = useState(''); const [, start] = useTransition(); <input value={q} onChange={(e) => start(() => setQ(e.target.value))} /> — a 1000-card list depends on q. What can happen on a slow phone?|||const [q, setQ] = useState(''); const [, start] = useTransition(); <input value={q} onChange={(e) => start(() => setQ(e.target.value))} /> — một danh sách 1000 thẻ phụ thuộc q. Trên điện thoại chậm có thể xảy ra gì?",
          options: [
            'Nothing wrong — transitions only make it smoother|||Không có gì sai — transition chỉ làm mượt hơn',
            'The list never updates|||Danh sách không bao giờ cập nhật',
            'React throws an error about controlled inputs|||React ném lỗi về input có điều khiển',
            'Letters get lost while typing fast|||Gõ nhanh thì mất chữ',
          ],
          correctIndex: 3,
          points: 1,
          explanation: "EN: The input's value is state set inside a transition. React restores the box to the committed value until the transition commits; a key pressed in between is appended to the old text. Measured at CPU 6×, 10 ms between keys: 'nuyen' and 'en' instead of 'nguyen'. No error is thrown — that is why the bug hides on fast laptops.|||VI: Giá trị của ô là state được set trong transition. React trả ô về giá trị đã commit cho tới khi transition commit; phím bấm lúc đó bị nối vào chữ cũ. Đo ở CPU 6×, phím cách 10 ms: 'nuyen' và 'en' thay vì 'nguyen'. Không có lỗi nào được ném — vì thế lỗi trốn được trên laptop nhanh.",
        },
        {
          question: "The search text arrives as a prop from the URL and you do not call its setter. You want the input fast and the 1000-card list to lag. Which is right?|||Từ khoá tìm đến qua prop từ URL và bạn không phải người gọi hàm set. Bạn muốn ô gõ nhanh còn danh sách 1000 thẻ đi trễ. Cách nào đúng?",
          options: [
            'Wrap the parent in startTransition|||Bọc component cha trong startTransition',
            'const q2 = useDeferredValue(q) and pass q2 to a memoised list|||const q2 = useDeferredValue(q) rồi truyền q2 cho một danh sách đã memo',
            'useMemo(() => q, [q]) for the list|||useMemo(() => q, [q]) cho danh sách',
            'A 300 ms setTimeout before rendering the list|||setTimeout 300 ms trước khi vẽ danh sách',
          ],
          correctIndex: 1,
          points: 1,
          explanation: "EN: useDeferredValue is for values you receive; during the urgent render q2 is still the old value, so a memoised list is skipped and the input paints first. startTransition wraps setter calls, not components. useMemo(() => q) returns q itself, nothing is deferred. A timeout (debounce) makes everyone wait and is meant for network requests.|||VI: useDeferredValue dành cho giá trị bạn được đưa; trong lần render khẩn q2 vẫn là giá trị cũ, nên danh sách đã memo được bỏ qua và ô gõ được vẽ trước. startTransition bọc lời gọi hàm set, không bọc component. useMemo(() => q) trả về đúng q, chẳng trễ gì. Hẹn giờ (debounce) bắt mọi người chờ và dành cho request mạng.",
        },
        {
          question: "Why did the Chapter 8 search box (value={tuKhoa} read from ?q=, written with setSearchParams) lose letters on 1000 doctors, though nobody called startTransition?|||Vì sao ô tìm Chương 8 (value={tuKhoa} đọc từ ?q=, ghi bằng setSearchParams) mất chữ trên 1000 bác sĩ, dù không ai gọi startTransition?",
          options: [
            'React Router wraps every URL update in startTransition, so the input was controlled by a transition|||React Router bọc mọi lần đổi URL trong startTransition, nên ô input bị một transition điều khiển',
            'The browser limits how often the URL can change|||Trình duyệt giới hạn số lần đổi URL',
            'memo(TheBacSi) blocked the input from re-rendering|||memo(TheBacSi) chặn ô input render lại',
            'MSW was too slow to answer|||MSW trả lời quá chậm',
          ],
          correctIndex: 0,
          points: 1,
          explanation: "EN: RouterProvider applies navigations with React.startTransition unless flushSync is requested (read in react-router 8.4.0's components.js). An input whose value comes from the URL is therefore a transition-controlled input. The URL is not rate-limited here, memo only skips the cards, and filtering does not call MSW at all.|||VI: RouterProvider áp dụng điều hướng bằng React.startTransition trừ khi yêu cầu flushSync (đọc trong components.js của react-router 8.4.0). Ô input lấy value từ URL vì thế là ô bị transition điều khiển. URL không bị giới hạn ở đây, memo chỉ bỏ qua các thẻ, và việc lọc không hề gọi MSW.",
        },
        {
          question: "startTransition(async () => { danhDauHuy(lh.id); huy.mutate(lh); }) — note: mutate, not await mutateAsync. The server takes 300 ms. What does the row show right after the click?|||startTransition(async () => { danhDauHuy(lh.id); huy.mutate(lh); }) — để ý: mutate, không phải await mutateAsync. Máy chủ mất 300 ms. Ngay sau cú bấm dòng lịch hiện gì?",
          options: [
            '"Đã huỷ" for 300 ms, then the real status|||"Đã huỷ" trong 300 ms, rồi trạng thái thật',
            '"Đã huỷ" forever, even if the server fails|||"Đã huỷ" mãi mãi, kể cả khi máy chủ lỗi',
            'Still "Chờ xác nhận": the Action ended at once, so the optimistic value was dropped immediately|||Vẫn "Chờ xác nhận": Action kết thúc ngay, nên giá trị lạc quan bị bỏ ngay lập tức',
            'An error boundary screen|||Màn hình error boundary',
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: useOptimistic keeps its value only while the Action runs. Without await, the async function finishes immediately, so the optimistic layer disappears before the server answers — measured: both 12.3 tests fail. 'Đã huỷ for 300 ms' is what you get with await mutateAsync. No error is thrown, so no boundary.|||VI: useOptimistic chỉ giữ giá trị trong lúc Action chạy. Không có await thì hàm async xong ngay, nên lớp lạc quan biến mất trước khi máy chủ trả lời — đo được: cả hai test 12.3 hỏng. \"Đã huỷ trong 300 ms\" là kết quả khi có await mutateAsync. Không có lỗi nào được ném, nên không có error boundary.",
        },
        {
          question: "A form uses <form action={formAction}> from useActionState; the textarea has name=\"noiDung\" and no value/defaultValue. The user types 'Tốt' and the Action returns a validation error. What is in the textarea afterwards?|||Một form dùng <form action={formAction}> từ useActionState; textarea có name=\"noiDung\" và không có value/defaultValue. Người dùng gõ 'Tốt' và Action trả về lỗi kiểm dữ liệu. Sau đó textarea chứa gì?",
          options: [
            "'Tốt' — errors never reset a form|||'Tốt' — lỗi thì không bao giờ reset form",
            "'Tốt Tốt' — the value is appended again|||'Tốt Tốt' — giá trị bị nối thêm lần nữa",
            'The error message|||Câu báo lỗi',
            "Empty: React 19 resets the form after the Action finishes|||Trống: React 19 reset form sau khi Action chạy xong",
          ],
          correctIndex: 3,
          points: 1,
          explanation: "EN: After an Action submitted through <form action>, React resets uncontrolled fields to their defaultValue — success or not. Measured: FormMatChu shows \"\", while FormGopY (defaultValue taken from the returned state) and the controlled FormKieuCu both keep 'Tốt'.|||VI: Sau Action gửi qua <form action>, React reset các ô không điều khiển về defaultValue — thành công hay không. Đo được: FormMatChu còn \"\", còn FormGopY (defaultValue lấy từ state trả về) và FormKieuCu (có điều khiển) đều giữ 'Tốt'.",
        },
        {
          question: "React Compiler is enabled and the build is green. Someone adds let n = 0 outside TrangChu and n++ inside it. What happens?|||React Compiler đã bật và build xanh. Ai đó thêm let n = 0 bên ngoài TrangChu và n++ bên trong nó. Chuyện gì xảy ra?",
          options: [
            'The build fails with a compiler error|||Build hỏng với lỗi của compiler',
            'TrangChu is silently left uncompiled; only the logger (or a test that reads it) reveals it|||TrangChu âm thầm không được biên dịch; chỉ logger (hoặc một test đọc nó) mới cho biết',
            'The compiler moves n into useRef automatically|||Compiler tự chuyển n vào useRef',
            'The app crashes on the home page|||App sập ở trang chủ',
          ],
          correctIndex: 1,
          points: 1,
          explanation: "EN: Mutating an outside variable during render breaks the Rules of React. The compiler's default is to skip that function and say nothing; the build stays green and the page works, just unoptimised. The project's compiler.test.ts reported: 'TrangChu.tsx · CompileError: (BuildHIR::lowerExpression) Support UpdateExpression where argument is a global'.|||VI: Sửa một biến bên ngoài trong lúc render là phạm Rules of React. Mặc định compiler bỏ qua hàm đó và không nói gì; build vẫn xanh và trang vẫn chạy, chỉ là không được tối ưu. compiler.test.ts của dự án báo: 'TrangChu.tsx · CompileError: (BuildHIR::lowerExpression) Support UpdateExpression where argument is a global'.",
        },
        {
          question: "In the Vite app you write export async function HoSo({ id }) { const bs = await api.bacSi(id); return <h2>{bs.ten}</h2>; } and render it inside <Suspense>. What happens?|||Trong app Vite bạn viết export async function HoSo({ id }) { const bs = await api.bacSi(id); return <h2>{bs.ten}</h2>; } rồi vẽ nó trong <Suspense>. Chuyện gì xảy ra?",
          options: [
            'It works like a Server Component and ships less JavaScript|||Nó chạy như Server Component và gửi ít JavaScript hơn',
            "Adding 'use client' at the top makes it work|||Thêm 'use client' ở đầu file là chạy",
            'React refuses an "async Client Component": the fallback stays and the request is repeated|||React từ chối "async Client Component": fallback đứng yên và request bị lặp lại',
            'Vite converts it to useEffect at build time|||Vite tự đổi nó thành useEffect lúc build',
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: Only Server Components may be async, and they need a framework (e.g. Next.js App Router) with a server. On the client React logs '<HoSoKieuServer> is an async Client Component…', the component keeps re-running (68 requests in 0.5 s) and the fallback never leaves. 'use client' marks a Client Component — the opposite of what is needed.|||VI: Chỉ Server Component mới được async, và chúng cần một framework (vd App Router của Next.js) có máy chủ. Ở client React ghi '<HoSoKieuServer> is an async Client Component…', component chạy lại liên tục (68 request trong 0,5 giây) và fallback không bao giờ biến mất. 'use client' đánh dấu Client Component — ngược với thứ cần.",
        },
      ],
    },
};

export default {
  title: 'Chapter 12 — React 19 and concurrent rendering|||Chương 12 — React 19 & concurrent',
  description: 'Suspense và use() cho dữ liệu, useTransition và useDeferredValue (kèm ô tìm mất chữ đo được), Actions với useOptimistic, useActionState và useFormStatus, bật React Compiler cho cả app và đo, Server Components ở mức khái niệm — mọi con số đo thật trên app đặt lịch.',
  lessons: [L0, L1, L2, L3, L4, Q],
};
