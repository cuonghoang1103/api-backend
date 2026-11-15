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
| 1 | ✅ XONG 5dc576dc0 + 80e75afed | 1.1 hash map · 1.2 prefix sum · 1.3 sắp xếp · ★1.4 bit (dsa-1-5-bit) · 1.5 bộ luyện · ★1.6 quiz |
| 2 | ✅ XONG 9f49fa7e1 | hai con trỏ · cửa sổ trượt (rate limiter thật trong repo) · nhanh-chậm · bộ luyện · quiz |
| 3 | ✅ XONG a0ff5aaf0 | stack/monotonic · queue/deque · linked list + LRU · bộ luyện · quiz |
| 4 | ✅ XONG 967a1f967 | MỘT khuôn firstTrue · mảng xoay · nhị phân trên đáp án (git bisect thật) · bộ luyện · quiz |
| 5 | ✅ XONG 26c35baf1 | duyệt · đệ quy trên cây · BST · ★trie (dsa-5-5-trie) · bộ luyện · quiz |
| 6 | ✅ XONG 4a7e40faf | heap (MinHeap TS 25 dòng) · hai heap trung vị · khoảng + sweep line · bộ luyện · quiz |
| 7 | ✅ XONG ea6444979 | biểu diễn · BFS/DFS · topo (Kahn, criticalPath thật) · Dijkstra + union-find · ★bộ luyện 7.5 · ★quiz 7.6 |
| 8 | ✅ XONG 55d734f30 | khuôn quay lui · tổ hợp/khử trùng · cắt nhánh (N-Queens bitmask, Sudoku MRV) · bộ luyện · quiz |
| 9 | ✅ XONG 25e015a6e | nhập môn (fib đo thật) · DP 1D · DP 2D · nhận diện · ★greedy · ★bộ luyện · ★quiz |
| 10 | ✅ XONG 21cf0f0ac | nói (30 câu EN) · code sạch · tự test (đối chiếu ngẫu nhiên) · OA stdin đo thật · ★quiz |
| 11 | ✅ XONG 15dcf0bc6 + 38ef4664f | lộ trình 42/28 ngày từ 16/11 · 3 bộ phỏng vấn thử 45′ có kịch bản + rubric 4 trục · ★thử 3 · tổng kết · ★thi cuối khoá 24 câu |

## Tổng (15/11/2026)
66 bài (12 quiz), 4,9 triệu ký tự, 371 đề LeetCode đã xác minh qua GraphQL, 110 link ngoài GET 200, ~840 khối mã chạy thật (TS + Java, cặp cùng output).
Bộ kiểm sạch: `_chay --kiem`, `_kiem --mang`, course-content-check, course-lang-check (0 bài nặng), course-depth-audit (đạt mọi sàn).
Chưa push/deploy/seed. Deploy (deploy-nha.sh) tự seed khoá qua course-seed (syncOrder) và tự nạp mọi content/codelab/*-practice.

## Đề xuất gom về _chung.mjs (các agent ghi trong _tien-do/*.md)
`oDay` (Ch5, Ch8), `oCay` (Ch5), `oLuoi` (Ch7), `bangDP` (Ch9), `bangDo/so/lan` đọc số từ .out (Ch1, Ch7), `bangChamDiem/bienBan` (Ch11),
`moPhong` song ngữ nhúng một lần (giảm ~10–20 % độ dài bài), `bangLuyen` (Ch2). Chỗ cần soát lại nếu đo lại `--do-thoi-gian`: xem từng `_tien-do/chNN.md`.

## Việc tiếp theo (chưa làm)
- Code Lab: máy chấm `js` (Worker) hợp với đề DSA, nhưng track mới phải đăng ký 1 dòng ở `src/services/codeLab.practice.ts`
  (`PRACTICE_TRACK_BY_COURSE` + `PRACTICE_CATALOG`) — NGOÀI phạm vi tệp của phiên soạn nội dung ⇒ người điều phối làm khi duyệt.
- Slide + video bài giảng (khuôn `_slides.mjs`/`giang/` như object-storage) — cần render + đẩy R2.
- Video YouTube ngoài cho từng bài (`content/course-videos/dsa-interview.mjs`, quy trình reference_tim_video_youtube_cho_bai_hoc).
