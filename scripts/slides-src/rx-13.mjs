/**
 * React · Deck rx-13 — Chương 13: Mẫu thiết kế & kiến trúc.
 *
 * MỌI số liệu/output trên slide là THẬT, chạy 26/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch13
 * (chép từ ảnh chụp sau-ch10, 145 test xanh → 181 test sau chương) và bản thử Tailwind SCRATCH/rx/du-an/ch13-tailwind —
 * react 19.3.0 · vite 8.3.1 · typescript 6.0.3 · vitest 5.0.2 · @tanstack/react-virtual 3.14.13 · dompurify 3.4.16 ·
 * tailwindcss 4.3.3 · react-router 8.4.0 · Chromium 149 (playwright-core) · Node 22.21.0 (ICU 77.1).
 *   do/ch13-css.mjs (style thật của .hang-nut) · do/ch13-ao.mjs (5000 bác sĩ, trước/sau, CPU thường và chậm 4×)
 *   do/ch13-cuon-ao.mjs (danh sách ảo khi cuộn) · do/ch13-xss.mjs (ba cách hiển thị một chuỗi bị chèn mã)
 *   do/ch13-intl.mjs (Intl) · do/ch13-chup.mjs (ảnh)
 * Ảnh chụp: scripts/slides-src/rx-anh/rx-13/*.jpg.
 */
import {
  S, cover, cards, box, table, two, list, mindmap, term as rxTerm, yaml, sv, R, T, A, anh, steps, kpis, vs, compTree, bars,
} from './_rx-chung.mjs';

export const deck = { key: 'rx-13', code: 'REACT · CHƯƠNG 13', title: 'Mẫu thiết kế & kiến trúc', sub: 'React · Chương 13' };

const t = (lines, title, fs = 14) => rxTerm(lines, { title, dir: '~/phong-kham', fs });

/* ───────── Slide 16 — danh sách ảo: khung nhìn, vùng vẽ dư, phần chưa vẽ ───────── */
const khungAo = () => {
  let s = '';
  // cột trái: "trang" cao 490.115 px, thu nhỏ
  s += R(40, 10, 150, 380, { c: 'dim', dash: true, r: 8 }) + T(115, 406, 'trang cao ~490.000 px', { fs: 14, c: 'mu', a: 'middle' });
  s += R(40, 170, 150, 44, { c: 'amb', fill: '#221c0c', r: 6 }) + T(115, 197, 'khung nhìn', { fs: 14, c: 'amb', a: 'middle', b: true });
  s += R(40, 156, 150, 72, { c: 'rx', fill: 'none', r: 6, sw: 2 });
  s += A(196, 190, 300, 190, { c: 'mu', dash: true });
  // phóng to bên phải
  const x0 = 310;
  s += R(x0, 20, 560, 50, { c: 'dim', dash: true, r: 8 }) + T(x0 + 280, 51, 'hàng 0 … 1242: CHƯA vẽ (chỉ là chiều cao)', { fs: 15, c: 'mu', a: 'middle' });
  s += R(x0, 82, 560, 44, { c: 'rx', r: 8 }) + T(x0 + 280, 110, 'overscan: 4 hàng vẽ dư phía trên', { fs: 15, c: 'rx', a: 'middle' });
  for (let i = 0; i < 4; i++) {
    const y = 138 + i * 50;
    s += R(x0, y, 272, 42, { c: 'amb', fill: '#221c0c', r: 8 }) + R(x0 + 288, y, 272, 42, { c: 'amb', fill: '#221c0c', r: 8 });
    s += T(x0 + 136, y + 27, `<TheBacSi /> ${2495 + i * 2}`, { fs: 14, mono: true, a: 'middle' }) + T(x0 + 424, y + 27, `<TheBacSi /> ${2496 + i * 2}`, { fs: 14, mono: true, a: 'middle' });
  }
  s += R(x0, 342, 560, 44, { c: 'rx', r: 8 }) + T(x0 + 280, 370, 'overscan: 4 hàng vẽ dư phía dưới', { fs: 15, c: 'rx', a: 'middle' });
  s += R(x0, 398, 560, 50, { c: 'dim', dash: true, r: 8 }) + T(x0 + 280, 429, 'hàng 1255 … 2499: CHƯA vẽ', { fs: 15, c: 'mu', a: 'middle' });
  s += T(x0 + 590, 150, 'cuộn ⇒ virtualizer tính', { fs: 15, c: 'mu' }) + T(x0 + 590, 172, 'lại hàng nào nằm trong', { fs: 15, c: 'mu' }) + T(x0 + 590, 194, 'khung + overscan', { fs: 15, c: 'mu' });
  s += T(x0 + 590, 250, 'mỗi hàng: position absolute', { fs: 14.5, c: 'amb' }) + T(x0 + 590, 272, 'translateY(hang.start)', { fs: 14.5, c: 'amb', mono: true });
  s += T(x0 + 590, 320, 'đo bằng Chromium:', { fs: 14.5, c: 'grn', b: true }) + T(x0 + 590, 342, '30 <article> giữa trang', { fs: 14.5, c: 'grn' }) + T(x0 + 590, 364, '14 thẻ trong khung nhìn', { fs: 14.5, c: 'grn' });
  return sv(1150, 450, s);
};

