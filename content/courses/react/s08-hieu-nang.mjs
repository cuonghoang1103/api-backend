import { gallery, slide } from './_slides.mjs';

/**
 * React — Chương 8: Hiệu năng và khả năng tiếp cận (soạn 26/09/2026 từ khung, theo content/courses/react/_HOP-DONG.md).
 * GIỮ slug khung: rx-8-1-do · rx-8-2-memo · rx-8-3-lazy · rx-8-4-a11y (type LESSON). Thêm rx-8-0-slides (DOCUMENT) và
 * rx-8-5-kiem-tra (QUIZ). Mục "🛠 Tự gõ tiếp dự án" rải MỖI bài một bước (4 bước), lời giải trong <details>.
 * Mọi mã dài và mọi output trong bài chạy THẬT 26/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch08 — dựng lại
 * từ lời giải Chương 6–7 (không có ảnh chụp sau-ch07 trên máy này; 11 test tiêu chí của Chương 7 chạy xanh trên bản dựng lại),
 * rồi làm tiếp bốn bước của Chương 8. Ảnh chụp dự án sau chương: SCRATCH/rx/du-an/sau-ch08.
 * (react 19.3.0 · react-dom 19.3.0 · vite 8.3.1 · typescript 6.0.3 · vitest 5.0.2 · jsdom 29.1.1 · react-router 8.4.0 ·
 *  @tanstack/react-query 5.103.3 · zustand 5.0.15 · msw 2.15.0 · react-hook-form 7.88.0 · zod 4.6.5 ·
 *  babel-plugin-react-compiler 1.0.0 + @rolldown/plugin-babel 0.2.4 + @babel/core 7.29.7 (và 8.0.6 để tái hiện bẫy) ·
 *  axe-core 4.13.0 · @axe-core/playwright 4.13.0 · Chromium 149 qua Playwright, CPU chậm 4× bằng CDP).
 * Mã dài trong bài nằm ở hằng SN, output ở hằng OUT — sinh tự động từ chính các file/log đã chạy (tsc -b sạch, vitest xanh).
 * Sơ đồ: mermaid ngay trong bài (<pre><code class="language-mermaid">), 2–3 sơ đồ mỗi bài dạy, nhãn VI ở khối VI, EN ở khối EN.
 * Deck: scripts/slides-src/rx-08.mjs (29 slide).
 */

