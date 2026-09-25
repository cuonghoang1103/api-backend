# Hợp đồng soạn chi tiết — khoá "React" (/courses/react)

> Đọc HẾT file này trước khi sửa một dòng nào. Quy trình CHÉP từ khoá GitHub Actions (xong 25/09/2026) —
> hợp đồng gốc `content/courses/github-actions/_HOP-DONG.md` là nền; file này là bản SỬA cho React.
> **Chuẩn chất lượng để bắt chước:** `content/courses/github-actions/s12-tai-su-dung.mjs` (một bài: slide ngay sau h3,
> 🧪/🗂/📌, "Chạy thử từng bước", callout phỏng vấn, pitfall co-tieu-de, quiz có giải thích) + deck
> `scripts/slides-src/ga-12.mjs`. Đọc CÓ CHỌN LỌC (grep/`node -e`), đừng nạp cả file 220k ký tự.

## 0. Việc này là SOẠN TỪ KHUNG

`content/courses/react.mjs` hiện là KHUNG: 44 bài "Đang soạn" sinh bằng `khung('rx', …)` (`content/courses/_chung/khung.mjs`),
đã seed lên production và CÔNG KHAI. Mỗi bài khung chỉ có tiêu đề + "Bài này sẽ dạy" (đề cương). Việc: thay từng chương
khung bằng một file chương thật `content/courses/react/sNN-<tên>.mjs` + deck `scripts/slides-src/rx-NN.mjs`.

⛔ **LUẬT CỨNG — vi phạm là hỏng dữ liệu người học trên production:**
1. **GIỮ mọi `slug` bài có trong khung** (tiến độ người học neo vào slug). **GIỮ `type: 'LESSON'`** của bài khung.
2. **KHÔNG đổi `title` của CHƯƠNG** — seeder (`scripts/course-seed.mjs`) neo chương bằng slug bài ĐẦU, không thấy thì
   bằng TIÊU ĐỀ; bài đầu là bài mới `rx-N-0-slides` ⇒ đổi tiêu đề là seeder tạo CHƯƠNG MỚI trùng lặp.
   Ngoại lệ duy nhất: **Chương 10** (mục 4c). `title` từng BÀI thì được đổi. Được THÊM bài.
3. Bài mới: `isFreePreview: true`, `title` `'N.M — English|||N.M — Tiếng Việt'` ≤ 180 ký tự, `description` 1 câu tiếng Việt.
4. Agent soạn chương chỉ sửa **2 file của chương mình** (+ ảnh chụp của deck mình trong `scripts/slides-src/rx-anh/rx-NN/`).
   KHÔNG sửa `_slides.mjs`, `_rx-chung.mjs`, `_ga-chung.mjs`, `_cr-chung.mjs`, `_git-chung.mjs`, `_render-slides.mjs`,
   manifest `react.mjs` (người điều phối làm), file chương khác, file của khoá khác, `content/course-videos/`.
   KHÔNG `git add/commit/push/checkout/stash` trong repo api-backend. Không seed, không upload R2, không deploy.
   KHÔNG tìm video YouTube (bị chặn — người dùng tự làm ở máy).

## 1. Người học

- **Sinh viên FPT đang học FER202** (React theo syllabus trường: Create React App, React-Bootstrap, PropTypes, Redux,
  class component ở vài slide cũ) và **đang chuẩn bị phỏng vấn việc làm**. Nền JavaScript **còn yếu**.
- Khoá dạy React **cách công ty làm năm 2026**: Vite + TypeScript, React 19, TanStack Query, React Hook Form + Zod,
  Zustand, React Router, Testing Library + Vitest.
- **Nền JS yếu** ⇒ gặp cú pháp JS lạ (destructuring, spread/rest, arrow function, optional chaining `?.`, `??`,
  template literal, `map/filter/reduce`, `import/export`, `async/await`, Promise, closure…) thì **giải thích NGAY TẠI CHỖ,
  ngắn gọn** (một callout nhỏ "JS nhắc nhanh: …" hoặc một câu trong ngoặc) — không bắt người học đi đọc chỗ khác.