/* ───────── Slide 12 — hai luật .hang-nut trộn vào nhau ───────── */
const tronCss = () => {
  let s = '';
  s += R(10, 20, 330, 92, { c: 'blu' }) + T(28, 50, 'src/index.css (Chương 1)', { fs: 15, c: 'blu', b: true }) + T(28, 80, '.hang-nut { gap: 8px;', { fs: 14.5, mono: true }) + T(28, 100, '  margin-top: 10px }', { fs: 14.5, mono: true });
  s += R(10, 150, 330, 92, { c: 'vio' }) + T(28, 180, 'src/app/app.css (Chương 10)', { fs: 15, c: 'vio', b: true }) + T(28, 210, '.hang-nut { gap: 14px;', { fs: 14.5, mono: true }) + T(28, 230, '  align-items: center }', { fs: 14.5, mono: true });
  s += A(345, 66, 470, 120, { c: 'blu' }) + A(345, 196, 470, 150, { c: 'vio' });
  s += R(475, 95, 280, 80, { c: 'amb', fill: '#221c0c' }) + T(615, 127, 'MỘT tên lớp toàn cục', { fs: 16, c: 'amb', a: 'middle', b: true }) + T(615, 153, 'thứ tự import quyết định', { fs: 14.5, c: 'mu', a: 'middle' });
  s += A(760, 120, 850, 66, { c: 'red' }) + A(760, 150, 850, 196, { c: 'red' });
  s += R(855, 20, 290, 92, { c: 'red' }) + T(870, 50, 'thẻ bác sĩ', { fs: 15, c: 'red', b: true }) + T(870, 78, 'align-items: center', { fs: 14.5, mono: true, c: 'red' }) + T(870, 100, '(luật của trang KHÁC)', { fs: 13.5, c: 'mu' });
  s += R(855, 150, 290, 92, { c: 'red' }) + T(870, 180, 'trang đổi giờ', { fs: 15, c: 'red', b: true }) + T(870, 208, 'gap 8px · margin-top 10px', { fs: 14, mono: true, c: 'red' }) + T(870, 230, '(muốn 14px, không margin)', { fs: 13.5, c: 'mu' });
  return sv(1150, 250, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 13 — Mẫu thiết kế & kiến trúc', sub: 'Compound component · headless · polymorphic as · custom hook tốt · CSS Modules vs Tailwind · virtualization đo thật · XSS · i18n', chap: 'CHƯƠNG 13' }),

  /* 2 */ { t: 'Bản đồ chương: bốn nhóm mẫu, áp thẳng vào app phòng khám', body: mindmap('Mẫu & kiến trúc', 'refactor thật · đo thật · 145 → 181 test', [
    { t: '13.1 Component dùng lại', d: 'compound Tabs · headless combobox · Nut as', c: 'rx' },
    { t: '13.2 Hook & styling', d: 'hook tốt/xấu · CSS Modules · Tailwind', c: 'vio' },
    { t: '13.3 Danh sách dài', d: '5000 bác sĩ · react-virtual · đo trước/sau', c: 'grn' },
    { t: '13.4 An toàn & ngôn ngữ', d: 'XSS · DOMPurify · i18n · Intl', c: 'amb' },
    { t: '🛠 Dự án', d: 'trang chi tiết có tab · VI/EN · 5000 thẻ mượt', c: 'tea' },
  ]) },

  /* ───── 13.1 ───── */
  /* 3 */ { t: 'Prop cấu hình phình ra; compound chia thành mảnh ghép', body: vs({
    no: { t: 'Một component, mười prop', items: [
      '<code>&lt;Tabs tabs={[{ nhan, noiDung, icon, tat, badge }]} /&gt;</code>',
      'muốn thêm link cạnh tab ⇒ thêm prop <code>phaiDanhSach</code>',
      'muốn bọc tooltip ⇒ thêm prop <code>boc</code>…',
      'mỗi yêu cầu lạ = một prop mới + một nhánh <code>if</code>',
    ] },
    yes: { t: 'Compound: Tabs · Tabs.List · Tabs.Tab · Tabs.Panel', items: [
      'người dùng tự XẾP mảnh như viết HTML',
      'state chung đi NGẦM qua context',
      'thêm link, icon, tooltip: chỉ là JSX thường',
      'cùng kiểu với <code>&lt;select&gt;&lt;option&gt;</code>, Radix, React Aria',
    ] },
  }) },

  /* 4 */ { t: 'Tabs compound: một context, bốn mảnh cùng đọc', body: two(
    compTree({
      w: 620, h: 380, bw: 150, legend: false,
      root: { n: 'Tabs', s: 'context · useState', st: true, kids: [
        { n: 'Tabs.List', s: 'role=tablist · ← →', kids: [{ n: 'Tabs.Tab', s: 'aria-selected', w: 140 }, { n: 'Tabs.Tab', s: 'tabIndex 0/-1', w: 140 }] },
        { n: 'Tabs.Panel', s: 'role=tabpanel', w: 150 },
      ] },
    }),
    `${box('info', 'Không có <code>giaTri</code> ⇒ Tabs tự giữ state (<strong>không điều khiển</strong>). Có <code>giaTri</code> + <code>onDoi</code> ⇒ cha giữ (<strong>điều khiển</strong>) — như <code>&lt;input value&gt;</code>.')}
     ${box('good', 'Trang chi tiết bác sĩ: tab sống trên URL <code>?tab=gioi-thieu</code> ⇒ F5 và gửi link vẫn đúng tab.')}
     ${box('warn', 'Mảnh đứng ngoài <code>&lt;Tabs&gt;</code> ⇒ ném lỗi rõ ràng: “&lt;Tabs.Tab&gt; phải nằm bên trong &lt;Tabs&gt;”.')}`, 'w60') },

  /* 5 */ { t: 'cloneElement chỉ thấy con trực tiếp; context thấy mọi độ sâu', body: two(
    t(['$ npx vitest run src/vi-du/ch13 --reporter=verbose', '+ ✓ cloneElement: Tab là con TRỰC TIẾP ⇒ chạy', '  cloneElement: bọc Tab B trong <span title> …', '[clone] sau khi bấm B: aria-selected của A = true', '        · của B = false', '', '$ npx vitest run src/shared/ui/Tabs.test.tsx', '+ ✓ bọc một Tab trong <span title> (tooltip) vẫn', '+   chạy — context không quan tâm con nằm sâu', '+   bao nhiêu'], 'hai cách làm compound', 13.5),
    `${box('bad', '<code>Children.map</code> + <code>cloneElement</code> “bơm” prop vào con TRỰC TIẾP. Bọc Tab trong <code>&lt;span&gt;</code> hay tách ra component ⇒ nó không nhận prop ⇒ bấm không ăn, <strong>không lỗi nào</strong>.')}
     ${box('good', 'Context: mảnh nào gọi <code>use(NguCanh)</code> cũng đọc được, nằm sâu mấy tầng cũng vậy.')}
     ${box('tip', 'Gặp <code>cloneElement</code> trong mã cũ (thư viện trước 2019) — react.dev xếp nó vào “Legacy APIs”.')}`) },

  /* 6 */ { t: 'Tab đúng chuẩn ARIA: một điểm dừng Tab, mũi tên đổi tab', body: two(
    anh('rx-13', 'chi-tiet-tabs.jpg', { w: 640, url: 'localhost:4173/bac-si/bs-1', cap: 'Chromium, bản build · tab “Giờ khám” mặc định' }),
    `${list(['<code>role="tablist" / "tab" / "tabpanel"</code> + <code>aria-controls</code>, <code>aria-labelledby</code> (id từ <code>useId</code>)', '<strong>roving tabindex</strong>: tab chọn <code>0</code>, tab khác <code>-1</code>', '<code>→ ←</code> vòng lại, <code>Home/End</code>; kích hoạt ngay khi focus', 'panel <code>tabIndex={0}</code>: Tab tiếp theo vào nội dung'])}
     ${box('good', '10 test mới của 13.1 xanh: ARIA, bàn phím, chế độ điều khiển, URL.')}`, 'w60') },

  /* 7 */ { t: 'Headless: hook lo hành vi, component của bạn lo giao diện', body: two(
    anh('rx-13', 'tim-nhanh.jpg', { w: 600, url: 'localhost:4173/', cap: 'gõ “h”, ↓ ↓: mục 2 sáng, focus VẪN ở ô gõ' }),
    yaml([
      ['const cb = useCombobox({', 'không vẽ gì'],
      ['  items: goiY,', 'dữ liệu của bạn'],
      ['  layKhoa: (bs) => bs.id,', ''],
      ['  onChon: (bs) => navigate(…),', ''],
      ['});', ''],
      ['<input {...cb.getInputProps({', 'prop getter'],
      ['  onChange: …setGo })} />', 'GỘP handler'],
      ['<ul {...cb.getListboxProps()}>', 'role=listbox'],
      ['  <li {...cb.getOptionProps(i)}>', 'aria-selected'],
      ['aria-activedescendant', '= id mục sáng'],
    ], { fs: 13.5, lang: 'tsx' }), 'w55') },

  /* 8 */ { t: 'Polymorphic as: TypeScript đổi bộ prop hợp lệ theo thẻ được vẽ', body: two(
    yaml([
      ["type PropRieng<C> = { as?: C; bienThe?: … };", ''],
      ['type NutProps<C extends ElementType> =', ''],
      ['  PropRieng<C> &', ''],
      ['  Omit<ComponentPropsWithRef<C>,', 'prop của thẻ C'],
      ['       keyof PropRieng<C>>;', 'trừ prop riêng'],
      ['', ''],
      ['<Nut onClick={…}>Lưu</Nut>', '<button type=button>'],
      ['<Nut as={Link} to="/bac-si">', '<a href> của Router'],
      ['<Nut as="a" href="tel:1900…">', '<a>'],
    ], { fs: 14, lang: 'tsx' }),
    t(['$ npx tsc -p tsconfig.loi.json --noEmit', "- nut-sai.tsx(9,12): TS2322 … Property 'to' does", '-   not exist on type … PropRieng<"button"> …', "- nut-sai.tsx(10,8): TS2741: Property 'to' is", '-   missing … required in type Omit<LinkProps …>', "- nut-sai.tsx(11,12): TS2322: Type '\"do\"' is not", "-   assignable to type 'BienTheNut | undefined'.", "- nut-sai.tsx(12,12): TS2322: Type 'RefObject<", "-   HTMLAnchorElement | null>' is not assignable", "-   to type 'Ref<HTMLButtonElement> | undefined'."], '4 lỗi thật — cách "as: any" im lặng cả 4', 12.5)) },

  /* ───── 13.2 ───── */
  /* 9 */ { t: 'Hook sao chép state: 4 lần render, một lần trả kết quả sai', body: two(
    yaml([
      ['function useLocXau(ds, ck, q) {', ''],
      ['  const [daLoc, setDaLoc] =', 'bản SAO'],
      ['    useState(ds);', ''],
      ['  useEffect(() => {', 'chạy SAU khi vẽ'],
      ['    setDaLoc(locBacSi(ds, ck, q));', '⇒ render thêm'],
      ['  }, [ds, ck, q]);', ''],
      ['  return daLoc;', ''],
      ['}', ''],
      ['', ''],
      ['const useLocTot = (ds, ck, q) =>', 'tính khi render'],
      ['  locBacSi(ds, ck, q);', ''],
    ], { fs: 14, lang: 'tsx' }),
    t(['$ npx vitest run src/vi-du/ch13/useLocXau.test.tsx', '[XẤU (useEffect)] 4 lần render:', '  q="" → 6 bác sĩ | q="" → 6 bác sĩ |', '! q="vy" → 6 bác sĩ | q="vy" → 1 bác sĩ', '[TỐT (tính khi render)] 2 lần render:', '  q="" → 6 bác sĩ | q="vy" → 1 bác sĩ', '+      Tests  2 passed (2)'], 'đếm từng lần render', 13.5)) },

  /* 10 */ { t: 'Hook tốt: một việc, tham số có tên, trả union phân biệt', body: two(
    yaml([
      ['type KetQuaBacSiDaLoc =', ''],
      ["  | { trangThai: 'dang-tai' }", ''],
      ["  | { trangThai: 'loi'; loi; thuLai }", ''],
      ["  | { trangThai: 'co-du-lieu';", ''],
      ['      tatCa; daLoc; banCu };', ''],
      ['', ''],
      ['function useBacSiDaLoc(', ''],
      ['  { chuyenKhoa, tuKhoa }: BoLoc)', 'object có tên'],
      ['  : KetQuaBacSiDaLoc {', ''],
      ['  const q = useBacSi();', ''],
      ["  if (q.isPending) return { trangThai: 'dang-tai' };", ''],
      ['  …locBacSi(data, …) ngay khi render', ''],
    ], { fs: 13.5, lang: 'tsx' }),
    `${list(['tên <code>use…</code> vì nó GỌI hook; không gọi hook ⇒ viết hàm thường', 'không biết URL, không vẽ gì ⇒ <code>renderHook</code> test thẳng', 'đọc <code>daLoc</code> khi đang tải ⇒ <strong>tsc báo lỗi</strong>, không phải <code>undefined</code> lúc chạy', '<code>KhuBacSi</code> chỉ còn: “trạng thái nào vẽ gì”'])}
     ${box('good', '2 test renderHook + MSW: tải → lọc “nhi”+“vy” ⇒ <code>[\'bs-6\']</code>; 500 ⇒ <code>thuLai()</code> ⇒ có dữ liệu.')}`, 'w55') },

  /* 11 */ { t: 'React Compiler giữ nguyên object mà hook trả về', body: two(
    t(['$ npx vitest run src/vi-du/ch13/danhTinh.test.tsx', '  # CÓ React Compiler (vite.config.ts)', '+ [danh-tinh] object: GIỮ NGUYÊN · hàm tang: GIỮ NGUYÊN', '', '$ npx vitest run -c vitest.khong-compiler.config.ts \\', '    src/vi-du/ch13/danhTinh.test.tsx', '- [danh-tinh] object: MỚI · hàm tang: MỚI'], 'useDemSo() trả { so, tang }', 13.5),
    `${box('info', 'Không có compiler: mỗi lần render hook trả object MỚI ⇒ <code>memo</code>/effect phụ thuộc vào nó chạy lại ⇒ phải tự bọc <code>useMemo</code>/<code>useCallback</code>.')}
     ${box('tip', 'Có compiler (app này, từ Chương 12): đừng rắc <code>useCallback</code> theo thói quen — viết hook cho <strong>đúng</strong>, compiler lo phần <strong>ổn định</strong>.')}
     ${box('warn', 'Thư viện, hay dự án chưa bật compiler: quy tắc cũ vẫn nguyên giá trị.')}`) },

  /* 12 */ { t: 'Hai file cùng tên lớp .hang-nut: style của hai trang trộn vào nhau', body: `${tronCss()}
    ${t(['$ node do/ch13-css.mjs   # Chromium 149 · vite build + preview', '- thẻ bác sĩ (Ch1)     class="hang-nut"        → gap 8px · align-items center · margin-top 10px', '- trang đổi giờ (Ch10) class="hang-nut"        → gap 8px · align-items center · margin-top 10px', '# sau khi trang đổi giờ dùng CSS Module:', '+ thẻ bác sĩ (Ch1)     class="hang-nut"        → gap 8px · align-items normal · margin-top 10px', '+ trang đổi giờ (Ch10) class="_hangNut_1xsw0_3" → gap 14px · align-items center · margin-top 0px'], 'đo style thật', 13)}` },

  /* 13 */ { t: 'CSS Modules: tên lớp riêng từng file, CSS theo chunk trang', body: two(
    yaml([
      ['/* TrangDoiGio.module.css */', ''],
      ['.hangNut { display: flex;', ''],
      ['  gap: 14px; align-items: center; }', ''],
      ['', ''],
      ["import css from './TrangDoiGio.module.css';", 'Vite hỗ trợ sẵn'],
      ['<div className={css.hangNut}>', '→ _hangNut_1xsw0_3'],
    ], { fs: 14, lang: 'tsx' }) + t(['$ npx vite build', 'dist/assets/TrangDoiGio-BleFQ8UH.css   0.06 kB', 'dist/assets/index-D4frP24b.css       10.38 kB', '# ._list_73s38_1 ._tab_73s38_3 … (Tabs.module.css)'], 'build', 13),
    `${list(['không cần công cụ mới: đuôi <code>.module.css</code> là đủ', 'viết CSS thường; tên lớp ngắn, khỏi quy ước BEM', 'CSS của trang lazy nằm trong chunk riêng của trang đó'])}
     ${box('warn', '<code>css.hangnut</code> (gõ sai hoa/thường) ⇒ <strong>tsc im lặng</strong> (kiểu là <code>{ [key: string]: string }</code>) ⇒ <code>className={undefined}</code>. Kiểm bằng mắt hoặc plugin sinh kiểu.')}`) },

  /* 14 */ { t: 'Tailwind hay CSS Modules: đo trên cùng app rồi chọn theo đội', body: two(
    table(['', 'CSS Modules', 'Tailwind v4.3.3'], [
      ['Cài', '+có sẵn trong Vite', '<code>tailwindcss</code> + <code>@tailwindcss/vite</code>'],
      ['Viết ở', 'file <code>.module.css</code> riêng', 'lớp tiện ích ngay trong JSX'],
      ['CSS build (đo)', '10,02 kB · gzip 2,79', '15,32 kB · gzip 4,12'],
      ['Đụng tên', '+không thể', '+không thể (lớp = giá trị)'],
      ['Nhất quán', 'tuỳ kỷ luật (biến CSS)', '+thang màu/khoảng cách sẵn'],
      ['Bẫy đo được', 'tsc không bắt gõ sai tên', '<code>.filter</code>, <code>static</code>… sinh lớp thừa'],
    ], { sm: true }),
    anh('rx-13', 'tailwind-the.jpg', { w: 470, url: 'ch13-tailwind · /bac-si', cap: 'TheBacSi viết lại bằng Tailwind — cùng dáng' }), 'w55') },

  /* ───── 13.3 ───── */
  /* 15 */ { t: 'Vẽ đủ 5000 thẻ: 37.715 nút DOM, 2,8 giây trên máy yếu', body: `${kpis([
    { v: '37.715', l: 'nút DOM · 5000 &lt;article&gt;', c: 'red' },
    { v: '119 ms', l: 'commit dài nhất (CPU thường)', c: 'amb' },
    { v: '2.770 ms', l: 'mở trang, CPU chậm 4×', c: 'red' },
    { v: '33,7 MB', l: 'heap JS sau khi dọn rác', c: 'vio' },
  ])}
    ${t(['$ node do/ch13-ao.mjs --nhieu 5000 --cham 4   # Chromium 149, --mode profiling, trung vị 3 lần', '  mở trang → thấy danh sách : 2770 ms   (commit KhuBacSi dài nhất 521.5 ms)', '  gõ "lan" → Đội ngũ bác sĩ (417): 1407 ms · commit dài nhất 64.2 ms', '  xoá ô tìm → lại 5000: 2496 ms · commit dài nhất 462.1 ms', '  cuộn hết trang (442584 px, 120 bước): 0 khung > 50 ms · khung dài nhất 26 ms'], 'trước — vẽ đủ', 13)}` },

  /* 16 */ { t: 'Virtualization: trang cao như cũ, DOM chỉ vài chục thẻ', body: khungAo() },

  /* 17 */ { t: 'useWindowVirtualizer: đếm hàng, ước lượng, đo lại sau khi vẽ', body: two(
    yaml([
      ['const ao = useWindowVirtualizer({', 'cả trang cuộn'],
      ['  count: Math.ceil(n / SO_COT),', '1 hàng = 2 thẻ'],
      ['  estimateSize: () => 180,', 'đo thật 132–256 px'],
      ['  gap: 16, overscan: 4,', ''],
      ['  scrollMargin: lechTren,', 'header phía trên'],
      ['  measureElement: (el) =>', 'đo thật'],
      ['    el.getBoundingClientRect()', ''],
      ['      .height || 180,', 'jsdom = 0'],
      ['});', ''],
      ['ao.getVirtualItems().map((hang) =>', ''],
      ['  <div data-index={hang.index}', ''],
      ['    ref={ao.measureElement}', ''],
      ['    style={{ transform: …hang.start }}>', ''],
    ], { fs: 13.5, lang: 'tsx' }),
    `${box('info', '<code>@tanstack/react-virtual</code> 3.14.13 — headless (lại là ý tưởng 13.1): nó chỉ tính <strong>hàng nào, ở đâu</strong>; bạn vẽ.')}
     ${box('tip', 'Dưới <code>NGUONG_AO = 500</code> vẫn vẽ đủ. Tìm “lan” còn 417 ⇒ về lưới thường.')}
     ${box('good', 'Mã danh sách ảo tải lười (<code>lazy</code>): 25,81 kB chỉ tải khi thật sự có danh sách dài.')}`, 'w55') },

  /* 18 */ { t: 'React Compiler + virtualizer: cuộn tới giữa trang thì trắng tinh', body: two(
    t(['$ node do/ch13-cuon-ao.mjs   # bản đầu', '  đầu trang  scrollY=     0: 16 <article>', '    (Nguyễn Minh An … (16)) · 8 trong khung', '- giữa trang scrollY=244715: 16 <article>', '-   (Nguyễn Minh An … (16)) · 0 trong khung', '- cuối trang scrollY=489430: 16 <article>', '-   (Nguyễn Minh An … (16)) · 0 trong khung', '', "# thêm 'use no memo' vào DanhSachBacSiAo", '+ giữa trang: 30 <article> ((2487) … (2516))', '+   · 14 thẻ trong khung nhìn', '+ cuối trang: 18 <article> ((4983) … (5000))'], 'Chromium 149 · 1280×900', 13),
    `${box('bad', '<code>useWindowVirtualizer</code> trả <strong>cùng một object</strong> suốt đời component và tự sửa bên trong khi cuộn. Compiler thấy “<code>ao</code> không đổi” ⇒ dùng lại <code>getVirtualItems()</code> cũ.')}
     ${box('good', "<code>'use no memo'</code> ở dòng đầu hàm ⇒ compiler bỏ qua ĐÚNG hàm đó. <code>compiler.test.ts</code> ghi nó vào danh sách bỏ qua có chủ đích.")}
     ${box('tip', 'Test jsdom cũng bắt được: bỏ dòng đó ⇒ 2/3 test danh sách ảo đỏ.')}`) },

  /* 19 */ { t: 'Trước và sau, cùng máy, cùng 5000 bác sĩ, CPU chậm 4×', body: `${bars([
    { l: 'Mở trang — vẽ đủ', v: 2770, txt: '2.770 ms', c: 'red' },
    { l: 'Mở trang — ảo', v: 608, txt: '608 ms', c: 'grn' },
    { l: 'Mở trang — ảo, tải lười', v: 873, txt: '873 ms (+1 request)', c: 'amb' },
    { l: 'Xoá ô tìm — vẽ đủ', v: 2496, txt: '2.496 ms', c: 'red' },
    { l: 'Xoá ô tìm — ảo', v: 161, txt: '161 ms', c: 'grn' },
  ], { lw: 280 })}
    ${table(['CPU chậm 4×', 'Vẽ đủ', 'Ảo', 'Ảo + tải lười'], [
      ['Nút DOM · &lt;article&gt;', '37.715 · 5000', '+194 · 18', '+199 · 18'],
      ['Heap JS', '33,7 MB', '+6,8 MB', '+7,0 MB'],
      ['Commit dài nhất khi mở', '521,5 ms', '+24,7 ms', '+20,5 ms'],
    ], { sm: true })}` },

  /* 20 */ { t: 'Cái giá của danh sách ảo: Ctrl+F, trình đọc màn hình, ngưỡng', body: two(
    anh('rx-13', 'ao-5000.jpg', { w: 560, url: 'localhost:4173/bac-si?nhieu=5000', cap: 'giữa trang: chỉ vài chục thẻ trong DOM' }),
    `${list(['<strong>Ctrl+F</strong> không thấy thẻ chưa vẽ ⇒ trang tự nhắc “dùng ô Tìm theo tên”', 'trình đọc màn hình chỉ “thấy” phần đã vẽ', 'cuộn thật nhanh có thể thấy chỗ trống trong một khung hình (<code>overscan</code> giảm bớt)', 'cuộn trang tĩnh 5000 thẻ KHÔNG giật (0 khung &gt; 50 ms) — lợi ích nằm ở mở trang, lọc, bộ nhớ'])}
     ${box('tip', 'Khi nào dùng: hàng nghìn mục, mở/lọc chậm đo được. Vài trăm mục: phân trang hay “xem thêm” thường đủ.')}`, 'w55') },

  /* ───── 13.4 ───── */
  /* 21 */ { t: 'Một chuỗi bị chèn mã: React thoát ký tự, innerHTML thì chạy', body: `${two(
    anh('rx-13', 'xss-chu.jpg', { w: 540, h: 140, url: '/thu-xss.html?kieu=chu', cap: '&lt;p&gt;{chuoi}&lt;/p&gt; — hiện nguyên văn, mã lạ chạy 0 lần' }),
    anh('rx-13', 'xss-tho.jpg', { w: 540, h: 140, url: '/thu-xss.html?kieu=tho', cap: 'dangerouslySetInnerHTML chưa lọc — mã lạ chạy 1 lần' }))}
    ${t(['$ node do/ch13-xss.mjs   # Chromium 149 · React 19.3.0 · DOMPurify 3.4.16', '  ?kieu=chu → mã lạ chạy 0 lần · <img> trong DOM: 0', '- ?kieu=tho → mã lạ chạy 1 lần · <img> trong DOM: 1', '+ ?kieu=loc → mã lạ chạy 0 lần · <img> trong DOM: 0 · <div class="gioi-thieu"><p>Mụn trứng cá…</p></div>'], 'onerror chỉ tăng bộ đếm vô hại window.__xss', 13)}` },

  /* 22 */ { t: 'DOMPurify + danh sách trắng: giữ định dạng, gỡ thứ chạy được', body: two(
    yaml([
      ['const CAU_HINH = {', ''],
      ["  ALLOWED_TAGS: ['p','br','strong',", 'chỉ thẻ nội dung'],
      ["    'em','ul','ol','li','a'],", ''],
      ["  ALLOWED_ATTR: ['href'],", 'không style, on*'],
      ['};', ''],
      ['export const locHtml = (html) =>', 'hàm thuần'],
      ['  DOMPurify.sanitize(html, CAU_HINH);', ''],
      ['', ''],
      ['<div dangerouslySetInnerHTML=', ''],
      ['  {{ __html: locHtml(html) }} />', 'lọc NGAY tại chỗ'],
    ], { fs: 14, lang: 'tsx' }),
    t(['$ npx vitest run src/shared/ui/HtmlAnToan.test.tsx', '[locHtml] vào: <p>Mụn trứng cá, viêm da cơ địa.</p>', '  <img src="x" onerror="window.__xss = …">', '+ [locHtml] ra : <p>Mụn trứng cá, viêm da cơ địa.</p>', '[locHtml] link: <a>bấm</a>', '+  <a href="https://anTam.vn">web</a>', '+ ✓ giữ định dạng nội dung: <strong>, <ul><li>', '+ ✓ gỡ <img onerror>, <script>, style, href javascript:'], 'test xanh', 13)) },

  /* 23 */ { t: 'href="javascript:…": React 19 thay bằng một đoạn chỉ ném lỗi', body: two(
    t(['$ npx vitest run src/vi-du/ch13/xss.test.tsx', '[react-text] innerHTML = <p>&lt;img src="x"', '   onerror="window.__xss = 1"&gt;</p>', '[raw] innerHTML = <div><img src="x"', '   onerror="window.__xss = 1"></div>', "[href] = javascript:throw new Error('React has", "   blocked a javascript: URL as a security", "   precaution.')", '+      Tests  3 passed (3)'], 'React 19.3.0 · jsdom', 13),
    `${box('good', 'Chuỗi trong <code>{…}</code> luôn là CHỮ; <code>href</code> bắt đầu bằng <code>javascript:</code> bị React thay (react-dom 19.3, hàm <code>sanitizeURL</code>).')}
     ${box('warn', 'Không che được: <code>dangerouslySetInnerHTML</code>, <code>ref.current.innerHTML = …</code>, thư viện markdown không lọc, URL <code>data:</code>, <code>eval</code>.')}
     ${box('tip', 'Link từ người dùng: kiểm bằng <code>new URL(x).protocol</code> ∈ http/https/mailto trước khi render.')}`) },

  /* 24 */ { t: 'i18n: chuỗi vào từ điển, satisfies bắt khoá thiếu và gõ sai', body: two(
    anh('rx-13', 'tieng-anh.jpg', { w: 560, url: 'localhost:4173/bac-si/bs-1?tab=gioi-thieu', cap: 'bấm EN: header, tab, “12 years of experience”, &lt;html lang="en"&gt;' }),
    t(['$ npx tsc -p tsconfig.loi.json --noEmit', "- tu-dien-thieu.ts(20,3): TS2353: Object literal", "-   may only specify known properties, and", "-   ''chiTiet.kinhNghiem.othr'' does not exist …", "- tu-dien-thieu.ts(26,3): TS1360: Type '{ 'app.ten':", "-   string; }' does not satisfy the expected type", "-   'Record<…>'. … is missing the following", '-   properties …: "app.gioMo", "menu.nhan", …'], 'en thiếu/gõ sai khoá', 12.5), 'w50') },

  /* 25 */ { t: 'Intl định dạng theo vùng và theo múi giờ phòng khám', body: `${table(['Intl', 'vi-VN', 'en-US'], [
    ['DateTimeFormat dateStyle full', 'Thứ Năm, 1 tháng 10, 2026', 'Thursday, October 1, 2026'],
    ['giờ (hour numeric)', '20:00 · 7:30', '8:00 PM · 7:30 AM'],
    ['NumberFormat', '5.000 · 1.234,5', '5,000 · 1,234.5'],
    ['currency VND', '350.000 ₫', '₫350,000'],
    ['RelativeTimeFormat', 'Ngày mai · 3 giờ trước', 'tomorrow · 3 hours ago'],
    ['PluralRules 0 · 1 · 2', 'other · other · other', 'other · one · other'],
    ['ListFormat', 'Nội, Nhi và Da liễu', 'Nội, Nhi, and Da liễu'],
  ], { sm: true })}
    ${t(['$ TZ=America/New_York node -e "…DateTimeFormat(\'vi-VN\', {dateStyle, timeStyle}).format(07:30 +07:00)"', '- 20:30 30/9/26          (có timeZone Asia/Ho_Chi_Minh: 07:30 1/10/26)'], 'Node 22.21.0 · ICU 77.1', 13)}` },

  /* 26 */ { t: 'Sai lầm hay gặp ở Chương 13', body: cards([
    { ic: '🧬', t: 'cloneElement cho compound', d: 'bọc con trong <code>&lt;span&gt;</code> ⇒ bấm không ăn, không lỗi.', c: 'red' },
    { ic: '🪞', t: 'Hook sao chép state bằng effect', d: 'render thừa + một lần trả danh sách cũ.', c: 'amb' },
    { ic: '🎨', t: 'Tên lớp toàn cục trùng', d: '<code>.hang-nut</code> của hai chương trộn vào nhau.', c: 'vio' },
    { ic: '📜', t: 'Virtualizer + React Compiler', d: 'cuộn giữa trang: 0 thẻ trong khung. Cần <code>\'use no memo\'</code>.', c: 'pnk' },
    { ic: '💉', t: 'innerHTML chưa lọc', d: 'HTML từ CMS có <code>&lt;img onerror&gt;</code> ⇒ mã lạ chạy.', c: 'ora' },
    { ic: '🕰', t: 'Intl không đặt timeZone', d: 'máy ở New York: 07:30 thành 20:30 hôm trước.', c: 'blu' },
  ], 3) },

  /* 27 */ { t: 'Bảng tra nhanh Chương 13', body: table(['Cần…', 'Dùng', 'Nhớ'], [
    ['Component nhiều mảnh chung state', 'compound + context', 'mảnh ngoài cha ⇒ ném lỗi rõ'],
    ['Hành vi dùng lại, giao diện riêng', 'hook headless + prop getter', 'gộp handler, không đè'],
    ['Một nút vẽ ra a / Link / button', '<code>as</code> + <code>ComponentPropsWithRef&lt;C&gt;</code>', 'không <code>any</code>; test kiểu bằng @ts-expect-error'],
    ['Custom hook', 'một việc · object có tên · union', 'không effect để sao chép state'],
    ['CSS không đụng nhau', '<code>*.module.css</code> hoặc Tailwind', 'đo bundle; tsc không bắt tên sai'],
    ['Hàng nghìn mục', '<code>@tanstack/react-virtual</code>', 'ngưỡng · Ctrl+F · <code>\'use no memo\'</code>'],
    ['HTML từ ngoài', 'DOMPurify + danh sách trắng', 'lọc ngay chỗ <code>__html</code>'],
    ['Link từ người dùng', 'kiểm <code>protocol</code>', 'React 19 chặn <code>javascript:</code> nhưng đừng dựa'],
    ['Đa ngôn ngữ', 'từ điển + <code>satisfies</code> + Intl', '<code>timeZone</code> · <code>&lt;html lang&gt;</code>'],
  ], { sm: true }) },

  /* 28 */ { t: 'Tự gõ tiếp dự án: bốn bước, 36 test mới, 145 → 181', body: two(
    steps([
      ['13.1 — mảnh dùng lại', '<code>Tabs</code> + trang chi tiết có tab trên URL · <code>useCombobox</code> + tìm nhanh · <code>Nut as</code>'],
      ['13.2 — hook & CSS', '<code>useBacSiDaLoc</code> · CSS Module cho trang đổi giờ'],
      ['13.3 — 5000 bác sĩ', '<code>DanhSachBacSiAo</code> tải lười, ngưỡng 500, <code>\'use no memo\'</code>'],
      ['13.4 — an toàn & ngôn ngữ', '<code>HtmlAnToan</code> (DOMPurify) · <code>linkAnToan</code> · từ điển VI/EN · Intl'],
    ]),
    t(['# điểm xuất phát: sau Chương 10 — 30 file · 145 test', '$ npx tsc -b && npx vitest run', '+  Test Files  44 passed (44)', '+       Tests  181 passed (181)', '$ npx vitest run --coverage', '+ All files | 91.85 | 85.66 | 94.04 | 96.3', '$ npx vite build', '  index-*.js 377.60 kB (Ch10: 364.29 kB)', '  DanhSachBacSiAo 25.81 kB · GioiThieuBacSi 28.94 kB'], 'tiêu chí đạt', 13)) },
]);
