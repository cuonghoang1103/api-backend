# Kế hoạch + tiến độ — khoá Coding Interview Prep (/courses/dsa-interview)

> Bàn giao cho phiên sau. Hợp đồng soạn: `_HOP-DONG.md`. Tiến độ chi tiết từng chương: `_tien-do/chNN.md`.

## Hạ tầng (15/11/2026)
- `_chung.mjs` — hàm dựng bài (mã đọc từ tệp, output thật, bảng vết, link LeetCode kiểm được, mô phỏng /algorithms, hộp CSD201, hội thoại phỏng vấn).
- `_chay.mjs` — chạy THẬT mọi tệp trong `ma/` (tsx + javac/java + worker /algorithms), ghi `.out`; `--kiem` so lại; cặp TS↔Java phải cùng output.
- `_kiem.mjs` — slug/tiêu đề chương gốc (`_slug-goc.json`), link nội bộ + CSD201, quiz; `--mang` hỏi LeetCode GraphQL + GET link ngoài.
- `dsa-interview.mjs` — manifest: `SOAN[i]` = tệp chương; phần tử chuỗi trong `lessons` = bài khung chưa soạn (hàm `ghep`).
- Không làm slide/video (cần render + đẩy R2 — ngoài phạm vi phiên này). "Thấy được" = bảng vết sinh từ thuật toán thật + mô phỏng trên trang /algorithms (`?code=<base64>`, không cần sửa frontend).

## Tiến độ
| Chương | Trạng thái | Ghi chú |
|---|---|---|
| 0 | chưa | người điều phối |
| 1 | 1.1 xong (bài mẫu) | |
| 2–11 | chưa | |