- **Yếu tiếng Anh**: thuật ngữ có nghĩa Việt ngay lần đầu ("state (trạng thái)", "render (vẽ ra)"); mỗi bài có 🗂.
- Trỏ sang khoá khác trên site khi hợp: `/courses/typescript`, `/courses/nextjs`, `/courses/testing`,
  `/courses/github-actions` (CI + deploy), `/courses/tailwind-css`, `/courses/web-foundations`.

## 2. Mỗi chương sau khi soạn

| Bài | slug | type | Nội dung |
|---|---|---|---|
| N.0 | `rx-N-0-slides` | `DOCUMENT` | 2 khối `.ml-en`/`.ml-vi` (eyebrow + h2 + lead + 1–2 đoạn), rồi MỘT `${gallery('rx-NN', [[1,'Bìa'], …])}` SAU hai khối, NGOÀI khối ngôn ngữ, liệt kê ĐỦ mọi slide |
| N.1…N.4 | slug khung | `LESSON` (giữ) | bài dạy (mục 3) |
| (thêm) | `rx-N-M-<tên>` | `LESSON` | chỉ khi thật cần |
| cuối | `rx-N-5-kiem-tra` (hoặc số kế tiếp) | `QUIZ` | mục 4 |

- Đầu file: `import { gallery, slide } from './_slides.mjs';`. File chương `export default { title, description, lessons }`
  (`title` chương CHÉP NGUYÊN từ khung — xem bảng mục 11).
- Bài N.0 đứng ĐẦU chương (trừ Mục 0: sau hai bài "Bắt đầu tại đây"; và Chương 10: mục 4c).

## 3. Mỗi bài dạy (EN lẫn VI — hai khối song song, cùng nội dung)

1. **Độ sâu: ~40–55k ký tự mỗi bài** (cả hai khối), **dạy từ gốc**. Không độn chữ: dài vì có ví dụ chạy thật, bảng,
   "Chạy thử từng bước", "Khi nào dùng — khi nào KHÔNG".
2. **3–6 slide** `${slide('rx-NN', n, 'chú thích')}` NGAY SAU `<h3>…</h3>` của đoạn đang giảng đúng nội dung đó
   (cùng slide ở hai khối). Bộ kiểm đòi ≥ 3 slide mỗi khối.
3. **Callout FER202 (BẮT BUỘC mỗi bài, cả hai khối):**
   ```html
   <div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
   <p>…cách trong syllabus… → …cách công ty… · <em>Vì sao:</em> …</p></div>
   ```
   (EN: `🎓 At FER202 you do it this way — 💼 at work they do it that way.`) Chữ **FER202** phải có mặt ở cả hai khối.
   Cặp hay gặp: CRA → Vite · PropTypes → TypeScript · Redux (+ thunk) → Zustand cho state client / TanStack Query cho
   state server · class component + lifecycle → function component + hook · React-Bootstrap → Tailwind/CSS Modules ·
   `fetch` trong `componentDidMount` → TanStack Query · form tự viết → React Hook Form + Zod · Enzyme → Testing Library.
   Nói công bằng: cách FER202 **không sai**, nó cũ hoặc hợp bài tập; nói rõ khi nào gặp lại nó ở công ty (dự án cũ).
4. **"Câu hỏi phỏng vấn hay gặp"** — mỗi bài ít nhất 1 callout (câu hỏi + ý trả lời 3–5 dòng):
   `<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>…</div>` / EN `Common interview question.`
