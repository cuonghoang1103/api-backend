/**
 * React · Deck rx-04 — Chương 4: Effect.
 *
 * MỌI output trên slide là THẬT, chạy 25/09/2026 trên máy dựng bài, dự án thử `phong-kham` (bản sau Chương 3 + phần Chương 4)
 * (react 19.3.0 · vite 8.3.1 · typescript 6.0.3 · vitest 5.0.1 · @testing-library/react 16.3.3 · oxlint 1.85.0):
 *   npx vitest run --reporter=verbose (src/vi-du/b1..b3.test.tsx: thứ tự effect/cleanup, StrictMode, ba dạng dependency,
 *   đồng hồ thiếu cleanup, dữ liệu dẫn xuất, reset bằng key, gửi trong effect, cuộc đua, dependency hàm, closure cũ,
 *   useEffectEvent; src/hooks/*.test.ts; src/components/*.test.tsx)
 *   npx oxlint (exhaustive-deps, set-state-in-effect, rules-of-hooks)
 *   Chromium thật (Playwright): console của StrictMode, vòng lặp vô hạn đếm theo giây, bản nháp sau khi tải lại trang.
 * Ảnh chụp giao diện thật: rx-anh/rx-04/*.jpg (scripts/rx-chup.mjs + một script chụp riêng cho bản nháp).
 */
import { S, cover, cards, box, table, vs, two, list, mindmap, term as rxTerm, yaml, diagram, compTree, renderFlow, anh, bars, sv, R, T, A } from './_rx-chung.mjs';

export const deck = { key: 'rx-04', code: 'REACT · CHƯƠNG 4', title: 'Effect', sub: 'React · Chương 4' };

const t = (lines, title, fs = 15) => rxTerm(lines, { title, dir: '~/phong-kham', fs });

/* ───────────── Slide 6 — dòng thời gian setup / cleanup ───────────── */
const dongThoiGian = () => {
  let s = '';
  const y0 = 40;
  s += A(20, y0, 1140, y0, { c: 'mu', sw: 2 });
  const moc = [
    [60, 'hiện lần đầu', 'rx'], [330, 'ten đổi: An → Hà', 'amb'], [640, 'vẽ lại, ten KHÔNG đổi', 'dim'], [900, 'gỡ component', 'red'],
  ];
  moc.forEach(([x, chu, c]) => { s += R(x - 6, y0 - 6, 12, 12, { c, fill: c === 'dim' ? '#6b7a93' : '#149eca', r: 6 }) + T(x, y0 - 14, chu, { fs: 16, b: true, c: c === 'dim' ? 'mu' : '#e6edf3' }); });
  const hop = (x, y, w, chu, c) => R(x, y, w, 44, { c, fill: '#0f182a', r: 9 }) + T(x + 12, y + 28, chu, { fs: 15, mono: true });
  s += hop(40, 62, 250, 'setup(An)', 'grn');
  s += hop(310, 62, 150, 'cleanup(An)', 'ora') + hop(470, 62, 150, 'setup(Hà)', 'grn');
  s += T(640, 90, '(không chạy gì)', { fs: 15, c: 'mu' });
  s += hop(880, 62, 170, 'cleanup(Hà)', 'ora');
  s += T(0, 142, 'Đổi dependency ⇒ cleanup của lượt TRƯỚC (đọc giá trị cũ: An) chạy rồi mới setup lượt mới. Không đổi ⇒ bỏ qua cả hai.', { fs: 16, c: 'amb', b: true });
  return sv(1160, 152, s);
};

/* ───────────── Slide 13 — cuộc đua khi tải dữ liệu ───────────── */
const cuocDua = () => {
  let s = '';
  const px = (ms) => 120 + ms * 1.0;
  s += A(120, 250, 1120, 250, { c: 'mu', sw: 2 });
  [0, 100, 300, 500, 700, 900].forEach((ms) => { s += T(px(ms), 274, `${ms} ms`, { fs: 13, c: 'mu', a: 'middle', mono: true }); });
  s += T(0, 70, 'bs-1', { fs: 17, b: true, mono: true }) + T(0, 150, 'bs-2', { fs: 17, b: true, mono: true });
  s += R(px(0), 45, 900, 40, { c: 'red', fill: 'rgba(255,92,108,.12)', r: 8 }) + T(px(10), 71, 'yêu cầu bs-1 (chậm 900 ms) — về SAU CÙNG', { fs: 15 });
  s += R(px(5), 125, 100, 40, { c: 'grn', fill: 'rgba(63,185,80,.14)', r: 8 }) + T(px(115), 151, '← bs-2 về sau 100 ms, hiện đúng "Trần Thu Hà"', { fs: 15 });
  s += A(px(900), 90, px(900), 205, { c: 'red' }) + T(px(900) - 10, 228, 'ghi đè thành "Nguyễn Minh An" ✗', { fs: 15, c: 'red', a: 'end', b: true });
  s += R(0, 300, 1160, 120, { c: 'amb', fill: 'rgba(255,194,51,.06)' });
  s += T(20, 334, 'Test thật: id hiện tại = bs-2 · không cờ bỏ qua: "Đang xem: BS. Nguyễn Minh An" · có cờ: "Đang xem: BS. Trần Thu Hà"', { fs: 16, b: true, c: 'amb' });
  s += T(20, 368, 'Sửa tối thiểu: let boQua = false; … if (!boQua) setTen(kq); … return () => { boQua = true; }', { fs: 16, mono: true });
  s += T(20, 402, 'Sửa ở công ty: đừng tự fetch trong effect — Chương 6 dùng TanStack Query (cache, huỷ, thử lại, không đua).', { fs: 16 });
  return sv(1160, 425, s);
};

