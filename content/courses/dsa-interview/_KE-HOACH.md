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
| 0 | ✅ XONG 438303a7d | 2 bài Bắt đầu + 0.1 Big-O + 0.2 khung + 0.3 quiz (153k ký tự) |
| 1 | 1.1 xong (5dc576dc0); 1.2–1.6 agent đang soạn | |
| 2–5 | agent đang soạn (đợt 1) | |
| 6–11 | chờ đợt 2 | |

## Việc tiếp theo (chưa làm)
- Code Lab: máy chấm `js` (Worker) hợp với đề DSA, nhưng track mới phải đăng ký 1 dòng ở `src/services/codeLab.practice.ts`
  (`PRACTICE_TRACK_BY_COURSE` + `PRACTICE_CATALOG`) — NGOÀI phạm vi tệp của phiên soạn nội dung ⇒ người điều phối làm khi duyệt.
- Slide + video bài giảng (khuôn `_slides.mjs`/`giang/` như object-storage) — cần render + đẩy R2.
- Video YouTube ngoài cho từng bài (`content/course-videos/dsa-interview.mjs`, quy trình reference_tim_video_youtube_cho_bai_hoc).
