/**
 * React · Deck rx-08 — Chương 8: Hiệu năng và khả năng tiếp cận.
 *
 * MỌI số liệu/output trên slide là THẬT, chạy 26/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch08
 * (dựng lại theo lời giải Chương 7 rồi làm tiếp) — react 19.3.0 · react-dom 19.3.0 · vite 8.3.1 · typescript 6.0.3 ·
 * vitest 5.0.2 · jsdom 29.1.1 · react-router 8.4.0 · @tanstack/react-query 5.103.3 · zustand 5.0.15 · msw 2.15.0 ·
 * babel-plugin-react-compiler 1.0.0 (+ @rolldown/plugin-babel 0.2.4, @babel/core 7.29.7 / 8.0.6) · axe-core 4.13.0 ·
 * Chromium 149 qua Playwright (CPU chậm 4× bằng CDP).
 *   npx vitest run src/vi-du (bai1 · bai2 · bai3 · bai4) · src/features · src/app
 *   do/do-chromium.mjs (Profiler + Event Timing) · do/do-lazy.mjs · do/do-anh.mjs · do/do-axe.mjs · do/do-ban-phim.mjs
 *   do/phan-tich-bundle.mjs (đọc sourcemap) · do/kiem-compiler.mjs (logger của React Compiler)
 * Ảnh chụp giao diện: scripts/slides-src/rx-anh/rx-08/*.jpg
 */
import {
  S, cover, cards, box, table, two, list, mindmap, term as rxTerm, yaml, sv, R, T, A, D, compTree, anh, bars, steps, kpis, flow,
} from './_rx-chung.mjs';

export const deck = { key: 'rx-08', code: 'REACT · CHƯƠNG 8', title: 'Hiệu năng và khả năng tiếp cận', sub: 'React · Chương 8' };

const t = (lines, title, fs = 15) => rxTerm(lines, { title, dir: '~/phong-kham', fs });
const chu = (s, c = D.mu) => `<div style="text-align:center;color:${c};font-size:16px;font-weight:700;margin-top:6px">${s}</div>`;

/* ───────── Slide 3 — vòng đo ───────── */
const vongDo = () => {
  let s = '';
  const o = (x, y, w, txt, sub, c) => R(x, y, w, 92, { c, r: 14 }) + T(x + w / 2, y + 38, txt, { fs: 21, b: true, a: 'middle' }) + T(x + w / 2, y + 68, sub, { fs: 15, c: 'mu', a: 'middle' });
  s += o(10, 30, 230, '① Đo', 'Profiler · Chromium', 'rx');
  s += o(290, 30, 230, '② Chậm thật?', 'so với ngưỡng 200 ms', 'amb');
  s += o(570, 30, 230, '③ Tìm chỗ', 'ai chạy lại, vì sao', 'vio');
  s += o(850, 30, 230, '④ Sửa một chỗ', 'memo · lazy · …', 'grn');
  s += A(244, 76, 284, 76, { c: 'mu' }) + A(524, 76, 564, 76, { c: 'mu' }) + A(804, 76, 844, 76, { c: 'mu' });
  s += `<path d="M965 126 L965 170 L125 170 L125 130" stroke="${D.dim}" stroke-width="2.5" fill="none" stroke-dasharray="8 6" marker-end="url(#m-dim)"/>`;
  s += T(545, 194, '⑤ đo lại bằng ĐÚNG phép đo cũ — không nhanh hơn thì hoàn tác', { fs: 16, c: 'mu', a: 'middle' });
  s += T(405, 150, 'không ⇒ dừng, đừng tối ưu', { fs: 14.5, c: 'amb', a: 'middle' });
  return sv(1090, 210, s);
};

/* ───────── Slide 5 / 9 — cây 200 thẻ ───────── */
const cayThe = (memo) => compTree({
  w: 1120, h: 300, bw: 150, bh: 54, legend: true, root: { n: 'KhuBacSi', w: 220, s: '● yeuThich (Zustand)', st: true, r: true, kids: [
    { n: 'DanhSachBacSi', w: 220, r: true, s: 'map 200 bác sĩ', kids: [
      { n: 'TheBacSi', r: true, s: 'bs-1 ♡ → ♥', w: 150 },
      { n: 'TheBacSi', r: !memo, m: memo, s: 'bs-2', w: 150 },
      { n: 'TheBacSi', r: !memo, m: memo, s: 'bs-3', w: 150 },
      { n: 'TheBacSi', r: !memo, m: memo, s: '… bs-200', w: 150 },
    ] },
  ] },
});

/* ───────── Slide 16 — bundle theo gói ───────── */
const goi = [
  { l: 'react-dom', sub: 'bắt buộc', v: 207.2, txt: '207,2 kB', c: 'blu' },
  { l: 'react-router', sub: 'bắt buộc', v: 95.4, txt: '95,4 kB', c: 'blu' },
  { l: 'zod', sub: 'chỉ form /dat-lich', v: 77.4, txt: '77,4 kB', c: 'amb' },
  { l: '@tanstack/query-core', v: 32.6, txt: '32,6 kB', c: 'blu' },
  { l: 'react-hook-form', sub: 'chỉ form /dat-lich', v: 29.8, txt: '29,8 kB', c: 'amb' },
  { l: 'src/ (mã của app)', v: 22.6, txt: '22,6 kB', c: 'grn' },
];

