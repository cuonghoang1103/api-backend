/**
 * React · Deck rx-12 — Chương 12: React 19 & concurrent.
 *
 * MỌI số liệu/output trên slide là THẬT, chạy 26/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch12
 * (chép từ ảnh chụp sau-ch08 rồi làm bốn bước của chương) — react 19.3.0 · react-dom 19.3.0 · vite 8.3.1 ·
 * typescript 6.0.3 · vitest 5.0.2 · react-router 8.4.0 · @tanstack/react-query 5.103.3 · msw 2.15.0 ·
 * babel-plugin-react-compiler 1.0.0 (+ @babel/core 7.29.7) · Chromium 149 qua Playwright (CPU chậm 4× bằng CDP).
 *   do/do-go.mjs (gõ phím, đo chữ hiện / danh sách đổi / Event Timing, trung vị 5 lần) · do/do-chi-tiet.mjs ·
 *   do/do-chromium.mjs (Profiler) · do/kiem-compiler.mjs · npx vitest run src/vi-du (bai1 · bai3 · bai4) · src/app src/features src/pages
 * Ảnh chụp giao diện: scripts/slides-src/rx-anh/rx-12/*.jpg (do/chup.mjs).
 */
import {
  S, cover, cards, box, table, two, list, mindmap, term as rxTerm, yaml, sv, R, T, A, D, anh, bars, steps, kpis,
} from './_rx-chung.mjs';

export const deck = { key: 'rx-12', code: 'REACT · CHƯƠNG 12', title: 'React 19 & concurrent', sub: 'React · Chương 12' };

const t = (lines, title, fs = 15) => rxTerm(lines, { title, dir: '~/phong-kham', fs });

/* ───────── Slide 3 — treo → fallback → thử lại ───────── */
const treo = () => {
  let s = '';
  const o = (x, w, txt, sub, c) => R(x, 20, w, 96, { c, r: 14 }) + T(x + w / 2, 60, txt, { fs: 19, b: true, a: 'middle' }) + T(x + w / 2, 92, sub, { fs: 14.5, c: 'mu', a: 'middle' });
  s += o(10, 240, 'use(promise)', 'promise còn pending', 'rx');
  s += o(290, 240, 'Component treo', 'dừng render nhánh này', 'amb');
  s += o(570, 240, '<Suspense> gần nhất', 'vẽ fallback', 'vio');
  s += o(850, 240, 'Promise xong', 'React render lại → dữ liệu', 'grn');
  s += A(254, 68, 284, 68, { c: 'mu' }) + A(534, 68, 564, 68, { c: 'mu' }) + A(814, 68, 844, 68, { c: 'mu' });
  s += `<path d="M970 120 L970 160 L130 160 L130 124" stroke="${D.dim}" stroke-width="2.5" fill="none" stroke-dasharray="8 6" marker-end="url(#m-dim)"/>`;
  s += T(550, 186, 'lỗi (rejected) ⇒ error boundary gần nhất, không phải Suspense', { fs: 15.5, c: 'mu', a: 'middle' });
  return sv(1100, 200, s);
};

