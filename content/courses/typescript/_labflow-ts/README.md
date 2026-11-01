# LabFlow TS — dự án xuyên khoá TypeScript (CuongThai.com, /courses/typescript)

Ảnh chụp ở **cuối Chương 3** (01/11/2026). Luật đặt phòng lab của LabFlow Lite (khoá Testing) đổi từ JavaScript (`js/`) sang
TypeScript (`src/rules/`); Chương 2 thêm lịch phòng `src/rules/schedule.ts` (strict null, tuple, as const); Chương 3 thêm bộ luật `src/rules/validate.ts` (kiểu hàm Rule, overload, rest, this). Quy trình soạn: `content/courses/typescript/_HOP-DONG.md`.

## Chạy
```bash
npm ci                     # Node 22.23.3 (>= 22.18 để chạy .ts trực tiếp), typescript 7.0.2, @types/node 22.20.5
npm run typecheck          # tsc --noEmit -p tsconfig.json   (chỉ src/, luôn xanh)
npm test                   # node --test (33 test, Node chạy .ts bằng type stripping)
npm run lab1               # máy chấm Lab 1 trên lab1/src (bản khởi đầu: 2.5/10)
node scripts/cham-lab-1.mjs --from src/rules   # bản tham khảo: 10/10
npm run lab2               # máy chấm Lab 2 trên lab2/src (bản khởi đầu: 1/10)
node scripts/cham-lab-2.mjs --from src/rules   # bản tham khảo: 10/10
npm run lab3               # máy chấm Lab 3 trên lab3/src (bản khởi đầu: 1/10)
node scripts/cham-lab-3.mjs --from src/rules   # bản tham khảo: 10/10
```

## Thư mục
| Thư mục | Nội dung |
|---|---|
| `js/` | Bản gốc JavaScript (chép nguyên từ `content/courses/testing/_labflow-lite/src/rules/`) |
| `src/rules/` | Bản TypeScript = lời giải Lab 1, kèm test node:test |
| `lab1/` | Lab 1: `src/` khởi đầu, `test/` 15 test hành vi, `kiem/phai-dung.ts` (gọi đúng phải biên dịch), `kiem/sai.ts` (8 lời gọi sai phải bị từ chối), `yeu/` và `vua/` = hai lần thử chạy thật |
| `lab2/` | Lab 2: `src/schedule.ts` khởi đầu (viết khi tắt strict), `tsconfig.loose.json`, `test/` 13 test, `kiem/phai-dung.ts`, `kiem/sai.ts` (8 cách dùng sai), `yeu/` (! và as, 4/10) và `vua/` (null thật, mảng thường, 7/10) |
| `lab3/` | Lab 3: `src/validate.ts` khởi đầu (kiểu `Function`, 2 bug logic) + bản sao time/booking/schedule, `test/` 10 test, `kiem/phai-dung.ts`, `kiem/sai.ts` (8 cách dùng sai), `yeu/` (any vào any ra, 6/10), `vua/` (Rule thật, không overload/this, 8/10) |
| `demo0/<deck>/` … `demo3/<deck>/` | Thí nghiệm của từng bài (Mục 0, Chương 1–3) — có tệp CỐ Ý lỗi, không nằm trong tsconfig gốc |
| `scripts/cham-lab-1.mjs` … `cham-lab-3.mjs` | Máy chấm Lab 1–3 |

Chỉ chạy lệnh của một bài: xem output gốc trong `content/courses/typescript/s0N/_ma-<deck>.mjs` (OUT[...] có dòng `$ lệnh`).