5. **`.pitfall co-tieu-de`** với bug thật (mở bằng `<strong>Bẫy — …</strong>` / `<strong>Trap — …</strong>`).
6. TRƯỚC `<a class="link-card"` đầu tiên của mỗi khối (không có thì cuối khối): `<h3>🧪 Practice (15–20 min)</h3>` /
   `<h3>🧪 Thực hành (15–20 phút)</h3>` (`.callout ok` + `<ol>` + `Done when/Đạt khi` KIỂM ĐƯỢC — test xanh, ảnh giống,
   lệnh ra đúng output), `<h3>🗂 Key terms</h3>`/`<h3>🗂 Thuật ngữ trong bài</h3>` (`.kv-grid` 5–8 mục),
   `<h3>📌 Summary</h3>`/`<h3>📌 Tóm tắt</h3>` (`<ul>` 5–6 ý). Nguồn: `link-card` tới react.dev / tài liệu chính thức.
7. **"🛠 Tự gõ tiếp dự án"** — xem mục 5. Ít nhất một chỗ mỗi chương (thường ở bài cuối trước quiz, hoặc rải mỗi bài
   một bước). Lời giải trong `<details><summary>Lời giải</summary>…</details>` (EN `Solution`) — đóng sẵn
   (trang học đã cho phép thẻ `details/summary` từ 25/09/2026; KHÔNG thêm thuộc tính `open`).

## 4. Quiz cuối chương

- `content` hai khối: eyebrow + h2 + lead + `<h3>Self-check before you start</h3>`/`<h3>Tự kiểm trước khi làm</h3>` (`<ul>`
  5–6 dòng "Tôi làm được…") + `${slide('rx-NN', <bảng tra nhanh>, 'Bảng tra nhanh Chương N')}`.
- `quiz: { timeLimitSeconds: 900, questions: [10 câu] }`, mỗi câu `{ question:'EN|||VI', options:['EN|||VI'×4], correctIndex,
  points:1, explanation:'EN: …|||VI: …' }`. Tình huống thật (đoạn code ngắn, "màn hình hiện gì?") > định nghĩa.
  Explanation: vì sao đúng + vì sao phương án hấp dẫn nhất SAI. **Rải đáp án ≥ 3 vị trí, không vị trí nào > 4 câu.**

## 4b. Mục 0 — hai bài "Bắt đầu tại đây" + JS cho React + quiz

Thứ tự: `rx-0-8-bat-dau-tai-day`, `rx-0-9-bat-dau-khi-khong-co`, `rx-0-0-slides`, `rx-0-1-cai-dat`, `rx-0-2-jsx`,
**`rx-0-3-js-cho-react` (MỚI — "JavaScript bạn cần cho React")**, `rx-0-4-kiem-tra` (QUIZ).
- Bài 1/2: React là gì, lịch sử **có mốc kiểm nguồn** (Jordan Walke / FaxJS, JSConf US 05/2013 mở mã, React Native 2015,
  Fiber = React 16 (09/2017), Hooks = React 16.8 (02/2019), CRA bị khai tử 02/2025, React 19 (12/2024), React Compiler 1.0
  (10/2025) — KIỂM trên react.dev/blog trước khi viết, ghi "(kiểm 09/2026)"), vì sao công ty vẫn tuyển, React vs Vue/Angular/
  Svelte (bảng), câu hỏi phỏng vấn, khoá đưa bạn tới đâu, **bản đồ FER202 → công ty**.
- Bài 2/2: frontend không cấu trúc (jQuery thao tác DOM lệch dữ liệu — minh hoạ CHẠY THẬT), tình huống đồ án FER202
  (ghi rõ là minh hoạ), cách học không kiệt sức, lộ trình tối thiểu/đầy đủ, giới thiệu dự án xuyên suốt.
- Bài mở đầu: khối VI 14–20k ký tự, `.pitfall`, 🧪 nhẹ chắc thành công, 🗂, 📌, callout FER202.

## 4c. Chương 10 — đổi vai thành "Dự án giữa khoá"; Ch11–14 thêm mới