export const slides = S([
  /* 1 */ cover({ t: 'Chương 8 — Hiệu năng và khả năng tiếp cận', sub: 'Profiler · memo · React Compiler · lazy · Suspense · ảnh · HTML đúng nghĩa · bàn phím · axe', chap: 'CHƯƠNG 8' }),

  /* 2 */ { t: 'Bản đồ chương: đo trước, sửa đúng chỗ, ai cũng dùng được', body: mindmap('Nhanh và dùng được', 'mọi con số đều đo thật', [
    { t: '8.1 Đo', d: 'Profiler · 200 bác sĩ · Chromium chậm 4×', c: 'rx' },
    { t: '8.2 memo', d: 'memo · useCallback · useMemo · Compiler', c: 'vio' },
    { t: '8.3 Tải lười', d: 'route lazy · Suspense · barrel · ảnh', c: 'grn' },
    { t: '8.4 Tiếp cận', d: 'HTML đúng nghĩa · bàn phím · ARIA · axe', c: 'amb' },
    { t: '🛠 Dự án', d: 'đo · memo · lazy · bộ chọn ngày bằng phím', c: 'tea' },
  ]) },

  /* ───── 8.1 ───── */
  /* 3 */ { t: 'Tối ưu bắt đầu bằng ĐO, không bắt đầu bằng memo', body: `${vongDo()}
    ${two(
      box('bad', '<strong>Tối ưu mò:</strong> bọc <code>useCallback</code> khắp nơi “cho chắc”. Code khó đọc hơn, và không ai biết nó có nhanh hơn không.'),
      box('good', '<strong>Tối ưu có số:</strong> “bấm ♡ tốn 39,8 ms với 1000 thẻ” → sửa một chỗ → “còn 5,1 ms”. Có trước/sau thì mới gọi là tối ưu.'))}` },

  /* 4 */ { t: 'Profiler gọi onRender sau MỖI lần commit của cây con', body: two(
    `${yaml([
      ['<Profiler id="KhuBacSi" onRender={ghiLai}>', 'bọc vùng cần đo'],
      ['  <KhuBacSi />', ''],
      ['</Profiler>', ''],
      ['', ''],
      ['function ghiLai(id, phase,', ''],
      ['  actualDuration, baseDuration) {…}', ''],
    ], { fs: 15 })}
     ${table(['Tham số', 'Nghĩa'], [
      ['phase', 'mount · update · nested-update'],
      ['actualDuration', '!ms THẬT cho lần commit này'],
      ['baseDuration', 'ms nếu vẽ lại CẢ cây, không bỏ qua gì'],
    ], { sm: true })}`,
    `${t(['$ npx vitest run src/vi-du/bai1.test.tsx', '[onRender] id=KhuBacSi phase=mount', '  actualDuration=1.2ms baseDuration=0.7ms', '[onRender] id=KhuBacSi phase=update', '  actualDuration=34.7ms baseDuration=19.2ms', '[onRender] id=KhuBacSi phase=update', '  actualDuration=16.5ms baseDuration=16.2ms'], 'mount (khung xương) → dữ liệu về → bấm ♡', 14)}
     ${box('tip', '<code>actualDuration</code> ≈ <code>baseDuration</code> ⇒ memo chưa bỏ qua được gì. Sau khi memo đúng chỗ, <code>actual</code> tụt xa dưới <code>base</code>.')}`) },

  /* 5 */ { t: 'Bấm ♡ một thẻ: 200 thẻ chạy lại, chỉ một thẻ thật sự đổi', body: `${cayThe(false)}
    ${two(
      t(['[bam tim] số lần commit: 1 | phase: update', '! [bam tim] TheBacSi chạy: 200 lần — thẻ thật sự đổi: 1', '[go "h"] commit: 1 | TheBacSi chạy: 162', '[go "u"] commit: 1 | TheBacSi chạy: 50', '[go "y"] commit: 1 | TheBacSi chạy: 17'], 'vitest · bộ đếm useDemRender + DoRender', 13.5),
      box('info', 'Hai dụng cụ bổ sung nhau: <strong>Profiler</strong> nói <em>tốn bao lâu</em>, <strong>bộ đếm</strong> nói <em>ai chạy, bao nhiêu lần</em>. React DevTools gộp cả hai trong tab Profiler.'))}` },

  /* 6 */ { t: 'Build thường không đo: cần build --mode profiling', body: two(
    `${t(['# vite build (mặc định) → Chromium, bấm ♡ 7 lần', '! commit/lần = 0,0,0,0,0,0,0', '# vite build --mode profiling', '+ commit/lần = 1,1,1,1,1,1,1', '+ actualDuration trung vị = 10.1 ms'], 'Chromium 149 · CPU chậm 4× · 200 bác sĩ', 14)}
     ${box('warn', 'React bỏ phần đo trong bản production để đỡ tốn. <code>onRender</code> vẫn được khai nhưng <strong>không bao giờ được gọi</strong>.')}`,
    `${yaml([
      ['// vite.config.ts', ''],
      ['resolve: {', ''],
      ['  alias: mode === "profiling"', 'chỉ khi --mode profiling'],
      ['    ? [{ find: /^react-dom\\/client$/,', ''],
      ['         replacement: "react-dom/profiling" }]', 'bản có bật đo'],
      ['    : [],', ''],
      ['},', ''],
    ], { fs: 14.5 })}
     ${t(['$ npx vite build --mode profiling \\', '    --outDir dist-profiling'], 'rồi vite preview --outDir dist-profiling', 13.5)}`) },

  /* 7 */ { t: 'Máy chậm 4×: 200 thẻ tốn 10 ms, 1000 thẻ tốn 40 ms', body: two(
    bars([
      { l: '200 thẻ · CPU 4×', sub: 'actualDuration', v: 10.1, txt: '10,1 ms', c: 'grn' },
      { l: '200 thẻ · CPU 6×', sub: 'actualDuration', v: 15.4, txt: '15,4 ms', c: 'amb' },
      { l: '1000 thẻ · CPU 4×', sub: 'actualDuration', v: 39.8, txt: '39,8 ms', c: 'red' },
      { l: '1000 thẻ · CPU 4×', sub: 'tương tác (Event Timing)', v: 88, txt: '88 ms', c: 'red' },
    ], { lw: 250, max: 90 }),
    `${kpis([{ v: '200', l: 'ms — INP “tốt” (≤)', c: 'grn' }, { v: '500', l: 'ms — INP “kém” (>)', c: 'red' }, { v: '16,7', l: 'ms — 1 khung hình 60 Hz', c: 'amb' }])}
     ${box('info', '200 thẻ: <strong>chưa chậm</strong> theo ngưỡng người dùng. Nhưng 1000 thẻ đã ăn hết hai khung hình mỗi cú bấm — và máy thật yếu hơn máy đo.')}`) },

  /* 8 */ { t: 'Đo trên đúng màn hình người dùng dùng: /bac-si?nhieu=200', body: two(
    anh('rx-08', 'danh-sach-200.jpg', { w: 600, url: 'localhost:4173/bac-si?nhieu=200 · vite preview', cap: '6 bác sĩ thật + 194 bác sĩ giả, tất định' }),
    `${list([
      '<code>taoBacSiGia(n)</code>: sinh tên, chuyên khoa, số năm theo công thức — chạy lại luôn ra cùng danh sách ⇒ số đo so được.',
      '<code>?nhieu=200</code> trên URL (trình duyệt) · <code>datLaiDuLieu(200)</code> (test).',
      '<code>DoRender</code> bọc <code>KhuBacSi</code>; nhật ký lộ ra <code>window.__nhatKyDo</code> cho Playwright đọc.',
      'React DevTools → Profiler → ⚙ “Record why each component rendered” cho cùng câu trả lời bằng giao diện.',
    ])}
     ${box('warn', 'Ảnh DevTools không chụp được trên máy dựng bài (extension) — bạn tự làm ở máy: xem mục ⏳ trong bài.')}`) },

  /* ───── 8.2 ───── */
  /* 9 */ { t: 'memo: props giống hệt lần trước thì bỏ qua cả component', body: `${cayThe(true)}
    ${two(
      yaml([
        ['export const TheBacSi = memo(', ''],
        ['  function TheBacSi({ bacSi, laYeuThich,', ''],
        ['    onDoiYeuThich, … }: TheBacSiProps) {…}', 'thân giữ nguyên'],
        [');', ''],
      ], { fs: 15 }),
      t(['+ [bam tim] TheBacSi chạy: 1 lần — thẻ thật sự đổi: 1', '+ [go "h"] TheBacSi chạy: 0 | thẻ trên màn hình: 162'], 'cùng test, sau khi thêm memo', 13.5))}` },

  /* 10 */ { t: 'Hàm hay object MỚI mỗi lần render làm memo vô dụng', body: two(
    `${bars([
      { l: 'không memo', sub: 'hàm mới mỗi render', v: 200, txt: '200 thẻ', c: 'red' },
      { l: 'memo + hàm mới', sub: 'onDoi={doi}', v: 200, txt: '200 thẻ', c: 'red' },
      { l: 'memo + object mới', sub: 'bacSi={{ ...bs }}', v: 200, txt: '200 thẻ', c: 'red' },
      { l: 'memo + useCallback', sub: 'onDoi={doiOnDinh}', v: 1, txt: '1 thẻ', c: 'grn' },
    ], { lw: 250, max: 200 })}`,
    `${yaml([
      ['const doi = (id) => setYeuThich(…);', '✗ hàm khác mỗi lần'],
      ['', ''],
      ['const doiOnDinh = useCallback(', ''],
      ['  (id) => setYeuThich(…),', ''],
      ['  [],', 'set của useState không đổi'],
      [');', '✓ cùng một hàm'],
    ], { fs: 15 })}
     ${box('info', 'memo so <strong>từng prop</strong> bằng <code>Object.is</code>: hai hàm giống hệt về chữ vẫn là hai object khác nhau ⇒ “đổi”.')}`) },

  /* 11 */ { t: 'useMemo cho bộ lọc 200 bác sĩ: 0,1 ms — không đáng', body: two(
    `${t(['[locBacSi] 200 bác sĩ: 96 µs mỗi lần (0.096 ms)', '[locBacSi] 1000 bác sĩ: 475 µs mỗi lần (0.475 ms)'], 'vitest · đo 2000 lần, lấy trung bình', 14)}
     ${table(['Dùng', 'Khi', 'Đừng khi'], [
      ['<code>memo</code>', 'con nặng, cha render thường xuyên, props ổn định', 'props luôn đổi'],
      ['<code>useCallback</code>', 'hàm truyền cho con memo / nằm trong deps', 'con không memo'],
      ['<code>useMemo</code>', 'phép tính đo được ≥ ~1 ms, hoặc cần giữ tham chiếu', 'phép tính rẻ'],
    ], { sm: true })}`,
    `${box('tip', 'Ngưỡng react.dev gợi ý: <code>console.time</code> một phép tính ≥ <strong>1 ms</strong> mới đáng nghĩ tới <code>useMemo</code>. Bộ lọc của ta: 0,1 ms ở 200 thẻ.')}
     ${box('warn', 'useMemo không miễn phí: mỗi render vẫn phải so deps, và giữ kết quả cũ trong bộ nhớ.')}
     ${box('info', 'Khi nào useMemo <em>cần</em>: giữ <strong>cùng một object/mảng</strong> để truyền cho con memo hoặc đưa vào deps của effect.')}`) },

  /* 12 */ { t: 'memo(TheBacSi) trong app: bấm ♡ từ 10,1 ms xuống 1,9 ms', body: two(
    bars([
      { l: '200 thẻ — chưa memo', v: 10.1, txt: '10,1 ms', c: 'red' },
      { l: '200 thẻ — memo', v: 1.9, txt: '1,9 ms', c: 'grn' },
      { l: '1000 thẻ — chưa memo', v: 39.8, txt: '39,8 ms', c: 'red' },
      { l: '1000 thẻ — memo', v: 5.1, txt: '5,1 ms', c: 'grn' },
    ], { lw: 240, max: 40 }),
    `${t(['[profiling · memo(TheBacSi)] CPU chậm 4× · 1000 bác sĩ', '  bấm ♡: actualDuration trung vị = 5.1 ms', '        baseDuration = 18.1 ms', '  gõ "h": actualDuration = 26.8 ms'], 'Chromium 149 · actualDuration trung vị của 7 lần bấm', 13.5)}
     ${box('info', 'Gõ tìm gần như không đổi (40,6 → 26,8 ms với 1000 thẻ): chi phí ở chỗ <strong>gỡ</strong> hàng trăm thẻ khỏi DOM, không phải chỗ render thừa. memo không sửa được thứ nó không nhắm tới.')}`) },

  /* 13 */ { t: 'Compiler qua Babel 8 bỏ qua TheBacSi mà không báo lỗi', body: two(
    `${t(['$ npm ls @babel/core', '└── @babel/core@8.0.6', '$ node do/kiem-compiler.mjs …TheBacSi.tsx …KhuBacSi.tsx', '! TheBacSi.tsx: CompileError — (BuildHIR::lowerAssignment)', '!   Expected object property value to be an LVal,', '!   got: AssignmentPattern', '+ KhuBacSi.tsx · KhuBacSi: ĐÃ biên dịch (57 ô nhớ)'], 'babel-plugin-react-compiler 1.0.0', 13)}
     ${box('bad', 'Build xanh, app chạy, không một dòng cảnh báo. Chỉ <strong>logger</strong> của compiler mới nói ra — và Chromium đo được: không nhanh hơn chút nào (10,7 ms).')}`,
    `${t(['$ npm i -D @babel/core@7', '$ node do/kiem-compiler.mjs …', '+ TheBacSi: ĐÃ biên dịch (30 ô nhớ)', '+ KhuBacSi: ĐÃ biên dịch (57 ô nhớ)'], 'cùng file, @babel/core 7.29.7', 13.5)}
     ${box('tip', 'Chỗ vấp: prop có giá trị mặc định (<code>noiBat = false</code>). Cùng file, <code>@babel/core</code> 7 thì biên dịch được. Bật compiler xong phải <strong>đo lại</strong>, đừng tin là nó đã chạy.')}`) },

  /* 14 */ { t: 'Compiler tự nhớ: không memo tay, bấm ♡ vẫn còn 2,6 ms', body: two(
    table(['Chromium, CPU 4×, bấm ♡', '200 thẻ', '1000 thẻ'], [
      ['Chưa làm gì', '-10,1 ms', '-39,8 ms'],
      ['<code>memo(TheBacSi)</code> viết tay', '+1,9 ms', '+5,1 ms'],
      ['React Compiler (Babel 8 — bị bỏ qua)', '-10,7 ms', '-42,1 ms'],
      ['React Compiler (Babel 7)', '+2,6 ms', '+7,5 ms'],
    ]),
    `${t(['[bam tim] TheBacSi chạy: 200 lần', '[onRender] … update actualDuration=2.8ms', '  baseDuration=8.0ms'], 'vitest + compiler: thẻ VẪN được gọi 200 lần', 13.5)}
     ${box('info', 'Compiler không chặn việc gọi hàm con; nó nhớ JSX <em>bên trong</em> mỗi thẻ ⇒ 199 thẻ trả lại kết quả cũ, React bỏ qua cây con của chúng. Chương 12 bật compiler cho cả app và đo kỹ.')}`) },

  /* 15 */ { t: 'Chọn công cụ bằng số đo, không bằng thói quen', body: cards([
    { ic: '📏', t: 'Chưa đo', d: 'không tối ưu gì. Viết code rõ ràng trước.', c: 'dim' },
    { ic: '🧩', t: 'Con render thừa, tốn thật', d: '<code>memo</code> cho con + props ổn định (<code>useCallback</code>, dữ liệu từ cache/store).', c: 'vio' },
    { ic: '🧮', t: 'Phép tính ≥ 1 ms', d: '<code>useMemo</code> với đúng deps.', c: 'grn' },
    { ic: '🤖', t: 'Dự án mới, React 19', d: 'bật React Compiler, kiểm bằng logger, rồi đo lại.', c: 'rx' },
    { ic: '📜', t: 'Danh sách hàng nghìn dòng', d: 'memo không đủ: virtualization (Chương 13).', c: 'amb' },
    { ic: '🐢', t: 'Tải trang chậm', d: 'không phải chuyện render: chia bundle (Bài 8.3).', c: 'ora' },
  ], 3) },

  /* ───── 8.3 ───── */
  /* 16 */ { t: 'Một file JS 489 kB cho mọi trang — 110 kB chỉ form cần', body: two(
    bars(goi, { lw: 250, max: 210 }),
    `${t(['$ npx vite build', 'dist/assets/browser-CKZESbvw.js  426.22 kB', '! dist/assets/index-Bwl2_UuE.js  489.26 kB', '                            │ gzip: 153.16 kB'], 'trước Chương 8', 13.5)}
     ${box('info', 'Đọc bằng sourcemap (<code>do/phan-tich-bundle.mjs</code>): <strong>zod + react-hook-form + resolvers ≈ 110 kB</strong> chỉ phục vụ trang <code>/dat-lich</code>, mà ai mở trang chủ cũng phải tải.')}
     ${box('tip', '<code>browser-*.js</code> (MSW) đã là file riêng nhờ <code>import()</code> trong <code>main.tsx</code> — code splitting đầu tiên của app, có từ Chương 6.')}`) },

  /* 17 */ { t: 'import() trong hàm lazy là một điểm cắt: mỗi trang một file', body: two(
    yaml([
      ['{', ''],
      ["  path: 'dat-lich/:khungGioId',", ''],
      ['  lazy: {', 'React Router 8.4: dạng object'],
      ['    Component: async () =>', 'gọi khi cần tới'],
      ["      (await import('@/pages/TrangDatLich'))", 'điểm cắt'],
      ['        .TrangDatLich,', ''],
      ['  },', ''],
      ['},', ''],
    ], { fs: 15 }),
    `${t(['$ npx vite build', 'TrangDatLich-Ci8maIVZ.js    1.79 kB', 'form-DYeHmiCh.js          114.18 kB', '+ index-CuDD-_CN.js        230.11 kB', 'browser-ub9bx-xj.js       426.22 kB'], 'sau khi tách (rút gọn)', 14)}
     ${box('good', 'JS nạp tĩnh lúc mở app: 489,3 kB → ≈ 374 kB (index + 3 file dùng chung trong <code>modulepreload</code>).')}`) },

  /* 18 */ { t: 'Barrel kéo zod về file đầu — lazy route cũng không cứu được', body: two(
    `${table(['Bước', 'index-*.js', 'tải ngay', 'zod + RHF'], [
      ['Chưa lazy', '489,26 kB', '489,26 kB', 'index'],
      ['Lazy 3 trang, vẫn một cửa <code>index.ts</code>', '!344,67 kB', '-489,13 kB', '-vẫn index'],
      ['Tách cửa <code>./form</code>', '+230,11 kB', '+≈ 374 kB', '+form-*.js'],
    ], { sm: true })}
     ${box('info', '“Tải ngay” = file vào + các chunk có <code>modulepreload</code> trong <code>index.html</code>. Lần thử đầu chỉ xếp lại thư viện sang nhiều file hơn.')}`,
    `${yaml([
      ['// features/dat-lich/index.ts — cửa NHẸ', ''],
      ["export { ChonKhungGio } from './ChonKhungGio';", 'trang chi tiết cần'],
      ["export { docNgay } from './doc-ngay';", ''],
      ["export { useKhungGio } from './useKhungGio';", ''],
      ['', ''],
      ['// features/dat-lich/form.ts — cửa NẶNG', ''],
      ["export { FormDatLich } from './FormDatLich';", 'kéo RHF + zod'],
      ["export { datLichSchema } from './schema';", ''],
    ], { fs: 13.5 })}
     ${box('warn', 'Trang chi tiết (tải ngay) import <code>ChonKhungGio</code> qua cửa chung ⇒ cửa đó re-export form ⇒ zod vào file đầu.')}`) },

  /* 19 */ { t: 'Route lazy đổi hai hành vi mà test cũ đang dựa vào', body: two(
    `${t(['! AssertionError: expected "/bac-si/bs-2"', '!   to be "/dat-lich/bs-2-2026-10-01-1400"', '# URL chỉ đổi SAU khi tải xong mã trang', '+ sửa: đợi findByRole(heading) rồi mới hỏi URL'], 'test Chương 7 đỏ sau khi thêm lazy', 13.5)}
     ${box('info', 'Bấm link tới route lazy: router ở trạng thái <code>loading</code>, <strong>trang cũ vẫn hiện</strong> tới khi file JS về. <code>useNavigation()</code> cho biết để hiện “Đang mở trang…”.')}`,
    `${t(['TRƯỚC: path,lazy | lazy: object', '! SAU:   path,lazy | lazy: {} | Component: undefined'], 'router GHI vào object lazy của bạn', 13.5)}
     ${yaml([
      ['export function taoRoutes(): RouteObject[] {', ''],
      ['  return [ … ];', 'mảng MỚI mỗi lần gọi'],
      ['}', ''],
      ['export const routes = taoRoutes();', 'main.tsx'],
      ['// test: createMemoryRouter(taoRoutes(), …)', ''],
    ], { fs: 14 })}`) },

  /* 20 */ { t: 'React.lazy: khai ở cấp module, không khai trong component', body: two(
    yaml([
      ["const HuongDan = lazy(() => import('./HuongDanKham'));", '✓ một lần'],
      ['', ''],
      ['<Suspense fallback={<p role="status">Đang tải…</p>}>', ''],
      ['  <HuongDan />', ''],
      ['</Suspense>', ''],
      ['', ''],
      ['function Nut() {', ''],
      ['  const HuongDan = lazy(() => import(…));', '✗ loại MỚI mỗi render'],
      ['}', ''],
    ], { fs: 14 }),
    `${t(['[lazy] ngay sau khi bấm: Đang tải hướng dẫn…', '[lazy] nội dung hiện sau ~400 ms | fallback: đã gỡ', '+ [lazy khai ở cấp module] 3 lần bấm ⇒ "Đang tải…": 0 lần', '! [lazy khai TRONG component] … "Đang tải…": 3 lần'], 'vitest · bai3.test.tsx', 13.5)}
     ${box('tip', 'Chỉ tải lười thứ <strong>ít người mở và đủ nặng</strong>. Một file 0,6 kB đổi lấy một vòng mạng là lỗ.')}`) },

  /* 21 */ { t: 'Ảnh lazy: 57 thay vì 200 ảnh — nếu có width/height', body: two(
    bars([
      { l: 'eager (mặc định)', sub: 'lúc mở trang', v: 3587, txt: '200 ảnh · 3587 kB', c: 'red' },
      { l: 'lazy + width/height', sub: 'lúc mở trang', v: 1003, txt: '57 ảnh · 1003 kB', c: 'grn' },
      { l: 'lazy, THIẾU width/height', sub: 'lúc mở trang', v: 1971, txt: '111 ảnh · 1971 kB', c: 'amb' },
    ], { lw: 250, max: 3600 }),
    `${kpis([{ v: '0,000', l: 'CLS — có width/height', c: 'grn' }, { v: '0,348', l: 'CLS — thiếu (kém > 0,25)', c: 'red' }])}
     ${yaml([
      ['<img src={…} alt=""', 'ảnh trang trí: alt rỗng'],
      ['  width={96} height={96}', 'giữ chỗ trước'],
      ['  loading="lazy" decoding="async" />', ''],
    ], { fs: 14.5 })}
     ${box('warn', 'Thiếu kích thước: ảnh chưa tải cao 0 px ⇒ nhiều ảnh lọt vào vùng “gần màn hình” hơn (111), và trang nhảy khi ảnh về.')}`) },

  /* ───── 8.4 ───── */
  /* 22 */ { t: 'Ô giờ bằng div: axe 0 lỗi, bàn phím 0 cách chọn', body: two(
    table(['Bộ chọn giờ', 'axe', 'điểm dừng Tab', 'Space rồi →'], [
      ['<code>&lt;div onClick&gt;</code>', '0 lỗi', '-không có', '-không chọn được'],
      ['<code>&lt;input type="radio"&gt;</code>', '0 lỗi', '+1', '+08:00 → 09:30'],
      ['ARIA tự làm (roving tabindex)', '0 lỗi', '+1', '+08:00 → 09:30'],
    ], { sm: true }),
    `${box('bad', 'Người dùng bàn phím, trình đọc màn hình, công tắc hỗ trợ: <strong>không có cách nào chọn giờ</strong>. Máy quét tự động không thấy vì div không vi phạm luật nào — nó chỉ không làm gì cả.')}
     ${box('tip', 'Kiểm tay 30 giây: rút chuột, bấm Tab. Không tới được = hỏng.')}`) },

  /* 23 */ { t: 'Dùng thẻ HTML có sẵn trước khi nghĩ tới ARIA', body: two(
    `${yaml([
      ['<fieldset>', 'nhóm có tên'],
      ['  <legend>Chọn giờ khám</legend>', ''],
      ['  <label>', ''],
      ['    <input type="radio" name="gio-kham"', ''],
      ['      checked={g === chon}', ''],
      ['      onChange={() => chon(g)} />', ''],
      ['    {g}', ''],
      ['  </label>', ''],
      ['</fieldset>', '≈ 15 dòng, phím mũi tên sẵn'],
    ], { fs: 14.5 })}`,
    `${list([
      '<strong>Radio thật</strong>: Tab vào nhóm MỘT lần, ← → đổi lựa chọn, trình đọc màn hình đọc “1 trên 4, đã chọn”.',
      '<strong>ARIA tự làm</strong>: <code>role="radiogroup"</code>, <code>role="radio"</code>, <code>aria-checked</code>, <code>tabIndex</code> luân phiên, tự bắt ← → Home End ≈ 45 dòng.',
      'Luật số 1 của ARIA: có thẻ HTML làm được thì <strong>dùng thẻ đó</strong>.',
    ])}
     ${box('warn', '<code>role="radio"</code> mà thiếu <code>aria-checked</code> ⇒ axe: <code>aria-required-attr (critical)</code>.')}`) },

  /* 24 */ { t: 'Năm lỗi hay gặp: axe bắt ba, bỏ lọt hai', body: two(
    table(['Mẫu', 'axe-core 4.13.0'], [
      ['<code>&lt;img&gt;</code> thiếu alt', '+image-alt (critical)'],
      ['<code>role="radio"</code> thiếu aria-checked', '+aria-required-attr (critical)'],
      ['nhảy cấp tiêu đề h2 → h4', '+heading-order (moderate)'],
      ['ô nhập chỉ có placeholder', '-bỏ lọt (0 lỗi)'],
      ['nút chỉ có “♡”', '-bỏ lọt (0 lỗi)'],
    ], { sm: true }),
    `${box('info', 'axe coi placeholder là “tên tạm” và “♡” là tên hợp lệ. Nhưng placeholder biến mất khi gõ, còn “♡” không nói nút làm gì (trình đọc màn hình đọc tên ký tự, không đọc “yêu thích”). <strong>Máy kiểm có tên; người kiểm tên có nghĩa.</strong>')}
     ${box('tip', 'Nút trái tim của app có <code>aria-label="Yêu thích BS. …"</code> từ Chương 2 — đúng cách.')}`) },

  /* 25 */ { t: 'Trong app: axe bắt tương phản 4,34:1 và một div mang aria-label', body: two(
    `${t(['/  ✗ color-contrast (serious) × 2', '   #64748b trên #f1f5f9 = 4.34 (cần 4.5)', '# sau khi sửa (Chromium, WCAG 2.2 A + AA):', '+ /  0 lỗi · /bac-si 0 · /bac-si/bs-2 0 · /dang-nhap 0'], 'do/do-axe.mjs · @axe-core/playwright 4.13.0', 13.5)}
     ${box('warn', 'Sửa màu trong <code>app.css</code> không ăn: <code>index.css</code> nạp SAU và đè lại. Đo lại mới thấy.')}`,
    `${t(['[axe] aria-prohibited-attr (serious)', '<div class="lua-chon" aria-busy="true"', '     aria-label="Đang tải khung giờ">', 'aria-label attribute cannot be used on a', 'div with no valid role attribute.'], 'jsdom · quét LÚC ĐANG TẢI', 13)}
     ${box('info', 'Khung xương từ Chương 6. Chromium quét sau khi tải xong nên không thấy — hãy quét cả trạng thái đang tải. Sửa: thêm <code>role="status"</code>.')}`) },

  /* 26 */ { t: 'Bàn phím: link “Bỏ qua”, nhóm ngày đổi bằng phím mũi tên', body: two(
    `${anh('rx-08', 'bo-qua.jpg', { w: 520, h: 130, url: 'localhost:4173/bac-si/bs-2 · Tab lần 1', cap: 'Link đầu trang, chỉ hiện khi có focus' })}
     ${anh('rx-08', 'chon-ngay.jpg', { w: 520, h: 195, url: 'localhost:4173/bac-si/bs-2 · focus 01/10 rồi →', cap: 'Viền focus cam; URL thành ?ngay=2026-10-02' })}`,
    `${t(['[trước] Tab tới giờ khám đầu tiên: 11 lần', '  … 8. button "01/10/2026" 9. "02/10…" 10. "03/10…"', '[sau] Tab tới giờ khám đầu tiên: 10 lần', '  … 9. input "radio 01/10/2026" 10. a "08:00 · …"', '+ Tab → Enter ("Bỏ qua") ⇒ main#noi-dung,', '+   thêm 4 lần Tab tới giờ khám', '+ focus 01/10 rồi → : URL = ?ngay=2026-10-02'], 'Chromium · do/do-ban-phim.mjs', 12.5)}`) },

  /* 27 */ { t: 'Sai lầm hay gặp ở Chương 8', body: cards([
    { ic: '🎯', t: 'Tối ưu trước khi đo', d: 'useCallback khắp nơi, không ai biết có nhanh hơn. Đo → sửa MỘT chỗ → đo lại.', c: 'red' },
    { ic: '🧪', t: 'Đo trên bản build thường', d: 'Profiler im lặng (0 commit). Dùng --mode profiling hoặc bản dev để đọc số.', c: 'amb' },
    { ic: '🔁', t: 'memo + hàm/object mới', d: 'onDoi={() => …}, bacSi={{ ...bs }} ⇒ 200 thẻ vẫn chạy.', c: 'vio' },
    { ic: '🤖', t: 'Tin Compiler đã chạy', d: '@babel/core 8 ⇒ TheBacSi bị bỏ qua, không báo. Bật logger, đo lại.', c: 'pnk' },
    { ic: '📦', t: 'Lazy mà vẫn qua barrel', d: 'một index.ts re-export form ⇒ zod ở lại file đầu.', c: 'ora' },
    { ic: '⌨️', t: 'axe xanh là xong', d: 'div onClick: 0 lỗi axe, 0 cách chọn bằng phím. Rút chuột ra thử.', c: 'blu' },
  ], 3) },

  /* 28 */ { t: 'Bảng tra nhanh Chương 8', body: table(['Cần…', 'Dùng', 'Nhớ'], [
    ['Biết vùng nào chậm', '<code>&lt;Profiler onRender&gt;</code> · DevTools Profiler', 'build thường không đo; --mode profiling'],
    ['Biết ai render, vì sao', 'bộ đếm dev · “Record why each component rendered”', 'đo trên máy chậm (CPU 4×)'],
    ['Bỏ qua con có props y hệt', '<code>memo(Component)</code>', 'so Object.is từng prop'],
    ['Giữ một hàm qua các render', '<code>useCallback(fn, deps)</code>', 'chỉ có ích khi con được memo'],
    ['Nhớ kết quả phép tính', '<code>useMemo(() =&gt; …, deps)</code>', 'đáng khi ≥ 1 ms'],
    ['Tách mã theo trang', 'route <code>lazy: { Component: () =&gt; import() }</code>', 'tách cả barrel; test đợi trang hiện'],
    ['Tải lười một khối', '<code>lazy()</code> cấp module + <code>&lt;Suspense&gt;</code>', 'không khai lazy trong component'],
    ['Ảnh không làm chậm trang', '<code>loading="lazy"</code> + <code>width</code>/<code>height</code>', 'ảnh đầu trang: đừng lazy'],
    ['Dùng được bằng phím', '<code>button</code>, <code>a</code>, <code>input</code>, <code>fieldset</code> thật', 'ARIA chỉ khi không có thẻ'],
    ['Kiểm tự động', 'axe-core (jsdom) + @axe-core/playwright', 'bắt ~ một phần; còn lại thử tay'],
  ], { sm: true }) },

  /* 29 */ { t: 'Tự gõ tiếp dự án: bốn bước, 20 test tiêu chí xanh', body: two(
    steps([
      ['8.1 — đo', '<code>taoBacSiGia</code>, <code>?nhieu=200</code>, <code>DoRender</code>, <code>useDemRender</code>'],
      ['8.2 — memo đúng chỗ', '<code>memo(TheBacSi)</code>: bấm ♡ ⇒ 1 thẻ chạy lại'],
      ['8.3 — tải lười', '3 route lazy, cửa <code>./form</code>, <code>taoRoutes()</code>, “Đang mở trang…”'],
      ['8.4 — bàn phím', 'nhóm radio ngày, link “Bỏ qua”, tương phản, khung xương'],
    ]),
    `${t(['# điểm xuất phát (sau 8.1): tiêu chí 8.2', '!  Tests  2 failed | 1 passed (3)', '# trước 8.4: a11y.test.tsx', '!  Tests  3 failed | 3 passed (6)', '# xong cả bốn bước:', '$ npx tsc -b && npx vitest run src/app src/features', '+  Test Files  3 passed (3)', '+       Tests  20 passed (20)', '$ npx vite build', '+ index-C1QXkpWE.js  230.47 kB │ gzip: 72.62 kB'], 'tiêu chí đạt', 13)}`) },
]);
