import { gallery, slide } from './_slides.mjs';

/**
 * React — Chương 13: Mẫu thiết kế & kiến trúc (soạn 26/09/2026 theo content/courses/react/_HOP-DONG.md, mục 2–7, 4c, 11).
 * Chương MỚI (không có trong khung): rx-13-0-slides (DOCUMENT), rx-13-1-compound-headless, rx-13-2-hook-styling,
 * rx-13-3-danh-sach-dai, rx-13-4-bao-mat-i18n (LESSON), rx-13-5-kiem-tra (QUIZ 10 câu).
 * Mọi mã dài và mọi output trong bài chạy THẬT 26/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch13 — chép từ
 * ảnh chụp sau-ch10 (145 test xanh) rồi refactor theo bốn bài; bản thử Tailwind ở SCRATCH/rx/du-an/ch13-tailwind.
 * Ảnh chụp sau chương: SCRATCH/rx/du-an/sau-ch13 (181 test xanh).
 * (react 19.3.0 · vite 8.3.1 · typescript 6.0.3 · vitest 5.0.2 · @testing-library/react 16.3.3 · react-router 8.4.0 ·
 *  @tanstack/react-query 5.103.3 · @tanstack/react-virtual 3.14.13 · dompurify 3.4.16 · tailwindcss 4.3.3 ·
 *  babel-plugin-react-compiler 1.0.0 · Chromium 149 qua playwright-core · Node 22.21.0 / ICU 77.1).
 * Mã dài trong bài nằm ở hằng SN, output ở hằng OUT — sinh tự động từ chính các file/log đã chạy (gen-sn.mjs).
 * Sơ đồ: mermaid ngay trong bài, 2–3 sơ đồ mỗi bài dạy, nhãn VI ở khối VI, EN ở khối EN. Deck: scripts/slides-src/rx-13.mjs.
 */

const H = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '&#96;').replace(/\$\{/g, '&#36;{');
const pre = (lang, s) => '<pre><code class="language-' + lang + '">' + H(s) + '</code></pre>';
const out = (s) => '<div class="out">' + H(s) + '</div>';
const LINK = (href, ico, title, sub) => '<a class="link-card" href="' + href + '" target="_blank" rel="noopener"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';
/** Link trong site (không mở tab mới). */
const LINK_TRONG = (href, ico, title, sub) => '<a class="link-card" href="' + href + '"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';
/** Sơ đồ mermaid: trang học đọc textContent của <code class="language-mermaid"> rồi vẽ (LearnPageClient → mermaidRuntime). */
const MM = (src) => '<pre><code class="language-mermaid">' + H(src.trim()) + '</code></pre>';

/* ─── Mã trong bài: SINH TỰ ĐỘNG từ dự án thử ch13 (tsc -b sạch + vitest 181 xanh 26/09/2026) — đừng sửa tay ─── */
const SN = {
  tabs: "import { createContext, use, useId, useState, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';\nimport css from './Tabs.module.css';\n\n/**\n * Chương 13 — COMPOUND COMPONENT: một bộ component con dùng chung state NGẦM qua context.\n *   <Tabs macDinh=\"gio-kham\">\n *     <Tabs.List aria-label=\"…\"><Tabs.Tab giaTri=\"gio-kham\">Giờ khám</Tabs.Tab>…</Tabs.List>\n *     <Tabs.Panel giaTri=\"gio-kham\">…</Tabs.Panel>\n *   </Tabs>\n * Người dùng component tự sắp xếp các mảnh (thêm link, icon, bọc div…) mà không cần mười prop cấu hình.\n * Bàn phím theo mẫu ARIA \"Tabs\" (W3C APG): Tab vào MỘT tab đang chọn; ←/→ đổi tab (vòng lại), Home/End về đầu/cuối.\n * Hai chế độ như <input>: không điều khiển (macDinh — Tabs tự giữ state) hoặc điều khiển (giaTri + onDoi — cha giữ).\n */\ninterface NguCanhTabs {\n  dangChon: string;\n  chon: (giaTri: string) => void;\n  idGoc: string;\n}\nconst NguCanh = createContext<NguCanhTabs | null>(null);\n\nfunction useNguCanhTabs(tenManh: string): NguCanhTabs {\n  const nc = use(NguCanh);\n  if (!nc) throw new Error(`<${tenManh}> phải nằm bên trong <Tabs>`);\n  return nc;\n}\n\nconst idTab = (goc: string, giaTri: string) => `${goc}-tab-${giaTri}`;\nconst idPanel = (goc: string, giaTri: string) => `${goc}-panel-${giaTri}`;\n\ntype TabsProps = { children: ReactNode; className?: string } & (\n  | { macDinh: string; giaTri?: never; onDoi?: (giaTri: string) => void } // không điều khiển\n  | { giaTri: string; onDoi: (giaTri: string) => void; macDinh?: never } // điều khiển\n);\n\nexport function Tabs({ macDinh, giaTri, onDoi, children, className }: TabsProps) {\n  const [tuGiu, setTuGiu] = useState(macDinh ?? '');\n  const dangChon = giaTri ?? tuGiu; // có giaTri ⇒ cha quyết định; không có ⇒ state riêng\n  const idGoc = useId(); // id duy nhất cho aria-controls / aria-labelledby, kể cả khi trang có hai bộ Tabs\n  const chon = (moi: string) => {\n    if (giaTri === undefined) setTuGiu(moi);\n    onDoi?.(moi);\n  };\n  return (\n    <NguCanh value={{ dangChon, chon, idGoc }}>\n      <div className={[css.tabs, className].filter(Boolean).join(' ')}>{children}</div>\n    </NguCanh>\n  );\n}\n\nfunction List({ children, ...props }: ComponentProps<'div'>) {\n  const { chon } = useNguCanhTabs('Tabs.List');\n  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {\n    const cac = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('[role=\"tab\"]:not(:disabled)')];\n    const i = cac.findIndex((el) => el === document.activeElement);\n    const dich = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: cac.length - 1 }[e.key];\n    if (dich === undefined || i < 0) return; // phím khác (Tab, Enter…) để trình duyệt tự lo\n    e.preventDefault();\n    const moi = cac[(dich + cac.length) % cac.length]; // vòng lại: ← ở tab đầu ⇒ tab cuối\n    moi.focus();\n    chon(moi.dataset.giaTri!); // \"kích hoạt tự động\": nội dung hiện ngay khi focus tới (APG khuyên khi panel vẽ nhanh)\n  }\n  return (\n    <div role=\"tablist\" className={css.list} onKeyDown={onKeyDown} {...props}>\n      {children}\n    </div>\n  );\n}\n\nfunction Tab({ giaTri, children, ...props }: { giaTri: string } & Omit<ComponentProps<'button'>, 'value'>) {\n  const { dangChon, chon, idGoc } = useNguCanhTabs('Tabs.Tab');\n  const duocChon = dangChon === giaTri;\n  return (\n    <button\n      type=\"button\"\n      role=\"tab\"\n      id={idTab(idGoc, giaTri)}\n      aria-selected={duocChon}\n      aria-controls={idPanel(idGoc, giaTri)}\n      tabIndex={duocChon ? 0 : -1} // \"roving tabindex\": chỉ tab đang chọn nằm trong thứ tự Tab\n      data-gia-tri={giaTri}\n      className={css.tab}\n      onClick={() => chon(giaTri)}\n      {...props}\n    >\n      {children}\n    </button>\n  );\n}\n\n/** giuLai: panel ẩn vẫn GẮN (giữ state bên trong, vd chữ đang gõ) — mặc định KHÔNG: panel ẩn bị gỡ, không tải thừa. */\nfunction Panel({ giaTri, giuLai = false, children }: { giaTri: string; giuLai?: boolean; children: ReactNode }) {\n  const { dangChon, idGoc } = useNguCanhTabs('Tabs.Panel');\n  const hien = dangChon === giaTri;\n  if (!hien && !giuLai) return null;\n  return (\n    <div role=\"tabpanel\" id={idPanel(idGoc, giaTri)} aria-labelledby={idTab(idGoc, giaTri)} tabIndex={0} hidden={!hien} className={css.panel}>\n      {children}\n    </div>\n  );\n}\n\n// Gắn các mảnh vào Tabs ⇒ một import dùng cả bộ: Tabs.List, Tabs.Tab, Tabs.Panel.\nTabs.List = List;\nTabs.Tab = Tab;\nTabs.Panel = Panel;",
  tabsCss: "/* Chương 13: CSS Modules — tên lớp ở đây chỉ có nghĩa TRONG file này. Vite đổi .list thành _list_xxxx lúc build,\n   nên .list của Tabs không bao giờ đụng .list của ai khác (app.css toàn cục thì có thể). */\n.tabs { display: grid; gap: 0; }\n.list { display: flex; gap: 4px; border-bottom: 2px solid #cbd5e1; }\n.tab {\n  font: inherit; font-weight: 600; font-size: 15px; color: #475569; cursor: pointer;\n  background: none; border: 0; border-bottom: 3px solid transparent; margin-bottom: -2px; padding: 8px 14px;\n}\n.tab:hover { color: #0e7490; }\n.tab[aria-selected='true'] { color: #0e7490; border-bottom-color: #0e7490; }\n.panel { padding: 14px 0 0; }\n.panel:focus-visible { outline: 3px solid #b45309; outline-offset: 4px; }",
  tabsTestPhim: "test('bàn phím: Tab vào MỘT tab; → đổi và focus; ← ở đầu vòng về cuối; End/Home', async () => {\n  const user = userEvent.setup();\n  render(<BaTab />);\n  await user.tab();\n  expect(screen.getByRole('tab', { name: 'Giờ khám' })).toHaveFocus();\n  await user.keyboard('{ArrowRight}');\n  expect(screen.getByRole('tab', { name: 'Giới thiệu' })).toHaveFocus();\n  expect(screen.getByRole('tabpanel')).toHaveTextContent('Nội dung B');\n  await user.keyboard('{Home}{ArrowLeft}');\n  expect(screen.getByRole('tab', { name: 'Đánh giá', selected: true })).toHaveFocus();\n  await user.tab(); // Tab tiếp: rời dải tab, vào panel (tabIndex 0) — không đi qua từng tab\n  expect(screen.getByRole('tabpanel')).toHaveFocus();\n});",
  tabsClone: "export function TabsClone({ macDinh, children }: { macDinh: string; children: ReactNode }) {\n  const [chon, setChon] = useState(macDinh);\n  return (\n    <div role=\"tablist\" aria-label=\"Tabs clone\">\n      {Children.map(children, (con) =>\n        isValidElement(con) && con.type === TabCu\n          ? cloneElement(con as ReactElement<TabCuProps>, {\n              dangChon: (con.props as TabCuProps).giaTri === chon,\n              onChon: () => setChon((con.props as TabCuProps).giaTri),\n            })\n          : con,\n      )}\n    </div>\n  );\n}",
  tabsCloneTest: "test('cloneElement: bọc Tab B trong <span title> để có tooltip ⇒ B không bao giờ được chọn', async () => {\n  render(\n    <TabsClone macDinh=\"a\">\n      <TabCu giaTri=\"a\">A</TabCu>\n      <span title=\"Mục mới\">\n        <TabCu giaTri=\"b\">B</TabCu>\n      </span>\n    </TabsClone>,\n  );\n  await userEvent.click(screen.getByRole('tab', { name: 'B' }));\n  console.log('[clone] sau khi bấm B: aria-selected của A =', screen.getByRole('tab', { name: 'A' }).getAttribute('aria-selected'),\n    '· của B =', screen.getByRole('tab', { name: 'B' }).getAttribute('aria-selected'));\n  expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'false');\n});",
  tabsTheoUrl: "const TAB = ['gio-kham', 'gioi-thieu'] as const;\n\n/**\n * <Tabs> ĐIỀU KHIỂN bằng URL (?tab=gioi-thieu). Tách thành component riêng: chỉ nó đọc useSearchParams, nên đổi\n * ?ngay=… (bộ chọn giờ) chỉ vẽ lại nó — các panel là `children` do trang tạo sẵn, React giữ nguyên, không vẽ lại.\n */\nfunction TabsTheoUrl({ children }: { children: ReactNode }) {\n  const [sp, setSp] = useSearchParams();\n  const tab = TAB.find((t) => t === sp.get('tab')) ?? 'gio-kham'; // giá trị lạ trên URL ⇒ về mặc định\n  return (\n    <Tabs\n      giaTri={tab}\n      onDoi={(moi) =>\n        setSp(\n          (cu) => {\n            const sau = new URLSearchParams(cu); // giữ ?ngay=… của bộ chọn giờ\n            if (moi === 'gio-kham') sau.delete('tab');\n            else sau.set('tab', moi);\n            return sau;\n          },\n          { replace: true },\n        )\n      }\n    >\n      {children}\n    </Tabs>\n  );\n}",
  tabsPageTest: "test('mặc định tab \"Giờ khám\": 4 khung giờ; bấm \"Giới thiệu\" ⇒ URL có ?tab=gioi-thieu, panel đổi', async () => {\n  const user = userEvent.setup();\n  const { router } = await veTrangCho('/bac-si/bs-2');\n  const panel = screen.getByRole('tabpanel', { name: 'Giờ khám' });\n  expect(await within(panel).findAllByRole('listitem')).toHaveLength(4);\n  await act(async () => user.click(screen.getByRole('tab', { name: 'Giới thiệu' })));\n  expect(router.state.location.search).toBe('?tab=gioi-thieu');\n  const gioiThieu = screen.getByRole('tabpanel', { name: 'Giới thiệu' });\n  expect(await within(gioiThieu).findByText(/Khám trẻ từ sơ sinh/)).toBeInTheDocument(); // mã tab tải lười (DOMPurify) ⇒ đợi\n  expect(screen.queryByRole('region', { name: 'Chọn giờ khám' })).not.toBeInTheDocument();\n});",
  trangTabs: "        <TabsTheoUrl>\n          <Tabs.List aria-label={t('chiTiet.tabs')}>\n            <Tabs.Tab giaTri=\"gio-kham\">{t('chiTiet.tabGioKham')}</Tabs.Tab>\n            <Tabs.Tab giaTri=\"gioi-thieu\">{t('chiTiet.tabGioiThieu')}</Tabs.Tab>\n          </Tabs.List>\n          <Tabs.Panel giaTri=\"gio-kham\">\n            <ChonKhungGio bacSiId={id} />\n            <Link className=\"nut\" to={duongDan.lichTuan(id)}>\n              Xem lịch trống cả tuần →\n            </Link>\n          </Tabs.Panel>\n          <Tabs.Panel giaTri=\"gioi-thieu\">\n            <Suspense fallback={<p>Đang tải giới thiệu…</p>}>\n              <GioiThieuBacSi id={id} />\n            </Suspense>\n          </Tabs.Panel>\n        </TabsTheoUrl>",
  useCombobox: "import { useId, useState, type ChangeEvent, type KeyboardEvent, type MouseEvent } from 'react';\n\n/**\n * Chương 13 — HEADLESS: hook lo HÀNH VI của một ô gợi ý (combobox theo mẫu ARIA APG) — mở/đóng, mục đang sáng,\n * phím ↑ ↓ Enter Esc, các thuộc tính aria-* — và KHÔNG vẽ gì cả. Component dùng nó tự quyết HTML và CSS.\n * Trả về \"prop getter\": hàm trả bộ prop để rải lên thẻ của bạn ({...getInputProps()}), GỘP với handler của bạn\n * (truyền onChange/onKeyDown vào getter thì cả hai cùng chạy — không cái nào đè cái nào).\n * Cùng ý tưởng với Downshift, React Aria (useComboBox), Headless UI, Base UI — ở đây viết tay để thấy bên trong.\n */\nexport interface TuyChonCombobox<T> {\n  items: T[];\n  layKhoa: (item: T) => string; // khoá ổn định cho id của từng mục\n  onChon: (item: T) => void;\n}\n\nexport function useCombobox<T>({ items, layKhoa, onChon }: TuyChonCombobox<T>) {\n  const id = useId();\n  const [mo, setMo] = useState(false);\n  const [sang, setSang] = useState(-1); // chỉ số mục đang \"sáng\" (chưa chọn), -1 = không mục nào\n  const idMuc = (i: number) => `${id}-muc-${layKhoa(items[i])}`;\n  const dangMo = mo && items.length > 0; // không có gợi ý thì coi như đóng — khỏi hiện hộp rỗng\n  const sangHopLe = sang < items.length ? sang : -1; // items ngắn lại (gõ thêm chữ) ⇒ chỉ số cũ có thể vượt\n\n  const chon = (i: number) => {\n    onChon(items[i]);\n    setMo(false);\n    setSang(-1);\n  };\n\n  return {\n    dangMo,\n    chiSoSang: dangMo ? sangHopLe : -1,\n    getInputProps: (rieng: { onChange?: (e: ChangeEvent<HTMLInputElement>) => void; onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void } = {}) => ({\n      role: 'combobox' as const,\n      'aria-expanded': dangMo,\n      'aria-controls': `${id}-hop`,\n      'aria-autocomplete': 'list' as const,\n      'aria-activedescendant': dangMo && sangHopLe >= 0 ? idMuc(sangHopLe) : undefined, // focus ở LẠI ô gõ; trình đọc màn hình đọc mục sáng\n      autoComplete: 'off',\n      onChange: (e: ChangeEvent<HTMLInputElement>) => {\n        rieng.onChange?.(e);\n        setMo(true);\n        setSang(-1);\n      },\n      onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {\n        rieng.onKeyDown?.(e);\n        if (e.key === 'ArrowDown') {\n          e.preventDefault(); // không cho con trỏ chữ nhảy về cuối\n          setMo(true);\n          if (items.length) setSang((sangHopLe + 1) % items.length);\n        } else if (e.key === 'ArrowUp') {\n          e.preventDefault();\n          if (items.length) setSang(sangHopLe <= 0 ? items.length - 1 : sangHopLe - 1);\n        } else if (e.key === 'Enter' && dangMo && sangHopLe >= 0) {\n          e.preventDefault(); // đang chọn gợi ý ⇒ đừng gửi form\n          chon(sangHopLe);\n        } else if (e.key === 'Escape') {\n          setMo(false);\n          setSang(-1);\n        }\n      },\n      onBlur: () => setMo(false),\n    }),\n    getListboxProps: () => ({ role: 'listbox' as const, id: `${id}-hop` }),\n    getOptionProps: (i: number) => ({\n      role: 'option' as const,\n      id: idMuc(i),\n      'aria-selected': i === sangHopLe,\n      onMouseDown: (e: MouseEvent) => e.preventDefault(), // giữ focus ở ô gõ (không thì blur đóng hộp trước khi click tới)\n      onClick: () => chon(i),\n      onMouseEnter: () => setSang(i),\n    }),\n  };\n}",
  timNhanh: "export function TimNhanhBacSi() {\n  const { data = [] } = useBacSi();\n  const [go, setGo] = useState('');\n  const navigate = useNavigate();\n  const goiY = go.trim() ? locBacSi(data, 'tat-ca', go).slice(0, 6) : []; // tính khi render, không phải state\n  const cb = useCombobox({\n    items: goiY,\n    layKhoa: (bs) => bs.id,\n    onChon: (bs) => {\n      setGo('');\n      void navigate(duongDan.chiTietBacSi(bs.id));\n    },\n  });\n  return (\n    <div className=\"tim-nhanh\">\n      <label htmlFor=\"tim-nhanh\">Tìm nhanh bác sĩ</label>\n      <input id=\"tim-nhanh\" value={go} placeholder=\"Gõ tên, vd: Lan\" {...cb.getInputProps({ onChange: (e) => setGo(e.target.value) })} />\n      {cb.dangMo && (\n        <ul className=\"tim-nhanh-hop\" {...cb.getListboxProps()} aria-label=\"Gợi ý bác sĩ\">\n          {goiY.map((bs, i) => (\n            <li key={bs.id} className={i === cb.chiSoSang ? 'sang' : undefined} {...cb.getOptionProps(i)}>\n              <strong>{bs.ten}</strong> <span>{TEN_CHUYEN_KHOA[bs.chuyenKhoa]}</span>\n            </li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}",
  timNhanhTest: "test('gõ \"h\" ⇒ hộp gợi ý; ↓ ↓ làm sáng mục 2 (aria-activedescendant); Enter ⇒ sang trang bác sĩ', async () => {\n  const user = userEvent.setup();\n  const { router } = veTrang('/');\n  const o = await screen.findByRole('combobox', { name: 'Tìm nhanh bác sĩ' });\n  expect(o).toHaveAttribute('aria-expanded', 'false');\n  await user.type(o, 'h');\n  const hop = await screen.findByRole('listbox', { name: 'Gợi ý bác sĩ' });\n  const muc = screen.getAllByRole('option');\n  expect(muc.map((m) => m.querySelector('strong')!.textContent)).toEqual([\n    'BS. Nguyễn Minh An', 'BS. Trần Thu Hà', 'BS. Phạm Ngọc Lan', 'BS. Hoàng Đức Huy', 'BS. Vũ Thảo Vy', // \"h\" có trong Minh, Thu Hà, Phạm…\n  ]);\n  expect(o).toHaveAttribute('aria-controls', hop.id);\n  await user.keyboard('{ArrowDown}{ArrowDown}');\n  expect(o).toHaveFocus(); // focus Ở LẠI ô gõ\n  expect(o).toHaveAttribute('aria-activedescendant', muc[1].id);\n  expect(muc[1]).toHaveAttribute('aria-selected', 'true');\n  await act(async () => user.keyboard('{Enter}'));\n  expect(router.state.location.pathname).toBe('/bac-si/bs-2');\n});",
  nut: "import type { ComponentPropsWithRef, ElementType } from 'react';\n\n/**\n * Chương 13 — component ĐA HÌNH (polymorphic) qua prop `as`: MỘT kiểu nút, vẽ ra thẻ nào tuỳ chỗ dùng.\n *   <Nut onClick={…}>Lưu</Nut>                        → <button type=\"button\" class=\"nut\">\n *   <Nut as={Link} to=\"/bac-si\" bienThe=\"chinh\">…</Nut> → <a href=\"/bac-si\" class=\"nut nut-chinh\">\n *   <Nut as=\"a\" href=\"tel:1900…\">Gọi</Nut>             → <a href=\"tel:…\">\n * TypeScript đổi bộ prop hợp lệ theo `as`: as={Link} thì BẮT BUỘC `to`; không có `as` thì `to` là lỗi.\n * React 19: ref là prop thường ⇒ ComponentPropsWithRef<C> mang luôn ref đúng kiểu thẻ (không cần forwardRef).\n */\nexport type BienTheNut = 'thuong' | 'chinh' | 'lui' | 'nho';\n\ntype PropRieng<C extends ElementType> = { as?: C; bienThe?: BienTheNut };\n\nexport type NutProps<C extends ElementType = 'button'> = PropRieng<C> & Omit<ComponentPropsWithRef<C>, keyof PropRieng<C>>;\n\nconst LOP: Record<BienTheNut, string> = { thuong: 'nut', chinh: 'nut nut-chinh', lui: 'nut nut-lui', nho: 'nut nut-nho' };\n\nexport function Nut<C extends ElementType = 'button'>({ as, bienThe = 'thuong', className, ...conLai }: NutProps<C>) {\n  const The: ElementType = as ?? 'button'; // biến viết HOA: JSX coi <The> là component/thẻ động, không phải thẻ \"the\"\n  return (\n    <The\n      {...(The === 'button' ? { type: 'button' } : {})} // <button> mặc định là submit — nút trong form sẽ gửi form (Bài 3.1)\n      className={[LOP[bienThe], className].filter(Boolean).join(' ')}\n      {...conLai}\n    />\n  );\n}",
  nutKieu: "export function KiemKieuNut() {\n  const refNut = useRef<HTMLButtonElement>(null);\n  const refLink = useRef<HTMLAnchorElement>(null);\n  return (\n    <>\n      <Nut ref={refNut} onClick={(e) => e.currentTarget.blur()}>Nút thường</Nut>\n      <Nut as={Link} to=\"/bac-si\" ref={refLink} bienThe=\"chinh\">Link của Router</Nut>\n      <Nut as=\"a\" href=\"tel:19001234\">Thẻ a</Nut>\n      {/* @ts-expect-error — không có as={Link} thì <button> không có prop `to` */}\n      <Nut to=\"/bac-si\">Sai</Nut>\n      {/* @ts-expect-error — as={Link} thì `to` là BẮT BUỘC */}\n      <Nut as={Link}>Thiếu to</Nut>\n      {/* @ts-expect-error — bienThe chỉ nhận 4 giá trị */}\n      <Nut bienThe=\"do\">Sai biến thể</Nut>\n      {/* @ts-expect-error — ref của <a> không gắn được vào <button> */}\n      <Nut ref={refLink}>Sai ref</Nut>\n    </>\n  );\n}",
  nutNgayTho: "import type { ElementType, ReactNode } from 'react';\n\n// Cách \"ngây thơ\" hay gặp: as là ElementType, mọi prop khác là any ⇒ tsc im lặng với MỌI lỗi.\ntype NutNgayThoProps = { as?: ElementType; children?: ReactNode; [prop: string]: any };\nexport function NutNgayTho({ as: The = 'button', ...props }: NutNgayThoProps) {\n  return <The {...props} />;\n}\nexport function DungNgayTho() {\n  return (\n    <>\n      <NutNgayTho to=\"/bac-si\">không lỗi — nhưng ra &lt;button to=\"/bac-si\"&gt;, bấm không đi đâu</NutNgayTho>\n      <NutNgayTho as=\"a\" hreff=\"/bac-si\">gõ sai hreff — cũng không lỗi</NutNgayTho>\n    </>\n  );\n}",
  nutDung: "      <TimNhanhBacSi /> {/* Chương 13: ô gợi ý headless */}\n      <Nut as={Link} to={duongDan.bacSi} bienThe=\"chinh\">\n        Xem đội ngũ bác sĩ →\n      </Nut>",
  locXau: "export function useLocXau(danhSach: BacSi[], chuyenKhoa: BoLocChuyenKhoa, tuKhoa: string) {\n  const [daLoc, setDaLoc] = useState<BacSi[]>(danhSach);\n  useEffect(() => {\n    setDaLoc(locBacSi(danhSach, chuyenKhoa, tuKhoa));\n  }, [danhSach, chuyenKhoa, tuKhoa]);\n  return daLoc;\n}",
  locTot: "export function useLocTot(danhSach: BacSi[], chuyenKhoa: BoLocChuyenKhoa, tuKhoa: string) {\n  return locBacSi(danhSach, chuyenKhoa, tuKhoa);\n}",
  locXauTest: "for (const [ten, hook] of [['XẤU (useEffect)', useLocXau], ['TỐT (tính khi render)', useLocTot]] as const) {\n  test(`${ten}: gõ \"vy\" — kết quả qua từng lần render`, () => {\n    const moiLan: string[] = [];\n    const { rerender } = renderHook(({ q }) => {\n      const kq = hook(danhSachBacSi, 'tat-ca', q);\n      moiLan.push(`q=\"${q}\" → ${kq.length} bác sĩ`);\n      return kq;\n    }, { initialProps: { q: '' } });\n    rerender({ q: 'vy' });\n    console.log(`[${ten}] ${moiLan.length} lần render: ${moiLan.join(' | ')}`);\n    expect(moiLan.at(-1)).toBe('q=\"vy\" → 1 bác sĩ');\n  });\n}",
  bacSiDaLoc: "\n/**\n * Chương 13 — một custom hook \"tốt\": MỘT việc (danh sách bác sĩ đã lọc + trạng thái tải), nhận tham số là một\n * object có tên, trả về một UNION PHÂN BIỆT theo `trangThai` — TypeScript bắt bạn xử lý đủ trường hợp, và không\n * thể đọc `daLoc` khi đang tải. Lọc TÍNH NGAY khi render (không useEffect, không state sao chép).\n * Không vẽ gì, không biết URL: bộ lọc do component truyền vào ⇒ test bằng renderHook với bất kỳ bộ lọc nào.\n */\nexport type KetQuaBacSiDaLoc =\n  | { trangThai: 'dang-tai' }\n  | { trangThai: 'loi'; loi: Error; thuLai: () => void; dangThuLai: boolean }\n  | { trangThai: 'co-du-lieu'; tatCa: BacSi[]; daLoc: BacSi[]; banCu: boolean /* làm mới hỏng, đang hiện bản cũ */ };\n\nexport function useBacSiDaLoc({ chuyenKhoa, tuKhoa }: BoLoc): KetQuaBacSiDaLoc {\n  const { data, isPending, isError, error, refetch, isFetching } = useBacSi();\n  if (isPending) return { trangThai: 'dang-tai' };\n  if (!data) return { trangThai: 'loi', loi: error!, thuLai: () => void refetch(), dangThuLai: isFetching };\n  return { trangThai: 'co-du-lieu', tatCa: data, daLoc: locBacSi(data, chuyenKhoa, tuKhoa), banCu: isError };\n}",
  bacSiDaLocTest: "test('dang-tai → co-du-lieu; lọc \"nhi\" + \"vy\" tính ngay trong lần render đổi bộ lọc', async () => {\n  const { result, rerender } = renderHook((boLoc: BoLoc) => useBacSiDaLoc(boLoc), {\n    ...taoWrapper(),\n    initialProps: { chuyenKhoa: 'tat-ca', tuKhoa: '' },\n  });\n  expect(result.current.trangThai).toBe('dang-tai');\n  await waitFor(() => expect(result.current.trangThai).toBe('co-du-lieu'));\n  rerender({ chuyenKhoa: 'nhi', tuKhoa: 'vy' });\n  const kq = result.current;\n  if (kq.trangThai !== 'co-du-lieu') throw new Error('phải có dữ liệu'); // thu hẹp union ⇒ đọc được daLoc\n  expect(kq.daLoc.map((b) => b.id)).toEqual(['bs-6']);\n  expect(kq.tatCa).toHaveLength(6);\n});",
  khuDung: "export function KhuBacSi() {\n  const [boLoc, datBoLoc] = useBoLocUrl();\n  const kq = useBacSiDaLoc(boLoc);\n  const yeuThich = useDatLichStore((s) => s.yeuThich);\n  const doiYeuThich = useDatLichStore((s) => s.doiYeuThich);\n  const dsYeuThich = kq.trangThai === 'co-du-lieu' ? kq.tatCa.filter((bs) => yeuThich.includes(bs.id)) : [];\n\n  let noiDung;\n  if (kq.trangThai === 'dang-tai') {\n    noiDung = <DanhSachBacSiKhung />;\n  } else if (kq.trangThai === 'loi') {\n    noiDung = <LoiTaiDuLieu tieuDe=\"Không tải được danh sách bác sĩ\" loi={kq.loi} onThuLai={kq.thuLai} dangThuLai={kq.dangThuLai} />;\n  } else if (kq.tatCa.length === 0) {\n    noiDung = <p className=\"rong\">Phòng khám chưa có bác sĩ nào nhận lịch.</p>;",
  danhTinhTest: "function useDemSo() {\n  const [so, setSo] = useState(0);\n  return { so, tang: () => setSo((s) => s + 1) };\n}\n\ntest('danh tính giá trị trả về của hook qua một lần rerender', () => {\n  const { result, rerender } = renderHook(() => useDemSo());\n  const truoc = result.current;\n  rerender();\n  console.log(`[danh-tinh] object: ${result.current === truoc ? 'GIỮ NGUYÊN' : 'MỚI'} · hàm tang: ${result.current.tang === truoc.tang ? 'GIỮ NGUYÊN' : 'MỚI'}`);\n  expect(result.current.so).toBe(0);\n});",
  doiGioModule: "/* Chương 13: hàng nút của trang đổi giờ — CSS Module. Trước đây là .hang-nut toàn cục trong app.css, TRÙNG tên với\n   .hang-nut của thẻ bác sĩ (index.css): hai luật trộn vào nhau ở cả hai nơi (đo thật, Bài 13.2). */\n.hangNut { display: flex; gap: 14px; align-items: center; }",
  doiGioDung: "import css from './TrangDoiGio.module.css'; // Chương 13: CSS Modules — tên lớp riêng của file này\n…\n      <div className={css.hangNut}>\n        <button type=\"button\" className=\"nut nut-chinh\" disabled={!dangChon || doiGio.isPending} onClick={xacNhan}>\n          {doiGio.isPending ? 'Đang đổi…' : dangChon ? `Xác nhận đổi sang ${hienGio(dangChon.batDau)}` : 'Chọn một giờ trống'}\n        </button>\n        <Link to={duongDan.lichHen}>Huỷ, quay lại</Link>\n      </div>",
  hangNutCu: ".hang-nut { display: flex; gap: 8px; margin-top: 10px; }        /* src/index.css   — Chương 1: thẻ bác sĩ */\n.hang-nut { display: flex; gap: 14px; align-items: center; }     /* src/app/app.css — Chương 10: trang đổi giờ */",
  viteTailwind: "  plugins: [\n    tailwindcss(), // Chương 13 (thử): Tailwind v4 — plugin Vite, không cần postcss.config / tailwind.config\n    // Chương 12: React Compiler 1.0 cho CẢ app (dev, build, Vitest). Cần @babel/core 7 — bản 8 làm compiler âm thầm\n    // bỏ qua component có prop mặc định (Bài 8.2). src/app/compiler.test.ts canh để không component nào bị bỏ qua.\n    react(),\n    babel({ presets: [reactCompilerPreset()] }),\n  ],",
  cssTailwind: "/* Chương 13 (thử): Tailwind v4 KHÔNG kèm preflight (bộ reset) — để app cũ giữ nguyên dáng, chỉ thêm utility */\n@layer theme, base, components, utilities;\n@import \"tailwindcss/theme.css\" layer(theme);\n@import \"tailwindcss/utilities.css\" layer(utilities);",
  theTailwind: "  // Chương 13 (thử): cùng dáng thẻ Chương 1, viết bằng utility Tailwind thay cho .the-bac-si trong index.css\n  const lop = `rounded-xl bg-white px-4 py-3.5 ${noiBat ? 'border-2 border-amber-500' : 'border border-slate-300'}`;\n  return (\n    <article className={lop} aria-label={bacSi.ten}>\n      <h3 className=\"m-0 mb-1 text-lg font-bold text-slate-900\">{bacSi.ten}</h3>\n      <p className=\"my-1 text-sm font-semibold text-cyan-700\">{TEN_CHUYEN_KHOA[bacSi.chuyenKhoa]}</p>\n      <p className=\"my-1 text-sm text-slate-700\">{bacSi.namKinhNghiem} năm kinh nghiệm</p>\n      {noiBat && <p className=\"my-1 inline-block rounded-md bg-amber-100 px-2 text-xs font-semibold text-amber-800\">Bác sĩ lâu năm</p>}\n      <div className=\"mt-2.5 flex gap-2\">",
  theCu: ".the-bac-si { border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px 16px; background: #fff; }\n.the-bac-si h3 { margin: 0 0 4px; font-size: 18px; color: #0f172a; }\n.the-bac-si p { margin: 4px 0; color: #334155; font-size: 14px; }\n.the-bac-si .chuyen-khoa { color: #0e7490; font-weight: 600; }\n.the-bac-si.noi-bat { border: 2px solid #f59e0b; }\n.the-bac-si .nhan { display: inline-block; background: #fef3c7; color: #92400e; border-radius: 6px; padding: 1px 8px; font-size: 12px; font-weight: 600; }",
  cssGoSai: "import css from '@/pages/TrangDoiGio.module.css';\nexport const Hang = () => <div className={css.hangnut}>gõ sai hoa/thường</div>;",
  dsAo: "import { useWindowVirtualizer } from '@tanstack/react-virtual';\nimport { useLayoutEffect, useRef, useState } from 'react';\nimport type { BacSi } from '@/types';\nimport { TheBacSi } from './TheBacSi';\n\n/** Lưới thẻ trong .bo-cuc luôn 2 cột (index.css: .bo-cuc .luoi-bac-si) ⇒ một HÀNG ảo = 2 thẻ. */\nconst SO_COT = 2;\n/** Chiều cao ƯỚC LƯỢNG một hàng (px) — đo thật trên Chromium: thẻ cao 132–256 px tuỳ bề ngang (Bài 13.3). */\nconst UOC_LUONG = 180;\n\ninterface DanhSachBacSiAoProps {\n  danhSach: BacSi[];\n  yeuThich: string[];\n  coLienKet: boolean;\n  onDoiYeuThich?: (id: string) => void;\n}\n\n/**\n * Chương 13 — VIRTUALIZATION (\"danh sách ảo\"): chỉ đưa vào DOM những hàng đang nằm trong (hoặc sát) khung nhìn.\n * Trang vẫn cao như đủ 5000 thẻ (một div cao getTotalSize() px) nên thanh cuộn đúng; cuộn tới đâu vẽ hàng tới đó.\n * useWindowVirtualizer: cả TRANG cuộn (không phải một hộp có thanh cuộn riêng) — hợp với trang danh sách thường.\n */\nexport function DanhSachBacSiAo({ danhSach, yeuThich, coLienKet, onDoiYeuThich }: DanhSachBacSiAoProps) {\n  // \"use no memo\": KHÔNG để React Compiler tự memo component này. useWindowVirtualizer trả về CÙNG một object suốt\n  // đời component và tự SỬA bên trong khi cuộn; compiler thấy \"ao\" không đổi ⇒ dùng lại kết quả getVirtualItems() cũ\n  // ⇒ cuộn xuống giữa trang: 0 thẻ trong khung nhìn, trang TRẮNG (đo thật, Bài 13.3). Tắt compiler cho đúng MỘT hàm này.\n  'use no memo';\n  const khungRef = useRef<HTMLDivElement>(null);\n  const [lechTren, setLechTren] = useState(0); // khoảng cách từ đầu trang tới đầu danh sách (header, bộ lọc…)\n  useLayoutEffect(() => {\n    setLechTren(khungRef.current!.getBoundingClientRect().top + window.scrollY); // đo TRƯỚC khi trình duyệt vẽ (Bài 11.3)\n  }, []);\n\n  const ao = useWindowVirtualizer({\n    count: Math.ceil(danhSach.length / SO_COT),\n    estimateSize: () => UOC_LUONG,\n    gap: 16, // = gap của .luoi-bac-si\n    overscan: 4, // vẽ dư 4 hàng trên/dưới: cuộn nhanh không kịp thấy khoảng trắng\n    scrollMargin: lechTren,\n    // Đo chiều cao THẬT của từng hàng sau khi vẽ (tên dài xuống dòng ⇒ thẻ cao hơn). jsdom không có layout (luôn 0)\n    // ⇒ lùi về ước lượng, không thì mọi hàng \"cao 0\" và virtualizer vẽ… tất cả.\n    measureElement: (el) => el.getBoundingClientRect().height || UOC_LUONG,\n  });\n\n  return (\n    <div ref={khungRef} className=\"danh-sach-ao\" style={{ height: ao.getTotalSize(), position: 'relative' }}>\n      {ao.getVirtualItems().map((hang) => (\n        <div\n          key={hang.key}\n          data-index={hang.index} // measureElement đọc data-index để biết đang đo hàng nào\n          ref={ao.measureElement}\n          className=\"luoi-bac-si\"\n          style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${hang.start - lechTren}px)` }}\n        >\n          {danhSach.slice(hang.index * SO_COT, hang.index * SO_COT + SO_COT).map((bs) => (\n            <TheBacSi\n              key={bs.id}\n              bacSi={bs}\n              noiBat={bs.namKinhNghiem >= 15}\n              laYeuThich={yeuThich.includes(bs.id)}\n              coLienKet={coLienKet}\n              onDoiYeuThich={onDoiYeuThich}\n            />\n          ))}\n        </div>\n      ))}\n    </div>\n  );\n}",
  dsNguong: "import { lazy, Suspense } from 'react';\nimport type { BacSi } from '@/types';\nimport { TheBacSi } from './TheBacSi';\n\n/** Tải mã danh sách ảo (+ @tanstack/react-virtual, ~25 kB) CHỈ khi thật sự có danh sách dài (Bài 13.3, đo bằng sourcemap). */\nconst DanhSachBacSiAo = lazy(() => import('./DanhSachBacSiAo').then((m) => ({ default: m.DanhSachBacSiAo })));\n\n/**\n * Chương 13: trên NGUONG_AO thẻ thì chuyển sang danh sách ảo (chỉ vẽ phần đang nhìn thấy). Dưới ngưỡng vẽ đủ:\n * vẽ đủ thì Ctrl+F của trình duyệt tìm được mọi tên, trình đọc màn hình đếm đúng — virtualization có giá của nó.\n * Ngưỡng chọn theo SỐ ĐO (Bài 13.3), không theo cảm giác.\n */\nexport const NGUONG_AO = 500;\n…\n      {danhSach.length > NGUONG_AO ? (\n        <>\n          <p className=\"goi-y-ao\">Danh sách dài: trang chỉ vẽ phần bạn đang nhìn. Tìm một tên? Dùng ô “Tìm theo tên” ở trên (Ctrl+F không thấy thẻ chưa vẽ).</p>\n          <Suspense fallback={<p role=\"status\">Đang chuẩn bị danh sách…</p>}>\n            <DanhSachBacSiAo danhSach={danhSach} yeuThich={yeuThich} coLienKet={coLienKet} onDoiYeuThich={onDoiYeuThich} />\n          </Suspense>\n        </>\n      ) : (",
  aoTest: "test('cuộn trang (jsdom: đặt scrollY + sự kiện scroll) ⇒ thẻ ở xa được vẽ, thẻ đầu bị gỡ', async () => {\n  veTrang('/bac-si');\n  await screen.findByRole('heading', { name: 'Đội ngũ bác sĩ (5000)' });\n  expect(await screen.findByRole('article', { name: 'BS. Nguyễn Minh An' })).toBeInTheDocument();\n  await act(async () => {\n    Object.defineProperty(window, 'scrollY', { value: 196 * 1000, configurable: true }); // ~ hàng 1000 (180 px + gap 16)\n    fireEvent.scroll(window);\n  });\n  expect(screen.queryByRole('article', { name: 'BS. Nguyễn Minh An' })).not.toBeInTheDocument();\n  const ten = screen.getAllByRole('article').map((a) => a.getAttribute('aria-label'));\n  console.log(`[ảo/jsdom] sau khi cuộn: ${ten.length} thẻ, từ ${ten[0]} tới ${ten.at(-1)}`);\n  expect(ten.some((t) => t!.includes('(2001)'))).toBe(true); // hàng 1000 = thẻ 2001–2002 (id bs-2001…)\n  Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });\n});",
  compilerBoQua: "  // Chương 13: bỏ qua CÓ CHỦ ĐÍCH bằng 'use no memo' — mỗi dòng phải có lý do ghi ngay trong file đó (Bài 13.3).\n  const CO_Y_BO_QUA = ['src/features/bac-si/components/DanhSachBacSiAo.tsx · CompileSkip: '];\n  expect(boQua).toEqual(CO_Y_BO_QUA);",
  doAo: "    await p.goto(`http://localhost:${port}/bac-si?nhieu=${N}&tre=0`);\n    await p.getByRole('heading', { name: `Đội ngũ bác sĩ (${N})` }).waitFor({ timeout: 60000 });\n    await p.locator('article').first().waitFor({ timeout: 60000 }); // bản ảo tải mã lười ⇒ đợi thẻ ĐẦU TIÊN, không chỉ tiêu đề\n    await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)))); // đợi khung hình vẽ xong\n    const moTrang = Date.now() - t0;\n    const mount = await p.evaluate(() => Math.max(...window.__nhatKyDo.filter((x) => x.id === 'KhuBacSi').map((x) => x.actualDuration)));\n    const dom = await p.evaluate(() => ({ nut: document.getElementsByTagName('*').length, the: document.querySelectorAll('article').length }));\n    await cdp.send('HeapProfiler.collectGarbage');\n    const heap = (await cdp.send('Performance.getMetrics')).metrics.find((m) => m.name === 'JSHeapUsedSize').value / 1048576;",
  htmlAnToan: "import DOMPurify from 'dompurify';\n\n/**\n * Chương 13 — hiển thị HTML đến từ NGOÀI mã của bạn (CMS, trình soạn thảo, API) cho AN TOÀN.\n * React tự thoát ký tự mọi thứ bạn viết trong {…} ⇒ muốn trình duyệt HIỂU thẻ <strong>, <ul>… thì phải dùng\n * dangerouslySetInnerHTML — và cái tên \"nguy hiểm\" là thật: chuỗi đó được đưa thẳng vào innerHTML.\n * Luật: KHÔNG BAO GIỜ đưa chuỗi chưa lọc vào đó. Lọc bằng DOMPurify với DANH SÁCH TRẮNG — chỉ những thẻ và thuộc\n * tính nội dung thật sự cần; mọi thứ khác (script, img, onerror, style, iframe, href javascript:…) bị gỡ.\n */\nconst CAU_HINH = {\n  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a'],\n  ALLOWED_ATTR: ['href'], // href javascript:/data: vẫn bị DOMPurify gỡ (chỉ giữ giao thức an toàn)\n};\n\n/** Hàm thuần — test được riêng, và dùng được cả ngoài React. */\nexport function locHtml(html: string): string {\n  return DOMPurify.sanitize(html, CAU_HINH);\n}\n\nexport function HtmlAnToan({ html, className }: { html: string; className?: string }) {\n  return <div className={className} dangerouslySetInnerHTML={{ __html: locHtml(html) }} />;\n}",
  gioiThieuDoc: "export const GIOI_THIEU_DOC = '<p>Mụn trứng cá, viêm da cơ địa.</p><img src=\"x\" onerror=\"window.__xss = (window.__xss || 0) + 1\">';",
  xssTest: "/** Chương 13 — Bài 13.4: React làm gì với chuỗi \"có thẻ\", và với href javascript: (React 19.3, jsdom). */\nconst CHUOI = '<img src=\"x\" onerror=\"window.__xss = 1\">';\n\ntest('{chuoi} trong JSX ⇒ chữ thường, không có thẻ <img> nào', () => {\n  const { container } = render(<p>{CHUOI}</p>);\n  console.log('[react-text] innerHTML =', container.innerHTML);\n  expect(container.querySelector('img')).toBeNull();\n});\n\ntest('dangerouslySetInnerHTML chưa lọc ⇒ <img onerror> THẬT nằm trong DOM', () => {\n  const { container } = render(<div dangerouslySetInnerHTML={{ __html: CHUOI }} />);\n  console.log('[raw] innerHTML =', container.innerHTML);\n  expect(container.querySelector('img')?.getAttribute('onerror')).toBe('window.__xss = 1');\n});\n\ntest('href=\"javascript:…\" ⇒ React 19 thay bằng một đoạn chỉ ném lỗi', () => {\n  const loi = vi.spyOn(console, 'error').mockImplementation(() => {});\n  const { container } = render(<a href={'javascript:alert(1)'}>bấm</a>);\n  console.log('[href] =', container.querySelector('a')!.getAttribute('href'));\n  console.log('[href] console.error được gọi:', loi.mock.calls.length, 'lần');\n  expect(container.querySelector('a')!.getAttribute('href')).toContain('React has blocked a javascript: URL');\n  loi.mockRestore();\n});",
  linkAnToan: "/**\n * Chương 13: link do NGƯỜI DÙNG hay dữ liệu ngoài cung cấp (website bác sĩ, link trong góp ý…) — chỉ nhận giao thức an\n * toàn. React 19 đã chặn \"javascript:\" trong href, nhưng không chặn \"data:\", \"vbscript:\" hay link sai định dạng.\n * Trả undefined khi không an toàn ⇒ <a href={undefined}> không bấm được, không chạy gì.\n */\nconst GIAO_THUC_DUOC_PHEP = new Set(['http:', 'https:', 'mailto:', 'tel:']);\n\nexport function linkAnToan(url: string): string | undefined {\n  try {\n    const u = new URL(url, 'https://phongkham.invalid'); // link tương đối ('/bac-si') cũng được coi là https\n    return GIAO_THUC_DUOC_PHEP.has(u.protocol) ? url : undefined;\n  } catch {\n    return undefined; // không phân tích được ⇒ không tin\n  }\n}",
  linkAnToanTest: "import { expect, test } from 'vitest';\nimport { linkAnToan } from './link-an-toan';\n\ntest.each([\n  ['https://anTam.vn/bs-1', 'https://anTam.vn/bs-1'],\n  ['/bac-si/bs-2', '/bac-si/bs-2'],\n  ['tel:19001234', 'tel:19001234'],\n  ['javascript:alert(1)', undefined],\n  [' JavaScript:alert(1)', undefined],\n  ['data:text/html,<b>x</b>', undefined],\n])('linkAnToan(%j) → %j', (vao, ra) => {\n  expect(linkAnToan(vao)).toBe(ra);\n});",
  htmlAnToanTest: "test('gỡ <img onerror>, <script>, style, href javascript:', () => {\n  console.log('[locHtml] vào:', GIOI_THIEU_DOC);\n  console.log('[locHtml] ra :', locHtml(GIOI_THIEU_DOC));\n  expect(locHtml(GIOI_THIEU_DOC)).toBe('<p>Mụn trứng cá, viêm da cơ địa.</p>');\n  expect(locHtml('<p style=\"position:fixed\">a</p><script>x()</script>')).toBe('<p>a</p>');\n  const link = locHtml('<a href=\"javascript:x()\">bấm</a> <a href=\"https://anTam.vn\">web</a>');\n  console.log('[locHtml] link:', link);\n  expect(link).toBe('<a>bấm</a> <a href=\"https://anTam.vn\">web</a>');\n});",
  tuDien: "export const vi = {\n  'app.ten': 'Phòng khám An Tâm',\n  'app.gioMo': 'Mở cửa {mo}–{dong}, thứ Hai đến thứ Bảy',\n  …\n  'chiTiet.kinhNghiem.one': '{so} năm kinh nghiệm',\n  'chiTiet.kinhNghiem.other': '{so} năm kinh nghiệm',\n} as const;\n\nexport type KhoaTuDien = keyof typeof vi;\n\nexport const en = {\n  'app.ten': 'An Tam Clinic',\n  'app.gioMo': 'Open {mo}–{dong}, Monday to Saturday',\n  'menu.nhan': 'Main menu',\n  'menu.trangChu': 'Home',\n  'menu.bacSi': 'Doctors',\n  'menu.lichHen': 'My appointments',\n  'menu.soLichHen': 'Number of appointments',\n  'taiKhoan.chao': 'Hello, {ten}',\n  'taiKhoan.dangNhap': 'Sign in',\n  'taiKhoan.dangXuat': 'Sign out',\n  'ngonNgu.nhan': 'Language',\n  'chiTiet.quayLai': '← All doctors',\n  'chiTiet.tabs': 'Doctor information',\n  'chiTiet.tabGioKham': 'Available times',\n  'chiTiet.tabGioiThieu': 'About',\n  'chiTiet.kinhNghiem.one': '{so} year of experience',\n  'chiTiet.kinhNghiem.other': '{so} years of experience',\n} satisfies Record<KhoaTuDien, string>;\n\nexport const TU_DIEN = { vi, en } as const;\nexport type NgonNgu = keyof typeof TU_DIEN; // 'vi' | 'en'",
  dich: "export const MA_VUNG: Record<NgonNgu, string> = { vi: 'vi-VN', en: 'en-US' };\n\ntype KhoaSoNhieu = KhoaTuDien extends infer K ? (K extends `${infer G}.one` ? G : never) : never; // 'chiTiet.kinhNghiem'\n\n/** Hàm THUẦN (test được không cần React): dịch một khoá, điền {bien}. */\nexport function dich(ngonNgu: NgonNgu, khoa: KhoaTuDien, bien: Record<string, string | number> = {}): string {\n  return TU_DIEN[ngonNgu][khoa].replace(/\\{(\\w+)\\}/g, (_, ten: string) => String(bien[ten] ?? `{${ten}}`));\n}\n\n/** Số nhiều theo LUẬT CỦA NGÔN NGỮ (Intl.PluralRules): en có one/other, vi chỉ có other. Số được định dạng theo vùng. */\nexport function dichSoNhieu(ngonNgu: NgonNgu, khoa: KhoaSoNhieu, so: number): string {\n  const dang = new Intl.PluralRules(MA_VUNG[ngonNgu]).select(so) === 'one' ? 'one' : 'other';\n  return dich(ngonNgu, `${khoa}.${dang}` as KhoaTuDien, { so: new Intl.NumberFormat(MA_VUNG[ngonNgu]).format(so) });\n}\n\n/** Giờ theo vùng, LUÔN theo giờ Việt Nam (phòng khám ở TP.HCM) dù máy người xem đặt múi giờ nào. */\nexport function dinhDangGio(ngonNgu: NgonNgu, gio: number, phut = 0): string {\n  const d = new Date(Date.UTC(2026, 0, 1, gio - 7, phut)); // gio:phut ở UTC+7\n  return new Intl.DateTimeFormat(MA_VUNG[ngonNgu], { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }).format(d);\n}",
  useDich: "export function useDich() {\n  const ngonNgu = useNgonNguStore((s) => s.ngonNgu);\n  return {\n    ngonNgu,\n    t: (khoa: KhoaTuDien, bien?: Record<string, string | number>) => dich(ngonNgu, khoa, bien),\n    tSoNhieu: (khoa: Parameters<typeof dichSoNhieu>[1], so: number) => dichSoNhieu(ngonNgu, khoa, so),\n    gio: (gio: number, phut?: number) => dinhDangGio(ngonNgu, gio, phut),\n  };\n}",
  headerDung: "  const { t, gio, ngonNgu } = useDich(); // Chương 13: mọi chữ qua từ điển\n  …\n        <p>{t('app.gioMo', { mo: gio(7, 30), dong: gio(20) })}</p>\n  …\n        <div className=\"chon-ngon-ngu\" role=\"group\" aria-label={t('ngonNgu.nhan')}>\n          <button type=\"button\" lang=\"vi\" aria-pressed={ngonNgu === 'vi'} onClick={() => doiNgonNgu('vi')}>VI</button>\n          <button type=\"button\" lang=\"en\" aria-pressed={ngonNgu === 'en'} onClick={() => doiNgonNgu('en')}>EN</button>\n        </div>",
  langEffect: "  const ngonNgu = useNgonNguStore((s) => s.ngonNgu);\n  useEffect(() => {\n    document.documentElement.lang = ngonNgu;\n  }, [ngonNgu]);",
  ngonNguTest: "test('bấm EN ⇒ header, tab, số năm kinh nghiệm sang tiếng Anh; <html lang=\"en\">; lưu localStorage', async () => {\n  const user = userEvent.setup();\n  await veTrangCho('/bac-si/bs-1');\n  expect(await screen.findByText(/Nội tổng quát · 12 năm kinh nghiệm/)).toBeInTheDocument();\n  await act(async () => user.click(screen.getByRole('button', { name: 'EN' })));\n  expect(screen.getByRole('navigation', { name: 'Main menu' })).toHaveTextContent('HomeDoctorsMy appointments');\n  expect(screen.getByText('Open 7:30 AM–8:00 PM, Monday to Saturday')).toBeInTheDocument();\n  expect(screen.getByRole('tab', { name: 'About' })).toBeInTheDocument();\n  expect(screen.getByText(/12 years of experience/)).toBeInTheDocument();\n  expect(document.documentElement.lang).toBe('en');\n  expect(JSON.parse(localStorage.getItem('phong-kham-ngon-ngu')!).state).toEqual({ ngonNgu: 'en' });\n  expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true');\n});",
};

/* ─── Output THẬT (Vitest 5.0.2, Vite 8.3.1, TypeScript 6.0.3, Chromium 149, Node 22.21) — chép nguyên văn, chỉ rút bớt dòng ─── */
const OUT = {
  b1Test: "$ npx vitest run src/shared/ui/Tabs.test.tsx src/features/bac-si/TimNhanhBacSi.test.tsx src/pages/TrangChiTietBacSi.tabs.test.tsx\n ✓ vai ARIA: tablist > tab, tab được chọn điều khiển đúng tabpanel\n ✓ bàn phím: Tab vào MỘT tab; → đổi và focus; ← ở đầu vòng về cuối; End/Home\n ✓ chế độ điều khiển: cha giữ giá trị; onDoi được gọi\n ✓ mảnh đứng ngoài <Tabs> ⇒ lỗi nói rõ phải làm gì\n ✓ bọc một Tab trong <span title> (tooltip) vẫn chạy — context không quan tâm con nằm sâu bao nhiêu\n ✓ gõ \"h\" ⇒ hộp gợi ý; ↓ ↓ làm sáng mục 2 (aria-activedescendant); Enter ⇒ sang trang bác sĩ\n ✓ Esc đóng hộp; ↑ từ đầu vòng về mục cuối\n ✓ mặc định tab \"Giờ khám\": 4 khung giờ; bấm \"Giới thiệu\" ⇒ URL có ?tab=gioi-thieu, panel đổi\n ✓ mở thẳng link ?tab=gioi-thieu ⇒ đúng tab; ?tab=la ⇒ về mặc định\n ✓ ?tab=la ⇒ tab mặc định\n      Tests  10 passed (10)",
  clone: "$ npx vitest run src/vi-du/ch13/TabsClone.test.tsx\n ✓ cloneElement: Tab là con TRỰC TIẾP ⇒ chạy\n[clone] sau khi bấm B: aria-selected của A = true · của B = false\n ✓ cloneElement: bọc Tab B trong <span title> để có tooltip ⇒ B không bao giờ được chọn\n      Tests  2 passed (2)",
  tscNut: "$ npx tsc -p tsconfig.loi.json --noEmit --pretty false\nvi-du-loi/nut-sai.tsx(9,12): error TS2322: Type '{ children: string; to: string; }' is not assignable to type 'IntrinsicAttributes & PropRieng<\"button\"> & Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, keyof PropRieng<...>>'.\n  Property 'to' does not exist on type 'IntrinsicAttributes & PropRieng<\"button\"> & Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, keyof PropRieng<...>>'.\nvi-du-loi/nut-sai.tsx(10,8): error TS2741: Property 'to' is missing in type '{ children: string; as: ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>>; }' but required in type 'Omit<LinkProps & RefAttributes<HTMLAnchorElement>, keyof PropRieng<C>>'.\nvi-du-loi/nut-sai.tsx(11,12): error TS2322: Type '\"do\"' is not assignable to type 'BienTheNut | undefined'.\nvi-du-loi/nut-sai.tsx(12,12): error TS2322: Type 'RefObject<HTMLAnchorElement | null>' is not assignable to type 'Ref<HTMLButtonElement> | undefined'.\n  Type 'RefObject<HTMLAnchorElement | null>' is not assignable to type 'RefObject<HTMLButtonElement | null>'.\n    Type 'HTMLAnchorElement | null' is not assignable to type 'HTMLButtonElement | null'.\n      Type 'HTMLAnchorElement' is missing the following properties from type 'HTMLButtonElement': command, commandForElement, disabled, form, and 15 more.",
  tabsUrl: "# Bản đầu: TrangChiTietBacSi tự gọi useSearchParams (Tabs điều khiển ngay trong trang). jsdom + React dev + Compiler, a11y.test.tsx:\nDBG0 FAIL ?ngay=2026-10-02 idle [[[\"lich-hen\"],\"pending\",\"idle\"],[[\"bac-si\",\"bs-2\"],\"success\",\"idle\"],[[\"bac-si\",\"bs-2\",\"khung-gio\",\"2026-10-01\"],\"success\",\"idle\"],[[\"bac-si\",\"bs-2\",\"khung-gio\",\"2026-10-02\"],\"pending\",\"idle\"]]\n# Cùng test, không compiler (vitest.khong-compiler.config.ts): DBG0 ok ms 36 · DBG1 ok ms 19 · DBG2 ok ms 19\n# Chromium thật (build và dev): đổi ngày 02/10 → giờ về sau 5 ms; 03/10 → 26 ms …\n# Sau khi tách TabsTheoUrl (chỉ nó đọc URL, panel là children): DBG0 ok ms 35 · DBG1 ok ms 24 · DBG2 ok ms 20",
  b2Test: "[XẤU (useEffect)] 4 lần render: q=\"\" → 6 bác sĩ | q=\"\" → 6 bác sĩ | q=\"vy\" → 6 bác sĩ | q=\"vy\" → 1 bác sĩ\n[TỐT (tính khi render)] 2 lần render: q=\"\" → 6 bác sĩ | q=\"vy\" → 1 bác sĩ\n ✓ XẤU (useEffect): gõ \"vy\" — kết quả qua từng lần render\n ✓ TỐT (tính khi render): gõ \"vy\" — kết quả qua từng lần render\n ✓ dang-tai → co-du-lieu; lọc \"nhi\" + \"vy\" tính ngay trong lần render đổi bộ lọc\n ✓ API 500 ⇒ trangThai \"loi\" có thuLai; thử lại thành công ⇒ co-du-lieu\n      Tests  4 passed (4)",
  hookXau: "$ npx vitest run src/vi-du/ch13/useLocXau.test.tsx --reporter=verbose\n[XẤU (useEffect)] 4 lần render: q=\"\" → 6 bác sĩ | q=\"\" → 6 bác sĩ | q=\"vy\" → 6 bác sĩ | q=\"vy\" → 1 bác sĩ\n[TỐT (tính khi render)] 2 lần render: q=\"\" → 6 bác sĩ | q=\"vy\" → 1 bác sĩ\n      Tests  2 passed (2)",
  danhTinh: "$ npx vitest run src/vi-du/ch13/danhTinh.test.tsx          # CÓ React Compiler (vite.config.ts)\n[danh-tinh] object: GIỮ NGUYÊN · hàm tang: GIỮ NGUYÊN\n      Tests  1 passed (1)\n$ npx vitest run -c vitest.khong-compiler.config.ts src/vi-du/ch13/danhTinh.test.tsx   # KHÔNG compiler\n[danh-tinh] object: MỚI · hàm tang: MỚI\n      Tests  1 passed (1)",
  cssTruoc: "$ node do/ch13-css.mjs\n[trước: .hang-nut toàn cục ở HAI file] Chromium 149.0.7827.55 · vite build + preview\n  thẻ bác sĩ (Ch1)   class=\"hang-nut\"  → gap 8px · align-items center · margin-top 10px\n  trang đổi giờ (Ch10) class=\"hang-nut\"  → gap 8px · align-items center · margin-top 10px",
  cssSau: "$ node do/ch13-css.mjs\n[sau: trang đổi giờ dùng CSS Module] Chromium 149.0.7827.55 · vite build + preview\n  thẻ bác sĩ (Ch1)   class=\"hang-nut\"  → gap 8px · align-items normal · margin-top 10px\n  trang đổi giờ (Ch10) class=\"_hangNut_1xsw0_3\"  → gap 14px · align-items center · margin-top 0px",
  cssGoSai: "$ npx tsc -p tsconfig.loi.json --noEmit\n(không có dòng nào nhắc vi-du-loi/css-go-sai.tsx — css.hangnut có kiểu string, tsc im lặng)",
  buildCss: "# bản chỉ có CSS Modules (du-an/ch13)\ndist/assets/TrangDoiGio-BleFQ8UH.css        0.06 kB │ gzip:   0.08 kB\ndist/assets/index-DTqh3QjL.css             10.02 kB │ gzip:   2.79 kB\n✓ built in 1.15s\n# bản thử Tailwind v4.3.3 (du-an/ch13-tailwind)\ndist/assets/TrangDoiGio-BleFQ8UH.css        0.06 kB │ gzip:   0.08 kB\ndist/assets/index-DgFuDT7J.css             15.32 kB │ gzip:   4.12 kB\n✓ built in 1.40s",
  twLop: "37 lớp trong @layer utilities của bản build:\nvisible static isolate container m-0 my-1 mt-2.5 mb-1 flex hidden inline-block table transform gap-2 rounded-md rounded-xl border border-2 border-amber-500 border-slate-300 bg-amber-100 bg-white px-2 px-4 py-3.5 text-lg text-sm text-xs font-bold font-semibold text-amber-800 text-cyan-700 text-slate-700 text-slate-900 blur filter transition\n\n# lớp \"lạ\" đến từ đâu (grep -w trong src/):\nstatic     ← RanhGioiLoi.tsx      (static getDerivedStateFromError)\nfilter     ← mocks/*.ts           (mảng .filter(...))\ntransform  ← dat-lich/schema.ts   (zod .transform(...))\ntable      ← LuoiLichTuan.tsx     (thẻ <table>)\nhidden     ← DieuHuongTuan.tsx    (aria-hidden, hidden)",
  aoTruoc: "[trước: vẽ đủ 5000 thẻ] 5000 bác sĩ · Chromium 149.0.7827.55 · vite build --mode profiling · CPU thường · trung vị 3 lần\n  mở trang → thấy danh sách : 594 ms   (commit KhuBacSi dài nhất 119.3 ms)\n  DOM: 37715 nút · 5000 <article> · heap JS 33.7 MB\n  gõ \"lan\" → Đội ngũ bác sĩ (417): 263 ms · commit dài nhất 9.6 ms\n  xoá ô tìm → lại 5000: 492 ms · commit dài nhất 96.9 ms\n  cuộn hết trang (442584 px, 120 bước): 0 khung > 50 ms · khung dài nhất 9 ms\n[trước: vẽ đủ 5000 thẻ] 5000 bác sĩ · Chromium 149.0.7827.55 · vite build --mode profiling · CPU chậm 4× · trung vị 3 lần\n  mở trang → thấy danh sách : 2770 ms   (commit KhuBacSi dài nhất 521.5 ms)\n  DOM: 37715 nút · 5000 <article> · heap JS 33.7 MB\n  gõ \"lan\" → Đội ngũ bác sĩ (417): 1407 ms · commit dài nhất 64.2 ms\n  xoá ô tìm → lại 5000: 2496 ms · commit dài nhất 462.1 ms\n  cuộn hết trang (442584 px, 120 bước): 0 khung > 50 ms · khung dài nhất 26 ms",
  aoSauKhongLuoi: "[sau: danh sách ảo] 5000 bác sĩ · Chromium 149.0.7827.55 · vite build --mode profiling · CPU thường · trung vị 3 lần\n  mở trang → thấy danh sách : 143 ms   (commit KhuBacSi dài nhất 4.5 ms)\n  DOM: 194 nút · 18 <article> · heap JS 6.8 MB\n  gõ \"lan\" → Đội ngũ bác sĩ (417): 121 ms · commit dài nhất 13.2 ms\n  xoá ô tìm → lại 5000: 26 ms · commit dài nhất 3.1 ms\n  cuộn hết trang (490115 px, 120 bước): 0 khung > 50 ms · khung dài nhất 9 ms\n[sau: danh sách ảo] 5000 bác sĩ · Chromium 149.0.7827.55 · vite build --mode profiling · CPU chậm 4× · trung vị 3 lần\n  mở trang → thấy danh sách : 608 ms   (commit KhuBacSi dài nhất 24.7 ms)\n  DOM: 194 nút · 18 <article> · heap JS 6.8 MB\n  gõ \"lan\" → Đội ngũ bác sĩ (417): 418 ms · commit dài nhất 79.8 ms\n  xoá ô tìm → lại 5000: 161 ms · commit dài nhất 16.4 ms\n  cuộn hết trang (490115 px, 120 bước): 0 khung > 50 ms · khung dài nhất 50 ms",
  aoSau: "[sau: danh sách ảo (tải lười)] 5000 bác sĩ · Chromium 149.0.7827.55 · vite build --mode profiling · CPU thường · trung vị 3 lần\n  mở trang → thấy danh sách : 518 ms   (commit KhuBacSi dài nhất 4.2 ms)\n  DOM: 199 nút · 18 <article> · heap JS 6.9 MB\n  gõ \"lan\" → Đội ngũ bác sĩ (417): 123 ms · commit dài nhất 14.7 ms\n  xoá ô tìm → lại 5000: 33 ms · commit dài nhất 3.3 ms\n  cuộn hết trang (490115 px, 120 bước): 0 khung > 50 ms · khung dài nhất 25 ms\n[sau: danh sách ảo (tải lười)] 5000 bác sĩ · Chromium 149.0.7827.55 · vite build --mode profiling · CPU chậm 4× · trung vị 3 lần\n  mở trang → thấy danh sách : 873 ms   (commit KhuBacSi dài nhất 20.5 ms)\n  DOM: 199 nút · 18 <article> · heap JS 7.0 MB\n  gõ \"lan\" → Đội ngũ bác sĩ (417): 396 ms · commit dài nhất 76.5 ms\n  xoá ô tìm → lại 5000: 154 ms · commit dài nhất 16.9 ms\n  cuộn hết trang (490115 px, 120 bước): 0 khung > 50 ms · khung dài nhất 42 ms",
  cuonCompiler: "$ node do/ch13-cuon-ao.mjs   # bản ĐẦU: chưa có 'use no memo'\n[ảo, React Compiler BẬT] Chromium 149.0.7827.55 · vite build + preview · khung nhìn 1280×900\n  đầu trang  scrollY=     0/490330: 16 <article> trong DOM (BS. Nguyễn Minh An … BS. Hồ Thị Lan (16)) · 8 thẻ trong khung nhìn\n  giữa trang scrollY=244715/490330: 16 <article> trong DOM (BS. Nguyễn Minh An … BS. Hồ Thị Lan (16)) · 0 thẻ trong khung nhìn\n  cuối trang scrollY=489430/490330: 16 <article> trong DOM (BS. Nguyễn Minh An … BS. Hồ Thị Lan (16)) · 0 thẻ trong khung nhìn",
  cuonNoMemo: "$ node do/ch13-cuon-ao.mjs   # sau khi thêm 'use no memo'\n[ảo + 'use no memo' (bản cuối)] Chromium 149.0.7827.55 · vite build + preview · khung nhìn 1280×900\n  đầu trang  scrollY=     0/490115: 18 <article> trong DOM (BS. Nguyễn Minh An … BS. Trần Ngọc Vy (18)) · 8 thẻ trong khung nhìn\n  giữa trang scrollY=244523/489829: 30 <article> trong DOM (BS. Nguyễn Minh Khoa (2487) … BS. Hồ Thị Mai (2516)) · 14 thẻ trong khung nhìn\n  cuối trang scrollY=488745/489645: 18 <article> trong DOM (BS. Đặng Hải Khoa (4983) … BS. Phạm Gia Mai (5000)) · 10 thẻ trong khung nhìn",
  aoTestThieu: "# bỏ 'use no memo' rồi chạy test danh sách ảo\n   × 5000 bác sĩ: tiêu đề đếm đủ 5000 nhưng DOM chỉ có vài chục thẻ 180ms\n   × cuộn trang (jsdom: đặt scrollY + sự kiện scroll) ⇒ thẻ ở xa được vẽ, thẻ đầu bị gỡ 56ms\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯\nTestingLibraryElementError: Unable to find an accessible element with the role \"article\"\n     18|   console.log(`[ảo/jsdom] 5000 bác sĩ ⇒ ${soThe} <article> · TheBacSi …\nTestingLibraryElementError: Unable to find an accessible element with the role \"article\" and name \"BS. Nguyễn Minh An\"\n      Tests  2 failed | 1 passed (3)",
  b3Test: " ✓ 12.4 — vite.config.ts bật React Compiler (reactCompilerPreset qua @rolldown/plugin-babel)\n ✓ 12.4 — mọi component .tsx trong src/ đều được compiler biên dịch\n[ảo/jsdom] 5000 bác sĩ ⇒ 16 <article> · TheBacSi chạy 16 lần\n[ảo/jsdom] sau khi cuộn: 24 thẻ, từ BS. Đặng Hải Nam (1993) tới BS. Hồ Thị Phúc (2016)\n ✓ 5000 bác sĩ: tiêu đề đếm đủ 5000 nhưng DOM chỉ có vài chục thẻ\n ✓ 8.1 — /bac-si với 200 bác sĩ: <Profiler id=\"KhuBacSi\"> ghi mount rồi update\n ✓ cuộn trang (jsdom: đặt scrollY + sự kiện scroll) ⇒ thẻ ở xa được vẽ, thẻ đầu bị gỡ\n ✓ 8.2 — bấm ♡ một thẻ trong 200 ⇒ đúng MỘT TheBacSi chạy lại\n ✓ tìm \"lan\" ⇒ 417 kết quả < ngưỡng 500 ⇒ vẽ đủ 417 thẻ (Ctrl+F lại dùng được)\n ✓ 8.2 — gõ tìm \"huy\": thẻ còn lại KHÔNG chạy lại (props không đổi)\n      Tests  8 passed (8)",
  bundle: "$ npx vite build --sourcemap && node do/phan-tich-bundle.mjs dist/assets/index-*.js   # TRƯỚC khi tải lười\nindex-CFusFcJy.js — 431.8 kB\n  react-dom                       207.3 kB\n  react-router                     95.4 kB\n  src/ (mã của app)                44.1 kB\n  dompurify                        28.3 kB\n  @tanstack/virtual-core           22.9 kB\n  @tanstack/query-core             20.4 kB\n  …\n  @tanstack/react-virtual           1.9 kB\n\n$ npx vite build   # SAU: DanhSachBacSiAo và GioiThieuBacSi tải lười\ndist/assets/DanhSachBacSiAo-OI2rPKpZ.js    25.81 kB │ gzip:   7.87 kB\ndist/assets/GioiThieuBacSi-DqE9CCdt.js     28.94 kB │ gzip:  11.53 kB\ndist/assets/index-CG5KqQJ4.js             377.60 kB │ gzip: 120.59 kB",
  xssTest: "$ npx vitest run src/vi-du/ch13/xss.test.tsx src/shared/ui/HtmlAnToan.test.tsx --reporter=verbose\n[react-text] innerHTML = <p>&lt;img src=\"x\" onerror=\"window.__xss = 1\"&gt;</p>\n[raw] innerHTML = <div><img src=\"x\" onerror=\"window.__xss = 1\"></div>\n[href] = javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')\n[href] console.error được gọi: 0 lần\n ✓ {chuoi} trong JSX ⇒ chữ thường, không có thẻ <img> nào\n ✓ dangerouslySetInnerHTML chưa lọc ⇒ <img onerror> THẬT nằm trong DOM\n ✓ href=\"javascript:…\" ⇒ React 19 thay bằng một đoạn chỉ ném lỗi\n[locHtml] vào: <p>Mụn trứng cá, viêm da cơ địa.</p><img src=\"x\" onerror=\"window.__xss = (window.__xss || 0) + 1\">\n[locHtml] ra : <p>Mụn trứng cá, viêm da cơ địa.</p>\n[locHtml] link: <a>bấm</a> <a href=\"https://anTam.vn\">web</a>\n ✓ giữ định dạng nội dung: <strong>, <ul><li>\n ✓ gỡ <img onerror>, <script>, style, href javascript:\n      Tests  5 passed (5)",
  linkTest: "$ npx vitest run src/shared/logic/link-an-toan.test.ts --reporter=verbose\n ✓ linkAnToan(\"https://anTam.vn/bs-1\") → \"https://anTam.vn/bs-1\"\n ✓ linkAnToan(\"/bac-si/bs-2\") → \"/bac-si/bs-2\"\n ✓ linkAnToan(\"tel:19001234\") → \"tel:19001234\"\n ✓ linkAnToan(\"javascript:alert(1)\") → undefined\n ✓ linkAnToan(\" JavaScript:alert(1)\") → undefined\n ✓ linkAnToan(\"data:text/html,<b>x</b>\") → undefined\n      Tests  6 passed (6)",
  xssApp: "$ node do/ch13-xss-app.mjs   # trang thật, bản build\n/bac-si/bs-3?doc=1&tab=gioi-thieu → window.__xss = undefined · .gioi-thieu = <p>Mụn trứng cá, viêm da cơ địa.</p>",
  purifyMacDinh: "$ npx vitest run src/vi-du/ch13/purify-mac-dinh.test.ts --reporter=verbose   # DOMPurify, cấu hình MẶC ĐỊNH\n[mac-dinh] <p>Mụn trứng cá, viêm da cơ địa.</p><img src=\"x\">\n ✓ mặc định: giữ <img src=\"x\">, chỉ gỡ onerror\n      Tests  1 passed (1)",
  xssChromium: "$ node do/ch13-xss.mjs\nChromium 149.0.7827.55 · React 19.3.0 · DOMPurify 3.4.16\n  ?kieu=chu → mã lạ chạy 0 lần · <img> trong DOM: 0 · <p class=\"gioi-thieu\">&lt;p&gt;Mụn trứng cá, viêm da cơ địa.&lt;/p&gt;&lt;img src=\"x\" onerror=\"window.__xss = (window.__xss || 0) + 1\"&gt;</p>\n  ?kieu=tho → mã lạ chạy 1 lần · <img> trong DOM: 1 · <div class=\"gioi-thieu\"><p>Mụn trứng cá, viêm da cơ địa.</p><img src=\"x\" onerror=\"window.__xss = (window.__xss || 0) + 1\"></div>\n  ?kieu=loc → mã lạ chạy 0 lần · <img> trong DOM: 0 · <div class=\"gioi-thieu\"><p>Mụn trứng cá, viêm da cơ địa.</p></div>",
  intl: "$ node do/ch13-intl.mjs   # Node 22.21.0, ICU 77.1\n— vi-VN\n  ngày dài   : Thứ Năm, 1 tháng 10, 2026\n  ngày ngắn  : 1/10/26\n  giờ        : 20:00 / 7:30\n  số         : 5.000 1.234,5\n  tiền VND   : 350.000 ₫\n  tương đối  : Ngày mai | 3 giờ trước\n  số nhiều   : 0→other 1→other 2→other\n  danh sách  : Nội, Nhi và Da liễu\n— en-US\n  ngày dài   : Thursday, October 1, 2026\n  ngày ngắn  : 10/1/26\n  giờ        : 8:00 PM / 7:30 AM\n  số         : 5,000 1,234.5\n  tiền VND   : ₫350,000\n  tương đối  : tomorrow | 3 hours ago\n  số nhiều   : 0→other 1→one 2→other\n  danh sách  : Nội, Nhi, and Da liễu\n— cùng thời điểm, KHÔNG đặt timeZone, máy đặt TZ=America/New_York:\n   20:30 30/9/26 (có timeZone Asia/Ho_Chi_Minh: 07:30 1/10/26)",
  tscTuDien: "$ npx tsc -p tsconfig.loi.json --noEmit --pretty false\nvi-du-loi/tu-dien-thieu.ts(20,3): error TS2353: Object literal may only specify known properties, and ''chiTiet.kinhNghiem.othr'' does not exist in type 'Record<\"app.ten\" | \"app.gioMo\" | \"menu.nhan\" | \"menu.trangChu\" | \"menu.bacSi\" | \"menu.lichHen\" | \"menu.soLichHen\" | \"taiKhoan.chao\" | \"taiKhoan.dangNhap\" | \"taiKhoan.dangXuat\" | ... 6 more ... | \"chiTiet.kinhNghiem.other\", string>'.\nvi-du-loi/tu-dien-thieu.ts(26,3): error TS1360: Type '{ 'app.ten': string; }' does not satisfy the expected type 'Record<\"app.ten\" | \"app.gioMo\" | \"menu.nhan\" | \"menu.trangChu\" | \"menu.bacSi\" | \"menu.lichHen\" | \"menu.soLichHen\" | \"taiKhoan.chao\" | \"taiKhoan.dangNhap\" | \"taiKhoan.dangXuat\" | ... 6 more ... | \"chiTiet.kinhNghiem.other\", string>'.\n  Type '{ 'app.ten': string; }' is missing the following properties from type 'Record<\"app.ten\" | \"app.gioMo\" | \"menu.nhan\" | \"menu.trangChu\" | \"menu.bacSi\" | \"menu.lichHen\" | \"menu.soLichHen\" | \"taiKhoan.chao\" | \"taiKhoan.dangNhap\" | \"taiKhoan.dangXuat\" | ... 6 more ... | \"chiTiet.kinhNghiem.other\", string>': \"app.gioMo\", \"menu.nhan\", \"menu.trangChu\", \"menu.bacSi\", and 12 more.",
  b4Test: " ✓ điền biến; khoá hai ngôn ngữ khớp nhau\n ✓ số nhiều theo Intl.PluralRules: en 1 year / 12 years; vi không đổi dạng\n ✓ giờ theo vùng, luôn giờ Việt Nam\n[locHtml] vào: <p>Mụn trứng cá, viêm da cơ địa.</p><img src=\"x\" onerror=\"window.__xss = (window.__xss || 0) + 1\">\n[locHtml] ra : <p>Mụn trứng cá, viêm da cơ địa.</p>\n[locHtml] link: <a>bấm</a> <a href=\"https://anTam.vn\">web</a>\n ✓ giữ định dạng nội dung: <strong>, <ul><li>\n ✓ gỡ <img onerror>, <script>, style, href javascript:\n ✓ bấm EN ⇒ header, tab, số năm kinh nghiệm sang tiếng Anh; <html lang=\"en\">; lưu localStorage\n      Tests  6 passed (6)",
  cuoi: "$ npx tsc -b && npx vitest run\n Test Files  44 passed (44)\n      Tests  181 passed (181)\n\n$ npx vitest run --coverage\n…\nAll files          |   91.85 |    85.66 |   94.04 |    96.3 |\n(% Stmts | % Branch | % Funcs | % Lines)",
  build: "$ npx vite build\ndist/index.html                             0.72 kB │ gzip:   0.39 kB\ndist/assets/TrangDoiGio-BleFQ8UH.css        0.06 kB │ gzip:   0.08 kB\ndist/assets/index-D4frP24b.css             10.38 kB │ gzip:   2.86 kB\ndist/assets/TrangDangNhap-Cgto7KhQ.js       0.80 kB │ gzip:   0.54 kB\ndist/assets/phong-kham-Dcn093gy.js          1.48 kB │ gzip:   0.69 kB\ndist/assets/TrangLichTuan-DCsF13N1.js       2.10 kB │ gzip:   1.24 kB\ndist/assets/TrangDatLich-BbDBgWX0.js        3.04 kB │ gzip:   1.56 kB\ndist/assets/TrangDoiGio-D-gjNaYL.js         3.86 kB │ gzip:   1.95 kB\ndist/assets/TrangLichHen-CqaNLmZQ.js        4.31 kB │ gzip:   2.04 kB\ndist/assets/compiler-runtime-Dc66hXTW.js    8.94 kB │ gzip:   3.36 kB\ndist/assets/lich-tuan-CSluGFoV.js           9.31 kB │ gzip:   4.07 kB\ndist/assets/useMutation-C7IGF5um.js        12.85 kB │ gzip:   4.32 kB\ndist/assets/DanhSachBacSiAo-OI2rPKpZ.js    25.81 kB │ gzip:   7.87 kB\ndist/assets/GioiThieuBacSi-DqE9CCdt.js     28.94 kB │ gzip:  11.53 kB\ndist/assets/form-BNG_fjU0.js              116.77 kB │ gzip:  36.54 kB\ndist/assets/index-CG5KqQJ4.js             377.60 kB │ gzip: 120.59 kB\ndist/assets/browser-BurvvGjj.js           428.05 kB │ gzip: 161.11 kB\n✓ built in 1.27s",
};

/* ─── Sơ đồ mermaid trong bài (≤ 10 nút, nhãn ngắn; khối EN nhãn tiếng Anh, khối VI nhãn tiếng Việt) ─── */
const L = (...dong) => MM(dong.join('\n'));
const SD = {
  /* 13.1 */
  compoundVi: L(
    'flowchart TB',
    '  T["Tabs — useState + context"] -->|"dangChon, chon, idGoc"| C(("context"))',
    '  C --> Li["Tabs.List — role=tablist, ← →"]',
    '  C --> Ta["Tabs.Tab — aria-selected, tabIndex"]',
    '  C --> P["Tabs.Panel — role=tabpanel"]',
    '  U["Trang của bạn"] -->|"tự xếp mảnh, bọc span, thêm link"| T',
    '  classDef ctx fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class C ctx',
  ),
  compoundEn: L(
    'flowchart TB',
    '  T["Tabs — useState + context"] -->|"dangChon, chon, idGoc"| C(("context"))',
    '  C --> Li["Tabs.List — role=tablist, ← →"]',
    '  C --> Ta["Tabs.Tab — aria-selected, tabIndex"]',
    '  C --> P["Tabs.Panel — role=tabpanel"]',
    '  U["Your page"] -->|"arranges pieces, wraps spans, adds links"| T',
    '  classDef ctx fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class C ctx',
  ),
  headlessVi: L(
    'flowchart LR',
    '  D["Dữ liệu: gợi ý bác sĩ"] --> H["useCombobox — hành vi"]',
    '  H -->|"getInputProps()"| I["input của bạn"]',
    '  H -->|"getListboxProps()"| U["ul của bạn"]',
    '  H -->|"getOptionProps(i)"| O["li của bạn"]',
    '  CSS["CSS / Tailwind của bạn"] -.-> I',
    '  CSS -.-> U',
    '  classDef hv fill:#1a1030,stroke:#bc8cff,color:#fff',
    '  class H hv',
  ),
  headlessEn: L(
    'flowchart LR',
    '  D["Data: doctor suggestions"] --> H["useCombobox — behaviour"]',
    '  H -->|"getInputProps()"| I["your input"]',
    '  H -->|"getListboxProps()"| U["your ul"]',
    '  H -->|"getOptionProps(i)"| O["your li"]',
    '  CSS["your CSS / Tailwind"] -.-> I',
    '  CSS -.-> U',
    '  classDef hv fill:#1a1030,stroke:#bc8cff,color:#fff',
    '  class H hv',
  ),
  asVi: L(
    'flowchart TB',
    '  Q{"Nút này làm gì khi bấm?"} -->|"chạy một hàm"| B["Nut onClick → button type=button"]',
    '  Q -->|"đi tới trang trong app"| L["Nut as={Link} to → a của Router"]',
    '  Q -->|"ra ngoài, gọi điện, tải file"| A["Nut as=“a” href → a"]',
    '  L --> K["TS bắt buộc to, cấm href sai kiểu"]',
    '  B --> K2["TS cấm to, ref phải là HTMLButtonElement"]',
  ),
  asEn: L(
    'flowchart TB',
    '  Q{"What does pressing it do?"} -->|"runs a function"| B["Nut onClick → button type=button"]',
    '  Q -->|"goes to a page in the app"| L["Nut as={Link} to → Router a"]',
    '  Q -->|"leaves, calls, downloads"| A["Nut as=“a” href → a"]',
    '  L --> K["TS requires to"]',
    '  B --> K2["TS forbids to, ref must be HTMLButtonElement"]',
  ),
  /* 13.2 */
  hookXauVi: L(
    'sequenceDiagram',
    '  participant G as Gõ "vy"',
    '  participant R as Render',
    '  participant M as Màn hình',
    '  participant E as useEffect',
    '  G->>R: q = "vy"',
    '  R->>M: vẽ daLoc CŨ (6 bác sĩ)',
    '  M->>E: sau khi vẽ',
    '  E->>R: setDaLoc(1 bác sĩ)',
    '  R->>M: vẽ lại (1 bác sĩ)',
  ),
  hookXauEn: L(
    'sequenceDiagram',
    '  participant G as Type "vy"',
    '  participant R as Render',
    '  participant M as Screen',
    '  participant E as useEffect',
    '  G->>R: q = "vy"',
    '  R->>M: paints OLD daLoc (6 doctors)',
    '  M->>E: after paint',
    '  E->>R: setDaLoc(1 doctor)',
    '  R->>M: paints again (1 doctor)',
  ),
  hookHayHamVi: L(
    'flowchart TB',
    '  A{"Bên trong có gọi hook? (useState, useQuery…)"} -->|"không"| F["Hàm thường: locBacSi, dich"]',
    '  A -->|"có"| B{"Dùng lại ở ≥ 2 chỗ, hoặc làm component rối?"}',
    '  B -->|"không"| K["Để trong component"]',
    '  B -->|"có"| C["Custom hook useX"]',
    '  C --> D["Một việc · tham số object · trả object/union"]',
    '  C --> E["Không effect để sao chép state"]',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class F,D,E tot',
  ),
  hookHayHamEn: L(
    'flowchart TB',
    '  A{"Does it call a hook inside? (useState, useQuery…)"} -->|"no"| F["Plain function: locBacSi, dich"]',
    '  A -->|"yes"| B{"Reused in ≥ 2 places, or cluttering the component?"}',
    '  B -->|"no"| K["Keep it in the component"]',
    '  B -->|"yes"| C["Custom hook useX"]',
    '  C --> D["One job · object parameter · returns object/union"]',
    '  C --> E["No effect that copies state"]',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class F,D,E tot',
  ),
  cssVi: L(
    'flowchart TB',
    '  A{"Dự án đã có gì?"} -->|"CSS thường, đội quen CSS"| M["CSS Modules"]',
    '  A -->|"dự án mới, cần hệ thiết kế nhanh"| T["Tailwind"]',
    '  A -->|"thư viện UI có sẵn (MUI, Bootstrap)"| G["Theo cách của thư viện"]',
    '  M --> O["Tên lớp riêng từng file"]',
    '  T --> O2["Lớp tiện ích, thang màu sẵn"]',
    '  O --> K["Đừng trộn ba cách trong một component"]',
    '  O2 --> K',
  ),
  cssEn: L(
    'flowchart TB',
    '  A{"What does the project have?"} -->|"plain CSS, team knows CSS"| M["CSS Modules"]',
    '  A -->|"new project, needs a design system fast"| T["Tailwind"]',
    '  A -->|"a UI kit already (MUI, Bootstrap)"| G["Follow the kit"]',
    '  M --> O["Class names private per file"]',
    '  T --> O2["Utility classes, ready scales"]',
    '  O --> K["Do not mix three ways in one component"]',
    '  O2 --> K',
  ),
  /* 13.3 */
  aoVi: L(
    'flowchart TB',
    '  S["Cuộn trang"] --> V["Virtualizer: scrollY + khung nhìn"]',
    '  V --> R["Hàng nào trong khung + overscan?"]',
    '  R --> D["Vẽ ~9–15 hàng, translateY(start)"]',
    '  D --> M["measureElement: đo chiều cao thật"]',
    '  M -->|"lệch ước lượng"| V',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class D tot',
  ),
  aoEn: L(
    'flowchart TB',
    '  S["Scroll the page"] --> V["Virtualizer: scrollY + viewport"]',
    '  V --> R["Which rows are in view + overscan?"]',
    '  R --> D["Render ~9–15 rows, translateY(start)"]',
    '  D --> M["measureElement: real heights"]',
    '  M -->|"differs from estimate"| V',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class D tot',
  ),
  khiNaoAoVi: L(
    'flowchart TB',
    '  A{"Bao nhiêu mục cùng lúc?"} -->|"dưới vài trăm"| N["Vẽ đủ — đơn giản, Ctrl+F chạy"]',
    '  A -->|"hàng nghìn"| B{"Đo thấy chậm? (Profiler, CPU 4×)"}',
    '  B -->|"không"| N',
    '  B -->|"có"| C{"Người dùng cần thấy hết một lúc?"}',
    '  C -->|"không, họ tìm/lọc"| P["Phân trang / xem thêm"]',
    '  C -->|"có, họ cuộn"| V["Virtualization + ngưỡng"]',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class V,P tot',
  ),
  khiNaoAoEn: L(
    'flowchart TB',
    '  A{"How many items at once?"} -->|"a few hundred"| N["Render all — simple, Ctrl+F works"]',
    '  A -->|"thousands"| B{"Measured slow? (Profiler, 4× CPU)"}',
    '  B -->|"no"| N',
    '  B -->|"yes"| C{"Must users see them all at once?"}',
    '  C -->|"no, they search/filter"| P["Pagination / load more"]',
    '  C -->|"yes, they scroll"| V["Virtualization + threshold"]',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class V,P tot',
  ),
  compilerVi: L(
    'sequenceDiagram',
    '  participant C as Cuộn',
    '  participant V as ao (cùng một object)',
    '  participant K as Cache của Compiler',
    '  participant D as DOM',
    '  C->>V: scrollY đổi — ao tự sửa bên trong',
    '  V->>K: "ao" vẫn là object cũ',
    '  K->>D: trả JSX cũ (hàng 0–7)',
    '  Note over D: giữa trang: 0 thẻ trong khung',
  ),
  compilerEn: L(
    'sequenceDiagram',
    '  participant C as Scroll',
    '  participant V as ao (same object)',
    '  participant K as Compiler cache',
    '  participant D as DOM',
    '  C->>V: scrollY changes — ao mutates itself',
    '  V->>K: "ao" is the same object',
    '  K->>D: returns old JSX (rows 0–7)',
    '  Note over D: mid page: 0 cards in view',
  ),
  /* 13.4 */
  xssVi: L(
    'flowchart TB',
    '  S["Chuỗi từ API / CMS / người dùng"] --> A{"Hiển thị thế nào?"}',
    '  A -->|"{chuoi} trong JSX"| T["React thoát ký tự → CHỮ"]',
    '  A -->|"dangerouslySetInnerHTML"| B{"Đã lọc?"}',
    '  B -->|"chưa"| X["Mã lạ CHẠY"]',
    '  B -->|"DOMPurify + danh sách trắng"| OK["Chỉ còn thẻ định dạng"]',
    '  A -->|"href={url}"| U["Kiểm protocol http/https"]',
    '  classDef xau fill:#3a1414,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class X xau',
    '  class T,OK,U tot',
  ),
  xssEn: L(
    'flowchart TB',
    '  S["A string from API / CMS / users"] --> A{"How is it shown?"}',
    '  A -->|"{str} in JSX"| T["React escapes → TEXT"]',
    '  A -->|"dangerouslySetInnerHTML"| B{"Sanitised?"}',
    '  B -->|"no"| X["Foreign code RUNS"]',
    '  B -->|"DOMPurify + allowlist"| OK["Only formatting tags left"]',
    '  A -->|"href={url}"| U["Check protocol http/https"]',
    '  classDef xau fill:#3a1414,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0f2a1a,stroke:#3fb950,color:#fff',
    '  class X xau',
    '  class T,OK,U tot',
  ),
  i18nVi: L(
    'flowchart LR',
    '  N["Nút VI / EN"] --> S["useNgonNguStore (persist)"]',
    '  S --> H["useDich()"]',
    '  H --> D["TU_DIEN[ngonNgu][khoa]"]',
    '  H --> I["Intl: giờ, số, số nhiều"]',
    '  S --> L["html lang (effect)"]',
    '  D --> C["Component vẽ chuỗi"]',
    '  I --> C',
  ),
  i18nEn: L(
    'flowchart LR',
    '  N["VI / EN buttons"] --> S["useNgonNguStore (persist)"]',
    '  S --> H["useDich()"]',
    '  H --> D["TU_DIEN[ngonNgu][key]"]',
    '  H --> I["Intl: time, numbers, plurals"]',
    '  S --> L["html lang (effect)"]',
    '  D --> C["Component renders strings"]',
    '  I --> C',
  ),
};

/* ─── Đoạn mã ngắn minh hoạ trong bài (không phải file của dự án): hình dạng API, viết ở đây để khỏi thoát ký tự trong content ─── */
const IN = {
  cauHinhEn: "// The 'configuration object' way — works on day one\n<Tabs\n  tabs={[\n    { id: 'gio-kham', nhan: 'Giờ khám', noiDung: <ChonKhungGio bacSiId={id} /> },\n    { id: 'gioi-thieu', nhan: 'Giới thiệu', noiDung: <GioiThieuBacSi id={id} /> },\n  ]}\n/>",
  cauHinhVi: "// Kiểu 'object cấu hình' — chạy tốt ngày đầu\n<Tabs\n  tabs={[\n    { id: 'gio-kham', nhan: 'Giờ khám', noiDung: <ChonKhungGio bacSiId={id} /> },\n    { id: 'gioi-thieu', nhan: 'Giới thiệu', noiDung: <GioiThieuBacSi id={id} /> },\n  ]}\n/>",
  hinhDang: '<Tabs macDinh="gio-kham">\n  <Tabs.List aria-label="Thông tin bác sĩ">\n    <Tabs.Tab giaTri="gio-kham">Giờ khám</Tabs.Tab>\n    <Tabs.Tab giaTri="gioi-thieu">Giới thiệu</Tabs.Tab>\n  </Tabs.List>\n  <Tabs.Panel giaTri="gio-kham">…</Tabs.Panel>\n  <Tabs.Panel giaTri="gioi-thieu">…</Tabs.Panel>\n</Tabs>',
};

const L0 = {
    title: '13.0 — Chapter 13 slides: design patterns and architecture in pictures|||13.0 — Slide Chương 13: mẫu thiết kế & kiến trúc bằng hình',
    slug: 'rx-13-0-slides',
    type: 'DOCUMENT',
    isFreePreview: true,
    description: 'Cả Chương 13 trong 28 slide: compound Tabs, hook headless, nút đa hình "as", hook tốt so với hook xấu (đếm render), va chạm CSS toàn cục và CSS Modules so với Tailwind, 5000 bác sĩ trước/sau virtualization, React Compiler làm đông cứng virtualizer, XSS với DOMPurify, và i18n với Intl.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Slides</span>
<h2>The whole chapter in 28 slides</h2>
<p class="lead">Design patterns and architecture, applied to the real clinic app instead of toy examples: reusable components that do not grow a prop per wish, hooks with a clean API, CSS that cannot collide, a list of 5,000 doctors that stays fast, HTML from a CMS that cannot run code, and a second language. Every number on the slides was measured on the project.</p>
<p>Slides 3–8 belong to Lesson 13.1 (props that keep growing, the compound <code>Tabs</code> and its context, why <code>cloneElement</code> fails silently, the ARIA keyboard pattern, a headless combobox with prop getters, a polymorphic <code>as</code> with four real type errors), 9–14 to Lesson 13.2 (a hook that copies state — 4 renders, one wrong; a good hook returning a discriminated union; what React Compiler does to returned objects; a real <code>.hang-nut</code> collision measured in Chromium; CSS Modules; Tailwind 4 on the same card with bundle sizes), 15–20 to Lesson 13.3 (5,000 cards measured, the idea of virtualisation, <code>useWindowVirtualizer</code>, the blank page caused by React Compiler and <code>'use no memo'</code>, before/after at 4× CPU, the price), 21–25 to Lesson 13.4 (three ways to show an injected string, DOMPurify with an allowlist, <code>javascript:</code> URLs, a typed dictionary, <code>Intl</code> and time zones). Slide 26 lists common mistakes, 27 is the cheat sheet for the quiz, 28 the project steps. Built and measured on 26 September 2026 with React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2, @tanstack/react-virtual 3.14.13, DOMPurify 3.4.16, Tailwind CSS 4.3.3 and Chromium 149: the app went from 145 to 181 tests.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Slide</span>
<h2>Cả chương trong 28 slide</h2>
<p class="lead">Mẫu thiết kế và kiến trúc, áp vào chính app phòng khám thay vì ví dụ đồ chơi: component dùng lại mà không mọc thêm prop cho mỗi mong muốn, hook có API gọn, CSS không thể đụng nhau, danh sách 5.000 bác sĩ vẫn nhanh, HTML từ CMS không chạy được mã, và một ngôn ngữ thứ hai. Mọi con số trên slide đều đo trên dự án.</p>
<p>Slide 3–8 thuộc Bài 13.1 (prop phình ra, <code>Tabs</code> compound và context của nó, vì sao <code>cloneElement</code> hỏng im lặng, mẫu bàn phím ARIA, combobox headless với prop getter, <code>as</code> đa hình với bốn lỗi kiểu thật), 9–14 thuộc Bài 13.2 (hook chép state — 4 lần render, một lần sai; hook tốt trả union phân biệt; React Compiler làm gì với object trả về; va chạm <code>.hang-nut</code> thật đo trên Chromium; CSS Modules; Tailwind 4 trên cùng thẻ kèm kích thước bundle), 15–20 thuộc Bài 13.3 (đo 5.000 thẻ, ý tưởng virtualization, <code>useWindowVirtualizer</code>, trang trắng do React Compiler và <code>'use no memo'</code>, trước/sau ở CPU 4×, cái giá), 21–25 thuộc Bài 13.4 (ba cách hiện một chuỗi bị chèn mã, DOMPurify với danh sách trắng, URL <code>javascript:</code>, từ điển có kiểu, <code>Intl</code> và múi giờ). Slide 26 liệt kê sai lầm hay gặp, 27 là bảng tra nhanh cho bài kiểm tra, 28 là các bước dự án. Dựng và đo ngày 26/09/2026 với React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2, @tanstack/react-virtual 3.14.13, DOMPurify 3.4.16, Tailwind CSS 4.3.3 và Chromium 149: app đi từ 145 lên 181 test.</p>
</div>
${gallery('rx-13', [
  [1, 'Bìa — Chương 13: Mẫu thiết kế & kiến trúc'],
  [2, 'Bản đồ chương'],
  [3, 'Prop cấu hình phình ra; compound chia thành mảnh ghép'],
  [4, 'Tabs compound: một context, bốn mảnh cùng đọc'],
  [5, 'cloneElement chỉ thấy con trực tiếp; context thấy mọi độ sâu'],
  [6, 'Tab đúng chuẩn ARIA: một điểm dừng Tab, mũi tên đổi tab'],
  [7, 'Headless: hook lo hành vi, component lo giao diện'],
  [8, 'Polymorphic as: TypeScript đổi bộ prop theo thẻ'],
  [9, 'Hook sao chép state: 4 lần render, một lần sai'],
  [10, 'Hook tốt: một việc, tham số có tên, union phân biệt'],
  [11, 'React Compiler giữ nguyên object hook trả về'],
  [12, 'Hai file cùng tên lớp .hang-nut: style trộn vào nhau'],
  [13, 'CSS Modules: tên lớp riêng từng file'],
  [14, 'Tailwind hay CSS Modules: đo rồi chọn'],
  [15, 'Vẽ đủ 5000 thẻ: 37.715 nút DOM, 2,8 giây trên máy yếu'],
  [16, 'Virtualization: trang cao như cũ, DOM vài chục thẻ'],
  [17, 'useWindowVirtualizer: đếm hàng, ước lượng, đo lại'],
  [18, 'React Compiler + virtualizer: giữa trang trắng tinh'],
  [19, 'Trước và sau, CPU chậm 4×'],
  [20, 'Cái giá của danh sách ảo'],
  [21, 'Một chuỗi bị chèn mã: ba cách hiển thị'],
  [22, 'DOMPurify + danh sách trắng'],
  [23, 'href="javascript:…" trong React 19'],
  [24, 'i18n: từ điển có kiểu, satisfies'],
  [25, 'Intl: theo vùng và theo múi giờ'],
  [26, 'Sai lầm hay gặp ở Chương 13'],
  [27, 'Bảng tra nhanh Chương 13'],
  [28, 'Tự gõ tiếp dự án'],
])}
`,
};

const L1 = {
    title: '13.1 — Compound components, headless hooks and a polymorphic "as"|||13.1 — Compound component, hook headless và prop "as" đa hình',
    slug: 'rx-13-1-compound-headless',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Ba mẫu làm component dùng lại được mà không phình prop: Tabs compound chung state qua context (đúng chuẩn ARIA, điều khiển bằng URL), ô gợi ý headless bằng prop getter, và nút đa hình "as" có TypeScript bắt lỗi thật — tất cả áp vào app phòng khám, có test.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1</span>
<h2>Compound components, headless hooks and a polymorphic <code>as</code></h2>
<p class="lead">Until now every component in the clinic app was built for exactly one place. That is fine for a page; it breaks down for the pieces a team reuses dozens of times — tabs, dropdowns, buttons, search boxes. The naive way to make a component "reusable" is to add a prop for every new wish, until it has fifteen props and nobody dares touch it. This lesson teaches three patterns that professional component libraries (Radix, React Aria, Headless UI, MUI Base) are built on, and applies each one to the real app: a <strong>compound</strong> <code>Tabs</code> for the doctor page, a <strong>headless</strong> hook for a quick-search box, and a <strong>polymorphic</strong> <code>Nut</code> ("button") whose allowed props change with the element it renders.</p>
<p>Starting point: the clinic app after Chapter 10 — 30 test files, <strong>145 tests</strong> green, React Compiler on, TanStack Query over MSW, React Router with lazy routes. Everything in this chapter was built and measured on 26 September 2026 with React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2, @testing-library/react 16.3.3, React Router 8.4.0 and Chromium 149. By the end of the chapter the same app has <strong>181 tests</strong> in 44 files.</p>

<div class="callout"><p><strong>How this chapter works.</strong></p>
<ul>
<li><strong>13.1 (this lesson)</strong> — reusable components: compound, headless, polymorphic <code>as</code>.</li>
<li><strong>13.2</strong> — custom hooks that are good (and ones that are not, measured), and styling: CSS Modules versus Tailwind, measured on this app.</li>
<li><strong>13.3</strong> — a list of 5,000 doctors: measure, virtualise with <code>@tanstack/react-virtual</code>, measure again, and a real clash between the virtualiser and React Compiler.</li>
<li><strong>13.4</strong> — XSS and <code>dangerouslySetInnerHTML</code> from the defender's side, then basic internationalisation with <code>Intl</code>.</li>
</ul>
<p>Every lesson ends with one step of "🛠 Keep building the project" and a folded solution. These are patterns, not rules: each section says when <em>not</em> to use them.</p></div>

<h3>The problem: a prop for every wish</h3>
${slide('rx-13', 3, 'Configuration props keep growing; a compound component splits into pieces')}
<p>The detail page of a doctor needs two tabs: "Giờ khám" (appointment times) and "Giới thiệu" (about). The first version anyone writes looks like this (a sketch of the API, not a file in the project): one component, and the content passed in as data.</p>
${pre('tsx', IN.cauHinhEn)}
<p>Then the requests arrive. "Put a small 'Mới' badge on the second tab." A <code>badge</code> field. "Add a link on the right of the tab bar." A <code>phaiDanhSach</code> prop. "Wrap one tab in a tooltip." A <code>bocTab</code> render prop. "Disable a tab for guests." A <code>tat</code> field. Each wish is small; together they turn the component into a mini-language that only its author understands, and every new wish needs a change inside the shared component — which means a review from whoever owns it, and a risk for every other page that uses it.</p>
<p>The alternative is to hand the <em>structure</em> back to the user of the component. HTML already works this way: <code>&lt;select&gt;</code> does not take an <code>options</code> array, it takes <code>&lt;option&gt;</code> children, and <code>&lt;table&gt;</code> is assembled from <code>&lt;thead&gt;</code>, <code>&lt;tr&gt;</code>, <code>&lt;td&gt;</code>. The pieces cooperate invisibly — the select knows which option is chosen without you wiring anything. A <strong>compound component</strong> (component phức hợp) is the React version of that idea: a set of components that share state implicitly and that you arrange yourself.</p>

<h3>Compound component: <code>Tabs</code> built from four pieces</h3>
${slide('rx-13', 4, 'Tabs compound: one context holds the selected tab, four pieces read it')}
<p>The shape we want on the doctor page:</p>
${pre('tsx', IN.hinhDang)}
<p>Four pieces, one secret: which tab is selected. The parent <code>Tabs</code> owns that state and publishes it through <strong>context</strong> (Chapter 5); every piece reads it, however deep it sits. Here is the diagram, then the whole file as it runs in the project:</p>
${SD.compoundEn}
${pre('tsx', SN.tabs)}
<p>Read it top to bottom; every line has a reason.</p>
<ul>
<li><strong><code>createContext&lt;NguCanhTabs | null&gt;(null)</code></strong> — the default is <code>null</code> on purpose, so a piece used outside <code>&lt;Tabs&gt;</code> can be detected. <code>useNguCanhTabs</code> throws an error that says exactly what to do. Without it, the mistake shows up as "Cannot read properties of null" somewhere deep inside.</li>
<li><strong><code>use(NguCanh)</code></strong> — React 19 lets you read a context with <code>use</code> (Chapter 12); <code>useContext</code> works identically here.</li>
<li><strong><code>&lt;NguCanh value={…}&gt;</code></strong> — in React 19 the context object itself is the provider; <code>NguCanh.Provider</code> still works but is no longer needed.</li>
<li><strong><code>useId()</code></strong> — a stable unique id per <code>Tabs</code> instance. The ARIA attributes link a tab to its panel by id (<code>aria-controls</code>, <code>aria-labelledby</code>); two tab sets on one page must not collide.</li>
<li><strong>The <code>TabsProps</code> union</strong> — either <code>macDinh</code> (uncontrolled) or <code>giaTri</code> + <code>onDoi</code> (controlled), never both. <code>giaTri?: never</code> makes TypeScript reject a mix.</li>
<li><strong><code>Tabs.List = List</code></strong> — functions are objects in JavaScript, so we can hang the pieces on the parent. One import gives the whole set, and the names read like the HTML they produce.</li>
<li><strong><code>Panel</code> returns <code>null</code> when hidden</strong> — the hidden tab's content is not mounted, so it does not fetch or render anything until opened. <code>giuLai</code> keeps it mounted but <code>hidden</code> when you need its state preserved (a half-typed form).</li>
</ul>
<div class="callout"><p><strong>JS quick reminder — <code>??</code> and rest props.</strong> <code>giaTri ?? tuGiu</code> means "use <code>giaTri</code> unless it is <code>null</code> or <code>undefined</code>, then use <code>tuGiu</code>". <code>function List({ children, ...props })</code> takes <code>children</code> out and collects every other prop into <code>props</code>; <code>{...props}</code> then spreads them onto the <code>div</code>, so <code>aria-label</code> passed by the page lands on the real element.</p></div>
<p><strong>Controlled versus uncontrolled</strong> (điều khiển / không điều khiển) is the same idea you met with <code>&lt;input value&gt;</code> versus <code>&lt;input defaultValue&gt;</code> in Chapter 3. Uncontrolled: the component keeps its own state; the parent just gives a starting value. Controlled: the parent owns the value and the component only asks for changes through <code>onDoi</code>. Good reusable components support both; the doctor page uses the controlled mode, as you will see below.</p>

<h3>Run it step by step</h3>
<ol>
<li>Open <code>/bac-si/bs-1</code>. React renders <code>TrangChiTietBacSi</code> → <code>Tabs</code> creates its state (<code>'gio-kham'</code>) and a context value.</li>
<li><code>Tabs.List</code> renders a <code>div role="tablist"</code>. Each <code>Tabs.Tab</code> reads the context: the first one is selected → <code>aria-selected="true"</code>, <code>tabIndex={0}</code>; the second gets <code>tabIndex={-1}</code>.</li>
<li><code>Tabs.Panel giaTri="gio-kham"</code> matches → renders <code>role="tabpanel"</code> with the time picker. The "Giới thiệu" panel returns <code>null</code>: nothing of it exists in the DOM.</li>
<li>Press <code>Tab</code>: focus lands on "Giờ khám" only (the other tab has <code>-1</code>). Press <code>→</code>: <code>onKeyDown</code> on the list finds the tabs, focuses the next one and calls <code>chon('gioi-thieu')</code>.</li>
<li>State changes → every piece re-renders with the new context value → the panels swap. Press <code>Tab</code> again: focus moves into the panel (its <code>tabIndex={0}</code>), not through the other tab.</li>
</ol>

<h3>Why not <code>Children.map</code> + <code>cloneElement</code></h3>
${slide('rx-13', 5, 'cloneElement sees only direct children; context reaches any depth')}
<p>Older libraries and many blog posts build compound components differently: the parent loops over its children and injects props with <code>cloneElement</code>. It looks simpler — no context — so it is worth seeing where it breaks. The version below is in <code>src/vi-du/ch13/TabsClone.tsx</code>:</p>
${pre('tsx', SN.tabsClone)}
<p>It works when every <code>TabCu</code> is a <em>direct</em> child. Now do something completely ordinary — wrap one tab in a <code>&lt;span title&gt;</code> to get a tooltip:</p>
${pre('tsx', SN.tabsCloneTest)}
${out(OUT.clone)}
<p>The parent's loop sees a <code>span</code>, not a <code>TabCu</code>, so the tab never receives <code>dangChon</code> or <code>onChon</code>. Clicking B does nothing, with no error and no warning. The context version has a test for exactly this case (a <code>Tabs.Tab</code> inside a <code>span</code>) and it passes: context does not care how deep a piece sits. react.dev lists <code>cloneElement</code> and <code>Children</code> under "Legacy React APIs" and recommends context or render props instead.</p>
<div class="pitfall co-tieu-de"><strong>Trap — the silent compound component.</strong> Compound components built with <code>cloneElement</code> fail without any message as soon as a piece is wrapped (a tooltip, a feature flag, a small wrapper component). If you inherit one, test it with a wrapped child before trusting it; when you write one, use context and make pieces throw when they are used outside their parent.</div>

<h3>Keyboard and ARIA: tabs that behave like tabs</h3>
${slide('rx-13', 6, 'Correct tabs: one Tab stop, arrow keys switch, the panel takes focus')}
<p>A row of buttons that swaps content is not yet "tabs" for a keyboard or screen-reader user. The WAI-ARIA Authoring Practices Guide (APG) describes the expected behaviour, and <code>Tabs</code> follows it:</p>
<table>
<thead><tr><th>Key / attribute</th><th>Behaviour</th><th>Where in the code</th></tr></thead>
<tbody>
<tr><td><code>Tab</code></td><td>enters the tab list on the <em>selected</em> tab only, then leaves to the panel</td><td><code>tabIndex={duocChon ? 0 : -1}</code> ("roving tabindex")</td></tr>
<tr><td><code>→</code> / <code>←</code></td><td>next / previous tab, wrapping around, and it becomes selected</td><td><code>onKeyDown</code> of <code>List</code></td></tr>
<tr><td><code>Home</code> / <code>End</code></td><td>first / last tab</td><td>same table of keys</td></tr>
<tr><td><code>role</code></td><td><code>tablist</code> › <code>tab</code>, <code>tabpanel</code> — read as "tab, 2 of 2, selected"</td><td>each piece</td></tr>
<tr><td><code>aria-controls</code> / <code>aria-labelledby</code></td><td>tab ↔ panel link; the panel's accessible name is the tab's text</td><td>ids from <code>useId</code></td></tr>
</tbody>
</table>
<p>The APG allows "automatic activation" (arrow keys also select) when panels appear instantly, and "manual activation" (arrows move focus, Enter/Space selects) when showing a panel is slow. Our panels are fast, so arrows select. The keyboard test drives this exactly as a user would:</p>
${pre('tsx', SN.tabsTestPhim)}
<p>Notice the queries: <code>getByRole('tab', { name: 'Đánh giá', selected: true })</code> — Testing Library understands <code>aria-selected</code>, so the test states the behaviour, not the implementation.</p>

<h3>Controlled by the URL: the doctor page</h3>
<p>On the real page the selected tab should survive a refresh and a shared link — <code>/bac-si/bs-1?tab=gioi-thieu</code> — which means it lives on the URL (Chapter 5 and 7: state that a link should carry belongs on the URL). That is the controlled mode: the URL is the source of truth, <code>Tabs</code> only reports changes.</p>
${pre('tsx', SN.tabsTheoUrl)}
${pre('tsx', SN.trangTabs)}
<p>Three details. The value read from the URL is checked against a list (<code>TAB.find</code>) — users can type anything in a URL, so <code>?tab=la</code> falls back to the default instead of showing no panel at all. The update uses the <em>function</em> form of <code>setSp</code> and copies the old params, because the time picker keeps <code>?ngay=…</code> on the same URL and we must not wipe it. And <code>replace: true</code>: switching tabs should not create a history entry for every click.</p>
<p>Why is the URL reading in a separate small component (<code>TabsTheoUrl</code>) instead of in the page? The first version read <code>useSearchParams</code> in <code>TrangChiTietBacSi</code> itself. It worked in Chromium — both the production build and the dev server loaded new appointment times in 5–46 ms after a day change — but an existing accessibility test from Chapter 8 started failing in jsdom: after pressing <code>→</code> on the day picker, the query for the new day stayed <code>pending</code>/<code>idle</code> and never fetched. The same test passed without React Compiler, and passed again once only a small child read the URL:</p>
${out(OUT.tabsUrl)}
<p>Moving the URL read down is good practice anyway: with the page reading the URL, every change of <code>?ngay=</code> re-renders the whole page; with <code>TabsTheoUrl</code>, only it re-renders, and the panels — created by the page and passed as <code>children</code> — are the same elements, so React skips them. ⚠ The exact reason for the jsdom-only failure (an interaction between React Compiler's memoisation, <code>act()</code> and a transition) was not pinned down; the lesson reports what was measured, not a guess.</p>

<h3>Headless: behaviour without looks</h3>
${slide('rx-13', 7, 'Headless: the hook owns behaviour, your component owns the look')}
<p>A <strong>headless</strong> component (component "không đầu" — không có giao diện) is the far end of the same idea: the library gives you all the <em>behaviour</em> — state, keyboard handling, ARIA attributes — and renders nothing. You write every tag and every class. Design systems love this, because the hard, invisible part (a combobox that screen readers announce correctly) is written once, while each product keeps its own look.</p>
${SD.headlessEn}
<p>The home page gets a "Tìm nhanh bác sĩ" box: type part of a name, pick a suggestion with the mouse or with <code>↓</code> and <code>Enter</code>, land on that doctor's page. The behaviour lives in <code>useCombobox</code>, a hook that returns <strong>prop getters</strong> — functions that give you the props to spread on your own elements:</p>
${pre('ts', SN.useCombobox)}
<p>The important decisions:</p>
<ul>
<li><strong>Focus stays in the input.</strong> The highlighted option is announced through <code>aria-activedescendant</code> (the id of the active option), not by moving focus. The user keeps typing while arrowing through suggestions.</li>
<li><strong>Prop getters merge handlers.</strong> <code>getInputProps({ onChange })</code> calls <em>your</em> <code>onChange</code> and then its own. If the hook simply returned <code>{ onChange }</code> and you also wrote <code>onChange</code> after the spread, one would silently replace the other — the most common bug with "props bags".</li>
<li><strong><code>onMouseDown: e.preventDefault()</code> on options</strong> — without it, pressing the mouse blurs the input first, <code>onBlur</code> closes the list, and the click lands on nothing.</li>
<li><strong>No state that can be derived.</strong> <code>dangMo</code> and <code>sangHopLe</code> are computed from state and props on each render; when the list gets shorter, an out-of-range index simply becomes <code>-1</code>.</li>
</ul>
<p>And the look, owned by the app:</p>
${pre('tsx', SN.timNhanh)}
${pre('tsx', SN.timNhanhTest)}
${out(OUT.b1Test)}
<p>The same hook could drive a medicine picker or a specialty selector with a completely different look — that is the point of headless. In practice you rarely write this hook yourself; you pick a library and learn its API. Versions checked on npm on 26/09/2026:</p>
<table>
<thead><tr><th>Library</th><th>Version</th><th>Style</th><th>Good for</th></tr></thead>
<tbody>
<tr><td>Radix UI (<code>@radix-ui/react-tabs</code>…)</td><td>1.1.21</td><td>compound, unstyled; <code>asChild</code></td><td>the base under shadcn/ui</td></tr>
<tr><td>React Aria Components</td><td>1.21.1</td><td>compound + hooks, Adobe</td><td>the most thorough accessibility and i18n</td></tr>
<tr><td>Headless UI</td><td>2.2.10</td><td>compound, from the Tailwind team</td><td>Tailwind projects</td></tr>
<tr><td>Base UI (<code>@base-ui/react</code>)</td><td>1.8.0</td><td>compound, unstyled</td><td>teams coming from MUI</td></tr>
<tr><td>Downshift</td><td>9.4.0</td><td>hooks with prop getters</td><td>custom comboboxes and selects</td></tr>
</tbody>
</table>

<h3>Polymorphic <code>as</code>: one button, many elements</h3>
${slide('rx-13', 8, 'Polymorphic as: TypeScript changes the allowed props with the element')}
<p>The app has "buttons" that are really three different elements. "Đăng xuất" runs a function — a <code>&lt;button&gt;</code>. "Xem đội ngũ bác sĩ →" goes to another page — a React Router <code>&lt;Link&gt;</code>, i.e. an <code>&lt;a&gt;</code>. A future "Gọi 1900 1234" would be <code>&lt;a href="tel:…"&gt;</code>. They should <em>look</em> the same but must stay the right element: a link that is secretly a button cannot be opened in a new tab; a button that is secretly a <code>div</code> is invisible to keyboards. A <strong>polymorphic</strong> (đa hình) component takes an <code>as</code> prop and renders whatever element you ask for:</p>
${SD.asEn}
${pre('tsx', SN.nut)}
<p>The type does the real work. <code>ComponentPropsWithRef&lt;C&gt;</code> is "every prop the element or component <code>C</code> accepts, including <code>ref</code>". With <code>C = 'button'</code> that is <code>onClick</code>, <code>disabled</code>, <code>type</code>…; with <code>C = typeof Link</code> it is <code>to</code>, <code>replace</code>, <code>state</code>…. <code>Omit&lt;…, keyof PropRieng&lt;C&gt;&gt;</code> removes the names we define ourselves so they cannot clash. TypeScript infers <code>C</code> from the <code>as</code> you pass, so the allowed props change as you type. In React 19 <code>ref</code> is an ordinary prop, so no <code>forwardRef</code> is needed.</p>
<p>Compare with the version found in many codebases, where every prop is <code>any</code>:</p>
${pre('tsx', SN.nutNgayTho)}
<p>Both uses compile — including <code>hreff</code> (typo) and a <code>to</code> on a button that renders <code>&lt;button to="/bac-si"&gt;</code> and goes nowhere. The correct type catches four real mistakes. We keep them as a <strong>type test</strong>: <code>Nut.kieu.tsx</code> is checked by <code>tsc -b</code> on every build, and each line marked <code>@ts-expect-error</code> must fail; if someone loosens the type, the comment itself becomes an error.</p>
${pre('tsx', SN.nutKieu)}
${out(OUT.tscNut)}
<p>Where is it used? On the home page (<code>&lt;Nut as={Link} to={duongDan.bacSi} bienThe="chinh"&gt;</code>), for the back link on the doctor page, and for "Đăng xuất" in the header. Libraries built on Radix use a different spelling of the same idea, <code>asChild</code>: <code>&lt;Button asChild&gt;&lt;Link to="/"&gt;…&lt;/Link&gt;&lt;/Button&gt;</code> — the button merges its props onto its only child (Radix Slot, 1.3.3). Same purpose, no generic types to write.</p>
<div class="pitfall co-tieu-de"><strong>Trap — the button that submits the form.</strong> A <code>&lt;button&gt;</code> without <code>type</code> is <code>type="submit"</code>. Put a "Xem thêm" button inside the booking form and every click submits the form. <code>Nut</code> sets <code>type="button"</code> whenever it renders a real button; a submit button must say <code>type="submit"</code> explicitly.</div>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202 you use React-Bootstrap: <code>&lt;Tabs defaultActiveKey="home"&gt;&lt;Tab eventKey="home" title="Home"&gt;</code> (configuration through props) and you meet <code>as</code> already — <code>&lt;Nav.Link as={Link} to="/"&gt;</code>, <code>&lt;Button as="a"&gt;</code> — plus compound names like <code>Card.Body</code> and <code>Dropdown.Toggle</code>, usually without knowing that they are patterns. → At work the same patterns are used deliberately: teams build or adopt unstyled compound/headless components (Radix, React Aria, Headless UI, shadcn/ui) and put their own styling on top, with the <code>as</code>/<code>asChild</code> props fully typed in TypeScript. · <em>Why:</em> React-Bootstrap is not wrong — it is a complete, styled kit, perfect for an assignment and still found in older company apps. Companies with their own design need the behaviour without Bootstrap's look, and they need types that catch <code>to</code> on a button before review does.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "What is a compound component, and how do the pieces share state?"</p>
<p>A set of components used together that share implicit state — like <code>&lt;select&gt;</code>/<code>&lt;option&gt;</code>. The parent holds state and exposes it through context; each piece reads the context, so pieces can be nested at any depth and arranged freely. Mention the old <code>cloneElement</code> approach and why it breaks with wrappers, and that a piece outside its parent should throw a clear error. Bonus: support controlled and uncontrolled modes, like inputs.</p></div>
<div class="callout"><p><strong>Common interview question.</strong> "What does 'headless' mean in a UI library, and why would a company choose one?"</p>
<p>The library provides behaviour and accessibility — state, keyboard, ARIA — but no markup or styles; you render everything, often through prop getters or compound pieces. Companies choose it to keep their own design system while not re-implementing hard accessibility behaviour. Trade-off: more code to write for the look, and you must learn the library's API. Examples: Radix, React Aria, Headless UI, Downshift, TanStack Table/Virtual.</p></div>

<h3>🛠 Keep building the project — step 1/4: reusable pieces</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after Chapter 10 (<code>src/pages/TrangChiTietBacSi.tsx</code>, <code>src/pages/TrangChu.tsx</code>, <code>src/app/Header.tsx</code>; 145 tests).</p><ol>
<li>Create <code>src/shared/ui/Tabs.tsx</code> (+ <code>Tabs.module.css</code>, explained in 13.2) with <code>Tabs</code>, <code>Tabs.List</code>, <code>Tabs.Tab</code>, <code>Tabs.Panel</code>, controlled and uncontrolled. Write <code>Tabs.test.tsx</code>: ARIA roles, keyboard, controlled mode, a piece outside <code>Tabs</code> throws, a wrapped tab still works.</li>
<li>On <code>/bac-si/:id</code>: move the time picker and the "Xem lịch trống cả tuần" link into a "Giờ khám" panel, the doctor's introduction into a "Giới thiệu" panel (a new <code>GioiThieuBacSi</code> reading the same promise as <code>HoSoBacSi</code>). The tab lives on <code>?tab=</code>, read by a small <code>TabsTheoUrl</code>.</li>
<li>Write <code>src/shared/hooks/useCombobox.ts</code> and a <code>TimNhanhBacSi</code> on the home page (max 6 suggestions, Enter navigates).</li>
<li>Write <code>src/shared/ui/Nut.tsx</code> with a typed <code>as</code> and a <code>Nut.kieu.tsx</code> type test; use it for the home-page link, the back link and "Đăng xuất".</li>
</ol>
<p><strong>Done when:</strong> <code>npx tsc -b</code> is clean (every <code>@ts-expect-error</code> really errors); the three new test files pass — 10 tests; the existing 145 still pass, including the Chapter 8 accessibility test that presses <code>→</code> on the day picker.</p></div>
<details><summary>Solution</summary>
<p>All files are printed above exactly as in the reference project (<code>Tabs.tsx</code>, <code>useCombobox.ts</code>, <code>TimNhanhBacSi.tsx</code>, <code>Nut.tsx</code>, <code>Nut.kieu.tsx</code>, <code>TabsTheoUrl</code> in <code>TrangChiTietBacSi.tsx</code>). Two details people miss: export <code>TimNhanhBacSi</code> and <code>GioiThieuBacSi</code> from <code>src/features/bac-si/index.ts</code> (pages import only through the feature's door, Chapter 7), and remove the introduction paragraph from <code>ChiTietBacSi</code> so it is not shown twice. The URL-controlled tabs test:</p>
${pre('tsx', SN.tabsPageTest)}
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> prove the hook is really headless by giving it a second, different face.</p><ol>
<li>Create <code>ChonChuyenKhoaNhanh.tsx</code>: an input labelled "Chuyên khoa" whose suggestions are the four specialties (<code>TEN_CHUYEN_KHOA</code>), filtered with <code>boDau</code>. Render them as chips (<code>&lt;li&gt;</code> with a different class) instead of a list.</li>
<li>On choose, call an <code>onChon(ck)</code> prop. Do not change a single line of <code>useCombobox.ts</code>.</li>
<li>Test: type "nhi", press <code>↓</code> then <code>Enter</code>; expect <code>onChon</code> called with <code>'nhi'</code> and <code>aria-expanded="false"</code> afterwards.</li>
</ol><p><strong>Done when:</strong> your test passes, <code>git diff src/shared/hooks/useCombobox.ts</code> is empty, and axe (as in Chapter 8's <code>a11y.test.tsx</code>) reports no violation for your component.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">compound component</span><span class="v">a set of components used together that share implicit state (like select/option)</span></div>
<div class="kv"><span class="k">controlled / uncontrolled</span><span class="v">the parent owns the value / the component keeps its own, starting from a default</span></div>
<div class="kv"><span class="k">headless</span><span class="v">behaviour and accessibility without markup or styles</span></div>
<div class="kv"><span class="k">prop getter</span><span class="v">a function that returns props to spread on your element, merging your handlers</span></div>
<div class="kv"><span class="k">roving tabindex</span><span class="v">only the active item has <code>tabIndex=0</code>; arrows move between items</span></div>
<div class="kv"><span class="k"><code>aria-activedescendant</code></span><span class="v">tells assistive tech which option is active while focus stays in the input</span></div>
<div class="kv"><span class="k">polymorphic component</span><span class="v">a component that renders the element given in its <code>as</code> prop, with matching types</span></div>
<div class="kv"><span class="k">type test</span><span class="v">a file checked by <code>tsc</code> where <code>@ts-expect-error</code> lines must fail</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A prop per wish turns a shared component into a private language; compound components hand the structure back to the user.</li>
<li>Compound = parent state + context + pieces that throw outside their parent; support controlled and uncontrolled modes.</li>
<li><code>cloneElement</code> only reaches direct children: wrap one in a span and it fails silently (measured).</li>
<li>Tabs follow the APG: roving tabindex, arrows, Home/End, ids from <code>useId</code>; the doctor page keeps the tab on <code>?tab=</code>, read by a small child component.</li>
<li>Headless hooks return prop getters: behaviour and ARIA from the hook, markup and CSS from you.</li>
<li><code>as</code> + <code>ComponentPropsWithRef&lt;C&gt;</code> gives a polymorphic button whose type catches four real mistakes; <code>any</code> catches none.</li>
</ul>

${LINK('https://react.dev/learn/passing-data-deeply-with-context', '📘', 'react.dev — Passing Data Deeply with Context', 'The mechanism compound components are built on.')}
${LINK('https://react.dev/reference/react/cloneElement', '📕', 'react.dev — cloneElement (Legacy)', 'Why it is fragile and what to use instead.')}
${LINK('https://www.w3.org/WAI/ARIA/apg/patterns/tabs/', '♿', 'WAI-ARIA APG — Tabs pattern', 'Keyboard and roles for tabs.')}
${LINK('https://www.w3.org/WAI/ARIA/apg/patterns/combobox/', '♿', 'WAI-ARIA APG — Combobox pattern', 'aria-activedescendant, listbox, keys.')}
${LINK_TRONG('/courses/typescript', '🔷', 'Course — TypeScript', 'Generics, Omit and keyof behind the polymorphic type.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1</span>
<h2>Compound component, hook headless và prop <code>as</code> đa hình</h2>
<p class="lead">Tới giờ mọi component trong app phòng khám được viết cho đúng một chỗ. Với một trang thì ổn; với những mảnh cả đội dùng lại hàng chục lần — tab, dropdown, nút, ô tìm — thì không. Cách ngây thơ để làm component "dùng lại được" là thêm một prop cho mỗi mong muốn mới, tới khi nó có mười lăm prop và không ai dám đụng vào. Bài này dạy ba mẫu mà các thư viện component chuyên nghiệp (Radix, React Aria, Headless UI, MUI Base) dựng lên từ đó, và áp từng mẫu vào app thật: <code>Tabs</code> <strong>compound</strong> cho trang bác sĩ, một hook <strong>headless</strong> cho ô tìm nhanh, và một <code>Nut</code> <strong>đa hình</strong> (polymorphic) mà bộ prop hợp lệ đổi theo thẻ nó vẽ ra.</p>
<p>Điểm xuất phát: app phòng khám sau Chương 10 — 30 file test, <strong>145 test</strong> xanh, React Compiler bật, TanStack Query trên MSW, React Router có route lazy. Mọi thứ trong chương được dựng và đo ngày 26/09/2026 với React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2, @testing-library/react 16.3.3, React Router 8.4.0 và Chromium 149. Hết chương, cùng app đó có <strong>181 test</strong> trong 44 file.</p>

<div class="callout"><p><strong>Chương này đi thế nào.</strong></p>
<ul>
<li><strong>13.1 (bài này)</strong> — component dùng lại: compound, headless, <code>as</code> đa hình.</li>
<li><strong>13.2</strong> — custom hook tốt (và hook không tốt, có số đo), và styling: CSS Modules so với Tailwind, đo trên chính app này.</li>
<li><strong>13.3</strong> — danh sách 5.000 bác sĩ: đo, virtualize bằng <code>@tanstack/react-virtual</code>, đo lại, và một va chạm thật giữa virtualizer với React Compiler.</li>
<li><strong>13.4</strong> — XSS và <code>dangerouslySetInnerHTML</code> từ góc người phòng thủ, rồi quốc tế hoá cơ bản với <code>Intl</code>.</li>
</ul>
<p>Bài nào cũng kết thúc bằng một bước "🛠 Tự gõ tiếp dự án" và lời giải gập lại. Đây là mẫu, không phải luật: phần nào cũng nói khi nào <em>không</em> nên dùng.</p></div>

<h3>Vấn đề: mỗi mong muốn một prop</h3>
${slide('rx-13', 3, 'Prop cấu hình phình ra; compound chia thành mảnh ghép')}
<p>Trang chi tiết bác sĩ cần hai tab: "Giờ khám" và "Giới thiệu". Bản đầu tiên ai cũng viết trông thế này (phác thảo API, không phải file trong dự án): một component, nội dung truyền vào dưới dạng dữ liệu.</p>
${pre('tsx', IN.cauHinhVi)}
<p>Rồi yêu cầu kéo tới. "Gắn nhãn 'Mới' nhỏ lên tab thứ hai." Thêm trường <code>badge</code>. "Thêm một link bên phải thanh tab." Thêm prop <code>phaiDanhSach</code>. "Bọc một tab trong tooltip." Thêm render prop <code>bocTab</code>. "Khoá một tab với khách chưa đăng nhập." Thêm trường <code>tat</code>. Mỗi mong muốn đều nhỏ; gộp lại chúng biến component thành một ngôn ngữ riêng chỉ tác giả hiểu, và mong muốn nào cũng đòi sửa bên trong component dùng chung — nghĩa là chờ người giữ nó duyệt, và rủi ro cho mọi trang khác đang dùng.</p>
<p>Cách khác là trả lại <em>cấu trúc</em> cho người dùng component. HTML vốn làm vậy: <code>&lt;select&gt;</code> không nhận mảng <code>options</code>, nó nhận con <code>&lt;option&gt;</code>; <code>&lt;table&gt;</code> được lắp từ <code>&lt;thead&gt;</code>, <code>&lt;tr&gt;</code>, <code>&lt;td&gt;</code>. Các mảnh phối hợp ngầm — select biết option nào đang chọn mà bạn không phải nối dây gì. <strong>Compound component</strong> (component phức hợp) là phiên bản React của ý đó: một bộ component dùng chung state một cách ngầm định, và bạn tự sắp xếp chúng.</p>

<h3>Compound component: <code>Tabs</code> lắp từ bốn mảnh</h3>
${slide('rx-13', 4, 'Tabs compound: một context giữ tab đang chọn, bốn mảnh đọc nó')}
<p>Hình dáng ta muốn ở trang bác sĩ:</p>
${pre('tsx', IN.hinhDang)}
<p>Bốn mảnh, một bí mật chung: tab nào đang được chọn. <code>Tabs</code> cha giữ state đó và phát nó qua <strong>context</strong> (Chương 5); mảnh nào cũng đọc được, nằm sâu bao nhiêu cũng vậy. Đây là sơ đồ, rồi cả file đúng như đang chạy trong dự án:</p>
${SD.compoundVi}
${pre('tsx', SN.tabs)}
<p>Đọc từ trên xuống; dòng nào cũng có lý do.</p>
<ul>
<li><strong><code>createContext&lt;NguCanhTabs | null&gt;(null)</code></strong> — mặc định là <code>null</code> có chủ đích, để phát hiện mảnh bị dùng ngoài <code>&lt;Tabs&gt;</code>. <code>useNguCanhTabs</code> ném lỗi nói rõ phải làm gì. Không có nó, lỗi hiện ra dạng "Cannot read properties of null" ở đâu đó sâu bên trong.</li>
<li><strong><code>use(NguCanh)</code></strong> — React 19 cho đọc context bằng <code>use</code> (Chương 12); <code>useContext</code> chạy y hệt ở đây.</li>
<li><strong><code>&lt;NguCanh value={…}&gt;</code></strong> — ở React 19 chính object context là provider; <code>NguCanh.Provider</code> vẫn chạy nhưng không cần nữa.</li>
<li><strong><code>useId()</code></strong> — id duy nhất, ổn định cho mỗi bộ <code>Tabs</code>. Thuộc tính ARIA nối tab với panel bằng id (<code>aria-controls</code>, <code>aria-labelledby</code>); hai bộ tab trên một trang không được trùng id.</li>
<li><strong>Union <code>TabsProps</code></strong> — hoặc <code>macDinh</code> (không điều khiển), hoặc <code>giaTri</code> + <code>onDoi</code> (điều khiển), không bao giờ cả hai. <code>giaTri?: never</code> làm TypeScript từ chối kiểu trộn.</li>
<li><strong><code>Tabs.List = List</code></strong> — hàm trong JavaScript cũng là object, nên treo được các mảnh lên cha. Một import có đủ bộ, và tên đọc lên giống HTML nó sinh ra.</li>
<li><strong><code>Panel</code> trả <code>null</code> khi ẩn</strong> — nội dung tab ẩn không được gắn, nên không tải, không vẽ gì cho tới khi mở. <code>giuLai</code> giữ nó gắn nhưng <code>hidden</code> khi bạn cần giữ state bên trong (một form đang gõ dở).</li>
</ul>
<div class="callout"><p><strong>JS nhắc nhanh — <code>??</code> và rest props.</strong> <code>giaTri ?? tuGiu</code> nghĩa là "dùng <code>giaTri</code>, trừ khi nó là <code>null</code> hoặc <code>undefined</code> thì dùng <code>tuGiu</code>". <code>function List({ children, ...props })</code> lấy <code>children</code> ra và gom mọi prop còn lại vào <code>props</code>; <code>{...props}</code> rải chúng lên <code>div</code>, nên <code>aria-label</code> mà trang truyền vào nằm đúng trên thẻ thật.</p></div>
<p><strong>Điều khiển và không điều khiển</strong> (controlled / uncontrolled) là đúng ý bạn đã gặp ở <code>&lt;input value&gt;</code> so với <code>&lt;input defaultValue&gt;</code> trong Chương 3. Không điều khiển: component tự giữ state; cha chỉ cho giá trị khởi đầu. Điều khiển: cha giữ giá trị, component chỉ xin đổi qua <code>onDoi</code>. Component dùng lại tốt hỗ trợ cả hai; trang bác sĩ dùng chế độ điều khiển, như bạn sẽ thấy dưới đây.</p>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Mở <code>/bac-si/bs-1</code>. React vẽ <code>TrangChiTietBacSi</code> → <code>Tabs</code> tạo state (<code>'gio-kham'</code>) và giá trị context.</li>
<li><code>Tabs.List</code> vẽ một <code>div role="tablist"</code>. Mỗi <code>Tabs.Tab</code> đọc context: tab đầu được chọn → <code>aria-selected="true"</code>, <code>tabIndex={0}</code>; tab thứ hai nhận <code>tabIndex={-1}</code>.</li>
<li><code>Tabs.Panel giaTri="gio-kham"</code> khớp → vẽ <code>role="tabpanel"</code> chứa bộ chọn giờ. Panel "Giới thiệu" trả <code>null</code>: không mẩu nào của nó có trong DOM.</li>
<li>Bấm <code>Tab</code>: focus vào đúng "Giờ khám" (tab kia là <code>-1</code>). Bấm <code>→</code>: <code>onKeyDown</code> của dải tab tìm các tab, focus tab kế và gọi <code>chon('gioi-thieu')</code>.</li>
<li>State đổi → mọi mảnh vẽ lại với giá trị context mới → hai panel đổi chỗ. Bấm <code>Tab</code> tiếp: focus vào panel (nó có <code>tabIndex={0}</code>), không đi qua tab còn lại.</li>
</ol>

<h3>Vì sao không dùng <code>Children.map</code> + <code>cloneElement</code></h3>
${slide('rx-13', 5, 'cloneElement chỉ thấy con trực tiếp; context thấy mọi độ sâu')}
<p>Thư viện cũ và nhiều bài blog làm compound kiểu khác: cha duyệt các con rồi "bơm" prop vào bằng <code>cloneElement</code>. Trông gọn hơn — không có context — nên đáng xem nó gãy ở đâu. Bản dưới đây nằm ở <code>src/vi-du/ch13/TabsClone.tsx</code>:</p>
${pre('tsx', SN.tabsClone)}
<p>Nó chạy khi mọi <code>TabCu</code> là con <em>trực tiếp</em>. Giờ làm một việc hết sức bình thường — bọc một tab trong <code>&lt;span title&gt;</code> để có tooltip:</p>
${pre('tsx', SN.tabsCloneTest)}
${out(OUT.clone)}
<p>Vòng lặp của cha thấy một <code>span</code>, không phải <code>TabCu</code>, nên tab không bao giờ nhận <code>dangChon</code> hay <code>onChon</code>. Bấm B không có gì xảy ra, không lỗi, không cảnh báo. Bản dùng context có một test cho đúng ca này (<code>Tabs.Tab</code> nằm trong <code>span</code>) và nó xanh: context không quan tâm mảnh nằm sâu bao nhiêu. react.dev xếp <code>cloneElement</code> và <code>Children</code> vào "Legacy React APIs" và khuyên dùng context hoặc render prop thay thế.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — compound component hỏng im lặng.</strong> Compound dựng bằng <code>cloneElement</code> hỏng không một lời ngay khi một mảnh bị bọc (tooltip, cờ tính năng, một component bọc nhỏ). Nhận lại mã kiểu này thì test với một con bị bọc trước khi tin nó; tự viết thì dùng context và cho mảnh ném lỗi khi đứng ngoài cha.</div>

<h3>Bàn phím và ARIA: tab phải cư xử như tab</h3>
${slide('rx-13', 6, 'Tab đúng chuẩn: một điểm dừng Tab, mũi tên đổi tab, panel nhận focus')}
<p>Một hàng nút đổi nội dung chưa phải "tab" với người dùng bàn phím hay trình đọc màn hình. Tài liệu WAI-ARIA Authoring Practices Guide (APG) mô tả hành vi mong đợi, và <code>Tabs</code> theo đúng nó:</p>
<table>
<thead><tr><th>Phím / thuộc tính</th><th>Hành vi</th><th>Ở đâu trong mã</th></tr></thead>
<tbody>
<tr><td><code>Tab</code></td><td>vào dải tab ở đúng tab <em>đang chọn</em>, rồi ra panel</td><td><code>tabIndex={duocChon ? 0 : -1}</code> ("roving tabindex")</td></tr>
<tr><td><code>→</code> / <code>←</code></td><td>tab kế / trước, vòng lại, và được chọn luôn</td><td><code>onKeyDown</code> của <code>List</code></td></tr>
<tr><td><code>Home</code> / <code>End</code></td><td>tab đầu / cuối</td><td>cùng bảng phím</td></tr>
<tr><td><code>role</code></td><td><code>tablist</code> › <code>tab</code>, <code>tabpanel</code> — đọc lên "tab, 2 trên 2, đã chọn"</td><td>từng mảnh</td></tr>
<tr><td><code>aria-controls</code> / <code>aria-labelledby</code></td><td>nối tab ↔ panel; tên của panel là chữ trên tab</td><td>id từ <code>useId</code></td></tr>
</tbody>
</table>
<p>APG cho phép "kích hoạt tự động" (mũi tên cũng chọn luôn) khi panel hiện tức thì, và "kích hoạt thủ công" (mũi tên chỉ dời focus, Enter/Space mới chọn) khi hiện panel chậm. Panel của ta nhanh, nên mũi tên chọn luôn. Test bàn phím lái đúng như người dùng:</p>
${pre('tsx', SN.tabsTestPhim)}
<p>Để ý câu truy vấn: <code>getByRole('tab', { name: 'Đánh giá', selected: true })</code> — Testing Library hiểu <code>aria-selected</code>, nên test nói về hành vi, không nói về cách cài đặt.</p>

<h3>Điều khiển bằng URL: trang bác sĩ</h3>
<p>Ở trang thật, tab đang chọn phải sống qua F5 và qua link gửi cho người khác — <code>/bac-si/bs-1?tab=gioi-thieu</code> — nghĩa là nó sống trên URL (Chương 5 và 7: state mà link cần mang theo thì thuộc về URL). Đó là chế độ điều khiển: URL là nguồn sự thật, <code>Tabs</code> chỉ báo thay đổi.</p>
${pre('tsx', SN.tabsTheoUrl)}
${pre('tsx', SN.trangTabs)}
<p>Ba chi tiết. Giá trị đọc từ URL được so với một danh sách (<code>TAB.find</code>) — người dùng gõ gì vào URL cũng được, nên <code>?tab=la</code> lùi về mặc định thay vì không hiện panel nào. Lệnh cập nhật dùng dạng <em>hàm</em> của <code>setSp</code> và chép lại tham số cũ, vì bộ chọn giờ đang giữ <code>?ngay=…</code> trên cùng URL và ta không được xoá nó. Và <code>replace: true</code>: đổi tab không nên đẻ một mục lịch sử cho mỗi cú bấm.</p>
<p>Vì sao phần đọc URL nằm trong một component con nhỏ (<code>TabsTheoUrl</code>) thay vì trong trang? Bản đầu đọc <code>useSearchParams</code> ngay trong <code>TrangChiTietBacSi</code>. Nó chạy trên Chromium — cả bản build lẫn dev server đều tải giờ khám của ngày mới sau 5–46 ms khi đổi ngày — nhưng một test khả năng tiếp cận có sẵn từ Chương 8 bắt đầu đỏ trong jsdom: bấm <code>→</code> trên bộ chọn ngày xong, query của ngày mới đứng mãi ở <code>pending</code>/<code>idle</code>, không bao giờ gọi API. Cùng test đó xanh khi tắt React Compiler, và xanh lại khi chỉ một component con nhỏ đọc URL:</p>
${out(OUT.tabsUrl)}
<p>Dời phần đọc URL xuống dưới vốn là thói quen tốt: trang đọc URL thì mỗi lần đổi <code>?ngay=</code> là cả trang vẽ lại; có <code>TabsTheoUrl</code> thì chỉ nó vẽ lại, còn các panel — do trang tạo và truyền xuống dưới dạng <code>children</code> — vẫn là cùng element, React bỏ qua chúng. ⚠ Nguyên nhân chính xác của lỗi chỉ-có-trong-jsdom (tương tác giữa phần memo của React Compiler, <code>act()</code> và một transition) chưa được tìm ra tận gốc; bài ghi lại cái đã đo, không đoán.</p>

<h3>Headless: hành vi không kèm giao diện</h3>
${slide('rx-13', 7, 'Headless: hook lo hành vi, component của bạn lo giao diện')}
<p>Component <strong>headless</strong> ("không đầu" — không có giao diện) là điểm xa nhất của cùng ý tưởng: thư viện cho bạn toàn bộ <em>hành vi</em> — state, xử lý bàn phím, thuộc tính ARIA — và không vẽ gì cả. Bạn viết mọi thẻ, mọi class. Các hệ thiết kế rất chuộng kiểu này, vì phần khó mà vô hình (một combobox được trình đọc màn hình đọc đúng) viết một lần, còn mỗi sản phẩm giữ vẻ ngoài riêng.</p>
${SD.headlessVi}
<p>Trang chủ có thêm ô "Tìm nhanh bác sĩ": gõ một phần tên, chọn một gợi ý bằng chuột hoặc bằng <code>↓</code> và <code>Enter</code>, sang thẳng trang của bác sĩ đó. Hành vi nằm trong <code>useCombobox</code>, một hook trả về <strong>prop getter</strong> — những hàm trả bộ prop để bạn rải lên thẻ của mình:</p>
${pre('ts', SN.useCombobox)}
<p>Những quyết định quan trọng:</p>
<ul>
<li><strong>Focus ở lại ô gõ.</strong> Mục đang sáng được thông báo qua <code>aria-activedescendant</code> (id của mục đang sáng), không phải bằng cách dời focus. Người dùng vừa gõ vừa đi mũi tên qua gợi ý được.</li>
<li><strong>Prop getter gộp handler.</strong> <code>getInputProps({ onChange })</code> gọi <code>onChange</code> <em>của bạn</em> rồi mới tới của nó. Nếu hook chỉ trả <code>{ onChange }</code> và bạn cũng viết <code>onChange</code> sau dấu rải, cái sau đè cái trước trong im lặng — lỗi hay gặp nhất với "túi prop".</li>
<li><strong><code>onMouseDown: e.preventDefault()</code> trên mục gợi ý</strong> — thiếu nó, nhấn chuột làm ô gõ mất focus trước, <code>onBlur</code> đóng hộp, và cú click rơi vào khoảng không.</li>
<li><strong>Không state nào tính được.</strong> <code>dangMo</code> và <code>sangHopLe</code> tính từ state và props mỗi lần render; danh sách ngắn lại thì chỉ số vượt tầm tự thành <code>-1</code>.</li>
</ul>
<p>Còn vẻ ngoài thì app tự lo:</p>
${pre('tsx', SN.timNhanh)}
${pre('tsx', SN.timNhanhTest)}
${out(OUT.b1Test)}
<p>Cùng hook đó có thể lái một ô chọn thuốc hay ô chọn chuyên khoa với vẻ ngoài khác hẳn — đó là ý nghĩa của headless. Thực tế bạn hiếm khi tự viết hook này; bạn chọn một thư viện và học API của nó. Phiên bản kiểm trên npm ngày 26/09/2026:</p>
<table>
<thead><tr><th>Thư viện</th><th>Phiên bản</th><th>Kiểu</th><th>Hợp với</th></tr></thead>
<tbody>
<tr><td>Radix UI (<code>@radix-ui/react-tabs</code>…)</td><td>1.1.21</td><td>compound, không style; <code>asChild</code></td><td>nền bên dưới shadcn/ui</td></tr>
<tr><td>React Aria Components</td><td>1.21.1</td><td>compound + hook, của Adobe</td><td>khả năng tiếp cận và i18n kỹ nhất</td></tr>
<tr><td>Headless UI</td><td>2.2.10</td><td>compound, của đội Tailwind</td><td>dự án dùng Tailwind</td></tr>
<tr><td>Base UI (<code>@base-ui/react</code>)</td><td>1.8.0</td><td>compound, không style</td><td>đội đi lên từ MUI</td></tr>
<tr><td>Downshift</td><td>9.4.0</td><td>hook có prop getter</td><td>combobox, select tự làm</td></tr>
</tbody>
</table>

<h3>Prop <code>as</code> đa hình: một nút, nhiều thẻ</h3>
${slide('rx-13', 8, 'Polymorphic as: TypeScript đổi bộ prop hợp lệ theo thẻ được vẽ')}
<p>App có những "nút" thật ra là ba thẻ khác nhau. "Đăng xuất" chạy một hàm — <code>&lt;button&gt;</code>. "Xem đội ngũ bác sĩ →" sang trang khác — <code>&lt;Link&gt;</code> của React Router, tức một <code>&lt;a&gt;</code>. Nút "Gọi 1900 1234" sau này sẽ là <code>&lt;a href="tel:…"&gt;</code>. Chúng phải <em>trông</em> giống nhau nhưng phải giữ đúng thẻ: link mà lén là button thì không mở tab mới được; button mà lén là <code>div</code> thì bàn phím không thấy. Component <strong>đa hình</strong> (polymorphic) nhận prop <code>as</code> và vẽ ra thẻ bạn yêu cầu:</p>
${SD.asVi}
${pre('tsx', SN.nut)}
<p>Kiểu mới là phần làm việc thật. <code>ComponentPropsWithRef&lt;C&gt;</code> là "mọi prop mà thẻ hay component <code>C</code> nhận, kể cả <code>ref</code>". Với <code>C = 'button'</code> đó là <code>onClick</code>, <code>disabled</code>, <code>type</code>…; với <code>C = typeof Link</code> là <code>to</code>, <code>replace</code>, <code>state</code>…. <code>Omit&lt;…, keyof PropRieng&lt;C&gt;&gt;</code> bỏ các tên ta tự định nghĩa để khỏi đụng nhau. TypeScript tự suy <code>C</code> từ <code>as</code> bạn truyền, nên bộ prop hợp lệ đổi ngay khi bạn gõ. Ở React 19 <code>ref</code> là prop thường, không cần <code>forwardRef</code>.</p>
<p>So với bản hay gặp trong nhiều dự án, nơi mọi prop là <code>any</code>:</p>
${pre('tsx', SN.nutNgayTho)}
<p>Cả hai cách dùng đều biên dịch được — kể cả <code>hreff</code> (gõ sai) và một <code>to</code> trên nút vẽ ra <code>&lt;button to="/bac-si"&gt;</code> bấm không đi đâu. Kiểu đúng bắt được bốn lỗi thật. Ta giữ chúng làm <strong>test kiểu</strong>: <code>Nut.kieu.tsx</code> được <code>tsc -b</code> kiểm mỗi lần build, dòng nào đánh dấu <code>@ts-expect-error</code> thì PHẢI lỗi; ai đó nới kiểu ra là chính dòng chú thích thành lỗi.</p>
${pre('tsx', SN.nutKieu)}
${out(OUT.tscNut)}
<p>Dùng ở đâu? Trang chủ (<code>&lt;Nut as={Link} to={duongDan.bacSi} bienThe="chinh"&gt;</code>), link quay lại ở trang bác sĩ, và nút "Đăng xuất" trên header. Thư viện dựng trên Radix viết cùng ý đó theo cách khác, <code>asChild</code>: <code>&lt;Button asChild&gt;&lt;Link to="/"&gt;…&lt;/Link&gt;&lt;/Button&gt;</code> — nút gộp prop của nó vào đứa con duy nhất (Radix Slot, 1.3.3). Cùng mục đích, không phải viết kiểu generic.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — cái nút gửi luôn cả form.</strong> <code>&lt;button&gt;</code> không có <code>type</code> là <code>type="submit"</code>. Đặt một nút "Xem thêm" trong form đặt lịch là mỗi cú bấm gửi form đi. <code>Nut</code> tự đặt <code>type="button"</code> mỗi khi vẽ button thật; nút gửi form phải ghi rõ <code>type="submit"</code>.</div>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202 bạn dùng React-Bootstrap: <code>&lt;Tabs defaultActiveKey="home"&gt;&lt;Tab eventKey="home" title="Home"&gt;</code> (cấu hình qua prop), và bạn đã gặp <code>as</code> rồi — <code>&lt;Nav.Link as={Link} to="/"&gt;</code>, <code>&lt;Button as="a"&gt;</code> — cùng những cái tên compound như <code>Card.Body</code>, <code>Dropdown.Toggle</code>, thường không biết chúng là mẫu thiết kế. → Đi làm, cùng các mẫu đó được dùng có chủ đích: đội tự dựng hoặc chọn component compound/headless không style (Radix, React Aria, Headless UI, shadcn/ui) rồi phủ style riêng lên, prop <code>as</code>/<code>asChild</code> có kiểu TypeScript đầy đủ. · <em>Vì sao:</em> React-Bootstrap không sai — nó là bộ đồ nghề đầy đủ, có sẵn style, rất hợp bài tập và vẫn gặp trong app cũ ở công ty. Công ty có thiết kế riêng cần hành vi mà không cần vẻ ngoài Bootstrap, và cần kiểu bắt được <code>to</code> trên button trước cả khi người review thấy.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Compound component là gì, các mảnh chia sẻ state thế nào?"</p>
<p>Một bộ component dùng cùng nhau, chia sẻ state ngầm — như <code>&lt;select&gt;</code>/<code>&lt;option&gt;</code>. Cha giữ state và phát qua context; mỗi mảnh đọc context, nên mảnh lồng sâu bao nhiêu, xếp thế nào cũng được. Nhắc cách cũ <code>cloneElement</code> và vì sao nó gãy khi có lớp bọc, và mảnh đứng ngoài cha nên ném lỗi rõ ràng. Điểm cộng: hỗ trợ cả chế độ điều khiển và không điều khiển, như input.</p></div>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "'Headless' trong thư viện UI nghĩa là gì, vì sao công ty chọn nó?"</p>
<p>Thư viện lo hành vi và khả năng tiếp cận — state, bàn phím, ARIA — nhưng không có HTML hay style; bạn tự vẽ mọi thứ, thường qua prop getter hoặc các mảnh compound. Công ty chọn nó để giữ hệ thiết kế riêng mà không phải tự cài lại những hành vi tiếp cận khó. Đánh đổi: tự viết phần vẻ ngoài, và phải học API của thư viện. Ví dụ: Radix, React Aria, Headless UI, Downshift, TanStack Table/Virtual.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 1/4: những mảnh dùng lại</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau Chương 10 (<code>src/pages/TrangChiTietBacSi.tsx</code>, <code>src/pages/TrangChu.tsx</code>, <code>src/app/Header.tsx</code>; 145 test).</p><ol>
<li>Tạo <code>src/shared/ui/Tabs.tsx</code> (+ <code>Tabs.module.css</code>, giải thích ở 13.2) có <code>Tabs</code>, <code>Tabs.List</code>, <code>Tabs.Tab</code>, <code>Tabs.Panel</code>, điều khiển và không điều khiển. Viết <code>Tabs.test.tsx</code>: vai ARIA, bàn phím, chế độ điều khiển, mảnh đứng ngoài <code>Tabs</code> thì ném lỗi, tab bị bọc vẫn chạy.</li>
<li>Ở <code>/bac-si/:id</code>: dời bộ chọn giờ và link "Xem lịch trống cả tuần" vào panel "Giờ khám", phần giới thiệu bác sĩ vào panel "Giới thiệu" (một <code>GioiThieuBacSi</code> mới đọc cùng promise với <code>HoSoBacSi</code>). Tab sống trên <code>?tab=</code>, do một <code>TabsTheoUrl</code> nhỏ đọc.</li>
<li>Viết <code>src/shared/hooks/useCombobox.ts</code> và <code>TimNhanhBacSi</code> ở trang chủ (tối đa 6 gợi ý, Enter thì chuyển trang).</li>
<li>Viết <code>src/shared/ui/Nut.tsx</code> có <code>as</code> đúng kiểu và file test kiểu <code>Nut.kieu.tsx</code>; dùng cho link ở trang chủ, link quay lại và nút "Đăng xuất".</li>
</ol>
<p><strong>Đạt khi:</strong> <code>npx tsc -b</code> sạch (mọi <code>@ts-expect-error</code> đều lỗi thật); ba file test mới xanh — 10 test; 145 test cũ vẫn xanh, kể cả test tiếp cận Chương 8 bấm <code>→</code> trên bộ chọn ngày.</p></div>
<details><summary>Lời giải</summary>
<p>Mọi file đã in ở trên đúng như dự án mẫu (<code>Tabs.tsx</code>, <code>useCombobox.ts</code>, <code>TimNhanhBacSi.tsx</code>, <code>Nut.tsx</code>, <code>Nut.kieu.tsx</code>, <code>TabsTheoUrl</code> trong <code>TrangChiTietBacSi.tsx</code>). Hai chi tiết hay sót: export <code>TimNhanhBacSi</code> và <code>GioiThieuBacSi</code> từ <code>src/features/bac-si/index.ts</code> (trang chỉ import qua cửa của tính năng, Chương 7), và bỏ đoạn giới thiệu khỏi <code>ChiTietBacSi</code> để khỏi hiện hai lần. Test tab điều khiển bằng URL:</p>
${pre('tsx', SN.tabsPageTest)}
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề:</strong> chứng minh hook thật sự headless bằng cách cho nó khuôn mặt thứ hai, khác hẳn.</p><ol>
<li>Tạo <code>ChonChuyenKhoaNhanh.tsx</code>: một ô gõ nhãn "Chuyên khoa", gợi ý là bốn chuyên khoa (<code>TEN_CHUYEN_KHOA</code>), lọc bằng <code>boDau</code>. Vẽ chúng thành chip (<code>&lt;li&gt;</code> với class khác) thay vì danh sách.</li>
<li>Khi chọn, gọi prop <code>onChon(ck)</code>. Không sửa một dòng nào của <code>useCombobox.ts</code>.</li>
<li>Test: gõ "nhi", bấm <code>↓</code> rồi <code>Enter</code>; mong <code>onChon</code> được gọi với <code>'nhi'</code> và sau đó <code>aria-expanded="false"</code>.</li>
</ol><p><strong>Đạt khi:</strong> test của bạn xanh, <code>git diff src/shared/hooks/useCombobox.ts</code> rỗng, và axe (như <code>a11y.test.tsx</code> của Chương 8) không báo lỗi nào cho component của bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">compound component</span><span class="v">bộ component dùng cùng nhau, chia sẻ state ngầm (như select/option)</span></div>
<div class="kv"><span class="k">controlled / uncontrolled</span><span class="v">cha giữ giá trị / component tự giữ, bắt đầu từ giá trị mặc định</span></div>
<div class="kv"><span class="k">headless</span><span class="v">hành vi và khả năng tiếp cận, không kèm HTML hay style</span></div>
<div class="kv"><span class="k">prop getter</span><span class="v">hàm trả bộ prop để rải lên thẻ của bạn, có gộp handler của bạn</span></div>
<div class="kv"><span class="k">roving tabindex</span><span class="v">chỉ mục đang hoạt động có <code>tabIndex=0</code>; mũi tên đi giữa các mục</span></div>
<div class="kv"><span class="k"><code>aria-activedescendant</code></span><span class="v">báo cho công nghệ hỗ trợ mục nào đang sáng trong khi focus ở lại ô gõ</span></div>
<div class="kv"><span class="k">polymorphic component</span><span class="v">component đa hình: vẽ ra thẻ ghi trong prop <code>as</code>, kiểu đi theo</span></div>
<div class="kv"><span class="k">test kiểu (type test)</span><span class="v">file được <code>tsc</code> kiểm, dòng <code>@ts-expect-error</code> bắt buộc phải lỗi</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi mong muốn một prop biến component dùng chung thành ngôn ngữ riêng; compound trả cấu trúc lại cho người dùng.</li>
<li>Compound = state ở cha + context + các mảnh ném lỗi khi đứng ngoài cha; hỗ trợ cả điều khiển lẫn không điều khiển.</li>
<li><code>cloneElement</code> chỉ tới được con trực tiếp: bọc một con trong span là hỏng im lặng (đo thật).</li>
<li>Tabs theo APG: roving tabindex, mũi tên, Home/End, id từ <code>useId</code>; trang bác sĩ giữ tab trên <code>?tab=</code>, do một component con nhỏ đọc.</li>
<li>Hook headless trả prop getter: hành vi và ARIA từ hook, HTML và CSS từ bạn.</li>
<li><code>as</code> + <code>ComponentPropsWithRef&lt;C&gt;</code> cho một nút đa hình mà kiểu bắt được bốn lỗi thật; <code>any</code> không bắt được lỗi nào.</li>
</ul>

${LINK('https://react.dev/learn/passing-data-deeply-with-context', '📘', 'react.dev — Passing Data Deeply with Context', 'Cơ chế mà compound component dựng lên.')}
${LINK('https://react.dev/reference/react/cloneElement', '📕', 'react.dev — cloneElement (Legacy)', 'Vì sao nó mong manh và nên dùng gì thay.')}
${LINK('https://www.w3.org/WAI/ARIA/apg/patterns/tabs/', '♿', 'WAI-ARIA APG — Tabs pattern', 'Bàn phím và vai trò cho tab.')}
${LINK('https://www.w3.org/WAI/ARIA/apg/patterns/combobox/', '♿', 'WAI-ARIA APG — Combobox pattern', 'aria-activedescendant, listbox, phím.')}
${LINK_TRONG('/courses/typescript', '🔷', 'Khoá — TypeScript', 'Generic, Omit và keyof đứng sau kiểu đa hình.')}
</div>
`,
};

const L2 = {
    title: '13.2 — Good custom hooks, and styling: CSS Modules vs Tailwind|||13.2 — Custom hook tốt, và styling: CSS Modules hay Tailwind',
    slug: 'rx-13-2-hook-styling',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Một custom hook tốt trông thế nào (và hook xấu tốn bao nhiêu lần render — đo thật), React Compiler giữ danh tính giá trị trả về ra sao; rồi hai tên lớp CSS toàn cục đụng nhau trong chính app, sửa bằng CSS Modules, và so với Tailwind v4 bằng số đo bundle.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2</span>
<h2>Good custom hooks, and styling: CSS Modules vs Tailwind</h2>
<p class="lead">Two kinds of code grow quietly in every React project until they hurt: custom hooks that "do everything", and global CSS where every new page adds a few more class names. Both feel fine for weeks. This lesson measures what a badly shaped hook costs (renders you can count, a wrong result you can see), shows the shape of a good one on the doctor list, and then finds a real CSS collision that has been in this project since Chapter 10 — two files defining <code>.hang-nut</code> — fixes it with CSS Modules, and compares with Tailwind on the same card, with bundle sizes.</p>
<p>Starting point: the project after 13.1. Versions: React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2, React Compiler 1.0 (babel-plugin-react-compiler 1.0.0), Tailwind CSS 4.3.3 (only in a throw-away copy), Chromium 149.</p>

<h3>What a custom hook is — and is not</h3>
<p>A <strong>custom hook</strong> is a plain JavaScript function whose name starts with <code>use</code> and which calls other hooks. That is the whole definition. Three consequences surprise people:</p>
<ul>
<li><strong>Each call has its own state.</strong> Two components calling <code>useBacSiDaLoc()</code> do not share anything except what the hooks inside share on purpose (here, the TanStack Query cache). A hook shares <em>logic</em>, not <em>state</em>. To share state you still need context, a store or the URL (Chapter 5).</li>
<li><strong>The name is a promise, not decoration.</strong> The <code>use</code> prefix tells the linter and React Compiler "the rules of hooks apply here". A function that calls no hook — <code>locBacSi</code>, <code>dich</code> — should <em>not</em> be named <code>use…</code>: it can then be called anywhere, in a loop, in a condition, in a test without React.</li>
<li><strong>A hook is not a component.</strong> It renders nothing. What it returns is up to you — and that return value is its API.</li>
</ul>
${SD.hookHayHamEn}

<h3>A bad hook, measured</h3>
${slide('rx-13', 9, 'A hook that copies state with useEffect: 4 renders, one wrong result')}
<p>This hook is in thousands of real projects. It filters a list — but it stores the result in state and "synchronises" it with an effect:</p>
${pre('ts', SN.locXau)}
${pre('ts', SN.locTot)}
<p>Opinions are cheap, so the test records every value the hook returns, render by render, while the search goes from <code>""</code> to <code>"vy"</code>:</p>
${pre('tsx', SN.locXauTest)}
${out(OUT.hookXau)}
<p>Read the bad line: on the render where <code>q</code> is already <code>"vy"</code>, the hook still returns <strong>6 doctors</strong>. That render reaches the screen. Only after the browser paints does the effect run, call <code>setDaLoc</code>, and trigger yet another render with the right answer. Four renders instead of two, and one frame where the search box says "vy" while the list shows everybody. In the real app with 200 cards, that is a visible flash; in a test, it is a flaky assertion that sometimes sees the stale list.</p>
${SD.hookXauEn}
<p>The rule behind it is Chapter 4's "You might not need an effect": <strong>if a value can be computed from props and state, compute it during render</strong>. The good version is one line, and — notice — it does not even need to be a hook. <code>locBacSi</code> already is the good version.</p>
<div class="pitfall co-tieu-de"><strong>Trap — <code>useState(prop)</code> plus an effect to "keep it in sync".</strong> <code>useState(danhSach)</code> only uses <code>danhSach</code> the first time; after that the copy lives its own life. Adding <code>useEffect(() =&gt; setX(f(prop)), [prop])</code> to fix it costs an extra render and a frame of stale data every time. Delete the state and compute <code>f(prop)</code> in render; if it is expensive and measured slow, <code>useMemo</code> (or React Compiler) caches it.</div>

<h3>A good hook for the doctor list</h3>
${slide('rx-13', 10, 'A good hook: one job, named parameters, a discriminated union')}
<p><code>KhuBacSi</code> (the <code>/bac-si</code> page) mixed three concerns: loading the doctors, filtering them, and drawing each state. The first two form one job — "the filtered doctor list and whether it is ready" — which is worth a hook:</p>
${pre('ts', SN.bacSiDaLoc)}
<p>What makes this API good:</p>
<ul>
<li><strong>One job.</strong> It does not read the URL (the page passes the filter in), does not know about favourites, does not render. Each of those would tie it to one page.</li>
<li><strong>A named parameter object</strong> — <code>useBacSiDaLoc({ chuyenKhoa, tuKhoa })</code>. Compare <code>useLocXau(ds, 'tat-ca', q)</code>: swap two strings and nobody notices. With names, a third option later (say <code>sapXep</code>) does not break existing calls.</li>
<li><strong>A discriminated union as the return type.</strong> The field <code>trangThai</code> decides which other fields exist. TypeScript "narrows" the type after a check: inside <code>if (kq.trangThai === 'co-du-lieu')</code> you can read <code>kq.daLoc</code>; anywhere else, reading it is a compile error — not an <code>undefined</code> at runtime. It is impossible to show a list while loading, or to forget the error case.</li>
<li><strong>Derived data computed in render.</strong> <code>locBacSi(data, …)</code> runs every render; no effect, no copy.</li>
</ul>
<p>The component becomes a plain "state → picture" mapping:</p>
${pre('tsx', SN.khuDung)}
<p>And the hook is testable on its own, with MSW answering and no component drawn — <code>renderHook</code> from Chapter 9, <code>rerender</code> to change the filter:</p>
${pre('tsx', SN.bacSiDaLocTest)}
${out(OUT.b2Test)}
<p>A checklist you can apply to any hook in review:</p>
<table>
<thead><tr><th>Question</th><th>Good sign</th><th>Warning sign</th></tr></thead>
<tbody>
<tr><td>Does it call a hook?</td><td>yes → <code>use…</code></td><td><code>useFormatDate</code> that calls none</td></tr>
<tr><td>How many jobs?</td><td>one sentence describes it</td><td>"loads, filters, sorts, tracks the URL and shows a toast"</td></tr>
<tr><td>Parameters</td><td>one object with names</td><td>four positional booleans: <code>useX(true, false, 5, true)</code></td></tr>
<tr><td>Return</td><td>object (named) or union; tuple only for pairs like <code>[value, setValue]</code></td><td>a tuple of five things</td></tr>
<tr><td>Effects</td><td>only to sync with something <em>outside</em> React (title, socket, timer)</td><td>an effect that sets state from props</td></tr>
<tr><td>Testing</td><td><code>renderHook</code> with a small wrapper</td><td>only testable by rendering a whole page</td></tr>
</tbody>
</table>

<h3>Stable identity — and what React Compiler does for you</h3>
${slide('rx-13', 11, 'React Compiler keeps the object a hook returns when inputs do not change')}
<p>Old advice says: "a hook that returns an object or a function should wrap them in <code>useMemo</code>/<code>useCallback</code>, otherwise every render creates new ones and breaks <code>memo</code> and effect dependencies". Is that still true in this app? Measure it: a tiny hook returning <code>{ so, tang }</code>, render twice with nothing changed, compare identities — once with the project's config (React Compiler on), once with the Chapter 9 config without the compiler:</p>
${pre('tsx', SN.danhTinhTest)}
${out(OUT.danhTinh)}
<p>With the compiler, the same object and the same function come back; without it, both are new every render. So in a project with React Compiler (this one, since Chapter 12), write the hook correctly and let the compiler handle stability — do not sprinkle <code>useCallback</code> out of habit. In a library you publish, or a project without the compiler, the old rule stands: consumers may put your return value in a dependency array.</p>

<h3>Run it step by step</h3>
<ol>
<li><code>renderHook((boLoc) =&gt; useBacSiDaLoc(boLoc), { wrapper, initialProps })</code> renders an invisible test component that calls the hook inside the QueryClient + router wrapper.</li>
<li>First render: the query is pending → <code>{ trangThai: 'dang-tai' }</code>. MSW answers <code>GET /api/bac-si</code> in about 5 ms (Node).</li>
<li>TanStack Query stores the six doctors → the hook re-runs → <code>{ trangThai: 'co-du-lieu', tatCa: 6, daLoc: 6 }</code>. <code>waitFor</code> retries the assertion until it passes.</li>
<li><code>rerender({ chuyenKhoa: 'nhi', tuKhoa: 'vy' })</code>: same render, new filter, <code>locBacSi</code> runs → <code>daLoc = [bs-6]</code> in <em>that</em> render. No extra render, no stale frame.</li>
<li>The <code>if (kq.trangThai !== 'co-du-lieu') throw …</code> line is there for TypeScript: after it, the compiler knows <code>kq.daLoc</code> exists.</li>
</ol>

<h3>Styling: a real collision in this project</h3>
${slide('rx-13', 12, 'Two files use the class .hang-nut: the styles of two pages mix')}
<p>The clinic app styles everything with two global files, <code>src/index.css</code> and <code>src/app/app.css</code>. In Chapter 1 the doctor card got a row of buttons, <code>.hang-nut</code>. In Chapter 10 the reschedule page needed a row of buttons too — and got a class with the same name in the other file:</p>
${pre('css', SN.hangNutCu)}
<p>Nobody noticed, because nothing looked broken. Measured in Chromium on the production build, with the computed styles the browser actually applied:</p>
${out(OUT.cssTruoc)}
<p>Both places get <em>both</em> rules merged. The doctor card inherited <code>align-items: center</code> from a page it has nothing to do with. The reschedule page never got its 14 px gap (<code>index.css</code> is imported after <code>app.css</code> in <code>main.tsx</code>, so its <code>gap: 8px</code> wins) and gained a <code>margin-top</code> it did not ask for. This is the core problem of global CSS: <strong>a class name is global</strong>, the winner is decided by import order and specificity, and adding a rule for one page can change another page you never opened.</p>

<h3>CSS Modules: class names private to a file</h3>
${slide('rx-13', 13, 'CSS Modules: private class names per file, CSS follows the page chunk')}
<p>Vite supports <strong>CSS Modules</strong> out of the box: name a file <code>*.module.css</code>, import it as an object, and every class inside is renamed to something unique at build time. No package to install, no new syntax — ordinary CSS.</p>
${pre('css', SN.doiGioModule)}
${pre('tsx', SN.doiGioDung)}
${out(OUT.cssSau)}
<p>The reschedule page now gets exactly its 14 px, the doctor card is back to <code>align-items: normal</code>, and the class in the DOM is <code>_hangNut_1xsw0_3</code> — nobody else can ever use it by accident. The <code>Tabs</code> of 13.1 uses a module too:</p>
${pre('css', SN.tabsCss)}
<p>Two more things the build shows: the reschedule page is a lazy route, so its CSS went into its own file (<code>TrangDoiGio-BleFQ8UH.css</code>, 0.06 kB) and only loads with that page; and <code>Tabs.module.css</code> ended up in the main CSS as <code>._list_73s38_1</code>, <code>._tab_73s38_3</code>…</p>
<p>One weakness, measured: the type Vite gives a module is <code>{ readonly [key: string]: string }</code>, so a typo is not an error.</p>
${pre('tsx', SN.cssGoSai)}
${out(OUT.cssGoSai)}
<p><code>css.hangnut</code> is <code>undefined</code> at runtime → <code>className={undefined}</code> → no style, no warning. Check with your eyes (or add a plugin that generates exact <code>.d.ts</code> files for modules, if the team wants it).</p>
<div class="pitfall co-tieu-de"><strong>Trap — "just add a more specific selector".</strong> The usual quick fix for a collision is <code>.trang-doi-gio .hang-nut { gap: 14px }</code>. It works today and starts a specificity arms race: the next page needs <code>.a .b .hang-nut</code>, then <code>!important</code>. Give the element a class nobody else can have (a module, a prefix, or utilities) instead of out-shouting the other rule.</div>

<h3>Tailwind, measured on the same card</h3>
${slide('rx-13', 14, 'Tailwind or CSS Modules: measure on the same app, then choose as a team')}
<p><strong>Tailwind CSS</strong> takes the opposite route: instead of naming things and writing CSS for them, you compose small <em>utility classes</em> (lớp tiện ích) directly in JSX — <code>rounded-xl</code>, <code>px-4</code>, <code>text-cyan-700</code>. To compare fairly, a copy of the project (<code>du-an/ch13-tailwind</code>) installed Tailwind 4.3.3 and rewrote only the doctor card, keeping the same look. Version 4 needs no config file — a Vite plugin and one CSS import:</p>
${pre('ts', SN.viteTailwind)}
${pre('css', SN.cssTailwind)}
<p>Before (Chapter 1, global CSS) and after (Tailwind):</p>
${pre('css', SN.theCu)}
${pre('tsx', SN.theTailwind)}
<p>Build both and compare the CSS the user downloads:</p>
${out(OUT.buildCss)}
<p>+5.3 kB raw (+1.33 kB gzip) — mostly the theme variables (<code>--color-cyan-700</code>…) and <code>@property</code> declarations Tailwind v4 emits, and the old <code>.the-bac-si</code> rules were not deleted because the skeleton still uses them. In a project written entirely with utilities the curve flips: CSS grows with the number of <em>distinct utilities</em>, not with the number of components, so large apps often ship less CSS. There was a surprise in the output, too:</p>
${out(OUT.twLop)}
<p>Tailwind finds classes by scanning your source files as plain text. The word <code>filter</code> in <code>danhSach.filter(…)</code>, <code>static</code> in a class component, <code>.transform(…)</code> from Zod — all became CSS rules nobody asked for. Harmless here (a few bytes), but it shows how the tool works: it does not understand JSX, it matches tokens.</p>
${SD.cssEn}
<table>
<thead><tr><th></th><th>Global CSS (before)</th><th>CSS Modules</th><th>Tailwind v4.3.3</th></tr></thead>
<tbody>
<tr><td>Install</td><td>nothing</td><td>nothing (Vite built-in)</td><td><code>tailwindcss</code> + <code>@tailwindcss/vite</code></td></tr>
<tr><td>Name collisions</td><td>yes — measured</td><td>impossible</td><td>impossible (a class is a value)</td></tr>
<tr><td>Where you write</td><td>separate files</td><td><code>.module.css</code> next to the component</td><td>in <code>className</code></td></tr>
<tr><td>Design consistency</td><td>discipline</td><td>discipline (CSS variables help)</td><td>built-in scales</td></tr>
<tr><td>Dead CSS</td><td>accumulates</td><td>goes with the file</td><td>only used utilities (+ false positives)</td></tr>
<tr><td>Measured trap</td><td>order of imports decides</td><td>typos are not type errors</td><td>text scanning adds classes</td></tr>
</tbody>
</table>
<p>When to choose which: <strong>CSS Modules</strong> when the team knows CSS well, the project already has CSS, or components need complex selectors and animations; <strong>Tailwind</strong> for new projects that want a consistent spacing/colour scale quickly and a team comfortable with long class strings (shadcn/ui assumes it). Whatever you pick, do not mix three systems inside one component, and measure the bundle rather than repeating what a blog said. CSS-in-JS libraries that inject styles at runtime (styled-components, Emotion) are still in many existing apps; React Server Components made new projects move away from runtime injection toward build-time CSS.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202 you style with Bootstrap classes (<code>className="btn btn-primary mt-3"</code>) or React-Bootstrap components plus one <code>App.css</code>, and reuse logic by copying it — custom hooks, if they appear at all, are a slide near the end; older slides still show HOCs for sharing logic. → At work: CSS Modules or Tailwind (often Tailwind with shadcn/ui), styles scoped so one page cannot break another; shared logic lives in small custom hooks with typed, named APIs, tested with <code>renderHook</code>. · <em>Why:</em> Bootstrap utilities are close to Tailwind's idea and fine for coursework; the difference at work is scale — twenty developers adding CSS to one global file produce exactly the <code>.hang-nut</code> collision measured above. You will still meet Bootstrap in older company projects; follow the project's convention there.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "When do you extract a custom hook, and what makes a good one?"</p>
<p>Extract when the same stateful logic appears in two places or makes a component hard to read — not for every three lines. A good hook has one job, takes a named options object, returns a named object (or a discriminated union for async states), computes derived data during render instead of copying it into state with an effect, and can be tested with <code>renderHook</code>. Name it <code>use…</code> only if it calls hooks. Mention that hooks share logic, not state.</p></div>
<div class="callout"><p><strong>Common interview question.</strong> "CSS Modules, Tailwind or CSS-in-JS — which and why?"</p>
<p>All three solve global name collisions. CSS Modules: plain CSS, scoped by renaming at build time, zero runtime. Tailwind: utility classes, consistent design tokens, CSS size scales with distinct utilities; long class strings. Runtime CSS-in-JS (styled-components, Emotion): dynamic styles from props, but runtime cost and friction with Server Components — many new projects prefer build-time solutions. Say what your team uses and that you would measure the bundle before arguing.</p></div>

<h3>🛠 Keep building the project — step 2/4: a good hook and scoped CSS</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after 13.1 (<code>src/features/bac-si/KhuBacSi.tsx</code>, <code>src/pages/TrangDoiGio.tsx</code>, <code>src/app/app.css</code>).</p><ol>
<li>Write <code>src/features/bac-si/hooks/useBacSiDaLoc.ts</code> returning the union <code>KetQuaBacSiDaLoc</code>; rewrite <code>KhuBacSi</code> on top of it (the favourites list reads <code>kq.tatCa</code>).</li>
<li>Test it with <code>renderHook</code>: loading → data, change the filter with <code>rerender</code>, and the 500 → <code>thuLai()</code> path.</li>
<li>Move the reschedule page's button row to <code>TrangDoiGio.module.css</code> and delete the <code>.hang-nut</code> rule from <code>app.css</code>.</li>
<li>Optional, in a copy of the project: install Tailwind 4 and rewrite <code>TheBacSi</code>; compare the <code>index-*.css</code> size in <code>vite build</code>.</li>
</ol>
<p><strong>Done when:</strong> the existing <code>KhuBacSi</code> tests (Chapters 2 and 8) still pass unchanged, the 2 new hook tests pass, and in the browser the reschedule page's buttons are 14 px apart while the doctor card buttons are 8 px apart (DevTools → Computed → <code>column-gap</code>).</p></div>
<details><summary>Solution</summary>
<p><code>useBacSiDaLoc.ts</code>, the new <code>KhuBacSi</code>, the hook test, <code>TrangDoiGio.module.css</code> and the import line are printed above exactly as in the reference project. The line removed from <code>app.css</code> is replaced by a comment pointing to the module, so the next person does not add it back. The measuring script is <code>do/ch13-css.mjs</code> in the snapshot after this chapter: it builds, opens <code>/bac-si</code> and a real reschedule page (logs in with a fake user, books a slot), and prints <code>getComputedStyle</code> of both rows.</p>
${out(OUT.cssSau)}
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> find and fix a second copied-state bug.</p><ol>
<li>Write <code>useSoYeuThich()</code> the bad way: <code>useState(0)</code> + an effect that sets it to <code>yeuThich.length</code> from the Zustand store.</li>
<li>Use the render-recording test from this lesson to print every value it returns while you add two favourites with <code>act(() =&gt; useDatLichStore.getState().doiYeuThich('bs-2'))</code>.</li>
<li>Rewrite it as <code>useDatLichStore((s) =&gt; s.yeuThich.length)</code> and record again.</li>
</ol><p><strong>Done when:</strong> the bad version shows at least one render returning the old count after the store changed, the good version shows none, and both tests print their render list.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">custom hook</span><span class="v">a function named <code>use…</code> that calls other hooks; shares logic, not state</span></div>
<div class="kv"><span class="k">derived state</span><span class="v">a value computable from props/state — compute it in render, do not store it</span></div>
<div class="kv"><span class="k">discriminated union</span><span class="v">a union of object types told apart by one field (<code>trangThai</code>); TS narrows after a check</span></div>
<div class="kv"><span class="k">stable identity</span><span class="v">the same object/function across renders, so <code>memo</code> and dependencies see "no change"</span></div>
<div class="kv"><span class="k">CSS Modules</span><span class="v"><code>*.module.css</code>, classes renamed per file at build time</span></div>
<div class="kv"><span class="k">utility class</span><span class="v">a class that does one thing (<code>px-4</code>, <code>text-sm</code>), composed in markup</span></div>
<div class="kv"><span class="k">specificity</span><span class="v">how the browser decides which of two matching rules wins</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A custom hook is a <code>use…</code> function that calls hooks; each call has its own state; name a hook-free helper as a plain function.</li>
<li>Copying derived data into state with an effect costs extra renders and a frame of wrong data — measured: 4 renders, one returning 6 doctors for "vy".</li>
<li>Good hook: one job, a named options object, a named or discriminated-union return, testable with <code>renderHook</code>.</li>
<li>With React Compiler the object a hook returns keeps its identity (measured); without it, it is new every render.</li>
<li>Global class names collide: <code>.hang-nut</code> from Chapter 1 and Chapter 10 merged on both pages; CSS Modules fixed it without new tools.</li>
<li>Tailwind 4 on the same card: +5.3 kB CSS here, no collisions, consistent scales; its scanner turns words like <code>filter</code> into classes.</li>
</ul>

${LINK('https://react.dev/learn/reusing-logic-with-custom-hooks', '📘', 'react.dev — Reusing Logic with Custom Hooks', 'Rules, naming, and when to extract.')}
${LINK('https://react.dev/learn/you-might-not-need-an-effect', '📘', 'react.dev — You Might Not Need an Effect', 'Why derived data is computed in render.')}
${LINK('https://vite.dev/guide/features#css-modules', '⚡', 'Vite — CSS Modules', 'Built-in support and options.')}
${LINK('https://tailwindcss.com/docs/installation/using-vite', '🎨', 'Tailwind CSS — Using Vite', 'The v4 plugin setup used here.')}
${LINK_TRONG('/courses/tailwind-css', '🌬️', 'Learn next — Tailwind CSS course', 'Utilities, design tokens, responsive and dark mode in depth.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2</span>
<h2>Custom hook tốt, và styling: CSS Modules hay Tailwind</h2>
<p class="lead">Có hai loại mã lớn lên lặng lẽ trong mọi dự án React cho tới khi gây đau: custom hook "làm mọi thứ", và CSS toàn cục nơi mỗi trang mới lại thêm vài tên lớp. Cả hai đều có vẻ ổn suốt nhiều tuần. Bài này đo cái giá của một hook sai hình dạng (số lần render đếm được, một kết quả sai nhìn thấy được), cho thấy hình dạng của một hook tốt trên danh sách bác sĩ, rồi tìm ra một va chạm CSS thật đã nằm trong dự án từ Chương 10 — hai file cùng định nghĩa <code>.hang-nut</code> — sửa bằng CSS Modules, và so với Tailwind trên cùng một thẻ, có kích thước bundle.</p>
<p>Điểm xuất phát: dự án sau 13.1. Phiên bản: React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.2, React Compiler 1.0 (babel-plugin-react-compiler 1.0.0), Tailwind CSS 4.3.3 (chỉ trong một bản sao thử), Chromium 149.</p>

<h3>Custom hook là gì — và không là gì</h3>
<p><strong>Custom hook</strong> là một hàm JavaScript thường, tên bắt đầu bằng <code>use</code> và có gọi hook khác bên trong. Định nghĩa chỉ có vậy. Ba hệ quả hay làm người mới bất ngờ:</p>
<ul>
<li><strong>Mỗi lần gọi có state riêng.</strong> Hai component cùng gọi <code>useBacSiDaLoc()</code> không chia sẻ gì, trừ những thứ các hook bên trong cố ý chia sẻ (ở đây là cache của TanStack Query). Hook chia sẻ <em>logic</em>, không chia sẻ <em>state</em>. Muốn chia state vẫn cần context, store hay URL (Chương 5).</li>
<li><strong>Cái tên là một lời hứa, không phải trang trí.</strong> Tiền tố <code>use</code> báo cho linter và React Compiler "luật của hook áp dụng ở đây". Hàm không gọi hook nào — <code>locBacSi</code>, <code>dich</code> — thì <em>không</em> nên đặt tên <code>use…</code>: khi đó nó gọi được ở mọi nơi, trong vòng lặp, trong điều kiện, trong test không cần React.</li>
<li><strong>Hook không phải component.</strong> Nó không vẽ gì. Nó trả về gì là do bạn — và giá trị trả về đó chính là API của nó.</li>
</ul>
${SD.hookHayHamVi}

<h3>Một hook xấu, có số đo</h3>
${slide('rx-13', 9, 'Hook sao chép state bằng useEffect: 4 lần render, một lần trả kết quả sai')}
<p>Hook này có trong hàng nghìn dự án thật. Nó lọc một danh sách — nhưng cất kết quả vào state rồi "đồng bộ" bằng effect:</p>
${pre('ts', SN.locXau)}
${pre('ts', SN.locTot)}
<p>Ý kiến thì rẻ, nên test ghi lại mọi giá trị hook trả về, từng lần render một, khi ô tìm đi từ <code>""</code> tới <code>"vy"</code>:</p>
${pre('tsx', SN.locXauTest)}
${out(OUT.hookXau)}
<p>Đọc dòng tô đỏ: ở lần render mà <code>q</code> đã là <code>"vy"</code>, hook vẫn trả <strong>6 bác sĩ</strong>. Lần render đó lên màn hình. Chỉ sau khi trình duyệt vẽ xong effect mới chạy, gọi <code>setDaLoc</code>, và kéo thêm một lần render nữa với đáp án đúng. Bốn lần render thay vì hai, và một khung hình mà ô tìm ghi "vy" còn danh sách thì hiện cả sáu người. Trong app thật với 200 thẻ, đó là một cái nháy nhìn thấy được; trong test, đó là một phép kiểm lúc đỏ lúc xanh vì có khi thấy danh sách cũ.</p>
${SD.hookXauVi}
<p>Luật đứng sau là "Có thể bạn không cần effect" của Chương 4: <strong>giá trị tính được từ props và state thì tính ngay trong lúc render</strong>. Bản tốt chỉ một dòng, và — để ý — nó thậm chí không cần là hook. <code>locBacSi</code> vốn đã là bản tốt.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — <code>useState(prop)</code> kèm một effect để "giữ cho khớp".</strong> <code>useState(danhSach)</code> chỉ dùng <code>danhSach</code> ở lần đầu; sau đó bản sao sống đời riêng. Thêm <code>useEffect(() =&gt; setX(f(prop)), [prop])</code> để vá thì mỗi lần tốn một render thừa và một khung hình dữ liệu cũ. Xoá state đi, tính <code>f(prop)</code> trong render; nếu nó nặng và đo thấy chậm thì <code>useMemo</code> (hoặc React Compiler) cache lại.</div>

<h3>Một hook tốt cho danh sách bác sĩ</h3>
${slide('rx-13', 10, 'Hook tốt: một việc, tham số có tên, trả union phân biệt theo trạng thái')}
<p><code>KhuBacSi</code> (trang <code>/bac-si</code>) trộn ba việc: tải bác sĩ, lọc, và vẽ từng trạng thái. Hai việc đầu là một việc chung — "danh sách bác sĩ đã lọc và nó đã sẵn sàng chưa" — đáng thành một hook:</p>
${pre('ts', SN.bacSiDaLoc)}
<p>Điều gì làm API này tốt:</p>
<ul>
<li><strong>Một việc.</strong> Nó không đọc URL (trang truyền bộ lọc vào), không biết yêu thích, không vẽ. Mỗi thứ trong số đó sẽ trói nó vào một trang.</li>
<li><strong>Tham số là một object có tên</strong> — <code>useBacSiDaLoc({ chuyenKhoa, tuKhoa })</code>. So với <code>useLocXau(ds, 'tat-ca', q)</code>: đổi chỗ hai chuỗi là không ai thấy. Có tên thì sau này thêm tuỳ chọn thứ ba (chẳng hạn <code>sapXep</code>) không làm hỏng chỗ gọi cũ.</li>
<li><strong>Kiểu trả về là union phân biệt.</strong> Trường <code>trangThai</code> quyết định những trường nào tồn tại. TypeScript "thu hẹp" kiểu sau một phép kiểm: trong <code>if (kq.trangThai === 'co-du-lieu')</code> bạn đọc được <code>kq.daLoc</code>; ở chỗ khác mà đọc là lỗi biên dịch — không phải <code>undefined</code> lúc chạy. Không thể vẽ danh sách khi đang tải, không thể quên trường hợp lỗi.</li>
<li><strong>Dữ liệu dẫn xuất tính trong render.</strong> <code>locBacSi(data, …)</code> chạy mỗi lần render; không effect, không bản sao.</li>
</ul>
<p>Component trở thành một phép ánh xạ "trạng thái → hình" đơn giản:</p>
${pre('tsx', SN.khuDung)}
<p>Và hook test được riêng, MSW trả lời, không vẽ component nào — <code>renderHook</code> của Chương 9, <code>rerender</code> để đổi bộ lọc:</p>
${pre('tsx', SN.bacSiDaLocTest)}
${out(OUT.b2Test)}
<p>Một checklist dùng được cho bất kỳ hook nào lúc review:</p>
<table>
<thead><tr><th>Câu hỏi</th><th>Dấu hiệu tốt</th><th>Dấu hiệu đáng ngại</th></tr></thead>
<tbody>
<tr><td>Có gọi hook không?</td><td>có → <code>use…</code></td><td><code>useFormatDate</code> không gọi hook nào</td></tr>
<tr><td>Mấy việc?</td><td>một câu mô tả được</td><td>"tải, lọc, sắp xếp, theo dõi URL và hiện toast"</td></tr>
<tr><td>Tham số</td><td>một object có tên</td><td>bốn boolean theo vị trí: <code>useX(true, false, 5, true)</code></td></tr>
<tr><td>Trả về</td><td>object (có tên) hoặc union; tuple chỉ cho cặp như <code>[giaTri, setGiaTri]</code></td><td>tuple năm phần tử</td></tr>
<tr><td>Effect</td><td>chỉ để đồng bộ với thứ <em>ngoài</em> React (title, socket, timer)</td><td>effect đặt state từ props</td></tr>
<tr><td>Test</td><td><code>renderHook</code> với wrapper nhỏ</td><td>chỉ test được bằng cách vẽ cả trang</td></tr>
</tbody>
</table>

<h3>Danh tính ổn định — và React Compiler làm gì giúp bạn</h3>
${slide('rx-13', 11, 'React Compiler giữ nguyên object và hàm hook trả về khi đầu vào không đổi')}
<p>Lời khuyên cũ nói: "hook trả object hay hàm thì phải bọc <code>useMemo</code>/<code>useCallback</code>, không thì mỗi lần render đẻ cái mới và làm hỏng <code>memo</code> lẫn mảng phụ thuộc của effect". Trong app này điều đó còn đúng không? Đo: một hook nhỏ trả <code>{ so, tang }</code>, render hai lần mà không đổi gì, so danh tính — một lần với cấu hình của dự án (React Compiler bật), một lần với cấu hình không compiler của Chương 9:</p>
${pre('tsx', SN.danhTinhTest)}
${out(OUT.danhTinh)}
<p>Có compiler, cùng object và cùng hàm quay lại; không có, cả hai đều mới mỗi lần render. Vậy trong dự án có React Compiler (dự án này, từ Chương 12), viết hook cho đúng và để compiler lo phần ổn định — đừng rắc <code>useCallback</code> theo thói quen. Trong thư viện bạn công bố, hay dự án không có compiler, luật cũ vẫn nguyên: người dùng có thể đặt giá trị trả về của bạn vào mảng phụ thuộc.</p>

<h3>Chạy thử từng bước</h3>
<ol>
<li><code>renderHook((boLoc) =&gt; useBacSiDaLoc(boLoc), { wrapper, initialProps })</code> vẽ một component test vô hình gọi hook bên trong wrapper QueryClient + router.</li>
<li>Lần render đầu: query đang chờ → <code>{ trangThai: 'dang-tai' }</code>. MSW trả lời <code>GET /api/bac-si</code> sau khoảng 5 ms (Node).</li>
<li>TanStack Query cất sáu bác sĩ → hook chạy lại → <code>{ trangThai: 'co-du-lieu', tatCa: 6, daLoc: 6 }</code>. <code>waitFor</code> thử lại phép kiểm tới khi đạt.</li>
<li><code>rerender({ chuyenKhoa: 'nhi', tuKhoa: 'vy' })</code>: cùng lần render, bộ lọc mới, <code>locBacSi</code> chạy → <code>daLoc = [bs-6]</code> ngay trong lần render <em>đó</em>. Không render thừa, không khung hình cũ.</li>
<li>Dòng <code>if (kq.trangThai !== 'co-du-lieu') throw …</code> là cho TypeScript: qua dòng đó, trình biên dịch biết <code>kq.daLoc</code> tồn tại.</li>
</ol>

<h3>Styling: một va chạm thật trong dự án này</h3>
${slide('rx-13', 12, 'Hai file cùng tên lớp .hang-nut: style của hai trang trộn vào nhau')}
<p>App phòng khám tạo style cho mọi thứ bằng hai file toàn cục, <code>src/index.css</code> và <code>src/app/app.css</code>. Ở Chương 1 thẻ bác sĩ có một hàng nút, <code>.hang-nut</code>. Ở Chương 10 trang đổi giờ cũng cần một hàng nút — và có một lớp cùng tên trong file kia:</p>
${pre('css', SN.hangNutCu)}
<p>Không ai để ý, vì chẳng có gì trông hỏng. Đo trên Chromium, bản build production, bằng style tính xong mà trình duyệt thật sự áp:</p>
${out(OUT.cssTruoc)}
<p>Cả hai nơi nhận <em>cả hai</em> luật trộn vào nhau. Thẻ bác sĩ thừa hưởng <code>align-items: center</code> từ một trang chẳng liên quan gì tới nó. Trang đổi giờ không bao giờ được khoảng cách 14 px (<code>index.css</code> được import sau <code>app.css</code> trong <code>main.tsx</code>, nên <code>gap: 8px</code> của nó thắng) và dính thêm một <code>margin-top</code> không ai xin. Đây là vấn đề cốt lõi của CSS toàn cục: <strong>tên lớp là toàn cục</strong>, ai thắng do thứ tự import và độ ưu tiên (specificity) quyết định, và thêm một luật cho trang này có thể đổi một trang khác bạn chưa từng mở.</p>

<h3>CSS Modules: tên lớp riêng cho từng file</h3>
${slide('rx-13', 13, 'CSS Modules: tên lớp riêng từng file, CSS đi theo chunk của trang')}
<p>Vite hỗ trợ sẵn <strong>CSS Modules</strong>: đặt tên file <code>*.module.css</code>, import nó như một object, và mọi lớp bên trong được đổi thành một tên duy nhất lúc build. Không cài gói nào, không cú pháp mới — CSS bình thường.</p>
${pre('css', SN.doiGioModule)}
${pre('tsx', SN.doiGioDung)}
${out(OUT.cssSau)}
<p>Trang đổi giờ giờ nhận đúng 14 px, thẻ bác sĩ về lại <code>align-items: normal</code>, và lớp trong DOM là <code>_hangNut_1xsw0_3</code> — không ai khác có thể vô tình dùng nó. <code>Tabs</code> của 13.1 cũng dùng module:</p>
${pre('css', SN.tabsCss)}
<p>Bản build cho thấy thêm hai điều: trang đổi giờ là route lazy, nên CSS của nó vào file riêng (<code>TrangDoiGio-BleFQ8UH.css</code>, 0,06 kB) và chỉ tải cùng trang đó; còn <code>Tabs.module.css</code> nằm trong CSS chính dưới tên <code>._list_73s38_1</code>, <code>._tab_73s38_3</code>…</p>
<p>Một điểm yếu, có đo: kiểu mà Vite gán cho module là <code>{ readonly [key: string]: string }</code>, nên gõ sai tên không phải lỗi.</p>
${pre('tsx', SN.cssGoSai)}
${out(OUT.cssGoSai)}
<p><code>css.hangnut</code> là <code>undefined</code> lúc chạy → <code>className={undefined}</code> → không style, không cảnh báo. Kiểm bằng mắt (hoặc thêm plugin sinh file <code>.d.ts</code> chính xác cho module, nếu đội muốn).</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — "thêm một bộ chọn cụ thể hơn là xong".</strong> Cách vá nhanh hay gặp là <code>.trang-doi-gio .hang-nut { gap: 14px }</code>. Hôm nay chạy, và mở màn một cuộc chạy đua độ ưu tiên: trang sau cần <code>.a .b .hang-nut</code>, rồi <code>!important</code>. Cho phần tử một lớp không ai khác có được (module, tiền tố, hoặc utility) thay vì cố át giọng luật kia.</div>

<h3>Tailwind, đo trên cùng một thẻ</h3>
${slide('rx-13', 14, 'Tailwind hay CSS Modules: đo trên cùng app rồi chọn theo đội')}
<p><strong>Tailwind CSS</strong> đi hướng ngược lại: thay vì đặt tên rồi viết CSS cho tên đó, bạn ghép các <em>lớp tiện ích</em> (utility class) nhỏ ngay trong JSX — <code>rounded-xl</code>, <code>px-4</code>, <code>text-cyan-700</code>. Để so cho công bằng, một bản sao dự án (<code>du-an/ch13-tailwind</code>) cài Tailwind 4.3.3 và chỉ viết lại thẻ bác sĩ, giữ nguyên dáng. Bản 4 không cần file cấu hình — một plugin Vite và một dòng import CSS:</p>
${pre('ts', SN.viteTailwind)}
${pre('css', SN.cssTailwind)}
<p>Trước (Chương 1, CSS toàn cục) và sau (Tailwind):</p>
${pre('css', SN.theCu)}
${pre('tsx', SN.theTailwind)}
<p>Build cả hai và so CSS người dùng phải tải:</p>
${out(OUT.buildCss)}
<p>+5,3 kB thô (+1,33 kB gzip) — phần lớn là biến theme (<code>--color-cyan-700</code>…) và các khai báo <code>@property</code> mà Tailwind v4 sinh ra, còn các luật <code>.the-bac-si</code> cũ chưa xoá vì skeleton vẫn dùng. Ở dự án viết toàn bằng utility thì đường cong đảo lại: CSS lớn theo số <em>utility khác nhau</em>, không theo số component, nên app lớn thường tải ít CSS hơn. Trong output còn một điều bất ngờ:</p>
${out(OUT.twLop)}
<p>Tailwind tìm lớp bằng cách quét file nguồn như văn bản thường. Chữ <code>filter</code> trong <code>danhSach.filter(…)</code>, <code>static</code> trong một class component, <code>.transform(…)</code> của Zod — đều thành luật CSS không ai xin. Ở đây vô hại (vài byte), nhưng nó cho thấy công cụ chạy thế nào: nó không hiểu JSX, nó khớp từng từ.</p>
${SD.cssVi}
<table>
<thead><tr><th></th><th>CSS toàn cục (trước)</th><th>CSS Modules</th><th>Tailwind v4.3.3</th></tr></thead>
<tbody>
<tr><td>Cài đặt</td><td>không</td><td>không (Vite có sẵn)</td><td><code>tailwindcss</code> + <code>@tailwindcss/vite</code></td></tr>
<tr><td>Đụng tên</td><td>có — đã đo</td><td>không thể</td><td>không thể (lớp là giá trị)</td></tr>
<tr><td>Viết ở đâu</td><td>file riêng</td><td><code>.module.css</code> cạnh component</td><td>trong <code>className</code></td></tr>
<tr><td>Nhất quán thiết kế</td><td>kỷ luật</td><td>kỷ luật (biến CSS giúp được)</td><td>thang có sẵn</td></tr>
<tr><td>CSS chết</td><td>tích dần</td><td>đi theo file</td><td>chỉ utility được dùng (+ khớp nhầm)</td></tr>
<tr><td>Bẫy đã đo</td><td>thứ tự import quyết định</td><td>gõ sai tên không phải lỗi kiểu</td><td>quét chữ sinh thêm lớp</td></tr>
</tbody>
</table>
<p>Khi nào chọn cái nào: <strong>CSS Modules</strong> khi đội giỏi CSS, dự án đã có CSS, hay component cần bộ chọn và animation phức tạp; <strong>Tailwind</strong> cho dự án mới muốn nhanh có thang khoảng cách/màu nhất quán, và đội quen chuỗi class dài (shadcn/ui mặc định dùng nó). Chọn gì cũng đừng trộn ba hệ trong một component, và đo bundle thay vì nhắc lại điều một bài blog nói. Thư viện CSS-in-JS chèn style lúc chạy (styled-components, Emotion) vẫn có trong nhiều app đang chạy; từ khi có React Server Components, dự án mới chuyển dần khỏi kiểu chèn lúc chạy sang CSS sinh lúc build.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202 bạn tạo style bằng class Bootstrap (<code>className="btn btn-primary mt-3"</code>) hoặc component React-Bootstrap cộng một file <code>App.css</code>, và dùng lại logic bằng cách chép — custom hook nếu có thì là một slide gần cuối; vài slide cũ còn dùng HOC để chia sẻ logic. → Đi làm: CSS Modules hoặc Tailwind (thường là Tailwind đi cùng shadcn/ui), style có phạm vi để trang này không làm hỏng trang kia; logic dùng chung sống trong custom hook nhỏ có API đặt tên, có kiểu, test bằng <code>renderHook</code>. · <em>Vì sao:</em> utility của Bootstrap gần với ý tưởng Tailwind và ổn cho bài tập; khác biệt ở công ty là quy mô — hai mươi người cùng thêm CSS vào một file toàn cục sẽ đẻ ra đúng cái va chạm <code>.hang-nut</code> đo ở trên. Bạn vẫn gặp Bootstrap trong dự án cũ ở công ty; ở đó hãy theo quy ước của dự án.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Khi nào tách custom hook, và một hook tốt trông thế nào?"</p>
<p>Tách khi cùng một logic có state xuất hiện ở hai chỗ hoặc làm component khó đọc — không phải cứ ba dòng là tách. Hook tốt có một việc, nhận một object tuỳ chọn có tên, trả object có tên (hoặc union phân biệt cho trạng thái bất đồng bộ), tính dữ liệu dẫn xuất trong render thay vì chép vào state bằng effect, và test được bằng <code>renderHook</code>. Chỉ đặt tên <code>use…</code> khi nó gọi hook. Nhắc thêm: hook chia sẻ logic, không chia sẻ state.</p></div>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "CSS Modules, Tailwind hay CSS-in-JS — chọn cái nào, vì sao?"</p>
<p>Cả ba đều giải quyết chuyện tên lớp toàn cục đụng nhau. CSS Modules: CSS thường, có phạm vi nhờ đổi tên lúc build, không tốn gì lúc chạy. Tailwind: lớp tiện ích, token thiết kế nhất quán, kích thước CSS theo số utility khác nhau; chuỗi class dài. CSS-in-JS lúc chạy (styled-components, Emotion): style động theo props, nhưng tốn chi phí lúc chạy và vướng với Server Components — nhiều dự án mới chuộng giải pháp lúc build. Nói đội bạn đang dùng gì, và rằng bạn sẽ đo bundle trước khi tranh luận.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 2/4: một hook tốt và CSS có phạm vi</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau 13.1 (<code>src/features/bac-si/KhuBacSi.tsx</code>, <code>src/pages/TrangDoiGio.tsx</code>, <code>src/app/app.css</code>).</p><ol>
<li>Viết <code>src/features/bac-si/hooks/useBacSiDaLoc.ts</code> trả union <code>KetQuaBacSiDaLoc</code>; viết lại <code>KhuBacSi</code> trên nền nó (danh sách yêu thích đọc <code>kq.tatCa</code>).</li>
<li>Test bằng <code>renderHook</code>: đang tải → có dữ liệu, đổi bộ lọc bằng <code>rerender</code>, và đường 500 → <code>thuLai()</code>.</li>
<li>Dời hàng nút của trang đổi giờ sang <code>TrangDoiGio.module.css</code> và xoá luật <code>.hang-nut</code> khỏi <code>app.css</code>.</li>
<li>Tuỳ chọn, trong một bản sao dự án: cài Tailwind 4 và viết lại <code>TheBacSi</code>; so kích thước <code>index-*.css</code> trong <code>vite build</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> các test có sẵn của <code>KhuBacSi</code> (Chương 2 và 8) vẫn xanh mà không sửa, 2 test hook mới xanh, và trên trình duyệt các nút của trang đổi giờ cách nhau 14 px còn nút trên thẻ bác sĩ cách nhau 8 px (DevTools → Computed → <code>column-gap</code>).</p></div>
<details><summary>Lời giải</summary>
<p><code>useBacSiDaLoc.ts</code>, <code>KhuBacSi</code> mới, test của hook, <code>TrangDoiGio.module.css</code> và dòng import đã in ở trên đúng như dự án mẫu. Dòng xoá khỏi <code>app.css</code> được thay bằng một chú thích trỏ sang module, để người sau khỏi thêm lại. Script đo là <code>do/ch13-css.mjs</code> trong ảnh chụp dự án sau chương: nó build, mở <code>/bac-si</code> và một trang đổi giờ thật (đăng nhập giả, đặt một lịch), rồi in <code>getComputedStyle</code> của cả hai hàng nút.</p>
${out(OUT.cssSau)}
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề:</strong> tìm và sửa một lỗi chép-state thứ hai.</p><ol>
<li>Viết <code>useSoYeuThich()</code> theo cách xấu: <code>useState(0)</code> + một effect đặt nó bằng <code>yeuThich.length</code> lấy từ store Zustand.</li>
<li>Dùng kiểu test ghi từng lần render của bài này để in mọi giá trị nó trả về trong lúc bạn thêm hai bác sĩ yêu thích bằng <code>act(() =&gt; useDatLichStore.getState().doiYeuThich('bs-2'))</code>.</li>
<li>Viết lại thành <code>useDatLichStore((s) =&gt; s.yeuThich.length)</code> và ghi lại lần nữa.</li>
</ol><p><strong>Đạt khi:</strong> bản xấu cho thấy ít nhất một lần render trả số cũ sau khi store đã đổi, bản tốt không có lần nào, và cả hai test in ra danh sách từng lần render.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">custom hook</span><span class="v">hàm tên <code>use…</code> gọi hook khác; chia sẻ logic, không chia sẻ state</span></div>
<div class="kv"><span class="k">derived state</span><span class="v">state dẫn xuất — tính được từ props/state; tính trong render, đừng cất</span></div>
<div class="kv"><span class="k">discriminated union</span><span class="v">union phân biệt: các kiểu object phân biệt nhau bằng một trường (<code>trangThai</code>); TS thu hẹp kiểu sau phép kiểm</span></div>
<div class="kv"><span class="k">stable identity</span><span class="v">danh tính ổn định: cùng object/hàm qua các lần render, nên <code>memo</code> và phụ thuộc thấy "không đổi"</span></div>
<div class="kv"><span class="k">CSS Modules</span><span class="v"><code>*.module.css</code>, lớp được đổi tên riêng cho từng file lúc build</span></div>
<div class="kv"><span class="k">utility class</span><span class="v">lớp tiện ích làm đúng một việc (<code>px-4</code>, <code>text-sm</code>), ghép trong markup</span></div>
<div class="kv"><span class="k">specificity</span><span class="v">độ ưu tiên: cách trình duyệt quyết luật nào thắng khi hai luật cùng khớp</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Custom hook là hàm <code>use…</code> có gọi hook; mỗi lần gọi có state riêng; hàm phụ không gọi hook thì đặt tên như hàm thường.</li>
<li>Chép dữ liệu dẫn xuất vào state bằng effect tốn render thừa và một khung hình dữ liệu sai — đo thật: 4 lần render, một lần trả 6 bác sĩ cho "vy".</li>
<li>Hook tốt: một việc, object tuỳ chọn có tên, trả object có tên hoặc union phân biệt, test được bằng <code>renderHook</code>.</li>
<li>Có React Compiler, object hook trả về giữ nguyên danh tính (đo thật); không có thì mới mỗi lần render.</li>
<li>Tên lớp toàn cục đụng nhau: <code>.hang-nut</code> của Chương 1 và Chương 10 trộn vào nhau ở cả hai trang; CSS Modules sửa được mà không cần công cụ mới.</li>
<li>Tailwind 4 trên cùng thẻ: +5,3 kB CSS ở đây, không đụng tên, thang có sẵn; bộ quét của nó biến chữ như <code>filter</code> thành lớp.</li>
</ul>

${LINK('https://react.dev/learn/reusing-logic-with-custom-hooks', '📘', 'react.dev — Reusing Logic with Custom Hooks', 'Luật, cách đặt tên và khi nào nên tách.')}
${LINK('https://react.dev/learn/you-might-not-need-an-effect', '📘', 'react.dev — You Might Not Need an Effect', 'Vì sao dữ liệu dẫn xuất tính trong render.')}
${LINK('https://vite.dev/guide/features#css-modules', '⚡', 'Vite — CSS Modules', 'Hỗ trợ có sẵn và tuỳ chọn.')}
${LINK('https://tailwindcss.com/docs/installation/using-vite', '🎨', 'Tailwind CSS — Using Vite', 'Cách cài plugin v4 dùng trong bài.')}
${LINK_TRONG('/courses/tailwind-css', '🌬️', 'Học tiếp — Khoá Tailwind CSS', 'Utility, token thiết kế, responsive và dark mode cho kỹ.')}
</div>
`,
};

const L3 = {
    title: '13.3 — Long lists: virtualising 5,000 doctors, measured before and after|||13.3 — Danh sách dài: virtualize 5000 bác sĩ, đo trước và sau',
    slug: 'rx-13-3-danh-sach-dai',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Đo thật trang 5000 bác sĩ trên Chromium (DOM, commit, heap, CPU chậm 4×), dựng danh sách ảo bằng @tanstack/react-virtual, gặp và sửa một va chạm thật với React Compiler (cuộn giữa trang thì trắng), đo lại, và cân cái giá: Ctrl+F, trình đọc màn hình, ngưỡng, tải lười.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3</span>
<h2>Long lists: virtualising 5,000 doctors, measured before and after</h2>
<p class="lead">The clinic has become a chain. The <code>/bac-si</code> page, built in Chapter 1 for six doctors and measured in Chapter 8 with two hundred, now has to show five thousand. Chapter 8's rule still holds — <strong>measure before you optimise</strong> — so this lesson starts with numbers from a real browser, then applies <strong>virtualisation</strong> (rendering only the part of the list the user can see) with <code>@tanstack/react-virtual</code>, runs into a genuine clash with React Compiler that turned the middle of the page blank, and measures again, including on a CPU slowed down four times to stand in for a mid-range phone.</p>
<p>Starting point: the project after 13.2. New dependency: <code>@tanstack/react-virtual</code> 3.14.13. Measurements: Chromium 149 through Playwright, <code>vite build --mode profiling</code> (so <code>&lt;Profiler&gt;</code> reports numbers in a production build, Chapter 8), median of 3 runs, 1280×900 window. The fake API already had a switch <code>?nhieu=</code> for fake doctors (Chapter 8); its cap was raised from 1,000 to 5,000.</p>

<h3>Measure first: 5,000 cards, drawn in full</h3>
${slide('rx-13', 15, 'Drawing all 5,000 cards: 37,715 DOM nodes, 2.8 s on a slow machine')}
<p>The script <code>do/ch13-ao.mjs</code> opens <code>/bac-si?nhieu=5000</code> in a fresh browser context, waits for the heading "Đội ngũ bác sĩ (5000)" and the first card, then reads four kinds of numbers: the longest React commit recorded by the <code>&lt;Profiler id="KhuBacSi"&gt;</code> from Chapter 8, DOM node count, JavaScript heap after a forced garbage collection (through the Chrome DevTools Protocol), and the time for three interactions. The core of it:</p>
${pre('js', SN.doAo)}
${out(OUT.aoTruoc)}
<p>How to read it. With a normal CPU the page is usable but heavy: one commit of ~119 ms (anything over ~50 ms is a "long task" the user can feel), 37,715 DOM nodes and 33.7 MB of heap for a list where nobody will ever look at more than a dozen cards at once. On a CPU four times slower — a fair stand-in for a mid-range phone — opening the page takes <strong>2.8 seconds</strong> with a single commit of 521 ms, and clearing the search box (all 5,000 cards come back) takes 2.5 seconds. Typing "lan" is less bad (1.4 s) because Chapter 12 already moved filtering into a transition and the result is only 417 cards.</p>
<p>One number is surprising: <strong>scrolling</strong> is smooth — no frame over 50 ms even at 4×. Browsers are very good at scrolling a static page, however long. So virtualisation here is not about scrolling; it is about the cost of <em>creating</em> 5,000 cards (on open, on filter reset) and about memory. Knowing which problem you have tells you whether a fix helps: if your complaint were janky scrolling, this lesson's change would not be the answer.</p>

<h3>The idea: keep the page tall, keep the DOM small</h3>
${slide('rx-13', 16, 'Virtualisation: the page stays tall, the DOM keeps a few dozen cards')}
<p>A <strong>virtualised list</strong> (danh sách ảo) keeps two things apart. The <em>page</em> stays as tall as if all 5,000 cards were there — one empty <code>div</code> whose height is the sum of all row heights — so the scrollbar looks and behaves normally. The <em>DOM</em> contains only the rows that intersect the viewport, plus a few extra above and below (<strong>overscan</strong>), each positioned absolutely at the offset where it would have been. On every scroll the virtualiser recomputes which rows are in range; rows leaving the range are unmounted, rows entering are mounted.</p>
${SD.aoEn}
<p><code>@tanstack/react-virtual</code> is itself headless (13.1): it computes <em>which</em> rows and <em>where</em>, and you render them. Two variants: <code>useVirtualizer</code> for a box with its own scrollbar, <code>useWindowVirtualizer</code> when the whole page scrolls. A doctor directory is a normal page, so the window version fits.</p>

<h3>The implementation</h3>
${slide('rx-13', 17, 'useWindowVirtualizer: count rows, estimate, measure after rendering')}
${pre('tsx', SN.dsAo)}
<p>Decisions worth understanding:</p>
<ul>
<li><strong>A row is two cards.</strong> The list sits in a two-column grid (<code>.bo-cuc .luoi-bac-si</code>), so the virtualiser counts <em>rows</em>: <code>Math.ceil(5000 / 2) = 2500</code>. Each row renders <code>danhSach.slice(i * 2, i * 2 + 2)</code>.</li>
<li><strong><code>estimateSize</code> from a measurement, not a guess.</strong> <code>do/ch13-do-cao-the.mjs</code> measured real cards in Chromium: 132–163 px at 1280 px wide, 132–184 px at 900, 204–256 px at 390 (long names wrap). 180 px is a middle value; <code>measureElement</code> then measures each rendered row and corrects the total, which is why the page height changed from 490,115 px to 489,645 px while scrolling in the measurements below.</li>
<li><strong>The jsdom fallback.</strong> jsdom has no layout: every <code>getBoundingClientRect()</code> is 0. A virtualiser that believes every row is 0 px tall decides that all 2,500 rows fit on screen and renders all of them. <code>|| UOC_LUONG</code> keeps tests honest.</li>
<li><strong><code>scrollMargin</code></strong> — the header and filters above the list. It is measured once in <code>useLayoutEffect</code> (before paint, Chapter 11) and stored in state, because reading a ref during render is not allowed.</li>
<li><strong>A threshold.</strong> Under <code>NGUONG_AO = 500</code> cards the old grid renders everything, exactly as in Chapter 8 (its tests with 200 doctors did not change). And the virtual list is loaded lazily:</li>
</ul>
${pre('tsx', SN.dsNguong)}
<div class="callout"><p><strong>JS quick reminder — <code>slice</code> and <code>Math.ceil</code>.</strong> <code>arr.slice(a, b)</code> returns a new array with the items from index <code>a</code> up to (not including) <code>b</code>; it never changes <code>arr</code>. <code>Math.ceil(2.5)</code> is <code>3</code> — rounding up, so an odd number of doctors still gets a last row with one card.</p></div>

<h3>Run it step by step</h3>
<ol>
<li><code>KhuBacSi</code> gets 5,000 filtered doctors → <code>DanhSachBacSi</code> sees <code>5000 &gt; 500</code> → renders the hint and a <code>Suspense</code> around the lazy <code>DanhSachBacSiAo</code>. The first time, its chunk (25.81 kB) is downloaded; the fallback "Đang chuẩn bị danh sách…" shows meanwhile.</li>
<li>First render of <code>DanhSachBacSiAo</code>: <code>lechTren</code> is 0, the virtualiser assumes 2,500 rows × 180 px and renders the rows visible from the top.</li>
<li><code>useLayoutEffect</code> measures where the list starts on the page and sets <code>lechTren</code> → one more render, before the browser paints.</li>
<li>Each row's <code>ref={ao.measureElement}</code> reports its real height; totals and offsets are corrected.</li>
<li>The user scrolls → the window's scroll event → the virtualiser computes the new range → React re-renders with rows ~1,243–1,258 and unmounts the old ones. <code>TheBacSi</code> is still <code>memo</code> (Chapter 8), so cards that stay in range do not re-render.</li>
</ol>

<h3>A real clash: React Compiler and a mutable virtualiser</h3>
${slide('rx-13', 18, 'React Compiler + virtualiser: scroll to mid page and it is blank')}
<p>The first version above did not have the <code>'use no memo'</code> line. It passed a quick look at the top of the page. Then <code>do/ch13-cuon-ao.mjs</code> scrolled to the middle and to the end and asked Chromium which cards were in the DOM and which were inside the viewport:</p>
${out(OUT.cuonCompiler)}
<p>The same 16 cards — the ones from the top of the page — stayed in the DOM forever; in the middle of the page, <strong>zero</strong> cards were visible. The user would see white space. Why? <code>useWindowVirtualizer</code> returns <em>the same object</em> for the life of the component and updates it internally on scroll, then asks React to re-render. React Compiler (on since Chapter 12) memoises everything it can: it sees that <code>ao</code> is still the same object, concludes that <code>ao.getVirtualItems()</code> cannot have changed, and reuses the JSX from the first render.</p>
${SD.compilerEn}
<p>The fix is the directive <code>'use no memo'</code> as the first statement of the component: the compiler skips exactly that function, and the rest of the app stays compiled.</p>
${out(OUT.cuonNoMemo)}
<p>Chapter 12 added a test that fails if the compiler silently skips any component. Here the skip is deliberate, so the test gets an explicit, reviewed allowlist — a new skip anywhere else still fails:</p>
${pre('ts', SN.compilerBoQua)}
<p>And the virtual-list tests catch the bug too — removing the directive turns two of three red:</p>
${out(OUT.aoTestThieu)}
<div class="pitfall co-tieu-de"><strong>Trap — libraries that mutate one object and React Compiler.</strong> Any hook that returns a long-lived object whose methods give different answers over time (virtualisers, some table and form libraries) can freeze under React Compiler: the compiler assumes that the same object means the same result. Symptoms: the UI updates once and then stops, with no error. Check the library's notes on React Compiler, test the interaction in a real browser, and use <code>'use no memo'</code> on the one component that needs it — not a global switch.</div>

<h3>Tests in jsdom</h3>
<p>jsdom cannot measure layout, but the window virtualiser reads <code>window.innerHeight</code> (768 in jsdom) and <code>window.scrollY</code>, which a test can set. Three tests: few cards in the DOM for 5,000 doctors, scrolling mounts far rows and unmounts the first, and a search that drops under the threshold draws everything again:</p>
${pre('tsx', SN.aoTest)}
${out(OUT.b3Test)}
<p>The Chapter 8 tests with 200 doctors pass unchanged: under the threshold nothing changed.</p>

<h3>Measure again</h3>
${slide('rx-13', 19, 'Before and after, same machine, same 5,000 doctors, CPU 4× slower')}
<p>First the virtual list bundled normally (no lazy loading), then the final version with the lazy chunk:</p>
${out(OUT.aoSauKhongLuoi)}
${out(OUT.aoSau)}
<table>
<thead><tr><th>CPU 4× slower</th><th>All cards</th><th>Virtual</th><th>Virtual + lazy</th></tr></thead>
<tbody>
<tr><td>Open page → list visible</td><td>2,770 ms</td><td>608 ms</td><td>873 ms</td></tr>
<tr><td>Longest commit on open</td><td>521.5 ms</td><td>24.7 ms</td><td>20.5 ms</td></tr>
<tr><td>DOM nodes · &lt;article&gt;</td><td>37,715 · 5,000</td><td>194 · 18</td><td>199 · 18</td></tr>
<tr><td>JS heap</td><td>33.7 MB</td><td>6.8 MB</td><td>7.0 MB</td></tr>
<tr><td>Clear search → 5,000 again</td><td>2,496 ms</td><td>161 ms</td><td>154 ms</td></tr>
<tr><td>Type "lan" → 417</td><td>1,407 ms</td><td>418 ms</td><td>396 ms</td></tr>
</tbody>
</table>
<p>Three honest observations. First, the big wins are opening and resetting the list (about 4.5× and 15× faster at 4× CPU), DOM size (190× fewer nodes) and memory (about 5× less). Second, typing "lan" still has a long commit (~77 ms at 4×): 417 results are under the threshold, so the page switches back to drawing all 417 cards — the threshold has a cost, and a team could decide to virtualise always. Third, lazy loading is a trade: every visitor saves 25.81 kB of JavaScript, but the visitor who does open a long list waits for one more request (608 → 873 ms at 4× CPU on localhost; on a real network, more). The bundle numbers behind that decision, measured with the source-map script from Chapter 8:</p>
${out(OUT.bundle)}

<h3>The price, and when not to virtualise</h3>
${slide('rx-13', 20, 'The price of a virtual list: Ctrl+F, screen readers, a threshold')}
<ul>
<li><strong>Find in page</strong> (<code>Ctrl+F</code>) only searches the DOM, so it cannot find a doctor who is not rendered. The page says so and points to the search box.</li>
<li><strong>Screen readers</strong> only "see" rendered items and cannot tell how long the list is unless you add <code>aria-setsize</code>/<code>aria-posinset</code> or say it in text (the heading "Đội ngũ bác sĩ (5000)" does).</li>
<li><strong>Very fast scrolling</strong> can show empty space for a frame before rows are mounted; <code>overscan</code> reduces it.</li>
<li><strong>Scroll restoration and anchors</strong> ("go back to where I was", <code>#bs-2451</code>) need extra work, because the target element may not exist yet.</li>
<li><strong>SEO</strong> — only relevant for server-rendered public lists (Next.js), where crawlers should see all items or real pagination.</li>
</ul>
${SD.khiNaoAoEn}
<p>Often the right answer is not virtualisation at all: pagination or "load more" (TanStack Query's <code>useInfiniteQuery</code>) when users search rather than browse, or simply rendering a few hundred items. Libraries you will meet (npm, 26/09/2026): <code>@tanstack/react-virtual</code> 3.14.13 (headless, used here), <code>react-window</code> 2.3.3 (small, fixed components), <code>react-virtuoso</code> 4.18.15 (automatic variable heights, grouped lists, chat-style reverse scrolling).</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202 lists are rendered with <code>data.map(...)</code> over a JSON file of 10–50 items, maybe with React-Bootstrap <code>Pagination</code> slicing the array by hand; performance never comes up because the data is tiny. → At work lists come from APIs with thousands of rows (orders, logs, patients). Teams measure first (Profiler, Performance panel, a slowed CPU), then choose between server-side pagination, infinite loading, and virtualisation — often TanStack Table + TanStack Virtual for data grids. · <em>Why:</em> mapping over an array is still the right default and what you should do for small lists; the skill that gets you hired is knowing how to find out when it stops being enough, and what each fix costs.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "How would you render a list of 10,000 items in React?"</p>
<p>First ask whether users need all of them at once: often server pagination or infinite loading is better. If they do, measure the current cost (Profiler, DOM size, a throttled CPU), then virtualise: render only the visible rows plus overscan inside a container as tall as the full list, with a library like TanStack Virtual or react-window. Mention stable keys, <code>memo</code> on rows, variable heights (measure, do not guess), and the costs: Ctrl+F, accessibility, scroll restoration.</p></div>
<div class="callout"><p><strong>Common interview question.</strong> "Your virtualised list shows blank space after scrolling. What do you check?"</p>
<p>Whether the virtualiser gets the right scroll element and offsets (window vs container, <code>scrollMargin</code>), whether row heights are measured (<code>measureElement</code>, <code>data-index</code>) or badly estimated, whether overscan is too small, and whether memoisation freezes the rows — e.g. React Compiler reusing <code>getVirtualItems()</code> from a mutable instance, fixed with <code>'use no memo'</code> on that component. Reproduce it in a real browser; jsdom has no layout.</p></div>

<h3>🛠 Keep building the project — step 3/4: 5,000 doctors</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after 13.2 (<code>src/features/bac-si/components/DanhSachBacSi.tsx</code>, <code>src/mocks/dieu-khien.ts</code>).</p><ol>
<li><code>npm i @tanstack/react-virtual</code>; raise the <code>?nhieu=</code> cap to 5,000 in <code>dieu-khien.ts</code>.</li>
<li>Measure the old page at <code>/bac-si?nhieu=5000</code> (Performance panel, or the script <code>do/ch13-ao.mjs</code> from the snapshot). Write down: DOM nodes, longest commit, heap, at normal CPU and at 4× slowdown.</li>
<li>Write <code>DanhSachBacSiAo.tsx</code> with <code>useWindowVirtualizer</code> (2 cards per row, <code>measureElement</code> with the jsdom fallback, <code>scrollMargin</code>), lazy-load it from <code>DanhSachBacSi</code> above <code>NGUONG_AO = 500</code>.</li>
<li>Scroll to the middle in a real browser. If it is blank, add <code>'use no memo'</code> and the allowlist entry in <code>compiler.test.ts</code>.</li>
<li>Write <code>KhuBacSi.ao.test.tsx</code> (three tests above) and measure again.</li>
</ol>
<p><strong>Done when:</strong> in the middle of <code>/bac-si?nhieu=5000</code> cards are visible and the DOM has fewer than 40 <code>&lt;article&gt;</code>; the three new tests and the Chapter 8 performance tests pass; your before/after table shows at least 10× fewer DOM nodes and a shorter longest commit.</p></div>
<details><summary>Solution</summary>
<p><code>DanhSachBacSiAo.tsx</code>, the new part of <code>DanhSachBacSi.tsx</code>, the test file and the compiler allowlist are printed above as in the reference project. <code>dieu-khien.ts</code> changes one line: <code>soBacSi: Math.min(5000, Number(q.get("nhieu")) || 6)</code>. The three measuring scripts are in the snapshot: <code>do/ch13-ao.mjs</code> (<code>--nhieu 5000 --cham 4</code>), <code>do/ch13-cuon-ao.mjs</code> and <code>do/ch13-do-cao-the.mjs</code>. Expected jsdom output:</p>
${out(OUT.b3Test)}
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> see virtualisation with your own eyes, then break it on purpose.</p><ol>
<li>Open <code>/bac-si?nhieu=5000</code>, DevTools → Elements, find the <code>div.danh-sach-ao</code>. Scroll slowly and watch rows appear and disappear; note its <code>height</code>.</li>
<li>In DevTools → Performance, record opening the page with CPU throttling 4×; find the longest task.</li>
<li>Set <code>overscan: 0</code> and scroll fast with the scrollbar. Then set it back.</li>
<li>Remove <code>|| UOC_LUONG</code> from <code>measureElement</code> and run <code>npx vitest run src/features/bac-si/KhuBacSi.ao.test.tsx</code>.</li>
</ol><p><strong>Done when:</strong> you can state the container height in px, the duration of the longest task, whether you saw blank space with <code>overscan: 0</code>, and how many <code>&lt;article&gt;</code> the first test printed without the fallback (and why).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">virtualisation / windowing</span><span class="v">rendering only the items in (or near) the viewport of a long list</span></div>
<div class="kv"><span class="k">viewport</span><span class="v">the visible part of the page (khung nhìn)</span></div>
<div class="kv"><span class="k">overscan</span><span class="v">extra rows rendered above and below the viewport so fast scrolling shows no gaps</span></div>
<div class="kv"><span class="k"><code>measureElement</code></span><span class="v">measures a rendered row's real size so offsets stay correct with variable heights</span></div>
<div class="kv"><span class="k">long task</span><span class="v">main-thread work over 50 ms; the page cannot respond meanwhile</span></div>
<div class="kv"><span class="k">CPU throttling</span><span class="v">slowing the CPU in DevTools/CDP to approximate a weaker device</span></div>
<div class="kv"><span class="k"><code>'use no memo'</code></span><span class="v">directive telling React Compiler to skip one function</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Measured first: 5,000 cards = 37,715 DOM nodes, 33.7 MB heap, 2.8 s to open at 4× CPU — but scrolling was smooth; the cost is creating cards, not scrolling them.</li>
<li>Virtualisation keeps the page tall and the DOM small: rows in view + overscan, positioned absolutely, re-computed on scroll.</li>
<li><code>useWindowVirtualizer</code>: count rows, estimate from real measurements, <code>measureElement</code> (with a jsdom fallback), <code>scrollMargin</code>.</li>
<li>React Compiler froze the mutable virtualiser — mid page blank (measured); <code>'use no memo'</code> on that one component plus a reviewed allowlist fixed it.</li>
<li>After: 199 nodes, 7 MB, ~15× faster reset at 4× CPU; lazy loading saves 25.81 kB for everyone and costs one request for long-list users.</li>
<li>Price: Ctrl+F, screen readers, anchors; under a few hundred items, or when users search, pagination or plain rendering is better.</li>
</ul>

${LINK('https://tanstack.com/virtual/latest/docs/introduction', '📜', 'TanStack Virtual — Introduction', 'useVirtualizer, useWindowVirtualizer, measureElement.')}
${LINK('https://react.dev/reference/react/Profiler', '📘', 'react.dev — &lt;Profiler&gt;', 'actualDuration and the profiling build.')}
${LINK('https://react.dev/learn/react-compiler/introduction', '⚙️', 'react.dev — React Compiler', 'What it memoises and how to opt a function out.')}
${LINK('https://web.dev/articles/virtualize-long-lists-react-window', '🌐', 'web.dev — Virtualize large lists', 'Background on windowing and its trade-offs.')}
${LINK_TRONG('/courses/nextjs', '▲', 'Learn next — Next.js course', 'Server-side pagination and streaming for large public lists.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3</span>
<h2>Danh sách dài: virtualize 5000 bác sĩ, đo trước và sau</h2>
<p class="lead">Phòng khám đã thành chuỗi. Trang <code>/bac-si</code>, dựng ở Chương 1 cho sáu bác sĩ và đo ở Chương 8 với hai trăm, giờ phải hiện năm nghìn. Luật của Chương 8 vẫn nguyên — <strong>đo trước khi tối ưu</strong> — nên bài này mở đầu bằng số đo từ trình duyệt thật, rồi áp <strong>virtualization</strong> (chỉ vẽ phần danh sách người dùng đang nhìn thấy) bằng <code>@tanstack/react-virtual</code>, đụng một va chạm thật với React Compiler làm giữa trang trắng tinh, và đo lại, kể cả trên CPU chậm đi bốn lần để thay cho một chiếc điện thoại tầm trung.</p>
<p>Điểm xuất phát: dự án sau 13.2. Thư viện mới: <code>@tanstack/react-virtual</code> 3.14.13. Cách đo: Chromium 149 qua Playwright, <code>vite build --mode profiling</code> (để <code>&lt;Profiler&gt;</code> báo số trên bản build production, Chương 8), trung vị 3 lần, cửa sổ 1280×900. API giả vốn có núm <code>?nhieu=</code> sinh bác sĩ giả (Chương 8); trần được nâng từ 1.000 lên 5.000.</p>

<h3>Đo trước: vẽ đủ 5.000 thẻ</h3>
${slide('rx-13', 15, 'Vẽ đủ 5000 thẻ: 37.715 nút DOM, một commit 119 ms, 2,8 giây trên máy yếu')}
<p>Script <code>do/ch13-ao.mjs</code> mở <code>/bac-si?nhieu=5000</code> trong một ngữ cảnh trình duyệt mới, đợi tiêu đề "Đội ngũ bác sĩ (5000)" và thẻ đầu tiên, rồi đọc bốn loại số: commit React dài nhất mà <code>&lt;Profiler id="KhuBacSi"&gt;</code> của Chương 8 ghi lại, số nút DOM, heap JavaScript sau khi ép dọn rác (qua Chrome DevTools Protocol), và thời gian của ba thao tác. Phần lõi:</p>
${pre('js', SN.doAo)}
${out(OUT.aoTruoc)}
<p>Đọc thế nào. Với CPU bình thường trang dùng được nhưng nặng: một commit ~119 ms (trên ~50 ms là một "long task" người dùng cảm được), 37.715 nút DOM và 33,7 MB heap cho một danh sách mà không ai nhìn quá chục thẻ một lúc. Với CPU chậm bốn lần — tương đương khá sát một điện thoại tầm trung — mở trang mất <strong>2,8 giây</strong> với một commit 521 ms, và xoá ô tìm (đủ 5.000 thẻ quay lại) mất 2,5 giây. Gõ "lan" đỡ hơn (1,4 giây) vì Chương 12 đã đưa việc lọc vào transition và kết quả chỉ còn 417 thẻ.</p>
<p>Có một con số bất ngờ: <strong>cuộn</strong> vẫn mượt — không khung hình nào quá 50 ms kể cả ở 4×. Trình duyệt cuộn một trang tĩnh rất giỏi, dài bao nhiêu cũng vậy. Vậy virtualization ở đây không phải để cuộn mượt; nó là để bớt chi phí <em>tạo</em> 5.000 thẻ (lúc mở, lúc xoá bộ lọc) và bớt bộ nhớ. Biết mình đang gặp vấn đề nào mới biết cách sửa có giúp không: nếu người dùng than cuộn giật, thay đổi của bài này không phải đáp án.</p>

<h3>Ý tưởng: giữ trang cao, giữ DOM nhỏ</h3>
${slide('rx-13', 16, 'Virtualization: trang vẫn cao như đủ 5000 thẻ, DOM chỉ có vài chục')}
<p><strong>Danh sách ảo</strong> (virtualized list) tách hai thứ ra. <em>Trang</em> vẫn cao như có đủ 5.000 thẻ — một <code>div</code> rỗng cao bằng tổng chiều cao mọi hàng — nên thanh cuộn trông và chạy bình thường. <em>DOM</em> chỉ chứa những hàng giao với khung nhìn, cộng thêm vài hàng phía trên và dưới (<strong>overscan</strong>), mỗi hàng đặt tuyệt đối đúng chỗ nó lẽ ra nằm. Mỗi lần cuộn virtualizer tính lại những hàng nào nằm trong tầm; hàng rời tầm bị gỡ, hàng vào tầm được gắn.</p>
${SD.aoVi}
<p><code>@tanstack/react-virtual</code> tự nó cũng là headless (13.1): nó tính hàng <em>nào</em> và ở <em>đâu</em>, còn bạn vẽ. Hai biến thể: <code>useVirtualizer</code> cho một hộp có thanh cuộn riêng, <code>useWindowVirtualizer</code> khi cả trang cuộn. Danh bạ bác sĩ là một trang bình thường, nên bản window hợp hơn.</p>

<h3>Cài đặt</h3>
${slide('rx-13', 17, 'useWindowVirtualizer: đếm hàng, ước lượng chiều cao, đo lại sau khi vẽ')}
${pre('tsx', SN.dsAo)}
<p>Những quyết định đáng hiểu:</p>
<ul>
<li><strong>Một hàng là hai thẻ.</strong> Danh sách nằm trong lưới hai cột (<code>.bo-cuc .luoi-bac-si</code>), nên virtualizer đếm <em>hàng</em>: <code>Math.ceil(5000 / 2) = 2500</code>. Mỗi hàng vẽ <code>danhSach.slice(i * 2, i * 2 + 2)</code>.</li>
<li><strong><code>estimateSize</code> lấy từ số đo, không đoán.</strong> <code>do/ch13-do-cao-the.mjs</code> đo thẻ thật trên Chromium: 132–163 px ở bề ngang 1280, 132–184 px ở 900, 204–256 px ở 390 (tên dài xuống dòng). 180 px là giá trị giữa; <code>measureElement</code> sau đó đo từng hàng đã vẽ và chỉnh lại tổng — vì vậy chiều cao trang đổi từ 490.115 px sang 489.645 px trong lúc cuộn ở số đo bên dưới.</li>
<li><strong>Đường lùi cho jsdom.</strong> jsdom không tính bố cục: mọi <code>getBoundingClientRect()</code> đều bằng 0. Virtualizer tin mọi hàng cao 0 px sẽ kết luận cả 2.500 hàng vừa màn hình và vẽ hết. <code>|| UOC_LUONG</code> giữ cho test trung thực.</li>
<li><strong><code>scrollMargin</code></strong> — phần header và bộ lọc phía trên danh sách. Đo một lần trong <code>useLayoutEffect</code> (trước khi vẽ, Chương 11) rồi cất vào state, vì không được đọc ref trong lúc render.</li>
<li><strong>Một ngưỡng.</strong> Dưới <code>NGUONG_AO = 500</code> thẻ, lưới cũ vẽ đủ, y như Chương 8 (test 200 bác sĩ của nó không đổi gì). Và danh sách ảo được tải lười:</li>
</ul>
${pre('tsx', SN.dsNguong)}
<div class="callout"><p><strong>JS nhắc nhanh — <code>slice</code> và <code>Math.ceil</code>.</strong> <code>arr.slice(a, b)</code> trả mảng mới gồm các phần tử từ chỉ số <code>a</code> tới trước <code>b</code>; nó không bao giờ sửa <code>arr</code>. <code>Math.ceil(2.5)</code> là <code>3</code> — làm tròn lên, nên số bác sĩ lẻ vẫn có hàng cuối với một thẻ.</p></div>

<h3>Chạy thử từng bước</h3>
<ol>
<li><code>KhuBacSi</code> nhận 5.000 bác sĩ đã lọc → <code>DanhSachBacSi</code> thấy <code>5000 &gt; 500</code> → vẽ lời nhắc và một <code>Suspense</code> bọc <code>DanhSachBacSiAo</code> tải lười. Lần đầu, chunk của nó (25,81 kB) được tải; trong lúc chờ hiện "Đang chuẩn bị danh sách…".</li>
<li>Lần render đầu của <code>DanhSachBacSiAo</code>: <code>lechTren</code> bằng 0, virtualizer giả định 2.500 hàng × 180 px và vẽ các hàng nhìn thấy từ đầu trang.</li>
<li><code>useLayoutEffect</code> đo danh sách bắt đầu ở đâu trên trang và đặt <code>lechTren</code> → thêm một lần render, trước khi trình duyệt vẽ.</li>
<li><code>ref={ao.measureElement}</code> của từng hàng báo chiều cao thật; tổng và vị trí được chỉnh lại.</li>
<li>Người dùng cuộn → sự kiện scroll của window → virtualizer tính tầm mới → React vẽ lại với các hàng ~1.243–1.258 và gỡ các hàng cũ. <code>TheBacSi</code> vẫn có <code>memo</code> (Chương 8), nên thẻ còn trong tầm không vẽ lại.</li>
</ol>

<h3>Một va chạm thật: React Compiler và một virtualizer tự sửa mình</h3>
${slide('rx-13', 18, 'React Compiler + virtualizer: cuộn tới giữa trang thì trắng tinh')}
<p>Bản đầu tiên ở trên không có dòng <code>'use no memo'</code>. Nhìn qua đầu trang thì ổn. Rồi <code>do/ch13-cuon-ao.mjs</code> cuộn tới giữa và tới cuối trang, hỏi Chromium những thẻ nào đang có trong DOM và những thẻ nào nằm trong khung nhìn:</p>
${out(OUT.cuonCompiler)}
<p>Vẫn 16 thẻ ấy — những thẻ ở đầu trang — nằm lì trong DOM; ở giữa trang, <strong>không</strong> thẻ nào nhìn thấy. Người dùng sẽ thấy một khoảng trắng. Vì sao? <code>useWindowVirtualizer</code> trả về <em>cùng một object</em> suốt đời component, tự cập nhật bên trong khi cuộn, rồi xin React vẽ lại. React Compiler (bật từ Chương 12) memo mọi thứ nó có thể: nó thấy <code>ao</code> vẫn là object cũ, kết luận <code>ao.getVirtualItems()</code> không thể đổi, và dùng lại JSX của lần render đầu.</p>
${SD.compilerVi}
<p>Cách sửa là chỉ thị <code>'use no memo'</code> làm câu lệnh đầu tiên của component: compiler bỏ qua đúng hàm đó, phần còn lại của app vẫn được biên dịch.</p>
${out(OUT.cuonNoMemo)}
<p>Chương 12 đã thêm một test đỏ nếu compiler âm thầm bỏ qua component nào. Ở đây bỏ qua là có chủ đích, nên test nhận một danh sách cho phép rõ ràng, đã qua review — bỏ qua ở bất kỳ chỗ nào khác vẫn đỏ:</p>
${pre('ts', SN.compilerBoQua)}
<p>Và các test danh sách ảo cũng bắt được lỗi — bỏ chỉ thị đi là hai trên ba test đỏ:</p>
${out(OUT.aoTestThieu)}
<div class="pitfall co-tieu-de"><strong>Bẫy — thư viện tự sửa một object, gặp React Compiler.</strong> Hook nào trả về một object sống lâu mà method của nó cho kết quả khác nhau theo thời gian (virtualizer, vài thư viện bảng và form) đều có thể "đóng băng" dưới React Compiler: compiler cho rằng cùng object thì cùng kết quả. Triệu chứng: giao diện cập nhật một lần rồi đứng im, không lỗi nào. Đọc ghi chú của thư viện về React Compiler, thử tương tác trên trình duyệt thật, và dùng <code>'use no memo'</code> đúng cho component cần nó — đừng tắt compiler toàn cục.</div>

<h3>Test trong jsdom</h3>
<p>jsdom không đo được bố cục, nhưng virtualizer theo window đọc <code>window.innerHeight</code> (768 trong jsdom) và <code>window.scrollY</code>, mà test thì đặt được. Ba test: 5.000 bác sĩ nhưng DOM chỉ có ít thẻ, cuộn thì hàng ở xa được gắn và hàng đầu bị gỡ, và tìm kiếm tụt dưới ngưỡng thì vẽ đủ trở lại:</p>
${pre('tsx', SN.aoTest)}
${out(OUT.b3Test)}
<p>Các test Chương 8 với 200 bác sĩ vẫn xanh, không sửa gì: dưới ngưỡng thì không có gì thay đổi.</p>

<h3>Đo lại</h3>
${slide('rx-13', 19, 'Trước và sau, cùng máy, cùng 5000 bác sĩ, CPU chậm 4×')}
<p>Đầu tiên là danh sách ảo đóng gói bình thường (không tải lười), rồi bản cuối có chunk tải lười:</p>
${out(OUT.aoSauKhongLuoi)}
${out(OUT.aoSau)}
<table>
<thead><tr><th>CPU chậm 4×</th><th>Vẽ đủ</th><th>Ảo</th><th>Ảo + tải lười</th></tr></thead>
<tbody>
<tr><td>Mở trang → thấy danh sách</td><td>2.770 ms</td><td>608 ms</td><td>873 ms</td></tr>
<tr><td>Commit dài nhất khi mở</td><td>521,5 ms</td><td>24,7 ms</td><td>20,5 ms</td></tr>
<tr><td>Nút DOM · &lt;article&gt;</td><td>37.715 · 5.000</td><td>194 · 18</td><td>199 · 18</td></tr>
<tr><td>Heap JS</td><td>33,7 MB</td><td>6,8 MB</td><td>7,0 MB</td></tr>
<tr><td>Xoá ô tìm → lại 5.000</td><td>2.496 ms</td><td>161 ms</td><td>154 ms</td></tr>
<tr><td>Gõ "lan" → 417</td><td>1.407 ms</td><td>418 ms</td><td>396 ms</td></tr>
</tbody>
</table>
<p>Ba nhận xét trung thực. Thứ nhất, cái lợi lớn nằm ở mở và xoá bộ lọc (nhanh hơn khoảng 4,5 lần và 15 lần ở CPU 4×), kích thước DOM (ít hơn 190 lần) và bộ nhớ (ít hơn khoảng 5 lần). Thứ hai, gõ "lan" vẫn có một commit dài (~77 ms ở 4×): 417 kết quả nằm dưới ngưỡng, nên trang chuyển về vẽ đủ 417 thẻ — ngưỡng có giá của nó, và một đội có thể quyết định luôn luôn virtualize. Thứ ba, tải lười là một cuộc đổi chác: mọi người vào trang đều bớt 25,81 kB JavaScript, nhưng người nào thật sự mở danh sách dài phải chờ thêm một request (608 → 873 ms ở CPU 4× trên localhost; trên mạng thật còn lâu hơn). Số đo bundle đứng sau quyết định đó, đo bằng script sourcemap của Chương 8:</p>
${out(OUT.bundle)}

<h3>Cái giá, và khi nào đừng virtualize</h3>
${slide('rx-13', 20, 'Cái giá của danh sách ảo: Ctrl+F, trình đọc màn hình, một ngưỡng phải chọn')}
<ul>
<li><strong>Tìm trong trang</strong> (<code>Ctrl+F</code>) chỉ tìm trong DOM, nên không tìm ra bác sĩ chưa được vẽ. Trang nói rõ điều đó và chỉ sang ô tìm.</li>
<li><strong>Trình đọc màn hình</strong> chỉ "thấy" những mục đã vẽ và không biết danh sách dài bao nhiêu, trừ khi bạn thêm <code>aria-setsize</code>/<code>aria-posinset</code> hoặc nói bằng chữ (tiêu đề "Đội ngũ bác sĩ (5000)" đã nói).</li>
<li><strong>Cuộn cực nhanh</strong> có thể thấy khoảng trống trong một khung hình trước khi hàng được gắn; <code>overscan</code> làm giảm việc này.</li>
<li><strong>Khôi phục vị trí cuộn và neo</strong> ("quay về chỗ cũ", <code>#bs-2451</code>) cần làm thêm, vì phần tử đích có thể chưa tồn tại.</li>
<li><strong>SEO</strong> — chỉ đáng lo với danh sách công khai render phía máy chủ (Next.js), nơi bot cần thấy mọi mục hoặc phân trang thật.</li>
</ul>
${SD.khiNaoAoVi}
<p>Nhiều khi đáp án đúng không phải virtualization: phân trang hoặc "xem thêm" (<code>useInfiniteQuery</code> của TanStack Query) khi người dùng tìm chứ không lướt, hoặc cứ vẽ vài trăm mục. Thư viện bạn sẽ gặp (npm, 26/09/2026): <code>@tanstack/react-virtual</code> 3.14.13 (headless, dùng ở đây), <code>react-window</code> 2.3.3 (nhỏ, component cố định), <code>react-virtuoso</code> 4.18.15 (tự đo chiều cao thay đổi, danh sách nhóm, cuộn ngược kiểu chat).</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202 danh sách vẽ bằng <code>data.map(...)</code> trên một file JSON 10–50 mục, có thể thêm <code>Pagination</code> của React-Bootstrap tự cắt mảng bằng tay; hiệu năng không bao giờ được nhắc vì dữ liệu quá nhỏ. → Đi làm, danh sách đến từ API với hàng nghìn dòng (đơn hàng, log, bệnh nhân). Đội đo trước (Profiler, tab Performance, CPU làm chậm), rồi chọn giữa phân trang phía máy chủ, tải dần, và virtualization — với lưới dữ liệu thường là TanStack Table + TanStack Virtual. · <em>Vì sao:</em> <code>map</code> trên mảng vẫn là mặc định đúng và là việc nên làm với danh sách nhỏ; kỹ năng khiến bạn được tuyển là biết cách phát hiện khi nào nó không còn đủ, và mỗi cách sửa tốn gì.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Bạn sẽ vẽ một danh sách 10.000 mục trong React thế nào?"</p>
<p>Trước hết hỏi người dùng có cần thấy hết một lúc không: nhiều khi phân trang phía máy chủ hay tải dần tốt hơn. Nếu có, đo chi phí hiện tại (Profiler, số nút DOM, CPU làm chậm), rồi virtualize: chỉ vẽ các hàng nhìn thấy cộng overscan bên trong một khung cao bằng cả danh sách, dùng thư viện như TanStack Virtual hay react-window. Nhắc key ổn định, <code>memo</code> cho hàng, chiều cao thay đổi (đo, đừng đoán), và cái giá: Ctrl+F, khả năng tiếp cận, khôi phục vị trí cuộn.</p></div>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Danh sách ảo của bạn trắng xoá sau khi cuộn. Bạn kiểm gì?"</p>
<p>Virtualizer có nhận đúng phần tử cuộn và độ lệch không (window hay hộp riêng, <code>scrollMargin</code>), chiều cao hàng có được đo (<code>measureElement</code>, <code>data-index</code>) hay bị ước lượng sai, overscan có quá nhỏ không, và có lớp memo nào làm đông cứng hàng không — ví dụ React Compiler dùng lại <code>getVirtualItems()</code> của một instance tự sửa mình, sửa bằng <code>'use no memo'</code> ở đúng component đó. Tái hiện trên trình duyệt thật; jsdom không có bố cục.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 3/4: 5.000 bác sĩ</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau 13.2 (<code>src/features/bac-si/components/DanhSachBacSi.tsx</code>, <code>src/mocks/dieu-khien.ts</code>).</p><ol>
<li><code>npm i @tanstack/react-virtual</code>; nâng trần <code>?nhieu=</code> lên 5.000 trong <code>dieu-khien.ts</code>.</li>
<li>Đo trang cũ ở <code>/bac-si?nhieu=5000</code> (tab Performance, hoặc script <code>do/ch13-ao.mjs</code> trong ảnh chụp dự án). Ghi lại: số nút DOM, commit dài nhất, heap, ở CPU thường và CPU chậm 4×.</li>
<li>Viết <code>DanhSachBacSiAo.tsx</code> với <code>useWindowVirtualizer</code> (2 thẻ một hàng, <code>measureElement</code> có đường lùi cho jsdom, <code>scrollMargin</code>), tải lười nó từ <code>DanhSachBacSi</code> khi vượt <code>NGUONG_AO = 500</code>.</li>
<li>Cuộn tới giữa trang trên trình duyệt thật. Nếu trắng, thêm <code>'use no memo'</code> và dòng cho phép trong <code>compiler.test.ts</code>.</li>
<li>Viết <code>KhuBacSi.ao.test.tsx</code> (ba test ở trên) và đo lại.</li>
</ol>
<p><strong>Đạt khi:</strong> ở giữa <code>/bac-si?nhieu=5000</code> thấy thẻ và DOM có dưới 40 <code>&lt;article&gt;</code>; ba test mới và các test hiệu năng Chương 8 xanh; bảng trước/sau của bạn cho thấy số nút DOM giảm ít nhất 10 lần và commit dài nhất ngắn lại.</p></div>
<details><summary>Lời giải</summary>
<p><code>DanhSachBacSiAo.tsx</code>, phần mới của <code>DanhSachBacSi.tsx</code>, file test và danh sách cho phép của compiler đã in ở trên đúng như dự án mẫu. <code>dieu-khien.ts</code> đổi một dòng: <code>soBacSi: Math.min(5000, Number(q.get("nhieu")) || 6)</code>. Ba script đo nằm trong ảnh chụp dự án: <code>do/ch13-ao.mjs</code> (<code>--nhieu 5000 --cham 4</code>), <code>do/ch13-cuon-ao.mjs</code> và <code>do/ch13-do-cao-the.mjs</code>. Output mong đợi trong jsdom:</p>
${out(OUT.b3Test)}
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề:</strong> tận mắt thấy virtualization, rồi cố ý làm hỏng nó.</p><ol>
<li>Mở <code>/bac-si?nhieu=5000</code>, DevTools → Elements, tìm <code>div.danh-sach-ao</code>. Cuộn chậm và nhìn các hàng xuất hiện rồi biến mất; ghi lại <code>height</code> của nó.</li>
<li>Trong DevTools → Performance, ghi lại lúc mở trang với CPU throttling 4×; tìm task dài nhất.</li>
<li>Đặt <code>overscan: 0</code> rồi kéo thanh cuộn thật nhanh. Sau đó trả lại như cũ.</li>
<li>Bỏ <code>|| UOC_LUONG</code> khỏi <code>measureElement</code> rồi chạy <code>npx vitest run src/features/bac-si/KhuBacSi.ao.test.tsx</code>.</li>
</ol><p><strong>Đạt khi:</strong> bạn nói được chiều cao khung tính bằng px, thời lượng task dài nhất, có thấy khoảng trắng với <code>overscan: 0</code> không, và test đầu in ra bao nhiêu <code>&lt;article&gt;</code> khi thiếu đường lùi (và vì sao).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">virtualization / windowing</span><span class="v">chỉ vẽ các mục nằm trong (hoặc sát) khung nhìn của một danh sách dài</span></div>
<div class="kv"><span class="k">viewport</span><span class="v">khung nhìn — phần trang đang thấy trên màn hình</span></div>
<div class="kv"><span class="k">overscan</span><span class="v">vẽ dư vài hàng trên và dưới khung nhìn để cuộn nhanh không lộ khoảng trống</span></div>
<div class="kv"><span class="k"><code>measureElement</code></span><span class="v">đo kích thước thật của hàng đã vẽ để vị trí đúng khi chiều cao thay đổi</span></div>
<div class="kv"><span class="k">long task</span><span class="v">việc trên luồng chính dài hơn 50 ms; trong lúc đó trang không phản hồi</span></div>
<div class="kv"><span class="k">CPU throttling</span><span class="v">làm chậm CPU trong DevTools/CDP để giả một thiết bị yếu hơn</span></div>
<div class="kv"><span class="k"><code>'use no memo'</code></span><span class="v">chỉ thị bảo React Compiler bỏ qua một hàm</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đo trước: 5.000 thẻ = 37.715 nút DOM, heap 33,7 MB, 2,8 giây để mở ở CPU 4× — nhưng cuộn vẫn mượt; cái tốn là tạo thẻ, không phải cuộn.</li>
<li>Virtualization giữ trang cao và DOM nhỏ: các hàng trong tầm nhìn + overscan, đặt tuyệt đối, tính lại mỗi lần cuộn.</li>
<li><code>useWindowVirtualizer</code>: đếm hàng, ước lượng từ số đo thật, <code>measureElement</code> (có đường lùi cho jsdom), <code>scrollMargin</code>.</li>
<li>React Compiler làm đông cứng virtualizer tự sửa mình — giữa trang trắng (đo thật); <code>'use no memo'</code> ở đúng một component cộng danh sách cho phép đã review thì sửa được.</li>
<li>Sau: 199 nút, 7 MB, xoá bộ lọc nhanh ~15 lần ở CPU 4×; tải lười bớt 25,81 kB cho mọi người và thêm một request cho người mở danh sách dài.</li>
<li>Cái giá: Ctrl+F, trình đọc màn hình, neo; dưới vài trăm mục, hay khi người dùng tìm chứ không lướt, phân trang hoặc vẽ thường tốt hơn.</li>
</ul>

${LINK('https://tanstack.com/virtual/latest/docs/introduction', '📜', 'TanStack Virtual — Introduction', 'useVirtualizer, useWindowVirtualizer, measureElement.')}
${LINK('https://react.dev/reference/react/Profiler', '📘', 'react.dev — &lt;Profiler&gt;', 'actualDuration và bản build profiling.')}
${LINK('https://react.dev/learn/react-compiler/introduction', '⚙️', 'react.dev — React Compiler', 'Nó memo những gì và cách cho một hàm ra ngoài.')}
${LINK('https://web.dev/articles/virtualize-long-lists-react-window', '🌐', 'web.dev — Virtualize large lists', 'Nền tảng về windowing và các đánh đổi.')}
${LINK_TRONG('/courses/nextjs', '▲', 'Học tiếp — Khoá Next.js', 'Phân trang phía máy chủ và streaming cho danh sách công khai lớn.')}
</div>
`,
};

const L4 = {
    title: '13.4 — Safe HTML (XSS, dangerouslySetInnerHTML, DOMPurify) and basic i18n with Intl|||13.4 — HTML an toàn (XSS, dangerouslySetInnerHTML, DOMPurify) và i18n cơ bản với Intl',
    slug: 'rx-13-4-bao-mat-i18n',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Từ góc người phòng thủ: React tự thoát ký tự ra sao, khi nào dangerouslySetInnerHTML làm mã lạ chạy (đo trên Chromium), lọc bằng DOMPurify với danh sách trắng, kiểm link javascript:; rồi i18n Việt/Anh: từ điển có kiểu, số nhiều, Intl theo vùng và múi giờ, html lang.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4</span>
<h2>Safe HTML and basic internationalisation</h2>
<p class="lead">Two requests arrive in the same week. The clinic's content team now writes each doctor's introduction in a rich-text editor — bold, bullet lists — and the API returns it as HTML. And a partner hospital wants the site in English. The first is a security question: how do you show HTML that you did not write without letting someone run code in your users' browsers? The second is an architecture question: how do you get strings, dates and numbers out of the components so a second language is a data change, not a rewrite? This lesson answers both on the clinic app, measuring what the browser really does.</p>
<p>Starting point: the project after 13.3. New dependency: <code>dompurify</code> 3.4.16. Everything is written from the <strong>defender's</strong> side: the "attack" string used throughout only increments a harmless counter <code>window.__xss</code>, so we can measure whether foreign code ran. Versions: React 19.3.0, Chromium 149, Node 22.21.0 with ICU 77.1 (the data behind <code>Intl</code>).</p>

<h3>XSS in one paragraph</h3>
<p><strong>Cross-site scripting (XSS)</strong> happens when text that came from outside your code — a database field, a URL parameter, a comment — ends up interpreted by the browser as HTML or JavaScript on your page. Code that runs there runs <em>as your site</em>: it can read what the page shows, act on behalf of the signed-in user, and send data elsewhere. The defence is always the same idea: <strong>data must stay data</strong>. Text is shown as text; HTML from outside is reduced to a known-safe subset before it is inserted; URLs are checked before they become links.</p>
${SD.xssEn}

<h3>What React does for you: escaping</h3>
${slide('rx-13', 21, 'A string with injected code: React escapes it, innerHTML runs it')}
<p>For the demonstration, the fake API has a new switch <code>?doc=1</code> that replaces doctor bs-3's introduction with a string containing an image tag whose <code>onerror</code> handler increments the counter — the shape of a real XSS payload, with a harmless body:</p>
${pre('ts', SN.gioiThieuDoc)}
<p>A small page, <code>thu-xss.html</code>, shows that same string three ways; a script opens each version in Chromium, waits for the broken image to fail, and reads the counter:</p>
${out(OUT.xssChromium)}
<ul>
<li><strong><code>{chuoi}</code> in JSX (<code>?kieu=chu</code>)</strong> — React converts <code>&lt;</code> into <code>&amp;lt;</code> and so on before touching the DOM. The user sees the tags as text, no <code>&lt;img&gt;</code> exists, the handler never runs. This is the default for <em>everything</em> you put between braces, which is why a plain React app is XSS-safe by default.</li>
<li><strong><code>dangerouslySetInnerHTML</code> without sanitising (<code>?kieu=tho</code>)</strong> — the string goes straight to <code>innerHTML</code>. The browser creates a real <code>&lt;img&gt;</code>, the image fails to load, and <strong>the handler runs</strong> (counter = 1). The long name is a warning label: React stops protecting you here.</li>
<li><strong>Sanitised with DOMPurify (<code>?kieu=loc</code>)</strong> — the paragraph stays, the <code>&lt;img&gt;</code> is gone, counter 0.</li>
</ul>
<p>The same three facts in jsdom, as tests:</p>
${pre('tsx', SN.xssTest)}
${out(OUT.xssTest)}

<h3>When you do need HTML: sanitise with an allowlist</h3>
${slide('rx-13', 22, 'DOMPurify with an allowlist: keep formatting, remove anything executable')}
<p>The content team's bold text and lists must be shown as formatting, so <code>{…}</code> is not an option. The rule: <strong>never pass an unsanitised string to <code>dangerouslySetInnerHTML</code></strong>, and sanitise at the exact place where it is inserted, so no other code path can skip it. DOMPurify parses the HTML with the browser's own parser (so it sees what the browser would see), removes everything dangerous, and returns a safe string. We go further than its defaults with an <strong>allowlist</strong> (danh sách trắng): only the tags and attributes the content actually needs. With its default settings DOMPurify already removes the handler — but keeps the image, pointing at whatever URL the attacker chose:</p>
${out(OUT.purifyMacDinh)}
<p>The content never needs images, so the allowlist removes them entirely:</p>
${pre('tsx', SN.htmlAnToan)}
${pre('ts', SN.htmlAnToanTest)}
${out(OUT.b4Test)}
<p>The allowlist removed the image (and its handler), a <code>&lt;script&gt;</code>, an inline <code>style</code> that could have covered the page with a fake login box, and the <code>href</code> of a <code>javascript:</code> link — while keeping <code>&lt;strong&gt;</code>, lists and a normal https link. <code>locHtml</code> is a plain function so it can be tested without React and reused on the server if the backend is ever written in Node. The "Giới thiệu" tab now renders <code>&lt;HtmlAnToan html={bacSi.gioiThieu} /&gt;</code>; because DOMPurify weighs ~28 kB, the tab's component is lazy-loaded (Lesson 13.3's technique) — the chunk <code>GioiThieuBacSi-*.js</code> is 28.94 kB and only downloads when someone opens that tab.</p>
<div class="pitfall co-tieu-de"><strong>Trap — sanitising somewhere else.</strong> "The backend already cleans it when saving" and "we sanitise in the API client" both break the day a second code path appears: an import script, an admin tool, an old record saved before the rule existed. Sanitise at the point of insertion, every time. Server-side cleaning is a good <em>extra</em> layer, never the only one. The same goes for markdown: a markdown library that allows raw HTML is <code>dangerouslySetInnerHTML</code> with extra steps.</div>

<h3>Links: <code>javascript:</code> URLs and friends</h3>
${slide('rx-13', 23, 'href="javascript:…": React 19 replaces it with code that only throws')}
<p>A URL is also code if its scheme is <code>javascript:</code>. React 19.3 handles the worst case: the test above shows that <code>&lt;a href="javascript:alert(1)"&gt;</code> becomes <code>javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')</code> — the <code>sanitizeURL</code> function in <code>react-dom</code>. Clicking such a link does nothing harmful. But React does not block <code>data:</code> URLs, does not validate that a URL is a URL, and cannot help with <code>window.location = x</code> or <code>ref.current.innerHTML = x</code>. For links that come from users (a doctor's website, a link in feedback), check the scheme yourself:</p>
${pre('ts', SN.linkAnToan)}
${pre('ts', SN.linkAnToanTest)}
${out(OUT.linkTest)}
<p>Note <code>' JavaScript:alert(1)'</code> — a leading space and mixed case. Hand-written checks like <code>url.startsWith('javascript:')</code> miss exactly this; parsing with <code>new URL</code> normalises it.</p>

<h3>Run it step by step</h3>
<ol>
<li>Open <code>/bac-si/bs-3?doc=1&amp;tab=gioi-thieu</code>. MSW's <code>datLaiDuLieu</code> gives bs-3 the poisoned introduction.</li>
<li><code>TabsTheoUrl</code> selects "Giới thiệu" → <code>Tabs.Panel</code> mounts → the lazy <code>GioiThieuBacSi</code> chunk (with DOMPurify) downloads.</li>
<li><code>use(layHua(…))</code> returns the doctor (already fetched by <code>HoSoBacSi</code>).</li>
<li><code>HtmlAnToan</code> calls <code>locHtml</code>: DOMPurify parses the string into a detached document, walks it, removes <code>&lt;img&gt;</code> (not in <code>ALLOWED_TAGS</code>), serialises <code>&lt;p&gt;Mụn trứng cá, viêm da cơ địa.&lt;/p&gt;</code>.</li>
<li>React sets that string as <code>innerHTML</code> of the <code>div</code>. No image, no handler, <code>window.__xss</code> stays undefined.</li>
</ol>
${out(OUT.xssApp)}
<p>Other layers a real product adds (not built here, so not measured): a <strong>Content Security Policy</strong> header that forbids inline scripts, so even a missed hole cannot run injected code; Trusted Types in Chromium, which makes the browser refuse raw strings in <code>innerHTML</code>; and keeping tokens out of places scripts can read (Chapter 14).</p>

<h3>i18n: strings out of the components</h3>
${slide('rx-13', 24, 'i18n: every string in a dictionary; satisfies catches missing and mistyped keys')}
<p><strong>Internationalisation</strong> ("i18n": i, 18 letters, n) means preparing the app so languages can be added without rewriting components; <strong>localisation</strong> ("l10n") is the actual translating. Three things vary by language: <em>strings</em>, <em>formats</em> (dates, times, numbers, currency) and <em>grammar</em> (plurals, word order). The design for the clinic app:</p>
${SD.i18nEn}
<p>Step one: every visible string in the header, the doctor page tabs and the experience line moves into a dictionary. Vietnamese is the source; its keys become a TypeScript type; the English dictionary must match it exactly:</p>
${pre('ts', SN.tuDien)}
<p><code>satisfies</code> (TypeScript 4.9+) checks that a value matches a type <em>without</em> changing the value's own type. Forget a key or mistype one and the build fails — before a user sees <code>chiTiet.kinhNghiem.other</code> on screen:</p>
${out(OUT.tscTuDien)}
<p>Step two: functions that pick the right string and format numbers and times with <code>Intl</code>, plus a hook that binds them to the selected language (kept in a small persisted Zustand store, like the login in Chapter 7):</p>
${pre('ts', SN.dich)}
${pre('ts', SN.useDich)}
<p>Step three: components ask for strings instead of containing them. The header, including a VI/EN switch:</p>
${pre('tsx', SN.headerDung)}
<p>The <code>&lt;html lang&gt;</code> attribute lives outside the React tree, so syncing it is exactly what effects are for (Chapter 4): screen readers pick the right voice, browsers hyphenate correctly, and translation tools stop offering to translate an English page from Vietnamese.</p>
${pre('tsx', SN.langEffect)}
<p>And a test that clicks EN and checks header, tab, plural, <code>lang</code> and persistence:</p>
${pre('tsx', SN.ngonNguTest)}

<h3><code>Intl</code>: formats that follow the locale</h3>
${slide('rx-13', 25, 'Intl formats by locale and by the clinic time zone, not the machine')}
<p>JavaScript ships a full formatting library, <code>Intl</code>, backed by the ICU data inside the browser or Node. Measured with Node 22.21.0 (ICU 77.1):</p>
${out(OUT.intl)}
<ul>
<li><strong>Numbers:</strong> <code>5.000</code> in Vietnamese, <code>5,000</code> in English — the separators are swapped. Building "5.000" by hand breaks the moment the language changes.</li>
<li><strong>Plurals:</strong> <code>Intl.PluralRules</code> says English has <code>one</code> and <code>other</code> (1 year, 2 years), Vietnamese only <code>other</code>. Some languages have six categories; never write <code>n === 1 ? … : …</code>.</li>
<li><strong>Time zones:</strong> the last line is the trap. The same instant — 07:30 in Ho Chi Minh City — printed on a machine set to New York <em>without</em> <code>timeZone</code> becomes "20:30 30/9/26", the previous evening. A clinic's opening hours belong to the clinic, so <code>dinhDangGio</code> always passes <code>timeZone: 'Asia/Ho_Chi_Minh'</code>.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Trap — concatenating translated pieces.</strong> <code>t('co') + ' ' + so + ' ' + t('bacSi')</code> works in one language and breaks in the next, because word order and plural forms differ. Translate whole sentences with placeholders (<code>'{so} years of experience'</code>) and let the dictionary decide where the number goes.</div>
<p>Honest status: only the header, the doctor page tabs, the back link and the experience line are translated; specialty names ("Nội tổng quát") and the favourite button are still Vietnamese in the English screenshot. Real projects translate step by step, too — which is why the dictionary is typed: adding a key to <code>vi</code> immediately shows every place <code>en</code> must follow.</p>
<p>When the app grows, use a library instead of this hand-made version: <strong>react-i18next</strong> 17.0.15 (with i18next 26.4.2) or <strong>react-intl</strong> 12.1.3 (FormatJS) — versions from npm on 26/09/2026. They add ICU message syntax (plurals and selects inside the sentence), loading languages on demand, extraction tools for translators, and right-to-left support. The concepts are the ones you just built.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202 strings are typed straight into JSX (often a mix of English and Vietnamese), dates are shown with <code>new Date().toLocaleDateString()</code> or a copied formatter, and HTML from data is either shown as text or pasted in with <code>dangerouslySetInnerHTML</code> without a second thought because the data is your own JSON. → At work, security reviews ask where every <code>dangerouslySetInnerHTML</code> gets its string, DOMPurify (or server-side sanitising plus CSP) is standard, user URLs are validated; strings live in translation files managed with a library (react-i18next, react-intl) and a translation platform, and all formatting goes through <code>Intl</code> with explicit time zones. · <em>Why:</em> in a course project nobody attacks you and nobody reads Japanese; in production both happen. The FER202 way is fine for an assignment — the habit to build now is "data stays data".</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "How does React protect against XSS, and where does that protection stop?"</p>
<p>React escapes every value rendered through JSX, so strings show as text; React 19 also blocks <code>javascript:</code> URLs in <code>href</code>. It stops at <code>dangerouslySetInnerHTML</code>, direct DOM access (<code>ref.current.innerHTML</code>), URLs with other dangerous schemes or unvalidated redirects, third-party scripts, and server-rendered HTML you inject yourself. Defences: sanitise with DOMPurify at the point of insertion using an allowlist, validate URLs by parsing, add a Content Security Policy.</p></div>
<div class="callout"><p><strong>Common interview question.</strong> "How would you add a second language to a React app?"</p>
<p>Move every user-facing string into per-language resources keyed by id (typed, so missing keys fail the build); use a library such as react-i18next or react-intl for lookup, interpolation, ICU plurals and lazy loading; format dates, numbers and currency with <code>Intl</code> and an explicit time zone; set <code>&lt;html lang&gt;</code>; never concatenate sentence fragments; persist the user's choice. Mention layout concerns: longer German strings, right-to-left languages.</p></div>

<h3>🛠 Keep building the project — step 4/4: safe HTML, VI/EN, final check</h3>
<div class="callout ok"><p><strong>Starting point:</strong> the project after 13.3.</p><ol>
<li><code>npm i dompurify</code>; write <code>src/shared/ui/HtmlAnToan.tsx</code> (allowlist) and its test; render the doctor introduction with it in <code>GioiThieuBacSi</code>, lazy-loaded from the feature's <code>index.ts</code>.</li>
<li>In <code>src/mocks/co-so-du-lieu.ts</code>, give bs-1 and bs-4 HTML introductions and add the <code>?doc=1</code> switch for bs-3.</li>
<li>Write <code>src/shared/logic/link-an-toan.ts</code> with the table test.</li>
<li>Create <code>src/shared/i18n/</code>: <code>tu-dien.ts</code> (vi + en with <code>satisfies</code>), <code>dich.ts</code>, <code>ngon-ngu-store.ts</code>, <code>useDich.ts</code>. Translate the header (with the VI/EN switch), the doctor page tabs and back link, and the experience line with plurals. Sync <code>&lt;html lang&gt;</code> in <code>KhungTrang</code>; reset the store in <code>src/test/setup.ts</code>.</li>
<li>Run everything.</li>
</ol>
<p><strong>Done when:</strong> <code>/bac-si/bs-3?doc=1&amp;tab=gioi-thieu</code> shows the paragraph and <code>window.__xss</code> is <code>undefined</code> in the console; clicking EN shows "12 years of experience" and <code>document.documentElement.lang === 'en'</code>, and survives F5; the final run matches:</p>
${out(OUT.cuoi)}</div>
<details><summary>Solution</summary>
<p>Every file is printed above as in the reference project. The two setup lines people forget, in <code>src/test/setup.ts</code> inside <code>afterEach</code>: <code>useNgonNguStore.setState(useNgonNguStore.getInitialState(), true)</code> and <code>document.documentElement.lang = 'vi'</code> — without them, one test that clicks EN leaves the next test in English. Build output of the final project:</p>
${out(OUT.build)}
</details>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> finish translating the doctor card and prove nothing is missing.</p><ol>
<li>Add keys for the four specialty names and for "♡ Thêm vào yêu thích" / "♥ Bỏ yêu thích"; use them in <code>ChiTietBacSi</code>.</li>
<li>Temporarily delete one of the new keys from <code>en</code> and run <code>npx tsc -b</code>; read the error; put it back.</li>
<li>Show the appointment date on the "Lịch hẹn" page with <code>Intl.DateTimeFormat(MA_VUNG[ngonNgu], { dateStyle: 'full', timeZone: 'Asia/Ho_Chi_Minh' })</code>.</li>
</ol><p><strong>Done when:</strong> <code>tsc</code> fails with TS1360 while a key is missing and passes after; with EN selected the card shows "Internal medicine" (or your wording) and the appointment shows "Thursday, October 1, 2026"; all tests still pass.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">XSS</span><span class="v">cross-site scripting — outside text interpreted as code on your page</span></div>
<div class="kv"><span class="k">escaping</span><span class="v">turning <code>&lt;</code> into <code>&amp;lt;</code> etc. so text stays text; React does it for every JSX value</span></div>
<div class="kv"><span class="k">sanitise</span><span class="v">reduce HTML to a safe subset before inserting it (DOMPurify)</span></div>
<div class="kv"><span class="k">allowlist</span><span class="v">list of what is permitted; everything else is removed (danh sách trắng)</span></div>
<div class="kv"><span class="k">CSP</span><span class="v">Content Security Policy — a header limiting which scripts may run</span></div>
<div class="kv"><span class="k">i18n / l10n</span><span class="v">preparing an app for many languages / translating it for one</span></div>
<div class="kv"><span class="k">locale</span><span class="v">language + region code (<code>vi-VN</code>, <code>en-US</code>) that decides formats</span></div>
<div class="kv"><span class="k"><code>satisfies</code></span><span class="v">TypeScript check that a value fits a type without widening it</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Data must stay data: React escapes everything in <code>{…}</code> — measured, the injected handler ran 0 times.</li>
<li><code>dangerouslySetInnerHTML</code> with an unsanitised string ran it (counter 1); DOMPurify with an allowlist, at the point of insertion, removed it and kept the formatting.</li>
<li>React 19 blocks <code>javascript:</code> in <code>href</code>; validate user URLs by parsing with <code>new URL</code> and an allowed-scheme list.</li>
<li>i18n: strings in typed dictionaries (<code>satisfies</code> catches missing keys), whole sentences with placeholders, plurals by <code>Intl.PluralRules</code>.</li>
<li><code>Intl</code> formats numbers, dates and times by locale; always pass <code>timeZone</code> for times that belong to a place — measured: New York turned 07:30 into 20:30 the day before.</li>
<li>Set <code>&lt;html lang&gt;</code>, persist the choice, and reach for react-i18next or react-intl when the app grows.</li>
</ul>

${LINK('https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html', '📘', 'react.dev — dangerouslySetInnerHTML', 'What it does and the warning that comes with it.')}
${LINK('https://github.com/cure53/DOMPurify', '🧼', 'DOMPurify', 'Configuration: ALLOWED_TAGS, ALLOWED_ATTR, hooks.')}
${LINK('https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html', '🛡️', 'OWASP — XSS Prevention Cheat Sheet', 'The defender’s checklist.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl', '🌍', 'MDN — Intl', 'DateTimeFormat, NumberFormat, PluralRules, RelativeTimeFormat.')}
${LINK_TRONG('/courses/nextjs', '▲', 'Learn next — Next.js course', 'Localised routes and server rendering after React.')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4</span>
<h2>HTML an toàn và quốc tế hoá cơ bản</h2>
<p class="lead">Hai yêu cầu tới cùng một tuần. Đội nội dung của phòng khám giờ viết phần giới thiệu mỗi bác sĩ trong một trình soạn thảo có định dạng — in đậm, gạch đầu dòng — và API trả về dưới dạng HTML. Và một bệnh viện đối tác muốn trang có tiếng Anh. Yêu cầu thứ nhất là câu hỏi bảo mật: làm sao hiển thị HTML không do mình viết mà không để ai đó chạy mã trong trình duyệt của người dùng? Yêu cầu thứ hai là câu hỏi kiến trúc: làm sao đưa chuỗi, ngày, số ra khỏi component để thêm một ngôn ngữ chỉ là đổi dữ liệu, không phải viết lại? Bài này trả lời cả hai trên app phòng khám, đo xem trình duyệt thật sự làm gì.</p>
<p>Điểm xuất phát: dự án sau 13.3. Thư viện mới: <code>dompurify</code> 3.4.16. Mọi thứ viết từ góc <strong>người phòng thủ</strong>: chuỗi "tấn công" dùng suốt bài chỉ tăng một bộ đếm vô hại <code>window.__xss</code>, để ta đo được mã lạ có chạy hay không. Phiên bản: React 19.3.0, Chromium 149, Node 22.21.0 với ICU 77.1 (dữ liệu đứng sau <code>Intl</code>).</p>

<h3>XSS trong một đoạn</h3>
<p><strong>Cross-site scripting (XSS)</strong> xảy ra khi chữ đến từ ngoài mã của bạn — một trường trong cơ sở dữ liệu, một tham số URL, một bình luận — bị trình duyệt hiểu thành HTML hay JavaScript trên trang của bạn. Mã chạy ở đó chạy <em>với tư cách trang của bạn</em>: đọc được thứ trang đang hiện, hành động thay người dùng đang đăng nhập, gửi dữ liệu đi nơi khác. Cách phòng thủ luôn cùng một ý: <strong>dữ liệu phải ở yên là dữ liệu</strong>. Chữ hiện ra là chữ; HTML từ ngoài được rút về một tập con an toàn đã biết trước khi chèn; URL được kiểm trước khi thành link.</p>
${SD.xssVi}

<h3>React làm gì cho bạn: thoát ký tự</h3>
${slide('rx-13', 21, 'Cùng một chuỗi bị chèn mã: React thoát ký tự, innerHTML thì chạy nó')}
<p>Để minh hoạ, API giả có thêm núm <code>?doc=1</code> thay phần giới thiệu của bác sĩ bs-3 bằng một chuỗi chứa thẻ ảnh có <code>onerror</code> tăng bộ đếm — hình dạng của một payload XSS thật, với phần thân vô hại:</p>
${pre('ts', SN.gioiThieuDoc)}
<p>Một trang nhỏ, <code>thu-xss.html</code>, hiển thị cùng chuỗi đó theo ba cách; một script mở từng bản trên Chromium, đợi ảnh hỏng tải xong, rồi đọc bộ đếm:</p>
${out(OUT.xssChromium)}
<ul>
<li><strong><code>{chuoi}</code> trong JSX (<code>?kieu=chu</code>)</strong> — React đổi <code>&lt;</code> thành <code>&amp;lt;</code> và các ký tự khác trước khi đụng vào DOM. Người dùng thấy thẻ dưới dạng chữ, không có <code>&lt;img&gt;</code> nào, handler không bao giờ chạy. Đây là mặc định cho <em>mọi thứ</em> bạn đặt giữa hai dấu ngoặc nhọn, nên một app React bình thường mặc định đã an toàn trước XSS.</li>
<li><strong><code>dangerouslySetInnerHTML</code> chưa lọc (<code>?kieu=tho</code>)</strong> — chuỗi đi thẳng vào <code>innerHTML</code>. Trình duyệt tạo một <code>&lt;img&gt;</code> thật, ảnh tải hỏng, và <strong>handler chạy</strong> (bộ đếm = 1). Cái tên dài chính là nhãn cảnh báo: tới đây React thôi bảo vệ bạn.</li>
<li><strong>Lọc bằng DOMPurify (<code>?kieu=loc</code>)</strong> — đoạn văn ở lại, <code>&lt;img&gt;</code> biến mất, bộ đếm 0.</li>
</ul>
<p>Cùng ba sự thật đó trong jsdom, dưới dạng test:</p>
${pre('tsx', SN.xssTest)}
${out(OUT.xssTest)}

<h3>Khi thật sự cần HTML: lọc bằng danh sách trắng</h3>
${slide('rx-13', 22, 'DOMPurify với danh sách trắng: giữ định dạng, gỡ mọi thứ chạy được')}
<p>Chữ in đậm và danh sách của đội nội dung phải hiện đúng định dạng, nên <code>{…}</code> không dùng được. Luật: <strong>không bao giờ đưa chuỗi chưa lọc vào <code>dangerouslySetInnerHTML</code></strong>, và lọc ngay tại chỗ chèn, để không đường mã nào khác bỏ qua được. DOMPurify phân tích HTML bằng chính bộ phân tích của trình duyệt (nên nó thấy đúng thứ trình duyệt sẽ thấy), gỡ mọi thứ nguy hiểm, và trả về một chuỗi an toàn. Ta còn đi xa hơn mặc định của nó bằng một <strong>danh sách trắng</strong> (allowlist): chỉ những thẻ và thuộc tính nội dung thật sự cần. Với cấu hình mặc định, DOMPurify đã gỡ handler — nhưng vẫn giữ ảnh, trỏ tới bất kỳ URL nào kẻ tấn công chọn:</p>
${out(OUT.purifyMacDinh)}
<p>Nội dung không bao giờ cần ảnh, nên danh sách trắng gỡ hẳn chúng:</p>
${pre('tsx', SN.htmlAnToan)}
${pre('ts', SN.htmlAnToanTest)}
${out(OUT.b4Test)}
<p>Danh sách trắng đã gỡ ảnh (cùng handler của nó), một <code>&lt;script&gt;</code>, một <code>style</code> nội tuyến vốn có thể phủ cả trang bằng một hộp đăng nhập giả, và <code>href</code> của một link <code>javascript:</code> — trong khi giữ <code>&lt;strong&gt;</code>, danh sách và một link https bình thường. <code>locHtml</code> là hàm thường nên test được không cần React, và dùng lại được ở máy chủ nếu backend viết bằng Node. Tab "Giới thiệu" giờ vẽ <code>&lt;HtmlAnToan html={bacSi.gioiThieu} /&gt;</code>; vì DOMPurify nặng ~28 kB, component của tab được tải lười (kỹ thuật của Bài 13.3) — chunk <code>GioiThieuBacSi-*.js</code> nặng 28,94 kB và chỉ tải khi có người mở tab đó.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — lọc ở chỗ khác.</strong> "Backend đã làm sạch lúc lưu rồi" và "ta lọc trong API client" đều hỏng vào ngày có đường mã thứ hai: một script nhập dữ liệu, một công cụ quản trị, một bản ghi cũ lưu trước khi có luật. Lọc tại chỗ chèn, lần nào cũng vậy. Làm sạch phía máy chủ là một lớp <em>thêm</em> rất tốt, không bao giờ là lớp duy nhất. Markdown cũng thế: thư viện markdown cho phép HTML thô chính là <code>dangerouslySetInnerHTML</code> thêm vài bước.</div>

<h3>Link: URL <code>javascript:</code> và đồng bọn</h3>
${slide('rx-13', 23, 'href="javascript:…": React 19 thay bằng một đoạn chỉ ném lỗi')}
<p>URL cũng là mã nếu giao thức của nó là <code>javascript:</code>. React 19.3 xử lý ca tệ nhất: test ở trên cho thấy <code>&lt;a href="javascript:alert(1)"&gt;</code> bị thay thành <code>javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')</code> — hàm <code>sanitizeURL</code> trong <code>react-dom</code>. Bấm vào link đó không gây hại gì. Nhưng React không chặn URL <code>data:</code>, không kiểm URL có phải URL không, và không giúp gì với <code>window.location = x</code> hay <code>ref.current.innerHTML = x</code>. Với link đến từ người dùng (website của bác sĩ, link trong góp ý), hãy tự kiểm giao thức:</p>
${pre('ts', SN.linkAnToan)}
${pre('ts', SN.linkAnToanTest)}
${out(OUT.linkTest)}
<p>Để ý <code>' JavaScript:alert(1)'</code> — một dấu cách đầu và chữ hoa lẫn thường. Kiểm tay kiểu <code>url.startsWith('javascript:')</code> lọt đúng ca này; phân tích bằng <code>new URL</code> thì nó được chuẩn hoá.</p>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Mở <code>/bac-si/bs-3?doc=1&amp;tab=gioi-thieu</code>. <code>datLaiDuLieu</code> của MSW gán cho bs-3 phần giới thiệu bị chèn mã.</li>
<li><code>TabsTheoUrl</code> chọn "Giới thiệu" → <code>Tabs.Panel</code> được gắn → chunk tải lười <code>GioiThieuBacSi</code> (có DOMPurify) được tải về.</li>
<li><code>use(layHua(…))</code> trả bác sĩ (đã được <code>HoSoBacSi</code> tải trước).</li>
<li><code>HtmlAnToan</code> gọi <code>locHtml</code>: DOMPurify phân tích chuỗi thành một tài liệu tách rời, duyệt qua, gỡ <code>&lt;img&gt;</code> (không có trong <code>ALLOWED_TAGS</code>), xuất ra <code>&lt;p&gt;Mụn trứng cá, viêm da cơ địa.&lt;/p&gt;</code>.</li>
<li>React gán chuỗi đó làm <code>innerHTML</code> của <code>div</code>. Không ảnh, không handler, <code>window.__xss</code> vẫn undefined.</li>
</ol>
${out(OUT.xssApp)}
<p>Những lớp khác một sản phẩm thật thêm vào (không dựng ở đây, nên không đo): header <strong>Content Security Policy</strong> cấm script nội tuyến, để lỡ có lỗ hổng sót thì mã chèn vào cũng không chạy; Trusted Types trên Chromium, bắt trình duyệt từ chối chuỗi thô gán vào <code>innerHTML</code>; và không để token ở chỗ script đọc được (Chương 14).</p>

<h3>i18n: đưa chuỗi ra khỏi component</h3>
${slide('rx-13', 24, 'i18n: mọi chuỗi vào từ điển, satisfies bắt khoá thiếu và khoá gõ sai')}
<p><strong>Quốc tế hoá</strong> ("i18n": chữ i, 18 chữ cái, chữ n) là chuẩn bị app để thêm ngôn ngữ mà không phải viết lại component; <strong>bản địa hoá</strong> ("l10n") là việc dịch thật. Ba thứ đổi theo ngôn ngữ: <em>chuỗi</em>, <em>định dạng</em> (ngày, giờ, số, tiền) và <em>ngữ pháp</em> (số nhiều, trật tự từ). Thiết kế cho app phòng khám:</p>
${SD.i18nVi}
<p>Bước một: mọi chuỗi nhìn thấy trên header, các tab trang bác sĩ và dòng kinh nghiệm dời vào một từ điển. Tiếng Việt là bản gốc; khoá của nó thành một kiểu TypeScript; từ điển tiếng Anh phải khớp đúng:</p>
${pre('ts', SN.tuDien)}
<p><code>satisfies</code> (TypeScript 4.9+) kiểm một giá trị có khớp một kiểu <em>mà không</em> đổi kiểu của chính giá trị đó. Quên một khoá hay gõ sai một khoá là build đỏ — trước khi người dùng thấy <code>chiTiet.kinhNghiem.other</code> trên màn hình:</p>
${out(OUT.tscTuDien)}
<p>Bước hai: các hàm chọn đúng chuỗi và định dạng số, giờ bằng <code>Intl</code>, cộng một hook gắn chúng với ngôn ngữ đang chọn (giữ trong một store Zustand nhỏ có persist, như đăng nhập ở Chương 7):</p>
${pre('ts', SN.dich)}
${pre('ts', SN.useDich)}
<p>Bước ba: component xin chuỗi thay vì chứa chuỗi. Header, kèm nút đổi VI/EN:</p>
${pre('tsx', SN.headerDung)}
<p>Thuộc tính <code>&lt;html lang&gt;</code> nằm ngoài cây React, nên đồng bộ nó đúng là việc của effect (Chương 4): trình đọc màn hình chọn đúng giọng, trình duyệt ngắt từ đúng, và công cụ dịch thôi mời dịch một trang tiếng Anh "từ tiếng Việt".</p>
${pre('tsx', SN.langEffect)}
<p>Và một test bấm EN rồi kiểm header, tab, số nhiều, <code>lang</code> và việc lưu lại:</p>
${pre('tsx', SN.ngonNguTest)}

<h3><code>Intl</code>: định dạng theo vùng</h3>
${slide('rx-13', 25, 'Intl định dạng theo vùng — và theo múi giờ phòng khám, không theo máy')}
<p>JavaScript có sẵn cả một thư viện định dạng, <code>Intl</code>, dựa trên dữ liệu ICU nằm trong trình duyệt hay Node. Đo bằng Node 22.21.0 (ICU 77.1):</p>
${out(OUT.intl)}
<ul>
<li><strong>Số:</strong> <code>5.000</code> ở tiếng Việt, <code>5,000</code> ở tiếng Anh — dấu phân cách đổi chỗ cho nhau. Tự ghép "5.000" bằng tay là hỏng ngay khi đổi ngôn ngữ.</li>
<li><strong>Số nhiều:</strong> <code>Intl.PluralRules</code> cho biết tiếng Anh có <code>one</code> và <code>other</code> (1 year, 2 years), tiếng Việt chỉ có <code>other</code>. Có ngôn ngữ có sáu loại; đừng bao giờ viết <code>n === 1 ? … : …</code>.</li>
<li><strong>Múi giờ:</strong> dòng cuối là cái bẫy. Cùng một thời điểm — 07:30 ở TP.HCM — in trên máy đặt giờ New York mà <em>không</em> có <code>timeZone</code> thành "20:30 30/9/26", tối hôm trước. Giờ mở cửa của phòng khám thuộc về phòng khám, nên <code>dinhDangGio</code> luôn truyền <code>timeZone: 'Asia/Ho_Chi_Minh'</code>.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Bẫy — ghép các mảnh đã dịch.</strong> <code>t('co') + ' ' + so + ' ' + t('bacSi')</code> chạy ở ngôn ngữ này và gãy ở ngôn ngữ kia, vì trật tự từ và dạng số nhiều khác nhau. Dịch nguyên câu có chỗ điền (<code>'{so} years of experience'</code>) và để từ điển quyết định con số nằm đâu.</div>
<p>Tình trạng thật: mới dịch header, các tab trang bác sĩ, link quay lại và dòng kinh nghiệm; tên chuyên khoa ("Nội tổng quát") và nút yêu thích vẫn là tiếng Việt trong ảnh chụp tiếng Anh. Dự án thật cũng dịch từng bước — chính vì vậy từ điển có kiểu: thêm một khoá vào <code>vi</code> là thấy ngay mọi chỗ <code>en</code> phải theo.</p>
<p>Khi app lớn lên, dùng thư viện thay cho bản tự làm này: <strong>react-i18next</strong> 17.0.15 (cùng i18next 26.4.2) hoặc <strong>react-intl</strong> 12.1.3 (FormatJS) — phiên bản trên npm ngày 26/09/2026. Chúng thêm cú pháp thông điệp ICU (số nhiều, lựa chọn ngay trong câu), tải ngôn ngữ theo nhu cầu, công cụ rút chuỗi cho người dịch, và hỗ trợ viết từ phải sang trái. Khái niệm thì đúng là những thứ bạn vừa dựng.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202 chuỗi gõ thẳng vào JSX (thường lẫn cả tiếng Anh và tiếng Việt), ngày hiện bằng <code>new Date().toLocaleDateString()</code> hay một hàm định dạng chép ở đâu đó, và HTML trong dữ liệu thì hoặc hiện dạng chữ, hoặc dán vào bằng <code>dangerouslySetInnerHTML</code> không nghĩ ngợi vì dữ liệu là file JSON của chính bạn. → Đi làm, buổi review bảo mật hỏi mọi <code>dangerouslySetInnerHTML</code> lấy chuỗi từ đâu, DOMPurify (hoặc làm sạch phía máy chủ cộng CSP) là chuẩn, URL của người dùng được kiểm; chuỗi nằm trong file dịch quản lý bằng thư viện (react-i18next, react-intl) và một nền tảng dịch, mọi định dạng đi qua <code>Intl</code> với múi giờ ghi rõ. · <em>Vì sao:</em> trong đồ án không ai tấn công bạn và không ai đọc tiếng Nhật; trên production cả hai đều xảy ra. Cách FER202 ổn cho bài tập — thói quen cần tập từ giờ là "dữ liệu ở yên là dữ liệu".</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "React bảo vệ trước XSS thế nào, và sự bảo vệ đó dừng ở đâu?"</p>
<p>React thoát ký tự mọi giá trị vẽ qua JSX, nên chuỗi hiện ra là chữ; React 19 còn chặn URL <code>javascript:</code> trong <code>href</code>. Nó dừng ở <code>dangerouslySetInnerHTML</code>, truy cập DOM trực tiếp (<code>ref.current.innerHTML</code>), URL có giao thức nguy hiểm khác hay chuyển hướng không kiểm, script bên thứ ba, và HTML render phía máy chủ mà bạn tự chèn. Phòng thủ: lọc bằng DOMPurify ngay tại chỗ chèn với danh sách trắng, kiểm URL bằng cách phân tích, thêm Content Security Policy.</p></div>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Bạn thêm ngôn ngữ thứ hai cho một app React thế nào?"</p>
<p>Dời mọi chuỗi người dùng thấy vào tài nguyên theo từng ngôn ngữ, đánh khoá (có kiểu, để thiếu khoá thì build đỏ); dùng thư viện như react-i18next hay react-intl để tra cứu, điền biến, số nhiều theo ICU và tải lười; định dạng ngày, số, tiền bằng <code>Intl</code> với múi giờ ghi rõ; đặt <code>&lt;html lang&gt;</code>; không bao giờ ghép các mảnh câu; lưu lựa chọn của người dùng. Nhắc thêm chuyện bố cục: chuỗi tiếng Đức dài hơn, ngôn ngữ viết từ phải sang trái.</p></div>

<h3>🛠 Tự gõ tiếp dự án — bước 4/4: HTML an toàn, VI/EN, kiểm cuối</h3>
<div class="callout ok"><p><strong>Điểm xuất phát:</strong> dự án sau 13.3.</p><ol>
<li><code>npm i dompurify</code>; viết <code>src/shared/ui/HtmlAnToan.tsx</code> (danh sách trắng) và test của nó; vẽ phần giới thiệu bác sĩ bằng nó trong <code>GioiThieuBacSi</code>, tải lười từ <code>index.ts</code> của tính năng.</li>
<li>Trong <code>src/mocks/co-so-du-lieu.ts</code>, cho bs-1 và bs-4 phần giới thiệu dạng HTML và thêm núm <code>?doc=1</code> cho bs-3.</li>
<li>Viết <code>src/shared/logic/link-an-toan.ts</code> cùng test dạng bảng.</li>
<li>Tạo <code>src/shared/i18n/</code>: <code>tu-dien.ts</code> (vi + en có <code>satisfies</code>), <code>dich.ts</code>, <code>ngon-ngu-store.ts</code>, <code>useDich.ts</code>. Dịch header (kèm nút VI/EN), các tab và link quay lại ở trang bác sĩ, dòng kinh nghiệm có số nhiều. Đồng bộ <code>&lt;html lang&gt;</code> trong <code>KhungTrang</code>; đặt lại store trong <code>src/test/setup.ts</code>.</li>
<li>Chạy toàn bộ.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>/bac-si/bs-3?doc=1&amp;tab=gioi-thieu</code> hiện đoạn văn và <code>window.__xss</code> là <code>undefined</code> trong console; bấm EN thấy "12 years of experience" và <code>document.documentElement.lang === 'en'</code>, còn nguyên sau F5; lần chạy cuối khớp:</p>
${out(OUT.cuoi)}</div>
<details><summary>Lời giải</summary>
<p>Mọi file đã in ở trên đúng như dự án mẫu. Hai dòng setup hay quên, trong <code>afterEach</code> của <code>src/test/setup.ts</code>: <code>useNgonNguStore.setState(useNgonNguStore.getInitialState(), true)</code> và <code>document.documentElement.lang = 'vi'</code> — thiếu chúng, một test bấm EN sẽ để test sau chạy bằng tiếng Anh. Output build của dự án cuối:</p>
${out(OUT.build)}
</details>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề:</strong> dịch nốt thẻ bác sĩ và chứng minh không sót khoá nào.</p><ol>
<li>Thêm khoá cho bốn tên chuyên khoa và cho "♡ Thêm vào yêu thích" / "♥ Bỏ yêu thích"; dùng chúng trong <code>ChiTietBacSi</code>.</li>
<li>Tạm xoá một khoá mới khỏi <code>en</code> rồi chạy <code>npx tsc -b</code>; đọc lỗi; trả lại khoá.</li>
<li>Hiện ngày hẹn ở trang "Lịch hẹn" bằng <code>Intl.DateTimeFormat(MA_VUNG[ngonNgu], { dateStyle: 'full', timeZone: 'Asia/Ho_Chi_Minh' })</code>.</li>
</ol><p><strong>Đạt khi:</strong> <code>tsc</code> đỏ với TS1360 khi thiếu khoá và xanh sau khi trả lại; chọn EN thì thẻ hiện "Internal medicine" (hoặc cách dịch của bạn) và lịch hẹn hiện "Thursday, October 1, 2026"; mọi test vẫn xanh.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">XSS</span><span class="v">cross-site scripting — chữ từ ngoài bị hiểu thành mã trên trang của bạn</span></div>
<div class="kv"><span class="k">escaping</span><span class="v">thoát ký tự: đổi <code>&lt;</code> thành <code>&amp;lt;</code>… để chữ ở yên là chữ; React làm cho mọi giá trị JSX</span></div>
<div class="kv"><span class="k">sanitize</span><span class="v">lọc: rút HTML về một tập con an toàn trước khi chèn (DOMPurify)</span></div>
<div class="kv"><span class="k">allowlist</span><span class="v">danh sách trắng: chỉ liệt kê cái được phép, còn lại gỡ hết</span></div>
<div class="kv"><span class="k">CSP</span><span class="v">Content Security Policy — header giới hạn script nào được chạy</span></div>
<div class="kv"><span class="k">i18n / l10n</span><span class="v">quốc tế hoá (chuẩn bị cho nhiều ngôn ngữ) / bản địa hoá (dịch cho một ngôn ngữ)</span></div>
<div class="kv"><span class="k">locale</span><span class="v">mã ngôn ngữ + vùng (<code>vi-VN</code>, <code>en-US</code>) quyết định định dạng</span></div>
<div class="kv"><span class="k"><code>satisfies</code></span><span class="v">phép kiểm của TypeScript: giá trị khớp kiểu mà không bị nới kiểu</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dữ liệu ở yên là dữ liệu: React thoát ký tự mọi thứ trong <code>{…}</code> — đo thật, handler bị chèn chạy 0 lần.</li>
<li><code>dangerouslySetInnerHTML</code> với chuỗi chưa lọc làm nó chạy (bộ đếm 1); DOMPurify với danh sách trắng, ngay tại chỗ chèn, gỡ nó và giữ định dạng.</li>
<li>React 19 chặn <code>javascript:</code> trong <code>href</code>; URL của người dùng thì kiểm bằng <code>new URL</code> và danh sách giao thức cho phép.</li>
<li>i18n: chuỗi trong từ điển có kiểu (<code>satisfies</code> bắt khoá thiếu), dịch nguyên câu có chỗ điền, số nhiều theo <code>Intl.PluralRules</code>.</li>
<li><code>Intl</code> định dạng số, ngày, giờ theo vùng; giờ thuộc về một nơi thì luôn truyền <code>timeZone</code> — đo thật: máy ở New York biến 07:30 thành 20:30 hôm trước.</li>
<li>Đặt <code>&lt;html lang&gt;</code>, lưu lựa chọn, và chuyển sang react-i18next hay react-intl khi app lớn lên.</li>
</ul>

${LINK('https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html', '📘', 'react.dev — dangerouslySetInnerHTML', 'Nó làm gì và lời cảnh báo đi kèm.')}
${LINK('https://github.com/cure53/DOMPurify', '🧼', 'DOMPurify', 'Cấu hình: ALLOWED_TAGS, ALLOWED_ATTR, hook.')}
${LINK('https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html', '🛡️', 'OWASP — XSS Prevention Cheat Sheet', 'Checklist của người phòng thủ.')}
${LINK('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl', '🌍', 'MDN — Intl', 'DateTimeFormat, NumberFormat, PluralRules, RelativeTimeFormat.')}
${LINK_TRONG('/courses/nextjs', '▲', 'Học tiếp — Khoá Next.js', 'Route theo ngôn ngữ và render phía máy chủ sau React.')}
</div>
`,
};

const Q = {
    title: '13.5 — Chapter 13 quiz|||13.5 — Kiểm tra Chương 13',
    slug: 'rx-13-5-kiem-tra',
    type: 'QUIZ',
    isFreePreview: true,
    description: 'Mười câu tình huống lấy từ chính các lần refactor và đo của Chương 13: compound và cloneElement, combobox headless, as đa hình, hook chép state, union phân biệt, va chạm CSS, danh sách ảo và React Compiler, DOMPurify, Intl và múi giờ — mỗi câu có giải thích.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Quiz</span>
<h2>Chapter 13 quiz</h2>
<p class="lead">Ten situations taken from refactoring and measuring the clinic app in this chapter. Most questions show what happened and ask why, or what the screen, the test or the compiler says. 15 minutes.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can build a compound component on context, with controlled and uncontrolled modes, and explain why <code>cloneElement</code> is fragile.</li>
<li>I can write a headless hook that returns prop getters and keeps focus in the input with <code>aria-activedescendant</code>.</li>
<li>I can type a polymorphic <code>as</code> prop with <code>ComponentPropsWithRef</code> and prove it with a type test.</li>
<li>I can spot a hook that copies derived state with an effect, and design a hook that returns a discriminated union.</li>
<li>I can explain a global CSS collision and choose between CSS Modules and Tailwind with measurements.</li>
<li>I can measure a long list, virtualise it, explain its costs, and show HTML from outside safely in two languages.</li>
</ul>
${slide('rx-13', 27, 'Chapter 13 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Kiểm tra</span>
<h2>Kiểm tra Chương 13</h2>
<p class="lead">Mười tình huống lấy từ việc refactor và đo app phòng khám trong chương này. Phần lớn câu hỏi kể chuyện đã xảy ra và hỏi vì sao, hoặc màn hình, test hay trình biên dịch báo gì. 15 phút.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi dựng được compound component trên context, có chế độ điều khiển và không điều khiển, và giải thích được vì sao <code>cloneElement</code> mong manh.</li>
<li>Tôi viết được hook headless trả prop getter, giữ focus ở ô gõ bằng <code>aria-activedescendant</code>.</li>
<li>Tôi đặt kiểu được cho prop <code>as</code> đa hình bằng <code>ComponentPropsWithRef</code> và chứng minh bằng một test kiểu.</li>
<li>Tôi nhận ra hook chép state dẫn xuất bằng effect, và thiết kế được hook trả union phân biệt.</li>
<li>Tôi giải thích được va chạm CSS toàn cục và chọn giữa CSS Modules với Tailwind bằng số đo.</li>
<li>Tôi đo được một danh sách dài, virtualize nó, nói được cái giá, và hiển thị HTML từ ngoài một cách an toàn bằng hai ngôn ngữ.</li>
</ul>
${slide('rx-13', 27, 'Bảng tra nhanh Chương 13')}
</div>
`,
    quiz: {
      timeLimitSeconds: 900,
      questions: [
        {
          question: "A Tabs component injects props into its children with Children.map + cloneElement. A teammate wraps Tab B in <span title=\"Mới\"> to get a tooltip. What happens when a user clicks B?|||Một Tabs \"bơm\" prop vào con bằng Children.map + cloneElement. Đồng nghiệp bọc Tab B trong <span title=\"Mới\"> để có tooltip. Người dùng bấm B thì sao?",
          options: [
            "React throws \"cloneElement expects a valid element\" and the page shows the error boundary|||React ném lỗi \"cloneElement expects a valid element\" và trang hiện error boundary",
            "Nothing: B never receives its props, stays unselected, and no error or warning appears|||Không có gì: B không bao giờ nhận prop, vẫn không được chọn, không lỗi cũng không cảnh báo",
            "B becomes selected, because cloneElement walks the whole subtree|||B được chọn, vì cloneElement duyệt cả cây con",
            "Both A and B become selected until the next render|||Cả A và B cùng được chọn tới lần render sau",
          ],
          correctIndex: 1,
          points: 1,
          explanation: "EN: Children.map only sees direct children; the parent finds a span, not a TabCu, so it injects nothing (measured: after clicking B, aria-selected of A = true, of B = false). There is no error — which is exactly why it is dangerous. cloneElement does not walk the subtree (option C). The context-based Tabs passes the same scenario because any piece reads the context at any depth.|||VI: Children.map chỉ thấy con trực tiếp; cha gặp một span chứ không phải TabCu, nên không bơm gì (đo thật: bấm B xong, aria-selected của A = true, của B = false). Không có lỗi nào — chính vì vậy mới nguy hiểm. cloneElement không duyệt cây con (phương án C). Bản Tabs dùng context qua được đúng tình huống này vì mảnh nào cũng đọc được context ở mọi độ sâu.",
        },
        {
          question: "In the headless useCombobox, pressing ↓ highlights a suggestion. Why does the hook set aria-activedescendant on the input instead of calling focus() on the option?|||Trong useCombobox (headless), bấm ↓ làm sáng một gợi ý. Vì sao hook đặt aria-activedescendant trên ô gõ thay vì gọi focus() lên mục gợi ý?",
          options: [
            "Because <li> elements cannot receive focus in any browser|||Vì thẻ <li> không nhận focus được ở trình duyệt nào",
            "Because focus() would trigger a re-render of the whole list|||Vì focus() sẽ làm cả danh sách vẽ lại",
            "So focus stays in the input: the user keeps typing while assistive technology announces the active option|||Để focus ở lại ô gõ: người dùng gõ tiếp được trong khi công nghệ hỗ trợ vẫn đọc mục đang sáng",
            "Because React 19 forbids calling focus() inside event handlers|||Vì React 19 cấm gọi focus() trong event handler",
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: The APG combobox pattern keeps DOM focus on the input and points to the active option with aria-activedescendant (its id), so typing continues and screen readers still read the option; the test checks that the input still has focus after ↓ ↓. An <li> can be focused with tabIndex (A is false); focus() does not re-render anything (B); React has no such rule (D).|||VI: Mẫu combobox của APG giữ focus DOM ở ô gõ và trỏ tới mục đang sáng bằng aria-activedescendant (id của mục), nên gõ tiếp được mà trình đọc màn hình vẫn đọc mục đó; test kiểm ô gõ vẫn giữ focus sau ↓ ↓. <li> focus được nếu có tabIndex (A sai); focus() không làm vẽ lại gì (B); React không có luật đó (D).",
        },
        {
          question: "Nut is typed as NutProps<C> = PropRieng<C> & Omit<ComponentPropsWithRef<C>, keyof PropRieng<C>>, default C = 'button'. What does npx tsc -b say about <Nut to=\"/bac-si\">Xem</Nut>?|||Nut có kiểu NutProps<C> = PropRieng<C> & Omit<ComponentPropsWithRef<C>, keyof PropRieng<C>>, mặc định C = 'button'. npx tsc -b nói gì về <Nut to=\"/bac-si\">Xem</Nut>?",
          options: [
            "Error TS2322: property 'to' does not exist on the button props|||Lỗi TS2322: prop 'to' không tồn tại trong bộ prop của button",
            "Nothing: 'to' is passed through and React Router handles it|||Không gì cả: 'to' được chuyển tiếp và React Router lo",
            "A warning at runtime only: \"Unknown prop to on <button>\"|||Chỉ một cảnh báo lúc chạy: \"Unknown prop to on <button>\"",
            "Error TS2741: property 'href' is missing|||Lỗi TS2741: thiếu prop 'href'",
          ],
          correctIndex: 0,
          points: 1,
          explanation: "EN: Without as, C is 'button', so the allowed props are the button's; 'to' is not among them — the real output was TS2322: Property 'to' does not exist on the type built from the button props. Option B describes the naive version typed with [prop: string]: any, which compiles and renders <button to=…> that goes nowhere. Nothing requires href (D).|||VI: Không có as thì C là 'button', bộ prop hợp lệ là của button; 'to' không có trong đó — output thật là TS2322: Property 'to' does not exist trên kiểu dựng từ bộ prop của button. Phương án B là bản ngây thơ gõ kiểu [prop: string]: any, biên dịch được và vẽ ra <button to=…> bấm không đi đâu. Không gì bắt buộc href (D).",
        },
        {
          question: "useLocXau keeps the filtered list in useState and updates it in useEffect([ds, ck, q]). A test records every value it returns while q goes from \"\" to \"vy\". What was recorded?|||useLocXau giữ danh sách đã lọc trong useState và cập nhật nó trong useEffect([ds, ck, q]). Một test ghi mọi giá trị nó trả về khi q đi từ \"\" tới \"vy\". Test ghi được gì?",
          options: [
            "2 renders: 6 doctors, then 1 doctor|||2 lần render: 6 bác sĩ, rồi 1 bác sĩ",
            "3 renders, all returning 1 doctor after the first|||3 lần render, sau lần đầu đều trả 1 bác sĩ",
            "An infinite loop, because the effect sets state|||Vòng lặp vô hạn, vì effect đặt state",
            "4 renders; the first render with q = \"vy\" still returned 6 doctors|||4 lần render; lần render đầu với q = \"vy\" vẫn trả 6 bác sĩ",
          ],
          correctIndex: 3,
          points: 1,
          explanation: "EN: Measured: q=\"\" → 6 | q=\"\" → 6 | q=\"vy\" → 6 | q=\"vy\" → 1. The effect runs after the render with the new q, so that render still shows the stale copy; then setDaLoc causes one more render. Option A is the good version (compute in render). No infinite loop (C): the dependencies stop changing after one update.|||VI: Đo thật: q=\"\" → 6 | q=\"\" → 6 | q=\"vy\" → 6 | q=\"vy\" → 1. Effect chạy SAU lần render có q mới, nên lần render đó vẫn hiện bản sao cũ; rồi setDaLoc kéo thêm một lần render. Phương án A là bản tốt (tính trong render). Không lặp vô hạn (C): phụ thuộc thôi đổi sau một lần cập nhật.",
        },
        {
          question: "useBacSiDaLoc returns a union discriminated by trangThai: 'dang-tai' | 'loi' | 'co-du-lieu'. A developer writes const kq = useBacSiDaLoc(boLoc); return <DanhSach ds={kq.daLoc} />; with no check. What happens?|||useBacSiDaLoc trả một union phân biệt bằng trangThai: 'dang-tai' | 'loi' | 'co-du-lieu'. Một lập trình viên viết const kq = useBacSiDaLoc(boLoc); return <DanhSach ds={kq.daLoc} />; không kiểm gì. Chuyện gì xảy ra?",
          options: [
            "It compiles; while loading, ds is undefined and the list crashes|||Biên dịch được; lúc đang tải ds là undefined và danh sách vỡ",
            "TypeScript reports an error: daLoc does not exist on the 'dang-tai' and 'loi' members|||TypeScript báo lỗi: daLoc không tồn tại ở nhánh 'dang-tai' và 'loi'",
            "It compiles and shows an empty list while loading|||Biên dịch được và hiện danh sách rỗng lúc đang tải",
            "React throws \"Rendered fewer hooks than expected\"|||React ném lỗi \"Rendered fewer hooks than expected\"",
          ],
          correctIndex: 1,
          points: 1,
          explanation: "EN: On a union, a property is only accessible if it exists on every member, or after narrowing (if (kq.trangThai === 'co-du-lieu')). That is the point of the design: the mistake becomes a compile error instead of an undefined at runtime (A would be true for an object with optional fields). Hooks order is unaffected (D).|||VI: Với union, một thuộc tính chỉ đọc được nếu nó có ở mọi nhánh, hoặc sau khi thu hẹp (if (kq.trangThai === 'co-du-lieu')). Đó chính là mục đích thiết kế: lỗi thành lỗi biên dịch thay vì undefined lúc chạy (A chỉ đúng với object có trường tuỳ chọn). Thứ tự hook không liên quan (D).",
        },
        {
          question: "Chromium measured .hang-nut on the doctor card: align-items center; on the reschedule page: gap 8px (14px intended) and margin-top 10px. Two global CSS files define .hang-nut. Which fix removes the cause?|||Chromium đo .hang-nut trên thẻ bác sĩ: align-items center; trên trang đổi giờ: gap 8px (muốn 14px) và margin-top 10px. Hai file CSS toàn cục cùng định nghĩa .hang-nut. Cách sửa nào gỡ tận gốc?",
          options: [
            "Swap the import order of index.css and app.css in main.tsx|||Đổi thứ tự import index.css và app.css trong main.tsx",
            "Add .trang-doi-gio .hang-nut { gap: 14px !important }|||Thêm .trang-doi-gio .hang-nut { gap: 14px !important }",
            "Move the reschedule page's rule into TrangDoiGio.module.css and use className={css.hangNut}|||Dời luật của trang đổi giờ vào TrangDoiGio.module.css và dùng className={css.hangNut}",
            "Rename the class to .hang-nut-2 in both files|||Đổi tên lớp thành .hang-nut-2 ở cả hai file",
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: The cause is one global name used by two unrelated pages. A CSS Module gives the class a unique build-time name (_hangNut_1xsw0_3), so no other rule can match it — measured after the change: card gap 8px align normal, reschedule gap 14px margin 0. Swapping imports (A) just moves the damage to the other page; a more specific selector with !important (B) starts an arms race; renaming both (D) keeps them colliding under a new name.|||VI: Gốc rễ là một tên toàn cục dùng cho hai trang không liên quan. CSS Module cho lớp một tên duy nhất lúc build (_hangNut_1xsw0_3), nên không luật nào khác khớp được — đo sau khi sửa: thẻ gap 8px align normal, trang đổi giờ gap 14px margin 0. Đổi thứ tự import (A) chỉ dời thiệt hại sang trang kia; bộ chọn cụ thể hơn kèm !important (B) mở màn chạy đua; đổi tên ở cả hai file (D) vẫn đụng nhau dưới tên mới.",
        },
        {
          question: "/bac-si with 5,000 doctors drawn in full was measured at 4× CPU slowdown. Which statement matches the measurement?|||/bac-si với 5.000 bác sĩ vẽ đủ được đo ở CPU chậm 4×. Câu nào khớp với số đo?",
          options: [
            "Opening took 2,770 ms with a 521 ms commit, but scrolling had no frame over 50 ms|||Mở trang mất 2.770 ms với một commit 521 ms, nhưng cuộn không có khung hình nào quá 50 ms",
            "Scrolling dropped hundreds of frames; opening was fast|||Cuộn rơi hàng trăm khung hình; mở trang thì nhanh",
            "Everything was under 100 ms because TheBacSi is wrapped in memo|||Mọi thứ dưới 100 ms vì TheBacSi đã bọc memo",
            "The browser refused to create more than 32,768 DOM nodes|||Trình duyệt từ chối tạo quá 32.768 nút DOM",
          ],
          correctIndex: 0,
          points: 1,
          explanation: "EN: The real bottleneck was creating 37,715 nodes (open 2,770 ms, clear search 2,496 ms), while scrolling a static page stayed smooth (longest frame 26 ms). That changes which fixes help: virtualisation targets creation cost and memory, not scroll jank. memo (C) only skips re-renders, it does not make the first 5,000 renders free. There is no node limit (D).|||VI: Nút thắt thật là tạo 37.715 nút (mở 2.770 ms, xoá ô tìm 2.496 ms), còn cuộn một trang tĩnh vẫn mượt (khung dài nhất 26 ms). Điều đó quyết định cách sửa nào có ích: virtualization nhắm vào chi phí tạo và bộ nhớ, không phải cuộn giật. memo (C) chỉ bỏ qua lần vẽ lại, không làm 5.000 lần vẽ đầu miễn phí. Không có giới hạn số nút (D).",
        },
        {
          question: "With React Compiler on, the virtual list showed the same 16 cards forever: mid page, 0 cards inside the viewport. What was the cause and the fix used?|||Bật React Compiler, danh sách ảo hiện mãi 16 thẻ đầu: giữa trang, 0 thẻ trong khung nhìn. Nguyên nhân và cách sửa đã dùng là gì?",
          options: [
            "overscan was 0; set overscan: 4|||overscan bằng 0; đặt overscan: 4",
            "estimateSize was wrong; measure every row with measureElement|||estimateSize sai; đo từng hàng bằng measureElement",
            "The virtualiser object never changes identity, so the compiler reused old getVirtualItems() results; add 'use no memo' to that component|||Object virtualizer không bao giờ đổi danh tính, nên compiler dùng lại kết quả getVirtualItems() cũ; thêm 'use no memo' vào đúng component đó",
            "useWindowVirtualizer only works without StrictMode; remove StrictMode|||useWindowVirtualizer chỉ chạy khi không có StrictMode; bỏ StrictMode",
          ],
          correctIndex: 2,
          points: 1,
          explanation: "EN: useWindowVirtualizer returns one long-lived object and mutates it on scroll; the compiler memoises on identity, sees the same object, and returns cached JSX. 'use no memo' opts only that function out (measured after: 30 articles mid page, 14 in view), and compiler.test.ts lists it as a deliberate skip. Overscan (A) and estimates (B) cause small gaps, not a frozen list; StrictMode (D) is unrelated.|||VI: useWindowVirtualizer trả một object sống lâu và tự sửa nó khi cuộn; compiler memo theo danh tính, thấy cùng object, nên trả JSX đã cache. 'use no memo' cho riêng hàm đó ra ngoài (đo sau khi sửa: 30 article giữa trang, 14 trong khung nhìn), và compiler.test.ts ghi nó vào danh sách bỏ qua có chủ đích. Overscan (A) và ước lượng (B) gây khoảng trống nhỏ, không làm danh sách đông cứng; StrictMode (D) không liên quan.",
        },
        {
          question: "The doctor introduction from the CMS is '<p>Mụn trứng cá…</p><img src=\"x\" onerror=\"…\">'. It is rendered with <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p','br','strong','em','ul','ol','li','a'], ALLOWED_ATTR: ['href'] }) }} />. What does the page contain?|||Phần giới thiệu bác sĩ từ CMS là '<p>Mụn trứng cá…</p><img src=\"x\" onerror=\"…\">'. Nó được vẽ bằng <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p','br','strong','em','ul','ol','li','a'], ALLOWED_ATTR: ['href'] }) }} />. Trang chứa gì?",
          options: [
            "The whole string as visible text, including the <img> tag|||Cả chuỗi dưới dạng chữ, kể cả thẻ <img>",
            "The paragraph and an <img> without onerror|||Đoạn văn và một <img> không có onerror",
            "Nothing: DOMPurify rejects the whole string when it finds a script|||Không gì cả: DOMPurify từ chối cả chuỗi khi thấy script",
            "Only <p>Mụn trứng cá…</p>; the handler never runs|||Chỉ còn <p>Mụn trứng cá…</p>; handler không bao giờ chạy",
          ],
          correctIndex: 3,
          points: 1,
          explanation: "EN: With the allowlist, img is not permitted, so the element is removed entirely — measured on the real page: .gioi-thieu = <p>Mụn trứng cá, viêm da cơ địa.</p>, window.__xss = undefined. Default DOMPurify settings would keep a harmless <img> and strip onerror (B), which is why the allowlist is stricter. Visible tags as text (A) is what {html} in JSX does. DOMPurify removes pieces, it does not reject the input (C).|||VI: Với danh sách trắng, img không được phép nên cả phần tử bị gỡ — đo trên trang thật: .gioi-thieu = <p>Mụn trứng cá, viêm da cơ địa.</p>, window.__xss = undefined. Cấu hình mặc định của DOMPurify sẽ giữ một <img> vô hại và gỡ onerror (B), vì vậy danh sách trắng chặt hơn. Thẻ hiện thành chữ (A) là việc {html} trong JSX làm. DOMPurify gỡ từng phần, không từ chối cả đầu vào (C).",
        },
        {
          question: "The clinic opens at 07:30 in Ho Chi Minh City. The code prints new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date('2026-10-01T07:30:00+07:00')) on a machine set to America/New_York. What is printed?|||Phòng khám mở cửa 07:30 giờ TP.HCM. Mã in new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date('2026-10-01T07:30:00+07:00')) trên máy đặt múi giờ America/New_York. In ra gì?",
          options: [
            "07:30 1/10/26 — vi-VN implies Vietnam's time zone|||07:30 1/10/26 — vi-VN ngầm hiểu múi giờ Việt Nam",
            "20:30 30/9/26 — the machine's time zone is used unless timeZone is given|||20:30 30/9/26 — dùng múi giờ của máy nếu không truyền timeZone",
            "7:30 AM 10/1/26 — the locale switches to American formats|||7:30 AM 10/1/26 — locale chuyển sang định dạng Mỹ",
            "An error: the date string has an offset|||Lỗi: chuỗi ngày có độ lệch múi giờ",
          ],
          correctIndex: 1,
          points: 1,
          explanation: "EN: A locale chooses the format (day/month order, 24-hour clock), not the time zone. Without timeZone, Intl uses the environment's zone: measured with TZ=America/New_York → \"20:30 30/9/26\", and with timeZone: 'Asia/Ho_Chi_Minh' → \"07:30 1/10/26\". Option A is the common misconception; C mixes up locale and zone; offsets in ISO strings are valid (D).|||VI: Locale chọn định dạng (thứ tự ngày/tháng, đồng hồ 24 giờ), không chọn múi giờ. Không có timeZone, Intl dùng múi giờ của môi trường: đo với TZ=America/New_York → \"20:30 30/9/26\", còn với timeZone: 'Asia/Ho_Chi_Minh' → \"07:30 1/10/26\". Phương án A là hiểu lầm hay gặp; C lẫn locale với múi giờ; độ lệch trong chuỗi ISO là hợp lệ (D).",
        },
      ],
    },
};

export default {
  title: 'Chapter 13 — Design patterns and architecture|||Chương 13 — Mẫu thiết kế & kiến trúc',
  description: 'Mẫu thiết kế và kiến trúc áp thẳng vào app đặt lịch: compound component và hook headless, nút đa hình "as" có kiểu đúng, custom hook tốt so với xấu (đo số lần render), CSS Modules so với Tailwind (đo bundle), danh sách 5000 bác sĩ virtualize bằng @tanstack/react-virtual (đo trước/sau trên Chromium), XSS với dangerouslySetInnerHTML + DOMPurify, và i18n Việt/Anh với Intl.',
  lessons: [L0, L1, L2, L3, L4, Q],
};
