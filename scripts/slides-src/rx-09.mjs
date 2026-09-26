/**
 * React · Deck rx-09 — Chương 9: Test React.
 *
 * MỌI số liệu/output trên slide là THẬT, chạy 26/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch09
 * (chép từ ảnh chụp sau-ch12 rồi làm bốn bước của chương) — react 19.3.0 · vitest 5.0.2 · @vitest/coverage-v8 5.0.2 ·
 * jsdom 29.1.1 · @testing-library/react 16.3.3 · @testing-library/dom 10.4.2 · @testing-library/user-event 14.6.7 ·
 * @testing-library/jest-dom 7.0.1 · msw 2.15.0 · axe-core 4.13.0 · react-hook-form 7.88.0 · zod 4.6.5 ·
 * @tanstack/react-query 5.103.3 · react-router 8.4.0 · babel-plugin-react-compiler 1.0.0.
 *   do/ch09-ra-het.sh (mọi output) · do/ch09-dot-bien.mjs (11 đột biến) · do/ch09-kiem-form.mjs (Chromium, ảnh form)
 *   do/ch09-chup-cov.mjs (ảnh báo cáo coverage HTML) · src/vi-du/ch09/*.sai.tsx (-c vitest.sai.config.ts)
 * Ảnh chụp: scripts/slides-src/rx-anh/rx-09/*.jpg.
 */
import {
  S, cover, cards, box, table, two, list, mindmap, term as rxTerm, yaml, sv, R, T, A, anh, bars, steps, kpis, flow, vs,
} from './_rx-chung.mjs';

export const deck = { key: 'rx-09', code: 'REACT · CHƯƠNG 9', title: 'Test React', sub: 'React · Chương 9' };

const t = (lines, title, fs = 14) => rxTerm(lines, { title, dir: '~/phong-kham', fs });

/* ───────── Slide 9 — dòng thời gian: render → dữ liệu về → findBy thấy ───────── */
const dongThoiGian = () => {
  let s = '';
  const x0 = 70, k = 9; // px / ms
  s += `<path d="M${x0} 80 L1060 80" stroke="#6b7a93" stroke-width="2"/>`;
  for (const [ms, nhan] of [[0, '0'], [5, '5'], [50, '50'], [100, '100 ms']]) {
    s += `<path d="M${x0 + ms * k} 72 L${x0 + ms * k} 88" stroke="#6b7a93" stroke-width="2"/>` + T(x0 + ms * k, 108, nhan, { fs: 14, c: 'mu', a: 'middle' });
  }
  s += R(x0 + 5 * k - 20, 10, 330, 40, { c: 'amb', r: 10 }) + T(x0 + 5 * k + 145, 36, 'MSW trả 6 bác sĩ ⇒ DOM đổi', { fs: 15, a: 'middle' });
  s += A(x0 + 5 * k, 50, x0 + 5 * k, 74, { c: 'amb' });
  s += R(x0 - 50, 130, 260, 60, { c: 'red', r: 10 }) + T(x0 + 80, 156, 'getAllBy lúc 0 ms', { fs: 15, b: true, a: 'middle' }) + T(x0 + 80, 178, '✗ chỉ có khung xương', { fs: 14, c: 'red', a: 'middle' });
  s += R(330, 130, 470, 60, { c: 'grn', r: 10 }) + T(565, 156, 'findAllBy: kiểm lại mỗi khi DOM đổi + mỗi 50 ms', { fs: 15, b: true, a: 'middle' }) + T(565, 178, '✓ thấy 6 thẻ ngay sau khi dữ liệu về', { fs: 14, c: 'grn', a: 'middle' });
  s += A(340, 132, x0 + 7 * k, 92, { c: 'grn' });
  s += T(1060, 160, 'hết 1000 ms ⇒ đỏ', { fs: 14, c: 'mu', a: 'end' });
  return sv(1100, 200, s);
};

/* ───────── Slide 16 — renderHook: component vô hình ───────── */
const renderHookHinh = () => {
  let s = '';
  s += R(10, 20, 330, 70, { c: 'rx' }) + T(175, 50, 'renderHook(() => useKhungGio(…),', { fs: 15, a: 'middle', mono: true }) + T(175, 74, '{ wrapper })', { fs: 15, a: 'middle', mono: true });
  s += R(390, 10, 330, 180, { c: 'vio', dash: true }) + T(555, 36, 'wrapper: QueryClient + MemoryRouter', { fs: 14.5, c: 'vio', a: 'middle' });
  s += R(420, 60, 270, 70, { c: 'tea' }) + T(555, 90, 'component vô hình', { fs: 16, b: true, a: 'middle' }) + T(555, 114, 'gọi hook mỗi lần render', { fs: 14, c: 'mu', a: 'middle' });
  s += R(770, 20, 320, 70, { c: 'grn' }) + T(930, 50, 'result.current', { fs: 17, b: true, a: 'middle', mono: true }) + T(930, 74, '= giá trị lần render MỚI NHẤT', { fs: 14, c: 'mu', a: 'middle' });
  s += R(770, 120, 150, 50, { c: 'amb' }) + T(845, 151, 'rerender(p)', { fs: 15, a: 'middle', mono: true });
  s += R(940, 120, 150, 50, { c: 'red' }) + T(1015, 151, 'unmount()', { fs: 15, a: 'middle', mono: true });
  s += A(340, 55, 416, 90, { c: 'rx' }) + A(690, 90, 766, 58, { c: 'grn' }) + A(770, 145, 694, 115, { c: 'amb' }) + A(1015, 172, 1015, 190, { c: 'red' });
  s += T(1015, 208, 'chạy cleanup', { fs: 13.5, c: 'mu', a: 'middle' });
  return sv(1100, 215, s);
};

