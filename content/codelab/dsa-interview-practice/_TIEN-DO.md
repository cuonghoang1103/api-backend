# Code Lab `dsa-interview-practice` — tiến độ (15/11/2026)

Bộ luyện chấm tự động cho khoá Courses `dsa-interview` (Coding Interview Prep). Track theo quy ước `<courseSlug>-practice`
(`src/services/codeLab.practice.ts`), module slug = slug bài học ⇒ thẻ "🏋️ Luyện tập" tự hiện dưới bài.

## Cấu trúc

- `nguon/_dsa.mjs` — bộ dựng chung: `bai()` (đề viết hàm, máy chấm `js`), `mod()`, `boc()` + `__cay/__raCay/__ds/__raDs`
  (cây / danh sách liên kết trong lời gọi kiểm), kiểm hiệu năng `perf` (đầu vào lớn sinh bằng Park–Miller hạt giống cố định),
  lời giải sai mẫu `saiMau`. `mongDoi` của mọi kiểm = chạy LỜI GIẢI trong `node:vm`.
- `nguon/_dung-track.mjs` — dựng `_track.json` theo thứ tự bài của khoá.
- `nguon/_kiem-sai-mau.mjs` — chấm các sai mẫu bằng máy chấm trình duyệt thật (Chromium, CSP web).
- `nguon/dsa-N-M-*.mjs` — một module / bài học; `dsa-interview-practice__<slug>.json` — SINH RA, đừng sửa tay.

## Kiểm hiệu năng — vì sao không có `choToiDa`

`choToiDa` chỉ là của loại `dom`. Máy chấm `js` chạy mỗi kiểm trong Worker mới, `performance.now()`/`Date.now()` trong đó là
đồng hồ GIẢ của harness; trần duy nhất là **4 s giờ thật mỗi kiểm** (`TRAN_THAT_MS`, `frontend/src/components/code-lab/cham/chamJs.ts`).
Nên kiểm hiệu năng chọn n sao cho lời giải đúng chạy vài chục ms còn vét cạn cần ≥ 10¹⁰ bước. Bộ dựng tự kiểm: lời giải xong
mỗi kiểm hiệu năng < 1 s trong Node (máy bận: `DSA_TRAN_GIAI_MS=3000`); sai mẫu `chiHieuNang` phải ĐẠT mọi kiểm thường và TRƯỢT mọi
kiểm hiệu năng (trần 3 s trong vm; trình duyệt báo "quá 4s").

## Lệnh

```bash
DSA_IN=1 node scripts/codelab-xuat-de.mjs --track dsa-interview-practice [--chi <module>]
node content/codelab/dsa-interview-practice/nguon/_dung-track.mjs
node scripts/codelab-kiem-noi-dung.mjs --track dsa-interview-practice
npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --track dsa-interview-practice [--app]
npx tsx content/codelab/dsa-interview-practice/nguon/_kiem-sai-mau.mjs [--chi <module>]
```

## Trạng thái — 15/11/2026: XONG đợt 1 (chưa nạp, chưa deploy)

21 module · 74 đề (EASY → HARD) · 604 kiểm (334 ẩn, 59 kiểm hiệu năng) · 137 sai mẫu (55 loại "đúng nhưng chậm").
Module = các bài dạy: 1.1 1.2 1.3 · 2.1 2.2 2.3 · 3.1 3.2 3.3 · 4.1 4.3 · 5.1 5.2 5.3 · 6.1 6.3 · 7.2 7.3 · 8.1 · 9.2 9.3.
Đề tự soạn, bối cảnh đời thật; không trùng các đề LeetCode đã nêu trong bài tương ứng. Không có kiểm hiệu năng ở đề vốn đã
O(n) và không có vét cạn chậm hơn đáng bắt (duyệt cây 5.1/5.2, vài đề danh sách liên kết).

Kết quả lượt kiểm cuối (máy đang rất bận, load 300–600 do phiên khác ⇒ xuất với `DSA_TRAN_GIAI_MS=4000`):
- `codelab-xuat-de.mjs`: 74/74 đề sạch · `codelab-kiem-noi-dung.mjs`: không lỗi.
- `codelab-kiem-cham-trinh-duyet.mjs`: lời giải 604/604 kiểm đạt, mọi code khởi đầu trượt — cả chế độ web lẫn `--app`.
- `_kiem-sai-mau.mjs`: 137/137 sai mẫu bị máy chấm trình duyệt bắt; 55 sai mẫu "chỉ chậm" đạt mọi kiểm thường và chỉ trượt
  kiểm hiệu năng ("quá 4s"; vài bản đệ quy trượt vì `RangeError` tràn stack ở n lớn — đúng bẫy ghi trong "Lỗi hay gặp").

## Việc còn lại

- **Danh mục Code Lab**: track chạy theo quy ước `<courseSlug>-practice` nên thẻ "🏋️ Luyện tập" dưới bài đã đủ; muốn track
  hiện trong danh mục Code Lab thì thêm một dòng `PRACTICE_CATALOG` (+ tuỳ chọn `PRACTICE_TRACK_BY_COURSE['dsa-interview']`)
  ở `src/services/codeLab.practice.ts` — CHƯA làm (ngoài phạm vi tệp của đợt này).
- Nạp (sau deploy, trong container backend): `codelab-create-track.mjs --file content/codelab/dsa-interview-practice/_track.json --apply`
  rồi `codelab-seed-authored.mjs --dir content/codelab/dsa-interview-practice --apply --update`.
- Chạy lại lượt kiểm cuối lúc máy rảnh (không đặt `DSA_TRAN_GIAI_MS`) để chắc lời giải đúng < 1 s trong Node.
- Tuỳ chọn: module "Lab" cuối mỗi nhóm chương (chưa làm); bài 1.4 bit, 4.2 xoay, 5.4 trie, 6.2 hai heap, 7.1, 7.4 Dijkstra/
  union-find, 8.2, 8.3, 9.1, 9.4, 9.5 tham lam chưa có module.
