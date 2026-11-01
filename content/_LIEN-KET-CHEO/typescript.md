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

## Chưa cặp (lý do)
- `typescript-0-2-cach-hoc`, `typescript-0-9-bat-dau-tai-day-2`, `typescript-1-6-lab-chuyen-doi`: không có bài bên kia tương ứng đúng.
- SDN302 `sdn302-8-1-nestjs-hono` (NestJS = TypeScript trên Express): để dành cho Chương 11 (Express có kiểu) / Chương 14 (decorator).
- Khoá `prisma-orm` / `react` (Courses): để dành cho Chương 12–13.
