/**
 * React · Deck rx-05 — Chương 5: Chia sẻ state.
 *
 * MỌI output trên slide là THẬT, chạy 25/09/2026 trên máy dựng bài, dự án thử SCRATCH/rx/du-an/ch05
 * (react 19.3.0 · vite 8.3.1 · vitest 5.0.1 · typescript 6.0.3 · zustand 5.0.15):
 *   npx vitest run src/vi-du --reporter=verbose   (bai1 · bai2 · bai3 · bai4 — 20 test)
 *   npx tsc -b (lỗi cố ý TS2322 never / TS2820 gõ sai type hành động)
 *   npx vitest run (KhuBacSi.test.tsx trước khi reset URL + store: 4 failed)
 *   node chromium.mjs (Playwright, Chromium thật: F5 trước/sau Chương 5, nút Back, persist, luồng 4 bước)
 * Ảnh chụp giao diện: scripts/slides-src/rx-anh/rx-05/*.jpg (Chromium thật qua Playwright)
 */
import {
  S, cover, cards, box, table, two, list, mindmap, term as rxTerm, yaml, sv, R, T, A, D, compTree, anh, kpis, bars, diagram,
} from './_rx-chung.mjs';

export const deck = { key: 'rx-05', code: 'REACT · CHƯƠNG 5', title: 'Chia sẻ state', sub: 'React · Chương 5' };

const t = (lines, title, fs = 15) => rxTerm(lines, { title, dir: '~/phong-kham', fs });
const chu = (s, c = D.mu) => `<div style="text-align:center;color:${c};font-size:16px;font-weight:700;margin-top:4px">${s}</div>`;

/* ───────── Slide 3 — prop drilling vs context ───────── */
const cayKhoan = () => compTree({
  w: 540, h: 360, bw: 210, root: { n: 'App', s: '● yeuThich', st: true, kids: [
    { n: 'KhuBacSi', s: 'chỉ chuyển tiếp', c: 'amb', kids: [
      { n: 'LuoiBacSi', s: 'chỉ chuyển tiếp', c: 'amb', kids: [
        { n: 'TheBacSi', s: 'DÙNG yeuThich, onDoi' },
      ] },
    ] },
  ] },
});
const cayContext = () => compTree({
  w: 540, h: 360, bw: 210, root: { n: 'YeuThichProvider', w: 250, s: '● yeuThich → value', st: true, kids: [
    { n: 'KhuBacSi', s: 'không prop nào', kids: [
      { n: 'LuoiBacSi', s: 'không prop nào', kids: [
        { n: 'TheBacSi', s: 'useYeuThich()' },
      ] },
    ] },
  ] },
});

/* ───────── Slide 6 — cơn bão render: mọi thẻ đọc context đều render lại ───────── */
const cayBao = () => compTree({
  w: 1100, h: 300, bw: 150, legend: true, root: { n: 'KhuDo', w: 260, s: '● tuKhoa · ● yeuThich', st: true, r: true, kids: [
    { n: 'input', w: 120, r: true, s: 'gõ phím' },
    { n: 'LuoiDo', w: 150, m: true, s: 'memo: bỏ qua', kids: [
      { n: 'TheDo', w: 110, r: true }, { n: 'TheDo', w: 110, r: true }, { n: 'TheDo', w: 110, r: true },
      { n: 'TheDo', w: 110, r: true }, { n: 'TheDo', w: 110, r: true }, { n: 'TheDo', w: 110, r: true },
    ] },
  ] },
});

/* ───────── Slide 9 — vòng dispatch → reducer ───────── */
const vongReducer = () => {
  let s = '';
  s += R(20, 40, 300, 140, { c: 'rx', fill: '#0f182a' }) + T(170, 80, 'Component', { fs: 20, b: true, a: 'middle' });
  s += T(170, 112, 'onClick={() =>', { fs: 15, mono: true, a: 'middle', c: 'mu' });
  s += T(170, 138, "dispatch({ type: 'chon-bac-si',", { fs: 13.5, mono: true, a: 'middle', c: 'amb' });
  s += T(170, 160, "bacSiId: 'bs-2' })}", { fs: 13.5, mono: true, a: 'middle', c: 'amb' });
  s += R(430, 20, 300, 180, { c: 'vio', fill: '#150f24' }) + T(580, 58, 'reducer(state, action)', { fs: 18, b: true, mono: true, a: 'middle', c: 'vio' });
  ['hàm THUẦN, ngoài component', 'switch (action.type)', 'trả về state MỚI', 'không gọi API, không sửa cũ'].forEach((x, i) => { s += T(580, 92 + i * 26, x, { fs: 15.5, a: 'middle', c: i === 1 ? '#e6edf3' : 'mu' }); });
  s += R(840, 40, 280, 140, { c: 'grn', fill: '#0c1c14' }) + T(980, 80, 'state mới', { fs: 20, b: true, a: 'middle', c: 'grn' });
  s += T(980, 112, '{ buoc: 2, bacSiId:', { fs: 14.5, mono: true, a: 'middle' });
  s += T(980, 136, "'bs-2', khungGioId: null }", { fs: 14.5, mono: true, a: 'middle' });
  s += A(322, 110, 426, 110, { c: 'amb' }) + T(374, 98, 'action', { fs: 14, a: 'middle', c: 'amb' });
  s += A(732, 110, 836, 110, { c: 'grn' });
  s += `<path d="M980 184 L980 250 L170 250 L170 186" stroke="${D.dim}" stroke-width="2.5" fill="none" stroke-dasharray="8 6" marker-end="url(#m-dim)"/>`;
  s += T(575, 276, 'React render lại component với state mới', { fs: 16, a: 'middle', c: 'mu' });
  return sv(1140, 290, s);
};

