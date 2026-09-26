import { gallery, slide } from './_slides.mjs';

/**
 * React — Chương 9: Test React (soạn 26/09/2026 theo content/courses/react/_HOP-DONG.md, mục 2–7 + 11).
 * Giữ slug khung: rx-9-1-testing-library · rx-9-2-async · rx-9-3-hook · rx-9-4-phong-van (LESSON); thêm rx-9-0-slides
 * (DOCUMENT, đầu chương) và quiz rx-9-5-kiem-tra (QUIZ, 10 câu). Title chương CHÉP NGUYÊN từ khung.
 * "🛠 Tự gõ tiếp dự án" rải MỖI bài một bước (4 bước). Không dạy Playwright E2E (khoá Next.js Chương 19 lo) — trỏ /courses/testing.
 * Mọi mã dài và mọi output trong bài chạy THẬT 26/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch09 — chép từ
 * ảnh chụp sau-ch12 (dự án đã có use()/Suspense, useOptimistic, useActionState, React Compiler, MSW), rồi làm bốn bước.
 * Ảnh chụp dự án sau chương: SCRATCH/rx/du-an/sau-ch09.
 * (react 19.3.0 · vite 8.3.1 · typescript 6.0.3 · vitest 5.0.2 · @vitest/coverage-v8 5.0.2 · jsdom 29.1.1 ·
 *  @testing-library/react 16.3.3 · @testing-library/dom 10.4.2 · @testing-library/user-event 14.6.7 ·
 *  @testing-library/jest-dom 7.0.1 · msw 2.15.0 · axe-core 4.13.0 · react-hook-form 7.88.0 · zod 4.6.5 ·
 *  @tanstack/react-query 5.103.3 · react-router 8.4.0 · zustand 5.0.15 · babel-plugin-react-compiler 1.0.0 · Chromium qua Playwright).
 * Mã dài trong bài nằm ở hằng SN, output ở hằng OUT — sinh tự động từ chính các file/log đã chạy.
 * Sơ đồ: mermaid ngay trong bài (<pre><code class="language-mermaid">), 2–3 sơ đồ mỗi bài dạy, nhãn VI ở khối VI, EN ở khối EN.
 * Deck: scripts/slides-src/rx-09.mjs.
 */

const H = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '&#96;').replace(/\$\{/g, '&#36;{');
const pre = (lang, s) => '<pre><code class="language-' + lang + '">' + H(s) + '</code></pre>';
const out = (s) => '<div class="out">' + H(s) + '</div>';
const LINK = (href, ico, title, sub) => '<a class="link-card" href="' + href + '" target="_blank" rel="noopener"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';
/** Link trong site (không mở tab mới). */
const LINK_TRONG = (href, ico, title, sub) => '<a class="link-card" href="' + href + '"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';
/** Sơ đồ mermaid: trang học đọc textContent của <code class="language-mermaid"> rồi vẽ (LearnPageClient → mermaidRuntime). */
const MM = (src) => '<pre><code class="language-mermaid">' + H(src.trim()) + '</code></pre>';

/* ─── Mã trong bài: SINH TỰ ĐỘNG từ dự án thử ch09 (tsc -b sạch + vitest xanh 26/09/2026) — đừng sửa tay ─── */
const SN = {
  theBacSiTest: "import { render, screen } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\nimport { describe, expect, test, vi } from 'vitest';\nimport { danhSachBacSi } from '@/du-lieu/bac-si';\nimport { TheBacSi } from './TheBacSi';\n\n/** Chương 9 — Bài 9.1: test đầu tiên. Không router, không API: TheBacSi không có Link khi coLienKet = false. */\nconst bsHa = danhSachBacSi[1]; // BS. Trần Thu Hà · nhi · 8 năm\nconst bsLan = danhSachBacSi[3]; // BS. Phạm Ngọc Lan · răng hàm mặt · 15 năm\n\ndescribe('TheBacSi', () => {\n  test('hiện tên, chuyên khoa, số năm kinh nghiệm', () => {\n    // Arrange (chuẩn bị): vẽ component với dữ liệu thật của dự án\n    render(<TheBacSi bacSi={bsHa} />);\n    // Assert (kiểm): hỏi DOM như người dùng nhìn — theo vai trò và chữ\n    const the = screen.getByRole('article', { name: 'BS. Trần Thu Hà' });\n    expect(the).toHaveTextContent('Nhi');\n    expect(the).toHaveTextContent('8 năm kinh nghiệm');\n    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('BS. Trần Thu Hà');\n  });\n\n  test('noiBat ⇒ nhãn \"Bác sĩ lâu năm\"; không noiBat ⇒ không có (luật ≥ 15 năm nằm ở DanhSachBacSi)', () => {\n    const { rerender } = render(<TheBacSi bacSi={bsLan} noiBat />);\n    expect(screen.getByText('Bác sĩ lâu năm')).toBeInTheDocument();\n    rerender(<TheBacSi bacSi={bsHa} />);\n    expect(screen.queryByText('Bác sĩ lâu năm')).not.toBeInTheDocument(); // KHÔNG có ⇒ queryBy, không phải getBy\n  });\n\n  test('bấm ♡ ⇒ gọi onDoiYeuThich với đúng id; nút báo trạng thái bằng aria-pressed', async () => {\n    const user = userEvent.setup(); // setup TRƯỚC khi render\n    const onDoiYeuThich = vi.fn(); // hàm giả: ghi lại mọi lần được gọi\n    render(<TheBacSi bacSi={bsHa} laYeuThich={false} onDoiYeuThich={onDoiYeuThich} />);\n    const nut = screen.getByRole('button', { name: 'Yêu thích BS. Trần Thu Hà', pressed: false });\n    // Act (hành động): bấm như người dùng — user-event bắn đủ chuỗi sự kiện của một cú bấm thật\n    await user.click(nut);\n    expect(onDoiYeuThich).toHaveBeenCalledTimes(1);\n    expect(onDoiYeuThich).toHaveBeenCalledWith('bs-2');\n  });\n\n  test('không truyền onDoiYeuThich ⇒ không có nút ♡', () => {\n    render(<TheBacSi bacSi={bsHa} />);\n    expect(screen.queryByRole('button')).not.toBeInTheDocument();\n  });\n});",
  veForm: "const bsHa = danhSachBacSi[1];\n\n/** Vẽ form với một onGui GIẢ. Mặc định onGui xong ngay; test nào cần thì truyền hàm khác. */\nfunction veForm(onGui: (d: DatLich) => Promise<void> = vi.fn(async () => {})) {\n  const user = userEvent.setup();\n  render(<FormDatLich bacSi={bsHa} onGui={onGui} />);\n  const o = {\n    hoTen: screen.getByLabelText('Họ và tên'),\n    sdt: screen.getByLabelText('Số điện thoại'),\n    ngaySinh: screen.getByLabelText('Ngày sinh'),\n    lyDo: screen.getByLabelText('Lý do khám'),\n    gui: screen.getByRole('button', { name: 'Gửi yêu cầu' }),\n  };\n  return { user, onGui, ...o };\n}",
  formTrong: "  test('bấm gửi khi form trống ⇒ lỗi dưới cả 4 ô, ô đánh dấu invalid, onGui KHÔNG được gọi', async () => {\n    const { user, onGui, hoTen, sdt, ngaySinh, lyDo, gui } = veForm();\n    await user.click(gui);\n    // Lỗi được GẮN vào ô bằng aria-describedby ⇒ kiểm bằng \"mô tả\" của ô, đúng thứ trình đọc màn hình đọc lên\n    expect(hoTen).toHaveAccessibleDescription('Họ tên cần ít nhất 2 ký tự');\n    expect(sdt).toHaveAccessibleDescription('Số di động Việt Nam gồm 10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09');\n    expect(ngaySinh).toHaveAccessibleDescription('Chọn ngày sinh');\n    expect(lyDo).toHaveAccessibleDescription('Hãy ghi ngắn gọn lý do khám');\n    expect(hoTen).toBeInvalid(); // aria-invalid=\"true\"\n    expect(onGui).not.toHaveBeenCalled();\n    expect(await loiAxe()).toEqual([]); // form đang báo lỗi vẫn phải dùng được bằng trình đọc màn hình\n  });",
  formTouched: "  test('mode onTouched: gõ sai CHƯA báo lỗi; rời ô (Tab) mới báo; sửa đúng thì lỗi biến mất ngay', async () => {\n    const { user, hoTen } = veForm();\n    await user.type(hoTen, 'A');\n    expect(hoTen).not.toHaveAccessibleDescription(); // đang gõ: chưa làm phiền\n    await user.tab(); // rời ô ⇒ \"touched\"\n    expect(await screen.findByText('Họ tên cần ít nhất 2 ký tự')).toBeInTheDocument();\n    await user.click(hoTen);\n    await user.type(hoTen, 'n');\n    // Chương 9: dòng này ĐỎ trước khi sửa FormDatLich — React Compiler giữ lại <p> lỗi cũ (xem Bài 9.1)\n    expect(screen.queryByText('Họ tên cần ít nhất 2 ký tự')).not.toBeInTheDocument();\n    expect(hoTen).toBeValid();\n  });",
  formHaiLoi: "  test('lỗi THỨ HAI trong cùng nhóm benhNhan cũng hiện: rời ô họ tên (sai) rồi rời ô SĐT (trống) ⇒ hai lỗi', async () => {\n    const { user, hoTen, sdt } = veForm();\n    await user.type(hoTen, 'A');\n    await user.tab(); // sang ô SĐT ⇒ họ tên \"touched\" ⇒ lỗi 1\n    await user.tab(); // rời ô SĐT còn trống ⇒ lỗi 2\n    expect(hoTen).toHaveAccessibleDescription('Họ tên cần ít nhất 2 ký tự');\n    // Chương 9: dòng này cũng ĐỎ trước khi sửa — aria-describedby trỏ tới \"sdt-loi\" nhưng thẻ <p> đó chưa từng được vẽ\n    expect(sdt).toHaveAccessibleDescription('Số di động Việt Nam gồm 10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09');\n  });",
  formSach: "  test('dữ liệu hợp lệ ⇒ onGui nhận dữ liệu ĐÃ LÀM SẠCH: trim họ tên, SĐT +84 → 0, bỏ dấu cách', async () => {\n    const { user, onGui, hoTen, sdt, ngaySinh, lyDo, gui } = veForm();\n    await user.type(hoTen, '  Nguyễn Thị Ánh  ');\n    await user.type(sdt, '+84 90 123 4567');\n    await user.type(ngaySinh, '1995-03-14');\n    await user.type(lyDo, 'Ho khan 3 ngày');\n    await user.click(gui);\n    expect(onGui).toHaveBeenCalledTimes(1);\n    expect(onGui).toHaveBeenCalledWith({\n      benhNhan: { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567', ngaySinh: '1995-03-14' },\n      lyDo: 'Ho khan 3 ngày',\n    });",
  formHaiLan: "  test('đang gửi ⇒ nút khoá \"Đang gửi…\"; bấm thêm hai lần vẫn chỉ gửi MỘT lần', async () => {\n    let xong!: () => void;\n    const onGui = vi.fn(() => new Promise<void>((r) => { xong = r; })); // máy chủ \"chưa trả lời\" tới khi ta gọi xong()\n    const { user, hoTen, sdt, ngaySinh, lyDo, gui } = veForm(onGui);\n    await user.type(hoTen, 'Nguyễn Thị Ánh');\n    await user.type(sdt, '0901234567');\n    await user.type(ngaySinh, '1995-03-14');\n    await user.type(lyDo, 'Khám định kỳ');\n    await user.click(gui);\n    expect(gui).toBeDisabled();\n    expect(gui).toHaveTextContent('Đang gửi…');\n    await user.click(gui);\n    await user.click(gui);\n    expect(onGui).toHaveBeenCalledTimes(1);\n    xong();\n    expect(await screen.findByRole('button', { name: 'Gửi yêu cầu' })).toBeEnabled();\n  });",
  formMayChu: "  test('onGui ném lỗi (máy chủ từ chối) ⇒ hộp role=\"alert\" ở đầu form, chữ đã gõ còn nguyên', async () => {\n    const onGui = vi.fn(async () => { throw new Error('Khung giờ này vừa có người đặt'); });\n    const { user, hoTen, sdt, ngaySinh, lyDo, gui } = veForm(onGui);\n    await user.type(hoTen, 'Nguyễn Thị Ánh');\n    await user.type(sdt, '0901234567');\n    await user.type(ngaySinh, '1995-03-14');\n    await user.type(lyDo, 'Khám định kỳ');\n    await user.click(gui);\n    expect(await screen.findByRole('alert')).toHaveTextContent('Khung giờ này vừa có người đặt');\n    expect(hoTen).toHaveValue('Nguyễn Thị Ánh');\n  });",
  formDan: "  test('lý do dán vào 501 ký tự ⇒ \"Lý do tối đa 500 ký tự\"', async () => {\n    const { user, lyDo, gui } = veForm();\n    await user.click(lyDo);\n    await user.paste('a'.repeat(501)); // dán: nhanh hơn gõ 501 phím, và cũng là cách người dùng thật làm\n    await user.click(gui);\n    expect(lyDo).toHaveAccessibleDescription('Lý do tối đa 500 ký tự');\n  });",
  schemaSdt: "describe('benhNhanSchema — số điện thoại', () => {\n  test.each([\n    ['0901234567', '0901234567'],\n    ['090 123 4567', '0901234567'],\n    ['090.123.4567', '0901234567'],\n    ['+84 90 123 4567', '0901234567'],\n    ['0351234567', '0351234567'],\n  ])('\"%s\" hợp lệ ⇒ lưu thành \"%s\"', (vao, ra) => {\n    expect(benhNhanSchema.parse({ ...hopLe, soDienThoai: vao }).soDienThoai).toBe(ra);\n  });\n\n  test.each(['0123456789', '090123456', '09012345678', '1900 1234', 'abc'])('\"%s\" bị từ chối', (vao) => {\n    const kq = benhNhanSchema.safeParse({ ...hopLe, soDienThoai: vao });\n    expect(kq.success).toBe(false);\n  });\n});",
  schemaNgay: "describe('benhNhanSchema — ngày sinh (đồng hồ GIẢ: \"hôm nay\" cố định)', () => {\n  beforeEach(() => {\n    vi.useFakeTimers({ toFake: ['Date'] }); // chỉ giả Date — setTimeout vẫn thật\n    vi.setSystemTime(new Date('2026-09-26T09:00:00+07:00'));\n  });\n  afterEach(() => vi.useRealTimers());\n\n  test('ngày mai ⇒ \"Ngày sinh không được ở tương lai\"', () => {\n    const kq = benhNhanSchema.safeParse({ ...hopLe, ngaySinh: '2026-09-27' });\n    expect(kq.error?.issues.map((i) => i.message)).toEqual(['Ngày sinh không được ở tương lai']);\n  });\n  test('hôm nay (em bé mới sinh) ⇒ hợp lệ', () => {\n    expect(benhNhanSchema.safeParse({ ...hopLe, ngaySinh: '2026-09-26' }).success).toBe(true);\n  });\n  test('121 tuổi ⇒ \"Ngày sinh không hợp lệ\"', () => {\n    const kq = benhNhanSchema.safeParse({ ...hopLe, ngaySinh: '1905-09-25' });\n    expect(kq.error?.issues[0].message).toBe('Ngày sinh không hợp lệ');\n  });\n});",
  axe: "import axe from 'axe-core';\n\n/**\n * Chương 9: chạy axe-core trên một vùng DOM, trả về danh sách lỗi dạng chuỗi ngắn (rỗng = sạch).\n * jsdom không tính bố cục/màu ⇒ tắt luật độ tương phản; phần đó kiểm bằng Chromium thật (Chương 8, do/do-axe.mjs).\n */\nexport async function loiAxe(noi: Element = document.body): Promise<string[]> {\n  const kq = await axe.run(noi, { rules: { 'color-contrast': { enabled: false } } });\n  return kq.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);\n}",
  formCuLoi: "  const e = errors.benhNhan;\n  return (\n    <form className=\"form-dat-lich\" onSubmit={handleSubmit(guiDi)} noValidate aria-label={`Đặt lịch với ${bacSi.ten}`}>\n      …\n      <input id=\"hoTen\" autoComplete=\"name\" aria-invalid={!!e?.hoTen} aria-describedby={e?.hoTen ? 'hoTen-loi' : undefined} {...register('benhNhan.hoTen')} />\n      {e?.hoTen && <p id=\"hoTen-loi\" className=\"loi\">{e.hoTen.message}</p>}",
  bienDich: "  const e = errors.benhNhan;\n  …\n  const t9 = !!e?.hoTen;  // ← tính lại MỖI lần render\n  …\n  if ($[16] !== e) {\n    t13 = e?.hoTen && <p id=\"hoTen-loi\" className=\"loi\">{e.hoTen.message}</p>;\n    $[16] = e;\n    $[17] = t13;\n  } else {",
  formMoiLoi: "  // Chương 9: RHF SỬA object `errors` tại chỗ (xoá lỗi = xoá khoá, object vẫn là object cũ). React Compiler nhớ JSX\n  // theo danh tính object ⇒ `{e.hoTen && <p>…</p>}` không bao giờ vẽ lại, lỗi đứng mãi (test 9.1 bắt được, Chromium\n  // thật cũng thế). Rút ra CHUỖI ngay đầu render: chuỗi so bằng giá trị, compiler thấy nó đổi.\n  const loi = {\n    hoTen: errors.benhNhan?.hoTen?.message,\n    soDienThoai: errors.benhNhan?.soDienThoai?.message,\n    ngaySinh: errors.benhNhan?.ngaySinh?.message,\n    lyDo: errors.lyDo?.message,\n    mayChu: errors.root?.server?.message,\n  };\n  return (\n    …\n      <input id=\"hoTen\" autoComplete=\"name\" aria-invalid={!!loi.hoTen} aria-describedby={loi.hoTen ? 'hoTen-loi' : undefined} {...register('benhNhan.hoTen')} />\n      {loi.hoTen && <p id=\"hoTen-loi\" className=\"loi\">{loi.hoTen}</p>}",
  fireEvent: "test('fireEvent: change + blur, hỏi lỗi NGAY ⇒ chưa có (resolver của Zod trả Promise)', () => {\n  veForm();\n  const o = screen.getByLabelText('Họ và tên');\n  fireEvent.change(o, { target: { value: 'A' } }); // MỘT sự kiện \"change\", gán thẳng value\n  fireEvent.blur(o);\n  const coLoi = screen.queryByText('Họ tên cần ít nhất 2 ký tự') !== null;\n  console.log(`[fireEvent] hỏi ngay: ${coLoi ? 'CÓ' : 'KHÔNG có'} lỗi`);\n  expect(coLoi).toBe(false);\n});\n\ntest('user-event: type + tab ⇒ lỗi có ngay sau await (user-event tự đợi một nhịp sau mỗi thao tác)', async () => {\n  const user = userEvent.setup();\n  veForm();\n  await user.type(screen.getByLabelText('Họ và tên'), 'A');\n  await user.tab();\n  const coLoi = screen.queryByText('Họ tên cần ít nhất 2 ký tự') !== null;\n  console.log(`[user-event] sau await: ${coLoi ? 'CÓ' : 'KHÔNG có'} lỗi`);\n  expect(coLoi).toBe(true);\n});",
  axeThu: "test('axe: ô chỉ có placeholder thì QUA axe, nhưng getByLabelText không tìm được; ô trơn và nút chỉ có biểu tượng thì axe bắt', async () => {\n  const { container } = render(\n    <form>\n      <input id=\"sdt\" placeholder=\"Số điện thoại\" />\n      <input id=\"ghi-chu\" />\n      <button type=\"button\">\n        <span aria-hidden=\"true\">♡</span>\n      </button>\n    </form>,\n  );\n  const loi = await loiAxe(container);\n  console.log('[axe]', loi);\n  console.log('[getByLabelText]', screen.queryByLabelText('Số điện thoại') === null ? 'không tìm thấy ô \"Số điện thoại\"' : 'thấy');\n  expect(loi).toEqual(['button-name: button', 'label: #ghi-chu']);\n});",
  sai1: "test('SAI 1 — tên nút gõ sai một chữ: Testing Library in ra mọi vai trò đang có', () => {\n  render(<TheBacSi bacSi={bsHa} onDoiYeuThich={vi.fn()} />);\n  screen.getByRole('button', { name: 'Yêu thích BS. Trần Thu Hoa' });\n});",
  sai2: "test('SAI 2 — kiểm \"không có\" bằng getBy: getBy NÉM lỗi trước khi expect kịp chạy', () => {\n  render(<TheBacSi bacSi={bsHa} />);\n  expect(screen.getByText('Bác sĩ lâu năm')).not.toBeInTheDocument();\n});",
  sai3: "test('SAI 3 — quên await user.click: kiểm trước khi cú bấm xong', () => {\n  const user = userEvent.setup();\n  const onDoi = vi.fn();\n  render(<TheBacSi bacSi={bsHa} onDoiYeuThich={onDoi} />);\n  void user.click(screen.getByRole('button', { name: /Yêu thích/ })); // thiếu await\n  expect(onDoi).toHaveBeenCalledTimes(1);\n});",
  veKhu: "const veKhu = (url = '/bac-si') => renderVoiRouter(<KhuBacSi />, url);",
  khuTai: "  test('đang tải ⇒ khung xương aria-busy; dữ liệu về ⇒ khung xương biến mất, 6 thẻ', async () => {\n    veKhu();\n    const khung = screen.getByRole('region', { name: 'Đang tải danh sách bác sĩ' }); // có NGAY, không cần đợi\n    expect(khung).toHaveAttribute('aria-busy', 'true');\n    await waitForElementToBeRemoved(khung);\n    expect(screen.getAllByRole('article')).toHaveLength(6);\n    expect(screen.getByRole('heading', { name: 'Đội ngũ bác sĩ (6)' })).toBeInTheDocument();\n  });",
  khuRong: "  test('máy chủ trả mảng rỗng ⇒ câu báo \"chưa có bác sĩ\", không có thẻ nào', async () => {\n    server.use(http.get('/api/bac-si', () => HttpResponse.json([])));\n    veKhu();\n    expect(await screen.findByText('Phòng khám chưa có bác sĩ nào nhận lịch.')).toBeInTheDocument();\n    expect(screen.queryAllByRole('article')).toHaveLength(0);\n  });",
  khu500: "  test('500 ⇒ hộp lỗi nói lời máy chủ; bấm \"Thử lại\" (lần hai máy chủ ổn) ⇒ 6 thẻ', async () => {\n    const user = userEvent.setup();\n    server.use(http.get('/api/bac-si', () => HttpResponse.json({ loi: 'Máy chủ đang bận, thử lại sau' }, { status: 500 }), { once: true }));\n    veKhu();\n    const hop = await screen.findByRole('alert');\n    expect(hop).toHaveTextContent('Không tải được danh sách bác sĩ');\n    expect(hop).toHaveTextContent('Máy chủ đang bận, thử lại sau');\n    await user.click(within(hop).getByRole('button', { name: 'Thử lại' }));\n    expect(await screen.findAllByRole('article')).toHaveLength(6);\n    expect(screen.queryByRole('alert')).not.toBeInTheDocument();\n  });",
  khuMatMang: "  test('mất mạng (fetch ném TypeError) ⇒ câu \"Không kết nối được máy chủ\", không lộ chữ \"Failed to fetch\"', async () => {\n    server.use(http.get('/api/bac-si', () => HttpResponse.error()));\n    veKhu();\n    const hop = await screen.findByRole('alert');\n    expect(hop).toHaveTextContent('Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.');\n    expect(hop).not.toHaveTextContent(/fetch/i);\n  });",
  khuBangCu: "  test('đang có danh sách, lần làm mới hỏng ⇒ GIỮ danh sách cũ + dòng báo \"đang hiện bản đã tải\"', async () => {\n    const { queryClient } = veKhu();\n    expect(await screen.findAllByRole('article')).toHaveLength(6);\n    server.use(http.get('/api/bac-si', () => HttpResponse.json({ loi: 'bận' }, { status: 503 })));\n    await act(() => queryClient.refetchQueries({ queryKey: ['bac-si'] }));\n    expect(await screen.findByRole('status')).toHaveTextContent('Không làm mới được danh sách — đang hiện bản đã tải lúc trước.');\n    expect(screen.getAllByRole('article')).toHaveLength(6);\n  });",
  khuCham: "  test('chậm 300 ms: findBy mặc định đợi tới 1000 ms nên vẫn thấy', async () => {\n    server.use(http.get('/api/bac-si', async () => { await delay(300); return HttpResponse.json([]); }));\n    veKhu();\n    expect(await screen.findByText('Phòng khám chưa có bác sĩ nào nhận lịch.')).toBeInTheDocument();\n  });",
  datLichDien: "const URL_1400 = '/dat-lich/bs-2-2026-10-01-1400?bacSi=bs-2&ngay=2026-10-01';\n\nbeforeEach(() => {\n  useDangNhapStore.setState({ nguoiDung: { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567' } });\n});\n\nasync function dienVaGui(soDienThoai: string) {\n  const user = userEvent.setup();\n  veTrang(URL_1400);\n  await screen.findByRole('heading', { name: 'Đặt lịch khám' }); // trang lazy + 2 request: phải ĐỢI\n  await user.type(screen.getByLabelText('Họ và tên'), 'Nguyễn Thị Ánh');\n  await user.type(screen.getByLabelText('Số điện thoại'), soDienThoai);\n  await user.type(screen.getByLabelText('Ngày sinh'), '1995-03-14');\n  await user.type(screen.getByLabelText('Lý do khám'), 'Bé ho khan 3 ngày');\n  await user.click(screen.getByRole('button', { name: 'Xác nhận đặt lịch' }));\n}",
  datLich409: "  test('SĐT đang có lịch chờ ⇒ hộp alert đầu form, VẪN ở trang đặt lịch, không tạo lịch hẹn', async () => {\n    await dienVaGui('0999999999'); // máy chủ giả trả 409 cho số này\n    expect(await screen.findByRole('alert')).toHaveTextContent('Số điện thoại này đang có một lịch chờ xác nhận');\n    expect(screen.getByRole('heading', { name: 'Đặt lịch khám' })).toBeInTheDocument();\n    expect(db.lichHen()).toHaveLength(0);\n  });",
  datLichNguoiKhac: "  test('người khác vừa đặt mất khung giờ ⇒ 409 ⇒ lưới giờ tải lại ⇒ trang đổi sang \"đã có người đặt\" + link chọn giờ khác', async () => {\n    const user = userEvent.setup();\n    veTrang(URL_1400);\n    await screen.findByRole('heading', { name: 'Đặt lịch khám' });\n    // \"người khác\" đặt ngay lúc ta đang điền form: sửa thẳng cơ sở dữ liệu giả\n    khungGioTrongNgay('bs-2', '2026-10-01').find((kg) => kg.id === 'bs-2-2026-10-01-1400')!.conTrong = false;\n    await user.type(screen.getByLabelText('Họ và tên'), 'Nguyễn Thị Ánh');\n    await user.type(screen.getByLabelText('Số điện thoại'), '0901234567');\n    await user.type(screen.getByLabelText('Ngày sinh'), '1995-03-14');\n    await user.type(screen.getByLabelText('Lý do khám'), 'Khám định kỳ');\n    await user.click(screen.getByRole('button', { name: 'Xác nhận đặt lịch' }));\n    expect(await screen.findByRole('heading', { name: 'Khung giờ 14:00 · 01/10/2026 đã có người đặt' })).toBeInTheDocument();\n    expect(screen.getByRole('link', { name: '← Chọn giờ khác' })).toHaveAttribute('href', '/bac-si/bs-2?ngay=2026-10-01');\n  });",
  setup: "import '@testing-library/jest-dom/vitest';\nimport { cleanup } from '@testing-library/react';\nimport { afterAll, afterEach, beforeAll } from 'vitest';\n// Chương 9: import THẲNG file store, không qua \"cửa\" '@/features/…'. Cửa kéo theo cả tính năng (KhuBacSi → useBacSi →\n// api thật) NGAY lúc setup chạy, TRƯỚC vi.mock của file test ⇒ vi.mock('@/shared/api/phong-kham') mất tác dụng (đo thật, Bài 9.4).\nimport { useDangNhapStore } from '@/features/dang-nhap/dang-nhap-store';\nimport { useDatLichStore } from '@/features/bac-si/dat-lich-store';\nimport { datLaiDuLieu } from '@/mocks/co-so-du-lieu';\nimport { server } from '@/mocks/node';\nimport { useThongBaoStore } from '@/shared/store/thong-bao-store';\n\n// Chương 9: bật \"môi trường act\" cho React. Testing Library chỉ TỰ bật cờ này khi thấy beforeAll/afterAll TOÀN CỤC\n// (Jest, hay Vitest với globals: true). Dự án này globals: false ⇒ cờ = undefined ⇒ React KHÔNG BAO GIỜ cảnh báo\n// \"not wrapped in act(...)\" — cập nhật lọt ra ngoài act trôi qua trong im lặng (đo thật, Bài 9.2).\n(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;\n\n// Chương 9: jsdom không cuộn trang ⇒ <ScrollRestoration> của Router gọi window.scrollTo và jsdom in\n// \"Not implemented: Window's scrollTo() method\" — 61 dòng rác mỗi lần chạy, che mất cảnh báo thật. Thay bằng hàm rỗng.\nwindow.scrollTo = (() => {}) as typeof window.scrollTo;\n\n// Chương 6: API giả chạy suốt bộ test. Request nào KHÔNG có handler ⇒ test hỏng ngay (đỡ gọi nhầm ra mạng thật).\nbeforeAll(() => server.listen({ onUnhandledRequest: 'error' }));\nafterAll(() => server.close());\n\n// Vitest mặc định globals: false ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.\nafterEach(() => {\n  cleanup();\n  server.resetHandlers(); // bỏ các handler một test tự thêm bằng server.use(...)\n  datLaiDuLieu(); // \"cơ sở dữ liệu\" giả về như mới\n  // Chương 5: những thứ sống NGOÀI component nên cleanup() không dọn — test trước để lại là test sau thấy.\n  window.history.replaceState(null, '', '/');\n  useDatLichStore.setState(useDatLichStore.getInitialState(), true);\n  useDangNhapStore.setState(useDangNhapStore.getInitialState(), true); // Chương 7: đăng nhập giả\n  useThongBaoStore.setState(useThongBaoStore.getInitialState(), true);\n  localStorage.clear(); // bản lưu của persist — xoá SAU cùng: setState ở trên lại ghi xuống localStorage\n});",
  handlerBacSi: "  http.get('/api/bac-si', async () => {\n    await treMang();\n    if (dieuKhien.loi.has('bac-si')) return loi500();\n    return HttpResponse.json(dieuKhien.rong ? [] : db.bacSi());\n  }),",
  taoClientTest: "/** QueryClient MỚI cho MỖI test: cache không rò từ test này sang test khác. Không thử lại (test lỗi khỏi đợi 7 giây). */\nexport function taoClientTest(): QueryClient {\n  const qc = taoQueryClient();\n  qc.setDefaultOptions({ queries: { retry: false, gcTime: Infinity } });\n  return qc;\n}",
  actNgoai: "test('đổi store NGOÀI act() khi component đang hiện ⇒ React cảnh báo \"not wrapped in act(...)\"', () => {\n  const loi = vi.spyOn(console, 'error').mockImplementation(() => {});\n  render(<VungThongBao />);\n  useThongBaoStore.getState().hien('Đã lưu lịch hẹn', 'thanh-cong'); // setState của Zustand ⇒ VungThongBao vẽ lại, ngoài act\n  const canhBao = loi.mock.calls.map((c) => String(c[0]));\n  console.log('[ngoài act]', canhBao.length, 'lần console.error ·', canhBao[0]?.split('\\n')[0]);\n  expect(canhBao[0]).toMatch(/not wrapped in act/);\n  loi.mockRestore();\n});",
  actTrong: "test('cùng việc đó trong act() ⇒ không cảnh báo, DOM đã cập nhật ngay sau act', () => {\n  const loi = vi.spyOn(console, 'error');\n  render(<VungThongBao />);\n  act(() => useThongBaoStore.getState().hien('Đã lưu lịch hẹn', 'thanh-cong'));\n  expect(screen.getByText('Đã lưu lịch hẹn')).toBeInTheDocument();\n  console.log('[trong act]', loi.mock.calls.length, 'lần console.error');\n  expect(loi).not.toHaveBeenCalled();\n  loi.mockRestore();\n});",
  dongHoGia: "test('đồng hồ giả + user-event: shouldAdvanceTime + advanceTimers ⇒ bấm được; tua 5 giây ⇒ thông báo tự ẩn', async () => {\n  // shouldAdvanceTime: đồng hồ giả vẫn nhích theo giờ thật ⇒ setTimeout(0) mà Testing Library tự đặt sau MỖI thao tác\n  // của user-event (nó chỉ biết tự tua đồng hồ giả của JEST) vẫn tới lượt chạy. Thiếu nó: cú bấm đứng im (bai2.sai.tsx).\n  vi.useFakeTimers({ shouldAdvanceTime: true });\n  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime }); // user-event tự tua khi nó cần chờ\n  render(<VungThongBao />);\n  act(() => {\n    useThongBaoStore.getState().hien('Thông báo A');\n    useThongBaoStore.getState().hien('Thông báo B');\n  });\n  await user.click(screen.getAllByRole('button', { name: 'Đóng thông báo' })[0]); // đóng A bằng tay\n  expect(screen.queryByText('Thông báo A')).not.toBeInTheDocument();\n  expect(screen.getByText('Thông báo B')).toBeInTheDocument();\n  act(() => vi.advanceTimersByTime(4900));\n  expect(screen.getByText('Thông báo B')).toBeInTheDocument(); // 4,9 giây: còn\n  act(() => vi.advanceTimersByTime(100));\n  expect(screen.queryByText('Thông báo B')).not.toBeInTheDocument(); // 5 giây: ẩn — mà test chạy trong vài chục ms\n});",
  dongHoGiaFire: "test('đồng hồ giả + fireEvent (không qua asyncWrapper) ⇒ không cần shouldAdvanceTime', () => {\n  vi.useFakeTimers();\n  render(<VungThongBao />);\n  act(() => useThongBaoStore.getState().hien('Thông báo C'));\n  fireEvent.click(screen.getByRole('button', { name: 'Đóng thông báo' }));\n  expect(screen.queryByText('Thông báo C')).not.toBeInTheDocument();\n});",
  saiGetBy: "test('SAI 1 — getBy ngay sau render: dữ liệu chưa về', () => {\n  renderVoiRouter(<KhuBacSi />, '/bac-si');\n  expect(screen.getAllByRole('article')).toHaveLength(6);\n});",
  saiCham: "test('SAI 2 — API chậm 1500 ms, findBy chỉ đợi 1000 ms', async () => {\n  server.use(http.get('/api/bac-si', async () => { await delay(1500); return HttpResponse.json([]); }));\n  renderVoiRouter(<KhuBacSi />, '/bac-si');\n  expect(await screen.findByText('Phòng khám chưa có bác sĩ nào nhận lịch.')).toBeInTheDocument();\n});",
  saiThuLai: "test('CHẬM 4 — QueryClient của app (thử lại 3 lần) trong test: lỗi 500 mất bao lâu mới hiện?', async () => {\n  server.use(http.get('/api/bac-si', () => HttpResponse.json({ loi: 'bận' }, { status: 500 })));\n  const batDau = performance.now();\n  renderVoiRouter(<KhuBacSi />, '/bac-si', taoQueryClient()); // client của APP, không phải taoClientTest()\n  await screen.findByRole('alert', {}, { timeout: 15000 });\n  console.log(`[client của app] hộp lỗi hiện sau ${Math.round(performance.now() - batDau)} ms`);\n  const batDau2 = performance.now();\n  renderVoiRouter(<KhuBacSi />, '/bac-si', taoClientTest());\n  await screen.findAllByRole('alert');\n  console.log(`[taoClientTest] hộp lỗi hiện sau ${Math.round(performance.now() - batDau2)} ms`);\n}, 20000);",
  saiDongHo: "test('SAI 5 — đồng hồ giả của Vitest + user-event (ĐÃ có advanceTimers như tài liệu dặn): cú bấm đứng im tới hết giờ', async () => {\n  vi.useFakeTimers(); // thiếu { shouldAdvanceTime: true }\n  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });\n  render(<VungThongBao />);\n  act(() => useThongBaoStore.getState().hien('Thông báo A'));\n  await user.click(screen.getByRole('button', { name: 'Đóng thông báo' }));\n  expect(screen.queryByText('Thông báo A')).not.toBeInTheDocument();\n});",
  saiThuTu: "// SAI 6 — hai test dùng CHUNG một QueryClient khai ở ngoài: chạy riêng thì xanh, chạy cả file thì đỏ\nconst clientChung = taoClientTest();\ntest('SAI 6a — máy chủ trả rỗng', async () => {\n  server.use(http.get('/api/bac-si', () => HttpResponse.json([])));\n  renderVoiRouter(<KhuBacSi />, '/bac-si', clientChung);\n  expect(await screen.findByText('Phòng khám chưa có bác sĩ nào nhận lịch.')).toBeInTheDocument();\n});\ntest('SAI 6b — mặc định có 6 bác sĩ', async () => {",
  saiSuspense: "test('SAI 7 — trang có use()/Suspense vẽ bằng veTrang (act ĐỒNG BỘ) thay vì veTrangCho', async () => {\n  veTrang('/bac-si/bs-2');\n  expect(await screen.findByRole('heading', { level: 2, name: 'BS. Trần Thu Hà' }, { timeout: 1500 })).toBeInTheDocument();\n});",
  veTrangCho: "export async function veTrangCho(url: string, queryClient = taoClientTest()) {\n  let kq!: ReturnType<typeof veTrang>;\n  await act(async () => {\n    kq = veTrang(url, queryClient);\n  });\n  return kq;\n}",
  rtlAsyncWrapper: "  asyncWrapper: async cb => {\n    const previousActEnvironment = (0, _actCompat.getIsReactActEnvironment)();\n    (0, _actCompat.setReactActEnvironment)(false);\n    try {\n      const result = await cb();\n      // Drain microtask queue.\n      // Otherwise we'll restore the previous act() environment, before we resolve the `waitFor` call.\n      // The caller would have no chance to wrap the in-flight Promises in `act()`\n      await new Promise(resolve => {\n        setTimeout(() => {\n          resolve();\n        }, 0);",
  rtlTuBat: "  if (typeof beforeAll === 'function' && typeof afterAll === 'function') {\n    // This matches the behavior of React < 18.\n    let previousIsReactActEnvironment = (0, _actCompat.getIsReactActEnvironment)();\n    beforeAll(() => {\n      previousIsReactActEnvironment = (0, _actCompat.getIsReactActEnvironment)();\n      (0, _actCompat.setReactActEnvironment)(true);\n    });\n    afterAll(() => {\n      (0, _actCompat.setReactActEnvironment)(previousIsReactActEnvironment);\n    });\n  }",
  tieuDeTest: "test('đặt tiêu đề khi hiện; đổi tham số ⇒ đổi tiêu đề; gỡ ⇒ trả lại tiêu đề TRƯỚC khi hook chạy', () => {\n  const { rerender, unmount } = renderHook(({ tieuDe }) => useTieuDeTrang(tieuDe), {\n    initialProps: { tieuDe: 'BS. Trần Thu Hà · Phòng khám An Tâm' },\n  });\n  expect(document.title).toBe('BS. Trần Thu Hà · Phòng khám An Tâm');\n  rerender({ tieuDe: 'BS. Vũ Thảo Vy · Phòng khám An Tâm' });\n  expect(document.title).toBe('BS. Vũ Thảo Vy · Phòng khám An Tâm');\n  unmount();\n  expect(document.title).toBe('Phòng khám An Tâm');\n});",
  tieuDeHook: "import { useEffect } from 'react';\n\n/** Đặt document.title khi component đang hiện; gỡ component thì trả lại tiêu đề cũ. */\nexport function useTieuDeTrang(tieuDe: string) {\n  useEffect(() => {\n    const tieuDeCu = document.title;\n    document.title = tieuDe;\n    return () => {\n      document.title = tieuDeCu;\n    };\n  }, [tieuDe]);\n}",
  taoWrapper: "/**\n * Chương 9: \"wrapper\" cho renderHook — bọc hook cần ngữ cảnh (QueryClient, router) giống cách app bọc component.\n *   const { wrapper, queryClient } = taoWrapper({ url: '/bac-si?ck=nhi' });\n *   renderHook(() => useBoLocUrl(), { wrapper });\n * MemoryRouter (không phải createMemoryRouter): hook không cần bảng route, chỉ cần \"đang ở URL nào\".\n */\nexport function taoWrapper({ url = '/', queryClient = taoClientTest() }: { url?: string; queryClient?: QueryClient } = {}) {\n  function wrapper({ children }: { children: ReactNode }) {\n    return (\n      <QueryClientProvider client={queryClient}>\n        <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>\n      </QueryClientProvider>\n    );\n  }\n  return { wrapper, queryClient };\n}",
  boLocVeHook: "function veHook(url: string) {\n  // Gọi THÊM useLocation/useNavigationType trong cùng callback để nhìn được URL mà hook vừa ghi\n  return renderHook(() => ({ boLoc: useBoLocUrl(), loc: useLocation(), kieu: useNavigationType() }), taoWrapper({ url }));\n}",
  boLocPush: "  test('datBoLoc chuyên khoa ⇒ PUSH ?ck=da-lieu, GIỮ từ khoá đang có', () => {\n    const { result } = veHook('/bac-si?q=bao');\n    act(() => result.current.boLoc[1]({ chuyenKhoa: 'da-lieu' }));\n    expect(result.current.loc.search).toBe('?ck=da-lieu&q=bao');\n    expect(result.current.kieu).toBe('PUSH');\n    expect(result.current.boLoc[0]).toEqual({ chuyenKhoa: 'da-lieu', tuKhoa: 'bao' });\n  });",
  boLocBay: "  test('URL gõ bậy (?ck=tim-mach, q dài 80 ký tự) ⇒ về mặc định / cắt còn 50', () => {\n    const { result } = veHook(`/bac-si?ck=tim-mach&q=${'a'.repeat(80)}`);\n    expect(result.current.boLoc[0].chuyenKhoa).toBe('tat-ca');\n    expect(result.current.boLoc[0].tuKhoa).toHaveLength(50);\n  });",
  kgDemRequest: "const soRequest: string[] = [];\nserver.events.on('request:start', ({ request }) => {\n  if (request.url.includes('/khung-gio')) soRequest.push(new URL(request.url).pathname + new URL(request.url).search);\n});\nafterEach(() => { soRequest.length = 0; });",
  kgThanhCong: "  test('bs-2 ngày 01/10 ⇒ pending rồi success, 4 khung giờ, MỘT request', async () => {\n    const { result } = renderHook(() => useKhungGio('bs-2', '2026-10-01'), taoWrapper());\n    expect(result.current.isPending).toBe(true);\n    await waitFor(() => expect(result.current.isSuccess).toBe(true));\n    expect(result.current.data).toHaveLength(4);\n    expect(result.current.data?.[0]).toMatchObject({ id: 'bs-2-2026-10-01-0800', bacSiId: 'bs-2', batDau: '2026-10-01T08:00:00+07:00' });\n    expect(soRequest).toEqual(['/api/bac-si/bs-2/khung-gio?ngay=2026-10-01']);\n  });",
  kgEnabled: "  test('chưa chọn bác sĩ (null) ⇒ KHÔNG gọi API (enabled: false), fetchStatus \"idle\"', async () => {\n    const { result } = renderHook(() => useKhungGio(null, '2026-10-01'), taoWrapper());\n    await new Promise((r) => setTimeout(r, 50)); // cho nó cơ hội gọi — nếu có\n    expect(result.current.fetchStatus).toBe('idle');\n    expect(result.current.isPending).toBe(true);\n    expect(soRequest).toEqual([]);\n  });",
  kgPlaceholder: "  test('đổi ngày ⇒ GIỮ lưới ngày cũ (isPlaceholderData) trong lúc tải, rồi thay bằng ngày mới', async () => {\n    server.use(http.get('/api/bac-si/:id/khung-gio', async ({ request }) => {\n      const ngay = new URL(request.url).searchParams.get('ngay');\n      if (ngay === '2026-10-02') await delay(100);\n      return HttpResponse.json([{ id: `kg-${ngay}`, bacSiId: 'bs-2', batDau: `${ngay}T08:00:00+07:00`, conTrong: true }]);\n    }));\n    const { result, rerender } = renderHook(({ ngay }) => useKhungGio('bs-2', ngay), {\n      ...taoWrapper(),\n      initialProps: { ngay: '2026-10-01' },\n    });",
  kg404: "  test('bác sĩ không tồn tại ⇒ isError, LoiApi 404; client CỦA APP (có thử lại) cũng KHÔNG thử lại lỗi 4xx', async () => {\n    const { result } = renderHook(() => useKhungGio('bs-99', '2026-10-01'), taoWrapper({ queryClient: taoQueryClient() }));\n    await waitFor(() => expect(result.current.isError).toBe(true));\n    expect(result.current.error).toMatchObject({ name: 'LoiApi', status: 404, message: 'Không có bác sĩ này' });\n    expect(soRequest).toHaveLength(1);\n  });",
  useKhungGio: "export function useKhungGio(bacSiId: string | null, ngay: string) {\n  return useQuery({\n    queryKey: khoa.khungGio(bacSiId ?? '', ngay),\n    queryFn: ({ signal }) => api.khungGio(bacSiId!, ngay, signal), // ! : enabled bảo đảm bacSiId không null ở đây\n    enabled: bacSiId !== null,\n    staleTime: 30_000,\n    placeholderData: keepPreviousData,\n  });\n}",
  datLichChuanBi: "// Máy chủ giả sinh khung giờ LƯỜI (lần đầu có người GET …/khung-gio). Test hook đứng riêng, không có trang nào GET trước\n// ⇒ phải tự chuẩn bị, không thì POST nhận 404 \"Không có khung giờ này\" (đo thật lần chạy đầu).\nbeforeEach(() => {\n  khungGioTrongNgay('bs-2', '2026-10-01');\n});",
  datLichOk: "  test('thành công ⇒ trả lịch hẹn lh-1 \"chờ xác nhận\"; làm cũ khung giờ của bs-2 VÀ danh sách lịch hẹn', async () => {\n    const { wrapper, queryClient } = taoWrapper();\n    const lamCu = vi.spyOn(queryClient, 'invalidateQueries');\n    const { result } = renderHook(() => useDatLich(), { wrapper });\n    let lichHen;\n    await act(async () => {\n      lichHen = await result.current.mutateAsync(yeuCau());\n    });",
  datLich409Hook: "  test('409 ⇒ mutateAsync NÉM LoiApi (form bắt được), isError; VẪN làm cũ khung giờ (onSettled)', async () => {\n    const { wrapper, queryClient } = taoWrapper();\n    const lamCu = vi.spyOn(queryClient, 'invalidateQueries');\n    const { result } = renderHook(() => useDatLich(), { wrapper });\n    await act(async () => {\n      await expect(result.current.mutateAsync(yeuCau('0999999999'))).rejects.toMatchObject({\n        name: 'LoiApi',\n        status: 409,\n        message: 'Số điện thoại này đang có một lịch chờ xác nhận',\n      });",
  storeTest: "beforeEach(() => vi.useFakeTimers());\nafterEach(() => vi.useRealTimers());\n\nconst noiDung = () => useThongBaoStore.getState().ds.map((t) => t.noiDung);\n\ntest('hien() thêm vào cuối, mặc định loại \"loi\"; an(id) bỏ đúng cái đó', () => {\n  const { hien, an } = useThongBaoStore.getState();\n  hien('Không huỷ được lịch hẹn');\n  hien('Đã lưu', 'thanh-cong');\n  expect(useThongBaoStore.getState().ds.map((t) => t.loai)).toEqual(['loi', 'thanh-cong']);\n  an(useThongBaoStore.getState().ds[0].id);\n  expect(noiDung()).toEqual(['Đã lưu']);\n});\n\ntest('mỗi thông báo tự ẩn SAU ĐÚNG 5 giây, tính từ lúc nó hiện', () => {\n  const { hien } = useThongBaoStore.getState();\n  hien('A');\n  vi.advanceTimersByTime(3000);\n  hien('B');\n  vi.advanceTimersByTime(1999);\n  expect(noiDung()).toEqual(['A', 'B']); // A mới 4,999 giây\n  vi.advanceTimersByTime(1);\n  expect(noiDung()).toEqual(['B']); // A đủ 5 giây\n  vi.advanceTimersByTime(3000);\n  expect(noiDung()).toEqual([]); // B đủ 5 giây\n});",
  queryClientTest: "test.each([\n  [0, new LoiApi(404, 'Không có'), false],\n  [0, new LoiApi(409, 'Trùng'), false],\n  [0, new LoiApi(500, 'Bận'), true],\n  [2, new LoiApi(503, 'Bận'), true],\n  [3, new LoiApi(503, 'Bận'), false],\n  [0, new TypeError('Failed to fetch'), true],\n])('đã hỏng %i lần, lỗi %s ⇒ thử lại: %s', (soLan, loi, ketQua) => {\n  expect(nenThuLai(soLan, loi)).toBe(ketQua);\n});",
  saiWrapper: "test('SAI 1 — hook cần router mà renderHook không có wrapper', () => {\n  renderHook(() => useBoLocUrl());\n});\n\ntest('SAI 2 — hook TanStack mà không có QueryClientProvider', () => {\n  renderHook(() => useKhungGio('bs-2', '2026-10-01'));\n});",
  saiStale: "test('SAI 3 — tách data ra khỏi result.current NGAY từ đầu: giữ mãi giá trị của lần render đầu', async () => {\n  const { result } = renderHook(() => useKhungGio('bs-2', '2026-10-01'), taoWrapper());\n  const { data, isSuccess } = result.current; // ảnh chụp của LẦN RENDER ĐẦU\n  await waitFor(() => expect(isSuccess).toBe(true), { timeout: 500 });\n  expect(data).toHaveLength(4);\n});",
  viteCoverage: "    // Chương 9: đo độ phủ (coverage) — `npm run test:cov`. Mặc định Vitest chỉ tính file mà test CÓ import ⇒ file\n    // không test nào đụng tới thì vô hình (không phải 0%). include liệt kê hết src/ để chúng hiện ra.\n    coverage: {\n      provider: 'v8',\n      include: ['src/**/*.{ts,tsx}'],\n      exclude: ['src/**/*.test.{ts,tsx}', 'src/vi-du/**', 'src/test/**', 'src/mocks/**', 'src/shared/dev/**', 'src/main.tsx'],\n      reporter: ['text', 'html'],\n      // Sàn, không phải đích: tụt dưới là CI đỏ. Nhánh để thấp hơn vì React Compiler thêm nhánh \"cache trúng\" vào MỌI\n      // component (1003 nhánh thay vì 330 — đo thật, Bài 9.4) mà test không chạm hết được.\n      thresholds: { lines: 90, functions: 90, statements: 85, branches: 75 },\n    },",
  scriptCov: "\"scripts\": {\n  …\n  \"test\": \"vitest\",\n  \"test:cov\": \"vitest run --coverage\",\n  …\n}",
  viMock: "vi.mock('@/shared/api/phong-kham', () => ({ api: { danhSachBacSi: vi.fn() } }));\n\ntest('vi.mock: có dữ liệu ⇒ 6 thẻ', async () => {\n  vi.mocked(api.danhSachBacSi).mockResolvedValue(danhSachBacSi);\n  renderVoiRouter(<KhuBacSi />, '/bac-si');\n  expect(await screen.findAllByRole('article')).toHaveLength(6);\n  expect(api.danhSachBacSi).toHaveBeenCalledTimes(1); // component gọi ĐÚNG hàm giả — không phải api thật\n});\n\ntest('vi.mock: lỗi 500 ⇒ hộp lỗi — nhưng LoiApi do CHÍNH TEST tạo ra, không phải goiApi', async () => {\n  vi.mocked(api.danhSachBacSi).mockRejectedValue(new LoiApi(500, 'Máy chủ đang bận, thử lại sau'));\n  renderVoiRouter(<KhuBacSi />, '/bac-si');\n  expect(within(await screen.findByRole('alert')).getByText('Máy chủ đang bận, thử lại sau')).toBeInTheDocument();\n});",
  setupImport: "// Chương 9: import THẲNG file store, không qua \"cửa\" '@/features/…'. Cửa kéo theo cả tính năng (KhuBacSi → useBacSi →\n// api thật) NGAY lúc setup chạy, TRƯỚC vi.mock của file test ⇒ vi.mock('@/shared/api/phong-kham') mất tác dụng (đo thật, Bài 9.4).\nimport { useDangNhapStore } from '@/features/dang-nhap/dang-nhap-store';\nimport { useDatLichStore } from '@/features/bac-si/dat-lich-store';",
  goiApi: "export async function goiApi<T>(duongDan: string, init?: RequestInit): Promise<T> {\n  const res = await fetch(duongDan, init);\n  if (!res.ok) {\n    const than = (await res.json().catch(() => null)) as { loi?: string } | null;\n    throw new LoiApi(res.status, than?.loi ?? `HTTP ${res.status}`);\n  }\n  return (await res.json()) as T;\n}",
  dotBien: "  'trim-ho-ten': ['src/features/dat-lich/schema.ts', \".string()\\n    .trim()\\n    .normalize('NFC')\\n    .min(2,\", \".string()\\n    .normalize('NFC')\\n    .min(2,\", 'src/features/dat-lich'],\n  'bo-disabled': ['src/features/dat-lich/FormDatLich.tsx', ' disabled={isSubmitting}', '', 'src/features/dat-lich/FormDatLich.test.tsx'],\n  // … thêm 10 đột biến nữa\n};",
};

/* ─── Output THẬT (Vitest 5.0.2, reporter default) — chép nguyên văn, chỉ rút bớt dòng ─── */
const OUT = {
  theBacSi: "$ npx vitest run src/features/bac-si/components/TheBacSi.test.tsx --reporter=verbose\n\n RUN  v5.0.2 ~/phong-kham\n ✓ src/features/bac-si/components/TheBacSi.test.tsx > TheBacSi > hiện tên, chuyên khoa, số năm kinh nghiệm 75ms\n ✓ src/features/bac-si/components/TheBacSi.test.tsx > TheBacSi > noiBat ⇒ nhãn \"Bác sĩ lâu năm\"; không noiBat ⇒ không có (luật ≥ 15 năm nằm ở DanhSachBacSi) 7ms\n ✓ src/features/bac-si/components/TheBacSi.test.tsx > TheBacSi > bấm ♡ ⇒ gọi onDoiYeuThich với đúng id; nút báo trạng thái bằng aria-pressed 20ms\n ✓ src/features/bac-si/components/TheBacSi.test.tsx > TheBacSi > không truyền onDoiYeuThich ⇒ không có nút ♡ 2ms\n Test Files  1 passed (1)\n      Tests  4 passed (4)",
  form: "$ npx vitest run src/features/dat-lich/FormDatLich.test.tsx src/features/dat-lich/schema.test.ts --reporter=verbose\n ✓ schema > benhNhanSchema — số điện thoại > \"+84 90 123 4567\" hợp lệ ⇒ lưu thành \"0901234567\" 0ms\n ✓ schema > benhNhanSchema — số điện thoại > \"0123456789\" bị từ chối 1ms\n ✓ schema > benhNhanSchema — họ tên > gõ bằng bộ gõ tổ hợp (NFD) ⇒ lưu NFC — cùng một chuỗi với bản dựng sẵn 1ms\n ✓ schema > benhNhanSchema — ngày sinh (đồng hồ GIẢ: \"hôm nay\" cố định) > ngày mai ⇒ \"Ngày sinh không được ở tương lai\" 2ms\n …(13 test schema khác)\n ✓ FormDatLich > bấm gửi khi form trống ⇒ lỗi dưới cả 4 ô, ô đánh dấu invalid, onGui KHÔNG được gọi 157ms\n ✓ FormDatLich > mode onTouched: gõ sai CHƯA báo lỗi; rời ô (Tab) mới báo; sửa đúng thì lỗi biến mất ngay 52ms\n ✓ FormDatLich > lỗi THỨ HAI trong cùng nhóm benhNhan cũng hiện: rời ô họ tên (sai) rồi rời ô SĐT (trống) ⇒ hai lỗi 34ms\n ✓ FormDatLich > dữ liệu hợp lệ ⇒ onGui nhận dữ liệu ĐÃ LÀM SẠCH: trim họ tên, SĐT +84 → 0, bỏ dấu cách 140ms\n ✓ FormDatLich > đang gửi ⇒ nút khoá \"Đang gửi…\"; bấm thêm hai lần vẫn chỉ gửi MỘT lần 133ms\n ✓ FormDatLich > onGui ném lỗi (máy chủ từ chối) ⇒ hộp role=\"alert\" ở đầu form, chữ đã gõ còn nguyên 118ms\n ✓ FormDatLich > lý do dán vào 501 ký tự ⇒ \"Lý do tối đa 500 ký tự\" 23ms\n Test Files  2 passed (2)\n      Tests  24 passed (24)",
  formCu: "$ npx vitest run src/features/dat-lich/FormDatLich.test.tsx\n ❯ src/features/dat-lich/FormDatLich.test.tsx (7 tests | 2 failed) 674ms\n   ❯ FormDatLich (7)\n     ✓ bấm gửi khi form trống ⇒ lỗi dưới cả 4 ô, ô đánh dấu invalid, onGui KHÔNG được gọi 154ms\n     × mode onTouched: gõ sai CHƯA báo lỗi; rời ô (Tab) mới báo; sửa đúng thì lỗi biến mất ngay 56ms\n     × lỗi THỨ HAI trong cùng nhóm benhNhan cũng hiện: rời ô họ tên (sai) rồi rời ô SĐT (trống) ⇒ hai lỗi 34ms\n     ✓ dữ liệu hợp lệ ⇒ onGui nhận dữ liệu ĐÃ LÀM SẠCH: trim họ tên, SĐT +84 → 0, bỏ dấu cách 146ms\n     ✓ đang gửi ⇒ nút khoá \"Đang gửi…\"; bấm thêm hai lần vẫn chỉ gửi MỘT lần 140ms\n     ✓ onGui ném lỗi (máy chủ từ chối) ⇒ hộp role=\"alert\" ở đầu form, chữ đã gõ còn nguyên 120ms\n     ✓ lý do dán vào 501 ký tự ⇒ \"Lý do tối đa 500 ký tự\" 21ms\n\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯\n\n FAIL  src/features/dat-lich/FormDatLich.test.tsx > FormDatLich > mode onTouched: gõ sai CHƯA báo lỗi; rời ô (Tab) mới báo; sửa đúng thì lỗi biến mất ngay\nError: expect(element).not.toBeInTheDocument()\n\nexpected document not to contain element, found <p\n  class=\"loi\"\n  id=\"hoTen-loi\"\n>\n  Họ tên cần ít nhất 2 ký tự\n</p> instead\n…\nError: expect(element).toHaveAccessibleDescription()\n\nExpected element to have accessible description:\n  Số di động Việt Nam gồm 10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09\nReceived:\n…\n      Tests  2 failed | 5 passed (7)",
  fireEvent: "[fireEvent] hỏi ngay: KHÔNG có lỗi\n[fireEvent + findBy] lỗi hiện sau khi đợi\n[user-event] sau await: CÓ lỗi\n[fireEvent.change] 1 sự kiện lắng nghe được: change\n[user.type \"An\"] 16 sự kiện: pointerdown mousedown focus pointerup mouseup click keydown keypress beforeinput input keyup keydown keypress beforeinput input keyup\n[axe] [ 'button-name: button', 'label: #ghi-chu' ]\n[getByLabelText] không tìm thấy ô \"Số điện thoại\"",
  actFire: "stderr | src/vi-du/ch09/bai1.test.tsx > fireEvent: change + blur, hỏi lỗi NGAY ⇒ chưa có (resolver của Zod trả Promise)\nAn update to FormDatLich inside a test was not wrapped in act(...).",
  sai1: "TestingLibraryElementError: Unable to find an accessible element with the role \"button\" and name \"Yêu thích BS. Trần Thu Hoa\"\n\nHere are the accessible roles:\n\n  article:\n\n  Name \"BS. Trần Thu Hà\":\n  <article\n    aria-label=\"BS. Trần Thu Hà\"\n    class=\"the-bac-si\"\n  />\n\n  --------------------------------------------------\n  heading:\n  …\n  button:\n\n  Name \"Yêu thích BS. Trần Thu Hà\":\n  <button\n    aria-label=\"Yêu thích BS. Trần Thu Hà\"\n    aria-pressed=\"false\"\n    class=\"nut nut-tim\"\n    type=\"button\"\n  />\n\n  --------------------------------------------------",
  sai2: "TestingLibraryElementError: Unable to find an element with the text: Bác sĩ lâu năm. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.",
  sai3: "AssertionError: expected \"vi.fn()\" to be called 1 times, but got 0 times",
  khu: "$ npx vitest run src/features/bac-si/KhuBacSi.test.tsx src/pages/TrangDatLich.test.tsx --reporter=verbose\n ✓ KhuBacSi > đang tải ⇒ khung xương aria-busy; dữ liệu về ⇒ khung xương biến mất, 6 thẻ 142ms\n ✓ KhuBacSi > máy chủ trả mảng rỗng ⇒ câu báo \"chưa có bác sĩ\", không có thẻ nào 17ms\n ✓ KhuBacSi > 500 ⇒ hộp lỗi nói lời máy chủ; bấm \"Thử lại\" (lần hai máy chủ ổn) ⇒ 6 thẻ 49ms\n ✓ KhuBacSi > mất mạng (fetch ném TypeError) ⇒ câu \"Không kết nối được máy chủ\", không lộ chữ \"Failed to fetch\" 12ms\n ✓ KhuBacSi > đang có danh sách, lần làm mới hỏng ⇒ GIỮ danh sách cũ + dòng báo \"đang hiện bản đã tải\" 33ms\n ✓ TrangDatLich > SĐT đang có lịch chờ ⇒ hộp alert đầu form, VẪN ở trang đặt lịch, không tạo lịch hẹn 390ms\n ✓ TrangDatLich > người khác vừa đặt mất khung giờ ⇒ 409 ⇒ lưới giờ tải lại ⇒ trang đổi sang \"đã có người đặt\" + link chọn giờ khác 178ms\n ✓ KhuBacSi > chậm 300 ms: findBy mặc định đợi tới 1000 ms nên vẫn thấy 311ms\n ✓ KhuBacSi > lọc trên URL: /bac-si?ck=nhi ⇒ 2 thẻ; tìm \"zzz\" ⇒ \"Không tìm thấy bác sĩ phù hợp.\" 54ms\n Test Files  2 passed (2)\n      Tests  9 passed (9)",
  saiGetBy: "TestingLibraryElementError: Unable to find an accessible element with the role \"article\"\n…\n    aria-busy=\"true\"\n    aria-label=\"Đang tải danh sách bác sĩ\"",
  saiCham: "   × SAI 2 — API chậm 1500 ms, findBy chỉ đợi 1000 ms 1008ms\nTestingLibraryElementError: Unable to find an element with the text: Phòng khám chưa có bác sĩ nào nhận lịch.. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.",
  saiMsw: "[MSW] Error: intercepted a request without a matching request handler:\n\n  • GET /api/thong-ke\n\nIf you still wish to intercept this unhandled request, please create a request handler for it.\nRead more: https://mswjs.io/docs/http/intercepting-requests\n\nInternalError: [MSW] Cannot bypass a request when using the \"error\" strategy for the \"onUnhandledRequest\" option.",
  thuLai: "[client của app] hộp lỗi hiện sau 7037 ms\n[taoClientTest] hộp lỗi hiện sau 15 ms\n   ✓ CHẬM 4 — QueryClient của app (thử lại 3 lần) trong test: lỗi 500 mất bao lâu mới hiện? 7055ms",
  saiDongHo: "   × SAI 5 — đồng hồ giả của Vitest + user-event (ĐÃ có advanceTimers như tài liệu dặn): cú bấm đứng im tới hết giờ 5006ms\nError: Test timed out in 5000ms.\nIf this is a long-running test, pass a timeout value as the last argument or configure it globally with \"testTimeout\".",
  saiThuTu: "$ npx vitest run -c vitest.sai.config.ts src/vi-du/ch09/bai2.sai.tsx\n   ✓ SAI 6a — máy chủ trả rỗng 16ms\n   × SAI 6b — mặc định có 6 bác sĩ 1005ms\nTestingLibraryElementError: Unable to find role=\"article\"\n\n$ npx vitest run -c vitest.sai.config.ts src/vi-du/ch09/bai2.sai.tsx -t \"SAI 6b\"\n ✓ src/vi-du/ch09/bai2.sai.tsx (8 tests | 7 skipped) 173ms\n      Tests  1 passed | 7 skipped (8)",
  saiSuspense: "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)\n…\n   × SAI 7 — trang có use()/Suspense vẽ bằng veTrang (act ĐỒNG BỘ) thay vì veTrangCho 1524ms",
  actBat: "[ngoài act] 1 lần console.error · An update to %s inside a test was not wrapped in act(...).\n[trong act] 0 lần console.error",
  actTat: "[ngoài act] 0 lần console.error · undefined\n   × đổi store NGOÀI act() khi component đang hiện ⇒ React cảnh báo \"not wrapped in act(...)\" 20ms\nTypeError: .toMatch() expects to receive a string, but got undefined",
  thuTuTron: "$ npx vitest run --sequence.shuffle --sequence.seed=2026\n      Running tests with seed \"2026\"\n Test Files  25 passed (25)\n      Tests  114 passed (114)",
  boDatLai: "# setup.ts thiếu dòng datLaiDuLieu()\n$ npx vitest run\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯\n FAIL  src/features/dat-lich/useDatLich.test.tsx > useDatLich > 409 ⇒ mutateAsync NÉM LoiApi (form bắt được), isError; VẪN làm cũ khung giờ (onSettled)\n FAIL  src/features/lich-hen/DanhSachLichHen.test.tsx > 12.3 — máy chủ lỗi 500 ⇒ tự quay về \"Chờ xác nhận\", báo \"đã hoàn tác\", trang KHÔNG sập\n Test Files  2 failed | 23 passed (25)\n      Tests  2 failed | 112 passed (114)",
  hook: "$ npx vitest run src/shared/hooks src/features/bac-si/hooks src/features/dat-lich/useKhungGio.test.tsx \\\n    src/features/dat-lich/useDatLich.test.tsx src/shared/store src/app/query-client.test.ts --reporter=verbose\n ✓ thong-bao-store > hien() thêm vào cuối, mặc định loại \"loi\"; an(id) bỏ đúng cái đó 7ms\n ✓ thong-bao-store > mỗi thông báo tự ẩn SAU ĐÚNG 5 giây, tính từ lúc nó hiện 1ms\n ✓ useTieuDeTrang > đặt tiêu đề khi hiện; đổi tham số ⇒ đổi tiêu đề; gỡ ⇒ trả lại tiêu đề TRƯỚC khi hook chạy 17ms\n ✓ useBoLocUrl > đọc ?ck=nhi&q=hà ⇒ { chuyenKhoa: \"nhi\", tuKhoa: \"hà\" } 16ms\n ✓ useBoLocUrl > URL gõ bậy (?ck=tim-mach, q dài 80 ký tự) ⇒ về mặc định / cắt còn 50 3ms\n ✓ useBoLocUrl > datBoLoc chuyên khoa ⇒ PUSH ?ck=da-lieu, GIỮ từ khoá đang có 4ms\n ✓ useBoLocUrl > datBoLoc(…, \"replace\") và về mặc định ⇒ REPLACE, URL sạch (không còn \"?\") 2ms\n ✓ useDatLich > thành công ⇒ trả lịch hẹn lh-1 \"chờ xác nhận\"; làm cũ khung giờ của bs-2 VÀ danh sách lịch hẹn 94ms\n ✓ useKhungGio > bs-2 ngày 01/10 ⇒ pending rồi success, 4 khung giờ, MỘT request 77ms\n ✓ useDatLich > 409 ⇒ mutateAsync NÉM LoiApi (form bắt được), isError; VẪN làm cũ khung giờ (onSettled) 65ms\n ✓ useKhungGio > chưa chọn bác sĩ (null) ⇒ KHÔNG gọi API (enabled: false), fetchStatus \"idle\" 54ms\n ✓ useKhungGio > đổi ngày ⇒ GIỮ lưới ngày cũ (isPlaceholderData) trong lúc tải, rồi thay bằng ngày mới 213ms\n ✓ useKhungGio > bác sĩ không tồn tại ⇒ isError, LoiApi 404; client CỦA APP (có thử lại) cũng KHÔNG thử lại lỗi 4xx 55ms\n Test Files  6 passed (6)\n      Tests  19 passed (19)",
  saiWrapper: "Error: useLocation() may be used only in the context of a <Router> component.\nError: No QueryClient set, use QueryClientProvider to set one",
  saiStale: "   × SAI 3 — tách data ra khỏi result.current NGAY từ đầu: giữ mãi giá trị của lần render đầu 537ms\nAssertionError: expected false to be true // Object.is equality",
  datLichThieu: "⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯\nAssertionError: expected LoiApi: Không có khung giờ này { …(1) } to match object { name: 'LoiApi', status: 409, …(1) }\n      Tests  2 failed (2)",
  datLichNgay: "× thành công ⇒ trả lịch hẹn lh-1 \"chờ xác nhận\"; làm cũ khung giờ của bs-2 VÀ danh sách lịch hẹn 42ms\nAssertionError: expected false to be true // Object.is equality\n     32|     expect(result.current.isSuccess).toBe(true);",
  covTruoc: "# dự án sau Chương 12 (47 test)\nStatements   : 85.4% ( 878/1028 )\nBranches     : 74.6% ( 620/831 )\nFunctions    : 86.89% ( 126/145 )\nLines        : 93.09% ( 526/565 )",
  covTruocFile: "File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s \n  query-client.ts  |      50 |    22.22 |   66.66 |   66.66 | 7-8               \n  KhuBacSi.tsx     |      75 |     72.6 |      60 |   96.96 | 28                \n  FormDatLich.tsx  |   97.72 |    87.75 |     100 |   93.33 | 28-29             \n  schema.ts        |   92.85 |       60 |     100 |     100 | 14-15             \n  LoiTaiDuLieu.tsx |       0 |        0 |       0 |       0 | 11-22             \n  VungThongBao.tsx |   70.58 |       50 |   33.33 |   77.77 | 10-12             ",
  covSau: "$ npm run test:cov\n…\n Test Files  25 passed (25)\n      Tests  114 passed (114)\nStatements   : 89.76% ( 930/1036 )\nBranches     : 81.02% ( 679/838 )\nFunctions    : 93.1% ( 135/145 )\nLines        : 96.32% ( 550/571 )",
  covSauBang: " % Coverage report from v8\n-------------------|---------|----------|---------|---------|-------------------\nFile               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s \n-------------------|---------|----------|---------|---------|-------------------\nAll files          |   89.76 |    81.02 |    93.1 |   96.32 |                   \n  TrangLoi.tsx     |       0 |        0 |       0 |       0 | 5-17              \n  ChiTietBacSi.tsx |   70.83 |     42.3 |      50 |     100 | 12-20             \n  FormDatLich.tsx  |     100 |    99.04 |     100 |     100 | 29                \n  TrangDatLich.tsx |   89.33 |    73.33 |     100 |   91.17 | 30-33,49          \n  KhungXuong.tsx   |   78.57 |       50 |     100 |     100 | 5-35              \n  LoiTaiDuLieu.tsx |   77.77 |       50 |     100 |      90 | 17                ",
  covSoSanh: "$ npx vitest run --coverage --coverage.reporter=text-summary\n      Tests  114 passed (114)\nStatements   : 89.76% ( 930/1036 )\nBranches     : 80.78% ( 677/838 )\nFunctions    : 93.1% ( 135/145 )\nLines        : 96.32% ( 550/571 )\n\n$ npx vitest run -c vitest.khong-compiler.config.ts --coverage --coverage.reporter=text-summary\n      Tests  114 passed (114)\nStatements   : 95.49% ( 339/355 )\nBranches     : 89.17% ( 206/231 )\nFunctions    : 93.9% ( 154/164 )\nLines        : 95.88% ( 303/316 )",
  nguong: "# vite.config.ts: thresholds.branches 75 → 85\n$ npm run test:cov\n      Tests  114 passed (114)\nERROR: Coverage for branches (80.78%) does not meet global threshold (85%)\n$ echo $?\n1",
  viMockDotBien: "# http.ts: if (!res.ok) → if (false && !res.ok)  — goiApi hết ném lỗi khi máy chủ trả 500\n ✓ src/vi-du/ch09/bai4-vi-mock.test.tsx (2 tests) 132ms\n     × 500 ⇒ hộp lỗi nói lời máy chủ; bấm \"Thử lại\" (lần hai máy chủ ổn) ⇒ 6 thẻ 1008ms\n     × đang có danh sách, lần làm mới hỏng ⇒ GIỮ danh sách cũ + dòng báo \"đang hiện bản đã tải\" 1053ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯\n      Tests  2 failed | 7 passed (9)",
  dotBien: "FormDatLich bản sau Ch12 (chưa sửa)      ✗ Tests  2 failed | 5 passed (7)\nschema: bỏ .trim() ở họ tên              ✗ Tests  2 failed | 28 passed (30)\nform: bỏ disabled={isSubmitting}         ✗ Tests  1 failed | 6 passed (7)\nLoiTaiDuLieu: matMang = false            ✗ Tests  1 failed | 6 passed (7)\nKhuBacSi: bỏ dòng \"đang hiện bản cũ\"     ✗ Tests  1 failed | 6 passed (7)\nuseKhungGio: bỏ keepPreviousData         ✗ Tests  1 failed | 3 passed (4)\nuseDatLich: onSettled → onSuccess        ✗ Tests  2 failed | 2 passed (4)\nthông báo: 5000 → 3000 ms                ✗ Tests  1 failed | 1 passed (2)\nsetup.ts: bỏ datLaiDuLieu()              ✗ Tests  2 failed | 112 passed (114)\nsetup.ts: bỏ cờ IS_REACT_ACT_ENVIRONMENT ✗ Tests  1 failed | 3 passed (4)\nhttp.ts: goiApi không ném khi 500        ✗ Tests  2 failed | 7 passed (9)",
  cuoiVitest: "$ npx tsc -b && npx vitest run\n Test Files  25 passed (25)\n      Tests  114 passed (114)",
  cuoiBuild: "$ npx vite build\n…\ndist/assets/form-D6B63s_J.js              116.73 kB │ gzip:  36.53 kB\ndist/assets/index-CB1bUm1m.js             362.32 kB │ gzip: 114.96 kB\n✓ built in 926ms",
};

/* ─── Sơ đồ mermaid trong bài (≤ 10 nút, nhãn ngắn; khối EN nhãn tiếng Anh, khối VI nhãn tiếng Việt) ─── */
const L = (...dong) => MM(dong.join('\n'));
const SD = {
  /* 9.1 */
  uuTienVi: L(
    'flowchart TB',
    '  A{"Người dùng nhận ra nó bằng gì?"} -->|"vai trò + tên (nút, link, tiêu đề…)"| R["getByRole"]',
    '  A -->|"nhãn của ô nhập"| L["getByLabelText"]',
    '  A -->|"chữ đọc được, không bấm"| T["getByText"]',
    '  A -->|"không có gì ở trên"| D["getByTestId — cuối cùng"]',
    '  R --> K["Test cũng là một phép kiểm tiếp cận"]',
    '  L --> K',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  classDef cuoi fill:#3a2a0a,stroke:#ffc233,color:#fff',
    '  class R,L tot',
    '  class D cuoi',
  ),
  uuTienEn: L(
    'flowchart TB',
    '  A{"How does a user recognise it?"} -->|"role + name (button, link, heading…)"| R["getByRole"]',
    '  A -->|"label of a field"| L["getByLabelText"]',
    '  A -->|"readable text, not clickable"| T["getByText"]',
    '  A -->|"none of the above"| D["getByTestId — last resort"]',
    '  R --> K["The test doubles as an accessibility check"]',
    '  L --> K',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  classDef cuoi fill:#3a2a0a,stroke:#ffc233,color:#fff',
    '  class R,L tot',
    '  class D cuoi',
  ),
  suKienVi: L(
    'sequenceDiagram',
    '  participant T as Test',
    '  participant U as user-event',
    '  participant O as Ô "Họ và tên"',
    '  participant F as React Hook Form',
    '  T->>U: await user.type(o, "A")',
    '  U->>O: pointerdown, mousedown, focus, click',
    '  U->>O: keydown, keypress, beforeinput, input, keyup',
    '  O->>F: onChange (từ sự kiện input)',
    '  U-->>T: xong + đợi một nhịp',
    '  T->>U: await user.tab()',
    '  U->>O: blur ⇒ "touched" ⇒ Zod kiểm (Promise)',
  ),
  suKienEn: L(
    'sequenceDiagram',
    '  participant T as Test',
    '  participant U as user-event',
    '  participant O as "Họ và tên" field',
    '  participant F as React Hook Form',
    '  T->>U: await user.type(o, "A")',
    '  U->>O: pointerdown, mousedown, focus, click',
    '  U->>O: keydown, keypress, beforeinput, input, keyup',
    '  O->>F: onChange (from the input event)',
    '  U-->>T: done + waits one tick',
    '  T->>U: await user.tab()',
    '  U->>O: blur ⇒ "touched" ⇒ Zod validates (Promise)',
  ),
  loiDungVi: L(
    'flowchart TB',
    '  A["Gõ thêm n (Họ tên = An) hoặc rời ô SĐT"] --> B["Zod kiểm lại"]',
    '  B --> C["RHF thêm/xoá khoá TẠI CHỖ trong errors.benhNhan — vẫn là object cũ"]',
    '  C --> D["Render lại: e = errors.benhNhan"]',
    '  D --> E{"Compiler: $[16] !== e ?"}',
    '  E -->|"không — cùng object"| F["Dùng lại JSX cũ ⇒ lỗi cũ đứng mãi, lỗi mới không hiện"]',
    '  E -.->|"sau khi sửa: so CHUỖI loi.hoTen"| G["undefined khác chuỗi cũ ⇒ vẽ lại, lỗi biến mất"]',
    '  classDef sai fill:#3a1414,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class F sai',
    '  class G tot',
  ),
  loiDungEn: L(
    'flowchart TB',
    '  A["Type n (name = An) or leave the phone field"] --> B["Zod validates again"]',
    '  B --> C["RHF adds/deletes keys IN PLACE in errors.benhNhan — same object"]',
    '  C --> D["Re-render: e = errors.benhNhan"]',
    '  D --> E{"Compiler: $[16] !== e ?"}',
    '  E -->|"no — same object"| F["Reuse old JSX ⇒ old error stays, new error never shows"]',
    '  E -.->|"after the fix: compare the STRING loi.hoTen"| G["undefined differs from old string ⇒ re-render, error gone"]',
    '  classDef sai fill:#3a1414,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class F sai',
    '  class G tot',
  ),
  /* 9.2 */
  mswVi: L(
    'sequenceDiagram',
    '  participant T as Test',
    '  participant K as KhuBacSi',
    '  participant Q as TanStack Query',
    '  participant M as MSW (Node)',
    '  T->>K: render (khung xương hiện NGAY)',
    '  K->>Q: useBacSi()',
    '  Q->>M: fetch GET /api/bac-si',
    '  M-->>Q: handler: JSON 6 bác sĩ (sau 5 ms)',
    '  Q-->>K: data ⇒ vẽ 6 thẻ',
    '  T->>T: findAllByRole hỏi lại khi DOM đổi và mỗi 50 ms, tối đa 1000 ms',
  ),
  mswEn: L(
    'sequenceDiagram',
    '  participant T as Test',
    '  participant K as KhuBacSi',
    '  participant Q as TanStack Query',
    '  participant M as MSW (Node)',
    '  T->>K: render (skeleton shows AT ONCE)',
    '  K->>Q: useBacSi()',
    '  Q->>M: fetch GET /api/bac-si',
    '  M-->>Q: handler: JSON with 6 doctors (after 5 ms)',
    '  Q-->>K: data ⇒ 6 cards',
    '  T->>T: findAllByRole re-checks on DOM changes and every 50 ms, up to 1000 ms',
  ),
  trangThaiVi: L(
    'stateDiagram-v2',
    '  [*] --> DangTai: render',
    '  DangTai --> CoDuLieu: 200 + mảng có phần tử',
    '  DangTai --> Rong: 200 + []',
    '  DangTai --> Loi: 500 / mất mạng',
    '  Loi --> DangTai: bấm Thử lại',
    '  CoDuLieu --> BanCu: làm mới hỏng',
    '  BanCu: danh sách cũ + dòng báo',
  ),
  trangThaiEn: L(
    'stateDiagram-v2',
    '  [*] --> Loading: render',
    '  Loading --> HasData: 200 + non-empty array',
    '  Loading --> Empty: 200 + []',
    '  Loading --> Error: 500 / offline',
    '  Error --> Loading: click Thử lại',
    '  HasData --> Stale: refresh fails',
    '  Stale: old list + notice',
  ),
  vongDoiVi: L(
    'flowchart TB',
    '  A["beforeAll: server.listen — request lạ thì báo lỗi"] --> B["test: render, server.use(…) nếu cần kịch bản riêng"]',
    '  B --> C["afterEach: cleanup DOM"]',
    '  C --> D["server.resetHandlers + datLaiDuLieu"]',
    '  D --> E["URL, store Zustand, localStorage về như mới"]',
    '  E -->|"test kế tiếp"| B',
    '  E --> F["afterAll: server.close"]',
  ),
  vongDoiEn: L(
    'flowchart TB',
    '  A["beforeAll: server.listen — unknown request is an error"] --> B["test: render, server.use(…) for its own scenario"]',
    '  B --> C["afterEach: cleanup DOM"]',
    '  C --> D["server.resetHandlers + datLaiDuLieu"]',
    '  D --> E["URL, Zustand stores, localStorage reset"]',
    '  E -->|"next test"| B',
    '  E --> F["afterAll: server.close"]',
  ),
  /* 9.3 */
  renderHookVi: L(
    'flowchart TB',
    '  A["renderHook(() => useKhungGio(id, ngay), { wrapper })"] --> B["wrapper: QueryClientProvider + MemoryRouter"]',
    '  B --> C["Component thử (vô hình) gọi hook"]',
    '  C --> D["result.current = giá trị LẦN RENDER MỚI NHẤT"]',
    '  E["rerender(props mới)"] --> C',
    '  F["unmount()"] --> G["chạy cleanup của effect"]',
    '  C --> F',
  ),
  renderHookEn: L(
    'flowchart TB',
    '  A["renderHook(() => useKhungGio(id, ngay), { wrapper })"] --> B["wrapper: QueryClientProvider + MemoryRouter"]',
    '  B --> C["Invisible test component calls the hook"]',
    '  C --> D["result.current = value of the LATEST render"]',
    '  E["rerender(new props)"] --> C',
    '  F["unmount()"] --> G["effect cleanup runs"]',
    '  C --> F',
  ),
  chonCachVi: L(
    'flowchart TB',
    '  A{"Logic cần React không?"} -->|"không (schema, locBacSi, store)"| B["Gọi thẳng hàm / getState() — nhanh nhất"]',
    '  A -->|"có"| C{"Hook dùng ở NHIỀU nơi, nhiều nhánh?"}',
    '  C -->|"có (useKhungGio, useBoLocUrl)"| D["renderHook + wrapper"]',
    '  C -->|"không — chỉ một component dùng"| E["Test qua component đó"]',
    '  D --> F["Vẫn giữ 1–2 test component đi qua hook"]',
  ),
  chonCachEn: L(
    'flowchart TB',
    '  A{"Does the logic need React?"} -->|"no (schema, locBacSi, store)"| B["Call the function / getState() — fastest"]',
    '  A -->|"yes"| C{"Hook used in MANY places, many branches?"}',
    '  C -->|"yes (useKhungGio, useBoLocUrl)"| D["renderHook + wrapper"]',
    '  C -->|"no — one component uses it"| E["Test through that component"]',
    '  D --> F["Still keep 1–2 component tests that go through it"]',
  ),
  /* 9.4 */
  cupVi: L(
    'flowchart BT',
    '  S["Tĩnh: tsc -b, oxlint — bắt lỗi kiểu, lỗi gõ"] --> U["Đơn vị: schema, nenThuLai, store — mỗi test vài ms"]',
    '  U --> I["Tích hợp: component + MSW + router — phần lớn bộ test"]',
    '  I --> E["Đầu-cuối: trình duyệt thật (Playwright) — ít, chậm, Chương 10 + khoá Next.js"]',
    '  classDef nhieu fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class I nhieu',
  ),
  cupEn: L(
    'flowchart BT',
    '  S["Static: tsc -b, oxlint — type errors, typos"] --> U["Unit: schema, nenThuLai, store — a few ms each"]',
    '  U --> I["Integration: component + MSW + router — most of the suite"]',
    '  I --> E["End-to-end: real browser (Playwright) — few, slow, Chapter 10 + Next.js course"]',
    '  classDef nhieu fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class I nhieu',
  ),
  nenTestVi: L(
    'flowchart TB',
    '  A{"Người dùng thấy hoặc dựa vào nó?"} -->|"có"| B["Test hành vi: bấm, gõ, đọc chữ"]',
    '  A -->|"không"| C{"Có nhánh / quy tắc nghiệp vụ?"}',
    '  C -->|"có"| D["Test hàm thuần"]',
    '  C -->|"không"| E{"Là mã của thư viện?"}',
    '  E -->|"có"| F["Bỏ qua — thư viện tự test"]',
    '  E -->|"không"| G["Bỏ qua — tsc và lint đủ"]',
  ),
  nenTestEn: L(
    'flowchart TB',
    '  A{"Does the user see or rely on it?"} -->|"yes"| B["Test the behaviour: click, type, read text"]',
    '  A -->|"no"| C{"Branches / business rules?"}',
    '  C -->|"yes"| D["Test the pure function"]',
    '  C -->|"no"| E{"Library code?"}',
    '  E -->|"yes"| F["Skip — the library tests it"]',
    '  E -->|"no"| G["Skip — tsc and lint are enough"]',
  ),
};

const L0 = {
    title: '9.0 — Chapter 9 slides: testing React in pictures|||9.0 — Slide Chương 9: test React bằng hình',
    slug: 'rx-9-0-slides',
    type: 'DOCUMENT',
    isFreePreview: true,
    description: 'Cả Chương 9 trong 28 slide: truy vấn theo vai trò, user-event, bug thật mà test bắt được, MSW và bốn trạng thái màn hình, cờ act, đồng hồ giả, renderHook, độ phủ đo thật và test gì — bỏ gì.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Slides</span>
<h2>The whole chapter in 28 slides</h2>
<p class="lead">A test is a small program that uses your app the way a person would — clicks, types, reads — and shouts when the result is wrong. This chapter writes the clinic app's real test suite with Vitest, Testing Library and MSW, and then checks that the tests themselves are worth anything: every new test was made to fail by breaking the code on purpose. Along the way the tests found a real bug that had been in the app since Chapter 12.</p>
<p>Slides 3–8 belong to Lesson 9.1 (querying by role, <code>getBy</code>/<code>queryBy</code>/<code>findBy</code>, the error message that lists every role on the screen, user-event versus <code>fireEvent</code>, and the booking form whose error message never went away because of React Compiler), 9–15 to Lesson 9.2 (waiting for data, MSW in tests, the four states of a screen, why the app's retry policy is switched off in tests, the <code>act</code> warning that was silently disabled, fake timers with user-event, tests that depend on their order), 16–20 to Lesson 9.3 (<code>renderHook</code>, wrappers, hooks on top of TanStack Query, the <code>mutateAsync</code> trap, stores and pure functions without React), 21–25 to Lesson 9.4 (coverage before and after, what React Compiler does to branch coverage, the HTML report, mocking at the network versus the module, and what to test). Slide 26 lists common mistakes, 27 is the cheat sheet for the quiz, 28 the four project steps. Everything was run on 26 September 2026 with React 19.3.0, Vitest 5.0.2, Testing Library (react 16.3.3, dom 10.4.2, user-event 14.6.7, jest-dom 7.0.1), MSW 2.15.0 and jsdom 29.1.1. Two results worth a second look: the app's own query client needs <strong>7056 ms</strong> to show an error in a test, the test client 10 ms (slide 12); and React's <code>act</code> warning had been <strong>switched off</strong> in this project from the start without anyone noticing (slide 13).</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Slide</span>
<h2>Cả chương trong 28 slide</h2>
<p class="lead">Test là một chương trình nhỏ dùng app của bạn đúng như một con người — bấm, gõ, đọc — rồi la lên khi kết quả sai. Chương này viết bộ test thật cho app phòng khám bằng Vitest, Testing Library và MSW, rồi kiểm xem chính bộ test có đáng tin không: mọi test mới đều bị bắt phải đỏ bằng cách cố ý làm hỏng mã. Trên đường đi, test tìm ra một bug thật nằm trong app từ Chương 12.</p>
<p>Slide 3–8 thuộc Bài 9.1 (hỏi theo vai trò, <code>getBy</code>/<code>queryBy</code>/<code>findBy</code>, thông báo lỗi in ra mọi vai trò đang có trên màn hình, user-event so với <code>fireEvent</code>, và form đặt lịch có dòng báo lỗi không bao giờ biến mất vì React Compiler), 9–15 thuộc Bài 9.2 (đợi dữ liệu, MSW trong test, bốn trạng thái của một màn hình, vì sao tắt chính sách thử lại của app trong test, cảnh báo <code>act</code> bị tắt mà không ai biết, đồng hồ giả với user-event, test phụ thuộc thứ tự), 16–20 thuộc Bài 9.3 (<code>renderHook</code>, wrapper, hook dựng trên TanStack Query, bẫy <code>mutateAsync</code>, store và hàm thuần không cần React), 21–25 thuộc Bài 9.4 (độ phủ trước và sau, React Compiler làm gì với độ phủ nhánh, báo cáo HTML, giả ở tầng mạng hay tầng module, và nên test gì). Slide 26 là các sai lầm hay gặp, 27 là bảng tra nhanh cho bài kiểm tra, 28 là bốn bước tự gõ tiếp dự án. Mọi thứ chạy ngày 26/09/2026 bằng React 19.3.0, Vitest 5.0.2, Testing Library (react 16.3.3, dom 10.4.2, user-event 14.6.7, jest-dom 7.0.1), MSW 2.15.0 và jsdom 29.1.1. Hai kết quả đáng nhìn hai lần: query client của chính app cần <strong>7056 ms</strong> mới hiện được hộp lỗi trong test, client của test chỉ 10 ms (slide 12); và cảnh báo <code>act</code> của React đã bị <strong>tắt</strong> trong dự án này từ đầu mà không ai hay (slide 13).</p>
</div>
${gallery('rx-09', [[1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Hỏi DOM theo vai trò'], [4, 'getBy · queryBy · findBy'], [5, 'Hỏi sai tên: in mọi vai trò'], [6, 'user-event: 16 sự kiện'], [7, 'Test đỏ: lỗi form đứng mãi'], [8, 'Sửa: rút chuỗi lỗi ra trước'], [9, 'findBy đợi, getBy thì không'], [10, 'MSW chặn ở tầng mạng'], [11, 'Bốn trạng thái của màn hình'], [12, 'Thử lại: 7056 ms so với 10 ms'], [13, 'Cờ act bị tắt từ đầu'], [14, 'Đồng hồ giả + user-event'], [15, 'Chạy riêng xanh, chạy chung đỏ'], [16, 'renderHook và result.current'], [17, 'Hook cần ngữ cảnh: wrapper'], [18, 'Hook TanStack: waitFor'], [19, 'mutateAsync xong ≠ result đổi'], [20, 'Store và hàm thuần: không cần React'], [21, 'Độ phủ trước và sau'], [22, 'Compiler nhân ba số nhánh'], [23, 'Báo cáo HTML'], [24, 'Giả ở mạng hay ở module'], [25, 'Test gì, bỏ gì, đột biến'], [26, 'Sai lầm hay gặp'], [27, 'Bảng tra nhanh'], [28, 'Tự gõ tiếp dự án']])}
`,
};

/* Output cắt sẵn cho Bài 9.1 (ngoài template literal: bộ kiểm cấm gạch chéo ngược trong thân bài) */
const O1 = {
  fire: OUT.fireEvent.split('\n').slice(0, 5).join('\n'),
  axe: OUT.fireEvent.split('\n').slice(5).join('\n'),
  dotBien: OUT.dotBien.split('\n').filter((l) => /trim|disabled/.test(l)).join('\n'),
};
const L1 = {
    title: '9.1 — Testing Library basics: query by role, user-event, jest-dom|||9.1 — Testing Library căn bản: hỏi theo vai trò, user-event, jest-dom',
    slug: 'rx-9-1-testing-library',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Viết test như người dùng dùng app: truy vấn theo vai trò và nhãn, getBy/queryBy/findBy, user-event thay fireEvent, jest-dom; test form đặt lịch (React Hook Form + Zod) và schema; axe trong test — và một bug thật do React Compiler mà test bắt được.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Testing Library basics: query by role, act with user-event, assert with jest-dom</h2>
<p class="lead">Until now you have checked the clinic app by opening it in the browser, clicking around and looking. That works once. It does not work the fortieth time, after a refactor, at 11 p.m., when you have forgotten that the phone field accepts "+84". A <strong>test</strong> is a small program that does the clicking and the looking for you, in a second, every time you save. This lesson teaches the way the React world writes such tests in 2026 — <strong>Testing Library</strong>: find elements the way a user finds them (by what they <em>are</em> and what they <em>say</em>), interact the way a user interacts (<strong>user-event</strong>), and assert on what a user would see (<strong>jest-dom</strong>). Then we point it at the booking form — and the very first run turns up a bug that has been in the app since Chapter 12.</p>
<p>Setup: the clinic app as it was after Chapter 12 — 47 tests in 11 files, all green; <code>use()</code> + Suspense on <code>/bac-si/:id</code>, <code>useOptimistic</code> for cancelling, the feedback form with <code>useActionState</code>, <strong>React Compiler enabled</strong> in <code>vite.config.ts</code>, MSW as the fake API. Versions: React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2, jsdom 29.1.1, @testing-library/react 16.3.3, @testing-library/dom 10.4.2, @testing-library/user-event 14.6.7, @testing-library/jest-dom 7.0.1, React Hook Form 7.88.0, Zod 4.6.5, axe-core 4.13.0 (checked 26/09/2026). If you are reading this chapter before Chapter 12, that is fine: the tests here do not need those features, and the two places that touch them link back.</p>

<h3>What is already in the project, and what each piece does</h3>
<p>You met Vitest in Section 0 (one test that found the page title) and every chapter since has added a few tests as "done when" criteria. So the machinery exists; this chapter is about using it well. Five pieces work together:</p>
<table>
<thead><tr><th>Piece</th><th>Version</th><th>Job</th></tr></thead>
<tbody>
<tr><td><strong>Vitest</strong></td><td>5.0.2</td><td>The test runner (trình chạy test): finds <code>*.test.ts(x)</code> files, runs them, prints ✓/×. Uses the same Vite config as the app, so <code>@/…</code> imports and React Compiler work in tests too.</td></tr>
<tr><td><strong>jsdom</strong></td><td>29.1.1</td><td>A fake browser written in JavaScript: it has <code>document</code>, elements, events — but no layout, no painting, no scrolling.</td></tr>
<tr><td><strong>@testing-library/react</strong></td><td>16.3.3</td><td><code>render()</code> puts a component into jsdom; <code>screen</code> lets you query what is on the "screen".</td></tr>
<tr><td><strong>@testing-library/user-event</strong></td><td>14.6.7</td><td>Simulates a person: a click is pointer-down, focus, pointer-up, click; typing is key by key.</td></tr>
<tr><td><strong>@testing-library/jest-dom</strong></td><td>7.0.1</td><td>Extra assertions for the DOM: <code>toBeInTheDocument</code>, <code>toHaveTextContent</code>, <code>toBeDisabled</code>, <code>toHaveAccessibleDescription</code>…</td></tr>
</tbody>
</table>
<p>They are wired together in two files you should read once. <code>vite.config.ts</code> has <code>test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'] }</code>. <code>src/test/setup.ts</code> runs before every test file: it loads jest-dom's matchers, starts the fake API server, and after each test cleans the DOM and resets the fake database, the URL and the Zustand stores (Lesson 9.2 explains why each line is there — two of them were added in this chapter after measuring).</p>
<div class="callout"><p><strong>JS quick reminder — <code>async</code>/<code>await</code> and arrow functions in tests.</strong> <code>test('name', async () =&gt; { … })</code> passes an <em>arrow function</em> (a short way to write a function) that is <code>async</code>: inside it you may write <code>await something</code>, which pauses the test until the Promise <code>something</code> finishes. Nearly every user-event call returns a Promise, so nearly every line that clicks or types starts with <code>await</code>. Forget it and the test goes on before the click has happened — you will see exactly that failure below.</p></div>

<h3>Your first test: arrange, act, assert</h3>
<p>Every test has the same three beats. <strong>Arrange</strong> (chuẩn bị): put the component on the screen with the data it needs. <strong>Act</strong> (hành động): do what a user does. <strong>Assert</strong> (kiểm): check what a user would now see. Here is the test for the doctor card, <code>TheBacSi</code>, from Chapter 1 — no router and no API needed, because without <code>coLienKet</code> the card has no link:</p>
${pre('tsx', SN.theBacSiTest)}
${out(OUT.theBacSi)}
<p>Read it line by line and notice what is <em>not</em> there. No <code>container.querySelector('.the-bac-si h3')</code>, no reading of props or state, no knowledge of <code>memo</code> or of the <code>useDemRender</code> counter inside the card. The test only knows what a person sitting in front of the screen knows: "there is an article called BS. Trần Thu Hà, it says Nhi and 8 years of experience, there is a heart button, pressing it does something". That is the whole philosophy of Testing Library, in its author Kent C. Dodds' sentence: <em>"The more your tests resemble the way your software is used, the more confidence they can give you."</em> The payoff: you can rename every CSS class, split the card into three components, or wrap it in <code>memo</code> — and this test stays green, because none of that changes what the user sees.</p>
<div class="callout"><p><strong>JS quick reminder — <code>vi.fn()</code> and destructuring.</strong> <code>vi.fn()</code> creates a <em>mock function</em> (hàm giả): calling it does nothing, but it records every call, so <code>expect(onDoiYeuThich).toHaveBeenCalledWith('bs-2')</code> can ask "were you called, and with what?". <code>const { rerender } = render(…)</code> is <em>destructuring</em>: <code>render</code> returns an object with many fields, and this line takes just the <code>rerender</code> field into a variable of the same name.</p></div>

<h3>Query by role: ask the DOM what a user sees</h3>
${slide('rx-09', 3, 'Query by role: ask the DOM what a user sees, not which class it has')}
<p>A <strong>role</strong> (vai trò) is what an element <em>is</em> to assistive technology: <code>button</code>, <code>link</code>, <code>heading</code>, <code>textbox</code>, <code>radio</code>, <code>alert</code>, <code>article</code>, <code>region</code>… Most HTML elements have one built in (a <code>&lt;button&gt;</code> is a button, an <code>&lt;h3&gt;</code> is a heading level 3, an <code>&lt;input type="radio"&gt;</code> is a radio). The <strong>accessible name</strong> (tên truy cập) is what a screen reader says for it: the text inside a button, the <code>&lt;label&gt;</code> of an input, or an <code>aria-label</code>. <code>getByRole('button', { name: 'Yêu thích BS. Trần Thu Hà' })</code> therefore asks exactly what a blind user's screen reader would find.</p>
${SD.uuTienEn}
<p>Testing Library documents a priority order for queries. The top of the list is what users perceive; the bottom is an escape hatch:</p>
<table>
<thead><tr><th>Query</th><th>Use for</th><th>In this app</th></tr></thead>
<tbody>
<tr><td><code>getByRole</code></td><td>almost everything interactive or structural</td><td>buttons, links, headings, radios, <code>alert</code>, <code>region</code></td></tr>
<tr><td><code>getByLabelText</code></td><td>form fields</td><td>"Họ và tên", "Số điện thoại", "Tìm theo tên"</td></tr>
<tr><td><code>getByPlaceholderText</code></td><td>only if a field truly has no label</td><td>— (every field has a label)</td></tr>
<tr><td><code>getByText</code></td><td>non-interactive text</td><td>"Bác sĩ lâu năm", error messages</td></tr>
<tr><td><code>getByDisplayValue</code></td><td>a field's current value</td><td>rarely; <code>toHaveValue</code> is clearer</td></tr>
<tr><td><code>getByAltText</code> / <code>getByTitle</code></td><td>images, tooltips</td><td>—</td></tr>
<tr><td><code>getByTestId</code></td><td>last resort, when nothing a user sees identifies it</td><td>not used anywhere in the suite</td></tr>
</tbody>
</table>
<p>A useful side effect: <strong>a test that queries by role is also an accessibility check.</strong> If <code>getByLabelText('Số điện thoại')</code> cannot find the phone field, a screen reader cannot announce it either. In Chapter 8 the date chips became real radio buttons; the tests that say <code>getByRole('radio', { name: '02/10/2026' })</code> would have failed on the old <code>&lt;button aria-pressed&gt;</code> version — which is precisely the bug Chapter 8 fixed.</p>
<p>Two more options on <code>getByRole</code> that the suite uses: <code>{ level: 2 }</code> for headings (<code>getByRole('heading', { level: 2, name: 'BS. Trần Thu Hà' })</code>), and state filters such as <code>{ pressed: false }</code>, <code>{ checked: true }</code>, <code>{ expanded: true }</code> — which match ARIA state, so they double as a check that the state is announced.</p>

<h3>getBy, queryBy, findBy — three ways to ask, three ways to answer</h3>
${slide('rx-09', 4, 'getBy throws, queryBy returns null, findBy waits: pick by what you expect')}
<p>Every query comes in three flavours (plus an <code>…All…</code> version of each that returns an array). They differ only in what happens when the answer is not "exactly one element, right now":</p>
<table>
<thead><tr><th></th><th>0 found</th><th>1 found</th><th>more than 1</th><th>waits?</th><th>use when…</th></tr></thead>
<tbody>
<tr><td><code>getBy…</code></td><td>throws</td><td>returns it</td><td>throws</td><td>no</td><td>it must be there now</td></tr>
<tr><td><code>queryBy…</code></td><td><code>null</code></td><td>returns it</td><td>throws</td><td>no</td><td>asserting that something is <strong>absent</strong></td></tr>
<tr><td><code>findBy…</code></td><td>rejects after 1000 ms</td><td>resolves</td><td>rejects</td><td><strong>yes</strong>, re-checks on every DOM change and every 50 ms</td><td>it will appear (data, validation, lazy page)</td></tr>
</tbody>
</table>
<p>The second test above uses the middle row: after <code>rerender</code> with a junior doctor, <code>expect(screen.queryByText('Bác sĩ lâu năm')).not.toBeInTheDocument()</code>. Why not <code>getByText</code>? Because <code>getBy</code> throws the moment it finds nothing — before <code>expect</code> even runs. Deliberately wrong version (these live in <code>src/vi-du/ch09/*.sai.tsx</code> and run with their own config so the normal suite stays green):</p>
${pre('tsx', SN.sai2)}
${out(OUT.sai2)}
<p>The error message is honest but misleading — it guesses that your text is split across elements. It is not; it is absent, which is what you wanted to prove. The third row, <code>findBy</code>, is the subject of Lesson 9.2; the booking form below already needs it once.</p>
<div class="pitfall co-tieu-de"><strong>Trap — <code>getByRole</code> with more than one match.</strong> <code>screen.getByRole('button')</code> on the doctor list throws "Found multiple elements with the role button" — six heart buttons. Narrow it: add <code>{ name: … }</code>, or scope the search with <code>within(the)</code>, where <code>the</code> is one card. <code>within(element).getBy…</code> searches only inside that element; the tests in Lesson 9.2 use it to find the "Thử lại" button inside a specific error box.</div>

<h3>When a query fails, read the list it prints</h3>
${slide('rx-09', 5, 'A failed getByRole prints every role and name on the screen — the answer is usually in the list')}
<p>Beginners lose the most time here: a query fails, the output is long, they scroll past it. Don't. A failed <code>getByRole</code> prints <em>every accessible role and name currently on the screen</em>, then the DOM. The fix is almost always visible in that list. One wrong letter in the doctor's name:</p>
${pre('tsx', SN.sai1)}
${out(OUT.sai1)}
<p>"Hà", not "Hoa" — and the list shows the exact string to copy. Two more tools for when you are lost: <code>screen.debug()</code> prints the current DOM (optionally one element: <code>screen.debug(the)</code>), and <code>logRoles(container)</code> from <code>@testing-library/react</code> prints the same role list as above without having to fail first.</p>

<h3>user-event, not fireEvent: a click is more than one event</h3>
${slide('rx-09', 6, 'user.type fires 16 events for two letters; fireEvent.change fires one')}
<p>Testing Library has two ways to "do" things. <code>fireEvent</code> (from <code>@testing-library/react</code>) dispatches <strong>one</strong> DOM event you name. <code>user-event</code> simulates what a browser does when a <strong>person</strong> acts: a click is pointer-down, mouse-down, focus, pointer-up, mouse-up, click; typing one letter is key-down, key-press, before-input, input, key-up. We counted, in <code>src/vi-du/ch09/bai1.test.tsx</code>:</p>
${pre('tsx', SN.fireEvent)}
${out(O1.fire)}
${SD.suKienEn}
<p>Why does that matter? Because real components listen to events you might not think of. React Hook Form in <code>mode: 'onTouched'</code> validates on <strong>blur</strong>, and Zod runs through an async resolver — it answers in a Promise, not immediately. With <code>fireEvent</code> you must remember to fire the blur yourself <em>and</em> wait; with user-event, <code>await user.tab()</code> moves focus like a keyboard user does, and the <code>await</code> waits one tick after each action. There is a second, quieter cost: the <code>fireEvent</code> test finished while Zod was still working, so React updated the form <em>after</em> the test — outside <code>act</code> — and printed this (with the <code>act</code> warning switched on, see Lesson 9.2):</p>
${out(OUT.actFire)}
<p>The rule the Testing Library docs give, and that this course follows: <strong>use user-event</strong>; reach for <code>fireEvent</code> only for events user-event does not model (a <code>scroll</code>, a custom event) or when fake timers make user-event awkward (Lesson 9.2). Always create the user with <code>const user = userEvent.setup()</code> <em>before</em> rendering, and <code>await</code> every call.</p>
<div class="pitfall co-tieu-de"><strong>Trap — forgetting <code>await</code> in front of <code>user.click</code>.</strong> TypeScript does not complain (a Promise you ignore is legal), the test reads fine, and it fails in a way that looks like the component is broken:</div>
${pre('tsx', SN.sai3)}
${out(OUT.sai3)}
<p>The click had not happened yet when <code>expect</code> ran. If a test says "expected to be called 1 times, but got 0 times" and you are sure the button works, look for a missing <code>await</code> first. (The <code>void</code> keyword in front is how you tell TypeScript and the linter "I know I am ignoring this Promise" — here, on purpose, to show the bug.)</p>

<h3>jest-dom: assertions that read like the screen</h3>
<p><code>expect(x).toBe(y)</code> compares values. For the DOM you want assertions that talk about what a user perceives, and that print useful messages. jest-dom adds them; <code>src/test/setup.ts</code> loads them with <code>import '@testing-library/jest-dom/vitest'</code>. The ones this chapter uses:</p>
<table>
<thead><tr><th>Matcher</th><th>Checks</th><th>Example in the suite</th></tr></thead>
<tbody>
<tr><td><code>toBeInTheDocument()</code></td><td>element is attached to the page</td><td>"Bác sĩ lâu năm" label</td></tr>
<tr><td><code>toHaveTextContent(text | /re/)</code></td><td>its text contains this</td><td>error box contains the server's message</td></tr>
<tr><td><code>toHaveAttribute(name, value?)</code></td><td>an attribute</td><td><code>aria-busy="true"</code> on the skeleton</td></tr>
<tr><td><code>toBeDisabled()</code> / <code>toBeEnabled()</code></td><td>a control is (not) disabled</td><td>submit button while sending</td></tr>
<tr><td><code>toHaveValue(v)</code></td><td>current value of a field</td><td>name field keeps what was typed</td></tr>
<tr><td><code>toBeChecked()</code></td><td>checkbox/radio state</td><td>date radio "02/10/2026"</td></tr>
<tr><td><code>toBeInvalid()</code> / <code>toBeValid()</code></td><td><code>aria-invalid</code> / form validity</td><td>name field after a bad value</td></tr>
<tr><td><code>toHaveAccessibleDescription(text)</code></td><td>what a screen reader reads <em>after</em> the name (from <code>aria-describedby</code>)</td><td>each field's error message</td></tr>
<tr><td><code>toHaveAccessibleName(text)</code></td><td>the computed name</td><td>time-slot list "Giờ khám ngày 02/10/2026"</td></tr>
<tr><td><code>toHaveFocus()</code></td><td>element has keyboard focus</td><td>skip link after the first Tab</td></tr>
</tbody>
</table>
<p>The one to remember from this list is <code>toHaveAccessibleDescription</code>. The booking form links each error to its field with <code>aria-describedby</code>. Asserting on the <em>description</em> instead of "some text exists somewhere" proves two things at once: the right message is shown, <em>and</em> it is attached to the right field. That second half is exactly where the bug below hides.</p>

<h3>Testing the booking form (React Hook Form + Zod)</h3>
<p><code>FormDatLich</code> (Chapter 3) takes a doctor and an <code>onGui</code> function, validates with a Zod schema through <code>zodResolver</code>, and calls <code>onGui</code> only with clean data. We test it on its own — no router, no API — by passing a <strong>fake <code>onGui</code></strong>. A small helper renders it and returns the fields, so each test reads like a scenario:</p>
${pre('tsx', SN.veForm)}
<p>Scenario 1 — the user presses "Gửi yêu cầu" on an empty form. Four errors must appear, each attached to its own field, the name field must be marked invalid, nothing must be sent, and the page must still pass axe (more on axe at the end of the lesson):</p>
${pre('tsx', SN.formTrong)}
<p>Scenario 2 — <code>mode: 'onTouched'</code> promises a polite form: no error while you are still typing, an error once you leave the field, and the error disappears as soon as the value becomes valid. Scenario 3 — two errors in the same group of fields (<code>benhNhan</code>):</p>
${pre('tsx', SN.formTouched)}
${pre('tsx', SN.formHaiLoi)}
<p>Scenario 4 — what does the form actually send? The schema trims the name, removes spaces and dots from the phone number and turns <code>+84</code> into <code>0</code>. Asserting on the exact object <code>onGui</code> received proves the cleaning works end to end, through the real resolver:</p>
${pre('tsx', SN.formSach)}
<p>Scenario 5 — the "double click" bug every booking form has once. We need <code>onGui</code> to stay "in flight" while we click again. A Promise whose <code>resolve</code> we keep in a variable does exactly that: the fake server answers only when the test calls <code>xong()</code>:</p>
${pre('tsx', SN.formHaiLan)}
<div class="callout"><p><strong>JS quick reminder — a Promise you finish by hand.</strong> <code>new Promise&lt;void&gt;((r) =&gt; { xong = r; })</code> creates a Promise and hands you its <code>resolve</code> function, which we store in <code>xong</code>. Until someone calls <code>xong()</code>, anything that <code>await</code>s this Promise stays paused. <code>let xong!: () =&gt; void</code> — the <code>!</code> tells TypeScript "I promise this will be assigned before use".</p></div>
<p>Scenario 6 — the server refuses (Lesson 9.2 does it with a real 409 from MSW; here a fake <code>onGui</code> that throws is enough), and scenario 7 — a 501-character reason pasted in. <code>user.paste</code> is faster than typing 501 keys and is also what real users do:</p>
${pre('tsx', SN.formMayChu)}
${pre('tsx', SN.formDan)}

<h3>The test that found a real bug</h3>
${slide('rx-09', 7, 'Scenario 2 fails on the Chapter 12 app: the error stays under a valid name, the phone error never appears')}
<p>Here is what happened the first time these tests ran against the app as Chapter 12 left it:</p>
${out(OUT.formCu)}
<p>Five scenarios pass, two fail — and both failures are real. In the browser, with the production build, it is the same: type "A", press Tab (error appears), click back, type "n" so the name is "An" — the error <strong>stays</strong>, and the phone field you just left shows <strong>no</strong> error. (The screenshot on slide 7 is Chromium driven by Playwright, <code>do/ch09-kiem-form.mjs</code>.) Removing React Compiler from the build makes both behave. So what did the compiler do? This is the relevant part of the form, and what the compiler turned it into:</p>
${pre('tsx', SN.formCuLoi)}
${pre('tsx', SN.bienDich)}
${SD.loiDungEn}
<p>React Compiler memoizes (nhớ lại) each piece of JSX and rebuilds it only when an input changes, comparing inputs with <code>!==</code> — identity, not content. For the error paragraph the input is <code>e</code>, the object <code>errors.benhNhan</code>. React Hook Form, for performance, keeps <em>one</em> errors object and <strong>adds and deletes keys in place</strong>. We measured it by logging <code>e</code> on every render: after the first error, every later render sees <code>same=true</code> — the same object, with <code>hoTen</code> removed or <code>soDienThoai</code> added. To the compiler "nothing changed", so it reuses the old <code>&lt;p&gt;</code>. Notice the cruel detail in the compiled code: <code>aria-invalid</code> (<code>t9</code>) is recomputed every render, so the field correctly says "valid" while the stale message still says it is not.</p>
${slide('rx-09', 8, 'The fix: read the error strings first — strings compare by value, the compiler sees the change')}
<p>The fix is small and keeps the component compiled: read the <em>strings</em> out of <code>errors</code> at the top of the render, and use only those strings in the JSX. A string compares by value, so when the message goes from "Họ tên cần ít nhất 2 ký tự" to <code>undefined</code>, <code>!==</code> is true and the paragraph is rebuilt.</p>
${pre('tsx', SN.formMoiLoi)}
${out(OUT.form)}
<p>Chromium agrees: after the fix, "An" has no error and the phone field shows its message. Three lessons from one bug. First, <strong>this is why tests use the real build pipeline</strong>: Vitest runs <code>vite.config.ts</code>, compiler included, so the test saw what users see. Second, the React Compiler docs are explicit that it assumes your code follows the Rules of React — including "props and state are immutable"; a library that mutates objects it hands you breaks that assumption silently. Third, <strong>write tests that change a value and check the screen changed back</strong>: scenario 1 alone ("errors appear") passed on the buggy form.</p>
<div class="pitfall co-tieu-de"><strong>Trap — trusting a green build after enabling React Compiler.</strong> Chapter 12 added a test proving every component <em>compiles</em>. Compiling is not the same as behaving. Any value that a library mutates in place (form state, some table or chart libraries, objects from a non-React store) can go stale in compiled JSX. Read primitive values out first, or opt that one component out with the <code>'use no memo'</code> directive (then the Chapter 12 compiler test will list it — on purpose).</div>

<h3>The schema: test the rules as a pure function</h3>
<p>The form tests prove the wiring. The <em>rules</em> — which phone numbers are valid, how old is too old — live in <code>schema.ts</code> and are a plain function: data in, result out. Testing them without React is 10–100× faster and lets you list many cases. <code>test.each</code> runs the same test body once per row, putting the row's values into the name with <code>%s</code>:</p>
${pre('ts', SN.schemaSdt)}
<p>Birth dates need "today". The schema calls <code>new Date()</code>, so a test written today would break on a future date. <strong>Fake timers</strong> fix "now": <code>vi.useFakeTimers({ toFake: ['Date'] })</code> replaces only <code>Date</code>, and <code>vi.setSystemTime</code> sets the clock. Always restore real timers afterwards — Lesson 9.2 shows what a leaked fake clock does to user-event.</p>
${pre('ts', SN.schemaNgay)}
<p>One test deserves a note: "gõ bằng bộ gõ tổ hợp (NFD)". Vietnamese input methods can produce "Á" as one character (NFC) or as "A" plus a combining accent (NFD, two characters). The strings look identical and are not equal. Chapter 3 added <code>.normalize('NFC')</code> to the schema; this test pins that down so nobody removes it as "unnecessary".</p>

<h3>Accessibility inside tests</h3>
<p>Queries by role already enforce names and roles. For the rest — duplicate ids, missing labels, bad ARIA — the project runs <strong>axe-core</strong> (Chapter 8) inside tests. This chapter moved the helper into <code>src/test/axe.ts</code> so any test can call it:</p>
${pre('ts', SN.axe)}
${pre('tsx', SN.axeThu)}
${out(O1.axe)}
<p>Read that result carefully, because it teaches the limit of automated checks. The field that has only a placeholder <strong>passes axe</strong> (axe accepts a non-empty placeholder as a last-resort name), yet <code>getByLabelText('Số điện thoại')</code> cannot find it — the test was stricter than the tool. The unlabeled field and the icon-only button are caught. Automated checks find roughly the mechanical problems; keyboard use and reading order still need a person (Chapter 8 did both in Chromium). The package <code>vitest-axe</code> wraps the same idea as a matcher (<code>toHaveNoViolations</code>), but its latest stable release is 0.1.0 and the 1.0 line has stayed at pre-release since January 2025 (checked 09/2026); a 10-line helper over axe-core has fewer moving parts.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202, testing is often skipped, or done with <strong>Enzyme</strong> from older tutorials: <code>shallow(&lt;Form /&gt;)</code>, then <code>wrapper.find('.btn-submit').simulate('click')</code> and <code>expect(wrapper.state('loading')).toBe(true)</code> — reaching into class names and component state. → At work in 2026, React tests use <strong>Testing Library + Vitest</strong> (or Jest in older setups): render the real tree, find things by role and label, act with user-event, assert on what is visible. · <em>Why:</em> Enzyme's last release is 3.11.0 (December 2019); its official adapters stop at React 16, and there has never been an official adapter for React 18 or 19 — it simply cannot test the React you are learning. And tests that read <code>state</code> break on every refactor, even when nothing the user sees has changed. The FER202 way is not "wrong" for its time: you will meet Enzyme in codebases that are still on React 16, and the idea behind it (render, find, simulate, assert) carries over directly.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "Why Testing Library instead of Enzyme? What does 'test behaviour, not implementation' mean?"</p>
<p>Testing Library renders the real component tree into a DOM and only lets you query what a user can perceive — roles, labels, text — so tests survive refactors and double as accessibility checks. Enzyme encouraged shallow rendering and reading internal state, which couples tests to implementation; it also has no official adapter for React 18/19. "Behaviour, not implementation" means: assert on outputs a user or caller can observe (what is on screen, what was sent), never on internal state names, hook call counts or CSS classes.</p></div>
<div class="callout"><p><strong>Common interview question.</strong> "What is the difference between <code>getBy</code>, <code>queryBy</code> and <code>findBy</code>?"</p>
<p><code>getBy</code> returns one element or throws immediately; <code>queryBy</code> returns <code>null</code> when nothing matches, so it is the one for asserting absence; <code>findBy</code> returns a Promise that retries until the element appears or a timeout (1000 ms by default) — for anything asynchronous. All three throw on multiple matches; the <code>…All…</code> variants return arrays.</p></div>

<h3>▶ Run it step by step</h3>
<ol>
<li><code>npx vitest</code> (watch mode) — leave it running in a second terminal. It re-runs only the tests affected by the file you save.</li>
<li>Open <code>TheBacSi.test.tsx</code>, change <code>'Yêu thích BS. Trần Thu Hà'</code> to <code>'Yêu thích BS. Trần Thu Hoa'</code>, save. Read the role list in the failure. Undo.</li>
<li>In the same file, remove <code>await</code> in front of <code>user.click(nut)</code>. Save, watch it fail with "got 0 times". Undo.</li>
<li>Run only the form tests with their names printed: <code>npx vitest run src/features/dat-lich --reporter=verbose</code>.</li>
<li>Filter by name: <code>npx vitest run -t "onTouched"</code> runs every test whose name contains "onTouched".</li>
<li>Put <code>screen.debug()</code> after <code>await user.click(gui)</code> in the empty-form test; read the four error paragraphs in the printed DOM. Remove it.</li>
</ol>

<h3>🛠 Keep building the project — step 1/4: the booking form's test suite (and its bug)</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after Chapter 12 (<code>src/features/dat-lich/FormDatLich.tsx</code>, <code>schema.ts</code>; <code>src/test/setup.ts</code>; <code>vite.config.ts</code> with React Compiler). If you studied Chapter 9 before Chapter 12, your project has no compiler: the two "bug" tests will already pass, and step 3 below is still a good change.</p><ol>
<li>Create <code>src/features/bac-si/components/TheBacSi.test.tsx</code> with the four tests above.</li>
<li>Create <code>src/features/dat-lich/FormDatLich.test.tsx</code>: the <code>veForm</code> helper and the seven scenarios.</li>
<li>Run them. If scenarios 2 and 3 fail as shown, fix <code>FormDatLich.tsx</code> by reading the error strings into a <code>loi</code> object first.</li>
<li>Create <code>src/features/dat-lich/schema.test.ts</code> (phone numbers with <code>test.each</code>, names including NFD, birth dates with a fake <code>Date</code>, blank reason).</li>
<li>Create <code>src/test/axe.ts</code> with <code>loiAxe()</code> and call it at the end of the empty-form scenario.</li>
</ol>
<p><strong>Done when:</strong> <code>npx vitest run src/features/dat-lich src/features/bac-si/components</code> is green (4 + 7 + 17 = 28 tests), <code>npx tsc -b</code> prints nothing, <strong>and</strong> each test can be made red: remove <code>.trim()</code> from <code>hoTen</code> in the schema (2 tests fail) and remove <code>disabled={isSubmitting}</code> from the button (1 test fails). A test that stays green when you break the code is not testing anything.</p></div>
<details><summary>Solution</summary>
<p>All four files are printed above in full: <code>TheBacSi.test.tsx</code>, <code>FormDatLich.test.tsx</code> (helper + seven scenarios), <code>schema.test.ts</code> and <code>src/test/axe.ts</code>, plus the <code>loi</code> object in <code>FormDatLich.tsx</code>. Two details people miss: <code>userEvent.setup()</code> is called inside <code>veForm</code> <em>before</em> <code>render</code>, and every JSX use of an error message must go through <code>loi.…</code> — including <code>aria-describedby</code> and <code>aria-invalid</code>, not only the paragraph. Run on 26/09/2026 against the final code: all tests of the step green; the two deliberate breaks gave:</p>
${out(O1.dotBien)}
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> test <code>ChipChuyenKhoa</code> (the speciality chips) on its own.</p><ol>
<li>Render <code>&lt;ChipChuyenKhoa giaTri="nhi" onDoi={onDoi} /&gt;</code> with <code>onDoi = vi.fn()</code>.</li>
<li>Assert the group is found by <code>getByRole('group', { name: 'Lọc theo chuyên khoa' })</code> and has 5 buttons (use <code>within</code> + <code>getAllByRole</code>).</li>
<li>Assert "Nhi" is <code>{ pressed: true }</code> and "Tất cả" is <code>{ pressed: false }</code>.</li>
<li>Click "Da liễu" and assert <code>onDoi</code> was called once with <code>'da-lieu'</code>.</li>
<li>Break it on purpose: change <code>aria-pressed={ck === giaTri}</code> to <code>aria-pressed={false}</code> in the component and watch step 3 fail. Undo.</li>
</ol><p><strong>Done when:</strong> the new file has 2–3 green tests, uses no <code>querySelector</code> and no test ids, and the deliberate break turns exactly one of them red.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">test runner (Vitest)</span><span class="v">finds and runs test files, prints ✓/×, watches for changes</span></div>
<div class="kv"><span class="k">jsdom</span><span class="v">a browser DOM written in JavaScript: elements and events, no layout or painting</span></div>
<div class="kv"><span class="k">role / accessible name</span><span class="v">what an element is to assistive tech, and what a screen reader calls it</span></div>
<div class="kv"><span class="k">getBy / queryBy / findBy</span><span class="v">throws / returns null / waits (Promise) when the element is not there</span></div>
<div class="kv"><span class="k">user-event</span><span class="v">simulates a person: full event sequences for click, type, tab, paste</span></div>
<div class="kv"><span class="k">jest-dom matcher</span><span class="v">DOM-aware assertion such as <code>toBeDisabled</code>, <code>toHaveAccessibleDescription</code></span></div>
<div class="kv"><span class="k">mock function (<code>vi.fn</code>)</span><span class="v">a fake function that records its calls</span></div>
<div class="kv"><span class="k">in-place mutation</span><span class="v">changing an object's contents while keeping its identity — invisible to <code>!==</code></span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A test arranges, acts, asserts — and should know only what a user knows: roles, labels, visible text.</li>
<li>Prefer <code>getByRole</code> and <code>getByLabelText</code>; they double as accessibility checks. <code>getByTestId</code> is the last resort.</li>
<li><code>getBy</code> for "is there", <code>queryBy</code> for "is not there", <code>findBy</code> for "will be there"; a failed query prints the list of roles — read it.</li>
<li>Use <code>userEvent.setup()</code> before render and <code>await</code> every action; <code>fireEvent</code> fires one event and skips focus, blur and waiting.</li>
<li>The form tests found a real bug: React Hook Form mutates its errors object in place and React Compiler compared it by identity; reading the error strings first fixed it.</li>
<li>Test rules (schema) as pure functions with <code>test.each</code> and a fake <code>Date</code>; run axe in tests for mechanical a11y problems.</li>
</ul>

${LINK('https://testing-library.com/docs/queries/about#priority', '🔎', 'Testing Library — Queries and their priority', 'Which query to use, in order.')}
${LINK('https://testing-library.com/docs/user-event/intro', '🖱', 'user-event — Introduction', 'Why simulate interactions instead of dispatching events.')}
${LINK('https://github.com/testing-library/jest-dom#custom-matchers', '✅', 'jest-dom — Custom matchers', 'The full list with examples.')}
${LINK('https://react.dev/learn/react-compiler/introduction', '🤖', 'react.dev — React Compiler', 'What it memoizes and the rules it assumes.')}
${LINK_TRONG('/courses/testing', '🧪', 'Course: Testing', 'Unit, integration, E2E and CI testing beyond React.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Testing Library căn bản: hỏi theo vai trò, thao tác bằng user-event, kiểm bằng jest-dom</h2>
<p class="lead">Tới giờ bạn kiểm app phòng khám bằng cách mở trình duyệt, bấm lung tung và nhìn. Làm vậy được một lần. Lần thứ bốn mươi thì không — sau một lần sửa lớn, lúc 11 giờ đêm, khi bạn đã quên rằng ô số điện thoại chấp nhận "+84". <strong>Test</strong> là một chương trình nhỏ bấm và nhìn thay bạn, trong một giây, mỗi lần bạn lưu file. Bài này dạy cách giới React viết test năm 2026 — <strong>Testing Library</strong>: tìm phần tử như người dùng tìm (theo việc nó <em>là gì</em> và nó <em>nói gì</em>), thao tác như người dùng thao tác (<strong>user-event</strong>), và kiểm đúng thứ người dùng thấy (<strong>jest-dom</strong>). Rồi ta chĩa nó vào form đặt lịch — và ngay lần chạy đầu tiên nó lôi ra một bug đã nằm trong app từ Chương 12.</p>
<p>Chuẩn bị: app phòng khám như sau Chương 12 — 47 test trong 11 file, tất cả xanh; <code>use()</code> + Suspense ở <code>/bac-si/:id</code>, <code>useOptimistic</code> khi huỷ lịch, form góp ý bằng <code>useActionState</code>, <strong>React Compiler đang bật</strong> trong <code>vite.config.ts</code>, MSW làm API giả. Phiên bản: React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2, jsdom 29.1.1, @testing-library/react 16.3.3, @testing-library/dom 10.4.2, @testing-library/user-event 14.6.7, @testing-library/jest-dom 7.0.1, React Hook Form 7.88.0, Zod 4.6.5, axe-core 4.13.0 (kiểm 26/09/2026). Nếu bạn học chương này trước Chương 12 cũng không sao: test ở đây không cần các tính năng đó, và hai chỗ đụng tới chúng đều có link quay lại.</p>

<h3>Dự án đã có gì, và mỗi mảnh làm việc gì</h3>
<p>Bạn gặp Vitest từ Mục 0 (một test tìm thấy tiêu đề trang), và chương nào cũng thêm vài test làm "tiêu chí đạt". Nên bộ máy đã có sẵn; chương này dạy dùng nó cho tốt. Năm mảnh làm việc cùng nhau:</p>
<table>
<thead><tr><th>Mảnh</th><th>Phiên bản</th><th>Việc</th></tr></thead>
<tbody>
<tr><td><strong>Vitest</strong></td><td>5.0.2</td><td>Trình chạy test (test runner): tìm file <code>*.test.ts(x)</code>, chạy, in ✓/×. Dùng CHUNG cấu hình Vite với app, nên import <code>@/…</code> và React Compiler chạy được cả trong test.</td></tr>
<tr><td><strong>jsdom</strong></td><td>29.1.1</td><td>Trình duyệt giả viết bằng JavaScript: có <code>document</code>, phần tử, sự kiện — nhưng không tính bố cục, không vẽ, không cuộn.</td></tr>
<tr><td><strong>@testing-library/react</strong></td><td>16.3.3</td><td><code>render()</code> đặt component vào jsdom; <code>screen</code> cho bạn hỏi những gì đang có trên "màn hình".</td></tr>
<tr><td><strong>@testing-library/user-event</strong></td><td>14.6.7</td><td>Giả lập một con người: một cú bấm là nhấn chuột, focus, nhả chuột, click; gõ là từng phím một.</td></tr>
<tr><td><strong>@testing-library/jest-dom</strong></td><td>7.0.1</td><td>Thêm các phép kiểm cho DOM: <code>toBeInTheDocument</code>, <code>toHaveTextContent</code>, <code>toBeDisabled</code>, <code>toHaveAccessibleDescription</code>…</td></tr>
</tbody>
</table>
<p>Chúng được nối với nhau ở hai file bạn nên đọc một lần. <code>vite.config.ts</code> có <code>test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'] }</code>. <code>src/test/setup.ts</code> chạy trước mọi file test: nạp các phép kiểm của jest-dom, bật máy chủ API giả, và sau mỗi test thì dọn DOM, trả cơ sở dữ liệu giả, URL và các store Zustand về như mới (Bài 9.2 giải thích vì sao từng dòng có mặt — hai dòng trong đó được thêm ở chương này sau khi đo).</p>
<div class="callout"><p><strong>JS nhắc nhanh — <code>async</code>/<code>await</code> và arrow function trong test.</strong> <code>test('tên', async () =&gt; { … })</code> truyền vào một <em>arrow function</em> (cách viết hàm ngắn gọn) có <code>async</code>: bên trong được viết <code>await việcGì</code>, tức là tạm dừng test tới khi Promise <code>việcGì</code> xong. Gần như mọi lời gọi user-event đều trả về Promise, nên gần như mọi dòng bấm hay gõ đều mở đầu bằng <code>await</code>. Quên nó là test chạy tiếp trước khi cú bấm kịp xảy ra — bạn sẽ thấy đúng lỗi đó ở dưới.</p></div>

<h3>Test đầu tiên: chuẩn bị, hành động, kiểm</h3>
<p>Test nào cũng ba nhịp. <strong>Arrange</strong> (chuẩn bị): đặt component lên màn hình với dữ liệu nó cần. <strong>Act</strong> (hành động): làm đúng việc người dùng làm. <strong>Assert</strong> (kiểm): xem người dùng lúc này thấy gì. Đây là test cho thẻ bác sĩ <code>TheBacSi</code> từ Chương 1 — không cần router, không cần API, vì khi không có <code>coLienKet</code> thì thẻ không có link:</p>
${pre('tsx', SN.theBacSiTest)}
${out(OUT.theBacSi)}
<p>Đọc từng dòng và để ý những thứ KHÔNG có mặt. Không có <code>container.querySelector('.the-bac-si h3')</code>, không đọc props hay state, không biết gì về <code>memo</code> hay bộ đếm <code>useDemRender</code> bên trong thẻ. Test chỉ biết những gì một người ngồi trước màn hình biết: "có một bài viết tên BS. Trần Thu Hà, ghi Nhi và 8 năm kinh nghiệm, có một nút trái tim, bấm vào thì có chuyện xảy ra". Đó là toàn bộ triết lý của Testing Library, gói trong câu của tác giả Kent C. Dodds: <em>"Test càng giống cách phần mềm được dùng, nó càng cho bạn nhiều niềm tin."</em> Phần thưởng: bạn đổi tên mọi class CSS, tách thẻ thành ba component, hay bọc nó trong <code>memo</code> — test này vẫn xanh, vì không việc nào trong đó đổi thứ người dùng nhìn thấy.</p>
<div class="callout"><p><strong>JS nhắc nhanh — <code>vi.fn()</code> và destructuring.</strong> <code>vi.fn()</code> tạo một <em>hàm giả</em> (mock function): gọi nó chẳng làm gì cả, nhưng nó ghi lại mọi lần bị gọi, nên <code>expect(onDoiYeuThich).toHaveBeenCalledWith('bs-2')</code> hỏi được "mày có bị gọi không, với tham số gì?". <code>const { rerender } = render(…)</code> là <em>destructuring</em> (tách phần tử): <code>render</code> trả về một object nhiều trường, dòng này chỉ lấy trường <code>rerender</code> ra một biến cùng tên.</p></div>

<h3>Hỏi theo vai trò: hỏi DOM thứ người dùng nhìn thấy</h3>
${slide('rx-09', 3, 'Hỏi DOM theo vai trò: hỏi thứ người dùng thấy, không hỏi nó mang class gì')}
<p><strong>Vai trò</strong> (role) là việc một phần tử <em>là gì</em> đối với công nghệ hỗ trợ: <code>button</code>, <code>link</code>, <code>heading</code>, <code>textbox</code>, <code>radio</code>, <code>alert</code>, <code>article</code>, <code>region</code>… Phần lớn thẻ HTML có sẵn vai trò (<code>&lt;button&gt;</code> là button, <code>&lt;h3&gt;</code> là heading cấp 3, <code>&lt;input type="radio"&gt;</code> là radio). <strong>Tên truy cập</strong> (accessible name) là thứ trình đọc màn hình đọc lên cho nó: chữ bên trong nút, <code>&lt;label&gt;</code> của ô nhập, hoặc <code>aria-label</code>. Vì vậy <code>getByRole('button', { name: 'Yêu thích BS. Trần Thu Hà' })</code> hỏi đúng thứ mà trình đọc màn hình của một người khiếm thị sẽ tìm thấy.</p>
${SD.uuTienVi}
<p>Testing Library ghi rõ một thứ tự ưu tiên cho các truy vấn. Đầu danh sách là thứ người dùng cảm nhận được; cuối danh sách là lối thoát hiểm:</p>
<table>
<thead><tr><th>Truy vấn</th><th>Dùng cho</th><th>Trong app này</th></tr></thead>
<tbody>
<tr><td><code>getByRole</code></td><td>gần như mọi thứ tương tác được hoặc mang cấu trúc</td><td>nút, link, tiêu đề, radio, <code>alert</code>, <code>region</code></td></tr>
<tr><td><code>getByLabelText</code></td><td>ô nhập của form</td><td>"Họ và tên", "Số điện thoại", "Tìm theo tên"</td></tr>
<tr><td><code>getByPlaceholderText</code></td><td>chỉ khi ô thật sự không có nhãn</td><td>— (ô nào cũng có nhãn)</td></tr>
<tr><td><code>getByText</code></td><td>chữ không tương tác</td><td>"Bác sĩ lâu năm", câu báo lỗi</td></tr>
<tr><td><code>getByDisplayValue</code></td><td>giá trị hiện tại của một ô</td><td>ít dùng; <code>toHaveValue</code> rõ hơn</td></tr>
<tr><td><code>getByAltText</code> / <code>getByTitle</code></td><td>ảnh, tooltip</td><td>—</td></tr>
<tr><td><code>getByTestId</code></td><td>đường cuối cùng, khi không có gì người dùng thấy để nhận ra nó</td><td>không dùng ở đâu trong bộ test</td></tr>
</tbody>
</table>
<p>Một tác dụng phụ đáng giá: <strong>test hỏi theo vai trò cũng là một phép kiểm khả năng tiếp cận.</strong> Nếu <code>getByLabelText('Số điện thoại')</code> không tìm được ô số điện thoại, thì trình đọc màn hình cũng không đọc được nó. Ở Chương 8, các chip ngày khám thành radio thật; những test viết <code>getByRole('radio', { name: '02/10/2026' })</code> hẳn đã đỏ với bản <code>&lt;button aria-pressed&gt;</code> cũ — mà đó chính là bug Chương 8 đã sửa.</p>
<p>Hai tuỳ chọn nữa của <code>getByRole</code> mà bộ test dùng: <code>{ level: 2 }</code> cho tiêu đề (<code>getByRole('heading', { level: 2, name: 'BS. Trần Thu Hà' })</code>), và bộ lọc trạng thái như <code>{ pressed: false }</code>, <code>{ checked: true }</code>, <code>{ expanded: true }</code> — khớp theo trạng thái ARIA, nên kiêm luôn việc kiểm trạng thái đó có được đọc lên không.</p>

<h3>getBy, queryBy, findBy — ba cách hỏi, ba cách trả lời</h3>
${slide('rx-09', 4, 'getBy ném lỗi, queryBy trả null, findBy đợi: chọn theo điều bạn mong đợi')}
<p>Mỗi truy vấn có ba biến thể (và mỗi biến thể có bản <code>…All…</code> trả về mảng). Chúng chỉ khác nhau ở chỗ làm gì khi câu trả lời không phải "đúng một phần tử, ngay bây giờ":</p>
<table>
<thead><tr><th></th><th>không thấy</th><th>thấy 1</th><th>thấy nhiều hơn 1</th><th>có đợi?</th><th>dùng khi…</th></tr></thead>
<tbody>
<tr><td><code>getBy…</code></td><td>ném lỗi</td><td>trả về nó</td><td>ném lỗi</td><td>không</td><td>nó phải có ngay lúc này</td></tr>
<tr><td><code>queryBy…</code></td><td><code>null</code></td><td>trả về nó</td><td>ném lỗi</td><td>không</td><td>kiểm rằng một thứ <strong>không có</strong></td></tr>
<tr><td><code>findBy…</code></td><td>từ chối sau 1000 ms</td><td>trả về (Promise)</td><td>từ chối</td><td><strong>có</strong>, hỏi lại mỗi khi DOM đổi và mỗi 50 ms</td><td>nó sẽ xuất hiện (dữ liệu, kiểm form, trang lazy)</td></tr>
</tbody>
</table>
<p>Test thứ hai ở trên dùng hàng giữa: sau khi <code>rerender</code> với một bác sĩ trẻ, <code>expect(screen.queryByText('Bác sĩ lâu năm')).not.toBeInTheDocument()</code>. Sao không <code>getByText</code>? Vì <code>getBy</code> ném lỗi ngay khi không tìm thấy — trước cả khi <code>expect</code> kịp chạy. Bản cố ý sai (các bản sai nằm ở <code>src/vi-du/ch09/*.sai.tsx</code>, chạy bằng cấu hình riêng để bộ test thường vẫn xanh):</p>
${pre('tsx', SN.sai2)}
${out(OUT.sai2)}
<p>Thông báo lỗi thì thật thà nhưng gây hiểu lầm — nó đoán chữ của bạn bị chia ra nhiều thẻ. Không phải; chữ đó không có, mà đó lại chính là điều bạn muốn chứng minh. Hàng thứ ba, <code>findBy</code>, là chủ đề của Bài 9.2; form đặt lịch ở dưới đã cần nó một lần.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — <code>getByRole</code> khớp nhiều hơn một phần tử.</strong> <code>screen.getByRole('button')</code> trên danh sách bác sĩ ném lỗi "Found multiple elements with the role button" — sáu nút trái tim. Thu hẹp lại: thêm <code>{ name: … }</code>, hoặc giới hạn vùng tìm bằng <code>within(the)</code> với <code>the</code> là một thẻ. <code>within(phầnTử).getBy…</code> chỉ tìm bên trong phần tử đó; test ở Bài 9.2 dùng nó để tìm nút "Thử lại" bên trong đúng một hộp lỗi.</div>

<h3>Truy vấn hỏng thì đọc cái danh sách nó in ra</h3>
${slide('rx-09', 5, 'getByRole hỏng in ra mọi vai trò và tên trên màn hình — câu trả lời thường nằm trong đó')}
<p>Người mới mất nhiều thời gian nhất ở đây: truy vấn hỏng, output dài, họ cuộn qua luôn. Đừng. Một <code>getByRole</code> hỏng in ra <em>mọi vai trò và tên truy cập đang có trên màn hình</em>, rồi mới tới DOM. Cách sửa gần như luôn nhìn thấy được trong danh sách đó. Sai một chữ trong tên bác sĩ:</p>
${pre('tsx', SN.sai1)}
${out(OUT.sai1)}
<p>"Hà", không phải "Hoa" — và danh sách cho sẵn đúng chuỗi để chép. Thêm hai công cụ khi bạn lạc: <code>screen.debug()</code> in DOM hiện tại (hoặc một phần tử: <code>screen.debug(the)</code>), và <code>logRoles(container)</code> từ <code>@testing-library/react</code> in đúng danh sách vai trò như trên mà không cần phải hỏng trước.</p>

<h3>user-event, không phải fireEvent: một cú bấm là nhiều sự kiện</h3>
${slide('rx-09', 6, 'user.type bắn 16 sự kiện cho hai chữ; fireEvent.change bắn một')}
<p>Testing Library có hai cách để "làm" một việc. <code>fireEvent</code> (từ <code>@testing-library/react</code>) phát <strong>một</strong> sự kiện DOM do bạn chỉ định. <code>user-event</code> giả lập đúng những gì trình duyệt làm khi <strong>một con người</strong> thao tác: một cú bấm là pointer-down, mouse-down, focus, pointer-up, mouse-up, click; gõ một chữ là key-down, key-press, before-input, input, key-up. Ta đã đếm, trong <code>src/vi-du/ch09/bai1.test.tsx</code>:</p>
${pre('tsx', SN.fireEvent)}
${out(O1.fire)}
${SD.suKienVi}
<p>Chuyện đó quan trọng vì sao? Vì component thật nghe cả những sự kiện bạn không nghĩ tới. React Hook Form với <code>mode: 'onTouched'</code> kiểm lỗi khi <strong>rời ô</strong> (blur), và Zod chạy qua một resolver bất đồng bộ — nó trả lời bằng Promise, không trả lời ngay. Dùng <code>fireEvent</code> thì bạn phải nhớ tự bắn blur <em>và</em> tự đợi; dùng user-event thì <code>await user.tab()</code> dời focus đúng như người dùng bàn phím, và <code>await</code> đợi thêm một nhịp sau mỗi thao tác. Còn một cái giá thứ hai, lặng lẽ hơn: test <code>fireEvent</code> kết thúc trong lúc Zod vẫn đang làm việc, nên React cập nhật form <em>sau khi</em> test đã xong — ngoài <code>act</code> — và in ra thế này (khi cảnh báo <code>act</code> đã được bật, xem Bài 9.2):</p>
${out(OUT.actFire)}
<p>Luật mà tài liệu Testing Library đưa ra, và khoá này làm theo: <strong>dùng user-event</strong>; chỉ dùng <code>fireEvent</code> cho sự kiện user-event không mô phỏng (một cú <code>scroll</code>, một sự kiện tự đặt) hoặc khi đồng hồ giả làm user-event khó dùng (Bài 9.2). Luôn tạo người dùng bằng <code>const user = userEvent.setup()</code> <em>trước khi</em> render, và <code>await</code> mọi lời gọi.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — quên <code>await</code> trước <code>user.click</code>.</strong> TypeScript không kêu (bỏ qua một Promise là hợp lệ), test đọc rất xuôi, và nó hỏng theo kiểu trông như component bị lỗi:</div>
${pre('tsx', SN.sai3)}
${out(OUT.sai3)}
<p>Lúc <code>expect</code> chạy thì cú bấm chưa xảy ra. Hễ test báo "expected to be called 1 times, but got 0 times" mà bạn chắc nút vẫn chạy, hãy tìm chỗ thiếu <code>await</code> trước tiên. (Chữ <code>void</code> đứng trước là cách nói với TypeScript và linter "tôi biết mình đang bỏ qua Promise này" — ở đây cố ý, để cho thấy bug.)</p>

<h3>jest-dom: phép kiểm đọc lên như màn hình</h3>
<p><code>expect(x).toBe(y)</code> so hai giá trị. Với DOM, bạn muốn phép kiểm nói về thứ người dùng cảm nhận, và in thông báo có ích khi hỏng. jest-dom thêm chúng; <code>src/test/setup.ts</code> nạp bằng <code>import '@testing-library/jest-dom/vitest'</code>. Những cái chương này dùng:</p>
<table>
<thead><tr><th>Phép kiểm</th><th>Kiểm gì</th><th>Ví dụ trong bộ test</th></tr></thead>
<tbody>
<tr><td><code>toBeInTheDocument()</code></td><td>phần tử đang gắn trong trang</td><td>nhãn "Bác sĩ lâu năm"</td></tr>
<tr><td><code>toHaveTextContent(chữ | /re/)</code></td><td>chữ bên trong có đoạn này</td><td>hộp lỗi có câu của máy chủ</td></tr>
<tr><td><code>toHaveAttribute(tên, giáTrị?)</code></td><td>một thuộc tính</td><td><code>aria-busy="true"</code> trên khung xương</td></tr>
<tr><td><code>toBeDisabled()</code> / <code>toBeEnabled()</code></td><td>nút/ô bị (không bị) khoá</td><td>nút gửi trong lúc đang gửi</td></tr>
<tr><td><code>toHaveValue(v)</code></td><td>giá trị hiện tại của ô</td><td>ô họ tên giữ nguyên chữ đã gõ</td></tr>
<tr><td><code>toBeChecked()</code></td><td>trạng thái checkbox/radio</td><td>radio ngày "02/10/2026"</td></tr>
<tr><td><code>toBeInvalid()</code> / <code>toBeValid()</code></td><td><code>aria-invalid</code> / tính hợp lệ của form</td><td>ô họ tên sau khi gõ sai</td></tr>
<tr><td><code>toHaveAccessibleDescription(chữ)</code></td><td>thứ trình đọc màn hình đọc <em>sau</em> tên (từ <code>aria-describedby</code>)</td><td>câu lỗi của từng ô</td></tr>
<tr><td><code>toHaveAccessibleName(chữ)</code></td><td>tên truy cập đã tính</td><td>danh sách giờ "Giờ khám ngày 02/10/2026"</td></tr>
<tr><td><code>toHaveFocus()</code></td><td>phần tử đang giữ focus bàn phím</td><td>link bỏ qua sau phím Tab đầu tiên</td></tr>
</tbody>
</table>
<p>Cái nên nhớ nhất trong bảng là <code>toHaveAccessibleDescription</code>. Form đặt lịch gắn mỗi câu lỗi vào đúng ô của nó bằng <code>aria-describedby</code>. Kiểm <em>mô tả</em> thay vì "có câu chữ này ở đâu đó" chứng minh hai điều một lúc: đúng câu lỗi đang hiện, <em>và</em> nó gắn vào đúng ô. Nửa sau đó chính là chỗ bug dưới đây ẩn náu.</p>

<h3>Test form đặt lịch (React Hook Form + Zod)</h3>
<p><code>FormDatLich</code> (Chương 3) nhận một bác sĩ và hàm <code>onGui</code>, kiểm bằng schema Zod qua <code>zodResolver</code>, và chỉ gọi <code>onGui</code> với dữ liệu đã sạch. Ta test nó đứng riêng — không router, không API — bằng cách truyền vào một <strong><code>onGui</code> giả</strong>. Một hàm phụ vẽ form và trả về các ô, để mỗi test đọc lên như một kịch bản:</p>
${pre('tsx', SN.veForm)}
<p>Kịch bản 1 — người dùng bấm "Gửi yêu cầu" khi form còn trống. Phải hiện đủ bốn lỗi, lỗi nào gắn đúng ô nấy, ô họ tên phải bị đánh dấu không hợp lệ, không có gì được gửi đi, và trang vẫn phải qua được axe (nói về axe ở cuối bài):</p>
${pre('tsx', SN.formTrong)}
<p>Kịch bản 2 — <code>mode: 'onTouched'</code> hứa một form lịch sự: đang gõ thì chưa báo lỗi, rời ô mới báo, và lỗi biến mất ngay khi giá trị hợp lệ. Kịch bản 3 — hai lỗi trong cùng một nhóm ô (<code>benhNhan</code>):</p>
${pre('tsx', SN.formTouched)}
${pre('tsx', SN.formHaiLoi)}
<p>Kịch bản 4 — form thật ra gửi đi cái gì? Schema cắt khoảng trắng họ tên, bỏ dấu cách và dấu chấm trong số điện thoại, đổi <code>+84</code> thành <code>0</code>. Kiểm đúng object mà <code>onGui</code> nhận được là chứng minh việc làm sạch chạy từ đầu tới cuối, qua resolver thật:</p>
${pre('tsx', SN.formSach)}
<p>Kịch bản 5 — bug "bấm hai lần" mà form đặt lịch nào cũng từng dính. Ta cần <code>onGui</code> "đang bay" trong lúc bấm tiếp. Một Promise mà ta giữ hàm <code>resolve</code> của nó trong một biến làm được đúng việc đó: máy chủ giả chỉ trả lời khi test gọi <code>xong()</code>:</p>
${pre('tsx', SN.formHaiLan)}
<div class="callout"><p><strong>JS nhắc nhanh — một Promise mình tự kết thúc.</strong> <code>new Promise&lt;void&gt;((r) =&gt; { xong = r; })</code> tạo một Promise và trao cho bạn hàm <code>resolve</code> của nó, ta cất vào <code>xong</code>. Chừng nào chưa ai gọi <code>xong()</code>, mọi thứ đang <code>await</code> Promise này đều đứng chờ. <code>let xong!: () =&gt; void</code> — dấu <code>!</code> nói với TypeScript "tôi hứa biến này được gán trước khi dùng".</p></div>
<p>Kịch bản 6 — máy chủ từ chối (Bài 9.2 làm bằng một lỗi 409 thật từ MSW; ở đây một <code>onGui</code> giả ném lỗi là đủ), và kịch bản 7 — dán vào một lý do dài 501 ký tự. <code>user.paste</code> nhanh hơn gõ 501 phím, và cũng là việc người dùng thật hay làm:</p>
${pre('tsx', SN.formMayChu)}
${pre('tsx', SN.formDan)}

<h3>Cái test tìm ra một bug thật</h3>
${slide('rx-09', 7, 'Kịch bản 2 đỏ trên app Chương 12: lỗi đứng dưới một họ tên đã hợp lệ, lỗi SĐT không bao giờ hiện')}
<p>Đây là chuyện xảy ra lần đầu các test này chạy trên app như Chương 12 để lại:</p>
${out(OUT.formCu)}
<p>Năm kịch bản qua, hai kịch bản đỏ — và cả hai đều là lỗi thật. Trên trình duyệt, với bản build production, y hệt: gõ "A", bấm Tab (lỗi hiện), bấm quay lại, gõ "n" cho họ tên thành "An" — lỗi <strong>vẫn đứng đó</strong>, còn ô số điện thoại bạn vừa rời thì <strong>không</strong> hiện lỗi nào. (Ảnh chụp ở slide 7 là Chromium do Playwright điều khiển, <code>do/ch09-kiem-form.mjs</code>.) Bỏ React Compiler khỏi bản build là cả hai chạy đúng. Vậy compiler đã làm gì? Đây là phần liên quan của form, và thứ compiler biến nó thành:</p>
${pre('tsx', SN.formCuLoi)}
${pre('tsx', SN.bienDich)}
${SD.loiDungVi}
<p>React Compiler ghi nhớ (memoize) từng khúc JSX và chỉ dựng lại khi một đầu vào thay đổi, so đầu vào bằng <code>!==</code> — so <em>danh tính</em>, không so nội dung. Với đoạn báo lỗi, đầu vào là <code>e</code>, tức object <code>errors.benhNhan</code>. React Hook Form, vì hiệu năng, giữ <em>một</em> object lỗi và <strong>thêm, xoá khoá ngay trên object đó</strong> (sửa tại chỗ). Ta đã đo bằng cách ghi <code>e</code> ra ở mỗi lần render: sau lỗi đầu tiên, mọi lần render sau đều thấy <code>same=true</code> — cùng một object, bị xoá <code>hoTen</code> hoặc thêm <code>soDienThoai</code>. Với compiler thì "chẳng có gì đổi", nên nó dùng lại thẻ <code>&lt;p&gt;</code> cũ. Để ý chi tiết trớ trêu trong mã đã biên dịch: <code>aria-invalid</code> (<code>t9</code>) được tính lại mỗi lần render, nên ô nói đúng "hợp lệ" trong khi câu lỗi cũ vẫn bảo là không.</p>
${slide('rx-09', 8, 'Cách sửa: rút chuỗi lỗi ra trước — chuỗi so bằng giá trị, compiler thấy nó đổi')}
<p>Cách sửa nhỏ và component vẫn được biên dịch: rút các <em>chuỗi</em> lỗi ra khỏi <code>errors</code> ngay đầu hàm render, và JSX chỉ dùng những chuỗi đó. Chuỗi so bằng giá trị, nên khi câu lỗi đi từ "Họ tên cần ít nhất 2 ký tự" thành <code>undefined</code>, <code>!==</code> ra true và đoạn báo lỗi được dựng lại.</p>
${pre('tsx', SN.formMoiLoi)}
${out(OUT.form)}
<p>Chromium cũng đồng ý: sau khi sửa, "An" không còn lỗi, ô số điện thoại hiện đúng câu của nó. Ba bài học từ một bug. Một, <strong>đây là lý do test chạy qua đúng đường build thật</strong>: Vitest dùng <code>vite.config.ts</code>, có cả compiler, nên test thấy đúng thứ người dùng thấy. Hai, tài liệu React Compiler nói rõ nó giả định mã của bạn tuân theo Rules of React — trong đó có "props và state là bất biến"; một thư viện sửa tại chỗ object nó đưa cho bạn là phá giả định đó một cách âm thầm. Ba, <strong>viết test đổi một giá trị rồi kiểm màn hình đổi theo</strong>: riêng kịch bản 1 ("lỗi có hiện") thì vẫn qua trên form có bug.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — tin bản build xanh sau khi bật React Compiler.</strong> Chương 12 đã thêm một test chứng minh mọi component đều <em>biên dịch được</em>. Biên dịch được khác với chạy đúng. Giá trị nào bị thư viện sửa tại chỗ (state của form, vài thư viện bảng hay biểu đồ, object từ một store không phải của React) đều có thể "đứng hình" trong JSX đã biên dịch. Rút giá trị nguyên thuỷ (chuỗi, số, boolean) ra trước, hoặc cho riêng component đó ra khỏi compiler bằng chỉ thị <code>'use no memo'</code> (khi đó test compiler của Chương 12 sẽ liệt kê nó — đúng như mong muốn).</div>

<h3>Schema: test luật như một hàm thuần</h3>
<p>Test form chứng minh các mối nối. Còn <em>luật</em> — số điện thoại nào hợp lệ, bao nhiêu tuổi là quá — nằm trong <code>schema.ts</code> và chỉ là một hàm: dữ liệu vào, kết quả ra. Test chúng không cần React thì nhanh hơn 10–100 lần và liệt kê được nhiều trường hợp. <code>test.each</code> chạy cùng một thân test cho mỗi hàng dữ liệu, đặt giá trị của hàng vào tên test qua <code>%s</code>:</p>
${pre('ts', SN.schemaSdt)}
<p>Ngày sinh thì cần biết "hôm nay". Schema gọi <code>new Date()</code>, nên test viết hôm nay sẽ gãy vào một ngày nào đó trong tương lai. <strong>Đồng hồ giả</strong> (fake timers) cố định "bây giờ": <code>vi.useFakeTimers({ toFake: ['Date'] })</code> chỉ thay <code>Date</code>, còn <code>vi.setSystemTime</code> chỉnh giờ. Luôn trả đồng hồ thật về sau đó — Bài 9.2 cho thấy một đồng hồ giả bị bỏ quên làm gì với user-event.</p>
${pre('ts', SN.schemaNgay)}
<p>Một test đáng nói thêm: "gõ bằng bộ gõ tổ hợp (NFD)". Bộ gõ tiếng Việt có thể sinh "Á" là một ký tự (NFC) hoặc là "A" cộng một dấu rời (NFD, hai ký tự). Hai chuỗi trông y hệt mà không bằng nhau. Chương 3 đã thêm <code>.normalize('NFC')</code> vào schema; test này ghim nó lại để không ai xoá đi vì tưởng "thừa".</p>

<h3>Khả năng tiếp cận ngay trong test</h3>
<p>Truy vấn theo vai trò đã ép có tên và vai trò. Phần còn lại — id trùng, thiếu nhãn, ARIA sai — dự án chạy <strong>axe-core</strong> (Chương 8) ngay trong test. Chương này dời hàm phụ vào <code>src/test/axe.ts</code> để test nào cũng gọi được:</p>
${pre('ts', SN.axe)}
${pre('tsx', SN.axeThu)}
${out(O1.axe)}
<p>Đọc kết quả đó cho kỹ, vì nó dạy giới hạn của phép kiểm tự động. Ô chỉ có placeholder <strong>qua được axe</strong> (axe chấp nhận placeholder không rỗng làm tên, như đường cuối cùng), thế mà <code>getByLabelText('Số điện thoại')</code> không tìm được nó — test còn khắt khe hơn công cụ. Ô không nhãn và nút chỉ có biểu tượng thì bị bắt. Kiểm tự động tìm được phần lỗi "máy móc"; dùng bằng bàn phím và thứ tự đọc thì vẫn cần một con người (Chương 8 đã làm cả hai trên Chromium). Gói <code>vitest-axe</code> gói cùng ý đó thành một phép kiểm (<code>toHaveNoViolations</code>), nhưng bản ổn định mới nhất là 0.1.0 và dòng 1.0 đứng ở bản thử từ tháng 01/2025 (kiểm 09/2026); một hàm phụ 10 dòng trên axe-core ít thứ phải lo hơn.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202, test thường bị bỏ qua, hoặc làm bằng <strong>Enzyme</strong> theo các bài hướng dẫn cũ: <code>shallow(&lt;Form /&gt;)</code>, rồi <code>wrapper.find('.btn-submit').simulate('click')</code> và <code>expect(wrapper.state('loading')).toBe(true)</code> — thò tay vào tên class và state của component. → Đi làm năm 2026, test React dùng <strong>Testing Library + Vitest</strong> (hoặc Jest ở dự án cũ hơn): vẽ cây component thật, tìm theo vai trò và nhãn, thao tác bằng user-event, kiểm thứ nhìn thấy được. · <em>Vì sao:</em> bản phát hành cuối của Enzyme là 3.11.0 (12/2019); adapter chính thức dừng ở React 16, và chưa từng có adapter chính thức cho React 18 hay 19 — nó đơn giản là không test được bản React bạn đang học. Còn test đọc <code>state</code> thì gãy sau mỗi lần sửa cấu trúc, dù người dùng chẳng thấy gì khác. Cách FER202 không "sai" với thời của nó: bạn sẽ gặp Enzyme ở các codebase còn nằm ở React 16, và ý tưởng của nó (vẽ, tìm, giả lập, kiểm) mang sang được nguyên vẹn.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Vì sao dùng Testing Library thay cho Enzyme? 'Test hành vi, không test cài đặt' nghĩa là gì?"</p>
<p>Testing Library vẽ cây component thật vào DOM và chỉ cho hỏi những gì người dùng cảm nhận được — vai trò, nhãn, chữ — nên test sống sót qua các lần sửa cấu trúc và kiêm luôn phép kiểm tiếp cận. Enzyme khuyến khích vẽ nông (shallow) và đọc state bên trong, làm test dính chặt vào cách cài đặt; nó cũng không có adapter chính thức cho React 18/19. "Hành vi, không phải cài đặt" nghĩa là: kiểm đầu ra mà người dùng hay nơi gọi quan sát được (thứ trên màn hình, thứ được gửi đi), không bao giờ kiểm tên state, số lần gọi hook hay class CSS.</p></div>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "<code>getBy</code>, <code>queryBy</code> và <code>findBy</code> khác nhau thế nào?"</p>
<p><code>getBy</code> trả về một phần tử hoặc ném lỗi ngay; <code>queryBy</code> trả <code>null</code> khi không khớp, nên là cái dùng để kiểm "không có"; <code>findBy</code> trả về Promise, hỏi lại tới khi phần tử xuất hiện hoặc hết giờ (mặc định 1000 ms) — dùng cho mọi thứ bất đồng bộ. Cả ba ném lỗi khi khớp nhiều hơn một; các bản <code>…All…</code> trả về mảng.</p></div>

<h3>▶ Chạy thử từng bước</h3>
<ol>
<li><code>npx vitest</code> (chế độ theo dõi) — để nó chạy ở một terminal thứ hai. Nó chỉ chạy lại những test bị ảnh hưởng bởi file bạn vừa lưu.</li>
<li>Mở <code>TheBacSi.test.tsx</code>, đổi <code>'Yêu thích BS. Trần Thu Hà'</code> thành <code>'Yêu thích BS. Trần Thu Hoa'</code>, lưu. Đọc danh sách vai trò trong thông báo lỗi. Trả lại như cũ.</li>
<li>Cũng file đó, xoá <code>await</code> trước <code>user.click(nut)</code>. Lưu, xem nó đỏ với "got 0 times". Trả lại.</li>
<li>Chỉ chạy test của form, in tên từng test: <code>npx vitest run src/features/dat-lich --reporter=verbose</code>.</li>
<li>Lọc theo tên: <code>npx vitest run -t "onTouched"</code> chạy mọi test có tên chứa "onTouched".</li>
<li>Đặt <code>screen.debug()</code> sau <code>await user.click(gui)</code> trong test form trống; đọc bốn đoạn báo lỗi trong DOM được in ra. Xoá nó đi.</li>
</ol>

<h3>🛠 Tự gõ tiếp dự án — bước 1/4: bộ test cho form đặt lịch (và bug của nó)</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau Chương 12 (<code>src/features/dat-lich/FormDatLich.tsx</code>, <code>schema.ts</code>; <code>src/test/setup.ts</code>; <code>vite.config.ts</code> có React Compiler). Nếu bạn học Chương 9 trước Chương 12, dự án của bạn chưa có compiler: hai test "bug" sẽ xanh ngay, và bước 3 dưới đây vẫn là một thay đổi tốt.</p><ol>
<li>Tạo <code>src/features/bac-si/components/TheBacSi.test.tsx</code> với bốn test ở trên.</li>
<li>Tạo <code>src/features/dat-lich/FormDatLich.test.tsx</code>: hàm phụ <code>veForm</code> và bảy kịch bản.</li>
<li>Chạy. Nếu kịch bản 2 và 3 đỏ như trên, sửa <code>FormDatLich.tsx</code> bằng cách rút các chuỗi lỗi vào object <code>loi</code> trước.</li>
<li>Tạo <code>src/features/dat-lich/schema.test.ts</code> (số điện thoại bằng <code>test.each</code>, họ tên kể cả NFD, ngày sinh với <code>Date</code> giả, lý do chỉ có dấu cách).</li>
<li>Tạo <code>src/test/axe.ts</code> với <code>loiAxe()</code> và gọi nó ở cuối kịch bản form trống.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>npx vitest run src/features/dat-lich src/features/bac-si/components</code> xanh (4 + 7 + 17 = 28 test), <code>npx tsc -b</code> không in gì, <strong>và</strong> mỗi test đều làm đỏ được: xoá <code>.trim()</code> của <code>hoTen</code> trong schema (2 test đỏ) và xoá <code>disabled={isSubmitting}</code> của nút (1 test đỏ). Test vẫn xanh khi mã đã hỏng là test không kiểm gì cả.</p></div>
<details><summary>Lời giải</summary>
<p>Cả bốn file đã in đầy đủ ở trên: <code>TheBacSi.test.tsx</code>, <code>FormDatLich.test.tsx</code> (hàm phụ + bảy kịch bản), <code>schema.test.ts</code> và <code>src/test/axe.ts</code>, cộng object <code>loi</code> trong <code>FormDatLich.tsx</code>. Hai chi tiết hay sót: <code>userEvent.setup()</code> gọi trong <code>veForm</code> <em>trước</em> <code>render</code>, và mọi chỗ JSX dùng câu lỗi đều phải đi qua <code>loi.…</code> — kể cả <code>aria-describedby</code> và <code>aria-invalid</code>, không chỉ đoạn <code>&lt;p&gt;</code>. Chạy ngày 26/09/2026 trên mã cuối: mọi test của bước xanh; hai lần cố ý làm hỏng cho ra:</p>
${out(O1.dotBien)}
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề:</strong> test riêng <code>ChipChuyenKhoa</code> (các chip chuyên khoa).</p><ol>
<li>Vẽ <code>&lt;ChipChuyenKhoa giaTri="nhi" onDoi={onDoi} /&gt;</code> với <code>onDoi = vi.fn()</code>.</li>
<li>Kiểm nhóm tìm được bằng <code>getByRole('group', { name: 'Lọc theo chuyên khoa' })</code> và có 5 nút (dùng <code>within</code> + <code>getAllByRole</code>).</li>
<li>Kiểm "Nhi" là <code>{ pressed: true }</code> và "Tất cả" là <code>{ pressed: false }</code>.</li>
<li>Bấm "Da liễu" và kiểm <code>onDoi</code> được gọi một lần với <code>'da-lieu'</code>.</li>
<li>Cố ý làm hỏng: đổi <code>aria-pressed={ck === giaTri}</code> thành <code>aria-pressed={false}</code> trong component, xem bước 3 đỏ. Trả lại.</li>
</ol><p><strong>Đạt khi:</strong> file mới có 2–3 test xanh, không dùng <code>querySelector</code> hay test id nào, và lần cố ý làm hỏng làm đúng một test đỏ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">test runner — trình chạy test (Vitest)</span><span class="v">tìm và chạy file test, in ✓/×, theo dõi thay đổi</span></div>
<div class="kv"><span class="k">jsdom</span><span class="v">DOM trình duyệt viết bằng JavaScript: có phần tử và sự kiện, không bố cục, không vẽ</span></div>
<div class="kv"><span class="k">role / accessible name — vai trò / tên truy cập</span><span class="v">phần tử là gì với công nghệ hỗ trợ, và trình đọc màn hình gọi nó là gì</span></div>
<div class="kv"><span class="k">getBy / queryBy / findBy</span><span class="v">ném lỗi / trả null / đợi (Promise) khi không có phần tử</span></div>
<div class="kv"><span class="k">user-event</span><span class="v">giả lập người thật: đủ chuỗi sự kiện cho bấm, gõ, Tab, dán</span></div>
<div class="kv"><span class="k">jest-dom matcher — phép kiểm DOM</span><span class="v">như <code>toBeDisabled</code>, <code>toHaveAccessibleDescription</code></span></div>
<div class="kv"><span class="k">mock function — hàm giả (<code>vi.fn</code>)</span><span class="v">hàm không làm gì nhưng ghi lại mọi lần được gọi</span></div>
<div class="kv"><span class="k">in-place mutation — sửa tại chỗ</span><span class="v">đổi nội dung object mà giữ nguyên danh tính — <code>!==</code> không thấy</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Test gồm chuẩn bị, hành động, kiểm — và chỉ nên biết thứ người dùng biết: vai trò, nhãn, chữ nhìn thấy.</li>
<li>Ưu tiên <code>getByRole</code> và <code>getByLabelText</code>; chúng kiêm luôn kiểm khả năng tiếp cận. <code>getByTestId</code> là đường cuối.</li>
<li><code>getBy</code> cho "có ở đây", <code>queryBy</code> cho "không có", <code>findBy</code> cho "sẽ có"; truy vấn hỏng in ra danh sách vai trò — hãy đọc nó.</li>
<li>Gọi <code>userEvent.setup()</code> trước khi render và <code>await</code> mọi thao tác; <code>fireEvent</code> chỉ bắn một sự kiện, bỏ qua focus, blur và việc đợi.</li>
<li>Test form tìm ra một bug thật: React Hook Form sửa object lỗi tại chỗ còn React Compiler so bằng danh tính; rút chuỗi lỗi ra trước là hết.</li>
<li>Test luật (schema) như hàm thuần bằng <code>test.each</code> và <code>Date</code> giả; chạy axe trong test để bắt lỗi tiếp cận "máy móc".</li>
</ul>

${LINK('https://testing-library.com/docs/queries/about#priority', '🔎', 'Testing Library — Truy vấn và thứ tự ưu tiên', 'Dùng truy vấn nào, theo thứ tự nào.')}
${LINK('https://testing-library.com/docs/user-event/intro', '🖱', 'user-event — Giới thiệu', 'Vì sao giả lập thao tác thay vì phát sự kiện.')}
${LINK('https://github.com/testing-library/jest-dom#custom-matchers', '✅', 'jest-dom — Danh sách phép kiểm', 'Đầy đủ, có ví dụ.')}
${LINK('https://react.dev/learn/react-compiler/introduction', '🤖', 'react.dev — React Compiler', 'Nó ghi nhớ gì và giả định những luật nào.')}
${LINK_TRONG('/courses/testing', '🧪', 'Khoá: Testing', 'Unit, integration, E2E và test trong CI, rộng hơn React.')}
</div>
`,
};

/* Output cắt sẵn cho Bài 9.2 */
const O2 = {
  dotBien: OUT.dotBien.split('\n').filter((l) => /matMang|bản cũ|onSuccess/.test(l)).join('\n'),
  actEn: '# setup.ts WITHOUT the flag (as before this chapter)\n' + OUT.actTat + '\n\n# setup.ts WITH the flag\n' + OUT.actBat,
  actVi: '# setup.ts KHÔNG có cờ (như trước chương này)\n' + OUT.actTat + '\n\n# setup.ts CÓ cờ\n' + OUT.actBat,
  setupMoi: SN.setup.split('\n').slice(0, 22).join('\n') + '\n…',
};
const L2 = {
    title: '9.2 — Testing async UI and API calls: findBy, MSW, four states, act, fake timers|||9.2 — Test giao diện bất đồng bộ và gọi API: findBy, MSW, bốn trạng thái, act, đồng hồ giả',
    slug: 'rx-9-2-async',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Đợi dữ liệu đúng cách (findBy, waitFor), MSW trong test, bốn trạng thái tải/có/rỗng/lỗi và lỗi 409 khi đặt lịch, test Suspense/use(), cờ act bị tắt từ đầu, đồng hồ giả với user-event, và test phụ thuộc thứ tự — tất cả đo thật.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Testing async UI and API calls: findBy, MSW, the four states, act and fake timers</h2>
<p class="lead">Almost every bug a user reports lives in an "in-between" moment: the list while it is loading, the page when the server says 500, the form when someone else booked the slot a second earlier, the toast that should disappear after five seconds. In the browser those moments flash by. In a test you can freeze each one and look at it. This lesson tests the clinic app's data screens that way, with a fake API that you control per test — and measures three traps that make async tests slow, silent or flaky. One of them had been hiding in this project since Chapter 6.</p>
<p>Setup: the project after step 1 of this chapter. MSW 2.15.0 in Node (<code>src/mocks/node.ts</code>), TanStack Query 5.103.3, React Router 8.4.0, Vitest 5.0.2, @testing-library/react 16.3.3, user-event 14.6.7. Experiments that are not part of the app live in <code>src/vi-du/ch09/bai2.test.tsx</code> (green) and <code>bai2.sai.tsx</code> (deliberately wrong, run with <code>-c vitest.sai.config.ts</code>).</p>

<h3>Data arrives later: findBy waits, getBy does not</h3>
${slide('rx-09', 9, 'The list arrives 5 ms after render: getBy fails at once, findBy retries until it is there')}
<p><code>KhuBacSi</code> (the doctor list) calls <code>GET /api/bac-si</code> through TanStack Query. In a test, MSW answers after about 5 ms — but "5 ms later" is still <em>later</em>: at the moment <code>render</code> returns, only the skeleton exists. A test that asks with <code>getBy</code> right away fails, and the DOM in the error message shows why:</p>
${pre('tsx', SN.saiGetBy)}
${out(OUT.saiGetBy)}
${SD.mswEn}
<p>Three tools handle "later". All of them re-run a check every time the DOM changes (a <code>MutationObserver</code>) and every 50 ms, until it passes or 1000 ms have gone by:</p>
<table>
<thead><tr><th>Tool</th><th>Returns</th><th>Use for</th></tr></thead>
<tbody>
<tr><td><code>await screen.findBy…(…)</code></td><td>the element</td><td>"this will appear" — the most common case</td></tr>
<tr><td><code>await waitFor(() =&gt; expect(…))</code></td><td>nothing</td><td>any assertion that will become true: a URL, a mock call count, text disappearing</td></tr>
<tr><td><code>await waitForElementToBeRemoved(el)</code></td><td>nothing</td><td>"this will go away" — a skeleton, a spinner. Fails immediately if <code>el</code> is not there at the start</td></tr>
</tbody>
</table>
<p>The first test of the list uses all three ideas — the skeleton is there <em>now</em> (getBy), it goes away (waitForElementToBeRemoved), and then the cards are there (getAllBy, no need to wait any more):</p>
${pre('tsx', SN.veKhu)}
${pre('tsx', SN.khuTai)}
<div class="pitfall co-tieu-de"><strong>Trap — side effects inside <code>waitFor</code>.</strong> The callback of <code>waitFor</code> runs again on every DOM change and every 50 ms. Put only assertions in it. <code>await waitFor(() =&gt; user.click(nut))</code> may click many times; <code>await waitFor(() =&gt; { server.use(…); expect(…) })</code> registers a new handler on every retry. Do the action once, then wait for its result.</div>

<h3>MSW in tests: the network is fake, the code path is real</h3>
${slide('rx-09', 10, 'MSW answers at the network layer: fetch, goiApi and TanStack all run for real')}
<p>Chapter 6 built the fake API with MSW for the browser; the same handlers run in Node for tests (<code>setupServer</code> instead of <code>setupWorker</code>). The key word is <strong>network layer</strong> (tầng mạng): the component calls <code>useBacSi</code>, which calls <code>api.danhSachBacSi</code>, which calls <code>goiApi</code>, which calls the real <code>fetch</code> — and only there does MSW step in and answer. Every line of your data code runs exactly as in production. (Lesson 9.4 measures what you lose when you fake one layer higher, with <code>vi.mock</code>.) Here is the handler every test uses by default:</p>
${pre('ts', SN.handlerBacSi)}
<p><code>src/test/setup.ts</code> starts it once per file and, importantly, with <code>onUnhandledRequest: 'error'</code>. If any code calls a URL with no handler, the test fails loudly instead of trying the real internet:</p>
${out(OUT.saiMsw)}
<p>A test that needs a <em>different</em> answer registers a handler for itself with <code>server.use(…)</code>. It is added in front of the default ones, so it wins; the <code>afterEach</code> in setup calls <code>server.resetHandlers()</code> so it never leaks into the next test. Add <code>{ once: true }</code> and the override answers only the first matching request — perfect for "fails once, then works":</p>
${SD.vongDoiEn}
<div class="callout"><p><strong>JS quick reminder — <code>http.get(path, resolver)</code>.</strong> A handler is "when a request matches this method and path, run this function and return its Response". <code>HttpResponse.json(data, { status })</code> builds a JSON response; <code>HttpResponse.error()</code> builds a <em>network error</em> — <code>fetch</code> rejects with <code>TypeError: Failed to fetch</code>, exactly as when Wi-Fi drops. <code>await delay(300)</code> waits 300 ms; <code>delay('infinite')</code> never answers (a request that hangs).</p></div>

<h3>The four states of a screen</h3>
${slide('rx-09', 11, 'Every data screen has four states — test each one, not only the happy path')}
${SD.trangThaiEn}
<p>Chapter 6 designed <code>KhuBacSi</code> with four states: loading (skeleton), data, empty, error — plus a fifth that users rarely see but always remember: "we had data, the refresh failed". Before this chapter, no test ever rendered <code>KhuBacSi</code> in any state but "data". Coverage (Lesson 9.4) confirmed it: <code>LoiTaiDuLieu</code>, the shared error box, had <strong>0%</strong> — no test had ever rendered it. One test per state:</p>
${pre('tsx', SN.khuRong)}
${pre('tsx', SN.khu500)}
${pre('tsx', SN.khuMatMang)}
${pre('tsx', SN.khuBangCu)}
<p>Things worth noticing. The 500 test uses <code>{ once: true }</code>: the first request fails, the click on "Thử lại" makes a second request that hits the default handler — the whole recovery path in one test. The network-error test also asserts what must <em>not</em> be shown (<code>not.toHaveTextContent(/fetch/i)</code>): "Failed to fetch" is a developer's message, not a patient's. The "stale" test triggers a refetch by hand through the <code>queryClient</code> that <code>renderVoiRouter</code> returns, wrapped in <code>act</code> because it updates React state from outside any user event. And all tests find the error box by its role, <code>alert</code> — the same thing a screen reader announces.</p>

<h3>Why the test client does not retry — measured</h3>
${slide('rx-09', 12, 'The app’s client retries 3 times: the error box shows after 7056 ms; the test client: 10 ms')}
<p>The app's <code>QueryClient</code> (Chapter 6) retries failed requests: <code>nenThuLai</code> allows three retries for 5xx and network errors, and TanStack waits 1 s, 2 s, 4 s between them. In a browser that is kind to users. In a test it is a disaster — every error-state test would take seven seconds, and with <code>findBy</code>'s one-second timeout it would simply fail. We measured both clients on the same 500:</p>
${pre('tsx', SN.saiThuLai)}
${out(OUT.thuLai)}
<p>That is why <code>src/test/render.tsx</code> makes a <strong>new</strong> client per test with <code>retry: false</code>. "New per test" matters as much as "no retry" — the last section of this lesson shows what a shared client does.</p>
${pre('tsx', SN.taoClientTest)}
<p>The retry <em>policy</em> is still tested — as a pure function in Lesson 9.3, where six cases run in a few milliseconds instead of seven seconds each. The same idea applies to <code>findBy</code>'s timeout: if your API is legitimately slow, do not raise the timeout everywhere; make the fake API fast. The default 1000 ms covers a 300 ms delay, but not 1500 ms:</p>
${pre('tsx', SN.khuCham)}
${pre('tsx', SN.saiCham)}
${out(OUT.saiCham)}
<p>(Yes, "nhận lịch.." ends in two dots: Testing Library appends one to the text you asked for. Real output, unedited.) If a test truly needs longer, pass it explicitly and locally: <code>findByRole('alert', {}, { timeout: 3000 })</code>.</p>

<h3>A booking the server refuses: 409 through the whole page</h3>
<p>The component tests above stop at the edge of the page. For the booking flow we render the whole app at <code>/dat-lich/…</code> with <code>veTrang</code> (Chapter 7: a memory router with the real routes) and let the real MSW handler refuse. The fake server has two ways to say 409: a phone number that already has a pending booking (<code>0999999999</code>), and a slot that someone else took. A small helper fills the form:</p>
${pre('tsx', SN.datLichDien)}
${pre('tsx', SN.datLich409)}
${pre('tsx', SN.datLichNguoiKhac)}
<p>The second test is the interesting one. "Someone else" books by changing the fake database directly while our user is typing. When the POST comes back 409, <code>useDatLich</code>'s <code>onSettled</code> (not <code>onSuccess</code>) invalidates the time slots; the page refetches them, sees the slot is taken, and replaces the form with "đã có người đặt" plus a link to pick another time. The test proves the whole chain — mutation, invalidation, refetch, re-render — and, as the end of the lesson shows, changing <code>onSettled</code> to <code>onSuccess</code> makes it fail.</p>
${out(OUT.khu)}

<h3>Suspense and <code>use()</code>: render inside <code>await act</code></h3>
<p>Since Chapter 12, <code>/bac-si/:id</code> reads the doctor's profile with <code>use(promise)</code> inside <code>&lt;Suspense&gt;</code>. A component that <strong>suspends</strong> ("treo" — waits for a promise) inside a <em>synchronous</em> <code>act()</code> — which is what a plain <code>render</code> is — is abandoned by React: the fallback stays forever. The test times out, and React says why:</p>
${pre('tsx', SN.saiSuspense)}
${out(OUT.saiSuspense)}
<p>The fix, added in Chapter 12, is to render such pages inside <code>await act(async () =&gt; …)</code>; the project wraps it as <code>veTrangCho</code>. The same applies to a click that makes something suspend: <code>await act(async () =&gt; user.click(link))</code>. Details and the mechanism: <a href="/courses/react/learn?lessonSlug=rx-12-1-suspense-use">Chapter 12, Lesson 12.1</a> (<code>rx-12-1-suspense-use</code>). If you have not done Chapter 12, your <code>/bac-si/:id</code> uses <code>useQuery</code> and plain <code>veTrang</code> is fine.</p>
${pre('tsx', SN.veTrangCho)}

<h3>The act warning — and why this project never saw one</h3>
${slide('rx-09', 13, 'Vitest without globals: Testing Library never turns on React’s act environment — no warnings at all')}
<p><strong><code>act()</code></strong> is React's test helper: "run this, then flush every state update and effect it caused, so the DOM is final before I assert". Testing Library wraps <code>render</code>, <code>fireEvent</code>, user-event and the <code>findBy</code>/<code>waitFor</code> loop in it for you. When a state update happens <em>outside</em> any <code>act</code> — a timer, a promise that resolves after the test moved on, a store changed directly by the test — React prints "An update to X inside a test was not wrapped in act(...)". The warning is useful: it means your assertion may have looked at a half-updated screen.</p>
<p>While writing this chapter we wrote a test that <em>should</em> produce that warning — changing a Zustand store directly while the toast area is on screen — and got silence. The reason is in Testing Library's own entry file:</p>
${pre('js', SN.rtlTuBat)}
<p>React only warns when the global flag <code>IS_REACT_ACT_ENVIRONMENT</code> is true, and Testing Library sets it inside a <code>beforeAll</code> — <em>if it finds a global <code>beforeAll</code></em>. Jest has globals; Vitest has them only with <code>globals: true</code>. This project uses <code>globals: false</code> (you import <code>test</code>, <code>expect</code> from <code>'vitest'</code>), so the flag was never set and React never warned — in any test, since Chapter 6. It is the same mechanism that disabled Testing Library's automatic <code>cleanup</code>, which Section 0 already had to add by hand. The fix is one line in <code>setup.ts</code>, measured before and after:</p>
${pre('tsx', SN.actNgoai)}
${pre('tsx', SN.actTrong)}
${out(O2.actEn)}
<p>After turning it on, we ran the whole suite with console output visible: the app's own tests produced <strong>no</strong> act warning (Testing Library's helpers were doing their job); the only warnings came from the deliberate experiments (the store one above, and the <code>fireEvent</code> test in Lesson 9.1). That is the result you want — but now you would <em>hear</em> about a new one.</p>
<div class="pitfall co-tieu-de"><strong>Trap — "fixing" an act warning by wrapping random lines in <code>act</code>.</strong> The warning tells you an update happened when you were not looking. The fix is almost never <code>act(() =&gt; {})</code> sprinkled around; it is to <em>wait for the thing the user would wait for</em> — <code>await findBy…</code> the text that appears when the update lands. Use <code>act</code> directly only when <em>the test itself</em> causes the update outside a user action: a store change, <code>queryClient.refetchQueries</code>, advancing fake timers.</div>

<h3>Fake timers with user-event: the click that never finishes</h3>
${slide('rx-09', 14, 'Vitest fake timers + user-event hang for 5000 ms — add shouldAdvanceTime')}
<p>Toasts (<code>useThongBaoStore</code>, Chapter 6) disappear after 5 seconds. Waiting five real seconds in a test is not an option; <strong>fake timers</strong> let the test move the clock: <code>vi.useFakeTimers()</code>, then <code>vi.advanceTimersByTime(5000)</code>. The user-event docs say that when you use fake timers you must pass <code>advanceTimers</code> to <code>setup</code>. We did — and the click still hung until Vitest killed the test:</p>
${pre('tsx', SN.saiDongHo)}
${out(OUT.saiDongHo)}
<p>The cause is again in Testing Library's source. After every user-event action it waits for one <code>setTimeout(0)</code> "to drain microtasks" — and it only knows how to advance <strong>Jest's</strong> fake timers:</p>
${pre('js', SN.rtlAsyncWrapper)}
<p>With Vitest's fake timers, that <code>setTimeout(0)</code> never fires, so every <code>await user.…</code> waits forever. Two fixes, both measured green: let the fake clock also move with real time (<code>shouldAdvanceTime: true</code>), or use <code>fireEvent</code> while timers are fake (it does not go through that wrapper):</p>
${pre('tsx', SN.dongHoGia)}
${pre('tsx', SN.dongHoGiaFire)}
<p>The test covers 5 seconds of app time in a few dozen milliseconds, and it checks the boundary (4.9 s still visible, 5 s gone) rather than "some time later". Always call <code>vi.useRealTimers()</code> in <code>afterEach</code> — a fake clock that leaks into the next test makes <em>that</em> test hang, far from the cause.</p>

<h3>Tests that depend on their order</h3>
${slide('rx-09', 15, 'Alone it passes, in the file it fails: a shared QueryClient carried the empty list over')}
<p>A good test passes alone, in any order, and in parallel with others. The classic way to break that is shared state. Two tests share one <code>QueryClient</code> created at the top of the file:</p>
${pre('tsx', SN.saiThuTu)}
${out(OUT.saiThuTu)}
<p>Test 6a cached an empty list; the doctor list is "fresh" for 5 minutes (<code>staleTime</code>), so 6b got the cached <code>[]</code> without asking MSW. Run alone, 6b is green. This is why <code>setup.ts</code> resets everything that lives <em>outside</em> components after each test — and why we measured what happens when one of those lines is removed:</p>
${pre('ts', O2.setupMoi)}
${out(OUT.boDatLai)}
<p>Two unrelated tests fail — one in this chapter, one from Chapter 12 — because an appointment created by an earlier test was still in the fake database. The failures name the victims, not the culprit; that is what makes order bugs expensive. Vitest can shuffle test order to flush them out. The full suite with a fixed seed (so a failure can be reproduced with the same seed):</p>
${out(OUT.thuTuTron)}
<div class="callout"><p><strong>jsdom is not a browser — silence the noise, keep the signal.</strong> Every run of the suite printed <code>Not implemented: Window's scrollTo() method</code> 63 times: React Router's <code>&lt;ScrollRestoration&gt;</code> scrolls on navigation, and jsdom has no scrolling. Harmless — but 63 lines of noise is where a real warning goes unread. <code>setup.ts</code> now replaces <code>window.scrollTo</code> with an empty function; the count went from 63 to 0. Replace only what jsdom lacks and your code does not depend on; never stub something you are trying to test.</p></div>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202 a data screen is a class component with <code>fetch</code> in <code>componentDidMount</code>, and if it is tested at all, the test replaces <code>global.fetch</code> with a <code>jest.fn()</code> that returns a hand-made object — often forgetting <code>ok</code>, <code>status</code> and <code>json()</code>, so the test passes against a response no server would ever send. Error and empty states are rarely tested. → At work, the network is faked with <strong>MSW</strong> using the same handlers as local development, each test overrides only what its scenario needs (<code>server.use</code>), and loading, empty, error and "stale" states each get a test. · <em>Why:</em> the real <code>fetch</code>, your API wrapper and your cache all run, so a bug in any of them shows up; and one set of handlers serves development, tests and demos. Mocking <code>fetch</code> by hand is not wrong for a one-file exercise, and you will see <code>jest.mock('axios')</code> in older company code — Lesson 9.4 measures what it misses.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "How do you test a component that fetches data?"</p>
<p>Render it with its real providers (a fresh <code>QueryClient</code> with retries off, a router if needed), fake the network with MSW rather than mocking the fetch function, and assert with <code>findBy</code>/<code>waitFor</code>. Cover the loading, success, empty and error states — overriding the handler per test with <code>server.use</code> — and reset handlers and shared state after each test so tests are independent.</p></div>
<div class="callout"><p><strong>Common interview question.</strong> "What does <code>act()</code> do, and what does the 'not wrapped in act' warning mean?"</p>
<p><code>act</code> runs a piece of code and flushes all React updates and effects it triggered before returning, so assertions see the final DOM. Testing Library wraps render, events and its async utilities in it. The warning means state changed outside <code>act</code> — usually an async update landing after the test stopped waiting — so the fix is normally to await the visible result (<code>findBy</code>), not to add <code>act</code> blindly. It only appears when <code>IS_REACT_ACT_ENVIRONMENT</code> is true.</p></div>

<h3>▶ Run it step by step</h3>
<ol>
<li><code>npx vitest run src/features/bac-si/KhuBacSi.test.tsx --reporter=verbose</code> — seven names, seven ✓.</li>
<li>In the 500 test, remove <code>{ once: true }</code>. Run it: the "Thử lại" click now fails again, and <code>findAllByRole('article')</code> times out. Put it back.</li>
<li>Run the deliberate failures: <code>npx vitest run -c vitest.sai.config.ts src/vi-du/ch09/bai2.sai.tsx</code>. It takes about 15 s (one experiment waits 7 s on purpose). Match each × to a section of this lesson.</li>
<li>Comment out the <code>IS_REACT_ACT_ENVIRONMENT</code> line in <code>setup.ts</code>, run <code>npx vitest run src/vi-du/ch09/bai2.test.tsx --silent=false</code>, see "0 lần console.error". Uncomment.</li>
<li><code>npx vitest run --sequence.shuffle</code> twice; note the seed Vitest prints. If a run ever fails, re-run with <code>--sequence.seed=&lt;that seed&gt;</code> to reproduce it.</li>
</ol>

<h3>🛠 Keep building the project — step 2/4: the data states and a quieter, stricter setup</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after step 1/4 (<code>src/test/setup.ts</code>, <code>src/test/render.tsx</code> with <code>renderVoiRouter</code> and <code>veTrang</code>, <code>src/features/bac-si/KhuBacSi.tsx</code>, <code>src/pages/TrangDatLich.tsx</code>).</p><ol>
<li>In <code>src/test/setup.ts</code>: set <code>globalThis.IS_REACT_ACT_ENVIRONMENT = true</code> at the top, and replace <code>window.scrollTo</code> with an empty function.</li>
<li>Create <code>src/features/bac-si/KhuBacSi.test.tsx</code>: loading → data, empty, 500 + retry, network error, stale data after a failed refresh, slow (300 ms), filter on the URL.</li>
<li>Create <code>src/pages/TrangDatLich.test.tsx</code>: 409 for a phone with a pending booking; 409 for a slot taken by someone else, ending on "đã có người đặt".</li>
</ol>
<p><strong>Done when:</strong> both files are green (7 + 2 tests) and so is the full suite; <code>npx vitest run --reporter=default 2&gt;&amp;1 | grep -c "Not implemented"</code> prints <code>0</code>; <code>npx vitest run --sequence.shuffle --sequence.seed=2026</code> is green; and the tests catch these deliberate breaks: <code>matMang = false</code> in <code>LoiTaiDuLieu</code>, <code>{false &amp;&amp; isError &amp;&amp; (</code> in <code>KhuBacSi</code>, and <code>onSettled</code> → <code>onSuccess</code> in <code>useDatLich</code>.</p></div>
<details><summary>Solution</summary>
<p>The two test files are printed above in full (helper, seven and two tests). The top of <code>setup.ts</code> after this step:</p>
${pre('ts', O2.setupMoi)}
<p>Run on 26/09/2026: the step's 9 tests green, full suite green, shuffle with seed 2026 green, 0 "Not implemented" lines. The three deliberate breaks:</p>
${out(O2.dotBien)}
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> the time-slot grid, <code>ChonKhungGio</code>, has its own error state. Test it.</p><ol>
<li>Render <code>&lt;ChonKhungGio bacSiId="bs-2" /&gt;</code> with <code>renderVoiRouter(…, '/bac-si/bs-2')</code>.</li>
<li>Override <code>GET /api/bac-si/:id/khung-gio</code> with a 500, <code>{ once: true }</code>.</li>
<li>Assert the alert says "Không tải được giờ khám" and contains the server's message.</li>
<li>Click "Thử lại" inside that alert; assert four time slots appear (<code>findAllByRole('listitem')</code> inside the region "Chọn giờ khám").</li>
<li>Bonus: with <code>delay('infinite')</code>, assert the loading placeholder (<code>role="status"</code>, name "Đang tải khung giờ") is there.</li>
</ol><p><strong>Done when:</strong> 2–3 new tests are green, run in under a second each, and changing <code>tieuDe="Không tải được giờ khám"</code> in the component makes one of them red.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k"><code>findBy</code> / <code>waitFor</code></span><span class="v">re-run a query / an assertion on DOM changes and every 50 ms, up to 1000 ms</span></div>
<div class="kv"><span class="k">MSW (Mock Service Worker)</span><span class="v">answers requests at the network layer; in Node via <code>setupServer</code></span></div>
<div class="kv"><span class="k">handler override (<code>server.use</code>)</span><span class="v">a per-test answer that wins over the defaults; reset after each test</span></div>
<div class="kv"><span class="k">network error</span><span class="v"><code>HttpResponse.error()</code>: <code>fetch</code> rejects, as when offline</span></div>
<div class="kv"><span class="k"><code>act()</code></span><span class="v">runs code and flushes React updates before you assert</span></div>
<div class="kv"><span class="k"><code>IS_REACT_ACT_ENVIRONMENT</code></span><span class="v">global flag; without it React never prints act warnings</span></div>
<div class="kv"><span class="k">fake timers</span><span class="v"><code>vi.useFakeTimers</code>: the test moves the clock; always restore</span></div>
<div class="kv"><span class="k">order-dependent test</span><span class="v">passes alone, fails after another test because of shared state</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Data arrives after render: use <code>findBy</code>, <code>waitFor</code> or <code>waitForElementToBeRemoved</code>; keep side effects out of <code>waitFor</code>.</li>
<li>MSW fakes the network, so fetch, the API wrapper and the cache really run; <code>onUnhandledRequest: 'error'</code>, per-test <code>server.use</code>, reset after each test.</li>
<li>Test all four states (loading, data, empty, error) plus "stale after a failed refresh" — before this chapter the shared error box had 0% coverage.</li>
<li>Tests use a fresh client with retries off: the app's client needed 7056 ms to show an error, the test client 10 ms.</li>
<li>With Vitest <code>globals: false</code>, set <code>IS_REACT_ACT_ENVIRONMENT = true</code> yourself, or React never warns; use <code>shouldAdvanceTime</code> when combining fake timers with user-event.</li>
<li>Reset shared state after every test; shuffle with a seed to find order-dependent tests.</li>
</ul>

${LINK('https://testing-library.com/docs/dom-testing-library/api-async', '⏳', 'Testing Library — Async methods', 'findBy, waitFor, waitForElementToBeRemoved.')}
${LINK('https://mswjs.io/docs/integrations/node', '🌐', 'MSW — Node.js integration', 'setupServer, lifecycle, server.use.')}
${LINK('https://react.dev/reference/react/act', '⚛️', 'react.dev — act', 'What it flushes and IS_REACT_ACT_ENVIRONMENT.')}
${LINK('https://vitest.dev/guide/mocking/timers', '⏱', 'Vitest — Fake timers', 'useFakeTimers, advanceTimersByTime, shouldAdvanceTime.')}
${LINK_TRONG('/courses/testing', '🧪', 'Course: Testing', 'Deeper: test doubles, flaky tests, CI.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Test giao diện bất đồng bộ và gọi API: findBy, MSW, bốn trạng thái, act và đồng hồ giả</h2>
<p class="lead">Gần như mọi bug người dùng báo đều nằm ở một khoảnh khắc "ở giữa": danh sách trong lúc đang tải, trang khi máy chủ báo 500, form khi có người vừa đặt mất khung giờ một giây trước, thông báo nổi lẽ ra phải biến mất sau năm giây. Trên trình duyệt những khoảnh khắc đó vụt qua. Trong test, bạn đóng băng được từng cái mà nhìn. Bài này test các màn hình dữ liệu của app phòng khám theo cách đó, với một API giả mà mỗi test tự điều khiển — và đo ba cái bẫy làm test bất đồng bộ chậm, câm hoặc chập chờn. Một trong số đó đã nằm im trong dự án này từ Chương 6.</p>
<p>Chuẩn bị: dự án sau bước 1 của chương này. MSW 2.15.0 chạy trong Node (<code>src/mocks/node.ts</code>), TanStack Query 5.103.3, React Router 8.4.0, Vitest 5.0.2, @testing-library/react 16.3.3, user-event 14.6.7. Các thí nghiệm không thuộc app nằm ở <code>src/vi-du/ch09/bai2.test.tsx</code> (xanh) và <code>bai2.sai.tsx</code> (cố ý sai, chạy bằng <code>-c vitest.sai.config.ts</code>).</p>

<h3>Dữ liệu về sau: findBy biết đợi, getBy thì không</h3>
${slide('rx-09', 9, 'Danh sách về 5 ms sau render: getBy hỏng ngay, findBy hỏi lại tới khi có')}
<p><code>KhuBacSi</code> (danh sách bác sĩ) gọi <code>GET /api/bac-si</code> qua TanStack Query. Trong test, MSW trả lời sau khoảng 5 ms — nhưng "5 ms sau" vẫn là <em>sau</em>: đúng lúc <code>render</code> trả về, mới chỉ có khung xương. Test nào hỏi bằng <code>getBy</code> ngay lúc đó là hỏng, và DOM trong thông báo lỗi cho thấy vì sao:</p>
${pre('tsx', SN.saiGetBy)}
${out(OUT.saiGetBy)}
${SD.mswVi}
<p>Ba công cụ lo chuyện "về sau". Cả ba đều chạy lại phép kiểm mỗi khi DOM thay đổi (một <code>MutationObserver</code>) và mỗi 50 ms, tới khi đúng hoặc hết 1000 ms:</p>
<table>
<thead><tr><th>Công cụ</th><th>Trả về</th><th>Dùng cho</th></tr></thead>
<tbody>
<tr><td><code>await screen.findBy…(…)</code></td><td>phần tử</td><td>"thứ này sẽ xuất hiện" — trường hợp hay gặp nhất</td></tr>
<tr><td><code>await waitFor(() =&gt; expect(…))</code></td><td>không gì</td><td>phép kiểm nào sẽ thành đúng: URL, số lần gọi hàm giả, chữ biến mất</td></tr>
<tr><td><code>await waitForElementToBeRemoved(el)</code></td><td>không gì</td><td>"thứ này sẽ biến mất" — khung xương, vòng xoay. Hỏng ngay nếu lúc bắt đầu <code>el</code> không có</td></tr>
</tbody>
</table>
<p>Test đầu tiên của danh sách dùng cả ba ý — khung xương có <em>ngay</em> (getBy), nó biến mất (waitForElementToBeRemoved), rồi các thẻ có mặt (getAllBy, không cần đợi nữa):</p>
${pre('tsx', SN.veKhu)}
${pre('tsx', SN.khuTai)}
<div class="pitfall co-tieu-de"><strong>Bẫy — đặt việc có tác dụng phụ bên trong <code>waitFor</code>.</strong> Hàm truyền cho <code>waitFor</code> chạy lại mỗi khi DOM đổi và mỗi 50 ms. Chỉ đặt phép kiểm trong đó. <code>await waitFor(() =&gt; user.click(nut))</code> có thể bấm nhiều lần; <code>await waitFor(() =&gt; { server.use(…); expect(…) })</code> đăng ký thêm một handler sau mỗi lần thử lại. Làm hành động một lần, rồi mới đợi kết quả của nó.</div>

<h3>MSW trong test: mạng là giả, đường đi của mã là thật</h3>
${slide('rx-09', 10, 'MSW trả lời ở tầng mạng: fetch, goiApi và TanStack đều chạy thật')}
<p>Chương 6 dựng API giả bằng MSW cho trình duyệt; đúng những handler đó chạy trong Node cho test (<code>setupServer</code> thay cho <code>setupWorker</code>). Từ khoá là <strong>tầng mạng</strong> (network layer): component gọi <code>useBacSi</code>, nó gọi <code>api.danhSachBacSi</code>, nó gọi <code>goiApi</code>, nó gọi <code>fetch</code> thật — và chỉ tới đó MSW mới chen vào trả lời. Mọi dòng mã dữ liệu của bạn chạy y như trên production. (Bài 9.4 đo xem bạn mất gì khi giả ở tầng cao hơn một bậc, bằng <code>vi.mock</code>.) Đây là handler mà mọi test dùng mặc định:</p>
${pre('ts', SN.handlerBacSi)}
<p><code>src/test/setup.ts</code> bật nó một lần cho mỗi file, và quan trọng: với <code>onUnhandledRequest: 'error'</code>. Hễ có mã gọi một URL không có handler, test hỏng ầm ĩ thay vì thử gọi ra Internet thật:</p>
${out(OUT.saiMsw)}
<p>Test nào cần một câu trả lời <em>khác</em> thì tự đăng ký handler bằng <code>server.use(…)</code>. Nó được đặt trước các handler mặc định nên thắng; <code>afterEach</code> trong setup gọi <code>server.resetHandlers()</code> nên nó không bao giờ rò sang test sau. Thêm <code>{ once: true }</code> thì handler chỉ trả lời request khớp đầu tiên — vừa khít cho kịch bản "hỏng một lần, rồi được":</p>
${SD.vongDoiVi}
<div class="callout"><p><strong>JS nhắc nhanh — <code>http.get(đườngDẫn, hàmTrảLời)</code>.</strong> Handler nghĩa là "khi có request khớp phương thức và đường dẫn này, chạy hàm này và trả về Response của nó". <code>HttpResponse.json(dữLiệu, { status })</code> tạo câu trả lời JSON; <code>HttpResponse.error()</code> tạo <em>lỗi mạng</em> — <code>fetch</code> ném <code>TypeError: Failed to fetch</code>, y như lúc rớt Wi-Fi. <code>await delay(300)</code> đợi 300 ms; <code>delay('infinite')</code> không bao giờ trả lời (request treo).</p></div>

<h3>Bốn trạng thái của một màn hình</h3>
${slide('rx-09', 11, 'Màn hình dữ liệu nào cũng có bốn trạng thái — test từng cái, không chỉ đường suôn sẻ')}
${SD.trangThaiVi}
<p>Chương 6 thiết kế <code>KhuBacSi</code> với bốn trạng thái: đang tải (khung xương), có dữ liệu, rỗng, lỗi — cộng một trạng thái thứ năm người dùng hiếm khi thấy mà thấy là nhớ mãi: "đã có dữ liệu, lần làm mới bị hỏng". Trước chương này, chưa test nào vẽ <code>KhuBacSi</code> ở trạng thái nào khác ngoài "có dữ liệu". Độ phủ (Bài 9.4) xác nhận: <code>LoiTaiDuLieu</code>, hộp lỗi dùng chung, ở mức <strong>0%</strong> — chưa test nào từng vẽ nó. Mỗi trạng thái một test:</p>
${pre('tsx', SN.khuRong)}
${pre('tsx', SN.khu500)}
${pre('tsx', SN.khuMatMang)}
${pre('tsx', SN.khuBangCu)}
<p>Vài điều đáng để ý. Test 500 dùng <code>{ once: true }</code>: request đầu hỏng, cú bấm "Thử lại" tạo request thứ hai rơi vào handler mặc định — cả đường phục hồi trong một test. Test mất mạng kiểm cả thứ <em>không được</em> hiện (<code>not.toHaveTextContent(/fetch/i)</code>): "Failed to fetch" là câu của lập trình viên, không phải của bệnh nhân. Test "bản cũ" tự kích một lần tải lại qua <code>queryClient</code> mà <code>renderVoiRouter</code> trả về, bọc trong <code>act</code> vì nó cập nhật state của React từ bên ngoài mọi thao tác người dùng. Và mọi test tìm hộp lỗi theo vai trò <code>alert</code> — đúng thứ trình đọc màn hình đọc lên.</p>

<h3>Vì sao client của test không thử lại — đo thật</h3>
${slide('rx-09', 12, 'Client của app thử lại 3 lần: hộp lỗi hiện sau 7056 ms; client của test: 10 ms')}
<p><code>QueryClient</code> của app (Chương 6) thử lại request hỏng: <code>nenThuLai</code> cho phép thử lại ba lần với lỗi 5xx và lỗi mạng, và TanStack đợi 1 giây, 2 giây, 4 giây giữa các lần. Trên trình duyệt như vậy là tử tế với người dùng. Trong test thì là thảm hoạ — test trạng thái lỗi nào cũng mất bảy giây, và với thời hạn một giây của <code>findBy</code> thì nó hỏng luôn. Ta đo hai client trên cùng một lỗi 500:</p>
${pre('tsx', SN.saiThuLai)}
${out(OUT.thuLai)}
<p>Đó là lý do <code>src/test/render.tsx</code> tạo một client <strong>mới</strong> cho mỗi test với <code>retry: false</code>. "Mới cho mỗi test" quan trọng ngang "không thử lại" — mục cuối của bài cho thấy một client dùng chung gây ra gì.</p>
${pre('tsx', SN.taoClientTest)}
<p><em>Chính sách</em> thử lại vẫn được test — dưới dạng hàm thuần ở Bài 9.3, sáu trường hợp chạy trong vài mili giây thay vì bảy giây mỗi cái. Ý đó áp dụng cả cho thời hạn của <code>findBy</code>: nếu API của bạn chậm thật, đừng nâng thời hạn ở khắp nơi; hãy làm API giả nhanh. Mặc định 1000 ms đủ cho độ trễ 300 ms, nhưng không đủ cho 1500 ms:</p>
${pre('tsx', SN.khuCham)}
${pre('tsx', SN.saiCham)}
${out(OUT.saiCham)}
<p>(Đúng vậy, "nhận lịch.." có hai dấu chấm: Testing Library tự thêm một dấu vào sau chữ bạn hỏi. Output thật, không sửa.) Nếu một test thật sự cần lâu hơn, truyền rõ ràng và chỉ ở đó: <code>findByRole('alert', {}, { timeout: 3000 })</code>.</p>

<h3>Máy chủ từ chối một lịch hẹn: 409 đi qua cả trang</h3>
<p>Các test component ở trên dừng ở mép trang. Với luồng đặt lịch, ta vẽ cả app ở <code>/dat-lich/…</code> bằng <code>veTrang</code> (Chương 7: một router bộ nhớ với bảng route thật) và để handler MSW thật từ chối. Máy chủ giả có hai cách nói 409: một số điện thoại đang có lịch chờ xác nhận (<code>0999999999</code>), và một khung giờ vừa bị người khác đặt. Một hàm phụ điền form:</p>
${pre('tsx', SN.datLichDien)}
${pre('tsx', SN.datLich409)}
${pre('tsx', SN.datLichNguoiKhac)}
<p>Test thứ hai là cái đáng xem. "Người khác" đặt lịch bằng cách sửa thẳng cơ sở dữ liệu giả trong lúc người dùng của ta đang gõ. Khi POST trả về 409, <code>onSettled</code> của <code>useDatLich</code> (không phải <code>onSuccess</code>) làm cũ danh sách khung giờ; trang tải lại, thấy khung giờ đã kín, và thay form bằng "đã có người đặt" kèm link chọn giờ khác. Test chứng minh cả chuỗi — mutation, làm cũ cache, tải lại, vẽ lại — và, như cuối bài cho thấy, đổi <code>onSettled</code> thành <code>onSuccess</code> là nó đỏ.</p>
${out(OUT.khu)}

<h3>Suspense và <code>use()</code>: vẽ bên trong <code>await act</code></h3>
<p>Từ Chương 12, <code>/bac-si/:id</code> đọc hồ sơ bác sĩ bằng <code>use(promise)</code> bên trong <code>&lt;Suspense&gt;</code>. Một component <strong>treo</strong> (suspend — chờ một promise) bên trong một <code>act()</code> <em>đồng bộ</em> — mà <code>render</code> thường chính là thế — sẽ bị React bỏ dở: fallback đứng mãi. Test hết giờ, và React nói rõ vì sao:</p>
${pre('tsx', SN.saiSuspense)}
${out(OUT.saiSuspense)}
<p>Cách sửa, có từ Chương 12, là vẽ những trang như vậy trong <code>await act(async () =&gt; …)</code>; dự án gói nó thành <code>veTrangCho</code>. Một cú bấm làm thứ gì đó treo cũng vậy: <code>await act(async () =&gt; user.click(link))</code>. Chi tiết và cơ chế: <a href="/courses/react/learn?lessonSlug=rx-12-1-suspense-use">Chương 12, Bài 12.1</a> (<code>rx-12-1-suspense-use</code>). Nếu bạn chưa học Chương 12, <code>/bac-si/:id</code> của bạn dùng <code>useQuery</code> và <code>veTrang</code> thường là đủ.</p>
${pre('tsx', SN.veTrangCho)}

<h3>Cảnh báo act — và vì sao dự án này chưa từng thấy nó</h3>
${slide('rx-09', 13, 'Vitest không bật globals: Testing Library không bao giờ bật môi trường act của React — không có cảnh báo nào')}
<p><strong><code>act()</code></strong> là hàm phụ cho test của React: "chạy việc này, rồi xả hết mọi cập nhật state và effect nó gây ra, để DOM đã ở trạng thái cuối trước khi tôi kiểm". Testing Library bọc sẵn <code>render</code>, <code>fireEvent</code>, user-event và vòng lặp của <code>findBy</code>/<code>waitFor</code> trong nó. Khi state bị cập nhật <em>bên ngoài</em> mọi <code>act</code> — một hẹn giờ, một promise xong sau khi test đã đi tiếp, một store bị test sửa thẳng — React in "An update to X inside a test was not wrapped in act(...)". Cảnh báo đó có ích: nó nghĩa là phép kiểm của bạn có thể đã nhìn một màn hình mới cập nhật được một nửa.</p>
<p>Lúc soạn chương này, ta viết một test <em>lẽ ra</em> phải sinh cảnh báo đó — sửa thẳng một store Zustand trong lúc vùng thông báo đang hiện — và nhận về im lặng. Lý do nằm ngay trong file đầu vào của Testing Library:</p>
${pre('js', SN.rtlTuBat)}
<p>React chỉ cảnh báo khi cờ toàn cục <code>IS_REACT_ACT_ENVIRONMENT</code> là true, và Testing Library bật nó trong một <code>beforeAll</code> — <em>nếu nó tìm thấy <code>beforeAll</code> toàn cục</em>. Jest có sẵn biến toàn cục; Vitest chỉ có khi <code>globals: true</code>. Dự án này dùng <code>globals: false</code> (bạn import <code>test</code>, <code>expect</code> từ <code>'vitest'</code>), nên cờ chưa từng được bật và React chưa từng cảnh báo — ở bất kỳ test nào, từ Chương 6. Đó cũng chính là cơ chế đã tắt <code>cleanup</code> tự động của Testing Library, thứ Mục 0 phải tự thêm bằng tay. Cách sửa là một dòng trong <code>setup.ts</code>, đo trước và sau:</p>
${pre('tsx', SN.actNgoai)}
${pre('tsx', SN.actTrong)}
${out(O2.actVi)}
<p>Bật cờ xong, ta chạy cả bộ test với output console hiện đầy đủ: các test của chính app <strong>không</strong> sinh cảnh báo act nào (các hàm phụ của Testing Library đã làm đúng việc của chúng); cảnh báo chỉ đến từ các thí nghiệm cố ý (cái store ở trên, và test <code>fireEvent</code> ở Bài 9.1). Đó là kết quả mong muốn — nhưng giờ nếu có cảnh báo mới thì bạn sẽ <em>nghe</em> thấy.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — "sửa" cảnh báo act bằng cách bọc bừa vài dòng trong <code>act</code>.</strong> Cảnh báo báo cho bạn biết có một lần cập nhật xảy ra lúc bạn không nhìn. Cách sửa gần như không bao giờ là rắc <code>act(() =&gt; {})</code> khắp nơi; mà là <em>đợi đúng thứ người dùng sẽ đợi</em> — <code>await findBy…</code> dòng chữ hiện ra khi cập nhật tới nơi. Chỉ dùng <code>act</code> trực tiếp khi <em>chính test</em> gây ra cập nhật ngoài một thao tác người dùng: sửa store, <code>queryClient.refetchQueries</code>, tua đồng hồ giả.</div>

<h3>Đồng hồ giả với user-event: cú bấm không bao giờ xong</h3>
${slide('rx-09', 14, 'Đồng hồ giả của Vitest + user-event treo 5000 ms — thêm shouldAdvanceTime')}
<p>Thông báo nổi (<code>useThongBaoStore</code>, Chương 6) tự ẩn sau 5 giây. Đợi năm giây thật trong test là không được; <strong>đồng hồ giả</strong> cho test tự tua giờ: <code>vi.useFakeTimers()</code>, rồi <code>vi.advanceTimersByTime(5000)</code>. Tài liệu user-event dặn khi dùng đồng hồ giả phải truyền <code>advanceTimers</code> cho <code>setup</code>. Ta đã truyền — và cú bấm vẫn treo tới khi Vitest giết test:</p>
${pre('tsx', SN.saiDongHo)}
${out(OUT.saiDongHo)}
<p>Nguyên nhân lại nằm trong mã nguồn của Testing Library. Sau mỗi thao tác user-event, nó đợi một <code>setTimeout(0)</code> "để xả hàng đợi microtask" — và nó chỉ biết tua đồng hồ giả của <strong>Jest</strong>:</p>
${pre('js', SN.rtlAsyncWrapper)}
<p>Với đồng hồ giả của Vitest, cái <code>setTimeout(0)</code> đó không bao giờ chạy, nên mọi <code>await user.…</code> đợi mãi. Hai cách sửa, cả hai đo thấy xanh: cho đồng hồ giả nhích theo cả giờ thật (<code>shouldAdvanceTime: true</code>), hoặc dùng <code>fireEvent</code> trong lúc đồng hồ đang giả (nó không đi qua lớp bọc đó):</p>
${pre('tsx', SN.dongHoGia)}
${pre('tsx', SN.dongHoGiaFire)}
<p>Test đi hết 5 giây thời gian của app chỉ trong vài chục mili giây, và nó kiểm đúng mép (4,9 giây vẫn còn, 5 giây thì mất) thay vì "một lúc sau". Luôn gọi <code>vi.useRealTimers()</code> trong <code>afterEach</code> — một đồng hồ giả rò sang test sau sẽ làm <em>test đó</em> treo, ở chỗ rất xa nguyên nhân.</p>

<h3>Test phụ thuộc thứ tự</h3>
${slide('rx-09', 15, 'Chạy riêng thì xanh, chạy cả file thì đỏ: QueryClient dùng chung mang danh sách rỗng sang')}
<p>Một test tốt thì chạy riêng cũng qua, chạy theo thứ tự nào cũng qua, chạy song song với test khác cũng qua. Cách kinh điển để phá điều đó là state dùng chung. Hai test dùng chung một <code>QueryClient</code> tạo ở đầu file:</p>
${pre('tsx', SN.saiThuTu)}
${out(OUT.saiThuTu)}
<p>Test 6a lưu vào cache một danh sách rỗng; danh sách bác sĩ được coi là "tươi" trong 5 phút (<code>staleTime</code>), nên 6b nhận luôn <code>[]</code> từ cache mà không hỏi MSW. Chạy riêng thì 6b xanh. Đó là lý do <code>setup.ts</code> trả về như mới mọi thứ sống <em>ngoài</em> component sau mỗi test — và là lý do ta đo xem chuyện gì xảy ra khi bỏ một dòng trong đó:</p>
${pre('ts', O2.setupMoi)}
${out(OUT.boDatLai)}
<p>Hai test chẳng liên quan gì bị đỏ — một của chương này, một của Chương 12 — vì một lịch hẹn do test trước tạo vẫn còn trong cơ sở dữ liệu giả. Thông báo lỗi chỉ tên nạn nhân, không chỉ thủ phạm; đó là thứ làm bug thứ tự tốn công. Vitest trộn được thứ tự test để lôi chúng ra. Cả bộ test với một "hạt giống" cố định (để lỡ hỏng thì tái hiện được bằng đúng hạt giống đó):</p>
${out(OUT.thuTuTron)}
<div class="callout"><p><strong>jsdom không phải trình duyệt — dẹp tiếng ồn, giữ tín hiệu.</strong> Mỗi lần chạy bộ test đều in <code>Not implemented: Window's scrollTo() method</code> 63 lần: <code>&lt;ScrollRestoration&gt;</code> của React Router cuộn trang khi điều hướng, còn jsdom không biết cuộn. Vô hại — nhưng 63 dòng rác là chỗ một cảnh báo thật trôi qua không ai đọc. <code>setup.ts</code> giờ thay <code>window.scrollTo</code> bằng một hàm rỗng; số dòng từ 63 xuống 0. Chỉ thay thứ jsdom thiếu mà mã của bạn không phụ thuộc vào; đừng bao giờ làm giả thứ bạn đang muốn test.</p></div>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202, màn hình dữ liệu là một class component gọi <code>fetch</code> trong <code>componentDidMount</code>, và nếu có test thì test thay <code>global.fetch</code> bằng một <code>jest.fn()</code> trả về một object tự nặn — hay quên <code>ok</code>, <code>status</code> và <code>json()</code>, nên test qua với một câu trả lời mà không máy chủ nào gửi. Trạng thái lỗi và rỗng ít khi được test. → Đi làm, mạng được giả bằng <strong>MSW</strong> với chính bộ handler dùng khi phát triển, mỗi test chỉ ghi đè đúng thứ kịch bản của nó cần (<code>server.use</code>), và trạng thái tải, rỗng, lỗi, "bản cũ" đều có test riêng. · <em>Vì sao:</em> <code>fetch</code> thật, lớp bọc API và cache của bạn đều chạy, nên bug ở bất kỳ chỗ nào cũng lộ ra; và một bộ handler phục vụ cả phát triển, test lẫn demo. Tự giả <code>fetch</code> không sai với một bài tập một file, và bạn sẽ gặp <code>jest.mock('axios')</code> trong mã cũ ở công ty — Bài 9.4 đo xem cách đó bỏ sót gì.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Bạn test một component có gọi API thế nào?"</p>
<p>Vẽ nó với đủ provider thật (một <code>QueryClient</code> mới, tắt thử lại; router nếu cần), giả mạng bằng MSW thay vì giả hàm fetch, kiểm bằng <code>findBy</code>/<code>waitFor</code>. Phủ các trạng thái đang tải, thành công, rỗng và lỗi — ghi đè handler theo từng test bằng <code>server.use</code> — và trả handler cùng state dùng chung về như cũ sau mỗi test để các test độc lập với nhau.</p></div>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "<code>act()</code> làm gì, và cảnh báo 'not wrapped in act' nghĩa là gì?"</p>
<p><code>act</code> chạy một đoạn mã và xả hết cập nhật, effect của React mà đoạn đó gây ra trước khi trả về, để phép kiểm thấy DOM cuối cùng. Testing Library bọc sẵn render, sự kiện và các hàm đợi của nó trong <code>act</code>. Cảnh báo nghĩa là state đổi ngoài <code>act</code> — thường là một cập nhật bất đồng bộ tới sau khi test đã thôi đợi — nên cách sửa thường là đợi kết quả nhìn thấy được (<code>findBy</code>), không phải bọc <code>act</code> bừa. Nó chỉ xuất hiện khi <code>IS_REACT_ACT_ENVIRONMENT</code> là true.</p></div>

<h3>▶ Chạy thử từng bước</h3>
<ol>
<li><code>npx vitest run src/features/bac-si/KhuBacSi.test.tsx --reporter=verbose</code> — bảy cái tên, bảy dấu ✓.</li>
<li>Trong test 500, bỏ <code>{ once: true }</code>. Chạy: cú bấm "Thử lại" giờ cũng hỏng, và <code>findAllByRole('article')</code> hết giờ. Trả lại.</li>
<li>Chạy các bản cố ý sai: <code>npx vitest run -c vitest.sai.config.ts src/vi-du/ch09/bai2.sai.tsx</code>. Mất khoảng 15 giây (một thí nghiệm cố ý đợi 7 giây). Ghép mỗi dấu × với một mục của bài này.</li>
<li>Tắt (comment) dòng <code>IS_REACT_ACT_ENVIRONMENT</code> trong <code>setup.ts</code>, chạy <code>npx vitest run src/vi-du/ch09/bai2.test.tsx --silent=false</code>, thấy "0 lần console.error". Bật lại.</li>
<li><code>npx vitest run --sequence.shuffle</code> hai lần; ghi lại hạt giống (seed) Vitest in ra. Nếu có lần hỏng, chạy lại với <code>--sequence.seed=&lt;hạt đó&gt;</code> để tái hiện.</li>
</ol>

<h3>🛠 Tự gõ tiếp dự án — bước 2/4: các trạng thái dữ liệu, và một setup im hơn mà khắt khe hơn</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau bước 1/4 (<code>src/test/setup.ts</code>, <code>src/test/render.tsx</code> với <code>renderVoiRouter</code> và <code>veTrang</code>, <code>src/features/bac-si/KhuBacSi.tsx</code>, <code>src/pages/TrangDatLich.tsx</code>).</p><ol>
<li>Trong <code>src/test/setup.ts</code>: đặt <code>globalThis.IS_REACT_ACT_ENVIRONMENT = true</code> ở đầu, và thay <code>window.scrollTo</code> bằng một hàm rỗng.</li>
<li>Tạo <code>src/features/bac-si/KhuBacSi.test.tsx</code>: đang tải → có dữ liệu, rỗng, 500 + thử lại, mất mạng, bản cũ sau khi làm mới hỏng, chậm (300 ms), lọc trên URL.</li>
<li>Tạo <code>src/pages/TrangDatLich.test.tsx</code>: 409 cho số điện thoại đang có lịch chờ; 409 cho khung giờ bị người khác đặt, kết thúc ở "đã có người đặt".</li>
</ol>
<p><strong>Đạt khi:</strong> hai file xanh (7 + 2 test) và cả bộ test xanh; <code>npx vitest run --reporter=default 2&gt;&amp;1 | grep -c "Not implemented"</code> in ra <code>0</code>; <code>npx vitest run --sequence.shuffle --sequence.seed=2026</code> xanh; và test bắt được những lần cố ý làm hỏng sau: <code>matMang = false</code> trong <code>LoiTaiDuLieu</code>, <code>{false &amp;&amp; isError &amp;&amp; (</code> trong <code>KhuBacSi</code>, và <code>onSettled</code> → <code>onSuccess</code> trong <code>useDatLich</code>.</p></div>
<details><summary>Lời giải</summary>
<p>Hai file test đã in đầy đủ ở trên (hàm phụ, bảy và hai test). Phần đầu <code>setup.ts</code> sau bước này:</p>
${pre('ts', O2.setupMoi)}
<p>Chạy ngày 26/09/2026: 9 test của bước xanh, cả bộ xanh, trộn thứ tự với hạt giống 2026 xanh, 0 dòng "Not implemented". Ba lần cố ý làm hỏng:</p>
${out(O2.dotBien)}
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề:</strong> lưới khung giờ <code>ChonKhungGio</code> có trạng thái lỗi riêng. Hãy test nó.</p><ol>
<li>Vẽ <code>&lt;ChonKhungGio bacSiId="bs-2" /&gt;</code> bằng <code>renderVoiRouter(…, '/bac-si/bs-2')</code>.</li>
<li>Ghi đè <code>GET /api/bac-si/:id/khung-gio</code> bằng lỗi 500, <code>{ once: true }</code>.</li>
<li>Kiểm hộp alert ghi "Không tải được giờ khám" và có câu của máy chủ.</li>
<li>Bấm "Thử lại" trong đúng hộp đó; kiểm bốn khung giờ xuất hiện (<code>findAllByRole('listitem')</code> bên trong vùng "Chọn giờ khám").</li>
<li>Thêm: với <code>delay('infinite')</code>, kiểm ô chờ (<code>role="status"</code>, tên "Đang tải khung giờ") có mặt.</li>
</ol><p><strong>Đạt khi:</strong> 2–3 test mới xanh, mỗi test chạy dưới một giây, và đổi <code>tieuDe="Không tải được giờ khám"</code> trong component làm một test đỏ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k"><code>findBy</code> / <code>waitFor</code></span><span class="v">chạy lại một truy vấn / một phép kiểm khi DOM đổi và mỗi 50 ms, tối đa 1000 ms</span></div>
<div class="kv"><span class="k">MSW (Mock Service Worker)</span><span class="v">trả lời request ở tầng mạng; trong Node dùng <code>setupServer</code></span></div>
<div class="kv"><span class="k">ghi đè handler (<code>server.use</code>)</span><span class="v">câu trả lời riêng của một test, thắng handler mặc định; trả về sau mỗi test</span></div>
<div class="kv"><span class="k">network error — lỗi mạng</span><span class="v"><code>HttpResponse.error()</code>: <code>fetch</code> ném lỗi, như lúc mất mạng</span></div>
<div class="kv"><span class="k"><code>act()</code></span><span class="v">chạy mã rồi xả hết cập nhật của React trước khi bạn kiểm</span></div>
<div class="kv"><span class="k"><code>IS_REACT_ACT_ENVIRONMENT</code></span><span class="v">cờ toàn cục; thiếu nó React không bao giờ in cảnh báo act</span></div>
<div class="kv"><span class="k">fake timers — đồng hồ giả</span><span class="v"><code>vi.useFakeTimers</code>: test tự tua giờ; nhớ trả đồng hồ thật</span></div>
<div class="kv"><span class="k">test phụ thuộc thứ tự</span><span class="v">chạy riêng thì qua, chạy sau test khác thì hỏng vì state dùng chung</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dữ liệu về sau khi render: dùng <code>findBy</code>, <code>waitFor</code> hoặc <code>waitForElementToBeRemoved</code>; đừng đặt tác dụng phụ trong <code>waitFor</code>.</li>
<li>MSW giả mạng, nên fetch, lớp bọc API và cache đều chạy thật; <code>onUnhandledRequest: 'error'</code>, <code>server.use</code> theo từng test, trả về sau mỗi test.</li>
<li>Test đủ bốn trạng thái (đang tải, có dữ liệu, rỗng, lỗi) cộng "bản cũ sau khi làm mới hỏng" — trước chương này hộp lỗi dùng chung có độ phủ 0%.</li>
<li>Test dùng client mới, tắt thử lại: client của app cần 7056 ms mới hiện lỗi, client của test 10 ms.</li>
<li>Với Vitest <code>globals: false</code>, tự đặt <code>IS_REACT_ACT_ENVIRONMENT = true</code>, không thì React không bao giờ cảnh báo; dùng <code>shouldAdvanceTime</code> khi ghép đồng hồ giả với user-event.</li>
<li>Trả state dùng chung về như cũ sau mỗi test; trộn thứ tự bằng hạt giống để tìm test phụ thuộc thứ tự.</li>
</ul>

${LINK('https://testing-library.com/docs/dom-testing-library/api-async', '⏳', 'Testing Library — Các hàm bất đồng bộ', 'findBy, waitFor, waitForElementToBeRemoved.')}
${LINK('https://mswjs.io/docs/integrations/node', '🌐', 'MSW — Dùng trong Node.js', 'setupServer, vòng đời, server.use.')}
${LINK('https://react.dev/reference/react/act', '⚛️', 'react.dev — act', 'Nó xả những gì, và IS_REACT_ACT_ENVIRONMENT.')}
${LINK('https://vitest.dev/guide/mocking/timers', '⏱', 'Vitest — Đồng hồ giả', 'useFakeTimers, advanceTimersByTime, shouldAdvanceTime.')}
${LINK_TRONG('/courses/testing', '🧪', 'Khoá: Testing', 'Sâu hơn: test double, test chập chờn, CI.')}
</div>
`,
};

/* Output cắt sẵn cho Bài 9.3 */
const O3 = {
  dotBien: OUT.dotBien.split('\n').filter((l) => /keepPreviousData|5000|onSuccess/.test(l)).join('\n'),
};
const L3 = {
    title: '9.3 — Testing custom hooks: renderHook, wrappers, TanStack Query hooks and stores|||9.3 — Test hook tự viết: renderHook, wrapper, hook TanStack Query và store',
    slug: 'rx-9-3-hook',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Khi nào test hook trực tiếp, renderHook với result.current/rerender/unmount, wrapper cho hook cần router và QueryClient, hook TanStack (enabled, placeholder, 404 không thử lại), hook mutation với act và waitFor, store Zustand và hàm thuần không cần React.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Testing custom hooks: renderHook, wrappers, TanStack Query hooks and stores</h2>
<p class="lead">A custom hook is logic without a screen. That makes it awkward to test the Testing Library way — there is no button to click and no text to read — and tempting to test the wrong way, by poking at its internals. This lesson shows the right tool, <strong><code>renderHook</code></strong>, the one decision that matters before using it (should this hook be tested on its own at all?), and how to give a hook the context it needs: a router, a <code>QueryClient</code>, a fake API. Every hook tested here is a real hook of the clinic app.</p>
<p>Setup: the project after step 2 of this chapter. <code>renderHook</code> comes from <code>@testing-library/react</code> 16.3.3 (it is built in; the old separate package <code>@testing-library/react-hooks</code>, version 8.0.1, declares support only for React 16 and 17 — checked 09/2026). Chapter 4 (Lesson 4.4) already tested <code>useDebounce</code> with <code>renderHook</code> and fake timers — this lesson starts where that one stopped: hooks that need context.</p>

<h3>First decision: test the hook, or test through a component?</h3>
${SD.chonCachEn}
<p>A hook used by exactly one component is an implementation detail of that component: test the component, and the hook is covered — if you later inline it or split it, no test breaks. A hook shared by several components, with several branches (<code>useKhungGio</code> is used by the time picker and the booking page; <code>useBoLocUrl</code> by the list and potentially a search page), deserves its own tests, because every caller relies on its contract. And logic that does not need React at all — a Zod schema, <code>locBacSi</code>, a Zustand store, the retry policy — should not go through React in tests either: call the function.</p>

<h3><code>renderHook</code>: a component you never see</h3>
${slide('rx-09', 16, 'renderHook renders an invisible component; result.current is the latest value')}
<p>Hooks can only run inside a component. <code>renderHook(callback)</code> renders a tiny invisible component whose body is your callback, and gives you back:</p>
<ul>
<li><code>result.current</code> — what the callback returned in the <strong>latest</strong> render;</li>
<li><code>rerender(newProps)</code> — render again with new props (passed to your callback), to test how the hook reacts to changing inputs;</li>
<li><code>unmount()</code> — remove the component, which runs effect cleanups.</li>
</ul>
${SD.renderHookEn}
<p>The simplest hook in the app, <code>useTieuDeTrang</code>, sets <code>document.title</code> and restores the previous one when the component goes away. It needs no context:</p>
${pre('ts', SN.tieuDeHook)}
${pre('ts', SN.tieuDeTest)}
<p><code>initialProps</code> is the first argument your callback receives; <code>rerender</code> replaces it. Three scenarios in one test, each a promise the hook makes to its callers: set on mount, follow changes, restore on unmount. The last one is what makes the tab title correct after you navigate away from a doctor's page.</p>

<h3><code>result.current</code> is always the latest — do not take it apart early</h3>
<p>A hook's return value changes on every render. <code>result</code> is a box whose <code>current</code> is replaced after each render; if you copy the value out of the box, you keep a photo of <em>that</em> render forever:</p>
${pre('tsx', SN.saiStale)}
${out(OUT.saiStale)}
<p><code>isSuccess</code> was <code>false</code> in the first render and stays <code>false</code> in the local variable, however long <code>waitFor</code> retries. Always read <code>result.current.x</code> inside the assertion.</p>
<div class="pitfall co-tieu-de"><strong>Trap — <code>const { data } = result.current</code> at the top of the test.</strong> It reads like normal React code, which is why it happens. In a component, destructuring is fine because the whole function runs again on the next render; in a test, the test function does not run again. The symptom is a <code>waitFor</code> that times out on a condition that is obviously true in the DOM.</div>

<h3>Hooks that need context: the wrapper</h3>
${slide('rx-09', 17, 'A hook that uses a router or a QueryClient needs a wrapper — without it, the error is immediate')}
<p>Most real hooks read context: <code>useBoLocUrl</code> calls <code>useSearchParams</code> (needs a router), <code>useKhungGio</code> calls <code>useQuery</code> (needs a <code>QueryClientProvider</code>). Render them bare and they fail on the first line — with good messages:</p>
${pre('tsx', SN.saiWrapper)}
${out(OUT.saiWrapper)}
<p>The <code>wrapper</code> option takes a component that receives <code>children</code>; <code>renderHook</code> renders your invisible component inside it. This chapter adds one helper to <code>src/test/render.tsx</code> that builds a wrapper with a fresh <code>QueryClient</code> and a <code>MemoryRouter</code> at a given URL, and returns the client too, so tests can inspect or spy on it:</p>
${pre('tsx', SN.taoWrapper)}
<div class="callout"><p><strong>JS quick reminder — a function that returns an object with a component inside.</strong> <code>taoWrapper</code> declares <code>function wrapper({ children })</code> inside itself, so the inner component "remembers" the <code>queryClient</code> and <code>url</code> of this call (a <em>closure</em>). It returns <code>{ wrapper, queryClient }</code>; passing that whole object as the second argument of <code>renderHook</code> works because <code>renderHook</code> reads the <code>wrapper</code> field and ignores the rest.</p></div>
<p>Now <code>useBoLocUrl</code>. It reads <code>?ck=</code> and <code>?q=</code>, rejects values a user could type by hand, and writes filters back with PUSH or REPLACE. To <em>see</em> what it wrote, the test calls two more hooks in the same callback — <code>useLocation</code> and <code>useNavigationType</code> — so <code>result.current</code> carries the hook's value and the router's state side by side:</p>
${pre('tsx', SN.boLocVeHook)}
${pre('tsx', SN.boLocBay)}
${pre('tsx', SN.boLocPush)}
<p>Calling the hook's setter changes router state, so it goes inside <code>act(…)</code> — a state update caused by the test itself, not by a user event (the rule from Lesson 9.2). The PUSH-versus-REPLACE assertion encodes a UX decision from Chapter 5: picking a speciality is a step the Back button should undo; typing in the search box is not.</p>

<h3>Hooks on top of TanStack Query</h3>
${slide('rx-09', 18, 'useKhungGio: pending → success, enabled:false makes no request, keepPreviousData keeps the old day')}
<p><code>useKhungGio(bacSiId, ngay)</code> is small, but every line is a decision someone could undo by accident:</p>
${pre('ts', SN.useKhungGio)}
<p>Each decision gets one test. To prove "no request" or "exactly one request", the file listens to MSW's own events — <code>request:start</code> fires for every request that reaches the fake network:</p>
${pre('tsx', SN.kgDemRequest)}
${pre('tsx', SN.kgThanhCong)}
${pre('tsx', SN.kgEnabled)}
<p>A test that proves something did <em>not</em> happen needs to give it a chance to happen: the 50 ms pause is there so that a wrongly-enabled query would have started. <code>fetchStatus: 'idle'</code> together with <code>isPending: true</code> is TanStack's way of saying "no data yet and not fetching" — a disabled query.</p>
${pre('tsx', SN.kgPlaceholder)}
<p><code>keepPreviousData</code> is the reason the time grid does not flash empty when you change the day (Chapter 6). The test changes the day with <code>rerender</code>, checks that for a moment the data is still the <em>old</em> day with <code>isPlaceholderData: true</code>, then waits for the new day. Remove <code>placeholderData</code> from the hook and this test goes red — measured at the end of the lesson.</p>
${pre('tsx', SN.kg404)}
<p>Note the <code>queryClient: taoQueryClient()</code> here: the <em>app's</em> client, with its retry policy, on purpose. A 404 must not be retried (a doctor that does not exist will not exist in one second either), and "exactly one request" proves the policy works with the real client — in 63 ms, because nothing is retried.</p>

<h3>Mutation hooks: <code>act</code> around the call, <code>waitFor</code> for the state</h3>
${slide('rx-09', 19, 'mutateAsync resolved does not mean result.current changed — TanStack notifies a tick later')}
<p><code>useDatLich</code> sends the booking and, when it settles, invalidates two caches. The first run of its test failed in a way that teaches something about the fake API:</p>
${out(OUT.datLichThieu)}
<p>A 404 "Không có khung giờ này" instead of the 409 we expected. The fake server creates time slots <em>lazily</em>, the first time someone GETs them. On a page, the time grid does that before anyone can book; a hook tested alone skips the page, so the slot did not exist yet. The test must prepare its own world:</p>
${pre('tsx', SN.datLichChuanBi)}
<p>The second surprise was in the success test. <code>mutateAsync</code> had resolved with the new appointment, yet <code>result.current.isSuccess</code> was still <code>false</code> on the next line:</p>
${out(OUT.datLichNgay)}
<p>TanStack Query delivers state changes to components through its <code>notifyManager</code>, which by default batches them in a <code>setTimeout(0)</code> — one tick <em>after</em> the promise you awaited. So the pattern for mutation hooks is: call the mutation inside <code>await act(async () =&gt; …)</code> (it updates state), then <code>await waitFor</code> for the hook's state. To check <em>which caches</em> are invalidated, spy on the real client: <code>vi.spyOn(queryClient, 'invalidateQueries')</code> records calls and still runs the original.</p>
${pre('tsx', SN.datLichOk)}
${pre('tsx', SN.datLich409Hook)}
<p><code>await expect(promise).rejects.toMatchObject(…)</code> asserts that a Promise fails, and with what. The 409 test pins down the decision from Chapter 6 that <code>onSettled</code>, not <code>onSuccess</code>, invalidates the slots: after a conflict the grid on screen is already stale.</p>

<h3>No React needed: stores and pure functions</h3>
${slide('rx-09', 20, 'A Zustand store and the retry policy are plain JavaScript — test them without rendering anything')}
<p>A Zustand store is a JavaScript object with <code>getState()</code> and <code>setState()</code>. The toast store's rules — append, remove by id, auto-hide after exactly 5 seconds — need no component. With fake timers, five seconds pass in a microsecond:</p>
${pre('ts', SN.storeTest)}
<p>The <code>afterEach</code> in <code>setup.ts</code> resets every store to its initial state (<code>useThongBaoStore.setState(useThongBaoStore.getInitialState(), true)</code>), so each test starts empty. The same approach for the retry policy that Lesson 9.2 had to switch off in component tests — here all six branches run in a few milliseconds:</p>
${pre('ts', SN.queryClientTest)}
<p>All hook and store tests of this lesson together:</p>
${out(OUT.hook)}

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202, reusable logic lives in class methods, higher-order components (<code>withLoading(Component)</code>) or copy-pasted <code>componentDidMount</code> code, and when it is tested at all, the test reaches into the instance: <code>wrapper.instance().handleFilter('nhi')</code>, then <code>expect(wrapper.state('list'))…</code>. → At work, shared logic is a custom hook; it is tested through the components that use it, and — when it is shared and has branches — directly with <code>renderHook</code> plus a wrapper for its context, asserting only on what it returns and what it causes (URL, requests, cache). Pure rules move out of hooks entirely and are tested as functions. · <em>Why:</em> tests that call instance methods test code no user ever runs in that order, and break when the class becomes a function component. A hook test sees exactly what a calling component sees. You will still meet HOCs in older code bases (and in some libraries); their tests are component tests.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "How do you test a custom hook?"</p>
<p>If one component uses it, through that component. If it is shared, with <code>renderHook</code> from Testing Library: assert on <code>result.current</code> (read it fresh inside assertions), drive input changes with <code>rerender</code>, check cleanup with <code>unmount</code>, and wrap setters in <code>act</code>. Hooks that use context need a <code>wrapper</code> (router, <code>QueryClientProvider</code> with a fresh client); data hooks use MSW and <code>waitFor</code>. Anything that does not need React — stores, reducers, validation — is tested as plain functions.</p></div>
<div class="callout"><p><strong>Common interview question.</strong> "Why do you create a new QueryClient in every test?"</p>
<p>The cache is state. A shared client carries data from one test to the next (a cached empty list made a later test fail in Lesson 9.2), and the default retries make error tests wait seconds. A fresh client with <code>retry: false</code> per test keeps tests independent and fast; the retry policy itself is tested separately as a function.</p></div>

<h3>▶ Run it step by step</h3>
<ol>
<li><code>npx vitest run src/shared src/features/bac-si/hooks src/features/dat-lich/useKhungGio.test.tsx src/features/dat-lich/useDatLich.test.tsx src/app/query-client.test.ts --reporter=verbose</code> — 19 tests.</li>
<li>In <code>useKhungGio.test.tsx</code>, move <code>result.current.isPlaceholderData</code> into a variable before <code>rerender</code>; run and read the failure. Undo.</li>
<li>In <code>useDatLich.test.tsx</code>, delete the <code>beforeEach</code> that calls <code>khungGioTrongNgay</code>; run and find the 404. Undo.</li>
<li>Run the three deliberate failures: <code>npx vitest run -c vitest.sai.config.ts src/vi-du/ch09/bai3.sai.tsx</code>.</li>
<li>In <code>thong-bao-store.test.ts</code>, change <code>1999</code> to <code>2000</code>. Which assertion fails, and why is that the right one to fail?</li>
</ol>

<h3>🛠 Keep building the project — step 3/4: the hook and store tests</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after step 2/4 (<code>src/test/render.tsx</code>, <code>src/shared/hooks/useTieuDeTrang.ts</code>, <code>src/features/bac-si/hooks/useBoLocUrl.ts</code>, <code>src/features/dat-lich/useKhungGio.ts</code>, <code>useDatLich.ts</code>, <code>src/shared/store/thong-bao-store.ts</code>, <code>src/app/query-client.ts</code>).</p><ol>
<li>Add <code>taoWrapper({ url, queryClient })</code> to <code>src/test/render.tsx</code> (import <code>MemoryRouter</code> from <code>react-router</code>).</li>
<li><code>src/shared/hooks/useTieuDeTrang.test.ts</code> — set, rerender, unmount.</li>
<li><code>src/features/bac-si/hooks/useBoLocUrl.test.tsx</code> — read, reject bad URL values, PUSH with the keyword kept, REPLACE to a clean URL.</li>
<li><code>src/features/dat-lich/useKhungGio.test.tsx</code> — success with one request, disabled makes none, placeholder when the day changes, 404 not retried by the app's client.</li>
<li><code>src/features/dat-lich/useDatLich.test.tsx</code> — success invalidates both keys; 409 rejects and still invalidates the slots.</li>
<li><code>src/shared/store/thong-bao-store.test.ts</code> and <code>src/app/query-client.test.ts</code> — no React.</li>
</ol>
<p><strong>Done when:</strong> the 19 tests are green, <code>npx tsc -b</code> prints nothing, and these deliberate breaks are caught: remove <code>placeholderData: keepPreviousData</code> from <code>useKhungGio</code>; change <code>5000</code> to <code>3000</code> in the toast store; change <code>onSettled</code> to <code>onSuccess</code> in <code>useDatLich</code>.</p></div>
<details><summary>Solution</summary>
<p>Every file of this step is printed above in full or in its complete tests; the header of each file is only imports and a one-line comment. Two details that decide whether it works: the MSW <code>request:start</code> listener and the <code>afterEach</code> that empties its array in <code>useKhungGio.test.tsx</code>, and <code>await waitFor(() =&gt; expect(result.current.isSuccess).toBe(true))</code> after the mutation in <code>useDatLich.test.tsx</code>. Run on 26/09/2026: 19 tests green (output above). The three deliberate breaks:</p>
${out(O3.dotBien)}
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> test <code>useLichHen</code> from <code>src/features/lich-hen/useLichHen.ts</code>.</p><ol>
<li>With <code>taoWrapper()</code>, <code>renderHook(() =&gt; useLichHen())</code>: wait for success and assert an empty array (the fake database starts empty).</li>
<li>Add one appointment with <code>db.themLichHen({…})</code> before rendering (copy the object from <code>DanhSachLichHen.test.tsx</code>); assert <code>data</code> has length 1 and <code>trangThai</code> is <code>'cho-xac-nhan'</code>.</li>
<li><code>useLichHen({ batDau: false })</code>: assert no request reaches MSW in 50 ms (reuse the <code>request:start</code> trick).</li>
</ol><p><strong>Done when:</strong> three green tests; changing <code>enabled: batDau</code> to <code>enabled: true</code> in the hook makes exactly the third one red.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">custom hook</span><span class="v">a function starting with <code>use</code> that calls other hooks; logic without UI</span></div>
<div class="kv"><span class="k"><code>renderHook</code></span><span class="v">renders an invisible component that calls your hook</span></div>
<div class="kv"><span class="k"><code>result.current</code></span><span class="v">the hook's return value in the latest render — read it fresh</span></div>
<div class="kv"><span class="k"><code>rerender</code> / <code>unmount</code></span><span class="v">render again with new props / remove and run cleanups</span></div>
<div class="kv"><span class="k">wrapper</span><span class="v">component around the hook providing context (router, QueryClient)</span></div>
<div class="kv"><span class="k"><code>vi.spyOn</code></span><span class="v">records calls to a real method and still runs it</span></div>
<div class="kv"><span class="k">placeholder data</span><span class="v">previous data shown while a new key loads (<code>isPlaceholderData</code>)</span></div>
<div class="kv"><span class="k">notifyManager</span><span class="v">TanStack's batching of updates to components, one tick later by default</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Test a hook directly only if it is shared and has branches; otherwise test the component, and test React-free logic as plain functions.</li>
<li><code>renderHook</code> gives <code>result.current</code>, <code>rerender</code> and <code>unmount</code>; never destructure <code>result.current</code> before waiting.</li>
<li>Hooks that read context need a <code>wrapper</code>; <code>taoWrapper</code> builds a fresh <code>QueryClient</code> and a <code>MemoryRouter</code>; call extra hooks in the callback to observe side effects like the URL.</li>
<li>For data hooks: MSW events prove how many requests ran; <code>waitFor</code> for state; the app's own client proves the retry policy on 4xx.</li>
<li>For mutation hooks: <code>await act</code> around the call, <code>waitFor</code> for <code>isSuccess</code> (TanStack notifies a tick later), <code>vi.spyOn</code> for invalidation; prepare lazy fake data yourself.</li>
<li>Stores and the retry policy need no React; fake timers make "after 5 seconds" instant and exact.</li>
</ul>

${LINK('https://testing-library.com/docs/react-testing-library/api#renderhook', '🪝', 'Testing Library — renderHook', 'API: result, rerender, unmount, wrapper.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/testing', '🗃', 'TanStack Query — Testing', 'Fresh client per test, turning off retries.')}
${LINK('https://mswjs.io/docs/api/life-cycle-events', '📡', 'MSW — Life-cycle events', 'request:start and friends, for counting requests.')}
${LINK_TRONG('/courses/react/learn?lessonSlug=rx-4-4-custom-hook', '↩️', 'Lesson 4.4 — Custom hooks', 'Where useDebounce was tested with renderHook and fake timers.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Test hook tự viết: renderHook, wrapper, hook TanStack Query và store</h2>
<p class="lead">Hook tự viết là logic không có màn hình. Điều đó làm nó khó test theo kiểu Testing Library — chẳng có nút nào để bấm, chẳng có chữ nào để đọc — và dễ bị test sai cách, bằng việc chọc vào ruột nó. Bài này chỉ ra đúng công cụ, <strong><code>renderHook</code></strong>, một quyết định duy nhất cần làm trước khi dùng nó (hook này có nên test riêng không?), và cách cho hook ngữ cảnh nó cần: một router, một <code>QueryClient</code>, một API giả. Mọi hook được test ở đây đều là hook thật của app phòng khám.</p>
<p>Chuẩn bị: dự án sau bước 2 của chương này. <code>renderHook</code> lấy từ <code>@testing-library/react</code> 16.3.3 (có sẵn trong gói; gói riêng ngày xưa <code>@testing-library/react-hooks</code>, bản 8.0.1, chỉ khai hỗ trợ React 16 và 17 — kiểm 09/2026). Chương 4 (Bài 4.4) đã test <code>useDebounce</code> bằng <code>renderHook</code> và đồng hồ giả — bài này bắt đầu ở chỗ bài đó dừng: những hook cần ngữ cảnh.</p>

<h3>Quyết định đầu tiên: test hook, hay test qua component?</h3>
${SD.chonCachVi}
<p>Hook chỉ một component dùng là chi tiết cài đặt của component đó: test component, hook tự được phủ — sau này bạn gộp nó vào hay tách nó ra, không test nào gãy. Hook dùng chung ở nhiều component, có nhiều nhánh (<code>useKhungGio</code> dùng ở bộ chọn giờ và trang đặt lịch; <code>useBoLocUrl</code> ở danh sách và có thể ở một trang tìm kiếm) đáng có test riêng, vì mọi nơi gọi đều dựa vào "hợp đồng" của nó. Còn logic không cần React — schema Zod, <code>locBacSi</code>, store Zustand, chính sách thử lại — thì trong test cũng đừng bắt nó đi qua React: gọi thẳng hàm.</p>

<h3><code>renderHook</code>: một component bạn không bao giờ thấy</h3>
${slide('rx-09', 16, 'renderHook vẽ một component vô hình; result.current là giá trị mới nhất')}
<p>Hook chỉ chạy được bên trong component. <code>renderHook(hàm)</code> vẽ một component vô hình nho nhỏ có thân là hàm của bạn, rồi trả lại:</p>
<ul>
<li><code>result.current</code> — thứ hàm của bạn trả về ở lần render <strong>mới nhất</strong>;</li>
<li><code>rerender(propsMới)</code> — vẽ lại với props mới (truyền vào hàm của bạn), để test hook phản ứng thế nào khi đầu vào đổi;</li>
<li><code>unmount()</code> — gỡ component đi, làm các hàm dọn dẹp của effect chạy.</li>
</ul>
${SD.renderHookVi}
<p>Hook đơn giản nhất của app, <code>useTieuDeTrang</code>, đặt <code>document.title</code> và trả lại tiêu đề cũ khi component biến mất. Nó không cần ngữ cảnh gì:</p>
${pre('ts', SN.tieuDeHook)}
${pre('ts', SN.tieuDeTest)}
<p><code>initialProps</code> là tham số đầu tiên hàm của bạn nhận; <code>rerender</code> thay nó. Ba kịch bản trong một test, mỗi cái là một lời hứa của hook với nơi gọi: đặt khi hiện, theo khi đổi, trả lại khi gỡ. Cái cuối là thứ làm tiêu đề tab đúng sau khi bạn rời trang một bác sĩ.</p>

<h3><code>result.current</code> luôn là bản mới nhất — đừng tách nó ra quá sớm</h3>
<p>Giá trị trả về của hook đổi sau mỗi lần render. <code>result</code> là một cái hộp mà <code>current</code> được thay sau mỗi lần render; nếu bạn chép giá trị ra khỏi hộp, bạn giữ mãi một tấm ảnh của lần render <em>đó</em>:</p>
${pre('tsx', SN.saiStale)}
${out(OUT.saiStale)}
<p><code>isSuccess</code> là <code>false</code> ở lần render đầu và mãi là <code>false</code> trong biến cục bộ, <code>waitFor</code> có thử lại bao lâu cũng vậy. Luôn đọc <code>result.current.x</code> ngay bên trong phép kiểm.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — <code>const { data } = result.current</code> ở đầu test.</strong> Nó đọc giống hệt mã React bình thường, nên mới hay mắc. Trong component, tách như vậy không sao vì cả hàm chạy lại ở lần render sau; trong test, hàm test không chạy lại. Triệu chứng: một <code>waitFor</code> hết giờ với một điều kiện rõ ràng là đúng trên DOM.</div>

<h3>Hook cần ngữ cảnh: wrapper</h3>
${slide('rx-09', 17, 'Hook dùng router hay QueryClient cần wrapper — thiếu là lỗi ngay')}
<p>Phần lớn hook thật đọc ngữ cảnh (context): <code>useBoLocUrl</code> gọi <code>useSearchParams</code> (cần router), <code>useKhungGio</code> gọi <code>useQuery</code> (cần <code>QueryClientProvider</code>). Vẽ trơn là chúng hỏng ngay dòng đầu — với thông báo rõ ràng:</p>
${pre('tsx', SN.saiWrapper)}
${out(OUT.saiWrapper)}
<p>Tuỳ chọn <code>wrapper</code> nhận một component có <code>children</code>; <code>renderHook</code> vẽ component vô hình của bạn bên trong nó. Chương này thêm một hàm phụ vào <code>src/test/render.tsx</code>: dựng wrapper gồm một <code>QueryClient</code> mới và một <code>MemoryRouter</code> ở URL cho trước, và trả luôn client ra để test soi hoặc theo dõi nó:</p>
${pre('tsx', SN.taoWrapper)}
<div class="callout"><p><strong>JS nhắc nhanh — hàm trả về object có component bên trong.</strong> <code>taoWrapper</code> khai <code>function wrapper({ children })</code> ngay bên trong nó, nên component con "nhớ" <code>queryClient</code> và <code>url</code> của lần gọi đó (một <em>closure</em>). Nó trả về <code>{ wrapper, queryClient }</code>; truyền nguyên object đó làm tham số thứ hai của <code>renderHook</code> vẫn được, vì <code>renderHook</code> đọc trường <code>wrapper</code> và bỏ qua phần còn lại.</p></div>
<p>Giờ tới <code>useBoLocUrl</code>. Nó đọc <code>?ck=</code> và <code>?q=</code>, từ chối những giá trị người dùng có thể gõ tay, và ghi bộ lọc ngược lên URL bằng PUSH hoặc REPLACE. Để <em>nhìn thấy</em> nó đã ghi gì, test gọi thêm hai hook trong cùng hàm — <code>useLocation</code> và <code>useNavigationType</code> — để <code>result.current</code> mang cả giá trị của hook lẫn trạng thái của router, đặt cạnh nhau:</p>
${pre('tsx', SN.boLocVeHook)}
${pre('tsx', SN.boLocBay)}
${pre('tsx', SN.boLocPush)}
<p>Gọi hàm ghi của hook làm đổi state của router, nên nó nằm trong <code>act(…)</code> — một cập nhật do chính test gây ra, không do thao tác người dùng (luật ở Bài 9.2). Phép kiểm PUSH hay REPLACE ghi lại một quyết định trải nghiệm từ Chương 5: chọn chuyên khoa là một bước mà nút Back nên hoàn tác được; gõ trong ô tìm thì không.</p>

<h3>Hook dựng trên TanStack Query</h3>
${slide('rx-09', 18, 'useKhungGio: pending → success, enabled:false không gọi, keepPreviousData giữ ngày cũ')}
<p><code>useKhungGio(bacSiId, ngay)</code> nhỏ, nhưng dòng nào cũng là một quyết định mà ai đó có thể lỡ tay xoá:</p>
${pre('ts', SN.useKhungGio)}
<p>Mỗi quyết định một test. Để chứng minh "không có request" hay "đúng một request", file lắng nghe chính sự kiện của MSW — <code>request:start</code> bắn ra cho mọi request tới được mạng giả:</p>
${pre('tsx', SN.kgDemRequest)}
${pre('tsx', SN.kgThanhCong)}
${pre('tsx', SN.kgEnabled)}
<p>Muốn chứng minh một việc đã <em>không</em> xảy ra thì phải cho nó cơ hội để xảy ra: 50 ms tạm dừng là để nếu query bị bật nhầm thì nó đã kịp chạy. <code>fetchStatus: 'idle'</code> đi cùng <code>isPending: true</code> là cách TanStack nói "chưa có dữ liệu và cũng không đang tải" — một query đang bị tắt.</p>
${pre('tsx', SN.kgPlaceholder)}
<p><code>keepPreviousData</code> là lý do lưới giờ không nháy trắng khi bạn đổi ngày (Chương 6). Test đổi ngày bằng <code>rerender</code>, kiểm rằng trong một khoảnh khắc dữ liệu vẫn là ngày <em>cũ</em> với <code>isPlaceholderData: true</code>, rồi đợi ngày mới. Bỏ <code>placeholderData</code> khỏi hook là test này đỏ — đo ở cuối bài.</p>
${pre('tsx', SN.kg404)}
<p>Để ý <code>queryClient: taoQueryClient()</code> ở đây: client <em>của app</em>, có chính sách thử lại, cố ý. Lỗi 404 không được thử lại (bác sĩ không tồn tại thì một giây sau cũng không tồn tại), và "đúng một request" chứng minh chính sách đó chạy với client thật — trong 63 ms, vì không có lần thử lại nào.</p>

<h3>Hook mutation: <code>act</code> quanh lời gọi, <code>waitFor</code> cho state</h3>
${slide('rx-09', 19, 'mutateAsync xong không có nghĩa result.current đã đổi — TanStack báo tin sau một nhịp')}
<p><code>useDatLich</code> gửi lịch hẹn và, khi xong, làm cũ hai vùng cache. Lần chạy đầu của test nó hỏng theo một kiểu dạy ta điều gì đó về API giả:</p>
${out(OUT.datLichThieu)}
<p>Một lỗi 404 "Không có khung giờ này" thay vì 409 như mong đợi. Máy chủ giả tạo khung giờ <em>lười</em>, lần đầu có người GET chúng. Trên trang, lưới giờ làm việc đó trước khi ai kịp đặt; một hook test riêng thì bỏ qua trang, nên khung giờ chưa tồn tại. Test phải tự chuẩn bị thế giới của nó:</p>
${pre('tsx', SN.datLichChuanBi)}
<p>Bất ngờ thứ hai nằm ở test thành công. <code>mutateAsync</code> đã trả về lịch hẹn mới, vậy mà dòng tiếp theo <code>result.current.isSuccess</code> vẫn là <code>false</code>:</p>
${out(OUT.datLichNgay)}
<p>TanStack Query đưa thay đổi state tới component qua <code>notifyManager</code> của nó, mặc định gom lại trong một <code>setTimeout(0)</code> — một nhịp <em>sau</em> cái promise bạn vừa đợi. Nên khuôn cho hook mutation là: gọi mutation trong <code>await act(async () =&gt; …)</code> (nó cập nhật state), rồi <code>await waitFor</code> state của hook. Muốn kiểm <em>vùng cache nào</em> bị làm cũ, theo dõi client thật: <code>vi.spyOn(queryClient, 'invalidateQueries')</code> ghi lại các lần gọi mà vẫn chạy hàm gốc.</p>
${pre('tsx', SN.datLichOk)}
${pre('tsx', SN.datLich409Hook)}
<p><code>await expect(promise).rejects.toMatchObject(…)</code> kiểm rằng một Promise thất bại, và thất bại với cái gì. Test 409 ghim lại quyết định của Chương 6: <code>onSettled</code>, không phải <code>onSuccess</code>, làm cũ khung giờ — sau một lần xung đột thì lưới giờ trên màn hình đã cũ rồi.</p>

<h3>Không cần React: store và hàm thuần</h3>
${slide('rx-09', 20, 'Store Zustand và chính sách thử lại chỉ là JavaScript — test không cần vẽ gì')}
<p>Store Zustand là một object JavaScript có <code>getState()</code> và <code>setState()</code>. Luật của store thông báo — thêm vào cuối, gỡ theo id, tự ẩn sau đúng 5 giây — không cần component nào. Với đồng hồ giả, năm giây trôi qua trong một micro giây:</p>
${pre('ts', SN.storeTest)}
<p><code>afterEach</code> trong <code>setup.ts</code> trả mọi store về trạng thái đầu (<code>useThongBaoStore.setState(useThongBaoStore.getInitialState(), true)</code>), nên test nào cũng bắt đầu trống. Cùng cách đó cho chính sách thử lại mà Bài 9.2 phải tắt trong test component — ở đây cả sáu nhánh chạy trong vài mili giây:</p>
${pre('ts', SN.queryClientTest)}
<p>Tất cả test hook và store của bài này:</p>
${out(OUT.hook)}

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202, logic dùng lại nằm trong method của class, trong higher-order component (<code>withLoading(Component)</code>) hoặc là đoạn <code>componentDidMount</code> chép đi chép lại, và nếu có test thì test thò tay vào instance: <code>wrapper.instance().handleFilter('nhi')</code>, rồi <code>expect(wrapper.state('list'))…</code>. → Đi làm, logic dùng chung là một custom hook; nó được test qua các component dùng nó, và — khi nó dùng chung và có nhiều nhánh — test trực tiếp bằng <code>renderHook</code> cộng một wrapper cho ngữ cảnh, chỉ kiểm thứ nó trả về và thứ nó gây ra (URL, request, cache). Luật thuần tuý thì dời hẳn ra khỏi hook và test như hàm. · <em>Vì sao:</em> test gọi method của instance là test một đoạn mã mà không người dùng nào chạy theo thứ tự đó, và gãy khi class thành function component. Test hook nhìn đúng thứ một component gọi nó nhìn thấy. Bạn vẫn sẽ gặp HOC ở codebase cũ (và trong vài thư viện); test của chúng là test component.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Bạn test một custom hook thế nào?"</p>
<p>Nếu chỉ một component dùng, test qua component đó. Nếu dùng chung, dùng <code>renderHook</code> của Testing Library: kiểm <code>result.current</code> (đọc mới ngay trong phép kiểm), đổi đầu vào bằng <code>rerender</code>, kiểm dọn dẹp bằng <code>unmount</code>, bọc hàm ghi state trong <code>act</code>. Hook dùng context cần <code>wrapper</code> (router, <code>QueryClientProvider</code> với client mới); hook dữ liệu dùng MSW và <code>waitFor</code>. Thứ gì không cần React — store, reducer, kiểm dữ liệu — test như hàm thường.</p></div>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Vì sao mỗi test tạo một QueryClient mới?"</p>
<p>Cache là state. Client dùng chung mang dữ liệu từ test này sang test sau (một danh sách rỗng trong cache làm một test sau đỏ ở Bài 9.2), và thử lại mặc định làm test lỗi phải đợi vài giây. Một client mới với <code>retry: false</code> cho mỗi test giữ các test độc lập và nhanh; còn chính sách thử lại thì test riêng như một hàm.</p></div>

<h3>▶ Chạy thử từng bước</h3>
<ol>
<li><code>npx vitest run src/shared src/features/bac-si/hooks src/features/dat-lich/useKhungGio.test.tsx src/features/dat-lich/useDatLich.test.tsx src/app/query-client.test.ts --reporter=verbose</code> — 19 test.</li>
<li>Trong <code>useKhungGio.test.tsx</code>, chép <code>result.current.isPlaceholderData</code> ra một biến trước <code>rerender</code>; chạy và đọc lỗi. Trả lại.</li>
<li>Trong <code>useDatLich.test.tsx</code>, xoá <code>beforeEach</code> gọi <code>khungGioTrongNgay</code>; chạy và tìm lỗi 404. Trả lại.</li>
<li>Chạy ba bản cố ý sai: <code>npx vitest run -c vitest.sai.config.ts src/vi-du/ch09/bai3.sai.tsx</code>.</li>
<li>Trong <code>thong-bao-store.test.ts</code>, đổi <code>1999</code> thành <code>2000</code>. Phép kiểm nào đỏ, và vì sao đó đúng là cái nên đỏ?</li>
</ol>

<h3>🛠 Tự gõ tiếp dự án — bước 3/4: test cho hook và store</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau bước 2/4 (<code>src/test/render.tsx</code>, <code>src/shared/hooks/useTieuDeTrang.ts</code>, <code>src/features/bac-si/hooks/useBoLocUrl.ts</code>, <code>src/features/dat-lich/useKhungGio.ts</code>, <code>useDatLich.ts</code>, <code>src/shared/store/thong-bao-store.ts</code>, <code>src/app/query-client.ts</code>).</p><ol>
<li>Thêm <code>taoWrapper({ url, queryClient })</code> vào <code>src/test/render.tsx</code> (import <code>MemoryRouter</code> từ <code>react-router</code>).</li>
<li><code>src/shared/hooks/useTieuDeTrang.test.ts</code> — đặt, rerender, unmount.</li>
<li><code>src/features/bac-si/hooks/useBoLocUrl.test.tsx</code> — đọc, từ chối giá trị URL bậy, PUSH mà giữ từ khoá, REPLACE về URL sạch.</li>
<li><code>src/features/dat-lich/useKhungGio.test.tsx</code> — thành công với một request, tắt thì không request nào, placeholder khi đổi ngày, 404 không bị client của app thử lại.</li>
<li><code>src/features/dat-lich/useDatLich.test.tsx</code> — thành công làm cũ cả hai khoá; 409 thì từ chối và vẫn làm cũ khung giờ.</li>
<li><code>src/shared/store/thong-bao-store.test.ts</code> và <code>src/app/query-client.test.ts</code> — không React.</li>
</ol>
<p><strong>Đạt khi:</strong> 19 test xanh, <code>npx tsc -b</code> không in gì, và bắt được các lần cố ý làm hỏng: bỏ <code>placeholderData: keepPreviousData</code> khỏi <code>useKhungGio</code>; đổi <code>5000</code> thành <code>3000</code> trong store thông báo; đổi <code>onSettled</code> thành <code>onSuccess</code> trong <code>useDatLich</code>.</p></div>
<details><summary>Lời giải</summary>
<p>Mọi file của bước này đã in ở trên, đầy đủ hoặc trọn các test của nó; phần đầu mỗi file chỉ là import và một dòng chú thích. Hai chi tiết quyết định chạy được hay không: listener <code>request:start</code> của MSW cùng <code>afterEach</code> làm rỗng mảng của nó trong <code>useKhungGio.test.tsx</code>, và <code>await waitFor(() =&gt; expect(result.current.isSuccess).toBe(true))</code> sau mutation trong <code>useDatLich.test.tsx</code>. Chạy ngày 26/09/2026: 19 test xanh (output ở trên). Ba lần cố ý làm hỏng:</p>
${out(O3.dotBien)}
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề:</strong> test <code>useLichHen</code> trong <code>src/features/lich-hen/useLichHen.ts</code>.</p><ol>
<li>Với <code>taoWrapper()</code>, <code>renderHook(() =&gt; useLichHen())</code>: đợi thành công và kiểm một mảng rỗng (cơ sở dữ liệu giả bắt đầu trống).</li>
<li>Thêm một lịch hẹn bằng <code>db.themLichHen({…})</code> trước khi vẽ (chép object từ <code>DanhSachLichHen.test.tsx</code>); kiểm <code>data</code> dài 1 và <code>trangThai</code> là <code>'cho-xac-nhan'</code>.</li>
<li><code>useLichHen({ batDau: false })</code>: kiểm không request nào tới MSW trong 50 ms (dùng lại mẹo <code>request:start</code>).</li>
</ol><p><strong>Đạt khi:</strong> ba test xanh; đổi <code>enabled: batDau</code> thành <code>enabled: true</code> trong hook làm đúng test thứ ba đỏ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">custom hook — hook tự viết</span><span class="v">hàm bắt đầu bằng <code>use</code>, gọi các hook khác; logic không có giao diện</span></div>
<div class="kv"><span class="k"><code>renderHook</code></span><span class="v">vẽ một component vô hình gọi hook của bạn</span></div>
<div class="kv"><span class="k"><code>result.current</code></span><span class="v">giá trị hook trả về ở lần render mới nhất — đọc mới mỗi lần</span></div>
<div class="kv"><span class="k"><code>rerender</code> / <code>unmount</code></span><span class="v">vẽ lại với props mới / gỡ và chạy dọn dẹp</span></div>
<div class="kv"><span class="k">wrapper</span><span class="v">component bọc quanh hook để cấp ngữ cảnh (router, QueryClient)</span></div>
<div class="kv"><span class="k"><code>vi.spyOn</code></span><span class="v">ghi lại các lần gọi một method thật mà vẫn chạy nó</span></div>
<div class="kv"><span class="k">placeholder data — dữ liệu tạm</span><span class="v">dữ liệu cũ hiện trong lúc khoá mới đang tải (<code>isPlaceholderData</code>)</span></div>
<div class="kv"><span class="k">notifyManager</span><span class="v">bộ gom cập nhật gửi tới component của TanStack, mặc định trễ một nhịp</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chỉ test hook trực tiếp khi nó dùng chung và có nhiều nhánh; còn lại test component, và test logic không cần React như hàm thường.</li>
<li><code>renderHook</code> cho <code>result.current</code>, <code>rerender</code> và <code>unmount</code>; đừng bao giờ tách <code>result.current</code> ra trước khi đợi.</li>
<li>Hook đọc context cần <code>wrapper</code>; <code>taoWrapper</code> dựng <code>QueryClient</code> mới và <code>MemoryRouter</code>; gọi thêm hook trong hàm để quan sát tác dụng phụ như URL.</li>
<li>Hook dữ liệu: sự kiện của MSW chứng minh có bao nhiêu request; <code>waitFor</code> cho state; client thật của app chứng minh chính sách thử lại với 4xx.</li>
<li>Hook mutation: <code>await act</code> quanh lời gọi, <code>waitFor</code> cho <code>isSuccess</code> (TanStack báo tin sau một nhịp), <code>vi.spyOn</code> cho việc làm cũ cache; tự chuẩn bị dữ liệu giả sinh lười.</li>
<li>Store và chính sách thử lại không cần React; đồng hồ giả biến "sau 5 giây" thành tức thì và chính xác.</li>
</ul>

${LINK('https://testing-library.com/docs/react-testing-library/api#renderhook', '🪝', 'Testing Library — renderHook', 'API: result, rerender, unmount, wrapper.')}
${LINK('https://tanstack.com/query/latest/docs/framework/react/guides/testing', '🗃', 'TanStack Query — Testing', 'Client mới cho mỗi test, tắt thử lại.')}
${LINK('https://mswjs.io/docs/api/life-cycle-events', '📡', 'MSW — Sự kiện vòng đời', 'request:start và các sự kiện khác, để đếm request.')}
${LINK_TRONG('/courses/react/learn?lessonSlug=rx-4-4-custom-hook', '↩️', 'Bài 4.4 — Hook tự viết', 'Nơi useDebounce được test bằng renderHook và đồng hồ giả.')}
</div>
`,
};

/* Output cắt sẵn cho Bài 9.4 */
const O4 = {
  cuoi: OUT.covSau + '\n\n' + OUT.cuoiVitest + '\n\n' + OUT.cuoiBuild,
  truocSau: '# trước Chương 9 — dự án sau Chương 12, 47 test\n' + OUT.covTruoc.split('\n').slice(1).join('\n') + '\n\n# sau Chương 9 — 114 test\n' + OUT.covSau.split('\n').filter((l) => /:/.test(l) && !/Tests|Test Files/.test(l)).join('\n'),
  truocSauEn: '# before Chapter 9 — project after Chapter 12, 47 tests\n' + OUT.covTruoc.split('\n').slice(1).join('\n') + '\n\n# after Chapter 9 — 114 tests\n' + OUT.covSau.split('\n').filter((l) => /:/.test(l) && !/Tests|Test Files/.test(l)).join('\n'),
};
/* 20 câu phỏng vấn — [câu EN, ý EN, câu VI, ý VI, chương] */
const PV = [
  ['What happens, step by step, when you call setState?', 'React schedules a re-render of that component (updates in the same event are batched). It calls the component function again, compares the new JSX with the previous tree (reconciliation), then commits only the DOM changes; the browser paints. Children re-render by default unless memoized. State updates are not immediate inside the handler — you read the old value until the next render.', 'Gọi setState thì từng bước chuyện gì xảy ra?', 'React lên lịch vẽ lại component đó (các cập nhật trong cùng một sự kiện được gom lại). Nó gọi lại hàm component, so JSX mới với cây cũ (reconciliation), rồi chỉ commit phần DOM thay đổi; trình duyệt vẽ. Con mặc định cũng vẽ lại trừ khi được memo. State không đổi ngay trong hàm xử lý — tới lần render sau mới đọc được giá trị mới.', 'Ch2, Ch11'],
  ['Why do lists need a key, and why is the array index a bad key?', 'The key tells React which item is which between renders, so it can keep state and DOM with the right item. With the index, inserting or removing at the top shifts every key: state (an input’s text, a checkbox) jumps to the wrong row. Use a stable id from the data.', 'Vì sao danh sách cần key, và vì sao dùng chỉ số mảng làm key là tệ?', 'Key cho React biết phần tử nào là phần tử nào giữa các lần render, để giữ state và DOM đúng chỗ. Dùng chỉ số thì thêm hay xoá ở đầu làm mọi key lệch đi: state (chữ trong ô, checkbox) nhảy sang dòng khác. Dùng id ổn định lấy từ dữ liệu.', 'Ch1, Ch11'],
  ['Props versus state — and what does "lifting state up" mean?', 'Props are inputs a parent passes in (read-only for the child); state is data a component owns and changes. When two siblings need the same data, move the state to their closest common parent and pass it down with a callback to change it — one source of truth.', 'Props khác state thế nào — và "đưa state lên" nghĩa là gì?', 'Props là đầu vào cha truyền xuống (con chỉ đọc); state là dữ liệu component tự giữ và tự đổi. Khi hai anh em cần cùng dữ liệu, dời state lên cha chung gần nhất rồi truyền xuống kèm hàm đổi — một nguồn sự thật duy nhất.', 'Ch1, Ch2, Ch5'],
  ['Controlled versus uncontrolled inputs? Why does React Hook Form prefer uncontrolled?', 'Controlled: React state holds the value, every keystroke re-renders. Uncontrolled: the DOM holds it, you read it when needed (refs). React Hook Form registers uncontrolled inputs to avoid re-rendering the whole form per keystroke, and only re-renders what subscribes to errors or values.', 'Input có kiểm soát và không kiểm soát khác gì? Vì sao React Hook Form chuộng không kiểm soát?', 'Có kiểm soát: state của React giữ giá trị, mỗi phím gõ là một lần vẽ lại. Không kiểm soát: DOM giữ, cần thì đọc (qua ref). React Hook Form đăng ký input không kiểm soát để khỏi vẽ lại cả form mỗi phím, và chỉ vẽ lại phần theo dõi lỗi hay giá trị.', 'Ch3'],
  ['When does useEffect run, what is the dependency array for, and when do you not need an effect?', 'After the commit, and again whenever a dependency changed (by Object.is); the cleanup runs before the next run and on unmount. Effects are for synchronising with things outside React (timers, subscriptions, the document title). Deriving data from props/state, or reacting to a click, needs no effect: compute during render or do it in the handler.', 'useEffect chạy khi nào, mảng phụ thuộc để làm gì, và khi nào KHÔNG cần effect?', 'Sau commit, và chạy lại mỗi khi một phụ thuộc đổi (so bằng Object.is); hàm dọn dẹp chạy trước lần kế tiếp và khi gỡ. Effect là để đồng bộ với thứ ngoài React (hẹn giờ, đăng ký sự kiện, tiêu đề trang). Suy dữ liệu từ props/state, hay phản ứng với cú bấm, thì không cần effect: tính ngay trong render hoặc làm trong hàm xử lý.', 'Ch4'],
  ['Why does my effect run twice in development?', 'StrictMode mounts, unmounts and re-mounts components once in development to surface effects without a proper cleanup. It does not happen in production. The fix is a correct cleanup, not removing StrictMode.', 'Vì sao effect của tôi chạy hai lần khi dev?', 'StrictMode gắn, gỡ rồi gắn lại component một lần khi dev để lộ ra effect thiếu dọn dẹp. Production không như vậy. Cách sửa là viết dọn dẹp đúng, không phải bỏ StrictMode.', 'Ch11'],
  ['Context, Zustand, Redux — and what is "server state"?', 'Server state is a copy of data owned by the server (doctors, appointments): it needs caching, refetching, invalidation — TanStack Query. Client state is UI or user state (filters, favourites, a toast): Context for rarely-changing values, a store like Zustand when many distant components read and write it. Redux still exists in many codebases; Redux Toolkit is its modern form.', 'Context, Zustand, Redux — và "server state" là gì?', 'Server state là bản sao của dữ liệu máy chủ sở hữu (bác sĩ, lịch hẹn): cần cache, tải lại, làm cũ — TanStack Query. Client state là state của giao diện hay người dùng (bộ lọc, yêu thích, thông báo): Context cho giá trị ít đổi, store như Zustand khi nhiều component xa nhau cùng đọc ghi. Redux vẫn có ở nhiều codebase; Redux Toolkit là dạng hiện đại của nó.', 'Ch5, Ch6'],
  ['How do you fetch data in a React app in 2026?', 'Not with fetch in useEffect for anything real. A data library (TanStack Query) or a framework loader handles caching by key, de-duplication, retries, stale-while-revalidate, cancellation and loading/error states. Mutations invalidate the queries they affect. On the server (Next.js), Server Components fetch directly.', 'Năm 2026 bạn lấy dữ liệu trong app React thế nào?', 'Không dùng fetch trong useEffect cho việc thật. Một thư viện dữ liệu (TanStack Query) hoặc loader của framework lo cache theo khoá, gộp request trùng, thử lại, hiện dữ liệu cũ trong lúc tải lại, huỷ request và trạng thái tải/lỗi. Mutation làm cũ những query nó ảnh hưởng. Ở máy chủ (Next.js), Server Component tự lấy dữ liệu.', 'Ch6'],
  ['What is an optimistic update and how do you roll it back?', 'Show the expected result before the server answers (a cancelled appointment turns "Đã huỷ" at once). If the request fails, return to the real data and tell the user. With TanStack Query: snapshot in onMutate, restore in onError, invalidate in onSettled; in React 19, useOptimistic inside an Action reverts automatically when the Action ends.', 'Cập nhật lạc quan là gì và hoàn tác thế nào?', 'Hiện kết quả mong đợi trước khi máy chủ trả lời (lịch hẹn thành "Đã huỷ" ngay). Request hỏng thì quay về dữ liệu thật và báo người dùng. Với TanStack Query: chụp bản cũ ở onMutate, trả lại ở onError, làm cũ ở onSettled; ở React 19, useOptimistic trong một Action tự quay về khi Action kết thúc.', 'Ch6, Ch12'],
  ['When do memo, useMemo and useCallback actually help? What changes with React Compiler?', 'Only when measured: memo skips a child whose props are unchanged; useMemo caches an expensive calculation or keeps an object’s identity stable; useCallback keeps a function stable for a memoized child. Without a memoized consumer, useCallback does nothing useful. React Compiler inserts this memoization automatically — but compares by identity, so code that mutates objects in place can show stale UI (Lesson 9.1).', 'memo, useMemo, useCallback khi nào thật sự có ích? React Compiler đổi gì?', 'Chỉ khi đo thấy: memo bỏ qua con có props không đổi; useMemo nhớ một phép tính nặng hoặc giữ danh tính object ổn định; useCallback giữ hàm ổn định cho một con đã memo. Không có nơi nhận được memo thì useCallback vô ích. React Compiler tự chèn việc ghi nhớ đó — nhưng so bằng danh tính, nên mã sửa object tại chỗ có thể hiện giao diện cũ (Bài 9.1).', 'Ch8, Ch12, 9.1'],
  ['What is code splitting and how do you do it in React?', 'Ship less JavaScript up front: load a page’s code only when it is visited. React.lazy with a dynamic import() plus Suspense, or the router’s lazy routes; the bundler creates a separate chunk at each import(). Measure the bundle before and after.', 'Chia nhỏ mã (code splitting) là gì và làm thế nào trong React?', 'Gửi ít JavaScript hơn lúc đầu: chỉ tải mã của một trang khi người dùng tới đó. React.lazy với import() động cộng Suspense, hoặc route lazy của router; bundler tạo chunk riêng ở mỗi import(). Đo bundle trước và sau.', 'Ch8'],
  ['What are Suspense and error boundaries for?', 'Suspense shows a fallback while something inside is not ready (lazy code, or data read with use()/a Suspense-enabled library). An error boundary (a class component, or the router’s errorElement) catches render errors below it and shows a fallback instead of a blank page. Place both around regions, not only the whole app.', 'Suspense và error boundary để làm gì?', 'Suspense hiện fallback khi thứ gì đó bên trong chưa sẵn sàng (mã lazy, hoặc dữ liệu đọc bằng use()/thư viện hỗ trợ Suspense). Error boundary (một class component, hoặc errorElement của router) bắt lỗi render bên dưới và hiện màn thay thế thay vì trang trắng. Đặt cả hai quanh từng vùng, không chỉ quanh cả app.', 'Ch11, Ch12'],
  ['useTransition versus useDeferredValue?', 'Both mark work as non-urgent so typing stays responsive. useTransition wraps a state update you own (startTransition(() => setX(...))) and gives isPending. useDeferredValue takes a value you receive and gives a lagging copy. Never put the input’s own value in a transition.', 'useTransition khác useDeferredValue thế nào?', 'Cả hai đánh dấu việc không khẩn để gõ phím vẫn mượt. useTransition bọc một cập nhật state do mình gọi (startTransition(() => setX(...))) và cho isPending. useDeferredValue nhận một giá trị từ ngoài vào và trả bản trễ của nó. Không bao giờ đặt chính giá trị của ô input vào transition.', 'Ch12'],
  ['What accessibility checks do you do on a React UI?', 'Semantic elements first (button, label, heading levels), every input labelled, keyboard reachable with a visible focus, errors linked with aria-describedby, live regions for status. Automated: axe in tests or the browser; manual: tab through it, try a screen reader. Tests that query by role catch a lot for free.', 'Bạn kiểm những gì về khả năng tiếp cận cho giao diện React?', 'Thẻ đúng nghĩa trước (button, label, cấp tiêu đề), ô nào cũng có nhãn, đi được bằng bàn phím với focus nhìn thấy, lỗi gắn bằng aria-describedby, vùng status cho thông báo. Tự động: axe trong test hoặc trình duyệt; tay: Tab qua hết, thử trình đọc màn hình. Test hỏi theo vai trò bắt được nhiều thứ miễn phí.', 'Ch8, 9.1'],
  ['How do you test a React component, and what do you not test?', 'Render it with its real providers, act with user-event, assert on what the user sees (roles, labels, text) with Testing Library. Cover the states (loading, empty, error) and the interactions that matter. Do not test implementation details (state names, hook calls, CSS classes), third-party library internals, or trivial markup; test pure rules as functions.', 'Bạn test một component React thế nào, và KHÔNG test gì?', 'Vẽ nó cùng provider thật, thao tác bằng user-event, kiểm thứ người dùng thấy (vai trò, nhãn, chữ) bằng Testing Library. Phủ các trạng thái (tải, rỗng, lỗi) và các thao tác quan trọng. Không test chi tiết cài đặt (tên state, lời gọi hook, class CSS), ruột thư viện bên thứ ba, hay markup vặt; luật thuần thì test như hàm.', '9.1, 9.4'],
  ['How do you mock API calls in tests, and why MSW rather than mocking fetch or axios?', 'MSW intercepts at the network layer, so your fetch wrapper, error handling and cache run for real; one set of handlers serves development and tests, and each test overrides only its scenario with server.use. Mocking the module (vi.mock/jest.mock) skips that code: in Lesson 9.4 a broken fetch wrapper kept the module-mocked tests green.', 'Bạn giả lời gọi API trong test thế nào, vì sao MSW thay vì giả fetch hay axios?', 'MSW chặn ở tầng mạng, nên lớp bọc fetch, xử lý lỗi và cache của bạn chạy thật; một bộ handler phục vụ cả phát triển lẫn test, mỗi test chỉ ghi đè kịch bản của nó bằng server.use. Giả cả module (vi.mock/jest.mock) là bỏ qua đoạn mã đó: ở Bài 9.4, lớp bọc fetch bị hỏng mà các test giả module vẫn xanh.', '9.2, 9.4'],
  ['getBy, queryBy, findBy — and what is act()?', 'getBy throws if absent, queryBy returns null (for asserting absence), findBy waits asynchronously. act() flushes React updates before assertions; Testing Library wraps its helpers in it. A "not wrapped in act" warning means an update landed while the test was not waiting — await the visible result instead of wrapping blindly.', 'getBy, queryBy, findBy — và act() là gì?', 'getBy ném lỗi khi không có, queryBy trả null (để kiểm "không có"), findBy đợi bất đồng bộ. act() xả hết cập nhật của React trước khi kiểm; Testing Library bọc sẵn các hàm của nó. Cảnh báo "not wrapped in act" nghĩa là có cập nhật tới lúc test không đợi — hãy await kết quả nhìn thấy được thay vì bọc bừa.', '9.1, 9.2'],
  ['Unit, integration, end-to-end — how many of each, and what coverage do you aim for?', 'Mostly integration tests (a component with its real children, router and a fake network), unit tests for pure logic, a few end-to-end tests in a real browser for the critical flows (Playwright), plus static checks (TypeScript, lint). Coverage is a floor that catches untested areas, not a goal: set a threshold the team keeps, watch the trend, and check that tests fail when the code breaks.', 'Unit, integration, end-to-end — mỗi loại bao nhiêu, và nhắm độ phủ bao nhiêu?', 'Phần lớn là test tích hợp (component cùng con thật, router và mạng giả), test đơn vị cho logic thuần, vài test đầu-cuối trên trình duyệt thật cho luồng quan trọng (Playwright), cộng kiểm tĩnh (TypeScript, lint). Độ phủ là cái sàn để lộ vùng chưa test, không phải đích: đặt ngưỡng nhóm giữ được, theo dõi xu hướng, và kiểm rằng test đỏ khi mã hỏng.', '9.4'],
  ['Is React safe from XSS? When is it not?', 'React escapes text in JSX, so a string like <img onerror=…> is shown as text. It is not safe when you bypass that: dangerouslySetInnerHTML with untrusted HTML, javascript: URLs in href, or injecting into the DOM directly. Sanitize HTML (DOMPurify) and validate URLs.', 'React có an toàn trước XSS không? Khi nào thì không?', 'React thoát ký tự cho chữ trong JSX, nên chuỗi như <img onerror=…> hiện ra thành chữ. Không an toàn khi bạn lách qua cơ chế đó: dangerouslySetInnerHTML với HTML không tin được, URL javascript: trong href, hoặc chèn thẳng vào DOM. Làm sạch HTML (DOMPurify) và kiểm URL.', 'Ch13'],
  ['What is the virtual DOM, reconciliation and Fiber — in one minute?', 'React describes the UI as a tree of elements; on each update it builds the new tree and diffs it with the old one (reconciliation) using type and key to decide what to keep, then applies minimal DOM changes. Fiber is the internal architecture that splits rendering into units of work React can pause and prioritise — the basis of transitions and Suspense.', 'Virtual DOM, reconciliation và Fiber là gì — trong một phút?', 'React mô tả giao diện bằng một cây phần tử; mỗi lần cập nhật nó dựng cây mới và so với cây cũ (reconciliation) dựa trên loại và key để quyết định giữ gì, rồi áp phần thay đổi tối thiểu lên DOM. Fiber là kiến trúc bên trong chia việc render thành từng đơn vị mà React tạm dừng và xếp ưu tiên được — nền của transition và Suspense.', 'Ch11'],
];
const H1 = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pvKhoi = (en) => PV.map(([qe, ae, qv, av, ch], i) => '<details><summary>' + (i + 1) + '. ' + H1(en ? qe : qv) + '</summary><p>' + H1(en ? ae : av) + '</p><p><em>' + (en ? 'Where in this course: ' + ch.replace(/Ch(\d+)/g, 'Chapter $1').replace(/(^|, )(9\.\d)/g, '$1Lesson $2') : 'Học ở đâu trong khoá: ' + ch.replace(/Ch(\d+)/g, 'Chương $1').replace(/(^|, )(9\.\d)/g, '$1Bài $2')) + '</em></p></details>').join('\n');
const PV_EN = pvKhoi(true);
const PV_VI = pvKhoi(false);

const L4 = {
    title: '9.4 — Coverage measured, what to test (and what not), and 20 React interview questions|||9.4 — Độ phủ đo thật, test gì (và bỏ gì), và 20 câu hỏi phỏng vấn React',
    slug: 'rx-9-4-phong-van',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Đo độ phủ bằng @vitest/coverage-v8 trước và sau chương, React Compiler làm lệch số nhánh thế nào, báo cáo HTML, ngưỡng trong CI, giả ở tầng mạng hay tầng module (đo bằng đột biến), test gì — bỏ gì, chỗ của E2E, và 20 câu hỏi phỏng vấn React có ý trả lời.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Coverage measured, what to test (and what not), and 20 React interview questions</h2>
<p class="lead">You now have 114 green tests. Are they enough? Are they the right ones? "Green" only says the tests you wrote agree with the code you wrote. This lesson gives you three instruments to judge a test suite — <strong>coverage</strong> (which code did the tests run?), <strong>mutation</strong> (if I break the code, does a test notice?) and a short list of <strong>what is worth testing</strong> — measures all three on the clinic app, and ends with the React questions that come up in interviews, each with the points a good answer makes and where this course taught it.</p>
<p>Setup: the project after step 3 of this chapter; this lesson adds <code>@vitest/coverage-v8</code> 5.0.2 (same version as Vitest — they must match). Everything else as before: Vitest 5.0.2, React 19.3.0 with React Compiler 1.0.0, MSW 2.15.0. This course does not teach end-to-end testing with Playwright: the mid-course project (Chapter 10) adds one Playwright test for the booking flow, and the Next.js course (Chapter 19) and the Testing course go deep.</p>

<h3>Coverage: which lines did the tests run?</h3>
${slide('rx-09', 21, 'Coverage before and after this chapter: lines 93.09% → 96.32%, functions 86.89% → 93.1%')}
<p><strong>Code coverage</strong> (độ phủ mã) is measured while the tests run: the V8 engine counts which parts of each file executed. Four numbers come out:</p>
<table>
<thead><tr><th>Metric</th><th>Counts</th><th>Read it as</th></tr></thead>
<tbody>
<tr><td>Statements</td><td>each statement</td><td>"how much code ran"</td></tr>
<tr><td>Branches</td><td>each side of every <code>if</code>, <code>? :</code>, <code>&amp;&amp;</code>, <code>??</code>, default parameter</td><td>"how many decisions were tried both ways" — the most useful one</td></tr>
<tr><td>Functions</td><td>each function (incl. arrow functions)</td><td>"which handlers were never called"</td></tr>
<tr><td>Lines</td><td>each line with code</td><td>like statements, per line</td></tr>
</tbody>
</table>
<p>Install the provider and configure it once, in <code>vite.config.ts</code>, so every run (and CI) measures the same thing:</p>
${pre('bash', 'npm install -D @vitest/coverage-v8@5.0.2')}
${pre('ts', SN.viteCoverage)}
${pre('json', SN.scriptCov)}
<p>Two decisions in that config. <code>include: ['src/**/*.{ts,tsx}']</code>: by default Vitest only reports files some test imported, so a page nobody tests is simply <em>missing</em> from the report instead of showing 0%. (In this project it makes little difference — the routing tests import every page — dropping <code>include</code> removed exactly one file, <code>types.ts</code>. In a project without such tests, whole pages vanish.) <code>exclude</code>: tests, experiments, the fake API and dev-only tools are not product code. Now the measurement, before this chapter (the Chapter 12 project, same settings) and after:</p>
${out(O4.truocSauEn)}
<p>Per file, the before picture explains why this chapter wrote the tests it wrote:</p>
${out(OUT.covTruocFile)}
<p><code>LoiTaiDuLieu</code> — the error box every data screen uses — at 0%: no test had ever put the app into an error state. <code>query-client.ts</code> at 50% statements: the retry policy had never been exercised. <code>FormDatLich.tsx</code> at 97.72% of statements — and a bug. Hold on to that last one.</p>

<h3>Coverage lies in two directions</h3>
${slide('rx-09', 22, 'Same tests, same source: React Compiler turns 231 branches into 838 — compare numbers only within one pipeline')}
<p><strong>High coverage does not mean tested.</strong> Coverage says a line <em>ran</em>, not that anything checked its result. <code>FormDatLich</code> was almost fully covered before this chapter: every line ran in the routing test that books an appointment. The stale-error bug was on a covered line; what was missing was an assertion that looked at the screen after the value became valid. Coverage cannot see assertions.</p>
<p><strong>Low coverage does not always mean untested.</strong> Coverage measures the code that <em>runs</em> — after Vite, Babel and React Compiler transformed it. Same 114 tests, same source files, measured twice, with and without the compiler:</p>
${out(OUT.covSoSanh)}
<p>The compiler adds a "cache hit / cache miss" branch around every memoized piece of JSX: 231 branches become 838, and many "cache hit" sides never run in a test that renders a component once. <code>KhungXuong.tsx</code> (the skeletons) shows 7/14 branches with the compiler and 1/1 without — nothing about its testing changed. Notice also that two runs of the same command can differ by a few tenths (80.78% and 81.02% on branches in our runs): some branches depend on timing, for example whether a background refetch was still in flight. Practical rules: compare numbers only from the same pipeline; set thresholds on the pipeline you ship (here: with the compiler); watch the trend and the per-file list, not the second decimal.</p>

<h3>The HTML report: read the red lines</h3>
${slide('rx-09', 23, 'The HTML report marks lines no test ran — here, the "time slot not found" page')}
<p><code>reporter: ['text', 'html']</code> writes <code>coverage/index.html</code> (add <code>coverage</code> to <code>.gitignore</code>). Open it, click a file, and every line no test executed is highlighted; <code>I</code> and <code>E</code> markers show an <code>if</code> or <code>else</code> side that never ran. In <code>TrangDatLich.tsx</code>, lines 30–33 are red: the "Không tìm thấy khung giờ này" screen for a link to a slot that does not exist. Is that worth a test? A patient gets there from an old link in a chat message — yes, a 10-line test. <code>TrangLoi.tsx</code> (the router's error page) is at 0% for the same reason; that is the practice task of this lesson. The report is a map of <em>where to look</em>, not a score.</p>
${out(OUT.covSauBang)}

<h3>Thresholds: a floor, not a target</h3>
<p>The <code>thresholds</code> in the config make <code>npm run test:cov</code> fail when coverage drops below a line — which is what you want in CI: a pull request that adds a feature with no tests turns the build red. We set them just under today's numbers. Raising branches to 85% shows what failure looks like:</p>
${out(OUT.nguong)}
<p>All 114 tests passed, and the command still exits with code 1 — so a CI job stops there. Do not chase 100%: the last few percent are usually the compiler's cache branches, defensive <code>?? ''</code> defaults and dev-only code, and writing tests for them produces tests that assert nothing a user cares about. Chapter 14 sets up the CI workflow; that is where <code>npm run test:cov</code> belongs (course: <a href="/courses/github-actions">GitHub Actions</a>).</p>

<h3>Mock at the network, or at the module? Measured with a mutation</h3>
${slide('rx-09', 24, 'Break goiApi so a 500 is not an error: module-mocked tests stay green, MSW tests go red')}
<p>Many codebases fake the API with <code>vi.mock</code> (or <code>jest.mock</code>): replace the whole <code>phong-kham</code> module with fake functions, and each test decides what they return. It is shorter than MSW. What does it cost? We wrote the doctor-list tests that way too:</p>
${pre('tsx', SN.viMock)}
<p>Then we broke the real fetch wrapper — the one line that turns an HTTP 500 into an error — and ran both styles:</p>
${pre('ts', SN.goiApi)}
${out(OUT.viMockDotBien)}
<p>The two MSW tests that involve a server error fail — correctly: with this bug the app would show an empty list instead of "Máy chủ đang bận". The module-mocked tests stay green, because they never run <code>goiApi</code>: the test itself creates the <code>LoiApi</code> the component receives. That is the general trade: the higher the layer you fake, the less real code your test covers. Use <code>vi.mock</code> for things you truly cannot run in a test (a payment SDK, a native module, <code>Date</code>-like globals), not for your own code.</p>
<div class="pitfall co-tieu-de"><strong>Trap — <code>vi.mock</code> silently does nothing because <code>setup.ts</code> imported the module first.</strong> Our first run of the <code>vi.mock</code> test above showed the mock was <em>never called</em>: the component used the real API. <code>setup.ts</code> imported the stores through the feature's public entry, <code>@/features/bac-si</code>, whose <code>index.ts</code> also exports <code>KhuBacSi</code> → <code>useBacSi</code> → the real <code>phong-kham</code> module. Setup files run before the test file's <code>vi.mock</code> takes effect, so the app code was already bound to the real module. The fix (kept in the project) is to import stores from their own files in <code>setup.ts</code>:</div>
${pre('ts', SN.setupImport)}

<h3>What to test, what not to test</h3>
${slide('rx-09', 25, 'Test what users see and what rules decide; skip library internals — and make every test fail once')}
${SD.cupEn}
<p>The shape above is often called the <strong>testing trophy</strong> (Kent C. Dodds): a wide middle of <strong>integration tests</strong> — a component with its real children, router and a fake network — because that is where most bugs live and where tests survive refactors; a base of static checks and unit tests for pure logic; a thin top of end-to-end tests in a real browser for the flows that must never break. This chapter's 56 new tests follow it: schema, retry policy and store as units; everything else as integration tests.</p>
${SD.nenTestEn}
<ul>
<li><strong>Test:</strong> what users see and do (the four states, forms, navigation); rules with branches (schema, filters, retry policy); contracts others rely on (a shared hook, what a form sends, which caches a mutation invalidates); bugs you fixed — a regression test for each (the compiler bug now has two).</li>
<li><strong>Do not test:</strong> implementation details (state variable names, how many times a hook ran, CSS classes); the library's own behaviour (that TanStack caches, that Zod parses); trivial markup; snapshots of large DOM trees — they break on every change and get updated without reading.</li>
</ul>
<p>And the check that matters more than the coverage number: <strong>does each test fail when the code it protects breaks?</strong> Tools can do this automatically (mutation testing, e.g. StrykerJS). By hand, we broke the code eleven times — once per important decision — and ran the tests each time:</p>
${out(OUT.dotBien)}
<p>Every break was caught by at least one test, and the failures pointed at the right place. If one of these had stayed green, that would have been the most important thing this chapter found: a test that looks like protection and is not.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202 the project is graded by a demo: the teacher clicks through the happy path, and nobody measures what was tested because nothing was. → At work, tests run on every pull request in CI with a coverage threshold, reviewers ask "where is the test for this?", and a bug fix comes with a test that failed before the fix. · <em>Why:</em> a demo proves the app worked once on one machine; a suite proves it still works after the fortieth change by someone else. A demo is still how you convince people — in interviews too: "here is the test that caught a real bug" is a strong story. You will also meet teams with no tests at all; adding the first integration test around the most painful screen is how that usually changes.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "What coverage percentage should a project have?"</p>
<p>There is no magic number. Coverage shows what was <em>not</em> run — useful to find untested areas — but not whether anything was checked: a line can be covered with no assertion. A team sets a floor it maintains (often 70–90% lines) and enforces it in CI, looks at per-file gaps in important code, and cares more that tests fail when the code breaks. Numbers also depend on the build pipeline — in our app React Compiler alone changed the branch count from 231 to 838.</p></div>

<h3>20 React interview questions, with the points a good answer makes</h3>
<p>Answer each one out loud first, in under a minute, then open it. The points are not a script: an interviewer wants to hear that you understand <em>why</em>, and the fastest proof is an example from something you built — the clinic app gives you one for almost every question.</p>
${PV_EN}

<h3>▶ Run it step by step</h3>
<ol>
<li><code>npm install -D @vitest/coverage-v8@5.0.2</code>, add the <code>coverage</code> block and the <code>test:cov</code> script, then <code>npm run test:cov</code>.</li>
<li>Open <code>coverage/index.html</code>; sort by "Branches"; open <code>TrangDatLich.tsx</code> and find the red lines.</li>
<li>Change <code>branches: 75</code> to <code>85</code>, run again, then <code>echo $?</code>. Put it back.</li>
<li>Run the module-mock experiment: <code>npx vitest run src/vi-du/ch09/bai4-vi-mock.test.tsx</code>. Then in <code>src/shared/api/http.ts</code> change <code>if (!res.ok)</code> to <code>if (false &amp;&amp; !res.ok)</code>, run it together with <code>src/features/bac-si/KhuBacSi.test.tsx</code>, compare. Undo.</li>
<li>Pick one line from the mutation table, make that change yourself, and confirm which test fails. Undo.</li>
</ol>

<h3>🛠 Keep building the project — step 4/4: coverage with a floor, and a setup that does not defeat mocks</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after step 3/4 (<code>vite.config.ts</code>, <code>package.json</code>, <code>src/test/setup.ts</code>, <code>.gitignore</code>).</p><ol>
<li><code>npm install -D @vitest/coverage-v8@5.0.2</code>.</li>
<li>In <code>vite.config.ts</code> under <code>test</code>, add the <code>coverage</code> block: provider v8, <code>include</code> all of <code>src</code>, <code>exclude</code> tests/experiments/test helpers/mocks/dev tools/<code>main.tsx</code>, reporters text + html, thresholds lines 90, functions 90, statements 85, branches 75.</li>
<li>Add <code>"test:cov": "vitest run --coverage"</code> to <code>package.json</code>, and <code>coverage</code> to <code>.gitignore</code>.</li>
<li>In <code>src/test/setup.ts</code>, import <code>useDangNhapStore</code> and <code>useDatLichStore</code> from their own files (<code>…/dang-nhap-store</code>, <code>…/dat-lich-store</code>), not from the feature entry.</li>
</ol>
<p><strong>Done when:</strong> <code>npx tsc -b</code> prints nothing; <code>npm run test:cov</code> prints the coverage table and exits 0 (25 files, 114 tests on our run); raising branches to 85 makes it exit 1 with "does not meet global threshold"; <code>npx vite build</code> still succeeds.</p></div>
<details><summary>Solution</summary>
<p>The <code>coverage</code> block, the script and the setup imports are printed above in full. Final run on 26/09/2026:</p>
${out(O4.cuoi)}
<p>The project snapshot after this chapter (for Chapter 10) contains all four steps: 11 new test files, <code>src/test/axe.ts</code>, <code>taoWrapper</code> in <code>src/test/render.tsx</code>, the setup changes, the coverage config, and the fixed <code>FormDatLich.tsx</code>.</p>
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> <code>TrangLoi.tsx</code> — the page the router shows when a route throws — is at 0%. Cover it with one meaningful test.</p><ol>
<li>In <code>src/app/TrangLoi.test.tsx</code>, create a tiny component <code>function No(): never { throw new Error('Hỏng khi vẽ'); }</code>.</li>
<li>Build <code>createMemoryRouter([{ path: '/', Component: No, ErrorBoundary: TrangLoi }])</code> and render it with <code>&lt;RouterProvider router={router} /&gt;</code> (from <code>react-router/dom</code>).</li>
<li>Silence the expected error log: <code>vi.spyOn(console, 'error').mockImplementation(() =&gt; {})</code>.</li>
<li>Assert: an <code>alert</code> with heading "Có lỗi xảy ra", the text "Hỏng khi vẽ", and a link "Về trang chủ" to <code>/</code>.</li>
<li>Run <code>npm run test:cov</code> and find <code>TrangLoi.tsx</code> in the table.</li>
</ol><p><strong>Done when:</strong> the test is green, <code>TrangLoi.tsx</code> is no longer at 0% lines, and changing <code>'Lỗi không rõ'</code> is <em>not</em> caught (that branch needs a non-Error throw — add a second test with <code>throw 'chuỗi'</code> if you want it).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">code coverage</span><span class="v">share of statements/branches/functions/lines that ran during the tests</span></div>
<div class="kv"><span class="k">branch coverage</span><span class="v">both sides of each decision tried — the most informative metric</span></div>
<div class="kv"><span class="k">threshold</span><span class="v">minimum coverage; below it the command exits 1 and CI fails</span></div>
<div class="kv"><span class="k">module mock (<code>vi.mock</code>)</span><span class="v">replaces a whole module with fakes; skips its real code</span></div>
<div class="kv"><span class="k">mutation testing</span><span class="v">break the code on purpose; a good test suite notices</span></div>
<div class="kv"><span class="k">testing trophy</span><span class="v">static → unit → mostly integration → few end-to-end</span></div>
<div class="kv"><span class="k">regression test</span><span class="v">a test that failed before a bug fix and passes after, so the bug cannot return unnoticed</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Coverage shows what ran, not what was checked; this chapter moved lines from 93.09% to 96.32% and the shared error box from 0% — but the bug it found was on an already-covered line.</li>
<li>Configure <code>include</code> so untested files show up, exclude non-product code, and read the HTML report as a map of gaps.</li>
<li>Numbers depend on the pipeline: React Compiler turned 231 branches into 838; compare like with like and expect small run-to-run variance.</li>
<li>Thresholds are a floor for CI (exit code 1), not a target; don't write tests just to hit 100%.</li>
<li>Fake at the network (MSW), not your own modules: a broken fetch wrapper kept module-mocked tests green. Import stores directly in <code>setup.ts</code> or <code>vi.mock</code> stops working.</li>
<li>Test behaviour and rules, skip implementation and library internals, and prove each test fails when its code breaks — all eleven deliberate breaks were caught.</li>
</ul>

${LINK('https://vitest.dev/guide/coverage', '📊', 'Vitest — Coverage', 'Providers, include/exclude, thresholds, reporters.')}
${LINK('https://kentcdodds.com/blog/write-tests', '🏆', 'Kent C. Dodds — Write tests. Not too many. Mostly integration.', 'The testing trophy.')}
${LINK('https://vitest.dev/guide/mocking/modules', '🎭', 'Vitest — Mocking modules', 'How vi.mock is hoisted, and its caveats.')}
${LINK_TRONG('/courses/testing', '🧪', 'Course: Testing', 'E2E with Playwright, mutation testing, testing in CI.')}
${LINK_TRONG('/courses/nextjs', '▲', 'Course: Next.js', 'Chapter 19: end-to-end tests for a full-stack app.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Độ phủ đo thật, test gì (và bỏ gì), và 20 câu hỏi phỏng vấn React</h2>
<p class="lead">Giờ bạn có 114 test xanh. Đủ chưa? Có đúng những cái cần không? "Xanh" chỉ nói rằng test bạn viết đồng ý với mã bạn viết. Bài này đưa ba dụng cụ để đánh giá một bộ test — <strong>độ phủ</strong> (test đã chạy qua đoạn mã nào?), <strong>đột biến</strong> (nếu tôi làm hỏng mã, có test nào nhận ra không?) và một danh sách ngắn <strong>những gì đáng test</strong> — đo cả ba trên app phòng khám, và kết thúc bằng những câu hỏi React hay gặp khi phỏng vấn, mỗi câu kèm các ý một câu trả lời tốt cần có và chỗ khoá này đã dạy nó.</p>
<p>Chuẩn bị: dự án sau bước 3 của chương này; bài này thêm <code>@vitest/coverage-v8</code> 5.0.2 (cùng phiên bản với Vitest — bắt buộc khớp). Mọi thứ khác như trước: Vitest 5.0.2, React 19.3.0 với React Compiler 1.0.0, MSW 2.15.0. Khoá này không dạy test đầu-cuối bằng Playwright: dự án giữa khoá (Chương 10) thêm một test Playwright cho luồng đặt lịch, còn khoá Next.js (Chương 19) và khoá Testing đi sâu.</p>

<h3>Độ phủ: test đã chạy qua những dòng nào?</h3>
${slide('rx-09', 21, 'Độ phủ trước và sau chương này: dòng 93,09% → 96,32%, hàm 86,89% → 93,1%')}
<p><strong>Độ phủ mã</strong> (code coverage) được đo trong lúc test chạy: engine V8 đếm những phần nào của mỗi file đã được thực thi. Ra bốn con số:</p>
<table>
<thead><tr><th>Chỉ số</th><th>Đếm</th><th>Đọc là</th></tr></thead>
<tbody>
<tr><td>Statements (câu lệnh)</td><td>từng câu lệnh</td><td>"bao nhiêu mã đã chạy"</td></tr>
<tr><td>Branches (nhánh)</td><td>từng phía của mỗi <code>if</code>, <code>? :</code>, <code>&amp;&amp;</code>, <code>??</code>, tham số mặc định</td><td>"bao nhiêu quyết định đã được thử cả hai phía" — chỉ số có ích nhất</td></tr>
<tr><td>Functions (hàm)</td><td>từng hàm (kể cả arrow function)</td><td>"hàm xử lý nào chưa từng được gọi"</td></tr>
<tr><td>Lines (dòng)</td><td>từng dòng có mã</td><td>như câu lệnh, tính theo dòng</td></tr>
</tbody>
</table>
<p>Cài bộ đo và cấu hình một lần trong <code>vite.config.ts</code>, để mọi lần chạy (kể cả CI) đo cùng một thứ:</p>
${pre('bash', 'npm install -D @vitest/coverage-v8@5.0.2')}
${pre('ts', SN.viteCoverage)}
${pre('json', SN.scriptCov)}
<p>Hai quyết định trong cấu hình đó. <code>include: ['src/**/*.{ts,tsx}']</code>: mặc định Vitest chỉ báo những file có test nào đó import, nên một trang không ai test sẽ <em>vắng mặt</em> khỏi báo cáo thay vì hiện 0%. (Ở dự án này khác biệt nhỏ — test định tuyến import mọi trang — bỏ <code>include</code> đi chỉ mất đúng một file, <code>types.ts</code>. Ở dự án không có những test đó, cả trang biến mất.) <code>exclude</code>: test, thí nghiệm, API giả và công cụ chỉ dùng khi dev không phải mã sản phẩm. Giờ là số đo, trước chương này (dự án Chương 12, cùng cấu hình) và sau:</p>
${out(O4.truocSau)}
<p>Theo từng file, bức tranh "trước" giải thích vì sao chương này viết đúng những test nó đã viết:</p>
${out(OUT.covTruocFile)}
<p><code>LoiTaiDuLieu</code> — hộp lỗi mà màn hình dữ liệu nào cũng dùng — ở 0%: chưa test nào từng đưa app vào trạng thái lỗi. <code>query-client.ts</code> 50% câu lệnh: chính sách thử lại chưa từng được chạy thử. <code>FormDatLich.tsx</code> 97,72% câu lệnh — và một bug. Giữ lấy điều cuối cùng đó.</p>

<h3>Độ phủ nói dối theo hai chiều</h3>
${slide('rx-09', 22, 'Cùng test, cùng mã nguồn: React Compiler biến 231 nhánh thành 838 — chỉ so số trong cùng một đường build')}
<p><strong>Độ phủ cao không có nghĩa đã được test.</strong> Độ phủ nói một dòng <em>đã chạy</em>, không nói có ai kiểm kết quả của nó. <code>FormDatLich</code> gần như phủ kín từ trước chương này: mọi dòng đều chạy trong test định tuyến có đặt một lịch hẹn. Bug lỗi-đứng-mãi nằm trên một dòng đã được phủ; thứ thiếu là một phép kiểm nhìn vào màn hình sau khi giá trị đã hợp lệ. Độ phủ không nhìn thấy phép kiểm.</p>
<p><strong>Độ phủ thấp không phải lúc nào cũng là chưa test.</strong> Độ phủ đo mã <em>đã chạy</em> — sau khi Vite, Babel và React Compiler biến đổi nó. Cùng 114 test, cùng các file nguồn, đo hai lần, có và không có compiler:</p>
${out(OUT.covSoSanh)}
<p>Compiler thêm một nhánh "cache trúng / cache trượt" quanh mỗi khúc JSX được ghi nhớ: 231 nhánh thành 838, và nhiều phía "cache trúng" không bao giờ chạy trong một test chỉ vẽ component một lần. <code>KhungXuong.tsx</code> (các khung xương) hiện 7/14 nhánh khi có compiler và 1/1 khi không — chuyện test nó chẳng thay đổi gì. Để ý thêm: hai lần chạy cùng một lệnh có thể lệch vài phần mười (80,78% và 81,02% nhánh trong các lần chạy của ta): có nhánh phụ thuộc thời điểm, ví dụ một lần tải lại nền còn đang bay hay đã xong. Luật thực tế: chỉ so số trong cùng một đường build; đặt ngưỡng trên đường build bạn thật sự phát hành (ở đây: có compiler); nhìn xu hướng và danh sách từng file, đừng nhìn chữ số thập phân thứ hai.</p>

<h3>Báo cáo HTML: đọc những dòng đỏ</h3>
${slide('rx-09', 23, 'Báo cáo HTML tô những dòng không test nào chạy — ở đây là trang "không tìm thấy khung giờ"')}
<p><code>reporter: ['text', 'html']</code> ghi ra <code>coverage/index.html</code> (thêm <code>coverage</code> vào <code>.gitignore</code>). Mở nó, bấm vào một file, dòng nào chưa test nào chạy qua sẽ được tô; dấu <code>I</code> và <code>E</code> chỉ phía <code>if</code> hay <code>else</code> chưa từng chạy. Trong <code>TrangDatLich.tsx</code>, dòng 30–33 đỏ: màn hình "Không tìm thấy khung giờ này" khi mở link tới một khung giờ không tồn tại. Có đáng test không? Bệnh nhân tới đó từ một link cũ trong tin nhắn — có, một test 10 dòng. <code>TrangLoi.tsx</code> (trang lỗi của router) ở 0% cũng vì lý do đó; đó là bài thực hành của bài này. Báo cáo là bản đồ <em>chỗ cần nhìn</em>, không phải bảng điểm.</p>
${out(OUT.covSauBang)}

<h3>Ngưỡng: một cái sàn, không phải cái đích</h3>
<p><code>thresholds</code> trong cấu hình làm <code>npm run test:cov</code> thất bại khi độ phủ tụt dưới một mức — đúng thứ bạn cần trong CI: một pull request thêm tính năng mà không có test sẽ làm build đỏ. Ta đặt ngưỡng ngay dưới con số hôm nay. Nâng nhánh lên 85% để thấy thất bại trông ra sao:</p>
${out(OUT.nguong)}
<p>Cả 114 test đều qua, mà lệnh vẫn thoát với mã 1 — nên job CI dừng ở đó. Đừng đuổi theo 100%: vài phần trăm cuối thường là nhánh cache của compiler, các giá trị mặc định phòng hờ <code>?? ''</code> và mã chỉ dùng khi dev, và viết test cho chúng sinh ra những test chẳng kiểm điều gì người dùng quan tâm. Chương 14 dựng workflow CI; đó là chỗ đặt <code>npm run test:cov</code> (khoá: <a href="/courses/github-actions">GitHub Actions</a>).</p>

<h3>Giả ở tầng mạng hay tầng module? Đo bằng một đột biến</h3>
${slide('rx-09', 24, 'Làm hỏng goiApi để 500 không còn là lỗi: test giả module vẫn xanh, test MSW đỏ')}
<p>Nhiều codebase giả API bằng <code>vi.mock</code> (hay <code>jest.mock</code>): thay cả module <code>phong-kham</code> bằng các hàm giả, mỗi test tự quyết chúng trả về gì. Ngắn hơn MSW. Cái giá là gì? Ta viết test danh sách bác sĩ theo cách đó luôn:</p>
${pre('tsx', SN.viMock)}
<p>Rồi ta làm hỏng lớp bọc fetch thật — đúng một dòng biến HTTP 500 thành lỗi — và chạy cả hai kiểu:</p>
${pre('ts', SN.goiApi)}
${out(OUT.viMockDotBien)}
<p>Hai test MSW có dính tới lỗi máy chủ đều đỏ — đúng: với bug này app sẽ hiện danh sách rỗng thay vì "Máy chủ đang bận". Các test giả module vẫn xanh, vì chúng không bao giờ chạy <code>goiApi</code>: chính test tạo ra cái <code>LoiApi</code> mà component nhận. Đó là phép đổi chác chung: giả ở tầng càng cao, test càng phủ ít mã thật. Dùng <code>vi.mock</code> cho thứ bạn thật sự không chạy được trong test (SDK thanh toán, module native, biến toàn cục kiểu <code>Date</code>), không dùng cho mã của chính mình.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — <code>vi.mock</code> âm thầm không làm gì vì <code>setup.ts</code> đã import module đó trước.</strong> Lần chạy đầu của test <code>vi.mock</code> ở trên cho thấy hàm giả <em>chưa từng được gọi</em>: component dùng API thật. <code>setup.ts</code> import các store qua cửa công khai của tính năng, <code>@/features/bac-si</code>, mà <code>index.ts</code> của nó cũng export <code>KhuBacSi</code> → <code>useBacSi</code> → module <code>phong-kham</code> thật. File setup chạy trước khi <code>vi.mock</code> của file test có hiệu lực, nên mã app đã gắn chặt vào module thật. Cách sửa (giữ lại trong dự án) là trong <code>setup.ts</code> import store từ chính file của nó:</div>
${pre('ts', SN.setupImport)}

<h3>Test gì, bỏ gì</h3>
${slide('rx-09', 25, 'Test thứ người dùng thấy và luật quyết định; bỏ ruột thư viện — và bắt mỗi test đỏ một lần')}
${SD.cupVi}
<p>Hình dáng ở trên thường gọi là <strong>testing trophy</strong> — "chiếc cúp" (Kent C. Dodds): phần giữa rộng là <strong>test tích hợp</strong> — một component cùng con thật, router và mạng giả — vì đó là chỗ phần lớn bug sống và là chỗ test sống sót qua các lần sửa cấu trúc; phần đế là kiểm tĩnh và test đơn vị cho logic thuần; phần đỉnh mỏng là test đầu-cuối trên trình duyệt thật cho những luồng không bao giờ được hỏng. 56 test mới của chương này đi theo hình đó: schema, chính sách thử lại và store là test đơn vị; còn lại là test tích hợp.</p>
${SD.nenTestVi}
<ul>
<li><strong>Nên test:</strong> thứ người dùng thấy và làm (bốn trạng thái, form, điều hướng); luật có nhiều nhánh (schema, bộ lọc, chính sách thử lại); hợp đồng mà nơi khác dựa vào (hook dùng chung, thứ form gửi đi, vùng cache mà mutation làm cũ); những bug bạn đã sửa — mỗi bug một test chống tái phát (bug compiler giờ có hai).</li>
<li><strong>Không nên test:</strong> chi tiết cài đặt (tên biến state, hook chạy mấy lần, class CSS); hành vi của chính thư viện (TanStack có cache, Zod có parse); markup vặt; snapshot của cả cây DOM lớn — gãy sau mỗi thay đổi và bị cập nhật mà không ai đọc.</li>
</ul>
<p>Và phép kiểm quan trọng hơn con số độ phủ: <strong>mỗi test có đỏ khi đoạn mã nó bảo vệ bị hỏng không?</strong> Có công cụ làm việc này tự động (mutation testing, ví dụ StrykerJS). Làm tay, ta đã làm hỏng mã mười một lần — mỗi quyết định quan trọng một lần — và chạy test mỗi lần:</p>
${out(OUT.dotBien)}
<p>Lần làm hỏng nào cũng bị ít nhất một test bắt, và chỗ đỏ chỉ đúng chỗ hỏng. Nếu có một dòng trong số đó vẫn xanh, đó sẽ là phát hiện quan trọng nhất của chương: một test trông như đang bảo vệ mà thật ra không.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202 dự án được chấm bằng một buổi demo: thầy cô bấm qua đường suôn sẻ, và chẳng ai đo cái gì đã được test vì chẳng có gì được test. → Đi làm, test chạy ở mọi pull request trong CI với một ngưỡng độ phủ, người review hỏi "test cho chỗ này đâu?", và một lần sửa bug đi kèm một test đã đỏ trước khi sửa. · <em>Vì sao:</em> demo chứng minh app chạy được một lần trên một máy; bộ test chứng minh nó vẫn chạy sau lần sửa thứ bốn mươi của người khác. Demo vẫn là cách thuyết phục người khác — cả khi phỏng vấn: "đây là cái test đã bắt được một bug thật" là một câu chuyện mạnh. Bạn cũng sẽ gặp nhóm chẳng có test nào; thêm test tích hợp đầu tiên quanh màn hình đau đầu nhất là cách chuyện đó thường thay đổi.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Dự án nên có độ phủ bao nhiêu phần trăm?"</p>
<p>Không có con số thần kỳ. Độ phủ cho thấy chỗ <em>chưa</em> chạy — có ích để tìm vùng chưa test — nhưng không cho biết có gì được kiểm: một dòng có thể được phủ mà không có phép kiểm nào. Nhóm đặt một cái sàn giữ được (thường 70–90% dòng) và ép nó trong CI, xem lỗ hổng theo từng file ở phần mã quan trọng, và quan tâm hơn tới việc test có đỏ khi mã hỏng. Con số còn phụ thuộc đường build — trong app của ta riêng React Compiler đã đổi số nhánh từ 231 thành 838.</p></div>

<h3>20 câu hỏi phỏng vấn React, kèm các ý một câu trả lời tốt cần có</h3>
<p>Tự trả lời thành tiếng trước, dưới một phút, rồi mới mở ra. Các ý không phải bài thuộc lòng: người phỏng vấn muốn nghe bạn hiểu <em>vì sao</em>, và cách chứng minh nhanh nhất là một ví dụ từ thứ bạn đã làm — app phòng khám cho bạn một ví dụ cho gần như mọi câu.</p>
${PV_VI}

<h3>▶ Chạy thử từng bước</h3>
<ol>
<li><code>npm install -D @vitest/coverage-v8@5.0.2</code>, thêm khối <code>coverage</code> và script <code>test:cov</code>, rồi <code>npm run test:cov</code>.</li>
<li>Mở <code>coverage/index.html</code>; sắp theo "Branches"; mở <code>TrangDatLich.tsx</code> và tìm các dòng đỏ.</li>
<li>Đổi <code>branches: 75</code> thành <code>85</code>, chạy lại, rồi <code>echo $?</code>. Trả lại.</li>
<li>Chạy thí nghiệm giả module: <code>npx vitest run src/vi-du/ch09/bai4-vi-mock.test.tsx</code>. Rồi trong <code>src/shared/api/http.ts</code> đổi <code>if (!res.ok)</code> thành <code>if (false &amp;&amp; !res.ok)</code>, chạy cùng <code>src/features/bac-si/KhuBacSi.test.tsx</code>, so sánh. Trả lại.</li>
<li>Chọn một dòng trong bảng đột biến, tự làm đúng thay đổi đó, xác nhận test nào đỏ. Trả lại.</li>
</ol>

<h3>🛠 Tự gõ tiếp dự án — bước 4/4: độ phủ có sàn, và một setup không vô hiệu hoá mock</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau bước 3/4 (<code>vite.config.ts</code>, <code>package.json</code>, <code>src/test/setup.ts</code>, <code>.gitignore</code>).</p><ol>
<li><code>npm install -D @vitest/coverage-v8@5.0.2</code>.</li>
<li>Trong <code>vite.config.ts</code>, dưới <code>test</code>, thêm khối <code>coverage</code>: provider v8, <code>include</code> toàn bộ <code>src</code>, <code>exclude</code> test/thí nghiệm/hàm phụ của test/API giả/công cụ dev/<code>main.tsx</code>, reporter text + html, ngưỡng dòng 90, hàm 90, câu lệnh 85, nhánh 75.</li>
<li>Thêm <code>"test:cov": "vitest run --coverage"</code> vào <code>package.json</code>, và <code>coverage</code> vào <code>.gitignore</code>.</li>
<li>Trong <code>src/test/setup.ts</code>, import <code>useDangNhapStore</code> và <code>useDatLichStore</code> từ chính file của chúng (<code>…/dang-nhap-store</code>, <code>…/dat-lich-store</code>), không qua cửa của tính năng.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>npx tsc -b</code> không in gì; <code>npm run test:cov</code> in bảng độ phủ và thoát với mã 0 (25 file, 114 test ở lần chạy của ta); nâng nhánh lên 85 thì thoát mã 1 với "does not meet global threshold"; <code>npx vite build</code> vẫn thành công.</p></div>
<details><summary>Lời giải</summary>
<p>Khối <code>coverage</code>, script và các import trong setup đã in đầy đủ ở trên. Lần chạy cuối ngày 26/09/2026:</p>
${out(O4.cuoi)}
<p>Ảnh chụp dự án sau chương này (cho Chương 10) có đủ bốn bước: 11 file test mới, <code>src/test/axe.ts</code>, <code>taoWrapper</code> trong <code>src/test/render.tsx</code>, các thay đổi ở setup, cấu hình độ phủ, và <code>FormDatLich.tsx</code> đã sửa.</p>
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề:</strong> <code>TrangLoi.tsx</code> — trang router hiện khi một route ném lỗi — đang 0%. Phủ nó bằng một test có ý nghĩa.</p><ol>
<li>Trong <code>src/app/TrangLoi.test.tsx</code>, tạo một component tí hon <code>function No(): never { throw new Error('Hỏng khi vẽ'); }</code>.</li>
<li>Dựng <code>createMemoryRouter([{ path: '/', Component: No, ErrorBoundary: TrangLoi }])</code> rồi vẽ bằng <code>&lt;RouterProvider router={router} /&gt;</code> (từ <code>react-router/dom</code>).</li>
<li>Tắt log lỗi đã biết trước: <code>vi.spyOn(console, 'error').mockImplementation(() =&gt; {})</code>.</li>
<li>Kiểm: một <code>alert</code> có tiêu đề "Có lỗi xảy ra", chữ "Hỏng khi vẽ", và link "Về trang chủ" trỏ tới <code>/</code>.</li>
<li>Chạy <code>npm run test:cov</code> và tìm <code>TrangLoi.tsx</code> trong bảng.</li>
</ol><p><strong>Đạt khi:</strong> test xanh, <code>TrangLoi.tsx</code> không còn 0% dòng, và đổi <code>'Lỗi không rõ'</code> thì <em>không</em> bị bắt (nhánh đó cần ném thứ không phải Error — thêm test thứ hai với <code>throw 'chuỗi'</code> nếu muốn).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">code coverage — độ phủ mã</span><span class="v">tỉ lệ câu lệnh/nhánh/hàm/dòng đã chạy trong lúc test</span></div>
<div class="kv"><span class="k">branch coverage — độ phủ nhánh</span><span class="v">mỗi quyết định đã thử cả hai phía — chỉ số nói nhiều nhất</span></div>
<div class="kv"><span class="k">threshold — ngưỡng</span><span class="v">độ phủ tối thiểu; dưới mức đó lệnh thoát mã 1 và CI đỏ</span></div>
<div class="kv"><span class="k">module mock (<code>vi.mock</code>)</span><span class="v">thay cả module bằng hàm giả; bỏ qua mã thật của nó</span></div>
<div class="kv"><span class="k">mutation testing — test đột biến</span><span class="v">cố ý làm hỏng mã; bộ test tốt phải nhận ra</span></div>
<div class="kv"><span class="k">testing trophy — "chiếc cúp"</span><span class="v">tĩnh → đơn vị → phần lớn là tích hợp → ít đầu-cuối</span></div>
<div class="kv"><span class="k">regression test — test chống tái phát</span><span class="v">test đỏ trước khi sửa bug và xanh sau khi sửa, để bug không quay lại mà không ai hay</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Độ phủ cho thấy thứ đã chạy, không phải thứ đã được kiểm; chương này đưa độ phủ dòng từ 93,09% lên 96,32% và hộp lỗi dùng chung từ 0% — nhưng bug nó tìm ra lại nằm trên một dòng đã được phủ.</li>
<li>Đặt <code>include</code> để file chưa test lộ ra, loại mã không phải sản phẩm, và đọc báo cáo HTML như bản đồ lỗ hổng.</li>
<li>Con số phụ thuộc đường build: React Compiler biến 231 nhánh thành 838; chỉ so cùng loại, và chấp nhận lệch nhỏ giữa các lần chạy.</li>
<li>Ngưỡng là cái sàn cho CI (mã thoát 1), không phải cái đích; đừng viết test chỉ để chạm 100%.</li>
<li>Giả ở tầng mạng (MSW), không giả module của chính mình: lớp bọc fetch hỏng mà test giả module vẫn xanh. Import store trực tiếp trong <code>setup.ts</code>, không thì <code>vi.mock</code> mất tác dụng.</li>
<li>Test hành vi và luật, bỏ chi tiết cài đặt và ruột thư viện, và chứng minh mỗi test đỏ khi mã của nó hỏng — cả mười một lần cố ý làm hỏng đều bị bắt.</li>
</ul>

${LINK('https://vitest.dev/guide/coverage', '📊', 'Vitest — Coverage', 'Provider, include/exclude, ngưỡng, reporter.')}
${LINK('https://kentcdodds.com/blog/write-tests', '🏆', 'Kent C. Dodds — Write tests. Not too many. Mostly integration.', '"Chiếc cúp" testing trophy.')}
${LINK('https://vitest.dev/guide/mocking/modules', '🎭', 'Vitest — Giả module', 'vi.mock được kéo lên đầu thế nào, và các lưu ý.')}
${LINK_TRONG('/courses/testing', '🧪', 'Khoá: Testing', 'E2E bằng Playwright, test đột biến, test trong CI.')}
${LINK_TRONG('/courses/nextjs', '▲', 'Khoá: Next.js', 'Chương 19: test đầu-cuối cho app full-stack.')}
</div>
`,
};

const Q = {
    title: '9.5 — Chapter 9 quiz|||9.5 — Kiểm tra Chương 9',
    slug: 'rx-9-5-kiem-tra',
    type: 'QUIZ',
    isFreePreview: true,
    description: 'Mười câu tình huống về truy vấn Testing Library, user-event, findBy và MSW, client test, cờ act, đồng hồ giả, renderHook, bug React Compiler với form và giả ở tầng mạng — mỗi câu có giải thích.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Chapter 9 quiz</h2>
<p class="lead">Ten situations taken from this chapter's tests and measurements. Most questions show a few lines of a test and ask what Vitest prints. 15 minutes.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can find any element of the clinic app by role or label, and I know when to use <code>queryBy</code> and <code>findBy</code>.</li>
<li>I can write a form test with user-event that checks what is sent, the errors, and the double-submit guard.</li>
<li>I can test the loading, empty, error and "stale" states of a data screen with MSW overrides.</li>
<li>I can explain why the test <code>QueryClient</code> has <code>retry: false</code> and why this project needed <code>IS_REACT_ACT_ENVIRONMENT</code>.</li>
<li>I can test a shared hook with <code>renderHook</code> and a wrapper, including a mutation hook.</li>
<li>I can read a coverage report, set a threshold, and prove a test fails when its code breaks.</li>
</ul>
${slide('rx-09', 27, 'Chapter 9 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Kiểm tra Chương 9</h2>
<p class="lead">Mười tình huống lấy từ các test và phép đo của chương. Phần lớn câu hỏi đưa vài dòng test và hỏi Vitest sẽ in ra gì. 15 phút.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi tìm được mọi phần tử của app phòng khám theo vai trò hoặc nhãn, và biết khi nào dùng <code>queryBy</code>, khi nào <code>findBy</code>.</li>
<li>Tôi viết được test form bằng user-event kiểm thứ được gửi đi, các lỗi, và chốt chặn gửi hai lần.</li>
<li>Tôi test được trạng thái đang tải, rỗng, lỗi và "bản cũ" của một màn hình dữ liệu bằng cách ghi đè MSW.</li>
<li>Tôi giải thích được vì sao <code>QueryClient</code> của test có <code>retry: false</code> và vì sao dự án này cần <code>IS_REACT_ACT_ENVIRONMENT</code>.</li>
<li>Tôi test được một hook dùng chung bằng <code>renderHook</code> và wrapper, kể cả hook mutation.</li>
<li>Tôi đọc được báo cáo độ phủ, đặt được ngưỡng, và chứng minh được một test đỏ khi mã của nó hỏng.</li>
</ul>
${slide('rx-09', 27, 'Bảng tra nhanh Chương 9')}
</div>
`,
    quiz: {
      timeLimitSeconds: 900,
      questions: [
        {
          question: "The junior doctor's card has no 'Bác sĩ lâu năm' label. A test says: expect(screen.getByText('Bác sĩ lâu năm')).not.toBeInTheDocument(). What happens?|||Thẻ của bác sĩ trẻ không có nhãn 'Bác sĩ lâu năm'. Một test viết: expect(screen.getByText('Bác sĩ lâu năm')).not.toBeInTheDocument(). Chuyện gì xảy ra?",
          options: [
            'It passes: the label is not there, which is what the test says|||Qua: nhãn không có, đúng như test nói',
            'It fails: getByText throws "Unable to find an element" before expect runs|||Đỏ: getByText ném "Unable to find an element" trước khi expect kịp chạy',
            'It fails: not.toBeInTheDocument cannot be used with text|||Đỏ: not.toBeInTheDocument không dùng được với chữ',
            'It waits 1000 ms, then passes|||Đợi 1000 ms rồi qua',
          ],
          correctIndex: 1,
          points: 1,
          explanation: "EN: getBy throws the moment nothing matches — the assertion never runs (Lesson 9.1, real output: 'Unable to find an element with the text: Bác sĩ lâu năm'). The tempting answer 'it passes' is what queryByText would do: it returns null, and expect(null).not.toBeInTheDocument() passes. Nothing waits here; only findBy waits.|||VI: getBy ném lỗi ngay khi không khớp gì — phép kiểm không bao giờ chạy (Bài 9.1, output thật: 'Unable to find an element with the text: Bác sĩ lâu năm'). Phương án hấp dẫn 'qua' là việc của queryByText: nó trả null, và expect(null).not.toBeInTheDocument() qua. Ở đây không có gì đợi cả; chỉ findBy mới đợi.",
        },
        {
          question: 'Which query should a test use to find the phone field of the booking form?|||Test nên dùng truy vấn nào để tìm ô số điện thoại của form đặt lịch?',
          options: [
            "container.querySelector('#soDienThoai')|||container.querySelector('#soDienThoai')",
            "screen.getByTestId('sdt')|||screen.getByTestId('sdt')",
            "screen.getByLabelText('Số điện thoại')|||screen.getByLabelText('Số điện thoại')",
            "screen.getByPlaceholderText('Số điện thoại')|||screen.getByPlaceholderText('Số điện thoại')",
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: A form field is found by its label — that is how users (and screen readers) identify it, so the test doubles as an accessibility check. querySelector by id works but ties the test to an implementation detail and would pass even if the label were missing. The placeholder query is tempting, but the field has no placeholder here, and a placeholder is not a label.|||VI: Ô nhập được tìm theo nhãn — đó là cách người dùng (và trình đọc màn hình) nhận ra nó, nên test kiêm luôn kiểm tiếp cận. querySelector theo id cũng chạy nhưng buộc test vào chi tiết cài đặt và vẫn qua dù thiếu nhãn. Truy vấn theo placeholder hấp dẫn, nhưng ô này không có placeholder, và placeholder không phải là nhãn.",
        },
        {
          question: "const user = userEvent.setup(); render(<TheBacSi bacSi={bsHa} onDoiYeuThich={onDoi} />); void user.click(nut); expect(onDoi).toHaveBeenCalledTimes(1). What does Vitest print?|||const user = userEvent.setup(); render(<TheBacSi bacSi={bsHa} onDoiYeuThich={onDoi} />); void user.click(nut); expect(onDoi).toHaveBeenCalledTimes(1). Vitest in ra gì?",
          options: [
            'expected "vi.fn()" to be called 1 times, but got 0 times|||expected "vi.fn()" to be called 1 times, but got 0 times',
            'A TypeScript error: a Promise must be awaited|||Lỗi TypeScript: Promise phải được await',
            'The test passes: user-event clicks synchronously|||Test qua: user-event bấm đồng bộ',
            'A warning "not wrapped in act(...)" and the test passes|||Một cảnh báo "not wrapped in act(...)" và test qua',
          ],
          correctIndex: 0,
          points: 1,
          explanation: "EN: user.click returns a Promise; without await, expect runs before the click happens — measured in Lesson 9.1 with exactly this message. TypeScript does not complain (and void even tells the linter the Promise is ignored on purpose). user-event is asynchronous by design, so 'it clicks synchronously' is false.|||VI: user.click trả về Promise; thiếu await thì expect chạy trước khi cú bấm xảy ra — đo ở Bài 9.1 với đúng thông báo này. TypeScript không kêu (còn void báo cho linter rằng Promise bị bỏ qua có chủ ý). user-event được thiết kế bất đồng bộ, nên 'bấm đồng bộ' là sai.",
        },
        {
          question: "renderVoiRouter(<KhuBacSi />, '/bac-si'); expect(screen.getAllByRole('article')).toHaveLength(6); fails with 'Unable to find an accessible element with the role \"article\"'. The best fix?|||renderVoiRouter(<KhuBacSi />, '/bac-si'); expect(screen.getAllByRole('article')).toHaveLength(6); đỏ với 'Unable to find an accessible element with the role \"article\"'. Cách sửa tốt nhất?",
          options: [
            'Wrap the render in act(() => …)|||Bọc render trong act(() => …)',
            "Raise Vitest's testTimeout to 10 s|||Nâng testTimeout của Vitest lên 10 giây",
            'Remove the skeleton from KhuBacSi in tests|||Bỏ khung xương khỏi KhuBacSi khi test',
            "expect(await screen.findAllByRole('article')).toHaveLength(6)|||expect(await screen.findAllByRole('article')).toHaveLength(6)",
          ],
          correctIndex: 3,
          points: 1,
          explanation: "EN: At the moment render returns, only the skeleton exists — the list arrives from MSW a few ms later. findAllBy re-checks whenever the DOM changes and every 50 ms, for up to 1000 ms. act() only flushes work React already has; it does not wait for a network response, so the tempting 'wrap in act' still fails. The test timeout is irrelevant: getAllBy fails instantly.|||VI: Đúng lúc render trả về chỉ mới có khung xương — danh sách từ MSW về sau vài ms. findAllBy kiểm lại mỗi khi DOM đổi và mỗi 50 ms, tối đa 1000 ms. act() chỉ xả việc React đang có; nó không đợi câu trả lời từ mạng, nên 'bọc trong act' vẫn đỏ. Thời hạn của test chẳng liên quan: getAllBy hỏng ngay tức khắc.",
        },
        {
          question: "Why does the test helper create a new QueryClient with retry: false for every test?|||Vì sao hàm phụ của test tạo một QueryClient mới với retry: false cho mỗi test?",
          options: [
            'Because TanStack Query does not work in jsdom with retries|||Vì TanStack Query không chạy được trong jsdom khi có thử lại',
            "Because with the app's client an error box appeared only after ~7 s (retries), and a shared client carries cached data between tests|||Vì với client của app, hộp lỗi chỉ hiện sau ~7 giây (thử lại), và client dùng chung mang dữ liệu cache từ test này sang test khác",
            'Because retry: false makes the tests pass even when the API fails|||Vì retry: false làm test qua cả khi API hỏng',
            'Because MSW cannot answer the same request twice|||Vì MSW không trả lời cùng một request hai lần được',
          ],
          correctIndex: 1,
          points: 1,
          explanation: "EN: Measured in Lesson 9.2: the app's client (3 retries, 1 s + 2 s + 4 s back-off) showed the error after 7056 ms, the test client after 10 ms; and a client shared between two tests made the second one see a cached empty list. retry: false does not hide failures — the error state is shown at once, which is what the tests assert. MSW answers as many times as asked.|||VI: Đo ở Bài 9.2: client của app (thử lại 3 lần, đợi 1 + 2 + 4 giây) hiện lỗi sau 7056 ms, client của test sau 10 ms; và một client dùng chung giữa hai test làm test thứ hai thấy danh sách rỗng trong cache. retry: false không che lỗi — trạng thái lỗi hiện ngay, đúng thứ test kiểm. MSW trả lời bao nhiêu lần cũng được.",
        },
        {
          question: "In this project (Vitest with globals: false), a test changes a Zustand store directly while a component that reads it is on screen. Before Chapter 9, how many act warnings did React print?|||Trong dự án này (Vitest với globals: false), một test sửa thẳng store Zustand trong lúc component đọc store đó đang hiện. Trước Chương 9, React in ra bao nhiêu cảnh báo act?",
          options: [
            'One — React always warns about updates outside act|||Một — React luôn cảnh báo cập nhật ngoài act',
            'One per re-rendered component|||Mỗi component vẽ lại một cảnh báo',
            'Zero — Testing Library only sets IS_REACT_ACT_ENVIRONMENT when it finds a global beforeAll, and with globals: false there is none|||Không cái nào — Testing Library chỉ bật IS_REACT_ACT_ENVIRONMENT khi thấy beforeAll toàn cục, mà globals: false thì không có',
            'Zero — Zustand updates are always inside act|||Không cái nào — cập nhật của Zustand luôn nằm trong act',
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: React warns only when the global IS_REACT_ACT_ENVIRONMENT is true. Testing Library sets it in a beforeAll it registers only if beforeAll exists globally (Jest, or Vitest with globals: true). Measured: 0 warnings without the flag, 1 after setup.ts set it. The tempting 'React always warns' is true only with the flag. Zustand does nothing special with act.|||VI: React chỉ cảnh báo khi biến toàn cục IS_REACT_ACT_ENVIRONMENT là true. Testing Library bật nó trong một beforeAll mà nó chỉ đăng ký khi có beforeAll toàn cục (Jest, hoặc Vitest với globals: true). Đo: 0 cảnh báo khi không có cờ, 1 sau khi setup.ts bật cờ. Phương án hấp dẫn 'React luôn cảnh báo' chỉ đúng khi có cờ. Zustand không làm gì đặc biệt với act.",
        },
        {
          question: "vi.useFakeTimers(); const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime }); … await user.click(nutDong). The test hangs until 'Test timed out in 5000ms'. What fixes it?|||vi.useFakeTimers(); const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime }); … await user.click(nutDong). Test treo tới 'Test timed out in 5000ms'. Cách nào sửa được?",
          options: [
            'vi.useFakeTimers({ shouldAdvanceTime: true }) — or use fireEvent while timers are fake|||vi.useFakeTimers({ shouldAdvanceTime: true }) — hoặc dùng fireEvent trong lúc đồng hồ đang giả',
            'Remove advanceTimers from setup|||Bỏ advanceTimers khỏi setup',
            'Call vi.advanceTimersByTime(5000) before the click|||Gọi vi.advanceTimersByTime(5000) trước cú bấm',
            'Increase the test timeout to 10000 ms|||Nâng thời hạn test lên 10000 ms',
          ],
          correctIndex: 0,
          points: 1,
          explanation: "EN: After every user-event action, Testing Library's asyncWrapper waits for a setTimeout(0) and only knows how to advance Jest's fake timers; with Vitest's fake timers that timeout never fires. shouldAdvanceTime lets the fake clock move with real time, so it fires (measured green); fireEvent does not go through that wrapper. Advancing 5000 ms before the click does not help — the wait happens after the click starts.|||VI: Sau mỗi thao tác user-event, asyncWrapper của Testing Library đợi một setTimeout(0) và chỉ biết tua đồng hồ giả của Jest; với đồng hồ giả của Vitest, hẹn giờ đó không bao giờ chạy. shouldAdvanceTime cho đồng hồ giả nhích theo giờ thật nên nó chạy (đo thấy xanh); fireEvent không đi qua lớp bọc đó. Tua 5000 ms trước cú bấm không giúp gì — chỗ đợi nằm sau khi cú bấm bắt đầu.",
        },
        {
          question: "const { result } = renderHook(() => useKhungGio('bs-2', '2026-10-01'), taoWrapper()); const { isSuccess } = result.current; await waitFor(() => expect(isSuccess).toBe(true)); What happens?|||const { result } = renderHook(() => useKhungGio('bs-2', '2026-10-01'), taoWrapper()); const { isSuccess } = result.current; await waitFor(() => expect(isSuccess).toBe(true)); Chuyện gì xảy ra?",
          options: [
            'It passes after about 5 ms|||Qua sau khoảng 5 ms',
            'It fails at once: renderHook cannot run TanStack hooks|||Đỏ ngay: renderHook không chạy được hook TanStack',
            'It fails because the wrapper has no router|||Đỏ vì wrapper không có router',
            'It times out: isSuccess is a copy from the first render and stays false|||Hết giờ: isSuccess là bản chép từ lần render đầu và mãi là false',
          ],
          correctIndex: 3,
          points: 1,
          explanation: "EN: result.current is replaced after each render; destructuring it early keeps the first render's values forever (Lesson 9.3, measured: 'expected false to be true' after the waitFor timeout). Read result.current.isSuccess inside the assertion. taoWrapper provides both a QueryClientProvider and a MemoryRouter, so the hook itself runs fine.|||VI: result.current được thay sau mỗi lần render; tách nó ra sớm là giữ mãi giá trị của lần render đầu (Bài 9.3, đo: 'expected false to be true' sau khi waitFor hết giờ). Đọc result.current.isSuccess ngay trong phép kiểm. taoWrapper cấp cả QueryClientProvider lẫn MemoryRouter, nên bản thân hook chạy bình thường.",
        },
        {
          question: "With React Compiler on, the booking form kept showing 'Họ tên cần ít nhất 2 ký tự' after the name became valid. Why?|||Khi bật React Compiler, form đặt lịch vẫn hiện 'Họ tên cần ít nhất 2 ký tự' sau khi họ tên đã hợp lệ. Vì sao?",
          options: [
            'Zod validates asynchronously and the test did not wait|||Zod kiểm bất đồng bộ và test không đợi',
            'The compiler skipped FormDatLich, so it was never memoized|||Compiler bỏ qua FormDatLich nên nó không được ghi nhớ',
            'React Hook Form changes the errors object in place, and the compiled JSX compared it by identity, so it reused the old error paragraph|||React Hook Form sửa object errors tại chỗ, còn JSX đã biên dịch so nó bằng danh tính, nên dùng lại đoạn báo lỗi cũ',
            'mode: onTouched never re-validates after the first blur|||mode: onTouched không bao giờ kiểm lại sau lần rời ô đầu',
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: Logging errors.benhNhan on every render showed the same object with keys added and removed; the compiled code rebuilt the paragraph only if ($[16] !== e). Without the compiler the same test passed, and reading the error strings first fixed it with the compiler on. 'Zod is async' is tempting, but user-event already waits a tick — and the error never disappeared, even in Chromium after a second.|||VI: Ghi errors.benhNhan ở mỗi lần render cho thấy vẫn một object, chỉ bị thêm và xoá khoá; mã đã biên dịch chỉ dựng lại đoạn báo lỗi khi ($[16] !== e). Bỏ compiler thì đúng test đó qua, và rút chuỗi lỗi ra trước là sửa được khi vẫn bật compiler. 'Zod bất đồng bộ' nghe hợp lý, nhưng user-event đã đợi một nhịp — và lỗi không bao giờ biến mất, kể cả trên Chromium sau một giây.",
        },
        {
          question: "goiApi is broken so that an HTTP 500 is no longer thrown as an error. Which tests notice?|||goiApi bị làm hỏng: HTTP 500 không còn bị ném thành lỗi nữa. Những test nào nhận ra?",
          options: [
            'The MSW-based KhuBacSi tests that involve a 500 — the tests that vi.mock the phong-kham module stay green|||Các test KhuBacSi dùng MSW có dính lỗi 500 — còn các test vi.mock module phong-kham vẫn xanh',
            'Both kinds, because both render KhuBacSi|||Cả hai kiểu, vì cả hai đều vẽ KhuBacSi',
            'Only the vi.mock tests, because they control the error directly|||Chỉ các test vi.mock, vì chúng điều khiển lỗi trực tiếp',
            'None: coverage stays the same, so nothing changed|||Không test nào: độ phủ giữ nguyên nên không có gì thay đổi',
          ],
          correctIndex: 0,
          points: 1,
          explanation: "EN: Measured in Lesson 9.4: 2 MSW tests failed (500 + retry, stale after refresh), both vi.mock tests passed — with vi.mock the test itself creates the LoiApi, so goiApi never runs. Rendering the same component is not enough; what matters is which real code sits between the component and the fake. Coverage says nothing about whether assertions would catch a change.|||VI: Đo ở Bài 9.4: 2 test MSW đỏ (500 + thử lại, bản cũ sau khi làm mới), cả 2 test vi.mock xanh — với vi.mock chính test tạo ra LoiApi, nên goiApi không bao giờ chạy. Cùng vẽ một component là chưa đủ; điều quan trọng là mã thật nào nằm giữa component và thứ giả. Độ phủ không nói gì về việc phép kiểm có bắt được thay đổi hay không.",
        },
      ],
    },
};

export default {
  title: 'Chapter 9 — Testing React|||Chương 9 — Test React',
  description: 'Test giao diện như người dùng dùng nó: Testing Library, user-event, jest-dom, MSW cho API, renderHook cho hook tự viết, độ phủ đo thật — trên chính app đặt lịch, kèm một bug thật do React Compiler mà test bắt được.',
  lessons: [L0, L1, L2, L3, L4, Q],
};