- Chương 10 **được đổi title** thành `'Chapter 10 — Mid-course project: the booking UI|||Chương 10 — Dự án giữa khoá: giao diện đặt lịch'`
  — AN TOÀN chỉ vì **bài ĐẦU chương là bài cũ `rx-10-1-thiet-ke`** (seeder neo chương bằng slug bài đầu).
  ⇒ thứ tự: `rx-10-1-thiet-ke`, `rx-10-0-slides`, `rx-10-2-xay-dung`, `rx-10-3-chat-luong`, `rx-10-4-tong-ket`,
  `rx-10-5-kiem-tra` (QUIZ 10 câu). `rx-ghep-chuong` cho phép riêng ca "bài đầu là slug cũ".
- Bài thi cuối khoá 20 câu nằm ở **Ch14: `rx-14-5-thi-cuoi-khoa`** (đáp án 5/5/5/5, `timeLimitSeconds: 1800`, trải Mục 0 → Ch14).
- Ch11–14 là chương MỚI (không có trong khung): mỗi chương 4 bài + quiz, cùng chuẩn (bảng mục 11).

## 5. Dự án xuyên suốt — "Đặt lịch phòng khám An Tâm" (người học TỰ GÕ)

Mỗi chương kết thúc bằng mục **"🛠 Tự gõ tiếp dự án"** (EN "🛠 Keep building the project"): đề bài từng bước + **tiêu chí
đạt** (test Vitest phải xanh, hoặc ảnh chụp mong đợi) + lời giải trong `<details>`. **Code lời giải phải chạy thật**
(`npx tsc -b` sạch + `npx vitest run` xanh). Tới Ch10 người học đã tự dựng xong app; Ch11–14 nâng cấp nó.

**Dữ liệu và tên gọi CỐ ĐỊNH** (mọi chương dùng đúng những tên này để các chương soạn song song vẫn khớp):
```ts
// src/types.ts
export type ChuyenKhoa = 'noi' | 'nhi' | 'da-lieu' | 'rang-ham-mat';
export interface BacSi { id: string; ten: string; chuyenKhoa: ChuyenKhoa; namKinhNghiem: number; gioiThieu: string }
export interface KhungGio { id: string; bacSiId: string; batDau: string /* ISO */; conTrong: boolean }
export interface BenhNhan { hoTen: string; soDienThoai: string; ngaySinh: string /* YYYY-MM-DD */ }
export type TrangThaiLichHen = 'cho-xac-nhan' | 'da-xac-nhan' | 'da-huy';
export interface LichHen { id: string; bacSiId: string; khungGioId: string; benhNhan: BenhNhan; lyDo: string; trangThai: TrangThaiLichHen }
```
Dữ liệu mẫu `src/du-lieu/bac-si.ts`: 6 bác sĩ (`bs-1` BS. Nguyễn Minh An · noi · 12 năm; `bs-2` BS. Trần Thu Hà · nhi · 8;
`bs-3` BS. Lê Quốc Bảo · da-lieu · 5; `bs-4` BS. Phạm Ngọc Lan · rang-ham-mat · 15; `bs-5` BS. Hoàng Đức Huy · noi · 3;
`bs-6` BS. Vũ Thảo Vy · nhi · 20). API giả (từ Ch6, bằng MSW, `src/mocks/`): `GET /api/bac-si`, `GET /api/bac-si/:id`,
`GET /api/bac-si/:id/khung-gio?ngay=YYYY-MM-DD`, `POST /api/lich-hen`, `GET /api/lich-hen`, `PATCH /api/lich-hen/:id`,
(Ch14) `POST /api/dang-nhap`, `POST /api/lam-moi-token`.

