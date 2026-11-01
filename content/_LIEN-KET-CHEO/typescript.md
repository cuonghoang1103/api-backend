# Liên kết chéo khoá TypeScript (Courses) ↔ các khoá/môn khác

Ghi 01/11/2026 cùng đợt mẫu Mục 0 + Chương 1 (`content/courses/typescript/_HOP-DONG.md` mục 8). Mỗi cặp có thẻ ở CẢ HAI phía, cuối
khối `ml-en` và `ml-vi` của đúng bài. Trước khi sửa tệp phía bên kia đã chạy `git status --short` + `git diff HEAD` — các tệp dưới đây
sạch lúc chèn.

| TypeScript (Courses) | Bên kia | Tệp phía bên kia | Giống | Khác / sâu thêm |
|---|---|---|---|---|
| `typescript-0-8-bat-dau-tai-day` | FER202 (Academy) `fer202-a3-1-typescript-nextjs` | `content/academy/FER202.mjs` (thẻ sau thẻ codelab của A3.1) | kiểu tĩnh bắt sai prop/đối số trước khi chạy | khoá TS đi từ số 0: tsc, Node 22 chạy .ts không kiểm, output thật; tới backend + frontend có kiểu |
| `typescript-0-1-gioi-thieu` | Testing `tst-0-3-gioi-thieu-du-an` | `content/courses/testing/s00/gioi-thieu.mjs` | LabFlow Lite, luật đặt phòng time.js/booking.js | đổi sang TS strict ở Ch1, lớn thành API Express/React/Zod/Prisma có kiểu |
| `typescript-0-3-cai-dat` | Node.js `nodejs-0-3-cai-dat` | `content/courses/nodejs/s00-intro.mjs` | cài Node 22 bằng nvm, npm init | ghim typescript 7.0.2 + @types/node, tsconfig của khoá, Node chạy .ts còn tsc kiểm |
| `typescript-0-4-mo-hinh` | Testing `tst-0-3-cai-dat` (mục "TypeScript with zero configuration") | `content/courses/testing/s00/cai-dat.mjs` | Vitest như Node 22: xoá kiểu rồi chạy | vì sao lúc đó không ai kiểm kiểu, enum không xoá được, cổng `tsc --noEmit` |
| `typescript-1-1-ba-con-bug` | Testing `tst-1-1-cau-truc` | `content/courses/testing/s01/cau-truc.mjs` | đúng checkSlot/needsApproval/createBooking | test bắt lúc chạy vs trình biên dịch từ chối trước khi chạy; bug nào chỉ test bắt được |
| `typescript-1-2-chung-minh-gi` | API Design `api-2-2-validation` | `content/courses/api-design/s02-loi-phan-hoi.mjs` | không tin body của request | Zod kiểm lúc chạy ở cửa vs vì sao chỉ có kiểu thì không đủ; guard tự tay trước Zod |
| `typescript-1-3-suy-luan-kieu` | Node.js `nodejs-1-1-bien-pham-vi` (mục "const does not mean immutable") | `content/courses/nodejs/s01-javascript.mjs` | let gán lại được, const thì không | const còn làm hẹp KIỂU; thuộc tính object vẫn bị nới kiểu dù const |
| `typescript-1-4-any-unknown` | FER202 (Academy) `fer202-5-4-slot13-proptypes-slides` | `content/academy/fer202/ch5.mjs` (một `bi(en, vi)` cuối mảng `content`, sau `books`) | khai báo kiểu cho từng giá trị, chặn dữ liệu sai sớm | PropTypes kiểm lúc chạy, chỉ cảnh báo ở dev; TS từ chối trước khi chạy; any tắt kiểm; JSDoc trên .js |
| `typescript-2-1-primitive` | PostgreSQL `postgresql-4-2-select-where` (cạm bẫy NULL) | `content/courses/postgresql/s04-chen-truy-van.mjs` (sau thẻ codelab "filter the note table…" / "lọc bảng note…") | NULL = không có giá trị, phải xử lý tường minh | cột nullable ⇒ `string \| null`; tsc từ chối mọi chỗ dùng chưa kiểm (0 lỗi tắt strict → 4 lỗi bật strict) |
| `typescript-2-2-mang-tuple` | React `rx-2-3-object-array` | `content/courses/react/s02-state.mjs` (sau `${LINK(…immer…)}` ở ml-en và ml-vi) | `sort()` đổi chính mảng nhận vào; `toSorted`/spread trả bản sao | `readonly T[]` ⇒ TS2339 cho sort/push, TS4104; readonly bị xoá lúc chạy, khác `Object.freeze` |
| `typescript-2-3-kieu-dac-biet` | API Design `api-4-1-thay-doi` | `content/courses/api-design/s04-phien-ban.mjs` (sau thẻ nguồn "Hyrum’s Law") | giá trị trạng thái mới làm gãy code xử lý "mọi" trường hợp | `never` bắt tsc chỉ ra từng switch (TS2322 gọi tên LAB_CLOSED); dữ liệu từ mạng vẫn cần default khoan dung |
| `typescript-2-4-literal-as-const` | Prisma ORM `pr-8-3-su-co-enum` | `content/courses/prisma-orm/s08-he-kieu.mjs` (sau thẻ codelab của 8.3) | danh sách giá trị chép tay sẽ lệch, chỉ danh sách suy ra mới an toàn | không cần Prisma: `as const` + `(typeof LABS)[number]` + guard kiểm query string |
| `typescript-3-1-tham-so` | API Design `api-3-1-offset` | `content/courses/api-design/s03-danh-sach.mjs` (sau thẻ "OPEN PRJ301 LESSON" / "MỞ BÀI PRJ301") | giá trị người gọi bỏ qua thì có mặc định; "vắng mặt" ≠ "có mặt nhưng rỗng" | tsc kiểm mặc định + danh sách tham số (TS2554, TS18048); null từ JSON bỏ qua mặc định trừ khi `\| null` + `??` |
| `typescript-3-2-callback` | Node.js `nodejs-1-2-ham-closure-this` | `content/courses/nodejs/s01-javascript.mjs` (sau thẻ "MDN — Closures" / "MDN — Closure") | factory trả hàm nhớ cấu hình (createCounter ↔ maxSeats) | kiểu trả về `Rule` ⇒ callback sai bị từ chối (TS2322); `.map(parseInt)` biên dịch được mà ra `[7, NaN, 0, 3]` |
| `typescript-3-3-overload-void` | Node.js `nodejs-1-4-bat-dong-bo` | `content/courses/nodejs/s01-javascript.mjs` (sau thẻ codelab "Practise async — Module 318" / "Luyện bất đồng bộ — Module 318") | promise bị reject không ai bắt làm tiến trình chết; `forEach(async)` không chờ | chỗ callback `=> void` nhận hàm async mà tsc 0 lỗi (đo exit 1) |
| `typescript-3-4-this` | React `rx-2-2-su-kien` | `content/courses/react/s02-state.mjs` (sau thẻ `fer202-6-1-events-forms`) | method đưa làm callback mất `this` | tham số `this` ⇒ TS2684; map/setTimeout vẫn lọt; thiết kế closure né `this` |

## Chưa cặp (lý do)
- `typescript-0-2-cach-hoc`, `typescript-0-9-bat-dau-tai-day-2`, `typescript-1-6-lab-chuyen-doi`, `typescript-2-6-lab-lich-phong`, `typescript-3-6-lab-luat-dat-phong`: không có bài bên kia tương ứng đúng.
- SDN302 `sdn302-8-1-nestjs-hono` (NestJS = TypeScript trên Express): để dành cho Chương 11 (Express có kiểu) / Chương 14 (decorator).
- Khoá `prisma-orm` / `react` (Courses): để dành cho Chương 12–13.