/* ───────── Slide 5 — dòng thời gian hai request ───────── */
const dongThoiGian = () => {
  let s = '';
  const k = 0.55; // px / ms
  const x0 = 180;
  s += T(10, 40, 'Chương 8', { fs: 17, b: true }) + T(10, 140, 'Chương 12', { fs: 17, b: true });
  s += R(x0, 20, 807 * k, 30, { c: 'rx', r: 6 }) + T(x0 + 8, 41, 'hồ sơ 0 → 807 ms', { fs: 14 });
  s += R(x0 + 810 * k, 56, 807 * k, 30, { c: 'amb', r: 6 }) + T(x0 + 810 * k + 8, 77, 'giờ khám 810 → 1617 ms', { fs: 14 });
  s += R(x0, 120, 811 * k, 30, { c: 'rx', r: 6 }) + T(x0 + 8, 141, 'hồ sơ 0 → 811 ms', { fs: 14 });
  s += R(x0 + 7 * k, 156, 842 * k, 30, { c: 'grn', r: 6 }) + T(x0 + 15, 177, 'giờ khám 7 → 849 ms', { fs: 14 });
  s += T(x0 + 1689 * k, 105, '1689 ms', { fs: 15, b: true, c: 'amb', a: 'end' }) + T(x0 + 884 * k + 60, 205, '884 ms', { fs: 15, b: true, c: 'grn', a: 'end' });
  return sv(1120, 215, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 12 — React 19 & concurrent', sub: 'Suspense · use() · useTransition · useDeferredValue · Actions · useOptimistic · useActionState · React Compiler · Server Components', chap: 'CHƯƠNG 12' }),

  /* 2 */ { t: 'Bản đồ chương: màn hình làm gì khi một thứ CHƯA sẵn sàng', body: mindmap('Chưa sẵn sàng', 'dữ liệu · render chậm · máy chủ chưa trả lời', [
    { t: '12.1 Suspense', d: 'use(promise) · kho promise · hết thác nước', c: 'rx' },
    { t: '12.2 Transition', d: 'khẩn / không khẩn · ô tìm mất chữ', c: 'vio' },
    { t: '12.3 Actions', d: 'useOptimistic · useActionState · form action', c: 'grn' },
    { t: '12.4 Compiler + RSC', d: 'bật cho cả app · test canh · Next.js', c: 'amb' },
    { t: '🛠 Dự án', d: 'hồ sơ · ô tìm · huỷ lịch + góp ý · compiler', c: 'tea' },
  ]) },

  /* ───── 12.1 ───── */
  /* 3 */ { t: 'Suspense: chưa có dữ liệu thì treo, ranh giới vẽ fallback', body: `${treo()}
    ${two(
      box('bad', '<strong>Chuỗi if:</strong> <code>if (isPending) return …</code> ở MỌI component đọc dữ liệu; phần bên dưới chưa được vẽ nên cũng chưa tải.'),
      box('good', '<strong>Suspense:</strong> component chỉ viết đường “có dữ liệu”; cha đặt MỘT <code>fallback</code> cho cả vùng; các vùng độc lập tải song song.'))}` },

  /* 4 */ { t: 'use() cần CÙNG promise — tạo trong render: 63 request', body: two(
    `${yaml([
      ['function HoSoSai({ id }) {', ''],
      ['  const bs = use(api.bacSi(id));', '✗ promise MỚI mỗi lần'],
      ['}', ''],
      ['', ''],
      ['const kho = new Map<string, Promise<BacSi>>();', '✓ sống ngoài render'],
      ['const bs = use(taiBacSi(id));', 'cùng id ⇒ cùng promise'],
      ['', ''],
      ['const { data } = useSuspenseQuery(q);', '💼 đi làm: thư viện lo'],
    ], { fs: 14.5 })}`,
    `${t(['! [HoSoSai] sau 500 ms: vẫn "Đang tải…"', '!   63 request /api/bac-si/bs-2', '+ [HoSoDung] thấy hồ sơ · 1 request', '+ [HoSoTanStack] thấy hồ sơ · 1 request'], 'vitest · src/vi-du/bai1.test.tsx', 13.5)}
     ${box('warn', 'Không có cảnh báo nào (<code>console.error: 0</code>). Component treo trước lần commit đầu không để lại gì ⇒ mỗi lần thử lại là một lần gọi API mới. Compiler bật: 72 request.')}`) },

  /* 5 */ { t: 'Trang cũ tải nối đuôi: giờ khám chờ hồ sơ 807 ms', body: `${dongThoiGian()}
    ${two(
      table(['Chromium, API 800 ms', 'Ch8', 'Ch12'], [
        ['Thấy hồ sơ', '881 ms', '856 ms'],
        ['Thấy giờ khám', '!1689 ms', '+884 ms'],
        ['Request giờ khám bắt đầu', '!810 ms', '+7 ms'],
      ], { sm: true }),
      box('info', 'Không request nào nhanh hơn. Chỉ là <code>ChonKhungGio</code> thôi phải chờ trang <code>return</code> sớm: nó nằm <strong>ngoài</strong> <code>&lt;Suspense&gt;</code> của hồ sơ nên được vẽ — và tải — ngay.'))}` },

  /* 6 */ { t: 'Màn hình thật: hồ sơ còn treo, giờ khám đã hiện', body: two(
    anh('rx-12', 'ho-so-dang-tai.jpg', { w: 600, url: 'localhost:4173/bac-si/bs-2?tre-ho-so=vo-han', cap: 'Khung xương cùng khung với hồ sơ thật ⇒ không nhảy trang' }),
    `${yaml([
      ['<RanhGioiLoi key={id} thayThe={…404} …>', 'lỗi của cả hai'],
      ['  <Suspense fallback={<HoSoBacSiKhung />}>', ''],
      ['    <HoSoBacSi id={id} />', 'use(layHua(…)) — treo'],
      ['  </Suspense>', ''],
      ['  <ChonKhungGio bacSiId={id} />', 'ANH EM, tải ngay'],
      ['</RanhGioiLoi>', ''],
    ], { fs: 13.5 })}
     ${box('tip', '<code>layHua</code>: một <code>Map</code> promise cho mỗi <code>QueryClient</code> (WeakMap), dựng trên <code>ensureQueryData</code> ⇒ dữ liệu vào luôn cache TanStack.')}`) },

  /* 7 */ { t: 'Promise lỗi tới error boundary: 404 riêng, 500 thử lại', body: two(
    `${yaml([
      ['render() {', 'RanhGioiLoi (Chương 7)'],
      ['  if (this.state.loi) {', ''],
      ['    const rieng = this.props.thayThe?.(loi);', 'Chương 12: màn riêng'],
      ['    if (rieng) return rieng;', '404 ⇒ “Không có bác sĩ này”'],
      ['    return <hộp lỗi + “Tải lại phần này”>;', '500 ⇒ onThuLai'],
      ['  }', ''],
      ['}', ''],
    ], { fs: 14 })}`,
    `${box('warn', 'Promise hỏng thì hỏng <strong>mãi</strong>. “Thử lại” phải <code>quenHua(…)</code> trước, nếu không <code>use()</code> đọc lại đúng promise đó và ném lỗi ngay.')}
     ${box('bad', 'Đừng tự xoá promise hỏng khỏi kho: boundary thử lại ⇒ kho trống ⇒ request mới ⇒ hỏng ⇒ … Một lỗi 404 nện máy chủ mãi.')}
     ${box('info', '<code>use</code> không phải hook thường: gọi được sau <code>return</code> sớm, trong <code>if</code> — cả với promise lẫn context.')}`) },

  /* 8 */ { t: 'Test: treo trong act() đồng bộ là fallback đứng mãi', body: two(
    `${t(['! [veTrang (render thường)] sau 1,5 giây:', '!   vẫn "Đang tải thông tin bác sĩ…" · ô giờ khám: 0', '  console.error: A component suspended inside', '  an `act` scope, but the `act` call was not awaited.', '+ [veTrangCho (await act)] sau 1,5 giây:', '+   thấy hồ sơ · ô giờ khám: 4'], 'vitest · src/vi-du/bai1.test.tsx', 13)}
     ${box('info', '6 test cũ (Chương 7–8) hỏng vì hết giờ ngay khi trang dùng <code>use()</code> — trình duyệt thật vẫn đúng.')}`,
    `${yaml([
      ['export async function veTrangCho(url) {', 'src/test/render.tsx'],
      ['  let kq;', ''],
      ['  await act(async () => {', 'act PHẢI được await'],
      ['    kq = veTrang(url);', ''],
      ['  });', ''],
      ['  return kq;', ''],
      ['}', ''],
      ['await act(async () => user.click(xem));', 'click làm trang treo'],
    ], { fs: 14 })}`) },

  /* ───── 12.2 ───── */
  /* 9 */ { t: 'Mỗi phím hai việc: chữ trong ô khẩn, danh sách thì không', body: two(
    list([
      '<strong>Khẩn:</strong> chữ trong ô, cú bấm, bật/tắt — người dùng thấy trễ trên ~50–100 ms.',
      '<strong>Không khẩn (transition):</strong> danh sách 1000 thẻ, biểu đồ, bản xem trước — hiện kết quả của “hu” khi đã gõ “huy” cũng được.',
      '<strong>Concurrent rendering:</strong> React render transition ở nền theo lát ~5 ms, nhường trình duyệt vẽ, vứt bản dở nếu có phím mới.',
      'Không làm render <em>nhanh hơn</em> — chỉ đổi <em>thứ tự ưu tiên</em>.',
    ]),
    `${t(['[thuong] Backspace 2: chữ hiện sau 49 ms · ET 64 ms', '+ [chuyen] Backspace 2: chữ hiện sau 3 ms', '+          danh sách đổi sau 60 ms · ET 16 ms', '+ [tre]    Backspace 2: chữ hiện sau 3 ms', '+          danh sách đổi sau 59 ms · ET 0 ms'], 'Chromium · CPU 4× · 1000 thẻ memo · trung vị 5 lần', 13)}`) },

  /* 10 */ { t: 'Ô tìm Chương 8 mất chữ: "nguyen" thành "nuyen" 4/5 lần', body: two(
    `${t(['[trước · Ch8 (value từ URL)] CPU 4× · 1000 bác sĩ', '  gõ nguyen, mỗi phím cách 30 ms · trung vị 5 lần', '  phím "n": chữ hiện sau 93 ms · danh sách 93 ms', '  phím "g": chữ hiện sau 73 ms', '! ô tìm cuối cùng: "nuyen" "nuyen" "nuyen"', '!                 "nguyen" "nuyen"'], 'Chromium · do/do-go.mjs', 13)}`,
    `${yaml([
      ['<input value={tuKhoa}', 'thẳng từ ?q='],
      ['  onChange={(e) =>', ''],
      ['    onDoi(e.target.value)}', 'setSearchParams (replace)'],
      ['/>', ''],
    ], { fs: 15 })}
     ${box('bad', 'Không ai viết <code>startTransition</code>. Với 6 bác sĩ không bao giờ lộ; với 1000 bác sĩ lộ phần lớn các lần.')}
     ${box('info', 'Chữ hiện ĐÚNG lúc danh sách đổi (hai cột cùng số): tới 138 ms cho một lần Backspace.')}`) },

  /* 11 */ { t: 'Thủ phạm: Router bọc mọi lần đổi URL trong transition', body: two(
    `${yaml([
      ['// react-router 8.4.0 · lib/components.js', ''],
      ['if (reactDomFlushSyncImpl && flushSync)', 'chỉ khi xin flushSync'],
      ['  reactDomFlushSyncImpl(() => setStateImpl(s));', ''],
      ['else if (useTransitions === false)', ''],
      ['  setStateImpl(s);', ''],
      ['else React.startTransition(() => {', 'MẶC ĐỊNH'],
      ['  setStateImpl(s);', ''],
      ['});', ''],
    ], { fs: 13.5 })}`,
    `${box('warn', 'Ô input có <code>value</code> là URL = ô input bị <strong>transition</strong> điều khiển. React trả ô về giá trị đã commit tới khi transition xong; phím bấm giữa chừng bị nối vào chữ cũ.')}
     ${t(['[chuyen-sai] CPU 6× · phím cách 10 ms', '! "nuyen" "nuyen" "nuyen" "en" "nuyen"', '+ [tre]    "nguyen" × 5', '+ [thuong] "nguyen" × 5'], 'bản thí nghiệm riêng · src/vi-du/bai2.tsx', 13)}`) },

  /* 12 */ { t: 'flushSync hết mất chữ nhưng chặn phím tới 152 ms', body: two(
    bars([
      { l: 'Ch8 · phím nặng nhất', sub: 'Event Timing', v: 40, txt: '40 ms (nhưng mất chữ)', c: 'amb' },
      { l: 'flushSync · phím nặng nhất', sub: 'Event Timing', v: 152, txt: '152 ms', c: 'red' },
      { l: 'flushSync · chữ hiện chậm nhất', v: 122, txt: '122 ms', c: 'red' },
    ], { lw: 270, max: 160 }),
    `${t(['[jsdom · flushSync + useDeferredValue · gõ "h"]', 'lần commit KHẨN (danh sách không chạy):', '! thẻ CÓ link "Xem chi tiết" → 21.9 ms', '+ thẻ KHÔNG link              → 0.5 ms'], 'vì sao useDeferredValue không cứu', 13)}
     ${box('info', 'URL đổi ⇒ context vị trí của router đổi ⇒ <strong>1000 <code>&lt;Link&gt;</code></strong> render lại, xuyên qua <code>memo</code>. Context không hỏi props.')}`) },

  /* 13 */ { t: 'useTransition hay useDeferredValue: khác chỗ đặt', body: two(
    table(['', 'useTransition', 'useDeferredValue'], [
      ['Viết', '<code>startTransition(() =&gt; setX(v))</code>', '<code>const xTre = useDeferredValue(x)</code>'],
      ['Khi', 'bạn gọi hàm set', 'giá trị đến từ prop / URL / store'],
      ['Cờ đang làm', '<code>isPending</code>', '<code>x !== xTre</code>'],
      ['Nhận', 'hàm async (Action)', 'giá trị ban đầu'],
      ['Cần', 'phần chậm memo được', 'phần chậm memo được'],
    ], { sm: true }),
    `${box('bad', '<strong>Không bao giờ</strong> đưa giá trị của chính ô input vào transition.')}
     ${box('tip', 'Debounce vẫn đúng khi mỗi phím <strong>gọi API</strong>. Hoãn render không giảm số request.')}
     ${box('info', 'Không có <code>memo</code> trên phần chậm ⇒ lần render khẩn vẫn vẽ lại nó ⇒ hai hook vô dụng.')}`) },

  /* 14 */ { t: 'Ô tìm có state riêng: chữ hiện trong 15 ms', body: two(
    `${table(['CPU 4× · 1000 bác sĩ', 'Ch8', 'flushSync', 'State riêng'], [
      ['"nguyen" gõ nhanh', '-"nuyen" 4/5', '+5/5', '+5/5'],
      ['Chữ hiện chậm nhất', '!138 ms', '!122 ms', '+15 ms'],
      ['Event Timing nặng nhất', '40 ms', '!152 ms', '+40 ms'],
      ['Danh sách đổi (phím nặng)', '138 ms', '122 ms', '145 ms'],
    ], { sm: true })}
     ${box('info', 'Danh sách KHÔNG nhanh hơn — chỉ là không ai phải chờ nó. Làm nó rẻ đi: virtualization, Chương 13.')}`,
    `${yaml([
      ['const [go, setGo] = useState(tuKhoa);', 'chữ của ô: KHẨN'],
      ['const loai = useNavigationType();', ''],
      ['if (tuKhoa !== tuKhoaDaThay) {', 'URL vừa đổi'],
      ['  setTuKhoaDaThay(tuKhoa);', ''],
      ["  if (loai !== 'REPLACE') setGo(tuKhoa);", 'Back / menu ⇒ theo URL'],
      ['}', ''],
      ['onChange: setGo(v); onDoi(v);', 'URL + danh sách: transition'],
    ], { fs: 13.5 })}`) },

  /* 15 */ { t: 'Màn hình thật: chữ hiện trước, danh sách theo sau', body: two(
    anh('rx-12', 'go-dang-loc.jpg', { w: 620, url: 'localhost:4173/bac-si?nhieu=1000 · vừa gõ "h"', cap: 'CPU chậm 40× chỉ để kịp chụp khoảnh khắc' }),
    `${list([
      '“Đang lọc…” hiện khi <code>go !== tuKhoa</code> — ô đi trước URL.',
      'Nó mang <code>aria-hidden</code>: nhấp nháy mỗi phím, là tiếng ồn với trình đọc màn hình.',
      '<code>useTransition</code> đâu? Trong React Router — việc của ta là kéo ô input <strong>ra khỏi</strong> transition đó.',
    ])}
     ${t(['[cuối Ch12 · compiler bật]', '+ ô tìm cuối cùng (5 lần): "nguyen" × 5'], 'do/do-go.mjs', 13.5)}`) },

  /* ───── 12.3 ───── */
  /* 16 */ { t: 'Action: hàm async trong transition, isPending tự có', body: two(
    list([
      '<code>startTransition(async () =&gt; { … })</code> — dạng tổng quát (React 19 nhận hàm async).',
      '<code>&lt;form action={fn}&gt;</code> — React gọi <code>fn(formData)</code> như một Action.',
      '<code>useActionState(fn, banDau)</code> — giá trị <code>fn</code> trả về thành state.',
      '<code>isPending</code> đúng suốt mọi <code>await</code>, không chỉ lúc render.',
    ]),
    `${box('warn', 'Lỗi thoát khỏi Action ⇒ ném lại lúc render ⇒ <strong>error boundary</strong> gần nhất. Bắt bằng <code>try/catch</code> và trả về làm state / thông báo.')}
     ${box('info', 'Chương 6 đã có <code>useMutation</code> + <code>isPending</code>. Action là cùng ý tưởng, nhưng của chính React — dùng được không cần thư viện, và là mô hình gốc của Server Actions.')}`) },

  /* 17 */ { t: 'useOptimistic: "Đã huỷ" ngay, tự quay về khi xong', body: two(
    `${yaml([
      ['const [hienThi, danhDauHuy] =', ''],
      ['  useOptimistic(lichHen, (ds, id) => …);', 'lớp lạc quan'],
      ['const [dangLuu, start] = useTransition();', ''],
      ['start(async () => {', 'Action'],
      ['  danhDauHuy(lh.id);', '“Đã huỷ” NGAY'],
      ['  try { await huy.mutateAsync(lh); }', 'chờ PATCH + tải lại'],
      ['  catch {}', 'MutationCache đã báo'],
      ['});', 'hết Action ⇒ bỏ lớp lạc quan'],
    ], { fs: 13.5 })}`,
    `${t(['✓ bấm Huỷ ⇒ "Đã huỷ" + "Đang lưu…" NGAY, trước', '  khi máy chủ trả lời; máy chủ xong ⇒ hết "Đang lưu…"', '✓ máy chủ lỗi 500 ⇒ tự quay về "Chờ xác nhận",', '  báo "đã hoàn tác", trang KHÔNG sập'], 'vitest · DanhSachLichHen.test.tsx', 13)}
     ${box('bad', 'Quên <code>await</code> (<code>huy.mutate(lh)</code>): Action xong ngay ⇒ “Đã huỷ” biến mất trước khi máy chủ trả lời — cả hai test đỏ.')}`) },

  /* 18 */ { t: 'Từ onMutate + hoàn tác tay sang useOptimistic', body: two(
    table(['', 'Ch6: onMutate', 'Ch12: useOptimistic'], [
      ['Giá trị lạc quan', 'trong cache chung', 'trong 1 component, lúc Action chạy'],
      ['Hoàn tác khi lỗi', '-tự làm (onError)', '+tự động'],
      ['Đua với lần tải đang bay', '-cancelQueries', '+không cần'],
      ['Header (đọc cache)', '+thấy ngay', '-thấy sau khi tải lại'],
      ['Số dòng', '≈ 15 dòng trong mutation', '≈ 3 dòng trong component'],
    ], { sm: true }),
    `${box('tip', 'Nhiều nơi phải cùng thấy giá trị lạc quan ⇒ giữ cách cache. Chỉ một danh sách quan tâm ⇒ <code>useOptimistic</code> ngắn hơn và không thể quên hoàn tác.')}
     ${box('warn', 'Gọi hàm set lạc quan NGOÀI Action: “An optimistic state update occurred outside a transition or action.”')}`) },

  /* 19 */ { t: 'form action + useActionState: trả về là state mới', body: two(
    `${yaml([
      ['async function guiGopY(truoc, formData) {', ''],
      ["  const noiDung = formData.get('noiDung');", 'ô có name'],
      ["  if (ngắn) return { ketQua: 'loi-nhap', giaTri };", 'giữ chữ'],
      ['  try { await api.guiGopY(…);', ''],
      ["    return { ketQua: 'da-gui', giaTri: TRONG }; }", ''],
      ["  catch { return { ketQua: 'loi-may-chu', … }; }", 'đừng ném'],
      ['}', ''],
      ['const [tt, formAction] = useActionState(guiGopY, BAN_DAU);', ''],
      ['<form action={formAction}>…<NutGui /></form>', ''],
    ], { fs: 13 })}`,
    `${yaml([
      ['function NutGui() {', 'CON của form'],
      ['  const { pending } = useFormStatus();', 'react-dom'],
      ['  return <button disabled={pending}>', ''],
      ["    {pending ? 'Đang gửi…' : 'Gửi góp ý'}", ''],
      ['  </button>;', ''],
      ['}', ''],
    ], { fs: 14 })}
     ${box('bad', '<code>useFormStatus</code> ở chính component vẽ <code>&lt;form&gt;</code>: đo thật, chữ trên nút không bao giờ đổi.')}`) },

  /* 20 */ { t: 'Form tự reset sau Action: giữ chữ bằng defaultValue', body: two(
    anh('rx-12', 'gop-y-loi.jpg', { w: 560, url: 'localhost:4173/lich-hen · gửi "Tốt"', cap: 'Chữ còn, aria-invalid, lỗi gắn bằng aria-describedby' }),
    `${t(['! [FormMatChu (không defaultValue)]', '!   ô góp ý = ""', '+ [FormGopY (defaultValue từ state)]', '+   ô góp ý = "Tốt"', '+ [FormKieuCu (value + onSubmit)]', '+   ô góp ý = "Tốt"'], 'vitest · src/vi-du/bai3.test.tsx', 13.5)}
     ${box('tip', 'Action trả về <code>giaTri</code> đã gõ; ô dùng <code>defaultValue={giaTri.noiDung}</code> ⇒ React vẽ giá trị mặc định mới rồi mới reset về nó.')}`) },

  /* 21 */ { t: 'Ba bẫy của Action, đo thật', body: cards([
    { ic: '💥', t: 'Ném lỗi ra khỏi Action', d: 'đo được: màn hình thành “Phần này gặp sự cố. Không huỷ được lịch hẹn”. Bắt và trả về làm state.', c: 'red' },
    { ic: '⏱', t: 'Lạc quan ngoài Action', d: '“An optimistic state update occurred outside a transition or action.” Đặt nó trong <code>startTransition</code>.', c: 'amb' },
    { ic: '🔘', t: 'useFormStatus ở component vẽ form', d: 'nó đọc form CHA ⇒ <code>pending</code> luôn false. Tách nút thành component con.', c: 'vio' },
  ], 3) },

  /* ───── 12.4 ───── */
  /* 22 */ { t: 'Bật compiler cho cả app: cả 32 component được biên dịch', body: two(
    `${yaml([
      ['// vite.config.ts', ''],
      ['plugins: [', ''],
      ['  react(),', ''],
      ['  babel({ presets: [reactCompilerPreset()] }),', 'Chương 12'],
      [']', '@babel/core 7 — KHÔNG phải 8'],
    ], { fs: 15 })}
     ${box('info', 'Dev, <code>vite build</code> và Vitest đều chạy code đã biên dịch. Cả bộ test vẫn xanh.')}`,
    `${t(['$ node do/kiem-compiler.mjs src/**/*.tsx', '+ app/Header.tsx · Header: ĐÃ biên dịch (19 ô nhớ)', '+ features/bac-si/components/OTimBacSi.tsx', '+   · OTimBacSi: ĐÃ biên dịch (11 ô nhớ)', '+ features/gop-y/FormGopY.tsx · FormGopY: ĐÃ … (27)', '+ features/lich-hen/DanhSachLichHen.tsx … (19)', '  … 32/32 · RanhGioiLoi (class) không thuộc diện'], 'logger · compiler 1.0.0', 12.5)}`) },

  /* 23 */ { t: 'Compiler + memo tay: ♡ 1,8 → 1,2 ms; bỏ memo: 7,1 ms', body: two(
    table(['Chromium, CPU 4×', 'Không compiler', 'Compiler + memo', 'Compiler, bỏ memo'], [
      ['♡ · 200 bác sĩ', '1,8 ms', '+1,2 ms', '2,1 ms'],
      ['♡ · 1000 bác sĩ', '4,5 ms', '+4,2 ms', '!7,1 ms'],
      ['gõ “h” · 1000', '36,6 ms', '+27,6 ms', '32,9 ms'],
    ], { sm: true }),
    `${box('info', 'Compiler thêm được một chút trên nền memo tay tốt. <code>memo(TheBacSi)</code> vẫn ở lại: không có nó, danh sách vẫn gọi 1000 hàm thẻ mỗi cú bấm.')}
     ${box('tip', 'Mọi số đều dưới 16,7 ms (một khung hình 60 Hz). Thứ làm app nhanh là đo và sửa đúng chỗ (8.2, 12.2), không phải compiler.')}`) },

  /* 24 */ { t: 'Cái giá: build chậm 4,7 lần, thêm 5,2 kB JavaScript', body: `${kpis([
      { v: '160 → 740', l: 'ms — vite build (3 lần mỗi bên)', c: 'amb' },
      { v: '+5,2 kB', l: 'JS (+3,3 kB gzip)', c: 'amb' },
      { v: '6,36 → 7,13', l: 's — cả bộ Vitest', c: 'amb' },
    ])}
    ${two(
      t(['# không compiler', 'index-wUoNGbUe.js     366.04 kB │ gzip: 115.01 kB', '# compiler', 'compiler-runtime-….js   8.94 kB │ gzip:   3.36 kB', 'index-C8rXKKJm.js     362.32 kB │ gzip: 114.96 kB'], 'npx vite build', 13),
      box('info', '<code>compiler-runtime</code> là chunk dùng chung Rolldown tách ra (phần code chung của React + hàm trợ giúp của compiler). Cộng lại: 371,26 so với 366,04 kB.'))}` },

  /* 25 */ { t: 'Một test canh compiler: một dòng soLanVe++ là test đỏ', body: two(
    `${yaml([
      ['for (const f of cacFile) transformSync(…, {', 'mọi .tsx trong src/'],
      ["  plugins: [['babel-plugin-react-compiler',", ''],
      ['    { logger: { logEvent: (_, e) => {', ''],
      ["      if (e.kind === 'CompileError' …)", ''],
      ['        boQua.push(`${f} · ${lý do}`);', ''],
      ['    } } }]],', ''],
      ['});', ''],
      ['expect(boQua).toEqual([]);', 'npm run kiem:compiler'],
    ], { fs: 13.5 })}`,
    `${t(['# TrangChu: let soLanVe = 0; … soLanVe++', '! × mọi component .tsx trong src/ đều được', '!   compiler biên dịch', '+   "src/pages/TrangChu.tsx · CompileError:', '+   (BuildHIR::lowerExpression) Support', '+   UpdateExpression where argument is a global"'], 'vitest · src/app/compiler.test.ts', 13)}
     ${box('warn', 'Compiler gặp code phạm Rules of React thì <strong>để nguyên, không báo</strong>. Build xanh, app chạy, chỉ chậm hơn.')}`) },

  /* 26 */ { t: 'Server Components chạy ở máy chủ — cần framework', body: two(
    `${table(['', 'Khoá này (Vite SPA)', 'Next.js App Router'], [
      ['Component chạy', 'trình duyệt', 'máy chủ; <code>\'use client\'</code> ⇒ trình duyệt'],
      ['Đọc dữ liệu', 'TanStack Query, <code>use()</code>', '<code>await</code> trong component'],
      ['Gửi form', 'form action + API', 'form action + Server Action'],
      ['JS gửi xuống', 'mọi component', 'chỉ Client Components'],
    ], { sm: true })}
     ${box('tip', 'Học tiếp: khoá <strong>Next.js</strong>, Chương 9–12 (Server/Client Component, lấy dữ liệu & cache, định tuyến, Server Actions).')}`,
    `${t(['# component async trong app Vite (client)', '! sau 500 ms: "Đang tải…" · 68 request', '  console.error: <HoSoKieuServer> is an async', '  Client Component. Only Server Components', '  can be async at the moment.'], 'vitest · src/vi-du/bai4.test.tsx', 13)}
     ${box('info', '<code>\'use client\'</code> ở đầu file trong app Vite chỉ là một chuỗi — không có phía máy chủ nào để tách ra.')}`) },

  /* 27 */ { t: 'Sai lầm hay gặp ở Chương 12', body: cards([
    { ic: '♾️', t: 'use(api.x()) trong render', d: 'promise mới mỗi lần ⇒ treo mãi, 63 request / 0,5 s. Dùng kho / useSuspenseQuery.', c: 'red' },
    { ic: '🪜', t: 'Để phần độc lập trong cùng Suspense', d: 'lại thác nước: giờ khám chờ hồ sơ. Đặt nó làm anh em.', c: 'amb' },
    { ic: '⌨️', t: 'Ô input trong transition', d: 'kể cả gián tiếp qua URL của Router ⇒ mất chữ. Chữ của ô luôn khẩn.', c: 'vio' },
    { ic: '🧪', t: 'Render trang treo trong act() thường', d: 'fallback đứng mãi trong test. await act(async …).', c: 'pnk' },
    { ic: '🔁', t: 'Action không await / ném lỗi', d: 'lạc quan biến mất ngay / error boundary chiếm chỗ.', c: 'ora' },
    { ic: '🤖', t: 'Tin compiler đã chạy', d: 'nó bỏ qua trong im lặng. Test logger + đo Profiler.', c: 'blu' },
  ], 3) },

  /* 28 */ { t: 'Bảng tra nhanh Chương 12', body: table(['Cần…', 'Dùng', 'Nhớ'], [
    ['Đọc dữ liệu, không chuỗi if', '<code>use(promise)</code> / <code>useSuspenseQuery</code> + <code>&lt;Suspense&gt;</code>', 'CÙNG promise mỗi render'],
    ['Lỗi khi đọc dữ liệu', 'error boundary quanh vùng', 'thử lại: quên promise hỏng'],
    ['Test trang có Suspense', '<code>await act(async …)</code>', 'act đồng bộ ⇒ treo mãi'],
    ['Việc chậm do mình set', '<code>useTransition</code>', '<code>isPending</code>; phần chậm memo'],
    ['Giá trị đến từ ngoài', '<code>useDeferredValue</code>', '<code>x !== xTre</code> = đang cũ'],
    ['Ô input', 'state thường, luôn khẩn', 'không bao giờ trong transition'],
    ['Hiện kết quả trước máy chủ', '<code>useOptimistic</code> trong Action', 'await tới khi dữ liệu thật về'],
    ['Form gửi rồi hiện kết quả', '<code>&lt;form action&gt;</code> + <code>useActionState</code>', 'reset sau Action: defaultValue từ state'],
    ['Nút biết form đang gửi', '<code>useFormStatus</code> (react-dom)', 'phải là CON của form'],
    ['Memo tự động', 'React Compiler + test logger', 'Babel 7; đo trước/sau'],
  ], { sm: true }) },

  /* 29 */ { t: 'Tự gõ tiếp dự án: bốn bước, 14 test tiêu chí xanh', body: two(
    steps([
      ['12.1 — Suspense', '<code>HoSoBacSi</code> đọc <code>use(layHua(…))</code>, giờ khám tải song song, <code>veTrangCho</code>'],
      ['12.2 — ô tìm', 'state riêng cho ô, theo URL khi PUSH/POP, “Đang lọc…”'],
      ['12.3 — Actions', 'huỷ lịch <code>useOptimistic</code>, <code>FormGopY</code> + <code>POST /api/gop-y</code>'],
      ['12.4 — compiler', 'bật trong <code>vite.config.ts</code>, <code>compiler.test.ts</code>, <code>kiem:compiler</code>'],
    ]),
    `${t(['# trước từng bước (tiêu chí của bước đó):', '! 12.1  Tests  3 failed (3)', '! 12.2  Tests  1 failed | 2 passed (3)', '! 12.3  Tests  4 failed | 1 passed (5)', '! 12.4  Tests  1 failed | 1 passed (2)', '# xong cả bốn bước:', '$ npx tsc -b && npx vitest run', '+  Test Files  10 passed (10)', '+       Tests  45 passed (45)'], 'tiêu chí đạt', 13)}`) },
]);