| Hết chương | Người học đã có |
|---|---|
| Mục 0 | Dự án Vite + TS `phong-kham` (`npm create vite@latest`), dọn template, trang chủ tĩnh bằng JSX (tên phòng khám, giờ mở cửa); Vitest chạy được, 1 test thấy tiêu đề |
| Ch1 | `Header`, `Footer`, `TheBacSi` (props có kiểu), `DanhSachBacSi` render từ `bac-si.ts` với `key` ổn định |
| Ch2 | Lọc theo chuyên khoa (chip), tìm theo tên, chọn bác sĩ → `ChiTietBacSi`, danh sách yêu thích (cập nhật mảng bất biến) |
| Ch3 | `FormDatLich` bằng React Hook Form + Zod (họ tên, SĐT Việt Nam, ngày sinh, lý do ≤ 500), lỗi đúng chỗ, chặn gửi hai lần |
| Ch4 | `useDebounce` cho ô tìm, `useLocalStorage` lưu bản nháp form, `document.title` theo bác sĩ, đồng hồ "đang mở cửa?" có cleanup |
| Ch5 | Luồng đặt lịch 4 bước bằng `useReducer`, store Zustand `useDatLichStore`, lọc/tìm lưu trên URL |
| Ch6 | MSW + TanStack Query: `useBacSi`, `useKhungGio`, `useDatLich` (mutation), trạng thái tải/lỗi/rỗng, skeleton |
| Ch7 | React Router: `/`, `/bac-si`, `/bac-si/:id`, `/dat-lich/:khungGioId`, `/lich-hen`, 404, layout lồng, chặn trang cần đăng nhập; thư mục theo tính năng `src/features/…` |
| Ch8 | Đo bằng Profiler (danh sách 200 bác sĩ giả), `memo` chỗ đo thấy cần, lazy route, bộ chọn giờ dùng được bằng bàn phím, kiểm axe |
| Ch9 | Bộ test đầy đủ: form, luồng đặt lịch, gọi API bằng MSW, `renderHook` |
| Ch10 | Ghép hoàn chỉnh + test đầu-cuối Playwright luồng chính + build; checklist dự án giữa khoá |
| Ch11 | `key` để reset form khi đổi bác sĩ, `useRef` đưa focus, hộp xác nhận huỷ lịch bằng portal, error boundary, `useLayoutEffect` cho tooltip |
| Ch12 | `use()` + Suspense cho chi tiết bác sĩ, `useTransition` khi lọc danh sách lớn, `useOptimistic` khi huỷ lịch, form góp ý bằng `useActionState`, bật thử React Compiler và đo |
| Ch13 | `Tabs` compound cho trang chi tiết, ô tìm headless, `Button` polymorphic `as`, virtualization danh sách khung giờ dài (đo thật), hiển thị giới thiệu bác sĩ an toàn (XSS), i18n Việt/Anh |
| Ch14 | Đăng nhập, token, route bảo vệ, 401 → làm mới token → gọi lại, lỗi mạng/timeout/thử lại, biến môi trường `VITE_…`, build + đo bundle, workflow CI GitHub Actions |

**Làm sao các chương song song khớp nhau:** agent chương N làm trong `SCRATCH/rx/du-an/chNN/` —
1. Nếu có ảnh chụp dự án của chương trước `SCRATCH/rx/du-an/sau-chMM/` (M < N lớn nhất) thì chép nó làm điểm đầu
   (`cp -r`, rồi `npm install` — ảnh chụp KHÔNG kèm node_modules; hoặc chép node_modules từ `SCRATCH/rx/mau/phong-kham`).
2. Không có thì chép dự án mẫu `SCRATCH/rx/mau/phong-kham` (Vite + đủ thư viện, đã chạy tsc/vitest/build xanh) và tự dựng
   nhanh phần của các chương trước theo bảng trên (đúng tên file/kiểu ở trên).
3. Xong chương: lưu ảnh chụp `SCRATCH/rx/du-an/sau-chNN/` (KHÔNG node_modules, KHÔNG dist) cho chương sau.
Trong bài, "🛠" mở đầu bằng "Điểm xuất phát: dự án sau Chương N−1 (các file …)". Không commit dự án demo vào repo.

## 6. Slide — `scripts/slides-src/rx-NN.mjs` (NN đệm: rx-00 … rx-14)