/* ───────── Slide 13 — store nằm ngoài cây ───────── */
const storeNgoai = () => diagram({
  w: 1160, h: 400,
  nodes: [
    { id: 'st', x: 420, y: 0, w: 320, h: 96, t: 'useDatLichStore', d: 'yeuThich · lichHen\ndoiYeuThich() · themLichHen()', c: 'grn' },
    { id: 'app', x: 470, y: 180, w: 220, h: 56, t: '<App />', c: 'dim' },
    { id: 'h', x: 20, y: 300, w: 250, h: 80, t: '<Header />', d: 's => s.lichHen.length', c: 'rx' },
    { id: 'k', x: 310, y: 300, w: 250, h: 80, t: '<KhuBacSi />', d: 's => s.yeuThich', c: 'rx' },
    { id: 'l', x: 600, y: 300, w: 250, h: 80, t: '<LuongDatLich />', d: 's => s.themLichHen', c: 'rx' },
    { id: 'c', x: 890, y: 300, w: 250, h: 80, t: '<LichHenCuaToi />', d: 's => s.lichHen', c: 'rx' },
  ],
  edges: [
    { from: 'app', to: 'h', c: 'dim', fs: 'b', ts: 't' }, { from: 'app', to: 'k', c: 'dim', fs: 'b', ts: 't' }, { from: 'app', to: 'l', c: 'dim', fs: 'b', ts: 't' }, { from: 'app', to: 'c', c: 'dim', fs: 'b', ts: 't' },
    { from: 'st', to: 'h', c: 'grn', dash: true, fs: 'l', ts: 't' }, { from: 'st', to: 'c', c: 'grn', dash: true, fs: 'r', ts: 't' },
  ],
});

/* ───────── Slide 21 — useBoLocUrl: một nguồn sự thật là URL ───────── */
const vongUrl = () => diagram({
  w: 1160, h: 330,
  nodes: [
    { id: 'u', x: 0, y: 110, w: 250, h: 90, t: 'URL', d: '?ck=nhi&q=vy', c: 'amb' },
    { id: 's', x: 330, y: 110, w: 240, h: 90, t: 'useState(search)', d: 'chỉ giữ CHUỖI', c: 'rx' },
    { id: 'b', x: 650, y: 110, w: 240, h: 90, t: 'docBoLoc(search)', d: 'tính trong render', c: 'vio' },
    { id: 'ui', x: 960, y: 110, w: 200, h: 90, t: 'Chip · ô tìm', d: 'danh sách lọc', c: 'grn' },
    { id: 'p', x: 330, y: 0, w: 240, h: 56, t: 'popstate (Back)', c: 'tea' },
    { id: 'd', x: 650, y: 262, w: 300, h: 60, t: 'datBoLoc(): push/replace', c: 'ora' },
  ],
  edges: [
    { from: 'u', to: 's' }, { from: 's', to: 'b' }, { from: 'b', to: 'ui' },
    { from: 'p', to: 's', c: 'tea', fs: 'b', ts: 't' },
    { from: 'ui', to: 'd', c: 'ora', fs: 'b', ts: 'r', t: 'onClick / onChange' },
    { from: 'd', to: 'u', c: 'ora', fs: 'l', ts: 'b', t: 'pushState / replaceState' },
  ],
});

