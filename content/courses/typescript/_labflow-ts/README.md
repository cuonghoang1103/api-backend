# LabFlow TS — dự án xuyên khoá TypeScript (CuongThai.com, /courses/typescript)

Ảnh chụp ở **cuối Chương 2** (01/11/2026). Luật đặt phòng lab của LabFlow Lite (khoá Testing) đổi từ JavaScript (`js/`) sang
TypeScript (`src/rules/`); Chương 2 thêm lịch phòng `src/rules/schedule.ts` (strict null, tuple, as const). Quy trình soạn: `content/courses/typescript/_HOP-DONG.md`.

## Chạy
```bash
npm ci                     # Node 22.23.3 (>= 22.18 để chạy .ts trực tiếp), typescript 7.0.2, @types/node 22.20.5
npm run typecheck          # tsc --noEmit -p tsconfig.json   (chỉ src/, luôn xanh)
npm test                   # node --test (23 test, Node chạy .ts bằng type stripping)
npm run lab1               # máy chấm Lab 1 trên lab1/src (bản khởi đầu: 2.5/10)
node scripts/cham-lab-1.mjs --from src/rules   # bản tham khảo: 10/10
npm run lab2               # máy chấm Lab 2 trên lab2/src (bản khởi đầu: 1/10)
node scripts/cham-lab-2.mjs --from src/rules   # bản tham khảo: 10/10
```

## Thư mục
| Thư mục | Nội dung |
|---|---|
| `js/` | Bản gốc JavaScript (chép nguyên từ `content/courses/testing/_labflow-lite/src/rules/`) |
| `src/rules/` | Bản TypeScript = lời giải Lab 1, kèm test node:test |
| `lab1/` | Lab 1: `src/` khởi đầu, `test/` 15 test hành vi, `kiem/phai-dung.ts` (gọi đúng phải biên dịch), `kiem/sai.ts` (8 lời gọi sai phải bị từ chối), `yeu/` và `vua/` = hai lần thử chạy thật |
| `lab2/` | Lab 2: `src/schedule.ts` khởi đầu (viết khi tắt strict), `tsconfig.loose.json`, `test/` 13 test, `kiem/phai-dung.ts`, `kiem/sai.ts` (8 cách dùng sai), `yeu/` (! và as, 4/10) và `vua/` (null thật, mảng thường, 7/10) |
| `demo0/<deck>/`, `demo1/<deck>/`, `demo2/<deck>/` | Thí nghiệm của từng bài (Mục 0, Chương 1, Chương 2) — có tệp CỐ Ý lỗi, không nằm trong tsconfig gốc |
| `scripts/cham-lab-1.mjs`, `scripts/cham-lab-2.mjs` | Máy chấm Lab 1, Lab 2 |

Chỉ chạy lệnh của một bài: xem output gốc trong `content/courses/typescript/s0N/_ma-<deck>.mjs` (OUT[...] có dòng `$ lệnh`).
