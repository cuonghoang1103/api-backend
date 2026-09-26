import { gallery, slide } from './_slides.mjs';

/**
 * React — Chương 10: Dự án giữa khoá — giao diện đặt lịch (soạn 26/09/2026 theo content/courses/react/_HOP-DONG.md, mục 2–7, 4c, 11).
 * Title chương ĐỔI theo mục 4c (khung cũ: "Capstone / Dự án cuối khoá") — an toàn vì bài ĐẦU chương là bài cũ
 * rx-10-1-thiet-ke (seeder neo chương bằng slug bài đầu). Thứ tự: rx-10-1-thiet-ke, rx-10-0-slides, rx-10-2-xay-dung,
 * rx-10-3-chat-luong, rx-10-4-tong-ket (LESSON giữ slug khung), rx-10-5-kiem-tra (QUIZ 10 câu).
 * Bài thi cuối khoá KHÔNG ở đây (Ch14: rx-14-5-thi-cuoi-khoa). E2E Playwright chỉ trỏ khoá khác (/courses/testing, Next.js Ch19).
 * Người học TỰ LÀM là chính: mỗi bài đưa đề + mốc + tiêu chí đạt; lời giải trong <details>.
 * Mọi mã dài và mọi output trong bài chạy THẬT 26/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch10 — chép từ
 * ảnh chụp sau-ch09 (114 test xanh), rồi làm tính năng "lịch trống cả tuần + đổi giờ". Ảnh chụp sau chương: SCRATCH/rx/du-an/sau-ch10.
 * (react 19.3.0 · vite 8.3.1 · typescript 6.0.3 · vitest 5.0.2 · @vitest/coverage-v8 5.0.2 · jsdom 29.1.1 ·
 *  @testing-library/react 16.3.3 · @testing-library/user-event 14.6.7 · @tanstack/react-query 5.103.3 · react-router 8.4.0 ·
 *  msw 2.15.0 · axe-core 4.13.0 · zustand 5.0.15 · babel-plugin-react-compiler 1.0.0 · Chromium 149 qua playwright-core ·
 *  nginx 1.27-alpine trong Docker · Python 3.14 http.server).
 * Mã dài trong bài nằm ở hằng SN, output ở hằng OUT — sinh tự động từ chính các file/log đã chạy.
 * Sơ đồ: mermaid ngay trong bài (<pre><code class="language-mermaid">), 2–3 sơ đồ mỗi bài dạy, nhãn VI ở khối VI, EN ở khối EN.
 * Deck: scripts/slides-src/rx-10.mjs.
 */

