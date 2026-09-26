/**
 * React · Deck rx-10 — Chương 10: Dự án giữa khoá — giao diện đặt lịch.
 *
 * MỌI số liệu/output trên slide là THẬT, chạy 26/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch10
 * (chép từ ảnh chụp sau-ch09, 114 test xanh, rồi làm tính năng "lịch trống cả tuần + đổi giờ" theo bốn mốc) —
 * react 19.3.0 · vite 8.3.1 · typescript 6.0.3 · vitest 5.0.2 · @tanstack/react-query 5.103.3 · react-router 8.4.0 ·
 * msw 2.15.0 · axe-core 4.13.0 · Chromium 149 (playwright-core) · nginx 1.27-alpine (Docker) · Python 3.14 http.server.
 *   do/ch10-dot-bien.mjs (10 đột biến) · do/ch10-do-luoi.mjs (Profiler trong Chromium, bản trước/sau khi sửa)
 *   do/ch10-chup.mjs (ảnh) · do/ch10-spa.sh (SPA fallback trên 4 máy chủ) · do/ch10-tab-cu.mjs (tab cũ sau deploy)
 * Ảnh chụp: scripts/slides-src/rx-anh/rx-10/*.jpg.
 */
import {
  S, cover, cards, box, table, two, list, mindmap, term as rxTerm, yaml, sv, R, T, A, anh, steps, kpis, vs, compTree,
} from './_rx-chung.mjs';

export const deck = { key: 'rx-10', code: 'REACT · CHƯƠNG 10', title: 'Dự án giữa khoá', sub: 'React · Chương 10' };

const t = (lines, title, fs = 14) => rxTerm(lines, { title, dir: '~/phong-kham', fs });