export const slides = S([
  /* 1 */ cover({ t: 'Chương 5 — Chia sẻ state', sub: 'Context · useReducer · Zustand · URL là state', chap: 'CHƯƠNG 5' }),

  /* 2 */ { t: 'Bản đồ chương: mỗi loại state một chỗ ở', body: mindmap('Chia sẻ state', 'nhiều component, một dữ liệu — đặt nó ở đâu?', [
    { t: '5.1 Context', d: 'Provider · hook bọc · cơn bão render · tách context', c: 'rx' },
    { t: '5.2 useReducer', d: 'action · reducer thuần · never · StrictMode', c: 'vio' },
    { t: '5.3 Zustand', d: 'store · selector · useShallow · persist · test', c: 'grn' },
    { t: '5.4 URL là state', d: 'URLSearchParams · push/replace · Back · link', c: 'amb' },
    { t: '🛠 Dự án', d: 'luồng 4 bước · useDatLichStore · lọc trên URL', c: 'tea' },
  ]) },

  /* ───── 5.1 ───── */
  /* 3 */ { t: 'Prop drilling: dữ liệu đi qua những tầng không dùng tới', body: two(
    `${cayKhoan()}${chu('✗ Hai tầng giữa chỉ nhận rồi đưa tiếp', D.amb)}`,
    `${cayContext()}${chu('✓ Context: con cháu tự lấy, tầng giữa không biết gì', D.grn)}`) },

  /* 4 */ { t: 'Context: tạo một lần, cung cấp ở trên, đọc ở bất kỳ đâu bên dưới', body: two(
    yaml([
      ['const YeuThichContext =', '① tạo (ngoài component)'],
      ['  createContext<GiaTri | null>(null);', ''],
      ['', ''],
      ['function YeuThichProvider({ children }) {', '② cung cấp'],
      ['  const [yeuThich, setYeuThich] = useState([]);', ''],
      ['  …', ''],
      ['  return <YeuThichContext value={giaTri}>', 'React 19: không cần .Provider'],
      ['    {children}</YeuThichContext>;', ''],
      ['}', ''],
      ['', ''],
      ['const { yeuThich, doi } = useYeuThich();', '③ đọc (hook bọc useContext)'],
    ], { fs: 14.5 }),
    list([
      '<code>useContext</code> tìm <strong>Provider gần nhất phía trên</strong> và trả về <code>value</code> của nó.',
      'Không có Provider nào ⇒ trả về <strong>giá trị mặc định</strong> truyền cho <code>createContext</code>.',
      'Provider đổi <code>value</code> ⇒ React render lại <strong>mọi component đọc context đó</strong> bên dưới.',
      '<code>use(Context)</code> (React 19) đọc giống <code>useContext</code>, và gọi được cả trong <code>if</code>.',
    ])) },

  /* 5 */ { t: 'Mặc định null + hook bọc: quên Provider là thấy lỗi ngay', body: two(
    `${yaml([
      ['export function useYeuThich() {', ''],
      ['  const v = useContext(YeuThichContext);', ''],
      ['  if (v === null) throw new Error(', 'báo đúng chỗ sai'],
      ["    'useYeuThich() phải được gọi", ''],
      ["     bên trong <YeuThichProvider>');", ''],
      ['  return v;', 'từ đây v chắc chắn có'],
      ['}', ''],
    ], { fs: 15 })}
     ${t(['[quen provider] useYeuThich() phải được gọi bên trong <YeuThichProvider>'], 'vitest · bai1.test.tsx', 14)}`,
    `${box('bad', '<strong>Mặc định là object giả</strong> <code>{ yeuThich: [], doi: () =&gt; {} }</code>: quên Provider thì <em>không lỗi gì cả</em> — bấm ♡ hai lần, thẻ vẫn ♡.')}
     ${t(['[mac dinh gia] sau 2 click: ♡ BS. Nguyễn Minh An'], 'đo thật', 14.5)}
     ${box('tip', 'Bug im lặng tốn cả buổi chiều để tìm. Lỗi ném ra ngay lần render đầu thì tốn 10 giây.')}`) },

  /* 6 */ { t: 'value mới mỗi lần render ⇒ mọi thẻ đọc context đều render lại', body: `${cayBao()}
    ${two(
      bars([
        { l: 'value={{ … }} viết thẳng', sub: 'gõ "huy" (3 phím, không đụng yêu thích)', v: 18, txt: '+18 lần render thẻ', c: 'red' },
        { l: 'value bọc useMemo', sub: 'cùng 3 phím', v: 0.2, txt: '+0', c: 'grn' },
        { l: 'Bấm ♡ một thẻ', sub: 'cả hai cách', v: 6, txt: '+6 (cả 6 thẻ)', c: 'amb' },
      ], { lw: 280, max: 18 }),
      box('warn', '<code>memo</code> trên <code>LuoiDo</code> vẫn bỏ qua (render 1 lần) — nhưng <strong>context đi xuyên qua memo</strong>, tới thẳng từng thẻ đang đọc nó.'))}` },

  /* 7 */ { t: 'Tách context: chỉ gọi hành động thì không bị render lại', body: two(
    `${yaml([
      ['<DoiYeuThichContext value={doi}>', 'hàm ổn định (useCallback)'],
      ['  <DsYeuThichContext value={yeuThich}>', 'mảng — đổi thường xuyên'],
      ['    <ThanhCongCu />', 'chỉ đọc doi'],
      ['    <LuoiBacSi />', 'đọc cả hai'],
      ['  </DsYeuThichContext>', ''],
      ['</DoiYeuThichContext>', ''],
    ], { fs: 14.5 })}
     ${table(['2 lần bấm ♡', 'NutXoaHet render'], [
      ['Một context gộp', '-3 lần'],
      ['Tách, nhưng vẫn đọc cả danh sách', '-3 lần'],
      ['Tách, chỉ đọc hành động', '+1 lần (lúc mount)'],
    ], { sm: true })}`,
    cards([
      { ic: '✅', t: 'Context hợp', d: 'thứ ÍT đổi, nhiều nơi đọc: theme, ngôn ngữ, người đăng nhập, dispatch.', c: 'grn' },
      { ic: '⚠️', t: 'Context không hợp', d: 'thứ đổi theo từng phím / từng click mà nhiều component đọc.', c: 'amb' },
      { ic: '🧰', t: 'Khi đã đau', d: 'tách context → useMemo value → chuyển sang store có selector (5.3).', c: 'blu' },
    ], 1)) },

  /* ───── 5.2 ───── */
  /* 8 */ { t: 'Ba useState rời: đổi bác sĩ mà khung giờ của bác sĩ cũ vẫn ở lại', body: two(
    yaml([
      ['const [buoc, setBuoc] = useState(1);', ''],
      ['const [bacSiId, setBacSiId] = useState(null);', ''],
      ['const [khungGioId, setKhungGioId] = useState(null);', ''],
      ['', ''],
      ['// lối tắt thêm sau ở bước xác nhận:', ''],
      ["<button onClick={() => setBacSiId('bs-2')}>", 'quên setKhungGioId(null)'],
      ['  Đổi sang BS. Trần Thu Hà', ''],
      ['</button>', ''],
    ], { fs: 14.5 }),
    `${t(['[nhieu state] Xác nhận: BS. Trần Thu Hà —', '!   khung bs-1-kg-1 (08:00 · 01/10/2026)'], 'vitest · bai2.test.tsx', 15)}
     ${box('bad', 'Bác sĩ là <strong>BS. Hà</strong>, khung giờ là của <strong>BS. An</strong> (<code>bs-1-kg-1</code>). Không component nào lỗi — luật “đổi bác sĩ thì bỏ khung giờ” chỉ nằm trong đầu người viết, và handler mới quên nó.')}
     ${box('tip', 'Nhiều state <strong>phải đổi cùng nhau theo luật</strong> ⇒ gom luật về MỘT chỗ: reducer.')}`) },

  /* 9 */ { t: 'dispatch(action) → reducer(state, action) → state mới', body: `${vongReducer()}
    ${two(
      yaml([['const [state, dispatch] = useReducer(chonLichReducer, BAN_DAU);', '']], { fs: 15 }),
      t(['[reducer] sau khi doi:', '  08:00 · 01/10/2026 | 09:30 · 01/10/2026', '  14:00 · 01/10/2026 | Quay lại', '# về bước 2: phải chọn lại giờ'], 'cùng nút “Đổi sang BS. Hà” — bản reducer', 14))}` },

  /* 10 */ { t: 'Union hành động + never: quên một case là tsc báo ngay', body: two(
    yaml([
      ['type HanhDong =', ''],
      ["  | { type: 'chon-bac-si'; bacSiId: string }", ''],
      ["  | { type: 'chon-khung-gio'; khungGioId: string }", ''],
      ["  | { type: 'quay-lai' }", ''],
      ["  | { type: 'lam-lai' };", 'mới thêm'],
      ['', ''],
      ['switch (action.type) {', ''],
      ["  case 'chon-bac-si': …", 'TS biết action có bacSiId'],
      ['  …', ''],
      ['  default: {', ''],
      ['    const conSot: never = action;', 'hết case thì action là never'],
      ['    return conSot;', ''],
      ['  }', ''],
      ['}', ''],
    ], { fs: 14 }),
    `${t(['$ npx tsc -b', "! thieu-case.ts(18,13): error TS2322: Type", "!   '{ type: \"lam-lai\"; }'", "!   is not assignable to type 'never'.", "! thieu-case.ts(25,27): error TS2820: Type '\"chon-bac-sy\"'", "!   is not assignable to type '\"chon-bac-si\" | … '.", "!   Did you mean '\"chon-bac-si\"'?"], 'tsc 6.0.3 — hai lỗi cố ý', 13.5)}
     ${box('info', '<strong>Union phân biệt (discriminated union):</strong> nhiều kiểu object có chung một field <code>type</code> với giá trị khác nhau. <code>switch</code> theo <code>type</code> thì trong mỗi <code>case</code> TypeScript biết đúng hình dạng.')}`) },

  /* 11 */ { t: 'Reducer thuần: test không cần React, StrictMode bắt đột biến', body: two(
    `${t(['$ npx vitest run src/dat-lich --reporter=verbose', '+ ✓ đi đủ 4 bước', '+ ✓ đổi sang bác sĩ KHÁC ⇒ bỏ khung giờ cũ, giữ thông tin…', '+ ✓ chọn lại ĐÚNG bác sĩ cũ ⇒ giữ khung giờ đã chọn', '+ ✓ hành động sai thứ tự bị bỏ qua (trả CHÍNH state cũ)', '+ ✓ đang gửi thì khoá: quay lại / chọn bác sĩ đều bị bỏ qua', '+ ✓ không bao giờ sửa state cũ (đông cứng mà vẫn chạy)', '+ ✓ làm lại ⇒ về đúng trạng thái ban đầu', '      Tests  7 passed (7)'], 'reducer = hàm thường ⇒ test như hàm thường', 13.5)}`,
    `${yaml([
      ['// ✗ sửa mảng của state cũ', ''],
      ['state.lichSu.push(action.dong);', ''],
      ['return { lichSu: state.lichSu };', ''],
      ['// ✓ trả mảng mới', ''],
      ['return { lichSu: [...state.lichSu, action.dong] };', ''],
    ], { fs: 14 })}
     ${t(['[strict] 2 cu bam Ghi ⇒', '  dot bien:              Số dòng: 2', '! dot bien + StrictMode: Số dòng: 4', '+ thuan + StrictMode:    Số dòng: 2'], 'đo thật — StrictMode gọi reducer 2 lần (chỉ ở dev)', 14)}`) },

  /* 12 */ { t: 'useState hay useReducer: đếm luật, không đếm số biến', body: two(
    table(['', 'useState', 'useReducer'], [
      ['Lượng mã', 'ít', 'nhiều hơn (action + reducer)'],
      ['Đọc logic cập nhật', 'rải trong các handler', '+một chỗ, đọc từ trên xuống'],
      ['Nhiều giá trị đổi cùng nhau theo luật', '-dễ lệch nhau', '+luật nằm trong reducer'],
      ['Test logic', 'phải render component', '+gọi hàm thuần'],
      ['Gỡ lỗi', 'khó biết ai đổi', '+log mọi action'],
    ], { sm: true }),
    cards([
      { ic: '1️⃣', t: 'useState', d: 'một giá trị độc lập: ô nhập, bật/tắt, số đếm.', c: 'blu' },
      { ic: '🔀', t: 'useReducer', d: 'luồng nhiều bước, form nhiều trạng thái, đổi X thì phải đổi Y.', c: 'vio' },
      { ic: '📡', t: 'reducer + context', d: 'nhiều component sâu cần dispatch: đưa <code>dispatch</code> (ổn định) vào context.', c: 'grn' },
    ], 1)) },

  /* ───── 5.3 ───── */
  /* 13 */ { t: 'Store Zustand nằm ngoài cây component — ai cần thì tự lấy', body: storeNgoai() },

  /* 14 */ { t: 'create(): state và hành động sống chung trong một hook', body: two(
    yaml([
      ["import { create } from 'zustand';", 'zustand 5.0.15'],
      ['', ''],
      ['export const useYeuThichStore =', ''],
      ['  create<YeuThichState>()((set) => ({', 'set = hàm ghi của store'],
      ['    yeuThich: [],', 'state'],
      ['    doi: (id) => set((s) => ({', 'hành động'],
      ['      yeuThich: doiYeuThich(s.yeuThich, id),', 'vẫn phải bất biến'],
      ['    })),', ''],
      ['    xoaHet: () => set({ yeuThich: [] }),', 'set GỘP nông'],
      ['  }));', ''],
    ], { fs: 14.5 }),
    list([
      '<strong>Không Provider.</strong> Store là một biến của module — import là dùng, ở bất kỳ component nào.',
      '<code>set(obj)</code> <strong>gộp nông</strong> vào state cũ (khác <code>useState</code>: thay hẳn).',
      'Trong component: <code>useYeuThichStore((s) =&gt; s.yeuThich)</code> — hàm bên trong là <strong>selector</strong>.',
      'Ngoài React (hàm thường, test): <code>useYeuThichStore.getState().doi(\'bs-4\')</code>.',
    ])) },

  /* 15 */ { t: 'Selector hẹp: bấm ♡ một thẻ, chỉ thẻ đó render lại', body: two(
    bars([
      { l: 'Zustand, selector hẹp', sub: 's => s.yeuThich.includes(id)', v: 1, txt: '+1 thẻ', c: 'grn' },
      { l: 'Zustand, lấy cả store', sub: 'useYeuThichStore()', v: 6, txt: '+6 thẻ', c: 'red' },
      { l: 'Context (5.1)', sub: 'mọi thẻ đọc context', v: 6, txt: '+6 thẻ', c: 'amb' },
    ], { lw: 300, max: 6 }),
    `${t(['[selector] 1 click ♡ ⇒ selector hep: +1 the', '  | useYeuThichStore(): +6 the'], 'vitest · bai3.test.tsx', 14)}
     ${box('tip', 'Selector trả về <strong>boolean</strong> <code>la</code> của đúng thẻ đó. Bấm ♡ BS. Hà: 5 thẻ còn lại vẫn nhận <code>false</code> như cũ ⇒ <code>Object.is</code> bằng nhau ⇒ Zustand không bắt chúng render.')}`) },

  /* 16 */ { t: 'Selector trả object mới ⇒ vòng lặp vô hạn; useShallow chữa', body: two(
    yaml([
      ['// ✗ object MỚI mỗi lần selector chạy', ''],
      ['const { soLuong, xoaHet } = useYeuThichStore(', ''],
      ['  (s) => ({ soLuong: s.yeuThich.length,', ''],
      ['           xoaHet: s.xoaHet }));', ''],
      ['', ''],
      ['// ✓ so từng field thay vì so cả object', ''],
      ['const { soLuong, xoaHet } = useYeuThichStore(', ''],
      ['  useShallow((s) => ({ soLuong: …, xoaHet: … })));', "from 'zustand/react/shallow'"],
    ], { fs: 14.5 }),
    `${t(['[object moi] loi: Maximum update depth exceeded.', '!  This can happen when a component repeatedly calls', '!  setState inside componentWillUpdate or', '!  componentDidUpdate. React limits the number of', '!  nested updates to prevent infinite loops.', '[useShallow] Xoá hết (0)'], 'vitest · Zustand 5 · React 19.3', 13.5)}
     ${box('info', 'Hoặc gọi hai lần, mỗi lần một giá trị: <code>const soLuong = useStore(s =&gt; s.yeuThich.length)</code> — cách đơn giản nhất.')}`) },

  /* 17 */ { t: 'persist: store tự lưu localStorage, F5 vẫn còn', body: two(
    `${yaml([
      ['create<State>()(persist((set) => ({ … }), {', ''],
      ["  name: 'phong-kham-dat-lich',", 'khoá localStorage'],
      ['  storage: createJSONStorage(() => localStorage),', ''],
      ['  partialize: (s) => ({', 'chỉ lưu dữ liệu,'],
      ['    yeuThich: s.yeuThich, lichHen: s.lichHen }),', 'không lưu hàm'],
      ['  version: 1,', 'đổi hình dạng ⇒ tăng số'],
      ['}));', ''],
    ], { fs: 14 })}
     ${t(['[persist] localStorage =', '  {"state":{"yeuThich":["bs-2"]},"version":1}', '[persist] store moi sau "tai lai":', '+ {"yeuThich":["bs-2"],"lanCuoiXem":null}'], 'vitest · bai3.test.tsx', 13.5)}`,
    `${t(['[sau] header: Lịch hẹn của tôi: 1', '[sau] localStorage = {"state":{"yeuThich":["bs-6"],', '  "lichHen":[{"id":"lh-1790303755862","bacSiId":"bs-1",', '  "khungGioId":"bs-1-kg-3", … }]},"version":1}', '+ [sau] F5 roi: Lịch hẹn của tôi: 1'], 'Chromium thật (Playwright)', 13.5)}
     ${box('warn', '<code>lanCuoiXem</code> không nằm trong <code>partialize</code> ⇒ sau F5 về <code>null</code>. Đó là chủ ý: chỉ lưu thứ người dùng muốn giữ. localStorage là CHUỖI công khai — không cất token, không cất dữ liệu nhạy cảm.')}`) },

  /* 18 */ { t: 'Store và URL sống ngoài component — test phải tự dọn', body: two(
    `${t(['$ npx vitest run src/components/KhuBacSi.test.tsx', '! ❯ KhuBacSi.test.tsx (6 tests | 4 failed)', '! × gõ "lan" (không dấu) ⇒ tìm ra BS. Phạm Ngọc Lan', '! × xem chi tiết rồi đóng', '! × yêu thích: bật, tắt, và chi tiết luôn khớp với thẻ', '! × lọc KHÔNG làm mất yêu thích của bác sĩ đang bị ẩn', '  Unable to find … role "heading" and name', '    "Đội ngũ bác sĩ (1)"', '!      Tests  4 failed | 2 passed (6)'], 'test cũ, sau khi chuyển lọc lên URL — chưa dọn', 13)}`,
    `${yaml([
      ['// src/test/setup.ts', ''],
      ['afterEach(() => {', ''],
      ['  cleanup();', 'DOM'],
      ["  window.history.replaceState(null, '', '/');", 'URL ?ck=nhi của test trước'],
      ['  useDatLichStore.setState(', 'store: THAY hẳn'],
      ['    useDatLichStore.getInitialState(), true);', ''],
      ['  localStorage.clear();', 'xoá SAU CÙNG'],
      ['});', ''],
    ], { fs: 14 })}
     ${box('warn', 'Đảo thứ tự (xoá localStorage trước, reset store sau) ⇒ <code>setState</code> của persist ghi lại ngay: test đo được <code>\'{"state":{"yeuThich":[],"lichHen":[]}…\'</code> thay vì <code>null</code>.')}`) },

  /* ───── 5.4 ───── */
  /* 19 */ { t: 'State trong useState mất khi F5 — state trên URL thì không', body: two(
    `${anh('rx-05', 'truoc-f5.jpg', { w: 540, h: 250, url: 'localhost · trước Chương 5 · sau F5', cap: 'Lọc Nhi + “vy” + ♡ → F5 ⇒ <strong>6 bác sĩ, 0 yêu thích</strong>' })}`,
    `${anh('rx-05', 'url-link.jpg', { w: 540, h: 250, url: 'localhost/?ck=nhi&q=vy', cap: 'Sau Chương 5: mở link ở tab MỚI ⇒ đúng 1 bác sĩ' })}
     ${t(['[truoc] sau F5: URL = / | Đội ngũ bác sĩ (6)', '+ [sau] sau F5: URL = /?ck=nhi&q=vy | Đội ngũ bác sĩ (1)'], 'Chromium thật', 13.5)}`) },

  /* 20 */ { t: 'URLSearchParams đọc/ghi phần ?… — và mọi giá trị đều là chuỗi', body: two(
    `${t(["> new URLSearchParams('?ck=nhi&q=h%C3%A0&q=lan')", '[usp] get ck = nhi | get q = hà', "  getAll q = [ 'hà', 'lan' ] | get trang = null", "> p.set('q', 'Thảo Vy'); p.delete('ck'); p.set('trang', '2')", '[usp] toString = q=Th%E1%BA%A3o+Vy&trang=2', '! [usp] typeof get("trang") = string'], 'vitest · bai4.test.tsx', 13.5)}`,
    `${yaml([
      ['export function docBoLoc(search: string): BoLoc {', ''],
      ['  const p = new URLSearchParams(search);', ''],
      ["  const ck = p.get('ck');", 'string | null'],
      ['  return {', ''],
      ["    chuyenKhoa: laChuyenKhoa(ck) ? ck : 'tat-ca',", 'lạ ⇒ mặc định'],
      ["    tuKhoa: (p.get('q') ?? '').slice(0, 50),", ''],
      ['  };', ''],
      ['}', ''],
    ], { fs: 13.5 })}
     ${box('bad', 'URL là thứ <strong>người dùng gõ tay được</strong>: <code>?ck=tim-mach</code>, <code>?ck=toString</code>. Đọc URL = đọc dữ liệu ngoài ⇒ kiểm rồi mới dùng.')}`) },

  /* 21 */ { t: 'useBoLocUrl: URL là nguồn sự thật, component chỉ đọc và ghi nó', body: `${vongUrl()}
    ${box('tip', 'Không có <code>useState</code> cho <code>chuyenKhoa</code> hay <code>tuKhoa</code> nữa: cả hai <strong>tính ra</strong> từ chuỗi URL mỗi lần render — đúng bài 2.4 “đừng cất thứ tính được”.')}` },

  /* 22 */ { t: 'Bấm chip thì pushState, gõ phím thì replaceState', body: two(
    `${t(['[lich su] go "thao vy":', '! pushState:    +7 muc lich su', '+ replaceState: +0 muc lich su', '  URL = ?q=thao%20vy'], 'vitest · jsdom', 14.5)}
     ${box('warn', 'push mỗi phím ⇒ bấm Back 7 lần mới ra khỏi ô tìm. Người dùng sẽ nghĩ nút Back hỏng.')}`,
    `${t(['[sau] bam Nhi roi Da lieu: URL = /?ck=da-lieu | (1)', '+ [sau] nut Back:  URL = /?ck=nhi | Đội ngũ bác sĩ (2)', '+ [sau] Back lan nua: URL = / | Đội ngũ bác sĩ (6)'], 'Chromium thật — nút Back', 13.5)}
     ${table(['Việc', 'Cách ghi URL'], [
      ['Chọn chuyên khoa, sang trang 2, đổi tab', '<code>pushState</code> — Back quay lại được'],
      ['Gõ từng phím vào ô tìm', '<code>replaceState</code> — sửa mục hiện tại'],
      ['Back / Forward của trình duyệt', 'sự kiện <code>popstate</code> ⇒ đọc lại URL'],
    ], { sm: true })}`) },

  /* 23 */ { t: 'Mỗi loại state một chỗ ở', body: table(['State', 'Ví dụ trong dự án', 'Chỗ ở'], [
    ['Chỉ một component cần', 'bác sĩ đang xem chi tiết, ô đang mở', '<code>useState</code> ngay trong component đó'],
    ['Nhiều giá trị đổi theo luật', 'luồng đặt lịch 4 bước', '<code>useReducer</code>'],
    ['Ít đổi, cả cây cần', 'theme, ngôn ngữ, người đăng nhập', 'Context'],
    ['Của người dùng, nhiều nơi xa nhau cần, nên sống qua F5', 'yêu thích, lịch hẹn đã đặt', '+Zustand (+ persist)'],
    ['Nên chia sẻ được bằng link / Back được', 'chuyên khoa đang lọc, từ khoá, trang', '+URL'],
    ['Dữ liệu của MÁY CHỦ', 'danh sách bác sĩ, khung giờ', '!TanStack Query — Chương 6'],
    ['Form đang gõ dở', 'họ tên, SĐT', 'React Hook Form — Chương 3'],
  ], { sm: true }) },

  /* 24 */ { t: 'Kết quả chương: luồng đặt lịch 4 bước bằng một reducer', body: two(
    `${anh('rx-05', 'luong-buoc-2.jpg', { w: 560, url: 'localhost:4173 · bước 2', cap: 'Khung 09:30 của BS. An đã kín ⇒ không bấm được' })}
     <div style="height:10px"></div>
     ${anh('rx-05', 'luong-xong.jpg', { w: 560, url: 'localhost:4173 · xong', cap: 'Xác nhận ⇒ store thêm lịch hẹn, Header và danh sách tự cập nhật' })}`,
    anh('rx-05', 'luong-buoc-4.jpg', { w: 540, url: 'localhost:4173 · bước 4', cap: 'Bước 4: tóm tắt trước khi gửi (ảnh chụp Chromium thật)' })) },

  /* 25 */ { t: 'Sai lầm hay gặp ở Chương 5', body: cards([
    { ic: '🌪', t: 'value={{ … }} viết thẳng', d: 'Object mới mỗi render ⇒ mọi thẻ đọc context render lại (+18 khi gõ 3 phím).', c: 'red' },
    { ic: '🤫', t: 'Mặc định context là object giả', d: 'Quên Provider mà không lỗi — bấm không có gì xảy ra.', c: 'amb' },
    { ic: '🧩', t: 'Luật rải trong nhiều useState', d: 'Đổi bác sĩ mà khung giờ cũ ở lại. Gom luật vào reducer.', c: 'ora' },
    { ic: '♾', t: 'Selector trả object mới', d: 'Zustand 5 ⇒ “Maximum update depth exceeded”. Dùng useShallow.', c: 'vio' },
    { ic: '🧪', t: 'Không reset store/URL giữa test', d: 'Test sau thấy ?ck=nhi của test trước ⇒ 4 test đỏ.', c: 'pnk' },
    { ic: '🔙', t: 'pushState mỗi phím', d: '+7 mục lịch sử cho “thao vy”. Gõ phím dùng replaceState.', c: 'blu' },
  ]) },

  /* 26 */ { t: 'Bảng tra nhanh Chương 5', body: table(['Muốn', 'Viết'], [
    ['Tạo context', '<code>const C = createContext&lt;T | null&gt;(null)</code> + hook bọc ném lỗi khi null'],
    ['Cung cấp (React 19)', '<code>&lt;C value={giaTri}&gt;…&lt;/C&gt;</code> · value object ⇒ <code>useMemo</code>'],
    ['Reducer', '<code>const [s, dispatch] = useReducer(reducer, BAN_DAU)</code> · <code>dispatch({ type: \'…\' })</code>'],
    ['Không sót case', '<code>default: { const x: never = action; return x; }</code>'],
    ['Store Zustand', '<code>create&lt;T&gt;()((set) =&gt; ({ …, doi: () =&gt; set(…) }))</code>'],
    ['Đọc store', '<code>useStore((s) =&gt; s.mot)</code> · nhiều field: <code>useShallow(…)</code>'],
    ['Lưu qua F5', '<code>persist(…, { name, partialize, version })</code>'],
    ['Đọc / ghi URL', '<code>new URLSearchParams(location.search)</code> · <code>history.pushState</code>/<code>replaceState</code>'],
    ['Nghe nút Back', '<code>window.addEventListener(\'popstate\', …)</code> trong effect, có cleanup'],
  ], { sm: true }) },

  /* 27 */ { t: 'Tự gõ tiếp dự án: luồng 4 bước, store dùng chung, lọc trên URL', body: two(
    list([
      '<code>dat-lich/luong-dat-lich.ts</code> — reducer 8 loại hành động (7 test)',
      '<code>LuongDatLich</code> — 4 bước, dùng <code>FormDatLich</code> của Chương 3 ở bước 3 (4 test)',
      '<code>store/dat-lich-store.ts</code> — <code>useDatLichStore</code>: yêu thích + lịch hẹn, persist (3 test)',
      '<code>Header</code> đếm lịch hẹn (1 test) · <code>LichHenCuaToi</code> liệt kê',
      '<code>logic/bo-loc-url.ts</code> + <code>hooks/useBoLocUrl.ts</code> — lọc/tìm trên URL (4 + 3 test)',
      '<code>test/setup.ts</code> — dọn URL, store, localStorage sau mỗi test',
    ]),
    `${anh('rx-05', 'luong-buoc-1.jpg', { w: 520, h: 150, url: 'localhost:4173', cap: 'Bước 1 — chọn bác sĩ' })}
     ${t(['$ npx tsc -b && npx vitest run', '+  Test Files  14 passed (14)', '+       Tests  56 passed (56)', '# 34 test cũ (Ch1–3) + 22 test mới'], 'Đạt khi', 14.5)}`) },
]);