```js
import { S, cover, cards, box, steps, table, vs, kpis, flow, two, list, code, mindmap, term, diagram, yaml, sv, R, T, A, seg, bars,
  compTree, renderFlow, anh } from './_rx-chung.mjs';
export const deck = { key: 'rx-NN', code: 'REACT · CHƯƠNG N', title: '<tên ngắn>', sub: 'React · Chương N' };
export const slides = S([ cover({ t, sub, chap: 'CHƯƠNG N' }), { t: 'Bản đồ chương', body: mindmap(…) }, … ]);
```
- **24–32 slide**: bìa → bản đồ chương → mỗi bài 4–6 slide → "Sai lầm hay gặp" → "Bảng tra nhanh" → "Tự gõ tiếp dự án".
- Mỗi slide MỘT ý, tiêu đề là câu khẳng định, MỘT dòng. Ưu tiên HÌNH:
  - `compTree({ root, legend })` — CÂY COMPONENT: ai giữ state (●), ai render lại (↻), ai được memo bỏ qua (⊘).
  - `renderFlow({ hl })` — vòng Trigger → Render → Commit → Paint (tô pha đang giảng).
  - `anh(deck, 'ten.jpg', { w, h, url, cap })` — **ảnh chụp giao diện THẬT** (mục 7).
  - `term([...])` — output thật của `npm create vite`, `tsc`, `vitest`, `vite build`. `code(...)`/`yaml(...)` — đoạn TSX ngắn
    có ghi chú bên lề (yaml() tô được TSX đơn giản). `diagram()`, `sv/R/T/A` — tự vẽ (luồng dữ liệu, cache, dòng thời gian).