const H = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '&#96;').replace(/\$\{/g, '&#36;{');
const pre = (lang, s) => '<pre><code class="language-' + lang + '">' + H(s) + '</code></pre>';
const out = (s) => '<div class="out">' + H(s) + '</div>';
const LINK = (href, ico, title, sub) => '<a class="link-card" href="' + href + '" target="_blank" rel="noopener"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';
/** Link trong site (không mở tab mới). */
const LINK_TRONG = (href, ico, title, sub) => '<a class="link-card" href="' + href + '"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';
/** Sơ đồ mermaid: trang học đọc textContent của <code class="language-mermaid"> rồi vẽ (LearnPageClient → mermaidRuntime). */
const MM = (src) => '<pre><code class="language-mermaid">' + H(src.trim()) + '</code></pre>';

/* ─── Mã trong bài: SINH TỰ ĐỘNG từ dự án thử ch10 (tsc -b sạch + vitest 145 xanh 26/09/2026) — đừng sửa tay ─── */
const SN = {
  apiDoiGio: "  /** Chương 10: đổi giờ một lịch đang chờ — cùng bác sĩ, sang khung giờ khác. Máy chủ trả 409 nếu giờ mới đã kín/trùng. */\n  doiGio: (id: string, khungGioId: string) =>\n    goiApi<LichHenCoGio>(`/api/lich-hen/${id}`, {\n      method: 'PATCH',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ khungGioId }),\n    }),",
  duongDan: "  /** Chương 10: lịch trống cả tuần của một bác sĩ. Không truyền tuần ⇒ tuần đầu (docTuan tự chọn). */\n  lichTuan: (bacSiId: string, tuan?: string) => `/bac-si/${bacSiId}/lich-tuan` + (tuan ? `?tuan=${tuan}` : ''),\n  /** Chương 10: đổi giờ một lịch hẹn (sau cổng đăng nhập). */\n  doiGio: (lichHenId: string, tuan?: string) => `/lich-hen/${lichHenId}/doi-gio` + (tuan ? `?tuan=${tuan}` : ''),",
  handlerDoiGio: "  http.patch('/api/lich-hen/:id', async ({ params, request }) => {\n    await treMang();\n    if (dieuKhien.loi.has('huy')) return loi500();\n    const body = (await request.json()) as { trangThai?: TrangThaiLichHen; khungGioId?: string };\n    // Chương 10: ĐỔI GIỜ — { khungGioId } thay vì { trangThai }. Thứ tự kiểm = thứ tự máy chủ thật nên làm.\n    if (body.khungGioId !== undefined) {\n      const cu = db.lichHen().find((x) => x.id === params.id);\n      if (!cu) return HttpResponse.json({ loi: 'Không có lịch hẹn này' }, { status: 404 });\n      if (cu.trangThai !== 'cho-xac-nhan') return loi409('Chỉ đổi giờ được lịch đang chờ xác nhận');\n      const kgMoi = db.timKhungGio(body.khungGioId);\n      if (!kgMoi || kgMoi.bacSiId !== cu.bacSiId) return HttpResponse.json({ loi: 'Không có khung giờ này' }, { status: 404 });\n      if (dieuKhien.tranh) kgMoi.conTrong = false; // ?tranh=1: ai đó vừa giành mất giờ này\n      if (!kgMoi.conTrong) return loi409('Khung giờ này vừa có người đặt');\n      if (trungGio(cu.benhNhan.soDienThoai, kgMoi.batDau, cu.id)) return loi409('Bạn đã có một lịch khác vào đúng giờ này');\n      const kgCu = db.timKhungGio(cu.khungGioId);\n      if (kgCu) kgCu.conTrong = true; // giờ cũ mở lại cho người khác\n      kgMoi.conTrong = false;\n      return HttpResponse.json(db.suaLichHen(cu.id, { khungGioId: kgMoi.id, batDau: kgMoi.batDau }));\n    }\n    const trangThai = body.trangThai!;\n    // … phần huỷ lịch như Chương 6",
  trungGio: "/** Chương 10: bệnh nhân (theo SĐT) đã có một lịch CHƯA HUỶ đúng giờ này chưa? Máy chủ tự kiểm — không tin client. */\nconst trungGio = (soDienThoai: string, batDau: string, boQua?: string) =>\n  db.lichHen().some((lh) => lh.id !== boQua && lh.trangThai !== 'da-huy' && lh.benhNhan.soDienThoai === soDienThoai && lh.batDau === batDau);\nconst loi409 = (loi: string) => HttpResponse.json({ loi }, { status: 409 });",
  cuaLichTuan: "/** CỬA DUY NHẤT của tính năng \"lịch tuần\" (Chương 10): xem lịch trống cả tuần, và chọn giờ mới khi đổi lịch. */\nexport { DieuHuongTuan } from './DieuHuongTuan';\nexport { LuoiLichTuan, type CheDoLuoi } from './LuoiLichTuan';\nexport { useLichTuan, type NgayTrongTuan } from './useLichTuan';\nexport { useDoiGio } from './useDoiGio';\nexport { timLichTrung } from './logic/kiem-trung';\nexport { docTuan, tuanKe, cacNgayTrongTuan, TUAN_DAU, TUAN_CUOI } from './logic/tuan';",
  router: "          path: 'bac-si/:id/lich-tuan', // Chương 10: ai cũng xem được lịch trống\n          lazy: { Component: async () => (await import('@/pages/TrangLichTuan')).TrangLichTuan },\n        },\n        …\n              path: 'lich-hen/:id/doi-gio', // Chương 10: đổi giờ — sau cổng đăng nhập\n              lazy: { Component: async () => (await import('@/pages/TrangDoiGio')).TrangDoiGio },\n            },",
  thoiGianTuan: "/* ─── Chương 10: lịch theo TUẦN ─── */\n\n/** \"Hôm nay\" của app — cố định như NGAY_KHAM để test và ảnh chụp lặp lại được (app thật: new Date()). */\nexport const HOM_NAY = NGAY_KHAM[0];\n\n/** Mở đặt lịch trước tối đa 4 tuần (tuần này + 3 tuần sau). */\nexport const SO_TUAN_MO = 4;\n\n/** 'YYYY-MM-DD' ↔ số ngày kể từ 1970-01-01, tính theo UTC ⇒ không lệch một ngày vì múi giờ của máy chạy. */\nconst soNgay = (ngay: string) => Date.UTC(+ngay.slice(0, 4), +ngay.slice(5, 7) - 1, +ngay.slice(8, 10)) / 86_400_000;\nconst tuSoNgay = (n: number) => new Date(n * 86_400_000).toISOString().slice(0, 10);\n\n/** '2026-09-30' + 2 → '2026-10-02' (qua tháng, qua năm đều đúng). */\nexport function congNgay(ngay: string, n: number): string {\n  return tuSoNgay(soNgay(ngay) + n);\n}",
  tenThu: "const TEN_THU = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ nhật'];\n\n/** '2026-10-06' → 'Thứ Ba' */\nexport function tenThu(ngay: string): string {\n  return TEN_THU[thuTrongTuan(ngay)];\n}",
  tuanTs: "import { congNgay, dauTuan, HOM_NAY, SO_TUAN_MO, thuTrongTuan } from '@/shared/logic/thoi-gian';\n\n/** Tuần đầu tiên mở đặt lịch: tuần chứa hôm nay (thứ Hai 28/09/2026). */\nexport const TUAN_DAU = dauTuan(HOM_NAY);\n/** Tuần cuối cùng mở đặt lịch. */\nexport const TUAN_CUOI = congNgay(TUAN_DAU, 7 * (SO_TUAN_MO - 1));\n\n/**\n * '?tuan=2026-10-05' → '2026-10-05'. URL là dữ liệu người dùng gõ được ⇒ kiểm đủ ba điều: đúng dạng, là THỨ HAI,\n * nằm trong khoảng mở đặt lịch. Sai bất kỳ điều nào ⇒ tuần đầu (không ném lỗi, không trang trắng).\n */\nexport function docTuan(sp: URLSearchParams): string {\n  const t = sp.get('tuan') ?? '';\n  const hopLe = /^\\d{4}-\\d{2}-\\d{2}$/.test(t) && thuTrongTuan(t) === 0 && t >= TUAN_DAU && t <= TUAN_CUOI;\n  return hopLe ? t : TUAN_DAU;\n}\n\n/** Sáu ngày khám của một tuần: thứ Hai → thứ Bảy (Chủ nhật phòng khám nghỉ). */\nexport function cacNgayTrongTuan(tuan: string): string[] {\n  return Array.from({ length: 6 }, (_, i) => congNgay(tuan, i));\n}\n\n/** Tuần trước / tuần sau, hoặc null nếu ra ngoài khoảng mở đặt lịch (nút tương ứng bị tắt). */\nexport function tuanKe(tuan: string, huong: -1 | 1): string | null {\n  const t = congNgay(tuan, 7 * huong);\n  return t < TUAN_DAU || t > TUAN_CUOI ? null : t;\n}\n\n/** Ngày đã qua thì không hỏi máy chủ, không cho đặt. So chuỗi 'YYYY-MM-DD' được vì nó xếp theo thứ tự thời gian. */\nexport const daQua = (ngay: string) => ngay < HOM_NAY;",
  kiemTrung: "import type { LichHenCoGio } from '@/shared/api/phong-kham';\n\n/**\n * Chặn đặt trùng PHÍA CLIENT: người dùng đã có một lịch CÒN HIỆU LỰC (chưa huỷ) đúng giờ này — với bất kỳ bác sĩ nào —\n * thì không cho đặt/đổi sang giờ đó. `boQua`: lịch đang được đổi giờ (không tự trùng với chính nó).\n * Chỉ là lớp trải nghiệm: máy chủ vẫn kiểm lại và trả 409 (hai tab, hai máy, cache cũ đều lọt qua lớp này).\n */\nexport function timLichTrung(\n  lichCuaToi: readonly LichHenCoGio[] | undefined,\n  batDau: string,\n  boQua?: string,\n): LichHenCoGio | undefined {\n  return lichCuaToi?.find((lh) => lh.id !== boQua && lh.trangThai !== 'da-huy' && lh.batDau === batDau);\n}",
  tuanTest: "  test('01/10/2026 là thứ Năm; tuần của nó bắt đầu thứ Hai 28/09', () => {\n    expect(tenThu('2026-10-01')).toBe('Thứ Năm');\n    expect(thuTrongTuan('2026-10-04')).toBe(6); // Chủ nhật\n    expect(dauTuan('2026-10-01')).toBe('2026-09-28');\n    expect(dauTuan('2026-09-28')).toBe('2026-09-28');\n  });\n\n  test.each([\n    ['', 'thiếu'],\n    ['2026-10-06', 'không phải thứ Hai'],\n    ['2026-09-21', 'trước khoảng mở'],\n    ['2026-10-26', 'sau khoảng mở'],\n    ['5-10-2026', 'sai dạng'],\n  ])('?tuan=%s (%s) ⇒ tuần đầu', (tuan) => {\n    expect(docTuan(new URLSearchParams({ tuan }))).toBe(TUAN_DAU);\n  });",
  kiemTrungTest: "const benhNhan = { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567', ngaySinh: '1995-03-14' };\nconst lh = (id: string, batDau: string, trangThai: LichHenCoGio['trangThai'] = 'cho-xac-nhan'): LichHenCoGio => ({\n  id, bacSiId: 'bs-1', khungGioId: `kg-${id}`, batDau, benhNhan, lyDo: 'Khám định kỳ', trangThai,\n});",
  useLichTuan: "import { useQueries } from '@tanstack/react-query';\nimport { khoa } from '@/shared/api/khoa';\nimport { api } from '@/shared/api/phong-kham';\nimport type { KhungGio } from '@/types';\nimport { cacNgayTrongTuan, daQua } from './logic/tuan';\n\nexport interface NgayTrongTuan {\n  ngay: string;\n  trangThai: 'da-qua' | 'dang-tai' | 'loi' | 'xong';\n  khungGio: KhungGio[];\n}\n\n/**\n * Khung giờ của SÁU ngày trong một tuần = sáu query CHẠY SONG SONG (useQueries), mỗi ngày một mục cache —\n * đúng key mà ChonKhungGio (trang chi tiết bác sĩ) đang dùng. Hệ quả: ngày nào đã xem ở trang chi tiết thì lưới tuần\n * có ngay, không hỏi lại; đặt/huỷ/đổi giờ invalidate ['bac-si', id, 'khung-gio'] là cả hai màn hình cùng tươi lại.\n * Ngày đã qua, hoặc CHƯA BIẾT bác sĩ (trang đổi giờ đang chờ lịch hẹn về) ⇒ enabled = false ⇒ không gửi request nào.\n * (Thiếu điều kiện thứ hai: MSW bắt được GET /api/bac-si//khung-gio — id rỗng — ở Bài 10.3.)\n * combine: gộp 6 kết quả thành MỘT object cho component — và TanStack chỉ trả object mới khi kết quả thật sự đổi.\n */\nexport function useLichTuan(bacSiId: string | null, tuan: string) {\n  const ngays = cacNgayTrongTuan(tuan);\n  return useQueries({\n    queries: ngays.map((ngay) => ({\n      queryKey: khoa.khungGio(bacSiId ?? '', ngay),\n      queryFn: ({ signal }: { signal: AbortSignal }) => api.khungGio(bacSiId!, ngay, signal),\n      enabled: bacSiId !== null && !daQua(ngay),\n      staleTime: 30_000,\n    })),\n    combine: (kqs) => ({\n      ngay: kqs.map(\n        (q, i): NgayTrongTuan => ({\n          ngay: ngays[i],\n          trangThai: daQua(ngays[i]) ? 'da-qua' : q.isPending ? 'dang-tai' : q.isError && !q.data ? 'loi' : 'xong',\n          khungGio: q.data ?? [],\n        }),\n      ),\n      loi: kqs.find((q) => q.isError)?.error ?? null,\n      dangThuLai: kqs.some((q) => q.isError && q.isFetching),\n      thuLai: () => kqs.forEach((q) => q.isError && q.refetch()),\n    }),\n  });\n}",
  luoi: "import { useState } from 'react';\nimport { Link } from 'react-router';\nimport type { LichHenCoGio } from '@/shared/api/phong-kham';\nimport { useDemRender } from '@/shared/dev/dem-render';\nimport { duongDan } from '@/shared/duong-dan';\nimport { hienNgay, tenThu } from '@/shared/logic/thoi-gian';\nimport type { KhungGio } from '@/types';\nimport { timLichTrung } from './logic/kiem-trung';\nimport type { NgayTrongTuan } from './useLichTuan';\n\n/** Hai cách dùng MỘT lưới: xem để ĐẶT (mỗi ô trống là link sang form), hoặc CHỌN giờ mới cho một lịch đang đổi. */\nexport type CheDoLuoi =\n  | { kieu: 'dat' }\n  | { kieu: 'doi'; lichDangDoi: LichHenCoGio; dangChon: string | null; onChon: (kg: KhungGio) => void };\n\ninterface LuoiLichTuanProps {\n  bacSiId: string;\n  ngay: NgayTrongTuan[];\n  /** Lịch hẹn của người đang dùng (đã đăng nhập) — để CHẶN giờ trùng ngay trên lưới. Chưa đăng nhập: undefined. */\n  lichCuaToi?: LichHenCoGio[];\n  cheDo: CheDoLuoi;\n}\n\nconst gio = (iso: string) => iso.slice(11, 16);\nconst ngayNgan = (ngay: string) => hienNgay(ngay).slice(0, 5); // '06/10'\n\n/**\n * Lưới giờ × ngày. Là <table> THẬT (không phải div xếp lưới): trình đọc màn hình đọc được \"Thứ Ba 06/10, 09:30\"\n * cho từng ô nhờ <th scope=\"col\"> và <th scope=\"row\">, và phím tắt duyệt bảng của nó dùng được.\n */\nexport function LuoiLichTuan({ bacSiId, ngay, lichCuaToi, cheDo }: LuoiLichTuanProps) {\n  useDemRender('LuoiLichTuan');\n  // Hàng = mọi giờ xuất hiện trong tuần (máy chủ quyết định giờ khám, client không đoán)\n  const gioTuanNay = [...new Set(ngay.flatMap((n) => n.khungGio.map((kg) => gio(kg.batDau))))].sort();\n  // Chương 10 (Bài 10.3, đo bằng Profiler): đổi tuần ⇒ 6 query mới đều \"đang tải\" ⇒ chưa biết giờ nào ⇒ trước đây trang\n  // thay CẢ BẢNG bằng dòng \"Đang tải…\" rồi dựng lại (phase \"mount\" mỗi lần đổi tuần, bảng nháy, trang giật).\n  // Nhớ các giờ của lần vẽ trước (\"lưu thông tin từ lần render trước\" — react.dev) ⇒ bảng đứng yên, chỉ ô đổi thành \"…\".\n  const [gioCu, setGioCu] = useState<string[]>([]);\n  if (gioTuanNay.length > 0 && gioTuanNay.join() !== gioCu.join()) setGioCu(gioTuanNay);\n  const cacGio = gioTuanNay.length > 0 ? gioTuanNay : gioCu;\n  const dauTien = ngay[0].ngay, cuoi = ngay.at(-1)!.ngay;\n\n  if (cacGio.length === 0) {\n    return (\n      <p className=\"goi-y\" aria-busy=\"true\">\n        Đang tải lịch tuần…\n      </p>\n    );\n  }\n\n  function o(n: NgayTrongTuan, g: string) {\n    if (n.trangThai === 'da-qua') return <span className=\"o o-mo\">Đã qua</span>;\n    if (n.trangThai === 'dang-tai') return <span className=\"o o-mo\" aria-busy=\"true\">…</span>;\n    if (n.trangThai === 'loi') return <span className=\"o o-mo\">Lỗi</span>;\n    const kg = n.khungGio.find((k) => gio(k.batDau) === g);\n    if (!kg) return <span className=\"o o-mo\">—</span>;\n    const nhan = `${g} ${tenThu(n.ngay)} ${hienNgay(n.ngay)}`;\n    if (cheDo.kieu === 'doi' && kg.id === cheDo.lichDangDoi.khungGioId) return <span className=\"o o-hien-tai\">Giờ hiện tại</span>;\n    if (!kg.conTrong) return <span className=\"o o-kin\">Kín</span>;\n    const trung = timLichTrung(lichCuaToi, kg.batDau, cheDo.kieu === 'doi' ? cheDo.lichDangDoi.id : undefined);\n    if (trung) return <span className=\"o o-trung\" title={`Bạn đã có lịch ${trung.id} vào giờ này`}>Bạn có lịch</span>;\n    if (cheDo.kieu === 'dat') {\n      return (\n        <Link className=\"o o-trong\" to={duongDan.datLich(kg.id, bacSiId, n.ngay)} aria-label={`Đặt ${nhan}`}>\n          Trống\n        </Link>\n      );\n    }\n    return (\n      <button\n        type=\"button\"\n        className=\"o o-trong\"\n        aria-pressed={cheDo.dangChon === kg.id}\n        aria-label={`Chọn ${nhan}`}\n        onClick={() => cheDo.onChon(kg)}\n      >\n        {cheDo.dangChon === kg.id ? '✓ Đã chọn' : 'Trống'}\n      </button>\n    );\n  }\n\n  return (\n    <table className=\"luoi-tuan\">\n      <caption>\n        Lịch khám tuần {hienNgay(dauTien)} – {hienNgay(cuoi)}\n      </caption>\n      <thead>\n        <tr>\n          <th scope=\"col\">Giờ</th>\n          {ngay.map((n) => (\n            <th scope=\"col\" key={n.ngay}>\n              {tenThu(n.ngay)} <span className=\"ngay-nho\">{ngayNgan(n.ngay)}</span>\n            </th>\n          ))}\n        </tr>\n      </thead>\n      <tbody>\n        {cacGio.map((g) => (\n          <tr key={g}>\n            <th scope=\"row\">{g}</th>\n            {ngay.map((n) => (\n              <td key={n.ngay}>{o(n, g)}</td>\n            ))}\n          </tr>\n        ))}\n      </tbody>\n    </table>\n  );\n}",
  luoiO: "  function o(n: NgayTrongTuan, g: string) {\n    if (n.trangThai === 'da-qua') return <span className=\"o o-mo\">Đã qua</span>;\n    if (n.trangThai === 'dang-tai') return <span className=\"o o-mo\" aria-busy=\"true\">…</span>;\n    if (n.trangThai === 'loi') return <span className=\"o o-mo\">Lỗi</span>;\n    const kg = n.khungGio.find((k) => gio(k.batDau) === g);\n    if (!kg) return <span className=\"o o-mo\">—</span>;\n    const nhan = `${g} ${tenThu(n.ngay)} ${hienNgay(n.ngay)}`;\n    if (cheDo.kieu === 'doi' && kg.id === cheDo.lichDangDoi.khungGioId) return <span className=\"o o-hien-tai\">Giờ hiện tại</span>;\n    if (!kg.conTrong) return <span className=\"o o-kin\">Kín</span>;\n    const trung = timLichTrung(lichCuaToi, kg.batDau, cheDo.kieu === 'doi' ? cheDo.lichDangDoi.id : undefined);\n    if (trung) return <span className=\"o o-trung\" title={`Bạn đã có lịch ${trung.id} vào giờ này`}>Bạn có lịch</span>;\n    if (cheDo.kieu === 'dat') {\n      return (\n        <Link className=\"o o-trong\" to={duongDan.datLich(kg.id, bacSiId, n.ngay)} aria-label={`Đặt ${nhan}`}>\n          Trống\n        </Link>\n      );\n    }\n    return (\n      <button\n        type=\"button\"\n        className=\"o o-trong\"\n        aria-pressed={cheDo.dangChon === kg.id}\n        aria-label={`Chọn ${nhan}`}\n        onClick={() => cheDo.onChon(kg)}\n      >\n        {cheDo.dangChon === kg.id ? '✓ Đã chọn' : 'Trống'}\n      </button>\n    );\n  }",
  dieuHuong: "import { Link } from 'react-router';\nimport { hienNgay } from '@/shared/logic/thoi-gian';\nimport { tuanKe } from './logic/tuan';\n\n/**\n * \"← Tuần trước · Tuần sau →\". Tuần nằm trên URL (?tuan=…) như ngày ở Chương 7: F5, gửi link, Back đều đúng tuần.\n * replace: lướt qua bốn tuần không đẻ bốn mục lịch sử. Hết khoảng mở đặt lịch ⇒ chữ thường, KHÔNG phải link\n * (link bị \"tắt\" bằng CSS vẫn Tab tới được và vẫn bấm được bằng Enter).\n */\nexport function DieuHuongTuan({ tuan, taoLink }: { tuan: string; taoLink: (tuan: string) => string }) {\n  const truoc = tuanKe(tuan, -1), sau = tuanKe(tuan, 1);\n  return (\n    <nav className=\"dieu-huong-tuan\" aria-label=\"Chọn tuần\">\n      {truoc ? <Link to={taoLink(truoc)} replace>← Tuần trước</Link> : <span aria-hidden=\"true\">← Tuần trước</span>}\n      <strong>Tuần từ {hienNgay(tuan)}</strong>\n      {sau ? <Link to={taoLink(sau)} replace>Tuần sau →</Link> : <span aria-hidden=\"true\">Tuần sau →</span>}\n    </nav>\n  );\n}",
  trangLichTuan: "import { Link, useParams, useSearchParams } from 'react-router';\nimport { useBacSi } from '@/features/bac-si';\nimport { useDangNhapStore } from '@/features/dang-nhap';\nimport { useLichHen } from '@/features/lich-hen';\nimport { DieuHuongTuan, docTuan, LuoiLichTuan, useLichTuan } from '@/features/lich-tuan';\nimport { DoRender } from '@/shared/dev/DoRender';\nimport { duongDan } from '@/shared/duong-dan';\nimport { useTieuDeTrang } from '@/shared/hooks/useTieuDeTrang';\nimport { LoiTaiDuLieu } from '@/shared/ui/LoiTaiDuLieu';\n\n/**\n * /bac-si/:id/lich-tuan?tuan=2026-10-05 — Chương 10: lịch trống CẢ TUẦN của một bác sĩ. Ai cũng xem được;\n * bấm một ô trống ⇒ sang /dat-lich/… (sau cổng đăng nhập) như luồng cũ.\n * Đã đăng nhập ⇒ tải thêm \"lịch của tôi\" để lưới CHẶN giờ trùng ngay tại chỗ.\n */\nexport function TrangLichTuan() {\n  const { id = '' } = useParams<'id'>();\n  const [sp] = useSearchParams();\n  const tuan = docTuan(sp);\n  const daDangNhap = useDangNhapStore((s) => s.nguoiDung !== null);\n  const bacSiQ = useBacSi();\n  const lich = useLichTuan(id, tuan);\n  const { data: lichCuaToi } = useLichHen({ batDau: daDangNhap });\n  const bacSi = bacSiQ.data?.find((b) => b.id === id);\n  useTieuDeTrang(`Lịch tuần${bacSi ? ' · ' + bacSi.ten : ''} · Phòng khám An Tâm`);\n\n  if (bacSiQ.isSuccess && !bacSi) {\n    return (\n      <section>\n        <h2>Không có bác sĩ này</h2>\n        <Link to={duongDan.bacSi}>← Danh sách bác sĩ</Link>\n      </section>\n    );\n  }\n\n  return (\n    <section className=\"trang-lich-tuan\">\n      <Link className=\"nut nut-lui\" to={duongDan.chiTietBacSi(id)}>\n        ← Hồ sơ bác sĩ\n      </Link>\n      <h2>Lịch trống cả tuần{bacSi && ` — ${bacSi.ten}`}</h2>\n      <DieuHuongTuan tuan={tuan} taoLink={(t) => duongDan.lichTuan(id, t)} />\n      {lich.loi && <LoiTaiDuLieu tieuDe=\"Không tải được một số ngày\" loi={lich.loi} onThuLai={lich.thuLai} dangThuLai={lich.dangThuLai} />}\n      <DoRender id=\"LuoiLichTuan\">\n        <LuoiLichTuan bacSiId={id} ngay={lich.ngay} lichCuaToi={lichCuaToi} cheDo={{ kieu: 'dat' }} />\n      </DoRender>\n    </section>\n  );\n}",
  docNgayDat: "/**\n * Chương 10: ngày trên URL của TRANG ĐẶT LỊCH. docNgay ở trên chỉ biết ba ngày của bộ chọn ngày (Chương 5–7) —\n * lưới tuần gửi sang ngày 06/10 thì docNgay âm thầm đổi thành 01/10 ⇒ không thấy khung giờ ⇒ \"Không tìm thấy\n * khung giờ này\" (test mốc 2 bắt được). Trang đặt lịch nhận MỌI ngày khám hợp lệ trong khoảng mở đặt lịch.\n */\nexport function docNgayDat(sp: URLSearchParams): string {\n  const ngay = sp.get('ngay') ?? '';\n  const hopLe =\n    /^\\d{4}-\\d{2}-\\d{2}$/.test(ngay) && ngay >= HOM_NAY && ngay < congNgay(HOM_NAY, 7 * SO_TUAN_MO) && thuTrongTuan(ngay) !== 6;\n  return hopLe ? ngay : NGAY_KHAM[0];\n}",
  useDoiGio: "import { useMutation, useQueryClient } from '@tanstack/react-query';\nimport { khoa } from '@/shared/api/khoa';\nimport { api, type LichHenCoGio } from '@/shared/api/phong-kham';\nimport type { KhungGio } from '@/types';\n\n/**\n * Đổi giờ = GHI ⇒ useMutation. onSettled (không phải onSuccess): 409 \"vừa có người đặt\" nghĩa là lưới giờ đang\n * hiện ĐÃ CŨ — lỗi cũng phải tải lại, để người dùng thấy ngay ô đó giờ đã \"Kín\".\n * Trả Promise ⇒ mutateAsync chờ cả việc tải lại xong (không có khoảnh khắc hiện dữ liệu cũ).\n */\nexport function useDoiGio() {\n  const queryClient = useQueryClient();\n  return useMutation({\n    mutationFn: ({ lichHen, khungGio }: { lichHen: LichHenCoGio; khungGio: KhungGio }) => api.doiGio(lichHen.id, khungGio.id),\n    onSettled: (_kq, _loi, { lichHen }) =>\n      Promise.all([\n        queryClient.invalidateQueries({ queryKey: khoa.lichHen }),\n        queryClient.invalidateQueries({ queryKey: ['bac-si', lichHen.bacSiId, 'khung-gio'] }), // giờ cũ mở, giờ mới kín\n      ]),\n    meta: { tuXuLyLoi: true }, // lỗi hiện ngay trên trang đổi giờ (hộp alert), không cần thông báo nổi\n  });\n}",
  trangDoiGio: "import { useEffect, useRef, useState } from 'react';\nimport { Link, useNavigate, useParams, useSearchParams } from 'react-router';\nimport { useBacSi } from '@/features/bac-si';\nimport { useLichHen } from '@/features/lich-hen';\nimport { DieuHuongTuan, docTuan, LuoiLichTuan, timLichTrung, useDoiGio, useLichTuan } from '@/features/lich-tuan';\nimport { duongDan } from '@/shared/duong-dan';\nimport { useTieuDeTrang } from '@/shared/hooks/useTieuDeTrang';\nimport { hienGio } from '@/shared/logic/thoi-gian';\nimport type { KhungGio } from '@/types';\n\n/**\n * /lich-hen/:id/doi-gio?tuan=… — Chương 10: đổi giờ một lịch đang chờ xác nhận (sau cổng đăng nhập).\n * Chọn một ô trống trên lưới tuần ⇒ \"Xác nhận đổi\" ⇒ PATCH { khungGioId }.\n * Hai lớp chặn trùng: client (timLichTrung — ô trùng không bấm được, và kiểm lại ngay trước khi gửi) và máy chủ (409).\n */\nexport function TrangDoiGio() {\n  const { id = '' } = useParams<'id'>();\n  const [sp] = useSearchParams();\n  const tuan = docTuan(sp);\n  const navigate = useNavigate();\n  const lichHenQ = useLichHen();\n  const bacSiQ = useBacSi();\n  const doiGio = useDoiGio();\n  const [dangChon, setDangChon] = useState<KhungGio | null>(null);\n  const [loiClient, setLoiClient] = useState<string | null>(null);\n  const hopLoi = useRef<HTMLDivElement>(null);\n  const lh = lichHenQ.data?.find((x) => x.id === id);\n  const lich = useLichTuan(lh?.bacSiId ?? null, tuan); // null ⇒ chưa gọi API (query phụ thuộc, Bài 6.2)\n  useTieuDeTrang('Đổi giờ khám · Phòng khám An Tâm');\n\n  const loi = loiClient ?? (doiGio.error ? doiGio.error.message : null);\n  // Lỗi hiện ra ⇒ đưa focus tới nó: người dùng bàn phím/trình đọc màn hình biết ngay chuyện gì xảy ra (Chương 8)\n  useEffect(() => {\n    if (loi) hopLoi.current?.focus();\n  }, [loi]);\n\n  if (lichHenQ.isPending) return <p aria-busy=\"true\">Đang tải lịch hẹn…</p>;\n  if (!lh || lh.trangThai !== 'cho-xac-nhan') {\n    return (\n      <section>\n        <h2>Không đổi giờ được lịch hẹn này</h2>\n        <p>Chỉ lịch đang chờ xác nhận mới đổi được giờ.</p>\n        <Link to={duongDan.lichHen}>← Lịch hẹn của tôi</Link>\n      </section>\n    );\n  }\n  const lichDangDoi = lh; // hằng mới: TypeScript nhớ \"đã kiểm khác undefined\" cả trong hàm con bên dưới\n  const tenBacSi = bacSiQ.data?.find((b) => b.id === lichDangDoi.bacSiId)?.ten ?? lichDangDoi.bacSiId;\n\n  function chon(kg: KhungGio) {\n    setLoiClient(null);\n    doiGio.reset(); // chọn lại ⇒ xoá lỗi cũ của máy chủ\n    setDangChon(kg);\n  }\n\n  async function xacNhan() {\n    if (!dangChon) return;\n    // Lớp 1 (client): kiểm lại NGAY trước khi gửi — dữ liệu có thể đã đổi từ lúc vẽ lưới\n    const trung = timLichTrung(lichHenQ.data, dangChon.batDau, lichDangDoi.id);\n    if (trung) {\n      setLoiClient(`Bạn đã có lịch ${trung.id} lúc ${hienGio(trung.batDau)}. Chọn giờ khác.`);\n      return;\n    }\n    try {\n      await doiGio.mutateAsync({ lichHen: lichDangDoi, khungGio: dangChon });\n      navigate(duongDan.lichHen, { replace: true, state: { vuaDoi: lichDangDoi.id } });\n    } catch {\n      setDangChon(null); // Lớp 2 (máy chủ) từ chối: bỏ chọn — lưới đã tải lại, ô đó giờ hiện \"Kín\"\n    }\n  }\n\n  return (\n    <section className=\"trang-doi-gio\">\n      <h2>Đổi giờ khám</h2>\n      <dl className=\"tom-tat\">\n        <dt>Lịch hẹn</dt>\n        <dd>{lichDangDoi.id}</dd>\n        <dt>Bác sĩ</dt>\n        <dd>{tenBacSi}</dd>\n        <dt>Đang hẹn lúc</dt>\n        <dd>{hienGio(lichDangDoi.batDau)}</dd>\n      </dl>\n      {loi && (\n        <div className=\"hop-loi\" role=\"alert\" tabIndex={-1} ref={hopLoi}>\n          <p>\n            <strong>Chưa đổi được giờ.</strong> {loi}\n          </p>\n        </div>\n      )}\n      <DieuHuongTuan tuan={tuan} taoLink={(t) => duongDan.doiGio(lichDangDoi.id, t)} />\n      <LuoiLichTuan\n        bacSiId={lichDangDoi.bacSiId}\n        ngay={lich.ngay}\n        lichCuaToi={lichHenQ.data}\n        cheDo={{ kieu: 'doi', lichDangDoi, dangChon: dangChon?.id ?? null, onChon: chon }}\n      />\n      <div className=\"hang-nut\">\n        <button type=\"button\" className=\"nut nut-chinh\" disabled={!dangChon || doiGio.isPending} onClick={xacNhan}>\n          {doiGio.isPending ? 'Đang đổi…' : dangChon ? `Xác nhận đổi sang ${hienGio(dangChon.batDau)}` : 'Chọn một giờ trống'}\n        </button>\n        <Link to={duongDan.lichHen}>Huỷ, quay lại</Link>\n      </div>\n    </section>\n  );\n}",
  xacNhan: "  async function xacNhan() {\n    if (!dangChon) return;\n    // Lớp 1 (client): kiểm lại NGAY trước khi gửi — dữ liệu có thể đã đổi từ lúc vẽ lưới\n    const trung = timLichTrung(lichHenQ.data, dangChon.batDau, lichDangDoi.id);\n    if (trung) {\n      setLoiClient(`Bạn đã có lịch ${trung.id} lúc ${hienGio(trung.batDau)}. Chọn giờ khác.`);\n      return;\n    }\n    try {\n      await doiGio.mutateAsync({ lichHen: lichDangDoi, khungGio: dangChon });\n      navigate(duongDan.lichHen, { replace: true, state: { vuaDoi: lichDangDoi.id } });\n    } catch {\n      setDangChon(null); // Lớp 2 (máy chủ) từ chối: bỏ chọn — lưới đã tải lại, ô đó giờ hiện \"Kín\"\n    }\n  }",
  focusLoi: "  const loi = loiClient ?? (doiGio.error ? doiGio.error.message : null);\n  // Lỗi hiện ra ⇒ đưa focus tới nó: người dùng bàn phím/trình đọc màn hình biết ngay chuyện gì xảy ra (Chương 8)\n  useEffect(() => {\n    if (loi) hopLoi.current?.focus();\n  }, [loi]);\n  …\n      {loi && (\n        <div className=\"hop-loi\" role=\"alert\" tabIndex={-1} ref={hopLoi}>\n          <p>\n            <strong>Chưa đổi được giờ.</strong> {loi}\n          </p>\n        </div>\n      )}",
  nutDoiGio: "              {lh.trangThai === 'cho-xac-nhan' && (\n                <>\n                  <button type=\"button\" className=\"nut nut-nho\" onClick={() => huyLich(lh)} aria-label={`Huỷ lịch ${lh.id}`}>\n                    Huỷ\n                  </button>\n                  {/* Chương 10 */}\n                  <Link className=\"nut nut-nho\" to={duongDan.doiGio(lh.id)} aria-label={`Đổi giờ lịch ${lh.id}`}>\n                    Đổi giờ\n                  </Link>\n                </>\n              )}",
  testTuanDau: "const ngayDaHoi: string[] = [];\nbeforeEach(() => {\n  server.events.on('request:start', ({ request }) => {\n    const u = new URL(request.url);\n    if (u.pathname.endsWith('/khung-gio')) ngayDaHoi.push(u.searchParams.get('ngay')!);\n  });\n});\n\n  test('tuần đầu: 6 cột thứ Hai → thứ Bảy, 3 ngày đã qua KHÔNG hỏi máy chủ', async () => {\n    veTrang('/bac-si/bs-2/lich-tuan');\n    expect(await screen.findByRole('table', { name: 'Lịch khám tuần 28/09/2026 – 03/10/2026' })).toBeInTheDocument();\n    expect(cot()).toEqual(['Giờ', 'Thứ Hai 28/09', 'Thứ Ba 29/09', 'Thứ Tư 30/09', 'Thứ Năm 01/10', 'Thứ Sáu 02/10', 'Thứ Bảy 03/10']);\n    expect(screen.getAllByText('Đã qua')).toHaveLength(3 * 4);\n    expect(ngayDaHoi.sort()).toEqual(['2026-10-01', '2026-10-02', '2026-10-03']);\n  });",
  testCacheChung: "  test('đi từ trang chi tiết sang: ngày 01/10 đã có trong cache ⇒ lưới tuần chỉ hỏi 2 ngày còn lại', async () => {\n    const user = userEvent.setup();\n    await veTrangCho('/bac-si/bs-2');\n    await screen.findAllByRole('link', { name: /· 01\\/10\\/2026$/ });\n    expect(ngayDaHoi).toEqual(['2026-10-01']);\n    await user.click(screen.getByRole('link', { name: 'Xem lịch trống cả tuần →' }));\n    await screen.findAllByRole('link', { name: /^Đặt .* 03\\/10\\/2026$/ });\n    expect(ngayDaHoi.sort()).toEqual(['2026-10-01', '2026-10-02', '2026-10-03']); // chỉ thêm 02 và 03\n  });",
  testTuanSauForm: "  test('bấm một ô của TUẦN SAU ⇒ tới được form đặt lịch đúng giờ đó', async () => {\n    useDangNhapStore.setState({ nguoiDung: { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567' } });\n    const user = userEvent.setup();\n    veTrang('/bac-si/bs-2/lich-tuan?tuan=2026-10-05');\n    await user.click(await screen.findByRole('link', { name: 'Đặt 09:30 Thứ Ba 06/10/2026' }));\n    expect(await screen.findByRole('heading', { name: 'Đặt lịch khám' })).toBeInTheDocument();\n    expect(screen.getByText('09:30 · 06/10/2026')).toBeInTheDocument();\n  });",
  testMotNgayLoi: "  test('MỘT ngày lỗi 500 ⇒ các ngày khác vẫn hiện, cột đó \"Lỗi\" + hộp \"Thử lại\"; thử lại được ⇒ đủ cả tuần', async () => {\n    const user = userEvent.setup();\n    let soLanHong = 0;\n    server.use(\n      // Chỉ ngày 02/10, chỉ lần ĐẦU. Trả undefined ⇒ MSW rơi xuống handler thường. (Không dùng { once: true }:\n      // \"once\" bị tiêu ngay ở request ĐẦU TIÊN khớp đường dẫn — ngày 01/10 — dù handler trả undefined. Đo thật.)\n      http.get('/api/bac-si/:id/khung-gio', ({ request }) => {\n        if (new URL(request.url).searchParams.get('ngay') !== '2026-10-02' || soLanHong++ > 0) return undefined;\n        return HttpResponse.json({ loi: 'Máy chủ đang bận, thử lại sau' }, { status: 500 });\n      }),\n    );\n    veTrang('/bac-si/bs-2/lich-tuan');\n    expect(await screen.findByRole('alert')).toHaveTextContent('Không tải được một số ngày');\n    expect(await screen.findAllByText('Lỗi')).toHaveLength(4); // hộp lỗi có thể hiện TRƯỚC khi hai ngày kia về\n    expect(screen.getByRole('link', { name: 'Đặt 14:00 Thứ Năm 01/10/2026' })).toBeInTheDocument();\n    await user.click(screen.getByRole('button', { name: 'Thử lại' }));\n    expect(await screen.findByRole('link', { name: 'Đặt 09:30 Thứ Sáu 02/10/2026' })).toBeInTheDocument();\n    expect(screen.queryByRole('alert')).not.toBeInTheDocument();\n  });",
  testBanCoLich: "  test('đã đăng nhập và có lịch lúc 09:30 thứ Sáu 02/10 (với bác sĩ KHÁC) ⇒ ô đó là \"Bạn có lịch\", không phải link', async () => {\n    useDangNhapStore.setState({ nguoiDung: { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567' } });\n    const kg = khungGioTrongNgay('bs-1', '2026-10-02').find((k) => k.id.endsWith('0930'))!;\n    db.themLichHen({ bacSiId: 'bs-1', khungGioId: kg.id, batDau: kg.batDau, benhNhan: { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567', ngaySinh: '1995-03-14' }, lyDo: 'Khám định kỳ', trangThai: 'cho-xac-nhan' });\n    veTrang('/bac-si/bs-2/lich-tuan');\n    expect(await screen.findByText('Bạn có lịch')).toHaveAttribute('title', 'Bạn đã có lịch lh-1 vào giờ này');\n    expect(screen.queryByRole('link', { name: 'Đặt 09:30 Thứ Sáu 02/10/2026' })).not.toBeInTheDocument();\n  });",
  testDoiGioChuanBi: "const benhNhan = { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567', ngaySinh: '1995-03-14' };\n/** Đặt sẵn một lịch trong \"cơ sở dữ liệu\" giả, giữ đúng luật: khung giờ đã đặt thì kín. */\nfunction datSan(bacSiId: string, ngay: string, gio: string) {\n  const kg = khungGioTrongNgay(bacSiId, ngay).find((k) => k.id.endsWith(gio))!;\n  kg.conTrong = false;\n  return db.themLichHen({ bacSiId, khungGioId: kg.id, batDau: kg.batDau, benhNhan, lyDo: 'Khám định kỳ', trangThai: 'cho-xac-nhan' });\n}",
  testDoiGioOk: "  test('chọn 09:30 thứ Sáu ⇒ xác nhận ⇒ về /lich-hen, lịch mang giờ mới, giờ cũ mở lại', async () => {\n    const { user, router } = await moTrang();\n    expect(screen.getByText('Giờ hiện tại')).toBeInTheDocument();\n    await user.click(screen.getByRole('button', { name: 'Chọn 09:30 Thứ Sáu 02/10/2026' }));\n    expect(screen.getByRole('button', { name: 'Chọn 09:30 Thứ Sáu 02/10/2026' })).toHaveAttribute('aria-pressed', 'true');\n    await user.click(screen.getByRole('button', { name: 'Xác nhận đổi sang 09:30 · 02/10/2026' }));\n    expect(await screen.findByText('Đã đổi giờ lịch hẹn lh-1. Giờ cũ đã được trả lại cho người khác đặt.')).toBeInTheDocument();\n    expect(router.state.location.pathname).toBe('/lich-hen');\n    expect(await screen.findByText(/09:30 · 02\\/10\\/2026/)).toBeInTheDocument();\n    expect(db.timKhungGio('bs-2-2026-10-01-1400')?.conTrong).toBe(true);\n    expect(db.timKhungGio('bs-2-2026-10-02-0930')?.conTrong).toBe(false);\n  });",
  testDoiGio409: "  test('người khác vừa đặt mất giờ đã chọn ⇒ 409 ⇒ hộp lỗi NHẬN FOCUS, ô đó thành \"Kín\", vẫn ở trang', async () => {\n    const { user, router } = await moTrang();\n    await user.click(screen.getByRole('button', { name: 'Chọn 09:30 Thứ Sáu 02/10/2026' }));\n    db.timKhungGio('bs-2-2026-10-02-0930')!.conTrong = false; // \"người khác\" đặt đúng lúc này\n    await user.click(screen.getByRole('button', { name: 'Xác nhận đổi sang 09:30 · 02/10/2026' }));\n    const loi = await screen.findByRole('alert');\n    expect(loi).toHaveTextContent('Chưa đổi được giờ. Khung giờ này vừa có người đặt');\n    expect(loi).toHaveFocus();\n    expect(screen.queryByRole('button', { name: 'Chọn 09:30 Thứ Sáu 02/10/2026' })).not.toBeInTheDocument();\n    const hang = screen.getByRole('rowheader', { name: '09:30' }).closest('tr')!;\n    expect(within(hang).getAllByRole('cell')[4]).toHaveTextContent('Kín');\n    expect(screen.getByRole('button', { name: 'Chọn một giờ trống' })).toBeDisabled();\n    expect(router.state.location.pathname).toBe('/lich-hen/lh-1/doi-gio');\n    expect(db.lichHen()[0].khungGioId).toBe('bs-2-2026-10-01-1400'); // không đổi gì\n  });",
  testLopMayChu: "  test('lớp máy chủ: lịch trùng được tạo ở MÁY KHÁC sau khi trang đã tải ⇒ client không biết ⇒ máy chủ trả 409', async () => {\n    const { user } = await moTrang();\n    await user.click(screen.getByRole('button', { name: 'Chọn 09:30 Thứ Sáu 02/10/2026' }));\n    datSan('bs-1', '2026-10-02', '0930'); // tab khác / điện thoại khác vừa đặt — cache của trang này chưa biết\n    await user.click(screen.getByRole('button', { name: 'Xác nhận đổi sang 09:30 · 02/10/2026' }));\n    expect(await screen.findByRole('alert')).toHaveTextContent('Bạn đã có một lịch khác vào đúng giờ này');\n    expect(soPatch).toHaveLength(1);\n    // lưới đã tải lại (onSettled) ⇒ giờ lớp client cũng thấy lịch trùng\n    const hang = screen.getByRole('rowheader', { name: '09:30' }).closest('tr')!;\n    expect(within(hang).getAllByRole('cell')[4]).toHaveTextContent('Bạn có lịch');\n  });",
  testLopClient: "  test('lớp client: đã có lịch 09:30 thứ Sáu với bác sĩ khác ⇒ ô đó \"Bạn có lịch\", không nút, không PATCH nào', async () => {\n    datSan('bs-1', '2026-10-02', '0930'); // lh-2\n    await moTrang();\n    const hang = screen.getByRole('rowheader', { name: '09:30' }).closest('tr')!;\n    expect(within(hang).getAllByRole('cell')[4]).toHaveTextContent('Bạn có lịch');\n    expect(screen.queryByRole('button', { name: 'Chọn 09:30 Thứ Sáu 02/10/2026' })).not.toBeInTheDocument();\n    expect(soPatch).toEqual([]);\n  });",
  gioCu: "  const gioTuanNay = [...new Set(ngay.flatMap((n) => n.khungGio.map((kg) => gio(kg.batDau))))].sort();\n  // Chương 10 (Bài 10.3, đo bằng Profiler): đổi tuần ⇒ 6 query mới đều \"đang tải\" ⇒ chưa biết giờ nào ⇒ trước đây trang\n  // thay CẢ BẢNG bằng dòng \"Đang tải…\" rồi dựng lại (phase \"mount\" mỗi lần đổi tuần, bảng nháy, trang giật).\n  // Nhớ các giờ của lần vẽ trước (\"lưu thông tin từ lần render trước\" — react.dev) ⇒ bảng đứng yên, chỉ ô đổi thành \"…\".\n  const [gioCu, setGioCu] = useState<string[]>([]);\n  if (gioTuanNay.length > 0 && gioTuanNay.join() !== gioCu.join()) setGioCu(gioTuanNay);\n  const cacGio = gioTuanNay.length > 0 ? gioTuanNay : gioCu;\n  const dauTien = ngay[0].ngay, cuoi = ngay.at(-1)!.ngay;\n\n  if (cacGio.length === 0) {\n    return (\n      <p className=\"goi-y\" aria-busy=\"true\">\n        Đang tải lịch tuần…\n      </p>\n    );\n  }",
  testHieuNang: "  test('đổi tuần: bảng KHÔNG bị dựng lại (Profiler chỉ thấy \"update\"), vẫn là CÙNG một <table>', async () => {\n    const user = userEvent.setup();\n    veTrang('/bac-si/bs-2/lich-tuan');\n    await screen.findAllByRole('link', { name: /^Đặt .* 03\\/10\\/2026$/ });\n    const bang = screen.getByRole('table');\n    demRender.clear();\n    nhatKyDo.length = 0;\n    await user.click(screen.getByRole('link', { name: 'Tuần sau →' }));\n    await screen.findAllByRole('link', { name: /^Đặt .* 10\\/10\\/2026$/ });\n    const pha = nhatKyDo.filter((x) => x.id === 'LuoiLichTuan').map((x) => x.phase);\n    expect(pha).not.toContain('mount');\n    expect(screen.getByRole('table')).toBe(bang); // cùng nút DOM: không nháy, không giật trang\n    expect(demRender.get('LuoiLichTuan')).toBeLessThanOrEqual(3);\n  });",
  testAxe: "  test.each([\n    ['/bac-si/bs-2/lich-tuan', /^Đặt .* 03\\/10\\/2026$/, 'link'],\n    ['/lich-hen/lh-1/doi-gio', /^Chọn .* 03\\/10\\/2026$/, 'button'],\n  ] as const)('axe: %s không có lỗi nào', async (url, ten, vaiTro) => {\n    veTrang(url);\n    await screen.findAllByRole(vaiTro, { name: ten });\n    expect(await loiAxe()).toEqual([]);\n  });",
  testBanPhim: "  test('bàn phím: Tab tới một ô trống, Space để chọn, Tab tới \"Xác nhận…\", Enter ⇒ đổi xong', async () => {\n    const user = userEvent.setup();\n    const { router } = veTrang('/lich-hen/lh-1/doi-gio');\n    const o = await screen.findByRole('button', { name: 'Chọn 09:30 Thứ Sáu 02/10/2026' });\n    await screen.findAllByRole('button', { name: /^Chọn .* 03\\/10\\/2026$/ });\n    let soPhim = 0;\n    while (document.activeElement !== o && soPhim < 40) { await user.tab(); soPhim++; }\n    expect(o).toHaveFocus();\n    await user.keyboard(' ');\n    expect(o).toHaveAttribute('aria-pressed', 'true');\n    let them = 0;\n    const nutXacNhan = screen.getByRole('button', { name: 'Xác nhận đổi sang 09:30 · 02/10/2026' });\n    while (document.activeElement !== nutXacNhan && them < 40) { await user.tab(); them++; }\n    expect(nutXacNhan).toHaveFocus();\n    await user.keyboard('{Enter}');\n    await screen.findByText('Đã đổi giờ lịch hẹn lh-1. Giờ cũ đã được trả lại cho người khác đặt.');\n    expect(router.state.location.pathname).toBe('/lich-hen');\n    console.log(`[bàn phím] ${soPhim} lần Tab tới ô 09:30 thứ Sáu, thêm ${them} lần tới nút Xác nhận`);\n  });",
  napTruoc: "// Hai trang này là route LAZY: lần đầu một file test mở chúng, Vitest phải biên dịch cả trang ngay lúc đó. Chạy CẢ bộ\n// (30 file song song) thì lần mở đầu mất 1,07–1,38 giây > 1 giây của findBy ⇒ test đầu tiên đỏ, chạy riêng lại xanh (đo thật).\n// Nạp trước một lần ở đây: phép đo bên dưới đo React, không đo trình biên dịch.\nbeforeAll(async () => {\n  await Promise.all([import('@/pages/TrangLichTuan'), import('@/pages/TrangDoiGio')]);\n});",
  enabledSai: "// TrangDoiGio — bản đầu\nconst lich = useLichTuan(lh?.bacSiId ?? '', tuan); // lịch hẹn chưa về ⇒ '' ⇒ vẫn gọi API",
  enabledDung: "  const lich = useLichTuan(lh?.bacSiId ?? null, tuan); // null ⇒ chưa gọi API (query phụ thuộc, Bài 6.2)\n// useLichTuan.ts\n      enabled: bacSiId !== null && !daQua(ngay),",
  testEnabled: "  test('chưa có lịch hẹn (chưa biết bác sĩ) thì KHÔNG hỏi khung giờ: mọi request đều của bs-2', async () => {\n    await moTrang();\n    expect(khungGioDaHoi.length).toBeGreaterThan(0);\n    expect([...new Set(khungGioDaHoi.map((u) => u.split('/')[3]))]).toEqual(['bs-2']); // '/api/bac-si/bs-2/khung-gio'\n  });",
  onceSai: "  server.use(\n    http.get('/api/bac-si/:id/khung-gio', ({ request }) => {\n      soLanChay++;\n      if (new URL(request.url).searchParams.get('ngay') !== '2026-10-02') return undefined;\n      return HttpResponse.json({ loi: 'Máy chủ đang bận' }, { status: 500 });\n    }, { once: true }),\n  );",
  dotBien: "const DB = {\n  'doc-ngay-cu': ['src/pages/TrangDatLich.tsx', 'const ngay = docNgayDat(sp);', 'const ngay = docNgay(sp);', 'src/pages/TrangLichTuan.test.tsx'],\n  'onsuccess': ['src/features/lich-tuan/useDoiGio.ts', '    onSettled: (_kq, _loi, { lichHen }) =>', '    onSuccess: (_kq, { lichHen }) =>', 'src/pages/TrangDoiGio.test.tsx'],\n  'bo-focus': ['src/pages/TrangDoiGio.tsx', '    if (loi) hopLoi.current?.focus();', '    if (loi) void 0;', 'src/pages/TrangDoiGio.test.tsx'],\n  'bo-chan-client': ['src/features/lich-tuan/LuoiLichTuan.tsx', '    if (trung) return', '    if (false && trung) return', 'src/pages/TrangDoiGio.test.tsx src/pages/TrangLichTuan.test.tsx'],\n  'bo-chan-may-chu': ['src/mocks/handlers.ts', \"      if (trungGio(cu.benhNhan.soDienThoai, kgMoi.batDau, cu.id)) return loi409('Bạn đã có một lịch khác vào đúng giờ này');\\n\", '', 'src/pages/TrangDoiGio.test.tsx'],\n  'bo-enabled': ['src/features/lich-tuan/useLichTuan.ts', '      enabled: bacSiId !== null && !daQua(ngay),', '      enabled: bacSiId !== null,', 'src/pages/TrangLichTuan.test.tsx'],\n  'thieu-enabled-bac-si': ['src/features/lich-tuan/useLichTuan.ts', '      enabled: bacSiId !== null && !daQua(ngay),', '      enabled: !daQua(ngay),', 'src/pages/TrangDoiGio.test.tsx'],\n  'chu-nhat': ['src/features/lich-tuan/logic/tuan.ts', '{ length: 6 }', '{ length: 7 }', 'src/features/lich-tuan src/pages/TrangLichTuan.test.tsx'],\n  'bo-giu-gio': ['src/features/lich-tuan/LuoiLichTuan.tsx', '  const cacGio = gioTuanNay.length > 0 ? gioTuanNay : gioCu;', '  const cacGio = gioTuanNay;', 'src/features/lich-tuan/lich-tuan.chat-luong.test.tsx'],\n  'mo-giu-gio-cu': ['src/mocks/handlers.ts', '      if (kgCu) kgCu.conTrong = true; // giờ cũ mở lại cho người khác\\n', '', 'src/pages/TrangDoiGio.test.tsx'],\n};",
  doLuoi: "    await p.getByRole('link', { name: 'Tuần sau →' }).click();\n    await p.getByRole('link', { name: new RegExp(`^Đặt .* ${ngayCuoi.replaceAll('/', '\\\\/')}$`) }).first().waitFor();\n    await p.waitForTimeout(200);\n    const kq = await p.evaluate((t0) => ({\n      pha: window.__nhatKyDo.filter((x) => x.id === 'LuoiLichTuan').map((x) => `${x.phase} ${x.actualDuration.toFixed(1)}ms`),\n      cungBang: document.querySelector('table')?.dataset.cu === '1',",
  thieuRouter: "// DanhSachLichHen.test.tsx — Chương 12\nrenderVoiQuery(<DanhSachLichHen tenBacSi={() => 'BS. Trần Thu Hà'} />);\n// Chương 10: component giờ có <Link> \"Đổi giờ\" ⇒ cần router\n  renderVoiRouter(<DanhSachLichHen tenBacSi={() => 'BS. Trần Thu Hà'} />, '/lich-hen'); // Chương 10: có Link \"Đổi giờ\" ⇒ cần router",
  nginx: "# Chương 10 — nginx phục vụ bản build tĩnh của app React (SPA). Đặt ở /etc/nginx/conf.d/default.conf.\nserver {\n  listen 80;\n  root /usr/share/nginx/html;\n\n  # 1) File có mã băm trong tên (Vite đặt: index-C1ncXCfa.css) ⇒ nội dung KHÔNG BAO GIỜ đổi ⇒ cache 1 năm.\n  #    Không có ⇒ 404 THẬT. Đừng trả index.html ở đây: trình duyệt nhận HTML thay cho JS và báo lỗi khó hiểu.\n  location /assets/ {\n    try_files $uri =404;\n    add_header Cache-Control \"public, max-age=31536000, immutable\";\n  }\n\n  # 2) Mọi đường dẫn khác: file có thật thì trả file (favicon, mockServiceWorker.js…), không có thì trả index.html\n  #    ⇒ React Router trong trình duyệt đọc URL và vẽ đúng trang. Đây là \"SPA fallback\".\n  location / {\n    try_files $uri /index.html;\n    add_header Cache-Control \"no-cache\"; # index.html luôn hỏi lại ⇒ deploy mới là người dùng thấy ngay\n  }\n}",
  nginxCa: "server {\n  listen 80;\n  root /usr/share/nginx/html;\n  location / { try_files $uri $uri/ /index.html; }\n}",
  redirects: "/*    /index.html   200",
  vercel: "{\n  \"rewrites\": [{ \"source\": \"/((?!assets/).*)\", \"destination\": \"/index.html\" }]\n}",
  scripts: "\"scripts\": {\n  \"dev\": \"vite\",\n  \"build\": \"tsc -b && vite build\",\n  \"preview\": \"vite preview\",\n  \"test\": \"vitest\",\n  \"test:cov\": \"vitest run --coverage\"\n}",
  preloadError: "/**\n * Chương 10 (Bài 10.4): tab mở TỪ TRƯỚC một lần deploy vẫn chạy mã cũ; bấm sang trang lazy ⇒ nó xin một chunk tên CŨ\n * mà máy chủ đã thay ⇒ 404. React Router 8.4 nuốt lỗi import của `lazy: { Component }` ⇒ trang TRẮNG, không báo gì\n * (đo thật trên Chromium + nginx). Vite phát `vite:preloadError` khi import() động hỏng ⇒ tải lại trang để lấy\n * index.html MỚI (trỏ tới chunk mới) — tải thẳng trang ĐANG ĐỊNH MỞ (router.state.navigation), không phải trang cũ.\n * Chặn vòng lặp: tối đa một lần tự tải lại trong 10 giây.\n */\nwindow.addEventListener('vite:preloadError', (e) => {\n  const lanTruoc = Number(sessionStorage.getItem('tu-tai-lai-luc') ?? 0);\n  if (Date.now() - lanTruoc < 10_000) return; // vừa tải lại mà vẫn hỏng ⇒ không phải \"tab cũ\", đừng lặp vô hạn\n  sessionStorage.setItem('tu-tai-lai-luc', String(Date.now()));\n  e.preventDefault(); // báo Vite: đã xử lý, đừng ném lỗi tiếp\n  const dich = router.state.navigation.location; // URL chưa đổi: Router đợi mã trang mới xong mới đổi\n  window.location.assign(dich ? dich.pathname + dich.search + dich.hash : window.location.href);\n});",
};

/* ─── Output THẬT (Vitest 5.0.2, Vite 8.3.1, Chromium 149, nginx 1.27) — chép nguyên văn, chỉ rút bớt dòng ─── */
const OUT = {
  m1: "$ npx vitest run src/features/lich-tuan/logic --reporter=verbose\n ✓ kiem-trung > có lịch chưa huỷ đúng giờ đó (bác sĩ nào cũng vậy) ⇒ trùng\n ✓ kiem-trung > lịch đã huỷ, lịch khác giờ, danh sách chưa tải ⇒ không trùng\n ✓ kiem-trung > đổi giờ: lịch đang đổi không tự trùng với chính nó\n ✓ tuan > 01/10/2026 là thứ Năm; tuần của nó bắt đầu thứ Hai 28/09\n ✓ tuan > cộng ngày qua tháng và qua năm\n ✓ tuan > một tuần khám = thứ Hai → thứ Bảy, không có Chủ nhật\n ✓ tuan > bốn tuần mở đặt lịch: 28/09 → 19/10; ra ngoài ⇒ null\n ✓ tuan > ?tuan= (thiếu) ⇒ tuần đầu\n ✓ tuan > ?tuan=2026-10-06 (không phải thứ Hai) ⇒ tuần đầu\n ✓ tuan > ?tuan=2026-09-21 (trước khoảng mở) ⇒ tuần đầu\n ✓ tuan > ?tuan=2026-10-26 (sau khoảng mở) ⇒ tuần đầu\n ✓ tuan > ?tuan=5-10-2026 (sai dạng) ⇒ tuần đầu\n ✓ tuan > ?tuan hợp lệ được giữ nguyên; ngày trước hôm nay (01/10) là \"đã qua\"\n      Tests  13 passed (13)\n   Duration  1.66s (environment 46%, transform 29%, setup 24%, tests 1%)",
  m2Loi: "$ npx vitest run src/pages/TrangLichTuan.test.tsx --reporter=verbose\n ✓ tuần đầu: 6 cột thứ Hai → thứ Bảy, 3 ngày đã qua KHÔNG hỏi máy chủ\n ✓ ô trống là link sang form đặt lịch, mang đúng bác sĩ + ngày; ô kín không bấm được\n ✓ \"Tuần sau →\" ⇒ ?tuan=2026-10-05 (replace), hỏi đủ 6 ngày mới; tuần cuối không còn link \"Tuần sau\"\n ✓ ?tuan gõ bậy ⇒ tuần đầu, không trang trắng\n ✓ đi từ trang chi tiết sang: ngày 01/10 đã có trong cache ⇒ lưới tuần chỉ hỏi 2 ngày còn lại\n ✓ đã đăng nhập và có lịch lúc 09:30 thứ Sáu 02/10 (với bác sĩ KHÁC) ⇒ ô đó là \"Bạn có lịch\", không phải link\n × bấm một ô của TUẦN SAU ⇒ tới được form đặt lịch đúng giờ đó\n   → Unable to find role=\"heading\" and name \"Đặt lịch khám\"\n…\n      <section>\n        <h2>\n          Không tìm thấy khung giờ này\n        </h2>\n…\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n Test Files  1 failed (1)\n      Tests  1 failed | 6 passed (7)",
  m2Xanh: "$ npx vitest run src/pages/TrangLichTuan.test.tsx --reporter=verbose\n ✓ tuần đầu: 6 cột thứ Hai → thứ Bảy, 3 ngày đã qua KHÔNG hỏi máy chủ\n ✓ ô trống là link sang form đặt lịch, mang đúng bác sĩ + ngày; ô kín không bấm được\n ✓ \"Tuần sau →\" ⇒ ?tuan=2026-10-05 (replace), hỏi đủ 6 ngày mới; tuần cuối không còn link \"Tuần sau\"\n ✓ MỘT ngày lỗi 500 ⇒ các ngày khác vẫn hiện, cột đó \"Lỗi\" + hộp \"Thử lại\"; thử lại được ⇒ đủ cả tuần\n ✓ ?tuan gõ bậy ⇒ tuần đầu, không trang trắng\n ✓ đi từ trang chi tiết sang: ngày 01/10 đã có trong cache ⇒ lưới tuần chỉ hỏi 2 ngày còn lại\n ✓ đã đăng nhập và có lịch lúc 09:30 thứ Sáu 02/10 (với bác sĩ KHÁC) ⇒ ô đó là \"Bạn có lịch\", không phải link\n ✓ bấm một ô của TUẦN SAU ⇒ tới được form đặt lịch đúng giờ đó\n      Tests  8 passed (8)",
  m34: "$ npx vitest run src/pages/TrangDoiGio.test.tsx --reporter=verbose\n ✓ chọn 09:30 thứ Sáu ⇒ xác nhận ⇒ về /lich-hen, lịch mang giờ mới, giờ cũ mở lại\n ✓ người khác vừa đặt mất giờ đã chọn ⇒ 409 ⇒ hộp lỗi NHẬN FOCUS, ô đó thành \"Kín\", vẫn ở trang\n ✓ lớp client: đã có lịch 09:30 thứ Sáu với bác sĩ khác ⇒ ô đó \"Bạn có lịch\", không nút, không PATCH nào\n ✓ lớp máy chủ: lịch trùng được tạo ở MÁY KHÁC sau khi trang đã tải ⇒ client không biết ⇒ máy chủ trả 409\n ✓ chưa có lịch hẹn (chưa biết bác sĩ) thì KHÔNG hỏi khung giờ: mọi request đều của bs-2\n ✓ lịch đã huỷ ⇒ không đổi được giờ\n      Tests  6 passed (6)",
  chatLuong: "$ npx vitest run src/features/lich-tuan/lich-tuan.chat-luong.test.tsx --reporter=verbose --silent=false\n[bàn phím] 10 lần Tab tới ô 09:30 thứ Sáu, thêm 6 lần tới nút Xác nhận\n ✓ Bài 10.3 — hiệu năng > đổi tuần: bảng KHÔNG bị dựng lại (Profiler chỉ thấy \"update\"), vẫn là CÙNG một <table>\n ✓ Bài 10.3 — khả năng tiếp cận > axe: /bac-si/bs-2/lich-tuan không có lỗi nào\n ✓ Bài 10.3 — khả năng tiếp cận > axe: /lich-hen/lh-1/doi-gio không có lỗi nào\n ✓ Bài 10.3 — khả năng tiếp cận > bàn phím: Tab tới một ô trống, Space để chọn, Tab tới \"Xác nhận…\", Enter ⇒ đổi xong\n      Tests  4 passed (4)",
  thieuEnabled: "stderr | Bài 10.3 — khả năng tiếp cận > axe: /lich-hen/lh-1/doi-gio không có lỗi nào\n[MSW] Error: intercepted a request without a matching request handler:\n\n  • GET /api/bac-si//khung-gio?ngay=2026-10-01\n\nIf you still wish to intercept this unhandled request, please create a request handler for it.\nRead more: https://mswjs.io/docs/http/intercepting-requests\n…\n ✓ Bài 10.3 — khả năng tiếp cận > axe: /lich-hen/lh-1/doi-gio không có lỗi nào\n      Tests  4 passed (4)",
  dbEnabled: "# useLichTuan: enabled: bacSiId !== null && !daQua(ngay)  →  enabled: !daQua(ngay)\n     × chưa có lịch hẹn (chưa biết bác sĩ) thì KHÔNG hỏi khung giờ: mọi request đều của bs-2\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n      Tests  1 failed | 5 passed (6)\n- Expected\n+ Received\n\n  [\n+   \"null\",\n    \"bs-2\",\n  ]",
  chamLazy: "$ npx vitest run            # CẢ bộ, chưa có beforeAll nạp trước\n × đổi tuần: bảng KHÔNG bị dựng lại (Profiler chỉ thấy \"update\"), vẫn là CÙNG một <table>\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\nTestingLibraryElementError: Unable to find role=\"link\" and name `/^Đặt .* 03\\/10\\/2026$/`\n Test Files  1 failed | 29 passed (30)\n      Tests  1 failed | 144 passed (145)\n\n$ npx vitest run src/features/lich-tuan/lich-tuan.chat-luong.test.tsx   # chạy RIÊNG\n ✓ Bài 10.3 — hiệu năng > đổi tuần: bảng KHÔNG bị dựng lại … 376ms",
  thieuRouter: "$ npx vitest run\n   × 12.3 — bấm Huỷ ⇒ \"Đã huỷ\" + \"Đang lưu…\" NGAY, trước khi máy chủ trả lời; máy chủ xong ⇒ hết \"Đang lưu…\"\n   × 12.3 — máy chủ lỗi 500 ⇒ tự quay về \"Chờ xác nhận\", báo \"đã hoàn tác\", trang KHÔNG sập\n…\nTypeError: Cannot destructure property 'basename' of 'React$1.useContext(...)' as it is null.\n…\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯\n Test Files  1 failed | 29 passed (30)\n      Tests  2 failed | 142 passed (144)",
  onceSai: "$ npx vitest run -c vitest.sai.config.ts src/vi-du/ch10/once.sai.tsx --silent=false\n[once] resolver chạy 1 lần · mã trả về: 200, 200, 200\n   × SAI: handler once chỉ định lỗi cho ngày 02/10\n     17|   console.log(`[once] resolver chạy ${soLanChay} lần · mã trả về: ${ma…\n- Expected\n+ Received\n\n  [\n    200,\n-   500,\n+   200,\n    200,\n  ]\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n      Tests  1 failed (1)",
  doLuoiTruoc: "[trước khi sửa] Chromium 149.0.7827.55 · API chậm 400 ms · vite build --mode profiling\n  → tuần 05/10: Profiler [mount 0.6ms] · cùng <table>: KHÔNG · KHÔNG có bảng 408 ms\n  → tuần 12/10: Profiler [mount 0.8ms] · cùng <table>: KHÔNG · KHÔNG có bảng 409 ms\n  → tuần 19/10: Profiler [mount 0.6ms] · cùng <table>: KHÔNG · KHÔNG có bảng 409 ms",
  doLuoiSau: "[sau khi sửa] Chromium 149.0.7827.55 · API chậm 400 ms · vite build --mode profiling\n  → tuần 05/10: Profiler [update 0.2ms, update 0.5ms] · cùng <table>: có · KHÔNG có bảng 0 ms\n  → tuần 12/10: Profiler [update 0.1ms, update 0.5ms] · cùng <table>: có · KHÔNG có bảng 0 ms\n  → tuần 19/10: Profiler [update 0.2ms, update 0.7ms] · cùng <table>: có · KHÔNG có bảng 0 ms",
  dotBien: "$ node do/ch10-dot-bien.mjs\ndoc-ngay-cu           Tests  1 failed | 6 passed (7)\nonsuccess             Tests  2 failed | 4 passed (6)\nbo-focus              Tests  1 failed | 5 passed (6)\nbo-chan-client        Tests  3 failed | 10 passed (13)\nbo-chan-may-chu       Tests  1 failed | 5 passed (6)\nbo-enabled            Tests  2 failed | 5 passed (7)\nthieu-enabled-bac-si  Tests  1 failed | 5 passed (6)\nchu-nhat              Tests  5 failed | 19 passed (24)\nbo-giu-gio            Tests  1 failed | 3 passed (4)\nmo-giu-gio-cu         Tests  1 failed | 5 passed (6)",
  dbOnSuccess: "# useDoiGio: onSettled → onSuccess\n     × người khác vừa đặt mất giờ đã chọn ⇒ 409 ⇒ hộp lỗi NHẬN FOCUS, ô đó thành \"Kín\", vẫn ở trang\n     × lớp máy chủ: lịch trùng được tạo ở MÁY KHÁC sau khi trang đã tải ⇒ client không biết ⇒ máy chủ trả 409\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯\n      Tests  2 failed | 4 passed (6)",
  dbFocus: "# TrangDoiGio: bỏ hopLoi.current?.focus()\n     × người khác vừa đặt mất giờ đã chọn ⇒ 409 ⇒ hộp lỗi NHẬN FOCUS, ô đó thành \"Kín\", vẫn ở trang\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n      Tests  1 failed | 5 passed (6)",
  cuoiVitest: "$ npx tsc -b && npx vitest run\n Test Files  30 passed (30)\n      Tests  145 passed (145)",
  cov: "$ npm run test:cov\n…\n      Tests  145 passed (145)\nStatements   : 91.32% ( 1263/1383 )\nBranches     : 84.23% ( 962/1142 )\nFunctions    : 94.76% ( 181/191 )\nLines        : 96.67% ( 727/752 )",
  covFile: "File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s \n ...ures/lich-tuan |   95.07 |    91.53 |     100 |     100 |                   \n  LuoiLichTuan.tsx |    95.5 |       90 |     100 |     100 | 56,96-106         \n  TrangDoiGio.tsx  |   92.38 |     86.9 |     100 |   94.64 | 54,61,96          ",
  build: "$ npx tsc -b && npx vite build\nvite v8.3.1 building client environment for production...\ntransforming...\n✓ 561 modules transformed.\nrendering chunks...\ncomputing gzip size...\ndist/index.html                             0.63 kB │ gzip:   0.36 kB\ndist/assets/index-C1ncXCfa.css              8.91 kB │ gzip:   2.56 kB\ndist/assets/TrangDangNhap-C9eeRTOP.js       0.80 kB │ gzip:   0.54 kB\ndist/assets/TrangLichTuan-W91lVYN9.js       2.10 kB │ gzip:   1.24 kB\ndist/assets/TrangDatLich-VX1Y2lKL.js        3.05 kB │ gzip:   1.56 kB\ndist/assets/TrangDoiGio-B1NwZVUI.js         3.82 kB │ gzip:   1.92 kB\ndist/assets/TrangLichHen-D_0aqoh8.js        4.31 kB │ gzip:   2.04 kB\ndist/assets/compiler-runtime-Dc66hXTW.js    8.94 kB │ gzip:   3.36 kB\ndist/assets/lich-tuan--wcnEmm5.js           9.27 kB │ gzip:   4.05 kB\ndist/assets/phong-kham-D9RYpKIi.js         14.21 kB │ gzip:   4.82 kB\ndist/assets/form-D9lIXlNX.js              116.73 kB │ gzip:  36.53 kB\ndist/assets/index-CnXVUOFB.js             364.29 kB │ gzip: 115.70 kB\ndist/assets/browser-4nAYdWq-.js           427.57 kB │ gzip: 160.92 kB\n\n✓ built in 1.05s",
  spa: "MÁY CHỦ │ ĐƯỜNG DẪN │ MÃ + KIỂU\npython3 -m http.server │ / │ 200 text/html\npython3 -m http.server │ /bac-si/bs-2/lich-tuan?tuan=2026-10-05 │ 404 text/html;charset=utf-8\nvite preview │ / │ 200 text/html\nvite preview │ /bac-si/bs-2/lich-tuan?tuan=2026-10-05 │ 200 text/html\nnginx, không fallback │ / │ 200 text/html\nnginx, không fallback │ /bac-si/bs-2/lich-tuan?tuan=2026-10-05 │ 404 text/html\nnginx, try_files cả assets │ / │ 200 text/html\nnginx, try_files cả assets │ /bac-si/bs-2/lich-tuan?tuan=2026-10-05 │ 200 text/html\nnginx, try_files cả assets │ /assets/khong-co.js │ 200 text/html\nnginx, deploy/nginx.conf │ / │ 200 text/html\nnginx, deploy/nginx.conf │ /bac-si/bs-2/lich-tuan?tuan=2026-10-05 │ 200 text/html\nnginx, deploy/nginx.conf │ /assets/khong-co.js │ 404 text/html\nnginx, deploy/nginx.conf │ /mockServiceWorker.js │ 200 application/javascript\n\n$ curl -sI localhost:4804/bac-si/bs-2/lich-tuan?tuan=2026-10-05 | grep -i cache-control\nCache-Control: no-cache\r\n$ curl -sI localhost:4804/assets/index-CnXVUOFB.js | grep -i cache-control\nCache-Control: public, max-age=31536000, immutable\r",
  spaHeader: "$ curl -sI localhost:4804/bac-si/bs-2/lich-tuan?tuan=2026-10-05 | grep -i cache-control\nCache-Control: no-cache\r\n$ curl -sI localhost:4804/assets/index-CnXVUOFB.js | grep -i cache-control\nCache-Control: public, max-age=31536000, immutable\r",
  tabCuHtml: "[try_files cả assets] tab mở bản A, máy chủ đã lên bản B (TrangLichTuan-BgPfRqNL.js → TrangLichTuan-BFURXOUL.js); bấm \"Xem lịch trống cả tuần →\"\n  [console.error] Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of \"text/html\". Strict MIME type checking is enforced for module scripts per HTML sp\n  [console.error] Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of \"text/html\". Strict MIME type checking is enforced for module scripts per HTML sp\n  URL: /bac-si/bs-2/lich-tuan · tiêu đề trên màn hình: (main trống)",
  tabCu404: "[deploy/nginx.conf, chưa bắt lỗi] tab mở bản A, máy chủ đã lên bản B (TrangLichTuan-BgPfRqNL.js → TrangLichTuan-BFURXOUL.js); bấm \"Xem lịch trống cả tuần →\"\n  [console.error] Failed to load resource: the server responded with a status of 404 (Not Found)\n  [console.error] Failed to load resource: the server responded with a status of 404 (Not Found)\n  URL: /bac-si/bs-2/lich-tuan · tiêu đề trên màn hình: (main trống)",
  tabCuSua: "[deploy/nginx.conf + vite:preloadError] tab mở bản A, máy chủ đã lên bản B (TrangLichTuan-W91lVYN9.js → TrangLichTuan-DPJvoErA.js); bấm \"Xem lịch trống cả tuần →\"\n  [console.error] Failed to load resource: the server responded with a status of 404 (Not Found)\n  [console.error] Failed to load resource: the server responded with a status of 404 (Not Found)\n  [TẢI LẠI TRANG] /bac-si/bs-2/lich-tuan\n  URL: /bac-si/bs-2/lich-tuan · tiêu đề trên màn hình: Lịch trống cả tuần (bản B) — BS. Trần Thu Hà",
  cuoiVaCov: "$ npx tsc -b && npx vitest run\n Test Files  30 passed (30)\n      Tests  145 passed (145)\n\n$ npm run test:cov\n…\n      Tests  145 passed (145)\nStatements   : 91.32% ( 1263/1383 )\nBranches     : 84.23% ( 962/1142 )\nFunctions    : 94.76% ( 181/191 )\nLines        : 96.67% ( 727/752 )",
};

/* ─── Sơ đồ mermaid trong bài (≤ 10 nút, nhãn ngắn; khối EN nhãn tiếng Anh, khối VI nhãn tiếng Việt) ─── */
const L = (...dong) => MM(dong.join('\n'));
const SD = {
  /* 10.1 */
  oVi: L(
    'stateDiagram-v2',
    '  [*] --> DaQua: ngày trước hôm nay',
    '  [*] --> DangTai: ngày còn mở',
    '  DangTai --> Loi: 500 / mất mạng',
    '  Loi --> DangTai: bấm Thử lại',
    '  DangTai --> Kin: conTrong = false',
    '  DangTai --> BanCoLich: trùng giờ lịch của tôi',
    '  DangTai --> Trong: còn trống',
    '  Trong --> DaChon: bấm (chế độ đổi giờ)',
    '  DaChon --> Kin: 409 sau khi tải lại',
  ),
  oEn: L(
    'stateDiagram-v2',
    '  [*] --> Past: day before today',
    '  [*] --> Loading: day still open',
    '  Loading --> Error: 500 / offline',
    '  Error --> Loading: press Retry',
    '  Loading --> Taken: conTrong = false',
    '  Loading --> YouAreBooked: clashes with my booking',
    '  Loading --> Free: still free',
    '  Free --> Selected: press (reschedule mode)',
    '  Selected --> Taken: 409 after refetch',
  ),
  cayVi: L(
    'flowchart TB',
    '  R["router.tsx (lazy)"] --> P1["TrangLichTuan"]',
    '  R --> P2["TrangDoiGio (sau cổng đăng nhập)"]',
    '  P1 --> G["LuoiLichTuan — chế độ đặt"]',
    '  P2 --> G2["LuoiLichTuan — chế độ đổi"]',
    '  P1 --> N["DieuHuongTuan"]',
    '  P2 --> N',
    '  P1 -.-> H1["useLichTuan · useLichHen"]',
    '  P2 -.-> H2["useLichTuan · useLichHen · useDoiGio"]',
    '  classDef trang fill:#1a1030,stroke:#bc8cff,color:#fff',
    '  class P1,P2 trang',
  ),
  cayEn: L(
    'flowchart TB',
    '  R["router.tsx (lazy)"] --> P1["TrangLichTuan"]',
    '  R --> P2["TrangDoiGio (behind the login gate)"]',
    '  P1 --> G["LuoiLichTuan — booking mode"]',
    '  P2 --> G2["LuoiLichTuan — reschedule mode"]',
    '  P1 --> N["DieuHuongTuan"]',
    '  P2 --> N',
    '  P1 -.-> H1["useLichTuan · useLichHen"]',
    '  P2 -.-> H2["useLichTuan · useLichHen · useDoiGio"]',
    '  classDef trang fill:#1a1030,stroke:#bc8cff,color:#fff',
    '  class P1,P2 trang',
  ),
  stateVi: L(
    'flowchart TB',
    '  A{"Ai có thể đổi dữ liệu này?"} -->|"người khác, máy khác"| S["Máy chủ → TanStack Query"]',
    '  A -->|"chỉ người dùng này"| B{"Muốn gửi link / F5 còn giữ?"}',
    '  B -->|"có"| U["URL (?tuan=)"]',
    '  B -->|"không"| C{"Nhiều trang cần?"}',
    '  C -->|"có"| Z["Store (Zustand)"]',
    '  C -->|"không"| L["useState trong component"]',
    '  A -->|"tính được từ thứ khác"| D["KHÔNG lưu — tính khi render"]',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class S,U,L tot',
  ),
  stateEn: L(
    'flowchart TB',
    '  A{"Who can change this data?"} -->|"other people, other devices"| S["Server → TanStack Query"]',
    '  A -->|"only this user"| B{"Should a link / F5 keep it?"}',
    '  B -->|"yes"| U["URL (?tuan=)"]',
    '  B -->|"no"| C{"Needed by many pages?"}',
    '  C -->|"yes"| Z["Store (Zustand)"]',
    '  C -->|"no"| L["useState in the component"]',
    '  A -->|"derivable from other data"| D["DO NOT store — compute in render"]',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class S,U,L tot',
  ),
  /* 10.2 */
  mocVi: L(
    'flowchart TB',
    '  M1["Mốc 1 · luật thuần<br/>13 test, không React"] --> M2["Mốc 2 · xem tuần<br/>8 test, MSW"]',
    '  M2 --> M3["Mốc 3 · đổi giờ<br/>chặn trùng 2 lớp"]',
    '  M3 --> M4["Mốc 4 · 409<br/>6 test trang đổi giờ"]',
    '  M4 --> Q["10.3 · chất lượng<br/>4 test + đột biến"]',
    '  M2 -.->|"lộ bug docNgay"| X["Sửa TrangDatLich"]',
    '  classDef bug fill:#3a1414,stroke:#f85149,color:#fff',
    '  class X bug',
  ),
  mocEn: L(
    'flowchart TB',
    '  M1["Milestone 1 · pure rules<br/>13 tests, no React"] --> M2["Milestone 2 · week view<br/>8 tests, MSW"]',
    '  M2 --> M3["Milestone 3 · reschedule<br/>two-layer duplicate guard"]',
    '  M3 --> M4["Milestone 4 · 409<br/>6 reschedule-page tests"]',
    '  M4 --> Q["10.3 · quality<br/>4 tests + mutations"]',
    '  M2 -.->|"exposes the docNgay bug"| X["Fix TrangDatLich"]',
    '  classDef bug fill:#3a1414,stroke:#f85149,color:#fff',
    '  class X bug',
  ),
  doiGioVi: L(
    'sequenceDiagram',
    '  participant N as Người dùng',
    '  participant T as TrangDoiGio',
    '  participant K as timLichTrung',
    '  participant Q as useDoiGio',
    '  participant M as Máy chủ (MSW)',
    '  N->>T: chọn ô 09:30, bấm Xác nhận',
    '  T->>K: kiểm lại với lịch của tôi',
    '  K-->>T: không trùng',
    '  T->>Q: mutateAsync(lịch, khung giờ)',
    '  Q->>M: PATCH /api/lich-hen/lh-1 { khungGioId }',
    '  M-->>Q: 409 Khung giờ này vừa có người đặt',
    '  Q->>Q: onSettled: invalidate lịch hẹn + khung giờ',
    '  Q-->>T: ném LoiApi (sau khi tải lại xong)',
    '  T->>N: bỏ chọn, hộp lỗi nhận focus, ô thành Kín',
  ),
  doiGioEn: L(
    'sequenceDiagram',
    '  participant N as User',
    '  participant T as TrangDoiGio',
    '  participant K as timLichTrung',
    '  participant Q as useDoiGio',
    '  participant M as Server (MSW)',
    '  N->>T: pick 09:30, press Confirm',
    '  T->>K: re-check against my bookings',
    '  K-->>T: no clash',
    '  T->>Q: mutateAsync(booking, slot)',
    '  Q->>M: PATCH /api/lich-hen/lh-1 { khungGioId }',
    '  M-->>Q: 409 Khung giờ này vừa có người đặt',
    '  Q->>Q: onSettled: invalidate bookings + slots',
    '  Q-->>T: throws LoiApi (after the refetch)',
    '  T->>N: clear selection, alert gets focus, cell turns Taken',
  ),
  haiLopVi: L(
    'flowchart TB',
    '  A["Người dùng chọn giờ X"] --> B{"Client: lịch của tôi có giờ X?"}',
    '  B -->|"có"| C["Ô hiện Bạn có lịch — không bấm được"]',
    '  B -->|"không (hoặc cache cũ)"| D["PATCH lên máy chủ"]',
    '  D --> E{"Máy chủ: SĐT này đã có lịch giờ X?"}',
    '  E -->|"có"| F["409 — tải lại, client học được"]',
    '  E -->|"không"| G["200 — đổi xong"]',
    '  classDef sai fill:#3a2a0a,stroke:#ffc233,color:#fff',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class C,F sai',
    '  class G tot',
  ),
  haiLopEn: L(
    'flowchart TB',
    '  A["User picks time X"] --> B{"Client: do my bookings have X?"}',
    '  B -->|"yes"| C["Cell shows You are booked — not clickable"]',
    '  B -->|"no (or stale cache)"| D["PATCH to the server"]',
    '  D --> E{"Server: does this phone number have X?"}',
    '  E -->|"yes"| F["409 — refetch, the client learns"]',
    '  E -->|"no"| G["200 — rescheduled"]',
    '  classDef sai fill:#3a2a0a,stroke:#ffc233,color:#fff',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class C,F sai',
    '  class G tot',
  ),
  /* 10.3 */
  nhayVi: L(
    'flowchart TB',
    '  A["Bấm Tuần sau →"] --> B["6 query MỚI, đều đang tải"]',
    '  B --> C["gioTuanNay = [] (chưa biết giờ nào)"]',
    '  C --> D{"Bản đầu: không có giờ ⇒ ?"}',
    '  D -->|"trả p Đang tải…"| E["table bị GỠ — Profiler: mount lần sau, trắng 408 ms"]',
    '  C --> F{"Bản sửa: còn gioCu?"}',
    '  F -->|"có"| G["vẽ bảng với giờ cũ, ô là … — Profiler: update"]',
    '  classDef sai fill:#3a1414,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class E sai',
    '  class G tot',
  ),
  nhayEn: L(
    'flowchart TB',
    '  A["Press Next week →"] --> B["6 NEW queries, all loading"]',
    '  B --> C["gioTuanNay = [] (no hours known)"]',
    '  C --> D{"First version: no hours ⇒ ?"}',
    '  D -->|"return p Loading…"| E["table REMOVED — Profiler: mount next time, blank 408 ms"]',
    '  C --> F{"Fixed: remember gioCu?"}',
    '  F -->|"yes"| G["draw table with old hours, cells … — Profiler: update"]',
    '  classDef sai fill:#3a1414,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class E sai',
    '  class G tot',
  ),
  kiemVi: L(
    'flowchart TB',
    '  A["Hàm thuần — 13 test"] --> B["Trang + MSW — 14 test"]',
    '  B --> C["Chất lượng — Profiler, axe, bàn phím"]',
    '  C --> D["Đột biến — 10/10 bị bắt"]',
    '  D --> E["Chromium thật — đo + chụp"]',
    '  E -.->|"E2E đầy đủ"| F["Khoá Testing / Next.js Ch19"]',
    '  classDef ngoai fill:#1a1030,stroke:#bc8cff,color:#fff',
    '  class F ngoai',
  ),
  kiemEn: L(
    'flowchart TB',
    '  A["Pure functions — 13 tests"] --> B["Pages + MSW — 14 tests"]',
    '  B --> C["Quality — Profiler, axe, keyboard"]',
    '  C --> D["Mutations — 10/10 caught"]',
    '  D --> E["Real Chromium — measure + screenshot"]',
    '  E -.->|"full E2E"| F["Testing course / Next.js Ch19"]',
    '  classDef ngoai fill:#1a1030,stroke:#bc8cff,color:#fff',
    '  class F ngoai',
  ),
  /* 10.4 */
  spaVi: L(
    'sequenceDiagram',
    '  participant B as Trình duyệt (F5)',
    '  participant S as nginx',
    '  participant R as React Router',
    '  B->>S: GET /bac-si/bs-2/lich-tuan?tuan=2026-10-05',
    '  S->>S: có FILE tên đó không? — không',
    '  S-->>B: try_files ⇒ index.html (200)',
    '  B->>S: GET /assets/index-….js',
    '  S-->>B: 200, cache 1 năm',
    '  B->>R: chạy app, đọc location',
    '  R-->>B: vẽ TrangLichTuan, tuần 05/10',
  ),
  spaEn: L(
    'sequenceDiagram',
    '  participant B as Browser (F5)',
    '  participant S as nginx',
    '  participant R as React Router',
    '  B->>S: GET /bac-si/bs-2/lich-tuan?tuan=2026-10-05',
    '  S->>S: is there a FILE with that name? — no',
    '  S-->>B: try_files ⇒ index.html (200)',
    '  B->>S: GET /assets/index-….js',
    '  S-->>B: 200, cached for a year',
    '  B->>R: run the app, read location',
    '  R-->>B: render TrangLichTuan, week of 05/10',
  ),
  tabCuVi: L(
    'sequenceDiagram',
    '  participant T as Tab mở từ hôm qua (bản A)',
    '  participant S as Máy chủ (đã lên bản B)',
    '  T->>S: import TrangLichTuan-W91lVYN9.js (tên bản A)',
    '  S-->>T: 404 — file cũ đã bị thay',
    '  T->>T: Vite phát vite:preloadError',
    '  T->>T: listener: chưa tự tải lại trong 10 giây ⇒ assign(trang định mở)',
    '  T->>S: GET /bac-si/bs-2/lich-tuan',
    '  S-->>T: index.html MỚI ⇒ TrangLichTuan-DPJvoErA.js',
  ),
  tabCuEn: L(
    'sequenceDiagram',
    '  participant T as Tab open since yesterday (build A)',
    '  participant S as Server (now serving build B)',
    '  T->>S: import TrangLichTuan-W91lVYN9.js (build A name)',
    '  S-->>T: 404 — the old file was replaced',
    '  T->>T: Vite fires vite:preloadError',
    '  T->>T: listener: no self-reload in 10 s ⇒ assign(target page)',
    '  T->>S: GET /bac-si/bs-2/lich-tuan',
    '  S-->>T: NEW index.html ⇒ TrangLichTuan-DPJvoErA.js',
  ),
  diemVi: L(
    'pie showData',
    '  title Rubric 100 điểm',
    '  "Chạy đúng yêu cầu" : 25',
    '  "Dữ liệu & lỗi" : 20',
    '  "Test" : 20',
    '  "Thiết kế & cấu trúc" : 15',
    '  "Tiếp cận & hiệu năng" : 10',
    '  "Build, deploy, README" : 10',
  ),
  diemEn: L(
    'pie showData',
    '  title Rubric — 100 points',
    '  "Meets the requirements" : 25',
    '  "Data & errors" : 20',
    '  "Tests" : 20',
    '  "Design & structure" : 15',
    '  "Accessibility & performance" : 10',
    '  "Build, deploy, README" : 10',
  ),
};

const L1 = {
    title: '10.1 — From design to component tree: stories, mock-up, state map, API|||10.1 — Từ thiết kế tới cây component: câu chuyện người dùng, mock-up, state, API',
    slug: 'rx-10-1-thiet-ke',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Mở đầu dự án giữa khoá: biến một yêu cầu nói miệng thành câu chuyện người dùng có tiêu chí kiểm được, vẽ mọi trạng thái, dựng cây component, quyết định mỗi mẩu state sống ở đâu và chốt hợp đồng API (kể cả các mã 409) — trước khi gõ dòng code đầu tiên.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>From design to component tree: stories, mock-up, state map, API contract</h2>
<p class="lead">For nine chapters you typed along: each lesson showed a piece of the clinic app, you rebuilt it, a test told you whether it worked. This chapter turns that around. It is the <strong>mid-course project</strong>: you get a real feature request, a way of working, four milestones with "done when" criteria, and a rubric to grade yourself. The reference solution exists — every line of it was built and tested for this chapter — but it sits inside closed <code>Solution</code> boxes. Open them after you have tried. This first lesson writes no React at all. It does the thing juniors skip and seniors are paid for: deciding what to build and how the pieces fit, before the first line of code.</p>
<p>Starting point: the clinic app after Chapter 9 — 25 test files, <strong>114 tests</strong>, all green; TanStack Query over MSW, React Router with lazy routes and a login gate, React Hook Form + Zod, Zustand, React Compiler on. Versions used to build and measure everything in this chapter (checked 26/09/2026): React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2, @tanstack/react-query 5.103.3, react-router 8.4.0, MSW 2.15.0, axe-core 4.13.0, Chromium 149 via Playwright, nginx 1.27 in Docker. At the end of the chapter the same app has <strong>145 tests</strong> in 30 files, a new feature, three real bugs found and fixed, and a build that survives a real static server.</p>

<div class="callout"><p><strong>How this chapter works.</strong></p>
<ul>
<li><strong>10.1 (this lesson)</strong> — design: user stories, mock-up, component tree, state map, API contract. Output: a one-page design note plus the API piece of the code.</li>
<li><strong>10.2</strong> — build it in four milestones. Each milestone: the task, what "done" means as a test you can run, the tricky parts explained, the full solution folded away.</li>
<li><strong>10.3</strong> — polish: measure with the Profiler, check accessibility with axe and the keyboard, prove your tests catch breakage.</li>
<li><strong>10.4</strong> — build, deploy to a static server correctly, the checklist for the whole course, the self-assessment rubric, and the same project again with <em>your own</em> brief.</li>
</ul>
<p>The course's final exam is not here; it is at the end of Chapter 14. Budget: 6–10 hours for the whole chapter if you really build it.</p></div>

<h3>The request, as a person would say it</h3>
<p>The clinic owner, over coffee: <em>"Patients complain the booking page only shows one day at a time. They want to see the whole week of a doctor and pick. And people keep calling to move their appointment — let them do that themselves. Oh, and last week someone booked two doctors at the same hour by accident."</em></p>
<p>That is a real requirement: vague, three wishes in one breath, one of them a bug report in disguise. Your job is to turn it into something you can build and <strong>check</strong>. The path this lesson follows is the same one teams use; only the paperwork varies.</p>
<p>Five steps: stories with criteria, a mock-up of every state, a component tree, a map of where state lives, the API contract. Design is not a phase you finish; it is a set of assumptions you write down, so that when one turns out wrong (and in 10.2 one does) you know exactly which one.</p>

<h3>Step 1 — Turn the request into user stories with testable criteria</h3>
${slide('rx-10', 4, 'The request as six user stories, each with a criterion a test can check')}
<p>A <strong>user story</strong> (câu chuyện người dùng) has the shape "as <em>who</em>, I want <em>what</em>, so that <em>why</em>". On its own it is a wish. What makes it buildable is the <strong>acceptance criterion</strong> (tiêu chí chấp nhận): a sentence precise enough that you could write a test for it. "Show the week" is not testable; "six columns Monday to Saturday, past days send no request" is. Here are the six stories this chapter builds:</p>
<table>
<thead><tr><th>As…</th><th>I want…</th><th>Done when (testable)</th></tr></thead>
<tbody>
<tr><td>patient</td><td>to see a doctor's free slots for a <strong>whole week</strong></td><td>6 columns Mon–Sat; days before today show "Đã qua" and cause no request</td></tr>
<tr><td>patient</td><td>to move to next week and send the link to family</td><td>week in the URL (<code>?tuan=</code>), replace not push, 4 weeks open</td></tr>
<tr><td>signed-in patient</td><td>not to book two appointments at the same time by mistake</td><td>a clashing cell shows "Bạn có lịch" and cannot be clicked</td></tr>
<tr><td>patient</td><td>to <strong>reschedule</strong> a pending appointment myself</td><td>new slot taken, old slot freed, back to "Lịch hẹn" with a message</td></tr>
<tr><td>patient</td><td>to know at once when someone else grabbed my slot</td><td>409 ⇒ error box gets focus, that cell turns "Kín", selection cleared</td></tr>
<tr><td>keyboard user</td><td>to do all of the above without a mouse</td><td>Tab/Space/Enter complete the flow; axe finds 0 violations</td></tr>
</tbody>
</table>
<p>Two habits hide in that table. First, <strong>write the boundaries</strong>: Sunday is closed, bookings open four weeks ahead, only "chờ xác nhận" (pending) appointments can be moved. Each boundary is a question you would otherwise answer at 11 p.m. by guessing. Second, <strong>write what is out of scope</strong>: no doctor-side calendar, no drag and drop, no recurring appointments. Scope you do not write down grows by itself.</p>
<div class="callout"><p><strong>JS quick reminder — why dates as strings.</strong> The app stores days as <code>'2026-10-06'</code> (ISO format, year-month-day). Strings in that format sort in the same order as the dates they represent, so <code>'2026-09-30' &lt; '2026-10-01'</code> is <code>true</code> — plain string comparison, no <code>Date</code> object, no time-zone surprises. You will lean on that a lot in 10.2.</p></div>

<h3>Step 2 — Mock-up: draw every state before any code</h3>
${slide('rx-10', 3, 'The mid-course project: you build, the lessons guide and grade')}
<p>A <strong>mock-up</strong> (bản phác giao diện) can be a pencil sketch, a Figma frame, or a screenshot of a similar app with notes on it. The point is not beauty; it is to list <em>every state</em> each part of the screen can be in. Juniors draw the happy path — a grid full of green "Trống" cells — and discover the other states one bug at a time. For the week grid, one cell can be in seven states:</p>
${SD.oEn}
<p>Each state becomes a line in <code>LuoiLichTuan</code> in 10.2: "Đã qua" (past), "…" (loading), "Lỗi" (that day failed), "Kín" (taken), "Bạn có lịch" (you already have an appointment at that time), "Trống" (free — a link or a button), "✓ Đã chọn" (selected in reschedule mode), plus "Giờ hiện tại" for the slot being moved. The whole screen also has the four states from Chapter 6 — loading, empty, error, data — and one more that only appears once you draw the flow: <em>between weeks</em>, when the new week's data is on its way. Keep that one in mind; in 10.3 the Profiler shows the first version got it wrong.</p>
<p>A second sketch for the reschedule page: a summary (which appointment, which doctor, current time), the same grid with a "Giờ hiện tại" cell, one primary button whose label changes ("Chọn một giờ trống" → "Xác nhận đổi sang 09:30 · 03/10/2026"), a "Huỷ, quay lại" link, and a place for an error box <em>above</em> the grid. Writing the button labels now is not fussiness: labels become accessible names, and accessible names are what your tests query in Chapter 9 style.</p>

<h3>Step 3 — Component tree: pages compose, features do the work</h3>
${slide('rx-10', 5, 'The mock-up as a component tree: pages compose, features do the work')}
<p>From the sketches, cut boxes. Chapter 7 gave the project its rules: <code>src/features/&lt;feature&gt;/</code> owns logic and UI for one feature and exposes a single door, <code>index.ts</code>; <code>src/pages/</code> glues features together for one URL; features never import each other's insides. The new feature is <code>lich-tuan</code> ("week schedule"):</p>
${SD.cayEn}
<p>Two decisions deserve a sentence each. <strong>One grid, two modes.</strong> The week view and the reschedule page show the same grid; what differs is what a free cell <em>does</em> — link to the booking form, or select this slot. Two copies of a 100-line table would drift apart within a week. So <code>LuoiLichTuan</code> takes a <code>cheDo</code> ("mode") prop typed as a <strong>discriminated union</strong> (kiểu hợp có nhãn): <code>{ kieu: 'dat' }</code> or <code>{ kieu: 'doi'; lichDangDoi; dangChon; onChon }</code>. TypeScript then refuses <code>cheDo.onChon</code> unless you have checked <code>cheDo.kieu === 'doi'</code> first. <strong>Pages own the data.</strong> The grid receives days and bookings as props; the page decides which hooks to call. That keeps the grid easy to test and lets the reschedule page wait for the appointment before it knows which doctor to load.</p>
<p>The feature's door, as it looks at the end of the chapter:</p>
${pre('ts', SN.cuaLichTuan)}
<div class="callout"><p><strong>JS quick reminder — <code>export { … } from</code>.</strong> <code>export { LuoiLichTuan } from './LuoiLichTuan'</code> re-exports a name from another file without importing it into this one. The door file contains nothing but such lines, so the rest of the app writes <code>import { LuoiLichTuan } from '@/features/lich-tuan'</code> and never learns the file layout inside.</p></div>

<h3>Step 4 — Where each piece of state lives</h3>
${slide('rx-10', 6, 'Each piece of state gets exactly one home: server, URL, component or store')}
<p>This is the step that decides whether the code will be pleasant or painful. Chapters 2, 5, 6 and 7 each added a place state can live; now you choose, piece by piece, with one question at the top:</p>
${SD.stateEn}
<table>
<thead><tr><th>Data</th><th>Home</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Slots of six days</td><td>server, cached by TanStack Query</td><td>other people change it; must be refetched after writes</td></tr>
<tr><td>My appointments</td><td>server (existing <code>useLichHen</code>)</td><td>needed to block clashing slots</td></tr>
<tr><td>Week being viewed</td><td>URL <code>?tuan=2026-10-05</code></td><td>F5, Back and "send the link" must keep it</td></tr>
<tr><td>Selected cell (reschedule)</td><td><code>useState</code> in the page</td><td>only this page needs it; forget it when leaving</td></tr>
<tr><td>Client-side clash message</td><td><code>useState</code> in the page</td><td>shown once, cleared on the next pick</td></tr>
<tr><td>Signed in?</td><td>Zustand store (Chapter 7)</td><td>the whole app reads it</td></tr>
<tr><td>The clinic's hours (rows)</td><td><strong>nowhere</strong> — derived from the data</td><td>the server decides the hours; hard-coding them duplicates a fact</td></tr>
</tbody>
</table>
<p>The last row is the one people get wrong. It is tempting to write <code>const GIO = ['08:00', '09:30', '14:00', '15:30']</code> in the grid because you have seen the mock server's code. Then the clinic adds a 17:00 slot and the grid silently ignores it. Anything you can compute from data you already have is not state: compute it during render.</p>
<div class="pitfall co-tieu-de"><strong>Trap — copying server data into <code>useState</code>.</strong> <code>const [slots, setSlots] = useState(data)</code> "so I can edit it" creates a second copy that stops following the server the moment the query refetches: after a 409 the cache shows the slot as taken, your copy still shows it free. Keep server data in the query cache; keep only the <em>user's choice</em> (an id) in local state, and look the object up from the cache when you need it.</div>

<h3>Step 5 — Data and API: query keys, requests, error codes</h3>
${slide('rx-10', 7, 'Six queries per week, sharing cache entries with the doctor page')}
<p>The API already has <code>GET /api/bac-si/:id/khung-gio?ngay=YYYY-MM-DD</code> — slots of one doctor on one day. For a week you could add a new endpoint (<code>?tu=…&amp;den=…</code>) or call the existing one six times. The design picks six calls, on purpose: the existing query key <code>['bac-si', id, 'khung-gio', ngay]</code> is <em>per day</em>, so each day of the week becomes the same cache entry the doctor page (Chapter 7) already uses. Visit a doctor, then open the week: the day you already saw costs no request. Book or reschedule: one <code>invalidateQueries({ queryKey: ['bac-si', id, 'khung-gio'] })</code> refreshes both screens. In a real project you would weigh that against six round-trips on a slow network; here the fake API answers in 5 ms in tests and 100–400 ms in the browser, and the six requests run in parallel.</p>
<p>Rescheduling needs a write. Rather than invent a new URL, extend the existing <code>PATCH /api/lich-hen/:id</code> (which Chapter 6 uses with <code>{ trangThai: 'da-huy' }</code> to cancel) to accept <code>{ khungGioId }</code>. Write the <strong>contract</strong> — every answer the server may give — before either side is coded:</p>
<table>
<thead><tr><th>Situation</th><th>Response</th></tr></thead>
<tbody>
<tr><td>appointment does not exist</td><td>404 "Không có lịch hẹn này"</td></tr>
<tr><td>appointment is not pending any more</td><td>409 "Chỉ đổi giờ được lịch đang chờ xác nhận"</td></tr>
<tr><td>slot does not exist or belongs to another doctor</td><td>404 "Không có khung giờ này"</td></tr>
<tr><td>slot already taken</td><td>409 "Khung giờ này vừa có người đặt"</td></tr>
<tr><td>this patient already has another appointment at that time</td><td>409 "Bạn đã có một lịch khác vào đúng giờ này"</td></tr>
<tr><td>valid</td><td>200 + the updated appointment; old slot freed, new slot taken</td></tr>
</tbody>
</table>
<p><strong>409 Conflict</strong> is the HTTP status for "your request is fine, but it clashes with the current state of the server". It is exactly the right code for booking races, and it tells the client something important: <em>your picture of the data is out of date — reload it</em>. The same duplicate rule is also added to <code>POST /api/lich-hen</code>, because a rule that only the client enforces is a suggestion. In the fake server (MSW handlers, Chapter 6) the contract becomes:</p>
${pre('ts', SN.trungGio)}
${pre('ts', SN.handlerDoiGio)}
<p>Notice the order of checks: existence, state of the appointment, existence of the slot, availability, then the per-patient rule. Cheap and obvious checks first, the rule that needs a scan of all appointments last. Also notice <code>dieuKhien.tranh</code>: a new knob next to Chapter 6's <code>?tre=</code> and <code>?loi=</code>. Open the app with <code>?tranh=1</code> and every reschedule loses its slot to "someone else" at the last moment, so you can see the 409 path in a real browser without a second user.</p>
<p>On the client, the API module and the path helpers get one entry each, and the router gets two lazy routes — the week view is public, the reschedule page sits behind the login gate from Chapter 7:</p>
${pre('ts', SN.apiDoiGio)}
${pre('ts', SN.duongDan)}
${pre('tsx', SN.router)}

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202 you read the assignment PDF and open <code>App.js</code>: one component grows a <code>componentDidMount</code> that fetches, a Redux slice with <code>loading</code>/<code>error</code>/<code>data</code>, and the screen's states appear as the teacher's checklist reminds you of them. → At work a feature starts as a ticket with acceptance criteria, a quick sketch, a component tree and a note of where state lives and which API calls change what, often reviewed by a teammate in ten minutes before anyone codes. · <em>Why:</em> the expensive bugs in UI work are not typos; they are wrong assumptions — "the grid always has four hours", "the client check is enough", "the date on the URL is one of three". Writing them down makes them reviewable. The FER202 way is fine for a one-week lab where you are the only user; you will meet it again in older company code, usually as the reason a feature needs rewriting.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "You are asked to build a booking calendar. Walk me through how you would start."</p>
<p>Clarify the stories and boundaries (who books, how far ahead, what counts as a clash). Sketch every state of a cell and of the page. Split into components along "who owns which data"; pages compose, the grid is presentational. Map state: server data in a query cache keyed per day, the viewed week in the URL, the selection in local state, nothing derived stored. Agree the API contract including the conflict cases, and enforce the clash rule on the server as well as the client.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "When would you put state in the URL instead of in React state?"</p>
<p>When the user would expect to share it, bookmark it, or get it back after a refresh or the Back button: filters, the selected tab, the page of a list, the week of a calendar. Use replace for fine-grained changes so history is not flooded. Validate it on read — the URL is user input.</p></div>

<h3>🛠 Keep building the project — step 0/4: the design note and the API contract</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after Chapter 9 (<code>src/mocks/handlers.ts</code>, <code>src/shared/api/phong-kham.ts</code>, <code>src/shared/duong-dan.ts</code>, <code>src/app/router.tsx</code>; 114 tests green).</p><ol>
<li>Write a one-page design note (a Markdown file in your repo, or paper): the six stories with criteria, the cell states, the component tree, the state table, the API contract table. Add one boundary this lesson did not mention and decide it (example: "can a pending appointment be moved to another doctor?").</li>
<li>In <code>handlers.ts</code>: add <code>trungGio</code>, extend <code>PATCH /api/lich-hen/:id</code> with the <code>{ khungGioId }</code> branch in the order above, add the same clash check to <code>POST /api/lich-hen</code>, and the <code>?tranh=1</code> knob in <code>dieu-khien.ts</code>.</li>
<li>Add <code>api.doiGio</code>, <code>duongDan.lichTuan</code> and <code>duongDan.doiGio</code>.</li>
<li>Create <code>src/features/lich-tuan/index.ts</code> (it may export nothing yet) and the two routes pointing at pages that just return a heading.</li>
</ol>
<p><strong>Done when:</strong> <code>npx tsc -b</code> prints nothing; all <strong>114</strong> old tests are still green (the cancel branch of the PATCH handler must keep working); opening <code>/bac-si/bs-2/lich-tuan</code> in <code>npm run dev</code> shows your placeholder heading and <code>/lich-hen/lh-1/doi-gio</code> sends you to the login page when signed out.</p></div>
<details><summary>Solution</summary>
<p>The handler, the clash helper, the API entry, the paths and the routes are printed in full in Step 5 above; they are exactly the files of the reference project. The only other change of this step is the knob in <code>src/mocks/dieu-khien.ts</code>: a comment line <code>?tranh=1 …</code> and <code>tranh: q.get('tranh') === '1'</code> in the <code>dieuKhien</code> object. A design note that earns full marks in the rubric (10.4) fits on one screen: the table of Step 1, the diagram of Step 2 written as a list, the tree of Step 3, the table of Step 4 and the contract of Step 5 — plus your extra boundary with its answer.</p>
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> design — without code — a small feature the clinic owner will ask for next: <em>"a doctor can mark a day off; patients with appointments that day should see it."</em></p><ol>
<li>Write three user stories with a testable criterion each (one for the patient booking, one for a patient already booked, one for the week view).</li>
<li>List the states of a grid cell that change (hint: a whole column becomes something new).</li>
<li>Fill a state table: where does "days off" live, and why not in a constant.</li>
<li>Write the API contract lines you need (which endpoint, which status for "booking on a day off").</li>
</ol><p><strong>Done when:</strong> each criterion names something a test can query (a text, a role, a URL, a request count), every piece of data in your table has exactly one home, and your contract has an answer for "a patient tries to book on a day the doctor just marked off" (a 409, not a 400 — the request is well-formed; the server state disagrees).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">user story</span><span class="v">"as who, I want what, so that why" — the unit of a requirement</span></div>
<div class="kv"><span class="k">acceptance criterion</span><span class="v">a sentence precise enough to become a test</span></div>
<div class="kv"><span class="k">mock-up</span><span class="v">a sketch of the screen listing every state, not just the happy one</span></div>
<div class="kv"><span class="k">component tree</span><span class="v">who renders whom; pages compose, features do the work</span></div>
<div class="kv"><span class="k">discriminated union</span><span class="v">a TS union told apart by a shared field (<code>kieu</code>) — one component, several modes</span></div>
<div class="kv"><span class="k">single source of truth</span><span class="v">each fact stored in exactly one place; everything else derived</span></div>
<div class="kv"><span class="k">API contract</span><span class="v">every request and every possible answer, agreed before coding</span></div>
<div class="kv"><span class="k">409 Conflict</span><span class="v">"valid request, but it clashes with the server's current state" — refetch</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The mid-course project inverts the course: you build; lessons give tasks, criteria and folded solutions.</li>
<li>Turn a spoken request into user stories whose criteria can become tests; write boundaries and non-goals.</li>
<li>Sketch every state of every part — seven for a grid cell — before code; labels become accessible names and test queries.</li>
<li>One presentational grid with a discriminated-union mode serves two pages; pages own the data hooks.</li>
<li>Each fact has one home: server cache, URL, local state or store; anything derivable (the clinic's hours) is not state.</li>
<li>Agree the API contract with every error; reuse per-day query keys to share cache; enforce clash rules on the server too.</li>
</ul>

${LINK('https://react.dev/learn/thinking-in-react', '⚛️', 'react.dev — Thinking in React', 'Mock-up → component hierarchy → minimal state → where it lives.')}
${LINK('https://react.dev/learn/choosing-the-state-structure', '🧭', 'react.dev — Choosing the State Structure', 'Avoid redundant and duplicated state.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/409', '⚠️', 'MDN — 409 Conflict', 'When a request clashes with the current state of the resource.')}
${LINK_TRONG('/courses/react/learn?lessonSlug=rx-7-3-cau-truc', '↩️', 'Lesson 7.3 — Project structure', 'features/, pages/, one door per feature.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Từ thiết kế tới cây component: câu chuyện người dùng, mock-up, bản đồ state, hợp đồng API</h2>
<p class="lead">Chín chương vừa rồi bạn gõ theo: mỗi bài đưa một mảnh của app phòng khám, bạn dựng lại, một test báo đúng hay sai. Chương này đảo ngược. Đây là <strong>dự án giữa khoá</strong>: bạn nhận một yêu cầu tính năng thật, một cách làm việc, bốn mốc có tiêu chí "đạt khi", và một bảng rubric để tự chấm. Lời giải mẫu có đủ — từng dòng đã được dựng và test thật cho chương này — nhưng nằm trong các hộp <code>Lời giải</code> đóng sẵn. Hãy thử trước rồi mới mở. Bài đầu tiên này không viết dòng React nào. Nó làm việc mà người mới hay bỏ qua còn người có kinh nghiệm được trả tiền để làm: quyết định xây cái gì và các mảnh ghép với nhau thế nào, trước dòng code đầu tiên.</p>
<p>Điểm xuất phát: app phòng khám sau Chương 9 — 25 file test, <strong>114 test</strong>, tất cả xanh; TanStack Query trên MSW, React Router có route lazy và cổng đăng nhập, React Hook Form + Zod, Zustand, React Compiler đang bật. Phiên bản dùng để dựng và đo mọi thứ trong chương (kiểm 26/09/2026): React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2, @tanstack/react-query 5.103.3, react-router 8.4.0, MSW 2.15.0, axe-core 4.13.0, Chromium 149 qua Playwright, nginx 1.27 trong Docker. Cuối chương, cùng app đó có <strong>145 test</strong> trong 30 file, một tính năng mới, ba bug thật đã tìm ra và sửa, và một bản build sống được trên máy chủ tĩnh thật.</p>

<div class="callout"><p><strong>Chương này học thế nào.</strong></p>
<ul>
<li><strong>10.1 (bài này)</strong> — thiết kế: câu chuyện người dùng, mock-up, cây component, bản đồ state, hợp đồng API. Kết quả: một trang ghi chú thiết kế cộng phần API trong code.</li>
<li><strong>10.2</strong> — dựng qua bốn mốc. Mỗi mốc: đề bài, "đạt" nghĩa là test nào chạy xanh, giải thích chỗ khó, lời giải đầy đủ gập lại.</li>
<li><strong>10.3</strong> — hoàn thiện: đo bằng Profiler, kiểm khả năng tiếp cận bằng axe và bàn phím, chứng minh test của bạn bắt được lỗi.</li>
<li><strong>10.4</strong> — build, deploy lên máy chủ tĩnh cho đúng, checklist cả khoá, rubric tự chấm, và làm lại dự án với <em>đề của chính bạn</em>.</li>
</ul>
<p>Bài thi cuối khoá không ở đây; nó ở cuối Chương 14. Thời gian: 6–10 giờ cho cả chương nếu bạn dựng thật.</p></div>

<h3>Yêu cầu, như người ta nói ngoài đời</h3>
<p>Chủ phòng khám, bên ly cà phê: <em>"Bệnh nhân than trang đặt lịch mỗi lần chỉ xem được một ngày. Họ muốn thấy cả tuần của một bác sĩ rồi chọn. Với lại người ta cứ gọi điện xin dời lịch — cho họ tự dời đi. À, tuần trước có người lỡ đặt hai bác sĩ cùng một giờ."</em></p>
<p>Đó là một yêu cầu thật: mơ hồ, ba mong muốn trong một hơi, một trong số đó là báo lỗi đội lốt. Việc của bạn là biến nó thành thứ dựng được và <strong>kiểm được</strong>. Con đường bài này đi là con đường các nhóm vẫn đi; chỉ có giấy tờ là khác nhau.</p>
<p>Năm bước: câu chuyện kèm tiêu chí, mock-up mọi trạng thái, cây component, bản đồ state sống ở đâu, hợp đồng API. Thiết kế không phải một giai đoạn làm xong là thôi; nó là tập hợp các giả định được viết ra, để khi một giả định hoá ra sai (và ở 10.2 có một cái sai thật) bạn biết chính xác là cái nào.</p>

<h3>Bước 1 — Biến yêu cầu thành câu chuyện người dùng có tiêu chí kiểm được</h3>
${slide('rx-10', 4, 'Yêu cầu thành sáu câu chuyện người dùng, mỗi câu một tiêu chí test kiểm được')}
<p>Một <strong>câu chuyện người dùng</strong> (user story) có dạng "là <em>ai</em>, tôi muốn <em>gì</em>, để <em>làm gì</em>". Đứng một mình nó chỉ là mong muốn. Thứ làm nó dựng được là <strong>tiêu chí chấp nhận</strong> (acceptance criterion): một câu đủ chính xác để bạn viết được test cho nó. "Hiện cả tuần" không kiểm được; "sáu cột thứ Hai tới thứ Bảy, ngày đã qua không gửi request" thì kiểm được. Đây là sáu câu chuyện chương này dựng:</p>
<table>
<thead><tr><th>Là…</th><th>tôi muốn…</th><th>Đạt khi (test được)</th></tr></thead>
<tbody>
<tr><td>người bệnh</td><td>xem giờ trống <strong>cả tuần</strong> của một bác sĩ</td><td>6 cột T2–T7; ngày trước hôm nay hiện "Đã qua" và không gửi request</td></tr>
<tr><td>người bệnh</td><td>sang tuần sau, gửi link cho người nhà</td><td>tuần nằm trên URL (<code>?tuan=</code>), replace chứ không push, mở 4 tuần</td></tr>
<tr><td>người bệnh đã đăng nhập</td><td>không lỡ tay đặt hai lịch cùng giờ</td><td>ô trùng hiện "Bạn có lịch" và không bấm được</td></tr>
<tr><td>người bệnh</td><td>tự <strong>đổi giờ</strong> một lịch đang chờ</td><td>giờ mới kín, giờ cũ mở lại, về "Lịch hẹn" kèm thông báo</td></tr>
<tr><td>người bệnh</td><td>biết ngay khi người khác giành mất giờ của mình</td><td>409 ⇒ hộp lỗi nhận focus, ô đó thành "Kín", bỏ chọn</td></tr>
<tr><td>người dùng bàn phím</td><td>làm hết những việc trên không cần chuột</td><td>Tab/Space/Enter đi hết luồng; axe 0 lỗi</td></tr>
</tbody>
</table>
<p>Bảng đó giấu hai thói quen. Một, <strong>viết ra các biên</strong>: Chủ nhật nghỉ, mở đặt trước bốn tuần, chỉ lịch "chờ xác nhận" mới dời được. Mỗi biên là một câu hỏi mà nếu không viết ra bạn sẽ trả lời lúc 11 giờ đêm bằng cách đoán. Hai, <strong>viết ra cái KHÔNG làm</strong>: không có lịch phía bác sĩ, không kéo-thả, không lịch lặp lại. Phạm vi không được viết ra sẽ tự phình.</p>
<div class="callout"><p><strong>JS nhắc nhanh — vì sao lưu ngày bằng chuỗi.</strong> App lưu ngày dạng <code>'2026-10-06'</code> (định dạng ISO, năm-tháng-ngày). Chuỗi dạng này xếp theo đúng thứ tự thời gian của ngày nó biểu diễn, nên <code>'2026-09-30' &lt; '2026-10-01'</code> là <code>true</code> — so chuỗi thường, không cần object <code>Date</code>, không bất ngờ múi giờ. Ở 10.2 bạn sẽ dựa vào điều này rất nhiều.</p></div>

<h3>Bước 2 — Mock-up: vẽ mọi trạng thái trước khi có code</h3>
${slide('rx-10', 3, 'Dự án giữa khoá: bạn tự làm, bài giảng chỉ đường và chấm')}
<p>Một <strong>mock-up</strong> (bản phác giao diện) có thể là hình vẽ bút chì, một khung Figma, hay ảnh chụp một app tương tự có ghi chú. Mục đích không phải đẹp; mà là liệt kê <em>mọi trạng thái</em> mà từng phần màn hình có thể rơi vào. Người mới vẽ đường suôn sẻ — lưới đầy ô xanh "Trống" — rồi phát hiện các trạng thái còn lại mỗi lần một bug. Với lưới tuần, một ô có bảy trạng thái:</p>
${SD.oVi}
<p>Mỗi trạng thái thành một dòng trong <code>LuoiLichTuan</code> ở 10.2: "Đã qua", "…" (đang tải), "Lỗi" (ngày đó tải hỏng), "Kín", "Bạn có lịch" (bạn đã có lịch đúng giờ đó), "Trống" (một link hoặc một nút), "✓ Đã chọn" (ở chế độ đổi giờ), cộng "Giờ hiện tại" cho khung giờ đang được dời. Cả màn hình còn có bốn trạng thái của Chương 6 — đang tải, rỗng, lỗi, có dữ liệu — và một cái nữa chỉ lộ ra khi bạn vẽ luồng: <em>giữa hai tuần</em>, lúc dữ liệu tuần mới đang về. Nhớ cái đó; ở 10.3 Profiler cho thấy bản đầu làm sai đúng chỗ này.</p>
<p>Bản phác thứ hai cho trang đổi giờ: phần tóm tắt (lịch nào, bác sĩ nào, đang hẹn lúc mấy giờ), cùng lưới đó với một ô "Giờ hiện tại", một nút chính có nhãn đổi theo ("Chọn một giờ trống" → "Xác nhận đổi sang 09:30 · 03/10/2026"), một link "Huỷ, quay lại", và chỗ cho hộp lỗi <em>phía trên</em> lưới. Viết nhãn nút ngay bây giờ không phải kỹ tính: nhãn thành tên truy cập, và tên truy cập là thứ test hỏi theo kiểu Chương 9.</p>

<h3>Bước 3 — Cây component: trang ghép, tính năng làm</h3>
${slide('rx-10', 5, 'Mock-up thành cây component: trang ghép, tính năng làm')}
<p>Từ bản phác, cắt thành hộp. Chương 7 đã đặt luật cho dự án: <code>src/features/&lt;tính-năng&gt;/</code> giữ logic và giao diện của một tính năng và mở đúng một cửa, <code>index.ts</code>; <code>src/pages/</code> ghép các tính năng cho một URL; tính năng không import ruột của nhau. Tính năng mới là <code>lich-tuan</code>:</p>
${SD.cayVi}
<p>Hai quyết định đáng một câu mỗi cái. <strong>Một lưới, hai chế độ.</strong> Trang xem tuần và trang đổi giờ vẽ cùng một lưới; khác nhau ở chỗ ô trống <em>làm gì</em> — link sang form đặt lịch, hay chọn giờ này. Hai bản sao của một bảng 100 dòng sẽ lệch nhau trong vòng một tuần. Nên <code>LuoiLichTuan</code> nhận prop <code>cheDo</code> có kiểu là <strong>kiểu hợp có nhãn</strong> (discriminated union): <code>{ kieu: 'dat' }</code> hoặc <code>{ kieu: 'doi'; lichDangDoi; dangChon; onChon }</code>. TypeScript khi đó không cho gọi <code>cheDo.onChon</code> nếu bạn chưa kiểm <code>cheDo.kieu === 'doi'</code>. <strong>Trang giữ dữ liệu.</strong> Lưới nhận ngày và lịch hẹn qua props; trang quyết định gọi hook nào. Nhờ vậy lưới dễ test, và trang đổi giờ đợi được lịch hẹn về rồi mới biết cần tải bác sĩ nào.</p>
<p>Cửa của tính năng, như nó trông lúc cuối chương:</p>
${pre('ts', SN.cuaLichTuan)}
<div class="callout"><p><strong>JS nhắc nhanh — <code>export { … } from</code>.</strong> <code>export { LuoiLichTuan } from './LuoiLichTuan'</code> xuất lại một tên từ file khác mà không import vào file này. File cửa chỉ gồm những dòng như vậy, nên phần còn lại của app viết <code>import { LuoiLichTuan } from '@/features/lich-tuan'</code> và không bao giờ biết bố cục file bên trong.</p></div>

<h3>Bước 4 — Mỗi mẩu state sống ở đâu</h3>
${slide('rx-10', 6, 'Mỗi mẩu state đúng một chỗ ở: máy chủ, URL, component hoặc store')}
<p>Đây là bước quyết định code sẽ dễ chịu hay khổ sở. Chương 2, 5, 6 và 7 mỗi chương thêm một chỗ state có thể sống; giờ bạn chọn, từng mẩu một, với một câu hỏi đứng đầu:</p>
${SD.stateVi}
<table>
<thead><tr><th>Dữ liệu</th><th>Chỗ ở</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Khung giờ của sáu ngày</td><td>máy chủ, TanStack Query giữ cache</td><td>người khác đổi được; phải tải lại sau mỗi lần ghi</td></tr>
<tr><td>Lịch hẹn của tôi</td><td>máy chủ (<code>useLichHen</code> có sẵn)</td><td>cần để chặn ô trùng giờ</td></tr>
<tr><td>Tuần đang xem</td><td>URL <code>?tuan=2026-10-05</code></td><td>F5, Back và "gửi link" phải giữ được</td></tr>
<tr><td>Ô đang chọn (đổi giờ)</td><td><code>useState</code> trong trang</td><td>chỉ trang này cần; rời trang là quên</td></tr>
<tr><td>Lỗi trùng giờ phía client</td><td><code>useState</code> trong trang</td><td>hiện một lần, xoá khi chọn lại</td></tr>
<tr><td>Đã đăng nhập?</td><td>store Zustand (Chương 7)</td><td>cả app đọc</td></tr>
<tr><td>Giờ khám của phòng khám (các hàng)</td><td><strong>không ở đâu cả</strong> — rút từ dữ liệu</td><td>máy chủ quyết định giờ; viết cứng là chép một sự thật thành hai</td></tr>
</tbody>
</table>
<p>Dòng cuối là dòng hay sai nhất. Rất dễ viết <code>const GIO = ['08:00', '09:30', '14:00', '15:30']</code> trong lưới vì bạn đã nhìn thấy code của máy chủ giả. Rồi phòng khám thêm khung 17:00 và lưới âm thầm bỏ qua nó. Thứ gì tính được từ dữ liệu đang có thì không phải state: tính nó lúc render.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — chép dữ liệu máy chủ vào <code>useState</code>.</strong> <code>const [slots, setSlots] = useState(data)</code> "để còn sửa" tạo ra bản sao thứ hai, bản này thôi đi theo máy chủ ngay khi query tải lại: sau một lần 409, cache nói ô đó đã kín, bản sao của bạn vẫn nói còn trống. Để dữ liệu máy chủ trong cache của query; chỉ giữ <em>lựa chọn của người dùng</em> (một id) trong state cục bộ, và tra object từ cache khi cần.</div>

<h3>Bước 5 — Dữ liệu và API: query key, request, mã lỗi</h3>
${slide('rx-10', 7, 'Sáu query một tuần, dùng chung mục cache với trang chi tiết bác sĩ')}
<p>API đã có <code>GET /api/bac-si/:id/khung-gio?ngay=YYYY-MM-DD</code> — khung giờ của một bác sĩ trong một ngày. Muốn cả tuần, bạn có thể thêm endpoint mới (<code>?tu=…&amp;den=…</code>) hoặc gọi cái có sẵn sáu lần. Thiết kế chọn sáu lần gọi, có chủ đích: query key đang có <code>['bac-si', id, 'khung-gio', ngay]</code> là <em>theo ngày</em>, nên mỗi ngày trong tuần chính là mục cache mà trang chi tiết bác sĩ (Chương 7) đang dùng. Xem một bác sĩ rồi mở cả tuần: ngày đã xem không tốn request nào. Đặt hay đổi giờ: một lệnh <code>invalidateQueries({ queryKey: ['bac-si', id, 'khung-gio'] })</code> làm tươi cả hai màn hình. Ở dự án thật bạn sẽ cân điều đó với sáu lượt đi-về trên mạng chậm; ở đây API giả trả lời trong 5 ms khi test và 100–400 ms trên trình duyệt, và sáu request chạy song song.</p>
<p>Đổi giờ cần một lần ghi. Thay vì bịa URL mới, mở rộng <code>PATCH /api/lich-hen/:id</code> có sẵn (Chương 6 dùng nó với <code>{ trangThai: 'da-huy' }</code> để huỷ) cho nhận <code>{ khungGioId }</code>. Viết <strong>hợp đồng</strong> — mọi câu trả lời máy chủ có thể đưa — trước khi code phía nào:</p>
<table>
<thead><tr><th>Tình huống</th><th>Trả về</th></tr></thead>
<tbody>
<tr><td>lịch hẹn không tồn tại</td><td>404 "Không có lịch hẹn này"</td></tr>
<tr><td>lịch hẹn không còn "chờ xác nhận"</td><td>409 "Chỉ đổi giờ được lịch đang chờ xác nhận"</td></tr>
<tr><td>khung giờ không có hoặc của bác sĩ khác</td><td>404 "Không có khung giờ này"</td></tr>
<tr><td>khung giờ đã có người đặt</td><td>409 "Khung giờ này vừa có người đặt"</td></tr>
<tr><td>bệnh nhân này đã có lịch khác đúng giờ đó</td><td>409 "Bạn đã có một lịch khác vào đúng giờ này"</td></tr>
<tr><td>hợp lệ</td><td>200 + lịch hẹn đã sửa; giờ cũ mở lại, giờ mới kín</td></tr>
</tbody>
</table>
<p><strong>409 Conflict</strong> là mã HTTP cho "yêu cầu của bạn đúng, nhưng nó va với trạng thái hiện tại của máy chủ". Nó đúng y cho các cuộc đua đặt lịch, và nó báo client một điều quan trọng: <em>bức tranh dữ liệu của bạn đã cũ — tải lại đi</em>. Luật trùng giờ cũng được thêm vào <code>POST /api/lich-hen</code>, vì luật chỉ client giữ thì chỉ là lời khuyên. Trong máy chủ giả (handler MSW, Chương 6), hợp đồng thành:</p>
${pre('ts', SN.trungGio)}
${pre('ts', SN.handlerDoiGio)}
<p>Để ý thứ tự kiểm: có tồn tại không, trạng thái lịch hẹn, khung giờ có tồn tại không, còn trống không, rồi mới tới luật theo bệnh nhân. Kiểm rẻ và hiển nhiên trước, luật phải quét cả danh sách lịch hẹn để sau cùng. Để ý cả <code>dieuKhien.tranh</code>: một núm vặn mới cạnh <code>?tre=</code> và <code>?loi=</code> của Chương 6. Mở app với <code>?tranh=1</code> thì mọi lần đổi giờ đều bị "người khác" giành mất giờ vào phút chót, để bạn xem đường 409 trên trình duyệt thật mà không cần người dùng thứ hai.</p>
<p>Phía client, module API và bộ đường dẫn thêm mỗi bên một mục, router thêm hai route lazy — trang xem tuần công khai, trang đổi giờ nằm sau cổng đăng nhập của Chương 7:</p>
${pre('ts', SN.apiDoiGio)}
${pre('ts', SN.duongDan)}
${pre('tsx', SN.router)}

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202 bạn đọc file PDF đề bài rồi mở <code>App.js</code>: một component mọc thêm <code>componentDidMount</code> để fetch, một slice Redux có <code>loading</code>/<code>error</code>/<code>data</code>, và các trạng thái màn hình xuất hiện khi checklist của giảng viên nhắc tới. → Đi làm, một tính năng bắt đầu bằng một ticket có tiêu chí chấp nhận, một bản phác nhanh, một cây component và một ghi chú state sống ở đâu, lời gọi API nào đổi cái gì — thường được đồng nghiệp duyệt trong mười phút trước khi ai đó code. · <em>Vì sao:</em> bug đắt tiền trong làm giao diện không phải lỗi gõ; mà là giả định sai — "lưới luôn có bốn giờ", "kiểm ở client là đủ", "ngày trên URL là một trong ba ngày". Viết chúng ra thì chúng được duyệt. Cách FER202 ổn cho một bài lab một tuần mà bạn là người dùng duy nhất; bạn sẽ gặp lại nó trong code cũ ở công ty, thường là lý do một tính năng phải viết lại.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Bạn được giao làm một lịch đặt hẹn. Kể cho tôi bạn bắt đầu thế nào."</p>
<p>Làm rõ câu chuyện và các biên (ai đặt, đặt trước bao xa, thế nào là trùng). Phác mọi trạng thái của một ô và của trang. Chia component theo "ai giữ dữ liệu nào"; trang ghép, lưới chỉ hiển thị. Lập bản đồ state: dữ liệu máy chủ trong cache query theo từng ngày, tuần đang xem trên URL, lựa chọn trong state cục bộ, không lưu thứ tính được. Chốt hợp đồng API gồm cả các trường hợp xung đột, và giữ luật trùng ở máy chủ lẫn client.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Khi nào bạn để state trên URL thay vì trong state của React?"</p>
<p>Khi người dùng sẽ muốn chia sẻ, đánh dấu, hoặc lấy lại nó sau F5 hay nút Back: bộ lọc, tab đang chọn, trang của danh sách, tuần của lịch. Dùng replace cho các thay đổi nhỏ để lịch sử không bị ngập. Kiểm tra khi đọc — URL là dữ liệu người dùng gõ.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 0/4: ghi chú thiết kế và hợp đồng API</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau Chương 9 (<code>src/mocks/handlers.ts</code>, <code>src/shared/api/phong-kham.ts</code>, <code>src/shared/duong-dan.ts</code>, <code>src/app/router.tsx</code>; 114 test xanh).</p><ol>
<li>Viết một trang ghi chú thiết kế (file Markdown trong repo, hoặc giấy): sáu câu chuyện kèm tiêu chí, các trạng thái của ô, cây component, bảng state, bảng hợp đồng API. Thêm một biên mà bài này chưa nhắc và tự quyết nó (ví dụ: "lịch đang chờ có được dời sang bác sĩ khác không?").</li>
<li>Trong <code>handlers.ts</code>: thêm <code>trungGio</code>, mở rộng <code>PATCH /api/lich-hen/:id</code> với nhánh <code>{ khungGioId }</code> theo đúng thứ tự ở trên, thêm luật trùng vào <code>POST /api/lich-hen</code>, và núm <code>?tranh=1</code> trong <code>dieu-khien.ts</code>.</li>
<li>Thêm <code>api.doiGio</code>, <code>duongDan.lichTuan</code> và <code>duongDan.doiGio</code>.</li>
<li>Tạo <code>src/features/lich-tuan/index.ts</code> (chưa xuất gì cũng được) và hai route trỏ tới hai trang tạm chỉ trả về một tiêu đề.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>npx tsc -b</code> không in gì; cả <strong>114</strong> test cũ vẫn xanh (nhánh huỷ lịch của handler PATCH phải còn chạy); mở <code>/bac-si/bs-2/lich-tuan</code> bằng <code>npm run dev</code> thấy tiêu đề tạm của bạn, và <code>/lich-hen/lh-1/doi-gio</code> đẩy bạn sang trang đăng nhập khi chưa đăng nhập.</p></div>
<details><summary>Lời giải</summary>
<p>Handler, hàm kiểm trùng, mục API, đường dẫn và route đều đã in đầy đủ ở Bước 5; chúng chính là các file của dự án mẫu. Thay đổi còn lại duy nhất của bước này là núm vặn trong <code>src/mocks/dieu-khien.ts</code>: một dòng chú thích <code>?tranh=1 …</code> và <code>tranh: q.get('tranh') === '1'</code> trong object <code>dieuKhien</code>. Một ghi chú thiết kế đủ điểm tối đa theo rubric (10.4) vừa một màn hình: bảng của Bước 1, sơ đồ Bước 2 viết thành danh sách, cây của Bước 3, bảng Bước 4 và hợp đồng Bước 5 — cộng biên bạn tự thêm kèm câu trả lời.</p>
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề:</strong> thiết kế — không code — một tính năng nhỏ mà chủ phòng khám sẽ đòi tiếp theo: <em>"bác sĩ đánh dấu được một ngày nghỉ; bệnh nhân đã có lịch ngày đó phải thấy."</em></p><ol>
<li>Viết ba câu chuyện người dùng, mỗi câu một tiêu chí kiểm được (một cho người đang đặt, một cho người đã có lịch, một cho lưới tuần).</li>
<li>Liệt kê những trạng thái của ô lưới bị thay đổi (gợi ý: cả một cột thành thứ mới).</li>
<li>Điền bảng state: "ngày nghỉ" sống ở đâu, và vì sao không phải một hằng số.</li>
<li>Viết các dòng hợp đồng API bạn cần (endpoint nào, mã gì cho "đặt vào ngày nghỉ").</li>
</ol><p><strong>Đạt khi:</strong> mỗi tiêu chí gọi tên được thứ test hỏi được (một dòng chữ, một vai trò, một URL, một số request), mọi dữ liệu trong bảng có đúng một chỗ ở, và hợp đồng có câu trả lời cho "bệnh nhân đặt vào ngày bác sĩ vừa báo nghỉ" (409, không phải 400 — request đúng dạng; trạng thái máy chủ không đồng ý).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">user story (câu chuyện người dùng)</span><span class="v">"là ai, muốn gì, để làm gì" — đơn vị của một yêu cầu</span></div>
<div class="kv"><span class="k">acceptance criterion (tiêu chí chấp nhận)</span><span class="v">câu đủ chính xác để thành một test</span></div>
<div class="kv"><span class="k">mock-up (bản phác)</span><span class="v">hình màn hình liệt kê mọi trạng thái, không chỉ đường suôn sẻ</span></div>
<div class="kv"><span class="k">component tree (cây component)</span><span class="v">ai vẽ ai; trang ghép, tính năng làm việc</span></div>
<div class="kv"><span class="k">discriminated union (kiểu hợp có nhãn)</span><span class="v">kiểu hợp TS phân biệt bằng một trường chung (<code>kieu</code>) — một component, nhiều chế độ</span></div>
<div class="kv"><span class="k">single source of truth (một nguồn sự thật)</span><span class="v">mỗi sự thật lưu đúng một chỗ; mọi thứ khác tính ra</span></div>
<div class="kv"><span class="k">API contract (hợp đồng API)</span><span class="v">mọi request và mọi câu trả lời có thể có, chốt trước khi code</span></div>
<div class="kv"><span class="k">409 Conflict</span><span class="v">"request đúng, nhưng va với trạng thái hiện tại của máy chủ" — tải lại</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dự án giữa khoá đảo ngược khoá học: bạn dựng; bài giảng đưa đề, tiêu chí và lời giải gập lại.</li>
<li>Biến yêu cầu nói miệng thành câu chuyện người dùng có tiêu chí thành được test; viết ra biên và thứ không làm.</li>
<li>Phác mọi trạng thái của mọi phần — bảy cho một ô lưới — trước khi code; nhãn thành tên truy cập và thành truy vấn của test.</li>
<li>Một lưới chỉ hiển thị với chế độ kiểu hợp có nhãn phục vụ hai trang; trang giữ các hook dữ liệu.</li>
<li>Mỗi sự thật một chỗ ở: cache máy chủ, URL, state cục bộ hoặc store; thứ tính được (giờ khám) không phải state.</li>
<li>Chốt hợp đồng API kèm mọi lỗi; dùng lại query key theo ngày để chung cache; giữ luật trùng ở cả máy chủ.</li>
</ul>

${LINK('https://react.dev/learn/thinking-in-react', '⚛️', 'react.dev — Thinking in React', 'Mock-up → cây component → state tối thiểu → state sống ở đâu.')}
${LINK('https://react.dev/learn/choosing-the-state-structure', '🧭', 'react.dev — Choosing the State Structure', 'Tránh state thừa và state trùng lặp.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/409', '⚠️', 'MDN — 409 Conflict', 'Khi request va với trạng thái hiện tại của tài nguyên.')}
${LINK_TRONG('/courses/react/learn?lessonSlug=rx-7-3-cau-truc', '↩️', 'Bài 7.3 — Cấu trúc dự án', 'features/, pages/, mỗi tính năng một cửa.')}
</div>
`,
};

const L0 = {
    title: '10.0 — Chapter 10 slides: the mid-course project in pictures|||10.0 — Slide Chương 10: dự án giữa khoá bằng hình',
    slug: 'rx-10-0-slides',
    type: 'DOCUMENT',
    isFreePreview: true,
    description: 'Cả Chương 10 trong 29 slide: từ yêu cầu tới cây component và bản đồ state, bốn mốc dựng lịch tuần + đổi giờ, bug ghép tính năng, chặn trùng hai lớp và 409, Profiler lộ bảng bị dựng lại, build và SPA fallback đo thật, tab cũ sau deploy, checklist và rubric tự chấm.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Slides</span>
<h2>The whole chapter in 29 slides</h2>
<p class="lead">The mid-course project: take a spoken request from the clinic owner — "show the whole week, let patients reschedule, stop double bookings" — design it, build it in four milestones, polish it with measurements, and put it on a static server correctly. You build; the lessons give tasks, criteria and folded solutions.</p>
<p>Slides 3–7 belong to Lesson 10.1 (the way of working, user stories with testable criteria, the component tree, where each piece of state lives, six per-day queries sharing cache and the PATCH contract with its three 409s), 8–14 to Lesson 10.2 (four milestones, pure date rules, <code>useQueries</code> + <code>combine</code>, the week grid, the old <code>docNgay</code> assumption a cross-feature test exposed, two layers of duplicate protection, the 409 path with focus), 15–19 to Lesson 10.3 (the Profiler showing the grid remounted and left 408 ms blank on every week change, the fix, a missing <code>enabled</code> that MSW reported while the tests stayed green, accessibility, ten deliberate breaks all caught), 20–26 to Lesson 10.4 (the build output, SPA fallback measured on four servers, a correct nginx config, the old tab after a deploy and <code>vite:preloadError</code>, the course checklist, the rubric, redoing it with your own brief). Slide 27 lists common mistakes, 28 is the cheat sheet for the quiz, 29 the project steps. Everything was built and measured on 26 September 2026 with React 19.3.0, Vite 8.3.1, Vitest 5.0.2, TanStack Query 5.103.3, React Router 8.4.0, MSW 2.15.0, Chromium 149 and nginx 1.27: the app went from 114 to 145 tests.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Slide</span>
<h2>Cả chương trong 29 slide</h2>
<p class="lead">Dự án giữa khoá: nhận một yêu cầu nói miệng của chủ phòng khám — "cho xem cả tuần, cho bệnh nhân tự dời lịch, đừng để đặt trùng" — thiết kế nó, dựng qua bốn mốc, hoàn thiện bằng phép đo, và đưa lên máy chủ tĩnh cho đúng. Bạn tự làm; bài giảng đưa đề, tiêu chí và lời giải gập lại.</p>
<p>Slide 3–7 thuộc Bài 10.1 (cách làm việc, câu chuyện người dùng có tiêu chí kiểm được, cây component, mỗi mẩu state sống ở đâu, sáu query theo ngày dùng chung cache và hợp đồng PATCH với ba mã 409), 8–14 thuộc Bài 10.2 (bốn mốc, luật ngày thuần, <code>useQueries</code> + <code>combine</code>, lưới tuần, giả định cũ của <code>docNgay</code> bị test đi-xuyên-tính-năng lộ ra, chặn trùng hai lớp, đường 409 kèm focus), 15–19 thuộc Bài 10.3 (Profiler cho thấy lưới bị gắn lại và trống 408 ms mỗi lần đổi tuần, cách sửa, một <code>enabled</code> bị thiếu mà MSW báo trong khi test vẫn xanh, khả năng tiếp cận, mười lần cố ý phá đều bị bắt), 20–26 thuộc Bài 10.4 (output build, SPA fallback đo trên bốn máy chủ, cấu hình nginx đúng, tab cũ sau deploy và <code>vite:preloadError</code>, checklist cả khoá, rubric, làm lại với đề của bạn). Slide 27 liệt kê sai lầm hay gặp, 28 là bảng tra nhanh cho bài kiểm tra, 29 là các bước dự án. Mọi thứ được dựng và đo ngày 26/09/2026 với React 19.3.0, Vite 8.3.1, Vitest 5.0.2, TanStack Query 5.103.3, React Router 8.4.0, MSW 2.15.0, Chromium 149 và nginx 1.27: app đi từ 114 lên 145 test.</p>
</div>
${gallery('rx-10', [
  [1, 'Bìa — Chương 10: Dự án giữa khoá'],
  [2, 'Bản đồ chương'],
  [3, 'Dự án giữa khoá: bạn tự làm, bài giảng chỉ đường và chấm'],
  [4, 'Yêu cầu thành sáu câu chuyện người dùng có tiêu chí'],
  [5, 'Mock-up thành cây component'],
  [6, 'Mỗi mẩu state một chỗ ở'],
  [7, 'Sáu query một tuần, dùng chung cache; hợp đồng PATCH'],
  [8, 'Bốn mốc, mỗi mốc một tiêu chí chạy được'],
  [9, 'Mốc 1: luật ngày–tuần là hàm thuần'],
  [10, 'Mốc 2: useQueries + combine'],
  [11, 'Lưới tuần: bảng thật, ô trống là link'],
  [12, 'Ghép tính năng lộ giả định cũ của docNgay'],
  [13, 'Chặn trùng hai lớp'],
  [14, 'Mốc 4: 409, tải lại, focus hộp lỗi'],
  [15, 'Profiler: bảng bị dựng lại, trắng 408 ms'],
  [16, 'Sửa: nhớ giờ của lần render trước'],
  [17, 'Thiếu enabled: MSW la lên, test vẫn xanh'],
  [18, 'Tiếp cận: bảng thật, axe, bàn phím'],
  [19, '31 test mới, 10/10 lần phá bị bắt'],
  [20, 'vite build: ba chunk lazy mới'],
  [21, 'Deep link trên máy chủ tĩnh không fallback: 404'],
  [22, 'nginx đúng: fallback cho trang, 404 cho assets'],
  [23, 'Tab cũ sau deploy và vite:preloadError'],
  [24, 'Checklist cả khoá'],
  [25, 'Rubric tự chấm 100 điểm'],
  [26, 'Làm lại với đề của bạn: đặt phòng lab'],
  [27, 'Sai lầm hay gặp ở Chương 10'],
  [28, 'Bảng tra nhanh Chương 10'],
  [29, 'Tự gõ tiếp dự án'],
])}
`,
};

const L2 = {
    title: '10.2 — Building it: week view, rescheduling and 409 in four milestones|||10.2 — Dựng tính năng: lịch tuần, đổi giờ và 409 qua bốn mốc',
    slug: 'rx-10-2-xay-dung',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Dựng tính năng theo bốn mốc có tiêu chí: luật ngày–tuần thành hàm thuần, lưới tuần bằng useQueries + combine dùng chung cache, đổi giờ với chặn trùng hai lớp (client + máy chủ), xử lý 409 bằng onSettled và focus — kèm một bug ghép tính năng mà test đi-hết-luồng bắt được.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Building it: week view, rescheduling and 409 in four milestones</h2>
<p class="lead">The design from 10.1 is on the table. Now build it — in four milestones, each ending in tests you run. Work like this: read the task and the "done when", try it yourself for 20–40 minutes, and only then open the solution. The explanations between the tasks are the parts that are hard to guess: they come from actually building this feature, including one bug that only appeared when the new feature was joined to the old booking form.</p>
${slide('rx-10', 8, 'Four milestones, each ending in something you can run')}
${SD.mocEn}
<p>Why milestones? A feature this size (about 600 lines with tests) typed in one go gives you a screen full of red and no idea which part is wrong. Each milestone here ends in a <em>green</em> state that you can commit; the next one builds on known-good ground. That is also how you would split this into pull requests at work: rules, read-only view, write path, error path.</p>

<h3>Milestone 1 — The rules as pure functions</h3>
${slide('rx-10', 9, 'Milestone 1: date and week rules are pure functions, tested without React')}
<p><strong>Task.</strong> Before any component, write the rules the grid depends on, as <strong>pure functions</strong> (hàm thuần: same input → same output, no side effects, no React): add a day to a date, find the weekday, find the Monday of a week, list the six clinic days of a week, read <code>?tuan=</code> safely from the URL, decide whether a day is past, and find an existing appointment that clashes with a time.</p>
<p><strong>Done when:</strong> <code>npx vitest run src/features/lich-tuan/logic</code> shows 13 green tests covering: 01/10/2026 is a Thursday and its week starts on Monday 28/09; adding days crosses months and years; a week has six days, no Sunday; four open weeks from 28/09 to 19/10 with <code>null</code> outside; five bad <code>?tuan=</code> values fall back to the first week; a cancelled appointment never clashes; an appointment being rescheduled does not clash with itself.</p>
<p>The one thing that trips everyone: <strong>time zones</strong>. <code>new Date('2026-10-01')</code> is midnight UTC; on a machine in Vietnam (UTC+7) its <code>getDate()</code> is 1, on a CI server in California it is 30 September. The fix is to never mix local time into date arithmetic. Turn the string into a day number with <code>Date.UTC</code>, do integer arithmetic, and turn it back with <code>toISOString()</code>, which is always UTC:</p>
${pre('ts', SN.thoiGianTuan)}
<div class="callout"><p><strong>JS quick reminder — three small tools.</strong> <code>+'09'</code> turns a string into a number (unary plus). <code>Date.UTC(2026, 9, 1)</code> takes the month from <strong>0</strong> (9 = October), hence the <code>- 1</code>. <code>Array.from({ length: 6 }, (_, i) =&gt; …)</code> builds an array of six items by calling the arrow function with each index <code>i</code> (the <code>_</code> is an unused parameter). And <code>((x % 7) + 7) % 7</code> keeps the result between 0 and 6 even for negative <code>x</code>, because JavaScript's <code>%</code> keeps the sign.</p></div>
<p>With those, the week rules are a dozen lines. Note <code>docTuan</code>: a URL is text anyone can type, so it checks three things — shape, is a Monday, inside the open range — and falls back to the first week instead of throwing. Chapter 7's <code>docNgay</code> did the same for one day.</p>
${pre('ts', SN.tuanTs)}
${pre('ts', SN.kiemTrung)}
<p>The tests are plain function calls. <code>test.each</code> runs one test body for each row of a table — five invalid URLs, one line each:</p>
${pre('ts', SN.tuanTest)}
${out(OUT.m1)}
<p>Thirteen tests, 1.66 s wall time, and the tests themselves take 1% of it (the rest is starting jsdom). That is the payoff of pulling rules out of components: they are the cheapest code in the app to test, so test them hard.</p>
<details><summary>Solution — milestone 1 (tests of kiem-trung.ts)</summary>
${pre('ts', SN.kiemTrungTest)}
<p>Together with the three files above (the additions to <code>thoi-gian.ts</code>, <code>tuan.ts</code>, <code>kiem-trung.ts</code>) and <code>tuan.test.ts</code> this is the whole milestone. <code>tenThu</code> (weekday name) is in <code>thoi-gian.ts</code> too: <code>const TEN_THU = ['Thứ Hai', …, 'Chủ nhật']</code> and <code>tenThu(ngay)</code> returns <code>TEN_THU[thuTrongTuan(ngay)]</code>.</p>
</details>

<h3>Milestone 2 — The week view</h3>
${slide('rx-10', 10, 'Milestone 2: useQueries runs six days in parallel, combine folds them into one object')}
<p><strong>Task.</strong> <code>useLichTuan(bacSiId, tuan)</code> returns the six days of a week, each with its state and slots; <code>LuoiLichTuan</code> draws the grid; <code>DieuHuongTuan</code> shows "← Tuần trước · Tuần sau →"; <code>TrangLichTuan</code> at <code>/bac-si/:id/lich-tuan</code> puts it together and, when signed in, passes "my appointments" to the grid. Add a "Xem lịch trống cả tuần →" link on the doctor page.</p>
<p><strong>Done when:</strong> <code>src/pages/TrangLichTuan.test.tsx</code> has 8 green tests: six columns and exactly three requests for the first week; a free cell is a link to <code>/dat-lich/…?bacSi=bs-2&amp;ngay=2026-10-01</code> and a taken cell is not; "Tuần sau →" changes <code>?tuan=</code> with REPLACE and asks for six days; the last week has no "Tuần sau" link; a bad <code>?tuan=</code> shows the first week; coming from the doctor page costs only two new requests; a signed-in clash shows "Bạn có lịch"; one day failing with 500 leaves the other days visible and "Thử lại" fixes it; clicking a cell of <em>next</em> week reaches the booking form.</p>
<p><strong>Six queries, not one loop of <code>useQuery</code>.</strong> Hooks must be called the same number of times in the same order on every render. A week is always six days here, but "call a hook in a loop" is the habit that breaks the day a page shows a variable number of things. TanStack Query has a hook made for a list of queries: <code>useQueries({ queries: [...] })</code>, where the array may have any length. Its <code>combine</code> option folds the array of results into whatever shape your component wants — here one object with a <code>ngay</code> array (state per day), the first error, and a <code>thuLai</code> (retry) function — and TanStack only hands you a new object when a result really changed.</p>
${pre('ts', SN.useLichTuan)}
<p>Three details are worth reading twice. The query key is the <em>same</em> <code>khoa.khungGio(bacSiId, ngay)</code> the day picker of Chapter 7 uses — that is the shared cache from the design. <code>enabled</code> is false for past days (no request) and for an unknown doctor (in 10.3 you will see what happens without that second condition). And the state of a day uses <code>q.isError &amp;&amp; !q.data</code>: if a refetch fails but we still have old slots, show them rather than "Lỗi".</p>
${slide('rx-10', 11, 'The week grid: a real table, past days dimmed, free cells are links')}
<p>The grid is a <strong>real <code>&lt;table&gt;</code></strong>, not divs in a CSS grid: <code>&lt;caption&gt;</code> names it, <code>&lt;th scope="col"&gt;</code> heads each day and <code>&lt;th scope="row"&gt;</code> each hour, so a screen reader moving through cells announces "Thứ Sáu 02/10, 09:30, Trống". The rows are the hours that appear in the data (<code>new Set</code> removes duplicates, <code>.sort()</code> orders <code>'08:00' &lt; '09:30'</code> as strings). Each cell is decided by one function, in the order of the state diagram from 10.1:</p>
${pre('tsx', SN.luoiO)}
<div class="callout"><p><strong>JS quick reminder — <code>new Set</code>, spread and <code>at(-1)</code>.</strong> <code>[...new Set(list)]</code> removes duplicates: a <code>Set</code> keeps one copy of each value, and <code>...</code> spreads it back into an array. <code>flatMap</code> maps each day to its list of hours and flattens the lists into one. <code>ngay.at(-1)</code> is the last element (negative index counts from the end).</p></div>
<p>Week navigation keeps the week on the URL like Chapter 7 kept the day: a <code>Link</code> with <code>replace</code>, so browsing four weeks does not add four history entries. At the edges it renders plain text, not a disabled link — a link styled grey is still reachable with Tab and still followed with Enter.</p>
${pre('tsx', SN.dieuHuong)}
<p>The tests count real requests with MSW's life-cycle events, as in Chapter 9 — that is how "past days cost nothing" and "the doctor page already paid for 01/10" become assertions rather than hopes:</p>
${pre('tsx', SN.testTuanDau)}
${pre('tsx', SN.testCacheChung)}
${slide('rx-10', 12, 'Joining features exposes an old assumption: docNgay only knows three days')}
<p>Now the interesting part. With the grid finished, the last criterion — "clicking a cell of next week reaches the booking form" — was written as a test that walks the whole path:</p>
${pre('tsx', SN.testTuanSauForm)}
<p>The first run, before any fix:</p>
${out(OUT.m2Loi)}
<p>Six tests green, the one that crosses from the new feature into the old form red — and the old form says "Không tìm thấy khung giờ này". Reading <code>TrangDatLich</code> shows why: since Chapter 7 it reads the day with <code>docNgay(sp)</code>, and <code>docNgay</code> was written for the three-day picker — anything not in <code>NGAY_KHAM</code> silently becomes <code>2026-10-01</code>. The URL says 06/10, the page asks the server for 01/10's slots, the slot id is not among them. Nothing was wrong in either feature alone; the <strong>assumption</strong> "a booking date is one of three" was never written down, so the new feature broke it without anyone noticing — except the test that walked across.</p>
<p>The fix is not to widen <code>docNgay</code> (the day picker really does have three days) but to give the booking page its own reader that accepts any open clinic day:</p>
${pre('ts', SN.docNgayDat)}
${out(OUT.m2Xanh)}
<div class="pitfall co-tieu-de"><strong>Trap — reusing a helper without reading its assumption.</strong> <code>docNgay</code> had a perfect name for the job and a comment that said exactly what it did ("a day that is one of the clinic days; otherwise the first one"). It was reused anyway, for a page whose days had just stopped being three. Before reusing a validator, read its <em>fallback</em>: silent fallbacks are where joined features break without an error.</div>
<details><summary>Solution — milestone 2 (LuoiLichTuan.tsx and TrangLichTuan.tsx)</summary>
${pre('tsx', SN.luoi)}
${pre('tsx', SN.trangLichTuan)}
<p>The version of <code>LuoiLichTuan</code> above already contains the "remember the previous hours" fix from 10.3 (the <code>gioCu</code> lines). The first version drew nothing but the table and the page replaced it with <code>&lt;p&gt;Đang tải lịch tuần…&lt;/p&gt;</code> while loading — 10.3 measures why that was a mistake. The one-day-error test:</p>
${pre('tsx', SN.testMotNgayLoi)}
</details>

<h3>Milestone 3 — Rescheduling, with two layers of duplicate protection</h3>
${slide('rx-10', 13, 'Two layers against duplicates: the client for experience, the server for truth')}
<p><strong>Task.</strong> <code>useDoiGio</code> (a mutation calling <code>api.doiGio</code>), <code>TrangDoiGio</code> at <code>/lich-hen/:id/doi-gio</code> (the grid in reschedule mode, a confirm button), and an "Đổi giờ" link next to "Huỷ" for every pending appointment in "Lịch hẹn của tôi". The client must refuse to select a time at which the user already has another active appointment, and check again right before sending.</p>
<p><strong>Done when:</strong> choosing 09:30 Friday and confirming lands on <code>/lich-hen</code> with "Đã đổi giờ lịch hẹn lh-1…", the list shows the new time, the old slot is free and the new one taken in the fake database; with an existing 09:30 Friday appointment at another doctor the cell shows "Bạn có lịch", has no button, and <strong>no PATCH is sent</strong>; if the clashing appointment was created elsewhere <em>after</em> the page loaded, the server answers 409 "Bạn đã có một lịch khác…".</p>
${SD.haiLopEn}
<p>Why both layers? The client layer is about <strong>experience</strong>: the user sees immediately which times are impossible, instead of filling in a choice and being refused. But the client only knows what is in its cache, and the cache can be 30 seconds old, or the user can have two tabs, or a phone. The server layer is about <strong>truth</strong>: it is the only place that sees every appointment. A test proves the gap is real — the clash is created in the fake database after the page has loaded, the client check passes, the PATCH goes out, and only the server stops it:</p>
${pre('tsx', SN.testLopMayChu)}
<p>The mutation hook follows Chapter 6's pattern exactly — including the choice of <code>onSettled</code>, which the next milestone depends on:</p>
${pre('ts', SN.useDoiGio)}
<p>And the page's confirm handler shows both layers in five lines: re-check against the cached appointments, send, and on failure clear the selection (the grid has been refetched by then, so the lost slot now shows "Kín"):</p>
${pre('tsx', SN.xacNhan)}
<div class="callout"><p><strong>TS quick reminder — <code>const lichDangDoi = lh</code>.</strong> After <code>if (!lh …) return</code>, TypeScript knows <code>lh</code> is defined — but only in that function body. Inside the inner function <code>xacNhan</code> it forgets, because the inner function might run later when <code>lh</code> could have changed. Copying it into a new <code>const</code> after the check keeps the narrowing everywhere.</p></div>
<p>Adding the "Đổi giờ" link to the existing list broke two tests that had nothing to do with rescheduling:</p>
${out(OUT.thieuRouter)}
<p>The Chapter 12 tests of <code>DanhSachLichHen</code> render it with <code>renderVoiQuery</code> — no router — and a <code>&lt;Link&gt;</code> without a router throws while rendering. The error message is about <code>basename</code>, which is how React Router's context shows up when it is missing. The fix is in the test, not the component: render with the helper that provides a router.</p>
${pre('tsx', SN.thieuRouter)}
${pre('tsx', SN.nutDoiGio)}

<h3>Milestone 4 — The 409 path</h3>
${slide('rx-10', 14, 'Milestone 4: on 409 refetch the grid, clear the selection, move focus to the error')}
<p><strong>Task.</strong> When the server says 409, the user must (a) see why, in words, (b) have focus moved to that message so keyboard and screen-reader users notice, (c) see the grid already updated so the lost slot shows "Kín", (d) have nothing selected, so the confirm button reads "Chọn một giờ trống" and is disabled. Nothing may change in the database.</p>
<p><strong>Done when:</strong> the test below and the other four tests of <code>TrangDoiGio.test.tsx</code> are green, and opening <code>/lich-hen/lh-1/doi-gio?tranh=1</code> in the browser shows the same behaviour.</p>
${SD.doiGioEn}
<p>(c) comes from <code>onSettled</code>: it runs after success <em>and</em> failure, and because it returns the invalidation promise, <code>mutateAsync</code> rejects only after the refetch finished. With <code>onSuccess</code>, a 409 would leave the old grid on screen with the lost slot still green. (b) is a small effect plus an element that can take focus:</p>
${pre('tsx', SN.focusLoi)}
<p><code>role="alert"</code> makes screen readers announce the text as soon as it appears; <code>tabIndex={-1}</code> lets JavaScript focus a <code>div</code> without putting it in the Tab order; the effect depends on the message string, so it runs again if a different error replaces the first. The test states all four requirements:</p>
${pre('tsx', SN.testDoiGio409)}
${out(OUT.m34)}
<p>(This is the file at the end of the chapter: the fifth line, “… mọi request đều của bs-2”, is the test 10.3 adds after a bug it found.)</p>
<p>To be sure the test really watches <code>onSettled</code>, change it to <code>onSuccess</code> and run again — two tests go red (the full "mutation" experiment is in 10.3):</p>
${out(OUT.dbOnSuccess)}
<details><summary>Solution — milestones 3 and 4 (TrangDoiGio.tsx and the test preparation)</summary>
${pre('tsx', SN.trangDoiGio)}
${pre('tsx', SN.testDoiGioChuanBi)}
${pre('tsx', SN.testDoiGioOk)}
${pre('tsx', SN.testLopClient)}
<p>Plus the <code>vuaDoi</code> message in <code>TrangLichHen.tsx</code> (read <code>useLocation().state</code> like <code>vuaDat</code>, show "Đã đổi giờ lịch hẹn {vuaDoi}. Giờ cũ đã được trả lại cho người khác đặt." in a <code>role="status"</code> paragraph) and the CSS for <code>.luoi-tuan</code> and the <code>.o-*</code> cell classes.</p>
</details>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202 booking is a Redux thunk: dispatch <code>pending</code>, <code>await axios.post</code>, dispatch <code>fulfilled</code> or <code>rejected</code>, and on error <code>alert(error.message)</code>; the list is refreshed by dispatching the fetch again — if someone remembers. Duplicate checks, if any, are a <code>filter</code> in the component. → At work: a mutation hook whose <code>onSettled</code> invalidates exactly the keys the write touched, an inline error box that takes focus, a pure clash function shared by grid and submit, and the same rule on the server returning 409. · <em>Why:</em> <code>alert()</code> blocks the page and cannot be styled or tested nicely; a forgotten refetch leaves stale screens; a client-only rule fails the moment a second tab exists. The thunk pattern still works and you will maintain it in older apps — keep the same ideas: refetch on settle, show errors inline.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "Two users try to book the same slot at the same time. What happens in your UI?"</p>
<p>The server is the referee: the second write gets 409. The client treats 409 as "my data is stale": invalidate and refetch the slots on settle (not only on success), show a clear message in place, move focus to it, clear the now-invalid selection. Optionally show which slots are still free. Never trust a client-side availability check as the final word.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "Why <code>useQueries</code> and not <code>useQuery</code> in a <code>map</code>?"</p>
<p>Hooks must be called in the same order and number on every render; a loop whose length can change breaks that rule. <code>useQueries</code> is one hook taking an array of query options of any length, with <code>combine</code> to reshape the results and stable references when nothing changed.</p></div>

<h3>🛠 Keep building the project — steps 1–2/4: the four milestones</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after step 0/4 of 10.1 (handler, <code>api.doiGio</code>, paths, placeholder routes; 114 tests green).</p><ol>
<li>Milestone 1: <code>thoi-gian.ts</code> additions, <code>logic/tuan.ts</code>, <code>logic/kiem-trung.ts</code> and their tests.</li>
<li>Milestone 2: <code>useLichTuan.ts</code>, <code>LuoiLichTuan.tsx</code>, <code>DieuHuongTuan.tsx</code>, <code>pages/TrangLichTuan.tsx</code>, the link on the doctor page, <code>TrangLichTuan.test.tsx</code> — and the <code>docNgayDat</code> fix when the cross-feature test goes red.</li>
<li>Milestones 3–4: <code>useDoiGio.ts</code>, <code>pages/TrangDoiGio.tsx</code>, the "Đổi giờ" link, the <code>vuaDoi</code> message, <code>TrangDoiGio.test.tsx</code>; switch the Chapter 12 list test to <code>renderVoiRouter</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>npx tsc -b</code> prints nothing and <code>npx vitest run</code> shows <strong>140 passed</strong> (114 old + 13 + 8 + 5); in <code>npm run dev</code>, signed in, you can book a slot from the week view, reschedule it from "Lịch hẹn của tôi", and see the 409 path with <code>?tranh=1</code>.</p></div>
<details><summary>Solution</summary>
<p>All files are printed in full in the folded solutions of the four milestones above; the doctor-page link is <code>&lt;Link className="nut" to={duongDan.lichTuan(id)}&gt;Xem lịch trống cả tuần →&lt;/Link&gt;</code> placed after <code>&lt;ChonKhungGio /&gt;</code>. The count of 140 is before 10.3, which adds four quality tests and one more reschedule test (145).</p>
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> show in the grid's caption how many slots are still free that week, e.g. "Lịch khám tuần 05/10/2026 – 10/10/2026 · 17 giờ trống".</p><ol>
<li>Write a pure function <code>demTrong(ngay: NgayTrongTuan[])</code> in <code>logic/</code> and two tests for it (a week with a past day, a week with a day in error).</li>
<li>Use it in the caption. Decide: do "Bạn có lịch" cells count as free? Write the decision as a test.</li>
<li>Update the caption query in the existing tests if it changed — or better, query the table by a regular expression.</li>
</ol><p><strong>Done when:</strong> your new tests are green, all old tests still pass, and changing <code>kg.conTrong</code> to <code>true</code> inside your counter makes one of your tests red.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">milestone</span><span class="v">a slice of a feature that ends in a green, committable state</span></div>
<div class="kv"><span class="k">pure function</span><span class="v">same input, same output, no side effects — the cheapest code to test</span></div>
<div class="kv"><span class="k"><code>useQueries</code></span><span class="v">one hook for an array of queries of any length</span></div>
<div class="kv"><span class="k"><code>combine</code></span><span class="v">reshapes the array of query results into one value for the component</span></div>
<div class="kv"><span class="k"><code>onSettled</code></span><span class="v">mutation callback after success <em>or</em> error — invalidate here</span></div>
<div class="kv"><span class="k">integration test</span><span class="v">a test that crosses features (grid → form) and catches broken assumptions</span></div>
<div class="kv"><span class="k"><code>aria-pressed</code></span><span class="v">marks a toggle-like button as on/off for assistive technology</span></div>
<div class="kv"><span class="k">narrowing</span><span class="v">TS learning a more precise type after a check; lost inside inner functions</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Build in milestones that each end green: rules, read-only view, write path, error path.</li>
<li>Do date arithmetic in UTC day numbers; keep rules like "is past", "which week", "clashes" as pure, heavily tested functions.</li>
<li><code>useQueries</code> + <code>combine</code> loads a week as six per-day cache entries shared with other screens; <code>enabled</code> skips past days.</li>
<li>A real <code>&lt;table&gt;</code> with caption and scoped headers; hours derived from data; free cells are links or <code>aria-pressed</code> buttons.</li>
<li>Guard duplicates twice: a client check for experience, a server 409 for truth; a test with a clash created after load proves the gap.</li>
<li>On 409: <code>onSettled</code> refetch, clear the selection, focus a <code>role="alert"</code> box; cross-feature tests catch assumptions like <code>docNgay</code>'s three days.</li>
</ul>

${LINK('https://tanstack.com/query/latest/docs/framework/react/reference/useQueries', '🗃', 'TanStack Query — useQueries', 'Dynamic parallel queries and the combine option.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations', '🔄', 'TanStack Query — Invalidations from mutations', 'Refresh exactly what a write touched.')}
${LINK('https://react.dev/reference/rules/rules-of-hooks', '📏', 'react.dev — Rules of Hooks', 'Why hooks cannot be called in loops.')}
${LINK_TRONG('/courses/react/learn?lessonSlug=rx-6-3-mutation', '↩️', 'Lesson 6.3 — Mutations', 'useMutation, onSettled and invalidation, first seen.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Dựng tính năng: lịch tuần, đổi giờ và 409 qua bốn mốc</h2>
<p class="lead">Thiết kế ở 10.1 đã nằm trên bàn. Giờ dựng nó — qua bốn mốc, mỗi mốc kết thúc bằng các test bạn chạy được. Làm thế này: đọc đề và "đạt khi", tự thử 20–40 phút, rồi mới mở lời giải. Phần giải thích xen giữa các đề là những chỗ khó đoán: chúng đến từ việc dựng thật tính năng này, gồm cả một bug chỉ xuất hiện khi tính năng mới được nối vào form đặt lịch cũ.</p>
${slide('rx-10', 8, 'Bốn mốc, mỗi mốc kết thúc bằng thứ chạy được')}
${SD.mocVi}
<p>Vì sao chia mốc? Một tính năng cỡ này (khoảng 600 dòng kể cả test) gõ một lèo sẽ cho bạn một màn hình đỏ và không biết phần nào sai. Mỗi mốc ở đây kết thúc ở trạng thái <em>xanh</em> mà bạn commit được; mốc sau xây trên nền đã biết là tốt. Đó cũng là cách bạn chia pull request ở công ty: luật, màn hình chỉ đọc, đường ghi, đường lỗi.</p>

<h3>Mốc 1 — Luật thành hàm thuần</h3>
${slide('rx-10', 9, 'Mốc 1: luật ngày–tuần là hàm thuần, test không cần React')}
<p><strong>Đề.</strong> Trước mọi component, viết các luật mà lưới dựa vào, dưới dạng <strong>hàm thuần</strong> (pure function: cùng đầu vào → cùng đầu ra, không tác dụng phụ, không React): cộng ngày, tìm thứ trong tuần, tìm thứ Hai của một tuần, liệt kê sáu ngày khám của một tuần, đọc <code>?tuan=</code> an toàn từ URL, biết một ngày đã qua chưa, và tìm lịch hẹn đang có mà trùng một giờ.</p>
<p><strong>Đạt khi:</strong> <code>npx vitest run src/features/lich-tuan/logic</code> hiện 13 test xanh, phủ: 01/10/2026 là thứ Năm và tuần của nó bắt đầu thứ Hai 28/09; cộng ngày qua tháng và qua năm; một tuần có sáu ngày, không Chủ nhật; bốn tuần mở từ 28/09 tới 19/10, ngoài khoảng là <code>null</code>; năm giá trị <code>?tuan=</code> bậy đều rơi về tuần đầu; lịch đã huỷ không bao giờ trùng; lịch đang được đổi không trùng với chính nó.</p>
<p>Thứ làm ai cũng vấp: <strong>múi giờ</strong>. <code>new Date('2026-10-01')</code> là nửa đêm UTC; trên máy ở Việt Nam (UTC+7) <code>getDate()</code> của nó là 1, trên máy CI ở California là 30 tháng 9. Cách chữa: không bao giờ trộn giờ địa phương vào phép tính ngày. Đổi chuỗi thành số thứ tự ngày bằng <code>Date.UTC</code>, tính bằng số nguyên, rồi đổi ngược bằng <code>toISOString()</code> — hàm này luôn trả theo UTC:</p>
${pre('ts', SN.thoiGianTuan)}
<div class="callout"><p><strong>JS nhắc nhanh — ba món nhỏ.</strong> <code>+'09'</code> đổi chuỗi thành số (dấu cộng một ngôi). <code>Date.UTC(2026, 9, 1)</code> đếm tháng từ <strong>0</strong> (9 = tháng 10), vì thế mới có <code>- 1</code>. <code>Array.from({ length: 6 }, (_, i) =&gt; …)</code> tạo mảng sáu phần tử bằng cách gọi arrow function với từng chỉ số <code>i</code> (<code>_</code> là tham số không dùng). Còn <code>((x % 7) + 7) % 7</code> giữ kết quả trong 0–6 kể cả khi <code>x</code> âm, vì <code>%</code> của JavaScript giữ dấu.</p></div>
<p>Có mấy hàm đó, luật tuần chỉ còn chục dòng. Để ý <code>docTuan</code>: URL là chữ ai cũng gõ được, nên nó kiểm ba điều — đúng dạng, là thứ Hai, trong khoảng mở — và sai thì về tuần đầu chứ không ném lỗi. <code>docNgay</code> ở Chương 7 làm đúng như vậy cho một ngày.</p>
${pre('ts', SN.tuanTs)}
${pre('ts', SN.kiemTrung)}
<p>Test chỉ là gọi hàm. <code>test.each</code> chạy một thân test cho mỗi dòng của một bảng — năm URL bậy, mỗi cái một dòng:</p>
${pre('ts', SN.tuanTest)}
${out(OUT.m1)}
<p>Mười ba test, 1,66 giây tổng, và phần chạy test chỉ chiếm 1% (còn lại là khởi động jsdom). Đó là cái lợi của việc rút luật ra khỏi component: chúng là phần code rẻ nhất để test trong cả app, nên hãy test thật kỹ.</p>
<details><summary>Lời giải — mốc 1 (test của kiem-trung.ts)</summary>
${pre('ts', SN.kiemTrungTest)}
<p>Cùng với ba file ở trên (phần thêm vào <code>thoi-gian.ts</code>, <code>tuan.ts</code>, <code>kiem-trung.ts</code>) và <code>tuan.test.ts</code>, đó là cả mốc. <code>tenThu</code> (tên thứ) cũng nằm trong <code>thoi-gian.ts</code>: <code>const TEN_THU = ['Thứ Hai', …, 'Chủ nhật']</code> và <code>tenThu(ngay)</code> trả <code>TEN_THU[thuTrongTuan(ngay)]</code>.</p>
</details>

<h3>Mốc 2 — Màn hình xem tuần</h3>
${slide('rx-10', 10, 'Mốc 2: useQueries chạy sáu ngày song song, combine gộp thành một object')}
<p><strong>Đề.</strong> <code>useLichTuan(bacSiId, tuan)</code> trả sáu ngày của một tuần, mỗi ngày kèm trạng thái và khung giờ; <code>LuoiLichTuan</code> vẽ lưới; <code>DieuHuongTuan</code> hiện "← Tuần trước · Tuần sau →"; <code>TrangLichTuan</code> ở <code>/bac-si/:id/lich-tuan</code> ghép lại và, khi đã đăng nhập, đưa "lịch của tôi" cho lưới. Thêm link "Xem lịch trống cả tuần →" trên trang bác sĩ.</p>
<p><strong>Đạt khi:</strong> <code>src/pages/TrangLichTuan.test.tsx</code> có 8 test xanh: sáu cột và đúng ba request cho tuần đầu; ô trống là link tới <code>/dat-lich/…?bacSi=bs-2&amp;ngay=2026-10-01</code>, ô kín thì không; "Tuần sau →" đổi <code>?tuan=</code> bằng REPLACE và hỏi sáu ngày; tuần cuối không còn link "Tuần sau"; <code>?tuan=</code> bậy hiện tuần đầu; đi từ trang bác sĩ sang chỉ tốn hai request mới; đăng nhập mà trùng giờ thì hiện "Bạn có lịch"; một ngày lỗi 500 thì các ngày khác vẫn hiện và "Thử lại" chữa được; bấm một ô của tuần <em>sau</em> tới được form đặt lịch.</p>
<p><strong>Sáu query, không phải <code>useQuery</code> trong vòng lặp.</strong> Hook phải được gọi cùng số lần, cùng thứ tự ở mọi lần render. Ở đây tuần luôn có sáu ngày, nhưng "gọi hook trong vòng lặp" là thói quen sẽ vỡ vào cái ngày một trang hiện số thứ thay đổi. TanStack Query có sẵn hook cho một danh sách query: <code>useQueries({ queries: [...] })</code>, mảng dài bao nhiêu cũng được. Tuỳ chọn <code>combine</code> gộp mảng kết quả thành hình dạng component muốn — ở đây là một object có mảng <code>ngay</code> (trạng thái từng ngày), lỗi đầu tiên và hàm <code>thuLai</code> — và TanStack chỉ trao object mới khi kết quả thật sự đổi.</p>
${pre('ts', SN.useLichTuan)}
<p>Ba chi tiết đáng đọc hai lần. Query key <em>chính là</em> <code>khoa.khungGio(bacSiId, ngay)</code> mà bộ chọn ngày của Chương 7 dùng — đó là cache chung trong thiết kế. <code>enabled</code> là false cho ngày đã qua (không request) và cho bác sĩ chưa biết (ở 10.3 bạn sẽ thấy chuyện gì xảy ra khi thiếu điều kiện thứ hai). Và trạng thái một ngày dùng <code>q.isError &amp;&amp; !q.data</code>: nếu lần tải lại hỏng mà vẫn còn khung giờ cũ, hiện chúng thay vì "Lỗi".</p>
${slide('rx-10', 11, 'Lưới tuần: bảng thật, ngày đã qua mờ, ô trống là link')}
<p>Lưới là một <strong><code>&lt;table&gt;</code> thật</strong>, không phải các div xếp bằng CSS grid: <code>&lt;caption&gt;</code> đặt tên cho bảng, <code>&lt;th scope="col"&gt;</code> làm đầu cột mỗi ngày và <code>&lt;th scope="row"&gt;</code> đầu hàng mỗi giờ, nên trình đọc màn hình đi qua từng ô sẽ đọc "Thứ Sáu 02/10, 09:30, Trống". Các hàng là những giờ có trong dữ liệu (<code>new Set</code> bỏ trùng, <code>.sort()</code> xếp <code>'08:00' &lt; '09:30'</code> theo chuỗi). Mỗi ô do một hàm quyết định, theo đúng thứ tự sơ đồ trạng thái ở 10.1:</p>
${pre('tsx', SN.luoiO)}
<div class="callout"><p><strong>JS nhắc nhanh — <code>new Set</code>, spread và <code>at(-1)</code>.</strong> <code>[...new Set(list)]</code> bỏ trùng: <code>Set</code> giữ mỗi giá trị một bản, và <code>...</code> trải nó lại thành mảng. <code>flatMap</code> biến mỗi ngày thành danh sách giờ rồi dàn phẳng các danh sách thành một. <code>ngay.at(-1)</code> là phần tử cuối (chỉ số âm đếm từ cuối).</p></div>
<p>Điều hướng tuần giữ tuần trên URL như Chương 7 giữ ngày: một <code>Link</code> có <code>replace</code>, để lướt bốn tuần không đẻ bốn mục lịch sử. Ở hai đầu nó vẽ chữ thường, không phải link bị tắt — một link tô xám vẫn Tab tới được và vẫn bấm được bằng Enter.</p>
${pre('tsx', SN.dieuHuong)}
<p>Test đếm request thật bằng sự kiện vòng đời của MSW, như Chương 9 — đó là cách "ngày đã qua không tốn gì" và "trang bác sĩ đã trả tiền cho ngày 01/10" thành phép kiểm chứ không phải hy vọng:</p>
${pre('tsx', SN.testTuanDau)}
${pre('tsx', SN.testCacheChung)}
${slide('rx-10', 12, 'Ghép tính năng làm lộ giả định cũ: docNgay chỉ biết ba ngày')}
<p>Giờ tới phần thú vị. Lưới xong, tiêu chí cuối — "bấm một ô của tuần sau tới được form đặt lịch" — được viết thành một test đi hết con đường:</p>
${pre('tsx', SN.testTuanSauForm)}
<p>Lần chạy đầu, trước khi sửa gì:</p>
${out(OUT.m2Loi)}
<p>Sáu test xanh, đúng cái test bắc từ tính năng mới sang form cũ thì đỏ — và form cũ nói "Không tìm thấy khung giờ này". Đọc <code>TrangDatLich</code> ra ngay lý do: từ Chương 7 nó đọc ngày bằng <code>docNgay(sp)</code>, mà <code>docNgay</code> được viết cho bộ chọn ba ngày — cái gì không nằm trong <code>NGAY_KHAM</code> đều âm thầm thành <code>2026-10-01</code>. URL nói 06/10, trang hỏi máy chủ khung giờ ngày 01/10, id khung giờ không có trong đó. Riêng từng tính năng không có gì sai; <strong>giả định</strong> "ngày đặt lịch là một trong ba ngày" chưa bao giờ được viết ra, nên tính năng mới phá nó mà không ai hay — trừ cái test đi xuyên qua.</p>
<p>Cách sửa không phải nới <code>docNgay</code> (bộ chọn ngày đúng là chỉ có ba ngày) mà cho trang đặt lịch một hàm đọc riêng, nhận mọi ngày khám đang mở:</p>
${pre('ts', SN.docNgayDat)}
${out(OUT.m2Xanh)}
<div class="pitfall co-tieu-de"><strong>Bẫy — dùng lại hàm tiện ích mà không đọc giả định của nó.</strong> <code>docNgay</code> có cái tên hợp việc hoàn hảo và một dòng chú thích nói đúng nó làm gì ("một ngày khám; lạ thì ngày đầu tiên"). Vậy mà vẫn bị dùng lại cho một trang mà số ngày vừa thôi là ba. Trước khi dùng lại một hàm kiểm tra, đọc <em>đường lùi</em> của nó: lùi âm thầm chính là chỗ các tính năng ghép lại hỏng mà không có lỗi nào.</div>
<details><summary>Lời giải — mốc 2 (LuoiLichTuan.tsx và TrangLichTuan.tsx)</summary>
${pre('tsx', SN.luoi)}
${pre('tsx', SN.trangLichTuan)}
<p>Bản <code>LuoiLichTuan</code> ở trên đã có sẵn phần sửa "nhớ giờ của lần trước" của 10.3 (các dòng <code>gioCu</code>). Bản đầu chỉ vẽ bảng, và trang thay cả bảng bằng <code>&lt;p&gt;Đang tải lịch tuần…&lt;/p&gt;</code> khi đang tải — 10.3 đo vì sao đó là sai lầm. Test một-ngày-lỗi:</p>
${pre('tsx', SN.testMotNgayLoi)}
</details>

<h3>Mốc 3 — Đổi giờ, với hai lớp chặn trùng</h3>
${slide('rx-10', 13, 'Chặn trùng hai lớp: client cho trải nghiệm, máy chủ cho sự thật')}
<p><strong>Đề.</strong> <code>useDoiGio</code> (một mutation gọi <code>api.doiGio</code>), <code>TrangDoiGio</code> ở <code>/lich-hen/:id/doi-gio</code> (lưới ở chế độ đổi giờ, một nút xác nhận), và một link "Đổi giờ" cạnh "Huỷ" cho mỗi lịch đang chờ trong "Lịch hẹn của tôi". Client phải từ chối chọn một giờ mà người dùng đã có lịch khác còn hiệu lực, và kiểm lại ngay trước khi gửi.</p>
<p><strong>Đạt khi:</strong> chọn 09:30 thứ Sáu rồi xác nhận thì về <code>/lich-hen</code> với "Đã đổi giờ lịch hẹn lh-1…", danh sách hiện giờ mới, trong cơ sở dữ liệu giả giờ cũ trống lại còn giờ mới kín; nếu đã có lịch 09:30 thứ Sáu với bác sĩ khác thì ô đó hiện "Bạn có lịch", không có nút, và <strong>không PATCH nào được gửi</strong>; nếu lịch trùng được tạo ở chỗ khác <em>sau khi</em> trang đã tải, máy chủ trả 409 "Bạn đã có một lịch khác…".</p>
${SD.haiLopVi}
<p>Vì sao cần cả hai lớp? Lớp client lo <strong>trải nghiệm</strong>: người dùng thấy ngay giờ nào không thể, thay vì chọn xong mới bị từ chối. Nhưng client chỉ biết thứ nằm trong cache, mà cache có thể cũ 30 giây, hoặc người dùng mở hai tab, hoặc dùng điện thoại. Lớp máy chủ lo <strong>sự thật</strong>: nó là nơi duy nhất thấy mọi lịch hẹn. Một test chứng minh khe hở là có thật — lịch trùng được tạo trong cơ sở dữ liệu giả sau khi trang đã tải, lớp client cho qua, PATCH đi, và chỉ máy chủ chặn lại:</p>
${pre('tsx', SN.testLopMayChu)}
<p>Hook mutation theo đúng khuôn của Chương 6 — kể cả việc chọn <code>onSettled</code>, thứ mà mốc sau phụ thuộc vào:</p>
${pre('ts', SN.useDoiGio)}
<p>Và hàm xác nhận của trang cho thấy cả hai lớp trong năm dòng: kiểm lại với lịch trong cache, gửi, hỏng thì bỏ chọn (lúc đó lưới đã tải lại xong, nên ô vừa mất hiện "Kín"):</p>
${pre('tsx', SN.xacNhan)}
<div class="callout"><p><strong>TS nhắc nhanh — <code>const lichDangDoi = lh</code>.</strong> Sau <code>if (!lh …) return</code>, TypeScript biết <code>lh</code> có giá trị — nhưng chỉ trong thân hàm đó. Vào tới hàm con <code>xacNhan</code> nó quên, vì hàm con có thể chạy muộn hơn, lúc <code>lh</code> có thể đã đổi. Chép sang một <code>const</code> mới sau khi kiểm thì kiểu hẹp được giữ ở mọi nơi.</p></div>
<p>Thêm link "Đổi giờ" vào danh sách có sẵn làm đỏ hai test chẳng liên quan gì tới đổi giờ:</p>
${out(OUT.thieuRouter)}
<p>Test Chương 12 của <code>DanhSachLichHen</code> vẽ nó bằng <code>renderVoiQuery</code> — không có router — mà <code>&lt;Link&gt;</code> không có router thì ném lỗi ngay khi render. Thông báo nói về <code>basename</code>, đó là hình dạng ngữ cảnh của React Router khi nó vắng mặt. Sửa ở test, không ở component: vẽ bằng hàm có sẵn router.</p>
${pre('tsx', SN.thieuRouter)}
${pre('tsx', SN.nutDoiGio)}

<h3>Mốc 4 — Đường 409</h3>
${slide('rx-10', 14, 'Mốc 4: 409 thì tải lại lưới, bỏ chọn, đưa focus vào hộp lỗi')}
<p><strong>Đề.</strong> Khi máy chủ nói 409, người dùng phải (a) thấy lý do, bằng lời, (b) được đưa focus tới dòng đó để người dùng bàn phím và trình đọc màn hình nhận ra, (c) thấy lưới đã cập nhật, ô vừa mất hiện "Kín", (d) không còn gì được chọn, nên nút xác nhận đọc "Chọn một giờ trống" và bị tắt. Cơ sở dữ liệu không được đổi gì.</p>
<p><strong>Đạt khi:</strong> test dưới đây và bốn test còn lại của <code>TrangDoiGio.test.tsx</code> xanh, và mở <code>/lich-hen/lh-1/doi-gio?tranh=1</code> trên trình duyệt thấy đúng hành vi đó.</p>
${SD.doiGioVi}
<p>(c) đến từ <code>onSettled</code>: nó chạy sau khi thành công <em>lẫn</em> thất bại, và vì nó trả về promise của việc invalidate, <code>mutateAsync</code> chỉ báo lỗi sau khi tải lại xong. Với <code>onSuccess</code>, một lần 409 để nguyên lưới cũ trên màn hình, ô vừa mất vẫn xanh. (b) là một effect nhỏ cộng một phần tử nhận được focus:</p>
${pre('tsx', SN.focusLoi)}
<p><code>role="alert"</code> làm trình đọc màn hình đọc dòng chữ ngay khi nó xuất hiện; <code>tabIndex={-1}</code> cho JavaScript focus một <code>div</code> mà không đưa nó vào thứ tự Tab; effect phụ thuộc chuỗi lỗi, nên chạy lại nếu một lỗi khác thay lỗi đầu. Test nói rõ cả bốn yêu cầu:</p>
${pre('tsx', SN.testDoiGio409)}
${out(OUT.m34)}
<p>(Đây là file ở cuối chương: dòng thứ năm, “… mọi request đều của bs-2”, là test mà 10.3 thêm sau một bug nó tìm ra.)</p>
<p>Để chắc test thật sự canh <code>onSettled</code>, đổi nó thành <code>onSuccess</code> rồi chạy lại — hai test đỏ (thí nghiệm "đột biến" đầy đủ ở 10.3):</p>
${out(OUT.dbOnSuccess)}
<details><summary>Lời giải — mốc 3 và 4 (TrangDoiGio.tsx và phần chuẩn bị của test)</summary>
${pre('tsx', SN.trangDoiGio)}
${pre('tsx', SN.testDoiGioChuanBi)}
${pre('tsx', SN.testDoiGioOk)}
${pre('tsx', SN.testLopClient)}
<p>Cộng thông báo <code>vuaDoi</code> trong <code>TrangLichHen.tsx</code> (đọc <code>useLocation().state</code> như <code>vuaDat</code>, hiện "Đã đổi giờ lịch hẹn {vuaDoi}. Giờ cũ đã được trả lại cho người khác đặt." trong một đoạn <code>role="status"</code>) và CSS cho <code>.luoi-tuan</code> cùng các lớp ô <code>.o-*</code>.</p>
</details>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202 đặt lịch là một thunk Redux: dispatch <code>pending</code>, <code>await axios.post</code>, dispatch <code>fulfilled</code> hoặc <code>rejected</code>, lỗi thì <code>alert(error.message)</code>; danh sách được làm mới bằng cách dispatch lại lệnh tải — nếu có ai nhớ. Kiểm trùng, nếu có, là một <code>filter</code> trong component. → Đi làm: một hook mutation có <code>onSettled</code> invalidate đúng những key mà lần ghi đụng tới, một hộp lỗi tại chỗ nhận focus, một hàm kiểm trùng thuần dùng chung cho lưới và nút gửi, và cùng luật đó ở máy chủ trả 409. · <em>Vì sao:</em> <code>alert()</code> chặn cả trang, không tạo kiểu và khó test; quên tải lại để lại màn hình cũ; luật chỉ ở client hỏng ngay khi có tab thứ hai. Kiểu thunk vẫn chạy và bạn sẽ bảo trì nó ở app cũ — giữ nguyên các ý: tải lại khi xong (dù được hay hỏng), hiện lỗi tại chỗ.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Hai người cùng đặt một khung giờ cùng lúc. Giao diện của bạn xử lý thế nào?"</p>
<p>Máy chủ làm trọng tài: lần ghi thứ hai nhận 409. Client coi 409 là "dữ liệu của tôi đã cũ": invalidate và tải lại khung giờ khi mutation kết thúc (không chỉ khi thành công), hiện thông báo rõ tại chỗ, đưa focus tới đó, bỏ lựa chọn giờ đã không còn hợp lệ. Có thể gợi ý các giờ còn trống. Không bao giờ coi kiểm tra còn trống phía client là lời cuối.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Vì sao dùng <code>useQueries</code> chứ không phải <code>useQuery</code> trong <code>map</code>?"</p>
<p>Hook phải được gọi cùng thứ tự và cùng số lần ở mọi lần render; vòng lặp có độ dài thay đổi phá luật đó. <code>useQueries</code> là một hook nhận mảng tuỳ chọn query độ dài bất kỳ, có <code>combine</code> để đổi hình dạng kết quả và giữ tham chiếu ổn định khi không có gì đổi.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 1–2/4: bốn mốc</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau bước 0/4 của 10.1 (handler, <code>api.doiGio</code>, đường dẫn, route tạm; 114 test xanh).</p><ol>
<li>Mốc 1: phần thêm của <code>thoi-gian.ts</code>, <code>logic/tuan.ts</code>, <code>logic/kiem-trung.ts</code> và test của chúng.</li>
<li>Mốc 2: <code>useLichTuan.ts</code>, <code>LuoiLichTuan.tsx</code>, <code>DieuHuongTuan.tsx</code>, <code>pages/TrangLichTuan.tsx</code>, link trên trang bác sĩ, <code>TrangLichTuan.test.tsx</code> — và sửa <code>docNgayDat</code> khi test đi-xuyên-tính-năng đỏ.</li>
<li>Mốc 3–4: <code>useDoiGio.ts</code>, <code>pages/TrangDoiGio.tsx</code>, link "Đổi giờ", thông báo <code>vuaDoi</code>, <code>TrangDoiGio.test.tsx</code>; chuyển test danh sách của Chương 12 sang <code>renderVoiRouter</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>npx tsc -b</code> không in gì và <code>npx vitest run</code> hiện <strong>140 passed</strong> (114 cũ + 13 + 8 + 5); trong <code>npm run dev</code>, đã đăng nhập, bạn đặt được một giờ từ lưới tuần, đổi giờ nó từ "Lịch hẹn của tôi", và thấy đường 409 với <code>?tranh=1</code>.</p></div>
<details><summary>Lời giải</summary>
<p>Mọi file đã in đầy đủ trong các lời giải gập của bốn mốc ở trên; link trên trang bác sĩ là <code>&lt;Link className="nut" to={duongDan.lichTuan(id)}&gt;Xem lịch trống cả tuần →&lt;/Link&gt;</code> đặt sau <code>&lt;ChonKhungGio /&gt;</code>. Con số 140 là trước 10.3; 10.3 thêm bốn test chất lượng và một test đổi giờ nữa (145).</p>
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề:</strong> hiện trong caption của lưới số giờ còn trống trong tuần, ví dụ "Lịch khám tuần 05/10/2026 – 10/10/2026 · 17 giờ trống".</p><ol>
<li>Viết hàm thuần <code>demTrong(ngay: NgayTrongTuan[])</code> trong <code>logic/</code> và hai test cho nó (một tuần có ngày đã qua, một tuần có ngày lỗi).</li>
<li>Dùng nó trong caption. Tự quyết: ô "Bạn có lịch" có tính là trống không? Viết quyết định đó thành một test.</li>
<li>Sửa truy vấn caption trong các test cũ nếu nó đổi — hoặc tốt hơn, hỏi bảng bằng biểu thức chính quy.</li>
</ol><p><strong>Đạt khi:</strong> test mới xanh, test cũ vẫn qua, và đổi <code>kg.conTrong</code> thành <code>true</code> trong hàm đếm của bạn làm một test của bạn đỏ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">milestone (mốc)</span><span class="v">một lát của tính năng, kết thúc ở trạng thái xanh commit được</span></div>
<div class="kv"><span class="k">pure function (hàm thuần)</span><span class="v">cùng vào cùng ra, không tác dụng phụ — code rẻ nhất để test</span></div>
<div class="kv"><span class="k"><code>useQueries</code></span><span class="v">một hook cho một mảng query độ dài bất kỳ</span></div>
<div class="kv"><span class="k"><code>combine</code></span><span class="v">gộp mảng kết quả query thành một giá trị cho component</span></div>
<div class="kv"><span class="k"><code>onSettled</code></span><span class="v">callback mutation sau khi thành công <em>hoặc</em> lỗi — invalidate ở đây</span></div>
<div class="kv"><span class="k">integration test (test tích hợp)</span><span class="v">test đi xuyên các tính năng (lưới → form), bắt giả định bị phá</span></div>
<div class="kv"><span class="k"><code>aria-pressed</code></span><span class="v">đánh dấu nút kiểu bật/tắt cho công nghệ hỗ trợ</span></div>
<div class="kv"><span class="k">narrowing (thu hẹp kiểu)</span><span class="v">TS biết kiểu chính xác hơn sau một phép kiểm; mất trong hàm con</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dựng theo mốc, mỗi mốc kết thúc xanh: luật, màn hình chỉ đọc, đường ghi, đường lỗi.</li>
<li>Tính ngày bằng số thứ tự ngày theo UTC; giữ các luật "đã qua", "tuần nào", "trùng" thành hàm thuần được test kỹ.</li>
<li><code>useQueries</code> + <code>combine</code> tải một tuần thành sáu mục cache theo ngày dùng chung với màn hình khác; <code>enabled</code> bỏ qua ngày đã qua.</li>
<li><code>&lt;table&gt;</code> thật có caption và tiêu đề có scope; giờ rút từ dữ liệu; ô trống là link hoặc nút <code>aria-pressed</code>.</li>
<li>Chặn trùng hai lần: client cho trải nghiệm, 409 máy chủ cho sự thật; test tạo lịch trùng sau khi tải chứng minh khe hở.</li>
<li>Gặp 409: <code>onSettled</code> tải lại, bỏ chọn, focus hộp <code>role="alert"</code>; test đi xuyên tính năng bắt được giả định như ba ngày của <code>docNgay</code>.</li>
</ul>

${LINK('https://tanstack.com/query/latest/docs/framework/react/reference/useQueries', '🗃', 'TanStack Query — useQueries', 'Query song song số lượng động và tuỳ chọn combine.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations', '🔄', 'TanStack Query — Invalidations from mutations', 'Làm tươi đúng thứ mà lần ghi đụng tới.')}
${LINK('https://react.dev/reference/rules/rules-of-hooks', '📏', 'react.dev — Rules of Hooks', 'Vì sao không gọi hook trong vòng lặp.')}
${LINK_TRONG('/courses/react/learn?lessonSlug=rx-6-3-mutation', '↩️', 'Bài 6.3 — Mutation', 'useMutation, onSettled và invalidate, lần đầu gặp.')}
</div>
`,
};

const L3 = {
    title: '10.3 — Polish: Profiler, accessibility and tests that bite|||10.3 — Hoàn thiện: Profiler, khả năng tiếp cận và test biết cắn',
    slug: 'rx-10-3-chat-luong',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Hoàn thiện tính năng như ở công ty: Profiler trong Chromium thật lộ ra bảng bị dựng lại mỗi lần đổi tuần (trắng 408 ms) và cách sửa; một query thiếu enabled mà test vẫn xanh; axe + bàn phím; 10 lần cố ý làm hỏng mã đều bị test bắt; hai cái bẫy của hạ tầng test (once của MSW, route lazy chậm khi chạy cả bộ).',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Polish: Profiler, accessibility and tests that bite</h2>
<p class="lead">The feature works: 140 tests green, you can book, reschedule and see a 409. Most students stop here. This lesson is about the difference between "works on my machine" and "I can defend it in a code review": measure before you optimise, check with tools that a screen-reader and keyboard user can use it, read the output you usually scroll past, and prove that each test would notice if the code it guards broke. Every finding below is real — the first version of the feature had each of these problems.</p>
${SD.kiemEn}

<h3>Measure first: what the Profiler saw when switching weeks</h3>
${slide('rx-10', 15, 'Profiler: switching weeks threw the table away and rebuilt it; 408 ms without a grid')}
<p>Chapter 8 taught the rule: do not guess about performance, measure. The week grid wraps <code>LuoiLichTuan</code> in the project's <code>&lt;DoRender id="LuoiLichTuan"&gt;</code> (a <code>&lt;Profiler&gt;</code> that logs every commit to <code>window.__nhatKyDo</code>). A small Playwright script builds the app in profiling mode (<code>vite build --mode profiling</code>, so React still reports timings in a production build), opens the week view with the fake network slowed to 400 ms, and presses "Tuần sau →" three times. For each press it records the Profiler phases of the grid, whether the <code>&lt;table&gt;</code> on screen is still the same DOM node, and — sampled every animation frame — for how long there was no table at all:</p>
${pre('js', SN.doLuoi)}
<p>First version (the page showed <code>&lt;p&gt;Đang tải lịch tuần…&lt;/p&gt;</code> while the week loaded):</p>
${out(OUT.doLuoiTruoc)}
<p>Two things jump out, and neither is "slow". Rendering the grid costs 0.6 ms — nothing to optimise there. But the phase is <strong>mount</strong> every time, the table is a <strong>new</strong> DOM node every time, and for 408 ms — the whole network wait — there is no table on screen. In the browser that looks like the screenshot on the left of the slide: the grid vanishes, the footer jumps up, then everything jumps back down. On a slow phone network that is a second or two of a collapsing page, on every click.</p>
${SD.nhayEn}
<p>The reason is in the flow: a new week means six new query keys, all pending, so the grid knows no hours at all, and the page answered "no hours" with a different element. React compares the tree by position and type: <code>&lt;p&gt;</code> where <code>&lt;table&gt;</code> was means "unmount the table, mount a paragraph", and later the reverse.</p>
<div class="pitfall co-tieu-de"><strong>Trap — <code>placeholderData: keepPreviousData</code> does not help here.</strong> It is what the project's <code>useKhungGio</code> uses against exactly this kind of flash with <code>useQuery</code>, so it is the first thing to try — and it changes nothing with <code>useQueries</code> when every key changes. Reading TanStack's source (<code>queriesObserver.js</code>, <code>#findMatchingObservers</code>) shows why: observers are matched to queries by query hash; a key never seen before gets a <em>new</em> <code>QueryObserver</code>, and a new observer has no "previous data" to keep. Library behaviour you assume is worth one look at the source.</div>

<h3>The fix: remember the hours of the previous render</h3>
${slide('rx-10', 16, 'The fix: remember the previous hours; the table never disappears')}
<p>What the grid needs while a new week loads is just its <em>rows</em> — the hours — so it can keep the same table and show "…" in each cell. React's documentation has a pattern for "information from previous renders": keep it in state and update it <strong>during render</strong> when it changes. Not in an effect: an effect runs after the paint, so the user would first see the empty version.</p>
${pre('tsx', SN.gioCu)}
<p>Three details make it safe. The <code>setGioCu</code> call is guarded by "the hours really changed" (compared as joined strings, since two arrays are never <code>===</code>), otherwise it would loop forever. React handles a state update during render by re-running the component immediately, before the commit, so there is no extra paint. And the loading paragraph moved <em>inside</em> the grid, for the very first load only — the page now always renders <code>LuoiLichTuan</code>, so its position in the tree never changes type. Measured again:</p>
${out(OUT.doLuoiSau)}
<p>Two <strong>update</strong> commits per week change (cells to "…", then data), same table, zero milliseconds without a grid. A regression test keeps it that way — it asserts the phase and, more directly, that the table element is <em>the same object</em> before and after:</p>
${pre('tsx', SN.testHieuNang)}
<p>This is the lesson of the Profiler beyond "ms": an unexpected <strong>mount</strong> where you expected an <strong>update</strong> means a component was thrown away. It also loses local state and focus inside it — had the user been focused on a cell, focus would have fallen to <code>&lt;body&gt;</code>.</p>

<h3>A bug the tests printed but did not fail on</h3>
${slide('rx-10', 17, 'One missing enabled condition: MSW shouts, the tests stay green')}
<p>While writing the accessibility tests below, the run was green — and the terminal said this:</p>
${out(OUT.thieuEnabled)}
<p><code>/api/bac-si//khung-gio</code> — a doctor id of <strong>empty string</strong>. The reschedule page first loads the appointment, and only then knows the doctor. The first version wrote:</p>
${pre('tsx', SN.enabledSai)}
<p>While the appointment is loading, <code>lh</code> is <code>undefined</code>, the doctor becomes <code>''</code>, and <code>enabled: !daQua(ngay)</code> happily fires three requests to a URL that does not exist. MSW is configured with <code>onUnhandledRequest: 'error'</code> (Chapter 6), which makes that <em>request</em> fail — but no test asserted anything about those three queries (they are replaced a moment later when the real id arrives), so no <em>test</em> failed. On a real server this would be three 404s in every user's network tab and in your error monitoring.</p>
<p>The fix is Chapter 6's "dependent query": pass <code>null</code> for "not known yet" and make <code>enabled</code> require it:</p>
${pre('tsx', SN.enabledDung)}
<p>And a test that fails if anyone removes the condition — it collects the paths of every slot request and asserts they all belong to <code>bs-2</code>:</p>
${pre('tsx', SN.testEnabled)}
${out(OUT.dbEnabled)}
<p>Interesting detail: with the new signature the removed condition produces <code>/api/bac-si/null/khung-gio</code>, not <code>//</code> — an earlier version of this test that looked for <code>//</code> did <em>not</em> catch it. The test was only trusted after it had been made to fail.</p>
<div class="callout"><p><strong>Habit.</strong> Treat stderr of a green run as part of the result. Chapter 9 removed 61 lines of jsdom noise so that real warnings stand out; this is what they look like when they do.</p></div>

<h3>Accessibility: a real table, axe, and the keyboard</h3>
${slide('rx-10', 18, 'Accessibility: a real table, 0 axe violations, the whole flow by keyboard')}
<p>The design put accessibility in the criteria, so it gets tests like everything else. axe-core (Chapter 8–9) runs on both new pages; the keyboard test walks the whole reschedule flow with Tab, Space and Enter and prints how many key presses it took:</p>
${pre('tsx', SN.testAxe)}
${pre('tsx', SN.testBanPhim)}
${out(OUT.chatLuong)}
<p>What made axe pass on the first run was mostly decisions from 10.1: a <code>&lt;table&gt;</code> with <code>&lt;caption&gt;</code> and scoped headers; real <code>&lt;button&gt;</code> elements with <code>aria-pressed</code> for the selectable cells; taken and past cells as plain <code>&lt;span&gt;</code>, not disabled buttons, so there is nothing to Tab into uselessly; week navigation that renders text at the edges instead of a greyed link; an error box with <code>role="alert"</code> that receives focus.</p>
<p>The number to think about is <strong>10</strong>: ten Tab presses to reach the 09:30 Friday cell, because every free cell is a Tab stop. With 24 cells that is acceptable. A doctor with 20 slots a day over seven days would be 140 stops — then use the WAI-ARIA <strong>grid pattern</strong>: the grid is one Tab stop (<em>roving tabindex</em>: one cell has <code>tabIndex=0</code>, the others <code>-1</code>) and arrow keys move between cells. That is more code and more tests; the measurement says it is not needed yet, and the rubric rewards the measurement, not the extra code.</p>
<p>axe in jsdom cannot check colour contrast (jsdom does not compute layout or colours). Chapter 8's Chromium script does; run it on the new pages if you changed the cell colours.</p>

<h3>Tests that bite: break the code on purpose</h3>
${slide('rx-10', 19, '31 new tests; broken on purpose in 10 places, all 10 caught')}
<p>A green test proves little until you have seen it red for the right reason. Chapter 9 introduced the technique — <strong>mutation testing</strong> by hand: change one thing in the code the way a real bug would, run the tests, check that at least one fails, restore. The script is a table of "file, text to find, text to put instead, tests to run":</p>
${pre('js', SN.dotBien)}
${out(OUT.dotBien)}
<p>Ten deliberate breaks, ten caught. Each line corresponds to a sentence in the design: "reach the booking form from next week", "refetch on settle", "focus the error", "block clashes on the client", "block clashes on the server", "past days cost nothing", "don't ask before the doctor is known", "six days, no Sunday", "the table does not flash", "the old slot is freed". If a break had survived, the right reaction would be a new test — or the discovery that the code it touched does not matter.</p>
<p>Coverage after the chapter: lines 96.67%, branches 84.23% (thresholds from Chapter 9: 90 / 75, both met). The new feature folder alone:</p>
${out(OUT.covFile)}
<p><strong>End-to-end tests</strong> — a real browser clicking through the real app, as a user would — are the next layer up. This course uses Chromium via Playwright only to <em>measure</em> and take the screenshots; writing and maintaining an E2E suite (selectors, test data, CI, flakiness) is taught in the Testing course and in Next.js Chapter 19.</p>

<h3>Two traps in the test infrastructure itself</h3>
<p><strong>MSW's <code>once</code> is spent by the first matching request.</strong> The one-day-error test needed "day 02/10 fails the first time, then works". The natural spelling is a handler with <code>{ once: true }</code> that returns <code>undefined</code> (fall through to the normal handler) for other days. It never produced a 500. A minimal reproduction shows why:</p>
${pre('tsx', SN.onceSai)}
${out(OUT.onceSai)}
<p>The resolver ran <strong>once</strong> — for 01/10, the first request matching the path — returned <code>undefined</code>, and the handler was used up. "Once" means "once matched", not "once it returned a response". The working version counts itself (printed in 10.2, <code>soLanHong++ &gt; 0</code>).</p>
<p><strong>Lazy routes are slow the first time a test file opens them.</strong> The Profiler test passed alone (376 ms) and failed in the full run:</p>
${out(OUT.chamLazy)}
<p>In a full run, 30 files run in parallel and Vitest compiles each lazy page the first time a file imports it; under that load the first page open took 1.07–1.38 s, just over <code>findBy</code>'s 1000 ms. Raising the timeout would hide it; importing the two pages once before the tests keeps the measurement about React:</p>
${pre('tsx', SN.napTruoc)}
<p>Three full runs afterwards: 145 passed, 145 passed, 145 passed.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202 "done" means the demo works in front of the teacher: click through once in Chrome, maybe a <code>console.log</code> to show the data arrived. → At work "done" includes evidence: a Profiler measurement before and after a change that claims to help, axe and a keyboard pass for anything interactive, tests in CI, and — for important rules — a check that the tests fail when the rule is broken. · <em>Why:</em> a demo shows one path once; production runs every path thousands of times on slow phones, with screen readers, across deploys. The demo habit is still useful — always click through your own feature — it is just the first check, not the last.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "How do you find out why a React screen feels slow or janky?"</p>
<p>Reproduce with throttling; record with the React DevTools Profiler (or a <code>&lt;Profiler&gt;</code> in a profiling build); look at which components commit, how long, and in which phase. Unexpected mounts mean identity was lost (conditional element type, changing <code>key</code>, component defined inside another); many cheap updates point at state too high or unstable props. Fix the cause, measure again, add a regression test if you can.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "How do you know your tests are good, beyond coverage?"</p>
<p>Coverage says which lines ran, not whether anything was checked. Break the code on purpose — by hand or with a mutation-testing tool — and see a test fail for the right reason; write each test first as a failing one for a bug you fixed; query by role and text so refactors don't break tests; keep stderr clean so warnings are seen.</p></div>

<h3>🛠 Keep building the project — step 3/4: quality</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after 10.2 (140 tests green).</p><ol>
<li>Move the first-load message into <code>LuoiLichTuan</code> and add the <code>gioCu</code> state; make both pages always render the grid.</li>
<li>Make <code>useLichTuan</code> take <code>string | null</code> and require it in <code>enabled</code>; pass <code>lh?.bacSiId ?? null</code> from the reschedule page; add the "mọi request đều của bs-2" test.</li>
<li>Create <code>src/features/lich-tuan/lich-tuan.chat-luong.test.tsx</code>: the Profiler/same-table test, axe on both pages, the keyboard walk, and the <code>beforeAll</code> that imports both lazy pages.</li>
<li>Write <code>do/ch10-dot-bien.mjs</code> (copy Chapter 9's script, change the table) and run it.</li>
</ol>
<p><strong>Done when:</strong> <code>npx vitest run</code> shows <strong>145 passed</strong> three runs in a row with no <code>[MSW] Error</code> in the output; <code>npm run test:cov</code> passes its thresholds; your mutation script reports every break caught.</p></div>
<details><summary>Solution</summary>
<p>Every piece is printed above: the <code>gioCu</code> block (inside <code>LuoiLichTuan</code>, printed in full in 10.2), the <code>enabled</code> change, the four quality tests plus the preload, and the mutation table. The page change is one deletion: in <code>TrangLichTuan</code> the condition <code>lich.dangTai &amp;&amp; chuaCoGi ? &lt;p…&gt; : …</code> goes away and <code>&lt;DoRender id="LuoiLichTuan"&gt;&lt;LuoiLichTuan … /&gt;&lt;/DoRender&gt;</code> is rendered always (same in <code>TrangDoiGio</code>, without the Profiler wrapper). <code>dangTai</code> is then unused and removed from <code>combine</code>.</p>
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> find out, with a measurement, whether selecting a cell on the reschedule page re-renders more than it should.</p><ol>
<li>Wrap the grid in <code>TrangDoiGio</code> in <code>&lt;DoRender id="LuoiDoiGio"&gt;</code>.</li>
<li>In a test: open <code>/lich-hen/lh-1/doi-gio</code>, wait for the grid, clear <code>demRender</code> and <code>nhatKyDo</code>, click one free cell, then read how many times <code>LuoiLichTuan</code> rendered and the phases logged.</li>
<li>Decide from the number: is <code>memo</code> worth it? (React Compiler is on — remember what Chapter 12 measured.)</li>
</ol><p><strong>Done when:</strong> your test asserts the exact render count you measured and a phase of <code>update</code>, and you can say in one sentence why you did or did not add <code>memo</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">profiling build</span><span class="v"><code>vite build --mode profiling</code>: production code that still reports Profiler timings</span></div>
<div class="kv"><span class="k">mount vs update</span><span class="v">created fresh vs re-rendered in place — an unexpected mount means identity was lost</span></div>
<div class="kv"><span class="k">state from previous renders</span><span class="v">update state during render, guarded by "really changed", to remember a past value</span></div>
<div class="kv"><span class="k">dependent query</span><span class="v">a query with <code>enabled</code> waiting for data it needs</span></div>
<div class="kv"><span class="k">roving tabindex</span><span class="v">one Tab stop for a whole widget, arrows move inside (WAI-ARIA grid)</span></div>
<div class="kv"><span class="k">mutation testing</span><span class="v">break code on purpose, expect a test to fail for the right reason</span></div>
<div class="kv"><span class="k">E2E test</span><span class="v">a real browser driving the real app end to end — the next layer up</span></div>
<div class="kv"><span class="k">flaky test</span><span class="v">passes or fails without a code change — find the timing cause, don't raise the timeout</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Measure in a profiling build with a slowed network; look at phases and DOM identity, not only milliseconds.</li>
<li>Swapping <code>&lt;table&gt;</code> for <code>&lt;p&gt;</code> while loading remounted the grid and left 408 ms without it; remembering the previous hours during render fixed it (0 ms, update only).</li>
<li><code>keepPreviousData</code> cannot bridge key changes in <code>useQueries</code>; check library behaviour in the source when it matters.</li>
<li>A query without <code>enabled</code> for a missing id fired requests to <code>/api/bac-si//khung-gio</code>; read stderr of green runs and add a test that fails without the fix.</li>
<li>axe on both pages, a keyboard walk (10 + 6 presses), real table semantics; roving tabindex only when the measured number of stops is too high.</li>
<li>Ten deliberate breaks, ten caught; beware MSW <code>once</code> semantics and slow first lazy imports in full runs.</li>
</ul>

${LINK('https://react.dev/reference/react/Profiler', '⏱', 'react.dev — &lt;Profiler&gt;', 'onRender, phases, actualDuration.')}
${LINK('https://react.dev/reference/react/useState#storing-information-from-previous-renders', '🧠', 'react.dev — Storing information from previous renders', 'Setting state during render, safely.')}
${LINK('https://www.w3.org/WAI/ARIA/apg/patterns/grid/', '⌨️', 'WAI-ARIA APG — Grid pattern', 'Roving tabindex and arrow keys for large grids.')}
${LINK_TRONG('/courses/testing', '🧪', 'Course — Testing', 'E2E with Playwright, test strategy, CI.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Hoàn thiện: Profiler, khả năng tiếp cận và test biết cắn</h2>
<p class="lead">Tính năng đã chạy: 140 test xanh, bạn đặt được, đổi giờ được, thấy được 409. Đa số sinh viên dừng ở đây. Bài này nói về khoảng cách giữa "máy em chạy được" và "em bảo vệ được nó trong buổi review code": đo trước khi tối ưu, kiểm bằng công cụ rằng người dùng trình đọc màn hình và bàn phím dùng được, đọc cái output mà bạn thường cuộn qua, và chứng minh mỗi test sẽ nhận ra nếu đoạn code nó canh bị hỏng. Mọi phát hiện dưới đây đều thật — bản đầu của tính năng mắc từng lỗi một.</p>
${SD.kiemVi}

<h3>Đo trước: Profiler thấy gì khi đổi tuần</h3>
${slide('rx-10', 15, 'Profiler: đổi tuần là vứt cả bảng đi dựng lại; 408 ms không có lưới')}
<p>Chương 8 dạy luật: đừng đoán về hiệu năng, hãy đo. Trang lịch tuần bọc <code>LuoiLichTuan</code> trong <code>&lt;DoRender id="LuoiLichTuan"&gt;</code> của dự án (một <code>&lt;Profiler&gt;</code> ghi mọi lần commit vào <code>window.__nhatKyDo</code>). Một script Playwright nhỏ build app ở chế độ profiling (<code>vite build --mode profiling</code>, để React vẫn báo thời gian trên bản production), mở lưới tuần với mạng giả chậm 400 ms, và bấm "Tuần sau →" ba lần. Mỗi lần bấm nó ghi pha Profiler của lưới, <code>&lt;table&gt;</code> trên màn hình có còn là cùng một nút DOM không, và — lấy mẫu mỗi khung hình — có bao lâu không có bảng nào:</p>
${pre('js', SN.doLuoi)}
<p>Bản đầu (trang hiện <code>&lt;p&gt;Đang tải lịch tuần…&lt;/p&gt;</code> trong lúc tuần mới đang tải):</p>
${out(OUT.doLuoiTruoc)}
<p>Hai điều nhảy ra, và không điều nào là "chậm". Vẽ lưới tốn 0,6 ms — chẳng có gì để tối ưu. Nhưng pha lần nào cũng là <strong>mount</strong>, bảng lần nào cũng là nút DOM <strong>mới</strong>, và suốt 408 ms — trọn thời gian chờ mạng — không có bảng nào trên màn hình. Trên trình duyệt trông như ảnh bên trái của slide: lưới biến mất, chân trang nhảy lên, rồi mọi thứ nhảy xuống lại. Trên điện thoại mạng chậm, đó là một hai giây trang sập xuống, mỗi lần bấm.</p>
${SD.nhayVi}
<p>Lý do nằm trong luồng: tuần mới nghĩa là sáu query key mới, đều đang chờ, nên lưới không biết giờ nào cả, và trang trả lời "không có giờ" bằng một phần tử khác. React so cây theo vị trí và loại: <code>&lt;p&gt;</code> ở chỗ <code>&lt;table&gt;</code> từng đứng nghĩa là "gỡ bảng, gắn một đoạn văn", rồi sau đó làm ngược lại.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — <code>placeholderData: keepPreviousData</code> không cứu được ở đây.</strong> Đó là thứ <code>useKhungGio</code> của dự án đang dùng chống đúng kiểu nháy này với <code>useQuery</code>, nên nó là thứ thử đầu tiên — và nó chẳng đổi gì với <code>useQueries</code> khi mọi key đều đổi. Đọc mã nguồn TanStack (<code>queriesObserver.js</code>, <code>#findMatchingObservers</code>) thấy ngay vì sao: observer được ghép với query theo query hash; key chưa từng gặp thì có một <code>QueryObserver</code> <em>mới</em>, mà observer mới thì chẳng có "dữ liệu trước" nào để giữ. Hành vi thư viện mà bạn đang giả định thì đáng một lần nhìn vào mã nguồn.</div>

<h3>Cách sửa: nhớ các giờ của lần render trước</h3>
${slide('rx-10', 16, 'Sửa: nhớ giờ của lần render trước, bảng không bao giờ biến mất')}
<p>Thứ lưới cần trong lúc tuần mới đang tải chỉ là các <em>hàng</em> — các giờ — để giữ nguyên cái bảng và hiện "…" ở từng ô. Tài liệu React có sẵn một mẫu cho "thông tin từ các lần render trước": giữ nó trong state và cập nhật nó <strong>ngay trong lúc render</strong> khi nó đổi. Không phải trong effect: effect chạy sau khi vẽ, nên người dùng sẽ thấy bản trống trước.</p>
${pre('tsx', SN.gioCu)}
<p>Ba chi tiết làm nó an toàn. Lệnh <code>setGioCu</code> có điều kiện canh "giờ thật sự đổi" (so dạng chuỗi đã nối, vì hai mảng không bao giờ <code>===</code>), không thì lặp vô tận. React xử lý một lần cập nhật state trong lúc render bằng cách chạy lại component ngay, trước khi commit, nên không có lần vẽ thừa. Và dòng "đang tải" dời <em>vào trong</em> lưới, chỉ cho lần tải đầu tiên — trang giờ luôn vẽ <code>LuoiLichTuan</code>, nên vị trí đó trong cây không bao giờ đổi loại. Đo lại:</p>
${out(OUT.doLuoiSau)}
<p>Hai lần commit <strong>update</strong> mỗi lần đổi tuần (ô thành "…", rồi dữ liệu), cùng một bảng, không mili giây nào thiếu lưới. Một test hồi quy giữ nguyên điều đó — nó kiểm pha và, trực tiếp hơn, rằng phần tử bảng là <em>cùng một object</em> trước và sau:</p>
${pre('tsx', SN.testHieuNang)}
<p>Đó là bài học của Profiler vượt ra ngoài "ms": một lần <strong>mount</strong> bất ngờ ở chỗ bạn chờ <strong>update</strong> nghĩa là một component đã bị vứt đi. Nó còn làm mất state cục bộ và focus bên trong — nếu người dùng đang focus vào một ô, focus sẽ rơi về <code>&lt;body&gt;</code>.</p>

<h3>Một bug mà test in ra nhưng không đỏ</h3>
${slide('rx-10', 17, 'Thiếu một điều kiện enabled: MSW la lên, test vẫn xanh')}
<p>Trong lúc viết các test tiếp cận bên dưới, lượt chạy xanh — và terminal nói thế này:</p>
${out(OUT.thieuEnabled)}
<p><code>/api/bac-si//khung-gio</code> — mã bác sĩ là <strong>chuỗi rỗng</strong>. Trang đổi giờ tải lịch hẹn trước, rồi mới biết bác sĩ. Bản đầu viết:</p>
${pre('tsx', SN.enabledSai)}
<p>Trong lúc lịch hẹn đang tải, <code>lh</code> là <code>undefined</code>, bác sĩ thành <code>''</code>, và <code>enabled: !daQua(ngay)</code> vui vẻ bắn ba request tới một URL không tồn tại. MSW được cấu hình <code>onUnhandledRequest: 'error'</code> (Chương 6), làm cho <em>request</em> đó hỏng — nhưng không test nào kiểm gì về ba query đó (chúng bị thay ngay sau khi id thật về), nên không <em>test</em> nào đỏ. Trên máy chủ thật, đó là ba lỗi 404 trong tab mạng của mọi người dùng và trong hệ thống theo dõi lỗi của bạn.</p>
<p>Cách sửa là "query phụ thuộc" của Chương 6: truyền <code>null</code> cho "chưa biết" và bắt <code>enabled</code> đòi nó:</p>
${pre('tsx', SN.enabledDung)}
<p>Và một test đỏ nếu ai đó bỏ điều kiện — nó gom đường dẫn của mọi request khung giờ và kiểm chúng đều thuộc <code>bs-2</code>:</p>
${pre('tsx', SN.testEnabled)}
${out(OUT.dbEnabled)}
<p>Chi tiết thú vị: với chữ ký mới, bỏ điều kiện sinh ra <code>/api/bac-si/null/khung-gio</code>, không phải <code>//</code> — một bản trước của test này đi tìm <code>//</code> đã <em>không</em> bắt được. Test chỉ được tin sau khi đã bị bắt đỏ.</p>
<div class="callout"><p><strong>Thói quen.</strong> Coi stderr của một lượt chạy xanh là một phần kết quả. Chương 9 dọn 61 dòng rác của jsdom để cảnh báo thật nổi lên; đây là hình dạng của chúng khi nổi lên.</p></div>

<h3>Khả năng tiếp cận: bảng thật, axe và bàn phím</h3>
${slide('rx-10', 18, 'Tiếp cận: bảng thật, axe 0 lỗi, đi hết luồng bằng bàn phím')}
<p>Thiết kế đã đưa khả năng tiếp cận vào tiêu chí, nên nó có test như mọi thứ khác. axe-core (Chương 8–9) chạy trên cả hai trang mới; test bàn phím đi hết luồng đổi giờ bằng Tab, Space và Enter và in ra đã bấm bao nhiêu phím:</p>
${pre('tsx', SN.testAxe)}
${pre('tsx', SN.testBanPhim)}
${out(OUT.chatLuong)}
<p>Thứ giúp axe qua ngay lần đầu phần lớn là các quyết định ở 10.1: <code>&lt;table&gt;</code> có <code>&lt;caption&gt;</code> và tiêu đề có scope; <code>&lt;button&gt;</code> thật có <code>aria-pressed</code> cho ô chọn được; ô kín và ô đã qua là <code>&lt;span&gt;</code> thường, không phải nút bị tắt, nên không có gì để Tab vào vô ích; điều hướng tuần vẽ chữ ở hai đầu thay vì link tô xám; hộp lỗi có <code>role="alert"</code> nhận focus.</p>
<p>Con số cần nghĩ là <strong>10</strong>: mười lần Tab mới tới ô 09:30 thứ Sáu, vì mỗi ô trống là một điểm dừng Tab. Với 24 ô thì chấp nhận được. Một bác sĩ có 20 khung giờ một ngày trong bảy ngày là 140 điểm dừng — khi đó dùng <strong>mẫu grid</strong> của WAI-ARIA: cả lưới là một điểm dừng Tab (<em>roving tabindex</em>: một ô có <code>tabIndex=0</code>, các ô khác <code>-1</code>) và phím mũi tên di chuyển giữa các ô. Đó là thêm code và thêm test; phép đo nói chưa cần, và rubric thưởng cho phép đo chứ không cho code thừa.</p>
<p>axe trong jsdom không kiểm được độ tương phản màu (jsdom không tính bố cục hay màu). Script Chromium của Chương 8 thì kiểm được; chạy nó trên hai trang mới nếu bạn đổi màu ô.</p>

<h3>Test biết cắn: cố ý làm hỏng code</h3>
${slide('rx-10', 19, '31 test mới; cố ý làm hỏng 10 chỗ, cả 10 đều bị bắt')}
<p>Một test xanh chứng minh được rất ít cho tới khi bạn thấy nó đỏ vì đúng lý do. Chương 9 đã giới thiệu kỹ thuật — <strong>kiểm thử đột biến</strong> (mutation testing) làm bằng tay: sửa một chỗ trong code theo đúng kiểu một bug thật, chạy test, kiểm có ít nhất một test đỏ, trả lại. Script là một bảng "file, đoạn cần tìm, đoạn thay vào, test cần chạy":</p>
${pre('js', SN.dotBien)}
${out(OUT.dotBien)}
<p>Mười lần cố ý phá, mười lần bị bắt. Mỗi dòng ứng với một câu trong thiết kế: "tới được form từ tuần sau", "tải lại khi kết thúc", "focus vào lỗi", "chặn trùng ở client", "chặn trùng ở máy chủ", "ngày đã qua không tốn gì", "chưa biết bác sĩ thì đừng hỏi", "sáu ngày, không Chủ nhật", "bảng không nháy", "giờ cũ được trả lại". Nếu một lần phá sống sót, phản ứng đúng là thêm test — hoặc nhận ra đoạn code nó đụng vào chẳng quan trọng.</p>
<p>Độ phủ sau chương: dòng 96,67%, nhánh 84,23% (ngưỡng của Chương 9: 90 / 75, đều đạt). Riêng thư mục tính năng mới:</p>
${out(OUT.covFile)}
<p><strong>Test đầu-cuối (E2E)</strong> — trình duyệt thật bấm qua app thật như người dùng — là tầng tiếp theo. Khoá này chỉ dùng Chromium qua Playwright để <em>đo</em> và chụp ảnh; viết và nuôi một bộ E2E (bộ chọn, dữ liệu test, CI, test chập chờn) được dạy ở khoá Testing và ở Next.js Chương 19.</p>

<h3>Hai cái bẫy của chính hạ tầng test</h3>
<p><strong><code>once</code> của MSW bị tiêu ở request khớp đầu tiên.</strong> Test một-ngày-lỗi cần "ngày 02/10 hỏng lần đầu, sau đó chạy". Cách viết tự nhiên là một handler có <code>{ once: true }</code> trả <code>undefined</code> (rơi xuống handler thường) cho ngày khác. Nó chưa bao giờ sinh ra lỗi 500. Một bản tái hiện tối giản cho thấy vì sao:</p>
${pre('tsx', SN.onceSai)}
${out(OUT.onceSai)}
<p>Resolver chạy <strong>một lần</strong> — cho ngày 01/10, request đầu tiên khớp đường dẫn — trả <code>undefined</code>, và handler bị dùng hết. "Once" nghĩa là "khớp một lần", không phải "trả response một lần". Bản chạy đúng tự đếm (in ở 10.2, <code>soLanHong++ &gt; 0</code>).</p>
<p><strong>Route lazy chậm ở lần đầu một file test mở nó.</strong> Test Profiler chạy riêng thì qua (376 ms), chạy cả bộ thì đỏ:</p>
${out(OUT.chamLazy)}
<p>Khi chạy cả bộ, 30 file chạy song song và Vitest biên dịch mỗi trang lazy ở lần đầu một file import nó; dưới tải đó lần mở trang đầu mất 1,07–1,38 giây, nhỉnh hơn 1000 ms của <code>findBy</code>. Nâng timeout là giấu lỗi; import hai trang một lần trước các test giữ cho phép đo là đo React:</p>
${pre('tsx', SN.napTruoc)}
<p>Ba lượt chạy cả bộ sau đó: 145 passed, 145 passed, 145 passed.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202 "xong" nghĩa là demo chạy trước mặt giảng viên: bấm qua một lượt trên Chrome, có khi một <code>console.log</code> để cho thấy dữ liệu đã về. → Đi làm, "xong" kèm bằng chứng: một phép đo Profiler trước và sau cho thay đổi nào tự nhận là cải thiện, axe và một lượt bàn phím cho mọi thứ tương tác, test chạy trong CI, và — với luật quan trọng — một phép kiểm rằng test đỏ khi luật bị phá. · <em>Vì sao:</em> demo cho thấy một đường một lần; production chạy mọi đường hàng nghìn lần trên điện thoại chậm, với trình đọc màn hình, qua nhiều lần deploy. Thói quen demo vẫn có ích — luôn tự bấm qua tính năng của mình — nó chỉ là phép kiểm đầu tiên, không phải cuối cùng.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Làm sao bạn tìm ra vì sao một màn hình React thấy chậm hoặc giật?"</p>
<p>Tái hiện với mạng/CPU bị bóp; ghi bằng Profiler của React DevTools (hoặc <code>&lt;Profiler&gt;</code> trong bản build profiling); xem component nào commit, bao lâu, pha nào. Mount bất ngờ nghĩa là mất danh tính (đổi loại phần tử theo điều kiện, <code>key</code> đổi, component định nghĩa trong component khác); nhiều update rẻ chỉ ra state đặt quá cao hoặc props không ổn định. Sửa nguyên nhân, đo lại, thêm test hồi quy nếu được.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Ngoài độ phủ, làm sao bạn biết test của mình tốt?"</p>
<p>Độ phủ nói dòng nào đã chạy, không nói có gì được kiểm. Cố ý phá code — bằng tay hoặc bằng công cụ mutation testing — và thấy một test đỏ vì đúng lý do; viết mỗi test ban đầu là một test đỏ cho bug đã sửa; hỏi theo vai trò và chữ để refactor không làm gãy test; giữ stderr sạch để cảnh báo được nhìn thấy.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 3/4: chất lượng</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau 10.2 (140 test xanh).</p><ol>
<li>Dời dòng "đang tải lần đầu" vào trong <code>LuoiLichTuan</code> và thêm state <code>gioCu</code>; cho cả hai trang luôn vẽ lưới.</li>
<li>Cho <code>useLichTuan</code> nhận <code>string | null</code> và bắt <code>enabled</code> đòi nó; trang đổi giờ truyền <code>lh?.bacSiId ?? null</code>; thêm test "mọi request đều của bs-2".</li>
<li>Tạo <code>src/features/lich-tuan/lich-tuan.chat-luong.test.tsx</code>: test Profiler/cùng-bảng, axe trên hai trang, lượt bàn phím, và <code>beforeAll</code> import hai trang lazy.</li>
<li>Viết <code>do/ch10-dot-bien.mjs</code> (chép script của Chương 9, đổi bảng) và chạy nó.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>npx vitest run</code> hiện <strong>145 passed</strong> ba lần liên tiếp và không có <code>[MSW] Error</code> nào trong output; <code>npm run test:cov</code> qua ngưỡng; script đột biến báo mọi lần phá đều bị bắt.</p></div>
<details><summary>Lời giải</summary>
<p>Mọi mảnh đã in ở trên: khối <code>gioCu</code> (trong <code>LuoiLichTuan</code>, in đầy đủ ở 10.2), thay đổi <code>enabled</code>, bốn test chất lượng cùng phần nạp trước, và bảng đột biến. Thay đổi ở trang là một lần xoá: trong <code>TrangLichTuan</code> điều kiện <code>lich.dangTai &amp;&amp; chuaCoGi ? &lt;p…&gt; : …</code> bị bỏ và <code>&lt;DoRender id="LuoiLichTuan"&gt;&lt;LuoiLichTuan … /&gt;&lt;/DoRender&gt;</code> luôn được vẽ (tương tự trong <code>TrangDoiGio</code>, không có lớp Profiler). Khi đó <code>dangTai</code> không còn ai dùng và được bỏ khỏi <code>combine</code>.</p>
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề:</strong> tìm ra, bằng phép đo, việc chọn một ô trên trang đổi giờ có render lại nhiều hơn cần không.</p><ol>
<li>Bọc lưới trong <code>TrangDoiGio</code> bằng <code>&lt;DoRender id="LuoiDoiGio"&gt;</code>.</li>
<li>Trong một test: mở <code>/lich-hen/lh-1/doi-gio</code>, đợi lưới, xoá <code>demRender</code> và <code>nhatKyDo</code>, bấm một ô trống, rồi đọc <code>LuoiLichTuan</code> đã render bao nhiêu lần và các pha đã ghi.</li>
<li>Quyết định từ con số: <code>memo</code> có đáng không? (React Compiler đang bật — nhớ lại điều Chương 12 đã đo.)</li>
</ol><p><strong>Đạt khi:</strong> test của bạn kiểm đúng số lần render bạn đo được và pha <code>update</code>, và bạn nói được trong một câu vì sao có hoặc không thêm <code>memo</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">profiling build (bản build đo)</span><span class="v"><code>vite build --mode profiling</code>: code production vẫn báo thời gian cho Profiler</span></div>
<div class="kv"><span class="k">mount / update</span><span class="v">tạo mới / render lại tại chỗ — mount bất ngờ là đã mất danh tính</span></div>
<div class="kv"><span class="k">state từ lần render trước</span><span class="v">cập nhật state trong lúc render, có điều kiện "đổi thật", để nhớ giá trị cũ</span></div>
<div class="kv"><span class="k">dependent query (query phụ thuộc)</span><span class="v">query có <code>enabled</code> đợi dữ liệu nó cần</span></div>
<div class="kv"><span class="k">roving tabindex</span><span class="v">cả widget một điểm dừng Tab, phím mũi tên đi bên trong (mẫu grid WAI-ARIA)</span></div>
<div class="kv"><span class="k">mutation testing (kiểm thử đột biến)</span><span class="v">cố ý phá code, chờ một test đỏ vì đúng lý do</span></div>
<div class="kv"><span class="k">E2E test (test đầu-cuối)</span><span class="v">trình duyệt thật lái app thật từ đầu tới cuối — tầng tiếp theo</span></div>
<div class="kv"><span class="k">flaky test (test chập chờn)</span><span class="v">lúc qua lúc đỏ dù code không đổi — tìm nguyên nhân thời gian, đừng nâng timeout</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đo trên bản build profiling với mạng bị làm chậm; nhìn pha và danh tính DOM, không chỉ mili giây.</li>
<li>Đổi <code>&lt;table&gt;</code> thành <code>&lt;p&gt;</code> lúc tải làm lưới bị gắn lại và trống 408 ms; nhớ giờ của lần render trước ngay trong render đã sửa được (0 ms, chỉ update).</li>
<li><code>keepPreviousData</code> không nối được qua lần đổi key trong <code>useQueries</code>; khi quan trọng, kiểm hành vi thư viện trong mã nguồn.</li>
<li>Query thiếu <code>enabled</code> cho id chưa có đã bắn request tới <code>/api/bac-si//khung-gio</code>; đọc stderr của lượt xanh và thêm test đỏ khi thiếu cách sửa.</li>
<li>axe trên cả hai trang, một lượt bàn phím (10 + 6 phím), ngữ nghĩa bảng thật; roving tabindex chỉ khi số điểm dừng đo được là quá nhiều.</li>
<li>Mười lần cố ý phá, mười lần bị bắt; coi chừng nghĩa của <code>once</code> trong MSW và lần import lazy đầu tiên chậm khi chạy cả bộ.</li>
</ul>

${LINK('https://react.dev/reference/react/Profiler', '⏱', 'react.dev — &lt;Profiler&gt;', 'onRender, các pha, actualDuration.')}
${LINK('https://react.dev/reference/react/useState#storing-information-from-previous-renders', '🧠', 'react.dev — Storing information from previous renders', 'Đặt state trong lúc render, an toàn.')}
${LINK('https://www.w3.org/WAI/ARIA/apg/patterns/grid/', '⌨️', 'WAI-ARIA APG — Grid pattern', 'Roving tabindex và phím mũi tên cho lưới lớn.')}
${LINK_TRONG('/courses/testing', '🧪', 'Khoá — Testing', 'E2E với Playwright, chiến lược test, CI.')}
</div>
`,
};

const L4 = {
    title: '10.4 — Build, deploy, the course checklist and a self-assessment rubric|||10.4 — Build, deploy, checklist cả khoá và rubric tự chấm',
    slug: 'rx-10-4-tong-ket',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Đưa dự án lên mạng cho đúng: đọc output vite build, SPA fallback đo thật trên python http.server / vite preview / nginx, cấu hình nginx với cache đúng, tab cũ sau một lần deploy thành trang trắng và cách sửa bằng vite:preloadError; rồi checklist cả khoá, rubric 100 điểm để tự chấm, và làm lại dự án với đề của chính bạn (đặt phòng lab).',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Build, deploy, the course checklist and a self-assessment rubric</h2>
<p class="lead">A feature is not done when the tests are green on your laptop; it is done when a stranger can open a link to it. This lesson takes the clinic app from <code>npm run dev</code> to a static server and measures the three things that go wrong there — deep links that 404, a fallback that swallows missing JavaScript, and users with an old tab open during a deploy. Then it closes the first half of the course: a checklist of everything a React project should have by now, a rubric to grade your project honestly, and an invitation to do the whole thing again with your own brief.</p>

<h3>Build: what goes into <code>dist/</code></h3>
${slide('rx-10', 20, 'vite build: three new lazy chunks, the initial bundle grows by only 2 kB')}
<p>The <code>build</code> script is <code>tsc -b &amp;&amp; vite build</code>: first the type check (a type error stops the build), then Vite (Rolldown underneath) bundles everything into static files. Real output after this chapter:</p>
${out(OUT.build)}
<p>How to read it. Every file name carries a <strong>content hash</strong> (<code>index-CnXVUOFB.js</code>): change one character of the code that ends up in that file and the name changes. That is what makes aggressive caching safe later. Each <code>lazy</code> route from Chapter 8 is its own chunk: <code>TrangLichTuan</code> (2.10 kB) and <code>TrangDoiGio</code> (3.82 kB) are new, and <code>lich-tuan-*.js</code> (9.27 kB) is a <strong>shared chunk</strong> Rolldown created on its own because both pages import <code>@/features/lich-tuan</code>. The initial bundle <code>index-*.js</code> grew from 362.32 kB (after Chapter 9) to 364.29 kB — about 2 kB for the new routes' table entries, the date helpers and the error handler below; the feature itself costs nothing until someone opens it. <code>form-*.js</code> (116.73 kB) is React Hook Form + Zod, lazy since Chapter 8.</p>
<p>The biggest file, <code>browser-*.js</code> (427.57 kB), is MSW. This app has no real backend until Chapter 14, so <code>main.tsx</code> starts the fake API in production too, and <code>mockServiceWorker.js</code> from <code>public/</code> is copied to the root of <code>dist/</code>. In a project with a real API you start MSW only in development (<code>if (import.meta.env.DEV)</code>) and that chunk disappears from what users download.</p>
<div class="callout"><p><strong>Preview is not dev.</strong> <code>npm run dev</code> serves source files through Vite's dev server; <code>npx vite preview</code> serves the built <code>dist/</code> — minified, chunked, React in production mode, React Compiler output. Always click through the preview before deploying: every screenshot in this chapter was taken from <code>vite preview</code>, not from dev.</p></div>

<h3>Deep links and SPA fallback — measured</h3>
${slide('rx-10', 21, 'Opening a deep link on a static server without fallback: 404')}
<p>Lesson 7.1 explained the problem; here it is measured on four real servers with the same <code>dist/</code>. A <strong>single-page application</strong> has one HTML file. Clicking links inside the app never asks the server for <code>/bac-si/bs-2/lich-tuan</code> — React Router changes the URL in the browser. But press F5 there, or open a link a friend sent, and the browser asks the server for a <em>file</em> of that name. There is none. The server has to answer "here is <code>index.html</code>" for every path that is not a real file — that is <strong>SPA fallback</strong>:</p>
${SD.spaEn}
<p>The script <code>do/ch10-spa.sh</code> starts Python's built-in server, <code>vite preview</code>, and three nginx 1.27 containers in Docker, then asks each for the home page, a deep link, a JavaScript file that does not exist, and the MSW worker:</p>
${out(OUT.spa)}
<p>Python and a bare nginx return <strong>404</strong> for the deep link. <code>vite preview</code> returns 200 — it has a fallback built in, which is exactly why "it worked in preview" proves nothing about your host. The fourth block is the interesting one: the most common copy-pasted config, <code>try_files $uri $uri/ /index.html</code> for <em>everything</em>, fixes deep links — and answers a missing <code>/assets/khong-co.js</code> with <strong>200 text/html</strong>. The browser receives HTML where it expected JavaScript. You will see what that does to users in a moment.</p>

<h3>A correct server config</h3>
${slide('rx-10', 22, 'Correct nginx: fallback for pages, a real 404 for assets')}
<p>The config used for the last block of the measurement — two <code>location</code>s with two different jobs:</p>
${pre('nginx', SN.nginx)}
<p>Hashed assets get a real 404 when missing and are cached for a year with <code>immutable</code> (the name changes whenever the content does, so the browser never needs to ask again). Everything else gets the fallback, and <code>no-cache</code> so the browser re-checks <code>index.html</code> on every visit — that small file is how users learn the names of the new chunks after a deploy. The headers, as served:</p>
${out(OUT.spaHeader)}
<p>For comparison, the "fallback for everything" config that produced the 200 above:</p>
${pre('nginx', SN.nginxCa)}
<p>Other hosts express the same two rules in their own files. Netlify reads <code>public/_redirects</code> (copied into <code>dist/</code>): the line <code>/*  /index.html  200</code> is a rewrite, not a redirect, because of the 200; Netlify serves real files first, so assets still 404 properly. Vercel reads <code>vercel.json</code>; the pattern below rewrites everything except <code>/assets/</code>:</p>
${pre('text', SN.redirects)}
${pre('json', SN.vercel)}
<p>GitHub Pages has no rewrite rules: the known workaround is a <code>404.html</code> that is a copy of <code>index.html</code> (the page loads with status 404, which search engines dislike), plus <code>base: '/ten-repo/'</code> in <code>vite.config.ts</code> and <code>basename</code> in the router if the site lives under a sub-path. The MSW worker also has to be served from that sub-path.</p>
<p>⏳ Not run for real here: deploying to a hosted platform (Netlify, Vercel, GitHub Pages) with a real domain and HTTPS — this machine ran Python, <code>vite preview</code> and nginx 1.27 in Docker locally. The rules measured above are the same ones those platforms apply.</p>
<!-- CHAY-O-MAY: deploy dist/ của dự án sau Chương 10 lên Netlify (có public/_redirects) và lên GitHub Pages (404.html + base); mở thẳng /bac-si/bs-2/lich-tuan?tuan=2026-10-05, F5, và /assets/khong-co.js; ghi mã HTTP + header Cache-Control thật -->

<h3>The old tab after a deploy</h3>
${slide('rx-10', 23, 'An old tab after a deploy: a silent blank page, fixed with vite:preloadError')}
<p>Here is a situation every SPA meets on its second deploy. A patient opened the app yesterday and left the tab open. That tab runs build A, whose code knows the lazy page as <code>TrangLichTuan-W91lVYN9.js</code>. Overnight you deployed build B; the server now has <code>TrangLichTuan-</code> under a new hash and the old file is gone. The patient clicks "Xem lịch trống cả tuần →". The script <code>do/ch10-tab-cu.mjs</code> reproduces exactly that in Chromium against nginx — build A served and opened, build B copied over it, then the click:</p>
${out(OUT.tabCu404)}
<p>A 404 for the chunk, the URL does not change, and <code>&lt;main&gt;</code> is <strong>empty</strong>. No error message, no error boundary — the root route has <code>ErrorBoundary: TrangLoi</code> since Chapter 7, and it did not appear. The reason is in React Router's source (8.4.0, <code>router.js</code>): errors from loading lazy <em>properties</em> such as <code>lazy: { Component }</code> are awaited inside <code>try { … } catch {}</code> — swallowed. With the "fallback for everything" config it is the same blank page, only the console message changes:</p>
${out(OUT.tabCuHtml)}
<p>"Expected a JavaScript module script but the server responded with a MIME type of text/html" — the HTML fallback answered for a JavaScript file. That message in a bug report almost always means "old tab + fallback on <code>/assets/</code>".</p>
${SD.tabCuEn}
<p>Vite has a hook for exactly this: whenever a dynamic <code>import()</code> fails, it dispatches a <code>vite:preloadError</code> event on <code>window</code> (and rethrows unless you call <code>preventDefault()</code>). The fix is to reload — the fresh <code>index.html</code> points at build B's chunk names — and to reload into the page the user was <em>going to</em>, which React Router still has in <code>router.state.navigation.location</code> because it had not committed the navigation yet:</p>
${pre('tsx', SN.preloadError)}
${out(OUT.tabCuSua)}
<p>One automatic reload, straight to <code>/bac-si/bs-2/lich-tuan</code>, heading "Lịch trống cả tuần (bản B)". The 10-second guard matters: if the chunk is missing for a reason a reload cannot fix (a broken deploy), reloading forever would be worse than the blank page. Two more habits help: keep the previous build's <code>assets/</code> on the server for a while after deploying (many hosts do that automatically), and never serve HTML for a missing asset.</p>
<div class="pitfall co-tieu-de"><strong>Trap — the copy-pasted fallback for everything.</strong> <code>try_files $uri $uri/ /index.html;</code> in the only <code>location</code> makes deep links work, so it looks done. But every missing JS or CSS file now returns 200 with HTML: after a deploy, old tabs get a MIME-type error instead of a 404, caches may store the HTML under the JS name, and monitoring never sees a 404 to alert on. Give <code>/assets/</code> its own <code>location</code> with <code>try_files $uri =404</code>.</div>

<h3>The checklist for the whole first half of the course</h3>
${slide('rx-10', 24, 'The course checklist: twelve lines before you hand anything in')}
<p>Chapters 0–10 added one habit each. Before you submit a project, put it on your CV or talk about it in an interview, go through these twelve lines. Each is checkable in minutes, and each refers to something you have done in this course:</p>
<ul>
<li>☐ <code>npx tsc -b</code> prints nothing (Section 0, Chapter 1).</li>
<li>☐ <code>npx vitest run</code> is green and stderr has no act or MSW warnings (Chapter 9, this chapter).</li>
<li>☐ <code>npm run test:cov</code> meets its thresholds (Chapter 9).</li>
<li>☐ <code>npx vite build</code> is green and you can say which chunk is big and why (Chapter 8).</li>
<li>☐ Every data screen has four states: loading, empty, error, data (Chapter 6).</li>
<li>☐ 4xx/409 errors are shown in the user's words, in the right place (Chapters 3, 6, 10).</li>
<li>☐ The URL keeps what users would want to share: filters, the selected day, the week (Chapters 5, 7, 10).</li>
<li>☐ axe reports 0 violations and the main flow works with the keyboard only (Chapter 8).</li>
<li>☐ The Profiler shows no unexpected mounts and no measured wasted renders (Chapters 8, 10).</li>
<li>☐ Deploy: deep links and F5 do not 404; an old tab does not go blank (Chapter 7, this lesson).</li>
<li>☐ README: how to run, how to test, which decisions you made and why.</li>
<li>☐ Every bug you fixed has a test that would catch it again (Chapter 9, this chapter).</li>
</ul>

<h3>Self-assessment rubric — 100 points</h3>
${slide('rx-10', 25, 'Self-assessment rubric: 100 points, six groups, every line checkable')}
${SD.diemEn}
<p>Grade your own project with this table — honestly, ideally with a friend grading it too. Each group has three levels. "Full" requires <em>evidence</em> you can show (a test name, a command output, a screenshot, a line of the README), not a feeling.</p>
<table>
<thead><tr><th>Group</th><th>Points</th><th>0</th><th>Half</th><th>Full</th></tr></thead>
<tbody>
<tr><td>Meets the requirements</td><td>25</td><td>a story does not work</td><td>works in dev, not checked on the build</td><td>all six stories of 10.1 work on <code>vite preview</code></td></tr>
<tr><td>Design &amp; structure</td><td>15</td><td>no design written</td><td>tree or state table missing</td><td>design note complete; features/ ↔ pages/ through doors; no derived state stored</td></tr>
<tr><td>Data &amp; errors</td><td>20</td><td>errors only in the console</td><td>errors shown, some screens stale after writes</td><td>systematic keys; 409/500/offline each have a path; no wasted requests (count them)</td></tr>
<tr><td>Tests</td><td>20</td><td>fewer than 10 new tests</td><td>tests by role/label, but never seen red</td><td>MSW tests for every story; ≥ 1 test per fixed bug; deliberate breaks caught</td></tr>
<tr><td>Accessibility &amp; performance</td><td>10</td><td>not checked</td><td>axe passes, keyboard not tried</td><td>axe 0, keyboard walk, one Profiler measurement with before/after</td></tr>
<tr><td>Build, deploy, README</td><td>10</td><td>does not build</td><td>builds, deep link 404s or no README</td><td>build green, deep link + F5 alive, old-tab handled, README lets a stranger run it</td></tr>
</tbody>
</table>
<p>The reference project of this chapter scores 100 by this table — and you should be suspicious of that: the author wrote both. Ask someone else to grade yours.</p>

<h3>Redo it with your own brief</h3>
${slide('rx-10', 26, 'Redo it with your own brief: booking a lab instead of booking a doctor')}
<p>The best proof that you learned the method, not just the code, is to run it again on a different problem. Keep the <strong>frame</strong> — five design steps, four milestones with criteria, the checklist, the rubric — and change the <strong>data and the rules</strong>. A booking domain maps almost one to one:</p>
<table>
<thead><tr><th>Clinic (reference)</th><th>Your brief (example: a lab booking system)</th></tr></thead>
<tbody>
<tr><td>doctor</td><td>lab room / piece of equipment</td></tr>
<tr><td>90-minute slot</td><td>lab session (morning / afternoon / evening)</td></tr>
<tr><td>my appointments</td><td>my group's reservations</td></tr>
<tr><td>reschedule</td><td>move a session, swap equipment</td></tr>
<tr><td>409 slot taken</td><td>409 equipment already held by another group</td></tr>
<tr><td>no two appointments at once</td><td>a group cannot hold two rooms in the same session</td></tr>
</tbody>
</table>
<div class="callout"><p><strong>💡 If you are building a graduation or course project with bookings (for example a lab/equipment booking app like LabFlow):</strong> do not copy this chapter's code into it. Take the method: write your six stories with testable criteria; list the states of <em>your</em> cell (maintenance? needs approval?); decide the clash rule first — by person, by group, by equipment, by room — and write it as a pure function with tests before any UI; agree the API contract with your backend teammate including every 409; then build in four milestones and grade yourself with the rubric. The clash rule is where your bugs will be.</p></div>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202 the project is submitted as a zip of <code>src/</code> or demoed with <code>npm start</code> on your laptop; if it is put online, it is often on GitHub Pages with <code>HashRouter</code> (<code>/#/bac-si/bs-2</code>) precisely so refresh does not 404. → At work every merge builds in CI (see the GitHub Actions course), the static <code>dist/</code> goes to a host or CDN configured with SPA fallback and cache headers, preview deployments let reviewers click through each pull request, and a plan exists for users on the old version. · <em>Why:</em> hash URLs work but look odd, cannot be rendered on a server later and are ignored by some tools; browser-history URLs plus correct server rules are the standard. HashRouter is still a legitimate choice when you cannot configure the server at all.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "Refreshing a page of my React app gives 404 on the server, but clicking to it works. Why?"</p>
<p>Client-side routing changes the URL without asking the server; a refresh asks the server for a file at that path, which does not exist. Configure a rewrite to <code>index.html</code> for non-file paths (nginx <code>try_files</code>, Netlify <code>_redirects</code>, Vercel rewrites), but keep real 404s for missing assets. Or use hash routing if the server cannot be configured.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "How do you make sure users get the new version after a deploy?"</p>
<p>Content-hashed file names cached immutably; <code>index.html</code> served with <code>no-cache</code> so it is re-checked; keep old assets available for a while; handle failed dynamic imports (<code>vite:preloadError</code>) with a guarded reload; for long-lived tabs, optionally poll a version file and offer a refresh.</p></div>

<h3>🛠 Keep building the project — step 4/4: build, deploy, grade</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after 10.3 (145 tests, thresholds met).</p><ol>
<li><code>npx tsc -b &amp;&amp; npx vite build</code>; read the chunk list and write two sentences in the README about what is big and why.</li>
<li>Add the <code>vite:preloadError</code> handler to <code>main.tsx</code> (after the router is created).</li>
<li>Add <code>deploy/nginx.conf</code> (or <code>public/_redirects</code> for Netlify). If you have Docker: <code>docker run --rm -p 8080:80 -v "$PWD/dist:/usr/share/nginx/html:ro" -v "$PWD/deploy/nginx.conf:/etc/nginx/conf.d/default.conf:ro" nginx:1.27-alpine</code>.</li>
<li>Go through the checklist; fill the rubric with evidence per line; write the README.</li>
</ol>
<p><strong>Done when:</strong> <code>curl -s -o /dev/null -w "%{http_code}" localhost:8080/bac-si/bs-2/lich-tuan</code> prints <code>200</code> and <code>…/assets/khong-co.js</code> prints <code>404</code>; <code>curl -sI</code> on an asset shows <code>immutable</code>; <code>npx vitest run</code> still shows 145 passed; your rubric table has evidence in every "full" cell you claim.</p></div>
<details><summary>Solution</summary>
<p>The nginx config, the Netlify and Vercel files and the <code>main.tsx</code> handler are printed above exactly as in the reference project (<code>deploy/nginx.conf</code>, <code>deploy/_redirects</code>, <code>deploy/vercel.json</code>). The measurement scripts are in the snapshot of the project after this chapter: <code>do/ch10-spa.sh</code> (four servers, 13 requests) and <code>do/ch10-tab-cu.mjs</code> (build A, open, deploy build B, click). Final state: 30 test files, 145 tests, lines 96.67%, branches 84.23%, <code>index-*.js</code> 364.29 kB (gzip 115.70 kB).</p>
${out(OUT.cuoiVaCov)}
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> see SPA fallback fail and succeed with your own eyes.</p><ol>
<li><code>npx vite build</code>, then <code>python3 -m http.server 4801 -d dist</code> (any static server without fallback works).</li>
<li>Open <code>http://localhost:4801/</code>, click to a doctor's week, then press F5. Note what you see.</li>
<li>Stop it; run <code>npx vite preview --port 4802</code>; repeat. Then open <code>http://localhost:4802/assets/khong-co.js</code>.</li>
</ol><p><strong>Done when:</strong> you saw a 404 page after F5 on Python and the week grid after F5 on preview, and you can explain in one sentence why the missing asset on <code>vite preview</code> is not the same question as on your real host.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">content hash</span><span class="v">part of a file name computed from its content; changes when the content does</span></div>
<div class="kv"><span class="k">chunk</span><span class="v">one output JS file; lazy routes and shared code get their own</span></div>
<div class="kv"><span class="k">SPA fallback</span><span class="v">serving <code>index.html</code> for paths that are not files, so the client router can run</span></div>
<div class="kv"><span class="k"><code>immutable</code> / <code>no-cache</code></span><span class="v">cache forever without asking / always re-check before using</span></div>
<div class="kv"><span class="k">MIME type</span><span class="v">the <code>Content-Type</code> of a response; module scripts must be JavaScript</span></div>
<div class="kv"><span class="k"><code>vite:preloadError</code></span><span class="v">event Vite fires when a dynamic import fails — the hook for reloading old tabs</span></div>
<div class="kv"><span class="k">rubric</span><span class="v">a grading table with levels and evidence per criterion</span></div>
<div class="kv"><span class="k">preview deployment</span><span class="v">a temporary URL built for each pull request so reviewers can click through</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>tsc -b &amp;&amp; vite build</code>: hashed files, one chunk per lazy route, shared chunks automatic; the new feature added ~2 kB to the initial bundle.</li>
<li>Measured: Python and bare nginx 404 on deep links; <code>vite preview</code> has its own fallback — it proves nothing about your host.</li>
<li>Correct config: fallback for pages, a real 404 for <code>/assets/</code>, <code>immutable</code> for hashed assets and <code>no-cache</code> for <code>index.html</code>.</li>
<li>Old tabs after a deploy request vanished chunks; React Router 8.4 swallows lazy-component import errors (blank page); <code>vite:preloadError</code> + a guarded reload to the target URL fixes it.</li>
<li>Twelve checklist lines summarise habits from Section 0 to Chapter 10; the rubric turns "it's done" into evidence.</li>
<li>Redo the project with your own brief: keep the method, change data and rules, write the clash rule first.</li>
</ul>

${LINK('https://vite.dev/guide/static-deploy', '🚀', 'Vite — Deploying a Static Site', 'Build, preview and host-specific notes.')}
${LINK('https://vite.dev/guide/build#load-error-handling', '🧯', 'Vite — Load error handling', 'The vite:preloadError event.')}
${LINK('https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files', '🌐', 'nginx — try_files', 'How the fallback chain is evaluated.')}
${LINK_TRONG('/courses/github-actions', '⚙️', 'Course — GitHub Actions', 'Build and deploy on every merge.')}
${LINK_TRONG('/courses/nextjs', '▲', 'Course — Next.js', 'Server rendering and its own deploy story, after React.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Build, deploy, checklist cả khoá và rubric tự chấm</h2>
<p class="lead">Một tính năng chưa xong khi test xanh trên laptop của bạn; nó xong khi một người lạ mở được link tới nó. Bài này đưa app phòng khám từ <code>npm run dev</code> lên một máy chủ tĩnh và đo ba thứ hay hỏng ở đó — deep link ra 404, fallback nuốt mất file JavaScript bị thiếu, và người dùng đang mở tab cũ trong lúc deploy. Rồi bài khép lại nửa đầu khoá học: một checklist những gì một dự án React phải có tới lúc này, một rubric để tự chấm dự án của mình cho thật, và lời mời làm lại cả dự án với đề của chính bạn.</p>

<h3>Build: thứ gì đi vào <code>dist/</code></h3>
${slide('rx-10', 20, 'vite build: ba chunk lazy mới, bundle đầu chỉ thêm 2 kB')}
<p>Script <code>build</code> là <code>tsc -b &amp;&amp; vite build</code>: kiểm kiểu trước (lỗi kiểu là dừng build), rồi Vite (bên dưới là Rolldown) gói mọi thứ thành file tĩnh. Output thật sau chương này:</p>
${out(OUT.build)}
<p>Cách đọc. Tên mỗi file mang một <strong>mã băm nội dung</strong> (<code>index-CnXVUOFB.js</code>): đổi một ký tự trong đoạn code rơi vào file đó là tên đổi. Chính điều đó làm cho việc cache mạnh tay về sau được an toàn. Mỗi route <code>lazy</code> của Chương 8 là một chunk riêng: <code>TrangLichTuan</code> (2,10 kB) và <code>TrangDoiGio</code> (3,82 kB) là mới, còn <code>lich-tuan-*.js</code> (9,27 kB) là <strong>chunk chung</strong> mà Rolldown tự tách vì cả hai trang cùng import <code>@/features/lich-tuan</code>. Bundle đầu <code>index-*.js</code> tăng từ 362,32 kB (sau Chương 9) lên 364,29 kB — khoảng 2 kB cho các mục route mới, các hàm ngày và hàm bắt lỗi bên dưới; bản thân tính năng không tốn gì cho tới khi có người mở nó. <code>form-*.js</code> (116,73 kB) là React Hook Form + Zod, lazy từ Chương 8.</p>
<p>File lớn nhất, <code>browser-*.js</code> (427,57 kB), là MSW. App này chưa có backend thật cho tới Chương 14, nên <code>main.tsx</code> bật API giả cả ở production, và <code>mockServiceWorker.js</code> trong <code>public/</code> được chép ra gốc <code>dist/</code>. Ở dự án có API thật, bạn chỉ bật MSW khi dev (<code>if (import.meta.env.DEV)</code>) và chunk đó biến khỏi thứ người dùng phải tải.</p>
<div class="callout"><p><strong>Preview không phải dev.</strong> <code>npm run dev</code> phục vụ file nguồn qua dev server của Vite; <code>npx vite preview</code> phục vụ <code>dist/</code> đã build — đã nén, đã chia chunk, React ở chế độ production, có output của React Compiler. Luôn bấm qua bản preview trước khi deploy: mọi ảnh chụp trong chương này đều chụp từ <code>vite preview</code>, không phải dev.</p></div>

<h3>Deep link và SPA fallback — đo thật</h3>
${slide('rx-10', 21, 'Mở thẳng deep link trên máy chủ tĩnh không fallback: 404')}
<p>Bài 7.1 đã giải thích vấn đề; ở đây nó được đo trên bốn máy chủ thật với cùng một <code>dist/</code>. Một <strong>ứng dụng một trang</strong> (single-page application) chỉ có một file HTML. Bấm link trong app không bao giờ hỏi máy chủ <code>/bac-si/bs-2/lich-tuan</code> — React Router đổi URL ngay trong trình duyệt. Nhưng bấm F5 ở đó, hoặc mở một link bạn bè gửi, trình duyệt sẽ hỏi máy chủ một <em>file</em> tên như vậy. Không có file nào. Máy chủ phải trả lời "đây là <code>index.html</code>" cho mọi đường dẫn không phải file thật — đó là <strong>SPA fallback</strong>:</p>
${SD.spaVi}
<p>Script <code>do/ch10-spa.sh</code> bật máy chủ có sẵn của Python, <code>vite preview</code>, và ba container nginx 1.27 trong Docker, rồi hỏi mỗi cái trang chủ, một deep link, một file JavaScript không tồn tại, và worker của MSW:</p>
${out(OUT.spa)}
<p>Python và nginx trơn trả <strong>404</strong> cho deep link. <code>vite preview</code> trả 200 — nó có sẵn fallback, và chính vì thế "chạy được trên preview" không chứng minh gì về host của bạn. Khối thứ tư mới thú vị: cấu hình hay bị chép nhất, <code>try_files $uri $uri/ /index.html</code> cho <em>mọi thứ</em>, chữa được deep link — và trả lời <code>/assets/khong-co.js</code> không tồn tại bằng <strong>200 text/html</strong>. Trình duyệt nhận HTML ở chỗ nó chờ JavaScript. Lát nữa bạn sẽ thấy điều đó làm gì với người dùng.</p>

<h3>Một cấu hình máy chủ đúng</h3>
${slide('rx-10', 22, 'nginx đúng: fallback cho trang, 404 thật cho assets')}
<p>Cấu hình dùng cho khối cuối của phép đo — hai <code>location</code> với hai việc khác nhau:</p>
${pre('nginx', SN.nginx)}
<p>File có mã băm thiếu thì 404 thật, có thì được cache một năm với <code>immutable</code> (tên đổi mỗi khi nội dung đổi, nên trình duyệt không bao giờ cần hỏi lại). Mọi thứ khác được fallback, và <code>no-cache</code> để trình duyệt kiểm lại <code>index.html</code> mỗi lần vào — file nhỏ đó là cách người dùng biết tên các chunk mới sau một lần deploy. Header, đúng như máy chủ trả:</p>
${out(OUT.spaHeader)}
<p>Để so sánh, cấu hình "fallback cho mọi thứ" đã sinh ra con số 200 ở trên:</p>
${pre('nginx', SN.nginxCa)}
<p>Các host khác nói hai luật đó bằng file riêng của chúng. Netlify đọc <code>public/_redirects</code> (được chép vào <code>dist/</code>): dòng <code>/*  /index.html  200</code> là rewrite chứ không phải redirect, nhờ con số 200; Netlify phục vụ file thật trước, nên assets vẫn 404 đúng. Vercel đọc <code>vercel.json</code>; mẫu dưới đây rewrite mọi thứ trừ <code>/assets/</code>:</p>
${pre('text', SN.redirects)}
${pre('json', SN.vercel)}
<p>GitHub Pages không có luật rewrite: cách lách quen thuộc là một <code>404.html</code> chép y <code>index.html</code> (trang tải lên với mã 404, công cụ tìm kiếm không thích), cộng <code>base: '/ten-repo/'</code> trong <code>vite.config.ts</code> và <code>basename</code> cho router nếu trang nằm dưới một đường dẫn con. Worker của MSW cũng phải được phục vụ từ đường dẫn con đó.</p>
<p>⏳ Chưa chạy thật: deploy lên một nền tảng host (Netlify, Vercel, GitHub Pages) có tên miền và HTTPS thật — máy dựng bài chỉ chạy Python, <code>vite preview</code> và nginx 1.27 trong Docker ở máy. Các luật đo ở trên là đúng những luật mà các nền tảng đó áp dụng.</p>
<!-- CHAY-O-MAY: deploy dist/ của dự án sau Chương 10 lên Netlify (có public/_redirects) và lên GitHub Pages (404.html + base); mở thẳng /bac-si/bs-2/lich-tuan?tuan=2026-10-05, F5, và /assets/khong-co.js; ghi mã HTTP + header Cache-Control thật -->

<h3>Tab cũ sau một lần deploy</h3>
${slide('rx-10', 23, 'Tab cũ sau deploy: trang trắng câm, sửa bằng vite:preloadError')}
<p>Đây là tình huống mọi SPA gặp ngay lần deploy thứ hai. Một bệnh nhân mở app từ hôm qua và để nguyên tab. Tab đó chạy bản A, code của nó biết trang lazy tên <code>TrangLichTuan-W91lVYN9.js</code>. Qua đêm bạn deploy bản B; máy chủ giờ có <code>TrangLichTuan-</code> với mã băm mới và file cũ đã mất. Bệnh nhân bấm "Xem lịch trống cả tuần →". Script <code>do/ch10-tab-cu.mjs</code> tái hiện đúng như vậy trên Chromium với nginx — phục vụ bản A và mở nó, chép bản B đè lên, rồi bấm:</p>
${out(OUT.tabCu404)}
<p>Chunk 404, URL không đổi, và <code>&lt;main&gt;</code> <strong>trống trơn</strong>. Không thông báo lỗi, không error boundary — route gốc có <code>ErrorBoundary: TrangLoi</code> từ Chương 7, vậy mà nó không xuất hiện. Lý do nằm trong mã nguồn React Router (8.4.0, <code>router.js</code>): lỗi khi tải các <em>thuộc tính</em> lazy như <code>lazy: { Component }</code> được await bên trong <code>try { … } catch {}</code> — bị nuốt. Với cấu hình "fallback cho mọi thứ" thì cũng trang trắng đó, chỉ khác dòng console:</p>
${out(OUT.tabCuHtml)}
<p>"Expected a JavaScript module script but the server responded with a MIME type of text/html" — fallback HTML đã trả lời thay cho một file JavaScript. Dòng đó trong một báo lỗi gần như luôn nghĩa là "tab cũ + fallback trên <code>/assets/</code>".</p>
${SD.tabCuVi}
<p>Vite có sẵn móc cho đúng chuyện này: mỗi khi một <code>import()</code> động hỏng, nó phát sự kiện <code>vite:preloadError</code> trên <code>window</code> (và ném lỗi tiếp, trừ khi bạn gọi <code>preventDefault()</code>). Cách sửa là tải lại — <code>index.html</code> mới trỏ tới tên chunk của bản B — và tải thẳng vào trang người dùng <em>định</em> mở, mà React Router vẫn giữ trong <code>router.state.navigation.location</code> vì nó chưa commit lần điều hướng đó:</p>
${pre('tsx', SN.preloadError)}
${out(OUT.tabCuSua)}
<p>Một lần tự tải lại, thẳng tới <code>/bac-si/bs-2/lich-tuan</code>, tiêu đề "Lịch trống cả tuần (bản B)". Chốt 10 giây rất quan trọng: nếu chunk thiếu vì một lý do mà tải lại không chữa được (deploy hỏng), tải lại vô tận còn tệ hơn trang trắng. Thêm hai thói quen nữa: giữ <code>assets/</code> của bản trước trên máy chủ một thời gian sau khi deploy (nhiều host tự làm việc này), và không bao giờ trả HTML cho một asset bị thiếu.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — dòng fallback-cho-mọi-thứ chép trên mạng.</strong> <code>try_files $uri $uri/ /index.html;</code> trong <code>location</code> duy nhất làm deep link chạy, nên trông như xong. Nhưng mọi file JS hay CSS bị thiếu giờ trả 200 kèm HTML: sau một lần deploy, tab cũ nhận lỗi MIME thay vì 404, cache có thể lưu HTML dưới tên file JS, và hệ thống theo dõi không bao giờ thấy 404 nào để báo động. Cho <code>/assets/</code> một <code>location</code> riêng với <code>try_files $uri =404</code>.</div>

<h3>Checklist cho cả nửa đầu khoá học</h3>
${slide('rx-10', 24, 'Checklist cả khoá: mười hai dòng trước khi nộp bài')}
<p>Mục 0 tới Chương 10 mỗi chương thêm một thói quen. Trước khi nộp một dự án, ghi nó vào CV hay kể về nó lúc phỏng vấn, đi qua mười hai dòng này. Mỗi dòng kiểm được trong vài phút, và mỗi dòng trỏ về thứ bạn đã làm trong khoá:</p>
<ul>
<li>☐ <code>npx tsc -b</code> không in gì (Mục 0, Chương 1).</li>
<li>☐ <code>npx vitest run</code> xanh và stderr không có cảnh báo act hay MSW (Chương 9, chương này).</li>
<li>☐ <code>npm run test:cov</code> qua ngưỡng (Chương 9).</li>
<li>☐ <code>npx vite build</code> xanh và bạn nói được chunk nào to, vì sao (Chương 8).</li>
<li>☐ Mọi màn hình dữ liệu có bốn trạng thái: đang tải, rỗng, lỗi, có dữ liệu (Chương 6).</li>
<li>☐ Lỗi 4xx/409 hiện bằng lời người dùng, đúng chỗ (Chương 3, 6, 10).</li>
<li>☐ URL giữ thứ người dùng muốn chia sẻ: bộ lọc, ngày đang chọn, tuần (Chương 5, 7, 10).</li>
<li>☐ axe báo 0 lỗi và luồng chính dùng được chỉ bằng bàn phím (Chương 8).</li>
<li>☐ Profiler không có mount bất ngờ, không có lần render thừa đo được (Chương 8, 10).</li>
<li>☐ Deploy: deep link và F5 không 404; tab cũ không thành trang trắng (Chương 7, bài này).</li>
<li>☐ README: chạy thế nào, test thế nào, bạn đã quyết định gì và vì sao.</li>
<li>☐ Mỗi bug đã sửa có một test sẽ bắt lại nó (Chương 9, chương này).</li>
</ul>

<h3>Rubric tự chấm — 100 điểm</h3>
${slide('rx-10', 25, 'Rubric tự chấm: 100 điểm, sáu nhóm, mỗi dòng kiểm được')}
${SD.diemVi}
<p>Chấm dự án của chính bạn bằng bảng này — thật lòng, tốt nhất nhờ thêm một người bạn chấm cùng. Mỗi nhóm có ba mức. "Đủ" đòi <em>bằng chứng</em> đưa ra được (tên một test, output một lệnh, một ảnh chụp, một dòng README), không phải cảm giác.</p>
<table>
<thead><tr><th>Nhóm</th><th>Điểm</th><th>0</th><th>Một nửa</th><th>Đủ</th></tr></thead>
<tbody>
<tr><td>Chạy đúng yêu cầu</td><td>25</td><td>có câu chuyện không chạy</td><td>chạy ở dev, chưa kiểm trên bản build</td><td>cả sáu câu chuyện của 10.1 chạy trên <code>vite preview</code></td></tr>
<tr><td>Thiết kế &amp; cấu trúc</td><td>15</td><td>không viết thiết kế</td><td>thiếu cây hoặc bảng state</td><td>ghi chú thiết kế đủ; features/ ↔ pages/ đi qua cửa; không lưu state tính được</td></tr>
<tr><td>Dữ liệu &amp; lỗi</td><td>20</td><td>lỗi chỉ nằm trong console</td><td>có hiện lỗi, vài màn hình cũ sau khi ghi</td><td>key có hệ thống; 409/500/mất mạng đều có đường đi; không request thừa (đếm được)</td></tr>
<tr><td>Test</td><td>20</td><td>ít hơn 10 test mới</td><td>test theo vai trò/nhãn nhưng chưa từng thấy đỏ</td><td>test MSW cho mọi câu chuyện; ≥ 1 test cho mỗi bug đã sửa; phá cố ý đều bị bắt</td></tr>
<tr><td>Tiếp cận &amp; hiệu năng</td><td>10</td><td>chưa kiểm</td><td>axe qua, chưa thử bàn phím</td><td>axe 0, lượt bàn phím, một phép đo Profiler có trước/sau</td></tr>
<tr><td>Build, deploy, README</td><td>10</td><td>không build được</td><td>build được, deep link 404 hoặc không có README</td><td>build xanh, deep link + F5 sống, xử lý tab cũ, README đủ để người lạ chạy lại</td></tr>
</tbody>
</table>
<p>Dự án mẫu của chương đạt 100 theo bảng này — và bạn nên nghi ngờ điều đó: cùng một người viết cả hai. Hãy nhờ người khác chấm dự án của bạn.</p>

<h3>Làm lại với đề của bạn</h3>
${slide('rx-10', 26, 'Làm lại với đề của bạn: đặt phòng lab thay cho đặt lịch khám')}
<p>Bằng chứng tốt nhất rằng bạn học được phương pháp, chứ không chỉ code, là chạy lại nó trên một bài toán khác. Giữ <strong>khuôn</strong> — năm bước thiết kế, bốn mốc có tiêu chí, checklist, rubric — và đổi <strong>dữ liệu và luật</strong>. Một bài toán đặt chỗ gần như ánh xạ một-một:</p>
<table>
<thead><tr><th>Phòng khám (mẫu)</th><th>Đề của bạn (ví dụ: hệ thống đặt phòng lab)</th></tr></thead>
<tbody>
<tr><td>bác sĩ</td><td>phòng lab / thiết bị</td></tr>
<tr><td>khung giờ 90 phút</td><td>ca lab (sáng / chiều / tối)</td></tr>
<tr><td>lịch hẹn của tôi</td><td>lượt giữ chỗ của nhóm tôi</td></tr>
<tr><td>đổi giờ</td><td>dời ca, đổi thiết bị</td></tr>
<tr><td>409 giờ đã kín</td><td>409 thiết bị đã có nhóm khác giữ</td></tr>
<tr><td>không hai lịch cùng giờ</td><td>một nhóm không giữ hai phòng trong cùng ca</td></tr>
</tbody>
</table>
<div class="callout"><p><strong>💡 Nếu bạn đang làm đồ án tốt nghiệp hay đồ án môn có đặt chỗ (ví dụ app đặt phòng lab/thiết bị kiểu LabFlow):</strong> đừng chép code của chương này vào. Hãy lấy phương pháp: viết sáu câu chuyện của bạn kèm tiêu chí kiểm được; liệt kê các trạng thái của ô <em>của bạn</em> (đang bảo trì? cần duyệt?); quyết luật trùng trước tiên — theo người, theo nhóm, theo thiết bị, theo phòng — và viết nó thành hàm thuần có test trước mọi giao diện; chốt hợp đồng API với bạn làm backend, kể cả mọi 409; rồi dựng qua bốn mốc và tự chấm bằng rubric. Luật trùng là nơi bug của bạn sẽ nằm.</p></div>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202 dự án được nộp dưới dạng file zip thư mục <code>src/</code> hoặc demo bằng <code>npm start</code> trên laptop; nếu có đưa lên mạng thì thường là GitHub Pages với <code>HashRouter</code> (<code>/#/bac-si/bs-2</code>) chính là để F5 khỏi 404. → Đi làm, mỗi lần merge đều build trong CI (xem khoá GitHub Actions), <code>dist/</code> tĩnh đi lên một host hay CDN được cấu hình SPA fallback và header cache, preview deployment cho người review bấm thử từng pull request, và có kế hoạch cho người dùng đang ở bản cũ. · <em>Vì sao:</em> URL có dấu # vẫn chạy nhưng trông lạ, sau này không render phía máy chủ được và bị vài công cụ bỏ qua; URL kiểu history cộng luật máy chủ đúng là chuẩn. HashRouter vẫn là lựa chọn chính đáng khi bạn hoàn toàn không cấu hình được máy chủ.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "F5 một trang của app React thì máy chủ trả 404, nhưng bấm link tới đó thì được. Vì sao?"</p>
<p>Định tuyến phía client đổi URL mà không hỏi máy chủ; F5 thì hỏi máy chủ một file ở đường dẫn đó, mà file đó không có. Cấu hình rewrite về <code>index.html</code> cho đường dẫn không phải file (nginx <code>try_files</code>, Netlify <code>_redirects</code>, rewrite của Vercel), nhưng giữ 404 thật cho asset bị thiếu. Hoặc dùng hash routing nếu không cấu hình được máy chủ.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Làm sao bảo đảm người dùng nhận bản mới sau khi deploy?"</p>
<p>Tên file có mã băm nội dung, cache <code>immutable</code>; <code>index.html</code> phục vụ với <code>no-cache</code> để luôn được kiểm lại; giữ asset cũ thêm một thời gian; xử lý import động hỏng (<code>vite:preloadError</code>) bằng một lần tải lại có chốt chặn; với tab mở lâu, có thể hỏi định kỳ một file phiên bản và mời người dùng tải lại.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 4/4: build, deploy, tự chấm</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau 10.3 (145 test, qua ngưỡng độ phủ).</p><ol>
<li><code>npx tsc -b &amp;&amp; npx vite build</code>; đọc danh sách chunk và viết hai câu trong README: cái gì to, vì sao.</li>
<li>Thêm hàm bắt <code>vite:preloadError</code> vào <code>main.tsx</code> (sau khi tạo router).</li>
<li>Thêm <code>deploy/nginx.conf</code> (hoặc <code>public/_redirects</code> cho Netlify). Có Docker thì: <code>docker run --rm -p 8080:80 -v "$PWD/dist:/usr/share/nginx/html:ro" -v "$PWD/deploy/nginx.conf:/etc/nginx/conf.d/default.conf:ro" nginx:1.27-alpine</code>.</li>
<li>Đi qua checklist; điền rubric kèm bằng chứng từng dòng; viết README.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>curl -s -o /dev/null -w "%{http_code}" localhost:8080/bac-si/bs-2/lich-tuan</code> in <code>200</code> và <code>…/assets/khong-co.js</code> in <code>404</code>; <code>curl -sI</code> một asset thấy <code>immutable</code>; <code>npx vitest run</code> vẫn 145 passed; bảng rubric của bạn có bằng chứng ở mọi ô "đủ" mà bạn nhận.</p></div>
<details><summary>Lời giải</summary>
<p>Cấu hình nginx, file của Netlify và Vercel, và hàm bắt lỗi trong <code>main.tsx</code> đã in ở trên, đúng như trong dự án mẫu (<code>deploy/nginx.conf</code>, <code>deploy/_redirects</code>, <code>deploy/vercel.json</code>). Các script đo nằm trong ảnh chụp dự án sau chương này: <code>do/ch10-spa.sh</code> (bốn máy chủ, 13 request) và <code>do/ch10-tab-cu.mjs</code> (bản A, mở, deploy bản B, bấm). Trạng thái cuối: 30 file test, 145 test, dòng 96,67%, nhánh 84,23%, <code>index-*.js</code> 364,29 kB (gzip 115,70 kB).</p>
${out(OUT.cuoiVaCov)}
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề:</strong> tận mắt thấy SPA fallback hỏng và chạy.</p><ol>
<li><code>npx vite build</code>, rồi <code>python3 -m http.server 4801 -d dist</code> (máy chủ tĩnh nào không có fallback cũng được).</li>
<li>Mở <code>http://localhost:4801/</code>, bấm tới lịch tuần của một bác sĩ, rồi bấm F5. Ghi lại bạn thấy gì.</li>
<li>Tắt nó; chạy <code>npx vite preview --port 4802</code>; làm lại. Rồi mở <code>http://localhost:4802/assets/khong-co.js</code>.</li>
</ol><p><strong>Đạt khi:</strong> bạn đã thấy trang 404 sau F5 trên Python và lưới tuần sau F5 trên preview, và giải thích được trong một câu vì sao asset bị thiếu trên <code>vite preview</code> không phải cùng câu hỏi với trên host thật của bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">content hash (mã băm nội dung)</span><span class="v">phần tên file tính từ nội dung; nội dung đổi là tên đổi</span></div>
<div class="kv"><span class="k">chunk</span><span class="v">một file JS đầu ra; route lazy và code dùng chung có chunk riêng</span></div>
<div class="kv"><span class="k">SPA fallback</span><span class="v">trả <code>index.html</code> cho đường dẫn không phải file, để router phía client chạy</span></div>
<div class="kv"><span class="k"><code>immutable</code> / <code>no-cache</code></span><span class="v">cache mãi không hỏi lại / luôn kiểm lại trước khi dùng</span></div>
<div class="kv"><span class="k">MIME type</span><span class="v"><code>Content-Type</code> của response; module script bắt buộc là JavaScript</span></div>
<div class="kv"><span class="k"><code>vite:preloadError</code></span><span class="v">sự kiện Vite phát khi import động hỏng — móc để tải lại tab cũ</span></div>
<div class="kv"><span class="k">rubric</span><span class="v">bảng chấm điểm có mức và bằng chứng cho từng tiêu chí</span></div>
<div class="kv"><span class="k">preview deployment</span><span class="v">URL tạm dựng cho từng pull request để người review bấm thử</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>tsc -b &amp;&amp; vite build</code>: file có mã băm, mỗi route lazy một chunk, chunk chung tự động; tính năng mới chỉ thêm ~2 kB vào bundle đầu.</li>
<li>Đo thật: Python và nginx trơn trả 404 cho deep link; <code>vite preview</code> có fallback riêng — nó không chứng minh gì về host của bạn.</li>
<li>Cấu hình đúng: fallback cho trang, 404 thật cho <code>/assets/</code>, <code>immutable</code> cho asset có mã băm và <code>no-cache</code> cho <code>index.html</code>.</li>
<li>Tab cũ sau deploy xin các chunk đã biến mất; React Router 8.4 nuốt lỗi import của lazy component (trang trắng); <code>vite:preloadError</code> + một lần tải lại có chốt tới đúng URL đích là cách sửa.</li>
<li>Mười hai dòng checklist tóm các thói quen từ Mục 0 tới Chương 10; rubric biến "xong rồi" thành bằng chứng.</li>
<li>Làm lại dự án với đề của bạn: giữ phương pháp, đổi dữ liệu và luật, viết luật trùng trước tiên.</li>
</ul>

${LINK('https://vite.dev/guide/static-deploy', '🚀', 'Vite — Deploying a Static Site', 'Build, preview và ghi chú cho từng host.')}
${LINK('https://vite.dev/guide/build#load-error-handling', '🧯', 'Vite — Load error handling', 'Sự kiện vite:preloadError.')}
${LINK('https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files', '🌐', 'nginx — try_files', 'Chuỗi fallback được xét thế nào.')}
${LINK_TRONG('/courses/github-actions', '⚙️', 'Khoá — GitHub Actions', 'Build và deploy mỗi lần merge.')}
${LINK_TRONG('/courses/nextjs', '▲', 'Khoá — Next.js', 'Render phía máy chủ và cách deploy riêng của nó, học sau React.')}
</div>
`,
};

const Q = {
    title: '10.5 — Chapter 10 quiz|||10.5 — Kiểm tra Chương 10',
    slug: 'rx-10-5-kiem-tra',
    type: 'QUIZ',
    isFreePreview: true,
    description: 'Mười câu tình huống lấy từ chính dự án giữa khoá: thiết kế state, useQueries, bug ghép tính năng, chặn trùng hai lớp, onSettled và 409, Profiler, enabled, once của MSW, SPA fallback và tab cũ sau deploy — mỗi câu có giải thích.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Chapter 10 quiz</h2>
<p class="lead">Ten situations taken from building, measuring and deploying this chapter's feature. Most questions describe what happened and ask why, or what the screen or the server shows. 15 minutes.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can turn a spoken request into user stories with criteria a test can check, and draw every state of a screen.</li>
<li>I can decide where each piece of state lives and explain why derived data is not state.</li>
<li>I can load a variable list of queries with <code>useQueries</code> and handle one of them failing.</li>
<li>I can explain two layers of duplicate protection and why a mutation invalidates in <code>onSettled</code>.</li>
<li>I can read a Profiler result for unexpected mounts and prove a test catches the bug it guards.</li>
<li>I can configure SPA fallback without breaking asset 404s and handle old tabs after a deploy.</li>
</ul>
${slide('rx-10', 28, 'Chapter 10 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Kiểm tra Chương 10</h2>
<p class="lead">Mười tình huống lấy từ việc dựng, đo và deploy tính năng của chương. Phần lớn câu hỏi kể chuyện đã xảy ra và hỏi vì sao, hoặc màn hình hay máy chủ hiện gì. 15 phút.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi biến được một yêu cầu nói miệng thành câu chuyện người dùng có tiêu chí test kiểm được, và vẽ được mọi trạng thái của một màn hình.</li>
<li>Tôi quyết được mỗi mẩu state sống ở đâu và giải thích được vì sao dữ liệu tính được không phải state.</li>
<li>Tôi tải được một danh sách query độ dài thay đổi bằng <code>useQueries</code> và xử lý khi một query hỏng.</li>
<li>Tôi giải thích được hai lớp chặn trùng và vì sao mutation invalidate trong <code>onSettled</code>.</li>
<li>Tôi đọc được kết quả Profiler để tìm mount bất ngờ và chứng minh được một test bắt đúng bug nó canh.</li>
<li>Tôi cấu hình được SPA fallback mà không làm hỏng 404 của asset, và xử lý được tab cũ sau deploy.</li>
</ul>
${slide('rx-10', 28, 'Bảng tra nhanh Chương 10')}
</div>
`,
    quiz: {
      timeLimitSeconds: 900,
      questions: [
        {
          question: "The week grid needs its rows: the clinic's hours (08:00, 09:30, 14:00, 15:30). Where should they live?|||Lưới tuần cần các hàng: giờ khám của phòng khám (08:00, 09:30, 14:00, 15:30). Chúng nên nằm ở đâu?",
          options: [
            "In a constant GIO in LuoiLichTuan, because they rarely change|||Trong hằng GIO ở LuoiLichTuan, vì hiếm khi đổi",
            "Nowhere: derive them during render from the slots the server returned|||Không ở đâu cả: tính ra lúc render từ các khung giờ máy chủ trả về",
            "In a Zustand store, so every page sees the same hours|||Trong store Zustand, để mọi trang thấy cùng giờ",
            "In useState, initialised from the first day's data|||Trong useState, khởi tạo từ dữ liệu của ngày đầu tiên",
          ],
          correctIndex: 1,
          points: 1,
          explanation: "EN: The server decides the hours; anything computable from data you already have is not state (Lesson 10.1, Step 4). The tempting constant duplicates a fact: when the clinic adds 17:00, the grid silently ignores it. A store or useState copy is a second source of truth that stops following the server. (10.3 does keep the previous week's hours in state — only as a stand-in while a new week loads, still derived from data.)|||VI: Máy chủ quyết định giờ khám; thứ gì tính được từ dữ liệu đang có thì không phải state (Bài 10.1, Bước 4). Hằng số hấp dẫn kia chép một sự thật thành hai: phòng khám thêm 17:00 là lưới âm thầm bỏ qua. Bản sao trong store hay useState là nguồn sự thật thứ hai, thôi đi theo máy chủ. (10.3 có giữ giờ của tuần trước trong state — chỉ để thế chỗ trong lúc tuần mới đang tải, vẫn rút từ dữ liệu.)",
        },
        {
          question: "Why does useLichTuan call useQueries with an array of six queries instead of calling useQuery inside ngays.map(...)?|||Vì sao useLichTuan gọi useQueries với mảng sáu query thay vì gọi useQuery trong ngays.map(...)?",
          options: [
            "useQuery cannot run in parallel; useQueries can|||useQuery không chạy song song được; useQueries thì được",
            "useQueries is faster because it sends one HTTP request for all six days|||useQueries nhanh hơn vì gửi một request HTTP cho cả sáu ngày",
            "Hooks must be called the same number of times in the same order every render; a loop of hooks breaks that as soon as the length changes|||Hook phải được gọi cùng số lần, cùng thứ tự ở mọi lần render; hook trong vòng lặp phá luật đó ngay khi độ dài đổi",
            "useQuery does not accept a queryKey that contains a date|||useQuery không nhận queryKey có chứa ngày",
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: Rules of Hooks: same hooks, same order, every render. useQueries is ONE hook taking an array of any length; combine reshapes the results. The tempting 'one HTTP request' is wrong: it still sends one request per day (six keys, six cache entries — that is what lets the week share cache with the doctor page). Several useQuery calls do run in parallel too.|||VI: Luật của hook: cùng hook, cùng thứ tự, mọi lần render. useQueries là MỘT hook nhận mảng độ dài bất kỳ; combine đổi hình dạng kết quả. Phương án hấp dẫn 'một request HTTP' là sai: nó vẫn gửi mỗi ngày một request (sáu key, sáu mục cache — chính nhờ vậy lưới tuần dùng chung cache với trang bác sĩ). Nhiều lời gọi useQuery cũng chạy song song.",
        },
        {
          question: "After the week grid was finished, clicking a free cell on Tuesday 06/10 opened the booking page with 'Không tìm thấy khung giờ này'. What was the cause?|||Lưới tuần xong, bấm một ô trống thứ Ba 06/10 thì trang đặt lịch hiện 'Không tìm thấy khung giờ này'. Nguyên nhân là gì?",
          options: [
            "TrangDatLich read the date with docNgay, which silently turns any day outside the three-day picker into 2026-10-01|||TrangDatLich đọc ngày bằng docNgay, hàm này âm thầm đổi mọi ngày ngoài bộ chọn ba ngày thành 2026-10-01",
            "The mock server does not generate slots for dates after 03/10|||Máy chủ giả không sinh khung giờ cho ngày sau 03/10",
            "The link in the grid forgot the ?ngay= parameter|||Link trong lưới quên tham số ?ngay=",
            "The route /dat-lich/:khungGioId is behind the login gate|||Route /dat-lich/:khungGioId nằm sau cổng đăng nhập",
          ],
          correctIndex: 0,
          points: 1,
          explanation: "EN: The link was correct (…&ngay=2026-10-06) and the server generates slots for any date; the old page asked for 01/10's slots because docNgay's fallback assumed three booking days (Lesson 10.2, real test output: 1 failed | 6 passed). The fix was a separate docNgayDat for the booking page. Being behind the login gate would show the login page, not this message.|||VI: Link đúng (…&ngay=2026-10-06) và máy chủ sinh khung giờ cho mọi ngày; trang cũ hỏi khung giờ ngày 01/10 vì đường lùi của docNgay giả định chỉ có ba ngày đặt lịch (Bài 10.2, output thật: 1 failed | 6 passed). Cách sửa là một docNgayDat riêng cho trang đặt lịch. Nằm sau cổng đăng nhập thì sẽ hiện trang đăng nhập, không phải dòng này.",
        },
        {
          question: "The grid already hides slots that clash with the user's own appointments. Why must the server still return 409 'Bạn đã có một lịch khác vào đúng giờ này'?|||Lưới đã ẩn các giờ trùng với lịch của chính người dùng. Vì sao máy chủ vẫn phải trả 409 'Bạn đã có một lịch khác vào đúng giờ này'?",
          options: [
            "Because React may skip the client check when React Compiler is on|||Vì React có thể bỏ qua phép kiểm ở client khi bật React Compiler",
            "It does not need to; the client check is enough for a single-page app|||Không cần; kiểm ở client là đủ cho một SPA",
            "Because 409 is faster than a client check|||Vì 409 nhanh hơn kiểm ở client",
            "The client only knows its cache: another tab, another phone or a 30-second-old cache can hold a clash it cannot see|||Client chỉ biết cache của nó: tab khác, điện thoại khác hay cache cũ 30 giây có thể chứa lịch trùng mà nó không thấy",
          ],
          correctIndex: 3,
          points: 1,
          explanation: "EN: Two layers: the client for experience, the server for truth. The test 'lớp máy chủ' creates the clash in the fake database after the page loaded — the client check passes, the PATCH is sent, only the server stops it. 'The client check is enough' is exactly the assumption that test disproves; anyone can also call the API directly.|||VI: Hai lớp: client cho trải nghiệm, máy chủ cho sự thật. Test 'lớp máy chủ' tạo lịch trùng trong cơ sở dữ liệu giả sau khi trang đã tải — lớp client cho qua, PATCH được gửi, chỉ máy chủ chặn lại. 'Kiểm ở client là đủ' chính là giả định mà test đó bác bỏ; ai cũng gọi thẳng API được.",
        },
        {
          question: "useDoiGio is changed from onSettled to onSuccess for its invalidateQueries. What does the user see after a 409 'Khung giờ này vừa có người đặt'?|||useDoiGio bị đổi invalidateQueries từ onSettled sang onSuccess. Sau một lần 409 'Khung giờ này vừa có người đặt', người dùng thấy gì?",
          options: [
            "The same as before: the grid refetches because the error clears the cache|||Như cũ: lưới tải lại vì lỗi xoá cache",
            "The error message, but the grid still shows the lost slot as free, because nothing refetched the slots|||Dòng báo lỗi, nhưng lưới vẫn hiện ô vừa mất là còn trống, vì không có gì tải lại khung giờ",
            "A blank page, because the error reaches the error boundary|||Trang trắng, vì lỗi chạy tới error boundary",
            "An automatic retry that succeeds the second time|||Tự thử lại và lần hai thành công",
          ],
          correctIndex: 1,
          points: 1,
          explanation: "EN: onSuccess does not run on errors, so the stale grid stays. Measured in 10.2/10.3: the onsuccess mutation made 2 tests red ('ô đó thành Kín' and the server-layer test). Errors do not clear the cache, the page catches mutateAsync's rejection (no error boundary), and mutations are not retried by default (the app's query policy also never retries 4xx such as 409).|||VI: onSuccess không chạy khi lỗi, nên lưới cũ vẫn nằm đó. Đo ở 10.2/10.3: đột biến onsuccess làm 2 test đỏ ('ô đó thành Kín' và test lớp máy chủ). Lỗi không xoá cache, trang bắt lỗi của mutateAsync (không tới error boundary), và mutation mặc định không thử lại (chính sách của query trong app cũng không bao giờ thử lại lỗi 4xx như 409).",
        },
        {
          question: "In Chromium, switching weeks recorded Profiler [mount 0.6ms], a new <table> node, and 408 ms without a table. What is the real problem?|||Trên Chromium, đổi tuần ghi được Profiler [mount 0.6ms], một nút <table> mới, và 408 ms không có bảng. Vấn đề thật là gì?",
          options: [
            "The grid renders too slowly and needs memo|||Lưới render quá chậm, cần memo",
            "The network is slow; nothing can be done in React|||Mạng chậm; React không làm gì được",
            "The grid is thrown away and rebuilt: while loading, a different element replaced the table, so the page collapses and jumps|||Lưới bị vứt đi dựng lại: lúc đang tải, một phần tử khác thế chỗ bảng, nên trang sụp xuống rồi nhảy lại",
            "The Profiler is wrong in production builds|||Profiler báo sai trên bản build production",
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: 0.6 ms is nothing to optimise — memo would not change anything. The signal is the phase: mount where an update was expected, and a new DOM node. The page rendered <p>Đang tải…</p> instead of the table while all six new queries were pending. Remembering the previous hours kept the table (update only, 0 ms without a grid). The build was made with --mode profiling precisely so the Profiler reports in production code.|||VI: 0,6 ms thì chẳng có gì để tối ưu — memo không đổi được gì. Tín hiệu là pha: mount ở chỗ đáng lẽ là update, và một nút DOM mới. Trang vẽ <p>Đang tải…</p> thay cho bảng trong lúc cả sáu query mới đang chờ. Nhớ giờ của lần trước giữ lại được bảng (chỉ update, 0 ms không có lưới). Bản build được làm với --mode profiling chính là để Profiler báo số trên code production.",
        },
        {
          question: "The reschedule page first loads the appointment, then the week. The first version called useLichTuan(lh?.bacSiId ?? '', tuan) with enabled: !daQua(ngay). What happened in the tests?|||Trang đổi giờ tải lịch hẹn trước rồi mới tải tuần. Bản đầu gọi useLichTuan(lh?.bacSiId ?? '', tuan) với enabled: !daQua(ngay). Chuyện gì xảy ra trong test?",
          options: [
            "Requests to /api/bac-si//khung-gio were sent; MSW printed errors, but every test stayed green|||Request tới /api/bac-si//khung-gio được gửi; MSW in lỗi, nhưng mọi test vẫn xanh",
            "TypeScript refused to compile because '' is not a doctor id|||TypeScript không cho biên dịch vì '' không phải mã bác sĩ",
            "The page crashed into the error boundary|||Trang sập vào error boundary",
            "Nothing: TanStack Query never runs a query whose key contains an empty string|||Không gì cả: TanStack Query không bao giờ chạy query có key chứa chuỗi rỗng",
          ],
          correctIndex: 0,
          points: 1,
          explanation: "EN: Real stderr from Lesson 10.3: '[MSW] Error: intercepted a request without a matching request handler: GET /api/bac-si//khung-gio?ngay=2026-10-01' — and '✓ axe … không có lỗi nào'. onUnhandledRequest: 'error' fails the request, not the test. TanStack runs any enabled key, '' is a valid string for TypeScript, and the failed queries were replaced a moment later, so no boundary fired. Fix: pass null and require it in enabled, plus a test asserting every request is for bs-2.|||VI: stderr thật ở Bài 10.3: '[MSW] Error: intercepted a request without a matching request handler: GET /api/bac-si//khung-gio?ngay=2026-10-01' — kèm '✓ axe … không có lỗi nào'. onUnhandledRequest: 'error' làm hỏng request, không làm đỏ test. TanStack chạy mọi key được enabled, '' là chuỗi hợp lệ với TypeScript, và các query hỏng bị thay ngay sau đó nên không boundary nào bật. Cách sửa: truyền null và bắt enabled đòi nó, cộng một test kiểm mọi request đều của bs-2.",
        },
        {
          question: "A test adds server.use(http.get('/api/bac-si/:id/khung-gio', resolver, { once: true })), where the resolver returns undefined for every day except 02/10, which gets a 500. The page asks for 01/10, 02/10, 03/10. What does 02/10 receive?|||Một test thêm server.use(http.get('/api/bac-si/:id/khung-gio', resolver, { once: true })), resolver trả undefined cho mọi ngày trừ 02/10 thì trả 500. Trang hỏi 01/10, 02/10, 03/10. Ngày 02/10 nhận gì?",
          options: [
            "500, because once counts only responses the handler actually returned|||500, vì once chỉ đếm các response mà handler thật sự trả",
            "200 from the normal handler: once was used up by the first matching request (01/10), which returned undefined|||200 từ handler thường: once đã bị tiêu ở request khớp đầu tiên (01/10), vốn trả undefined",
            "A network error, because an undefined response is not allowed|||Lỗi mạng, vì response undefined là không hợp lệ",
            "500 for every day, because the handler matched all three|||500 cho mọi ngày, vì handler khớp cả ba",
          ],
          correctIndex: 1,
          points: 1,
          explanation: "EN: Reproduced in Lesson 10.3: '[once] resolver chạy 1 lần · mã trả về: 200, 200, 200'. 'once' means matched once, not 'responded once'. Returning undefined falls through to the next handler (so no network error). The working test counts calls itself (soLanHong++ > 0).|||VI: Tái hiện ở Bài 10.3: '[once] resolver chạy 1 lần · mã trả về: 200, 200, 200'. 'once' nghĩa là khớp một lần, không phải 'trả response một lần'. Trả undefined thì rơi xuống handler kế tiếp (nên không có lỗi mạng). Test chạy đúng tự đếm số lần gọi (soLanHong++ > 0).",
        },
        {
          question: "nginx has one location with try_files $uri $uri/ /index.html. What does a request for /assets/khong-co.js return?|||nginx có đúng một location với try_files $uri $uri/ /index.html. Request tới /assets/khong-co.js trả về gì?",
          options: [
            "404, because nginx knows .js files are assets|||404, vì nginx biết file .js là asset",
            "301 redirect to /|||301 chuyển hướng về /",
            "403, because the file is outside the root|||403, vì file nằm ngoài thư mục gốc",
            "200 with the HTML of index.html — the browser then fails with a MIME-type error for the module script|||200 kèm HTML của index.html — rồi trình duyệt báo lỗi MIME type cho module script",
          ],
          correctIndex: 3,
          points: 1,
          explanation: "EN: Measured with nginx 1.27: '/assets/khong-co.js │ 200 text/html'. In the old-tab test that produced 'Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of \"text/html\"'. nginx does not treat file types specially; the fix is a separate location /assets/ { try_files $uri =404; }, which returned 404.|||VI: Đo với nginx 1.27: '/assets/khong-co.js │ 200 text/html'. Trong test tab cũ nó sinh ra 'Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of \"text/html\"'. nginx không phân biệt loại file; cách sửa là location /assets/ { try_files $uri =404; } riêng, cho ra 404.",
        },
        {
          question: "A tab opened before a deploy clicks to a lazy page whose chunk was replaced. Without extra handling the page stays blank. What does the chapter's vite:preloadError handler do?|||Một tab mở từ trước lần deploy bấm sang một trang lazy mà chunk đã bị thay. Không xử lý gì thêm thì trang trắng. Hàm bắt vite:preloadError của chương làm gì?",
          options: [
            "Shows TrangLoi, the route error boundary, with the 404 message|||Hiện TrangLoi, error boundary của route, kèm thông báo 404",
            "Retries the same chunk URL three times|||Thử lại đúng URL chunk đó ba lần",
            "Reloads once, directly to the URL the user was navigating to (router.state.navigation.location), unless it already reloaded in the last 10 seconds|||Tải lại một lần, thẳng tới URL người dùng đang định mở (router.state.navigation.location), trừ khi vừa tự tải lại trong 10 giây",
            "Reloads the current page in a loop until the chunk appears|||Tải lại trang hiện tại liên tục cho tới khi chunk xuất hiện",
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: Real run: '[TẢI LẠI TRANG] /bac-si/bs-2/lich-tuan · tiêu đề: Lịch trống cả tuần (bản B)'. The error boundary never shows because React Router 8.4 swallows errors from lazy route properties (catch {} in router.js). Retrying the old URL cannot help — the file is gone; the new index.html knows the new name. The 10-second guard exists precisely to prevent a reload loop when a deploy is really broken.|||VI: Lượt chạy thật: '[TẢI LẠI TRANG] /bac-si/bs-2/lich-tuan · tiêu đề: Lịch trống cả tuần (bản B)'. Error boundary không bao giờ hiện vì React Router 8.4 nuốt lỗi của thuộc tính lazy (catch {} trong router.js). Thử lại URL cũ không cứu được — file đã mất; index.html mới mới biết tên mới. Chốt 10 giây tồn tại chính là để không lặp tải lại khi deploy hỏng thật.",
        },
      ],
    },
};

export default {
  title: 'Chapter 10 — Mid-course project: the booking UI|||Chương 10 — Dự án giữa khoá: giao diện đặt lịch',
  description: 'Dự án giữa khoá: tự thiết kế và dựng tính năng lịch trống cả tuần + đổi giờ cho app đặt lịch — câu chuyện người dùng, cây component, bản đồ state, useQueries, chặn trùng hai lớp, xử lý 409, Profiler, axe, test MSW, build và deploy tĩnh đúng cách, checklist cả khoá và rubric tự chấm.',
  lessons: [L1, L0, L2, L3, L4, Q],
};