/* ───────── Slide 10 — đường đi của một request trong test ───────── */
const tangMang = () => flow([
  { e: '🧩', t: 'KhuBacSi', d: 'useBacSi()', c: 'blu' },
  { e: '🗃', t: 'TanStack', d: 'cache · retry', c: 'blu' },
  { e: '📦', t: 'api + goiApi', d: 'ném LoiApi khi !ok', c: 'blu' },
  { e: '🌐', t: 'fetch thật', d: 'của Node', c: 'blu' },
  { e: '🎭', t: 'MSW handler', d: 'trả JSON / 500 / lỗi mạng', c: 'grn' },
]);

export const slides = S([
  /* 1 */ cover({ t: 'Chương 9 — Test React', sub: 'Vitest · Testing Library · user-event · jest-dom · MSW · renderHook · độ phủ · câu hỏi phỏng vấn', chap: 'CHƯƠNG 9' }),

  /* 2 */ { t: 'Bản đồ chương: test app như người dùng dùng nó', body: mindmap('Test như người dùng', 'Vitest 5 · Testing Library · MSW', [
    { t: '9.1 Testing Library', d: 'vai trò · user-event · jest-dom · bug compiler', c: 'rx' },
    { t: '9.2 Bất đồng bộ', d: 'findBy · MSW · 4 trạng thái · act', c: 'vio' },
    { t: '9.3 Hook tự viết', d: 'renderHook · wrapper · TanStack · store', c: 'grn' },
    { t: '9.4 Độ phủ + phỏng vấn', d: 'coverage · đột biến · 20 câu', c: 'amb' },
    { t: '🛠 Dự án', d: '56 test mới · 1 bug thật đã sửa', c: 'tea' },
  ]) },

  /* ───── 9.1 ───── */
  /* 3 */ { t: 'Hỏi DOM theo vai trò và nhãn, không hỏi class', body: two(
    table(['Truy vấn', 'Dùng cho'], [
      ['+<code>getByRole</code>', 'nút, link, tiêu đề, radio, alert, region'],
      ['+<code>getByLabelText</code>', 'ô nhập của form'],
      ['<code>getByText</code>', 'chữ không bấm được'],
      ['<code>getByDisplayValue</code> …', 'hiếm khi'],
      ['!<code>getByTestId</code>', 'đường cuối cùng'],
    ]),
    `${yaml([
      ["screen.getByRole('button', {", ''],
      ["  name: 'Yêu thích BS. Trần Thu Hà',", 'tên truy cập'],
      ['  pressed: false })', 'trạng thái ARIA'],
      ["screen.getByRole('heading', { level: 2 })", ''],
      ["screen.getByLabelText('Số điện thoại')", '<label> của ô'],
    ], { fs: 14 })}
     ${box('good', 'Test hỏi theo vai trò = <strong>kiểm tiếp cận miễn phí</strong>: trình đọc màn hình không tìm được thì test cũng không tìm được.')}`) },

  /* 4 */ { t: 'getBy ném lỗi, queryBy trả null, findBy đợi', body: `${table(['', 'không thấy', 'thấy 1', 'nhiều hơn 1', 'đợi?', 'dùng khi'], [
      ['<code>getBy…</code>', '-ném lỗi', 'trả về', '-ném lỗi', 'không', 'phải có ngay'],
      ['<code>queryBy…</code>', '+<code>null</code>', 'trả về', '-ném lỗi', 'không', 'kiểm “KHÔNG có”'],
      ['<code>findBy…</code>', 'từ chối sau 1000 ms', 'Promise', '-từ chối', '+hỏi lại (DOM đổi · 50 ms)', 'sẽ xuất hiện'],
    ])}
    ${two(
      yaml([["expect(screen.getByText('Bác sĩ lâu năm'))", '✗ getBy ném trước'], ['  .not.toBeInTheDocument();', ''], ["expect(screen.queryByText('Bác sĩ lâu năm'))", '✓ đúng'], ['  .not.toBeInTheDocument();', '']], { fs: 14 }),
      t(['! TestingLibraryElementError: Unable to find', '!   an element with the text: Bác sĩ lâu năm.', '  This could be because the text is broken up', '  by multiple elements…'], 'vitest · src/vi-du/ch09/bai1.sai.tsx', 13))}` },

  /* 5 */ { t: 'Truy vấn hỏng in ra mọi vai trò đang có — đọc nó', body: two(
    t(['! Unable to find an accessible element with the', '!   role "button" and name "Yêu thích BS. Trần Thu Hoa"', '', '  Here are the accessible roles:', '    article:', '    Name "BS. Trần Thu Hà":', '    heading: …', '    button:', '+   Name "Yêu thích BS. Trần Thu Hà":', '      <button aria-pressed="false" …/>'], 'vitest · SAI 1', 13),
    `${list(['“Hà”, không phải “Hoa” — chép đúng chuỗi từ danh sách', '<code>screen.debug()</code> in DOM hiện tại', '<code>logRoles(container)</code> in danh sách vai trò mà không cần hỏng', '<code>within(the).getBy…</code> khi có nhiều phần tử giống nhau'])}
     ${box('tip', 'Người mới hay cuộn qua output dài. Câu trả lời gần như luôn nằm ngay trong danh sách đó.')}`) },

  /* 6 */ { t: 'user.type bắn 16 sự kiện cho hai chữ, fireEvent.change bắn 1', body: `${kpis([
      { v: '1', l: 'sự kiện — fireEvent.change (chỉ “change”)', c: 'amb' },
      { v: '16', l: 'sự kiện — user.type(o, “An”)', c: 'grn' },
    ])}
    ${two(
      t(['[fireEvent] hỏi ngay: KHÔNG có lỗi', '[fireEvent + findBy] lỗi hiện sau khi đợi', '+ [user-event] sau await: CÓ lỗi', '[user.type "An"] pointerdown mousedown focus', '  pointerup mouseup click', '  (keydown keypress beforeinput input keyup) × 2'], 'vitest · src/vi-du/ch09/bai1.test.tsx', 13),
      `${box('warn', 'Test <code>fireEvent</code> xong trước khi Zod trả lời ⇒ <code>An update to FormDatLich inside a test was not wrapped in act(...)</code>.')}
       ${box('good', '<code>const user = userEvent.setup()</code> TRƯỚC render, <code>await</code> mọi thao tác.')}`)}` },

  /* 7 */ { t: 'Test đỏ trên app Chương 12: lỗi đứng dưới họ tên đã hợp lệ', body: two(
    anh('rx-09', 'form-loi-dung-mai.jpg', { w: 470, url: 'localhost:4173/dat-lich/bs-2-2026-10-01-1400', cap: 'Chromium, bản build CÓ compiler: “An” mà vẫn báo lỗi; ô SĐT vừa rời không báo gì' }),
    t(['$ npx vitest run …/FormDatLich.test.tsx', '  ✓ bấm gửi khi form trống ⇒ lỗi dưới cả 4 ô…', '! × mode onTouched: … lỗi biến mất ngay', '! × lỗi THỨ HAI trong cùng nhóm benhNhan…', '  ✓ dữ liệu hợp lệ ⇒ onGui nhận dữ liệu ĐÃ SẠCH', '  ✓ đang gửi ⇒ … chỉ gửi MỘT lần', '', '! expected document not to contain element,', '!   found <p id="hoTen-loi"> … instead', '!       Tests  2 failed | 5 passed (7)', '# bỏ React Compiler khỏi build ⇒ 7/7 xanh'], 'vitest · form sau Chương 12', 12.5)) },

  /* 8 */ { t: 'Sửa: rút chuỗi lỗi ra trước — chuỗi so bằng giá trị', body: two(
    `${yaml([
      ['// compiler biên dịch bản CŨ thành:', ''],
      ['if ($[16] !== e) {', 'e = errors.benhNhan'],
      ['  t13 = e?.hoTen && <p>…</p>;', 'RHF sửa e TẠI CHỖ'],
      ['}', '⇒ cùng object ⇒ <p> cũ'],
      ['', ''],
      ['// bản MỚI:', ''],
      ['const loi = {', ''],
      ['  hoTen: errors.benhNhan?.hoTen?.message,', 'chuỗi | undefined'],
      ['  …', ''],
      ['};', ''],
      ['{loi.hoTen && <p>{loi.hoTen}</p>}', 'đổi là vẽ lại'],
    ], { fs: 13.5, lang: 'tsx' })}`,
    anh('rx-09', 'form-loi-het.jpg', { w: 470, url: 'localhost:4173/dat-lich/bs-2-2026-10-01-1400', cap: 'Sau khi sửa: “An” hết lỗi, ô SĐT hiện đúng câu của nó · 7/7 test xanh' })) },

  /* ───── 9.2 ───── */
  /* 9 */ { t: 'Dữ liệu về sau render: findBy hỏi lại, getBy thì không', body: `${dongThoiGian()}
    ${two(
      table(['Công cụ', 'Dùng cho'], [
        ['<code>await findBy…</code>', 'thứ sẽ xuất hiện'],
        ['<code>await waitFor(() =&gt; expect…)</code>', 'điều sẽ thành đúng'],
        ['<code>waitForElementToBeRemoved</code>', 'thứ sẽ biến mất'],
      ], { sm: true }),
      box('warn', 'Chỉ đặt <strong>phép kiểm</strong> trong <code>waitFor</code>: hàm của nó chạy lại mỗi khi DOM đổi và mỗi 50 ms — đặt <code>user.click</code> vào là bấm nhiều lần.'))}` },

  /* 10 */ { t: 'MSW chặn ở tầng mạng: mọi lớp mã dữ liệu chạy thật', body: `${tangMang()}
    ${two(
      yaml([
        ["beforeAll(() => server.listen({", 'setup.ts'],
        ["  onUnhandledRequest: 'error' }));", 'URL lạ ⇒ đỏ'],
        ['server.use(http.get(…, () =>', 'riêng test này'],
        ['  HttpResponse.json(…, { status: 500 }),', ''],
        ['  { once: true }));', 'chỉ lần đầu'],
        ['afterEach(() => server.resetHandlers());', 'không rò'],
      ], { fs: 13.5 }),
      t(['! [MSW] Error: intercepted a request without a', '!   matching request handler:', '    • GET /api/thong-ke', '! InternalError: [MSW] Cannot bypass a request', '!   when using the "error" strategy…'], 'vitest · SAI 3', 13))}` },

  /* 11 */ { t: 'Màn hình dữ liệu có bốn trạng thái — test cả bốn', body: `${cards([
      { ic: '⏳', t: 'Đang tải', d: 'khung xương <code>aria-busy</code> có NGAY, rồi biến mất', c: 'blu' },
      { ic: '📋', t: 'Có dữ liệu', d: '6 thẻ, lọc <code>?ck=nhi</code> ⇒ 2', c: 'grn' },
      { ic: '∅', t: 'Rỗng', d: '<code>HttpResponse.json([])</code> ⇒ “chưa có bác sĩ”', c: 'tea' },
      { ic: '🔥', t: 'Lỗi 500 / mất mạng', d: 'hộp <code>alert</code>, “Thử lại” ⇒ 6 thẻ; không lộ “Failed to fetch”', c: 'red' },
      { ic: '🕰', t: 'Bản cũ', d: 'làm mới hỏng ⇒ GIỮ danh sách + dòng báo', c: 'amb' },
      { ic: '⚔️', t: '409 khi đặt lịch', d: 'người khác vừa đặt ⇒ “đã có người đặt” + link chọn giờ khác', c: 'vio' },
    ], 3)}
    ${box('info', 'Trước chương này hộp lỗi dùng chung <code>LoiTaiDuLieu</code> có độ phủ <strong>0%</strong> — chưa test nào từng vẽ nó.')}` },

  /* 12 */ { t: 'Client của app thử lại 3 lần: lỗi hiện sau 7056 ms', body: `${kpis([
      { v: '7056 ms', l: 'hộp lỗi — client CỦA APP (thử lại 1 s + 2 s + 4 s)', c: 'red' },
      { v: '10 ms', l: 'hộp lỗi — taoClientTest() (retry: false)', c: 'grn' },
    ])}
    ${two(
      yaml([
        ['export function taoClientTest() {', 'src/test/render.tsx'],
        ['  const qc = taoQueryClient();', 'MỚI cho mỗi test'],
        ['  qc.setDefaultOptions({ queries:', ''],
        ['    { retry: false, gcTime: Infinity } });', ''],
        ['  return qc;', ''],
        ['}', ''],
      ], { fs: 14 }),
      box('tip', 'Chính sách thử lại vẫn được test — dưới dạng <strong>hàm thuần</strong> <code>nenThuLai</code>: 6 trường hợp, vài mili giây (Bài 9.3).'))}` },

  /* 13 */ { t: 'Cờ act bị tắt từ đầu: React không cảnh báo gì cả', body: two(
    `${yaml([
      ['// @testing-library/react/dist/index.js', ''],
      ["if (typeof beforeAll === 'function' …) {", 'globals: false ⇒ KHÔNG'],
      ['  beforeAll(() => setReactActEnvironment(true));', ''],
      ['}', ''],
      ['', ''],
      ['// src/test/setup.ts — Chương 9', ''],
      ['globalThis.IS_REACT_ACT_ENVIRONMENT = true;', 'tự bật'],
    ], { fs: 13.5, lang: 'tsx' })}
     ${box('info', 'Cùng cơ chế đã tắt <code>cleanup</code> tự động (Mục 0 phải tự thêm).')}`,
    `${t(['# test sửa thẳng store khi component đang hiện', '# setup.ts KHÔNG có cờ (trước chương này)', '! [ngoài act] 0 lần console.error', '# setup.ts CÓ cờ', '+ [ngoài act] 1 lần console.error · An update to %s', '+   inside a test was not wrapped in act(...).', '+ [trong act] 0 lần console.error'], 'vitest · src/vi-du/ch09/bai2.test.tsx', 13)}
     ${box('good', 'Bật cờ xong: test của app <strong>0</strong> cảnh báo — chỉ thí nghiệm cố ý mới có.')}`) },

  /* 14 */ { t: 'Đồng hồ giả làm user-event treo — bật shouldAdvanceTime', body: two(
    t(['# vi.useFakeTimers()', '# userEvent.setup({ advanceTimers: vi.advanceTimersByTime })', '! × SAI 5 — … cú bấm đứng im tới hết giờ 5016ms', '! Error: Test timed out in 5000ms.', '', '# asyncWrapper của Testing Library:', '#   setTimeout(0) sau MỖI thao tác,', '#   chỉ biết tua đồng hồ giả của JEST'], 'vitest · src/vi-du/ch09/bai2.sai.tsx', 13),
    `${yaml([
      ['vi.useFakeTimers({ shouldAdvanceTime: true });', '✓ cách 1'],
      ['const user = userEvent.setup(', ''],
      ['  { advanceTimers: vi.advanceTimersByTime });', ''],
      ['act(() => vi.advanceTimersByTime(4900));', 'còn'],
      ['act(() => vi.advanceTimersByTime(100));', 'đúng 5 s: ẩn'],
      ['// cách 2: fireEvent.click khi đồng hồ giả', '✓'],
      ['afterEach(() => vi.useRealTimers());', 'LUÔN trả lại'],
    ], { fs: 13.5 })}`) },

  /* 15 */ { t: 'Chạy riêng xanh, chạy cả file đỏ: state dùng chung', body: two(
    t(['$ npx vitest run -c vitest.sai.config.ts bai2.sai.tsx', '+   ✓ SAI 6a — máy chủ trả rỗng', '!   × SAI 6b — mặc định có 6 bác sĩ', '! Unable to find role="article"', '', '$ … -t "SAI 6b"', '+       Tests  1 passed | 7 skipped (8)', '', '# setup.ts thiếu datLaiDuLieu():', '! FAIL useDatLich.test.tsx > 409 …', '! FAIL DanhSachLichHen.test.tsx > 12.3 …'], 'vitest', 12.5),
    `${list(['<code>QueryClient</code> MỚI cho mỗi test', 'MSW: <code>resetHandlers()</code> + <code>datLaiDuLieu()</code>', 'URL, store Zustand, <code>localStorage</code> về như mới', '<code>vi.useRealTimers()</code> sau đồng hồ giả'])}
     ${t(['$ npx vitest run --sequence.shuffle \\', '    --sequence.seed=2026', '+ Test Files  25 passed (25)', '+      Tests  114 passed (114)'], 'trộn thứ tự', 13)}`) },

  /* ───── 9.3 ───── */
  /* 16 */ { t: 'renderHook vẽ một component vô hình gọi hook của bạn', body: `${renderHookHinh()}
    ${two(
      yaml([
        ['const { rerender, unmount } = renderHook(', ''],
        ['  ({ tieuDe }) => useTieuDeTrang(tieuDe),', ''],
        ["  { initialProps: { tieuDe: 'BS. Hà · …' } });", ''],
        ["rerender({ tieuDe: 'BS. Vy · …' });", 'theo khi đổi'],
        ['unmount();', 'trả tiêu đề cũ'],
      ], { fs: 13.5 }),
      box('warn', '<code>const { isSuccess } = result.current</code> ở đầu test = ảnh chụp lần render ĐẦU ⇒ <code>waitFor</code> hết giờ với “expected false to be true”.'))}` },

  /* 17 */ { t: 'Hook cần router hay QueryClient phải có wrapper', body: two(
    `${t(['! Error: useLocation() may be used only in the', '!   context of a <Router> component.', '! Error: No QueryClient set, use', '!   QueryClientProvider to set one'], 'vitest · renderHook trơn', 13)}
     ${box('tip', 'Muốn thấy hook ghi gì lên URL: gọi thêm <code>useLocation()</code>, <code>useNavigationType()</code> trong cùng hàm của <code>renderHook</code>.')}`,
    yaml([
      ['export function taoWrapper({ url, queryClient }) {', 'src/test/render.tsx'],
      ['  function wrapper({ children }) {', ''],
      ['    return (', ''],
      ['      <QueryClientProvider client={queryClient}>', 'client MỚI'],
      ['        <MemoryRouter initialEntries={[url]}>', ''],
      ['          {children}', ''],
      ['      …', ''],
      ['  return { wrapper, queryClient };', 'để test soi'],
      ['}', ''],
    ], { fs: 13.5, lang: 'tsx' })) },

  /* 18 */ { t: 'useKhungGio: mỗi quyết định trong hook một test', body: `${table(['Dòng trong hook', 'Test chứng minh', 'Đo'], [
      ['<code>queryKey</code> + <code>queryFn</code>', 'pending → success, 4 khung giờ, ĐÚNG 1 request', '+✓ 77 ms'],
      ['<code>enabled: bacSiId !== null</code>', '<code>fetchStatus: "idle"</code>, 0 request sau 50 ms', '+✓ 54 ms'],
      ['<code>placeholderData: keepPreviousData</code>', 'đổi ngày ⇒ vẫn ngày cũ, <code>isPlaceholderData</code> ⇒ ngày mới', '+✓ 217 ms'],
      ['<code>retry: nenThuLai</code> (client của app)', '404 ⇒ lỗi, KHÔNG thử lại: 1 request', '+✓ 63 ms'],
    ])}
    ${two(
      yaml([["server.events.on('request:start', ({ request }) => {", 'đếm request'], ["  if (request.url.includes('/khung-gio'))", ''], ['    soRequest.push(…);', ''], ['});', '']], { fs: 13.5 }),
      box('bad', 'Bỏ <code>keepPreviousData</code> khỏi hook ⇒ <strong>1 failed | 3 passed</strong>. Test có răng.'))}` },

  /* 19 */ { t: 'mutateAsync xong không có nghĩa result.current đã đổi', body: two(
    `${t(['# lần chạy đầu, test useDatLich:', '! × thành công ⇒ trả lịch hẹn lh-1 …', '! AssertionError: expected false to be true', '!    expect(result.current.isSuccess).toBe(true);', '', '# và: 404 "Không có khung giờ này" — máy chủ', '#   giả sinh khung giờ LƯỜI, hook đứng riêng', '#   không có trang nào GET trước'], 'vitest', 13)}
     ${box('info', 'TanStack gửi cập nhật tới component qua <code>notifyManager</code>: mặc định trong một <code>setTimeout(0)</code>.')}`,
    yaml([
      ["const lamCu = vi.spyOn(queryClient, 'invalidateQueries');", 'theo dõi, vẫn chạy'],
      ['await act(async () => {', ''],
      ['  lichHen = await result.current.mutateAsync(yc);', ''],
      ['});', ''],
      ['await waitFor(() =>', 'đợi một nhịp'],
      ['  expect(result.current.isSuccess).toBe(true));', ''],
      ['expect(lamCu.mock.calls.map((c) => c[0]?.queryKey))', ''],
      ["  .toEqual([['bac-si','bs-2','khung-gio'], ['lich-hen']]);", ''],
    ], { fs: 13 })) },

  /* 20 */ { t: 'Store và chính sách thử lại: test không cần React', body: two(
    yaml([
      ['beforeEach(() => vi.useFakeTimers());', ''],
      ["hien('A');", ''],
      ['vi.advanceTimersByTime(3000);', ''],
      ["hien('B');", ''],
      ['vi.advanceTimersByTime(1999);', "['A','B']"],
      ['vi.advanceTimersByTime(1);', "['B'] — A đủ 5 s"],
      ['vi.advanceTimersByTime(3000);', '[] — B đủ 5 s'],
    ], { fs: 14 }),
    `${table(['<code>nenThuLai(lần, lỗi)</code>', 'thử lại?'], [
      ['0 · LoiApi 404', '-false'],
      ['0 · LoiApi 409', '-false'],
      ['0 · LoiApi 500', '+true'],
      ['2 · LoiApi 503', '+true'],
      ['3 · LoiApi 503', '-false'],
      ['0 · TypeError (mất mạng)', '+true'],
    ], { sm: true })}
     ${box('good', '6 trường hợp chạy trong <strong>9 ms</strong> — trong test component, một chuỗi thử lại thật mất ~7 giây.')}`) },

  /* ───── 9.4 ───── */
  /* 21 */ { t: 'Độ phủ trước và sau chương: dòng 93,09% → 96,32%', body: two(
    bars([
      { l: 'Dòng · trước', v: 93.09, txt: '93,09%', c: 'amb' },
      { l: 'Dòng · sau', v: 96.32, txt: '96,32%', c: 'grn' },
      { l: 'Nhánh · trước', v: 74.6, txt: '74,6%', c: 'amb' },
      { l: 'Nhánh · sau', v: 81.02, txt: '80,78–81,02%', c: 'grn' },
      { l: 'Hàm · trước', v: 86.89, txt: '86,89%', c: 'amb' },
      { l: 'Hàm · sau', v: 93.1, txt: '93,1%', c: 'grn' },
    ], { lw: 170, max: 100 }),
    `${t(['# trước (47 test) — theo file', '! LoiTaiDuLieu.tsx   0%   ← chưa từng vẽ', '! query-client.ts   50%   ← chưa thử lại lần nào', '  FormDatLich.tsx 97,72%  ← và có một bug', '', '$ npm install -D @vitest/coverage-v8@5.0.2', '$ npm run test:cov', '+ Tests  114 passed (114)'], 'coverage-v8', 13)}
     ${box('warn', 'Bug của form nằm trên một dòng ĐÃ được phủ. Độ phủ không nhìn thấy phép kiểm.')}`) },

  /* 22 */ { t: 'Cùng test, cùng mã: React Compiler biến 231 nhánh thành 838', body: `${kpis([
      { v: '231 → 838', l: 'số nhánh đếm được (không → có compiler)', c: 'amb' },
      { v: '89% → 81%', l: 'độ phủ nhánh — test không đổi gì', c: 'red' },
      { v: '0,24', l: 'điểm lệch giữa các lần chạy (80,78 · 81,02)', c: 'blu' },
    ])}
    ${two(
      table(['File', 'có compiler', 'không'], [
        ['KhungXuong.tsx', '!7/14 nhánh', '+1/1'],
        ['TheBacSi.tsx', '!44/50', '+13/13'],
        ['KhuBacSi.tsx', '!61/73', '+12/12'],
      ], { sm: true }),
      box('tip', 'Compiler thêm nhánh “cache trúng / trượt” quanh mỗi khúc JSX. Chỉ so số trong <strong>cùng một đường build</strong>; đặt ngưỡng trên đường build bạn phát hành.'))}` },

  /* 23 */ { t: 'Báo cáo HTML tô những dòng chưa test nào chạy qua', body: two(
    anh('rx-09', 'cov-file.jpg', { w: 620, url: 'file:///…/phong-kham/coverage/src/pages/TrangDatLich.tsx.html', cap: 'Dòng 30–33: “Không tìm thấy khung giờ này” — link cũ trong tin nhắn dẫn tới đây' }),
    `${list(['đỏ = chưa chạy; <code>I</code>/<code>E</code> = phía if/else chưa chạy', '<code>TrangLoi.tsx</code> 0% — bài thực hành 9.4', 'báo cáo là BẢN ĐỒ chỗ cần nhìn, không phải bảng điểm'])}
     ${t(['# vite.config.ts: branches 75 → 85', '+ Tests  114 passed (114)', '! ERROR: Coverage for branches (80.78%)', '!   does not meet global threshold (85%)', '$ echo $?', '! 1'], 'ngưỡng = sàn cho CI', 13)}`) },

  /* 24 */ { t: 'Làm hỏng goiApi: test giả module vẫn xanh, test MSW đỏ', body: two(
    `${yaml([
      ["vi.mock('@/shared/api/phong-kham', () => ({", 'giả CẢ module'],
      ['  api: { danhSachBacSi: vi.fn() } }));', ''],
      ['vi.mocked(api.danhSachBacSi)', ''],
      ["  .mockRejectedValue(new LoiApi(500, '…'));", 'test tự tạo lỗi'],
    ], { fs: 13.5 })}
     ${box('warn', 'Lần đầu <code>vi.mock</code> KHÔNG có tác dụng: <code>setup.ts</code> import store qua <code>@/features/bac-si</code> ⇒ kéo theo API thật trước. Sửa: import thẳng file store.')}`,
    t(['# http.ts: if (!res.ok) → if (false && !res.ok)', '+ ✓ src/vi-du/ch09/bai4-vi-mock.test.tsx (2 tests)', '! × 500 ⇒ hộp lỗi nói lời máy chủ; bấm "Thử lại"…', '! × đang có danh sách, lần làm mới hỏng ⇒ GIỮ…', '!       Tests  2 failed | 7 passed (9)', '', '# giả càng cao, test càng phủ ít mã thật'], 'đột biến · goi-api-bo-ok', 13)) },

  /* 25 */ { t: 'Test thứ người dùng thấy và luật; bắt mỗi test đỏ một lần', body: two(
    vs({
      no: { t: 'Không test', items: ['tên state, số lần hook chạy, class CSS', 'việc của thư viện (TanStack có cache)', 'snapshot cả cây DOM lớn', 'đuổi theo 100%'] },
      yes: { t: 'Nên test', items: ['bốn trạng thái, form, điều hướng', 'luật có nhánh: schema, bộ lọc, thử lại', 'hợp đồng: hook chung, thứ form gửi', 'mỗi bug đã sửa một test chống tái phát'] },
    }),
    t(['FormDatLich bản sau Ch12      ✗ 2 failed', 'schema: bỏ .trim()            ✗ 2 failed', 'form: bỏ disabled             ✗ 1 failed', 'LoiTaiDuLieu: matMang = false ✗ 1 failed', 'KhuBacSi: bỏ dòng bản cũ      ✗ 1 failed', 'useKhungGio: bỏ keepPrevious  ✗ 1 failed', 'useDatLich: onSuccess         ✗ 2 failed', 'thông báo: 5000 → 3000       ✗ 1 failed', 'setup: bỏ datLaiDuLieu()      ✗ 2 failed', 'setup: bỏ cờ act             ✗ 1 failed', 'goiApi không ném khi 500      ✗ 2 failed', '+ 11/11 lần làm hỏng đều bị bắt'], 'do/ch09-dot-bien.mjs', 12.5)) },

  /* 26 */ { t: 'Sai lầm hay gặp ở Chương 9', body: cards([
    { ic: '🔍', t: 'getBy để kiểm “không có”', d: 'ném lỗi trước expect. Dùng <code>queryBy</code>.', c: 'red' },
    { ic: '⏱', t: 'Quên await user-event', d: '“got 0 times” dù nút vẫn chạy.', c: 'amb' },
    { ic: '🔁', t: 'Client dùng chung / có thử lại', d: 'cache rò giữa test; lỗi hiện sau 7 giây.', c: 'vio' },
    { ic: '🔇', t: 'globals: false mà không bật cờ act', d: 'React không bao giờ cảnh báo.', c: 'pnk' },
    { ic: '📸', t: 'Tách result.current sớm', d: 'giữ mãi lần render đầu, waitFor hết giờ.', c: 'ora' },
    { ic: '🎭', t: 'vi.mock mã của chính mình', d: 'bỏ qua goiApi; bug lọt qua mà test vẫn xanh.', c: 'blu' },
  ], 3) },

  /* 27 */ { t: 'Bảng tra nhanh Chương 9', body: table(['Cần…', 'Dùng', 'Nhớ'], [
    ['Tìm phần tử', '<code>getByRole</code> / <code>getByLabelText</code>', 'đọc danh sách vai trò khi hỏng'],
    ['Kiểm “không có”', '<code>queryBy…</code> + <code>.not.toBeInTheDocument()</code>', 'getBy ném lỗi'],
    ['Thứ sẽ xuất hiện', '<code>await findBy…</code> / <code>waitFor</code>', '50 ms · 1000 ms; không side effect'],
    ['Thao tác', '<code>userEvent.setup()</code> trước render', '<code>await</code> mọi lời gọi'],
    ['API giả', 'MSW + <code>server.use(…, { once })</code>', '<code>onUnhandledRequest: "error"</code>'],
    ['Client trong test', '<code>taoClientTest()</code> mới mỗi test', '<code>retry: false</code>'],
    ['Suspense / use()', '<code>await act(async …)</code> (veTrangCho)', 'act đồng bộ ⇒ treo mãi'],
    ['Cảnh báo act', '<code>IS_REACT_ACT_ENVIRONMENT = true</code>', 'globals: false thì tự bật'],
    ['Đồng hồ giả', '<code>shouldAdvanceTime</code> + <code>advanceTimers</code>', '<code>useRealTimers</code> sau đó'],
    ['Hook dùng chung', '<code>renderHook</code> + <code>taoWrapper()</code>', 'đọc <code>result.current</code> mới'],
    ['Độ phủ', '<code>npm run test:cov</code> + thresholds', 'sàn cho CI; so cùng đường build'],
  ], { sm: true }) },

  /* 28 */ { t: 'Tự gõ tiếp dự án: bốn bước, 56 test mới, 1 bug sửa', body: two(
    steps([
      ['9.1 — form', '<code>TheBacSi</code>, <code>FormDatLich</code> (7), <code>schema</code> (17), <code>axe.ts</code>; sửa lỗi form + compiler'],
      ['9.2 — dữ liệu', '<code>KhuBacSi</code> (7), <code>TrangDatLich</code> 409 (2); cờ act, <code>scrollTo</code> trong setup'],
      ['9.3 — hook', '<code>taoWrapper</code>; 6 file test hook, store, chính sách thử lại (19)'],
      ['9.4 — độ phủ', '<code>coverage-v8</code>, ngưỡng, <code>test:cov</code>; setup import thẳng store'],
    ]),
    t(['# trước chương: 11 file · 47 test', '$ npx tsc -b && npx vitest run', '+  Test Files  25 passed (25)', '+       Tests  114 passed (114)', '$ npm run test:cov', '+ Lines 96.32% · Functions 93.1%', '$ npx vitest run 2>&1 | grep -c "Not implemented"', '+ 0   (trước: 63)'], 'tiêu chí đạt', 13)) },
]);
