/**
 * React · Chương 5 — Chia sẻ state (soạn 25/09/2026 theo content/courses/react/_HOP-DONG.md).
 * Mọi đoạn mã dài và mọi output trong bài lấy NGUYÊN VĂN từ dự án thử SCRATCH/rx/du-an/ch05 (react 19.3.0 · vite 8.3.1 ·
 * typescript 6.0.3 · vitest 5.0.1 · zustand 5.0.15), chạy thật trên máy dựng bài; ảnh chụp bằng Chromium thật (Playwright).
 * Deck: scripts/slides-src/rx-05.mjs (27 slide).
 */
import { gallery, slide } from './_slides.mjs';
/* ─── Sơ đồ mermaid trong bài (≤ 10 nút, nhãn ngắn; khối EN nhãn tiếng Anh, khối VI nhãn tiếng Việt) ─── */
const H = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '&#96;').replace(/\$\{/g, '&#36;{');
/** Sơ đồ mermaid: trang học đọc textContent của <code class="language-mermaid"> rồi vẽ (LearnPageClient → mermaidRuntime). */
const MM = (src) => '<pre><code class="language-mermaid">' + H(src.trim()) + '</code></pre>';
const LM = (...dong) => MM(dong.join('\n'));
const SD = {
  /* 5.1 */
  ctxVi: LM(
    'flowchart TB',
    '  subgraph K["Prop drilling"]',
    '    direction TB',
    '    A1["AppKhoan: useState"] -->|"yeuThich, onDoi"| A2["KhuKhoan: chỉ chuyển tiếp"]',
    '    A2 -->|"yeuThich, onDoi"| A3["LuoiKhoan: chỉ chuyển tiếp"]',
    '    A3 -->|"yeuThich, onDoi"| A4["TheKhoan: dùng"]',
    '  end',
    '  subgraph C["Context"]',
    '    direction TB',
    '    P["YeuThichProvider: useState"] --> D["DemYeuThich: useYeuThich()"]',
    '    P --> S["section, div: không biết gì"]',
    '    S --> T["TheContext: useYeuThich()"]',
    '    P -. "value, không qua props" .-> T',
    '  end',
    '  classDef trung fill:#3a2a0a,stroke:#ffc233,color:#fff',
    '  class A2,A3 trung',
  ),
  ctxEn: LM(
    'flowchart TB',
    '  subgraph K["Prop drilling"]',
    '    direction TB',
    '    A1["AppKhoan: useState"] -->|"yeuThich, onDoi"| A2["KhuKhoan: only passes it on"]',
    '    A2 -->|"yeuThich, onDoi"| A3["LuoiKhoan: only passes it on"]',
    '    A3 -->|"yeuThich, onDoi"| A4["TheKhoan: uses it"]',
    '  end',
    '  subgraph C["Context"]',
    '    direction TB',
    '    P["YeuThichProvider: useState"] --> D["DemYeuThich: useYeuThich()"]',
    '    P --> S["section, div: know nothing"]',
    '    S --> T["TheContext: useYeuThich()"]',
    '    P -. "value, no props" .-> T',
    '  end',
    '  classDef trung fill:#3a2a0a,stroke:#ffc233,color:#fff',
    '  class A2,A3 trung',
  ),
  baoVi: LM(
    'flowchart TB',
    '  A["Gõ 1 phím vào ô tìm"] --> B["KhuDo render lại"]',
    '  B --> C{"value của Provider?"}',
    '  C -->|"viết inline"| D["Object mới: Object.is(cũ, mới) = false"]',
    '  D --> E["6 thẻ đọc context render lại, memo của LuoiDo không chặn được"]',
    '  C -->|"bọc useMemo"| F["Vẫn object cũ: Object.is = true"]',
    '  F --> G["0 thẻ render lại"]',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class E xau',
    '  class G tot',
  ),
  baoEn: LM(
    'flowchart TB',
    '  A["Type 1 key into the search box"] --> B["KhuDo re-renders"]',
    '  B --> C{"Provider value?"}',
    '  C -->|"written inline"| D["New object: Object.is(old, new) = false"]',
    '  D --> E["6 cards reading the context re-render, memo on LuoiDo cannot stop it"]',
    '  C -->|"wrapped in useMemo"| F["Same object: Object.is = true"]',
    '  F --> G["0 cards re-render"]',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class E xau',
    '  class G tot',
  ),
  tachVi: LM(
    'flowchart TB',
    '  P["KhuTach: useState + doi (useCallback, không đổi)"] --> A["DoiYeuThichContext: doi, không bao giờ đổi"]',
    '  P --> B["DsYeuThichContext: yeuThich, đổi mỗi lần bấm ♡"]',
    '  A --> N["ThanhCongCuChiHanhDong: NutXoaHet render 1 lần"]',
    '  A --> T["TheTach: render lại khi danh sách đổi"]',
    '  B --> T',
    '  B -. "lỡ đọc thêm" .-> X["ThanhCongCuTach: NutXoaHet render 3 lần"]',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  class N tot',
    '  class X xau',
  ),
  tachEn: LM(
    'flowchart TB',
    '  P["KhuTach: useState + doi (useCallback, stable)"] --> A["DoiYeuThichContext: doi, never changes"]',
    '  P --> B["DsYeuThichContext: yeuThich, changes on every ♡"]',
    '  A --> N["ThanhCongCuChiHanhDong: NutXoaHet renders 1 time"]',
    '  A --> T["TheTach: re-renders when the list changes"]',
    '  B --> T',
    '  B -. "one leftover read" .-> X["ThanhCongCuTach: NutXoaHet renders 3 times"]',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  class N tot',
    '  class X xau',
  ),
  /* 5.2 */
  dispatchVi: LM(
    'flowchart TB',
    '  A["Handler gọi dispatch(action)"] --> B["React xếp action vào hàng đợi"]',
    '  A -. "ngay sau dispatch" .-> S["state trong handler vẫn là bản chụp cũ: buoc = 1"]',
    '  B --> C["React gọi chonLichReducer(state, action)"]',
    '  C --> D{"Trả về object khác? (Object.is)"}',
    '  D -->|"khác"| E["Render lại với state mới"]',
    '  D -->|"cùng object"| F["Bỏ qua, không render"]',
    '  E --> G["Giao diện mới, người dùng bấm tiếp"]',
    '  G --> A',
  ),
  dispatchEn: LM(
    'flowchart TB',
    '  A["Handler calls dispatch(action)"] --> B["React queues the action"]',
    '  A -. "right after dispatch" .-> S["state in the handler is still the old snapshot: buoc = 1"]',
    '  B --> C["React calls chonLichReducer(state, action)"]',
    '  C --> D{"Different object returned? (Object.is)"}',
    '  D -->|"different"| E["Re-render with the new state"]',
    '  D -->|"same object"| F["Skip, no render"]',
    '  E --> G["New UI, the user clicks again"]',
    '  G --> A',
  ),
  luongVi: LM(
    'stateDiagram-v2',
    '  B1: Bước 1 · chọn bác sĩ',
    '  B2: Bước 2 · chọn giờ',
    '  B3: Bước 3 · thông tin bệnh nhân',
    '  B4: Bước 4 · xác nhận',
    '  G: Đang gửi · khoá luồng',
    '  X: Đã đặt · daDat khác null',
    '  [*] --> B1',
    '  B1 --> B2: chon-bac-si',
    '  B2 --> B3: chon-khung-gio',
    '  B3 --> B4: nhap-thong-tin',
    '  B4 --> B3: quay-lai',
    '  B4 --> G: bat-dau-gui',
    '  G --> B4: gui-loi · hiện loiGui',
    '  G --> X: gui-xong',
    '  X --> B1: lam-lai',
  ),
  luongEn: LM(
    'stateDiagram-v2',
    '  B1: Step 1 · pick a doctor',
    '  B2: Step 2 · pick a time',
    '  B3: Step 3 · patient details',
    '  B4: Step 4 · confirm',
    '  G: Sending · flow locked',
    '  X: Booked · daDat not null',
    '  [*] --> B1',
    '  B1 --> B2: chon-bac-si',
    '  B2 --> B3: chon-khung-gio',
    '  B3 --> B4: nhap-thong-tin',
    '  B4 --> B3: quay-lai',
    '  B4 --> G: bat-dau-gui',
    '  G --> B4: gui-loi · shows loiGui',
    '  G --> X: gui-xong',
    '  X --> B1: lam-lai',
  ),
  chonVi: LM(
    'flowchart TB',
    '  A{"Một sự kiện phải đổi nhiều giá trị theo luật?"} -->|"không: ô chữ, bật/tắt, bộ đếm"| B["useState"]',
    '  A -->|"có: luồng nhiều bước, tải/lỗi/xong"| C["useReducer"]',
    '  C --> D{"Component ở sâu cũng cần dispatch?"}',
    '  D -->|"không"| E["Giữ reducer trong một component"]',
    '  D -->|"có"| F["Đưa dispatch vào context: nó không bao giờ đổi"]',
  ),
  chonEn: LM(
    'flowchart TB',
    '  A{"Must one event change several values by a rule?"} -->|"no: text box, toggle, counter"| B["useState"]',
    '  A -->|"yes: multi-step flow, loading/error/done"| C["useReducer"]',
    '  C --> D{"Do deep components need to dispatch too?"}',
    '  D -->|"no"| E["Keep the reducer in one component"]',
    '  D -->|"yes"| F["Put dispatch in a context: it never changes"]',
  ),
  /* 5.3 */
  khoVi: LM(
    'flowchart TB',
    '  S[("useYeuThichStore: biến của module, NGOÀI cây")]',
    '  subgraph cay["Cây component, không có Provider"]',
    '    direction TB',
    '    L["LuoiZustand"] --> T["6 × TheChon"]',
    '    L --> D["DemYeuThich"]',
    '  end',
    '  S -. "selector: yeuThich.includes(id)" .-> T',
    '  S -. "selector: yeuThich.length" .-> D',
    '  X["Test, hàm tiện ích: getState()"] -. "đọc và gọi hành động" .-> S',
  ),
  khoEn: LM(
    'flowchart TB',
    '  S[("useYeuThichStore: a module variable, OUTSIDE the tree")]',
    '  subgraph cay["Component tree, no Provider"]',
    '    direction TB',
    '    L["LuoiZustand"] --> T["6 × TheChon"]',
    '    L --> D["DemYeuThich"]',
    '  end',
    '  S -. "selector: yeuThich.includes(id)" .-> T',
    '  S -. "selector: yeuThich.length" .-> D',
    '  X["A test, a utility: getState()"] -. "read and call actions" .-> S',
  ),
  selectorVi: LM(
    'flowchart TB',
    '  A["Bấm ♡ BS. Hà: set() đổi yeuThich"] --> B["Zustand chạy lại selector của từng component"]',
    '  B --> C{"Kết quả khác lần trước? (Object.is)"}',
    '  C -->|"thẻ BS. Hà: false thành true"| D["Render lại: +1"]',
    '  C -->|"5 thẻ còn lại: false vẫn false"| E["Bỏ qua"]',
    '  C -->|"useYeuThichStore() không selector: object mới"| F["Cả 6 thẻ render lại: +6"]',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  class E tot',
    '  class F xau',
  ),
  selectorEn: LM(
    'flowchart TB',
    '  A["Click ♡ on BS. Hà: set() changes yeuThich"] --> B["Zustand re-runs every component selector"]',
    '  B --> C{"Result differs from last time? (Object.is)"}',
    '  C -->|"card of BS. Hà: false becomes true"| D["Re-render: +1"]',
    '  C -->|"other 5 cards: still false"| E["Skipped"]',
    '  C -->|"useYeuThichStore() with no selector: new object"| F["All 6 cards re-render: +6"]',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  class E tot',
    '  class F xau',
  ),
  persistVi: LM(
    'flowchart TB',
    '  A["doi(id): set() đổi state"] --> B["persist ghi phần partialize chọn"]',
    '  B --> C[("localStorage: key = name, kèm version")]',
    '  D["F5: tải lại file, tạo store mới"] --> E["Hydrate: đọc lại localStorage, đồng bộ"]',
    '  C --> E',
    '  E --> F["yeuThich còn nguyên, lanCuoiXem về null vì không lưu"]',
  ),
  persistEn: LM(
    'flowchart TB',
    '  A["doi(id): set() changes state"] --> B["persist saves what partialize picks"]',
    '  B --> C[("localStorage: key = name, plus version")]',
    '  D["F5: file loaded again, new store"] --> E["Hydrate: read localStorage back, synchronously"]',
    '  C --> E',
    '  E --> F["yeuThich is back, lanCuoiXem is null because it was not saved"]',
  ),
  /* 5.4 */
  urlVi: LM(
    'flowchart TB',
    '  A["Bấm chip Nhi"] --> B["datBoLoc: chuyenKhoa = nhi"]',
    '  B --> C["taoSearch trả ?ck=nhi"]',
    '  C --> D["pushState: thanh địa chỉ /?ck=nhi, thêm một mục lịch sử"]',
    '  D --> E["setSearch(search mới): render lại"]',
    '  E --> F["docBoLoc(search): lọc danh sách, chip sáng"]',
    '  G["Bấm Back"] --> H["Trình duyệt đổi URL, bắn popstate"]',
    '  H -->|"listener của effect"| E',
  ),
  urlEn: LM(
    'flowchart TB',
    '  A["Click the Nhi chip"] --> B["datBoLoc: chuyenKhoa = nhi"]',
    '  B --> C["taoSearch returns ?ck=nhi"]',
    '  C --> D["pushState: address bar /?ck=nhi, one new history entry"]',
    '  D --> E["setSearch(new search): re-render"]',
    '  E --> F["docBoLoc(search): list filtered, chip pressed"]',
    '  G["Press Back"] --> H["Browser changes the URL, fires popstate"]',
    '  H -->|"the effect listener"| E',
  ),
  pushVi: LM(
    'flowchart TB',
    '  A{"Người dùng vừa làm gì?"} -->|"chọn có chủ ý: bấm chip"| B["pushState: +1 mục lịch sử"]',
    '  B --> C["Back hoàn tác đúng lựa chọn đó"]',
    '  A -->|"gõ phím trong ô tìm"| D["replaceState: +0 mục"]',
    '  D --> E["Gõ thao vy: 0 mục mới, push sẽ là +7"]',
  ),
  pushEn: LM(
    'flowchart TB',
    '  A{"What did the user just do?"} -->|"a deliberate choice: chip click"| B["pushState: +1 history entry"]',
    '  B --> C["Back undoes exactly that choice"]',
    '  A -->|"a keystroke in the search box"| D["replaceState: +0 entries"]',
    '  D --> E["Typing thao vy: 0 new entries, push would add 7"]',
  ),
  nhaVi: LM(
    'flowchart TB',
    '  A{"Dữ liệu của máy chủ?"} -->|"có"| Q["TanStack Query · Chương 6"]',
    '  A -->|"không"| B{"Cần gửi được bằng link, Back hoàn tác?"}',
    '  B -->|"có"| U["URL · Bài 5.4"]',
    '  B -->|"không"| C{"Của người dùng, cần ở nơi xa, sống qua F5?"}',
    '  C -->|"có"| Z["Zustand + persist · Bài 5.3"]',
    '  C -->|"không"| D{"Hiếm đổi, cả cây cần?"}',
    '  D -->|"có"| X["Context · Bài 5.1"]',
    '  D -->|"không"| L["Cục bộ: useState, hoặc useReducer nếu có luật · 5.2"]',
  ),
  nhaEn: LM(
    'flowchart TB',
    '  A{"Does the server own it?"} -->|"yes"| Q["TanStack Query · Chapter 6"]',
    '  A -->|"no"| B{"Share it by link, undo with Back?"}',
    '  B -->|"yes"| U["The URL · Lesson 5.4"]',
    '  B -->|"no"| C{"The user data, needed far apart, must survive F5?"}',
    '  C -->|"yes"| Z["Zustand + persist · Lesson 5.3"]',
    '  C -->|"no"| D{"Rarely changes, the whole tree needs it?"}',
    '  D -->|"yes"| X["Context · Lesson 5.1"]',
    '  D -->|"no"| L["Local: useState, or useReducer if there are rules · 5.2"]',
  ),
  /* 5.5 */
  xacNhanVi: LM(
    'sequenceDiagram',
    '  participant N as Người dùng',
    '  participant L as LuongDatLich (useReducer)',
    '  participant M as Máy chủ giả (800 ms)',
    '  participant S as useDatLichStore (persist)',
    '  participant H as Header',
    '  N->>L: bấm Xác nhận đặt lịch',
    '  L->>L: dispatch bat-dau-gui, nút thành Đang gửi…',
    '  L->>M: guiYeuCauDatLich(bác sĩ, thông tin, khung giờ)',
    '  M-->>L: lichHen (mã lh-…)',
    '  L->>S: themLichHen(lichHen)',
    '  S-->>H: Lịch hẹn của tôi: 1',
    '  L->>L: dispatch gui-xong, hiện Đã đặt lịch',
    '  Note over S,H: F5 vẫn còn 1 nhờ localStorage',
  ),
  xacNhanEn: LM(
    'sequenceDiagram',
    '  participant N as User',
    '  participant L as LuongDatLich (useReducer)',
    '  participant M as Fake server (800 ms)',
    '  participant S as useDatLichStore (persist)',
    '  participant H as Header',
    '  N->>L: click Xác nhận đặt lịch',
    '  L->>L: dispatch bat-dau-gui, button says Đang gửi…',
    '  L->>M: guiYeuCauDatLich(doctor, details, slot)',
    '  M-->>L: lichHen (code lh-…)',
    '  L->>S: themLichHen(lichHen)',
    '  S-->>H: Lịch hẹn của tôi: 1',
    '  L->>L: dispatch gui-xong, success message',
    '  Note over S,H: still 1 after F5, thanks to localStorage',
  ),
  keHoachVi: LM(
    'flowchart TB',
    '  App["App"] --> K["KhuBacSi"]',
    '  App --> L["LuongDatLich"]',
    '  K <-->|"useBoLocUrl"| U["URL ?ck=…&q=… · Phần C"]',
    '  K -->|"yêu thích"| S[("useDatLichStore + persist · Phần B")]',
    '  L -->|"themLichHen"| S',
    '  L --> R["useReducer: 4 bước · Phần A"]',
    '  S -->|"lichHen"| H["Header, LichHenCuaToi"]',
  ),
  keHoachEn: LM(
    'flowchart TB',
    '  App["App"] --> K["KhuBacSi"]',
    '  App --> L["LuongDatLich"]',
    '  K <-->|"useBoLocUrl"| U["URL ?ck=…&q=… · Part C"]',
    '  K -->|"favourites"| S[("useDatLichStore + persist · Part B")]',
    '  L -->|"themLichHen"| S',
    '  L --> R["useReducer: 4 steps · Part A"]',
    '  S -->|"lichHen"| H["Header, LichHenCuaToi"]',
  ),
};

export default {
  title: 'Chapter 5 — Sharing state|||Chương 5 — Chia sẻ state',
  description: 'Khi nhiều component xa nhau cần cùng một dữ liệu: Context (và cơn bão render đo thật), useReducer cho luồng đặt lịch 4 bước, Zustand với selector và persist, và URL là state cho bộ lọc — mọi con số đo bằng Vitest và Chromium thật.',
  lessons: [
  {
    title: '5.0 — Chapter 5 slides: sharing state in pictures|||5.0 — Slide Chương 5: chia sẻ state bằng hình',
    slug: 'rx-5-0-slides',
    type: 'DOCUMENT',
    isFreePreview: true,
    description: 'Bộ 27 slide của Chương 5: prop drilling và Context, cơn bão render đo thật, useReducer cho luồng đặt lịch 4 bước, Zustand với selector, useShallow và persist, URL là state, và danh sách tự gõ tiếp dự án.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Slides</span>
<h2>The whole chapter in 27 slides</h2>
<p class="lead">Chapter 2 lifted state up to the nearest common parent, and that works — until the parent is five levels away, or the data has to survive a page reload, or someone wants to send the filtered list as a link. This chapter gives you four more places to keep state, and a rule for choosing between them. By the end, the clinic app books appointments in four steps with a reducer, keeps favourites and booked appointments in a Zustand store that survives F5, and stores the specialty filter and search text in the URL.</p>
<p>Slides 3–7 belong to Lesson 5.1 (Context, the default-value trap, and the re-render storm measured on six cards), 8–12 to 5.2 (useReducer and the booking flow&#39;s reducer), 13–18 to 5.3 (Zustand: selectors, useShallow, persist, and tests that leak state), and 19–23 to 5.4 (the URL as state). Slides 24, 25 and 27 belong to Lesson 5.5, where you build it all yourself: the finished four-step flow, the chapter&#39;s common mistakes, and the "keep building the project" checklist; slide 26 is the cheat sheet for the quiz. Every number is real: measured on 25 September 2026 with React 19.3.0, Vitest 5.0.1 and Zustand 5.0.15, plus a real Chromium driven by Playwright for F5, the Back button and localStorage. Two results are worth looking at twice: <code>memo</code> does not stop a context update (slide 6), and a Zustand selector that returns a new object is not "a bit slower" — it crashes (slide 16).</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Slide</span>
<h2>Cả chương trong 27 slide</h2>
<p class="lead">Chương 2 nâng state lên cha chung gần nhất, và cách đó chạy tốt — cho tới khi cha chung ở cách năm tầng, hoặc dữ liệu phải sống qua một lần tải lại trang, hoặc ai đó muốn gửi danh sách đã lọc cho người khác bằng một đường link. Chương này cho bạn thêm bốn chỗ để đặt state, và một quy tắc để chọn giữa chúng. Hết chương, app phòng khám đặt được lịch qua bốn bước bằng một reducer, giữ danh sách yêu thích và lịch hẹn đã đặt trong một store Zustand sống qua F5, và lưu chuyên khoa đang lọc cùng từ khoá tìm kiếm ngay trên URL.</p>
<p>Slide 3–7 thuộc Bài 5.1 (Context, cái bẫy giá trị mặc định, và "cơn bão render" đo trên sáu thẻ), 8–12 thuộc 5.2 (useReducer và reducer của luồng đặt lịch), 13–18 thuộc 5.3 (Zustand: selector, useShallow, persist, và test bị rò state), 19–23 thuộc 5.4 (URL là state). Slide 24, 25 và 27 thuộc Bài 5.5, nơi bạn tự dựng tất cả: luồng bốn bước hoàn chỉnh, những sai lầm hay gặp của chương, và danh sách "tự gõ tiếp dự án"; slide 26 là bảng tra nhanh dùng cho bài kiểm tra. Mọi con số là THẬT: đo ngày 25/09/2026 bằng React 19.3.0, Vitest 5.0.1 và Zustand 5.0.15, cộng một Chromium thật do Playwright điều khiển cho phần F5, nút Back và localStorage. Có hai kết quả đáng nhìn hai lần: <code>memo</code> không chặn được cập nhật của context (slide 6), và một selector Zustand trả về object mới không phải "chậm hơn một chút" — nó làm app sập (slide 16).</p>
</div>
${gallery('rx-05', [[1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Prop drilling và Context'], [4, 'Context: tạo, cung cấp, đọc'], [5, 'Mặc định null và hook bọc'], [6, 'Cơn bão render: value mới mỗi lần'], [7, 'Tách context; khi nào Context là đủ'], [8, 'Ba useState rời: trạng thái không thể'], [9, 'dispatch → reducer → state mới'], [10, 'Union hành động và never'], [11, 'Reducer thuần, test không cần React, StrictMode'], [12, 'useState hay useReducer'], [13, 'Store Zustand nằm ngoài cây'], [14, 'create(): state và hành động'], [15, 'Selector hẹp: đo số lần render'], [16, 'Selector trả object mới và useShallow'], [17, 'persist: lưu localStorage'], [18, 'Store và URL trong test'], [19, 'F5: useState mất, URL còn'], [20, 'URLSearchParams và kiểm URL'], [21, 'useBoLocUrl: URL là nguồn sự thật'], [22, 'pushState hay replaceState'], [23, 'Mỗi loại state một chỗ ở'], [24, 'Kết quả: luồng đặt lịch 4 bước'], [25, 'Sai lầm hay gặp'], [26, 'Bảng tra nhanh'], [27, 'Tự gõ tiếp dự án']])}
`,
  },
  {
    title: '5.1 — Context without re-render storms: Provider, a hook that fails loudly, measured re-renders|||5.1 — Context mà không render lại ồ ạt: Provider, hook báo lỗi, đo số lần render',
    slug: 'rx-5-1-context',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Prop drilling và Context trong ba bước (React 19 dùng thẳng Context làm provider), mặc định null cùng hook ném lỗi, cơn bão render đo thật (+18 lần render thẻ khi gõ 3 phím, memo không chặn), tách context, và khi nào Context là đủ.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Context without re-render storms: Provider, a hook that fails loudly, and measuring who re-renders</h2>
<p class="lead">Lifting state up (Lesson 2.4) has one weakness: the state has to travel down through every component in between, even the ones that never use it. <strong>Context</strong> lets a component far below read a value directly from a component far above. It is simple to set up — and just as simple to set up in a way that quietly re-renders every reader on every keystroke. This lesson does both, and counts.</p>

<p>Everything here runs in a test project that is a copy of the clinic app (React 19.3.0, Vitest 5.0.1, TypeScript 6.0.3). The examples live in <code>src/vi-du/bai1.tsx</code>; the numbers in grey boxes are printed by <code>npx vitest run src/vi-du/bai1.test.tsx --reporter=verbose</code>, pasted as they came out. To count how many times a component runs, the examples use a tiny counter: a <code>Map</code> from a name to a number, incremented at the top of the component. Writing to an outside variable during render is exactly what Lesson 2.1 told you not to do — it is fine here because it only <em>observes</em>, and it never feeds back into what the component shows.</p>

<h3>Prop drilling: when "lift it up" turns into "pass it down, and down, and down"</h3>
${slide('rx-05', 3, 'Prop drilling vs Context: the same favourites, two ways to deliver them')}
<p>Take the favourites list from Chapter 2. The state lives in a top component, and only the doctor card at the bottom uses it. With props, the two components in the middle must accept <code>yeuThich</code> and <code>onDoi</code> just to hand them on:</p>
<pre><code class="language-tsx">/* ───────── 1. Prop drilling: yeuThich + onDoi đi qua 2 tầng không dùng tới ───────── */
function TheKhoan({ bacSi, yeuThich, onDoi }: { bacSi: BacSi; yeuThich: string[]; onDoi: (id: string) =&gt; void }) {
  const la = yeuThich.includes(bacSi.id);
  return (
    &lt;button type="button" aria-pressed={la} onClick={() =&gt; onDoi(bacSi.id)}&gt;
      {la ? '♥' : '♡'} {bacSi.ten}
    &lt;/button&gt;
  );
}
function LuoiKhoan({ yeuThich, onDoi }: { yeuThich: string[]; onDoi: (id: string) =&gt; void }) {
  // LuoiKhoan KHÔNG dùng yeuThich — chỉ chuyển tiếp xuống con.
  return &lt;div&gt;{danhSachBacSi.map((bs) =&gt; &lt;TheKhoan key={bs.id} bacSi={bs} yeuThich={yeuThich} onDoi={onDoi} /&gt;)}&lt;/div&gt;;
}
function KhuKhoan({ yeuThich, onDoi }: { yeuThich: string[]; onDoi: (id: string) =&gt; void }) {
  return &lt;section&gt;&lt;LuoiKhoan yeuThich={yeuThich} onDoi={onDoi} /&gt;&lt;/section&gt;; // lại chuyển tiếp
}
export function AppKhoan() {
  const [yeuThich, setYeuThich] = useState&lt;string[]&gt;([]);
  return &lt;KhuKhoan yeuThich={yeuThich} onDoi={(id) =&gt; setYeuThich((cu) =&gt; doiYeuThich(cu, id))} /&gt;;
}</code></pre>
<p><code>LuoiKhoan</code> and <code>KhuKhoan</code> do nothing with the favourites. They are couriers. This has a name: <strong>prop drilling</strong> (drilling a prop through layers). It works — the test clicks the heart on BS. Trần Thu Hà and the card flips:</p>
<div class="out">[drilling] sau 1 click: ♥ BS. Trần Thu Hà | [context] sau 1 click: ♥ BS. Trần Thu Hà | Yêu thích: 1</div>
<p>The cost shows up later. Rename <code>onDoi</code> and you edit four files. Add a second value the card needs and every courier grows a new prop. Move the card somewhere else in the tree and the whole chain has to be rebuilt.</p>
<div class="callout"><p><strong>JS quick reminder — props written inline.</strong> <code>function LuoiKhoan({ yeuThich, onDoi }: { yeuThich: string[]; onDoi: (id: string) =&gt; void })</code> is the same as declaring an <code>interface LuoiKhoanProps</code> and using it: the part after the colon describes the shape of the props object, and the braces before it pull out two fields by name (object destructuring, Lesson 1.2). <code>(id: string) =&gt; void</code> reads "a function that takes a string and returns nothing".</p></div>
<p>Prop drilling through two levels is not a sin. react.dev&#39;s advice is to try two things before reaching for context: <strong>pass props anyway</strong> when there are only a couple of levels (explicit data flow is easy to follow), and <strong>pass JSX as <code>children</code></strong> so the middle components never need the data at all. Context is for the cases where neither is reasonable: many components at different depths all need the same value.</p>

<h3>Context in three steps: create, provide, read</h3>
${slide('rx-05', 4, 'Context: create once, provide above, read anywhere below')}
<p>A context is a channel. You create it once, put a <strong>provider</strong> (the component that supplies the value) somewhere high in the tree, and any component below — however deep — can read the current value. Here is the favourites list delivered by context instead of props:</p>
<pre><code class="language-tsx">/* ───────── 2. Context đúng cách: null làm mặc định + hook bọc báo lỗi rõ ───────── */
interface GiaTriYeuThich {
  yeuThich: string[];
  doi: (id: string) =&gt; void;
}
const YeuThichContext = createContext&lt;GiaTriYeuThich | null&gt;(null);

export function YeuThichProvider({ children }: { children: ReactNode }) {
  const [yeuThich, setYeuThich] = useState&lt;string[]&gt;([]);
  const doi = useCallback((id: string) =&gt; setYeuThich((cu) =&gt; doiYeuThich(cu, id)), []);
  const giaTri = useMemo(() =&gt; ({ yeuThich, doi }), [yeuThich, doi]);
  // React 19: dùng thẳng &lt;Context value={…}&gt; làm provider (không cần .Provider)
  return &lt;YeuThichContext value={giaTri}&gt;{children}&lt;/YeuThichContext&gt;;
}

export function useYeuThich(): GiaTriYeuThich {
  const giaTri = useContext(YeuThichContext);
  if (giaTri === null) throw new Error('useYeuThich() phải được gọi bên trong &lt;YeuThichProvider&gt;');
  return giaTri;
}

function TheContext({ bacSi }: { bacSi: BacSi }) {
  const { yeuThich, doi } = useYeuThich(); // không cần prop nào ngoài bacSi
  const la = yeuThich.includes(bacSi.id);
  return (
    &lt;button type="button" aria-pressed={la} onClick={() =&gt; doi(bacSi.id)}&gt;
      {la ? '♥' : '♡'} {bacSi.ten}
    &lt;/button&gt;
  );
}
function DemYeuThich() {
  const { yeuThich } = useYeuThich();
  return &lt;p&gt;Yêu thích: {yeuThich.length}&lt;/p&gt;;
}
export function AppContext() {
  return (
    &lt;YeuThichProvider&gt;
      &lt;DemYeuThich /&gt;
      &lt;section&gt;
        &lt;div&gt;{danhSachBacSi.map((bs) =&gt; &lt;TheContext key={bs.id} bacSi={bs} /&gt;)}&lt;/div&gt;
      &lt;/section&gt;
    &lt;/YeuThichProvider&gt;
  );
}</code></pre>
<p>Read it step by step:</p>
<ol>
<li><strong>Create.</strong> <code>createContext&lt;GiaTriYeuThich | null&gt;(null)</code> runs once, outside any component. The type in angle brackets says what the context carries; the argument is the <em>default value</em> (more on why it is <code>null</code> in a moment).</li>
<li><strong>Provide.</strong> <code>YeuThichProvider</code> owns the state with an ordinary <code>useState</code> and renders <code>&lt;YeuThichContext value={giaTri}&gt;</code> around its children. Since React 19 you render the context itself as the provider. The older spelling <code>&lt;YeuThichContext.Provider value={…}&gt;</code> still works in React 19.3 (you will see it in every project written before 2025); the React team has said it will be deprecated in a future version.</li>
<li><strong>Read.</strong> Any component inside calls <code>useContext(YeuThichContext)</code> — here wrapped in a custom hook <code>useYeuThich()</code>. React looks <em>up</em> the tree for the nearest provider of that context and returns its <code>value</code>.</li>
</ol>
<p>The middle components are now plain: <code>section</code> and <code>div</code> know nothing about favourites. The test gives the same result as with props (<code>Yêu thích: 1</code> after one click).</p>
${SD.ctxEn}
<div class="callout"><p><strong>JS quick reminder — <code>children</code> and <code>ReactNode</code>.</strong> Whatever you write between a component&#39;s opening and closing tags arrives as a prop called <code>children</code>. <code>ReactNode</code> is the TypeScript type for "anything React can render": elements, strings, numbers, arrays of those, <code>null</code>. So <code>{ children }: { children: ReactNode }</code> means "this component wraps other JSX".</p></div>
<p><strong>Try it step by step</strong> — what happens when you click the heart on BS. Trần Thu Hà:</p>
<ol>
<li><code>TheContext</code> calls <code>doi('bs-2')</code>. That is the function from the provider, so it runs <code>setYeuThich</code> in <code>YeuThichProvider</code>.</li>
<li>React re-renders <code>YeuThichProvider</code>. <code>yeuThich</code> is a new array, so <code>useMemo</code> builds a new <code>giaTri</code> object.</li>
<li>React compares the old and new <code>value</code> with <code>Object.is</code>: different. It then re-renders <strong>every component that reads this context</strong> — six cards and <code>DemYeuThich</code>.</li>
<li>Each card recomputes <code>la</code>; only BS. Hà&#39;s changes, so only one button&#39;s text changes in the DOM.</li>
</ol>
<p>React 19 also added <code>use(Context)</code>, which reads a context exactly like <code>useContext</code> but — unlike every other hook — may be called inside an <code>if</code> or a loop. The next examples use <code>use</code> so you recognise it; in your own code either is fine.</p>

<h3>The default value: <code>null</code> plus a hook that throws</h3>
${slide('rx-05', 5, 'Default null + a wrapper hook: a missing Provider fails immediately')}
<p>What happens when a component reads a context and there is <strong>no provider above it</strong>? React does not complain. It returns the default value you passed to <code>createContext</code>. That is why the default matters. Compare two versions — first ours, with <code>null</code> and a hook that checks it:</p>
<div class="out">[quen provider] useYeuThich() phải được gọi bên trong &lt;YeuThichProvider&gt;</div>
<p>Rendering <code>TheContext</code> without <code>YeuThichProvider</code> throws on the very first render, with a message that tells you exactly what is missing. Now the tempting alternative — a default that "looks like" a real value:</p>
<pre><code class="language-tsx">/* ───────── 3. Bẫy: mặc định là object "giả" ⇒ quên Provider thì im lặng không làm gì ───────── */
const YeuThichMacDinhContext = createContext&lt;GiaTriYeuThich&gt;({ yeuThich: [], doi: () =&gt; {} });
export function TheMacDinh() {
  const { yeuThich, doi } = useContext(YeuThichMacDinhContext);
  const bs = danhSachBacSi[0];
  return (
    &lt;button type="button" onClick={() =&gt; doi(bs.id)}&gt;
      {yeuThich.includes(bs.id) ? '♥' : '♡'} {bs.ten}
    &lt;/button&gt;
  );
}</code></pre>
<div class="out">[mac dinh gia] sau 2 click: ♡ BS. Nguyễn Minh An</div>
<div class="pitfall co-tieu-de"><strong>Trap — a default value that pretends to work.</strong> With <code>{ yeuThich: [], doi: () =&gt; {} }</code> as the default, forgetting the provider produces no error, no warning, and no heart: the button calls a function that does nothing. On a real project this happens when someone renders a component in a new page, in a Storybook story or in a test without the provider. You then spend an afternoon asking why clicking does nothing. Use <code>null</code> as the default, and a custom hook that throws when it sees <code>null</code>. Bonus: after the check, TypeScript knows the value is not <code>null</code>, so no component ever writes <code>ctx?.doi</code>.</div>
<p>Defaults that are genuinely useful do exist: a theme context whose default is <code>'light'</code> is fine, because "no provider" really does mean "use the light theme". The rule is: the default must be a correct value, not a placeholder.</p>

<h3>The re-render storm, measured</h3>
${slide('rx-05', 6, 'A new value object on every render: every card that reads the context re-renders')}
<p>Now the part most tutorials skip. A provider often holds more than one piece of state, or sits inside a component that re-renders for unrelated reasons. Here, <code>KhuDo</code> holds the favourites <em>and</em> the text of a search box, and passes the favourites down through a context. Every card is wrapped in <code>memo</code>, and so is the grid:</p>
<pre><code class="language-tsx">/* ───────── 4. Cơn bão render: value là object mới mỗi lần Provider render ───────── */
const KhoContext = createContext&lt;GiaTriYeuThich | null&gt;(null);
const TheDo = memo(function TheDo({ bacSi }: { bacSi: BacSi }) {
  dem(&#96;the:&#36;{bacSi.id}&#96;);
  const kho = use(KhoContext)!; // React 19: use(Context) đọc được như useContext
  const la = kho.yeuThich.includes(bacSi.id);
  return (
    &lt;button type="button" aria-pressed={la} aria-label={&#96;Yêu thích &#36;{bacSi.ten}&#96;} onClick={() =&gt; kho.doi(bacSi.id)}&gt;
      {la ? '♥' : '♡'}
    &lt;/button&gt;
  );
});
const LuoiDo = memo(function LuoiDo() {
  dem('luoi');
  return &lt;div&gt;{danhSachBacSi.map((bs) =&gt; &lt;TheDo key={bs.id} bacSi={bs} /&gt;)}&lt;/div&gt;;
});

/** cach = 'inline': value={{ … }} viết thẳng · 'memo': value bọc useMemo + useCallback */
export function KhuDo({ cach }: { cach: 'inline' | 'memo' }) {
  const [tuKhoa, setTuKhoa] = useState(''); // state CHẲNG liên quan tới yêu thích
  const [yeuThich, setYeuThich] = useState&lt;string[]&gt;([]);
  const doiOn = useCallback((id: string) =&gt; setYeuThich((cu) =&gt; doiYeuThich(cu, id)), []);
  const giaTriMemo = useMemo(() =&gt; ({ yeuThich, doi: doiOn }), [yeuThich, doiOn]);
  const giaTri =
    cach === 'inline'
      ? { yeuThich, doi: (id: string) =&gt; setYeuThich((cu) =&gt; doiYeuThich(cu, id)) } // object MỚI mỗi render
      : giaTriMemo;
  return (
    &lt;KhoContext value={giaTri}&gt;
      &lt;label&gt;
        Tìm theo tên &lt;input value={tuKhoa} onChange={(e) =&gt; setTuKhoa(e.target.value)} /&gt;
      &lt;/label&gt;
      &lt;LuoiDo /&gt;
    &lt;/KhoContext&gt;
  );
}</code></pre>
<div class="callout"><p><strong>JS quick reminder — three things in this code.</strong> <code>memo(function TheDo(…) {…})</code> returns a version of the component that React may skip when its props are the same as last time (Chapter 8 measures when that is worth it). <code>use(KhoContext)!</code>: the <code>!</code> at the end is TypeScript&#39;s <em>non-null assertion</em> — "I promise this is not <code>null</code>"; it disappears in the JavaScript output, so if you are wrong it crashes later (in real code, prefer the throwing hook above). And <code>&#96;the:&#36;{bacSi.id}&#96;</code> is a template literal: a string with a value pasted in.</p></div>
<p>The test types three letters into the search box (which has nothing to do with favourites), then clicks one heart, and counts card renders:</p>
<pre><code class="language-tsx">for (const cach of ['inline', 'memo'] as const) {
  test(&#96;cơn bão render — value &#36;{cach}: gõ 3 phím vào ô tìm&#96;, async () =&gt; {
    const user = userEvent.setup();
    render(&lt;KhuDo cach={cach} /&gt;);
    const dau = tong('the:');
    await user.type(screen.getByLabelText(/Tìm theo tên/), 'huy');
    const sauGo = tong('the:') - dau;
    await user.click(screen.getByRole('button', { name: 'Yêu thích BS. Trần Thu Hà' }));
    const sauClick = tong('the:') - dau - sauGo;
    console.info(&#96;[bao render] value &#36;{cach}: mount &#36;{dau} the | go "huy" +&#36;{sauGo} the | click ♡ +&#36;{sauClick} the | LuoiDo render &#36;{demRender.get('luoi')} lan&#96;);
    expect(sauGo).toBe(cach === 'inline' ? 18 : 0);
    expect(sauClick).toBe(6);
  });
}</code></pre>
<div class="out">[bao render] value inline: mount 6 the | go "huy" +18 the | click ♡ +6 the | LuoiDo render 1 lan
[bao render] value memo: mount 6 the | go "huy" +0 the | click ♡ +6 the | LuoiDo render 1 lan</div>
<p>Three findings, each worth a sentence:</p>
<ul>
<li><strong>Inline value: +18.</strong> Each keystroke re-renders <code>KhuDo</code>. The line <code>{ yeuThich, doi: … }</code> creates a <em>new object</em> every time, and <code>Object.is(oldObject, newObject)</code> is always <code>false</code> — two objects are only "the same" if they are literally the same object in memory. So React treats the context as changed and re-renders all 6 cards, 3 times: 18.</li>
<li><strong><code>memo</code> did not help the cards.</strong> <code>LuoiDo</code> rendered once: <code>memo</code> saw no props change and skipped it. But the cards <em>below</em> it still re-rendered. react.dev says it plainly: skipping re-renders with <code>memo</code> does not prevent children from receiving fresh context values. A context update travels straight to every component that reads it, through any memo on the way.</li>
<li><strong>With <code>useMemo</code>: +0 for typing, but still +6 for one heart.</strong> Wrapping the value in <code>useMemo</code> (and the function in <code>useCallback</code>) keeps the <em>same</em> object until <code>yeuThich</code> really changes, so typing no longer touches the cards. But when one favourite changes, all six cards re-render, because each of them reads the whole array. Context has no way to say "tell me only when <em>my</em> doctor changes".</li>
</ul>
${SD.baoEn}
<div class="callout"><p><strong>JS quick reminder — <code>useMemo</code> and <code>useCallback</code>.</strong> <code>useMemo(() =&gt; tinh(), [a, b])</code> runs <code>tinh()</code> on the first render and then reuses the previous result until <code>a</code> or <code>b</code> changes (compared with <code>Object.is</code>). <code>useCallback(fn, [deps])</code> is the same idea for a function: <code>useMemo(() =&gt; fn, [deps])</code>. Both are performance tools: code must still be correct without them. Chapter 8 measures when they pay off, and Chapter 12 shows the React Compiler, which inserts this memoisation for you.</p></div>
<p>Six cards re-rendering is nothing — you would never notice it. The numbers matter because they <strong>scale</strong>: the same pattern with 200 rows, a context read by the header, the sidebar and every row, and a provider that holds the text of a search box, is how a real app ends up redrawing half the page on every key.</p>

<h3>Splitting contexts: what changes often, what never changes</h3>
${slide('rx-05', 7, 'Split contexts: a component that only calls actions stops re-rendering')}
<p>A second fix: put the value that changes (the array) and the thing that never changes (the function) into <strong>two contexts</strong>. A component that only needs to <em>do</em> something — a "Clear all" button — reads only the function context, so a change to the array does not concern it:</p>
<pre><code class="language-tsx">/* ───────── 5. Tách context: state riêng, hành động riêng ───────── */
const DsYeuThichContext = createContext&lt;string[]&gt;([]);
const DoiYeuThichContext = createContext&lt;(id: string) =&gt; void&gt;(() =&gt; {});

function NutXoaHet({ onXoa }: { onXoa: () =&gt; void }) {
  dem('nut-xoa');
  return &lt;button type="button" onClick={onXoa}&gt;Xoá hết&lt;/button&gt;;
}
const TheTach = memo(function TheTach({ bacSi }: { bacSi: BacSi }) {
  dem(&#96;tach:&#36;{bacSi.id}&#96;);
  const la = use(DsYeuThichContext).includes(bacSi.id);
  const doi = use(DoiYeuThichContext);
  return (
    &lt;button type="button" aria-pressed={la} aria-label={&#96;Yêu thích &#36;{bacSi.ten}&#96;} onClick={() =&gt; doi(bacSi.id)}&gt;
      {la ? '♥' : '♡'}
    &lt;/button&gt;
  );
});
/** NutXoaHet chỉ cần HÀNH ĐỘNG. Gộp chung: nó render lại mỗi lần danh sách đổi. Tách: không. */
const ThanhCongCuGop = memo(function ThanhCongCuGop() {
  const kho = use(KhoContext)!;
  return &lt;NutXoaHet onXoa={() =&gt; kho.yeuThich.forEach(kho.doi)} /&gt;;
});
const ThanhCongCuTach = memo(function ThanhCongCuTach() {
  const doi = use(DoiYeuThichContext);
  const ds = useContext(DsYeuThichContext); // ❌ nếu dòng này có mặt, tách cũng vô ích — xem test
  void ds;
  return &lt;NutXoaHet onXoa={() =&gt; doi('*')} /&gt;;
});
const ThanhCongCuChiHanhDong = memo(function ThanhCongCuChiHanhDong() {
  const doi = use(DoiYeuThichContext);
  return &lt;NutXoaHet onXoa={() =&gt; doi('*')} /&gt;;
});

export function KhuGop() {
  const [yeuThich, setYeuThich] = useState&lt;string[]&gt;([]);
  const doi = useCallback((id: string) =&gt; setYeuThich((cu) =&gt; doiYeuThich(cu, id)), []);
  const giaTri = useMemo(() =&gt; ({ yeuThich, doi }), [yeuThich, doi]);
  return (
    &lt;KhoContext value={giaTri}&gt;
      &lt;ThanhCongCuGop /&gt;
      &lt;LuoiDo /&gt;
    &lt;/KhoContext&gt;
  );
}
export function KhuTach({ docCaDanhSach = false }: { docCaDanhSach?: boolean }) {
  const [yeuThich, setYeuThich] = useState&lt;string[]&gt;([]);
  // '*' = xoá hết; còn lại bật/tắt một id. setYeuThich ổn định ⇒ doi ổn định.
  const doi = useCallback((id: string) =&gt; setYeuThich((cu) =&gt; (id === '*' ? [] : doiYeuThich(cu, id))), []);
  return (
    &lt;DoiYeuThichContext value={doi}&gt;
      &lt;DsYeuThichContext value={yeuThich}&gt;
        {docCaDanhSach ? &lt;ThanhCongCuTach /&gt; : &lt;ThanhCongCuChiHanhDong /&gt;}
        &lt;div&gt;{danhSachBacSi.map((bs) =&gt; &lt;TheTach key={bs.id} bacSi={bs} /&gt;)}&lt;/div&gt;
      &lt;/DsYeuThichContext&gt;
    &lt;/DoiYeuThichContext&gt;
  );
}</code></pre>
<p>The test clicks two hearts in three setups and counts renders of <code>NutXoaHet</code> ("Clear all"):</p>
<div class="out">[tach context] 2 click ♡ ⇒ gop: NutXoaHet render 3 lan | tach, doc ca danh sach: NutXoaHet render 3 lan | tach, chi hanh dong: NutXoaHet render 1 lan</div>
<ul>
<li><strong>One combined context:</strong> 3 renders — the mount plus one per click, although the button never uses the array.</li>
<li><strong>Split, but the toolbar still reads both:</strong> 3 renders. Splitting only helps if the component really stops reading the value that changes. One leftover <code>useContext(DsYeuThichContext)</code> — even one whose result is thrown away with <code>void ds</code> — cancels the whole benefit.</li>
<li><strong>Split, toolbar reads only the action:</strong> 1 render — the mount. Clicks do not reach it.</li>
</ul>
${SD.tachEn}
<p>Why is <code>doi</code> stable? Because <code>setYeuThich</code> from <code>useState</code> never changes identity, and <code>useCallback(…, [])</code> keeps the same function forever. The same is true of <code>dispatch</code> from <code>useReducer</code> (next lesson), which is why "state in one context, dispatch in another" is the pattern react.dev recommends for scaling up.</p>

<h3>When Context is enough — and when it is not</h3>
<table>
<thead><tr><th>Data</th><th>Changes</th><th>Context?</th></tr></thead>
<tbody>
<tr><td>Theme (light/dark), language</td><td>a few times per session</td><td>Yes — ideal</td></tr>
<tr><td>The logged-in user</td><td>on login/logout</td><td>Yes</td></tr>
<tr><td><code>dispatch</code> of a reducer</td><td>never</td><td>Yes — cheap and stable</td></tr>
<tr><td>Favourites read by 200 cards</td><td>on every click</td><td>Works, but every card re-renders; a store with selectors is better (5.3)</td></tr>
<tr><td>Text of a search box</td><td>on every keystroke</td><td>No — keep it local, or in the URL (5.4)</td></tr>
<tr><td>Data from the server</td><td>when the server says so</td><td>No — TanStack Query (Chapter 6)</td></tr>
</tbody>
</table>
<p>Context is a <strong>delivery mechanism</strong>, not a state manager. The state still lives in <code>useState</code> or <code>useReducer</code> inside the provider; context only carries it down. It has no selectors, no devtools and no persistence. For values that change rarely, that is all you need, and adding a library would be a cost with no benefit.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>In FER202 labs, data that two distant components need usually either travels through five layers of props, or goes straight into Redux with an action type, an action creator and a <code>connect</code>/<code>useSelector</code> call — even for the theme. → At work: rarely-changing app-wide values (theme, language, current user) go into a small context with a hook that throws when the provider is missing; client state that changes often and is read in many places goes into a store with selectors, usually Zustand (Lesson 5.3); server data goes into TanStack Query (Chapter 6). · <em>Why:</em> each tool is matched to how often the data changes and how many places read it. Redux is not wrong — you will meet it (as Redux Toolkit) in many existing codebases, and the concepts from Lesson 5.2 carry over directly — but for a theme toggle it is three files where one context would do.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "Is Context a replacement for Redux? When would you not use it?"</p>
<p>Context is a way to pass a value down the tree without props; it is not a state manager. The state still lives in a <code>useState</code>/<code>useReducer</code> in the provider. When the provider&#39;s <code>value</code> changes (compared with <code>Object.is</code>), every component that reads that context re-renders, and <code>memo</code> does not stop it. So Context is great for values that rarely change — theme, locale, auth user, a <code>dispatch</code> function. For state that changes often and is read by many components, I would use a store with selectors such as Zustand or Redux Toolkit, and for server data TanStack Query. If I do use context for such state, I memoise the value with <code>useMemo</code> and split state and actions into two contexts.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> the clinic wants a "large text" mode for older patients. Build it with context, the way this lesson did.</p><ol>
<li>Create <code>src/co-chu/CoChuContext.tsx</code> with <code>createContext&lt;{ chuTo: boolean; doi: () =&gt; void } | null&gt;(null)</code>, a <code>CoChuProvider</code> that holds <code>chuTo</code> in <code>useState</code> and memoises the value, and a hook <code>useCoChu()</code> that throws <code>'useCoChu() phải nằm trong &lt;CoChuProvider&gt;'</code> when it gets <code>null</code>.</li>
<li>Wrap <code>App</code> in the provider. Add a button "Chữ to" in <code>Header</code> with <code>aria-pressed={chuTo}</code>, and make <code>TheBacSi</code> add the class <code>chu-to</code> when the mode is on.</li>
<li>Write three tests: clicking the button toggles <code>aria-pressed</code> and every <code>article</code> gets the class; rendering <code>TheBacSi</code> without the provider throws your message; and — using a counter like <code>demRender</code> — a <code>memo</code>ised component that does <em>not</em> read the context renders exactly once while you click the button three times.</li>
</ol><p><strong>Done when:</strong> <code>npx tsc -b</code> prints nothing and your three tests are green; the second test&#39;s error message is exactly yours (not "Cannot read properties of null"); and you can explain, with the number from your third test, why a component that does not read the context was not affected.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">prop drilling</span><span class="v">passing a prop through components that do not use it, only to reach a deep child</span></div>
<div class="kv"><span class="k">context</span><span class="v">a channel that lets components read a value provided by an ancestor, without props</span></div>
<div class="kv"><span class="k">provider</span><span class="v">the component that supplies a context&#39;s value: <code>&lt;Ctx value={…}&gt;</code> (React 19) or <code>&lt;Ctx.Provider&gt;</code></span></div>
<div class="kv"><span class="k">consumer (reader)</span><span class="v">a component that calls <code>useContext(Ctx)</code> or <code>use(Ctx)</code></span></div>
<div class="kv"><span class="k">default value</span><span class="v">what <code>useContext</code> returns when there is no provider above; use <code>null</code> + a throwing hook</span></div>
<div class="kv"><span class="k">re-render storm</span><span class="v">many components re-rendering because a context value is a new object every render</span></div>
<div class="kv"><span class="k">split context</span><span class="v">separate contexts for frequently changing state and for stable actions</span></div>
<div class="kv"><span class="k">non-null assertion (<code>!</code>)</span><span class="v">TypeScript-only promise that a value is not <code>null</code>; no runtime check</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Prop drilling through a couple of levels is fine; context is for a value many components at different depths need.</li>
<li>Three steps: <code>createContext</code> outside components, <code>&lt;Ctx value={…}&gt;</code> above, <code>useContext</code>/<code>use</code> below.</li>
<li>Default to <code>null</code> and read through a custom hook that throws: a missing provider fails on the first render instead of silently doing nothing.</li>
<li>When the provider&#39;s value changes (by <code>Object.is</code>), every reader re-renders — <code>memo</code> does not stop it. Measured: inline value +18 card renders for 3 keystrokes; memoised value +0.</li>
<li>Context cannot select a slice: one favourite changed ⇒ all 6 cards re-rendered. Split state and actions to protect components that only act.</li>
<li>Context suits rarely-changing values (theme, language, user, dispatch). Frequently changing shared state goes to a store with selectors (5.3); server data to TanStack Query (Chapter 6).</li>
</ul>

<a class="link-card" href="https://react.dev/learn/passing-data-deeply-with-context" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Passing Data Deeply with Context</span><span class="lc-sub">Prop drilling, the three steps, and the alternatives to try before context.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/useContext" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — useContext</span><span class="lc-sub">Reference, including "Optimizing re-renders when passing objects and functions".</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/createContext" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — createContext</span><span class="lc-sub">The default value, and rendering the context itself as a provider.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/use" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — use</span><span class="lc-sub">Reading context with use(), which may be called conditionally.</span></span></a>
<a class="link-card" href="https://react.dev/blog/2024/12/05/react-19" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — React v19</span><span class="lc-sub">The release note for &lt;Context&gt; as a provider.</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Context mà không render lại ồ ạt: Provider, hook báo lỗi to, và đo xem ai render lại</h2>
<p class="lead">Nâng state lên (Bài 2.4) có một điểm yếu: state phải đi xuống qua mọi component ở giữa, kể cả những component chẳng bao giờ dùng nó. <strong>Context</strong> cho một component ở rất sâu đọc thẳng một giá trị từ một component ở rất cao. Dựng nó thì dễ — và dựng sai theo kiểu âm thầm bắt mọi component đọc nó render lại theo từng phím gõ thì cũng dễ y như vậy. Bài này làm cả hai, và đếm.</p>

<p>Mọi thứ trong bài chạy trong một dự án thử là bản chép của app phòng khám (React 19.3.0, Vitest 5.0.1, TypeScript 6.0.3). Ví dụ nằm ở <code>src/vi-du/bai1.tsx</code>; các con số trong khung xám do <code>npx vitest run src/vi-du/bai1.test.tsx --reporter=verbose</code> in ra, dán nguyên như lúc chạy. Để đếm một component chạy bao nhiêu lần, ví dụ dùng một bộ đếm nhỏ: một <code>Map</code> từ tên sang số, cộng một ở đầu component. Ghi vào biến bên ngoài trong lúc render đúng là điều Bài 2.1 dặn đừng làm — ở đây chấp nhận được vì nó chỉ <em>quan sát</em>, không bao giờ quay lại ảnh hưởng thứ component hiển thị.</p>

<h3>Prop drilling: khi "nâng lên" biến thành "truyền xuống, xuống nữa, xuống nữa"</h3>
${slide('rx-05', 3, 'Prop drilling và Context: cùng danh sách yêu thích, hai cách đưa xuống')}
<p>Lấy lại danh sách yêu thích của Chương 2. State sống ở component trên cùng, và chỉ thẻ bác sĩ ở dưới đáy dùng nó. Với props, hai component ở giữa buộc phải nhận <code>yeuThich</code> và <code>onDoi</code> chỉ để đưa tiếp:</p>
<pre><code class="language-tsx">/* ───────── 1. Prop drilling: yeuThich + onDoi đi qua 2 tầng không dùng tới ───────── */
function TheKhoan({ bacSi, yeuThich, onDoi }: { bacSi: BacSi; yeuThich: string[]; onDoi: (id: string) =&gt; void }) {
  const la = yeuThich.includes(bacSi.id);
  return (
    &lt;button type="button" aria-pressed={la} onClick={() =&gt; onDoi(bacSi.id)}&gt;
      {la ? '♥' : '♡'} {bacSi.ten}
    &lt;/button&gt;
  );
}
function LuoiKhoan({ yeuThich, onDoi }: { yeuThich: string[]; onDoi: (id: string) =&gt; void }) {
  // LuoiKhoan KHÔNG dùng yeuThich — chỉ chuyển tiếp xuống con.
  return &lt;div&gt;{danhSachBacSi.map((bs) =&gt; &lt;TheKhoan key={bs.id} bacSi={bs} yeuThich={yeuThich} onDoi={onDoi} /&gt;)}&lt;/div&gt;;
}
function KhuKhoan({ yeuThich, onDoi }: { yeuThich: string[]; onDoi: (id: string) =&gt; void }) {
  return &lt;section&gt;&lt;LuoiKhoan yeuThich={yeuThich} onDoi={onDoi} /&gt;&lt;/section&gt;; // lại chuyển tiếp
}
export function AppKhoan() {
  const [yeuThich, setYeuThich] = useState&lt;string[]&gt;([]);
  return &lt;KhuKhoan yeuThich={yeuThich} onDoi={(id) =&gt; setYeuThich((cu) =&gt; doiYeuThich(cu, id))} /&gt;;
}</code></pre>
<p><code>LuoiKhoan</code> và <code>KhuKhoan</code> không làm gì với danh sách yêu thích. Chúng là người giao hàng. Hiện tượng này có tên: <strong>prop drilling</strong> (khoan prop xuyên qua các tầng). Nó chạy — test bấm trái tim trên BS. Trần Thu Hà và thẻ đổi:</p>
<div class="out">[drilling] sau 1 click: ♥ BS. Trần Thu Hà | [context] sau 1 click: ♥ BS. Trần Thu Hà | Yêu thích: 1</div>
<p>Cái giá hiện ra về sau. Đổi tên <code>onDoi</code> là sửa bốn file. Thẻ cần thêm một giá trị là mọi người giao hàng mọc thêm một prop. Chuyển thẻ sang chỗ khác trong cây là phải dựng lại cả chuỗi.</p>
<div class="callout"><p><strong>JS nhắc nhanh — props khai kiểu ngay tại chỗ.</strong> <code>function LuoiKhoan({ yeuThich, onDoi }: { yeuThich: string[]; onDoi: (id: string) =&gt; void })</code> giống hệt việc khai một <code>interface LuoiKhoanProps</code> rồi dùng nó: phần sau dấu hai chấm tả hình dạng object props, còn cặp ngoặc nhọn phía trước rút ra hai field theo tên (destructuring object, Bài 1.2). <code>(id: string) =&gt; void</code> đọc là "một hàm nhận một chuỗi và không trả gì".</p></div>
<p>Khoan prop qua hai tầng không phải tội. Lời khuyên của react.dev là thử hai cách trước khi dùng context: <strong>cứ truyền props</strong> khi chỉ có vài tầng (luồng dữ liệu hiện rõ thì dễ theo dõi), và <strong>truyền JSX qua <code>children</code></strong> để các component ở giữa không cần biết tới dữ liệu. Context dành cho trường hợp cả hai cách đều không hợp lý: nhiều component ở những độ sâu khác nhau cùng cần một giá trị.</p>

<h3>Context trong ba bước: tạo, cung cấp, đọc</h3>
${slide('rx-05', 4, 'Context: tạo một lần, cung cấp ở trên, đọc ở bất kỳ đâu bên dưới')}
<p>Một context là một đường ống. Bạn tạo nó một lần, đặt một <strong>provider</strong> (component cung cấp giá trị) ở đâu đó trên cao, và mọi component bên dưới — sâu tới đâu cũng được — đọc được giá trị hiện tại. Đây là danh sách yêu thích đưa xuống bằng context thay cho props:</p>
<pre><code class="language-tsx">/* ───────── 2. Context đúng cách: null làm mặc định + hook bọc báo lỗi rõ ───────── */
interface GiaTriYeuThich {
  yeuThich: string[];
  doi: (id: string) =&gt; void;
}
const YeuThichContext = createContext&lt;GiaTriYeuThich | null&gt;(null);

export function YeuThichProvider({ children }: { children: ReactNode }) {
  const [yeuThich, setYeuThich] = useState&lt;string[]&gt;([]);
  const doi = useCallback((id: string) =&gt; setYeuThich((cu) =&gt; doiYeuThich(cu, id)), []);
  const giaTri = useMemo(() =&gt; ({ yeuThich, doi }), [yeuThich, doi]);
  // React 19: dùng thẳng &lt;Context value={…}&gt; làm provider (không cần .Provider)
  return &lt;YeuThichContext value={giaTri}&gt;{children}&lt;/YeuThichContext&gt;;
}

export function useYeuThich(): GiaTriYeuThich {
  const giaTri = useContext(YeuThichContext);
  if (giaTri === null) throw new Error('useYeuThich() phải được gọi bên trong &lt;YeuThichProvider&gt;');
  return giaTri;
}

function TheContext({ bacSi }: { bacSi: BacSi }) {
  const { yeuThich, doi } = useYeuThich(); // không cần prop nào ngoài bacSi
  const la = yeuThich.includes(bacSi.id);
  return (
    &lt;button type="button" aria-pressed={la} onClick={() =&gt; doi(bacSi.id)}&gt;
      {la ? '♥' : '♡'} {bacSi.ten}
    &lt;/button&gt;
  );
}
function DemYeuThich() {
  const { yeuThich } = useYeuThich();
  return &lt;p&gt;Yêu thích: {yeuThich.length}&lt;/p&gt;;
}
export function AppContext() {
  return (
    &lt;YeuThichProvider&gt;
      &lt;DemYeuThich /&gt;
      &lt;section&gt;
        &lt;div&gt;{danhSachBacSi.map((bs) =&gt; &lt;TheContext key={bs.id} bacSi={bs} /&gt;)}&lt;/div&gt;
      &lt;/section&gt;
    &lt;/YeuThichProvider&gt;
  );
}</code></pre>
<p>Đọc từng bước:</p>
<ol>
<li><strong>Tạo.</strong> <code>createContext&lt;GiaTriYeuThich | null&gt;(null)</code> chạy một lần, bên ngoài mọi component. Kiểu trong ngoặc nhọn nói context chở gì; đối số là <em>giá trị mặc định</em> (vì sao là <code>null</code> — xem mục sau).</li>
<li><strong>Cung cấp.</strong> <code>YeuThichProvider</code> giữ state bằng một <code>useState</code> bình thường và render <code>&lt;YeuThichContext value={giaTri}&gt;</code> bao quanh children. Từ React 19, bạn render chính context làm provider. Cách viết cũ <code>&lt;YeuThichContext.Provider value={…}&gt;</code> vẫn chạy trên React 19.3 (bạn sẽ gặp nó trong mọi dự án viết trước 2025); nhóm React đã nói nó sẽ bị đánh dấu lỗi thời ở một phiên bản sau.</li>
<li><strong>Đọc.</strong> Component nào bên trong cũng gọi được <code>useContext(YeuThichContext)</code> — ở đây bọc trong hook tự viết <code>useYeuThich()</code>. React đi <em>ngược lên</em> cây tìm provider gần nhất của context đó và trả về <code>value</code> của nó.</li>
</ol>
<p>Hai component ở giữa giờ trơn tru: <code>section</code> và <code>div</code> không biết gì về yêu thích. Test cho cùng kết quả như bản props (<code>Yêu thích: 1</code> sau một cú bấm).</p>
${SD.ctxVi}
<div class="callout"><p><strong>JS nhắc nhanh — <code>children</code> và <code>ReactNode</code>.</strong> Mọi thứ bạn viết giữa thẻ mở và thẻ đóng của một component đến tay nó qua prop tên <code>children</code>. <code>ReactNode</code> là kiểu TypeScript cho "mọi thứ React vẽ được": element, chuỗi, số, mảng của chúng, <code>null</code>. Nên <code>{ children }: { children: ReactNode }</code> nghĩa là "component này bọc JSX khác".</p></div>
<p><strong>Chạy thử từng bước</strong> — chuyện gì xảy ra khi bạn bấm trái tim trên BS. Trần Thu Hà:</p>
<ol>
<li><code>TheContext</code> gọi <code>doi('bs-2')</code>. Đó là hàm từ provider, nên nó chạy <code>setYeuThich</code> trong <code>YeuThichProvider</code>.</li>
<li>React render lại <code>YeuThichProvider</code>. <code>yeuThich</code> là mảng mới, nên <code>useMemo</code> dựng một object <code>giaTri</code> mới.</li>
<li>React so <code>value</code> cũ và mới bằng <code>Object.is</code>: khác. Nó render lại <strong>mọi component đọc context này</strong> — sáu thẻ và <code>DemYeuThich</code>.</li>
<li>Mỗi thẻ tính lại <code>la</code>; chỉ của BS. Hà đổi, nên trong DOM chỉ chữ trên một nút thay đổi.</li>
</ol>
<p>React 19 còn thêm <code>use(Context)</code>, đọc context y như <code>useContext</code> nhưng — khác mọi hook khác — được phép gọi trong <code>if</code> hay vòng lặp. Các ví dụ tiếp theo dùng <code>use</code> để bạn nhận ra nó; trong mã của bạn, cái nào cũng được.</p>

<h3>Giá trị mặc định: <code>null</code> cộng một hook biết ném lỗi</h3>
${slide('rx-05', 5, 'Mặc định null + hook bọc: quên Provider là thấy lỗi ngay')}
<p>Chuyện gì xảy ra khi một component đọc context mà <strong>phía trên không có provider nào</strong>? React không kêu ca gì. Nó trả về giá trị mặc định bạn truyền cho <code>createContext</code>. Vì thế giá trị mặc định quan trọng. So hai bản — trước hết là bản của ta, mặc định <code>null</code> và một hook kiểm nó:</p>
<div class="out">[quen provider] useYeuThich() phải được gọi bên trong &lt;YeuThichProvider&gt;</div>
<p>Render <code>TheContext</code> mà thiếu <code>YeuThichProvider</code> là ném lỗi ngay lần render đầu, kèm câu nói đúng thứ đang thiếu. Giờ tới lựa chọn hấp dẫn kia — một giá trị mặc định "trông như" giá trị thật:</p>
<pre><code class="language-tsx">/* ───────── 3. Bẫy: mặc định là object "giả" ⇒ quên Provider thì im lặng không làm gì ───────── */
const YeuThichMacDinhContext = createContext&lt;GiaTriYeuThich&gt;({ yeuThich: [], doi: () =&gt; {} });
export function TheMacDinh() {
  const { yeuThich, doi } = useContext(YeuThichMacDinhContext);
  const bs = danhSachBacSi[0];
  return (
    &lt;button type="button" onClick={() =&gt; doi(bs.id)}&gt;
      {yeuThich.includes(bs.id) ? '♥' : '♡'} {bs.ten}
    &lt;/button&gt;
  );
}</code></pre>
<div class="out">[mac dinh gia] sau 2 click: ♡ BS. Nguyễn Minh An</div>
<div class="pitfall co-tieu-de"><strong>Bẫy — giá trị mặc định giả vờ chạy được.</strong> Mặc định là <code>{ yeuThich: [], doi: () =&gt; {} }</code> thì quên provider không sinh lỗi, không cảnh báo, và không có trái tim nào: nút gọi một hàm không làm gì. Ở dự án thật, chuyện này xảy ra khi ai đó render component ở một trang mới, trong một story của Storybook, hay trong một test thiếu provider. Rồi bạn mất cả buổi chiều hỏi vì sao bấm không có gì xảy ra. Dùng <code>null</code> làm mặc định, và một hook tự viết ném lỗi khi thấy <code>null</code>. Thêm một cái lợi: qua bước kiểm, TypeScript biết giá trị không còn là <code>null</code>, nên không component nào phải viết <code>ctx?.doi</code>.</div>
<p>Giá trị mặc định thật sự có ích vẫn tồn tại: context giao diện có mặc định <code>'light'</code> là ổn, vì "không có provider" đúng là nghĩa "dùng giao diện sáng". Quy tắc: mặc định phải là một giá trị ĐÚNG, không phải đồ giữ chỗ.</p>

<h3>Cơn bão render, đo thật</h3>
${slide('rx-05', 6, 'value mới mỗi lần render: mọi thẻ đọc context đều render lại')}
<p>Giờ tới phần phần lớn bài hướng dẫn bỏ qua. Một provider thường giữ nhiều hơn một mẩu state, hoặc nằm trong một component render lại vì những lý do chẳng liên quan. Ở đây, <code>KhuDo</code> giữ danh sách yêu thích <em>và</em> chữ trong một ô tìm kiếm, rồi đưa danh sách yêu thích xuống qua một context. Mỗi thẻ được bọc <code>memo</code>, lưới cũng vậy:</p>
<pre><code class="language-tsx">/* ───────── 4. Cơn bão render: value là object mới mỗi lần Provider render ───────── */
const KhoContext = createContext&lt;GiaTriYeuThich | null&gt;(null);
const TheDo = memo(function TheDo({ bacSi }: { bacSi: BacSi }) {
  dem(&#96;the:&#36;{bacSi.id}&#96;);
  const kho = use(KhoContext)!; // React 19: use(Context) đọc được như useContext
  const la = kho.yeuThich.includes(bacSi.id);
  return (
    &lt;button type="button" aria-pressed={la} aria-label={&#96;Yêu thích &#36;{bacSi.ten}&#96;} onClick={() =&gt; kho.doi(bacSi.id)}&gt;
      {la ? '♥' : '♡'}
    &lt;/button&gt;
  );
});
const LuoiDo = memo(function LuoiDo() {
  dem('luoi');
  return &lt;div&gt;{danhSachBacSi.map((bs) =&gt; &lt;TheDo key={bs.id} bacSi={bs} /&gt;)}&lt;/div&gt;;
});

/** cach = 'inline': value={{ … }} viết thẳng · 'memo': value bọc useMemo + useCallback */
export function KhuDo({ cach }: { cach: 'inline' | 'memo' }) {
  const [tuKhoa, setTuKhoa] = useState(''); // state CHẲNG liên quan tới yêu thích
  const [yeuThich, setYeuThich] = useState&lt;string[]&gt;([]);
  const doiOn = useCallback((id: string) =&gt; setYeuThich((cu) =&gt; doiYeuThich(cu, id)), []);
  const giaTriMemo = useMemo(() =&gt; ({ yeuThich, doi: doiOn }), [yeuThich, doiOn]);
  const giaTri =
    cach === 'inline'
      ? { yeuThich, doi: (id: string) =&gt; setYeuThich((cu) =&gt; doiYeuThich(cu, id)) } // object MỚI mỗi render
      : giaTriMemo;
  return (
    &lt;KhoContext value={giaTri}&gt;
      &lt;label&gt;
        Tìm theo tên &lt;input value={tuKhoa} onChange={(e) =&gt; setTuKhoa(e.target.value)} /&gt;
      &lt;/label&gt;
      &lt;LuoiDo /&gt;
    &lt;/KhoContext&gt;
  );
}</code></pre>
<div class="callout"><p><strong>JS nhắc nhanh — ba thứ trong đoạn mã này.</strong> <code>memo(function TheDo(…) {…})</code> trả về một bản của component mà React được phép bỏ qua khi props giống lần trước (Chương 8 đo khi nào đáng làm). <code>use(KhoContext)!</code>: dấu <code>!</code> ở cuối là <em>khẳng định không-null</em> của TypeScript — "tôi hứa giá trị này không phải <code>null</code>"; nó biến mất trong JavaScript sinh ra, nên hứa sai là sập ở chỗ khác (mã thật nên dùng hook biết ném lỗi ở trên). Còn <code>&#96;the:&#36;{bacSi.id}&#96;</code> là template literal: chuỗi có dán giá trị vào.</p></div>
<p>Test gõ ba chữ vào ô tìm (chẳng liên quan gì tới yêu thích), rồi bấm một trái tim, và đếm số lần thẻ render:</p>
<pre><code class="language-tsx">for (const cach of ['inline', 'memo'] as const) {
  test(&#96;cơn bão render — value &#36;{cach}: gõ 3 phím vào ô tìm&#96;, async () =&gt; {
    const user = userEvent.setup();
    render(&lt;KhuDo cach={cach} /&gt;);
    const dau = tong('the:');
    await user.type(screen.getByLabelText(/Tìm theo tên/), 'huy');
    const sauGo = tong('the:') - dau;
    await user.click(screen.getByRole('button', { name: 'Yêu thích BS. Trần Thu Hà' }));
    const sauClick = tong('the:') - dau - sauGo;
    console.info(&#96;[bao render] value &#36;{cach}: mount &#36;{dau} the | go "huy" +&#36;{sauGo} the | click ♡ +&#36;{sauClick} the | LuoiDo render &#36;{demRender.get('luoi')} lan&#96;);
    expect(sauGo).toBe(cach === 'inline' ? 18 : 0);
    expect(sauClick).toBe(6);
  });
}</code></pre>
<div class="out">[bao render] value inline: mount 6 the | go "huy" +18 the | click ♡ +6 the | LuoiDo render 1 lan
[bao render] value memo: mount 6 the | go "huy" +0 the | click ♡ +6 the | LuoiDo render 1 lan</div>
<p>Ba phát hiện, mỗi cái đáng một câu:</p>
<ul>
<li><strong>Value viết thẳng: +18.</strong> Mỗi phím gõ render lại <code>KhuDo</code>. Dòng <code>{ yeuThich, doi: … }</code> tạo một <em>object mới</em> mỗi lần, và <code>Object.is(objectCũ, objectMới)</code> luôn là <code>false</code> — hai object chỉ "bằng nhau" khi đúng là cùng một object trong bộ nhớ. Nên React coi context đã đổi và render lại cả 6 thẻ, 3 lần: 18.</li>
<li><strong><code>memo</code> không cứu được các thẻ.</strong> <code>LuoiDo</code> render đúng một lần: <code>memo</code> thấy props không đổi và bỏ qua nó. Nhưng các thẻ <em>bên dưới</em> vẫn render lại. react.dev nói thẳng: bỏ qua render bằng <code>memo</code> không ngăn được con nhận giá trị context mới. Cập nhật context đi thẳng tới mọi component đọc nó, xuyên qua mọi memo trên đường.</li>
<li><strong>Có <code>useMemo</code>: +0 khi gõ, nhưng vẫn +6 cho một trái tim.</strong> Bọc value trong <code>useMemo</code> (và hàm trong <code>useCallback</code>) giữ <em>cùng một</em> object cho tới khi <code>yeuThich</code> thật sự đổi, nên gõ phím không còn đụng tới thẻ. Nhưng khi một mục yêu thích đổi, cả sáu thẻ render lại, vì thẻ nào cũng đọc cả mảng. Context không có cách nào nói "chỉ báo tôi khi bác sĩ <em>của tôi</em> đổi".</li>
</ul>
${SD.baoVi}
<div class="callout"><p><strong>JS nhắc nhanh — <code>useMemo</code> và <code>useCallback</code>.</strong> <code>useMemo(() =&gt; tinh(), [a, b])</code> chạy <code>tinh()</code> ở lần render đầu rồi dùng lại kết quả cũ cho tới khi <code>a</code> hoặc <code>b</code> đổi (so bằng <code>Object.is</code>). <code>useCallback(fn, [deps])</code> là cùng ý tưởng cho một hàm: <code>useMemo(() =&gt; fn, [deps])</code>. Cả hai là công cụ hiệu năng: bỏ chúng đi mã vẫn phải đúng. Chương 8 đo khi nào chúng đáng dùng, Chương 12 giới thiệu React Compiler — thứ tự chèn phần ghi nhớ này cho bạn.</p></div>
<p>Sáu thẻ render lại thì chẳng đáng gì — bạn sẽ không bao giờ nhận ra. Con số quan trọng vì nó <strong>nhân lên</strong>: cùng mẫu đó với 200 dòng, một context được header, sidebar và từng dòng đọc, và một provider giữ luôn chữ của ô tìm kiếm — đó là cách một app thật vẽ lại nửa trang theo từng phím.</p>

<h3>Tách context: thứ đổi thường xuyên, thứ không bao giờ đổi</h3>
${slide('rx-05', 7, 'Tách context: component chỉ gọi hành động thôi bị render lại')}
<p>Cách chữa thứ hai: đặt thứ hay đổi (mảng) và thứ không bao giờ đổi (hàm) vào <strong>hai context</strong>. Một component chỉ cần <em>làm</em> gì đó — nút "Xoá hết" — chỉ đọc context chứa hàm, nên mảng đổi chẳng liên quan gì tới nó:</p>
<pre><code class="language-tsx">/* ───────── 5. Tách context: state riêng, hành động riêng ───────── */
const DsYeuThichContext = createContext&lt;string[]&gt;([]);
const DoiYeuThichContext = createContext&lt;(id: string) =&gt; void&gt;(() =&gt; {});

function NutXoaHet({ onXoa }: { onXoa: () =&gt; void }) {
  dem('nut-xoa');
  return &lt;button type="button" onClick={onXoa}&gt;Xoá hết&lt;/button&gt;;
}
const TheTach = memo(function TheTach({ bacSi }: { bacSi: BacSi }) {
  dem(&#96;tach:&#36;{bacSi.id}&#96;);
  const la = use(DsYeuThichContext).includes(bacSi.id);
  const doi = use(DoiYeuThichContext);
  return (
    &lt;button type="button" aria-pressed={la} aria-label={&#96;Yêu thích &#36;{bacSi.ten}&#96;} onClick={() =&gt; doi(bacSi.id)}&gt;
      {la ? '♥' : '♡'}
    &lt;/button&gt;
  );
});
/** NutXoaHet chỉ cần HÀNH ĐỘNG. Gộp chung: nó render lại mỗi lần danh sách đổi. Tách: không. */
const ThanhCongCuGop = memo(function ThanhCongCuGop() {
  const kho = use(KhoContext)!;
  return &lt;NutXoaHet onXoa={() =&gt; kho.yeuThich.forEach(kho.doi)} /&gt;;
});
const ThanhCongCuTach = memo(function ThanhCongCuTach() {
  const doi = use(DoiYeuThichContext);
  const ds = useContext(DsYeuThichContext); // ❌ nếu dòng này có mặt, tách cũng vô ích — xem test
  void ds;
  return &lt;NutXoaHet onXoa={() =&gt; doi('*')} /&gt;;
});
const ThanhCongCuChiHanhDong = memo(function ThanhCongCuChiHanhDong() {
  const doi = use(DoiYeuThichContext);
  return &lt;NutXoaHet onXoa={() =&gt; doi('*')} /&gt;;
});

export function KhuGop() {
  const [yeuThich, setYeuThich] = useState&lt;string[]&gt;([]);
  const doi = useCallback((id: string) =&gt; setYeuThich((cu) =&gt; doiYeuThich(cu, id)), []);
  const giaTri = useMemo(() =&gt; ({ yeuThich, doi }), [yeuThich, doi]);
  return (
    &lt;KhoContext value={giaTri}&gt;
      &lt;ThanhCongCuGop /&gt;
      &lt;LuoiDo /&gt;
    &lt;/KhoContext&gt;
  );
}
export function KhuTach({ docCaDanhSach = false }: { docCaDanhSach?: boolean }) {
  const [yeuThich, setYeuThich] = useState&lt;string[]&gt;([]);
  // '*' = xoá hết; còn lại bật/tắt một id. setYeuThich ổn định ⇒ doi ổn định.
  const doi = useCallback((id: string) =&gt; setYeuThich((cu) =&gt; (id === '*' ? [] : doiYeuThich(cu, id))), []);
  return (
    &lt;DoiYeuThichContext value={doi}&gt;
      &lt;DsYeuThichContext value={yeuThich}&gt;
        {docCaDanhSach ? &lt;ThanhCongCuTach /&gt; : &lt;ThanhCongCuChiHanhDong /&gt;}
        &lt;div&gt;{danhSachBacSi.map((bs) =&gt; &lt;TheTach key={bs.id} bacSi={bs} /&gt;)}&lt;/div&gt;
      &lt;/DsYeuThichContext&gt;
    &lt;/DoiYeuThichContext&gt;
  );
}</code></pre>
<p>Test bấm hai trái tim ở ba cách dựng và đếm số lần <code>NutXoaHet</code> render:</p>
<div class="out">[tach context] 2 click ♡ ⇒ gop: NutXoaHet render 3 lan | tach, doc ca danh sach: NutXoaHet render 3 lan | tach, chi hanh dong: NutXoaHet render 1 lan</div>
<ul>
<li><strong>Một context gộp:</strong> 3 lần — lần mount cộng một lần mỗi cú bấm, dù nút không hề dùng mảng.</li>
<li><strong>Tách, nhưng thanh công cụ vẫn đọc cả hai:</strong> 3 lần. Tách chỉ có ích khi component thật sự thôi đọc giá trị hay đổi. Sót lại một dòng <code>useContext(DsYeuThichContext)</code> — kể cả khi kết quả bị vứt đi bằng <code>void ds</code> — là mất sạch cái lợi.</li>
<li><strong>Tách, thanh công cụ chỉ đọc hành động:</strong> 1 lần — lúc mount. Các cú bấm không chạm tới nó.</li>
</ul>
${SD.tachVi}
<p>Vì sao <code>doi</code> ổn định? Vì <code>setYeuThich</code> của <code>useState</code> không bao giờ đổi danh tính, và <code>useCallback(…, [])</code> giữ nguyên một hàm mãi mãi. <code>dispatch</code> của <code>useReducer</code> (bài sau) cũng vậy — đó là lý do mẫu "state một context, dispatch một context" là cách react.dev khuyên dùng khi app lớn dần.</p>

<h3>Khi nào Context là đủ — và khi nào không</h3>
<table>
<thead><tr><th>Dữ liệu</th><th>Đổi</th><th>Context?</th></tr></thead>
<tbody>
<tr><td>Giao diện sáng/tối, ngôn ngữ</td><td>vài lần mỗi phiên</td><td>Có — lý tưởng</td></tr>
<tr><td>Người đang đăng nhập</td><td>khi đăng nhập/đăng xuất</td><td>Có</td></tr>
<tr><td><code>dispatch</code> của một reducer</td><td>không bao giờ</td><td>Có — rẻ và ổn định</td></tr>
<tr><td>Yêu thích được 200 thẻ đọc</td><td>mỗi cú bấm</td><td>Chạy được, nhưng thẻ nào cũng render lại; store có selector tốt hơn (5.3)</td></tr>
<tr><td>Chữ trong ô tìm kiếm</td><td>mỗi phím gõ</td><td>Không — để cục bộ, hoặc lên URL (5.4)</td></tr>
<tr><td>Dữ liệu từ máy chủ</td><td>khi máy chủ nói vậy</td><td>Không — TanStack Query (Chương 6)</td></tr>
</tbody>
</table>
<p>Context là một <strong>cơ chế chuyển phát</strong>, không phải bộ quản lý state. State vẫn sống trong <code>useState</code> hay <code>useReducer</code> bên trong provider; context chỉ chở nó xuống. Nó không có selector, không có devtools, không có lưu trữ. Với giá trị ít đổi, bấy nhiêu là đủ, và thêm một thư viện là tốn thêm mà không được gì.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Trong các lab FER202, dữ liệu hai component xa nhau cùng cần thường hoặc đi qua năm tầng props, hoặc vào thẳng Redux kèm action type, action creator và một lời gọi <code>connect</code>/<code>useSelector</code> — kể cả cho chế độ sáng/tối. → Đi làm: giá trị toàn app ít đổi (giao diện, ngôn ngữ, người đăng nhập) vào một context nhỏ kèm hook ném lỗi khi thiếu provider; state phía client đổi thường xuyên và được đọc ở nhiều nơi vào một store có selector, thường là Zustand (Bài 5.3); dữ liệu máy chủ vào TanStack Query (Chương 6). · <em>Vì sao:</em> mỗi công cụ khớp với việc dữ liệu đổi thường xuyên cỡ nào và bao nhiêu chỗ đọc nó. Redux không sai — bạn sẽ gặp nó (dạng Redux Toolkit) trong nhiều dự án có sẵn, và khái niệm ở Bài 5.2 dùng lại y nguyên — nhưng cho một nút đổi giao diện thì nó là ba file ở chỗ một context là đủ.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Context có thay được Redux không? Khi nào bạn không dùng nó?"</p>
<p>Context là cách đưa một giá trị xuống cây mà không cần props; nó không phải bộ quản lý state. State vẫn sống trong một <code>useState</code>/<code>useReducer</code> ở provider. Khi <code>value</code> của provider đổi (so bằng <code>Object.is</code>), mọi component đọc context đó render lại, và <code>memo</code> không chặn được. Nên Context rất hợp cho giá trị ít đổi — giao diện, ngôn ngữ, người dùng đăng nhập, một hàm <code>dispatch</code>. Với state đổi thường xuyên và được nhiều component đọc, em dùng store có selector như Zustand hay Redux Toolkit; dữ liệu máy chủ thì TanStack Query. Nếu vẫn dùng context cho loại state đó, em bọc value bằng <code>useMemo</code> và tách state với hành động thành hai context.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> phòng khám muốn có chế độ "chữ to" cho bệnh nhân lớn tuổi. Dựng nó bằng context, đúng cách bài này đã làm.</p><ol>
<li>Tạo <code>src/co-chu/CoChuContext.tsx</code> với <code>createContext&lt;{ chuTo: boolean; doi: () =&gt; void } | null&gt;(null)</code>, một <code>CoChuProvider</code> giữ <code>chuTo</code> bằng <code>useState</code> và ghi nhớ value, và hook <code>useCoChu()</code> ném <code>'useCoChu() phải nằm trong &lt;CoChuProvider&gt;'</code> khi nhận <code>null</code>.</li>
<li>Bọc <code>App</code> trong provider. Thêm nút "Chữ to" vào <code>Header</code> với <code>aria-pressed={chuTo}</code>, và cho <code>TheBacSi</code> thêm class <code>chu-to</code> khi chế độ bật.</li>
<li>Viết ba test: bấm nút thì <code>aria-pressed</code> đổi và mọi <code>article</code> có class; render <code>TheBacSi</code> thiếu provider thì ném đúng câu của bạn; và — dùng bộ đếm như <code>demRender</code> — một component bọc <code>memo</code> KHÔNG đọc context chỉ render đúng một lần trong khi bạn bấm nút ba lần.</li>
</ol><p><strong>Đạt khi:</strong> <code>npx tsc -b</code> không in gì và ba test xanh; câu lỗi của test thứ hai đúng là câu bạn viết (không phải "Cannot read properties of null"); và bạn giải thích được, bằng con số của test thứ ba, vì sao component không đọc context không bị ảnh hưởng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">prop drilling (khoan prop)</span><span class="v">truyền một prop qua những component không dùng nó, chỉ để tới được con ở sâu</span></div>
<div class="kv"><span class="k">context (ngữ cảnh)</span><span class="v">đường ống cho component đọc giá trị do tổ tiên cung cấp, không cần props</span></div>
<div class="kv"><span class="k">provider (bên cung cấp)</span><span class="v">component đưa giá trị vào context: <code>&lt;Ctx value={…}&gt;</code> (React 19) hoặc <code>&lt;Ctx.Provider&gt;</code></span></div>
<div class="kv"><span class="k">consumer (bên đọc)</span><span class="v">component gọi <code>useContext(Ctx)</code> hoặc <code>use(Ctx)</code></span></div>
<div class="kv"><span class="k">default value (giá trị mặc định)</span><span class="v">thứ <code>useContext</code> trả về khi phía trên không có provider; dùng <code>null</code> + hook ném lỗi</span></div>
<div class="kv"><span class="k">re-render storm (cơn bão render)</span><span class="v">rất nhiều component render lại vì value của context là object mới mỗi lần render</span></div>
<div class="kv"><span class="k">split context (tách context)</span><span class="v">tách context cho state hay đổi và context cho hành động ổn định</span></div>
<div class="kv"><span class="k">non-null assertion (<code>!</code>)</span><span class="v">lời hứa chỉ có ở TypeScript rằng giá trị không <code>null</code>; không kiểm lúc chạy</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Khoan prop qua vài tầng là ổn; context dành cho giá trị mà nhiều component ở nhiều độ sâu cùng cần.</li>
<li>Ba bước: <code>createContext</code> ngoài component, <code>&lt;Ctx value={…}&gt;</code> ở trên, <code>useContext</code>/<code>use</code> ở dưới.</li>
<li>Mặc định <code>null</code> và đọc qua hook tự viết biết ném lỗi: thiếu provider là hỏng ngay lần render đầu thay vì im lặng không làm gì.</li>
<li>Khi value của provider đổi (theo <code>Object.is</code>), mọi bên đọc đều render lại — <code>memo</code> không chặn. Đo được: value viết thẳng +18 lần render thẻ cho 3 phím; value ghi nhớ +0.</li>
<li>Context không chọn được một lát: đổi một mục yêu thích ⇒ cả 6 thẻ render lại. Tách state và hành động để bảo vệ component chỉ làm việc.</li>
<li>Context hợp với giá trị ít đổi (giao diện, ngôn ngữ, người dùng, dispatch). State dùng chung hay đổi thì vào store có selector (5.3); dữ liệu máy chủ vào TanStack Query (Chương 6).</li>
</ul>

<a class="link-card" href="https://react.dev/learn/passing-data-deeply-with-context" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Passing Data Deeply with Context</span><span class="lc-sub">Prop drilling, ba bước, và những cách nên thử trước context.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/useContext" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — useContext</span><span class="lc-sub">Tài liệu tra cứu, có mục "Optimizing re-renders when passing objects and functions".</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/createContext" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — createContext</span><span class="lc-sub">Giá trị mặc định, và render chính context làm provider.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/use" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — use</span><span class="lc-sub">Đọc context bằng use(), gọi được cả trong điều kiện.</span></span></a>
<a class="link-card" href="https://react.dev/blog/2024/12/05/react-19" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — React v19</span><span class="lc-sub">Ghi chú phát hành cho &lt;Context&gt; làm provider.</span></span></a>
</div>
`,
  },
  {
    title: '5.2 — useReducer for complex state: actions, a pure reducer and a four-step booking flow|||5.2 — useReducer cho state phức tạp: hành động, reducer thuần và luồng đặt lịch bốn bước',
    slug: 'rx-5-2-reducer',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Ba useState rời để lọt trạng thái vô lý (đo thật), useReducer với union hành động và kiểm never (lỗi tsc thật), reducer thuần test không cần React, StrictMode gọi reducer hai lần, và reducer thật của luồng đặt lịch bốn bước.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>useReducer for complex state: actions, a pure reducer, and a booking flow that cannot get into an impossible state</h2>
<p class="lead">Some state is not one value but several values that must change <em>together</em>, by rules. A four-step booking flow is the textbook case: which step you are on, which doctor, which time slot, which patient details. With one <code>useState</code> per value, the rules live in the heads of whoever wrote each handler — until someone adds a handler and forgets one. <code>useReducer</code> moves every rule into a single pure function you can read top to bottom and test without React.</p>

<p>The examples are in <code>src/vi-du/bai2.tsx</code>, and the second half of the lesson walks through the real reducer of the project, <code>src/dat-lich/luong-dat-lich.ts</code>, which you will type yourself in Lesson 5.5. Outputs come from <code>npx vitest run src/vi-du/bai2.test.tsx src/dat-lich --reporter=verbose</code> and from <code>npx tsc -b</code>.</p>

<h3>Three useState calls, one rule nobody wrote down</h3>
${slide('rx-05', 8, 'Three separate useState calls: the doctor changes, the old doctor’s slot stays')}
<p>A small version of the flow first: step 1 picks a doctor, step 2 a time slot, step 3 confirms. The obvious way is three pieces of state:</p>
<pre><code class="language-tsx">/* ───────── 1. Ba useState rời ⇒ có thể rơi vào trạng thái "không thể" ───────── */
export function ChonLichNhieuState() {
  const [buoc, setBuoc] = useState&lt;1 | 2 | 3&gt;(1);
  const [bacSiId, setBacSiId] = useState&lt;string | null&gt;(null);
  const [khungGioId, setKhungGioId] = useState&lt;string | null&gt;(null);
  const bacSi = danhSachBacSi.find((bs) =&gt; bs.id === bacSiId);
  const khung = khungGioCuaBacSi(bacSiId ?? '').find((kg) =&gt; kg.id === khungGioId)
    ?? danhSachBacSi.flatMap((bs) =&gt; khungGioCuaBacSi(bs.id)).find((kg) =&gt; kg.id === khungGioId);

  if (buoc === 1)
    return (
      &lt;div&gt;
        {danhSachBacSi.slice(0, 2).map((bs) =&gt; (
          &lt;button key={bs.id} type="button" onClick={() =&gt; { setBacSiId(bs.id); setBuoc(2); }}&gt;{bs.ten}&lt;/button&gt;
        ))}
      &lt;/div&gt;
    );
  if (buoc === 2)
    return (
      &lt;div&gt;
        {khungGioCuaBacSi(bacSiId!).map((kg) =&gt; (
          &lt;button key={kg.id} type="button" onClick={() =&gt; { setKhungGioId(kg.id); setBuoc(3); }}&gt;{hienGio(kg.batDau)}&lt;/button&gt;
        ))}
        &lt;button type="button" onClick={() =&gt; setBuoc(1)}&gt;Quay lại&lt;/button&gt;
      &lt;/div&gt;
    );
  return (
    &lt;div&gt;
      &lt;p&gt;Xác nhận: {bacSi?.ten} — khung {khungGioId} ({khung &amp;&amp; hienGio(khung.batDau)})&lt;/p&gt;
      {/* Lối tắt thêm sau này: đổi nhanh bác sĩ ngay ở bước xác nhận — và quên bỏ khung giờ cũ */}
      &lt;button type="button" onClick={() =&gt; setBacSiId('bs-2')}&gt;Đổi sang BS. Trần Thu Hà&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>Every handler must keep an unwritten rule: <strong>if the doctor changes, the chosen slot must be dropped</strong>, because slots belong to one doctor. The step-1 buttons happen to respect it (the slot is chosen again in step 2). Then, months later, someone adds a shortcut on the confirmation screen, "Switch to BS. Trần Thu Hà", and writes the obvious one line. The test clicks BS. An, picks 08:00, then the shortcut:</p>
<div class="out">[nhieu state] Xác nhận: BS. Trần Thu Hà — khung bs-1-kg-1 (08:00 · 01/10/2026)</div>
<p>The screen now confirms an appointment with BS. Hà in slot <code>bs-1-kg-1</code> — a slot that belongs to BS. An. Nothing crashed; every component did exactly what it was told. The bug is an <strong>impossible state</strong>: a combination of values that should never exist, reached because the rule that forbids it was spread across handlers instead of written in one place.</p>
<div class="callout"><p><strong>JS quick reminder — <code>??</code> and <code>?.</code>.</strong> <code>a ?? b</code> gives <code>a</code> unless it is <code>null</code> or <code>undefined</code>, in which case it gives <code>b</code> (so <code>bacSiId ?? ''</code> turns "no doctor" into an empty string). <code>bacSi?.ten</code> reads <code>ten</code> only if <code>bacSi</code> exists, otherwise gives <code>undefined</code> instead of crashing. Both are covered in Section 0 (Lesson 0.3).</p></div>

<h3>A reducer: every way the state may change, in one function</h3>
${slide('rx-05', 9, 'dispatch(action) → reducer(state, action) → new state')}
<p>With <code>useReducer</code>, components stop <em>setting</em> state. They <strong>dispatch actions</strong> — small objects that describe what happened ("the user chose doctor bs-2") — and one function, the <strong>reducer</strong>, decides what the next state is:</p>
<pre><code class="language-tsx">/* ───────── 2. Một reducer: mọi cách state được phép đổi nằm ở MỘT chỗ ───────── */
export interface ChonLich {
  buoc: 1 | 2 | 3;
  bacSiId: string | null;
  khungGioId: string | null;
}
export type HanhDong =
  | { type: 'chon-bac-si'; bacSiId: string }
  | { type: 'chon-khung-gio'; khungGioId: string }
  | { type: 'quay-lai' };

export const BAN_DAU: ChonLich = { buoc: 1, bacSiId: null, khungGioId: null };

export function chonLichReducer(state: ChonLich, action: HanhDong): ChonLich {
  switch (action.type) {
    case 'chon-bac-si':
      // Đổi bác sĩ ⇒ khung giờ cũ (của bác sĩ khác) PHẢI bỏ. Luật này sống ở đây, không rải trong các handler.
      return { buoc: 2, bacSiId: action.bacSiId, khungGioId: null };
    case 'chon-khung-gio':
      if (state.bacSiId === null) return state; // chưa chọn bác sĩ thì bỏ qua
      return { ...state, buoc: 3, khungGioId: action.khungGioId };
    case 'quay-lai':
      return state.buoc === 1 ? state : { ...state, buoc: (state.buoc - 1) as 1 | 2 };
    default: {
      const conSot: never = action; // thêm loại hành động mà quên xử lý ⇒ tsc báo ngay dòng này
      return conSot;
    }
  }
}</code></pre>
<p>Three parts:</p>
<ul>
<li><strong>The state</strong> <code>ChonLich</code> — one object with everything the flow remembers.</li>
<li><strong>The actions</strong> <code>HanhDong</code> — a TypeScript union of every event that can happen. Each has a <code>type</code> string and whatever data it needs.</li>
<li><strong>The reducer</strong> <code>chonLichReducer(state, action)</code> — takes the current state and one action, returns the next state. The rule "new doctor ⇒ no slot" is now one line, <code>khungGioId: null</code>, in the only place that can change the doctor.</li>
</ul>
<p>The component wires it up with one hook and calls <code>dispatch</code> instead of setters:</p>
<pre><code class="language-tsx">export function ChonLichReducer({ onLog }: { onLog?: (s: string) =&gt; void }) {
  const [state, dispatch] = useReducer(chonLichReducer, BAN_DAU);
  const bacSi = danhSachBacSi.find((bs) =&gt; bs.id === state.bacSiId);
  const khung = khungGioCuaBacSi(state.bacSiId ?? '').find((kg) =&gt; kg.id === state.khungGioId);

  if (state.buoc === 1)
    return (
      &lt;div&gt;
        {danhSachBacSi.slice(0, 2).map((bs) =&gt; (
          &lt;button
            key={bs.id}
            type="button"
            onClick={() =&gt; {
              dispatch({ type: 'chon-bac-si', bacSiId: bs.id });
              onLog?.(&#96;ngay sau dispatch: buoc = &#36;{state.buoc}&#96;); // vẫn là ảnh chụp CŨ
            }}
          &gt;
            {bs.ten}
          &lt;/button&gt;
        ))}
      &lt;/div&gt;
    );</code></pre>
<p>The same shortcut button now dispatches <code>{ type: 'chon-bac-si', bacSiId: 'bs-2' }</code>. It cannot forget the rule, because it does not implement the rule:</p>
<div class="out">[reducer] sau khi doi: 08:00 · 01/10/2026 | 09:30 · 01/10/2026 | 14:00 · 01/10/2026 | Quay lại</div>
<p>Back on step 2, with BS. Hà&#39;s slots. The impossible state is not handled — it is <em>unreachable</em>.</p>
<p><strong>Try it step by step</strong> — one click on "BS. Nguyễn Minh An":</p>
<ol>
<li>The handler calls <code>dispatch({ type: 'chon-bac-si', bacSiId: 'bs-1' })</code>. Nothing changes yet: dispatch only queues the action (exactly like a setter in Lesson 2.1).</li>
<li>React calls <code>chonLichReducer(currentState, thatAction)</code>. It returns <code>{ buoc: 2, bacSiId: 'bs-1', khungGioId: null }</code>.</li>
<li>The new object is different from the old one (<code>Object.is</code>), so React re-renders the component with it. Had the reducer returned the <em>same</em> object — as it does for a slot chosen before any doctor — React would skip the re-render.</li>
<li>The handler&#39;s own <code>state</code> is still the snapshot of the render it belongs to. The test logs it right after dispatching:</li>
</ol>
<div class="out">[reducer ui] Xác nhận: BS. Trần Thu Hà — khung bs-2-kg-3 (14:00 · 01/10/2026) | log: [ 'ngay sau dispatch: buoc = 1', 'ngay sau dispatch: buoc = 1' ]</div>
<p>Both clicks logged <code>buoc = 1</code>: the same snapshot rule as <code>useState</code>. If you need the next value inside the handler, compute it yourself (<code>chonLichReducer(state, action)</code> is a plain function — you can call it).</p>
${SD.dispatchEn}
<div class="callout"><p><strong>JS quick reminder — why "reducer"?</strong> The name comes from the array method <code>reduce</code>: <code>[1, 2, 3].reduce((tong, x) =&gt; tong + x, 0)</code> walks the array and "reduces" it to one value, carrying an accumulator along. A React reducer has the same shape — <code>(stateSoFar, nextAction) =&gt; newState</code> — and the project&#39;s tests use exactly that: <code>danhSachHanhDong.reduce(luongDatLichReducer, LUONG_BAN_DAU)</code> replays a list of actions to get the final state.</p></div>

<h3>A union of actions plus <code>never</code>: forget a case and tsc tells you</h3>
${slide('rx-05', 10, 'Action union + never: a forgotten case is a compile error')}
<p><code>HanhDong</code> is a <strong>discriminated union</strong>: several object types that share one field (<code>type</code>) with a different literal value in each. Inside <code>switch (action.type)</code>, TypeScript narrows the action in every <code>case</code>: after <code>case 'chon-bac-si':</code> it knows <code>action.bacSiId</code> exists, and after <code>case 'quay-lai':</code> it knows there is no such field.</p>
<p>The <code>default</code> branch is a small trick. If every <code>case</code> is handled, the only type left for <code>action</code> is <code>never</code> — "a value that cannot exist" — so <code>const conSot: never = action</code> compiles. Add a new action type and forget its case, and <code>action</code> is no longer <code>never</code> there. To see it, a copy of the reducer got a fourth action <code>'lam-lai'</code> with no case, plus a call with a typo in the action type:</p>
<div class="out">$ npx tsc -b
src/vi-du/thieu-case.ts(18,13): error TS2322: Type '{ type: "lam-lai"; }' is not assignable to type 'never'.
src/vi-du/thieu-case.ts(25,27): error TS2820: Type '"chon-bac-sy"' is not assignable to type '"chon-bac-si" | "chon-khung-gio" | "quay-lai" | "lam-lai"'. Did you mean '"chon-bac-si"'?</div>
<p>Two free safety nets: a forgotten case is a compile error pointing at the <code>default</code>, and a misspelled action type is caught at the <code>dispatch</code> call, with a suggestion. In JavaScript-only Redux code (the kind in many FER202 labs), both of these are silent: the reducer just returns the old state and the button "does nothing".</p>

<h3>Pure reducers: test without React, and let StrictMode catch mutation</h3>
${slide('rx-05', 11, 'Pure reducer: tests without React, StrictMode exposes mutation')}
<p>A reducer must be <strong>pure</strong>: same state and action in, same result out; no API calls, no timers, no <code>Date.now()</code>, no changing the old state. That rule has two pay-offs. The first: a pure function is tested like any function — no rendering, no clicking:</p>
<pre><code class="language-tsx">describe('chonLichReducer — hàm thuần, test không cần React', () =&gt; {
  test('chọn bác sĩ ⇒ sang bước 2, khung giờ về null', () =&gt; {
    const s = chonLichReducer({ buoc: 3, bacSiId: 'bs-1', khungGioId: 'bs-1-kg-1' }, { type: 'chon-bac-si', bacSiId: 'bs-2' });
    console.info('[reducer] doi bac si:', JSON.stringify(s));
    expect(s).toEqual({ buoc: 2, bacSiId: 'bs-2', khungGioId: null });
  });
  test('chọn khung giờ khi chưa có bác sĩ ⇒ trả lại CHÍNH state cũ', () =&gt; {
    const s = chonLichReducer(BAN_DAU, { type: 'chon-khung-gio', khungGioId: 'bs-1-kg-1' });
    console.info('[reducer] khung gio khi chua co bac si: s === BAN_DAU -&gt;', s === BAN_DAU);
    expect(s).toBe(BAN_DAU);
  });
  test('quay lại ở bước 1 ⇒ không đổi; không sửa state cũ', () =&gt; {
    const cu = Object.freeze({ buoc: 2 as const, bacSiId: 'bs-1', khungGioId: null });
    const moi = chonLichReducer(cu, { type: 'quay-lai' });
    expect(moi).toEqual({ buoc: 1, bacSiId: 'bs-1', khungGioId: null });
    expect(chonLichReducer(moi, { type: 'quay-lai' })).toBe(moi);
  });
});</code></pre>
<div class="out">[reducer] doi bac si: {"buoc":2,"bacSiId":"bs-2","khungGioId":null}
[reducer] khung gio khi chua co bac si: s === BAN_DAU -&gt; true</div>
<p><code>Object.freeze</code> makes an object read-only (in strict mode, writing to it throws); passing a frozen state is a cheap way to prove the reducer never edits the old one. And returning <em>the same object</em> for an ignored action (<code>s === BAN_DAU</code> is <code>true</code>) is what lets React skip the re-render.</p>
<p>The second pay-off is StrictMode. In development, <code>&lt;StrictMode&gt;</code> (which Vite&#39;s <code>main.tsx</code> puts around your app) calls your reducer <strong>twice</strong> for each action and keeps one result. A pure reducer does not care. A reducer that mutates does:</p>
<pre><code class="language-tsx">/* ───────── 3. Reducer KHÔNG thuần + StrictMode ⇒ lộ ra ở chế độ dev ───────── */
interface NhatKy { lichSu: string[] }
type GhiNhatKy = { type: 'ghi'; dong: string };
function reducerDotBien(state: NhatKy, action: GhiNhatKy): NhatKy {
  state.lichSu.push(action.dong); // ❌ sửa mảng của state cũ
  return { lichSu: state.lichSu };
}
function reducerThuan(state: NhatKy, action: GhiNhatKy): NhatKy {
  return { lichSu: [...state.lichSu, action.dong] }; // ✅ mảng mới
}</code></pre>
<div class="out">[strict] 2 cu bam Ghi ⇒ dot bien: Số dòng: 2 | dot bien + StrictMode: Số dòng: 4 | thuan + StrictMode: Số dòng: 2</div>
<div class="pitfall co-tieu-de"><strong>Trap — a reducer that edits the old state.</strong> <code>state.lichSu.push(…)</code> "works" without StrictMode: two clicks, two lines. With StrictMode, two clicks give four lines, because the second call pushes onto the same array again. That is StrictMode doing its job: showing, in development, that the reducer is not pure. The fix is the one from Lesson 2.3 — return a new array (<code>[...state.lichSu, action.dong]</code>). Never "fix" it by removing StrictMode: the bug is still there, just hidden. Production builds call the reducer once.</div>
<p>So where do side effects go — the API call that actually books the appointment? Into the <strong>event handler</strong>, which is allowed to be impure. The handler dispatches "sending started", awaits the request, then dispatches the result. You will see exactly this in the project&#39;s <code>LuongDatLich</code> below.</p>

<h3>The project&#39;s reducer: a four-step booking flow</h3>
<p>Now the real one. Lesson 5.5 has you type it; here is what it contains and why. The flow has four steps — doctor, time slot, patient details (the <code>FormDatLich</code> from Chapter 3), confirmation — plus sending, an error from the server, and success:</p>
<pre><code class="language-ts">import type { DatLich } from '../schema/dat-lich';
import type { LichHen } from '../types';

export type Buoc = 1 | 2 | 3 | 4;

/** Mọi thứ luồng đặt lịch 4 bước cần nhớ — MỘT object, đổi qua MỘT hàm. */
export interface LuongDatLich {
  buoc: Buoc;
  bacSiId: string | null;
  khungGioId: string | null;
  thongTin: DatLich | null; // họ tên, SĐT, ngày sinh, lý do — từ FormDatLich (Chương 3)
  dangGui: boolean;
  loiGui: string | null;
  daDat: LichHen | null; // khác null ⇒ đã xong, hiện màn "Đặt lịch thành công"
}

export type HanhDongDatLich =
  | { type: 'chon-bac-si'; bacSiId: string }
  | { type: 'chon-khung-gio'; khungGioId: string }
  | { type: 'nhap-thong-tin'; thongTin: DatLich }
  | { type: 'quay-lai' }
  | { type: 'bat-dau-gui' }
  | { type: 'gui-loi'; thongBao: string }
  | { type: 'gui-xong'; lichHen: LichHen }
  | { type: 'lam-lai' };

export const LUONG_BAN_DAU: LuongDatLich = {
  buoc: 1,
  bacSiId: null,
  khungGioId: null,
  thongTin: null,
  dangGui: false,
  loiGui: null,
  daDat: null,
};

/** Reducer THUẦN: không gọi API, không đọc giờ, không sửa state cũ — chỉ (state, action) → state mới. */
export function luongDatLichReducer(state: LuongDatLich, action: HanhDongDatLich): LuongDatLich {
  if (state.dangGui &amp;&amp; action.type !== 'gui-loi' &amp;&amp; action.type !== 'gui-xong') return state; // đang gửi: khoá luồng

  switch (action.type) {
    case 'chon-bac-si':
      // Đổi bác sĩ ⇒ khung giờ cũ thuộc bác sĩ khác ⇒ bỏ. Thông tin bệnh nhân thì giữ (vẫn là người đó).
      return { ...state, buoc: 2, bacSiId: action.bacSiId, khungGioId: state.bacSiId === action.bacSiId ? state.khungGioId : null };
    case 'chon-khung-gio':
      if (state.bacSiId === null) return state;
      return { ...state, buoc: 3, khungGioId: action.khungGioId };
    case 'nhap-thong-tin':
      if (state.khungGioId === null) return state;
      return { ...state, buoc: 4, thongTin: action.thongTin, loiGui: null };
    case 'quay-lai':
      return state.buoc === 1 ? state : { ...state, buoc: (state.buoc - 1) as Buoc, loiGui: null };
    case 'bat-dau-gui':
      if (state.buoc !== 4 || state.thongTin === null) return state;
      return { ...state, dangGui: true, loiGui: null };
    case 'gui-loi':
      return { ...state, dangGui: false, loiGui: action.thongBao };
    case 'gui-xong':
      return { ...state, dangGui: false, daDat: action.lichHen };
    case 'lam-lai':
      return LUONG_BAN_DAU;
    default: {
      const conSot: never = action; // quên một loại hành động ⇒ tsc báo ở đây
      return conSot;
    }
  }
}</code></pre>
<p>Decisions worth reading twice:</p>
<ul>
<li><strong>Changing doctor keeps the patient&#39;s details, drops the slot</strong> — unless it is the same doctor again, in which case the slot stays. Both rules are in one expression and each has a test.</li>
<li><strong>Actions out of order are ignored</strong> by returning the same state: choosing a slot with no doctor, entering details with no slot, sending before step 4. The UI never offers these buttons, but the reducer does not trust the UI.</li>
<li><strong>While sending, the flow is locked</strong>: the first line ignores every action except the two that end the sending. Double-clicking "Back" during a request cannot move you to step 3 with a request still in flight.</li>
<li><strong>The API call is not here.</strong> The reducer only records <code>dangGui</code>, <code>loiGui</code> and <code>daDat</code>. The call happens in the component&#39;s handler:</li>
</ul>
<pre><code class="language-tsx">export function LuongDatLich() {
  const [state, dispatch] = useReducer(luongDatLichReducer, LUONG_BAN_DAU);
  const themLichHen = useDatLichStore((s) =&gt; s.themLichHen); // chỉ lấy HÀNH ĐỘNG ⇒ không render lại khi danh sách đổi
  const bacSi = danhSachBacSi.find((bs) =&gt; bs.id === state.bacSiId) ?? null;
  const khungGio = khungGioCuaBacSi(state.bacSiId ?? '').find((kg) =&gt; kg.id === state.khungGioId) ?? null;

  async function xacNhan() {
    if (!bacSi || !khungGio || !state.thongTin) return;
    dispatch({ type: 'bat-dau-gui' });
    try {
      const lichHen = await guiYeuCauDatLich(bacSi.id, state.thongTin, khungGio.id);
      themLichHen(lichHen); // store toàn app: Header, "Lịch hẹn của tôi" tự cập nhật
      dispatch({ type: 'gui-xong', lichHen });
    } catch (loi) {
      dispatch({ type: 'gui-loi', thongBao: loi instanceof Error ? loi.message : 'Gửi không thành công' });
    }
  }</code></pre>
${SD.luongEn}
<p>(<code>useDatLichStore</code> is the Zustand store from the next lesson; ignore it for now.) The tests replay action lists through the reducer with <code>reduce</code>:</p>
<pre><code class="language-ts">import { describe, expect, test } from 'vitest';
import type { DatLich } from '../schema/dat-lich';
import { LUONG_BAN_DAU, luongDatLichReducer, type HanhDongDatLich, type LuongDatLich } from './luong-dat-lich';

const thongTin: DatLich = {
  benhNhan: { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567', ngaySinh: '1995-03-14' },
  lyDo: 'Bé ho khan 3 ngày',
};
/** Chạy lần lượt nhiều hành động — đúng cái React làm, chỉ là không cần React. */
const chay = (...ds: HanhDongDatLich[]): LuongDatLich =&gt; ds.reduce(luongDatLichReducer, LUONG_BAN_DAU);

describe('luongDatLichReducer', () =&gt; {
  test('đi đủ 4 bước', () =&gt; {
    const s = chay(
      { type: 'chon-bac-si', bacSiId: 'bs-2' },
      { type: 'chon-khung-gio', khungGioId: 'bs-2-kg-1' },
      { type: 'nhap-thong-tin', thongTin },
    );
    expect(s).toMatchObject({ buoc: 4, bacSiId: 'bs-2', khungGioId: 'bs-2-kg-1', thongTin });
  });

  test('đổi sang bác sĩ KHÁC ⇒ bỏ khung giờ cũ, giữ thông tin bệnh nhân', () =&gt; {
    const s = chay(
      { type: 'chon-bac-si', bacSiId: 'bs-2' },
      { type: 'chon-khung-gio', khungGioId: 'bs-2-kg-1' },
      { type: 'nhap-thong-tin', thongTin },
      { type: 'quay-lai' },
      { type: 'quay-lai' },
      { type: 'quay-lai' },
      { type: 'chon-bac-si', bacSiId: 'bs-4' },
    );
    expect(s).toMatchObject({ buoc: 2, bacSiId: 'bs-4', khungGioId: null, thongTin });
  });</code></pre>
<div class="out"> ✓ src/dat-lich/luong-dat-lich.test.ts &gt; luongDatLichReducer &gt; đi đủ 4 bước
 ✓ src/dat-lich/luong-dat-lich.test.ts &gt; luongDatLichReducer &gt; đổi sang bác sĩ KHÁC ⇒ bỏ khung giờ cũ, giữ thông tin bệnh nhân
 ✓ src/dat-lich/luong-dat-lich.test.ts &gt; luongDatLichReducer &gt; chọn lại ĐÚNG bác sĩ cũ ⇒ giữ khung giờ đã chọn
 ✓ src/dat-lich/luong-dat-lich.test.ts &gt; luongDatLichReducer &gt; hành động sai thứ tự bị bỏ qua (trả CHÍNH state cũ)
 ✓ src/dat-lich/luong-dat-lich.test.ts &gt; luongDatLichReducer &gt; đang gửi thì khoá: quay lại / chọn bác sĩ đều bị bỏ qua
 ✓ src/dat-lich/luong-dat-lich.test.ts &gt; luongDatLichReducer &gt; không bao giờ sửa state cũ (đông cứng mà vẫn chạy)
 ✓ src/dat-lich/luong-dat-lich.test.ts &gt; luongDatLichReducer &gt; làm lại ⇒ về đúng trạng thái ban đầu

 Test Files  1 passed (1)
      Tests  7 passed (7)</div>
<div class="callout"><p><strong>JS quick reminder — rest parameters.</strong> <code>const chay = (...ds: HanhDongDatLich[]) =&gt; …</code>: the three dots in a parameter list collect <em>all</em> arguments into one array, so <code>chay(a, b, c)</code> gives <code>ds = [a, b, c]</code>. Same dots as spread (Lesson 2.3), opposite direction: spread takes an array apart, rest gathers values into one.</p></div>

<h3>useState or useReducer: count the rules, not the variables</h3>
${slide('rx-05', 12, 'useState or useReducer: count rules, not variables')}
<table>
<thead><tr><th></th><th>useState</th><th>useReducer</th></tr></thead>
<tbody>
<tr><td>Amount of code</td><td>small</td><td>more (action types + reducer)</td></tr>
<tr><td>Where update logic lives</td><td>spread over handlers</td><td>one function, read top to bottom</td></tr>
<tr><td>Values that must change together</td><td>easy to let drift apart</td><td>the rule lives in the reducer</td></tr>
<tr><td>Testing the logic</td><td>render and click</td><td>call a pure function</td></tr>
<tr><td>Debugging</td><td>"who set this?"</td><td>log every action</td></tr>
</tbody>
</table>
<p>A useful test: if you can describe a change of state as <em>an event</em> ("the user chose a slot") and one event must update several values by a rule, use a reducer. A text box, a toggle, a counter — <code>useState</code>. Mixing is normal: <code>LuongDatLich</code> uses a reducer for the flow, while <code>KhuBacSi</code> keeps its "doctor being viewed" in a plain <code>useState</code>.</p>
<p>When many components deep in the tree need to dispatch, combine this lesson with the previous one: put <code>dispatch</code> in a context. It never changes identity, so — as measured in 5.1 — components that only dispatch never re-render because of it:</p>
<pre><code class="language-tsx">const DispatchDatLich = createContext&lt;Dispatch&lt;HanhDongDatLich&gt; | null&gt;(null);
// trong component giữ reducer:
&lt;DispatchDatLich value={dispatch}&gt;{children}&lt;/DispatchDatLich&gt;</code></pre>
<p>react.dev calls this "scaling up with reducer and context". This project does not need it — the flow lives in one component — but you will see it in codebases that predate Zustand.</p>
${SD.chonEn}

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202 teaches reducers through Redux: <code>const ADD_TODO = 'ADD_TODO'</code> constants, action creator functions, a <code>switch</code> in a reducer, a global store created once, <code>connect</code> or <code>useSelector</code>/<code>useDispatch</code>, and thunk for async. → At work, the reducer idea is the same, but where it lives depends on scope: a complex flow inside one screen uses <code>useReducer</code> right in the component (no store, no boilerplate); actions are typed as a TypeScript union instead of string constants; async work stays in handlers or in TanStack Query; app-wide client state goes to Zustand. Existing Redux projects use Redux Toolkit&#39;s <code>createSlice</code>, which generates actions for you and lets you "mutate" thanks to Immer (Lesson 2.3). · <em>Why:</em> a booking flow that one screen owns has no reason to live in a global store where every other screen can dispatch into it. What you learned about reducers in FER202 is not wasted: reading a <code>createSlice</code> or writing <code>useReducer</code> is the same skill.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "When do you choose useReducer over useState? Why must a reducer be pure?"</p>
<p>I use <code>useReducer</code> when several state values change together according to rules — a multi-step form, a flow with loading/error/success — so the rules live in one function instead of being repeated in every handler, and impossible combinations become unreachable. With TypeScript I type actions as a discriminated union and add a <code>never</code> check so a missing case fails to compile. The reducer must be pure because React may call it more than once — StrictMode calls it twice in development — and because returning a new object is how React knows something changed; if it mutated the old state, <code>Object.is</code> would say "same" and the UI would not update. Side effects like API calls go in event handlers, which then dispatch the result. A bonus: a pure reducer is unit-tested without rendering anything.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> copy the small flow from this lesson (<code>ChonLich</code>, <code>HanhDong</code>, <code>chonLichReducer</code>, <code>ChonLichReducer</code>) into <code>src/vi-du/bai2.tsx</code> of your project, give it a "Start over" button, and let the type system guide you.</p><ol>
<li>Add <code>| { type: 'lam-lai' }</code> to <code>HanhDong</code>, but do not touch the reducer yet. Run <code>npx tsc -b</code> and copy the error.</li>
<li>Handle the case: <code>'lam-lai'</code> returns <code>BAN_DAU</code>. Add a "Làm lại" button on step 3 that dispatches it.</li>
<li>Write a test that uses <code>reduce</code> to replay <code>chon-bac-si</code>, <code>chon-khung-gio</code>, <code>lam-lai</code>, and checks the result <code>toBe(BAN_DAU)</code> — the very same object.</li>
<li>Bonus: write a deliberately impure version (<code>state.buoc = 1; return state;</code>) and explain, with a test, why the screen does not change.</li>
</ol><p><strong>Done when:</strong> step 1 printed <code>error TS2322: Type '{ type: "lam-lai"; }' is not assignable to type 'never'.</code> (your line numbers may differ); after step 2, <code>npx tsc -b</code> prints nothing; your <code>reduce</code> test is green; and for the bonus, your test shows the reducer returned the same object, so React skipped the render.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">reducer</span><span class="v">a pure function <code>(state, action) =&gt; newState</code> holding every rule for changing a state</span></div>
<div class="kv"><span class="k">action</span><span class="v">an object describing what happened: <code>{ type: 'chon-bac-si', bacSiId }</code></span></div>
<div class="kv"><span class="k">dispatch</span><span class="v">the function from <code>useReducer</code> that sends an action; its identity never changes</span></div>
<div class="kv"><span class="k">impossible state</span><span class="v">a combination of values that should never exist (BS. Hà with BS. An&#39;s slot)</span></div>
<div class="kv"><span class="k">discriminated union</span><span class="v">object types sharing a literal field (<code>type</code>) that TypeScript can narrow on</span></div>
<div class="kv"><span class="k"><code>never</code> (exhaustiveness check)</span><span class="v">the type left when every case is handled; a missing case becomes a compile error</span></div>
<div class="kv"><span class="k">pure function</span><span class="v">same input ⇒ same output, no side effects, does not modify its arguments</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Several values that change together by rules drift apart when each handler updates them itself — measured: BS. Hà confirmed with BS. An&#39;s slot.</li>
<li><code>useReducer(reducer, initial)</code> returns <code>[state, dispatch]</code>; components dispatch actions, the reducer alone decides the next state.</li>
<li>Type actions as a discriminated union and end the <code>switch</code> with a <code>never</code> check: forgotten cases and typos become compile errors (TS2322, TS2820).</li>
<li>Reducers must be pure: no API calls, no mutation. StrictMode calls them twice in development — a mutating reducer wrote 4 lines for 2 clicks. Side effects go in handlers.</li>
<li>A pure reducer is tested without React; <code>actions.reduce(reducer, initial)</code> replays a whole scenario.</li>
<li>Choose by rules, not variable count; for deep trees, put <code>dispatch</code> (stable) in a context.</li>
</ul>

<a class="link-card" href="https://react.dev/learn/extracting-state-logic-into-a-reducer" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Extracting State Logic into a Reducer</span><span class="lc-sub">From setters to actions in three steps, and comparing useState with useReducer.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/useReducer" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — useReducer</span><span class="lc-sub">Reference, including "My reducer or initializer function runs twice".</span></span></a>
<a class="link-card" href="https://react.dev/learn/scaling-up-with-reducer-and-context" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Scaling Up with Reducer and Context</span><span class="lc-sub">Putting state and dispatch into two contexts.</span></span></a>
<a class="link-card" href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">TypeScript Handbook — Narrowing</span><span class="lc-sub">Discriminated unions and exhaustiveness checking with never.</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>useReducer cho state phức tạp: hành động, reducer thuần, và luồng đặt lịch không thể rơi vào trạng thái vô lý</h2>
<p class="lead">Có những state không phải một giá trị mà là nhiều giá trị phải đổi <em>cùng nhau</em>, theo luật. Luồng đặt lịch bốn bước là ví dụ kinh điển: đang ở bước nào, bác sĩ nào, khung giờ nào, thông tin bệnh nhân gì. Mỗi giá trị một <code>useState</code> thì luật nằm trong đầu người viết từng handler — cho tới khi ai đó thêm một handler và quên một luật. <code>useReducer</code> dồn mọi luật vào một hàm thuần duy nhất, đọc được từ trên xuống dưới và test được mà không cần React.</p>

<p>Ví dụ nằm ở <code>src/vi-du/bai2.tsx</code>, và nửa sau bài đi qua reducer thật của dự án, <code>src/dat-lich/luong-dat-lich.ts</code>, thứ bạn sẽ tự gõ ở Bài 5.5. Output lấy từ <code>npx vitest run src/vi-du/bai2.test.tsx src/dat-lich --reporter=verbose</code> và từ <code>npx tsc -b</code>.</p>

<h3>Ba useState, một luật không ai viết ra</h3>
${slide('rx-05', 8, 'Ba useState rời: đổi bác sĩ mà khung giờ của bác sĩ cũ vẫn ở lại')}
<p>Bản nhỏ của luồng trước: bước 1 chọn bác sĩ, bước 2 chọn khung giờ, bước 3 xác nhận. Cách hiển nhiên là ba mẩu state:</p>
<pre><code class="language-tsx">/* ───────── 1. Ba useState rời ⇒ có thể rơi vào trạng thái "không thể" ───────── */
export function ChonLichNhieuState() {
  const [buoc, setBuoc] = useState&lt;1 | 2 | 3&gt;(1);
  const [bacSiId, setBacSiId] = useState&lt;string | null&gt;(null);
  const [khungGioId, setKhungGioId] = useState&lt;string | null&gt;(null);
  const bacSi = danhSachBacSi.find((bs) =&gt; bs.id === bacSiId);
  const khung = khungGioCuaBacSi(bacSiId ?? '').find((kg) =&gt; kg.id === khungGioId)
    ?? danhSachBacSi.flatMap((bs) =&gt; khungGioCuaBacSi(bs.id)).find((kg) =&gt; kg.id === khungGioId);

  if (buoc === 1)
    return (
      &lt;div&gt;
        {danhSachBacSi.slice(0, 2).map((bs) =&gt; (
          &lt;button key={bs.id} type="button" onClick={() =&gt; { setBacSiId(bs.id); setBuoc(2); }}&gt;{bs.ten}&lt;/button&gt;
        ))}
      &lt;/div&gt;
    );
  if (buoc === 2)
    return (
      &lt;div&gt;
        {khungGioCuaBacSi(bacSiId!).map((kg) =&gt; (
          &lt;button key={kg.id} type="button" onClick={() =&gt; { setKhungGioId(kg.id); setBuoc(3); }}&gt;{hienGio(kg.batDau)}&lt;/button&gt;
        ))}
        &lt;button type="button" onClick={() =&gt; setBuoc(1)}&gt;Quay lại&lt;/button&gt;
      &lt;/div&gt;
    );
  return (
    &lt;div&gt;
      &lt;p&gt;Xác nhận: {bacSi?.ten} — khung {khungGioId} ({khung &amp;&amp; hienGio(khung.batDau)})&lt;/p&gt;
      {/* Lối tắt thêm sau này: đổi nhanh bác sĩ ngay ở bước xác nhận — và quên bỏ khung giờ cũ */}
      &lt;button type="button" onClick={() =&gt; setBacSiId('bs-2')}&gt;Đổi sang BS. Trần Thu Hà&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>Mọi handler phải giữ một luật không viết ra: <strong>đổi bác sĩ thì khung giờ đã chọn phải bỏ</strong>, vì khung giờ thuộc về một bác sĩ. Các nút ở bước 1 tình cờ giữ đúng luật (khung giờ được chọn lại ở bước 2). Rồi vài tháng sau, ai đó thêm một lối tắt ở màn xác nhận, "Đổi sang BS. Trần Thu Hà", và viết đúng một dòng hiển nhiên. Test bấm BS. An, chọn 08:00, rồi bấm lối tắt:</p>
<div class="out">[nhieu state] Xác nhận: BS. Trần Thu Hà — khung bs-1-kg-1 (08:00 · 01/10/2026)</div>
<p>Màn hình giờ xác nhận một lịch hẹn với BS. Hà ở khung <code>bs-1-kg-1</code> — khung của BS. An. Không gì sập; component nào cũng làm đúng điều được bảo. Bug là một <strong>trạng thái vô lý (impossible state)</strong>: một tổ hợp giá trị lẽ ra không bao giờ tồn tại, lọt vào được vì luật cấm nó bị rải khắp các handler thay vì viết ở một chỗ.</p>
<div class="callout"><p><strong>JS nhắc nhanh — <code>??</code> và <code>?.</code>.</strong> <code>a ?? b</code> cho <code>a</code>, trừ khi <code>a</code> là <code>null</code> hoặc <code>undefined</code> thì cho <code>b</code> (nên <code>bacSiId ?? ''</code> biến "chưa có bác sĩ" thành chuỗi rỗng). <code>bacSi?.ten</code> chỉ đọc <code>ten</code> khi <code>bacSi</code> tồn tại, không thì cho <code>undefined</code> thay vì sập. Cả hai có ở Mục 0 (Bài 0.3).</p></div>

<h3>Một reducer: mọi cách state được phép đổi, trong một hàm</h3>
${slide('rx-05', 9, 'dispatch(action) → reducer(state, action) → state mới')}
<p>Với <code>useReducer</code>, component thôi <em>đặt</em> state. Chúng <strong>gửi hành động (dispatch action)</strong> — những object nhỏ tả điều vừa xảy ra ("người dùng chọn bác sĩ bs-2") — và một hàm duy nhất, <strong>reducer</strong>, quyết định state tiếp theo:</p>
<pre><code class="language-tsx">/* ───────── 2. Một reducer: mọi cách state được phép đổi nằm ở MỘT chỗ ───────── */
export interface ChonLich {
  buoc: 1 | 2 | 3;
  bacSiId: string | null;
  khungGioId: string | null;
}
export type HanhDong =
  | { type: 'chon-bac-si'; bacSiId: string }
  | { type: 'chon-khung-gio'; khungGioId: string }
  | { type: 'quay-lai' };

export const BAN_DAU: ChonLich = { buoc: 1, bacSiId: null, khungGioId: null };

export function chonLichReducer(state: ChonLich, action: HanhDong): ChonLich {
  switch (action.type) {
    case 'chon-bac-si':
      // Đổi bác sĩ ⇒ khung giờ cũ (của bác sĩ khác) PHẢI bỏ. Luật này sống ở đây, không rải trong các handler.
      return { buoc: 2, bacSiId: action.bacSiId, khungGioId: null };
    case 'chon-khung-gio':
      if (state.bacSiId === null) return state; // chưa chọn bác sĩ thì bỏ qua
      return { ...state, buoc: 3, khungGioId: action.khungGioId };
    case 'quay-lai':
      return state.buoc === 1 ? state : { ...state, buoc: (state.buoc - 1) as 1 | 2 };
    default: {
      const conSot: never = action; // thêm loại hành động mà quên xử lý ⇒ tsc báo ngay dòng này
      return conSot;
    }
  }
}</code></pre>
<p>Ba phần:</p>
<ul>
<li><strong>State</strong> <code>ChonLich</code> — một object chứa mọi thứ luồng cần nhớ.</li>
<li><strong>Hành động</strong> <code>HanhDong</code> — một union TypeScript gồm mọi sự kiện có thể xảy ra. Mỗi cái có một chuỗi <code>type</code> và dữ liệu nó cần.</li>
<li><strong>Reducer</strong> <code>chonLichReducer(state, action)</code> — nhận state hiện tại và một hành động, trả về state tiếp theo. Luật "bác sĩ mới ⇒ không có khung giờ" giờ là một dòng, <code>khungGioId: null</code>, ở chỗ duy nhất đổi được bác sĩ.</li>
</ul>
<p>Component nối nó vào bằng một hook và gọi <code>dispatch</code> thay cho các hàm set:</p>
<pre><code class="language-tsx">export function ChonLichReducer({ onLog }: { onLog?: (s: string) =&gt; void }) {
  const [state, dispatch] = useReducer(chonLichReducer, BAN_DAU);
  const bacSi = danhSachBacSi.find((bs) =&gt; bs.id === state.bacSiId);
  const khung = khungGioCuaBacSi(state.bacSiId ?? '').find((kg) =&gt; kg.id === state.khungGioId);

  if (state.buoc === 1)
    return (
      &lt;div&gt;
        {danhSachBacSi.slice(0, 2).map((bs) =&gt; (
          &lt;button
            key={bs.id}
            type="button"
            onClick={() =&gt; {
              dispatch({ type: 'chon-bac-si', bacSiId: bs.id });
              onLog?.(&#96;ngay sau dispatch: buoc = &#36;{state.buoc}&#96;); // vẫn là ảnh chụp CŨ
            }}
          &gt;
            {bs.ten}
          &lt;/button&gt;
        ))}
      &lt;/div&gt;
    );</code></pre>
<p>Cùng nút lối tắt đó giờ gửi <code>{ type: 'chon-bac-si', bacSiId: 'bs-2' }</code>. Nó không thể quên luật, vì nó không tự thực hiện luật:</p>
<div class="out">[reducer] sau khi doi: 08:00 · 01/10/2026 | 09:30 · 01/10/2026 | 14:00 · 01/10/2026 | Quay lại</div>
<p>Quay về bước 2, với các khung giờ của BS. Hà. Trạng thái vô lý không được "xử lý" — nó <em>không thể tới được</em>.</p>
<p><strong>Chạy thử từng bước</strong> — một cú bấm vào "BS. Nguyễn Minh An":</p>
<ol>
<li>Handler gọi <code>dispatch({ type: 'chon-bac-si', bacSiId: 'bs-1' })</code>. Chưa có gì đổi: dispatch chỉ xếp hành động vào hàng đợi (giống hệt hàm set ở Bài 2.1).</li>
<li>React gọi <code>chonLichReducer(stateHiệnTại, hànhĐộngĐó)</code>. Nó trả về <code>{ buoc: 2, bacSiId: 'bs-1', khungGioId: null }</code>.</li>
<li>Object mới khác object cũ (<code>Object.is</code>), nên React render lại component với nó. Nếu reducer trả về <em>chính</em> object cũ — như khi chọn khung giờ lúc chưa có bác sĩ — React bỏ qua lần render.</li>
<li><code>state</code> trong handler vẫn là ảnh chụp của lần render mà handler thuộc về. Test ghi log ngay sau dispatch:</li>
</ol>
<div class="out">[reducer ui] Xác nhận: BS. Trần Thu Hà — khung bs-2-kg-3 (14:00 · 01/10/2026) | log: [ 'ngay sau dispatch: buoc = 1', 'ngay sau dispatch: buoc = 1' ]</div>
<p>Cả hai cú bấm đều ghi <code>buoc = 1</code>: cùng luật ảnh chụp như <code>useState</code>. Cần giá trị mới ngay trong handler thì tự tính (<code>chonLichReducer(state, action)</code> là hàm thường — gọi được).</p>
${SD.dispatchVi}
<div class="callout"><p><strong>JS nhắc nhanh — vì sao gọi là "reducer"?</strong> Tên lấy từ phương thức mảng <code>reduce</code>: <code>[1, 2, 3].reduce((tong, x) =&gt; tong + x, 0)</code> đi qua mảng và "rút gọn" nó thành một giá trị, mang theo một biến tích luỹ. Reducer của React có đúng hình dạng đó — <code>(stateTớiGiờ, hànhĐộngTiếp) =&gt; stateMới</code> — và test của dự án dùng đúng như vậy: <code>danhSachHanhDong.reduce(luongDatLichReducer, LUONG_BAN_DAU)</code> phát lại một chuỗi hành động để ra state cuối.</p></div>

<h3>Union hành động cộng <code>never</code>: quên một case là tsc báo</h3>
${slide('rx-05', 10, 'Union hành động + never: quên một case là tsc báo ngay')}
<p><code>HanhDong</code> là một <strong>union phân biệt (discriminated union)</strong>: nhiều kiểu object có chung một field (<code>type</code>) với giá trị chữ khác nhau ở mỗi kiểu. Trong <code>switch (action.type)</code>, TypeScript thu hẹp kiểu của action trong từng <code>case</code>: sau <code>case 'chon-bac-si':</code> nó biết <code>action.bacSiId</code> có tồn tại, sau <code>case 'quay-lai':</code> nó biết không có field đó.</p>
<p>Nhánh <code>default</code> là một mẹo nhỏ. Nếu mọi <code>case</code> đã xử lý, kiểu còn lại cho <code>action</code> là <code>never</code> — "một giá trị không thể tồn tại" — nên <code>const conSot: never = action</code> biên dịch được. Thêm một loại hành động mà quên case của nó, <code>action</code> ở đó không còn là <code>never</code>. Để thấy tận mắt, một bản chép của reducer được thêm hành động thứ tư <code>'lam-lai'</code> mà không có case, cộng một lời gọi gõ sai type:</p>
<div class="out">$ npx tsc -b
src/vi-du/thieu-case.ts(18,13): error TS2322: Type '{ type: "lam-lai"; }' is not assignable to type 'never'.
src/vi-du/thieu-case.ts(25,27): error TS2820: Type '"chon-bac-sy"' is not assignable to type '"chon-bac-si" | "chon-khung-gio" | "quay-lai" | "lam-lai"'. Did you mean '"chon-bac-si"'?</div>
<p>Hai tấm lưới miễn phí: quên case là lỗi biên dịch chỉ đúng vào <code>default</code>, và gõ sai type hành động bị bắt ngay ở lời gọi <code>dispatch</code>, kèm gợi ý. Trong mã Redux chỉ có JavaScript (loại hay gặp trong lab FER202), cả hai đều im lặng: reducer trả lại state cũ và nút "không làm gì".</p>

<h3>Reducer thuần: test không cần React, và để StrictMode bắt lỗi đột biến</h3>
${slide('rx-05', 11, 'Reducer thuần: test không cần React, StrictMode bắt đột biến')}
<p>Reducer phải <strong>thuần (pure)</strong>: cùng state và action vào, cùng kết quả ra; không gọi API, không hẹn giờ, không <code>Date.now()</code>, không sửa state cũ. Luật đó trả công hai lần. Lần một: hàm thuần được test như mọi hàm — không render, không bấm:</p>
<pre><code class="language-tsx">describe('chonLichReducer — hàm thuần, test không cần React', () =&gt; {
  test('chọn bác sĩ ⇒ sang bước 2, khung giờ về null', () =&gt; {
    const s = chonLichReducer({ buoc: 3, bacSiId: 'bs-1', khungGioId: 'bs-1-kg-1' }, { type: 'chon-bac-si', bacSiId: 'bs-2' });
    console.info('[reducer] doi bac si:', JSON.stringify(s));
    expect(s).toEqual({ buoc: 2, bacSiId: 'bs-2', khungGioId: null });
  });
  test('chọn khung giờ khi chưa có bác sĩ ⇒ trả lại CHÍNH state cũ', () =&gt; {
    const s = chonLichReducer(BAN_DAU, { type: 'chon-khung-gio', khungGioId: 'bs-1-kg-1' });
    console.info('[reducer] khung gio khi chua co bac si: s === BAN_DAU -&gt;', s === BAN_DAU);
    expect(s).toBe(BAN_DAU);
  });
  test('quay lại ở bước 1 ⇒ không đổi; không sửa state cũ', () =&gt; {
    const cu = Object.freeze({ buoc: 2 as const, bacSiId: 'bs-1', khungGioId: null });
    const moi = chonLichReducer(cu, { type: 'quay-lai' });
    expect(moi).toEqual({ buoc: 1, bacSiId: 'bs-1', khungGioId: null });
    expect(chonLichReducer(moi, { type: 'quay-lai' })).toBe(moi);
  });
});</code></pre>
<div class="out">[reducer] doi bac si: {"buoc":2,"bacSiId":"bs-2","khungGioId":null}
[reducer] khung gio khi chua co bac si: s === BAN_DAU -&gt; true</div>
<p><code>Object.freeze</code> biến một object thành chỉ-đọc (ở chế độ strict, ghi vào là ném lỗi); đưa vào một state đã đông cứng là cách rẻ để chứng minh reducer không bao giờ sửa state cũ. Và trả về <em>chính object cũ</em> cho hành động bị bỏ qua (<code>s === BAN_DAU</code> là <code>true</code>) là thứ cho React bỏ qua lần render.</p>
<p>Lần hai là StrictMode. Ở chế độ dev, <code>&lt;StrictMode&gt;</code> (thứ <code>main.tsx</code> của Vite bọc sẵn quanh app) gọi reducer <strong>hai lần</strong> cho mỗi hành động và giữ một kết quả. Reducer thuần không hề hấn gì. Reducer đột biến thì có:</p>
<pre><code class="language-tsx">/* ───────── 3. Reducer KHÔNG thuần + StrictMode ⇒ lộ ra ở chế độ dev ───────── */
interface NhatKy { lichSu: string[] }
type GhiNhatKy = { type: 'ghi'; dong: string };
function reducerDotBien(state: NhatKy, action: GhiNhatKy): NhatKy {
  state.lichSu.push(action.dong); // ❌ sửa mảng của state cũ
  return { lichSu: state.lichSu };
}
function reducerThuan(state: NhatKy, action: GhiNhatKy): NhatKy {
  return { lichSu: [...state.lichSu, action.dong] }; // ✅ mảng mới
}</code></pre>
<div class="out">[strict] 2 cu bam Ghi ⇒ dot bien: Số dòng: 2 | dot bien + StrictMode: Số dòng: 4 | thuan + StrictMode: Số dòng: 2</div>
<div class="pitfall co-tieu-de"><strong>Bẫy — reducer sửa state cũ.</strong> <code>state.lichSu.push(…)</code> "chạy được" khi không có StrictMode: hai cú bấm, hai dòng. Có StrictMode, hai cú bấm ra bốn dòng, vì lần gọi thứ hai lại push vào đúng mảng đó. Đó là StrictMode làm đúng việc của nó: cho bạn thấy ngay ở dev rằng reducer không thuần. Cách chữa là cách ở Bài 2.3 — trả về mảng mới (<code>[...state.lichSu, action.dong]</code>). Đừng bao giờ "chữa" bằng cách gỡ StrictMode: bug vẫn ở đó, chỉ bị che đi. Bản build production gọi reducer một lần.</div>
<p>Vậy tác dụng phụ — lời gọi API thật sự đặt lịch — để đâu? Trong <strong>handler sự kiện</strong>, nơi được phép không thuần. Handler gửi "bắt đầu gửi", chờ request, rồi gửi kết quả. Bạn sẽ thấy đúng như vậy trong <code>LuongDatLich</code> của dự án ngay dưới đây.</p>

<h3>Reducer của dự án: luồng đặt lịch bốn bước</h3>
<p>Giờ tới bản thật. Bài 5.5 bắt bạn tự gõ; ở đây là nó chứa gì và vì sao. Luồng có bốn bước — bác sĩ, khung giờ, thông tin bệnh nhân (<code>FormDatLich</code> của Chương 3), xác nhận — cộng đang gửi, lỗi từ máy chủ, và thành công:</p>
<pre><code class="language-ts">import type { DatLich } from '../schema/dat-lich';
import type { LichHen } from '../types';

export type Buoc = 1 | 2 | 3 | 4;

/** Mọi thứ luồng đặt lịch 4 bước cần nhớ — MỘT object, đổi qua MỘT hàm. */
export interface LuongDatLich {
  buoc: Buoc;
  bacSiId: string | null;
  khungGioId: string | null;
  thongTin: DatLich | null; // họ tên, SĐT, ngày sinh, lý do — từ FormDatLich (Chương 3)
  dangGui: boolean;
  loiGui: string | null;
  daDat: LichHen | null; // khác null ⇒ đã xong, hiện màn "Đặt lịch thành công"
}

export type HanhDongDatLich =
  | { type: 'chon-bac-si'; bacSiId: string }
  | { type: 'chon-khung-gio'; khungGioId: string }
  | { type: 'nhap-thong-tin'; thongTin: DatLich }
  | { type: 'quay-lai' }
  | { type: 'bat-dau-gui' }
  | { type: 'gui-loi'; thongBao: string }
  | { type: 'gui-xong'; lichHen: LichHen }
  | { type: 'lam-lai' };

export const LUONG_BAN_DAU: LuongDatLich = {
  buoc: 1,
  bacSiId: null,
  khungGioId: null,
  thongTin: null,
  dangGui: false,
  loiGui: null,
  daDat: null,
};

/** Reducer THUẦN: không gọi API, không đọc giờ, không sửa state cũ — chỉ (state, action) → state mới. */
export function luongDatLichReducer(state: LuongDatLich, action: HanhDongDatLich): LuongDatLich {
  if (state.dangGui &amp;&amp; action.type !== 'gui-loi' &amp;&amp; action.type !== 'gui-xong') return state; // đang gửi: khoá luồng

  switch (action.type) {
    case 'chon-bac-si':
      // Đổi bác sĩ ⇒ khung giờ cũ thuộc bác sĩ khác ⇒ bỏ. Thông tin bệnh nhân thì giữ (vẫn là người đó).
      return { ...state, buoc: 2, bacSiId: action.bacSiId, khungGioId: state.bacSiId === action.bacSiId ? state.khungGioId : null };
    case 'chon-khung-gio':
      if (state.bacSiId === null) return state;
      return { ...state, buoc: 3, khungGioId: action.khungGioId };
    case 'nhap-thong-tin':
      if (state.khungGioId === null) return state;
      return { ...state, buoc: 4, thongTin: action.thongTin, loiGui: null };
    case 'quay-lai':
      return state.buoc === 1 ? state : { ...state, buoc: (state.buoc - 1) as Buoc, loiGui: null };
    case 'bat-dau-gui':
      if (state.buoc !== 4 || state.thongTin === null) return state;
      return { ...state, dangGui: true, loiGui: null };
    case 'gui-loi':
      return { ...state, dangGui: false, loiGui: action.thongBao };
    case 'gui-xong':
      return { ...state, dangGui: false, daDat: action.lichHen };
    case 'lam-lai':
      return LUONG_BAN_DAU;
    default: {
      const conSot: never = action; // quên một loại hành động ⇒ tsc báo ở đây
      return conSot;
    }
  }
}</code></pre>
<p>Những quyết định đáng đọc hai lần:</p>
<ul>
<li><strong>Đổi bác sĩ thì giữ thông tin bệnh nhân, bỏ khung giờ</strong> — trừ khi chọn lại đúng bác sĩ cũ, khi đó khung giờ ở lại. Cả hai luật nằm trong một biểu thức và mỗi luật có một test.</li>
<li><strong>Hành động sai thứ tự bị bỏ qua</strong> bằng cách trả lại chính state cũ: chọn khung giờ khi chưa có bác sĩ, nhập thông tin khi chưa có khung giờ, gửi trước bước 4. Giao diện không bao giờ đưa ra những nút đó, nhưng reducer không tin giao diện.</li>
<li><strong>Đang gửi thì khoá luồng</strong>: dòng đầu tiên bỏ qua mọi hành động trừ hai hành động kết thúc việc gửi. Bấm đúp "Quay lại" giữa lúc đang gửi không thể đưa bạn về bước 3 khi request còn đang bay.</li>
<li><strong>Lời gọi API không nằm ở đây.</strong> Reducer chỉ ghi <code>dangGui</code>, <code>loiGui</code> và <code>daDat</code>. Lời gọi nằm trong handler của component:</li>
</ul>
<pre><code class="language-tsx">export function LuongDatLich() {
  const [state, dispatch] = useReducer(luongDatLichReducer, LUONG_BAN_DAU);
  const themLichHen = useDatLichStore((s) =&gt; s.themLichHen); // chỉ lấy HÀNH ĐỘNG ⇒ không render lại khi danh sách đổi
  const bacSi = danhSachBacSi.find((bs) =&gt; bs.id === state.bacSiId) ?? null;
  const khungGio = khungGioCuaBacSi(state.bacSiId ?? '').find((kg) =&gt; kg.id === state.khungGioId) ?? null;

  async function xacNhan() {
    if (!bacSi || !khungGio || !state.thongTin) return;
    dispatch({ type: 'bat-dau-gui' });
    try {
      const lichHen = await guiYeuCauDatLich(bacSi.id, state.thongTin, khungGio.id);
      themLichHen(lichHen); // store toàn app: Header, "Lịch hẹn của tôi" tự cập nhật
      dispatch({ type: 'gui-xong', lichHen });
    } catch (loi) {
      dispatch({ type: 'gui-loi', thongBao: loi instanceof Error ? loi.message : 'Gửi không thành công' });
    }
  }</code></pre>
${SD.luongVi}
<p>(<code>useDatLichStore</code> là store Zustand của bài sau; tạm bỏ qua.) Test phát lại các chuỗi hành động qua reducer bằng <code>reduce</code>:</p>
<pre><code class="language-ts">import { describe, expect, test } from 'vitest';
import type { DatLich } from '../schema/dat-lich';
import { LUONG_BAN_DAU, luongDatLichReducer, type HanhDongDatLich, type LuongDatLich } from './luong-dat-lich';

const thongTin: DatLich = {
  benhNhan: { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567', ngaySinh: '1995-03-14' },
  lyDo: 'Bé ho khan 3 ngày',
};
/** Chạy lần lượt nhiều hành động — đúng cái React làm, chỉ là không cần React. */
const chay = (...ds: HanhDongDatLich[]): LuongDatLich =&gt; ds.reduce(luongDatLichReducer, LUONG_BAN_DAU);

describe('luongDatLichReducer', () =&gt; {
  test('đi đủ 4 bước', () =&gt; {
    const s = chay(
      { type: 'chon-bac-si', bacSiId: 'bs-2' },
      { type: 'chon-khung-gio', khungGioId: 'bs-2-kg-1' },
      { type: 'nhap-thong-tin', thongTin },
    );
    expect(s).toMatchObject({ buoc: 4, bacSiId: 'bs-2', khungGioId: 'bs-2-kg-1', thongTin });
  });

  test('đổi sang bác sĩ KHÁC ⇒ bỏ khung giờ cũ, giữ thông tin bệnh nhân', () =&gt; {
    const s = chay(
      { type: 'chon-bac-si', bacSiId: 'bs-2' },
      { type: 'chon-khung-gio', khungGioId: 'bs-2-kg-1' },
      { type: 'nhap-thong-tin', thongTin },
      { type: 'quay-lai' },
      { type: 'quay-lai' },
      { type: 'quay-lai' },
      { type: 'chon-bac-si', bacSiId: 'bs-4' },
    );
    expect(s).toMatchObject({ buoc: 2, bacSiId: 'bs-4', khungGioId: null, thongTin });
  });</code></pre>
<div class="out"> ✓ src/dat-lich/luong-dat-lich.test.ts &gt; luongDatLichReducer &gt; đi đủ 4 bước
 ✓ src/dat-lich/luong-dat-lich.test.ts &gt; luongDatLichReducer &gt; đổi sang bác sĩ KHÁC ⇒ bỏ khung giờ cũ, giữ thông tin bệnh nhân
 ✓ src/dat-lich/luong-dat-lich.test.ts &gt; luongDatLichReducer &gt; chọn lại ĐÚNG bác sĩ cũ ⇒ giữ khung giờ đã chọn
 ✓ src/dat-lich/luong-dat-lich.test.ts &gt; luongDatLichReducer &gt; hành động sai thứ tự bị bỏ qua (trả CHÍNH state cũ)
 ✓ src/dat-lich/luong-dat-lich.test.ts &gt; luongDatLichReducer &gt; đang gửi thì khoá: quay lại / chọn bác sĩ đều bị bỏ qua
 ✓ src/dat-lich/luong-dat-lich.test.ts &gt; luongDatLichReducer &gt; không bao giờ sửa state cũ (đông cứng mà vẫn chạy)
 ✓ src/dat-lich/luong-dat-lich.test.ts &gt; luongDatLichReducer &gt; làm lại ⇒ về đúng trạng thái ban đầu

 Test Files  1 passed (1)
      Tests  7 passed (7)</div>
<div class="callout"><p><strong>JS nhắc nhanh — tham số rest.</strong> <code>const chay = (...ds: HanhDongDatLich[]) =&gt; …</code>: ba dấu chấm trong danh sách tham số gom <em>mọi</em> đối số vào một mảng, nên <code>chay(a, b, c)</code> cho <code>ds = [a, b, c]</code>. Cùng ba dấu chấm với spread (Bài 2.3), ngược chiều: spread tách một mảng ra, rest gom các giá trị lại thành một.</p></div>

<h3>useState hay useReducer: đếm luật, đừng đếm số biến</h3>
${slide('rx-05', 12, 'useState hay useReducer: đếm luật, không đếm số biến')}
<table>
<thead><tr><th></th><th>useState</th><th>useReducer</th></tr></thead>
<tbody>
<tr><td>Lượng mã</td><td>ít</td><td>nhiều hơn (kiểu hành động + reducer)</td></tr>
<tr><td>Logic cập nhật nằm ở</td><td>rải trong các handler</td><td>một hàm, đọc từ trên xuống</td></tr>
<tr><td>Nhiều giá trị phải đổi cùng nhau</td><td>dễ để chúng lệch nhau</td><td>luật nằm trong reducer</td></tr>
<tr><td>Test logic</td><td>phải render rồi bấm</td><td>gọi một hàm thuần</td></tr>
<tr><td>Gỡ lỗi</td><td>"ai đặt cái này?"</td><td>log mọi hành động</td></tr>
</tbody>
</table>
<p>Một phép thử có ích: nếu bạn tả được một lần đổi state thành <em>một sự kiện</em> ("người dùng chọn một khung giờ") và một sự kiện phải cập nhật nhiều giá trị theo luật, dùng reducer. Ô nhập chữ, nút bật/tắt, bộ đếm — <code>useState</code>. Trộn cả hai là chuyện bình thường: <code>LuongDatLich</code> dùng reducer cho luồng, còn <code>KhuBacSi</code> giữ "bác sĩ đang xem" bằng một <code>useState</code> thường.</p>
<p>Khi nhiều component ở sâu cần dispatch, ghép bài này với bài trước: đưa <code>dispatch</code> vào một context. Danh tính của nó không bao giờ đổi, nên — như đã đo ở 5.1 — component chỉ dispatch không bao giờ render lại vì nó:</p>
<pre><code class="language-tsx">const DispatchDatLich = createContext&lt;Dispatch&lt;HanhDongDatLich&gt; | null&gt;(null);
// trong component giữ reducer:
&lt;DispatchDatLich value={dispatch}&gt;{children}&lt;/DispatchDatLich&gt;</code></pre>
<p>react.dev gọi cách này là "scaling up with reducer and context". Dự án này không cần — luồng sống trong một component — nhưng bạn sẽ gặp nó trong những codebase có từ trước khi Zustand phổ biến.</p>
${SD.chonVi}

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>FER202 dạy reducer qua Redux: hằng <code>const ADD_TODO = 'ADD_TODO'</code>, hàm action creator, một <code>switch</code> trong reducer, một store toàn cục tạo một lần, <code>connect</code> hoặc <code>useSelector</code>/<code>useDispatch</code>, và thunk cho việc bất đồng bộ. → Đi làm, ý tưởng reducer y nguyên, nhưng nó sống ở đâu tuỳ phạm vi: một luồng phức tạp trong một màn hình dùng <code>useReducer</code> ngay trong component (không store, không mã khuôn mẫu); hành động được khai kiểu bằng union TypeScript thay cho hằng chuỗi; việc bất đồng bộ nằm trong handler hoặc TanStack Query; state client toàn app vào Zustand. Dự án Redux có sẵn dùng <code>createSlice</code> của Redux Toolkit, tự sinh action cho bạn và cho phép "sửa thẳng" nhờ Immer (Bài 2.3). · <em>Vì sao:</em> một luồng đặt lịch do một màn hình sở hữu chẳng có lý do gì phải sống trong store toàn cục nơi mọi màn hình khác đều dispatch vào được. Những gì bạn học về reducer ở FER202 không phí: đọc một <code>createSlice</code> hay viết <code>useReducer</code> là cùng một kỹ năng.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Khi nào bạn chọn useReducer thay cho useState? Vì sao reducer phải thuần?"</p>
<p>Em dùng <code>useReducer</code> khi nhiều giá trị state đổi cùng nhau theo luật — form nhiều bước, luồng có đang tải/lỗi/thành công — để luật nằm ở một hàm thay vì lặp lại trong mọi handler, và các tổ hợp vô lý trở thành không thể tới. Với TypeScript em khai hành động là union phân biệt và thêm kiểm <code>never</code> để thiếu case là lỗi biên dịch. Reducer phải thuần vì React có thể gọi nó nhiều hơn một lần — StrictMode gọi hai lần ở dev — và vì trả object mới là cách React biết có gì đổi; nếu reducer sửa state cũ, <code>Object.is</code> nói "như cũ" và giao diện không cập nhật. Tác dụng phụ như gọi API nằm trong handler, handler dispatch kết quả. Thêm một cái lợi: reducer thuần được unit test mà không cần render gì.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> chép luồng nhỏ của bài này (<code>ChonLich</code>, <code>HanhDong</code>, <code>chonLichReducer</code>, <code>ChonLichReducer</code>) vào <code>src/vi-du/bai2.tsx</code> trong dự án của bạn, thêm nút "Làm lại", và để hệ thống kiểu dẫn đường.</p><ol>
<li>Thêm <code>| { type: 'lam-lai' }</code> vào <code>HanhDong</code>, nhưng chưa đụng reducer. Chạy <code>npx tsc -b</code> và chép lại lỗi.</li>
<li>Xử lý case: <code>'lam-lai'</code> trả về <code>BAN_DAU</code>. Thêm nút "Làm lại" ở bước 3 dispatch nó.</li>
<li>Viết một test dùng <code>reduce</code> phát lại <code>chon-bac-si</code>, <code>chon-khung-gio</code>, <code>lam-lai</code>, và kiểm kết quả <code>toBe(BAN_DAU)</code> — đúng chính object đó.</li>
<li>Thêm điểm: viết cố ý một bản không thuần (<code>state.buoc = 1; return state;</code>) và giải thích bằng một test vì sao màn hình không đổi.</li>
</ol><p><strong>Đạt khi:</strong> bước 1 in ra <code>error TS2322: Type '{ type: "lam-lai"; }' is not assignable to type 'never'.</code> (số dòng của bạn có thể khác); sau bước 2, <code>npx tsc -b</code> không in gì; test <code>reduce</code> xanh; và với phần thêm, test của bạn cho thấy reducer trả về chính object cũ nên React bỏ qua lần render.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">reducer</span><span class="v">hàm thuần <code>(state, action) =&gt; stateMới</code> chứa mọi luật đổi một state</span></div>
<div class="kv"><span class="k">action (hành động)</span><span class="v">object tả điều vừa xảy ra: <code>{ type: 'chon-bac-si', bacSiId }</code></span></div>
<div class="kv"><span class="k">dispatch (gửi đi)</span><span class="v">hàm của <code>useReducer</code> để gửi một hành động; danh tính không bao giờ đổi</span></div>
<div class="kv"><span class="k">impossible state (trạng thái vô lý)</span><span class="v">tổ hợp giá trị lẽ ra không tồn tại (BS. Hà với khung giờ của BS. An)</span></div>
<div class="kv"><span class="k">discriminated union (union phân biệt)</span><span class="v">các kiểu object có chung một field chữ (<code>type</code>) để TypeScript thu hẹp kiểu</span></div>
<div class="kv"><span class="k"><code>never</code> (kiểm đủ case)</span><span class="v">kiểu còn lại khi mọi case đã xử lý; thiếu case thành lỗi biên dịch</span></div>
<div class="kv"><span class="k">pure function (hàm thuần)</span><span class="v">cùng đầu vào ⇒ cùng đầu ra, không tác dụng phụ, không sửa đối số</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Nhiều giá trị đổi cùng nhau theo luật sẽ lệch nhau khi mỗi handler tự cập nhật — đo được: xác nhận BS. Hà với khung giờ của BS. An.</li>
<li><code>useReducer(reducer, banDau)</code> trả về <code>[state, dispatch]</code>; component gửi hành động, chỉ reducer quyết định state tiếp theo.</li>
<li>Khai hành động là union phân biệt và kết thúc <code>switch</code> bằng kiểm <code>never</code>: quên case và gõ sai thành lỗi biên dịch (TS2322, TS2820).</li>
<li>Reducer phải thuần: không gọi API, không đột biến. StrictMode gọi hai lần ở dev — reducer đột biến ghi 4 dòng cho 2 cú bấm. Tác dụng phụ để trong handler.</li>
<li>Reducer thuần được test không cần React; <code>dsHanhDong.reduce(reducer, banDau)</code> phát lại cả một kịch bản.</li>
<li>Chọn theo luật, đừng theo số biến; cây sâu thì đưa <code>dispatch</code> (ổn định) vào context.</li>
</ul>

<a class="link-card" href="https://react.dev/learn/extracting-state-logic-into-a-reducer" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Extracting State Logic into a Reducer</span><span class="lc-sub">Từ hàm set sang hành động trong ba bước, và so useState với useReducer.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/useReducer" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — useReducer</span><span class="lc-sub">Tài liệu tra cứu, có mục "My reducer or initializer function runs twice".</span></span></a>
<a class="link-card" href="https://react.dev/learn/scaling-up-with-reducer-and-context" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Scaling Up with Reducer and Context</span><span class="lc-sub">Đưa state và dispatch vào hai context.</span></span></a>
<a class="link-card" href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">TypeScript Handbook — Narrowing</span><span class="lc-sub">Union phân biệt và kiểm đủ case bằng never.</span></span></a>
</div>
`,
  },
  {
    title: '5.3 — Zustand for app-wide state: store, selectors, useShallow and persist|||5.3 — Zustand cho state toàn app: store, selector, useShallow và persist',
    slug: 'rx-5-3-zustand',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Store Zustand nằm ngoài cây component, selector hẹp đo thật (+1 thẻ so với +6 của context), selector trả object mới làm sập app ở Zustand 5 và cách chữa bằng useShallow, persist qua F5 trên Chromium thật, và dọn store/URL giữa các test.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Zustand for app-wide state: a store outside the tree, selectors that re-render only what changed, and persist</h2>
<p class="lead">Lesson 5.1 ended with a limit: a context cannot let a component subscribe to <em>one slice</em> of a value, so one changed favourite re-rendered every card. A <strong>store</strong> can. Zustand is a small store library — the core that React code imports is two files, 1,740 bytes of JavaScript in <code>node_modules</code> — and the one this course uses for client state shared across the app. This lesson measures what its selectors buy you, shows the one selector mistake that crashes the app, adds persistence across F5, and deals with the side effect nobody warns you about: tests that leak state into each other.</p>

<p>Versions: <code>zustand@5.0.15</code> with React 19.3.0. Examples in <code>src/vi-du/bai3.tsx</code>; the project&#39;s real store is <code>src/store/dat-lich-store.ts</code>. Outputs from <code>npx vitest run src/vi-du/bai3.test.tsx --reporter=verbose</code>, from a real Chromium driven by Playwright, and from the project&#39;s own test run.</p>

<h3>A store lives outside the component tree</h3>
${slide('rx-05', 13, 'A Zustand store sits outside the component tree; whoever needs it takes it')}
<p>Context state lives <em>inside</em> a provider component, so it exists only below that provider. A Zustand store is created at module level — a variable in a <code>.ts</code> file — and any component that imports it can read it. There is no provider to wrap and no tree position to worry about: in the clinic app, <code>Header</code> (top of the page), <code>KhuBacSi</code> (the list), <code>LuongDatLich</code> (the booking flow) and <code>LichHenCuaToi</code> (my appointments) are siblings or cousins, and all four use the same store.</p>
${SD.khoEn}
<p>Installing it is one command. The trial project already had it, so npm had nothing to add:</p>
<div class="out">$ npm install zustand
up to date, audited 173 packages in 879ms

$ npm ls zustand
phong-kham@0.0.0 …/ch05
&#96;-- zustand@5.0.15</div>

<h3><code>create()</code>: state and actions in one hook</h3>
${slide('rx-05', 14, 'create(): state and actions live together in one hook')}
<pre><code class="language-tsx">/* ───────── 1. Một store: state + hành động nằm chung, ngoài cây component ───────── */
interface YeuThichState {
  yeuThich: string[];
  doi: (id: string) =&gt; void;
  xoaHet: () =&gt; void;
}
export const useYeuThichStore = create&lt;YeuThichState&gt;()((set) =&gt; ({
  yeuThich: [],
  doi: (id) =&gt; set((s) =&gt; ({ yeuThich: doiYeuThich(s.yeuThich, id) })), // set GỘP nông vào state cũ
  xoaHet: () =&gt; set({ yeuThich: [] }),
}));</code></pre>
<p>What each piece does:</p>
<ul>
<li><code>create&lt;YeuThichState&gt;()(…)</code> builds the store and returns a <strong>hook</strong>, <code>useYeuThichStore</code>. The odd double call <code>create&lt;T&gt;()(…)</code> is how Zustand&#39;s TypeScript types want it (it lets the type parameter be given while the rest is inferred); just copy the shape.</li>
<li>The function you pass receives <code>set</code> and returns the initial state <em>and</em> the actions. Actions are ordinary functions stored next to the data — no action types, no reducer, no dispatch.</li>
<li><code>set((s) =&gt; ({ … }))</code> works like the updater form of a <code>useState</code> setter: it receives the current state and returns changes. Unlike a <code>useState</code> setter, <code>set</code> <strong>merges shallowly</strong>: <code>set({ yeuThich: [] })</code> replaces <code>yeuThich</code> and keeps <code>doi</code> and <code>xoaHet</code>. Nested objects are not merged — for those you still spread level by level (Lesson 2.3).</li>
<li>The update itself must still be immutable: <code>doiYeuThich</code> from Chapter 2 returns a new array. Zustand compares with <code>Object.is</code> too; <code>s.yeuThich.push(id)</code> would change nothing on screen.</li>
</ul>
<div class="callout"><p><strong>JS quick reminder — a function returning an object.</strong> <code>(s) =&gt; ({ yeuThich: … })</code>: the parentheses around the braces matter. Without them, <code>(s) =&gt; { yeuThich: … }</code> is a function <em>body</em> with a label inside, and it returns <code>undefined</code>. With them, the braces are an object literal that the arrow function returns.</p></div>

<h3>Selectors: subscribe to exactly what you render</h3>
${slide('rx-05', 15, 'Narrow selector: click one heart, only that card re-renders')}
<p>A component reads the store by calling the hook with a <strong>selector</strong> — a function that picks what it needs from the whole state. Zustand runs the selector after every change and re-renders the component only if the <em>result</em> changed (by <code>Object.is</code>). Two versions of the doctor card, one with narrow selectors and one that takes the whole store:</p>
<pre><code class="language-tsx">/** ✅ Selector hẹp: chỉ render lại khi KẾT QUẢ của selector đổi (so bằng Object.is). */
const TheChon = memo(function TheChon({ bacSi }: { bacSi: BacSi }) {
  dem(&#96;chon:&#36;{bacSi.id}&#96;);
  const la = useYeuThichStore((s) =&gt; s.yeuThich.includes(bacSi.id));
  const doi = useYeuThichStore((s) =&gt; s.doi);
  return (
    &lt;button type="button" aria-pressed={la} aria-label={&#96;Yêu thích &#36;{bacSi.ten}&#96;} onClick={() =&gt; doi(bacSi.id)}&gt;
      {la ? '♥' : '♡'}
    &lt;/button&gt;
  );
});
/** ❌ Lấy cả store: mọi thay đổi ⇒ render lại. */
const TheCaStore = memo(function TheCaStore({ bacSi }: { bacSi: BacSi }) {
  dem(&#96;ca:&#36;{bacSi.id}&#96;);
  const { yeuThich, doi } = useYeuThichStore();
  const la = yeuThich.includes(bacSi.id);
  return (
    &lt;button type="button" aria-pressed={la} aria-label={&#96;Yêu thích &#36;{bacSi.ten}&#96;} onClick={() =&gt; doi(bacSi.id)}&gt;
      {la ? '♥' : '♡'}
    &lt;/button&gt;
  );
});
function DemYeuThich() {
  dem('dem');
  const soLuong = useYeuThichStore((s) =&gt; s.yeuThich.length);
  return &lt;p&gt;Yêu thích: {soLuong}&lt;/p&gt;;
}
export function LuoiZustand({ caStore = false }: { caStore?: boolean }) {
  return (
    &lt;&gt;
      &lt;DemYeuThich /&gt;
      {danhSachBacSi.map((bs) =&gt; (caStore ? &lt;TheCaStore key={bs.id} bacSi={bs} /&gt; : &lt;TheChon key={bs.id} bacSi={bs} /&gt;))}
    &lt;/&gt;
  );
}</code></pre>
<p>Same experiment as in 5.1 — click the heart on BS. Trần Thu Hà once, count card renders:</p>
<div class="out">[selector] 1 click ♡ ⇒ selector hep: +1 the, dem render 2 lan | useYeuThichStore(): +6 the, dem render 2 lan</div>
<ul>
<li><strong>Narrow selector: +1.</strong> Each card selects a <em>boolean</em>: is my doctor in the list? After the click, BS. Hà&#39;s card gets <code>true</code> instead of <code>false</code> and re-renders. The other five get <code>false</code> again — equal to before — and Zustand leaves them alone. Context could not do this: in 5.1 the same click cost +6.</li>
<li><strong>Whole store: +6.</strong> <code>useYeuThichStore()</code> with no selector returns the whole state object, which is new after every <code>set</code>. Every card re-renders on any change to anything in the store. It works; it just throws away the reason to use a store.</li>
<li><strong>The counter <code>DemYeuThich</code>: 2 renders</strong> (mount + one) in both runs. It selects <code>s.yeuThich.length</code>, a number that did change.</li>
</ul>
<p>Actions are selected too: <code>useYeuThichStore((s) =&gt; s.doi)</code>. A function stored in the store never changes, so a component that selects only actions never re-renders because of state changes — the same effect that took two contexts in 5.1, for free.</p>
${SD.selectorEn}
<p>And because the store is a plain object outside React, you can use it from anywhere — a utility function, a test, a WebSocket handler — through <code>getState()</code>:</p>
<pre><code class="language-tsx">test('gọi hành động NGOÀI React bằng getState()', () =&gt; {
  render(&lt;LuoiZustand /&gt;);
  act(() =&gt; {
    useYeuThichStore.getState().doi('bs-4');
    useYeuThichStore.getState().doi('bs-6');
  });
  console.info('[getState] sau 2 lan doi ngoai React:', screen.getByText(/Yêu thích:/).textContent, JSON.stringify(useYeuThichStore.getState().yeuThich));
  expect(screen.getByText('Yêu thích: 2')).toBeInTheDocument();
});</code></pre>
<div class="out">[getState] sau 2 lan doi ngoai React: Yêu thích: 2 ["bs-4","bs-6"]</div>
<p>The component on screen updated although nothing inside React called the action. (<code>act()</code> is Testing Library&#39;s way of saying "React work happens in here, finish it before the next line" — needed only because the change comes from outside a React event.)</p>

<h3>A selector that returns a new object: the one mistake that crashes</h3>
${slide('rx-05', 16, 'A selector returning a new object ⇒ infinite loop; useShallow fixes it')}
<p>It is natural to want two values from one call:</p>
<pre><code class="language-tsx">/* ───────── 2. Selector trả object MỚI mỗi lần ⇒ vòng lặp vô hạn (Zustand 5) ───────── */
export function ThanhCongCuSai() {
  const { soLuong, xoaHet } = useYeuThichStore((s) =&gt; ({ soLuong: s.yeuThich.length, xoaHet: s.xoaHet }));
  return &lt;button type="button" onClick={xoaHet}&gt;Xoá hết ({soLuong})&lt;/button&gt;;
}
export function ThanhCongCuDung() {
  const { soLuong, xoaHet } = useYeuThichStore(useShallow((s) =&gt; ({ soLuong: s.yeuThich.length, xoaHet: s.xoaHet })));
  return &lt;button type="button" onClick={xoaHet}&gt;Xoá hết ({soLuong})&lt;/button&gt;;
}</code></pre>
<p><code>ThanhCongCuSai</code> ("toolbar, wrong") renders — once:</p>
<div class="out">[object moi] loi: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
[useShallow] Xoá hết (0)</div>
<div class="pitfall co-tieu-de"><strong>Trap — <code>useStore((s) =&gt; ({ a: s.a, b: s.b }))</code> in Zustand 5.</strong> The selector builds a <em>new object</em> every time it runs. Zustand 5 hands the selector to React&#39;s <code>useSyncExternalStore</code>, which calls it again to check the snapshot is stable, gets a different object, concludes the store changed, re-renders, gets another new object… React stops the loop with "Maximum update depth exceeded". Zustand 4 tolerated this pattern (it only re-rendered too often), so you will find it in old code and old tutorials; upgrading to 5 turns it into a crash — the Zustand v5 migration guide shows exactly this error. Three fixes, simplest first: call the hook twice, once per value (<code>const soLuong = useStore((s) =&gt; s.yeuThich.length)</code>); or wrap the selector in <code>useShallow</code>, which compares the object field by field; or select an existing object rather than building one.</div>
<p><code>useShallow</code> comes from <code>zustand/react/shallow</code>. It keeps the previous result when every top-level field is equal (by <code>Object.is</code>), so the returned object stays the same between renders unless <code>soLuong</code> or <code>xoaHet</code> really changed.</p>

<h3>persist: the store survives F5</h3>
${slide('rx-05', 17, 'persist: the store saves itself to localStorage and survives F5')}
<p>Favourites that vanish on reload are annoying; booked appointments that vanish are a bug report. The <code>persist</code> middleware (a wrapper around the store creator) saves the state to <code>localStorage</code> after every change and loads it back when the store is created:</p>
<pre><code class="language-tsx">/* ───────── 3. persist: tự lưu/đọc localStorage ───────── */
interface GhiNhoState {
  yeuThich: string[];
  lanCuoiXem: string | null;
  doi: (id: string) =&gt; void;
}
export const useGhiNhoStore = create&lt;GhiNhoState&gt;()(
  persist(
    (set) =&gt; ({
      yeuThich: [],
      lanCuoiXem: null,
      doi: (id) =&gt; set((s) =&gt; ({ yeuThich: doiYeuThich(s.yeuThich, id), lanCuoiXem: id })),
    }),
    {
      name: 'demo-yeu-thich', // khoá trong localStorage
      storage: createJSONStorage(() =&gt; localStorage),
      partialize: (s) =&gt; ({ yeuThich: s.yeuThich }), // chỉ lưu thứ đáng nhớ; hàm thì không lưu được
      version: 1,
    },
  ),
);</code></pre>
<p>The test clicks the heart, reads <code>localStorage</code>, then simulates a page reload by throwing away every loaded module (<code>vi.resetModules()</code>) and importing the file again — a brand-new store, as after F5:</p>
<pre><code class="language-tsx">test('persist: ghi vào localStorage, chỉ phần partialize', async () =&gt; {
  const user = userEvent.setup();
  function Nut() {
    const doi = useGhiNhoStore((s) =&gt; s.doi);
    return &lt;button type="button" onClick={() =&gt; doi('bs-2')}&gt;♡&lt;/button&gt;;
  }
  render(&lt;Nut /&gt;);
  await user.click(screen.getByRole('button'));
  console.info('[persist] localStorage =', localStorage.getItem('demo-yeu-thich'));
  console.info('[persist] trong bo nho: lanCuoiXem =', useGhiNhoStore.getState().lanCuoiXem);
  // Giả lập "tải lại trang": nạp LẠI module từ đầu ⇒ một store mới tinh, tự đọc localStorage khi tạo
  vi.resetModules();
  const { useGhiNhoStore: storeMoi } = await import('./bai3');
  console.info('[persist] store moi sau "tai lai":', JSON.stringify({ yeuThich: storeMoi.getState().yeuThich, lanCuoiXem: storeMoi.getState().lanCuoiXem }), '| da hydrate:', storeMoi.persist.hasHydrated());
  expect(storeMoi.getState().yeuThich).toEqual(['bs-2']);
});</code></pre>
<div class="out">[persist] localStorage = {"state":{"yeuThich":["bs-2"]},"version":1}
[persist] trong bo nho: lanCuoiXem = bs-2
[persist] store moi sau "tai lai": {"yeuThich":["bs-2"],"lanCuoiXem":null} | da hydrate: true</div>
<ul>
<li><code>name</code> is the <code>localStorage</code> key. Two stores with the same name overwrite each other.</li>
<li><code>partialize</code> picks what to save. <code>lanCuoiXem</code> ("last viewed") was in memory (<code>bs-2</code>) but not saved, so after the reload it is back to <code>null</code> — by design. Functions cannot be saved as JSON anyway.</li>
<li><code>version</code> is stored next to the data. When you change the shape of the saved state, bump the number and give <code>persist</code> a <code>migrate</code> function; otherwise old data from users&#39; browsers is loaded into the new shape.</li>
<li><strong>Hydration</strong> (loading the saved state back) is synchronous with <code>localStorage</code>: <code>hasHydrated()</code> is already <code>true</code> right after import.</li>
</ul>
${SD.persistEn}
<p>The project&#39;s real store is the same pattern with the two things the clinic app needs to keep:</p>
<pre><code class="language-ts">import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { doiYeuThich } from '../logic/yeu-thich';
import type { LichHen } from '../types';

interface DatLichState {
  yeuThich: string[];
  lichHen: LichHen[];
  doiYeuThich: (bacSiId: string) =&gt; void;
  themLichHen: (lh: LichHen) =&gt; void;
}

/**
 * State CỦA NGƯỜI DÙNG, dùng ở nhiều nơi xa nhau (thẻ bác sĩ, khung chi tiết, Header, luồng đặt lịch),
 * và cần sống qua F5 ⇒ một store Zustand có persist. Danh sách bác sĩ/khung giờ (dữ liệu của MÁY CHỦ)
 * KHÔNG ở đây — Chương 6 giao nó cho TanStack Query.
 */
export const useDatLichStore = create&lt;DatLichState&gt;()(
  persist(
    (set) =&gt; ({
      yeuThich: [],
      lichHen: [],
      doiYeuThich: (bacSiId) =&gt; set((s) =&gt; ({ yeuThich: doiYeuThich(s.yeuThich, bacSiId) })),
      themLichHen: (lh) =&gt; set((s) =&gt; ({ lichHen: [...s.lichHen, lh] })),
    }),
    {
      name: 'phong-kham-dat-lich',
      storage: createJSONStorage(() =&gt; localStorage),
      partialize: (s) =&gt; ({ yeuThich: s.yeuThich, lichHen: s.lichHen }),
      version: 1,
    },
  ),
);</code></pre>
<p>In a real Chromium, after booking an appointment through the four-step flow:</p>
<div class="out">[sau] header: Lịch hẹn của tôi: 1
[sau] localStorage = {"state":{"yeuThich":["bs-6"],"lichHen":[{"id":"lh-1790303755862","bacSiId":"bs-1","khungGioId":"bs-1-kg-3","benhNhan":{"hoTen":"Nguyễn Thị Ánh","soDienThoai":"0901234567","ngaySinh":"1995-03-14"},"lyDo":"Đau dạ dày, khám lại theo hẹn","trangThai":"cho-xac-nhan"}]},"version":1}
[sau] F5 roi: Lịch hẹn của tôi: 1 | Lịch hẹn của tôi (1)</div>
<div class="callout warn"><p><strong>What not to put in persisted state.</strong> <code>localStorage</code> is plain text that any script on the page can read, and it stays on the device until someone clears it. Do not persist tokens (Chapter 14), passwords, or medical details you would not want left on a shared computer. The patient&#39;s name and phone in this demo are there because the course app uses fake data; a real clinic would keep appointments on the server (Chapter 6) and persist at most the favourites. Also, <code>persist</code> is not a cache for server data — that is TanStack Query&#39;s job.</p></div>

<h3>Stores and URLs live outside components — tests must clean them up</h3>
${slide('rx-05', 18, 'Store and URL live outside components — tests must clean up')}
<p>A store is a module-level variable, so it survives from one test to the next. The first example test proves it: render, click a heart, unmount, render again "as another test would":</p>
<div class="out">[ro ri] lan render thu hai thay: Yêu thích: 1</div>
<p>The second render starts with the first one&#39;s favourite. In the project this bit for real: after moving favourites into the store and the filters into the URL (Lesson 5.4), the six old <code>KhuBacSi</code> tests from Chapter 2 were run unchanged:</p>
<div class="out">$ npx vitest run src/components/KhuBacSi.test.tsx
 ❯ src/components/KhuBacSi.test.tsx (6 tests | 4 failed) 438ms
   × gõ "lan" (không dấu) ⇒ tìm ra BS. Phạm Ngọc Lan 71ms
   × xem chi tiết rồi đóng 21ms
   × yêu thích: bật, tắt, và chi tiết luôn khớp với thẻ 17ms
   × lọc KHÔNG làm mất yêu thích của bác sĩ đang bị ẩn 22ms
…
 FAIL  src/components/KhuBacSi.test.tsx &gt; gõ "lan" (không dấu) ⇒ tìm ra BS. Phạm Ngọc Lan
TestingLibraryElementError: Unable to find an accessible element with the role "heading" and name "Đội ngũ bác sĩ (1)"
…
 Test Files  1 failed (1)
      Tests  4 failed | 2 passed (6)</div>
<p>The first test clicked "Nhi", which put <code>?ck=nhi</code> in the URL. <code>cleanup()</code> removes the DOM, but not the URL: the second test rendered a list already filtered to paediatrics, typed "lan", and found nobody. Each test passes alone; together they fail. The fix is to reset everything that lives outside components after each test, in <code>src/test/setup.ts</code>:</p>
<pre><code class="language-ts">import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { useDatLichStore } from '../store/dat-lich-store';

// Vitest mặc định globals: false ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.
// Không có dòng này, test sau thấy cả những gì test trước đã vẽ.
afterEach(() =&gt; {
  cleanup();
  // Chương 5: ba thứ sống NGOÀI component nên cleanup() không dọn — test trước để lại là test sau thấy.
  window.history.replaceState(null, '', '/'); // URL (?ck=…&amp;q=…)
  useDatLichStore.setState(useDatLichStore.getInitialState(), true); // store Zustand (biến của module)
  localStorage.clear(); // bản lưu của persist — xoá SAU cùng: setState ở trên lại ghi xuống localStorage
});</code></pre>
<p><code>getInitialState()</code> returns the state the store was created with; the second argument <code>true</code> tells <code>set</code> to <strong>replace</strong> the state instead of merging. The order matters, and that was measured too: with <code>localStorage.clear()</code> first, the store reset right after it is itself a change, which <code>persist</code> immediately writes back:</p>
<div class="out">AssertionError: expected '{"state":{"yeuThich":[],"lichHen":[]}…' to be null</div>
<p>Zustand&#39;s own testing guide goes further and mocks <code>zustand</code> so that every store resets automatically after each test; for a project with one store, three lines in <code>setup.ts</code> are enough. With them, all 56 project tests pass in any order.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202&#39;s global state is Redux: <code>createStore</code> (or <code>configureStore</code>), a root reducer combining slices, a <code>&lt;Provider store={store}&gt;</code> around the app, <code>useSelector</code>/<code>useDispatch</code> or <code>connect(mapStateToProps)</code>, and middleware like thunk for async. → In many teams in 2026, app-wide <em>client</em> state is a Zustand store like <code>useDatLichStore</code>: one file, no provider, actions as functions, selectors for fine-grained re-renders, <code>persist</code> for local storage; and <em>server</em> state is not in any store — TanStack Query owns it (Chapter 6), which removes most of what Redux stores used to hold. · <em>Why:</em> less code for the same guarantees, and the split between client and server state removes whole classes of bugs (stale lists, duplicated loading flags). Redux Toolkit is still common — large apps with complex event logs, time-travel debugging, or teams who already know it — and the selector idea you learn here is the same as <code>useSelector</code>.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "Context, Redux, Zustand — how do you choose? How does Zustand avoid unnecessary re-renders?"</p>
<p>Context passes a value down the tree; every reader re-renders when the value changes, so I use it for rarely-changing things like theme or the current user. For client state that many components read and that changes often, I use a store with selectors: Zustand if the team wants minimal code, Redux Toolkit if the app already uses it or needs its devtools and middleware ecosystem. Zustand re-renders a component only when the result of its selector changes by <code>Object.is</code> — so each component should select the smallest value it needs, and if it selects several fields as an object, wrap the selector in <code>useShallow</code>; in Zustand 5, returning a fresh object without it causes an infinite render loop. Server data does not belong in either — that is TanStack Query.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> add a "compare doctors" feature (up to 3) with a Zustand store, and prove the selectors work.</p><ol>
<li>Create <code>src/store/so-sanh-store.ts</code>: <code>useSoSanhStore</code> with <code>ids: string[]</code>, <code>them(id)</code> (ignores duplicates and does nothing when there are already 3), <code>bo(id)</code> and <code>xoaHet()</code>. Persist only <code>ids</code> under the key <code>'so-sanh'</code>.</li>
<li>Add a "So sánh" button to <code>TheBacSi</code> with <code>aria-pressed</code> selected by <code>(s) =&gt; s.ids.includes(bacSi.id)</code>, and a small bar in <code>Header</code> showing "So sánh: n/3" (selector: <code>s.ids.length</code>).</li>
<li>Reset the new store in <code>setup.ts</code> the same way as <code>useDatLichStore</code>.</li>
<li>Tests: adding a fourth doctor does nothing; the key <code>'so-sanh'</code> in <code>localStorage</code> contains exactly <code>{"state":{"ids":[…]},"version":…}</code>; and with a render counter, adding one doctor re-renders exactly one <code>TheBacSi</code>.</li>
</ol><p><strong>Done when:</strong> <code>npx tsc -b</code> prints nothing, all project tests stay green when run together (run <code>npx vitest run</code> twice to be sure order does not matter), the render-counter test shows +1 card, and after F5 in <code>npm run dev</code> the "So sánh: n/3" bar still shows the same n.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">store</span><span class="v">state + actions kept outside the component tree; components subscribe to it</span></div>
<div class="kv"><span class="k">selector</span><span class="v">function picking what a component needs: <code>(s) =&gt; s.yeuThich.length</code>; re-render only if its result changes</span></div>
<div class="kv"><span class="k"><code>set</code> (shallow merge)</span><span class="v">Zustand&#39;s updater; merges top-level fields; <code>set(x, true)</code> replaces</span></div>
<div class="kv"><span class="k"><code>getState()</code></span><span class="v">read the store or call actions outside React (tests, utilities)</span></div>
<div class="kv"><span class="k"><code>useShallow</code></span><span class="v">compare a selected object field by field so it stays stable</span></div>
<div class="kv"><span class="k">middleware</span><span class="v">a wrapper around the store creator that adds behaviour (persist, devtools)</span></div>
<div class="kv"><span class="k">persist / hydration</span><span class="v">saving state to storage / loading it back when the store is created</span></div>
<div class="kv"><span class="k">test isolation</span><span class="v">each test starts from the same state; module-level stores and the URL must be reset</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A Zustand store is a hook created at module level: no provider, any component can use it, and code outside React can too via <code>getState()</code>.</li>
<li>Select the smallest thing you render. Measured: narrow selectors re-rendered 1 card per click; the whole store re-rendered 6 (the same as context).</li>
<li>In Zustand 5, a selector returning a new object crashes with "Maximum update depth exceeded"; call the hook twice or use <code>useShallow</code>.</li>
<li><code>set</code> merges one level deep; updates must still be immutable.</li>
<li><code>persist</code> with <code>name</code>, <code>partialize</code> and <code>version</code> saves chosen fields to <code>localStorage</code>; measured in Chromium: the appointment count survived F5. Never persist secrets.</li>
<li>Stores (and the URL) outlive a test: reset them in <code>setup.ts</code>, store first, <code>localStorage.clear()</code> last — otherwise 4 of 6 old tests failed.</li>
</ul>

<a class="link-card" href="https://github.com/pmndrs/zustand/blob/main/docs/learn/getting-started/introduction.md" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Zustand docs — Introduction</span><span class="lc-sub">Creating a store, binding components, selecting state.</span></span></a>
<a class="link-card" href="https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/prevent-rerenders-with-use-shallow.md" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Zustand docs — Prevent rerenders with useShallow</span><span class="lc-sub">When a selector returns an object or array.</span></span></a>
<a class="link-card" href="https://github.com/pmndrs/zustand/blob/main/docs/reference/integrations/persisting-store-data.md" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Zustand docs — Persisting store data</span><span class="lc-sub">name, storage, partialize, version and migrate.</span></span></a>
<a class="link-card" href="https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/testing.md" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Zustand docs — Testing</span><span class="lc-sub">Resetting stores between tests with Vitest.</span></span></a>
<a class="link-card" href="https://github.com/pmndrs/zustand/blob/main/docs/reference/migrations/migrating-to-v5.md" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Zustand docs — Migrating to v5</span><span class="lc-sub">Why selectors returning new references now loop.</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Zustand cho state toàn app: store nằm ngoài cây, selector chỉ render lại thứ đã đổi, và persist</h2>
<p class="lead">Bài 5.1 dừng ở một giới hạn: context không cho component đăng ký nghe <em>một lát</em> của giá trị, nên đổi một mục yêu thích là mọi thẻ render lại. Một <strong>store</strong> làm được. Zustand là một thư viện store nhỏ — phần lõi mà mã React import là hai file, 1.740 byte JavaScript trong <code>node_modules</code> — và là thứ khoá này dùng cho state phía client dùng chung khắp app. Bài này đo xem selector của nó mua được gì, chỉ ra đúng một lỗi selector làm app sập, thêm lưu trữ qua F5, và xử lý tác dụng phụ không ai cảnh báo trước: các test rò state sang nhau.</p>

<p>Phiên bản: <code>zustand@5.0.15</code> với React 19.3.0. Ví dụ ở <code>src/vi-du/bai3.tsx</code>; store thật của dự án là <code>src/store/dat-lich-store.ts</code>. Output lấy từ <code>npx vitest run src/vi-du/bai3.test.tsx --reporter=verbose</code>, từ một Chromium thật do Playwright điều khiển, và từ lượt chạy test của chính dự án.</p>

<h3>Store sống ngoài cây component</h3>
${slide('rx-05', 13, 'Store Zustand nằm ngoài cây component — ai cần thì tự lấy')}
<p>State của context sống <em>bên trong</em> một component provider, nên nó chỉ tồn tại bên dưới provider đó. Store Zustand được tạo ở cấp module — một biến trong file <code>.ts</code> — và component nào import nó cũng đọc được. Không có provider nào phải bọc, không phải lo vị trí trong cây: trong app phòng khám, <code>Header</code> (đầu trang), <code>KhuBacSi</code> (danh sách), <code>LuongDatLich</code> (luồng đặt lịch) và <code>LichHenCuaToi</code> (lịch hẹn của tôi) là anh em hoặc họ hàng xa, và cả bốn dùng chung một store.</p>
${SD.khoVi}
<p>Cài đặt là một lệnh. Dự án thử đã có sẵn, nên npm không có gì để thêm:</p>
<div class="out">$ npm install zustand
up to date, audited 173 packages in 879ms

$ npm ls zustand
phong-kham@0.0.0 …/ch05
&#96;-- zustand@5.0.15</div>

<h3><code>create()</code>: state và hành động trong một hook</h3>
${slide('rx-05', 14, 'create(): state và hành động sống chung trong một hook')}
<pre><code class="language-tsx">/* ───────── 1. Một store: state + hành động nằm chung, ngoài cây component ───────── */
interface YeuThichState {
  yeuThich: string[];
  doi: (id: string) =&gt; void;
  xoaHet: () =&gt; void;
}
export const useYeuThichStore = create&lt;YeuThichState&gt;()((set) =&gt; ({
  yeuThich: [],
  doi: (id) =&gt; set((s) =&gt; ({ yeuThich: doiYeuThich(s.yeuThich, id) })), // set GỘP nông vào state cũ
  xoaHet: () =&gt; set({ yeuThich: [] }),
}));</code></pre>
<p>Từng mảnh làm gì:</p>
<ul>
<li><code>create&lt;YeuThichState&gt;()(…)</code> dựng store và trả về một <strong>hook</strong>, <code>useYeuThichStore</code>. Lời gọi kép lạ mắt <code>create&lt;T&gt;()(…)</code> là cách kiểu TypeScript của Zustand muốn (cho phép ghi tham số kiểu trong khi phần còn lại tự suy ra); cứ chép đúng hình dạng đó.</li>
<li>Hàm bạn truyền vào nhận <code>set</code> và trả về state ban đầu <em>cùng</em> các hành động. Hành động là hàm bình thường, cất ngay cạnh dữ liệu — không type hành động, không reducer, không dispatch.</li>
<li><code>set((s) =&gt; ({ … }))</code> chạy như dạng hàm cập nhật của setter <code>useState</code>: nhận state hiện tại và trả về phần thay đổi. Khác setter của <code>useState</code>, <code>set</code> <strong>gộp nông (shallow merge)</strong>: <code>set({ yeuThich: [] })</code> thay <code>yeuThich</code> và giữ nguyên <code>doi</code>, <code>xoaHet</code>. Object lồng bên trong thì không gộp — với chúng bạn vẫn spread từng tầng (Bài 2.3).</li>
<li>Bản thân lần cập nhật vẫn phải bất biến: <code>doiYeuThich</code> của Chương 2 trả mảng mới. Zustand cũng so bằng <code>Object.is</code>; <code>s.yeuThich.push(id)</code> sẽ chẳng đổi gì trên màn hình.</li>
</ul>
<div class="callout"><p><strong>JS nhắc nhanh — hàm trả về object.</strong> <code>(s) =&gt; ({ yeuThich: … })</code>: cặp ngoặc tròn quanh ngoặc nhọn là quan trọng. Thiếu nó, <code>(s) =&gt; { yeuThich: … }</code> là <em>thân hàm</em> chứa một nhãn, và trả về <code>undefined</code>. Có nó, ngoặc nhọn là một object mà arrow function trả về.</p></div>

<h3>Selector: đăng ký nghe đúng thứ mình vẽ</h3>
${slide('rx-05', 15, 'Selector hẹp: bấm ♡ một thẻ, chỉ thẻ đó render lại')}
<p>Component đọc store bằng cách gọi hook với một <strong>selector</strong> — hàm nhặt ra thứ nó cần từ toàn bộ state. Zustand chạy selector sau mỗi thay đổi và chỉ render lại component khi <em>kết quả</em> đổi (theo <code>Object.is</code>). Hai phiên bản thẻ bác sĩ, một dùng selector hẹp, một lấy cả store:</p>
<pre><code class="language-tsx">/** ✅ Selector hẹp: chỉ render lại khi KẾT QUẢ của selector đổi (so bằng Object.is). */
const TheChon = memo(function TheChon({ bacSi }: { bacSi: BacSi }) {
  dem(&#96;chon:&#36;{bacSi.id}&#96;);
  const la = useYeuThichStore((s) =&gt; s.yeuThich.includes(bacSi.id));
  const doi = useYeuThichStore((s) =&gt; s.doi);
  return (
    &lt;button type="button" aria-pressed={la} aria-label={&#96;Yêu thích &#36;{bacSi.ten}&#96;} onClick={() =&gt; doi(bacSi.id)}&gt;
      {la ? '♥' : '♡'}
    &lt;/button&gt;
  );
});
/** ❌ Lấy cả store: mọi thay đổi ⇒ render lại. */
const TheCaStore = memo(function TheCaStore({ bacSi }: { bacSi: BacSi }) {
  dem(&#96;ca:&#36;{bacSi.id}&#96;);
  const { yeuThich, doi } = useYeuThichStore();
  const la = yeuThich.includes(bacSi.id);
  return (
    &lt;button type="button" aria-pressed={la} aria-label={&#96;Yêu thích &#36;{bacSi.ten}&#96;} onClick={() =&gt; doi(bacSi.id)}&gt;
      {la ? '♥' : '♡'}
    &lt;/button&gt;
  );
});
function DemYeuThich() {
  dem('dem');
  const soLuong = useYeuThichStore((s) =&gt; s.yeuThich.length);
  return &lt;p&gt;Yêu thích: {soLuong}&lt;/p&gt;;
}
export function LuoiZustand({ caStore = false }: { caStore?: boolean }) {
  return (
    &lt;&gt;
      &lt;DemYeuThich /&gt;
      {danhSachBacSi.map((bs) =&gt; (caStore ? &lt;TheCaStore key={bs.id} bacSi={bs} /&gt; : &lt;TheChon key={bs.id} bacSi={bs} /&gt;))}
    &lt;/&gt;
  );
}</code></pre>
<p>Cùng thí nghiệm như ở 5.1 — bấm trái tim trên BS. Trần Thu Hà một lần, đếm số lần thẻ render:</p>
<div class="out">[selector] 1 click ♡ ⇒ selector hep: +1 the, dem render 2 lan | useYeuThichStore(): +6 the, dem render 2 lan</div>
<ul>
<li><strong>Selector hẹp: +1.</strong> Mỗi thẻ chọn một <em>boolean</em>: bác sĩ của tôi có trong danh sách không? Sau cú bấm, thẻ BS. Hà nhận <code>true</code> thay vì <code>false</code> và render lại. Năm thẻ kia lại nhận <code>false</code> — bằng lần trước — và Zustand để yên cho chúng. Context không làm được vậy: ở 5.1 cùng cú bấm đó tốn +6.</li>
<li><strong>Lấy cả store: +6.</strong> <code>useYeuThichStore()</code> không có selector trả về toàn bộ object state, thứ là object mới sau mỗi lần <code>set</code>. Mọi thẻ render lại khi bất cứ thứ gì trong store đổi. Chạy được; chỉ là vứt đi lý do để dùng store.</li>
<li><strong>Bộ đếm <code>DemYeuThich</code>: 2 lần</strong> (mount + một) ở cả hai lượt. Nó chọn <code>s.yeuThich.length</code>, một con số thật sự đã đổi.</li>
</ul>
<p>Hành động cũng được chọn qua selector: <code>useYeuThichStore((s) =&gt; s.doi)</code>. Một hàm cất trong store không bao giờ đổi, nên component chỉ chọn hành động không bao giờ render lại vì state đổi — cùng hiệu quả mà ở 5.1 phải tốn hai context, ở đây miễn phí.</p>
${SD.selectorVi}
<p>Và vì store là một object bình thường bên ngoài React, bạn dùng được nó từ bất cứ đâu — một hàm tiện ích, một test, một handler WebSocket — qua <code>getState()</code>:</p>
<pre><code class="language-tsx">test('gọi hành động NGOÀI React bằng getState()', () =&gt; {
  render(&lt;LuoiZustand /&gt;);
  act(() =&gt; {
    useYeuThichStore.getState().doi('bs-4');
    useYeuThichStore.getState().doi('bs-6');
  });
  console.info('[getState] sau 2 lan doi ngoai React:', screen.getByText(/Yêu thích:/).textContent, JSON.stringify(useYeuThichStore.getState().yeuThich));
  expect(screen.getByText('Yêu thích: 2')).toBeInTheDocument();
});</code></pre>
<div class="out">[getState] sau 2 lan doi ngoai React: Yêu thích: 2 ["bs-4","bs-6"]</div>
<p>Component trên màn hình vẫn cập nhật dù không có gì bên trong React gọi hành động. (<code>act()</code> là cách Testing Library nói "việc của React xảy ra trong này, làm xong rồi mới chạy dòng tiếp" — chỉ cần vì thay đổi đến từ ngoài một sự kiện React.)</p>

<h3>Selector trả object mới: lỗi duy nhất làm app sập</h3>
${slide('rx-05', 16, 'Selector trả object mới ⇒ vòng lặp vô hạn; useShallow chữa')}
<p>Muốn lấy hai giá trị trong một lần gọi là chuyện tự nhiên:</p>
<pre><code class="language-tsx">/* ───────── 2. Selector trả object MỚI mỗi lần ⇒ vòng lặp vô hạn (Zustand 5) ───────── */
export function ThanhCongCuSai() {
  const { soLuong, xoaHet } = useYeuThichStore((s) =&gt; ({ soLuong: s.yeuThich.length, xoaHet: s.xoaHet }));
  return &lt;button type="button" onClick={xoaHet}&gt;Xoá hết ({soLuong})&lt;/button&gt;;
}
export function ThanhCongCuDung() {
  const { soLuong, xoaHet } = useYeuThichStore(useShallow((s) =&gt; ({ soLuong: s.yeuThich.length, xoaHet: s.xoaHet })));
  return &lt;button type="button" onClick={xoaHet}&gt;Xoá hết ({soLuong})&lt;/button&gt;;
}</code></pre>
<p><code>ThanhCongCuSai</code> render — một lần:</p>
<div class="out">[object moi] loi: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
[useShallow] Xoá hết (0)</div>
<div class="pitfall co-tieu-de"><strong>Bẫy — <code>useStore((s) =&gt; ({ a: s.a, b: s.b }))</code> trong Zustand 5.</strong> Selector dựng một <em>object mới</em> mỗi lần chạy. Zustand 5 giao selector cho <code>useSyncExternalStore</code> của React, thứ gọi lại nó để kiểm ảnh chụp có ổn định không, nhận một object khác, kết luận store đã đổi, render lại, lại nhận một object mới… React chặn vòng lặp bằng "Maximum update depth exceeded". Zustand 4 còn dung thứ mẫu này (chỉ render lại quá nhiều), nên bạn sẽ gặp nó trong mã cũ và bài hướng dẫn cũ; nâng lên bản 5 là nó thành lỗi sập — hướng dẫn chuyển sang v5 của Zustand in đúng lỗi này. Ba cách chữa, dễ nhất trước: gọi hook hai lần, mỗi lần một giá trị (<code>const soLuong = useStore((s) =&gt; s.yeuThich.length)</code>); hoặc bọc selector trong <code>useShallow</code>, thứ so object từng field một; hoặc chọn một object đã có sẵn thay vì dựng object mới.</div>
<p><code>useShallow</code> lấy từ <code>zustand/react/shallow</code>. Nó giữ kết quả lần trước khi mọi field cấp một đều bằng nhau (theo <code>Object.is</code>), nên object trả về giữ nguyên giữa các lần render trừ khi <code>soLuong</code> hoặc <code>xoaHet</code> thật sự đổi.</p>

<h3>persist: store sống qua F5</h3>
${slide('rx-05', 17, 'persist: store tự lưu localStorage, F5 vẫn còn')}
<p>Yêu thích biến mất khi tải lại trang thì khó chịu; lịch hẹn đã đặt biến mất thì là một bug bị báo. Middleware <code>persist</code> (một lớp bọc quanh hàm tạo store) lưu state vào <code>localStorage</code> sau mỗi thay đổi và nạp lại khi store được tạo:</p>
<pre><code class="language-tsx">/* ───────── 3. persist: tự lưu/đọc localStorage ───────── */
interface GhiNhoState {
  yeuThich: string[];
  lanCuoiXem: string | null;
  doi: (id: string) =&gt; void;
}
export const useGhiNhoStore = create&lt;GhiNhoState&gt;()(
  persist(
    (set) =&gt; ({
      yeuThich: [],
      lanCuoiXem: null,
      doi: (id) =&gt; set((s) =&gt; ({ yeuThich: doiYeuThich(s.yeuThich, id), lanCuoiXem: id })),
    }),
    {
      name: 'demo-yeu-thich', // khoá trong localStorage
      storage: createJSONStorage(() =&gt; localStorage),
      partialize: (s) =&gt; ({ yeuThich: s.yeuThich }), // chỉ lưu thứ đáng nhớ; hàm thì không lưu được
      version: 1,
    },
  ),
);</code></pre>
<p>Test bấm trái tim, đọc <code>localStorage</code>, rồi giả lập tải lại trang bằng cách vứt mọi module đã nạp (<code>vi.resetModules()</code>) và import lại file — một store mới tinh, y như sau F5:</p>
<pre><code class="language-tsx">test('persist: ghi vào localStorage, chỉ phần partialize', async () =&gt; {
  const user = userEvent.setup();
  function Nut() {
    const doi = useGhiNhoStore((s) =&gt; s.doi);
    return &lt;button type="button" onClick={() =&gt; doi('bs-2')}&gt;♡&lt;/button&gt;;
  }
  render(&lt;Nut /&gt;);
  await user.click(screen.getByRole('button'));
  console.info('[persist] localStorage =', localStorage.getItem('demo-yeu-thich'));
  console.info('[persist] trong bo nho: lanCuoiXem =', useGhiNhoStore.getState().lanCuoiXem);
  // Giả lập "tải lại trang": nạp LẠI module từ đầu ⇒ một store mới tinh, tự đọc localStorage khi tạo
  vi.resetModules();
  const { useGhiNhoStore: storeMoi } = await import('./bai3');
  console.info('[persist] store moi sau "tai lai":', JSON.stringify({ yeuThich: storeMoi.getState().yeuThich, lanCuoiXem: storeMoi.getState().lanCuoiXem }), '| da hydrate:', storeMoi.persist.hasHydrated());
  expect(storeMoi.getState().yeuThich).toEqual(['bs-2']);
});</code></pre>
<div class="out">[persist] localStorage = {"state":{"yeuThich":["bs-2"]},"version":1}
[persist] trong bo nho: lanCuoiXem = bs-2
[persist] store moi sau "tai lai": {"yeuThich":["bs-2"],"lanCuoiXem":null} | da hydrate: true</div>
<ul>
<li><code>name</code> là khoá trong <code>localStorage</code>. Hai store trùng tên sẽ ghi đè nhau.</li>
<li><code>partialize</code> chọn thứ được lưu. <code>lanCuoiXem</code> ("xem lần cuối") có trong bộ nhớ (<code>bs-2</code>) nhưng không được lưu, nên sau khi tải lại nó về <code>null</code> — đúng thiết kế. Hàm thì dù sao cũng không lưu thành JSON được.</li>
<li><code>version</code> được lưu cạnh dữ liệu. Khi đổi hình dạng state được lưu, tăng số và đưa cho <code>persist</code> một hàm <code>migrate</code>; không thì dữ liệu cũ trong trình duyệt người dùng bị nạp vào hình dạng mới.</li>
<li><strong>Hydration</strong> (nạp lại state đã lưu) là đồng bộ với <code>localStorage</code>: <code>hasHydrated()</code> đã là <code>true</code> ngay sau khi import.</li>
</ul>
${SD.persistVi}
<p>Store thật của dự án cùng mẫu đó, với hai thứ app phòng khám cần giữ:</p>
<pre><code class="language-ts">import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { doiYeuThich } from '../logic/yeu-thich';
import type { LichHen } from '../types';

interface DatLichState {
  yeuThich: string[];
  lichHen: LichHen[];
  doiYeuThich: (bacSiId: string) =&gt; void;
  themLichHen: (lh: LichHen) =&gt; void;
}

/**
 * State CỦA NGƯỜI DÙNG, dùng ở nhiều nơi xa nhau (thẻ bác sĩ, khung chi tiết, Header, luồng đặt lịch),
 * và cần sống qua F5 ⇒ một store Zustand có persist. Danh sách bác sĩ/khung giờ (dữ liệu của MÁY CHỦ)
 * KHÔNG ở đây — Chương 6 giao nó cho TanStack Query.
 */
export const useDatLichStore = create&lt;DatLichState&gt;()(
  persist(
    (set) =&gt; ({
      yeuThich: [],
      lichHen: [],
      doiYeuThich: (bacSiId) =&gt; set((s) =&gt; ({ yeuThich: doiYeuThich(s.yeuThich, bacSiId) })),
      themLichHen: (lh) =&gt; set((s) =&gt; ({ lichHen: [...s.lichHen, lh] })),
    }),
    {
      name: 'phong-kham-dat-lich',
      storage: createJSONStorage(() =&gt; localStorage),
      partialize: (s) =&gt; ({ yeuThich: s.yeuThich, lichHen: s.lichHen }),
      version: 1,
    },
  ),
);</code></pre>
<p>Trong một Chromium thật, sau khi đặt một lịch qua luồng bốn bước:</p>
<div class="out">[sau] header: Lịch hẹn của tôi: 1
[sau] localStorage = {"state":{"yeuThich":["bs-6"],"lichHen":[{"id":"lh-1790303755862","bacSiId":"bs-1","khungGioId":"bs-1-kg-3","benhNhan":{"hoTen":"Nguyễn Thị Ánh","soDienThoai":"0901234567","ngaySinh":"1995-03-14"},"lyDo":"Đau dạ dày, khám lại theo hẹn","trangThai":"cho-xac-nhan"}]},"version":1}
[sau] F5 roi: Lịch hẹn của tôi: 1 | Lịch hẹn của tôi (1)</div>
<div class="callout warn"><p><strong>Thứ không nên cho vào state được lưu.</strong> <code>localStorage</code> là chữ thường mà script nào trên trang cũng đọc được, và nó nằm lại trên máy cho tới khi ai đó xoá. Đừng lưu token (Chương 14), mật khẩu, hay thông tin y tế bạn không muốn để lại trên một máy tính dùng chung. Tên và số điện thoại bệnh nhân trong bản demo này có mặt vì app của khoá dùng dữ liệu giả; phòng khám thật sẽ giữ lịch hẹn trên máy chủ (Chương 6) và cùng lắm chỉ lưu danh sách yêu thích. Và <code>persist</code> không phải bộ nhớ đệm cho dữ liệu máy chủ — đó là việc của TanStack Query.</p></div>

<h3>Store và URL sống ngoài component — test phải tự dọn</h3>
${slide('rx-05', 18, 'Store và URL sống ngoài component — test phải tự dọn')}
<p>Store là một biến cấp module, nên nó sống từ test này sang test sau. Test ví dụ đầu tiên chứng minh điều đó: render, bấm một trái tim, gỡ, rồi render lại "như một test khác":</p>
<div class="out">[ro ri] lan render thu hai thay: Yêu thích: 1</div>
<p>Lần render thứ hai bắt đầu với mục yêu thích của lần một. Trong dự án chuyện này cắn thật: sau khi chuyển yêu thích vào store và bộ lọc lên URL (Bài 5.4), sáu test <code>KhuBacSi</code> cũ của Chương 2 được chạy lại y nguyên:</p>
<div class="out">$ npx vitest run src/components/KhuBacSi.test.tsx
 ❯ src/components/KhuBacSi.test.tsx (6 tests | 4 failed) 438ms
   × gõ "lan" (không dấu) ⇒ tìm ra BS. Phạm Ngọc Lan 71ms
   × xem chi tiết rồi đóng 21ms
   × yêu thích: bật, tắt, và chi tiết luôn khớp với thẻ 17ms
   × lọc KHÔNG làm mất yêu thích của bác sĩ đang bị ẩn 22ms
…
 FAIL  src/components/KhuBacSi.test.tsx &gt; gõ "lan" (không dấu) ⇒ tìm ra BS. Phạm Ngọc Lan
TestingLibraryElementError: Unable to find an accessible element with the role "heading" and name "Đội ngũ bác sĩ (1)"
…
 Test Files  1 failed (1)
      Tests  4 failed | 2 passed (6)</div>
<p>Test đầu bấm "Nhi", đặt <code>?ck=nhi</code> lên URL. <code>cleanup()</code> gỡ DOM, nhưng không gỡ URL: test thứ hai render một danh sách đã lọc sẵn chuyên khoa nhi, gõ "lan", và không tìm thấy ai. Mỗi test chạy riêng thì xanh; chạy chung thì đỏ. Cách chữa là đặt lại mọi thứ sống ngoài component sau mỗi test, trong <code>src/test/setup.ts</code>:</p>
<pre><code class="language-ts">import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { useDatLichStore } from '../store/dat-lich-store';

// Vitest mặc định globals: false ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.
// Không có dòng này, test sau thấy cả những gì test trước đã vẽ.
afterEach(() =&gt; {
  cleanup();
  // Chương 5: ba thứ sống NGOÀI component nên cleanup() không dọn — test trước để lại là test sau thấy.
  window.history.replaceState(null, '', '/'); // URL (?ck=…&amp;q=…)
  useDatLichStore.setState(useDatLichStore.getInitialState(), true); // store Zustand (biến của module)
  localStorage.clear(); // bản lưu của persist — xoá SAU cùng: setState ở trên lại ghi xuống localStorage
});</code></pre>
<p><code>getInitialState()</code> trả về state lúc store vừa được tạo; đối số thứ hai <code>true</code> bảo <code>set</code> <strong>thay hẳn</strong> state thay vì gộp. Thứ tự là quan trọng, và cũng đã đo: để <code>localStorage.clear()</code> lên trước thì lần đặt lại store ngay sau nó cũng là một thay đổi, và <code>persist</code> ghi nó xuống ngay:</p>
<div class="out">AssertionError: expected '{"state":{"yeuThich":[],"lichHen":[]}…' to be null</div>
<p>Hướng dẫn test của chính Zustand đi xa hơn: mock <code>zustand</code> để mọi store tự đặt lại sau mỗi test; với dự án chỉ có một store, ba dòng trong <code>setup.ts</code> là đủ. Có chúng, cả 56 test của dự án xanh theo mọi thứ tự.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>State toàn cục ở FER202 là Redux: <code>createStore</code> (hoặc <code>configureStore</code>), một root reducer gộp các slice, <code>&lt;Provider store={store}&gt;</code> bọc app, <code>useSelector</code>/<code>useDispatch</code> hoặc <code>connect(mapStateToProps)</code>, và middleware như thunk cho việc bất đồng bộ. → Ở nhiều nhóm năm 2026, state <em>phía client</em> toàn app là một store Zustand như <code>useDatLichStore</code>: một file, không provider, hành động là hàm, selector cho việc render lại chính xác, <code>persist</code> cho lưu cục bộ; còn state <em>của máy chủ</em> không nằm trong store nào — TanStack Query sở hữu nó (Chương 6), và điều đó gỡ đi phần lớn những gì store Redux từng phải giữ. · <em>Vì sao:</em> ít mã hơn cho cùng các bảo đảm, và việc tách state client với state máy chủ xoá sổ cả một lớp bug (danh sách cũ, cờ đang tải bị lặp). Redux Toolkit vẫn phổ biến — app lớn có nhật ký sự kiện phức tạp, cần gỡ lỗi du hành thời gian, hay nhóm đã thạo nó — và ý tưởng selector bạn học ở đây giống hệt <code>useSelector</code>.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Context, Redux, Zustand — chọn thế nào? Zustand tránh render thừa bằng cách nào?"</p>
<p>Context đưa một giá trị xuống cây; mọi bên đọc render lại khi giá trị đổi, nên em dùng nó cho thứ ít đổi như giao diện hay người dùng hiện tại. Với state phía client được nhiều component đọc và đổi thường xuyên, em dùng store có selector: Zustand nếu nhóm muốn ít mã, Redux Toolkit nếu app đã dùng nó hoặc cần hệ devtools và middleware của nó. Zustand chỉ render lại component khi kết quả selector của nó đổi theo <code>Object.is</code> — nên mỗi component nên chọn giá trị nhỏ nhất nó cần, và nếu chọn nhiều field thành một object thì bọc selector bằng <code>useShallow</code>; ở Zustand 5, trả object mới mà không bọc là vòng lặp render vô hạn. Dữ liệu máy chủ không thuộc về cái nào trong số đó — đó là TanStack Query.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> thêm tính năng "so sánh bác sĩ" (tối đa 3) bằng một store Zustand, và chứng minh selector chạy đúng.</p><ol>
<li>Tạo <code>src/store/so-sanh-store.ts</code>: <code>useSoSanhStore</code> có <code>ids: string[]</code>, <code>them(id)</code> (bỏ qua trùng, không làm gì khi đã đủ 3), <code>bo(id)</code> và <code>xoaHet()</code>. Chỉ lưu <code>ids</code> dưới khoá <code>'so-sanh'</code>.</li>
<li>Thêm nút "So sánh" vào <code>TheBacSi</code> với <code>aria-pressed</code> chọn bằng <code>(s) =&gt; s.ids.includes(bacSi.id)</code>, và một thanh nhỏ ở <code>Header</code> hiện "So sánh: n/3" (selector: <code>s.ids.length</code>).</li>
<li>Đặt lại store mới trong <code>setup.ts</code> giống <code>useDatLichStore</code>.</li>
<li>Test: thêm bác sĩ thứ tư không làm gì; khoá <code>'so-sanh'</code> trong <code>localStorage</code> chứa đúng <code>{"state":{"ids":[…]},"version":…}</code>; và với một bộ đếm render, thêm một bác sĩ chỉ render lại đúng một <code>TheBacSi</code>.</li>
</ol><p><strong>Đạt khi:</strong> <code>npx tsc -b</code> không in gì, mọi test của dự án vẫn xanh khi chạy chung (chạy <code>npx vitest run</code> hai lần để chắc thứ tự không ảnh hưởng), test đếm render cho +1 thẻ, và sau F5 trong <code>npm run dev</code> thanh "So sánh: n/3" vẫn hiện đúng n cũ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">store (kho state)</span><span class="v">state + hành động giữ bên ngoài cây component; component đăng ký nghe nó</span></div>
<div class="kv"><span class="k">selector (hàm chọn)</span><span class="v">hàm nhặt thứ component cần: <code>(s) =&gt; s.yeuThich.length</code>; chỉ render lại khi kết quả đổi</span></div>
<div class="kv"><span class="k"><code>set</code> (gộp nông)</span><span class="v">hàm cập nhật của Zustand; gộp các field cấp một; <code>set(x, true)</code> thì thay hẳn</span></div>
<div class="kv"><span class="k"><code>getState()</code></span><span class="v">đọc store hoặc gọi hành động từ ngoài React (test, hàm tiện ích)</span></div>
<div class="kv"><span class="k"><code>useShallow</code></span><span class="v">so object được chọn từng field một để nó giữ ổn định</span></div>
<div class="kv"><span class="k">middleware (lớp giữa)</span><span class="v">lớp bọc quanh hàm tạo store để thêm hành vi (persist, devtools)</span></div>
<div class="kv"><span class="k">persist / hydration (lưu / nạp lại)</span><span class="v">lưu state xuống bộ nhớ trình duyệt / nạp lại khi store được tạo</span></div>
<div class="kv"><span class="k">test isolation (cách ly test)</span><span class="v">mỗi test bắt đầu từ cùng một state; store cấp module và URL phải được đặt lại</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Store Zustand là một hook tạo ở cấp module: không provider, component nào cũng dùng được, và mã ngoài React cũng dùng được qua <code>getState()</code>.</li>
<li>Chọn thứ nhỏ nhất bạn vẽ. Đo được: selector hẹp render lại 1 thẻ mỗi cú bấm; lấy cả store render lại 6 (bằng context).</li>
<li>Ở Zustand 5, selector trả object mới sập với "Maximum update depth exceeded"; gọi hook hai lần hoặc dùng <code>useShallow</code>.</li>
<li><code>set</code> gộp một tầng; cập nhật vẫn phải bất biến.</li>
<li><code>persist</code> với <code>name</code>, <code>partialize</code>, <code>version</code> lưu các field đã chọn vào <code>localStorage</code>; đo trên Chromium: số lịch hẹn sống qua F5. Không bao giờ lưu bí mật.</li>
<li>Store (và URL) sống lâu hơn một test: đặt lại trong <code>setup.ts</code>, store trước, <code>localStorage.clear()</code> sau cùng — không thì 4/6 test cũ đỏ.</li>
</ul>

<a class="link-card" href="https://github.com/pmndrs/zustand/blob/main/docs/learn/getting-started/introduction.md" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Zustand docs — Introduction</span><span class="lc-sub">Tạo store, nối component, chọn state.</span></span></a>
<a class="link-card" href="https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/prevent-rerenders-with-use-shallow.md" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Zustand docs — Prevent rerenders with useShallow</span><span class="lc-sub">Khi selector trả object hoặc mảng.</span></span></a>
<a class="link-card" href="https://github.com/pmndrs/zustand/blob/main/docs/reference/integrations/persisting-store-data.md" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Zustand docs — Persisting store data</span><span class="lc-sub">name, storage, partialize, version và migrate.</span></span></a>
<a class="link-card" href="https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/testing.md" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Zustand docs — Testing</span><span class="lc-sub">Đặt lại store giữa các test với Vitest.</span></span></a>
<a class="link-card" href="https://github.com/pmndrs/zustand/blob/main/docs/reference/migrations/migrating-to-v5.md" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Zustand docs — Migrating to v5</span><span class="lc-sub">Vì sao selector trả tham chiếu mới giờ thành vòng lặp.</span></span></a>
</div>
`,
  },
  {
    title: '5.4 — The URL as state: filters that survive F5, shareable links and a working Back button|||5.4 — URL là state: bộ lọc sống qua F5, link chia sẻ được và nút Back chạy đúng',
    slug: 'rx-5-4-url-state',
    type: 'LESSON',
    isFreePreview: true,
    description: 'F5 xoá useState còn URL thì giữ (đo trên Chromium thật), URLSearchParams và kiểm URL như dữ liệu người dùng nhập, hook useBoLocUrl với pushState/replaceState và popstate, bẫy pushState không làm React render lại, và bảng mỗi loại state một chỗ ở.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>The URL as state: filters that survive F5, links you can share, and a Back button that works</h2>
<p class="lead">Some state is not "the app&#39;s" or "the user&#39;s" — it is <em>the page&#39;s</em>. Which specialty is filtered, what was typed in the search box, which page of results you are on: if a colleague sends you a link, you expect to see what they saw; if you press Back, you expect the previous filter; if you press F5, you expect nothing to change. None of that works while the filter lives in <code>useState</code>. The browser already has a place for this state, visible, shareable and kept in history: the URL.</p>

<p>Examples in <code>src/vi-du/bai4.test.tsx</code>; the project code is <code>src/logic/bo-loc-url.ts</code>, <code>src/hooks/useBoLocUrl.ts</code> and <code>src/components/KhuBacSi.tsx</code>. Browser behaviour (F5, Back, a link opened in a new tab) was measured in a real Chromium driven by Playwright, against <code>vite preview</code> — once for the project as it was before this chapter, once after.</p>

<h3>F5 wipes useState — the URL survives</h3>
${slide('rx-05', 19, 'useState is lost on F5 — state in the URL is not')}
<p>The script does the same thing to both versions: click "Nhi", type "vy" in the search box, heart BS. Vũ Thảo Vy, then reload.</p>
<div class="out">[truoc] truoc F5: URL = / | Đội ngũ bác sĩ (1) | yeu thich: Yêu thích (1)
[truoc] sau F5:   URL = / | Đội ngũ bác sĩ (6) | yeu thich: Yêu thích (0)

[sau] truoc F5: URL = /?ck=nhi&amp;q=vy | Đội ngũ bác sĩ (1) | yeu thich: Yêu thích (1)
[sau] sau F5:   URL = /?ck=nhi&amp;q=vy | Đội ngũ bác sĩ (1) | yeu thich: Yêu thích (1)
[sau] tab moi mo /?ck=nhi&amp;q=vy: Đội ngũ bác sĩ (1)</div>
<p>Before this chapter, reload threw everything away: six doctors, zero favourites, and the address bar never changed — there was nothing to share. After it, the address bar says <code>/?ck=nhi&amp;q=vy</code>; reload keeps the filter (from the URL) and the favourite (from the Zustand store of Lesson 5.3). The last line is a different browser profile opening the link: it sees the same single doctor — but not your favourites, because those are yours, not the page&#39;s. That split is exactly right.</p>
<p>A quick way to decide: <strong>would it make sense in a link?</strong> Filters, search text, sort order, page number, the selected tab, which item is open: yes. Whether a dropdown is open, a half-typed form, your favourites, a login token: no.</p>

<h3>URLSearchParams: reading and writing the <code>?…</code> part</h3>
${slide('rx-05', 20, 'URLSearchParams reads and writes the ?… part — and every value is a string')}
<p>The part after <code>?</code> is the <strong>query string</strong>: <code>key=value</code> pairs joined by <code>&amp;</code>, with special characters encoded. JavaScript has a built-in class for it, so you never split strings by hand:</p>
<pre><code class="language-tsx">test('URLSearchParams: đọc, ghi, mã hoá chữ có dấu', () =&gt; {
  const p = new URLSearchParams('?ck=nhi&amp;q=h%C3%A0&amp;q=lan');
  console.info('[usp] get ck =', p.get('ck'), '| get q =', p.get('q'), '| getAll q =', p.getAll('q'), '| get trang =', p.get('trang'));
  p.set('q', 'Thảo Vy');
  p.delete('ck');
  p.set('trang', String(2));
  console.info('[usp] toString =', p.toString());
  console.info('[usp] typeof get("trang") =', typeof new URLSearchParams('?trang=2').get('trang'));
  expect(p.toString()).toBe('q=Th%E1%BA%A3o+Vy&amp;trang=2');
});</code></pre>
<div class="out">[usp] get ck = nhi | get q = hà | getAll q = [ 'hà', 'lan' ] | get trang = null
[usp] toString = q=Th%E1%BA%A3o+Vy&amp;trang=2
[usp] typeof get("trang") = string</div>
<ul>
<li><code>get</code> decodes for you: <code>h%C3%A0</code> comes back as <code>hà</code>. A missing key gives <code>null</code>, not <code>undefined</code> or <code>''</code>.</li>
<li>A key can appear twice; <code>get</code> returns the first, <code>getAll</code> all of them.</li>
<li><code>toString</code> encodes: Vietnamese letters become <code>%E1%BA%A3</code>-style bytes, and a space becomes <code>+</code>. (<code>encodeURIComponent</code>, used later in this lesson, writes a space as <code>%20</code>. Both decode correctly.)</li>
<li><strong>Every value is a string.</strong> <code>?trang=2</code> gives <code>'2'</code>. Numbers, booleans and lists must be converted, and checked.</li>
</ul>
<p>That last point is the important one. The URL is text <strong>the user can type</strong>: <code>?ck=tim-mach</code> (a specialty the clinic does not have), <code>?ck=toString</code>, a 5,000-character <code>q</code>. Reading the URL is reading outside input, so the project parses it in one small pure module, with a fallback for anything unexpected:</p>
<pre><code class="language-ts">import { TEN_CHUYEN_KHOA } from '../du-lieu/chuyen-khoa';
import type { ChuyenKhoa } from '../types';
import type { BoLocChuyenKhoa } from './loc-bac-si';

export interface BoLoc {
  chuyenKhoa: BoLocChuyenKhoa;
  tuKhoa: string;
}
export const BO_LOC_MAC_DINH: BoLoc = { chuyenKhoa: 'tat-ca', tuKhoa: '' };

/** Type guard: chuỗi lạ trên URL có phải một chuyên khoa thật không? */
function laChuyenKhoa(x: string | null): x is ChuyenKhoa {
  return x !== null &amp;&amp; Object.hasOwn(TEN_CHUYEN_KHOA, x);
}

/** '?ck=nhi&amp;q=h%C3%A0' → { chuyenKhoa: 'nhi', tuKhoa: 'hà' }. URL do NGƯỜI DÙNG gõ được ⇒ không tin, sai thì về mặc định. */
export function docBoLoc(search: string): BoLoc {
  const p = new URLSearchParams(search);
  const ck = p.get('ck');
  return {
    chuyenKhoa: laChuyenKhoa(ck) ? ck : 'tat-ca',
    tuKhoa: (p.get('q') ?? '').slice(0, 50),
  };
}

/** Ngược lại: bộ lọc → '?ck=nhi&amp;q=h%C3%A0'. Giá trị mặc định thì KHÔNG ghi (URL gọn, link chia sẻ ngắn). */
export function taoSearch({ chuyenKhoa, tuKhoa }: BoLoc): string {
  const p = new URLSearchParams();
  if (chuyenKhoa !== 'tat-ca') p.set('ck', chuyenKhoa);
  if (tuKhoa.trim() !== '') p.set('q', tuKhoa);
  const s = p.toString();
  return s === '' ? '' : &#96;?&#36;{s}&#96;;
}</code></pre>
<div class="callout"><p><strong>JS quick reminder — two details in this file.</strong> <code>function laChuyenKhoa(x: string | null): x is ChuyenKhoa</code> is a <em>type guard</em>: a function returning a boolean whose return type tells TypeScript "if this returns true, <code>x</code> is a <code>ChuyenKhoa</code>". After <code>laChuyenKhoa(ck) ? ck : …</code>, TypeScript accepts <code>ck</code> where a <code>ChuyenKhoa</code> is required. And <code>Object.hasOwn(obj, key)</code> checks the object&#39;s <em>own</em> keys. The shorter <code>key in obj</code> would be wrong here: every object inherits <code>toString</code>, so <code>'toString' in TEN_CHUYEN_KHOA</code> is <code>true</code> (checked in Node: <code>true</code> vs <code>Object.hasOwn</code> <code>false</code>).</p></div>
<p><code>taoSearch</code> is the reverse, and it leaves out default values, so the plain list is just <code>/</code> and a shared link stays short. The tests pin down both directions, including the round trip:</p>
<pre><code class="language-ts">import { expect, test } from 'vitest';
import { docBoLoc, taoSearch } from './bo-loc-url';

test('đọc URL hợp lệ, kể cả chữ có dấu đã mã hoá', () =&gt; {
  expect(docBoLoc('?ck=nhi&amp;q=h%C3%A0')).toEqual({ chuyenKhoa: 'nhi', tuKhoa: 'hà' });
});

test('URL rác ⇒ về mặc định, không vỡ', () =&gt; {
  expect(docBoLoc('?ck=tim-mach&amp;q=')).toEqual({ chuyenKhoa: 'tat-ca', tuKhoa: '' });
  expect(docBoLoc('?ck=toString')).toEqual({ chuyenKhoa: 'tat-ca', tuKhoa: '' }); // không nhầm thuộc tính kế thừa
  expect(docBoLoc('')).toEqual({ chuyenKhoa: 'tat-ca', tuKhoa: '' });
});

test('ghi URL: bỏ giá trị mặc định, mã hoá chữ có dấu', () =&gt; {
  expect(taoSearch({ chuyenKhoa: 'tat-ca', tuKhoa: '' })).toBe('');
  expect(taoSearch({ chuyenKhoa: 'da-lieu', tuKhoa: '' })).toBe('?ck=da-lieu');
  expect(taoSearch({ chuyenKhoa: 'nhi', tuKhoa: 'Thảo Vy' })).toBe('?ck=nhi&amp;q=Th%E1%BA%A3o+Vy');
});

test('đọc lại cái vừa ghi ⇒ y nguyên (khứ hồi)', () =&gt; {
  const bl = { chuyenKhoa: 'rang-ham-mat' as const, tuKhoa: 'Ngọc Lan &amp; co' };
  expect(docBoLoc(taoSearch(bl))).toEqual(bl);
});</code></pre>
<div class="out"> ✓ src/logic/bo-loc-url.test.ts &gt; đọc URL hợp lệ, kể cả chữ có dấu đã mã hoá
 ✓ src/logic/bo-loc-url.test.ts &gt; URL rác ⇒ về mặc định, không vỡ
 ✓ src/logic/bo-loc-url.test.ts &gt; ghi URL: bỏ giá trị mặc định, mã hoá chữ có dấu
 ✓ src/logic/bo-loc-url.test.ts &gt; đọc lại cái vừa ghi ⇒ y nguyên (khứ hồi)</div>

<h3>useBoLocUrl: the URL is the single source of truth</h3>
${slide('rx-05', 21, 'useBoLocUrl: the URL is the source of truth; components only read and write it')}
<p>Now a hook that lets <code>KhuBacSi</code> use the URL as if it were state:</p>
<pre><code class="language-ts">import { useEffect, useState } from 'react';
import { docBoLoc, taoSearch, type BoLoc } from '../logic/bo-loc-url';

/**
 * Bộ lọc danh sách bác sĩ SỐNG TRÊN URL (?ck=…&amp;q=…): F5 không mất, gửi link cho người khác thấy đúng
 * danh sách, nút Back của trình duyệt lùi lại lần lọc trước. Chương 7 thay bằng useSearchParams của React Router.
 */
export function useBoLocUrl() {
  // Chỉ giữ CHUỖI search làm state; bộ lọc tính ra từ nó mỗi lần render (một nguồn sự thật: URL).
  const [search, setSearch] = useState(() =&gt; window.location.search);

  useEffect(() =&gt; {
    // Back/Forward của trình duyệt đổi URL mà KHÔNG qua code của mình ⇒ nghe 'popstate' để cập nhật theo.
    const khiLuiTien = () =&gt; setSearch(window.location.search);
    window.addEventListener('popstate', khiLuiTien);
    return () =&gt; window.removeEventListener('popstate', khiLuiTien);
  }, []);

  const boLoc = docBoLoc(search);

  /** cach 'push': thêm một mục lịch sử (Back quay lại được) · 'replace': sửa mục hiện tại (hợp khi gõ phím). */
  function datBoLoc(moi: Partial&lt;BoLoc&gt;, cach: 'push' | 'replace' = 'push') {
    const s = taoSearch({ ...boLoc, ...moi });
    const url = &#96;&#36;{window.location.pathname}&#36;{s}&#36;{window.location.hash}&#96;;
    if (cach === 'push') window.history.pushState(null, '', url);
    else window.history.replaceState(null, '', url);
    setSearch(s);
  }

  return [boLoc, datBoLoc] as const;
}</code></pre>
<p>Four ideas, all from earlier chapters:</p>
<ol>
<li><strong>One piece of state: the search string.</strong> Not <code>chuyenKhoa</code> and <code>tuKhoa</code> separately — those are <em>computed</em> from the string on every render (Lesson 2.4: do not store what you can compute). The URL is the one source of truth; the <code>useState</code> is only there to tell React "the URL changed, render again".</li>
<li><strong>Writing:</strong> <code>datBoLoc</code> merges the change into the current filter, builds the new query string, writes it with <code>history.pushState</code> or <code>replaceState</code> (these change the address bar <em>without</em> loading a page), and updates the state so React re-renders.</li>
<li><strong>Back and Forward:</strong> the browser changes the URL itself and fires a <code>popstate</code> event. The effect subscribes to it and removes the listener in its cleanup — the effect-with-cleanup pattern of Chapter 4.</li>
<li><strong>The return value</strong> <code>[boLoc, datBoLoc] as const</code> mirrors <code>useState</code>: a value and a way to change it. <code>as const</code> makes TypeScript type it as a two-element tuple rather than an array of "either".</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Trap — calling <code>pushState</code> and expecting React to notice.</strong> <code>history.pushState</code> changes the address bar and fires no event at all (<code>popstate</code> fires only for Back/Forward). A component that reads <code>window.location.search</code> directly during render never learns about it:
<pre><code class="language-tsx">/** ❌ Đọc thẳng window.location trong render, ghi bằng pushState — React không hề biết URL đã đổi. */
function ChipDocThangUrl() {
  const ck = new URLSearchParams(window.location.search).get('ck') ?? 'tat-ca';
  return (
    &lt;div&gt;
      &lt;p&gt;Đang lọc: {ck}&lt;/p&gt;
      &lt;button type="button" onClick={() =&gt; window.history.pushState(null, '', '/?ck=nhi')}&gt;Nhi&lt;/button&gt;
    &lt;/div&gt;
  );
}

test('pushState một mình không làm React render lại', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;ChipDocThangUrl /&gt;);
  await user.click(screen.getByRole('button', { name: 'Nhi' }));
  console.info('[doc thang] URL =', window.location.search, '| man hinh:', screen.getByText(/Đang lọc/).textContent);
  expect(screen.getByText('Đang lọc: tat-ca')).toBeInTheDocument();
});</code></pre>
<div class="out">[doc thang] URL = ?ck=nhi | man hinh: Đang lọc: tat-ca</div>
The URL says <code>nhi</code>, the screen still says <code>tat-ca</code> — until some unrelated state change re-renders it, and then it "fixes itself", which makes the bug hard to reproduce. Always pair a history write with a React state update, as <code>datBoLoc</code> does.</div>
<p><code>KhuBacSi</code> now gets its filters from the hook and its favourites from the store; only the doctor being viewed stays in <code>useState</code>, because nothing outside this screen needs it:</p>
<pre><code class="language-tsx">import { useState } from 'react';
import { danhSachBacSi } from '../du-lieu/bac-si';
import { useBoLocUrl } from '../hooks/useBoLocUrl';
import { locBacSi } from '../logic/loc-bac-si';
import { useDatLichStore } from '../store/dat-lich-store';
import { ChiTietBacSi } from './ChiTietBacSi';
import { ChipChuyenKhoa } from './ChipChuyenKhoa';
import { DanhSachBacSi } from './DanhSachBacSi';
import { OTimBacSi } from './OTimBacSi';

export function KhuBacSi() {
  // Chương 5: mỗi mẩu state về đúng nhà của nó.
  const [{ chuyenKhoa, tuKhoa }, datBoLoc] = useBoLocUrl(); // lọc/tìm → URL (chia sẻ được, F5 không mất)
  const yeuThich = useDatLichStore((s) =&gt; s.yeuThich); // yêu thích → store toàn app (có persist)
  const doiYeuThich = useDatLichStore((s) =&gt; s.doiYeuThich);
  const [bacSiDangChonId, setBacSiDangChonId] = useState&lt;string | null&gt;(null); // chỉ màn này cần ⇒ ở lại đây

  const danhSachLoc = locBacSi(danhSachBacSi, chuyenKhoa, tuKhoa);
  const bacSiDangChon = danhSachBacSi.find((bs) =&gt; bs.id === bacSiDangChonId) ?? null;
  const dsYeuThich = danhSachBacSi.filter((bs) =&gt; yeuThich.includes(bs.id));

  return (
    &lt;&gt;
      &lt;div className="thanh-loc"&gt;
        &lt;ChipChuyenKhoa giaTri={chuyenKhoa} onDoi={(ck) =&gt; datBoLoc({ chuyenKhoa: ck })} /&gt;
        &lt;OTimBacSi tuKhoa={tuKhoa} onDoi={(q) =&gt; datBoLoc({ tuKhoa: q }, 'replace')} /&gt;
      &lt;/div&gt;
      &lt;div className="bo-cuc"&gt;
        &lt;DanhSachBacSi
          danhSach={danhSachLoc}
          bacSiDangChonId={bacSiDangChonId}
          yeuThich={yeuThich}
          onXemChiTiet={setBacSiDangChonId}
          onDoiYeuThich={doiYeuThich}
          thongBaoRong="Không tìm thấy bác sĩ phù hợp."
        /&gt;
        &lt;aside&gt;
          {bacSiDangChon ? (
            &lt;ChiTietBacSi
              bacSi={bacSiDangChon}
              laYeuThich={yeuThich.includes(bacSiDangChon.id)}
              onDoiYeuThich={doiYeuThich}
              onDong={() =&gt; setBacSiDangChonId(null)}
            /&gt;
          ) : (
            &lt;p className="goi-y"&gt;Bấm “Xem chi tiết” trên một bác sĩ để xem giới thiệu.&lt;/p&gt;
          )}
          &lt;section className="yeu-thich" aria-label="Danh sách yêu thích"&gt;
            &lt;h3&gt;Yêu thích ({dsYeuThich.length})&lt;/h3&gt;
            {dsYeuThich.length === 0 ? (
              &lt;p&gt;Chưa có bác sĩ nào.&lt;/p&gt;
            ) : (
              &lt;ul&gt;
                {dsYeuThich.map((bs) =&gt; (
                  &lt;li key={bs.id}&gt;{bs.ten}&lt;/li&gt;
                ))}
              &lt;/ul&gt;
            )}
          &lt;/section&gt;
        &lt;/aside&gt;
      &lt;/div&gt;
    &lt;/&gt;
  );
}</code></pre>
<p><strong>Try it step by step</strong> — click the chip "Nhi" on <code>/</code>:</p>
<ol>
<li><code>ChipChuyenKhoa</code> calls <code>onDoi('nhi')</code>, which calls <code>datBoLoc({ chuyenKhoa: 'nhi' })</code>.</li>
<li><code>taoSearch({ chuyenKhoa: 'nhi', tuKhoa: '' })</code> returns <code>'?ck=nhi'</code>; <code>pushState</code> puts <code>/?ck=nhi</code> in the address bar and adds a history entry.</li>
<li><code>setSearch('?ck=nhi')</code> triggers a render. <code>docBoLoc</code> computes <code>{ chuyenKhoa: 'nhi', tuKhoa: '' }</code>; the list filters; the chip is pressed.</li>
<li>Later, Back: the browser shows <code>/</code> and fires <code>popstate</code>; the listener calls <code>setSearch('')</code>; the list shows all six again.</li>
</ol>
${SD.urlEn}

<h3>pushState for choices, replaceState for typing</h3>
${slide('rx-05', 22, 'Chip click ⇒ pushState, keystroke ⇒ replaceState')}
<p>Every <code>pushState</code> is one more press of Back before the user leaves your page. The test types "thao vy" (7 characters) into a search box that writes the URL on every key, once with each method:</p>
<pre><code class="language-tsx">function OTimDayLichSu({ cach }: { cach: 'push' | 'replace' }) {
  const [q, setQ] = useState('');
  return (
    &lt;label&gt;
      Tìm
      &lt;input
        value={q}
        onChange={(e) =&gt; {
          setQ(e.target.value);
          const url = &#96;/?q=&#36;{encodeURIComponent(e.target.value)}&#96;;
          if (cach === 'push') window.history.pushState(null, '', url);
          else window.history.replaceState(null, '', url);
        }}
      /&gt;
    &lt;/label&gt;
  );
}

test('gõ "thao vy": pushState mỗi phím vs replaceState', async () =&gt; {
  const user = userEvent.setup();
  const kq: string[] = [];
  for (const cach of ['push', 'replace'] as const) {
    const dau = window.history.length;
    const { unmount } = render(&lt;OTimDayLichSu cach={cach} /&gt;);
    await user.type(screen.getByLabelText('Tìm'), 'thao vy');
    kq.push(&#96;&#36;{cach}State: +&#36;{window.history.length - dau} muc lich su, URL = &#36;{window.location.search}&#96;);
    unmount();
  }
  console.info('[lich su]', kq.join(' | '));
  expect(kq[1]).toContain('+0');
});</code></pre>
<div class="out">[lich su] pushState: +7 muc lich su, URL = ?q=thao%20vy | replaceState: +0 muc lich su, URL = ?q=thao%20vy</div>
<p>Seven history entries for one search. A user who presses Back to return to the previous page would have to press it seven times, watching the search text disappear letter by letter. So the rule in <code>KhuBacSi</code>: the chip (a deliberate choice) uses push; the search box uses <code>'replace'</code>. In the real browser, Back walks through the chip choices exactly:</p>
${SD.pushEn}
<div class="out">[sau] bam Nhi roi Da lieu: URL = /?ck=da-lieu | Đội ngũ bác sĩ (1)
[sau] nut Back:           URL = /?ck=nhi | Đội ngũ bác sĩ (2)
[sau] Back lan nua:       URL = / | Đội ngũ bác sĩ (6)</div>
<p>The project&#39;s hook tests check the same three behaviours in jsdom — opening a ready-made link, push vs replace counted with <code>history.length</code>, and <code>history.back()</code>:</p>
<pre><code class="language-tsx">import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { KhuBacSi } from '../components/KhuBacSi';

test('mở link có sẵn ?ck=nhi&amp;q=vy ⇒ danh sách đã lọc ngay', () =&gt; {
  window.history.replaceState(null, '', '/?ck=nhi&amp;q=vy');
  render(&lt;KhuBacSi /&gt;);
  expect(screen.getByRole('heading', { name: 'Đội ngũ bác sĩ (1)' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Nhi' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByLabelText('Tìm theo tên')).toHaveValue('vy');
});

test('bấm chip ⇒ URL đổi (push); gõ tìm ⇒ URL đổi (replace, không đẻ thêm lịch sử)', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;KhuBacSi /&gt;);
  const dau = window.history.length;
  await user.click(screen.getByRole('button', { name: 'Nội tổng quát' }));
  expect(window.location.search).toBe('?ck=noi');
  await user.type(screen.getByLabelText('Tìm theo tên'), 'huy');
  expect(window.location.search).toBe('?ck=noi&amp;q=huy');
  expect(window.history.length - dau).toBe(1); // 1 lần push của chip; 3 phím = 0 mục mới
});

test('nút Back của trình duyệt ⇒ bộ lọc lùi theo', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;KhuBacSi /&gt;);
  await user.click(screen.getByRole('button', { name: 'Nhi' }));
  await user.click(screen.getByRole('button', { name: 'Da liễu' }));
  expect(screen.getByRole('heading', { name: 'Đội ngũ bác sĩ (1)' })).toBeInTheDocument();
  act(() =&gt; window.history.back());
  await waitFor(() =&gt; expect(window.location.search).toBe('?ck=nhi'));
  expect(screen.getByRole('heading', { name: 'Đội ngũ bác sĩ (2)' })).toBeInTheDocument();
});</code></pre>
<div class="out"> ✓ src/hooks/useBoLocUrl.test.tsx &gt; mở link có sẵn ?ck=nhi&amp;q=vy ⇒ danh sách đã lọc ngay
 ✓ src/hooks/useBoLocUrl.test.tsx &gt; bấm chip ⇒ URL đổi (push); gõ tìm ⇒ URL đổi (replace, không đẻ thêm lịch sử)
 ✓ src/hooks/useBoLocUrl.test.tsx &gt; nút Back của trình duyệt ⇒ bộ lọc lùi theo</div>
<p>In jsdom, <code>history.back()</code> is asynchronous (as in a browser), so the test waits with <code>waitFor</code> until the URL has changed. And these tests are why <code>setup.ts</code> resets the URL after each test (Lesson 5.3).</p>

<h3>Every kind of state has a home</h3>
${slide('rx-05', 23, 'Every kind of state has a home')}
<table>
<thead><tr><th>State</th><th>Example in the project</th><th>Home</th></tr></thead>
<tbody>
<tr><td>Only one component needs it</td><td>the doctor being viewed, whether a panel is open</td><td><code>useState</code> in that component</td></tr>
<tr><td>Several values changing by rules</td><td>the four-step booking flow</td><td><code>useReducer</code> (5.2)</td></tr>
<tr><td>Rarely changes, the whole tree needs it</td><td>theme, language, logged-in user</td><td>Context (5.1)</td></tr>
<tr><td>The user&#39;s, needed in distant places, should survive F5</td><td>favourites, booked appointments</td><td>Zustand + persist (5.3)</td></tr>
<tr><td>Should be shareable by link, Back should undo it</td><td>specialty filter, search text, page</td><td>URL (this lesson)</td></tr>
<tr><td>Belongs to the server</td><td>list of doctors, time slots</td><td>TanStack Query (Chapter 6)</td></tr>
<tr><td>A form being filled in</td><td>name, phone</td><td>React Hook Form (Chapter 3)</td></tr>
</tbody>
</table>
${SD.nhaEn}
<p>The hand-written hook is the right tool for learning, and for a small app with no router. From Chapter 7 the project uses React Router, whose <code>useSearchParams()</code> does what <code>useBoLocUrl</code> does — read the query string, write it with push or replace, react to Back — so the hook shrinks to a few lines around <code>docBoLoc</code>/<code>taoSearch</code>, which you keep. In Next.js the page receives <code>searchParams</code> directly (see <a href="/courses/nextjs">/courses/nextjs</a>). If you ever need to subscribe to a browser value yourself without a router, React&#39;s official tool is <code>useSyncExternalStore</code>; the <code>useState</code> + effect version here is easier to read and is enough for one hook.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>In FER202 assignments, a product list&#39;s filter and page number usually live in <code>useState</code> or in the Redux store: reload the page and they reset; send the link to your teammate and they see the unfiltered first page; press Back and you leave the site. → At work, list pages keep filter, search, sort and pagination in the URL — with React Router&#39;s <code>useSearchParams</code>, Next.js <code>searchParams</code>, or a hook like this one — and validate what they read. · <em>Why:</em> support tickets and bug reports come with links ("this filter shows the wrong doctors"); marketing sends links to filtered pages; users expect Back and F5 to behave. None of that is possible when the state is invisible. Keeping it in <code>useState</code> is fine for a lab where nobody shares links — which is exactly why labs do it.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "Where would you keep the filters and pagination of a list page, and why?"</p>
<p>In the URL query string, because that state belongs to the page: it should survive a reload, be shareable as a link, and be undone with the Back button. I read it with <code>URLSearchParams</code> (or <code>useSearchParams</code> in React Router), treat it as untrusted input — parse, validate against allowed values, fall back to defaults — and derive the filter from it instead of copying it into separate state. For writes, discrete choices like a filter chip use <code>pushState</code> so Back works, and typing uses <code>replaceState</code> so the history does not fill up with one entry per keystroke. Personal data like favourites does not go in the URL; server data goes to a query cache like TanStack Query, keyed by those same parameters.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> make the open doctor detail shareable: <code>/?ck=nhi&amp;bs=bs-2</code> should open with BS. Trần Thu Hà&#39;s detail panel.</p><ol>
<li>Extend <code>BoLoc</code> with <code>bacSiId: string | null</code>. In <code>docBoLoc</code>, accept <code>bs</code> only if it is the id of a doctor in <code>danhSachBacSi</code>; otherwise <code>null</code>. In <code>taoSearch</code>, write <code>bs</code> only when it is not <code>null</code>.</li>
<li>In <code>KhuBacSi</code>, replace the <code>useState</code> for <code>bacSiDangChonId</code> with the URL: "Xem chi tiết" calls <code>datBoLoc({ bacSiId: id })</code> (push), "Đóng" sets it back to <code>null</code>.</li>
<li>Tests: <code>?bs=bs-2</code> opens the region "Chi tiết BS. Trần Thu Hà"; <code>?bs=bs-99</code> opens nothing and does not crash; opening then pressing Back (<code>history.back()</code> + <code>waitFor</code>) closes the panel.</li>
</ol><p><strong>Done when:</strong> <code>npx tsc -b</code> prints nothing, all project tests are green, and in <code>npm run dev</code> you can open a detail panel, copy the address bar into a new tab and see the same panel — and the round-trip test for <code>docBoLoc(taoSearch(x))</code> still passes with the new field.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">query string</span><span class="v">the <code>?key=value&amp;…</code> part of a URL</span></div>
<div class="kv"><span class="k"><code>URLSearchParams</code></span><span class="v">built-in class to read (<code>get</code>, <code>getAll</code>) and write (<code>set</code>, <code>delete</code>, <code>toString</code>) a query string</span></div>
<div class="kv"><span class="k"><code>history.pushState</code></span><span class="v">change the URL and add a history entry, without loading a page</span></div>
<div class="kv"><span class="k"><code>history.replaceState</code></span><span class="v">change the URL of the current entry; Back is unaffected</span></div>
<div class="kv"><span class="k"><code>popstate</code></span><span class="v">event fired when the user moves through history (Back/Forward); not fired by pushState</span></div>
<div class="kv"><span class="k">type guard</span><span class="v">a function returning <code>x is T</code>, which narrows the type when it returns true</span></div>
<div class="kv"><span class="k">single source of truth</span><span class="v">one owner for a piece of state (here: the URL); everything else is derived from it</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>State that belongs to the page — filters, search, page, open item — goes in the URL: measured in Chromium, F5 kept "Nhi + vy" (1 doctor) instead of resetting to 6.</li>
<li><code>URLSearchParams</code> reads and writes the query string; every value is a string or <code>null</code>.</li>
<li>The URL is user input: parse it in a pure function with a type guard and defaults; <code>Object.hasOwn</code>, not <code>in</code>.</li>
<li><code>useBoLocUrl</code> keeps only the search string in state, derives the filter, writes with push/replace, and listens to <code>popstate</code> with cleanup.</li>
<li><code>pushState</code> alone does not re-render React; always update state too. Push for choices, replace for typing (7 entries vs 0 for "thao vy").</li>
<li>From Chapter 7, React Router&#39;s <code>useSearchParams</code> replaces the hand-written hook; the parsing and validation stay.</li>
</ul>

<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — URLSearchParams</span><span class="lc-sub">get, getAll, set, delete, toString, and how values are encoded.</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/API/History/pushState" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — History.pushState()</span><span class="lc-sub">Changing the URL without loading a page; why no popstate is fired.</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — popstate event</span><span class="lc-sub">When the browser fires it, and when it does not.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/useSyncExternalStore" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — useSyncExternalStore</span><span class="lc-sub">Subscribing to a browser API from React, the official way.</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>URL là state: bộ lọc sống qua F5, đường link chia sẻ được, và nút Back chạy đúng</h2>
<p class="lead">Có những state không phải "của app" hay "của người dùng" — nó là <em>của trang</em>. Chuyên khoa đang lọc, chữ đã gõ trong ô tìm, đang ở trang kết quả thứ mấy: đồng nghiệp gửi bạn một link thì bạn muốn thấy đúng thứ họ thấy; bấm Back thì muốn quay về bộ lọc trước; bấm F5 thì muốn không gì thay đổi. Chẳng điều nào trong số đó chạy được khi bộ lọc sống trong <code>useState</code>. Trình duyệt đã có sẵn một chỗ cho loại state này — nhìn thấy được, chia sẻ được, được giữ trong lịch sử: URL.</p>

<p>Ví dụ ở <code>src/vi-du/bai4.test.tsx</code>; mã dự án ở <code>src/logic/bo-loc-url.ts</code>, <code>src/hooks/useBoLocUrl.ts</code> và <code>src/components/KhuBacSi.tsx</code>. Hành vi trình duyệt (F5, Back, link mở ở tab mới) đo trên một Chromium thật do Playwright điều khiển, chạy với <code>vite preview</code> — một lần với dự án như trước chương này, một lần sau.</p>

<h3>F5 xoá sạch useState — URL thì còn</h3>
${slide('rx-05', 19, 'State trong useState mất khi F5 — state trên URL thì không')}
<p>Script làm y hệt nhau với cả hai bản: bấm "Nhi", gõ "vy" vào ô tìm, thả tim BS. Vũ Thảo Vy, rồi tải lại trang.</p>
<div class="out">[truoc] truoc F5: URL = / | Đội ngũ bác sĩ (1) | yeu thich: Yêu thích (1)
[truoc] sau F5:   URL = / | Đội ngũ bác sĩ (6) | yeu thich: Yêu thích (0)

[sau] truoc F5: URL = /?ck=nhi&amp;q=vy | Đội ngũ bác sĩ (1) | yeu thich: Yêu thích (1)
[sau] sau F5:   URL = /?ck=nhi&amp;q=vy | Đội ngũ bác sĩ (1) | yeu thich: Yêu thích (1)
[sau] tab moi mo /?ck=nhi&amp;q=vy: Đội ngũ bác sĩ (1)</div>
<p>Trước chương này, tải lại là vứt hết: sáu bác sĩ, không mục yêu thích nào, và thanh địa chỉ chưa từng đổi — chẳng có gì để chia sẻ. Sau chương này, thanh địa chỉ ghi <code>/?ck=nhi&amp;q=vy</code>; tải lại vẫn giữ bộ lọc (từ URL) và mục yêu thích (từ store Zustand của Bài 5.3). Dòng cuối là một hồ sơ trình duyệt khác mở cái link đó: nó thấy đúng một bác sĩ — nhưng không thấy yêu thích của bạn, vì đó là của bạn, không phải của trang. Sự phân chia đó đúng y như nên thế.</p>
<p>Một cách quyết định nhanh: <strong>nó có nghĩa gì khi nằm trong một link không?</strong> Bộ lọc, chữ tìm kiếm, thứ tự sắp xếp, số trang, tab đang chọn, mục đang mở: có. Dropdown đang mở, form gõ dở, danh sách yêu thích, token đăng nhập: không.</p>

<h3>URLSearchParams: đọc và ghi phần <code>?…</code></h3>
${slide('rx-05', 20, 'URLSearchParams đọc/ghi phần ?… — và mọi giá trị đều là chuỗi')}
<p>Phần sau dấu <code>?</code> là <strong>query string (chuỗi truy vấn)</strong>: các cặp <code>khoá=giá_trị</code> nối bằng <code>&amp;</code>, ký tự đặc biệt được mã hoá. JavaScript có sẵn một class cho nó, nên bạn không bao giờ phải tự cắt chuỗi:</p>
<pre><code class="language-tsx">test('URLSearchParams: đọc, ghi, mã hoá chữ có dấu', () =&gt; {
  const p = new URLSearchParams('?ck=nhi&amp;q=h%C3%A0&amp;q=lan');
  console.info('[usp] get ck =', p.get('ck'), '| get q =', p.get('q'), '| getAll q =', p.getAll('q'), '| get trang =', p.get('trang'));
  p.set('q', 'Thảo Vy');
  p.delete('ck');
  p.set('trang', String(2));
  console.info('[usp] toString =', p.toString());
  console.info('[usp] typeof get("trang") =', typeof new URLSearchParams('?trang=2').get('trang'));
  expect(p.toString()).toBe('q=Th%E1%BA%A3o+Vy&amp;trang=2');
});</code></pre>
<div class="out">[usp] get ck = nhi | get q = hà | getAll q = [ 'hà', 'lan' ] | get trang = null
[usp] toString = q=Th%E1%BA%A3o+Vy&amp;trang=2
[usp] typeof get("trang") = string</div>
<ul>
<li><code>get</code> tự giải mã: <code>h%C3%A0</code> trả về <code>hà</code>. Khoá không có thì cho <code>null</code>, không phải <code>undefined</code> hay <code>''</code>.</li>
<li>Một khoá xuất hiện được hai lần; <code>get</code> trả về cái đầu, <code>getAll</code> trả về tất cả.</li>
<li><code>toString</code> mã hoá: chữ tiếng Việt thành các byte kiểu <code>%E1%BA%A3</code>, dấu cách thành <code>+</code>. (<code>encodeURIComponent</code>, dùng ở phần sau bài, viết dấu cách là <code>%20</code>. Cả hai đều giải mã đúng.)</li>
<li><strong>Mọi giá trị đều là chuỗi.</strong> <code>?trang=2</code> cho <code>'2'</code>. Số, boolean, danh sách phải tự đổi kiểu, và phải kiểm.</li>
</ul>
<p>Ý cuối là ý quan trọng. URL là chữ <strong>người dùng gõ tay được</strong>: <code>?ck=tim-mach</code> (chuyên khoa phòng khám không có), <code>?ck=toString</code>, một <code>q</code> dài 5.000 ký tự. Đọc URL là đọc dữ liệu từ bên ngoài, nên dự án phân tích nó trong một module thuần nhỏ, có giá trị dự phòng cho mọi thứ bất thường:</p>
<pre><code class="language-ts">import { TEN_CHUYEN_KHOA } from '../du-lieu/chuyen-khoa';
import type { ChuyenKhoa } from '../types';
import type { BoLocChuyenKhoa } from './loc-bac-si';

export interface BoLoc {
  chuyenKhoa: BoLocChuyenKhoa;
  tuKhoa: string;
}
export const BO_LOC_MAC_DINH: BoLoc = { chuyenKhoa: 'tat-ca', tuKhoa: '' };

/** Type guard: chuỗi lạ trên URL có phải một chuyên khoa thật không? */
function laChuyenKhoa(x: string | null): x is ChuyenKhoa {
  return x !== null &amp;&amp; Object.hasOwn(TEN_CHUYEN_KHOA, x);
}

/** '?ck=nhi&amp;q=h%C3%A0' → { chuyenKhoa: 'nhi', tuKhoa: 'hà' }. URL do NGƯỜI DÙNG gõ được ⇒ không tin, sai thì về mặc định. */
export function docBoLoc(search: string): BoLoc {
  const p = new URLSearchParams(search);
  const ck = p.get('ck');
  return {
    chuyenKhoa: laChuyenKhoa(ck) ? ck : 'tat-ca',
    tuKhoa: (p.get('q') ?? '').slice(0, 50),
  };
}

/** Ngược lại: bộ lọc → '?ck=nhi&amp;q=h%C3%A0'. Giá trị mặc định thì KHÔNG ghi (URL gọn, link chia sẻ ngắn). */
export function taoSearch({ chuyenKhoa, tuKhoa }: BoLoc): string {
  const p = new URLSearchParams();
  if (chuyenKhoa !== 'tat-ca') p.set('ck', chuyenKhoa);
  if (tuKhoa.trim() !== '') p.set('q', tuKhoa);
  const s = p.toString();
  return s === '' ? '' : &#96;?&#36;{s}&#96;;
}</code></pre>
<div class="callout"><p><strong>JS nhắc nhanh — hai chi tiết trong file này.</strong> <code>function laChuyenKhoa(x: string | null): x is ChuyenKhoa</code> là một <em>type guard (hàm canh kiểu)</em>: hàm trả boolean mà kiểu trả về nói với TypeScript "nếu hàm này trả true thì <code>x</code> là một <code>ChuyenKhoa</code>". Sau <code>laChuyenKhoa(ck) ? ck : …</code>, TypeScript chấp nhận <code>ck</code> ở chỗ đòi <code>ChuyenKhoa</code>. Còn <code>Object.hasOwn(obj, khoa)</code> kiểm các khoá <em>của riêng</em> object. Cách ngắn hơn <code>khoa in obj</code> ở đây là sai: mọi object đều thừa kế <code>toString</code>, nên <code>'toString' in TEN_CHUYEN_KHOA</code> là <code>true</code> (kiểm bằng Node: <code>true</code>, trong khi <code>Object.hasOwn</code> cho <code>false</code>).</p></div>
<p><code>taoSearch</code> là chiều ngược lại, và nó bỏ các giá trị mặc định, nên danh sách chưa lọc chỉ là <code>/</code> và link chia sẻ ngắn gọn. Test ghim cả hai chiều, gồm cả chuyến khứ hồi:</p>
<pre><code class="language-ts">import { expect, test } from 'vitest';
import { docBoLoc, taoSearch } from './bo-loc-url';

test('đọc URL hợp lệ, kể cả chữ có dấu đã mã hoá', () =&gt; {
  expect(docBoLoc('?ck=nhi&amp;q=h%C3%A0')).toEqual({ chuyenKhoa: 'nhi', tuKhoa: 'hà' });
});

test('URL rác ⇒ về mặc định, không vỡ', () =&gt; {
  expect(docBoLoc('?ck=tim-mach&amp;q=')).toEqual({ chuyenKhoa: 'tat-ca', tuKhoa: '' });
  expect(docBoLoc('?ck=toString')).toEqual({ chuyenKhoa: 'tat-ca', tuKhoa: '' }); // không nhầm thuộc tính kế thừa
  expect(docBoLoc('')).toEqual({ chuyenKhoa: 'tat-ca', tuKhoa: '' });
});

test('ghi URL: bỏ giá trị mặc định, mã hoá chữ có dấu', () =&gt; {
  expect(taoSearch({ chuyenKhoa: 'tat-ca', tuKhoa: '' })).toBe('');
  expect(taoSearch({ chuyenKhoa: 'da-lieu', tuKhoa: '' })).toBe('?ck=da-lieu');
  expect(taoSearch({ chuyenKhoa: 'nhi', tuKhoa: 'Thảo Vy' })).toBe('?ck=nhi&amp;q=Th%E1%BA%A3o+Vy');
});

test('đọc lại cái vừa ghi ⇒ y nguyên (khứ hồi)', () =&gt; {
  const bl = { chuyenKhoa: 'rang-ham-mat' as const, tuKhoa: 'Ngọc Lan &amp; co' };
  expect(docBoLoc(taoSearch(bl))).toEqual(bl);
});</code></pre>
<div class="out"> ✓ src/logic/bo-loc-url.test.ts &gt; đọc URL hợp lệ, kể cả chữ có dấu đã mã hoá
 ✓ src/logic/bo-loc-url.test.ts &gt; URL rác ⇒ về mặc định, không vỡ
 ✓ src/logic/bo-loc-url.test.ts &gt; ghi URL: bỏ giá trị mặc định, mã hoá chữ có dấu
 ✓ src/logic/bo-loc-url.test.ts &gt; đọc lại cái vừa ghi ⇒ y nguyên (khứ hồi)</div>

<h3>useBoLocUrl: URL là nguồn sự thật duy nhất</h3>
${slide('rx-05', 21, 'useBoLocUrl: URL là nguồn sự thật, component chỉ đọc và ghi nó')}
<p>Giờ tới một hook cho <code>KhuBacSi</code> dùng URL như thể nó là state:</p>
<pre><code class="language-ts">import { useEffect, useState } from 'react';
import { docBoLoc, taoSearch, type BoLoc } from '../logic/bo-loc-url';

/**
 * Bộ lọc danh sách bác sĩ SỐNG TRÊN URL (?ck=…&amp;q=…): F5 không mất, gửi link cho người khác thấy đúng
 * danh sách, nút Back của trình duyệt lùi lại lần lọc trước. Chương 7 thay bằng useSearchParams của React Router.
 */
export function useBoLocUrl() {
  // Chỉ giữ CHUỖI search làm state; bộ lọc tính ra từ nó mỗi lần render (một nguồn sự thật: URL).
  const [search, setSearch] = useState(() =&gt; window.location.search);

  useEffect(() =&gt; {
    // Back/Forward của trình duyệt đổi URL mà KHÔNG qua code của mình ⇒ nghe 'popstate' để cập nhật theo.
    const khiLuiTien = () =&gt; setSearch(window.location.search);
    window.addEventListener('popstate', khiLuiTien);
    return () =&gt; window.removeEventListener('popstate', khiLuiTien);
  }, []);

  const boLoc = docBoLoc(search);

  /** cach 'push': thêm một mục lịch sử (Back quay lại được) · 'replace': sửa mục hiện tại (hợp khi gõ phím). */
  function datBoLoc(moi: Partial&lt;BoLoc&gt;, cach: 'push' | 'replace' = 'push') {
    const s = taoSearch({ ...boLoc, ...moi });
    const url = &#96;&#36;{window.location.pathname}&#36;{s}&#36;{window.location.hash}&#96;;
    if (cach === 'push') window.history.pushState(null, '', url);
    else window.history.replaceState(null, '', url);
    setSearch(s);
  }

  return [boLoc, datBoLoc] as const;
}</code></pre>
<p>Bốn ý, đều từ các chương trước:</p>
<ol>
<li><strong>Một mẩu state: chuỗi search.</strong> Không phải riêng <code>chuyenKhoa</code> và <code>tuKhoa</code> — hai thứ đó được <em>tính ra</em> từ chuỗi mỗi lần render (Bài 2.4: đừng cất thứ tính được). URL là nguồn sự thật duy nhất; <code>useState</code> chỉ có mặt để báo React "URL đã đổi, render lại đi".</li>
<li><strong>Ghi:</strong> <code>datBoLoc</code> gộp thay đổi vào bộ lọc hiện tại, dựng chuỗi truy vấn mới, ghi nó bằng <code>history.pushState</code> hoặc <code>replaceState</code> (hai hàm này đổi thanh địa chỉ <em>mà không</em> tải trang), rồi cập nhật state để React render lại.</li>
<li><strong>Back và Forward:</strong> trình duyệt tự đổi URL và bắn sự kiện <code>popstate</code>. Effect đăng ký nghe nó và gỡ listener trong phần dọn dẹp — mẫu effect có cleanup của Chương 4.</li>
<li><strong>Giá trị trả về</strong> <code>[boLoc, datBoLoc] as const</code> bắt chước <code>useState</code>: một giá trị và một cách đổi nó. <code>as const</code> cho TypeScript hiểu đây là bộ đúng hai phần tử (tuple), không phải mảng "cái nào cũng được".</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Bẫy — gọi <code>pushState</code> rồi chờ React tự biết.</strong> <code>history.pushState</code> đổi thanh địa chỉ và không bắn sự kiện nào cả (<code>popstate</code> chỉ bắn khi Back/Forward). Một component đọc thẳng <code>window.location.search</code> trong lúc render sẽ không bao giờ biết:
<pre><code class="language-tsx">/** ❌ Đọc thẳng window.location trong render, ghi bằng pushState — React không hề biết URL đã đổi. */
function ChipDocThangUrl() {
  const ck = new URLSearchParams(window.location.search).get('ck') ?? 'tat-ca';
  return (
    &lt;div&gt;
      &lt;p&gt;Đang lọc: {ck}&lt;/p&gt;
      &lt;button type="button" onClick={() =&gt; window.history.pushState(null, '', '/?ck=nhi')}&gt;Nhi&lt;/button&gt;
    &lt;/div&gt;
  );
}

test('pushState một mình không làm React render lại', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;ChipDocThangUrl /&gt;);
  await user.click(screen.getByRole('button', { name: 'Nhi' }));
  console.info('[doc thang] URL =', window.location.search, '| man hinh:', screen.getByText(/Đang lọc/).textContent);
  expect(screen.getByText('Đang lọc: tat-ca')).toBeInTheDocument();
});</code></pre>
<div class="out">[doc thang] URL = ?ck=nhi | man hinh: Đang lọc: tat-ca</div>
URL ghi <code>nhi</code>, màn hình vẫn ghi <code>tat-ca</code> — cho tới khi một state chẳng liên quan làm nó render lại, rồi nó "tự khỏi", và thế là bug khó tái hiện. Luôn đi kèm một lần ghi lịch sử với một lần cập nhật state của React, như <code>datBoLoc</code> làm.</div>
<p><code>KhuBacSi</code> giờ lấy bộ lọc từ hook và yêu thích từ store; chỉ bác sĩ đang xem ở lại trong <code>useState</code>, vì ngoài màn này không ai cần nó:</p>
<pre><code class="language-tsx">import { useState } from 'react';
import { danhSachBacSi } from '../du-lieu/bac-si';
import { useBoLocUrl } from '../hooks/useBoLocUrl';
import { locBacSi } from '../logic/loc-bac-si';
import { useDatLichStore } from '../store/dat-lich-store';
import { ChiTietBacSi } from './ChiTietBacSi';
import { ChipChuyenKhoa } from './ChipChuyenKhoa';
import { DanhSachBacSi } from './DanhSachBacSi';
import { OTimBacSi } from './OTimBacSi';

export function KhuBacSi() {
  // Chương 5: mỗi mẩu state về đúng nhà của nó.
  const [{ chuyenKhoa, tuKhoa }, datBoLoc] = useBoLocUrl(); // lọc/tìm → URL (chia sẻ được, F5 không mất)
  const yeuThich = useDatLichStore((s) =&gt; s.yeuThich); // yêu thích → store toàn app (có persist)
  const doiYeuThich = useDatLichStore((s) =&gt; s.doiYeuThich);
  const [bacSiDangChonId, setBacSiDangChonId] = useState&lt;string | null&gt;(null); // chỉ màn này cần ⇒ ở lại đây

  const danhSachLoc = locBacSi(danhSachBacSi, chuyenKhoa, tuKhoa);
  const bacSiDangChon = danhSachBacSi.find((bs) =&gt; bs.id === bacSiDangChonId) ?? null;
  const dsYeuThich = danhSachBacSi.filter((bs) =&gt; yeuThich.includes(bs.id));

  return (
    &lt;&gt;
      &lt;div className="thanh-loc"&gt;
        &lt;ChipChuyenKhoa giaTri={chuyenKhoa} onDoi={(ck) =&gt; datBoLoc({ chuyenKhoa: ck })} /&gt;
        &lt;OTimBacSi tuKhoa={tuKhoa} onDoi={(q) =&gt; datBoLoc({ tuKhoa: q }, 'replace')} /&gt;
      &lt;/div&gt;
      &lt;div className="bo-cuc"&gt;
        &lt;DanhSachBacSi
          danhSach={danhSachLoc}
          bacSiDangChonId={bacSiDangChonId}
          yeuThich={yeuThich}
          onXemChiTiet={setBacSiDangChonId}
          onDoiYeuThich={doiYeuThich}
          thongBaoRong="Không tìm thấy bác sĩ phù hợp."
        /&gt;
        &lt;aside&gt;
          {bacSiDangChon ? (
            &lt;ChiTietBacSi
              bacSi={bacSiDangChon}
              laYeuThich={yeuThich.includes(bacSiDangChon.id)}
              onDoiYeuThich={doiYeuThich}
              onDong={() =&gt; setBacSiDangChonId(null)}
            /&gt;
          ) : (
            &lt;p className="goi-y"&gt;Bấm “Xem chi tiết” trên một bác sĩ để xem giới thiệu.&lt;/p&gt;
          )}
          &lt;section className="yeu-thich" aria-label="Danh sách yêu thích"&gt;
            &lt;h3&gt;Yêu thích ({dsYeuThich.length})&lt;/h3&gt;
            {dsYeuThich.length === 0 ? (
              &lt;p&gt;Chưa có bác sĩ nào.&lt;/p&gt;
            ) : (
              &lt;ul&gt;
                {dsYeuThich.map((bs) =&gt; (
                  &lt;li key={bs.id}&gt;{bs.ten}&lt;/li&gt;
                ))}
              &lt;/ul&gt;
            )}
          &lt;/section&gt;
        &lt;/aside&gt;
      &lt;/div&gt;
    &lt;/&gt;
  );
}</code></pre>
<p><strong>Chạy thử từng bước</strong> — bấm chip "Nhi" ở <code>/</code>:</p>
<ol>
<li><code>ChipChuyenKhoa</code> gọi <code>onDoi('nhi')</code>, tức gọi <code>datBoLoc({ chuyenKhoa: 'nhi' })</code>.</li>
<li><code>taoSearch({ chuyenKhoa: 'nhi', tuKhoa: '' })</code> trả về <code>'?ck=nhi'</code>; <code>pushState</code> đặt <code>/?ck=nhi</code> lên thanh địa chỉ và thêm một mục lịch sử.</li>
<li><code>setSearch('?ck=nhi')</code> kích một lần render. <code>docBoLoc</code> tính ra <code>{ chuyenKhoa: 'nhi', tuKhoa: '' }</code>; danh sách lọc lại; chip được đánh dấu.</li>
<li>Lát sau, bấm Back: trình duyệt hiện <code>/</code> và bắn <code>popstate</code>; listener gọi <code>setSearch('')</code>; danh sách hiện lại đủ sáu.</li>
</ol>
${SD.urlVi}

<h3>Bấm chọn thì pushState, gõ phím thì replaceState</h3>
${slide('rx-05', 22, 'Bấm chip thì pushState, gõ phím thì replaceState')}
<p>Mỗi lần <code>pushState</code> là thêm một lần bấm Back trước khi người dùng rời được trang của bạn. Test gõ "thao vy" (7 ký tự) vào một ô tìm ghi URL theo từng phím, mỗi cách một lượt:</p>
<pre><code class="language-tsx">function OTimDayLichSu({ cach }: { cach: 'push' | 'replace' }) {
  const [q, setQ] = useState('');
  return (
    &lt;label&gt;
      Tìm
      &lt;input
        value={q}
        onChange={(e) =&gt; {
          setQ(e.target.value);
          const url = &#96;/?q=&#36;{encodeURIComponent(e.target.value)}&#96;;
          if (cach === 'push') window.history.pushState(null, '', url);
          else window.history.replaceState(null, '', url);
        }}
      /&gt;
    &lt;/label&gt;
  );
}

test('gõ "thao vy": pushState mỗi phím vs replaceState', async () =&gt; {
  const user = userEvent.setup();
  const kq: string[] = [];
  for (const cach of ['push', 'replace'] as const) {
    const dau = window.history.length;
    const { unmount } = render(&lt;OTimDayLichSu cach={cach} /&gt;);
    await user.type(screen.getByLabelText('Tìm'), 'thao vy');
    kq.push(&#96;&#36;{cach}State: +&#36;{window.history.length - dau} muc lich su, URL = &#36;{window.location.search}&#96;);
    unmount();
  }
  console.info('[lich su]', kq.join(' | '));
  expect(kq[1]).toContain('+0');
});</code></pre>
<div class="out">[lich su] pushState: +7 muc lich su, URL = ?q=thao%20vy | replaceState: +0 muc lich su, URL = ?q=thao%20vy</div>
<p>Bảy mục lịch sử cho một lần tìm. Người dùng bấm Back để về trang trước sẽ phải bấm bảy lần, nhìn chữ tìm kiếm biến mất từng ký tự. Nên luật trong <code>KhuBacSi</code>: chip (một lựa chọn có chủ ý) dùng push; ô tìm dùng <code>'replace'</code>. Trên trình duyệt thật, Back đi qua đúng các lựa chọn chip:</p>
${SD.pushVi}
<div class="out">[sau] bam Nhi roi Da lieu: URL = /?ck=da-lieu | Đội ngũ bác sĩ (1)
[sau] nut Back:           URL = /?ck=nhi | Đội ngũ bác sĩ (2)
[sau] Back lan nua:       URL = / | Đội ngũ bác sĩ (6)</div>
<p>Test của hook trong dự án kiểm đúng ba hành vi đó trong jsdom — mở một link có sẵn, push hay replace đếm bằng <code>history.length</code>, và <code>history.back()</code>:</p>
<pre><code class="language-tsx">import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { KhuBacSi } from '../components/KhuBacSi';

test('mở link có sẵn ?ck=nhi&amp;q=vy ⇒ danh sách đã lọc ngay', () =&gt; {
  window.history.replaceState(null, '', '/?ck=nhi&amp;q=vy');
  render(&lt;KhuBacSi /&gt;);
  expect(screen.getByRole('heading', { name: 'Đội ngũ bác sĩ (1)' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Nhi' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByLabelText('Tìm theo tên')).toHaveValue('vy');
});

test('bấm chip ⇒ URL đổi (push); gõ tìm ⇒ URL đổi (replace, không đẻ thêm lịch sử)', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;KhuBacSi /&gt;);
  const dau = window.history.length;
  await user.click(screen.getByRole('button', { name: 'Nội tổng quát' }));
  expect(window.location.search).toBe('?ck=noi');
  await user.type(screen.getByLabelText('Tìm theo tên'), 'huy');
  expect(window.location.search).toBe('?ck=noi&amp;q=huy');
  expect(window.history.length - dau).toBe(1); // 1 lần push của chip; 3 phím = 0 mục mới
});

test('nút Back của trình duyệt ⇒ bộ lọc lùi theo', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;KhuBacSi /&gt;);
  await user.click(screen.getByRole('button', { name: 'Nhi' }));
  await user.click(screen.getByRole('button', { name: 'Da liễu' }));
  expect(screen.getByRole('heading', { name: 'Đội ngũ bác sĩ (1)' })).toBeInTheDocument();
  act(() =&gt; window.history.back());
  await waitFor(() =&gt; expect(window.location.search).toBe('?ck=nhi'));
  expect(screen.getByRole('heading', { name: 'Đội ngũ bác sĩ (2)' })).toBeInTheDocument();
});</code></pre>
<div class="out"> ✓ src/hooks/useBoLocUrl.test.tsx &gt; mở link có sẵn ?ck=nhi&amp;q=vy ⇒ danh sách đã lọc ngay
 ✓ src/hooks/useBoLocUrl.test.tsx &gt; bấm chip ⇒ URL đổi (push); gõ tìm ⇒ URL đổi (replace, không đẻ thêm lịch sử)
 ✓ src/hooks/useBoLocUrl.test.tsx &gt; nút Back của trình duyệt ⇒ bộ lọc lùi theo</div>
<p>Trong jsdom, <code>history.back()</code> là bất đồng bộ (như trong trình duyệt), nên test chờ bằng <code>waitFor</code> cho tới khi URL đổi. Và chính những test này là lý do <code>setup.ts</code> đặt lại URL sau mỗi test (Bài 5.3).</p>

<h3>Mỗi loại state một chỗ ở</h3>
${slide('rx-05', 23, 'Mỗi loại state một chỗ ở')}
<table>
<thead><tr><th>State</th><th>Ví dụ trong dự án</th><th>Chỗ ở</th></tr></thead>
<tbody>
<tr><td>Chỉ một component cần</td><td>bác sĩ đang xem, khung đang mở</td><td><code>useState</code> ngay trong component đó</td></tr>
<tr><td>Nhiều giá trị đổi theo luật</td><td>luồng đặt lịch bốn bước</td><td><code>useReducer</code> (5.2)</td></tr>
<tr><td>Ít đổi, cả cây cần</td><td>giao diện, ngôn ngữ, người đăng nhập</td><td>Context (5.1)</td></tr>
<tr><td>Của người dùng, nhiều nơi xa nhau cần, nên sống qua F5</td><td>yêu thích, lịch hẹn đã đặt</td><td>Zustand + persist (5.3)</td></tr>
<tr><td>Nên chia sẻ được bằng link, Back phải hoàn tác được</td><td>chuyên khoa đang lọc, chữ tìm, số trang</td><td>URL (bài này)</td></tr>
<tr><td>Thuộc về máy chủ</td><td>danh sách bác sĩ, khung giờ</td><td>TanStack Query (Chương 6)</td></tr>
<tr><td>Form đang điền</td><td>họ tên, số điện thoại</td><td>React Hook Form (Chương 3)</td></tr>
</tbody>
</table>
${SD.nhaVi}
<p>Hook tự viết là công cụ đúng để học, và đủ cho một app nhỏ không có router. Từ Chương 7 dự án dùng React Router, và <code>useSearchParams()</code> của nó làm đúng việc <code>useBoLocUrl</code> làm — đọc chuỗi truy vấn, ghi bằng push hoặc replace, phản ứng với Back — nên hook co lại còn vài dòng quanh <code>docBoLoc</code>/<code>taoSearch</code>, hai hàm bạn giữ nguyên. Trong Next.js, trang nhận thẳng <code>searchParams</code> (xem <a href="/courses/nextjs">/courses/nextjs</a>). Nếu có lúc cần tự đăng ký nghe một giá trị của trình duyệt mà không có router, công cụ chính thức của React là <code>useSyncExternalStore</code>; bản <code>useState</code> + effect ở đây dễ đọc hơn và đủ cho một hook.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Trong bài tập FER202, bộ lọc và số trang của danh sách sản phẩm thường nằm trong <code>useState</code> hoặc trong store Redux: tải lại trang là về mặc định; gửi link cho bạn cùng nhóm thì họ thấy trang đầu chưa lọc; bấm Back là rời khỏi trang web. → Đi làm, trang danh sách giữ bộ lọc, ô tìm, thứ tự sắp xếp và phân trang trên URL — bằng <code>useSearchParams</code> của React Router, <code>searchParams</code> của Next.js, hoặc một hook như bài này — và kiểm những gì đọc được. · <em>Vì sao:</em> ticket hỗ trợ và báo lỗi đến kèm link ("bộ lọc này hiện sai bác sĩ"); bộ phận marketing gửi link tới trang đã lọc; người dùng chờ Back và F5 chạy đúng. Chẳng điều nào làm được khi state vô hình. Giữ nó trong <code>useState</code> là ổn cho một bài lab chẳng ai chia sẻ link — và đó chính là lý do bài lab làm vậy.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Bạn giữ bộ lọc và phân trang của một trang danh sách ở đâu, vì sao?"</p>
<p>Trên query string của URL, vì state đó thuộc về trang: nó phải sống qua tải lại, chia sẻ được bằng link, và hoàn tác được bằng nút Back. Em đọc nó bằng <code>URLSearchParams</code> (hoặc <code>useSearchParams</code> của React Router), coi nó là dữ liệu không tin cậy — phân tích, kiểm với danh sách giá trị cho phép, rơi về mặc định — và tính bộ lọc ra từ nó thay vì chép sang một state riêng. Khi ghi, lựa chọn rời rạc như chip lọc dùng <code>pushState</code> để Back chạy được, còn gõ phím dùng <code>replaceState</code> để lịch sử không đầy lên mỗi phím một mục. Dữ liệu cá nhân như danh sách yêu thích không đưa lên URL; dữ liệu máy chủ vào bộ đệm truy vấn như TanStack Query, khoá theo đúng các tham số đó.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> cho khung chi tiết bác sĩ chia sẻ được: <code>/?ck=nhi&amp;bs=bs-2</code> phải mở sẵn khung chi tiết BS. Trần Thu Hà.</p><ol>
<li>Thêm vào <code>BoLoc</code> field <code>bacSiId: string | null</code>. Trong <code>docBoLoc</code>, chỉ nhận <code>bs</code> khi nó là id của một bác sĩ trong <code>danhSachBacSi</code>; không thì <code>null</code>. Trong <code>taoSearch</code>, chỉ ghi <code>bs</code> khi khác <code>null</code>.</li>
<li>Trong <code>KhuBacSi</code>, thay <code>useState</code> của <code>bacSiDangChonId</code> bằng URL: "Xem chi tiết" gọi <code>datBoLoc({ bacSiId: id })</code> (push), "Đóng" đặt lại <code>null</code>.</li>
<li>Test: <code>?bs=bs-2</code> mở vùng "Chi tiết BS. Trần Thu Hà"; <code>?bs=bs-99</code> không mở gì và không sập; mở rồi bấm Back (<code>history.back()</code> + <code>waitFor</code>) thì khung đóng.</li>
</ol><p><strong>Đạt khi:</strong> <code>npx tsc -b</code> không in gì, mọi test của dự án xanh, và trong <code>npm run dev</code> bạn mở được một khung chi tiết, chép thanh địa chỉ sang tab mới và thấy đúng khung đó — và test khứ hồi <code>docBoLoc(taoSearch(x))</code> vẫn xanh với field mới.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">query string (chuỗi truy vấn)</span><span class="v">phần <code>?khoa=gia_tri&amp;…</code> của một URL</span></div>
<div class="kv"><span class="k"><code>URLSearchParams</code></span><span class="v">class có sẵn để đọc (<code>get</code>, <code>getAll</code>) và ghi (<code>set</code>, <code>delete</code>, <code>toString</code>) chuỗi truy vấn</span></div>
<div class="kv"><span class="k"><code>history.pushState</code></span><span class="v">đổi URL và thêm một mục lịch sử, không tải trang</span></div>
<div class="kv"><span class="k"><code>history.replaceState</code></span><span class="v">đổi URL của mục hiện tại; Back không bị ảnh hưởng</span></div>
<div class="kv"><span class="k"><code>popstate</code></span><span class="v">sự kiện bắn khi người dùng đi trong lịch sử (Back/Forward); pushState không bắn</span></div>
<div class="kv"><span class="k">type guard (hàm canh kiểu)</span><span class="v">hàm trả về <code>x is T</code>, thu hẹp kiểu khi nó trả true</span></div>
<div class="kv"><span class="k">single source of truth (một nguồn sự thật)</span><span class="v">một chủ duy nhất cho một mẩu state (ở đây: URL); mọi thứ khác tính ra từ nó</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>State thuộc về trang — bộ lọc, ô tìm, số trang, mục đang mở — đặt trên URL: đo trên Chromium, F5 giữ nguyên "Nhi + vy" (1 bác sĩ) thay vì về 6.</li>
<li><code>URLSearchParams</code> đọc và ghi chuỗi truy vấn; mọi giá trị là chuỗi hoặc <code>null</code>.</li>
<li>URL là dữ liệu người dùng nhập: phân tích trong hàm thuần có type guard và mặc định; dùng <code>Object.hasOwn</code>, không dùng <code>in</code>.</li>
<li><code>useBoLocUrl</code> chỉ giữ chuỗi search trong state, tính bộ lọc ra từ đó, ghi bằng push/replace, và nghe <code>popstate</code> có cleanup.</li>
<li><code>pushState</code> một mình không làm React render lại; luôn cập nhật state kèm theo. Push cho lựa chọn, replace cho gõ phím (7 mục so với 0 cho "thao vy").</li>
<li>Từ Chương 7, <code>useSearchParams</code> của React Router thay cho hook tự viết; phần phân tích và kiểm tra ở lại.</li>
</ul>

<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — URLSearchParams</span><span class="lc-sub">get, getAll, set, delete, toString, và cách giá trị được mã hoá.</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/API/History/pushState" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — History.pushState()</span><span class="lc-sub">Đổi URL mà không tải trang; vì sao không có popstate.</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — popstate event</span><span class="lc-sub">Khi nào trình duyệt bắn nó, và khi nào không.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/useSyncExternalStore" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — useSyncExternalStore</span><span class="lc-sub">Đăng ký nghe một API của trình duyệt từ React, theo cách chính thức.</span></span></a>
</div>
`,
  },
  {
    title: '5.5 — Build it: the four-step booking flow, a shared store and filters in the URL|||5.5 — Tự dựng: luồng đặt lịch bốn bước, store dùng chung và bộ lọc trên URL',
    slug: 'rx-5-5-du-an',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Bài 🛠 của chương: từ dự án sau Chương 4, dựng luồng đặt lịch bốn bước bằng useReducer, store useDatLichStore có persist, và bộ lọc trên URL — kế hoạch, từng bước, tiêu chí đạt (22 test mới, ảnh chụp Chromium thật) và lời giải đầy đủ.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Build it: the four-step booking flow, a shared store, and filters in the URL</h2>
<p class="lead">Four lessons, four places for state. This lesson puts all of them into the clinic app at once: the booking flow runs on the reducer from 5.2, favourites and booked appointments live in the Zustand store from 5.3 and survive F5, and the specialty filter and search text move into the URL as in 5.4. You type it; the full solution is at the end, closed, and every line of it has run.</p>

<h3>What you will build</h3>
${slide('rx-05', 24, 'Chapter result: the four-step booking flow on one reducer')}
<p>Below the doctor list, a new panel "Đặt lịch khám" walks through four steps with a step bar on top: pick a doctor, pick a time (a full slot is shown but disabled), fill in the Chapter 3 form (its button now says "Tiếp tục"), and confirm on a summary. "Xác nhận đặt lịch" shows "Đang gửi…" for the 800 ms the fake server takes, then a success message with the appointment code. The header badge "Lịch hẹn của tôi" and the "Lịch hẹn của tôi (n)" list update at once — they read the same store — and both survive F5. The screenshots on the slide are from a real Chromium, driven by the same script whose output you saw in Lessons 5.3 and 5.4:</p>
<div class="out">[sau] ngay sau Xac nhan: nut = Đang gửi…
[sau] xong: Đã đặt lịch với BS. Nguyễn Minh An lúc 14:00 · 01/10/2026. Mã lịch hẹn: lh-1790303755862.
[sau] header: Lịch hẹn của tôi: 1
[sau] F5 roi: Lịch hẹn của tôi: 1 | Lịch hẹn của tôi (1)</div>
${SD.xacNhanEn}

<h3>Plan before typing</h3>
<table>
<thead><tr><th>Part</th><th>File</th><th>New / changed</th><th>From lesson</th></tr></thead>
<tbody>
<tr><td>A. Flow</td><td><code>du-lieu/khung-gio.ts</code></td><td>new — sample slots until Chapter 6</td><td>—</td></tr>
<tr><td>A. Flow</td><td><code>dat-lich/luong-dat-lich.ts</code> + test</td><td>new — reducer, 8 action types</td><td>5.2</td></tr>
<tr><td>A. Flow</td><td><code>components/LuongDatLich.tsx</code> + test</td><td>new — the four steps</td><td>5.2</td></tr>
<tr><td>A. Flow</td><td><code>FormDatLich.tsx</code>, <code>gui-dat-lich.ts</code></td><td>changed — two optional props; real slot id</td><td>Chapter 3</td></tr>
<tr><td>B. Store</td><td><code>store/dat-lich-store.ts</code> + test</td><td>new — <code>useDatLichStore</code>, persist</td><td>5.3</td></tr>
<tr><td>B. Store</td><td><code>Header.tsx</code> + test, <code>LichHenCuaToi.tsx</code></td><td>changed / new — read the store</td><td>5.3</td></tr>
<tr><td>B. Store</td><td><code>test/setup.ts</code></td><td>changed — reset URL, store, localStorage</td><td>5.3</td></tr>
<tr><td>C. URL</td><td><code>logic/bo-loc-url.ts</code>, <code>hooks/useBoLocUrl.ts</code> + tests</td><td>new</td><td>5.4</td></tr>
<tr><td>C. URL</td><td><code>KhuBacSi.tsx</code>, <code>App.tsx</code>, <code>App.css</code></td><td>changed</td><td>5.4</td></tr>
</tbody>
</table>
<p>Order matters a little: build A first and test it on its own (the reducer tests need nothing else), then B (the flow&#39;s "Xác nhận" needs <code>themLichHen</code>), then C.</p>
${SD.keHoachEn}

<h3>🛠 Keep building the project</h3>
<p><strong>Starting point:</strong> your project after Chapter 4 — the files this chapter relies on are <code>src/types.ts</code>, <code>src/du-lieu/bac-si.ts</code> and <code>chuyen-khoa.ts</code>, <code>src/logic/loc-bac-si.ts</code> and <code>yeu-thich.ts</code> (Chapter 2), <code>KhuBacSi</code>, <code>ChipChuyenKhoa</code>, <code>OTimBacSi</code>, <code>DanhSachBacSi</code>, <code>TheBacSi</code>, <code>ChiTietBacSi</code> (Chapters 1–2), and <code>FormDatLich</code>, <code>src/schema/dat-lich.ts</code>, <code>src/logic/gui-dat-lich.ts</code> (Chapter 3). The Chapter 4 hooks are not touched: if your <code>KhuBacSi</code> debounces the search with <code>useDebounce</code>, keep that line — only the <em>source</em> of <code>tuKhoa</code> changes, from <code>useState</code> to the URL.</p>
<p>⏳ Not run for real: this solution was run on a trial project containing the code of Chapters 1–3 (34 tests), not together with Chapter 4&#39;s code, because Chapter 4 was being written at the same time and no snapshot of the project after Chapter 4 existed yet. <!-- CHAY-O-MAY: chép lời giải Chương 5 lên dự án sau Chương 4 (SCRATCH/rx/du-an/sau-ch04 khi có), chạy npx tsc -b + npx vitest run, xác nhận KhuBacSi còn useDebounce và không test nào đỏ --></p>
${slide('rx-05', 27, 'Keep building the project: four-step flow, shared store, filters in the URL')}
<p><strong>Part A — the booking flow (useReducer):</strong></p>
<ol>
<li>Create <code>src/du-lieu/khung-gio.ts</code>: three slots per doctor on 01/10/2026 (08:00, 09:30, 14:00, Vietnam time), ids <code>bs-N-kg-1…3</code>; the 09:30 slot of <code>bs-1</code>, <code>bs-3</code>, <code>bs-5</code> is full (<code>conTrong: false</code>). Export <code>khungGioCuaBacSi(bacSiId)</code> and <code>hienGio(iso)</code> which turns the ISO string into <code>'14:00 · 01/10/2026'</code> by cutting the string (so the result does not depend on the machine&#39;s time zone).</li>
<li>Create <code>src/dat-lich/luong-dat-lich.ts</code> with the state <code>LuongDatLich</code> (step, doctor, slot, patient details, sending, error, booked appointment), the union <code>HanhDongDatLich</code> of eight actions (<code>chon-bac-si</code>, <code>chon-khung-gio</code>, <code>nhap-thong-tin</code>, <code>quay-lai</code>, <code>bat-dau-gui</code>, <code>gui-loi</code>, <code>gui-xong</code>, <code>lam-lai</code>) and <code>luongDatLichReducer</code> with the rules from Lesson 5.2, ending in a <code>never</code> check.</li>
<li>Test the reducer with <code>reduce</code>: the full path; a different doctor drops the slot but keeps the patient; the same doctor keeps the slot; out-of-order actions return the same object; sending locks the flow; a frozen state does not throw; <code>lam-lai</code> returns the initial state.</li>
<li>Give <code>FormDatLich</code> two optional props, <code>nhanNut</code> and <code>giaTriDau</code>, and give <code>guiYeuCauDatLich</code> a third parameter <code>khungGioId</code> (default <code>'chua-chon'</code>).</li>
<li>Create <code>LuongDatLich</code>: a <code>section</code> labelled "Đặt lịch khám", a step bar (<code>aria-current="step"</code> on the current step), a heading "Bước n/4 — …", one block per step, a "← Quay lại" button from step 2, and the handler <code>xacNhan</code> that dispatches <code>bat-dau-gui</code>, awaits the fake server and dispatches the result.</li>
</ol>
<p><strong>Part B — the shared store (Zustand):</strong></p>
<ol start="6">
<li>Create <code>useDatLichStore</code> with <code>yeuThich</code>, <code>lichHen</code>, <code>doiYeuThich</code>, <code>themLichHen</code>; persist only the two arrays under <code>'phong-kham-dat-lich'</code>, version 1.</li>
<li>In <code>setup.ts</code>, after <code>cleanup()</code>: reset the URL, reset the store with <code>getInitialState()</code> and <code>true</code>, then clear <code>localStorage</code> — in that order.</li>
<li>In <code>LuongDatLich</code>, select <code>themLichHen</code> and call it after a successful send. Show "Lịch hẹn của tôi: n" in <code>Header</code> (label <code>"Số lịch hẹn của tôi"</code>) and add <code>LichHenCuaToi</code> listing doctor, time, patient and status.</li>
</ol>
<p><strong>Part C — filters in the URL:</strong></p>
<ol start="9">
<li>Create <code>docBoLoc</code>/<code>taoSearch</code> and the hook <code>useBoLocUrl</code> from Lesson 5.4.</li>
<li>In <code>KhuBacSi</code>: filters from the hook (chip ⇒ push, search ⇒ replace), favourites from the store; only <code>bacSiDangChonId</code> stays in <code>useState</code>. Move <code>FormDatLich</code> out of <code>KhuBacSi</code> (it now lives in step 3), and render <code>LuongDatLich</code> and <code>LichHenCuaToi</code> side by side in <code>App</code>.</li>
</ol>
<p><strong>Done when:</strong></p>
<ul>
<li><code>npx tsc -b</code> prints nothing, and <code>npx vitest run</code> is fully green with <strong>22 new tests</strong>: 7 for the reducer, 4 for <code>LuongDatLich</code>, 3 for the store, 1 for <code>Header</code>, 4 for <code>bo-loc-url</code>, 3 for <code>useBoLocUrl</code> — and the six old <code>KhuBacSi</code> tests from Chapter 2 still pass <em>unchanged</em>. The solution&#39;s run (34 older tests + 22): <code>Test Files 14 passed (14)</code>, <code>Tests 56 passed (56)</code>; with Chapter 4&#39;s tests your total is higher.</li>
<li>In the browser (<code>npm run dev</code>): the four steps match the screenshots on slides 24 and 27; after booking, the header says "Lịch hẹn của tôi: 1" and F5 keeps it; clicking "Nhi" puts <code>?ck=nhi</code> in the address bar and Back removes it; typing in the search box does not add history entries.</li>
<li><code>KhuBacSi</code> has exactly one <code>useState</code>.</li>
</ul>
<div class="out">$ npx tsc -b
$ npx vitest run --reporter=verbose
 ✓ src/components/KhuBacSi.test.tsx &gt; bấm chip Nhi ⇒ chỉ còn 2 bác sĩ nhi, chip được đánh dấu
 ✓ src/components/KhuBacSi.test.tsx &gt; gõ "lan" (không dấu) ⇒ tìm ra BS. Phạm Ngọc Lan
 …
 ✓ src/components/LuongDatLich.test.tsx &gt; đi đủ 4 bước ⇒ đặt được lịch, store có 1 lịch hẹn đúng khung giờ
 ✓ src/components/LuongDatLich.test.tsx &gt; khung giờ đã kín thì không bấm được
 ✓ src/components/LuongDatLich.test.tsx &gt; quay lại từ bước 4 ⇒ form bước 3 còn nguyên thông tin đã gõ
 ✓ src/hooks/useBoLocUrl.test.tsx &gt; mở link có sẵn ?ck=nhi&amp;q=vy ⇒ danh sách đã lọc ngay
 ✓ src/hooks/useBoLocUrl.test.tsx &gt; bấm chip ⇒ URL đổi (push); gõ tìm ⇒ URL đổi (replace, không đẻ thêm lịch sử)
 ✓ src/hooks/useBoLocUrl.test.tsx &gt; nút Back của trình duyệt ⇒ bộ lọc lùi theo
 ✓ src/components/LuongDatLich.test.tsx &gt; máy chủ báo lỗi ⇒ ở lại bước 4, hiện lỗi, bấm lại được
 ✓ src/components/Header.test.tsx &gt; Header đọc số lịch hẹn từ store, không cần prop
 ✓ src/dat-lich/luong-dat-lich.test.ts &gt; luongDatLichReducer &gt; đi đủ 4 bước
 …
 ✓ src/logic/bo-loc-url.test.ts &gt; đọc URL hợp lệ, kể cả chữ có dấu đã mã hoá
 …
 ✓ src/store/dat-lich-store.test.ts &gt; doiYeuThich bật rồi tắt, trả mảng mới
 ✓ src/store/dat-lich-store.test.ts &gt; themLichHen + persist ghi đúng phần dữ liệu vào localStorage
 ✓ src/store/dat-lich-store.test.ts &gt; mỗi test bắt đầu sạch (setup.ts reset store + localStorage)

 Test Files  14 passed (14)
      Tests  56 passed (56)</div>

<details><summary>Solution</summary>
<p>Run on the trial project on 25/09/2026: <code>npx tsc -b</code> printed nothing, <code>npx vitest run</code> gave <code>Test Files 14 passed (14)</code>, <code>Tests 56 passed (56)</code>, and <code>npx vite build</code> finished in 429 ms. Files in the order you would type them.</p>
<p><strong>A1. <code>src/du-lieu/khung-gio.ts</code></strong> (new)</p>
<pre><code class="language-ts">import type { KhungGio } from '../types';

/**
 * Khung giờ MẪU cho tới Chương 6 (khi đó thay bằng GET /api/bac-si/:id/khung-gio qua MSW + TanStack Query).
 * Mỗi bác sĩ ba khung trong ngày 01/10/2026 (giờ Việt Nam, +07:00); một khung đã kín để thử nhánh "hết chỗ".
 */
const gio = ['08:00', '09:30', '14:00'];
export const khungGioMau: KhungGio[] = ['bs-1', 'bs-2', 'bs-3', 'bs-4', 'bs-5', 'bs-6'].flatMap((bacSiId, i) =&gt;
  gio.map((g, k) =&gt; ({
    id: &#96;&#36;{bacSiId}-kg-&#36;{k + 1}&#96;,
    bacSiId,
    batDau: &#96;2026-10-01T&#36;{g}:00+07:00&#96;,
    conTrong: !(k === 1 &amp;&amp; i % 2 === 0), // bs-1, bs-3, bs-5: khung 09:30 đã kín
  })),
);

export function khungGioCuaBacSi(bacSiId: string): KhungGio[] {
  return khungGioMau.filter((kg) =&gt; kg.bacSiId === bacSiId);
}

/** '2026-10-01T09:30:00+07:00' → '09:30 · 01/10/2026' (cắt chuỗi, không phụ thuộc múi giờ của máy chạy). */
export function hienGio(iso: string): string {
  const [ngay, gioPhut] = [iso.slice(0, 10), iso.slice(11, 16)];
  const [n, t, d] = ngay.split('-');
  return &#96;&#36;{gioPhut} · &#36;{d}/&#36;{t}/&#36;{n}&#96;;
}</code></pre>
<p><strong>A2. <code>src/dat-lich/luong-dat-lich.ts</code></strong> (new) — exactly the file printed in full in Lesson 5.2, section "The project&#39;s reducer".</p>
<p><strong>A3. <code>src/dat-lich/luong-dat-lich.test.ts</code></strong> — lines 1–33 are in Lesson 5.2; the rest of the file:</p>
<pre><code class="language-ts">
  test('chọn lại ĐÚNG bác sĩ cũ ⇒ giữ khung giờ đã chọn', () =&gt; {
    const s = chay(
      { type: 'chon-bac-si', bacSiId: 'bs-2' },
      { type: 'chon-khung-gio', khungGioId: 'bs-2-kg-3' },
      { type: 'quay-lai' },
      { type: 'quay-lai' },
      { type: 'chon-bac-si', bacSiId: 'bs-2' },
    );
    expect(s.khungGioId).toBe('bs-2-kg-3');
  });

  test('hành động sai thứ tự bị bỏ qua (trả CHÍNH state cũ)', () =&gt; {
    expect(luongDatLichReducer(LUONG_BAN_DAU, { type: 'chon-khung-gio', khungGioId: 'x' })).toBe(LUONG_BAN_DAU);
    expect(luongDatLichReducer(LUONG_BAN_DAU, { type: 'nhap-thong-tin', thongTin })).toBe(LUONG_BAN_DAU);
    expect(luongDatLichReducer(LUONG_BAN_DAU, { type: 'bat-dau-gui' })).toBe(LUONG_BAN_DAU);
    expect(luongDatLichReducer(LUONG_BAN_DAU, { type: 'quay-lai' })).toBe(LUONG_BAN_DAU);
  });

  test('đang gửi thì khoá: quay lại / chọn bác sĩ đều bị bỏ qua', () =&gt; {
    const dangGui = chay(
      { type: 'chon-bac-si', bacSiId: 'bs-2' },
      { type: 'chon-khung-gio', khungGioId: 'bs-2-kg-1' },
      { type: 'nhap-thong-tin', thongTin },
      { type: 'bat-dau-gui' },
    );
    expect(dangGui.dangGui).toBe(true);
    expect(luongDatLichReducer(dangGui, { type: 'quay-lai' })).toBe(dangGui);
    expect(luongDatLichReducer(dangGui, { type: 'chon-bac-si', bacSiId: 'bs-1' })).toBe(dangGui);
    const loi = luongDatLichReducer(dangGui, { type: 'gui-loi', thongBao: 'Mất mạng' });
    expect(loi).toMatchObject({ dangGui: false, loiGui: 'Mất mạng', buoc: 4 });
  });

  test('không bao giờ sửa state cũ (đông cứng mà vẫn chạy)', () =&gt; {
    const cu = Object.freeze({ ...LUONG_BAN_DAU });
    expect(() =&gt; luongDatLichReducer(cu, { type: 'chon-bac-si', bacSiId: 'bs-1' })).not.toThrow();
    expect(cu.buoc).toBe(1);
  });

  test('làm lại ⇒ về đúng trạng thái ban đầu', () =&gt; {
    const s = chay({ type: 'chon-bac-si', bacSiId: 'bs-2' }, { type: 'lam-lai' });
    expect(s).toBe(LUONG_BAN_DAU);
  });
});</code></pre>
<p><strong>A4. <code>src/components/FormDatLich.tsx</code></strong> — four small edits to the Chapter 3 form (lines marked +):</p>
<pre><code class="language-diff"> interface FormDatLichProps {
   bacSi: BacSi;
   onGui: (duLieu: DatLich) =&gt; Promise&lt;void&gt;;
+  /** Chương 5: chữ trên nút (trong luồng 4 bước là "Tiếp tục") và giá trị điền sẵn khi quay lại bước này. */
+  nhanNut?: string;
+  giaTriDau?: DatLichForm;
 }
…
-export function FormDatLich({ bacSi, onGui }: FormDatLichProps) {
+export function FormDatLich({ bacSi, onGui, nhanNut = 'Gửi yêu cầu', giaTriDau = RONG }: FormDatLichProps) {
…
-    defaultValues: RONG,
+    defaultValues: giaTriDau,
…
-        {isSubmitting ? 'Đang gửi…' : 'Gửi yêu cầu'}
+        {isSubmitting ? 'Đang gửi…' : nhanNut}</code></pre>
<p><strong>A5. <code>src/logic/gui-dat-lich.ts</code></strong> — the fake server now takes the real slot id (third parameter, default kept so Chapter 3 code still compiles):</p>
<pre><code class="language-ts">import type { DatLich } from '../schema/dat-lich';
import type { LichHen } from '../types';

/** Chờ ms mili-giây. &#96;new Promise(r =&gt; setTimeout(r, ms))&#96; = một lời hứa tự xong sau ms. */
const cho = (ms: number) =&gt; new Promise((r) =&gt; setTimeout(r, ms));

/**
 * GIẢ LẬP máy chủ cho tới Chương 6 (khi đó thay bằng POST /api/lich-hen qua MSW + TanStack Query).
 * Chậm 800 ms như mạng thật; số 0999 999 999 giả làm "đã có lịch chờ" để thử nhánh lỗi.
 */
export async function guiYeuCauDatLich(bacSiId: string, duLieu: DatLich, khungGioId = 'chua-chon'): Promise&lt;LichHen&gt; {
  await cho(800);
  if (duLieu.benhNhan.soDienThoai === '0999999999') {
    throw new Error('Số điện thoại này đang có một lịch chờ xác nhận');
  }
  return {
    id: &#96;lh-&#36;{Date.now()}&#96;,
    bacSiId,
    khungGioId, // Chương 5: luồng 4 bước truyền khung giờ thật
    benhNhan: duLieu.benhNhan,
    lyDo: duLieu.lyDo,
    trangThai: 'cho-xac-nhan',
  };
}</code></pre>
<p><strong>B1–B2. <code>src/store/dat-lich-store.ts</code></strong> (new) and <code>src/test/setup.ts</code> — both printed in full in Lesson 5.3 (sections "persist" and "tests must clean up").</p>
<p><strong>B3. <code>src/store/dat-lich-store.test.ts</code></strong></p>
<pre><code class="language-ts">import { expect, test } from 'vitest';
import type { LichHen } from '../types';
import { useDatLichStore } from './dat-lich-store';

const lh: LichHen = {
  id: 'lh-1',
  bacSiId: 'bs-2',
  khungGioId: 'bs-2-kg-1',
  benhNhan: { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567', ngaySinh: '1995-03-14' },
  lyDo: 'Bé ho',
  trangThai: 'cho-xac-nhan',
};

test('doiYeuThich bật rồi tắt, trả mảng mới', () =&gt; {
  const truoc = useDatLichStore.getState().yeuThich;
  useDatLichStore.getState().doiYeuThich('bs-4');
  expect(useDatLichStore.getState().yeuThich).toEqual(['bs-4']);
  expect(useDatLichStore.getState().yeuThich).not.toBe(truoc);
  useDatLichStore.getState().doiYeuThich('bs-4');
  expect(useDatLichStore.getState().yeuThich).toEqual([]);
});

test('themLichHen + persist ghi đúng phần dữ liệu vào localStorage', () =&gt; {
  useDatLichStore.getState().themLichHen(lh);
  useDatLichStore.getState().doiYeuThich('bs-2');
  const luu = JSON.parse(localStorage.getItem('phong-kham-dat-lich')!);
  expect(luu).toEqual({ state: { yeuThich: ['bs-2'], lichHen: [lh] }, version: 1 });
});

test('mỗi test bắt đầu sạch (setup.ts reset store + localStorage)', () =&gt; {
  expect(useDatLichStore.getState().lichHen).toEqual([]);
  expect(localStorage.getItem('phong-kham-dat-lich')).toBeNull();
});</code></pre>
<p><strong>A6 + B4. <code>src/components/LuongDatLich.tsx</code></strong> (new)</p>
<pre><code class="language-tsx">import { useReducer } from 'react';
import { danhSachBacSi } from '../du-lieu/bac-si';
import { TEN_CHUYEN_KHOA } from '../du-lieu/chuyen-khoa';
import { hienGio, khungGioCuaBacSi } from '../du-lieu/khung-gio';
import { LUONG_BAN_DAU, luongDatLichReducer } from '../dat-lich/luong-dat-lich';
import { guiYeuCauDatLich } from '../logic/gui-dat-lich';
import { useDatLichStore } from '../store/dat-lich-store';
import { FormDatLich } from './FormDatLich';

const TEN_BUOC = ['Chọn bác sĩ', 'Chọn giờ khám', 'Thông tin bệnh nhân', 'Xác nhận'];

export function LuongDatLich() {
  const [state, dispatch] = useReducer(luongDatLichReducer, LUONG_BAN_DAU);
  const themLichHen = useDatLichStore((s) =&gt; s.themLichHen); // chỉ lấy HÀNH ĐỘNG ⇒ không render lại khi danh sách đổi
  const bacSi = danhSachBacSi.find((bs) =&gt; bs.id === state.bacSiId) ?? null;
  const khungGio = khungGioCuaBacSi(state.bacSiId ?? '').find((kg) =&gt; kg.id === state.khungGioId) ?? null;

  async function xacNhan() {
    if (!bacSi || !khungGio || !state.thongTin) return;
    dispatch({ type: 'bat-dau-gui' });
    try {
      const lichHen = await guiYeuCauDatLich(bacSi.id, state.thongTin, khungGio.id);
      themLichHen(lichHen); // store toàn app: Header, "Lịch hẹn của tôi" tự cập nhật
      dispatch({ type: 'gui-xong', lichHen });
    } catch (loi) {
      dispatch({ type: 'gui-loi', thongBao: loi instanceof Error ? loi.message : 'Gửi không thành công' });
    }
  }

  if (state.daDat &amp;&amp; bacSi &amp;&amp; khungGio) {
    return (
      &lt;section className="luong" aria-label="Đặt lịch khám"&gt;
        &lt;p className="gui-xong" role="status"&gt;
          Đã đặt lịch với {bacSi.ten} lúc {hienGio(khungGio.batDau)}. Mã lịch hẹn: {state.daDat.id}.
        &lt;/p&gt;
        &lt;button type="button" className="nut" onClick={() =&gt; dispatch({ type: 'lam-lai' })}&gt;
          Đặt lịch khác
        &lt;/button&gt;
      &lt;/section&gt;
    );
  }

  return (
    &lt;section className="luong" aria-label="Đặt lịch khám"&gt;
      &lt;h2&gt;Đặt lịch khám&lt;/h2&gt;
      &lt;ol className="cac-buoc"&gt;
        {TEN_BUOC.map((ten, i) =&gt; (
          &lt;li key={ten} aria-current={state.buoc === i + 1 ? 'step' : undefined}&gt;
            {i + 1}. {ten}
          &lt;/li&gt;
        ))}
      &lt;/ol&gt;
      &lt;h3&gt;
        Bước {state.buoc}/4 — {TEN_BUOC[state.buoc - 1]}
      &lt;/h3&gt;

      {state.buoc === 1 &amp;&amp; (
        &lt;div className="lua-chon"&gt;
          {danhSachBacSi.map((bs) =&gt; (
            &lt;button
              key={bs.id}
              type="button"
              className="nut"
              aria-pressed={bs.id === state.bacSiId}
              onClick={() =&gt; dispatch({ type: 'chon-bac-si', bacSiId: bs.id })}
            &gt;
              {bs.ten} · {TEN_CHUYEN_KHOA[bs.chuyenKhoa]}
            &lt;/button&gt;
          ))}
        &lt;/div&gt;
      )}

      {state.buoc === 2 &amp;&amp; bacSi &amp;&amp; (
        &lt;div className="lua-chon"&gt;
          {khungGioCuaBacSi(bacSi.id).map((kg) =&gt; (
            &lt;button
              key={kg.id}
              type="button"
              className="nut"
              disabled={!kg.conTrong}
              aria-pressed={kg.id === state.khungGioId}
              onClick={() =&gt; dispatch({ type: 'chon-khung-gio', khungGioId: kg.id })}
            &gt;
              {hienGio(kg.batDau)}
              {kg.conTrong ? '' : ' (kín)'}
            &lt;/button&gt;
          ))}
        &lt;/div&gt;
      )}

      {state.buoc === 3 &amp;&amp; bacSi &amp;&amp; (
        &lt;FormDatLich
          bacSi={bacSi}
          nhanNut="Tiếp tục"
          giaTriDau={state.thongTin ?? undefined}
          onGui={async (thongTin) =&gt; dispatch({ type: 'nhap-thong-tin', thongTin })}
        /&gt;
      )}

      {state.buoc === 4 &amp;&amp; bacSi &amp;&amp; khungGio &amp;&amp; state.thongTin &amp;&amp; (
        &lt;div className="tom-tat"&gt;
          &lt;dl&gt;
            &lt;dt&gt;Bác sĩ&lt;/dt&gt;
            &lt;dd&gt;{bacSi.ten}&lt;/dd&gt;
            &lt;dt&gt;Giờ khám&lt;/dt&gt;
            &lt;dd&gt;{hienGio(khungGio.batDau)}&lt;/dd&gt;
            &lt;dt&gt;Bệnh nhân&lt;/dt&gt;
            &lt;dd&gt;
              {state.thongTin.benhNhan.hoTen} · {state.thongTin.benhNhan.soDienThoai}
            &lt;/dd&gt;
            &lt;dt&gt;Lý do&lt;/dt&gt;
            &lt;dd&gt;{state.thongTin.lyDo}&lt;/dd&gt;
          &lt;/dl&gt;
          {state.loiGui &amp;&amp; (
            &lt;p className="loi-chung" role="alert"&gt;
              {state.loiGui}
            &lt;/p&gt;
          )}
          &lt;button type="button" className="nut nut-chinh" disabled={state.dangGui} onClick={xacNhan}&gt;
            {state.dangGui ? 'Đang gửi…' : 'Xác nhận đặt lịch'}
          &lt;/button&gt;
        &lt;/div&gt;
      )}

      {state.buoc &gt; 1 &amp;&amp; (
        &lt;button type="button" className="nut nut-lui" disabled={state.dangGui} onClick={() =&gt; dispatch({ type: 'quay-lai' })}&gt;
          ← Quay lại
        &lt;/button&gt;
      )}
    &lt;/section&gt;
  );
}</code></pre>
<p><strong>A7. <code>src/components/LuongDatLich.test.tsx</code></strong></p>
<pre><code class="language-tsx">import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { useDatLichStore } from '../store/dat-lich-store';
import { LuongDatLich } from './LuongDatLich';

async function dienThongTin(user: ReturnType&lt;typeof userEvent.setup&gt;, sdt = '0901 234 567') {
  await user.type(screen.getByLabelText('Họ và tên'), 'Nguyễn Thị Ánh');
  await user.type(screen.getByLabelText('Số điện thoại'), sdt);
  await user.type(screen.getByLabelText('Ngày sinh'), '1995-03-14');
  await user.type(screen.getByLabelText('Lý do khám'), 'Bé ho khan 3 ngày');
  await user.click(screen.getByRole('button', { name: 'Tiếp tục' }));
}

test('đi đủ 4 bước ⇒ đặt được lịch, store có 1 lịch hẹn đúng khung giờ', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;LuongDatLich /&gt;);
  expect(screen.getByRole('heading', { name: 'Bước 1/4 — Chọn bác sĩ' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /BS\\. Trần Thu Hà/ }));
  expect(screen.getByRole('heading', { name: 'Bước 2/4 — Chọn giờ khám' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '14:00 · 01/10/2026' }));
  await dienThongTin(user);
  const tomTat = screen.getByRole('heading', { name: 'Bước 4/4 — Xác nhận' }).parentElement!;
  expect(within(tomTat).getByText('0901234567', { exact: false })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Xác nhận đặt lịch' }));
  expect(screen.getByRole('button', { name: 'Đang gửi…' })).toBeDisabled();
  expect(await screen.findByRole('status', {}, { timeout: 2000 })).toHaveTextContent(
    'Đã đặt lịch với BS. Trần Thu Hà lúc 14:00 · 01/10/2026.',
  );
  const lh = useDatLichStore.getState().lichHen;
  expect(lh).toHaveLength(1);
  expect(lh[0]).toMatchObject({ bacSiId: 'bs-2', khungGioId: 'bs-2-kg-3', trangThai: 'cho-xac-nhan' });
});

test('khung giờ đã kín thì không bấm được', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;LuongDatLich /&gt;);
  await user.click(screen.getByRole('button', { name: /BS\\. Nguyễn Minh An/ }));
  expect(screen.getByRole('button', { name: '09:30 · 01/10/2026 (kín)' })).toBeDisabled();
});

test('quay lại từ bước 4 ⇒ form bước 3 còn nguyên thông tin đã gõ', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;LuongDatLich /&gt;);
  await user.click(screen.getByRole('button', { name: /BS\\. Trần Thu Hà/ }));
  await user.click(screen.getByRole('button', { name: '08:00 · 01/10/2026' }));
  await dienThongTin(user);
  await user.click(screen.getByRole('button', { name: '← Quay lại' }));
  expect(screen.getByLabelText('Họ và tên')).toHaveValue('Nguyễn Thị Ánh');
  expect(screen.getByLabelText('Số điện thoại')).toHaveValue('0901234567');
});

test('máy chủ báo lỗi ⇒ ở lại bước 4, hiện lỗi, bấm lại được', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;LuongDatLich /&gt;);
  await user.click(screen.getByRole('button', { name: /BS\\. Trần Thu Hà/ }));
  await user.click(screen.getByRole('button', { name: '08:00 · 01/10/2026' }));
  await dienThongTin(user, '0999 999 999');
  await user.click(screen.getByRole('button', { name: 'Xác nhận đặt lịch' }));
  expect(await screen.findByRole('alert', {}, { timeout: 2000 })).toHaveTextContent('đang có một lịch chờ xác nhận');
  expect(screen.getByRole('button', { name: 'Xác nhận đặt lịch' })).toBeEnabled();
  expect(useDatLichStore.getState().lichHen).toHaveLength(0);
});</code></pre>
<p><strong>B5. <code>src/components/Header.tsx</code></strong></p>
<pre><code class="language-tsx">import { useDatLichStore } from '../store/dat-lich-store';

export function Header() {
  // Header ở rất xa luồng đặt lịch trong cây component — vẫn đọc được số lịch hẹn nhờ store, không cần prop nào.
  const soLichHen = useDatLichStore((s) =&gt; s.lichHen.length);
  return (
    &lt;header className="header"&gt;
      &lt;div&gt;
        &lt;h1&gt;Phòng khám An Tâm&lt;/h1&gt;
        &lt;p&gt;Mở cửa 7:30–20:00, thứ Hai đến thứ Bảy&lt;/p&gt;
      &lt;/div&gt;
      &lt;p className="huy-hieu" aria-label="Số lịch hẹn của tôi"&gt;
        Lịch hẹn của tôi: {soLichHen}
      &lt;/p&gt;
    &lt;/header&gt;
  );
}</code></pre>
<p><strong>B6. <code>src/components/Header.test.tsx</code></strong></p>
<pre><code class="language-tsx">import { act, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useDatLichStore } from '../store/dat-lich-store';
import { Header } from './Header';

test('Header đọc số lịch hẹn từ store, không cần prop', () =&gt; {
  render(&lt;Header /&gt;);
  expect(screen.getByLabelText('Số lịch hẹn của tôi')).toHaveTextContent('Lịch hẹn của tôi: 0');
  act(() =&gt;
    useDatLichStore.getState().themLichHen({
      id: 'lh-1', bacSiId: 'bs-1', khungGioId: 'bs-1-kg-1', lyDo: 'Khám', trangThai: 'cho-xac-nhan',
      benhNhan: { hoTen: 'A', soDienThoai: '0901234567', ngaySinh: '2000-01-01' },
    }),
  );
  expect(screen.getByLabelText('Số lịch hẹn của tôi')).toHaveTextContent('Lịch hẹn của tôi: 1');
});</code></pre>
<p><strong>B7. <code>src/components/LichHenCuaToi.tsx</code></strong> (new)</p>
<pre><code class="language-tsx">import { danhSachBacSi } from '../du-lieu/bac-si';
import { hienGio, khungGioMau } from '../du-lieu/khung-gio';
import { useDatLichStore } from '../store/dat-lich-store';
import type { TrangThaiLichHen } from '../types';

const TEN_TRANG_THAI: Record&lt;TrangThaiLichHen, string&gt; = {
  'cho-xac-nhan': 'Chờ xác nhận',
  'da-xac-nhan': 'Đã xác nhận',
  'da-huy': 'Đã huỷ',
};

export function LichHenCuaToi() {
  const lichHen = useDatLichStore((s) =&gt; s.lichHen);
  return (
    &lt;section className="lich-hen" aria-label="Lịch hẹn của tôi"&gt;
      &lt;h2&gt;Lịch hẹn của tôi ({lichHen.length})&lt;/h2&gt;
      {lichHen.length === 0 ? (
        &lt;p className="goi-y"&gt;Chưa có lịch hẹn nào.&lt;/p&gt;
      ) : (
        &lt;ul&gt;
          {lichHen.map((lh) =&gt; {
            const bs = danhSachBacSi.find((b) =&gt; b.id === lh.bacSiId);
            const kg = khungGioMau.find((k) =&gt; k.id === lh.khungGioId);
            return (
              &lt;li key={lh.id}&gt;
                &lt;strong&gt;{bs?.ten}&lt;/strong&gt; · {kg ? hienGio(kg.batDau) : '—'} · {lh.benhNhan.hoTen} ·{' '}
                &lt;span className="trang-thai"&gt;{TEN_TRANG_THAI[lh.trangThai]}&lt;/span&gt;
              &lt;/li&gt;
            );
          })}
        &lt;/ul&gt;
      )}
    &lt;/section&gt;
  );
}</code></pre>
<p><strong>C1–C3.</strong> <code>src/logic/bo-loc-url.ts</code> + <code>bo-loc-url.test.ts</code>, <code>src/hooks/useBoLocUrl.ts</code> + <code>useBoLocUrl.test.tsx</code>, and the new <code>src/components/KhuBacSi.tsx</code> (four state variables became one) — all five files are printed in full in Lesson 5.4.</p>
<p><strong>C4. <code>src/App.tsx</code></strong> — the form moved out of <code>KhuBacSi</code> into the flow:</p>
<pre><code class="language-tsx">import './App.css';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { KhuBacSi } from './components/KhuBacSi';
import { LichHenCuaToi } from './components/LichHenCuaToi';
import { LuongDatLich } from './components/LuongDatLich';

export default function App() {
  return (
    &lt;&gt;
      &lt;Header /&gt;
      &lt;main className="noi-dung"&gt;
        &lt;KhuBacSi /&gt;
        &lt;div className="hang-duoi"&gt;
          &lt;LuongDatLich /&gt;
          &lt;LichHenCuaToi /&gt;
        &lt;/div&gt;
      &lt;/main&gt;
      &lt;Footer /&gt;
    &lt;/&gt;
  );
}</code></pre>
<p><strong>C5. <code>src/App.css</code></strong> — append:</p>
<pre><code class="language-css">/* ── Chương 5: luồng đặt lịch, lịch hẹn, huy hiệu ── */
.header { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.huy-hieu { background: #fff; color: #0e7490; font-weight: 700; border-radius: 999px; padding: 6px 14px; font-size: 14px; }
.hang-duoi { display: grid; grid-template-columns: 1fr 340px; gap: 18px; align-items: start; margin-top: 24px; }
.luong, .lich-hen { background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px 18px; }
.luong h2, .lich-hen h2 { margin: 0 0 10px; font-size: 20px; }
.luong h3 { margin: 10px 0; font-size: 16px; color: #0e7490; }
.cac-buoc { display: flex; gap: 6px; list-style: none; padding: 0; margin: 0; flex-wrap: wrap; }
.cac-buoc li { font-size: 13px; padding: 3px 10px; border-radius: 999px; background: #f1f5f9; color: #64748b; }
.cac-buoc li[aria-current='step'] { background: #0e7490; color: #fff; font-weight: 700; }
.lua-chon { display: flex; flex-wrap: wrap; gap: 8px; }
.lua-chon .nut[aria-pressed='true'] { border-color: #0e7490; background: #ecfeff; }
.lua-chon .nut:disabled { opacity: .45; cursor: not-allowed; }
.tom-tat dl { display: grid; grid-template-columns: 110px 1fr; gap: 4px 10px; margin: 0 0 12px; font-size: 14px; }
.tom-tat dt { color: #64748b; }
.tom-tat dd { margin: 0; font-weight: 600; }
.loi-chung { padding: 8px 10px; border-radius: 10px; background: #ffe4e6; color: #9f1239; font-size: 14px; }
.nut-lui { margin-top: 12px; }
.luong .form-dat-lich { margin-top: 0; }
.lich-hen ul { margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.6; }
.trang-thai { color: #b45309; font-weight: 600; }</code></pre>
<p>The old <code>KhuBacSi.test.tsx</code> from Chapter 2 is unchanged: its six tests pass again once <code>setup.ts</code> resets the URL and the store.</p>
</details>


<h3>Six mistakes, one last time</h3>
${slide('rx-05', 25, 'Common mistakes in Chapter 5')}
<p>Each of these happened during the writing of this chapter, and each has a measured number in the lessons above:</p>
<ul>
<li><strong><code>value={{ … }}</code> written inline</strong> — a new object every render; +18 card renders for three keystrokes (5.1).</li>
<li><strong>A context default that pretends to work</strong> — no provider, no error, no heart (5.1).</li>
<li><strong>Rules spread across several <code>useState</code></strong> — BS. Hà confirmed with BS. An&#39;s slot (5.2).</li>
<li><strong>A Zustand selector returning a new object</strong> — "Maximum update depth exceeded" (5.3).</li>
<li><strong>Stores and the URL not reset between tests</strong> — 4 of 6 old tests failed although the code was right (5.3).</li>
<li><strong><code>pushState</code> on every keystroke</strong> — 7 history entries for "thao vy"; and <code>pushState</code> without a state update does not re-render at all (5.4).</li>
</ul>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>A FER202 booking or checkout feature is often three routes with the data carried in a Redux store (one reducer, action constants, <code>connect</code>), the list filters in component state, and nothing persisted. → A team would build it the way you just did: the flow&#39;s state owned by the flow component in a typed reducer; only the data other parts of the app need (appointments, favourites) in a small Zustand store with <code>persist</code>; page state in the URL; and tests that reset every global between runs. · <em>Why:</em> each piece of state has the narrowest owner that works, so a bug has one place to live, and each owner has tests that do not depend on the others. That is also what an interviewer is looking for when they ask you to "explain the state architecture of your project".</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "Walk me through where state lives in your project, and why."</p>
<p>Use this chapter as the answer&#39;s skeleton: "The booking flow is a <code>useReducer</code> inside its component — eight typed actions, a pure reducer with tests, side effects in the handler. The user&#39;s favourites and booked appointments are in a Zustand store with persist, read through narrow selectors, because the header, the list and the flow all need them. The list filters are in the URL so links and Back work. The doctor being viewed is local <code>useState</code>. Server data will move to TanStack Query." Then mention one trade-off you measured — for example that selectors re-rendered one card instead of six.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> add a button "Đặt lịch với bác sĩ này" to <code>ChiTietBacSi</code> that starts the booking flow at step 2 with that doctor. The detail panel and the flow are cousins in the tree, and the flow&#39;s reducer is private to <code>LuongDatLich</code> — so decide how the message travels.</p><ol>
<li>Add <code>bacSiMuonDat: string | null</code> and <code>chonDeDat(id)</code> to <code>useDatLichStore</code> (do not persist it).</li>
<li>The button calls <code>chonDeDat(bacSi.id)</code>. In <code>LuongDatLich</code>, select <code>bacSiMuonDat</code>; when it is not <code>null</code>, dispatch <code>chon-bac-si</code> and call <code>chonDeDat(null)</code>. (Think about where this belongs: an effect that reacts to a store value, or the button calling a store action that the flow subscribes to? Write down why you chose.)</li>
<li>Test: open BS. Phạm Ngọc Lan&#39;s detail, click the button, and the flow shows "Bước 2/4 — Chọn giờ khám" with BS. Lan&#39;s three slots.</li>
</ol><p><strong>Done when:</strong> <code>npx tsc -b</code> prints nothing, the new test and all 56 existing ones are green, <code>bacSiMuonDat</code> does not appear in <code>localStorage</code>, and you can explain in two sentences why a context holding <code>dispatch</code> would also have worked here.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">state architecture</span><span class="v">the decision of where each piece of state lives and who may change it</span></div>
<div class="kv"><span class="k">flow reducer</span><span class="v">a reducer that owns a multi-step process (step, choices, sending, result)</span></div>
<div class="kv"><span class="k">client state vs server state</span><span class="v">data the browser owns (favourites, filters) vs data the server owns (doctors, slots)</span></div>
<div class="kv"><span class="k">page state</span><span class="v">state that belongs in the URL: shareable, survives F5, undone by Back</span></div>
<div class="kv"><span class="k">global reset in tests</span><span class="v">restoring the URL, stores and storage after each test so tests stay independent</span></div>
<div class="kv"><span class="k">acceptance criteria</span><span class="v">checkable conditions that say a task is done: tests green, screenshots match</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The booking flow is a typed reducer inside <code>LuongDatLich</code>; the API call stays in the handler.</li>
<li><code>useDatLichStore</code> holds only what distant components share — favourites and appointments — and persists them.</li>
<li>Filters and search live in the URL through <code>useBoLocUrl</code>; <code>KhuBacSi</code> went from four <code>useState</code> to one.</li>
<li><code>setup.ts</code> resets URL, store and <code>localStorage</code> after every test — the old Chapter 2 tests pass unchanged.</li>
<li>22 new tests; <code>tsc</code> clean; the whole flow checked in a real Chromium, including F5 and Back.</li>
<li>Chapter 6 replaces the sample slots and the fake server with MSW + TanStack Query, and the store stops holding appointments.</li>
</ul>

<a class="link-card" href="https://react.dev/learn/managing-state" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Managing State</span><span class="lc-sub">The whole state chapter of the official guide, from structure to context and reducers.</span></span></a>
<a class="link-card" href="https://react.dev/learn/choosing-the-state-structure" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Choosing the State Structure</span><span class="lc-sub">The principles behind "one owner per piece of state".</span></span></a>
<a class="link-card" href="https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/testing.md" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Zustand docs — Testing</span><span class="lc-sub">Keeping stores isolated between tests.</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Tự dựng: luồng đặt lịch bốn bước, store dùng chung, và bộ lọc trên URL</h2>
<p class="lead">Bốn bài, bốn chỗ ở cho state. Bài này đưa cả bốn vào app phòng khám cùng lúc: luồng đặt lịch chạy bằng reducer của 5.2, yêu thích và lịch hẹn đã đặt sống trong store Zustand của 5.3 và qua được F5, còn chuyên khoa đang lọc và chữ tìm kiếm chuyển lên URL như 5.4. Bạn tự gõ; lời giải đầy đủ ở cuối, đóng sẵn, và từng dòng của nó đã chạy.</p>

<h3>Thứ bạn sẽ dựng</h3>
${slide('rx-05', 24, 'Kết quả chương: luồng đặt lịch 4 bước bằng một reducer')}
<p>Bên dưới danh sách bác sĩ, một khung mới "Đặt lịch khám" dẫn qua bốn bước, có thanh bước ở trên: chọn bác sĩ, chọn giờ (khung đã kín vẫn hiện nhưng bị khoá), điền form của Chương 3 (nút giờ ghi "Tiếp tục"), và xác nhận trên một bảng tóm tắt. "Xác nhận đặt lịch" hiện "Đang gửi…" trong 800 ms máy chủ giả cần, rồi một câu thành công kèm mã lịch hẹn. Huy hiệu "Lịch hẹn của tôi" trên đầu trang và danh sách "Lịch hẹn của tôi (n)" cập nhật ngay — chúng đọc cùng một store — và cả hai sống qua F5. Ảnh trên slide chụp từ Chromium thật, do chính script có output bạn đã thấy ở Bài 5.3 và 5.4 điều khiển:</p>
<div class="out">[sau] ngay sau Xac nhan: nut = Đang gửi…
[sau] xong: Đã đặt lịch với BS. Nguyễn Minh An lúc 14:00 · 01/10/2026. Mã lịch hẹn: lh-1790303755862.
[sau] header: Lịch hẹn của tôi: 1
[sau] F5 roi: Lịch hẹn của tôi: 1 | Lịch hẹn của tôi (1)</div>
${SD.xacNhanVi}

<h3>Lên kế hoạch trước khi gõ</h3>
<table>
<thead><tr><th>Phần</th><th>File</th><th>Mới / sửa</th><th>Từ bài</th></tr></thead>
<tbody>
<tr><td>A. Luồng</td><td><code>du-lieu/khung-gio.ts</code></td><td>mới — khung giờ mẫu tới Chương 6</td><td>—</td></tr>
<tr><td>A. Luồng</td><td><code>dat-lich/luong-dat-lich.ts</code> + test</td><td>mới — reducer, 8 loại hành động</td><td>5.2</td></tr>
<tr><td>A. Luồng</td><td><code>components/LuongDatLich.tsx</code> + test</td><td>mới — bốn bước</td><td>5.2</td></tr>
<tr><td>A. Luồng</td><td><code>FormDatLich.tsx</code>, <code>gui-dat-lich.ts</code></td><td>sửa — hai prop không bắt buộc; id khung giờ thật</td><td>Chương 3</td></tr>
<tr><td>B. Store</td><td><code>store/dat-lich-store.ts</code> + test</td><td>mới — <code>useDatLichStore</code>, persist</td><td>5.3</td></tr>
<tr><td>B. Store</td><td><code>Header.tsx</code> + test, <code>LichHenCuaToi.tsx</code></td><td>sửa / mới — đọc store</td><td>5.3</td></tr>
<tr><td>B. Store</td><td><code>test/setup.ts</code></td><td>sửa — đặt lại URL, store, localStorage</td><td>5.3</td></tr>
<tr><td>C. URL</td><td><code>logic/bo-loc-url.ts</code>, <code>hooks/useBoLocUrl.ts</code> + test</td><td>mới</td><td>5.4</td></tr>
<tr><td>C. URL</td><td><code>KhuBacSi.tsx</code>, <code>App.tsx</code>, <code>App.css</code></td><td>sửa</td><td>5.4</td></tr>
</tbody>
</table>
<p>Thứ tự có ý nghĩa một chút: dựng A trước và test riêng nó (test reducer không cần gì khác), rồi B ("Xác nhận" của luồng cần <code>themLichHen</code>), rồi C.</p>
${SD.keHoachVi}

<h3>🛠 Tự gõ tiếp dự án</h3>
<p><strong>Điểm xuất phát:</strong> dự án của bạn sau Chương 4 — những file chương này dựa vào là <code>src/types.ts</code>, <code>src/du-lieu/bac-si.ts</code> và <code>chuyen-khoa.ts</code>, <code>src/logic/loc-bac-si.ts</code> và <code>yeu-thich.ts</code> (Chương 2), <code>KhuBacSi</code>, <code>ChipChuyenKhoa</code>, <code>OTimBacSi</code>, <code>DanhSachBacSi</code>, <code>TheBacSi</code>, <code>ChiTietBacSi</code> (Chương 1–2), và <code>FormDatLich</code>, <code>src/schema/dat-lich.ts</code>, <code>src/logic/gui-dat-lich.ts</code> (Chương 3). Các hook của Chương 4 không bị đụng tới: nếu <code>KhuBacSi</code> của bạn làm trễ ô tìm bằng <code>useDebounce</code>, giữ dòng đó — chỉ <em>nguồn</em> của <code>tuKhoa</code> đổi, từ <code>useState</code> sang URL.</p>
<p>⏳ Chưa chạy thật: lời giải này chạy trên dự án thử chứa mã của Chương 1–3 (34 test), chưa chạy chung với mã của Chương 4, vì Chương 4 được soạn cùng lúc và lúc chạy chưa có ảnh chụp dự án sau Chương 4. <!-- CHAY-O-MAY: chép lời giải Chương 5 lên dự án sau Chương 4 (SCRATCH/rx/du-an/sau-ch04 khi có), chạy npx tsc -b + npx vitest run, xác nhận KhuBacSi còn useDebounce và không test nào đỏ --></p>
${slide('rx-05', 27, 'Tự gõ tiếp dự án: luồng 4 bước, store dùng chung, lọc trên URL')}
<p><strong>Phần A — luồng đặt lịch (useReducer):</strong></p>
<ol>
<li>Tạo <code>src/du-lieu/khung-gio.ts</code>: mỗi bác sĩ ba khung trong ngày 01/10/2026 (08:00, 09:30, 14:00, giờ Việt Nam), id <code>bs-N-kg-1…3</code>; khung 09:30 của <code>bs-1</code>, <code>bs-3</code>, <code>bs-5</code> đã kín (<code>conTrong: false</code>). Export <code>khungGioCuaBacSi(bacSiId)</code> và <code>hienGio(iso)</code> biến chuỗi ISO thành <code>'14:00 · 01/10/2026'</code> bằng cách cắt chuỗi (để kết quả không phụ thuộc múi giờ của máy chạy).</li>
<li>Tạo <code>src/dat-lich/luong-dat-lich.ts</code> với state <code>LuongDatLich</code> (bước, bác sĩ, khung giờ, thông tin bệnh nhân, đang gửi, lỗi, lịch hẹn đã đặt), union <code>HanhDongDatLich</code> gồm tám hành động (<code>chon-bac-si</code>, <code>chon-khung-gio</code>, <code>nhap-thong-tin</code>, <code>quay-lai</code>, <code>bat-dau-gui</code>, <code>gui-loi</code>, <code>gui-xong</code>, <code>lam-lai</code>) và <code>luongDatLichReducer</code> với các luật của Bài 5.2, kết thúc bằng kiểm <code>never</code>.</li>
<li>Test reducer bằng <code>reduce</code>: đi đủ đường; bác sĩ khác thì bỏ khung giờ nhưng giữ bệnh nhân; cùng bác sĩ thì giữ khung giờ; hành động sai thứ tự trả chính object cũ; đang gửi thì khoá; state đông cứng không ném lỗi; <code>lam-lai</code> trả về state ban đầu.</li>
<li>Cho <code>FormDatLich</code> hai prop không bắt buộc, <code>nhanNut</code> và <code>giaTriDau</code>, và cho <code>guiYeuCauDatLich</code> tham số thứ ba <code>khungGioId</code> (mặc định <code>'chua-chon'</code>).</li>
<li>Tạo <code>LuongDatLich</code>: một <code>section</code> nhãn "Đặt lịch khám", thanh bước (<code>aria-current="step"</code> ở bước hiện tại), tiêu đề "Bước n/4 — …", mỗi bước một khối, nút "← Quay lại" từ bước 2, và handler <code>xacNhan</code> dispatch <code>bat-dau-gui</code>, chờ máy chủ giả rồi dispatch kết quả.</li>
</ol>
<p><strong>Phần B — store dùng chung (Zustand):</strong></p>
<ol start="6">
<li>Tạo <code>useDatLichStore</code> với <code>yeuThich</code>, <code>lichHen</code>, <code>doiYeuThich</code>, <code>themLichHen</code>; chỉ lưu hai mảng dưới khoá <code>'phong-kham-dat-lich'</code>, version 1.</li>
<li>Trong <code>setup.ts</code>, sau <code>cleanup()</code>: đặt lại URL, đặt lại store bằng <code>getInitialState()</code> và <code>true</code>, rồi xoá <code>localStorage</code> — đúng thứ tự đó.</li>
<li>Trong <code>LuongDatLich</code>, chọn <code>themLichHen</code> và gọi nó sau khi gửi thành công. Hiện "Lịch hẹn của tôi: n" ở <code>Header</code> (nhãn <code>"Số lịch hẹn của tôi"</code>) và thêm <code>LichHenCuaToi</code> liệt kê bác sĩ, giờ, bệnh nhân và trạng thái.</li>
</ol>
<p><strong>Phần C — bộ lọc trên URL:</strong></p>
<ol start="9">
<li>Tạo <code>docBoLoc</code>/<code>taoSearch</code> và hook <code>useBoLocUrl</code> của Bài 5.4.</li>
<li>Trong <code>KhuBacSi</code>: bộ lọc lấy từ hook (chip ⇒ push, ô tìm ⇒ replace), yêu thích lấy từ store; chỉ <code>bacSiDangChonId</code> ở lại trong <code>useState</code>. Chuyển <code>FormDatLich</code> ra khỏi <code>KhuBacSi</code> (giờ nó ở bước 3), và render <code>LuongDatLich</code> cạnh <code>LichHenCuaToi</code> trong <code>App</code>.</li>
</ol>
<p><strong>Đạt khi:</strong></p>
<ul>
<li><code>npx tsc -b</code> không in gì, và <code>npx vitest run</code> xanh toàn bộ với <strong>22 test mới</strong>: 7 cho reducer, 4 cho <code>LuongDatLich</code>, 3 cho store, 1 cho <code>Header</code>, 4 cho <code>bo-loc-url</code>, 3 cho <code>useBoLocUrl</code> — và sáu test <code>KhuBacSi</code> cũ của Chương 2 vẫn xanh <em>không sửa một dòng</em>. Lượt chạy của lời giải (34 test cũ + 22): <code>Test Files 14 passed (14)</code>, <code>Tests 56 passed (56)</code>; có thêm test của Chương 4 thì tổng của bạn lớn hơn.</li>
<li>Trên trình duyệt (<code>npm run dev</code>): bốn bước giống ảnh chụp ở slide 24 và 27; đặt lịch xong, đầu trang ghi "Lịch hẹn của tôi: 1" và F5 vẫn giữ; bấm "Nhi" thì thanh địa chỉ có <code>?ck=nhi</code> và Back gỡ nó đi; gõ vào ô tìm không đẻ thêm mục lịch sử.</li>
<li><code>KhuBacSi</code> có đúng một lời gọi <code>useState</code>.</li>
</ul>
<div class="out">$ npx tsc -b
$ npx vitest run --reporter=verbose
 ✓ src/components/KhuBacSi.test.tsx &gt; bấm chip Nhi ⇒ chỉ còn 2 bác sĩ nhi, chip được đánh dấu
 ✓ src/components/KhuBacSi.test.tsx &gt; gõ "lan" (không dấu) ⇒ tìm ra BS. Phạm Ngọc Lan
 …
 ✓ src/components/LuongDatLich.test.tsx &gt; đi đủ 4 bước ⇒ đặt được lịch, store có 1 lịch hẹn đúng khung giờ
 ✓ src/components/LuongDatLich.test.tsx &gt; khung giờ đã kín thì không bấm được
 ✓ src/components/LuongDatLich.test.tsx &gt; quay lại từ bước 4 ⇒ form bước 3 còn nguyên thông tin đã gõ
 ✓ src/hooks/useBoLocUrl.test.tsx &gt; mở link có sẵn ?ck=nhi&amp;q=vy ⇒ danh sách đã lọc ngay
 ✓ src/hooks/useBoLocUrl.test.tsx &gt; bấm chip ⇒ URL đổi (push); gõ tìm ⇒ URL đổi (replace, không đẻ thêm lịch sử)
 ✓ src/hooks/useBoLocUrl.test.tsx &gt; nút Back của trình duyệt ⇒ bộ lọc lùi theo
 ✓ src/components/LuongDatLich.test.tsx &gt; máy chủ báo lỗi ⇒ ở lại bước 4, hiện lỗi, bấm lại được
 ✓ src/components/Header.test.tsx &gt; Header đọc số lịch hẹn từ store, không cần prop
 ✓ src/dat-lich/luong-dat-lich.test.ts &gt; luongDatLichReducer &gt; đi đủ 4 bước
 …
 ✓ src/logic/bo-loc-url.test.ts &gt; đọc URL hợp lệ, kể cả chữ có dấu đã mã hoá
 …
 ✓ src/store/dat-lich-store.test.ts &gt; doiYeuThich bật rồi tắt, trả mảng mới
 ✓ src/store/dat-lich-store.test.ts &gt; themLichHen + persist ghi đúng phần dữ liệu vào localStorage
 ✓ src/store/dat-lich-store.test.ts &gt; mỗi test bắt đầu sạch (setup.ts reset store + localStorage)

 Test Files  14 passed (14)
      Tests  56 passed (56)</div>

<details><summary>Lời giải</summary>
<p>Chạy trên dự án thử ngày 25/09/2026: <code>npx tsc -b</code> không in gì, <code>npx vitest run</code> cho <code>Test Files 14 passed (14)</code>, <code>Tests 56 passed (56)</code>, và <code>npx vite build</code> xong trong 429 ms. Các file theo thứ tự bạn sẽ gõ.</p>
<p><strong>A1. <code>src/du-lieu/khung-gio.ts</code></strong> (mới)</p>
<pre><code class="language-ts">import type { KhungGio } from '../types';

/**
 * Khung giờ MẪU cho tới Chương 6 (khi đó thay bằng GET /api/bac-si/:id/khung-gio qua MSW + TanStack Query).
 * Mỗi bác sĩ ba khung trong ngày 01/10/2026 (giờ Việt Nam, +07:00); một khung đã kín để thử nhánh "hết chỗ".
 */
const gio = ['08:00', '09:30', '14:00'];
export const khungGioMau: KhungGio[] = ['bs-1', 'bs-2', 'bs-3', 'bs-4', 'bs-5', 'bs-6'].flatMap((bacSiId, i) =&gt;
  gio.map((g, k) =&gt; ({
    id: &#96;&#36;{bacSiId}-kg-&#36;{k + 1}&#96;,
    bacSiId,
    batDau: &#96;2026-10-01T&#36;{g}:00+07:00&#96;,
    conTrong: !(k === 1 &amp;&amp; i % 2 === 0), // bs-1, bs-3, bs-5: khung 09:30 đã kín
  })),
);

export function khungGioCuaBacSi(bacSiId: string): KhungGio[] {
  return khungGioMau.filter((kg) =&gt; kg.bacSiId === bacSiId);
}

/** '2026-10-01T09:30:00+07:00' → '09:30 · 01/10/2026' (cắt chuỗi, không phụ thuộc múi giờ của máy chạy). */
export function hienGio(iso: string): string {
  const [ngay, gioPhut] = [iso.slice(0, 10), iso.slice(11, 16)];
  const [n, t, d] = ngay.split('-');
  return &#96;&#36;{gioPhut} · &#36;{d}/&#36;{t}/&#36;{n}&#96;;
}</code></pre>
<p><strong>A2. <code>src/dat-lich/luong-dat-lich.ts</code></strong> (mới) — đúng file đã in đầy đủ ở Bài 5.2, mục "Reducer của dự án".</p>
<p><strong>A3. <code>src/dat-lich/luong-dat-lich.test.ts</code></strong> — dòng 1–33 có ở Bài 5.2; phần còn lại của file:</p>
<pre><code class="language-ts">
  test('chọn lại ĐÚNG bác sĩ cũ ⇒ giữ khung giờ đã chọn', () =&gt; {
    const s = chay(
      { type: 'chon-bac-si', bacSiId: 'bs-2' },
      { type: 'chon-khung-gio', khungGioId: 'bs-2-kg-3' },
      { type: 'quay-lai' },
      { type: 'quay-lai' },
      { type: 'chon-bac-si', bacSiId: 'bs-2' },
    );
    expect(s.khungGioId).toBe('bs-2-kg-3');
  });

  test('hành động sai thứ tự bị bỏ qua (trả CHÍNH state cũ)', () =&gt; {
    expect(luongDatLichReducer(LUONG_BAN_DAU, { type: 'chon-khung-gio', khungGioId: 'x' })).toBe(LUONG_BAN_DAU);
    expect(luongDatLichReducer(LUONG_BAN_DAU, { type: 'nhap-thong-tin', thongTin })).toBe(LUONG_BAN_DAU);
    expect(luongDatLichReducer(LUONG_BAN_DAU, { type: 'bat-dau-gui' })).toBe(LUONG_BAN_DAU);
    expect(luongDatLichReducer(LUONG_BAN_DAU, { type: 'quay-lai' })).toBe(LUONG_BAN_DAU);
  });

  test('đang gửi thì khoá: quay lại / chọn bác sĩ đều bị bỏ qua', () =&gt; {
    const dangGui = chay(
      { type: 'chon-bac-si', bacSiId: 'bs-2' },
      { type: 'chon-khung-gio', khungGioId: 'bs-2-kg-1' },
      { type: 'nhap-thong-tin', thongTin },
      { type: 'bat-dau-gui' },
    );
    expect(dangGui.dangGui).toBe(true);
    expect(luongDatLichReducer(dangGui, { type: 'quay-lai' })).toBe(dangGui);
    expect(luongDatLichReducer(dangGui, { type: 'chon-bac-si', bacSiId: 'bs-1' })).toBe(dangGui);
    const loi = luongDatLichReducer(dangGui, { type: 'gui-loi', thongBao: 'Mất mạng' });
    expect(loi).toMatchObject({ dangGui: false, loiGui: 'Mất mạng', buoc: 4 });
  });

  test('không bao giờ sửa state cũ (đông cứng mà vẫn chạy)', () =&gt; {
    const cu = Object.freeze({ ...LUONG_BAN_DAU });
    expect(() =&gt; luongDatLichReducer(cu, { type: 'chon-bac-si', bacSiId: 'bs-1' })).not.toThrow();
    expect(cu.buoc).toBe(1);
  });

  test('làm lại ⇒ về đúng trạng thái ban đầu', () =&gt; {
    const s = chay({ type: 'chon-bac-si', bacSiId: 'bs-2' }, { type: 'lam-lai' });
    expect(s).toBe(LUONG_BAN_DAU);
  });
});</code></pre>
<p><strong>A4. <code>src/components/FormDatLich.tsx</code></strong> — bốn chỗ sửa nhỏ trong form của Chương 3 (dòng có dấu +):</p>
<pre><code class="language-diff"> interface FormDatLichProps {
   bacSi: BacSi;
   onGui: (duLieu: DatLich) =&gt; Promise&lt;void&gt;;
+  /** Chương 5: chữ trên nút (trong luồng 4 bước là "Tiếp tục") và giá trị điền sẵn khi quay lại bước này. */
+  nhanNut?: string;
+  giaTriDau?: DatLichForm;
 }
…
-export function FormDatLich({ bacSi, onGui }: FormDatLichProps) {
+export function FormDatLich({ bacSi, onGui, nhanNut = 'Gửi yêu cầu', giaTriDau = RONG }: FormDatLichProps) {
…
-    defaultValues: RONG,
+    defaultValues: giaTriDau,
…
-        {isSubmitting ? 'Đang gửi…' : 'Gửi yêu cầu'}
+        {isSubmitting ? 'Đang gửi…' : nhanNut}</code></pre>
<p><strong>A5. <code>src/logic/gui-dat-lich.ts</code></strong> — máy chủ giả giờ nhận id khung giờ thật (tham số thứ ba, giữ mặc định để mã Chương 3 vẫn biên dịch):</p>
<pre><code class="language-ts">import type { DatLich } from '../schema/dat-lich';
import type { LichHen } from '../types';

/** Chờ ms mili-giây. &#96;new Promise(r =&gt; setTimeout(r, ms))&#96; = một lời hứa tự xong sau ms. */
const cho = (ms: number) =&gt; new Promise((r) =&gt; setTimeout(r, ms));

/**
 * GIẢ LẬP máy chủ cho tới Chương 6 (khi đó thay bằng POST /api/lich-hen qua MSW + TanStack Query).
 * Chậm 800 ms như mạng thật; số 0999 999 999 giả làm "đã có lịch chờ" để thử nhánh lỗi.
 */
export async function guiYeuCauDatLich(bacSiId: string, duLieu: DatLich, khungGioId = 'chua-chon'): Promise&lt;LichHen&gt; {
  await cho(800);
  if (duLieu.benhNhan.soDienThoai === '0999999999') {
    throw new Error('Số điện thoại này đang có một lịch chờ xác nhận');
  }
  return {
    id: &#96;lh-&#36;{Date.now()}&#96;,
    bacSiId,
    khungGioId, // Chương 5: luồng 4 bước truyền khung giờ thật
    benhNhan: duLieu.benhNhan,
    lyDo: duLieu.lyDo,
    trangThai: 'cho-xac-nhan',
  };
}</code></pre>
<p><strong>B1–B2. <code>src/store/dat-lich-store.ts</code></strong> (mới) và <code>src/test/setup.ts</code> — cả hai đã in đầy đủ ở Bài 5.3 (mục "persist" và "test phải tự dọn").</p>
<p><strong>B3. <code>src/store/dat-lich-store.test.ts</code></strong></p>
<pre><code class="language-ts">import { expect, test } from 'vitest';
import type { LichHen } from '../types';
import { useDatLichStore } from './dat-lich-store';

const lh: LichHen = {
  id: 'lh-1',
  bacSiId: 'bs-2',
  khungGioId: 'bs-2-kg-1',
  benhNhan: { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567', ngaySinh: '1995-03-14' },
  lyDo: 'Bé ho',
  trangThai: 'cho-xac-nhan',
};

test('doiYeuThich bật rồi tắt, trả mảng mới', () =&gt; {
  const truoc = useDatLichStore.getState().yeuThich;
  useDatLichStore.getState().doiYeuThich('bs-4');
  expect(useDatLichStore.getState().yeuThich).toEqual(['bs-4']);
  expect(useDatLichStore.getState().yeuThich).not.toBe(truoc);
  useDatLichStore.getState().doiYeuThich('bs-4');
  expect(useDatLichStore.getState().yeuThich).toEqual([]);
});

test('themLichHen + persist ghi đúng phần dữ liệu vào localStorage', () =&gt; {
  useDatLichStore.getState().themLichHen(lh);
  useDatLichStore.getState().doiYeuThich('bs-2');
  const luu = JSON.parse(localStorage.getItem('phong-kham-dat-lich')!);
  expect(luu).toEqual({ state: { yeuThich: ['bs-2'], lichHen: [lh] }, version: 1 });
});

test('mỗi test bắt đầu sạch (setup.ts reset store + localStorage)', () =&gt; {
  expect(useDatLichStore.getState().lichHen).toEqual([]);
  expect(localStorage.getItem('phong-kham-dat-lich')).toBeNull();
});</code></pre>
<p><strong>A6 + B4. <code>src/components/LuongDatLich.tsx</code></strong> (mới)</p>
<pre><code class="language-tsx">import { useReducer } from 'react';
import { danhSachBacSi } from '../du-lieu/bac-si';
import { TEN_CHUYEN_KHOA } from '../du-lieu/chuyen-khoa';
import { hienGio, khungGioCuaBacSi } from '../du-lieu/khung-gio';
import { LUONG_BAN_DAU, luongDatLichReducer } from '../dat-lich/luong-dat-lich';
import { guiYeuCauDatLich } from '../logic/gui-dat-lich';
import { useDatLichStore } from '../store/dat-lich-store';
import { FormDatLich } from './FormDatLich';

const TEN_BUOC = ['Chọn bác sĩ', 'Chọn giờ khám', 'Thông tin bệnh nhân', 'Xác nhận'];

export function LuongDatLich() {
  const [state, dispatch] = useReducer(luongDatLichReducer, LUONG_BAN_DAU);
  const themLichHen = useDatLichStore((s) =&gt; s.themLichHen); // chỉ lấy HÀNH ĐỘNG ⇒ không render lại khi danh sách đổi
  const bacSi = danhSachBacSi.find((bs) =&gt; bs.id === state.bacSiId) ?? null;
  const khungGio = khungGioCuaBacSi(state.bacSiId ?? '').find((kg) =&gt; kg.id === state.khungGioId) ?? null;

  async function xacNhan() {
    if (!bacSi || !khungGio || !state.thongTin) return;
    dispatch({ type: 'bat-dau-gui' });
    try {
      const lichHen = await guiYeuCauDatLich(bacSi.id, state.thongTin, khungGio.id);
      themLichHen(lichHen); // store toàn app: Header, "Lịch hẹn của tôi" tự cập nhật
      dispatch({ type: 'gui-xong', lichHen });
    } catch (loi) {
      dispatch({ type: 'gui-loi', thongBao: loi instanceof Error ? loi.message : 'Gửi không thành công' });
    }
  }

  if (state.daDat &amp;&amp; bacSi &amp;&amp; khungGio) {
    return (
      &lt;section className="luong" aria-label="Đặt lịch khám"&gt;
        &lt;p className="gui-xong" role="status"&gt;
          Đã đặt lịch với {bacSi.ten} lúc {hienGio(khungGio.batDau)}. Mã lịch hẹn: {state.daDat.id}.
        &lt;/p&gt;
        &lt;button type="button" className="nut" onClick={() =&gt; dispatch({ type: 'lam-lai' })}&gt;
          Đặt lịch khác
        &lt;/button&gt;
      &lt;/section&gt;
    );
  }

  return (
    &lt;section className="luong" aria-label="Đặt lịch khám"&gt;
      &lt;h2&gt;Đặt lịch khám&lt;/h2&gt;
      &lt;ol className="cac-buoc"&gt;
        {TEN_BUOC.map((ten, i) =&gt; (
          &lt;li key={ten} aria-current={state.buoc === i + 1 ? 'step' : undefined}&gt;
            {i + 1}. {ten}
          &lt;/li&gt;
        ))}
      &lt;/ol&gt;
      &lt;h3&gt;
        Bước {state.buoc}/4 — {TEN_BUOC[state.buoc - 1]}
      &lt;/h3&gt;

      {state.buoc === 1 &amp;&amp; (
        &lt;div className="lua-chon"&gt;
          {danhSachBacSi.map((bs) =&gt; (
            &lt;button
              key={bs.id}
              type="button"
              className="nut"
              aria-pressed={bs.id === state.bacSiId}
              onClick={() =&gt; dispatch({ type: 'chon-bac-si', bacSiId: bs.id })}
            &gt;
              {bs.ten} · {TEN_CHUYEN_KHOA[bs.chuyenKhoa]}
            &lt;/button&gt;
          ))}
        &lt;/div&gt;
      )}

      {state.buoc === 2 &amp;&amp; bacSi &amp;&amp; (
        &lt;div className="lua-chon"&gt;
          {khungGioCuaBacSi(bacSi.id).map((kg) =&gt; (
            &lt;button
              key={kg.id}
              type="button"
              className="nut"
              disabled={!kg.conTrong}
              aria-pressed={kg.id === state.khungGioId}
              onClick={() =&gt; dispatch({ type: 'chon-khung-gio', khungGioId: kg.id })}
            &gt;
              {hienGio(kg.batDau)}
              {kg.conTrong ? '' : ' (kín)'}
            &lt;/button&gt;
          ))}
        &lt;/div&gt;
      )}

      {state.buoc === 3 &amp;&amp; bacSi &amp;&amp; (
        &lt;FormDatLich
          bacSi={bacSi}
          nhanNut="Tiếp tục"
          giaTriDau={state.thongTin ?? undefined}
          onGui={async (thongTin) =&gt; dispatch({ type: 'nhap-thong-tin', thongTin })}
        /&gt;
      )}

      {state.buoc === 4 &amp;&amp; bacSi &amp;&amp; khungGio &amp;&amp; state.thongTin &amp;&amp; (
        &lt;div className="tom-tat"&gt;
          &lt;dl&gt;
            &lt;dt&gt;Bác sĩ&lt;/dt&gt;
            &lt;dd&gt;{bacSi.ten}&lt;/dd&gt;
            &lt;dt&gt;Giờ khám&lt;/dt&gt;
            &lt;dd&gt;{hienGio(khungGio.batDau)}&lt;/dd&gt;
            &lt;dt&gt;Bệnh nhân&lt;/dt&gt;
            &lt;dd&gt;
              {state.thongTin.benhNhan.hoTen} · {state.thongTin.benhNhan.soDienThoai}
            &lt;/dd&gt;
            &lt;dt&gt;Lý do&lt;/dt&gt;
            &lt;dd&gt;{state.thongTin.lyDo}&lt;/dd&gt;
          &lt;/dl&gt;
          {state.loiGui &amp;&amp; (
            &lt;p className="loi-chung" role="alert"&gt;
              {state.loiGui}
            &lt;/p&gt;
          )}
          &lt;button type="button" className="nut nut-chinh" disabled={state.dangGui} onClick={xacNhan}&gt;
            {state.dangGui ? 'Đang gửi…' : 'Xác nhận đặt lịch'}
          &lt;/button&gt;
        &lt;/div&gt;
      )}

      {state.buoc &gt; 1 &amp;&amp; (
        &lt;button type="button" className="nut nut-lui" disabled={state.dangGui} onClick={() =&gt; dispatch({ type: 'quay-lai' })}&gt;
          ← Quay lại
        &lt;/button&gt;
      )}
    &lt;/section&gt;
  );
}</code></pre>
<p><strong>A7. <code>src/components/LuongDatLich.test.tsx</code></strong></p>
<pre><code class="language-tsx">import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { useDatLichStore } from '../store/dat-lich-store';
import { LuongDatLich } from './LuongDatLich';

async function dienThongTin(user: ReturnType&lt;typeof userEvent.setup&gt;, sdt = '0901 234 567') {
  await user.type(screen.getByLabelText('Họ và tên'), 'Nguyễn Thị Ánh');
  await user.type(screen.getByLabelText('Số điện thoại'), sdt);
  await user.type(screen.getByLabelText('Ngày sinh'), '1995-03-14');
  await user.type(screen.getByLabelText('Lý do khám'), 'Bé ho khan 3 ngày');
  await user.click(screen.getByRole('button', { name: 'Tiếp tục' }));
}

test('đi đủ 4 bước ⇒ đặt được lịch, store có 1 lịch hẹn đúng khung giờ', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;LuongDatLich /&gt;);
  expect(screen.getByRole('heading', { name: 'Bước 1/4 — Chọn bác sĩ' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /BS\\. Trần Thu Hà/ }));
  expect(screen.getByRole('heading', { name: 'Bước 2/4 — Chọn giờ khám' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '14:00 · 01/10/2026' }));
  await dienThongTin(user);
  const tomTat = screen.getByRole('heading', { name: 'Bước 4/4 — Xác nhận' }).parentElement!;
  expect(within(tomTat).getByText('0901234567', { exact: false })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Xác nhận đặt lịch' }));
  expect(screen.getByRole('button', { name: 'Đang gửi…' })).toBeDisabled();
  expect(await screen.findByRole('status', {}, { timeout: 2000 })).toHaveTextContent(
    'Đã đặt lịch với BS. Trần Thu Hà lúc 14:00 · 01/10/2026.',
  );
  const lh = useDatLichStore.getState().lichHen;
  expect(lh).toHaveLength(1);
  expect(lh[0]).toMatchObject({ bacSiId: 'bs-2', khungGioId: 'bs-2-kg-3', trangThai: 'cho-xac-nhan' });
});

test('khung giờ đã kín thì không bấm được', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;LuongDatLich /&gt;);
  await user.click(screen.getByRole('button', { name: /BS\\. Nguyễn Minh An/ }));
  expect(screen.getByRole('button', { name: '09:30 · 01/10/2026 (kín)' })).toBeDisabled();
});

test('quay lại từ bước 4 ⇒ form bước 3 còn nguyên thông tin đã gõ', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;LuongDatLich /&gt;);
  await user.click(screen.getByRole('button', { name: /BS\\. Trần Thu Hà/ }));
  await user.click(screen.getByRole('button', { name: '08:00 · 01/10/2026' }));
  await dienThongTin(user);
  await user.click(screen.getByRole('button', { name: '← Quay lại' }));
  expect(screen.getByLabelText('Họ và tên')).toHaveValue('Nguyễn Thị Ánh');
  expect(screen.getByLabelText('Số điện thoại')).toHaveValue('0901234567');
});

test('máy chủ báo lỗi ⇒ ở lại bước 4, hiện lỗi, bấm lại được', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;LuongDatLich /&gt;);
  await user.click(screen.getByRole('button', { name: /BS\\. Trần Thu Hà/ }));
  await user.click(screen.getByRole('button', { name: '08:00 · 01/10/2026' }));
  await dienThongTin(user, '0999 999 999');
  await user.click(screen.getByRole('button', { name: 'Xác nhận đặt lịch' }));
  expect(await screen.findByRole('alert', {}, { timeout: 2000 })).toHaveTextContent('đang có một lịch chờ xác nhận');
  expect(screen.getByRole('button', { name: 'Xác nhận đặt lịch' })).toBeEnabled();
  expect(useDatLichStore.getState().lichHen).toHaveLength(0);
});</code></pre>
<p><strong>B5. <code>src/components/Header.tsx</code></strong></p>
<pre><code class="language-tsx">import { useDatLichStore } from '../store/dat-lich-store';

export function Header() {
  // Header ở rất xa luồng đặt lịch trong cây component — vẫn đọc được số lịch hẹn nhờ store, không cần prop nào.
  const soLichHen = useDatLichStore((s) =&gt; s.lichHen.length);
  return (
    &lt;header className="header"&gt;
      &lt;div&gt;
        &lt;h1&gt;Phòng khám An Tâm&lt;/h1&gt;
        &lt;p&gt;Mở cửa 7:30–20:00, thứ Hai đến thứ Bảy&lt;/p&gt;
      &lt;/div&gt;
      &lt;p className="huy-hieu" aria-label="Số lịch hẹn của tôi"&gt;
        Lịch hẹn của tôi: {soLichHen}
      &lt;/p&gt;
    &lt;/header&gt;
  );
}</code></pre>
<p><strong>B6. <code>src/components/Header.test.tsx</code></strong></p>
<pre><code class="language-tsx">import { act, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useDatLichStore } from '../store/dat-lich-store';
import { Header } from './Header';

test('Header đọc số lịch hẹn từ store, không cần prop', () =&gt; {
  render(&lt;Header /&gt;);
  expect(screen.getByLabelText('Số lịch hẹn của tôi')).toHaveTextContent('Lịch hẹn của tôi: 0');
  act(() =&gt;
    useDatLichStore.getState().themLichHen({
      id: 'lh-1', bacSiId: 'bs-1', khungGioId: 'bs-1-kg-1', lyDo: 'Khám', trangThai: 'cho-xac-nhan',
      benhNhan: { hoTen: 'A', soDienThoai: '0901234567', ngaySinh: '2000-01-01' },
    }),
  );
  expect(screen.getByLabelText('Số lịch hẹn của tôi')).toHaveTextContent('Lịch hẹn của tôi: 1');
});</code></pre>
<p><strong>B7. <code>src/components/LichHenCuaToi.tsx</code></strong> (mới)</p>
<pre><code class="language-tsx">import { danhSachBacSi } from '../du-lieu/bac-si';
import { hienGio, khungGioMau } from '../du-lieu/khung-gio';
import { useDatLichStore } from '../store/dat-lich-store';
import type { TrangThaiLichHen } from '../types';

const TEN_TRANG_THAI: Record&lt;TrangThaiLichHen, string&gt; = {
  'cho-xac-nhan': 'Chờ xác nhận',
  'da-xac-nhan': 'Đã xác nhận',
  'da-huy': 'Đã huỷ',
};

export function LichHenCuaToi() {
  const lichHen = useDatLichStore((s) =&gt; s.lichHen);
  return (
    &lt;section className="lich-hen" aria-label="Lịch hẹn của tôi"&gt;
      &lt;h2&gt;Lịch hẹn của tôi ({lichHen.length})&lt;/h2&gt;
      {lichHen.length === 0 ? (
        &lt;p className="goi-y"&gt;Chưa có lịch hẹn nào.&lt;/p&gt;
      ) : (
        &lt;ul&gt;
          {lichHen.map((lh) =&gt; {
            const bs = danhSachBacSi.find((b) =&gt; b.id === lh.bacSiId);
            const kg = khungGioMau.find((k) =&gt; k.id === lh.khungGioId);
            return (
              &lt;li key={lh.id}&gt;
                &lt;strong&gt;{bs?.ten}&lt;/strong&gt; · {kg ? hienGio(kg.batDau) : '—'} · {lh.benhNhan.hoTen} ·{' '}
                &lt;span className="trang-thai"&gt;{TEN_TRANG_THAI[lh.trangThai]}&lt;/span&gt;
              &lt;/li&gt;
            );
          })}
        &lt;/ul&gt;
      )}
    &lt;/section&gt;
  );
}</code></pre>
<p><strong>C1–C3.</strong> <code>src/logic/bo-loc-url.ts</code> + <code>bo-loc-url.test.ts</code>, <code>src/hooks/useBoLocUrl.ts</code> + <code>useBoLocUrl.test.tsx</code>, và <code>src/components/KhuBacSi.tsx</code> mới (bốn state còn một) — cả năm file đã in đầy đủ ở Bài 5.4.</p>
<p><strong>C4. <code>src/App.tsx</code></strong> — form chuyển từ <code>KhuBacSi</code> sang luồng đặt lịch:</p>
<pre><code class="language-tsx">import './App.css';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { KhuBacSi } from './components/KhuBacSi';
import { LichHenCuaToi } from './components/LichHenCuaToi';
import { LuongDatLich } from './components/LuongDatLich';

export default function App() {
  return (
    &lt;&gt;
      &lt;Header /&gt;
      &lt;main className="noi-dung"&gt;
        &lt;KhuBacSi /&gt;
        &lt;div className="hang-duoi"&gt;
          &lt;LuongDatLich /&gt;
          &lt;LichHenCuaToi /&gt;
        &lt;/div&gt;
      &lt;/main&gt;
      &lt;Footer /&gt;
    &lt;/&gt;
  );
}</code></pre>
<p><strong>C5. <code>src/App.css</code></strong> — thêm vào cuối:</p>
<pre><code class="language-css">/* ── Chương 5: luồng đặt lịch, lịch hẹn, huy hiệu ── */
.header { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.huy-hieu { background: #fff; color: #0e7490; font-weight: 700; border-radius: 999px; padding: 6px 14px; font-size: 14px; }
.hang-duoi { display: grid; grid-template-columns: 1fr 340px; gap: 18px; align-items: start; margin-top: 24px; }
.luong, .lich-hen { background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px 18px; }
.luong h2, .lich-hen h2 { margin: 0 0 10px; font-size: 20px; }
.luong h3 { margin: 10px 0; font-size: 16px; color: #0e7490; }
.cac-buoc { display: flex; gap: 6px; list-style: none; padding: 0; margin: 0; flex-wrap: wrap; }
.cac-buoc li { font-size: 13px; padding: 3px 10px; border-radius: 999px; background: #f1f5f9; color: #64748b; }
.cac-buoc li[aria-current='step'] { background: #0e7490; color: #fff; font-weight: 700; }
.lua-chon { display: flex; flex-wrap: wrap; gap: 8px; }
.lua-chon .nut[aria-pressed='true'] { border-color: #0e7490; background: #ecfeff; }
.lua-chon .nut:disabled { opacity: .45; cursor: not-allowed; }
.tom-tat dl { display: grid; grid-template-columns: 110px 1fr; gap: 4px 10px; margin: 0 0 12px; font-size: 14px; }
.tom-tat dt { color: #64748b; }
.tom-tat dd { margin: 0; font-weight: 600; }
.loi-chung { padding: 8px 10px; border-radius: 10px; background: #ffe4e6; color: #9f1239; font-size: 14px; }
.nut-lui { margin-top: 12px; }
.luong .form-dat-lich { margin-top: 0; }
.lich-hen ul { margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.6; }
.trang-thai { color: #b45309; font-weight: 600; }</code></pre>
<p><code>KhuBacSi.test.tsx</code> cũ của Chương 2 giữ nguyên: sáu test của nó xanh trở lại khi <code>setup.ts</code> đặt lại URL và store.</p>
</details>


<h3>Sáu sai lầm, lần cuối</h3>
${slide('rx-05', 25, 'Sai lầm hay gặp ở Chương 5')}
<p>Mỗi sai lầm dưới đây đều đã xảy ra trong lúc soạn chương này, và mỗi cái có một con số đo được trong các bài trên:</p>
<ul>
<li><strong><code>value={{ … }}</code> viết thẳng</strong> — object mới mỗi lần render; +18 lần render thẻ cho ba phím gõ (5.1).</li>
<li><strong>Mặc định của context giả vờ chạy được</strong> — thiếu provider, không lỗi, không trái tim (5.1).</li>
<li><strong>Luật rải trong nhiều <code>useState</code></strong> — xác nhận BS. Hà với khung giờ của BS. An (5.2).</li>
<li><strong>Selector Zustand trả object mới</strong> — "Maximum update depth exceeded" (5.3).</li>
<li><strong>Không đặt lại store và URL giữa các test</strong> — 4/6 test cũ đỏ dù mã đúng (5.3).</li>
<li><strong><code>pushState</code> mỗi phím</strong> — 7 mục lịch sử cho "thao vy"; và <code>pushState</code> không kèm cập nhật state thì không render lại gì cả (5.4).</li>
</ul>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Tính năng đặt lịch hay thanh toán ở FER202 thường là ba route với dữ liệu chở qua một store Redux (một reducer, hằng action, <code>connect</code>), bộ lọc danh sách nằm trong state của component, và không lưu gì cả. → Một nhóm đi làm sẽ dựng đúng như bạn vừa làm: state của luồng do chính component luồng sở hữu trong một reducer có kiểu; chỉ dữ liệu mà phần khác của app cần (lịch hẹn, yêu thích) vào một store Zustand nhỏ có <code>persist</code>; state của trang trên URL; và test đặt lại mọi thứ toàn cục giữa các lượt chạy. · <em>Vì sao:</em> mỗi mẩu state có người sở hữu hẹp nhất còn chạy được, nên một bug chỉ có một chỗ để sống, và mỗi người sở hữu có test không phụ thuộc người khác. Đó cũng là điều người phỏng vấn tìm khi họ bảo bạn "giải thích kiến trúc state của dự án".</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Hãy dẫn tôi đi qua chỗ ở của state trong dự án của bạn, và vì sao."</p>
<p>Dùng chương này làm khung câu trả lời: "Luồng đặt lịch là một <code>useReducer</code> trong component của nó — tám hành động có kiểu, reducer thuần có test, tác dụng phụ ở handler. Yêu thích và lịch hẹn đã đặt của người dùng nằm trong một store Zustand có persist, đọc qua selector hẹp, vì header, danh sách và luồng đều cần. Bộ lọc danh sách ở trên URL để link và Back chạy được. Bác sĩ đang xem là <code>useState</code> cục bộ. Dữ liệu máy chủ sẽ chuyển sang TanStack Query." Rồi nhắc một đánh đổi bạn đã đo — ví dụ selector chỉ render lại một thẻ thay vì sáu.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> thêm nút "Đặt lịch với bác sĩ này" vào <code>ChiTietBacSi</code> để mở luồng đặt lịch ở bước 2 với đúng bác sĩ đó. Khung chi tiết và luồng là họ hàng xa trong cây, và reducer của luồng là riêng của <code>LuongDatLich</code> — nên hãy quyết định thông điệp đi đường nào.</p><ol>
<li>Thêm <code>bacSiMuonDat: string | null</code> và <code>chonDeDat(id)</code> vào <code>useDatLichStore</code> (không lưu nó xuống localStorage).</li>
<li>Nút gọi <code>chonDeDat(bacSi.id)</code>. Trong <code>LuongDatLich</code>, chọn <code>bacSiMuonDat</code>; khi nó khác <code>null</code>, dispatch <code>chon-bac-si</code> rồi gọi <code>chonDeDat(null)</code>. (Nghĩ xem việc này nên nằm ở đâu: một effect phản ứng theo giá trị trong store, hay nút gọi một hành động mà luồng đăng ký nghe? Ghi lại vì sao bạn chọn.)</li>
<li>Test: mở chi tiết BS. Phạm Ngọc Lan, bấm nút, và luồng hiện "Bước 2/4 — Chọn giờ khám" với ba khung giờ của BS. Lan.</li>
</ol><p><strong>Đạt khi:</strong> <code>npx tsc -b</code> không in gì, test mới và cả 56 test có sẵn đều xanh, <code>bacSiMuonDat</code> không xuất hiện trong <code>localStorage</code>, và bạn giải thích được trong hai câu vì sao một context chứa <code>dispatch</code> cũng làm được việc này.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">state architecture (kiến trúc state)</span><span class="v">quyết định mỗi mẩu state sống ở đâu và ai được đổi nó</span></div>
<div class="kv"><span class="k">flow reducer (reducer của luồng)</span><span class="v">reducer sở hữu một quy trình nhiều bước (bước, lựa chọn, đang gửi, kết quả)</span></div>
<div class="kv"><span class="k">client state vs server state</span><span class="v">dữ liệu trình duyệt sở hữu (yêu thích, bộ lọc) và dữ liệu máy chủ sở hữu (bác sĩ, khung giờ)</span></div>
<div class="kv"><span class="k">page state (state của trang)</span><span class="v">state thuộc về URL: chia sẻ được, sống qua F5, Back hoàn tác được</span></div>
<div class="kv"><span class="k">global reset in tests (dọn toàn cục trong test)</span><span class="v">khôi phục URL, store, bộ nhớ trình duyệt sau mỗi test để các test độc lập</span></div>
<div class="kv"><span class="k">acceptance criteria (tiêu chí đạt)</span><span class="v">điều kiện kiểm được cho biết việc đã xong: test xanh, ảnh khớp</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Luồng đặt lịch là một reducer có kiểu bên trong <code>LuongDatLich</code>; lời gọi API ở lại trong handler.</li>
<li><code>useDatLichStore</code> chỉ giữ thứ mà các component xa nhau dùng chung — yêu thích và lịch hẹn — và lưu chúng lại.</li>
<li>Bộ lọc và ô tìm sống trên URL qua <code>useBoLocUrl</code>; <code>KhuBacSi</code> từ bốn <code>useState</code> còn một.</li>
<li><code>setup.ts</code> đặt lại URL, store và <code>localStorage</code> sau mỗi test — test cũ của Chương 2 xanh không sửa dòng nào.</li>
<li>22 test mới; <code>tsc</code> sạch; cả luồng kiểm trên Chromium thật, kể cả F5 và Back.</li>
<li>Chương 6 thay khung giờ mẫu và máy chủ giả bằng MSW + TanStack Query, và store thôi giữ lịch hẹn.</li>
</ul>

<a class="link-card" href="https://react.dev/learn/managing-state" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Managing State</span><span class="lc-sub">Cả chương quản lý state của hướng dẫn chính thức, từ cấu trúc tới context và reducer.</span></span></a>
<a class="link-card" href="https://react.dev/learn/choosing-the-state-structure" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Choosing the State Structure</span><span class="lc-sub">Các nguyên tắc đứng sau "mỗi mẩu state một chủ".</span></span></a>
<a class="link-card" href="https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/testing.md" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Zustand docs — Testing</span><span class="lc-sub">Giữ các store độc lập giữa các test.</span></span></a>
</div>
`,
  },
  {
    title: '5.6 — Chapter 5 quiz|||5.6 — Kiểm tra Chương 5',
    slug: 'rx-5-6-kiem-tra',
    type: 'QUIZ',
    isFreePreview: true,
    description: 'Mười câu tình huống trên đúng những gì Chương 5 đã đo: cơn bão render của context, memo không chặn context, mặc định giả, trạng thái vô lý, StrictMode gọi reducer hai lần, kiểm never, selector Zustand, useShallow, thứ tự dọn trong test và pushState.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>What Chapter 5 measured</h2>
<p class="lead">Ten questions, fifteen minutes. Most of them show a few lines of code and ask what happens — how many components re-render, what the screen shows, what ends up in <code>localStorage</code>. Every answer is something the chapter actually ran. Three of them are traps that look right until you remember a number from the lessons.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can create a context with a <code>null</code> default and a hook that throws, and explain why an inline <code>value</code> re-renders every reader — even through <code>memo</code>.</li>
<li>I can turn several related <code>useState</code> calls into a typed reducer with a <code>never</code> check, and keep the reducer pure.</li>
<li>I can build a Zustand store, read it with narrow selectors, use <code>useShallow</code> for objects, and persist chosen fields.</li>
<li>I can reset stores, the URL and <code>localStorage</code> between tests, in the right order.</li>
<li>I can keep filters in the URL with <code>URLSearchParams</code>, choose between <code>pushState</code> and <code>replaceState</code>, and react to Back.</li>
<li>I can say where each kind of state in the clinic app lives, and why.</li>
</ul>
${slide('rx-05', 26, 'Chapter 5 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Chương 5 đã đo được gì</h2>
<p class="lead">Mười câu, mười lăm phút. Phần lớn đưa vài dòng mã và hỏi chuyện gì xảy ra — bao nhiêu component render lại, màn hình hiện gì, <code>localStorage</code> chứa gì. Mọi đáp án là thứ chương đã chạy thật. Có ba câu là bẫy, trông đúng cho tới khi bạn nhớ ra một con số trong bài.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi tạo được context với mặc định <code>null</code> cùng hook biết ném lỗi, và giải thích được vì sao <code>value</code> viết thẳng làm mọi bên đọc render lại — xuyên cả <code>memo</code>.</li>
<li>Tôi biến được nhiều <code>useState</code> liên quan thành một reducer có kiểu với kiểm <code>never</code>, và giữ reducer thuần.</li>
<li>Tôi dựng được store Zustand, đọc bằng selector hẹp, dùng <code>useShallow</code> cho object, và lưu các field đã chọn.</li>
<li>Tôi đặt lại được store, URL và <code>localStorage</code> giữa các test, đúng thứ tự.</li>
<li>Tôi giữ được bộ lọc trên URL bằng <code>URLSearchParams</code>, chọn đúng giữa <code>pushState</code> và <code>replaceState</code>, và phản ứng với nút Back.</li>
<li>Tôi nói được mỗi loại state trong app phòng khám sống ở đâu, và vì sao.</li>
</ul>
${slide('rx-05', 26, 'Bảng tra nhanh Chương 5')}
</div>
`,
    quiz: {
      "timeLimitSeconds": 900,
      "questions": [
        {
          "question": "KhuDo holds tuKhoa (a search box) and yeuThich, and provides KhoContext with value={{ yeuThich, doi: … }} written inline. Six cards wrapped in memo read the context. You type 3 letters into the search box. How many extra card renders?|||KhuDo giữ tuKhoa (ô tìm) và yeuThich, và cung cấp KhoContext với value={{ yeuThich, doi: … }} viết thẳng. Sáu thẻ bọc memo đọc context. Bạn gõ 3 chữ vào ô tìm. Thẻ render thêm bao nhiêu lần?",
          "options": [
            "0 — memo skips the cards|||0 — memo bỏ qua các thẻ",
            "3 — one per keystroke|||3 — mỗi phím một lần",
            "18 — six cards, three times|||18 — sáu thẻ, ba lần",
            "6 — only the first keystroke counts|||6 — chỉ phím đầu tính"
          ],
          "correctIndex": 2,
          "explanation": "EN: Each keystroke re-renders KhuDo, the inline object is new every time, Object.is says the context changed, and every reader re-renders: measured +18 in Lesson 5.1. \"0\" is tempting because the cards are memo’d — but a context update reaches every component that reads it, through any memo (LuoiDo itself rendered only once).|||VI: Mỗi phím gõ render lại KhuDo, object viết thẳng là object mới mỗi lần, Object.is nói context đã đổi, và mọi bên đọc render lại: Bài 5.1 đo được +18. \"0\" hấp dẫn vì các thẻ có memo — nhưng cập nhật context đi tới mọi component đọc nó, xuyên qua mọi memo (bản thân LuoiDo chỉ render một lần).",
          "points": 1
        },
        {
          "question": "const C = createContext({ yeuThich: [], doi: () => {} }). A card reads it with useContext(C) and is rendered WITHOUT any provider. You click its heart twice. What happens?|||const C = createContext({ yeuThich: [], doi: () => {} }). Một thẻ đọc nó bằng useContext(C) và được render mà KHÔNG có provider nào. Bạn bấm trái tim hai lần. Chuyện gì xảy ra?",
          "options": [
            "React throws \"missing provider\"|||React ném lỗi \"thiếu provider\"",
            "Nothing: the heart stays ♡ and there is no error|||Không gì cả: tim vẫn ♡ và không có lỗi",
            "The heart becomes ♥ — the default value holds state|||Tim thành ♥ — giá trị mặc định giữ được state",
            "A warning in the console, and the heart becomes ♥|||Một cảnh báo trong console, và tim thành ♥"
          ],
          "correctIndex": 1,
          "explanation": "EN: Without a provider, useContext returns the default value — here a function that does nothing — so the click is silently lost (measured: \"sau 2 click: ♡\"). React never throws for a missing provider; that is why the lesson uses null as the default and a custom hook that throws its own message.|||VI: Không có provider, useContext trả về giá trị mặc định — ở đây là một hàm không làm gì — nên cú bấm mất đi trong im lặng (đo được: \"sau 2 click: ♡\"). React không bao giờ tự ném lỗi khi thiếu provider; vì thế bài dùng null làm mặc định cùng một hook tự ném câu lỗi của nó.",
          "points": 1
        },
        {
          "question": "A provider’s value changes. Between the provider and six cards that call use(Context) sits LuoiDo = memo(…), whose props did not change. Which components re-render?|||Value của một provider đổi. Giữa provider và sáu thẻ gọi use(Context) có LuoiDo = memo(…), props của nó không đổi. Component nào render lại?",
          "options": [
            "None — memo stops the update at LuoiDo|||Không component nào — memo chặn cập nhật tại LuoiDo",
            "Only LuoiDo|||Chỉ LuoiDo",
            "The six cards; LuoiDo is skipped|||Sáu thẻ; LuoiDo được bỏ qua",
            "LuoiDo and the six cards|||LuoiDo và sáu thẻ"
          ],
          "correctIndex": 2,
          "explanation": "EN: memo skips LuoiDo because its props are equal (measured: \"LuoiDo render 1 lan\"), but React delivers the new context value straight to every component that reads it, so the cards re-render. \"None\" is the most common wrong belief: memo does not block context.|||VI: memo bỏ qua LuoiDo vì props bằng nhau (đo được: \"LuoiDo render 1 lan\"), nhưng React đưa giá trị context mới thẳng tới mọi component đọc nó, nên các thẻ render lại. \"Không component nào\" là niềm tin sai phổ biến nhất: memo không chặn context.",
          "points": 1
        },
        {
          "question": "A flow keeps buoc, bacSiId and khungGioId in three useState. On the confirmation step (BS. An, slot bs-1-kg-1) a new shortcut runs only setBacSiId('bs-2'). What does the confirmation show?|||Một luồng giữ buoc, bacSiId và khungGioId trong ba useState. Ở bước xác nhận (BS. An, khung bs-1-kg-1), một lối tắt mới chỉ chạy setBacSiId('bs-2'). Màn xác nhận hiện gì?",
          "options": [
            "BS. Trần Thu Hà with slot bs-1-kg-1|||BS. Trần Thu Hà với khung bs-1-kg-1",
            "BS. Trần Thu Hà with no slot|||BS. Trần Thu Hà, không có khung giờ",
            "It goes back to step 2 automatically|||Tự quay về bước 2",
            "BS. Nguyễn Minh An, unchanged|||BS. Nguyễn Minh An, không đổi"
          ],
          "correctIndex": 0,
          "explanation": "EN: Nothing resets khungGioId, so the screen confirms BS. Hà in BS. An’s slot — measured in Lesson 5.2: \"Xác nhận: BS. Trần Thu Hà — khung bs-1-kg-1\". Going back to step 2 is what the reducer version does, because the rule \"new doctor ⇒ no slot\" lives in the reducer, not in each handler.|||VI: Không gì đặt lại khungGioId, nên màn hình xác nhận BS. Hà ở khung của BS. An — Bài 5.2 đo được: \"Xác nhận: BS. Trần Thu Hà — khung bs-1-kg-1\". Quay về bước 2 là việc bản reducer làm, vì luật \"bác sĩ mới ⇒ không có khung giờ\" nằm trong reducer, không nằm trong từng handler.",
          "points": 1
        },
        {
          "question": "reducer: state.lichSu.push(action.dong); return { lichSu: state.lichSu }. The component is inside StrictMode, in development. After TWO clicks on \"Ghi\", what does \"Số dòng\" show?|||reducer: state.lichSu.push(action.dong); return { lichSu: state.lichSu }. Component nằm trong StrictMode, ở chế độ dev. Sau HAI cú bấm \"Ghi\", \"Số dòng\" hiện gì?",
          "options": [
            "2|||2",
            "1|||1",
            "3|||3",
            "4|||4"
          ],
          "correctIndex": 3,
          "explanation": "EN: In development StrictMode calls the reducer twice per action; a mutating reducer pushes onto the same array both times, so two clicks gave 4 lines (without StrictMode: 2; the pure version: 2). \"2\" is what you would see in production — the bug is still there, StrictMode just makes it visible.|||VI: Ở dev, StrictMode gọi reducer hai lần cho mỗi hành động; reducer đột biến push vào cùng một mảng cả hai lần, nên hai cú bấm ra 4 dòng (không StrictMode: 2; bản thuần: 2). \"2\" là thứ bạn thấy ở production — bug vẫn ở đó, StrictMode chỉ làm nó hiện ra.",
          "points": 1
        },
        {
          "question": "A reducer ends with default: { const conSot: never = action; return conSot; }. You add | { type: 'lam-lai' } to the action union but no case. What happens?|||Một reducer kết thúc bằng default: { const conSot: never = action; return conSot; }. Bạn thêm | { type: 'lam-lai' } vào union hành động nhưng không thêm case. Chuyện gì xảy ra?",
          "options": [
            "It compiles; dispatching lam-lai crashes at runtime|||Biên dịch được; dispatch lam-lai thì sập lúc chạy",
            "npx tsc -b fails with TS2322: '{ type: \"lam-lai\"; }' is not assignable to type 'never'|||npx tsc -b báo TS2322: '{ type: \"lam-lai\"; }' is not assignable to type 'never'",
            "Nothing — TypeScript cannot check switch statements|||Không gì cả — TypeScript không kiểm được switch",
            "Only a lint warning|||Chỉ một cảnh báo của lint"
          ],
          "correctIndex": 1,
          "explanation": "EN: With every case handled, action is narrowed to never in default; an unhandled member leaves a real type there, and assigning it to never is a compile error — exactly the TS2322 printed in Lesson 5.2. The runtime-crash option is what plain JavaScript Redux gives you at best; usually it just returns the old state silently.|||VI: Khi mọi case đã xử lý, action bị thu hẹp thành never ở default; một thành viên chưa xử lý để lại một kiểu thật ở đó, và gán nó cho never là lỗi biên dịch — đúng lỗi TS2322 in ra ở Bài 5.2. Phương án \"sập lúc chạy\" là thứ Redux JavaScript thuần cho bạn trong trường hợp tốt nhất; thường nó chỉ trả state cũ trong im lặng.",
          "points": 1
        },
        {
          "question": "Six memo’d cards each read a Zustand store with (s) => s.yeuThich.includes(bacSi.id). You click the heart on ONE card. How many cards re-render?|||Sáu thẻ bọc memo, mỗi thẻ đọc store Zustand bằng (s) => s.yeuThich.includes(bacSi.id). Bạn bấm trái tim trên MỘT thẻ. Bao nhiêu thẻ render lại?",
          "options": [
            "1|||1",
            "6|||6",
            "0|||0",
            "2|||2"
          ],
          "correctIndex": 0,
          "explanation": "EN: Zustand re-renders a component only when its selector’s result changes by Object.is. Only the clicked card’s boolean changed (false → true); the other five got false again. Measured: \"+1 the\". \"6\" is the context result, and also what useYeuThichStore() without a selector gives.|||VI: Zustand chỉ render lại component khi kết quả selector của nó đổi theo Object.is. Chỉ boolean của thẻ được bấm đổi (false → true); năm thẻ kia lại nhận false. Đo được: \"+1 the\". \"6\" là kết quả của context, và cũng là thứ useYeuThichStore() không có selector cho ra.",
          "points": 1
        },
        {
          "question": "Zustand 5: const { soLuong, xoaHet } = useStore((s) => ({ soLuong: s.yeuThich.length, xoaHet: s.xoaHet })). What happens when the component renders?|||Zustand 5: const { soLuong, xoaHet } = useStore((s) => ({ soLuong: s.yeuThich.length, xoaHet: s.xoaHet })). Chuyện gì xảy ra khi component render?",
          "options": [
            "It works, just re-renders a bit more often|||Chạy được, chỉ render lại nhiều hơn một chút",
            "TypeScript rejects the selector|||TypeScript từ chối selector",
            "Error: Maximum update depth exceeded|||Lỗi: Maximum update depth exceeded",
            "soLuong and xoaHet are undefined|||soLuong và xoaHet là undefined"
          ],
          "correctIndex": 2,
          "explanation": "EN: The selector returns a new object on every call; Zustand 5 passes it to useSyncExternalStore, which sees a \"changed\" snapshot each time and loops until React stops it — the exact error measured in Lesson 5.3. \"Works, re-renders more\" was Zustand 4’s behaviour, which is why old tutorials show this pattern. Fix: useShallow, or two separate selectors.|||VI: Selector trả object mới mỗi lần gọi; Zustand 5 đưa nó cho useSyncExternalStore, thứ thấy ảnh chụp \"đã đổi\" mỗi lần và lặp cho tới khi React chặn — đúng lỗi đo ở Bài 5.3. \"Chạy được, render nhiều hơn\" là hành vi của Zustand 4, vì vậy bài hướng dẫn cũ còn dùng mẫu này. Cách chữa: useShallow, hoặc hai selector riêng.",
          "points": 1
        },
        {
          "question": "In setup.ts after each test you write: localStorage.clear(); then useDatLichStore.setState(useDatLichStore.getInitialState(), true). The store uses persist with name 'phong-kham-dat-lich'. What is localStorage.getItem('phong-kham-dat-lich') at the start of the next test?|||Trong setup.ts sau mỗi test bạn viết: localStorage.clear(); rồi useDatLichStore.setState(useDatLichStore.getInitialState(), true). Store dùng persist với name 'phong-kham-dat-lich'. Đầu test sau, localStorage.getItem('phong-kham-dat-lich') là gì?",
          "options": [
            "null|||null",
            "The initial state as JSON, written back by persist|||State ban đầu dạng JSON, do persist ghi lại",
            "The previous test’s data|||Dữ liệu của test trước",
            "It throws, because storage was cleared|||Ném lỗi, vì bộ nhớ đã bị xoá"
          ],
          "correctIndex": 1,
          "explanation": "EN: Resetting the store is itself a state change, and persist writes every change — so the key comes back as {\"state\":{\"yeuThich\":[],\"lichHen\":[]},\"version\":1}; the lesson’s test failed with exactly that. null is what you get with the right order: reset the store first, clear localStorage last.|||VI: Đặt lại store cũng là một lần đổi state, và persist ghi mọi lần đổi — nên khoá quay lại với {\"state\":{\"yeuThich\":[],\"lichHen\":[]},\"version\":1}; test trong bài đỏ đúng vì điều đó. null là thứ bạn nhận khi đúng thứ tự: đặt lại store trước, xoá localStorage sau cùng.",
          "points": 1
        },
        {
          "question": "A component computes ck from new URLSearchParams(window.location.search) during render. Its button runs window.history.pushState(null, '', '/?ck=nhi') and nothing else. After the click, the address bar shows ?ck=nhi. What does the screen show?|||Một component tính ck từ new URLSearchParams(window.location.search) trong lúc render. Nút của nó chỉ chạy window.history.pushState(null, '', '/?ck=nhi'). Sau cú bấm, thanh địa chỉ ghi ?ck=nhi. Màn hình hiện gì?",
          "options": [
            "\"Đang lọc: nhi\" — the URL changed|||\"Đang lọc: nhi\" — URL đã đổi",
            "A popstate event re-renders it with nhi|||Sự kiện popstate render lại nó với nhi",
            "An error: pushState needs a state object|||Lỗi: pushState cần một object state",
            "\"Đang lọc: tat-ca\" — React did not re-render|||\"Đang lọc: tat-ca\" — React không render lại"
          ],
          "correctIndex": 3,
          "explanation": "EN: pushState changes the address bar but fires no event and touches no React state, so nothing re-renders — measured: \"URL = ?ck=nhi | man hinh: Đang lọc: tat-ca\". popstate only fires for Back/Forward, not for pushState. useBoLocUrl pairs every history write with setSearch for this reason.|||VI: pushState đổi thanh địa chỉ nhưng không bắn sự kiện nào và không đụng state nào của React, nên không gì render lại — đo được: \"URL = ?ck=nhi | man hinh: Đang lọc: tat-ca\". popstate chỉ bắn khi Back/Forward, không bắn khi pushState. Vì thế useBoLocUrl luôn đi kèm mỗi lần ghi lịch sử với setSearch.",
          "points": 1
        }
      ]
    },
  }
  ],
};