/* ───────── Slide 7 — sáu query song song, dùng chung cache với trang chi tiết ───────── */
const cacheTuan = () => {
  let s = '';
  const ngay = ['T2 28/09', 'T3 29/09', 'T4 30/09', 'T5 01/10', 'T6 02/10', 'T7 03/10'];
  s += R(10, 14, 250, 64, { c: 'rx' }) + T(135, 42, 'useLichTuan(bs-2, tuần)', { fs: 15.5, a: 'middle', mono: true }) + T(135, 64, 'useQueries + combine', { fs: 14, c: 'mu', a: 'middle' });
  s += R(10, 150, 250, 64, { c: 'tea' }) + T(135, 178, 'ChonKhungGio (Ch7)', { fs: 15.5, a: 'middle', mono: true }) + T(135, 200, 'trang chi tiết, 1 ngày', { fs: 14, c: 'mu', a: 'middle' });
  ngay.forEach((n, i) => {
    const x = 330 + i * 125, qua = i < 3;
    s += R(x, 60, 112, 96, { c: qua ? 'dim' : i === 3 ? 'grn' : 'blu', dash: qua, r: 10 }) +
      T(x + 56, 88, n, { fs: 14.5, b: true, a: 'middle', c: qua ? 'mu' : '#e6edf3' }) +
      T(x + 56, 112, qua ? 'đã qua' : `khung-gio`, { fs: 13, c: 'mu', a: 'middle', mono: !qua }) +
      T(x + 56, 134, qua ? 'không hỏi' : i === 3 ? 'đã có sẵn' : 'GET', { fs: 13, c: qua ? 'mu' : i === 3 ? 'grn' : 'blu', a: 'middle', b: true });
  });
  s += A(262, 46, 326, 90, { c: 'rx' }) + A(262, 182, 700, 150, { c: 'tea', dash: true });
  s += T(330, 36, "queryKey: ['bac-si', 'bs-2', 'khung-gio', '2026-10-01'] … MỖI NGÀY MỘT MỤC CACHE", { fs: 13.5, c: 'amb', mono: true });
  s += T(330, 190, 'đi từ trang chi tiết sang: ngày 01/10 có sẵn ⇒ chỉ 2 request mới (test đo bằng MSW)', { fs: 14, c: 'grn' });
  return sv(1100, 220, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 10 — Dự án giữa khoá: giao diện đặt lịch', sub: 'Thiết kế → cây component · lịch trống cả tuần · đổi giờ · 409 · Profiler · axe · MSW · build · SPA fallback · rubric tự chấm', chap: 'CHƯƠNG 10' }),

  /* 2 */ { t: 'Bản đồ chương: một tính năng lớn, làm từ đầu tới lúc lên mạng', body: mindmap('Dự án giữa khoá', 'bạn tự làm · bài giảng chỉ đường', [
    { t: '10.1 Thiết kế', d: 'yêu cầu · mock-up · cây · state · API', c: 'rx' },
    { t: '10.2 Dựng', d: '4 mốc · useQueries · đổi giờ · 409', c: 'vio' },
    { t: '10.3 Hoàn thiện', d: 'Profiler · axe · bàn phím · 31 test', c: 'grn' },
    { t: '10.4 Lên mạng', d: 'build · SPA fallback · tab cũ · rubric', c: 'amb' },
    { t: '🛠 Đề của bạn', d: 'đặt phòng lab (LabFlow)', c: 'tea' },
  ]) },

  /* ───── 10.1 ───── */
  /* 3 */ { t: 'Dự án giữa khoá: bạn tự làm, bài giảng chỉ đường và chấm', body: two(
    steps([
      ['Đọc yêu cầu', 'viết thành câu chuyện người dùng + tiêu chí kiểm được'],
      ['Mock-up', 'vẽ tay/Figma: ô nào, nút nào, trạng thái nào'],
      ['Cây component', 'trang ghép, tính năng làm; ai vẽ gì'],
      ['State ở đâu', 'server · URL · component · store'],
      ['Dữ liệu / API', 'query key, mutation, mã lỗi 409'],
    ]),
    `${box('info', 'Chương 1–9 bạn gõ theo. Chương này bài giảng đưa <strong>đề, mốc và tiêu chí</strong>; mã mẫu nằm trong <code>&lt;details&gt;</code> — mở ra sau khi bạn đã thử.')}
     ${box('tip', 'Mười phút thiết kế tiết kiệm hai giờ sửa: cả ba bug thật của chương đều là chỗ <strong>giả định</strong> không được viết ra.')}
     ${box('good', 'Đích: tính năng chạy, <strong>145 test xanh</strong>, build và deploy được, tự chấm theo rubric 100 điểm.')}`) },

  /* 4 */ { t: 'Yêu cầu viết thành câu chuyện người dùng và tiêu chí kiểm được', body: table(['Là…', 'tôi muốn…', 'Đạt khi (test được)'], [
    ['người bệnh', 'xem giờ trống <strong>cả tuần</strong> của một bác sĩ', '6 cột T2–T7 · ngày đã qua không hỏi máy chủ'],
    ['người bệnh', 'lướt sang tuần sau, gửi link cho người nhà', '<code>?tuan=</code> trên URL · replace · 4 tuần mở'],
    ['người bệnh đã đăng nhập', 'không lỡ tay đặt hai lịch cùng giờ', 'ô trùng hiện “Bạn có lịch”, không bấm được'],
    ['người bệnh', '<strong>đổi giờ</strong> một lịch đang chờ', 'giờ mới kín, giờ cũ mở lại, về “Lịch hẹn”'],
    ['người bệnh', 'biết ngay khi người khác giành mất giờ', '409 ⇒ hộp lỗi nhận focus, ô đó thành “Kín”'],
    ['người dùng bàn phím', 'làm hết việc trên mà không cần chuột', 'Tab · Space · Enter; axe 0 lỗi'],
  ], { sm: true }) },

  /* 5 */ { t: 'Mock-up thành cây component: trang ghép, tính năng làm', body: `${compTree({
    w: 1100, h: 400, bw: 214, legend: false,
    root: { n: 'TrangDoiGio', s: 'pages/ · lazy', st: true, kids: [
      { n: 'DieuHuongTuan', s: 'link ?tuan=' },
      { n: 'LuoiLichTuan', s: 'bảng giờ × ngày', kids: [{ n: 'Link|button', s: 'mỗi ô trống' }] },
      { n: 'hộp lỗi', s: 'role="alert"', c: 'red' },
      { n: 'nút Xác nhận', s: 'mutateAsync' },
    ] },
  })}
    ${box('tip', '<code>features/lich-tuan/</code> chứa lưới, hook và luật; <code>pages/</code> chỉ GHÉP: <code>TrangLichTuan</code> (xem, đặt) và <code>TrangDoiGio</code> (chọn giờ mới) dùng chung MỘT <code>LuoiLichTuan</code> với hai chế độ.')}` },

  /* 6 */ { t: 'Mỗi mẩu state một chỗ ở: server, URL, component, store', body: table(['Dữ liệu', 'Sống ở', 'Vì sao', 'Công cụ'], [
    ['Khung giờ 6 ngày', '+máy chủ (cache)', 'người khác đổi được', '<code>useQueries</code> (TanStack)'],
    ['Lịch hẹn của tôi', '+máy chủ (cache)', 'để chặn giờ trùng', '<code>useLichHen</code> (có sẵn)'],
    ['Tuần đang xem', '!URL <code>?tuan=</code>', 'F5, Back, gửi link', '<code>useSearchParams</code> + <code>docTuan</code>'],
    ['Ô đang chọn (đổi giờ)', 'component', 'chỉ trang này cần, bỏ khi rời', '<code>useState</code>'],
    ['Lỗi client (trùng giờ)', 'component', 'hiện một lần, xoá khi chọn lại', '<code>useState</code>'],
    ['Đã đăng nhập?', 'store', 'cả app đọc', 'Zustand (Chương 7)'],
    ['Giờ khám của bảng', '-KHÔNG tự đặt', 'máy chủ quyết định', 'rút từ dữ liệu'],
  ], { sm: true }) },

  /* 7 */ { t: 'Sáu query một tuần, dùng chung cache với trang chi tiết', body: `${cacheTuan()}
    ${table(['PATCH /api/lich-hen/:id  { khungGioId }', 'Máy chủ trả'], [
      ['lịch không tồn tại', '404'],
      ['lịch không còn “chờ xác nhận”', '!409 Chỉ đổi giờ được lịch đang chờ xác nhận'],
      ['giờ mới đã có người đặt', '!409 Khung giờ này vừa có người đặt'],
      ['bệnh nhân đã có lịch khác đúng giờ đó', '!409 Bạn đã có một lịch khác vào đúng giờ này'],
      ['hợp lệ', '+200 · giờ cũ mở lại, giờ mới kín'],
    ], { sm: true })}` },

  /* ───── 10.2 ───── */
  /* 8 */ { t: 'Bốn mốc, mỗi mốc một tiêu chí chạy được', body: table(['Mốc', 'Làm', 'Đạt khi'], [
    ['1 · Luật', '<code>tuan.ts</code>, <code>kiem-trung.ts</code> — hàm thuần', '+13 test, không React, &lt; 10 ms'],
    ['2 · Xem tuần', '<code>useLichTuan</code>, <code>LuoiLichTuan</code>, <code>/bac-si/:id/lich-tuan</code>', '+8 test: 6 cột, cache chung, 1 ngày lỗi'],
    ['3 · Đổi giờ', 'API <code>doiGio</code>, handler, <code>useDoiGio</code>, <code>/lich-hen/:id/doi-gio</code>', '+giờ mới kín, giờ cũ mở, client chặn trùng'],
    ['4 · 409', '<code>onSettled</code>, focus hộp lỗi, bỏ chọn', '+6 test trang đổi giờ xanh'],
    ['(10.3)', 'Profiler, axe, bàn phím', '+4 test chất lượng'],
  ]) },

  /* 9 */ { t: 'Mốc 1: luật ngày–tuần là hàm thuần, test không cần React', body: two(
    yaml([
      ['const soNgay = (ngay) => Date.UTC(', 'đếm ngày theo UTC'],
      ['  +ngay.slice(0,4), +ngay.slice(5,7)-1,', '⇒ không lệch múi giờ'],
      ['  +ngay.slice(8,10)) / 86_400_000;', ''],
      ['', ''],
      ['export function docTuan(sp) {', ''],
      ["  const t = sp.get('tuan') ?? '';", 'URL = người dùng gõ'],
      ['  const hopLe = /^\\d{4}-\\d{2}-\\d{2}$/.test(t)', 'đúng dạng'],
      ['    && thuTrongTuan(t) === 0', 'là thứ Hai'],
      ['    && t >= TUAN_DAU && t <= TUAN_CUOI;', 'trong 4 tuần mở'],
      ['  return hopLe ? t : TUAN_DAU;', 'sai ⇒ tuần đầu'],
      ['}', ''],
    ], { fs: 13.5, lang: 'tsx' }),
    t(['$ npx vitest run src/features/lich-tuan/logic \\', '    --reporter=verbose', '+ ✓ kiem-trung › có lịch chưa huỷ đúng giờ đó ⇒ trùng', '+ ✓ kiem-trung › lịch đã huỷ, khác giờ … ⇒ không trùng', '+ ✓ kiem-trung › đổi giờ: không tự trùng với chính nó', '+ ✓ tuan › 01/10/2026 là thứ Năm; tuần … thứ Hai 28/09', '+ ✓ tuan › cộng ngày qua tháng và qua năm', '+ ✓ tuan › bốn tuần mở đặt lịch: 28/09 → 19/10', '+ ✓ tuan › ?tuan=2026-10-06 (không phải thứ Hai) ⇒ …', '  … (6 test nữa)', '       Tests  13 passed (13)', '    Duration  1.66s (… tests 1%)'], 'mốc 1', 12.5)) },

  /* 10 */ { t: 'Mốc 2: useQueries chạy sáu ngày song song, combine gộp lại', body: two(
    yaml([
      ['useQueries({', ''],
      ['  queries: ngays.map((ngay) => ({', '6 query, 6 key'],
      ['    queryKey: khoa.khungGio(bacSiId, ngay),', '= key của Ch7'],
      ['    queryFn: …api.khungGio(…),', ''],
      ['    enabled: bacSiId !== null', 'chưa biết bác sĩ'],
      ['      && !daQua(ngay),', 'ngày đã qua'],
      ['    staleTime: 30_000 })),', ''],
      ['  combine: (kqs) => ({', 'MỘT object'],
      ['    ngay: kqs.map(…trạng thái từng ngày),', 'da-qua·dang-tai·loi·xong'],
      ['    loi, dangThuLai, thuLai }),', ''],
      ['});', ''],
    ], { fs: 13.5, lang: 'tsx' }),
    `${box('good', 'Sáu ngày là sáu mục cache <strong>độc lập</strong>: một ngày lỗi 500 thì năm ngày kia vẫn hiện; cột đó ghi “Lỗi” và hộp “Thử lại” chỉ gọi lại ngày hỏng.')}
     ${box('warn', 'Đừng gọi <code>useQuery</code> trong vòng lặp <code>for</code>: số hook đổi theo tuần là vỡ luật hook. <code>useQueries</code> nhận MẢNG — độ dài đổi thoải mái.')}`) },

  /* 11 */ { t: 'Lưới tuần: bảng thật, ngày đã qua mờ, ô trống là link', body: two(
    anh('rx-10', 'lich-tuan.jpg', { w: 700, url: 'localhost:4173/bac-si/bs-2/lich-tuan', cap: 'Chromium, bản build · tuần 28/09: 3 ngày đã qua không gửi request nào' }),
    `${list(['<code>&lt;table&gt;</code> + <code>&lt;caption&gt;</code> + <code>th scope</code>: trình đọc màn hình đọc “Thứ Sáu 02/10, 09:30”', 'giờ khám (hàng) rút từ dữ liệu, không viết cứng', 'ô trống = <code>&lt;Link&gt;</code> tới form đặt lịch có sẵn', 'nhãn đọc được: “Đặt 09:30 Thứ Sáu 02/10/2026”'])}`, 'w60') },

  /* 12 */ { t: 'Ghép tính năng làm lộ giả định cũ: docNgay chỉ biết ba ngày', body: two(
    t(['$ npx vitest run src/pages/TrangLichTuan.test.tsx', '+ ✓ tuần đầu: 6 cột thứ Hai → thứ Bảy …', '+ ✓ ô trống là link sang form đặt lịch …', '+ ✓ "Tuần sau →" ⇒ ?tuan=2026-10-05 (replace) …', '! × bấm một ô của TUẦN SAU ⇒ tới được form …', '!   → Unable to find role="heading"', '!     and name "Đặt lịch khám"', '  …', '  <h2>Không tìm thấy khung giờ này</h2>', '', '!      Tests  1 failed | 6 passed (7)'], 'mốc 2 · lần chạy đầu', 13),
    `${yaml([
      ['// TrangDatLich (Chương 7)', ''],
      ['const ngay = docNgay(sp);', 'chỉ nhận 01–03/10'],
      ['//   ?ngay=2026-10-06 ⇒ "2026-10-01"', 'âm thầm đổi'],
      ['//   ⇒ tìm khung giờ sai ngày ⇒ không thấy', ''],
      ['', ''],
      ['// Chương 10', ''],
      ['const ngay = docNgayDat(sp);', 'mọi ngày mở đặt'],
    ], { fs: 13.5, lang: 'tsx' })}
     ${box('tip', 'Test “đi hết luồng” (lưới → form) bắt được thứ mà test từng phần không bao giờ thấy.')}`) },

  /* 13 */ { t: 'Chặn trùng hai lớp: client cho trải nghiệm, máy chủ cho sự thật', body: two(
    `${vs({
      no: { t: 'Chỉ chặn ở client', items: ['hai tab, hai máy, cache 30 giây cũ', 'ai cũng gọi thẳng API được', 'test “lớp máy chủ”: client không biết ⇒ PATCH đi'] },
      yes: { t: 'Client + máy chủ', items: ['client: ô trùng “Bạn có lịch”, kiểm lại trước khi gửi', 'máy chủ: 409 “Bạn đã có một lịch khác…”', 'onSettled tải lại ⇒ client học được ngay'] },
    })}`,
    anh('rx-10', 'lich-tuan-ban-co-lich.jpg', { w: 560, url: 'localhost:4173/bac-si/bs-1/lich-tuan', cap: 'Đã đặt 15:30 thứ Sáu với BS. Hà ⇒ lưới của BS. An chặn đúng ô đó' })) },

  /* 14 */ { t: 'Mốc 4: 409 thì tải lại lưới, bỏ chọn, đưa focus vào hộp lỗi', body: two(
    anh('rx-10', 'doi-gio-409.jpg', { w: 560, h: 380, url: 'localhost:4173/lich-hen/lh-1/doi-gio?tranh=1', cap: '?tranh=1: người khác giành mất 09:30 thứ Bảy · focus ở hộp lỗi' }),
    `${yaml([
      ['onSettled: (_kq, _loi, { lichHen }) =>', 'KHÔNG onSuccess'],
      ['  Promise.all([ invalidate lichHen,', ''],
      ["    invalidate ['bac-si', id, 'khung-gio'] ]),", 'giờ cũ/mới'],
      ['', ''],
      ['useEffect(() => {', ''],
      ['  if (loi) hopLoi.current?.focus();', 'role="alert"'],
      ['}, [loi]);', 'tabIndex={-1}'],
    ], { fs: 13.5, lang: 'tsx' })}
     ${t(['# useDoiGio: onSettled → onSuccess', '! × người khác vừa đặt mất giờ đã chọn ⇒ 409…', '! × lớp máy chủ: lịch trùng … 409', '!       Tests  2 failed | 4 passed (6)'], 'đột biến · onsuccess', 13)}`) },

  /* ───── 10.3 ───── */
  /* 15 */ { t: 'Profiler: đổi tuần là vứt cả bảng đi dựng lại, trắng 408 ms', body: `${two(
    anh('rx-10', 'dang-doi-tuan-truoc.jpg', { w: 540, h: 250, url: 'trước: 300 ms sau khi bấm “Tuần sau →”', cap: 'Bảng biến mất, chân trang nhảy lên' }),
    anh('rx-10', 'dang-doi-tuan-sau.jpg', { w: 540, h: 250, url: 'sau: 300 ms sau khi bấm “Tuần sau →”', cap: 'Bảng đứng yên, chỉ ô thành “…”' }))}
    ${t(['[trước khi sửa] Chromium 149 · API chậm 400 ms · vite build --mode profiling', '!  → tuần 05/10: Profiler [mount 0.6ms] · cùng <table>: KHÔNG · KHÔNG có bảng 408 ms', '[sau khi sửa]', '+  → tuần 05/10: Profiler [update 0.2ms, update 0.5ms] · cùng <table>: có · KHÔNG có bảng 0 ms'], 'do/ch10-do-luoi.mjs', 12.5)}` },

  /* 16 */ { t: 'Sửa: nhớ giờ của lần render trước, bảng không bao giờ biến mất', body: two(
    yaml([
      ['const gioTuanNay = […giờ trong dữ liệu];', 'tuần mới: []'],
      ['const [gioCu, setGioCu] = useState([]);', ''],
      ['if (gioTuanNay.length > 0 &&', ''],
      ['    gioTuanNay.join() !== gioCu.join())', 'đổi thật mới set'],
      ['  setGioCu(gioTuanNay);', 'set TRONG render'],
      ['const cacGio = gioTuanNay.length > 0', ''],
      ['  ? gioTuanNay : gioCu;', 'đang tải ⇒ giờ cũ'],
    ], { fs: 13.5, lang: 'tsx' }),
    `${kpis([{ v: '408 → 0 ms', l: 'không có bảng khi đổi tuần', c: 'grn' }, { v: 'update', l: 'pha Profiler khi đổi tuần (trước: mount)', c: 'blu' }])}
     ${box('warn', '<code>placeholderData: keepPreviousData</code> KHÔNG cứu được ở đây: <code>useQueries</code> tạo observer MỚI cho key mới (đọc <code>queriesObserver.js</code>), nên không có “dữ liệu trước” để giữ.')}
     ${box('tip', 'Profiler không chỉ đo nhanh/chậm: pha <strong>mount</strong> ở chỗ đáng lẽ là <strong>update</strong> là dấu hiệu component bị vứt đi.')}`) },

  /* 17 */ { t: 'Thiếu một điều kiện enabled: MSW la lên, test vẫn xanh', body: two(
    t(['stderr | lich-tuan.chat-luong.test.tsx > axe: /lich-hen/lh-1/doi-gio', '! [MSW] Error: intercepted a request without', '!   a matching request handler:', '!   • GET /api/bac-si//khung-gio?ngay=2026-10-01', '  …', '+ ✓ axe: /lich-hen/lh-1/doi-gio không có lỗi nào', '', "# useLichTuan(lh?.bacSiId ?? '', tuan)", '#   lịch hẹn chưa về ⇒ id rỗng ⇒ vẫn gọi API'], 'lần chạy đầu của Bài 10.3', 12.5),
    `${box('bad', '<code>onUnhandledRequest: "error"</code> làm <strong>request</strong> hỏng, không làm <strong>test</strong> đỏ — test không kiểm query đó thì vẫn xanh. Đọc stderr, đừng chỉ nhìn ✓.')}
     ${yaml([["useLichTuan(lh?.bacSiId ?? null, tuan)", 'null = chưa biết'], ['enabled: bacSiId !== null && !daQua(ngay)', '']], { fs: 13.5, lang: 'tsx' })}
     ${box('good', 'Test mới: mọi request khung giờ đều của <code>bs-2</code>. Bỏ điều kiện ⇒ đỏ: <code>+ "null"</code>.')}`) },

  /* 18 */ { t: 'Tiếp cận: bảng thật, axe 0 lỗi, đi hết bằng bàn phím', body: two(
    table(['Kiểm', 'Kết quả'], [
      ['axe <code>/bac-si/bs-2/lich-tuan</code>', '+0 lỗi'],
      ['axe <code>/lich-hen/lh-1/doi-gio</code>', '+0 lỗi'],
      ['Tab tới ô 09:30 thứ Sáu', '10 phím'],
      ['Space chọn ô', '+<code>aria-pressed="true"</code>'],
      ['Tab tới “Xác nhận…”, Enter', '+6 phím · về /lich-hen'],
      ['409 ⇒ focus', '+hộp <code>role="alert"</code>'],
      ['“Tuần sau” ở tuần cuối', 'chữ thường, không phải link'],
    ], { sm: true }),
    `${box('tip', 'Nút “đang chọn” dùng <code>aria-pressed</code>; ô kín là <code>&lt;span&gt;</code> (không phải nút tắt) — không có gì để Tab vào vô ích.')}
     ${box('info', 'Lưới lớn (bảng 7 ngày × 20 giờ) thì Tab từng ô là quá nhiều: dùng <strong>roving tabindex</strong> + phím mũi tên (mẫu “grid” của WAI-ARIA). 24 ô ở đây: chưa cần — đo trước đã.')}`) },

  /* 19 */ { t: '31 test mới; làm hỏng 10 chỗ, cả 10 đều bị bắt', body: two(
    t(['docNgay cũ ở trang đặt lịch         ✗ 1 failed', 'useDoiGio: onSuccess                 ✗ 2 failed', 'bỏ focus hộp lỗi                     ✗ 1 failed', 'LuoiLichTuan: bỏ chặn trùng          ✗ 3 failed', 'máy chủ: bỏ kiểm trùng giờ          ✗ 1 failed', 'useLichTuan: hỏi cả ngày đã qua      ✗ 2 failed', 'thiếu enabled theo bác sĩ            ✗ 1 failed', 'một tuần 7 ngày (thêm Chủ nhật)     ✗ 5 failed', 'bỏ “nhớ giờ cũ” (bảng nháy)          ✗ 1 failed', 'máy chủ: không mở lại giờ cũ         ✗ 1 failed', '+ 10/10 lần làm hỏng đều bị bắt'], 'do/ch10-dot-bien.mjs', 12.5),
    `${kpis([{ v: '114 → 145', l: 'test · 25 → 30 file', c: 'grn' }, { v: '96,67%', l: 'dòng · nhánh 84,23%', c: 'blu' }])}
     ${box('info', '<strong>E2E</strong> (Playwright chạy trình duyệt thật qua cả luồng) thuộc khoá Testing / Next.js Ch19. Ở đây Chromium chỉ dùng để <strong>đo</strong> và <strong>chụp</strong>.')}`) },

  /* ───── 10.4 ───── */
  /* 20 */ { t: 'vite build: ba chunk lazy mới, bundle đầu chỉ thêm 2 kB', body: two(
    t(['$ npx tsc -b && npx vite build', 'vite v8.3.1 building client environment for production...', '✓ 561 modules transformed.', 'dist/index.html                      0.63 kB', 'dist/assets/index-C1ncXCfa.css       8.91 kB', '+ dist/assets/TrangLichTuan-….js      2.10 kB', '+ dist/assets/TrangDoiGio-….js        3.82 kB', '+ dist/assets/lich-tuan-….js          9.27 kB', 'dist/assets/form-….js              116.73 kB', '! dist/assets/index-….js            364.29 kB', 'dist/assets/browser-….js           427.57 kB', '✓ built in 1.05s'], 'Chương 10', 12.5),
    `${table(['', 'sau Ch9', 'sau Ch10'], [['index-*.js', '362,32 kB', '!364,29 kB'], ['gzip', '114,96 kB', '115,70 kB'], ['chunk trang mới', '—', '+2 + 1 chung']], { sm: true })}
     ${box('tip', '<code>lich-tuan-*.js</code> là chunk CHUNG của hai trang lazy — Rolldown tự tách vì cả hai import <code>@/features/lich-tuan</code>.')}
     ${box('warn', '<code>browser-*.js</code> (427 kB) là MSW: app này chưa có backend nên bật cả ở bản build. Có API thật thì chỉ bật khi dev.')}`) },

  /* 21 */ { t: 'Mở thẳng một deep link trên máy chủ tĩnh không fallback: 404', body: `${table(['Máy chủ', '/', '/bac-si/bs-2/lich-tuan?tuan=…', '/assets/khong-co.js'], [
      ['<code>python3 -m http.server</code>', '+200', '-✗ 404', '—'],
      ['<code>vite preview</code>', '+200', '+200 (tự fallback)', '—'],
      ['nginx, không cấu hình', '+200', '-✗ 404', '—'],
      ['nginx, <code>try_files … /index.html</code> cho MỌI thứ', '+200', '+200', '!200 text/html'],
      ['nginx, <code>deploy/nginx.conf</code>', '+200', '+200', '+404 (đúng)'],
    ])}
    ${box('info', 'Bấm link trong app thì không sao (React Router đổi URL trong trình duyệt). Hỏng là khi <strong>F5</strong>, mở link được gửi, hay dán URL — máy chủ tìm FILE tên <code>/bac-si/bs-2/lich-tuan</code> và không có.')}` },

  /* 22 */ { t: 'nginx đúng: fallback cho trang, 404 thật cho assets', body: two(
    yaml([
      ['location /assets/ {', 'tên có mã băm'],
      ['  try_files $uri =404;', 'thiếu ⇒ 404 THẬT'],
      ['  add_header Cache-Control', ''],
      ['    "public, max-age=31536000, immutable";', 'cache 1 năm'],
      ['}', ''],
      ['location / {', ''],
      ['  try_files $uri /index.html;', 'SPA fallback'],
      ['  add_header Cache-Control "no-cache";', 'luôn hỏi lại'],
      ['}', ''],
    ], { fs: 14, lang: 'yaml' }),
    `${t(['$ curl -sI …/bac-si/bs-2/lich-tuan?tuan=2026-10-05', '+ Cache-Control: no-cache', '$ curl -sI …/assets/index-CnXVUOFB.js', '+ Cache-Control: public, max-age=31536000, immutable'], 'nginx 1.27 · Docker', 13)}
     ${table(['Host', 'Fallback'], [['Netlify', '<code>_redirects</code>: <code>/*  /index.html  200</code>'], ['Vercel', '<code>vercel.json</code> rewrites'], ['GitHub Pages', '<code>404.html</code> = bản chép index'], ['nginx / VPS', '<code>try_files</code> như bên trái']], { sm: true })}`) },

  /* 23 */ { t: 'Tab cũ sau deploy: trang trắng câm, sửa bằng vite:preloadError', body: two(
    `${t(['# tab mở bản A · máy chủ đã lên bản B', '# TrangLichTuan-W91lVYN9.js → TrangLichTuan-DPJvoErA.js', '! [console.error] … status of 404 (Not Found)', '!   URL: /bac-si/bs-2/lich-tuan · main trống', '', '# thêm listener vite:preloadError', '  [console.error] … status of 404 (Not Found)', '+ [TẢI LẠI TRANG] /bac-si/bs-2/lich-tuan', '+ tiêu đề: Lịch trống cả tuần (bản B) — BS. Trần Thu Hà'], 'do/ch10-tab-cu.mjs · Chromium + nginx', 12.5)}
     ${box('bad', 'React Router 8.4 NUỐT lỗi import của <code>lazy: { Component }</code> (<code>router.js</code>: <code>catch {}</code>) — không error boundary nào hiện.')}`,
    `${yaml([
      ["addEventListener('vite:preloadError', (e) => {", ''],
      ['  if (vừa tự tải lại < 10 giây) return;', 'chống lặp'],
      ['  e.preventDefault();', ''],
      ['  const dich = router.state', 'trang ĐỊNH mở'],
      ['    .navigation.location;', ''],
      ['  location.assign(dich.pathname + …);', ''],
      ['});', ''],
    ], { fs: 13, lang: 'tsx' })}
     ${anh('rx-10', 'tab-cu-tai-lai.jpg', { w: 470, h: 250, url: 'localhost/bac-si/bs-2/lich-tuan', cap: 'Tự tải lại, ra thẳng trang định mở, bản B' })}`) },

  /* 24 */ { t: 'Checklist cả khoá: mười hai dòng trước khi nộp bài', body: two(
    list(['☐ <code>npx tsc -b</code> không in gì', '☐ <code>npx vitest run</code> xanh, không cảnh báo act/MSW trong stderr', '☐ <code>npm run test:cov</code> qua ngưỡng', '☐ <code>npx vite build</code> xanh; biết chunk nào to và vì sao', '☐ mọi màn hình dữ liệu có 4 trạng thái: tải · rỗng · lỗi · có dữ liệu', '☐ lỗi 4xx/409 nói bằng lời người dùng, đặt đúng chỗ']),
    list(['☐ URL giữ được thứ người dùng muốn gửi cho nhau', '☐ axe 0 lỗi; làm hết luồng chính bằng bàn phím', '☐ Profiler: không có mount lạ, không render thừa đo được', '☐ deploy: deep link + F5 không 404; tab cũ không trắng', '☐ README: chạy thế nào, test thế nào, quyết định nào và vì sao', '☐ mỗi bug đã sửa có một test chống tái phát'])) },

  /* 25 */ { t: 'Rubric tự chấm: 100 điểm, sáu nhóm, mỗi dòng kiểm được', body: table(['Nhóm', 'Điểm', 'Được điểm đủ khi'], [
    ['Chạy đúng yêu cầu', '25', '6 câu chuyện người dùng ở slide 4 đều làm được trên bản build'],
    ['Thiết kế & cấu trúc', '15', 'cây component + bảng “state ở đâu” viết ra; features/ ↔ pages/ đúng cửa'],
    ['Dữ liệu & lỗi', '20', 'query key có hệ thống; 409/500/mất mạng đều có đường đi; không request thừa'],
    ['Test', '20', 'test theo hành vi (vai trò, nhãn); MSW; ≥ 1 test cho mỗi bug; đột biến bị bắt'],
    ['Tiếp cận & hiệu năng', '10', 'axe 0 lỗi, bàn phím đủ luồng; một phép đo Profiler có trước/sau'],
    ['Build, deploy, README', '10', 'build xanh, deep link sống, README đủ để người khác chạy lại'],
  ]) },

  /* 26 */ { t: 'Làm lại với đề của bạn: đặt phòng lab thay cho đặt lịch khám', body: two(
    table(['Phòng khám (mẫu)', 'Đề của bạn (vd LabFlow)'], [
      ['bác sĩ', 'phòng lab / thiết bị'],
      ['khung giờ 90 phút', 'ca lab (sáng/chiều/tối)'],
      ['lịch hẹn của tôi', 'lượt mượn của nhóm tôi'],
      ['đổi giờ', 'dời ca, đổi thiết bị'],
      ['409 giờ đã kín', '409 thiết bị đã có nhóm giữ'],
      ['chặn trùng giờ', 'một nhóm không giữ 2 phòng cùng ca'],
    ], { sm: true }),
    `${box('tip', 'Giữ nguyên <strong>khuôn</strong>: 5 bước thiết kế, 4 mốc có tiêu chí, rubric. Đổi <strong>dữ liệu</strong> và <strong>luật</strong> của bạn.')}
     ${box('warn', 'Viết luật trùng của đề mình TRƯỚC khi code (ai với ai thì trùng? theo người, theo nhóm, theo thiết bị?) — đó là chỗ bug nằm.')}`) },

  /* 27 */ { t: 'Sai lầm hay gặp ở Chương 10', body: cards([
    { ic: '🧩', t: 'Tái dùng hàm cũ không đọc giả định', d: '<code>docNgay</code> chỉ biết 3 ngày ⇒ “Không tìm thấy khung giờ”.', c: 'red' },
    { ic: '🔒', t: 'Chỉ chặn trùng ở client', d: 'hai tab, cache cũ ⇒ lọt. Máy chủ phải trả 409.', c: 'amb' },
    { ic: '🔄', t: 'onSuccess thay vì onSettled', d: '409 xong lưới vẫn hiện ô “Trống” đã mất.', c: 'vio' },
    { ic: '⚡', t: 'Query thiếu enabled', d: '<code>/api/bac-si//khung-gio</code>; test vẫn xanh.', c: 'pnk' },
    { ic: '🌫', t: 'Thay cả bảng bằng “Đang tải…”', d: 'mount lại mỗi lần đổi tuần, trắng 408 ms.', c: 'ora' },
    { ic: '🌐', t: 'Fallback cả /assets/', d: 'JS thiếu trả HTML 200 ⇒ lỗi MIME khó hiểu.', c: 'blu' },
  ], 3) },

  /* 28 */ { t: 'Bảng tra nhanh Chương 10', body: table(['Cần…', 'Dùng', 'Nhớ'], [
    ['N query song song, N đổi được', '<code>useQueries({ queries, combine })</code>', 'mỗi phần tử một key; combine ⇒ một object'],
    ['Query chờ dữ liệu khác', '<code>enabled: x !== null</code>', 'thiếu ⇒ gọi API với id rỗng/null'],
    ['Ghi rồi làm tươi', '<code>onSettled</code> + <code>invalidateQueries</code>', 'lỗi 409 cũng phải tải lại'],
    ['Chặn trùng', 'hàm thuần ở client + 409 ở máy chủ', 'client là trải nghiệm, máy chủ là sự thật'],
    ['Lỗi sau khi gửi', '<code>role="alert"</code> + <code>tabIndex={-1}</code> + focus', 'bỏ chọn ô vừa hỏng'],
    ['Giữ giao diện khi tải', 'nhớ giá trị lần render trước', 'keepPreviousData không qua useQueries'],
    ['Đo mount lạ', '<code>&lt;Profiler&gt;</code> + <code>--mode profiling</code>', 'pha mount/update, không chỉ ms'],
    ['Deep link', '<code>try_files $uri /index.html</code>', '<code>/assets/</code> phải 404 thật'],
    ['Cache', 'assets <code>immutable</code> · index.html <code>no-cache</code>', 'tên có mã băm mới cache lâu'],
    ['Tab cũ sau deploy', '<code>vite:preloadError</code> ⇒ tải lại', 'chống vòng lặp'],
  ], { sm: true }) },

  /* 29 */ { t: 'Tự gõ tiếp dự án: bốn mốc, 31 test mới, ba bug thật đã sửa', body: two(
    steps([
      ['Mốc 1 — luật', '<code>thoi-gian.ts</code> (+tuần), <code>tuan.ts</code>, <code>kiem-trung.ts</code> · 13 test'],
      ['Mốc 2 — xem tuần', '<code>useLichTuan</code>, <code>LuoiLichTuan</code>, <code>DieuHuongTuan</code>, route · 8 test'],
      ['Mốc 3–4 — đổi giờ', 'API + handler, <code>useDoiGio</code>, <code>TrangDoiGio</code>, nút “Đổi giờ” · 6 test'],
      ['10.3–10.4', 'bảng không nháy, enabled, axe, bàn phím · <code>nginx.conf</code>, <code>vite:preloadError</code>'],
    ]),
    t(['# điểm xuất phát: sau Chương 9 — 25 file · 114 test', '$ npx tsc -b && npx vitest run', '+  Test Files  30 passed (30)', '+       Tests  145 passed (145)', '$ npm run test:cov', '+ Lines 96.67% · Branches 84.23%', '$ bash do/ch10-spa.sh', '+ deep link 200 · /assets/khong-co.js 404'], 'tiêu chí đạt', 13)) },
]);