/* ───────────── Slide 18 — closure cũ ───────────── */
const closureCu = () => {
  let s = '';
  const o = (x, y, w, h, tieuDe, dong, c) => R(x, y, w, h, { c, fill: '#0f182a', r: 10 }) + T(x + 14, y + 28, tieuDe, { fs: 16, b: true }) +
    dong.map((d, i) => T(x + 14, y + 56 + i * 26, d, { fs: 15, mono: true, c: '#cfd9e8' })).join('');
  s += o(0, 0, 360, 150, 'Lượt render #1 (giay = 0)', ['effect [] tạo interval', 'hàm: setGiay(0 + 1)', 'giữ giay = 0 MÃI MÃI'], 'red');
  s += o(400, 0, 360, 150, 'Lượt render #2 (giay = 1)', ['effect [] KHÔNG chạy lại', 'interval của #1 còn chạy', '⇒ lại setGiay(0 + 1)'], 'dim');
  s += o(800, 0, 360, 150, '5 giây sau', ['Cũ: 1 giây  ✗', 'Mới: 5 giây ✓', '(test thật, giả đồng hồ)'], 'amb');
  s += A(362, 75, 396, 75, { c: 'mu' }) + A(762, 75, 796, 75, { c: 'mu' });
  s += R(0, 190, 560, 230, { c: 'grn', fill: 'rgba(63,185,80,.06)' });
  s += T(18, 222, 'Cách 1 — cập nhật theo hàm', { fs: 17, b: true, c: 'grn' });
  s += T(18, 256, 'setGiay((g) => g + 1);', { fs: 16, mono: true });
  s += T(18, 290, 'React đưa giá trị MỚI NHẤT vào g.', { fs: 15 });
  s += T(18, 318, 'Không cần đọc giay ⇒ [] là đúng.', { fs: 15 });
  s += T(18, 360, 'Dùng khi: giá trị mới tính từ giá trị cũ.', { fs: 15, c: 'mu' });
  s += R(600, 190, 560, 230, { c: 'dk', fill: 'rgba(20,158,202,.06)' });
  s += T(618, 222, 'Cách 2 — khai đủ dependency', { fs: 17, b: true, c: 'dk' });
  s += T(618, 256, '}, [giay]);', { fs: 16, mono: true });
  s += T(618, 290, 'Effect chạy lại mỗi giây: huỷ interval', { fs: 15 });
  s += T(618, 318, 'cũ, tạo interval mới đọc giay mới.', { fs: 15 });
  s += T(618, 360, 'Đúng nhưng tốn — linter gợi ý cách này.', { fs: 15, c: 'mu' });
  return sv(1160, 425, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 4 — Effect', sub: 'đồng bộ với thế giới bên ngoài React · dọn dẹp đúng lúc · và dùng ÍT effect hơn', chap: 'CHƯƠNG 4' }),

  /* 2 */ { t: 'Bản đồ chương: effect là cửa thoát ra ngoài React', body: mindmap('useEffect', 'đồng bộ component với một hệ thống NGOÀI React', [
    { t: '4.1 useEffect', d: 'chạy sau khi vẽ · dependency · cleanup · Strict Mode chạy hai lần', c: 'rx' },
    { t: '4.2 Không cần effect', d: 'tính trong render · reset bằng key · việc của sự kiện ở handler', c: 'tea' },
    { t: '4.3 Vòng lặp & closure cũ', d: 'object/hàm làm dependency · useCallback · useEffectEvent · linter', c: 'vio' },
    { t: '4.4 Hook tự viết', d: 'useDebounce · useLocalStorage · useTieuDeTrang · quy tắc hook', c: 'amb' },
    { t: '🛠 Dự án An Tâm', d: 'ô tìm debounce · bản nháp form · tiêu đề tab · đồng hồ mở cửa', c: 'grn' },
    { t: '✅ Kiểm tra', d: '10 câu tình huống, 15 phút', c: 'pnk' },
  ]) },

  /* ───── 4.1 ───── */
  /* 3 */ { t: 'Effect đồng bộ component với thứ NẰM NGOÀI React', body: diagram({
    w: 1160, h: 440,
    nodes: [
      { id: 'c', x: 400, y: 150, w: 360, h: 120, t: 'Component', d: 'props + state → JSX\n(thuần: chỉ TÍNH)', c: 'rx' },
      { id: 't', x: 0, y: 0, w: 330, h: 90, t: 'document.title', d: 'tiêu đề tab trình duyệt', c: 'tea' },
      { id: 'i', x: 830, y: 0, w: 330, h: 90, t: 'setInterval', d: 'đồng hồ "đang mở cửa?"', c: 'amb' },
      { id: 'l', x: 0, y: 330, w: 330, h: 90, t: 'localStorage', d: 'bản nháp form', c: 'vio' },
      { id: 'k', x: 830, y: 330, w: 330, h: 90, t: 'kết nối / đăng ký nghe', d: 'WebSocket, sự kiện, thư viện ngoài', c: 'pnk' },
    ],
    edges: [
      { from: 'c', to: 't', t: 'useEffect' }, { from: 'c', to: 'i', t: 'useEffect' },
      { from: 'c', to: 'l', t: 'useEffect' }, { from: 'c', to: 'k', t: 'useEffect' },
    ],
  }) + box('info', 'Không có hệ thống ngoài nào để đồng bộ ⇒ gần như chắc chắn <strong>không cần effect</strong> (Bài 4.2).') },

  /* 4 */ { t: 'Effect chạy SAU khi React đã sửa DOM và trình duyệt đã vẽ', body: renderFlow({
    h: 230, hl: 3, loop: false,
    steps: [
      { t: 'Trigger', d: 'lần đầu, hoặc\nsetState' },
      { t: 'Render', d: 'React gọi hàm\ncomponent' },
      { t: 'Commit', d: 'React sửa\nDOM thật' },
      { t: 'Paint → Effect', d: 'trình duyệt vẽ,\nrồi effect chạy' },
    ],
  }) + two(
    t([
      '$ npx vitest run src/vi-du/b1 -t "SAU khi DOM"',
      'trong render: null (chưa có trong DOM)',
      'trong effect: 07:30',
      '+ ✓ effect chạy SAU khi DOM đã có',
    ], 'vitest 5.0.1 · jsdom', 15),
    box('tip', 'Vì chạy <strong>sau</strong> khi vẽ, effect không làm chậm lần hiện đầu tiên, và đọc được DOM đã cập nhật. Thân component thì phải thuần — không đụng <code>document</code>, không hẹn giờ.')) },

  /* 5 */ { t: 'Mảng dependency quyết định khi nào effect chạy lại', body: two(
    yaml([
      ['useEffect(() => { … });', 'sau MỌI lần render'],
      ['', ''],
      ['useEffect(() => { … }, []);', 'chỉ lần hiện đầu'],
      ['', ''],
      ['useEffect(() => { … }, [bacSiId]);', 'khi bacSiId KHÁC lần trước'],
      ['', ''],
      ['// React so từng phần tử bằng Object.is', ''],
      ['//   "bs-1" với "bs-1"  → bằng', ''],
      ['//   {…} mới với {…} cũ → KHÁC', 'Bài 4.3'],
    ], { fs: 16 }),
    t([
      '$ npx vitest run src/vi-du/b1 -t "ba dạng"',
      '# 1 lần hiện + 3 lần vẽ lại, bacSiId đổi 1 lần:',
      '#   bs-1 → bs-1 → bs-2 → bs-2',
      'không mảng: 4 lần · [] : 1 lần · [bacSiId]: 2 lần',
      '+ ✓ ba dạng dependency sau 1 lần hiện + 3 lần vẽ lại',
    ], 'vitest 5.0.1', 14.5) + box('warn', 'Dependency không phải thứ bạn <strong>chọn</strong>: mọi giá trị phản ứng (props, state, biến tính từ chúng) mà effect đọc đều phải có mặt. Linter kiểm hộ (slide 20).'), 'l') },

  /* 6 */ { t: 'Cleanup chạy trước lần setup kế tiếp, và khi gỡ component', body: dongThoiGian() + two(
    t([
      '$ npx vitest run src/vi-du/b1 -t "thứ tự"',
      'render (BS. Nguyễn Minh An)',
      '+ effect: đặt tiêu đề "BS. Nguyễn Minh An"',
      '# — đổi sang bác sĩ khác —',
      'render (BS. Trần Thu Hà)',
      '! cleanup: dọn tiêu đề "BS. Nguyễn Minh An"',
      '+ effect: đặt tiêu đề "BS. Trần Thu Hà"',
    ], 'vitest 5.0.1', 14),
    t([
      '# — vẽ lại, ten KHÔNG đổi —',
      'render (BS. Trần Thu Hà)',
      '# — gỡ component —',
      '! cleanup: dọn tiêu đề "BS. Trần Thu Hà"',
      'document.title = BS. Trần Thu Hà · Phòng khám An Tâm',
      '# cleanup này chỉ ghi nhật ký, KHÔNG trả tiêu đề cũ',
      '#   ⇒ tab vẫn mang tên bác sĩ đã đóng (sửa ở 4.4)',
    ], 'vitest 5.0.1 (tiếp)', 14)) },

  /* 7 */ { t: 'Strict Mode (dev) chạy thử setup → cleanup → setup', body: two(
    t([
      '# Chromium thật · npm run dev · <StrictMode>',
      '# mở trang:',
      '[log] effect: kết nối kênh nhắc lịch của BS. Nguyễn Minh An',
      '[log] cleanup: ngắt kênh của BS. Nguyễn Minh An',
      '[log] effect: kết nối kênh nhắc lịch của BS. Nguyễn Minh An',
      '# bấm "Đổi sang BS. Trần Thu Hà":',
      '[log] cleanup: ngắt kênh của BS. Nguyễn Minh An',
      '[log] effect: kết nối kênh nhắc lịch của BS. Trần Thu Hà',
    ], 'Chromium · vite dev · console thật', 13.5),
    list([
      'Chỉ ở chế độ <strong>phát triển</strong>, chỉ khi gắn lần đầu. Bản build production chạy <strong>một</strong> lần.',
      'Mục đích: nếu thiếu cleanup, bạn thấy <strong>hai</strong> kết nối / hai hẹn giờ ngay lúc dev.',
      'Cách “chữa” đúng: viết cleanup. <strong>Đừng</strong> tắt StrictMode, đừng dùng cờ <code>useRef</code> để chặn lần hai.',
      'Test Vitest cũng thấy: <code>render → render → effect → cleanup → effect</code>.',
    ]), 'l') },

  /* 8 */ { t: 'Thiếu cleanup: đồng hồ chạy gấp đôi và sống sau khi gỡ', body: two(
    yaml([
      ['useEffect(() => {', ''],
      ['  const id = setInterval(() => {', ''],
      ['    setGiay((g) => g + 1);', ''],
      ['  }, 1000);', ''],
      ['  return () => clearInterval(id);', '✓ cleanup'],
      ['}, []);', ''],
    ], { fs: 16 }) + box('warn', 'Thiếu dòng <code>return</code>: Strict Mode tạo <strong>hai</strong> interval lúc dev; gỡ component thì interval <strong>vẫn chạy</strong> và gọi <code>setGiay</code> của một component đã mất — rò bộ nhớ, tốn pin, và ở ứng dụng thật là hai yêu cầu mạng thay vì một.'),
    t([
      '$ npx vitest run src/vi-du/b1 -t "đồng hồ"',
      '# StrictMode, giả đồng hồ, 3 giây:',
      '! Thiếu cleanup: 6 giây | lần tích: 6',
      '+ Có cleanup: 3 giây | lần tích: 3',
      '# gỡ cả hai component, thêm 3 giây:',
      '! sau khi gỡ, thêm 3 giây: thiếu cleanup',
      '!   đã tích 12 lần · có cleanup 3 lần',
    ], 'vitest 5.0.1 · vi.useFakeTimers()', 14) + '<div style="height:14px"></div>' + bars([
      { l: 'thiếu · 3 giây', v: 6, c: 'red' },
      { l: 'có · 3 giây', v: 3, c: 'grn' },
      { l: 'thiếu · gỡ + 3 giây', v: 12, c: 'red' },
      { l: 'có · gỡ + 3 giây', v: 3, c: 'grn' },
    ], { lw: 190 }), 'r') },

  /* ───── 4.2 ───── */
  /* 9 */ { t: 'Tính được từ props/state thì tính ngay khi render', body: vs({
    no: { t: 'Effect + state thứ hai', items: [
      '<code>const [ketQua, setKetQua] = useState(ds)</code>',
      '<code>useEffect(() =&gt; setKetQua(loc(ds, tuKhoa)), [tuKhoa])</code>',
      'Vẽ một lượt với danh sách <strong>cũ</strong>, rồi vẽ lại lượt nữa.',
      'Hai nguồn sự thật có thể lệch nhau.',
    ] },
    yes: { t: 'Biến tính trong render', items: [
      '<code>const ketQua = locBacSi(ds, chuyenKhoa, tuKhoa);</code>',
      'Một lượt render, luôn khớp với <code>tuKhoa</code>.',
      'Đúng cách Chương 2 đã làm: <strong>state dẫn xuất</strong> không cất vào state.',
      'Tính nặng thật (đo thấy chậm) ⇒ <code>useMemo</code> (Chương 8).',
    ] },
  }) + box('info', 'oxlint 1.85 bắt được kiểu sai này: <code>react(set-state-in-effect)</code> — “Derive the value during render, initialize state directly, or update it from the event that caused the change.”') },

  /* 10 */ { t: 'Nhật ký thật: effect vẽ gấp đôi, có lượt hiện số sai', body: t([
    '$ npx vitest run src/vi-du/b2 --reporter=verbose',
    '# gõ "l" rồi "a" vào hai ô tìm giống hệt nhau:',
    '[effect] render: tuKhoa="" → hiện 6 bác sĩ',
    '[effect] render: tuKhoa="" → hiện 6 bác sĩ',
    '[render] render: tuKhoa="" → hiện 6 bác sĩ',
    '! [effect] render: tuKhoa="l" → hiện 6 bác sĩ          ← chữ đã đổi, danh sách chưa',
    '[effect] render: tuKhoa="l" → hiện 2 bác sĩ',
    '! [effect] render: tuKhoa="la" → hiện 2 bác sĩ         ← lại lệch một lượt',
    '[effect] render: tuKhoa="la" → hiện 1 bác sĩ',
    '[render] render: tuKhoa="l" → hiện 2 bác sĩ',
    '[render] render: tuKhoa="la" → hiện 1 bác sĩ',
    '+ số lượt render: effect 6 · tính trong render 3',
  ], 'vitest 5.0.1', 15) },

  /* 11 */ { t: 'Muốn state về trắng khi đổi bác sĩ: dùng key, không dùng effect', body: two(
    yaml([
      ['// ✗ xoá SAU khi đã vẽ với ghi chú cũ', ''],
      ['useEffect(() => {', ''],
      ["  setGhiChu('');", ''],
      ['}, [bacSi.id]);', ''],
      ['', ''],
      ['// ✓ ở component CHA', ''],
      ['<GhiChu key={bacSi.id} bacSi={bacSi} />', 'key đổi = component mới'],
      ['', ''],
      ['// dự án: FormDatLich đã có sẵn', ''],
      ['<FormDatLich key={bacSiDangChon.id} … />', 'từ Chương 3'],
    ], { fs: 15.5 }),
    t([
      '$ npx vitest run src/vi-du/b2 -t "reset"',
      '# gõ "dị ứng" cho BS. An, rồi đổi sang BS. Hà:',
      '! [effect] vẽ BS. Trần Thu Hà với ghi chú "dị ứng"',
      '[effect] vẽ BS. Trần Thu Hà với ghi chú ""',
      '+ [key] vẽ BS. Trần Thu Hà với ghi chú ""',
      '# effect: 2 lượt, lượt đầu mang ghi chú của',
      '#   bác sĩ trước; key: 1 lượt, sạch ngay',
    ], 'vitest 5.0.1', 14.5), 'l') },

  /* 12 */ { t: 'Việc do người dùng bấm thì làm trong handler', body: two(
    t([
      '$ npx vitest run src/vi-du/b2 -t "gửi trong effect"',
      '# StrictMode · bấm "Gửi" MỘT lần ở từng bên:',
      'vừa bấm xong  → effect gửi 1 lần · handler gửi 1 lần',
      '# đổi tab đi rồi quay lại (component gắn lại):',
      '! đổi tab 2 lần → effect gửi 3 lần · handler gửi 1 lần',
      '# không StrictMode: effect gửi 2 lần',
    ], 'vitest 5.0.1', 14) + '<div style="height:14px"></div>' + bars([
      { l: 'effect (StrictMode)', v: 3, c: 'red' },
      { l: 'effect (không Strict)', v: 2, c: 'ora' },
      { l: 'handler', v: 1, c: 'grn' },
    ], { lw: 200 }),
    list([
      'Effect trả lời câu hỏi “component <strong>đang hiện</strong> thì phải đồng bộ gì?”. Nó chạy lại mỗi khi component <strong>gắn lại</strong>.',
      'Handler trả lời “người dùng vừa <strong>làm</strong> gì?”. Nó chạy đúng một lần mỗi cú bấm.',
      'Gửi form, thêm vào giỏ, thông báo “đã lưu” ⇒ <strong>handler</strong>.',
      'Hỏi: “code này chạy <strong>vì</strong> component hiện ra, hay <strong>vì</strong> người dùng bấm?”',
    ]), 'l') },

  /* 13 */ { t: 'Tự tải dữ liệu trong effect: câu trả lời cũ đè câu trả lời mới', body: cuocDua() },

  /* 14 */ { t: 'Có cần effect không? Hỏi ba câu trước khi viết', body: diagram({
    w: 1160, h: 440,
    nodes: [
      { id: 'q1', x: 0, y: 0, w: 330, h: 90, t: 'Tính được từ props/state?', d: 'lọc, đếm, ghép chuỗi…', c: 'amb' },
      { id: 'a1', x: 0, y: 170, w: 330, h: 90, t: 'Tính trong render', d: 'nặng thật thì useMemo', c: 'grn' },
      { id: 'q2', x: 415, y: 0, w: 330, h: 90, t: 'Do người dùng làm gì?', d: 'bấm, gõ, gửi', c: 'amb' },
      { id: 'a2', x: 415, y: 170, w: 330, h: 90, t: 'Viết trong handler', d: 'onClick, onSubmit', c: 'grn' },
      { id: 'q3', x: 830, y: 0, w: 330, h: 90, t: 'Đồng bộ với hệ thống ngoài?', d: 'title, hẹn giờ, kho, kết nối', c: 'amb' },
      { id: 'a3', x: 830, y: 170, w: 330, h: 90, t: 'useEffect + cleanup', d: 'hoặc một hook tự viết', c: 'rx' },
      { id: 'a4', x: 415, y: 330, w: 745, h: 90, t: 'Lấy dữ liệu từ server?', d: 'Chương 6: TanStack Query — không tự viết useEffect + fetch', c: 'vio' },
    ],
    edges: [
      { from: 'q1', to: 'a1', t: 'có' }, { from: 'q1', to: 'q2', t: 'không' },
      { from: 'q2', to: 'a2', t: 'có' }, { from: 'q2', to: 'q3', t: 'không' },
      { from: 'q3', to: 'a3', t: 'có' }, { from: 'a3', to: 'a4', t: 'đặc biệt', dash: true },
    ],
  }) },

  /* ───── 4.3 ───── */
  /* 15 */ { t: 'setState trong effect không mảng dependency: lặp không dừng', body: two(
    anh('rx-04', 'vong-lap.jpg', { w: 600, h: 250, url: 'localhost:5141/vi-du.html?demo=vong-lap', cap: 'Ảnh chụp thật · Chromium · con số vẫn đang tăng' }) +
    yaml([
      ['useEffect(() => {', ''],
      ['  setLuotXem(luotXem + 1);', '✗ đổi state'],
      ['});', '✗ không có mảng'],
    ], { fs: 16 }),
    t([
      '# Chromium thật, sau khi bấm nút:',
      'sau 1 giây: "Lượt xem: 12376" · console.error: 237 lần',
      'sau 2 giây: "Lượt xem: 28402" · console.error: 546 lần',
      '! sau 3 giây: "Lượt xem: 46167" · console.error: 887 lần',
      '! Maximum update depth exceeded. This can happen',
      '!  when a component calls setState inside useEffect,',
      "!  but useEffect either doesn't have a dependency",
      '!  array, or one of the dependencies changes on',
      '!  every render.',
      '# trang KHÔNG sập, không trắng: vòng lặp cứ thế chạy',
    ], 'Chromium · vite dev', 13.5), 'l') },

  /* 16 */ { t: 'Object/mảng tạo trong render là MỚI mỗi lần: effect luôn chạy', body: two(
    yaml([
      ['const boLoc = { chuyenKhoa, tuKhoa: "" };', '✗ object mới'],
      ['useEffect(() => {', ''],
      ['  setKetQua(locBacSi(ds, boLoc.chuyenKhoa, …));', 'mảng mới'],
      ['}, [boLoc]);', 'luôn “khác”'],
      ['', ''],
      ['Object.is("nhi", "nhi")      // true', 'so giá trị'],
      ['Object.is({ a: 1 }, { a: 1 }) // false', 'so địa chỉ'],
      ['', ''],
      ['// ✓ phụ thuộc vào string', ''],
      ['}, [chuyenKhoa]);', ''],
      ['// ✓ hoặc giữ object bằng useMemo', ''],
      ['const boLoc = useMemo(() => ({ … }), [chuyenKhoa]);', ''],
    ], { fs: 14.5 }),
    t([
      '# Chromium thật, không bấm gì:',
      'sau 1 giây: "2 bác sĩ" · console.error: 321 lần',
      'sau 2 giây: "2 bác sĩ" · console.error: 632 lần',
      '! sau 3 giây: "2 bác sĩ" · console.error: 945 lần',
      '# màn hình trông ĐÚNG — chỉ console kể sự thật',
      '$ npx vitest run src/vi-du/b3 -t "useMemo"',
      'nguyên thuỷ + useMemo: 2 bác sĩ | 2 bác sĩ',
      '  · console.error: 0',
    ], 'Chromium + vitest', 13.5), 'l') },

  /* 17 */ { t: 'Hàm khai trong component cũng mới mỗi lần render', body: two(
    bars([
      { l: 'hàm thô làm dependency', v: 4, c: 'red' },
      { l: 'bọc useCallback', v: 1, c: 'grn' },
      { l: 'đưa hàm vào trong effect', v: 1, c: 'grn' },
    ], { lw: 250 }) + '<div style="height:14px"></div>' + t([
      '$ npx vitest run src/vi-du/b3 -t "hàm làm"',
      '# 1 lần hiện + 3 lần vẽ lại, bacSiId không đổi',
      'effect "kết nối" chạy: hàm thô 4 lần',
      '  · useCallback 1 lần · hàm trong effect 1 lần',
    ], 'vitest 5.0.1', 14),
    yaml([
      ['// ✓ ưu tiên: hàm nằm TRONG effect', ''],
      ['useEffect(() => {', ''],
      ['  function taoKenh() {', ''],
      ['    return `kenh-${bacSiId}`;', ''],
      ['  }', ''],
      ['  …', ''],
      ['}, [bacSiId]);', 'chỉ còn chuỗi'],
      ['', ''],
      ['// ✓ khi hàm phải dùng ở nhiều nơi', ''],
      ['const taoKenh = useCallback(', ''],
      ['  () => `kenh-${bacSiId}`,', ''],
      ['  [bacSiId]);', 'giữ nguyên hàm'],
    ], { fs: 15 }), 'l') },

  /* 18 */ { t: 'Closure cũ: interval đọc giá trị của lượt render đầu tiên', body: closureCu() },

  /* 19 */ { t: 'useEffectEvent: đọc giá trị mới mà không chạy lại effect', body: two(
    yaml([
      ["import { useEffect, useEffectEvent } from 'react';", 'React 19.2+'],
      ['', ''],
      ['const onDenGio = useEffectEvent(() => {', ''],
      ['  nhac(bacSiId, amThanh);', 'luôn thấy amThanh MỚI'],
      ['});', ''],
      ['useEffect(() => {', ''],
      ['  const id = setInterval(() => onDenGio(), 1000);', ''],
      ['  return () => clearInterval(id);', ''],
      ['}, [bacSiId]);', 'KHÔNG có amThanh'],
    ], { fs: 14.5 }),
    t([
      '$ npx vitest run src/vi-du/b3 -t EffectEvent',
      'hẹn giờ cho bs-1',
      'nhắc giờ khám bs-1 · âm thanh TẮT',
      '# đổi amThanh = true → KHÔNG hẹn giờ lại',
      '+ nhắc giờ khám bs-1 · âm thanh BẬT',
      '# đổi bacSiId = bs-2 → hẹn giờ lại',
      'hẹn giờ cho bs-2',
      'nhắc giờ khám bs-2 · âm thanh BẬT',
    ], 'react 19.3.0 · vitest 5.0.1', 13.5) + box('warn', 'Chỉ gọi hàm effect event <strong>bên trong effect</strong>. Không dùng nó để “tắt” linter cho mọi dependency.'), 'r') },

  /* 20 */ { t: 'Để linter đếm dependency hộ bạn', body: t([
    '$ npx oxlint src/vi-du/b3.tsx',
    '! b3.tsx:9:3: warning react-hooks(exhaustive-deps): React Hook useEffect contains a call to setState.',
    '!  Without a list of dependencies, this can lead to an infinite chain of updates.',
    '! b3.tsx:21:7: warning react-hooks(exhaustive-deps): React hook useEffect depends on `boLoc`,',
    '!  which changes every render  help: Try memoizing this variable with `useRef` or `useCallback`.',
    '! b3.tsx:41:7: warning react-hooks(exhaustive-deps): React hook useEffect depends on `taoKenh`,',
    '!  which changes every render',
    "! b3.tsx:68:15: warning react-hooks(exhaustive-deps): React Hook useEffect has a missing dependency: 'giay'",
    '! b3.tsx:10:5: warning react(set-state-in-effect): Calling setState synchronously within an effect',
    '!  can trigger cascading renders',
    '# template Vite (create-vite 9) dùng oxlint 1.85: exhaustive-deps bật sẵn ở mức warning',
  ], 'oxlint 1.85.0 · rút gọn', 13.5) + box('tip', 'Đừng tắt cảnh báo bằng <code>// oxlint-disable-next-line</code> (hay <code>eslint-disable…</code>). Cảnh báo nói <strong>code</strong> sai: sửa code (đưa hàm vào effect, cập nhật theo hàm, bỏ effect) cho tới khi danh sách đúng là danh sách bạn muốn.') },

  /* ───── 4.4 ───── */
  /* 21 */ { t: 'Hook tự viết = hàm tên use… gọi các hook khác', body: two(
    yaml([
      ['// src/hooks/useTieuDeTrang.ts', ''],
      ['export function useTieuDeTrang(tieuDe: string) {', 'tên bắt đầu use'],
      ['  useEffect(() => {', 'gọi hook khác'],
      ['    const tieuDeCu = document.title;', ''],
      ['    document.title = tieuDe;', ''],
      ['    return () => {', ''],
      ['      document.title = tieuDeCu;', 'trả lại khi gỡ'],
      ['    };', ''],
      ['  }, [tieuDe]);', ''],
      ['}', ''],
      ['', ''],
      ['// KhuBacSi.tsx — một dòng', ''],
      ['useTieuDeTrang(bacSiDangChon ? `${…ten} · …` : "…");', ''],
    ], { fs: 14.5 }),
    t([
      '$ npx vitest run src/hooks/useLocalStorage',
      '# hai component, cùng khoá "chung":',
      'A thấy 5 · B thấy 0 · localStorage = 5',
      '+ ✓ hai component cùng khoá: hook chia sẻ',
      '+     LOGIC, không chia sẻ STATE',
    ], 'vitest 5.0.1', 13) + box('info', 'Mỗi lần gọi hook là một bộ state <strong>riêng</strong>. Muốn nhiều component thấy cùng một giá trị ⇒ nâng state lên (Ch2), context hoặc Zustand (Ch5).'), 'l') },

  /* 22 */ { t: 'useDebounce: ô tìm hiện chữ ngay, danh sách chờ ngừng gõ', body: two(
    yaml([
      ['export function useDebounce<T>(giaTri: T, treMs = 300): T {', ''],
      ['  const [giaTriCham, setGiaTriCham] = useState(giaTri);', ''],
      ['  useEffect(() => {', ''],
      ['    const hen = setTimeout(', ''],
      ['      () => setGiaTriCham(giaTri), treMs);', 'hẹn giờ'],
      ['    return () => clearTimeout(hen);', 'phím mới ⇒ huỷ hẹn cũ'],
      ['  }, [giaTri, treMs]);', ''],
      ['  return giaTriCham;', ''],
      ['}', ''],
    ], { fs: 13.5 }) + t([
      '# gõ "nguyen", từng phím cách 100 ms:',
      'sau từng phím: ["","","","","","",""]',
      '+ thêm 200 ms  : "nguyen"',
    ], 'vitest · renderHook + giả đồng hồ', 14),
    anh('rx-04', 'tim-huy.jpg', { w: 470, url: 'localhost:5144', cap: 'Ảnh chụp thật: gõ “huy”, chờ “Đang hiện 1/6”' }), 'l') },

  /* 23 */ { t: 'useLocalStorage: bản nháp form sống qua lần tải lại trang', body: two(
    anh('rx-04', 'ban-nhap-form.jpg', { w: 270, url: 'localhost:5145', cap: 'Ảnh chụp thật: gõ dở → tải lại → mở lại' }),
    t([
      '# Chromium thật (vite build + preview):',
      '2. xem BS. Thu Hà → document.title =',
      '     "BS. Trần Thu Hà · Phòng khám An Tâm"',
      '3. gõ dở → localStorage =',
      '   {"benhNhan":{"hoTen":"Nguyễn Thị Mai",…},',
      '    "lyDo":"Bé sốt 38,5 độ từ tối qua, …"}',
      '4. tải lại trang → title = "Phòng khám An Tâm"',
      '+ 5. mở lại → ô Họ và tên = "Nguyễn Thị Mai"',
    ], 'Chromium · Playwright', 13) + box('tip', 'Đọc kho <strong>một lần</strong> trong <code>useState(() =&gt; …)</code>; ghi kho trong effect <code>[khoa, giaTri]</code>; bọc <code>try/catch</code> vì kho có thể bị chặn hoặc chứa JSON hỏng.'), 'r2') },

  /* 24 */ { t: 'Đồng hồ “đang mở cửa?”: logic thuần + hook hẹn giờ', body: two(
    anh('rx-04', 'trang-chu.jpg', { w: 600, h: 300, url: 'localhost:5143', cap: 'Ảnh chụp thật · máy đặt giờ Việt Nam, Thứ 6 09:28' }) +
    yaml([
      ['const bayGio = useGioHienTai();', 'setInterval 30 s + cleanup'],
      ['const mo = dangMoCua(bayGio);', 'hàm THUẦN, test không cần giả giờ'],
    ], { fs: 15 }),
    t([
      '$ npx vitest run src/logic/gio-mo-cua \\',
      '    src/components/TrangThaiMoCua --reporter=verbose',
      '+ ✓ Thứ 2, 07:29 ⇒ mở cửa: false',
      '+ ✓ Thứ 2, 07:30 ⇒ mở cửa: true',
      '+ ✓ Thứ 2, 17:00 ⇒ mở cửa: false',
      '+ ✓ Chủ nhật, 10:00 ⇒ mở cửa: false',
      '+ ✓ 07:29 Thứ 2 đang đóng; 60 giây sau tự',
      '+     chuyển sang mở, không cần tải lại',
      '+ ✓ gỡ component ⇒ không còn hẹn giờ nào chạy',
      '# vi.getTimerCount(): 1 trước khi gỡ, 0 sau khi gỡ',
    ], 'vitest 5.0.1 · rút gọn', 13.5), 'l') },

  /* 25 */ { t: 'Quy tắc hook: gọi ở cấp cao nhất, trong component hoặc hook', body: two(
    list([
      'Chỉ gọi hook ở <strong>cấp cao nhất</strong> của component / hook tự viết — không trong <code>if</code>, vòng lặp, sau <code>return</code> sớm, trong handler.',
      'Tên hook tự viết <strong>bắt đầu bằng <code>use</code></strong> + chữ hoa: <code>useDebounce</code>. Nhờ tên, linter biết mà kiểm.',
      'Hàm không gọi hook nào thì <strong>đừng</strong> đặt tên <code>use…</code> — nó chỉ là hàm thường (<code>dangMoCua</code>).',
      'Vì sao: React nhận ra từng <code>useState</code> theo <strong>thứ tự gọi</strong>. Gọi có điều kiện ⇒ thứ tự lệch giữa các lần render.',
    ]),
    t([
      '$ npx oxlint src/vi-du/b3-lint.tsx',
      '! b3-lint.tsx:12:33: error react-hooks(rules-of-hooks):',
      '!  React Hook "useState" is called conditionally.',
      '!  React Hooks must be called in the exact same',
      '!  order in every component render.',
      '#  help: Move the Hook call before the condition,',
      '#  or call it unconditionally and branch inside',
      '#  the Hook/effect instead.',
      "! b3-lint.tsx:5:25: warning react-hooks(exhaustive-deps):",
      "!  React Hook useEffect has a missing dependency: 'ten'",
    ], 'oxlint 1.85.0', 13.5), 'l') },

  /* 26 */ { t: 'Thêm hook vào dự án làm đỏ hai test cũ — và đó là tin tốt', body: two(
    t([
      '$ npx vitest run',
      '! FAIL KhuBacSi.test.tsx > gõ "lan" (không dấu)',
      '!  Unable to find an element with the text:',
      '!  Đang hiện 1/6 bác sĩ',
      '#  ⇒ debounce: danh sách lọc SAU 300 ms',
      '#  sửa: getByText → await findByText',
      '! FAIL FormDatLich.test.tsx > đếm ký tự lý do',
      '!  Unable to find an element with the text: 501/500',
      '#  DOM: "Đã khôi phục bản nháp" · 518/500',
      '#  ⇒ localStorage của test TRƯỚC còn nguyên',
    ], 'trước khi sửa · rút gọn', 13.5),
    yaml([
      ['// src/test/setup.ts', ''],
      ['afterEach(() => {', ''],
      ['  cleanup();', 'dọn DOM (Ch1)'],
      ['  localStorage.clear();', 'dọn kho (Ch4)'],
      ['});', ''],
    ], { fs: 16 }) + t([
      '$ npx vitest run',
      '+ Test Files  11 passed (11)',
      '+      Tests  46 passed (46)',
    ], 'sau khi sửa · không tính src/vi-du', 15), 'l') },

  /* 27 */ { t: 'Sai lầm hay gặp ở Chương 4', body: cards([
    { ic: '🔁', t: 'setState trong effect không mảng', d: 'Lặp vô hạn: 46 167 lượt trong 3 giây. Thêm dependency, hoặc bỏ effect.', c: 'red' },
    { ic: '🧮', t: 'Effect để tính dữ liệu dẫn xuất', d: 'Vẽ gấp đôi, có lượt hiện số cũ. Tính thẳng trong render.', c: 'ora' },
    { ic: '🧹', t: 'Quên cleanup', d: 'Hẹn giờ, kết nối, đăng ký nghe sống sau khi gỡ; Strict Mode làm lộ ra gấp đôi.', c: 'amb' },
    { ic: '📦', t: 'Object / hàm làm dependency', d: 'Mới mỗi lần render ⇒ effect chạy mãi. Dùng giá trị nguyên thuỷ hoặc đưa vào trong effect.', c: 'vio' },
    { ic: '🧊', t: 'Closure cũ', d: 'Interval đọc state của lượt đầu: “Cũ: 1 giây”. Cập nhật theo hàm.', c: 'blu' },
    { ic: '🤫', t: 'Tắt linter cho “yên”', d: 'Cảnh báo exhaustive-deps là bug đang chờ. Sửa code, đừng sửa danh sách.', c: 'pnk' },
  ], 3) },

  /* 28 */ { t: 'Bảng tra nhanh Chương 4', body: table(['Muốn', 'Viết'], [
    ['Đồng bộ với thứ ngoài React', '<code>useEffect(() =&gt; { bắt đầu; return () =&gt; { dừng }; }, [phụ thuộc])</code>'],
    ['Chạy lại khi một giá trị đổi', 'đưa đúng giá trị đó vào mảng: <code>[bacSiId]</code> — nguyên thuỷ, không object mới'],
    ['Dữ liệu tính từ props/state', '<code>const ketQua = loc(ds, tuKhoa);</code> ngay trong render — không effect'],
    ['State về trắng khi đổi đối tượng', '<code>&lt;Form key={bacSi.id} /&gt;</code> ở component cha'],
    ['Việc do người dùng bấm', 'trong handler <code>onClick / onSubmit</code>, không trong effect'],
    ['Cập nhật từ hẹn giờ', '<code>setX((cu) =&gt; cu + 1)</code> — tránh closure cũ'],
    ['Đọc giá trị mới nhất trong effect mà không chạy lại', '<code>const onX = useEffectEvent(() =&gt; …)</code> (React 19.2+)'],
    ['Dùng lại logic có effect', 'hook tự viết <code>useDebounce</code>, <code>useLocalStorage</code>; test bằng <code>renderHook</code> + <code>vi.useFakeTimers()</code>'],
  ], { sm: true }) },

  /* 29 */ { t: 'Tự gõ tiếp dự án: bốn hook cho phòng khám An Tâm', body: two(
    compTree({
      w: 630, h: 400, bw: 260, bh: 60,
      root: { n: 'App', kids: [
        { n: 'Header', kids: [{ n: 'TrangThaiMoCua', s: 'useGioHienTai', c: 'amb' }] },
        { n: 'KhuBacSi', s: 'useDebounce + useTieuDeTrang', st: true, c: 'vio', kids: [
          { n: 'FormDatLich', s: 'useLocalStorage', c: 'grn' },
        ] },
      ] },
    }),
    list([
      '<strong>1.</strong> <code>src/hooks/useDebounce.ts</code> — ô tìm lọc sau 300 ms.',
      '<strong>2.</strong> <code>useTieuDeTrang</code> — tab ghi tên bác sĩ đang xem.',
      '<strong>3.</strong> <code>useGioHienTai</code> + <code>dangMoCua</code> + <code>TrangThaiMoCua</code> trong <code>Header</code>.',
      '<strong>4.</strong> <code>useLocalStorage</code> — bản nháp <code>FormDatLich</code> theo từng bác sĩ; gửi xong thì xoá.',
      '<strong>Đạt khi:</strong> <code>npx tsc -b</code> im lặng; <code>npx vitest run</code> xanh (46 test trong lời giải); tải lại trang vẫn còn bản nháp như slide 23.',
    ]), 'l') },
]);
