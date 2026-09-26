import { gallery, slide } from './_slides.mjs';

/**
 * React — Chương 1: Component và props (soạn chi tiết 25/09/2026, thay chương KHUNG trong react.mjs).
 * GIỮ: title chương + slug rx-1-1-component, rx-1-2-props, rx-1-3-danh-sach, rx-1-4-chia-nho (type LESSON).
 * THÊM: rx-1-0-slides (DOCUMENT, đầu chương), rx-1-5-kiem-tra (QUIZ).
 * Mọi output trong bài là THẬT, chạy 25/09/2026 trên máy dựng bài, dự án thử `phong-kham`
 * (react 19.3.0 · vite 8.3.1 · typescript 6.0.3 · vitest 5.0.1 · @testing-library/react 16.3.3 · jsdom).
 * Deck: scripts/slides-src/rx-01.mjs (29 slide). Ảnh chụp giao diện: scripts/slides-src/rx-anh/rx-01/.
 */

/* ─── Sơ đồ mermaid trong bài (≤ 10 nút, nhãn ngắn; khối EN nhãn tiếng Anh, khối VI nhãn tiếng Việt) ─── */
const H = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '&#96;').replace(/\$\{/g, '&#36;{');
/** Sơ đồ mermaid: trang học đọc textContent của <code class="language-mermaid"> rồi vẽ (LearnPageClient → mermaidRuntime). */
const MM = (src) => '<pre><code class="language-mermaid">' + H(src.trim()) + '</code></pre>';
const L = (...dong) => MM(dong.join('\n'));
const SD = {
  phaRenderEn: L(
    "flowchart TB",
    "  T[\"Trigger: first load, or later a state change\"] --> R[\"Render: React calls App, Header, DanhSachBacSi, TheBacSi × 6\"]",
    "  R --> C[\"Commit: change the real DOM only where it differs\"]",
    "  C --> P[\"Paint: the browser draws the pixels\"]",
    "  S[\"Development + StrictMode: each component called twice, one result kept\"] -.-> R",
  ),
  phaRenderVi: L(
    "flowchart TB",
    "  T[\"Trigger: lần tải đầu, hoặc sau này một lần đổi state\"] --> R[\"Render: React gọi App, Header, DanhSachBacSi, TheBacSi × 6\"]",
    "  R --> C[\"Commit: chỉ sửa DOM thật ở chỗ khác nhau\"]",
    "  C --> P[\"Paint: trình duyệt vẽ điểm ảnh\"]",
    "  S[\"Lúc phát triển + StrictMode: mỗi component bị gọi hai lần, giữ một kết quả\"] -.-> R",
  ),
  thuanKhietEn: L(
    "flowchart TB",
    "  Q{{\"Does this line change something that existed before the call?\"}}",
    "  Q -->|\"no: local variables, building JSX\"| B[\"Fine in the component body\"]",
    "  Q -->|\"yes: outside variable, a prop, an API call, localStorage, document.title\"| W{{\"When should it happen?\"}}",
    "  W -->|\"when the user does something\"| H[\"Event handler (Chapter 2)\"]",
    "  W -->|\"to stay in sync while on screen\"| E[\"Effect (Chapter 4)\"]",
  ),
  thuanKhietVi: L(
    "flowchart TB",
    "  Q{{\"Dòng này có sửa thứ đã tồn tại trước khi hàm được gọi?\"}}",
    "  Q -->|\"không: biến cục bộ, dựng JSX\"| B[\"Được, để trong thân component\"]",
    "  Q -->|\"có: biến bên ngoài, prop, gọi API, localStorage, document.title\"| W{{\"Nên xảy ra khi nào?\"}}",
    "  W -->|\"khi người dùng làm gì đó\"| H[\"Handler sự kiện (Chương 2)\"]",
    "  W -->|\"để khớp liên tục khi đang hiện\"| E[\"Effect (Chương 4)\"]",
  ),
  longTrongEn: L(
    "flowchart TB",
    "  A[\"FormSai renders again after the click\"] --> B[\"function ONhap runs again: a NEW function\"]",
    "  B --> C{{\"Same component type at this place as last render?\"}}",
    "  C -->|\"no: a different function\"| D[\"React unmounts the old input and mounts a new, empty one\"]",
    "  D --> E[\"The typed text đau đầu is gone\"]",
    "  C -->|\"yes: ONhap declared outside, as in FormDung\"| F[\"React keeps the input: the text stays\"]",
  ),
  longTrongVi: L(
    "flowchart TB",
    "  A[\"FormSai render lại sau cú bấm\"] --> B[\"function ONhap chạy lại: một hàm MỚI\"]",
    "  B --> C{{\"Cùng loại component ở vị trí này như lần trước?\"}}",
    "  C -->|\"không: hàm khác\"| D[\"React gỡ ô input cũ, gắn một ô mới rỗng\"]",
    "  D --> E[\"Chữ đau đầu vừa gõ mất sạch\"]",
    "  C -->|\"có: ONhap khai báo bên ngoài, như FormDung\"| F[\"React giữ ô input: chữ còn nguyên\"]",
  ),
  propsEn: L(
    "flowchart TB",
    "  P[\"Parent writes: TheBacSi bacSi={bs} noiBat\"] --> O[\"Compiled: _jsx(TheBacSi, { bacSi: bs, noiBat: true })\"]",
    "  O --> R[\"React calls TheBacSi with that ONE object as its argument\"]",
    "  R --> D[\"The child destructures it: { bacSi, noiBat }\"]",
    "  D --> J[\"It returns JSX that reads bacSi.ten\"]",
  ),
  propsVi: L(
    "flowchart TB",
    "  P[\"Cha viết: TheBacSi bacSi={bs} noiBat\"] --> O[\"Biên dịch thành: _jsx(TheBacSi, { bacSi: bs, noiBat: true })\"]",
    "  O --> R[\"React gọi TheBacSi với MỘT object đó làm đối số\"]",
    "  R --> D[\"Con tách nó ra: { bacSi, noiBat }\"]",
    "  D --> J[\"Con trả JSX đọc bacSi.ten\"]",
  ),
  childrenEn: L(
    "flowchart TB",
    "  U[\"Khung tieuDe = Giờ mở cửa, with two p elements between the tags\"] --> P[\"props = { tieuDe, children: the two p elements }\"]",
    "  P --> K[\"Khung returns: section, h2 with tieuDe, then {children}\"]",
    "  K --> S[\"The two p elements appear exactly where {children} is\"]",
  ),
  childrenVi: L(
    "flowchart TB",
    "  U[\"Khung tieuDe = Giờ mở cửa, giữa hai thẻ có hai phần tử p\"] --> P[\"props = { tieuDe, children: hai phần tử p }\"]",
    "  P --> K[\"Khung trả về: section, h2 chứa tieuDe, rồi {children}\"]",
    "  K --> S[\"Hai phần tử p hiện đúng chỗ {children}\"]",
  ),
  sortEn: L(
    "flowchart TB",
    "  C[\"Parent: danhSachBacSi, order bs-1 … bs-6\"] -->|\"prop danhSach: the SAME array\"| K[\"TheoKinhNghiemSai calls .sort()\"]",
    "  K -->|\"reorders it in place\"| C",
    "  C --> O[\"Every other user of the array now sees bs-6, bs-4, bs-1 …\"]",
    "  C -->|\"prop danhSach\"| T[\"Correct version: .toSorted()\"]",
    "  T --> N[\"A new sorted array, the parent keeps bs-1 … bs-6\"]",
  ),
  sortVi: L(
    "flowchart TB",
    "  C[\"Cha: danhSachBacSi, thứ tự bs-1 … bs-6\"] -->|\"prop danhSach: CÙNG một mảng\"| K[\"TheoKinhNghiemSai gọi .sort()\"]",
    "  K -->|\"xếp lại ngay trên mảng đó\"| C",
    "  C --> O[\"Mọi nơi khác dùng mảng giờ thấy bs-6, bs-4, bs-1 …\"]",
    "  C -->|\"prop danhSach\"| T[\"Bản đúng: .toSorted()\"]",
    "  T --> N[\"Một mảng mới đã xếp, cha vẫn giữ bs-1 … bs-6\"]",
  ),
  mapEn: L(
    "flowchart TB",
    "  D[\"danhSach: an array of BacSi objects\"] --> E{{\"danhSach.length === 0?\"}}",
    "  E -->|\"yes\"| X[\"Early return: Chưa có bác sĩ nào.\"]",
    "  E -->|\"no\"| M[\"danhSach.map: each bs becomes TheBacSi with key = bs.id\"]",
    "  M --> A[\"An array of 6 elements\"]",
    "  A --> R[\"Rendered in order inside div.luoi-bac-si\"]",
  ),
  mapVi: L(
    "flowchart TB",
    "  D[\"danhSach: mảng các object BacSi\"] --> E{{\"danhSach.length === 0?\"}}",
    "  E -->|\"đúng\"| X[\"return sớm: Chưa có bác sĩ nào.\"]",
    "  E -->|\"sai\"| M[\"danhSach.map: mỗi bs thành TheBacSi với key = bs.id\"]",
    "  M --> A[\"Một mảng 6 phần tử\"]",
    "  A --> R[\"Vẽ theo thứ tự trong div.luoi-bac-si\"]",
  ),
  ghepKeyEn: L(
    "flowchart TB",
    "  subgraph K[\"key = bs.id\"]",
    "    direction TB",
    "    K1[\"Before: bs-1 = An, with the note\"] -->|\"bs-1 still exists\"| K2[\"React moves row bs-1 with its input\"]",
    "    K2 --> K3[\"bs-7 Tâm gets a new empty row ✓\"]",
    "  end",
    "  subgraph I[\"key = index, insert Tâm at the top\"]",
    "    direction TB",
    "    I1[\"Before: key 0 = An, with note dị ứng penicillin\"] -->|\"after: key 0 = Tâm\"| I2[\"React: same key 0, keep the row and its input, change the name\"]",
    "    I2 --> I3[\"The note now sits next to Tâm ✗\"]",
    "  end",
  ),
  ghepKeyVi: L(
    "flowchart TB",
    "  subgraph K[\"key = bs.id\"]",
    "    direction TB",
    "    K1[\"Trước: bs-1 = An, có ghi chú\"] -->|\"bs-1 vẫn còn\"| K2[\"React dời dòng bs-1 cùng ô input\"]",
    "    K2 --> K3[\"bs-7 Tâm được một dòng mới rỗng ✓\"]",
    "  end",
    "  subgraph I[\"key = index, chèn Tâm lên đầu\"]",
    "    direction TB",
    "    I1[\"Trước: key 0 = An, có ghi chú dị ứng penicillin\"] -->|\"sau: key 0 = Tâm\"| I2[\"React: cùng key 0, giữ dòng và ô input, chỉ đổi tên\"]",
    "    I2 --> I3[\"Ghi chú giờ nằm cạnh Tâm ✗\"]",
    "  end",
  ),
  chonKeyEn: L(
    "flowchart TB",
    "  Q{{\"Can the list ever reorder, filter, insert or delete, or do its rows hold state?\"}}",
    "  Q -->|\"yes, or not sure\"| I{{\"Does the data have an id?\"}}",
    "  I -->|\"yes\"| A[\"key = the id from the data, e.g. bs.id\"]",
    "  I -->|\"no, the client creates the items\"| B[\"Give each item an id when it is created: crypto.randomUUID()\"]",
    "  Q -->|\"no, a static list\"| C[\"The index is acceptable\"]",
    "  X[\"Never: Math.random() in JSX, or a name such as bs.ten\"]",
  ),
  chonKeyVi: L(
    "flowchart TB",
    "  Q{{\"Danh sách có bao giờ đổi thứ tự, lọc, chèn, xoá, hoặc dòng có giữ state?\"}}",
    "  Q -->|\"có, hoặc không chắc\"| I{{\"Dữ liệu có sẵn id?\"}}",
    "  I -->|\"có\"| A[\"key = id trong dữ liệu, vd bs.id\"]",
    "  I -->|\"không, phía client tự tạo phần tử\"| B[\"Gán id lúc TẠO phần tử: crypto.randomUUID()\"]",
    "  Q -->|\"không, danh sách tĩnh\"| C[\"Dùng index được\"]",
    "  X[\"Không bao giờ: Math.random() trong JSX, hay tên như bs.ten\"]",
  ),
  cayEn: L(
    "flowchart TB",
    "  subgraph R[\"Render tree: what React builds\"]",
    "    direction TB",
    "    RA[\"App\"] --> RH[\"Header\"]",
    "    RA --> RD[\"DanhSachBacSi\"]",
    "    RA --> RF[\"Footer\"]",
    "    RD --> RT[\"TheBacSi × 6: bs-1 … bs-6\"]",
    "  end",
    "  subgraph M[\"Module tree: which file imports which\"]",
    "    direction TB",
    "    MA[\"App.tsx\"] --> MD[\"DanhSachBacSi.tsx\"]",
    "    MD --> MT[\"TheBacSi.tsx, imported once\"]",
    "  end",
  ),
  cayVi: L(
    "flowchart TB",
    "  subgraph R[\"Cây render: thứ React dựng ra\"]",
    "    direction TB",
    "    RA[\"App\"] --> RH[\"Header\"]",
    "    RA --> RD[\"DanhSachBacSi\"]",
    "    RA --> RF[\"Footer\"]",
    "    RD --> RT[\"TheBacSi × 6: bs-1 … bs-6\"]",
    "  end",
    "  subgraph M[\"Cây module: file nào import file nào\"]",
    "    direction TB",
    "    MA[\"App.tsx\"] --> MD[\"DanhSachBacSi.tsx\"]",
    "    MD --> MT[\"TheBacSi.tsx, import một lần\"]",
    "  end",
  ),
  tachEn: L(
    "flowchart TB",
    "  Q1{{\"Does it repeat?\"}} -->|\"yes, like the six cards\"| S[\"Make it a component\"]",
    "  Q1 -->|\"no\"| Q2{{\"Can you name its job in two or three words?\"}}",
    "  Q2 -->|\"no, only its looks\"| K[\"Keep it inside the parent\"]",
    "  Q2 -->|\"yes\"| Q3{{\"Worth testing alone, or a long file with a clear seam?\"}}",
    "  Q3 -->|\"yes\"| S",
    "  Q3 -->|\"no\"| K",
  ),
  tachVi: L(
    "flowchart TB",
    "  Q1{{\"Nó có lặp lại không?\"}} -->|\"có, như sáu thẻ\"| S[\"Tách thành component\"]",
    "  Q1 -->|\"không\"| Q2{{\"Gọi được tên việc của nó bằng hai ba chữ?\"}}",
    "  Q2 -->|\"không, chỉ tả được hình dáng\"| K[\"Để nguyên trong cha\"]",
    "  Q2 -->|\"được\"| Q3{{\"Đáng test riêng, hoặc file dài có đường cắt rõ?\"}}",
    "  Q3 -->|\"có\"| S",
    "  Q3 -->|\"không\"| K",
  ),
  motChieuEn: L(
    "flowchart TB",
    "  DL[\"du-lieu/bac-si.ts: danhSachBacSi\"] -->|\"import\"| A[\"App\"]",
    "  A -->|\"prop danhSach\"| D[\"DanhSachBacSi\"]",
    "  D -->|\"props bacSi, noiBat\"| T[\"TheBacSi\"]",
    "  API[\"Chapter 6: an API through TanStack Query\"] -.->|\"only the source changes\"| A",
    "  T -.->|\"Chapter 2: calls a function the parent passed down\"| A",
  ),
  motChieuVi: L(
    "flowchart TB",
    "  DL[\"du-lieu/bac-si.ts: danhSachBacSi\"] -->|\"import\"| A[\"App\"]",
    "  A -->|\"prop danhSach\"| D[\"DanhSachBacSi\"]",
    "  D -->|\"props bacSi, noiBat\"| T[\"TheBacSi\"]",
    "  API[\"Chương 6: API qua TanStack Query\"] -.->|\"chỉ đổi nguồn\"| A",
    "  T -.->|\"Chương 2: gọi hàm mà cha đưa xuống\"| A",
  ),
};

export default {
  title: 'Chapter 1 — Components and props|||Chương 1 — Component và props',
  description: 'Chia giao diện thành component: component là hàm thuần, props có kiểu TypeScript, children, danh sách với key ổn định, tư duy từ mock-up tới cây component — và dựng trang chủ phòng khám An Tâm có test.',
  lessons: [

    /* ─────────────────────────── 1.0 ─────────────────────────── */
    {
      title: '1.0 — Chapter 1 slides: components and props in pictures|||1.0 — Slide Chương 1: component và props bằng hình',
      slug: 'rx-1-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 29 slide của Chương 1: component là hàm, tên viết hoa, thuần khiết trong StrictMode, props có kiểu, children, bẫy số 0, danh sách và key, bug key={index} chụp thật, cây component trang chủ và test bằng Testing Library.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Slides</span>
<h2>The whole chapter in 29 slides</h2>
<p class="lead">Section 0 gave you a Vite + TypeScript project and a static home page written in JSX. This chapter cuts that page into components — small functions that receive data through props — and ends with the clinic&#39;s home page listing six doctors, each piece typed and tested. Skim the slides first to see the shape; come back after the quiz to revise.</p>
<p>Slides 3–8 belong to Lesson 1.1 (components as functions), 9–14 to 1.2 (props and their TypeScript types), 15–20 to 1.3 (lists and keys), and 21–26 to 1.4 (thinking in components, and testing them). The last three are the chapter&#39;s common mistakes, a cheat sheet and the "keep building the project" task. Every terminal on the slides is real output recorded on 25 September 2026 (React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.1), and the three browser pictures are real screenshots taken with Chromium from the course&#39;s practice project — including the classic <code>key={index}</code> bug caught in the act.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Slide</span>
<h2>Cả chương trong 29 slide</h2>
<p class="lead">Mục 0 cho bạn một dự án Vite + TypeScript và một trang chủ tĩnh viết bằng JSX. Chương này cắt trang đó thành các component (thành phần) — những hàm nhỏ nhận dữ liệu qua props — và kết thúc bằng trang chủ phòng khám liệt kê sáu bác sĩ, mảnh nào cũng có kiểu và có test. Lướt bộ slide trước để nắm hình dạng; làm xong bài kiểm tra thì quay lại đây để ôn.</p>
<p>Slide 3–8 thuộc Bài 1.1 (component là hàm), 9–14 thuộc 1.2 (props và kiểu TypeScript), 15–20 thuộc 1.3 (danh sách và key), 21–26 thuộc 1.4 (tư duy theo component, và test chúng). Ba slide cuối là những sai lầm hay gặp, bảng tra nhanh và đề "tự gõ tiếp dự án". Mọi terminal trên slide là output THẬT ghi ngày 25/09/2026 (React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.1); ba hình trình duyệt là ảnh chụp thật bằng Chromium từ dự án thực hành của khoá — trong đó có bug kinh điển <code>key={index}</code> bị bắt quả tang.</p>
</div>
${gallery('rx-01', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Component là một hàm trả về JSX'], [4, 'Tên viết hoa là component, viết thường là thẻ HTML'], [5, 'Mỗi component một file'],
  [6, 'React tự gọi hàm của bạn ở pha Render'], [7, 'Component phải thuần: #2, #4, #6'], [8, 'Định nghĩa component bên trong component'],
  [9, 'Props là một object cha đưa xuống con'], [10, 'Kiểu props: interface, dấu ?, mặc định'], [11, 'tsc bắt lỗi props'],
  [12, 'children'], [13, 'Bẫy số 0'], [14, 'Props chỉ đọc: .sort() đảo mảng của cha'],
  [15, 'map: mảng dữ liệu thành mảng JSX'], [16, 'Quên key: cảnh báo trên console'], [17, 'Bug key={index} chụp thật'],
  [18, 'React ghép cũ/mới theo key'], [19, 'Chọn nguồn key'], [20, 'key đặt ở đâu, key không phải prop'],
  [21, 'Từ mock-up tới hộp'], [22, 'Cây component trang chủ'], [23, 'Tách khi nào, không tách khi nào'],
  [24, 'Dữ liệu đi một chiều'], [25, 'Test component bằng Testing Library'], [26, 'Thiếu cleanup: 12 thay vì 6'],
  [27, 'Sai lầm hay gặp'], [28, 'Bảng tra nhanh'], [29, 'Tự gõ tiếp dự án'],
])}
`,
    },

    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — Components are functions: naming, one file each, and staying pure|||1.1 — Component là hàm: đặt tên, mỗi file một component, và giữ cho thuần khiết',
      slug: 'rx-1-1-component',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Component là hàm trả về JSX: vì sao tên phải viết hoa (đo bằng tsc và console thật), tách mỗi component một file với export có tên, React gọi hàm của bạn lúc nào, component thuần khiết (StrictMode ra #2 #4 #6), và bẫy định nghĩa component bên trong component.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Components are functions: naming, one file each, and staying pure</h2>
<p class="lead">A React component is a JavaScript function that returns JSX. That one sentence explains most of this lesson: why its name must start with a capital letter, why it lives in its own file, why React — not you — decides when to call it, and why it must behave like a formula: same input, same output, no side effects.</p>

<p>At the end of Section 0 your <code>App.tsx</code> was one function that returned the whole home page: the clinic name, the opening hours, a paragraph or two. That works for a page with ten lines. It stops working the day the page has a header, a footer, six doctor cards and a booking form, because one function that returns everything is one function you have to read in full every time you change anything. Components are how React lets you cut a page into pieces you can name, read, reuse and test one at a time.</p>
<p>Everything in this lesson was run on the course&#39;s practice project <code>phong-kham</code> (React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.1) on 25 September 2026. When a snippet is marked "wrong", the error message below it is the one TypeScript or React really printed.</p>

<h3>A component is a function that returns JSX</h3>
${slide('rx-01', 3, 'A component is a JavaScript function that returns JSX')}
<p>Here is the first component of the clinic app. It is the top strip of the page, moved out of <code>App.tsx</code> into its own file:</p>
<pre><code class="language-tsx">// src/components/Header.tsx
export function Header() {
  return (
    &lt;header className="header"&gt;
      &lt;h1&gt;Phòng khám An Tâm&lt;/h1&gt;
      &lt;p&gt;Mở cửa 7:30–20:00, thứ Hai đến thứ Bảy&lt;/p&gt;
    &lt;/header&gt;
  );
}</code></pre>
<p>Read it line by line:</p>
<ul>
<li><code>function Header() { … }</code> — an ordinary JavaScript function. It takes no arguments yet (Lesson 1.2 adds props).</li>
<li><code>return ( … )</code> — the parentheses only let the JSX start on the next line. Without them, a <code>return</code> followed by a line break returns <code>undefined</code> — JavaScript inserts a semicolon after a bare <code>return</code>.</li>
<li>The JSX must have <strong>one root</strong>: here the <code>&lt;header&gt;</code>. Two siblings at the top need a wrapper or a Fragment <code>&lt;&gt;…&lt;/&gt;</code> (Section 0, lesson on JSX).</li>
<li><code>className</code>, not <code>class</code> — JSX is JavaScript, and <code>class</code> is a reserved word there.</li>
<li><code>export</code> — makes the function visible to other files. Without it, <code>App.tsx</code> cannot import it.</li>
</ul>
<p>And here is how <code>App.tsx</code> uses it:</p>
<pre><code class="language-tsx">// src/App.tsx
import { Header } from './components/Header';

export default function App() {
  return (
    &lt;&gt;
      &lt;Header /&gt;
      &lt;main className="noi-dung"&gt;…&lt;/main&gt;
    &lt;/&gt;
  );
}</code></pre>
<p>You never write <code>Header()</code> yourself. You write <code>&lt;Header /&gt;</code> — a tag with the function&#39;s name — and React calls the function when it needs to know what that part of the screen looks like. What the function returns is not HTML and not DOM: it is a small JavaScript object that <em>describes</em> the UI. React compares that description with what is on screen and changes the real DOM only where they differ.</p>
<div class="callout"><p><strong>JS quick reminder: <code>function</code> vs arrow function.</strong> <code>export function Header() { … }</code> and <code>export const Header = () =&gt; { … };</code> both create a function named <code>Header</code>. React treats them the same. This course uses <code>function</code> declarations for components because the name appears first and error stack traces show it clearly; you will see arrow functions in many codebases, and that is fine. What matters is the capital letter and the <code>export</code>.</p></div>

<h3>The capital letter is the one rule React reads from the name</h3>
${slide('rx-01', 4, 'Capitalised names are components, lowercase names are HTML tags')}
<p>JSX is not understood by the browser. Before your code runs, the build step (Vite, using the TypeScript/Oxc JSX transform) turns every tag into a function call. The transform looks at exactly one thing to decide what kind of call: <strong>the first letter of the tag name</strong>. We asked TypeScript 6.0.3 to compile a small component so you can see it:</p>
<pre><code class="language-tsx">export function DanhSach() {
  return (
    &lt;section&gt;
      &lt;Header /&gt;
      &lt;header&gt;Phòng khám An Tâm&lt;/header&gt;
      &lt;TheBacSi bacSi={bs} noiBat /&gt;
    &lt;/section&gt;
  );
}</code></pre>
<p>Output of <code>ts.transpileModule(…, { jsx: ReactJSX })</code>, unedited:</p>
<div class="out">import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function DanhSach() {
    return (_jsxs("section", { children: [_jsx(Header, {}), _jsx("header", { children: "Ph\\u00F2ng kh\\u00E1m An T\\u00E2m" }), _jsx(TheBacSi, { bacSi: bs, noiBat: true })] }));
}</div>
<p>Look at the difference between <code>_jsx(Header, {})</code> and <code>_jsx("header", …)</code>. A capitalised tag becomes a reference to <strong>your function</strong>; a lowercase tag becomes a <strong>string</strong>, the name of an HTML element. That is the whole rule. So what happens if you name a component with a lowercase letter?</p>
<pre><code class="language-tsx">function theBacSi() {
  return &lt;article&gt;BS. Nguyễn Minh An&lt;/article&gt;;
}

export function DanhSach() {
  return &lt;theBacSi /&gt;;
}</code></pre>
<p>TypeScript refuses first:</p>
<div class="out">$ npx tsc -b
src/vi-du/LoiChuThuong.tsx(1,10): error TS6133: 'theBacSi' is declared but its value is never read.
src/vi-du/LoiChuThuong.tsx(6,10): error TS2339: Property 'theBacSi' does not exist on type 'JSX.IntrinsicElements'.</div>
<p>Both errors say the same thing from two sides: the function <code>theBacSi</code> is never used, because <code>&lt;theBacSi /&gt;</code> is read as an HTML element name, and there is no HTML element called <code>theBacSi</code> (<code>JSX.IntrinsicElements</code> is TypeScript&#39;s list of built-in tags). To see what the browser would do, we silenced the error with <code>// @ts-expect-error</code> and rendered it in a Vitest test with jsdom:</p>
<div class="out">DOM: &lt;thebacsi&gt;&lt;/thebacsi&gt;
console.error: [
  '&lt;theBacSi /&gt; is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.',
  'The tag &lt;theBacSi&gt; is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.'
]</div>
<p>The page gets an empty, unknown element <code>&lt;thebacsi&gt;</code>. Your function never ran — the doctor&#39;s name is nowhere. Without TypeScript, the only clue is two lines in the console, easy to miss among others. With TypeScript, you cannot even build. Name every component in <strong>PascalCase</strong>: <code>Header</code>, <code>TheBacSi</code>, <code>DanhSachBacSi</code>.</p>

<h3>One component per file, named exports, imports where it is used</h3>
${slide('rx-01', 5, 'One component per file, named exports, imports where used')}
<p>By the end of this chapter the practice project looks like this:</p>
<pre><code class="language-bash">src/
  types.ts                 # shared types: BacSi, ChuyenKhoa, … (fixed for the whole course)
  du-lieu/bac-si.ts        # six sample doctors
  du-lieu/chuyen-khoa.ts   # 'noi' → 'Nội tổng quát', …
  components/
    Header.tsx
    Footer.tsx
    TheBacSi.tsx           # + TheBacSi.test.tsx
    DanhSachBacSi.tsx      # + DanhSachBacSi.test.tsx
  App.tsx                  # + App.test.tsx
  main.tsx                 # createRoot(…).render(&lt;App /&gt;)</code></pre>
<p>The conventions most React teams use in 2026, and why:</p>
<ul>
<li><strong>One component per file, file named after the component.</strong> <code>TheBacSi.tsx</code> exports <code>TheBacSi</code>. When a bug report says "the doctor card shows the wrong specialty", you know which file to open without searching.</li>
<li><strong>Named exports</strong> (<code>export function Header</code>) rather than <code>export default</code>. With a named export the importer must use the real name — <code>import { Header } from …</code> — so a rename in your editor updates every import, and a search for "Header" finds every use. A default export can be imported under any name, which is how a project ends up with <code>Header</code>, <code>AppHeader</code> and <code>TopBar</code> all meaning the same file. The template&#39;s <code>App.tsx</code> keeps its default export because <code>main.tsx</code> expects it; that is fine.</li>
<li><strong>Small helpers can share a file.</strong> A tiny component used only by <code>TheBacSi</code> may live in <code>TheBacSi.tsx</code> without an <code>export</code>. Once a second file needs it, move it out.</li>
<li><strong>The folder is <code>src/components/</code> for now.</strong> Chapter 7 moves to a folder per feature (<code>src/features/bac-si/…</code>) once the app has several pages; starting simple is deliberate.</li>
</ul>
<div class="callout"><p><strong>JS quick reminder: <code>import</code> / <code>export</code>.</strong> Every <code>.ts</code>/<code>.tsx</code> file is a module with its own scope: nothing inside is visible outside unless it is <code>export</code>ed. <code>import { Header } from './components/Header'</code> means "from the file <code>./components/Header.tsx</code>, give me the export named <code>Header</code>" — the braces are required for named exports, and the extension can be left out. <code>import App from './App'</code> (no braces) takes the <em>default</em> export. <code>import type { BacSi } from './types'</code> imports only a TypeScript type, which disappears after compilation — Lesson 1.2 explains why this project insists on the word <code>type</code>.</p></div>

<h3>React calls your function — during the Render phase, and possibly many times</h3>
${slide('rx-01', 6, 'React calls your function in the Render phase, maybe many times')}
<p>Each time the screen might need to change, React goes through four steps. You will meet them in every chapter of this course, so learn their names now:</p>
<ol>
<li><strong>Trigger</strong> — something asks for an update: the first load (<code>createRoot(…).render(&lt;App /&gt;)</code> in <code>main.tsx</code>), or later a state change (Chapter 2).</li>
<li><strong>Render</strong> — React <em>calls your component functions</em> to get fresh JSX. Calling <code>App</code> leads to calling <code>Header</code>, <code>DanhSachBacSi</code>, six times <code>TheBacSi</code>, and so on down the tree. Nothing on screen changes in this step.</li>
<li><strong>Commit</strong> — React compares the new JSX with the previous one and changes the real DOM only where they differ.</li>
<li><strong>Paint</strong> — the browser draws the pixels.</li>
</ol>
<p>"Render" in React therefore means "call the component function", not "draw on screen". That is why the word appears so often: <em>re-render</em> (render again) means React calls your function again. And in development, inside <code>&lt;StrictMode&gt;</code> — which the Vite template puts in <code>main.tsx</code> — React deliberately calls each component <strong>twice</strong> per render and keeps only one result. It costs nothing in production (Strict Mode has no effect there) and it exposes a whole class of bugs, as the next section shows.</p>
${SD.phaRenderEn}

<h3>Components must be pure: measured with Strict Mode</h3>
${slide('rx-01', 7, 'A pure component: the impure version prints #2, #4, #6')}
<p>A <strong>pure</strong> function (hàm thuần) has two properties: given the same inputs it returns the same output, and it changes nothing that existed before it was called. <code>double(2)</code> is 4 every time, and calling it does not change any variable elsewhere. React assumes your components are pure in this sense, because it calls them whenever it likes, as often as it likes. Here is a component that breaks the rule — it counts visitors by increasing a variable that lives outside it:</p>
<pre><code class="language-tsx">// src/vi-du/ThuanKhiet.tsx
let soKhach = 0;

export function KhachSai() {
  soKhach = soKhach + 1; // ❌ changes something outside the component
  return &lt;p&gt;Khách số #{soKhach}&lt;/p&gt;;
}

// Pure version: the number comes in as a prop.
export function KhachDung({ so }: { so: number }) {
  return &lt;p&gt;Khách số #{so}&lt;/p&gt;;
}</code></pre>
<p>We rendered three <code>&lt;KhachSai /&gt;</code> inside <code>&lt;StrictMode&gt;</code> in a test, then three <code>&lt;KhachDung so={1} /&gt;</code>, <code>so={2}</code>, <code>so={3}</code>:</p>
<div class="out">$ npx vitest run src/vi-du/ThuanKhiet --reporter=verbose
stdout | src/vi-du/ThuanKhiet.test.tsx &gt; bản KHÔNG thuần trong StrictMode: số khách nhảy 2, 4, 6
StrictMode + KhachSai  → [ 'Khách số #2', 'Khách số #4', 'Khách số #6' ]
stdout | src/vi-du/ThuanKhiet.test.tsx &gt; bản thuần trong StrictMode: 1, 2, 3
StrictMode + KhachDung → [ 'Khách số #1', 'Khách số #2', 'Khách số #3' ]
 ✓ src/vi-du/ThuanKhiet.test.tsx &gt; bản KHÔNG thuần trong StrictMode: số khách nhảy 2, 4, 6
 ✓ src/vi-du/ThuanKhiet.test.tsx &gt; bản thuần trong StrictMode: 1, 2, 3</div>
<p>The impure component shows #2, #4, #6: each one was called twice, the counter moved twice, and the screen shows the second result. Without Strict Mode you would see #1, #2, #3 and believe the component works — until the day React renders it an extra time for another reason (a parent re-renders, a list is filtered) and the numbers jump. Strict Mode does not create the bug; it makes an existing bug visible <em>immediately</em>, in development, where it is cheap to fix.</p>
<p>What counts as "changing something outside" during render:</p>
<ul>
<li>assigning to a variable declared outside the component (the example above);</li>
<li>changing an object or array you received as a prop — Lesson 1.2 measures this with <code>.sort()</code>;</li>
<li>calling an API, writing to <code>localStorage</code>, changing <code>document.title</code>, starting a timer.</li>
</ul>
<p>The last group is not forbidden in React — it is just not allowed <em>in the body of the component</em>. It belongs in an event handler (Chapter 2: "when the user clicks, save the booking") or in an Effect (Chapter 4: "while this page is open, keep the tab title in sync"). Creating and changing <em>local</em> variables inside the component is fine: an array you build inside the function with <code>const ketQua = []</code> and fill in a loop belongs to that call alone.</p>
${SD.thuanKhietEn}
<div class="callout"><p><strong>Is <code>new Date()</code> in a component pure?</strong> Strictly, no: two calls can return different values. A footer that prints <code>new Date().getFullYear()</code> is harmless in practice (the year changes once a year), but a component that prints the current time down to the second would show different values in the two Strict Mode calls. When you need "now" in a way that matters, pass it in as a prop or keep it in state (Chapter 4 builds a clock that way). This project&#39;s <code>Footer</code> simply writes "© 2026".</p></div>

<h3>Never define a component inside another component</h3>
${slide('rx-01', 8, 'Defining a component inside a component wipes what the user typed')}
<p>Because a component is "just a function", it is tempting to write a small one right where you need it, inside another component. It even looks tidy. It is one of the most common React bugs, and it is easy to measure. The example needs one thing from Chapter 2 — a button that makes the parent render again. You do not need to understand <code>useState</code> yet; read it as "clicking the button makes <code>FormSai</code> run again":</p>
<pre><code class="language-tsx">// src/vi-du/LongDinhNghia.tsx
import { useState } from 'react';

export function FormSai() {
  const [soLanBam, setSoLanBam] = useState(0);

  // ❌ Every time FormSai runs, ONhap is a NEW function ⇒ React sees a different component
  function ONhap() {
    return &lt;input aria-label="Ghi chú (sai)" /&gt;;
  }

  return (
    &lt;div&gt;
      &lt;ONhap /&gt;
      &lt;button onClick={() =&gt; setSoLanBam(soLanBam + 1)}&gt;Bấm ({soLanBam})&lt;/button&gt;
    &lt;/div&gt;
  );
}

// ✅ Defined OUTSIDE, at the top level of the file.
function ONhap() {
  return &lt;input aria-label="Ghi chú (đúng)" /&gt;;
}

export function FormDung() {
  const [soLanBam, setSoLanBam] = useState(0);
  return (
    &lt;div&gt;
      &lt;ONhap /&gt;
      &lt;button onClick={() =&gt; setSoLanBam(soLanBam + 1)}&gt;Bấm ({soLanBam})&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>The test types "đau đầu" (headache) into the input, clicks the button, and reads the input again:</p>
<div class="out">stdout | src/vi-du/LongDinhNghia.test.tsx &gt; component định nghĩa bên trong: chữ đang gõ BIẾN MẤT sau khi cha vẽ lại
FormSai : trước khi bấm "đau đầu" → sau khi bấm ""
stdout | src/vi-du/LongDinhNghia.test.tsx &gt; component định nghĩa bên ngoài: chữ còn nguyên
FormDung: sau khi bấm "đau đầu"
 ✓ src/vi-du/LongDinhNghia.test.tsx &gt; component định nghĩa bên trong: chữ đang gõ BIẾN MẤT sau khi cha vẽ lại
 ✓ src/vi-du/LongDinhNghia.test.tsx &gt; component định nghĩa bên ngoài: chữ còn nguyên</div>
<p>Why: when <code>FormSai</code> runs again, the line <code>function ONhap() {…}</code> runs again too and creates a <em>brand-new</em> function. The JSX <code>&lt;ONhap /&gt;</code> now points to a different function than last time. React identifies a component by the function it points to, so to React this is a different component at the same place: it throws away the old one — including its DOM <code>&lt;input&gt;</code> and whatever the user typed — and builds a new, empty one. In a real app this shows up as "the form clears itself", "the input loses focus after every key press", or "the modal flickers", and it is maddening to find because the code looks fine.</p>
${SD.longTrongEn}
<div class="pitfall co-tieu-de"><strong>Trap — the input that loses focus after every letter.</strong> A student defines <code>function TruongNhap()</code> inside <code>FormDatLich</code> to avoid repeating the label and input markup five times. Each key press updates the form&#39;s state (Chapter 3), the form re-renders, <code>TruongNhap</code> is a new function, React unmounts the old input and mounts a new one — and the cursor disappears after every letter. The fix is not "add a key" or "add memo": move <code>TruongNhap</code> to the top level of the file and pass the label and value in as props. React&#39;s documentation states the rule plainly: never nest component definitions.</div>

<h3>Class components: what FER202 slides show, and why you still need to read them</h3>
<p>Some older course slides and many older codebases write components as classes:</p>
<pre><code class="language-tsx">// src/vi-du/HeaderClass.tsx
import { Component } from 'react';

export class HeaderClass extends Component&lt;{ ten: string }&gt; {
  render() {
    return &lt;h1&gt;{this.props.ten}&lt;/h1&gt;;
  }
}

// The same thing, written the way this course writes it:
export function HeaderHam({ ten }: { ten: string }) {
  return &lt;h1&gt;{ten}&lt;/h1&gt;;
}</code></pre>
<p>React 19.3 still runs both, and they produce exactly the same DOM — our test rendered each and compared the HTML:</p>
<div class="out">class   : &lt;h1&gt;Phòng khám An Tâm&lt;/h1&gt;
function: &lt;h1&gt;Phòng khám An Tâm&lt;/h1&gt;
 ✓ src/vi-du/HeaderClass.test.tsx &gt; class component và function component vẽ ra cùng một DOM</div>
<p>React&#39;s reference page for <code>Component</code> says class components "are still supported by React, but we don&#39;t recommend using them in new code". In practice you will <em>read</em> them in projects started before 2019 and write them in one rare case — an error boundary (Chapter 11) still has no hook equivalent (as of 09/2026). For everything else, a function is shorter, works with hooks, and is what every job interview expects.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202 labs typically start from Create React App, keep the whole screen in one <code>App.js</code>, and some slides still show <code>class Header extends React.Component</code> with a <code>render()</code> method. → At work in 2026, a new project starts from Vite (or a framework such as Next.js), every component is a <strong>function</strong> in its own <code>.tsx</code> file with a named export, and the page is assembled from small pieces. · <em>Why:</em> Create React App was officially deprecated by the React team in February 2025 and receives no new features; function components are what hooks, React Compiler and every current library are designed for. The FER202 way is not wrong — class components still run in React 19.3 — and you will meet them again when you maintain an older system; you just should not start new code that way.</p></div>

<h3>Run it step by step: split the Section 0 page into Header and Footer</h3>
<ol>
<li>Open the project from Section 0. Create <code>src/components/</code>.</li>
<li>Create <code>src/components/Header.tsx</code> with <code>export function Header()</code> returning a <code>&lt;header&gt;</code> that contains the clinic name in an <code>&lt;h1&gt;</code> and the opening hours in a <code>&lt;p&gt;</code>. Cut those two lines out of <code>App.tsx</code>.</li>
<li>Create <code>src/components/Footer.tsx</code> the same way with an address and a hotline in a <code>&lt;footer&gt;</code>.</li>
<li>In <code>App.tsx</code>: <code>import { Header } from './components/Header';</code>, the same for <code>Footer</code>, then render <code>&lt;Header /&gt;</code>, your <code>&lt;main&gt;</code>, <code>&lt;Footer /&gt;</code> inside a Fragment.</li>
<li>Run <code>npx tsc -b</code> — it must print nothing. Run <code>npm run dev</code> and check the page looks the same as before.</li>
<li>Rename <code>Header</code> to <code>header</code> in both files on purpose, run <code>npx tsc -b</code>, read the error, then undo.</li>
</ol>

<h3>When to write a component — and when not to</h3>
<ul>
<li><strong>Do</strong> write a component for a piece of UI with a name you would use in conversation ("the header", "a doctor card"), for anything repeated, and for anything you want to test on its own.</li>
<li><strong>Do not</strong> write a component just to shorten a file by moving five lines of plain markup that are used once and have no meaning of their own — a component is a name that every reader must learn. Lesson 1.4 turns this into a method.</li>
<li><strong>Do not</strong> call a component like a function (<code>{Header()}</code>). It happens to render, but React no longer sees a component there: hooks inside it break the rules, and React DevTools shows nothing. Always use the tag form.</li>
</ul>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: What is the difference between a function component and a class component? Which do you use?</strong><br>A: Both describe UI; a class component extends <code>React.Component</code> and returns JSX from <code>render()</code>, keeping state in <code>this.state</code> and side effects in lifecycle methods. A function component is a plain function that returns JSX and uses hooks (<code>useState</code>, <code>useEffect</code>) for state and effects. New code uses function components — shorter, easier to reuse logic through custom hooks, and required by modern tooling. I still read class components in older code, and an error boundary is the one place that needs a class today.</p>
<p><strong>Q: Why must a component name start with a capital letter?</strong><br>A: The JSX transform turns <code>&lt;Header /&gt;</code> into <code>jsx(Header, …)</code> — a reference to the function — but <code>&lt;header&gt;</code> into <code>jsx("header", …)</code> — a string, an HTML tag. A lowercase component name is therefore treated as an unknown HTML element and the function is never called.</p>
<p><strong>Q: What does "a component must be pure" mean, and how does Strict Mode help?</strong><br>A: Same props in, same JSX out, and nothing outside the component is changed during render. React may call a component any number of times, so a side effect in the body runs an unpredictable number of times. Strict Mode calls each component twice in development so that such bugs show up immediately.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the Section 0 home page is one function. Split it and prove the split did not change anything.</p><ol>
<li>Do the six steps of "Run it step by step" above.</li>
<li>Add a test <code>src/components/Header.test.tsx</code>: render <code>&lt;Header /&gt;</code> and expect <code>screen.getByRole('heading', { level: 1, name: 'Phòng khám An Tâm' })</code> to be in the document.</li>
<li>Copy <code>KhachSai</code> from this lesson into your project, render three of them inside <code>&lt;StrictMode&gt;</code> in a test, and print what they show. Then change it into the pure version.</li>
<li>Put a <code>function ONhap()</code> inside <code>App</code>, render it, and ask yourself: what would happen to the text in it when <code>App</code> re-renders? Move it out.</li>
</ol><p><strong>Done when:</strong> <code>npx tsc -b</code> prints nothing; <code>npx vitest run</code> shows your Header test passing; your impure test printed <code>#2, #4, #6</code> and the pure one <code>#1, #2, #3</code>; and no component in your <code>src/</code> is defined inside another one.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">component</span><span class="v">a function whose name starts with a capital letter and which returns JSX describing a piece of UI</span></div>
<div class="kv"><span class="k">JSX</span><span class="v">HTML-like syntax that the build turns into <code>jsx(type, props)</code> calls</span></div>
<div class="kv"><span class="k">PascalCase</span><span class="v">every word capitalised, no separators: <code>DanhSachBacSi</code> — required for component names</span></div>
<div class="kv"><span class="k">render (vẽ ra / gọi lại)</span><span class="v">React calling your component to get fresh JSX; not the same as painting the screen</span></div>
<div class="kv"><span class="k">commit</span><span class="v">the step where React applies the differences to the real DOM</span></div>
<div class="kv"><span class="k">pure component</span><span class="v">same props → same JSX, and no changes to anything outside during render</span></div>
<div class="kv"><span class="k">Strict Mode</span><span class="v"><code>&lt;StrictMode&gt;</code>: in development only, calls components twice to expose impure code</span></div>
<div class="kv"><span class="k">named export</span><span class="v"><code>export function X</code>, imported as <code>import { X } from …</code> — the name is fixed</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A component is a function that returns JSX; you use it as a tag, <code>&lt;Header /&gt;</code>, and React calls it.</li>
<li>The first letter decides everything: capital → your function, lowercase → an HTML tag. TypeScript catches the mistake as TS2339.</li>
<li>One component per file, named after it, with a named export; <code>src/components/</code> for now.</li>
<li>"Render" means React calling your function; it can happen many times, and twice per render in Strict Mode during development.</li>
<li>Components must be pure: no changing outside variables, props, the DOM or storage in the body — measured: an impure counter shows #2, #4, #6.</li>
<li>Never define a component inside another: every render creates a new component and wipes its DOM and state.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Your First Component</span><span class="lc-sub">react.dev/learn/your-first-component — defining, exporting and nesting components; the capital-letter rule; "never define a component inside another component".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Importing and Exporting Components</span><span class="lc-sub">react.dev/learn/importing-and-exporting-components — default vs named exports, one file per component.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Keeping Components Pure</span><span class="lc-sub">react.dev/learn/keeping-components-pure — purity, local mutation, where side effects belong, and the "Guest #2, #4, #6" behaviour under Strict Mode.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — &lt;StrictMode&gt; and Component (reference)</span><span class="lc-sub">react.dev/reference/react/StrictMode · react.dev/reference/react/Component — double rendering in development; class components are supported but not recommended for new code.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React blog — Sunsetting Create React App (14 Feb 2025)</span><span class="lc-sub">react.dev/blog/2025/02/14/sunsetting-create-react-app — why new projects start from Vite or a framework.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Component là hàm: đặt tên, mỗi file một component, và giữ cho thuần khiết</h2>
<p class="lead">Component (thành phần giao diện) trong React là một hàm JavaScript trả về JSX. Một câu đó giải thích gần hết bài này: vì sao tên phải viết hoa chữ đầu, vì sao mỗi component nằm trong một file riêng, vì sao chính React — chứ không phải bạn — quyết định lúc nào gọi nó, và vì sao nó phải cư xử như một công thức toán: cùng đầu vào thì cùng đầu ra, không gây tác dụng phụ.</p>

<p>Hết Mục 0, <code>App.tsx</code> của bạn là một hàm duy nhất trả về cả trang chủ: tên phòng khám, giờ mở cửa, một hai đoạn văn. Cách đó ổn khi trang có mười dòng. Nó hết ổn vào ngày trang có thanh đầu trang, chân trang, sáu thẻ bác sĩ và một form đặt lịch — vì một hàm trả về mọi thứ là một hàm bạn phải đọc hết mỗi lần sửa bất cứ gì. Component là cách React cho bạn cắt một trang thành những mảnh đặt tên được, đọc được, dùng lại được và test được từng mảnh một.</p>
<p>Mọi thứ trong bài đã chạy trên dự án thực hành <code>phong-kham</code> của khoá (React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.1) ngày 25/09/2026. Đoạn nào ghi "sai" thì thông báo lỗi bên dưới là đúng thứ TypeScript hoặc React đã in ra.</p>

<h3>Component là một hàm trả về JSX</h3>
${slide('rx-01', 3, 'Component là một hàm JavaScript trả về JSX')}
<p>Đây là component đầu tiên của app phòng khám. Nó là dải trên cùng của trang, được chuyển ra khỏi <code>App.tsx</code> sang file riêng:</p>
<pre><code class="language-tsx">// src/components/Header.tsx
export function Header() {
  return (
    &lt;header className="header"&gt;
      &lt;h1&gt;Phòng khám An Tâm&lt;/h1&gt;
      &lt;p&gt;Mở cửa 7:30–20:00, thứ Hai đến thứ Bảy&lt;/p&gt;
    &lt;/header&gt;
  );
}</code></pre>
<p>Đọc từng dòng:</p>
<ul>
<li><code>function Header() { … }</code> — một hàm JavaScript bình thường. Nó chưa nhận tham số nào (Bài 1.2 sẽ thêm props).</li>
<li><code>return ( … )</code> — cặp ngoặc tròn chỉ để JSX bắt đầu được ở dòng dưới. Thiếu nó, một <code>return</code> đứng một mình rồi xuống dòng sẽ trả về <code>undefined</code> — JavaScript tự chèn dấu chấm phẩy sau <code>return</code> trơ trọi.</li>
<li>JSX phải có <strong>một phần tử gốc</strong>: ở đây là <code>&lt;header&gt;</code>. Hai phần tử ngang hàng ở trên cùng thì cần bọc lại, hoặc dùng Fragment <code>&lt;&gt;…&lt;/&gt;</code> (bài JSX ở Mục 0).</li>
<li><code>className</code>, không phải <code>class</code> — JSX là JavaScript, mà trong JavaScript <code>class</code> là từ khoá dành riêng.</li>
<li><code>export</code> — cho file khác nhìn thấy hàm này. Thiếu nó, <code>App.tsx</code> không import được.</li>
</ul>
<p>Còn đây là cách <code>App.tsx</code> dùng nó:</p>
<pre><code class="language-tsx">// src/App.tsx
import { Header } from './components/Header';

export default function App() {
  return (
    &lt;&gt;
      &lt;Header /&gt;
      &lt;main className="noi-dung"&gt;…&lt;/main&gt;
    &lt;/&gt;
  );
}</code></pre>
<p>Bạn không bao giờ tự viết <code>Header()</code>. Bạn viết <code>&lt;Header /&gt;</code> — một thẻ mang tên hàm — và React gọi hàm đó khi nó cần biết phần màn hình ấy trông ra sao. Thứ hàm trả về không phải HTML, cũng không phải DOM: nó là một object JavaScript nhỏ <em>mô tả</em> giao diện. React so bản mô tả đó với thứ đang có trên màn hình và chỉ sửa DOM thật ở chỗ khác nhau.</p>
<div class="callout"><p><strong>JS nhắc nhanh: <code>function</code> và arrow function (hàm mũi tên).</strong> <code>export function Header() { … }</code> và <code>export const Header = () =&gt; { … };</code> đều tạo ra một hàm tên <code>Header</code>. React đối xử với hai cách như nhau. Khoá này dùng <code>function</code> cho component vì tên đứng ngay đầu và hiện rõ trong thông báo lỗi; bạn sẽ gặp arrow function ở rất nhiều dự án, và thế cũng được. Điều quan trọng là chữ cái đầu viết hoa và chữ <code>export</code>.</p></div>

<h3>Chữ hoa đầu tên là luật duy nhất React đọc từ cái tên</h3>
${slide('rx-01', 4, 'Tên viết hoa là component, viết thường là thẻ HTML')}
<p>Trình duyệt không hiểu JSX. Trước khi code chạy, bước build (Vite, dùng bộ chuyển JSX của TypeScript/Oxc) biến mọi thẻ thành một lời gọi hàm. Bộ chuyển nhìn đúng MỘT thứ để quyết định gọi kiểu gì: <strong>chữ cái đầu của tên thẻ</strong>. Chúng tôi nhờ TypeScript 6.0.3 biên dịch một component nhỏ để bạn thấy tận mắt:</p>
<pre><code class="language-tsx">export function DanhSach() {
  return (
    &lt;section&gt;
      &lt;Header /&gt;
      &lt;header&gt;Phòng khám An Tâm&lt;/header&gt;
      &lt;TheBacSi bacSi={bs} noiBat /&gt;
    &lt;/section&gt;
  );
}</code></pre>
<p>Kết quả của <code>ts.transpileModule(…, { jsx: ReactJSX })</code>, giữ nguyên:</p>
<div class="out">import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function DanhSach() {
    return (_jsxs("section", { children: [_jsx(Header, {}), _jsx("header", { children: "Ph\\u00F2ng kh\\u00E1m An T\\u00E2m" }), _jsx(TheBacSi, { bacSi: bs, noiBat: true })] }));
}</div>
<p>Nhìn sự khác nhau giữa <code>_jsx(Header, {})</code> và <code>_jsx("header", …)</code>. Thẻ viết hoa thành một tham chiếu tới <strong>hàm của bạn</strong>; thẻ viết thường thành một <strong>chuỗi</strong> — tên một thẻ HTML. Luật chỉ có vậy. (Các ký tự <code>\\u00F2</code> chỉ là cách bộ biên dịch viết chữ có dấu, không phải lỗi.) Vậy nếu bạn đặt tên component bằng chữ thường thì sao?</p>
<pre><code class="language-tsx">function theBacSi() {
  return &lt;article&gt;BS. Nguyễn Minh An&lt;/article&gt;;
}

export function DanhSach() {
  return &lt;theBacSi /&gt;;
}</code></pre>
<p>TypeScript từ chối trước:</p>
<div class="out">$ npx tsc -b
src/vi-du/LoiChuThuong.tsx(1,10): error TS6133: 'theBacSi' is declared but its value is never read.
src/vi-du/LoiChuThuong.tsx(6,10): error TS2339: Property 'theBacSi' does not exist on type 'JSX.IntrinsicElements'.</div>
<p>Hai lỗi nói cùng một chuyện từ hai phía: hàm <code>theBacSi</code> không hề được dùng ("khai báo mà không bao giờ đọc"), vì <code>&lt;theBacSi /&gt;</code> bị hiểu là tên một thẻ HTML, mà không có thẻ HTML nào tên <code>theBacSi</code> (<code>JSX.IntrinsicElements</code> là danh sách thẻ có sẵn mà TypeScript biết). Để xem trình duyệt sẽ làm gì, chúng tôi tắt lỗi bằng <code>// @ts-expect-error</code> rồi vẽ nó trong một test Vitest chạy jsdom:</p>
<div class="out">DOM: &lt;thebacsi&gt;&lt;/thebacsi&gt;
console.error: [
  '&lt;theBacSi /&gt; is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.',
  'The tag &lt;theBacSi&gt; is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.'
]</div>
<p>Trang nhận một thẻ lạ, rỗng: <code>&lt;thebacsi&gt;</code>. Hàm của bạn chưa hề chạy — tên bác sĩ không có ở đâu cả. Không có TypeScript, manh mối duy nhất là hai dòng trên console, rất dễ lẫn giữa các dòng khác ("dùng sai kiểu chữ… hãy viết hoa chữ đầu"). Có TypeScript, bạn còn không build nổi. Đặt tên mọi component theo kiểu <strong>PascalCase</strong> (mỗi từ viết hoa chữ đầu, viết liền): <code>Header</code>, <code>TheBacSi</code>, <code>DanhSachBacSi</code>.</p>

<h3>Mỗi component một file, export có tên, import ở nơi dùng</h3>
${slide('rx-01', 5, 'Mỗi component một file, export có tên, import nơi dùng')}
<p>Hết chương này, dự án thực hành trông như sau:</p>
<pre><code class="language-bash">src/
  types.ts                 # kiểu dùng chung: BacSi, ChuyenKhoa, … (cố định cho cả khoá)
  du-lieu/bac-si.ts        # sáu bác sĩ mẫu
  du-lieu/chuyen-khoa.ts   # 'noi' → 'Nội tổng quát', …
  components/
    Header.tsx
    Footer.tsx
    TheBacSi.tsx           # + TheBacSi.test.tsx
    DanhSachBacSi.tsx      # + DanhSachBacSi.test.tsx
  App.tsx                  # + App.test.tsx
  main.tsx                 # createRoot(…).render(&lt;App /&gt;)</code></pre>
<p>Những quy ước mà phần lớn đội React dùng năm 2026, và lý do:</p>
<ul>
<li><strong>Mỗi file một component, file đặt theo tên component.</strong> <code>TheBacSi.tsx</code> export <code>TheBacSi</code>. Khi có báo lỗi "thẻ bác sĩ hiện sai chuyên khoa", bạn biết ngay mở file nào, không cần tìm.</li>
<li><strong>Export có tên</strong> (<code>export function Header</code>) thay vì <code>export default</code>. Với export có tên, bên import buộc phải dùng đúng tên thật — <code>import { Header } from …</code> — nên đổi tên trong editor là mọi chỗ import đổi theo, và tìm chữ "Header" là ra mọi nơi dùng. Export default thì import bằng tên gì cũng được, và đó là cách một dự án có cả <code>Header</code>, <code>AppHeader</code> lẫn <code>TopBar</code> cùng chỉ một file. <code>App.tsx</code> của template giữ export default vì <code>main.tsx</code> đang chờ đúng kiểu đó; không sao.</li>
<li><strong>Component phụ rất nhỏ có thể ở chung file.</strong> Một component tí hon chỉ <code>TheBacSi</code> dùng thì có thể nằm trong <code>TheBacSi.tsx</code>, không cần <code>export</code>. Tới khi file thứ hai cần nó thì tách ra.</li>
<li><strong>Tạm thời để trong <code>src/components/</code>.</strong> Chương 7 chuyển sang mỗi tính năng một thư mục (<code>src/features/bac-si/…</code>) khi app có nhiều trang; bắt đầu đơn giản là cố ý.</li>
</ul>
<div class="callout"><p><strong>JS nhắc nhanh: <code>import</code> / <code>export</code>.</strong> Mỗi file <code>.ts</code>/<code>.tsx</code> là một module (mô-đun) có phạm vi riêng: thứ gì bên trong cũng vô hình với bên ngoài, trừ khi được <code>export</code>. <code>import { Header } from './components/Header'</code> nghĩa là "từ file <code>./components/Header.tsx</code>, lấy cho tôi thứ được export với tên <code>Header</code>" — dấu ngoặc nhọn là bắt buộc với export có tên, và có thể bỏ đuôi file. <code>import App from './App'</code> (không ngoặc nhọn) lấy export <em>mặc định</em> (default). <code>import type { BacSi } from './types'</code> chỉ nhập một KIỂU TypeScript, thứ biến mất sau khi biên dịch — Bài 1.2 giải thích vì sao dự án này đòi chữ <code>type</code>.</p></div>

<h3>React gọi hàm của bạn — ở pha Render, và có thể nhiều lần</h3>
${slide('rx-01', 6, 'React tự gọi hàm của bạn ở pha Render, có thể nhiều lần')}
<p>Mỗi khi màn hình có thể cần đổi, React đi qua bốn bước. Bạn sẽ gặp chúng ở mọi chương của khoá, nên nhớ tên ngay từ giờ:</p>
<ol>
<li><strong>Trigger</strong> (kích hoạt) — có thứ gì đó yêu cầu cập nhật: lần tải đầu (<code>createRoot(…).render(&lt;App /&gt;)</code> trong <code>main.tsx</code>), hoặc về sau là một lần đổi state (Chương 2).</li>
<li><strong>Render</strong> (vẽ ra — đúng hơn là "gọi lại") — React <em>gọi các hàm component</em> để lấy JSX mới. Gọi <code>App</code> kéo theo gọi <code>Header</code>, <code>DanhSachBacSi</code>, sáu lần <code>TheBacSi</code>, cứ thế xuống hết cây. Bước này chưa đổi gì trên màn hình.</li>
<li><strong>Commit</strong> (chốt) — React so JSX mới với lần trước và chỉ sửa DOM thật ở chỗ khác nhau.</li>
<li><strong>Paint</strong> (vẽ điểm ảnh) — trình duyệt vẽ lên màn hình.</li>
</ol>
<p>Vì thế "render" trong React nghĩa là "gọi hàm component", không phải "vẽ lên màn hình". Chữ này xuất hiện rất nhiều: <em>re-render</em> (render lại) là React gọi lại hàm của bạn. Và trong lúc phát triển, bên trong <code>&lt;StrictMode&gt;</code> — thứ template Vite đã đặt sẵn trong <code>main.tsx</code> — React CỐ Ý gọi mỗi component <strong>hai lần</strong> mỗi lượt render và chỉ giữ một kết quả. Ở production nó không tốn gì (Strict Mode không có tác dụng ở đó), còn lúc dev nó phơi ra cả một loại bug, như phần sau cho thấy.</p>
${SD.phaRenderVi}

<h3>Component phải thuần khiết: đo bằng Strict Mode</h3>
${slide('rx-01', 7, 'Component phải thuần: bản sửa biến ngoài ra #2, #4, #6')}
<p>Một hàm <strong>thuần</strong> (pure) có hai tính chất: cùng đầu vào thì luôn trả về cùng đầu ra, và nó không thay đổi bất cứ thứ gì đã tồn tại trước khi nó được gọi. <code>nhanDoi(2)</code> lần nào cũng là 4, và gọi nó không làm đổi biến nào ở chỗ khác. React giả định component của bạn thuần theo đúng nghĩa đó, vì nó gọi chúng bất cứ lúc nào nó muốn, bao nhiêu lần cũng được. Đây là một component phá luật — nó đếm khách bằng cách tăng một biến nằm bên ngoài nó:</p>
<pre><code class="language-tsx">// src/vi-du/ThuanKhiet.tsx
let soKhach = 0;

export function KhachSai() {
  soKhach = soKhach + 1; // ❌ thay đổi thứ nằm ngoài component
  return &lt;p&gt;Khách số #{soKhach}&lt;/p&gt;;
}

// Bản thuần: con số đi vào qua props.
export function KhachDung({ so }: { so: number }) {
  return &lt;p&gt;Khách số #{so}&lt;/p&gt;;
}</code></pre>
<p>Chúng tôi vẽ ba <code>&lt;KhachSai /&gt;</code> bên trong <code>&lt;StrictMode&gt;</code> trong một test, rồi ba <code>&lt;KhachDung so={1} /&gt;</code>, <code>so={2}</code>, <code>so={3}</code>:</p>
<div class="out">$ npx vitest run src/vi-du/ThuanKhiet --reporter=verbose
stdout | src/vi-du/ThuanKhiet.test.tsx &gt; bản KHÔNG thuần trong StrictMode: số khách nhảy 2, 4, 6
StrictMode + KhachSai  → [ 'Khách số #2', 'Khách số #4', 'Khách số #6' ]
stdout | src/vi-du/ThuanKhiet.test.tsx &gt; bản thuần trong StrictMode: 1, 2, 3
StrictMode + KhachDung → [ 'Khách số #1', 'Khách số #2', 'Khách số #3' ]
 ✓ src/vi-du/ThuanKhiet.test.tsx &gt; bản KHÔNG thuần trong StrictMode: số khách nhảy 2, 4, 6
 ✓ src/vi-du/ThuanKhiet.test.tsx &gt; bản thuần trong StrictMode: 1, 2, 3</div>
<p>Bản không thuần hiện #2, #4, #6: mỗi cái bị gọi hai lần, bộ đếm tăng hai lần, và màn hình hiện kết quả lần thứ hai. Không có Strict Mode, bạn sẽ thấy #1, #2, #3 và tin là component chạy đúng — cho tới ngày React render nó thêm một lần vì lý do khác (cha render lại, danh sách được lọc) và các con số nhảy lung tung. Strict Mode không TẠO ra bug; nó làm một bug có sẵn lộ ra <em>ngay lập tức</em>, lúc đang dev, khi sửa còn rẻ.</p>
<p>Những gì tính là "thay đổi thứ bên ngoài" trong lúc render:</p>
<ul>
<li>gán vào một biến khai báo bên ngoài component (ví dụ trên);</li>
<li>sửa một object hay mảng nhận được qua props — Bài 1.2 đo chuyện này bằng <code>.sort()</code>;</li>
<li>gọi API, ghi <code>localStorage</code>, đổi <code>document.title</code>, bật một bộ hẹn giờ.</li>
</ul>
<p>Nhóm cuối không bị React cấm — chỉ là không được đặt <em>trong thân component</em>. Chỗ của nó là handler sự kiện (Chương 2: "khi người dùng bấm thì lưu lịch hẹn") hoặc Effect (Chương 4: "trong lúc trang này mở, giữ tiêu đề tab khớp với bác sĩ"). Tạo và sửa biến <em>cục bộ</em> bên trong component thì hoàn toàn được: một mảng bạn tạo trong hàm bằng <code>const ketQua = []</code> rồi đổ dữ liệu vào bằng vòng lặp là của riêng lần gọi đó.</p>
${SD.thuanKhietVi}
<div class="callout"><p><strong><code>new Date()</code> trong component có thuần không?</strong> Nói chặt thì không: hai lần gọi có thể ra hai giá trị. Chân trang in <code>new Date().getFullYear()</code> thì vô hại trong thực tế (năm chỉ đổi mỗi năm một lần), nhưng component in giờ hiện tại tới từng giây sẽ ra hai giá trị khác nhau ở hai lần gọi của Strict Mode. Khi cần "bây giờ" một cách nghiêm túc, hãy đưa nó vào qua props hoặc giữ trong state (Chương 4 dựng đồng hồ theo cách đó). <code>Footer</code> của dự án này chỉ viết thẳng "© 2026".</p></div>

<h3>Đừng bao giờ định nghĩa component bên trong component khác</h3>
${slide('rx-01', 8, 'Định nghĩa component bên trong component: chữ đang gõ mất')}
<p>Vì component "chỉ là hàm", bạn dễ muốn viết một component nhỏ ngay tại chỗ cần, bên trong component khác. Trông còn gọn gàng. Đây là một trong những bug React hay gặp nhất, và đo được dễ dàng. Ví dụ cần một thứ của Chương 2 — một nút bấm làm component cha render lại. Bạn chưa cần hiểu <code>useState</code>; cứ đọc là "bấm nút thì <code>FormSai</code> chạy lại":</p>
<pre><code class="language-tsx">// src/vi-du/LongDinhNghia.tsx
import { useState } from 'react';

export function FormSai() {
  const [soLanBam, setSoLanBam] = useState(0);

  // ❌ Mỗi lần FormSai chạy lại, ONhap là một HÀM MỚI ⇒ React coi là component khác
  function ONhap() {
    return &lt;input aria-label="Ghi chú (sai)" /&gt;;
  }

  return (
    &lt;div&gt;
      &lt;ONhap /&gt;
      &lt;button onClick={() =&gt; setSoLanBam(soLanBam + 1)}&gt;Bấm ({soLanBam})&lt;/button&gt;
    &lt;/div&gt;
  );
}

// ✅ Định nghĩa ở NGOÀI, ở cấp cao nhất của file.
function ONhap() {
  return &lt;input aria-label="Ghi chú (đúng)" /&gt;;
}

export function FormDung() {
  const [soLanBam, setSoLanBam] = useState(0);
  return (
    &lt;div&gt;
      &lt;ONhap /&gt;
      &lt;button onClick={() =&gt; setSoLanBam(soLanBam + 1)}&gt;Bấm ({soLanBam})&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>Test gõ "đau đầu" vào ô nhập, bấm nút, rồi đọc lại ô nhập:</p>
<div class="out">stdout | src/vi-du/LongDinhNghia.test.tsx &gt; component định nghĩa bên trong: chữ đang gõ BIẾN MẤT sau khi cha vẽ lại
FormSai : trước khi bấm "đau đầu" → sau khi bấm ""
stdout | src/vi-du/LongDinhNghia.test.tsx &gt; component định nghĩa bên ngoài: chữ còn nguyên
FormDung: sau khi bấm "đau đầu"
 ✓ src/vi-du/LongDinhNghia.test.tsx &gt; component định nghĩa bên trong: chữ đang gõ BIẾN MẤT sau khi cha vẽ lại
 ✓ src/vi-du/LongDinhNghia.test.tsx &gt; component định nghĩa bên ngoài: chữ còn nguyên</div>
<p>Vì sao: khi <code>FormSai</code> chạy lại, dòng <code>function ONhap() {…}</code> cũng chạy lại và tạo ra một hàm <em>mới tinh</em>. JSX <code>&lt;ONhap /&gt;</code> giờ trỏ tới một hàm khác lần trước. React nhận mặt component bằng chính hàm mà nó trỏ tới, nên với React đây là một component KHÁC ở cùng chỗ: nó vứt cái cũ — kèm thẻ <code>&lt;input&gt;</code> trong DOM và mọi chữ người dùng đã gõ — rồi dựng một cái mới, trống trơn. Trong app thật, bug này hiện ra thành "form tự xoá", "ô nhập mất con trỏ sau mỗi phím", hay "hộp thoại nhấp nháy", và rất khó tìm vì code trông chẳng có gì sai.</p>
${SD.longTrongVi}
<div class="pitfall co-tieu-de"><strong>Bẫy — ô nhập mất con trỏ sau mỗi chữ.</strong> Một bạn sinh viên định nghĩa <code>function TruongNhap()</code> bên trong <code>FormDatLich</code> để khỏi lặp lại nhãn và ô nhập năm lần. Mỗi lần gõ phím, state của form đổi (Chương 3), form render lại, <code>TruongNhap</code> là một hàm mới, React gỡ ô nhập cũ và gắn ô nhập mới — và con trỏ biến mất sau mỗi chữ cái. Cách sửa không phải "thêm key" hay "thêm memo": chuyển <code>TruongNhap</code> ra cấp cao nhất của file, và đưa nhãn với giá trị vào qua props. Tài liệu React nói thẳng luật này: không bao giờ lồng định nghĩa component.</div>

<h3>Class component: thứ slide FER202 cho xem, và vì sao bạn vẫn cần đọc được</h3>
<p>Một số slide cũ và rất nhiều dự án cũ viết component bằng class (lớp):</p>
<pre><code class="language-tsx">// src/vi-du/HeaderClass.tsx
import { Component } from 'react';

export class HeaderClass extends Component&lt;{ ten: string }&gt; {
  render() {
    return &lt;h1&gt;{this.props.ten}&lt;/h1&gt;;
  }
}

// Cùng việc đó, viết theo cách của khoá này:
export function HeaderHam({ ten }: { ten: string }) {
  return &lt;h1&gt;{ten}&lt;/h1&gt;;
}</code></pre>
<p>React 19.3 vẫn chạy cả hai, và chúng ra DOM y hệt nhau — test của chúng tôi vẽ từng cái rồi so HTML:</p>
<div class="out">class   : &lt;h1&gt;Phòng khám An Tâm&lt;/h1&gt;
function: &lt;h1&gt;Phòng khám An Tâm&lt;/h1&gt;
 ✓ src/vi-du/HeaderClass.test.tsx &gt; class component và function component vẽ ra cùng một DOM</div>
<p>Trang tham chiếu <code>Component</code> của React ghi class component "vẫn được React hỗ trợ, nhưng chúng tôi không khuyên dùng trong code mới". Thực tế bạn sẽ <em>đọc</em> chúng ở các dự án khởi đầu trước 2019, và chỉ <em>viết</em> chúng trong một trường hợp hiếm — error boundary (vùng chặn lỗi, Chương 11) vẫn chưa có hook tương đương (tính đến 09/2026). Mọi chỗ khác, hàm ngắn hơn, dùng được hook, và là thứ mọi buổi phỏng vấn chờ bạn viết.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Bài lab FER202 thường khởi đầu từ Create React App, để cả màn hình trong một <code>App.js</code>, và vài slide vẫn cho xem <code>class Header extends React.Component</code> với hàm <code>render()</code>. → Đi làm năm 2026, dự án mới khởi đầu từ Vite (hoặc một framework như Next.js), mỗi component là một <strong>hàm</strong> nằm trong file <code>.tsx</code> riêng với export có tên, và trang được lắp từ những mảnh nhỏ. · <em>Vì sao:</em> Create React App đã bị đội React chính thức khai tử tháng 02/2025 và không có tính năng mới nữa; function component là thứ mà hook, React Compiler và mọi thư viện hiện nay được thiết kế cho. Cách FER202 không sai — class component vẫn chạy trên React 19.3 — và bạn sẽ gặp lại nó khi bảo trì hệ thống cũ; chỉ là đừng bắt đầu code mới theo kiểu đó.</p></div>

<h3>Chạy thử từng bước: tách trang Mục 0 thành Header và Footer</h3>
<ol>
<li>Mở dự án từ Mục 0. Tạo thư mục <code>src/components/</code>.</li>
<li>Tạo <code>src/components/Header.tsx</code> với <code>export function Header()</code> trả về một <code>&lt;header&gt;</code> chứa tên phòng khám trong <code>&lt;h1&gt;</code> và giờ mở cửa trong <code>&lt;p&gt;</code>. Cắt hai dòng đó ra khỏi <code>App.tsx</code>.</li>
<li>Tạo <code>src/components/Footer.tsx</code> tương tự, với địa chỉ và hotline trong <code>&lt;footer&gt;</code>.</li>
<li>Trong <code>App.tsx</code>: <code>import { Header } from './components/Header';</code>, tương tự cho <code>Footer</code>, rồi render <code>&lt;Header /&gt;</code>, <code>&lt;main&gt;</code> của bạn, <code>&lt;Footer /&gt;</code> trong một Fragment.</li>
<li>Chạy <code>npx tsc -b</code> — phải không in gì. Chạy <code>npm run dev</code> và kiểm trang trông y như trước.</li>
<li>Cố ý đổi <code>Header</code> thành <code>header</code> ở cả hai file, chạy <code>npx tsc -b</code>, đọc lỗi, rồi hoàn tác.</li>
</ol>

<h3>Khi nào viết component — và khi nào KHÔNG</h3>
<ul>
<li><strong>Nên</strong> viết component cho một mảnh giao diện có cái tên bạn sẽ dùng khi nói chuyện ("thanh đầu trang", "thẻ bác sĩ"), cho mọi thứ lặp lại, và cho thứ bạn muốn test riêng.</li>
<li><strong>Không nên</strong> viết component chỉ để file ngắn đi bằng cách dời năm dòng markup trơn, dùng đúng một lần, chẳng mang ý nghĩa riêng — mỗi component là một cái tên mà người đọc nào cũng phải học. Bài 1.4 biến chuyện này thành một phương pháp.</li>
<li><strong>Không</strong> gọi component như gọi hàm (<code>{Header()}</code>). Nó tình cờ vẫn hiện ra, nhưng React không còn thấy một component ở đó: hook bên trong phạm luật, và React DevTools không hiện gì. Luôn dùng dạng thẻ.</li>
</ul>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Function component và class component khác nhau thế nào? Bạn dùng loại nào?</strong><br>Đ: Cả hai đều mô tả giao diện; class component kế thừa <code>React.Component</code>, trả JSX từ <code>render()</code>, giữ state trong <code>this.state</code> và tác dụng phụ trong các hàm vòng đời. Function component là một hàm thường trả về JSX, dùng hook (<code>useState</code>, <code>useEffect</code>) cho state và effect. Code mới dùng function component — ngắn hơn, dùng lại logic qua custom hook dễ hơn, và công cụ hiện đại cần nó. Tôi vẫn đọc được class component trong code cũ, và error boundary là chỗ duy nhất hiện nay cần class.</p>
<p><strong>H: Vì sao tên component phải viết hoa chữ đầu?</strong><br>Đ: Bộ chuyển JSX biến <code>&lt;Header /&gt;</code> thành <code>jsx(Header, …)</code> — tham chiếu tới hàm — còn <code>&lt;header&gt;</code> thành <code>jsx("header", …)</code> — một chuỗi, tức thẻ HTML. Tên viết thường bị coi là thẻ HTML lạ và hàm không bao giờ được gọi.</p>
<p><strong>H: "Component phải thuần" nghĩa là gì, Strict Mode giúp gì?</strong><br>Đ: Cùng props vào thì cùng JSX ra, và không thay đổi gì bên ngoài component trong lúc render. React có thể gọi component bao nhiêu lần cũng được, nên tác dụng phụ đặt trong thân hàm sẽ chạy số lần không đoán được. Strict Mode gọi mỗi component hai lần lúc dev để những bug đó lộ ra ngay.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trang chủ Mục 0 là một hàm duy nhất. Tách nó ra và chứng minh việc tách không làm đổi gì.</p><ol>
<li>Làm sáu bước ở mục "Chạy thử từng bước" phía trên.</li>
<li>Thêm test <code>src/components/Header.test.tsx</code>: render <code>&lt;Header /&gt;</code> và kiểm <code>screen.getByRole('heading', { level: 1, name: 'Phòng khám An Tâm' })</code> có trong trang.</li>
<li>Chép <code>KhachSai</code> của bài này vào dự án, vẽ ba cái bên trong <code>&lt;StrictMode&gt;</code> trong một test, in ra thứ chúng hiện. Rồi sửa nó thành bản thuần.</li>
<li>Đặt một <code>function ONhap()</code> bên trong <code>App</code>, render nó, và tự hỏi: chữ trong ô đó sẽ ra sao khi <code>App</code> render lại? Chuyển nó ra ngoài.</li>
</ol><p><strong>Đạt khi:</strong> <code>npx tsc -b</code> không in gì; <code>npx vitest run</code> cho thấy test Header xanh; test bản không thuần in <code>#2, #4, #6</code> và bản thuần in <code>#1, #2, #3</code>; và trong <code>src/</code> của bạn không còn component nào bị định nghĩa bên trong component khác.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">component (thành phần)</span><span class="v">hàm có tên viết hoa chữ đầu, trả về JSX mô tả một mảnh giao diện</span></div>
<div class="kv"><span class="k">JSX</span><span class="v">cú pháp giống HTML mà bước build biến thành lời gọi <code>jsx(type, props)</code></span></div>
<div class="kv"><span class="k">PascalCase</span><span class="v">mỗi từ viết hoa chữ đầu, viết liền: <code>DanhSachBacSi</code> — bắt buộc cho tên component</span></div>
<div class="kv"><span class="k">render (gọi lại / vẽ ra)</span><span class="v">React gọi component để lấy JSX mới; KHÔNG phải vẽ lên màn hình</span></div>
<div class="kv"><span class="k">commit (chốt)</span><span class="v">bước React áp phần khác nhau vào DOM thật</span></div>
<div class="kv"><span class="k">component thuần (pure)</span><span class="v">cùng props → cùng JSX, và không đổi gì bên ngoài trong lúc render</span></div>
<div class="kv"><span class="k">Strict Mode (chế độ nghiêm)</span><span class="v"><code>&lt;StrictMode&gt;</code>: chỉ lúc dev, gọi component hai lần để lộ code không thuần</span></div>
<div class="kv"><span class="k">export có tên (named export)</span><span class="v"><code>export function X</code>, import bằng <code>import { X } from …</code> — tên cố định</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Component là hàm trả về JSX; bạn dùng nó như một thẻ, <code>&lt;Header /&gt;</code>, và React gọi nó.</li>
<li>Chữ cái đầu quyết định tất cả: hoa → hàm của bạn, thường → thẻ HTML. TypeScript bắt lỗi này với mã TS2339.</li>
<li>Mỗi file một component, đặt theo tên nó, export có tên; tạm để trong <code>src/components/</code>.</li>
<li>"Render" là React gọi hàm của bạn; có thể xảy ra nhiều lần, và hai lần mỗi lượt khi dev trong Strict Mode.</li>
<li>Component phải thuần: không sửa biến bên ngoài, props, DOM hay storage trong thân hàm — đo được: bộ đếm không thuần hiện #2, #4, #6.</li>
<li>Không bao giờ định nghĩa component bên trong component khác: mỗi lần render là một component mới, DOM và state bị xoá.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Your First Component</span><span class="lc-sub">react.dev/learn/your-first-component — định nghĩa, export và lồng component; luật chữ hoa; "không bao giờ định nghĩa component bên trong component khác".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Importing and Exporting Components</span><span class="lc-sub">react.dev/learn/importing-and-exporting-components — export mặc định và export có tên, mỗi file một component.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Keeping Components Pure</span><span class="lc-sub">react.dev/learn/keeping-components-pure — tính thuần, sửa biến cục bộ, tác dụng phụ đặt ở đâu, và hiện tượng "Guest #2, #4, #6" dưới Strict Mode.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — &lt;StrictMode&gt; và Component (tham chiếu)</span><span class="lc-sub">react.dev/reference/react/StrictMode · react.dev/reference/react/Component — render hai lần khi dev; class component vẫn được hỗ trợ nhưng không khuyên dùng cho code mới.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Blog React — Sunsetting Create React App (14/02/2025)</span><span class="lc-sub">react.dev/blog/2025/02/14/sunsetting-create-react-app — vì sao dự án mới khởi đầu từ Vite hoặc một framework.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — Props and their TypeScript types: passing data down, children, and read-only props|||1.2 — Props và kiểu TypeScript: truyền dữ liệu xuống, children, và props chỉ đọc',
      slug: 'rx-1-2-props',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Props là một object cha đưa xuống con: destructuring, interface, dấu ?, giá trị mặc định, children với ReactNode và import type; tsc bắt lỗi props (lỗi thật) còn PropTypes bị React 19 bỏ qua (đo thật); bẫy số 0 chụp thật; props chỉ đọc — .sort() đảo luôn mảng của cha.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Props and their TypeScript types: passing data down, children, and read-only props</h2>
<p class="lead">A component without input can only ever draw one thing. Props (short for properties) are how a parent hands data to a child: <code>&lt;TheBacSi bacSi={bs} /&gt;</code>. React collects them into one object and passes it as the function&#39;s first argument. TypeScript then describes exactly what that object may contain, so a missing or misspelt prop is an error in your editor instead of a blank card in production.</p>

<p>In Lesson 1.1 every component drew fixed text. The clinic has six doctors, and we do not want six copies of the card. We want one card component, <code>TheBacSi</code>, that draws whichever doctor it is given. This lesson builds it, types it, and then breaks it in the four ways people usually break props — each break recorded from a real run on 25 September 2026.</p>
<p>The data types come from the course&#39;s fixed <code>src/types.ts</code>, the same file every chapter uses:</p>
<pre><code class="language-ts">// src/types.ts (excerpt)
export type ChuyenKhoa = 'noi' | 'nhi' | 'da-lieu' | 'rang-ham-mat';
export interface BacSi { id: string; ten: string; chuyenKhoa: ChuyenKhoa; namKinhNghiem: number; gioiThieu: string }</code></pre>
<div class="callout"><p><strong>TS quick reminder: <code>type</code>, <code>interface</code>, and a union of strings.</strong> <code>interface BacSi { … }</code> describes the shape of an object: which fields it has and their types. <code>type ChuyenKhoa = 'noi' | 'nhi' | …</code> is a <em>union</em>: a value of this type must be exactly one of those four strings. Write <code>chuyenKhoa: 'tim-mach'</code> on a doctor and TypeScript answers <code>error TS2322: Type '"tim-mach"' is not assignable to type 'ChuyenKhoa'.</code> (real output). For more depth, the site&#39;s <code>/courses/typescript</code> course covers both; here you only need to read them.</p></div>

<h3>Props are one object that the parent passes down</h3>
${slide('rx-01', 9, 'Props are one object that the parent passes to the child')}
<p>The parent writes attributes on the tag, just like HTML attributes:</p>
<pre><code class="language-tsx">&lt;TheBacSi bacSi={bs} noiBat /&gt;</code></pre>
<p>In Lesson 1.1 you saw what the compiler makes of this line: <code>_jsx(TheBacSi, { bacSi: bs, noiBat: true })</code>. All attributes become <strong>one object</strong>. When React renders, it calls <code>TheBacSi</code> with that object as its only argument. The child can read it as <code>props</code>:</p>
<pre><code class="language-tsx">function TheBacSi(props: TheBacSiProps) {
  return &lt;h3&gt;{props.bacSi.ten}&lt;/h3&gt;;
}</code></pre>
<p>…but almost every React codebase unpacks it straight away in the parameter list:</p>
<pre><code class="language-tsx">function TheBacSi({ bacSi, noiBat }: TheBacSiProps) {
  return &lt;h3&gt;{bacSi.ten}&lt;/h3&gt;;
}</code></pre>
<div class="callout"><p><strong>JS quick reminder: destructuring (tách object thành biến).</strong> <code>const { bacSi, noiBat } = props;</code> is short for <code>const bacSi = props.bacSi; const noiBat = props.noiBat;</code>. Writing the braces directly in the parameter list, <code>function TheBacSi({ bacSi, noiBat })</code>, does the same thing at the moment the function is called. You can give a default for a missing value, <code>{ noiBat = false }</code>, and rename, <code>{ bacSi: bs }</code>. Nothing React-specific here — it is plain JavaScript that React code uses constantly.</p></div>
<p>Three rules about what you write on the tag:</p>
<ul>
<li><strong>Strings go in quotes</strong>: <code>ten="BS. Nguyễn Minh An"</code>.</li>
<li><strong>Everything else goes in braces</strong>: numbers <code>namKinhNghiem={12}</code>, booleans <code>noiBat={true}</code>, objects <code>bacSi={bs}</code>, expressions <code>noiBat={bs.namKinhNghiem &gt;= 15}</code>. <code>namKinhNghiem="12"</code> passes the <em>string</em> "12", not the number — TypeScript will catch it below.</li>
<li><strong>A bare name means <code>true</code></strong>: <code>&lt;TheBacSi bacSi={bs} noiBat /&gt;</code> equals <code>noiBat={true}</code>. Leave it out and the value is <code>undefined</code>.</li>
</ul>
${SD.propsEn}

<h3>Typing props: interface, the question mark, and default values</h3>
${slide('rx-01', 10, 'Typing props: interface, the question mark and default values')}
<p>Here is the card component the project uses from this chapter on:</p>
<pre><code class="language-tsx">// src/components/TheBacSi.tsx
import { TEN_CHUYEN_KHOA } from '../du-lieu/chuyen-khoa';
import type { BacSi } from '../types';

interface TheBacSiProps {
  bacSi: BacSi;
  noiBat?: boolean; // ? = optional
}

export function TheBacSi({ bacSi, noiBat = false }: TheBacSiProps) {
  return (
    &lt;article className={noiBat ? 'the-bac-si noi-bat' : 'the-bac-si'} aria-label={bacSi.ten}&gt;
      &lt;h3&gt;{bacSi.ten}&lt;/h3&gt;
      &lt;p className="chuyen-khoa"&gt;{TEN_CHUYEN_KHOA[bacSi.chuyenKhoa]}&lt;/p&gt;
      &lt;p&gt;{bacSi.namKinhNghiem} năm kinh nghiệm&lt;/p&gt;
      {noiBat &amp;&amp; &lt;p className="nhan"&gt;Bác sĩ lâu năm&lt;/p&gt;}
      &lt;p className="gioi-thieu"&gt;{bacSi.gioiThieu}&lt;/p&gt;
    &lt;/article&gt;
  );
}</code></pre>
<ul>
<li><strong><code>interface TheBacSiProps</code></strong> is the component&#39;s contract: it needs a <code>bacSi</code> of type <code>BacSi</code>, and may receive <code>noiBat</code>. Naming it <code>&lt;Component&gt;Props</code> is the common convention; it stays in the same file and is not exported until another file needs it.</li>
<li><strong><code>noiBat?: boolean</code></strong> — the question mark makes the prop optional. Its type is then really <code>boolean | undefined</code>.</li>
<li><strong><code>noiBat = false</code></strong> in the destructuring gives a default, so inside the function <code>noiBat</code> is always a boolean. This replaces the old <code>TheBacSi.defaultProps = { … }</code>, which React 19 no longer supports for function components.</li>
<li><strong><code>aria-label={bacSi.ten}</code></strong> gives each <code>&lt;article&gt;</code> an accessible name, so a screen reader — and a test with <code>getByRole('article', { name: … })</code> — can tell the cards apart.</li>
<li><strong><code>className={noiBat ? 'a' : 'b'}</code></strong> — a ternary (<code>điều_kiện ? nếu_đúng : nếu_sai</code>) inside braces picks the CSS class.</li>
</ul>
<p>The specialty label comes from a lookup table:</p>
<pre><code class="language-ts">// src/du-lieu/chuyen-khoa.ts
import type { ChuyenKhoa } from '../types';

export const TEN_CHUYEN_KHOA: Record&lt;ChuyenKhoa, string&gt; = {
  noi: 'Nội tổng quát',
  nhi: 'Nhi',
  'da-lieu': 'Da liễu',
  'rang-ham-mat': 'Răng hàm mặt',
};</code></pre>
<p><code>Record&lt;ChuyenKhoa, string&gt;</code> means "an object with exactly one string for <em>every</em> value of <code>ChuyenKhoa</code>". It earns its keep the day someone adds a specialty to the union and forgets the label. We deleted the last line to see:</p>
<div class="out">src/du-lieu/chuyen-khoa.ts(3,14): error TS2741: Property '"rang-ham-mat"' is missing in type '{ noi: string; nhi: string; 'da-lieu': string; }' but required in type 'Record&lt;ChuyenKhoa, string&gt;'.</div>
<p>Without the <code>Record</code> type, the card for BS. Phạm Ngọc Lan would silently show an empty specialty line.</p>
<div class="callout"><p><strong>Why <code>import type</code>?</strong> A type exists only while TypeScript checks your code; it is erased from the JavaScript that runs. The Vite template turns on <code>verbatimModuleSyntax</code>, which asks you to say so explicitly: <code>import type { BacSi } from '../types'</code>. That way the bundler never tries to import something that does not exist at run time. Forget the word <code>type</code> and you get error TS1484 — shown in the <code>children</code> section below.</p></div>

<h3>tsc catches prop mistakes before the browser runs anything</h3>
${slide('rx-01', 11, 'tsc catches prop mistakes before the browser runs')}
<p>We wrote four classic mistakes into a scratch file, <code>src/vi-du/LoiProps.tsx</code> (lines 7–10; the comments are added here for reading and were not in the file):</p>
<pre><code class="language-tsx">&lt;TheBacSi /&gt;                                                  {/* line 7: forgot the required prop */}
&lt;TheBacSi bacSi={danhSachBacSi[0]} noiBat="true" /&gt;           {/* line 8: a string, not a boolean */}
&lt;TheBacSi bacSi={danhSachBacSi[0]} noiBac /&gt;                  {/* line 9: typo in the prop name */}
&lt;TheBacSi bacSi={{ ...danhSachBacSi[0], namKinhNghiem: '12' }} /&gt; {/* line 10: '12' is a string */}</code></pre>
<div class="out">$ npx tsc -b
src/vi-du/LoiProps.tsx(7,8): error TS2741: Property 'bacSi' is missing in type '{}' but required in type 'TheBacSiProps'.
src/vi-du/LoiProps.tsx(8,42): error TS2322: Type 'string' is not assignable to type 'boolean | undefined'.
src/vi-du/LoiProps.tsx(9,42): error TS2322: Type '{ bacSi: BacSi; noiBac: true; }' is not assignable to type 'IntrinsicAttributes &amp; TheBacSiProps'.
  Property 'noiBac' does not exist on type 'IntrinsicAttributes &amp; TheBacSiProps'. Did you mean 'noiBat'?
src/vi-du/LoiProps.tsx(10,47): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p>How to read these messages — they all follow the same pattern:</p>
<ul>
<li><strong>TS2741 "Property X is missing"</strong> — you left out a required prop. <code>'{}'</code> is the props object you actually passed (empty).</li>
<li><strong>TS2322 "Type A is not assignable to type B"</strong> — you passed a value of the wrong type. On line 8, <code>"true"</code> in quotes is a string; write <code>noiBat</code> or <code>noiBat={true}</code>.</li>
<li><strong>"does not exist on type … Did you mean"</strong> — a typo. Without TypeScript, <code>noiBac</code> would be silently ignored and the badge would never show.</li>
<li><code>IntrinsicAttributes</code> in the message is React&#39;s set of attributes every component accepts (<code>key</code>) — you can ignore it while reading.</li>
</ul>
<p>The editor shows the same errors as red underlines while you type, which is where you will usually meet them. <code>npx tsc -b</code> is the command that CI runs (see <code>/courses/github-actions</code>), so a mistake cannot reach the main branch even if someone ignores the underline.</p>
<p><strong>And PropTypes?</strong> FER202 teaches a runtime check instead: <code>TheBacSi.propTypes = { namKinhNghiem: PropTypes.number.isRequired }</code>. We installed <code>prop-types</code> 15.8.1 temporarily, wrote a plain-JavaScript component with those propTypes, and passed <code>namKinhNghiem="mười hai"</code> with no <code>ten</code>:</p>
<div class="out">stdout | src/vi-du/PropTypesCu.test.jsx &gt; React 19: propTypes bị bỏ qua, truyền sai kiểu không ai kêu
DOM: &lt;p&gt; · mười hai năm&lt;/p&gt;
số lần console.error: 0
 ✓ src/vi-du/PropTypesCu.test.jsx &gt; React 19: propTypes bị bỏ qua, truyền sai kiểu không ai kêu</div>
<p>Zero warnings. The React 19 upgrade guide says it directly: <code>propTypes</code> checks were removed from the React package "and using them will be silently ignored". A FER202 project upgraded to React 19 therefore loses its checks without any message — one more reason the industry moved to TypeScript, which checks <em>before</em> the code runs and costs nothing at run time.</p>

<h3>children: whatever sits between the opening and closing tag</h3>
${slide('rx-01', 12, 'children: what sits between the opening and closing tag')}
<p>Some components are containers: a card frame, a modal, a page layout. They do not know their content in advance. React passes whatever you nest between the tags as a special prop named <code>children</code>:</p>
<pre><code class="language-tsx">// src/vi-du/Khung.tsx
import type { ReactNode } from 'react';

interface KhungProps {
  tieuDe: string;
  children: ReactNode;
}

export function Khung({ tieuDe, children }: KhungProps) {
  return (
    &lt;section className="khung"&gt;
      &lt;h2&gt;{tieuDe}&lt;/h2&gt;
      {children}
    &lt;/section&gt;
  );
}

// Using it:
&lt;Khung tieuDe="Giờ mở cửa"&gt;
  &lt;p&gt;Thứ Hai – thứ Bảy: 7:30–20:00&lt;/p&gt;
  &lt;p&gt;Chủ nhật: nghỉ&lt;/p&gt;
&lt;/Khung&gt;</code></pre>
<p>The two <code>&lt;p&gt;</code> elements arrive as <code>children</code> and are placed exactly where <code>{children}</code> appears. The test checks both the title and the nested text (✓ <code>Khung vẽ tiêu đề và mọi thứ nằm giữa thẻ mở và thẻ đóng</code>).</p>
${SD.childrenEn}
<ul>
<li><strong><code>ReactNode</code></strong> is the broad type for "anything React can render": JSX, strings, numbers, arrays of those, <code>null</code>, <code>undefined</code>, booleans. It is the right type for <code>children</code> almost always.</li>
<li><strong><code>ReactElement</code></strong> is narrower — JSX elements only, no plain text. React&#39;s TypeScript page notes that you cannot use types to require "only <code>&lt;li&gt;</code> children"; do not try.</li>
</ul>
<p>Forget the word <code>type</code> in the import and this project refuses to build:</p>
<div class="out">$ npx tsc -b
src/vi-du/LoiImport.tsx(1,10): error TS1484: 'ReactNode' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.</div>
<p>Children versus a normal prop: use <code>children</code> when the content is markup the parent composes freely (<code>&lt;Khung&gt;…&lt;/Khung&gt;</code>); use a named prop when it is data the component knows how to display (<code>bacSi={bs}</code>). A card that receives the whole doctor object can lay it out consistently everywhere; a frame that receives children can hold anything.</p>

<h3>Showing something only sometimes — and the 0 that appears on screen</h3>
${slide('rx-01', 13, 'The number-on-the-left trap: a 0 appears on screen')}
<p>Inside <code>TheBacSi</code>, the badge appears only for experienced doctors:</p>
<pre><code class="language-tsx">{noiBat &amp;&amp; &lt;p className="nhan"&gt;Bác sĩ lâu năm&lt;/p&gt;}</code></pre>
<p><code>a &amp;&amp; b</code> in JavaScript returns <code>a</code> if <code>a</code> is falsy, otherwise <code>b</code>. React renders nothing for <code>false</code>, <code>null</code> and <code>undefined</code>, so when <code>noiBat</code> is <code>false</code> nothing appears. The pattern is safe <strong>only when the left side is a real boolean</strong>. Here is what happens with a number:</p>
<pre><code class="language-tsx">// src/vi-du/SoKhong.tsx
export function SoLichSai({ soLich }: { soLich: number }) {
  return &lt;div&gt;{soLich &amp;&amp; &lt;p&gt;Bạn có {soLich} lịch hẹn&lt;/p&gt;}&lt;/div&gt;;
}

export function SoLichDung({ soLich }: { soLich: number }) {
  return &lt;div&gt;{soLich &gt; 0 &amp;&amp; &lt;p&gt;Bạn có {soLich} lịch hẹn&lt;/p&gt;}&lt;/div&gt;;
}</code></pre>
<div class="out">SoLichSai  soLich=0 → "&lt;div&gt;0&lt;/div&gt;"
SoLichDung soLich=0 → "&lt;div&gt;&lt;/div&gt;"
 ✓ src/vi-du/SoKhong.test.tsx &gt; soLich = 0: bản sai in ra chữ "0", bản đúng không in gì</div>
<p><code>0 &amp;&amp; …</code> evaluates to <code>0</code>, and React <em>does</em> render numbers — so a lonely "0" appears under the title (the slide shows the real screenshot). TypeScript does not complain: rendering a number is legal. Fix it by making the condition a boolean: <code>soLich &gt; 0 &amp;&amp; …</code>, or use a ternary <code>{soLich &gt; 0 ? &lt;p&gt;…&lt;/p&gt; : null}</code>. The same trap hides in <code>{danhSach.length &amp;&amp; …}</code> for an empty list.</p>
<div class="pitfall co-tieu-de"><strong>Trap — the stray "0" in the booking summary.</strong> A patient with no upcoming appointments opens the summary box and sees a single "0" under the heading. The code was <code>{lichHen.length &amp;&amp; &lt;DanhSachLichHen … /&gt;}</code>, written when every test account had at least one appointment. No error, no warning, and the screenshot in the bug report looks like a layout glitch. Rule of thumb: the left side of <code>&amp;&amp;</code> in JSX must be a boolean — <code>length &gt; 0</code>, <code>Boolean(x)</code>, or a comparison.</div>

<h3>Props are read-only: .sort() reorders the parent&#39;s array</h3>
${slide('rx-01', 14, 'Props are read-only: .sort() reorders the parent’s array')}
<p>Props flow one way: the parent owns the data, the child reads it. The child must not change it. With strings and numbers you cannot really change it anyway — assigning a new value to <code>bacSi</code> only changes your local variable. With <strong>objects and arrays</strong>, the child receives a reference to the <em>same</em> object the parent holds, so changing it changes the parent&#39;s data too. The most innocent-looking way to do that is <code>.sort()</code>, which sorts an array <em>in place</em>:</p>
<pre><code class="language-tsx">// src/vi-du/SapXep.tsx
export function TheoKinhNghiemSai({ danhSach }: { danhSach: BacSi[] }) {
  const sapXep = danhSach.sort((a, b) =&gt; b.namKinhNghiem - a.namKinhNghiem); // ❌ changes the original array
  return &lt;ol&gt;{sapXep.map((bs) =&gt; &lt;li key={bs.id}&gt;{bs.ten}&lt;/li&gt;)}&lt;/ol&gt;;
}

export function TheoKinhNghiemDung({ danhSach }: { danhSach: BacSi[] }) {
  const sapXep = danhSach.toSorted((a, b) =&gt; b.namKinhNghiem - a.namKinhNghiem); // ✅ a NEW array
  return &lt;ol&gt;{sapXep.map((bs) =&gt; &lt;li key={bs.id}&gt;{bs.ten}&lt;/li&gt;)}&lt;/ol&gt;;
}</code></pre>
<p>The test gives each component a copy of the six doctors and prints the parent&#39;s array before and after rendering:</p>
<div class="out">$ npx vitest run src/vi-du/SapXep --reporter=verbose
trước render: bs-1 bs-2 bs-3 bs-4 bs-5 bs-6
sau render  : bs-6 bs-4 bs-1 bs-2 bs-3 bs-5
toSorted, sau render: bs-1 bs-2 bs-3 bs-4 bs-5 bs-6
 ✓ src/vi-du/SapXep.test.tsx &gt; .sort() trong component làm đổi thứ tự mảng của CHA
 ✓ src/vi-du/SapXep.test.tsx &gt; .toSorted() để nguyên mảng của cha</div>
<p>After merely <em>displaying</em> a sorted list, the parent&#39;s list is sorted too. Any other component that uses the same array — the home page grid, a filter from Chapter 2 — now shows doctors in a different order, and nobody touched their code. This is also a purity violation from Lesson 1.1: render changed something that existed before it.</p>
${SD.sortEn}
<div class="callout"><p><strong>JS quick reminder: methods that change an array vs methods that return a new one.</strong> <code>sort</code>, <code>reverse</code>, <code>splice</code>, <code>push</code>, <code>pop</code> change the array they are called on. <code>toSorted</code>, <code>toReversed</code>, <code>toSpliced</code> (ES2023, available in the project&#39;s <code>lib: ["ES2023"]</code>) and <code>map</code>, <code>filter</code>, <code>slice</code>, <code>concat</code> return a new array and leave the original alone. The spread syntax <code>[...danhSach]</code> copies an array into a new one, so <code>[...danhSach].sort(…)</code> is the pre-2023 way to write the same fix. Chapter 2 builds on this when state arrays must be updated without mutation.</p></div>
<p>A related shortcut is spreading an object into props: <code>&lt;TheBacSi {...{ bacSi: bs, noiBat: true }} /&gt;</code> passes every field as a separate prop. It is handy when a wrapper forwards props it does not care about, but it hides what a component receives; prefer explicit props in application code.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>In FER202 you declare prop types at run time with <code>PropTypes</code> (<code>TheBacSi.propTypes = { … }</code>) and defaults with <code>defaultProps</code>, and the warning shows in the console only when the wrong value actually arrives. → At work, props are typed with a TypeScript <code>interface</code>, defaults are written in the destructuring (<code>{ noiBat = false }</code>), and <code>npx tsc -b</code> runs in CI on every pull request. · <em>Why:</em> TypeScript catches the mistake while you type and before merge, for every caller at once; and React 19 silently ignores <code>propTypes</code> and <code>defaultProps</code> on function components (measured above: 0 warnings). PropTypes is not wrong — it was the best tool before TypeScript was common — and you will still see it in JavaScript-only projects; when you migrate one, React provides a codemod from PropTypes to TypeScript.</p></div>

<h3>Run it step by step: build TheBacSi</h3>
<ol>
<li>Copy the course&#39;s <code>src/types.ts</code> into your project (the block at the top of this lesson plus the other four types listed in the chapter&#39;s project section).</li>
<li>Create <code>src/du-lieu/chuyen-khoa.ts</code> with <code>TEN_CHUYEN_KHOA: Record&lt;ChuyenKhoa, string&gt;</code>.</li>
<li>Create <code>src/components/TheBacSi.tsx</code> with the interface and component above. Render one card in <code>App.tsx</code> with a doctor object written inline.</li>
<li>Pass <code>noiBat</code> as a bare name, then remove it. Check the badge appears and disappears.</li>
<li>Write <code>noiBat="true"</code> on purpose and run <code>npx tsc -b</code>; read the TS2322 message, then fix it.</li>
<li>Write <code>TheBacSi.test.tsx</code> with a fake doctor (<code>chuyenKhoa: 'da-lieu'</code>) and check the card shows "Da liễu" and "7 năm kinh nghiệm".</li>
</ol>

<h3>When to use props — and when not to</h3>
<ul>
<li><strong>Use</strong> props for everything a component needs from outside: the data to show, flags that change its look, and (Chapter 2) functions to call when something happens.</li>
<li><strong>Pass the object, not ten fields</strong>, when the component is "about" that object: <code>bacSi={bs}</code> rather than <code>ten=… chuyenKhoa=… namKinhNghiem=…</code>. When <code>BacSi</code> gains a field, only the card changes.</li>
<li><strong>Do not</strong> pass a prop through five layers only so the bottom one can read it — that is "prop drilling"; Chapter 5 gives Context and Zustand for it. In Chapter 1 the tree is only three levels deep, so plain props are right.</li>
<li><strong>Do not</strong> copy a prop into state "so you can change it" — Chapter 2 explains why that creates two sources of truth.</li>
</ul>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: What is the difference between props and state?</strong><br>A: Props are inputs passed from the parent; the component reads them and must not change them. State is data the component owns and changes over time with its setter (Chapter 2), which triggers a re-render. The same value is often state in a parent and a prop in the child. If a value never changes inside the component, it is a prop or a constant, not state.</p>
<p><strong>Q: How do you type <code>children</code> in TypeScript?</strong><br>A: <code>children: ReactNode</code> in the props interface, imported with <code>import type { ReactNode } from 'react'</code>. <code>ReactElement</code> is narrower (JSX only). You cannot restrict children to a specific element type with TypeScript.</p>
<p><strong>Q: Why can <code>{items.length &amp;&amp; &lt;List /&gt;}</code> show a 0?</strong><br>A: <code>&amp;&amp;</code> returns the left operand when it is falsy; <code>0</code> is falsy but React renders numbers, so "0" appears. Use <code>items.length &gt; 0 &amp;&amp; …</code> or a ternary.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the clinic wants the same card in three places. Make it one typed component and prove its contract.</p><ol>
<li>Build <code>TheBacSi</code> following "Run it step by step".</li>
<li>Write three tests: name, Vietnamese specialty and years are shown; no badge without <code>noiBat</code>; badge with <code>noiBat</code>.</li>
<li>Create <code>Khung</code> with <code>tieuDe</code> and <code>children</code>; use it in <code>App</code> for the opening-hours box.</li>
<li>Write a <code>SoLichSai</code> with <code>soLich={0}</code>, see the "0" in the browser, then fix it.</li>
<li>Write a component that sorts a <code>danhSach</code> prop with <code>.sort()</code>; add a test that fails because the parent&#39;s array changed; switch to <code>toSorted</code> and watch it pass.</li>
</ol><p><strong>Done when:</strong> <code>npx tsc -b</code> prints nothing; <code>npx vitest run</code> is green with at least the three card tests; your browser shows no "0" in the appointment box; and you can point to the <code>TS2322</code> message you produced on purpose and say what it meant.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">props (thuộc tính)</span><span class="v">the single object of inputs a parent passes to a component; read-only for the child</span></div>
<div class="kv"><span class="k">destructuring</span><span class="v"><code>({ bacSi, noiBat = false })</code> — unpack fields into variables, with defaults</span></div>
<div class="kv"><span class="k">optional prop</span><span class="v"><code>noiBat?: boolean</code> — may be left out; its value is then <code>undefined</code></span></div>
<div class="kv"><span class="k"><code>children</code></span><span class="v">the special prop holding whatever is nested between a component&#39;s tags</span></div>
<div class="kv"><span class="k"><code>ReactNode</code></span><span class="v">type of anything React can render: JSX, text, numbers, arrays, <code>null</code></span></div>
<div class="kv"><span class="k"><code>import type</code></span><span class="v">imports a TypeScript type only; required here by <code>verbatimModuleSyntax</code> (TS1484)</span></div>
<div class="kv"><span class="k"><code>Record&lt;K, V&gt;</code></span><span class="v">an object with one <code>V</code> for every key in the union <code>K</code> — missing keys are errors</span></div>
<div class="kv"><span class="k">mutation (thay đổi tại chỗ)</span><span class="v">changing an existing object/array (<code>sort</code>, <code>push</code>) instead of making a new one</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Attributes on a component tag become one props object, passed as the function&#39;s first argument; destructure it in the parameter list.</li>
<li>Type props with an <code>interface</code>; <code>?</code> marks optional props; defaults go in the destructuring.</li>
<li><code>tsc</code> reports missing props (TS2741), wrong types and typos (TS2322) before anything runs; React 19 silently ignores <code>propTypes</code> (measured: 0 warnings).</li>
<li><code>children</code> carries nested JSX; type it as <code>ReactNode</code> and import types with <code>import type</code>.</li>
<li>The left side of <code>&amp;&amp;</code> in JSX must be a boolean, or a "0" appears on screen.</li>
<li>Props are read-only: <code>.sort()</code> on a prop reordered the parent&#39;s array; use <code>toSorted</code> or <code>[...arr].sort()</code>.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Passing Props to a Component</span><span class="lc-sub">react.dev/learn/passing-props-to-a-component — reading props, defaults, spreading, children, and how props change over time.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Using TypeScript</span><span class="lc-sub">react.dev/learn/typescript — typing component props, <code>ReactNode</code> vs <code>ReactElement</code> for children.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Conditional Rendering</span><span class="lc-sub">react.dev/learn/conditional-rendering — <code>&amp;&amp;</code> and the ternary, and the "don&#39;t put numbers on the left side of &amp;&amp;" pitfall.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React 19 Upgrade Guide</span><span class="lc-sub">react.dev/blog/2024/04/25/react-19-upgrade-guide — "Removed: propTypes and defaultProps for functions", with the codemod to TypeScript.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript course on this site</span><span class="lc-sub">/courses/typescript — interfaces, unions, <code>Record</code> and type-only imports in depth.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Props và kiểu TypeScript: truyền dữ liệu xuống, children, và props chỉ đọc</h2>
<p class="lead">Component không có đầu vào thì mãi mãi chỉ vẽ được một thứ. Props (viết tắt của properties — thuộc tính) là cách component cha đưa dữ liệu cho component con: <code>&lt;TheBacSi bacSi={bs} /&gt;</code>. React gom chúng lại thành MỘT object và đưa vào làm tham số đầu tiên của hàm. TypeScript mô tả chính xác object đó được chứa gì, nên thiếu hay gõ sai tên prop là lỗi ngay trong editor thay vì một cái thẻ trống trơn trên production.</p>

<p>Ở Bài 1.1 component nào cũng vẽ chữ cố định. Phòng khám có sáu bác sĩ, và ta không muốn sáu bản sao của cái thẻ. Ta muốn MỘT component thẻ, <code>TheBacSi</code>, vẽ được bất kỳ bác sĩ nào được đưa cho nó. Bài này dựng nó, gõ kiểu cho nó, rồi làm hỏng nó theo bốn cách người ta hay làm hỏng props — mỗi cách đều ghi từ một lần chạy thật ngày 25/09/2026.</p>
<p>Kiểu dữ liệu lấy từ file <code>src/types.ts</code> cố định của khoá, chương nào cũng dùng đúng file này:</p>
<pre><code class="language-ts">// src/types.ts (trích)
export type ChuyenKhoa = 'noi' | 'nhi' | 'da-lieu' | 'rang-ham-mat';
export interface BacSi { id: string; ten: string; chuyenKhoa: ChuyenKhoa; namKinhNghiem: number; gioiThieu: string }</code></pre>
<div class="callout"><p><strong>TS nhắc nhanh: <code>type</code>, <code>interface</code>, và hợp các chuỗi.</strong> <code>interface BacSi { … }</code> mô tả hình dạng một object: có những trường nào, mỗi trường kiểu gì. <code>type ChuyenKhoa = 'noi' | 'nhi' | …</code> là một <em>union</em> (kiểu hợp): giá trị kiểu này phải đúng là một trong bốn chuỗi đó. Viết <code>chuyenKhoa: 'tim-mach'</code> cho một bác sĩ là TypeScript đáp <code>error TS2322: Type '"tim-mach"' is not assignable to type 'ChuyenKhoa'.</code> (output thật). Muốn sâu hơn, khoá <code>/courses/typescript</code> trên trang này dạy cả hai; ở đây bạn chỉ cần đọc hiểu.</p></div>

<h3>Props là một object cha đưa xuống con</h3>
${slide('rx-01', 9, 'Props là MỘT object cha đưa xuống con')}
<p>Cha viết thuộc tính lên thẻ, y như thuộc tính HTML:</p>
<pre><code class="language-tsx">&lt;TheBacSi bacSi={bs} noiBat /&gt;</code></pre>
<p>Ở Bài 1.1 bạn đã thấy bộ biên dịch biến dòng này thành gì: <code>_jsx(TheBacSi, { bacSi: bs, noiBat: true })</code>. Mọi thuộc tính thành <strong>một object</strong>. Khi render, React gọi <code>TheBacSi</code> với object đó làm tham số duy nhất. Con có thể đọc nó dưới tên <code>props</code>:</p>
<pre><code class="language-tsx">function TheBacSi(props: TheBacSiProps) {
  return &lt;h3&gt;{props.bacSi.ten}&lt;/h3&gt;;
}</code></pre>
<p>…nhưng gần như mọi dự án React tách nó ra ngay trong danh sách tham số:</p>
<pre><code class="language-tsx">function TheBacSi({ bacSi, noiBat }: TheBacSiProps) {
  return &lt;h3&gt;{bacSi.ten}&lt;/h3&gt;;
}</code></pre>
<div class="callout"><p><strong>JS nhắc nhanh: destructuring (tách object thành biến).</strong> <code>const { bacSi, noiBat } = props;</code> là cách viết tắt của <code>const bacSi = props.bacSi; const noiBat = props.noiBat;</code>. Viết cặp ngoặc nhọn thẳng trong danh sách tham số, <code>function TheBacSi({ bacSi, noiBat })</code>, làm đúng việc đó ngay lúc hàm được gọi. Bạn có thể đặt giá trị mặc định cho trường bị thiếu, <code>{ noiBat = false }</code>, và đổi tên, <code>{ bacSi: bs }</code>. Không có gì riêng của React ở đây — là JavaScript thuần mà code React dùng liên tục.</p></div>
<p>Ba luật về thứ bạn viết trên thẻ:</p>
<ul>
<li><strong>Chuỗi thì trong nháy kép</strong>: <code>ten="BS. Nguyễn Minh An"</code>.</li>
<li><strong>Mọi thứ khác trong ngoặc nhọn</strong>: số <code>namKinhNghiem={12}</code>, boolean <code>noiBat={true}</code>, object <code>bacSi={bs}</code>, biểu thức <code>noiBat={bs.namKinhNghiem &gt;= 15}</code>. <code>namKinhNghiem="12"</code> truyền <em>chuỗi</em> "12", không phải số — TypeScript sẽ bắt ở dưới.</li>
<li><strong>Chỉ ghi tên nghĩa là <code>true</code></strong>: <code>&lt;TheBacSi bacSi={bs} noiBat /&gt;</code> bằng <code>noiBat={true}</code>. Bỏ hẳn đi thì giá trị là <code>undefined</code>.</li>
</ul>
${SD.propsVi}

<h3>Kiểu props: interface, dấu hỏi và giá trị mặc định</h3>
${slide('rx-01', 10, 'Kiểu props: interface, dấu ? và giá trị mặc định')}
<p>Đây là component thẻ mà dự án dùng từ chương này trở đi:</p>
<pre><code class="language-tsx">// src/components/TheBacSi.tsx
import { TEN_CHUYEN_KHOA } from '../du-lieu/chuyen-khoa';
import type { BacSi } from '../types';

interface TheBacSiProps {
  bacSi: BacSi;
  noiBat?: boolean; // dấu ? = không bắt buộc
}

export function TheBacSi({ bacSi, noiBat = false }: TheBacSiProps) {
  return (
    &lt;article className={noiBat ? 'the-bac-si noi-bat' : 'the-bac-si'} aria-label={bacSi.ten}&gt;
      &lt;h3&gt;{bacSi.ten}&lt;/h3&gt;
      &lt;p className="chuyen-khoa"&gt;{TEN_CHUYEN_KHOA[bacSi.chuyenKhoa]}&lt;/p&gt;
      &lt;p&gt;{bacSi.namKinhNghiem} năm kinh nghiệm&lt;/p&gt;
      {noiBat &amp;&amp; &lt;p className="nhan"&gt;Bác sĩ lâu năm&lt;/p&gt;}
      &lt;p className="gioi-thieu"&gt;{bacSi.gioiThieu}&lt;/p&gt;
    &lt;/article&gt;
  );
}</code></pre>
<ul>
<li><strong><code>interface TheBacSiProps</code></strong> là hợp đồng của component: nó cần một <code>bacSi</code> kiểu <code>BacSi</code>, và có thể nhận <code>noiBat</code>. Đặt tên <code>&lt;TênComponent&gt;Props</code> là quy ước phổ biến; nó nằm cùng file, chưa export cho tới khi file khác cần.</li>
<li><strong><code>noiBat?: boolean</code></strong> — dấu hỏi làm prop thành không bắt buộc. Kiểu thật của nó khi đó là <code>boolean | undefined</code>.</li>
<li><strong><code>noiBat = false</code></strong> trong phần tách object cho giá trị mặc định, nên bên trong hàm <code>noiBat</code> luôn là boolean. Cách này thay cho kiểu cũ <code>TheBacSi.defaultProps = { … }</code>, thứ React 19 không còn hỗ trợ cho function component.</li>
<li><strong><code>aria-label={bacSi.ten}</code></strong> cho mỗi <code>&lt;article&gt;</code> một cái tên đọc được, để trình đọc màn hình — và test dùng <code>getByRole('article', { name: … })</code> — phân biệt được các thẻ.</li>
<li><strong><code>className={noiBat ? 'a' : 'b'}</code></strong> — toán tử ba ngôi (<code>điều_kiện ? nếu_đúng : nếu_sai</code>) trong ngoặc nhọn chọn class CSS.</li>
</ul>
<p>Nhãn chuyên khoa lấy từ một bảng tra:</p>
<pre><code class="language-ts">// src/du-lieu/chuyen-khoa.ts
import type { ChuyenKhoa } from '../types';

export const TEN_CHUYEN_KHOA: Record&lt;ChuyenKhoa, string&gt; = {
  noi: 'Nội tổng quát',
  nhi: 'Nhi',
  'da-lieu': 'Da liễu',
  'rang-ham-mat': 'Răng hàm mặt',
};</code></pre>
<p><code>Record&lt;ChuyenKhoa, string&gt;</code> nghĩa là "một object có đúng một chuỗi cho <em>mỗi</em> giá trị của <code>ChuyenKhoa</code>". Nó có ích đúng vào ngày có người thêm một chuyên khoa vào union mà quên nhãn. Chúng tôi xoá dòng cuối để xem:</p>
<div class="out">src/du-lieu/chuyen-khoa.ts(3,14): error TS2741: Property '"rang-ham-mat"' is missing in type '{ noi: string; nhi: string; 'da-lieu': string; }' but required in type 'Record&lt;ChuyenKhoa, string&gt;'.</div>
<p>Không có kiểu <code>Record</code>, thẻ của BS. Phạm Ngọc Lan sẽ lặng lẽ hiện một dòng chuyên khoa trống.</p>
<div class="callout"><p><strong>Vì sao phải <code>import type</code>?</strong> Kiểu chỉ tồn tại lúc TypeScript kiểm code; nó bị xoá khỏi JavaScript chạy thật. Template Vite bật <code>verbatimModuleSyntax</code>, thứ bắt bạn nói rõ điều đó: <code>import type { BacSi } from '../types'</code>. Nhờ vậy công cụ đóng gói không bao giờ cố import một thứ không tồn tại lúc chạy. Quên chữ <code>type</code> là ra lỗi TS1484 — xem ở phần <code>children</code> bên dưới.</p></div>

<h3>tsc bắt lỗi props trước khi trình duyệt kịp chạy gì</h3>
${slide('rx-01', 11, 'tsc bắt lỗi props trước khi trình duyệt kịp chạy')}
<p>Chúng tôi viết bốn lỗi kinh điển vào một file nháp, <code>src/vi-du/LoiProps.tsx</code> (dòng 7–10; phần chú thích chỉ thêm ở đây cho dễ đọc, file thật không có):</p>
<pre><code class="language-tsx">&lt;TheBacSi /&gt;                                                  {/* dòng 7: quên prop bắt buộc */}
&lt;TheBacSi bacSi={danhSachBacSi[0]} noiBat="true" /&gt;           {/* dòng 8: chuỗi, không phải boolean */}
&lt;TheBacSi bacSi={danhSachBacSi[0]} noiBac /&gt;                  {/* dòng 9: gõ nhầm tên prop */}
&lt;TheBacSi bacSi={{ ...danhSachBacSi[0], namKinhNghiem: '12' }} /&gt; {/* dòng 10: '12' là chuỗi */}</code></pre>
<div class="out">$ npx tsc -b
src/vi-du/LoiProps.tsx(7,8): error TS2741: Property 'bacSi' is missing in type '{}' but required in type 'TheBacSiProps'.
src/vi-du/LoiProps.tsx(8,42): error TS2322: Type 'string' is not assignable to type 'boolean | undefined'.
src/vi-du/LoiProps.tsx(9,42): error TS2322: Type '{ bacSi: BacSi; noiBac: true; }' is not assignable to type 'IntrinsicAttributes &amp; TheBacSiProps'.
  Property 'noiBac' does not exist on type 'IntrinsicAttributes &amp; TheBacSiProps'. Did you mean 'noiBat'?
src/vi-du/LoiProps.tsx(10,47): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p>Cách đọc — chúng đều theo cùng một khuôn:</p>
<ul>
<li><strong>TS2741 "Property X is missing"</strong> (thiếu thuộc tính X) — bạn bỏ sót một prop bắt buộc. <code>'{}'</code> là object props bạn thật sự đã truyền (rỗng).</li>
<li><strong>TS2322 "Type A is not assignable to type B"</strong> (kiểu A không gán được cho kiểu B) — bạn truyền giá trị sai kiểu. Ở dòng 8, <code>"true"</code> trong nháy là chuỗi; hãy viết <code>noiBat</code> hoặc <code>noiBat={true}</code>.</li>
<li><strong>"does not exist on type … Did you mean"</strong> (không có trong kiểu… có phải ý bạn là) — gõ nhầm. Không có TypeScript, <code>noiBac</code> bị lặng lẽ bỏ qua và nhãn không bao giờ hiện.</li>
<li><code>IntrinsicAttributes</code> trong thông báo là bộ thuộc tính mà mọi component đều nhận (<code>key</code>) — đọc thì cứ bỏ qua.</li>
</ul>
<p>Editor hiện đúng những lỗi này thành gạch chân đỏ ngay khi bạn gõ, và đó thường là nơi bạn gặp chúng. <code>npx tsc -b</code> là lệnh CI chạy (xem <code>/courses/github-actions</code>), nên lỗi không lọt được vào nhánh chính kể cả khi có người lờ gạch đỏ đi.</p>
<p><strong>Còn PropTypes?</strong> FER202 dạy cách kiểm lúc chạy: <code>TheBacSi.propTypes = { namKinhNghiem: PropTypes.number.isRequired }</code>. Chúng tôi cài tạm <code>prop-types</code> 15.8.1, viết một component JavaScript thuần có propTypes như vậy, rồi truyền <code>namKinhNghiem="mười hai"</code> và không truyền <code>ten</code>:</p>
<div class="out">stdout | src/vi-du/PropTypesCu.test.jsx &gt; React 19: propTypes bị bỏ qua, truyền sai kiểu không ai kêu
DOM: &lt;p&gt; · mười hai năm&lt;/p&gt;
số lần console.error: 0
 ✓ src/vi-du/PropTypesCu.test.jsx &gt; React 19: propTypes bị bỏ qua, truyền sai kiểu không ai kêu</div>
<p>Không một cảnh báo. Hướng dẫn nâng cấp React 19 nói thẳng: phần kiểm <code>propTypes</code> đã bị gỡ khỏi gói React "và dùng chúng sẽ bị bỏ qua trong im lặng". Một dự án FER202 nâng lên React 19 vì thế mất sạch phần kiểm mà không có thông báo nào — thêm một lý do ngành chuyển sang TypeScript, thứ kiểm <em>trước khi</em> code chạy và không tốn gì lúc chạy.</p>

<h3>children: thứ nằm giữa thẻ mở và thẻ đóng</h3>
${slide('rx-01', 12, 'children: thứ nằm giữa thẻ mở và thẻ đóng')}
<p>Có những component là cái hộp chứa: khung thẻ, hộp thoại, bố cục trang. Chúng không biết trước nội dung. React đưa mọi thứ bạn lồng giữa hai thẻ vào một prop đặc biệt tên <code>children</code> (con):</p>
<pre><code class="language-tsx">// src/vi-du/Khung.tsx
import type { ReactNode } from 'react';

interface KhungProps {
  tieuDe: string;
  children: ReactNode;
}

export function Khung({ tieuDe, children }: KhungProps) {
  return (
    &lt;section className="khung"&gt;
      &lt;h2&gt;{tieuDe}&lt;/h2&gt;
      {children}
    &lt;/section&gt;
  );
}

// Dùng:
&lt;Khung tieuDe="Giờ mở cửa"&gt;
  &lt;p&gt;Thứ Hai – thứ Bảy: 7:30–20:00&lt;/p&gt;
  &lt;p&gt;Chủ nhật: nghỉ&lt;/p&gt;
&lt;/Khung&gt;</code></pre>
<p>Hai thẻ <code>&lt;p&gt;</code> đi vào dưới tên <code>children</code> và được đặt đúng chỗ <code>{children}</code> xuất hiện. Test kiểm cả tiêu đề lẫn chữ lồng bên trong (✓ <code>Khung vẽ tiêu đề và mọi thứ nằm giữa thẻ mở và thẻ đóng</code>).</p>
${SD.childrenVi}
<ul>
<li><strong><code>ReactNode</code></strong> là kiểu rộng cho "mọi thứ React vẽ được": JSX, chuỗi, số, mảng những thứ đó, <code>null</code>, <code>undefined</code>, boolean. Gần như luôn là kiểu đúng cho <code>children</code>.</li>
<li><strong><code>ReactElement</code></strong> hẹp hơn — chỉ phần tử JSX, không nhận chữ trơn. Trang TypeScript của React lưu ý bạn không thể dùng kiểu để đòi "chỉ nhận con là <code>&lt;li&gt;</code>"; đừng cố.</li>
</ul>
<p>Quên chữ <code>type</code> khi import là dự án này từ chối build:</p>
<div class="out">$ npx tsc -b
src/vi-du/LoiImport.tsx(1,10): error TS1484: 'ReactNode' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.</div>
<p>("ReactNode là một kiểu, phải import bằng import chỉ-kiểu khi bật verbatimModuleSyntax".) Children hay prop thường: dùng <code>children</code> khi nội dung là markup cha tự do lắp ghép (<code>&lt;Khung&gt;…&lt;/Khung&gt;</code>); dùng prop có tên khi đó là dữ liệu mà component biết cách trình bày (<code>bacSi={bs}</code>). Thẻ nhận cả object bác sĩ thì trình bày được nhất quán ở mọi nơi; khung nhận children thì chứa được bất cứ gì.</p>

<h3>Chỉ hiện đôi khi — và số 0 hiện lên màn hình</h3>
${slide('rx-01', 13, 'Bẫy số ở vế trái: chữ 0 hiện ra màn hình')}
<p>Trong <code>TheBacSi</code>, nhãn chỉ hiện với bác sĩ lâu năm:</p>
<pre><code class="language-tsx">{noiBat &amp;&amp; &lt;p className="nhan"&gt;Bác sĩ lâu năm&lt;/p&gt;}</code></pre>
<p>Trong JavaScript, <code>a &amp;&amp; b</code> trả về <code>a</code> nếu <code>a</code> là "falsy" (được coi như sai: <code>false</code>, <code>0</code>, <code>""</code>, <code>null</code>, <code>undefined</code>), ngược lại trả về <code>b</code>. React không vẽ gì cho <code>false</code>, <code>null</code> và <code>undefined</code>, nên khi <code>noiBat</code> là <code>false</code> thì không có gì hiện ra. Mẫu này an toàn <strong>chỉ khi vế trái là boolean thật</strong>. Với một con số thì thế này:</p>
<pre><code class="language-tsx">// src/vi-du/SoKhong.tsx
export function SoLichSai({ soLich }: { soLich: number }) {
  return &lt;div&gt;{soLich &amp;&amp; &lt;p&gt;Bạn có {soLich} lịch hẹn&lt;/p&gt;}&lt;/div&gt;;
}

export function SoLichDung({ soLich }: { soLich: number }) {
  return &lt;div&gt;{soLich &gt; 0 &amp;&amp; &lt;p&gt;Bạn có {soLich} lịch hẹn&lt;/p&gt;}&lt;/div&gt;;
}</code></pre>
<div class="out">SoLichSai  soLich=0 → "&lt;div&gt;0&lt;/div&gt;"
SoLichDung soLich=0 → "&lt;div&gt;&lt;/div&gt;"
 ✓ src/vi-du/SoKhong.test.tsx &gt; soLich = 0: bản sai in ra chữ "0", bản đúng không in gì</div>
<p><code>0 &amp;&amp; …</code> cho ra <code>0</code>, mà React <em>có</em> vẽ số — nên một chữ "0" trơ trọi hiện dưới tiêu đề (slide có ảnh chụp thật). TypeScript không kêu: vẽ một con số là hợp lệ. Sửa bằng cách biến điều kiện thành boolean: <code>soLich &gt; 0 &amp;&amp; …</code>, hoặc dùng toán tử ba ngôi <code>{soLich &gt; 0 ? &lt;p&gt;…&lt;/p&gt; : null}</code>. Bẫy y hệt nằm trong <code>{danhSach.length &amp;&amp; …}</code> khi danh sách rỗng.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — chữ "0" lạc trong ô tóm tắt lịch hẹn.</strong> Một bệnh nhân chưa có lịch hẹn nào mở ô tóm tắt và thấy đúng một chữ "0" dưới tiêu đề. Code là <code>{lichHen.length &amp;&amp; &lt;DanhSachLichHen … /&gt;}</code>, viết vào lúc tài khoản test nào cũng có ít nhất một lịch. Không lỗi, không cảnh báo, và ảnh chụp trong báo lỗi trông như lệch giao diện. Luật nhớ nhanh: vế trái của <code>&amp;&amp;</code> trong JSX phải là boolean — <code>length &gt; 0</code>, <code>Boolean(x)</code>, hoặc một phép so sánh.</div>

<h3>Props chỉ đọc: .sort() đảo luôn mảng của cha</h3>
${slide('rx-01', 14, 'Props chỉ đọc: .sort() đảo luôn mảng của cha')}
<p>Props chảy một chiều: cha sở hữu dữ liệu, con đọc nó. Con không được sửa. Với chuỗi và số thì thật ra bạn cũng không sửa được — gán giá trị mới cho <code>bacSi</code> chỉ đổi biến cục bộ của bạn. Với <strong>object và mảng</strong>, con nhận một tham chiếu tới <em>chính</em> object mà cha đang giữ, nên sửa nó là sửa luôn dữ liệu của cha. Cách vô tình nhất để làm vậy là <code>.sort()</code>, thứ sắp xếp mảng <em>tại chỗ</em>:</p>
<pre><code class="language-tsx">// src/vi-du/SapXep.tsx
export function TheoKinhNghiemSai({ danhSach }: { danhSach: BacSi[] }) {
  const sapXep = danhSach.sort((a, b) =&gt; b.namKinhNghiem - a.namKinhNghiem); // ❌ sửa mảng gốc
  return &lt;ol&gt;{sapXep.map((bs) =&gt; &lt;li key={bs.id}&gt;{bs.ten}&lt;/li&gt;)}&lt;/ol&gt;;
}

export function TheoKinhNghiemDung({ danhSach }: { danhSach: BacSi[] }) {
  const sapXep = danhSach.toSorted((a, b) =&gt; b.namKinhNghiem - a.namKinhNghiem); // ✅ mảng MỚI
  return &lt;ol&gt;{sapXep.map((bs) =&gt; &lt;li key={bs.id}&gt;{bs.ten}&lt;/li&gt;)}&lt;/ol&gt;;
}</code></pre>
<p>Test đưa cho mỗi component một bản chép của sáu bác sĩ và in mảng của cha trước và sau khi render:</p>
<div class="out">$ npx vitest run src/vi-du/SapXep --reporter=verbose
trước render: bs-1 bs-2 bs-3 bs-4 bs-5 bs-6
sau render  : bs-6 bs-4 bs-1 bs-2 bs-3 bs-5
toSorted, sau render: bs-1 bs-2 bs-3 bs-4 bs-5 bs-6
 ✓ src/vi-du/SapXep.test.tsx &gt; .sort() trong component làm đổi thứ tự mảng của CHA
 ✓ src/vi-du/SapXep.test.tsx &gt; .toSorted() để nguyên mảng của cha</div>
<p>Chỉ mới <em>hiển thị</em> một danh sách đã sắp xếp, danh sách của cha cũng bị sắp xếp theo. Mọi component khác dùng chung mảng đó — lưới bác sĩ ở trang chủ, bộ lọc ở Chương 2 — giờ hiện bác sĩ theo thứ tự khác, dù chẳng ai đụng vào code của chúng. Đây cũng là vi phạm tính thuần ở Bài 1.1: render đã sửa một thứ có từ trước.</p>
${SD.sortVi}
<div class="callout"><p><strong>JS nhắc nhanh: hàm sửa mảng tại chỗ và hàm trả mảng mới.</strong> <code>sort</code>, <code>reverse</code>, <code>splice</code>, <code>push</code>, <code>pop</code> sửa chính mảng mà bạn gọi chúng. <code>toSorted</code>, <code>toReversed</code>, <code>toSpliced</code> (ES2023, có sẵn nhờ <code>lib: ["ES2023"]</code> của dự án) cùng <code>map</code>, <code>filter</code>, <code>slice</code>, <code>concat</code> trả về mảng mới và để nguyên mảng gốc. Cú pháp spread (trải) <code>[...danhSach]</code> chép mảng sang một mảng mới, nên <code>[...danhSach].sort(…)</code> là cách viết cùng bản sửa trước năm 2023. Chương 2 dựa vào đúng chuyện này khi phải cập nhật mảng trong state mà không sửa tại chỗ.</p></div>
<p>Một lối tắt liên quan là trải object vào props: <code>&lt;TheBacSi {...{ bacSi: bs, noiBat: true }} /&gt;</code> truyền mỗi trường thành một prop riêng. Tiện khi một component bọc chuyển tiếp props mà nó không quan tâm, nhưng nó giấu mất component nhận những gì; trong code ứng dụng, ưu tiên ghi props rõ ràng.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202 bạn khai kiểu props lúc chạy bằng <code>PropTypes</code> (<code>TheBacSi.propTypes = { … }</code>) và giá trị mặc định bằng <code>defaultProps</code>, và cảnh báo chỉ hiện trên console khi giá trị sai thật sự tới. → Đi làm, props được gõ kiểu bằng <code>interface</code> TypeScript, giá trị mặc định viết trong phần tách object (<code>{ noiBat = false }</code>), và <code>npx tsc -b</code> chạy trong CI cho mọi pull request. · <em>Vì sao:</em> TypeScript bắt lỗi ngay khi gõ và trước khi merge, cho mọi chỗ gọi cùng lúc; còn React 19 lặng lẽ bỏ qua <code>propTypes</code> và <code>defaultProps</code> trên function component (đo ở trên: 0 cảnh báo). PropTypes không sai — nó là công cụ tốt nhất trước khi TypeScript phổ biến — và bạn vẫn sẽ gặp nó ở dự án chỉ có JavaScript; khi chuyển đổi một dự án như vậy, React có sẵn codemod đổi PropTypes sang TypeScript.</p></div>

<h3>Chạy thử từng bước: dựng TheBacSi</h3>
<ol>
<li>Chép <code>src/types.ts</code> của khoá vào dự án (khối ở đầu bài này cùng bốn kiểu còn lại liệt kê ở phần dự án của chương).</li>
<li>Tạo <code>src/du-lieu/chuyen-khoa.ts</code> với <code>TEN_CHUYEN_KHOA: Record&lt;ChuyenKhoa, string&gt;</code>.</li>
<li>Tạo <code>src/components/TheBacSi.tsx</code> với interface và component ở trên. Vẽ một thẻ trong <code>App.tsx</code> với object bác sĩ viết thẳng tại chỗ.</li>
<li>Truyền <code>noiBat</code> chỉ bằng tên, rồi xoá đi. Kiểm nhãn hiện ra rồi biến mất.</li>
<li>Cố ý viết <code>noiBat="true"</code> rồi chạy <code>npx tsc -b</code>; đọc thông báo TS2322, rồi sửa.</li>
<li>Viết <code>TheBacSi.test.tsx</code> với một bác sĩ giả (<code>chuyenKhoa: 'da-lieu'</code>) và kiểm thẻ hiện "Da liễu" và "7 năm kinh nghiệm".</li>
</ol>

<h3>Khi nào dùng props — và khi nào KHÔNG</h3>
<ul>
<li><strong>Dùng</strong> props cho mọi thứ component cần từ bên ngoài: dữ liệu để hiện, cờ làm đổi dáng vẻ, và (Chương 2) hàm để gọi khi có chuyện xảy ra.</li>
<li><strong>Truyền cả object, không truyền mười trường</strong>, khi component "nói về" object đó: <code>bacSi={bs}</code> thay vì <code>ten=… chuyenKhoa=… namKinhNghiem=…</code>. Khi <code>BacSi</code> có thêm trường, chỉ thẻ phải sửa.</li>
<li><strong>Đừng</strong> đẩy một prop qua năm tầng chỉ để tầng dưới cùng đọc — đó là "prop drilling" (khoan props); Chương 5 có Context và Zustand cho chuyện này. Ở Chương 1 cây chỉ sâu ba tầng, props thường là đúng.</li>
<li><strong>Đừng</strong> chép prop vào state "để sửa được" — Chương 2 giải thích vì sao làm vậy tạo ra hai nguồn sự thật.</li>
</ul>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Props và state khác nhau thế nào?</strong><br>Đ: Props là đầu vào cha truyền xuống; component đọc và không được sửa. State là dữ liệu component tự sở hữu và thay đổi theo thời gian bằng hàm set (Chương 2), việc đổi state làm component render lại. Cùng một giá trị thường là state ở cha và là prop ở con. Giá trị nào không bao giờ đổi bên trong component thì là prop hoặc hằng, không phải state.</p>
<p><strong>H: Gõ kiểu cho <code>children</code> trong TypeScript thế nào?</strong><br>Đ: <code>children: ReactNode</code> trong interface props, import bằng <code>import type { ReactNode } from 'react'</code>. <code>ReactElement</code> hẹp hơn (chỉ JSX). Không thể dùng TypeScript để giới hạn children vào một loại phần tử cụ thể.</p>
<p><strong>H: Vì sao <code>{items.length &amp;&amp; &lt;List /&gt;}</code> có thể hiện số 0?</strong><br>Đ: <code>&amp;&amp;</code> trả về vế trái khi vế trái falsy; <code>0</code> là falsy nhưng React có vẽ số, nên chữ "0" hiện ra. Dùng <code>items.length &gt; 0 &amp;&amp; …</code> hoặc toán tử ba ngôi.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> phòng khám muốn cùng một thẻ bác sĩ ở ba chỗ. Làm nó thành một component có kiểu và chứng minh hợp đồng của nó.</p><ol>
<li>Dựng <code>TheBacSi</code> theo mục "Chạy thử từng bước".</li>
<li>Viết ba test: hiện tên, chuyên khoa tiếng Việt và số năm; không có nhãn khi thiếu <code>noiBat</code>; có nhãn khi có <code>noiBat</code>.</li>
<li>Tạo <code>Khung</code> với <code>tieuDe</code> và <code>children</code>; dùng nó trong <code>App</code> cho ô giờ mở cửa.</li>
<li>Viết <code>SoLichSai</code> với <code>soLich={0}</code>, nhìn chữ "0" trên trình duyệt, rồi sửa.</li>
<li>Viết một component sắp xếp prop <code>danhSach</code> bằng <code>.sort()</code>; thêm một test đỏ vì mảng của cha bị đổi; chuyển sang <code>toSorted</code> và nhìn nó xanh.</li>
</ol><p><strong>Đạt khi:</strong> <code>npx tsc -b</code> không in gì; <code>npx vitest run</code> xanh với ít nhất ba test của thẻ; trình duyệt không còn chữ "0" trong ô lịch hẹn; và bạn chỉ được vào thông báo <code>TS2322</code> mình cố ý tạo ra và nói nó nghĩa là gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">props (thuộc tính)</span><span class="v">object duy nhất chứa đầu vào mà cha truyền cho component; con chỉ được đọc</span></div>
<div class="kv"><span class="k">destructuring (tách object)</span><span class="v"><code>({ bacSi, noiBat = false })</code> — rút trường ra thành biến, có giá trị mặc định</span></div>
<div class="kv"><span class="k">prop không bắt buộc</span><span class="v"><code>noiBat?: boolean</code> — được bỏ trống; khi đó giá trị là <code>undefined</code></span></div>
<div class="kv"><span class="k"><code>children</code></span><span class="v">prop đặc biệt chứa mọi thứ lồng giữa hai thẻ của component</span></div>
<div class="kv"><span class="k"><code>ReactNode</code></span><span class="v">kiểu của mọi thứ React vẽ được: JSX, chữ, số, mảng, <code>null</code></span></div>
<div class="kv"><span class="k"><code>import type</code></span><span class="v">chỉ nhập kiểu TypeScript; dự án này bắt buộc do <code>verbatimModuleSyntax</code> (TS1484)</span></div>
<div class="kv"><span class="k"><code>Record&lt;K, V&gt;</code></span><span class="v">object có một <code>V</code> cho mỗi khoá trong union <code>K</code> — thiếu khoá là lỗi</span></div>
<div class="kv"><span class="k">mutation (sửa tại chỗ)</span><span class="v">thay đổi object/mảng đang có (<code>sort</code>, <code>push</code>) thay vì tạo cái mới</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thuộc tính trên thẻ component thành một object props, đưa vào làm tham số đầu tiên của hàm; tách nó ngay trong danh sách tham số.</li>
<li>Gõ kiểu props bằng <code>interface</code>; <code>?</code> đánh dấu prop không bắt buộc; giá trị mặc định viết trong phần tách object.</li>
<li><code>tsc</code> báo thiếu prop (TS2741), sai kiểu và gõ nhầm (TS2322) trước khi bất cứ gì chạy; React 19 lặng lẽ bỏ qua <code>propTypes</code> (đo: 0 cảnh báo).</li>
<li><code>children</code> chở JSX lồng bên trong; gõ kiểu <code>ReactNode</code> và nhập kiểu bằng <code>import type</code>.</li>
<li>Vế trái của <code>&amp;&amp;</code> trong JSX phải là boolean, không thì chữ "0" hiện lên màn hình.</li>
<li>Props chỉ đọc: <code>.sort()</code> trên một prop đã đảo thứ tự mảng của cha; dùng <code>toSorted</code> hoặc <code>[...mang].sort()</code>.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Passing Props to a Component</span><span class="lc-sub">react.dev/learn/passing-props-to-a-component — đọc props, giá trị mặc định, trải props, children, và props thay đổi theo thời gian.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Using TypeScript</span><span class="lc-sub">react.dev/learn/typescript — gõ kiểu props của component, <code>ReactNode</code> và <code>ReactElement</code> cho children.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Conditional Rendering</span><span class="lc-sub">react.dev/learn/conditional-rendering — <code>&amp;&amp;</code> và toán tử ba ngôi, cùng lưu ý "đừng đặt số ở vế trái của &amp;&amp;".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React 19 Upgrade Guide</span><span class="lc-sub">react.dev/blog/2024/04/25/react-19-upgrade-guide — "Removed: propTypes and defaultProps for functions", kèm codemod sang TypeScript.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Khoá TypeScript trên trang này</span><span class="lc-sub">/courses/typescript — interface, union, <code>Record</code> và import chỉ-kiểu, đào sâu.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — Rendering lists and keys: map, stable keys, and the key={index} bug|||1.3 — Hiển thị danh sách và key: map, key ổn định, và bug key={index}',
      slug: 'rx-1-3-danh-sach',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Biến mảng dữ liệu thành mảng JSX bằng map; cảnh báo thiếu key và key trùng (output thật); bug key={index} khi chèn lên đầu danh sách, chụp thật trên trình duyệt; React ghép phần tử cũ với mới theo key; chọn nguồn key; key đặt ở đâu và vì sao key không phải prop.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Rendering lists and keys: map, stable keys, and the key={index} bug</h2>
<p class="lead">Almost every screen shows a list: doctors, time slots, appointments. In React you turn an array of data into an array of JSX with <code>map</code>, and give each item a <code>key</code> — a string that says "this row is doctor bs-4", so React can follow the row when the list changes. Get the key wrong and the list still looks right… until someone inserts, deletes or sorts, and what a user typed moves to another person&#39;s row.</p>

<p>The clinic&#39;s home page must show six doctors. Lesson 1.2 gave us <code>TheBacSi</code>; this lesson draws the whole team from <code>src/du-lieu/bac-si.ts</code>, then deliberately gets the key wrong in the three ways that happen in real projects and records what each does. The most important recording is a browser screenshot: a medical note typed for one doctor sitting next to a different doctor&#39;s name.</p>

<h3>map turns an array of data into an array of JSX</h3>
${slide('rx-01', 15, 'map turns an array of data into an array of JSX')}
<p>The data is a plain TypeScript array:</p>
<pre><code class="language-ts">// src/du-lieu/bac-si.ts (first two of six)
import type { BacSi } from '../types';

export const danhSachBacSi: BacSi[] = [
  { id: 'bs-1', ten: 'BS. Nguyễn Minh An', chuyenKhoa: 'noi', namKinhNghiem: 12, gioiThieu: 'Khám và theo dõi bệnh mạn tính: …' },
  { id: 'bs-2', ten: 'BS. Trần Thu Hà', chuyenKhoa: 'nhi', namKinhNghiem: 8, gioiThieu: 'Khám trẻ từ sơ sinh tới 15 tuổi, …' },
  // bs-3 … bs-6
];</code></pre>
<p>And the list component the project keeps from this chapter on:</p>
<pre><code class="language-tsx">// src/components/DanhSachBacSi.tsx
import type { BacSi } from '../types';
import { TheBacSi } from './TheBacSi';

interface DanhSachBacSiProps {
  danhSach: BacSi[];
}

export function DanhSachBacSi({ danhSach }: DanhSachBacSiProps) {
  if (danhSach.length === 0) {
    return &lt;p&gt;Chưa có bác sĩ nào.&lt;/p&gt;;
  }
  return (
    &lt;section aria-labelledby="tieu-de-bac-si"&gt;
      &lt;h2 id="tieu-de-bac-si"&gt;Đội ngũ bác sĩ ({danhSach.length})&lt;/h2&gt;
      &lt;div className="luoi-bac-si"&gt;
        {danhSach.map((bs) =&gt; (
          &lt;TheBacSi key={bs.id} bacSi={bs} noiBat={bs.namKinhNghiem &gt;= 15} /&gt;
        ))}
      &lt;/div&gt;
    &lt;/section&gt;
  );
}</code></pre>
<div class="callout"><p><strong>JS quick reminder: <code>map</code>, <code>filter</code> and arrow functions.</strong> <code>danhSach.map((bs) =&gt; …)</code> calls the arrow function once for each element, passing it as <code>bs</code>, and collects the return values into a <strong>new array</strong> of the same length. <code>(bs) =&gt; ( &lt;TheBacSi … /&gt; )</code> is an arrow function whose body is a single expression in parentheses, returned automatically; with braces <code>(bs) =&gt; { … }</code> you must write <code>return</code> yourself — forgetting it is a classic "my list is empty" bug. <code>filter</code> works the same way but keeps only the elements for which the function returns <code>true</code>: <code>danhSach.filter((bs) =&gt; bs.chuyenKhoa === 'nhi')</code> gives the two paediatricians. Chain them: <code>danhSach.filter(…).map(…)</code>.</p></div>
<p>Notes on the component:</p>
<ul>
<li><strong>An array of JSX inside braces is rendered in order.</strong> <code>{[&lt;A /&gt;, &lt;B /&gt;]}</code> draws A then B. <code>map</code> is simply the usual way to produce that array.</li>
<li><strong>The early <code>return</code> for an empty list</strong> is plain JavaScript: a component can return different JSX in different cases. It also avoids the "0 on screen" trap from Lesson 1.2 — we never write <code>danhSach.length &amp;&amp; …</code>.</li>
<li><strong><code>aria-labelledby</code></strong> links the <code>&lt;section&gt;</code> to its heading, so screen readers announce "Đội ngũ bác sĩ" as the region&#39;s name (Chapter 8 covers accessibility).</li>
<li><strong>The derived value <code>noiBat={bs.namKinhNghiem &gt;= 15}</code></strong> is computed while rendering, not stored — the data file does not need a "featured" field that could disagree with the years.</li>
</ul>
${SD.mapEn}

<h3>Forget the key: everything renders, and React warns</h3>
${slide('rx-01', 16, 'Forget the key: all six rows render, React warns in the console')}
<p>Here is the same kind of list without a key:</p>
<pre><code class="language-tsx">// src/vi-du/ThieuKey.tsx
export function DanhSachThieuKey() {
  return (
    &lt;ul&gt;
      {danhSachBacSi.map((bs) =&gt; (
        &lt;li&gt;{bs.ten}&lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre>
<p>TypeScript does not complain — a missing key is not a type error. The test renders it, checks that six <code>&lt;li&gt;</code> appear, and captures the console:</p>
<div class="out">$ npx vitest run src/vi-du/ThieuKey --reporter=verbose
stdout | src/vi-du/ThieuKey.test.tsx &gt; thiếu key: vẫn vẽ đủ, nhưng React cảnh báo trên console
Each child in a list should have a unique "key" prop.
Check the render method of &#96;DanhSachThieuKey&#96;. See https://react.dev/link/warning-keys for more information.
 ✓ src/vi-du/ThieuKey.test.tsx &gt; thiếu key: vẫn vẽ đủ, nhưng React cảnh báo trên console</div>
<p>All six names are on screen. It is only a warning, and a list that never changes will never misbehave. That is exactly why people ignore it — and then the list becomes editable. The message names the component (<code>DanhSachThieuKey</code>) whose <code>map</code> needs the key; in the browser you see the same text in the DevTools console, in development builds only.</p>
<p>The fix is one attribute on the element that <code>map</code> returns: <code>&lt;li key={bs.id}&gt;</code>.</p>

<h3>key={index} and an insert at the top: the note jumps to someone else</h3>
${slide('rx-01', 17, 'key={index} plus an insert at the top: the note jumps to someone else')}
<p>The most common "fix" for the warning is the second argument of <code>map</code>, the index: <code>map((bs, index) =&gt; &lt;li key={index}&gt;…)</code>. The warning disappears. To see what it costs, the practice project has a page with two identical lists side by side — left with <code>key={index}</code>, right with <code>key={bs.id}</code> — each row having a text input for a note, and a button that inserts a new doctor, BS. Đỗ Thanh Tâm, at the <strong>top</strong>:</p>
<pre><code class="language-tsx">// src/vi-du/KeyIndex.tsx (the list part)
function Cot({ tieuDe, ds, dungIndex }: { tieuDe: string; ds: BacSi[]; dungIndex: boolean }) {
  return (
    &lt;div className="cot"&gt;
      &lt;h2&gt;{tieuDe}&lt;/h2&gt;
      &lt;ul&gt;
        {ds.map((bs, index) =&gt; (
          &lt;li key={dungIndex ? index : bs.id}&gt;
            &lt;span&gt;{bs.ten}&lt;/span&gt;
            &lt;input aria-label={&#96;&#36;{dungIndex ? 'Cột index' : 'Cột id'}: ghi chú cho &#36;{bs.ten}&#96;} placeholder="ghi chú…" /&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/div&gt;
  );
}

// the button (useState — Chapter 2): setDs([bacSiMoi, ...ds])</code></pre>
<div class="callout"><p><strong>JS quick reminder: template literals and spread.</strong> A string in backticks, <code>&#96;ghi chú cho &#36;{bs.ten}&#96;</code>, inserts the value of the expression inside <code>&#36;{…}</code> — here it builds a different label for each row. <code>[bacSiMoi, ...ds]</code> builds a new array: the new doctor first, then every element of <code>ds</code> "spread" after it. The old array is not changed (Lesson 1.2).</p></div>
<p>We typed "dị ứng penicillin" (penicillin allergy) into BS. Nguyễn Minh An&#39;s note in <em>both</em> columns, then clicked "Thêm bác sĩ lên đầu". The test reads every row afterwards:</p>
<div class="out">key={index}:
  BS. Đỗ Thanh Tâm → "dị ứng penicillin"
  BS. Nguyễn Minh An → ""
  BS. Trần Thu Hà → ""
  BS. Lê Quốc Bảo → ""
key={bs.id}:
  BS. Đỗ Thanh Tâm → ""
  BS. Nguyễn Minh An → "dị ứng penicillin"
  BS. Trần Thu Hà → ""
  BS. Lê Quốc Bảo → ""
 ✓ src/vi-du/KeyIndex.test.tsx &gt; chèn lên đầu: ghi chú ở cột key={index} dính sang bác sĩ khác</div>
<p>The slide shows the same moment as a real Chromium screenshot. In the left column, the allergy note now sits next to the <strong>new</strong> doctor, and BS. Nguyễn Minh An&#39;s note is empty. No error, no warning — the warning went away when we added <code>key={index}</code>. In a clinic app, that is a note attached to the wrong patient or the wrong doctor.</p>
<div class="pitfall co-tieu-de"><strong>Trap — ticked boxes that jump rows.</strong> A to-do list for the reception desk uses <code>key={index}</code>. A receptionist ticks "called back" on the third patient, then another receptionist deletes the first patient who cancelled. Every row moves up one, but the ticked checkbox stays in position three — now on a patient nobody has called. Anything that lives in the DOM or in a component&#39;s state (an input&#39;s text, a checkbox, focus, an open/closed toggle, an animation) follows the <em>key</em>, not the data. The symptom is always the same: "the value moved to the neighbouring row after I added/removed/sorted".</div>

<h3>Why: React matches old and new items by key, not by position</h3>
${slide('rx-01', 18, 'React matches old and new items by key, not by position')}
<p>When the list re-renders, React has the previous list of elements and the new one. It must decide, for each new element, "is this one of the elements I already have on screen (keep its DOM and state, update what changed) or a new one (create it)?" Among siblings, <strong>the key is the answer to "which one is it?"</strong>:</p>
<ul>
<li><strong>With <code>key={index}</code>:</strong> before the insert, keys 0, 1, 2 were An, Hà, Bảo. After, keys 0, 1, 2, 3 are Tâm, An, Hà, Bảo. React matches key 0 with key 0: "same element, the name text changed" — it updates the <code>&lt;span&gt;</code> to "Đỗ Thanh Tâm" and <em>keeps</em> the <code>&lt;input&gt;</code>, whose typed text lives in the DOM. Keys 1 and 2 get new names too. Only key 3 is new.</li>
<li><strong>With <code>key={bs.id}</code>:</strong> keys bs-1, bs-2, bs-3 exist before and after; <code>bs-7</code> is new. React creates one new row at the top and <em>moves</em> the other three, each with its own input. The note stays with bs-1.</li>
</ul>
${SD.ghepKeyEn}
<p>So an index key is not "wrong" in itself; it is <em>a claim that position is identity</em>. That claim is true for a list that never reorders, inserts or deletes — and false otherwise. React&#39;s documentation adds that if you do not give a key at all, React uses the index; the warning is React asking you to confirm that claim or give it a real identity.</p>
<p>A third wrong key is worse than both: <code>key={Math.random()}</code>. Every render produces new keys, so nothing ever matches and React rebuilds every row. The practice project measures it with one button that just re-renders the list:</p>
<div class="out">stdout | src/vi-du/KeyNgauNhien.test.tsx &gt; key ngẫu nhiên: vẽ lại một lần là mất chữ, và thẻ &lt;li&gt; là thẻ MỚI
cùng một ô input? false · giá trị sau khi vẽ lại: ""</div>
<p>After a single re-render, the input is a different DOM element (<code>cùng một ô input? false</code> — "same input? false") and the typed text is gone. Rebuilding every row on every render is also slow for long lists, and it throws away focus while the user is typing.</p>

<h3>Choosing a key: an id from the data; the index only for lists that never move</h3>
${slide('rx-01', 19, 'The best key is an id that already exists in the data')}
<p>The rules from React&#39;s documentation, with what each means for the clinic:</p>
<ul>
<li><strong>Keys must be unique among siblings</strong> — within one <code>map</code>, not across the whole app. Two different lists may both use <code>bs-1</code>.</li>
<li><strong>Keys must not change between renders</strong> — so never generate them during render (<code>Math.random()</code>, <code>crypto.randomUUID()</code> inside JSX).</li>
<li><strong>Take them from the data</strong>: an id from the database or API (<code>bs.id</code>, later <code>lichHen.id</code> from Chapter 6). If the client creates items (a patient adds several phone numbers in a form), give each one an id <em>when it is created</em>, e.g. <code>{ id: crypto.randomUUID(), so: '' }</code>, and store it with the item.</li>
<li><strong>Names are not ids.</strong> Two doctors can share a name. We tried <code>key={bs.ten}</code> with a copy of BS. Nguyễn Minh An under id bs-8:</li>
</ul>
<div class="out">Encountered two children with the same key, &#96;BS. Nguyễn Minh An&#96;. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.
DOM có 3 dòng</div>
<p>React warns that duplicates "may cause children to be duplicated and/or omitted" and calls the behaviour unsupported. It rendered three rows this time; do not rely on it.</p>
<p><strong>When the index is acceptable:</strong> the list is static (never reordered, filtered, inserted into or deleted from) and its rows hold no state — for example, the lines of a fixed address, or the steps of a printed instruction. React&#39;s own example is the lines of a poem. If you are unsure whether the list will ever change, it will; use an id.</p>
${SD.chonKeyEn}

<h3>Where the key goes — and why a component never sees it</h3>
${slide('rx-01', 20, 'The key goes where map is called, and never reaches props')}
<p>The key belongs on the element that <code>map</code> <strong>returns</strong>, because that is where React compares siblings:</p>
<pre><code class="language-tsx">// ✅ in DanhSachBacSi: the key is on &lt;TheBacSi&gt;, the element map returns
{danhSach.map((bs) =&gt; (
  &lt;TheBacSi key={bs.id} bacSi={bs} /&gt;
))}

// ❌ inside TheBacSi: too late — this &lt;article&gt; is an only child, it has no siblings to be told apart from
&lt;article key={bacSi.id}&gt;…&lt;/article&gt;</code></pre>
<p>If one item needs several sibling elements without a wrapper, the short Fragment <code>&lt;&gt;…&lt;/&gt;</code> cannot take a key; import <code>Fragment</code> and write <code>&lt;Fragment key={bs.id}&gt;…&lt;/Fragment&gt;</code>.</p>
<p><code>key</code> is reserved for React: it is <strong>not passed to your component as a prop</strong>. TypeScript says so if you try to read it:</p>
<div class="out">$ npx tsc -b
src/vi-du/LoiKey.tsx(2,34): error TS2339: Property 'key' does not exist on type '{ ten: string; }'.</div>
<p>And at run time, a component rendered as <code>&lt;DoProps key="bs-1" id="bs-1" ten="BS. Nguyễn Minh An" /&gt;</code> received:</p>
<div class="out">props nhận được: {"id":"bs-1","ten":"BS. Nguyễn Minh An"}</div>
<p>No <code>key</code>. If the child needs the id — to build a link, or to report which doctor was clicked — pass it again as a normal prop: <code>&lt;DongBacSi key={bs.id} id={bs.id} … /&gt;</code>. In the project, <code>TheBacSi</code> already receives the whole <code>bacSi</code> object, so it has <code>bacSi.id</code> when it needs it.</p>
<p>One more use of key, previewed here and taught in Chapter 11: because a new key means "a different element", changing a component&#39;s key on purpose resets it — for example, <code>&lt;FormDatLich key={bacSi.id} /&gt;</code> gives a fresh, empty form whenever the doctor changes.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202 exercises often render a hard-coded array with <code>array.map((item, index) =&gt; &lt;ListGroup.Item key={index}&gt;…)</code> (React-Bootstrap), or leave the key out and live with the console warning, because the list in the lab never changes. → At work, list data comes from an API with stable ids, the key is always that id (<code>key={lichHen.id}</code>), and lint rules flag both a missing key and an index key. · <em>Why:</em> real lists are filtered, sorted, paginated and edited; an index key there moves inputs, checkboxes and focus to the wrong row with no error (measured above). The FER202 habit is harmless for a list that truly never changes — and you will still see <code>key={index}</code> in old code; when you touch such a list and add sorting or deletion, change the key first.</p></div>

<h3>Run it step by step: render the six doctors</h3>
<ol>
<li>Create <code>src/du-lieu/bac-si.ts</code> with the six doctors of the course (ids <code>bs-1</code> … <code>bs-6</code>, typed as <code>BacSi[]</code>).</li>
<li>Create <code>src/components/DanhSachBacSi.tsx</code> as above, with <code>key={bs.id}</code> and the empty-list message.</li>
<li>In <code>App.tsx</code>, import <code>danhSachBacSi</code> and render <code>&lt;DanhSachBacSi danhSach={danhSachBacSi} /&gt;</code> inside <code>&lt;main&gt;</code>.</li>
<li>Open the browser console: no key warning. Remove <code>key={bs.id}</code>, reload, read the warning, put it back.</li>
<li>Temporarily render <code>&lt;DanhSachBacSi danhSach={[]} /&gt;</code> and check the page says "Chưa có bác sĩ nào."</li>
<li>Try <code>danhSachBacSi.filter((bs) =&gt; bs.chuyenKhoa === 'nhi')</code> as the prop: the heading shows "(2)" and two cards.</li>
</ol>

<h3>When to use each kind of key</h3>
<ul>
<li><strong>Always</strong> an id from the data for anything that comes from a database or API, or that users can add, remove, sort or filter.</li>
<li><strong>An id created once, at creation time</strong>, for items created in the browser before they have a server id.</li>
<li><strong>The index only</strong> for static, stateless lists; say so in a comment so the next person does not add sorting without changing it.</li>
<li><strong>Never</strong> <code>Math.random()</code> or anything generated during render, and never a field that can repeat (names, dates without time).</li>
</ul>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: Why does React need keys in lists? Can you use the index?</strong><br>A: Keys tell React which element in the new list corresponds to which element in the old one, so it can keep DOM and state with the right item when items are inserted, removed or reordered. The index works only for lists that never change order or length; otherwise state such as an input&#39;s text or a checkbox stays at the position and appears on a different item. Use a stable id from the data; never generate keys during render.</p>
<p><strong>Q: Can a component read its own <code>key</code>?</strong><br>A: No. <code>key</code> is consumed by React and not included in props (TypeScript reports TS2339 if you try). Pass the id as a separate prop if the child needs it.</p>
<p><strong>Q: What happens if you change a component&#39;s key?</strong><br>A: React treats it as a different element: it unmounts the old one (losing its state and DOM) and mounts a new one. That is a bug with random keys, and a deliberate reset technique when done on purpose.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> reception wants a quick note next to each doctor. Reproduce the index-key bug, then prove the fix.</p><ol>
<li>Render the six doctors with <code>DanhSachBacSi</code> (the steps above) and confirm there is no key warning in the console.</li>
<li>Build a small list of three doctors where each row has an <code>&lt;input&gt;</code>, using <code>key={index}</code>, plus a button that adds a doctor at the top (copy the <code>useState</code> line from this lesson; Chapter 2 explains it).</li>
<li>Type a note for the first doctor, click the button, and write down where the note went.</li>
<li>Change the key to <code>bs.id</code>, repeat, and write down where the note went.</li>
<li>Write a Vitest test with <code>userEvent.type</code> and <code>userEvent.click</code> that fails with <code>key={index}</code> and passes with <code>key={bs.id}</code>.</li>
</ol><p><strong>Done when:</strong> with <code>key={index}</code> the note appears next to the new doctor (as in the screenshot on slide 17); with <code>key={bs.id}</code> it stays with the original doctor; your test is green with the id key; and <code>npx tsc -b</code> prints nothing.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k"><code>map</code></span><span class="v">array method: calls a function for each element and returns a new array of the results</span></div>
<div class="kv"><span class="k"><code>key</code></span><span class="v">a string/number that identifies an element among its siblings; used by React, not passed as a prop</span></div>
<div class="kv"><span class="k">stable key</span><span class="v">the same key for the same item on every render — typically its id</span></div>
<div class="kv"><span class="k">sibling (anh em)</span><span class="v">elements returned side by side, e.g. by one <code>map</code>; keys need to be unique only among them</span></div>
<div class="kv"><span class="k">reconciliation (đối chiếu)</span><span class="v">React comparing the new element tree with the old one to decide what to keep, update, create or remove</span></div>
<div class="kv"><span class="k">index key</span><span class="v"><code>key={index}</code> — identity = position; safe only for static lists</span></div>
<div class="kv"><span class="k">Fragment with key</span><span class="v"><code>&lt;Fragment key={id}&gt;</code> — groups several siblings for one item; <code>&lt;&gt;</code> cannot take a key</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>danhSach.map((bs) =&gt; &lt;TheBacSi key={bs.id} … /&gt;)</code> turns data into JSX; an empty list gets its own early return.</li>
<li>A missing key still renders but warns "Each child in a list should have a unique key prop" (real output); duplicates warn "Encountered two children with the same key".</li>
<li><code>key={index}</code> plus an insert at the top moved a typed note to the new doctor — recorded in a test and a real screenshot.</li>
<li>React matches old and new siblings by key; DOM and state follow the key, not the data.</li>
<li>Use a stable id from the data; the index only for static lists; never keys generated during render.</li>
<li>The key goes on the element <code>map</code> returns, and it never reaches the component&#39;s props (TS2339 if you read it).</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Rendering Lists</span><span class="lc-sub">react.dev/learn/rendering-lists — <code>map</code>, <code>filter</code>, where keys come from, the rules of keys, why not index or <code>Math.random()</code>, and keyed Fragments.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Preserving and Resetting State</span><span class="lc-sub">react.dev/learn/preserving-and-resetting-state — how position and key decide whether state is kept; the basis of Chapter 11.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Conditional Rendering</span><span class="lc-sub">react.dev/learn/conditional-rendering — returning different JSX early, as the empty-list case does.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Hiển thị danh sách và key: map, key ổn định, và bug key={index}</h2>
<p class="lead">Gần như màn hình nào cũng có một danh sách: bác sĩ, khung giờ, lịch hẹn. Trong React bạn biến một mảng dữ liệu thành một mảng JSX bằng <code>map</code>, và gắn cho mỗi phần tử một <code>key</code> (khoá nhận diện) — một chuỗi nói "dòng này là bác sĩ bs-4", để React bám theo được dòng đó khi danh sách thay đổi. Đặt key sai thì danh sách vẫn trông đúng… cho tới lúc có người chèn, xoá hay sắp xếp, và thứ người dùng vừa gõ chạy sang dòng của người khác.</p>

<p>Trang chủ phòng khám phải hiện sáu bác sĩ. Bài 1.2 đã cho ta <code>TheBacSi</code>; bài này vẽ cả đội ngũ từ <code>src/du-lieu/bac-si.ts</code>, rồi cố ý đặt key sai theo ba kiểu hay gặp trong dự án thật và ghi lại hậu quả của từng kiểu. Bản ghi quan trọng nhất là một ảnh chụp trình duyệt: một ghi chú y tế gõ cho bác sĩ này lại nằm cạnh tên một bác sĩ khác.</p>

<h3>map biến mảng dữ liệu thành mảng JSX</h3>
${slide('rx-01', 15, 'map biến mảng dữ liệu thành mảng JSX')}
<p>Dữ liệu là một mảng TypeScript bình thường:</p>
<pre><code class="language-ts">// src/du-lieu/bac-si.ts (hai trong sáu)
import type { BacSi } from '../types';

export const danhSachBacSi: BacSi[] = [
  { id: 'bs-1', ten: 'BS. Nguyễn Minh An', chuyenKhoa: 'noi', namKinhNghiem: 12, gioiThieu: 'Khám và theo dõi bệnh mạn tính: …' },
  { id: 'bs-2', ten: 'BS. Trần Thu Hà', chuyenKhoa: 'nhi', namKinhNghiem: 8, gioiThieu: 'Khám trẻ từ sơ sinh tới 15 tuổi, …' },
  // bs-3 … bs-6
];</code></pre>
<p>Và component danh sách mà dự án giữ từ chương này trở đi:</p>
<pre><code class="language-tsx">// src/components/DanhSachBacSi.tsx
import type { BacSi } from '../types';
import { TheBacSi } from './TheBacSi';

interface DanhSachBacSiProps {
  danhSach: BacSi[];
}

export function DanhSachBacSi({ danhSach }: DanhSachBacSiProps) {
  if (danhSach.length === 0) {
    return &lt;p&gt;Chưa có bác sĩ nào.&lt;/p&gt;;
  }
  return (
    &lt;section aria-labelledby="tieu-de-bac-si"&gt;
      &lt;h2 id="tieu-de-bac-si"&gt;Đội ngũ bác sĩ ({danhSach.length})&lt;/h2&gt;
      &lt;div className="luoi-bac-si"&gt;
        {danhSach.map((bs) =&gt; (
          &lt;TheBacSi key={bs.id} bacSi={bs} noiBat={bs.namKinhNghiem &gt;= 15} /&gt;
        ))}
      &lt;/div&gt;
    &lt;/section&gt;
  );
}</code></pre>
<div class="callout"><p><strong>JS nhắc nhanh: <code>map</code>, <code>filter</code> và arrow function.</strong> <code>danhSach.map((bs) =&gt; …)</code> gọi arrow function một lần cho mỗi phần tử, đưa phần tử vào dưới tên <code>bs</code>, rồi gom các giá trị trả về thành một <strong>mảng mới</strong> dài bằng mảng cũ. <code>(bs) =&gt; ( &lt;TheBacSi … /&gt; )</code> là arrow function có thân là một biểu thức trong ngoặc tròn, tự động được trả về; dùng ngoặc nhọn <code>(bs) =&gt; { … }</code> thì phải tự viết <code>return</code> — quên nó là bug kinh điển "danh sách của tôi trống trơn". <code>filter</code> hoạt động tương tự nhưng chỉ giữ phần tử mà hàm trả về <code>true</code>: <code>danhSach.filter((bs) =&gt; bs.chuyenKhoa === 'nhi')</code> cho ra hai bác sĩ nhi. Nối chúng lại: <code>danhSach.filter(…).map(…)</code>.</p></div>
<p>Vài ghi chú về component:</p>
<ul>
<li><strong>Một mảng JSX trong ngoặc nhọn được vẽ theo thứ tự.</strong> <code>{[&lt;A /&gt;, &lt;B /&gt;]}</code> vẽ A rồi B. <code>map</code> chỉ là cách thường dùng để tạo ra mảng đó.</li>
<li><strong><code>return</code> sớm cho danh sách rỗng</strong> là JavaScript thuần: một component có thể trả về JSX khác nhau trong những trường hợp khác nhau. Nó cũng tránh được bẫy "số 0 trên màn hình" của Bài 1.2 — ta không hề viết <code>danhSach.length &amp;&amp; …</code>.</li>
<li><strong><code>aria-labelledby</code></strong> nối <code>&lt;section&gt;</code> với tiêu đề của nó, để trình đọc màn hình đọc "Đội ngũ bác sĩ" làm tên vùng (Chương 8 dạy về khả năng tiếp cận).</li>
<li><strong>Giá trị dẫn xuất <code>noiBat={bs.namKinhNghiem &gt;= 15}</code></strong> được tính trong lúc render chứ không lưu sẵn — file dữ liệu không cần trường "nổi bật" có thể mâu thuẫn với số năm.</li>
</ul>
${SD.mapVi}

<h3>Quên key: vẫn vẽ đủ, và React cảnh báo</h3>
${slide('rx-01', 16, 'Quên key: vẫn vẽ đủ 6 dòng, React cảnh báo trên console')}
<p>Đây là cùng một kiểu danh sách nhưng không có key:</p>
<pre><code class="language-tsx">// src/vi-du/ThieuKey.tsx
export function DanhSachThieuKey() {
  return (
    &lt;ul&gt;
      {danhSachBacSi.map((bs) =&gt; (
        &lt;li&gt;{bs.ten}&lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre>
<p>TypeScript không kêu — thiếu key không phải lỗi kiểu. Test vẽ nó, kiểm có đủ sáu <code>&lt;li&gt;</code>, và bắt lấy console:</p>
<div class="out">$ npx vitest run src/vi-du/ThieuKey --reporter=verbose
stdout | src/vi-du/ThieuKey.test.tsx &gt; thiếu key: vẫn vẽ đủ, nhưng React cảnh báo trên console
Each child in a list should have a unique "key" prop.
Check the render method of &#96;DanhSachThieuKey&#96;. See https://react.dev/link/warning-keys for more information.
 ✓ src/vi-du/ThieuKey.test.tsx &gt; thiếu key: vẫn vẽ đủ, nhưng React cảnh báo trên console</div>
<p>("Mỗi phần tử con trong một danh sách nên có một prop key duy nhất. Kiểm hàm render của DanhSachThieuKey.") Cả sáu cái tên đều có trên màn hình. Nó chỉ là cảnh báo, và một danh sách không bao giờ đổi thì sẽ không bao giờ trục trặc. Đó chính là lý do người ta lờ nó đi — rồi danh sách trở thành sửa được. Thông báo nêu tên component (<code>DanhSachThieuKey</code>) có cái <code>map</code> cần key; trên trình duyệt bạn thấy đúng dòng chữ này trong console của DevTools, và chỉ ở bản dev.</p>
<p>Cách sửa là một thuộc tính trên phần tử mà <code>map</code> trả về: <code>&lt;li key={bs.id}&gt;</code>.</p>

<h3>key={index} và một lần chèn lên đầu: ghi chú nhảy sang người khác</h3>
${slide('rx-01', 17, 'key={index} + chèn lên đầu: ghi chú dính sang người khác')}
<p>"Cách sửa" phổ biến nhất cho cảnh báo là tham số thứ hai của <code>map</code>, chỉ số (index): <code>map((bs, index) =&gt; &lt;li key={index}&gt;…)</code>. Cảnh báo biến mất. Để thấy cái giá, dự án thực hành có một trang với hai danh sách giống hệt đặt cạnh nhau — bên trái <code>key={index}</code>, bên phải <code>key={bs.id}</code> — mỗi dòng có một ô nhập ghi chú, và một nút chèn bác sĩ mới, BS. Đỗ Thanh Tâm, lên <strong>đầu</strong>:</p>
<pre><code class="language-tsx">// src/vi-du/KeyIndex.tsx (phần danh sách)
function Cot({ tieuDe, ds, dungIndex }: { tieuDe: string; ds: BacSi[]; dungIndex: boolean }) {
  return (
    &lt;div className="cot"&gt;
      &lt;h2&gt;{tieuDe}&lt;/h2&gt;
      &lt;ul&gt;
        {ds.map((bs, index) =&gt; (
          &lt;li key={dungIndex ? index : bs.id}&gt;
            &lt;span&gt;{bs.ten}&lt;/span&gt;
            &lt;input aria-label={&#96;&#36;{dungIndex ? 'Cột index' : 'Cột id'}: ghi chú cho &#36;{bs.ten}&#96;} placeholder="ghi chú…" /&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/div&gt;
  );
}

// nút bấm (useState — Chương 2): setDs([bacSiMoi, ...ds])</code></pre>
<div class="callout"><p><strong>JS nhắc nhanh: template literal và spread.</strong> Chuỗi trong dấu backtick, <code>&#96;ghi chú cho &#36;{bs.ten}&#96;</code>, chèn giá trị của biểu thức trong <code>&#36;{…}</code> vào chuỗi — ở đây nó tạo nhãn khác nhau cho từng dòng. <code>[bacSiMoi, ...ds]</code> tạo một mảng mới: bác sĩ mới đứng đầu, sau đó là mọi phần tử của <code>ds</code> được "trải" ra. Mảng cũ không bị sửa (Bài 1.2).</p></div>
<p>Chúng tôi gõ "dị ứng penicillin" vào ô ghi chú của BS. Nguyễn Minh An ở <em>cả hai</em> cột, rồi bấm "Thêm bác sĩ lên đầu". Test đọc lại từng dòng sau đó:</p>
<div class="out">key={index}:
  BS. Đỗ Thanh Tâm → "dị ứng penicillin"
  BS. Nguyễn Minh An → ""
  BS. Trần Thu Hà → ""
  BS. Lê Quốc Bảo → ""
key={bs.id}:
  BS. Đỗ Thanh Tâm → ""
  BS. Nguyễn Minh An → "dị ứng penicillin"
  BS. Trần Thu Hà → ""
  BS. Lê Quốc Bảo → ""
 ✓ src/vi-du/KeyIndex.test.tsx &gt; chèn lên đầu: ghi chú ở cột key={index} dính sang bác sĩ khác</div>
<p>Slide cho thấy đúng khoảnh khắc đó bằng ảnh chụp thật trên Chromium. Ở cột trái, ghi chú dị ứng giờ nằm cạnh bác sĩ <strong>mới</strong>, còn ô của BS. Nguyễn Minh An thì trống. Không lỗi, không cảnh báo — cảnh báo đã biến mất khi ta thêm <code>key={index}</code>. Trong app phòng khám, đó là một ghi chú gắn nhầm bệnh nhân hoặc nhầm bác sĩ.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — ô tick nhảy dòng.</strong> Danh sách việc cần làm ở quầy lễ tân dùng <code>key={index}</code>. Một lễ tân tick "đã gọi lại" cho bệnh nhân thứ ba, rồi một lễ tân khác xoá bệnh nhân đầu tiên vừa huỷ lịch. Mọi dòng dịch lên một, nhưng ô đã tick vẫn đứng ở vị trí thứ ba — giờ nằm trên một bệnh nhân chưa ai gọi. Mọi thứ sống trong DOM hoặc trong state của component (chữ trong ô nhập, ô tick, focus, trạng thái mở/đóng, hiệu ứng chuyển động) đi theo <em>key</em>, không theo dữ liệu. Triệu chứng lúc nào cũng vậy: "giá trị chạy sang dòng bên cạnh sau khi tôi thêm/xoá/sắp xếp".</div>

<h3>Vì sao: React ghép phần tử cũ và mới theo key, không theo vị trí</h3>
${slide('rx-01', 18, 'React ghép phần tử cũ và mới theo key, không theo vị trí')}
<p>Khi danh sách render lại, React có danh sách phần tử lần trước và danh sách mới. Với mỗi phần tử mới, nó phải quyết định: "đây có phải một phần tử mình đang có trên màn hình không (giữ DOM và state của nó, cập nhật chỗ đổi) hay là cái mới (tạo ra)?" Giữa các anh em với nhau, <strong>key chính là câu trả lời cho câu hỏi "cái nào đây?"</strong>:</p>
<ul>
<li><strong>Với <code>key={index}</code>:</strong> trước khi chèn, key 0, 1, 2 là An, Hà, Bảo. Sau khi chèn, key 0, 1, 2, 3 là Tâm, An, Hà, Bảo. React ghép key 0 với key 0: "cùng phần tử, chữ tên đổi" — nó sửa <code>&lt;span&gt;</code> thành "Đỗ Thanh Tâm" và <em>giữ nguyên</em> <code>&lt;input&gt;</code>, mà chữ đã gõ thì nằm trong DOM của input. Key 1 và 2 cũng được đổi tên. Chỉ key 3 là mới.</li>
<li><strong>Với <code>key={bs.id}</code>:</strong> key bs-1, bs-2, bs-3 có ở cả trước lẫn sau; <code>bs-7</code> là mới. React tạo một dòng mới ở trên cùng và <em>dời</em> ba dòng kia xuống, mỗi dòng mang theo ô nhập của mình. Ghi chú ở lại với bs-1.</li>
</ul>
${SD.ghepKeyVi}
<p>Vậy key bằng index tự nó không "sai"; nó là <em>một lời khẳng định rằng vị trí là danh tính</em>. Khẳng định đó đúng với danh sách không bao giờ đổi thứ tự, không chèn, không xoá — và sai trong mọi trường hợp còn lại. Tài liệu React nói thêm: nếu bạn không đưa key nào, React dùng chính index; cảnh báo là React đang nhờ bạn xác nhận lời khẳng định đó, hoặc đưa cho nó một danh tính thật.</p>
<p>Kiểu key sai thứ ba còn tệ hơn cả hai: <code>key={Math.random()}</code>. Mỗi lần render ra key mới, nên không bao giờ có gì khớp và React dựng lại mọi dòng. Dự án thực hành đo bằng một nút chỉ làm danh sách render lại:</p>
<div class="out">stdout | src/vi-du/KeyNgauNhien.test.tsx &gt; key ngẫu nhiên: vẽ lại một lần là mất chữ, và thẻ &lt;li&gt; là thẻ MỚI
cùng một ô input? false · giá trị sau khi vẽ lại: ""</div>
<p>Sau đúng một lần render lại, ô nhập đã là một phần tử DOM khác (<code>cùng một ô input? false</code>) và chữ đã gõ mất sạch. Dựng lại mọi dòng ở mỗi lần render còn chậm với danh sách dài, và làm mất focus ngay khi người dùng đang gõ.</p>

<h3>Chọn key: id có sẵn trong dữ liệu; index chỉ cho danh sách không bao giờ dịch chuyển</h3>
${slide('rx-01', 19, 'Key tốt nhất là id có sẵn trong dữ liệu')}
<p>Các luật trong tài liệu React, kèm ý nghĩa với phòng khám:</p>
<ul>
<li><strong>Key phải duy nhất giữa các anh em</strong> — trong một lần <code>map</code>, không phải trên toàn app. Hai danh sách khác nhau cùng dùng <code>bs-1</code> được.</li>
<li><strong>Key không được đổi giữa các lần render</strong> — nên đừng bao giờ tạo key trong lúc render (<code>Math.random()</code>, <code>crypto.randomUUID()</code> ngay trong JSX).</li>
<li><strong>Lấy từ dữ liệu</strong>: id từ cơ sở dữ liệu hoặc API (<code>bs.id</code>, sau này <code>lichHen.id</code> ở Chương 6). Nếu phần tử do trình duyệt tạo ra (bệnh nhân thêm vài số điện thoại trong form), hãy cấp id <em>lúc tạo</em>, ví dụ <code>{ id: crypto.randomUUID(), so: '' }</code>, và lưu cùng phần tử.</li>
<li><strong>Tên không phải id.</strong> Hai bác sĩ có thể trùng tên. Chúng tôi thử <code>key={bs.ten}</code> với một bản sao của BS. Nguyễn Minh An mang id bs-8:</li>
</ul>
<div class="out">Encountered two children with the same key, &#96;BS. Nguyễn Minh An&#96;. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.
DOM có 3 dòng</div>
<p>React cảnh báo key trùng "có thể làm phần tử con bị nhân đôi và/hoặc bị bỏ sót", và gọi hành vi này là không được hỗ trợ. Lần này nó vẽ đủ ba dòng; đừng trông cậy vào điều đó.</p>
<p><strong>Khi nào index chấp nhận được:</strong> danh sách tĩnh (không bao giờ sắp xếp, lọc, chèn, xoá) và các dòng không giữ state — ví dụ các dòng của một địa chỉ cố định, hay các bước của một hướng dẫn in sẵn. Ví dụ của chính React là các câu trong một bài thơ. Nếu bạn không chắc danh sách có bao giờ thay đổi không, thì nó sẽ thay đổi; dùng id.</p>
${SD.chonKeyVi}

<h3>Key đặt ở đâu — và vì sao component không bao giờ thấy nó</h3>
${slide('rx-01', 20, 'key đặt ở chỗ gọi map, và KHÔNG đi vào props')}
<p>Key thuộc về phần tử mà <code>map</code> <strong>trả về</strong>, vì đó là chỗ React so các anh em với nhau:</p>
<pre><code class="language-tsx">// ✅ trong DanhSachBacSi: key nằm trên &lt;TheBacSi&gt;, phần tử mà map trả về
{danhSach.map((bs) =&gt; (
  &lt;TheBacSi key={bs.id} bacSi={bs} /&gt;
))}

// ❌ bên trong TheBacSi: quá muộn — &lt;article&gt; này là con một, chẳng có anh em nào để phân biệt
&lt;article key={bacSi.id}&gt;…&lt;/article&gt;</code></pre>
<p>Nếu một phần tử cần vài thẻ ngang hàng mà không có thẻ bọc, Fragment rút gọn <code>&lt;&gt;…&lt;/&gt;</code> không nhận key được; hãy import <code>Fragment</code> và viết <code>&lt;Fragment key={bs.id}&gt;…&lt;/Fragment&gt;</code>.</p>
<p><code>key</code> dành riêng cho React: nó <strong>không được truyền vào component của bạn như một prop</strong>. TypeScript nói luôn nếu bạn thử đọc:</p>
<div class="out">$ npx tsc -b
src/vi-du/LoiKey.tsx(2,34): error TS2339: Property 'key' does not exist on type '{ ten: string; }'.</div>
<p>Còn lúc chạy, một component được vẽ bằng <code>&lt;DoProps key="bs-1" id="bs-1" ten="BS. Nguyễn Minh An" /&gt;</code> nhận được:</p>
<div class="out">props nhận được: {"id":"bs-1","ten":"BS. Nguyễn Minh An"}</div>
<p>Không có <code>key</code>. Nếu con cần id — để tạo đường link, hay để báo bác sĩ nào vừa được bấm — hãy truyền lại nó như một prop thường: <code>&lt;DongBacSi key={bs.id} id={bs.id} … /&gt;</code>. Trong dự án, <code>TheBacSi</code> đã nhận cả object <code>bacSi</code>, nên cần thì nó có sẵn <code>bacSi.id</code>.</p>
<p>Thêm một công dụng của key, giới thiệu trước ở đây và dạy ở Chương 11: vì key mới nghĩa là "một phần tử khác", cố ý đổi key của một component sẽ reset nó — ví dụ <code>&lt;FormDatLich key={bacSi.id} /&gt;</code> cho ra một form mới tinh, trống trơn mỗi khi đổi bác sĩ.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Bài tập FER202 hay vẽ một mảng viết cứng bằng <code>array.map((item, index) =&gt; &lt;ListGroup.Item key={index}&gt;…)</code> (React-Bootstrap), hoặc bỏ luôn key và sống chung với cảnh báo trên console, vì danh sách trong bài lab không bao giờ đổi. → Đi làm, dữ liệu danh sách đến từ API kèm id ổn định, key luôn là id đó (<code>key={lichHen.id}</code>), và luật lint đánh dấu cả thiếu key lẫn key bằng index. · <em>Vì sao:</em> danh sách thật được lọc, sắp xếp, phân trang và sửa; key bằng index ở đó dời ô nhập, ô tick và focus sang nhầm dòng mà không báo lỗi gì (đã đo ở trên). Thói quen FER202 vô hại với danh sách thật sự không bao giờ đổi — và bạn vẫn sẽ gặp <code>key={index}</code> trong code cũ; khi đụng vào một danh sách như vậy để thêm sắp xếp hay xoá, hãy đổi key trước tiên.</p></div>

<h3>Chạy thử từng bước: vẽ sáu bác sĩ</h3>
<ol>
<li>Tạo <code>src/du-lieu/bac-si.ts</code> với sáu bác sĩ của khoá (id <code>bs-1</code> … <code>bs-6</code>, kiểu <code>BacSi[]</code>).</li>
<li>Tạo <code>src/components/DanhSachBacSi.tsx</code> như trên, có <code>key={bs.id}</code> và dòng báo danh sách rỗng.</li>
<li>Trong <code>App.tsx</code>, import <code>danhSachBacSi</code> và vẽ <code>&lt;DanhSachBacSi danhSach={danhSachBacSi} /&gt;</code> bên trong <code>&lt;main&gt;</code>.</li>
<li>Mở console của trình duyệt: không có cảnh báo key. Xoá <code>key={bs.id}</code>, tải lại, đọc cảnh báo, rồi thêm lại.</li>
<li>Tạm vẽ <code>&lt;DanhSachBacSi danhSach={[]} /&gt;</code> và kiểm trang ghi "Chưa có bác sĩ nào."</li>
<li>Thử truyền <code>danhSachBacSi.filter((bs) =&gt; bs.chuyenKhoa === 'nhi')</code>: tiêu đề hiện "(2)" và hai thẻ.</li>
</ol>

<h3>Khi nào dùng loại key nào</h3>
<ul>
<li><strong>Luôn</strong> dùng id từ dữ liệu cho mọi thứ đến từ cơ sở dữ liệu hoặc API, hoặc thứ người dùng thêm, xoá, sắp xếp, lọc được.</li>
<li><strong>Id tạo một lần, lúc tạo phần tử</strong> cho phần tử sinh ra trong trình duyệt khi chưa có id từ server.</li>
<li><strong>Index chỉ dùng</strong> cho danh sách tĩnh, không state; ghi rõ bằng một dòng chú thích để người sau không thêm sắp xếp mà quên đổi key.</li>
<li><strong>Không bao giờ</strong> <code>Math.random()</code> hay thứ gì sinh ra trong lúc render, và không bao giờ dùng trường có thể trùng (tên, ngày không kèm giờ).</li>
</ul>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Vì sao React cần key trong danh sách? Dùng index được không?</strong><br>Đ: Key cho React biết phần tử nào trong danh sách mới tương ứng với phần tử nào trong danh sách cũ, để giữ DOM và state đi đúng phần tử khi chèn, xoá, đổi thứ tự. Index chỉ đúng với danh sách không bao giờ đổi thứ tự hay độ dài; nếu không, state như chữ trong ô nhập hay ô tick ở lại vị trí cũ và hiện trên phần tử khác. Dùng id ổn định từ dữ liệu; không bao giờ tạo key trong lúc render.</p>
<p><strong>H: Component có đọc được <code>key</code> của chính nó không?</strong><br>Đ: Không. <code>key</code> do React dùng và không nằm trong props (TypeScript báo TS2339 nếu bạn thử). Con cần id thì truyền thêm một prop riêng.</p>
<p><strong>H: Đổi key của một component thì chuyện gì xảy ra?</strong><br>Đ: React coi đó là một phần tử khác: gỡ cái cũ (mất state và DOM) rồi gắn cái mới. Với key ngẫu nhiên thì đó là bug; làm có chủ đích thì đó là kỹ thuật reset.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> lễ tân muốn ghi chú nhanh cạnh mỗi bác sĩ. Tái hiện bug key bằng index, rồi chứng minh bản sửa.</p><ol>
<li>Vẽ sáu bác sĩ bằng <code>DanhSachBacSi</code> (các bước ở trên) và xác nhận console không có cảnh báo key.</li>
<li>Dựng một danh sách nhỏ ba bác sĩ, mỗi dòng có một <code>&lt;input&gt;</code>, dùng <code>key={index}</code>, kèm một nút thêm bác sĩ lên đầu (chép dòng <code>useState</code> ở bài này; Chương 2 sẽ giải thích).</li>
<li>Gõ ghi chú cho bác sĩ đầu tiên, bấm nút, ghi lại ghi chú đã chạy đi đâu.</li>
<li>Đổi key thành <code>bs.id</code>, làm lại, ghi lại ghi chú nằm ở đâu.</li>
<li>Viết một test Vitest dùng <code>userEvent.type</code> và <code>userEvent.click</code> đỏ với <code>key={index}</code> và xanh với <code>key={bs.id}</code>.</li>
</ol><p><strong>Đạt khi:</strong> với <code>key={index}</code> ghi chú hiện cạnh bác sĩ mới (như ảnh chụp ở slide 17); với <code>key={bs.id}</code> nó ở lại với bác sĩ ban đầu; test của bạn xanh khi dùng id; và <code>npx tsc -b</code> không in gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k"><code>map</code></span><span class="v">hàm của mảng: gọi một hàm cho mỗi phần tử và trả về mảng mới chứa kết quả</span></div>
<div class="kv"><span class="k"><code>key</code> (khoá nhận diện)</span><span class="v">chuỗi/số nhận diện một phần tử giữa các anh em; React dùng, không truyền vào props</span></div>
<div class="kv"><span class="k">key ổn định</span><span class="v">cùng một phần tử thì cùng key ở mọi lần render — thường là id của nó</span></div>
<div class="kv"><span class="k">anh em (siblings)</span><span class="v">các phần tử được trả về cạnh nhau, ví dụ bởi một lần <code>map</code>; key chỉ cần duy nhất giữa chúng</span></div>
<div class="kv"><span class="k">reconciliation (đối chiếu)</span><span class="v">React so cây phần tử mới với cây cũ để quyết định giữ, sửa, tạo hay gỡ</span></div>
<div class="kv"><span class="k">key bằng index</span><span class="v"><code>key={index}</code> — danh tính = vị trí; chỉ an toàn với danh sách tĩnh</span></div>
<div class="kv"><span class="k">Fragment có key</span><span class="v"><code>&lt;Fragment key={id}&gt;</code> — gom vài thẻ ngang hàng cho một phần tử; <code>&lt;&gt;</code> không nhận key</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>danhSach.map((bs) =&gt; &lt;TheBacSi key={bs.id} … /&gt;)</code> biến dữ liệu thành JSX; danh sách rỗng có nhánh <code>return</code> sớm riêng.</li>
<li>Thiếu key vẫn vẽ nhưng cảnh báo "Each child in a list should have a unique key prop" (output thật); key trùng cảnh báo "Encountered two children with the same key".</li>
<li><code>key={index}</code> cộng một lần chèn lên đầu đã dời ghi chú sang bác sĩ mới — ghi bằng test và ảnh chụp thật.</li>
<li>React ghép anh em cũ với mới theo key; DOM và state đi theo key, không theo dữ liệu.</li>
<li>Dùng id ổn định từ dữ liệu; index chỉ cho danh sách tĩnh; không bao giờ tạo key trong lúc render.</li>
<li>Key đặt trên phần tử <code>map</code> trả về, và không bao giờ tới được props của component (đọc nó là TS2339).</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Rendering Lists</span><span class="lc-sub">react.dev/learn/rendering-lists — <code>map</code>, <code>filter</code>, lấy key ở đâu, luật của key, vì sao không dùng index hay <code>Math.random()</code>, và Fragment có key.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Preserving and Resetting State</span><span class="lc-sub">react.dev/learn/preserving-and-resetting-state — vị trí và key quyết định state được giữ hay không; nền của Chương 11.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Conditional Rendering</span><span class="lc-sub">react.dev/learn/conditional-rendering — trả về JSX khác nhau sớm, như nhánh danh sách rỗng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — Thinking in components: from mock-up to a tested component tree|||1.4 — Tư duy theo component: từ mock-up tới cây component có test',
      slug: 'rx-1-4-chia-nho',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Từ ảnh chụp trang chủ tới cây component: khoanh hộp, đặt tên, xếp cây; khi nào tách và khi nào không; dữ liệu đi một chiều từ App xuống; test component bằng Testing Library với dữ liệu giả; bẫy thiếu cleanup (12 thay vì 6); và mục Tự gõ tiếp dự án có lời giải chạy thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Thinking in components: from mock-up to a tested component tree</h2>
<p class="lead">You now know how to write a component, type its props and render a list. The harder skill — the one interviews probe and code reviews argue about — is deciding <em>where the lines go</em>: which boxes on a design become components, which data each one receives, and how you prove each piece works on its own. This lesson does it end to end on the clinic&#39;s home page, then hands the whole build to you in "Keep building the project".</p>

<p>React&#39;s own guide calls this "Thinking in React" and splits it into five steps. Chapter 1 covers the first two — break the UI into a component hierarchy, and build a static version — plus the habit that makes the rest of the course safe: a test for every component. Steps three to five (finding the minimal state, where it lives, and data flowing back up) are Chapter 2.</p>

<h3>From the mock-up: draw boxes, name them, one box per component</h3>
${slide('rx-01', 21, 'From the mock-up: draw boxes, name them, one component per box')}
<p>Start from a picture of the page — a designer&#39;s mock-up, or, as on the slide, a screenshot of what you are rebuilding. Draw a box around each part that has its own job, and name it the way you would in conversation:</p>
<ol>
<li><strong>Header</strong> — the teal strip: clinic name and opening hours.</li>
<li><strong>DanhSachBacSi</strong> (doctor list) — the heading "Đội ngũ bác sĩ (6)" and the grid.</li>
<li><strong>TheBacSi</strong> (doctor card) — one card. It appears six times with six different doctors, which is the strongest signal of all that it is one component with props.</li>
<li><strong>Footer</strong> — address and hotline.</li>
</ol>
<p>Then check the boxes against the <strong>data</strong>. The doctor data is an array of <code>BacSi</code> objects; the UI is a list of cards. React&#39;s guide points out that when the data is well structured it "naturally maps to the component structure": one component per piece of the data model. If your boxes and your data disagree — say, you drew a box around "name and specialty" but the data has them in one object together with the years — it is usually the box that should move.</p>
<p>Some boxes you might draw and then decide against: the card&#39;s title line, the badge "Bác sĩ lâu năm", the heading of the list. They are part of their parent&#39;s job and have no data of their own. That decision is the next section.</p>

<h3>The component tree of the home page</h3>
${slide('rx-01', 22, 'The home page component tree: data enters at the root')}
<p>Arrange the boxes so that a box drawn <em>inside</em> another becomes its child:</p>
<pre><code class="language-bash">App                      # imports danhSachBacSi
├── Header               # no props
├── DanhSachBacSi        # danhSach: BacSi[]
│   ├── TheBacSi         # bacSi = bs-1, noiBat = false
│   ├── TheBacSi         # …
│   └── TheBacSi         # bacSi = bs-6, noiBat = true
└── Footer               # no props</code></pre>
<p>This is the <strong>render tree</strong> — what React builds when it renders. It is different from the <em>module</em> tree (which file imports which, slide 5): <code>TheBacSi.tsx</code> is imported once but appears six times in the render tree. React DevTools (Section 0) shows exactly this render tree in its Components tab, and you will use it in every later chapter: Chapter 2 marks which component <em>holds state</em>, Chapter 8 which ones <em>re-render</em> and which are skipped. Today the tree only answers two questions — who contains whom, and which path the data takes.</p>
${SD.cayEn}

<h3>Split when a piece has a job of its own — not to have more files</h3>
${slide('rx-01', 23, 'Split when a piece has its own job, not to have more files')}
<p>There is no size rule. These questions decide it:</p>
<ul>
<li><strong>Does it repeat?</strong> Six cards → <code>TheBacSi</code>. Repetition is the clearest reason.</li>
<li><strong>Can you name its job in two or three words that a teammate would understand?</strong> "Header", "doctor list" — yes. "The div with the blue border" — no; that is a CSS class, not a component.</li>
<li><strong>Would you want to test it alone?</strong> The list has three behaviours worth testing (all doctors, badge rule, empty list) without the header or footer in the way — so it is a component.</li>
<li><strong>Is the file getting long, with a clear seam?</strong> A 300-line component with a form at the top and a table at the bottom has an obvious seam.</li>
</ul>
<p>And the signs you have split too far:</p>
<ul>
<li>A component that wraps one element and adds nothing: <code>&lt;TenBacSi ten={…} /&gt;</code> around a single <code>&lt;h3&gt;</code>.</li>
<li>A child that needs eight props from its parent only to render them back unchanged — the split line is in the wrong place.</li>
<li>Names by shape (<code>BoxXanh</code>, <code>Cot2</code>) instead of meaning. When the design changes colour, the name lies.</li>
</ul>
<p>When in doubt, start with fewer, larger components and extract when one of the reasons above appears. Extracting later is a cut-and-paste plus an import; merging over-split components means untangling props.</p>
${SD.tachEn}

<h3>Data flows one way: the parent passes it down, children only read</h3>
${slide('rx-01', 24, 'Data flows one way: the parent passes down, children only read')}
<p>Where should <code>import { danhSachBacSi } from './du-lieu/bac-si'</code> go — in <code>App</code>, or directly inside <code>DanhSachBacSi</code>? Both render the same page today. The project puts it in <strong><code>App</code></strong> and gives <code>DanhSachBacSi</code> a <code>danhSach</code> prop, for three reasons:</p>
<ul>
<li><strong>Testability.</strong> A list that receives its data can be tested with an empty array, with one doctor, with two hundred (Chapter 8). A list that imports its own data can only ever show those six.</li>
<li><strong>Change of source.</strong> In Chapter 6 the doctors come from an API through TanStack Query. Only the place that <em>fetches</em> changes; <code>DanhSachBacSi</code> keeps receiving an array.</li>
<li><strong>Reuse.</strong> Chapter 2 filters the list by specialty. The filtered array goes into the same component.</li>
</ul>
<p>This is React&#39;s <strong>one-way data flow</strong>: data enters at the top and moves down through props; children never reach up and change it (Lesson 1.2). When a child needs to <em>cause</em> a change — "the user picked this doctor" — the parent passes it a function to call; that is Chapter 2.</p>
${SD.motChieuEn}
<p>React&#39;s guide also recommends building a <strong>static version first</strong>: props only, no state, no interactivity. It is the version you have after this chapter. You can build it top-down (start at <code>App</code>, stub the children) or bottom-up (start at <code>TheBacSi</code> with a test, then the list, then the page). For a first project, bottom-up with a test at each step is less confusing: each piece works before the next one needs it.</p>

<h3>Testing a component: render it with fake data, query it like a user</h3>
${slide('rx-01', 25, 'Test a component: render fake data, query like a user')}
<p>A component test does three things: render the component with props you choose, find elements the way a user would, and assert what should be there. Testing Library (<code>@testing-library/react</code> 16.3.3, installed in Section 0) is built around the second part — it deliberately has no "find by CSS class", so tests do not break when styling changes. Here is the list&#39;s test file:</p>
<pre><code class="language-tsx">// src/components/DanhSachBacSi.test.tsx
import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import { danhSachBacSi } from '../du-lieu/bac-si';
import { DanhSachBacSi } from './DanhSachBacSi';

test('mỗi bác sĩ một thẻ, đúng thứ tự dữ liệu', () =&gt; {
  render(&lt;DanhSachBacSi danhSach={danhSachBacSi} /&gt;);
  const the = screen.getAllByRole('article');
  expect(the).toHaveLength(6);
  expect(within(the[0]).getByRole('heading')).toHaveTextContent('BS. Nguyễn Minh An');
  expect(within(the[5]).getByRole('heading')).toHaveTextContent('BS. Vũ Thảo Vy');
});

test('bác sĩ từ 15 năm kinh nghiệm được đánh dấu', () =&gt; {
  render(&lt;DanhSachBacSi danhSach={danhSachBacSi} /&gt;);
  // bs-4 (15 năm) và bs-6 (20 năm)
  expect(screen.getAllByText('Bác sĩ lâu năm')).toHaveLength(2);
});

test('danh sách rỗng thì báo, không vẽ lưới', () =&gt; {
  render(&lt;DanhSachBacSi danhSach={[]} /&gt;);
  expect(screen.getByText('Chưa có bác sĩ nào.')).toBeInTheDocument();
  expect(screen.queryByRole('article')).not.toBeInTheDocument();
});</code></pre>
<ul>
<li><strong><code>getByRole('article')</code> / <code>getAllByRole</code></strong> find elements by their accessibility role — <code>&lt;article&gt;</code> has role "article", <code>&lt;h3&gt;</code> has role "heading". Role first, then text; this is the order Testing Library recommends, and it doubles as a basic accessibility check.</li>
<li><strong><code>getBy…</code> throws</strong> if nothing (or more than one thing) matches; <strong><code>queryBy…</code> returns <code>null</code></strong> — use it only to assert that something is absent. <code>getAllBy…</code> returns an array.</li>
<li><strong><code>within(el)</code></strong> limits a query to one element: the heading <em>inside</em> the first card.</li>
<li>The third test is the reason the list takes a prop: <code>danhSach={[]}</code> exercises the empty branch in one line.</li>
</ul>
<p>The whole project suite, on the machine used for this lesson:</p>
<div class="out">$ npx vitest run --reporter=verbose
 ✓ src/components/TheBacSi.test.tsx &gt; hiện tên, chuyên khoa bằng tiếng Việt và số năm kinh nghiệm
 ✓ src/components/TheBacSi.test.tsx &gt; không có nhãn "Bác sĩ lâu năm" khi noiBat không được truyền
 ✓ src/components/TheBacSi.test.tsx &gt; có nhãn "Bác sĩ lâu năm" khi noiBat
 ✓ src/components/DanhSachBacSi.test.tsx &gt; mỗi bác sĩ một thẻ, đúng thứ tự dữ liệu
 ✓ src/components/DanhSachBacSi.test.tsx &gt; bác sĩ từ 15 năm kinh nghiệm được đánh dấu
 ✓ src/components/DanhSachBacSi.test.tsx &gt; danh sách rỗng thì báo, không vẽ lưới
 ✓ src/App.test.tsx &gt; trang chủ có tiêu đề phòng khám
 ✓ src/App.test.tsx &gt; trang chủ hiện đủ 6 bác sĩ
 Test Files  3 passed (3)
      Tests  8 passed (8)</div>
<p>(Timings trimmed. Vitest 5&#39;s default reporter prints only the summary for passing files; <code>--reporter=verbose</code> lists every test.) Chapter 9 goes much further — user events, async code, API mocks; the site&#39;s <code>/courses/testing</code> course covers testing in general.</p>

<h3>The missing cleanup: the next test sees the previous test&#39;s cards</h3>
${slide('rx-01', 26, 'Missing cleanup: the next test sees the previous test’s cards')}
<p>The first time these tests ran in the practice project, three of eight failed:</p>
<div class="out">$ npx vitest run
 FAIL  src/App.test.tsx &gt; trang chủ hiện đủ 6 bác sĩ
AssertionError: expected [ &lt;article …(2)&gt;…(4)&lt;/article&gt;, …(11) ] to have a length of 6 but got 12

- Expected
+ Received

- 6
+ 12
…
      Tests  3 failed | 5 passed (8)</div>
<p>Twelve cards, not six: the second test in the file found the six cards it rendered <em>plus</em> the six left over from the first test. Testing Library&#39;s <code>render</code> attaches the component to <code>document.body</code>, and something must remove it after each test. Testing Library registers that cleanup automatically — but only when the test runner provides a global <code>afterEach</code> function; the check is literally <code>if (typeof afterEach === 'function')</code> in <code>node_modules/@testing-library/react/dist/index.js</code>. Vitest does not create globals unless you set <code>test.globals: true</code>, so in this project nothing cleaned up. Section 0 had a single test, so it never showed.</p>
<p>The fix is three lines in the setup file that <code>vite.config.ts</code> already loads (<code>setupFiles: ['./src/test/setup.ts']</code>):</p>
<pre><code class="language-ts">// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest defaults to globals: false ⇒ Testing Library does NOT clean the DOM after each test.
afterEach(() =&gt; {
  cleanup();
});</code></pre>
<p>After it: <code>Tests  8 passed (8)</code>. (Setting <code>globals: true</code> in the Vite config also works; the explicit version keeps imports visible and does not change what <code>test</code> and <code>expect</code> are.)</p>
<div class="pitfall co-tieu-de"><strong>Trap — a test that passes alone and fails in the suite.</strong> You run one test file and it is green; you run everything and a test in another file goes red with "found multiple elements" or a count that is too high. The cause is almost always state shared between tests: DOM not cleaned up, a module-level variable changed (like <code>soKhach</code> in Lesson 1.1), or a data array sorted in place (Lesson 1.2 — notice the <code>.sort()</code> test works on a <em>copy</em>, <code>[...danhSachBacSi]</code>, precisely so it cannot break other tests). Each test must start from a clean world.</div>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>A FER202 assignment usually lives in one large <code>App.js</code> built from React-Bootstrap blocks (<code>Container</code>, <code>Row</code>, <code>Col</code>, <code>Card</code>), with data arrays declared at the top of the same file and checked by opening the browser. → At work, the page is a tree of small typed components in their own files, the data enters at one point and flows down through props, and each component has a test that runs in CI on every pull request. · <em>Why:</em> a team of five cannot all edit one 800-line file; small components can be reviewed, reused and changed without breaking their neighbours, and tests catch the breakage when it happens anyway. Your FER202 approach is fine for a solo lab graded once — and React-Bootstrap itself is still used in many internal tools; what changes at work is the size of the pieces and the tests around them.</p></div>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: Given a design, how do you decide how to split it into components?</strong><br>A: I draw boxes around parts that repeat or have their own job and name them by meaning; I check them against the data shape, since UI usually mirrors the data model; I arrange them into a tree; then I build a static version with props only, bottom-up with a test for each piece. I avoid components that only wrap one element, and I place data at the lowest common parent that needs it, passing it down.</p>
<p><strong>Q: What is one-way data flow?</strong><br>A: Data moves from parent to child through props; children cannot change their props. To change data owned by a parent, the child calls a function the parent passed down. It makes it easy to find where a value comes from and who can change it.</p>
<p><strong>Q: Why does Testing Library prefer <code>getByRole</code> over selecting by class or test id?</strong><br>A: It queries the page the way users and assistive technology perceive it, so tests survive styling refactors and also fail when the markup becomes inaccessible. Test ids are a last resort for elements with no accessible role or text.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the clinic sends you a second mock-up — an "Our specialties" section with four boxes (Nội tổng quát, Nhi, Da liễu, Răng hàm mặt), each showing the number of doctors in that specialty.</p><ol>
<li>On paper, draw the boxes and the component tree for this section. Decide which component receives which prop.</li>
<li>Build it static, bottom-up: a <code>TheChuyenKhoa</code> card with props <code>ten: string</code> and <code>soBacSi: number</code>, then a list that receives <code>danhSach: BacSi[]</code> and computes the four counts with <code>filter(…).length</code> while rendering.</li>
<li>Write a test that renders the list with the six doctors and checks "Nhi" shows 2 and "Da liễu" shows 1.</li>
<li>Write a second test with an empty array. Decide what the section should show, and make it so.</li>
</ol><p><strong>Done when:</strong> <code>npx tsc -b</code> prints nothing; <code>npx vitest run</code> is green, including your two new tests; the counts are computed from the data, not typed by hand (change a doctor&#39;s specialty in <code>bac-si.ts</code> and the test for the new count still passes after you update its expectation); and no component in the section imports <code>bac-si.ts</code> except the top one.</p></div>

<h3>🛠 Keep building the project</h3>
<p><strong>Starting point:</strong> the project after Section 0 — a Vite + TypeScript app <code>phong-kham</code> whose <code>src/App.tsx</code> returns a static home page with the clinic name "Phòng khám An Tâm" and the opening hours, plus <code>src/App.test.tsx</code> with one test that finds the title, and <code>src/test/setup.ts</code> loaded by <code>vite.config.ts</code>. If you skipped Section 0, create the project with <code>npm create vite@latest phong-kham -- --template react-ts</code> and install Vitest, jsdom and Testing Library as shown there.</p>
<p><strong>Task — by the end of Chapter 1 the home page shows the clinic&#39;s six doctors, built from typed, tested components:</strong></p>
<ol>
<li>Create <code>src/types.ts</code> with the course&#39;s six fixed types (<code>ChuyenKhoa</code>, <code>BacSi</code>, <code>KhungGio</code>, <code>BenhNhan</code>, <code>TrangThaiLichHen</code>, <code>LichHen</code>) exactly as named — later chapters rely on them.</li>
<li>Create <code>src/du-lieu/bac-si.ts</code> exporting <code>danhSachBacSi: BacSi[]</code> with the six doctors: <code>bs-1</code> BS. Nguyễn Minh An · noi · 12 years; <code>bs-2</code> BS. Trần Thu Hà · nhi · 8; <code>bs-3</code> BS. Lê Quốc Bảo · da-lieu · 5; <code>bs-4</code> BS. Phạm Ngọc Lan · rang-ham-mat · 15; <code>bs-5</code> BS. Hoàng Đức Huy · noi · 3; <code>bs-6</code> BS. Vũ Thảo Vy · nhi · 20 — each with a one-sentence <code>gioiThieu</code>. Create <code>src/du-lieu/chuyen-khoa.ts</code> with <code>TEN_CHUYEN_KHOA: Record&lt;ChuyenKhoa, string&gt;</code>.</li>
<li>Create <code>Header</code> (move the clinic name as <code>&lt;h1&gt;</code> and the opening hours into it) and <code>Footer</code> in <code>src/components/</code>, with named exports.</li>
<li>Create <code>TheBacSi</code> with props <code>bacSi: BacSi</code> and <code>noiBat?: boolean</code>: an <code>&lt;article aria-label={bacSi.ten}&gt;</code> showing the name in an <code>&lt;h3&gt;</code>, the specialty in Vietnamese, "N năm kinh nghiệm", the introduction, and a "Bác sĩ lâu năm" badge only when <code>noiBat</code>.</li>
<li>Create <code>DanhSachBacSi</code> with prop <code>danhSach: BacSi[]</code>: heading "Đội ngũ bác sĩ (N)", one card per doctor with <code>key={bs.id}</code> and <code>noiBat</code> for 15 years or more, and the text "Chưa có bác sĩ nào." for an empty array.</li>
<li>Assemble <code>App</code>: <code>Header</code>, a <code>&lt;main&gt;</code> with <code>&lt;DanhSachBacSi danhSach={danhSachBacSi} /&gt;</code>, <code>Footer</code>. Style it so the cards form a three-column grid and featured cards have a highlighted border.</li>
<li>Add <code>afterEach(cleanup)</code> to <code>src/test/setup.ts</code>, then write tests: three for <code>TheBacSi</code>, three for <code>DanhSachBacSi</code>, and a second one in <code>App.test.tsx</code> that counts six cards.</li>
</ol>
<p><strong>Done when (all three):</strong></p>
<ul>
<li><code>npx tsc -b</code> prints nothing and <code>npx vitest run</code> ends with <code>Tests  8 passed (8)</code> (more if you wrote more tests);</li>
<li>the browser console shows no "unique key" warning;</li>
<li>the page looks like the screenshot on slide 21: header strip, "Đội ngũ bác sĩ (6)", six cards in three columns, two of them (BS. Phạm Ngọc Lan and BS. Vũ Thảo Vy) with a highlighted border and the "Bác sĩ lâu năm" badge, and the footer.</li>
</ul>
<details><summary>Solution</summary>
<p>This is the exact code of the course&#39;s practice project after Chapter 1, checked on 25 September 2026: <code>npx tsc -b</code> printed nothing, <code>npx vitest run</code> gave <code>Test Files  3 passed (3)</code> / <code>Tests  8 passed (8)</code>, and <code>npx vite build</code> produced <code>dist/assets/index-….js 222.08 kB │ gzip: 69.84 kB</code>. <code>src/main.tsx</code> and <code>vite.config.ts</code> are unchanged from Section 0.</p>
<p><code>src/types.ts</code></p>
<pre><code class="language-ts">export type ChuyenKhoa = 'noi' | 'nhi' | 'da-lieu' | 'rang-ham-mat';

export interface BacSi {
  id: string;
  ten: string;
  chuyenKhoa: ChuyenKhoa;
  namKinhNghiem: number;
  gioiThieu: string;
}

export interface KhungGio {
  id: string;
  bacSiId: string;
  batDau: string; // ISO
  conTrong: boolean;
}

export interface BenhNhan {
  hoTen: string;
  soDienThoai: string;
  ngaySinh: string; // YYYY-MM-DD
}

export type TrangThaiLichHen = 'cho-xac-nhan' | 'da-xac-nhan' | 'da-huy';

export interface LichHen {
  id: string;
  bacSiId: string;
  khungGioId: string;
  benhNhan: BenhNhan;
  lyDo: string;
  trangThai: TrangThaiLichHen;
}</code></pre>
<p><code>src/du-lieu/bac-si.ts</code></p>
<pre><code class="language-ts">import type { BacSi } from '../types';

export const danhSachBacSi: BacSi[] = [
  { id: 'bs-1', ten: 'BS. Nguyễn Minh An', chuyenKhoa: 'noi', namKinhNghiem: 12, gioiThieu: 'Khám và theo dõi bệnh mạn tính: tăng huyết áp, tiểu đường, dạ dày.' },
  { id: 'bs-2', ten: 'BS. Trần Thu Hà', chuyenKhoa: 'nhi', namKinhNghiem: 8, gioiThieu: 'Khám trẻ từ sơ sinh tới 15 tuổi, tư vấn dinh dưỡng và tiêm chủng.' },
  { id: 'bs-3', ten: 'BS. Lê Quốc Bảo', chuyenKhoa: 'da-lieu', namKinhNghiem: 5, gioiThieu: 'Mụn trứng cá, viêm da cơ địa, chăm sóc da sau điều trị.' },
  { id: 'bs-4', ten: 'BS. Phạm Ngọc Lan', chuyenKhoa: 'rang-ham-mat', namKinhNghiem: 15, gioiThieu: 'Nhổ răng khôn, trám răng, chỉnh nha cho người lớn.' },
  { id: 'bs-5', ten: 'BS. Hoàng Đức Huy', chuyenKhoa: 'noi', namKinhNghiem: 3, gioiThieu: 'Khám tổng quát, đọc kết quả xét nghiệm, tư vấn lối sống.' },
  { id: 'bs-6', ten: 'BS. Vũ Thảo Vy', chuyenKhoa: 'nhi', namKinhNghiem: 20, gioiThieu: 'Hô hấp nhi, hen phế quản ở trẻ, khám sức khoẻ định kỳ.' },
];</code></pre>
<p><code>src/du-lieu/chuyen-khoa.ts</code></p>
<pre><code class="language-ts">import type { ChuyenKhoa } from '../types';

export const TEN_CHUYEN_KHOA: Record&lt;ChuyenKhoa, string&gt; = {
  noi: 'Nội tổng quát',
  nhi: 'Nhi',
  'da-lieu': 'Da liễu',
  'rang-ham-mat': 'Răng hàm mặt',
};</code></pre>
<p><code>src/components/Header.tsx</code></p>
<pre><code class="language-tsx">export function Header() {
  return (
    &lt;header className="header"&gt;
      &lt;h1&gt;Phòng khám An Tâm&lt;/h1&gt;
      &lt;p&gt;Mở cửa 7:30–20:00, thứ Hai đến thứ Bảy&lt;/p&gt;
    &lt;/header&gt;
  );
}</code></pre>
<p><code>src/components/Footer.tsx</code></p>
<pre><code class="language-tsx">export function Footer() {
  return (
    &lt;footer className="footer"&gt;
      &lt;p&gt;12 Lê Lợi, Quận 1, TP.HCM · Hotline 1900 1234&lt;/p&gt;
      &lt;p&gt;© 2026 Phòng khám An Tâm&lt;/p&gt;
    &lt;/footer&gt;
  );
}</code></pre>
<p><code>src/components/TheBacSi.tsx</code></p>
<pre><code class="language-tsx">import { TEN_CHUYEN_KHOA } from '../du-lieu/chuyen-khoa';
import type { BacSi } from '../types';

interface TheBacSiProps {
  bacSi: BacSi;
  noiBat?: boolean; // dấu ? = không bắt buộc
}

export function TheBacSi({ bacSi, noiBat = false }: TheBacSiProps) {
  return (
    &lt;article className={noiBat ? 'the-bac-si noi-bat' : 'the-bac-si'} aria-label={bacSi.ten}&gt;
      &lt;h3&gt;{bacSi.ten}&lt;/h3&gt;
      &lt;p className="chuyen-khoa"&gt;{TEN_CHUYEN_KHOA[bacSi.chuyenKhoa]}&lt;/p&gt;
      &lt;p&gt;{bacSi.namKinhNghiem} năm kinh nghiệm&lt;/p&gt;
      {noiBat &amp;&amp; &lt;p className="nhan"&gt;Bác sĩ lâu năm&lt;/p&gt;}
      &lt;p className="gioi-thieu"&gt;{bacSi.gioiThieu}&lt;/p&gt;
    &lt;/article&gt;
  );
}</code></pre>
<p><code>src/components/DanhSachBacSi.tsx</code></p>
<pre><code class="language-tsx">import type { BacSi } from '../types';
import { TheBacSi } from './TheBacSi';

interface DanhSachBacSiProps {
  danhSach: BacSi[];
}

export function DanhSachBacSi({ danhSach }: DanhSachBacSiProps) {
  if (danhSach.length === 0) {
    return &lt;p&gt;Chưa có bác sĩ nào.&lt;/p&gt;;
  }
  return (
    &lt;section aria-labelledby="tieu-de-bac-si"&gt;
      &lt;h2 id="tieu-de-bac-si"&gt;Đội ngũ bác sĩ ({danhSach.length})&lt;/h2&gt;
      &lt;div className="luoi-bac-si"&gt;
        {danhSach.map((bs) =&gt; (
          &lt;TheBacSi key={bs.id} bacSi={bs} noiBat={bs.namKinhNghiem &gt;= 15} /&gt;
        ))}
      &lt;/div&gt;
    &lt;/section&gt;
  );
}</code></pre>
<p><code>src/App.tsx</code></p>
<pre><code class="language-tsx">import './App.css';
import { DanhSachBacSi } from './components/DanhSachBacSi';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { danhSachBacSi } from './du-lieu/bac-si';

export default function App() {
  return (
    &lt;&gt;
      &lt;Header /&gt;
      &lt;main className="noi-dung"&gt;
        &lt;DanhSachBacSi danhSach={danhSachBacSi} /&gt;
      &lt;/main&gt;
      &lt;Footer /&gt;
    &lt;/&gt;
  );
}</code></pre>
<p><code>src/App.css</code></p>
<pre><code class="language-css">.header { background: #0e7490; color: #fff; padding: 20px 32px; }
.header h1 { margin: 0 0 4px; font-size: 28px; }
.header p { margin: 0; opacity: .9; }
.noi-dung { max-width: 1100px; margin: 0 auto; padding: 24px 32px; }
.noi-dung h2 { margin: 0 0 16px; font-size: 22px; }
.luoi-bac-si { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.the-bac-si { border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px 16px; background: #fff; }
.the-bac-si h3 { margin: 0 0 4px; font-size: 18px; color: #0f172a; }
.the-bac-si p { margin: 4px 0; color: #334155; font-size: 14px; }
.the-bac-si .chuyen-khoa { color: #0e7490; font-weight: 600; }
.the-bac-si .gioi-thieu { color: #64748b; }
.the-bac-si.noi-bat { border: 2px solid #f59e0b; }
.the-bac-si .nhan { display: inline-block; background: #fef3c7; color: #92400e; border-radius: 6px; padding: 1px 8px; font-size: 12px; font-weight: 600; }
.footer { border-top: 1px solid #e2e8f0; color: #64748b; padding: 16px 32px; font-size: 14px; }
.footer p { margin: 2px 0; }</code></pre>
<p><code>src/index.css</code></p>
<pre><code class="language-css">:root { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; color: #0f172a; background: #f8fafc; }
body { margin: 0; }</code></pre>
<p><code>src/test/setup.ts</code></p>
<pre><code class="language-ts">import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest mặc định globals: false ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.
// Không có dòng này, test sau thấy cả những gì test trước đã vẽ.
afterEach(() =&gt; {
  cleanup();
});</code></pre>
<p><code>src/components/TheBacSi.test.tsx</code></p>
<pre><code class="language-tsx">import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import type { BacSi } from '../types';
import { TheBacSi } from './TheBacSi';

const bacSiGia: BacSi = {
  id: 'bs-x',
  ten: 'BS. Thử Nghiệm',
  chuyenKhoa: 'da-lieu',
  namKinhNghiem: 7,
  gioiThieu: 'Chỉ dùng trong test.',
};

test('hiện tên, chuyên khoa bằng tiếng Việt và số năm kinh nghiệm', () =&gt; {
  render(&lt;TheBacSi bacSi={bacSiGia} /&gt;);
  expect(screen.getByRole('heading', { name: 'BS. Thử Nghiệm' })).toBeInTheDocument();
  expect(screen.getByText('Da liễu')).toBeInTheDocument();
  expect(screen.getByText('7 năm kinh nghiệm')).toBeInTheDocument();
});

test('không có nhãn "Bác sĩ lâu năm" khi noiBat không được truyền', () =&gt; {
  render(&lt;TheBacSi bacSi={bacSiGia} /&gt;);
  expect(screen.queryByText('Bác sĩ lâu năm')).not.toBeInTheDocument();
});

test('có nhãn "Bác sĩ lâu năm" khi noiBat', () =&gt; {
  render(&lt;TheBacSi bacSi={bacSiGia} noiBat /&gt;);
  expect(screen.getByText('Bác sĩ lâu năm')).toBeInTheDocument();
});</code></pre>
<p><code>src/components/DanhSachBacSi.test.tsx</code></p>
<pre><code class="language-tsx">import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import { danhSachBacSi } from '../du-lieu/bac-si';
import { DanhSachBacSi } from './DanhSachBacSi';

test('mỗi bác sĩ một thẻ, đúng thứ tự dữ liệu', () =&gt; {
  render(&lt;DanhSachBacSi danhSach={danhSachBacSi} /&gt;);
  const the = screen.getAllByRole('article');
  expect(the).toHaveLength(6);
  expect(within(the[0]).getByRole('heading')).toHaveTextContent('BS. Nguyễn Minh An');
  expect(within(the[5]).getByRole('heading')).toHaveTextContent('BS. Vũ Thảo Vy');
});

test('bác sĩ từ 15 năm kinh nghiệm được đánh dấu', () =&gt; {
  render(&lt;DanhSachBacSi danhSach={danhSachBacSi} /&gt;);
  // bs-4 (15 năm) và bs-6 (20 năm)
  expect(screen.getAllByText('Bác sĩ lâu năm')).toHaveLength(2);
});

test('danh sách rỗng thì báo, không vẽ lưới', () =&gt; {
  render(&lt;DanhSachBacSi danhSach={[]} /&gt;);
  expect(screen.getByText('Chưa có bác sĩ nào.')).toBeInTheDocument();
  expect(screen.queryByRole('article')).not.toBeInTheDocument();
});</code></pre>
<p><code>src/App.test.tsx</code></p>
<pre><code class="language-tsx">import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('trang chủ có tiêu đề phòng khám', () =&gt; {
  render(&lt;App /&gt;);
  expect(screen.getByRole('heading', { level: 1, name: 'Phòng khám An Tâm' })).toBeInTheDocument();
});

test('trang chủ hiện đủ 6 bác sĩ', () =&gt; {
  render(&lt;App /&gt;);
  expect(screen.getAllByRole('article')).toHaveLength(6);
});</code></pre>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">mock-up</span><span class="v">a picture of the intended page — the starting point for drawing component boxes</span></div>
<div class="kv"><span class="k">component hierarchy / tree</span><span class="v">components arranged so that a box inside another is its child</span></div>
<div class="kv"><span class="k">render tree</span><span class="v">the tree of component instances React builds; one file can appear many times</span></div>
<div class="kv"><span class="k">one-way data flow</span><span class="v">data goes from parent to child through props; children do not change it</span></div>
<div class="kv"><span class="k">static version</span><span class="v">the UI built with props only, no state — Thinking in React step 2</span></div>
<div class="kv"><span class="k"><code>getByRole</code> / <code>queryByRole</code></span><span class="v">Testing Library queries by accessible role; <code>get</code> throws if absent, <code>query</code> returns <code>null</code></span></div>
<div class="kv"><span class="k"><code>cleanup</code></span><span class="v">removes what <code>render</code> mounted; must run after each test (auto only with global <code>afterEach</code>)</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Start from the mock-up: box each part with its own job, name it by meaning, check it against the data shape.</li>
<li>Arrange the boxes into a tree; the home page is <code>App → Header, DanhSachBacSi → TheBacSi ×6, Footer</code>.</li>
<li>Split for repetition, a nameable job, or separate testing — not for shorter files; avoid one-element wrappers and prop pass-throughs.</li>
<li>Data enters at the top (<code>App</code>) and flows down through props, which makes the list testable with any array.</li>
<li>Test each component with fake data and role-based queries; the project suite is 8 passing tests.</li>
<li>With Vitest&#39;s default <code>globals: false</code>, add <code>afterEach(cleanup)</code> yourself — without it a test counted 12 cards instead of 6.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Thinking in React</span><span class="lc-sub">react.dev/learn/thinking-in-react — the five steps: component hierarchy, static version, minimal state, where state lives, inverse data flow.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Understanding Your UI as a Tree</span><span class="lc-sub">react.dev/learn/understanding-your-ui-as-a-tree — the render tree versus the module dependency tree.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Describing the UI</span><span class="lc-sub">react.dev/learn/describing-the-ui — the chapter of the React docs this course chapter follows.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Testing course on this site</span><span class="lc-sub">/courses/testing — queries, user events and test design beyond React; Chapter 9 of this course applies them.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Tư duy theo component: từ mock-up tới cây component có test</h2>
<p class="lead">Giờ bạn đã biết viết component, gõ kiểu props và vẽ danh sách. Kỹ năng khó hơn — thứ phỏng vấn hay hỏi dò và code review hay tranh cãi — là quyết định <em>đường cắt nằm ở đâu</em>: hộp nào trên bản thiết kế thành component, mỗi cái nhận dữ liệu gì, và làm sao chứng minh từng mảnh chạy đúng khi đứng một mình. Bài này làm trọn quy trình đó trên trang chủ phòng khám, rồi giao cả việc dựng cho bạn ở mục "Tự gõ tiếp dự án".</p>

<p>Chính hướng dẫn của React gọi việc này là "Thinking in React" (tư duy theo React) và chia làm năm bước. Chương 1 đi hai bước đầu — chia giao diện thành cây component, và dựng bản tĩnh — cùng thói quen làm phần còn lại của khoá an toàn: mỗi component một bộ test. Bước ba tới năm (tìm state tối thiểu, state nằm ở đâu, dữ liệu chảy ngược lên) là Chương 2.</p>

<h3>Từ mock-up: khoanh hộp, đặt tên, mỗi hộp một component</h3>
${slide('rx-01', 21, 'Từ mock-up: khoanh hộp, đặt tên, mỗi hộp một component')}
<p>Bắt đầu từ một bức hình của trang — mock-up (bản phác) của designer, hoặc như trên slide, ảnh chụp thứ bạn đang dựng lại. Khoanh một hộp quanh mỗi phần có việc riêng, và đặt tên theo cách bạn sẽ gọi khi nói chuyện:</p>
<ol>
<li><strong>Header</strong> — dải xanh trên cùng: tên phòng khám, giờ mở cửa.</li>
<li><strong>DanhSachBacSi</strong> — tiêu đề "Đội ngũ bác sĩ (6)" và lưới thẻ.</li>
<li><strong>TheBacSi</strong> — một thẻ. Nó xuất hiện sáu lần với sáu bác sĩ khác nhau, đó là dấu hiệu mạnh nhất cho thấy nó là một component có props.</li>
<li><strong>Footer</strong> — địa chỉ và hotline.</li>
</ol>
<p>Rồi đối chiếu các hộp với <strong>dữ liệu</strong>. Dữ liệu bác sĩ là một mảng object <code>BacSi</code>; giao diện là một danh sách thẻ. Hướng dẫn của React chỉ ra rằng khi dữ liệu có cấu trúc tốt thì nó "tự nhiên khớp với cấu trúc component": mỗi component ứng với một mảnh của mô hình dữ liệu. Nếu hộp và dữ liệu vênh nhau — ví dụ bạn khoanh một hộp quanh "tên và chuyên khoa" trong khi dữ liệu để chúng chung một object với số năm — thường thì cái hộp mới là thứ nên dời.</p>
<p>Có những hộp bạn có thể khoanh rồi quyết định bỏ: dòng tiêu đề của thẻ, nhãn "Bác sĩ lâu năm", tiêu đề của danh sách. Chúng là một phần việc của cha, không có dữ liệu riêng. Quyết định đó là chuyện của mục sau.</p>

<h3>Cây component của trang chủ</h3>
${slide('rx-01', 22, 'Cây component trang chủ: dữ liệu đi từ gốc xuống')}
<p>Xếp các hộp sao cho hộp nằm <em>bên trong</em> hộp khác thành con của nó:</p>
<pre><code class="language-bash">App                      # import danhSachBacSi
├── Header               # không props
├── DanhSachBacSi        # danhSach: BacSi[]
│   ├── TheBacSi         # bacSi = bs-1, noiBat = false
│   ├── TheBacSi         # …
│   └── TheBacSi         # bacSi = bs-6, noiBat = true
└── Footer               # không props</code></pre>
<p>Đây là <strong>cây render</strong> (render tree) — thứ React dựng ra khi render. Nó khác cây <em>module</em> (file nào import file nào, slide 5): <code>TheBacSi.tsx</code> được import một lần nhưng xuất hiện sáu lần trong cây render. React DevTools (Mục 0) hiện đúng cây render này ở tab Components, và bạn sẽ dùng nó ở mọi chương sau: Chương 2 đánh dấu component nào <em>giữ state</em>, Chương 8 đánh dấu cái nào <em>render lại</em> và cái nào được bỏ qua. Hôm nay cây chỉ trả lời hai câu hỏi — ai chứa ai, và dữ liệu đi đường nào.</p>
${SD.cayVi}

<h3>Tách khi một mảnh có việc riêng — không tách để có nhiều file</h3>
${slide('rx-01', 23, 'Tách khi có một việc riêng, không tách cho nhiều file')}
<p>Không có luật về kích thước. Những câu hỏi này quyết định:</p>
<ul>
<li><strong>Nó có lặp lại không?</strong> Sáu thẻ → <code>TheBacSi</code>. Lặp lại là lý do rõ ràng nhất.</li>
<li><strong>Bạn có gọi được tên việc của nó bằng hai ba chữ mà đồng nghiệp hiểu không?</strong> "Header", "danh sách bác sĩ" — được. "Cái div viền xanh" — không; đó là một class CSS, không phải component.</li>
<li><strong>Bạn có muốn test nó riêng không?</strong> Danh sách có ba hành vi đáng test (đủ bác sĩ, luật gắn nhãn, danh sách rỗng) mà không cần header hay footer chen vào — nên nó là component.</li>
<li><strong>File có đang dài ra, với một đường nối rõ ràng không?</strong> Component 300 dòng, form ở trên và bảng ở dưới, có sẵn đường cắt.</li>
</ul>
<p>Và những dấu hiệu bạn đã tách quá tay:</p>
<ul>
<li>Component chỉ bọc một phần tử và không thêm gì: <code>&lt;TenBacSi ten={…} /&gt;</code> quanh đúng một <code>&lt;h3&gt;</code>.</li>
<li>Một component con cần tám props từ cha chỉ để vẽ lại y nguyên — đường cắt đặt sai chỗ.</li>
<li>Đặt tên theo hình dạng (<code>BoxXanh</code>, <code>Cot2</code>) thay vì ý nghĩa. Khi thiết kế đổi màu, cái tên nói dối.</li>
</ul>
<p>Khi phân vân, bắt đầu với ít component, to hơn, rồi tách khi một trong các lý do trên xuất hiện. Tách về sau chỉ là cắt-dán cộng một dòng import; gộp những component tách quá tay nghĩa là gỡ rối cả mớ props.</p>
${SD.tachVi}

<h3>Dữ liệu đi một chiều: cha đưa xuống, con chỉ đọc</h3>
${slide('rx-01', 24, 'Dữ liệu đi MỘT chiều: cha đưa xuống, con chỉ đọc')}
<p><code>import { danhSachBacSi } from './du-lieu/bac-si'</code> nên nằm ở đâu — trong <code>App</code>, hay ngay trong <code>DanhSachBacSi</code>? Hôm nay cả hai đều vẽ ra cùng một trang. Dự án đặt nó ở <strong><code>App</code></strong> và cho <code>DanhSachBacSi</code> một prop <code>danhSach</code>, vì ba lý do:</p>
<ul>
<li><strong>Test được.</strong> Danh sách nhận dữ liệu từ ngoài thì test được với mảng rỗng, một bác sĩ, hai trăm bác sĩ (Chương 8). Danh sách tự import dữ liệu thì mãi chỉ hiện được đúng sáu người đó.</li>
<li><strong>Đổi nguồn dữ liệu.</strong> Ở Chương 6, bác sĩ đến từ API qua TanStack Query. Chỉ chỗ <em>lấy</em> dữ liệu thay đổi; <code>DanhSachBacSi</code> vẫn nhận một mảng.</li>
<li><strong>Dùng lại.</strong> Chương 2 lọc danh sách theo chuyên khoa. Mảng đã lọc đi vào đúng component này.</li>
</ul>
<p>Đây là <strong>luồng dữ liệu một chiều</strong> (one-way data flow) của React: dữ liệu đi vào ở trên cùng và chảy xuống qua props; con không bao giờ vươn lên sửa nó (Bài 1.2). Khi con cần <em>gây ra</em> một thay đổi — "người dùng vừa chọn bác sĩ này" — cha đưa cho nó một hàm để gọi; đó là Chương 2.</p>
${SD.motChieuVi}
<p>Hướng dẫn của React còn khuyên dựng <strong>bản tĩnh trước</strong>: chỉ props, không state, không tương tác. Đó chính là bản bạn có sau chương này. Bạn có thể dựng từ trên xuống (bắt đầu từ <code>App</code>, để tạm các con rỗng) hoặc từ dưới lên (bắt đầu từ <code>TheBacSi</code> kèm test, rồi danh sách, rồi cả trang). Với dự án đầu tay, từ dưới lên và có test ở mỗi bước ít rối hơn: mỗi mảnh chạy được trước khi mảnh sau cần tới nó.</p>

<h3>Test một component: vẽ với dữ liệu giả, tìm như người dùng</h3>
${slide('rx-01', 25, 'Test component: vẽ với dữ liệu giả, hỏi như người dùng')}
<p>Một test component làm ba việc: vẽ component với props bạn chọn, tìm phần tử theo cách người dùng tìm, và khẳng định thứ phải có ở đó. Testing Library (<code>@testing-library/react</code> 16.3.3, cài từ Mục 0) xây quanh việc thứ hai — nó cố ý không có "tìm theo class CSS", để test không vỡ khi đổi giao diện. Đây là file test của danh sách:</p>
<pre><code class="language-tsx">// src/components/DanhSachBacSi.test.tsx
import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import { danhSachBacSi } from '../du-lieu/bac-si';
import { DanhSachBacSi } from './DanhSachBacSi';

test('mỗi bác sĩ một thẻ, đúng thứ tự dữ liệu', () =&gt; {
  render(&lt;DanhSachBacSi danhSach={danhSachBacSi} /&gt;);
  const the = screen.getAllByRole('article');
  expect(the).toHaveLength(6);
  expect(within(the[0]).getByRole('heading')).toHaveTextContent('BS. Nguyễn Minh An');
  expect(within(the[5]).getByRole('heading')).toHaveTextContent('BS. Vũ Thảo Vy');
});

test('bác sĩ từ 15 năm kinh nghiệm được đánh dấu', () =&gt; {
  render(&lt;DanhSachBacSi danhSach={danhSachBacSi} /&gt;);
  // bs-4 (15 năm) và bs-6 (20 năm)
  expect(screen.getAllByText('Bác sĩ lâu năm')).toHaveLength(2);
});

test('danh sách rỗng thì báo, không vẽ lưới', () =&gt; {
  render(&lt;DanhSachBacSi danhSach={[]} /&gt;);
  expect(screen.getByText('Chưa có bác sĩ nào.')).toBeInTheDocument();
  expect(screen.queryByRole('article')).not.toBeInTheDocument();
});</code></pre>
<ul>
<li><strong><code>getByRole('article')</code> / <code>getAllByRole</code></strong> tìm phần tử theo vai trò (role) trợ năng — <code>&lt;article&gt;</code> có role "article", <code>&lt;h3&gt;</code> có role "heading". Ưu tiên role trước, rồi tới chữ; đó là thứ tự Testing Library khuyên dùng, và nó kiêm luôn một phép kiểm khả năng tiếp cận cơ bản.</li>
<li><strong><code>getBy…</code> ném lỗi</strong> nếu không khớp gì (hoặc khớp nhiều hơn một); <strong><code>queryBy…</code> trả về <code>null</code></strong> — chỉ dùng nó để khẳng định một thứ KHÔNG có mặt. <code>getAllBy…</code> trả về một mảng.</li>
<li><strong><code>within(el)</code></strong> giới hạn phép tìm trong một phần tử: tiêu đề <em>bên trong</em> thẻ đầu tiên.</li>
<li>Test thứ ba chính là lý do danh sách nhận prop: <code>danhSach={[]}</code> chạy nhánh rỗng chỉ bằng một dòng.</li>
</ul>
<p>Cả bộ test của dự án, trên máy dựng bài:</p>
<div class="out">$ npx vitest run --reporter=verbose
 ✓ src/components/TheBacSi.test.tsx &gt; hiện tên, chuyên khoa bằng tiếng Việt và số năm kinh nghiệm
 ✓ src/components/TheBacSi.test.tsx &gt; không có nhãn "Bác sĩ lâu năm" khi noiBat không được truyền
 ✓ src/components/TheBacSi.test.tsx &gt; có nhãn "Bác sĩ lâu năm" khi noiBat
 ✓ src/components/DanhSachBacSi.test.tsx &gt; mỗi bác sĩ một thẻ, đúng thứ tự dữ liệu
 ✓ src/components/DanhSachBacSi.test.tsx &gt; bác sĩ từ 15 năm kinh nghiệm được đánh dấu
 ✓ src/components/DanhSachBacSi.test.tsx &gt; danh sách rỗng thì báo, không vẽ lưới
 ✓ src/App.test.tsx &gt; trang chủ có tiêu đề phòng khám
 ✓ src/App.test.tsx &gt; trang chủ hiện đủ 6 bác sĩ
 Test Files  3 passed (3)
      Tests  8 passed (8)</div>
<p>(Đã bỏ phần thời gian. Reporter mặc định của Vitest 5 chỉ in phần tổng kết cho file xanh; <code>--reporter=verbose</code> liệt kê từng test.) Chương 9 đi xa hơn nhiều — sự kiện người dùng, code bất đồng bộ, giả lập API; khoá <code>/courses/testing</code> trên trang này dạy testing nói chung.</p>

<h3>Thiếu cleanup: test sau thấy cả thẻ của test trước</h3>
${slide('rx-01', 26, 'Thiếu cleanup: test sau thấy cả thẻ của test trước')}
<p>Lần đầu những test này chạy trong dự án thực hành, ba trên tám test đỏ:</p>
<div class="out">$ npx vitest run
 FAIL  src/App.test.tsx &gt; trang chủ hiện đủ 6 bác sĩ
AssertionError: expected [ &lt;article …(2)&gt;…(4)&lt;/article&gt;, …(11) ] to have a length of 6 but got 12

- Expected
+ Received

- 6
+ 12
…
      Tests  3 failed | 5 passed (8)</div>
<p>Mười hai thẻ, không phải sáu: test thứ hai trong file tìm thấy sáu thẻ nó vừa vẽ <em>cộng</em> sáu thẻ còn sót lại từ test thứ nhất. <code>render</code> của Testing Library gắn component vào <code>document.body</code>, và phải có gì đó gỡ nó ra sau mỗi test. Testing Library tự đăng ký việc dọn dẹp đó — nhưng chỉ khi trình chạy test cung cấp hàm <code>afterEach</code> toàn cục; phép kiểm đúng nghĩa đen là <code>if (typeof afterEach === 'function')</code> trong <code>node_modules/@testing-library/react/dist/index.js</code>. Vitest không tạo biến toàn cục trừ khi bạn đặt <code>test.globals: true</code>, nên trong dự án này không có ai dọn. Mục 0 chỉ có một test nên chưa lộ ra.</p>
<p>Cách sửa là ba dòng trong file setup mà <code>vite.config.ts</code> đã nạp sẵn (<code>setupFiles: ['./src/test/setup.ts']</code>):</p>
<pre><code class="language-ts">// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest mặc định globals: false ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.
afterEach(() =&gt; {
  cleanup();
});</code></pre>
<p>Sau đó: <code>Tests  8 passed (8)</code>. (Đặt <code>globals: true</code> trong cấu hình Vite cũng được; bản viết tường minh giữ các import hiện rõ và không đổi bản chất của <code>test</code> với <code>expect</code>.)</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — test chạy riêng thì xanh, chạy cả bộ thì đỏ.</strong> Bạn chạy một file test và nó xanh; chạy tất cả thì một test ở file khác đỏ với "found multiple elements" (tìm thấy nhiều phần tử) hoặc một con số đếm quá cao. Nguyên nhân gần như luôn là state bị chia sẻ giữa các test: DOM không được dọn, một biến cấp module bị sửa (như <code>soKhach</code> ở Bài 1.1), hay một mảng dữ liệu bị sắp xếp tại chỗ (Bài 1.2 — để ý test <code>.sort()</code> làm việc trên một <em>bản chép</em>, <code>[...danhSachBacSi]</code>, chính là để không làm hỏng test khác). Mỗi test phải bắt đầu từ một thế giới sạch.</div>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Bài tập FER202 thường nằm trong một <code>App.js</code> to, lắp từ các khối React-Bootstrap (<code>Container</code>, <code>Row</code>, <code>Col</code>, <code>Card</code>), mảng dữ liệu khai ngay đầu file, và kiểm bằng cách mở trình duyệt nhìn. → Đi làm, trang là một cây component nhỏ có kiểu, mỗi cái một file, dữ liệu đi vào ở một chỗ và chảy xuống qua props, và mỗi component có test chạy trong CI ở mọi pull request. · <em>Vì sao:</em> một đội năm người không thể cùng sửa một file 800 dòng; component nhỏ thì review được, dùng lại được, sửa được mà không làm vỡ hàng xóm, và test bắt được chỗ vỡ khi nó vẫn xảy ra. Cách FER202 ổn với một bài lab làm một mình, chấm một lần — và bản thân React-Bootstrap vẫn được dùng ở nhiều công cụ nội bộ; thứ thay đổi khi đi làm là kích cỡ các mảnh và lớp test bao quanh chúng.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Cho một bản thiết kế, bạn quyết định chia component thế nào?</strong><br>Đ: Tôi khoanh hộp quanh phần lặp lại hoặc có việc riêng, đặt tên theo ý nghĩa; đối chiếu với hình dạng dữ liệu, vì giao diện thường phản chiếu mô hình dữ liệu; xếp chúng thành cây; rồi dựng bản tĩnh chỉ với props, từ dưới lên, mỗi mảnh một test. Tôi tránh component chỉ bọc một phần tử, và đặt dữ liệu ở cha chung thấp nhất cần tới nó rồi truyền xuống.</p>
<p><strong>H: Luồng dữ liệu một chiều là gì?</strong><br>Đ: Dữ liệu đi từ cha xuống con qua props; con không được sửa props. Muốn đổi dữ liệu thuộc về cha, con gọi một hàm mà cha đã truyền xuống. Nhờ vậy dễ tìm một giá trị đến từ đâu và ai được đổi nó.</p>
<p><strong>H: Vì sao Testing Library ưu tiên <code>getByRole</code> hơn chọn theo class hay test id?</strong><br>Đ: Nó tìm trên trang theo cách người dùng và công nghệ hỗ trợ nhìn thấy trang, nên test sống sót qua những lần sửa giao diện, và còn đỏ khi markup trở nên khó tiếp cận. Test id là lựa chọn cuối cho phần tử không có role hay chữ để tìm.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> phòng khám gửi bạn mock-up thứ hai — mục "Chuyên khoa của chúng tôi" gồm bốn ô (Nội tổng quát, Nhi, Da liễu, Răng hàm mặt), mỗi ô hiện số bác sĩ của chuyên khoa đó.</p><ol>
<li>Trên giấy, khoanh hộp và vẽ cây component cho mục này. Quyết định component nào nhận prop nào.</li>
<li>Dựng bản tĩnh, từ dưới lên: thẻ <code>TheChuyenKhoa</code> có props <code>ten: string</code> và <code>soBacSi: number</code>, rồi một danh sách nhận <code>danhSach: BacSi[]</code> và tính bốn con số bằng <code>filter(…).length</code> ngay trong lúc render.</li>
<li>Viết một test vẽ danh sách với sáu bác sĩ và kiểm "Nhi" hiện 2, "Da liễu" hiện 1.</li>
<li>Viết test thứ hai với mảng rỗng. Quyết định mục này nên hiện gì, và làm cho nó hiện đúng như vậy.</li>
</ol><p><strong>Đạt khi:</strong> <code>npx tsc -b</code> không in gì; <code>npx vitest run</code> xanh, kể cả hai test mới; các con số được tính từ dữ liệu chứ không gõ tay (đổi chuyên khoa một bác sĩ trong <code>bac-si.ts</code>, sửa lại kỳ vọng, test vẫn xanh); và trong mục này không component nào import <code>bac-si.ts</code> ngoài component trên cùng.</p></div>

<h3>🛠 Tự gõ tiếp dự án</h3>
<p><strong>Điểm xuất phát:</strong> dự án sau Mục 0 — app Vite + TypeScript <code>phong-kham</code> có <code>src/App.tsx</code> trả về trang chủ tĩnh với tên "Phòng khám An Tâm" và giờ mở cửa, <code>src/App.test.tsx</code> có một test tìm thấy tiêu đề, và <code>src/test/setup.ts</code> được <code>vite.config.ts</code> nạp. Nếu bạn bỏ qua Mục 0, tạo dự án bằng <code>npm create vite@latest phong-kham -- --template react-ts</code> rồi cài Vitest, jsdom và Testing Library như hướng dẫn ở đó.</p>
<p><strong>Đề bài — hết Chương 1, trang chủ hiện sáu bác sĩ của phòng khám, dựng từ các component có kiểu và có test:</strong></p>
<ol>
<li>Tạo <code>src/types.ts</code> với sáu kiểu cố định của khoá (<code>ChuyenKhoa</code>, <code>BacSi</code>, <code>KhungGio</code>, <code>BenhNhan</code>, <code>TrangThaiLichHen</code>, <code>LichHen</code>) đúng tên — các chương sau dựa vào chúng.</li>
<li>Tạo <code>src/du-lieu/bac-si.ts</code> export <code>danhSachBacSi: BacSi[]</code> gồm sáu bác sĩ: <code>bs-1</code> BS. Nguyễn Minh An · noi · 12 năm; <code>bs-2</code> BS. Trần Thu Hà · nhi · 8; <code>bs-3</code> BS. Lê Quốc Bảo · da-lieu · 5; <code>bs-4</code> BS. Phạm Ngọc Lan · rang-ham-mat · 15; <code>bs-5</code> BS. Hoàng Đức Huy · noi · 3; <code>bs-6</code> BS. Vũ Thảo Vy · nhi · 20 — mỗi người một câu <code>gioiThieu</code>. Tạo <code>src/du-lieu/chuyen-khoa.ts</code> với <code>TEN_CHUYEN_KHOA: Record&lt;ChuyenKhoa, string&gt;</code>.</li>
<li>Tạo <code>Header</code> (chuyển tên phòng khám thành <code>&lt;h1&gt;</code> và giờ mở cửa vào đây) và <code>Footer</code> trong <code>src/components/</code>, export có tên.</li>
<li>Tạo <code>TheBacSi</code> với props <code>bacSi: BacSi</code> và <code>noiBat?: boolean</code>: một <code>&lt;article aria-label={bacSi.ten}&gt;</code> hiện tên trong <code>&lt;h3&gt;</code>, chuyên khoa bằng tiếng Việt, "N năm kinh nghiệm", lời giới thiệu, và nhãn "Bác sĩ lâu năm" chỉ khi <code>noiBat</code>.</li>
<li>Tạo <code>DanhSachBacSi</code> với prop <code>danhSach: BacSi[]</code>: tiêu đề "Đội ngũ bác sĩ (N)", mỗi bác sĩ một thẻ với <code>key={bs.id}</code> và <code>noiBat</code> khi từ 15 năm trở lên, và dòng "Chưa có bác sĩ nào." cho mảng rỗng.</li>
<li>Lắp <code>App</code>: <code>Header</code>, một <code>&lt;main&gt;</code> chứa <code>&lt;DanhSachBacSi danhSach={danhSachBacSi} /&gt;</code>, <code>Footer</code>. Thêm CSS để thẻ xếp lưới ba cột và thẻ nổi bật có viền nhấn.</li>
<li>Thêm <code>afterEach(cleanup)</code> vào <code>src/test/setup.ts</code>, rồi viết test: ba cho <code>TheBacSi</code>, ba cho <code>DanhSachBacSi</code>, và một test thứ hai trong <code>App.test.tsx</code> đếm đủ sáu thẻ.</li>
</ol>
<p><strong>Đạt khi (đủ cả ba):</strong></p>
<ul>
<li><code>npx tsc -b</code> không in gì và <code>npx vitest run</code> kết thúc bằng <code>Tests  8 passed (8)</code> (nhiều hơn nếu bạn viết thêm test);</li>
<li>console trình duyệt không có cảnh báo "unique key";</li>
<li>trang trông giống ảnh chụp ở slide 21: dải đầu trang, "Đội ngũ bác sĩ (6)", sáu thẻ xếp ba cột, hai thẻ (BS. Phạm Ngọc Lan và BS. Vũ Thảo Vy) có viền nhấn và nhãn "Bác sĩ lâu năm", và chân trang.</li>
</ul>
<details><summary>Lời giải</summary>
<p>Đây là đúng code của dự án thực hành của khoá sau Chương 1, kiểm ngày 25/09/2026: <code>npx tsc -b</code> không in gì, <code>npx vitest run</code> ra <code>Test Files  3 passed (3)</code> / <code>Tests  8 passed (8)</code>, và <code>npx vite build</code> ra <code>dist/assets/index-….js 222.08 kB │ gzip: 69.84 kB</code>. <code>src/main.tsx</code> và <code>vite.config.ts</code> giữ nguyên như Mục 0.</p>
<p><code>src/types.ts</code></p>
<pre><code class="language-ts">export type ChuyenKhoa = 'noi' | 'nhi' | 'da-lieu' | 'rang-ham-mat';

export interface BacSi {
  id: string;
  ten: string;
  chuyenKhoa: ChuyenKhoa;
  namKinhNghiem: number;
  gioiThieu: string;
}

export interface KhungGio {
  id: string;
  bacSiId: string;
  batDau: string; // ISO
  conTrong: boolean;
}

export interface BenhNhan {
  hoTen: string;
  soDienThoai: string;
  ngaySinh: string; // YYYY-MM-DD
}

export type TrangThaiLichHen = 'cho-xac-nhan' | 'da-xac-nhan' | 'da-huy';

export interface LichHen {
  id: string;
  bacSiId: string;
  khungGioId: string;
  benhNhan: BenhNhan;
  lyDo: string;
  trangThai: TrangThaiLichHen;
}</code></pre>
<p><code>src/du-lieu/bac-si.ts</code></p>
<pre><code class="language-ts">import type { BacSi } from '../types';

export const danhSachBacSi: BacSi[] = [
  { id: 'bs-1', ten: 'BS. Nguyễn Minh An', chuyenKhoa: 'noi', namKinhNghiem: 12, gioiThieu: 'Khám và theo dõi bệnh mạn tính: tăng huyết áp, tiểu đường, dạ dày.' },
  { id: 'bs-2', ten: 'BS. Trần Thu Hà', chuyenKhoa: 'nhi', namKinhNghiem: 8, gioiThieu: 'Khám trẻ từ sơ sinh tới 15 tuổi, tư vấn dinh dưỡng và tiêm chủng.' },
  { id: 'bs-3', ten: 'BS. Lê Quốc Bảo', chuyenKhoa: 'da-lieu', namKinhNghiem: 5, gioiThieu: 'Mụn trứng cá, viêm da cơ địa, chăm sóc da sau điều trị.' },
  { id: 'bs-4', ten: 'BS. Phạm Ngọc Lan', chuyenKhoa: 'rang-ham-mat', namKinhNghiem: 15, gioiThieu: 'Nhổ răng khôn, trám răng, chỉnh nha cho người lớn.' },
  { id: 'bs-5', ten: 'BS. Hoàng Đức Huy', chuyenKhoa: 'noi', namKinhNghiem: 3, gioiThieu: 'Khám tổng quát, đọc kết quả xét nghiệm, tư vấn lối sống.' },
  { id: 'bs-6', ten: 'BS. Vũ Thảo Vy', chuyenKhoa: 'nhi', namKinhNghiem: 20, gioiThieu: 'Hô hấp nhi, hen phế quản ở trẻ, khám sức khoẻ định kỳ.' },
];</code></pre>
<p><code>src/du-lieu/chuyen-khoa.ts</code></p>
<pre><code class="language-ts">import type { ChuyenKhoa } from '../types';

export const TEN_CHUYEN_KHOA: Record&lt;ChuyenKhoa, string&gt; = {
  noi: 'Nội tổng quát',
  nhi: 'Nhi',
  'da-lieu': 'Da liễu',
  'rang-ham-mat': 'Răng hàm mặt',
};</code></pre>
<p><code>src/components/Header.tsx</code></p>
<pre><code class="language-tsx">export function Header() {
  return (
    &lt;header className="header"&gt;
      &lt;h1&gt;Phòng khám An Tâm&lt;/h1&gt;
      &lt;p&gt;Mở cửa 7:30–20:00, thứ Hai đến thứ Bảy&lt;/p&gt;
    &lt;/header&gt;
  );
}</code></pre>
<p><code>src/components/Footer.tsx</code></p>
<pre><code class="language-tsx">export function Footer() {
  return (
    &lt;footer className="footer"&gt;
      &lt;p&gt;12 Lê Lợi, Quận 1, TP.HCM · Hotline 1900 1234&lt;/p&gt;
      &lt;p&gt;© 2026 Phòng khám An Tâm&lt;/p&gt;
    &lt;/footer&gt;
  );
}</code></pre>
<p><code>src/components/TheBacSi.tsx</code></p>
<pre><code class="language-tsx">import { TEN_CHUYEN_KHOA } from '../du-lieu/chuyen-khoa';
import type { BacSi } from '../types';

interface TheBacSiProps {
  bacSi: BacSi;
  noiBat?: boolean; // dấu ? = không bắt buộc
}

export function TheBacSi({ bacSi, noiBat = false }: TheBacSiProps) {
  return (
    &lt;article className={noiBat ? 'the-bac-si noi-bat' : 'the-bac-si'} aria-label={bacSi.ten}&gt;
      &lt;h3&gt;{bacSi.ten}&lt;/h3&gt;
      &lt;p className="chuyen-khoa"&gt;{TEN_CHUYEN_KHOA[bacSi.chuyenKhoa]}&lt;/p&gt;
      &lt;p&gt;{bacSi.namKinhNghiem} năm kinh nghiệm&lt;/p&gt;
      {noiBat &amp;&amp; &lt;p className="nhan"&gt;Bác sĩ lâu năm&lt;/p&gt;}
      &lt;p className="gioi-thieu"&gt;{bacSi.gioiThieu}&lt;/p&gt;
    &lt;/article&gt;
  );
}</code></pre>
<p><code>src/components/DanhSachBacSi.tsx</code></p>
<pre><code class="language-tsx">import type { BacSi } from '../types';
import { TheBacSi } from './TheBacSi';

interface DanhSachBacSiProps {
  danhSach: BacSi[];
}

export function DanhSachBacSi({ danhSach }: DanhSachBacSiProps) {
  if (danhSach.length === 0) {
    return &lt;p&gt;Chưa có bác sĩ nào.&lt;/p&gt;;
  }
  return (
    &lt;section aria-labelledby="tieu-de-bac-si"&gt;
      &lt;h2 id="tieu-de-bac-si"&gt;Đội ngũ bác sĩ ({danhSach.length})&lt;/h2&gt;
      &lt;div className="luoi-bac-si"&gt;
        {danhSach.map((bs) =&gt; (
          &lt;TheBacSi key={bs.id} bacSi={bs} noiBat={bs.namKinhNghiem &gt;= 15} /&gt;
        ))}
      &lt;/div&gt;
    &lt;/section&gt;
  );
}</code></pre>
<p><code>src/App.tsx</code></p>
<pre><code class="language-tsx">import './App.css';
import { DanhSachBacSi } from './components/DanhSachBacSi';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { danhSachBacSi } from './du-lieu/bac-si';

export default function App() {
  return (
    &lt;&gt;
      &lt;Header /&gt;
      &lt;main className="noi-dung"&gt;
        &lt;DanhSachBacSi danhSach={danhSachBacSi} /&gt;
      &lt;/main&gt;
      &lt;Footer /&gt;
    &lt;/&gt;
  );
}</code></pre>
<p><code>src/App.css</code></p>
<pre><code class="language-css">.header { background: #0e7490; color: #fff; padding: 20px 32px; }
.header h1 { margin: 0 0 4px; font-size: 28px; }
.header p { margin: 0; opacity: .9; }
.noi-dung { max-width: 1100px; margin: 0 auto; padding: 24px 32px; }
.noi-dung h2 { margin: 0 0 16px; font-size: 22px; }
.luoi-bac-si { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.the-bac-si { border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px 16px; background: #fff; }
.the-bac-si h3 { margin: 0 0 4px; font-size: 18px; color: #0f172a; }
.the-bac-si p { margin: 4px 0; color: #334155; font-size: 14px; }
.the-bac-si .chuyen-khoa { color: #0e7490; font-weight: 600; }
.the-bac-si .gioi-thieu { color: #64748b; }
.the-bac-si.noi-bat { border: 2px solid #f59e0b; }
.the-bac-si .nhan { display: inline-block; background: #fef3c7; color: #92400e; border-radius: 6px; padding: 1px 8px; font-size: 12px; font-weight: 600; }
.footer { border-top: 1px solid #e2e8f0; color: #64748b; padding: 16px 32px; font-size: 14px; }
.footer p { margin: 2px 0; }</code></pre>
<p><code>src/index.css</code></p>
<pre><code class="language-css">:root { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; color: #0f172a; background: #f8fafc; }
body { margin: 0; }</code></pre>
<p><code>src/test/setup.ts</code></p>
<pre><code class="language-ts">import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest mặc định globals: false ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.
// Không có dòng này, test sau thấy cả những gì test trước đã vẽ.
afterEach(() =&gt; {
  cleanup();
});</code></pre>
<p><code>src/components/TheBacSi.test.tsx</code></p>
<pre><code class="language-tsx">import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import type { BacSi } from '../types';
import { TheBacSi } from './TheBacSi';

const bacSiGia: BacSi = {
  id: 'bs-x',
  ten: 'BS. Thử Nghiệm',
  chuyenKhoa: 'da-lieu',
  namKinhNghiem: 7,
  gioiThieu: 'Chỉ dùng trong test.',
};

test('hiện tên, chuyên khoa bằng tiếng Việt và số năm kinh nghiệm', () =&gt; {
  render(&lt;TheBacSi bacSi={bacSiGia} /&gt;);
  expect(screen.getByRole('heading', { name: 'BS. Thử Nghiệm' })).toBeInTheDocument();
  expect(screen.getByText('Da liễu')).toBeInTheDocument();
  expect(screen.getByText('7 năm kinh nghiệm')).toBeInTheDocument();
});

test('không có nhãn "Bác sĩ lâu năm" khi noiBat không được truyền', () =&gt; {
  render(&lt;TheBacSi bacSi={bacSiGia} /&gt;);
  expect(screen.queryByText('Bác sĩ lâu năm')).not.toBeInTheDocument();
});

test('có nhãn "Bác sĩ lâu năm" khi noiBat', () =&gt; {
  render(&lt;TheBacSi bacSi={bacSiGia} noiBat /&gt;);
  expect(screen.getByText('Bác sĩ lâu năm')).toBeInTheDocument();
});</code></pre>
<p><code>src/components/DanhSachBacSi.test.tsx</code></p>
<pre><code class="language-tsx">import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import { danhSachBacSi } from '../du-lieu/bac-si';
import { DanhSachBacSi } from './DanhSachBacSi';

test('mỗi bác sĩ một thẻ, đúng thứ tự dữ liệu', () =&gt; {
  render(&lt;DanhSachBacSi danhSach={danhSachBacSi} /&gt;);
  const the = screen.getAllByRole('article');
  expect(the).toHaveLength(6);
  expect(within(the[0]).getByRole('heading')).toHaveTextContent('BS. Nguyễn Minh An');
  expect(within(the[5]).getByRole('heading')).toHaveTextContent('BS. Vũ Thảo Vy');
});

test('bác sĩ từ 15 năm kinh nghiệm được đánh dấu', () =&gt; {
  render(&lt;DanhSachBacSi danhSach={danhSachBacSi} /&gt;);
  // bs-4 (15 năm) và bs-6 (20 năm)
  expect(screen.getAllByText('Bác sĩ lâu năm')).toHaveLength(2);
});

test('danh sách rỗng thì báo, không vẽ lưới', () =&gt; {
  render(&lt;DanhSachBacSi danhSach={[]} /&gt;);
  expect(screen.getByText('Chưa có bác sĩ nào.')).toBeInTheDocument();
  expect(screen.queryByRole('article')).not.toBeInTheDocument();
});</code></pre>
<p><code>src/App.test.tsx</code></p>
<pre><code class="language-tsx">import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('trang chủ có tiêu đề phòng khám', () =&gt; {
  render(&lt;App /&gt;);
  expect(screen.getByRole('heading', { level: 1, name: 'Phòng khám An Tâm' })).toBeInTheDocument();
});

test('trang chủ hiện đủ 6 bác sĩ', () =&gt; {
  render(&lt;App /&gt;);
  expect(screen.getAllByRole('article')).toHaveLength(6);
});</code></pre>
</details>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">mock-up (bản phác)</span><span class="v">bức hình của trang dự định làm — điểm xuất phát để khoanh hộp component</span></div>
<div class="kv"><span class="k">cây component</span><span class="v">các component xếp sao cho hộp nằm trong hộp khác là con của nó</span></div>
<div class="kv"><span class="k">cây render (render tree)</span><span class="v">cây các thể hiện component mà React dựng ra; một file có thể xuất hiện nhiều lần</span></div>
<div class="kv"><span class="k">luồng dữ liệu một chiều</span><span class="v">dữ liệu đi từ cha xuống con qua props; con không sửa nó</span></div>
<div class="kv"><span class="k">bản tĩnh (static version)</span><span class="v">giao diện dựng chỉ bằng props, chưa có state — bước 2 của Thinking in React</span></div>
<div class="kv"><span class="k"><code>getByRole</code> / <code>queryByRole</code></span><span class="v">tìm theo vai trò trợ năng; <code>get</code> ném lỗi nếu không có, <code>query</code> trả <code>null</code></span></div>
<div class="kv"><span class="k"><code>cleanup</code> (dọn dẹp)</span><span class="v">gỡ thứ mà <code>render</code> đã gắn; phải chạy sau mỗi test (tự động chỉ khi có <code>afterEach</code> toàn cục)</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bắt đầu từ mock-up: khoanh mỗi phần có việc riêng, đặt tên theo ý nghĩa, đối chiếu với hình dạng dữ liệu.</li>
<li>Xếp các hộp thành cây; trang chủ là <code>App → Header, DanhSachBacSi → TheBacSi ×6, Footer</code>.</li>
<li>Tách vì lặp lại, vì có việc gọi được tên, hay để test riêng — không tách để file ngắn đi; tránh component bọc một phần tử và props chỉ để chuyền tay.</li>
<li>Dữ liệu vào ở trên cùng (<code>App</code>) và chảy xuống qua props, nhờ đó danh sách test được với mảng bất kỳ.</li>
<li>Test từng component với dữ liệu giả và phép tìm theo role; bộ test của dự án là 8 test xanh.</li>
<li>Với <code>globals: false</code> mặc định của Vitest, tự thêm <code>afterEach(cleanup)</code> — thiếu nó, một test đếm ra 12 thẻ thay vì 6.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Thinking in React</span><span class="lc-sub">react.dev/learn/thinking-in-react — năm bước: cây component, bản tĩnh, state tối thiểu, state nằm ở đâu, luồng dữ liệu ngược.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Understanding Your UI as a Tree</span><span class="lc-sub">react.dev/learn/understanding-your-ui-as-a-tree — cây render và cây phụ thuộc module.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Describing the UI</span><span class="lc-sub">react.dev/learn/describing-the-ui — chương tài liệu React mà chương này của khoá đi theo.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Khoá Testing trên trang này</span><span class="lc-sub">/courses/testing — phép tìm, sự kiện người dùng và thiết kế test vượt ra ngoài React; Chương 9 của khoá này áp dụng chúng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.5 ─────────────────────────── */
    {
      title: '1.5 — Chapter 1 quiz|||1.5 — Kiểm tra Chương 1',
      slug: 'rx-1-5-kiem-tra',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống trên đúng những gì Chương 1 đã chạy thật: tên viết thường, StrictMode và component không thuần, định nghĩa lồng, lỗi kiểu props, bẫy số 0, .sort() trên props, key={index}, nguồn key, key không phải prop, và cleanup trong Vitest.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>What Chapter 1 measured</h2>
<p class="lead">Ten questions, fifteen minutes. Every answer comes from something the chapter actually ran — a <code>tsc</code> error, a test&#39;s output, a screenshot — not from a definition. Several wrong options are what a reasonable person would predict before running the code; that is the point.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write a component in its own file with a named export, and explain why its name must be capitalised.</li>
<li>I can explain what "render" means in React and why a component must be pure, and predict what Strict Mode does to an impure one.</li>
<li>I can type props with an <code>interface</code>, an optional prop, a default value and <code>children: ReactNode</code>, and read the <code>tsc</code> errors for wrong props.</li>
<li>I can avoid the "0 on screen" trap and never mutate an array received as a prop.</li>
<li>I can render a list with <code>map</code> and a stable key, and explain what goes wrong with <code>key={index}</code>.</li>
<li>I can split a page into a component tree and test each component with Testing Library.</li>
</ul>
${slide('rx-01', 28, 'Chapter 1 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Chương 1 đã đo được gì</h2>
<p class="lead">Mười câu, mười lăm phút. Đáp án nào cũng lấy từ một thứ chương này đã chạy thật — một lỗi <code>tsc</code>, output của một test, một ảnh chụp — không phải từ định nghĩa. Nhiều phương án sai chính là điều một người hợp lý sẽ đoán trước khi chạy code; đó là chủ đích.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được một component trong file riêng với export có tên, và giải thích được vì sao tên phải viết hoa chữ đầu.</li>
<li>Tôi giải thích được "render" trong React nghĩa là gì, vì sao component phải thuần, và đoán được Strict Mode làm gì với component không thuần.</li>
<li>Tôi gõ kiểu được props bằng <code>interface</code>, prop không bắt buộc, giá trị mặc định và <code>children: ReactNode</code>, và đọc được lỗi <code>tsc</code> khi truyền sai props.</li>
<li>Tôi tránh được bẫy "số 0 trên màn hình" và không bao giờ sửa tại chỗ một mảng nhận qua props.</li>
<li>Tôi vẽ được danh sách bằng <code>map</code> với key ổn định, và giải thích được <code>key={index}</code> hỏng ở đâu.</li>
<li>Tôi chia được một trang thành cây component và test từng component bằng Testing Library.</li>
</ul>
${slide('rx-01', 28, 'Bảng tra nhanh Chương 1')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A teammate writes function theBacSi() { return <article>BS. Nguyễn Minh An</article>; } and renders it as <theBacSi />, silencing TypeScript with @ts-expect-error. What does the page contain?|||Một bạn cùng nhóm viết function theBacSi() { return <article>BS. Nguyễn Minh An</article>; } rồi vẽ nó bằng <theBacSi />, tắt lỗi TypeScript bằng @ts-expect-error. Trang chứa gì?',
            options: [
              'The article with the doctor’s name — React finds the function by name regardless of case|||Thẻ article có tên bác sĩ — React tìm hàm theo tên, không phân biệt hoa thường',
              'An empty unknown element <thebacsi></thebacsi>; the function never runs, and the console shows casing warnings|||Một thẻ lạ rỗng <thebacsi></thebacsi>; hàm không hề chạy, console hiện cảnh báo về chữ hoa/thường',
              'Nothing: React throws an error and the whole page goes blank|||Không có gì: React ném lỗi và cả trang trắng',
              'The text "theBacSi" printed as plain text|||Chữ "theBacSi" in ra dưới dạng văn bản thường',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The JSX transform turns a lowercase tag into jsx("theBacSi", …) — a string, i.e. an HTML element name — so React creates an unknown DOM element and never calls your function. The chapter’s test printed DOM: <thebacsi></thebacsi> and two console errors ("is using incorrect casing", "is unrecognized in this browser"). It does not throw, so the page is not blank — which is exactly why the bug is easy to miss without TypeScript (TS2339).|||VI: Bộ chuyển JSX biến thẻ viết thường thành jsx("theBacSi", …) — một chuỗi, tức tên thẻ HTML — nên React tạo một phần tử DOM lạ và không bao giờ gọi hàm của bạn. Test của chương in ra DOM: <thebacsi></thebacsi> và hai lỗi console ("is using incorrect casing", "is unrecognized in this browser"). React không ném lỗi nên trang không trắng — đó chính là lý do bug này dễ lọt nếu không có TypeScript (TS2339).',
          },
          {
            question: 'let soKhach = 0; function KhachSai() { soKhach = soKhach + 1; return <p>Khách số #{soKhach}</p>; } — three <KhachSai /> are rendered inside <StrictMode> in development. What do they show?|||let soKhach = 0; function KhachSai() { soKhach = soKhach + 1; return <p>Khách số #{soKhach}</p>; } — ba <KhachSai /> được vẽ bên trong <StrictMode> lúc dev. Chúng hiện gì?',
            options: [
              '#1, #2, #3|||#1, #2, #3',
              '#1, #1, #1|||#1, #1, #1',
              '#3, #6, #9|||#3, #6, #9',
              '#2, #4, #6|||#2, #4, #6',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: In development, Strict Mode calls each component function twice per render and keeps one result, so the outside counter moves twice per component: the real test printed [ "Khách số #2", "Khách số #4", "Khách số #6" ]. #1, #2, #3 is what you would see without Strict Mode — which hides the impurity until React renders an extra time for another reason. The fix is a pure component that receives the number as a prop.|||VI: Lúc dev, Strict Mode gọi mỗi hàm component hai lần mỗi lượt render và giữ một kết quả, nên bộ đếm bên ngoài tăng hai lần cho mỗi component: test thật in ra [ "Khách số #2", "Khách số #4", "Khách số #6" ]. #1, #2, #3 là thứ bạn thấy khi không có Strict Mode — nó che mất sự không thuần cho tới lúc React render thêm một lần vì lý do khác. Cách sửa là component thuần nhận con số qua props.',
          },
          {
            question: 'Inside FormSai, a teammate defines function ONhap() { return <input />; } and renders <ONhap /> next to a button that makes FormSai re-render. A user types "đau đầu" into the input, then clicks the button. What is in the input now?|||Bên trong FormSai, một bạn định nghĩa function ONhap() { return <input />; } và vẽ <ONhap /> cạnh một nút bấm làm FormSai render lại. Người dùng gõ "đau đầu" vào ô nhập rồi bấm nút. Ô nhập giờ chứa gì?',
            options: [
              'Nothing — ONhap is a new function on every render, so React replaces the input with a new, empty one|||Trống — mỗi lần render ONhap là một hàm mới, nên React thay ô nhập bằng một ô mới, trống',
              '"đau đầu" — an uncontrolled input keeps its own text|||"đau đầu" — ô nhập không kiểm soát tự giữ chữ của nó',
              'React throws "components cannot be defined inside components"|||React ném lỗi "không được định nghĩa component bên trong component"',
              '"đau đầu", but the cursor leaves the input|||"đau đầu", nhưng con trỏ rời khỏi ô nhập',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: React identifies a component by the function it points to. Re-running FormSai creates a brand-new ONhap function, so React sees a different component at that position, unmounts the old input (with its text) and mounts a new one. The chapter measured "đau đầu" before the click and "" after; the version defined at the top level kept "đau đầu". An uncontrolled input does keep its text — but only while it is the same DOM element, which is exactly what is lost here. React does not throw.|||VI: React nhận mặt component bằng chính hàm mà nó trỏ tới. FormSai chạy lại là tạo ra một hàm ONhap mới tinh, nên React thấy một component khác ở vị trí đó, gỡ ô nhập cũ (kèm chữ) và gắn ô mới. Chương này đo được "đau đầu" trước khi bấm và "" sau khi bấm; bản định nghĩa ở cấp cao nhất giữ nguyên "đau đầu". Ô nhập không kiểm soát đúng là tự giữ chữ — nhưng chỉ khi nó vẫn là cùng một phần tử DOM, và đó chính là thứ bị mất ở đây. React không ném lỗi.',
          },
          {
            question: 'TheBacSi has interface TheBacSiProps { bacSi: BacSi; noiBat?: boolean }. Someone writes <TheBacSi bacSi={bs} noiBat="true" />. What happens when you run npx tsc -b?|||TheBacSi có interface TheBacSiProps { bacSi: BacSi; noiBat?: boolean }. Có người viết <TheBacSi bacSi={bs} noiBat="true" />. Chạy npx tsc -b thì sao?',
            options: [
              'Nothing — the string "true" is converted to the boolean true|||Không có gì — chuỗi "true" được đổi thành boolean true',
              'No tsc error, but PropTypes prints a warning in the browser console|||tsc không lỗi, nhưng PropTypes in cảnh báo trên console trình duyệt',
              'error TS2322: Type ‘string’ is not assignable to type ‘boolean | undefined’.|||error TS2322: Type ‘string’ is not assignable to type ‘boolean | undefined’.',
              'error TS2741: Property ‘noiBat’ is missing|||error TS2741: Property ‘noiBat’ is missing',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: A value in quotes is a string; the optional prop’s type is boolean | undefined, so tsc reports TS2322 — the exact line the chapter recorded. Nothing converts "true" to true. There is no PropTypes here, and React 19 ignores propTypes anyway (measured: 0 warnings). TS2741 is for a missing required prop, and noiBat is optional. Write noiBat or noiBat={true}.|||VI: Giá trị trong nháy là chuỗi; kiểu của prop không bắt buộc là boolean | undefined, nên tsc báo TS2322 — đúng dòng chương đã ghi lại. Không có gì tự đổi "true" thành true. Ở đây không có PropTypes, và React 19 dù sao cũng bỏ qua propTypes (đo: 0 cảnh báo). TS2741 là cho prop bắt buộc bị thiếu, mà noiBat thì không bắt buộc. Hãy viết noiBat hoặc noiBat={true}.',
          },
          {
            question: 'function SoLich({ soLich }: { soLich: number }) { return <div>{soLich && <p>Bạn có {soLich} lịch hẹn</p>}</div>; } is rendered with soLich={0}. What does the user see?|||function SoLich({ soLich }: { soLich: number }) { return <div>{soLich && <p>Bạn có {soLich} lịch hẹn</p>}</div>; } được vẽ với soLich={0}. Người dùng thấy gì?',
            options: [
              'Nothing — 0 is falsy, so React renders nothing|||Không có gì — 0 là falsy nên React không vẽ gì',
              'A lone "0"|||Một chữ "0" trơ trọi',
              'The word "false"|||Chữ "false"',
              '"Bạn có 0 lịch hẹn"|||"Bạn có 0 lịch hẹn"',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: 0 && x evaluates to 0, not false, and React renders numbers — the chapter’s test got "<div>0</div>" and the screenshot shows the stray 0. React skips false, null and undefined, which is why the pattern is safe only with a real boolean on the left. "Bạn có 0 lịch hẹn" would need the right side to be evaluated, which && never does when the left side is falsy. Fix: soLich > 0 && … or a ternary.|||VI: 0 && x cho ra 0, không phải false, và React có vẽ số — test của chương ra "<div>0</div>" và ảnh chụp cho thấy chữ 0 lạc. React bỏ qua false, null và undefined, nên mẫu này chỉ an toàn khi vế trái là boolean thật. "Bạn có 0 lịch hẹn" cần vế phải được tính, mà && không bao giờ tính vế phải khi vế trái falsy. Sửa: soLich > 0 && … hoặc toán tử ba ngôi.',
          },
          {
            question: 'A child component receives danhSach: BacSi[] and does const sx = danhSach.sort((a, b) => b.namKinhNghiem - a.namKinhNghiem); to show the most experienced first. What happens to the parent’s array?|||Một component con nhận danhSach: BacSi[] và viết const sx = danhSach.sort((a, b) => b.namKinhNghiem - a.namKinhNghiem); để hiện người nhiều kinh nghiệm nhất trước. Mảng của cha ra sao?',
            options: [
              'It is reordered too: sort changes the array in place, and the child holds the same array as the parent|||Cũng bị đảo thứ tự: sort sửa mảng tại chỗ, và con giữ đúng mảng của cha',
              'Unchanged: React gives each child its own copy of props|||Không đổi: React đưa cho mỗi con một bản chép riêng của props',
              'Unchanged, because React throws "cannot assign to read-only property"|||Không đổi, vì React ném lỗi "không gán được vào thuộc tính chỉ đọc"',
              'tsc refuses to compile, because props are readonly in TypeScript|||tsc từ chối biên dịch, vì props là readonly trong TypeScript',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Objects and arrays are passed by reference; React does not copy them. sort mutates in place, so the parent’s array changed — measured: "trước render: bs-1 … bs-6", "sau render: bs-6 bs-4 bs-1 bs-2 bs-3 bs-5". Nothing throws: React does not freeze arrays inside props, and the interface here has no readonly modifier, so tsc is silent too. Use danhSach.toSorted(…) or [...danhSach].sort(…).|||VI: Object và mảng được truyền bằng tham chiếu; React không chép chúng. sort sửa tại chỗ, nên mảng của cha đổi theo — đo được: "trước render: bs-1 … bs-6", "sau render: bs-6 bs-4 bs-1 bs-2 bs-3 bs-5". Không có gì ném lỗi: React không đóng băng mảng nằm trong props, và interface ở đây không có readonly, nên tsc cũng im lặng. Dùng danhSach.toSorted(…) hoặc [...danhSach].sort(…).',
          },
          {
            question: 'A list of doctors uses key={index}; each row has an uncontrolled <input> for a note. The user types "dị ứng penicillin" for BS. Nguyễn Minh An (first row), then a new doctor is inserted at the top. Where is the note now?|||Danh sách bác sĩ dùng key={index}; mỗi dòng có một <input> không kiểm soát để ghi chú. Người dùng gõ "dị ứng penicillin" cho BS. Nguyễn Minh An (dòng đầu), rồi một bác sĩ mới được chèn lên đầu. Ghi chú giờ ở đâu?',
            options: [
              'Still next to BS. Nguyễn Minh An — React tracks the data|||Vẫn cạnh BS. Nguyễn Minh An — React bám theo dữ liệu',
              'Gone from every row — the list is rebuilt|||Mất khỏi mọi dòng — danh sách bị dựng lại',
              'Next to BS. Nguyễn Minh An, but React logs a key warning|||Cạnh BS. Nguyễn Minh An, nhưng React in cảnh báo về key',
              'Next to the newly inserted doctor|||Cạnh bác sĩ vừa được chèn vào',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: With index keys, key 0 before and key 0 after are "the same element" to React. It updates the name text in that row and keeps its input — with the typed note — so the note appears next to the new doctor. The chapter recorded it in a test ("BS. Đỗ Thanh Tâm → dị ứng penicillin") and a real screenshot; with key={bs.id} the note stayed with bs-1. There is no warning: adding key={index} is what silenced it.|||VI: Với key bằng index, key 0 trước và key 0 sau là "cùng một phần tử" đối với React. Nó sửa chữ tên trong dòng đó và giữ nguyên ô nhập — kèm ghi chú đã gõ — nên ghi chú hiện cạnh bác sĩ mới. Chương đã ghi lại bằng test ("BS. Đỗ Thanh Tâm → dị ứng penicillin") và ảnh chụp thật; với key={bs.id} ghi chú ở lại với bs-1. Không có cảnh báo nào: chính việc thêm key={index} đã làm cảnh báo im đi.',
          },
          {
            question: 'Doctors come from the clinic’s API. Doctors can be filtered, sorted and removed, and two doctors may have the same name. Which key should the list use?|||Danh sách bác sĩ đến từ API của phòng khám. Bác sĩ có thể được lọc, sắp xếp và xoá, và hai bác sĩ có thể trùng tên. Danh sách nên dùng key nào?',
            options: [
              'key={index} — it is unique and never undefined|||key={index} — nó duy nhất và không bao giờ undefined',
              'key={Math.random()} — it is always unique|||key={Math.random()} — lúc nào cũng duy nhất',
              'key={bs.id} — the id from the data|||key={bs.id} — id có trong dữ liệu',
              'key={bs.ten} — names are readable in DevTools|||key={bs.ten} — tên đọc được trong DevTools',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: A key must be unique among siblings and stable across renders; an id from the database or API is both. The index is unique but identity = position, which breaks on filter/sort/remove. Math.random() changes every render, so every row is rebuilt (measured: "cùng một ô input? false", typed text lost). Names can repeat — duplicate keys produced "Encountered two children with the same key", which React calls unsupported.|||VI: Key phải duy nhất giữa các anh em và ổn định qua các lần render; id từ cơ sở dữ liệu hay API thoả cả hai. Index thì duy nhất nhưng danh tính = vị trí, hỏng khi lọc/sắp xếp/xoá. Math.random() đổi ở mỗi lần render, nên mọi dòng bị dựng lại (đo được: "cùng một ô input? false", chữ đã gõ mất). Tên có thể trùng — key trùng cho ra "Encountered two children with the same key", điều React gọi là không được hỗ trợ.',
          },
          {
            question: 'function DongBacSi(props: { ten: string }) { return <li>{props.ten} ({props.key})</li>; } is rendered as <DongBacSi key="bs-1" ten="BS. Nguyễn Minh An" />. What happens?|||function DongBacSi(props: { ten: string }) { return <li>{props.ten} ({props.key})</li>; } được vẽ bằng <DongBacSi key="bs-1" ten="BS. Nguyễn Minh An" />. Chuyện gì xảy ra?',
            options: [
              'It shows "BS. Nguyễn Minh An (bs-1)"|||Hiện "BS. Nguyễn Minh An (bs-1)"',
              'tsc reports TS2339 (Property ‘key’ does not exist), and at run time key is not in props|||tsc báo TS2339 (Property ‘key’ does not exist), và lúc chạy key không có trong props',
              'tsc accepts it because every component has a key prop|||tsc chấp nhận vì component nào cũng có prop key',
              'React throws "key is a reserved prop"|||React ném lỗi "key là prop dành riêng"',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: key is consumed by React to match siblings and is not passed to the component. tsc said: "Property ‘key’ does not exist on type ‘{ ten: string; }’", and a component rendered with key="bs-1" id="bs-1" received only {"id":"bs-1","ten":…}. Components may be given a key (that is why JSX accepts it), but they cannot read it; nothing throws. Pass the id as a separate prop if the child needs it.|||VI: key do React dùng để ghép các anh em và không được truyền vào component. tsc báo: "Property ‘key’ does not exist on type ‘{ ten: string; }’", và một component được vẽ với key="bs-1" id="bs-1" chỉ nhận {"id":"bs-1","ten":…}. Component được GẮN key (vì thế JSX chấp nhận nó), nhưng không ĐỌC được; không có gì ném lỗi. Con cần id thì truyền thêm một prop riêng.',
          },
          {
            question: 'In a Vitest project (default config, globals: false), App.test.tsx has two tests that each render <App />. The second one expects 6 cards but gets 12. What is the most likely cause?|||Trong một dự án Vitest (cấu hình mặc định, globals: false), App.test.tsx có hai test, mỗi test vẽ <App />. Test thứ hai chờ 6 thẻ nhưng nhận 12. Nguyên nhân khả dĩ nhất?',
            options: [
              'The DOM from the first test was never cleaned up: Testing Library only auto-registers cleanup when afterEach is global|||DOM của test thứ nhất không được dọn: Testing Library chỉ tự đăng ký cleanup khi afterEach là biến toàn cục',
              'StrictMode renders every component twice, so there are always 12 cards in tests|||StrictMode vẽ mỗi component hai lần, nên trong test luôn có 12 thẻ',
              'Vitest runs the two tests of a file in parallel in the same DOM|||Vitest chạy song song hai test của một file trong cùng một DOM',
              'The data file was imported twice, so the array has 12 doctors|||File dữ liệu bị import hai lần nên mảng có 12 bác sĩ',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: This exact failure happened in the chapter: "expected … to have a length of 6 but got 12". Testing Library’s cleanup is registered only if typeof afterEach === "function" globally; Vitest provides globals only with test.globals: true. Fix: afterEach(cleanup) in src/test/setup.ts. Strict Mode calls functions twice but commits once — the DOM has 6 cards. Tests in one file run sequentially by default, and a module is evaluated once no matter how often it is imported.|||VI: Đúng lỗi này đã xảy ra trong chương: "expected … to have a length of 6 but got 12". cleanup của Testing Library chỉ được đăng ký nếu typeof afterEach === "function" ở phạm vi toàn cục; Vitest chỉ tạo biến toàn cục khi test.globals: true. Sửa: afterEach(cleanup) trong src/test/setup.ts. Strict Mode gọi hàm hai lần nhưng chỉ commit một lần — DOM có 6 thẻ. Các test trong một file mặc định chạy tuần tự, và một module chỉ được thực thi một lần dù import bao nhiêu lần.',
          },
        ],
      },
    },
  ],
};