const H = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '&#96;').replace(/\$\{/g, '&#36;{');
const pre = (lang, s) => '<pre><code class="language-' + lang + '">' + H(s) + '</code></pre>';
const out = (s) => '<div class="out">' + H(s) + '</div>';
const LINK = (href, ico, title, sub) => '<a class="link-card" href="' + href + '" target="_blank" rel="noopener"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';
/** Sơ đồ mermaid: trang học đọc textContent của <code class="language-mermaid"> rồi vẽ (LearnPageClient → mermaidRuntime). */
const MM = (src) => '<pre><code class="language-mermaid">' + H(src.trim()) + '</code></pre>';

/* ─── Mã trong bài: SINH TỰ ĐỘNG từ dự án thử ch08 (tsc -b sạch + vitest xanh 26/09/2026) — đừng sửa tay ─── */
const SN = {
  baiSiGia: "import type { BacSi, ChuyenKhoa } from '@/types';\n\nconst HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ'];\nconst DEM = ['Minh', 'Thu', 'Quốc', 'Ngọc', 'Đức', 'Thảo', 'Văn', 'Thị', 'Hải', 'Gia'];\nconst TEN = ['An', 'Hà', 'Bảo', 'Lan', 'Huy', 'Vy', 'Nam', 'Mai', 'Khoa', 'Linh', 'Tú', 'Phúc'];\nconst CK: ChuyenKhoa[] = ['noi', 'nhi', 'da-lieu', 'rang-ham-mat'];\n\n/**\n * Chương 8: sinh bác sĩ GIẢ để đo hiệu năng với danh sách dài (app thật có 6 người thì không đo ra gì).\n * Tất định (không Math.random): chạy lại bao nhiêu lần cũng ra cùng một danh sách ⇒ số đo so sánh được.\n */\nexport function taoBacSiGia(soLuong: number, soDau = 7): BacSi[] {\n  return Array.from({ length: soLuong }, (_, i) => {\n    const so = soDau + i;\n    return {\n      id: `bs-${so}`,\n      ten: `BS. ${HO[i % HO.length]} ${DEM[(i * 3) % DEM.length]} ${TEN[(i * 7) % TEN.length]} (${so})`, // số ở cuối: không trùng tên thật\n      chuyenKhoa: CK[i % CK.length],\n      namKinhNghiem: 1 + ((i * 13) % 30),\n      gioiThieu: `Bác sĩ giả số ${so} — chỉ dùng để đo hiệu năng.`,\n    };\n  });\n}",
  datLai: "/** Chương 8: soBacSi > 6 ⇒ thêm bác sĩ giả (đo hiệu năng). Trình duyệt: ?nhieu=200 trên URL. */\nexport function datLaiDuLieu(soBacSi = 6) {\n  bacSi = [...danhSachBacSi, ...taoBacSiGia(Math.max(0, soBacSi - danhSachBacSi.length))].map((bs) => ({ ...bs }));\n  khungGio = [];\n  lichHen = [];\n  dem = 0;\n}\ndatLaiDuLieu(dieuKhien.soBacSi); // trình duyệt: /bac-si?nhieu=200",
  dieuKhien: "export const dieuKhien = {\n  tre: q.get('tre'),\n  loi: new Set((q.get('loi') ?? '').split(',').filter(Boolean)),\n  rong: q.get('rong') === '1',\n  soBacSi: Math.min(1000, Number(q.get('nhieu')) || 6),\n};",
  doRender: "import { Profiler, type ProfilerOnRenderCallback, type ReactNode } from 'react';\n\nexport interface LanCommit {\n  id: string;\n  phase: 'mount' | 'update' | 'nested-update';\n  actualDuration: number; // ms React thật sự bỏ ra cho cây con trong lần commit này\n  baseDuration: number; // ms ước tính nếu vẽ lại CẢ cây con, không bỏ qua gì\n}\n\n/** Nhật ký mọi lần commit được đo. Test và script Playwright đọc từ đây (window.__nhatKyDo). */\nexport const nhatKyDo: LanCommit[] = [];\n(globalThis as { __nhatKyDo?: LanCommit[] }).__nhatKyDo = nhatKyDo;\n\nconst ghiLai: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration) => {\n  nhatKyDo.push({ id, phase, actualDuration, baseDuration });\n};\n\n/**\n * Chương 8: bọc một vùng giao diện bằng <Profiler> để ĐO trước khi tối ưu.\n * Bản build production thường KHÔNG gọi onRender (React tắt đo để đỡ tốn) — muốn đo trên bản build thì\n * build ở chế độ profiling: `npx vite build --mode profiling` (xem vite.config.ts).\n */\nexport function DoRender({ id, children }: { id: string; children: ReactNode }) {\n  return (\n    <Profiler id={id} onRender={ghiLai}>\n      {children}\n    </Profiler>\n  );\n}",
  demRender: "/** Chương 8: đếm số lần một component CHẠY (render). Chỉ để quan sát; chỉ chạy ở dev/test — bản build bỏ hẳn. */\nexport const demRender = new Map<string, number>();\n(globalThis as { __demRender?: Map<string, number> }).__demRender = demRender;\n\nexport function useDemRender(ten: string) {\n  if (import.meta.env.DEV) demRender.set(ten, (demRender.get(ten) ?? 0) + 1);\n}",
  trangDanhSach: "import { KhuBacSi } from '@/features/bac-si';\nimport { DoRender } from '@/shared/dev/DoRender';\nimport { useTieuDeTrang } from '@/shared/hooks/useTieuDeTrang';\n\nexport function TrangDanhSachBacSi() {\n  useTieuDeTrang('Đội ngũ bác sĩ · Phòng khám An Tâm');\n  return (\n    <DoRender id=\"KhuBacSi\">\n      <KhuBacSi />\n    </DoRender>\n  );\n}",
  viteConfig: "/// <reference types=\"vitest/config\" />\nimport react from '@vitejs/plugin-react'\nimport { defineConfig } from 'vite'\n\n// https://vite.dev/config/\nexport default defineConfig(({ mode }) => ({\n  plugins: [react()],\n  resolve: {\n    // Chương 7: đọc \"paths\" của tsconfig ⇒ \"@/…\" chạy ở dev server VÀ Vitest (build thì Rolldown tự đọc).\n    tsconfigPaths: true,\n    // Chương 8: `vite build --mode profiling` ⇒ dùng bản react-dom CÓ BẬT đo, để <Profiler> vẫn báo số trên bản build.\n    alias: mode === 'profiling' ? [{ find: /^react-dom\\/client$/, replacement: 'react-dom/profiling' }] : [],\n  },\n  test: {\n    environment: 'jsdom',\n    setupFiles: ['./src/test/setup.ts'],\n  },\n}))",
  bai1Test: "async function moDanhSach200() {\n  datLaiDuLieu(200); // 6 bác sĩ thật + 194 bác sĩ giả\n  veTrang('/bac-si');\n  await screen.findByRole('heading', { name: 'Đội ngũ bác sĩ (200)' });\n  demRender.clear();\n  nhatKyDo.length = 0;\n}\n\ntest('bấm ♡ MỘT thẻ: bao nhiêu thẻ chạy lại?', async () => {\n  const user = userEvent.setup();\n  await moDanhSach200();\n  await user.click(screen.getByRole('button', { name: 'Yêu thích BS. Nguyễn Minh An' }));\n  console.info('[bam tim] số lần commit:', nhatKyDo.length, '| phase:', nhatKyDo.map((c) => c.phase).join(','));\n  console.info('[bam tim] TheBacSi chạy:', demRender.get('TheBacSi'), 'lần — thẻ thật sự đổi: 1');\n  expect(nhatKyDo).toHaveLength(1); // một cú bấm = một lần commit\n});",
  eventTiming: "  await p.evaluate(() => {\n    window.__suKien = [];\n    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__suKien.push({ ten: e.name, ms: e.duration }); })\n      .observe({ type: 'event', durationThreshold: 16, buffered: false });\n  });\n  await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });",
  tieuChi81: "beforeEach(() => {\n  datLaiDuLieu(200); // setup.ts trả về 6 bác sĩ sau MỖI test\n  demRender.clear();\n  nhatKyDo.length = 0;\n});\n\ntest('8.1 — /bac-si với 200 bác sĩ: <Profiler id=\"KhuBacSi\"> ghi mount rồi update', async () => {\n  veTrang('/bac-si');\n  expect(await screen.findByRole('heading', { name: 'Đội ngũ bác sĩ (200)' })).toBeInTheDocument();\n  expect(nhatKyDo[0]).toMatchObject({ id: 'KhuBacSi', phase: 'mount' });\n  expect(nhatKyDo.at(-1)).toMatchObject({ id: 'KhuBacSi', phase: 'update' });\n});",
  bai2: "/* ───────── Thẻ THƯỜNG: cha render là nó render ───────── */\nexport function TheThuong({ bacSi, laYeuThich, onDoi }: { bacSi: BacSi; laYeuThich: boolean; onDoi: (id: string) => void }) {\n  dem.the++;\n  return (\n    <li>\n      {bacSi.ten}{' '}\n      <button type=\"button\" aria-label={`Yêu thích ${bacSi.ten}`} aria-pressed={laYeuThich} onClick={() => onDoi(bacSi.id)}>\n        {laYeuThich ? '♥' : '♡'}\n      </button>\n    </li>\n  );\n}\n\n/* ───────── Thẻ MEMO: props giống hệt lần trước (so bằng Object.is từng prop) ⇒ bỏ qua ───────── */\nexport const TheMemo = memo(TheThuong);\n\ntype Kieu = 'thuong' | 'memo-ham-moi' | 'memo-use-callback' | 'memo-object-moi';\n\n/** Một danh sách 200 thẻ, ba cách viết. Bấm ♡ ⇒ đếm xem bao nhiêu thẻ chạy lại. */\nexport function DanhSachThu({ kieu }: { kieu: Kieu }) {\n  const [yeuThich, setYeuThich] = useState<string[]>([]);\n\n  // Hàm này được TẠO MỚI ở mỗi lần render (mỗi lần DanhSachThu chạy là một hàm khác).\n  const doi = (id: string) => setYeuThich((ds) => (ds.includes(id) ? ds.filter((x) => x !== id) : [...ds, id]));\n  // useCallback: trả về CÙNG một hàm qua các lần render, tới khi một phần tử trong [] đổi.\n  // [] rỗng được vì bên trong chỉ dùng setYeuThich — hàm set của useState không bao giờ đổi.\n  const doiOnDinh = useCallback(\n    (id: string) => setYeuThich((ds) => (ds.includes(id) ? ds.filter((x) => x !== id) : [...ds, id])),\n    [],\n  );\n\n  const The = kieu === 'thuong' ? TheThuong : TheMemo;\n  return (\n    <ul>\n      {DS_200.map((bs) => (\n        <The\n          key={bs.id}\n          bacSi={kieu === 'memo-object-moi' ? { ...bs } : bs} // { ...bs }: object MỚI mỗi lần render\n          laYeuThich={yeuThich.includes(bs.id)}\n          onDoi={kieu === 'thuong' || kieu === 'memo-ham-moi' ? doi : doiOnDinh}\n        />\n      ))}\n    </ul>\n  );\n}",
  bai2Test: "for (const kieu of ['thuong', 'memo-ham-moi', 'memo-use-callback', 'memo-object-moi'] as const) {\n  test(`bấm ♡ một thẻ trong 200 — ${kieu}`, async () => {\n    const user = userEvent.setup();\n    render(<DanhSachThu kieu={kieu} />);\n    dem.the = 0;\n    await user.click(screen.getByRole('button', { name: 'Yêu thích BS. Nguyễn Minh An (1)' }));\n    console.info(`[${kieu}] thẻ chạy lại: ${dem.the}`);\n    expect(screen.getByRole('button', { name: 'Yêu thích BS. Nguyễn Minh An (1)' })).toHaveAttribute('aria-pressed', 'true');\n  });\n}",
  doLoc: "test('locBacSi trên 200 và 1000 bác sĩ tốn bao lâu? (đo 2000 lần, lấy trung bình)', () => {\n  for (const n of [200, 1000]) {\n    const ds = taoBacSiGia(n, 1);\n    locBacSi(ds, 'tat-ca', 'huy'); // chạy nháp một lần cho JIT\n    const t0 = performance.now();\n    for (let i = 0; i < 2000; i++) locBacSi(ds, 'tat-ca', 'huy');\n    const moiLan = (performance.now() - t0) / 2000;\n    console.info(`[locBacSi] ${n} bác sĩ: ${(moiLan * 1000).toFixed(0)} µs mỗi lần (${moiLan.toFixed(3)} ms)`);\n  }\n});",
  theBacSi: "import { memo } from 'react';\nimport { Link } from 'react-router';\nimport { TEN_CHUYEN_KHOA } from '@/du-lieu/chuyen-khoa';\nimport { useDemRender } from '@/shared/dev/dem-render';\nimport { duongDan } from '@/shared/duong-dan';\nimport type { BacSi } from '@/types';\n\ninterface TheBacSiProps {\n  bacSi: BacSi;\n  noiBat?: boolean; // dấu ? = không bắt buộc\n  laYeuThich?: boolean;\n  /** Chương 7: \"Xem chi tiết\" là một LINK tới /bac-si/:id (mở tab mới được), không còn là nút mở khung bên cạnh. */\n  coLienKet?: boolean;\n  onDoiYeuThich?: (id: string) => void;\n}\n\n/**\n * Chương 8: memo — đo thấy bấm ♡ một thẻ làm CẢ 200 thẻ chạy lại (Bài 8.1). Props của thẻ đều ổn định\n * (bacSi từ cache TanStack, onDoiYeuThich là action Zustand — không bao giờ đổi) ⇒ memo bỏ qua 199 thẻ.\n */\nexport const TheBacSi = memo(function TheBacSi({ bacSi, noiBat = false, laYeuThich = false, coLienKet = false, onDoiYeuThich }: TheBacSiProps) {\n  useDemRender('TheBacSi'); // Chương 8: đếm số lần thẻ chạy (chỉ ở dev/test)\n  const lop = ['the-bac-si', noiBat && 'noi-bat'].filter(Boolean).join(' ');\n  return (\n    <article className={lop} aria-label={bacSi.ten}>\n      <h3>{bacSi.ten}</h3>\n      <p className=\"chuyen-khoa\">{TEN_CHUYEN_KHOA[bacSi.chuyenKhoa]}</p>\n      <p>{bacSi.namKinhNghiem} năm kinh nghiệm</p>\n      {noiBat && <p className=\"nhan\">Bác sĩ lâu năm</p>}\n      <div className=\"hang-nut\">\n        {coLienKet && (\n          <Link className=\"nut nut-chinh\" to={duongDan.chiTietBacSi(bacSi.id)} aria-label={`Xem chi tiết ${bacSi.ten}`}>\n            Xem chi tiết\n          </Link>\n        )}\n        {onDoiYeuThich && (\n          <button\n            type=\"button\"\n            className=\"nut nut-tim\"\n            aria-label={`Yêu thích ${bacSi.ten}`}\n            aria-pressed={laYeuThich}\n            onClick={() => onDoiYeuThich(bacSi.id)}\n          >\n            {laYeuThich ? '♥' : '♡'}\n          </button>\n        )}\n      </div>\n    </article>\n  );\n});",
  useMemoMau: "/* ───────── useMemo: nhớ KẾT QUẢ một phép tính giữa các lần render ───────── */\nexport function LocCoMemo({ ds, tuKhoa, soLanBam }: { ds: BacSi[]; tuKhoa: string; soLanBam: number }) {\n  const ketQua = useMemo(() => locBacSi(ds, 'tat-ca', tuKhoa), [ds, tuKhoa]);\n  return (\n    <p>\n      {ketQua.length} kết quả · đã bấm {soLanBam}\n    </p>\n  );\n}",
  viteCompiler: "/// <reference types=\"vitest/config\" />\nimport babel from '@rolldown/plugin-babel'\nimport { reactCompilerPreset } from '@vitejs/plugin-react'\nimport { defineConfig, mergeConfig } from 'vite'\nimport coBan from './vite.config.ts'\n\n// Chương 8 (thử): cùng cấu hình, THÊM React Compiler 1.0 qua Babel. Chương 12 bàn kỹ.\nexport default defineConfig((env) =>\n  mergeConfig(coBan(env), {\n    plugins: [babel({ presets: [reactCompilerPreset()] })],\n  }),\n)",
  kiemCompiler: "// Hỏi React Compiler: component nào được biên dịch, component nào bị bỏ qua và VÌ SAO.\nimport { transformSync } from '@babel/core';\nimport fs from 'node:fs';\nfor (const f of process.argv.slice(2)) {\n  const su = [];\n  const kq = transformSync(fs.readFileSync(f, 'utf8'), {\n    filename: f, babelrc: false, configFile: false,\n    parserOpts: { plugins: ['typescript', 'jsx'] },\n    plugins: [['babel-plugin-react-compiler', { logger: { logEvent: (_f, e) => su.push(e) } }]],\n  });\n  for (const e of su) {\n    if (e.kind === 'CompileSuccess') console.log(`[compiler] ${f.split('src/')[1]} · ${e.fnName}: ĐÃ biên dịch (${e.memoSlots} ô nhớ)`);\n    else console.log(`[compiler] ${f.split('src/')[1]} · ${e.fnName ?? ''}: ${e.kind} — ${String(e.detail?.reason ?? e.detail?.options?.reason ?? JSON.stringify(e.detail ?? '')).slice(0, 220)}`);\n  }\n  if (process.env.IN) console.log(kq.code);\n}",
  tieuChi82: "test('8.2 — bấm ♡ một thẻ trong 200 ⇒ đúng MỘT TheBacSi chạy lại', async () => {\n  const user = userEvent.setup();\n  veTrang('/bac-si');\n  await screen.findByRole('heading', { name: 'Đội ngũ bác sĩ (200)' });\n  demRender.clear();\n  await user.click(screen.getByRole('button', { name: 'Yêu thích BS. Trần Thu Hà' }));\n  expect(demRender.get('TheBacSi')).toBe(1);\n  expect(screen.getByRole('button', { name: 'Yêu thích BS. Trần Thu Hà' })).toHaveAttribute('aria-pressed', 'true');\n});\n\ntest('8.2 — gõ tìm \"huy\": thẻ còn lại KHÔNG chạy lại (props không đổi)', async () => {\n  const user = userEvent.setup();\n  veTrang('/bac-si');\n  await screen.findByRole('heading', { name: 'Đội ngũ bác sĩ (200)' });\n  demRender.clear();\n  await user.type(screen.getByLabelText('Tìm theo tên'), 'huy');\n  expect(screen.getAllByRole('article')).toHaveLength(17);\n  expect(demRender.get('TheBacSi') ?? 0).toBe(0);\n});",
  router: "import type { RouteObject } from 'react-router';\nimport { YeuCauDangNhap } from '@/features/dang-nhap';\nimport { Trang404 } from '@/pages/Trang404';\nimport { TrangChiTietBacSi } from '@/pages/TrangChiTietBacSi';\nimport { TrangChu } from '@/pages/TrangChu';\nimport { TrangDanhSachBacSi } from '@/pages/TrangDanhSachBacSi';\nimport { KhungTrang } from './KhungTrang';\nimport { TrangLoi } from './TrangLoi';\n\n/**\n * Bảng route của cả app — MỘT chỗ nhìn ra mọi URL. Là dữ liệu thường nên test dùng lại được\n * (createMemoryRouter(routes, …) trong src/test/render.tsx), còn main.tsx dùng createBrowserRouter(routes).\n *\n * Chương 8: ba trang ÍT người mở (đặt lịch, lịch hẹn, đăng nhập) chuyển sang `lazy` — mã của chúng (và của\n * react-hook-form + zod mà chỉ form đặt lịch cần) tách ra file riêng, chỉ tải khi người dùng thật sự tới đó.\n * import() nằm TRONG hàm ⇒ lúc build Vite thấy một \"điểm cắt\" và sinh chunk riêng.\n * Là HÀM tạo mảng mới mỗi lần gọi: React Router GHI vào object `lazy` sau khi tải xong (xoá các khoá đã tải),\n * nên hai router không được dùng chung một mảng — test tạo router mới cho MỖI test (Bài 8.3, đo thật).\n */\nexport function taoRoutes(): RouteObject[] {\n  return [\n    {\n      path: '/',\n      Component: KhungTrang, // header + menu + <Outlet /> + footer: vẽ MỘT lần\n      ErrorBoundary: TrangLoi, // lỗi lúc render ở bất kỳ trang nào ⇒ vẫn còn khung, không trắng màn hình\n      children: [\n        { index: true, Component: TrangChu },\n        { path: 'bac-si', Component: TrangDanhSachBacSi },\n        { path: 'bac-si/:id', Component: TrangChiTietBacSi },\n        {\n          Component: YeuCauDangNhap, // layout KHÔNG path: cổng cho mọi trang con bên trong\n          children: [\n            {\n              path: 'dat-lich/:khungGioId',\n              lazy: { Component: async () => (await import('@/pages/TrangDatLich')).TrangDatLich },\n            },\n            {\n              path: 'lich-hen',\n              lazy: { Component: async () => (await import('@/pages/TrangLichHen')).TrangLichHen },\n            },\n          ],\n        },\n        {\n          path: 'dang-nhap', // NGOÀI cổng — trong cổng là màn hình trắng (Bài 7.2)\n          lazy: { Component: async () => (await import('@/pages/TrangDangNhap')).TrangDangNhap },\n        },\n        { path: '*', Component: Trang404 },\n      ],\n    },\n  ];\n}\n\n/** Router của app (main.tsx) dùng MỘT bảng route duy nhất. */\nexport const routes = taoRoutes();",
  cuaNhe: "/**\n * CỬA NHẸ của tính năng \"đặt lịch\": chọn ngày/giờ. Trang chi tiết bác sĩ (tải ngay từ đầu) đi qua cửa này.\n * Chương 8: form + schema (kéo theo react-hook-form và zod, ~110 kB) dời sang cửa riêng './form' — nếu còn\n * nằm ở đây thì MỌI trang import cửa này đều kéo zod vào bundle đầu, lazy route cũng không cứu được (đo ở Bài 8.3).\n */\nexport { ChonKhungGio } from './ChonKhungGio';\nexport { docNgay } from './doc-ngay';\nexport { useKhungGio } from './useKhungGio';",
  cuaNang: "/** CỬA NẶNG của tính năng \"đặt lịch\": form bệnh nhân + gửi yêu cầu (react-hook-form, zod). Chỉ trang /dat-lich (lazy) dùng. */\nexport { FormDatLich } from './FormDatLich';\nexport { useDatLich } from './useDatLich';\nexport { datLichSchema, type DatLich } from './schema'; // máy chủ giả (src/mocks) kiểm lại bằng CHÍNH schema của form",
  khungTrangCho: "export function KhungTrang() {\n  // Chương 8: route lazy ⇒ bấm link xong phải ĐỢI tải mã của trang mới. Trong lúc đó báo cho người dùng biết.\n  const dangMoTrang = useNavigation().state === 'loading';\n  return (\n    <>\n      {/* Chương 8: link đầu tiên của trang, chỉ hiện khi được focus — người dùng bàn phím nhảy qua menu bằng MỘT phím Enter */}\n      <a className=\"bo-qua\" href=\"#noi-dung\">\n        Bỏ qua, tới nội dung chính\n      </a>\n      <Header />\n      {dangMoTrang && (\n        <p className=\"dang-mo-trang\" role=\"status\">\n          Đang mở trang…\n        </p>\n      )}",
  veTrang: "/** Chương 7: vẽ CẢ APP (đúng bảng route thật) ở một URL — test đi từ trang này sang trang khác như người dùng. */\nexport function veTrang(url: string, queryClient = taoClientTest()) {\n  const router = createMemoryRouter(taoRoutes(), { initialEntries: [url] }); // Chương 8: bảng route MỚI cho mỗi router (lazy)\n  const kq = render(\n    <QueryClientProvider client={queryClient}>\n      <RouterProvider router={router} />\n    </QueryClientProvider>,\n  );\n  return { ...kq, router, queryClient };\n}",
  testSuaLazy: "    await user.click(await screen.findByRole('link', { name: '14:00 · 01/10/2026' }));\n    // Chương 8: /dat-lich là route lazy ⇒ URL chỉ đổi SAU KHI tải xong mã của trang. Đợi trang hiện rồi mới hỏi URL.\n    expect(await screen.findByRole('heading', { name: 'Đặt lịch khám' })).toBeInTheDocument();\n    expect(router.state.location.pathname).toBe('/dat-lich/bs-2-2026-10-01-1400');\n    expect(router.state.location.search).toBe('?bacSi=bs-2&ngay=2026-10-01');",
  bai3: "import { lazy, Suspense, useState } from 'react';\n\n/** Giả lập mạng chậm: import() xong vẫn đợi thêm `ms` mới trả về (chỉ để thấy fallback trong test). */\nexport const cham = <T,>(p: Promise<T>, ms: number) => p.then((m) => new Promise<T>((r) => setTimeout(() => r(m), ms)));\n\n// ✓ Khai ở CẤP MODULE: một \"loại\" component duy nhất suốt đời app.\nconst HuongDanLuoi = lazy(() => cham(import('./HuongDanKham'), 300));\n\nexport function NutHuongDan() {\n  const [mo, setMo] = useState(false);\n  return (\n    <>\n      <button type=\"button\" onClick={() => setMo(true)}>\n        Xem hướng dẫn chuẩn bị\n      </button>\n      {mo && (\n        <Suspense fallback={<p role=\"status\">Đang tải hướng dẫn…</p>}>\n          <HuongDanLuoi />\n        </Suspense>\n      )}\n    </>\n  );\n}\n\nconst HuongDanNgoai = lazy(() => import('./HuongDanKham'));\n\n/** ✓ Cùng giao diện, lazy() ở cấp module. */\nexport function NutHuongDanDung() {\n  const [soLanBam, setSoLanBam] = useState(0);\n  return (\n    <>\n      <button type=\"button\" onClick={() => setSoLanBam((n) => n + 1)}>\n        Đã đọc ({soLanBam})\n      </button>\n      <Suspense fallback={<p role=\"status\">Đang tải hướng dẫn…</p>}>\n        <HuongDanNgoai />\n      </Suspense>\n    </>\n  );\n}\n\n/** ✗ Khai lazy() TRONG component: mỗi lần render là một loại component MỚI ⇒ gỡ cái cũ, tải/dựng lại. */\nexport function NutHuongDanSai() {\n  const [soLanBam, setSoLanBam] = useState(0);\n  const HuongDanTrongHam = lazy(() => import('./HuongDanKham'));\n  return (\n    <>\n      <button type=\"button\" onClick={() => setSoLanBam((n) => n + 1)}>\n        Đã đọc ({soLanBam})\n      </button>\n      <Suspense fallback={<p role=\"status\">Đang tải hướng dẫn…</p>}>\n        <HuongDanTrongHam />\n      </Suspense>\n    </>\n  );\n}",
  bai3Test: "for (const [ten, Nut] of [['khai ở cấp module', NutHuongDanDung], ['khai TRONG component', NutHuongDanSai]] as const) {\n  test(`lazy() ${ten}: bấm \"Đã đọc\" 3 lần — \"Đang tải…\" hiện lại mấy lần?`, async () => {\n    const user = userEvent.setup();\n    render(<Nut />);\n    await screen.findByRole('heading', { name: 'Chuẩn bị trước khi khám' });\n    let soLanNhay = 0;\n    for (let i = 0; i < 3; i++) {\n      await user.click(screen.getByRole('button', { name: /Đã đọc/ }));\n      if (screen.queryByRole('status')) soLanNhay++; // nội dung vừa bị thay bằng fallback\n      await screen.findByRole('heading', { name: 'Chuẩn bị trước khi khám' }, { timeout: 3000 });\n    }\n    console.info(`[lazy ${ten}] 3 lần bấm ⇒ nội dung biến mất, hiện \"Đang tải…\": ${soLanNhay} lần`);\n    expect(soLanNhay).toBe(Nut === NutHuongDanDung ? 0 : 3);\n  });\n}",
  anhBacSi: "export function AnhBacSi({ so, kieu }: { so: number; kieu: Kieu }) {\n  const coKichThuoc = kieu !== 'lazy-khong-kich-thuoc';\n  return (\n    <img\n      src={`/anh-bac-si/bs-${so}.jpg`}\n      alt=\"\" // ảnh trang trí: tên bác sĩ đã có ngay bên cạnh ⇒ trình đọc màn hình bỏ qua ảnh\n      width={coKichThuoc ? 96 : undefined} // có width/height ⇒ trình duyệt GIỮ CHỖ trước khi ảnh về\n      height={coKichThuoc ? 96 : undefined}\n      loading={kieu === 'eager' ? 'eager' : 'lazy'} // lazy: chỉ tải khi ảnh sắp cuộn tới\n      decoding=\"async\"\n      style={{ borderRadius: 12, display: 'block', marginBottom: 8 }}\n    />\n  );\n}",
  phanTich: "// Mỗi gói chiếm bao nhiêu byte trong một file JS đã build (đọc sourcemap: đoạn mã sinh ra thuộc file nguồn nào).\nimport fs from 'node:fs';\nimport { SourceMapConsumer } from 'source-map-js';\nconst [js] = process.argv.slice(2);\nconst code = fs.readFileSync(js, 'utf8');\nconst map = new SourceMapConsumer(JSON.parse(fs.readFileSync(js + '.map', 'utf8')));\nconst dong = code.split('\\n');\nconst theoGoi = {};\nconst nhom = (src) => { const m = src?.match(/node_modules\\/((@[^/]+\\/)?[^/]+)/); return m ? m[1] : src ? 'src/ (mã của app)' : '(không rõ)'; };\nlet truoc = null;\nmap.eachMapping((m) => {\n  if (truoc && truoc.line === m.generatedLine) { const k = nhom(truoc.src); theoGoi[k] = (theoGoi[k] || 0) + (m.generatedColumn - truoc.col); }\n  else if (truoc) { const k = nhom(truoc.src); theoGoi[k] = (theoGoi[k] || 0) + (dong[truoc.line - 1].length - truoc.col); }\n  truoc = { line: m.generatedLine, col: m.generatedColumn, src: m.source };\n});\nconst tong = Buffer.byteLength(code);\nconsole.log(`${js.split('/').pop()} — ${(tong / 1000).toFixed(1)} kB`);\nObject.entries(theoGoi).sort((a, b) => b[1] - a[1]).slice(0, 12).forEach(([k, v]) => console.log(`  ${k.padEnd(30)} ${(v / 1000).toFixed(1).padStart(6)} kB`));",
  bai4Div: "/* ───────── ✗ 1. Kiểu \"div bấm được\" (hay gặp trong đồ án): nhìn giống nút, nhưng không phải nút ───────── */\nexport function BoChonGioDiv({ onChon }: { onChon: (g: string) => void }) {\n  const [chon, setChon] = useState<string | null>(null);\n  return (\n    <div className=\"bo-chon-gio\">\n      <div className=\"nhan\">Chọn giờ khám</div>\n      {GIO.map((g) => (\n        <div key={g} className={g === chon ? 'o-gio dang-chon' : 'o-gio'} onClick={() => { setChon(g); onChon(g); }}>\n          {g}\n        </div>\n      ))}\n    </div>\n  );\n}",
  bai4Radio: "/* ───────── ✓ 2. HTML có sẵn: fieldset + legend + input radio. Bàn phím, tên, trạng thái — miễn phí ───────── */\nexport function BoChonGioRadio({ onChon }: { onChon: (g: string) => void }) {\n  const [chon, setChon] = useState<string | null>(null);\n  return (\n    <fieldset className=\"bo-chon-gio\">\n      <legend>Chọn giờ khám</legend>\n      {GIO.map((g) => (\n        <label key={g} className=\"o-gio\">\n          <input\n            type=\"radio\"\n            name=\"gio-kham\"\n            value={g}\n            checked={g === chon}\n            onChange={() => { setChon(g); onChon(g); }}\n          />\n          {g}\n        </label>\n      ))}\n    </fieldset>\n  );\n}",
  bai4Aria: "/* ───────── 3. Tự làm bằng ARIA (khi thật sự không dùng được input): role + roving tabindex + phím mũi tên ───────── */\nexport function BoChonGioAria({ onChon }: { onChon: (g: string) => void }) {\n  const [chon, setChon] = useState<string | null>(null);\n  const nutRef = useRef<(HTMLButtonElement | null)[]>([]);\n  const viTriFocus = chon ? GIO.indexOf(chon) : 0; // ô được nhận Tab: ô đang chọn, chưa chọn thì ô đầu\n\n  function chonTai(i: number) {\n    setChon(GIO[i]);\n    onChon(GIO[i]);\n    nutRef.current[i]?.focus();\n  }\n  function xuLyPhim(e: KeyboardEvent, i: number) {\n    const n = GIO.length;\n    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); chonTai((i + 1) % n); }\n    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); chonTai((i - 1 + n) % n); }\n    if (e.key === 'Home') { e.preventDefault(); chonTai(0); }\n    if (e.key === 'End') { e.preventDefault(); chonTai(n - 1); }\n  }\n  return (\n    <div role=\"radiogroup\" aria-labelledby=\"nhan-gio\" className=\"bo-chon-gio\">\n      <span id=\"nhan-gio\">Chọn giờ khám</span>\n      {GIO.map((g, i) => (\n        <button\n          key={g}\n          ref={(n) => { nutRef.current[i] = n; }}\n          type=\"button\"\n          role=\"radio\"\n          aria-checked={g === chon}\n          tabIndex={i === viTriFocus ? 0 : -1} // roving tabindex: cả nhóm chỉ MỘT điểm dừng Tab\n          onClick={() => chonTai(i)}\n          onKeyDown={(e) => xuLyPhim(e, i)}\n          className=\"o-gio\"\n        >\n          {g}\n        </button>\n      ))}\n    </div>\n  );\n}",
  bai4Test: "async function quetAxe(el: Element) {\n  const kq = await axe.run(el, { rules: { 'color-contrast': { enabled: false } } });\n  return kq.violations.map((v) => `${v.id} × ${v.nodes.length}`);\n}\n\nconst CAC_BO = [\n  ['div onClick', BoChonGioDiv],\n  ['input radio', BoChonGioRadio],\n  ['ARIA tự làm', BoChonGioAria],\n] as const;\n\nfor (const [ten, BoChon] of CAC_BO) {\n  test(`${ten}: axe nói gì, bàn phím làm được gì`, async () => {\n    const user = userEvent.setup();\n    const daChon: string[] = [];\n    const { container } = render(\n      <>\n        <button type=\"button\">Trước</button>\n        <BoChon onChon={(g) => daChon.push(g)} />\n        <button type=\"button\">Sau</button>\n      </>,\n    );\n    const loi = await quetAxe(container);\n    // Tab từ nút \"Trước\" cho tới khi tới nút \"Sau\": đếm số điểm dừng nằm giữa\n    screen.getByRole('button', { name: 'Trước' }).focus();\n    let soDiemDung = 0;\n    for (let i = 0; i < 10; i++) {\n      await user.tab();\n      if (document.activeElement === screen.getByRole('button', { name: 'Sau' })) break;\n      soDiemDung++;\n    }\n    // Quay lại bộ chọn, dùng phím: Space chọn, → sang giờ kế tiếp\n    screen.getByRole('button', { name: 'Trước' }).focus();\n    await user.tab();\n    const dangFocus = (document.activeElement?.textContent || document.activeElement?.getAttribute('value') || document.activeElement?.tagName) ?? '';\n    await user.keyboard(' ');\n    await user.keyboard('{ArrowRight}');\n    const radio = screen.queryAllByRole('radio');\n    console.info(\n      `[${ten}] axe: ${loi.length ? loi.join(', ') : '0 lỗi'} | điểm dừng Tab trong bộ chọn: ${soDiemDung}` +\n        ` | Tab lần 1 tới: ${dangFocus.trim()} | Space rồi → ⇒ đã chọn: ${daChon.join(' → ') || '(không gì)'}` +\n        ` | role radio: ${radio.length}${radio.length ? `, đang chọn: ${radio.filter((r) => (r as HTMLInputElement).checked || r.getAttribute('aria-checked') === 'true').map((r) => r.textContent || (r as HTMLInputElement).value).join(',')}` : ''}`,\n    );\n  });\n}",
  chonNgay: "      {/* Chương 8: chọn MỘT trong ba ngày ⇒ nhóm radio THẬT (trước là nút aria-pressed — nghĩa là bật/tắt, sai vai).\n          Radio cho không: một điểm dừng Tab cho cả nhóm, phím mũi tên đổi ngày, trình đọc màn hình đọc \"1 trên 3, đã chọn\". */}\n      <fieldset className=\"chip-hang chon-ngay\">\n        <legend>Chọn ngày khám</legend>\n        {NGAY_KHAM.map((n) => (\n          <label key={n} className=\"chip\">\n            <input\n              type=\"radio\"\n              name=\"ngay-kham\"\n              value={n}\n              checked={n === ngay}\n              onChange={() => setSp({ ngay: n }, { replace: true })}\n            />\n            {hienNgay(n)}\n          </label>\n        ))}\n      </fieldset>",
  khungTrangBoQua: "      {/* Chương 8: link đầu tiên của trang, chỉ hiện khi được focus — người dùng bàn phím nhảy qua menu bằng MỘT phím Enter */}\n      <a className=\"bo-qua\" href=\"#noi-dung\">\n        Bỏ qua, tới nội dung chính\n      </a>\n      <Header />\n      …\n      <main className=\"noi-dung\" id=\"noi-dung\" tabIndex={-1}>",
  cssA11y: "/* Chương 8: khả năng tiếp cận */\n:focus-visible { outline: 3px solid #b45309; outline-offset: 2px; } /* viền focus rõ, chỉ khi dùng bàn phím */\nmain:focus { outline: none; } /* main nhận focus từ link \"Bỏ qua\" — không cần viền quanh cả trang */\n.bo-qua { position: absolute; left: 12px; top: -48px; background: #fff; color: #0e7490; padding: 8px 14px; border-radius: 8px; font-weight: 700; z-index: 30; }\n.bo-qua:focus { top: 8px; }\n.chon-ngay { border: 0; padding: 0; margin: 0 0 4px; }\n.chon-ngay legend { font-weight: 600; margin-bottom: 6px; padding: 0; }\n.chon-ngay .chip { position: relative; display: inline-flex; align-items: center; }\n.chon-ngay input { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: pointer; } /* ẩn chấm tròn, GIỮ input thật */\n.chon-ngay .chip:has(input:checked) { background: #0e7490; border-color: #0e7490; color: #fff; }\n.chon-ngay .chip:has(input:focus-visible) { outline: 3px solid #b45309; outline-offset: 2px; }",
  khungXuongSua: "export function LuoiGioKhung() {\n  return (\n    <div className=\"lua-chon\" role=\"status\" aria-busy=\"true\" aria-label=\"Đang tải khung giờ\"> {/* Chương 8: div trơn không được mang aria-label (axe: aria-prohibited-attr) ⇒ cho nó vai \"status\" */}\n      {Array.from({ length: 4 }, (_, i) => (\n        <div key={i} className=\"khung-xuong-nut rong-gio\" aria-hidden=\"true\" />\n      ))}\n    </div>\n  );\n}",
  a11yTest: "import { screen, within } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\nimport axe from 'axe-core';\nimport { describe, expect, test } from 'vitest';\nimport { veTrang } from '@/test/render';\n\n/** Tiêu chí đạt 🛠 Chương 8 (Bài 8.4): axe sạch trên bốn trang, và đi được bằng bàn phím. */\nasync function loiAxe() {\n  // jsdom không tính bố cục ⇒ tắt luật độ tương phản ở đây; độ tương phản kiểm bằng Chromium (do/do-axe.mjs)\n  const kq = await axe.run(document.body, { rules: { 'color-contrast': { enabled: false } } });\n  return kq.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);\n}\n\ndescribe('Chương 8 — khả năng tiếp cận', () => {\n  test.each([\n    ['/', 'Đặt lịch khám không cần xếp hàng'],\n    ['/bac-si', 'Đội ngũ bác sĩ (6)'],\n    ['/bac-si/bs-2', 'BS. Trần Thu Hà'],\n    ['/dang-nhap', 'Đăng nhập'],\n  ])('axe: %s không có lỗi nào', async (url, tieuDe) => {\n    veTrang(url);\n    await screen.findByRole('heading', { name: tieuDe });\n    expect(await loiAxe()).toEqual([]);\n  });\n\n  test('Tab đầu tiên tới link \"Bỏ qua, tới nội dung chính\", trỏ tới <main id=\"noi-dung\"> nhận được focus', async () => {\n    const user = userEvent.setup();\n    veTrang('/bac-si');\n    await screen.findByRole('heading', { name: 'Đội ngũ bác sĩ (6)' });\n    await user.tab();\n    expect(screen.getByRole('link', { name: 'Bỏ qua, tới nội dung chính' })).toHaveFocus();\n    expect(screen.getByRole('link', { name: 'Bỏ qua, tới nội dung chính' })).toHaveAttribute('href', '#noi-dung');\n    // jsdom không làm \"nhảy tới #hash\" như trình duyệt — phần đó kiểm bằng Chromium thật (do/do-ban-phim.mjs)\n    expect(screen.getByRole('main')).toHaveAttribute('id', 'noi-dung');\n    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1');\n  });\n\n  test('ngày khám: nhóm radio có tên, MỘT điểm dừng Tab, phím → đổi ngày (replace)', async () => {\n    const user = userEvent.setup();\n    const { router } = veTrang('/bac-si/bs-2');\n    const nhom = await screen.findByRole('group', { name: 'Chọn ngày khám' });\n    const ngay = within(nhom).getAllByRole('radio');\n    expect(ngay).toHaveLength(3);\n    expect(ngay[0]).toBeChecked();\n    ngay[0].focus();\n    await user.keyboard('{ArrowRight}');\n    expect(screen.getByRole('radio', { name: '02/10/2026' })).toBeChecked();\n    expect(router.state.location.search).toBe('?ngay=2026-10-02');\n    expect(router.state.historyAction).toBe('REPLACE');\n    await screen.findAllByRole('link', { name: /· 02\\/10\\/2026$/ }); // đợi giờ của ngày mới về (lúc đang tải, ô giờ chưa bấm được)\n    await user.tab(); // rời nhóm bằng MỘT phím Tab: tới giờ khám đầu tiên, không đi qua hai ngày còn lại\n    expect(document.activeElement?.closest('ul')).toHaveAccessibleName('Giờ khám ngày 02/10/2026');\n  });\n});",
  doAxe: "    const kq = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();",
};

/* ─── Output THẬT (Vitest, vite build, Chromium qua Playwright) — chép nguyên văn ─── */
const OUT = {
  bai1Truoc: "[bam tim] số lần commit: 1 | phase: update\n[bam tim] TheBacSi chạy: 200 lần — thẻ thật sự đổi: 1\n[go \"h\"] commit: 1 | TheBacSi chạy: 162 | thẻ trên màn hình: 162\n[go \"u\"] commit: 1 | TheBacSi chạy: 50 | thẻ trên màn hình: 50\n[go \"y\"] commit: 1 | TheBacSi chạy: 17 | thẻ trên màn hình: 17\n[onRender] id=KhuBacSi phase=mount actualDuration=1.2ms baseDuration=0.7ms\n[onRender] id=KhuBacSi phase=update actualDuration=34.7ms baseDuration=19.2ms\n[onRender] id=KhuBacSi phase=update actualDuration=16.5ms baseDuration=16.2ms",
  bai1Sau: "[bam tim] số lần commit: 1 | phase: update\n[bam tim] TheBacSi chạy: 1 lần — thẻ thật sự đổi: 1\n[go \"h\"] commit: 1 | TheBacSi chạy: 0 | thẻ trên màn hình: 162\n[go \"u\"] commit: 1 | TheBacSi chạy: 0 | thẻ trên màn hình: 50\n[go \"y\"] commit: 1 | TheBacSi chạy: 0 | thẻ trên màn hình: 17\n[onRender] id=KhuBacSi phase=mount actualDuration=1.2ms baseDuration=0.7ms\n[onRender] id=KhuBacSi phase=update actualDuration=34.8ms baseDuration=17.6ms\n[onRender] id=KhuBacSi phase=update actualDuration=2.6ms baseDuration=18.2ms",
  chromiumTruoc: "[production] Chromium 149.0.7827.55 · CPU chậm 4× · 200 bác sĩ\n  bấm ♡ (7 lần): commit/lần = 0,0,0,0,0,0,0 | actualDuration trung vị = 0.0 ms | baseDuration = — ms | tương tác (Event Timing) trung vị = 24.0 ms\n[profiling · chưa memo] Chromium 149.0.7827.55 · CPU chậm 4× · 200 bác sĩ\n  bấm ♡ (7 lần): commit/lần = 1,1,1,1,1,1,1 | actualDuration trung vị = 10.1 ms | baseDuration = 9.2 ms | tương tác (Event Timing) trung vị = 24.0 ms\n  gõ \"h\": commit = 1 | actualDuration = 15.1 ms | tương tác = 24.0 ms\n  gõ \"u\": commit = 1 | actualDuration = 4.3 ms | tương tác = 0.0 ms\n  gõ \"y\": commit = 1 | actualDuration = 1.2 ms | tương tác = 0.0 ms\n  thẻ còn lại sau khi gõ \"huy\": 17\n[profiling · chưa memo] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ\n  bấm ♡ (7 lần): commit/lần = 1,1,1,1,1,1,1 | actualDuration trung vị = 39.8 ms | baseDuration = 37.1 ms | tương tác (Event Timing) trung vị = 88.0 ms\n  gõ \"h\": commit = 1 | actualDuration = 40.6 ms | tương tác = 24.0 ms\n[profiling · chưa memo] Chromium 149.0.7827.55 · CPU chậm 6× · 200 bác sĩ\n  bấm ♡ (7 lần): commit/lần = 1,1,1,1,1,1,1 | actualDuration trung vị = 15.4 ms | baseDuration = 13.0 ms | tương tác (Event Timing) trung vị = 40.0 ms",
  chromiumMemo200: "[profiling · memo(TheBacSi)] Chromium 149.0.7827.55 · CPU chậm 4× · 200 bác sĩ\n  bấm ♡ (7 lần): commit/lần = 1,1,1,1,1,1,1 | actualDuration trung vị = 1.9 ms | baseDuration = 5.3 ms | tương tác (Event Timing) trung vị = 0.0 ms\n  gõ \"h\": commit = 1 | actualDuration = 8.8 ms | tương tác = 16.0 ms\n  gõ \"u\": commit = 1 | actualDuration = 3.6 ms | tương tác = 0.0 ms\n  gõ \"y\": commit = 1 | actualDuration = 2.7 ms | tương tác = 0.0 ms\n  thẻ còn lại sau khi gõ \"huy\": 17",
  chromiumMemo1000: "[profiling · memo(TheBacSi)] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ\n  bấm ♡ (7 lần): commit/lần = 1,1,1,1,1,1,1 | actualDuration trung vị = 5.1 ms | baseDuration = 18.1 ms | tương tác (Event Timing) trung vị = 24.0 ms\n  gõ \"h\": commit = 1 | actualDuration = 26.8 ms | tương tác = 24.0 ms\n  gõ \"u\": commit = 1 | actualDuration = 11.9 ms | tương tác = 16.0 ms\n  gõ \"y\": commit = 1 | actualDuration = 5.6 ms | tương tác = 16.0 ms\n  thẻ còn lại sau khi gõ \"huy\": 84",
  chromiumComp200: "[profiling · React Compiler (Babel 7), không memo tay] Chromium 149.0.7827.55 · CPU chậm 4× · 200 bác sĩ\n  bấm ♡ (7 lần): commit/lần = 1,1,1,1,1,1,1 | actualDuration trung vị = 2.6 ms | baseDuration = 7.0 ms | tương tác (Event Timing) trung vị = 0.0 ms\n  gõ \"h\": commit = 1 | actualDuration = 8.9 ms | tương tác = 24.0 ms\n  gõ \"u\": commit = 1 | actualDuration = 4.4 ms | tương tác = 16.0 ms\n  gõ \"y\": commit = 1 | actualDuration = 1.3 ms | tương tác = 0.0 ms\n  thẻ còn lại sau khi gõ \"huy\": 17",
  chromiumComp1000: "[profiling · React Compiler (Babel 7), không memo tay] Chromium 149.0.7827.55 · CPU chậm 4× · 1000 bác sĩ\n  bấm ♡ (7 lần): commit/lần = 1,1,1,1,1,1,1 | actualDuration trung vị = 7.5 ms | baseDuration = 19.6 ms | tương tác (Event Timing) trung vị = 24.0 ms\n  gõ \"h\": commit = 1 | actualDuration = 29.4 ms | tương tác = 24.0 ms\n  gõ \"u\": commit = 1 | actualDuration = 11.6 ms | tương tác = 16.0 ms\n  gõ \"y\": commit = 1 | actualDuration = 5.8 ms | tương tác = 0.0 ms\n  thẻ còn lại sau khi gõ \"huy\": 84",
  compilerBabel8: "$ npm ls @babel/core\n└── @babel/core@8.0.6\n$ node do/kiem-compiler.mjs src/features/bac-si/components/TheBacSi.tsx src/features/bac-si/KhuBacSi.tsx\n[compiler] features/bac-si/components/TheBacSi.tsx · : CompileError — (BuildHIR::lowerAssignment) Expected object property value to be an LVal, got: AssignmentPattern\n[compiler] features/bac-si/KhuBacSi.tsx · KhuBacSi: ĐÃ biên dịch (57 ô nhớ)",
  compilerBabel7: "[compiler] features/bac-si/components/TheBacSi.tsx · TheBacSi: ĐÃ biên dịch (30 ô nhớ)\n[compiler] features/bac-si/KhuBacSi.tsx · KhuBacSi: ĐÃ biên dịch (57 ô nhớ)\n[compiler] vi-du/bai2.tsx · : CompileError — This value cannot be modified\n[compiler] vi-du/bai2.tsx · DanhSachThu: ĐÃ biên dịch (9 ô nhớ)\n[compiler] vi-du/bai2.tsx · LocCoMemo: ĐÃ biên dịch (6 ô nhớ)",
  compilerVitest: "[thuong] thẻ chạy lại: 200\n[memo-ham-moi] thẻ chạy lại: 1\n[memo-use-callback] thẻ chạy lại: 1\n[bam tim] số lần commit: 1 | phase: update\n[bam tim] TheBacSi chạy: 200 lần — thẻ thật sự đổi: 1\n[go \"h\"] commit: 1 | TheBacSi chạy: 162 | thẻ trên màn hình: 162\n[go \"u\"] commit: 1 | TheBacSi chạy: 50 | thẻ trên màn hình: 50\n[go \"y\"] commit: 1 | TheBacSi chạy: 17 | thẻ trên màn hình: 17\n[onRender] id=KhuBacSi phase=mount actualDuration=1.4ms baseDuration=0.7ms\n[onRender] id=KhuBacSi phase=update actualDuration=36.1ms baseDuration=19.1ms\n[onRender] id=KhuBacSi phase=update actualDuration=2.8ms baseDuration=8.0ms\n[locBacSi] 200 bác sĩ: 101 µs mỗi lần (0.101 ms)\n[locBacSi] 1000 bác sĩ: 494 µs mỗi lần (0.494 ms)\n      Tests  7 passed (7)",
  bai2: "[thuong] thẻ chạy lại: 200\n[memo-ham-moi] thẻ chạy lại: 200\n[memo-use-callback] thẻ chạy lại: 1\n[memo-object-moi] thẻ chạy lại: 200\n[locBacSi] 200 bác sĩ: 96 µs mỗi lần (0.096 ms)\n[locBacSi] 1000 bác sĩ: 475 µs mỗi lần (0.475 ms)",
  bai3: "[lazy] ngay sau khi bấm: Đang tải hướng dẫn…\n[lazy] nội dung hiện sau ~400 ms | fallback còn không? đã gỡ\n[lazy khai ở cấp module] 3 lần bấm ⇒ nội dung biến mất, hiện \"Đang tải…\": 0 lần\n[lazy khai TRONG component] 3 lần bấm ⇒ nội dung biến mất, hiện \"Đang tải…\": 3 lần",
  bai4: "[div onClick] axe: 0 lỗi | điểm dừng Tab trong bộ chọn: 0 | Tab lần 1 tới: Sau | Space rồi → ⇒ đã chọn: (không gì) | role radio: 0\n[input radio] axe: 0 lỗi | điểm dừng Tab trong bộ chọn: 1 | Tab lần 1 tới: 08:00 | Space rồi → ⇒ đã chọn: 08:00 → 09:30 | role radio: 4, đang chọn: 09:30\n[ARIA tự làm] axe: 0 lỗi | điểm dừng Tab trong bộ chọn: 1 | Tab lần 1 tới: 08:00 | Space rồi → ⇒ đã chọn: 08:00 → 09:30 | role radio: 4, đang chọn: 09:30\n[axe] ảnh thiếu alt                      ⇒ image-alt (critical)\n[axe] ô nhập không nhãn                  ⇒ 0 lỗi\n[axe] nút chỉ có biểu tượng              ⇒ 0 lỗi\n[axe] role=\"radio\" thiếu aria-checked    ⇒ aria-required-attr (critical)\n[axe] nhảy cấp tiêu đề (h2 → h4)         ⇒ heading-order (moderate)",
  tieuChi82Truoc: "   × 8.2 — bấm ♡ một thẻ trong 200 ⇒ đúng MỘT TheBacSi chạy lại 262ms\n   × 8.2 — gõ tìm \"huy\": thẻ còn lại KHÔNG chạy lại (props không đổi) 230ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯\n      Tests  2 failed | 1 passed (3)",
  tieuChi82Sau: " ✓ src/features/bac-si/KhuBacSi.hieu-nang.test.tsx > 8.1 — /bac-si với 200 bác sĩ: <Profiler id=\"KhuBacSi\"> ghi mount rồi update\n ✓ src/features/bac-si/KhuBacSi.hieu-nang.test.tsx > 8.2 — bấm ♡ một thẻ trong 200 ⇒ đúng MỘT TheBacSi chạy lại\n ✓ src/features/bac-si/KhuBacSi.hieu-nang.test.tsx > 8.2 — gõ tìm \"huy\": thẻ còn lại KHÔNG chạy lại (props không đổi)\n Test Files  1 passed (1)\n      Tests  3 passed (3)",
  tieuChiSau: " ✓ src/app/router.test.tsx > Chương 7 — định tuyến của app phòng khám > \"/\" ⇒ trang chủ trong layout; bấm menu \"Bác sĩ\" ⇒ /bac-si với 6 bác sĩ\n ✓ src/app/a11y.test.tsx > Chương 8 — khả năng tiếp cận > axe: / không có lỗi nào\n ✓ src/app/router.test.tsx > Chương 7 — định tuyến của app phòng khám > \"Xem chi tiết\" ⇒ /bac-si/bs-2: hồ sơ + chọn giờ, tiêu đề tab theo bác sĩ\n ✓ src/app/router.test.tsx > Chương 7 — định tuyến của app phòng khám > đổi ngày khám ⇒ ?ngay= trên URL, REPLACE (không đẻ lịch sử)\n ✓ src/app/router.test.tsx > Chương 7 — định tuyến của app phòng khám > /bac-si/bs-99 ⇒ API trả 404 ⇒ \"Không có bác sĩ này\", menu vẫn còn\n ✓ src/app/router.test.tsx > Chương 7 — định tuyến của app phòng khám > URL lạ ⇒ trang 404 NẰM TRONG layout\n ✓ src/app/a11y.test.tsx > Chương 8 — khả năng tiếp cận > axe: /bac-si không có lỗi nào\n ✓ src/app/a11y.test.tsx > Chương 8 — khả năng tiếp cận > axe: /bac-si/bs-2 không có lỗi nào\n ✓ src/features/bac-si/KhuBacSi.hieu-nang.test.tsx > 8.1 — /bac-si với 200 bác sĩ: <Profiler id=\"KhuBacSi\"> ghi mount rồi update\n ✓ src/app/a11y.test.tsx > Chương 8 — khả năng tiếp cận > axe: /dang-nhap không có lỗi nào\n ✓ src/app/a11y.test.tsx > Chương 8 — khả năng tiếp cận > Tab đầu tiên tới link \"Bỏ qua, tới nội dung chính\", trỏ tới <main id=\"noi-dung\"> nhận được focus\n ✓ src/app/a11y.test.tsx > Chương 8 — khả năng tiếp cận > ngày khám: nhóm radio có tên, MỘT điểm dừng Tab, phím → đổi ngày (replace)\n ✓ src/app/router.test.tsx > Chương 7 — định tuyến của app phòng khám > /lich-hen chưa đăng nhập ⇒ /dang-nhap; đăng nhập xong ⇒ quay lại /lich-hen, Back 1 lần về trang chủ\n ✓ src/features/bac-si/KhuBacSi.hieu-nang.test.tsx > 8.2 — bấm ♡ một thẻ trong 200 ⇒ đúng MỘT TheBacSi chạy lại\n ✓ src/app/router.test.tsx > Chương 7 — định tuyến của app phòng khám > đặt lịch trọn luồng qua URL: /bac-si/bs-2 → /dat-lich/:khungGioId → /lich-hen\n ✓ src/app/router.test.tsx > Chương 7 — định tuyến của app phòng khám > mở thẳng link /dat-lich/… của một khung ĐÃ KÍN ⇒ báo, có đường chọn giờ khác\n ✓ src/features/bac-si/KhuBacSi.hieu-nang.test.tsx > 8.2 — gõ tìm \"huy\": thẻ còn lại KHÔNG chạy lại (props không đổi)\n ✓ src/app/router.test.tsx > Chương 7 — định tuyến của app phòng khám > chưa đăng nhập bấm một khung giờ ⇒ đăng nhập ⇒ quay lại ĐÚNG /dat-lich/…?bacSi=…&ngay=…\n ✓ src/app/router.test.tsx > Chương 7 — định tuyến của app phòng khám > bộ lọc trên URL sống qua \"tải lại\": /bac-si?ck=nhi ⇒ 2 bác sĩ\n ✓ src/app/router.test.tsx > Chương 7 — định tuyến của app phòng khám > đăng xuất ở /lich-hen ⇒ về trang chủ (REPLACE), mở lại /lich-hen ⇒ trang đăng nhập\n Test Files  3 passed (3)\n      Tests  20 passed (20)",
  buildTruoc: "dist/index.html                    0.47 kB │ gzip:   0.31 kB\ndist/assets/index-C8N9PnM3.css     6.15 kB │ gzip:   1.92 kB\ndist/assets/browser-CKZESbvw.js  426.22 kB │ gzip: 160.56 kB\ndist/assets/index-Bwl2_UuE.js    489.26 kB │ gzip: 153.16 kB\n✓ built in 220ms",
  buildLazyBarrel: "dist/index.html                           0.79 kB │ gzip:   0.40 kB\ndist/assets/index-C8N9PnM3.css            6.15 kB │ gzip:   1.92 kB\ndist/assets/TrangDangNhap-DQhXtyIL.js     0.58 kB │ gzip:   0.41 kB\ndist/assets/TrangLichHen-DReXuxNR.js      0.59 kB │ gzip:   0.45 kB\ndist/assets/TrangDatLich-AuAVGqbF.js      1.79 kB │ gzip:   0.97 kB\ndist/assets/useTieuDeTrang-Bei1foYs.js    2.68 kB │ gzip:   1.30 kB\ndist/assets/bac-si-DxP5BC-K.js           10.83 kB │ gzip:   3.93 kB\ndist/assets/thoi-gian-B1LexYzc.js        43.76 kB │ gzip:  15.23 kB\ndist/assets/duong-dan-CXix6DWZ.js        87.17 kB │ gzip:  28.85 kB\ndist/assets/index-DQC1Ob_L.js           344.67 kB │ gzip: 107.50 kB\ndist/assets/browser-D830LskE.js         426.22 kB │ gzip: 160.56 kB\n✓ built in 155ms\n# node do/phan-tich-bundle.mjs dist-map/assets/index-*.js\nindex-CPBBEdQD.js — 344.7 kB\n  react-dom                       207.1 kB\n  zod                              77.4 kB\n  react-hook-form                  29.8 kB\n  src/ (mã của app)                13.4 kB",
  buildSau: "dist/index.html                           0.71 kB │ gzip:   0.38 kB\ndist/assets/index-C8N9PnM3.css            6.15 kB │ gzip:   1.92 kB\ndist/assets/TrangDangNhap-BI_qDHx1.js     0.57 kB │ gzip:   0.40 kB\ndist/assets/TrangLichHen-X1mwER6H.js      0.60 kB │ gzip:   0.45 kB\ndist/assets/TrangDatLich-Ci8maIVZ.js      1.79 kB │ gzip:   0.98 kB\ndist/assets/jsx-runtime-Dk72oS4N.js       8.77 kB │ gzip:   3.33 kB\ndist/assets/thoi-gian-CO58Tbas.js        54.40 kB │ gzip:  18.16 kB\ndist/assets/useTieuDeTrang-BWWYORo8.js   81.06 kB │ gzip:  26.85 kB\ndist/assets/form-DYeHmiCh.js            114.18 kB │ gzip:  35.20 kB\ndist/assets/index-CuDD-_CN.js           230.11 kB │ gzip:  72.48 kB\ndist/assets/browser-ub9bx-xj.js         426.22 kB │ gzip: 160.56 kB\n✓ built in 120ms",
  lazyMutate: "TRƯỚC: path,lazy | lazy: object\nSAU:   path,lazy | lazy: {} | Component: undefined",
  lazyTestDo: " FAIL  src/app/router.test.tsx > Chương 7 — định tuyến của app phòng khám > đặt lịch trọn luồng qua URL: /bac-si/bs-2 → /dat-lich/:khungGioId → /lich-hen\nAssertionError: expected '/bac-si/bs-2' to be '/dat-lich/bs-2-2026-10-01-1400' // Object.is equality\n\nExpected: \"/dat-lich/bs-2-2026-10-01-1400\"\nReceived: \"/bac-si/bs-2\"\n\n ❯ src/app/router.test.tsx:76:44\n     74|     const { router } = veTrang('/bac-si/bs-2');\n     75|     await user.click(await screen.findByRole('link', { name: '14:00 · …\n     76|     expect(router.state.location.pathname).toBe('/dat-lich/bs-2-2026-1…\n       |                                            ^\n     77|     expect(router.state.location.search).toBe('?bacSi=bs-2&ngay=2026-1…\n     78|     expect(await screen.findByRole('heading', { name: 'Đặt lịch khám' …\n\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯",
  lazyChromTruoc: "[trước lazy] mở /bac-si/bs-2 (sẵn sàng sau 2716 ms): 2 file JS, 915.5 kB\n    index-Bwl2_UuE.js                  489.3 kB\n    browser-CKZESbvw.js                426.2 kB\n[trước lazy] bấm \"14:00\" → thấy \"Đặt lịch khám\" (5 lần): 72 · 40 · 41 · 42 · 48 ms — trung vị 42 ms\n    JS tải thêm ở lần 1: — · các lần sau: — | — | — | — · \"Đang mở trang…\" hiện 0/5 lần",
  lazyChromSau: "[sau lazy] mở /bac-si/bs-2 (sẵn sàng sau 2749 ms): 6 file JS, 914.9 kB\n    jsx-runtime-Dk72oS4N.js              8.8 kB\n    thoi-gian-CO58Tbas.js               54.4 kB\n    useTieuDeTrang-BWWYORo8.js          81.1 kB\n    index-D51W-KCD.js                  230.2 kB\n    form-DYeHmiCh.js                   114.2 kB\n    browser-ub9bx-xj.js                426.2 kB\n[sau lazy] bấm \"14:00\" → thấy \"Đặt lịch khám\" (5 lần): 92 · 45 · 54 · 46 · 43 ms — trung vị 46 ms\n    JS tải thêm ở lần 1: TrangDatLich-BIqm6QWV.js (1.8 kB) · các lần sau: TrangDatLich-BIqm6QWV.js (1.8 kB) | TrangDatLich-BIqm6QWV.js (1.8 kB) | TrangDatLich-BIqm6QWV.js (1.8 kB) | TrangDatLich-BIqm6QWV.js (1.8 kB) · \"Đang mở trang…\" hiện 2/5 lần",
  anh: "[eager                 ] lúc mở: 200 ảnh,  3587 kB · CLS lúc mở = 0.000 · cuộn hết trang: 200 ảnh\n[lazy                  ] lúc mở:  57 ảnh,  1003 kB · CLS lúc mở = 0.000 · cuộn hết trang: 200 ảnh\n[lazy-khong-kich-thuoc ] lúc mở: 111 ảnh,  1971 kB · CLS lúc mở = 0.348 · cuộn hết trang: 200 ảnh",
  bundleTruoc: "$ node do/phan-tich-bundle.mjs dist-map/assets/index-*.js\nindex-Bwl2_UuE.js — 489.3 kB\n  react-dom                       207.2 kB\n  react-router                     95.4 kB\n  zod                              77.4 kB\n  @tanstack/query-core             32.6 kB\n  react-hook-form                  29.8 kB\n  src/ (mã của app)                22.6 kB\n  react                             8.2 kB\n  scheduler                         3.5 kB\n  @tanstack/react-query             3.5 kB\n  @hookform/resolvers               3.3 kB\n  zustand                           2.5 kB\n  @tanstack/react-query-devtools    0.0 kB",
  bundleSau: "$ node do/phan-tich-bundle.mjs dist-map/assets/index-*.js dist-map/assets/form-*.js\nindex-C1QXkpWE.js — 230.5 kB\n  react-dom                       207.0 kB\n  src/ (mã của app)                11.1 kB\n  @tanstack/query-core              6.7 kB\nform-DYeHmiCh.js — 114.2 kB\n  zod                              77.3 kB\n  react-hook-form                  29.6 kB\n  @hookform/resolvers               3.3 kB",
  indexHtml: "$ cat dist/index.html\n<!doctype html>\n<html lang=\"vi\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Phòng khám An Tâm</title>\n    <script type=\"module\" crossorigin src=\"/assets/index-C1QXkpWE.js\"></script>\n    <link rel=\"modulepreload\" crossorigin href=\"/assets/jsx-runtime-Dk72oS4N.js\">\n    <link rel=\"modulepreload\" crossorigin href=\"/assets/useTieuDeTrang-BWWYORo8.js\">\n    <link rel=\"modulepreload\" crossorigin href=\"/assets/thoi-gian-DbPLFQS-.js\">\n    <link rel=\"stylesheet\" crossorigin href=\"/assets/index-zMLpDqyP.css\">\n  </head>\n  <body>\n    <div id=\"root\"></div>\n  </body>\n</html>",
  axeTruoc: "[trước khi sửa] axe-core 4.13.0 · Chromium 149.0.7827.55 · chuẩn WCAG 2.2 A + AA\n/              1 lỗi:\n   ✗ color-contrast (serious) × 2 — Elements must meet minimum color contrast ratio thresholds\n       vd: p:nth-child(1) — Element has insufficient color contrast of 4.34 (foreground color: #64748b, background color: #f1f5f9, font size: 10.5pt (14px), font weight: normal).\n/bac-si        1 lỗi:\n   ✗ color-contrast (serious) × 2 — Elements must meet minimum color contrast ratio thresholds\n       vd: p:nth-child(1) — Element has insufficient color contrast of 4.34 (foreground color: #64748b, background color: #f1f5f9, font size: 10.5pt (14px), font weight: normal).\n/bac-si/bs-2   1 lỗi:\n   ✗ color-contrast (serious) × 2 — Elements must meet minimum color contrast ratio thresholds\n       vd: p:nth-child(1) — Element has insufficient color contrast of 4.34 (foreground color: #64748b, background color: #f1f5f9, font size: 10.5pt (14px), font weight: normal).\n/dang-nhap     1 lỗi:\n   ✗ color-contrast (serious) × 2 — Elements must meet minimum color contrast ratio thresholds\n       vd: p:nth-child(1) — Element has insufficient color contrast of 4.34 (foreground color: #64748b, background color: #f1f5f9, font size: 10.5pt (14px), font weight: normal).\nTỔNG: 4 loại lỗi",
  axeSau: "[sau khi sửa] axe-core 4.13.0 · Chromium 149.0.7827.55 · chuẩn WCAG 2.2 A + AA\n/              0 lỗi\n/bac-si        0 lỗi\n/bac-si/bs-2   0 lỗi\n/dang-nhap     0 lỗi\nTỔNG: 0 loại lỗi",
  axeKhungXuong: "[axe] aria-prohibited-attr (serious) — Elements must only use permitted ARIA attributes\n      <div class=\"lua-chon\" aria-busy=\"true\" aria-label=\"Đang tải khung giờ\">\n      aria-label attribute cannot be used on a div with no valid role attribute.",
  a11yTruoc: "     × axe: /bac-si/bs-2 không có lỗi nào 46ms\n     × Tab đầu tiên tới link \"Bỏ qua, tới nội dung chính\", trỏ tới <main id=\"noi-dung\"> nhận được focus 71ms\n     × ngày khám: nhóm radio có tên, MỘT điểm dừng Tab, phím → đổi ngày (replace) 1013ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯\n FAIL  src/app/a11y.test.tsx > Chương 8 — khả năng tiếp cận > ngày khám: nhóm radio có tên, MỘT điểm dừng Tab, phím → đổi ngày (replace)\n      Tests  3 failed | 3 passed (6)",
  banPhimTruoc: "[trước] Tab từ đầu trang tới giờ khám đầu tiên: 11 lần\n    1. a \"Phòng khám An Tâm\"\n    2. a \"Trang chủ\"\n    3. a \"Bác sĩ\"\n    4. a \"Lịch hẹn của tôi\"\n    5. a \"Đăng nhập\"\n    6. a \"← Danh sách bác sĩ\"\n    7. button \"♡ Thêm vào yêu thích\"\n    8. button \"01/10/2026\"\n    9. button \"02/10/2026\"\n   10. button \"03/10/2026\"\n   11. a \"08:00 · 01/10/2026\"",
  banPhimSau: "[sau] Tab từ đầu trang tới giờ khám đầu tiên: 10 lần\n    1. a \"Bỏ qua, tới nội dung chính\"\n    2. a \"Phòng khám An Tâm\"\n    3. a \"Trang chủ\"\n    4. a \"Bác sĩ\"\n    5. a \"Lịch hẹn của tôi\"\n    6. a \"Đăng nhập\"\n    7. a \"← Danh sách bác sĩ\"\n    8. button \"♡ Thêm vào yêu thích\"\n    9. input \"radio 01/10/2026\"\n   10. a \"08:00 · 01/10/2026\"\n[sau] Tab → Enter (\"Bỏ qua\") ⇒ focus ở main#noi-dung \"← Danh sách bác sĩBS. Trần Thu HàNhi · 8\"; thêm 4 lần Tab nữa tới giờ khám: a \"← Danh sách bác sĩ\" → button \"♡ Thêm vào yêu thích\" → input \"radio 01/10/2026\" → a \"08:00 · 01/10/2026\"\n[sau] focus ngày 01/10 rồi bấm → : URL = ?ngay=2026-10-02 · đang chọn: 2026-10-02",
  cuoiTsc: "tsc -b: sạch (exit 0)",
  cuoiVitest: " Test Files  7 passed (7)\n      Tests  35 passed (35)",
  cuoiBuild: "dist/index.html                           0.71 kB │ gzip:   0.39 kB\ndist/assets/index-zMLpDqyP.css            6.98 kB │ gzip:   2.15 kB\ndist/assets/TrangDangNhap-CtF3UIWh.js     0.57 kB │ gzip:   0.41 kB\ndist/assets/TrangLichHen-l4Sg_xMz.js      0.60 kB │ gzip:   0.45 kB\ndist/assets/TrangDatLich-CYa8S4N1.js      1.79 kB │ gzip:   0.98 kB\ndist/assets/jsx-runtime-Dk72oS4N.js       8.77 kB │ gzip:   3.33 kB\ndist/assets/thoi-gian-DbPLFQS-.js        54.42 kB │ gzip:  18.17 kB\ndist/assets/useTieuDeTrang-BWWYORo8.js   81.06 kB │ gzip:  26.85 kB\ndist/assets/form-DYeHmiCh.js            114.18 kB │ gzip:  35.20 kB\ndist/assets/index-C1QXkpWE.js           230.47 kB │ gzip:  72.62 kB\ndist/assets/browser-ub9bx-xj.js         426.22 kB │ gzip: 160.56 kB\n✓ built in 142ms",
};

/* ─── Sơ đồ mermaid trong bài (≤ 10 nút, nhãn ngắn; khối EN nhãn tiếng Anh, khối VI nhãn tiếng Việt) ─── */
const L = (...dong) => MM(dong.join('\n'));
const SD = {
  /* 8.1 */
  vongDoVi: L(
    'flowchart TB',
    '  A["① Đo trên máy chậm"] --> B{"② Chậm hơn ngưỡng?"}',
    '  B -->|"không"| C["Dừng: đừng tối ưu"]',
    '  B -->|"có"| D["③ Tìm ai chạy lại, vì sao"]',
    '  D --> E["④ Sửa MỘT chỗ"]',
    '  E --> F["⑤ Đo lại, cùng phép đo"]',
    '  F --> B',
  ),
  vongDoEn: L(
    'flowchart TB',
    '  A["① Measure on a slow machine"] --> B{"② Slower than the budget?"}',
    '  B -->|"no"| C["Stop: do not optimise"]',
    '  B -->|"yes"| D["③ Find who re-renders, and why"]',
    '  D --> E["④ Change ONE thing"]',
    '  E --> F["⑤ Re-measure, same method"]',
    '  F --> B',
  ),
  bamTimVi: L(
    'sequenceDiagram',
    '  participant N as Người dùng',
    '  participant Z as Store Zustand',
    '  participant K as KhuBacSi',
    '  participant T as 200 TheBacSi',
    '  participant P as Profiler',
    '  N->>Z: bấm ♡ (doiYeuThich)',
    '  Z->>K: yeuThich đổi, render lại',
    '  K->>T: gọi lại cả 200 thẻ',
    '  T-->>K: 199 thẻ trả JSX y hệt',
    '  K->>P: commit xong, onRender(update)',
  ),
  bamTimEn: L(
    'sequenceDiagram',
    '  participant N as User',
    '  participant Z as Zustand store',
    '  participant K as KhuBacSi',
    '  participant T as 200 TheBacSi',
    '  participant P as Profiler',
    '  N->>Z: click ♡ (doiYeuThich)',
    '  Z->>K: yeuThich changed, re-render',
    '  K->>T: calls all 200 cards again',
    '  T-->>K: 199 cards return identical JSX',
    '  K->>P: commit done, onRender(update)',
  ),
  cayThuaVi: L(
    'flowchart TB',
    '  K["KhuBacSi ↻ giữ yeuThich"] --> D["DanhSachBacSi ↻"]',
    '  D --> T1["TheBacSi bs-1 ↻ ♡ thành ♥"]',
    '  D --> T2["TheBacSi bs-2 ↻ thừa"]',
    '  D --> T3["198 thẻ nữa ↻ thừa"]',
    '  classDef thua fill:#3a2a0a,stroke:#ffc233,color:#fff',
    '  class T2,T3 thua',
  ),
  cayThuaEn: L(
    'flowchart TB',
    '  K["KhuBacSi ↻ holds yeuThich"] --> D["DanhSachBacSi ↻"]',
    '  D --> T1["TheBacSi bs-1 ↻ ♡ becomes ♥"]',
    '  D --> T2["TheBacSi bs-2 ↻ wasted"]',
    '  D --> T3["198 more cards ↻ wasted"]',
    '  classDef thua fill:#3a2a0a,stroke:#ffc233,color:#fff',
    '  class T2,T3 thua',
  ),
  /* 8.2 */
  memoVi: L(
    'flowchart TB',
    '  A["Cha render lại"] --> B{"Con có memo?"}',
    '  B -->|"không"| R["Con render lại"]',
    '  B -->|"có"| C{"Mọi prop giống lần trước? (Object.is)"}',
    '  C -->|"có"| S["Bỏ qua cả cây con"]',
    '  C -->|"một prop khác"| R',
    '  classDef bo fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class S bo',
  ),
  memoEn: L(
    'flowchart TB',
    '  A["Parent re-renders"] --> B{"Is the child memo?"}',
    '  B -->|"no"| R["Child re-renders"]',
    '  B -->|"yes"| C{"Every prop same as last time? (Object.is)"}',
    '  C -->|"yes"| S["Skip the whole subtree"]',
    '  C -->|"one prop differs"| R',
    '  classDef bo fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class S bo',
  ),
  hamMoiVi: L(
    'sequenceDiagram',
    '  participant C as DanhSachThu (cha)',
    '  participant M as memo(TheThuong)',
    '  C->>C: render lần 1 tạo hàm doi (1)',
    '  C->>M: onDoi = doi (1)',
    '  C->>C: bấm ♡, render lần 2 tạo doi (2)',
    '  C->>M: onDoi = doi (2)',
    '  M->>M: Object.is(doi (1), doi (2)) là false',
    '  M-->>C: render lại, dù chữ trong hàm y hệt',
  ),
  hamMoiEn: L(
    'sequenceDiagram',
    '  participant C as DanhSachThu (parent)',
    '  participant M as memo(TheThuong)',
    '  C->>C: render 1 creates function doi (1)',
    '  C->>M: onDoi = doi (1)',
    '  C->>C: click ♡, render 2 creates doi (2)',
    '  C->>M: onDoi = doi (2)',
    '  M->>M: Object.is(doi (1), doi (2)) is false',
    '  M-->>C: re-renders, though the code is identical',
  ),
  chonCongCuVi: L(
    'flowchart TB',
    '  A{"Đã đo và thấy chậm?"} -->|"chưa"| X["Không làm gì"]',
    '  A -->|"rồi"| B{"Chậm vì đâu?"}',
    '  B -->|"con render thừa"| C["memo cho con"]',
    '  C --> D["Prop là hàm hoặc object? useCallback / useMemo"]',
    '  B -->|"một phép tính ≥ 1 ms"| E["useMemo"]',
    '  B -->|"hàng nghìn dòng"| F["virtualization (Ch13)"]',
    '  B -->|"tải trang"| G["chia bundle (8.3)"]',
  ),
  chonCongCuEn: L(
    'flowchart TB',
    '  A{"Measured and found slow?"} -->|"not yet"| X["Do nothing"]',
    '  A -->|"yes"| B{"Slow because of?"}',
    '  B -->|"child re-renders"| C["memo the child"]',
    '  C --> D["Function or object prop? useCallback / useMemo"]',
    '  B -->|"a computation ≥ 1 ms"| E["useMemo"]',
    '  B -->|"thousands of rows"| F["virtualization (Ch13)"]',
    '  B -->|"page load"| G["split the bundle (8.3)"]',
  ),
  /* 8.3 */
  bundleVi: L(
    'flowchart TB',
    '  A["Trước: index.js 489 kB, mọi thứ trong một file"] -->|"tách"| B["Sau: tải ngay ≈ 374 kB (index + 3 file chung)"]',
    '  B -.->|"khi vào /dat-lich"| D["TrangDatLich 1,8 kB"]',
    '  D --> F["form 114 kB: zod + RHF"]',
    '  B -.->|"khi vào /lich-hen"| L2["TrangLichHen 0,6 kB"]',
    '  B -.->|"khi vào /dang-nhap"| G["TrangDangNhap 0,6 kB"]',
  ),
  bundleEn: L(
    'flowchart TB',
    '  A["Before: index.js 489 kB, everything in one file"] -->|"split"| B["After: ≈ 374 kB up front (index + 3 shared files)"]',
    '  B -.->|"on /dat-lich"| D["TrangDatLich 1.8 kB"]',
    '  D --> F["form 114 kB: zod + RHF"]',
    '  B -.->|"on /lich-hen"| L2["TrangLichHen 0.6 kB"]',
    '  B -.->|"on /dang-nhap"| G["TrangDangNhap 0.6 kB"]',
  ),
  lazyRouteVi: L(
    'sequenceDiagram',
    '  participant N as Người dùng',
    '  participant R as Router',
    '  participant M as Máy chủ tĩnh',
    '  participant V as Màn hình',
    '  N->>R: bấm link 14:00',
    '  R->>V: navigation = loading, trang cũ vẫn hiện',
    '  R->>M: import() TrangDatLich-*.js',
    '  M-->>R: 1,8 kB JS',
    '  R->>V: vẽ TrangDatLich',
    '  R->>R: lúc này location mới đổi',
  ),
  lazyRouteEn: L(
    'sequenceDiagram',
    '  participant N as User',
    '  participant R as Router',
    '  participant M as Static server',
    '  participant V as Screen',
    '  N->>R: clicks the 14:00 link',
    '  R->>V: navigation = loading, old page stays',
    '  R->>M: import() TrangDatLich-*.js',
    '  M-->>R: 1.8 kB of JS',
    '  R->>V: renders TrangDatLich',
    '  R->>R: only now does location change',
  ),
  anhVi: L(
    'flowchart TB',
    '  A["img loading=lazy"] --> B{"Có width và height?"}',
    '  B -->|"có"| C["Giữ chỗ 96 × 96 ngay từ đầu"]',
    '  C --> D["Chỉ tải ảnh gần màn hình: 57 / 200"]',
    '  B -->|"không"| E["Ảnh chưa tải cao 0 px"]',
    '  E --> F["Nhiều ảnh lọt vùng gần màn hình: 111 / 200"]',
    '  E --> G["Ảnh về đẩy chữ xuống: CLS 0,348"]',
  ),
  anhEn: L(
    'flowchart TB',
    '  A["img loading=lazy"] --> B{"Has width and height?"}',
    '  B -->|"yes"| C["Reserves 96 × 96 from the start"]',
    '  C --> D["Loads only near-screen images: 57 / 200"]',
    '  B -->|"no"| E["Unloaded image is 0 px tall"]',
    '  E --> F["More images count as near: 111 / 200"]',
    '  E --> G["Arriving images push text: CLS 0.348"]',
  ),
  /* 8.4 */
  tabVi: L(
    'flowchart TB',
    '  A["Tab 1: Bỏ qua, tới nội dung chính"] -->|"Enter"| B["main#noi-dung nhận focus"]',
    '  A -->|"Tab"| H["5 link của header"]',
    '  H --> C',
    '  B -->|"Tab"| C["← Danh sách bác sĩ"]',
    '  C --> D["♡ Thêm vào yêu thích"]',
    '  D --> E["Nhóm ngày: MỘT điểm dừng"]',
    '  E -->|"← →"| E',
    '  E -->|"Tab"| F["Giờ khám đầu tiên còn trống"]',
    '  F -->|"Enter"| G["/dat-lich/…"]',
  ),
  tabEn: L(
    'flowchart TB',
    '  A["Tab 1: Skip to main content"] -->|"Enter"| B["main#noi-dung gets focus"]',
    '  A -->|"Tab"| H["5 header links"]',
    '  H --> C',
    '  B -->|"Tab"| C["← Doctor list"]',
    '  C --> D["♡ Add to favourites"]',
    '  D --> E["Day group: ONE tab stop"]',
    '  E -->|"← →"| E',
    '  E -->|"Tab"| F["First free time slot"]',
    '  F -->|"Enter"| G["/dat-lich/…"]',
  ),
  chonTheVi: L(
    'flowchart TB',
    '  A["Cần một điều khiển"] --> B{"HTML có thẻ làm đúng việc?"}',
    '  B -->|"có"| C["Dùng thẻ đó: button, a, input, select, fieldset"]',
    '  B -->|"không"| D["Tra mẫu trong ARIA APG"]',
    '  D --> E["role + trạng thái aria-*"]',
    '  E --> F["Tự làm bàn phím: Tab, ← →, Space, Enter"]',
    '  C --> G["Kiểm: axe + rút chuột thử Tab"]',
    '  F --> G',
  ),
  chonTheEn: L(
    'flowchart TB',
    '  A["You need a control"] --> B{"Does an HTML element do this?"}',
    '  B -->|"yes"| C["Use it: button, a, input, select, fieldset"]',
    '  B -->|"no"| D["Look up the pattern in the ARIA APG"]',
    '  D --> E["role + aria-* states"]',
    '  E --> F["Build keyboard yourself: Tab, ← →, Space, Enter"]',
    '  C --> G["Check: axe + unplug the mouse and Tab"]',
    '  F --> G',
  ),
  radioVi: L(
    'sequenceDiagram',
    '  participant N as Người dùng bàn phím',
    '  participant I as input radio 01/10',
    '  participant C as ChonKhungGio',
    '  participant R as Router',
    '  N->>I: Tab vào nhóm (một lần)',
    '  N->>I: bấm →',
    '  I->>C: trình duyệt chọn 02/10, onChange',
    '  C->>R: setSp ngay=2026-10-02, replace',
    '  R-->>C: render lại, giờ ngày 02/10',
  ),
  radioEn: L(
    'sequenceDiagram',
    '  participant N as Keyboard user',
    '  participant I as radio input 01/10',
    '  participant C as ChonKhungGio',
    '  participant R as Router',
    '  N->>I: Tab into the group (once)',
    '  N->>I: presses →',
    '  I->>C: browser selects 02/10, onChange',
    '  C->>R: setSp ngay=2026-10-02, replace',
    '  R-->>C: re-render with the 02/10 slots',
  ),
};

const L0 = {
    title: '8.0 — Chapter 8 slides: performance and accessibility in pictures|||8.0 — Slide Chương 8: hiệu năng và khả năng tiếp cận bằng hình',
    slug: 'rx-8-0-slides',
    type: 'DOCUMENT',
    isFreePreview: true,
    description: 'Cả Chương 8 trong 29 slide: vòng đo, Profiler, 200 bác sĩ giả, memo và React Compiler, tách bundle theo route, ảnh tải lười, HTML đúng nghĩa, bàn phím và axe.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Slides</span>
<h2>The whole chapter in 29 slides</h2>
<p class="lead">Seven chapters built a booking app that works. This one asks two harder questions: is it fast enough on a cheap phone, and can someone who never touches a mouse use it? Neither question is answered by opinion. You answer the first with a stopwatch (React's <code>&lt;Profiler&gt;</code>, a real Chromium slowed down four times) and the second with a keyboard and an automated checker (axe). Every slide is a measurement from the project, not a rule of thumb.</p>
<p>Slides 3–8 belong to Lesson 8.1 (the measure-first loop, the Profiler, 200 fake doctors, why a normal production build measures nothing), 9–15 to Lesson 8.2 (<code>memo</code>, functions and objects that break it, <code>useMemo</code> that is not worth it, React Compiler and the Babel 8 trap), 16–21 to Lesson 8.3 (what is inside a 489 kB bundle, lazy routes, the barrel file that pulled zod back in, what lazy routes change in tests, <code>React.lazy</code>, lazy images and layout shift), 22–26 to Lesson 8.4 (a div that axe calls perfect and a keyboard cannot use, native radios vs hand-made ARIA, what axe catches and misses, two real bugs axe found in the app, the keyboard path through the page). Slide 27 lists the chapter's common mistakes, 28 is the cheat sheet for the quiz, 29 is the checklist for the four project steps. Numbers were measured on 26 September 2026 with React 19.3.0, Vite 8.3.1, Vitest 5.0.2, axe-core 4.13.0 and Chromium 149 driven by Playwright. Two results worth a second look: one line of <code>memo</code> takes a click on a 1000-doctor list from 39.8 ms to 5.1 ms (slide 12), and a time picker built from <code>&lt;div onClick&gt;</code> gets <strong>zero</strong> axe errors while offering zero ways to choose a time with the keyboard (slide 22).</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Slide</span>
<h2>Cả chương trong 29 slide</h2>
<p class="lead">Bảy chương vừa qua dựng được một app đặt lịch chạy đúng. Chương này hỏi hai câu khó hơn: nó có đủ nhanh trên một chiếc điện thoại rẻ tiền không, và một người không bao giờ cầm chuột có dùng được nó không? Cả hai câu đều không trả lời bằng cảm giác. Câu đầu trả lời bằng đồng hồ bấm giờ (<code>&lt;Profiler&gt;</code> của React, một Chromium thật bị làm chậm bốn lần); câu sau trả lời bằng bàn phím và một máy kiểm tự động (axe). Slide nào cũng là một phép đo trên dự án, không phải một câu "nên làm thế này".</p>
<p>Slide 3–8 thuộc Bài 8.1 (vòng lặp đo trước, Profiler, 200 bác sĩ giả, vì sao bản build production thông thường không đo được gì), 9–15 thuộc Bài 8.2 (<code>memo</code>, hàm và object làm hỏng nó, <code>useMemo</code> không đáng dùng, React Compiler và cái bẫy Babel 8), 16–21 thuộc Bài 8.3 (bên trong một bundle 489 kB có gì, route tải lười, file barrel kéo zod về lại, route lười đổi gì trong test, <code>React.lazy</code>, ảnh tải lười và trang bị nhảy), 22–26 thuộc Bài 8.4 (một div mà axe khen hoàn hảo còn bàn phím thì chịu, radio có sẵn so với ARIA tự làm, axe bắt được gì và bỏ lọt gì, hai lỗi thật axe tìm ra trong app, đường đi bằng bàn phím qua trang). Slide 27 là các sai lầm hay gặp, 28 là bảng tra nhanh cho bài kiểm tra, 29 là danh sách bốn bước tự gõ tiếp dự án. Số liệu đo ngày 26/09/2026 bằng React 19.3.0, Vite 8.3.1, Vitest 5.0.2, axe-core 4.13.0 và Chromium 149 do Playwright điều khiển. Hai kết quả đáng nhìn hai lần: một dòng <code>memo</code> đưa một cú bấm trên danh sách 1000 bác sĩ từ 39,8 ms xuống 5,1 ms (slide 12), và một bộ chọn giờ làm bằng <code>&lt;div onClick&gt;</code> được axe chấm <strong>0 lỗi</strong> trong khi không có cách nào chọn giờ bằng bàn phím (slide 22).</p>
</div>
${gallery('rx-08', [[1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Tối ưu bắt đầu bằng đo'], [4, 'Profiler và onRender'], [5, 'Bấm ♡: 200 thẻ chạy lại'], [6, 'Build thường không đo'], [7, 'Máy chậm 4×: 10 ms và 40 ms'], [8, 'Đo trên /bac-si?nhieu=200'], [9, 'memo bỏ qua props y hệt'], [10, 'Hàm, object mới phá memo'], [11, 'useMemo cho bộ lọc: không đáng'], [12, 'memo(TheBacSi): 10,1 → 1,9 ms'], [13, 'Compiler qua Babel 8 bị bỏ qua'], [14, 'Compiler không memo tay'], [15, 'Chọn công cụ bằng số đo'], [16, 'Bundle 489 kB có gì'], [17, 'import() là điểm cắt'], [18, 'Barrel kéo zod về file đầu'], [19, 'Route lazy đổi hành vi test'], [20, 'React.lazy ở cấp module'], [21, 'Ảnh lazy và width/height'], [22, 'Ô giờ bằng div: axe 0 lỗi'], [23, 'HTML có sẵn trước ARIA'], [24, 'axe bắt ba, bỏ lọt hai'], [25, 'Hai lỗi axe tìm ra trong app'], [26, 'Bàn phím trong app'], [27, 'Sai lầm hay gặp'], [28, 'Bảng tra nhanh'], [29, 'Tự gõ tiếp dự án']])}
`,
};

const L1 = {
    title: '8.1 — Measuring with the React Profiler: 200 doctors, one click, real numbers|||8.1 — Đo bằng React Profiler: 200 bác sĩ, một cú bấm, số đo thật',
    slug: 'rx-8-1-do',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Đo trước khi tối ưu: sinh 200 bác sĩ giả, bọc KhuBacSi bằng Profiler, đếm component chạy lại, đo trong Chromium chậm 4× — và vì sao bản build production thông thường không đo được gì.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Measuring with the React Profiler: 200 doctors, one click, real numbers</h2>
<p class="lead">"React is slow, wrap everything in <code>useCallback</code>" is the most common performance advice you will hear, and the least useful. This lesson does the opposite: before changing a single line, you measure. By the end you will know exactly how many components run when a patient taps ♡ on one doctor in a list of 200, how many milliseconds that costs on a machine four times slower than yours, and — the part people skip — whether that number is actually a problem.</p>

<p>Everything below runs on the clinic app you finished in Chapter 7 (React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2 with jsdom 29.1.1, React Router 8.4.0, TanStack Query 5.103.3, Zustand 5.0.15, MSW 2.15.0). Timings in a real browser come from Chromium 149 driven by Playwright, with the CPU slowed down 4× through the Chrome DevTools Protocol. Every grey box is real output from 26 September 2026. Where a number comes from jsdom (the fake browser Vitest uses) and where it comes from Chromium matters, and the lesson says which each time.</p>

<h3>Measure first, then change one thing</h3>
${slide('rx-08', 3, 'Optimisation starts with MEASURING, not with memo')}
<p>Performance work is a loop, and the loop starts with a number, not with a fix:</p>
${SD.vongDoEn}
<p>Step ② is the one juniors skip. A number only means something next to a <strong>budget</strong>. The budgets that matter for clicks and typing are about human perception:</p>
<ul>
<li><strong>16.7 ms</strong> — one frame at 60 Hz. Work longer than that during an animation drops frames.</li>
<li><strong>200 ms</strong> — Google's threshold for a "good" <em>Interaction to Next Paint</em> (INP): the time from a click or key press until the screen shows the result. Above <strong>500 ms</strong> is "poor". INP replaced First Input Delay as a Core Web Vital in March 2024 (checked 09/2026).</li>
</ul>
<p>If a click already feels instant on a slow phone, making it "faster" is time you are not spending on features — and every <code>memo</code> you add is code a colleague must read and keep correct. So the loop has an exit: <em>not slow ⇒ stop</em>.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202, "the app is slow" usually leads to guessing: add <code>console.log</code> in <code>render()</code>, maybe <code>shouldComponentUpdate</code> or <code>PureComponent</code> in a class component because a slide said so. → At work, someone asks "slow how, measured where?" You attach a Profiler recording or a Performance trace from a throttled device to the ticket, fix one thing, and attach the second recording. · <em>Why:</em> a review cannot argue with two numbers. The FER202 habits are not wrong — <code>PureComponent</code> is the class ancestor of today's <code>memo</code> — they are just applied without evidence. You will still meet <code>shouldComponentUpdate</code> in older codebases.</p></div>

<h3>Preparation: 200 fake doctors, the same 200 every time</h3>
${slide('rx-08', 8, 'Measure on the real screen: /bac-si?nhieu=200')}
<p>The clinic has six doctors. Six cards render in well under a millisecond; there is nothing to measure. Real apps list hundreds of products, messages, appointment slots — so we create a realistic load. The generator must be <strong>deterministic</strong> (no <code>Math.random()</code>): when you run the measurement again after a fix, it has to be the same list, otherwise you are comparing two different experiments.</p>
${pre('ts', SN.baiSiGia)}
<div class="callout"><p><strong>JS quick reminder — <code>Array.from({ length: n }, fn)</code> and <code>%</code>.</strong> <code>Array.from({ length: 3 }, (_, i) =&gt; i * 2)</code> builds <code>[0, 2, 4]</code>: an array of length <code>n</code> where each element is whatever <code>fn</code> returns for index <code>i</code> (the <code>_</code> is the unused "current value"). <code>a % b</code> is the remainder, so <code>HO[i % HO.length]</code> cycles through the family names forever without going out of bounds. The <code>(&#36;{so})</code> at the end of the name keeps fake names unique — the first run without it produced five buttons all named "Yêu thích BS. Nguyễn Minh An" and Playwright refused to guess which one to click.</p></div>
<p>The fake server (MSW, Chapter 6) takes the size of its "database" as a parameter, and reads <code>?nhieu=200</code> from the page URL in the browser:</p>
${pre('ts', SN.datLai)}
${pre('ts', SN.dieuKhien)}
<p>So <code>http://localhost:5173/bac-si?nhieu=200</code> shows 6 real doctors plus 194 fake ones, and a test gets the same list with <code>datLaiDuLieu(200)</code>. The <code>Math.min(1000, …)</code> is a guard: a URL is something anyone can type.</p>

<h3><code>&lt;Profiler&gt;</code>: a component that times components</h3>
${slide('rx-08', 4, 'Profiler calls onRender after EVERY commit of its subtree')}
<p>React ships a built-in stopwatch: wrap any part of the tree in <code>&lt;Profiler id="…" onRender={fn}&gt;</code> and React calls <code>fn</code> every time that part <strong>commits</strong> (Chapter 11 explains render vs commit; for now: "every time it finishes updating the screen"). The project gets a small wrapper so the numbers can be read by tests and by Playwright:</p>
${pre('tsx', SN.doRender)}
<p>What <code>onRender</code> receives (from <code>@types/react</code> 19.3, matching react.dev):</p>
<table>
<thead><tr><th>Argument</th><th>Meaning</th><th>How to use it</th></tr></thead>
<tbody>
<tr><td><code>id</code></td><td>the <code>id</code> prop of that Profiler</td><td>tell several Profilers apart</td></tr>
<tr><td><code>phase</code></td><td><code>"mount"</code> (first time), <code>"update"</code>, or <code>"nested-update"</code> (an update triggered during the commit itself, e.g. by <code>useLayoutEffect</code>)</td><td>ignore mounts when measuring clicks</td></tr>
<tr><td><code>actualDuration</code></td><td>milliseconds React actually spent rendering this subtree in this commit</td><td><strong>the number you optimise</strong></td></tr>
<tr><td><code>baseDuration</code></td><td>estimated milliseconds to re-render the whole subtree with no skipping</td><td>compare: <code>actual</code> much lower ⇒ memoisation is working</td></tr>
<tr><td><code>startTime</code>, <code>commitTime</code></td><td>timestamps of this update</td><td>line several Profilers up on one timeline</td></tr>
</tbody></table>
<p>Then wrap the doctor list page — the only change in app code:</p>
${pre('tsx', SN.trangDanhSach)}
<p>A <code>&lt;Profiler&gt;</code> left in production code costs almost nothing, because — as you will measure below — a normal production build does not call <code>onRender</code> at all.</p>

<h3>The second instrument: who ran, how many times</h3>
<p>The Profiler tells you <em>how long</em>. It does not tell you <em>which</em> components ran. For that, a tiny counter that only exists in development and tests:</p>
${pre('ts', SN.demRender)}
<p>Call <code>useDemRender('TheBacSi')</code> on the first line of <code>TheBacSi</code>. Writing to an outside variable during render breaks the purity rule from Lesson 2.1 — acceptable here only because the counter <em>observes</em> and never feeds back into what the component draws. <code>import.meta.env.DEV</code> is <code>true</code> in <code>vite dev</code> and in Vitest, and <code>false</code> in <code>vite build</code>; the bundler sees <code>if (false)</code> and deletes the line from production.</p>
<div class="pitfall co-tieu-de"><strong>Trap — counting in the browser under StrictMode.</strong> <code>main.tsx</code> renders inside <code>&lt;StrictMode&gt;</code>, which calls every component body <em>twice</em> in development (Lesson 11.3). Read the counter in the dev browser and you get 400 for 200 cards and conclude something is badly wrong. The tests here render without StrictMode, so their counts are exact; in the browser, divide by two or measure a production-profiling build.</div>

<h3>First measurement, in Vitest: 200 cards run for one heart</h3>
${slide('rx-08', 5, 'Click ♡ on one card: 200 cards run again, only one actually changes')}
<p>The experiment: open <code>/bac-si</code> with 200 doctors, reset both instruments, click ♡ on BS. Nguyễn Minh An, read the numbers. Then type "huy" into the search box one key at a time.</p>
${pre('tsx', SN.bai1Test)}
${out(OUT.bai1Truoc)}
<p>(The log is in Vietnamese: "số lần commit" = number of commits, "TheBacSi chạy: 200 lần" = TheBacSi ran 200 times, "thẻ thật sự đổi" = cards that actually changed, "thẻ trên màn hình" = cards on screen.) Read it slowly:</p>
<ol>
<li><strong>One click, one commit, 200 card renders.</strong> Exactly one card changes (♡ becomes ♥), yet all 200 <code>TheBacSi</code> functions run. Here is why, step by step:</li>
</ol>
${SD.bamTimEn}
<p><code>KhuBacSi</code> subscribes to the favourites array in the Zustand store. Clicking ♡ replaces that array, so <code>KhuBacSi</code> re-renders; by default React re-renders <strong>every child</strong> of a component that re-renders — it does not look at props first. In tree form:</p>
${SD.cayThuaEn}
<ol start="2">
<li><strong>Typing re-renders every visible card.</strong> Each key press updates <code>?q=</code> in the URL (Lesson 7.1), <code>KhuBacSi</code> re-filters, and every card still on screen runs again: 162 after "h", 50 after "u", 17 after "y". Cards that disappear are unmounted, which is a different cost.</li>
<li><strong>The Profiler rows.</strong> The first <code>mount</code> is only the skeleton (the list is still loading — 1.2 ms). The first <code>update</code> is the data arriving and 200 cards mounting (34.7 ms in jsdom). The second <code>update</code> is the click: 16.5 ms, and <code>actualDuration ≈ baseDuration</code> — React skipped nothing.</li>
</ol>
<p>So is 16.5 ms slow? <strong>You cannot tell from jsdom.</strong> jsdom is a JavaScript imitation of a browser running inside Node: no layout, no painting, a different JavaScript engine setup. Its counts are exact (200 is 200 everywhere); its milliseconds are not the milliseconds your users feel.</p>

<h3>Real milliseconds: Chromium, CPU slowed down 4×</h3>
${slide('rx-08', 6, 'A normal build does not measure: build with --mode profiling')}
<p>The script <code>do/do-chromium.mjs</code> builds the app, serves it with <code>vite preview</code>, opens <code>/bac-si?nhieu=200</code> in Chromium, slows the CPU down 4× (the same factor Lighthouse uses to imitate a mid-range phone), clicks ♡ seven times and reads two things: <code>window.__nhatKyDo</code> from our Profiler, and the browser's own <strong>Event Timing API</strong>, which reports how long each click took until the next paint — the raw material of INP:</p>
${pre('js', SN.eventTiming)}
<p>The first run used the normal <code>npx vite build</code>. The Profiler recorded <strong>nothing</strong>:</p>
${out(OUT.chromiumTruoc)}
<p>The <code>[production]</code> line says <code>commit/lần = 0,0,0,0,0,0,0</code>: seven clicks, zero calls to <code>onRender</code>. This is by design — react.dev: profiling "adds some additional overhead, so it is disabled in the production build by default". To measure a production-like build you opt in to React's profiling build of <code>react-dom</code>. With Vite that is one alias, active only in a mode you choose:</p>
${pre('ts', SN.viteConfig)}
<p><code>npx vite build --mode profiling</code> then swaps <code>react-dom/client</code> for <code>react-dom/profiling</code> (it ships in the <code>react-dom</code> package; check <code>node_modules/react-dom/package.json</code> → <code>"./profiling"</code>). Why not measure in <code>vite dev</code>? Development React runs extra checks and StrictMode double renders; its timings are several times slower than production and would exaggerate every problem.</p>
<div class="pitfall co-tieu-de"><strong>Trap — "the Profiler says 0 ms, so it is fast".</strong> On a normal production build <code>onRender</code> is never called, so an array you log stays empty and averages come out as 0 or <code>NaN</code>. The first line of the output above is exactly that. Always check the <em>number of commits</em> recorded before trusting a duration.</div>
${slide('rx-08', 7, 'On a 4× slower CPU: 200 cards cost 10 ms, 1000 cards cost 40 ms')}
<p>Now the profiling build tells the truth. On a CPU slowed down 4×:</p>
<ul>
<li><strong>200 doctors:</strong> a click costs <code>actualDuration</code> 10.1 ms (median of 7); the whole interaction, measured by the browser, 24 ms. At 6× slowdown: 15.4 ms and 40 ms.</li>
<li><strong>1000 doctors:</strong> 39.8 ms of rendering per click, 88 ms for the interaction. Typing the first letter of a search: 40.6 ms.</li>
</ul>
<p>(Event Timing only reports interactions of at least 16 ms and rounds to 8 ms, so "0.0" in the log means "under 16 ms".)</p>

<h3>React DevTools Profiler: the same answer, with a picture</h3>
<p>Everything above can also be seen in the browser extension <strong>React Developer Tools</strong> (Chrome, Firefox, Edge). In the <em>Profiler</em> tab: press record, click ♡, stop. The <em>flame graph</em> shows every component of that commit as a bar whose width is its render time; components that did not render are grey. In the ⚙ settings, "<em>Record why each component rendered while profiling</em>" adds a line such as "The parent component rendered" to each bar — exactly the reason the 199 wasted cards ran. "<em>Highlight updates when components render</em>" flashes a border around everything that re-renders while you use the page.</p>
<p>⏳ Not run for real here: the React DevTools extension cannot be driven on the machine that built this lesson, so there is no screenshot. On your own machine: install React Developer Tools, open <code>npm run dev</code> at <code>/bac-si?nhieu=200</code>, record one click on ♡, and check that the flame graph shows 200 <code>TheBacSi</code> bars with the reason "The parent component rendered".</p>
<!-- CHAY-O-MAY: chụp ảnh tab Profiler của React DevTools khi bấm ♡ trên /bac-si?nhieu=200 (flame graph 200 TheBacSi + lý do "The parent component rendered") -->

<h3>Reading the numbers: is it time to optimise?</h3>
<p>Put the measurement next to the budget from the first section:</p>
<table>
<thead><tr><th>Scenario (Chromium, CPU 4×)</th><th>Render per click</th><th>Interaction</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td>200 doctors, click ♡</td><td>10.1 ms</td><td>24 ms</td><td>far under 200 ms — <strong>not a problem today</strong></td></tr>
<tr><td>1000 doctors, click ♡</td><td>39.8 ms</td><td>88 ms</td><td>still "good", but two frames of work for one heart, and a real cheap phone is slower than this emulation</td></tr>
<tr><td>1000 doctors, type a letter</td><td>40.6 ms</td><td>24 ms</td><td>mostly unmounting hundreds of cards</td></tr>
</tbody></table>
<p>The honest conclusion: with 200 doctors this app is fine. What the measurement <em>does</em> show is waste with a clear shape — 199 of 200 renders produce identical output — and that waste grows linearly with the list. That is the kind of problem <code>memo</code> is designed for, and the next lesson fixes it and measures again. Without this lesson you would have wrapped <code>useCallback</code> around random handlers and never known whether anything changed.</p>

<h3>When to measure — and when not to bother</h3>
<ul>
<li><strong>Measure</strong> when someone reports lag, when a list or table grows past a few hundred rows, when a page has an animation or drag-and-drop, before and after every performance change, and in interviews ("how would you find out?").</li>
<li><strong>Do not</strong> start a feature by optimising, and do not trust a feeling on your fast laptop: turn on CPU throttling (DevTools → Performance → CPU: 4× slowdown) before you conclude anything.</li>
<li><strong>Measure the right build:</strong> counts in dev/tests, durations in a profiling build, user experience with the browser's Event Timing / INP.</li>
</ul>

<div class="callout"><p><strong>Common interview question.</strong> "A React page feels slow. Where do you start?"</p>
<p>I first reproduce it on a slow profile — CPU throttling in DevTools — and measure instead of guessing: React DevTools Profiler to see which commits are expensive and which components re-render and why, the Performance panel or INP to see if the time is in React at all or in layout, network, a big bundle. Then I compare against a budget such as 200 ms INP. Only if it is over budget do I change one thing — often <code>memo</code> on an expensive child with stable props, or moving state down so fewer components re-render — and measure again with the same method. I mention that <code>&lt;Profiler&gt;</code> and DevTools timings need a development or profiling build, because production React disables profiling.</p></div>

<h3>🛠 Keep building the project — step 1/4: measuring instruments</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after Chapter 7 (<code>src/app/router.tsx</code>, <code>src/features/bac-si/…</code>, <code>src/mocks/co-so-du-lieu.ts</code>, <code>src/mocks/dieu-khien.ts</code>, <code>src/pages/TrangDanhSachBacSi.tsx</code>, <code>src/test/render.tsx</code>). Run <code>npx tsc -b</code> after each step.</p><ol>
<li><code>src/mocks/bac-si-gia.ts</code>: <code>taoBacSiGia(soLuong, soDau = 7)</code>, deterministic, unique names.</li>
<li><code>src/mocks/co-so-du-lieu.ts</code>: <code>datLaiDuLieu(soBacSi = 6)</code> adds fake doctors after the six real ones; call it at load time with <code>dieuKhien.soBacSi</code>. <code>src/mocks/dieu-khien.ts</code>: read <code>?nhieu=</code>, capped at 1000.</li>
<li><code>src/shared/dev/DoRender.tsx</code> (Profiler + <code>nhatKyDo</code>, exposed as <code>window.__nhatKyDo</code>) and <code>src/shared/dev/dem-render.ts</code> (<code>demRender</code>, <code>useDemRender</code>).</li>
<li>Wrap <code>&lt;KhuBacSi /&gt;</code> in <code>&lt;DoRender id="KhuBacSi"&gt;</code> inside <code>TrangDanhSachBacSi</code>; call <code>useDemRender('TheBacSi')</code> at the top of <code>TheBacSi</code>.</li>
<li><code>vite.config.ts</code>: the profiling alias.</li>
</ol>
<p><strong>Done when</strong> — create <code>src/features/bac-si/KhuBacSi.hieu-nang.test.tsx</code> with this content and the first test is green (the two "8.2" tests stay red until Lesson 8.2 — that is expected); <code>npx vite build --mode profiling</code> succeeds; and in Chromium at <code>/bac-si?nhieu=200</code>, <code>window.__nhatKyDo</code> in the console gets one new entry per click on ♡.</p></div>
${pre('tsx', SN.tieuChi81)}
${out(OUT.tieuChi82Truoc)}
<details><summary>Solution</summary>
<p>Run on the chapter project on 26/09/2026: <code>npx tsc -b</code> prints nothing, the 8.1 test is green, the two 8.2 tests fail with <code>expected 200 to be 1</code> and <code>expected 229 to be +0</code> (162 + 50 + 17 card renders while typing) until you add <code>memo</code>.</p>
<p>Every file of the solution is already printed in full above, exactly as it ran — apply them in this order:</p>
<ol>
<li><strong>src/mocks/bac-si-gia.ts</strong> — the block under "Preparation: 200 fake doctors".</li>
<li><strong>src/mocks/co-so-du-lieu.ts</strong> — replace <code>datLaiDuLieu</code> with the version in the same section and add <code>import { taoBacSiGia } from './bac-si-gia'</code> and <code>import { dieuKhien } from './dieu-khien'</code> at the top; <strong>src/mocks/dieu-khien.ts</strong> — add the <code>soBacSi</code> line to the object.</li>
<li><strong>src/shared/dev/DoRender.tsx</strong> — the block under "&lt;Profiler&gt;: a component that times components"; <strong>src/shared/dev/dem-render.ts</strong> — the block under "The second instrument".</li>
<li><strong>src/pages/TrangDanhSachBacSi.tsx</strong> — the wrapped page; in <code>TheBacSi.tsx</code> add <code>import { useDemRender } from '@/shared/dev/dem-render'</code> and <code>useDemRender('TheBacSi');</code> as the first line of the component.</li>
<li><strong>vite.config.ts</strong> — the block under "Real milliseconds".</li>
</ol>
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> measure one more interaction, the way this lesson did.</p><ol>
<li>Copy <code>src/vi-du/bai1.test.tsx</code> from this lesson. Add a test that clicks the specialty chip "Nhi" with 200 doctors, and logs commits, <code>TheBacSi</code> renders and the number of cards on screen.</li>
<li>Run <code>npx vitest run src/vi-du/bai1.test.tsx --reporter=verbose</code> and write down the three numbers.</li>
<li>Build with <code>npx vite build --mode profiling</code>, run <code>npx vite preview</code>, open <code>/bac-si?nhieu=1000</code>, turn on DevTools → Performance → CPU 4× slowdown, and in the console run <code>__nhatKyDo.length = 0</code>, click ♡ once, then <code>__nhatKyDo</code>.</li>
</ol><p><strong>Done when:</strong> step 2 prints exactly 1 commit, and the number of <code>TheBacSi</code> renders equals the number of pediatric doctors on screen (51 — the generator gives every fourth fake doctor <code>nhi</code>, 49 of them, plus the two real ones; measured: <code>commit: 1 | TheBacSi chạy: 51 | thẻ: 51</code>); step 3 shows one entry with <code>phase: "update"</code> and an <code>actualDuration</code> in the tens of milliseconds; on a normal <code>npx vite build</code> the same steps leave the array empty.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Profiler (<code>&lt;Profiler&gt;</code>)</span><span class="v">built-in React component that calls <code>onRender</code> after each commit of its subtree, with timings</span></div>
<div class="kv"><span class="k">actualDuration / baseDuration</span><span class="v">time actually spent in this commit / estimated time with no skipping; far apart ⇒ memo works</span></div>
<div class="kv"><span class="k">profiling build</span><span class="v"><code>react-dom/profiling</code>: production-speed React with measuring switched on</span></div>
<div class="kv"><span class="k">INP (Interaction to Next Paint)</span><span class="v">time from click/key to the next frame; good ≤ 200 ms, poor &gt; 500 ms</span></div>
<div class="kv"><span class="k">Event Timing API</span><span class="v">browser API (<code>PerformanceObserver</code> type <code>event</code>) that reports interaction durations</span></div>
<div class="kv"><span class="k">CPU throttling</span><span class="v">DevTools/CDP slows the CPU (4×, 6×) to imitate a weaker phone</span></div>
<div class="kv"><span class="k">wasted render (render thừa)</span><span class="v">a component that runs but returns exactly the same output as before</span></div>
<div class="kv"><span class="k">flame graph</span><span class="v">React DevTools view: one bar per component in a commit, width = render time</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Performance work is a loop: measure → compare with a budget → change one thing → measure again with the same method.</li>
<li><code>&lt;Profiler onRender&gt;</code> times a subtree; a render counter tells you who ran. Counts from jsdom are exact, durations are not.</li>
<li>Measured: one ♡ on 200 doctors ⇒ 1 commit, 200 <code>TheBacSi</code> renders, 1 card actually changed.</li>
<li>A normal production build never calls <code>onRender</code> (0 commits recorded); build with <code>--mode profiling</code> to measure production-like speed.</li>
<li>Chromium, CPU 4×: 10.1 ms per click for 200 doctors (fine), 39.8 ms for 1000; interaction 24 ms and 88 ms.</li>
<li>The waste has a clear shape — 199 identical renders — which is what <code>memo</code> is for (Lesson 8.2).</li>
</ul>

${LINK('https://react.dev/reference/react/Profiler', '📄', 'react.dev — &lt;Profiler&gt;', 'onRender arguments, profiling in production builds.')}
${LINK('https://react.dev/learn/react-developer-tools', '🧰', 'react.dev — React Developer Tools', 'Installing the extension; Components and Profiler tabs.')}
${LINK('https://web.dev/articles/inp', '📏', 'web.dev — Interaction to Next Paint (INP)', 'What INP measures and the 200 / 500 ms thresholds.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming', '📄', 'MDN — PerformanceEventTiming', 'The Event Timing API used by the Chromium script.')}
${LINK('https://developer.chrome.com/docs/devtools/performance', '🛠', 'Chrome DevTools — Performance panel', 'Recording, CPU throttling, reading a trace.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Đo bằng React Profiler: 200 bác sĩ, một cú bấm, số đo thật</h2>
<p class="lead">"React chậm, bọc hết bằng <code>useCallback</code> đi" là lời khuyên hiệu năng bạn sẽ nghe nhiều nhất, và cũng vô dụng nhất. Bài này làm ngược lại: trước khi sửa một dòng nào, ta <strong>đo</strong>. Hết bài, bạn biết chính xác có bao nhiêu component chạy lại khi bệnh nhân bấm ♡ một bác sĩ trong danh sách 200 người, việc đó tốn bao nhiêu mili-giây trên một máy chậm hơn máy bạn bốn lần, và — phần mọi người hay bỏ qua — con số đó có thật sự là vấn đề hay không.</p>

<p>Mọi thứ bên dưới chạy trên app phòng khám bạn làm xong ở Chương 7 (React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2 với jsdom 29.1.1, React Router 8.4.0, TanStack Query 5.103.3, Zustand 5.0.15, MSW 2.15.0). Số đo trong trình duyệt thật lấy từ Chromium 149 do Playwright điều khiển, CPU bị làm chậm 4× qua Chrome DevTools Protocol. Mọi khung xám là output THẬT ngày 26/09/2026. Con số lấy từ jsdom (trình duyệt giả mà Vitest dùng) hay từ Chromium là chuyện quan trọng, và bài sẽ nói rõ mỗi lần.</p>

<h3>Đo trước, rồi mới sửa đúng một chỗ</h3>
${slide('rx-08', 3, 'Tối ưu bắt đầu bằng ĐO, không bắt đầu bằng memo')}
<p>Tối ưu hiệu năng là một vòng lặp, và vòng lặp đó bắt đầu bằng một con số, không bắt đầu bằng một cách sửa:</p>
${SD.vongDoVi}
<p>Bước ② là bước người mới hay bỏ. Một con số chỉ có nghĩa khi đặt cạnh một <strong>ngưỡng</strong> (budget — "ngân sách" thời gian). Với cú bấm và gõ phím, các ngưỡng quan trọng đến từ cảm nhận của con người:</p>
<ul>
<li><strong>16,7 ms</strong> — một khung hình ở 60 Hz. Việc nào dài hơn thế trong lúc có hoạt ảnh là rớt khung hình, thấy giật.</li>
<li><strong>200 ms</strong> — ngưỡng "tốt" của Google cho <em>Interaction to Next Paint</em> (INP — thời gian từ lúc bấm/gõ tới lúc màn hình hiện kết quả). Trên <strong>500 ms</strong> là "kém". INP thay First Input Delay trong bộ Core Web Vitals từ tháng 3/2024 (kiểm 09/2026).</li>
</ul>
<p>Nếu một cú bấm đã có cảm giác tức thì trên điện thoại chậm, làm nó "nhanh hơn" là thời gian bạn không dành cho tính năng — và mỗi <code>memo</code> thêm vào là thêm code đồng nghiệp phải đọc và giữ cho đúng. Nên vòng lặp có lối ra: <em>không chậm ⇒ dừng</em>.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202, "app chạy chậm" thường dẫn tới đoán: thêm <code>console.log</code> trong <code>render()</code>, có khi thêm <code>shouldComponentUpdate</code> hay <code>PureComponent</code> vào class component vì slide có nói. → Đi làm, người ta hỏi ngay "chậm thế nào, đo ở đâu?". Bạn đính kèm vào ticket một bản ghi Profiler hoặc một trace Performance trên thiết bị bị làm chậm, sửa một chỗ, rồi đính kèm bản ghi thứ hai. · <em>Vì sao:</em> người review không cãi được hai con số. Thói quen ở FER202 không sai — <code>PureComponent</code> chính là "tổ tiên" dạng class của <code>memo</code> hôm nay — chỉ là dùng khi chưa có bằng chứng. Bạn vẫn sẽ gặp <code>shouldComponentUpdate</code> trong các dự án cũ.</p></div>

<h3>Chuẩn bị: 200 bác sĩ giả, lần nào cũng đúng 200 người đó</h3>
${slide('rx-08', 8, 'Đo trên đúng màn hình người dùng dùng: /bac-si?nhieu=200')}
<p>Phòng khám có sáu bác sĩ. Sáu thẻ render mất chưa tới một mili-giây; không có gì để đo. App thật hiển thị hàng trăm sản phẩm, tin nhắn, khung giờ — nên ta tạo tải giống thật. Hàm sinh phải <strong>tất định</strong> (deterministic — cùng đầu vào luôn ra cùng kết quả, không <code>Math.random()</code>): sửa xong đo lại mà danh sách khác đi thì bạn đang so hai thí nghiệm khác nhau.</p>
${pre('ts', SN.baiSiGia)}
<div class="callout"><p><strong>JS nhắc nhanh — <code>Array.from({ length: n }, fn)</code> và <code>%</code>.</strong> <code>Array.from({ length: 3 }, (_, i) =&gt; i * 2)</code> tạo <code>[0, 2, 4]</code>: một mảng dài <code>n</code>, phần tử thứ <code>i</code> là thứ <code>fn</code> trả về (dấu <code>_</code> là "giá trị hiện tại" không dùng tới). <code>a % b</code> là phép lấy dư, nên <code>HO[i % HO.length]</code> đi vòng qua danh sách họ mãi mà không vượt chỉ số. Cái <code>(&#36;{so})</code> ở cuối tên giữ cho tên giả không trùng — lần chạy đầu không có nó, trang có năm nút cùng tên "Yêu thích BS. Nguyễn Minh An" và Playwright từ chối đoán nên bấm nút nào.</p></div>
<p>Máy chủ giả (MSW, Chương 6) nhận kích thước "cơ sở dữ liệu" làm tham số, và trên trình duyệt thì đọc <code>?nhieu=200</code> từ URL của trang:</p>
${pre('ts', SN.datLai)}
${pre('ts', SN.dieuKhien)}
<p>Vậy <code>http://localhost:5173/bac-si?nhieu=200</code> hiện 6 bác sĩ thật cộng 194 người giả, còn test có đúng danh sách đó bằng <code>datLaiDuLieu(200)</code>. <code>Math.min(1000, …)</code> là cái chặn: URL là thứ ai cũng gõ tay được.</p>

<h3><code>&lt;Profiler&gt;</code>: một component đo giờ cho các component</h3>
${slide('rx-08', 4, 'Profiler gọi onRender sau MỖI lần commit của cây con')}
<p>React có sẵn một đồng hồ bấm giờ: bọc bất kỳ phần nào của cây bằng <code>&lt;Profiler id="…" onRender={fn}&gt;</code>, và React gọi <code>fn</code> mỗi lần phần đó <strong>commit</strong> (Chương 11 giải thích render khác commit thế nào; tạm hiểu: "mỗi lần cập nhật xong lên màn hình"). Dự án có một lớp bọc nhỏ để test và Playwright đọc được số:</p>
${pre('tsx', SN.doRender)}
<p><code>onRender</code> nhận gì (theo <code>@types/react</code> 19.3, khớp react.dev):</p>
<table>
<thead><tr><th>Tham số</th><th>Nghĩa</th><th>Dùng để làm gì</th></tr></thead>
<tbody>
<tr><td><code>id</code></td><td>prop <code>id</code> của Profiler đó</td><td>phân biệt nhiều Profiler</td></tr>
<tr><td><code>phase</code></td><td><code>"mount"</code> (lần đầu), <code>"update"</code>, hoặc <code>"nested-update"</code> (cập nhật sinh ra ngay trong lúc commit, ví dụ bởi <code>useLayoutEffect</code>)</td><td>bỏ qua mount khi đo cú bấm</td></tr>
<tr><td><code>actualDuration</code></td><td>số mili-giây React THẬT SỰ bỏ ra để render cây con trong lần commit này</td><td><strong>con số cần tối ưu</strong></td></tr>
<tr><td><code>baseDuration</code></td><td>ước tính số mili-giây nếu render lại CẢ cây con, không bỏ qua gì</td><td>so sánh: <code>actual</code> thấp hơn nhiều ⇒ memo đang có tác dụng</td></tr>
<tr><td><code>startTime</code>, <code>commitTime</code></td><td>mốc thời gian của lần cập nhật</td><td>xếp nhiều Profiler lên một dòng thời gian</td></tr>
</tbody></table>
<p>Rồi bọc trang danh sách bác sĩ — thay đổi duy nhất trong mã app:</p>
${pre('tsx', SN.trangDanhSach)}
<p>Để <code>&lt;Profiler&gt;</code> nằm lại trong code production gần như không tốn gì, vì — như bạn sẽ đo ở dưới — bản build production thông thường không gọi <code>onRender</code> lần nào.</p>

<h3>Dụng cụ thứ hai: ai đã chạy, chạy mấy lần</h3>
<p>Profiler nói <em>tốn bao lâu</em>. Nó không nói <em>component nào</em> đã chạy. Để biết điều đó, dùng một bộ đếm nhỏ chỉ tồn tại khi dev và khi test:</p>
${pre('ts', SN.demRender)}
<p>Gọi <code>useDemRender('TheBacSi')</code> ở dòng đầu của <code>TheBacSi</code>. Ghi vào một biến bên ngoài trong lúc render là phạm luật "thuần khiết" của Bài 2.1 — chấp nhận được ở đây chỉ vì bộ đếm <em>quan sát</em>, không bao giờ ảnh hưởng tới thứ component vẽ ra. <code>import.meta.env.DEV</code> là <code>true</code> khi <code>vite dev</code> và trong Vitest, là <code>false</code> khi <code>vite build</code>; bundler thấy <code>if (false)</code> và xoá hẳn dòng đó khỏi bản production.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — đếm trong trình duyệt khi có StrictMode.</strong> <code>main.tsx</code> render trong <code>&lt;StrictMode&gt;</code>, mà StrictMode gọi thân mọi component <em>hai lần</em> ở chế độ dev (Bài 11.3). Đọc bộ đếm trên trình duyệt dev, bạn thấy 400 cho 200 thẻ và tưởng có gì hỏng nặng. Test trong bài render không có StrictMode nên số đếm chính xác; trên trình duyệt thì chia đôi, hoặc đo trên bản build profiling.</div>

<h3>Đo lần đầu, trong Vitest: một trái tim, 200 thẻ chạy lại</h3>
${slide('rx-08', 5, 'Bấm ♡ một thẻ: 200 thẻ chạy lại, chỉ một thẻ thật sự đổi')}
<p>Thí nghiệm: mở <code>/bac-si</code> với 200 bác sĩ, xoá số của cả hai dụng cụ, bấm ♡ cho BS. Nguyễn Minh An, đọc số. Rồi gõ "huy" vào ô tìm từng phím một.</p>
${pre('tsx', SN.bai1Test)}
${out(OUT.bai1Truoc)}
<p>Đọc chậm từng dòng:</p>
<ol>
<li><strong>Một cú bấm, một lần commit, 200 lần render thẻ.</strong> Đúng một thẻ đổi (♡ thành ♥), vậy mà cả 200 hàm <code>TheBacSi</code> đều chạy. Lý do, từng bước:</li>
</ol>
${SD.bamTimVi}
<p><code>KhuBacSi</code> đăng ký nghe mảng yêu thích trong store Zustand. Bấm ♡ thay mảng đó bằng mảng mới, nên <code>KhuBacSi</code> render lại; và mặc định React render lại <strong>mọi con</strong> của một component vừa render — nó không nhìn props trước. Vẽ thành cây:</p>
${SD.cayThuaVi}
<ol start="2">
<li><strong>Gõ phím làm mọi thẻ đang hiện render lại.</strong> Mỗi phím sửa <code>?q=</code> trên URL (Bài 7.1), <code>KhuBacSi</code> lọc lại, và mọi thẻ còn trên màn hình chạy lại: 162 sau "h", 50 sau "u", 17 sau "y". Những thẻ biến mất thì bị gỡ (unmount) — đó là một loại chi phí khác.</li>
<li><strong>Các dòng Profiler.</strong> <code>mount</code> đầu tiên chỉ là khung xương (danh sách đang tải — 1,2 ms). <code>update</code> thứ nhất là lúc dữ liệu về và 200 thẻ được dựng (34,7 ms trong jsdom). <code>update</code> thứ hai là cú bấm: 16,5 ms, và <code>actualDuration ≈ baseDuration</code> — React không bỏ qua được gì.</li>
</ol>
<p>Vậy 16,5 ms có chậm không? <strong>Nhìn jsdom thì không biết được.</strong> jsdom là một trình duyệt bắt chước bằng JavaScript chạy trong Node: không tính bố cục, không vẽ, cấu hình máy JavaScript khác hẳn. Số <em>đếm</em> của nó chính xác (200 ở đâu cũng là 200); số <em>mili-giây</em> thì không phải thứ người dùng cảm nhận.</p>

<h3>Mili-giây thật: Chromium, CPU chậm 4×</h3>
${slide('rx-08', 6, 'Build thường không đo: cần build --mode profiling')}
<p>Script <code>do/do-chromium.mjs</code> build app, chạy bằng <code>vite preview</code>, mở <code>/bac-si?nhieu=200</code> trong Chromium, làm chậm CPU 4× (đúng hệ số Lighthouse dùng để bắt chước một điện thoại tầm trung), bấm ♡ bảy lần rồi đọc hai thứ: <code>window.__nhatKyDo</code> của Profiler, và <strong>Event Timing API</strong> của chính trình duyệt — nó báo mỗi cú bấm tốn bao lâu cho tới khung hình kế tiếp, tức nguyên liệu của INP:</p>
${pre('js', SN.eventTiming)}
<p>Lần chạy đầu dùng <code>npx vite build</code> bình thường. Profiler ghi được <strong>không gì cả</strong>:</p>
${out(OUT.chromiumTruoc)}
<p>Dòng <code>[production]</code> ghi <code>commit/lần = 0,0,0,0,0,0,0</code>: bảy cú bấm, không lần nào <code>onRender</code> được gọi. Đây là thiết kế có chủ ý — react.dev: việc đo "thêm một chút chi phí, nên bị tắt mặc định trong bản build production". Muốn đo một bản build giống production, bạn chủ động dùng bản <code>react-dom</code> có bật đo của React. Với Vite đó là một alias, chỉ bật ở một chế độ (mode) bạn tự chọn:</p>
${pre('ts', SN.viteConfig)}
<p>Chạy <code>npx vite build --mode profiling</code> là <code>react-dom/client</code> được thay bằng <code>react-dom/profiling</code> (có sẵn trong gói <code>react-dom</code>; kiểm trong <code>node_modules/react-dom/package.json</code> → <code>"./profiling"</code>). Sao không đo luôn trong <code>vite dev</code>? React bản dev chạy thêm nhiều phép kiểm và StrictMode render hai lần; số của nó chậm hơn production vài lần và sẽ phóng đại mọi vấn đề.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — "Profiler báo 0 ms, vậy là nhanh".</strong> Trên bản build production thường, <code>onRender</code> không bao giờ được gọi, nên mảng bạn ghi log vẫn rỗng và trung bình ra 0 hoặc <code>NaN</code>. Dòng đầu của output trên chính là như vậy. Luôn kiểm <em>số lần commit</em> ghi được trước khi tin một con số thời gian.</div>
${slide('rx-08', 7, 'Máy chậm 4×: 200 thẻ tốn 10 ms, 1000 thẻ tốn 40 ms')}
<p>Giờ bản build profiling nói thật. Với CPU chậm 4×:</p>
<ul>
<li><strong>200 bác sĩ:</strong> một cú bấm tốn <code>actualDuration</code> 10,1 ms (trung vị của 7 lần); cả tương tác, do trình duyệt đo, 24 ms. Chậm 6×: 15,4 ms và 40 ms.</li>
<li><strong>1000 bác sĩ:</strong> 39,8 ms render mỗi cú bấm, 88 ms cho cả tương tác. Gõ chữ đầu tiên vào ô tìm: 40,6 ms.</li>
</ul>
<p>(Event Timing chỉ báo tương tác từ 16 ms trở lên và làm tròn theo bước 8 ms, nên "0.0" trong log nghĩa là "dưới 16 ms".)</p>

<h3>React DevTools Profiler: cùng câu trả lời, có hình</h3>
<p>Mọi thứ ở trên cũng xem được bằng tiện ích trình duyệt <strong>React Developer Tools</strong> (Chrome, Firefox, Edge). Trong tab <em>Profiler</em>: bấm ghi, bấm ♡, dừng. <em>Flame graph</em> (biểu đồ ngọn lửa) vẽ mỗi component của lần commit đó thành một thanh, bề rộng là thời gian render; component không render thì màu xám. Trong cài đặt ⚙, "<em>Record why each component rendered while profiling</em>" thêm vào mỗi thanh một dòng như "The parent component rendered" — đúng lý do 199 thẻ thừa đã chạy. "<em>Highlight updates when components render</em>" nháy viền quanh mọi thứ render lại trong lúc bạn dùng trang.</p>
<p>⏳ Chưa chạy thật: máy dựng bài không điều khiển được tiện ích React DevTools, nên không có ảnh chụp. Ở máy bạn: cài React Developer Tools, mở <code>npm run dev</code> tại <code>/bac-si?nhieu=200</code>, ghi một cú bấm ♡, và kiểm tra flame graph có 200 thanh <code>TheBacSi</code> với lý do "The parent component rendered".</p>
<!-- CHAY-O-MAY: chụp ảnh tab Profiler của React DevTools khi bấm ♡ trên /bac-si?nhieu=200 (flame graph 200 TheBacSi + lý do "The parent component rendered") -->

<h3>Đọc số: đã tới lúc tối ưu chưa?</h3>
<p>Đặt số đo cạnh ngưỡng ở phần đầu:</p>
<table>
<thead><tr><th>Tình huống (Chromium, CPU 4×)</th><th>Render mỗi cú bấm</th><th>Tương tác</th><th>Kết luận</th></tr></thead>
<tbody>
<tr><td>200 bác sĩ, bấm ♡</td><td>10,1 ms</td><td>24 ms</td><td>dưới 200 ms rất xa — <strong>hôm nay chưa là vấn đề</strong></td></tr>
<tr><td>1000 bác sĩ, bấm ♡</td><td>39,8 ms</td><td>88 ms</td><td>vẫn "tốt", nhưng hai khung hình công việc cho một trái tim, và điện thoại rẻ thật còn chậm hơn giả lập này</td></tr>
<tr><td>1000 bác sĩ, gõ một chữ</td><td>40,6 ms</td><td>24 ms</td><td>chủ yếu là gỡ hàng trăm thẻ</td></tr>
</tbody></table>
<p>Kết luận thật thà: với 200 bác sĩ, app này ổn. Điều số đo <em>có</em> cho thấy là một kiểu lãng phí rất rõ hình dạng — 199 trên 200 lần render ra kết quả y hệt — và lãng phí đó tăng tuyến tính theo độ dài danh sách. Đó đúng là loại vấn đề <code>memo</code> sinh ra để giải, và bài sau sẽ sửa rồi đo lại. Không có bài này, bạn đã bọc <code>useCallback</code> quanh vài handler ngẫu nhiên và không bao giờ biết có gì thay đổi không.</p>

<h3>Khi nào nên đo — và khi nào khỏi mất công</h3>
<ul>
<li><strong>Đo</strong> khi có người báo giật/chậm, khi một danh sách hay bảng vượt vài trăm dòng, khi trang có hoạt ảnh hay kéo-thả, trước và sau mỗi thay đổi về hiệu năng, và khi phỏng vấn ("bạn sẽ tìm ra bằng cách nào?").</li>
<li><strong>Đừng</strong> mở đầu một tính năng bằng việc tối ưu, và đừng tin cảm giác trên chiếc laptop mạnh: bật CPU throttling (DevTools → Performance → CPU: 4× slowdown) trước khi kết luận.</li>
<li><strong>Đo đúng bản build:</strong> số lần render ở dev/test, thời gian ở bản profiling, trải nghiệm người dùng bằng Event Timing / INP của trình duyệt.</li>
</ul>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Một trang React có cảm giác chậm. Bạn bắt đầu từ đâu?"</p>
<p>Em tái hiện trên cấu hình chậm trước — bật CPU throttling trong DevTools — rồi đo chứ không đoán: React DevTools Profiler để xem lần commit nào tốn, component nào render lại và vì sao; tab Performance hoặc INP để xem thời gian có thật sự nằm ở React không hay ở layout, mạng, bundle to. Sau đó so với một ngưỡng, ví dụ INP 200 ms. Chỉ khi vượt ngưỡng em mới đổi một chỗ — thường là <code>memo</code> cho một con nặng có props ổn định, hoặc dời state xuống thấp để ít component render lại — rồi đo lại bằng đúng cách cũ. Em cũng lưu ý <code>&lt;Profiler&gt;</code> và số của DevTools cần bản dev hoặc bản profiling, vì React production tắt phần đo.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 1/4: dụng cụ đo</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau Chương 7 (các file <code>src/app/router.tsx</code>, <code>src/features/bac-si/…</code>, <code>src/mocks/co-so-du-lieu.ts</code>, <code>src/mocks/dieu-khien.ts</code>, <code>src/pages/TrangDanhSachBacSi.tsx</code>, <code>src/test/render.tsx</code>). Sau mỗi bước chạy <code>npx tsc -b</code>.</p><ol>
<li><code>src/mocks/bac-si-gia.ts</code>: <code>taoBacSiGia(soLuong, soDau = 7)</code>, tất định, tên không trùng.</li>
<li><code>src/mocks/co-so-du-lieu.ts</code>: <code>datLaiDuLieu(soBacSi = 6)</code> thêm bác sĩ giả sau sáu người thật; lúc nạp module gọi với <code>dieuKhien.soBacSi</code>. <code>src/mocks/dieu-khien.ts</code>: đọc <code>?nhieu=</code>, chặn trần 1000.</li>
<li><code>src/shared/dev/DoRender.tsx</code> (Profiler + <code>nhatKyDo</code>, lộ ra <code>window.__nhatKyDo</code>) và <code>src/shared/dev/dem-render.ts</code> (<code>demRender</code>, <code>useDemRender</code>).</li>
<li>Bọc <code>&lt;KhuBacSi /&gt;</code> trong <code>&lt;DoRender id="KhuBacSi"&gt;</code> ở <code>TrangDanhSachBacSi</code>; gọi <code>useDemRender('TheBacSi')</code> ở đầu <code>TheBacSi</code>.</li>
<li><code>vite.config.ts</code>: alias cho chế độ profiling.</li>
</ol>
<p><strong>Đạt khi</strong> — tạo <code>src/features/bac-si/KhuBacSi.hieu-nang.test.tsx</code> với nội dung dưới đây và test đầu tiên xanh (hai test "8.2" còn đỏ tới Bài 8.2 — đúng như dự kiến); <code>npx vite build --mode profiling</code> chạy xong; và trong Chromium tại <code>/bac-si?nhieu=200</code>, <code>window.__nhatKyDo</code> trong console có thêm một dòng sau mỗi cú bấm ♡.</p></div>
${pre('tsx', SN.tieuChi81)}
${out(OUT.tieuChi82Truoc)}
<details><summary>Lời giải</summary>
<p>Chạy trên dự án của chương ngày 26/09/2026: <code>npx tsc -b</code> không in gì, test 8.1 xanh, hai test 8.2 đỏ với <code>expected 200 to be 1</code> và <code>expected 229 to be +0</code> (162 + 50 + 17 lần render thẻ khi gõ) cho tới khi bạn thêm <code>memo</code>.</p>
<p>Mọi file của lời giải đã in nguyên văn ở trên, đúng như lúc chạy — áp dụng theo thứ tự:</p>
<ol>
<li><strong>src/mocks/bac-si-gia.ts</strong> — khối mã ở mục "Chuẩn bị: 200 bác sĩ giả".</li>
<li><strong>src/mocks/co-so-du-lieu.ts</strong> — thay <code>datLaiDuLieu</code> bằng bản ở cùng mục và thêm <code>import { taoBacSiGia } from './bac-si-gia'</code>, <code>import { dieuKhien } from './dieu-khien'</code> ở đầu file; <strong>src/mocks/dieu-khien.ts</strong> — thêm dòng <code>soBacSi</code> vào object.</li>
<li><strong>src/shared/dev/DoRender.tsx</strong> — khối ở mục "&lt;Profiler&gt;: một component đo giờ"; <strong>src/shared/dev/dem-render.ts</strong> — khối ở mục "Dụng cụ thứ hai".</li>
<li><strong>src/pages/TrangDanhSachBacSi.tsx</strong> — trang đã bọc; trong <code>TheBacSi.tsx</code> thêm <code>import { useDemRender } from '@/shared/dev/dem-render'</code> và <code>useDemRender('TheBacSi');</code> làm dòng đầu của component.</li>
<li><strong>vite.config.ts</strong> — khối ở mục "Mili-giây thật".</li>
</ol>
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> đo thêm một tương tác, theo đúng cách của bài.</p><ol>
<li>Chép <code>src/vi-du/bai1.test.tsx</code> của bài. Thêm một test bấm chip chuyên khoa "Nhi" khi có 200 bác sĩ, in số commit, số lần <code>TheBacSi</code> chạy và số thẻ trên màn hình.</li>
<li>Chạy <code>npx vitest run src/vi-du/bai1.test.tsx --reporter=verbose</code> và ghi lại ba con số.</li>
<li>Build bằng <code>npx vite build --mode profiling</code>, chạy <code>npx vite preview</code>, mở <code>/bac-si?nhieu=1000</code>, bật DevTools → Performance → CPU 4× slowdown, rồi trong console gõ <code>__nhatKyDo.length = 0</code>, bấm ♡ một lần, gõ <code>__nhatKyDo</code>.</li>
</ol><p><strong>Đạt khi:</strong> bước 2 in đúng 1 commit, và số lần <code>TheBacSi</code> chạy bằng số bác sĩ nhi trên màn hình (51 — hàm sinh cho cứ bốn bác sĩ giả thì một người là <code>nhi</code>, được 49 người, cộng hai người thật; đo thật: <code>commit: 1 | TheBacSi chạy: 51 | thẻ: 51</code>); bước 3 thấy một dòng <code>phase: "update"</code> với <code>actualDuration</code> cỡ vài chục mili-giây; làm lại trên <code>npx vite build</code> thường thì mảng vẫn rỗng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Profiler (<code>&lt;Profiler&gt;</code>)</span><span class="v">component có sẵn của React, gọi <code>onRender</code> sau mỗi lần commit của cây con, kèm thời gian</span></div>
<div class="kv"><span class="k">actualDuration / baseDuration</span><span class="v">thời gian thật của lần commit này / ước tính nếu không bỏ qua gì; cách xa nhau ⇒ memo có tác dụng</span></div>
<div class="kv"><span class="k">bản build profiling</span><span class="v"><code>react-dom/profiling</code>: React tốc độ production nhưng bật phần đo</span></div>
<div class="kv"><span class="k">INP (Interaction to Next Paint)</span><span class="v">thời gian từ bấm/gõ tới khung hình kế tiếp; tốt ≤ 200 ms, kém &gt; 500 ms</span></div>
<div class="kv"><span class="k">Event Timing API</span><span class="v">API trình duyệt (<code>PerformanceObserver</code> loại <code>event</code>) báo thời lượng tương tác</span></div>
<div class="kv"><span class="k">CPU throttling (làm chậm CPU)</span><span class="v">DevTools/CDP làm CPU chậm đi 4×, 6× để giả một điện thoại yếu</span></div>
<div class="kv"><span class="k">render thừa (wasted render)</span><span class="v">component chạy lại nhưng trả về đúng kết quả như lần trước</span></div>
<div class="kv"><span class="k">flame graph (biểu đồ ngọn lửa)</span><span class="v">cách React DevTools vẽ một lần commit: mỗi component một thanh, bề rộng = thời gian render</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tối ưu là một vòng lặp: đo → so với ngưỡng → sửa một chỗ → đo lại bằng đúng cách cũ.</li>
<li><code>&lt;Profiler onRender&gt;</code> đo thời gian một cây con; bộ đếm render cho biết ai đã chạy. Số đếm từ jsdom chính xác, số mili-giây thì không.</li>
<li>Đo thật: một cú ♡ trên 200 bác sĩ ⇒ 1 commit, 200 lần <code>TheBacSi</code> chạy, 1 thẻ thật sự đổi.</li>
<li>Bản build production thường không bao giờ gọi <code>onRender</code> (ghi được 0 commit); build <code>--mode profiling</code> để đo ở tốc độ production.</li>
<li>Chromium, CPU 4×: 10,1 ms mỗi cú bấm với 200 bác sĩ (ổn), 39,8 ms với 1000; tương tác 24 ms và 88 ms.</li>
<li>Lãng phí có hình dạng rõ — 199 lần render y hệt — đúng việc của <code>memo</code> (Bài 8.2).</li>
</ul>

${LINK('https://react.dev/reference/react/Profiler', '📄', 'react.dev — &lt;Profiler&gt;', 'Tham số của onRender, đo trên bản build production.')}
${LINK('https://react.dev/learn/react-developer-tools', '🧰', 'react.dev — React Developer Tools', 'Cài tiện ích; tab Components và Profiler.')}
${LINK('https://web.dev/articles/inp', '📏', 'web.dev — Interaction to Next Paint (INP)', 'INP đo gì, ngưỡng 200 / 500 ms.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming', '📄', 'MDN — PerformanceEventTiming', 'Event Timing API mà script Chromium dùng.')}
${LINK('https://developer.chrome.com/docs/devtools/performance', '🛠', 'Chrome DevTools — Performance', 'Ghi trace, làm chậm CPU, đọc kết quả.')}
</div>
`,
};

/* Output cắt sẵn cho Bài 8.2 (ngoài template literal: bộ kiểm cấm gạch chéo ngược trong thân bài) */
const O2 = {
  bai2The: OUT.bai2.split('\n').slice(0, 4).join('\n'),
  bai2Loc: OUT.bai2.split('\n').slice(4).join('\n'),
  compilerDem: OUT.compilerVitest.split('\n').slice(3, 5).concat(OUT.compilerVitest.split('\n').slice(9, 11)).join('\n'),
};
const L2 = {
    title: '8.2 — memo, useMemo, useCallback — only where the measurement says so, and React Compiler|||8.2 — memo, useMemo, useCallback — chỉ ở chỗ số đo bảo cần, và React Compiler',
    slug: 'rx-8-2-memo',
    type: 'LESSON',
    isFreePreview: true,
    description: 'memo cắt 199 lần render thừa khi bấm ♡ (10,1 → 1,9 ms), hàm và object mới làm memo vô dụng, useMemo cho phép tính 0,1 ms là không đáng, và React Compiler — kể cả cái bẫy Babel 8 làm nó bỏ qua component mà không báo.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>memo, useMemo, useCallback — only where the measurement says so, and React Compiler</h2>
<p class="lead">Lesson 8.1 found waste with a precise shape: one ♡ makes 200 doctor cards run, 199 of them return exactly what they returned before. This lesson removes that waste with one line, proves it with the same measurements, and then deliberately breaks the fix three different ways so you recognise the bugs in real code. It ends with React Compiler, which promises to do all of this for you — and a real trap where it silently did nothing.</p>
<p>Setup as in Lesson 8.1: the Chapter 7 clinic app with the measuring instruments from step 1/4 (React 19.3.0, Vite 8.3.1, Vitest 5.0.2, jsdom 29.1.1; Chromium 149 with a 4× CPU slowdown for timings). Experiments that are not part of the app live in <code>src/vi-du/bai2.tsx</code>.</p>

<h3><code>memo</code>: skip a child whose props did not change</h3>
${slide('rx-08', 9, 'memo: identical props ⇒ skip the whole component')}
<p>By default, when a component re-renders, React re-renders all of its children, whatever their props. <code>memo</code> adds one question in between:</p>
${SD.memoEn}
<p>"Same" means <code>Object.is</code>, prop by prop — the same test as <code>===</code>, except that <code>NaN</code> equals <code>NaN</code> and <code>+0</code> differs from <code>-0</code>. For strings, numbers and booleans that is comparing values. For objects, arrays and functions it compares <strong>references</strong>: "is this the very same object in memory?", not "do they look alike?".</p>
<div class="callout"><p><strong>JS quick reminder — values vs references.</strong> <code>'An' === 'An'</code> is <code>true</code>. <code>{ id: 1 } === { id: 1 }</code> is <code>false</code>: two object literals create two objects. <code>const a = { id: 1 }; a === a</code> is <code>true</code>: same object. The same goes for functions — <code>(() =&gt; 1) === (() =&gt; 1)</code> is <code>false</code>. Every time a component function runs, every <code>{}</code>, <code>[]</code> and arrow function written inside it is a <em>new</em> object.</p></div>
<p>In the app, wrapping <code>TheBacSi</code> is the whole change:</p>
${pre('tsx', SN.theBacSi)}
<p>Before trusting it, check each prop the list passes to a card, because one unstable prop defeats the whole thing:</p>
<table>
<thead><tr><th>Prop</th><th>Where it comes from</th><th>Same reference on the next render?</th></tr></thead>
<tbody>
<tr><td><code>bacSi</code></td><td>an element of the TanStack Query cache (<code>useBacSi</code>)</td><td>yes — the cache keeps the same objects until the data is refetched and changes</td></tr>
<tr><td><code>noiBat</code>, <code>laYeuThich</code>, <code>coLienKet</code></td><td>booleans computed in the parent</td><td>compared by value — only the clicked card's <code>laYeuThich</code> changes</td></tr>
<tr><td><code>onDoiYeuThich</code></td><td>the <code>doiYeuThich</code> action from the Zustand store</td><td>yes — actions are created once, when the store is created</td></tr>
</tbody></table>
<p>The same test as Lesson 8.1, after adding <code>memo</code>:</p>
${out(OUT.bai1Sau)}
<p>200 → <strong>1</strong> card run for a ♡, and <strong>0</strong> while typing (every card that stays visible has unchanged props; cards that disappear are unmounted, which <code>memo</code> cannot avoid). The last Profiler line tells the same story in time: <code>actualDuration=2.6ms</code> against <code>baseDuration=18.2ms</code> — React skipped almost the whole subtree.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202, the performance slide shows <code>shouldComponentUpdate(nextProps)</code> or <code>class X extends PureComponent</code>, and the tempting takeaway is "wrap everything, just in case" — today that becomes <code>useCallback</code> around every handler. → At work, <code>memo</code> goes where a Profiler recording shows expensive wasted renders, next to a before/after number in the pull request; and in new React 19 projects many teams enable React Compiler instead of writing <code>memo</code> by hand. · <em>Why:</em> each hand-written <code>memo</code>/<code>useCallback</code> is a dependency list someone can get wrong, and one unstable prop silently cancels it. <code>PureComponent</code> is the same idea as <code>memo</code> — you will still see it in older class-based code.</p></div>

<h3>Three ways to break <code>memo</code> — measured on 200 cards</h3>
${slide('rx-08', 10, 'A NEW function or object on every render makes memo useless')}
<p>To see the traps in isolation, <code>src/vi-du/bai2.tsx</code> builds a list of 200 small cards four ways:</p>
${pre('tsx', SN.bai2)}
${pre('tsx', SN.bai2Test)}
${out(O2.bai2The)}
<p>Wrapping the card in <code>memo</code> changed <strong>nothing</strong> (200 → 200) while the parent passes <code>doi</code>, a function created again on every render. Step by step:</p>
${SD.hamMoiEn}
<p><code>useCallback(fn, deps)</code> returns the <em>same</em> function object across renders until something in <code>deps</code> changes. The dependency array here can be empty because the function only uses <code>setYeuThich</code>, and React guarantees state setters never change. With it, 1 card runs. The fourth variant shows that objects behave exactly like functions: <code>bacSi={{ ...bs }}</code> copies the doctor into a new object every render, and <code>memo</code> is useless again.</p>
<div class="pitfall co-tieu-de"><strong>Trap — <code>memo</code> on the child, a new object in the parent.</strong> The usual suspects: an inline arrow <code>onClick={() =&gt; chon(bs.id)}</code>, an inline style <code>style={{ marginTop: 8 }}</code>, a config object <code>options={{ compact: true }}</code>, a derived array <code>items={ds.filter(…)}</code>, and <code>children</code> — JSX passed as children is a new element object each time, so a <code>memo</code> component with children almost never skips. Nothing warns you: the app works, tests pass, and the Profiler shows the same time as before. Only measuring catches it.</div>
<p>Why did the app not need <code>useCallback</code>? Because its handler already comes from a store. If a teammate later writes <code>onDoiYeuThich={(id) =&gt; { doiYeuThich(id); hien('Đã lưu'); }}</code> in <code>KhuBacSi</code>, the count goes back to 200 — and the fix is <code>useCallback</code> with <code>[doiYeuThich, hien]</code> as dependencies.</p>

<h3><code>useMemo</code>: remember a result — but measure the calculation first</h3>
${slide('rx-08', 11, 'useMemo for filtering 200 doctors: 0.1 ms — not worth it')}
<p><code>useMemo(() =&gt; calculate(a, b), [a, b])</code> runs the calculation on the first render and afterwards only when <code>a</code> or <code>b</code> changed; otherwise it returns the previous result. The obvious candidate in the app is <code>locBacSi</code>, which filters the list on every render (and strips Vietnamese accents from every name to compare). How expensive is it?</p>
${pre('tsx', SN.doLoc)}
${out(O2.bai2Loc)}
<p>0.1 ms for 200 doctors, 0.5 ms for 1000 — in jsdom on a fast laptop, so maybe 4× more on a slow phone. react.dev's rule of thumb is to consider <code>useMemo</code> only when a calculation takes around <strong>1 ms or more</strong>. This one does not qualify, so the app does not use it: <code>useMemo</code> is not free either — every render still compares the dependencies and keeps the old result alive.</p>
<p>There is a second, more common reason to use <code>useMemo</code>: <strong>keeping a reference stable</strong>. If a derived array or object is passed to a <code>memo</code> child or listed in an effect's dependencies, <code>useMemo</code> keeps it the same object while its inputs are the same:</p>
${pre('tsx', SN.useMemoMau)}
<p>Summary of the three tools, as used in this project:</p>
${SD.chonCongCuEn}

<h3>Measured again in Chromium: 10.1 ms → 1.9 ms</h3>
${slide('rx-08', 12, 'memo(TheBacSi) in the app: a ♡ goes from 10.1 ms to 1.9 ms')}
<p>Same script, same profiling build, same 4× CPU slowdown as Lesson 8.1, now with <code>memo(TheBacSi)</code>:</p>
${out(OUT.chromiumMemo200)}
${out(OUT.chromiumMemo1000)}
<table>
<thead><tr><th>Chromium, CPU 4×</th><th>Before</th><th>After <code>memo</code></th></tr></thead>
<tbody>
<tr><td>200 doctors — ♡ (actualDuration)</td><td>10.1 ms</td><td><strong>1.9 ms</strong></td></tr>
<tr><td>1000 doctors — ♡ (actualDuration)</td><td>39.8 ms</td><td><strong>5.1 ms</strong></td></tr>
<tr><td>1000 doctors — ♡ (interaction, Event Timing)</td><td>88 ms</td><td>24 ms</td></tr>
<tr><td>1000 doctors — type "h"</td><td>40.6 ms</td><td>26.8 ms</td></tr>
</tbody></table>
<p>The click is 5–8× cheaper. Typing improved much less, and the measurement explains why: after "h", 162 of 200 (or 838 of 1000) cards <em>disappear</em>, and removing DOM nodes is work <code>memo</code> cannot skip. If typing were the complaint, the next tool would not be more <code>memo</code> but fewer DOM nodes — virtualization (Chapter 13) or deferring the filter with <code>useDeferredValue</code> (Chapter 12).</p>

<h3>React Compiler: let the build write the memoisation</h3>
${slide('rx-08', 13, 'Compiler via Babel 8 skips TheBacSi without any error')}
<p>React Compiler (1.0 released in October 2025, per react.dev — checked 09/2026) is a build-time plugin: it reads your components and inserts the caching that <code>memo</code>, <code>useMemo</code> and <code>useCallback</code> would do, at a finer grain, as long as your code follows the Rules of React. With Vite 8 and <code>@vitejs/plugin-react</code> 6 it runs through Babel (the plugin's README, checked in <code>node_modules</code>):</p>
${pre('ts', SN.viteCompiler)}
<p>The README says to install <code>@rolldown/plugin-babel @babel/core babel-plugin-react-compiler</code>. On 26/09/2026, <code>npm install -D @babel/core</code> installs <strong>8.0.6</strong>. The build was green, the app worked, and a click on ♡ measured 10.7 ms — no better than without the compiler. The compiler's own logger explains, if you ask it:</p>
${pre('js', SN.kiemCompiler)}
${out(OUT.compilerBabel8)}
<p>With Babel 8, the compiler hits a <code>CompileError</code> on <code>TheBacSi</code> — the prop defaults (<code>noiBat = false</code>) are where it stumbles — and the default behaviour on an error is to <strong>leave that component uncompiled and say nothing</strong>. <code>KhuBacSi</code>, which has no defaulted props, was compiled. Pinning Babel 7 fixes it:</p>
${out(OUT.compilerBabel7)}
<p>The last lines are also instructive: the experimental <code>TheThuong</code> in <code>bai2.tsx</code> writes to an outside counter during render (<code>dem.the++</code>), which breaks the Rules of React, and the compiler refuses it ("This value cannot be modified"). The compiler only optimises code that is pure.</p>
<div class="pitfall co-tieu-de"><strong>Trap — "I enabled React Compiler, so it is optimised".</strong> A skipped component produces no warning in <code>vite build</code> (checked: the only warning printed was about a config import extension). Verify in three ways: the compiler logger (script above), React DevTools (compiled components show a "Memo ✨" badge — ⏳ not checked here, the extension could not run on the build machine), and a Profiler measurement before and after.</div>
<!-- CHAY-O-MAY: xác nhận huy hiệu "Memo ✨" trên TheBacSi trong tab Components của React DevTools khi bật React Compiler -->
${slide('rx-08', 14, 'Compiler without hand-written memo: a ♡ still drops to 2.6 ms')}
<p>With Babel 7 and <strong>no</strong> hand-written <code>memo</code>:</p>
${out(OUT.chromiumComp200)}
${out(OUT.chromiumComp1000)}
<table>
<thead><tr><th>Chromium, CPU 4×, click ♡</th><th>200 doctors</th><th>1000 doctors</th></tr></thead>
<tbody>
<tr><td>Nothing</td><td>10.1 ms</td><td>39.8 ms</td></tr>
<tr><td><code>memo(TheBacSi)</code> by hand</td><td>1.9 ms</td><td>5.1 ms</td></tr>
<tr><td>React Compiler, Babel 8 (skipped)</td><td>10.7 ms</td><td>42.1 ms</td></tr>
<tr><td>React Compiler, Babel 7</td><td>2.6 ms</td><td>7.5 ms</td></tr>
</tbody></table>
<p>The counter adds a nuance. Under the compiler, the Vitest run still reports 200 <code>TheBacSi</code> calls per click, but the commit is cheap:</p>
${out(O2.compilerDem)}
<p>The compiler did not stop the list from calling the 200 card functions (the whole <code>.map</code> depends on the favourites array); it cached what is <em>inside</em> each card, so 199 cards return their previous JSX immediately and React skips their subtrees. Hand-written <code>memo</code> skips the call itself, which is why it wins slightly here. Chapter 12 turns the compiler on for the whole app and measures it properly.</p>

<div class="callout"><p><strong>Common interview question.</strong> "What is the difference between <code>memo</code>, <code>useMemo</code> and <code>useCallback</code>? Should you use them everywhere?"</p>
<p><code>memo</code> wraps a component: React skips re-rendering it when every prop is <code>Object.is</code>-equal to last time. <code>useMemo</code> caches a computed value between renders until its dependencies change; <code>useCallback</code> is the same for a function (<code>useCallback(fn, deps)</code> ≈ <code>useMemo(() =&gt; fn, deps)</code>). The hooks matter mostly to keep props stable for a memoised child, or for an expensive calculation (around 1 ms or more). Not everywhere: they cost comparisons and memory, add dependency arrays that can be wrong, and a single unstable prop cancels them. I measure first; in React 19 projects I would rather enable React Compiler and verify it with the logger and the Profiler.</p></div>
<div class="callout"><p><strong>Common interview question.</strong> "What does React Compiler do, and does it replace <code>memo</code>?"</p>
<p>It is a build step (a Babel plugin, 1.0 since October 2025) that analyses components and hooks and inserts fine-grained caching automatically, so most manual <code>memo</code>/<code>useMemo</code>/<code>useCallback</code> becomes unnecessary. It only compiles code that follows the Rules of React; code that mutates outside values during render is skipped. It does not remove the need to measure — in my measurement it made a click 4× cheaper, but a dependency mismatch had silently disabled it on the first try.</p></div>

<h3>🛠 Keep building the project — step 2/4: memo where it was measured</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after step 1/4 (<code>src/features/bac-si/components/TheBacSi.tsx</code> with <code>useDemRender</code>, <code>src/features/bac-si/KhuBacSi.hieu-nang.test.tsx</code> with two red "8.2" tests).</p><ol>
<li>Wrap <code>TheBacSi</code> in <code>memo</code> (import it from <code>react</code>); keep the function name inside so DevTools and error messages still say <code>TheBacSi</code>.</li>
<li>Check the props one by one against the table in this lesson; do <strong>not</strong> add <code>useCallback</code> or <code>useMemo</code> anywhere else — the measurement did not ask for them.</li>
<li>Re-run the Chromium measurement (or the practice below) and write the before/after numbers into your commit message.</li>
</ol>
<p><strong>Done when:</strong> all three tests in <code>KhuBacSi.hieu-nang.test.tsx</code> are green, and the 11 Chapter 7 tests in <code>src/app/router.test.tsx</code> are still green.</p></div>
${out(OUT.tieuChi82Sau)}
<details><summary>Solution</summary>
<p><strong>src/features/bac-si/components/TheBacSi.tsx</strong> — the full file is printed at the top of this lesson ("<code>memo</code>: skip a child…"). The only differences from Chapter 7 are the <code>memo</code> import, <code>export const TheBacSi = memo(function TheBacSi(…) { … });</code> and the <code>useDemRender</code> line from step 1. Run on 26/09/2026: <code>npx tsc -b</code> prints nothing; <code>npx vitest run src/app src/features</code> → 2 files, 14 tests green at this step (the accessibility test file arrives in Lesson 8.4).</p>
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> break the fix on purpose, then repair it — in the app, not in the sandbox.</p><ol>
<li>In <code>KhuBacSi</code>, replace <code>onDoiYeuThich={doiYeuThich}</code> with an inline arrow that also logs: <code>onDoiYeuThich={(id) =&gt; { console.info('♡', id); doiYeuThich(id); }}</code>. Run the criteria tests.</li>
<li>Fix it with <code>useCallback</code> (think about what goes in the dependency array) and run the tests again.</li>
<li>Undo both changes. Then pass <code>style={{ opacity: 1 }}</code> to <code>TheBacSi</code> from the list (add an optional <code>style</code> prop). Predict the ♡ count before running.</li>
</ol><p><strong>Done when:</strong> in step 1 the ♡ test fails with <code>expected 200 to be 1</code>; after step 2 all three tests are green again; in step 3 your prediction (200) matches the failing test; <code>npx tsc -b</code> is clean at the end.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k"><code>memo</code></span><span class="v">wraps a component so React skips re-rendering it when all props are <code>Object.is</code>-equal</span></div>
<div class="kv"><span class="k"><code>useCallback</code></span><span class="v">returns the same function object across renders until a dependency changes</span></div>
<div class="kv"><span class="k"><code>useMemo</code></span><span class="v">caches a computed value until its dependencies change</span></div>
<div class="kv"><span class="k">referential equality</span><span class="v">"same object in memory" — how <code>===</code>/<code>Object.is</code> compare objects, arrays, functions</span></div>
<div class="kv"><span class="k">stable prop</span><span class="v">a prop whose reference does not change between renders (store actions, cached data, primitives)</span></div>
<div class="kv"><span class="k">React Compiler</span><span class="v">build-time plugin that inserts memoisation automatically for code following the Rules of React</span></div>
<div class="kv"><span class="k">Rules of React</span><span class="v">components and hooks are pure during render; no mutation of outside values — the compiler relies on it</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>memo(TheBacSi)</code> took one ♡ from 200 card renders to 1, and from 10.1 to 1.9 ms (39.8 → 5.1 ms for 1000 doctors) — measured, not assumed.</li>
<li><code>memo</code> compares every prop by reference: an inline arrow, <code>{ ...obj }</code>, inline styles or <code>children</code> silently cancel it (200 → 200).</li>
<li><code>useCallback</code> keeps a function stable; the app did not need it because the handler comes from a Zustand store.</li>
<li><code>useMemo</code> for a 0.1 ms filter is not worth it; use it for ~1 ms+ work or to keep a reference stable.</li>
<li>Typing barely improved: the cost there is unmounting cards, which memo cannot skip.</li>
<li>React Compiler made a click 4× cheaper without hand-written memo — but with <code>@babel/core</code> 8 it silently skipped <code>TheBacSi</code>. Verify with the logger and a measurement.</li>
</ul>

${LINK('https://react.dev/reference/react/memo', '📄', 'react.dev — memo', 'When memo helps, and why props must be stable.')}
${LINK('https://react.dev/reference/react/useMemo', '📄', 'react.dev — useMemo', 'Measuring whether a calculation is expensive (the ~1 ms guideline).')}
${LINK('https://react.dev/reference/react/useCallback', '📄', 'react.dev — useCallback', 'Stable functions for memoised children.')}
${LINK('https://react.dev/learn/react-compiler', '🤖', 'react.dev — React Compiler', 'What it does, installation, incremental adoption.')}
${LINK('https://react.dev/reference/rules', '📏', 'react.dev — Rules of React', 'Purity rules the compiler depends on.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>memo, useMemo, useCallback — chỉ ở chỗ số đo bảo cần, và React Compiler</h2>
<p class="lead">Bài 8.1 tìm ra một kiểu lãng phí có hình dạng rõ ràng: một cú ♡ làm 200 thẻ bác sĩ chạy lại, 199 thẻ trả về đúng thứ như lần trước. Bài này xoá lãng phí đó bằng một dòng, chứng minh bằng đúng các phép đo cũ, rồi cố tình làm hỏng cách sửa theo ba kiểu để bạn nhận ra các bug này trong code thật. Cuối bài là React Compiler — thứ hứa làm hết những việc này thay bạn — và một cái bẫy thật trong đó nó lặng lẽ không làm gì cả.</p>
<p>Chuẩn bị như Bài 8.1: app phòng khám sau Chương 7 cùng các dụng cụ đo ở bước 1/4 (React 19.3.0, Vite 8.3.1, Vitest 5.0.2, jsdom 29.1.1; Chromium 149 làm chậm CPU 4× để đo thời gian). Các thí nghiệm không thuộc app nằm ở <code>src/vi-du/bai2.tsx</code>.</p>

<h3><code>memo</code>: bỏ qua đứa con có props không đổi</h3>
${slide('rx-08', 9, 'memo: props giống hệt lần trước thì bỏ qua cả component')}
<p>Mặc định, khi một component render lại, React render lại mọi con của nó, bất kể props thế nào. <code>memo</code> chen thêm một câu hỏi vào giữa:</p>
${SD.memoVi}
<p>"Giống" nghĩa là <code>Object.is</code>, từng prop một — cùng phép so như <code>===</code>, chỉ khác là <code>NaN</code> bằng <code>NaN</code> và <code>+0</code> khác <code>-0</code>. Với chuỗi, số, boolean thì đó là so giá trị. Với object, mảng, hàm thì nó so <strong>tham chiếu</strong> (reference): "có phải đúng cùng một object trong bộ nhớ không?", chứ không phải "trông có giống nhau không?".</p>
<div class="callout"><p><strong>JS nhắc nhanh — giá trị và tham chiếu.</strong> <code>'An' === 'An'</code> là <code>true</code>. <code>{ id: 1 } === { id: 1 }</code> là <code>false</code>: hai object literal tạo ra hai object. <code>const a = { id: 1 }; a === a</code> là <code>true</code>: cùng một object. Hàm cũng vậy — <code>(() =&gt; 1) === (() =&gt; 1)</code> là <code>false</code>. Mỗi lần một hàm component chạy, mọi <code>{}</code>, <code>[]</code> và arrow function viết bên trong nó đều là object <em>mới</em>.</p></div>
<p>Trong app, bọc <code>TheBacSi</code> là toàn bộ thay đổi:</p>
${pre('tsx', SN.theBacSi)}
<p>Trước khi tin nó, kiểm từng prop mà danh sách truyền cho thẻ, vì chỉ một prop không ổn định là hỏng cả:</p>
<table>
<thead><tr><th>Prop</th><th>Đến từ đâu</th><th>Lần render sau có cùng tham chiếu?</th></tr></thead>
<tbody>
<tr><td><code>bacSi</code></td><td>một phần tử trong cache TanStack Query (<code>useBacSi</code>)</td><td>có — cache giữ nguyên object cho tới khi dữ liệu được tải lại và thật sự đổi</td></tr>
<tr><td><code>noiBat</code>, <code>laYeuThich</code>, <code>coLienKet</code></td><td>boolean tính ở component cha</td><td>so theo giá trị — chỉ <code>laYeuThich</code> của thẻ được bấm là đổi</td></tr>
<tr><td><code>onDoiYeuThich</code></td><td>action <code>doiYeuThich</code> của store Zustand</td><td>có — action được tạo một lần, lúc tạo store</td></tr>
</tbody></table>
<p>Cùng test của Bài 8.1, sau khi thêm <code>memo</code>:</p>
${out(OUT.bai1Sau)}
<p>200 → <strong>1</strong> thẻ chạy khi bấm ♡, và <strong>0</strong> khi gõ (thẻ nào còn hiện thì props không đổi; thẻ biến mất thì bị gỡ — việc đó <code>memo</code> không tránh được). Dòng Profiler cuối nói cùng câu chuyện bằng thời gian: <code>actualDuration=2.6ms</code> so với <code>baseDuration=18.2ms</code> — React bỏ qua gần như cả cây con.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202, slide hiệu năng cho xem <code>shouldComponentUpdate(nextProps)</code> hoặc <code>class X extends PureComponent</code>, và bài học dễ rút ra nhất là "bọc hết cho chắc" — thời nay thành <code>useCallback</code> quanh mọi handler. → Đi làm, <code>memo</code> đặt ở chỗ bản ghi Profiler cho thấy render thừa tốn thật, kèm con số trước/sau trong pull request; và nhiều nhóm làm dự án React 19 mới thì bật React Compiler thay vì viết <code>memo</code> tay. · <em>Vì sao:</em> mỗi <code>memo</code>/<code>useCallback</code> viết tay là một mảng phụ thuộc có thể viết sai, và một prop không ổn định là âm thầm vô hiệu hoá nó. <code>PureComponent</code> cùng ý tưởng với <code>memo</code> — bạn vẫn sẽ gặp nó trong code class cũ.</p></div>

<h3>Ba cách làm hỏng <code>memo</code> — đo trên 200 thẻ</h3>
${slide('rx-08', 10, 'Hàm hay object MỚI mỗi lần render làm memo vô dụng')}
<p>Để thấy từng cái bẫy riêng rẽ, <code>src/vi-du/bai2.tsx</code> dựng một danh sách 200 thẻ nhỏ theo bốn cách:</p>
${pre('tsx', SN.bai2)}
${pre('tsx', SN.bai2Test)}
${out(O2.bai2The)}
<p>Bọc thẻ bằng <code>memo</code> chẳng thay đổi <strong>gì</strong> (200 → 200) khi cha truyền <code>doi</code> — một hàm được tạo lại mỗi lần render. Từng bước:</p>
${SD.hamMoiVi}
<p><code>useCallback(fn, deps)</code> trả về <em>cùng một</em> object hàm qua các lần render, tới khi có phần tử trong <code>deps</code> đổi. Mảng phụ thuộc ở đây để rỗng được vì hàm chỉ dùng <code>setYeuThich</code>, mà React bảo đảm hàm set của state không bao giờ đổi. Có nó, chỉ 1 thẻ chạy. Cách thứ tư cho thấy object y như hàm: <code>bacSi={{ ...bs }}</code> chép bác sĩ sang một object mới mỗi lần render, và <code>memo</code> lại vô dụng.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — <code>memo</code> ở con, object mới ở cha.</strong> Nghi phạm quen mặt: arrow viết tại chỗ <code>onClick={() =&gt; chon(bs.id)}</code>, style viết tại chỗ <code>style={{ marginTop: 8 }}</code>, object cấu hình <code>options={{ compact: true }}</code>, mảng tính ra <code>items={ds.filter(…)}</code>, và <code>children</code> — JSX truyền làm children là một object element mới mỗi lần, nên component <code>memo</code> có children gần như không bao giờ được bỏ qua. Không có gì cảnh báo: app chạy, test xanh, Profiler vẫn báo thời gian như cũ. Chỉ đo mới bắt được.</div>
<p>Vậy sao app không cần <code>useCallback</code>? Vì handler của nó đã đến từ store. Nếu một đồng đội sau này viết <code>onDoiYeuThich={(id) =&gt; { doiYeuThich(id); hien('Đã lưu'); }}</code> trong <code>KhuBacSi</code>, con số quay về 200 — và cách sửa là <code>useCallback</code> với phụ thuộc <code>[doiYeuThich, hien]</code>.</p>

<h3><code>useMemo</code>: nhớ một kết quả — nhưng đo phép tính trước đã</h3>
${slide('rx-08', 11, 'useMemo cho bộ lọc 200 bác sĩ: 0,1 ms — không đáng')}
<p><code>useMemo(() =&gt; tinh(a, b), [a, b])</code> chạy phép tính ở lần render đầu, về sau chỉ chạy lại khi <code>a</code> hoặc <code>b</code> đổi; còn lại thì trả kết quả cũ. Ứng viên hiển nhiên trong app là <code>locBacSi</code>, hàm lọc danh sách ở mỗi lần render (và bỏ dấu tiếng Việt khỏi từng tên để so). Nó tốn bao nhiêu?</p>
${pre('tsx', SN.doLoc)}
${out(O2.bai2Loc)}
<p>0,1 ms cho 200 bác sĩ, 0,5 ms cho 1000 — trong jsdom trên laptop nhanh, nên trên điện thoại chậm có thể gấp 4. Quy tắc gợi ý của react.dev: chỉ nghĩ tới <code>useMemo</code> khi phép tính tốn cỡ <strong>1 ms trở lên</strong>. Hàm này không đủ, nên app không dùng: <code>useMemo</code> cũng không miễn phí — mỗi lần render vẫn phải so mảng phụ thuộc và giữ kết quả cũ trong bộ nhớ.</p>
<p>Còn một lý do thứ hai, phổ biến hơn, để dùng <code>useMemo</code>: <strong>giữ tham chiếu ổn định</strong>. Nếu một mảng/object tính ra được truyền cho con <code>memo</code> hoặc nằm trong phụ thuộc của effect, <code>useMemo</code> giữ nó là cùng một object khi đầu vào không đổi:</p>
${pre('tsx', SN.useMemoMau)}
<p>Tóm ba công cụ, theo đúng cách dự án này dùng:</p>
${SD.chonCongCuVi}

<h3>Đo lại trong Chromium: 10,1 ms → 1,9 ms</h3>
${slide('rx-08', 12, 'memo(TheBacSi) trong app: bấm ♡ từ 10,1 ms xuống 1,9 ms')}
<p>Cùng script, cùng bản build profiling, cùng CPU chậm 4× như Bài 8.1, giờ có <code>memo(TheBacSi)</code>:</p>
${out(OUT.chromiumMemo200)}
${out(OUT.chromiumMemo1000)}
<table>
<thead><tr><th>Chromium, CPU 4×</th><th>Trước</th><th>Sau <code>memo</code></th></tr></thead>
<tbody>
<tr><td>200 bác sĩ — ♡ (actualDuration)</td><td>10,1 ms</td><td><strong>1,9 ms</strong></td></tr>
<tr><td>1000 bác sĩ — ♡ (actualDuration)</td><td>39,8 ms</td><td><strong>5,1 ms</strong></td></tr>
<tr><td>1000 bác sĩ — ♡ (tương tác, Event Timing)</td><td>88 ms</td><td>24 ms</td></tr>
<tr><td>1000 bác sĩ — gõ "h"</td><td>40,6 ms</td><td>26,8 ms</td></tr>
</tbody></table>
<p>Cú bấm rẻ đi 5–8 lần. Gõ phím thì đỡ ít hơn nhiều, và số đo giải thích lý do: sau chữ "h", 162/200 (hay 838/1000) thẻ <em>biến mất</em>, mà gỡ nút DOM là việc <code>memo</code> không bỏ qua được. Nếu lời phàn nàn là về gõ phím, công cụ tiếp theo không phải thêm <code>memo</code> mà là bớt nút DOM — virtualization (Chương 13) hoặc hoãn việc lọc bằng <code>useDeferredValue</code> (Chương 12).</p>

<h3>React Compiler: để khâu build tự viết memo</h3>
${slide('rx-08', 13, 'Compiler qua Babel 8 bỏ qua TheBacSi mà không báo lỗi')}
<p>React Compiler (bản 1.0 phát hành tháng 10/2025 theo react.dev — kiểm 09/2026) là một plugin chạy lúc build: nó đọc component của bạn và tự chèn phần nhớ đệm mà <code>memo</code>, <code>useMemo</code>, <code>useCallback</code> vẫn làm, ở mức chi tiết hơn, miễn là code tuân theo các Quy tắc của React (Rules of React). Với Vite 8 và <code>@vitejs/plugin-react</code> 6, nó chạy qua Babel (theo README của plugin, đọc trong <code>node_modules</code>):</p>
${pre('ts', SN.viteCompiler)}
<p>README bảo cài <code>@rolldown/plugin-babel @babel/core babel-plugin-react-compiler</code>. Ngày 26/09/2026, <code>npm install -D @babel/core</code> cài bản <strong>8.0.6</strong>. Build xanh, app chạy, và bấm ♡ đo được 10,7 ms — không khá hơn chút nào so với không có compiler. Logger của chính compiler giải thích, nếu bạn hỏi nó:</p>
${pre('js', SN.kiemCompiler)}
${out(OUT.compilerBabel8)}
<p>Với Babel 8, compiler gặp <code>CompileError</code> ở <code>TheBacSi</code> — chỗ vấp là các prop có giá trị mặc định (<code>noiBat = false</code>) — và hành vi mặc định khi gặp lỗi là <strong>để nguyên component đó, không biên dịch, không nói gì</strong>. <code>KhuBacSi</code> không có prop mặc định nên vẫn được biên dịch. Ghim Babel 7 là hết:</p>
${out(OUT.compilerBabel7)}
<p>Mấy dòng cuối cũng đáng đọc: <code>TheThuong</code> thí nghiệm trong <code>bai2.tsx</code> ghi vào một bộ đếm bên ngoài trong lúc render (<code>dem.the++</code>), phạm Quy tắc của React, và compiler từ chối nó ("This value cannot be modified"). Compiler chỉ tối ưu code thuần khiết.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — "đã bật React Compiler là đã tối ưu".</strong> Một component bị bỏ qua không sinh cảnh báo nào trong <code>vite build</code> (đã kiểm: cảnh báo duy nhất in ra là chuyện đuôi file khi import cấu hình). Kiểm bằng ba cách: logger của compiler (script ở trên), React DevTools (component được biên dịch hiện huy hiệu "Memo ✨" — ⏳ chưa kiểm ở đây, tiện ích không chạy được trên máy dựng bài), và một phép đo Profiler trước/sau.</div>
<!-- CHAY-O-MAY: xác nhận huy hiệu "Memo ✨" trên TheBacSi trong tab Components của React DevTools khi bật React Compiler -->
${slide('rx-08', 14, 'Compiler tự nhớ: không memo tay, bấm ♡ vẫn còn 2,6 ms')}
<p>Với Babel 7 và <strong>không</strong> có <code>memo</code> viết tay:</p>
${out(OUT.chromiumComp200)}
${out(OUT.chromiumComp1000)}
<table>
<thead><tr><th>Chromium, CPU 4×, bấm ♡</th><th>200 bác sĩ</th><th>1000 bác sĩ</th></tr></thead>
<tbody>
<tr><td>Chưa làm gì</td><td>10,1 ms</td><td>39,8 ms</td></tr>
<tr><td><code>memo(TheBacSi)</code> viết tay</td><td>1,9 ms</td><td>5,1 ms</td></tr>
<tr><td>React Compiler, Babel 8 (bị bỏ qua)</td><td>10,7 ms</td><td>42,1 ms</td></tr>
<tr><td>React Compiler, Babel 7</td><td>2,6 ms</td><td>7,5 ms</td></tr>
</tbody></table>
<p>Bộ đếm thêm một sắc thái. Khi có compiler, lần chạy Vitest vẫn báo 200 lần gọi <code>TheBacSi</code> mỗi cú bấm, nhưng lần commit thì rẻ:</p>
${out(O2.compilerDem)}
<p>Compiler không ngăn danh sách gọi 200 hàm thẻ (cả vòng <code>.map</code> phụ thuộc vào mảng yêu thích); nó nhớ đệm phần <em>bên trong</em> mỗi thẻ, nên 199 thẻ trả lại JSX cũ ngay lập tức và React bỏ qua cây con của chúng. <code>memo</code> viết tay thì bỏ qua luôn việc gọi hàm, nên ở đây nó nhỉnh hơn một chút. Chương 12 bật compiler cho cả app và đo kỹ.</p>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "<code>memo</code>, <code>useMemo</code>, <code>useCallback</code> khác nhau thế nào? Có nên dùng khắp nơi không?"</p>
<p><code>memo</code> bọc một component: React bỏ qua việc render lại nó khi mọi prop <code>Object.is</code> bằng lần trước. <code>useMemo</code> nhớ một giá trị tính ra giữa các lần render cho tới khi phụ thuộc đổi; <code>useCallback</code> cũng vậy nhưng cho một hàm (<code>useCallback(fn, deps)</code> ≈ <code>useMemo(() =&gt; fn, deps)</code>). Hai hook chủ yếu có ích để giữ props ổn định cho một con đã <code>memo</code>, hoặc cho phép tính đắt (cỡ 1 ms trở lên). Không dùng khắp nơi: chúng tốn phép so và bộ nhớ, thêm mảng phụ thuộc có thể sai, và một prop không ổn định là vô hiệu hết. Em đo trước; với dự án React 19 em ưu tiên bật React Compiler rồi kiểm bằng logger và Profiler.</p></div>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "React Compiler làm gì, nó có thay thế <code>memo</code> không?"</p>
<p>Đó là một bước build (plugin Babel, bản 1.0 từ tháng 10/2025) phân tích component và hook rồi tự chèn nhớ đệm chi tiết, nên phần lớn <code>memo</code>/<code>useMemo</code>/<code>useCallback</code> viết tay trở nên thừa. Nó chỉ biên dịch code tuân theo Quy tắc của React; code sửa giá trị bên ngoài trong lúc render bị bỏ qua. Nó không thay được việc đo — trong phép đo của em nó làm cú bấm rẻ đi 4 lần, nhưng lần thử đầu một chỗ lệch phiên bản đã âm thầm tắt nó.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 2/4: memo đúng chỗ đã đo</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau bước 1/4 (<code>src/features/bac-si/components/TheBacSi.tsx</code> có <code>useDemRender</code>, <code>src/features/bac-si/KhuBacSi.hieu-nang.test.tsx</code> còn hai test "8.2" đỏ).</p><ol>
<li>Bọc <code>TheBacSi</code> bằng <code>memo</code> (import từ <code>react</code>); giữ tên hàm bên trong để DevTools và thông báo lỗi vẫn ghi <code>TheBacSi</code>.</li>
<li>Kiểm từng prop theo bảng trong bài; <strong>không</strong> thêm <code>useCallback</code> hay <code>useMemo</code> ở đâu khác — số đo không đòi.</li>
<li>Chạy lại phép đo Chromium (hoặc bài thực hành bên dưới) và ghi số trước/sau vào commit message.</li>
</ol>
<p><strong>Đạt khi:</strong> cả ba test trong <code>KhuBacSi.hieu-nang.test.tsx</code> xanh, và 11 test của Chương 7 trong <code>src/app/router.test.tsx</code> vẫn xanh.</p></div>
${out(OUT.tieuChi82Sau)}
<details><summary>Lời giải</summary>
<p><strong>src/features/bac-si/components/TheBacSi.tsx</strong> — file đầy đủ in ở đầu bài (mục "<code>memo</code>: bỏ qua đứa con…"). Khác Chương 7 đúng ba chỗ: import <code>memo</code>, <code>export const TheBacSi = memo(function TheBacSi(…) { … });</code> và dòng <code>useDemRender</code> của bước 1. Chạy ngày 26/09/2026: <code>npx tsc -b</code> không in gì; <code>npx vitest run src/app src/features</code> → 2 file, 14 test xanh ở bước này (file test khả năng tiếp cận có ở Bài 8.4).</p>
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> cố tình làm hỏng cách sửa rồi sửa lại — ngay trong app, không phải trong bãi thử.</p><ol>
<li>Trong <code>KhuBacSi</code>, thay <code>onDoiYeuThich={doiYeuThich}</code> bằng một arrow tại chỗ có ghi log: <code>onDoiYeuThich={(id) =&gt; { console.info('♡', id); doiYeuThich(id); }}</code>. Chạy các test tiêu chí.</li>
<li>Sửa bằng <code>useCallback</code> (nghĩ xem mảng phụ thuộc cần gì) rồi chạy test lại.</li>
<li>Hoàn tác cả hai. Rồi truyền <code>style={{ opacity: 1 }}</code> cho <code>TheBacSi</code> từ danh sách (thêm prop <code>style</code> không bắt buộc). Đoán số lần chạy khi bấm ♡ trước khi chạy test.</li>
</ol><p><strong>Đạt khi:</strong> ở bước 1 test ♡ đỏ với <code>expected 200 to be 1</code>; sau bước 2 cả ba test xanh trở lại; ở bước 3 con số bạn đoán (200) khớp với test đỏ; cuối cùng <code>npx tsc -b</code> sạch.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k"><code>memo</code></span><span class="v">bọc component để React bỏ qua render lại khi mọi prop <code>Object.is</code> bằng lần trước</span></div>
<div class="kv"><span class="k"><code>useCallback</code></span><span class="v">trả về cùng một object hàm qua các lần render tới khi phụ thuộc đổi</span></div>
<div class="kv"><span class="k"><code>useMemo</code></span><span class="v">nhớ một giá trị tính ra tới khi phụ thuộc đổi</span></div>
<div class="kv"><span class="k">so sánh tham chiếu (referential equality)</span><span class="v">"cùng một object trong bộ nhớ" — cách <code>===</code>/<code>Object.is</code> so object, mảng, hàm</span></div>
<div class="kv"><span class="k">prop ổn định (stable prop)</span><span class="v">prop giữ nguyên tham chiếu giữa các lần render (action của store, dữ liệu cache, giá trị nguyên thuỷ)</span></div>
<div class="kv"><span class="k">React Compiler</span><span class="v">plugin chạy lúc build, tự chèn memo cho code tuân theo Quy tắc của React</span></div>
<div class="kv"><span class="k">Rules of React (Quy tắc của React)</span><span class="v">component và hook thuần khiết khi render; không sửa giá trị bên ngoài — compiler dựa vào đó</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>memo(TheBacSi)</code> đưa một cú ♡ từ 200 lần render thẻ xuống 1, từ 10,1 xuống 1,9 ms (39,8 → 5,1 ms với 1000 bác sĩ) — đo, không đoán.</li>
<li><code>memo</code> so từng prop theo tham chiếu: arrow tại chỗ, <code>{ ...obj }</code>, style tại chỗ hay <code>children</code> âm thầm vô hiệu hoá nó (200 → 200).</li>
<li><code>useCallback</code> giữ một hàm ổn định; app không cần vì handler lấy từ store Zustand.</li>
<li><code>useMemo</code> cho bộ lọc 0,1 ms là không đáng; dùng khi phép tính cỡ 1 ms trở lên hoặc để giữ tham chiếu.</li>
<li>Gõ phím gần như không đỡ: chi phí ở đó là gỡ thẻ, thứ memo không bỏ qua được.</li>
<li>React Compiler làm cú bấm rẻ đi 4 lần mà không cần memo tay — nhưng với <code>@babel/core</code> 8 nó âm thầm bỏ qua <code>TheBacSi</code>. Kiểm bằng logger và bằng phép đo.</li>
</ul>

${LINK('https://react.dev/reference/react/memo', '📄', 'react.dev — memo', 'Khi nào memo có ích, vì sao props phải ổn định.')}
${LINK('https://react.dev/reference/react/useMemo', '📄', 'react.dev — useMemo', 'Đo xem một phép tính có đắt không (gợi ý ~1 ms).')}
${LINK('https://react.dev/reference/react/useCallback', '📄', 'react.dev — useCallback', 'Hàm ổn định cho con đã memo.')}
${LINK('https://react.dev/learn/react-compiler', '🤖', 'react.dev — React Compiler', 'Nó làm gì, cài đặt, áp dụng dần dần.')}
${LINK('https://react.dev/reference/rules', '📏', 'react.dev — Rules of React', 'Các quy tắc thuần khiết mà compiler dựa vào.')}
</div>
`,
};

const L3 = {
    title: '8.3 — Code splitting and lazy loading: routes, Suspense, the barrel trap, and images|||8.3 — Chia nhỏ bundle và tải lười: route, Suspense, bẫy barrel và ảnh',
    slug: 'rx-8-3-lazy',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Đọc bundle bằng sourcemap, tách ba trang ít dùng bằng lazy của React Router (489 → ≈ 374 kB tải ngay), gỡ barrel kéo zod về file đầu, sửa hai test mà route lười làm đỏ, React.lazy + Suspense, và ảnh loading="lazy" có width/height (200 → 57 ảnh, CLS 0,348 → 0).',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Code splitting and lazy loading: routes, Suspense, the barrel trap, and images</h2>
<p class="lead">Lessons 8.1–8.2 were about work done <em>after</em> the page loaded. This one is about the page loading at all. Every visitor to the clinic's home page currently downloads the code for the booking form, its validation library and the login page, whether they book or not. You will find out exactly what is inside the bundle, move three rarely visited pages into their own files, discover why the first attempt barely helped, fix two tests that lazy routes turn red, and finish with the cheapest win on most real sites: images.</p>
<p>Measured on 26/09/2026 with Vite 8.3.1 (Rolldown inside), React Router 8.4.0, React 19.3.0, Vitest 5.0.2, and Chromium 149 through Playwright. Sizes are the numbers <code>vite build</code> prints: minified, then gzip in the second column.</p>

<h3>What is in the bundle — measure before splitting</h3>
${slide('rx-08', 16, 'One 489 kB JS file for every page — 110 kB only the form needs')}
<p>At the end of Chapter 7, <code>npx vite build</code> prints:</p>
${out(OUT.buildTruoc)}
<p>Two JavaScript files. <code>index-*.js</code> (489 kB, 153 kB gzipped) is the app. <code>browser-*.js</code> (426 kB) is MSW, the fake API, and it is already a <strong>separate</strong> file: <code>main.tsx</code> loads it with <code>await import('./mocks/browser')</code> (Chapter 6). That <code>import()</code> is the whole idea of code splitting — a dynamic import tells the bundler "this can come later, in its own file".</p>
<p>The size alone says nothing about what to split. A bundle is made of modules, and the source map (<code>vite build --sourcemap</code>) records which source file every piece of the output came from. The small script <code>do/phan-tich-bundle.mjs</code> adds the bytes up per npm package:</p>
${pre('js', SN.phanTich)}
${out(OUT.bundleTruoc)}
<p>Now the picture is clear. <code>react-dom</code>, <code>react-router</code> and TanStack Query are needed by every page. But <strong>zod (77.4 kB) + react-hook-form (29.8 kB) + @hookform/resolvers (3.3 kB) ≈ 110 kB</strong> exist only for the booking form on <code>/dat-lich/:khungGioId</code> — a page most visitors never open.</p>
<div class="callout"><p><strong>JS quick reminder — static and dynamic <code>import</code>.</strong> <code>import { x } from './a'</code> at the top of a file is <em>static</em>: the bundler puts <code>a</code> in the same bundle, because the code needs it before running. <code>await import('./a')</code> inside a function is <em>dynamic</em>: it returns a <code>Promise</code> of the module, loaded only when that line runs; the bundler moves <code>a</code> (and whatever only <code>a</code> uses) into a separate file, a <strong>chunk</strong>.</p></div>

<h3>Lazy routes: one <code>import()</code> per page</h3>
${slide('rx-08', 17, 'import() inside a lazy function is a cut point: one file per page')}
<p>React Router (8.4, Data mode) lets a route load its component on demand with the <code>lazy</code> property. The object form names each thing to load; React Router calls the function the first time someone navigates there. The app's route table becomes a function (the next sections explain why):</p>
${pre('tsx', SN.router)}
<p>The first build after this change:</p>
${out(OUT.buildLazyBarrel)}
<p>Three page chunks appeared (0.6–1.8 kB each), and <code>index</code> shrank to 344.67 kB… but zod and react-hook-form are still <strong>inside it</strong>, and the generated <code>index.html</code> preloads four shared chunks with it (<code>duong-dan</code> 87.17 + <code>thoi-gian</code> 43.76 + <code>bac-si</code> 10.83 + <code>useTieuDeTrang</code> 2.68 kB). Up-front total: <strong>489.13 kB — the same as before</strong>. The bundler only rearranged the shared libraries into more files; splitting the routes did not split the libraries.</p>

<h3>The barrel that pulled zod back into the first file</h3>
${slide('rx-08', 18, 'A barrel pulls zod back into the first file — lazy routes cannot help')}
<p>Chapter 7 gave each feature one "door", <code>index.ts</code>, re-exporting everything. The doctor detail page — loaded immediately — imports <code>ChonKhungGio</code> through <code>@/features/dat-lich</code>. That same door also re-exports <code>FormDatLich</code> and <code>datLichSchema</code>. A re-export is a static import, so the moment the detail page imports the door, the form module, react-hook-form and zod become static dependencies of the first file. The lazy <code>import()</code> of <code>TrangDatLich</code> then finds them already loaded.</p>
<p>The fix keeps the "one door" rule but gives the feature two doors — a light one for what pages load immediately, a heavy one for the form:</p>
${pre('ts', SN.cuaNhe)}
${pre('ts', SN.cuaNang)}
<p><code>TrangDatLich</code> (lazy) and the fake server import from <code>@/features/dat-lich/form</code>; the detail page keeps importing the light door. Rebuild:</p>
${out(OUT.buildSau)}
${out(OUT.bundleSau)}
${SD.bundleEn}
<p><code>index</code> dropped from 489.26 kB to 230.11 kB; zod and react-hook-form now live in <code>form-*.js</code>. The generated <code>index.html</code> shows what the browser loads up front — the entry plus three shared chunks announced with <code>&lt;link rel="modulepreload"&gt;</code> so they download in parallel:</p>
${out(OUT.indexHtml)}
<p>Static JavaScript at start-up: ≈ 374 kB instead of 489 kB (−23%). The shared chunk names (<code>thoi-gian-*</code>, <code>useTieuDeTrang-*</code>) are picked by the bundler after one module inside them; they mean nothing — do not try to read architecture from them.</p>
<div class="pitfall co-tieu-de"><strong>Trap — "I made the route lazy, so its libraries are lazy too".</strong> Code splitting follows the module graph, not your intentions. One static re-export from a barrel imported by an eager page is enough to pull a whole library into the first file. After every splitting change, read the build output (or the sourcemap breakdown) — the first attempt here moved 145 kB between files and saved 0.1 kB of what the browser downloads up front.</div>

<h3>In Chromium: which files load, and when</h3>
<p>The script <code>do/do-lazy.mjs</code> opens <code>/bac-si/bs-2</code> (logged in), lists every JS file downloaded, then clicks "14:00" five times (reloading the doctor page in between) and times how long until "Đặt lịch khám" appears. <code>?tre=0</code> removes the fake API's random 100–400 ms delay so the timing is about code, not about the mock:</p>
${out(OUT.lazyChromTruoc)}
${out(OUT.lazyChromSau)}
<p>Two honest observations:</p>
<ol>
<li><strong>In this app, the total is the same (915 kB).</strong> The fake server needs <code>datLichSchema</code> to validate bookings, so MSW's chunk imports <code>form-*.js</code> at start-up anyway. With a real API (Chapter 14 removes MSW from production) that file would only load on <code>/dat-lich</code>. The split is correct; this particular development setup hides its benefit.</li>
<li><strong>Navigation got a little slower the first time</strong> (72 → 92 ms, median 42 → 46 ms): the 1.8 kB page chunk is an extra request before the page can render. On a local server that is nothing; on a slow network it is a full round trip, which is why the next section adds a visible "loading" state.</li>
</ol>
${SD.lazyRouteEn}
<p>(A caveat about the measurement: network throttling through the DevTools protocol did not slow these navigations down — with 1000 ms of added latency the median stayed at 48 ms. The most likely reason is that every request of this app passes through MSW's Service Worker, while throttling is applied to the page. Treat the timings above as "fast network" numbers.)</p>

<h3>What lazy routes change in tests — two red tests</h3>
${slide('rx-08', 19, 'Lazy routes change two behaviours the old tests relied on')}
<p>After the change, three of the eleven Chapter 7 tests failed. The first failure:</p>
${out(OUT.lazyTestDo)}
<p>The test clicked the link and immediately read the URL. With a lazy route, React Router first loads the page's code; while it loads, <code>navigation.state</code> is <code>"loading"</code>, <strong>the old page stays on screen and the location has not changed yet</strong>. The fix is to wait for what the user waits for — the new heading — and only then check the URL:</p>
${pre('tsx', SN.testSuaLazy)}
<p>The other two failures looked unrelated — "Unable to find heading 'Đăng nhập'", with a "404 Not Found" page on screen — and passed when run alone. A small experiment printed the <code>dang-nhap</code> route object before and after one test:</p>
${out(OUT.lazyMutate)}
<p>React Router <strong>writes into the route objects you pass it</strong>: after loading a lazy route, it removes the loaded keys from your <code>lazy</code> object. The app creates one router, so it never notices. The tests create a new router per test from the same array — the second router receives <code>lazy: {}</code> with no component and the route no longer matches. That is why <code>router.tsx</code> now exports <code>taoRoutes()</code>, a function that builds a fresh array on every call, and the test helper uses it:</p>
${pre('tsx', SN.veTrang)}
<div class="pitfall co-tieu-de"><strong>Trap — tests that pass alone and fail together.</strong> When a test is green with <code>-t "its name"</code> and red in the full run, something is shared between tests: a module-level variable, a store, <code>localStorage</code>, or — as here — an object a library mutated. Print the shared object before and after one test; do not add <code>waitFor</code> and retries until it goes green.</div>
<p>While the chunk loads, the user should see that something is happening. <code>useNavigation()</code> exposes the router's state, so the layout shows a bar for the duration of any lazy navigation:</p>
${pre('tsx', SN.khungTrangCho)}
<p>In the five Chromium navigations above, the bar was visible twice — on the fast local server the chunk usually arrives before a frame is painted. <code>role="status"</code> makes screen readers announce it (Lesson 8.4).</p>

<h3><code>React.lazy</code> + <code>&lt;Suspense&gt;</code>: splitting a piece of a page</h3>
${slide('rx-08', 20, 'React.lazy: declare at module level, never inside a component')}
<p>Routes are the natural cut points, but any heavy, rarely opened piece can be split: a chart, a rich-text editor, a map, a long "how to prepare" guide. React's own tool is <code>lazy()</code> — the component is loaded on first render — combined with <code>&lt;Suspense fallback&gt;</code>, which shows something while it loads:</p>
${pre('tsx', SN.bai3)}
${pre('tsx', SN.bai3Test)}
${out(OUT.bai3)}
<p>The first test shows the normal flow: click, "Đang tải hướng dẫn…" (the fallback) immediately, content about 400 ms later (300 ms of simulated delay plus the import). The two other tests are the classic mistake. <code>lazy()</code> creates a new <em>component type</em> each time it is called. Called inside a component, every re-render produces a different type, so React unmounts the old content, shows the fallback again and mounts a new one: three unrelated clicks, three flashes of "Đang tải…" and any state inside the guide lost each time.</p>
<p>React Router's <code>lazy</code> does not need a <code>&lt;Suspense&gt;</code>: the router waits for the code before rendering the route. <code>React.lazy</code> always needs a <code>&lt;Suspense&gt;</code> above it (without one, React has nowhere to show the waiting state).</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202 the project is built with Create React App (<code>npm run build</code>) and deployed as whatever bundle comes out; if code splitting appears, it is <code>React.lazy</code> copied from the docs for one component. → At work, the build is Vite, routes are split in the route table, bundle size is checked in CI (a size budget or a bundle report on each pull request), and images come with dimensions and <code>loading="lazy"</code>. · <em>Why:</em> start-up JavaScript is paid by every visitor on every device; a regression is invisible on a developer's laptop. CRA was officially deprecated in February 2025 — you will still meet it in older projects, where <code>React.lazy</code> + <code>Suspense</code> works exactly as shown here.</p></div>

<h3>Images: <code>loading="lazy"</code> — and never without width and height</h3>
${slide('rx-08', 21, 'Lazy images: 57 instead of 200 — if they have width/height')}
<p>On most real sites images weigh more than all the JavaScript. The experiment page <code>anh.html</code> renders the 200 doctors with a 320×320 JPEG avatar each (17.9 kB on average, 3.6 MB total), in three variants, and Chromium counts what is downloaded when the page opens and after scrolling to the end. It also sums <strong>layout shift</strong> (the browser's <code>layout-shift</code> entries: how much visible content moved without user input) — the raw material of CLS, Cumulative Layout Shift, where ≤ 0.1 is "good" and &gt; 0.25 is "poor":</p>
${pre('tsx', SN.anhBacSi)}
${out(OUT.anh)}
${SD.anhEn}
<ul>
<li><strong>Eager</strong> (the default): all 200 images, 3.6 MB, downloaded before the user scrolls — most of them are never seen.</li>
<li><strong>Lazy with <code>width</code>/<code>height</code></strong>: 57 images, 1 MB — the ones on or near the screen; the rest arrive while scrolling. No layout shift, because each <code>&lt;img&gt;</code> reserves its 96×96 box before the file arrives.</li>
<li><strong>Lazy without dimensions</strong>: 111 images and a CLS of <strong>0.348</strong> ("poor"). An image that has not loaded is 0 px tall, so many more cards fit into the "near the viewport" zone and get loaded; then each arriving image pushes the text below it down.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Trap — lazy-loading the image at the top of the page.</strong> <code>loading="lazy"</code> delays an image until layout says it is near the viewport. For the first visible image (a banner, the doctor's photo on the detail page) that delay makes the page's main content appear <em>later</em> — it hurts LCP (Largest Contentful Paint). Leave above-the-fold images eager; for the single most important one, <code>fetchpriority="high"</code> asks the browser to fetch it first.</div>
<p><code>alt=""</code> in the code is deliberate: the avatar is decorative, the doctor's name is right next to it, so screen readers should skip the image instead of reading "image" 200 times. Lesson 8.4 is about exactly this kind of decision.</p>

<h3>When to split — and when not to</h3>
<ul>
<li><strong>Split</strong> routes most visitors never open (booking form, account pages, admin), heavy optional widgets (charts, editors, maps), and anything behind a login.</li>
<li><strong>Do not split</strong> the page almost everyone lands on, or tiny components: a 0.6 kB chunk costs a network round trip and saves nothing. Splitting a component rendered on first paint just adds a waterfall.</li>
<li><strong>Always</strong> read the build output after splitting, check that the library actually moved, and give the user a loading state.</li>
</ul>

<div class="callout"><p><strong>Common interview question.</strong> "What is code splitting and how do you do it in React?"</p>
<p>Instead of one bundle for the whole app, the bundler emits several chunks and the browser downloads each only when needed; the mechanism is dynamic <code>import()</code>. In React: split by route — with React Router's <code>lazy</code> on route objects, or <code>React.lazy</code> + <code>Suspense</code> for components — and split heavy optional widgets. I check the result in the build output or a bundle analyser, because a barrel file or a shared import can pull the library back into the main chunk. The trade-off is an extra request on first navigation, so I show a pending state (<code>useNavigation</code> or a <code>Suspense</code> fallback) and do not split what is needed on first paint. For images: <code>loading="lazy"</code> below the fold, always with width and height to avoid layout shift.</p></div>

<h3>🛠 Keep building the project — step 3/4: lazy pages</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after step 2/4 (<code>src/app/router.tsx</code> exporting <code>routes</code>, <code>src/test/render.tsx</code>, <code>src/features/dat-lich/index.ts</code>, <code>src/app/KhungTrang.tsx</code>, <code>src/mocks/handlers.ts</code>, <code>src/pages/TrangDatLich.tsx</code>).</p><ol>
<li>Record the "before" numbers: <code>npx vite build</code>, and <code>npx vite build --sourcemap --outDir dist-map</code> + the analyser script.</li>
<li>In <code>router.tsx</code>, load <code>TrangDatLich</code>, <code>TrangLichHen</code> and <code>TrangDangNhap</code> with <code>lazy: { Component: async () =&gt; (await import(…)).X }</code>; remove their static imports. Turn the array into <code>taoRoutes()</code> and keep <code>export const routes = taoRoutes()</code> for <code>main.tsx</code>.</li>
<li>Split the feature door: <code>features/dat-lich/index.ts</code> (light) and <code>features/dat-lich/form.ts</code> (form, <code>useDatLich</code>, schema); update <code>TrangDatLich</code> and <code>mocks/handlers.ts</code>.</li>
<li>In <code>test/render.tsx</code>, <code>veTrang</code> uses <code>createMemoryRouter(taoRoutes(), …)</code>.</li>
<li>In <code>KhungTrang</code>, show <code>&lt;p className="dang-mo-trang" role="status"&gt;Đang mở trang…&lt;/p&gt;</code> while <code>useNavigation().state === 'loading'</code>.</li>
<li>Fix the Chapter 7 booking-flow test to wait for the "Đặt lịch khám" heading before checking the URL.</li>
</ol>
<p><strong>Done when:</strong> <code>npx vite build</code> lists <code>TrangDatLich-*.js</code>, <code>TrangLichHen-*.js</code>, <code>TrangDangNhap-*.js</code> and a <code>form-*.js</code> that contains zod (analyser), and <code>index-*.js</code> is under 250 kB; <code>npx vitest run src/app src/features</code> shows 14 tests green, run twice in a row.</p></div>
<details><summary>Solution</summary>
<p>Run on 26/09/2026: <code>npx tsc -b</code> prints nothing; <code>npx vite build</code> gives the output shown in "The barrel that pulled zod back"; 14 tests green. The files, as they ran, are printed above: <strong>src/app/router.tsx</strong> (section "Lazy routes"), <strong>src/features/dat-lich/index.ts</strong> and <strong>form.ts</strong> (section "The barrel…"), <strong>src/test/render.tsx</strong> <code>veTrang</code> and the changed lines of <strong>src/app/router.test.tsx</strong> (section "What lazy routes change in tests"), <strong>src/app/KhungTrang.tsx</strong> (the <code>useNavigation</code> part, same section). The remaining edits are one line each:</p>
<pre><code class="language-ts">// src/pages/TrangDatLich.tsx
import { docNgay, useKhungGio } from '@/features/dat-lich';
import { FormDatLich, useDatLich, type DatLich } from '@/features/dat-lich/form';

// src/mocks/handlers.ts
import { datLichSchema } from '@/features/dat-lich/form';

/* src/app/app.css */
.dang-mo-trang { position: fixed; top: 0; left: 0; right: 0; margin: 0; padding: 4px 12px; background: #fef3c7; color: #78350f; font-size: 14px; text-align: center; z-index: 20; }</code></pre>
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> split one more thing and prove it with numbers.</p><ol>
<li>Make the 404 page (<code>Trang404</code>) lazy as well. Build and note its chunk size.</li>
<li>The Chapter 7 test <code>URL lạ ⇒ trang 404 NẰM TRONG layout</code> uses <code>getByRole</code> right after <code>veTrang</code>. Run the suite and explain the result with the sequence diagram of this lesson; fix the test.</li>
<li>Decide, with the chunk size in front of you, whether the 404 page should stay lazy. Write one sentence in the commit message.</li>
</ol><p><strong>Done when:</strong> the build lists a <code>Trang404-*.js</code> chunk under 1 kB; the 404 test fails before your fix (the heading is not there synchronously) and passes after (<code>findByRole</code>); your sentence mentions the size and the extra request — a sub-1 kB page is a good example of a split that costs more than it saves.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">bundle / chunk</span><span class="v">the JS files the build outputs; a chunk is one of several files the app is split into</span></div>
<div class="kv"><span class="k">code splitting (chia nhỏ bundle)</span><span class="v">emitting several chunks so the browser loads code only when needed; the mechanism is dynamic <code>import()</code></span></div>
<div class="kv"><span class="k">lazy route</span><span class="v">a route whose component (loader, …) is loaded on first navigation — React Router's <code>lazy</code> property</span></div>
<div class="kv"><span class="k"><code>React.lazy</code> + <code>Suspense</code></span><span class="v">load a component on first render; <code>Suspense</code> shows a fallback meanwhile</span></div>
<div class="kv"><span class="k">barrel file</span><span class="v">an <code>index.ts</code> that re-exports a folder; convenient, but every re-export is a static import</span></div>
<div class="kv"><span class="k">modulepreload</span><span class="v"><code>&lt;link rel="modulepreload"&gt;</code> in the generated HTML: download these chunks in parallel, early</span></div>
<div class="kv"><span class="k">CLS (Cumulative Layout Shift)</span><span class="v">how much visible content jumps while loading; good ≤ 0.1, poor &gt; 0.25</span></div>
<div class="kv"><span class="k">LCP (Largest Contentful Paint)</span><span class="v">when the main content (often the top image) is painted — do not lazy-load it</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Measure the bundle by package (sourcemap): zod + react-hook-form ≈ 110 kB were in the first file for a page most visitors never open.</li>
<li>React Router's <code>lazy</code> on three routes, plus splitting the feature's barrel into a light and a heavy door: <code>index</code> 489 → 230 kB, ≈ 374 kB loaded up front instead of 489.</li>
<li>A barrel imported by an eager page pulls its re-exports into the first file — the first attempt left zod exactly where it was.</li>
<li>Lazy routes change behaviour: the URL changes only after the chunk loads (tests must wait), and React Router mutates your route objects (build fresh routes per router).</li>
<li><code>React.lazy</code> at module level with a <code>Suspense</code> fallback; declared inside a component it flashes "loading" on every render (3 of 3 clicks).</li>
<li>Images: <code>loading="lazy"</code> loaded 57 instead of 200 (1 MB instead of 3.6 MB); without width/height: 111 images and CLS 0.348.</li>
</ul>

${LINK('https://react.dev/reference/react/lazy', '📄', 'react.dev — lazy', 'Declaring lazy components, and why at the top level.')}
${LINK('https://react.dev/reference/react/Suspense', '📄', 'react.dev — &lt;Suspense&gt;', 'Fallbacks, nested boundaries, what re-suspends.')}
${LINK('https://reactrouter.com/start/data/route-object', '🧭', 'React Router — Route object', 'The lazy property in Data mode.')}
${LINK('https://vite.dev/guide/build', '⚡', 'Vite — Building for production', 'Chunks, modulepreload, build output.')}
${LINK('https://web.dev/articles/browser-level-image-lazy-loading', '🖼', 'web.dev — Browser-level image lazy loading', 'loading="lazy", distance thresholds, dimensions.')}
${LINK('https://web.dev/articles/cls', '📏', 'web.dev — Cumulative Layout Shift', 'What CLS measures and the 0.1 / 0.25 thresholds.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Chia nhỏ bundle và tải lười: route, Suspense, bẫy barrel và ảnh</h2>
<p class="lead">Bài 8.1–8.2 bàn về việc xảy ra <em>sau</em> khi trang đã tải. Bài này bàn về chính việc tải trang. Hiện giờ mọi người vào trang chủ phòng khám đều tải về mã của form đặt lịch, thư viện kiểm dữ liệu của nó và trang đăng nhập, dù họ có đặt lịch hay không. Bạn sẽ biết chính xác bên trong bundle có gì, dời ba trang ít người vào sang file riêng, phát hiện vì sao lần thử đầu gần như không đỡ, sửa hai test bị route lười (lazy) làm đỏ, và kết thúc bằng món lời rẻ nhất trên hầu hết các trang thật: ảnh.</p>
<p>Đo ngày 26/09/2026 với Vite 8.3.1 (bên trong là Rolldown), React Router 8.4.0, React 19.3.0, Vitest 5.0.2, và Chromium 149 qua Playwright. Kích thước là số <code>vite build</code> in ra: đã rút gọn (minify), cột thứ hai là sau khi nén gzip.</p>

<h3>Bundle có gì — đo trước khi chia</h3>
${slide('rx-08', 16, 'Một file JS 489 kB cho mọi trang — 110 kB chỉ form cần')}
<p>Hết Chương 7, <code>npx vite build</code> in ra:</p>
${out(OUT.buildTruoc)}
<p>Hai file JavaScript. <code>index-*.js</code> (489 kB, 153 kB sau gzip) là app. <code>browser-*.js</code> (426 kB) là MSW, API giả, và nó <strong>đã là file riêng</strong>: <code>main.tsx</code> nạp nó bằng <code>await import('./mocks/browser')</code> (Chương 6). Cái <code>import()</code> đó chính là toàn bộ ý tưởng của code splitting (chia nhỏ bundle) — import động bảo bundler "cái này để sau cũng được, cho nó ra file riêng".</p>
<p>Chỉ nhìn kích thước thì không biết nên chia gì. Bundle được ghép từ các module, và source map (<code>vite build --sourcemap</code>) ghi lại mỗi đoạn output đến từ file nguồn nào. Script nhỏ <code>do/phan-tich-bundle.mjs</code> cộng số byte theo từng gói npm:</p>
${pre('js', SN.phanTich)}
${out(OUT.bundleTruoc)}
<p>Giờ bức tranh rõ ràng. <code>react-dom</code>, <code>react-router</code> và TanStack Query trang nào cũng cần. Nhưng <strong>zod (77,4 kB) + react-hook-form (29,8 kB) + @hookform/resolvers (3,3 kB) ≈ 110 kB</strong> chỉ phục vụ form đặt lịch ở <code>/dat-lich/:khungGioId</code> — trang mà đa số người vào không bao giờ mở.</p>
<div class="callout"><p><strong>JS nhắc nhanh — <code>import</code> tĩnh và động.</strong> <code>import { x } from './a'</code> ở đầu file là <em>tĩnh</em>: bundler cho <code>a</code> vào cùng bundle, vì code cần nó trước khi chạy. <code>await import('./a')</code> trong một hàm là <em>động</em>: nó trả về một <code>Promise</code> của module, chỉ tải khi dòng đó chạy; bundler dời <code>a</code> (và những gì chỉ <code>a</code> dùng) sang một file riêng, gọi là <strong>chunk</strong>.</p></div>

<h3>Route lười: mỗi trang một <code>import()</code></h3>
${slide('rx-08', 17, 'import() trong hàm lazy là một điểm cắt: mỗi trang một file')}
<p>React Router (8.4, Data mode) cho một route tự tải component khi cần bằng thuộc tính <code>lazy</code>. Dạng object ghi rõ từng thứ cần tải; React Router gọi hàm lần đầu có người điều hướng tới đó. Bảng route của app thành một hàm (các mục sau giải thích vì sao):</p>
${pre('tsx', SN.router)}
<p>Lần build đầu sau thay đổi này:</p>
${out(OUT.buildLazyBarrel)}
<p>Có thêm ba chunk trang (0,6–1,8 kB mỗi file), <code>index</code> co lại còn 344,67 kB… nhưng zod và react-hook-form vẫn <strong>nằm trong nó</strong>, và <code>index.html</code> sinh ra tải kèm bốn chunk dùng chung bằng modulepreload (<code>duong-dan</code> 87,17 + <code>thoi-gian</code> 43,76 + <code>bac-si</code> 10,83 + <code>useTieuDeTrang</code> 2,68 kB). Tổng tải ngay: <strong>489,13 kB — y như trước</strong>. Bundler chỉ xếp lại các thư viện dùng chung sang nhiều file hơn; chia route không kéo theo chia thư viện.</p>

<h3>Cái barrel kéo zod về lại file đầu</h3>
${slide('rx-08', 18, 'Barrel kéo zod về file đầu — lazy route cũng không cứu được')}
<p>Chương 7 cho mỗi tính năng một "cửa" <code>index.ts</code> re-export mọi thứ. Trang chi tiết bác sĩ — tải ngay từ đầu — import <code>ChonKhungGio</code> qua <code>@/features/dat-lich</code>. Cũng cửa đó re-export <code>FormDatLich</code> và <code>datLichSchema</code>. Re-export là một import tĩnh, nên ngay khi trang chi tiết import cửa đó, module form, react-hook-form và zod trở thành phụ thuộc tĩnh của file đầu. Lúc <code>import()</code> lười của <code>TrangDatLich</code> chạy, chúng đã có sẵn rồi.</p>
<p>Cách sửa giữ nguyên luật "một cửa" nhưng cho tính năng hai cửa — cửa nhẹ cho thứ các trang tải ngay cần, cửa nặng cho form:</p>
${pre('ts', SN.cuaNhe)}
${pre('ts', SN.cuaNang)}
<p><code>TrangDatLich</code> (lười) và máy chủ giả import từ <code>@/features/dat-lich/form</code>; trang chi tiết vẫn đi cửa nhẹ. Build lại:</p>
${out(OUT.buildSau)}
${out(OUT.bundleSau)}
${SD.bundleVi}
<p><code>index</code> từ 489,26 kB xuống 230,11 kB; zod và react-hook-form giờ nằm trong <code>form-*.js</code>. File <code>index.html</code> sinh ra cho thấy trình duyệt tải gì ngay từ đầu — file vào cộng ba chunk dùng chung, báo trước bằng <code>&lt;link rel="modulepreload"&gt;</code> để tải song song:</p>
${out(OUT.indexHtml)}
<p>JavaScript tĩnh lúc mở app: ≈ 374 kB thay vì 489 kB (−23%). Tên các chunk dùng chung (<code>thoi-gian-*</code>, <code>useTieuDeTrang-*</code>) do bundler đặt theo một module nằm trong đó; chúng không mang ý nghĩa gì — đừng cố đọc kiến trúc từ tên file.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — "route đã lười thì thư viện của nó cũng lười".</strong> Việc chia bundle đi theo đồ thị module, không đi theo ý định của bạn. Chỉ một re-export tĩnh trong barrel mà một trang tải ngay có import là đủ kéo nguyên một thư viện vào file đầu. Sau mỗi thay đổi về chia bundle, hãy đọc output của build (hoặc bảng theo gói từ sourcemap) — lần thử đầu ở đây dời 145 kB từ file này sang file khác và bớt được 0,1 kB thứ trình duyệt phải tải ngay.</div>

<h3>Trong Chromium: file nào tải, tải lúc nào</h3>
<p>Script <code>do/do-lazy.mjs</code> mở <code>/bac-si/bs-2</code> (đã đăng nhập), liệt kê mọi file JS tải về, rồi bấm "14:00" năm lần (giữa các lần tải lại trang bác sĩ) và đo bao lâu thì "Đặt lịch khám" hiện ra. <code>?tre=0</code> bỏ độ trễ ngẫu nhiên 100–400 ms của API giả để thời gian đo là của mã, không phải của mock:</p>
${out(OUT.lazyChromTruoc)}
${out(OUT.lazyChromSau)}
<p>Hai nhận xét thật thà:</p>
<ol>
<li><strong>Trong app này, tổng vẫn như cũ (915 kB).</strong> Máy chủ giả cần <code>datLichSchema</code> để kiểm yêu cầu đặt lịch, nên chunk của MSW import <code>form-*.js</code> ngay lúc khởi động. Với API thật (Chương 14 bỏ MSW khỏi production) file đó chỉ tải khi vào <code>/dat-lich</code>. Cách chia là đúng; riêng cấu hình phát triển này che mất lợi ích của nó.</li>
<li><strong>Lần điều hướng đầu chậm hơn một chút</strong> (72 → 92 ms, trung vị 42 → 46 ms): chunk 1,8 kB là thêm một request trước khi trang render được. Máy chủ ở máy mình thì không đáng kể; trên mạng chậm đó là cả một vòng đi-về, vì vậy mục sau thêm trạng thái "đang tải" nhìn thấy được.</li>
</ol>
${SD.lazyRouteVi}
<p>(Một lưu ý về phép đo: làm chậm mạng qua giao thức DevTools không làm chậm các lần điều hướng này — thêm 1000 ms độ trễ mà trung vị vẫn 48 ms. Lý do nhiều khả năng nhất là mọi request của app đi qua Service Worker của MSW, trong khi việc làm chậm áp cho trang. Hãy coi các số trên là số của "mạng nhanh".)</p>

<h3>Route lười đổi gì trong test — hai test đỏ</h3>
${slide('rx-08', 19, 'Route lazy đổi hai hành vi mà test cũ đang dựa vào')}
<p>Sau thay đổi, ba trong mười một test của Chương 7 đỏ. Lỗi thứ nhất:</p>
${out(OUT.lazyTestDo)}
<p>Test bấm link rồi đọc URL ngay. Với route lười, React Router tải mã của trang trước; trong lúc tải, <code>navigation.state</code> là <code>"loading"</code>, <strong>trang cũ vẫn hiện và location chưa đổi</strong>. Cách sửa là đợi đúng thứ người dùng đợi — tiêu đề trang mới — rồi mới kiểm URL:</p>
${pre('tsx', SN.testSuaLazy)}
<p>Hai lỗi còn lại trông chẳng liên quan — "Unable to find heading 'Đăng nhập'", màn hình hiện trang "404 Not Found" — và chạy riêng từng test thì xanh. Một thí nghiệm nhỏ in object route <code>dang-nhap</code> trước và sau một test:</p>
${out(OUT.lazyMutate)}
<p>React Router <strong>ghi vào chính các object route bạn đưa cho nó</strong>: tải xong một route lười, nó xoá các khoá đã tải khỏi object <code>lazy</code> của bạn. App chỉ tạo một router nên không bao giờ thấy. Test thì tạo router mới cho mỗi test từ cùng một mảng — router thứ hai nhận <code>lazy: {}</code>, không có component, và route không còn khớp. Vì vậy <code>router.tsx</code> giờ export <code>taoRoutes()</code>, một hàm dựng mảng mới mỗi lần gọi, và helper của test dùng nó:</p>
${pre('tsx', SN.veTrang)}
<div class="pitfall co-tieu-de"><strong>Bẫy — test chạy riêng thì xanh, chạy chung thì đỏ.</strong> Khi một test xanh với <code>-t "tên nó"</code> mà đỏ trong lần chạy cả bộ, nghĩa là có thứ gì dùng chung giữa các test: một biến cấp module, một store, <code>localStorage</code>, hay — như ở đây — một object bị thư viện sửa. In object dùng chung ra trước và sau một test; đừng thêm <code>waitFor</code> và thử lại tới khi nó xanh.</div>
<p>Trong lúc chunk đang tải, người dùng cần thấy có chuyện đang xảy ra. <code>useNavigation()</code> cho biết trạng thái của router, nên layout hiện một thanh báo suốt mọi lần điều hướng lười:</p>
${pre('tsx', SN.khungTrangCho)}
<p>Trong năm lần điều hướng ở Chromium bên trên, thanh này hiện 2 lần — với máy chủ ở máy mình, chunk thường về trước khi kịp vẽ một khung hình. <code>role="status"</code> để trình đọc màn hình đọc nó lên (Bài 8.4).</p>

<h3><code>React.lazy</code> + <code>&lt;Suspense&gt;</code>: chia một phần của trang</h3>
${slide('rx-08', 20, 'React.lazy: khai ở cấp module, không khai trong component')}
<p>Route là chỗ cắt tự nhiên, nhưng phần nào nặng mà ít người mở đều chia được: biểu đồ, trình soạn thảo, bản đồ, một hướng dẫn "chuẩn bị trước khi khám" dài. Công cụ của chính React là <code>lazy()</code> — component được tải ở lần render đầu — kết hợp <code>&lt;Suspense fallback&gt;</code> để hiện gì đó trong lúc tải:</p>
${pre('tsx', SN.bai3)}
${pre('tsx', SN.bai3Test)}
${out(OUT.bai3)}
<p>Test đầu cho thấy luồng bình thường: bấm, "Đang tải hướng dẫn…" (fallback) hiện ngay, nội dung khoảng 400 ms sau (300 ms trễ giả lập cộng việc import). Hai test sau là lỗi kinh điển. <code>lazy()</code> tạo ra một <em>loại component</em> mới mỗi lần được gọi. Gọi trong component thì mỗi lần render lại ra một loại khác, nên React gỡ nội dung cũ, hiện lại fallback và dựng cái mới: ba cú bấm chẳng liên quan, ba lần nháy "Đang tải…", và state bên trong phần hướng dẫn mất sạch mỗi lần.</p>
<p><code>lazy</code> của React Router không cần <code>&lt;Suspense&gt;</code>: router tự đợi có mã rồi mới render route. <code>React.lazy</code> thì luôn cần một <code>&lt;Suspense&gt;</code> ở phía trên (không có thì React không có chỗ nào để hiện trạng thái chờ).</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202, dự án dựng bằng Create React App (<code>npm run build</code>) và deploy nguyên bundle ra sao thì để vậy; nếu có chia bundle thì là <code>React.lazy</code> chép từ tài liệu cho một component. → Đi làm, build bằng Vite, route được chia ngay trong bảng route, kích thước bundle được kiểm trong CI (ngân sách kích thước hoặc báo cáo bundle trên mỗi pull request), và ảnh luôn có kích thước kèm <code>loading="lazy"</code>. · <em>Vì sao:</em> JavaScript lúc khởi động là thứ mọi người dùng trên mọi thiết bị đều phải trả; trên laptop của lập trình viên thì một lần phình ra là vô hình. CRA chính thức bị khai tử tháng 2/2025 — bạn vẫn sẽ gặp nó trong dự án cũ, và ở đó <code>React.lazy</code> + <code>Suspense</code> chạy đúng như trong bài.</p></div>

<h3>Ảnh: <code>loading="lazy"</code> — và không bao giờ thiếu width, height</h3>
${slide('rx-08', 21, 'Ảnh lazy: 57 thay vì 200 ảnh — nếu có width/height')}
<p>Trên đa số trang thật, ảnh nặng hơn toàn bộ JavaScript. Trang thí nghiệm <code>anh.html</code> vẽ 200 bác sĩ, mỗi người một ảnh JPEG 320×320 (trung bình 17,9 kB, tổng 3,6 MB), theo ba biến thể, và Chromium đếm thứ được tải khi mở trang và sau khi cuộn hết. Nó cũng cộng dồn <strong>layout shift</strong> (các mục <code>layout-shift</code> của trình duyệt: nội dung đang thấy bị xô đi bao nhiêu khi người dùng không làm gì) — nguyên liệu của CLS, Cumulative Layout Shift, trong đó ≤ 0,1 là "tốt" và &gt; 0,25 là "kém":</p>
${pre('tsx', SN.anhBacSi)}
${out(OUT.anh)}
${SD.anhVi}
<ul>
<li><strong>Eager</strong> (mặc định): cả 200 ảnh, 3,6 MB, tải trước khi người dùng kịp cuộn — phần lớn không bao giờ được nhìn.</li>
<li><strong>Lazy có <code>width</code>/<code>height</code></strong>: 57 ảnh, 1 MB — những ảnh trên hoặc gần màn hình; phần còn lại tới khi cuộn. Không xô lệch, vì mỗi <code>&lt;img&gt;</code> giữ sẵn ô 96×96 trước khi file về.</li>
<li><strong>Lazy thiếu kích thước</strong>: 111 ảnh và CLS <strong>0,348</strong> ("kém"). Ảnh chưa tải cao 0 px, nên nhiều thẻ hơn chen được vào vùng "gần màn hình" và bị tải; rồi mỗi ảnh về lại đẩy chữ bên dưới xuống.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Bẫy — cho ảnh đầu trang tải lười.</strong> <code>loading="lazy"</code> hoãn ảnh tới khi bố cục cho biết nó gần màn hình. Với ảnh đầu tiên người dùng nhìn thấy (banner, ảnh bác sĩ ở trang chi tiết), việc hoãn đó làm nội dung chính của trang hiện <em>muộn hơn</em> — hại LCP (Largest Contentful Paint). Để các ảnh ở phần đầu trang tải bình thường; riêng ảnh quan trọng nhất có thể thêm <code>fetchpriority="high"</code> để trình duyệt ưu tiên tải trước.</div>
<p><code>alt=""</code> trong code là cố ý: ảnh đại diện chỉ để trang trí, tên bác sĩ nằm ngay bên cạnh, nên trình đọc màn hình nên bỏ qua ảnh thay vì đọc "hình ảnh" 200 lần. Bài 8.4 bàn đúng loại quyết định này.</p>

<h3>Khi nào nên chia — và khi nào không</h3>
<ul>
<li><strong>Chia</strong> các route đa số người không mở (form đặt lịch, trang tài khoản, trang quản trị), các widget nặng không bắt buộc (biểu đồ, trình soạn thảo, bản đồ), và mọi thứ nằm sau đăng nhập.</li>
<li><strong>Đừng chia</strong> trang mà gần như ai cũng vào đầu tiên, hay các component tí hon: một chunk 0,6 kB tốn một vòng mạng mà không tiết kiệm gì. Chia một component vẽ ngay ở khung hình đầu chỉ thêm một thác request.</li>
<li><strong>Luôn</strong> đọc output của build sau khi chia, kiểm xem thư viện có thật sự dời đi không, và cho người dùng thấy trạng thái đang tải.</li>
</ul>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Code splitting là gì, làm trong React thế nào?"</p>
<p>Thay vì một bundle cho cả app, bundler xuất nhiều chunk và trình duyệt chỉ tải chunk khi cần; cơ chế là <code>import()</code> động. Trong React: chia theo route — bằng <code>lazy</code> của React Router trên object route, hoặc <code>React.lazy</code> + <code>Suspense</code> cho component — và chia các widget nặng không bắt buộc. Em kiểm kết quả bằng output của build hoặc công cụ phân tích bundle, vì một file barrel hay một import dùng chung có thể kéo thư viện về lại chunk chính. Cái giá là thêm một request ở lần điều hướng đầu, nên em hiện trạng thái chờ (<code>useNavigation</code> hoặc fallback của <code>Suspense</code>) và không chia những gì cần ngay ở khung hình đầu. Với ảnh: <code>loading="lazy"</code> cho ảnh dưới màn hình đầu, luôn kèm width và height để trang không nhảy.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 3/4: tải lười các trang</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau bước 2/4 (các file <code>src/app/router.tsx</code> đang export <code>routes</code>, <code>src/test/render.tsx</code>, <code>src/features/dat-lich/index.ts</code>, <code>src/app/KhungTrang.tsx</code>, <code>src/mocks/handlers.ts</code>, <code>src/pages/TrangDatLich.tsx</code>).</p><ol>
<li>Ghi số "trước": <code>npx vite build</code>, và <code>npx vite build --sourcemap --outDir dist-map</code> + script phân tích.</li>
<li>Trong <code>router.tsx</code>, tải <code>TrangDatLich</code>, <code>TrangLichHen</code>, <code>TrangDangNhap</code> bằng <code>lazy: { Component: async () =&gt; (await import(…)).X }</code>; bỏ import tĩnh của chúng. Đổi mảng thành hàm <code>taoRoutes()</code> và giữ <code>export const routes = taoRoutes()</code> cho <code>main.tsx</code>.</li>
<li>Tách cửa của tính năng: <code>features/dat-lich/index.ts</code> (nhẹ) và <code>features/dat-lich/form.ts</code> (form, <code>useDatLich</code>, schema); sửa <code>TrangDatLich</code> và <code>mocks/handlers.ts</code>.</li>
<li>Trong <code>test/render.tsx</code>, <code>veTrang</code> dùng <code>createMemoryRouter(taoRoutes(), …)</code>.</li>
<li>Trong <code>KhungTrang</code>, hiện <code>&lt;p className="dang-mo-trang" role="status"&gt;Đang mở trang…&lt;/p&gt;</code> khi <code>useNavigation().state === 'loading'</code>.</li>
<li>Sửa test luồng đặt lịch của Chương 7: đợi tiêu đề "Đặt lịch khám" rồi mới kiểm URL.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>npx vite build</code> liệt kê <code>TrangDatLich-*.js</code>, <code>TrangLichHen-*.js</code>, <code>TrangDangNhap-*.js</code> và một <code>form-*.js</code> có chứa zod (theo script phân tích), còn <code>index-*.js</code> dưới 250 kB; <code>npx vitest run src/app src/features</code> cho 14 test xanh, chạy hai lần liền.</p></div>
<details><summary>Lời giải</summary>
<p>Chạy ngày 26/09/2026: <code>npx tsc -b</code> không in gì; <code>npx vite build</code> ra đúng output ở mục "Cái barrel kéo zod về"; 14 test xanh. Các file, đúng như lúc chạy, đã in ở trên: <strong>src/app/router.tsx</strong> (mục "Route lười"), <strong>src/features/dat-lich/index.ts</strong> và <strong>form.ts</strong> (mục "Cái barrel…"), <code>veTrang</code> trong <strong>src/test/render.tsx</strong> và các dòng đổi của <strong>src/app/router.test.tsx</strong> (mục "Route lười đổi gì trong test"), <strong>src/app/KhungTrang.tsx</strong> (phần <code>useNavigation</code>, cùng mục). Những chỗ còn lại mỗi chỗ một dòng:</p>
<pre><code class="language-ts">// src/pages/TrangDatLich.tsx
import { docNgay, useKhungGio } from '@/features/dat-lich';
import { FormDatLich, useDatLich, type DatLich } from '@/features/dat-lich/form';

// src/mocks/handlers.ts
import { datLichSchema } from '@/features/dat-lich/form';

/* src/app/app.css */
.dang-mo-trang { position: fixed; top: 0; left: 0; right: 0; margin: 0; padding: 4px 12px; background: #fef3c7; color: #78350f; font-size: 14px; text-align: center; z-index: 20; }</code></pre>
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> chia thêm một thứ và chứng minh bằng số.</p><ol>
<li>Cho trang 404 (<code>Trang404</code>) tải lười luôn. Build và ghi kích thước chunk của nó.</li>
<li>Test Chương 7 <code>URL lạ ⇒ trang 404 NẰM TRONG layout</code> dùng <code>getByRole</code> ngay sau <code>veTrang</code>. Chạy bộ test và giải thích kết quả bằng sơ đồ tuần tự của bài; sửa test.</li>
<li>Với kích thước chunk trước mặt, quyết định xem trang 404 có nên tiếp tục lười không. Viết một câu vào commit message.</li>
</ol><p><strong>Đạt khi:</strong> build có chunk <code>Trang404-*.js</code> dưới 1 kB; test 404 đỏ trước khi sửa (tiêu đề chưa có ngay lập tức) và xanh sau khi sửa (<code>findByRole</code>); câu của bạn nhắc tới kích thước và request thêm — một trang dưới 1 kB là ví dụ tốt của việc chia tốn nhiều hơn được.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">bundle / chunk</span><span class="v">các file JS mà build xuất ra; chunk là một trong nhiều file mà app được chia thành</span></div>
<div class="kv"><span class="k">code splitting (chia nhỏ bundle)</span><span class="v">xuất nhiều chunk để trình duyệt chỉ tải mã khi cần; cơ chế là <code>import()</code> động</span></div>
<div class="kv"><span class="k">route lười (lazy route)</span><span class="v">route mà component (loader, …) chỉ được tải ở lần điều hướng đầu — thuộc tính <code>lazy</code> của React Router</span></div>
<div class="kv"><span class="k"><code>React.lazy</code> + <code>Suspense</code></span><span class="v">tải một component ở lần render đầu; <code>Suspense</code> hiện fallback trong lúc chờ</span></div>
<div class="kv"><span class="k">file barrel</span><span class="v">một <code>index.ts</code> re-export cả thư mục; tiện, nhưng mỗi re-export là một import tĩnh</span></div>
<div class="kv"><span class="k">modulepreload</span><span class="v"><code>&lt;link rel="modulepreload"&gt;</code> trong HTML sinh ra: tải sớm, song song các chunk này</span></div>
<div class="kv"><span class="k">CLS (Cumulative Layout Shift)</span><span class="v">nội dung đang thấy nhảy bao nhiêu trong lúc tải; tốt ≤ 0,1, kém &gt; 0,25</span></div>
<div class="kv"><span class="k">LCP (Largest Contentful Paint)</span><span class="v">lúc nội dung chính (thường là ảnh đầu trang) được vẽ — đừng cho nó tải lười</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đo bundle theo từng gói (sourcemap): zod + react-hook-form ≈ 110 kB nằm trong file đầu cho một trang mà đa số người không mở.</li>
<li><code>lazy</code> của React Router cho ba route, cộng tách barrel của tính năng thành cửa nhẹ và cửa nặng: <code>index</code> 489 → 230 kB, tải ngay ≈ 374 kB thay vì 489.</li>
<li>Một barrel được trang tải-ngay import sẽ kéo mọi thứ nó re-export vào file đầu — lần thử đầu để zod nằm nguyên chỗ cũ.</li>
<li>Route lười đổi hành vi: URL chỉ đổi sau khi chunk về (test phải đợi), và React Router sửa object route của bạn (mỗi router một bảng route mới).</li>
<li><code>React.lazy</code> khai ở cấp module, có fallback <code>Suspense</code>; khai trong component là nháy "đang tải" ở mỗi lần render (3/3 cú bấm).</li>
<li>Ảnh: <code>loading="lazy"</code> tải 57 thay vì 200 ảnh (1 MB thay vì 3,6 MB); thiếu width/height: 111 ảnh và CLS 0,348.</li>
</ul>

${LINK('https://react.dev/reference/react/lazy', '📄', 'react.dev — lazy', 'Khai component lười, và vì sao phải ở cấp cao nhất.')}
${LINK('https://react.dev/reference/react/Suspense', '📄', 'react.dev — &lt;Suspense&gt;', 'Fallback, boundary lồng nhau, khi nào treo lại.')}
${LINK('https://reactrouter.com/start/data/route-object', '🧭', 'React Router — Route object', 'Thuộc tính lazy trong Data mode.')}
${LINK('https://vite.dev/guide/build', '⚡', 'Vite — Building for production', 'Chunk, modulepreload, output của build.')}
${LINK('https://web.dev/articles/browser-level-image-lazy-loading', '🖼', 'web.dev — Browser-level image lazy loading', 'loading="lazy", ngưỡng khoảng cách, kích thước ảnh.')}
${LINK('https://web.dev/articles/cls', '📏', 'web.dev — Cumulative Layout Shift', 'CLS đo gì, ngưỡng 0,1 / 0,25.')}
</div>
`,
};

/* Output cắt sẵn cho Bài 8.4 (ngoài template literal) */
const O4 = {
  boChon: OUT.bai4.split('\n').slice(0, 3).join('\n'),
  namMau: OUT.bai4.split('\n').slice(3).join('\n'),
};
const L4 = {
    title: '8.4 — Accessible components: semantic HTML, keyboard, ARIA, and checking with axe|||8.4 — Component dễ tiếp cận: HTML đúng nghĩa, bàn phím, ARIA và kiểm bằng axe',
    slug: 'rx-8-4-a11y',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Một bộ chọn giờ bằng div được axe chấm 0 lỗi mà bàn phím không dùng được; radio thật so với ARIA tự làm; axe bắt gì bỏ lọt gì; hai lỗi thật axe tìm ra trong app; link "Bỏ qua" và nhóm ngày đi bằng phím mũi tên — đo bằng Vitest và Chromium.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Accessible components: semantic HTML, keyboard, ARIA, and checking with axe</h2>
<p class="lead">A clinic booking app is used by exactly the people accessibility is about: older patients with poor eyesight, someone with a tremor who cannot aim a mouse, a blind user with a screen reader, a parent holding a baby and tapping with one thumb. "Accessible" (often written <strong>a11y</strong> — a, 11 letters, y) means they can all complete the booking. This lesson measures it the way the rest of the chapter measured speed: an automated checker (axe-core), a keyboard, and real output — including a component that the checker calls perfect and that a keyboard cannot use at all.</p>
<p>Tools, 26/09/2026: axe-core 4.13.0 inside Vitest/jsdom, @axe-core/playwright 4.13.0 inside Chromium 149, user-event 14.6 for keyboard simulation. The standard referred to is <strong>WCAG 2.2</strong> level AA (W3C Recommendation, October 2023), which is what contracts and laws usually cite — in the EU, the European Accessibility Act has applied to many consumer websites and apps since 28 June 2025 (checked 09/2026).</p>

<h3>The checker says 0 errors; the user says it does not work</h3>
${slide('rx-08', 22, 'Time slots made of divs: 0 axe errors, 0 ways to choose with the keyboard')}
<p>Here is a time picker the way many student projects write it — it looks like buttons, reacts to clicks, highlights the chosen slot:</p>
${pre('tsx', SN.bai4Div)}
<p>The test puts it between two ordinary buttons, runs axe on it, then does what a keyboard user does: Tab through it, press Space to choose, press → to move on. The same test runs on two correct versions you will meet in a moment:</p>
${pre('tsx', SN.bai4Test)}
${out(O4.boChon)}
<p>The <code>&lt;div onClick&gt;</code> version: <strong>0 axe errors</strong>, and <strong>0 tab stops</strong> — the first Tab jumps straight from "Trước" to "Sau", Space and → select nothing, and there is no <code>radio</code> role, so a screen reader announces four lines of text with no hint they are choices. Nothing in it breaks an axe rule: a div is allowed to have a click handler, it simply is not focusable, not operable by keyboard, and has no role. Automated checkers can only test what is written; they cannot test what is <em>missing</em> behaviour.</p>
<div class="pitfall co-tieu-de"><strong>Trap — "axe is green, so it is accessible".</strong> Deque, the company behind axe, publishes that automated rules find a large share of issues but not all of them — the rest need a human. The cheapest human test takes 30 seconds: unplug the mouse (or do not touch the trackpad) and try to complete the task with Tab, Shift+Tab, Enter, Space and the arrow keys. If you cannot, nobody using a keyboard, a switch device or many screen readers can either.</div>

<h3>Semantic HTML first: a radio group does the work for free</h3>
${slide('rx-08', 23, 'Use the HTML element that exists before thinking about ARIA')}
<p>"Pick one of several options" already exists in HTML: radio buttons in a <code>&lt;fieldset&gt;</code> with a <code>&lt;legend&gt;</code>. The accessible version is shorter than the broken one:</p>
${pre('tsx', SN.bai4Radio)}
<p>With no extra code, the browser provides: one tab stop for the whole group (the checked radio, or the first one), arrow keys to move the selection, Space to select, a role ("radio"), a name (the text in the <code>&lt;label&gt;</code>), a state (checked or not), and a group name (the <code>&lt;legend&gt;</code>). The test confirms it: 1 tab stop, Space then → selects 08:00 then 09:30, four elements with role <code>radio</code>. Clicking anywhere on the label selects the radio too — a bigger target for an unsteady hand.</p>
<table>
<thead><tr><th>Element</th><th>What you get for free</th></tr></thead>
<tbody>
<tr><td><code>&lt;button type="button"&gt;</code></td><td>focusable, Enter and Space trigger <code>onClick</code>, role "button", name from its text</td></tr>
<tr><td><code>&lt;a href="…"&gt;</code> / <code>&lt;Link&gt;</code></td><td>focusable, Enter follows, "open in new tab", role "link" — use it for navigation, not a button</td></tr>
<tr><td><code>&lt;label&gt;</code> + <code>&lt;input&gt;</code></td><td>the label becomes the input's name and a click target</td></tr>
<tr><td><code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code></td><td>a named group ("Chọn ngày khám") announced when focus enters it</td></tr>
<tr><td><code>&lt;input type="radio" name&gt;</code></td><td>one tab stop per group, arrow keys, checked state</td></tr>
<tr><td><code>&lt;main&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;header&gt;</code>, <code>&lt;h1&gt;…&lt;h6&gt;</code></td><td>landmarks and headings screen-reader users jump between</td></tr>
</tbody></table>
${SD.chonTheEn}

<h3>When you must build it yourself: ARIA plus the keyboard</h3>
<p>Sometimes the design really cannot be a native element (a custom calendar grid, a combobox with rich options). ARIA — attributes like <code>role</code>, <code>aria-checked</code>, <code>aria-label</code> — lets you tell assistive technology what a <code>&lt;div&gt;</code> or <code>&lt;button&gt;</code> <em>is</em>. It adds no behaviour: every key the native element handled, you now handle. The W3C's ARIA Authoring Practices Guide (APG) documents the expected keys for each pattern. The radio group, by hand:</p>
${pre('tsx', SN.bai4Aria)}
<p>The technique is called <strong>roving tabindex</strong>: exactly one item has <code>tabIndex={0}</code> (it is the group's single Tab stop), all others have <code>-1</code> (focusable by code, skipped by Tab); arrow keys move both the selection and the <code>0</code>. It passes the same test (1 tab stop, 08:00 → 09:30, four <code>radio</code> roles) — in about three times the code, with Home/End and wrap-around that you must remember to write and test. The APG's own first rule says it bluntly: <em>no ARIA is better than bad ARIA</em>.</p>
<div class="pitfall co-tieu-de"><strong>Trap — a role without its behaviour or its state.</strong> <code>&lt;span role="radio"&gt;</code> promises a screen-reader user a radio button. Without <code>aria-checked</code> they cannot know which one is chosen (axe: <code>aria-required-attr</code>, critical); without <code>tabIndex</code> and key handling they cannot reach or change it (axe: nothing). A <code>role</code> is a promise; the code must keep it.</div>

<h3>What axe catches — and what it lets through</h3>
${slide('rx-08', 24, 'Five common mistakes: axe catches three, misses two')}
<p>Five snippets you will find in real pull requests, each checked with <code>axe.run</code> in jsdom:</p>
${out(O4.namMau)}
<table>
<thead><tr><th>Snippet</th><th>axe</th><th>What a human notices</th></tr></thead>
<tbody>
<tr><td><code>&lt;img&gt;</code> without <code>alt</code></td><td>image-alt (critical)</td><td>screen readers may read the file name</td></tr>
<tr><td><code>role="radio"</code> without <code>aria-checked</code></td><td>aria-required-attr (critical)</td><td>no way to know the state</td></tr>
<tr><td>h2 → h4</td><td>heading-order (moderate)</td><td>the outline skips a level</td></tr>
<tr><td>input with only a <code>placeholder</code></td><td><strong>0 errors</strong></td><td>the hint vanishes as soon as you type; many screen readers treat placeholders inconsistently</td></tr>
<tr><td><code>&lt;button&gt;♡&lt;/button&gt;</code></td><td><strong>0 errors</strong></td><td>the button has a name — the character ♡ — but it does not say what the button does</td></tr>
</tbody></table>
<p>axe checks that a name <em>exists</em>, not that it <em>means</em> something. The clinic app's heart button has had <code>aria-label="Yêu thích BS. …"</code> since Chapter 2 — the name says what it does and for whom, which also made every test in this chapter able to find the right button.</p>

<h3>Scanning the real app: two bugs axe did find</h3>
${slide('rx-08', 25, 'In the app: axe catches a 4.34:1 contrast and a div carrying aria-label')}
<p>Two scans complement each other. In Chromium, <code>@axe-core/playwright</code> checks the built app with real CSS and layout — the only way to check <strong>colour contrast</strong>, which needs computed colours. The call is one line; the script <code>do/do-axe.mjs</code> runs it on four pages:</p>
${pre('js', SN.doAxe)}
${out(OUT.axeTruoc)}
<p>One violation on every page: the footer text <code>#64748b</code> on the page background <code>#f1f5f9</code> has a contrast ratio of 4.34:1; WCAG AA requires <strong>4.5:1</strong> for normal-size text (3:1 for large text). The fix is a darker grey, <code>#475569</code>. The first attempt put the new colour in <code>app.css</code> — and the scan still failed, because <code>main.tsx</code> imports <code>index.css</code> <em>after</em> <code>app.css</code>, so the old rule with the same specificity wins. Moving the change into <code>index.css</code>:</p>
${out(OUT.axeSau)}
<p>The second scan runs in Vitest on every page of the route table — including the moment the data is still loading, which a Chromium scan that waits for the content never sees:</p>
${out(OUT.axeKhungXuong)}
<p>The time-slot skeleton from Chapter 6 was a plain <code>&lt;div&gt;</code> with <code>aria-label</code>. ARIA 1.2 forbids naming an element with no role (the name would be ignored by assistive technology), and axe reports it as <code>aria-prohibited-attr</code>. Giving it <code>role="status"</code> — a live region, announced when its content changes — makes the name valid and meaningful:</p>
${pre('tsx', SN.khungXuongSua)}

<h3>Walking the page with a keyboard</h3>
${slide('rx-08', 26, 'Keyboard: a skip link, and a day group changed with arrow keys')}
<p><code>do/do-ban-phim.mjs</code> opens <code>/bac-si/bs-2</code> in Chromium and presses Tab until focus reaches the first free time slot, printing where focus lands each time. Before the changes of this lesson:</p>
${out(OUT.banPhimTruoc)}
<p>Eleven presses, five of them through the header on every page, three through the day chips. The day chips were <code>&lt;button aria-pressed&gt;</code>: that role means "a toggle, on or off", and three independent toggles is not what "choose one day" is. Two changes, and the result:</p>
${out(OUT.banPhimSau)}
${SD.tabEn}
<p><strong>1. A skip link.</strong> The first focusable element of every page is a link to <code>#noi-dung</code>, visible only when focused; <code>&lt;main&gt;</code> gets that id and <code>tabIndex={-1}</code> so it can receive focus from the link. Tab, Enter, and the next Tab is already inside the page content — the header is skipped on every page, not just this one.</p>
${pre('tsx', SN.khungTrangBoQua)}
${pre('css', SN.cssA11y)}
<p><strong>2. The day picker becomes a real radio group</strong>, styled as the same chips. The <code>&lt;input&gt;</code> is made transparent and stretched over the chip — never <code>display: none</code>, which would remove it from the keyboard and from screen readers — and the chip shows the focus ring through <code>:has(input:focus-visible)</code>:</p>
${pre('tsx', SN.chonNgay)}
${SD.radioEn}
<p><code>:focus-visible</code> (not <code>:focus</code>) draws the ring only when the browser decides focus came from the keyboard, so mouse users do not see rings after every click — which removes the usual reason designers ask to hide focus outlines. Never write <code>outline: none</code> without a replacement.</p>
<p>What this lesson did not test: how a real screen reader announces the page. ⏳ Not run for real: VoiceOver (macOS/iOS), NVDA (Windows) and TalkBack (Android) cannot be driven on the build machine. On your own device, listen for "Chọn ngày khám, group", "radio button, 1 of 3, checked" (wording differs per screen reader) and for "Đang tải khung giờ" when changing the day.</p>
<!-- CHAY-O-MAY: nghe thử /bac-si/bs-2 bằng VoiceOver (Cmd+F5) và NVDA: tên nhóm "Chọn ngày khám", "radio, 1 of 3, checked", thông báo "Đang tải khung giờ" (role=status) khi đổi ngày -->
<p>Focus after navigation — moving focus to the new page's heading so screen readers know the page changed — is the next step, and Chapter 11 does it with <code>useRef</code>.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202, accessibility rarely appears in the grading: React-Bootstrap components give you some of it for free (its <code>Button</code> is a real <code>&lt;button&gt;</code>, <code>Form.Check type="radio"</code> is a real radio), and custom pieces are often <code>&lt;div onClick&gt;</code> because it "works" with a mouse. → At work, many contracts require WCAG 2.2 AA, accessibility bugs are filed like any other bug, axe runs in the test suite or CI (as in this lesson), linters flag <code>onClick</code> on non-interactive elements (the <code>jsx-a11y</code> rules, available in ESLint and oxlint), and someone tries the flow with a keyboard before release. · <em>Why:</em> an app that a keyboard user cannot finish is broken for real customers, and in some markets it is also a legal risk. React-Bootstrap is fine — just keep its real elements instead of wrapping content in clickable divs.</p></div>

<h3>When to reach for what</h3>
<ul>
<li><strong>Always</strong>: real <code>button</code>/<code>a</code>/<code>input</code>/<code>label</code>/<code>fieldset</code>; every image decides its <code>alt</code> (text, or <code>""</code> when decorative); every icon-only button gets an <code>aria-label</code> that says what it does; visible focus; contrast ≥ 4.5:1.</li>
<li><strong>When no element fits</strong>: follow the APG pattern exactly — role, states, keys — and test the keys.</li>
<li><strong>Do not</strong> add ARIA to elements that already have the right semantics (<code>&lt;button role="button"&gt;</code>), and do not use <code>aria-label</code> to "fix" a div that should have been a button.</li>
<li><strong>Check</strong> with axe in tests (including loading and error states), axe in a real browser for contrast, and a keyboard walk-through for every new flow.</li>
</ul>

<div class="callout"><p><strong>Common interview question.</strong> "How do you make a React component accessible? When do you use ARIA?"</p>
<p>I start with semantic HTML: a real <code>button</code> for actions, <code>a</code> for navigation, inputs with <code>label</code>s, radios in a <code>fieldset</code>/<code>legend</code>, landmarks and ordered headings — these give focus, keyboard handling, roles, names and states for free. Then I check visible focus, colour contrast (4.5:1 for normal text) and meaningful names for icon buttons. ARIA is for the cases where no native element exists: I follow the APG pattern, including the keyboard model such as roving tabindex, because ARIA only changes what assistive technology hears, not behaviour. I verify with axe in unit tests and in the browser, plus a manual keyboard pass, since automated tools cannot tell whether something is operable.</p></div>

<h3>🛠 Keep building the project — step 4/4: keyboard and axe</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after step 3/4 (<code>src/features/dat-lich/ChonKhungGio.tsx</code> with <code>aria-pressed</code> day chips, <code>src/app/KhungTrang.tsx</code>, <code>src/shared/ui/KhungXuong.tsx</code>, <code>src/index.css</code>, <code>src/app/app.css</code>, <code>src/app/router.test.tsx</code>). Install <code>axe-core</code> as a dev dependency (<code>npm i -D axe-core</code>; the Chromium scan also needs <code>@axe-core/playwright</code>).</p><ol>
<li>Create <code>src/app/a11y.test.tsx</code> (below) and run it: 3 tests fail. Read each failure before fixing.</li>
<li><code>ChonKhungGio</code>: the day chips become <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;Chọn ngày khám&lt;/legend&gt;</code> + <code>&lt;input type="radio" name="ngay-kham"&gt;</code> inside each chip label, still writing <code>?ngay=</code> with <code>replace</code>. Give the slot list <code>aria-label={&#96;Giờ khám ngày &#36;{hienNgay(ngay)}&#96;}</code>.</li>
<li><code>KhungTrang</code>: the skip link and <code>&lt;main id="noi-dung" tabIndex={-1}&gt;</code>; the CSS block of this lesson.</li>
<li><code>LuoiGioKhung</code>: <code>role="status"</code>. Footer colour <code>#475569</code> — in <code>index.css</code>, where the rule actually wins.</li>
<li>Update the Chapter 7 test "đổi ngày khám": <code>findByRole('radio', { name: '02/10/2026' })</code> and <code>toBeChecked()</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>npx vitest run src/app src/features</code> → 3 files, 20 tests green (below); <code>npx tsc -b</code> clean; and, if you have Playwright, <code>node do/do-axe.mjs dist "sau"</code> reports 0 violations on the four pages. Manually: Tab once on any page shows "Bỏ qua, tới nội dung chính"; in the day group, → changes the date and the URL.</p></div>
${pre('tsx', SN.a11yTest)}
${out(OUT.a11yTruoc)}
${out(OUT.tieuChiSau)}
<details><summary>Solution</summary>
<p>Run on 26/09/2026: <code>npx tsc -b</code> prints nothing, 20/20 tests green, Chromium axe 0 violations on 4 pages. The changed code is printed in full above: the fieldset in <strong>ChonKhungGio.tsx</strong> and the skip link in <strong>KhungTrang.tsx</strong> (section "Walking the page with a keyboard"), the CSS block (same section), <strong>LuoiGioKhung</strong> (section "Scanning the real app"). The remaining one-line changes:</p>
<pre><code class="language-tsx">// src/features/dat-lich/ChonKhungGio.tsx — the list of slots gets a name
&lt;ul
  className="lua-chon"
  aria-label={&#96;Giờ khám ngày &#36;{hienNgay(ngay)}&#96;}
  aria-busy={khungGioQ.isPlaceholderData}

// src/index.css — the footer rule (index.css is imported after app.css, so the fix belongs here)
.footer { border-top: 1px solid #e2e8f0; color: #475569; padding: 16px 32px; font-size: 14px; }

// src/app/router.test.tsx — Chapter 7 test "đổi ngày khám"
await user.click(await screen.findByRole('radio', { name: '02/10/2026' }));
expect(screen.getByRole('radio', { name: '02/10/2026' })).toBeChecked();</code></pre>
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> audit the login page (<code>/dang-nhap</code>) with a keyboard and axe.</p><ol>
<li>Submit the empty form with Enter only. Is the error message announced? Look at the markup: which attribute makes a screen reader read it immediately?</li>
<li>In <code>a11y.test.tsx</code>, add a test that submits the empty login form and then runs <code>loiAxe()</code>; also assert that the error has <code>role="alert"</code> and that focus is still inside the form.</li>
<li>Remove the <code>&lt;label htmlFor="dn-sdt"&gt;</code> for the phone field and run the test again; then put it back.</li>
</ol><p><strong>Done when:</strong> step 1: the message "Nhập họ tên và số điện thoại 10 số." appears and has <code>role="alert"</code> (Chapter 7's form already does this); step 2's test is green; in step 3 axe reports <code>label</code> for the phone input (it has no placeholder to fall back on) and the test turns red, then green again when you restore the label.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">a11y (accessibility)</span><span class="v">everyone — keyboard, screen reader, low vision, motor impairment — can complete the task</span></div>
<div class="kv"><span class="k">WCAG 2.2 AA</span><span class="v">the W3C guidelines level most contracts and laws cite (e.g. contrast 4.5:1, keyboard operable)</span></div>
<div class="kv"><span class="k">semantic HTML</span><span class="v">using the element that means what it does (<code>button</code>, <code>a</code>, <code>fieldset</code>) to get behaviour and roles for free</span></div>
<div class="kv"><span class="k">ARIA</span><span class="v"><code>role</code> and <code>aria-*</code> attributes that describe widgets to assistive technology; they add no behaviour</span></div>
<div class="kv"><span class="k">roving tabindex</span><span class="v">one item of a group has <code>tabIndex=0</code>, the rest <code>-1</code>; arrow keys move it</span></div>
<div class="kv"><span class="k">skip link</span><span class="v">first link of the page, jumps past the header to <code>&lt;main&gt;</code></span></div>
<div class="kv"><span class="k"><code>:focus-visible</code></span><span class="v">CSS state: focused, and the browser judges the ring should be visible (keyboard use)</span></div>
<div class="kv"><span class="k">axe-core</span><span class="v">open-source rule engine for automated accessibility checks, in jsdom or a real browser</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A <code>&lt;div onClick&gt;</code> time picker got 0 axe errors and offered 0 tab stops: automated checks cannot see missing behaviour — test with the keyboard.</li>
<li>Native radios in a <code>fieldset</code>/<code>legend</code> give one tab stop, arrow keys, role, name and state for free; the hand-made ARIA version needs roving tabindex and ~3× the code.</li>
<li>axe caught image-alt, aria-required-attr, heading-order, but let a placeholder-only input and a "♡" button through: it checks that names exist, not that they mean something.</li>
<li>In the app, axe found a 4.34:1 footer contrast (fixed in the stylesheet that actually wins) and a skeleton <code>div</code> with a forbidden <code>aria-label</code> (fixed with <code>role="status"</code>) — the second only visible when scanning the loading state.</li>
<li>A skip link and a real radio group: Tab, Enter, then 4 Tabs to the first time slot; → changes the day and the URL.</li>
<li>Screen-reader listening is still a human job (⏳ on your device); focus after navigation comes in Chapter 11.</li>
</ul>

${LINK('https://www.w3.org/TR/WCAG22/', '📜', 'W3C — WCAG 2.2', 'The success criteria behind "AA": contrast, keyboard, names.')}
${LINK('https://www.w3.org/WAI/ARIA/apg/patterns/radio/', '🎛', 'ARIA APG — Radio Group pattern', 'Keys, roles, states — and the native alternative.')}
${LINK('https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/', '⌨️', 'ARIA APG — Keyboard interface', 'Roving tabindex and focus management.')}
${LINK('https://github.com/dequelabs/axe-core', '🪓', 'GitHub — axe-core', 'Rule engine, rule list, running it in tests.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible', '📄', 'MDN — :focus-visible', 'When browsers show the focus ring.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset', '📄', 'MDN — &lt;fieldset&gt;', 'Grouping controls with a legend.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Component dễ tiếp cận: HTML đúng nghĩa, bàn phím, ARIA và kiểm bằng axe</h2>
<p class="lead">Một app đặt lịch khám được dùng bởi đúng những người mà khả năng tiếp cận nói tới: bệnh nhân lớn tuổi mắt kém, người run tay không nhắm chuột được, người khiếm thị dùng trình đọc màn hình, một phụ huynh đang bế con và bấm bằng một ngón cái. "Dễ tiếp cận" (accessible, hay viết tắt <strong>a11y</strong> — chữ a, 11 chữ cái, chữ y) nghĩa là tất cả họ đều đặt lịch xong được. Bài này đo điều đó theo đúng cách cả chương đã đo tốc độ: một máy kiểm tự động (axe-core), một bàn phím, và output thật — kể cả một component mà máy kiểm khen hoàn hảo còn bàn phím thì không dùng được chút nào.</p>
<p>Công cụ, 26/09/2026: axe-core 4.13.0 trong Vitest/jsdom, @axe-core/playwright 4.13.0 trong Chromium 149, user-event 14.6 để giả lập bàn phím. Chuẩn được nhắc tới là <strong>WCAG 2.2</strong> mức AA (khuyến nghị của W3C, tháng 10/2023) — mức mà hợp đồng và luật thường dẫn; ở châu Âu, Đạo luật Tiếp cận châu Âu (European Accessibility Act) áp dụng cho nhiều trang web và app tiêu dùng từ 28/06/2025 (kiểm 09/2026).</p>

<h3>Máy kiểm nói 0 lỗi; người dùng nói không dùng được</h3>
${slide('rx-08', 22, 'Ô giờ bằng div: axe 0 lỗi, bàn phím 0 cách chọn')}
<p>Đây là một bộ chọn giờ theo kiểu nhiều đồ án sinh viên vẫn viết — trông như nút, bấm chuột được, tô sáng ô đang chọn:</p>
${pre('tsx', SN.bai4Div)}
<p>Test đặt nó giữa hai nút bình thường, chạy axe, rồi làm đúng việc người dùng bàn phím làm: Tab đi qua, bấm Space để chọn, bấm → để sang ô sau. Cùng test đó chạy trên hai bản đúng mà bạn sẽ gặp ngay sau:</p>
${pre('tsx', SN.bai4Test)}
${out(O4.boChon)}
<p>Bản <code>&lt;div onClick&gt;</code>: <strong>axe 0 lỗi</strong>, và <strong>0 điểm dừng Tab</strong> — Tab đầu tiên nhảy thẳng từ "Trước" sang "Sau", Space và → không chọn được gì, và không có vai (role) <code>radio</code> nào, nên trình đọc màn hình đọc bốn dòng chữ mà không hề gợi ý đó là các lựa chọn. Không chỗ nào phạm luật của axe: div được phép có handler click, chỉ là nó không nhận focus, không điều khiển được bằng phím, và không có vai. Máy kiểm tự động chỉ kiểm được những gì được viết ra; nó không kiểm được hành vi bị <em>thiếu</em>.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — "axe xanh là dễ tiếp cận rồi".</strong> Deque, công ty làm ra axe, công bố rằng luật tự động tìm được một phần lớn lỗi nhưng không phải tất cả — phần còn lại cần con người. Phép thử người rẻ nhất mất 30 giây: rút chuột ra (hoặc đừng chạm touchpad) và cố làm xong việc chỉ bằng Tab, Shift+Tab, Enter, Space và phím mũi tên. Bạn không làm được thì người dùng bàn phím, công tắc hỗ trợ hay nhiều loại trình đọc màn hình cũng không.</div>

<h3>HTML đúng nghĩa trước: nhóm radio làm hết việc, miễn phí</h3>
${slide('rx-08', 23, 'Dùng thẻ HTML có sẵn trước khi nghĩ tới ARIA')}
<p>"Chọn một trong nhiều lựa chọn" đã có sẵn trong HTML: các nút radio trong một <code>&lt;fieldset&gt;</code> có <code>&lt;legend&gt;</code>. Bản dễ tiếp cận còn ngắn hơn bản hỏng:</p>
${pre('tsx', SN.bai4Radio)}
<p>Không thêm dòng nào, trình duyệt đã cho: một điểm dừng Tab cho cả nhóm (radio đang chọn, hoặc radio đầu tiên), phím mũi tên để đổi lựa chọn, Space để chọn, một vai ("radio"), một tên (chữ trong <code>&lt;label&gt;</code>), một trạng thái (đã chọn hay chưa), và tên nhóm (<code>&lt;legend&gt;</code>). Test xác nhận: 1 điểm dừng Tab, Space rồi → chọn 08:00 rồi 09:30, bốn phần tử có vai <code>radio</code>. Bấm vào bất kỳ đâu trên label cũng chọn radio — vùng bấm to hơn cho bàn tay run.</p>
<table>
<thead><tr><th>Thẻ</th><th>Được cho sẵn</th></tr></thead>
<tbody>
<tr><td><code>&lt;button type="button"&gt;</code></td><td>nhận focus, Enter và Space gọi <code>onClick</code>, vai "button", tên lấy từ chữ bên trong</td></tr>
<tr><td><code>&lt;a href="…"&gt;</code> / <code>&lt;Link&gt;</code></td><td>nhận focus, Enter để đi, "mở trong tab mới", vai "link" — dùng cho điều hướng, không dùng nút</td></tr>
<tr><td><code>&lt;label&gt;</code> + <code>&lt;input&gt;</code></td><td>label thành tên của ô nhập và thành vùng bấm</td></tr>
<tr><td><code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code></td><td>một nhóm có tên ("Chọn ngày khám"), được đọc khi focus đi vào</td></tr>
<tr><td><code>&lt;input type="radio" name&gt;</code></td><td>mỗi nhóm một điểm dừng Tab, phím mũi tên, trạng thái đã chọn</td></tr>
<tr><td><code>&lt;main&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;header&gt;</code>, <code>&lt;h1&gt;…&lt;h6&gt;</code></td><td>các "mốc" (landmark) và tiêu đề mà người dùng trình đọc màn hình nhảy qua lại</td></tr>
</tbody></table>
${SD.chonTheVi}

<h3>Khi buộc phải tự làm: ARIA cộng bàn phím</h3>
<p>Đôi khi thiết kế thật sự không thể là một thẻ có sẵn (lưới lịch tự vẽ, ô chọn có gợi ý phong phú). ARIA — các thuộc tính như <code>role</code>, <code>aria-checked</code>, <code>aria-label</code> — cho bạn nói với công nghệ hỗ trợ rằng một <code>&lt;div&gt;</code> hay <code>&lt;button&gt;</code> <em>là</em> cái gì. Nó không thêm hành vi nào: phím nào thẻ gốc từng lo, giờ bạn phải tự lo. Bộ hướng dẫn ARIA Authoring Practices Guide (APG) của W3C ghi rõ các phím cần có cho từng mẫu. Nhóm radio, làm tay:</p>
${pre('tsx', SN.bai4Aria)}
<p>Kỹ thuật này gọi là <strong>roving tabindex</strong> (tabindex luân phiên): đúng một mục có <code>tabIndex={0}</code> (điểm dừng Tab duy nhất của nhóm), mọi mục khác <code>-1</code> (focus được bằng code, Tab thì bỏ qua); phím mũi tên dời cả lựa chọn lẫn con số <code>0</code>. Nó qua đúng test cũ (1 điểm dừng, 08:00 → 09:30, bốn vai <code>radio</code>) — với lượng code gấp khoảng ba, kèm Home/End và quay vòng mà bạn phải nhớ viết và nhớ test. Quy tắc đầu tiên của chính APG nói thẳng: <em>không ARIA còn hơn ARIA dở</em> (no ARIA is better than bad ARIA).</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — có vai mà thiếu hành vi hoặc thiếu trạng thái.</strong> <code>&lt;span role="radio"&gt;</code> hứa với người dùng trình đọc màn hình rằng đây là một nút radio. Thiếu <code>aria-checked</code> thì họ không biết cái nào đang được chọn (axe: <code>aria-required-attr</code>, critical); thiếu <code>tabIndex</code> và xử lý phím thì họ không tới được, không đổi được (axe: không nói gì). <code>role</code> là một lời hứa; code phải giữ lời.</div>

<h3>axe bắt được gì — và để lọt gì</h3>
${slide('rx-08', 24, 'Năm lỗi hay gặp: axe bắt ba, bỏ lọt hai')}
<p>Năm đoạn mã bạn sẽ gặp trong pull request thật, mỗi đoạn kiểm bằng <code>axe.run</code> trong jsdom:</p>
${out(O4.namMau)}
<table>
<thead><tr><th>Đoạn mã</th><th>axe</th><th>Người thật nhận ra</th></tr></thead>
<tbody>
<tr><td><code>&lt;img&gt;</code> thiếu <code>alt</code></td><td>image-alt (critical)</td><td>trình đọc màn hình có thể đọc tên file</td></tr>
<tr><td><code>role="radio"</code> thiếu <code>aria-checked</code></td><td>aria-required-attr (critical)</td><td>không biết trạng thái</td></tr>
<tr><td>h2 → h4</td><td>heading-order (moderate)</td><td>dàn ý nhảy mất một cấp</td></tr>
<tr><td>ô nhập chỉ có <code>placeholder</code></td><td><strong>0 lỗi</strong></td><td>gợi ý biến mất ngay khi gõ; nhiều trình đọc màn hình xử lý placeholder không nhất quán</td></tr>
<tr><td><code>&lt;button&gt;♡&lt;/button&gt;</code></td><td><strong>0 lỗi</strong></td><td>nút có tên — là ký tự ♡ — nhưng tên đó không nói nút làm gì</td></tr>
</tbody></table>
<p>axe kiểm xem tên có <em>tồn tại</em> không, không kiểm tên có <em>nghĩa</em> không. Nút trái tim của app đã có <code>aria-label="Yêu thích BS. …"</code> từ Chương 2 — tên nói nó làm gì và cho ai, và nhờ vậy mọi test trong chương này mới tìm đúng được nút.</p>

<h3>Quét app thật: hai lỗi axe tìm ra</h3>
${slide('rx-08', 25, 'Trong app: axe bắt tương phản 4,34:1 và một div mang aria-label')}
<p>Hai lần quét bổ sung cho nhau. Trong Chromium, <code>@axe-core/playwright</code> kiểm app đã build với CSS và bố cục thật — cách duy nhất để kiểm <strong>độ tương phản màu</strong>, vì cần màu đã tính xong. Lời gọi chỉ một dòng; script <code>do/do-axe.mjs</code> chạy nó trên bốn trang:</p>
${pre('js', SN.doAxe)}
${out(OUT.axeTruoc)}
<p>Trang nào cũng có một lỗi: chữ ở footer màu <code>#64748b</code> trên nền trang <code>#f1f5f9</code> có tỉ lệ tương phản 4,34:1; WCAG AA đòi <strong>4,5:1</strong> cho chữ cỡ thường (3:1 cho chữ lớn). Cách sửa là một màu xám đậm hơn, <code>#475569</code>. Lần sửa đầu đặt màu mới vào <code>app.css</code> — và lần quét vẫn đỏ, vì <code>main.tsx</code> import <code>index.css</code> <em>sau</em> <code>app.css</code>, nên luật cũ có cùng độ ưu tiên (specificity) thắng. Dời thay đổi sang <code>index.css</code>:</p>
${out(OUT.axeSau)}
<p>Lần quét thứ hai chạy trong Vitest trên từng trang của bảng route — kể cả lúc dữ liệu còn đang tải, khoảnh khắc mà lần quét Chromium (đợi nội dung xong mới quét) không bao giờ thấy:</p>
${out(OUT.axeKhungXuong)}
<p>Khung xương ô giờ từ Chương 6 là một <code>&lt;div&gt;</code> trơn có <code>aria-label</code>. ARIA 1.2 cấm đặt tên cho phần tử không có vai (công nghệ hỗ trợ sẽ bỏ qua cái tên đó), và axe báo <code>aria-prohibited-attr</code>. Cho nó <code>role="status"</code> — một vùng live, được đọc lên khi nội dung đổi — thì cái tên vừa hợp lệ vừa có ích:</p>
${pre('tsx', SN.khungXuongSua)}

<h3>Đi qua trang bằng bàn phím</h3>
${slide('rx-08', 26, 'Bàn phím: link “Bỏ qua”, nhóm ngày đổi bằng phím mũi tên')}
<p><code>do/do-ban-phim.mjs</code> mở <code>/bac-si/bs-2</code> trong Chromium và bấm Tab tới khi focus chạm ô giờ đầu tiên còn trống, in ra focus nằm ở đâu sau mỗi lần. Trước các thay đổi của bài:</p>
${out(OUT.banPhimTruoc)}
<p>Mười một lần bấm, năm lần trong số đó đi qua header — trang nào cũng vậy — và ba lần qua các chip ngày. Chip ngày từng là <code>&lt;button aria-pressed&gt;</code>: vai đó nghĩa là "một công tắc, bật hoặc tắt", mà ba công tắc độc lập không phải là "chọn một ngày". Hai thay đổi, và kết quả:</p>
${out(OUT.banPhimSau)}
${SD.tabVi}
<p><strong>1. Link bỏ qua (skip link).</strong> Phần tử nhận focus đầu tiên của mọi trang là một link tới <code>#noi-dung</code>, chỉ hiện khi có focus; <code>&lt;main&gt;</code> mang id đó cùng <code>tabIndex={-1}</code> để nhận được focus từ link. Tab, Enter, và lần Tab kế tiếp đã ở trong nội dung trang — header được bỏ qua ở mọi trang, không riêng trang này.</p>
${pre('tsx', SN.khungTrangBoQua)}
${pre('css', SN.cssA11y)}
<p><strong>2. Bộ chọn ngày thành nhóm radio thật</strong>, vẫn trông như các chip cũ. <code>&lt;input&gt;</code> được làm trong suốt và phủ kín chip — không bao giờ <code>display: none</code>, vì thế là mất luôn với bàn phím và trình đọc màn hình — còn chip hiện viền focus qua <code>:has(input:focus-visible)</code>:</p>
${pre('tsx', SN.chonNgay)}
${SD.radioVi}
<p><code>:focus-visible</code> (không phải <code>:focus</code>) chỉ vẽ viền khi trình duyệt đánh giá focus đến từ bàn phím, nên người dùng chuột không thấy viền sau mỗi cú bấm — bỏ được lý do quen thuộc khiến designer đòi ẩn viền focus. Đừng bao giờ viết <code>outline: none</code> mà không có thứ thay thế.</p>
<p>Điều bài này chưa kiểm: một trình đọc màn hình thật đọc trang ra sao. ⏳ Chưa chạy thật: VoiceOver (macOS/iOS), NVDA (Windows) và TalkBack (Android) không điều khiển được trên máy dựng bài. Trên thiết bị của bạn, hãy nghe xem có "Chọn ngày khám, group", "radio button, 1 of 3, checked" (mỗi trình đọc nói một kiểu) và "Đang tải khung giờ" khi đổi ngày không.</p>
<!-- CHAY-O-MAY: nghe thử /bac-si/bs-2 bằng VoiceOver (Cmd+F5) và NVDA: tên nhóm "Chọn ngày khám", "radio, 1 of 3, checked", thông báo "Đang tải khung giờ" (role=status) khi đổi ngày -->
<p>Focus sau khi chuyển trang — đưa focus lên tiêu đề trang mới để trình đọc màn hình biết đã sang trang khác — là bước tiếp theo, và Chương 11 làm nó bằng <code>useRef</code>.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202, khả năng tiếp cận hiếm khi có trong tiêu chí chấm: component của React-Bootstrap cho sẵn một phần (<code>Button</code> của nó là <code>&lt;button&gt;</code> thật, <code>Form.Check type="radio"</code> là radio thật), còn phần tự làm thì hay là <code>&lt;div onClick&gt;</code> vì dùng chuột thì "vẫn chạy". → Đi làm, nhiều hợp đồng đòi WCAG 2.2 AA, lỗi tiếp cận được báo như mọi bug khác, axe chạy trong bộ test hoặc CI (như bài này), linter bắt <code>onClick</code> đặt trên phần tử không tương tác được (bộ luật <code>jsx-a11y</code>, có trong ESLint và oxlint), và có người thử luồng bằng bàn phím trước khi phát hành. · <em>Vì sao:</em> một app mà người dùng bàn phím không làm xong được là app hỏng với khách hàng thật, và ở một số thị trường còn là rủi ro pháp lý. React-Bootstrap không có gì sai — chỉ cần giữ các thẻ thật của nó thay vì bọc nội dung trong div bấm được.</p></div>

<h3>Khi nào dùng cái gì</h3>
<ul>
<li><strong>Luôn luôn</strong>: <code>button</code>/<code>a</code>/<code>input</code>/<code>label</code>/<code>fieldset</code> thật; ảnh nào cũng quyết định <code>alt</code> (chữ, hoặc <code>""</code> nếu chỉ trang trí); nút chỉ có biểu tượng thì có <code>aria-label</code> nói nó làm gì; focus nhìn thấy được; tương phản ≥ 4,5:1.</li>
<li><strong>Khi không có thẻ nào hợp</strong>: làm đúng mẫu của APG — vai, trạng thái, phím — và test các phím.</li>
<li><strong>Đừng</strong> thêm ARIA cho thẻ đã có nghĩa đúng (<code>&lt;button role="button"&gt;</code>), và đừng dùng <code>aria-label</code> để "chữa" một div lẽ ra phải là nút.</li>
<li><strong>Kiểm</strong> bằng axe trong test (cả trạng thái đang tải và lỗi), axe trong trình duyệt thật cho tương phản, và một lượt đi bằng bàn phím cho mỗi luồng mới.</li>
</ul>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Làm sao để một component React dễ tiếp cận? Khi nào dùng ARIA?"</p>
<p>Em bắt đầu bằng HTML đúng nghĩa: <code>button</code> thật cho hành động, <code>a</code> cho điều hướng, ô nhập có <code>label</code>, radio trong <code>fieldset</code>/<code>legend</code>, landmark và tiêu đề đúng thứ tự — chúng cho sẵn focus, xử lý phím, vai, tên và trạng thái. Sau đó em kiểm focus nhìn thấy được, độ tương phản (4,5:1 cho chữ thường) và tên có nghĩa cho nút biểu tượng. ARIA dành cho trường hợp không có thẻ gốc: em làm theo mẫu APG, gồm cả mô hình bàn phím như roving tabindex, vì ARIA chỉ đổi thứ công nghệ hỗ trợ nghe được, không đổi hành vi. Em kiểm bằng axe trong unit test và trong trình duyệt, cộng một lượt thử tay bằng bàn phím, vì công cụ tự động không biết thứ gì điều khiển được.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 4/4: bàn phím và axe</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau bước 3/4 (các file <code>src/features/dat-lich/ChonKhungGio.tsx</code> với chip ngày <code>aria-pressed</code>, <code>src/app/KhungTrang.tsx</code>, <code>src/shared/ui/KhungXuong.tsx</code>, <code>src/index.css</code>, <code>src/app/app.css</code>, <code>src/app/router.test.tsx</code>). Cài <code>axe-core</code> làm dev dependency (<code>npm i -D axe-core</code>; quét trong Chromium thì cần thêm <code>@axe-core/playwright</code>).</p><ol>
<li>Tạo <code>src/app/a11y.test.tsx</code> (bên dưới) rồi chạy: 3 test đỏ. Đọc từng lỗi trước khi sửa.</li>
<li><code>ChonKhungGio</code>: chip ngày thành <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;Chọn ngày khám&lt;/legend&gt;</code> + <code>&lt;input type="radio" name="ngay-kham"&gt;</code> nằm trong label của mỗi chip, vẫn ghi <code>?ngay=</code> bằng <code>replace</code>. Đặt tên cho danh sách ô giờ: <code>aria-label={&#96;Giờ khám ngày &#36;{hienNgay(ngay)}&#96;}</code>.</li>
<li><code>KhungTrang</code>: link bỏ qua và <code>&lt;main id="noi-dung" tabIndex={-1}&gt;</code>; khối CSS của bài.</li>
<li><code>LuoiGioKhung</code>: <code>role="status"</code>. Màu footer <code>#475569</code> — trong <code>index.css</code>, nơi luật thật sự thắng.</li>
<li>Sửa test "đổi ngày khám" của Chương 7: <code>findByRole('radio', { name: '02/10/2026' })</code> và <code>toBeChecked()</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>npx vitest run src/app src/features</code> → 3 file, 20 test xanh (bên dưới); <code>npx tsc -b</code> sạch; và nếu có Playwright, <code>node do/do-axe.mjs dist "sau"</code> báo 0 lỗi trên bốn trang. Thử tay: Tab một lần ở trang bất kỳ thấy "Bỏ qua, tới nội dung chính"; trong nhóm ngày, bấm → đổi ngày và đổi URL.</p></div>
${pre('tsx', SN.a11yTest)}
${out(OUT.a11yTruoc)}
${out(OUT.tieuChiSau)}
<details><summary>Lời giải</summary>
<p>Chạy ngày 26/09/2026: <code>npx tsc -b</code> không in gì, 20/20 test xanh, axe trong Chromium 0 lỗi trên 4 trang. Code thay đổi đã in đầy đủ ở trên: fieldset trong <strong>ChonKhungGio.tsx</strong> và link bỏ qua trong <strong>KhungTrang.tsx</strong> (mục "Đi qua trang bằng bàn phím"), khối CSS (cùng mục), <strong>LuoiGioKhung</strong> (mục "Quét app thật"). Những chỗ đổi một dòng còn lại:</p>
<pre><code class="language-tsx">// src/features/dat-lich/ChonKhungGio.tsx — danh sách ô giờ có tên
&lt;ul
  className="lua-chon"
  aria-label={&#96;Giờ khám ngày &#36;{hienNgay(ngay)}&#96;}
  aria-busy={khungGioQ.isPlaceholderData}

// src/index.css — luật của footer (index.css được import sau app.css, nên sửa ở đây mới ăn)
.footer { border-top: 1px solid #e2e8f0; color: #475569; padding: 16px 32px; font-size: 14px; }

// src/app/router.test.tsx — test "đổi ngày khám" của Chương 7
await user.click(await screen.findByRole('radio', { name: '02/10/2026' }));
expect(screen.getByRole('radio', { name: '02/10/2026' })).toBeChecked();</code></pre>
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> kiểm trang đăng nhập (<code>/dang-nhap</code>) bằng bàn phím và axe.</p><ol>
<li>Gửi form trống chỉ bằng phím Enter. Thông báo lỗi có được đọc lên không? Nhìn markup: thuộc tính nào làm trình đọc màn hình đọc nó ngay?</li>
<li>Trong <code>a11y.test.tsx</code>, thêm một test gửi form đăng nhập trống rồi chạy <code>loiAxe()</code>; kiểm thêm lỗi có <code>role="alert"</code> và focus vẫn nằm trong form.</li>
<li>Xoá <code>&lt;label htmlFor="dn-sdt"&gt;</code> của ô số điện thoại rồi chạy test lại; sau đó đặt lại.</li>
</ol><p><strong>Đạt khi:</strong> bước 1: thông báo "Nhập họ tên và số điện thoại 10 số." hiện ra và có <code>role="alert"</code> (form của Chương 7 đã làm vậy); test ở bước 2 xanh; ở bước 3 axe báo <code>label</code> cho ô số điện thoại (nó không có placeholder để dựa vào) và test đỏ, rồi xanh lại khi bạn trả label về.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">a11y (khả năng tiếp cận)</span><span class="v">mọi người — dùng bàn phím, trình đọc màn hình, mắt kém, tay yếu — đều làm xong việc được</span></div>
<div class="kv"><span class="k">WCAG 2.2 AA</span><span class="v">mức hướng dẫn của W3C mà hợp đồng và luật hay dẫn (vd tương phản 4,5:1, dùng được bằng bàn phím)</span></div>
<div class="kv"><span class="k">HTML đúng nghĩa (semantic HTML)</span><span class="v">dùng thẻ mang đúng ý nghĩa (<code>button</code>, <code>a</code>, <code>fieldset</code>) để được cho sẵn hành vi và vai</span></div>
<div class="kv"><span class="k">ARIA</span><span class="v">các thuộc tính <code>role</code>, <code>aria-*</code> mô tả widget cho công nghệ hỗ trợ; không thêm hành vi</span></div>
<div class="kv"><span class="k">roving tabindex (tabindex luân phiên)</span><span class="v">một mục trong nhóm có <code>tabIndex=0</code>, còn lại <code>-1</code>; phím mũi tên dời nó</span></div>
<div class="kv"><span class="k">skip link (link bỏ qua)</span><span class="v">link đầu tiên của trang, nhảy qua header tới <code>&lt;main&gt;</code></span></div>
<div class="kv"><span class="k"><code>:focus-visible</code></span><span class="v">trạng thái CSS: đang có focus và trình duyệt cho rằng nên hiện viền (khi dùng bàn phím)</span></div>
<div class="kv"><span class="k">axe-core</span><span class="v">bộ luật kiểm tiếp cận tự động, mã nguồn mở, chạy trong jsdom hoặc trình duyệt thật</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bộ chọn giờ <code>&lt;div onClick&gt;</code> được axe chấm 0 lỗi mà có 0 điểm dừng Tab: kiểm tự động không thấy hành vi bị thiếu — hãy thử bằng bàn phím.</li>
<li>Radio thật trong <code>fieldset</code>/<code>legend</code> cho sẵn một điểm dừng Tab, phím mũi tên, vai, tên, trạng thái; bản ARIA tự làm cần roving tabindex và lượng code gấp khoảng ba.</li>
<li>axe bắt image-alt, aria-required-attr, heading-order, nhưng để lọt ô nhập chỉ có placeholder và nút "♡": nó kiểm tên có tồn tại, không kiểm tên có nghĩa.</li>
<li>Trong app, axe tìm ra tương phản footer 4,34:1 (sửa ở đúng file CSS thắng) và một <code>div</code> khung xương mang <code>aria-label</code> bị cấm (sửa bằng <code>role="status"</code>) — lỗi sau chỉ lộ khi quét lúc đang tải.</li>
<li>Link bỏ qua và nhóm radio thật: Tab, Enter, rồi 4 lần Tab tới ô giờ đầu tiên; phím → đổi ngày và đổi URL.</li>
<li>Nghe bằng trình đọc màn hình vẫn là việc của người (⏳ trên thiết bị của bạn); focus sau khi chuyển trang ở Chương 11.</li>
</ul>

${LINK('https://www.w3.org/TR/WCAG22/', '📜', 'W3C — WCAG 2.2', 'Các tiêu chí đằng sau mức "AA": tương phản, bàn phím, tên.')}
${LINK('https://www.w3.org/WAI/ARIA/apg/patterns/radio/', '🎛', 'ARIA APG — Radio Group pattern', 'Phím, vai, trạng thái — và lựa chọn dùng thẻ gốc.')}
${LINK('https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/', '⌨️', 'ARIA APG — Keyboard interface', 'Roving tabindex và quản lý focus.')}
${LINK('https://github.com/dequelabs/axe-core', '🪓', 'GitHub — axe-core', 'Bộ luật, danh sách luật, chạy trong test.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible', '📄', 'MDN — :focus-visible', 'Khi nào trình duyệt hiện viền focus.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset', '📄', 'MDN — &lt;fieldset&gt;', 'Nhóm các điều khiển kèm legend.')}
</div>
`,
};

const Q = {
    title: '8.5 — Chapter 8 quiz: what the measurements said|||8.5 — Kiểm tra Chương 8: số đo đã nói gì',
    slug: 'rx-8-5-kiem-tra',
    type: 'QUIZ',
    isFreePreview: true,
    description: 'Mười câu tình huống trên đúng những gì Chương 8 đã đo: Profiler trên bản build thường, 200 thẻ chạy lại, memo bị hàm mới phá, useMemo 0,1 ms, React Compiler và Babel 8, barrel kéo zod, test của route lười, lazy trong component, ảnh thiếu kích thước, div mà axe khen.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>What the measurements said</h2>
<p class="lead">Ten questions, fifteen minutes. Each one gives a situation the chapter actually ran and asks for a number or the reason behind it: how many commits, how many cards re-rendered, why a fix did nothing, which file ended up in which chunk, what the keyboard could reach. Several wrong options are the answers people give before they measure.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can wrap part of the tree in <code>&lt;Profiler&gt;</code>, read <code>actualDuration</code> against <code>baseDuration</code>, and I know which build calls <code>onRender</code>.</li>
<li>I can explain why a parent re-render runs every child, and what <code>memo</code> compares.</li>
<li>I can spot a prop that silently cancels <code>memo</code>, and decide with a number whether <code>useMemo</code>/<code>useCallback</code> is worth it.</li>
<li>I can turn on React Compiler and verify that it actually compiled my components.</li>
<li>I can split routes with <code>lazy</code>, check in the build output that a library really moved, and fix tests that lazy routes break.</li>
<li>I can build a keyboard-usable control from native HTML, and I know what axe can and cannot tell me.</li>
</ul>
${slide('rx-08', 28, 'Chapter 8 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Số đo đã nói gì</h2>
<p class="lead">Mười câu, mười lăm phút. Câu nào cũng đưa một tình huống chương đã chạy thật và hỏi một con số hoặc lý do đằng sau nó: mấy lần commit, mấy thẻ render lại, vì sao một cách sửa không có tác dụng, file nào nằm trong chunk nào, bàn phím tới được đâu. Nhiều phương án sai chính là câu trả lời người ta hay đưa ra trước khi đo.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi bọc được một phần cây bằng <code>&lt;Profiler&gt;</code>, đọc <code>actualDuration</code> so với <code>baseDuration</code>, và biết bản build nào có gọi <code>onRender</code>.</li>
<li>Tôi giải thích được vì sao cha render lại thì mọi con chạy lại, và <code>memo</code> so sánh cái gì.</li>
<li>Tôi nhận ra prop nào âm thầm vô hiệu hoá <code>memo</code>, và quyết định bằng con số xem <code>useMemo</code>/<code>useCallback</code> có đáng không.</li>
<li>Tôi bật được React Compiler và kiểm được nó có thật sự biên dịch component của tôi không.</li>
<li>Tôi chia được route bằng <code>lazy</code>, kiểm trong output của build xem thư viện có thật sự dời đi không, và sửa được các test bị route lười làm hỏng.</li>
<li>Tôi dựng được điều khiển dùng được bằng bàn phím từ HTML có sẵn, và biết axe nói được gì, không nói được gì.</li>
</ul>
${slide('rx-08', 28, 'Bảng tra nhanh Chương 8')}
</div>
`,
    quiz: {
      timeLimitSeconds: 900,
      questions: [
        {
          question: 'You build the app with a plain "npx vite build", open /bac-si?nhieu=200 with vite preview, and click ♡ seven times. KhuBacSi is wrapped in <Profiler onRender>, which pushes into window.__nhatKyDo. How many entries does the array get?|||Bạn build app bằng "npx vite build" bình thường, mở /bac-si?nhieu=200 bằng vite preview và bấm ♡ bảy lần. KhuBacSi được bọc bằng <Profiler onRender>, ghi vào window.__nhatKyDo. Mảng có bao nhiêu phần tử?',
          options: ['7 — one commit per click|||7 — mỗi cú bấm một commit', '14 — StrictMode renders twice|||14 — StrictMode render hai lần', '0 — the normal production build never calls onRender|||0 — bản build production thường không bao giờ gọi onRender', '200 — one per card|||200 — mỗi thẻ một'],
          correctIndex: 2,
          points: 1,
          explanation: 'EN: Lesson 8.1 measured commit/lần = 0,0,0,0,0,0,0 on the normal build: React disables profiling in production. Only "--mode profiling" (aliasing react-dom/client to react-dom/profiling) gave 1 commit per click. “7” is what you expect from the profiling build; “14” confuses StrictMode, which only double-renders in development.|||VI: Bài 8.1 đo được commit/lần = 0,0,0,0,0,0,0 trên bản build thường: React tắt phần đo ở production. Chỉ khi "--mode profiling" (alias react-dom/client sang react-dom/profiling) mới ra 1 commit mỗi cú bấm. “7” là thứ bạn mong ở bản profiling; “14” nhầm với StrictMode, thứ chỉ render hai lần ở dev.',
        },
        {
          question: 'Before any memo: 200 doctors on /bac-si, you click ♡ on one doctor. How many times does TheBacSi run?|||Chưa có memo nào: /bac-si có 200 bác sĩ, bạn bấm ♡ một bác sĩ. TheBacSi chạy bao nhiêu lần?',
          options: ['200|||200', '1 — only the clicked card|||1 — chỉ thẻ được bấm', '2 — the clicked card and the favourites list|||2 — thẻ được bấm và danh sách yêu thích', '0 — Zustand updates the DOM directly|||0 — Zustand sửa DOM trực tiếp'],
          correctIndex: 0,
          points: 1,
          explanation: 'EN: Measured: 1 commit, TheBacSi ran 200 times, 1 card actually changed. KhuBacSi subscribes to the favourites array; when it changes KhuBacSi re-renders and React re-renders every child by default, without looking at props. “1” is the result AFTER memo(TheBacSi) — it does not happen by itself.|||VI: Đo được: 1 commit, TheBacSi chạy 200 lần, 1 thẻ thật sự đổi. KhuBacSi nghe mảng yêu thích; mảng đổi thì KhuBacSi render lại và mặc định React render lại mọi con mà không nhìn props. “1” là kết quả SAU khi có memo(TheBacSi) — nó không tự xảy ra.',
        },
        {
          question: 'TheThuong is wrapped: "const TheMemo = memo(TheThuong)". The parent renders "<TheMemo bacSi={bs} laYeuThich={…} onDoi={doi} />" where "const doi = (id) => setYeuThich(…)" is written in the parent body. Clicking ♡ on one of 200 cards re-runs how many cards?|||TheThuong được bọc: "const TheMemo = memo(TheThuong)". Cha render "<TheMemo bacSi={bs} laYeuThich={…} onDoi={doi} />" với "const doi = (id) => setYeuThich(…)" viết trong thân cha. Bấm ♡ một trong 200 thẻ làm bao nhiêu thẻ chạy lại?',
          options: ['1 — memo skips the other 199|||1 — memo bỏ qua 199 thẻ kia', '0 — memo skips all of them|||0 — memo bỏ qua hết', '199|||199', '200 — doi is a new function on every render|||200 — doi là hàm mới ở mỗi lần render'],
          correctIndex: 3,
          points: 1,
          explanation: 'EN: bai2.test measured [memo-ham-moi] 200. memo compares each prop with Object.is; "doi" is recreated on every parent render, so onDoi “changed” for all 200 cards. With useCallback(…, []) the same test gave 1. “1” is the tempting answer if you forget that functions are compared by reference.|||VI: bai2.test đo được [memo-ham-moi] 200. memo so từng prop bằng Object.is; "doi" được tạo lại mỗi lần cha render, nên onDoi “đổi” ở cả 200 thẻ. Có useCallback(…, []) thì cùng test ra 1. “1” là đáp án hấp dẫn nếu quên rằng hàm được so theo tham chiếu.',
        },
        {
          question: 'locBacSi (filter + accent stripping) measured 96 µs for 200 doctors and 475 µs for 1000. A colleague wants to wrap its call in useMemo “for performance”. Best answer?|||locBacSi (lọc + bỏ dấu) đo được 96 µs với 200 bác sĩ và 475 µs với 1000. Một đồng nghiệp muốn bọc lời gọi nó bằng useMemo “cho nhanh”. Trả lời tốt nhất?',
          options: ['Yes — always memoise filters|||Có — bộ lọc thì luôn nên memo', 'Not needed: it is far below the ~1 ms guideline, and useMemo itself costs a dependency comparison and memory|||Không cần: nó dưới xa mức gợi ý ~1 ms, và useMemo tự nó cũng tốn một lần so phụ thuộc và bộ nhớ', 'Yes — useMemo has no cost|||Có — useMemo không tốn gì', 'No — useMemo only works with server components|||Không — useMemo chỉ chạy với server component'],
          correctIndex: 1,
          points: 1,
          explanation: 'EN: 0.1 ms is a tenth of react.dev’s ~1 ms rule of thumb, so the app does not memoise it. useMemo is useful for expensive calculations or to keep a reference stable for a memoised child/effect — neither applies. “No cost” is wrong: every render still compares dependencies and keeps the old value.|||VI: 0,1 ms bằng một phần mười mức gợi ý ~1 ms của react.dev, nên app không memo nó. useMemo có ích cho phép tính đắt hoặc để giữ tham chiếu ổn định cho con đã memo/effect — cả hai đều không đúng ở đây. “Không tốn gì” là sai: mỗi lần render vẫn so phụ thuộc và giữ giá trị cũ.',
        },
        {
          question: 'You enable React Compiler with @rolldown/plugin-babel and "npm i -D @babel/core" (8.0.6). The build is green, but a ♡ still costs 10.7 ms in the profiling build. What is the most likely explanation, and how do you confirm it?|||Bạn bật React Compiler bằng @rolldown/plugin-babel và "npm i -D @babel/core" (8.0.6). Build xanh, nhưng một cú ♡ vẫn tốn 10,7 ms trên bản profiling. Giải thích khả dĩ nhất là gì, kiểm bằng cách nào?',
          options: ['The compiler only works in vite dev|||Compiler chỉ chạy ở vite dev', 'The profiling build turns the compiler off|||Bản build profiling tắt compiler', 'The compiler hit a CompileError on TheBacSi and silently left it uncompiled — the compiler logger shows it|||Compiler gặp CompileError ở TheBacSi và âm thầm để nguyên nó — logger của compiler cho thấy', 'React 19.3 does not support the compiler|||React 19.3 không hỗ trợ compiler'],
          correctIndex: 2,
          points: 1,
          explanation: 'EN: The logger printed “TheBacSi.tsx: CompileError — Expected object property value to be an LVal, got: AssignmentPattern” with @babel/core 8.0.6; the build printed no warning. With @babel/core 7.29.7 TheBacSi compiled (30 memo slots) and the click dropped to 2.6 ms. The other options are false: the compiler runs in builds, and React 19 is its primary target.|||VI: Logger in ra “TheBacSi.tsx: CompileError — Expected object property value to be an LVal, got: AssignmentPattern” với @babel/core 8.0.6; build không in cảnh báo nào. Với @babel/core 7.29.7 thì TheBacSi được biên dịch (30 ô nhớ) và cú bấm xuống 2,6 ms. Các phương án khác sai: compiler chạy lúc build, và React 19 là đích chính của nó.',
        },
        {
          question: 'You made /dat-lich, /lich-hen and /dang-nhap lazy. The build shows three small page chunks, but zod and react-hook-form are still inside index-*.js. Why?|||Bạn đã cho /dat-lich, /lich-hen, /dang-nhap tải lười. Build có ba chunk trang nhỏ, nhưng zod và react-hook-form vẫn nằm trong index-*.js. Vì sao?',
          options: ['The eagerly loaded detail page imports the feature’s index.ts, which re-exports the form and schema — a static import|||Trang chi tiết (tải ngay) import index.ts của tính năng, mà file đó re-export form và schema — một import tĩnh', 'Vite cannot split code that comes from node_modules|||Vite không chia được code đến từ node_modules', 'The object form of lazy does not create chunks|||Dạng object của lazy không tạo chunk', 'zod has side effects, so bundlers always keep it in the entry|||zod có side effect nên bundler luôn giữ nó ở file vào'],
          correctIndex: 0,
          points: 1,
          explanation: 'EN: Lesson 8.3: the first attempt left index at 344.67 kB and the up-front total at 489.13 kB. Splitting the barrel into a light door (index.ts) and a heavy door (form.ts) moved zod + RHF into form-*.js and index to 230.11 kB. Node_modules code is split all the time (react-router went into a shared chunk), and the object form of lazy did create the page chunks.|||VI: Bài 8.3: lần thử đầu để index 344,67 kB và tổng tải ngay 489,13 kB. Tách barrel thành cửa nhẹ (index.ts) và cửa nặng (form.ts) mới dời zod + RHF sang form-*.js và index còn 230,11 kB. Code trong node_modules vẫn chia bình thường (react-router sang một chunk dùng chung), và dạng object của lazy có tạo chunk trang.',
        },
        {
          question: 'After making /dat-lich lazy, this Chapter 7 test fails with “expected ‘/bac-si/bs-2’ to be ‘/dat-lich/…’”: "await user.click(link); expect(router.state.location.pathname).toBe(‘/dat-lich/…’)". What is the right fix?|||Sau khi cho /dat-lich tải lười, test Chương 7 này đỏ với “expected ‘/bac-si/bs-2’ to be ‘/dat-lich/…’”: "await user.click(link); expect(router.state.location.pathname).toBe(‘/dat-lich/…’)". Sửa đúng là gì?',
          options: ['Replace createMemoryRouter with createBrowserRouter in tests|||Đổi createMemoryRouter thành createBrowserRouter trong test', 'Wait for the new page (findByRole on its heading) before checking the URL — the location changes only after the chunk loads|||Đợi trang mới (findByRole tiêu đề của nó) rồi mới kiểm URL — location chỉ đổi sau khi chunk tải xong', 'Add a setTimeout of 1000 ms after the click|||Thêm setTimeout 1000 ms sau cú bấm', 'Remove lazy from that route in tests only|||Bỏ lazy khỏi route đó chỉ trong test'],
          correctIndex: 1,
          points: 1,
          explanation: 'EN: With a lazy route React Router first loads the page code; navigation.state is "loading", the old page stays and location is unchanged. Waiting for what the user waits for (the "Đặt lịch khám" heading) fixed it. A fixed timeout is flaky and slow; removing lazy in tests means testing a different app.|||VI: Với route lười, React Router tải mã trang trước; navigation.state là "loading", trang cũ vẫn hiện và location chưa đổi. Đợi đúng thứ người dùng đợi (tiêu đề "Đặt lịch khám") là sửa được. Hẹn giờ cố định vừa chập chờn vừa chậm; bỏ lazy trong test là test một app khác.',
        },
        {
          question: 'A component declares "const HuongDan = lazy(() => import(‘./HuongDanKham’))" INSIDE its body, and renders it in a <Suspense fallback="Đang tải…">. The guide is already on screen. You click an unrelated counter button in the same component three times. How many times does “Đang tải…” reappear?|||Một component khai "const HuongDan = lazy(() => import(‘./HuongDanKham’))" BÊN TRONG thân nó, và render trong <Suspense fallback="Đang tải…">. Hướng dẫn đã hiện. Bạn bấm ba lần một nút đếm không liên quan trong cùng component. “Đang tải…” hiện lại mấy lần?',
          options: ['0 — the module is already cached|||0 — module đã có trong cache', '1 — only the first time|||1 — chỉ lần đầu', '2|||2', '3 — each render creates a new component type, so React remounts it|||3 — mỗi lần render tạo một loại component mới, nên React dựng lại nó'],
          correctIndex: 3,
          points: 1,
          explanation: 'EN: bai3.test measured 3 of 3 for the in-component version and 0 for the module-level version. The browser’s module cache does not help: lazy() returns a new component type on each call, and a different type at the same position means unmount + mount (and a new suspension). “0” is the answer for lazy declared at module level.|||VI: bai3.test đo được 3/3 với bản khai trong component và 0 với bản khai ở cấp module. Cache module của trình duyệt không giúp gì: lazy() trả về một loại component mới mỗi lần gọi, mà khác loại ở cùng vị trí nghĩa là gỡ + dựng (và treo lại). “0” là đáp án cho lazy khai ở cấp module.',
        },
        {
          question: '200 cards with 96×96 avatars, "loading="lazy"", but the <img> has NO width/height attributes. What did Chromium measure when the page opened?|||200 thẻ có ảnh đại diện 96×96, "loading="lazy"", nhưng <img> KHÔNG có thuộc tính width/height. Chromium đo được gì khi mở trang?',
          options: ['57 images, CLS 0 — same as with dimensions|||57 ảnh, CLS 0 — như khi có kích thước', '200 images, CLS 0 — lazy is ignored|||200 ảnh, CLS 0 — lazy bị bỏ qua', '111 images and CLS 0.348 — unloaded images are 0 px tall, so more of them count as near the viewport, and the page jumps when they arrive|||111 ảnh và CLS 0,348 — ảnh chưa tải cao 0 px nên nhiều ảnh hơn bị coi là gần màn hình, và trang nhảy khi ảnh về', 'No images until the user scrolls|||Không ảnh nào cho tới khi người dùng cuộn'],
          correctIndex: 2,
          points: 1,
          explanation: 'EN: Measured: eager 200 images/3587 kB; lazy with dimensions 57 images/1003 kB, CLS 0.000; lazy without dimensions 111 images/1971 kB, CLS 0.348 (poor is > 0.25). “No images until scroll” is wrong: lazy still loads what is on or near the screen.|||VI: Đo được: eager 200 ảnh/3587 kB; lazy có kích thước 57 ảnh/1003 kB, CLS 0,000; lazy thiếu kích thước 111 ảnh/1971 kB, CLS 0,348 (kém là > 0,25). “Không ảnh nào cho tới khi cuộn” là sai: lazy vẫn tải những ảnh trên hoặc gần màn hình.',
        },
        {
          question: 'A time picker is made of "<div className="o-gio" onClick={…}>08:00</div>" items. You run axe-core on it and try the keyboard. What happens?|||Một bộ chọn giờ làm bằng các "<div className="o-gio" onClick={…}>08:00</div>". Bạn chạy axe-core và thử bằng bàn phím. Chuyện gì xảy ra?',
          options: ['axe reports several errors, but the keyboard works|||axe báo nhiều lỗi, nhưng bàn phím dùng được', 'axe reports 0 errors, and Tab never reaches the slots — automated checks cannot see missing behaviour|||axe báo 0 lỗi, và Tab không bao giờ tới các ô giờ — kiểm tự động không thấy được hành vi bị thiếu', 'axe reports button-name for every div|||axe báo button-name cho mọi div', 'Adding aria-label to each div makes it keyboard-usable|||Thêm aria-label cho mỗi div là dùng được bằng bàn phím'],
          correctIndex: 1,
          points: 1,
          explanation: 'EN: bai4.test: [div onClick] axe 0 errors, 0 tab stops, Space/→ selected nothing, no radio role. A div with onClick breaks no axe rule; it just is not focusable or operable. aria-label adds a name, not focus or key handling (and on a role-less div it is even prohibited). Native radios gave 1 tab stop and arrow keys for free.|||VI: bai4.test: [div onClick] axe 0 lỗi, 0 điểm dừng Tab, Space/→ không chọn được gì, không có vai radio. div có onClick không phạm luật nào của axe; nó chỉ không nhận focus và không điều khiển được. aria-label thêm tên, không thêm focus hay xử lý phím (và trên div không vai thì còn bị cấm). Radio thật cho sẵn 1 điểm dừng Tab và phím mũi tên.',
        },
      ],
    },
};

export default {
  title: 'Chapter 8 — Performance and accessibility|||Chương 8 — Hiệu năng và khả năng tiếp cận',
  description: 'Đo trước khi tối ưu bằng React Profiler và Chromium chậm 4×, memo đúng chỗ số đo chỉ ra và thử React Compiler, tách bundle theo route và tải ảnh lười, làm component dùng được bằng bàn phím và kiểm bằng axe — mọi con số đo thật trên app đặt lịch.',
  lessons: [L0, L1, L2, L3, L4, Q],
};