- Màu: `'rx'` (xanh React #149eca) ở `diagram/term/mindmap/sv/compTree`; khối CR (`cards/bars/seg/kpis/flow/steps`) dùng `'blu'`.
  Trong `cards` chữ đậm dùng `<strong>`. Lệnh dài trong term tách dòng bằng `\`. ⚠️ Font mono vỡ dấu ỗ/ẫ.
- Kiểm tràn + render + ⛔ **MỞ TỪNG ẢNH bằng Read**, sửa tới khi sạch (bộ đo không thấy: chữ đè mũi tên, tràn chân trang,
  tiêu đề 2 dòng, terminal gãy dòng).

## 7. Độ chính xác — "chạy thật" = chạy trên CHÍNH MÁY ẢO này

1. **Mọi output/log MỚI phải CHẠY THẬT** trên máy ảo: `npm create vite@latest`, `npx tsc -b`, `npx vite build`,
   `npx vitest run`, và **ảnh chụp giao diện thật** bằng `node scripts/rx-chup.mjs <dự án> <ảnh.jpg> [--click …] [--type nhãn=giá trị] [--path …]`
   (Playwright; trên máy ảo cloud đặt `PLAYWRIGHT_BROWSERS_PATH=<scratch>/pwb`). Dán output THẬT (rút gọn được, ghi "…").
   KHÔNG bịa output, số đo, thông báo lỗi.
2. **Code ví dụ phải là code ĐÃ CHẠY**: mọi đoạn TSX dài hơn vài dòng trong bài nằm trong dự án thử của bạn, `tsc` sạch,
   test xanh. Lỗi cố ý (để dạy) thì dán thông báo lỗi THẬT của tsc/trình duyệt.
3. Phiên bản thật đang dùng (kiểm 25/09/2026): react 19.3.0 · vite 8.3.1 (create-vite 9.2.1) · typescript 6.0.3 ·
   vitest 5.0.1 · @tanstack/react-query 5.103.2 · react-hook-form 7.88 · zod 4.6.5 · zustand 5.0.15 · react-router 8.4.0 ·
   @testing-library/react 16.3 · msw 2.15. Tính năng/API: kiểm trên tài liệu chính thức/`node_modules/*/dist/*.d.ts`
   trước khi viết; ghi "(tính đến 09/2026)". Không bịa.
4. Việc không làm được trên máy ảo (deploy thật lên host, dịch vụ ngoài, trình duyệt thật của người dùng…) ⇒ KHÔNG bịa:
   ghi trong bài `⏳ Chưa chạy thật: <lý do>` + `<!-- CHAY-O-MAY: việc cần chạy -->`, rồi làm tiếp.
5. Khung cũ nói SAI (vd tên API cũ, "Enzyme", CRA…) thì sửa và ghi trong báo cáo.

## 7b. Bảo mật (XSS, token): viết ở góc PHÒNG THỦ

Giải thích cơ chế + minh hoạ vô hại (chuỗi `<img src=x onerror=…>` bị React thoát ra thành chữ; `dangerouslySetInnerHTML`
+ DOMPurify), rồi dạy cách vá và cách phát hiện. Không viết payload khai thác chi tiết.

## 8. Thoát ký tự (bộ kiểm chặn)

Không backtick trần → `&#96;`. **Không `${` trần trong content** (template literal của bài học) → `&#36;{`.
Gạch chéo ngược `\\`. Trong `<pre><code>`: `&lt; &gt; &amp;` (JSX `<App />` viết `&lt;App /&gt;`).
Mã: `<pre><code class="language-tsx">…</code></pre>` (hoặc `language-ts`, `language-bash`). Output: `<div class="out">…</div>`.
Không `<svg>`/iframe/script/style trong bài (hình thì đưa vào slide). Chuỗi JS nháy đơn (title/quiz): không `\\'` —
dùng `’` hoặc nháy kép. Thẻ được phép ở trang học: p br strong em u s code pre h1–h6 ul ol li blockquote a img table
thead tbody tr th td span div hr b i sup sub small **details summary** (DOMPurify gỡ mọi thẻ khác, giữ chữ).

## 9. Kiểm trước khi báo xong

```bash
node scripts/_render-slides.mjs  --deck scripts/slides-src/rx-NN.mjs --out ./render-rx      # rồi MỞ xem từng ảnh
node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/rx-NN.mjs                          # không tràn
node scripts/rx-ghep-chuong.mjs content/courses/react/sNN-*.mjs --render ./render-rx          # "✓ sạch"
node scripts/course-content-check.mjs ./content/courses/react/sNN-*.mjs                        # 0 lỗi
```
(`rx-ghep-chuong` so với khung ở `origin/main`: slug bài cũ còn đủ, type LESSON giữ nguyên, tiêu đề chương không đổi,
bài dạy có ≥ 3 slide/🧪/🗂/📌/FER202, chương có 🛠 và câu hỏi phỏng vấn, quiz đúng khuôn.)

## 10. Báo cáo (ngắn, tiếng Việt)

Số slide · độ dài từng bài · lệnh đã chạy thật (tsc/vitest/build — kết quả) · ảnh chụp đã dùng · chỗ khung cũ SAI đã sửa ·
phân bố đáp án · slide đã sửa sau khi nhìn · mọi chỗ ⏳ CHAY-O-MAY · điều chưa chắc · đường dẫn ảnh chụp dự án `sau-chNN`.

## 11. Bảng chương (file · title chương · bài)

| N | File | Title chương (CHÉP NGUYÊN) | Bài (slug) |
|---|---|---|---|
| 0 | `s00-intro.mjs` | `Section 0 — Why React\|\|\|Mục 0 — Vì sao React` | 8-bat-dau-tai-day, 9-bat-dau-khi-khong-co, 0-slides, 1-cai-dat, 2-jsx, **3-js-cho-react**, **4-kiem-tra** |
| 1 | `s01-component.mjs` | `Chapter 1 — Components and props\|\|\|Chương 1 — Component và props` | 1-component, 2-props, 3-danh-sach, 4-chia-nho, 5-kiem-tra |
| 2 | `s02-state.mjs` | `Chapter 2 — State and events\|\|\|Chương 2 — State và sự kiện` | 1-use-state, 2-su-kien, 3-object-array, 4-dat-state, 5-kiem-tra |
| 3 | `s03-form.mjs` | `Chapter 3 — Forms\|\|\|Chương 3 — Form` | 1-controlled, 2-react-hook-form, 3-loi, 4-tieng-viet, 5-kiem-tra |
| 4 | `s04-effect.mjs` | `Chapter 4 — Effects\|\|\|Chương 4 — Effect` | 1-use-effect, 2-khong-can, 3-vong-lap, 4-custom-hook, 5-kiem-tra |
| 5 | `s05-chia-se-state.mjs` | `Chapter 5 — Sharing state\|\|\|Chương 5 — Chia sẻ state` | 1-context, 2-reducer, 3-zustand, 4-url-state, 5-kiem-tra |
| 6 | `s06-du-lieu.mjs` | `Chapter 6 — Data fetching\|\|\|Chương 6 — Lấy dữ liệu` | 1-fetch, 2-tanstack, 3-mutation, 4-loi-api, 5-kiem-tra |
| 7 | `s07-routing.mjs` | `Chapter 7 — Routing and structure\|\|\|Chương 7 — Định tuyến và cấu trúc` | 1-router, 2-layout, 3-cau-truc, 4-sang-nextjs, 5-kiem-tra |
| 8 | `s08-hieu-nang.mjs` | `Chapter 8 — Performance and accessibility\|\|\|Chương 8 — Hiệu năng và khả năng tiếp cận` | 1-do, 2-memo, 3-lazy, 4-a11y, 5-kiem-tra |
| 9 | `s09-test.mjs` | `Chapter 9 — Testing React\|\|\|Chương 9 — Test React` | 1-testing-library, 2-async, 3-hook, 4-phong-van, 5-kiem-tra |
| 10 | `s10-du-an-giua-khoa.mjs` | **ĐỔI (mục 4c):** `Chapter 10 — Mid-course project: the booking UI\|\|\|Chương 10 — Dự án giữa khoá: giao diện đặt lịch` | **1-thiet-ke (ĐẦU)**, 0-slides, 2-xay-dung, 3-chat-luong, 4-tong-ket, 5-kiem-tra |
| 11 | `s11-ben-trong.mjs` | `Chapter 11 — React under the hood\|\|\|Chương 11 — React bên trong` | 0-slides, 1-virtual-dom (virtual DOM, reconciliation, fiber), 2-key-identity (key/identity, state giữ/reset), 3-strict-mode-ref (StrictMode render hai lần, useRef + DOM, useLayoutEffect), 4-portal-error-boundary, 5-kiem-tra |
| 12 | `s12-react-19.mjs` | `Chapter 12 — React 19 and concurrent rendering\|\|\|Chương 12 — React 19 & concurrent` | 0-slides, 1-suspense-use (Suspense cho dữ liệu, use()), 2-transition (useTransition, useDeferredValue), 3-actions (Actions, useActionState, useOptimistic, form action), 4-compiler-rsc (React Compiler bật thử + đo, Server Components mức khái niệm → Next.js), 5-kiem-tra |
| 13 | `s13-kien-truc.mjs` | `Chapter 13 — Design patterns and architecture\|\|\|Chương 13 — Mẫu thiết kế & kiến trúc` | 0-slides, 1-compound-headless (compound, headless, polymorphic as), 2-hook-styling (custom hook tốt, Tailwind vs CSS Modules), 3-danh-sach-dai (virtualization, đo thật), 4-bao-mat-i18n (XSS, dangerouslySetInnerHTML, i18n), 5-kiem-tra |
| 14 | `s14-production.mjs` | `Chapter 14 — Going to production\|\|\|Chương 14 — Lên production` | 0-slides, 1-xac-thuc (đăng nhập, token, route bảo vệ, 401 → làm mới), 2-api-that (lỗi mạng, timeout, thử lại, biến môi trường Vite), 3-build-deploy (build, đo bundle, deploy tĩnh + CI GitHub Actions), 4-phong-van (checklist middle + 15 câu kèm ý trả lời), **5-thi-cuoi-khoa** (20 câu, 5/5/5/5, 1800 giây) |

Slug đầy đủ = `rx-<N>-<M>-<tên>` (vd `rx-11-2-key-identity`). Bài khung giữ slug đúng như trong `react.mjs`.
