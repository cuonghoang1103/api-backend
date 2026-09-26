/**
 * React · Chương 11 — React bên trong (soạn 25/09/2026 theo content/courses/react/_HOP-DONG.md).
 * Mọi đoạn mã dài và mọi output trong bài lấy NGUYÊN VĂN từ dự án thử SCRATCH/rx/du-an/ch11 (react 19.3.0 · vite 8.3.1 ·
 * typescript 6.0.3 · vitest 5.0.1 · react-router 8.4.0 · @tanstack/react-query 5.103.2 · jsdom 30.1.1), chạy thật trên máy
 * dựng bài; ảnh chụp và số đo khung hình bằng Chromium thật (Playwright). Deck: scripts/slides-src/rx-11.mjs (27 slide).
 * Điểm xuất phát của 🛠: dự án sau Chương 10 (dựng lại từ sau-ch05 + phần Ch6/Ch7 cần thiết — xem bài 11.4).
 */
import { gallery, slide } from './_slides.mjs';
/* ─── Sơ đồ mermaid trong bài (≤ 10 nút, nhãn ngắn; khối EN nhãn tiếng Anh, khối VI nhãn tiếng Việt) ─── */
const H = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '&#96;').replace(/\$\{/g, '&#36;{');
/** Sơ đồ mermaid: trang học đọc textContent của <code class="language-mermaid"> rồi vẽ (LearnPageClient → mermaidRuntime). */
const MM = (src) => '<pre><code class="language-mermaid">' + H(src.trim()) + '</code></pre>';
const LM = (...dong) => MM(dong.join('\n'));
const SD = {
  /* 11.1 */
  phaVi: LM(
    'flowchart TB',
    '  A["① Trigger: bấm +1, setSoLuot(1) chỉ xếp hàng"] --> B["② Render: gọi BangDem, rồi cả 6 TheNho · 7 lần gọi hàm"]',
    '  B --> C["So cây mới với cây cũ: chỉ chữ trong p đổi 0 → 1"]',
    '  C --> D["③ Commit: đúng 1 thao tác DOM · li cũ vẫn là nút cũ"]',
    '  D --> E["④ Paint: trình duyệt vẽ lại con số"]',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class D tot',
  ),
  phaEn: LM(
    'flowchart TB',
    '  A["① Trigger: click +1, setSoLuot(1) only queues"] --> B["② Render: call BangDem, then all 6 TheNho · 7 function calls"]',
    '  B --> C["Compare new tree with old: only the text in p changes 0 → 1"]',
    '  C --> D["③ Commit: exactly 1 DOM operation · the old li is the same node"]',
    '  D --> E["④ Paint: the browser redraws the number"]',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class D tot',
  ),
  soSanhVi: LM(
    'flowchart TB',
    '  A["Render mới, cùng một vị trí trong cây"] --> B{"type giống lần trước?"}',
    '  B -->|"giống: div vẫn là div"| C["Giữ nút DOM và component, chỉ sửa prop đổi"]',
    '  C --> D["State bên trong còn: chữ đã gõ vẫn còn"]',
    '  B -->|"khác: div thành section"| E["Gỡ cả nhánh cũ: effect dọn, state mất"]',
    '  E --> F["Dựng nhánh mới từ đầu: ô ghi chú trống, nút DOM mới"]',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  class F xau',
  ),
  soSanhEn: LM(
    'flowchart TB',
    '  A["New render, same spot in the tree"] --> B{"Same type as last time?"}',
    '  B -->|"same: div is still div"| C["Keep the DOM node and component, update changed props"]',
    '  C --> D["State inside survives: typed text is still there"]',
    '  B -->|"different: div becomes section"| E["Unmount the old branch: effects clean up, state lost"]',
    '  E --> F["Mount a new branch: empty note box, new DOM node"]',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  class F xau',
  ),
  fiberVi: LM(
    'flowchart TB',
    '  BD["BangDem · memoizedState: soLuot = 0"] -->|"child"| S["section"]',
    '  S -->|"child"| P["p"]',
    '  P -->|"sibling"| BT["button"]',
    '  BT -->|"sibling"| U["ul"]',
    '  U -->|"child"| T1["TheNho key=bs-1"]',
    '  T1 -->|"sibling"| T2["TheNho key=bs-2 …"]',
    '  T1 -->|"child"| LI["li"]',
    '  LI -. "return (lên cha)" .-> T1',
    '  BD -. "alternate" .- BD2["Bản work-in-progress của BangDem · soLuot = 1"]',
  ),
  fiberEn: LM(
    'flowchart TB',
    '  BD["BangDem · memoizedState: soLuot = 0"] -->|"child"| S["section"]',
    '  S -->|"child"| P["p"]',
    '  P -->|"sibling"| BT["button"]',
    '  BT -->|"sibling"| U["ul"]',
    '  U -->|"child"| T1["TheNho key=bs-1"]',
    '  T1 -->|"sibling"| T2["TheNho key=bs-2 …"]',
    '  T1 -->|"child"| LI["li"]',
    '  LI -. "return (to parent)" .-> T1',
    '  BD -. "alternate" .- BD2["Work-in-progress copy of BangDem · soLuot = 1"]',
  ),
  /* 11.2 */
  danhTinhVi: LM(
    'flowchart TB',
    '  A["Render mới ở cùng chỗ"] --> B{"Cùng type, cùng vị trí, cùng key?"}',
    '  B -->|"cả ba giống"| C["Vẫn là component cũ: giữ state, chỉ đổi props"]',
    '  C --> C2["Không key: ô của Huy vẫn chứa ghi chú của An"]',
    '  B -->|"key đổi: bs-1 thành bs-5"| D["Gỡ GhiChu của An: state mất, effect dọn"]',
    '  D --> E["Dựng GhiChu mới cho Huy: ô trống"]',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class C2 xau',
    '  class E tot',
  ),
  danhTinhEn: LM(
    'flowchart TB',
    '  A["New render in the same spot"] --> B{"Same type, same position, same key?"}',
    '  B -->|"all three the same"| C["Still the old component: keep state, update props"]',
    '  C --> C2["No key: Huy box still holds the note for An"]',
    '  B -->|"key changes: bs-1 to bs-5"| D["Unmount the GhiChu of An: state lost, effect cleaned up"]',
    '  D --> E["Mount a new GhiChu for Huy: empty box"]',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class C2 xau',
    '  class E tot',
  ),
  indexVi: LM(
    'flowchart TB',
    '  subgraph truoc["Trước khi xoá An"]',
    '    direction TB',
    '    K0["key 0 · An · tái khám"] ~~~ K1["key 1 · Hà · bé sốt"] ~~~ K2["key 2 · Bảo"]',
    '  end',
    '  subgraph sau["key = index, sau khi xoá"]',
    '    direction TB',
    '    N0["key 0 · props Hà · state tái khám"] ~~~ N1["key 1 · props Bảo · state bé sốt"] ~~~ N2["key 2 · bị gỡ"]',
    '  end',
    '  truoc -->|"key = index"| sau',
    '  truoc -->|"key = id"| ID["Chỉ gỡ đúng hàng bs-1 · Hà, Bảo giữ ghi chú của mình"]',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class N0,N1 xau',
    '  class ID tot',
  ),
  indexEn: LM(
    'flowchart TB',
    '  subgraph truoc["Before deleting An"]',
    '    direction TB',
    '    K0["key 0 · An · tái khám"] ~~~ K1["key 1 · Hà · bé sốt"] ~~~ K2["key 2 · Bảo"]',
    '  end',
    '  subgraph sau["key = index, after deleting"]',
    '    direction TB',
    '    N0["key 0 · props Hà · state tái khám"] ~~~ N1["key 1 · props Bảo · state bé sốt"] ~~~ N2["key 2 · unmounted"]',
    '  end',
    '  truoc -->|"key = index"| sau',
    '  truoc -->|"key = id"| ID["Only the bs-1 row is removed · Hà, Bảo keep their own notes"]',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class N0,N1 xau',
    '  class ID tot',
  ),
  resetVi: LM(
    'flowchart TB',
    '  subgraph ef["Reset bằng useEffect"]',
    '    direction TB',
    '    E1["Đổi sang bs-5"] --> E2["Render 1: bs-5 với chữ cũ ab · SAI một nhịp"]',
    '    E2 --> E3["Commit, effect gọi setChu rỗng"]',
    '    E3 --> E4["Render 2: bs-5 trống"]',
    '  end',
    '  subgraph ky["Reset bằng key"]',
    '    direction TB',
    '    K1["Đổi key sang bs-5"] --> K2["Gỡ cái cũ, mount cái mới"]',
    '    K2 --> K3["Render 1: bs-5 trống · ĐÚNG ngay"]',
    '  end',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class E2 xau',
    '  class K3 tot',
  ),
  resetEn: LM(
    'flowchart TB',
    '  subgraph ef["Reset with useEffect"]',
    '    direction TB',
    '    E1["Switch to bs-5"] --> E2["Render 1: bs-5 with old text ab · WRONG for one beat"]',
    '    E2 --> E3["Commit, effect calls setChu empty"]',
    '    E3 --> E4["Render 2: bs-5 empty"]',
    '  end',
    '  subgraph ky["Reset with key"]',
    '    direction TB',
    '    K1["Key changes to bs-5"] --> K2["Unmount the old, mount a new one"]',
    '    K2 --> K3["Render 1: bs-5 empty · RIGHT at once"]',
    '  end',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class E2 xau',
    '  class K3 tot',
  ),
  /* 11.3 */
  strictVi: LM(
    'flowchart TB',
    '  subgraph dev["Dev + StrictMode, lúc mount"]',
    '    direction TB',
    '    D1["Thân component chạy 2 lần, khởi tạo useState 2 lần"] --> D2["effect: chạy"]',
    '    D2 --> D3["effect: dọn"]',
    '    D3 --> D4["effect: chạy lại"]',
    '  end',
    '  subgraph prod["Production · vite build"]',
    '    direction TB',
    '    P1["render 1 lần"] --> P2["effect: chạy 1 lần"]',
    '  end',
  ),
  strictEn: LM(
    'flowchart TB',
    '  subgraph dev["Dev + StrictMode, at mount"]',
    '    direction TB',
    '    D1["Component body runs twice, useState initialiser twice"] --> D2["effect: run"]',
    '    D2 --> D3["effect: clean up"]',
    '    D3 --> D4["effect: run again"]',
    '  end',
    '  subgraph prod["Production · vite build"]',
    '    direction TB',
    '    P1["render once"] --> P2["effect: runs once"]',
    '  end',
  ),
  refVi: LM(
    'flowchart TB',
    '  A{"Giá trị có hiện trên màn hình?"} -->|"có"| S["useState: đổi là render lại · bấm 3 lần: 4 render, màn hình đúng"]',
    '  A -->|"không, chỉ cần nhớ giữa các lần render"| R["useRef: đổi ref.current KHÔNG render · id hẹn giờ, cờ đang gửi, nút DOM"]',
    '  R --> W["Đọc, ghi ref trong handler và effect · không trong lúc render"]',
  ),
  refEn: LM(
    'flowchart TB',
    '  A{"Is the value shown on screen?"} -->|"yes"| S["useState: changing it re-renders · 3 clicks: 4 renders, screen right"]',
    '  A -->|"no, only remembered between renders"| R["useRef: changing ref.current does NOT render · timer id, sending flag, DOM node"]',
    '  R --> W["Read and write refs in handlers and effects · not during render"]',
  ),
  layoutVi: LM(
    'flowchart TB',
    '  A["Rê chuột: setMo(true), render chậm 100 ms, top = 0"] --> B["Commit: tooltip vào DOM"]',
    '  B --> C{"Đo vị trí bằng hook nào?"}',
    '  C -->|"useLayoutEffect"| D["Đo ngay, setTop(117), render + commit lại, vẫn trước khi vẽ"]',
    '  D --> E["Paint lần đầu: đã ở top 117"]',
    '  C -->|"useEffect"| F["Trình duyệt vẽ trước: tooltip ở top 0, sai chỗ"]',
    '  F --> G["Effect đo, setTop(117), vẽ lại: nháy"]',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  class E tot',
    '  class F xau',
  ),
  layoutEn: LM(
    'flowchart TB',
    '  A["Hover: setMo(true), 100 ms slow render, top = 0"] --> B["Commit: tooltip in the DOM"]',
    '  B --> C{"Which hook measures it?"}',
    '  C -->|"useLayoutEffect"| D["Measure now, setTop(117), render + commit again, still before paint"]',
    '  D --> E["First paint: already at top 117"]',
    '  C -->|"useEffect"| F["Browser paints first: tooltip at top 0, wrong place"]',
    '  F --> G["Effect measures, setTop(117), repaint: a flicker"]',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  class E tot',
    '  class F xau',
  ),
  /* 11.4 */
  portalVi: LM(
    'flowchart TB',
    '  subgraph rt["Cây React"]',
    '    direction TB',
    '    R1["TheCoHop"] --> R2["article.the-bi-cat"]',
    '    R2 --> R3["Hop · qua createPortal"]',
    '  end',
    '  subgraph dt["Cây DOM"]',
    '    direction TB',
    '    D0["body"] --> D1["div root"]',
    '    D1 --> D2["article.the-bi-cat · overflow hidden"]',
    '    D0 --> D3["div role=dialog · con trực tiếp của body"]',
    '  end',
    '  R3 -. "vẽ vào" .-> D3',
  ),
  portalEn: LM(
    'flowchart TB',
    '  subgraph rt["React tree"]',
    '    direction TB',
    '    R1["TheCoHop"] --> R2["article.the-bi-cat"]',
    '    R2 --> R3["Hop · via createPortal"]',
    '  end',
    '  subgraph dt["DOM tree"]',
    '    direction TB',
    '    D0["body"] --> D1["div root"]',
    '    D1 --> D2["article.the-bi-cat · overflow hidden"]',
    '    D0 --> D3["div role=dialog · direct child of body"]',
    '  end',
    '  R3 -. "drawn into" .-> D3',
  ),
  noiBotVi: LM(
    'flowchart TB',
    '  A["Bấm OK trong hộp mở qua portal"] --> B["onClick của nút OK: hộp: bấm OK"]',
    '  B --> C{"Div của hộp có stopPropagation?"}',
    '  C -->|"không"| D["Nổi bọt theo CÂY REACT lên div của thẻ"]',
    '  D --> E["thẻ: onClick (chọn thẻ) · dù trong DOM hộp nằm dưới body"]',
    '  C -->|"có"| F["Dừng ở hộp, thẻ không nhận gì"]',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class E xau',
    '  class F tot',
  ),
  noiBotEn: LM(
    'flowchart TB',
    '  A["Click OK in a dialog opened through a portal"] --> B["OK button onClick: hộp: bấm OK"]',
    '  B --> C{"Does the dialog div call stopPropagation?"}',
    '  C -->|"no"| D["Bubbles through the REACT tree up to the card div"]',
    '  D --> E["thẻ: onClick (chọn thẻ) · although in the DOM the dialog is under body"]',
    '  C -->|"yes"| F["Stops at the dialog, the card gets nothing"]',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class E xau',
    '  class F tot',
  ),
  batLoiVi: LM(
    'flowchart TB',
    '  A["Một component ném lỗi"] --> B{"Ném lúc nào?"}',
    '  B -->|"lúc render, lifecycle, effect"| C{"Có ranh giới lỗi phía trên?"}',
    '  C -->|"có"| D["Ranh giới gần nhất vẽ: Phần này gặp sự cố · phần khác vẫn chạy"]',
    '  C -->|"không"| E["React gỡ cả cây: trang trắng"]',
    '  B -->|"trong onClick, setTimeout, Promise"| F["Không qua pha render: ranh giới KHÔNG bắt"]',
    '  F --> G["Lỗi ra window, giao diện đứng yên · xử lý tại chỗ trong handler"]',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class E xau',
    '  class D tot',
  ),
  batLoiEn: LM(
    'flowchart TB',
    '  A["A component throws"] --> B{"When?"}',
    '  B -->|"while rendering, lifecycle, effect"| C{"Is there an error boundary above?"}',
    '  C -->|"yes"| D["Nearest boundary draws: Phần này gặp sự cố · the rest still works"]',
    '  C -->|"no"| E["React unmounts the whole tree: blank page"]',
    '  B -->|"in onClick, setTimeout, a Promise"| F["No render phase: the boundary does NOT catch it"]',
    '  F --> G["Error goes to window, UI unchanged · handle it in the handler"]',
    '  classDef xau fill:#3a0d0d,stroke:#f85149,color:#fff',
    '  classDef tot fill:#0d2a1a,stroke:#3fb950,color:#fff',
    '  class E xau',
    '  class D tot',
  ),
  /* 11.5 */
  nhiemVuVi: LM(
    'flowchart TB',
    '  BC["BoCuc · RanhGioiLoi resetKeys = pathname, onThuLai = reset · ④"] --> O["Outlet"]',
    '  O --> CT["TrangChiTietBacSi"]',
    '  CT --> H2["h2 tên bác sĩ: useRef + focus · ②"]',
    '  CT --> DL["DatLichVoiBacSi key = bacSi.id · ①"]',
    '  DL --> CTH["ChuThich: portal + useLayoutEffect · ⑤"]',
    '  O --> LH["LichHenCuaToi"]',
    '  LH --> HX["HopXacNhan: portal vào body · ③"]',
  ),
  nhiemVuEn: LM(
    'flowchart TB',
    '  BC["BoCuc · RanhGioiLoi resetKeys = pathname, onThuLai = reset · ④"] --> O["Outlet"]',
    '  O --> CT["TrangChiTietBacSi"]',
    '  CT --> H2["doctor-name h2: useRef + focus · ②"]',
    '  CT --> DL["DatLichVoiBacSi key = bacSi.id · ①"]',
    '  DL --> CTH["ChuThich: portal + useLayoutEffect · ⑤"]',
    '  O --> LH["LichHenCuaToi"]',
    '  LH --> HX["HopXacNhan: portal into body · ③"]',
  ),
  loi500Vi: LM(
    'sequenceDiagram',
    '  participant U as Người dùng',
    '  participant Q as useChiTietBacSi',
    '  participant R as RanhGioiLoi trong BoCuc',
    '  U->>Q: mở /bac-si/bs-1?loi=chi-tiet',
    '  Q->>Q: API trả 500, TanStack thử lại 3 lần (khoảng 8,5 s)',
    '  Q->>R: throwOnError (mọi lỗi trừ 404): ném lúc render',
    '  R-->>U: Phần này gặp sự cố · header, menu vẫn chạy',
    '  U->>R: bấm Tải lại phần này',
    '  R->>Q: reset() của useQueryErrorResetBoundary, gọi API lại',
    '  Note over U,R: Bấm sang trang khác: resetKeys = pathname tự xoá lỗi',
  ),
  loi500En: LM(
    'sequenceDiagram',
    '  participant U as User',
    '  participant Q as useChiTietBacSi',
    '  participant R as RanhGioiLoi in BoCuc',
    '  U->>Q: open /bac-si/bs-1?loi=chi-tiet',
    '  Q->>Q: API returns 500, TanStack retries 3 times (about 8.5 s)',
    '  Q->>R: throwOnError (every error but 404): throws while rendering',
    '  R-->>U: Phần này gặp sự cố · header, menu still work',
    '  U->>R: click Tải lại phần này',
    '  R->>Q: reset() from useQueryErrorResetBoundary, API called again',
    '  Note over U,R: Navigate to another page: resetKeys = pathname clears the error',
  ),
};

export default {
  title: 'Chapter 11 — React under the hood|||Chương 11 — React bên trong',
  description: 'Cái React làm giữa setState và màn hình: element, render và commit, reconciliation và fiber; key quyết định giữ hay vứt state; StrictMode chạy hai lần; useRef, focus, useLayoutEffect; portal và error boundary — mọi con số đo bằng Vitest và Chromium thật, và năm nâng cấp cho app đặt lịch.',
  lessons: [
  {
    title: '11.0 — Chapter 11 slides: React under the hood in pictures|||11.0 — Slide Chương 11: React bên trong bằng hình',
    slug: 'rx-11-0-slides',
    type: 'DOCUMENT',
    isFreePreview: true,
    description: 'Cả Chương 11 trong 27 slide: bốn pha cập nhật, fiber, key và danh tính, StrictMode, useRef, useLayoutEffect, portal, error boundary và năm việc tự gõ cho dự án.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Slides</span>
<h2>The whole chapter in 27 slides</h2>
<p class="lead">Ten chapters taught you to <em>use</em> React. This one lifts the lid: what happens between your <code>setState</code> call and the screen changing, why React sometimes keeps a component's state and sometimes throws it away without warning, why everything "runs twice" in development, and how to stop one small error from blanking the whole page. This is the part mid-level interviews ask about most — and it explains most of the "weird" bugs you have met since Chapter 1.</p>
<p>Slides 3–8 belong to Lesson 11.1 (elements, the four phases, reconciliation measured with a MutationObserver, fiber, batching), 9–14 to 11.2 (keys and identity, a real bug in the booking app, index keys, nested component definitions, Activity), 15–19 to 11.3 (StrictMode, useRef, DOM refs, useLayoutEffect), 20–24 to 11.4 (portals, the cancel-confirmation dialog, error boundaries); 25 and 27 belong to Lesson 11.5, where you build the five upgrades into the app (common mistakes and the keep-building checklist); slide 26 is the cheat sheet for the quiz. Every number is real: measured on 25 September 2026 with React 19.3.0, Vitest 5.0.1 and jsdom 30.1.1, plus a real Chromium driven by Playwright for the frame timing, the StrictMode logs and the screenshots. Two results are worth a second look: seven components re-render while the DOM changes exactly one text node (slide 5), and the same tooltip paints its first frame in the wrong place 20 times out of 20 with <code>useEffect</code> when rendering is slow, and 0 out of 20 with <code>useLayoutEffect</code> (slide 19).</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Slide</span>
<h2>Cả chương trong 27 slide</h2>
<p class="lead">Mười chương trước dạy bạn <em>dùng</em> React. Chương này mở nắp máy: chuyện gì xảy ra giữa lúc bạn gọi <code>setState</code> và lúc màn hình đổi, vì sao React có lúc giữ state của một component và có lúc vứt đi không báo trước, vì sao ở chế độ dev mọi thứ "chạy hai lần", và làm sao để một lỗi nhỏ không xoá trắng cả trang. Đây là phần mà phỏng vấn lên middle hay hỏi nhất — và cũng là phần giải thích được phần lớn các bug "khó hiểu" bạn đã gặp từ Chương 1.</p>
<p>Slide 3–8 thuộc Bài 11.1 (element, bốn pha, reconciliation đo bằng MutationObserver, fiber, batching), 9–14 thuộc 11.2 (key và danh tính, bug thật của app đặt lịch, key = index, component khai lồng, Activity), 15–19 thuộc 11.3 (StrictMode, useRef, ref tới DOM, useLayoutEffect), 20–24 thuộc 11.4 (portal, hộp xác nhận huỷ lịch, error boundary); 25 và 27 thuộc Bài 11.5, nơi bạn tự dựng năm nâng cấp vào app (sai lầm hay gặp và danh sách tự gõ tiếp dự án); slide 26 là bảng tra nhanh cho bài kiểm tra. Mọi con số là THẬT: đo ngày 25/09/2026 bằng React 19.3.0, Vitest 5.0.1 và jsdom 30.1.1, cộng một Chromium thật do Playwright điều khiển cho phần khung hình, log StrictMode và ảnh chụp. Hai kết quả đáng nhìn hai lần: bảy component render lại mà DOM chỉ đổi đúng một nút chữ (slide 5), và cùng một tooltip, dùng <code>useEffect</code> thì 20/20 lần khung hình đầu tiên vẽ sai chỗ khi render chậm, dùng <code>useLayoutEffect</code> thì 0/20 (slide 19).</p>
</div>
${gallery('rx-11', [[1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'JSX tạo object mô tả'], [4, 'Bốn pha: Trigger, Render, Commit, Paint'], [5, 'Bảy component render lại, DOM đổi một chỗ'], [6, 'Khác loại thẻ: vứt cả nhánh'], [7, 'Fiber: child, sibling, return'], [8, 'Batching'], [9, 'State gắn với vị trí'], [10, 'Đổi key là gỡ cũ, dựng mới'], [11, 'Bug thật: trang BS. Huy báo đã gửi'], [12, 'key = index: ghi chú trượt'], [13, 'Component khai trong component'], [14, 'Reset bằng key, ẩn bằng Activity'], [15, 'StrictMode: chạy hai lần ở dev'], [16, 'StrictMode bắt effect quên dọn'], [17, 'useRef: nhớ mà không render'], [18, 'ref tới DOM: focus tiêu đề'], [19, 'useLayoutEffect: đo trước khi vẽ'], [20, 'Portal thoát overflow: hidden'], [21, 'Sự kiện nổi bọt theo cây React'], [22, 'Hộp xác nhận huỷ lịch'], [23, 'Không ranh giới lỗi: trắng trang'], [24, 'Ranh giới lỗi bắt gì'], [25, 'Sai lầm hay gặp'], [26, 'Bảng tra nhanh'], [27, 'Tự gõ tiếp dự án']])}
`,
  },
  {
    title: '11.1 — How React updates the screen: elements, render and commit, reconciliation, fiber|||11.1 — React cập nhật màn hình thế nào: element, render và commit, reconciliation, fiber',
    slug: 'rx-11-1-virtual-dom',
    type: 'LESSON',
    isFreePreview: true,
    description: 'JSX chỉ là object mô tả; bốn pha Trigger → Render → Commit → Paint; đo bằng MutationObserver thấy 7 component render lại mà DOM chỉ đổi 1 nút chữ; khác loại thẻ là mất state; nhìn trộm fiber và cặp current/work-in-progress; batching.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>How React updates the screen: elements, render and commit, reconciliation, fiber</h2>
<p class="lead">You have written <code>setSoLuot(soLuot + 1)</code> a hundred times and watched the screen follow. This lesson slows down at exactly that moment: which functions React calls, what it compares with what, and how many places in the DOM it finally touches. No guessing — we count. A <code>MutationObserver</code> (the browser's DOM-change watcher) will show seven components running again while the DOM changes exactly <strong>one</strong> text node. Understand that number and you understand most of what people call "the virtual DOM".</p>

<p>Every example lives in <code>src/vi-du/bai1.tsx</code> of a test project copied from the clinic app (React 19.3.0, React DOM 19.3.0, Vitest 5.0.1, jsdom 30.1.1, TypeScript 6.0.3). The grey boxes are REAL output of <code>npx vitest run src/vi-du/bai1.test.tsx --reporter=verbose</code>, pasted as it ran on 25 September 2026. To know how many times a component runs, the examples use a tiny counter: a <code>Map</code> from name to number, incremented at the top of the component. Writing to an outside variable during render is exactly what Lesson 2.1 told you not to do — it is acceptable here because it only <em>observes</em> and never feeds back into what the component draws.</p>

<h3>Two ways to draw a UI: command the DOM, or describe it and let React work it out</h3>
<p>Before React, updating a UI meant <strong>commanding</strong> the DOM (Document Object Model — the tree of HTML nodes the browser keeps in memory): find this element, change that text, add an <code>&lt;li&gt;</code>, remove a class. Section 0 showed how that breaks: forget one command and the screen drifts away from the data. React changes the mindset: you only <strong>describe</strong> what the UI should look like for the current data — "with <code>soLuot = 3</code> there is a paragraph saying <em>Lượt xem: 3</em> and six doctor cards" — and React works out what to change in the DOM. People summarise this as <code>UI = f(state)</code>: the UI is a function of state.</p>
<p>But "React works it out" is not magic. It is a specific algorithm following specific rules, and those rules explain why your state sometimes disappears, why <code>key</code> matters, and why things "run twice". This lesson is the map of that algorithm.</p>

<h3>JSX only creates a description object — there is no DOM yet</h3>
${slide('rx-11', 3, 'JSX only creates a description object — no DOM yet')}
<p>Start with the smallest brick. Here is a trimmed doctor card with the counter attached:</p>
<pre><code class="language-tsx">/** Bộ đếm số lần mỗi component CHẠY (render). Chỉ để quan sát — không ảnh hưởng thứ được vẽ ra. */
export const demRender = new Map&lt;string, number&gt;();
const dem = (ten: string) =&gt; demRender.set(ten, (demRender.get(ten) ?? 0) + 1);

/* ───────── 1. JSX chỉ là một object mô tả ───────── */
export function TheNho({ bacSi }: { bacSi: BacSi }) {
  dem('TheNho');
  return (
    &lt;li&gt;
      {bacSi.ten} · {bacSi.namKinhNghiem} năm
    &lt;/li&gt;
  );
}</code></pre>
<p>And here is a test that only <em>creates</em> an element from JSX, without rendering anything:</p>
<pre><code class="language-tsx">test('JSX chỉ tạo ra một object — chưa có DOM nào', () =&gt; {
  const el = &lt;TheNho bacSi={danhSachBacSi[1]} /&gt;;
  console.info('[element] kiểu:', typeof el, '| khoá:', Object.keys(el).join(', '));
  console.info('[element] type là hàm:', typeof el.type === 'function' ? (el.type as { name: string }).name : el.type, '| props.bacSi.id =', (el.props as { bacSi: { id: string } }).bacSi.id);
  console.info('[element] TheNho đã chạy chưa?', demRender.get('TheNho') ?? 0, 'lần');
  expect(demRender.get('TheNho')).toBeUndefined();
});</code></pre>
<div class="out">[element] kiểu: object | khoá: $$typeof, type, key, props, _owner, _store
[element] type là hàm: TheNho | props.bacSi.id = bs-2
[element] TheNho đã chạy chưa? 0 lần</div>
<p>(The log is in Vietnamese: "kiểu" = type, "khoá" = keys, "đã chạy chưa? 0 lần" = has it run yet? 0 times.) Three things worth pausing on:</p>
<ol>
<li><strong>JSX draws nothing.</strong> <code>&lt;TheNho bacSi={…} /&gt;</code> is compiled by the build tool (esbuild/Babel inside Vite) into a function call like <code>jsx(TheNho, { bacSi: … })</code>, and that call returns a <strong>plain object</strong>. React calls this object an <strong>element</strong>: a note saying "a <code>TheNho</code> with these props goes here".</li>
<li><strong><code>type</code> is the <code>TheNho</code> function itself, but it has not been called.</strong> The counter is still 0. Calling <code>TheNho</code> (that is, <em>rendering</em> it) is React's job, at a time React chooses.</li>
<li><strong><code>$$typeof</code></strong> is a <code>Symbol</code> marking "this is a genuine React element". Symbols cannot live in JSON, so a strange object read from an API cannot pretend to be an element and smuggle HTML into the page. <code>_owner</code> and <code>_store</code> exist only in development builds, for warnings and DevTools.</li>
</ol>
<div class="callout"><p><strong>JS quick reminder — <code>Object.keys</code>, <code>typeof</code>, <code>??</code>.</strong> <code>Object.keys(o)</code> returns an array of an object's property names. <code>typeof x</code> returns a string naming the type: <code>'object'</code>, <code>'function'</code>, <code>'string'</code>… <code>a ?? b</code> ("nullish coalescing") means "take <code>a</code>, but if <code>a</code> is <code>null</code> or <code>undefined</code>, take <code>b</code>" — here: print 0 when there is no count yet.</p></div>
<p>Because an element is just data, a component is really a function that <strong>returns descriptive data</strong>. Your whole UI, at each render, is a tree of such objects. From here on, everything React does is: take the new description tree, compare it with the previous one, and fix the real DOM to match.</p>

<h3>The four phases of every update: Trigger → Render → Commit → Paint</h3>
${slide('rx-11', 4, 'Every update goes through four phases — only phase ③ touches the DOM')}
<p>react.dev splits an update into three steps (trigger, render, commit); the browser adds a fourth, painting. Name them clearly, because interviews and technical articles use exactly these words:</p>
<ol>
<li><strong>Trigger.</strong> There are two reasons for React to work: the initial render (<code>createRoot(…).render(&lt;App /&gt;)</code> in <code>main.tsx</code>), and a component's state changing (<code>setState</code>). Calling <code>setState</code> redraws nothing immediately; it <em>queues</em> a render.</li>
<li><strong>Render (in memory).</strong> React <em>calls the component function</em> whose state changed, gets a new element tree, then calls the child components in that tree, recursively. This phase is pure computation: no DOM, no API calls. It is also when React <strong>compares</strong> the new tree with the old one.</li>
<li><strong>Commit.</strong> React applies the differences it found to the real DOM: change text, add, remove, set attributes — and <em>only</em> where something differs. Then it runs refs and effects.</li>
<li><strong>Paint.</strong> The browser sees the DOM changed, recomputes layout and draws pixels. This phase is not React's; React only decides when to hand work back to the browser.</li>
</ol>
<p>The most important consequence: <strong>"render" does not mean "update the screen"</strong>. A component can render ten times without the DOM changing a single byte, because each time it returns the same description. When a colleague says "this component re-renders too much", the first question should be: <em>renders</em> a lot, or <em>commits</em> a lot? The two have very different costs.</p>

<h3>Measured: seven components re-render, the DOM changes exactly one text node</h3>
${slide('rx-11', 5, 'Seven components re-render, the DOM changes exactly one text node')}
<p>The test component: a view counter next to the list of six doctors.</p>
<pre><code class="language-tsx">/* ───────── 2. Render lại cả 7 component, nhưng DOM chỉ đổi một chỗ ───────── */
export function BangDem() {
  dem('BangDem');
  const [soLuot, setSoLuot] = useState(0);
  return (
    &lt;section&gt;
      &lt;p&gt;Lượt xem: {soLuot}&lt;/p&gt;
      &lt;button type="button" onClick={() =&gt; setSoLuot(soLuot + 1)}&gt;
        +1 lượt xem
      &lt;/button&gt;
      &lt;ul&gt;
        {danhSachBacSi.map((bs) =&gt; (
          &lt;TheNho key={bs.id} bacSi={bs} /&gt;
        ))}
      &lt;/ul&gt;
    &lt;/section&gt;
  );
}</code></pre>
<p>The test clicks "+1 lượt xem" once. Before clicking, it clears the render counter and attaches a <code>MutationObserver</code> to the container — a standard browser API (jsdom has it too) that calls your function whenever the DOM below is modified: nodes added/removed (<code>childList</code>), text changed (<code>characterData</code>), attributes changed (<code>attributes</code>). React cannot hide any change from it.</p>
<pre><code class="language-tsx">test('bấm +1: 7 component render lại nhưng DOM chỉ đổi một nút chữ', async () =&gt; {
  const user = userEvent.setup();
  const { container } = render(&lt;BangDem /&gt;);
  const theDau = container.querySelector('li');
  demRender.clear();

  const thayDoi: string[] = [];
  const quanSat = new MutationObserver((ds) =&gt; {
    for (const m of ds) thayDoi.push(&#96;&#36;{m.type}: "&#36;{m.oldValue}" → "&#36;{m.target.textContent}"&#96;);
  });
  quanSat.observe(container, { subtree: true, childList: true, characterData: true, characterDataOldValue: true, attributes: true });

  await user.click(screen.getByRole('button', { name: '+1 lượt xem' }));
  await act(async () =&gt; {}); // chờ MutationObserver giao bản ghi
  quanSat.disconnect();

  console.info('[render] BangDem:', demRender.get('BangDem'), '| TheNho:', demRender.get('TheNho'));
  console.info('[DOM] số thay đổi:', thayDoi.length, '|', thayDoi.join(' ; '));
  console.info('[DOM] thẻ &lt;li&gt; đầu tiên vẫn là NÚT CŨ?', container.querySelector('li') === theDau);
  expect(thayDoi).toHaveLength(1);
});</code></pre>
<div class="out">[render] BangDem: 1 | TheNho: 6
[DOM] số thay đổi: 1 | characterData: "0" → "1"
[DOM] thẻ &lt;li&gt; đầu tiên vẫn là NÚT CŨ? true</div>
<div class="callout"><p><strong>JS quick reminder — <code>Map</code>, template literals, <code>===</code> between objects.</strong> <code>new Map()</code> is a key → value table; <code>.get(k)</code> reads, <code>.set(k, v)</code> writes, <code>.clear()</code> empties it. A string in backticks with <code>&#36;{…}</code> inside is a <em>template literal</em>: it inserts values into the string. And <code>a === b</code> between two objects/DOM nodes asks "is this <strong>the same</strong> object in memory" — not "do they look alike".</p></div>
<p><strong>Step by step</strong> — what happens when you click:</p>
<ol>
<li><em>Trigger:</em> <code>onClick</code> calls <code>setSoLuot(0 + 1)</code>. React marks <code>BangDem</code> as needing a render.</li>
<li><em>Render:</em> React calls <code>BangDem</code> again (counter: 1). It returns a new tree: <code>&lt;p&gt;Lượt xem: 1&lt;/p&gt;</code>, the button, and six <code>&lt;TheNho&gt;</code> elements. Because the parent re-rendered, React also calls <strong>all six</strong> <code>TheNho</code> (counter: 6) — by default, children re-render whenever their parent re-renders, <em>whether or not their props changed</em>.</li>
<li><em>Compare:</em> React compares each new element with the old one at the same spot. The paragraph: same <code>&lt;p&gt;</code>, text changed from <code>0</code> to <code>1</code>. The button: identical. The six cards: <code>&lt;li&gt;</code> with exactly the same text as before.</li>
<li><em>Commit:</em> exactly <strong>one</strong> DOM operation — the text node <code>"0"</code> becomes <code>"1"</code>. The first <code>&lt;li&gt;</code> is still <strong>the very same DOM node</strong> (<code>true</code>), not a new node that looks identical.</li>
<li><em>Paint:</em> the browser redraws the number.</li>
</ol>
${SD.phaEn}
<p>The two numbers in the grey box tell different stories. <code>TheNho: 6</code> is the <strong>render</strong> cost — six JavaScript function calls. <code>số thay đổi: 1</code> ("changes: 1") is the <strong>commit</strong> cost — one DOM edit. DOM edits are far more expensive (they trigger layout and repaint), so that is where React saves. The six function calls React does <em>not</em> save by itself; for six small cards that is not worth a thought, for six hundred heavy cards Chapter 8 (<code>memo</code>) and Chapter 12 (React Compiler) are the tools. Measured on the same machine: wrap <code>TheNho</code> in <code>memo</code>, click three times, and <code>TheNho</code> renders exactly 0 times.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202 slides often say "React is fast because it uses a virtual DOM", and the optimisation part teaches <code>shouldComponentUpdate</code>/<code>PureComponent</code> on class components → At a company, people write function components, <strong>measure</strong> with the React DevTools Profiler (Chapter 8) before optimising, add <code>memo</code> where the measurement says so, and since 2025 turn on the React Compiler to memoise automatically. · <em>Why:</em> "the virtual DOM makes React fast" makes you believe everything is fast for free; in reality React keeps the <em>commit</em> small while the <em>render</em> cost is yours. <code>shouldComponentUpdate</code> is not wrong — you will meet it in old class code — but it is the hand-written version of exactly what <code>memo</code> does.</p></div>

<h3>Reconciliation: how React compares two trees</h3>
${slide('rx-11', 6, 'A different tag in the same spot: React throws the branch away, state goes with it')}
<p>The comparison step's official name is <strong>reconciliation</strong>. Comparing two arbitrary trees to find the fewest operations is a hard problem: general algorithms cost around <em>n³</em> comparisons for <em>n</em> nodes — a thousand elements means a billion comparisons. React's old documentation (the "Reconciliation" page on legacy.reactjs.org) explains why React uses an <strong>O(n)</strong> algorithm based on two assumptions:</p>
<ul>
<li><strong>Two elements of different <code>type</code> produce entirely different trees.</strong> When <code>&lt;div&gt;</code> becomes <code>&lt;section&gt;</code>, or <code>&lt;TheBacSi&gt;</code> becomes <code>&lt;TheKhac&gt;</code> in the same spot, React does not try to compare inside: it <em>unmounts</em> the whole old branch — state inside is lost, effects clean up — and <em>mounts</em> the new branch from scratch.</li>
<li><strong>In a list, <code>key</code> tells React which item is which.</strong> Lesson 11.2 is entirely about this assumption.</li>
</ul>
<p>Same <code>type</code> in the same spot is the opposite: React <strong>keeps</strong> the DOM node (or the component with its state) and only updates the attributes/props that changed. Both cases measured with a note box that has its own state:</p>
<pre><code class="language-tsx">/* ───────── 4. Cùng vị trí, KHÁC loại thẻ ⇒ React vứt cả nhánh cũ ───────── */
function ONhap() {
  const [chu, setChu] = useState('');
  return &lt;input aria-label="Ghi chú" value={chu} onChange={(e) =&gt; setChu(e.target.value)} /&gt;;
}

export function DoiVoBoc() {
  const [noiBat, setNoiBat] = useState(false);
  return (
    &lt;div&gt;
      &lt;label&gt;
        &lt;input type="checkbox" checked={noiBat} onChange={(e) =&gt; setNoiBat(e.target.checked)} /&gt; Nổi bật
      &lt;/label&gt;
      {noiBat ? (
        &lt;section className="noi-bat"&gt;
          &lt;ONhap /&gt;
        &lt;/section&gt;
      ) : (
        &lt;div&gt;
          &lt;ONhap /&gt;
        &lt;/div&gt;
      )}
    &lt;/div&gt;
  );
}

export function DoiClass() {
  const [noiBat, setNoiBat] = useState(false);
  return (
    &lt;div&gt;
      &lt;label&gt;
        &lt;input type="checkbox" checked={noiBat} onChange={(e) =&gt; setNoiBat(e.target.checked)} /&gt; Nổi bật
      &lt;/label&gt;
      &lt;div className={noiBat ? 'noi-bat' : undefined}&gt;
        &lt;ONhap /&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">[khac loai] sau khi tick: "" | cùng nút DOM? false
[cung loai] sau khi tick: "đau đầu" | cùng nút DOM? true</div>
<p>The test types "đau đầu" (headache) into the box, then ticks "Nổi bật" (highlight). In <code>DoiVoBoc</code>, the wrapper changes from <code>&lt;div&gt;</code> to <code>&lt;section&gt;</code>: same spot, <strong>different type</strong> ⇒ React discards the <code>&lt;div&gt;</code> and everything inside, including <code>ONhap</code> and its <code>chu</code> state, then mounts a new <code>&lt;section&gt;</code> with a brand-new <code>ONhap</code> — the text is gone and the input is a different DOM node (<code>false</code>, "same DOM node? false"). In <code>DoiClass</code>, the wrapper stays a <code>&lt;div&gt;</code> and only <code>className</code> changes ⇒ React edits that attribute and keeps everything else (<code>true</code>).</p>
<div class="pitfall co-tieu-de"><strong>Trap — switching the wrapper tag conditionally wipes what the user is typing.</strong> A pattern common in course projects: <code>{isPhone ? &lt;div className="col"&gt;&lt;Form /&gt;&lt;/div&gt; : &lt;section className="grid"&gt;&lt;Form /&gt;&lt;/section&gt;}</code>, or wrapping a form in a <code>&lt;Link&gt;</code> only when logged in. The user rotates the phone or logs in halfway through and the form is blank — no error, no warning. Fix: keep <strong>the same tag</strong> and only change <code>className</code>/attributes, or lift the state to the parent (Lesson 2.4) so it does not depend on the wrapper.</div>
<p>The rule "same type, same spot ⇒ keep" sounds obvious, but it is the root of a whole family of bugs that Lesson 11.2 measures: it also means React <em>keeps</em> state when you wanted it <em>thrown away</em>.</p>
${SD.soSanhEn}

<h3>"Virtual DOM" — the name everyone uses, and why it misleads</h3>
<p>What people call the <strong>virtual DOM</strong> is what you just saw: the element tree (JavaScript objects) describing the UI, recreated on each render and compared with the previous one. The Fiber architecture notes written by Andrew Clark (React team) say it directly: reconciliation is the algorithm behind what is popularly understood as the "virtual DOM". Today's react.dev barely uses the term, for good reasons:</p>
<ul>
<li><strong>It does not make React "faster than the DOM".</strong> Nothing updates the DOM faster than calling exactly the DOM operations needed. React adds work (building and comparing trees) in exchange for convenience: you describe, it computes. The promise is "fast enough for nearly every app, without writing DOM commands by hand".</li>
<li><strong>It is not "a copy of the DOM".</strong> The element tree only contains what you wrote in JSX; it knows nothing about layout, sizes, or what the user is typing into an uncontrolled input.</li>
<li><strong>It is not the only way.</strong> Svelte compiles components into code that edits the DOM directly; Solid tracks individual values to know exactly which node to update. Neither rebuilds a description tree each time. React chose a different road and in return got the very easy-to-reason-about "a component is just a function" model.</li>
</ul>

<h3>Fiber: React's unit of work</h3>
${slide('rx-11', 7, 'Fiber: one node per component, linked by child, sibling, return')}
<p>Inside React DOM, your element tree is kept as a tree of <strong>fibers</strong>. This architecture shipped in <strong>React 16.0 (26 September 2017)</strong> — a rewrite of the reconciler core (checked in React's CHANGELOG, 09/2026); the same release added error boundaries and <code>createPortal</code>, which Lesson 11.4 uses. The goal, per the React team's architecture notes: split rendering into <em>small units</em> so work can be <strong>paused, prioritised, reused or thrown away</strong> midway — instead of one recursive call that cannot stop until the whole tree is done. Each fiber is one unit of work for one component or tag.</p>
<p>You never work with fibers directly. But looking at one once explains three things: where state really lives, why hooks must be called in the same order, and what "re-render" means. React attaches the fiber to the DOM node through a hidden property — this test is <strong>for learning only</strong>:</p>
<pre><code class="language-tsx">test('nhìn trộm fiber (CHI TIẾT NỘI BỘ — chỉ để học, đừng dùng trong app)', async () =&gt; {
  type Fiber = { type: unknown; key: string | null; tag: number; return: Fiber | null; alternate: Fiber | null; memoizedState: unknown };
  const ten = (f: Fiber) =&gt;
    typeof f.type === 'string' ? &#96;&lt;&#36;{f.type}&gt;&#96; : typeof f.type === 'function' ? &#96;&lt;&#36;{(f.type as { name: string }).name}&gt;&#96; : &#96;(tag &#36;{f.tag})&#96;;
  const fiberCua = (nut: Element) =&gt; {
    const khoa = Object.keys(nut).find((k) =&gt; k.startsWith('__reactFiber$'))!;
    return (nut as unknown as Record&lt;string, Fiber&gt;)[khoa];
  };

  const user = userEvent.setup();
  const { container } = render(&lt;BangDem /&gt;);
  const li = container.querySelector('li')!;
  console.info('[fiber] thuộc tính React gắn lên nút &lt;li&gt;:', Object.keys(li).map((k) =&gt; k.replace(/\\$.*/, '$…')).join(', '));
  const chuoi: string[] = [];
  for (let x: Fiber | null = fiberCua(li); x &amp;&amp; chuoi.length &lt; 6; x = x.return) chuoi.push(&#96;&#36;{ten(x)}&#36;{x.key ? &#96; key=&#36;{x.key}&#96; : ''}&#96;);
  console.info('[fiber] đi ngược .return:', chuoi.join(' → '));
  let fBangDem = fiberCua(li);
  while (ten(fBangDem) !== '&lt;BangDem&gt;') fBangDem = fBangDem.return!;
  const doc = () =&gt; (fBangDem.memoizedState as { memoizedState: number }).memoizedState;
  console.info('[fiber]', ten(fBangDem), '.memoizedState (useState đầu tiên) =', doc(), '| alternate:', fBangDem.alternate === null ? 'null' : 'có');
  await user.click(screen.getByRole('button', { name: '+1 lượt xem' }));
  const cap = [fBangDem, fBangDem.alternate!].map((f) =&gt; (f.memoizedState as { memoizedState: number }).memoizedState);
  console.info('[fiber] sau 1 lần bấm: cặp fiber của BangDem giữ soLuot =', cap.join(' và '), '(current + work-in-progress)');
  expect(chuoi[1]).toBe('&lt;TheNho&gt; key=bs-1');
});</code></pre>
<div class="out">[fiber] thuộc tính React gắn lên nút &lt;li&gt;: __reactFiber$…, __reactProps$…
[fiber] đi ngược .return: &lt;li&gt; → &lt;TheNho&gt; key=bs-1 → &lt;ul&gt; → &lt;section&gt; → &lt;BangDem&gt; → (tag 3)
[fiber] &lt;BangDem&gt; .memoizedState (useState đầu tiên) = 0 | alternate: null
[fiber] sau 1 lần bấm: cặp fiber của BangDem giữ soLuot = 0 và 1 (current + work-in-progress)</div>
<p>Reading the output ("đi ngược" = walking up, "sau 1 lần bấm" = after one click, "0 và 1" = 0 and 1):</p>
<ul>
<li><strong>The tree is linked by three pointers.</strong> Each fiber has <code>child</code> (first child), <code>sibling</code> (next sibling) and <code>return</code> (parent — called "return" because that is where work returns when the child is done). Walking <code>return</code> up from the <code>&lt;li&gt;</code> gives exactly the component tree: <code>TheNho</code> (with <code>key=bs-1</code>), <code>&lt;ul&gt;</code>, <code>&lt;section&gt;</code>, <code>BangDem</code>, and the root (<code>tag 3</code> is HostRoot — the root fiber created by <code>createRoot</code>).</li>
<li><strong>State lives on the fiber, not inside the component function.</strong> The <code>BangDem</code> fiber's <code>memoizedState</code> holds the first <code>useState</code> value. When the <code>BangDem</code> function returns, its local variables are gone; on the next render, <code>useState</code> reads the value back from the fiber. This is why "state is tied to a position in the tree" (Lesson 11.2): it is tied to the <em>fiber</em> at that position.</li>
<li><strong>Hooks are an ordered list.</strong> Each hook in a component is a link in a list hanging off <code>memoizedState</code>; React recognises "the second hook" purely by <em>call order</em>. Calling a hook inside an <code>if</code> shifts the order ⇒ one hook reads another hook's state. That is where the "only call hooks at the top level" rule comes from.</li>
<li><strong>A pair of fibers.</strong> At mount, <code>alternate</code> is <code>null</code>. After the click, the old fiber still holds <code>0</code> and its <code>alternate</code> holds <code>1</code>. React keeps at most two versions per component: the <em>current</em> one matching the screen and the <em>work-in-progress</em> one being built. After rendering, commit "flips" them — like a game drawing the next frame in a back buffer and then swapping. That is why React can build half of a new tree and throw it away without the screen noticing — the foundation of <code>useTransition</code> in Chapter 12.</li>
</ul>
${SD.fiberEn}
<div class="pitfall co-tieu-de"><strong>Trap — relying on <code>__reactFiber$…</code> or <code>_owner</code> in real code.</strong> The property name ends in a random suffix that changes on every page load, the fiber structure changes between versions, and none of it is publicly documented. The test above exists so you <em>see</em> the mechanism once; everything you need in an app has an official API (refs, context, DevTools).</div>

<h3>Batching: three <code>setState</code> calls in one event, one render</h3>
${slide('rx-11', 8, 'Batching: three sets in one event produce one render')}
<p>The Trigger phase has one more detail worth measuring: what happens when you call <code>setState</code> several times in a row?</p>
<pre><code class="language-tsx">/* ───────── 3. Gom nhiều setState thành MỘT lần render (batching) ───────── */
export function GomCapNhat() {
  dem('GomCapNhat');
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  function baLanSet() {
    setA(a + 1);
    setB(b + 1);
    setC(c + 1);
  }
  return (
    &lt;div&gt;
      &lt;p&gt;
        a={a} b={b} c={c}
      &lt;/p&gt;
      &lt;button type="button" onClick={baLanSet}&gt;
        Ba lần set
      &lt;/button&gt;
      &lt;button type="button" onClick={() =&gt; setTimeout(baLanSet, 0)}&gt;
        Ba lần set trong setTimeout
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">[batching] trong onClick: 1 lần render → a=1 b=1 c=1
[batching] trong setTimeout: 1 lần render → a=2 b=2 c=2</div>
<p>Three <code>set</code> calls, <strong>one</strong> render — both when called directly in <code>onClick</code> and inside <code>setTimeout</code> ("1 lần render" = 1 render). React <strong>batches</strong> every update made in the same "tick" and renders once. It waits for your code to finish, like a waiter who lets the whole table order before walking to the kitchen.</p>
<p>Batching inside <code>setTimeout</code>, Promises and <code>fetch</code> is new since <strong>React 18 (29 March 2022)</strong>, called <em>automatic batching</em>. In React 17 and earlier, only updates inside React event handlers were batched; old code that called <code>setState</code> twice in a <code>.then()</code> rendered twice. To opt out in a special spot (for example, when the DOM must update immediately so you can scroll to a newly added item), React has <code>flushSync(() =&gt; setX(…))</code> — rarely needed.</p>
<div class="callout"><p><strong>JS quick reminder — <code>setTimeout(fn, 0)</code>.</strong> Schedules <code>fn</code> to run "as soon as possible <em>after</em> the current code finishes". Zero does not mean immediately; it means "put it in the queue". So the <code>onClick</code> handler finishes first, and <code>baLanSet</code> runs later in its own tick.</p></div>
<p>Notice <code>a=1</code> then <code>a=2</code>: each click adds only 1 even though we call <code>setA(a + 1)</code>. Within one render, <code>a</code> is a fixed number (state is a "snapshot" — Lesson 2.1); the three lines each change a different variable so they do not interfere. Calling <code>setA(a + 1)</code> three times in a row still adds 1; to add 3, use the function form <code>setA((old) =&gt; old + 1)</code>.</p>

<div class="callout"><p><strong>Common interview question.</strong> "What is the virtual DOM? Does it make React faster than manipulating the DOM directly?"</p>
<p>On each render, components return a tree of elements — JavaScript objects describing the UI; React compares the new tree with the previous one (reconciliation) using an O(n) algorithm based on two assumptions: a different <code>type</code> replaces the whole branch, and list items are identified by <code>key</code>. It then applies only the minimal changes to the real DOM in the commit phase. It is not faster than a well-placed hand-written DOM call — it adds work — but it lets you write the UI declaratively while keeping DOM operations small. I measured it once: seven components re-rendered and the DOM changed a single text node. Render cost is still mine, so I profile before reaching for <code>memo</code>.</p></div>
<div class="callout"><p><strong>Common interview question.</strong> "What is Fiber and what problem does it solve?"</p>
<p>Fiber is React's core architecture since React 16: every component/tag has a fiber — a unit of work linked by <code>child</code>, <code>sibling</code> and <code>return</code>, holding props, state (<code>memoizedState</code>) and an <code>alternate</code> so React can build a new tree alongside the one on screen. Because work is split into small units, React can pause, prioritise urgent updates (typing) over slow ones (filtering a long list), or discard a half-finished render — the basis of concurrent rendering, <code>useTransition</code> and Suspense. Hooks are stored on the fiber as a list in call order, which is why hooks cannot be called conditionally.</p></div>

<h3>When to think about any of this — and when not to</h3>
<ul>
<li><strong>Do</strong> when state "vanishes on its own" or "refuses to reset" (the same-type/same-spot rule — Lesson 11.2), when considering optimisation (render or commit?), when logs show a component running several times (batching, StrictMode — Lesson 11.3), and in interviews.</li>
<li><strong>Don't</strong> when writing an ordinary component: describe the UI from state and trust React. Do not "optimise" by avoiding renders — avoiding them in the wrong place is worse than an extra render.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> copy <code>BangDem</code>, <code>TheNho</code> and the counter into your <code>src/vi-du/bai1.tsx</code>, then measure yourself.</p><ol>
<li>Write a test that clicks "+1 lượt xem" <strong>three times</strong> with a <code>MutationObserver</code> as in the lesson. Print the total number of <code>TheNho</code> renders and the total number of DOM changes.</li>
<li>Add a "compact" mode: when on, the list sits in an <code>&lt;ol&gt;</code> instead of a <code>&lt;ul&gt;</code>. Measure whether the <code>&lt;li&gt;</code> nodes are still the old ones after switching. Explain with reconciliation's first assumption.</li>
<li>Wrap <code>TheNho</code> in <code>memo</code> (<code>const TheNho = memo(function TheNho(…) {…})</code>) and rerun step 1.</li>
</ol><p><strong>Done when:</strong> step 1 prints exactly 18 <code>TheNho</code> renders and 3 DOM changes (one <code>characterData</code> per click); step 2 shows the <code>&lt;li&gt;</code> nodes are NEW (<code>=== old</code> is <code>false</code>); step 3 prints 0 <code>TheNho</code> renders with still 3 DOM changes; <code>npx tsc -b</code> prints nothing.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">element</span><span class="v">object describing "which tag/component with which props goes here" — what JSX produces</span></div>
<div class="kv"><span class="k">render</span><span class="v">React calling a component function to get a new element tree; no DOM yet</span></div>
<div class="kv"><span class="k">commit</span><span class="v">the phase where React applies differences to the real DOM, then runs refs and effects</span></div>
<div class="kv"><span class="k">reconciliation</span><span class="v">comparing the new element tree with the old one to find minimal changes; O(n), based on type and key</span></div>
<div class="kv"><span class="k">virtual DOM</span><span class="v">popular name for the element tree + comparison step; react.dev barely uses the term today</span></div>
<div class="kv"><span class="k">fiber</span><span class="v">internal unit of work per component/tag; holds state, linked by child/sibling/return</span></div>
<div class="kv"><span class="k">current / work-in-progress</span><span class="v">the two fiber versions of a component: the one on screen and the one being built; commit swaps them</span></div>
<div class="kv"><span class="k">batching</span><span class="v">several setState calls in one tick cause one render; automatic everywhere since React 18</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>JSX creates <strong>elements</strong> — description objects. Calling components is React's job, at a time React chooses.</li>
<li>Each update goes Trigger → Render → Commit → Paint. Render is computation; only commit touches the DOM.</li>
<li>Measured: one click, 7 components re-render, the DOM changes exactly 1 text node; the <code>&lt;li&gt;</code> is still the old node.</li>
<li>Reconciliation is O(n): a different <code>type</code> in the same spot ⇒ discard the branch (state lost); same <code>type</code> ⇒ keep and update.</li>
<li>Fiber (React 16) stores state and hooks in order on each node, with a current/work-in-progress pair — the foundation of concurrent rendering.</li>
<li>Several <code>setState</code> calls in one tick are batched into one render, even inside <code>setTimeout</code> (React 18+).</li>
</ul>

<a class="link-card" href="https://react.dev/learn/render-and-commit" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Render and Commit</span><span class="lc-sub">Trigger, render, commit — the lesson's main source.</span></span></a>
<a class="link-card" href="https://react.dev/learn/understanding-your-ui-as-a-tree" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Understanding Your UI as a Tree</span><span class="lc-sub">Render trees and module dependency trees.</span></span></a>
<a class="link-card" href="https://react.dev/learn/queueing-a-series-of-state-updates" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Queueing a Series of State Updates</span><span class="lc-sub">Batching and the function form of setState.</span></span></a>
<a class="link-card" href="https://legacy.reactjs.org/docs/reconciliation.html" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">legacy.reactjs.org — Reconciliation</span><span class="lc-sub">Why O(n) and the two assumptions (old docs, still right in spirit).</span></span></a>
<a class="link-card" href="https://github.com/acdlite/react-fiber-architecture" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub — React Fiber Architecture (Andrew Clark)</span><span class="lc-sub">What a fiber is, child/sibling/return, alternate.</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>React cập nhật màn hình thế nào: element, render và commit, reconciliation, fiber</h2>
<p class="lead">Bạn đã viết <code>setSoLuot(soLuot + 1)</code> cả trăm lần và màn hình đổi theo. Bài này đi chậm lại ở đúng khoảnh khắc đó: React gọi những hàm nào, so sánh cái gì với cái gì, và cuối cùng đụng vào DOM bao nhiêu chỗ. Không đoán — ta đếm. Một <code>MutationObserver</code> (bộ theo dõi thay đổi DOM của trình duyệt) sẽ cho thấy bảy component chạy lại mà DOM chỉ đổi đúng <strong>một</strong> nút chữ. Hiểu con số đó là hiểu gần hết cái người ta gọi là "virtual DOM".</p>

<p>Mọi ví dụ trong bài nằm ở <code>src/vi-du/bai1.tsx</code> của một dự án thử là bản chép app phòng khám (React 19.3.0, React DOM 19.3.0, Vitest 5.0.1, jsdom 30.1.1, TypeScript 6.0.3). Các khung xám là output THẬT của <code>npx vitest run src/vi-du/bai1.test.tsx --reporter=verbose</code>, dán nguyên như lúc chạy ngày 25/09/2026. Để biết một component chạy bao nhiêu lần, ví dụ dùng một bộ đếm nhỏ: một <code>Map</code> từ tên sang số, cộng một ở đầu component. Ghi vào biến bên ngoài trong lúc render đúng là điều Bài 2.1 dặn đừng làm — ở đây chấp nhận được vì nó chỉ <em>quan sát</em>, không bao giờ quay lại ảnh hưởng thứ component vẽ ra.</p>

<h3>Hai cách vẽ giao diện: ra lệnh cho DOM, hay mô tả rồi để React lo</h3>
<p>Trước React, cập nhật giao diện nghĩa là <strong>ra lệnh</strong> cho DOM (Document Object Model — cây các nút HTML mà trình duyệt giữ trong bộ nhớ): tìm thẻ này, đổi chữ thẻ kia, thêm một <code>&lt;li&gt;</code>, xoá một class. Mục 0 đã thấy cách đó hỏng ra sao: chỉ cần quên một lệnh là giao diện lệch khỏi dữ liệu. React đổi cách nghĩ: bạn chỉ <strong>mô tả</strong> giao diện phải trông thế nào với dữ liệu hiện tại — "với <code>soLuot = 3</code> thì có đoạn văn ghi <em>Lượt xem: 3</em> và sáu thẻ bác sĩ" — rồi React tự tính ra phải sửa DOM chỗ nào. Người ta hay viết gọn ý này là <code>UI = f(state)</code>: giao diện là một hàm của state.</p>
<p>Nhưng "React tự tính" không phải phép màu. Nó là một thuật toán cụ thể, chạy theo những luật cụ thể, và các luật đó giải thích vì sao state của bạn có lúc biến mất, vì sao <code>key</code> quan trọng, vì sao có "chạy hai lần". Bài này là bản đồ của thuật toán đó.</p>

<h3>JSX chỉ tạo ra một object mô tả — chưa có DOM nào</h3>
${slide('rx-11', 3, 'JSX chỉ tạo ra một object mô tả — chưa có DOM nào')}
<p>Bắt đầu từ viên gạch nhỏ nhất. Đây là một component thẻ bác sĩ rút gọn, có gắn bộ đếm:</p>
<pre><code class="language-tsx">/** Bộ đếm số lần mỗi component CHẠY (render). Chỉ để quan sát — không ảnh hưởng thứ được vẽ ra. */
export const demRender = new Map&lt;string, number&gt;();
const dem = (ten: string) =&gt; demRender.set(ten, (demRender.get(ten) ?? 0) + 1);

/* ───────── 1. JSX chỉ là một object mô tả ───────── */
export function TheNho({ bacSi }: { bacSi: BacSi }) {
  dem('TheNho');
  return (
    &lt;li&gt;
      {bacSi.ten} · {bacSi.namKinhNghiem} năm
    &lt;/li&gt;
  );
}</code></pre>
<p>Và đây là một test chỉ <em>tạo</em> một element từ JSX, không render gì cả:</p>
<pre><code class="language-tsx">test('JSX chỉ tạo ra một object — chưa có DOM nào', () =&gt; {
  const el = &lt;TheNho bacSi={danhSachBacSi[1]} /&gt;;
  console.info('[element] kiểu:', typeof el, '| khoá:', Object.keys(el).join(', '));
  console.info('[element] type là hàm:', typeof el.type === 'function' ? (el.type as { name: string }).name : el.type, '| props.bacSi.id =', (el.props as { bacSi: { id: string } }).bacSi.id);
  console.info('[element] TheNho đã chạy chưa?', demRender.get('TheNho') ?? 0, 'lần');
  expect(demRender.get('TheNho')).toBeUndefined();
});</code></pre>
<div class="out">[element] kiểu: object | khoá: $$typeof, type, key, props, _owner, _store
[element] type là hàm: TheNho | props.bacSi.id = bs-2
[element] TheNho đã chạy chưa? 0 lần</div>
<p>Ba điều đáng dừng lại:</p>
<ol>
<li><strong>JSX không vẽ gì.</strong> <code>&lt;TheNho bacSi={…} /&gt;</code> được công cụ build (esbuild/Babel trong Vite) dịch thành một lời gọi hàm kiểu <code>jsx(TheNho, { bacSi: … })</code>, và lời gọi đó trả về một <strong>object bình thường</strong>. React gọi object này là <strong>element</strong> (phần tử): một tờ giấy ghi "ở đây cần một <code>TheNho</code> với các props này".</li>
<li><strong><code>type</code> là chính hàm <code>TheNho</code>, nhưng nó chưa được gọi.</strong> Bộ đếm vẫn là 0. Việc gọi <code>TheNho</code> (tức là <em>render</em> nó) là việc của React, vào lúc React chọn.</li>
<li><strong><code>$$typeof</code></strong> là một <code>Symbol</code> đánh dấu "đây là element React thật". Symbol không thể nằm trong JSON, nên một object lạ đọc từ API không thể giả làm element để chen HTML vào trang. <code>_owner</code> và <code>_store</code> là thứ chỉ có ở bản dev, phục vụ cảnh báo và DevTools.</li>
</ol>
<div class="callout"><p><strong>JS nhắc nhanh — <code>Object.keys</code>, <code>typeof</code>, <code>??</code>.</strong> <code>Object.keys(o)</code> trả về mảng tên các thuộc tính của object. <code>typeof x</code> trả về chuỗi mô tả kiểu: <code>'object'</code>, <code>'function'</code>, <code>'string'</code>… <code>a ?? b</code> ("nullish coalescing") nghĩa là "lấy <code>a</code>, nhưng nếu <code>a</code> là <code>null</code> hoặc <code>undefined</code> thì lấy <code>b</code>" — ở đây: chưa có số đếm thì in 0.</p></div>
<p>Vì element chỉ là dữ liệu, một component thực chất là một hàm <strong>trả về dữ liệu mô tả</strong>. Cả cây giao diện của bạn, ở mỗi lần render, là một cây object như vậy. Từ đây trở đi, mọi thứ React làm là: lấy cây mô tả mới, so với cây mô tả lần trước, rồi sửa DOM thật cho khớp.</p>

<h3>Bốn pha của mỗi lần cập nhật: Trigger → Render → Commit → Paint</h3>
${slide('rx-11', 4, 'Mỗi lần cập nhật đi qua bốn pha — chỉ pha ③ đụng DOM')}
<p>Tài liệu react.dev chia một lần cập nhật thành ba bước (kích hoạt, render, commit); trình duyệt thêm bước thứ tư là vẽ. Gọi tên cho rõ, vì phỏng vấn và bài viết kỹ thuật dùng đúng những từ này:</p>
<ol>
<li><strong>Trigger (kích hoạt).</strong> Có hai lý do để React làm việc: lần render đầu tiên (<code>createRoot(…).render(&lt;App /&gt;)</code> trong <code>main.tsx</code>), và khi state của một component đổi (<code>setState</code>). Gọi <code>setState</code> không vẽ lại gì ngay; nó chỉ <em>xếp hàng</em> một lần render.</li>
<li><strong>Render (vẽ ra — nhưng trong bộ nhớ).</strong> React <em>gọi hàm component</em> có state vừa đổi, lấy về cây element mới, rồi gọi tiếp các component con trong cây đó, đệ quy xuống dưới. Pha này là tính toán thuần: không được đụng DOM, không gọi API. Đây cũng là lúc React <strong>đối chiếu</strong> cây mới với cây cũ để biết cái gì khác.</li>
<li><strong>Commit (ghi).</strong> React áp những khác biệt vừa tính lên DOM thật: đổi chữ, thêm, xoá, sửa thuộc tính — và <em>chỉ</em> những chỗ khác. Sau đó nó chạy các <code>ref</code> và effect.</li>
<li><strong>Paint (vẽ lên màn hình).</strong> Trình duyệt thấy DOM đổi, tính lại bố cục và vẽ pixel. Pha này không phải của React; React chỉ quyết định khi nào nhả việc cho trình duyệt.</li>
</ol>
<p>Hệ quả quan trọng nhất: <strong>"render" không có nghĩa là "cập nhật màn hình"</strong>. Một component có thể render mười lần mà DOM không đổi một byte nào, vì lần nào nó cũng trả về đúng mô tả cũ. Khi đồng nghiệp nói "component này render lại nhiều quá", câu hỏi đầu tiên nên là: <em>render</em> nhiều, hay <em>commit</em> nhiều? Hai chuyện đó có giá rất khác nhau.</p>

<h3>Đo thật: bảy component render lại, DOM chỉ đổi đúng một nút chữ</h3>
${slide('rx-11', 5, 'Bảy component render lại, DOM chỉ đổi đúng một nút chữ')}
<p>Component thử: một bộ đếm lượt xem nằm cạnh danh sách sáu bác sĩ.</p>
<pre><code class="language-tsx">/* ───────── 2. Render lại cả 7 component, nhưng DOM chỉ đổi một chỗ ───────── */
export function BangDem() {
  dem('BangDem');
  const [soLuot, setSoLuot] = useState(0);
  return (
    &lt;section&gt;
      &lt;p&gt;Lượt xem: {soLuot}&lt;/p&gt;
      &lt;button type="button" onClick={() =&gt; setSoLuot(soLuot + 1)}&gt;
        +1 lượt xem
      &lt;/button&gt;
      &lt;ul&gt;
        {danhSachBacSi.map((bs) =&gt; (
          &lt;TheNho key={bs.id} bacSi={bs} /&gt;
        ))}
      &lt;/ul&gt;
    &lt;/section&gt;
  );
}</code></pre>
<p>Test bấm "+1 lượt xem" một lần. Trước khi bấm, nó xoá bộ đếm render và gắn một <code>MutationObserver</code> lên vùng chứa — đây là API chuẩn của trình duyệt (jsdom cũng có), gọi lại hàm của bạn mỗi khi DOM bên dưới bị sửa: thêm/xoá nút (<code>childList</code>), đổi chữ (<code>characterData</code>), đổi thuộc tính (<code>attributes</code>). React không thể giấu nó bất cứ thay đổi nào.</p>
<pre><code class="language-tsx">test('bấm +1: 7 component render lại nhưng DOM chỉ đổi một nút chữ', async () =&gt; {
  const user = userEvent.setup();
  const { container } = render(&lt;BangDem /&gt;);
  const theDau = container.querySelector('li');
  demRender.clear();

  const thayDoi: string[] = [];
  const quanSat = new MutationObserver((ds) =&gt; {
    for (const m of ds) thayDoi.push(&#96;&#36;{m.type}: "&#36;{m.oldValue}" → "&#36;{m.target.textContent}"&#96;);
  });
  quanSat.observe(container, { subtree: true, childList: true, characterData: true, characterDataOldValue: true, attributes: true });

  await user.click(screen.getByRole('button', { name: '+1 lượt xem' }));
  await act(async () =&gt; {}); // chờ MutationObserver giao bản ghi
  quanSat.disconnect();

  console.info('[render] BangDem:', demRender.get('BangDem'), '| TheNho:', demRender.get('TheNho'));
  console.info('[DOM] số thay đổi:', thayDoi.length, '|', thayDoi.join(' ; '));
  console.info('[DOM] thẻ &lt;li&gt; đầu tiên vẫn là NÚT CŨ?', container.querySelector('li') === theDau);
  expect(thayDoi).toHaveLength(1);
});</code></pre>
<div class="out">[render] BangDem: 1 | TheNho: 6
[DOM] số thay đổi: 1 | characterData: "0" → "1"
[DOM] thẻ &lt;li&gt; đầu tiên vẫn là NÚT CŨ? true</div>
<div class="callout"><p><strong>JS nhắc nhanh — <code>Map</code>, template literal, <code>===</code> giữa hai object.</strong> <code>new Map()</code> là bảng khoá → giá trị; <code>.get(k)</code> đọc, <code>.set(k, v)</code> ghi, <code>.clear()</code> xoá hết. Chuỗi trong dấu backtick với <code>&#36;{…}</code> bên trong là <em>template literal</em>: chèn giá trị vào chuỗi. Còn <code>a === b</code> giữa hai object/nút DOM hỏi "có phải <strong>cùng một</strong> object trong bộ nhớ không" — không phải "có giống nhau không".</p></div>
<p><strong>Chạy thử từng bước</strong> — chuyện gì xảy ra khi bấm nút:</p>
<ol>
<li><em>Trigger:</em> <code>onClick</code> gọi <code>setSoLuot(0 + 1)</code>. React đánh dấu <code>BangDem</code> cần render.</li>
<li><em>Render:</em> React gọi lại <code>BangDem</code> (bộ đếm: 1). Hàm trả về cây mới: <code>&lt;p&gt;Lượt xem: 1&lt;/p&gt;</code>, cái nút, và sáu element <code>&lt;TheNho&gt;</code>. Vì cha đã render lại, React gọi tiếp <strong>cả sáu</strong> <code>TheNho</code> (bộ đếm: 6) — mặc định, component con render lại mỗi khi cha render lại, <em>bất kể props có đổi hay không</em>.</li>
<li><em>Đối chiếu:</em> React so từng element mới với element cũ ở cùng chỗ. Đoạn văn: cùng thẻ <code>&lt;p&gt;</code>, chữ đổi từ <code>0</code> sang <code>1</code>. Nút: y hệt. Sáu thẻ: <code>&lt;li&gt;</code> với chữ y hệt lần trước.</li>
<li><em>Commit:</em> đúng <strong>một</strong> thao tác DOM — đổi nội dung nút chữ <code>"0"</code> thành <code>"1"</code>. Thẻ <code>&lt;li&gt;</code> đầu tiên vẫn là <strong>chính nút DOM cũ</strong> (<code>true</code>), không phải một nút mới trông giống hệt.</li>
<li><em>Paint:</em> trình duyệt vẽ lại con số.</li>
</ol>
${SD.phaVi}
<p>Hai con số trong khung xám kể hai câu chuyện khác nhau. <code>TheNho: 6</code> là chi phí <strong>render</strong> — sáu lần gọi hàm JavaScript. <code>số thay đổi: 1</code> là chi phí <strong>commit</strong> — một lần sửa DOM. Sửa DOM đắt hơn nhiều (nó kéo theo tính lại bố cục, vẽ lại), nên đây là chỗ React tiết kiệm. Còn sáu lần gọi hàm thì React <em>không</em> tự tiết kiệm; với sáu thẻ nhỏ thì chẳng đáng bận tâm, với sáu trăm thẻ nặng thì Chương 8 (<code>memo</code>) và Chương 12 (React Compiler) là chỗ xử lý. Đo trên cùng máy: bọc <code>TheNho</code> bằng <code>memo</code> thì bấm ba lần, <code>TheNho</code> render đúng 0 lần.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Slide FER202 hay có câu "React nhanh vì dùng virtual DOM", và phần tối ưu dạy <code>shouldComponentUpdate</code>/<code>PureComponent</code> trên class component → Ở công ty, người ta viết function component, <strong>đo</strong> bằng React DevTools Profiler (Chương 8) trước khi tối ưu, dùng <code>memo</code> đúng chỗ đo thấy cần, và từ 2025 bật React Compiler để nó tự ghi nhớ. · <em>Vì sao:</em> câu "virtual DOM làm React nhanh" dễ khiến bạn tin mọi thứ tự nhanh; thực tế React chỉ giữ cho <em>commit</em> nhỏ, còn chi phí <em>render</em> là của bạn. <code>shouldComponentUpdate</code> không sai — bạn sẽ gặp nó trong code class cũ — nhưng nó là bản tay của đúng việc <code>memo</code> làm.</p></div>

<h3>Reconciliation: React so hai cây thế nào</h3>
${slide('rx-11', 6, 'Khác loại thẻ ở cùng chỗ: React vứt cả nhánh, state mất theo')}
<p>Bước đối chiếu có tên chính thức là <strong>reconciliation</strong> (hoà giải/đối chiếu). So hai cây bất kỳ để tìm số thao tác ít nhất là bài toán khó: các thuật toán tổng quát tốn cỡ <em>n³</em> phép so với <em>n</em> nút — một nghìn phần tử là một tỷ phép so. Tài liệu cũ của React (trang "Reconciliation" trên legacy.reactjs.org) giải thích vì sao React chọn một thuật toán <strong>O(n)</strong> dựa trên hai giả định:</p>
<ul>
<li><strong>Hai element khác <code>type</code> sinh ra hai cây khác hẳn nhau.</strong> Thấy <code>&lt;div&gt;</code> đổi thành <code>&lt;section&gt;</code>, hoặc <code>&lt;TheBacSi&gt;</code> đổi thành <code>&lt;TheKhac&gt;</code> ở cùng chỗ, React không cố so bên trong: nó <em>gỡ (unmount)</em> cả nhánh cũ — state bên trong mất, effect chạy dọn — rồi <em>dựng (mount)</em> nhánh mới từ đầu.</li>
<li><strong>Trong một danh sách, <code>key</code> cho biết phần tử nào là phần tử nào.</strong> Bài 11.2 dành trọn cho giả định này.</li>
</ul>
<p>Cùng <code>type</code> ở cùng chỗ thì ngược lại: React <strong>giữ</strong> nút DOM (hoặc giữ component cùng state của nó) và chỉ cập nhật những thuộc tính/props đổi. Đo cả hai trường hợp bằng một ô ghi chú có state riêng:</p>
<pre><code class="language-tsx">/* ───────── 4. Cùng vị trí, KHÁC loại thẻ ⇒ React vứt cả nhánh cũ ───────── */
function ONhap() {
  const [chu, setChu] = useState('');
  return &lt;input aria-label="Ghi chú" value={chu} onChange={(e) =&gt; setChu(e.target.value)} /&gt;;
}

export function DoiVoBoc() {
  const [noiBat, setNoiBat] = useState(false);
  return (
    &lt;div&gt;
      &lt;label&gt;
        &lt;input type="checkbox" checked={noiBat} onChange={(e) =&gt; setNoiBat(e.target.checked)} /&gt; Nổi bật
      &lt;/label&gt;
      {noiBat ? (
        &lt;section className="noi-bat"&gt;
          &lt;ONhap /&gt;
        &lt;/section&gt;
      ) : (
        &lt;div&gt;
          &lt;ONhap /&gt;
        &lt;/div&gt;
      )}
    &lt;/div&gt;
  );
}

export function DoiClass() {
  const [noiBat, setNoiBat] = useState(false);
  return (
    &lt;div&gt;
      &lt;label&gt;
        &lt;input type="checkbox" checked={noiBat} onChange={(e) =&gt; setNoiBat(e.target.checked)} /&gt; Nổi bật
      &lt;/label&gt;
      &lt;div className={noiBat ? 'noi-bat' : undefined}&gt;
        &lt;ONhap /&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">[khac loai] sau khi tick: "" | cùng nút DOM? false
[cung loai] sau khi tick: "đau đầu" | cùng nút DOM? true</div>
<p>Test gõ "đau đầu" vào ô rồi tick "Nổi bật". Với <code>DoiVoBoc</code>, vỏ bọc đổi từ <code>&lt;div&gt;</code> sang <code>&lt;section&gt;</code>: cùng vị trí, <strong>khác loại</strong> ⇒ React vứt <code>&lt;div&gt;</code> cùng mọi thứ bên trong, kể cả <code>ONhap</code> và state <code>chu</code> của nó, rồi dựng <code>&lt;section&gt;</code> mới với một <code>ONhap</code> mới tinh — chữ mất, ô nhập là một nút DOM khác (<code>false</code>). Với <code>DoiClass</code>, vỏ bọc vẫn là <code>&lt;div&gt;</code>, chỉ thuộc tính <code>className</code> đổi ⇒ React sửa đúng thuộc tính đó, giữ nguyên phần còn lại (<code>true</code>).</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — đổi thẻ bọc theo điều kiện làm mất dữ liệu người dùng đang gõ.</strong> Mẫu hay gặp trong đồ án: <code>{laDienThoai ? &lt;div className="cot"&gt;&lt;Form /&gt;&lt;/div&gt; : &lt;section className="luoi"&gt;&lt;Form /&gt;&lt;/section&gt;}</code>, hoặc bọc form trong <code>&lt;Link&gt;</code> chỉ khi đã đăng nhập. Người dùng xoay điện thoại hay đăng nhập giữa chừng là form trắng trơn — không lỗi nào, không cảnh báo nào. Cách chữa: giữ <strong>cùng một loại thẻ</strong> và chỉ đổi <code>className</code>/thuộc tính, hoặc đưa state lên cha (Bài 2.4) để nó không phụ thuộc vào vỏ bọc.</div>
<p>Luật "cùng loại, cùng vị trí thì giữ" nghe hiển nhiên, nhưng nó là gốc của cả một họ bug mà Bài 11.2 sẽ đo: nó cũng có nghĩa là React <em>giữ</em> state khi bạn mong nó <em>vứt</em>.</p>
${SD.soSanhVi}

<h3>"Virtual DOM" — cái tên ai cũng dùng, và vì sao nó dễ gây hiểu lầm</h3>
<p>Cái người ta quen gọi là <strong>virtual DOM</strong> chính là thứ bạn vừa thấy: cây element (object JavaScript) mô tả giao diện, được tạo lại mỗi lần render rồi so với cây trước. Tài liệu kiến trúc Fiber do Andrew Clark (nhóm React) viết nói thẳng: reconciliation là thuật toán đứng sau cái mà mọi người vẫn hiểu là "virtual DOM". Tài liệu react.dev hiện nay gần như không dùng từ này, và có lý do:</p>
<ul>
<li><strong>Nó không làm React "nhanh hơn DOM".</strong> Không có cách nào cập nhật DOM nhanh hơn việc gọi đúng lệnh DOM cần thiết. React thêm việc (tạo cây, so cây) để đổi lấy sự tiện: bạn mô tả, nó tính. Cái nó hứa là "đủ nhanh cho gần như mọi app, mà bạn không phải viết tay các lệnh DOM".</li>
<li><strong>Nó không phải "bản sao của DOM".</strong> Cây element chỉ chứa những gì bạn viết trong JSX; nó không biết gì về bố cục, kích thước hay chữ người dùng đang gõ trong một ô không kiểm soát.</li>
<li><strong>Nó không phải cách duy nhất.</strong> Svelte biên dịch component thành mã sửa DOM trực tiếp; Solid theo dõi từng giá trị để biết chính xác nút nào cần đổi. Cả hai đều không tạo lại cây mô tả mỗi lần. React chọn đường khác, và đổi lại được mô hình "component chỉ là hàm" rất dễ suy luận.</li>
</ul>

<h3>Fiber: đơn vị công việc của React</h3>
${slide('rx-11', 7, 'Fiber: mỗi component một nút, nối bằng child, sibling, return')}
<p>Bên trong React DOM, cây element của bạn được giữ lại dưới dạng một cây <strong>fiber</strong>. Kiến trúc này ra mắt ở <strong>React 16.0 (26/09/2017)</strong> — lần viết lại lõi đối chiếu (kiểm trong CHANGELOG của React, 09/2026); cùng bản đó có luôn error boundary và <code>createPortal</code> mà Bài 11.4 sẽ dùng. Mục tiêu, theo tài liệu kiến trúc của nhóm React: chia việc render thành những <em>đơn vị nhỏ</em> để có thể <strong>tạm dừng, ưu tiên, dùng lại hoặc bỏ</strong> giữa chừng — thay vì một lời gọi đệ quy chạy một mạch không dừng được cho tới khi xong cả cây. Mỗi fiber là một đơn vị công việc ứng với một component hoặc một thẻ.</p>
<p>Bạn không bao giờ làm việc trực tiếp với fiber. Nhưng nhìn nó một lần giúp hiểu ba chuyện: state thật sự sống ở đâu, vì sao hook phải gọi đúng thứ tự, và "render lại" nghĩa là gì. React gắn fiber lên nút DOM qua một thuộc tính ẩn — đây là một test <strong>chỉ để học</strong>:</p>
<pre><code class="language-tsx">test('nhìn trộm fiber (CHI TIẾT NỘI BỘ — chỉ để học, đừng dùng trong app)', async () =&gt; {
  type Fiber = { type: unknown; key: string | null; tag: number; return: Fiber | null; alternate: Fiber | null; memoizedState: unknown };
  const ten = (f: Fiber) =&gt;
    typeof f.type === 'string' ? &#96;&lt;&#36;{f.type}&gt;&#96; : typeof f.type === 'function' ? &#96;&lt;&#36;{(f.type as { name: string }).name}&gt;&#96; : &#96;(tag &#36;{f.tag})&#96;;
  const fiberCua = (nut: Element) =&gt; {
    const khoa = Object.keys(nut).find((k) =&gt; k.startsWith('__reactFiber$'))!;
    return (nut as unknown as Record&lt;string, Fiber&gt;)[khoa];
  };

  const user = userEvent.setup();
  const { container } = render(&lt;BangDem /&gt;);
  const li = container.querySelector('li')!;
  console.info('[fiber] thuộc tính React gắn lên nút &lt;li&gt;:', Object.keys(li).map((k) =&gt; k.replace(/\\$.*/, '$…')).join(', '));
  const chuoi: string[] = [];
  for (let x: Fiber | null = fiberCua(li); x &amp;&amp; chuoi.length &lt; 6; x = x.return) chuoi.push(&#96;&#36;{ten(x)}&#36;{x.key ? &#96; key=&#36;{x.key}&#96; : ''}&#96;);
  console.info('[fiber] đi ngược .return:', chuoi.join(' → '));
  let fBangDem = fiberCua(li);
  while (ten(fBangDem) !== '&lt;BangDem&gt;') fBangDem = fBangDem.return!;
  const doc = () =&gt; (fBangDem.memoizedState as { memoizedState: number }).memoizedState;
  console.info('[fiber]', ten(fBangDem), '.memoizedState (useState đầu tiên) =', doc(), '| alternate:', fBangDem.alternate === null ? 'null' : 'có');
  await user.click(screen.getByRole('button', { name: '+1 lượt xem' }));
  const cap = [fBangDem, fBangDem.alternate!].map((f) =&gt; (f.memoizedState as { memoizedState: number }).memoizedState);
  console.info('[fiber] sau 1 lần bấm: cặp fiber của BangDem giữ soLuot =', cap.join(' và '), '(current + work-in-progress)');
  expect(chuoi[1]).toBe('&lt;TheNho&gt; key=bs-1');
});</code></pre>
<div class="out">[fiber] thuộc tính React gắn lên nút &lt;li&gt;: __reactFiber$…, __reactProps$…
[fiber] đi ngược .return: &lt;li&gt; → &lt;TheNho&gt; key=bs-1 → &lt;ul&gt; → &lt;section&gt; → &lt;BangDem&gt; → (tag 3)
[fiber] &lt;BangDem&gt; .memoizedState (useState đầu tiên) = 0 | alternate: null
[fiber] sau 1 lần bấm: cặp fiber của BangDem giữ soLuot = 0 và 1 (current + work-in-progress)</div>
<p>Đọc output:</p>
<ul>
<li><strong>Cây nối bằng ba con trỏ.</strong> Mỗi fiber có <code>child</code> (con đầu tiên), <code>sibling</code> (anh em kế tiếp) và <code>return</code> (cha — gọi là "return" vì đó là chỗ công việc quay về khi con làm xong). Đi ngược <code>return</code> từ <code>&lt;li&gt;</code> ta gặp đúng cây component: <code>TheNho</code> (có <code>key=bs-1</code>), <code>&lt;ul&gt;</code>, <code>&lt;section&gt;</code>, <code>BangDem</code>, và gốc (<code>tag 3</code> là HostRoot — fiber gốc do <code>createRoot</code> tạo).</li>
<li><strong>State sống trên fiber, không sống trong hàm component.</strong> <code>memoizedState</code> của fiber <code>BangDem</code> chứa giá trị của <code>useState</code> đầu tiên. Hàm <code>BangDem</code> chạy xong là mất hết biến cục bộ; lần render sau, <code>useState</code> đọc lại giá trị từ fiber. Đây là lý do "state gắn với vị trí trong cây" (Bài 11.2): nó gắn với <em>fiber</em> ở vị trí đó.</li>
<li><strong>Hook là một danh sách theo thứ tự.</strong> Mỗi hook trong một component là một mắt xích trong danh sách nối từ <code>memoizedState</code>; React nhận ra "hook thứ hai" chỉ bằng <em>thứ tự gọi</em>. Gọi hook trong <code>if</code> làm lệch thứ tự ⇒ hook này đọc nhầm state của hook kia. Đó là nguồn gốc của luật "chỉ gọi hook ở cấp cao nhất".</li>
<li><strong>Cặp fiber.</strong> Lúc mount, <code>alternate</code> là <code>null</code>. Sau lần bấm, fiber cũ vẫn giữ <code>0</code> còn bản kia (<code>alternate</code>) giữ <code>1</code>. React luôn có tối đa hai bản cho mỗi component: bản <em>current</em> đang ứng với màn hình và bản <em>work-in-progress</em> đang được dựng. Render xong, commit "lật" hai bản — giống cách game vẽ khung hình mới ở bộ đệm sau rồi mới đổi ra trước. Nhờ vậy React có thể dựng dở một cây mới rồi bỏ nó đi mà màn hình không hề hấn gì — nền móng của <code>useTransition</code> ở Chương 12.</li>
</ul>
${SD.fiberVi}
<div class="pitfall co-tieu-de"><strong>Bẫy — dựa vào <code>__reactFiber$…</code> hay <code>_owner</code> trong code thật.</strong> Tên thuộc tính có một đuôi ngẫu nhiên đổi mỗi lần tải trang, cấu trúc fiber đổi theo phiên bản và không có trong bất kỳ tài liệu công khai nào. Test ở trên tồn tại để bạn <em>thấy</em> cơ chế một lần; mọi thứ bạn cần trong app đều có API chính thức (ref, context, DevTools).</div>

<h3>Batching: ba lần <code>setState</code> trong một sự kiện, một lần render</h3>
${slide('rx-11', 8, 'Batching: ba lần set trong một sự kiện chỉ ra một lần render')}
<p>Pha Trigger có một chi tiết nữa đáng đo: gọi <code>setState</code> nhiều lần liền nhau thì sao?</p>
<pre><code class="language-tsx">/* ───────── 3. Gom nhiều setState thành MỘT lần render (batching) ───────── */
export function GomCapNhat() {
  dem('GomCapNhat');
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  function baLanSet() {
    setA(a + 1);
    setB(b + 1);
    setC(c + 1);
  }
  return (
    &lt;div&gt;
      &lt;p&gt;
        a={a} b={b} c={c}
      &lt;/p&gt;
      &lt;button type="button" onClick={baLanSet}&gt;
        Ba lần set
      &lt;/button&gt;
      &lt;button type="button" onClick={() =&gt; setTimeout(baLanSet, 0)}&gt;
        Ba lần set trong setTimeout
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">[batching] trong onClick: 1 lần render → a=1 b=1 c=1
[batching] trong setTimeout: 1 lần render → a=2 b=2 c=2</div>
<p>Ba lần <code>set</code>, <strong>một</strong> lần render — cả khi gọi thẳng trong <code>onClick</code> lẫn khi gọi bên trong <code>setTimeout</code>. React <strong>gom (batch)</strong> mọi cập nhật xảy ra trong cùng một "nhịp" rồi mới render một lần. Nó chờ đoạn code của bạn chạy xong hết đã, như người phục vụ đợi bạn gọi xong cả bàn rồi mới chạy vào bếp.</p>
<p>Việc gom trong <code>setTimeout</code>, Promise, <code>fetch</code> là mới từ <strong>React 18 (29/03/2022)</strong>, gọi là <em>automatic batching</em>. Ở React 17 trở về trước, chỉ các cập nhật trong handler sự kiện của React mới được gom; code cũ gọi <code>setState</code> hai lần trong <code>.then()</code> thì render hai lần. Muốn tắt việc gom cho một chỗ đặc biệt (ví dụ cần DOM cập nhật ngay để cuộn tới một phần tử vừa thêm), React có <code>flushSync(() =&gt; setX(…))</code> — hiếm khi cần.</p>
<div class="callout"><p><strong>JS nhắc nhanh — <code>setTimeout(fn, 0)</code>.</strong> Hẹn chạy <code>fn</code> "sớm nhất có thể <em>sau khi</em> đoạn code hiện tại chạy xong". Số 0 không có nghĩa là ngay lập tức; nó có nghĩa là "xếp vào hàng đợi". Vì vậy handler <code>onClick</code> kết thúc trước, rồi <code>baLanSet</code> mới chạy ở một nhịp riêng.</p></div>
<p>Để ý <code>a=1</code> rồi <code>a=2</code>: mỗi lần bấm chỉ cộng 1 dù gọi <code>setA(a + 1)</code>. Trong một lần render, <code>a</code> là một con số cố định (state là "ảnh chụp" — Bài 2.1); ba dòng kia mỗi dòng đổi một biến khác nhau nên không đụng nhau. Gọi <code>setA(a + 1)</code> ba lần liền thì vẫn chỉ +1; muốn +3 thì dùng dạng hàm <code>setA((cu) =&gt; cu + 1)</code>.</p>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Virtual DOM là gì? Nó có làm React nhanh hơn thao tác DOM trực tiếp không?"</p>
<p>Em trả lời: mỗi lần render, component trả về một cây element — object JavaScript mô tả giao diện; React so cây mới với cây trước (reconciliation) bằng thuật toán O(n) dựa trên hai giả định: khác <code>type</code> thì thay cả nhánh, danh sách thì nhận diện bằng <code>key</code>. Sau đó nó chỉ áp những thay đổi tối thiểu lên DOM thật trong pha commit. Nó không nhanh hơn một lệnh DOM viết tay đúng chỗ — nó thêm việc — nhưng nó cho phép viết giao diện kiểu mô tả mà vẫn giữ số thao tác DOM nhỏ. Em từng đo: bảy component render lại mà DOM chỉ đổi một nút chữ. Chi phí render thì vẫn là của mình, nên em đo bằng Profiler rồi mới dùng <code>memo</code>.</p></div>
<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Fiber là gì, và nó giải quyết vấn đề gì?"</p>
<p>Fiber là kiến trúc lõi từ React 16: mỗi component/thẻ ứng với một fiber — một đơn vị công việc nối với nhau bằng <code>child</code>, <code>sibling</code>, <code>return</code>, giữ props, state (<code>memoizedState</code>) và một bản <code>alternate</code> để React dựng cây mới song song với cây đang hiển thị. Vì công việc được chia nhỏ, React có thể tạm dừng, ưu tiên cập nhật gấp (gõ phím) hơn cập nhật chậm (lọc danh sách dài), hoặc bỏ một lần render dở — đó là nền của concurrent rendering, <code>useTransition</code>, Suspense. Hook lưu thành danh sách trên fiber theo thứ tự gọi, nên không được gọi hook có điều kiện.</p></div>

<h3>Khi nào cần nghĩ tới những thứ này — và khi nào không</h3>
<ul>
<li><strong>Cần</strong> khi state "tự nhiên biến mất" hoặc "không chịu reset" (luật cùng loại/cùng vị trí — Bài 11.2), khi cân nhắc tối ưu (render hay commit?), khi đọc log thấy một component chạy nhiều lần (batching, StrictMode — Bài 11.3), và khi phỏng vấn.</li>
<li><strong>Không cần</strong> khi viết một component bình thường: mô tả giao diện theo state và tin React. Đừng tự "tối ưu" bằng cách tránh render — tránh sai chỗ còn tệ hơn render thừa.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> chép <code>BangDem</code>, <code>TheNho</code> và bộ đếm vào <code>src/vi-du/bai1.tsx</code> của bạn, rồi tự đo.</p><ol>
<li>Viết test bấm "+1 lượt xem" <strong>ba lần</strong>, có <code>MutationObserver</code> như trong bài. In ra tổng số lần <code>TheNho</code> render và tổng số thay đổi DOM.</li>
<li>Thêm một chế độ "gọn": khi bật, danh sách nằm trong <code>&lt;ol&gt;</code> thay vì <code>&lt;ul&gt;</code>. Đo xem bật chế độ này sinh ra bao nhiêu thay đổi DOM và các nút <code>&lt;li&gt;</code> có còn là nút cũ không. Giải thích bằng giả định thứ nhất của reconciliation.</li>
<li>Bọc <code>TheNho</code> bằng <code>memo</code> (<code>const TheNho = memo(function TheNho(…) {…})</code>) và chạy lại bước 1.</li>
</ol><p><strong>Đạt khi:</strong> bước 1 in đúng <code>TheNho</code> 18 lần và DOM 3 thay đổi (mỗi lần bấm một <code>characterData</code>); bước 2 cho thấy các <code>&lt;li&gt;</code> là nút MỚI (<code>=== cũ</code> là <code>false</code>); bước 3 in <code>TheNho</code> 0 lần mà DOM vẫn 3 thay đổi; <code>npx tsc -b</code> không in gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">element (phần tử React)</span><span class="v">object mô tả "ở đây cần thẻ/component nào với props nào" — thứ JSX tạo ra</span></div>
<div class="kv"><span class="k">render (vẽ ra trong bộ nhớ)</span><span class="v">React gọi hàm component để lấy cây element mới; chưa đụng DOM</span></div>
<div class="kv"><span class="k">commit (ghi)</span><span class="v">pha React áp các khác biệt lên DOM thật, rồi chạy ref và effect</span></div>
<div class="kv"><span class="k">reconciliation (đối chiếu)</span><span class="v">so cây element mới với cây cũ để tìm thay đổi tối thiểu; O(n), dựa trên type và key</span></div>
<div class="kv"><span class="k">virtual DOM</span><span class="v">tên phổ biến cho cây element + bước đối chiếu; react.dev hiện gần như không dùng từ này</span></div>
<div class="kv"><span class="k">fiber</span><span class="v">nút công việc nội bộ ứng với mỗi component/thẻ; giữ state, nối bằng child/sibling/return</span></div>
<div class="kv"><span class="k">current / work-in-progress</span><span class="v">hai bản fiber của một component: bản đang trên màn hình và bản đang dựng; commit đổi vai</span></div>
<div class="kv"><span class="k">batching (gom cập nhật)</span><span class="v">nhiều setState trong một nhịp chỉ gây một lần render; tự động mọi nơi từ React 18</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>JSX tạo ra <strong>element</strong> — object mô tả. Gọi component là việc của React, vào lúc React chọn.</li>
<li>Mỗi cập nhật đi qua Trigger → Render → Commit → Paint. Render là tính toán; chỉ commit đụng DOM.</li>
<li>Đo thật: bấm một lần, 7 component render lại, DOM đổi đúng 1 nút chữ; nút <code>&lt;li&gt;</code> vẫn là nút cũ.</li>
<li>Reconciliation O(n): khác <code>type</code> ở cùng chỗ ⇒ vứt cả nhánh (state mất); cùng <code>type</code> ⇒ giữ và cập nhật.</li>
<li>Fiber (React 16) giữ state và hook theo thứ tự trên từng nút, có cặp current/work-in-progress — nền của concurrent rendering.</li>
<li>Nhiều <code>setState</code> trong một nhịp được gom thành một lần render, kể cả trong <code>setTimeout</code> (React 18+).</li>
</ul>

<a class="link-card" href="https://react.dev/learn/render-and-commit" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Render and Commit</span><span class="lc-sub">Ba bước kích hoạt, render, commit — nguồn chính của bài.</span></span></a>
<a class="link-card" href="https://react.dev/learn/understanding-your-ui-as-a-tree" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Understanding Your UI as a Tree</span><span class="lc-sub">Cây render, cây phụ thuộc module.</span></span></a>
<a class="link-card" href="https://react.dev/learn/queueing-a-series-of-state-updates" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Queueing a Series of State Updates</span><span class="lc-sub">Batching và dạng hàm của setState.</span></span></a>
<a class="link-card" href="https://legacy.reactjs.org/docs/reconciliation.html" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">legacy.reactjs.org — Reconciliation</span><span class="lc-sub">Vì sao O(n) và hai giả định (tài liệu cũ, vẫn đúng về ý).</span></span></a>
<a class="link-card" href="https://github.com/acdlite/react-fiber-architecture" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub — React Fiber Architecture (Andrew Clark)</span><span class="lc-sub">Fiber là gì, child/sibling/return, alternate.</span></span></a>
</div>
`,
  },
  {
    title: '11.2 — key and component identity: when React keeps state and when it throws it away|||11.2 — key và danh tính component: khi nào React giữ state, khi nào vứt đi',
    slug: 'rx-11-2-key-identity',
    type: 'LESSON',
    isFreePreview: true,
    description: 'State gắn với vị trí trong cây; key={id} để reset form khi đổi bác sĩ (bug thật của app, đo trước/sau); key = index làm ghi chú trượt; component khai trong component mất focus; reset bằng key thay vì useEffect; Activity để ẩn mà giữ state.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>key and component identity: when React keeps state and when it throws it away</h2>
<p class="lead">Lesson 11.1 left one rule: same type, same spot ⇒ React keeps it. This lesson shows the flip side with a real bug in our booking app — book with Dr An, click through to Dr Huy's page, and Huy's page proudly says "Request sent to Dr Hoàng Đức Huy" although you booked nothing with Huy. The fix is an attribute you thought was only for lists: <code>key</code>.</p>

<p>Small examples live in <code>src/vi-du/bai2.tsx</code>; the real bug lives on the app's <code>/bac-si/:id</code> page (<code>src/features/bac-si/TrangChiTietBacSi.tsx</code>) — the page the project already has after Chapter 10: the doctor's introduction, the time-slot grid, the booking form, and a "same specialty" column to jump to another doctor. Output is REAL, from <code>npx vitest run … --reporter=verbose</code> and from a real Chromium driven by Playwright, on 25 September 2026 (React 19.3.0, React Router 8.4.0, TanStack Query 5.103.2).</p>

<h3>State is tied to a POSITION in the tree, not to the data you pass in</h3>
${slide('rx-11', 9, 'State is tied to a POSITION in the tree, not to the data you pass')}
<p>A note box per doctor, and two buttons to switch between Dr An and Dr Huy. The <code>GhiChu</code> ("note") component writes to a log when it is <strong>mounted</strong> and <strong>unmounted</strong>, along with the doctor it was created for:</p>
<pre><code class="language-tsx">/* ───────── 1. State gắn với VỊ TRÍ, không gắn với "bác sĩ nào" ───────── */
export function GhiChu({ bacSi }: { bacSi: BacSi }) {
  const [chu, setChu] = useState('');
  const [sinhRaCho] = useState(bacSi.id); // nhớ bác sĩ lúc component này được TẠO
  useEffect(() =&gt; {
    nhatKy.push(&#96;mount (tạo cho &#36;{sinhRaCho})&#96;);
    return () =&gt; {
      nhatKy.push(&#96;unmount (tạo cho &#36;{sinhRaCho})&#96;);
    };
  }, [sinhRaCho]);
  return (
    &lt;label&gt;
      Ghi chú cho {bacSi.ten}
      &lt;textarea value={chu} onChange={(e) =&gt; setChu(e.target.value)} /&gt;
    &lt;/label&gt;
  );
}

export function ChonBacSi({ dungKey }: { dungKey: boolean }) {
  const [id, setId] = useState('bs-1');
  const bacSi = danhSachBacSi.find((b) =&gt; b.id === id)!;
  return (
    &lt;div&gt;
      &lt;button type="button" onClick={() =&gt; setId('bs-1')}&gt;
        An
      &lt;/button&gt;
      &lt;button type="button" onClick={() =&gt; setId('bs-5')}&gt;
        Huy
      &lt;/button&gt;
      {dungKey ? &lt;GhiChu key={bacSi.id} bacSi={bacSi} /&gt; : &lt;GhiChu bacSi={bacSi} /&gt;}
    &lt;/div&gt;
  );
}</code></pre>
<p>The test types "Hay quên uống thuốc" ("often forgets to take the medicine") into Dr An's box, then clicks "Huy". The version <strong>without a key</strong>:</p>
<div class="out">[khong key] ô của Huy chứa: "Hay quên uống thuốc"
[khong key] nhật ký: mount (tạo cho bs-1)</div>
<p>The label now says "Ghi chú cho BS. Hoàng Đức Huy", but the box still holds the note written for Dr An ("ô của Huy chứa" = Huy's box contains). The log explains why: during the whole test there is exactly <strong>one</strong> mount — <code>GhiChu</code> was created for <code>bs-1</code> ("tạo cho" = created for) and never unmounted. By the reconciliation rule: last render had a <code>&lt;GhiChu&gt;</code> in that spot, this render also has a <code>&lt;GhiChu&gt;</code> ⇒ same type, same spot ⇒ React <strong>keeps</strong> the component (and its fiber, with the <code>chu</code> state) and only changes the <code>bacSi</code> prop. React does not — cannot — know that to you "Dr An's note" and "Dr Huy's note" are different things. To React, props are just inputs; a component's <strong>identity</strong> is its <em>position</em> in the tree.</p>
<div class="callout"><p><strong>JS quick reminder — destructuring and <code>!</code>.</strong> <code>const [sinhRaCho] = useState(bacSi.id)</code> takes the first element of the array <code>useState</code> returns (array destructuring, Lesson 2.1) and ignores the setter. <code>danhSachBacSi.find(…)!</code> — the trailing <code>!</code> is a promise to TypeScript "this is definitely found, do not treat it as <code>undefined</code>"; nothing is checked at run time.</p></div>

<h3>key is not just for lists: changing the key unmounts the old, mounts a new one</h3>
${slide('rx-11', 10, 'key is not just for lists: a new key means unmount old, mount new')}
<p>In Chapter 1 you used <code>key</code> in <code>.map()</code> so React could tell cards apart. In fact <code>key</code> is part of identity <strong>everywhere</strong>, even for a single element: React treats two elements as "the same component" if and only if they have <em>the same type, the same position and the same key</em>. Without a key, the key is "none" both times, so they match. With <code>key={bacSi.id}</code>, changing doctor changes the key:</p>
<pre><code class="language-tsx">{/* ✗ cùng loại, cùng chỗ: state ở lại */}
&lt;GhiChu bacSi={bacSi} /&gt;

{/* ✓ bác sĩ khác = component khác */}
&lt;GhiChu key={bacSi.id} bacSi={bacSi} /&gt;</code></pre>
<div class="out">[co key] ô của Huy: "" | quay lại An: ""
[co key] nhật ký: mount (tạo cho bs-1) · unmount (tạo cho bs-1) · mount (tạo cho bs-5) · unmount (tạo cho bs-5) · mount (tạo cho bs-1)</div>
<p>Click "Huy": the key goes from <code>bs-1</code> to <code>bs-5</code> ⇒ React <strong>unmounts</strong> An's <code>GhiChu</code> (state lost, effect cleaned up) and <strong>mounts</strong> a new <code>GhiChu</code> for Huy — an empty box. Click "An" again ("quay lại" = go back): unmount and mount again, so An's old note does <em>not come back either</em>. That is exactly what "reset" means: a new key starts from scratch. If you want to remember <em>each</em> doctor's note while switching back and forth, key is not the tool — lift the state into an object <code>{ [bacSiId]: note }</code> in the parent, or keep it in a store/the URL (Chapter 5).</p>
${SD.danhTinhEn}
<div class="callout"><p><strong>JS quick reminder — <code>key</code> is not a prop.</strong> <code>key</code> (like <code>ref</code> before React 19) is read by React to manage elements; the component <strong>does not receive</strong> it in props. If you need the id inside, pass a normal prop as well (<code>bacSi</code> above already carries <code>id</code>). A key only needs to be <strong>unique among siblings</strong> under the same parent, not across the app.</p></div>

<h3>A real bug in the app: Dr Huy's page says "sent" although nothing was booked</h3>
${slide('rx-11', 11, 'A real app bug: Dr Huy’s page says “sent” though nothing was booked')}
<p>Now the real app. This is the doctor page at the chapter's starting point (after Chapter 10). <code>DatLichVoiBacSi</code> ("book with doctor") holds the day being viewed, the chosen slot, and — inside Chapter 3's <code>FormDatLich</code> — the typed text and React Hook Form's "submitted" state:</p>
<pre><code class="language-tsx">/** Trang /bac-si/:id — giới thiệu, chọn giờ + form đặt lịch, và bác sĩ cùng chuyên khoa. */
export function TrangChiTietBacSi() {
  const { id = '' } = useParams();
  const { data: bacSi, isPending, error, refetch, isFetching } = useChiTietBacSi(id);
  const { data: tatCa } = useBacSi();

  if (isPending) return &lt;p aria-busy="true"&gt;Đang tải thông tin bác sĩ…&lt;/p&gt;;
  if (!bacSi) return &lt;LoiTaiDuLieu tieuDe="Không mở được trang bác sĩ" loi={error!} onThuLai={() =&gt; refetch()} dangThuLai={isFetching} /&gt;;

  const cungKhoa = (tatCa ?? []).filter((b) =&gt; b.chuyenKhoa === bacSi.chuyenKhoa &amp;&amp; b.id !== bacSi.id);
  return (
    &lt;div className="trang-bac-si"&gt;
      &lt;section className="chi-tiet" aria-label={&#96;Giới thiệu &#36;{bacSi.ten}&#96;}&gt;
        &lt;h2&gt;{bacSi.ten}&lt;/h2&gt;
        &lt;p className="chuyen-khoa"&gt;
          {TEN_CHUYEN_KHOA[bacSi.chuyenKhoa]} · {bacSi.namKinhNghiem} năm kinh nghiệm
        &lt;/p&gt;
        &lt;p&gt;{bacSi.gioiThieu}&lt;/p&gt;
      &lt;/section&gt;
      &lt;DatLichVoiBacSi bacSi={bacSi} /&gt;
      &lt;aside className="cung-khoa" aria-label="Bác sĩ cùng chuyên khoa"&gt;
        &lt;h3&gt;Cùng chuyên khoa&lt;/h3&gt;
        &lt;ul&gt;
          {cungKhoa.map((b) =&gt; (
            &lt;li key={b.id}&gt;
              &lt;Link to={&#96;/bac-si/&#36;{b.id}&#96;}&gt;{b.ten}&lt;/Link&gt;
            &lt;/li&gt;
          ))}
        &lt;/ul&gt;
      &lt;/aside&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>The "same specialty" column is a list of <code>&lt;Link&gt;</code>s to <code>/bac-si/bs-5</code>… Clicking one, React Router changes the URL but the route is still <code>bac-si/:id</code> ⇒ still the same <code>TrangChiTietBacSi</code> component in the same spot, only <code>id</code> changes. Further down: <code>&lt;DatLichVoiBacSi&gt;</code> is still the same type in the same spot ⇒ React keeps it, with all the state inside. Three tests describe what must be true, run against the starting point:</p>
<div class="out">[doi bac si] lý do: "Đau dạ dày" | nút đang chọn: 01/10/2026
 × đổi sang bác sĩ cùng chuyên khoa ⇒ giờ đã chọn và chữ đã gõ về trắng
[sau khi dat] trang Huy báo: Đã gửi yêu cầu đặt lịch với BS. Hoàng Đức Huy. Phòng khám sẽ gọi lại để xác nhận. | số lịch hẹn trên máy chủ: 1
 × đặt xong với BS. An rồi sang BS. Huy ⇒ trang của Huy KHÔNG báo "đã gửi"
[gio cu] máy chủ/ứng dụng trả lời: Không có khung giờ này
 × chọn giờ của An, sang Huy rồi bấm Đặt lịch ⇒ không được gửi giờ của bác sĩ cũ</div>
<p>Three symptoms of one cause:</p>
<ol>
<li><strong>Typed text follows you.</strong> The reason "Đau dạ dày" (stomach ache) written for Dr An is already in Dr Huy's form.</li>
<li><strong>"Sent" follows you — and changes name.</strong> <code>FormDatLich</code> shows <em>"Đã gửi yêu cầu đặt lịch với {bacSi.ten}"</em> ("request sent to …") when <code>isSubmitSuccessful</code>. That flag is state inside <code>useForm</code> — still <code>true</code> from the submission to An — while <code>bacSi</code> is the new prop. The result is a <em>false</em> sentence: the server has exactly 1 appointment ("số lịch hẹn trên máy chủ: 1"), with Dr An. The Chromium screenshot on the slide is that exact moment.</li>
<li><strong>The slot follows you.</strong> <code>khungGioId</code> is still <code>bs-1-2026-10-01-0800</code> (An's slot). No slot button lights up because Huy's grid has no such id — the user thinks nothing is selected — but clicking "Đặt lịch" sends Dr Huy with An's slot, and the mock server answers 404 "Không có khung giờ này" (no such slot). A less careful real server would have <em>booked the wrong appointment</em>.</li>
</ol>
<p>The fix is one line:</p>
<pre><code class="language-tsx">      {/* Chương 11: key = id bác sĩ ⇒ đổi bác sĩ là component MỚI, mọi state bên trong (ngày, giờ đã chọn,
          chữ trong form, "đã gửi") bắt đầu lại từ đầu. Không có key: React giữ nguyên vì cùng loại, cùng vị trí. */}
      &lt;DatLichVoiBacSi key={bacSi.id} bacSi={bacSi} /&gt;</code></pre>
<div class="out"> ✓ đổi sang bác sĩ cùng chuyên khoa ⇒ giờ đã chọn và chữ đã gõ về trắng
 ✓ đặt xong với BS. An rồi sang BS. Huy ⇒ trang của Huy KHÔNG báo "đã gửi"
 ✓ chọn giờ của An, sang Huy rồi bấm Đặt lịch ⇒ không được gửi giờ của bác sĩ cũ
[doi bac si] lý do: "" | nút đang chọn: 01/10/2026
[sau khi dat] trang Huy báo: (không có) | số lịch hẹn trên máy chủ: 1
[gio cu] máy chủ/ứng dụng trả lời: Hãy chọn một khung giờ trước</div>
<p>Change doctor ⇒ the key changes ⇒ the whole <code>DatLichVoiBacSi</code> subtree — day, slot, <code>useForm</code> with everything inside, even the <code>useDatLich</code> mutation — is a new component. No "reset" line, no need to remember every piece of state to clear (and nothing to update when someone adds a fourth piece of state later). The last line now says "please choose a slot first" instead of sending An's slot.</p>
<div class="pitfall co-tieu-de"><strong>Trap — the bug hides behind the "Loading…" screen.</strong> When rebuilding the starting point, these three tests were at first <strong>green</strong> without any key. The reason: each time <code>id</code> changed, <code>useChiTietBacSi</code> was a new query ⇒ <code>isPending</code> ⇒ the page returned <code>&lt;p&gt;Đang tải…&lt;/p&gt;</code> ⇒ <code>DatLichVoiBacSi</code> was unmounted, then mounted again when data arrived. The loading screen accidentally did the key's job. As soon as a reasonable optimisation was added — take the doctor from the list cache with <code>initialData</code> so the page appears instantly without flashing — the loading screen disappeared and the bug came out. Lesson: do not rely on a side effect to reset state; state your intent with <code>key</code>.</div>
<pre><code class="language-ts">/**
 * Một bác sĩ theo id (trang /bac-si/:id). Danh sách đã tải thì LẤY SẴN từ cache của danh sách (initialData):
 * bấm vào một bác sĩ là trang hiện ngay, không nháy "Đang tải…".
 */
export function useChiTietBacSi(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: khoa.chiTietBacSi(id),
    queryFn: ({ signal }) =&gt; api.bacSi(id, signal),
    staleTime: 5 * 60_000,
    initialData: () =&gt; queryClient.getQueryData&lt;BacSi[]&gt;(khoa.bacSi)?.find((b) =&gt; b.id === id),
    initialDataUpdatedAt: () =&gt; queryClient.getQueryState(khoa.bacSi)?.dataUpdatedAt,
  });
}</code></pre>

<h3>Keys in lists: with index keys, notes slide onto someone else</h3>
${slide('rx-11', 12, 'key = index: delete the first row, the notes slide to another doctor')}
<p>Reconciliation's second assumption: in a list, the key tells React which item is which. Chapter 1 said "do not use the index". Now we measure why — three note rows, each with its own state:</p>
<pre><code class="language-tsx">/* ───────── 2. key trong danh sách: index vs id ───────── */
function DongGhiChu({ bacSi, onXoa }: { bacSi: BacSi; onXoa: () =&gt; void }) {
  const [chu, setChu] = useState('');
  return (
    &lt;li&gt;
      &lt;input aria-label={&#96;Ghi chú &#36;{bacSi.ten}&#96;} value={chu} onChange={(e) =&gt; setChu(e.target.value)} /&gt;
      &lt;button type="button" onClick={onXoa}&gt;
        Xoá {bacSi.ten}
      &lt;/button&gt;
    &lt;/li&gt;
  );
}

export function DanhSachGhiChu({ keyLa }: { keyLa: 'index' | 'id' }) {
  const [ds, setDs] = useState(danhSachBacSi.slice(0, 3));
  return (
    &lt;ul&gt;
      {ds.map((bs, i) =&gt; (
        &lt;DongGhiChu key={keyLa === 'index' ? i : bs.id} bacSi={bs} onXoa={() =&gt; setDs(ds.filter((x) =&gt; x.id !== bs.id))} /&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre>
<div class="out">[key=index] sau khi xoá An: BS. Trần Thu Hà="tái khám" | BS. Lê Quốc Bảo="bé sốt"
[key=id] sau khi xoá An: BS. Trần Thu Hà="bé sốt" | BS. Lê Quốc Bảo=""</div>
<p>Before deleting: An = "tái khám" (follow-up visit), Hà = "bé sốt" (child has a fever). Delete An's row ("sau khi xoá An" = after deleting An):</p>
<ul>
<li><strong>key = index.</strong> Before: key 0 (An), 1 (Hà), 2 (Bảo). After: key 0 (Hà), 1 (Bảo). React matches by key: key 0 still exists ⇒ keep the component at key 0 <em>with its "tái khám" state</em>, just change props to Hà; key 1 keeps "bé sốt", props become Bảo; key 2 disappeared ⇒ unmount the <strong>last</strong> row. State follows the key, props follow the data ⇒ they drift apart: An's "tái khám" now sits under Hà's name.</li>
<li><strong>key = id.</strong> <code>bs-1</code> disappeared ⇒ unmount exactly An's row; <code>bs-2</code>, <code>bs-3</code> stay with their state.</li>
</ul>
${SD.indexEn}
<p>Index is only safe when the list <strong>never</strong> adds, removes or reorders <em>and</em> rows hold no state (no inputs, no stateful components inside). Server data comes with ids — use them. Data created on the user's machine (a new note row) gets an id at creation time, e.g. <code>crypto.randomUUID()</code>, stored with the data.</p>
<div class="pitfall co-tieu-de"><strong>Trap — <code>key={Math.random()}</code> to "silence the warning".</strong> The "Each child in a list should have a unique key" warning goes away, but a new key on every render means every row is unmounted and remounted <em>every time</em> the parent renders: lost focus, lost typing, and slow. Worse than the index. <code>crypto.randomUUID()</code> is only right when called <strong>once, when the data is created</strong>, never in JSX.</div>

<h3>Defining a component inside a component: every keystroke is a mount</h3>
${slide('rx-11', 13, 'A component defined inside a component: every keystroke is a mount')}
<p>The "same type" rule has a surprising consequence. A component's "type" is <strong>the function itself</strong> — compared with <code>===</code>. Define a component function inside another component, and every time the parent renders, that function is created <em>anew</em>:</p>
<pre><code class="language-tsx">/* ───────── 3. Khai báo component BÊN TRONG component khác ───────── */
export function OTimLongNhau() {
  const [tuKhoa, setTuKhoa] = useState('');
  // ✗ Mỗi lần OTimLongNhau render, dòng dưới tạo ra một HÀM MỚI ⇒ React thấy một "loại" component mới.
  function OTim() {
    useEffect(() =&gt; {
      nhatKy.push('mount OTim');
    }, []);
    return &lt;input aria-label="Tìm bác sĩ" value={tuKhoa} onChange={(e) =&gt; setTuKhoa(e.target.value)} /&gt;;
  }
  return &lt;OTim /&gt;;
}

function OTimNgoai({ tuKhoa, onDoi }: { tuKhoa: string; onDoi: (s: string) =&gt; void }) {
  useEffect(() =&gt; {
    nhatKy.push('mount OTim');
  }, []);
  return &lt;input aria-label="Tìm bác sĩ" value={tuKhoa} onChange={(e) =&gt; onDoi(e.target.value)} /&gt;;
}

export function OTimTachRieng() {
  const [tuKhoa, setTuKhoa] = useState('');
  return &lt;OTimNgoai tuKhoa={tuKhoa} onDoi={setTuKhoa} /&gt;; // ✓ OTimNgoai khai MỘT lần, ở cấp module
}</code></pre>
<div class="out">[long nhau] ô chứa: "h" | số lần mount: 2 | focus đang ở: BODY
[tach rieng] ô chứa: "huy" | số lần mount: 1 | focus đang ở: INPUT</div>
<p><strong>Step by step</strong> with the nested version ("long nhau"), typing "huy":</p>
<ol>
<li>Type "h": <code>setTuKhoa('h')</code> ⇒ <code>OTimLongNhau</code> re-renders ⇒ the line <code>function OTim() {…}</code> runs again, creating a <strong>different</strong> <code>OTim</code> function (not <code>===</code> to last time's).</li>
<li>React compares: last time this spot had an element whose <code>type</code> was the old OTim function, now it is the new one ⇒ different type ⇒ unmount the old input, mount a new one (log: mount #2). The new input has the right text "h" (its <code>value</code> comes from the parent's state) but it is <strong>a different DOM node</strong>, and focus does not move to it.</li>
<li>Focus falls back to <code>&lt;body&gt;</code> ("focus đang ở: BODY"). "u" and "y" are typed into… nothing.</li>
</ol>
<p>In real life the symptom is "the search box loses focus after one letter", or "every keystroke makes the list below flash and scroll to the top". Fix: define every component at <strong>module level</strong> (outside other functions) and pass data in with props. If you feel like nesting "so it can use the parent's variables", that is exactly what props are for.</p>

<h3>Reset with key, not with useEffect — and hide-but-keep with Activity</h3>
${slide('rx-11', 14, 'Reset with key is right at once; with useEffect it is wrong for one beat')}
<p>Before learning the key trick, many people reset state on a prop change with an effect: <code>useEffect(() =&gt; setChu(''), [bacSi.id])</code>. It "works". Counting renders shows the cost:</p>
<pre><code class="language-tsx">/* ───────── 4. Reset bằng effect (chậm một nhịp) vs reset bằng key ───────── */
export const khungHinh: string[] = [];

function GhiChuResetBangEffect({ bacSi }: { bacSi: BacSi }) {
  const [chu, setChu] = useState('');
  useEffect(() =&gt; {
    setChu(''); // ✗ chạy SAU khi đã vẽ một lần với chữ cũ
  }, [bacSi.id]);
  khungHinh.push(&#96;&#36;{bacSi.id}:"&#36;{chu}"&#96;);
  return &lt;textarea aria-label="Ghi chú" value={chu} onChange={(e) =&gt; setChu(e.target.value)} /&gt;;
}

function GhiChuThuong({ bacSi }: { bacSi: BacSi }) {
  const [chu, setChu] = useState('');
  khungHinh.push(&#96;&#36;{bacSi.id}:"&#36;{chu}"&#96;);
  return &lt;textarea aria-label="Ghi chú" value={chu} onChange={(e) =&gt; setChu(e.target.value)} /&gt;;
}

export function SoSanhReset({ cach }: { cach: 'effect' | 'key' }) {
  const [id, setId] = useState('bs-1');
  const bacSi = danhSachBacSi.find((b) =&gt; b.id === id)!;
  return (
    &lt;div&gt;
      &lt;button type="button" onClick={() =&gt; setId('bs-5')}&gt;
        Sang Huy
      &lt;/button&gt;
      {cach === 'effect' ? &lt;GhiChuResetBangEffect bacSi={bacSi} /&gt; : &lt;GhiChuThuong key={bacSi.id} bacSi={bacSi} /&gt;}
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">[reset effect] các lần render sau khi đổi: bs-5:"ab" → bs-5:""
[reset key]    các lần render sau khi đổi: bs-5:""</div>
<p>With the effect, the first render after switching is <code>bs-5:"ab"</code> — the NEW doctor with the OLD text. React commits it, the effect runs, calls <code>setChu('')</code>, and only then does a second, correct render happen. So there is always one beat of wrong UI (which can flash on screen), every child renders twice, and if a child has an effect calling an API with that text, it calls with the wrong data. With the key: one render, right the first time. This is also react.dev's recommendation in "You Might Not Need an Effect" (<em>Resetting all state when a prop changes</em>).</p>
${SD.resetEn}
<p>The opposite direction has a tool too. Sometimes you want to <strong>hide</strong> part of the UI but <strong>keep</strong> its state — a half-written "Notes" tab, switch to the "Schedule" tab and back. Hiding with <code>&amp;&amp;</code> unmounts the component (state lost). Since React 19.2 there is <code>&lt;Activity&gt;</code>:</p>
<pre><code class="language-tsx">/* ───────── 5. Ẩn mà vẫn GIỮ state: &lt;Activity&gt; (React 19.2+) ───────── */
function GhiChuTab() {
  const [chu, setChu] = useState('');
  return &lt;textarea aria-label="Ghi chú tab" value={chu} onChange={(e) =&gt; setChu(e.target.value)} /&gt;;
}
export function HaiTab({ cach }: { cach: 'dieu-kien' | 'activity' }) {
  const [tab, setTab] = useState&lt;'ghi-chu' | 'lich'&gt;('ghi-chu');
  return (
    &lt;div&gt;
      &lt;button type="button" onClick={() =&gt; setTab('ghi-chu')}&gt;
        Tab ghi chú
      &lt;/button&gt;
      &lt;button type="button" onClick={() =&gt; setTab('lich')}&gt;
        Tab lịch
      &lt;/button&gt;
      {cach === 'dieu-kien' ? (
        tab === 'ghi-chu' &amp;&amp; &lt;GhiChuTab /&gt;
      ) : (
        &lt;Activity mode={tab === 'ghi-chu' ? 'visible' : 'hidden'}&gt;
          &lt;GhiChuTab /&gt;
        &lt;/Activity&gt;
      )}
      {tab === 'lich' &amp;&amp; &lt;p&gt;Lịch khám tuần này&lt;/p&gt;}
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">[dieu-kien] lúc ẩn: ô KHÔNG còn trong DOM | quay lại: ""
[activity] lúc ẩn: ô VẪN trong DOM | quay lại: "hỏi về thuốc"</div>
<p>("lúc ẩn" = while hidden; "KHÔNG còn trong DOM" = no longer in the DOM; "VẪN trong DOM" = still in the DOM; "quay lại" = after coming back.) Per react.dev, with <code>mode="hidden"</code> React hides the children with <code>display: none</code>, <strong>destroys their effects</strong> (timers and subscriptions are cleaned up), but keeps state and DOM nodes; switching back to <code>"visible"</code> shows them with their previous state and re-creates the effects. Good for tabs, dashboards, screens users often return to. Do not overuse it: hidden content still uses memory and still re-renders (at low priority) when its props change.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>In FER202 labs, <code>key</code> usually appears only to silence the warning in <code>.map()</code> — often <code>key={index}</code> — and to "refresh a form" when data changes you write <code>componentDidUpdate</code>/<code>useEffect</code> calling <code>setState</code> back to empty → At a company, key is an <strong>identity tool</strong>: server ids for lists, <code>key={id}</code> on components that must start over when the data changes (edit-profile forms, detail pages sharing a route), and code review questions every <code>key={index}</code> on a stateful row. · <em>Why:</em> resetting in an effect always has one beat of wrong data on screen and requires listing every piece of state by hand; key does it completely, in one render. The FER202 way is not wrong for static, display-only lists — and you will still see <code>componentDidUpdate</code> in old class projects.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "Why shouldn't you use the index as a key? And what does key do outside lists?"</p>
<p>A key is how React recognises an item between two renders; state is tied to that identity (type + position + key). With index keys, adding/removing/reordering shifts identities: one row's state follows another row — I measured it: deleting the first row moved the first person's "follow-up" note onto the second person. Use a stable id from the data. Outside lists, changing a component's key is the standard way to reset all its state when the data changes — e.g. <code>&lt;Form key={doctor.id} /&gt;</code> on a detail page that shares a route — better than resetting in useEffect because there is no beat showing old data. And never <code>key={Math.random()}</code>.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> in your <code>src/vi-du/bai2.tsx</code>, rebuild two experiments and add a reordering one.</p><ol>
<li>Copy <code>DanhSachGhiChu</code>. Add a "Reverse order" button calling <code>setDs([...ds].reverse())</code>.</li>
<li>Write a test for the <code>key = index</code> version: type "tái khám" into An's row, click "Reverse order", then print each input's value next to its doctor's name. Repeat with <code>key = id</code>.</li>
<li>Copy <code>ChonBacSi</code> and change it so it <strong>remembers</strong> each doctor's note when switching back and forth (hint: a <code>Record&lt;string, string&gt;</code> state in <code>ChonBacSi</code>; <code>GhiChu</code> receives <code>chu</code> and <code>onDoi</code> via props).</li>
</ol><p><strong>Done when:</strong> with index keys, after reversing, "tái khám" sits in Dr Lê Quốc Bảo's input (the new first row); with id keys, "tái khám" stays in Dr Nguyễn Minh An's input; step 3 has a test: type for An, switch to Huy (empty), back to An shows the old text; <code>npx tsc -b</code> is clean.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">identity</span><span class="v">type + position in the tree + key; state is attached to this identity</span></div>
<div class="kv"><span class="k">mount / unmount</span><span class="v">React creates a new component (state initialised, effects run) / removes it (state lost, effects cleaned up)</span></div>
<div class="kv"><span class="k">key</span><span class="v">an identity label you set; new key = new component; only unique among siblings</span></div>
<div class="kv"><span class="k">resetting state with a key</span><span class="v"><code>&lt;X key={id} /&gt;</code>: new data starts from scratch, in one render</span></div>
<div class="kv"><span class="k">stable key</span><span class="v">an id that does not change between renders — a server id or one assigned once at creation</span></div>
<div class="kv"><span class="k">nested component definition</span><span class="v">defining a component inside a component ⇒ a new type each render ⇒ constant unmount/mount</span></div>
<div class="kv"><span class="k">Activity</span><span class="v"><code>&lt;Activity mode="hidden"&gt;</code> (React 19.2+): hide while keeping state, effects destroyed</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>React keeps state when type, position and key are the same — whoever's data the props now carry.</li>
<li>Changing <code>key</code> unmounts the old and mounts a new one: the standard way to reset all state when data changes.</li>
<li>Real app bug: without a key, Dr Huy's page said "sent" and submitted Dr An's slot; one line, <code>key={bacSi.id}</code>, fixed all three symptoms.</li>
<li><code>key = index</code> makes state drift on add/remove/reorder; use stable ids, never <code>Math.random()</code>.</li>
<li>A component defined inside another is a new type each render ⇒ lost focus, lost state. Define at module level.</li>
<li>Resetting with a key is right in one render; resetting with an effect has one wrong beat. Hide but keep state: <code>&lt;Activity&gt;</code>.</li>
</ul>

<a class="link-card" href="https://react.dev/learn/preserving-and-resetting-state" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Preserving and Resetting State</span><span class="lc-sub">State tied to position; resetting with a key — the lesson's main source.</span></span></a>
<a class="link-card" href="https://react.dev/learn/rendering-lists" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Rendering Lists</span><span class="lc-sub">The rules of keys, and why not the index.</span></span></a>
<a class="link-card" href="https://react.dev/learn/you-might-not-need-an-effect" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — You Might Not Need an Effect</span><span class="lc-sub">"Resetting all state when a prop changes".</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/Activity" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — &lt;Activity&gt;</span><span class="lc-sub">Hide part of the UI while keeping its state.</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>key và danh tính component: khi nào React giữ state, khi nào vứt đi</h2>
<p class="lead">Bài 11.1 để lại một luật: cùng loại, cùng vị trí thì React giữ. Bài này cho thấy mặt trái của luật đó bằng một bug có thật trong app đặt lịch của chúng ta — đặt lịch với BS. An xong, bấm sang trang BS. Huy, và trang của Huy tự hào báo "Đã gửi yêu cầu đặt lịch với BS. Hoàng Đức Huy" dù bạn chưa đặt gì với Huy cả. Cách chữa là một thuộc tính mà bạn tưởng chỉ dùng cho danh sách: <code>key</code>.</p>

<p>Ví dụ nhỏ nằm ở <code>src/vi-du/bai2.tsx</code>; bug thật nằm ở trang <code>/bac-si/:id</code> của app (<code>src/features/bac-si/TrangChiTietBacSi.tsx</code>) — trang mà dự án sau Chương 10 đã có: giới thiệu bác sĩ, lưới giờ khám, form đặt lịch, và cột "Cùng chuyên khoa" để nhảy sang bác sĩ khác. Output là THẬT, từ <code>npx vitest run … --reporter=verbose</code> và từ Chromium thật qua Playwright, ngày 25/09/2026 (React 19.3.0, React Router 8.4.0, TanStack Query 5.103.2).</p>

<h3>State gắn với VỊ TRÍ trong cây, không gắn với dữ liệu bạn truyền vào</h3>
${slide('rx-11', 9, 'State gắn với VỊ TRÍ trong cây, không gắn với dữ liệu bạn truyền')}
<p>Một ô ghi chú cho từng bác sĩ, và hai nút để chuyển giữa BS. An và BS. Huy. Component <code>GhiChu</code> ghi vào nhật ký lúc nó được <strong>tạo</strong> (mount) và lúc bị <strong>gỡ</strong> (unmount), kèm tên bác sĩ lúc nó được tạo ra:</p>
<pre><code class="language-tsx">/* ───────── 1. State gắn với VỊ TRÍ, không gắn với "bác sĩ nào" ───────── */
export function GhiChu({ bacSi }: { bacSi: BacSi }) {
  const [chu, setChu] = useState('');
  const [sinhRaCho] = useState(bacSi.id); // nhớ bác sĩ lúc component này được TẠO
  useEffect(() =&gt; {
    nhatKy.push(&#96;mount (tạo cho &#36;{sinhRaCho})&#96;);
    return () =&gt; {
      nhatKy.push(&#96;unmount (tạo cho &#36;{sinhRaCho})&#96;);
    };
  }, [sinhRaCho]);
  return (
    &lt;label&gt;
      Ghi chú cho {bacSi.ten}
      &lt;textarea value={chu} onChange={(e) =&gt; setChu(e.target.value)} /&gt;
    &lt;/label&gt;
  );
}

export function ChonBacSi({ dungKey }: { dungKey: boolean }) {
  const [id, setId] = useState('bs-1');
  const bacSi = danhSachBacSi.find((b) =&gt; b.id === id)!;
  return (
    &lt;div&gt;
      &lt;button type="button" onClick={() =&gt; setId('bs-1')}&gt;
        An
      &lt;/button&gt;
      &lt;button type="button" onClick={() =&gt; setId('bs-5')}&gt;
        Huy
      &lt;/button&gt;
      {dungKey ? &lt;GhiChu key={bacSi.id} bacSi={bacSi} /&gt; : &lt;GhiChu bacSi={bacSi} /&gt;}
    &lt;/div&gt;
  );
}</code></pre>
<p>Test gõ "Hay quên uống thuốc" vào ô của BS. An, rồi bấm "Huy". Bản <strong>không có key</strong>:</p>
<div class="out">[khong key] ô của Huy chứa: "Hay quên uống thuốc"
[khong key] nhật ký: mount (tạo cho bs-1)</div>
<p>Nhãn đã đổi thành "Ghi chú cho BS. Hoàng Đức Huy", nhưng trong ô vẫn là ghi chú viết cho BS. An. Nhật ký cho biết lý do: suốt cả test chỉ có <strong>một</strong> lần mount — <code>GhiChu</code> được tạo cho <code>bs-1</code> và không bao giờ bị gỡ. Theo luật của reconciliation: lần render trước ở vị trí đó là một <code>&lt;GhiChu&gt;</code>, lần này cũng là một <code>&lt;GhiChu&gt;</code> ⇒ cùng loại, cùng vị trí ⇒ React <strong>giữ</strong> component (và fiber của nó, cùng state <code>chu</code>), chỉ đổi props <code>bacSi</code>. React không biết — và không thể biết — rằng với bạn, "ghi chú của BS. An" và "ghi chú của BS. Huy" là hai thứ khác nhau. Với React, props chỉ là đầu vào; <strong>danh tính</strong> của component là <em>vị trí</em> của nó trong cây.</p>
<div class="callout"><p><strong>JS nhắc nhanh — destructuring có giá trị mặc định và <code>!</code>.</strong> <code>const [sinhRaCho] = useState(bacSi.id)</code> lấy phần tử đầu của mảng mà <code>useState</code> trả về (destructuring mảng, Bài 2.1) và bỏ qua hàm set. <code>danhSachBacSi.find(…)!</code> — dấu <code>!</code> cuối là lời hứa với TypeScript "chắc chắn tìm thấy, đừng coi là <code>undefined</code>"; nó không kiểm gì lúc chạy.</p></div>

<h3>key không chỉ dành cho danh sách: đổi key là gỡ cái cũ, dựng cái mới</h3>
${slide('rx-11', 10, 'key không chỉ cho danh sách: đổi key là gỡ cũ, dựng mới')}
<p>Ở Chương 1 bạn dùng <code>key</code> trong <code>.map()</code> để React phân biệt các thẻ. Thực ra <code>key</code> là một phần của danh tính ở <strong>mọi</strong> chỗ, kể cả khi chỉ có một element: React coi hai element là "cùng một component" khi và chỉ khi <em>cùng loại, cùng vị trí và cùng key</em>. Không ghi key thì key là "không có" ở cả hai lần, nên chúng bằng nhau. Ghi <code>key={bacSi.id}</code> thì đổi bác sĩ là đổi key:</p>
<pre><code class="language-tsx">{/* ✗ cùng loại, cùng chỗ: state ở lại */}
&lt;GhiChu bacSi={bacSi} /&gt;

{/* ✓ bác sĩ khác = component khác */}
&lt;GhiChu key={bacSi.id} bacSi={bacSi} /&gt;</code></pre>
<div class="out">[co key] ô của Huy: "" | quay lại An: ""
[co key] nhật ký: mount (tạo cho bs-1) · unmount (tạo cho bs-1) · mount (tạo cho bs-5) · unmount (tạo cho bs-5) · mount (tạo cho bs-1)</div>
<p>Bấm "Huy": key đổi từ <code>bs-1</code> sang <code>bs-5</code> ⇒ React <strong>gỡ</strong> <code>GhiChu</code> của An (state mất, effect dọn) và <strong>dựng</strong> một <code>GhiChu</code> mới cho Huy — ô trắng. Bấm lại "An": lại gỡ và dựng, nên ghi chú cũ của An <em>cũng không quay lại</em>. Đó là đúng nghĩa "reset": key đổi là làm lại từ đầu. Nếu bạn muốn nhớ ghi chú của <em>từng</em> bác sĩ khi chuyển qua lại, key không phải công cụ — hãy nâng state lên thành một object <code>{ [bacSiId]: ghiChu }</code> ở cha, hoặc lưu vào store/URL (Chương 5).</p>
${SD.danhTinhVi}
<div class="callout"><p><strong>JS nhắc nhanh — <code>key</code> không phải một prop.</strong> <code>key</code> (cũng như <code>ref</code> trước React 19) là thuộc tính React đọc để quản lý element; component <strong>không nhận được</strong> nó qua props. Cần id bên trong thì truyền thêm một prop bình thường (<code>bacSi</code> ở trên đã mang <code>id</code>). key chỉ cần <strong>duy nhất giữa các anh em</strong> trong cùng một cha, không cần duy nhất toàn app.</p></div>

<h3>Bug thật trong app: trang BS. Huy báo "đã gửi" dù chưa đặt gì</h3>
${slide('rx-11', 11, 'Bug thật trong app: trang BS. Huy báo “đã gửi” dù chưa đặt gì')}
<p>Giờ tới app thật. Đây là trang chi tiết bác sĩ ở điểm xuất phát của chương (sau Chương 10). <code>DatLichVoiBacSi</code> giữ ngày đang xem, khung giờ đã chọn, và — bên trong <code>FormDatLich</code> của Chương 3 — chữ đã gõ cùng trạng thái "đã gửi" của React Hook Form:</p>
<pre><code class="language-tsx">/** Trang /bac-si/:id — giới thiệu, chọn giờ + form đặt lịch, và bác sĩ cùng chuyên khoa. */
export function TrangChiTietBacSi() {
  const { id = '' } = useParams();
  const { data: bacSi, isPending, error, refetch, isFetching } = useChiTietBacSi(id);
  const { data: tatCa } = useBacSi();

  if (isPending) return &lt;p aria-busy="true"&gt;Đang tải thông tin bác sĩ…&lt;/p&gt;;
  if (!bacSi) return &lt;LoiTaiDuLieu tieuDe="Không mở được trang bác sĩ" loi={error!} onThuLai={() =&gt; refetch()} dangThuLai={isFetching} /&gt;;

  const cungKhoa = (tatCa ?? []).filter((b) =&gt; b.chuyenKhoa === bacSi.chuyenKhoa &amp;&amp; b.id !== bacSi.id);
  return (
    &lt;div className="trang-bac-si"&gt;
      &lt;section className="chi-tiet" aria-label={&#96;Giới thiệu &#36;{bacSi.ten}&#96;}&gt;
        &lt;h2&gt;{bacSi.ten}&lt;/h2&gt;
        &lt;p className="chuyen-khoa"&gt;
          {TEN_CHUYEN_KHOA[bacSi.chuyenKhoa]} · {bacSi.namKinhNghiem} năm kinh nghiệm
        &lt;/p&gt;
        &lt;p&gt;{bacSi.gioiThieu}&lt;/p&gt;
      &lt;/section&gt;
      &lt;DatLichVoiBacSi bacSi={bacSi} /&gt;
      &lt;aside className="cung-khoa" aria-label="Bác sĩ cùng chuyên khoa"&gt;
        &lt;h3&gt;Cùng chuyên khoa&lt;/h3&gt;
        &lt;ul&gt;
          {cungKhoa.map((b) =&gt; (
            &lt;li key={b.id}&gt;
              &lt;Link to={&#96;/bac-si/&#36;{b.id}&#96;}&gt;{b.ten}&lt;/Link&gt;
            &lt;/li&gt;
          ))}
        &lt;/ul&gt;
      &lt;/aside&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>Cột "Cùng chuyên khoa" là các <code>&lt;Link&gt;</code> sang <code>/bac-si/bs-5</code>… Bấm vào đó, React Router đổi URL nhưng route vẫn là <code>bac-si/:id</code> ⇒ vẫn cùng component <code>TrangChiTietBacSi</code> ở cùng chỗ, chỉ <code>id</code> đổi. Đi xuống cây: <code>&lt;DatLichVoiBacSi&gt;</code> vẫn cùng loại, cùng vị trí ⇒ React giữ nó, cùng toàn bộ state bên trong. Ba test mô tả điều phải đúng, chạy trên điểm xuất phát:</p>
<div class="out">[doi bac si] lý do: "Đau dạ dày" | nút đang chọn: 01/10/2026
 × đổi sang bác sĩ cùng chuyên khoa ⇒ giờ đã chọn và chữ đã gõ về trắng
[sau khi dat] trang Huy báo: Đã gửi yêu cầu đặt lịch với BS. Hoàng Đức Huy. Phòng khám sẽ gọi lại để xác nhận. | số lịch hẹn trên máy chủ: 1
 × đặt xong với BS. An rồi sang BS. Huy ⇒ trang của Huy KHÔNG báo "đã gửi"
[gio cu] máy chủ/ứng dụng trả lời: Không có khung giờ này
 × chọn giờ của An, sang Huy rồi bấm Đặt lịch ⇒ không được gửi giờ của bác sĩ cũ</div>
<p>Ba triệu chứng của cùng một nguyên nhân:</p>
<ol>
<li><strong>Chữ đã gõ đi theo.</strong> Lý do khám "Đau dạ dày" viết cho BS. An nằm sẵn trong form của BS. Huy.</li>
<li><strong>"Đã gửi" đi theo, và còn đổi tên.</strong> <code>FormDatLich</code> hiện <em>"Đã gửi yêu cầu đặt lịch với {bacSi.ten}"</em> khi <code>isSubmitSuccessful</code>. Cờ đó là state bên trong <code>useForm</code> — vẫn <code>true</code> từ lần gửi với An — còn <code>bacSi</code> là props mới. Kết quả là một câu <em>sai sự thật</em>: máy chủ có đúng 1 lịch hẹn, với BS. An. Ảnh chụp Chromium ở slide trên là đúng khoảnh khắc đó.</li>
<li><strong>Khung giờ đi theo.</strong> <code>khungGioId</code> vẫn là <code>bs-1-2026-10-01-0800</code> (giờ của An). Nút giờ không sáng lên vì lưới giờ của Huy không có id đó — người dùng tưởng chưa chọn gì — nhưng bấm "Đặt lịch" thì form gửi bác sĩ Huy kèm giờ của An, và máy chủ giả trả 404 "Không có khung giờ này". Máy chủ thật kém cẩn thận hơn thì đã <em>đặt nhầm lịch</em>.</li>
</ol>
<p>Cách chữa là một dòng:</p>
<pre><code class="language-tsx">      {/* Chương 11: key = id bác sĩ ⇒ đổi bác sĩ là component MỚI, mọi state bên trong (ngày, giờ đã chọn,
          chữ trong form, "đã gửi") bắt đầu lại từ đầu. Không có key: React giữ nguyên vì cùng loại, cùng vị trí. */}
      &lt;DatLichVoiBacSi key={bacSi.id} bacSi={bacSi} /&gt;</code></pre>
<div class="out"> ✓ đổi sang bác sĩ cùng chuyên khoa ⇒ giờ đã chọn và chữ đã gõ về trắng
 ✓ đặt xong với BS. An rồi sang BS. Huy ⇒ trang của Huy KHÔNG báo "đã gửi"
 ✓ chọn giờ của An, sang Huy rồi bấm Đặt lịch ⇒ không được gửi giờ của bác sĩ cũ
[doi bac si] lý do: "" | nút đang chọn: 01/10/2026
[sau khi dat] trang Huy báo: (không có) | số lịch hẹn trên máy chủ: 1
[gio cu] máy chủ/ứng dụng trả lời: Hãy chọn một khung giờ trước</div>
<p>Đổi bác sĩ ⇒ key đổi ⇒ cả cây con <code>DatLichVoiBacSi</code> — ngày, giờ, <code>useForm</code> với mọi thứ bên trong, cả mutation <code>useDatLich</code> — là component mới. Không cần một dòng "reset" nào, không cần nhớ hết những state phải xoá (và không cần sửa lại khi ai đó thêm state thứ tư vào sau này).</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — bug trốn sau màn hình "Đang tải…".</strong> Khi dựng lại điểm xuất phát, ba test trên ban đầu <strong>xanh</strong> dù chưa có key. Lý do: mỗi lần đổi <code>id</code>, <code>useChiTietBacSi</code> là query mới ⇒ <code>isPending</code> ⇒ trang trả về <code>&lt;p&gt;Đang tải…&lt;/p&gt;</code> ⇒ <code>DatLichVoiBacSi</code> bị gỡ, rồi dựng lại khi dữ liệu về. Màn hình tải vô tình làm việc của key. Tới khi thêm một tối ưu hợp lý — lấy sẵn bác sĩ từ cache danh sách bằng <code>initialData</code> để trang hiện ngay không nháy — màn hình tải biến mất và bug lộ ra. Bài học: đừng dựa vào một hiệu ứng phụ để reset state; nói thẳng ý định bằng <code>key</code>.</div>
<pre><code class="language-ts">/**
 * Một bác sĩ theo id (trang /bac-si/:id). Danh sách đã tải thì LẤY SẴN từ cache của danh sách (initialData):
 * bấm vào một bác sĩ là trang hiện ngay, không nháy "Đang tải…".
 */
export function useChiTietBacSi(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: khoa.chiTietBacSi(id),
    queryFn: ({ signal }) =&gt; api.bacSi(id, signal),
    staleTime: 5 * 60_000,
    initialData: () =&gt; queryClient.getQueryData&lt;BacSi[]&gt;(khoa.bacSi)?.find((b) =&gt; b.id === id),
    initialDataUpdatedAt: () =&gt; queryClient.getQueryState(khoa.bacSi)?.dataUpdatedAt,
  });
}</code></pre>

<h3>key trong danh sách: dùng index thì ghi chú trượt sang người khác</h3>
${slide('rx-11', 12, 'key = index: xoá dòng đầu, ghi chú trượt sang bác sĩ khác')}
<p>Giả định thứ hai của reconciliation: trong danh sách, key cho React biết phần tử nào là phần tử nào. Chương 1 đã dặn "đừng dùng index". Giờ ta đo xem vì sao — ba dòng ghi chú, mỗi dòng có state riêng:</p>
<pre><code class="language-tsx">/* ───────── 2. key trong danh sách: index vs id ───────── */
function DongGhiChu({ bacSi, onXoa }: { bacSi: BacSi; onXoa: () =&gt; void }) {
  const [chu, setChu] = useState('');
  return (
    &lt;li&gt;
      &lt;input aria-label={&#96;Ghi chú &#36;{bacSi.ten}&#96;} value={chu} onChange={(e) =&gt; setChu(e.target.value)} /&gt;
      &lt;button type="button" onClick={onXoa}&gt;
        Xoá {bacSi.ten}
      &lt;/button&gt;
    &lt;/li&gt;
  );
}

export function DanhSachGhiChu({ keyLa }: { keyLa: 'index' | 'id' }) {
  const [ds, setDs] = useState(danhSachBacSi.slice(0, 3));
  return (
    &lt;ul&gt;
      {ds.map((bs, i) =&gt; (
        &lt;DongGhiChu key={keyLa === 'index' ? i : bs.id} bacSi={bs} onXoa={() =&gt; setDs(ds.filter((x) =&gt; x.id !== bs.id))} /&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre>
<div class="out">[key=index] sau khi xoá An: BS. Trần Thu Hà="tái khám" | BS. Lê Quốc Bảo="bé sốt"
[key=id] sau khi xoá An: BS. Trần Thu Hà="bé sốt" | BS. Lê Quốc Bảo=""</div>
<p>Trước khi xoá: An = "tái khám", Hà = "bé sốt". Xoá dòng An:</p>
<ul>
<li><strong>key = index.</strong> Trước: key 0 (An), 1 (Hà), 2 (Bảo). Sau: key 0 (Hà), 1 (Bảo). React so theo key: key 0 vẫn còn ⇒ giữ component ở key 0 <em>cùng state "tái khám"</em>, chỉ đổi props thành Hà; key 1 giữ state "bé sốt", props thành Bảo; key 2 biến mất ⇒ gỡ dòng <strong>cuối</strong>. State đi theo key, props đi theo dữ liệu ⇒ chúng lệch nhau: ghi chú "tái khám" của An giờ nằm dưới tên Hà.</li>
<li><strong>key = id.</strong> <code>bs-1</code> biến mất ⇒ gỡ đúng dòng An; <code>bs-2</code>, <code>bs-3</code> còn nguyên với state của chúng.</li>
</ul>
${SD.indexVi}
<p>Index chỉ an toàn khi danh sách <strong>không bao giờ</strong> thêm, xoá, sắp xếp lại <em>và</em> dòng không có state (không ô nhập, không component có state bên trong). Dữ liệu từ máy chủ có id sẵn — dùng nó. Dữ liệu tạo trên máy người dùng (một dòng ghi chú mới) thì cấp id lúc tạo, ví dụ <code>crypto.randomUUID()</code>, và lưu id đó cùng dữ liệu.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — <code>key={Math.random()}</code> để "tắt cảnh báo".</strong> Cảnh báo "Each child in a list should have a unique key" biến mất, nhưng key mới mỗi lần render nghĩa là mọi dòng bị gỡ và dựng lại <em>mỗi lần</em> cha render: mất focus, mất chữ đang gõ, và chậm. Tệ hơn cả index. <code>crypto.randomUUID()</code> chỉ đúng khi gọi <strong>một lần lúc tạo dữ liệu</strong>, không phải trong JSX.</div>

<h3>Khai component bên trong component: mỗi phím gõ là một lần mount</h3>
${slide('rx-11', 13, 'Component khai trong component: mỗi phím một lần mount')}
<p>Luật "cùng loại" có một hệ quả bất ngờ. "Loại" của một component là <strong>chính cái hàm</strong> — so bằng <code>===</code>. Khai một hàm component bên trong một component khác thì mỗi lần cha render, hàm đó được tạo <em>mới</em>:</p>
<pre><code class="language-tsx">/* ───────── 3. Khai báo component BÊN TRONG component khác ───────── */
export function OTimLongNhau() {
  const [tuKhoa, setTuKhoa] = useState('');
  // ✗ Mỗi lần OTimLongNhau render, dòng dưới tạo ra một HÀM MỚI ⇒ React thấy một "loại" component mới.
  function OTim() {
    useEffect(() =&gt; {
      nhatKy.push('mount OTim');
    }, []);
    return &lt;input aria-label="Tìm bác sĩ" value={tuKhoa} onChange={(e) =&gt; setTuKhoa(e.target.value)} /&gt;;
  }
  return &lt;OTim /&gt;;
}

function OTimNgoai({ tuKhoa, onDoi }: { tuKhoa: string; onDoi: (s: string) =&gt; void }) {
  useEffect(() =&gt; {
    nhatKy.push('mount OTim');
  }, []);
  return &lt;input aria-label="Tìm bác sĩ" value={tuKhoa} onChange={(e) =&gt; onDoi(e.target.value)} /&gt;;
}

export function OTimTachRieng() {
  const [tuKhoa, setTuKhoa] = useState('');
  return &lt;OTimNgoai tuKhoa={tuKhoa} onDoi={setTuKhoa} /&gt;; // ✓ OTimNgoai khai MỘT lần, ở cấp module
}</code></pre>
<div class="out">[long nhau] ô chứa: "h" | số lần mount: 2 | focus đang ở: BODY
[tach rieng] ô chứa: "huy" | số lần mount: 1 | focus đang ở: INPUT</div>
<p><strong>Chạy thử từng bước</strong> với bản lồng nhau, gõ "huy":</p>
<ol>
<li>Gõ "h": <code>setTuKhoa('h')</code> ⇒ <code>OTimLongNhau</code> render lại ⇒ dòng <code>function OTim() {…}</code> chạy lại, tạo ra một hàm <code>OTim</code> <strong>khác</strong> (khác <code>===</code> với hàm của lần trước).</li>
<li>React so: lần trước ở vị trí này là element có <code>type</code> = hàm OTim cũ, lần này là hàm OTim mới ⇒ khác loại ⇒ gỡ ô cũ, dựng ô mới (nhật ký: mount lần 2). Ô mới có đúng chữ "h" (vì <code>value</code> lấy từ state của cha) nhưng là <strong>một nút DOM khác</strong>, và focus không tự chuyển sang nó.</li>
<li>Focus rơi về <code>&lt;body&gt;</code>. "u" và "y" được gõ vào… hư không.</li>
</ol>
<p>Ngoài đời, triệu chứng là "gõ một chữ là ô tìm mất focus", hoặc "mỗi lần gõ, danh sách bên dưới nháy và cuộn lên đầu". Chữa: khai mọi component ở <strong>cấp module</strong> (ngoài mọi hàm khác), truyền dữ liệu vào bằng props. Nếu thấy mình muốn khai lồng để "dùng được biến của cha", đó chính là việc của props.</p>

<h3>Reset bằng key, đừng reset bằng useEffect — và muốn ẩn mà giữ thì dùng Activity</h3>
${slide('rx-11', 14, 'Reset bằng key đúng ngay; bằng useEffect thì sai một nhịp')}
<p>Trước khi biết mẹo key, nhiều người reset state khi props đổi bằng effect: <code>useEffect(() =&gt; setChu(''), [bacSi.id])</code>. Nó "chạy". Nhưng đếm số lần render thì thấy cái giá:</p>
<pre><code class="language-tsx">/* ───────── 4. Reset bằng effect (chậm một nhịp) vs reset bằng key ───────── */
export const khungHinh: string[] = [];

function GhiChuResetBangEffect({ bacSi }: { bacSi: BacSi }) {
  const [chu, setChu] = useState('');
  useEffect(() =&gt; {
    setChu(''); // ✗ chạy SAU khi đã vẽ một lần với chữ cũ
  }, [bacSi.id]);
  khungHinh.push(&#96;&#36;{bacSi.id}:"&#36;{chu}"&#96;);
  return &lt;textarea aria-label="Ghi chú" value={chu} onChange={(e) =&gt; setChu(e.target.value)} /&gt;;
}

function GhiChuThuong({ bacSi }: { bacSi: BacSi }) {
  const [chu, setChu] = useState('');
  khungHinh.push(&#96;&#36;{bacSi.id}:"&#36;{chu}"&#96;);
  return &lt;textarea aria-label="Ghi chú" value={chu} onChange={(e) =&gt; setChu(e.target.value)} /&gt;;
}

export function SoSanhReset({ cach }: { cach: 'effect' | 'key' }) {
  const [id, setId] = useState('bs-1');
  const bacSi = danhSachBacSi.find((b) =&gt; b.id === id)!;
  return (
    &lt;div&gt;
      &lt;button type="button" onClick={() =&gt; setId('bs-5')}&gt;
        Sang Huy
      &lt;/button&gt;
      {cach === 'effect' ? &lt;GhiChuResetBangEffect bacSi={bacSi} /&gt; : &lt;GhiChuThuong key={bacSi.id} bacSi={bacSi} /&gt;}
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">[reset effect] các lần render sau khi đổi: bs-5:"ab" → bs-5:""
[reset key]    các lần render sau khi đổi: bs-5:""</div>
<p>Với effect: lần render đầu tiên sau khi đổi là <code>bs-5:"ab"</code> — bác sĩ MỚI với chữ CŨ. React commit bản đó, effect chạy, gọi <code>setChu('')</code>, rồi mới có lần render thứ hai đúng. Tức là luôn có một nhịp giao diện sai (có thể nháy lên màn hình), mọi component con cũng render hai lần, và nếu con có effect gọi API theo chữ đó thì nó gọi với dữ liệu sai. Với key: một lần render, đúng ngay. Đây cũng chính là khuyến nghị của react.dev trong "You Might Not Need an Effect" (mục <em>Resetting all state when a prop changes</em>).</p>
${SD.resetVi}
<p>Chiều ngược lại cũng có công cụ. Đôi khi bạn muốn <strong>ẩn</strong> một phần giao diện mà <strong>giữ</strong> state của nó — tab "Ghi chú" đang viết dở, chuyển sang tab "Lịch" rồi quay lại. Ẩn bằng <code>&amp;&amp;</code> là gỡ component (state mất). Từ React 19.2 có <code>&lt;Activity&gt;</code>:</p>
<pre><code class="language-tsx">/* ───────── 5. Ẩn mà vẫn GIỮ state: &lt;Activity&gt; (React 19.2+) ───────── */
function GhiChuTab() {
  const [chu, setChu] = useState('');
  return &lt;textarea aria-label="Ghi chú tab" value={chu} onChange={(e) =&gt; setChu(e.target.value)} /&gt;;
}
export function HaiTab({ cach }: { cach: 'dieu-kien' | 'activity' }) {
  const [tab, setTab] = useState&lt;'ghi-chu' | 'lich'&gt;('ghi-chu');
  return (
    &lt;div&gt;
      &lt;button type="button" onClick={() =&gt; setTab('ghi-chu')}&gt;
        Tab ghi chú
      &lt;/button&gt;
      &lt;button type="button" onClick={() =&gt; setTab('lich')}&gt;
        Tab lịch
      &lt;/button&gt;
      {cach === 'dieu-kien' ? (
        tab === 'ghi-chu' &amp;&amp; &lt;GhiChuTab /&gt;
      ) : (
        &lt;Activity mode={tab === 'ghi-chu' ? 'visible' : 'hidden'}&gt;
          &lt;GhiChuTab /&gt;
        &lt;/Activity&gt;
      )}
      {tab === 'lich' &amp;&amp; &lt;p&gt;Lịch khám tuần này&lt;/p&gt;}
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">[dieu-kien] lúc ẩn: ô KHÔNG còn trong DOM | quay lại: ""
[activity] lúc ẩn: ô VẪN trong DOM | quay lại: "hỏi về thuốc"</div>
<p>Theo tài liệu react.dev, khi <code>mode="hidden"</code>, React ẩn phần con bằng <code>display: none</code>, <strong>gỡ các effect</strong> của chúng (hẹn giờ, đăng ký sự kiện được dọn), nhưng giữ state và nút DOM; chuyển lại <code>"visible"</code> thì hiện ra với state cũ và dựng lại effect. Hợp cho tab, bảng điều khiển, màn hình hay quay lại. Đừng lạm dụng: phần bị ẩn vẫn tốn bộ nhớ và vẫn render lại (ưu tiên thấp) khi props đổi.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Trong lab FER202, <code>key</code> thường chỉ xuất hiện để tắt cảnh báo trong <code>.map()</code> — hay gặp <code>key={index}</code> — và muốn "làm mới form" khi đổi dữ liệu thì viết <code>componentDidUpdate</code>/<code>useEffect</code> gọi <code>setState</code> về rỗng → Ở công ty, key là <strong>công cụ quản lý danh tính</strong>: id từ máy chủ cho danh sách, <code>key={id}</code> trên component cần bắt đầu lại khi đổi dữ liệu (form sửa hồ sơ, trang chi tiết dùng chung route), và code review sẽ hỏi lại mọi <code>key={index}</code> trên dòng có state. · <em>Vì sao:</em> reset bằng effect luôn có một nhịp hiển thị dữ liệu sai và phải liệt kê tay từng state cần xoá; key làm việc đó đầy đủ, trong một lần render. Cách FER202 không sai với danh sách tĩnh chỉ để hiển thị — bạn sẽ còn thấy <code>componentDidUpdate</code> trong các dự án class cũ.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Vì sao không nên dùng index làm key? Còn key có tác dụng gì ngoài danh sách?"</p>
<p>Key là cách React nhận diện một phần tử giữa hai lần render; state gắn với danh tính đó (loại + vị trí + key). Dùng index thì khi thêm/xoá/sắp xếp, danh tính trượt: state của dòng này đi theo dòng khác — em từng đo: xoá dòng đầu, ghi chú "tái khám" của người thứ nhất chạy sang người thứ hai. Nên dùng id ổn định từ dữ liệu. Ngoài danh sách, đổi key trên một component là cách chuẩn để reset toàn bộ state của nó khi dữ liệu đổi — ví dụ <code>&lt;Form key={bacSi.id} /&gt;</code> trên trang chi tiết dùng chung route — tốt hơn useEffect reset vì không có một nhịp hiển thị dữ liệu cũ. Và không bao giờ <code>key={Math.random()}</code>.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> trong <code>src/vi-du/bai2.tsx</code> của bạn, dựng lại hai thí nghiệm và thêm một thí nghiệm sắp xếp.</p><ol>
<li>Chép <code>DanhSachGhiChu</code>. Thêm nút "Đảo thứ tự" gọi <code>setDs([...ds].reverse())</code>.</li>
<li>Viết test cho bản <code>key = index</code>: gõ "tái khám" vào dòng An, bấm "Đảo thứ tự", rồi in giá trị các ô theo tên bác sĩ. Làm lại với <code>key = id</code>.</li>
<li>Chép <code>ChonBacSi</code> và sửa để <strong>nhớ</strong> ghi chú của từng bác sĩ khi chuyển qua lại (gợi ý: state <code>Record&lt;string, string&gt;</code> ở <code>ChonBacSi</code>, <code>GhiChu</code> nhận <code>chu</code> và <code>onDoi</code> qua props).</li>
</ol><p><strong>Đạt khi:</strong> với index, sau khi đảo, "tái khám" nằm ở ô của BS. Lê Quốc Bảo (người đứng đầu sau khi đảo); với id, "tái khám" vẫn ở ô của BS. Nguyễn Minh An; bước 3 có test: gõ cho An, sang Huy (ô trắng), quay lại An thấy lại chữ cũ; <code>npx tsc -b</code> sạch.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">identity (danh tính component)</span><span class="v">loại + vị trí trong cây + key; state gắn với danh tính này</span></div>
<div class="kv"><span class="k">mount / unmount (dựng / gỡ)</span><span class="v">React tạo component mới (state khởi tạo, effect chạy) / bỏ nó đi (state mất, effect dọn)</span></div>
<div class="kv"><span class="k">key</span><span class="v">nhãn danh tính do bạn đặt; đổi key = component mới; chỉ cần duy nhất giữa anh em</span></div>
<div class="kv"><span class="k">reset state bằng key</span><span class="v"><code>&lt;X key={id} /&gt;</code>: đổi dữ liệu là làm lại từ đầu, trong một lần render</span></div>
<div class="kv"><span class="k">stable key (key ổn định)</span><span class="v">id không đổi giữa các lần render — id máy chủ hoặc cấp một lần lúc tạo</span></div>
<div class="kv"><span class="k">nested component definition</span><span class="v">khai component trong component ⇒ loại mới mỗi render ⇒ gỡ/dựng liên tục</span></div>
<div class="kv"><span class="k">Activity</span><span class="v"><code>&lt;Activity mode="hidden"&gt;</code> (React 19.2+): ẩn mà giữ state, gỡ effect</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>React giữ state khi cùng loại, cùng vị trí, cùng key — bất kể props đổi thành dữ liệu của ai.</li>
<li>Đổi <code>key</code> là gỡ cái cũ, dựng cái mới: cách chuẩn để reset mọi state khi đổi dữ liệu.</li>
<li>Bug thật của app: không có key, trang BS. Huy báo "đã gửi" và gửi nhầm giờ của BS. An; một dòng <code>key={bacSi.id}</code> sửa cả ba triệu chứng.</li>
<li><code>key = index</code> làm state trượt khi thêm/xoá/sắp xếp; dùng id ổn định, không bao giờ <code>Math.random()</code>.</li>
<li>Khai component trong component tạo loại mới mỗi render ⇒ mất focus, mất state. Khai ở cấp module.</li>
<li>Reset bằng key đúng ngay trong một render; reset bằng effect có một nhịp sai. Ẩn mà giữ state: <code>&lt;Activity&gt;</code>.</li>
</ul>

<a class="link-card" href="https://react.dev/learn/preserving-and-resetting-state" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Preserving and Resetting State</span><span class="lc-sub">State gắn với vị trí; reset bằng key — nguồn chính của bài.</span></span></a>
<a class="link-card" href="https://react.dev/learn/rendering-lists" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Rendering Lists</span><span class="lc-sub">Luật của key, và vì sao không dùng index.</span></span></a>
<a class="link-card" href="https://react.dev/learn/you-might-not-need-an-effect" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — You Might Not Need an Effect</span><span class="lc-sub">Mục "Resetting all state when a prop changes".</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/Activity" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — &lt;Activity&gt;</span><span class="lc-sub">Ẩn một phần giao diện mà giữ state.</span></span></a>
</div>
`,
  },
  {
    title: '11.3 — StrictMode, useRef, useLayoutEffect: running twice, refs, measuring before paint|||11.3 — StrictMode, useRef, useLayoutEffect: chạy hai lần, ref, đo trước khi vẽ',
    slug: 'rx-11-3-strict-mode-ref',
    type: 'LESSON',
    isFreePreview: true,
    description: 'StrictMode chạy render, effect và ref callback thêm một lượt ở dev (đo dev và production); effect quên dọn bị lộ; useRef nhớ mà không render; ref tới DOM để đưa focus; ref là prop thường ở React 19; useLayoutEffect cho tooltip — 20/20 khung hình sai với useEffect khi render chậm.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>StrictMode, useRef and useLayoutEffect: running twice, remembering without rendering, measuring before paint</h2>
<p class="lead">Open the clinic app's DevTools in development and you will see a log printed twice, a request "sent twice", an effect that runs, cleans up and runs again. It is not a React bug and your machine is fine: it is <strong>StrictMode</strong> deliberately running an extra pass to drag <em>your</em> bugs into the light. This lesson measures exactly what it runs again (and that production does not), then moves on to two "escape hatches" from the world of pure rendering: <code>useRef</code> to remember without re-rendering or to reach a DOM node, and <code>useLayoutEffect</code> to measure the UI before the browser gets to paint. The number to remember: the same tooltip, rendering 100 ms slowly, paints its first frame in the wrong place <strong>20/20</strong> times with <code>useEffect</code> and <strong>0/20</strong> with <code>useLayoutEffect</code>.</p>

<p>Examples live in <code>src/vi-du/bai3.tsx</code>. Grey boxes are REAL output of <code>npx vitest run src/vi-du/bai3.test.tsx --reporter=verbose</code> and of a Playwright script driving a real Chromium (Vite's dev server, and a <code>vite build</code> + <code>vite preview</code> build), on 25 September 2026, React 19.3.0.</p>

<h3>StrictMode: render twice, effects run → clean up → run (development only)</h3>
${slide('rx-11', 15, 'StrictMode: render twice, effects run → clean up → run (dev only)')}
<p>Open <code>src/main.tsx</code>: since Section 0 the app has been wrapped in <code>&lt;StrictMode&gt;</code> — Vite's template puts it there. The test component logs in three places: the component body, the <code>useState</code> initialiser, and an effect:</p>
<pre><code class="language-tsx">/* ───────── 1. StrictMode: render hai lần, effect chạy–dọn–chạy ───────── */
export function DemLuotXem() {
  nhatKy3.push('render');
  if (import.meta.env.MODE !== 'test') console.log('[DemLuotXem] render');
  const [n] = useState(() =&gt; {
    nhatKy3.push('khởi tạo state');
    return 0;
  });
  useEffect(() =&gt; {
    nhatKy3.push('effect: chạy');
    if (import.meta.env.MODE !== 'test') console.log('[DemLuotXem] effect chạy');
    return () =&gt; {
      if (import.meta.env.MODE !== 'test') console.log('[DemLuotXem] effect dọn');
      nhatKy3.push('effect: dọn');
    };
  }, []);
  return &lt;p&gt;Lượt xem: {n}&lt;/p&gt;;
}</code></pre>
<div class="out">[khong strict] render → khởi tạo state → effect: chạy → effect: dọn
[strict] lúc mount: render → khởi tạo state → khởi tạo state → render → effect: chạy → effect: dọn → effect: chạy
[strict] lúc unmount: effect: dọn</div>
<p>("khởi tạo state" = state initialiser, "chạy" = run, "dọn" = clean up, "lúc mount/unmount" = at mount/unmount.) Without StrictMode: everything exactly once (the final "effect: dọn" is the test unmounting the component). With StrictMode, just at mount: the component body runs <strong>twice</strong>, the state initialiser runs <strong>twice</strong>, and the effect goes through <strong>run → clean up → run</strong>. The same component in a real Chromium:</p>
<div class="out">strict=1 (dev):  [log] [DemLuotXem] render | [log] [DemLuotXem] render | [log] [DemLuotXem] effect chạy | [log] [DemLuotXem] effect dọn | [log] [DemLuotXem] effect chạy
strict=0 (dev):  [log] [DemLuotXem] render | [log] [DemLuotXem] effect chạy
strict=1 (vite build + preview): [log] [DemLuotXem] render | [log] [DemLuotXem] effect chạy</div>
<p>The last line matters most: the <strong>production</strong> build (StrictMode still in the code, but built with <code>vite build</code>) runs everything <strong>once</strong>. StrictMode is a development tool; it does not slow the real app down and does not call real APIs twice for your users.</p>
${SD.strictEn}
<p>Per the <code>&lt;StrictMode&gt;</code> reference on react.dev, in development it:</p>
<ul>
<li>calls twice the functions that <strong>must be pure</strong>: component bodies, initialisers and updaters passed to <code>useState</code>/<code>useReducer</code>, <code>useMemo</code> functions (since React 19 the second call reuses the memoised result of the first);</li>
<li>runs one extra <strong>clean up → run</strong> cycle for every effect at mount — checking that your effects clean up properly;</li>
<li>since React 19, runs the same extra cycle for <strong>ref callbacks</strong> at mount (measured below);</li>
<li>warns about deprecated APIs.</li>
</ul>
<p>Why unmount and remount effects? The React 18 changelog (29 March 2022) explains: React wanted to be able, later, to remove part of the UI and add it back with its previous state (that is <code>&lt;Activity&gt;</code> from Lesson 11.2 today). A component is only safe with that if its effects survive "run, clean up, run again". StrictMode rehearses exactly that scenario for you on the very first mount.</p>
<div class="callout"><p><strong>JS quick reminder — <code>useState(() =&gt; …)</code> and <code>import.meta.env.MODE</code>.</strong> Passing a <em>function</em> to <code>useState</code> ("lazy initialisation") means React only calls it when creating the state, not on every render — good for expensive values. <code>import.meta.env.MODE</code> is set by Vite: <code>'development'</code> for <code>npm run dev</code>, <code>'production'</code> for builds, <code>'test'</code> in Vitest; the example uses it to print <code>console.log</code> only in the browser.</p></div>

<h3>StrictMode catches real bugs: impure renders and effects that forget to clean up</h3>
${slide('rx-11', 16, 'StrictMode catches an effect with no cleanup: the listener outlives the component')}
<p>"Running twice" only hurts buggy code. The two most common bugs, measured:</p>
<pre><code class="language-tsx">/* ───────── 2. Render KHÔNG thuần: StrictMode làm lộ ra ───────── */
const hangCho: string[] = []; // biến ngoài component
export function HangChoKhongThuan({ ten }: { ten: string }) {
  hangCho.push(ten); // ✗ sửa dữ liệu bên ngoài trong lúc render
  return &lt;p&gt;Số người chờ: {hangCho.length}&lt;/p&gt;;
}
export const datLaiHangCho = () =&gt; {
  hangCho.length = 0;
};

/* ───────── 3. Effect quên dọn: StrictMode làm lộ ra ───────── */
export function PhimTatQuenDon({ onPhim }: { onPhim: () =&gt; void }) {
  useEffect(() =&gt; {
    const xuLy = () =&gt; onPhim();
    window.addEventListener('keydown', xuLy); // ✗ không trả về hàm dọn
  }, [onPhim]);
  return &lt;p&gt;Nhấn phím bất kỳ&lt;/p&gt;;
}
export function PhimTatCoDon({ onPhim }: { onPhim: () =&gt; void }) {
  useEffect(() =&gt; {
    const xuLy = () =&gt; onPhim();
    window.addEventListener('keydown', xuLy);
    return () =&gt; window.removeEventListener('keydown', xuLy); // ✓ dọn đúng hàm đã gắn
  }, [onPhim]);
  return &lt;p&gt;Nhấn phím bất kỳ&lt;/p&gt;;
}</code></pre>
<div class="out">[khong thuan] không Strict: Số người chờ: 1 | có Strict: Số người chờ: 2
[quen don] 1 phím khi đang mở ⇒ 2 lần | 1 phím SAU KHI GỠ ⇒ thêm 2 lần
[co don] 1 phím khi đang mở ⇒ 1 lần | 1 phím sau khi gỡ ⇒ thêm 0 lần</div>
<ul>
<li><strong>Impure render.</strong> <code>HangChoKhongThuan</code> pushes a name into an outside array during render ("Số người chờ" = people waiting). Without StrictMode: 1 — looks right. With StrictMode: 2 — for <em>one</em> component. The bug was there all along; StrictMode just shows it immediately. In real life renders can run several times for other reasons (concurrent rendering abandoning and redoing work, Chapter 12), and this bug would surface randomly in production, hard to reproduce.</li>
<li><strong>Effect with no cleanup.</strong> <code>PhimTatQuenDon</code> adds a <code>keydown</code> listener without returning a cleanup. With StrictMode: one key press calls the handler <strong>twice</strong> (the second run added a second listener). Worse: after unmounting the component ("SAU KHI GỠ"), one key press still calls it 2 more times — the listener lives forever. Without StrictMode this bug only shows when a user opens and closes the screen a few times, adding one listener each time. The version with cleanup: 1 call while mounted, 0 after unmounting, even though StrictMode still does its run – clean up – run cycle.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Trap — "fixing" it by removing StrictMode or adding a <code>hasRun = useRef(false)</code> flag.</strong> Seeing a request sent twice in development, many people delete <code>&lt;StrictMode&gt;</code> from <code>main.tsx</code>, or guard the effect with a "ran already, skip" ref. Both hide the bug instead of fixing it: the effect still does not clean up, and it will break when the component is really unmounted and remounted (navigating back and forth, <code>&lt;Activity&gt;</code>, Fast Refresh). The real fix is a cleanup (unsubscribe, <code>clearTimeout</code>, an <code>AbortController</code> for <code>fetch</code> — Chapter 4), or moving data fetching to TanStack Query (Chapter 6), which already copes with running twice.</div>
<p>A small detail you only see by measuring: the first version of the example passed <code>onPhim</code> straight to <code>addEventListener</code>, and StrictMode did <em>not</em> expose the bug — because the browser ignores adding <strong>the same function</strong> twice. The bug was still there (the listener survived unmounting). Only after switching to a new function created inside the effect (<code>const xuLy = () =&gt; onPhim()</code>, as real code usually does) did the "2 calls" appear. StrictMode helps a lot, but it does not catch everything.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>In FER202 labs, when a <code>console.log</code> prints twice or an API is called twice, the usual "fix" is deleting <code>&lt;React.StrictMode&gt;</code> from Create React App's <code>index.js</code>; refs are <code>createRef</code>/<code>this.myRef</code> in classes and <code>React.forwardRef</code> to pass a ref through a component → At a company, StrictMode <strong>stays on</strong> (the Vite and Next.js templates enable it) and "running twice" is read as a test: effects need cleanups, renders must be pure. Refs use <code>useRef</code>, and since React 19 <code>ref</code> is a normal prop, no <code>forwardRef</code> needed. · <em>Why:</em> removing StrictMode only switches off the alarm; leaking listeners and overlapping API calls still reach users. <code>forwardRef</code> is not wrong — pre-2025 code is full of it and it still works — but the React team has announced it will be deprecated in a later version.</p></div>

<h3>useRef: a box to remember things — changing it does not re-render</h3>
${slide('rx-11', 17, 'useRef: a box to remember things — changing it does not re-render')}
<p><code>useRef(initialValue)</code> returns an object <code>{ current: initialValue }</code> — <strong>the same object</strong> on every render of that component. You read and write <code>ref.current</code> freely, and React <strong>does not know</strong> you wrote to it: no render is queued. Compared with state:</p>
<pre><code class="language-tsx">/* ───────── 4. useRef: nhớ mà KHÔNG render lại ───────── */
export const demRender3 = { ref: 0, state: 0 };
export function DemBangRef() {
  demRender3.ref += 1;
  const soLan = useRef(0);
  return (
    &lt;div&gt;
      &lt;button type="button" onClick={() =&gt; (soLan.current += 1)}&gt;
        Bấm (ref)
      &lt;/button&gt;
      &lt;p&gt;Đã bấm (ref): {soLan.current}&lt;/p&gt;
    &lt;/div&gt;
  );
}
export function DemBangState() {
  demRender3.state += 1;
  const [soLan, setSoLan] = useState(0);
  return (
    &lt;div&gt;
      &lt;button type="button" onClick={() =&gt; setSoLan(soLan + 1)}&gt;
        Bấm (state)
      &lt;/button&gt;
      &lt;p&gt;Đã bấm (state): {soLan}&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">[ref] màn hình: Đã bấm (ref): 0 | số lần render: 1
[state] màn hình: Đã bấm (state): 3 | số lần render: 4</div>
<p>Click each button three times ("màn hình" = screen, "số lần render" = number of renders). The ref version: <code>soLan.current</code> really is 3 in memory, but the component rendered exactly once (at mount), so the screen still says "0" — the screen disagrees with the data. The state version: 4 renders (1 + 3), the screen is right. The rules:</p>
<ul>
<li>Anything <strong>shown on screen</strong> ⇒ state.</li>
<li>Anything you only need to <strong>remember between renders</strong> without affecting what is drawn ⇒ a ref: a <code>setTimeout</code>/<code>setInterval</code> id to cancel later, an "is submitting" flag to block double submits (Chapter 3's <code>FormDatLich</code> uses <code>dangGui = useRef(false)</code>), the previous value to compare with, and — most commonly — a <strong>DOM node</strong>.</li>
<li><strong>Do not read or write <code>ref.current</code> during render</strong> (except lazy initialisation). Render must be pure; a value React does not track makes render output unpredictable. Read and write refs in event handlers and effects.</li>
</ul>
${SD.refEn}
<p>A React 19 change in the TypeScript types: <code>useRef</code> now <strong>requires</strong> an initial value. Old code writing <code>useRef&lt;number&gt;()</code> now fails:</p>
<div class="out">src/vi-du/loi-co-y.tsx(5,15): error TS2554: Expected 1 arguments, but got 0.</div>
<p>Write <code>useRef&lt;number | null&gt;(null)</code> or <code>useRef&lt;number | undefined&gt;(undefined)</code>. For DOM nodes, <code>useRef&lt;HTMLInputElement&gt;(null)</code> gives <code>RefObject&lt;HTMLInputElement | null&gt;</code> — because on the first render the node does not exist yet.</p>

<h3>DOM refs: moving focus to the heading when switching doctors</h3>
${slide('rx-11', 18, 'DOM refs: move focus to the heading when switching doctors')}
<p>Put <code>ref={r}</code> on a tag and after commit React sets <code>r.current</code> to that tag's real DOM node (and back to <code>null</code> when the tag is removed). From there you can call DOM APIs React does not wrap: <code>focus()</code>, <code>scrollIntoView()</code>, <code>getBoundingClientRect()</code>, a video's <code>play()</code>. A small example, with a big React 19 change — <strong><code>ref</code> is a normal prop</strong> for function components:</p>
<pre><code class="language-tsx">/* ───────── 5. ref tới DOM + ref là prop thường (React 19, không cần forwardRef) ───────── */
function ONhapSo({ nhan, ref }: { nhan: string; ref?: Ref&lt;HTMLInputElement&gt; }) {
  return (
    &lt;label&gt;
      {nhan} &lt;input ref={ref} inputMode="numeric" /&gt;
    &lt;/label&gt;
  );
}
export function FormMaXacNhan() {
  const oMa = useRef&lt;HTMLInputElement&gt;(null);
  return (
    &lt;div&gt;
      &lt;ONhapSo nhan="Mã xác nhận" ref={oMa} /&gt;
      &lt;button type="button" onClick={() =&gt; oMa.current?.focus()}&gt;
        Nhập mã
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">[ref DOM] focus đang ở: INPUT | nhãn: Mã xác nhận</div>
<p><code>ONhapSo</code> receives <code>ref</code> like any other prop and passes it down to the <code>&lt;input&gt;</code>. Before React 19, you had to wrap the component in <code>forwardRef((props, ref) =&gt; …)</code>; the React 19.0.0 changelog (5 December 2024) says "<em>ref as a prop</em>: removing the need for <code>forwardRef</code>".</p>
<p>Now the app. In a SPA, changing pages does not reload the page, so for screen-reader and keyboard users, clicking "BS. Hoàng Đức Huy"… announces nothing; focus stays on the link just clicked (or falls to <code>&lt;body&gt;</code> when that link disappears). The common approach: move focus to the new page's heading.</p>
<pre><code class="language-tsx">export function TrangChiTietBacSi() {
  const { id = '' } = useParams();
  const { data: bacSi, isPending, error, refetch, isFetching } = useChiTietBacSi(id);
  const { data: tatCa } = useBacSi();
  const tieuDeRef = useRef&lt;HTMLHeadingElement&gt;(null);

  // Chương 11: đổi trang trong SPA không tải lại trang ⇒ trình đọc màn hình không biết đã sang trang mới.
  // Đưa focus lên tiêu đề mỗi khi sang bác sĩ khác: người dùng bàn phím/trình đọc màn hình bắt đầu từ đầu trang.
  useEffect(() =&gt; {
    tieuDeRef.current?.focus();
  }, [bacSi?.id]);

  if (isPending) return &lt;p aria-busy="true"&gt;Đang tải thông tin bác sĩ…&lt;/p&gt;;
  if (!bacSi) return &lt;LoiTaiDuLieu tieuDe="Không mở được trang bác sĩ" loi={error!} onThuLai={() =&gt; refetch()} dangThuLai={isFetching} /&gt;;

  const cungKhoa = (tatCa ?? []).filter((b) =&gt; b.chuyenKhoa === bacSi.chuyenKhoa &amp;&amp; b.id !== bacSi.id);
  return (
    &lt;div className="trang-bac-si"&gt;
      &lt;section className="chi-tiet" aria-label={&#96;Giới thiệu &#36;{bacSi.ten}&#96;}&gt;
        &lt;h2 ref={tieuDeRef} tabIndex={-1}&gt;
          {bacSi.ten}
        &lt;/h2&gt;</code></pre>
<div class="out">trước: [focus] đang ở: BODY "Phòng khám An TâmMở cửa 7:30–2"
sau:   [focus] đang ở: H2 "BS. Hoàng Đức Huy"</div>
<p>("trước" = before, "sau" = after.) Three details: <code>tabIndex={-1}</code> lets an <code>&lt;h2&gt;</code> (normally not focusable) receive focus <em>from code</em> without joining the Tab order; the effect depends on <code>bacSi?.id</code> so it runs each time the doctor changes; and the CSS <code>[tabindex='-1']:focus { outline: none; }</code> avoids drawing a focus ring around the heading (it is not something to click). Why focus in <code>useEffect</code> and not in the component body? Because during render this render's <code>&lt;h2&gt;</code> has <em>not been committed yet</em> — <code>tieuDeRef.current</code> may still be <code>null</code> or the previous node. Effects run after commit, when the ref points at the right node.</p>
<p>React 19 also lets <strong>ref callbacks return a cleanup function</strong> (like effects), and StrictMode runs an extra attach – clean up – attach cycle for them:</p>
<pre><code class="language-tsx">/* ───────── 6. ref callback có hàm dọn (React 19) — StrictMode chạy nó thêm một lượt ───────── */
export function DoKichThuoc() {
  return (
    &lt;div
      ref={(nut) =&gt; {
        if (!nut) return;
        nhatKy3.push(&#96;ref gắn: &lt;&#36;{nut.tagName.toLowerCase()}&gt;&#96;);
        return () =&gt; {
          nhatKy3.push('ref dọn');
        };
      }}
    &gt;
      Hộp
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">[ref callback] ref gắn: &lt;div&gt; → ref dọn → ref gắn: &lt;div&gt; → ref dọn</div>
<p>("gắn" = attach, "dọn" = clean up.) A consequence for types: a ref callback may now only return <code>undefined</code> or a cleanup. The shorthand arrow that returns a value (<code>ref={(n) =&gt; (savedNode = n)}</code> — an assignment returns <code>n</code>) is an error:</p>
<div class="out">src/vi-du/loi-co-y.tsx(6,15): error TS2322: Type '(n: HTMLDivElement | null) =&gt; HTMLDivElement | null' is not assignable to type 'Ref&lt;HTMLDivElement&gt; | undefined'.
  Type '(n: HTMLDivElement | null) =&gt; HTMLDivElement | null' is not assignable to type '(instance: HTMLDivElement | null) =&gt; void | (() =&gt; VoidOrUndefinedOnly)'.
    Type 'HTMLDivElement | null' is not assignable to type 'void | (() =&gt; VoidOrUndefinedOnly)'.
      Type 'null' is not assignable to type 'void | (() =&gt; VoidOrUndefinedOnly)'.</div>
<p>Fix: use a braced body, <code>ref={(n) =&gt; { savedNode = n; }}</code>.</p>

<h3>useLayoutEffect: measure and reposition BEFORE the browser paints</h3>
${slide('rx-11', 19, 'useLayoutEffect: measure and reposition BEFORE the browser paints')}
<p>Tooltips are the classic example. The tooltip should sit <em>above</em> the ⓘ button, but if the button is near the top of the screen it must flip <em>below</em>. To know whether there is room you need the tooltip's real height — and to measure it you have to draw it first. So there is always one render "without a position" before the render "in the right position". The question is: does the user <strong>see</strong> the first one?</p>
<p>Measured with a test tooltip that picks <code>useEffect</code> or <code>useLayoutEffect</code> via a prop (for comparison only — the hook is fixed per component instance; do not write this in an app), and an option that slows every render down, like the example on react.dev:</p>
<pre><code class="language-tsx">/* ───────── 7. useLayoutEffect vs useEffect: có khung hình nào vẽ vị trí SAI không ───────── */
export function ChuThichThu({ dung, chamMs = 0 }: { dung: 'layout' | 'effect'; chamMs?: number }) {
  const batDau = performance.now();
  while (performance.now() - batDau &lt; chamMs) {
    // cố tình làm chậm mỗi lần render (giả lập máy yếu / cây component nặng) — như ví dụ trên react.dev
  }
  const [mo, setMo] = useState(false);
  const [top, setTop] = useState&lt;number | null&gt;(null);
  const nut = useRef&lt;HTMLButtonElement&gt;(null);
  const hop = useRef&lt;HTMLDivElement&gt;(null);
  const hieuUng = dung === 'layout' ? useLayoutEffect : useEffect; // chỉ để so sánh — app thật chọn MỘT
  hieuUng(() =&gt; {
    if (!mo || !nut.current || !hop.current) return;
    const r = nut.current.getBoundingClientRect();
    setTop(r.top - hop.current.getBoundingClientRect().height - 8);
  }, [mo]);
  return (
    &lt;div style={{ paddingTop: 160 }}&gt;
      &lt;button ref={nut} type="button" onMouseEnter={() =&gt; setMo(true)} onMouseLeave={() =&gt; (setMo(false), setTop(null))}&gt;
        ⓘ Rê chuột vào đây ({dung})
      &lt;/button&gt;
      {mo &amp;&amp; (
        &lt;div ref={hop} role="tooltip" data-top={top ?? 'chua-do'} style={{ position: 'fixed', left: 20, top: top ?? 0, background: '#0f172a', color: '#fff', padding: 8, borderRadius: 8 }}&gt;
          Giờ theo giờ Việt Nam (UTC+7)
        &lt;/div&gt;
      )}
    &lt;/div&gt;
  );
}</code></pre>
<p>A Playwright script opens the page in a real Chromium, hovers the button, and records the tooltip's <code>data-top</code> on <strong>four consecutive frames</strong> using <code>requestAnimationFrame</code> (which the browser calls right before painting each frame) — the first frame is exactly what the browser is about to paint. Each configuration runs 20 times:</p>
<div class="out">tooltip-effect cham=0ms: 20 lần rê chuột, khung hình đầu tiên được vẽ → {"117,117,117,117":20}
tooltip-layout cham=0ms: 20 lần rê chuột, khung hình đầu tiên được vẽ → {"117,117,117,117":20}
tooltip-effect cham=100ms: 20 lần rê chuột, khung hình đầu tiên được vẽ → {"chua-do,117,117,117":20}
tooltip-layout cham=100ms: 20 lần rê chuột, khung hình đầu tiên được vẽ → {"117,117,117,117":20}</div>
<p>("cham" = slowdown, "20 lần rê chuột" = 20 hovers, "chua-do" = not measured yet.) The first two lines are what many articles skip: on a fast machine with a light render, <strong>both</strong> never paint the wrong position — React usually runs the effect before the next frame. The last two lines are why <code>useLayoutEffect</code> exists: when rendering is slow (weak device, heavy component tree), the <code>useEffect</code> version lets the browser <strong>paint the first frame with the unmeasured tooltip</strong> (<code>chua-do</code>, sitting at <code>top: 0</code> — the top of the screen) <strong>20/20</strong> times before jumping into place: the user sees it flicker. The <code>useLayoutEffect</code> version: <strong>0/20</strong>.</p>
<p><strong>Step by step</strong> with <code>useLayoutEffect</code>:</p>
<ol>
<li>Hover ⇒ <code>setMo(true)</code> ⇒ render (100 ms slow): the tooltip is in the JSX with <code>top: 0</code> because it has not been measured.</li>
<li>Commit: the tooltip is inserted into the DOM, <code>hop.current</code> points at it.</li>
<li><code>useLayoutEffect</code> runs <strong>right after commit, synchronously, before handing control back to the browser</strong>: measure, call <code>setTop(117)</code>.</li>
<li>Because that update happens in a layout effect, React re-renders and commits <em>immediately</em>, still before the browser paints.</li>
<li>The browser paints for the first time — the tooltip is already at <code>top: 117</code>.</li>
</ol>
<p>With <code>useEffect</code>, step 3 runs <em>after</em> the browser has had a chance to paint — and after a 100 ms render a frame is overdue, so it paints the wrong version right away. The price of <code>useLayoutEffect</code>: it <strong>blocks</strong> the browser from painting until it finishes; heavy code inside freezes the whole page. That is why react.dev recommends <code>useEffect</code> by default and <code>useLayoutEffect</code> only for <strong>measuring layout and immediately fixing what is drawn</strong>: positioning tooltips/popovers, scrolling to an element, measuring size to choose a layout. (It also does not run during server rendering — worth knowing when you move to Next.js.)</p>
${SD.layoutEn}
<p>The app's real component, <code>ChuThich</code>, next to "Giờ khám" (appointment times) on the doctor page (screenshot on the slide above), uses exactly this mechanism, plus flipping above/below and staying inside the horizontal edges:</p>
<pre><code class="language-tsx">/**
 * Chú thích nổi (tooltip) cạnh một nút ⓘ. Mặc định nằm TRÊN nút; không đủ chỗ phía trên thì lật XUỐNG DƯỚI.
 * Muốn biết "đủ chỗ không" phải ĐO chiều cao thật của chú thích ⇒ phải vẽ nó ra trước rồi mới đo được.
 * useLayoutEffect: đo + đặt lại vị trí TRƯỚC khi trình duyệt vẽ ⇒ người dùng không bao giờ thấy vị trí sai.
 */
export function ChuThich({ nhan, children }: { nhan: string; children: ReactNode }) {
  const [mo, setMo] = useState(false);
  const [viTri, setViTri] = useState&lt;ViTri | null&gt;(null);
  const nutRef = useRef&lt;HTMLButtonElement&gt;(null);
  const hopRef = useRef&lt;HTMLDivElement&gt;(null);
  const id = useId();

  useLayoutEffect(() =&gt; {
    if (!mo || !nutRef.current || !hopRef.current) return;
    const nut = nutRef.current.getBoundingClientRect();
    const hop = hopRef.current.getBoundingClientRect();
    const phia = nut.top - hop.height - KHE &gt;= 0 ? 'tren' : 'duoi';
    const left = Math.max(KHE, Math.min(nut.left + nut.width / 2 - hop.width / 2, window.innerWidth - hop.width - KHE));
    setViTri({ phia, left, top: phia === 'tren' ? nut.top - hop.height - KHE : nut.bottom + KHE });
  }, [mo]);

  function dong() {
    setMo(false);
    setViTri(null);
  }</code></pre>
<p>Its three tests run in jsdom — an environment that <strong>does no layout</strong>: every <code>getBoundingClientRect()</code> returns 0. The test "supplies" measurements by overriding that function on the exact node being measured:</p>
<div class="out">[tooltip] nút ở top=4 ⇒ duoi | nút ở top=300 ⇒ tren | style: top: 292px; left: 112px;</div>
<p>("nút ở top=4 ⇒ duoi" = button at top 4 ⇒ below; "tren" = above.)</p>
<div class="pitfall co-tieu-de"><strong>Trap — believing jsdom checks layout.</strong> <code>ChuThich</code>'s tests passing does not mean the tooltip lands in the right place in a browser: jsdom returns 0 for every size, so the tests only check the flip <em>logic</em> with measurements you feed in. Whether it flickers can only be measured in a real browser — like the Playwright script above, or Chapter 10's end-to-end tests.</div>

<div class="callout"><p><strong>Common interview question.</strong> "Why does my effect run twice in development? How is useEffect different from useLayoutEffect?"</p>
<p>Running twice is StrictMode, development only: React calls the must-be-pure functions an extra time and gives every effect a run – clean up – run cycle at mount, to expose effects without cleanups; production runs once — I measured both. The fix is a correct cleanup, not removing StrictMode. As for the hooks: both run after commit; <code>useLayoutEffect</code> runs synchronously before the browser paints, so it fits measuring layout and repositioning (tooltips, popovers) without flicker, at the cost of blocking paint; <code>useEffect</code> lets the browser paint first and is the default for everything else. I measured a tooltip rendering 100 ms slowly: useEffect painted the wrong first frame 20/20 times, useLayoutEffect 0/20.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> a countdown "We hold this slot for you for 5:00" — a real feature of many booking sites.</p><ol>
<li>Write <code>DemNguoc</code> with a <code>conLai</code> (seconds left) state and a <code>setInterval</code> in <code>useEffect</code>; keep the interval id in a <code>useRef</code> so a "Release slot" button can call <code>clearInterval</code>.</li>
<li>Deliberately leave out the effect's cleanup. Write a test rendering <code>DemNguoc</code> inside <code>&lt;StrictMode&gt;</code>, using <code>vi.useFakeTimers()</code>, advance 3 seconds with <code>vi.advanceTimersByTime(3000)</code> (wrapped in <code>act</code>), and print the seconds left.</li>
<li>Add the cleanup <code>return () =&gt; clearInterval(id)</code> and run again.</li>
</ol><p><strong>Done when:</strong> starting from 300 seconds, step 2 prints <code>Còn 294 giây</code> (294 seconds left) after 3 seconds (two intervals running — counting down twice as fast) and you can explain it with the run – clean up – run cycle; step 3 prints <code>Còn 297 giây</code>; a second test clicks "Release slot", advances another 3 seconds and still sees <code>Còn 297 giây</code> (measured on the lesson machine: 294 / 297 / 297); <code>npx tsc -b</code> is clean. Hint: count down with the function form <code>setConLai((c) =&gt; c - 1)</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">StrictMode</span><span class="v">wraps the app; in development re-runs renders, effects and ref callbacks to expose impure or leaky code</span></div>
<div class="kv"><span class="k">pure function</span><span class="v">same inputs ⇒ same result, changes nothing outside; component bodies must be like this</span></div>
<div class="kv"><span class="k">cleanup</span><span class="v">the function an effect/ref callback returns; React calls it before the next run and on unmount</span></div>
<div class="kv"><span class="k">ref</span><span class="v">a <code>{ current }</code> object stable across renders; writing to it causes no render</span></div>
<div class="kv"><span class="k">DOM ref</span><span class="v"><code>ref={r}</code> on a tag ⇒ <code>r.current</code> is the DOM node after commit</span></div>
<div class="kv"><span class="k">ref as a prop (React 19)</span><span class="v">function components receive <code>ref</code> like a normal prop; no <code>forwardRef</code> needed</span></div>
<div class="kv"><span class="k">useLayoutEffect</span><span class="v">an effect that runs synchronously after commit, before paint; for measuring layout, blocks painting</span></div>
<div class="kv"><span class="k">requestAnimationFrame</span><span class="v">browser API calling your function right before the next frame</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>StrictMode (development only) calls component bodies and state initialisers twice and gives effects and ref callbacks a run – clean up – run cycle; production runs once — all three measured.</li>
<li>It exposes impure renders (1 → 2 people waiting) and effects without cleanup (a listener surviving unmount). Fix with cleanups, never by removing StrictMode.</li>
<li><code>useRef</code> remembers between renders without re-rendering (3 clicks, still 1 render); anything on screen belongs in state. React 19 requires an initial value.</li>
<li>DOM refs + effects for focus/scroll/measure; the app moves focus to the heading when switching doctors. React 19: <code>ref</code> is a normal prop, ref callbacks have cleanups.</li>
<li><code>useLayoutEffect</code> measures and fixes before paint: with a 100 ms render, <code>useEffect</code> painted wrong 20/20, <code>useLayoutEffect</code> 0/20. Use it only when needed — it blocks painting.</li>
<li>jsdom does no layout: tests check logic with measurements you feed in; flicker can only be measured in a real browser.</li>
</ul>

<a class="link-card" href="https://react.dev/reference/react/StrictMode" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — &lt;StrictMode&gt;</span><span class="lc-sub">What runs twice, and why only in development.</span></span></a>
<a class="link-card" href="https://react.dev/learn/referencing-values-with-refs" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Referencing Values with Refs</span><span class="lc-sub">How refs differ from state, and when to use them.</span></span></a>
<a class="link-card" href="https://react.dev/learn/manipulating-the-dom-with-refs" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Manipulating the DOM with Refs</span><span class="lc-sub">Focus, scroll, measure; refs to your own components.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/useLayoutEffect" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — useLayoutEffect</span><span class="lc-sub">The tooltip example, and why it blocks painting.</span></span></a>
<a class="link-card" href="https://react.dev/blog/2024/12/05/react-19" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — React v19</span><span class="lc-sub">ref as a prop; cleanup functions for ref callbacks.</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>StrictMode, useRef và useLayoutEffect: chạy hai lần, nhớ mà không render, đo trước khi vẽ</h2>
<p class="lead">Mở DevTools của app phòng khám ở chế độ dev và bạn sẽ thấy một log in hai lần, một request "gọi hai lần", một effect chạy – dọn – chạy lại. Không phải bug của React, cũng không phải máy bạn lỗi: đó là <strong>StrictMode</strong> cố tình chạy thêm một lượt để lôi bug của <em>bạn</em> ra. Bài này đo chính xác nó chạy thêm cái gì (và bản production thì không), rồi đi tiếp sang hai "cửa thoát" ra khỏi thế giới render thuần: <code>useRef</code> để nhớ mà không render lại hoặc để chạm vào nút DOM, và <code>useLayoutEffect</code> để đo giao diện trước khi trình duyệt kịp vẽ. Con số đáng nhớ: cùng một tooltip, render chậm 100 ms, dùng <code>useEffect</code> thì <strong>20/20</strong> lần khung hình đầu tiên vẽ sai chỗ; dùng <code>useLayoutEffect</code> thì <strong>0/20</strong>.</p>

<p>Ví dụ nằm ở <code>src/vi-du/bai3.tsx</code>. Khung xám là output THẬT của <code>npx vitest run src/vi-du/bai3.test.tsx --reporter=verbose</code> và của một script Playwright điều khiển Chromium thật (dev server của Vite, và bản <code>vite build</code> + <code>vite preview</code>), ngày 25/09/2026, React 19.3.0.</p>

<h3>StrictMode: render hai lần, effect chạy → dọn → chạy (chỉ ở dev)</h3>
${slide('rx-11', 15, 'StrictMode: render hai lần, effect chạy → dọn → chạy (chỉ ở dev)')}
<p>Mở <code>src/main.tsx</code>: từ Mục 0, app đã nằm trong <code>&lt;StrictMode&gt;</code> — template của Vite đặt sẵn. Component thử ghi nhật ký ở ba chỗ: thân component, hàm khởi tạo của <code>useState</code>, và effect:</p>
<pre><code class="language-tsx">/* ───────── 1. StrictMode: render hai lần, effect chạy–dọn–chạy ───────── */
export function DemLuotXem() {
  nhatKy3.push('render');
  if (import.meta.env.MODE !== 'test') console.log('[DemLuotXem] render');
  const [n] = useState(() =&gt; {
    nhatKy3.push('khởi tạo state');
    return 0;
  });
  useEffect(() =&gt; {
    nhatKy3.push('effect: chạy');
    if (import.meta.env.MODE !== 'test') console.log('[DemLuotXem] effect chạy');
    return () =&gt; {
      if (import.meta.env.MODE !== 'test') console.log('[DemLuotXem] effect dọn');
      nhatKy3.push('effect: dọn');
    };
  }, []);
  return &lt;p&gt;Lượt xem: {n}&lt;/p&gt;;
}</code></pre>
<div class="out">[khong strict] render → khởi tạo state → effect: chạy → effect: dọn
[strict] lúc mount: render → khởi tạo state → khởi tạo state → render → effect: chạy → effect: dọn → effect: chạy
[strict] lúc unmount: effect: dọn</div>
<p>Không StrictMode: mỗi thứ đúng một lần (dòng "effect: dọn" cuối là lúc test gỡ component). Có StrictMode, chỉ riêng lúc mount: thân component chạy <strong>hai</strong> lần, hàm khởi tạo state chạy <strong>hai</strong> lần, và effect chạy một vòng <strong>chạy → dọn → chạy</strong>. Cùng component đó trong Chromium thật:</p>
<div class="out">strict=1 (dev):  [log] [DemLuotXem] render | [log] [DemLuotXem] render | [log] [DemLuotXem] effect chạy | [log] [DemLuotXem] effect dọn | [log] [DemLuotXem] effect chạy
strict=0 (dev):  [log] [DemLuotXem] render | [log] [DemLuotXem] effect chạy
strict=1 (vite build + preview): [log] [DemLuotXem] render | [log] [DemLuotXem] effect chạy</div>
<p>Dòng cuối là điều quan trọng nhất: bản <strong>production</strong> (có StrictMode trong code, nhưng build bằng <code>vite build</code>) chạy mỗi thứ <strong>một lần</strong>. StrictMode là công cụ của lúc phát triển; nó không làm app thật chậm đi và không gọi API thật hai lần cho người dùng.</p>
${SD.strictVi}
<p>Theo tài liệu tra cứu <code>&lt;StrictMode&gt;</code> trên react.dev, ở dev nó:</p>
<ul>
<li>gọi hai lần những hàm <strong>phải thuần</strong>: thân component, hàm khởi tạo và hàm cập nhật truyền cho <code>useState</code>/<code>useReducer</code>, hàm của <code>useMemo</code> (từ React 19, lần gọi thứ hai dùng lại kết quả ghi nhớ của lần đầu);</li>
<li>chạy thêm một vòng <strong>dọn → chạy</strong> cho mọi effect lúc mount — kiểm tra effect của bạn có dọn đúng không;</li>
<li>từ React 19, chạy thêm một vòng như vậy cho <strong>ref callback</strong> lúc mount (đo ở mục sau);</li>
<li>cảnh báo khi dùng API đã lỗi thời.</li>
</ul>
<p>Vì sao lại gỡ – dựng lại effect? Changelog React 18 (29/03/2022) giải thích: React muốn sau này có thể gỡ một phần giao diện rồi dựng lại với state cũ (chính là <code>&lt;Activity&gt;</code> ở Bài 11.2 bây giờ). Một component chỉ an toàn với điều đó nếu effect của nó chịu được "chạy, dọn, chạy lại". StrictMode tập dượt đúng kịch bản đó cho bạn ngay từ lần mount đầu.</p>
<div class="callout"><p><strong>JS nhắc nhanh — <code>useState(() =&gt; …)</code> và <code>import.meta.env.MODE</code>.</strong> Truyền một <em>hàm</em> cho <code>useState</code> ("khởi tạo lười") thì React chỉ gọi nó lúc tạo state, không gọi lại mỗi render — hợp với giá trị tốn công tính. <code>import.meta.env.MODE</code> là biến Vite đặt sẵn: <code>'development'</code> khi <code>npm run dev</code>, <code>'production'</code> khi build, <code>'test'</code> trong Vitest; ví dụ dùng nó để chỉ in <code>console.log</code> khi chạy trên trình duyệt.</p></div>

<h3>StrictMode bắt lỗi thật: render không thuần và effect quên dọn</h3>
${slide('rx-11', 16, 'StrictMode bắt effect quên dọn: listener sống cả sau khi gỡ')}
<p>"Chạy hai lần" chỉ đáng sợ với code có lỗi. Hai lỗi phổ biến nhất, đo được:</p>
<pre><code class="language-tsx">/* ───────── 2. Render KHÔNG thuần: StrictMode làm lộ ra ───────── */
const hangCho: string[] = []; // biến ngoài component
export function HangChoKhongThuan({ ten }: { ten: string }) {
  hangCho.push(ten); // ✗ sửa dữ liệu bên ngoài trong lúc render
  return &lt;p&gt;Số người chờ: {hangCho.length}&lt;/p&gt;;
}
export const datLaiHangCho = () =&gt; {
  hangCho.length = 0;
};

/* ───────── 3. Effect quên dọn: StrictMode làm lộ ra ───────── */
export function PhimTatQuenDon({ onPhim }: { onPhim: () =&gt; void }) {
  useEffect(() =&gt; {
    const xuLy = () =&gt; onPhim();
    window.addEventListener('keydown', xuLy); // ✗ không trả về hàm dọn
  }, [onPhim]);
  return &lt;p&gt;Nhấn phím bất kỳ&lt;/p&gt;;
}
export function PhimTatCoDon({ onPhim }: { onPhim: () =&gt; void }) {
  useEffect(() =&gt; {
    const xuLy = () =&gt; onPhim();
    window.addEventListener('keydown', xuLy);
    return () =&gt; window.removeEventListener('keydown', xuLy); // ✓ dọn đúng hàm đã gắn
  }, [onPhim]);
  return &lt;p&gt;Nhấn phím bất kỳ&lt;/p&gt;;
}</code></pre>
<div class="out">[khong thuan] không Strict: Số người chờ: 1 | có Strict: Số người chờ: 2
[quen don] 1 phím khi đang mở ⇒ 2 lần | 1 phím SAU KHI GỠ ⇒ thêm 2 lần
[co don] 1 phím khi đang mở ⇒ 1 lần | 1 phím sau khi gỡ ⇒ thêm 0 lần</div>
<ul>
<li><strong>Render không thuần.</strong> <code>HangChoKhongThuan</code> đẩy tên vào một mảng bên ngoài trong lúc render. Không StrictMode: "1 người chờ" — trông đúng. Có StrictMode: "2" — với <em>một</em> component. Cái sai đã có từ đầu; StrictMode chỉ làm nó hiện ra ngay. Ngoài đời, render có thể chạy nhiều lần vì nhiều lý do khác (concurrent rendering bỏ dở rồi làm lại, Chương 12), và lỗi này sẽ lộ ra ở production một cách ngẫu nhiên, khó tái hiện.</li>
<li><strong>Effect quên dọn.</strong> <code>PhimTatQuenDon</code> gắn listener <code>keydown</code> mà không trả về hàm dọn. Có StrictMode: một phím gọi handler <strong>hai</strong> lần (vòng chạy thứ hai gắn thêm listener thứ hai). Tệ hơn: gỡ component rồi, bấm một phím, handler <em>vẫn</em> chạy thêm 2 lần — listener sống mãi. Không StrictMode, bug này chỉ lộ khi người dùng mở/đóng màn hình vài lần, mỗi lần thêm một listener. Bản có dọn: 1 lần khi mở, 0 lần sau khi gỡ, dù StrictMode vẫn chạy vòng chạy – dọn – chạy.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Bẫy — "chữa" bằng cách gỡ StrictMode hoặc thêm cờ <code>daChay = useRef(false)</code>.</strong> Thấy request gọi hai lần ở dev, nhiều người xoá <code>&lt;StrictMode&gt;</code> khỏi <code>main.tsx</code>, hoặc chặn effect bằng một ref "đã chạy rồi thì thôi". Cả hai đều che bug chứ không chữa: effect vẫn không dọn, và sẽ hỏng khi component được gỡ – dựng lại thật (điều hướng qua lại, <code>&lt;Activity&gt;</code>, Fast Refresh). Cách chữa đúng là viết cleanup (huỷ đăng ký, <code>clearTimeout</code>, <code>AbortController</code> cho <code>fetch</code> — Chương 4), hoặc chuyển việc tải dữ liệu sang TanStack Query (Chương 6), vốn đã chịu được chạy hai lần.</div>
<p>Một chi tiết nhỏ mà đo mới thấy: phiên bản đầu của ví dụ truyền thẳng <code>onPhim</code> cho <code>addEventListener</code>, và StrictMode <em>không</em> làm lộ lỗi — vì trình duyệt tự bỏ qua khi gắn <strong>cùng một hàm</strong> hai lần. Bug vẫn nằm đó (gỡ component rồi listener vẫn sống). Phải đổi thành một hàm mới tạo trong effect (<code>const xuLy = () =&gt; onPhim()</code>, như code thật hay viết) thì con số "2 lần" mới hiện ra. StrictMode giúp rất nhiều, nhưng nó không bắt được mọi thứ.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Trong lab FER202, thấy <code>console.log</code> in hai lần hoặc API gọi hai lần, cách "sửa" hay gặp là xoá <code>&lt;React.StrictMode&gt;</code> khỏi <code>index.js</code> của Create React App; còn ref thì dùng <code>createRef</code>/<code>this.myRef</code> trong class và <code>React.forwardRef</code> để chuyền ref qua component → Ở công ty, StrictMode <strong>luôn bật</strong> (template Vite, Next.js đều bật sẵn) và "chạy hai lần" được đọc như một bài kiểm tra: effect phải có cleanup, render phải thuần. Ref dùng <code>useRef</code>, và từ React 19 <code>ref</code> là prop bình thường, không cần <code>forwardRef</code>. · <em>Vì sao:</em> gỡ StrictMode chỉ tắt chuông báo; bug rò listener, gọi API chồng vẫn đến tay người dùng. <code>forwardRef</code> không sai — code viết trước 2025 đầy nó và nó vẫn chạy — nhưng nhóm React đã báo sẽ khai tử nó ở bản sau.</p></div>

<h3>useRef: một chiếc hộp để nhớ — đổi nó không làm render lại</h3>
${slide('rx-11', 17, 'useRef: một chiếc hộp để nhớ — đổi nó không render lại')}
<p><code>useRef(giaTriDau)</code> trả về một object <code>{ current: giaTriDau }</code> — <strong>cùng một object</strong> ở mọi lần render của component đó. Bạn đọc/ghi <code>ref.current</code> tuỳ ý, và React <strong>không biết</strong> bạn vừa ghi: không có render nào được xếp hàng. So với state:</p>
<pre><code class="language-tsx">/* ───────── 4. useRef: nhớ mà KHÔNG render lại ───────── */
export const demRender3 = { ref: 0, state: 0 };
export function DemBangRef() {
  demRender3.ref += 1;
  const soLan = useRef(0);
  return (
    &lt;div&gt;
      &lt;button type="button" onClick={() =&gt; (soLan.current += 1)}&gt;
        Bấm (ref)
      &lt;/button&gt;
      &lt;p&gt;Đã bấm (ref): {soLan.current}&lt;/p&gt;
    &lt;/div&gt;
  );
}
export function DemBangState() {
  demRender3.state += 1;
  const [soLan, setSoLan] = useState(0);
  return (
    &lt;div&gt;
      &lt;button type="button" onClick={() =&gt; setSoLan(soLan + 1)}&gt;
        Bấm (state)
      &lt;/button&gt;
      &lt;p&gt;Đã bấm (state): {soLan}&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">[ref] màn hình: Đã bấm (ref): 0 | số lần render: 1
[state] màn hình: Đã bấm (state): 3 | số lần render: 4</div>
<p>Bấm mỗi nút ba lần. Bản ref: <code>soLan.current</code> thật sự đã thành 3 trong bộ nhớ, nhưng component render đúng 1 lần (lúc mount) nên màn hình vẫn "0" — màn hình lệch với dữ liệu. Bản state: 4 lần render (1 + 3), màn hình đúng. Quy tắc rút ra:</p>
<ul>
<li>Thứ gì <strong>hiện lên màn hình</strong> ⇒ state.</li>
<li>Thứ gì chỉ cần <strong>nhớ giữa các lần render</strong> mà không ảnh hưởng thứ được vẽ ⇒ ref: id của <code>setTimeout</code>/<code>setInterval</code> để huỷ sau, cờ "đang gửi" chặn gửi hai lần (chính <code>FormDatLich</code> Chương 3 dùng <code>dangGui = useRef(false)</code>), giá trị lần trước để so sánh, và — phổ biến nhất — <strong>nút DOM</strong>.</li>
<li><strong>Đừng đọc hay ghi <code>ref.current</code> trong lúc render</strong> (trừ khởi tạo lười). Render phải thuần; một giá trị React không theo dõi làm output của render không đoán được. Đọc/ghi ref trong handler sự kiện và effect.</li>
</ul>
${SD.refVi}
<p>Một thay đổi của React 19 trong kiểu TypeScript: <code>useRef</code> <strong>bắt buộc</strong> có giá trị đầu. Code cũ viết <code>useRef&lt;number&gt;()</code> giờ báo lỗi:</p>
<div class="out">src/vi-du/loi-co-y.tsx(5,15): error TS2554: Expected 1 arguments, but got 0.</div>
<p>Viết <code>useRef&lt;number | null&gt;(null)</code> hoặc <code>useRef&lt;number | undefined&gt;(undefined)</code>. Với nút DOM, <code>useRef&lt;HTMLInputElement&gt;(null)</code> cho kiểu <code>RefObject&lt;HTMLInputElement | null&gt;</code> — vì lúc render đầu tiên, nút chưa tồn tại.</p>

<h3>ref tới DOM: đưa focus lên tiêu đề khi sang bác sĩ khác</h3>
${slide('rx-11', 18, 'ref tới DOM: đưa focus lên tiêu đề khi sang bác sĩ khác')}
<p>Dán <code>ref={r}</code> lên một thẻ và sau khi commit, React đặt <code>r.current</code> là nút DOM thật của thẻ đó (gỡ thẻ thì đặt lại <code>null</code>). Từ đó bạn gọi được những API DOM mà React không bọc: <code>focus()</code>, <code>scrollIntoView()</code>, <code>getBoundingClientRect()</code>, <code>play()</code> của video. Ví dụ nhỏ, kèm một thay đổi lớn của React 19 — <strong><code>ref</code> là prop bình thường</strong> cho function component:</p>
<pre><code class="language-tsx">/* ───────── 5. ref tới DOM + ref là prop thường (React 19, không cần forwardRef) ───────── */
function ONhapSo({ nhan, ref }: { nhan: string; ref?: Ref&lt;HTMLInputElement&gt; }) {
  return (
    &lt;label&gt;
      {nhan} &lt;input ref={ref} inputMode="numeric" /&gt;
    &lt;/label&gt;
  );
}
export function FormMaXacNhan() {
  const oMa = useRef&lt;HTMLInputElement&gt;(null);
  return (
    &lt;div&gt;
      &lt;ONhapSo nhan="Mã xác nhận" ref={oMa} /&gt;
      &lt;button type="button" onClick={() =&gt; oMa.current?.focus()}&gt;
        Nhập mã
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">[ref DOM] focus đang ở: INPUT | nhãn: Mã xác nhận</div>
<p><code>ONhapSo</code> nhận <code>ref</code> như mọi prop khác và chuyển nó xuống thẻ <code>&lt;input&gt;</code>. Trước React 19, phải bọc component trong <code>forwardRef((props, ref) =&gt; …)</code>; changelog React 19.0.0 (05/12/2024) ghi "<em>ref as a prop</em>: removing the need for <code>forwardRef</code>".</p>
<p>Giờ tới app. Trong SPA, đổi trang không tải lại trang, nên với người dùng trình đọc màn hình hay người dùng bàn phím, bấm "BS. Hoàng Đức Huy" xong… không có gì báo là đã sang trang mới; focus vẫn nằm ở cái link vừa bấm (hoặc rơi về <code>&lt;body&gt;</code> khi link đó biến mất). Cách làm phổ biến: đưa focus lên tiêu đề của trang mới.</p>
<pre><code class="language-tsx">export function TrangChiTietBacSi() {
  const { id = '' } = useParams();
  const { data: bacSi, isPending, error, refetch, isFetching } = useChiTietBacSi(id);
  const { data: tatCa } = useBacSi();
  const tieuDeRef = useRef&lt;HTMLHeadingElement&gt;(null);

  // Chương 11: đổi trang trong SPA không tải lại trang ⇒ trình đọc màn hình không biết đã sang trang mới.
  // Đưa focus lên tiêu đề mỗi khi sang bác sĩ khác: người dùng bàn phím/trình đọc màn hình bắt đầu từ đầu trang.
  useEffect(() =&gt; {
    tieuDeRef.current?.focus();
  }, [bacSi?.id]);

  if (isPending) return &lt;p aria-busy="true"&gt;Đang tải thông tin bác sĩ…&lt;/p&gt;;
  if (!bacSi) return &lt;LoiTaiDuLieu tieuDe="Không mở được trang bác sĩ" loi={error!} onThuLai={() =&gt; refetch()} dangThuLai={isFetching} /&gt;;

  const cungKhoa = (tatCa ?? []).filter((b) =&gt; b.chuyenKhoa === bacSi.chuyenKhoa &amp;&amp; b.id !== bacSi.id);
  return (
    &lt;div className="trang-bac-si"&gt;
      &lt;section className="chi-tiet" aria-label={&#96;Giới thiệu &#36;{bacSi.ten}&#96;}&gt;
        &lt;h2 ref={tieuDeRef} tabIndex={-1}&gt;
          {bacSi.ten}
        &lt;/h2&gt;</code></pre>
<div class="out">trước: [focus] đang ở: BODY "Phòng khám An TâmMở cửa 7:30–2"
sau:   [focus] đang ở: H2 "BS. Hoàng Đức Huy"</div>
<p>Ba chi tiết: <code>tabIndex={-1}</code> để một <code>&lt;h2&gt;</code> (vốn không focus được) nhận focus <em>bằng code</em> mà không chen vào vòng phím Tab; effect phụ thuộc <code>bacSi?.id</code> để chạy mỗi lần sang bác sĩ khác; và CSS <code>[tabindex='-1']:focus { outline: none; }</code> để không vẽ khung focus quanh tiêu đề (nó không phải thứ để bấm). Vì sao focus trong <code>useEffect</code> mà không trong thân component? Vì trong lúc render, nút <code>&lt;h2&gt;</code> của lần này <em>chưa được commit</em> — <code>tieuDeRef.current</code> có thể còn là <code>null</code> hoặc là nút của lần trước. Effect chạy sau commit, khi ref đã trỏ đúng nút.</p>
<p>React 19 còn cho <strong>ref callback trả về hàm dọn</strong> (như effect), và StrictMode chạy thêm vòng gắn – dọn – gắn cho nó:</p>
<pre><code class="language-tsx">/* ───────── 6. ref callback có hàm dọn (React 19) — StrictMode chạy nó thêm một lượt ───────── */
export function DoKichThuoc() {
  return (
    &lt;div
      ref={(nut) =&gt; {
        if (!nut) return;
        nhatKy3.push(&#96;ref gắn: &lt;&#36;{nut.tagName.toLowerCase()}&gt;&#96;);
        return () =&gt; {
          nhatKy3.push('ref dọn');
        };
      }}
    &gt;
      Hộp
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">[ref callback] ref gắn: &lt;div&gt; → ref dọn → ref gắn: &lt;div&gt; → ref dọn</div>
<p>Hệ quả về kiểu: ref callback giờ chỉ được trả về <code>undefined</code> hoặc một hàm dọn. Viết tắt kiểu mũi tên trả về giá trị (<code>ref={(n) =&gt; (nutDaGan = n)}</code> — phép gán trả về <code>n</code>) là lỗi:</p>
<div class="out">src/vi-du/loi-co-y.tsx(6,15): error TS2322: Type '(n: HTMLDivElement | null) =&gt; HTMLDivElement | null' is not assignable to type 'Ref&lt;HTMLDivElement&gt; | undefined'.
  Type '(n: HTMLDivElement | null) =&gt; HTMLDivElement | null' is not assignable to type '(instance: HTMLDivElement | null) =&gt; void | (() =&gt; VoidOrUndefinedOnly)'.
    Type 'HTMLDivElement | null' is not assignable to type 'void | (() =&gt; VoidOrUndefinedOnly)'.
      Type 'null' is not assignable to type 'void | (() =&gt; VoidOrUndefinedOnly)'.</div>
<p>Sửa: dùng thân hàm có ngoặc nhọn, <code>ref={(n) =&gt; { nutDaGan = n; }}</code>.</p>

<h3>useLayoutEffect: đo và đặt lại chỗ TRƯỚC khi trình duyệt vẽ</h3>
${slide('rx-11', 19, 'useLayoutEffect: đo và đặt lại chỗ TRƯỚC khi trình duyệt vẽ')}
<p>Tooltip (chú thích nổi) là ví dụ kinh điển. Nó nên nằm <em>trên</em> nút ⓘ, nhưng nếu nút sát mép trên màn hình thì phải lật <em>xuống dưới</em>. Muốn biết có đủ chỗ không, phải biết chiều cao thật của tooltip — mà muốn đo thì phải vẽ nó ra trước. Vậy luôn có một lần render "chưa biết vị trí" rồi mới đến lần render "đúng vị trí". Câu hỏi là: người dùng có <strong>nhìn thấy</strong> lần đầu không?</p>
<p>Đo bằng một tooltip thử, chọn giữa <code>useEffect</code> và <code>useLayoutEffect</code> theo prop (chỉ để so sánh — hook được chọn cố định cho mỗi component, app thật đừng viết thế), và một tuỳ chọn làm chậm mỗi lần render như ví dụ trên react.dev:</p>
<pre><code class="language-tsx">/* ───────── 7. useLayoutEffect vs useEffect: có khung hình nào vẽ vị trí SAI không ───────── */
export function ChuThichThu({ dung, chamMs = 0 }: { dung: 'layout' | 'effect'; chamMs?: number }) {
  const batDau = performance.now();
  while (performance.now() - batDau &lt; chamMs) {
    // cố tình làm chậm mỗi lần render (giả lập máy yếu / cây component nặng) — như ví dụ trên react.dev
  }
  const [mo, setMo] = useState(false);
  const [top, setTop] = useState&lt;number | null&gt;(null);
  const nut = useRef&lt;HTMLButtonElement&gt;(null);
  const hop = useRef&lt;HTMLDivElement&gt;(null);
  const hieuUng = dung === 'layout' ? useLayoutEffect : useEffect; // chỉ để so sánh — app thật chọn MỘT
  hieuUng(() =&gt; {
    if (!mo || !nut.current || !hop.current) return;
    const r = nut.current.getBoundingClientRect();
    setTop(r.top - hop.current.getBoundingClientRect().height - 8);
  }, [mo]);
  return (
    &lt;div style={{ paddingTop: 160 }}&gt;
      &lt;button ref={nut} type="button" onMouseEnter={() =&gt; setMo(true)} onMouseLeave={() =&gt; (setMo(false), setTop(null))}&gt;
        ⓘ Rê chuột vào đây ({dung})
      &lt;/button&gt;
      {mo &amp;&amp; (
        &lt;div ref={hop} role="tooltip" data-top={top ?? 'chua-do'} style={{ position: 'fixed', left: 20, top: top ?? 0, background: '#0f172a', color: '#fff', padding: 8, borderRadius: 8 }}&gt;
          Giờ theo giờ Việt Nam (UTC+7)
        &lt;/div&gt;
      )}
    &lt;/div&gt;
  );
}</code></pre>
<p>Script Playwright mở trang trong Chromium thật, rê chuột vào nút, và ghi <code>data-top</code> của tooltip ở <strong>bốn khung hình liên tiếp</strong> bằng <code>requestAnimationFrame</code> (hàm trình duyệt gọi ngay trước khi vẽ mỗi khung) — khung đầu tiên chính là thứ trình duyệt sắp vẽ ra. Mỗi cấu hình chạy 20 lần:</p>
<div class="out">tooltip-effect cham=0ms: 20 lần rê chuột, khung hình đầu tiên được vẽ → {"117,117,117,117":20}
tooltip-layout cham=0ms: 20 lần rê chuột, khung hình đầu tiên được vẽ → {"117,117,117,117":20}
tooltip-effect cham=100ms: 20 lần rê chuột, khung hình đầu tiên được vẽ → {"chua-do,117,117,117":20}
tooltip-layout cham=100ms: 20 lần rê chuột, khung hình đầu tiên được vẽ → {"117,117,117,117":20}</div>
<p>Hai dòng đầu là điều nhiều bài viết bỏ qua: trên máy nhanh, render nhẹ, <strong>cả hai</strong> đều không bao giờ vẽ sai — React thường chạy effect kịp trước khung hình kế tiếp. Hai dòng sau là lý do <code>useLayoutEffect</code> tồn tại: khi render chậm (máy yếu, cây component nặng), bản <code>useEffect</code> để trình duyệt <strong>vẽ khung đầu tiên với tooltip chưa đo</strong> (<code>chua-do</code>, nằm ở <code>top: 0</code> — góc trên màn hình) trong <strong>20/20</strong> lần, rồi mới nhảy về đúng chỗ: người dùng thấy nó nháy. Bản <code>useLayoutEffect</code>: <strong>0/20</strong>.</p>
<p><strong>Chạy thử từng bước</strong> với <code>useLayoutEffect</code>:</p>
<ol>
<li>Rê chuột ⇒ <code>setMo(true)</code> ⇒ render (chậm 100 ms): tooltip có mặt trong JSX với <code>top: 0</code> vì chưa đo.</li>
<li>Commit: tooltip được chèn vào DOM, <code>hop.current</code> trỏ vào nó.</li>
<li><code>useLayoutEffect</code> chạy <strong>ngay sau commit, đồng bộ, trước khi trả quyền cho trình duyệt</strong>: đo, gọi <code>setTop(117)</code>.</li>
<li>Vì cập nhật đó xảy ra trong layout effect, React render lại và commit <em>ngay</em>, vẫn trước khi trình duyệt vẽ.</li>
<li>Trình duyệt vẽ lần đầu tiên — tooltip đã ở <code>top: 117</code>.</li>
</ol>
<p>Với <code>useEffect</code>, bước 3 chạy <em>sau</em> khi trình duyệt có cơ hội vẽ — và sau 100 ms render, trình duyệt đã tới hạn vẽ một khung, nên nó vẽ luôn bản sai. Cái giá của <code>useLayoutEffect</code>: nó <strong>chặn</strong> trình duyệt vẽ cho tới khi xong; code nặng trong đó làm cả trang khựng. Vì vậy react.dev khuyên dùng <code>useEffect</code> mặc định, chỉ đổi sang <code>useLayoutEffect</code> cho việc <strong>đo bố cục rồi sửa ngay thứ được vẽ</strong>: vị trí tooltip/menu nổi, tự cuộn tới phần tử, đo kích thước để chọn bố cục. (Nó cũng không chạy khi render trên máy chủ — một điểm cần biết khi sang Next.js.)</p>
${SD.layoutVi}
<p>Component thật của app, <code>ChuThich</code>, cạnh chữ "Giờ khám" trên trang bác sĩ (chụp ở slide trên), dùng đúng cơ chế này, cộng thêm lật trên/dưới và không tràn mép ngang:</p>
<pre><code class="language-tsx">/**
 * Chú thích nổi (tooltip) cạnh một nút ⓘ. Mặc định nằm TRÊN nút; không đủ chỗ phía trên thì lật XUỐNG DƯỚI.
 * Muốn biết "đủ chỗ không" phải ĐO chiều cao thật của chú thích ⇒ phải vẽ nó ra trước rồi mới đo được.
 * useLayoutEffect: đo + đặt lại vị trí TRƯỚC khi trình duyệt vẽ ⇒ người dùng không bao giờ thấy vị trí sai.
 */
export function ChuThich({ nhan, children }: { nhan: string; children: ReactNode }) {
  const [mo, setMo] = useState(false);
  const [viTri, setViTri] = useState&lt;ViTri | null&gt;(null);
  const nutRef = useRef&lt;HTMLButtonElement&gt;(null);
  const hopRef = useRef&lt;HTMLDivElement&gt;(null);
  const id = useId();

  useLayoutEffect(() =&gt; {
    if (!mo || !nutRef.current || !hopRef.current) return;
    const nut = nutRef.current.getBoundingClientRect();
    const hop = hopRef.current.getBoundingClientRect();
    const phia = nut.top - hop.height - KHE &gt;= 0 ? 'tren' : 'duoi';
    const left = Math.max(KHE, Math.min(nut.left + nut.width / 2 - hop.width / 2, window.innerWidth - hop.width - KHE));
    setViTri({ phia, left, top: phia === 'tren' ? nut.top - hop.height - KHE : nut.bottom + KHE });
  }, [mo]);

  function dong() {
    setMo(false);
    setViTri(null);
  }</code></pre>
<p>Ba test của nó chạy trong jsdom — môi trường <strong>không tính bố cục</strong>: mọi <code>getBoundingClientRect()</code> đều trả về 0. Test tự "cho" số đo bằng cách gán đè hàm đó trên đúng nút cần đo:</p>
<div class="out">[tooltip] nút ở top=4 ⇒ duoi | nút ở top=300 ⇒ tren | style: top: 292px; left: 112px;</div>
<div class="pitfall co-tieu-de"><strong>Bẫy — tin rằng jsdom kiểm được bố cục.</strong> Test của <code>ChuThich</code> xanh không có nghĩa tooltip đặt đúng chỗ trên trình duyệt: jsdom trả 0 cho mọi kích thước, nên test chỉ kiểm được <em>logic</em> lật trên/dưới với số đo bạn tự đưa vào. Chuyện "có nháy không" chỉ đo được trên trình duyệt thật — như script Playwright ở trên, hoặc test đầu–cuối Chương 10.</div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Vì sao ở dev effect của tôi chạy hai lần? useEffect khác useLayoutEffect thế nào?"</p>
<p>Chạy hai lần là StrictMode, chỉ ở dev: React gọi thêm một lần các hàm phải thuần và cho mỗi effect một vòng chạy – dọn – chạy lúc mount, để lộ effect thiếu cleanup; bản production chạy một lần — em đã đo cả hai. Cách xử lý là viết cleanup đúng, không phải gỡ StrictMode. Về hai hook: cả hai chạy sau commit; <code>useLayoutEffect</code> chạy đồng bộ trước khi trình duyệt vẽ nên hợp để đo bố cục rồi sửa vị trí (tooltip, menu nổi) mà không nháy, đổi lại nó chặn việc vẽ; <code>useEffect</code> để trình duyệt vẽ trước, là mặc định cho mọi thứ khác. Em đo một tooltip render chậm 100 ms: useEffect vẽ sai khung đầu 20/20 lần, useLayoutEffect 0/20.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> một đồng hồ đếm ngược "Giữ khung giờ cho bạn trong 5:00" — việc thật của nhiều trang đặt lịch.</p><ol>
<li>Viết <code>DemNguoc</code> với state <code>conLai</code> (giây) và một <code>setInterval</code> trong <code>useEffect</code>; lưu id của interval trong <code>useRef</code> để nút "Huỷ giữ chỗ" gọi được <code>clearInterval</code>.</li>
<li>Cố ý bỏ cleanup của effect. Viết test render <code>DemNguoc</code> trong <code>&lt;StrictMode&gt;</code>, dùng <code>vi.useFakeTimers()</code>, tua 3 giây bằng <code>vi.advanceTimersByTime(3000)</code> (bọc trong <code>act</code>), và in số giây còn lại.</li>
<li>Thêm cleanup <code>return () =&gt; clearInterval(id)</code> và chạy lại.</li>
</ol><p><strong>Đạt khi:</strong> bắt đầu từ 300 giây, bước 2 in <code>Còn 294 giây</code> sau 3 giây (hai interval cùng chạy — giảm nhanh gấp đôi) và bạn giải thích được bằng vòng chạy – dọn – chạy; bước 3 in <code>Còn 297 giây</code>; một test thứ hai bấm "Huỷ giữ chỗ" rồi tua thêm 3 giây vẫn thấy <code>Còn 297 giây</code> (đo trên máy dựng bài: 294 / 297 / 297); <code>npx tsc -b</code> sạch. Gợi ý: đếm lùi bằng dạng hàm <code>setConLai((c) =&gt; c - 1)</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">StrictMode (chế độ nghiêm)</span><span class="v">bọc ngoài app; ở dev chạy thêm render, effect, ref callback để lộ code không thuần/thiếu dọn</span></div>
<div class="kv"><span class="k">pure function (hàm thuần)</span><span class="v">cùng đầu vào ⇒ cùng kết quả, không sửa gì bên ngoài; thân component phải như vậy</span></div>
<div class="kv"><span class="k">cleanup (hàm dọn)</span><span class="v">hàm effect/ref callback trả về; React gọi trước lần chạy sau và lúc gỡ</span></div>
<div class="kv"><span class="k">ref (tham chiếu)</span><span class="v">object <code>{ current }</code> ổn định qua các lần render; ghi vào không gây render</span></div>
<div class="kv"><span class="k">DOM ref</span><span class="v"><code>ref={r}</code> trên thẻ ⇒ <code>r.current</code> là nút DOM sau commit</span></div>
<div class="kv"><span class="k">ref as a prop (React 19)</span><span class="v">function component nhận <code>ref</code> như prop thường; không cần <code>forwardRef</code></span></div>
<div class="kv"><span class="k">useLayoutEffect</span><span class="v">effect chạy đồng bộ sau commit, trước khi vẽ; để đo bố cục rồi sửa, chặn việc vẽ</span></div>
<div class="kv"><span class="k">requestAnimationFrame</span><span class="v">API trình duyệt gọi hàm của bạn ngay trước khung hình kế tiếp</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>StrictMode (chỉ dev) gọi hai lần thân component và hàm khởi tạo state, cho effect và ref callback một vòng chạy – dọn – chạy; production một lần — đo cả ba.</li>
<li>Nó làm lộ render không thuần (1 → 2 người chờ) và effect quên dọn (listener sống sau khi gỡ). Chữa bằng cleanup, đừng gỡ StrictMode.</li>
<li><code>useRef</code>: nhớ giữa các lần render mà không render lại (3 lần bấm, vẫn 1 render); thứ hiện lên màn hình thì dùng state. React 19 bắt buộc giá trị đầu.</li>
<li>DOM ref + effect để focus/cuộn/đo; app đưa focus lên tiêu đề khi sang bác sĩ khác. React 19: <code>ref</code> là prop thường, ref callback có hàm dọn.</li>
<li><code>useLayoutEffect</code> đo và sửa trước khi vẽ: render chậm 100 ms, <code>useEffect</code> vẽ sai 20/20, <code>useLayoutEffect</code> 0/20. Dùng khi cần, vì nó chặn việc vẽ.</li>
<li>jsdom không tính bố cục: test kiểm logic với số đo tự đưa vào; chuyện nháy chỉ đo được trên trình duyệt thật.</li>
</ul>

<a class="link-card" href="https://react.dev/reference/react/StrictMode" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — &lt;StrictMode&gt;</span><span class="lc-sub">Chạy hai lần những gì, và vì sao chỉ ở dev.</span></span></a>
<a class="link-card" href="https://react.dev/learn/referencing-values-with-refs" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Referencing Values with Refs</span><span class="lc-sub">Ref khác state thế nào, khi nào dùng.</span></span></a>
<a class="link-card" href="https://react.dev/learn/manipulating-the-dom-with-refs" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Manipulating the DOM with Refs</span><span class="lc-sub">focus, cuộn, đo; ref tới component của bạn.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/useLayoutEffect" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — useLayoutEffect</span><span class="lc-sub">Ví dụ tooltip, và vì sao nó chặn việc vẽ.</span></span></a>
<a class="link-card" href="https://react.dev/blog/2024/12/05/react-19" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — React v19</span><span class="lc-sub">ref là prop; hàm dọn cho ref callback.</span></span></a>
</div>
`,
  },
  {
    title: '11.4 — Portals and error boundaries: escaping the parent, errors that don’t blank the page|||11.4 — Portal và error boundary: thoát thẻ cha, lỗi không làm trắng trang',
    slug: 'rx-11-4-portal-error-boundary',
    type: 'LESSON',
    isFreePreview: true,
    description: 'createPortal cho hộp xác nhận huỷ lịch (thoát overflow: hidden, sự kiện nổi bọt theo cây React, focus và Escape); error boundary bắt lỗi lúc render chứ không bắt onClick; resetKeys, TanStack throwOnError, onCaughtError — và phần tự gõ tiếp dự án của cả chương.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>Portals and error boundaries: dialogs that escape their parent, errors that don’t blank the page</h2>
<p class="lead">The chapter's last two tools both date from React 16 (09/2017) and both fix problems an ordinary component cannot. A <strong>portal</strong> lets a component draw its element somewhere else in the DOM — the cancel-confirmation dialog is no longer clipped by its parent's <code>overflow: hidden</code> — while staying that component's child in the React tree. An <strong>error boundary</strong> catches an error during render so only that part breaks, instead of React unmounting the whole app and leaving a blank page. Lesson 11.5 right after it puts the whole chapter into the app: five upgrades, fourteen tests that must pass.</p>

<p>Small examples live in <code>src/vi-du/bai4.tsx</code>; the app's parts live in <code>src/components/HopXacNhan.tsx</code>, <code>src/components/RanhGioiLoi.tsx</code> and <code>src/features/khung/BoCuc.tsx</code>. Output is REAL (<code>npx vitest run … --reporter=verbose</code>; a real Chromium through Playwright for screenshots), on 25 September 2026, React 19.3.0, jsdom 30.1.1.</p>

<h3>Portals: draw somewhere else in the DOM, stay a child in the React tree</h3>
${slide('rx-11', 20, 'Portal: the dialog escapes its parent’s overflow: hidden')}
<p>An appointment card has <code>overflow: hidden</code> (to round image corners, to cut long text — very common) and a "Huỷ lịch" (cancel) button opening a confirmation dialog. A dialog rendered right inside the card is clipped at the card's edge: only the top half of the "Đóng" (close) button is left (left screenshot on the slide). <code>z-index</code> cannot save it — what clips it is an ancestor's <code>overflow</code>, and the "stacking contexts" that <code>transform</code>, <code>opacity</code> and <code>position</code> create. The thorough fix: take the dialog out of the card, straight onto <code>&lt;body&gt;</code>.</p>
<pre><code class="language-tsx">/* ───────── 1. Hộp mở BÊN TRONG thẻ có overflow: hidden (bị cắt) vs qua portal ───────── */
function Hop({ children }: { children: ReactNode }) {
  return (
    &lt;div role="dialog" aria-label="Xác nhận" className="hop-thu"&gt;
      {children}
    &lt;/div&gt;
  );
}
export function TheCoHop({ quaPortal }: { quaPortal: boolean }) {
  const [mo, setMo] = useState(false);
  const hop = (
    &lt;Hop&gt;
      &lt;p&gt;Huỷ lịch 14:00 · 01/10/2026 với BS. Trần Thu Hà?&lt;/p&gt;
      &lt;button type="button" onClick={() =&gt; setMo(false)}&gt;
        Đóng
      &lt;/button&gt;
    &lt;/Hop&gt;
  );
  return (
    &lt;article className="the-bi-cat"&gt;
      &lt;h3&gt;{quaPortal ? 'Qua portal' : 'Không portal'}&lt;/h3&gt;
      &lt;button type="button" onClick={() =&gt; setMo(true)}&gt;
        Huỷ lịch
      &lt;/button&gt;
      {mo &amp;&amp; (quaPortal ? createPortal(hop, document.body) : hop)}
    &lt;/article&gt;
  );
}</code></pre>
<div class="out">[vi tri] không portal: cha của hộp = the-bi-cat | qua portal: cha của hộp = BODY</div>
<p>("cha của hộp" = the dialog's parent.) <code>createPortal(jsx, domNode)</code> (imported from <code>react-dom</code>) takes two things: <strong>what to draw</strong> and <strong>which DOM node to draw into</strong>. It returns something you place in JSX like any element. In the DOM the dialog is a direct child of <code>&lt;body&gt;</code>; in the React tree it is still a child of <code>TheCoHop</code> — it can read the <code>mo</code> state, call <code>setMo</code>, and is unmounted when <code>TheCoHop</code> is.</p>
${SD.portalEn}

<h3>Events inside a portal bubble through the REACT tree, not the DOM tree</h3>
${slide('rx-11', 21, 'The DOM sits in body, but events bubble through the React tree')}
<p>"Still a child in the React tree" has a surprising consequence. A card has an <code>onClick</code> to "select the card"; inside it, a dialog opens through a portal:</p>
<pre><code class="language-tsx">/* ───────── 2. Sự kiện trong portal nổi bọt theo CÂY REACT, không theo cây DOM ───────── */
export const nhatKy4: string[] = [];
export function TheChonDuoc({ chanNoiBot }: { chanNoiBot: boolean }) {
  const [mo, setMo] = useState(false);
  return (
    &lt;div onClick={() =&gt; nhatKy4.push('thẻ: onClick (chọn thẻ)')}&gt;
      &lt;button
        type="button"
        onClick={(e) =&gt; {
          e.stopPropagation();
          setMo(true);
        }}
      &gt;
        Mở hộp
      &lt;/button&gt;
      {mo &amp;&amp;
        createPortal(
          &lt;div role="dialog" aria-label="Hộp" onClick={chanNoiBot ? (e) =&gt; e.stopPropagation() : undefined}&gt;
            &lt;button type="button" onClick={() =&gt; nhatKy4.push('hộp: bấm OK')}&gt;
              OK
            &lt;/button&gt;
          &lt;/div&gt;,
          document.body,
        )}
    &lt;/div&gt;
  );
}

/* ───────── 3. Context đi xuyên portal ───────── */
const NgonNgu = createContext&lt;'vi' | 'en'&gt;('vi');
function NoiDungHop() {
  const nn = use(NgonNgu);
  return &lt;p&gt;{nn === 'en' ? 'Cancel this appointment?' : 'Huỷ lịch hẹn này?'}&lt;/p&gt;;
}
export function ContextXuyenPortal() {
  return (
    &lt;NgonNgu value="en"&gt;
      &lt;div&gt;{createPortal(&lt;NoiDungHop /&gt;, document.body)}&lt;/div&gt;
    &lt;/NgonNgu&gt;
  );
}</code></pre>
<div class="out">[noi bot] không chặn: hộp: bấm OK · thẻ: onClick (chọn thẻ)
[noi bot] có chặn: hộp: bấm OK
[context] hộp trong &lt;body&gt; đọc được ngôn ngữ: Cancel this appointment?</div>
<p>("không chặn" = not stopped, "có chặn" = stopped, "thẻ" = card, "hộp" = dialog.) In the DOM, the OK button sits under <code>&lt;body&gt;</code>, unrelated to the card. Yet clicking OK also runs the <strong>card's</strong> <code>onClick</code>. The <code>createPortal</code> reference on react.dev says it plainly: events from portals propagate according to the <em>React tree</em>, not the DOM tree. Likewise context passes through portals — the dialog in <code>&lt;body&gt;</code> reads the <code>'en'</code> language from the Provider around the card. That is exactly what you want for context (the dialog in the right language and theme), and usually what you do <em>not</em> want for events.</p>
${SD.noiBotEn}
<div class="pitfall co-tieu-de"><strong>Trap — clicking inside the dialog selects or navigates the card underneath.</strong> A list of appointments where clicking a row opens its details, with a "Cancel" button on the row opening a portal dialog: click "Không, giữ lại" (no, keep it) in the dialog ⇒ the event bubbles to the row ⇒ the page jumps to the appointment's details. No error; just "the app keeps navigating by itself". Fix: stop propagation at the <strong>dialog's root</strong> (<code>onClick={(e) =&gt; e.stopPropagation()}</code>), as the app's <code>HopXacNhan</code> does; or place the portal higher in the React tree (outside the row).</div>
<div class="callout"><p><strong>JS quick reminder — event bubbling and <code>e.stopPropagation()</code>.</strong> When you click a button, the <code>click</code> event does not stop at the button: it "bubbles" up through each ancestor, and every ancestor with an <code>onClick</code> is called. <code>e.stopPropagation()</code> says "stop here, don't bubble further". It does not cancel the default behaviour (that is <code>e.preventDefault()</code>, e.g. stopping a form from submitting itself).</p></div>

<h3>The app's cancel-confirmation dialog: portal, focus on the safe button, Escape</h3>
${slide('rx-11', 22, 'The cancel dialog: portal, focus on the safe button, Escape')}
<p>Before this chapter, the "Huỷ" (cancel) button in "Lịch hẹn của tôi" (my appointments) cancelled immediately — one mis-tap on a phone and the appointment is gone. A real app asks first. Here is the shared confirmation dialog, combining everything from this lesson and the previous one:</p>
<pre><code class="language-tsx">import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface HopXacNhanProps {
  tieuDe: string;
  children: ReactNode;
  nhanDongY: string;
  nhanHuy?: string;
  dangXuLy?: boolean;
  onDongY: () =&gt; void;
  onDong: () =&gt; void;
}

/**
 * Hộp xác nhận (modal). Vẽ bằng createPortal vào &lt;body&gt;: không bị overflow/z-index của thẻ cha cắt mất,
 * nhưng vẫn là con của component gọi nó trong CÂY REACT (context, sự kiện nổi bọt theo cây React).
 * Mở ra ⇒ focus vào nút AN TOÀN (không phá gì). Escape hoặc bấm nền ⇒ đóng. Đóng ⇒ focus về nút đã mở hộp.
 */
export function HopXacNhan({ tieuDe, children, nhanDongY, nhanHuy = 'Không, giữ lại', dangXuLy = false, onDongY, onDong }: HopXacNhanProps) {
  const idTieuDe = useId();
  const nutAnToan = useRef&lt;HTMLButtonElement&gt;(null);

  useEffect(() =&gt; {
    const truoc = document.activeElement as HTMLElement | null; // nút "Huỷ" đã mở hộp
    nutAnToan.current?.focus();
    const khiBamPhim = (e: KeyboardEvent) =&gt; {
      if (e.key === 'Escape') onDong();
    };
    document.addEventListener('keydown', khiBamPhim);
    return () =&gt; {
      document.removeEventListener('keydown', khiBamPhim);
      truoc?.focus(); // trả focus về chỗ cũ khi hộp đóng
    };
  }, [onDong]);

  return createPortal(
    &lt;div className="nen-hop" onClick={onDong}&gt;
      &lt;div
        className="hop-xac-nhan"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTieuDe}
        onClick={(e) =&gt; e.stopPropagation()} // bấm TRONG hộp không tính là bấm nền
      &gt;
        &lt;h2 id={idTieuDe}&gt;{tieuDe}&lt;/h2&gt;
        &lt;div&gt;{children}&lt;/div&gt;
        &lt;div className="hang-nut"&gt;
          &lt;button ref={nutAnToan} type="button" className="nut" onClick={onDong} disabled={dangXuLy}&gt;
            {nhanHuy}
          &lt;/button&gt;
          &lt;button type="button" className="nut nut-nguy-hiem" onClick={onDongY} disabled={dangXuLy}&gt;
            {dangXuLy ? 'Đang xử lý…' : nhanDongY}
          &lt;/button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;,
    document.body,
  );
}</code></pre>
<p>Read it against the requirements of a dialog usable by keyboard and screen-reader users:</p>
<ul>
<li><strong>A portal into <code>&lt;body&gt;</code></strong> so it is never clipped, and a backdrop with <code>position: fixed; inset: 0</code> covering the screen.</li>
<li><strong><code>role="dialog"</code>, <code>aria-modal="true"</code>, <code>aria-labelledby</code></strong> pointing at the title (id generated with <code>useId</code> — unique even with several dialogs) ⇒ screen readers announce "Huỷ lịch hẹn này?, dialog".</li>
<li><strong>Focus goes to the safe button</strong> with <code>useRef</code> + <code>focus()</code> in an effect (Lesson 11.3): someone who hits Enter by accident only "keeps" the appointment.</li>
<li><strong>Escape and clicking the backdrop close it</strong>; clicks <em>inside</em> the dialog stop propagation so they do not count as backdrop clicks.</li>
<li><strong>Closing returns focus to the button that opened it</strong>: the effect remembers <code>document.activeElement</code> on open and the cleanup focuses it again. From Lesson 11.3 we know StrictMode runs this effect run – clean up – run at mount; the cleanup returns focus to the Cancel button and the second run remembers that same button — it copes.</li>
</ul>
<p><code>LichHenCuaToi</code> keeps "which appointment is awaiting confirmation" in state, and only calls the cancel mutation (optimistic update, Chapter 6) when the user agrees:</p>
<pre><code class="language-tsx">export function LichHenCuaToi() {
  const { data: lichHen, isPending, error, refetch, isFetching } = useLichHen();
  const { data: bacSi } = useBacSi();
  const huy = useHuyLichHen();
  const [canHuy, setCanHuy] = useState&lt;LichHenCoGio | null&gt;(null); // lịch đang chờ xác nhận huỷ
  const dongHop = useCallback(() =&gt; setCanHuy(null), []); // ổn định: effect của hộp không chạy lại mỗi render
  const tenBacSi = (id: string) =&gt; bacSi?.find((b) =&gt; b.id === id)?.ten ?? id;</code></pre>
<pre><code class="language-tsx">      {canHuy &amp;&amp; (
        &lt;HopXacNhan
          tieuDe="Huỷ lịch hẹn này?"
          nhanDongY="Huỷ lịch"
          onDong={dongHop}
          onDongY={() =&gt; {
            huy.mutate(canHuy);
            setCanHuy(null);
          }}
        &gt;
          &lt;p&gt;
            {tenBacSi(canHuy.bacSiId)} · {hienGio(canHuy.batDau)} · {canHuy.benhNhan.hoTen}
          &lt;/p&gt;
          &lt;p&gt;Khung giờ sẽ được mở lại cho người khác đặt.&lt;/p&gt;
        &lt;/HopXacNhan&gt;
      )}
    &lt;/section&gt;
  );
}</code></pre>
<div class="out">[portal] hộp nằm trong vùng render của component? false | cha trực tiếp của lớp nền: BODY
[portal] focus đang ở: Không, giữ lại
[escape] còn hộp? false | focus về: Huỷ lịch lh-1 | trạng thái: cho-xac-nhan
[dong y] máy chủ: da-huy | còn hộp? false</div>
<p>(Is the dialog inside the component's render area? false; the backdrop's parent: BODY; focus on "Không, giữ lại"; after Escape: no dialog, focus back on "Huỷ lịch lh-1", status still pending; after agreeing: the server says cancelled.) And in a real Chromium (screenshot on the slide): the backdrop's parent is <code>BODY</code>, focus is on "Không, giữ lại", Escape returns focus to "Huỷ lịch lh-1".</p>
<div class="pitfall co-tieu-de"><strong>Trap — an inline <code>onDong</code> makes the dialog steal focus.</strong> The dialog's effect depends on <code>[onDong]</code>. Write <code>onDong={() =&gt; setCanHuy(null)}</code> and every time the parent re-renders (TanStack refetching the list in the background is enough), <code>onDong</code> is a new function ⇒ the effect cleans up and runs again ⇒ focus is pulled back to the safe button. A keyboard user who just tabbed to the red "Huỷ lịch" button gets yanked back. Measured: <code>[onDong viết thẳng] trước khi cha render lại: "Huỷ lịch" | sau: "Không, giữ lại"</code> (inline: before the parent re-rendered, focus on "Huỷ lịch"; after: "Không, giữ lại"); wrapped in <code>useCallback</code>: <code>… sau: "Huỷ lịch"</code>. This is where <code>useCallback</code> has a genuine reason to exist.</div>
<pre><code class="language-tsx">import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCallback, useState } from 'react';
import { expect, test } from 'vitest';
import { HopXacNhan } from '../components/HopXacNhan';

/** Cha render lại vì một lý do không liên quan (vd TanStack tải lại danh sách ở nền) — mô phỏng bằng prop lan. */
function ChaInline({ lan }: { lan: number }) {
  const [mo, setMo] = useState(false);
  return (
    &lt;div data-lan={lan}&gt;
      &lt;button type="button" onClick={() =&gt; setMo(true)}&gt;Huỷ&lt;/button&gt;
      {mo &amp;&amp; (
        &lt;HopXacNhan tieuDe="Huỷ lịch hẹn này?" nhanDongY="Huỷ lịch" onDong={() =&gt; setMo(false)} onDongY={() =&gt; setMo(false)}&gt;
          &lt;p&gt;…&lt;/p&gt;
        &lt;/HopXacNhan&gt;
      )}
    &lt;/div&gt;
  );
}
function ChaOnDinh({ lan }: { lan: number }) {
  const [mo, setMo] = useState(false);
  const dong = useCallback(() =&gt; setMo(false), []);
  return (
    &lt;div data-lan={lan}&gt;
      &lt;button type="button" onClick={() =&gt; setMo(true)}&gt;Huỷ&lt;/button&gt;
      {mo &amp;&amp; (
        &lt;HopXacNhan tieuDe="Huỷ lịch hẹn này?" nhanDongY="Huỷ lịch" onDong={dong} onDongY={dong}&gt;
          &lt;p&gt;…&lt;/p&gt;
        &lt;/HopXacNhan&gt;
      )}
    &lt;/div&gt;
  );
}

test.each([
  ['onDong viết thẳng', ChaInline],
  ['onDong bọc useCallback', ChaOnDinh],
] as const)('%s: Tab tới nút đỏ, cha render lại ⇒ focus ở đâu?', async (ten, Cha) =&gt; {
  const user = userEvent.setup();
  const { rerender } = render(&lt;Cha lan={1} /&gt;);
  await user.click(screen.getByRole('button', { name: 'Huỷ' }));
  await user.tab(); // từ "Không, giữ lại" sang "Huỷ lịch"
  const truoc = document.activeElement?.textContent;
  rerender(&lt;Cha lan={2} /&gt;);
  console.info(&#96;[&#36;{ten}] trước khi cha render lại: "&#36;{truoc}" | sau: "&#36;{document.activeElement?.textContent}"&#96;);
  expect(truoc).toBe('Huỷ lịch');
});</code></pre>
<p>Another option is the HTML <code>&lt;dialog&gt;</code> element with <code>showModal()</code>: the browser puts it in the "top layer" (no portal needed), makes the rest of the page inert, and handles Escape. Companies use both; libraries such as Radix and React Aria use portals. One practical reason this lesson uses a portal: jsdom 30.1.1, which Vitest uses, <strong>does not have</strong> <code>HTMLDialogElement.showModal</code> (checked: <code>typeof dialog.showModal</code> is <code>undefined</code>), so testing a <code>&lt;dialog&gt;</code> needs extra mocking.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202, a confirmation is usually <code>window.confirm("Are you sure?")</code> or React-Bootstrap's <code>&lt;Modal&gt;</code>; errors inside components are… not handled, and one <code>Cannot read properties of undefined</code> blanks the whole page during the demo → At a company, dialogs come from a shared design-system component (hand-written with a portal like <code>HopXacNhan</code>, or Radix/React Aria/shadcn) meeting accessibility standards: focus, Escape, focus return; and the app always has error boundaries at route level plus error reporting to Sentry. · <em>Why:</em> <code>window.confirm</code> blocks the whole page, cannot be styled and cannot be tested with Testing Library; a blank page leaves users with nothing to do. React-Bootstrap's <code>&lt;Modal&gt;</code> is not wrong — it is a portal inside too — and you will meet it in Bootstrap projects.</p></div>

<h3>No error boundary: one render error blanks the whole app</h3>
${slide('rx-11', 23, 'No error boundary: one render error blanks the whole app')}
<p>A component throws during render — deliberately here: calling <code>.toUpperCase()</code> on <code>null</code>, the most common kind of error when an API omits a field:</p>
<pre><code class="language-tsx">/* ───────── 4. Error boundary bắt gì, không bắt gì ───────── */
export function NemKhiRender({ ten }: { ten: string | null }) {
  return &lt;p&gt;Xin chào {ten!.toUpperCase()}&lt;/p&gt;; // ten = null ⇒ TypeError LÚC RENDER
}</code></pre>
<div class="out">[khong ranh gioi] lỗi: Cannot read properties of null (reading 'toUpperCase') | DOM còn lại: "&lt;div&gt;&lt;/div&gt;"</div>
<p>("DOM còn lại" = DOM left.) With no boundary above, React <strong>unmounts the whole tree</strong> — including the unrelated "Phòng khám An Tâm" heading. In a real Chromium (left screenshot on the slide), clicking "Mở giới thiệu (lỗi)" leaves <code>#root</code> empty: a blank page. This has been deliberate since React 16: react.dev explains that leaving a half-broken UI is more dangerous than showing nothing (a "Pay" button showing the wrong amount is worse than a blank page). Your job is to place <strong>boundaries</strong> that decide "how far the breakage spreads".</p>
<p>An error boundary is a <strong>class component</strong> with <code>static getDerivedStateFromError</code> (update state to draw a fallback) and usually <code>componentDidCatch</code> (log it). React 19.3 still has no hook for this — one of the very few places companies still write classes, or install the <code>react-error-boundary</code> package (which wraps exactly that class). The app's boundary, from Chapter 6, plus <code>resetKeys</code> from this chapter:</p>
<pre><code class="language-tsx">import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onThuLai?: () =&gt; void;
  /** Chương 11: một trong các giá trị này đổi (vd đường dẫn) ⇒ tự xoá lỗi, vẽ lại children. */
  resetKeys?: readonly unknown[];
}
interface State {
  loi: Error | null;
}

/**
 * Error boundary ("ranh giới lỗi"): bắt lỗi ném ra LÚC RENDER ở mọi component con, vẽ màn dự phòng
 * thay vì để cả trang trắng. React 19 vẫn CHƯA có cách viết nó bằng function ⇒ đây là chỗ hiếm hoi
 * còn dùng class component (hoặc cài gói react-error-boundary — nó bọc đúng class này).
 */
export class RanhGioiLoi extends Component&lt;Props, State&gt; {
  state: State = { loi: null };

  static getDerivedStateFromError(loi: Error): State {
    return { loi }; // lần render sau vẽ màn dự phòng
  }

  componentDidUpdate(truoc: Props) {
    // Đang hiện màn lỗi mà người dùng đã đi chỗ khác (resetKeys đổi) ⇒ cho children một cơ hội mới.
    const doi = (truoc.resetKeys ?? []).some((k, i) =&gt; !Object.is(k, this.props.resetKeys?.[i]));
    if (this.state.loi &amp;&amp; doi) this.setState({ loi: null });
  }

  componentDidCatch(loi: Error, info: ErrorInfo) {
    console.error('[RanhGioiLoi]', loi.message, info.componentStack?.split('\\n')[1]?.trim()); // app thật: gửi về Sentry…
  }

  render() {
    if (this.state.loi) {
      return (
        &lt;div className="hop-loi" role="alert"&gt;
          &lt;p&gt;
            &lt;strong&gt;Phần này gặp sự cố.&lt;/strong&gt;
          &lt;/p&gt;
          &lt;p&gt;{this.state.loi.message}&lt;/p&gt;
          &lt;button
            type="button"
            className="nut"
            onClick={() =&gt; {
              this.props.onThuLai?.();
              this.setState({ loi: null });
            }}
          &gt;
            Tải lại phần này
          &lt;/button&gt;
        &lt;/div&gt;
      );
    }
    return this.props.children;
  }
}</code></pre>
<div class="out">[co ranh gioi] tiêu đề: Phòng khám An Tâm | hộp: Phần này gặp sự cố.Cannot read properties of null (reading 'toUpperCase')Tải lại phần này</div>
<p>(The heading survives; the box says "This part ran into a problem" with a "Reload this part" button.)</p>
<div class="callout"><p><strong>JS quick reminder — classes, <code>static</code>, <code>this</code>.</strong> <code>class RanhGioiLoi extends Component&lt;Props, State&gt;</code> creates an old-style component: state lives in <code>this.state</code> and changes with <code>this.setState(…)</code>, props are <code>this.props</code>, and JSX is returned from the <code>render()</code> method. <code>static</code> means the function belongs to the <em>class</em>, not to each object — React calls <code>RanhGioiLoi.getDerivedStateFromError(error)</code> without a <code>this</code>. <code>componentDidUpdate(prev)</code> runs after each update with the previous props — the equivalent of an effect.</p></div>

<h3>What an error boundary catches — and what it doesn't</h3>
${slide('rx-11', 24, 'Error boundaries only catch render-time errors — not onClick')}
<p>Per the <code>Component</code> reference on react.dev, error boundaries do <strong>not</strong> catch: errors in event handlers, in asynchronous code (<code>setTimeout</code>, <code>requestAnimationFrame</code> — except functions passed to <code>startTransition</code>), during server rendering, and in the boundary itself. The most common case, measured:</p>
<pre><code class="language-tsx">export function NemTrongHandler() {
  return (
    &lt;button
      type="button"
      onClick={() =&gt; {
        throw new Error('Lỗi trong onClick');
      }}
    &gt;
      Bấm để lỗi
    &lt;/button&gt;
  );
}
export function NemTrongHandlerCoBat() {
  const [loi, setLoi] = useState&lt;Error | null&gt;(null);
  if (loi) throw loi; // ném LẠI trong lúc render ⇒ ranh giới lỗi bắt được
  return (
    &lt;button
      type="button"
      onClick={() =&gt; {
        try {
          throw new Error('Lỗi trong onClick');
        } catch (e) {
          setLoi(e as Error);
        }
      }}
    &gt;
      Bấm để lỗi (có chuyển)
    &lt;/button&gt;
  );
}</code></pre>
<div class="out">[handler] có hộp lỗi? false | lỗi đi đâu: Lỗi trong onClick
[chuyen loi] hộp: Phần này gặp sự cố.Lỗi trong onClickTải lại phần này</div>
<p>("có hộp lỗi? false" = any error box? no; "lỗi đi đâu" = where did the error go.) An error thrown in <code>onClick</code> goes through no render phase, so React has no chance to hand it to a boundary: the UI stays as if nothing happened and the error goes straight to <code>window</code> (the test catches it with an <code>error</code> listener). If you want that error to show as a fallback, catch it in the handler, store it in state, and <strong>throw it again during render</strong> — the <code>NemTrongHandlerCoBat</code> pattern. Most of the time you do not need to: errors in handlers should be handled on the spot (show a message, offer a retry) — exactly what <code>FormDatLich</code> does with <code>setError('root.server', …)</code> in Chapter 3.</p>
${SD.batLoiEn}
<p>What about API errors? <code>fetch</code> is asynchronous, so they do not reach a boundary on their own either. TanStack Query has a <code>throwOnError</code> option: when the query fails, it <strong>throws during the render</strong> of the component using the query — and the boundary catches it. The app uses it selectively for the doctor page:</p>
<pre><code class="language-ts">export function useChiTietBacSi(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: khoa.chiTietBacSi(id),
    queryFn: ({ signal }) =&gt; api.bacSi(id, signal),
    staleTime: 5 * 60_000,
    initialData: () =&gt; queryClient.getQueryData&lt;BacSi[]&gt;(khoa.bacSi)?.find((b) =&gt; b.id === id),
    initialDataUpdatedAt: () =&gt; queryClient.getQueryState(khoa.bacSi)?.dataUpdatedAt,
    // Chương 11: 404 là chuyện BÌNH THƯỜNG của trang này (link cũ) ⇒ trang tự hiện hộp lỗi.
    // Lỗi khác (500, mất mạng) ⇒ NÉM LÊN error boundary gần nhất, đừng để trang tự xoay xở.
    throwOnError: (loi) =&gt; !(loi instanceof LoiApi &amp;&amp; loi.status === 404),
  });
}</code></pre>
<p>A 404 is normal for this page (someone opened an old link), so the page shows its own "Không mở được trang bác sĩ" (cannot open the doctor page) box. Every other error (500, network) is thrown to the boundary in the layout. That boundary wraps <code>&lt;Outlet /&gt;</code>, so the header and menu always survive:</p>
<pre><code class="language-tsx">/** Layout chung: đầu trang + thanh điều hướng + &lt;Outlet /&gt; (trang con vẽ vào đây) + chân trang. */
export function BoCuc() {
  const { pathname } = useLocation();
  const { reset } = useQueryErrorResetBoundary(); // "Thử lại" của ranh giới lỗi phải xoá cả lỗi đang nhớ trong query
  return (
    &lt;&gt;
      &lt;Header /&gt;
      &lt;nav className="thanh-dieu-huong" aria-label="Điều hướng chính"&gt;
        &lt;NavLink to="/" end&gt;
          Trang chủ
        &lt;/NavLink&gt;
        &lt;NavLink to="/bac-si"&gt;Bác sĩ&lt;/NavLink&gt;
        &lt;NavLink to="/lich-hen"&gt;Lịch hẹn của tôi&lt;/NavLink&gt;
      &lt;/nav&gt;
      &lt;main className="noi-dung"&gt;
        {/* Chương 11: sang đường dẫn khác ⇒ ranh giới tự xoá lỗi (resetKeys). KHÔNG dùng key={pathname}:
            key sẽ gỡ + dựng lại CẢ TRANG mỗi lần đổi đường dẫn, kể cả khi chẳng có lỗi nào. */}
        &lt;RanhGioiLoi resetKeys={[pathname]} onThuLai={reset}&gt;
          &lt;Outlet /&gt;
        &lt;/RanhGioiLoi&gt;
      &lt;/main&gt;
      &lt;Footer /&gt;
      &lt;VungThongBao /&gt;
    &lt;/&gt;
  );
}</code></pre>
<div class="out">[500] hộp lỗi: Phần này gặp sự cố.Máy chủ đang bận, thử lại sauTải lại phần này
[500] còn tiêu đề phòng khám? true | còn thanh điều hướng? true
[500] sau khi bấm "Lịch hẹn của tôi": còn hộp lỗi? false
[404] hộp lỗi: Không mở được trang bác sĩKhông có bác sĩ bs-9Thử lại
[thu lai] số lần gọi API chi tiết: 2</div>
<p>(500: header still there? true, navigation still there? true; after clicking "Lịch hẹn của tôi", error box still there? false. Retry: the detail API was called 2 times.) Two details make this boundary genuinely useful, not just "catch something":</p>
<ul>
<li><strong><code>resetKeys={[pathname]}</code></strong> — if the fallback is showing and the user navigates elsewhere, the boundary clears the error by itself (<code>componentDidUpdate</code> compares each item with <code>Object.is</code>). Without it, "Phần này gặp sự cố" follows the user to every page until F5. Why not simply use <code>key={pathname}</code> (Lesson 11.2)? Because the key unmounts and remounts the <strong>whole page</strong> on every path change, even with no error — moving to another doctor would remount everything on the page, wasteful, and hiding exactly the bugs a well-placed key is meant to solve. <code>resetKeys</code> only steps in while an error is showing.</li>
<li><strong><code>onThuLai={reset}</code> from <code>useQueryErrorResetBoundary</code></strong> — TanStack remembers the query is in an error state. If "Tải lại phần này" only cleared the boundary's error, the component would re-render, the query would still be failed and throw again: the button "does nothing". <code>reset()</code> also clears the query's error so it calls the API again — the test counts 2 calls.</li>
</ul>
<p>Finally, React 19's <code>createRoot</code> takes two options giving you <strong>one place</strong> to receive every render error — where a real app sends them to Sentry or a logging server (React 19.0.0 changelog: <em>"We’ve introduced <code>onUncaughtError</code> and <code>onCaughtError</code> methods to <code>createRoot</code>"</em>):</p>
<pre><code class="language-tsx">/** Chương 11: MỘT chỗ nhận mọi lỗi render — app thật gửi về Sentry/máy chủ log thay cho console. */
function baoLoi(loai: string) {
  return (loi: unknown, info: { componentStack?: string }) =&gt; {
    const dong = info.componentStack?.trim().split('\\n')[0] ?? '';
    console.error(&#96;[&#36;{loai}]&#96;, loi instanceof Error ? loi.message : loi, dong);
  };
}

batApiGia().then(() =&gt; {
  createRoot(document.getElementById('root')!, {
    onCaughtError: baoLoi('da-bat'), // lỗi đã có error boundary hứng
    onUncaughtError: baoLoi('khong-ai-bat'), // lỗi không ai hứng ⇒ React gỡ CẢ app
  }).render(
    &lt;StrictMode&gt;
      &lt;QueryClientProvider client={queryClient}&gt;
        &lt;App /&gt;
      &lt;/QueryClientProvider&gt;
    &lt;/StrictMode&gt;,
  );
});</code></pre>
<p>In a real Chromium, open <code>/bac-si/bs-1?loi=chi-tiet</code> (a knob in the mock API makes the detail API return 500): after TanStack's three retries (about 8.5 seconds) the fallback appears, header and menu still work (screenshot on the slide), and the console has exactly one line from <code>onCaughtError</code>:</p>
<div class="out">ranh-gioi: hiện sau 8495 ms
[error] [da-bat] Máy chủ đang bận, thử lại sau at Cg (http://localhost:5211/assets/index-BLlLlWaS.js:63:29550)</div>
<div class="pitfall co-tieu-de"><strong>Trap — one boundary at the root, or one around every button.</strong> A single boundary around <code>&lt;App /&gt;</code> turns an error in one small card into a whole-app "something went wrong" — nearly a blank page. Wrapping every button and avatar makes the code messy and shows users a scatter of tiny error boxes. react.dev advises placing them where <em>it makes sense to show an error</em>: around each route's content (like <code>BoCuc</code>), around each independent area of a page (the app's home page wraps the doctor list, the booking flow and the appointments separately).</div>

<div class="callout"><p><strong>Common interview question.</strong> "What is an error boundary, which errors does it catch and which not? When do you use a portal, and where do events inside a portal go?"</p>
<p>An error boundary is a class component with <code>getDerivedStateFromError</code> (and usually <code>componentDidCatch</code>) that catches errors thrown during render, lifecycles and effects of its subtree and renders a fallback; uncaught errors make React unmount the whole tree since React 16. It does not catch errors in event handlers, async code like <code>setTimeout</code>, SSR, or its own errors — for handlers I try/catch on the spot, for API errors I use TanStack's <code>throwOnError</code> to throw into render. I place boundaries around each route with a reset on path change, and report via <code>onCaughtError</code>. Portals are for modals, tooltips and popovers to escape <code>overflow</code>/stacking contexts; the DOM lives in <code>body</code> but context and events follow the React tree, so you stop propagation at the dialog root if a parent has an <code>onClick</code>.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> reuse <code>HopXacNhan</code> for a second job, and measure the <code>onDong</code> trap.</p><ol>
<li>On the doctor page, when the user has typed into the form and clicks a "same specialty" link, ask first with <code>HopXacNhan</code>: "Discard what you typed?" (hint: React Router's <code>useBlocker</code>, or intercept the link's <code>onClick</code> and <code>navigate</code> yourself).</li>
<li>Write a test: type a reason, click "BS. Hoàng Đức Huy" ⇒ a dialog appears; click "Không, giữ lại" ⇒ still on Dr An, text intact; do it again and click the confirm button ⇒ on Dr Huy's page, empty form.</li>
<li>Copy the <code>bai4b.test.tsx</code> test (two parent components, one with an inline <code>onDong</code>, one with <code>useCallback</code>) and run it.</li>
</ol><p><strong>Done when:</strong> the step 2 test passes; step 3 prints exactly <code>[onDong viết thẳng] trước khi cha render lại: "Huỷ lịch" | sau: "Không, giữ lại"</code> and <code>[onDong bọc useCallback] … sau: "Huỷ lịch"</code>; <code>npx tsc -b</code> is clean.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">portal</span><span class="v"><code>createPortal(jsx, node)</code>: draw into another DOM node, still a child in the React tree</span></div>
<div class="kv"><span class="k">event bubbling</span><span class="v">events travel up through ancestors; for portals, through the React tree, not the DOM tree</span></div>
<div class="kv"><span class="k">stacking context</span><span class="v">a layer group created by <code>transform</code>, <code>opacity</code>, <code>z-index</code>…; z-index cannot escape it</span></div>
<div class="kv"><span class="k">modal dialog</span><span class="v">a dialog you must answer first: role dialog, aria-modal, focus, Escape, focus return</span></div>
<div class="kv"><span class="k">error boundary</span><span class="v">a class with <code>getDerivedStateFromError</code>; catches render-time errors in its subtree and draws a fallback</span></div>
<div class="kv"><span class="k">fallback UI</span><span class="v">what shows instead of the broken part: say what failed, offer a retry</span></div>
<div class="kv"><span class="k">resetKeys</span><span class="v">values that, when they change, make the boundary clear its error (e.g. the path)</span></div>
<div class="kv"><span class="k">throwOnError (TanStack)</span><span class="v">lets a query throw during render so an error boundary catches it</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>createPortal</code> draws the dialog into <code>&lt;body&gt;</code> to escape <code>overflow</code>/stacking contexts; in the React tree it is still a child — context passes through, events bubble through the React tree (stop them at the dialog root).</li>
<li>A decent dialog: role dialog + aria-modal + aria-labelledby, focus on the safe button, Escape/backdrop to close, focus returned; a stable <code>onDong</code> via <code>useCallback</code>.</li>
<li>An uncaught render error makes React unmount the whole app (measured: <code>#root</code> empty). Put boundaries around each route and each independent area.</li>
<li>Boundaries only catch render/effect errors; not handlers, <code>setTimeout</code>, SSR. API errors: TanStack's <code>throwOnError</code> (except the 404 the page handles itself).</li>
<li><code>resetKeys={[pathname]}</code> so navigating clears the error; <code>reset()</code> from <code>useQueryErrorResetBoundary</code> so "Retry" really refetches; <code>onCaughtError</code> is where errors go to your logging system.</li>
<li>The shared dialog and the resettable boundary are two of the five upgrades you type into the app in Lesson 11.5.</li>
</ul>

<a class="link-card" href="https://react.dev/reference/react-dom/createPortal" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — createPortal</span><span class="lc-sub">Modals, tooltips; events follow the React tree.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/Component" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Component</span><span class="lc-sub">"Catching rendering errors with an Error Boundary".</span></span></a>
<a class="link-card" href="https://react.dev/reference/react-dom/client/createRoot" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — createRoot</span><span class="lc-sub">onCaughtError, onUncaughtError, onRecoverableError.</span></span></a>
<a class="link-card" href="https://github.com/bvaughn/react-error-boundary" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub — react-error-boundary</span><span class="lc-sub">A ready-made error boundary class, with resetKeys.</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Portal và error boundary: hộp thoại thoát khỏi thẻ cha, lỗi không làm trắng trang</h2>
<p class="lead">Hai công cụ cuối của chương đều sinh ra từ React 16 (09/2017) và đều sửa những vấn đề mà component thường không sửa được. <strong>Portal</strong> cho một component vẽ phần tử của nó ở chỗ khác trong DOM — hộp xác nhận huỷ lịch không còn bị <code>overflow: hidden</code> của thẻ cha cắt mất — mà vẫn là con của component đó trong cây React. <strong>Error boundary</strong> (ranh giới lỗi) hứng một lỗi lúc render để chỉ phần đó hỏng, thay vì để React gỡ cả app và bỏ lại một trang trắng. Bài 11.5 ngay sau đó ghép cả chương vào app: năm nâng cấp, mười bốn test phải xanh.</p>

<p>Ví dụ nhỏ nằm ở <code>src/vi-du/bai4.tsx</code>; phần của app nằm ở <code>src/components/HopXacNhan.tsx</code>, <code>src/components/RanhGioiLoi.tsx</code> và <code>src/features/khung/BoCuc.tsx</code>. Output là THẬT (<code>npx vitest run … --reporter=verbose</code>; Chromium thật qua Playwright cho ảnh chụp), ngày 25/09/2026, React 19.3.0, jsdom 30.1.1.</p>

<h3>Portal: vẽ ở chỗ khác trong DOM, vẫn là con trong cây React</h3>
${slide('rx-11', 20, 'Portal: hộp thoát khỏi overflow: hidden của thẻ cha')}
<p>Một thẻ lịch hẹn có <code>overflow: hidden</code> (để bo góc ảnh, để cắt chữ dài — rất phổ biến) và nút "Huỷ lịch" mở một hộp xác nhận. Hộp render ngay trong thẻ thì bị cắt đúng ở mép thẻ: nút "Đóng" chỉ còn nửa trên (ảnh chụp bên trái trên slide). <code>z-index</code> không cứu được — thứ cắt nó là <code>overflow</code> của tổ tiên, và các "ngữ cảnh xếp chồng" (stacking context) mà <code>transform</code>, <code>opacity</code>, <code>position</code> tạo ra. Cách chữa triệt để: đưa hộp ra khỏi thẻ, lên thẳng <code>&lt;body&gt;</code>.</p>
<pre><code class="language-tsx">/* ───────── 1. Hộp mở BÊN TRONG thẻ có overflow: hidden (bị cắt) vs qua portal ───────── */
function Hop({ children }: { children: ReactNode }) {
  return (
    &lt;div role="dialog" aria-label="Xác nhận" className="hop-thu"&gt;
      {children}
    &lt;/div&gt;
  );
}
export function TheCoHop({ quaPortal }: { quaPortal: boolean }) {
  const [mo, setMo] = useState(false);
  const hop = (
    &lt;Hop&gt;
      &lt;p&gt;Huỷ lịch 14:00 · 01/10/2026 với BS. Trần Thu Hà?&lt;/p&gt;
      &lt;button type="button" onClick={() =&gt; setMo(false)}&gt;
        Đóng
      &lt;/button&gt;
    &lt;/Hop&gt;
  );
  return (
    &lt;article className="the-bi-cat"&gt;
      &lt;h3&gt;{quaPortal ? 'Qua portal' : 'Không portal'}&lt;/h3&gt;
      &lt;button type="button" onClick={() =&gt; setMo(true)}&gt;
        Huỷ lịch
      &lt;/button&gt;
      {mo &amp;&amp; (quaPortal ? createPortal(hop, document.body) : hop)}
    &lt;/article&gt;
  );
}</code></pre>
<div class="out">[vi tri] không portal: cha của hộp = the-bi-cat | qua portal: cha của hộp = BODY</div>
<p><code>createPortal(jsx, nutDom)</code> (import từ <code>react-dom</code>) nhận hai thứ: <strong>vẽ cái gì</strong> và <strong>vẽ vào nút DOM nào</strong>. Nó trả về một thứ bạn đặt vào JSX như mọi element khác. Trong DOM, hộp là con trực tiếp của <code>&lt;body&gt;</code>; trong cây React, nó vẫn là con của <code>TheCoHop</code> — đọc được state <code>mo</code>, gọi được <code>setMo</code>, và bị gỡ khi <code>TheCoHop</code> bị gỡ.</p>
${SD.portalVi}

<h3>Sự kiện trong portal nổi bọt theo CÂY REACT, không theo cây DOM</h3>
${slide('rx-11', 21, 'DOM nằm trong body, nhưng sự kiện nổi bọt theo cây React')}
<p>"Vẫn là con trong cây React" có một hệ quả bất ngờ. Một thẻ có <code>onClick</code> để "chọn thẻ"; bên trong nó mở một hộp qua portal:</p>
<pre><code class="language-tsx">/* ───────── 2. Sự kiện trong portal nổi bọt theo CÂY REACT, không theo cây DOM ───────── */
export const nhatKy4: string[] = [];
export function TheChonDuoc({ chanNoiBot }: { chanNoiBot: boolean }) {
  const [mo, setMo] = useState(false);
  return (
    &lt;div onClick={() =&gt; nhatKy4.push('thẻ: onClick (chọn thẻ)')}&gt;
      &lt;button
        type="button"
        onClick={(e) =&gt; {
          e.stopPropagation();
          setMo(true);
        }}
      &gt;
        Mở hộp
      &lt;/button&gt;
      {mo &amp;&amp;
        createPortal(
          &lt;div role="dialog" aria-label="Hộp" onClick={chanNoiBot ? (e) =&gt; e.stopPropagation() : undefined}&gt;
            &lt;button type="button" onClick={() =&gt; nhatKy4.push('hộp: bấm OK')}&gt;
              OK
            &lt;/button&gt;
          &lt;/div&gt;,
          document.body,
        )}
    &lt;/div&gt;
  );
}

/* ───────── 3. Context đi xuyên portal ───────── */
const NgonNgu = createContext&lt;'vi' | 'en'&gt;('vi');
function NoiDungHop() {
  const nn = use(NgonNgu);
  return &lt;p&gt;{nn === 'en' ? 'Cancel this appointment?' : 'Huỷ lịch hẹn này?'}&lt;/p&gt;;
}
export function ContextXuyenPortal() {
  return (
    &lt;NgonNgu value="en"&gt;
      &lt;div&gt;{createPortal(&lt;NoiDungHop /&gt;, document.body)}&lt;/div&gt;
    &lt;/NgonNgu&gt;
  );
}</code></pre>
<div class="out">[noi bot] không chặn: hộp: bấm OK · thẻ: onClick (chọn thẻ)
[noi bot] có chặn: hộp: bấm OK
[context] hộp trong &lt;body&gt; đọc được ngôn ngữ: Cancel this appointment?</div>
<p>Trong DOM, nút OK nằm dưới <code>&lt;body&gt;</code>, chẳng liên quan gì tới thẻ. Vậy mà bấm OK thì <code>onClick</code> của <strong>thẻ</strong> cũng chạy. Tài liệu <code>createPortal</code> trên react.dev nói rõ: sự kiện từ portal lan theo <em>cây React</em>, không theo cây DOM. Tương tự, context đi xuyên portal — hộp trong <code>&lt;body&gt;</code> đọc được ngôn ngữ <code>'en'</code> mà Provider bọc ngoài thẻ cung cấp. Đó chính là điều ta muốn cho context (hộp dịch đúng ngôn ngữ, đúng theme), và thường là điều ta <em>không</em> muốn cho sự kiện.</p>
${SD.noiBotVi}
<div class="pitfall co-tieu-de"><strong>Bẫy — bấm trong hộp mà thẻ bên dưới bị chọn/điều hướng.</strong> Danh sách lịch hẹn mà mỗi dòng bấm vào là mở chi tiết, và nút "Huỷ" trên dòng mở hộp qua portal: bấm "Không, giữ lại" trong hộp ⇒ sự kiện nổi lên tới dòng ⇒ trang nhảy sang chi tiết lịch hẹn. Không có lỗi nào; chỉ là "app cứ tự nhảy trang". Chữa: chặn nổi bọt ở <strong>gốc hộp</strong> (<code>onClick={(e) =&gt; e.stopPropagation()}</code>), như <code>HopXacNhan</code> của app làm; hoặc đặt portal ở chỗ cao hơn trong cây React (ngoài dòng).</div>
<div class="callout"><p><strong>JS nhắc nhanh — nổi bọt sự kiện và <code>e.stopPropagation()</code>.</strong> Khi bạn bấm một nút, sự kiện <code>click</code> không dừng ở nút: nó "nổi bọt" lên từng tổ tiên, và tổ tiên nào có <code>onClick</code> cũng được gọi. <code>e.stopPropagation()</code> bảo "dừng ở đây, đừng nổi tiếp". Nó không huỷ hành vi mặc định (việc đó là <code>e.preventDefault()</code>, ví dụ chặn form tự gửi).</p></div>

<h3>Hộp xác nhận huỷ lịch của app: portal, focus vào nút an toàn, Escape</h3>
${slide('rx-11', 22, 'Hộp xác nhận huỷ lịch: portal, focus vào nút an toàn, Escape')}
<p>Trước chương này, nút "Huỷ" trong "Lịch hẹn của tôi" huỷ ngay khi bấm — một cú bấm nhầm trên điện thoại là mất lịch khám. App thật hỏi lại. Đây là component hộp xác nhận dùng chung, gom mọi thứ của bài này và bài trước:</p>
<pre><code class="language-tsx">import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface HopXacNhanProps {
  tieuDe: string;
  children: ReactNode;
  nhanDongY: string;
  nhanHuy?: string;
  dangXuLy?: boolean;
  onDongY: () =&gt; void;
  onDong: () =&gt; void;
}

/**
 * Hộp xác nhận (modal). Vẽ bằng createPortal vào &lt;body&gt;: không bị overflow/z-index của thẻ cha cắt mất,
 * nhưng vẫn là con của component gọi nó trong CÂY REACT (context, sự kiện nổi bọt theo cây React).
 * Mở ra ⇒ focus vào nút AN TOÀN (không phá gì). Escape hoặc bấm nền ⇒ đóng. Đóng ⇒ focus về nút đã mở hộp.
 */
export function HopXacNhan({ tieuDe, children, nhanDongY, nhanHuy = 'Không, giữ lại', dangXuLy = false, onDongY, onDong }: HopXacNhanProps) {
  const idTieuDe = useId();
  const nutAnToan = useRef&lt;HTMLButtonElement&gt;(null);

  useEffect(() =&gt; {
    const truoc = document.activeElement as HTMLElement | null; // nút "Huỷ" đã mở hộp
    nutAnToan.current?.focus();
    const khiBamPhim = (e: KeyboardEvent) =&gt; {
      if (e.key === 'Escape') onDong();
    };
    document.addEventListener('keydown', khiBamPhim);
    return () =&gt; {
      document.removeEventListener('keydown', khiBamPhim);
      truoc?.focus(); // trả focus về chỗ cũ khi hộp đóng
    };
  }, [onDong]);

  return createPortal(
    &lt;div className="nen-hop" onClick={onDong}&gt;
      &lt;div
        className="hop-xac-nhan"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTieuDe}
        onClick={(e) =&gt; e.stopPropagation()} // bấm TRONG hộp không tính là bấm nền
      &gt;
        &lt;h2 id={idTieuDe}&gt;{tieuDe}&lt;/h2&gt;
        &lt;div&gt;{children}&lt;/div&gt;
        &lt;div className="hang-nut"&gt;
          &lt;button ref={nutAnToan} type="button" className="nut" onClick={onDong} disabled={dangXuLy}&gt;
            {nhanHuy}
          &lt;/button&gt;
          &lt;button type="button" className="nut nut-nguy-hiem" onClick={onDongY} disabled={dangXuLy}&gt;
            {dangXuLy ? 'Đang xử lý…' : nhanDongY}
          &lt;/button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;,
    document.body,
  );
}</code></pre>
<p>Đọc theo từng yêu cầu của một hộp thoại dùng được bằng bàn phím và trình đọc màn hình:</p>
<ul>
<li><strong>Portal vào <code>&lt;body&gt;</code></strong> để không bị cắt, và một lớp nền <code>position: fixed; inset: 0</code> phủ cả màn hình.</li>
<li><strong><code>role="dialog"</code>, <code>aria-modal="true"</code>, <code>aria-labelledby</code></strong> trỏ tới tiêu đề (id sinh bằng <code>useId</code> — duy nhất kể cả khi có nhiều hộp) ⇒ trình đọc màn hình đọc "Huỷ lịch hẹn này?, hộp thoại".</li>
<li><strong>Focus vào nút an toàn</strong> bằng <code>useRef</code> + <code>focus()</code> trong effect (Bài 11.3): người lỡ tay bấm Enter thì chỉ "giữ lại", không huỷ.</li>
<li><strong>Escape và bấm nền thì đóng</strong>; bấm <em>trong</em> hộp thì chặn nổi bọt để không tính là bấm nền.</li>
<li><strong>Đóng thì trả focus về nút đã mở hộp</strong>: effect nhớ <code>document.activeElement</code> lúc mở, cleanup focus lại nó. Nhờ StrictMode ở Bài 11.3 ta biết effect này chạy – dọn – chạy lúc mount; cleanup trả focus về nút Huỷ, lần chạy thứ hai lại nhớ đúng nút Huỷ — nó chịu được.</li>
</ul>
<p><code>LichHenCuaToi</code> giữ "lịch nào đang chờ xác nhận" trong state, và chỉ gọi mutation huỷ (cập nhật lạc quan, Chương 6) khi người dùng đồng ý:</p>
<pre><code class="language-tsx">export function LichHenCuaToi() {
  const { data: lichHen, isPending, error, refetch, isFetching } = useLichHen();
  const { data: bacSi } = useBacSi();
  const huy = useHuyLichHen();
  const [canHuy, setCanHuy] = useState&lt;LichHenCoGio | null&gt;(null); // lịch đang chờ xác nhận huỷ
  const dongHop = useCallback(() =&gt; setCanHuy(null), []); // ổn định: effect của hộp không chạy lại mỗi render
  const tenBacSi = (id: string) =&gt; bacSi?.find((b) =&gt; b.id === id)?.ten ?? id;</code></pre>
<pre><code class="language-tsx">      {canHuy &amp;&amp; (
        &lt;HopXacNhan
          tieuDe="Huỷ lịch hẹn này?"
          nhanDongY="Huỷ lịch"
          onDong={dongHop}
          onDongY={() =&gt; {
            huy.mutate(canHuy);
            setCanHuy(null);
          }}
        &gt;
          &lt;p&gt;
            {tenBacSi(canHuy.bacSiId)} · {hienGio(canHuy.batDau)} · {canHuy.benhNhan.hoTen}
          &lt;/p&gt;
          &lt;p&gt;Khung giờ sẽ được mở lại cho người khác đặt.&lt;/p&gt;
        &lt;/HopXacNhan&gt;
      )}
    &lt;/section&gt;
  );
}</code></pre>
<div class="out">[portal] hộp nằm trong vùng render của component? false | cha trực tiếp của lớp nền: BODY
[portal] focus đang ở: Không, giữ lại
[escape] còn hộp? false | focus về: Huỷ lịch lh-1 | trạng thái: cho-xac-nhan
[dong y] máy chủ: da-huy | còn hộp? false</div>
<p>Và trong Chromium thật (ảnh chụp trên slide): cha của lớp nền là <code>BODY</code>, focus ở "Không, giữ lại", Escape trả focus về "Huỷ lịch lh-1".</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — <code>onDong</code> viết thẳng làm hộp giật focus.</strong> Effect của hộp phụ thuộc <code>[onDong]</code>. Viết <code>onDong={() =&gt; setCanHuy(null)}</code> thì mỗi lần cha render lại (TanStack tải lại danh sách ở nền là đủ), <code>onDong</code> là hàm mới ⇒ effect dọn rồi chạy lại ⇒ focus bị kéo về nút an toàn. Người dùng bàn phím vừa Tab tới nút đỏ "Huỷ lịch" thì bị giật ngược. Đo thật: <code>[onDong viết thẳng] trước khi cha render lại: "Huỷ lịch" | sau: "Không, giữ lại"</code>; bọc <code>useCallback</code>: <code>… sau: "Huỷ lịch"</code>. Đây là chỗ <code>useCallback</code> có lý do thật để tồn tại.</div>
<pre><code class="language-tsx">import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCallback, useState } from 'react';
import { expect, test } from 'vitest';
import { HopXacNhan } from '../components/HopXacNhan';

/** Cha render lại vì một lý do không liên quan (vd TanStack tải lại danh sách ở nền) — mô phỏng bằng prop lan. */
function ChaInline({ lan }: { lan: number }) {
  const [mo, setMo] = useState(false);
  return (
    &lt;div data-lan={lan}&gt;
      &lt;button type="button" onClick={() =&gt; setMo(true)}&gt;Huỷ&lt;/button&gt;
      {mo &amp;&amp; (
        &lt;HopXacNhan tieuDe="Huỷ lịch hẹn này?" nhanDongY="Huỷ lịch" onDong={() =&gt; setMo(false)} onDongY={() =&gt; setMo(false)}&gt;
          &lt;p&gt;…&lt;/p&gt;
        &lt;/HopXacNhan&gt;
      )}
    &lt;/div&gt;
  );
}
function ChaOnDinh({ lan }: { lan: number }) {
  const [mo, setMo] = useState(false);
  const dong = useCallback(() =&gt; setMo(false), []);
  return (
    &lt;div data-lan={lan}&gt;
      &lt;button type="button" onClick={() =&gt; setMo(true)}&gt;Huỷ&lt;/button&gt;
      {mo &amp;&amp; (
        &lt;HopXacNhan tieuDe="Huỷ lịch hẹn này?" nhanDongY="Huỷ lịch" onDong={dong} onDongY={dong}&gt;
          &lt;p&gt;…&lt;/p&gt;
        &lt;/HopXacNhan&gt;
      )}
    &lt;/div&gt;
  );
}

test.each([
  ['onDong viết thẳng', ChaInline],
  ['onDong bọc useCallback', ChaOnDinh],
] as const)('%s: Tab tới nút đỏ, cha render lại ⇒ focus ở đâu?', async (ten, Cha) =&gt; {
  const user = userEvent.setup();
  const { rerender } = render(&lt;Cha lan={1} /&gt;);
  await user.click(screen.getByRole('button', { name: 'Huỷ' }));
  await user.tab(); // từ "Không, giữ lại" sang "Huỷ lịch"
  const truoc = document.activeElement?.textContent;
  rerender(&lt;Cha lan={2} /&gt;);
  console.info(&#96;[&#36;{ten}] trước khi cha render lại: "&#36;{truoc}" | sau: "&#36;{document.activeElement?.textContent}"&#96;);
  expect(truoc).toBe('Huỷ lịch');
});</code></pre>
<p>Một lựa chọn khác là thẻ HTML <code>&lt;dialog&gt;</code> với <code>showModal()</code>: trình duyệt tự đưa nó lên "top layer" (không cần portal), tự bẫy focus, tự xử lý Escape. Công ty dùng cả hai; các thư viện như Radix, React Aria dùng portal. Một lý do thực dụng để bài này dùng portal: jsdom 30.1.1 mà Vitest dùng <strong>chưa có</strong> <code>HTMLDialogElement.showModal</code> (kiểm: <code>typeof dialog.showModal</code> là <code>undefined</code>), nên test hộp <code>&lt;dialog&gt;</code> phải giả lập thêm.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202, hộp xác nhận thường là <code>window.confirm("Bạn chắc chứ?")</code> hoặc <code>&lt;Modal&gt;</code> của React-Bootstrap; còn lỗi trong component thì… không xử lý, và một lỗi <code>Cannot read properties of undefined</code> là cả trang trắng khi demo → Ở công ty, hộp thoại dùng một component chung trong design system (tự viết bằng portal như <code>HopXacNhan</code>, hoặc Radix/React Aria/shadcn) đạt chuẩn truy cập: focus, Escape, trả focus; và app luôn có error boundary ở gốc route cộng báo lỗi về Sentry. · <em>Vì sao:</em> <code>window.confirm</code> chặn cả trang, không tuỳ biến được giao diện và không test được bằng Testing Library; trang trắng thì người dùng không biết làm gì tiếp. <code>&lt;Modal&gt;</code> của React-Bootstrap không sai — bên trong nó cũng là portal — bạn sẽ gặp nó ở dự án dùng Bootstrap.</p></div>

<h3>Không có ranh giới lỗi: một lỗi lúc render xoá trắng cả app</h3>
${slide('rx-11', 23, 'Không có ranh giới lỗi: một lỗi lúc render xoá trắng cả app')}
<p>Một component ném lỗi trong lúc render — ở đây cố ý: đọc <code>.toUpperCase()</code> của <code>null</code>, đúng loại lỗi hay gặp nhất khi API trả thiếu một trường:</p>
<pre><code class="language-tsx">/* ───────── 4. Error boundary bắt gì, không bắt gì ───────── */
export function NemKhiRender({ ten }: { ten: string | null }) {
  return &lt;p&gt;Xin chào {ten!.toUpperCase()}&lt;/p&gt;; // ten = null ⇒ TypeError LÚC RENDER
}</code></pre>
<div class="out">[khong ranh gioi] lỗi: Cannot read properties of null (reading 'toUpperCase') | DOM còn lại: "&lt;div&gt;&lt;/div&gt;"</div>
<p>Không có ranh giới lỗi nào ở trên, React <strong>gỡ cả cây</strong> — kể cả tiêu đề "Phòng khám An Tâm" chẳng liên quan gì. Trong Chromium thật (ảnh bên trái trên slide), bấm "Mở giới thiệu (lỗi)" là <code>#root</code> rỗng, trang trắng. Đây là hành vi có chủ đích từ React 16: tài liệu react.dev giải thích rằng để lại một giao diện hỏng dở còn nguy hiểm hơn không hiện gì (một nút "Thanh toán" hiện sai số tiền còn tệ hơn trang trắng). Việc của bạn là đặt <strong>ranh giới</strong> để quyết định "hỏng tới đâu thì dừng".</p>
<p>Ranh giới lỗi là một <strong>class component</strong> có <code>static getDerivedStateFromError</code> (đổi state để vẽ màn dự phòng) và thường có <code>componentDidCatch</code> (ghi log). React 19.3 vẫn chưa có hook cho việc này — đây là một trong rất ít chỗ công ty còn viết class, hoặc cài gói <code>react-error-boundary</code> (bọc đúng class đó). Ranh giới của app, có từ Chương 6, cộng thêm <code>resetKeys</code> ở chương này:</p>
<pre><code class="language-tsx">import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onThuLai?: () =&gt; void;
  /** Chương 11: một trong các giá trị này đổi (vd đường dẫn) ⇒ tự xoá lỗi, vẽ lại children. */
  resetKeys?: readonly unknown[];
}
interface State {
  loi: Error | null;
}

/**
 * Error boundary ("ranh giới lỗi"): bắt lỗi ném ra LÚC RENDER ở mọi component con, vẽ màn dự phòng
 * thay vì để cả trang trắng. React 19 vẫn CHƯA có cách viết nó bằng function ⇒ đây là chỗ hiếm hoi
 * còn dùng class component (hoặc cài gói react-error-boundary — nó bọc đúng class này).
 */
export class RanhGioiLoi extends Component&lt;Props, State&gt; {
  state: State = { loi: null };

  static getDerivedStateFromError(loi: Error): State {
    return { loi }; // lần render sau vẽ màn dự phòng
  }

  componentDidUpdate(truoc: Props) {
    // Đang hiện màn lỗi mà người dùng đã đi chỗ khác (resetKeys đổi) ⇒ cho children một cơ hội mới.
    const doi = (truoc.resetKeys ?? []).some((k, i) =&gt; !Object.is(k, this.props.resetKeys?.[i]));
    if (this.state.loi &amp;&amp; doi) this.setState({ loi: null });
  }

  componentDidCatch(loi: Error, info: ErrorInfo) {
    console.error('[RanhGioiLoi]', loi.message, info.componentStack?.split('\\n')[1]?.trim()); // app thật: gửi về Sentry…
  }

  render() {
    if (this.state.loi) {
      return (
        &lt;div className="hop-loi" role="alert"&gt;
          &lt;p&gt;
            &lt;strong&gt;Phần này gặp sự cố.&lt;/strong&gt;
          &lt;/p&gt;
          &lt;p&gt;{this.state.loi.message}&lt;/p&gt;
          &lt;button
            type="button"
            className="nut"
            onClick={() =&gt; {
              this.props.onThuLai?.();
              this.setState({ loi: null });
            }}
          &gt;
            Tải lại phần này
          &lt;/button&gt;
        &lt;/div&gt;
      );
    }
    return this.props.children;
  }
}</code></pre>
<div class="out">[co ranh gioi] tiêu đề: Phòng khám An Tâm | hộp: Phần này gặp sự cố.Cannot read properties of null (reading 'toUpperCase')Tải lại phần này</div>
<div class="callout"><p><strong>JS nhắc nhanh — class, <code>static</code>, <code>this</code>.</strong> <code>class RanhGioiLoi extends Component&lt;Props, State&gt;</code> tạo một component kiểu cũ: state nằm ở <code>this.state</code>, đổi bằng <code>this.setState(…)</code>, props ở <code>this.props</code>, và JSX trả về từ phương thức <code>render()</code>. <code>static</code> nghĩa là hàm gắn với <em>class</em>, không gắn với từng đối tượng — React gọi <code>RanhGioiLoi.getDerivedStateFromError(loi)</code> mà không cần <code>this</code>. <code>componentDidUpdate(truoc)</code> chạy sau mỗi lần cập nhật, nhận props lần trước — tương đương một effect.</p></div>

<h3>Ranh giới lỗi bắt gì — và không bắt gì</h3>
${slide('rx-11', 24, 'Ranh giới lỗi chỉ bắt lỗi lúc render — không bắt onClick')}
<p>Theo tài liệu tra cứu <code>Component</code> trên react.dev, ranh giới lỗi <strong>không</strong> bắt: lỗi trong handler sự kiện, trong code bất đồng bộ (<code>setTimeout</code>, <code>requestAnimationFrame</code> — trừ hàm truyền cho <code>startTransition</code>), lỗi khi render trên máy chủ, và lỗi của chính ranh giới đó. Đo trường hợp phổ biến nhất:</p>
<pre><code class="language-tsx">export function NemTrongHandler() {
  return (
    &lt;button
      type="button"
      onClick={() =&gt; {
        throw new Error('Lỗi trong onClick');
      }}
    &gt;
      Bấm để lỗi
    &lt;/button&gt;
  );
}
export function NemTrongHandlerCoBat() {
  const [loi, setLoi] = useState&lt;Error | null&gt;(null);
  if (loi) throw loi; // ném LẠI trong lúc render ⇒ ranh giới lỗi bắt được
  return (
    &lt;button
      type="button"
      onClick={() =&gt; {
        try {
          throw new Error('Lỗi trong onClick');
        } catch (e) {
          setLoi(e as Error);
        }
      }}
    &gt;
      Bấm để lỗi (có chuyển)
    &lt;/button&gt;
  );
}</code></pre>
<div class="out">[handler] có hộp lỗi? false | lỗi đi đâu: Lỗi trong onClick
[chuyen loi] hộp: Phần này gặp sự cố.Lỗi trong onClickTải lại phần này</div>
<p>Lỗi ném trong <code>onClick</code> không qua pha render nào, nên React không có cơ hội đưa nó cho ranh giới: giao diện đứng yên như chưa có gì, lỗi đi thẳng ra <code>window</code> (test bắt nó bằng listener <code>error</code>). Nếu muốn lỗi đó hiện thành màn dự phòng, bắt nó trong handler, cất vào state, rồi <strong>ném lại trong lúc render</strong> — mẫu <code>NemTrongHandlerCoBat</code>. Phần lớn thời gian thì không cần: lỗi trong handler nên được xử lý tại chỗ (hiện thông báo, cho thử lại) — chính là việc <code>FormDatLich</code> làm với <code>setError('root.server', …)</code> ở Chương 3.</p>
${SD.batLoiVi}
<p>Lỗi từ API thì sao? <code>fetch</code> chạy bất đồng bộ nên cũng không tự tới ranh giới. TanStack Query có tuỳ chọn <code>throwOnError</code>: khi query lỗi, nó <strong>ném lỗi trong lúc render</strong> của component dùng query — và ranh giới bắt được. App dùng nó có chọn lọc cho trang chi tiết bác sĩ:</p>
<pre><code class="language-ts">export function useChiTietBacSi(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: khoa.chiTietBacSi(id),
    queryFn: ({ signal }) =&gt; api.bacSi(id, signal),
    staleTime: 5 * 60_000,
    initialData: () =&gt; queryClient.getQueryData&lt;BacSi[]&gt;(khoa.bacSi)?.find((b) =&gt; b.id === id),
    initialDataUpdatedAt: () =&gt; queryClient.getQueryState(khoa.bacSi)?.dataUpdatedAt,
    // Chương 11: 404 là chuyện BÌNH THƯỜNG của trang này (link cũ) ⇒ trang tự hiện hộp lỗi.
    // Lỗi khác (500, mất mạng) ⇒ NÉM LÊN error boundary gần nhất, đừng để trang tự xoay xở.
    throwOnError: (loi) =&gt; !(loi instanceof LoiApi &amp;&amp; loi.status === 404),
  });
}</code></pre>
<p>404 là chuyện bình thường của trang này (ai đó mở link cũ) nên trang tự hiện hộp "Không mở được trang bác sĩ". Mọi lỗi khác (500, mất mạng) ném lên ranh giới ở layout. Ranh giới đó đặt quanh <code>&lt;Outlet /&gt;</code>, nên đầu trang và menu luôn sống:</p>
<pre><code class="language-tsx">/** Layout chung: đầu trang + thanh điều hướng + &lt;Outlet /&gt; (trang con vẽ vào đây) + chân trang. */
export function BoCuc() {
  const { pathname } = useLocation();
  const { reset } = useQueryErrorResetBoundary(); // "Thử lại" của ranh giới lỗi phải xoá cả lỗi đang nhớ trong query
  return (
    &lt;&gt;
      &lt;Header /&gt;
      &lt;nav className="thanh-dieu-huong" aria-label="Điều hướng chính"&gt;
        &lt;NavLink to="/" end&gt;
          Trang chủ
        &lt;/NavLink&gt;
        &lt;NavLink to="/bac-si"&gt;Bác sĩ&lt;/NavLink&gt;
        &lt;NavLink to="/lich-hen"&gt;Lịch hẹn của tôi&lt;/NavLink&gt;
      &lt;/nav&gt;
      &lt;main className="noi-dung"&gt;
        {/* Chương 11: sang đường dẫn khác ⇒ ranh giới tự xoá lỗi (resetKeys). KHÔNG dùng key={pathname}:
            key sẽ gỡ + dựng lại CẢ TRANG mỗi lần đổi đường dẫn, kể cả khi chẳng có lỗi nào. */}
        &lt;RanhGioiLoi resetKeys={[pathname]} onThuLai={reset}&gt;
          &lt;Outlet /&gt;
        &lt;/RanhGioiLoi&gt;
      &lt;/main&gt;
      &lt;Footer /&gt;
      &lt;VungThongBao /&gt;
    &lt;/&gt;
  );
}</code></pre>
<div class="out">[500] hộp lỗi: Phần này gặp sự cố.Máy chủ đang bận, thử lại sauTải lại phần này
[500] còn tiêu đề phòng khám? true | còn thanh điều hướng? true
[500] sau khi bấm "Lịch hẹn của tôi": còn hộp lỗi? false
[404] hộp lỗi: Không mở được trang bác sĩKhông có bác sĩ bs-9Thử lại
[thu lai] số lần gọi API chi tiết: 2</div>
<p>Hai chi tiết làm ranh giới này dùng được thật, không chỉ "bắt cho có":</p>
<ul>
<li><strong><code>resetKeys={[pathname]}</code></strong> — đang hiện màn lỗi mà người dùng bấm sang trang khác thì ranh giới tự xoá lỗi (<code>componentDidUpdate</code> so từng phần tử bằng <code>Object.is</code>). Không có nó, màn "Phần này gặp sự cố" bám theo mọi trang cho tới khi F5. Vì sao không dùng luôn <code>key={pathname}</code> cho gọn (Bài 11.2)? Vì key gỡ và dựng lại <strong>cả trang</strong> mỗi lần đổi đường dẫn, kể cả khi không có lỗi nào — sang bác sĩ khác là mọi thứ trong trang mount lại, lãng phí và che luôn những bug mà key đặt đúng chỗ phải giải quyết. <code>resetKeys</code> chỉ can thiệp khi đang có lỗi.</li>
<li><strong><code>onThuLai={reset}</code> từ <code>useQueryErrorResetBoundary</code></strong> — TanStack nhớ query đang ở trạng thái lỗi. Nút "Tải lại phần này" chỉ xoá lỗi của ranh giới thì component render lại, query vẫn lỗi, ném tiếp: nút "không làm gì". <code>reset()</code> xoá cả lỗi trong query để nó gọi API lại — test đếm được 2 lần gọi.</li>
</ul>
<p>Cuối cùng, <code>createRoot</code> của React 19 nhận hai tuỳ chọn để có <strong>một chỗ</strong> nhận mọi lỗi render — nơi app thật gửi về Sentry hay máy chủ log (changelog React 19.0.0: <em>"We’ve introduced <code>onUncaughtError</code> and <code>onCaughtError</code> methods to <code>createRoot</code>"</em>):</p>
<pre><code class="language-tsx">/** Chương 11: MỘT chỗ nhận mọi lỗi render — app thật gửi về Sentry/máy chủ log thay cho console. */
function baoLoi(loai: string) {
  return (loi: unknown, info: { componentStack?: string }) =&gt; {
    const dong = info.componentStack?.trim().split('\\n')[0] ?? '';
    console.error(&#96;[&#36;{loai}]&#96;, loi instanceof Error ? loi.message : loi, dong);
  };
}

batApiGia().then(() =&gt; {
  createRoot(document.getElementById('root')!, {
    onCaughtError: baoLoi('da-bat'), // lỗi đã có error boundary hứng
    onUncaughtError: baoLoi('khong-ai-bat'), // lỗi không ai hứng ⇒ React gỡ CẢ app
  }).render(
    &lt;StrictMode&gt;
      &lt;QueryClientProvider client={queryClient}&gt;
        &lt;App /&gt;
      &lt;/QueryClientProvider&gt;
    &lt;/StrictMode&gt;,
  );
});</code></pre>
<p>Trên Chromium thật, mở <code>/bac-si/bs-1?loi=chi-tiet</code> (núm vặn của API giả làm API chi tiết trả 500): sau ba lần thử lại của TanStack (khoảng 8,5 giây) màn dự phòng hiện ra, đầu trang và menu vẫn chạy (ảnh trên slide), và console có đúng một dòng từ <code>onCaughtError</code>:</p>
<div class="out">ranh-gioi: hiện sau 8495 ms
[error] [da-bat] Máy chủ đang bận, thử lại sau at Cg (http://localhost:5211/assets/index-BLlLlWaS.js:63:29550)</div>
<div class="pitfall co-tieu-de"><strong>Bẫy — một ranh giới duy nhất ở gốc, hoặc bọc từng nút một.</strong> Chỉ một ranh giới quanh cả <code>&lt;App /&gt;</code> thì lỗi ở một thẻ nhỏ cũng biến cả app thành màn "có sự cố" — gần như trang trắng. Bọc từng nút, từng ảnh đại diện thì code rối mà người dùng thấy một đống hộp lỗi vụn. react.dev khuyên đặt theo chỗ <em>hợp lý để báo lỗi</em>: quanh nội dung từng route (như <code>BoCuc</code>), quanh từng khu độc lập trên trang (trang chủ của app bọc riêng danh sách bác sĩ, luồng đặt lịch, lịch hẹn).</div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Error boundary là gì, bắt được lỗi nào, không bắt được lỗi nào? Portal dùng khi nào, sự kiện trong portal đi đâu?"</p>
<p>Error boundary là component class có <code>getDerivedStateFromError</code> (và thường <code>componentDidCatch</code>), bắt lỗi ném ra trong lúc render, trong lifecycle/effect của cây con, rồi vẽ giao diện dự phòng; lỗi không ai bắt thì từ React 16 React gỡ cả cây. Nó không bắt lỗi trong handler sự kiện, code async như <code>setTimeout</code>, SSR, và lỗi của chính nó — handler thì em try/catch tại chỗ, lỗi API thì dùng <code>throwOnError</code> của TanStack để ném vào render. Em đặt ranh giới quanh từng route với reset theo đường dẫn, và báo lỗi qua <code>onCaughtError</code>. Portal dùng cho modal, tooltip, menu nổi để thoát <code>overflow</code>/stacking context; DOM nằm ở <code>body</code> nhưng context và sự kiện vẫn đi theo cây React, nên phải chặn nổi bọt ở gốc hộp nếu cha có <code>onClick</code>.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> dùng lại <code>HopXacNhan</code> cho việc thứ hai, và đo cái bẫy <code>onDong</code>.</p><ol>
<li>Trên trang chi tiết bác sĩ, khi người dùng đã gõ vào form mà bấm một link "Cùng chuyên khoa", hỏi lại bằng <code>HopXacNhan</code>: "Bỏ thông tin đang nhập?" (gợi ý: <code>useBlocker</code> của React Router, hoặc chặn ở <code>onClick</code> của link và tự <code>navigate</code>).</li>
<li>Viết test: gõ lý do khám, bấm "BS. Hoàng Đức Huy" ⇒ có hộp; bấm "Không, giữ lại" ⇒ vẫn ở BS. An, chữ còn nguyên; làm lại và bấm nút đồng ý ⇒ sang BS. Huy, form trắng.</li>
<li>Chép test <code>bai4b.test.tsx</code> (hai component cha, một viết thẳng <code>onDong</code>, một bọc <code>useCallback</code>) và chạy.</li>
</ol><p><strong>Đạt khi:</strong> test bước 2 xanh; bước 3 in đúng <code>[onDong viết thẳng] trước khi cha render lại: "Huỷ lịch" | sau: "Không, giữ lại"</code> và <code>[onDong bọc useCallback] … sau: "Huỷ lịch"</code>; <code>npx tsc -b</code> sạch.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">portal (cổng)</span><span class="v"><code>createPortal(jsx, nut)</code>: vẽ vào nút DOM khác, vẫn là con trong cây React</span></div>
<div class="kv"><span class="k">event bubbling (nổi bọt sự kiện)</span><span class="v">sự kiện đi lên tổ tiên; với portal, theo cây React chứ không theo cây DOM</span></div>
<div class="kv"><span class="k">stacking context (ngữ cảnh xếp chồng)</span><span class="v">nhóm lớp do <code>transform</code>, <code>opacity</code>, <code>z-index</code>… tạo ra; z-index không thoát ra ngoài được</span></div>
<div class="kv"><span class="k">modal dialog (hộp thoại chặn)</span><span class="v">hộp phải trả lời trước khi làm tiếp: role dialog, aria-modal, focus, Escape, trả focus</span></div>
<div class="kv"><span class="k">error boundary (ranh giới lỗi)</span><span class="v">class có <code>getDerivedStateFromError</code>; bắt lỗi lúc render của cây con, vẽ màn dự phòng</span></div>
<div class="kv"><span class="k">fallback UI (giao diện dự phòng)</span><span class="v">thứ hiện thay phần bị lỗi: nói chuyện gì hỏng, cho nút thử lại</span></div>
<div class="kv"><span class="k">resetKeys</span><span class="v">giá trị mà khi đổi thì ranh giới tự xoá lỗi (vd đường dẫn)</span></div>
<div class="kv"><span class="k">throwOnError (TanStack)</span><span class="v">cho query ném lỗi trong lúc render để ranh giới lỗi hứng</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>createPortal</code> vẽ hộp vào <code>&lt;body&gt;</code> để thoát <code>overflow</code>/stacking context; trong cây React nó vẫn là con — context đi xuyên, sự kiện nổi bọt theo cây React (chặn ở gốc hộp).</li>
<li>Hộp xác nhận tử tế: role dialog + aria-modal + aria-labelledby, focus vào nút an toàn, Escape/bấm nền để đóng, trả focus; <code>onDong</code> ổn định bằng <code>useCallback</code>.</li>
<li>Lỗi lúc render không ai bắt ⇒ React gỡ cả app (đo: <code>#root</code> rỗng). Đặt ranh giới quanh từng route và từng khu độc lập.</li>
<li>Ranh giới chỉ bắt lỗi lúc render/effect; không bắt handler, <code>setTimeout</code>, SSR. Lỗi API: <code>throwOnError</code> của TanStack (trừ 404 do trang tự xử lý).</li>
<li><code>resetKeys={[pathname]}</code> để đổi trang là hết lỗi; <code>reset()</code> của <code>useQueryErrorResetBoundary</code> để "Thử lại" gọi API lại thật; <code>onCaughtError</code> là chỗ gửi lỗi về hệ thống log.</li>
<li>Hộp thoại dùng chung và ranh giới lỗi có reset là hai trong năm nâng cấp bạn tự gõ vào app ở Bài 11.5.</li>
</ul>

<a class="link-card" href="https://react.dev/reference/react-dom/createPortal" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — createPortal</span><span class="lc-sub">Modal, tooltip; sự kiện theo cây React.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/Component" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Component</span><span class="lc-sub">Mục "Catching rendering errors with an Error Boundary".</span></span></a>
<a class="link-card" href="https://react.dev/reference/react-dom/client/createRoot" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — createRoot</span><span class="lc-sub">onCaughtError, onUncaughtError, onRecoverableError.</span></span></a>
<a class="link-card" href="https://github.com/bvaughn/react-error-boundary" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub — react-error-boundary</span><span class="lc-sub">Gói bọc sẵn class ranh giới lỗi, có resetKeys.</span></span></a>
</div>
`,
  },
  {
    title: '11.5 — Build it: five under-the-hood upgrades for the booking app|||11.5 — Tự dựng: năm nâng cấp “bên trong” cho app đặt lịch',
    slug: 'rx-11-5-du-an',
    type: 'LESSON',
    isFreePreview: true,
    description: 'Ghép cả chương vào app: key reset khu đặt lịch khi đổi bác sĩ, focus tiêu đề, hộp xác nhận huỷ lịch bằng portal, ranh giới lỗi có reset, chú thích đo bằng useLayoutEffect — 7 test đỏ thành 14 test xanh, bốn cảnh kiểm bằng mắt và sáu sai lầm hay gặp.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5</span>
<h2>Build it: five "under the hood" upgrades for the booking app</h2>
<p class="lead">Each of the previous four lessons left you a tool. This one puts all five into the clinic app, in the order someone at work would: write tests describing what must be true, run them red, fix, run them green, then open a real browser and look with your own eyes. No new concepts — just assembly, and a few places where assembly goes wrong that the chapter has measured.</p>
<p>The five tasks share one root: they are all places where the app "still seems to work" but is wrong for real users. The form carries the previous doctor's data to the next one (key — Lesson 11.2). Keyboard users do not know they moved to a new page (ref + focus — Lesson 11.3). One mis-tap loses an appointment (a portal confirmation dialog — Lesson 11.4). One 500 error turns the whole page into a dead-end error screen (a resettable error boundary — Lesson 11.4). And a tooltip flickers in the corner of the screen on slow devices (<code>useLayoutEffect</code> — Lesson 11.3). The tests and code below are the versions that ran in the chapter's test project (React 19.3.0, React Router 8.4.0, TanStack Query 5.103.2, Vitest 5.0.1) on 25 September 2026.</p>

<h3>🛠 Keep building the project</h3>
${slide('rx-11', 27, 'Keep building the project: five tasks, fourteen tests must pass')}
<p><strong>Starting point: the project after Chapter 10.</strong> This chapter uses these parts of it (file names as in the project contract; if yours differ, map them by role): the router in <code>src/router.tsx</code> with the layout <code>src/features/khung/BoCuc.tsx</code> (already with <code>&lt;RanhGioiLoi&gt;</code> around <code>&lt;Outlet /&gt;</code>), the page <code>src/features/bac-si/TrangChiTietBacSi.tsx</code> (introduction, slot grid, <code>FormDatLich</code>, "same specialty" column), the hook <code>src/hooks/useChiTietBacSi.ts</code>, <code>src/components/LichHenCuaToi.tsx</code> with <code>useHuyLichHen</code> (Chapter 6), <code>src/components/RanhGioiLoi.tsx</code>, the MSW mock API in <code>src/mocks/</code>, and in <code>src/test/render.tsx</code> a <code>renderTrang(path)</code> helper that renders the whole app with <code>createMemoryRouter</code>. You do five things:</p>
<ol>
<li><strong>Reset when the doctor changes.</strong> On the doctor page, moving to another doctor (via the "same specialty" column) must clear the chosen slot, the typed text and the "sent" message. Use <code>key</code>, not an effect.</li>
<li><strong>Focus the heading.</strong> After moving to another doctor, focus is on the doctor-name <code>&lt;h2&gt;</code> (<code>useRef</code> + <code>focus()</code> in an effect, <code>tabIndex={-1}</code>, no focus ring).</li>
<li><strong>Cancel-confirmation dialog.</strong> Write <code>src/components/HopXacNhan.tsx</code> with <code>createPortal</code> into <code>document.body</code> (role dialog, aria-modal, aria-labelledby; focus on "Không, giữ lại"; Escape and backdrop click close; closing returns focus). The "Huỷ" button in <code>LichHenCuaToi</code> opens it; only "Huỷ lịch" inside the dialog calls the mutation.</li>
<li><strong>A decent error boundary.</strong> Add <code>resetKeys</code> to <code>RanhGioiLoi</code>; in <code>BoCuc</code> pass <code>resetKeys={[pathname]}</code> and <code>onThuLai={reset}</code> from <code>useQueryErrorResetBoundary</code>; give <code>useChiTietBacSi</code> <code>throwOnError</code> for every error except 404; add <code>onCaughtError</code>/<code>onUncaughtError</code> to <code>createRoot</code>.</li>
<li><strong>Appointment-time tooltip.</strong> Write <code>src/components/ChuThich.tsx</code>: an ⓘ button; hover or Tab shows the tooltip (portal, <code>role="tooltip"</code>, the button <code>aria-describedby</code> it), above the button, flipping below when there is no room; measured with <code>useLayoutEffect</code>. Put it next to "Giờ khám".</li>
</ol>
${SD.nhiemVuEn}
<p><strong>Done when:</strong></p>
<ul>
<li>Copy the four test files below into the project. At the starting point, <code>npx vitest run src/features --reporter=verbose</code> must be red (measured on the lesson machine: <code>Tests  7 failed | 1 passed (8)</code> — the other two files cannot run yet because the components do not exist). After the five tasks: <code>npx vitest run src/features src/components/LichHenCuaToi.test.tsx src/components/ChuThich.test.tsx</code> gives <code>Test Files  4 passed (4)</code> · <code>Tests  14 passed (14)</code>.</li>
<li><code>npx tsc -b</code> prints nothing; <code>npx vitest run</code> for the whole project is green; <code>npx vite build</code> ends with <code>✓ built in …</code>.</li>
<li>Expected screenshots (see “Check with your own eyes” just below): Dr Huy's page after booking with Dr An shows an empty form; the "Huỷ lịch hẹn này?" dialog sits centred on a dark backdrop with focus on "Không, giữ lại"; <code>/bac-si/bs-1?loi=chi-tiet</code> shows "Phần này gặp sự cố." under a still-working menu; hovering ⓘ shows the tooltip just above it.</li>
</ul>
<details><summary>Acceptance tests (copy into the project)</summary>
<p><code>src/features/bac-si/TrangChiTietBacSi.test.tsx</code></p>
<pre><code class="language-tsx">import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { db } from '../../mocks/co-so-du-lieu';
import { renderTrang } from '../../test/render';

async function dienForm(user: ReturnType&lt;typeof userEvent.setup&gt;) {
  await user.type(screen.getByLabelText('Họ và tên'), 'Nguyễn Thị Ánh');
  await user.type(screen.getByLabelText('Số điện thoại'), '0901234567');
  await user.type(screen.getByLabelText('Ngày sinh'), '1990-05-20');
  await user.type(screen.getByLabelText('Lý do khám'), 'Đau dạ dày');
}

test('đổi sang bác sĩ cùng chuyên khoa ⇒ giờ đã chọn và chữ đã gõ về trắng', async () =&gt; {
  const user = userEvent.setup();
  renderTrang('/bac-si/bs-1');
  await user.click(await screen.findByRole('button', { name: '08:00 · 01/10/2026' }));
  await user.type(screen.getByLabelText('Lý do khám'), 'Đau dạ dày');
  await user.click(screen.getByRole('link', { name: 'BS. Hoàng Đức Huy' }));
  await screen.findByRole('heading', { name: 'BS. Hoàng Đức Huy' });
  await screen.findByRole('button', { name: '08:00 · 01/10/2026' });
  const dangChon = screen.queryAllByRole('button', { pressed: true }).map((b) =&gt; b.textContent);
  console.info('[doi bac si] lý do:', JSON.stringify((screen.getByLabelText('Lý do khám') as HTMLTextAreaElement).value), '| nút đang chọn:', dangChon.join(', '));
  expect(screen.getByLabelText('Lý do khám')).toHaveValue('');
});

test('đặt xong với BS. An rồi sang BS. Huy ⇒ trang của Huy KHÔNG báo "đã gửi"', async () =&gt; {
  const user = userEvent.setup();
  renderTrang('/bac-si/bs-1');
  await user.click(await screen.findByRole('button', { name: '08:00 · 01/10/2026' }));
  await dienForm(user);
  await user.click(screen.getByRole('button', { name: 'Đặt lịch' }));
  expect(await screen.findByText(/Đã gửi yêu cầu đặt lịch với BS. Nguyễn Minh An/)).toBeInTheDocument();
  await user.click(screen.getByRole('link', { name: 'BS. Hoàng Đức Huy' }));
  await screen.findByRole('heading', { name: 'BS. Hoàng Đức Huy' });
  const baoXong = screen.queryByText(/Đã gửi yêu cầu đặt lịch/)?.textContent ?? '(không có)';
  console.info('[sau khi dat] trang Huy báo:', baoXong, '| số lịch hẹn trên máy chủ:', db.lichHen().length);
  expect(screen.queryByText(/Đã gửi yêu cầu đặt lịch/)).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Đặt lịch' })).toBeInTheDocument();
});

test('chọn giờ của An, sang Huy rồi bấm Đặt lịch ⇒ không được gửi giờ của bác sĩ cũ', async () =&gt; {
  const user = userEvent.setup();
  renderTrang('/bac-si/bs-1');
  await user.click(await screen.findByRole('button', { name: '08:00 · 01/10/2026' }));
  await user.click(screen.getByRole('link', { name: 'BS. Hoàng Đức Huy' }));
  await screen.findByRole('heading', { name: 'BS. Hoàng Đức Huy' });
  await dienForm(user);
  await user.click(screen.getByRole('button', { name: 'Đặt lịch' }));
  const loi = await screen.findByRole('alert');
  console.info('[gio cu] máy chủ/ứng dụng trả lời:', loi.textContent);
  expect(loi).toHaveTextContent('Hãy chọn một khung giờ trước');
});

test('sang bác sĩ khác ⇒ focus nằm trên tiêu đề của trang mới (useRef + focus)', async () =&gt; {
  const user = userEvent.setup();
  renderTrang('/bac-si/bs-1');
  await user.click(await screen.findByRole('link', { name: 'BS. Hoàng Đức Huy' }));
  const tieuDe = await screen.findByRole('heading', { name: 'BS. Hoàng Đức Huy' });
  console.info('[focus] đang ở:', document.activeElement?.tagName, JSON.stringify(document.activeElement?.textContent?.slice(0, 30)));
  expect(tieuDe).toHaveFocus();
});

test('rê chuột vào ⓘ cạnh "Giờ khám" ⇒ có chú thích', async () =&gt; {
  const user = userEvent.setup();
  renderTrang('/bac-si/bs-2');
  await user.hover(await screen.findByRole('button', { name: 'Giải thích giờ khám' }));
  expect(screen.getByRole('tooltip')).toHaveTextContent('UTC+7');
});</code></pre>
<p><code>src/features/khung/BoCuc.test.tsx</code></p>
<pre><code class="language-tsx">import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { server } from '../../mocks/node';
import { renderTrang } from '../../test/render';

// React in lỗi đã bắt ra console.error (đúng việc của nó) — tắt đi cho log test gọn.
let loiConsole: ReturnType&lt;typeof vi.spyOn&gt;;
beforeEach(() =&gt; {
  loiConsole = vi.spyOn(console, 'error').mockImplementation(() =&gt; {});
});
afterEach(() =&gt; loiConsole.mockRestore());

test('API chi tiết trả 500 ⇒ ranh giới lỗi hứng; đầu trang + điều hướng vẫn chạy; sang trang khác thì hết lỗi', async () =&gt; {
  server.use(http.get('/api/bac-si/:id', () =&gt; HttpResponse.json({ loi: 'Máy chủ đang bận, thử lại sau' }, { status: 500 })));
  const user = userEvent.setup();
  renderTrang('/bac-si/bs-9');
  const hop = await screen.findByRole('alert');
  console.info('[500] hộp lỗi:', hop.textContent);
  expect(hop).toHaveTextContent('Phần này gặp sự cố.'); // hộp của RANH GIỚI, không phải hộp lỗi riêng của trang
  console.info('[500] còn tiêu đề phòng khám?', screen.queryByRole('heading', { level: 1 }) !== null, '| còn thanh điều hướng?', screen.queryByRole('navigation') !== null);
  await user.click(screen.getByRole('link', { name: 'Lịch hẹn của tôi' }));
  expect(await screen.findByRole('heading', { name: /Lịch hẹn của tôi/ })).toBeInTheDocument();
  console.info('[500] sau khi bấm "Lịch hẹn của tôi": còn hộp lỗi?', screen.queryByText('Phần này gặp sự cố.') !== null);
  expect(screen.queryByText('Phần này gặp sự cố.')).not.toBeInTheDocument();
});

test('404 (link cũ) KHÔNG ném lên ranh giới: trang tự hiện hộp lỗi của nó', async () =&gt; {
  renderTrang('/bac-si/bs-9');
  const hop = await screen.findByRole('alert');
  console.info('[404] hộp lỗi:', hop.textContent);
  expect(hop).toHaveTextContent('Không mở được trang bác sĩ');
});

test('"Tải lại phần này" xoá lỗi trong cache query rồi gọi lại API', async () =&gt; {
  let lan = 0;
  server.use(
    http.get('/api/bac-si/:id', () =&gt; {
      lan += 1;
      if (lan === 1) return HttpResponse.json({ loi: 'Máy chủ đang bận, thử lại sau' }, { status: 500 });
      return undefined; // lần sau: handler gốc
    }),
  );
  const user = userEvent.setup();
  renderTrang('/bac-si/bs-3');
  await user.click(await screen.findByRole('button', { name: 'Tải lại phần này' }));
  expect(await screen.findByRole('heading', { name: 'BS. Lê Quốc Bảo' })).toBeInTheDocument();
  console.info('[thu lai] số lần gọi API chi tiết:', lan);
});</code></pre>
<p><code>src/components/LichHenCuaToi.test.tsx</code></p>
<pre><code class="language-tsx">import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { db } from '../mocks/co-so-du-lieu';
import { renderVoiQuery } from '../test/render';
import { LichHenCuaToi } from './LichHenCuaToi';

function coMotLich() {
  db.themLichHen({
    bacSiId: 'bs-2', khungGioId: 'bs-2-2026-10-01-1400', batDau: '2026-10-01T14:00:00+07:00', lyDo: 'Bé ho', trangThai: 'cho-xac-nhan',
    benhNhan: { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567', ngaySinh: '1995-03-14' },
  });
}

test('bấm Huỷ ⇒ hộp xác nhận mở TRONG &lt;body&gt; (portal), focus ở nút an toàn', async () =&gt; {
  coMotLich();
  const user = userEvent.setup();
  const { container } = renderVoiQuery(&lt;LichHenCuaToi /&gt;);
  await user.click(await screen.findByRole('button', { name: 'Huỷ lịch lh-1' }));
  const hop = screen.getByRole('dialog', { name: 'Huỷ lịch hẹn này?' });
  console.info('[portal] hộp nằm trong vùng render của component?', container.contains(hop), '| cha trực tiếp của lớp nền:', hop.parentElement!.parentElement!.tagName);
  console.info('[portal] focus đang ở:', document.activeElement?.textContent);
  expect(container.contains(hop)).toBe(false);
  expect(screen.getByRole('button', { name: 'Không, giữ lại' })).toHaveFocus();
});

test('Escape ⇒ đóng hộp, KHÔNG huỷ, focus trả về nút Huỷ', async () =&gt; {
  coMotLich();
  const user = userEvent.setup();
  renderVoiQuery(&lt;LichHenCuaToi /&gt;);
  const nutHuy = await screen.findByRole('button', { name: 'Huỷ lịch lh-1' });
  await user.click(nutHuy);
  await user.keyboard('{Escape}');
  console.info('[escape] còn hộp?', screen.queryByRole('dialog') !== null, '| focus về:', document.activeElement?.getAttribute('aria-label'), '| trạng thái:', db.lichHen()[0].trangThai);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(nutHuy).toHaveFocus();
  expect(db.lichHen()[0].trangThai).toBe('cho-xac-nhan');
});

test('bấm "Huỷ lịch" trong hộp ⇒ PATCH, dòng hiện "Đã huỷ"', async () =&gt; {
  coMotLich();
  const user = userEvent.setup();
  renderVoiQuery(&lt;LichHenCuaToi /&gt;);
  await user.click(await screen.findByRole('button', { name: 'Huỷ lịch lh-1' }));
  await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Huỷ lịch' }));
  expect(await screen.findByText('Đã huỷ')).toBeInTheDocument(); // cập nhật lạc quan: hiện ngay
  await waitFor(() =&gt; expect(db.lichHen()[0].trangThai).toBe('da-huy'));
  console.info('[dong y] máy chủ:', db.lichHen()[0].trangThai, '| còn hộp?', screen.queryByRole('dialog') !== null);
});</code></pre>
<p><code>src/components/ChuThich.test.tsx</code></p>
<pre><code class="language-tsx">import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { ChuThich } from './ChuThich';

const hinhChuNhat = (top: number, height: number) =&gt; ({ top, bottom: top + height, left: 100, right: 124, width: 24, height, x: 100, y: top, toJSON: () =&gt; ({}) });

test('rê chuột vào ⓘ ⇒ chú thích hiện, nút được "mô tả bởi" nó; rời chuột ⇒ ẩn', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;ChuThich nhan="Giải thích giờ khám"&gt;Giờ Việt Nam (UTC+7).&lt;/ChuThich&gt;);
  const nut = screen.getByRole('button', { name: 'Giải thích giờ khám' });
  await user.hover(nut);
  expect(screen.getByRole('tooltip')).toHaveTextContent('Giờ Việt Nam (UTC+7).');
  expect(nut).toHaveAccessibleDescription('Giờ Việt Nam (UTC+7).');
  await user.unhover(nut);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('nút ở sát mép trên ⇒ lật xuống dưới; nút ở giữa trang ⇒ nằm trên', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;ChuThich nhan="Giải thích"&gt;Chữ&lt;/ChuThich&gt;);
  const nut = screen.getByRole('button', { name: 'Giải thích' });
  nut.getBoundingClientRect = () =&gt; hinhChuNhat(4, 24) as DOMRect; // jsdom không tính layout ⇒ tự cho số đo
  await user.hover(nut);
  const phiaKhiSatMep = screen.getByRole('tooltip').dataset.phia;
  await user.unhover(nut);
  nut.getBoundingClientRect = () =&gt; hinhChuNhat(300, 24) as DOMRect;
  await user.hover(nut);
  const phiaKhiOGiua = screen.getByRole('tooltip').dataset.phia;
  console.info('[tooltip] nút ở top=4 ⇒', phiaKhiSatMep, '| nút ở top=300 ⇒', phiaKhiOGiua, '| style:', screen.getByRole('tooltip').getAttribute('style'));
  expect([phiaKhiSatMep, phiaKhiOGiua]).toEqual(['duoi', 'tren']);
});

test('bàn phím: Tab tới ⓘ cũng mở chú thích (focus), Tab đi thì đóng', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;ChuThich nhan="Giải thích"&gt;Chữ&lt;/ChuThich&gt;);
  await user.tab();
  expect(screen.getByRole('tooltip')).toBeInTheDocument();
  await user.tab();
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});</code></pre>
</details>
<details><summary>Solution</summary>
<p><strong>Tasks 1 and 2</strong> — <code>src/features/bac-si/TrangChiTietBacSi.tsx</code> (the top part; <code>DatLichVoiBacSi</code> is unchanged except for <code>ChuThich</code> in task 5):</p>
<pre><code class="language-tsx">import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ChuThich } from '../../components/ChuThich';
import { FormDatLich } from '../../components/FormDatLich';
import { LuoiGioKhung } from '../../components/KhungXuong';
import { LoiTaiDuLieu } from '../../components/LoiTaiDuLieu';
import { TEN_CHUYEN_KHOA } from '../../du-lieu/chuyen-khoa';
import { useBacSi } from '../../hooks/useBacSi';
import { useChiTietBacSi } from '../../hooks/useChiTietBacSi';
import { useDatLich } from '../../hooks/useDatLich';
import { useKhungGio } from '../../hooks/useKhungGio';
import { hienGio, hienNgay, NGAY_KHAM } from '../../logic/thoi-gian';
import type { BacSi } from '../../types';

/** Trang /bac-si/:id — giới thiệu, chọn giờ + form đặt lịch, và bác sĩ cùng chuyên khoa. */
export function TrangChiTietBacSi() {
  const { id = '' } = useParams();
  const { data: bacSi, isPending, error, refetch, isFetching } = useChiTietBacSi(id);
  const { data: tatCa } = useBacSi();
  const tieuDeRef = useRef&lt;HTMLHeadingElement&gt;(null);

  // Chương 11: đổi trang trong SPA không tải lại trang ⇒ trình đọc màn hình không biết đã sang trang mới.
  // Đưa focus lên tiêu đề mỗi khi sang bác sĩ khác: người dùng bàn phím/trình đọc màn hình bắt đầu từ đầu trang.
  useEffect(() =&gt; {
    tieuDeRef.current?.focus();
  }, [bacSi?.id]);

  if (isPending) return &lt;p aria-busy="true"&gt;Đang tải thông tin bác sĩ…&lt;/p&gt;;
  if (!bacSi) return &lt;LoiTaiDuLieu tieuDe="Không mở được trang bác sĩ" loi={error!} onThuLai={() =&gt; refetch()} dangThuLai={isFetching} /&gt;;

  const cungKhoa = (tatCa ?? []).filter((b) =&gt; b.chuyenKhoa === bacSi.chuyenKhoa &amp;&amp; b.id !== bacSi.id);
  return (
    &lt;div className="trang-bac-si"&gt;
      &lt;section className="chi-tiet" aria-label={&#96;Giới thiệu &#36;{bacSi.ten}&#96;}&gt;
        &lt;h2 ref={tieuDeRef} tabIndex={-1}&gt;
          {bacSi.ten}
        &lt;/h2&gt;
        &lt;p className="chuyen-khoa"&gt;
          {TEN_CHUYEN_KHOA[bacSi.chuyenKhoa]} · {bacSi.namKinhNghiem} năm kinh nghiệm
        &lt;/p&gt;
        &lt;p&gt;{bacSi.gioiThieu}&lt;/p&gt;
      &lt;/section&gt;
      {/* Chương 11: key = id bác sĩ ⇒ đổi bác sĩ là component MỚI, mọi state bên trong (ngày, giờ đã chọn,
          chữ trong form, "đã gửi") bắt đầu lại từ đầu. Không có key: React giữ nguyên vì cùng loại, cùng vị trí. */}
      &lt;DatLichVoiBacSi key={bacSi.id} bacSi={bacSi} /&gt;
      &lt;aside className="cung-khoa" aria-label="Bác sĩ cùng chuyên khoa"&gt;
        &lt;h3&gt;Cùng chuyên khoa&lt;/h3&gt;
        &lt;ul&gt;
          {cungKhoa.map((b) =&gt; (
            &lt;li key={b.id}&gt;
              &lt;Link to={&#96;/bac-si/&#36;{b.id}&#96;}&gt;{b.ten}&lt;/Link&gt;
            &lt;/li&gt;
          ))}
        &lt;/ul&gt;
      &lt;/aside&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>Add to <code>src/App.css</code>:</p>
<pre><code class="language-css">/* tiêu đề nhận focus bằng code (tabIndex -1): không vẽ viền focus — nó không phải thứ để bấm */
[tabindex='-1']:focus { outline: none; }</code></pre>
<p><strong>Task 3</strong> — <code>src/components/HopXacNhan.tsx</code> (explained line by line in Lesson 11.4):</p>
<pre><code class="language-tsx">import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface HopXacNhanProps {
  tieuDe: string;
  children: ReactNode;
  nhanDongY: string;
  nhanHuy?: string;
  dangXuLy?: boolean;
  onDongY: () =&gt; void;
  onDong: () =&gt; void;
}

/**
 * Hộp xác nhận (modal). Vẽ bằng createPortal vào &lt;body&gt;: không bị overflow/z-index của thẻ cha cắt mất,
 * nhưng vẫn là con của component gọi nó trong CÂY REACT (context, sự kiện nổi bọt theo cây React).
 * Mở ra ⇒ focus vào nút AN TOÀN (không phá gì). Escape hoặc bấm nền ⇒ đóng. Đóng ⇒ focus về nút đã mở hộp.
 */
export function HopXacNhan({ tieuDe, children, nhanDongY, nhanHuy = 'Không, giữ lại', dangXuLy = false, onDongY, onDong }: HopXacNhanProps) {
  const idTieuDe = useId();
  const nutAnToan = useRef&lt;HTMLButtonElement&gt;(null);

  useEffect(() =&gt; {
    const truoc = document.activeElement as HTMLElement | null; // nút "Huỷ" đã mở hộp
    nutAnToan.current?.focus();
    const khiBamPhim = (e: KeyboardEvent) =&gt; {
      if (e.key === 'Escape') onDong();
    };
    document.addEventListener('keydown', khiBamPhim);
    return () =&gt; {
      document.removeEventListener('keydown', khiBamPhim);
      truoc?.focus(); // trả focus về chỗ cũ khi hộp đóng
    };
  }, [onDong]);

  return createPortal(
    &lt;div className="nen-hop" onClick={onDong}&gt;
      &lt;div
        className="hop-xac-nhan"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTieuDe}
        onClick={(e) =&gt; e.stopPropagation()} // bấm TRONG hộp không tính là bấm nền
      &gt;
        &lt;h2 id={idTieuDe}&gt;{tieuDe}&lt;/h2&gt;
        &lt;div&gt;{children}&lt;/div&gt;
        &lt;div className="hang-nut"&gt;
          &lt;button ref={nutAnToan} type="button" className="nut" onClick={onDong} disabled={dangXuLy}&gt;
            {nhanHuy}
          &lt;/button&gt;
          &lt;button type="button" className="nut nut-nguy-hiem" onClick={onDongY} disabled={dangXuLy}&gt;
            {dangXuLy ? 'Đang xử lý…' : nhanDongY}
          &lt;/button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;,
    document.body,
  );
}</code></pre>
<p><code>src/components/LichHenCuaToi.tsx</code>:</p>
<pre><code class="language-tsx">import { useCallback, useState } from 'react';
import type { LichHenCoGio } from '../api/phong-kham';
import { useBacSi } from '../hooks/useBacSi';
import { useHuyLichHen, useLichHen } from '../hooks/useLichHen';
import { hienGio } from '../logic/thoi-gian';
import type { TrangThaiLichHen } from '../types';
import { HopXacNhan } from './HopXacNhan';
import { LoiTaiDuLieu } from './LoiTaiDuLieu';

const TEN_TRANG_THAI: Record&lt;TrangThaiLichHen, string&gt; = {
  'cho-xac-nhan': 'Chờ xác nhận',
  'da-xac-nhan': 'Đã xác nhận',
  'da-huy': 'Đã huỷ',
};

export function LichHenCuaToi() {
  const { data: lichHen, isPending, error, refetch, isFetching } = useLichHen();
  const { data: bacSi } = useBacSi();
  const huy = useHuyLichHen();
  const [canHuy, setCanHuy] = useState&lt;LichHenCoGio | null&gt;(null); // lịch đang chờ xác nhận huỷ
  const dongHop = useCallback(() =&gt; setCanHuy(null), []); // ổn định: effect của hộp không chạy lại mỗi render
  const tenBacSi = (id: string) =&gt; bacSi?.find((b) =&gt; b.id === id)?.ten ?? id;

  return (
    &lt;section className="lich-hen" aria-label="Lịch hẹn của tôi"&gt;
      &lt;h2&gt;Lịch hẹn của tôi {lichHen &amp;&amp; &#96;(&#36;{lichHen.length})&#96;}&lt;/h2&gt;
      {isPending ? (
        &lt;p className="goi-y" aria-busy="true"&gt;
          Đang tải lịch hẹn…
        &lt;/p&gt;
      ) : !lichHen ? (
        &lt;LoiTaiDuLieu tieuDe="Không tải được lịch hẹn" loi={error!} onThuLai={() =&gt; refetch()} dangThuLai={isFetching} /&gt;
      ) : lichHen.length === 0 ? (
        &lt;p className="goi-y"&gt;Chưa có lịch hẹn nào.&lt;/p&gt;
      ) : (
        &lt;ul&gt;
          {lichHen.map((lh) =&gt; (
            &lt;li key={lh.id} className={lh.trangThai}&gt;
              &lt;strong&gt;{tenBacSi(lh.bacSiId)}&lt;/strong&gt; · {hienGio(lh.batDau)} ·{' '}
              {lh.benhNhan.hoTen} · &lt;span className="trang-thai"&gt;{TEN_TRANG_THAI[lh.trangThai]}&lt;/span&gt;
              {lh.trangThai === 'cho-xac-nhan' &amp;&amp; (
                &lt;button type="button" className="nut nut-nho" onClick={() =&gt; setCanHuy(lh)} aria-label={&#96;Huỷ lịch &#36;{lh.id}&#96;}&gt;
                  Huỷ
                &lt;/button&gt;
              )}
            &lt;/li&gt;
          ))}
        &lt;/ul&gt;
      )}
      {canHuy &amp;&amp; (
        &lt;HopXacNhan
          tieuDe="Huỷ lịch hẹn này?"
          nhanDongY="Huỷ lịch"
          onDong={dongHop}
          onDongY={() =&gt; {
            huy.mutate(canHuy);
            setCanHuy(null);
          }}
        &gt;
          &lt;p&gt;
            {tenBacSi(canHuy.bacSiId)} · {hienGio(canHuy.batDau)} · {canHuy.benhNhan.hoTen}
          &lt;/p&gt;
          &lt;p&gt;Khung giờ sẽ được mở lại cho người khác đặt.&lt;/p&gt;
        &lt;/HopXacNhan&gt;
      )}
    &lt;/section&gt;
  );
}</code></pre>
<p>The dialog's CSS:</p>
<pre><code class="language-css">.nen-hop { position: fixed; inset: 0; background: rgb(15 23 42 / .55); display: grid; place-items: center; z-index: 100; }
.hop-xac-nhan { background: #fff; border-radius: 14px; padding: 18px 22px; width: min(420px, 92vw); box-shadow: 0 20px 50px rgb(0 0 0 / .3); }
.hop-xac-nhan h2 { margin: 0 0 8px; font-size: 19px; }
.hop-xac-nhan p { margin: 4px 0; color: #334155; font-size: 14px; }
.hop-xac-nhan .hang-nut { justify-content: flex-end; margin-top: 14px; }
.nut-nguy-hiem { background: #be123c; border-color: #be123c; color: #fff; }</code></pre>
<p><strong>Task 4</strong> — <code>src/components/RanhGioiLoi.tsx</code>:</p>
<pre><code class="language-tsx">import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onThuLai?: () =&gt; void;
  /** Chương 11: một trong các giá trị này đổi (vd đường dẫn) ⇒ tự xoá lỗi, vẽ lại children. */
  resetKeys?: readonly unknown[];
}
interface State {
  loi: Error | null;
}

/**
 * Error boundary ("ranh giới lỗi"): bắt lỗi ném ra LÚC RENDER ở mọi component con, vẽ màn dự phòng
 * thay vì để cả trang trắng. React 19 vẫn CHƯA có cách viết nó bằng function ⇒ đây là chỗ hiếm hoi
 * còn dùng class component (hoặc cài gói react-error-boundary — nó bọc đúng class này).
 */
export class RanhGioiLoi extends Component&lt;Props, State&gt; {
  state: State = { loi: null };

  static getDerivedStateFromError(loi: Error): State {
    return { loi }; // lần render sau vẽ màn dự phòng
  }

  componentDidUpdate(truoc: Props) {
    // Đang hiện màn lỗi mà người dùng đã đi chỗ khác (resetKeys đổi) ⇒ cho children một cơ hội mới.
    const doi = (truoc.resetKeys ?? []).some((k, i) =&gt; !Object.is(k, this.props.resetKeys?.[i]));
    if (this.state.loi &amp;&amp; doi) this.setState({ loi: null });
  }

  componentDidCatch(loi: Error, info: ErrorInfo) {
    console.error('[RanhGioiLoi]', loi.message, info.componentStack?.split('\\n')[1]?.trim()); // app thật: gửi về Sentry…
  }

  render() {
    if (this.state.loi) {
      return (
        &lt;div className="hop-loi" role="alert"&gt;
          &lt;p&gt;
            &lt;strong&gt;Phần này gặp sự cố.&lt;/strong&gt;
          &lt;/p&gt;
          &lt;p&gt;{this.state.loi.message}&lt;/p&gt;
          &lt;button
            type="button"
            className="nut"
            onClick={() =&gt; {
              this.props.onThuLai?.();
              this.setState({ loi: null });
            }}
          &gt;
            Tải lại phần này
          &lt;/button&gt;
        &lt;/div&gt;
      );
    }
    return this.props.children;
  }
}</code></pre>
<p><code>src/features/khung/BoCuc.tsx</code>:</p>
<pre><code class="language-tsx">import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { RanhGioiLoi } from '../../components/RanhGioiLoi';
import { VungThongBao } from '../../components/VungThongBao';

/** Layout chung: đầu trang + thanh điều hướng + &lt;Outlet /&gt; (trang con vẽ vào đây) + chân trang. */
export function BoCuc() {
  const { pathname } = useLocation();
  const { reset } = useQueryErrorResetBoundary(); // "Thử lại" của ranh giới lỗi phải xoá cả lỗi đang nhớ trong query
  return (
    &lt;&gt;
      &lt;Header /&gt;
      &lt;nav className="thanh-dieu-huong" aria-label="Điều hướng chính"&gt;
        &lt;NavLink to="/" end&gt;
          Trang chủ
        &lt;/NavLink&gt;
        &lt;NavLink to="/bac-si"&gt;Bác sĩ&lt;/NavLink&gt;
        &lt;NavLink to="/lich-hen"&gt;Lịch hẹn của tôi&lt;/NavLink&gt;
      &lt;/nav&gt;
      &lt;main className="noi-dung"&gt;
        {/* Chương 11: sang đường dẫn khác ⇒ ranh giới tự xoá lỗi (resetKeys). KHÔNG dùng key={pathname}:
            key sẽ gỡ + dựng lại CẢ TRANG mỗi lần đổi đường dẫn, kể cả khi chẳng có lỗi nào. */}
        &lt;RanhGioiLoi resetKeys={[pathname]} onThuLai={reset}&gt;
          &lt;Outlet /&gt;
        &lt;/RanhGioiLoi&gt;
      &lt;/main&gt;
      &lt;Footer /&gt;
      &lt;VungThongBao /&gt;
    &lt;/&gt;
  );
}</code></pre>
<p><code>src/hooks/useChiTietBacSi.ts</code>:</p>
<pre><code class="language-ts">import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LoiApi } from '../api/http';
import { khoa } from '../api/khoa';
import { api } from '../api/phong-kham';
import type { BacSi } from '../types';

/**
 * Một bác sĩ theo id (trang /bac-si/:id). Danh sách đã tải thì LẤY SẴN từ cache của danh sách (initialData):
 * bấm vào một bác sĩ là trang hiện ngay, không nháy "Đang tải…".
 */
export function useChiTietBacSi(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: khoa.chiTietBacSi(id),
    queryFn: ({ signal }) =&gt; api.bacSi(id, signal),
    staleTime: 5 * 60_000,
    initialData: () =&gt; queryClient.getQueryData&lt;BacSi[]&gt;(khoa.bacSi)?.find((b) =&gt; b.id === id),
    initialDataUpdatedAt: () =&gt; queryClient.getQueryState(khoa.bacSi)?.dataUpdatedAt,
    // Chương 11: 404 là chuyện BÌNH THƯỜNG của trang này (link cũ) ⇒ trang tự hiện hộp lỗi.
    // Lỗi khác (500, mất mạng) ⇒ NÉM LÊN error boundary gần nhất, đừng để trang tự xoay xở.
    throwOnError: (loi) =&gt; !(loi instanceof LoiApi &amp;&amp; loi.status === 404),
  });
}</code></pre>
<p><code>src/main.tsx</code> (the new part):</p>
<pre><code class="language-tsx">/** Chương 11: MỘT chỗ nhận mọi lỗi render — app thật gửi về Sentry/máy chủ log thay cho console. */
function baoLoi(loai: string) {
  return (loi: unknown, info: { componentStack?: string }) =&gt; {
    const dong = info.componentStack?.trim().split('\\n')[0] ?? '';
    console.error(&#96;[&#36;{loai}]&#96;, loi instanceof Error ? loi.message : loi, dong);
  };
}

batApiGia().then(() =&gt; {
  createRoot(document.getElementById('root')!, {
    onCaughtError: baoLoi('da-bat'), // lỗi đã có error boundary hứng
    onUncaughtError: baoLoi('khong-ai-bat'), // lỗi không ai hứng ⇒ React gỡ CẢ app
  }).render(
    &lt;StrictMode&gt;
      &lt;QueryClientProvider client={queryClient}&gt;
        &lt;App /&gt;
      &lt;/QueryClientProvider&gt;
    &lt;/StrictMode&gt;,
  );
});</code></pre>
<p>To see it in a browser yourself, add one line to the <code>GET /api/bac-si/:id</code> handler in <code>src/mocks/handlers.ts</code>, then open <code>/bac-si/bs-1?loi=chi-tiet</code>:</p>
<pre><code class="language-ts">
  http.get('/api/bac-si/:id', async ({ params }) =&gt; {
    await treMang();
    if (dieuKhien.loi.has('chi-tiet')) return loi500(); // Chương 11: xem ranh giới lỗi làm việc
    const bs = db.bacSi().find((b) =&gt; b.id === params.id);
    if (!bs) return HttpResponse.json({ loi: &#96;Không có bác sĩ &#36;{String(params.id)}&#96; }, { status: 404 });
    return HttpResponse.json(bs);
  }),</code></pre>
<p><strong>Task 5</strong> — <code>src/components/ChuThich.tsx</code>:</p>
<pre><code class="language-tsx">import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ViTri = { top: number; left: number; phia: 'tren' | 'duoi' };
const KHE = 8; // khoảng cách giữa nút và chú thích (px)

/**
 * Chú thích nổi (tooltip) cạnh một nút ⓘ. Mặc định nằm TRÊN nút; không đủ chỗ phía trên thì lật XUỐNG DƯỚI.
 * Muốn biết "đủ chỗ không" phải ĐO chiều cao thật của chú thích ⇒ phải vẽ nó ra trước rồi mới đo được.
 * useLayoutEffect: đo + đặt lại vị trí TRƯỚC khi trình duyệt vẽ ⇒ người dùng không bao giờ thấy vị trí sai.
 */
export function ChuThich({ nhan, children }: { nhan: string; children: ReactNode }) {
  const [mo, setMo] = useState(false);
  const [viTri, setViTri] = useState&lt;ViTri | null&gt;(null);
  const nutRef = useRef&lt;HTMLButtonElement&gt;(null);
  const hopRef = useRef&lt;HTMLDivElement&gt;(null);
  const id = useId();

  useLayoutEffect(() =&gt; {
    if (!mo || !nutRef.current || !hopRef.current) return;
    const nut = nutRef.current.getBoundingClientRect();
    const hop = hopRef.current.getBoundingClientRect();
    const phia = nut.top - hop.height - KHE &gt;= 0 ? 'tren' : 'duoi';
    const left = Math.max(KHE, Math.min(nut.left + nut.width / 2 - hop.width / 2, window.innerWidth - hop.width - KHE));
    setViTri({ phia, left, top: phia === 'tren' ? nut.top - hop.height - KHE : nut.bottom + KHE });
  }, [mo]);

  function dong() {
    setMo(false);
    setViTri(null);
  }

  return (
    &lt;&gt;
      &lt;button
        ref={nutRef}
        type="button"
        className="nut-chu-thich"
        aria-label={nhan}
        aria-describedby={mo ? id : undefined}
        onMouseEnter={() =&gt; setMo(true)}
        onMouseLeave={dong}
        onFocus={() =&gt; setMo(true)}
        onBlur={dong}
      &gt;
        ⓘ
      &lt;/button&gt;
      {mo &amp;&amp;
        createPortal(
          &lt;div
            ref={hopRef}
            id={id}
            role="tooltip"
            className="chu-thich-noi"
            data-phia={viTri?.phia}
            style={{ top: viTri?.top ?? 0, left: viTri?.left ?? 0 }}
          &gt;
            {children}
          &lt;/div&gt;,
          document.body,
        )}
    &lt;/&gt;
  );
}</code></pre>
<pre><code class="language-css">.nut-chu-thich { font: inherit; font-size: 15px; border: 0; background: none; color: #0e7490; cursor: help; padding: 0 4px; }
.chu-thich-noi { position: fixed; max-width: 260px; background: #0f172a; color: #fff; font-size: 13px; line-height: 1.45; border-radius: 8px; padding: 8px 10px; z-index: 90; pointer-events: none; }</code></pre>
<p>And in <code>DatLichVoiBacSi</code>:</p>
<pre><code class="language-tsx">  return (
    &lt;section className="luong" aria-label="Đặt lịch với bác sĩ này"&gt;
      &lt;h3&gt;
        Giờ khám
        &lt;ChuThich nhan="Giải thích giờ khám"&gt;
          Giờ theo giờ Việt Nam (UTC+7). Khung ghi “kín” là đã có người đặt; lịch bị huỷ thì khung mở lại.
        &lt;/ChuThich&gt;
      &lt;/h3&gt;</code></pre>
<p>Final check on the lesson machine:</p>
<div class="out">$ npx tsc -b
$ npx vitest run
 Test Files  28 passed (28)
      Tests  121 passed (121)
$ npx vite build
✓ 520 modules transformed.
dist/assets/index-BLlLlWaS.js    490.01 kB │ gzip: 152.57 kB
✓ built in 1.20s</div>
</details>


<h3>Check with your own eyes: four expected screenshots</h3>
<p>Green tests are not the end: jsdom does not paint, does not measure layout, and has no real <code>&lt;dialog&gt;</code>. Run <code>npm run dev</code> and redo the four scenes below in your browser; your screen should look like these real Chromium screenshots.</p>
${slide('rx-11', 11, 'Before and after adding the key: Dr Huy’s page after booking with Dr An')}
<p><strong>Scene 1 — switching doctors.</strong> Open <code>/bac-si/bs-1</code>, pick 08:00, fill the form, click "Đặt lịch", then click "BS. Hoàng Đức Huy" in the right column. Expected: Dr Huy's form is empty, no "sent" message, and focus is on the doctor's name (press Tab once: focus moves to the ⓘ button next to "Giờ khám" and the tooltip appears).</p>
${slide('rx-11', 22, 'The cancel dialog: portal, focus on the safe button, Escape')}
<p><strong>Scene 2 — cancelling.</strong> Go to "Lịch hẹn của tôi", click "Huỷ". Expected: the "Huỷ lịch hẹn này?" dialog centred on a dark backdrop, focus on "Không, giữ lại"; Escape closes it and focus returns to the exact "Huỷ" button you clicked; open it again, click "Huỷ lịch", and the row turns "Đã huỷ" immediately (optimistic update).</p>
${slide('rx-11', 24, 'Error boundaries only catch render-time errors — not onClick')}
<p><strong>Scene 3 — server error.</strong> Open <code>/bac-si/bs-1?loi=chi-tiet</code>. Expected: a few seconds of "Đang tải…" (TanStack retries three times — on the lesson machine the fallback appeared after 8.5 seconds), then "Phần này gặp sự cố." under a header and menu that still work; the console has one line <code>[da-bat] Máy chủ đang bận, thử lại sau</code>; clicking "Lịch hẹn của tôi" makes the error box disappear.</p>
${SD.loi500En}
<p><strong>Scene 4 — the tooltip.</strong> Hover the ⓘ next to "Giờ khám": the tooltip appears just above it, without flashing in the corner. For the flickering version to compare with, re-read the 20/20 measurement in Lesson 11.3.</p>

<h3>The chapter's common mistakes</h3>
${slide('rx-11', 25, 'Common mistakes in Chapter 11')}
<p>The six mistakes below are what code review at a company catches most in this group of topics. Each comes with the number the chapter measured, so you recognise it when you meet it again:</p>
<ol>
<li><strong><code>key = index</code> or <code>key={Math.random()}</code>.</strong> Index keys make state drift on delete/insert/reorder (delete An, "tái khám" moves to Hà); random keys remount every row on every render. Use stable ids.</li>
<li><strong>Defining a component inside a component.</strong> Every render is a new type: type "huy", the input keeps only "h", focus on <code>BODY</code>, 2 mounts. Define at module level.</li>
<li><strong>Resetting state with <code>useEffect</code>.</strong> There is always one wrong render (<code>bs-5:"ab"</code> before <code>bs-5:""</code>). Put a <code>key</code> on the component that should start over.</li>
<li><strong>Removing StrictMode to "stop running twice".</strong> The bug stays: a listener without cleanup still fires 2 more times after the component is gone. Write the cleanup.</li>
<li><strong>Measuring layout in <code>useEffect</code>.</strong> Fast machines show nothing (0/20); slow ones paint the first frame in the wrong place 20/20 times. Measure and reposition in <code>useLayoutEffect</code>.</li>
<li><strong>Believing an error boundary catches everything.</strong> An error in <code>onClick</code> goes straight to <code>window</code> and the screen does not change. Handle it on the spot, or catch → setState → rethrow during render; for API errors use <code>throwOnError</code>.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Trap — solving task 4 with <code>key={pathname}</code> on the error boundary.</strong> Quick, short, and the "navigating clears the error" test passes. But the key changes on <em>every</em> navigation, so the whole page is unmounted and remounted even with no error — and because that also unmounts <code>DatLichVoiBacSi</code> every time you move to another doctor, it <strong>hides</strong> task 1: the three key tests pass even if you forget <code>key={bacSi.id}</code>. Exactly the "Loading… screen doing the key's job" trap from Lesson 11.2. Measured: switch <code>BoCuc</code> to <code>key={pathname}</code> and remove <code>key={bacSi.id}</code>, and <code>npx vitest run src/features</code> still says <code>Tests  8 passed (8)</code>. Use <code>resetKeys</code>, which only steps in while an error is showing.</div>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>At FER202, a feature is "done" when it works when you click around on your own machine and you can demo it to the lecturer; tests (if any) come last, and the assignment has no acceptance criteria → At a company, a ticket usually comes with <strong>acceptance criteria</strong>, and the surest way to prove you met them is tests that are red before the fix and green after — like this lesson's seven red → fourteen green — plus a look in a real browser before opening a pull request. · <em>Why:</em> this chapter's bugs (a form carrying old data, a clipped dialog, a blank page) do not turn a "does it render" test red; only tests describing the right behaviour catch them, and reviewers need evidence rather than promises. Demo-before-test is not wrong for small exercises — but it is a habit to drop before your internship.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "Tell me about a hard bug you fixed and how you found it."</p>
<p>A good answer has three parts: the symptom users saw, the root cause, and how you proved the fix. An example from this chapter: "The doctor detail page shares one route; after booking with doctor A and moving to doctor B, B's page said 'sent', and booking there sent A's slot. The cause: React kept the form component because it was the same type in the same position — state is tied to position, not to the doctor; the bug stayed hidden because the page used to show a 'Loading…' screen that accidentally unmounted the form, and it surfaced once we added initialData. I wrote three tests describing the correct behaviour, saw them fail, fixed it with <code>key={bacSi.id}</code>, saw them pass." The interviewer hears that you understand reconciliation, that you test, and that you distrust things that "just work".</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Task:</strong> a keyboard-only self-check — the fastest way to see whether three of the five tasks really work.</p><ol>
<li>Run <code>npm run dev</code>, open <code>/bac-si/bs-1</code>, and put the mouse away (or just don't touch it).</li>
<li>Using only Tab, Shift+Tab, Enter and Escape: open the appointment-time tooltip, pick a slot, fill the form, book; move to "BS. Hoàng Đức Huy"; go to "Lịch hẹn của tôi", open the cancel dialog, close it with Escape, open it again and cancel.</li>
<li>Write one more test for <code>LichHenCuaToi</code>: clicking the dark backdrop (the <code>.nen-hop</code> layer) closes the dialog without cancelling; clicking the text inside the dialog does not close it.</li>
</ol><p><strong>Done when:</strong> step 2 works entirely without a mouse, and each time the dialog closes you see the focus ring return to the right "Huỷ" button; the step 3 test passes together with the 14 acceptance tests; <code>npx tsc -b</code> is clean.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">acceptance criteria</span><span class="v">checkable conditions for calling a task done; here 14 tests + 4 screenshots</span></div>
<div class="kv"><span class="k">red → green</span><span class="v">write a test describing what must be true, watch it fail, then fix until it passes</span></div>
<div class="kv"><span class="k">regression</span><span class="v">an old bug coming back after another change; acceptance tests keep it out</span></div>
<div class="kv"><span class="k">focus management</span><span class="v">deciding where focus goes after navigation and when dialogs open/close</span></div>
<div class="kv"><span class="k">optimistic update</span><span class="v">show the result immediately, send to the server after, roll back on error (Chapter 6)</span></div>
<div class="kv"><span class="k">route-level boundary</span><span class="v">an error boundary around each page's content, reset on path change</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Five upgrades: <code>key={bacSi.id}</code> for the booking area, heading focus with a ref, a portal cancel dialog, an error boundary with <code>resetKeys</code> + <code>throwOnError</code> + <code>onCaughtError</code>, a tooltip measured with <code>useLayoutEffect</code>.</li>
<li>Criteria: starting point 7 red / 1 green; done means 4 files, 14 tests green; the whole project 28 files, 121 tests green; <code>tsc</code> clean; it builds.</li>
<li>Green tests are not enough: four scenes checked by eye in a real browser, because jsdom neither paints nor measures.</li>
<li>Do not let another mechanism "do the key's job": a Loading… screen or <code>key={pathname}</code> can both hide task 1's bug.</li>
<li>The six common mistakes each have a number measured in this chapter — remember the number to recognise the mistake.</li>
</ul>

<a class="link-card" href="https://react.dev/learn/preserving-and-resetting-state" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Preserving and Resetting State</span><span class="lc-sub">The basis of task 1.</span></span></a>
<a class="link-card" href="https://react.dev/learn/manipulating-the-dom-with-refs" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Manipulating the DOM with Refs</span><span class="lc-sub">The basis of task 2.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react-dom/createPortal" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — createPortal</span><span class="lc-sub">The basis of task 3.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/Component" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Component (Error Boundary)</span><span class="lc-sub">The basis of task 4.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/useLayoutEffect" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — useLayoutEffect</span><span class="lc-sub">The basis of task 5.</span></span></a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Tự dựng: năm nâng cấp "bên trong" cho app đặt lịch</h2>
<p class="lead">Bốn bài trước mỗi bài để lại một công cụ. Bài này đưa cả năm vào app phòng khám, theo đúng thứ tự một người đi làm sẽ làm: viết test mô tả điều phải đúng, chạy thấy đỏ, sửa, chạy thấy xanh, rồi mở trình duyệt thật nhìn lại bằng mắt. Không có khái niệm mới — chỉ có ghép, và vài chỗ ghép dễ sai mà chương đã đo.</p>
<p>Năm việc có chung một gốc: chúng đều là những chỗ app "trông vẫn chạy" nhưng sai với người dùng thật. Form mang dữ liệu của bác sĩ trước sang bác sĩ sau (key — Bài 11.2). Người dùng bàn phím không biết đã sang trang mới (ref + focus — Bài 11.3). Một cú bấm nhầm là mất lịch khám (hộp xác nhận bằng portal — Bài 11.4). Một lỗi 500 làm cả trang thành màn báo lỗi không lối ra (ranh giới lỗi có reset — Bài 11.4). Và một chú thích nháy ở góc màn hình trên máy chậm (<code>useLayoutEffect</code> — Bài 11.3). Test và code dưới đây là bản đã chạy trong dự án thử của chương (React 19.3.0, React Router 8.4.0, TanStack Query 5.103.2, Vitest 5.0.1), ngày 25/09/2026.</p>

<h3>🛠 Tự gõ tiếp dự án</h3>
${slide('rx-11', 27, 'Tự gõ tiếp dự án: năm việc, mười bốn test phải xanh')}
<p><strong>Điểm xuất phát: dự án sau Chương 10.</strong> Chương này dùng những phần sau của nó (tên file đúng như hợp đồng dự án; nếu dự án của bạn đặt khác, ánh xạ theo vai trò): router trong <code>src/router.tsx</code> với layout <code>src/features/khung/BoCuc.tsx</code> (đã có <code>&lt;RanhGioiLoi&gt;</code> quanh <code>&lt;Outlet /&gt;</code>), trang <code>src/features/bac-si/TrangChiTietBacSi.tsx</code> (giới thiệu, lưới giờ, <code>FormDatLich</code>, cột "Cùng chuyên khoa"), hook <code>src/hooks/useChiTietBacSi.ts</code>, <code>src/components/LichHenCuaToi.tsx</code> với <code>useHuyLichHen</code> (Chương 6), <code>src/components/RanhGioiLoi.tsx</code>, API giả MSW trong <code>src/mocks/</code>, và trong <code>src/test/render.tsx</code> hàm <code>renderTrang(duongDan)</code> dựng cả app bằng <code>createMemoryRouter</code>. Bạn làm năm việc:</p>
<ol>
<li><strong>Reset khi đổi bác sĩ.</strong> Trên trang chi tiết, đổi sang bác sĩ khác (qua cột "Cùng chuyên khoa") phải xoá giờ đã chọn, chữ đã gõ và thông báo "đã gửi". Dùng <code>key</code>, không dùng effect.</li>
<li><strong>Focus lên tiêu đề.</strong> Sang bác sĩ khác thì focus nằm trên <code>&lt;h2&gt;</code> tên bác sĩ (<code>useRef</code> + <code>focus()</code> trong effect, <code>tabIndex={-1}</code>, không vẽ viền focus).</li>
<li><strong>Hộp xác nhận huỷ lịch.</strong> Viết <code>src/components/HopXacNhan.tsx</code> bằng <code>createPortal</code> vào <code>document.body</code> (role dialog, aria-modal, aria-labelledby; focus vào "Không, giữ lại"; Escape và bấm nền thì đóng; đóng thì trả focus). Nút "Huỷ" trong <code>LichHenCuaToi</code> mở hộp; chỉ "Huỷ lịch" trong hộp mới gọi mutation.</li>
<li><strong>Ranh giới lỗi tử tế.</strong> Thêm <code>resetKeys</code> cho <code>RanhGioiLoi</code>; trong <code>BoCuc</code> truyền <code>resetKeys={[pathname]}</code> và <code>onThuLai={reset}</code> của <code>useQueryErrorResetBoundary</code>; cho <code>useChiTietBacSi</code> <code>throwOnError</code> với mọi lỗi trừ 404; thêm <code>onCaughtError</code>/<code>onUncaughtError</code> vào <code>createRoot</code>.</li>
<li><strong>Chú thích giờ khám.</strong> Viết <code>src/components/ChuThich.tsx</code>: nút ⓘ, rê chuột hoặc Tab tới thì hiện chú thích (portal, <code>role="tooltip"</code>, nút được <code>aria-describedby</code> tới nó), nằm trên nút, không đủ chỗ thì lật xuống; đo bằng <code>useLayoutEffect</code>. Đặt cạnh chữ "Giờ khám".</li>
</ol>
${SD.nhiemVuVi}
<p><strong>Tiêu chí đạt:</strong></p>
<ul>
<li>Chép bốn file test trong khung dưới vào dự án. Ở điểm xuất phát, chạy <code>npx vitest run src/features --reporter=verbose</code> phải thấy đỏ (đo trên máy dựng bài: <code>Tests  7 failed | 1 passed (8)</code> — hai file kia chưa chạy được vì chưa có component). Làm xong năm việc: <code>npx vitest run src/features src/components/LichHenCuaToi.test.tsx src/components/ChuThich.test.tsx</code> ra <code>Test Files  4 passed (4)</code> · <code>Tests  14 passed (14)</code>.</li>
<li><code>npx tsc -b</code> không in gì; <code>npx vitest run</code> cả dự án xanh; <code>npx vite build</code> ra <code>✓ built in …</code>.</li>
<li>Ảnh chụp mong đợi (xem mục “Kiểm bằng mắt” ngay dưới): trang BS. Huy sau khi đặt với BS. An có form trắng; hộp "Huỷ lịch hẹn này?" nằm giữa màn hình trên lớp nền tối, focus ở "Không, giữ lại"; <code>/bac-si/bs-1?loi=chi-tiet</code> hiện "Phần này gặp sự cố." dưới menu còn bấm được; rê chuột vào ⓘ thấy chú thích ngay phía trên.</li>
</ul>
<details><summary>Bộ test tiêu chí (chép vào dự án)</summary>
<p><code>src/features/bac-si/TrangChiTietBacSi.test.tsx</code></p>
<pre><code class="language-tsx">import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { db } from '../../mocks/co-so-du-lieu';
import { renderTrang } from '../../test/render';

async function dienForm(user: ReturnType&lt;typeof userEvent.setup&gt;) {
  await user.type(screen.getByLabelText('Họ và tên'), 'Nguyễn Thị Ánh');
  await user.type(screen.getByLabelText('Số điện thoại'), '0901234567');
  await user.type(screen.getByLabelText('Ngày sinh'), '1990-05-20');
  await user.type(screen.getByLabelText('Lý do khám'), 'Đau dạ dày');
}

test('đổi sang bác sĩ cùng chuyên khoa ⇒ giờ đã chọn và chữ đã gõ về trắng', async () =&gt; {
  const user = userEvent.setup();
  renderTrang('/bac-si/bs-1');
  await user.click(await screen.findByRole('button', { name: '08:00 · 01/10/2026' }));
  await user.type(screen.getByLabelText('Lý do khám'), 'Đau dạ dày');
  await user.click(screen.getByRole('link', { name: 'BS. Hoàng Đức Huy' }));
  await screen.findByRole('heading', { name: 'BS. Hoàng Đức Huy' });
  await screen.findByRole('button', { name: '08:00 · 01/10/2026' });
  const dangChon = screen.queryAllByRole('button', { pressed: true }).map((b) =&gt; b.textContent);
  console.info('[doi bac si] lý do:', JSON.stringify((screen.getByLabelText('Lý do khám') as HTMLTextAreaElement).value), '| nút đang chọn:', dangChon.join(', '));
  expect(screen.getByLabelText('Lý do khám')).toHaveValue('');
});

test('đặt xong với BS. An rồi sang BS. Huy ⇒ trang của Huy KHÔNG báo "đã gửi"', async () =&gt; {
  const user = userEvent.setup();
  renderTrang('/bac-si/bs-1');
  await user.click(await screen.findByRole('button', { name: '08:00 · 01/10/2026' }));
  await dienForm(user);
  await user.click(screen.getByRole('button', { name: 'Đặt lịch' }));
  expect(await screen.findByText(/Đã gửi yêu cầu đặt lịch với BS. Nguyễn Minh An/)).toBeInTheDocument();
  await user.click(screen.getByRole('link', { name: 'BS. Hoàng Đức Huy' }));
  await screen.findByRole('heading', { name: 'BS. Hoàng Đức Huy' });
  const baoXong = screen.queryByText(/Đã gửi yêu cầu đặt lịch/)?.textContent ?? '(không có)';
  console.info('[sau khi dat] trang Huy báo:', baoXong, '| số lịch hẹn trên máy chủ:', db.lichHen().length);
  expect(screen.queryByText(/Đã gửi yêu cầu đặt lịch/)).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Đặt lịch' })).toBeInTheDocument();
});

test('chọn giờ của An, sang Huy rồi bấm Đặt lịch ⇒ không được gửi giờ của bác sĩ cũ', async () =&gt; {
  const user = userEvent.setup();
  renderTrang('/bac-si/bs-1');
  await user.click(await screen.findByRole('button', { name: '08:00 · 01/10/2026' }));
  await user.click(screen.getByRole('link', { name: 'BS. Hoàng Đức Huy' }));
  await screen.findByRole('heading', { name: 'BS. Hoàng Đức Huy' });
  await dienForm(user);
  await user.click(screen.getByRole('button', { name: 'Đặt lịch' }));
  const loi = await screen.findByRole('alert');
  console.info('[gio cu] máy chủ/ứng dụng trả lời:', loi.textContent);
  expect(loi).toHaveTextContent('Hãy chọn một khung giờ trước');
});

test('sang bác sĩ khác ⇒ focus nằm trên tiêu đề của trang mới (useRef + focus)', async () =&gt; {
  const user = userEvent.setup();
  renderTrang('/bac-si/bs-1');
  await user.click(await screen.findByRole('link', { name: 'BS. Hoàng Đức Huy' }));
  const tieuDe = await screen.findByRole('heading', { name: 'BS. Hoàng Đức Huy' });
  console.info('[focus] đang ở:', document.activeElement?.tagName, JSON.stringify(document.activeElement?.textContent?.slice(0, 30)));
  expect(tieuDe).toHaveFocus();
});

test('rê chuột vào ⓘ cạnh "Giờ khám" ⇒ có chú thích', async () =&gt; {
  const user = userEvent.setup();
  renderTrang('/bac-si/bs-2');
  await user.hover(await screen.findByRole('button', { name: 'Giải thích giờ khám' }));
  expect(screen.getByRole('tooltip')).toHaveTextContent('UTC+7');
});</code></pre>
<p><code>src/features/khung/BoCuc.test.tsx</code></p>
<pre><code class="language-tsx">import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { server } from '../../mocks/node';
import { renderTrang } from '../../test/render';

// React in lỗi đã bắt ra console.error (đúng việc của nó) — tắt đi cho log test gọn.
let loiConsole: ReturnType&lt;typeof vi.spyOn&gt;;
beforeEach(() =&gt; {
  loiConsole = vi.spyOn(console, 'error').mockImplementation(() =&gt; {});
});
afterEach(() =&gt; loiConsole.mockRestore());

test('API chi tiết trả 500 ⇒ ranh giới lỗi hứng; đầu trang + điều hướng vẫn chạy; sang trang khác thì hết lỗi', async () =&gt; {
  server.use(http.get('/api/bac-si/:id', () =&gt; HttpResponse.json({ loi: 'Máy chủ đang bận, thử lại sau' }, { status: 500 })));
  const user = userEvent.setup();
  renderTrang('/bac-si/bs-9');
  const hop = await screen.findByRole('alert');
  console.info('[500] hộp lỗi:', hop.textContent);
  expect(hop).toHaveTextContent('Phần này gặp sự cố.'); // hộp của RANH GIỚI, không phải hộp lỗi riêng của trang
  console.info('[500] còn tiêu đề phòng khám?', screen.queryByRole('heading', { level: 1 }) !== null, '| còn thanh điều hướng?', screen.queryByRole('navigation') !== null);
  await user.click(screen.getByRole('link', { name: 'Lịch hẹn của tôi' }));
  expect(await screen.findByRole('heading', { name: /Lịch hẹn của tôi/ })).toBeInTheDocument();
  console.info('[500] sau khi bấm "Lịch hẹn của tôi": còn hộp lỗi?', screen.queryByText('Phần này gặp sự cố.') !== null);
  expect(screen.queryByText('Phần này gặp sự cố.')).not.toBeInTheDocument();
});

test('404 (link cũ) KHÔNG ném lên ranh giới: trang tự hiện hộp lỗi của nó', async () =&gt; {
  renderTrang('/bac-si/bs-9');
  const hop = await screen.findByRole('alert');
  console.info('[404] hộp lỗi:', hop.textContent);
  expect(hop).toHaveTextContent('Không mở được trang bác sĩ');
});

test('"Tải lại phần này" xoá lỗi trong cache query rồi gọi lại API', async () =&gt; {
  let lan = 0;
  server.use(
    http.get('/api/bac-si/:id', () =&gt; {
      lan += 1;
      if (lan === 1) return HttpResponse.json({ loi: 'Máy chủ đang bận, thử lại sau' }, { status: 500 });
      return undefined; // lần sau: handler gốc
    }),
  );
  const user = userEvent.setup();
  renderTrang('/bac-si/bs-3');
  await user.click(await screen.findByRole('button', { name: 'Tải lại phần này' }));
  expect(await screen.findByRole('heading', { name: 'BS. Lê Quốc Bảo' })).toBeInTheDocument();
  console.info('[thu lai] số lần gọi API chi tiết:', lan);
});</code></pre>
<p><code>src/components/LichHenCuaToi.test.tsx</code></p>
<pre><code class="language-tsx">import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { db } from '../mocks/co-so-du-lieu';
import { renderVoiQuery } from '../test/render';
import { LichHenCuaToi } from './LichHenCuaToi';

function coMotLich() {
  db.themLichHen({
    bacSiId: 'bs-2', khungGioId: 'bs-2-2026-10-01-1400', batDau: '2026-10-01T14:00:00+07:00', lyDo: 'Bé ho', trangThai: 'cho-xac-nhan',
    benhNhan: { hoTen: 'Nguyễn Thị Ánh', soDienThoai: '0901234567', ngaySinh: '1995-03-14' },
  });
}

test('bấm Huỷ ⇒ hộp xác nhận mở TRONG &lt;body&gt; (portal), focus ở nút an toàn', async () =&gt; {
  coMotLich();
  const user = userEvent.setup();
  const { container } = renderVoiQuery(&lt;LichHenCuaToi /&gt;);
  await user.click(await screen.findByRole('button', { name: 'Huỷ lịch lh-1' }));
  const hop = screen.getByRole('dialog', { name: 'Huỷ lịch hẹn này?' });
  console.info('[portal] hộp nằm trong vùng render của component?', container.contains(hop), '| cha trực tiếp của lớp nền:', hop.parentElement!.parentElement!.tagName);
  console.info('[portal] focus đang ở:', document.activeElement?.textContent);
  expect(container.contains(hop)).toBe(false);
  expect(screen.getByRole('button', { name: 'Không, giữ lại' })).toHaveFocus();
});

test('Escape ⇒ đóng hộp, KHÔNG huỷ, focus trả về nút Huỷ', async () =&gt; {
  coMotLich();
  const user = userEvent.setup();
  renderVoiQuery(&lt;LichHenCuaToi /&gt;);
  const nutHuy = await screen.findByRole('button', { name: 'Huỷ lịch lh-1' });
  await user.click(nutHuy);
  await user.keyboard('{Escape}');
  console.info('[escape] còn hộp?', screen.queryByRole('dialog') !== null, '| focus về:', document.activeElement?.getAttribute('aria-label'), '| trạng thái:', db.lichHen()[0].trangThai);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(nutHuy).toHaveFocus();
  expect(db.lichHen()[0].trangThai).toBe('cho-xac-nhan');
});

test('bấm "Huỷ lịch" trong hộp ⇒ PATCH, dòng hiện "Đã huỷ"', async () =&gt; {
  coMotLich();
  const user = userEvent.setup();
  renderVoiQuery(&lt;LichHenCuaToi /&gt;);
  await user.click(await screen.findByRole('button', { name: 'Huỷ lịch lh-1' }));
  await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Huỷ lịch' }));
  expect(await screen.findByText('Đã huỷ')).toBeInTheDocument(); // cập nhật lạc quan: hiện ngay
  await waitFor(() =&gt; expect(db.lichHen()[0].trangThai).toBe('da-huy'));
  console.info('[dong y] máy chủ:', db.lichHen()[0].trangThai, '| còn hộp?', screen.queryByRole('dialog') !== null);
});</code></pre>
<p><code>src/components/ChuThich.test.tsx</code></p>
<pre><code class="language-tsx">import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { ChuThich } from './ChuThich';

const hinhChuNhat = (top: number, height: number) =&gt; ({ top, bottom: top + height, left: 100, right: 124, width: 24, height, x: 100, y: top, toJSON: () =&gt; ({}) });

test('rê chuột vào ⓘ ⇒ chú thích hiện, nút được "mô tả bởi" nó; rời chuột ⇒ ẩn', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;ChuThich nhan="Giải thích giờ khám"&gt;Giờ Việt Nam (UTC+7).&lt;/ChuThich&gt;);
  const nut = screen.getByRole('button', { name: 'Giải thích giờ khám' });
  await user.hover(nut);
  expect(screen.getByRole('tooltip')).toHaveTextContent('Giờ Việt Nam (UTC+7).');
  expect(nut).toHaveAccessibleDescription('Giờ Việt Nam (UTC+7).');
  await user.unhover(nut);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('nút ở sát mép trên ⇒ lật xuống dưới; nút ở giữa trang ⇒ nằm trên', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;ChuThich nhan="Giải thích"&gt;Chữ&lt;/ChuThich&gt;);
  const nut = screen.getByRole('button', { name: 'Giải thích' });
  nut.getBoundingClientRect = () =&gt; hinhChuNhat(4, 24) as DOMRect; // jsdom không tính layout ⇒ tự cho số đo
  await user.hover(nut);
  const phiaKhiSatMep = screen.getByRole('tooltip').dataset.phia;
  await user.unhover(nut);
  nut.getBoundingClientRect = () =&gt; hinhChuNhat(300, 24) as DOMRect;
  await user.hover(nut);
  const phiaKhiOGiua = screen.getByRole('tooltip').dataset.phia;
  console.info('[tooltip] nút ở top=4 ⇒', phiaKhiSatMep, '| nút ở top=300 ⇒', phiaKhiOGiua, '| style:', screen.getByRole('tooltip').getAttribute('style'));
  expect([phiaKhiSatMep, phiaKhiOGiua]).toEqual(['duoi', 'tren']);
});

test('bàn phím: Tab tới ⓘ cũng mở chú thích (focus), Tab đi thì đóng', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;ChuThich nhan="Giải thích"&gt;Chữ&lt;/ChuThich&gt;);
  await user.tab();
  expect(screen.getByRole('tooltip')).toBeInTheDocument();
  await user.tab();
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});</code></pre>
</details>
<details><summary>Lời giải</summary>
<p><strong>Việc 1 và 2</strong> — <code>src/features/bac-si/TrangChiTietBacSi.tsx</code> (phần đầu; <code>DatLichVoiBacSi</code> giữ nguyên, chỉ thêm <code>ChuThich</code> ở việc 5):</p>
<pre><code class="language-tsx">import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ChuThich } from '../../components/ChuThich';
import { FormDatLich } from '../../components/FormDatLich';
import { LuoiGioKhung } from '../../components/KhungXuong';
import { LoiTaiDuLieu } from '../../components/LoiTaiDuLieu';
import { TEN_CHUYEN_KHOA } from '../../du-lieu/chuyen-khoa';
import { useBacSi } from '../../hooks/useBacSi';
import { useChiTietBacSi } from '../../hooks/useChiTietBacSi';
import { useDatLich } from '../../hooks/useDatLich';
import { useKhungGio } from '../../hooks/useKhungGio';
import { hienGio, hienNgay, NGAY_KHAM } from '../../logic/thoi-gian';
import type { BacSi } from '../../types';

/** Trang /bac-si/:id — giới thiệu, chọn giờ + form đặt lịch, và bác sĩ cùng chuyên khoa. */
export function TrangChiTietBacSi() {
  const { id = '' } = useParams();
  const { data: bacSi, isPending, error, refetch, isFetching } = useChiTietBacSi(id);
  const { data: tatCa } = useBacSi();
  const tieuDeRef = useRef&lt;HTMLHeadingElement&gt;(null);

  // Chương 11: đổi trang trong SPA không tải lại trang ⇒ trình đọc màn hình không biết đã sang trang mới.
  // Đưa focus lên tiêu đề mỗi khi sang bác sĩ khác: người dùng bàn phím/trình đọc màn hình bắt đầu từ đầu trang.
  useEffect(() =&gt; {
    tieuDeRef.current?.focus();
  }, [bacSi?.id]);

  if (isPending) return &lt;p aria-busy="true"&gt;Đang tải thông tin bác sĩ…&lt;/p&gt;;
  if (!bacSi) return &lt;LoiTaiDuLieu tieuDe="Không mở được trang bác sĩ" loi={error!} onThuLai={() =&gt; refetch()} dangThuLai={isFetching} /&gt;;

  const cungKhoa = (tatCa ?? []).filter((b) =&gt; b.chuyenKhoa === bacSi.chuyenKhoa &amp;&amp; b.id !== bacSi.id);
  return (
    &lt;div className="trang-bac-si"&gt;
      &lt;section className="chi-tiet" aria-label={&#96;Giới thiệu &#36;{bacSi.ten}&#96;}&gt;
        &lt;h2 ref={tieuDeRef} tabIndex={-1}&gt;
          {bacSi.ten}
        &lt;/h2&gt;
        &lt;p className="chuyen-khoa"&gt;
          {TEN_CHUYEN_KHOA[bacSi.chuyenKhoa]} · {bacSi.namKinhNghiem} năm kinh nghiệm
        &lt;/p&gt;
        &lt;p&gt;{bacSi.gioiThieu}&lt;/p&gt;
      &lt;/section&gt;
      {/* Chương 11: key = id bác sĩ ⇒ đổi bác sĩ là component MỚI, mọi state bên trong (ngày, giờ đã chọn,
          chữ trong form, "đã gửi") bắt đầu lại từ đầu. Không có key: React giữ nguyên vì cùng loại, cùng vị trí. */}
      &lt;DatLichVoiBacSi key={bacSi.id} bacSi={bacSi} /&gt;
      &lt;aside className="cung-khoa" aria-label="Bác sĩ cùng chuyên khoa"&gt;
        &lt;h3&gt;Cùng chuyên khoa&lt;/h3&gt;
        &lt;ul&gt;
          {cungKhoa.map((b) =&gt; (
            &lt;li key={b.id}&gt;
              &lt;Link to={&#96;/bac-si/&#36;{b.id}&#96;}&gt;{b.ten}&lt;/Link&gt;
            &lt;/li&gt;
          ))}
        &lt;/ul&gt;
      &lt;/aside&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>Thêm vào <code>src/App.css</code>:</p>
<pre><code class="language-css">/* tiêu đề nhận focus bằng code (tabIndex -1): không vẽ viền focus — nó không phải thứ để bấm */
[tabindex='-1']:focus { outline: none; }</code></pre>
<p><strong>Việc 3</strong> — <code>src/components/HopXacNhan.tsx</code> (giải thích từng dòng ở Bài 11.4):</p>
<pre><code class="language-tsx">import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface HopXacNhanProps {
  tieuDe: string;
  children: ReactNode;
  nhanDongY: string;
  nhanHuy?: string;
  dangXuLy?: boolean;
  onDongY: () =&gt; void;
  onDong: () =&gt; void;
}

/**
 * Hộp xác nhận (modal). Vẽ bằng createPortal vào &lt;body&gt;: không bị overflow/z-index của thẻ cha cắt mất,
 * nhưng vẫn là con của component gọi nó trong CÂY REACT (context, sự kiện nổi bọt theo cây React).
 * Mở ra ⇒ focus vào nút AN TOÀN (không phá gì). Escape hoặc bấm nền ⇒ đóng. Đóng ⇒ focus về nút đã mở hộp.
 */
export function HopXacNhan({ tieuDe, children, nhanDongY, nhanHuy = 'Không, giữ lại', dangXuLy = false, onDongY, onDong }: HopXacNhanProps) {
  const idTieuDe = useId();
  const nutAnToan = useRef&lt;HTMLButtonElement&gt;(null);

  useEffect(() =&gt; {
    const truoc = document.activeElement as HTMLElement | null; // nút "Huỷ" đã mở hộp
    nutAnToan.current?.focus();
    const khiBamPhim = (e: KeyboardEvent) =&gt; {
      if (e.key === 'Escape') onDong();
    };
    document.addEventListener('keydown', khiBamPhim);
    return () =&gt; {
      document.removeEventListener('keydown', khiBamPhim);
      truoc?.focus(); // trả focus về chỗ cũ khi hộp đóng
    };
  }, [onDong]);

  return createPortal(
    &lt;div className="nen-hop" onClick={onDong}&gt;
      &lt;div
        className="hop-xac-nhan"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTieuDe}
        onClick={(e) =&gt; e.stopPropagation()} // bấm TRONG hộp không tính là bấm nền
      &gt;
        &lt;h2 id={idTieuDe}&gt;{tieuDe}&lt;/h2&gt;
        &lt;div&gt;{children}&lt;/div&gt;
        &lt;div className="hang-nut"&gt;
          &lt;button ref={nutAnToan} type="button" className="nut" onClick={onDong} disabled={dangXuLy}&gt;
            {nhanHuy}
          &lt;/button&gt;
          &lt;button type="button" className="nut nut-nguy-hiem" onClick={onDongY} disabled={dangXuLy}&gt;
            {dangXuLy ? 'Đang xử lý…' : nhanDongY}
          &lt;/button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;,
    document.body,
  );
}</code></pre>
<p><code>src/components/LichHenCuaToi.tsx</code>:</p>
<pre><code class="language-tsx">import { useCallback, useState } from 'react';
import type { LichHenCoGio } from '../api/phong-kham';
import { useBacSi } from '../hooks/useBacSi';
import { useHuyLichHen, useLichHen } from '../hooks/useLichHen';
import { hienGio } from '../logic/thoi-gian';
import type { TrangThaiLichHen } from '../types';
import { HopXacNhan } from './HopXacNhan';
import { LoiTaiDuLieu } from './LoiTaiDuLieu';

const TEN_TRANG_THAI: Record&lt;TrangThaiLichHen, string&gt; = {
  'cho-xac-nhan': 'Chờ xác nhận',
  'da-xac-nhan': 'Đã xác nhận',
  'da-huy': 'Đã huỷ',
};

export function LichHenCuaToi() {
  const { data: lichHen, isPending, error, refetch, isFetching } = useLichHen();
  const { data: bacSi } = useBacSi();
  const huy = useHuyLichHen();
  const [canHuy, setCanHuy] = useState&lt;LichHenCoGio | null&gt;(null); // lịch đang chờ xác nhận huỷ
  const dongHop = useCallback(() =&gt; setCanHuy(null), []); // ổn định: effect của hộp không chạy lại mỗi render
  const tenBacSi = (id: string) =&gt; bacSi?.find((b) =&gt; b.id === id)?.ten ?? id;

  return (
    &lt;section className="lich-hen" aria-label="Lịch hẹn của tôi"&gt;
      &lt;h2&gt;Lịch hẹn của tôi {lichHen &amp;&amp; &#96;(&#36;{lichHen.length})&#96;}&lt;/h2&gt;
      {isPending ? (
        &lt;p className="goi-y" aria-busy="true"&gt;
          Đang tải lịch hẹn…
        &lt;/p&gt;
      ) : !lichHen ? (
        &lt;LoiTaiDuLieu tieuDe="Không tải được lịch hẹn" loi={error!} onThuLai={() =&gt; refetch()} dangThuLai={isFetching} /&gt;
      ) : lichHen.length === 0 ? (
        &lt;p className="goi-y"&gt;Chưa có lịch hẹn nào.&lt;/p&gt;
      ) : (
        &lt;ul&gt;
          {lichHen.map((lh) =&gt; (
            &lt;li key={lh.id} className={lh.trangThai}&gt;
              &lt;strong&gt;{tenBacSi(lh.bacSiId)}&lt;/strong&gt; · {hienGio(lh.batDau)} ·{' '}
              {lh.benhNhan.hoTen} · &lt;span className="trang-thai"&gt;{TEN_TRANG_THAI[lh.trangThai]}&lt;/span&gt;
              {lh.trangThai === 'cho-xac-nhan' &amp;&amp; (
                &lt;button type="button" className="nut nut-nho" onClick={() =&gt; setCanHuy(lh)} aria-label={&#96;Huỷ lịch &#36;{lh.id}&#96;}&gt;
                  Huỷ
                &lt;/button&gt;
              )}
            &lt;/li&gt;
          ))}
        &lt;/ul&gt;
      )}
      {canHuy &amp;&amp; (
        &lt;HopXacNhan
          tieuDe="Huỷ lịch hẹn này?"
          nhanDongY="Huỷ lịch"
          onDong={dongHop}
          onDongY={() =&gt; {
            huy.mutate(canHuy);
            setCanHuy(null);
          }}
        &gt;
          &lt;p&gt;
            {tenBacSi(canHuy.bacSiId)} · {hienGio(canHuy.batDau)} · {canHuy.benhNhan.hoTen}
          &lt;/p&gt;
          &lt;p&gt;Khung giờ sẽ được mở lại cho người khác đặt.&lt;/p&gt;
        &lt;/HopXacNhan&gt;
      )}
    &lt;/section&gt;
  );
}</code></pre>
<p>CSS của hộp:</p>
<pre><code class="language-css">.nen-hop { position: fixed; inset: 0; background: rgb(15 23 42 / .55); display: grid; place-items: center; z-index: 100; }
.hop-xac-nhan { background: #fff; border-radius: 14px; padding: 18px 22px; width: min(420px, 92vw); box-shadow: 0 20px 50px rgb(0 0 0 / .3); }
.hop-xac-nhan h2 { margin: 0 0 8px; font-size: 19px; }
.hop-xac-nhan p { margin: 4px 0; color: #334155; font-size: 14px; }
.hop-xac-nhan .hang-nut { justify-content: flex-end; margin-top: 14px; }
.nut-nguy-hiem { background: #be123c; border-color: #be123c; color: #fff; }</code></pre>
<p><strong>Việc 4</strong> — <code>src/components/RanhGioiLoi.tsx</code>:</p>
<pre><code class="language-tsx">import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onThuLai?: () =&gt; void;
  /** Chương 11: một trong các giá trị này đổi (vd đường dẫn) ⇒ tự xoá lỗi, vẽ lại children. */
  resetKeys?: readonly unknown[];
}
interface State {
  loi: Error | null;
}

/**
 * Error boundary ("ranh giới lỗi"): bắt lỗi ném ra LÚC RENDER ở mọi component con, vẽ màn dự phòng
 * thay vì để cả trang trắng. React 19 vẫn CHƯA có cách viết nó bằng function ⇒ đây là chỗ hiếm hoi
 * còn dùng class component (hoặc cài gói react-error-boundary — nó bọc đúng class này).
 */
export class RanhGioiLoi extends Component&lt;Props, State&gt; {
  state: State = { loi: null };

  static getDerivedStateFromError(loi: Error): State {
    return { loi }; // lần render sau vẽ màn dự phòng
  }

  componentDidUpdate(truoc: Props) {
    // Đang hiện màn lỗi mà người dùng đã đi chỗ khác (resetKeys đổi) ⇒ cho children một cơ hội mới.
    const doi = (truoc.resetKeys ?? []).some((k, i) =&gt; !Object.is(k, this.props.resetKeys?.[i]));
    if (this.state.loi &amp;&amp; doi) this.setState({ loi: null });
  }

  componentDidCatch(loi: Error, info: ErrorInfo) {
    console.error('[RanhGioiLoi]', loi.message, info.componentStack?.split('\\n')[1]?.trim()); // app thật: gửi về Sentry…
  }

  render() {
    if (this.state.loi) {
      return (
        &lt;div className="hop-loi" role="alert"&gt;
          &lt;p&gt;
            &lt;strong&gt;Phần này gặp sự cố.&lt;/strong&gt;
          &lt;/p&gt;
          &lt;p&gt;{this.state.loi.message}&lt;/p&gt;
          &lt;button
            type="button"
            className="nut"
            onClick={() =&gt; {
              this.props.onThuLai?.();
              this.setState({ loi: null });
            }}
          &gt;
            Tải lại phần này
          &lt;/button&gt;
        &lt;/div&gt;
      );
    }
    return this.props.children;
  }
}</code></pre>
<p><code>src/features/khung/BoCuc.tsx</code>:</p>
<pre><code class="language-tsx">import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { RanhGioiLoi } from '../../components/RanhGioiLoi';
import { VungThongBao } from '../../components/VungThongBao';

/** Layout chung: đầu trang + thanh điều hướng + &lt;Outlet /&gt; (trang con vẽ vào đây) + chân trang. */
export function BoCuc() {
  const { pathname } = useLocation();
  const { reset } = useQueryErrorResetBoundary(); // "Thử lại" của ranh giới lỗi phải xoá cả lỗi đang nhớ trong query
  return (
    &lt;&gt;
      &lt;Header /&gt;
      &lt;nav className="thanh-dieu-huong" aria-label="Điều hướng chính"&gt;
        &lt;NavLink to="/" end&gt;
          Trang chủ
        &lt;/NavLink&gt;
        &lt;NavLink to="/bac-si"&gt;Bác sĩ&lt;/NavLink&gt;
        &lt;NavLink to="/lich-hen"&gt;Lịch hẹn của tôi&lt;/NavLink&gt;
      &lt;/nav&gt;
      &lt;main className="noi-dung"&gt;
        {/* Chương 11: sang đường dẫn khác ⇒ ranh giới tự xoá lỗi (resetKeys). KHÔNG dùng key={pathname}:
            key sẽ gỡ + dựng lại CẢ TRANG mỗi lần đổi đường dẫn, kể cả khi chẳng có lỗi nào. */}
        &lt;RanhGioiLoi resetKeys={[pathname]} onThuLai={reset}&gt;
          &lt;Outlet /&gt;
        &lt;/RanhGioiLoi&gt;
      &lt;/main&gt;
      &lt;Footer /&gt;
      &lt;VungThongBao /&gt;
    &lt;/&gt;
  );
}</code></pre>
<p><code>src/hooks/useChiTietBacSi.ts</code>:</p>
<pre><code class="language-ts">import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LoiApi } from '../api/http';
import { khoa } from '../api/khoa';
import { api } from '../api/phong-kham';
import type { BacSi } from '../types';

/**
 * Một bác sĩ theo id (trang /bac-si/:id). Danh sách đã tải thì LẤY SẴN từ cache của danh sách (initialData):
 * bấm vào một bác sĩ là trang hiện ngay, không nháy "Đang tải…".
 */
export function useChiTietBacSi(id: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: khoa.chiTietBacSi(id),
    queryFn: ({ signal }) =&gt; api.bacSi(id, signal),
    staleTime: 5 * 60_000,
    initialData: () =&gt; queryClient.getQueryData&lt;BacSi[]&gt;(khoa.bacSi)?.find((b) =&gt; b.id === id),
    initialDataUpdatedAt: () =&gt; queryClient.getQueryState(khoa.bacSi)?.dataUpdatedAt,
    // Chương 11: 404 là chuyện BÌNH THƯỜNG của trang này (link cũ) ⇒ trang tự hiện hộp lỗi.
    // Lỗi khác (500, mất mạng) ⇒ NÉM LÊN error boundary gần nhất, đừng để trang tự xoay xở.
    throwOnError: (loi) =&gt; !(loi instanceof LoiApi &amp;&amp; loi.status === 404),
  });
}</code></pre>
<p><code>src/main.tsx</code> (phần mới):</p>
<pre><code class="language-tsx">/** Chương 11: MỘT chỗ nhận mọi lỗi render — app thật gửi về Sentry/máy chủ log thay cho console. */
function baoLoi(loai: string) {
  return (loi: unknown, info: { componentStack?: string }) =&gt; {
    const dong = info.componentStack?.trim().split('\\n')[0] ?? '';
    console.error(&#96;[&#36;{loai}]&#96;, loi instanceof Error ? loi.message : loi, dong);
  };
}

batApiGia().then(() =&gt; {
  createRoot(document.getElementById('root')!, {
    onCaughtError: baoLoi('da-bat'), // lỗi đã có error boundary hứng
    onUncaughtError: baoLoi('khong-ai-bat'), // lỗi không ai hứng ⇒ React gỡ CẢ app
  }).render(
    &lt;StrictMode&gt;
      &lt;QueryClientProvider client={queryClient}&gt;
        &lt;App /&gt;
      &lt;/QueryClientProvider&gt;
    &lt;/StrictMode&gt;,
  );
});</code></pre>
<p>Để tự xem trên trình duyệt, thêm một dòng vào handler <code>GET /api/bac-si/:id</code> trong <code>src/mocks/handlers.ts</code>, rồi mở <code>/bac-si/bs-1?loi=chi-tiet</code>:</p>
<pre><code class="language-ts">
  http.get('/api/bac-si/:id', async ({ params }) =&gt; {
    await treMang();
    if (dieuKhien.loi.has('chi-tiet')) return loi500(); // Chương 11: xem ranh giới lỗi làm việc
    const bs = db.bacSi().find((b) =&gt; b.id === params.id);
    if (!bs) return HttpResponse.json({ loi: &#96;Không có bác sĩ &#36;{String(params.id)}&#96; }, { status: 404 });
    return HttpResponse.json(bs);
  }),</code></pre>
<p><strong>Việc 5</strong> — <code>src/components/ChuThich.tsx</code>:</p>
<pre><code class="language-tsx">import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ViTri = { top: number; left: number; phia: 'tren' | 'duoi' };
const KHE = 8; // khoảng cách giữa nút và chú thích (px)

/**
 * Chú thích nổi (tooltip) cạnh một nút ⓘ. Mặc định nằm TRÊN nút; không đủ chỗ phía trên thì lật XUỐNG DƯỚI.
 * Muốn biết "đủ chỗ không" phải ĐO chiều cao thật của chú thích ⇒ phải vẽ nó ra trước rồi mới đo được.
 * useLayoutEffect: đo + đặt lại vị trí TRƯỚC khi trình duyệt vẽ ⇒ người dùng không bao giờ thấy vị trí sai.
 */
export function ChuThich({ nhan, children }: { nhan: string; children: ReactNode }) {
  const [mo, setMo] = useState(false);
  const [viTri, setViTri] = useState&lt;ViTri | null&gt;(null);
  const nutRef = useRef&lt;HTMLButtonElement&gt;(null);
  const hopRef = useRef&lt;HTMLDivElement&gt;(null);
  const id = useId();

  useLayoutEffect(() =&gt; {
    if (!mo || !nutRef.current || !hopRef.current) return;
    const nut = nutRef.current.getBoundingClientRect();
    const hop = hopRef.current.getBoundingClientRect();
    const phia = nut.top - hop.height - KHE &gt;= 0 ? 'tren' : 'duoi';
    const left = Math.max(KHE, Math.min(nut.left + nut.width / 2 - hop.width / 2, window.innerWidth - hop.width - KHE));
    setViTri({ phia, left, top: phia === 'tren' ? nut.top - hop.height - KHE : nut.bottom + KHE });
  }, [mo]);

  function dong() {
    setMo(false);
    setViTri(null);
  }

  return (
    &lt;&gt;
      &lt;button
        ref={nutRef}
        type="button"
        className="nut-chu-thich"
        aria-label={nhan}
        aria-describedby={mo ? id : undefined}
        onMouseEnter={() =&gt; setMo(true)}
        onMouseLeave={dong}
        onFocus={() =&gt; setMo(true)}
        onBlur={dong}
      &gt;
        ⓘ
      &lt;/button&gt;
      {mo &amp;&amp;
        createPortal(
          &lt;div
            ref={hopRef}
            id={id}
            role="tooltip"
            className="chu-thich-noi"
            data-phia={viTri?.phia}
            style={{ top: viTri?.top ?? 0, left: viTri?.left ?? 0 }}
          &gt;
            {children}
          &lt;/div&gt;,
          document.body,
        )}
    &lt;/&gt;
  );
}</code></pre>
<pre><code class="language-css">.nut-chu-thich { font: inherit; font-size: 15px; border: 0; background: none; color: #0e7490; cursor: help; padding: 0 4px; }
.chu-thich-noi { position: fixed; max-width: 260px; background: #0f172a; color: #fff; font-size: 13px; line-height: 1.45; border-radius: 8px; padding: 8px 10px; z-index: 90; pointer-events: none; }</code></pre>
<p>Và trong <code>DatLichVoiBacSi</code>:</p>
<pre><code class="language-tsx">  return (
    &lt;section className="luong" aria-label="Đặt lịch với bác sĩ này"&gt;
      &lt;h3&gt;
        Giờ khám
        &lt;ChuThich nhan="Giải thích giờ khám"&gt;
          Giờ theo giờ Việt Nam (UTC+7). Khung ghi “kín” là đã có người đặt; lịch bị huỷ thì khung mở lại.
        &lt;/ChuThich&gt;
      &lt;/h3&gt;</code></pre>
<p>Kiểm lần cuối trên máy dựng bài:</p>
<div class="out">$ npx tsc -b
$ npx vitest run
 Test Files  28 passed (28)
      Tests  121 passed (121)
$ npx vite build
✓ 520 modules transformed.
dist/assets/index-BLlLlWaS.js    490.01 kB │ gzip: 152.57 kB
✓ built in 1.20s</div>
</details>


<h3>Kiểm bằng mắt: bốn ảnh chụp mong đợi</h3>
<p>Test xanh chưa phải là xong: jsdom không vẽ, không đo bố cục, không có <code>&lt;dialog&gt;</code> thật. Chạy <code>npm run dev</code> và làm lại bốn cảnh dưới đây trên trình duyệt của bạn; ảnh của bạn nên giống các ảnh chụp Chromium thật này.</p>
${slide('rx-11', 11, 'Trước và sau khi thêm key: trang BS. Huy sau khi đặt với BS. An')}
<p><strong>Cảnh 1 — đổi bác sĩ.</strong> Mở <code>/bac-si/bs-1</code>, chọn 08:00, điền form, bấm "Đặt lịch", rồi bấm "BS. Hoàng Đức Huy" ở cột phải. Mong đợi: form của BS. Huy trắng, không có thông báo "đã gửi", và focus nằm trên tên bác sĩ (nhấn Tab một lần: focus sang nút ⓘ cạnh "Giờ khám", và chú thích hiện ra).</p>
${slide('rx-11', 22, 'Hộp xác nhận huỷ lịch: portal, focus vào nút an toàn, Escape')}
<p><strong>Cảnh 2 — huỷ lịch.</strong> Sang "Lịch hẹn của tôi", bấm "Huỷ". Mong đợi: hộp "Huỷ lịch hẹn này?" giữa màn hình trên lớp nền tối, focus ở "Không, giữ lại"; nhấn Escape thì hộp đóng và focus về đúng nút "Huỷ" vừa bấm; mở lại, bấm "Huỷ lịch" thì dòng thành "Đã huỷ" ngay (cập nhật lạc quan).</p>
${slide('rx-11', 24, 'Ranh giới lỗi chỉ bắt lỗi lúc render — không bắt onClick')}
<p><strong>Cảnh 3 — máy chủ lỗi.</strong> Mở <code>/bac-si/bs-1?loi=chi-tiet</code>. Mong đợi: vài giây "Đang tải…" (TanStack thử lại ba lần — trên máy dựng bài màn dự phòng hiện sau 8,5 giây), rồi "Phần này gặp sự cố." dưới đầu trang và menu vẫn bấm được; console có một dòng <code>[da-bat] Máy chủ đang bận, thử lại sau</code>; bấm "Lịch hẹn của tôi" thì hộp lỗi biến mất.</p>
${SD.loi500Vi}
<p><strong>Cảnh 4 — chú thích.</strong> Rê chuột vào ⓘ cạnh "Giờ khám": chú thích hiện ngay phía trên, không nháy ở góc màn hình. Muốn thấy phiên bản nháy để so, đọc lại phép đo 20/20 ở Bài 11.3.</p>

<h3>Sai lầm hay gặp của cả chương</h3>
${slide('rx-11', 25, 'Sai lầm hay gặp ở Chương 11')}
<p>Sáu lỗi dưới đây là thứ code review ở công ty bắt nhiều nhất trong nhóm chủ đề này. Mỗi lỗi đi kèm con số chương đã đo, để bạn nhận ra nó khi gặp lại:</p>
<ol>
<li><strong><code>key = index</code> hoặc <code>key={Math.random()}</code>.</strong> Index làm state trượt khi xoá/thêm/sắp xếp (xoá An, "tái khám" chạy sang Hà); random làm mọi dòng mount lại mỗi render. Dùng id ổn định.</li>
<li><strong>Khai component bên trong component.</strong> Mỗi render là một loại mới: gõ "huy", ô chỉ còn "h", focus ở <code>BODY</code>, 2 lần mount. Khai ở cấp module.</li>
<li><strong>Reset state bằng <code>useEffect</code>.</strong> Luôn có một lần render sai (<code>bs-5:"ab"</code> trước <code>bs-5:""</code>). Dùng <code>key</code> trên component cần làm lại.</li>
<li><strong>Gỡ StrictMode cho "hết chạy hai lần".</strong> Bug vẫn ở đó: listener quên dọn vẫn chạy thêm 2 lần sau khi component bị gỡ. Viết cleanup.</li>
<li><strong>Đo bố cục trong <code>useEffect</code>.</strong> Máy nhanh không thấy gì (0/20), máy chậm thì 20/20 khung hình đầu vẽ sai chỗ. Đo rồi đặt lại vị trí trong <code>useLayoutEffect</code>.</li>
<li><strong>Tưởng ranh giới lỗi bắt mọi thứ.</strong> Lỗi trong <code>onClick</code> đi thẳng ra <code>window</code>, màn hình không đổi gì. Xử lý tại chỗ, hoặc bắt → setState → ném lại lúc render; lỗi API dùng <code>throwOnError</code>.</li>
</ol>
<div class="pitfall co-tieu-de"><strong>Bẫy — sửa việc 4 bằng <code>key={pathname}</code> trên ranh giới lỗi.</strong> Nhanh, gọn, và test "đổi trang là hết lỗi" xanh. Nhưng key đổi ở <em>mọi</em> lần điều hướng, nên cả trang bị gỡ và dựng lại kể cả khi không có lỗi nào — và vì nó gỡ luôn <code>DatLichVoiBacSi</code> mỗi lần sang bác sĩ khác, nó <strong>che mất</strong> việc 1: ba test key sẽ xanh dù bạn quên <code>key={bacSi.id}</code>. Giống hệt cái bẫy "màn hình Đang tải… làm hộ việc của key" ở Bài 11.2. Đo thật: đổi <code>BoCuc</code> sang <code>key={pathname}</code> và bỏ <code>key={bacSi.id}</code> đi, <code>npx vitest run src/features</code> vẫn ra <code>Tests  8 passed (8)</code>. Dùng <code>resetKeys</code>, chỉ can thiệp khi đang có lỗi.</div>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202, một tính năng "xong" khi bấm thử trên máy mình thấy chạy và kịp demo cho giảng viên; test (nếu có) viết sau cùng, và đề bài không có tiêu chí nghiệm thu → Ở công ty, một ticket thường đi kèm <strong>tiêu chí nghiệm thu</strong> (acceptance criteria), và cách chắc nhất để chứng minh đã đạt là test chạy đỏ trước khi sửa, xanh sau khi sửa — như bảy test đỏ → mười bốn test xanh của bài này — cộng một lượt tự kiểm bằng mắt trên trình duyệt thật trước khi mở pull request. · <em>Vì sao:</em> các bug của chương này (form mang dữ liệu cũ, hộp bị cắt, trang trắng) không làm test "có hiện ra không" đỏ; chỉ test mô tả đúng hành vi mới bắt được, và người review cần bằng chứng hơn là lời hứa. Demo-trước-test không sai khi làm bài tập nhỏ — nhưng đó là thói quen phải bỏ trước khi đi thực tập.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Kể một bug khó bạn từng sửa, và bạn tìm ra nó thế nào."</p>
<p>Một câu trả lời tốt có ba phần: triệu chứng người dùng thấy, nguyên nhân gốc, và cách chứng minh đã sửa. Ví dụ từ chương này: "Trang chi tiết bác sĩ dùng chung một route; sau khi đặt lịch với bác sĩ A rồi sang bác sĩ B, trang B báo 'đã gửi' và nếu bấm đặt thì gửi khung giờ của A. Nguyên nhân: React giữ component form vì cùng loại, cùng vị trí — state gắn với vị trí, không gắn với bác sĩ; bug bị che lâu vì trước đó trang có màn 'Đang tải…' vô tình gỡ form, tới khi thêm initialData thì lộ. Em viết ba test mô tả hành vi đúng, thấy đỏ, sửa bằng <code>key={bacSi.id}</code>, thấy xanh." Người phỏng vấn nghe ra bạn hiểu reconciliation, biết test, và biết nghi ngờ những thứ "tự nhiên chạy".</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Đề bài:</strong> một lượt tự kiểm chỉ dùng bàn phím — cách nhanh nhất để thấy ba trong năm việc có thật sự chạy.</p><ol>
<li>Chạy <code>npm run dev</code>, mở <code>/bac-si/bs-1</code>, rút chuột ra (hoặc đừng chạm vào nó).</li>
<li>Chỉ dùng Tab, Shift+Tab, Enter, Escape: mở chú thích giờ khám, chọn một giờ, điền form, đặt lịch; sang "BS. Hoàng Đức Huy"; vào "Lịch hẹn của tôi", mở hộp huỷ, đóng bằng Escape, mở lại và huỷ.</li>
<li>Viết thêm một test cho <code>LichHenCuaToi</code>: bấm nền tối (lớp <code>.nen-hop</code>) thì hộp đóng mà lịch không bị huỷ; bấm vào chữ trong hộp thì hộp không đóng.</li>
</ol><p><strong>Đạt khi:</strong> bước 2 làm được hết mà không cần chuột, và mỗi lần đóng hộp bạn thấy khung focus quay về đúng nút "Huỷ"; test bước 3 xanh cùng 14 test tiêu chí; <code>npx tsc -b</code> sạch.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">acceptance criteria (tiêu chí nghiệm thu)</span><span class="v">điều kiện kiểm được để coi một việc là xong; ở đây là 14 test + 4 ảnh</span></div>
<div class="kv"><span class="k">red → green (đỏ → xanh)</span><span class="v">viết test mô tả điều phải đúng, thấy nó hỏng, rồi sửa tới khi qua</span></div>
<div class="kv"><span class="k">regression (hồi quy)</span><span class="v">bug cũ quay lại sau một thay đổi khác; test tiêu chí giữ nó không quay lại</span></div>
<div class="kv"><span class="k">focus management (quản lý focus)</span><span class="v">quyết định focus nằm đâu sau điều hướng, mở/đóng hộp thoại</span></div>
<div class="kv"><span class="k">optimistic update (cập nhật lạc quan)</span><span class="v">hiện kết quả ngay, gửi lên máy chủ sau, lỗi thì hoàn tác (Chương 6)</span></div>
<div class="kv"><span class="k">route-level boundary (ranh giới theo route)</span><span class="v">ranh giới lỗi quanh nội dung từng trang, reset khi đổi đường dẫn</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Năm nâng cấp: <code>key={bacSi.id}</code> cho khu đặt lịch, focus tiêu đề bằng ref, hộp xác nhận huỷ bằng portal, ranh giới lỗi có <code>resetKeys</code> + <code>throwOnError</code> + <code>onCaughtError</code>, chú thích đo bằng <code>useLayoutEffect</code>.</li>
<li>Tiêu chí: điểm xuất phát 7 đỏ / 1 xanh; xong thì 4 file, 14 test xanh; cả dự án 28 file, 121 test xanh; <code>tsc</code> sạch; build được.</li>
<li>Test xanh chưa đủ: bốn cảnh kiểm bằng mắt trên trình duyệt thật, vì jsdom không vẽ và không đo.</li>
<li>Đừng để một cơ chế khác "làm hộ" việc của key: màn "Đang tải…" hay <code>key={pathname}</code> đều có thể che bug của việc 1.</li>
<li>Sáu sai lầm hay gặp đều có con số đã đo trong chương — nhớ con số để nhận ra lỗi.</li>
</ul>

<a class="link-card" href="https://react.dev/learn/preserving-and-resetting-state" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Preserving and Resetting State</span><span class="lc-sub">Nền của việc 1.</span></span></a>
<a class="link-card" href="https://react.dev/learn/manipulating-the-dom-with-refs" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Manipulating the DOM with Refs</span><span class="lc-sub">Nền của việc 2.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react-dom/createPortal" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — createPortal</span><span class="lc-sub">Nền của việc 3.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/Component" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Component (Error Boundary)</span><span class="lc-sub">Nền của việc 4.</span></span></a>
<a class="link-card" href="https://react.dev/reference/react/useLayoutEffect" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — useLayoutEffect</span><span class="lc-sub">Nền của việc 5.</span></span></a>
</div>
`,
  },
  {
    title: '11.6 — Chapter 11 quiz|||11.6 — Kiểm tra Chương 11',
    slug: 'rx-11-6-kiem-tra',
    type: 'QUIZ',
    isFreePreview: true,
    description: 'Mười câu tình huống trên đúng những gì Chương 11 đã đo: DOM đổi bao nhiêu, batching, khác loại thẻ, key reset state, key = index, component lồng, StrictMode, useRef, useLayoutEffect, portal và error boundary.',
    content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>What Chapter 11 measured</h2>
<p class="lead">Ten questions, fifteen minutes. Nearly every question gives a real situation from the chapter and asks for a number or what the screen shows: how many DOM changes, how many renders, what text is left in an input, where focus is, what the first frame paints. Every answer is something the chapter actually ran — a few are traps that look right until you remember a line of output.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can name the four phases Trigger → Render → Commit → Paint and tell "renders a lot" from "commits a lot".</li>
<li>I can explain reconciliation’s two assumptions and why changing a wrapper tag loses state.</li>
<li>I can use <code>key</code> to reset state when data changes, and point out the bugs of <code>key = index</code> and nested component definitions.</li>
<li>I know what StrictMode re-runs in development, and can write effects with cleanups that survive it.</li>
<li>I choose correctly between state and <code>useRef</code>, and between <code>useEffect</code> and <code>useLayoutEffect</code>.</li>
<li>I can build a dialog with a portal and place an error boundary that knows how to reset.</li>
</ul>
${slide('rx-11', 26, 'Chapter 11 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Chương 11 đã đo được gì</h2>
<p class="lead">Mười câu, mười lăm phút. Gần như câu nào cũng đưa một tình huống có thật trong chương và hỏi con số hay màn hình ra sao: DOM đổi mấy chỗ, render mấy lần, ô nhập còn chữ gì, focus nằm ở đâu, khung hình đầu tiên vẽ gì. Mọi đáp án là thứ chương đã chạy thật — có vài câu là bẫy, trông đúng cho tới khi bạn nhớ lại một dòng output.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi kể được bốn pha Trigger → Render → Commit → Paint và phân biệt được "render nhiều" với "commit nhiều".</li>
<li>Tôi giải thích được hai giả định của reconciliation và vì sao đổi thẻ bọc làm mất state.</li>
<li>Tôi dùng được <code>key</code> để reset state khi đổi dữ liệu, và chỉ ra được bug của <code>key = index</code> và của component khai lồng.</li>
<li>Tôi biết StrictMode chạy thêm những gì ở dev, và viết được effect có cleanup chịu được điều đó.</li>
<li>Tôi chọn đúng giữa state và <code>useRef</code>, giữa <code>useEffect</code> và <code>useLayoutEffect</code>.</li>
<li>Tôi dựng được hộp thoại bằng portal, và đặt được ranh giới lỗi biết reset.</li>
</ul>
${slide('rx-11', 26, 'Bảng tra nhanh Chương 11')}
</div>
`,
    quiz: {
      timeLimitSeconds: 900,
      questions: [
        {
          question: 'BangDem shows “Lượt xem: 0” and six TheNho cards. You click “+1 lượt xem” once. BangDem re-renders and all six TheNho re-render. A MutationObserver watches the container. How many DOM changes does it record?|||BangDem hiện “Lượt xem: 0” và sáu thẻ TheNho. Bạn bấm “+1 lượt xem” một lần. BangDem render lại và cả sáu TheNho render lại. Một MutationObserver theo dõi vùng chứa. Nó ghi được bao nhiêu thay đổi DOM?',
          options: ['7 — one per component that rendered|||7 — mỗi component render là một', '6 — one per card|||6 — mỗi thẻ một', '1 — the text node “0” becomes “1”|||1 — nút chữ “0” thành “1”', '0 — React only changes its virtual DOM|||0 — React chỉ đổi virtual DOM'],
          correctIndex: 2,
          points: 1,
          explanation: 'EN: Lesson 11.1 measured exactly 1 change (characterData "0" → "1"), and the first <li> was still the same DOM node. “7” is tempting because 7 components rendered — but render is just calling functions; commit only touches what differs, and the six cards returned identical JSX.|||VI: Bài 11.1 đo được đúng 1 thay đổi (characterData "0" → "1"), và thẻ <li> đầu vẫn là nút DOM cũ. “7” hấp dẫn vì có 7 component render — nhưng render chỉ là gọi hàm; commit chỉ đụng chỗ khác, mà sáu thẻ trả về JSX y hệt.',
        },
        {
          question: 'In React 19, a click handler calls setTimeout(() => { setA(a + 1); setB(b + 1); setC(c + 1); }, 0). How many times does the component render when the timeout fires?|||Ở React 19, handler click gọi setTimeout(() => { setA(a + 1); setB(b + 1); setC(c + 1); }, 0). Khi hẹn giờ chạy, component render bao nhiêu lần?',
          options: ['1|||1', '3|||3', '2 — one for the click, one for the timeout|||2 — một cho click, một cho setTimeout', '0 — updates inside setTimeout are ignored|||0 — cập nhật trong setTimeout bị bỏ qua'],
          correctIndex: 0,
          points: 1,
          explanation: 'EN: Automatic batching (React 18+) groups updates made in the same tick anywhere, including timeouts and promises: measured “trong setTimeout: 1 lần render”. “3” is what React 17 and earlier did outside React event handlers — a real answer for old code, wrong for React 18/19.|||VI: Automatic batching (React 18+) gom mọi cập nhật trong cùng một nhịp ở bất cứ đâu, kể cả setTimeout và Promise: đo được “trong setTimeout: 1 lần render”. “3” là cách React 17 trở về trước làm ở ngoài handler sự kiện — đúng với code cũ, sai với React 18/19.',
        },
        {
          question: '{noiBat ? <section><ONhap /></section> : <div><ONhap /></div>} — ONhap keeps its text in useState. You type “đau đầu”, then tick “Nổi bật”. What is in the input?|||{noiBat ? <section><ONhap /></section> : <div><ONhap /></div>} — ONhap giữ chữ bằng useState. Bạn gõ “đau đầu” rồi tick “Nổi bật”. Ô nhập chứa gì?',
          options: ['“đau đầu” — ONhap is the same component in both branches|||“đau đầu” — cả hai nhánh đều là ONhap', '“đau đầu”, but the input is a new DOM node|||“đau đầu”, nhưng ô nhập là nút DOM mới', 'An error: React cannot switch tags|||Lỗi: React không đổi được thẻ', 'Empty — the whole branch was unmounted and remounted|||Trống — cả nhánh bị gỡ rồi dựng lại'],
          correctIndex: 3,
          points: 1,
          explanation: 'EN: A different type (div → section) in the same spot makes React discard the whole branch, including ONhap and its state: measured “” and “cùng nút DOM? false”. The first option is tempting because ONhap appears in both branches, but identity is decided from the top down — once the parent type differs, nothing below is compared.|||VI: Khác loại (div → section) ở cùng chỗ khiến React vứt cả nhánh, gồm cả ONhap và state của nó: đo được “” và “cùng nút DOM? false”. Phương án đầu hấp dẫn vì cả hai nhánh đều có ONhap, nhưng danh tính xét từ trên xuống — cha đã khác loại thì bên dưới không được so nữa.',
        },
        {
          question: 'The doctor page renders <DatLichVoiBacSi bacSi={bacSi} /> with NO key. You book successfully with Dr An, then click “BS. Hoàng Đức Huy” in the same-specialty column (the doctor comes from cache, no loading screen). What does Huy’s page show?|||Trang bác sĩ render <DatLichVoiBacSi bacSi={bacSi} /> KHÔNG có key. Bạn đặt lịch thành công với BS. An, rồi bấm “BS. Hoàng Đức Huy” ở cột cùng chuyên khoa (bác sĩ lấy từ cache, không có màn tải). Trang của Huy hiện gì?',
          options: ['An empty booking form for Dr Huy|||Form đặt lịch trắng cho BS. Huy', '“Đã gửi yêu cầu đặt lịch với BS. Hoàng Đức Huy…”|||“Đã gửi yêu cầu đặt lịch với BS. Hoàng Đức Huy…”', '“Đã gửi yêu cầu đặt lịch với BS. Nguyễn Minh An…”|||“Đã gửi yêu cầu đặt lịch với BS. Nguyễn Minh An…”', 'A 404 page, because the slot belongs to Dr An|||Trang 404, vì khung giờ thuộc về BS. An'],
          correctIndex: 1,
          points: 1,
          explanation: 'EN: Same type, same spot ⇒ React keeps DatLichVoiBacSi and useForm’s isSubmitSuccessful = true, while the bacSi prop is new — so the success text names Huy although the server only has An’s booking (measured, and screenshotted). Option 3 is tempting, but the text is computed from the current props. key={bacSi.id} fixes it.|||VI: Cùng loại, cùng chỗ ⇒ React giữ DatLichVoiBacSi và isSubmitSuccessful = true của useForm, còn props bacSi là mới — nên câu báo thành công mang tên Huy dù máy chủ chỉ có lịch của An (đo và chụp ảnh thật). Phương án 3 hấp dẫn, nhưng câu chữ được tính từ props hiện tại. key={bacSi.id} sửa được.',
        },
        {
          question: 'Three note rows (An, Hà, Bảo) rendered with key={index}. An’s row holds “tái khám”, Hà’s holds “bé sốt”. You delete An’s row. What does Hà’s row show?|||Ba dòng ghi chú (An, Hà, Bảo) render với key={index}. Dòng An chứa “tái khám”, dòng Hà chứa “bé sốt”. Bạn xoá dòng An. Dòng của Hà hiện gì?',
          options: ['“bé sốt”|||“bé sốt”', 'Empty|||Trống', '“tái khám”|||“tái khám”', 'React throws a duplicate-key error|||React báo lỗi trùng key'],
          correctIndex: 2,
          points: 1,
          explanation: 'EN: Key 0 still exists after the deletion, so React keeps the component at key 0 with its “tái khám” state and just gives it Hà’s props; key 2 disappears, so the last row is removed. Measured: Hà=“tái khám”, Bảo=“bé sốt”. “bé sốt” is what you get with key={bs.id}.|||VI: Sau khi xoá, key 0 vẫn còn nên React giữ component ở key 0 cùng state “tái khám” và chỉ đổi props thành Hà; key 2 biến mất nên dòng cuối bị gỡ. Đo được: Hà=“tái khám”, Bảo=“bé sốt”. “bé sốt” là kết quả khi dùng key={bs.id}.',
        },
        {
          question: 'function OTimLongNhau() { const [q, setQ] = useState(""); function OTim() { return <input value={q} onChange={(e) => setQ(e.target.value)} />; } return <OTim />; } — you click the input and type “huy”. What does the input contain?|||function OTimLongNhau() { const [q, setQ] = useState(""); function OTim() { return <input value={q} onChange={(e) => setQ(e.target.value)} />; } return <OTim />; } — bạn bấm vào ô và gõ “huy”. Ô chứa gì?',
          options: ['“h”|||“h”', '“huy”|||“huy”', 'Empty|||Trống', '“yuh” — the cursor jumps to the start|||“yuh” — con trỏ nhảy về đầu'],
          correctIndex: 0,
          points: 1,
          explanation: 'EN: Each render creates a new OTim function, so React sees a new type and remounts the input: the new input shows “h” but focus falls to <body>, and “u”, “y” go nowhere. Measured: “h”, 2 mounts, focus on BODY. “huy” is what the module-level version gives.|||VI: Mỗi lần render tạo hàm OTim mới nên React thấy loại mới và dựng lại ô nhập: ô mới có “h” nhưng focus rơi về <body>, “u”, “y” đi lạc. Đo được: “h”, 2 lần mount, focus ở BODY. “huy” là kết quả của bản khai ở cấp module.',
        },
        {
          question: 'In development with <StrictMode>, a component’s effect logs “chạy” when it runs and “dọn” in its cleanup. What is logged right after the component mounts (nothing else happens)?|||Ở chế độ dev có <StrictMode>, effect của một component in “chạy” khi chạy và “dọn” trong cleanup. Ngay sau khi component mount (không có gì khác xảy ra), log in ra gì?',
          options: ['chạy|||chạy', 'chạy → chạy|||chạy → chạy', 'dọn → chạy|||dọn → chạy', 'chạy → dọn → chạy|||chạy → dọn → chạy'],
          correctIndex: 3,
          points: 1,
          explanation: 'EN: StrictMode gives every effect one extra clean up → run cycle at mount, to check the cleanup works: measured “effect chạy | effect dọn | effect chạy” in Chromium dev. “chạy” alone is what the production build (vite build + preview) logged — and what you get without StrictMode.|||VI: StrictMode cho mỗi effect thêm một vòng dọn → chạy lúc mount để kiểm cleanup: đo được “effect chạy | effect dọn | effect chạy” trên Chromium ở dev. Chỉ “chạy” là thứ bản production (vite build + preview) in ra — và là kết quả khi không có StrictMode.',
        },
        {
          question: 'const soLan = useRef(0); a button does soLan.current += 1, and the JSX shows <p>Đã bấm: {soLan.current}</p>. After three clicks, what does the screen show and how many times did the component render (including mount)?|||const soLan = useRef(0); một nút làm soLan.current += 1, JSX hiện <p>Đã bấm: {soLan.current}</p>. Sau ba lần bấm, màn hình hiện gì và component render bao nhiêu lần (tính cả mount)?',
          options: ['“Đã bấm: 3”, 4 renders|||“Đã bấm: 3”, 4 lần render', '“Đã bấm: 0”, 1 render|||“Đã bấm: 0”, 1 lần render', '“Đã bấm: 3”, 1 render|||“Đã bấm: 3”, 1 lần render', '“Đã bấm: 1”, 2 renders|||“Đã bấm: 1”, 2 lần render'],
          correctIndex: 1,
          points: 1,
          explanation: 'EN: Writing to ref.current does not queue a render, so the component rendered once (at mount) and the screen still shows 0 even though the ref holds 3 — measured. “3, 4 renders” is the useState version. Values shown on screen belong in state.|||VI: Ghi vào ref.current không xếp hàng render nào, nên component chỉ render một lần (lúc mount) và màn hình vẫn là 0 dù ref đang giữ 3 — đo thật. “3, 4 lần render” là bản useState. Thứ hiện lên màn hình phải là state.',
        },
        {
          question: 'A tooltip measures itself and sets its position in an effect. Rendering is artificially slowed to 100 ms. In Chromium, with useEffect, what does the first painted frame show — and with useLayoutEffect?|||Một tooltip tự đo rồi đặt vị trí trong effect. Render bị làm chậm 100 ms. Trên Chromium, với useEffect khung hình đầu tiên được vẽ hiện gì — còn với useLayoutEffect?',
          options: ['Both paint the right position — React is too fast to notice|||Cả hai đều vẽ đúng chỗ — React đủ nhanh', 'useEffect: the unmeasured tooltip at top 0 (20/20 runs); useLayoutEffect: the right position (0/20 wrong)|||useEffect: tooltip chưa đo ở top 0 (20/20 lần); useLayoutEffect: đúng chỗ (0/20 lần sai)', 'useLayoutEffect paints wrong because it runs before commit|||useLayoutEffect vẽ sai vì chạy trước commit', 'Both paint the wrong position once|||Cả hai đều vẽ sai một lần'],
          correctIndex: 1,
          points: 1,
          explanation: 'EN: useLayoutEffect runs synchronously after commit and before paint, so the corrected render is committed before the first frame; useEffect lets the browser paint first, and after a 100 ms render a frame is due: measured 20/20 wrong frames vs 0/20. Option 1 is half true — with a fast render both measured 0/20 — which is exactly why the bug only shows on slow devices.|||VI: useLayoutEffect chạy đồng bộ sau commit và trước khi vẽ, nên bản đã sửa được commit trước khung đầu tiên; useEffect để trình duyệt vẽ trước, và sau 100 ms render thì đã tới hạn một khung: đo được 20/20 khung sai so với 0/20. Phương án 1 đúng một nửa — render nhanh thì cả hai đều 0/20 — và đó chính là lý do bug chỉ lộ trên máy chậm.',
        },
        {
          question: '<RanhGioiLoi> wraps a button whose onClick does throw new Error("Lỗi trong onClick"). The user clicks it. What happens?|||<RanhGioiLoi> bọc một nút có onClick là throw new Error("Lỗi trong onClick"). Người dùng bấm. Chuyện gì xảy ra?',
          options: ['The boundary shows “Phần này gặp sự cố.”|||Ranh giới hiện “Phần này gặp sự cố.”', 'The whole app is unmounted, blank page|||Cả app bị gỡ, trang trắng', 'Nothing changes on screen; the error goes to window as an uncaught error|||Màn hình không đổi gì; lỗi đi thẳng ra window như lỗi không ai bắt', 'React retries the click once|||React tự bấm lại một lần'],
          correctIndex: 2,
          points: 1,
          explanation: 'EN: Error boundaries only catch errors during render, lifecycles and effects; an event handler runs outside render, so the boundary never sees it — measured: no alert, the error reached the window error listener. The first option happens only if you catch it, setState, and rethrow during render (NemTrongHandlerCoBat).|||VI: Ranh giới lỗi chỉ bắt lỗi lúc render, lifecycle và effect; handler sự kiện chạy ngoài render nên ranh giới không bao giờ thấy — đo được: không có hộp báo, lỗi tới listener error của window. Phương án đầu chỉ xảy ra khi bạn bắt lỗi, setState rồi ném lại trong lúc render (NemTrongHandlerCoBat).',
        },
      ],
    },
  },
  ],
};
