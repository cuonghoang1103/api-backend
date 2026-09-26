import { gallery, slide } from './_slides.mjs';

/**
 * React — Chương 14: Lên production — CHƯƠNG CUỐI (soạn 26/09/2026 theo content/courses/react/_HOP-DONG.md, mục 2–7, 4c, 11).
 * Chương MỚI (không có trong khung): rx-14-0-slides (DOCUMENT), rx-14-1-xac-thuc, rx-14-2-api-that, rx-14-3-build-deploy,
 * rx-14-4-phong-van (LESSON), rx-14-5-thi-cuoi-khoa (QUIZ — bài thi cuối khoá 20 câu, 1800 giây, đáp án 5/5/5/5).
 * Mọi mã dài và mọi output trong bài chạy THẬT 26/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch14 — chép từ
 * ảnh chụp sau-ch13 (181 test xanh). Ảnh chụp sau chương: SCRATCH/rx/du-an/sau-ch14 (208 test xanh).
 * (react 19.3.0 · vite 8.3.1 · typescript 6.0.3 · vitest 5.0.2 · msw 2.15.0 · @tanstack/react-query 5.103.3 · zod 4.6.5 ·
 *  zustand 5 · react-router 8.4.0 · rollup-plugin-visualizer 7.1.1 · @action-validator/cli 0.6.0 · Chromium 149 qua
 *  playwright-core · nginx 1.27.5 trong Docker · Node 22.21.0 · npm 10.9.4).
 * Mã dài trong bài nằm ở hằng SN, output ở hằng OUT — sinh tự động từ chính các file/log đã chạy (gen-sn.mjs).
 * Sơ đồ: mermaid ngay trong bài, 2–3 sơ đồ mỗi bài dạy, nhãn VI ở khối VI, EN ở khối EN. Deck: scripts/slides-src/rx-14.mjs.
 */

const H = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '&#96;').replace(/\$\{/g, '&#36;{');
const pre = (lang, s) => '<pre><code class="language-' + lang + '">' + H(s) + '</code></pre>';
const out = (s) => '<div class="out">' + H(s) + '</div>';
const LINK = (href, ico, title, sub) => '<a class="link-card" href="' + href + '" target="_blank" rel="noopener"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';
/** Link trong site (không mở tab mới). */
const LINK_TRONG = (href, ico, title, sub) => '<a class="link-card" href="' + href + '"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';
/** Sơ đồ mermaid: trang học đọc textContent của <code class="language-mermaid"> rồi vẽ (LearnPageClient → mermaidRuntime). */
const MM = (src) => '<pre><code class="language-mermaid">' + H(src.trim()) + '</code></pre>';

/* ─── Mã trong bài: SINH TỰ ĐỘNG từ dự án thử ch14 (tsc -b sạch + vitest 208 xanh 26/09/2026) — đừng sửa tay ─── */
const SN = {
  store: "import { create } from 'zustand';\nimport { createJSONStorage, persist } from 'zustand/middleware';\n\nexport interface NguoiDung {\n  hoTen: string;\n  soDienThoai: string;\n}\n\ninterface DangNhapState {\n  nguoiDung: NguoiDung | null;\n  /** Chương 14: access token — CHỈ trong bộ nhớ (biến JS). F5 là mất, và đó là cố ý: cookie refresh lấy lại được. */\n  accessToken: string | null;\n  dangNhap: (nd: NguoiDung, accessToken: string) => void;\n  datToken: (accessToken: string) => void;\n  dangXuat: () => void;\n}\n\n/**\n * Chương 7 dựng store này để \"nhớ ai đang dùng máy\"; Chương 14 thêm access token THẬT từ POST /api/dang-nhap.\n * persist CHỈ lưu nguoiDung (tên để chào, và để cổng route biết \"người này từng đăng nhập\") — KHÔNG lưu token:\n * localStorage đọc được bằng mọi đoạn script chạy trên trang, kể cả script bị chèn (XSS, Bài 13.4).\n */\nexport const useDangNhapStore = create<DangNhapState>()(\n  persist(\n    (set) => ({\n      nguoiDung: null,\n      accessToken: null,\n      dangNhap: (nguoiDung, accessToken) => set({ nguoiDung, accessToken }),\n      datToken: (accessToken) => set({ accessToken }),\n      dangXuat: () => set({ nguoiDung: null, accessToken: null }),\n    }),\n    {\n      name: 'phong-kham-dang-nhap',\n      storage: createJSONStorage(() => localStorage),\n      partialize: (s) => ({ nguoiDung: s.nguoiDung }), // token KHÔNG xuống đĩa\n      version: 1,\n    },\n  ),\n);",
  phien: "import { goiApi, LoiApi } from '@/shared/api/http';\nimport { useDangNhapStore, type NguoiDung } from './dang-nhap-store';\n\n/** Câu trả lời của /api/dang-nhap và /api/lam-moi-token. Refresh token KHÔNG có ở đây — nó nằm trong cookie HttpOnly. */\nexport interface KetQuaPhien {\n  accessToken: string;\n  hetHanSau: number; // giây\n  nguoiDung: NguoiDung;\n}\n\n/** xacThuc: false ⇒ goiApi không gắn token, không \"401 → làm mới\" (sai mật khẩu KHÔNG phải token hết hạn). */\nexport const apiPhien = {\n  dangNhap: (soDienThoai: string, matKhau: string) =>\n    goiApi<KetQuaPhien>('/api/dang-nhap', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ soDienThoai, matKhau }),\n      xacThuc: false,\n    }),\n  lamMoi: () => goiApi<KetQuaPhien>('/api/lam-moi-token', { method: 'POST', xacThuc: false }),\n  dangXuat: () => goiApi<void>('/api/dang-xuat', { method: 'POST', xacThuc: false }),\n};\n\n/**\n * Đăng xuất ở MỌI tab: BroadcastChannel nói chuyện giữa các tab CÙNG nguồn (origin) của một trình duyệt.\n * Tab này đăng xuất ⇒ gửi 'dang-xuat' ⇒ tab kia xoá phiên ⇒ cổng route của nó đẩy sang /dang-nhap.\n * (Tab tự gửi thì KHÔNG tự nhận lại tin của mình.)\n */\ntype TinPhien = { loai: 'dang-xuat' } | { loai: 'dang-nhap'; nguoiDung: NguoiDung };\nconst kenh = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('phong-kham-phien');\n\nexport function langNgheTabKhac(): () => void {\n  if (!kenh) return () => {};\n  const nghe = (e: MessageEvent<TinPhien>) => {\n    const s = useDangNhapStore.getState();\n    if (e.data.loai === 'dang-xuat') s.dangXuat();\n    // tab kia vừa đăng nhập: nhận tên để chào; access token thì tab này tự lấy (401 → làm mới bằng cookie chung)\n    else if (e.data.loai === 'dang-nhap' && !s.nguoiDung) useDangNhapStore.setState({ nguoiDung: e.data.nguoiDung });\n  };\n  kenh.addEventListener('message', nghe);\n  return () => kenh.removeEventListener('message', nghe);\n}\n\nexport function luuPhien(kq: KetQuaPhien) {\n  useDangNhapStore.getState().dangNhap(kq.nguoiDung, kq.accessToken);\n  kenh?.postMessage({ loai: 'dang-nhap', nguoiDung: kq.nguoiDung } satisfies TinPhien);\n}\n\n/** Xoá phiên ở client (tab này + báo các tab khác). */\nexport function xoaPhien() {\n  useDangNhapStore.getState().dangXuat();\n  kenh?.postMessage({ loai: 'dang-xuat' } satisfies TinPhien);\n}\n\n/**\n * Hàm \"làm mới\" mà http.ts gọi khi gặp 401. 401 ở ĐÂY nghĩa là cookie refresh cũng hết/bị thu hồi ⇒ phiên hết thật\n * ⇒ đăng xuất, trả null. Lỗi MẠNG thì ném tiếp: chưa biết phiên còn hay không, đừng đá người dùng ra vì rớt Wi-Fi.\n */\nexport async function lamMoiToken(): Promise<string | null> {\n  try {\n    const kq = await apiPhien.lamMoi();\n    useDangNhapStore.getState().dangNhap(kq.nguoiDung, kq.accessToken);\n    return kq.accessToken;\n  } catch (loi) {\n    if (loi instanceof LoiApi && loi.status === 401) {\n      xoaPhien();\n      return null;\n    }\n    throw loi;\n  }\n}\n\n/** Đăng xuất: báo máy chủ thu hồi refresh token, rồi xoá ở client — kể cả khi gọi máy chủ hỏng (finally). */\nexport async function dangXuat() {\n  try {\n    await apiPhien.dangXuat();\n  } finally {\n    xoaPhien();\n  }\n}",
  httpXacThuc: "/**\n * Chương 14: cách lấy và làm mới token do tầng APP cắm vào (src/app/phien.ts). shared/ không được import features/\n * (luật Chương 7) nên http.ts chỉ biết \"có ai đó đưa token cho tôi\" — đảo phụ thuộc, test cũng cắm được bản giả.\n */\nexport interface XacThuc {\n  layToken: () => string | null;\n  /** Đổi refresh cookie lấy access token mới. null ⇒ phiên hết thật (đã tự đăng xuất). Ném LoiMang ⇒ chưa biết. */\n  lamMoi: () => Promise<string | null>;\n}\nlet xacThuc: XacThuc | null = null;\nexport function caiXacThuc(x: XacThuc | null) {\n  xacThuc = x;\n}\n\n/**\n * MỘT lần làm mới cho mọi request cùng gặp 401. Trang lịch hẹn gọi 3 API cùng lúc, cả 3 nhận 401 ⇒ không có biến\n * này là 3 lần POST /api/lam-moi-token — và với refresh token xoay vòng, lần thứ 2 dùng token đã bị thu hồi ⇒ 401\n * ⇒ bị đăng xuất oan. Promise đang chạy được CHIA SẺ: ai tới sau chỉ chờ chung.\n */\nlet dangLamMoi: Promise<string | null> | null = null;\nfunction lamMoiChung(): Promise<string | null> {\n  dangLamMoi ??= xacThuc!.lamMoi().finally(() => {\n    dangLamMoi = null;\n  });\n  return dangLamMoi;\n}",
  goiApi: "/**\n * Gọi API rồi đọc JSON. fetch chỉ ném lỗi khi KHÔNG có câu trả lời; 404/500 vẫn \"thành công\" (res.ok = false)\n * ⇒ phải tự kiểm và tự ném LoiApi.\n * Chương 14: gắn access token; gặp 401 ⇒ làm mới (một lần chung) ⇒ gửi lại ĐÚNG MỘT lần. Lần gửi lại vẫn 401\n * thì thôi — không vòng lặp.\n */\nexport async function goiApi<T>(duongDan: string, tuyChon: TuyChonGoi = {}): Promise<T> {\n  const canToken = tuyChon.xacThuc !== false && xacThuc !== null;\n  const daDung = canToken ? xacThuc!.layToken() : null;\n  let res = await gui(duongDan, tuyChon, daDung);\n  if (res.status === 401 && canToken) {\n    const hienTai = xacThuc!.layToken();\n    // Request khác đã làm mới xong trong lúc request này đang bay ⇒ dùng luôn token mới, khỏi làm mới lần nữa\n    const moi = hienTai && hienTai !== daDung ? hienTai : await lamMoiChung();\n    if (moi) res = await gui(duongDan, tuyChon, moi);\n  }\n  if (!res.ok) {\n    const than = (await res.json().catch(() => null)) as { loi?: string } | null;\n    throw new LoiApi(res.status, than?.loi ?? `HTTP ${res.status}`);\n  }\n  if (res.status === 204) return undefined as T; // \"không có nội dung\" (đăng xuất) — res.json() sẽ ném\n  return (await res.json()) as T;\n}",
  tuyChon: "export interface TuyChonGoi extends RequestInit {\n  /** ms chờ tối đa (mặc định 10 giây). Hết giờ ⇒ LoiMang('het-gio'). */\n  thoiGianCho?: number;\n  /** false: KHÔNG gắn token, KHÔNG làm mới khi 401 (dùng cho chính đăng nhập / làm mới / đăng xuất). */\n  xacThuc?: boolean;\n}",
  appPhien: "import type { QueryClient } from '@tanstack/react-query';\nimport { lamMoiToken, langNgheTabKhac, useDangNhapStore } from '@/features/dang-nhap';\nimport { caiXacThuc } from '@/shared/api/http';\nimport { khoa } from '@/shared/api/khoa';\n\n/**\n * Chương 14: nối \"phiên đăng nhập\" (features/dang-nhap) với tầng gọi API (shared/api) và cache (TanStack Query).\n * Tầng app là chỗ DUY NHẤT được biết cả ba — shared/ không import features/ (Chương 7).\n */\nexport function ketNoiPhien(queryClient: QueryClient): () => void {\n  caiXacThuc({ layToken: () => useDangNhapStore.getState().accessToken, lamMoi: lamMoiToken });\n  const boNghe = langNgheTabKhac();\n  // Vừa đăng xuất (ở tab này hay tab khác) ⇒ bỏ dữ liệu RIÊNG của người cũ khỏi cache. Không bỏ: người đăng nhập\n  // sau trên cùng máy thấy lịch hẹn của người trước trong tích tắc trước khi tải lại (đo ở Bài 14.1).\n  const boTheoDoi = useDangNhapStore.subscribe((s, truoc) => {\n    if (truoc.nguoiDung && !s.nguoiDung) queryClient.removeQueries({ queryKey: khoa.lichHen });\n  });\n  return () => {\n    boNghe();\n    boTheoDoi();\n  };\n}",
  mockNguoiGoi: "/**\n * Chương 14: ai đang gọi? Đọc \"Authorization: Bearer <access token>\". Không có / hết hạn ⇒ null ⇒ handler trả 401.\n * Đây mới là chỗ CHẶN THẬT — cổng đăng nhập của React Router (Chương 7) chỉ là trải nghiệm, ai cũng gọi thẳng API được.\n */\nfunction nguoiGoi(request: Request): TaiKhoan | null {\n  const m = request.headers.get('Authorization')?.match(/^Bearer (.+)$/);\n  return m ? phien.kiemAccess(m[1]) : null;\n}\nconst loi401 = () => HttpResponse.json({ loi: 'Phiên đăng nhập đã hết hạn' }, { status: 401 });\n\n/**\n * Refresh token đi trong cookie HttpOnly: trình duyệt tự đính kèm, JavaScript của trang KHÔNG đọc được.\n * Path=/api ⇒ trình duyệt chỉ đính kèm cookie khi gọi /api/… (không kèm khi tải ảnh, trang, file JS).\n * Secure: chỉ gửi qua HTTPS — trình duyệt (và bộ cookie của MSW) coi http://localhost là an toàn nên vẫn chạy khi dev.\n */\nconst cookieRefresh = (rt: string) => `rt=${rt}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=${7 * 24 * 3600}`;\nconst XOA_COOKIE = 'rt=; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=0';",
  mockDangNhap: "  http.post('/api/dang-nhap', async ({ request }) => {\n    await treMang();\n    const { soDienThoai, matKhau } = (await request.json()) as { soDienThoai?: string; matKhau?: string };\n    const tk = TAI_KHOAN.find((x) => x.soDienThoai === soDienThoai);\n    // CÙNG một câu cho \"không có số này\" và \"sai mật khẩu\": đừng giúp kẻ dò xem số nào có tài khoản\n    if (!tk || tk.matKhau !== matKhau) return HttpResponse.json({ loi: 'Sai số điện thoại hoặc mật khẩu' }, { status: 401 });\n    return HttpResponse.json(\n      { accessToken: phien.capAccess(tk.soDienThoai), hetHanSau: thoiHanAccess(), nguoiDung: { hoTen: tk.hoTen, soDienThoai: tk.soDienThoai } },\n      { headers: { 'Set-Cookie': cookieRefresh(phien.capRefresh(tk.soDienThoai)) } },\n    );\n  }),\n\n  http.post('/api/lam-moi-token', async ({ cookies }) => {\n    await treMang();\n    const moi = cookies.rt ? phien.xoayVong(cookies.rt) : null;\n    if (!moi) return HttpResponse.json({ loi: 'Cần đăng nhập lại' }, { status: 401, headers: { 'Set-Cookie': XOA_COOKIE } });\n    return HttpResponse.json(\n      { accessToken: moi.accessToken, hetHanSau: thoiHanAccess(), nguoiDung: { hoTen: moi.tk.hoTen, soDienThoai: moi.tk.soDienThoai } },\n      { headers: { 'Set-Cookie': cookieRefresh(moi.refreshToken) } },\n    );\n  }),\n\n  http.post('/api/dang-xuat', async ({ cookies }) => {\n    await treMang();\n    phien.thuHoi(cookies.rt); // refresh token chết ở MÁY CHỦ — xoá ở client thôi là chưa đủ\n    return new HttpResponse(null, { status: 204, headers: { 'Set-Cookie': XOA_COOKIE } });\n  }),",
  mockLichHen: "  http.get('/api/lich-hen', async ({ request }) => {\n    await treMang();\n    const tk = nguoiGoi(request);\n    if (!tk) return loi401();\n    // Chương 14: mỗi người CHỈ thấy lịch của mình — máy chủ lọc theo tài khoản trong token, không theo tham số client gửi\n    return HttpResponse.json(db.lichHen().filter((lh) => lh.benhNhan.soDienThoai === tk.soDienThoai));\n  }),",
  mockPhien: "export const phien = {\n  capAccess(soDienThoai: string): string {\n    const t = ngauNhien('at');\n    access.set(t, { soDienThoai, hetHanLuc: Date.now() + thoiHanAccess() * 1000 });\n    return t;\n  },\n  capRefresh(soDienThoai: string): string {",
  xoayVong: "  /** Đổi refresh cũ lấy cặp mới. Refresh không hợp lệ (hoặc đã dùng rồi) ⇒ null. */\n  xoayVong(rtCu: string) {\n    const sdt = refresh.get(rtCu);\n    if (!sdt) return null;\n    refresh.delete(rtCu); // dùng một lần\n    ghiLai();\n    const tk = TAI_KHOAN.find((x) => x.soDienThoai === sdt)!;\n    return { tk, accessToken: phien.capAccess(sdt), refreshToken: phien.capRefresh(sdt) };\n  },",
  form: "import { useMutation } from '@tanstack/react-query';\nimport { useState, type SubmitEvent } from 'react';\nimport { LoiApi } from '@/shared/api/http';\nimport { apiPhien, luuPhien } from './phien';\n\n/**\n * Chương 14: đăng nhập THẬT — POST /api/dang-nhap. Trả về access token (giữ trong bộ nhớ) + đặt cookie HttpOnly\n * chứa refresh token (trình duyệt giữ, JS không thấy). Xong thì store đổi ⇒ TrangDangNhap đưa về trang định vào.\n */\nexport function FormDangNhap() {\n  const [soDienThoai, setSoDienThoai] = useState('');\n  const [matKhau, setMatKhau] = useState('');\n  const [loiNhap, setLoiNhap] = useState<string | null>(null);\n  const dangNhap = useMutation({\n    mutationFn: (v: { sdt: string; matKhau: string }) => apiPhien.dangNhap(v.sdt, v.matKhau),\n    onSuccess: luuPhien,\n    meta: { tuXuLyLoi: true }, // lỗi hiện ngay trong form, không cần thông báo nổi\n  });\n\n  function gui(ev: SubmitEvent<HTMLFormElement>) {\n    ev.preventDefault();\n    const sdt = soDienThoai.replace(/[\\s.-]/g, '');\n    if (!/^0\\d{9}$/.test(sdt) || matKhau.length === 0) {\n      setLoiNhap('Nhập số điện thoại 10 số và mật khẩu.');\n      return;\n    }\n    setLoiNhap(null);\n    dangNhap.mutate({ sdt, matKhau });\n  }\n\n  const loi = loiNhap ?? (dangNhap.error ? thongDiep(dangNhap.error) : null);\n  return (\n    <form className=\"form-dat-lich\" onSubmit={gui} noValidate aria-label=\"Đăng nhập\">\n      {loi && (\n        <p className=\"loi-chung\" role=\"alert\">\n          {loi}\n        </p>\n      )}\n      <label htmlFor=\"dn-sdt\">Số điện thoại</label>\n      <input id=\"dn-sdt\" type=\"tel\" autoComplete=\"username\" value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)} />\n      <label htmlFor=\"dn-mk\">Mật khẩu</label>\n      <input id=\"dn-mk\" type=\"password\" autoComplete=\"current-password\" value={matKhau} onChange={(e) => setMatKhau(e.target.value)} />\n      <button type=\"submit\" className=\"nut nut-chinh\" disabled={dangNhap.isPending}>\n        {dangNhap.isPending ? 'Đang đăng nhập…' : 'Đăng nhập'}\n      </button>\n    </form>\n  );\n}\n\nfunction thongDiep(loi: Error) {\n  // 401 ở ĐÂY = sai thông tin đăng nhập, không phải \"phiên hết hạn\"\n  if (loi instanceof LoiApi && loi.status === 401) return 'Sai số điện thoại hoặc mật khẩu.';\n  return loi.message;\n}",
  headerDangXuat: "              onClick={async () => {\n                // RỜI trang trước, xoá đăng nhập SAU. Làm ngược lại: store đổi ⇒ cổng của /lich-hen (vẫn đang\n                // trên màn hình) vẽ lại và đẩy sang /dang-nhap trước — đo ở Bài 7.5. navigate() trả Promise từ React Router 7.\n                await navigate(duongDan.trangChu, { replace: true });\n                await dangXuat(); // Chương 14: báo máy chủ thu hồi refresh token, rồi xoá phiên ở MỌI tab\n              }}",
  setup: "// Chương 14: API lịch hẹn giờ đòi access token. Mọi test bắt đầu với MỘT token hợp lệ của bệnh nhân mẫu (0901234567)\n// — như app đã cắm phiên (src/app/phien.ts). nguoiDung vẫn null: cổng route vẫn coi là \"chưa đăng nhập\", nên test\n// của Chương 7 (bị đẩy sang /dang-nhap) giữ nguyên nghĩa. Test nào cần khác thì tự setState.\ncaiXacThuc({ layToken: () => useDangNhapStore.getState().accessToken, lamMoi: lamMoiToken });\nbeforeEach(() => {\n  useDangNhapStore.setState({ accessToken: phien.capAccess('0901234567') });\n});",
  httpTest401: "  test('access token hết hạn ⇒ 401 ⇒ POST /api/lam-moi-token ⇒ gửi lại ⇒ có dữ liệu', async () => {\n    await dangNhapThat();\n    const tokenCu = useDangNhapStore.getState().accessToken;\n    phien.choHetHanTatCa(); // như để máy 20 phút rồi quay lại\n    await expect(api.lichHen()).resolves.toEqual([]);\n    console.log('[14.1]', nhatKy.join(' → '));\n    expect(nhatKy).toEqual(['GET /api/lich-hen', 'POST /api/lam-moi-token', 'GET /api/lich-hen']);\n    expect(useDangNhapStore.getState().accessToken).not.toBe(tokenCu); // token mới vào store\n  });",
  httpTestBa: "  test('BA request cùng nhận 401 ⇒ chỉ MỘT lần làm mới, cả ba đều được gửi lại', async () => {\n    await dangNhapThat();\n    phien.choHetHanTatCa();\n    await Promise.all([api.lichHen(), api.lichHen(), api.lichHen()]);\n    console.log('[14.1] ba request cùng lúc:', `GET ${dem('GET /api/lich-hen')} lần, làm mới ${dem('POST /api/lam-moi-token')} lần`);\n    expect(dem('POST /api/lam-moi-token')).toBe(1);\n    expect(dem('GET /api/lich-hen')).toBe(6); // 3 lần đầu (401) + 3 lần gửi lại (200)\n  });",
  httpTestHet: "  test('cookie refresh cũng hết (máy chủ đã thu hồi) ⇒ đăng xuất, ném 401, KHÔNG lặp', async () => {\n    await dangNhapThat();\n    phien.datLai(); // máy chủ quên mọi phiên (vd đổi mật khẩu ở máy khác ⇒ thu hồi hết)\n    const loi = await api.lichHen().catch((e: unknown) => e);\n    console.log('[14.1] phiên hết thật:', nhatKy.join(' → '), '⇒', String(loi));\n    expect(loi).toBeInstanceOf(LoiApi);\n    expect((loi as LoiApi).status).toBe(401);\n    expect(dem('POST /api/lam-moi-token')).toBe(1);\n    expect(useDangNhapStore.getState().nguoiDung).toBeNull();\n  });",
  ngayTho: "async function goiNgayTho(duongDan: string) {\n  const gui = (token: string | null) => fetch(duongDan, { headers: token ? { Authorization: `Bearer ${token}` } : {} });\n  let res = await gui(useDangNhapStore.getState().accessToken);\n  if (res.status === 401) {\n    const moi = await lamMoiToken(); // ← MỖI request một lần, song song\n    if (moi) res = await gui(moi);\n  }\n  return res.status;\n}",
  phienTest: "async function doiNguoiDung(coKetNoi: boolean) {\n  lich('bs-2', ANH.soDienThoai, ANH.hoTen); // lịch của Ánh: BS. Trần Thu Hà\n  lich('bs-4', '0912345678', 'Nguyễn Văn Nam'); // lịch của Nam: BS. Phạm Ngọc Lan\n  useDangNhapStore.setState({ nguoiDung: ANH });\n  // mạng thật: GET /api/lich-hen mất ~300 ms. Handler không trả gì ⇒ MSW chuyển tiếp sang handler thật phía sau.\n  server.use(http.get('/api/lich-hen', () => delay(300)));\n  const user = userEvent.setup();\n  const { router, queryClient } = veTrang('/lich-hen');\n  const huy = coKetNoi ? ketNoiPhien(queryClient) : () => {};\n  expect(await screen.findByText('BS. Trần Thu Hà')).toBeInTheDocument();\n  await user.click(screen.getByRole('button', { name: 'Đăng xuất' }));\n  await act(() => router.navigate('/lich-hen')); // cổng ⇒ /dang-nhap\n  await user.type(await screen.findByLabelText('Số điện thoại'), '0912345678');\n  await user.type(screen.getByLabelText('Mật khẩu'), 'antam2026');\n  await user.click(screen.getByRole('button', { name: 'Đăng nhập' }));\n  await screen.findByRole('heading', { name: /^Lịch hẹn của tôi/ }); // trang lịch hẹn của Nam hiện ra\n  const thay = () => ['BS. Trần Thu Hà', 'BS. Phạm Ngọc Lan'].filter((t) => screen.queryByText(t)).join(' + ') || '(chưa có)';\n  const ngayKhiVao = thay();\n  await act(() => delay(1000)); // đợi mọi request đang bay về hết\n  const sau1Giay = thay();\n  huy();\n  return { ngayKhiVao, sau1Giay };\n}",
  tabTest: "test('đăng xuất ở tab A ⇒ tab B (kênh BroadcastChannel khác, cùng tên) nhận tin và xoá phiên', async () => {\n  const tabB = new BroadcastChannel('phong-kham-phien'); // giả \"tab kia\"\n  const nhan: unknown[] = [];\n  tabB.onmessage = (e) => nhan.push(e.data);\n  useDangNhapStore.setState({ nguoiDung: ANH });\n  xoaPhien(); // tab A (chính test này) đăng xuất\n  await expect.poll(() => nhan).toEqual([{ loai: 'dang-xuat' }]);\n\n  // chiều ngược: tab B đăng xuất ⇒ tab A (đang nghe) tự xoá phiên\n  useDangNhapStore.setState({ nguoiDung: ANH, accessToken: 'at-bat-ky' });\n  const boNghe = langNgheTabKhac();\n  tabB.postMessage({ loai: 'dang-xuat' });\n  await expect.poll(() => useDangNhapStore.getState().nguoiDung).toBeNull();\n  console.log('[14.1] tab B đăng xuất ⇒ tab A:', JSON.stringify({ nguoiDung: useDangNhapStore.getState().nguoiDung, accessToken: useDangNhapStore.getState().accessToken }));\n  boNghe();\n  tabB.close();\n});",
  loiMang: "/**\n * Chương 14: KHÔNG có câu trả lời HTTP nào. 'mat-mang' = không tới được máy chủ (rớt Wi-Fi, DNS, máy chủ tắt);\n * 'het-gio' = tới được nhưng chờ quá `thoiGianCho` mà chưa xong. Tách khỏi LoiApi để giao diện nói đúng chuyện.\n */\nexport class LoiMang extends Error {\n  readonly loai: 'mat-mang' | 'het-gio';\n  constructor(loai: 'mat-mang' | 'het-gio', message: string, options?: ErrorOptions) {\n    super(message, options);\n    this.name = 'LoiMang';\n    this.loai = loai;\n  }\n}",
  gui: "async function gui(duongDan: string, tuyChon: TuyChonGoi, token: string | null): Promise<Response> {\n  const { thoiGianCho = THOI_GIAN_CHO_MAC_DINH, xacThuc: _bo, signal, headers, ...init } = tuyChon;\n  const henGio = AbortSignal.timeout(thoiGianCho);\n  // Hai lý do để dừng: người gọi huỷ (TanStack Query khi rời trang) HOẶC hết giờ. AbortSignal.any gộp hai tín hiệu.\n  const tinHieu = signal ? AbortSignal.any([signal, henGio]) : henGio;\n  const h = new Headers(headers);\n  if (token) h.set('Authorization', `Bearer ${token}`);\n  try {\n    return await fetch(API_GOC + duongDan, { ...init, headers: h, signal: tinHieu, credentials: 'include' });\n  } catch (loi) {\n    if (signal?.aborted) throw loi; // người gọi TỰ huỷ — không phải lỗi mạng, để nguyên cho TanStack bỏ qua\n    if (henGio.aborted) throw new LoiMang('het-gio', 'Máy chủ phản hồi quá chậm', { cause: loi });\n    throw new LoiMang('mat-mang', 'Không kết nối được máy chủ', { cause: loi }); // fetch ném TypeError\n  }\n}",
  queryClient: "/**\n * Thử lại cái gì? Chỉ thứ có cơ hội tự khỏi: mất mạng / hết giờ (LoiMang), máy chủ lỗi 5xx, 408 (hết giờ phía máy\n * chủ) và 429 (bị giới hạn tần suất — đợi rồi thử). Lỗi 4xx còn lại (sai dữ liệu, không có, 401 đã được http.ts lo)\n * thử lại cũng y như cũ. Trần: 3 lần — hỏng mãi thì phải báo cho người dùng, không quay vòng vô hạn.\n */\nexport function nenThuLai(soLanDaHong: number, loi: Error) {\n  if (soLanDaHong >= 3) return false;\n  if (loi instanceof LoiApi) return loi.status >= 500 || loi.status === 408 || loi.status === 429;\n  return true; // LoiMang, TypeError… — không có câu trả lời thì có thể lần sau có\n}\n\n/**\n * Chương 14: chờ bao lâu trước lần thử thứ n. Luỹ thừa (1 s, 2 s, 4 s…, trần 8 s) + NGẪU NHIÊN (\"jitter\"):\n * máy chủ vừa sập rồi sống lại, 10.000 trình duyệt thử lại ĐÚNG cùng mili giây là đánh sập nó lần nữa.\n * (Mặc định của TanStack: min(1000 · 2^n, 30000), không ngẫu nhiên.)\n */\nexport function treThuLai(soLanDaHong: number) {\n  const tran = Math.min(1000 * 2 ** soLanDaHong, 8000);\n  return tran / 2 + Math.random() * (tran / 2); // nửa cố định + nửa ngẫu nhiên\n}",
  datLichApi: "  /**\n   * Chương 14: khoaLap = Idempotency-Key — MỘT khoá cho MỘT lần người dùng bấm \"Xác nhận\". Gửi lại cùng khoá (thử lại\n   * sau hết giờ, bấm hai lần) ⇒ máy chủ trả đúng lịch hẹn đã tạo thay vì tạo thêm cái thứ hai.\n   */\n  datLich: (duLieu: YeuCauDatLich, khoaLap?: string) =>\n    goiApi<LichHenCoGio>('/api/lich-hen', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json', ...(khoaLap ? { 'Idempotency-Key': khoaLap } : {}) },\n      body: JSON.stringify(duLieu),\n    }),",
  useDatLich: "export function useDatLich() {\n  const queryClient = useQueryClient();\n  // Chương 14: MỘT Idempotency-Key cho một lần mở trang đặt lịch. Sinh ở NGOÀI mutationFn: mutationFn chạy lại mỗi\n  // lần thử lại — sinh trong đó là mỗi lần một khoá mới, máy chủ không nhận ra \"đây là cùng một yêu cầu\".\n  const [khoaLap] = useState(() => crypto.randomUUID());\n  return useMutation({\n    mutationFn: (yc: YeuCauDatLich) => api.datLich(yc, khoaLap),\n    // Có khoá rồi mới DÁM thử lại một lệnh GHI — và chỉ khi không có câu trả lời (LoiMang), tối đa 2 lần\n    retry: (soLanDaHong, loi) => loi instanceof LoiMang && soLanDaHong < 2,",
  mockIdem: "    // Chương 14: cùng Idempotency-Key ⇒ đây là LẦN GỬI LẠI của một yêu cầu đã xử lý ⇒ trả lại kết quả cũ, không đặt thêm\n    const khoaLap = request.headers.get('Idempotency-Key');\n    const daCo = khoaLap ? daXuLy.get(khoaLap) : undefined;\n    if (daCo) return HttpResponse.json(daCo, { status: 201 });",
  useTrucTuyen: "import { useSyncExternalStore } from 'react';\n\n/**\n * Chương 14: trình duyệt có đang \"có mạng\" không. navigator.onLine là dữ liệu NGOÀI React, đổi qua sự kiện\n * online/offline ⇒ đúng việc của useSyncExternalStore (không phải useState + useEffect: dễ lỡ sự kiện giữa hai lần).\n * ⚠️ onLine === true chỉ nghĩa là \"có card mạng đang nối\" — không chứng minh tới được máy chủ. false thì chắc chắn mất.\n */\nfunction dangKy(baoDoi: () => void) {\n  window.addEventListener('online', baoDoi);\n  window.addEventListener('offline', baoDoi);\n  return () => {\n    window.removeEventListener('online', baoDoi);\n    window.removeEventListener('offline', baoDoi);\n  };\n}\n\nexport function useTrucTuyen() {\n  return useSyncExternalStore(dangKy, () => navigator.onLine, () => true);\n}",
  bangMatMang: "import { useTrucTuyen } from '@/shared/hooks/useTrucTuyen';\nimport { useDich } from '@/shared/i18n/useDich';\n\n/** Chương 14: dải báo \"mất mạng\" ở đầu trang. role=\"status\": trình đọc màn hình đọc lên khi nó xuất hiện. */\nexport function BangMatMang() {\n  const trucTuyen = useTrucTuyen();\n  const { t } = useDich();\n  if (trucTuyen) return null;\n  return (\n    <p className=\"bang-mat-mang\" role=\"status\">\n      {t('mang.matKetNoi')}\n    </p>\n  );\n}",
  baoLoi: "import { LoiApi, LoiMang } from '@/shared/api/http';\n\n/**\n * Chương 14: BÁO LỖI về nơi đội phát triển đọc được. Người dùng không mở console; lỗi không ai thấy thì không ai sửa.\n * Đây là phiên bản tối giản của thứ Sentry / GlitchTip / Datadog RUM làm (xem bài học): gom lỗi, bỏ nhiễu, gắn\n * phiên bản + trang đang mở, gửi đi bằng sendBeacon (vẫn gửi được khi người dùng đang đóng tab).\n */\nexport interface BaoCaoLoi {\n  ten: string;\n  thongDiep: string;\n  noi: string; // 'react' | 'window' | 'promise' | …\n  duongDan: string;\n  phienBan: string;\n  luc: string;\n  stack?: string;\n  componentStack?: string;\n}\n\nconst TRAN_MOI_TRANG = 10; // một vòng lặp lỗi không được biến thành 10.000 báo cáo\nconst daGui = new Set<string>();\nlet nguoiNhan: ((bc: BaoCaoLoi) => void) | null = null;\n\n/** Test (hoặc một SDK) cắm vào đây để nhận báo cáo thay vì gửi mạng. */\nexport function datNguoiNhan(f: ((bc: BaoCaoLoi) => void) | null) {\n  nguoiNhan = f;\n  daGui.clear();\n}\n\n/** Lỗi \"bình thường\" của đời sống — không phải bug trong mã: không báo. */\nfunction laNhieu(loi: Error) {\n  if (loi instanceof LoiMang) return true; // rớt Wi-Fi không phải bug\n  if (loi instanceof LoiApi && loi.status < 500) return true; // 404/409/401: app đã xử lý bằng giao diện\n  return loi.name === 'AbortError'; // rời trang giữa chừng\n}\n\nexport function baoLoi(loiGoc: unknown, noi: string, componentStack?: string) {\n  const loi = loiGoc instanceof Error ? loiGoc : new Error(String(loiGoc));\n  if (laNhieu(loi)) return;\n  const dau = `${loi.name}|${loi.message}|${noi}`;\n  if (daGui.has(dau) || daGui.size >= TRAN_MOI_TRANG) return; // trùng hoặc quá trần ⇒ bỏ\n  daGui.add(dau);\n  const bc: BaoCaoLoi = {\n    ten: loi.name,\n    thongDiep: loi.message,\n    noi,\n    duongDan: location.pathname, // KHÔNG gửi location.search/hash: có thể chứa token, số điện thoại…\n    phienBan: import.meta.env.VITE_PHIEN_BAN ?? 'dev',\n    luc: new Date().toISOString(),\n    stack: loi.stack,\n    componentStack,\n  };\n  if (nguoiNhan) return nguoiNhan(bc);\n  if (import.meta.env.DEV) console.error('[baoLoi]', bc);\n  const dich = import.meta.env.VITE_BAO_LOI_URL;\n  if (dich) navigator.sendBeacon(dich, new Blob([JSON.stringify(bc)], { type: 'application/json' }));\n}\n\n/** Gắn \"lưới\" bắt lỗi toàn trang: lỗi ném ngoài React (setTimeout, handler…) và promise bị từ chối mà không ai catch. */\nexport function batLoiToanTrang(): () => void {\n  const loiThuong = (e: ErrorEvent) => baoLoi(e.error ?? e.message, 'window');\n  const loiHua = (e: PromiseRejectionEvent) => baoLoi(e.reason, 'promise');\n  window.addEventListener('error', loiThuong);\n  window.addEventListener('unhandledrejection', loiHua);\n  return () => {\n    window.removeEventListener('error', loiThuong);\n    window.removeEventListener('unhandledrejection', loiHua);\n  };\n}",
  mainRoot: "batApiGia().then(() => {\n  createRoot(document.getElementById('root')!, {\n    // Chương 14 — React 19: MỘT chỗ nhận mọi lỗi render. \"caught\" = một error boundary đã bắt (người dùng thấy hộp\n    // lỗi); \"uncaught\" = không ai bắt (cả cây bị gỡ). Cả hai đều phải về tới đội phát triển.\n    onCaughtError: (loi, info) => baoLoi(loi, 'react', info.componentStack),\n    onUncaughtError: (loi, info) => baoLoi(loi, 'react-khong-ai-bat', info.componentStack),\n  }).render(",
  thongDiep: "import { LoiApi, LoiMang } from './http';\n\n/**\n * Chương 14: một lỗi ⇒ MỘT câu người dùng hiểu và biết phải làm gì. Không bao giờ in \"TypeError: Failed to fetch\"\n * hay stack trace ra màn hình; không lộ thông điệp nội bộ của 5xx (có thể chứa tên bảng, đường dẫn máy chủ).\n */\nexport function thongDiepLoi(loi: Error): string {\n  if (loi instanceof LoiMang) {\n    return loi.loai === 'het-gio'\n      ? 'Máy chủ phản hồi quá chậm. Thử lại sau ít phút.'\n      : 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.';\n  }\n  if (loi instanceof LoiApi) {\n    if (loi.status === 401) return 'Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.';\n    if (loi.status === 429) return 'Bạn thao tác quá nhanh. Đợi một chút rồi thử lại.';\n    if (loi.status >= 500) return 'Máy chủ đang gặp sự cố. Chúng tôi đã được báo, bạn thử lại sau nhé.';\n    return loi.message; // 4xx: máy chủ viết câu cho người dùng (vd \"Khung giờ này vừa có người đặt\")\n  }\n  return 'Đã có lỗi không mong muốn. Tải lại trang có thể giúp.';\n}",
  envDts: "/**\n * Chương 14: kiểu cho biến môi trường của Vite. Có khối ViteTypeOptions ⇒ import.meta.env.<tên lạ> là LỖI KIỂU\n * (gõ sai VITE_API_ULR là tsc đỏ, thay vì lặng lẽ ra undefined). Mọi biến VITE_* đều là CHUỖI (hoặc không có).\n */\ninterface ViteTypeOptions {\n  strictImportMetaEnv: unknown;\n}\n\ninterface ImportMetaEnv {\n  /** Gốc API, vd https://api.phong-kham.example. Trống ⇒ cùng tên miền với trang. */\n  readonly VITE_API_URL?: string;\n  /** '1' ⇒ bản build DEMO: bật API giả (MSW) cả ở production — cho host tĩnh không có backend. */\n  readonly VITE_API_GIA?: string;\n  /** Nơi nhận báo cáo lỗi (vd endpoint của Sentry/GlitchTip hoặc của chính backend). Không đặt ⇒ không gửi. */\n  readonly VITE_BAO_LOI_URL?: string;\n  /** Phiên bản đang chạy — CI đặt bằng mã commit, để báo cáo lỗi nói được lỗi thuộc bản nào. */\n  readonly VITE_PHIEN_BAN?: string;\n}\n\ninterface ImportMeta {\n  readonly env: ImportMetaEnv;\n}",
  envFiles: "# .env\n# Chương 14: biến môi trường dùng cho MỌI chế độ (commit được — KHÔNG có bí mật nào ở đây).\n# Chỉ biến bắt đầu bằng VITE_ mới vào được mã trình duyệt, và vào NGUYÊN VĂN trong file JS ai cũng tải về được.\nVITE_API_URL=\n\n# .env.demo\n# `vite build --mode demo`: bản trình diễn cho host tĩnh (GitHub Pages, Netlify…) — chưa có backend ⇒ bật API giả.\nVITE_API_GIA=1\n\n# .env.production\n# `vite build` (mode production): app thật gọi API thật. (Tên miền ví dụ — .example là đuôi dành riêng cho tài liệu.)\nVITE_API_URL=https://api.phong-kham.example\nVITE_BAO_LOI_URL=https://api.phong-kham.example/bao-loi",
  envThu: "# .env.local (THỬ — không commit: .gitignore có *.local)\nVITE_KHOA_GIPHY=gph_ThuNghiem_123\nKHOA_DB=postgres://admin:matkhau@db:5432/phongkham\n\n// src/main.tsx (THỬ, đã xoá sau khi đo)\nconsole.log('giphy:', import.meta.env.VITE_KHOA_GIPHY, '· db:', import.meta.env.KHOA_DB);",
  apiGoc: "/**\n * Chương 14: gốc của API, từ biến môi trường LÚC BUILD. Trống ⇒ cùng tên miền với trang ('/api/…').\n * .env.production: VITE_API_URL=https://api.phong-kham.example ⇒ mọi lời gọi đi tới đó.\n */\nexport const API_GOC = (import.meta.env.VITE_API_URL ?? '').replace(/\\/$/, '');\nexport const THOI_GIAN_CHO_MAC_DINH = 10_000;",
  testChapChon: "test('máy chủ chập chờn: 503, 503, rồi 200 ⇒ TanStack tự thử lại, người dùng chỉ thấy dữ liệu', async () => {\n  let lan = 0;\n  server.use(http.get('/api/bac-si', () => (++lan <= 2 ? HttpResponse.json({ loi: 'Quá tải' }, { status: 503 }) : undefined)));\n  const qc = taoQueryClient(); // client THẬT (có retry) — không phải taoClientTest (retry: false)\n  qc.setDefaultOptions({ queries: { ...qc.getDefaultOptions().queries, retryDelay: 10 } }); // test khỏi chờ 1–3 giây\n  const { result } = renderHook(() => useBacSi(), { wrapper: taoWrapper({ queryClient: qc }).wrapper });\n  await waitFor(() => expect(result.current.isSuccess).toBe(true));\n  console.log(`[14.2] số request: ${lan} · failureCount lúc xong: ${result.current.failureCount} · bác sĩ: ${result.current.data?.length}`);\n  expect(lan).toBe(3);\n});",
  testIdem: "test('Idempotency-Key: gửi lại CÙNG khoá ⇒ máy chủ trả lịch cũ, không đặt thêm', async () => {\n  const yc = {\n    bacSiId: 'bs-2', khungGioId: 'bs-2-2026-10-01-1400', lyDo: 'Ho khan 3 ngày',\n    benhNhan: { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567', ngaySinh: '1995-03-14' },\n  };\n  khungGioTrongNgay('bs-2', '2026-10-01'); // \"máy chủ\" sinh khung giờ của ngày đó (14:00 còn trống)\n  const khoa = crypto.randomUUID();\n  const a = await api.datLich(yc, khoa);\n  const b = await api.datLich(yc, khoa); // như lần thử lại sau khi lần đầu \"hết giờ\" (thật ra máy chủ đã làm xong)\n  const c = await api.datLich(yc).catch((e: LoiApi) => `${e.status} ${e.message}`); // KHÔNG khoá: lần gửi lại bị coi là lịch MỚI\n  console.log('[14.2] cùng khoá:', a.id, b.id, '· không khoá:', c, '· số lịch trong CSDL:', db.lichHen().length);\n  expect(b.id).toBe(a.id);\n  expect(db.lichHen()).toHaveLength(1);\n});",
  testOffline: "test('mất mạng: TanStack TẠM DỪNG query (fetchStatus \"paused\"), không đốt 3 lần thử lại; có mạng ⇒ tự chạy tiếp', async () => {\n  let soRequest = 0;\n  server.events.on('request:start', () => void soRequest++);\n  onlineManager.setOnline(false); // như trình duyệt vừa phát sự kiện \"offline\"\n  const { result } = renderHook(() => useBacSi(), { wrapper: taoWrapper().wrapper });\n  await act(() => new Promise((r) => setTimeout(r, 300)));\n  console.log(`[14.2] offline 300 ms: status=${result.current.status} · fetchStatus=${result.current.fetchStatus} · request đã gửi: ${soRequest}`);\n  expect(result.current.fetchStatus).toBe('paused');\n  act(() => onlineManager.setOnline(true));\n  await waitFor(() => expect(result.current.isSuccess).toBe(true));\n  console.log(`[14.2] online lại: status=${result.current.status} · request đã gửi: ${soRequest}`);\n  server.events.removeAllListeners('request:start');\n  expect(soRequest).toBe(1);\n});",
  testBaoLoi: "test('lỗi render bị RanhGioiLoi bắt ⇒ React 19 gọi onCaughtError ⇒ baoLoi gửi MỘT báo cáo có componentStack', async () => {\n  const nhan: BaoCaoLoi[] = [];\n  datNguoiNhan((bc) => nhan.push(bc));\n  render(\n    <RanhGioiLoi>\n      <NoTung />\n    </RanhGioiLoi>,\n    { onCaughtError: (loi, info) => baoLoi(loi, 'react', info.componentStack) }, // main.tsx làm y hệt với createRoot\n  );\n  expect(screen.getByRole('alert')).toHaveTextContent('Phần này gặp sự cố.');\n  console.log('[14.2] báo cáo:', JSON.stringify({ ...nhan[0], stack: nhan[0].stack?.split('\\n')[0], componentStack: nhan[0].componentStack?.trim().split('\\n')[0] }));\n  expect(nhan).toHaveLength(1);\n  expect(nhan[0]).toMatchObject({ ten: 'TypeError', noi: 'react', duongDan: '/' });\n});",
  batApiGia: "/**\n * Chương 14: API giả CHỈ khi dev (`npm run dev`) hoặc bản build DEMO (`vite build --mode demo`, .env.demo đặt\n * VITE_API_GIA=1 — cho host tĩnh không có backend). Bản production thật: điều kiện là hằng `false` lúc build ⇒\n * Rolldown bỏ cả nhánh, import('./mocks/browser') biến mất khỏi dist (đo ở Bài 14.3).\n */\nasync function batApiGia() {\n  if (!import.meta.env.DEV && import.meta.env.VITE_API_GIA !== '1') return;\n  const { worker } = await import('./mocks/browser'); // import động: mã MSW tách ra file riêng\n  await worker.start({\n    onUnhandledRequest: 'bypass',\n    quiet: true,\n    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` }, // đúng cả khi base = '/phong-kham/'\n  });\n}",
  routerBase: "// Chương 7: router tạo MỘT lần, ngoài cây React. Chương 14: basename = `base` của Vite (vd '/phong-kham/' khi deploy\n// vào thư mục con của GitHub Pages) ⇒ mọi Link/navigate tự thêm tiền tố, không phải sửa từng đường dẫn.\nconst router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL });",
  viteConfig: "/// <reference types=\"vitest/config\" />\nimport { rmSync } from 'node:fs'\nimport babel from '@rolldown/plugin-babel'\nimport react, { reactCompilerPreset } from '@vitejs/plugin-react'\nimport { visualizer } from 'rollup-plugin-visualizer'\nimport { defineConfig, loadEnv, type Plugin } from 'vite'\n\n/**\n * Chương 14: Vite chép NGUYÊN thư mục public/ vào dist/ — kể cả public/mockServiceWorker.js của MSW, dù bản\n * production không bao giờ dùng tới. Plugin nhỏ này xoá nó sau khi build, trừ bản demo (VITE_API_GIA=1).\n */\nfunction boWorkerMsw(apiGia: boolean): Plugin {\n  let outDir = 'dist'\n  return {\n    name: 'bo-worker-msw',\n    apply: 'build',\n    configResolved: (c) => void (outDir = c.build.outDir),\n    closeBundle: () => {\n      if (!apiGia) rmSync(`${outDir}/mockServiceWorker.js`, { force: true })\n    },\n  }\n}\n\n// https://vite.dev/config/\nexport default defineConfig(({ mode }) => {\n  // Chương 14: đọc .env* TRONG file cấu hình (chạy ở Node lúc build — import.meta.env chưa có ở đây).\n  // Tham số thứ ba '' = đọc MỌI biến, kể cả không có tiền tố VITE_ — chúng chỉ dùng được ở đây, không vào bundle.\n  const env = loadEnv(mode, process.cwd(), '')\n  return {\n    plugins: [\n      react(),\n      // Chương 12: React Compiler 1.0 cho CẢ app (dev, build, Vitest). Cần @babel/core 7 — bản 8 làm compiler âm thầm\n      // bỏ qua component có prop mặc định (Bài 8.2). src/app/compiler.test.ts canh để không component nào bị bỏ qua.\n      babel({ presets: [reactCompilerPreset()] }),\n      boWorkerMsw(env.VITE_API_GIA === '1'), // Chương 14\n      // Chương 14: `PHAN_TICH=1 npx vite build` ⇒ bao-cao/phan-tich.html (NGOÀI dist: không lỡ deploy nó) — bản đồ ô vuông: module nào chiếm bao nhiêu\n      env.PHAN_TICH === '1' && visualizer({ filename: 'bao-cao/phan-tich.html', gzipSize: true, template: 'treemap' }),\n    ],\n    build: {\n      // Chương 14: sinh .map để công cụ báo lỗi dịch stack \"Xc(e)\" về \"baoLoi(loi)\" — nhưng 'hidden': KHÔNG ghi\n      // //# sourceMappingURL vào file JS ⇒ trình duyệt người dùng không tải map. CI tải .map lên dịch vụ báo lỗi\n      // rồi XOÁ khỏi thư mục deploy (Bài 14.3) — map chứa nguyên mã nguồn.\n      sourcemap: 'hidden',\n    },\n    resolve: {\n      // Chương 7: đọc \"paths\" của tsconfig ⇒ \"@/…\" chạy ở dev server VÀ Vitest (build thì Rolldown tự đọc).\n      tsconfigPaths: true,\n      // Chương 8: `vite build --mode profiling` ⇒ dùng bản react-dom CÓ BẬT đo, để <Profiler> vẫn báo số trên bản build.\n      alias: mode === 'profiling' ? [{ find: /^react-dom\\/client$/, replacement: 'react-dom/profiling' }] : [],\n    },\n    test: {\n      environment: 'jsdom',\n      setupFiles: ['./src/test/setup.ts'],\n      // Chương 9: đo độ phủ (coverage) — `npm run test:cov`. Mặc định Vitest chỉ tính file mà test CÓ import ⇒ file\n      // không test nào đụng tới thì vô hình (không phải 0%). include liệt kê hết src/ để chúng hiện ra.\n      coverage: {\n        provider: 'v8',\n        include: ['src/**/*.{ts,tsx}'],\n        exclude: ['src/**/*.test.{ts,tsx}', 'src/vi-du/**', 'src/test/**', 'src/mocks/**', 'src/shared/dev/**', 'src/main.tsx'],\n        reporter: ['text', 'html'],\n        // Sàn, không phải đích: tụt dưới là CI đỏ. Nhánh để thấp hơn vì React Compiler thêm nhánh \"cache trúng\" vào MỌI\n        // component (1003 nhánh thay vì 330 — đo thật, Bài 9.4) mà test không chạm hết được.\n        thresholds: { lines: 90, functions: 90, statements: 85, branches: 75 },\n      },\n    },\n  }\n})",
  kiemKichThuoc: "// Chương 14: \"ngân sách kích thước\" — CI đỏ nếu JavaScript người dùng phải tải để THẤY trang đầu tiên vượt trần.\n//   node scripts/kiem-kich-thuoc.mjs [dist]\n// \"Tải lúc đầu\" = mọi file .js mà index.html trỏ tới (script chính + modulepreload). Đo bản gzip — thứ thật sự đi\n// qua mạng. Trần đặt cao hơn số hiện tại một chút: mục đích là BẮT tăng đột biến (lỡ import cả một thư viện), không\n// phải ép từng byte.\nimport fs from 'node:fs';\nimport path from 'node:path';\nimport { gzipSync } from 'node:zlib';\n\nconst dist = process.argv[2] ?? 'dist';\nconst TRAN_TAI_DAU_KB = 140; // gzip\nconst TRAN_MOI_CHUNK_KB = 60; // gzip, chunk tải lười\n\nconst html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');\nconst taiDau = new Set([...html.matchAll(/(?:src|href)=\"\\/?([^\"]+\\.js)\"/g)].map((m) => path.basename(m[1])));\nconst kb = (f) => gzipSync(fs.readFileSync(path.join(dist, 'assets', f))).length / 1000;\n\nlet tongDau = 0;\nconst vuot = [];\nfor (const f of fs.readdirSync(path.join(dist, 'assets')).filter((f) => f.endsWith('.js'))) {\n  const k = kb(f);\n  if (taiDau.has(f)) tongDau += k;\n  else if (k > TRAN_MOI_CHUNK_KB) vuot.push(`${f}: ${k.toFixed(1)} kB > ${TRAN_MOI_CHUNK_KB} kB`);\n}\nconsole.log(`Tải lúc đầu (${taiDau.size} file JS): ${tongDau.toFixed(1)} kB gzip / trần ${TRAN_TAI_DAU_KB} kB`);\nif (tongDau > TRAN_TAI_DAU_KB) vuot.unshift(`tải lúc đầu ${tongDau.toFixed(1)} kB > ${TRAN_TAI_DAU_KB} kB`);\nif (vuot.length) {\n  console.error('✗ VƯỢT NGÂN SÁCH:\\n  ' + vuot.join('\\n  '));\n  process.exit(1);\n}\nconsole.log('✓ trong ngân sách');",
  baoMatConf: "# Chương 14 — header bảo mật cho app React tĩnh. File này được `include` vào TỪNG location (xem nginx-bao-mat.conf).\n# CSP (Content Security Policy): trình duyệt CHỈ chạy script / gọi API / nhúng khung từ những nguồn liệt kê ở đây.\n#   script-src 'self'   : chỉ file JS của chính site — script chèn vào trang (XSS, Bài 13.4) không chạy được\n#   connect-src         : fetch() chỉ tới được chính site và API thật\n#   frame-ancestors     : không site nào được nhúng trang này vào <iframe> (chống clickjacking)\nadd_header Content-Security-Policy \"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self' https://api.phong-kham.example; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'\" always;\nadd_header X-Content-Type-Options \"nosniff\" always;              # không \"đoán\" kiểu file: .txt không bị chạy như JS\nadd_header Referrer-Policy \"strict-origin-when-cross-origin\" always; # link ra ngoài không mang theo đường dẫn đầy đủ\nadd_header Permissions-Policy \"camera=(), microphone=(), geolocation=()\" always;\n# HTTPS thật (không phải localhost) thì thêm: add_header Strict-Transport-Security \"max-age=31536000\" always;",
  nginxBaoMat: "# Chương 14 — nginx cho bản build tĩnh: fallback + cache (Chương 10) + header bảo mật.\n# LUẬT của nginx: location nào có add_header thì KHÔNG thừa hưởng add_header của server {} ⇒ include vào TỪNG location.\nserver {\n  listen 80;\n  root /usr/share/nginx/html;\n\n  location /assets/ {\n    try_files $uri =404;\n    add_header Cache-Control \"public, max-age=31536000, immutable\";\n    include /etc/nginx/bao-mat.conf;\n  }\n\n  # Source map KHÔNG bao giờ được phục vụ công khai (chứa nguyên mã nguồn) — kể cả khi lỡ tay deploy.\n  location ~ \\.map$ {\n    return 404;\n  }\n\n  location / {\n    try_files $uri /index.html;\n    add_header Cache-Control \"no-cache\";\n    include /etc/nginx/bao-mat.conf;\n  }\n}",
  nginxSai: "# Chương 14 — CÁCH SAI hay gặp: header bảo mật đặt ở cấp server, location nào cũng tự có add_header riêng.\nserver {\n  listen 80;\n  root /usr/share/nginx/html;\n  include /etc/nginx/bao-mat.conf; # ← nằm ở server {}\n\n  location /assets/ {\n    try_files $uri =404;\n    add_header Cache-Control \"public, max-age=31536000, immutable\";\n  }\n  location / {\n    try_files $uri /index.html;\n    add_header Cache-Control \"no-cache\";\n  }\n}",
  zodJitless: "import { z } from 'zod';\n\n// Chương 14: Zod 4 thử `new Function(\"\")` một lần để xem có được sinh mã nhanh (JIT) không. Dưới CSP chặt (không\n// 'unsafe-eval') lần thử bị chặn — Zod vẫn chạy, nhưng trình duyệt ghi một vi phạm CSP mỗi trang (đo ở Bài 14.3),\n// làm nhiễu báo cáo CSP thật. jitless: bỏ hẳn lần thử. Đặt ở ĐÂY: file duy nhất import zod, chạy trước mọi schema.\nz.config({ jitless: true });",
  ci: "# Chương 14 — CI/CD cho app React tĩnh (Vite). Mỗi push/PR: kiểm kiểu, test, build, ngân sách kích thước.\n# Push lên main (và CI xanh): dựng bản DEMO rồi deploy lên GitHub Pages.\n# Phiên bản action kiểm 26/09/2026 bằng `gh api repos/actions/<tên>/releases/latest`.\nname: CI\n\non:\n  push:\n    branches: [main]\n  pull_request:\n\n# Hai lần push liền nhau trên cùng nhánh: huỷ lần cũ, chỉ chạy lần mới (khoá GitHub Actions, Chương 7)\nconcurrency:\n  group: ci-${{ github.ref }}\n  cancel-in-progress: true\n\npermissions:\n  contents: read # quyền tối thiểu; job deploy tự xin thêm\n\njobs:\n  kiem-tra:\n    runs-on: ubuntu-latest\n    timeout-minutes: 15\n    steps:\n      - uses: actions/checkout@v7\n      - uses: actions/setup-node@v7\n        with:\n          node-version: 22\n          cache: npm # cache ~/.npm theo package-lock.json\n      - run: npm ci # cài ĐÚNG như package-lock.json (không phải npm install)\n      - run: npx tsc -b\n      - run: npx vitest run\n      - name: Build production\n        run: npx vite build\n        env:\n          VITE_PHIEN_BAN: ${{ github.sha }} # báo cáo lỗi biết lỗi thuộc bản nào\n      - run: node scripts/kiem-kich-thuoc.mjs\n      # Chỗ này, dự án thật tải dist/**/*.map lên dịch vụ báo lỗi (Sentry: `sentry-cli sourcemaps upload`)…\n      - name: Bỏ source map khỏi thứ sẽ deploy\n        run: find dist -name '*.map' -delete\n\n  deploy:\n    needs: kiem-tra\n    if: github.event_name == 'push' && github.ref == 'refs/heads/main'\n    runs-on: ubuntu-latest\n    timeout-minutes: 10\n    permissions:\n      pages: write # đẩy lên GitHub Pages\n      id-token: write # deploy-pages xác thực bằng OIDC, không cần token cất trong secrets\n    environment:\n      name: github-pages\n      url: ${{ steps.trien-khai.outputs.page_url }}\n    steps:\n      - uses: actions/checkout@v7\n      - uses: actions/setup-node@v7\n        with:\n          node-version: 22\n          cache: npm\n      - run: npm ci\n      # Bản DEMO (API giả) vì app chưa có backend thật. Pages phục vụ ở https://<user>.github.io/<tên-repo>/ ⇒ base.\n      - run: npx vite build --mode demo --base=/${{ github.event.repository.name }}/\n        env:\n          VITE_PHIEN_BAN: ${{ github.sha }}\n      - run: find dist -name '*.map' -delete\n      # GitHub Pages không có \"rewrite\": deep link /bac-si/bs-2 không có file ⇒ Pages trả 404.html. Chép index.html\n      # thành 404.html ⇒ app vẫn mở đúng trang (mã HTTP vẫn là 404 — chấp nhận được cho bản demo, không cho SEO).\n      - run: cp dist/index.html dist/404.html\n      - uses: actions/upload-pages-artifact@v5\n        with:\n          path: dist\n      - id: trien-khai\n        uses: actions/deploy-pages@v5",
  scripts: "{\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"tsc -b && vite build\",\n    \"lint\": \"oxlint\",\n    \"preview\": \"vite preview\",\n    \"test\": \"vitest\",\n    \"kiem:compiler\": \"vitest run src/app/compiler.test.ts\",\n    \"test:cov\": \"vitest run --coverage\",\n    \"build:demo\": \"tsc -b && vite build --mode demo\",\n    \"kiem:kich-thuoc\": \"node scripts/kiem-kich-thuoc.mjs\",\n    \"kiem\": \"tsc -b && vitest run && vite build && node scripts/kiem-kich-thuoc.mjs\"\n  }\n}",
  chayCi: "#!/usr/bin/env bash\n# Chạy ĐÚNG các bước của job kiem-tra trong .github/workflows/ci.yml, trên bản clone sạch (không node_modules, không dist).\nset -e\ncd \"$(dirname \"$0\")/ci-sach\"\nbuoc() { echo; echo \"▶ $*\"; local t0=$(date +%s); eval \"$*\"; echo \"  (xong sau $(( $(date +%s) - t0 )) s)\"; }\nbuoc \"npm ci 2>&1 | tail -3\"\nbuoc \"npx tsc -b\"\nbuoc \"npx vitest run 2>&1 | tail -4\"\nbuoc \"VITE_PHIEN_BAN=\\$(git rev-parse --short HEAD) npx vite build 2>&1 | tail -4\"\nbuoc \"node scripts/kiem-kich-thuoc.mjs\"\nbuoc \"find dist -name '*.map' -delete && ls dist/assets | grep -c '\\.map$' || true\"",
  readme: "# Phòng khám An Tâm — đặt lịch khám (React 19 + TypeScript + Vite)\n\nỨng dụng đặt lịch khám cho một phòng khám: xem bác sĩ, lọc theo chuyên khoa, chọn giờ, đặt / đổi giờ / huỷ lịch,\nlịch trống theo tuần, góp ý sau khi khám, giao diện Việt/Anh. Dựng từ đầu qua 15 chương của khoá React.\n\n**Bản demo:** `https://<tài-khoản>.github.io/<tên-repo>/` · tài khoản mẫu `0901234567` / `antam2026`\n(bản demo chạy API giả bằng MSW — không có dữ liệu thật nào rời khỏi trình duyệt).\n\n## Công nghệ và lý do chọn\n\n| Việc | Dùng | Vì sao |\n|---|---|---|\n| Khung | React 19.3, React Compiler 1.0 | memo tự động; đo trước/sau ở Chương 12 |\n| Build | Vite 8 (Rolldown) | dev server nhanh, chia chunk theo route |\n| Kiểu | TypeScript 6 | thay PropTypes; biến môi trường cũng có kiểu |\n| Dữ liệu máy chủ | TanStack Query 5 | cache, thử lại có trần, tạm dừng khi mất mạng |\n| State client | Zustand 5 | phiên đăng nhập, bộ lọc, ngôn ngữ |\n| Form | React Hook Form + Zod 4 | một schema cho cả form và máy chủ giả |\n| Định tuyến | React Router 8 | route lazy, cổng đăng nhập |\n| Test | Vitest 5 + Testing Library + MSW | 208 test, chạy trong ~15 giây |\n\n## Chạy ở máy\n\n```bash\nnpm ci\nnpm run dev          # http://localhost:5173 — API giả (MSW) tự bật khi dev\nnpm run kiem         # đúng những gì CI chạy: tsc + test + build + ngân sách kích thước\nnpm run build:demo   # bản demo (API giả) cho host tĩnh\n```\n\n## Biến môi trường (`.env*`, đọc LÚC BUILD)\n\n| Biến | Ví dụ | Ghi chú |\n|---|---|---|\n| `VITE_API_URL` | `https://api.phong-kham.example` | trống ⇒ cùng tên miền |\n| `VITE_API_GIA` | `1` | chỉ bản demo: bật MSW ở production |\n| `VITE_BAO_LOI_URL` | `https://…/bao-loi` | nơi nhận báo cáo lỗi; trống ⇒ không gửi |\n| `VITE_PHIEN_BAN` | mã commit | CI đặt |\n\n⚠️ Mọi biến `VITE_*` nằm NGUYÊN VĂN trong file JS ai cũng tải về được. Không bao giờ đặt khoá bí mật ở đây.\n\n## Kiến trúc\n\n- `src/features/<tính năng>/` — mỗi tính năng một thư mục, chỉ lộ ra qua `index.ts`.\n- `src/shared/` — không import từ `features/` (luật một chiều).\n- `src/app/` — nơi duy nhất nối mọi thứ: router, QueryClient, phiên đăng nhập (`app/phien.ts`).\n- Xác thực: access token trong bộ nhớ, refresh token trong cookie HttpOnly; 401 ⇒ làm mới MỘT lần (dùng chung\n  cho mọi request đồng thời) ⇒ gửi lại một lần; đăng xuất ở mọi tab qua `BroadcastChannel`.\n\n## CI/CD\n\n`.github/workflows/ci.yml`: mỗi push/PR chạy tsc → Vitest → build → ngân sách kích thước; push lên `main` dựng bản\ndemo và deploy lên GitHub Pages. Header bảo mật (CSP…) cho nginx ở `deploy/nginx-bao-mat.conf`.",
};

/* ─── Output THẬT (Vitest 5.0.2, Vite 8.3.1, TypeScript 6.0.3, Chromium 149, nginx 1.27, Node 22.21) — chép nguyên văn, chỉ rút bớt dòng ─── */
const OUT = {
  httpTest: "$ npx vitest run src/shared/api/http.test.ts --reporter=verbose\n[14.1] GET /api/lich-hen → POST /api/lam-moi-token → GET /api/lich-hen\n[14.1] ba request cùng lúc: GET 6 lần, làm mới 1 lần\n[14.1] phiên hết thật: GET /api/lich-hen → POST /api/lam-moi-token ⇒ LoiApi: Phiên đăng nhập đã hết hạn\n ✓ 14.1 — 401 → làm mới token → gửi lại > access token hết hạn ⇒ 401 ⇒ POST /api/lam-moi-token ⇒ gửi lại ⇒ có dữ liệu\n ✓ 14.1 — 401 → làm mới token → gửi lại > BA request cùng nhận 401 ⇒ chỉ MỘT lần làm mới, cả ba đều được gửi lại\n ✓ 14.1 — 401 → làm mới token → gửi lại > cookie refresh cũng hết (máy chủ đã thu hồi) ⇒ đăng xuất, ném 401, KHÔNG lặp\n[14.1] body /api/dang-nhap có các khoá: accessToken, hetHanSau, nguoiDung\n[14.1] localStorage[\"phong-kham-dang-nhap\"] = {\"state\":{\"nguoiDung\":{\"hoTen\":\"Nguyễn Thị Ánh\",\"soDienThoai\":\"0901234567\"}},\"version\":1}\n ✓ 14.1 — 401 → làm mới token → gửi lại > sai mật khẩu cũng là 401 — nhưng KHÔNG được gọi làm mới token\n ✓ 14.1 — 401 → làm mới token → gửi lại > token KHÔNG xuống localStorage của app; refresh token không có trong body trả về\n[14.2] hết giờ sau 202 ms: LoiMang: Máy chủ phản hồi quá chậm\n[14.2] mất mạng: LoiMang: Không kết nối được máy chủ | cause: TypeError: Failed to fetch\n[14.2] tự huỷ: AbortError\n ✓ 14.2 — lỗi mạng và hết giờ > máy chủ im lặng quá thoiGianCho ⇒ LoiMang \"het-gio\"\n ✓ 14.2 — lỗi mạng và hết giờ > không tới được máy chủ ⇒ LoiMang \"mat-mang\" (fetch ném TypeError, giữ trong cause)\n ✓ 14.2 — lỗi mạng và hết giờ > người gọi TỰ huỷ (rời trang) ⇒ lỗi AbortError giữ nguyên, không đổi thành \"mất mạng\"\n      Tests  8 passed (8)",
  ngayTho: "$ npx vitest run src/vi-du/ch14 --reporter=verbose\n[ngây thơ] mã trả về của 3 request: 200, 401, 401 | làm mới: 3 lần | còn đăng nhập? false\n ✓ ngây thơ: 3 request cùng 401 ⇒ 3 lần làm mới; refresh xoay vòng ⇒ 2 lần sau dùng token ĐÃ THU HỒI ⇒ bị đăng xuất oan\n      Tests  1 passed (1)",
  phienTest: "$ npx vitest run src/app/phien.test.tsx --reporter=verbose\n[14.1] KHÔNG ketNoiPhien — Nam thấy: {\"ngayKhiVao\":\"BS. Trần Thu Hà\",\"sau1Giay\":\"BS. Trần Thu Hà\"}\n ✓ KHÔNG dọn cache khi đăng xuất ⇒ trang lịch hẹn của Nam mở ra với lịch của Ánh\n[14.1] CÓ ketNoiPhien — Nam thấy: {\"ngayKhiVao\":\"(chưa có)\",\"sau1Giay\":\"BS. Phạm Ngọc Lan\"}\n ✓ ketNoiPhien: đăng xuất ⇒ bỏ [\"lich-hen\"] khỏi cache ⇒ người sau KHÔNG thấy gì của người trước\n[14.1] tab B đăng xuất ⇒ tab A: {\"nguoiDung\":null,\"accessToken\":null}\n ✓ đăng xuất ở tab A ⇒ tab B (kênh BroadcastChannel khác, cùng tên) nhận tin và xoá phiên\n      Tests  3 passed (3)",
  chromium: "$ node do/ch14-phien.mjs   # Chromium 149 · vite preview (bản demo) · ?het-han=5\n[1] sai mật khẩu: POST /api/dang-nhap 401\n[2] đăng nhập: POST /api/dang-nhap 200 → GET /api/lich-hen 200 → GET /api/bac-si 200\n    document.cookie = \"\"\n    localStorage có khoá: phong-kham-dang-nhap, __msw-cookie-store__, __may-chu-gia:refresh\n    localStorage[\"phong-kham-dang-nhap\"] = {\"state\":{\"nguoiDung\":{\"hoTen\":\"Nguyễn Thị Ánh\",\"soDienThoai\":\"0901234567\"}},\"version\":1}\n    localStorage[\"__msw-cookie-store__\"] chứa \"rt=\"? true · httpOnly: true\n    cookie THẬT của trình duyệt (context.cookies()): (không có)\n[3] sau 5,5 giây, mở /lich-hen: GET /api/lich-hen 401 → POST /api/lam-moi-token 200 → GET /api/lich-hen 200\n[4] F5 ở /lich-hen: GET /api/bac-si 200 → GET /api/lich-hen 401 → POST /api/lam-moi-token 200 → GET /api/lich-hen 200\n[5] tab A đăng xuất ⇒ tab B tự sang: /dang-nhap · POST /api/dang-xuat 204\n[6] setOffline(true): navigator.onLine = false\n[6] có mạng lại: dải báo biến mất",
  doBen: "$ npx vitest run src/app/do-ben.test.tsx --reporter=verbose\n[14.2] số request: 3 · failureCount lúc xong: 0 · bác sĩ: 6\n[14.2] cùng khoá: lh-1 lh-1 · không khoá: 409 Khung giờ này vừa có người đặt · số lịch trong CSDL: 1\n ✓ máy chủ chập chờn: 503, 503, rồi 200 ⇒ TanStack tự thử lại, người dùng chỉ thấy dữ liệu\n[14.2] báo cáo: {\"ten\":\"TypeError\",\"thongDiep\":\"Cannot read properties of undefined (reading 'ten')\",\"noi\":\"react\",\"duongDan\":\"/\",\"phienBan\":\"dev\",\"luc\":\"2026-09-26T08:35:40.834Z\",\"stack\":\"TypeError: Cannot read properties of undefined (reading 'ten')\",\"componentStack\":\"at NoTung (…/src/app/do-ben.test.tsx:98:8)\"}\n ✓ Idempotency-Key: gửi lại CÙNG khoá ⇒ máy chủ trả lịch cũ, không đặt thêm\n ✓ thongDiepLoi(LoiMang: x) ⇒ \"Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.\"\n ✓ thongDiepLoi(LoiMang: x) ⇒ \"Máy chủ phản hồi quá chậm. Thử lại sau ít phút.\"\n ✓ thongDiepLoi(LoiApi: relation \"lich_hen\" does not exist) ⇒ \"Máy chủ đang gặp sự cố. Chúng tôi đã được báo, bạn thử lại sau nhé.\"\n ✓ thongDiepLoi(LoiApi: Khung giờ này vừa có người đặt) ⇒ \"Khung giờ này vừa có người đặt\"\n ✓ thongDiepLoi(TypeError: Cannot read properties of undefined (reading 'ten')) ⇒ \"Đã có lỗi không mong muốn. Tải lại trang có thể giúp.\"\n ✓ mất mạng ⇒ dải báo hiện; có mạng lại ⇒ biến mất\n ✓ lỗi render bị RanhGioiLoi bắt ⇒ React 19 gọi onCaughtError ⇒ baoLoi gửi MỘT báo cáo có componentStack\n ✓ baoLoi bỏ nhiễu: mất mạng, 4xx, lỗi trùng\n[14.2] offline 300 ms: status=pending · fetchStatus=paused · request đã gửi: 0\n[14.2] online lại: status=success · request đã gửi: 1\n ✓ mất mạng: TanStack TẠM DỪNG query (fetchStatus \"paused\"), không đốt 3 lần thử lại; có mạng ⇒ tự chạy tiếp\n      Tests  11 passed (11)",
  treThuLai: "$ npx vitest run src/app/query-client.test.ts --reporter=verbose\n[14.2] lần hỏng · chờ ít nhất · chờ nhiều nhất (ms)\n0 · 501 · 998\n1 · 1000 · 2000\n2 · 2003 · 3999\n3 · 4006 · 8000\n4 · 4005 · 7997\n5 · 4005 · 7995\n ✓ đã hỏng 0 lần, lỗi LoiApi: Không có ⇒ thử lại: false\n ✓ đã hỏng 0 lần, lỗi LoiApi: Trùng ⇒ thử lại: false\n ✓ đã hỏng 0 lần, lỗi LoiApi: Hết phiên ⇒ thử lại: false\n ✓ đã hỏng 0 lần, lỗi LoiApi: Chậm lại ⇒ thử lại: true\n ✓ đã hỏng 0 lần, lỗi LoiApi: Bận ⇒ thử lại: true\n ✓ đã hỏng 2 lần, lỗi LoiApi: Bận ⇒ thử lại: true\n ✓ đã hỏng 3 lần, lỗi LoiApi: Bận ⇒ thử lại: false\n ✓ đã hỏng 0 lần, lỗi LoiMang: Chậm ⇒ thử lại: true\n ✓ đã hỏng 0 lần, lỗi TypeError: Failed to fetch ⇒ thử lại: true\n ✓ treThuLai: luỹ thừa có trần 8 giây, luôn trong [trần/2, trần]\n      Tests  10 passed (10)",
  envTsc: "$ npx tsc -b\nsrc/main.tsx(68,39): error TS2339: Property 'VITE_KHOA_GIPHY' does not exist on type 'ImportMetaEnv'.\nsrc/main.tsx(68,81): error TS2339: Property 'KHOA_DB' does not exist on type 'ImportMetaEnv'.",
  envGrep: "$ npx vite build --outDir dist-env\n$ grep -o \"gph_[A-Za-z0-9_]*\\|postgres://[^\\\"\\`]*\" dist-env/assets/*.js\ndist-env/assets/index-gQI9K1hv.js:gph_ThuNghiem_123\nconsole.log(`giphy:`,`gph_ThuNghiem_123`,`· db:`,void 0)",
  buildTruocSau: "# bản production (vite build) — MSW chỉ còn ở dev\ndist-prod1/assets/index-mZteCZF2.js             379.82 kB │ gzip: 121.24 kB\n✓ built in 1.41s\n# bản demo (vite build --mode demo) — MSW đi theo\ndist-demo/assets/index-DBqJITnX.js             382.55 kB │ gzip: 122.25 kB\ndist-demo/assets/browser-Dgp3k8o8.js           430.46 kB │ gzip: 161.96 kB\n✓ built in 1.17s\n\n# cộng mọi file .js trong assets/ (node + zlib.gzipSync từng file)\ndist       JS 600.9 kB, gzip 196.3 kB\ndist-demo  JS 1031.3 kB, gzip 356.8 kB",
  buildCuoi: "$ npx vite build\nvite v8.3.1 building client environment for production...\n✓ 349 modules transformed.\ndist/index.html                             0.71 kB │ gzip:   0.38 kB\ndist/assets/TrangDoiGio-BleFQ8UH.css        0.06 kB │ gzip:   0.08 kB\ndist/assets/index-rA338ule.css             10.49 kB │ gzip:   2.89 kB\ndist/assets/TrangDangNhap-DAy5z-TT.js       0.77 kB │ gzip:   0.54 kB │ map:     2.40 kB\ndist/assets/http-BIxADcP2.js                1.50 kB │ gzip:   0.90 kB │ map:    10.54 kB\ndist/assets/TrangLichTuan-k7OWSqxG.js       2.15 kB │ gzip:   1.26 kB │ map:     6.47 kB\ndist/assets/TrangDoiGio-GGftbH7i.js         3.90 kB │ gzip:   1.97 kB │ map:    12.36 kB\ndist/assets/TrangLichHen-KxWckJm_.js        4.31 kB │ gzip:   2.04 kB │ map:    12.58 kB\ndist/assets/compiler-runtime-Dc66hXTW.js    8.94 kB │ gzip:   3.36 kB │ map:    34.07 kB\ndist/assets/lich-tuan-C4eeLd1m.js           9.30 kB │ gzip:   4.08 kB │ map:    48.52 kB\ndist/assets/useTieuDeTrang-BHJO75SX.js     15.56 kB │ gzip:   5.45 kB │ map:   102.11 kB\ndist/assets/DanhSachBacSiAo-DigdriPD.js    25.81 kB │ gzip:   7.87 kB │ map:    95.72 kB\ndist/assets/GioiThieuBacSi-_Reqhu5B.js     28.93 kB │ gzip:  11.52 kB │ map:   133.36 kB\ndist/assets/TrangDatLich-DgS94LMj.js      119.91 kB │ gzip:  37.88 kB │ map:   739.16 kB\ndist/assets/index-B-6GtYu3.js             379.82 kB │ gzip: 121.24 kB │ map: 1,847.01 kB\n✓ built in 1.36s",
  phanTich: "$ node do/phan-tich-bundle.mjs dist/assets/index-*.js\nindex-B-6GtYu3.js — 379.8 kB\n  react-dom                       207.2 kB\n  react-router                     95.4 kB\n  src/ (mã của app)                47.6 kB\n  @tanstack/query-core             20.4 kB\n  scheduler                         3.5 kB\n  @tanstack/react-query             2.8 kB\n  @tanstack/react-query-devtools    0.0 kB\n$ node do/phan-tich-bundle.mjs dist/assets/TrangDatLich-*.js\nTrangDatLich-DgS94LMj.js — 119.9 kB\n  zod                              77.4 kB\n  react-hook-form                  29.6 kB\n  src/ (mã của app)                 8.1 kB\n  @hookform/resolvers               3.3 kB",
  nganSachOk: "$ node scripts/kiem-kich-thuoc.mjs\nTải lúc đầu (4 file JS): 129.6 kB gzip / trần 140 kB\n✓ trong ngân sách",
  nganSachVuot: "# \"lỡ tay\" bỏ lazy của trang đặt lịch rồi build\n$ node scripts/kiem-kich-thuoc.mjs dist-vuot\nTải lúc đầu (3 file JS): 165.9 kB gzip / trần 140 kB\n✗ VƯỢT NGÂN SÁCH:\n  tải lúc đầu 165.9 kB > 140 kB\nexit=1",
  header: "$ bash do/ch14-header.sh   # nginx 1.27-alpine trong Docker\n## deploy/nginx-bao-mat-sai.conf (header ở server {})\n$ curl -sI localhost:4901/bac-si/bs-2 | grep -ciE 'content-security|nosniff|referrer-policy|permissions-policy'\n0\n$ curl -sI localhost:4901/assets/index-mZteCZF2.js | grep -ciE 'content-security|nosniff|referrer-policy|permissions-policy'\n0\n## deploy/nginx-bao-mat.conf (include trong từng location)\n$ curl -sI localhost:4902/bac-si/bs-2 | grep -ciE 'content-security|nosniff|referrer-policy|permissions-policy'\n4\n$ curl -sI localhost:4902/assets/index-mZteCZF2.js | grep -ciE 'content-security|nosniff|referrer-policy|permissions-policy'\n4\n$ curl -s -o /dev/null -w '%{http_code}' localhost:4902/assets/index-mZteCZF2.js.map\n404\n$ curl -s -o /dev/null -w '%{http_code}' localhost:4901/assets/index-mZteCZF2.js.map   # cấu hình sai: map lộ ra\n200",
  cspTruoc: "$ node do/ch14-csp.mjs   # bản demo sau nginx + CSP · Chromium 149\n[csp] đi qua 4 trang + đăng nhập: 3 vi phạm, 0 lỗi trang\n[csp] window.__xss sau khi chèn <img onerror> = undefined\n[csp] vi phạm trình duyệt ghi nhận:\n  script-src ← eval\n  script-src ← eval\n  script-src ← eval\n  connect-src ← https://example.com/lay-du-lieu\n  script-src-attr ← inline",
  cspSau: "$ node do/ch14-csp.mjs   # sau z.config({ jitless: true })\n[csp] đi qua 4 trang + đăng nhập: 0 vi phạm, 0 lỗi trang\n[csp] window.__xss sau khi chèn <img onerror> = undefined\n[csp] vi phạm trình duyệt ghi nhận:\n  connect-src ← https://example.com/lay-du-lieu\n  script-src-attr ← inline",
  actionValidator: "$ npx @action-validator/cli .github/workflows/ci.yml\n(exit 0)\n$ npx @action-validator/cli vi-du-loi/ci-sai.yml   # gõ nhầm runs-onn\n{\n  \"actionType\": \"workflow\",\n  \"errors\": [\n    {\n      \"code\": \"one_of\",\n      \"path\": \"/jobs/kiem-tra\",\n      \"title\": \"OneOf conditions are not met\",\n      \"states\": [\n        {\n          \"errors\": [\n            {\n              \"code\": \"properties\",\n              \"detail\": \"Additional property 'runs-onn' is not allowed\",\n              \"path\": \"/jobs/kiem-tra\",\n              \"title\": \"Property conditions are not met\"\n            },\n            {\n              \"code\": \"required\",\n              \"path\": \"/jobs/kiem-tra/runs-on\",\n      …\n(exit 1)",
  ciSach: "$ bash chay-ci.sh   # bản clone SẠCH: không node_modules, không dist\n\n▶ npm ci 2>&1 | tail -3\n  run `npm fund` for details\n\nfound 0 vulnerabilities\n  (xong sau 2 s)\n\n▶ npx tsc -b\n  (xong sau 3 s)\n\n▶ npx vitest run\n Test Files  48 passed (48)\n      Tests  208 passed (208)\n   Duration  13.35s (environment 36%, tests 33%, setup 16%, transform 11%, import 3%)\n  (xong sau 15 s)\n\n▶ VITE_PHIEN_BAN=$(git rev-parse --short HEAD) npx vite build 2>&1 | tail -4\ndist/assets/TrangDatLich-CTtFSjnD.js      119.91 kB │ gzip:  37.88 kB │ map:   739.16 kB\ndist/assets/index-Pz5-CpJJ.js             379.83 kB │ gzip: 121.24 kB │ map: 1,847.00 kB\n\n✓ built in 1.51s\n  (xong sau 2 s)\n\n▶ node scripts/kiem-kich-thuoc.mjs\nTải lúc đầu (4 file JS): 129.6 kB gzip / trần 140 kB\n✓ trong ngân sách\n  (xong sau 1 s)\n\n▶ find dist -name '*.map' -delete && ls dist/assets | grep -c '\\.map$' || true\n0\n  (xong sau 0 s)",
  base: "$ npx vite build --mode demo --base=/phong-kham/ && node do/ch14-base.mjs dist-base \"có basename\"\n[có basename] mở /phong-kham/bac-si ⇒ h2: \"Đội ngũ bác sĩ (6)\" · link menu \"Bác sĩ\" href=/phong-kham/bac-si · lỗi trang: 0\n[THIẾU basename] mở /phong-kham/bac-si ⇒ h2: \"404 — Không có trang “/phong-kham/bac-si”\" · link menu \"Bác sĩ\" href=/bac-si · lỗi trang: 0",
  cuoi: "$ npm run kiem   # tsc -b && vitest run && vite build && node scripts/kiem-kich-thuoc.mjs\n Test Files  48 passed (48)\n      Tests  208 passed (208)\ndist/assets/index-B-6GtYu3.js             379.82 kB │ gzip: 121.24 kB │ map: 1,847.01 kB\n✓ built in 1.36s\nTải lúc đầu (4 file JS): 129.6 kB gzip / trần 140 kB\n✓ trong ngân sách\n\n$ npx vitest run --coverage\nAll files          |   91.23 |    84.94 |   92.36 |   95.42 |\n(% Stmts | % Branch | % Funcs | % Lines)",
};

/* ─── Sơ đồ mermaid trong bài (≤ 10 nút, nhãn ngắn; khối EN nhãn tiếng Anh, khối VI nhãn tiếng Việt) ─── */
const L = (...dong) => MM(dong.join('\n'));
const SD = {
  /* 14.1 */
  dangNhapVi: L(
    'sequenceDiagram',
    '  participant U as Form đăng nhập',
    '  participant A as http.ts',
    '  participant S as Máy chủ',
    '  U->>A: dangNhap(sđt, mật khẩu)',
    '  A->>S: POST /api/dang-nhap (xacThuc: false)',
    '  S-->>A: 200 { accessToken } + Set-Cookie rt (HttpOnly)',
    '  A->>U: luuPhien: token vào bộ nhớ, tên vào localStorage',
    '  U->>A: GET /api/lich-hen',
    '  A->>S: Authorization: Bearer accessToken',
    '  S-->>A: 200 lịch hẹn của người trong token',
  ),
  dangNhapEn: L(
    'sequenceDiagram',
    '  participant U as Sign-in form',
    '  participant A as http.ts',
    '  participant S as Server',
    '  U->>A: dangNhap(phone, password)',
    '  A->>S: POST /api/dang-nhap (xacThuc: false)',
    '  S-->>A: 200 { accessToken } + Set-Cookie rt (HttpOnly)',
    '  A->>U: luuPhien: token in memory, name in localStorage',
    '  U->>A: GET /api/lich-hen',
    '  A->>S: Authorization: Bearer accessToken',
    '  S-->>A: 200 appointments of the token owner',
  ),
  lamMoiVi: L(
    'flowchart TD',
    '  G["goiApi: gửi kèm token"] --> Q{"Trả 401?"}',
    '  Q -->|"không"| OK["trả dữ liệu hoặc LoiApi"]',
    '  Q -->|"có"| M{"Token đã đổi trong lúc chờ?"}',
    '  M -->|"có"| R["gửi lại với token mới"]',
    '  M -->|"không"| C["lamMoiChung(): một promise cho mọi request"]',
    '  C -->|"token mới"| R',
    '  C -->|"null: refresh cũng hết"| X["xoaPhien + ném 401"]',
    '  R --> OK',
  ),
  lamMoiEn: L(
    'flowchart TD',
    '  G["goiApi: send with token"] --> Q{"Got 401?"}',
    '  Q -->|"no"| OK["return data or LoiApi"]',
    '  Q -->|"yes"| M{"Token changed meanwhile?"}',
    '  M -->|"yes"| R["resend with new token"]',
    '  M -->|"no"| C["lamMoiChung(): one promise for all"]',
    '  C -->|"new token"| R',
    '  C -->|"null: refresh expired too"| X["xoaPhien + throw 401"]',
    '  R --> OK',
  ),
  tabVi: L(
    'flowchart TD',
    '  A["Tab A bấm Đăng xuất"] --> API["POST /api/dang-xuat: thu hồi refresh"]',
    '  API --> XA["xoaPhien(): store tab A rỗng"]',
    '  XA --> K(("BroadcastChannel phong-kham-phien"))',
    '  K --> B["Tab B: store.dangXuat()"]',
    '  B --> G["cổng route: sang /dang-nhap"]',
    '  XA --> C["ketNoiPhien: removeQueries lich-hen"]',
  ),
  tabEn: L(
    'flowchart TD',
    '  A["Tab A clicks Sign out"] --> API["POST /api/dang-xuat: revoke refresh"]',
    '  API --> XA["xoaPhien(): tab A store empty"]',
    '  XA --> K(("BroadcastChannel phong-kham-phien"))',
    '  K --> B["Tab B: store.dangXuat()"]',
    '  B --> G["route guard: go to /dang-nhap"]',
    '  XA --> C["ketNoiPhien: removeQueries lich-hen"]',
  ),
  /* 14.2 */
  loiVi: L(
    'flowchart TD',
    '  F["fetch(url, { signal })"] --> Q{"Có câu trả lời HTTP?"}',
    '  Q -->|"có, res.ok"| D["JSON"]',
    '  Q -->|"có, 4xx/5xx"| E1["LoiApi(status)"]',
    '  Q -->|"không"| W{"Vì sao?"}',
    '  W -->|"người gọi huỷ"| E2["AbortError: để nguyên"]',
    '  W -->|"quá thoiGianCho"| E3["LoiMang het-gio"]',
    '  W -->|"không tới được"| E4["LoiMang mat-mang"]',
  ),
  loiEn: L(
    'flowchart TD',
    '  F["fetch(url, { signal })"] --> Q{"Any HTTP answer?"}',
    '  Q -->|"yes, res.ok"| D["JSON"]',
    '  Q -->|"yes, 4xx/5xx"| E1["LoiApi(status)"]',
    '  Q -->|"no"| W{"Why?"}',
    '  W -->|"caller aborted"| E2["AbortError: keep as is"]',
    '  W -->|"over thoiGianCho"| E3["LoiMang het-gio"]',
    '  W -->|"unreachable"| E4["LoiMang mat-mang"]',
  ),
  thuLaiVi: L(
    'flowchart TD',
    '  L["Lỗi"] --> T{"nenThuLai?"}',
    '  T -->|"LoiMang, 5xx, 408, 429"| C["chờ treThuLai(n): 1s, 2s, 4s + ngẫu nhiên"]',
    '  C --> G["gửi lại"]',
    '  G -->|"hỏng lần 3"| B["dừng: hiện LoiTaiDuLieu"]',
    '  T -->|"401, 400, 404, 409"| B',
    '  G -->|"được"| OK["dữ liệu"]',
  ),
  thuLaiEn: L(
    'flowchart TD',
    '  L["Error"] --> T{"nenThuLai?"}',
    '  T -->|"LoiMang, 5xx, 408, 429"| C["wait treThuLai(n): 1s, 2s, 4s + jitter"]',
    '  C --> G["retry"]',
    '  G -->|"3rd failure"| B["stop: show LoiTaiDuLieu"]',
    '  T -->|"401, 400, 404, 409"| B',
    '  G -->|"ok"| OK["data"]',
  ),
  baoLoiVi: L(
    'flowchart TD',
    '  R1["Lỗi render — boundary bắt"] -->|"onCaughtError"| BL["baoLoi()"]',
    '  R2["Lỗi render — không ai bắt"] -->|"onUncaughtError"| BL',
    '  W1["window error / unhandledrejection"] --> BL',
    '  BL --> N{"Nhiễu? trùng? quá 10?"}',
    '  N -->|"có"| X["bỏ"]',
    '  N -->|"không"| S["sendBeacon: VITE_BAO_LOI_URL"]',
    '  S --> D["Sentry / GlitchTip / backend"]',
  ),
  baoLoiEn: L(
    'flowchart TD',
    '  R1["Render error — boundary caught"] -->|"onCaughtError"| BL["baoLoi()"]',
    '  R2["Render error — nobody caught"] -->|"onUncaughtError"| BL',
    '  W1["window error / unhandledrejection"] --> BL',
    '  BL --> N{"Noise? duplicate? over 10?"}',
    '  N -->|"yes"| X["drop"]',
    '  N -->|"no"| S["sendBeacon: VITE_BAO_LOI_URL"]',
    '  S --> D["Sentry / GlitchTip / backend"]',
  ),
  /* 14.3 */
  envVi: L(
    'flowchart TD',
    '  E[".env, .env.[mode], .env.local"] --> V["vite build --mode …"]',
    '  V -->|"VITE_*: thay chữ"| JS["dist/assets/*.js — ai cũng tải được"]',
    '  V -->|"biến khác"| C["chỉ vite.config (loadEnv)"]',
    '  C --> P["plugin, base, define"]',
    '  JS --> U["trình duyệt người dùng"]',
  ),
  envEn: L(
    'flowchart TD',
    '  E[".env, .env.[mode], .env.local"] --> V["vite build --mode …"]',
    '  V -->|"VITE_*: text replaced"| JS["dist/assets/*.js — anyone can download"]',
    '  V -->|"other vars"| C["vite.config only (loadEnv)"]',
    '  C --> P["plugins, base, define"]',
    '  JS --> U["user browser"]',
  ),
  ciVi: L(
    'flowchart TD',
    '  P["push / PR"] --> K["kiem-tra: npm ci → tsc → vitest → build → ngân sách"]',
    '  K -->|"đỏ"| X["chặn merge"]',
    '  K -->|"xanh, nhánh main"| D["deploy: build demo --base"]',
    '  D --> A["upload-pages-artifact"]',
    '  A --> G["deploy-pages → github.io/repo/"]',
  ),
  ciEn: L(
    'flowchart TD',
    '  P["push / PR"] --> K["kiem-tra: npm ci → tsc → vitest → build → budget"]',
    '  K -->|"red"| X["block merge"]',
    '  K -->|"green, main branch"| D["deploy: build demo --base"]',
    '  D --> A["upload-pages-artifact"]',
    '  A --> G["deploy-pages → github.io/repo/"]',
  ),
  lopVi: L(
    'flowchart TD',
    '  C["Chuỗi lạ từ ngoài"] --> R["Lớp 1: React thoát ký tự"]',
    '  R --> D["Lớp 2: DOMPurify tại chỗ chèn"]',
    '  D --> S["Lớp 3: CSP script-src self"]',
    '  S --> H["Lớp 4: token dài hạn HttpOnly"]',
    '  H --> K["Kẻ tấn công: không chạy mã, không mang token đi"]',
  ),
  lopEn: L(
    'flowchart TD',
    '  C["Untrusted string"] --> R["Layer 1: React escaping"]',
    '  R --> D["Layer 2: DOMPurify at insertion"]',
    '  D --> S["Layer 3: CSP script-src self"]',
    '  S --> H["Layer 4: long-lived token HttpOnly"]',
    '  H --> K["Attacker: no code runs, no token leaves"]',
  ),
  /* 14.4 */
  phongVanVi: L(
    'flowchart TD',
    '  CV["CV + repo có README"] --> SC["Vòng lọc: câu hỏi nền tảng"]',
    '  SC --> LC["Live coding: một component + test"]',
    '  LC --> TK["Vòng kỹ thuật: dự án của bạn, đánh đổi"]',
    '  TK --> VH["Vòng văn hoá: làm việc nhóm"]',
    '  VH --> OF["Offer"]',
  ),
  phongVanEn: L(
    'flowchart TD',
    '  CV["CV + repo with README"] --> SC["Screening: fundamentals"]',
    '  SC --> LC["Live coding: a component + test"]',
    '  LC --> TK["Technical: your project, trade-offs"]',
    '  TK --> VH["Culture: teamwork"]',
    '  VH --> OF["Offer"]',
  ),
  traLoiVi: L(
    'flowchart TD',
    '  Q["Câu hỏi"] --> Y["1. Ý chính một câu"]',
    '  Y --> C["2. Cơ chế: vì sao đúng"]',
    '  C --> V["3. Ví dụ thật có số đo"]',
    '  V --> D["4. Đánh đổi và khi nào KHÔNG"]',
    '  D --> H["Hỏi lại: bối cảnh dự án của anh chị?"]',
  ),
  traLoiEn: L(
    'flowchart TD',
    '  Q["Question"] --> Y["1. Main point in one sentence"]',
    '  Y --> C["2. Mechanism: why it holds"]',
    '  C --> V["3. Real example with a number"]',
    '  V --> D["4. Trade-off and when NOT"]',
    '  D --> H["Ask back: what is your context?"]',
  ),
};

const L0 = {
    title: '14.0 — Chapter 14 slides: going to production in pictures|||14.0 — Slide Chương 14: lên production bằng hình',
    slug: 'rx-14-0-slides',
    type: 'DOCUMENT',
    isFreePreview: true,
    description: 'Cả Chương 14 trong 29 slide: cất token ở đâu, 401 → làm mới một lần, đăng xuất mọi tab, lỗi mạng và thử lại có trần, Idempotency-Key, báo lỗi, biến môi trường Vite, bỏ MSW khỏi production, đo bundle, CSP, CI/CD lên GitHub Pages, checklist phỏng vấn middle và bài thi cuối khoá.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Slides</span>
<h2>The last chapter in 29 slides</h2>
<p class="lead">Thirteen chapters built the clinic booking app on your machine. This one takes it to real users: a real sign-in with tokens, an API that is slow and sometimes down, errors that must reach the team instead of a console nobody opens, a production build without the fake API, security headers, and a CI pipeline that deploys only when everything is green. It ends with a middle-level interview checklist and the 20-question final exam of the whole course.</p>
<p>Slides 3–8 belong to Lesson 14.1 (where to keep tokens, what sign-in returns, one shared refresh for every 401, the naive version that logs people out, a real Chromium run, and why sign-out must clear the cache), 9–14 to Lesson 14.2 (three kinds of failure, retry with a cap and jitter, Idempotency-Key, offline, error reporting, <code>VITE_</code> variables), 15–21 to Lesson 14.3 (two builds, reading the bundle, a size budget, nginx headers, CSP measured, CI/CD, deploying under a sub-path), 22–25 to Lesson 14.4 (production checklist, what "middle" means, how to answer, the 15 questions). Slide 26 lists common mistakes, 27 is the cheat sheet, 28 the project steps and 29 introduces the final exam. Built and measured on 26 September 2026 with React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2, MSW 2.15.0, TanStack Query 5.103.3, Chromium 149 and nginx 1.27.5: the app went from 181 to 208 tests.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Slide</span>
<h2>Chương cuối trong 29 slide</h2>
<p class="lead">Mười ba chương đã dựng app đặt lịch phòng khám trên máy của bạn. Chương này đưa nó tới người dùng thật: đăng nhập thật bằng token, một API lúc chậm lúc sập, lỗi phải về tới đội phát triển thay vì nằm trong console không ai mở, bản build production không còn API giả, header bảo mật, và một pipeline CI chỉ deploy khi mọi thứ xanh. Cuối chương là checklist phỏng vấn mức middle và bài thi cuối khoá 20 câu cho cả khoá học.</p>
<p>Slide 3–8 thuộc Bài 14.1 (cất token ở đâu, đăng nhập trả về gì, một lần làm mới chung cho mọi 401, bản ngây thơ làm người dùng bị đá ra, chạy thật trên Chromium, và vì sao đăng xuất phải dọn cache), 9–14 thuộc Bài 14.2 (ba kiểu hỏng, thử lại có trần và jitter, Idempotency-Key, mất mạng, báo lỗi, biến <code>VITE_</code>), 15–21 thuộc Bài 14.3 (hai bản build, đọc bundle, ngân sách kích thước, header trên nginx, đo CSP, CI/CD, deploy vào thư mục con), 22–25 thuộc Bài 14.4 (checklist production, "middle" nghĩa là gì, cách trả lời, 15 câu hỏi). Slide 26 là sai lầm hay gặp, 27 bảng tra nhanh, 28 các bước dự án và 29 giới thiệu bài thi cuối khoá. Dựng và đo ngày 26/09/2026 với React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2, MSW 2.15.0, TanStack Query 5.103.3, Chromium 149 và nginx 1.27.5: app đi từ 181 lên 208 test.</p>
</div>
${gallery('rx-14', [
  [1, 'Bìa — Chương 14: Lên production'],
  [2, 'Bản đồ chương'],
  [3, 'Cất token: bộ nhớ + cookie HttpOnly, không localStorage'],
  [4, 'Đăng nhập trả hai thứ, cất ở hai nơi khác nhau'],
  [5, '401 → làm mới MỘT lần chung → gửi lại MỘT lần'],
  [6, 'Bản ngây thơ: ba lần làm mới, bị đăng xuất oan'],
  [7, 'Chromium thật: token hết hạn, F5, đăng xuất tab kia'],
  [8, 'Đăng xuất không dọn cache: Nam thấy lịch của Ánh'],
  [9, 'Ba kiểu hỏng khác nhau, bắt thành ba lỗi khác nhau'],
  [10, 'Thử lại có trần, có jitter, chỉ lỗi có thể tự khỏi'],
  [11, 'Lệnh GHI chỉ được thử lại khi có Idempotency-Key'],
  [12, 'Mất mạng: báo cho người, TanStack tạm dừng query'],
  [13, 'Báo lỗi: lỗi phải tự về tới đội, không nằm ở console'],
  [14, 'Biến VITE_ nằm nguyên văn trong bundle: không bí mật'],
  [15, 'Hai bản build: production bỏ MSW, bản demo giữ lại'],
  [16, 'Mổ bundle: react-dom và router chiếm phần lớn'],
  [17, 'Ngân sách kích thước: CI đỏ khi lỡ bỏ tải lười'],
  [18, 'nginx: add_header trong location xoá header của server'],
  [19, 'CSP đo thật: Zod 4 gây vi phạm cho tới khi tắt JIT'],
  [20, 'CI/CD: kiểm trên mọi PR, deploy khi main xanh'],
  [21, 'Thư mục con: base của Vite + basename của Router'],
  [22, 'Checklist production: mỗi dòng đều kiểm được'],
  [23, 'Middle: tự làm trọn một tính năng, từ API tới deploy'],
  [24, 'Trả lời theo khung: ý chính, cơ chế, số đo, đánh đổi'],
  [25, '15 câu phỏng vấn của bài 14.4 rải khắp khoá'],
  [26, 'Sai lầm hay gặp ở Chương 14'],
  [27, 'Bảng tra nhanh Chương 14'],
  [28, 'Tự gõ tiếp dự án: bốn bước, 27 test mới, 181 → 208'],
  [29, 'Thi cuối khoá: 20 câu, 30 phút, Mục 0 → Chương 14'],
])}
`,
};

const L1 = {
    title: '14.1 — Client auth: tokens, protected routes, 401 → refresh once, sign out everywhere|||14.1 — Xác thực phía client: token, route bảo vệ, 401 → làm mới, đăng xuất mọi tab',
    slug: 'rx-14-1-xac-thuc',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Đăng nhập thật cho app đặt lịch: access token trong bộ nhớ, refresh token trong cookie HttpOnly, gặp 401 thì làm mới MỘT lần dùng chung rồi gửi lại (đo bản ngây thơ đăng xuất oan), đăng xuất ở mọi tab bằng BroadcastChannel và dọn cache để người sau không thấy lịch của người trước.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>Client-side authentication: tokens, protected routes, and a 401 that heals itself</h2>
<p class="lead">In Chapter 7 the clinic app "signed in" by remembering a name and a phone number in a Zustand store. That was enough to build a route guard, but nothing stopped anyone from calling the API directly. In this lesson the app gets a real sign-in: the server checks a password, hands back an <strong>access token</strong> (a short-lived pass sent with every request) and sets a <strong>refresh token</strong> (a long-lived pass) in an <code>HttpOnly</code> cookie. When the access token expires, the app must quietly get a new one and retry — exactly once, even if five requests fail at the same moment — and signing out must work in every open tab.</p>
<p>Starting point: the app after Chapter 13 — 44 test files, <strong>181 tests</strong> green, React Compiler on, TanStack Query over MSW, React Router with lazy routes, VI/EN dictionary. Everything in this chapter was built and measured on 26 September 2026 with React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2, MSW 2.15.0, TanStack Query 5.103.3, Zustand 5 and Chromium 149. By the end of the chapter the same app has <strong>208 tests</strong> in 48 files.</p>

<div class="callout"><p><strong>How this chapter works.</strong></p>
<ul>
<li><strong>14.1 (this lesson)</strong> — sign-in, where tokens live, 401 → refresh once → retry once, protected routes, sign out in every tab.</li>
<li><strong>14.2</strong> — the real API is slow and sometimes down: timeouts, retry with a cap, offline, Idempotency-Key, error reporting, <code>VITE_</code> environment variables.</li>
<li><strong>14.3</strong> — build and deploy: remove MSW from production, read the bundle, a size budget, security headers and CSP, CI/CD with GitHub Actions.</li>
<li><strong>14.4</strong> — the production checklist, what a middle React developer is expected to know, and 15 interview questions with answers. Then the <strong>final exam</strong> of the course.</li>
</ul>
<p>The API is still MSW (a fake server in the browser), but it now behaves like a real one: it checks tokens, returns 401, rotates refresh tokens and sets cookies. The client code you write is the code you would ship against a real backend.</p></div>

<h3>Where should a token live?</h3>
${slide('rx-14', 3, 'Keep tokens in memory + an HttpOnly cookie, not localStorage')}
<p>A token is a string that proves "this request comes from Ánh, who signed in". Whoever holds it can act as Ánh. So the question "where do I keep it?" is really "who else can read it?". There are four places a browser app can keep a string, and they differ on exactly three properties:</p>
<table>
<thead><tr><th>Place</th><th>Can an injected script read it?</th><th>Survives F5?</th><th>Sent automatically?</th></tr></thead>
<tbody>
<tr><td><code>localStorage</code></td><td>Yes — and copy it to another machine</td><td>Yes</td><td>No</td></tr>
<tr><td><code>sessionStorage</code></td><td>Yes</td><td>Yes (same tab)</td><td>No</td></tr>
<tr><td>A JavaScript variable (memory)</td><td>Yes, but only while the page is open</td><td>No</td><td>No</td></tr>
<tr><td>Cookie with <code>HttpOnly</code></td><td><strong>No</strong> — <code>document.cookie</code> does not show it</td><td>Yes</td><td>Yes — so it needs <code>SameSite</code></td></tr>
</tbody></table>
<p>"Injected script" means XSS (Lesson 13.4): a string from outside that ends up running as code on your page. If XSS runs, it can call your API right there in the page no matter where the token lives — no storage choice fixes XSS itself. What the choice controls is <strong>how much damage leaves the page</strong>. A token in <code>localStorage</code> can be read and sent to an attacker's server, then used for days from another computer. A token in an <code>HttpOnly</code> cookie cannot be read at all.</p>
<p>The common professional answer, and the one this app uses, splits the job in two:</p>
<ul>
<li><strong>Access token</strong> — short-lived (15 minutes here), kept only in memory (a Zustand store that is <em>not</em> persisted), sent in the <code>Authorization: Bearer …</code> header. If stolen, it expires soon.</li>
<li><strong>Refresh token</strong> — long-lived (7 days), kept only in an <code>HttpOnly; Secure; SameSite=Strict</code> cookie. JavaScript never sees it; the browser attaches it only to requests to <code>/api/…</code> on the same site. It is used for one thing: getting a new access token.</li>
</ul>
<p><code>SameSite=Strict</code> answers the last column. Cookies are sent automatically, which is what makes CSRF (cross-site request forgery — another site making your browser send a request with your cookie) possible. <code>SameSite=Strict</code> tells the browser not to attach the cookie when the request starts from another site.</p>

<div class="pitfall co-tieu-de"><strong>Trap — "we use JWT, so it is safe in localStorage".</strong> JWT (JSON Web Token) is a <em>format</em> — a signed, readable string. It says nothing about where the string is stored. A JWT in <code>localStorage</code> is exactly as stealable as any other string there. Do not decode a JWT on the client to make security decisions either: the client cannot verify the signature, and anyone can edit their own copy.</div>

<h3>What sign-in returns</h3>
${slide('rx-14', 4, 'Sign-in returns two things, stored in two different places')}
<p>The fake server now has a small session table, like a real backend keeps in Redis or a database. Here are the parts that matter — who is calling, and the cookie:</p>
${pre('ts', SN.mockNguoiGoi)}
<p>And the three session endpoints. Note that the response <em>body</em> contains only the access token; the refresh token travels only in the <code>Set-Cookie</code> header:</p>
${pre('ts', SN.mockDangNhap)}
${pre('ts', SN.xoayVong)}
<p><strong>Rotation</strong> (xoay vòng) means every refresh token works once: using it returns a new pair and deletes the old one. A stolen refresh token becomes useless the moment the real user refreshes. Rotation also creates the most famous bug of this lesson, which you will reproduce below.</p>
<p>The protected endpoints now check the token and filter by the account inside it — the client no longer sends "whose appointments", the server decides:</p>
${pre('ts', SN.mockLichHen)}
<p>On the client, the Chapter 7 store gets one more field. <code>partialize</code> decides what goes to <code>localStorage</code>: the name (to greet the user after F5), never the token:</p>
${pre('ts', SN.store)}
${SD.dangNhapEn}
<div class="callout"><p><strong>JS quick reminder — <code>??=</code>, <code>finally</code>, <code>satisfies</code>.</strong> <code>a ??= b</code> means "if <code>a</code> is <code>null</code> or <code>undefined</code>, set it to <code>b</code>; otherwise leave it". <code>promise.finally(f)</code> runs <code>f</code> when the promise settles either way (success or failure) and passes the original result through. <code>x satisfies T</code> checks that <code>x</code> matches type <code>T</code> without changing <code>x</code>'s own type — used below to make sure every message sent between tabs has a valid shape.</p></div>

<h3>The session module: sign in, refresh, sign out</h3>
<p>Everything about the session sits in one feature file, <code>src/features/dang-nhap/phien.ts</code>. Read <code>apiPhien</code> first: the three calls pass <code>xacThuc: false</code>, which you will understand in the next section.</p>
${pre('ts', SN.phien)}
<p>Three details carry the whole design:</p>
<ul>
<li><strong><code>lamMoiToken</code> distinguishes two failures.</strong> A 401 from <code>/api/lam-moi-token</code> means the cookie is dead too — the session is really over, so sign out and return <code>null</code>. A <em>network</em> error (Lesson 14.2) means "we do not know" — throw it, and do not kick the user out because the Wi-Fi dropped for a second.</li>
<li><strong><code>dangXuat</code> calls the server first, then clears locally in <code>finally</code>.</strong> Deleting the token on the client is not signing out: the refresh cookie would still work for 7 days. The server must revoke it. And if that call fails, the user still expects to be signed out on this device.</li>
<li><strong>The sign-in form treats 401 as "wrong password"</strong>, not "expired session". The same status code means different things on different endpoints.</li>
</ul>
${pre('tsx', SN.form)}
<p>The message is the same for "unknown number" and "wrong password" — on purpose: a message that says "this number has no account" lets anyone test which phone numbers are patients of the clinic.</p>
<p>Try it: open <code>/dang-nhap</code> in the demo build, type <code>0901234567</code> and a wrong password. The form shows "Sai số điện thoại hoặc mật khẩu." and the Network tab shows exactly one request, <code>POST /api/dang-nhap 401</code> — no refresh call (measured in Chromium, line [1] of the run below). The sample account is <code>0901234567</code> / <code>antam2026</code>.</p>

<h3>401 → refresh once → retry once</h3>
${slide('rx-14', 5, '401 → refresh ONCE (shared) → retry ONCE')}
<p>Now the core. Every API call in the app goes through <code>goiApi</code> in <code>src/shared/api/http.ts</code> (Chapter 6). It must attach the token, and when the server answers 401 it must refresh and retry — without the component ever knowing. But <code>shared/</code> is not allowed to import <code>features/</code> (the one-way rule of Chapter 7), and the session lives in <code>features/dang-nhap</code>. The solution is <strong>dependency inversion</strong>: <code>http.ts</code> declares what it needs, and the <code>app/</code> layer plugs it in.</p>
${pre('ts', SN.httpXacThuc)}
${pre('ts', SN.tuyChon)}
${pre('ts', SN.goiApi)}
${SD.lamMoiEn}
<p>Three guards keep this from looping or misfiring:</p>
<ol>
<li><strong>One refresh for everyone.</strong> <code>dangLamMoi ??= …</code>: the first request that sees a 401 starts the refresh; every other request that sees a 401 while it runs awaits the <em>same</em> promise. <code>finally</code> resets the variable so the next expiry, 15 minutes later, starts a fresh one.</li>
<li><strong>At most one retry per request.</strong> The retry is plain <code>gui(...)</code>, not <code>goiApi(...)</code>: if the retry also returns 401, it falls through to <code>throw new LoiApi(401)</code>. No recursion, no infinite loop.</li>
<li><strong>Auth endpoints opt out.</strong> <code>xacThuc: false</code> on sign-in, refresh and sign-out: no token attached, no refresh on 401. Without it, a wrong password would trigger a refresh, and a failed refresh would trigger another refresh.</li>
</ol>
<p>The small check <code>hienTai !== daDung</code> handles a race you only see under load: request A is sent with the old token, request B's refresh finishes while A is in flight, A comes back 401. There is already a fresh token — use it, do not refresh again.</p>
<p>The app layer wires it together in <code>src/app/phien.ts</code>, called once in <code>main.tsx</code> next to the QueryClient:</p>
${pre('ts', SN.appPhien)}
<p>The tests count requests through MSW's event stream, so "exactly one refresh" is a number, not a feeling:</p>
${pre('ts', SN.httpTestBa)}
${out(OUT.httpTest)}

<h3>Run it step by step</h3>
<ol>
<li>Ánh signs in. <code>POST /api/dang-nhap</code> returns <code>{ accessToken, hetHanSau, nguoiDung }</code> and <code>Set-Cookie: rt=…; HttpOnly</code>. <code>luuPhien</code> puts token and name in the store; <code>persist</code> writes only the name to <code>localStorage</code>.</li>
<li>She opens "Lịch hẹn của tôi". <code>useLichHen</code> → <code>api.lichHen()</code> → <code>goiApi</code> reads <code>layToken()</code> and sends <code>Authorization: Bearer at-…</code>. The server filters by her phone number: 200.</li>
<li>20 minutes pass. She clicks again. Three requests leave at once (appointments, doctors, the header badge). The appointment ones return 401.</li>
<li>The first 401 runs <code>lamMoiChung()</code>: <code>dangLamMoi</code> is <code>null</code>, so it calls <code>lamMoiToken()</code> and stores the promise. The second 401 finds the promise and awaits it.</li>
<li>The browser attaches the <code>rt</code> cookie to <code>POST /api/lam-moi-token</code>; the server rotates: new access token in the body, new cookie in the header, old refresh deleted.</li>
<li><code>lamMoiToken</code> writes the new token to the store and resolves; both waiting requests call <code>gui</code> again with it: 200, 200. <code>finally</code> clears <code>dangLamMoi</code>.</li>
<li>The component saw none of it — TanStack Query just received data a few milliseconds later.</li>
</ol>

<h3>The naive version: refreshing three times gets you signed out</h3>
${slide('rx-14', 6, 'The naive version: three refreshes, signed out for nothing')}
<p>Why all this ceremony around one promise? Because the obvious code is wrong, and it is wrong in a way that only appears with real concurrency. Here is the obvious code, kept in the project as a test that <em>asserts the bug</em>:</p>
${pre('ts', SN.ngayTho)}
${out(OUT.ngayTho)}
<p>Three requests, three refreshes. With rotation, the first refresh consumes the cookie's token; the second and third send a token the server has already deleted, get 401, and <code>lamMoiToken</code> concludes — correctly, from its point of view — that the session is over. The user was in the middle of using the app and lands on the sign-in page. In production this looks like "the app logs me out randomly", reported by a few users, impossible to reproduce on a fast developer machine.</p>
<div class="pitfall co-tieu-de"><strong>Trap — the same race across tabs.</strong> Single-flight inside <code>http.ts</code> fixes one tab. Two tabs refreshing at the same second can still collide on a rotating refresh token. Real systems add a short grace period on the server (the previous refresh token stays valid for a few seconds) or coordinate tabs with the Web Locks API (<code>navigator.locks.request('lam-moi', …)</code>). Know that it exists; it is a good follow-up question in interviews.</div>

<h3>Measured in a real browser</h3>
${slide('rx-14', 7, 'Real Chromium: token expiry, F5, sign out in the other tab')}
<p>The script <code>do/ch14-phien.mjs</code> drives the demo build in Chromium 149. The fake server reads <code>?het-han=5</code> from the URL and issues access tokens that live 5 seconds, so expiry can be watched instead of waited for:</p>
${out(OUT.chromium)}
<p>Read it line by line:</p>
<ul>
<li><strong>[2]</strong> <code>document.cookie</code> is empty and the browser's real cookie jar has nothing: the <code>HttpOnly</code> cookie is invisible to page scripts. Honest note: MSW is not a real server, so it cannot put a cookie into the browser's jar; it keeps its own cookie store in <code>localStorage["__msw-cookie-store__"]</code> and attaches it to intercepted requests. With a real backend that key does not exist — the cookie lives where no script can reach it. The client code does not change.</li>
<li><strong>[3]</strong> After 5.5 seconds: one 401, one refresh, one retry.</li>
<li><strong>[4]</strong> F5 on <code>/lich-hen</code>: the access token (memory) is gone, the name (persisted) is still there, so the route guard lets the page render; the first request gets 401 and the cookie brings the session back. That is the price of keeping the token out of storage: one extra round trip after every reload.</li>
<li><strong>[5]</strong> Sign out in tab A; tab B, open on <code>/lich-hen</code>, jumps to <code>/dang-nhap</code> by itself.</li>
</ul>

<h3>Protected routes, and why they are only half the story</h3>
<p>The guard <code>YeuCauDangNhap</code> from Chapter 7 did not change a line. It reads <code>nguoiDung</code> from the store: no user → redirect to <code>/dang-nhap</code> with the page they wanted in <code>state.tu</code>; after sign-in, <code>TrangDangNhap</code> sends them back. What changed is <em>what happens behind it</em>: before, anyone could call <code>GET /api/lich-hen</code>; now the server answers 401 without a valid token. A route guard is user experience — it hides pages that would only show errors. The security is the 401 on the server. If an interviewer asks "how do you protect a route in React?", say both halves.</p>
<p>One consequence of the lazy restore: after F5 the guard trusts the persisted name for a moment, before any request has proven the session is alive. If the cookie turns out to be dead, the first request fails, <code>lamMoiToken</code> signs out, the store empties, and the guard redirects. An alternative some teams prefer is an explicit "checking session…" state at startup: call <code>/api/lam-moi-token</code> once before rendering protected pages. It costs one request on every load but never shows a protected page to a signed-out user, even for a frame.</p>

<h3>Sign out everywhere — and clear the cache</h3>
${slide('rx-14', 8, 'Sign out without clearing the cache: Nam sees Ánh\'s appointments')}
<p>Two tabs of the same site share cookies and <code>localStorage</code>, but not JavaScript memory — each has its own Zustand store. <code>BroadcastChannel</code> is the browser's built-in way to post messages between tabs of the same origin. <code>xoaPhien</code> posts <code>{ loai: 'dang-xuat' }</code>; every other tab, listening through <code>langNgheTabKhac</code>, empties its store; its route guard does the rest.</p>
${SD.tabEn}
<p>The second half is less obvious and was found by a test. Ánh signs out, Nam signs in on the same computer and opens his appointments:</p>
${pre('tsx', SN.phienTest)}
${out(OUT.phienTest)}
<p>Without <code>ketNoiPhien</code>, Nam's page opens with <strong>Ánh's appointment</strong> on it. TanStack Query still had <code>["lich-hen"]</code> in its cache and showed it instantly while refetching — that is its job. Worse, in the measured run a <code>GET /api/lich-hen</code> carrying Ánh's token was still in flight when she signed out; when Nam's page asked for the same key, TanStack <em>joined</em> that request instead of sending a new one, and Ánh's data was written into the cache as fresh (in this run it was still on screen a second later; how long depends on when the old request returns). With <code>ketNoiPhien</code>, sign-out removes the private queries, so Nam's page starts empty and loads his own. An even stronger fix is to put the user into the key — <code>['lich-hen', soDienThoai]</code> — so two users can never share a cache entry.</p>
${pre('tsx', SN.tabTest)}

<div class="pitfall co-tieu-de"><strong>Trap — clearing the token but not the server session.</strong> "Sign out" that only runs <code>localStorage.removeItem</code> leaves a working refresh cookie for 7 days on a shared computer. Always call the server to revoke, then clear locally in <code>finally</code>.</div>

<h3>Tests need a token now</h3>
<p>Once the fake API checks tokens, every existing test that reads appointments would get 401. The setup file gives each test a valid token for the sample patient — like the app after <code>ketNoiPhien</code> — while leaving <code>nguoiDung</code> null so the Chapter 7 tests of the route guard keep their meaning:</p>
${pre('ts', SN.setup)}
<p>Two older tests changed on purpose: the router tests now type a password instead of a name, and the Chapter 12 test of cancelling an appointment signs in as the patient who owns it (the server now filters by owner). Changing a test because the <em>requirement</em> changed is normal; changing it because it is inconvenient is not.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>In FER202 projects login usually checks a username against a JSON file or a <code>users</code> array, then stores the whole user object (sometimes with the password) in <code>localStorage</code>; the "protected route" is an <code>if (!user) navigate('/login')</code>, and the API behind it is json-server with no checks at all. → At work: the server checks the password hash and issues tokens; the access token lives in memory, the refresh token in an <code>HttpOnly</code> cookie; one HTTP layer handles 401 → refresh → retry for the whole app; the server enforces access on every endpoint; sign-out revokes on the server and clears private caches. · <em>Why:</em> nobody attacks a class project, and each student uses their own laptop. A clinic app holds medical appointments of real people on shared computers. The FER202 way is fine for the assignment — and you will still meet <code>localStorage</code> tokens in older company code; now you can explain what to change.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "Where do you store the JWT in a React app, and why?"</p>
<p>Short-lived access token in memory, sent as a Bearer header; long-lived refresh token in an <code>HttpOnly; Secure; SameSite</code> cookie that JavaScript cannot read. Reason: XSS can read <code>localStorage</code> and exfiltrate a token for use elsewhere; it cannot read an HttpOnly cookie, and a stolen access token expires in minutes. Trade-offs: after a reload you need one refresh call; cookies need the API on the same site (or CORS with credentials) and CSRF protection via SameSite. And say it clearly: storage choice limits damage, it does not fix XSS — escaping, sanitising and CSP do.</p></div>
<div class="callout"><p><strong>Common interview question.</strong> "Several requests fail with 401 at the same time. What does your interceptor do?"</p>
<p>It refreshes once and makes the others wait on the same promise (single-flight), then retries each failed request exactly once with the new token. Auth endpoints are excluded so a wrong password or a failed refresh cannot trigger another refresh. If the refresh itself returns 401, sign out and clear private caches. With rotating refresh tokens, parallel refreshes would invalidate each other and log the user out — I have measured that: 200, 401, 401.</p></div>

<h3>🛠 Keep building the project — step 1/4: a real session</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after Chapter 13 (files <code>src/features/dang-nhap/*</code>, <code>src/shared/api/http.ts</code>, <code>src/mocks/handlers.ts</code>, <code>src/test/setup.ts</code>; 181 tests green).</p><ol>
<li>Create <code>src/mocks/phien.ts</code> (accounts, access/refresh maps, <code>xoayVong</code>, <code>choHetHanTatCa</code>, <code>datLai</code>) and add <code>?het-han=</code> to <code>dieu-khien.ts</code>.</li>
<li>In <code>handlers.ts</code>: <code>POST /api/dang-nhap</code>, <code>POST /api/lam-moi-token</code>, <code>POST /api/dang-xuat</code> with the cookie; 401 on the three appointment endpoints without a valid token; filter <code>GET /api/lich-hen</code> by the caller.</li>
<li>Add <code>accessToken</code>, <code>datToken</code> to the store (persist only <code>nguoiDung</code>); write <code>phien.ts</code>; rewrite <code>FormDangNhap</code> with phone + password.</li>
<li>In <code>http.ts</code>: <code>XacThuc</code>, <code>caiXacThuc</code>, <code>lamMoiChung</code>, the <code>xacThuc</code> option, 401 → refresh → retry once; <code>src/app/phien.ts</code> with <code>ketNoiPhien</code>; call it in <code>main.tsx</code>.</li>
<li>Setup: <code>caiXacThuc</code> + a token per test + <code>phien.datLai()</code> after each test. Write <code>http.test.ts</code> and <code>phien.test.tsx</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>npx tsc -b</code> is clean, <code>npx vitest run src/shared/api/http.test.ts src/app/phien.test.tsx</code> shows "làm mới 1 lần" and Nam seeing <code>(chưa có)</code> then his own doctor, and <code>/dang-nhap?het-han=5</code> in the browser shows 401 → refresh → 200 in the Network tab after 5 seconds.</p></div>
<details><summary>Solution</summary>
<p>All files are printed above exactly as in the reference project. The part people get wrong most often is the order inside <code>afterEach</code> of the setup: <code>datLaiDuLieu()</code> then <code>phien.datLai()</code> — MSW keeps its cookie store between tests in the same file, so an old <code>rt</code> cookie survives; clearing the server's refresh table makes it harmless. Also do <em>not</em> call <code>phien.datLai()</code> inside <code>datLaiDuLieu()</code>: that function also runs when the page loads, and it would wipe every session on F5.</p>
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> prove the three guards of <code>goiApi</code> with your own tests.</p><ol>
<li>Write a test: sign in, call <code>phien.choHetHanTatCa()</code>, then run <code>Promise.all</code> of five <code>api.lichHen()</code> calls. Count <code>POST /api/lam-moi-token</code> with <code>server.events.on('request:start', …)</code>.</li>
<li>Temporarily remove <code>xacThuc: false</code> from <code>apiPhien.dangNhap</code> and run the "wrong password" test. Read the request log. Put it back.</li>
<li>Add a server handler with <code>server.use</code> that returns 401 for <code>/api/lich-hen</code> <em>every</em> time, and check that <code>api.lichHen()</code> still finishes (with <code>LoiApi</code> 401) after exactly two GETs.</li>
</ol><p><strong>Done when:</strong> step 1 logs 10 GETs and 1 refresh; step 2 shows the extra refresh call you removed the guard for; step 3 finishes in under a second with two <code>GET /api/lich-hen</code> and no infinite loop.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">access token</span><span class="v">short-lived pass sent with each request in <code>Authorization: Bearer</code></span></div>
<div class="kv"><span class="k">refresh token</span><span class="v">long-lived pass used only to get a new access token; kept in an HttpOnly cookie</span></div>
<div class="kv"><span class="k">HttpOnly</span><span class="v">cookie flag: page JavaScript cannot read it</span></div>
<div class="kv"><span class="k">SameSite</span><span class="v">cookie flag: do not send it on requests started by other sites (CSRF)</span></div>
<div class="kv"><span class="k">rotation</span><span class="v">each refresh token works once; using it returns a new one</span></div>
<div class="kv"><span class="k">single-flight</span><span class="v">many callers share one in-progress promise instead of starting their own</span></div>
<div class="kv"><span class="k">route guard</span><span class="v">component that redirects away from pages the user cannot use — UX, not security</span></div>
<div class="kv"><span class="k">BroadcastChannel</span><span class="v">browser API to post messages between tabs of the same origin</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Access token in memory (15 minutes), refresh token in an <code>HttpOnly; Secure; SameSite</code> cookie; only the user's name goes to <code>localStorage</code>.</li>
<li>One HTTP layer attaches the token and turns 401 into "refresh once, shared, then retry once"; auth endpoints opt out with <code>xacThuc: false</code>.</li>
<li>The naive per-request refresh, with rotating tokens, measured 200 / 401 / 401 and a signed-out user.</li>
<li>Route guards are UX; the server's 401 is the security. A lazy restore after F5 costs one refresh call.</li>
<li>Sign-out revokes on the server, clears every tab through <code>BroadcastChannel</code>, and removes private queries — otherwise the next user sees the previous user's data.</li>
<li>Tests get a valid token per test and reset the server's sessions after each one.</li>
</ul>

${LINK('https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage', '🛡️', 'OWASP — HTML5 Security: Local Storage', 'Why sensitive tokens do not belong in localStorage.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies', '🍪', 'MDN — Using HTTP cookies', 'HttpOnly, Secure, SameSite, Path, Max-Age.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API', '📡', 'MDN — Broadcast Channel API', 'Messages between tabs of the same origin.')}
${LINK('https://mswjs.io/docs/api/response#cookies', '🧪', 'MSW — Mocking cookies', 'How MSW handles Set-Cookie in mocked responses.')}
${LINK_TRONG('/courses/nextjs', '▲', 'Learn next — Next.js course', 'Server-side sessions and auth with a real backend.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>Xác thực phía client: token, route bảo vệ, và một cú 401 tự lành</h2>
<p class="lead">Ở Chương 7, app phòng khám "đăng nhập" bằng cách nhớ tên và số điện thoại trong một store Zustand. Thế là đủ để dựng cổng route, nhưng chẳng gì ngăn ai đó gọi thẳng API. Bài này cho app một lần đăng nhập thật: máy chủ kiểm mật khẩu, trả về <strong>access token</strong> (tấm vé ngắn hạn gửi kèm mỗi request) và đặt <strong>refresh token</strong> (tấm vé dài hạn) vào một cookie <code>HttpOnly</code>. Khi access token hết hạn, app phải lặng lẽ xin cái mới rồi gửi lại — đúng một lần, kể cả khi năm request cùng hỏng một lúc — và đăng xuất phải có tác dụng ở mọi tab đang mở.</p>
<p>Điểm xuất phát: app sau Chương 13 — 44 file test, <strong>181 test</strong> xanh, React Compiler bật, TanStack Query trên MSW, React Router với route lazy, từ điển VI/EN. Mọi thứ trong chương dựng và đo ngày 26/09/2026 với React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2, MSW 2.15.0, TanStack Query 5.103.3, Zustand 5 và Chromium 149. Hết chương, cùng app đó có <strong>208 test</strong> trong 48 file.</p>

<div class="callout"><p><strong>Chương này đi thế nào.</strong></p>
<ul>
<li><strong>14.1 (bài này)</strong> — đăng nhập, token cất ở đâu, 401 → làm mới một lần → gửi lại một lần, route bảo vệ, đăng xuất ở mọi tab.</li>
<li><strong>14.2</strong> — API thật lúc chậm lúc sập: hết giờ, thử lại có trần, mất mạng, Idempotency-Key, báo lỗi, biến môi trường <code>VITE_</code>.</li>
<li><strong>14.3</strong> — build và deploy: bỏ MSW khỏi production, đọc bundle, ngân sách kích thước, header bảo mật và CSP, CI/CD bằng GitHub Actions.</li>
<li><strong>14.4</strong> — checklist production, một lập trình viên React mức middle cần biết gì, và 15 câu phỏng vấn kèm ý trả lời. Sau đó là <strong>bài thi cuối khoá</strong>.</li>
</ul>
<p>API vẫn là MSW (máy chủ giả trong trình duyệt), nhưng giờ nó cư xử như máy chủ thật: kiểm token, trả 401, xoay vòng refresh token và đặt cookie. Mã client bạn viết chính là mã bạn sẽ ship khi có backend thật.</p></div>

<h3>Token nên nằm ở đâu?</h3>
${slide('rx-14', 3, 'Cất token: bộ nhớ + cookie HttpOnly, không localStorage')}
<p>Token là một chuỗi chứng minh "request này đến từ Ánh, người đã đăng nhập". Ai cầm nó thì làm được mọi việc như Ánh. Vậy câu hỏi "cất nó ở đâu?" thật ra là "còn ai đọc được nó?". Một app trình duyệt có bốn chỗ để cất một chuỗi, và chúng khác nhau đúng ở ba tính chất:</p>
<table>
<thead><tr><th>Chỗ cất</th><th>Script bị chèn đọc được?</th><th>Sống qua F5?</th><th>Tự gửi kèm?</th></tr></thead>
<tbody>
<tr><td><code>localStorage</code></td><td>Có — và chép sang máy khác được</td><td>Có</td><td>Không</td></tr>
<tr><td><code>sessionStorage</code></td><td>Có</td><td>Có (cùng tab)</td><td>Không</td></tr>
<tr><td>Một biến JavaScript (bộ nhớ)</td><td>Có, nhưng chỉ lúc trang còn mở</td><td>Không</td><td>Không</td></tr>
<tr><td>Cookie có <code>HttpOnly</code></td><td><strong>Không</strong> — <code>document.cookie</code> không thấy nó</td><td>Có</td><td>Có — nên cần <code>SameSite</code></td></tr>
</tbody></table>
<p>"Script bị chèn" là XSS (Bài 13.4): một chuỗi từ ngoài lọt vào và chạy như mã trên trang của bạn. Khi XSS đã chạy, nó gọi được API ngay trong trang, token nằm đâu cũng vậy — không lựa chọn chỗ cất nào sửa được bản thân XSS. Thứ lựa chọn này quyết định là <strong>thiệt hại mang ra khỏi trang được bao nhiêu</strong>. Token trong <code>localStorage</code> bị đọc và gửi về máy chủ của kẻ tấn công, rồi dùng nhiều ngày từ một máy khác. Token trong cookie <code>HttpOnly</code> thì không đọc được chút nào.</p>
<p>Câu trả lời phổ biến ở các công ty, và cũng là cách app này làm, chia việc làm hai:</p>
<ul>
<li><strong>Access token</strong> — ngắn hạn (ở đây 15 phút), chỉ nằm trong bộ nhớ (một store Zustand <em>không</em> persist), gửi trong header <code>Authorization: Bearer …</code>. Bị lấy thì cũng sắp hết hạn.</li>
<li><strong>Refresh token</strong> — dài hạn (7 ngày), chỉ nằm trong cookie <code>HttpOnly; Secure; SameSite=Strict</code>. JavaScript không bao giờ thấy nó; trình duyệt chỉ đính kèm khi gọi <code>/api/…</code> của chính site. Nó dùng cho đúng một việc: xin access token mới.</li>
</ul>
<p><code>SameSite=Strict</code> trả lời cột cuối. Cookie được gửi tự động, và chính điều đó làm CSRF (cross-site request forgery — một site khác khiến trình duyệt của bạn gửi request kèm cookie của bạn) xảy ra được. <code>SameSite=Strict</code> bảo trình duyệt không đính cookie khi request bắt đầu từ một site khác.</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — "mình dùng JWT nên để localStorage cũng an toàn".</strong> JWT (JSON Web Token) là một <em>định dạng</em> — chuỗi có chữ ký, đọc được nội dung. Nó không nói gì về chỗ cất. JWT trong <code>localStorage</code> dễ bị lấy y như mọi chuỗi khác ở đó. Cũng đừng giải mã JWT ở client để quyết định chuyện bảo mật: client không kiểm được chữ ký, và ai cũng sửa được bản sao của chính mình.</div>

<h3>Đăng nhập trả về những gì</h3>
${slide('rx-14', 4, 'Đăng nhập trả hai thứ, cất ở hai nơi khác nhau')}
<p>Máy chủ giả giờ có một bảng phiên nhỏ, giống thứ backend thật giữ trong Redis hay cơ sở dữ liệu. Đây là những phần quan trọng — ai đang gọi, và cookie:</p>
${pre('ts', SN.mockNguoiGoi)}
<p>Và ba endpoint về phiên. Để ý: <em>body</em> trả về chỉ có access token; refresh token chỉ đi trong header <code>Set-Cookie</code>:</p>
${pre('ts', SN.mockDangNhap)}
${pre('ts', SN.xoayVong)}
<p><strong>Xoay vòng</strong> (rotation) nghĩa là mỗi refresh token chỉ dùng được một lần: dùng nó thì nhận cặp mới và cái cũ bị xoá. Refresh token bị đánh cắp trở nên vô dụng ngay khi người dùng thật làm mới. Xoay vòng cũng sinh ra con bug nổi tiếng nhất của bài này, bạn sẽ tái hiện nó bên dưới.</p>
<p>Các endpoint cần bảo vệ giờ kiểm token và lọc theo tài khoản nằm trong token — client không còn gửi "lịch của ai", máy chủ tự quyết:</p>
${pre('ts', SN.mockLichHen)}
<p>Ở client, store của Chương 7 thêm một trường. <code>partialize</code> quyết định cái gì xuống <code>localStorage</code>: tên (để chào sau F5), không bao giờ là token:</p>
${pre('ts', SN.store)}
${SD.dangNhapVi}
<div class="callout"><p><strong>JS nhắc nhanh — <code>??=</code>, <code>finally</code>, <code>satisfies</code>.</strong> <code>a ??= b</code> nghĩa là "nếu <code>a</code> là <code>null</code> hoặc <code>undefined</code> thì gán <code>b</code>; không thì để nguyên". <code>promise.finally(f)</code> chạy <code>f</code> khi promise xong, dù thành công hay thất bại, và chuyển nguyên kết quả gốc đi tiếp. <code>x satisfies T</code> kiểm <code>x</code> khớp kiểu <code>T</code> mà không đổi kiểu riêng của <code>x</code> — dùng bên dưới để chắc mọi tin nhắn gửi giữa các tab có hình dạng hợp lệ.</p></div>

<h3>Module phiên: đăng nhập, làm mới, đăng xuất</h3>
<p>Mọi thứ về phiên nằm trong một file của tính năng, <code>src/features/dang-nhap/phien.ts</code>. Đọc <code>apiPhien</code> trước: cả ba lời gọi truyền <code>xacThuc: false</code>, lý do ở phần sau.</p>
${pre('ts', SN.phien)}
<p>Ba chi tiết gánh cả thiết kế:</p>
<ul>
<li><strong><code>lamMoiToken</code> phân biệt hai kiểu hỏng.</strong> 401 từ <code>/api/lam-moi-token</code> nghĩa là cookie cũng chết — phiên hết thật, nên đăng xuất và trả <code>null</code>. Lỗi <em>mạng</em> (Bài 14.2) nghĩa là "chưa biết" — ném tiếp, đừng đá người dùng ra chỉ vì Wi-Fi rớt một giây.</li>
<li><strong><code>dangXuat</code> gọi máy chủ trước, rồi xoá ở client trong <code>finally</code>.</strong> Xoá token ở client chưa phải là đăng xuất: cookie refresh vẫn dùng được 7 ngày. Máy chủ phải thu hồi nó. Và nếu lời gọi đó hỏng, người dùng vẫn mong được đăng xuất trên máy này.</li>
<li><strong>Form đăng nhập coi 401 là "sai mật khẩu"</strong>, không phải "hết phiên". Cùng một mã trạng thái mang nghĩa khác nhau ở những endpoint khác nhau.</li>
</ul>
${pre('tsx', SN.form)}
<p>Câu báo lỗi giống hệt nhau cho "không có số này" và "sai mật khẩu" — có chủ đích: câu "số này chưa có tài khoản" cho phép bất kỳ ai dò xem số điện thoại nào là bệnh nhân của phòng khám.</p>
<p>Thử ngay: mở <code>/dang-nhap</code> của bản demo, gõ <code>0901234567</code> và một mật khẩu sai. Form hiện "Sai số điện thoại hoặc mật khẩu." và tab Network có đúng một request, <code>POST /api/dang-nhap 401</code> — không có lần gọi làm mới nào (đo trên Chromium, dòng [1] của lần chạy bên dưới). Tài khoản mẫu: <code>0901234567</code> / <code>antam2026</code>.</p>

<h3>401 → làm mới một lần → gửi lại một lần</h3>
${slide('rx-14', 5, '401 → làm mới MỘT lần chung → gửi lại MỘT lần')}
<p>Giờ tới phần lõi. Mọi lời gọi API trong app đi qua <code>goiApi</code> trong <code>src/shared/api/http.ts</code> (Chương 6). Nó phải gắn token, và khi máy chủ trả 401 thì phải làm mới rồi gửi lại — component không hề biết. Nhưng <code>shared/</code> không được import <code>features/</code> (luật một chiều của Chương 7), mà phiên lại nằm trong <code>features/dang-nhap</code>. Lời giải là <strong>đảo phụ thuộc</strong>: <code>http.ts</code> khai báo nó cần gì, tầng <code>app/</code> cắm vào.</p>
${pre('ts', SN.httpXacThuc)}
${pre('ts', SN.tuyChon)}
${pre('ts', SN.goiApi)}
${SD.lamMoiVi}
<p>Ba chốt chặn giữ cho nó không lặp và không bắn nhầm:</p>
<ol>
<li><strong>Một lần làm mới cho tất cả.</strong> <code>dangLamMoi ??= …</code>: request đầu tiên gặp 401 bắt đầu làm mới; mọi request khác gặp 401 trong lúc đó <code>await</code> <em>cùng</em> promise đó. <code>finally</code> đặt lại biến để lần hết hạn sau, 15 phút nữa, bắt đầu một lần mới.</li>
<li><strong>Mỗi request gửi lại tối đa một lần.</strong> Lần gửi lại là <code>gui(...)</code> trơn, không phải <code>goiApi(...)</code>: nếu nó vẫn 401 thì rơi xuống <code>throw new LoiApi(401)</code>. Không đệ quy, không vòng lặp vô hạn.</li>
<li><strong>Endpoint xác thực đứng ngoài.</strong> <code>xacThuc: false</code> cho đăng nhập, làm mới và đăng xuất: không gắn token, không làm mới khi 401. Thiếu nó, sai mật khẩu sẽ kích hoạt làm mới, và làm mới hỏng lại kích hoạt làm mới tiếp.</li>
</ol>
<p>Phép kiểm nhỏ <code>hienTai !== daDung</code> xử lý một cuộc đua chỉ thấy khi tải cao: request A gửi với token cũ, lần làm mới của request B xong trong lúc A đang bay, A quay về 401. Đã có token mới rồi — dùng luôn, đừng làm mới lần nữa.</p>
<p>Tầng app nối mọi thứ trong <code>src/app/phien.ts</code>, gọi một lần trong <code>main.tsx</code> cạnh QueryClient:</p>
${pre('ts', SN.appPhien)}
<p>Test đếm request qua luồng sự kiện của MSW, nên "đúng một lần làm mới" là một con số, không phải cảm giác:</p>
${pre('ts', SN.httpTestBa)}
${out(OUT.httpTest)}

<h3>Chạy thử từng bước</h3>
<ol>
<li>Ánh đăng nhập. <code>POST /api/dang-nhap</code> trả <code>{ accessToken, hetHanSau, nguoiDung }</code> và <code>Set-Cookie: rt=…; HttpOnly</code>. <code>luuPhien</code> đưa token và tên vào store; <code>persist</code> chỉ ghi tên xuống <code>localStorage</code>.</li>
<li>Chị mở "Lịch hẹn của tôi". <code>useLichHen</code> → <code>api.lichHen()</code> → <code>goiApi</code> đọc <code>layToken()</code> và gửi <code>Authorization: Bearer at-…</code>. Máy chủ lọc theo số điện thoại của chị: 200.</li>
<li>20 phút trôi qua. Chị bấm lại. Ba request đi cùng lúc (lịch hẹn, bác sĩ, huy hiệu trên header). Những request lịch hẹn trả 401.</li>
<li>401 đầu tiên chạy <code>lamMoiChung()</code>: <code>dangLamMoi</code> đang <code>null</code>, nên nó gọi <code>lamMoiToken()</code> và cất promise. 401 thứ hai thấy promise đó và chờ.</li>
<li>Trình duyệt đính cookie <code>rt</code> vào <code>POST /api/lam-moi-token</code>; máy chủ xoay vòng: access token mới trong body, cookie mới trong header, refresh cũ bị xoá.</li>
<li><code>lamMoiToken</code> ghi token mới vào store rồi resolve; hai request đang chờ gọi lại <code>gui</code> với nó: 200, 200. <code>finally</code> dọn <code>dangLamMoi</code>.</li>
<li>Component không thấy gì cả — TanStack Query chỉ nhận dữ liệu chậm hơn vài mili giây.</li>
</ol>

<h3>Bản ngây thơ: làm mới ba lần là bị đá ra</h3>
${slide('rx-14', 6, 'Bản ngây thơ: ba lần làm mới, bị đăng xuất oan')}
<p>Sao phải cầu kỳ quanh một promise như vậy? Vì cách viết hiển nhiên thì sai, và sai theo kiểu chỉ lộ ra khi có đồng thời thật. Đây là cách viết hiển nhiên, giữ trong dự án dưới dạng một test <em>khẳng định cái bug</em>:</p>
${pre('ts', SN.ngayTho)}
${out(OUT.ngayTho)}
<p>Ba request, ba lần làm mới. Có xoay vòng, lần làm mới đầu dùng mất token trong cookie; lần thứ hai và thứ ba gửi một token máy chủ đã xoá, nhận 401, và <code>lamMoiToken</code> kết luận — đúng theo góc nhìn của nó — rằng phiên đã hết. Người dùng đang dùng app giữa chừng thì văng ra trang đăng nhập. Trên production nó trông như "app thỉnh thoảng tự đăng xuất tôi", vài người dùng báo, và không tái hiện được trên máy nhanh của lập trình viên.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — cùng cuộc đua đó, nhưng giữa các tab.</strong> Single-flight trong <code>http.ts</code> sửa được một tab. Hai tab cùng làm mới trong một giây vẫn có thể giẫm nhau trên refresh token xoay vòng. Hệ thống thật thêm một khoảng ân hạn ở máy chủ (refresh token cũ còn hiệu lực vài giây) hoặc điều phối các tab bằng Web Locks API (<code>navigator.locks.request('lam-moi', …)</code>). Biết là nó tồn tại; đây là câu hỏi đào sâu hay gặp khi phỏng vấn.</div>

<h3>Đo trên trình duyệt thật</h3>
${slide('rx-14', 7, 'Chromium thật: token hết hạn, F5, đăng xuất tab kia')}
<p>Script <code>do/ch14-phien.mjs</code> lái bản demo trong Chromium 149. Máy chủ giả đọc <code>?het-han=5</code> trên URL và cấp access token sống 5 giây, để xem được lúc hết hạn thay vì phải chờ:</p>
${out(OUT.chromium)}
<p>Đọc từng dòng:</p>
<ul>
<li><strong>[2]</strong> <code>document.cookie</code> rỗng và kho cookie thật của trình duyệt không có gì: cookie <code>HttpOnly</code> vô hình với script của trang. Nói thật: MSW không phải máy chủ thật nên không đưa được cookie vào kho của trình duyệt; nó giữ kho cookie riêng trong <code>localStorage["__msw-cookie-store__"]</code> và đính vào các request nó chặn. Với backend thật, khoá đó không tồn tại — cookie nằm ở chỗ không script nào với tới. Mã client không đổi.</li>
<li><strong>[3]</strong> Sau 5,5 giây: một 401, một lần làm mới, một lần gửi lại.</li>
<li><strong>[4]</strong> F5 ở <code>/lich-hen</code>: access token (bộ nhớ) mất, tên (đã persist) còn, nên cổng route cho trang vẽ; request đầu nhận 401 và cookie mang phiên trở lại. Đó là cái giá của việc không cất token xuống bộ nhớ trình duyệt: thêm một vòng request sau mỗi lần tải lại.</li>
<li><strong>[5]</strong> Đăng xuất ở tab A; tab B đang mở <code>/lich-hen</code> tự nhảy sang <code>/dang-nhap</code>.</li>
</ul>

<h3>Route bảo vệ, và vì sao nó chỉ là một nửa câu chuyện</h3>
<p>Cổng <code>YeuCauDangNhap</code> của Chương 7 không đổi một dòng. Nó đọc <code>nguoiDung</code> từ store: không có người dùng → chuyển sang <code>/dang-nhap</code>, mang trang định vào trong <code>state.tu</code>; đăng nhập xong, <code>TrangDangNhap</code> đưa về lại. Cái đổi là <em>thứ nằm phía sau</em>: trước đây ai cũng gọi được <code>GET /api/lich-hen</code>; giờ máy chủ trả 401 nếu thiếu token hợp lệ. Cổng route là trải nghiệm người dùng — nó giấu những trang chỉ toàn lỗi. Bảo mật là con 401 ở máy chủ. Nhà tuyển dụng hỏi "bảo vệ route trong React thế nào?" thì nói đủ cả hai nửa.</p>
<p>Một hệ quả của việc khôi phục "lười": sau F5, cổng tin cái tên đã persist trong chốc lát, trước khi có request nào chứng minh phiên còn sống. Nếu cookie hoá ra đã chết, request đầu hỏng, <code>lamMoiToken</code> đăng xuất, store rỗng, và cổng chuyển hướng. Một cách khác nhiều đội thích hơn là trạng thái "đang kiểm phiên…" lúc khởi động: gọi <code>/api/lam-moi-token</code> một lần trước khi vẽ trang cần bảo vệ. Tốn một request mỗi lần tải trang, nhưng không bao giờ cho người đã đăng xuất thấy trang bảo vệ, dù chỉ một khung hình.</p>

<h3>Đăng xuất ở mọi nơi — và dọn cache</h3>
${slide('rx-14', 8, 'Đăng xuất không dọn cache: Nam thấy lịch của Ánh')}
<p>Hai tab của cùng một site dùng chung cookie và <code>localStorage</code>, nhưng không chung bộ nhớ JavaScript — mỗi tab một store Zustand. <code>BroadcastChannel</code> là cách có sẵn của trình duyệt để gửi tin giữa các tab cùng nguồn (origin). <code>xoaPhien</code> gửi <code>{ loai: 'dang-xuat' }</code>; mọi tab khác, đang nghe qua <code>langNgheTabKhac</code>, làm rỗng store của mình; cổng route lo phần còn lại.</p>
${SD.tabVi}
<p>Nửa thứ hai kém hiển nhiên hơn và được tìm ra nhờ một test. Ánh đăng xuất, Nam đăng nhập trên cùng máy tính và mở lịch hẹn của anh:</p>
${pre('tsx', SN.phienTest)}
${out(OUT.phienTest)}
<p>Không có <code>ketNoiPhien</code>, trang của Nam mở ra với <strong>lịch hẹn của Ánh</strong>. TanStack Query vẫn còn <code>["lich-hen"]</code> trong cache và vẽ ngay trong lúc tải lại — đó là việc của nó. Tệ hơn, trong lần đo, một <code>GET /api/lich-hen</code> mang token của Ánh còn đang bay lúc chị đăng xuất; khi trang của Nam hỏi cùng khoá đó, TanStack <em>gộp</em> vào chính request đó thay vì gửi request mới, và dữ liệu của Ánh được ghi vào cache như dữ liệu mới (lần chạy này nó vẫn nằm trên màn hình một giây sau; bao lâu thì tuỳ request cũ về lúc nào). Có <code>ketNoiPhien</code>, đăng xuất gỡ các query riêng tư, nên trang của Nam bắt đầu trống rồi tải lịch của chính anh. Cách còn chắc hơn là đưa người dùng vào khoá — <code>['lich-hen', soDienThoai]</code> — để hai người không bao giờ dùng chung một ô cache.</p>
${pre('tsx', SN.tabTest)}

<div class="pitfall co-tieu-de"><strong>Bẫy — xoá token mà không xoá phiên ở máy chủ.</strong> "Đăng xuất" chỉ chạy <code>localStorage.removeItem</code> để lại một cookie refresh còn dùng được 7 ngày trên máy tính dùng chung. Luôn gọi máy chủ để thu hồi, rồi xoá ở client trong <code>finally</code>.</div>

<h3>Test giờ cần token</h3>
<p>Khi API giả đã kiểm token, mọi test cũ có đọc lịch hẹn đều sẽ nhận 401. File setup cho mỗi test một token hợp lệ của bệnh nhân mẫu — như app sau khi có <code>ketNoiPhien</code> — nhưng để <code>nguoiDung</code> là null để các test cổng route của Chương 7 giữ nguyên ý nghĩa:</p>
${pre('ts', SN.setup)}
<p>Hai test cũ đổi có chủ đích: test router giờ gõ mật khẩu thay vì họ tên, và test huỷ lịch của Chương 12 đăng nhập bằng chính bệnh nhân sở hữu lịch đó (máy chủ giờ lọc theo chủ). Sửa test vì <em>yêu cầu</em> đổi là chuyện bình thường; sửa test vì nó bất tiện thì không.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Đồ án FER202 thường kiểm tên đăng nhập với một file JSON hay mảng <code>users</code>, rồi cất nguyên object người dùng (đôi khi có cả mật khẩu) vào <code>localStorage</code>; "route bảo vệ" là một câu <code>if (!user) navigate('/login')</code>, và API phía sau là json-server không kiểm gì. → Đi làm: máy chủ kiểm hash mật khẩu và cấp token; access token nằm trong bộ nhớ, refresh token trong cookie <code>HttpOnly</code>; một tầng HTTP lo 401 → làm mới → gửi lại cho cả app; máy chủ kiểm quyền ở mọi endpoint; đăng xuất thu hồi ở máy chủ và dọn cache riêng tư. · <em>Vì sao:</em> không ai tấn công đồ án, và mỗi sinh viên dùng laptop của mình. App phòng khám giữ lịch khám của người thật trên máy tính dùng chung. Cách FER202 ổn cho bài tập — và bạn vẫn sẽ gặp token trong <code>localStorage</code> ở mã cũ của công ty; giờ bạn giải thích được nên đổi gì.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Trong app React bạn cất JWT ở đâu, vì sao?"</p>
<p>Access token ngắn hạn trong bộ nhớ, gửi bằng header Bearer; refresh token dài hạn trong cookie <code>HttpOnly; Secure; SameSite</code> mà JavaScript không đọc được. Lý do: XSS đọc được <code>localStorage</code> và mang token đi dùng chỗ khác; nó không đọc được cookie HttpOnly, và access token bị lấy thì vài phút là hết hạn. Đánh đổi: sau khi tải lại cần một lần gọi làm mới; cookie cần API cùng site (hoặc CORS có credentials) và chống CSRF bằng SameSite. Và nói rõ: chọn chỗ cất chỉ giới hạn thiệt hại, không sửa được XSS — thoát ký tự, lọc HTML và CSP mới làm việc đó.</p></div>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Nhiều request cùng hỏng 401 một lúc. Interceptor của bạn làm gì?"</p>
<p>Làm mới một lần và bắt các request kia chờ cùng promise (single-flight), rồi gửi lại mỗi request hỏng đúng một lần với token mới. Endpoint xác thực được loại ra để sai mật khẩu hay làm mới hỏng không kích hoạt làm mới nữa. Nếu chính lần làm mới trả 401 thì đăng xuất và dọn cache riêng tư. Với refresh token xoay vòng, các lần làm mới song song vô hiệu hoá lẫn nhau và đá người dùng ra — tôi đã đo: 200, 401, 401.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 1/4: phiên đăng nhập thật</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau Chương 13 (các file <code>src/features/dang-nhap/*</code>, <code>src/shared/api/http.ts</code>, <code>src/mocks/handlers.ts</code>, <code>src/test/setup.ts</code>; 181 test xanh).</p><ol>
<li>Tạo <code>src/mocks/phien.ts</code> (tài khoản, bảng access/refresh, <code>xoayVong</code>, <code>choHetHanTatCa</code>, <code>datLai</code>) và thêm <code>?het-han=</code> vào <code>dieu-khien.ts</code>.</li>
<li>Trong <code>handlers.ts</code>: <code>POST /api/dang-nhap</code>, <code>POST /api/lam-moi-token</code>, <code>POST /api/dang-xuat</code> có cookie; 401 ở ba endpoint lịch hẹn khi thiếu token hợp lệ; lọc <code>GET /api/lich-hen</code> theo người gọi.</li>
<li>Thêm <code>accessToken</code>, <code>datToken</code> vào store (chỉ persist <code>nguoiDung</code>); viết <code>phien.ts</code>; viết lại <code>FormDangNhap</code> với số điện thoại + mật khẩu.</li>
<li>Trong <code>http.ts</code>: <code>XacThuc</code>, <code>caiXacThuc</code>, <code>lamMoiChung</code>, tuỳ chọn <code>xacThuc</code>, 401 → làm mới → gửi lại một lần; <code>src/app/phien.ts</code> với <code>ketNoiPhien</code>; gọi nó trong <code>main.tsx</code>.</li>
<li>Setup: <code>caiXacThuc</code> + một token mỗi test + <code>phien.datLai()</code> sau mỗi test. Viết <code>http.test.ts</code> và <code>phien.test.tsx</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>npx tsc -b</code> sạch, <code>npx vitest run src/shared/api/http.test.ts src/app/phien.test.tsx</code> in "làm mới 1 lần" và Nam thấy <code>(chưa có)</code> rồi tới bác sĩ của chính anh, và mở <code>/dang-nhap?het-han=5</code> trên trình duyệt, sau 5 giây tab Network hiện 401 → làm mới → 200.</p></div>
<details><summary>Lời giải</summary>
<p>Mọi file đã in ở trên đúng như dự án mẫu. Chỗ hay sai nhất là thứ tự trong <code>afterEach</code> của setup: <code>datLaiDuLieu()</code> rồi <code>phien.datLai()</code> — MSW giữ kho cookie giữa các test trong cùng một file, nên cookie <code>rt</code> cũ còn sống; xoá bảng refresh của máy chủ làm nó vô hại. Và <em>đừng</em> gọi <code>phien.datLai()</code> bên trong <code>datLaiDuLieu()</code>: hàm đó cũng chạy lúc trang tải, nó sẽ xoá sạch mọi phiên mỗi lần F5 (đã gặp thật khi dựng bài: F5 là bị đăng xuất).</p>
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề:</strong> chứng minh ba chốt chặn của <code>goiApi</code> bằng test của chính bạn.</p><ol>
<li>Viết một test: đăng nhập, gọi <code>phien.choHetHanTatCa()</code>, rồi chạy <code>Promise.all</code> năm lời <code>api.lichHen()</code>. Đếm <code>POST /api/lam-moi-token</code> bằng <code>server.events.on('request:start', …)</code>.</li>
<li>Tạm bỏ <code>xacThuc: false</code> khỏi <code>apiPhien.dangNhap</code> rồi chạy test "sai mật khẩu". Đọc nhật ký request. Trả lại như cũ.</li>
<li>Thêm một handler bằng <code>server.use</code> trả 401 cho <code>/api/lich-hen</code> <em>mọi</em> lần, rồi kiểm rằng <code>api.lichHen()</code> vẫn kết thúc (bằng <code>LoiApi</code> 401) sau đúng hai lần GET.</li>
</ol><p><strong>Đạt khi:</strong> bước 1 ghi 10 GET và 1 lần làm mới; bước 2 hiện thêm lần gọi làm mới mà bạn vừa gỡ chốt; bước 3 kết thúc dưới một giây với hai <code>GET /api/lich-hen</code> và không lặp vô hạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">access token</span><span class="v">vé ngắn hạn gửi kèm mỗi request trong <code>Authorization: Bearer</code></span></div>
<div class="kv"><span class="k">refresh token</span><span class="v">vé dài hạn chỉ dùng để xin access token mới; nằm trong cookie HttpOnly</span></div>
<div class="kv"><span class="k">HttpOnly</span><span class="v">cờ của cookie: JavaScript của trang không đọc được</span></div>
<div class="kv"><span class="k">SameSite</span><span class="v">cờ của cookie: không gửi kèm request do site khác khởi xướng (chống CSRF)</span></div>
<div class="kv"><span class="k">rotation (xoay vòng)</span><span class="v">mỗi refresh token dùng được một lần; dùng xong nhận cái mới</span></div>
<div class="kv"><span class="k">single-flight</span><span class="v">nhiều bên gọi dùng chung một promise đang chạy thay vì mỗi bên tự chạy</span></div>
<div class="kv"><span class="k">route guard (cổng route)</span><span class="v">component chuyển hướng khỏi trang người dùng không được dùng — trải nghiệm, không phải bảo mật</span></div>
<div class="kv"><span class="k">BroadcastChannel</span><span class="v">API của trình duyệt để gửi tin giữa các tab cùng nguồn</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Access token trong bộ nhớ (15 phút), refresh token trong cookie <code>HttpOnly; Secure; SameSite</code>; chỉ tên người dùng xuống <code>localStorage</code>.</li>
<li>Một tầng HTTP gắn token và biến 401 thành "làm mới một lần, dùng chung, rồi gửi lại một lần"; endpoint xác thực đứng ngoài bằng <code>xacThuc: false</code>.</li>
<li>Bản làm mới theo từng request, với token xoay vòng, đo được 200 / 401 / 401 và một người dùng bị đá ra.</li>
<li>Cổng route là trải nghiệm; con 401 của máy chủ mới là bảo mật. Khôi phục "lười" sau F5 tốn một lần gọi làm mới.</li>
<li>Đăng xuất thu hồi ở máy chủ, xoá phiên ở mọi tab qua <code>BroadcastChannel</code>, và gỡ query riêng tư — không thì người sau thấy dữ liệu của người trước.</li>
<li>Test nhận một token hợp lệ mỗi lần chạy và đặt lại phiên của máy chủ sau mỗi test.</li>
</ul>

${LINK('https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage', '🛡️', 'OWASP — HTML5 Security: Local Storage', 'Vì sao token nhạy cảm không thuộc về localStorage.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies', '🍪', 'MDN — Using HTTP cookies', 'HttpOnly, Secure, SameSite, Path, Max-Age.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API', '📡', 'MDN — Broadcast Channel API', 'Gửi tin giữa các tab cùng nguồn.')}
${LINK('https://mswjs.io/docs/api/response#cookies', '🧪', 'MSW — Mocking cookies', 'MSW xử lý Set-Cookie trong câu trả lời giả thế nào.')}
${LINK_TRONG('/courses/nextjs', '▲', 'Học tiếp — Khoá Next.js', 'Phiên phía máy chủ và xác thực với backend thật.')}
</div>
`,
};

const L2 = {
    title: '14.2 — A real API: timeouts, retries, offline, idempotency, error reporting, Vite env|||14.2 — API thật: hết giờ, thử lại, mất mạng, idempotency, báo lỗi, biến môi trường Vite',
    slug: 'rx-14-2-api-that',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Làm app đặt lịch chịu được một API thật: tách lỗi mạng, hết giờ và lỗi máy chủ; thử lại có trần và jitter; chỉ thử lại lệnh ghi khi có Idempotency-Key; báo mất mạng; gửi lỗi về đội bằng onCaughtError/onUncaughtError của React 19; và biến môi trường VITE_ — đo thật chúng nằm nguyên văn trong bundle.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2</span>
<h2>A real API: slow, sometimes down, and never quite what you expected</h2>
<p class="lead">On your machine the fake API answers in 5 milliseconds and never fails unless you ask it to. A real API lives on a server in another city, behind Wi-Fi that drops in the elevator, and it is restarted during deploys. This lesson makes the clinic app survive that: it tells a lost connection from a slow server from a server error, retries only what can heal, never books an appointment twice because of a retry, tells the user when they are offline, and sends its own errors to the team. At the end: the environment variables that point the build at the real API — and a measurement of why they must never hold secrets.</p>
<p>Starting point: the project after Lesson 14.1 (real session, 401 → refresh). New files in this lesson: <code>src/shared/api/thong-diep-loi.ts</code>, <code>src/shared/hooks/useTrucTuyen.ts</code>, <code>src/shared/ui/BangMatMang.tsx</code>, <code>src/shared/loi/bao-loi.ts</code>, <code>src/env.d.ts</code>, three <code>.env</code> files, and the test file <code>src/app/do-ben.test.tsx</code>.</p>

<h3>Three kinds of failure, three different errors</h3>
${slide('rx-14', 9, 'Three different failures, caught as three different errors')}
<p>Chapter 6 taught the first surprise of <code>fetch</code>: a 404 or 500 is <em>not</em> an error for it — the promise resolves and you must check <code>res.ok</code>. The second surprise is the opposite: when there is no HTTP answer at all, <code>fetch</code> rejects, and it rejects for very different reasons that the old code lumped together as "not a <code>LoiApi</code>, so probably the network". The user deserves different messages, and retry needs different rules, so <code>http.ts</code> now names them:</p>
${pre('ts', SN.loiMang)}
${pre('ts', SN.gui)}
${SD.loiEn}
<ul>
<li><strong><code>AbortSignal.timeout(ms)</code></strong> returns a signal that aborts itself after <code>ms</code> milliseconds. Before it existed (2022), people wrote <code>setTimeout</code> + <code>AbortController</code> by hand and often forgot to clear the timer.</li>
<li><strong><code>AbortSignal.any([a, b])</code></strong> combines two reasons to stop: TanStack Query's own signal (the user left the page — Chapter 6) and our timeout. Whichever fires first aborts the request.</li>
<li><strong>The order of the <code>if</code>s matters.</strong> If the caller aborted, the error must stay an <code>AbortError</code>: TanStack Query recognises it and quietly drops the result. Turning it into "no connection" would flash an error message every time someone clicks a link quickly.</li>
<li><strong><code>{ cause: loi }</code></strong> keeps the original <code>TypeError</code> inside the new error, so the stack trace is not lost when it is reported.</li>
</ul>
<p>Measured in <code>src/shared/api/http.test.ts</code> (the same file as Lesson 14.1): an endless server with <code>thoiGianCho: 200</code> fails after 202 ms as <code>het-gio</code>; <code>HttpResponse.error()</code> (MSW's way of saying "the network failed") becomes <code>mat-mang</code> with <code>TypeError: Failed to fetch</code> as the cause; and aborting from outside stays <code>AbortError</code>.</p>
<div class="callout"><p><strong>JS quick reminder — <code>class … extends Error</code> and <code>instanceof</code>.</strong> <code>class LoiMang extends Error</code> makes a new kind of error that still behaves like every other error (message, stack) but can carry extra fields such as <code>loai</code>. <code>loi instanceof LoiMang</code> asks "was this created by <code>new LoiMang</code>?", which is how the rest of the app decides what happened. Plain objects thrown with <code>throw { code: 1 }</code> have no stack and fail every <code>instanceof</code> check — always throw real <code>Error</code>s.</p></div>

<h3>Retry with a cap, and with jitter</h3>
${slide('rx-14', 10, 'Retry with a cap, with jitter, only errors that can heal')}
<p>TanStack Query retries failed queries three times by default. The question is <em>which</em> failures. Retrying a 404 just shows the user a spinner for 7 seconds before the same "not found". The app's rule, rewritten for the new error types:</p>
${pre('ts', SN.queryClient)}
${SD.thuLaiEn}
<p><strong>Jitter</strong> is the random part. Imagine the clinic's server crashes at 08:00 during the morning rush and 10,000 browsers are open. Without jitter every one of them retries after exactly 1 s, then 2 s, then 4 s — three synchronised waves that knock the server down again each time it gets up. With half the delay random, the retries spread out across the window. The numbers are measured over 1,000 calls per level:</p>
${out(OUT.treThuLai)}
<p>And the whole loop, end to end, against a server that answers 503 twice before it recovers:</p>
${pre('tsx', SN.testChapChon)}
<p>The test uses the <em>real</em> client from <code>taoQueryClient()</code> (the test helper <code>taoClientTest</code> turns retry off) and only shortens the delay. Result: three requests, success, six doctors — the user saw a spinner and then data, never an error. You can watch it in the browser too: <code>/bac-si?chap-chon=3</code> makes the fake server fail the first three requests.</p>

<h3>Writes: retry only with an Idempotency-Key</h3>
${slide('rx-14', 11, 'A WRITE may only be retried when it has an Idempotency-Key')}
<p>Mutations (Chapter 6) do not retry by default, and for good reason. Picture the worst case: Ánh presses "Xác nhận đặt lịch", the server books the slot, and the answer is lost on the way back (the phone switched from Wi-Fi to 4G). The browser sees a timeout. If the app now retries the <code>POST</code>, the server receives a second, identical booking request. Is that a new booking or the same one again? Without extra information the server cannot know.</p>
<p><strong>Idempotent</strong> means "doing it twice has the same effect as doing it once". <code>GET</code>, <code>PUT</code> and <code>DELETE</code> are idempotent by design; <code>POST</code> is not. The standard fix is an <code>Idempotency-Key</code> header: a random id the client generates once per user intent and sends with every attempt. The server remembers keys it has processed and answers a repeat with the original result.</p>
${pre('ts', SN.datLichApi)}
${pre('ts', SN.useDatLich)}
${pre('ts', SN.mockIdem)}
${pre('ts', SN.testIdem)}
<p>The measured result is the whole argument: same key → the server returns <code>lh-1</code> both times and there is one appointment in the database; <strong>no key → <code>409 Khung giờ này vừa có người đặt</code></strong>. Look at that last one from Ánh's side: her appointment <em>was</em> created, but the screen tells her the slot is taken. She books another slot, and the clinic now holds two appointments for her.</p>
<div class="pitfall co-tieu-de"><strong>Trap — generating the key inside <code>mutationFn</code>.</strong> TanStack calls <code>mutationFn</code> again for every retry. A <code>crypto.randomUUID()</code> inside it produces a new key per attempt, and the server sees three different requests. Generate the key once per intent — here once per visit to the booking page with <code>useState(() =&gt; crypto.randomUUID())</code> — and pass it in. One more trap: <code>crypto.randomUUID</code> exists only in secure contexts (HTTPS or <code>localhost</code>); on a plain-HTTP staging server it is <code>undefined</code> and the page crashes.</div>

<h3>Offline: tell the person, pause the queries</h3>
${slide('rx-14', 12, 'Offline: tell the user, TanStack pauses the queries')}
<p>The browser knows when the network card disconnects and fires <code>offline</code> / <code>online</code> events on <code>window</code>; <code>navigator.onLine</code> holds the current value. That is data living outside React that changes over time — exactly what <code>useSyncExternalStore</code> (Chapter 12) is for:</p>
${pre('ts', SN.useTrucTuyen)}
${pre('tsx', SN.bangMatMang)}
<p>The banner sits in <code>KhungTrang</code> under the header, its text comes from the dictionary (Chapter 13 — the <code>satisfies</code> check forced both <code>vi</code> and <code>en</code> to get the key), and <code>role="status"</code> makes screen readers announce it. Measured in Chromium with <code>context.setOffline(true)</code>: <code>navigator.onLine</code> became <code>false</code> and the banner appeared; back online, it disappeared.</p>
<p>TanStack Query has its own <code>onlineManager</code>. When it believes the browser is offline, queries do not fail — they <strong>pause</strong>:</p>
${pre('tsx', SN.testOffline)}
<p>Measured: after 300 ms offline, <code>status=pending · fetchStatus=paused · request đã gửi: 0</code>; back online, one request and success. Without the pause, three retries would burn in a few seconds in the tunnel and the user would come out to an error screen. Two facts worth remembering: <code>navigator.onLine === true</code> only means "some network is connected", not "the server is reachable" (captive Wi-Fi portals return <code>true</code>); and TanStack Query v5 starts by assuming it is online and changes only on events (read in <code>onlineManager.js</code>, 5.103).</p>

<h3>Error reporting: errors must reach the team by themselves</h3>
${slide('rx-14', 13, 'Error reporting: errors must reach the team, not sit in the console')}
<p>Chapter 11 built <code>RanhGioiLoi</code>, the error boundary that keeps a crash in one part from blanking the page. But the boundary only protects the user. The team still does not know: the error message went to a console on someone's phone. Production apps send every unexpected error to a service — Sentry, GlitchTip, Datadog, or an endpoint of your own backend — with enough context to fix it. Here is a small, honest version of what those tools do:</p>
${pre('ts', SN.baoLoi)}
${SD.baoLoiEn}
<p>React 19 added the missing piece: <code>createRoot</code> accepts callbacks for every render error. "Caught" means a boundary caught it (the user sees your fallback); "uncaught" means nobody did (React unmounts the whole tree):</p>
${pre('tsx', SN.mainRoot)}
${pre('tsx', SN.testBaoLoi)}
${out(OUT.doBen)}
<p>What makes a report useful, and what the code above does about it:</p>
<ul>
<li><strong>Remove noise.</strong> A lost connection or a 409 is not a bug; the UI already handles them. A dashboard full of "Failed to fetch" hides the one real crash.</li>
<li><strong>Deduplicate and cap.</strong> An error inside a render loop can fire a thousand times a second. 50 identical errors produced exactly one report in the test.</li>
<li><strong>Version.</strong> "TypeError in <code>Xc</code>" is useless unless you know which build produced <code>Xc</code>. CI sets <code>VITE_PHIEN_BAN</code> to the commit (Lesson 14.3), and hidden source maps turn <code>Xc</code> back into <code>baoLoi</code>.</li>
<li><strong>Privacy.</strong> Only <code>location.pathname</code> is sent — never the query string or hash, which can contain tokens or phone numbers.</li>
<li><strong><code>sendBeacon</code></strong> queues the request so it is delivered even if the user is closing the tab.</li>
</ul>
<p>With Sentry the setup is a few lines — <code>Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN, release: import.meta.env.VITE_PHIEN_BAN })</code> — and the root callbacks call <code>Sentry.captureException</code>; Sentry adds grouping, breadcrumbs (what the user clicked before), alerts and source-map upload. The DSN is not a secret: it only allows <em>sending</em> events.</p>
<p>⏳ Not run for real: sending reports to a hosted Sentry/GlitchTip project needs an account and a DSN that this machine does not have. The reporting logic above is tested with an injected receiver instead.</p>
<!-- CHAY-O-MAY: tạo project Sentry (hoặc GlitchTip tự host), đặt VITE_BAO_LOI_URL/DSN, build, gây một lỗi render và xem báo cáo về tới dashboard kèm phiên bản -->

<h3>Empty and error states that speak human</h3>
<p>The last piece of resilience is the sentence the user reads. <code>LoiTaiDuLieu</code> (Chapter 6) used to print <code>loi.message</code> — which for a 500 could be <code>relation "lich_hen" does not exist</code>. One function now maps every error to one sentence with an action:</p>
${pre('ts', SN.thongDiep)}
<p>Two existing tests had to change their expected text, on purpose: a 500 now shows "Máy chủ đang gặp sự cố…" instead of the server's own message. Empty states did not change: "Chưa có lịch hẹn nào" with a link to book, from Chapter 6, is still the right answer when the list is legitimately empty — an empty list is not an error.</p>

<h3>Run it step by step</h3>
<ol>
<li>Ánh opens <code>/bac-si</code> in a tunnel. The browser fires <code>offline</code>; <code>useTrucTuyen</code> re-renders <code>BangMatMang</code>: the banner appears. <code>onlineManager</code> pauses the doctor query: no request, no error.</li>
<li>Out of the tunnel: <code>online</code> fires, the banner disappears, TanStack resumes the query: one <code>GET /api/bac-si</code>.</li>
<li>The server is overloaded: 503. <code>nenThuLai(0, LoiApi 503)</code> → true; <code>treThuLai(0)</code> → about 700 ms. Again 503; wait 1–2 s. Then 200: the list appears.</li>
<li>She books. <code>POST /api/lich-hen</code> with <code>Idempotency-Key: K</code>. The server creates <code>lh-1</code>, but the answer takes longer than 10 s: <code>AbortSignal.timeout</code> fires, <code>gui</code> throws <code>LoiMang('het-gio')</code>.</li>
<li>The mutation's <code>retry</code> sees a <code>LoiMang</code> and 0 failures → retry with the same K. The server finds K, returns <code>lh-1</code>. She sees her confirmation; the database holds one appointment.</li>
<li>Somewhere a component reads <code>bacSi.ten</code> of <code>undefined</code>. <code>RanhGioiLoi</code> shows its fallback; React calls <code>onCaughtError</code>; <code>baoLoi</code> sends one report with the component stack and the commit id.</li>
</ol>

<h3>Environment variables: pointing the build at the real API</h3>
${slide('rx-14', 14, 'VITE_ variables sit verbatim in the bundle: no secrets')}
<p>The fake API answers on the same origin (<code>/api/…</code>). The real one might live at <code>https://api.phong-kham.example</code>. The address must differ between your laptop, a staging server and production without changing code — that is what environment variables are for. Vite reads them from <code>.env</code> files:</p>
${pre('bash', SN.envFiles)}
<table>
<thead><tr><th>File</th><th>Loaded when</th><th>Commit?</th></tr></thead>
<tbody>
<tr><td><code>.env</code></td><td>always</td><td>yes — defaults, no secrets</td></tr>
<tr><td><code>.env.[mode]</code></td><td>only in that mode (<code>vite</code> = development, <code>vite build</code> = production, <code>--mode demo</code> = demo)</td><td>yes</td></tr>
<tr><td><code>.env.local</code>, <code>.env.[mode].local</code></td><td>always / that mode, override the others</td><td>no — the Vite template's <code>.gitignore</code> has <code>*.local</code></td></tr>
</tbody></table>
<p>In code they appear on <code>import.meta.env</code>, together with Vite's own <code>MODE</code>, <code>DEV</code>, <code>PROD</code> and <code>BASE_URL</code>:</p>
${pre('ts', SN.apiGoc)}
<p>By default <code>import.meta.env.ANYTHING</code> type-checks as <code>any</code>, so a typo becomes a silent <code>undefined</code> in production. <code>src/env.d.ts</code> declares the variables the app uses and turns on <code>strictImportMetaEnv</code> (Vite 8's <code>ViteTypeOptions</code>):</p>
${pre('ts', SN.envDts)}
<p>Now the experiment that explains the rule. Put two variables in <code>.env.local</code> — one looks like a third-party API key, one like a database password — and print them:</p>
${pre('bash', SN.envThu)}
${out(OUT.envTsc)}
<p>First, the type check catches both, because neither is declared. Declare them anyway and build:</p>
${out(OUT.envGrep)}
<p><code>VITE_KHOA_GIPHY</code> is in the JavaScript file, verbatim — Vite <strong>replaces the text</strong> at build time, and that file is downloaded by every visitor. <code>KHOA_DB</code> became <code>void 0</code>: variables without the <code>VITE_</code> prefix never reach browser code. The prefix is not a security feature, it is a label that says "I agree this is public".</p>
<div class="pitfall co-tieu-de"><strong>Trap — a paid API key in <code>VITE_…</code>.</strong> Map keys, AI keys, email-service keys: anyone can open DevTools → Sources and copy them, then spend your quota. Call those services from your backend and keep the key in the server's environment; the browser calls your backend. (This exact mistake — a GIF API key baked into a frontend bundle — is in the incident log of the site you are learning on.)</div>
<div class="pitfall co-tieu-de"><strong>Trap — changing <code>.env</code> and restarting.</strong> Values are baked in when <code>vite build</code> runs. Editing <code>.env.production</code> on the server and restarting nginx changes nothing; you must rebuild. When one build must run in several environments ("build once, deploy many"), load a small <code>/config.json</code> at startup instead of using build-time variables.</div>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>In FER202 the API URL is a string in each file (<code>axios.get('http://localhost:9999/products')</code>), an error means <code>catch (e) { alert(e.message) }</code> or a console log, nothing retries, and "offline" is never considered because json-server runs on the same laptop. → At work: one HTTP layer with timeouts and typed errors, a retry policy with a cap and jitter, idempotency keys on writes, an offline banner, user-facing messages mapped per error type, error reporting with release versions, and the API address in typed <code>VITE_</code> variables per environment. · <em>Why:</em> the class demo runs on one machine for ten minutes; production runs on thousands of phones for months. The FER202 way is fine for learning React — in a company's older code you will still find hard-coded URLs and <code>alert()</code>, and now you know what to replace them with.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "How do you handle API errors in a React app?"</p>
<p>In layers. The HTTP layer turns failures into typed errors — HTTP error with status, network error, timeout — and leaves caller aborts alone. The data layer (TanStack Query) retries only what can heal — network, 5xx, 429 — with a cap and exponential backoff with jitter, and pauses when offline. Writes are not retried unless they carry an idempotency key. The UI maps each error to a message and an action, keeps empty states separate from errors, and error boundaries catch render crashes. Everything unexpected is reported to a service like Sentry with the release version.</p></div>
<div class="callout"><p><strong>Common interview question.</strong> "Can I put my API key in a Vite environment variable?"</p>
<p>Only if it is meant to be public. Every <code>VITE_</code> variable is replaced as text into the bundle at build time — I measured the key appearing verbatim in <code>dist/assets/index-*.js</code>. Secrets go to the backend; the browser calls the backend. Variables without the prefix are only visible in <code>vite.config</code>. And because values are build-time, changing them needs a rebuild.</p></div>

<h3>🛠 Keep building the project — step 2/4: resilience</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after 14.1.</p><ol>
<li>In <code>http.ts</code>: <code>LoiMang</code>, the <code>thoiGianCho</code> option, <code>AbortSignal.timeout</code> + <code>AbortSignal.any</code>, the three-way <code>catch</code>, <code>API_GOC</code>.</li>
<li>In <code>query-client.ts</code>: the new <code>nenThuLai</code> and <code>treThuLai</code>; update <code>query-client.test.ts</code>.</li>
<li>Idempotency: <code>api.datLich(yc, khoaLap)</code>, the key in <code>useDatLich</code> with a <code>LoiMang</code>-only retry, the <code>daXuLy</code> map in the fake server.</li>
<li><code>useTrucTuyen</code>, <code>BangMatMang</code> (+ dictionary key <code>mang.matKetNoi</code> in both languages), placed under the header.</li>
<li><code>bao-loi.ts</code>, the <code>createRoot</code> callbacks and <code>batLoiToanTrang()</code> in <code>main.tsx</code>; <code>thong-diep-loi.ts</code> used by <code>LoiTaiDuLieu</code>.</li>
<li><code>src/env.d.ts</code>, <code>.env</code>, <code>.env.demo</code>, <code>.env.production</code>. Write <code>src/app/do-ben.test.tsx</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>npx vitest run src/app/do-ben.test.tsx</code> prints the lines shown above (3 requests; <code>lh-1 lh-1</code>; <code>fetchStatus=paused</code> then 1 request), <code>npx tsc -b</code> is clean, and <code>/bac-si?chap-chon=3</code> in the browser shows the list after a few seconds without an error box.</p></div>
<details><summary>Solution</summary>
<p>Every file is printed above as in the reference project. Two places people get stuck: (1) <code>KhuBacSi.test.tsx</code> and <code>src/vi-du/ch09/bai4-vi-mock.test.tsx</code> still expect the server's own 500 message — update them to "Máy chủ đang gặp sự cố" (the behaviour changed on purpose); (2) <code>env.d.ts</code> with <code>strictImportMetaEnv</code> makes every undeclared <code>import.meta.env.X</code> a type error — declare <code>VITE_API_URL</code>, <code>VITE_API_GIA</code>, <code>VITE_BAO_LOI_URL</code>, <code>VITE_PHIEN_BAN</code> before using them.</p>
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> watch each failure mode in the browser.</p><ol>
<li><code>npm run dev</code>, open <code>/bac-si?chap-chon=2</code>, DevTools → Network: count the requests to <code>/api/bac-si</code> and the time between them.</li>
<li>Open <code>/bac-si?tre=vo-han</code> with <code>THOI_GIAN_CHO_MAC_DINH</code> lowered to 3000: after how long, and with which sentence, does the error box appear? (Remember the 3 retries.)</li>
<li>DevTools → Network → "Offline": check the banner, then go back online and watch the paused query resume.</li>
<li>Add <code>VITE_THU=xin-chao</code> to <code>.env.local</code>, declare it in <code>env.d.ts</code>, log it, build, and find it with <code>grep -r xin-chao dist</code>. Then delete it.</li>
</ol><p><strong>Done when:</strong> step 1 shows three requests with growing gaps; step 2 shows "Máy chủ phản hồi quá chậm…" after four timed-out attempts; step 3 behaves as measured above; step 4's grep finds the string in <code>dist/assets/index-*.js</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">timeout</span><span class="v">giving up after a fixed wait; here <code>AbortSignal.timeout(10_000)</code></span></div>
<div class="kv"><span class="k">exponential backoff</span><span class="v">waiting 1 s, 2 s, 4 s… between retries</span></div>
<div class="kv"><span class="k">jitter</span><span class="v">random part of the wait, so clients do not retry in sync</span></div>
<div class="kv"><span class="k">idempotent</span><span class="v">doing it twice has the same effect as once</span></div>
<div class="kv"><span class="k">Idempotency-Key</span><span class="v">header with one id per user intent; the server answers repeats with the first result</span></div>
<div class="kv"><span class="k">error reporting</span><span class="v">sending unexpected errors to a service (Sentry…) with version and context</span></div>
<div class="kv"><span class="k">source map</span><span class="v">file mapping minified code back to your source, used to read production stack traces</span></div>
<div class="kv"><span class="k"><code>import.meta.env</code></span><span class="v">Vite's build-time variables; only <code>VITE_*</code> reach the browser — publicly</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Separate "server answered with an error" (<code>LoiApi</code>), "no answer" (<code>LoiMang mat-mang</code>), "too slow" (<code>LoiMang het-gio</code>) and "caller aborted" (leave it).</li>
<li>Retry only what can heal — network, 5xx, 408, 429 — at most 3 times, 1 s → 2 s → 4 s with jitter; measured: 503, 503, 200 ⇒ the user only saw data.</li>
<li>Writes are retried only with an Idempotency-Key generated once per intent; without it, measured, a lost answer turns a successful booking into a 409 on screen.</li>
<li><code>useSyncExternalStore</code> for the offline banner; TanStack pauses queries while offline instead of burning retries.</li>
<li>React 19 <code>onCaughtError</code>/<code>onUncaughtError</code> + window listeners feed one <code>baoLoi</code> that drops noise, deduplicates, and adds the version.</li>
<li><code>VITE_*</code> variables are replaced as text into public JavaScript — measured verbatim in the bundle. No secrets; typed in <code>env.d.ts</code>; rebuild to change.</li>
</ul>

${LINK('https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static', '⏱', 'MDN — AbortSignal.timeout() and any()', 'Timeouts and combined signals for fetch.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/query-retries', '🔁', 'TanStack Query — Query Retries', 'retry, retryDelay, and network mode.')}
${LINK('https://react.dev/reference/react-dom/client/createRoot#parameters', '⚛', 'react.dev — createRoot options', 'onCaughtError, onUncaughtError, onRecoverableError.')}
${LINK('https://vite.dev/guide/env-and-mode', '⚡', 'Vite — Env Variables and Modes', 'import.meta.env, .env files, VITE_ prefix, typing.')}
${LINK('https://docs.sentry.io/platforms/javascript/guides/react/', '🚨', 'Sentry — React SDK', 'What a hosted error reporter adds.')}
${LINK_TRONG('/courses/nextjs', '▲', 'Learn next — Next.js course', 'Server-side data fetching and secrets that stay on the server.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2</span>
<h2>API thật: chậm, thỉnh thoảng sập, và không bao giờ đúng như bạn tưởng</h2>
<p class="lead">Trên máy của bạn, API giả trả lời trong 5 mili giây và không bao giờ hỏng trừ khi bạn bảo nó hỏng. API thật nằm trên một máy chủ ở thành phố khác, sau một mạng Wi-Fi rớt khi bạn vào thang máy, và bị khởi động lại mỗi lần deploy. Bài này làm cho app phòng khám sống sót trước những thứ đó: phân biệt mất kết nối với máy chủ chậm với lỗi máy chủ, chỉ thử lại cái có thể tự khỏi, không bao giờ đặt một lịch hai lần vì thử lại, báo cho người dùng khi họ mất mạng, và tự gửi lỗi của chính nó về cho đội. Cuối bài: biến môi trường để trỏ bản build vào API thật — và một phép đo cho thấy vì sao chúng không bao giờ được chứa bí mật.</p>
<p>Điểm xuất phát: dự án sau Bài 14.1 (phiên thật, 401 → làm mới). File mới trong bài: <code>src/shared/api/thong-diep-loi.ts</code>, <code>src/shared/hooks/useTrucTuyen.ts</code>, <code>src/shared/ui/BangMatMang.tsx</code>, <code>src/shared/loi/bao-loi.ts</code>, <code>src/env.d.ts</code>, ba file <code>.env</code>, và file test <code>src/app/do-ben.test.tsx</code>.</p>

<h3>Ba kiểu hỏng, ba lỗi khác nhau</h3>
${slide('rx-14', 9, 'Ba kiểu hỏng khác nhau, bắt thành ba lỗi khác nhau')}
<p>Chương 6 đã dạy bất ngờ đầu tiên của <code>fetch</code>: 404 hay 500 <em>không</em> phải lỗi với nó — promise vẫn resolve và bạn phải tự kiểm <code>res.ok</code>. Bất ngờ thứ hai thì ngược lại: khi không có câu trả lời HTTP nào, <code>fetch</code> reject, và nó reject vì những lý do rất khác nhau mà mã cũ gộp chung thành "không phải <code>LoiApi</code> thì chắc là mạng". Người dùng đáng được nghe những câu khác nhau, và thử lại cần luật khác nhau, nên <code>http.ts</code> giờ đặt tên cho chúng:</p>
${pre('ts', SN.loiMang)}
${pre('ts', SN.gui)}
${SD.loiVi}
<ul>
<li><strong><code>AbortSignal.timeout(ms)</code></strong> trả về một tín hiệu tự huỷ sau <code>ms</code> mili giây. Trước khi có nó (2022), người ta tự viết <code>setTimeout</code> + <code>AbortController</code> và hay quên dọn bộ hẹn giờ.</li>
<li><strong><code>AbortSignal.any([a, b])</code></strong> gộp hai lý do để dừng: tín hiệu riêng của TanStack Query (người dùng rời trang — Chương 6) và bộ hẹn giờ của ta. Cái nào đến trước thì huỷ request.</li>
<li><strong>Thứ tự các <code>if</code> quan trọng.</strong> Nếu người gọi tự huỷ, lỗi phải giữ nguyên là <code>AbortError</code>: TanStack Query nhận ra nó và lặng lẽ bỏ kết quả. Đổi nó thành "mất kết nối" là mỗi lần ai đó bấm link nhanh lại loé lên một hộp lỗi.</li>
<li><strong><code>{ cause: loi }</code></strong> giữ <code>TypeError</code> gốc bên trong lỗi mới, để khi báo lỗi không mất stack trace.</li>
</ul>
<p>Đo trong <code>src/shared/api/http.test.ts</code> (cùng file với Bài 14.1): máy chủ im lặng mãi với <code>thoiGianCho: 200</code> hỏng sau 202 ms thành <code>het-gio</code>; <code>HttpResponse.error()</code> (cách MSW nói "mạng hỏng") thành <code>mat-mang</code> với nguyên nhân <code>TypeError: Failed to fetch</code>; còn huỷ từ bên ngoài thì vẫn là <code>AbortError</code>.</p>
<div class="callout"><p><strong>JS nhắc nhanh — <code>class … extends Error</code> và <code>instanceof</code>.</strong> <code>class LoiMang extends Error</code> tạo một loại lỗi mới vẫn cư xử như mọi lỗi khác (message, stack) nhưng mang thêm được trường riêng như <code>loai</code>. <code>loi instanceof LoiMang</code> hỏi "cái này có được tạo bằng <code>new LoiMang</code> không?", và phần còn lại của app dựa vào đó để biết chuyện gì đã xảy ra. Object trơn ném bằng <code>throw { code: 1 }</code> không có stack và trượt mọi phép <code>instanceof</code> — luôn ném <code>Error</code> thật.</p></div>

<h3>Thử lại có trần, và có jitter</h3>
${slide('rx-14', 10, 'Thử lại có trần, có jitter, chỉ lỗi có thể tự khỏi')}
<p>TanStack Query mặc định thử lại query hỏng ba lần. Câu hỏi là thử lại <em>lỗi nào</em>. Thử lại một 404 chỉ bắt người dùng nhìn vòng quay 7 giây trước khi thấy đúng câu "không có". Luật của app, viết lại cho các loại lỗi mới:</p>
${pre('ts', SN.queryClient)}
${SD.thuLaiVi}
<p><strong>Jitter</strong> là phần ngẫu nhiên. Hình dung máy chủ phòng khám sập lúc 08:00 giờ cao điểm và có 10.000 trình duyệt đang mở. Không có jitter, tất cả thử lại sau đúng 1 giây, rồi 2 giây, rồi 4 giây — ba đợt sóng đồng bộ đánh gục máy chủ mỗi lần nó vừa đứng dậy. Có nửa thời gian chờ là ngẫu nhiên, các lần thử lại trải đều ra. Số dưới đây đo qua 1.000 lần gọi mỗi mức:</p>
${out(OUT.treThuLai)}
<p>Và cả vòng lặp, từ đầu tới cuối, với một máy chủ trả 503 hai lần rồi mới ổn:</p>
${pre('tsx', SN.testChapChon)}
<p>Test dùng client <em>thật</em> từ <code>taoQueryClient()</code> (hàm tiện ích <code>taoClientTest</code> tắt retry) và chỉ rút ngắn thời gian chờ. Kết quả: ba request, thành công, sáu bác sĩ — người dùng thấy vòng quay rồi thấy dữ liệu, không bao giờ thấy lỗi. Xem trên trình duyệt cũng được: <code>/bac-si?chap-chon=3</code> làm máy chủ giả hỏng ba request đầu.</p>

<h3>Lệnh ghi: chỉ thử lại khi có Idempotency-Key</h3>
${slide('rx-14', 11, 'Lệnh GHI chỉ được thử lại khi có Idempotency-Key')}
<p>Mutation (Chương 6) mặc định không thử lại, và có lý do chính đáng. Hình dung trường hợp tệ nhất: Ánh bấm "Xác nhận đặt lịch", máy chủ đặt được giờ, và câu trả lời bị mất trên đường về (điện thoại chuyển từ Wi-Fi sang 4G). Trình duyệt thấy hết giờ. Nếu app giờ gửi lại <code>POST</code>, máy chủ nhận yêu cầu đặt lịch thứ hai y hệt. Đây là lịch mới hay cái cũ gửi lại? Không có thêm thông tin thì máy chủ không thể biết.</p>
<p><strong>Idempotent</strong> nghĩa là "làm hai lần cũng như làm một lần". <code>GET</code>, <code>PUT</code> và <code>DELETE</code> được thiết kế idempotent; <code>POST</code> thì không. Cách sửa chuẩn là header <code>Idempotency-Key</code>: một id ngẫu nhiên client sinh MỘT lần cho mỗi ý định của người dùng và gửi kèm mọi lần thử. Máy chủ nhớ những khoá đã xử lý và trả lại kết quả cũ cho lần lặp lại.</p>
${pre('ts', SN.datLichApi)}
${pre('ts', SN.useDatLich)}
${pre('ts', SN.mockIdem)}
${pre('ts', SN.testIdem)}
<p>Kết quả đo chính là toàn bộ lập luận: cùng khoá → máy chủ trả <code>lh-1</code> cả hai lần và CSDL có một lịch hẹn; <strong>không khoá → <code>409 Khung giờ này vừa có người đặt</code></strong>. Nhìn câu cuối từ phía Ánh: lịch của chị <em>đã</em> được tạo, nhưng màn hình báo giờ đã có người đặt. Chị đặt một giờ khác, và phòng khám giờ giữ hai lịch hẹn của chị.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — sinh khoá bên trong <code>mutationFn</code>.</strong> TanStack gọi lại <code>mutationFn</code> cho mỗi lần thử lại. Một <code>crypto.randomUUID()</code> nằm trong đó sinh khoá mới mỗi lần, và máy chủ thấy ba request khác nhau. Sinh khoá một lần cho mỗi ý định — ở đây mỗi lần mở trang đặt lịch bằng <code>useState(() =&gt; crypto.randomUUID())</code> — rồi truyền vào. Một bẫy nữa: <code>crypto.randomUUID</code> chỉ có trong ngữ cảnh an toàn (HTTPS hoặc <code>localhost</code>); trên máy chủ staging chạy HTTP trơn nó là <code>undefined</code> và trang sập.</div>

<h3>Mất mạng: báo cho người, tạm dừng query</h3>
${slide('rx-14', 12, 'Mất mạng: báo cho người, TanStack tạm dừng query')}
<p>Trình duyệt biết khi card mạng mất kết nối và phát sự kiện <code>offline</code> / <code>online</code> trên <code>window</code>; <code>navigator.onLine</code> giữ giá trị hiện tại. Đó là dữ liệu sống ngoài React và đổi theo thời gian — đúng việc của <code>useSyncExternalStore</code> (Chương 12):</p>
${pre('ts', SN.useTrucTuyen)}
${pre('tsx', SN.bangMatMang)}
<p>Dải báo nằm trong <code>KhungTrang</code> ngay dưới header, chữ lấy từ từ điển (Chương 13 — phép kiểm <code>satisfies</code> buộc cả <code>vi</code> lẫn <code>en</code> phải có khoá), và <code>role="status"</code> để trình đọc màn hình đọc lên. Đo trên Chromium với <code>context.setOffline(true)</code>: <code>navigator.onLine</code> thành <code>false</code> và dải báo hiện; có mạng lại, nó biến mất.</p>
<p>TanStack Query có <code>onlineManager</code> riêng. Khi nó tin trình duyệt đang mất mạng, query không hỏng — chúng <strong>tạm dừng</strong>:</p>
${pre('tsx', SN.testOffline)}
<p>Đo được: sau 300 ms mất mạng, <code>status=pending · fetchStatus=paused · request đã gửi: 0</code>; có mạng lại, một request và thành công. Không có tạm dừng, ba lần thử lại cháy sạch trong vài giây lúc đi qua hầm và người dùng ra khỏi hầm gặp màn hình lỗi. Hai điều nên nhớ: <code>navigator.onLine === true</code> chỉ có nghĩa "đang nối một mạng nào đó", không phải "tới được máy chủ" (Wi-Fi quán cà phê bắt đăng nhập vẫn trả <code>true</code>); và TanStack Query v5 khởi đầu bằng giả định đang có mạng và chỉ đổi khi có sự kiện (đọc trong <code>onlineManager.js</code>, bản 5.103).</p>

<h3>Báo lỗi: lỗi phải tự về tới đội</h3>
${slide('rx-14', 13, 'Báo lỗi: lỗi phải tự về tới đội, không nằm ở console')}
<p>Chương 11 dựng <code>RanhGioiLoi</code>, error boundary giữ cho một phần hỏng không làm trắng cả trang. Nhưng boundary chỉ bảo vệ người dùng. Đội phát triển vẫn không biết: thông báo lỗi nằm trong console trên điện thoại của ai đó. App production gửi mọi lỗi bất ngờ tới một dịch vụ — Sentry, GlitchTip, Datadog, hoặc một endpoint của chính backend — kèm đủ ngữ cảnh để sửa. Đây là phiên bản nhỏ, trung thực của thứ các công cụ đó làm:</p>
${pre('ts', SN.baoLoi)}
${SD.baoLoiVi}
<p>React 19 thêm mảnh còn thiếu: <code>createRoot</code> nhận callback cho mọi lỗi render. "Caught" nghĩa là một boundary đã bắt (người dùng thấy màn dự phòng của bạn); "uncaught" nghĩa là không ai bắt (React gỡ cả cây):</p>
${pre('tsx', SN.mainRoot)}
${pre('tsx', SN.testBaoLoi)}
${out(OUT.doBen)}
<p>Thứ làm một báo cáo có ích, và mã ở trên xử lý nó thế nào:</p>
<ul>
<li><strong>Bỏ nhiễu.</strong> Mất kết nối hay 409 không phải bug; giao diện đã xử lý chúng. Một bảng điều khiển đầy "Failed to fetch" che mất con crash thật duy nhất.</li>
<li><strong>Bỏ trùng và có trần.</strong> Một lỗi trong vòng lặp render có thể bắn nghìn lần mỗi giây. 50 lỗi giống nhau cho ra đúng một báo cáo trong test.</li>
<li><strong>Phiên bản.</strong> "TypeError trong <code>Xc</code>" vô dụng nếu không biết bản build nào sinh ra <code>Xc</code>. CI đặt <code>VITE_PHIEN_BAN</code> bằng mã commit (Bài 14.3), và source map ẩn dịch <code>Xc</code> về lại <code>baoLoi</code>.</li>
<li><strong>Riêng tư.</strong> Chỉ gửi <code>location.pathname</code> — không bao giờ gửi query string hay hash, vì chúng có thể chứa token hay số điện thoại.</li>
<li><strong><code>sendBeacon</code></strong> xếp request vào hàng để nó vẫn được gửi kể cả khi người dùng đang đóng tab.</li>
</ul>
<p>Với Sentry, cài đặt chỉ vài dòng — <code>Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN, release: import.meta.env.VITE_PHIEN_BAN })</code> — và các callback của root gọi <code>Sentry.captureException</code>; Sentry thêm gom nhóm, breadcrumb (người dùng đã bấm gì trước đó), cảnh báo và tải source map. DSN không phải bí mật: nó chỉ cho phép <em>gửi</em> sự kiện.</p>
<p>⏳ Chưa chạy thật: gửi báo cáo tới một project Sentry/GlitchTip cần tài khoản và DSN mà máy này không có. Logic báo lỗi ở trên được test bằng một người nhận cắm vào thay thế.</p>
<!-- CHAY-O-MAY: tạo project Sentry (hoặc GlitchTip tự host), đặt VITE_BAO_LOI_URL/DSN, build, gây một lỗi render và xem báo cáo về tới dashboard kèm phiên bản -->

<h3>Trạng thái rỗng và lỗi nói tiếng người</h3>
<p>Mảnh cuối của độ bền là câu người dùng đọc. <code>LoiTaiDuLieu</code> (Chương 6) từng in <code>loi.message</code> — với một 500 thì có thể là <code>relation "lich_hen" does not exist</code>. Giờ một hàm biến mỗi lỗi thành một câu kèm việc cần làm:</p>
${pre('ts', SN.thongDiep)}
<p>Hai test cũ phải đổi câu mong đợi, có chủ đích: 500 giờ hiện "Máy chủ đang gặp sự cố…" thay cho câu riêng của máy chủ. Trạng thái rỗng thì không đổi: "Chưa có lịch hẹn nào" kèm link đặt lịch, từ Chương 6, vẫn là câu trả lời đúng khi danh sách thật sự rỗng — danh sách rỗng không phải lỗi.</p>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Ánh mở <code>/bac-si</code> trong hầm. Trình duyệt phát <code>offline</code>; <code>useTrucTuyen</code> vẽ lại <code>BangMatMang</code>: dải báo hiện. <code>onlineManager</code> tạm dừng query bác sĩ: không request, không lỗi.</li>
<li>Ra khỏi hầm: <code>online</code> phát, dải báo biến mất, TanStack chạy tiếp query: một <code>GET /api/bac-si</code>.</li>
<li>Máy chủ quá tải: 503. <code>nenThuLai(0, LoiApi 503)</code> → true; <code>treThuLai(0)</code> → khoảng 700 ms. Lại 503; chờ 1–2 giây. Rồi 200: danh sách hiện.</li>
<li>Chị đặt lịch. <code>POST /api/lich-hen</code> kèm <code>Idempotency-Key: K</code>. Máy chủ tạo <code>lh-1</code>, nhưng câu trả lời lâu hơn 10 giây: <code>AbortSignal.timeout</code> kích hoạt, <code>gui</code> ném <code>LoiMang('het-gio')</code>.</li>
<li><code>retry</code> của mutation thấy <code>LoiMang</code> và 0 lần hỏng → thử lại với cùng K. Máy chủ tìm thấy K, trả <code>lh-1</code>. Chị thấy xác nhận; CSDL giữ một lịch hẹn.</li>
<li>Ở đâu đó một component đọc <code>bacSi.ten</code> của <code>undefined</code>. <code>RanhGioiLoi</code> hiện màn dự phòng; React gọi <code>onCaughtError</code>; <code>baoLoi</code> gửi một báo cáo kèm component stack và mã commit.</li>
</ol>

<h3>Biến môi trường: trỏ bản build vào API thật</h3>
${slide('rx-14', 14, 'Biến VITE_ nằm nguyên văn trong bundle: không bí mật')}
<p>API giả trả lời trên cùng nguồn (<code>/api/…</code>). API thật có thể nằm ở <code>https://api.phong-kham.example</code>. Địa chỉ phải khác nhau giữa laptop của bạn, máy chủ staging và production mà không phải sửa mã — đó là việc của biến môi trường. Vite đọc chúng từ các file <code>.env</code>:</p>
${pre('bash', SN.envFiles)}
<table>
<thead><tr><th>File</th><th>Được đọc khi</th><th>Commit?</th></tr></thead>
<tbody>
<tr><td><code>.env</code></td><td>luôn luôn</td><td>có — giá trị mặc định, không bí mật</td></tr>
<tr><td><code>.env.[mode]</code></td><td>chỉ ở chế độ đó (<code>vite</code> = development, <code>vite build</code> = production, <code>--mode demo</code> = demo)</td><td>có</td></tr>
<tr><td><code>.env.local</code>, <code>.env.[mode].local</code></td><td>luôn luôn / chế độ đó, ghi đè các file kia</td><td>không — <code>.gitignore</code> của template Vite có <code>*.local</code></td></tr>
</tbody></table>
<p>Trong mã chúng nằm trên <code>import.meta.env</code>, cùng với <code>MODE</code>, <code>DEV</code>, <code>PROD</code> và <code>BASE_URL</code> của chính Vite:</p>
${pre('ts', SN.apiGoc)}
<p>Mặc định <code>import.meta.env.BẤT_KỲ</code> có kiểu <code>any</code>, nên gõ sai tên thành một <code>undefined</code> lặng lẽ trên production. <code>src/env.d.ts</code> khai báo các biến app dùng và bật <code>strictImportMetaEnv</code> (<code>ViteTypeOptions</code> của Vite 8):</p>
${pre('ts', SN.envDts)}
<p>Giờ tới thí nghiệm giải thích luật. Đặt hai biến vào <code>.env.local</code> — một cái trông như khoá API của bên thứ ba, một cái như mật khẩu cơ sở dữ liệu — rồi in chúng ra:</p>
${pre('bash', SN.envThu)}
${out(OUT.envTsc)}
<p>Trước tiên, phép kiểm kiểu bắt cả hai, vì chưa cái nào được khai báo. Cứ khai báo rồi build:</p>
${out(OUT.envGrep)}
<p><code>VITE_KHOA_GIPHY</code> nằm trong file JavaScript, nguyên văn — Vite <strong>thay chữ</strong> lúc build, và file đó được tải về bởi mọi người ghé trang. <code>KHOA_DB</code> thành <code>void 0</code>: biến không có tiền tố <code>VITE_</code> không bao giờ tới được mã trình duyệt. Tiền tố không phải tính năng bảo mật, nó là cái nhãn nói "tôi đồng ý cái này công khai".</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — khoá API trả tiền trong <code>VITE_…</code>.</strong> Khoá bản đồ, khoá AI, khoá dịch vụ gửi mail: ai cũng mở được DevTools → Sources và chép đi, rồi tiêu hết hạn mức của bạn. Gọi các dịch vụ đó từ backend của bạn và giữ khoá trong môi trường của máy chủ; trình duyệt gọi backend. (Đúng lỗi này — một khoá API ảnh GIF bị nướng vào bundle frontend — nằm trong nhật ký sự cố của chính trang bạn đang học.)</div>
<div class="pitfall co-tieu-de"><strong>Bẫy — sửa <code>.env</code> rồi khởi động lại.</strong> Giá trị được nướng vào lúc <code>vite build</code> chạy. Sửa <code>.env.production</code> trên máy chủ rồi restart nginx không đổi gì; phải build lại. Khi một bản build phải chạy ở nhiều môi trường ("build một lần, deploy nhiều nơi"), hãy tải một file <code>/config.json</code> nhỏ lúc khởi động thay vì dùng biến lúc build.</div>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202 địa chỉ API là một chuỗi trong từng file (<code>axios.get('http://localhost:9999/products')</code>), lỗi thì <code>catch (e) { alert(e.message) }</code> hay một dòng console, không có gì thử lại, và "mất mạng" chưa bao giờ được nghĩ tới vì json-server chạy ngay trên laptop. → Đi làm: một tầng HTTP có hết giờ và lỗi có kiểu, chính sách thử lại có trần và jitter, idempotency key cho lệnh ghi, dải báo mất mạng, câu báo lỗi cho người dùng theo từng loại lỗi, báo lỗi về dịch vụ kèm phiên bản, và địa chỉ API trong biến <code>VITE_</code> có kiểu cho từng môi trường. · <em>Vì sao:</em> bản demo trên lớp chạy trên một máy trong mười phút; production chạy trên hàng nghìn điện thoại trong nhiều tháng. Cách FER202 ổn để học React — trong mã cũ của công ty bạn vẫn sẽ gặp URL viết cứng và <code>alert()</code>, và giờ bạn biết thay chúng bằng gì.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Bạn xử lý lỗi API trong app React thế nào?"</p>
<p>Theo lớp. Tầng HTTP biến thất bại thành lỗi có kiểu — lỗi HTTP có status, lỗi mạng, hết giờ — và để nguyên các lần người gọi tự huỷ. Tầng dữ liệu (TanStack Query) chỉ thử lại cái có thể tự khỏi — mạng, 5xx, 429 — có trần và backoff luỹ thừa kèm jitter, và tạm dừng khi mất mạng. Lệnh ghi không thử lại trừ khi có idempotency key. Giao diện đổi mỗi lỗi thành một câu và một hành động, tách trạng thái rỗng khỏi lỗi, và error boundary bắt crash lúc render. Mọi thứ bất ngờ được báo về một dịch vụ như Sentry kèm phiên bản.</p></div>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Để khoá API trong biến môi trường của Vite được không?"</p>
<p>Chỉ khi nó vốn công khai. Mọi biến <code>VITE_</code> được thay chữ vào bundle lúc build — tôi đã đo, khoá hiện nguyên văn trong <code>dist/assets/index-*.js</code>. Bí mật để ở backend; trình duyệt gọi backend. Biến không có tiền tố chỉ thấy được trong <code>vite.config</code>. Và vì giá trị có từ lúc build, đổi chúng thì phải build lại.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 2/4: độ bền</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau 14.1.</p><ol>
<li>Trong <code>http.ts</code>: <code>LoiMang</code>, tuỳ chọn <code>thoiGianCho</code>, <code>AbortSignal.timeout</code> + <code>AbortSignal.any</code>, khối <code>catch</code> ba nhánh, <code>API_GOC</code>.</li>
<li>Trong <code>query-client.ts</code>: <code>nenThuLai</code> mới và <code>treThuLai</code>; cập nhật <code>query-client.test.ts</code>.</li>
<li>Idempotency: <code>api.datLich(yc, khoaLap)</code>, khoá trong <code>useDatLich</code> với retry chỉ cho <code>LoiMang</code>, bảng <code>daXuLy</code> trong máy chủ giả.</li>
<li><code>useTrucTuyen</code>, <code>BangMatMang</code> (+ khoá từ điển <code>mang.matKetNoi</code> ở cả hai ngôn ngữ), đặt dưới header.</li>
<li><code>bao-loi.ts</code>, callback của <code>createRoot</code> và <code>batLoiToanTrang()</code> trong <code>main.tsx</code>; <code>thong-diep-loi.ts</code> dùng trong <code>LoiTaiDuLieu</code>.</li>
<li><code>src/env.d.ts</code>, <code>.env</code>, <code>.env.demo</code>, <code>.env.production</code>. Viết <code>src/app/do-ben.test.tsx</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>npx vitest run src/app/do-ben.test.tsx</code> in đúng các dòng ở trên (3 request; <code>lh-1 lh-1</code>; <code>fetchStatus=paused</code> rồi 1 request), <code>npx tsc -b</code> sạch, và <code>/bac-si?chap-chon=3</code> trên trình duyệt hiện danh sách sau vài giây mà không có hộp lỗi.</p></div>
<details><summary>Lời giải</summary>
<p>Mọi file đã in ở trên đúng như dự án mẫu. Hai chỗ hay kẹt: (1) <code>KhuBacSi.test.tsx</code> và <code>src/vi-du/ch09/bai4-vi-mock.test.tsx</code> vẫn chờ câu 500 riêng của máy chủ — sửa thành "Máy chủ đang gặp sự cố" (hành vi đổi có chủ đích); (2) <code>env.d.ts</code> với <code>strictImportMetaEnv</code> làm mọi <code>import.meta.env.X</code> chưa khai báo thành lỗi kiểu — khai <code>VITE_API_URL</code>, <code>VITE_API_GIA</code>, <code>VITE_BAO_LOI_URL</code>, <code>VITE_PHIEN_BAN</code> trước khi dùng.</p>
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề:</strong> xem tận mắt từng kiểu hỏng trên trình duyệt.</p><ol>
<li><code>npm run dev</code>, mở <code>/bac-si?chap-chon=2</code>, DevTools → Network: đếm request tới <code>/api/bac-si</code> và khoảng cách giữa chúng.</li>
<li>Mở <code>/bac-si?tre=vo-han</code> với <code>THOI_GIAN_CHO_MAC_DINH</code> hạ xuống 3000: sau bao lâu, và bằng câu nào, hộp lỗi hiện ra? (Nhớ 3 lần thử lại.)</li>
<li>DevTools → Network → "Offline": xem dải báo, rồi bật mạng lại và xem query đang tạm dừng chạy tiếp.</li>
<li>Thêm <code>VITE_THU=xin-chao</code> vào <code>.env.local</code>, khai báo trong <code>env.d.ts</code>, in ra, build, rồi tìm nó bằng <code>grep -r xin-chao dist</code>. Xong thì xoá.</li>
</ol><p><strong>Đạt khi:</strong> bước 1 thấy ba request với khoảng cách tăng dần; bước 2 hiện "Máy chủ phản hồi quá chậm…" sau bốn lần hết giờ; bước 3 cư xử như số đo ở trên; lệnh grep ở bước 4 tìm thấy chuỗi trong <code>dist/assets/index-*.js</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">timeout (hết giờ)</span><span class="v">bỏ cuộc sau một khoảng chờ cố định; ở đây <code>AbortSignal.timeout(10_000)</code></span></div>
<div class="kv"><span class="k">exponential backoff</span><span class="v">chờ 1 s, 2 s, 4 s… giữa các lần thử lại</span></div>
<div class="kv"><span class="k">jitter</span><span class="v">phần ngẫu nhiên của thời gian chờ, để các client không thử lại cùng lúc</span></div>
<div class="kv"><span class="k">idempotent</span><span class="v">làm hai lần cũng như làm một lần</span></div>
<div class="kv"><span class="k">Idempotency-Key</span><span class="v">header mang một id cho mỗi ý định; máy chủ trả kết quả đầu cho các lần lặp</span></div>
<div class="kv"><span class="k">error reporting (báo lỗi)</span><span class="v">gửi lỗi bất ngờ về một dịch vụ (Sentry…) kèm phiên bản và ngữ cảnh</span></div>
<div class="kv"><span class="k">source map</span><span class="v">file ánh xạ mã đã nén về mã nguồn, dùng để đọc stack trace production</span></div>
<div class="kv"><span class="k"><code>import.meta.env</code></span><span class="v">biến lúc build của Vite; chỉ <code>VITE_*</code> tới được trình duyệt — và công khai</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tách "máy chủ trả lỗi" (<code>LoiApi</code>), "không có câu trả lời" (<code>LoiMang mat-mang</code>), "quá chậm" (<code>LoiMang het-gio</code>) và "người gọi tự huỷ" (để nguyên).</li>
<li>Chỉ thử lại cái có thể tự khỏi — mạng, 5xx, 408, 429 — tối đa 3 lần, 1 s → 2 s → 4 s kèm jitter; đo được: 503, 503, 200 ⇒ người dùng chỉ thấy dữ liệu.</li>
<li>Lệnh ghi chỉ thử lại khi có Idempotency-Key sinh một lần cho mỗi ý định; không có nó, đo được, một câu trả lời bị mất biến lần đặt thành công thành 409 trên màn hình.</li>
<li><code>useSyncExternalStore</code> cho dải mất mạng; TanStack tạm dừng query khi mất mạng thay vì đốt lần thử lại.</li>
<li><code>onCaughtError</code>/<code>onUncaughtError</code> của React 19 + bộ nghe trên window đổ về một <code>baoLoi</code> biết bỏ nhiễu, bỏ trùng và gắn phiên bản.</li>
<li>Biến <code>VITE_*</code> được thay chữ vào JavaScript công khai — đo được nguyên văn trong bundle. Không bí mật; có kiểu trong <code>env.d.ts</code>; đổi là build lại.</li>
</ul>

${LINK('https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static', '⏱', 'MDN — AbortSignal.timeout() và any()', 'Hết giờ và gộp tín hiệu cho fetch.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/query-retries', '🔁', 'TanStack Query — Query Retries', 'retry, retryDelay và network mode.')}
${LINK('https://react.dev/reference/react-dom/client/createRoot#parameters', '⚛', 'react.dev — tuỳ chọn của createRoot', 'onCaughtError, onUncaughtError, onRecoverableError.')}
${LINK('https://vite.dev/guide/env-and-mode', '⚡', 'Vite — Env Variables and Modes', 'import.meta.env, file .env, tiền tố VITE_, kiểu.')}
${LINK('https://docs.sentry.io/platforms/javascript/guides/react/', '🚨', 'Sentry — React SDK', 'Một dịch vụ báo lỗi thêm được những gì.')}
${LINK_TRONG('/courses/nextjs', '▲', 'Học tiếp — Khoá Next.js', 'Lấy dữ liệu phía máy chủ và bí mật nằm yên ở máy chủ.')}
</div>
`,
};

const L3 = {
    title: '14.3 — Build and deploy: no MSW, bundle budget, security headers, CSP, CI/CD|||14.3 — Build và deploy: bỏ MSW, ngân sách bundle, header bảo mật, CSP, CI/CD',
    slug: 'rx-14-3-build-deploy',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Đưa app đặt lịch lên host tĩnh cho đúng: bản production không còn MSW (đo 600,9 so với 1.031,3 kB), đọc bundle bằng visualizer và source map, ngân sách kích thước làm CI đỏ, source map ẩn, header bảo mật và CSP đo trên nginx + Chromium, workflow GitHub Actions kiểm tra rồi deploy GitHub Pages dưới thư mục con.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3</span>
<h2>Build and deploy: a production bundle you can defend, and a pipeline that refuses bad ones</h2>
<p class="lead">Chapter 10 already built the app and served it correctly: <code>dist/</code> explained file by file, SPA fallback measured on four servers, a year of cache for hashed files, <code>no-cache</code> for <code>index.html</code>, and the old-tab problem after a deploy (<code>vite:preloadError</code>). This lesson does not repeat that — it finishes the job. The production build must stop shipping the fake API, someone must be able to see what is in the bundle and be stopped when it grows, the server must send security headers, and a machine — not your memory — must run every check before anything is deployed.</p>
<p>Starting point: the project after Lesson 14.2. New in this lesson: the MSW condition in <code>main.tsx</code>, a small Vite plugin, <code>rollup-plugin-visualizer</code> 7.1.1, <code>scripts/kiem-kich-thuoc.mjs</code>, <code>deploy/bao-mat.conf</code> and <code>deploy/nginx-bao-mat.conf</code>, <code>.github/workflows/ci.yml</code>, and the router's <code>basename</code>.</p>

<h3>Two builds: production without MSW, a demo with it</h3>
${slide('rx-14', 15, 'Two builds: production drops MSW, the demo keeps it')}
<p>Until now <code>main.tsx</code> always started MSW, because the app had no real backend (Chapter 10 noted it: <code>browser-*.js</code> at 427 kB was the biggest file in <code>dist/</code>). A real product needs two different builds: <strong>production</strong>, which talks to the real API and contains no fake server, and a <strong>demo</strong> for a static host with no backend (your portfolio link), which keeps MSW on purpose. The condition:</p>
${pre('tsx', SN.batApiGia)}
<p>How can one <code>if</code> remove 430 kB? Because <code>import.meta.env.DEV</code> and <code>import.meta.env.VITE_API_GIA</code> are replaced by <em>constants</em> at build time (Lesson 14.2). In a production build the condition becomes <code>!false &amp;&amp; undefined !== "1"</code>, which is always <code>true</code>, so the function always returns before the <code>import()</code>. The bundler (Rolldown) sees code that can never run and deletes it — <strong>dead-code elimination</strong> — and with it the dynamic import, so the MSW chunk is never created. Measured:</p>
${out(OUT.buildTruocSau)}
<p>In the minified production file the whole function is literally <code>async function el(){}</code>. The demo build (<code>vite build --mode demo</code>, which loads <code>.env.demo</code> with <code>VITE_API_GIA=1</code>) is 72% heavier in JavaScript — that is the price of a backend-less demo, paid only by the demo.</p>
<p>One thing the <code>if</code> cannot remove: Vite copies the whole <code>public/</code> folder into <code>dist/</code>, including <code>public/mockServiceWorker.js</code>. Harmless, but a production site should not serve a service worker it never uses. A plugin of a dozen lines deletes it after the build, except for the demo:</p>
${pre('ts', SN.viteConfig)}
<p>Read the config from the top: <code>loadEnv(mode, cwd, '')</code> reads the <code>.env</code> files <em>inside the config</em> (which runs in Node, where <code>import.meta.env</code> does not exist yet); the empty prefix means "all variables", which is safe here because the config is never shipped to the browser. <code>boWorkerMsw</code> uses two build hooks: <code>configResolved</code> to learn the output folder, <code>closeBundle</code> to delete the file when everything is written. The visualizer is opt-in with <code>PHAN_TICH=1</code>. And <code>sourcemap: 'hidden'</code> is explained below.</p>
${SD.envEn}

<h3>Read the bundle before you optimise it</h3>
${slide('rx-14', 16, 'Inside the bundle: react-dom and the router are most of it')}
<p>"The bundle is big" is not a finding. <em>What</em> is big is. <code>PHAN_TICH=1 npx vite build</code> writes <code>bao-cao/phan-tich.html</code> — outside <code>dist/</code>, so it can never be deployed by mistake — a treemap in which every rectangle is a module and its area is its size. The same answer as numbers, read straight from the source map:</p>
${out(OUT.phanTich)}
<p>What this tells you on this app:</p>
<ul>
<li><strong>The first-load chunk is mostly the framework.</strong> <code>react-dom</code> (207 kB) and <code>react-router</code> (95 kB) are 80% of <code>index-*.js</code>. The app's own code is 48 kB. There is little to gain inside <code>src/</code>; a smaller router or server rendering are architecture decisions, not quick fixes.</li>
<li><strong>The Devtools cost 0.0 kB.</strong> <code>ReactQueryDevtools</code> is rendered in <code>main.tsx</code>, yet in production the package exports an empty component — confirmed by measurement, not by trusting the README.</li>
<li><strong>Zod is 77 kB of the booking page.</strong> It is already lazy (Chapter 8), so users who never book never download it. If it had been in the first chunk, this is where you would look first.</li>
</ul>

<h3>A size budget that turns CI red</h3>
${slide('rx-14', 17, 'Size budget: CI goes red when someone drops a lazy import')}
<p>Measuring once is not enough; bundles grow one innocent import at a time. A <strong>size budget</strong> is a number in the repository and a script that fails when it is exceeded:</p>
${pre('js', SN.kiemKichThuoc)}
${out(OUT.nganSachOk)}
<p>To see it bite, the booking page was imported directly in the router instead of lazily — one line, the kind of change that passes review because it "just fixes an import":</p>
${out(OUT.nganSachVuot)}
<p>Exit code 1: in CI the pull request is red, with a message saying exactly what grew. The budget is set a little above today's number (129.6 of 140 kB gzip): its job is to catch jumps, not to make every commit fight for bytes. Measure gzip, because that is what travels over the network; and measure what <code>index.html</code> loads, because that is what blocks the first screen.</p>

<h3>Source maps: for your error reporter, not for the public</h3>
<p>A production stack trace says <code>at Xc (index-B-6GtYu3.js:1:48213)</code>. A source map translates that back to <code>baoLoi (src/shared/loi/bao-loi.ts:41)</code>. <code>sourcemap: 'hidden'</code> generates the <code>.map</code> files but does <em>not</em> add the <code>//# sourceMappingURL=</code> comment to the JavaScript, so browsers never ask for them (checked: 0 occurrences in <code>dist/assets/*.js</code>). CI uploads them to the error-reporting service and then deletes them before deploying — a map contains your complete source code. The nginx config below also answers 404 for <code>*.map</code>, as a second lock.</p>

<h3>Security headers, and an nginx rule that silently drops them</h3>
${slide('rx-14', 18, 'nginx: add_header inside a location drops the server-level headers')}
<p>Some protections can only come from the server, as HTTP headers on every response:</p>
${pre('nginx', SN.baoMatConf)}
<ul>
<li><strong>Content-Security-Policy</strong> — a list of where scripts, styles, images and connections may come from. <code>script-src 'self'</code> means only JavaScript files from this site run: an injected <code>&lt;script&gt;</code> or <code>onerror="…"</code> does not.</li>
<li><strong>X-Content-Type-Options: nosniff</strong> — the browser trusts the declared content type instead of guessing, so an uploaded "image" cannot be run as a script.</li>
<li><strong>Referrer-Policy</strong> — links to other sites send only the origin, not the full path (which could contain an id).</li>
<li><strong>frame-ancestors 'none'</strong> — nobody can load your page inside an <code>&lt;iframe&gt;</code> and trick users into clicking (clickjacking).</li>
</ul>
<p>The obvious place to put them is once, in <code>server { }</code>. That is wrong, and the reason is a rule of nginx that surprises almost everyone: <strong>a <code>location</code> that has any <code>add_header</code> of its own inherits none from the level above</strong>. Chapter 10's config adds <code>Cache-Control</code> in both locations, so:</p>
${pre('nginx', SN.nginxSai)}
${pre('nginx', SN.nginxBaoMat)}
${out(OUT.header)}
<p>0 security headers with the "obvious" config, on HTML and JavaScript alike, and <code>nginx -t</code> reports nothing wrong. With the snippet included in each location: 4/4, and source maps answer 404 while the wrong config serves them with 200. Always check headers with <code>curl -sI</code> against the real server, never by reading the config.</p>

<h3>CSP measured in a real browser</h3>
${slide('rx-14', 19, 'CSP measured: Zod 4 reports violations until JIT is off')}
<p>A CSP that blocks your own app is worse than none, so it must be tested with the app, in a browser. <code>do/ch14-csp.mjs</code> serves the demo build through nginx with the headers above, walks through four pages and a sign-in in Chromium, and records every <code>securitypolicyviolation</code> event:</p>
${out(OUT.cspTruoc)}
<p>No page errors — but three violations of <code>script-src</code> for <code>eval</code> during normal use. The culprit was found in <code>node_modules/zod/v4/core/util.js</code>: Zod 4 probes once whether it may generate fast validation code with <code>new Function("")</code>. Under a strict CSP the probe is blocked, Zod catches the error and falls back — everything works — but the browser still reports a violation, and a report-only CSP in production would fill with noise that hides real attacks. Zod has a switch for exactly this:</p>
${pre('ts', SN.zodJitless)}
${out(OUT.cspSau)}
<p>Zero violations while using the app. The last two lines are the point of CSP: an <code>&lt;img onerror&gt;</code> inserted straight into the DOM did not run (<code>window.__xss</code> stayed <code>undefined</code>, blocked by <code>script-src-attr</code>), and a <code>fetch</code> to a foreign site was blocked by <code>connect-src</code> — so even injected code could not send data out. That is the defence in depth of the whole course:</p>
${SD.lopEn}
<div class="pitfall co-tieu-de"><strong>Trap — adding <code>'unsafe-inline'</code> / <code>'unsafe-eval'</code> to "make it work".</strong> The first CSP you write will break something (an inline script from an analytics snippet, a library that uses <code>eval</code>). Adding the unsafe keywords makes the error go away and turns the policy into decoration. Find the source, as with Zod here; move inline scripts into files; roll out with <code>Content-Security-Policy-Report-Only</code> first to collect violations without blocking.</div>

<h3>CI/CD: a machine runs every check, on every change</h3>
${slide('rx-14', 20, 'CI/CD: check on every PR, deploy when main is green')}
<p>Every check so far — types, 208 tests, build, budget — is only worth something if it runs every time, including the Friday evening when you are sure your change is tiny. <strong>CI</strong> (continuous integration) runs them on every push and pull request; <strong>CD</strong> (continuous deployment) ships the result when the main branch is green. The course <a href="/courses/github-actions">GitHub Actions</a> teaches the tool in depth; here is the workflow for this app:</p>
${pre('yaml', SN.ci)}
${SD.ciEn}
<p>Why each line is there:</p>
<ul>
<li><strong><code>npm ci</code>, not <code>npm install</code></strong> — installs exactly what <code>package-lock.json</code> says and fails if it does not match <code>package.json</code>. The CI must test the same dependencies you tested.</li>
<li><strong><code>cache: npm</code></strong> — reuses the download cache between runs, keyed on the lockfile.</li>
<li><strong><code>concurrency</code> with <code>cancel-in-progress</code></strong> — two quick pushes: the first run is cancelled, only the latest matters.</li>
<li><strong><code>permissions: contents: read</code></strong> at the top, and the deploy job asks for <code>pages: write</code> and <code>id-token: write</code> only for itself. <code>deploy-pages</code> authenticates with OIDC, so no token is stored in secrets.</li>
<li><strong><code>needs: kiem-tra</code> and the <code>if</code></strong> — deploy runs only after the checks pass, and only for pushes to <code>main</code>, never for pull requests from forks.</li>
<li><strong><code>VITE_PHIEN_BAN: github.sha</code></strong> — the commit id goes into the build, so error reports name the exact version (Lesson 14.2).</li>
<li>Action versions were checked on 26 September 2026 with <code>gh api repos/actions/&lt;name&gt;/releases/latest</code>: <code>checkout</code> v7.0.1, <code>setup-node</code> v7.0.0, <code>upload-pages-artifact</code> v5.0.0, <code>deploy-pages</code> v5.0.1.</li>
</ul>
<p>Two things can be verified without GitHub. The file's structure, with a schema validator:</p>
${out(OUT.actionValidator)}
<p>And the steps themselves, on a <strong>clean clone</strong> — no <code>node_modules</code>, no <code>dist</code>, only what is committed — which is exactly the situation of a CI runner:</p>
${pre('bash', SN.chayCi)}
${out(OUT.ciSach)}
<p>Everything a runner would do, in about 23 seconds on this machine. A clean clone catches the classic "works on my machine" bugs: a file you forgot to commit, a dependency installed globally, an <code>.env.local</code> the build silently relied on.</p>
<p>⏳ Not run for real: pushing to a GitHub repository and watching the workflow run and deploy to Pages needs a GitHub account and repository settings (Settings → Pages → Source: GitHub Actions) that this machine does not use. The workflow was validated by schema and its steps executed on a clean clone instead.</p>
<!-- CHAY-O-MAY: tạo repo GitHub cho phong-kham, bật Pages (Source: GitHub Actions), push main, xem run xanh + mở https://<user>.github.io/<repo>/bac-si/bs-2 (deep link qua 404.html) -->

<h3>Deploying under a sub-path: base and basename</h3>
${slide('rx-14', 21, 'Sub-path: Vite base + React Router basename')}
<p>GitHub Pages serves a project at <code>https://&lt;user&gt;.github.io/&lt;repo&gt;/</code> — not at the root. Two different things need to know that:</p>
<ul>
<li><strong>Vite's <code>base</code></strong> (<code>--base=/phong-kham/</code>) rewrites the paths of <em>files</em>: <code>index.html</code> now loads <code>/phong-kham/assets/index-….js</code>.</li>
<li><strong>React Router's <code>basename</code></strong> rewrites the paths of <em>pages</em>: <code>&lt;Link to="/bac-si"&gt;</code> must produce <code>/phong-kham/bac-si</code>, and the URL <code>/phong-kham/bac-si</code> must match the route <code>bac-si</code>.</li>
</ul>
${pre('tsx', SN.routerBase)}
<p><code>import.meta.env.BASE_URL</code> is whatever <code>base</code> the build used, so the two can never disagree. The MSW worker URL uses it too (see <code>batApiGia</code> above). Measured with <code>vite preview --base /phong-kham/</code> in Chromium, the same build with and without <code>basename</code>:</p>
${out(OUT.base)}
<p>Without <code>basename</code> the files load fine (thanks to <code>base</code>), the app starts, and then shows its own 404 page, because the router sees <code>/phong-kham/bac-si</code> and has no such route; the menu links point to <code>/bac-si</code>, outside the site. No error anywhere — only a wrong page.</p>
<p>GitHub Pages has no rewrite rules, so the SPA fallback of Chapter 10 is done with a trick: copy <code>index.html</code> to <code>404.html</code>. Pages serves <code>404.html</code> for any unknown path, the app starts, the router reads the URL. The status code is still 404, which is acceptable for a demo but not for a site that needs search engines; hosts with real rewrites (Netlify <code>_redirects</code>, Vercel <code>vercel.json</code>, nginx <code>try_files</code>) are covered in Lesson 10.4. Deploying a Next.js app is a different story, taught in Chapter 20 of the Next.js course.</p>

<h3>Run it step by step</h3>
<ol>
<li>You open a pull request that changes <code>TheBacSi.tsx</code>. GitHub starts the <code>kiem-tra</code> job on a fresh Ubuntu runner.</li>
<li><code>npm ci</code> installs from the lockfile (cache hit: seconds). <code>tsc -b</code> type-checks, including <code>env.d.ts</code>. Vitest runs 208 tests with MSW.</li>
<li><code>vite build</code> runs in production mode: <code>.env.production</code> sets the real API URL; the MSW branch is eliminated; <code>boWorkerMsw</code> deletes the worker file; hidden maps are written.</li>
<li><code>kiem-kich-thuoc.mjs</code> reads <code>dist/index.html</code>, gzips the four first-load files: 129.6 kB ≤ 140. Green. The maps are deleted.</li>
<li>A reviewer approves, you merge. The push to <code>main</code> runs <code>kiem-tra</code> again, then <code>deploy</code>: demo build with <code>--base=/phong-kham/</code>, <code>404.html</code>, artifact upload, <code>deploy-pages</code>.</li>
<li>A user opens <code>/phong-kham/bac-si/bs-2</code>: Pages has no such file, serves <code>404.html</code> (a copy of <code>index.html</code>), the router with <code>basename</code> renders the doctor page.</li>
</ol>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>In FER202, "deploy" is often <code>npm run build</code> of a Create React App project and dragging the <code>build/</code> folder somewhere, or showing the dev server on the demo day; json-server runs next to it, nobody looks at the bundle, and no header is configured. → At work: two builds with different environment files, a bundle that is measured and guarded by a budget, hidden source maps for the error reporter, security headers and a tested CSP, and a pipeline that runs types, tests, build and budget on every pull request and deploys automatically only from a green main. · <em>Why:</em> a class demo is deployed once; a product is deployed many times a week by several people, and every manual step is a step someone will eventually skip. Dragging a folder still works — you will meet it on small internal tools — but it should never be the only thing between a commit and your users.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "How do you deploy a React SPA, and what does your CI do?"</p>
<p>The Vite build produces static files; any static host or CDN serves them, with SPA fallback for deep links and long cache for hashed assets while <code>index.html</code> is revalidated. CI on every PR: <code>npm ci</code>, type-check, tests, production build, a bundle-size budget; hidden source maps uploaded to the error reporter then removed. CD from main after green checks, with the commit id baked in as the release. Mention environment files per mode, a sub-path needing both <code>base</code> and router <code>basename</code>, and security headers set on the server — and check them with <code>curl -I</code>.</p></div>
<div class="callout"><p><strong>Common interview question.</strong> "What is a Content Security Policy and how do you roll one out without breaking the app?"</p>
<p>A response header listing allowed sources for scripts, styles, images, connections and frames; with <code>script-src 'self'</code> injected inline code does not run, and <code>connect-src</code> stops data leaving to unknown hosts. Roll it out in report-only mode first, collect violations while using the app, fix their sources instead of adding <code>unsafe-inline</code>/<code>unsafe-eval</code>, then enforce. Example from this app: Zod 4's <code>new Function</code> probe caused three violations until <code>z.config({ jitless: true })</code>.</p></div>

<h3>🛠 Keep building the project — step 3/4: build, headers, CI</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after 14.2.</p><ol>
<li>Change <code>batApiGia</code> in <code>main.tsx</code> (DEV or <code>VITE_API_GIA</code>), add <code>basename</code> to the router and <code>serviceWorker.url</code> with <code>BASE_URL</code>.</li>
<li><code>npm i -D rollup-plugin-visualizer</code>; rewrite <code>vite.config.ts</code> with <code>loadEnv</code>, <code>boWorkerMsw</code>, the visualizer and <code>sourcemap: 'hidden'</code>; add <code>bao-cao</code> to <code>.gitignore</code>.</li>
<li>Write <code>scripts/kiem-kich-thuoc.mjs</code> and the <code>kiem</code>, <code>build:demo</code>, <code>kiem:kich-thuoc</code> scripts in <code>package.json</code>.</li>
<li>Write <code>deploy/bao-mat.conf</code> and <code>deploy/nginx-bao-mat.conf</code>; add <code>z.config({ jitless: true })</code> to <code>schema.ts</code>.</li>
<li>Write <code>.github/workflows/ci.yml</code> and validate it with <code>npx @action-validator/cli .github/workflows/ci.yml</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>npx vite build</code> produces no <code>browser-*.js</code> and no <code>dist/mockServiceWorker.js</code> while <code>npx vite build --mode demo</code> has both; <code>npm run kiem</code> ends with "✓ trong ngân sách"; the validator prints nothing; and (if you have Docker) <code>curl -sI</code> through <code>nginx-bao-mat.conf</code> shows the four headers on both an HTML path and an <code>/assets/</code> file.</p></div>
<details><summary>Solution</summary>
<p>Every file is printed above. The commands used to measure are in the reference project: <code>do/ch14-header.sh</code> (two nginx containers, <code>curl -sI</code>), <code>do/ch14-csp.mjs</code> (nginx + Chromium, listens to <code>securitypolicyviolation</code>), <code>do/ch14-base.mjs</code> (sub-path) and <code>chay-ci.sh</code> (the CI steps on a clean clone). If the demo build shows a blank page under <code>--base</code>, check the MSW worker URL: without <code>serviceWorker.url</code> MSW looks for <code>/mockServiceWorker.js</code> at the root and every API call fails.</p>
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> break the pipeline on purpose, three ways.</p><ol>
<li>Import <code>dompurify</code> at the top of <code>main.tsx</code> and use it once. Run <code>npm run kiem</code>. Does the budget catch it? By how much did the first load grow?</li>
<li>Commit a file that imports a module you did not commit (create it, import it, <code>git add</code> only the importer). Run the clean-clone script. Which step fails?</li>
<li>Write a CSP without <code>connect-src</code> for your API domain in <code>bao-mat.conf</code> and explain, before testing, which requests of the production build it would block.</li>
</ol><p><strong>Done when:</strong> step 1 prints the new first-load size (and, if above 140 kB, "✗ VƯỢT NGÂN SÁCH" with exit code 1); step 2 fails at <code>tsc -b</code> or <code>vite build</code> with "Cannot find module" on the clean clone while it passes in your working folder; step 3 names <code>https://api.phong-kham.example</code> calls (every <code>fetch</code> of <code>goiApi</code>) and the error-report beacon.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">dead-code elimination</span><span class="v">the bundler removes code that can never run, e.g. behind a build-time <code>false</code></span></div>
<div class="kv"><span class="k">bundle analysis</span><span class="v">seeing which modules make up each output file (treemap, source map)</span></div>
<div class="kv"><span class="k">size budget</span><span class="v">a size limit checked in CI that fails the build when exceeded</span></div>
<div class="kv"><span class="k">hidden source map</span><span class="v"><code>.map</code> files generated without the <code>sourceMappingURL</code> comment; for error reporters only</span></div>
<div class="kv"><span class="k">CSP</span><span class="v">Content-Security-Policy: header listing allowed sources of scripts, connections, frames…</span></div>
<div class="kv"><span class="k">CI / CD</span><span class="v">run checks on every change / deploy automatically when checks pass</span></div>
<div class="kv"><span class="k"><code>base</code> / <code>basename</code></span><span class="v">sub-path for files (Vite) / for routes (React Router)</span></div>
<div class="kv"><span class="k">OIDC</span><span class="v">short-lived identity token GitHub gives a job, used by <code>deploy-pages</code> instead of a stored secret</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Production build without MSW, demo build with it: <code>if (!DEV &amp;&amp; VITE_API_GIA !== '1') return</code> is eliminated at build time — measured 600.9 vs 1,031.3 kB of JavaScript — plus a plugin that removes the unused worker file.</li>
<li>Read the bundle (visualizer, source maps) before optimising: here the framework is 80% of the first chunk and the Devtools cost 0.0 kB.</li>
<li>A size budget in CI (129.6 / 140 kB gzip) caught a dropped lazy import: 165.9 kB, exit 1.</li>
<li>Hidden source maps for the error reporter, deleted before deploy, and 404 for <code>*.map</code> on the server.</li>
<li>Security headers must be included in every nginx <code>location</code> that has its own <code>add_header</code> — measured 0/4 otherwise. CSP tested in Chromium: 0 violations after <code>z.config({ jitless: true })</code>, injected code blocked.</li>
<li>CI on every PR (npm ci → tsc → Vitest → build → budget), CD to GitHub Pages from a green main; sub-paths need both <code>base</code> and <code>basename</code>.</li>
</ul>

${LINK('https://vite.dev/guide/static-deploy', '⚡', 'Vite — Deploying a Static Site', 'GitHub Pages, Netlify, Vercel and base.')}
${LINK('https://github.com/btd/rollup-plugin-visualizer', '🗺', 'rollup-plugin-visualizer', 'Treemap and other views of a bundle.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP', '🛡️', 'MDN — Content Security Policy', 'Directives, report-only, rollout.')}
${LINK('https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header', '🧱', 'nginx — add_header', 'Read the note on inheritance between levels.')}
${LINK('https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages', '🚀', 'GitHub — Pages with custom workflows', 'upload-pages-artifact and deploy-pages.')}
${LINK_TRONG('/courses/github-actions', '⚙', 'Learn next — GitHub Actions course', 'Workflows, caching, environments and deploys in depth.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3</span>
<h2>Build và deploy: một bundle bảo vệ được, và một pipeline biết từ chối bản hỏng</h2>
<p class="lead">Chương 10 đã build app và phục vụ nó đúng cách: giải thích <code>dist/</code> từng file, đo SPA fallback trên bốn máy chủ, cache một năm cho file có mã băm, <code>no-cache</code> cho <code>index.html</code>, và chuyện tab cũ sau một lần deploy (<code>vite:preloadError</code>). Bài này không lặp lại những thứ đó — nó làm nốt phần còn lại. Bản build production phải thôi mang theo API giả, phải có người nhìn được trong bundle có gì và bị chặn lại khi nó phình ra, máy chủ phải gửi header bảo mật, và một cái máy — không phải trí nhớ của bạn — phải chạy mọi phép kiểm trước khi bất cứ thứ gì được deploy.</p>
<p>Điểm xuất phát: dự án sau Bài 14.2. Mới trong bài: điều kiện MSW trong <code>main.tsx</code>, một plugin Vite nhỏ, <code>rollup-plugin-visualizer</code> 7.1.1, <code>scripts/kiem-kich-thuoc.mjs</code>, <code>deploy/bao-mat.conf</code> và <code>deploy/nginx-bao-mat.conf</code>, <code>.github/workflows/ci.yml</code>, và <code>basename</code> của router.</p>

<h3>Hai bản build: production không MSW, bản demo có MSW</h3>
${slide('rx-14', 15, 'Hai bản build: production bỏ MSW, bản demo giữ lại')}
<p>Tới giờ <code>main.tsx</code> luôn bật MSW, vì app chưa có backend thật (Chương 10 đã ghi: <code>browser-*.js</code> 427 kB là file lớn nhất trong <code>dist/</code>). Một sản phẩm thật cần hai bản build khác nhau: <strong>production</strong> nói chuyện với API thật và không chứa máy chủ giả nào, và <strong>demo</strong> cho host tĩnh không có backend (link portfolio của bạn), cố ý giữ MSW. Điều kiện:</p>
${pre('tsx', SN.batApiGia)}
<p>Làm sao một câu <code>if</code> bỏ được 430 kB? Vì <code>import.meta.env.DEV</code> và <code>import.meta.env.VITE_API_GIA</code> được thay bằng <em>hằng số</em> lúc build (Bài 14.2). Ở bản production điều kiện thành <code>!false &amp;&amp; undefined !== "1"</code>, luôn là <code>true</code>, nên hàm luôn return trước <code>import()</code>. Bộ đóng gói (Rolldown) thấy đoạn mã không bao giờ chạy và xoá nó — <strong>loại bỏ mã chết</strong> (dead-code elimination) — kéo theo cả import động, nên chunk MSW không bao giờ được tạo. Đo được:</p>
${out(OUT.buildTruocSau)}
<p>Trong file production đã nén, cả hàm chỉ còn đúng <code>async function el(){}</code>. Bản demo (<code>vite build --mode demo</code>, đọc <code>.env.demo</code> có <code>VITE_API_GIA=1</code>) nặng hơn 72% JavaScript — cái giá của một bản demo không backend, và chỉ bản demo trả.</p>
<p>Một thứ câu <code>if</code> không bỏ được: Vite chép nguyên thư mục <code>public/</code> vào <code>dist/</code>, kể cả <code>public/mockServiceWorker.js</code>. Vô hại, nhưng một site production không nên phục vụ một service worker nó không bao giờ dùng. Một plugin chục dòng xoá nó sau khi build, trừ bản demo:</p>
${pre('ts', SN.viteConfig)}
<p>Đọc cấu hình từ trên xuống: <code>loadEnv(mode, cwd, '')</code> đọc các file <code>.env</code> <em>bên trong file cấu hình</em> (chạy trong Node, nơi <code>import.meta.env</code> chưa tồn tại); tiền tố rỗng nghĩa là "mọi biến", an toàn ở đây vì file cấu hình không bao giờ được gửi xuống trình duyệt. <code>boWorkerMsw</code> dùng hai hook của quá trình build: <code>configResolved</code> để biết thư mục xuất, <code>closeBundle</code> để xoá file khi mọi thứ đã ghi xong. Visualizer chỉ bật khi có <code>PHAN_TICH=1</code>. Còn <code>sourcemap: 'hidden'</code> giải thích ở dưới.</p>
${SD.envVi}

<h3>Đọc bundle trước khi tối ưu</h3>
${slide('rx-14', 16, 'Mổ bundle: react-dom và router chiếm phần lớn')}
<p>"Bundle to quá" không phải một phát hiện. <em>Cái gì</em> to mới là phát hiện. <code>PHAN_TICH=1 npx vite build</code> ghi ra <code>bao-cao/phan-tich.html</code> — nằm ngoài <code>dist/</code>, nên không bao giờ lỡ tay deploy nó — một bản đồ ô vuông trong đó mỗi ô là một module và diện tích là kích thước. Cùng câu trả lời dạng số, đọc thẳng từ source map:</p>
${out(OUT.phanTich)}
<p>Điều nó nói về app này:</p>
<ul>
<li><strong>Chunk tải đầu phần lớn là framework.</strong> <code>react-dom</code> (207 kB) và <code>react-router</code> (95 kB) chiếm 80% <code>index-*.js</code>. Mã của chính app là 48 kB. Tối ưu trong <code>src/</code> không được mấy; một router nhỏ hơn hay render phía máy chủ là quyết định kiến trúc, không phải sửa nhanh.</li>
<li><strong>Devtools tốn 0,0 kB.</strong> <code>ReactQueryDevtools</code> vẫn được vẽ trong <code>main.tsx</code>, nhưng ở production gói đó xuất ra một component rỗng — xác nhận bằng số đo, không phải tin README.</li>
<li><strong>Zod là 77 kB của trang đặt lịch.</strong> Nó đã được tải lười (Chương 8), nên ai không đặt lịch thì không bao giờ tải. Nếu nó nằm trong chunk đầu, đây là chỗ bạn nhìn đầu tiên.</li>
</ul>

<h3>Ngân sách kích thước làm CI đỏ</h3>
${slide('rx-14', 17, 'Ngân sách kích thước: CI đỏ khi lỡ bỏ tải lười')}
<p>Đo một lần là chưa đủ; bundle phình ra từng import vô tội một. <strong>Ngân sách kích thước</strong> là một con số trong repo và một script thất bại khi con số bị vượt:</p>
${pre('js', SN.kiemKichThuoc)}
${out(OUT.nganSachOk)}
<p>Để thấy nó cắn, trang đặt lịch được import thẳng trong router thay vì tải lười — một dòng, đúng loại thay đổi lọt qua review vì nó "chỉ sửa một import":</p>
${out(OUT.nganSachVuot)}
<p>Mã thoát 1: trong CI, pull request đỏ, kèm câu nói đúng cái gì đã phình. Ngân sách đặt cao hơn con số hôm nay một chút (129,6 trên 140 kB gzip): việc của nó là bắt cú nhảy vọt, không phải bắt mọi commit giành từng byte. Đo gzip, vì đó là thứ đi qua mạng; và đo thứ <code>index.html</code> tải, vì đó là thứ chặn màn hình đầu tiên.</p>

<h3>Source map: cho công cụ báo lỗi, không cho người ngoài</h3>
<p>Stack trace trên production ghi <code>at Xc (index-B-6GtYu3.js:1:48213)</code>. Source map dịch nó về lại <code>baoLoi (src/shared/loi/bao-loi.ts:41)</code>. <code>sourcemap: 'hidden'</code> sinh file <code>.map</code> nhưng <em>không</em> thêm dòng chú thích <code>//# sourceMappingURL=</code> vào JavaScript, nên trình duyệt không bao giờ hỏi xin chúng (đã kiểm: 0 lần xuất hiện trong <code>dist/assets/*.js</code>). CI tải chúng lên dịch vụ báo lỗi rồi xoá trước khi deploy — một file map chứa trọn mã nguồn của bạn. Cấu hình nginx bên dưới còn trả 404 cho <code>*.map</code>, như một ổ khoá thứ hai.</p>

<h3>Header bảo mật, và một luật của nginx lặng lẽ vứt chúng đi</h3>
${slide('rx-14', 18, 'nginx: add_header trong location xoá header của server')}
<p>Có những lớp bảo vệ chỉ máy chủ mới đưa ra được, dưới dạng header HTTP trên mọi câu trả lời:</p>
${pre('nginx', SN.baoMatConf)}
<ul>
<li><strong>Content-Security-Policy</strong> — danh sách nơi script, style, ảnh và kết nối được phép đến từ. <code>script-src 'self'</code> nghĩa là chỉ file JavaScript của chính site được chạy: <code>&lt;script&gt;</code> hay <code>onerror="…"</code> bị chèn vào thì không.</li>
<li><strong>X-Content-Type-Options: nosniff</strong> — trình duyệt tin kiểu nội dung được khai báo thay vì đoán, nên một "ảnh" tải lên không thể bị chạy như script.</li>
<li><strong>Referrer-Policy</strong> — link sang site khác chỉ gửi kèm nguồn (origin), không gửi đường dẫn đầy đủ (có thể chứa một id).</li>
<li><strong>frame-ancestors 'none'</strong> — không ai nhúng được trang của bạn vào <code>&lt;iframe&gt;</code> để lừa người dùng bấm (clickjacking).</li>
</ul>
<p>Chỗ hiển nhiên để đặt chúng là một lần, trong <code>server { }</code>. Sai, và lý do là một luật của nginx làm gần như ai cũng bất ngờ: <strong>một <code>location</code> có bất kỳ <code>add_header</code> nào của riêng nó thì không thừa hưởng <code>add_header</code> nào từ cấp trên</strong>. Cấu hình của Chương 10 thêm <code>Cache-Control</code> ở cả hai location, nên:</p>
${pre('nginx', SN.nginxSai)}
${pre('nginx', SN.nginxBaoMat)}
${out(OUT.header)}
<p>0 header bảo mật với cấu hình "hiển nhiên", trên cả HTML lẫn JavaScript, và <code>nginx -t</code> không báo gì sai. Có đoạn include trong từng location: 4/4, và source map trả 404 trong khi cấu hình sai phục vụ chúng với 200. Luôn kiểm header bằng <code>curl -sI</code> vào máy chủ thật, đừng bao giờ kiểm bằng cách đọc file cấu hình.</p>

<h3>Đo CSP trên trình duyệt thật</h3>
${slide('rx-14', 19, 'CSP đo thật: Zod 4 gây vi phạm cho tới khi tắt JIT')}
<p>Một CSP chặn chính app của bạn còn tệ hơn không có, nên phải test nó cùng app, trên trình duyệt. <code>do/ch14-csp.mjs</code> phục vụ bản demo qua nginx với các header ở trên, đi qua bốn trang và một lần đăng nhập trên Chromium, và ghi lại mọi sự kiện <code>securitypolicyviolation</code>:</p>
${out(OUT.cspTruoc)}
<p>Không có lỗi trang nào — nhưng ba vi phạm <code>script-src</code> vì <code>eval</code> trong lúc dùng bình thường. Thủ phạm tìm thấy trong <code>node_modules/zod/v4/core/util.js</code>: Zod 4 thử một lần xem có được sinh mã kiểm nhanh bằng <code>new Function("")</code> không. Dưới CSP chặt, lần thử bị chặn, Zod bắt lỗi và lùi về cách thường — mọi thứ vẫn chạy — nhưng trình duyệt vẫn báo một vi phạm, và một CSP report-only trên production sẽ đầy nhiễu che mất các vụ tấn công thật. Zod có đúng một công tắc cho việc này:</p>
${pre('ts', SN.zodJitless)}
${out(OUT.cspSau)}
<p>Không vi phạm nào khi dùng app. Hai dòng cuối chính là ý nghĩa của CSP: một <code>&lt;img onerror&gt;</code> chèn thẳng vào DOM không chạy (<code>window.__xss</code> vẫn <code>undefined</code>, bị <code>script-src-attr</code> chặn), và một <code>fetch</code> ra site lạ bị <code>connect-src</code> chặn — nên kể cả mã đã bị chèn cũng không gửi dữ liệu ra ngoài được. Đó là phòng thủ nhiều lớp của cả khoá:</p>
${SD.lopVi}
<div class="pitfall co-tieu-de"><strong>Bẫy — thêm <code>'unsafe-inline'</code> / <code>'unsafe-eval'</code> "cho nó chạy".</strong> CSP đầu tiên bạn viết sẽ làm hỏng thứ gì đó (một script inline của đoạn mã thống kê, một thư viện dùng <code>eval</code>). Thêm các từ khoá unsafe làm lỗi biến mất và biến chính sách thành đồ trang trí. Tìm tới nguồn, như với Zod ở đây; dời script inline ra file; triển khai bằng <code>Content-Security-Policy-Report-Only</code> trước để gom vi phạm mà không chặn.</div>

<h3>CI/CD: một cái máy chạy mọi phép kiểm, cho mọi thay đổi</h3>
${slide('rx-14', 20, 'CI/CD: kiểm trên mọi PR, deploy khi main xanh')}
<p>Mọi phép kiểm tới giờ — kiểu, 208 test, build, ngân sách — chỉ có giá trị nếu chúng chạy mọi lần, kể cả tối thứ Sáu khi bạn chắc chắn thay đổi của mình nhỏ xíu. <strong>CI</strong> (tích hợp liên tục) chạy chúng trên mọi lần push và pull request; <strong>CD</strong> (triển khai liên tục) đưa kết quả lên khi nhánh chính xanh. Khoá <a href="/courses/github-actions">GitHub Actions</a> dạy công cụ này thật sâu; đây là workflow cho app này:</p>
${pre('yaml', SN.ci)}
${SD.ciVi}
<p>Vì sao có từng dòng:</p>
<ul>
<li><strong><code>npm ci</code>, không phải <code>npm install</code></strong> — cài đúng như <code>package-lock.json</code> nói và thất bại nếu nó lệch <code>package.json</code>. CI phải test đúng bộ thư viện bạn đã test.</li>
<li><strong><code>cache: npm</code></strong> — dùng lại cache tải về giữa các lần chạy, khoá theo lockfile.</li>
<li><strong><code>concurrency</code> với <code>cancel-in-progress</code></strong> — hai lần push liền nhau: lần chạy trước bị huỷ, chỉ lần mới nhất có ý nghĩa.</li>
<li><strong><code>permissions: contents: read</code></strong> ở trên cùng, và job deploy chỉ xin <code>pages: write</code> và <code>id-token: write</code> cho riêng nó. <code>deploy-pages</code> xác thực bằng OIDC, nên không có token nào cất trong secrets.</li>
<li><strong><code>needs: kiem-tra</code> và câu <code>if</code></strong> — deploy chỉ chạy sau khi phép kiểm xanh, và chỉ cho lần push lên <code>main</code>, không bao giờ cho pull request từ fork.</li>
<li><strong><code>VITE_PHIEN_BAN: github.sha</code></strong> — mã commit vào bản build, để báo cáo lỗi gọi đúng tên phiên bản (Bài 14.2).</li>
<li>Phiên bản action kiểm ngày 26/09/2026 bằng <code>gh api repos/actions/&lt;tên&gt;/releases/latest</code>: <code>checkout</code> v7.0.1, <code>setup-node</code> v7.0.0, <code>upload-pages-artifact</code> v5.0.0, <code>deploy-pages</code> v5.0.1.</li>
</ul>
<p>Có hai thứ kiểm được mà không cần GitHub. Cấu trúc của file, bằng một bộ kiểm theo schema:</p>
${out(OUT.actionValidator)}
<p>Và chính các bước, trên một <strong>bản clone sạch</strong> — không <code>node_modules</code>, không <code>dist</code>, chỉ những gì đã commit — đúng hoàn cảnh của một runner CI:</p>
${pre('bash', SN.chayCi)}
${out(OUT.ciSach)}
<p>Mọi việc một runner sẽ làm, khoảng 23 giây trên máy này. Bản clone sạch bắt được các bug kinh điển "máy tôi chạy được": một file quên commit, một thư viện cài toàn cục, một <code>.env.local</code> mà bản build âm thầm dựa vào.</p>
<p>⏳ Chưa chạy thật: push lên một repo GitHub rồi xem workflow chạy và deploy lên Pages cần tài khoản GitHub và cài đặt repo (Settings → Pages → Source: GitHub Actions) mà máy này không dùng. Thay vào đó, workflow được kiểm theo schema và các bước được chạy trên bản clone sạch.</p>
<!-- CHAY-O-MAY: tạo repo GitHub cho phong-kham, bật Pages (Source: GitHub Actions), push main, xem run xanh + mở https://<user>.github.io/<repo>/bac-si/bs-2 (deep link qua 404.html) -->

<h3>Deploy vào thư mục con: base và basename</h3>
${slide('rx-14', 21, 'Thư mục con: base của Vite + basename của Router')}
<p>GitHub Pages phục vụ một project ở <code>https://&lt;user&gt;.github.io/&lt;repo&gt;/</code> — không phải ở gốc. Hai thứ khác nhau cần biết điều đó:</p>
<ul>
<li><strong><code>base</code> của Vite</strong> (<code>--base=/phong-kham/</code>) viết lại đường dẫn của <em>file</em>: <code>index.html</code> giờ tải <code>/phong-kham/assets/index-….js</code>.</li>
<li><strong><code>basename</code> của React Router</strong> viết lại đường dẫn của <em>trang</em>: <code>&lt;Link to="/bac-si"&gt;</code> phải ra <code>/phong-kham/bac-si</code>, và URL <code>/phong-kham/bac-si</code> phải khớp route <code>bac-si</code>.</li>
</ul>
${pre('tsx', SN.routerBase)}
<p><code>import.meta.env.BASE_URL</code> chính là <code>base</code> mà bản build đã dùng, nên hai thứ không bao giờ lệch nhau. URL của worker MSW cũng dùng nó (xem <code>batApiGia</code> ở trên). Đo bằng <code>vite preview --base /phong-kham/</code> trên Chromium, cùng một bản build có và không có <code>basename</code>:</p>
${out(OUT.base)}
<p>Thiếu <code>basename</code>, file vẫn tải được (nhờ <code>base</code>), app khởi động, rồi hiện trang 404 của chính nó, vì router thấy <code>/phong-kham/bac-si</code> và không có route nào như thế; link trên menu trỏ tới <code>/bac-si</code>, ra ngoài site. Không có lỗi nào ở đâu cả — chỉ có một trang sai.</p>
<p>GitHub Pages không có luật rewrite, nên SPA fallback của Chương 10 làm bằng một mẹo: chép <code>index.html</code> thành <code>404.html</code>. Pages trả <code>404.html</code> cho mọi đường dẫn lạ, app khởi động, router đọc URL. Mã trạng thái vẫn là 404, chấp nhận được cho bản demo nhưng không cho một site cần máy tìm kiếm; các host có rewrite thật (Netlify <code>_redirects</code>, Vercel <code>vercel.json</code>, nginx <code>try_files</code>) đã có ở Bài 10.4. Deploy một app Next.js là chuyện khác, dạy ở Chương 20 của khoá Next.js.</p>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Bạn mở một pull request sửa <code>TheBacSi.tsx</code>. GitHub khởi động job <code>kiem-tra</code> trên một runner Ubuntu mới tinh.</li>
<li><code>npm ci</code> cài từ lockfile (trúng cache: vài giây). <code>tsc -b</code> kiểm kiểu, gồm cả <code>env.d.ts</code>. Vitest chạy 208 test với MSW.</li>
<li><code>vite build</code> chạy chế độ production: <code>.env.production</code> đặt địa chỉ API thật; nhánh MSW bị loại; <code>boWorkerMsw</code> xoá file worker; map ẩn được ghi ra.</li>
<li><code>kiem-kich-thuoc.mjs</code> đọc <code>dist/index.html</code>, gzip bốn file tải đầu: 129,6 kB ≤ 140. Xanh. Map bị xoá.</li>
<li>Người review duyệt, bạn merge. Lần push lên <code>main</code> chạy lại <code>kiem-tra</code>, rồi <code>deploy</code>: build demo với <code>--base=/phong-kham/</code>, <code>404.html</code>, tải artifact, <code>deploy-pages</code>.</li>
<li>Một người dùng mở <code>/phong-kham/bac-si/bs-2</code>: Pages không có file đó, trả <code>404.html</code> (bản chép của <code>index.html</code>), router có <code>basename</code> vẽ trang bác sĩ.</li>
</ol>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202, "deploy" thường là <code>npm run build</code> một dự án Create React App rồi kéo thư mục <code>build/</code> đi đâu đó, hoặc mở dev server trong buổi demo; json-server chạy bên cạnh, không ai nhìn bundle, và không header nào được cấu hình. → Đi làm: hai bản build với file môi trường khác nhau, bundle được đo và canh bằng ngân sách, source map ẩn cho công cụ báo lỗi, header bảo mật và CSP đã test, và một pipeline chạy kiểu, test, build, ngân sách trên mọi pull request và chỉ tự deploy từ một nhánh main xanh. · <em>Vì sao:</em> bản demo trên lớp deploy một lần; sản phẩm deploy nhiều lần mỗi tuần bởi nhiều người, và mỗi bước làm tay là một bước sớm muộn sẽ có người bỏ qua. Kéo thư mục vẫn chạy — bạn sẽ gặp nó ở các công cụ nội bộ nhỏ — nhưng nó không bao giờ nên là thứ duy nhất đứng giữa một commit và người dùng.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Bạn deploy một SPA React thế nào, và CI của bạn làm gì?"</p>
<p>Bản build Vite ra file tĩnh; host tĩnh hay CDN nào cũng phục vụ được, kèm SPA fallback cho deep link và cache dài cho file có mã băm trong khi <code>index.html</code> luôn được kiểm lại. CI trên mọi PR: <code>npm ci</code>, kiểm kiểu, test, build production, ngân sách kích thước bundle; source map ẩn tải lên công cụ báo lỗi rồi xoá. CD từ main sau khi xanh, mã commit nướng vào làm phiên bản. Nhắc thêm file môi trường theo chế độ, thư mục con cần cả <code>base</code> lẫn <code>basename</code> của router, và header bảo mật đặt ở máy chủ — kiểm bằng <code>curl -I</code>.</p></div>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Content Security Policy là gì và triển khai nó thế nào mà không làm hỏng app?"</p>
<p>Một header liệt kê nguồn được phép cho script, style, ảnh, kết nối và khung nhúng; với <code>script-src 'self'</code> mã inline bị chèn không chạy, và <code>connect-src</code> chặn dữ liệu đi ra host lạ. Triển khai ở chế độ report-only trước, gom vi phạm trong lúc dùng app, sửa tận nguồn thay vì thêm <code>unsafe-inline</code>/<code>unsafe-eval</code>, rồi mới bật chặn. Ví dụ từ app này: lần thử <code>new Function</code> của Zod 4 gây ba vi phạm cho tới khi đặt <code>z.config({ jitless: true })</code>.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 3/4: build, header, CI</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau 14.2.</p><ol>
<li>Sửa <code>batApiGia</code> trong <code>main.tsx</code> (DEV hoặc <code>VITE_API_GIA</code>), thêm <code>basename</code> cho router và <code>serviceWorker.url</code> dùng <code>BASE_URL</code>.</li>
<li><code>npm i -D rollup-plugin-visualizer</code>; viết lại <code>vite.config.ts</code> với <code>loadEnv</code>, <code>boWorkerMsw</code>, visualizer và <code>sourcemap: 'hidden'</code>; thêm <code>bao-cao</code> vào <code>.gitignore</code>.</li>
<li>Viết <code>scripts/kiem-kich-thuoc.mjs</code> và các script <code>kiem</code>, <code>build:demo</code>, <code>kiem:kich-thuoc</code> trong <code>package.json</code>.</li>
<li>Viết <code>deploy/bao-mat.conf</code> và <code>deploy/nginx-bao-mat.conf</code>; thêm <code>z.config({ jitless: true })</code> vào <code>schema.ts</code>.</li>
<li>Viết <code>.github/workflows/ci.yml</code> và kiểm nó bằng <code>npx @action-validator/cli .github/workflows/ci.yml</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>npx vite build</code> không sinh <code>browser-*.js</code> và không có <code>dist/mockServiceWorker.js</code> trong khi <code>npx vite build --mode demo</code> có cả hai; <code>npm run kiem</code> kết thúc bằng "✓ trong ngân sách"; bộ kiểm workflow không in gì; và (nếu có Docker) <code>curl -sI</code> qua <code>nginx-bao-mat.conf</code> hiện đủ bốn header trên cả một đường dẫn HTML lẫn một file <code>/assets/</code>.</p></div>
<details><summary>Lời giải</summary>
<p>Mọi file đã in ở trên. Các lệnh dùng để đo nằm trong dự án mẫu: <code>do/ch14-header.sh</code> (hai container nginx, <code>curl -sI</code>), <code>do/ch14-csp.mjs</code> (nginx + Chromium, nghe <code>securitypolicyviolation</code>), <code>do/ch14-base.mjs</code> (thư mục con) và <code>chay-ci.sh</code> (các bước CI trên bản clone sạch). Nếu bản demo trắng trang khi có <code>--base</code>, kiểm URL của worker MSW: thiếu <code>serviceWorker.url</code>, MSW đi tìm <code>/mockServiceWorker.js</code> ở gốc và mọi lời gọi API đều hỏng.</p>
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề:</strong> cố ý làm hỏng pipeline theo ba cách.</p><ol>
<li>Import <code>dompurify</code> ở đầu <code>main.tsx</code> và dùng nó một lần. Chạy <code>npm run kiem</code>. Ngân sách có bắt được không? Phần tải đầu tăng bao nhiêu?</li>
<li>Commit một file import một module bạn chưa commit (tạo nó, import nó, chỉ <code>git add</code> file import). Chạy script clone sạch. Bước nào hỏng?</li>
<li>Viết một CSP thiếu <code>connect-src</code> cho tên miền API trong <code>bao-mat.conf</code> và giải thích, trước khi thử, nó sẽ chặn những request nào của bản production.</li>
</ol><p><strong>Đạt khi:</strong> bước 1 in ra kích thước tải đầu mới (và nếu quá 140 kB thì "✗ VƯỢT NGÂN SÁCH" với mã thoát 1); bước 2 hỏng ở <code>tsc -b</code> hoặc <code>vite build</code> với "Cannot find module" trên bản clone sạch trong khi vẫn qua ở thư mục làm việc của bạn; bước 3 kể ra các lời gọi tới <code>https://api.phong-kham.example</code> (mọi <code>fetch</code> của <code>goiApi</code>) và beacon báo lỗi.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">dead-code elimination</span><span class="v">loại bỏ mã chết: bộ đóng gói xoá mã không bao giờ chạy, vd sau một <code>false</code> lúc build</span></div>
<div class="kv"><span class="k">bundle analysis</span><span class="v">xem mỗi file đầu ra gồm những module nào (bản đồ ô vuông, source map)</span></div>
<div class="kv"><span class="k">size budget</span><span class="v">ngân sách kích thước kiểm trong CI, vượt là build hỏng</span></div>
<div class="kv"><span class="k">hidden source map</span><span class="v">file <code>.map</code> sinh ra mà không có chú thích <code>sourceMappingURL</code>; chỉ cho công cụ báo lỗi</span></div>
<div class="kv"><span class="k">CSP</span><span class="v">Content-Security-Policy: header liệt kê nguồn được phép cho script, kết nối, khung nhúng…</span></div>
<div class="kv"><span class="k">CI / CD</span><span class="v">chạy phép kiểm trên mọi thay đổi / tự deploy khi phép kiểm xanh</span></div>
<div class="kv"><span class="k"><code>base</code> / <code>basename</code></span><span class="v">thư mục con cho file (Vite) / cho route (React Router)</span></div>
<div class="kv"><span class="k">OIDC</span><span class="v">token danh tính ngắn hạn GitHub cấp cho job, <code>deploy-pages</code> dùng thay một secret cất sẵn</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bản production không MSW, bản demo có MSW: <code>if (!DEV &amp;&amp; VITE_API_GIA !== '1') return</code> bị loại lúc build — đo 600,9 so với 1.031,3 kB JavaScript — cộng một plugin xoá file worker không dùng.</li>
<li>Đọc bundle (visualizer, source map) trước khi tối ưu: ở đây framework chiếm 80% chunk đầu và Devtools tốn 0,0 kB.</li>
<li>Ngân sách kích thước trong CI (129,6 / 140 kB gzip) bắt được một lần bỏ tải lười: 165,9 kB, mã thoát 1.</li>
<li>Source map ẩn cho công cụ báo lỗi, xoá trước khi deploy, và 404 cho <code>*.map</code> ở máy chủ.</li>
<li>Header bảo mật phải được include vào mọi <code>location</code> nginx có <code>add_header</code> riêng — đo được 0/4 nếu không. CSP test trên Chromium: 0 vi phạm sau <code>z.config({ jitless: true })</code>, mã bị chèn bị chặn.</li>
<li>CI trên mọi PR (npm ci → tsc → Vitest → build → ngân sách), CD lên GitHub Pages từ main xanh; thư mục con cần cả <code>base</code> lẫn <code>basename</code>.</li>
</ul>

${LINK('https://vite.dev/guide/static-deploy', '⚡', 'Vite — Deploying a Static Site', 'GitHub Pages, Netlify, Vercel và base.')}
${LINK('https://github.com/btd/rollup-plugin-visualizer', '🗺', 'rollup-plugin-visualizer', 'Bản đồ ô vuông và các góc nhìn khác của bundle.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP', '🛡️', 'MDN — Content Security Policy', 'Các chỉ thị, report-only, cách triển khai.')}
${LINK('https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header', '🧱', 'nginx — add_header', 'Đọc ghi chú về thừa hưởng giữa các cấp.')}
${LINK('https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages', '🚀', 'GitHub — Pages với workflow tuỳ chỉnh', 'upload-pages-artifact và deploy-pages.')}
${LINK_TRONG('/courses/github-actions', '⚙', 'Học tiếp — Khoá GitHub Actions', 'Workflow, cache, environment và deploy thật sâu.')}
</div>
`,
};

/* ─── 15 câu phỏng vấn của Bài 14.4: [câu EN, ý trả lời EN, câu VI, ý trả lời VI, bài để ôn] ─── */
const CAU_PV = [
  ['What happens between setState and the pixels changing?',
   'setState schedules an update; React re-runs the component function (render) to get a new element tree, compares it with the previous one (reconciliation), then applies only the differences to the DOM (commit), and the browser paints. Render must be pure: it can run more than once (StrictMode does it on purpose in development). Effects run after commit. Several setState calls in one event are batched into one render.',
   'Từ lúc gọi setState tới lúc điểm ảnh đổi, chuyện gì xảy ra?',
   'setState lên lịch một cập nhật; React chạy lại hàm component (render) để có cây element mới, so với cây cũ (reconciliation), rồi chỉ áp phần khác vào DOM (commit), và trình duyệt vẽ. Render phải thuần: nó có thể chạy nhiều lần (StrictMode cố ý làm vậy khi dev). Effect chạy sau commit. Nhiều setState trong một sự kiện được gộp thành một lần render.',
   '/courses/react/learn?lessonSlug=rx-11-1-virtual-dom', 'Bài 11.1'],
  ['Why does a list need a key, and why not the index?',
   'The key tells React which item is which between renders, so it can keep, move or remove the right component and its state. With the index as key, deleting or sorting items shifts the keys: React keeps the state of position 2 for whatever item is now at position 2 — a checked checkbox or a typed input jumps to another row. Use a stable id from the data. Keys are also a tool: changing a key deliberately resets a component.',
   'Vì sao danh sách cần key, và vì sao không dùng index?',
   'Key cho React biết mục nào là mục nào giữa các lần render, để giữ, dời hay xoá đúng component và state của nó. Dùng index làm key, khi xoá hay sắp xếp thì key bị dịch: React giữ state của vị trí 2 cho mục nào đang nằm ở vị trí 2 — ô đã tick hay chữ đã gõ nhảy sang dòng khác. Dùng id ổn định từ dữ liệu. Key còn là công cụ: cố ý đổi key để reset một component.',
   '/courses/react/learn?lessonSlug=rx-11-2-key-identity', 'Bài 1.3 · 11.2'],
  ['Why must state be updated immutably?',
   'React decides whether something changed with Object.is on the old and new value. If you push into the same array or mutate the same object, the reference is identical, so React (and memo, and useEffect dependencies) see "no change" and skip the update. Create new arrays and objects with spread, map, filter, toSorted — or use Immer, which lets you write mutations on a draft and produces a new object.',
   'Vì sao phải cập nhật state bất biến?',
   'React quyết định có gì đổi không bằng Object.is giữa giá trị cũ và mới. Nếu bạn push vào cùng mảng hay sửa cùng object, tham chiếu vẫn y hệt, nên React (cả memo, cả dependency của useEffect) thấy "không đổi" và bỏ qua cập nhật. Tạo mảng và object mới bằng spread, map, filter, toSorted — hoặc dùng Immer, cho phép viết kiểu sửa trên bản nháp rồi sinh object mới.',
   '/courses/react/learn?lessonSlug=rx-2-3-object-array', 'Bài 2.3'],
  ['When do you NOT need useEffect?',
   'When the value can be computed from props or state during render (derived data — just compute it, maybe with useMemo); when something should happen because the user did something (put it in the event handler); when state must reset because a prop changed (use a key). Effects are for synchronising with things outside React: subscriptions, timers, the document title, a non-React widget. A good sign of a bad effect: it only calls setState with values computed from other state — an extra render with stale data first.',
   'Khi nào bạn KHÔNG cần useEffect?',
   'Khi giá trị tính được từ props hay state ngay lúc render (dữ liệu dẫn xuất — cứ tính, có thể kèm useMemo); khi việc gì đó xảy ra vì người dùng làm gì đó (đặt trong handler sự kiện); khi state phải reset vì một prop đổi (dùng key). Effect dành cho việc đồng bộ với thứ nằm ngoài React: đăng ký sự kiện, bộ hẹn giờ, tiêu đề trang, một widget không phải React. Dấu hiệu của effect tồi: nó chỉ gọi setState bằng giá trị tính từ state khác — thêm một lần render mà lần đầu còn dữ liệu cũ (Chương 13 đo được 4 lần render, một lần sai).',
   '/courses/react/learn?lessonSlug=rx-4-2-khong-can', 'Bài 4.2 · 13.2'],
  ['How do you decide where a piece of state lives?',
   'Ask who reads it and who changes it. Keep it as low as possible: in the one component that uses it; lift it to the closest common parent when siblings need it; put it in the URL when it should survive reload and be shareable (filters, tabs, pages); in a client store like Zustand when unrelated parts of the app need it (session, language); and never copy server data into client state — that belongs to a server-state cache like TanStack Query.',
   'Bạn quyết định một mẩu state sống ở đâu thế nào?',
   'Hỏi ai đọc nó và ai đổi nó. Giữ nó thấp nhất có thể: trong đúng component dùng nó; nâng lên cha chung gần nhất khi các anh em cần; đưa lên URL khi nó phải sống qua F5 và chia sẻ được (bộ lọc, tab, trang); vào một store client như Zustand khi những phần không liên quan của app cần nó (phiên đăng nhập, ngôn ngữ); và đừng bao giờ chép dữ liệu máy chủ vào state client — chỗ của nó là cache state-máy-chủ như TanStack Query.',
   '/courses/react/learn?lessonSlug=rx-2-4-dat-state', 'Bài 2.4 · 5.4'],
  ['Context or Zustand (or Redux)?',
   'Context passes a value down the tree; every consumer re-renders when the value changes, and it has no selectors, so it fits values that change rarely (theme, current user, a compound component\'s internal state). Zustand is a small external store with selectors: a component re-renders only when the slice it selects changes, it works outside React (our http.ts reads the token with getState), and it persists easily. Redux Toolkit gives the same with more structure and tooling; you will meet it in older and larger codebases.',
   'Context hay Zustand (hay Redux)?',
   'Context truyền một giá trị xuống cây; mọi nơi dùng nó render lại khi giá trị đổi, và nó không có selector, nên hợp với giá trị ít đổi (theme, người dùng hiện tại, state nội bộ của một compound component). Zustand là một store ngoài nhỏ gọn có selector: component chỉ render lại khi phần nó chọn đổi, nó dùng được ngoài React (http.ts của ta đọc token bằng getState), và persist dễ. Redux Toolkit cho cùng thứ đó với nhiều cấu trúc và công cụ hơn; bạn sẽ gặp nó ở các codebase cũ và lớn.',
   '/courses/react/learn?lessonSlug=rx-5-3-zustand', 'Bài 5.1 · 5.3'],
  ['Why TanStack Query instead of fetch in useEffect?',
   'Fetching in an effect means writing by hand: loading and error state, cancelling on unmount, ignoring stale responses (race conditions), caching, deduplicating identical requests, refetching when data is stale, retrying, pausing offline. TanStack Query does all of that per query key, and mutations invalidate the keys they affect. It treats server data as a cache you synchronise with, not state you own.',
   'Vì sao dùng TanStack Query thay cho fetch trong useEffect?',
   'Fetch trong effect nghĩa là tự viết tay: trạng thái tải và lỗi, huỷ khi unmount, bỏ câu trả lời cũ (race condition), cache, gộp các request giống nhau, tải lại khi dữ liệu cũ, thử lại, tạm dừng khi mất mạng. TanStack Query làm hết những thứ đó theo query key, và mutation invalidate các key bị ảnh hưởng. Nó coi dữ liệu máy chủ là một cache cần đồng bộ, không phải state bạn sở hữu.',
   '/courses/react/learn?lessonSlug=rx-6-2-tanstack', 'Bài 6.1 · 6.2'],
  ['What is a race condition in data fetching, and how do you prevent it?',
   'Two requests are in flight — say the user types "lan" then "lang" — and the older one returns last, overwriting the newer result with wrong data. Prevent it by cancelling the old request (AbortController, or the signal TanStack Query passes to queryFn), or by ignoring responses that no longer match the current input. Query keys solve it structurally: each key has its own result. Chapter 14 showed a variant: a request of the previous user joined by the next user\'s page, fixed by removing private queries on sign-out.',
   'Race condition khi lấy dữ liệu là gì, và phòng thế nào?',
   'Hai request cùng đang bay — vd người dùng gõ "lan" rồi "lang" — và request cũ về sau cùng, ghi đè kết quả mới bằng dữ liệu sai. Phòng bằng cách huỷ request cũ (AbortController, hay signal mà TanStack Query truyền vào queryFn), hoặc bỏ qua câu trả lời không còn khớp đầu vào hiện tại. Query key giải quyết từ cấu trúc: mỗi key một kết quả. Chương 14 cho thấy một biến thể: request của người dùng trước bị trang của người sau gộp vào, sửa bằng cách gỡ query riêng tư khi đăng xuất.',
   '/courses/react/learn?lessonSlug=rx-6-1-fetch', 'Bài 6.1 · 14.1'],
  ['When do you use memo, useMemo and useCallback?',
   'Only where a measurement says a render is expensive and unnecessary. Profile first (React DevTools Profiler): which component renders, how often, how long. memo skips re-rendering a component when its props are equal; useMemo caches an expensive calculation; useCallback keeps a function identity stable so a memoised child or an effect dependency does not change. Everywhere else they cost memory and readability. With React Compiler 1.0 enabled, most of this is automatic — you still measure, and you still know how to switch it off for one component (use no memo).',
   'Khi nào dùng memo, useMemo và useCallback?',
   'Chỉ ở chỗ số đo bảo một lần render vừa tốn vừa thừa. Đo trước (Profiler của React DevTools): component nào render, bao nhiêu lần, bao lâu. memo bỏ qua render lại một component khi props bằng nhau; useMemo cache một phép tính tốn kém; useCallback giữ danh tính hàm ổn định để con đã memo hay dependency của effect không đổi. Ở mọi chỗ khác chúng tốn bộ nhớ và khó đọc. Khi bật React Compiler 1.0, phần lớn việc này tự động — bạn vẫn đo, và vẫn biết cách tắt nó cho một component (use no memo).',
   '/courses/react/learn?lessonSlug=rx-8-2-memo', 'Bài 8.1 · 8.2 · 12.4'],
  ['A page is slow with thousands of items. What do you do?',
   'Measure first: is it the first render, filtering, or scrolling? Options by cost: paginate or "load more" (simplest, often enough); defer the expensive part with useDeferredValue or useTransition so typing stays responsive; split code with lazy so the page loads less; virtualise the list so only visible rows are in the DOM. In Chapter 13, 5,000 doctors meant 37,715 DOM nodes and 2,770 ms to open at 4× CPU slowdown; virtualised, 608 ms — with costs: Ctrl+F and screen readers only see rendered rows.',
   'Một trang chậm với hàng nghìn mục. Bạn làm gì?',
   'Đo trước: chậm ở lần vẽ đầu, lúc lọc, hay lúc cuộn? Các lựa chọn theo cái giá: phân trang hoặc "xem thêm" (đơn giản nhất, thường là đủ); hoãn phần tốn kém bằng useDeferredValue hay useTransition để gõ phím vẫn mượt; chia mã bằng lazy để trang tải ít hơn; virtualize danh sách để chỉ hàng nhìn thấy nằm trong DOM. Ở Chương 13, 5.000 bác sĩ là 37.715 nút DOM và 2.770 ms để mở trang khi CPU chậm 4×; virtualize xong, 608 ms — kèm cái giá: Ctrl+F và trình đọc màn hình chỉ thấy hàng đã vẽ.',
   '/courses/react/learn?lessonSlug=rx-13-3-danh-sach-dai', 'Bài 12.2 · 13.3'],
  ['What do you test in a React app, and how?',
   'Behaviour the user relies on, through the UI the user sees: Testing Library queries by role and label, user-event for typing and clicking, MSW for the network so tests exercise the real fetching code. Test the booking flow, the error and empty states, the form validation, the custom hooks with renderHook. Do not test implementation details (state variable names, internal functions). Coverage is a floor, not a goal; a mutation (break the code on purpose) tells you if a test actually bites. End-to-end tests with Playwright cover a few critical paths.',
   'Bạn test gì trong app React, và test thế nào?',
   'Hành vi người dùng dựa vào, qua giao diện người dùng thấy: Testing Library tìm theo role và nhãn, user-event để gõ và bấm, MSW cho mạng để test chạy qua đúng mã lấy dữ liệu thật. Test luồng đặt lịch, trạng thái lỗi và rỗng, kiểm form, custom hook bằng renderHook. Đừng test chi tiết cài đặt (tên biến state, hàm nội bộ). Độ phủ là sàn, không phải đích; cố ý làm hỏng mã cho biết test có thật sự cắn không. Test đầu-cuối bằng Playwright phủ vài luồng sống còn.',
   '/courses/react/learn?lessonSlug=rx-9-4-phong-van', 'Bài 9.1 · 9.4'],
  ['How do you make a React app accessible and safe from XSS?',
   'Accessibility: real HTML elements (button, label, table), every input labelled, keyboard reachable with visible focus, ARIA only where HTML has no element (tabs, combobox), checked with axe and by using the page with the keyboard. XSS: React escapes everything inside braces, so text stays text; the danger is dangerouslySetInnerHTML (sanitise with DOMPurify and an allowlist right at the insertion), URLs from users (check the protocol), and direct DOM writes. A CSP is the second layer — this chapter measured an injected onerror blocked by it.',
   'Bạn làm app React dễ tiếp cận và an toàn trước XSS thế nào?',
   'Tiếp cận: dùng thẻ HTML thật (button, label, table), mọi ô nhập có nhãn, đi được bằng bàn phím với focus nhìn thấy, ARIA chỉ ở chỗ HTML không có thẻ (tabs, combobox), kiểm bằng axe và bằng cách dùng trang với bàn phím. XSS: React thoát ký tự mọi thứ trong ngoặc nhọn nên chữ vẫn là chữ; nguy hiểm nằm ở dangerouslySetInnerHTML (lọc bằng DOMPurify với danh sách trắng ngay tại chỗ chèn), URL của người dùng (kiểm giao thức), và ghi thẳng vào DOM. CSP là lớp thứ hai — chương này đo được một onerror bị chèn bị nó chặn.',
   '/courses/react/learn?lessonSlug=rx-13-4-bao-mat-i18n', 'Bài 8.4 · 13.4'],
  ['Walk me through authentication in your SPA.',
   'Sign-in returns a short-lived access token (kept in memory, sent as Bearer) and sets a long-lived refresh token in an HttpOnly, Secure, SameSite cookie. One HTTP layer attaches the token; on 401 it refreshes once — shared by all concurrent requests — and retries each once; auth endpoints are excluded. A failed refresh signs out. Route guards are UX; the server enforces access. Sign-out revokes on the server, clears every tab via BroadcastChannel and removes private caches. I measured the naive per-request refresh logging users out: 200, 401, 401.',
   'Kể cho tôi nghe xác thực trong SPA của bạn.',
   'Đăng nhập trả access token ngắn hạn (giữ trong bộ nhớ, gửi bằng Bearer) và đặt refresh token dài hạn trong cookie HttpOnly, Secure, SameSite. Một tầng HTTP gắn token; gặp 401 thì làm mới một lần — dùng chung cho mọi request đồng thời — rồi gửi lại mỗi request một lần; endpoint xác thực đứng ngoài. Làm mới hỏng thì đăng xuất. Cổng route là trải nghiệm; máy chủ mới thực thi quyền. Đăng xuất thu hồi ở máy chủ, xoá phiên ở mọi tab qua BroadcastChannel và gỡ cache riêng tư. Tôi đã đo bản làm mới theo từng request đá người dùng ra: 200, 401, 401.',
   '/courses/react/learn?lessonSlug=rx-14-1-xac-thuc', 'Bài 14.1'],
  ['How do you configure a Vite app per environment, and keep the bundle small?',
   'Environment files per mode (.env, .env.production, .env.demo; .local ones not committed), only VITE_ variables reach the browser and they are public — replaced as text at build time, so secrets stay on the backend and changes need a rebuild; typed in env.d.ts. For size: measure with a visualizer or source maps, lazy-load routes and heavy libraries, keep dev-only code (mocks, devtools) out through build-time constants, and guard it with a size budget in CI. In this app production dropped from 1,031 kB of JavaScript (with the mock server) to 601 kB.',
   'Bạn cấu hình app Vite theo môi trường thế nào, và giữ bundle nhỏ ra sao?',
   'File môi trường theo chế độ (.env, .env.production, .env.demo; các file .local không commit), chỉ biến VITE_ tới được trình duyệt và chúng công khai — được thay chữ lúc build, nên bí mật ở lại backend và đổi giá trị là build lại; có kiểu trong env.d.ts. Về kích thước: đo bằng visualizer hay source map, tải lười route và thư viện nặng, giữ mã chỉ dùng khi dev (mock, devtools) ngoài bản build bằng hằng số lúc build, và canh bằng ngân sách kích thước trong CI. Ở app này, production giảm từ 1.031 kB JavaScript (còn máy chủ giả) xuống 601 kB.',
   '/courses/react/learn?lessonSlug=rx-14-3-build-deploy', 'Bài 14.2 · 14.3'],
  ['What does your CI/CD pipeline look like?',
   'On every pull request: npm ci from the lockfile, type-check, unit and integration tests, production build, bundle budget; source maps uploaded to error reporting and removed. Only a green main deploys, automatically, with the commit id as the release, minimal permissions, and concurrency so a newer push cancels an older run. The server sets SPA fallback, cache headers and security headers, checked with curl. Rollback means redeploying the previous artifact. I verified the workflow schema and ran the exact steps on a clean clone: about 23 seconds.',
   'Pipeline CI/CD của bạn trông thế nào?',
   'Trên mọi pull request: npm ci từ lockfile, kiểm kiểu, test đơn vị và tích hợp, build production, ngân sách bundle; source map tải lên công cụ báo lỗi rồi xoá. Chỉ main xanh mới deploy, tự động, với mã commit làm phiên bản, quyền tối thiểu, và concurrency để lần push mới huỷ lần chạy cũ. Máy chủ đặt SPA fallback, header cache và header bảo mật, kiểm bằng curl. Rollback là deploy lại artifact trước. Tôi đã kiểm schema của workflow và chạy đúng các bước trên bản clone sạch: khoảng 23 giây.',
   '/courses/react/learn?lessonSlug=rx-14-3-build-deploy', 'Bài 10.4 · 14.3'],
];
const cauPv = (en) => CAU_PV.map(([qEn, aEn, qVi, aVi, href, bai], i) =>
  '<details><summary>' + (i + 1) + '. ' + (en ? qEn : qVi) + '</summary><p>' + H(en ? aEn : aVi) + '</p><p><em>' + (en ? 'Review: ' : 'Ôn lại: ') + '<a href="' + href + '">' + bai + '</a></em></p></details>').join('\n');

const L4 = {
    title: '14.4 — Production checklist, middle-level interview checklist, 15 questions|||14.4 — Checklist production, checklist phỏng vấn middle và 15 câu kèm ý trả lời',
    slug: 'rx-14-4-phong-van',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Tổng kết cả khoá thành việc làm được: checklist trước khi lên production (mỗi dòng một cách kiểm), React middle khác junior ở đâu, khung trả lời phỏng vấn bằng số đo của chính dự án, 15 câu hỏi hay gặp kèm ý trả lời và bài để ôn, và bước cuối của dự án đặt lịch: README, npm run kiem, tự chấm.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4</span>
<h2>From "I finished a course" to "I can do this job": checklists and 15 interview questions</h2>
<p class="lead">You have built one application end to end: 15 chapters, 208 tests, a real session with token refresh, measured performance, a CI pipeline. This last lesson turns that work into two things you can use next week. A <strong>production checklist</strong> — what must be true before real users touch an app, each line with the command or test that proves it. And an <strong>interview kit</strong> — what a middle-level React developer is expected to know, a way to answer that uses your own measurements, and 15 questions with model answers that point back to the lesson where you did it.</p>
<p>After this lesson comes the <strong>final exam</strong>: 20 situations across the whole course, 30 minutes.</p>

<h3>The production checklist</h3>
${slide('rx-14', 22, 'Production checklist: every line can be checked')}
<p>A checklist is only useful if every line can be answered with "yes, here is the proof". This one is written for the clinic app, but the lines apply to any React SPA:</p>
<table>
<thead><tr><th>Area</th><th>Must be true</th><th>How to prove it</th><th>Where</th></tr></thead>
<tbody>
<tr><td>Session</td><td>access token only in memory; refresh token only in an HttpOnly cookie</td><td><code>localStorage</code> has no token; <code>document.cookie</code> is empty</td><td>14.1</td></tr>
<tr><td>401</td><td>one shared refresh, one retry, auth endpoints excluded</td><td>test: 3 concurrent 401 → 1 refresh</td><td>14.1</td></tr>
<tr><td>Sign-out</td><td>revoked on the server, all tabs, private cache cleared</td><td>test: next user sees nothing of the previous one</td><td>14.1</td></tr>
<tr><td>Network</td><td>timeout, capped retry with jitter, offline banner</td><td>tests for <code>LoiMang</code>, <code>paused</code>, 503 → 200</td><td>14.2</td></tr>
<tr><td>Writes</td><td>no double booking on retry</td><td>test: same Idempotency-Key → one appointment</td><td>14.2</td></tr>
<tr><td>Errors</td><td>every unexpected error reported with the version</td><td>test with an injected receiver; dashboard of the reporter</td><td>14.2</td></tr>
<tr><td>Config</td><td>no secret in <code>VITE_*</code>; env typed</td><td><code>grep</code> the build output; <code>tsc -b</code></td><td>14.2</td></tr>
<tr><td>Bundle</td><td>no mocks or devtools; budget in CI</td><td><code>npm run kiem</code>; visualizer</td><td>14.3</td></tr>
<tr><td>Headers</td><td>CSP and friends on every response; maps not public</td><td><code>curl -sI</code> on HTML and on <code>/assets/</code></td><td>14.3</td></tr>
<tr><td>Serving</td><td>SPA fallback, 1-year cache for hashed files, no-cache for <code>index.html</code>, old tabs recover</td><td>deep link + F5; <code>curl -sI</code></td><td>10.4</td></tr>
<tr><td>Quality</td><td>tests green, coverage floor, axe clean, keyboard usable</td><td>CI; axe tests</td><td>8.4 · 9.4</td></tr>
<tr><td>Pipeline</td><td>every PR checked, only green main deploys</td><td>a red PR cannot merge</td><td>14.3</td></tr>
</tbody></table>
<p>Two lines are deliberately missing because they are not frontend decisions alone: HTTPS with HSTS (the host or load balancer) and backups (the backend). Mention them when asked "what else?" — it shows you know where your part ends.</p>

<h3>What "middle" means</h3>
${slide('rx-14', 23, 'Middle: owns a feature end to end, from API to deploy')}
<p>Job titles differ between companies, but the expectation behind "middle" (also "mid-level", or Junior+ to Middle in Vietnamese job posts) is consistent: <strong>you can take a feature from a ticket to production without someone checking every step</strong>. Not "knows every API", but "knows why, knows how to find out, and does not break things quietly". The table compares answers to the same topic:</p>
<table>
<thead><tr><th>Topic</th><th>Junior answer</th><th>Middle answer</th></tr></thead>
<tbody>
<tr><td>Render and state</td><td>"useState stores values, useEffect runs after render"</td><td>why a component re-renders, where each piece of state lives, when an effect is the wrong tool</td></tr>
<tr><td>Data</td><td>fetch in useEffect with a loading flag</td><td>server-state cache, invalidation, optimistic updates, races, cancellation</td></tr>
<tr><td>Performance</td><td>"I add useMemo to make it fast"</td><td>measures with the Profiler, then memo / lazy / defer / virtualise, knows the costs</td></tr>
<tr><td>Quality</td><td>"I tested it in the browser"</td><td>behaviour tests with MSW, a11y checks, CI that fails when something breaks</td></tr>
<tr><td>Production</td><td><code>npm run build</code></td><td>auth and 401, network failures, env, bundle, headers, deploy, error reporting</td></tr>
<tr><td>Working with people</td><td>does the ticket as written</td><td>asks what the ticket really needs, estimates, explains trade-offs, reviews others' code</td></tr>
</tbody></table>
<p>Interviews for middle roles in Vietnam usually follow the same steps. Knowing them lets you prepare each separately:</p>
${SD.phongVanEn}

<h3>How to answer: point, mechanism, number, trade-off</h3>
${slide('rx-14', 24, 'Answer with a frame: main point, mechanism, measurement, trade-off')}
<p>Most failed answers are not wrong — they are unstructured: a list of keywords, or a story with no conclusion. A frame that works for nearly every technical question:</p>
${SD.traLoiEn}
<ol>
<li><strong>The main point in one sentence.</strong> The interviewer should know your answer after ten seconds.</li>
<li><strong>The mechanism.</strong> Why it is true — this is where you show understanding instead of memory.</li>
<li><strong>A real example with a number.</strong> This course gave you many: 200/401/401 for the naive refresh, 37,715 DOM nodes and 2,770 → 608 ms for virtualisation, 1,031 → 601 kB without MSW, 0/4 headers with the wrong nginx config, 3 CSP violations from Zod. Numbers are proof you did it.</li>
<li><strong>The trade-off, and when not to.</strong> Every technique costs something. Saying what it costs is the clearest signal of seniority.</li>
</ol>
<p>Then stop, and ask back if it fits: "In your project, is the API on the same domain?" A question back turns a quiz into a conversation.</p>

<h3>Run it step by step</h3>
<p>Take question 13 below — "walk me through authentication in your SPA" — and build the answer with the frame:</p>
<ol>
<li><strong>Point:</strong> "Short-lived access token in memory, long-lived refresh token in an HttpOnly cookie, and one HTTP layer that refreshes on 401."</li>
<li><strong>Mechanism:</strong> XSS can read <code>localStorage</code> and send a token away; it cannot read an HttpOnly cookie; SameSite stops other sites from using the cookie.</li>
<li><strong>Number:</strong> "When three requests got 401 at once, refreshing per request with rotating tokens gave 200, 401, 401 and signed the user out. A shared promise fixed it: one refresh, all three retried."</li>
<li><strong>Trade-off:</strong> one extra request after every reload; the API must be same-site or allow credentials; a second tab can still race, which a server grace period or Web Locks solves.</li>
<li><strong>Ask back:</strong> "Do you use rotating refresh tokens?"</li>
</ol>
<p>Ninety seconds, and every sentence is something you built and measured.</p>

<h3>15 questions you will meet, with answers</h3>
${slide('rx-14', 25, 'The 15 interview questions of Lesson 14.4 span the whole course')}
<p>Try to answer each one aloud with the frame above <em>before</em> opening it. Each answer ends with the lesson to review.</p>
${cauPv(true)}

<div class="pitfall co-tieu-de"><strong>Trap — memorising answers.</strong> Interviewers follow up: "why?", "what if the API is on another domain?", "what did it cost?". A memorised paragraph collapses at the second question; an answer built from something you did survives it. That is why every answer above points back to a lesson where you measured it — review the lesson, not the paragraph.</div>

<h3>Your project is your story</h3>
${slide('rx-14', 26, 'Common mistakes in Chapter 14')}
<p>"Tell me about a project" is the most predictable question, and the clinic app is a strong answer if you present it as work, not as a course exercise. Use the STAR shape (Situation, Task, Action, Result) and put a number in the Result:</p>
<ul>
<li><strong>Situation:</strong> a clinic booking app — doctors, time slots, bookings, reschedule, cancel, two languages.</li>
<li><strong>Task:</strong> make it production-ready: real sign-in, resilient to a flaky API, measured and guarded bundle, automated deploy.</li>
<li><strong>Action:</strong> pick one story, e.g. the sign-out bug: "a test showed the next user seeing the previous user's appointments because the query cache survived sign-out".</li>
<li><strong>Result:</strong> "fixed by removing private queries on sign-out; 208 tests, CI with a size budget of 140 kB gzip, first load 129.6 kB".</li>
</ul>
<p>The slide above lists the mistakes this chapter measured — each one is also a story. And the repository must speak for itself when nobody is there to explain it: a README that says what the app does, how to run it, which choices were made and why.</p>
${pre('markdown', SN.readme)}
<div class="pitfall co-tieu-de"><strong>Trap — a portfolio repo with the Vite template README.</strong> A recruiter opens your GitHub link for thirty seconds. "React + TypeScript + Vite — This template provides a minimal setup…" says you did not finish. Replace it, pin the repository, put the demo link at the top, and make sure the demo's sample account is written down.</div>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202 the goal is to pass the practical exam: a set of screens that match the requirements, demonstrated on your laptop, graded against a rubric; interview preparation, if any, is a list of definitions ("what is the virtual DOM"). → At work, and in interviews for it, the question is whether you can own a feature: define "done" with a checklist, prove each point with a test or a command, explain trade-offs with numbers, and ship through a pipeline. · <em>Why:</em> an exam rewards having the right screens once; a job rewards keeping them right while ten people change the code. Your FER202 projects still count — present them with the same frame: what you built, what broke, how you knew, what you would change now.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "What would you check before releasing this app to real users?"</p>
<p>Walk the checklist by risk, not by order: data safety first (session, sign-out, private caches, no secrets in the bundle), then failure behaviour (timeouts, retries only where safe, idempotent writes, error reporting with versions), then delivery (production build without mocks, size budget, security headers checked with curl, SPA fallback and caching), then the pipeline (every PR checked, only green main deploys, rollback plan). Name the proof for each, and name what is outside the frontend: HTTPS/HSTS, backups, monitoring of the API.</p></div>

<h3>🛠 Keep building the project — step 4/4: finish and self-assess</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after 14.3 (205+ tests, <code>ci.yml</code>, nginx configs).</p><ol>
<li>Replace <code>README.md</code> with your own version of the one above: what, demo link, sample account, stack with reasons, how to run, env variables, architecture, CI/CD.</li>
<li>Run <code>npm run kiem</code> (the same checks as CI) and <code>npx vitest run --coverage</code>.</li>
<li>Go through the production checklist; for every line write the proof (test name or command) in a <code>CHECKLIST.md</code> or in the README.</li>
<li>Answer the 15 questions aloud, recording yourself; for each, write down the number from your own project you used.</li>
<li>(Needs a GitHub account) push to a new repository, enable Pages with "GitHub Actions" as source, and check the demo link and a deep link.</li>
</ol>
<p><strong>Done when:</strong> the final run matches (or improves on) this one:</p>
${out(OUT.cuoi)}
<p>…and every checklist line has a proof next to it.</p></div>
<details><summary>Solution</summary>
<p>The reference project after this chapter is saved as <code>sau-ch14</code>: 48 test files, 208 tests, the README above, <code>.github/workflows/ci.yml</code>, <code>deploy/nginx-bao-mat.conf</code>, and the measurement scripts in <code>do/</code>. Across the chapter, these tests were added: <code>src/shared/api/http.test.ts</code> (8), <code>src/app/phien.test.tsx</code> (3), <code>src/app/do-ben.test.tsx</code> (11), <code>src/vi-du/ch14/lam-moi-ngay-tho.test.ts</code> (1) and 4 more cases in <code>query-client.test.ts</code> — 181 → 208. Two older tests changed their expectations on purpose (the login form now asks for a password; a 500 now shows the generic sentence).</p>
<p>⏳ Not run for real: the GitHub push and Pages deploy of step 5 (no GitHub account used on this machine).</p>
<!-- CHAY-O-MAY: push dự án sau-ch14 lên GitHub, bật Pages, xác nhận run CI xanh và link demo + deep link chạy -->
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> a mock interview with yourself.</p><ol>
<li>Pick three questions from the list, one from each of "Fundamentals", "Data" and "Production". Set a 2-minute timer per question.</li>
<li>Answer aloud with the four-step frame, recording on your phone. Do not open the model answer first.</li>
<li>Listen back and mark: did you state the point in the first sentence? Did you give a number? Did you say a trade-off?</li>
<li>Now open the model answer and write one sentence you will add next time.</li>
</ol><p><strong>Done when:</strong> you have three recordings under two minutes each, and for each a checklist with the three marks (point first, a number, a trade-off) — at least two of three ticked on every answer.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">production readiness</span><span class="v">the set of conditions an app must meet before real users — each provable</span></div>
<div class="kv"><span class="k">checklist</span><span class="v">list of must-be-true items, each with how to check it</span></div>
<div class="kv"><span class="k">middle / mid-level</span><span class="v">developer who owns a feature from ticket to production without step-by-step supervision</span></div>
<div class="kv"><span class="k">trade-off</span><span class="v">what a choice costs; naming it is a sign of seniority</span></div>
<div class="kv"><span class="k">STAR</span><span class="v">Situation, Task, Action, Result — a shape for telling a project story</span></div>
<div class="kv"><span class="k">live coding</span><span class="v">interview round where you write code while explaining, usually a component with a test</span></div>
<div class="kv"><span class="k">portfolio</span><span class="v">public repositories and demos that show your work; the README is its front page</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A production checklist is useful only when each line has a proof — a test, a command, a measurement.</li>
<li>Middle means owning a feature end to end: data, failure, performance, quality, delivery, and explaining the trade-offs.</li>
<li>Answer with point → mechanism → number → trade-off, then ask back; your numbers come from this project.</li>
<li>The 15 questions cover render, keys, immutability, effects, state placement, stores, server state, races, memoisation, long lists, testing, a11y and XSS, auth, env and bundle, CI/CD.</li>
<li>The project is your story (STAR with a number) and its README is your front page.</li>
<li>Next: the final exam — 20 questions, 30 minutes, from Section 0 to Chapter 14.</li>
</ul>

${LINK('https://react.dev/learn', '📘', 'react.dev — Learn React', 'The reference to reread before an interview.')}
${LINK('https://roadmap.sh/react', '🗺', 'roadmap.sh — React', 'A map of topics to check your coverage.')}
${LINK_TRONG('/courses/nextjs', '▲', 'Learn next — Next.js', 'The React framework: server components, server actions, routing, deploy (Chapter 20).')}
${LINK_TRONG('/courses/testing', '🧪', 'Learn next — Testing', 'Deeper testing: strategy, end-to-end, contract tests.')}
${LINK_TRONG('/courses/github-actions', '⚙', 'Learn next — GitHub Actions', 'The CI/CD tool of Lesson 14.3, in depth.')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4</span>
<h2>Từ "tôi học xong một khoá" tới "tôi làm được việc này": checklist và 15 câu phỏng vấn</h2>
<p class="lead">Bạn đã dựng một ứng dụng từ đầu tới cuối: 15 chương, 208 test, một phiên đăng nhập thật có làm mới token, hiệu năng đo thật, một pipeline CI. Bài cuối này biến công sức đó thành hai thứ dùng được ngay tuần sau. Một <strong>checklist production</strong> — những gì phải đúng trước khi người dùng thật chạm vào app, mỗi dòng kèm lệnh hoặc test chứng minh. Và một <strong>bộ đồ nghề phỏng vấn</strong> — một lập trình viên React mức middle cần biết gì, một cách trả lời dùng chính số đo của bạn, và 15 câu hỏi kèm ý trả lời, mỗi câu trỏ về bài bạn đã làm việc đó.</p>
<p>Sau bài này là <strong>bài thi cuối khoá</strong>: 20 tình huống trải khắp khoá học, 30 phút.</p>

<h3>Checklist production</h3>
${slide('rx-14', 22, 'Checklist production: mỗi dòng đều kiểm được')}
<p>Một checklist chỉ có ích khi mọi dòng trả lời được bằng "đúng, đây là bằng chứng". Checklist này viết cho app phòng khám, nhưng các dòng áp được cho mọi SPA React:</p>
<table>
<thead><tr><th>Mảng</th><th>Phải đúng</th><th>Chứng minh bằng</th><th>Ở đâu</th></tr></thead>
<tbody>
<tr><td>Phiên</td><td>access token chỉ trong bộ nhớ; refresh token chỉ trong cookie HttpOnly</td><td><code>localStorage</code> không có token; <code>document.cookie</code> rỗng</td><td>14.1</td></tr>
<tr><td>401</td><td>một lần làm mới dùng chung, gửi lại một lần, endpoint xác thực đứng ngoài</td><td>test: 3 lần 401 đồng thời → 1 lần làm mới</td><td>14.1</td></tr>
<tr><td>Đăng xuất</td><td>thu hồi ở máy chủ, mọi tab, dọn cache riêng tư</td><td>test: người sau không thấy gì của người trước</td><td>14.1</td></tr>
<tr><td>Mạng</td><td>hết giờ, thử lại có trần kèm jitter, dải báo mất mạng</td><td>test cho <code>LoiMang</code>, <code>paused</code>, 503 → 200</td><td>14.2</td></tr>
<tr><td>Lệnh ghi</td><td>không đặt trùng khi thử lại</td><td>test: cùng Idempotency-Key → một lịch hẹn</td><td>14.2</td></tr>
<tr><td>Lỗi</td><td>mọi lỗi bất ngờ được báo kèm phiên bản</td><td>test với người nhận cắm vào; dashboard của dịch vụ báo lỗi</td><td>14.2</td></tr>
<tr><td>Cấu hình</td><td>không bí mật trong <code>VITE_*</code>; env có kiểu</td><td><code>grep</code> bản build; <code>tsc -b</code></td><td>14.2</td></tr>
<tr><td>Bundle</td><td>không mock, không devtools; ngân sách trong CI</td><td><code>npm run kiem</code>; visualizer</td><td>14.3</td></tr>
<tr><td>Header</td><td>CSP và các header khác trên mọi câu trả lời; map không công khai</td><td><code>curl -sI</code> cả HTML lẫn <code>/assets/</code></td><td>14.3</td></tr>
<tr><td>Phục vụ</td><td>SPA fallback, cache 1 năm cho file có mã băm, no-cache cho <code>index.html</code>, tab cũ tự hồi phục</td><td>deep link + F5; <code>curl -sI</code></td><td>10.4</td></tr>
<tr><td>Chất lượng</td><td>test xanh, sàn độ phủ, axe sạch, dùng được bằng bàn phím</td><td>CI; test axe</td><td>8.4 · 9.4</td></tr>
<tr><td>Pipeline</td><td>mọi PR được kiểm, chỉ main xanh mới deploy</td><td>PR đỏ không merge được</td><td>14.3</td></tr>
</tbody></table>
<p>Hai dòng cố ý vắng mặt vì chúng không phải quyết định của riêng frontend: HTTPS kèm HSTS (host hoặc bộ cân bằng tải) và sao lưu (backend). Nhắc tới chúng khi bị hỏi "còn gì nữa?" — nó cho thấy bạn biết phần việc của mình kết thúc ở đâu.</p>

<h3>"Middle" nghĩa là gì</h3>
${slide('rx-14', 23, 'Middle: tự làm trọn một tính năng, từ API tới deploy')}
<p>Tên chức danh mỗi công ty một khác, nhưng kỳ vọng đằng sau "middle" (tin tuyển dụng hay ghi Junior+ tới Middle) khá thống nhất: <strong>bạn đưa được một tính năng từ ticket tới production mà không cần ai kiểm từng bước</strong>. Không phải "biết mọi API", mà là "biết vì sao, biết cách tìm ra, và không làm hỏng thứ gì một cách lặng lẽ". Bảng so sánh câu trả lời cho cùng một chủ đề:</p>
<table>
<thead><tr><th>Chủ đề</th><th>Junior trả lời</th><th>Middle trả lời</th></tr></thead>
<tbody>
<tr><td>Render và state</td><td>"useState lưu giá trị, useEffect chạy sau render"</td><td>vì sao component render lại, mỗi mẩu state sống ở đâu, khi nào effect là công cụ sai</td></tr>
<tr><td>Dữ liệu</td><td>fetch trong useEffect kèm cờ đang tải</td><td>cache state máy chủ, invalidate, cập nhật lạc quan, race, huỷ request</td></tr>
<tr><td>Hiệu năng</td><td>"em thêm useMemo cho nhanh"</td><td>đo bằng Profiler, rồi mới memo / lazy / hoãn / virtualize, biết cái giá</td></tr>
<tr><td>Chất lượng</td><td>"em test trên trình duyệt rồi"</td><td>test hành vi với MSW, kiểm a11y, CI đỏ khi có gì hỏng</td></tr>
<tr><td>Production</td><td><code>npm run build</code></td><td>xác thực và 401, lỗi mạng, env, bundle, header, deploy, báo lỗi</td></tr>
<tr><td>Làm việc với người</td><td>làm đúng như ticket ghi</td><td>hỏi ticket thật sự cần gì, ước lượng, giải thích đánh đổi, review mã người khác</td></tr>
</tbody></table>
<p>Phỏng vấn vị trí middle ở Việt Nam thường đi qua cùng các bước. Biết trước thì chuẩn bị riêng được cho từng vòng:</p>
${SD.phongVanVi}

<h3>Cách trả lời: ý chính, cơ chế, con số, đánh đổi</h3>
${slide('rx-14', 24, 'Trả lời theo khung: ý chính, cơ chế, số đo, đánh đổi')}
<p>Phần lớn câu trả lời trượt không phải vì sai — mà vì không có cấu trúc: một chuỗi từ khoá, hoặc một câu chuyện không có kết luận. Một khung dùng được cho gần như mọi câu hỏi kỹ thuật:</p>
${SD.traLoiVi}
<ol>
<li><strong>Ý chính trong một câu.</strong> Người phỏng vấn phải biết câu trả lời của bạn sau mười giây.</li>
<li><strong>Cơ chế.</strong> Vì sao nó đúng — đây là chỗ bạn cho thấy hiểu chứ không phải thuộc.</li>
<li><strong>Một ví dụ thật có con số.</strong> Khoá học cho bạn rất nhiều: 200/401/401 của bản làm mới ngây thơ, 37.715 nút DOM và 2.770 → 608 ms khi virtualize, 1.031 → 601 kB khi bỏ MSW, 0/4 header với cấu hình nginx sai, 3 vi phạm CSP do Zod. Con số là bằng chứng bạn đã làm.</li>
<li><strong>Đánh đổi, và khi nào không nên.</strong> Mọi kỹ thuật đều có giá. Nói ra cái giá là tín hiệu rõ nhất của kinh nghiệm.</li>
</ol>
<p>Rồi dừng lại, và hỏi ngược nếu hợp: "Trong dự án của anh chị, API có cùng tên miền không?" Một câu hỏi ngược biến buổi hỏi bài thành một cuộc trò chuyện.</p>

<h3>Chạy thử từng bước</h3>
<p>Lấy câu 13 bên dưới — "kể cho tôi nghe xác thực trong SPA của bạn" — và dựng câu trả lời theo khung:</p>
<ol>
<li><strong>Ý chính:</strong> "Access token ngắn hạn trong bộ nhớ, refresh token dài hạn trong cookie HttpOnly, và một tầng HTTP tự làm mới khi gặp 401."</li>
<li><strong>Cơ chế:</strong> XSS đọc được <code>localStorage</code> và gửi token đi; nó không đọc được cookie HttpOnly; SameSite ngăn site khác dùng cookie.</li>
<li><strong>Con số:</strong> "Khi ba request cùng nhận 401, làm mới theo từng request với token xoay vòng cho ra 200, 401, 401 và đá người dùng ra. Một promise dùng chung sửa được: một lần làm mới, cả ba được gửi lại."</li>
<li><strong>Đánh đổi:</strong> thêm một request sau mỗi lần tải lại; API phải cùng site hoặc cho phép credentials; tab thứ hai vẫn có thể giẫm chân, giải bằng khoảng ân hạn ở máy chủ hoặc Web Locks.</li>
<li><strong>Hỏi ngược:</strong> "Bên mình có dùng refresh token xoay vòng không ạ?"</li>
</ol>
<p>Chín mươi giây, và câu nào cũng là thứ bạn đã dựng và đã đo.</p>

<h3>15 câu bạn sẽ gặp, kèm ý trả lời</h3>
${slide('rx-14', 25, '15 câu phỏng vấn của bài 14.4 rải khắp khoá')}
<p>Thử trả lời từng câu thành tiếng theo khung ở trên <em>trước khi</em> mở ra. Mỗi ý trả lời kết thúc bằng bài cần ôn.</p>
${cauPv(false)}

<div class="pitfall co-tieu-de"><strong>Bẫy — học thuộc câu trả lời.</strong> Người phỏng vấn sẽ hỏi tiếp: "vì sao?", "nếu API ở tên miền khác thì sao?", "nó tốn gì?". Một đoạn văn học thuộc sụp ở câu hỏi thứ hai; một câu trả lời dựng từ việc bạn đã làm thì đứng vững. Vì thế mỗi ý trả lời ở trên đều trỏ về bài bạn đã đo nó — ôn bài, đừng ôn đoạn văn.</div>

<h3>Dự án là câu chuyện của bạn</h3>
${slide('rx-14', 26, 'Sai lầm hay gặp ở Chương 14')}
<p>"Kể về một dự án của bạn" là câu dễ đoán nhất, và app phòng khám là một câu trả lời mạnh nếu bạn trình bày nó như một việc thật, không như bài tập khoá học. Dùng khung STAR (Situation – bối cảnh, Task – nhiệm vụ, Action – hành động, Result – kết quả) và đặt một con số vào Result:</p>
<ul>
<li><strong>Bối cảnh:</strong> app đặt lịch phòng khám — bác sĩ, khung giờ, đặt, đổi giờ, huỷ lịch, hai ngôn ngữ.</li>
<li><strong>Nhiệm vụ:</strong> đưa nó tới mức sẵn sàng production: đăng nhập thật, chịu được API chập chờn, bundle được đo và canh, deploy tự động.</li>
<li><strong>Hành động:</strong> chọn một câu chuyện, vd con bug đăng xuất: "một test cho thấy người dùng sau thấy lịch hẹn của người trước vì cache query còn sống sau khi đăng xuất".</li>
<li><strong>Kết quả:</strong> "sửa bằng cách gỡ query riêng tư khi đăng xuất; 208 test, CI có ngân sách 140 kB gzip, tải đầu 129,6 kB".</li>
</ul>
<p>Slide ở trên liệt kê các sai lầm chương này đã đo — mỗi cái cũng là một câu chuyện. Và repo phải tự nói được khi không có ai đứng cạnh giải thích: một README nói app làm gì, chạy thế nào, đã chọn gì và vì sao.</p>
${pre('markdown', SN.readme)}
<div class="pitfall co-tieu-de"><strong>Bẫy — repo portfolio còn nguyên README của template Vite.</strong> Nhà tuyển dụng mở link GitHub của bạn trong ba mươi giây. "React + TypeScript + Vite — This template provides a minimal setup…" nói rằng bạn chưa làm xong. Thay nó đi, ghim repo lên trang cá nhân, đặt link demo ở đầu, và ghi rõ tài khoản mẫu của bản demo.</div>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202 mục tiêu là qua bài thi thực hành: một bộ màn hình đúng yêu cầu, demo trên laptop của bạn, chấm theo rubric; chuẩn bị phỏng vấn, nếu có, là một danh sách định nghĩa ("virtual DOM là gì"). → Đi làm, và khi phỏng vấn để đi làm, câu hỏi là bạn có tự gánh được một tính năng không: định nghĩa "xong" bằng checklist, chứng minh từng dòng bằng test hay lệnh, giải thích đánh đổi bằng con số, và ship qua một pipeline. · <em>Vì sao:</em> bài thi thưởng cho việc có đúng màn hình một lần; công việc thưởng cho việc giữ chúng đúng trong khi mười người cùng sửa mã. Đồ án FER202 của bạn vẫn có giá trị — trình bày chúng bằng cùng khung: đã dựng gì, cái gì hỏng, làm sao biết, giờ bạn sẽ đổi gì.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Trước khi phát hành app này cho người dùng thật, bạn kiểm những gì?"</p>
<p>Đi checklist theo rủi ro, không theo thứ tự: an toàn dữ liệu trước (phiên, đăng xuất, cache riêng tư, không bí mật trong bundle), rồi hành vi khi hỏng (hết giờ, chỉ thử lại chỗ an toàn, lệnh ghi idempotent, báo lỗi kèm phiên bản), rồi phần giao (build production không mock, ngân sách kích thước, header bảo mật kiểm bằng curl, SPA fallback và cache), rồi pipeline (mọi PR được kiểm, chỉ main xanh mới deploy, kế hoạch rollback). Nói ra bằng chứng cho từng dòng, và nói ra cái gì nằm ngoài frontend: HTTPS/HSTS, sao lưu, giám sát API.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 4/4: hoàn thiện và tự chấm</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau 14.3 (hơn 205 test, <code>ci.yml</code>, cấu hình nginx).</p><ol>
<li>Thay <code>README.md</code> bằng bản của riêng bạn theo mẫu ở trên: app làm gì, link demo, tài khoản mẫu, công nghệ kèm lý do, cách chạy, biến môi trường, kiến trúc, CI/CD.</li>
<li>Chạy <code>npm run kiem</code> (đúng các phép kiểm của CI) và <code>npx vitest run --coverage</code>.</li>
<li>Đi hết checklist production; với mỗi dòng ghi bằng chứng (tên test hoặc lệnh) vào <code>CHECKLIST.md</code> hoặc vào README.</li>
<li>Trả lời 15 câu thành tiếng, tự ghi âm; với mỗi câu ghi lại con số từ chính dự án của bạn đã dùng.</li>
<li>(Cần tài khoản GitHub) push lên một repo mới, bật Pages với nguồn "GitHub Actions", kiểm link demo và một deep link.</li>
</ol>
<p><strong>Đạt khi:</strong> lần chạy cuối khớp (hoặc tốt hơn) lần này:</p>
${out(OUT.cuoi)}
<p>…và mọi dòng checklist đều có bằng chứng bên cạnh.</p></div>
<details><summary>Lời giải</summary>
<p>Dự án mẫu sau chương này lưu thành <code>sau-ch14</code>: 48 file test, 208 test, README ở trên, <code>.github/workflows/ci.yml</code>, <code>deploy/nginx-bao-mat.conf</code>, và các script đo trong <code>do/</code>. Cả chương thêm các test: <code>src/shared/api/http.test.ts</code> (8), <code>src/app/phien.test.tsx</code> (3), <code>src/app/do-ben.test.tsx</code> (11), <code>src/vi-du/ch14/lam-moi-ngay-tho.test.ts</code> (1) và thêm 4 ca trong <code>query-client.test.ts</code> — 181 → 208. Hai test cũ đổi kỳ vọng có chủ đích (form đăng nhập giờ hỏi mật khẩu; lỗi 500 giờ hiện câu chung).</p>
<p>⏳ Chưa chạy thật: push lên GitHub và deploy Pages ở bước 5 (máy này không dùng tài khoản GitHub).</p>
<!-- CHAY-O-MAY: push dự án sau-ch14 lên GitHub, bật Pages, xác nhận run CI xanh và link demo + deep link chạy -->
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề:</strong> tự phỏng vấn chính mình.</p><ol>
<li>Chọn ba câu trong danh sách, mỗi nhóm một câu: "Nền tảng", "Dữ liệu" và "Production". Hẹn giờ 2 phút mỗi câu.</li>
<li>Trả lời thành tiếng theo khung bốn bước, ghi âm bằng điện thoại. Đừng mở ý trả lời mẫu trước.</li>
<li>Nghe lại và đánh dấu: có nói ý chính ở câu đầu không? Có đưa con số không? Có nói đánh đổi không?</li>
<li>Giờ mới mở ý trả lời mẫu và ghi một câu bạn sẽ thêm lần sau.</li>
</ol><p><strong>Đạt khi:</strong> bạn có ba bản ghi âm, mỗi bản dưới hai phút, và với mỗi bản một checklist ba dấu (ý chính trước, có con số, có đánh đổi) — mỗi câu trả lời được ít nhất hai trên ba dấu.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">production readiness</span><span class="v">sẵn sàng production: bộ điều kiện app phải đạt trước khi có người dùng thật — mỗi điều chứng minh được</span></div>
<div class="kv"><span class="k">checklist</span><span class="v">danh sách những điều phải đúng, mỗi điều kèm cách kiểm</span></div>
<div class="kv"><span class="k">middle / mid-level</span><span class="v">lập trình viên tự gánh một tính năng từ ticket tới production, không cần kèm từng bước</span></div>
<div class="kv"><span class="k">trade-off (đánh đổi)</span><span class="v">cái giá của một lựa chọn; nói được nó là dấu hiệu của kinh nghiệm</span></div>
<div class="kv"><span class="k">STAR</span><span class="v">Situation, Task, Action, Result — khung kể một câu chuyện dự án</span></div>
<div class="kv"><span class="k">live coding</span><span class="v">vòng phỏng vấn viết mã trong lúc giải thích, thường là một component kèm test</span></div>
<div class="kv"><span class="k">portfolio</span><span class="v">repo và bản demo công khai cho thấy việc bạn làm; README là trang bìa của nó</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Checklist production chỉ có ích khi mỗi dòng có bằng chứng — một test, một lệnh, một số đo.</li>
<li>Middle nghĩa là tự gánh một tính năng từ đầu tới cuối: dữ liệu, lúc hỏng, hiệu năng, chất lượng, giao hàng, và giải thích được đánh đổi.</li>
<li>Trả lời theo ý chính → cơ chế → con số → đánh đổi, rồi hỏi ngược; con số lấy từ chính dự án này.</li>
<li>15 câu phủ render, key, bất biến, effect, chỗ đặt state, store, state máy chủ, race, memo, danh sách dài, test, a11y và XSS, xác thực, env và bundle, CI/CD.</li>
<li>Dự án là câu chuyện của bạn (STAR có con số) và README là trang bìa của nó.</li>
<li>Tiếp theo: bài thi cuối khoá — 20 câu, 30 phút, từ Mục 0 tới Chương 14.</li>
</ul>

${LINK('https://react.dev/learn', '📘', 'react.dev — Learn React', 'Tài liệu nên đọc lại trước buổi phỏng vấn.')}
${LINK('https://roadmap.sh/react', '🗺', 'roadmap.sh — React', 'Bản đồ chủ đề để kiểm mình còn hổng đâu.')}
${LINK_TRONG('/courses/nextjs', '▲', 'Học tiếp — Next.js', 'Framework của React: server component, server action, định tuyến, deploy (Chương 20).')}
${LINK_TRONG('/courses/testing', '🧪', 'Học tiếp — Testing', 'Test sâu hơn: chiến lược, đầu-cuối, contract test.')}
${LINK_TRONG('/courses/github-actions', '⚙', 'Học tiếp — GitHub Actions', 'Công cụ CI/CD của Bài 14.3, thật sâu.')}
</div>
`,
};

const Q = {
    title: '14.5 — Final course exam: 20 questions from Section 0 to Chapter 14|||14.5 — Thi cuối khoá: 20 câu từ Mục 0 tới Chương 14',
    slug: 'rx-14-5-thi-cuoi-khoa',
    type: 'QUIZ',
    isFreePreview: true,
    description: 'Bài thi cuối khoá React: 20 câu tình huống trải từ JSX và JavaScript ở Mục 0 tới xác thực, lỗi mạng, build và deploy ở Chương 14, 30 phút, mỗi câu có giải thích vì sao đúng, vì sao phương án hấp dẫn nhất sai, và bài để ôn lại.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Final exam</span>
<h2>Final exam of the React course</h2>
<p class="lead">Twenty situations from the whole course — the clinic booking app you built, from the first JSX in Section 0 to the CI pipeline in Chapter 14. Most questions show code or something that happened and ask what the screen, the test, the browser or the server does. 30 minutes. Every answer comes with an explanation and the lesson to review.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain what JSX becomes, why components must be pure, and why lists need stable keys.</li>
<li>I can update state immutably, decide where state lives, and tell when an effect is the wrong tool.</li>
<li>I can fetch, cache and mutate server data with TanStack Query and handle loading, error and empty states.</li>
<li>I can structure routes and features, measure before optimising, and test behaviour with Testing Library and MSW.</li>
<li>I can explain reconciliation, keys as identity, Suspense and transitions, and the patterns of Chapter 13.</li>
<li>I can keep tokens safely, refresh on 401 once, handle network failures, and build and deploy with CI.</li>
</ul>
${slide('rx-14', 27, 'Chapter 14 cheat sheet')}
${slide('rx-14', 29, 'Final exam: 20 questions, 30 minutes, Section 0 → Chapter 14')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Thi cuối khoá</span>
<h2>Bài thi cuối khoá React</h2>
<p class="lead">Hai mươi tình huống trải khắp khoá học — chính app đặt lịch phòng khám bạn đã dựng, từ dòng JSX đầu tiên ở Mục 0 tới pipeline CI ở Chương 14. Phần lớn câu hỏi đưa ra đoạn mã hoặc chuyện đã xảy ra và hỏi màn hình, test, trình duyệt hay máy chủ sẽ làm gì. 30 phút. Mỗi đáp án kèm giải thích và bài để ôn lại.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được JSX biến thành gì, vì sao component phải thuần, và vì sao danh sách cần key ổn định.</li>
<li>Tôi cập nhật state bất biến được, quyết định được state sống ở đâu, và nhận ra khi nào effect là công cụ sai.</li>
<li>Tôi lấy, cache và thay đổi dữ liệu máy chủ bằng TanStack Query và xử lý được trạng thái tải, lỗi, rỗng.</li>
<li>Tôi tổ chức được route và tính năng, đo trước khi tối ưu, và test hành vi bằng Testing Library với MSW.</li>
<li>Tôi giải thích được reconciliation, key như danh tính, Suspense và transition, và các mẫu của Chương 13.</li>
<li>Tôi cất token an toàn, làm mới đúng một lần khi 401, xử lý lỗi mạng, và build rồi deploy bằng CI.</li>
</ul>
${slide('rx-14', 27, 'Bảng tra nhanh Chương 14')}
${slide('rx-14', 29, 'Thi cuối khoá: 20 câu, 30 phút, Mục 0 → Chương 14')}
</div>
`,
    quiz: {
      timeLimitSeconds: 1800,
      questions: [
        {
          question: "Section 0 · JSX. What does <TheBacSi ten=\"An\" /> become before React does anything with it?|||Mục 0 · JSX. <TheBacSi ten=\"An\" /> biến thành gì trước khi React làm gì với nó?",
          options: [
            "An HTML string that is inserted into the page with innerHTML|||Một chuỗi HTML được chèn vào trang bằng innerHTML",
            "A function call that returns a plain object describing the element (type TheBacSi, props { ten: 'An' })|||Một lời gọi hàm trả về một object thường mô tả element (type TheBacSi, props { ten: 'An' })",
            "A real DOM node created with document.createElement|||Một nút DOM thật tạo bằng document.createElement",
            "A template that the browser compiles at runtime|||Một khuôn mẫu trình duyệt tự biên dịch lúc chạy",
          ],
          correctIndex: 1,
          points: 1,
          explanation: "EN: The compiler turns JSX into a call of the JSX runtime (jsx(TheBacSi, { ten: 'An' })), which returns a plain JavaScript object — a description, not a DOM node. React later calls TheBacSi, compares descriptions and only then touches the DOM. It is not an HTML string: React never builds pages with innerHTML, which is also why text in JSX is escaped (Lesson 13.4). Review: Lesson 0.2.|||VI: Trình biên dịch biến JSX thành lời gọi JSX runtime (jsx(TheBacSi, { ten: 'An' })), trả về một object JavaScript thường — một bản mô tả, không phải nút DOM. Sau đó React mới gọi TheBacSi, so các bản mô tả và chỉ lúc đó mới chạm DOM. Không phải chuỗi HTML: React không dựng trang bằng innerHTML, cũng vì thế chữ trong JSX được thoát ký tự (Bài 13.4). Ôn: Bài 0.2.",
        },
        {
          question: "Section 0 · JavaScript. const { ten, ...conLai } = { ten: 'An', tuoi: 30, khoa: 'noi' }. What is conLai?|||Mục 0 · JavaScript. const { ten, ...conLai } = { ten: 'An', tuoi: 30, khoa: 'noi' }. conLai là gì?",
          options: [
            "['tuoi', 'khoa']|||['tuoi', 'khoa']",
            "{ ten: 'An', tuoi: 30, khoa: 'noi' }|||{ ten: 'An', tuoi: 30, khoa: 'noi' }",
            "undefined, because rest only works with arrays|||undefined, vì rest chỉ dùng được với mảng",
            "{ tuoi: 30, khoa: 'noi' }|||{ tuoi: 30, khoa: 'noi' }",
          ],
          correctIndex: 3,
          points: 1,
          explanation: "EN: Object destructuring takes ten out, and the rest pattern collects every remaining own property into a NEW object: { tuoi: 30, khoa: 'noi' }. It is the same pattern as function List({ children, ...props }) that forwards the other props to a DOM element. Rest works with objects since ES2018, not only arrays; and it gives values, not a list of keys. Review: Lesson 0.3.|||VI: Destructuring object lấy ten ra, và mẫu rest gom mọi thuộc tính còn lại vào một object MỚI: { tuoi: 30, khoa: 'noi' }. Đây chính là mẫu function List({ children, ...props }) chuyển các prop còn lại xuống thẻ DOM. Rest dùng được với object từ ES2018, không chỉ mảng; và nó cho giá trị, không phải danh sách khoá. Ôn: Bài 0.3.",
        },
        {
          question: "Chapter 1 · Keys. A favourites list uses key={index}. The user ticks the checkbox of the 2nd doctor, then removes the 1st doctor. What happens?|||Chương 1 · Key. Danh sách yêu thích dùng key={index}. Người dùng tick ô của bác sĩ thứ 2, rồi xoá bác sĩ thứ 1. Chuyện gì xảy ra?",
          options: [
            "The tick now appears on the doctor who moved into position 2 — the wrong row|||Dấu tick giờ nằm ở bác sĩ vừa dời vào vị trí 2 — sai dòng",
            "The tick stays on the right doctor, because React compares the text of each row|||Dấu tick vẫn ở đúng bác sĩ, vì React so chữ của từng dòng",
            "React throws \"Each child in a list should have a unique key\"|||React ném lỗi \"Each child in a list should have a unique key\"",
            "All ticks are cleared, because the list re-mounts|||Mọi dấu tick bị xoá, vì danh sách mount lại",
          ],
          correctIndex: 0,
          points: 1,
          explanation: "EN: With index keys, after removing the first item every remaining item gets the key of the one before it. React keeps component state by key, so the state of key 1 (the tick) stays with whatever row now has key 1 — the doctor who used to be 3rd, now 2nd. React does not compare text, and index keys are unique, so there is no warning — that is why the bug is silent. Use a stable id. Review: Lessons 1.3 and 11.2.|||VI: Với key là index, sau khi xoá mục đầu, mọi mục còn lại nhận key của mục đứng trước nó. React giữ state của component theo key, nên state của key 1 (dấu tick) ở lại với dòng nào đang có key 1 — bác sĩ trước kia đứng thứ 3, giờ thứ 2. React không so chữ, và key index vẫn duy nhất nên không có cảnh báo — vì thế bug im lặng. Dùng id ổn định. Ôn: Bài 1.3 và 11.2.",
        },
        {
          question: "Chapter 2 · State. A click handler runs setDem(dem + 1) three times in a row, with dem = 0. What is shown after the click?|||Chương 2 · State. Một handler bấm chạy setDem(dem + 1) ba lần liên tiếp, với dem = 0. Sau cú bấm màn hình hiện gì?",
          options: [
            "3, because each call adds one|||3, vì mỗi lần gọi cộng một",
            "0, because state cannot change inside a handler|||0, vì state không đổi được trong handler",
            "1, because all three calls read the same snapshot dem = 0|||1, vì cả ba lần gọi đều đọc cùng ảnh chụp dem = 0",
            "An infinite loop of re-renders|||Một vòng render lại vô hạn",
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: dem is a snapshot of this render: it is 0 during the whole handler. Each call asks React to set 0 + 1; the three updates are batched and the result is 1. To add three, use the updater form setDem((d) => d + 1), which receives the latest pending value. It is not a loop: setState in an event handler schedules one render. Review: Lesson 2.1.|||VI: dem là ảnh chụp của lần render này: suốt handler nó là 0. Mỗi lần gọi yêu cầu React đặt 0 + 1; ba cập nhật được gộp và kết quả là 1. Muốn cộng ba, dùng dạng hàm setDem((d) => d + 1), nhận giá trị mới nhất đang chờ. Không phải vòng lặp: setState trong handler sự kiện lên lịch một lần render. Ôn: Bài 2.1.",
        },
        {
          question: "Chapter 3 · Forms. The booking form uses React Hook Form + a Zod schema, and the server also runs the same schema. Why validate twice?|||Chương 3 · Form. Form đặt lịch dùng React Hook Form + một schema Zod, và máy chủ cũng chạy lại chính schema đó. Vì sao kiểm hai lần?",
          options: [
            "Because React Hook Form sometimes skips validation on slow devices|||Vì React Hook Form đôi khi bỏ qua bước kiểm trên máy chậm",
            "It is a mistake; one of them should be removed|||Đó là lỗi; nên bỏ một trong hai",
            "Because the browser check is for a good experience, and anyone can call the API directly without the form|||Vì kiểm ở trình duyệt là cho trải nghiệm tốt, còn ai cũng gọi thẳng API được mà không qua form",
            "Because Zod only works on the server|||Vì Zod chỉ chạy được ở máy chủ",
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: Client-side validation gives instant, field-level errors; it is UX, not protection — a request can be sent with curl or a modified page, skipping the form. The server must check again. Sharing one schema keeps both rules identical. Removing the server check is the dangerous option; removing the client check makes the form unpleasant. Review: Lessons 3.2–3.3.|||VI: Kiểm ở client cho lỗi tức thì, đúng từng ô; đó là trải nghiệm, không phải bảo vệ — request có thể gửi bằng curl hay một trang đã sửa, bỏ qua form. Máy chủ phải kiểm lại. Dùng chung một schema giữ hai bộ luật giống hệt nhau. Bỏ phần kiểm ở máy chủ là phương án nguy hiểm; bỏ phần ở client làm form khó chịu. Ôn: Bài 3.2–3.3.",
        },
        {
          question: "Chapter 4 · Effects. A component computes the filtered doctor list like this: useEffect(() => setDaLoc(loc(ds, q)), [ds, q]). What is the best change?|||Chương 4 · Effect. Một component tính danh sách bác sĩ đã lọc thế này: useEffect(() => setDaLoc(loc(ds, q)), [ds, q]). Nên đổi thế nào?",
          options: [
            "Compute it during render: const daLoc = loc(ds, q) (with useMemo only if it is measured as slow)|||Tính ngay khi render: const daLoc = loc(ds, q) (chỉ thêm useMemo nếu đo thấy chậm)",
            "Add daLoc to the dependency array|||Thêm daLoc vào mảng dependency",
            "Replace useEffect with useLayoutEffect so there is no flicker|||Thay useEffect bằng useLayoutEffect để khỏi nháy",
            "Move the filter into a setInterval that runs every 100 ms|||Dời việc lọc vào một setInterval chạy mỗi 100 ms",
          ],
          correctIndex: 0,
          points: 1,
          explanation: "EN: The filtered list is derived data: it can be computed from ds and q during render. Copying it into state with an effect causes an extra render in which the old list is shown (Chapter 13 measured 4 renders, one with the wrong result, for this pattern). useLayoutEffect only hides the flicker and still renders twice; adding daLoc to the dependencies would create a loop. Review: Lessons 4.2 and 13.2.|||VI: Danh sách đã lọc là dữ liệu dẫn xuất: tính được từ ds và q ngay khi render. Chép nó vào state bằng effect gây thêm một lần render trong đó danh sách cũ hiện ra (Chương 13 đo mẫu này: 4 lần render, một lần sai kết quả). useLayoutEffect chỉ che chỗ nháy mà vẫn render hai lần; thêm daLoc vào dependency tạo vòng lặp. Ôn: Bài 4.2 và 13.2.",
        },
        {
          question: "Chapter 5 · Sharing state. The specialty filter must survive F5 and be shareable as a link. Where should it live?|||Chương 5 · Chia sẻ state. Bộ lọc chuyên khoa phải sống qua F5 và chia sẻ được bằng link. Nó nên sống ở đâu?",
          options: [
            "In a React Context at the root|||Trong một React Context ở gốc",
            "In a Zustand store with persist to localStorage|||Trong một store Zustand có persist xuống localStorage",
            "In useState of the list page|||Trong useState của trang danh sách",
            "In the URL search params (?ck=nhi), read with useSearchParams|||Trên search params của URL (?ck=nhi), đọc bằng useSearchParams",
          ],
          correctIndex: 3,
          points: 1,
          explanation: "EN: Only the URL is both reload-proof and shareable: sending /bac-si?ck=nhi to a friend opens the same filtered list, and Back/Forward work. localStorage survives F5 but is per browser, so a shared link would open with the recipient's own filter. Context and useState are lost on reload. Review: Lesson 5.4.|||VI: Chỉ URL vừa sống qua F5 vừa chia sẻ được: gửi /bac-si?ck=nhi cho bạn là mở đúng danh sách đã lọc, và Back/Forward chạy đúng. localStorage sống qua F5 nhưng theo từng trình duyệt, nên link chia sẻ sẽ mở với bộ lọc của chính người nhận. Context và useState mất khi tải lại. Ôn: Bài 5.4.",
        },
        {
          question: "Chapter 6 · Data. After cancelling an appointment (a mutation), the list still shows it as waiting. What is the usual fix with TanStack Query?|||Chương 6 · Dữ liệu. Sau khi huỷ một lịch hẹn (mutation), danh sách vẫn hiện nó là đang chờ. Cách sửa thông thường với TanStack Query là gì?",
          options: [
            "Call window.location.reload() after the mutation|||Gọi window.location.reload() sau mutation",
            "Invalidate the affected query keys (['lich-hen'], the doctor's time slots) in onSettled|||Invalidate các query key bị ảnh hưởng (['lich-hen'], khung giờ của bác sĩ) trong onSettled",
            "Set staleTime: Infinity so the list never changes|||Đặt staleTime: Infinity để danh sách không bao giờ đổi",
            "Store the list in useState and edit it by hand|||Cất danh sách vào useState và tự sửa tay",
          ],
          correctIndex: 1,
          points: 1,
          explanation: "EN: The cache does not know the server changed. Invalidating the keys the mutation affects marks them stale and refetches those currently on screen; onSettled runs on success and on error, which matters because an error can also mean the screen is outdated. Reloading the page throws away all state; staleTime: Infinity makes it worse; copying server data into useState creates a second source of truth. Review: Lesson 6.3.|||VI: Cache không biết máy chủ đã đổi. Invalidate các key mà mutation ảnh hưởng đánh dấu chúng cũ và tải lại những cái đang trên màn hình; onSettled chạy cả khi thành công lẫn khi lỗi, quan trọng vì lỗi cũng có thể nghĩa là màn hình đã cũ. Tải lại trang vứt hết state; staleTime: Infinity làm tệ hơn; chép dữ liệu máy chủ vào useState tạo nguồn sự thật thứ hai. Ôn: Bài 6.3.",
        },
        {
          question: "Chapter 7 · Routing. /lich-hen is wrapped in a route guard that redirects signed-out users. Is the appointment data now protected?|||Chương 7 · Định tuyến. /lich-hen được bọc trong cổng route chuyển người chưa đăng nhập đi chỗ khác. Dữ liệu lịch hẹn giờ đã được bảo vệ chưa?",
          options: [
            "Yes, because the page component never renders for them|||Rồi, vì component trang không bao giờ render với họ",
            "Yes, as long as the guard uses replace|||Rồi, miễn là cổng dùng replace",
            "No — the guard is UX; only the server refusing requests without a valid token (401) protects the data|||Chưa — cổng là trải nghiệm; chỉ máy chủ từ chối request thiếu token hợp lệ (401) mới bảo vệ dữ liệu",
            "No, because React Router cannot redirect before render|||Chưa, vì React Router không chuyển hướng được trước khi render",
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: Anyone can call GET /api/lich-hen directly with curl or DevTools; the route guard only decides which page to show. Chapter 14 made the fake server check the token and filter by the account inside it — that is the protection. replace only changes the history entry. Review: Lessons 7.2 and 14.1.|||VI: Ai cũng gọi thẳng GET /api/lich-hen được bằng curl hay DevTools; cổng route chỉ quyết định hiện trang nào. Chương 14 cho máy chủ giả kiểm token và lọc theo tài khoản nằm trong token — đó mới là bảo vệ. replace chỉ đổi mục trong lịch sử. Ôn: Bài 7.2 và 14.1.",
        },
        {
          question: "Chapter 8 · Performance. A teammate wraps every component in memo and every function in useCallback \"to be safe\". What is the best response?|||Chương 8 · Hiệu năng. Đồng nghiệp bọc mọi component bằng memo và mọi hàm bằng useCallback \"cho chắc\". Phản hồi tốt nhất là gì?",
          options: [
            "Good practice — memoising everything can only make the app faster|||Thói quen tốt — memo mọi thứ chỉ có thể làm app nhanh hơn",
            "Remove memo but keep useCallback everywhere|||Bỏ memo nhưng giữ useCallback ở mọi nơi",
            "Replace them with useMemo, which is faster|||Thay bằng useMemo, nhanh hơn",
            "Measure with the Profiler first and memoise only where a render is expensive and unnecessary — and with React Compiler most of it is automatic|||Đo bằng Profiler trước và chỉ memo chỗ render vừa tốn vừa thừa — và khi có React Compiler phần lớn việc này tự động",
          ],
          correctIndex: 3,
          points: 1,
          explanation: "EN: Memoisation has costs — comparing props, keeping old values, harder code — and gains nothing where renders are cheap or props change every time anyway. The rule of the course: measure, then fix the component the measurement names. With React Compiler 1.0 enabled (Chapter 12) components are memoised automatically. \"Can only make it faster\" is the attractive wrong answer. Review: Lessons 8.1–8.2 and 12.4.|||VI: Memo có giá — so props, giữ giá trị cũ, mã khó đọc hơn — và không được gì ở chỗ render rẻ hoặc props đằng nào cũng đổi mỗi lần. Luật của khoá: đo, rồi sửa đúng component mà số đo chỉ ra. Khi bật React Compiler 1.0 (Chương 12) component được memo tự động. \"Chỉ có thể nhanh hơn\" là đáp án sai hấp dẫn. Ôn: Bài 8.1–8.2 và 12.4.",
        },
        {
          question: "Chapter 9 · Testing. The doctor list loads through MSW. Which query waits for it correctly?|||Chương 9 · Test. Danh sách bác sĩ tải qua MSW. Câu truy vấn nào chờ nó đúng cách?",
          options: [
            "screen.getAllByRole('article') right after render|||screen.getAllByRole('article') ngay sau render",
            "await screen.findAllByRole('article')|||await screen.findAllByRole('article')",
            "await new Promise((r) => setTimeout(r, 2000)) then getAllByRole|||await new Promise((r) => setTimeout(r, 2000)) rồi getAllByRole",
            "container.querySelectorAll('.the-bac-si')|||container.querySelectorAll('.the-bac-si')",
          ],
          correctIndex: 1,
          points: 1,
          explanation: "EN: findBy/findAllBy return a promise that retries until the elements appear (or a timeout), which is exactly what asynchronous data needs. getAllBy right away fails because the data has not arrived. A fixed sleep makes tests slow and still flaky. querySelectorAll by class tests implementation, not what the user perceives, and does not wait either. Review: Lessons 9.1–9.2.|||VI: findBy/findAllBy trả promise tự thử lại tới khi element xuất hiện (hoặc hết giờ), đúng thứ dữ liệu bất đồng bộ cần. getAllBy ngay lập tức hỏng vì dữ liệu chưa về. Ngủ cố định làm test chậm mà vẫn chập chờn. querySelectorAll theo class test chi tiết cài đặt, không phải thứ người dùng thấy, và cũng không chờ. Ôn: Bài 9.1–9.2.",
        },
        {
          question: "Chapter 10 · Deploy. The built app works when you click around, but F5 on /bac-si/bs-2 shows the host's 404 page. What is missing?|||Chương 10 · Deploy. App đã build chạy tốt khi bấm qua lại, nhưng F5 ở /bac-si/bs-2 hiện trang 404 của host. Thiếu gì?",
          options: [
            "SPA fallback: the server must answer unknown paths with index.html (but keep real 404s for missing /assets/ files)|||SPA fallback: máy chủ phải trả index.html cho đường dẫn lạ (nhưng giữ 404 thật cho file /assets/ không tồn tại)",
            "A server-side route for every page in React Router|||Một route phía máy chủ cho từng trang trong React Router",
            "The BrowserRouter should be replaced by MemoryRouter|||Nên thay BrowserRouter bằng MemoryRouter",
            "The bundle is too large to load on a deep link|||Bundle quá lớn nên không tải được ở deep link",
          ],
          correctIndex: 0,
          points: 1,
          explanation: "EN: Clicking a link never asks the server — the router changes the URL in the browser. F5 does ask for a file named /bac-si/bs-2, which does not exist. The server must return index.html so the router can read the URL. Chapter 10 measured that falling back for /assets/ too returns HTML where JavaScript is expected, so the fallback must exclude hashed assets. On GitHub Pages the trick is 404.html (Lesson 14.3). Review: Lesson 10.4.|||VI: Bấm link không bao giờ hỏi máy chủ — router đổi URL ngay trong trình duyệt. F5 thì hỏi một file tên /bac-si/bs-2, không có. Máy chủ phải trả index.html để router đọc URL. Chương 10 đo được: fallback cả /assets/ thì trả HTML ở chỗ chờ JavaScript, nên fallback phải chừa file có mã băm. Trên GitHub Pages mẹo là 404.html (Bài 14.3). Ôn: Bài 10.4.",
        },
        {
          question: "Chapter 11 · Under the hood. The booking form must start empty whenever the selected doctor changes. What is the simplest correct way?|||Chương 11 · Bên trong. Form đặt lịch phải trống lại mỗi khi đổi bác sĩ. Cách đơn giản và đúng nhất là gì?",
          options: [
            "Render it with key={bacSiId}, so React treats a new doctor as a new component and resets its state|||Vẽ nó với key={bacSiId}, để React coi bác sĩ mới là component mới và reset state",
            "A useEffect that calls reset() when bacSiId changes|||Một useEffect gọi reset() khi bacSiId đổi",
            "Store the form values in localStorage and delete them|||Cất giá trị form vào localStorage rồi xoá",
            "Call window.location.reload() on change|||Gọi window.location.reload() khi đổi",
          ],
          correctIndex: 0,
          points: 1,
          explanation: "EN: React keeps state by position and key. A different key at the same position means a different component: the old one unmounts with its state, a fresh one mounts. That resets everything inside at once, in the same render. The effect approach works but renders once with the old values first and must list every piece to reset. Review: Lesson 11.2 (and 4.2).|||VI: React giữ state theo vị trí và key. Key khác ở cùng vị trí nghĩa là component khác: cái cũ unmount cùng state của nó, cái mới mount. Mọi thứ bên trong reset một lượt, ngay trong lần render đó. Cách dùng effect cũng chạy nhưng render một lần với giá trị cũ trước và phải liệt kê từng mẩu cần reset. Ôn: Bài 11.2 (và 4.2).",
        },
        {
          question: "Chapter 12 · React 19. Typing in the search box of a 5,000-doctor list feels laggy. Which React 19 tool keeps typing responsive while the list updates later?|||Chương 12 · React 19. Gõ vào ô tìm của danh sách 5.000 bác sĩ bị giật. Công cụ nào của React 19 giữ phím gõ mượt trong khi danh sách cập nhật sau?",
          options: [
            "useOptimistic|||useOptimistic",
            "useActionState|||useActionState",
            "useLayoutEffect|||useLayoutEffect",
            "useDeferredValue (or wrapping the list update in startTransition)|||useDeferredValue (hoặc bọc việc cập nhật danh sách trong startTransition)",
          ],
          correctIndex: 3,
          points: 1,
          explanation: "EN: useDeferredValue gives a lagging copy of the query: the input renders with the new text immediately (urgent), the expensive list renders with the deferred value in the background and can be interrupted. startTransition marks an update as non-urgent the same way. useOptimistic shows a pending result of an action; useActionState manages form actions; useLayoutEffect blocks painting — none of them makes typing smoother. Review: Lesson 12.2.|||VI: useDeferredValue cho một bản sao đi chậm của từ khoá: ô nhập vẽ chữ mới ngay (khẩn), danh sách tốn kém vẽ với giá trị hoãn ở nền và có thể bị ngắt. startTransition đánh dấu một cập nhật là không khẩn theo cùng cách. useOptimistic hiện kết quả tạm của một action; useActionState quản lý action của form; useLayoutEffect chặn việc vẽ — không cái nào làm gõ phím mượt hơn. Ôn: Bài 12.2.",
        },
        {
          question: "Chapter 13 · Patterns. A doctor's bio comes from the clinic's CMS as HTML with <strong> and <ul>. How should it be displayed?|||Chương 13 · Mẫu. Phần giới thiệu bác sĩ đến từ CMS của phòng khám dưới dạng HTML có <strong> và <ul>. Nên hiển thị thế nào?",
          options: [
            "dangerouslySetInnerHTML={{ __html: bio }} — the CMS is ours, so it is trusted|||dangerouslySetInnerHTML={{ __html: bio }} — CMS là của mình nên tin được",
            "dangerouslySetInnerHTML with DOMPurify and an allowlist of tags, sanitised right at the insertion|||dangerouslySetInnerHTML với DOMPurify và danh sách trắng thẻ, lọc ngay tại chỗ chèn",
            "{bio} inside a <div> — React renders the formatting|||{bio} bên trong một <div> — React vẽ ra định dạng",
            "Strip all tags with a regular expression, then use dangerouslySetInnerHTML|||Gỡ mọi thẻ bằng biểu thức chính quy, rồi dùng dangerouslySetInnerHTML",
          ],
          correctIndex: 1,
          points: 1,
          explanation: "EN: {bio} is escaped, so the user would see the literal tags. Inserting raw HTML runs whatever it contains — Chapter 13 measured an injected <img onerror> running once — and \"our CMS\" can be misused or hold old data. DOMPurify with an allowlist keeps <strong>/<ul> and removes handlers and scripts; sanitising at the insertion point protects every path that reaches it. Regex stripping is famously bypassable. Review: Lesson 13.4.|||VI: {bio} bị thoát ký tự, người dùng sẽ thấy nguyên các thẻ. Chèn HTML thô chạy mọi thứ bên trong — Chương 13 đo được một <img onerror> bị chèn chạy một lần — và \"CMS của mình\" vẫn có thể bị lạm dụng hoặc chứa dữ liệu cũ. DOMPurify với danh sách trắng giữ <strong>/<ul> và gỡ handler lẫn script; lọc tại chỗ chèn bảo vệ mọi đường dẫn tới đó. Gỡ thẻ bằng regex nổi tiếng là lách được. Ôn: Bài 13.4.",
        },
        {
          question: "Chapter 14 · Tokens. Where does the clinic app keep the access token and the refresh token?|||Chương 14 · Token. App phòng khám giữ access token và refresh token ở đâu?",
          options: [
            "Both in localStorage, so they survive F5|||Cả hai trong localStorage, để sống qua F5",
            "Both in an HttpOnly cookie|||Cả hai trong một cookie HttpOnly",
            "Access token in memory (a non-persisted store); refresh token in an HttpOnly, Secure, SameSite cookie|||Access token trong bộ nhớ (một store không persist); refresh token trong cookie HttpOnly, Secure, SameSite",
            "Access token in sessionStorage; refresh token in localStorage|||Access token trong sessionStorage; refresh token trong localStorage",
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: The short-lived access token lives only in JavaScript memory and is sent as a Bearer header; losing it on F5 is fine because the refresh cookie gets a new one (measured: 401 → refresh → 200 after reload). The long-lived refresh token must be unreadable by scripts, so HttpOnly. localStorage is readable by any injected script and can be taken to another machine. Putting both in the cookie is possible but then every request depends on cookies and CSRF defences. Review: Lesson 14.1.|||VI: Access token ngắn hạn chỉ sống trong bộ nhớ JavaScript và gửi bằng header Bearer; mất khi F5 cũng không sao vì cookie refresh xin được cái mới (đo được: 401 → làm mới → 200 sau khi tải lại). Refresh token dài hạn phải để script không đọc được, nên HttpOnly. localStorage đọc được bằng mọi script bị chèn và mang sang máy khác được. Để cả hai trong cookie là có thể, nhưng khi đó mọi request phụ thuộc cookie và phòng chống CSRF. Ôn: Bài 14.1.",
        },
        {
          question: "Chapter 14 · 401. Three requests hit 401 at the same time and each calls the refresh endpoint on its own. Refresh tokens rotate. What was measured?|||Chương 14 · 401. Ba request cùng nhận 401 và mỗi cái tự gọi endpoint làm mới. Refresh token xoay vòng. Đo được gì?",
          options: [
            "200, 200, 200 — just three refresh calls instead of one|||200, 200, 200 — chỉ là ba lần gọi làm mới thay vì một",
            "200, 401, 401 — the 2nd and 3rd refresh used a revoked token, and the user was signed out|||200, 401, 401 — lần làm mới thứ 2 và 3 dùng token đã bị thu hồi, và người dùng bị đăng xuất",
            "An infinite loop of refresh calls|||Một vòng lặp gọi làm mới vô hạn",
            "401, 401, 401 — refresh never works in parallel|||401, 401, 401 — làm mới không bao giờ chạy song song được",
          ],
          correctIndex: 1,
          points: 1,
          explanation: "EN: The first refresh consumes the refresh token and receives a new one; the other two send the old, now revoked token, get 401, and the session code concludes the session is over. That is why http.ts shares one refresh promise (single-flight): 3 concurrent 401 → 1 refresh → 3 retries. There is no infinite loop because each request retries at most once. Review: Lesson 14.1.|||VI: Lần làm mới đầu dùng mất refresh token và nhận cái mới; hai lần kia gửi token cũ đã bị thu hồi, nhận 401, và mã phiên kết luận phiên đã hết. Vì thế http.ts dùng chung một promise làm mới (single-flight): 3 lần 401 đồng thời → 1 lần làm mới → 3 lần gửi lại. Không có vòng lặp vô hạn vì mỗi request gửi lại tối đa một lần. Ôn: Bài 14.1.",
        },
        {
          question: "Chapter 14 · Retries. A booking POST times out; in fact the server created the appointment. Without an Idempotency-Key the app retries the POST. What does the user see (as measured)?|||Chương 14 · Thử lại. Một POST đặt lịch hết giờ; thật ra máy chủ đã tạo lịch. Không có Idempotency-Key, app gửi lại POST. Người dùng thấy gì (theo số đo)?",
          options: [
            "409 \"Khung giờ này vừa có người đặt\", although their booking succeeded|||409 \"Khung giờ này vừa có người đặt\", dù lịch của họ đã đặt thành công",
            "Their confirmation, and exactly one appointment exists|||Xác nhận của họ, và có đúng một lịch hẹn",
            "Nothing: TanStack Query never retries mutations|||Không gì cả: TanStack Query không bao giờ thử lại mutation",
            "A duplicate appointment silently created in another slot|||Một lịch trùng được tạo lặng lẽ ở khung giờ khác",
          ],
          correctIndex: 0,
          points: 1,
          explanation: "EN: The retry looks like a new booking of a slot that is now taken (by this very user), so the server answers 409 and the user believes the booking failed. With the same Idempotency-Key the server returned lh-1 both times and one appointment existed. Mutations do not retry by default — this app enables a retry only for LoiMang and only because the key makes it safe. Review: Lesson 14.2.|||VI: Lần gửi lại trông như một lần đặt mới cho khung giờ đã kín (bởi chính người này), nên máy chủ trả 409 và người dùng tưởng đặt hỏng. Có cùng Idempotency-Key, máy chủ trả lh-1 cả hai lần và chỉ có một lịch hẹn. Mutation mặc định không thử lại — app này chỉ bật thử lại cho LoiMang và chỉ vì khoá làm việc đó an toàn. Ôn: Bài 14.2.",
        },
        {
          question: "Chapter 14 · Environment. .env.local contains VITE_KHOA_GIPHY=gph_123 and KHOA_DB=postgres://…, and both are logged in main.tsx. After vite build, what is in dist/assets/index-*.js?|||Chương 14 · Môi trường. .env.local có VITE_KHOA_GIPHY=gph_123 và KHOA_DB=postgres://…, và cả hai được in ra trong main.tsx. Sau vite build, dist/assets/index-*.js chứa gì?",
          options: [
            "Neither: Vite encrypts environment variables|||Không cái nào: Vite mã hoá biến môi trường",
            "Both values in clear text|||Cả hai giá trị ở dạng chữ rõ",
            "Only a reference import.meta.env.VITE_KHOA_GIPHY, resolved by the server at runtime|||Chỉ một tham chiếu import.meta.env.VITE_KHOA_GIPHY, máy chủ điền lúc chạy",
            "gph_123 verbatim, and void 0 in place of KHOA_DB|||gph_123 nguyên văn, và void 0 thay cho KHOA_DB",
          ],
          correctIndex: 3,
          points: 1,
          explanation: "EN: Vite replaces import.meta.env.VITE_* with its value as text at build time — measured: console.log(`giphy:`,`gph_ThuNghiem_123`,…) in the bundle. Variables without the VITE_ prefix are not exposed and become undefined (void 0). Nothing is encrypted or filled in at runtime, which is also why changing .env requires a rebuild. Secrets belong on the backend. Review: Lesson 14.2.|||VI: Vite thay import.meta.env.VITE_* bằng giá trị dạng chữ lúc build — đo được: console.log(`giphy:`,`gph_ThuNghiem_123`,…) trong bundle. Biến không có tiền tố VITE_ không bị lộ và thành undefined (void 0). Không có gì được mã hoá hay điền lúc chạy, cũng vì thế đổi .env là phải build lại. Bí mật thuộc về backend. Ôn: Bài 14.2.",
        },
        {
          question: "Chapter 14 · Deploy. nginx has the CSP header in server { } and add_header Cache-Control inside each location. What does curl -sI show for /bac-si/bs-2?|||Chương 14 · Deploy. nginx đặt header CSP trong server { } và add_header Cache-Control trong từng location. curl -sI cho /bac-si/bs-2 hiện gì?",
          options: [
            "Both headers, because nginx merges add_header from all levels|||Cả hai header, vì nginx gộp add_header của mọi cấp",
            "Only the CSP header|||Chỉ header CSP",
            "Only Cache-Control: a location with its own add_header inherits none from the server level|||Chỉ Cache-Control: location có add_header riêng thì không thừa hưởng gì từ cấp server",
            "Neither, and nginx -t reports an error|||Không cái nào, và nginx -t báo lỗi",
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: nginx's add_header inherits from the outer level only if the inner level has no add_header of its own. Measured on nginx 1.27.5: 0 of 4 security headers with the headers at server level; 4 of 4 after including the snippet in every location. nginx -t is perfectly happy with the broken config — only curl reveals it. Review: Lesson 14.3.|||VI: add_header của nginx chỉ thừa hưởng từ cấp ngoài khi cấp trong không có add_header nào của riêng nó. Đo trên nginx 1.27.5: 0 trên 4 header bảo mật khi đặt ở cấp server; 4 trên 4 sau khi include đoạn cấu hình vào mọi location. nginx -t hoàn toàn hài lòng với cấu hình hỏng — chỉ curl mới lộ ra. Ôn: Bài 14.3.",
        },
      ],
    },
};

export default {
  title: 'Chapter 14 — Going to production|||Chương 14 — Lên production',
  description: 'Chương cuối: đưa app đặt lịch tới người dùng thật — đăng nhập bằng access token trong bộ nhớ và refresh token trong cookie HttpOnly, 401 → làm mới một lần rồi gửi lại, đăng xuất mọi tab; lỗi mạng, hết giờ, thử lại có trần, Idempotency-Key, báo lỗi; biến môi trường Vite; bỏ MSW khỏi production, đo bundle, ngân sách kích thước, CSP; CI/CD bằng GitHub Actions; checklist phỏng vấn middle 15 câu và bài thi cuối khoá 20 câu.',
  lessons: [L0, L1, L2, L3, L4, Q],
};
