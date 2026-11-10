# "Học mỗi ngày" — bài bot trên Bảng tin (10/11/2026)

## Vì sao
Đo prod 10/11/2026: 47 bài bot từ 19/10, **21 bài cùng là "Claude Code vs Antigravity"**, 11 bài mẹo Claude xoay
8 hạt giống, mọi bài cùng một khung chữ và một tấm bìa gradient tím "SO SÁNH CÔNG NGHỆ".
Gốc rễ: RSS gần như không bao giờ đủ tin ⇒ mọi bot "lùi cho có bài" sang so sánh; `antigravity-mini` thì lúc
nào cũng lùi về đúng một cặp `claude-code-vs-antigravity`.

## Đã đổi
- **Bot tin (`newsBotsFeed.ts`) chỉ đăng khi có tin thật.** Bỏ đường lùi sang bài so sánh và bỏ mẹo Claude 8 hạt
  giống khỏi cron (hàm cũ còn `buildLegacyPost` để gọi tay). CuongMini tối đa 1 bản tin/ngày.
- **Học mỗi ngày** (`src/services/techTrends/hocFeed/`), CuongMini đăng, kênh `newsCategory='hoc'`, KHÔNG gọi LLM:
  - `thuVien.ts` — 30 bài soạn tay, 11 nhóm chủ đề × 11 định dạng. Code đã chạy thật (Node / Python / PostgreSQL 15),
    `out` là output nguyên văn; mọi URL đã mở (200) và câu trích đã đối chiếu.
  - `lichHoc.ts` — xoay vòng: không lặp bài (đăng lại sau 120 ngày khi hết bài mới), nhóm "công cụ AI" ≤ 1 bài / 14,
    ưu tiên nhóm đang thiếu so với tỉ trọng, không trùng định dạng 2 bài gần nhất, không trùng mẫu ảnh bài ngay trước.
  - `mauAnh.ts` + `veAnh.ts` — 11 mẫu ảnh khác hẳn nhau (code + output thật, terminal lỗi, trước/sau, quiz vàng,
    ELI5 pastel, sơ đồ giấy kẻ ô, con số khổng lồ, trích dẫn giấy kem, bìa sách, carousel 4:5 nhiều slide, ảnh thật
    Wikimedia Commons + dải giấy phép). SVG → sharp; không emoji trong SVG (Debian không có phông emoji).
  - `dungBai.ts` — thân bài theo bộ vẽ feed, thêm 3 khối rào mới: ```` ```output ```` (khung "Output thật"),
    ```` ```dapan ```` (đáp án ẩn — bài đố vui gộp output vào đây để không lộ đáp án), ```` ```nguon ```` (thẻ liên kết).
- **Frontend**: `CodeBlock.tsx` vẽ 3 khối trên; chip "Học mỗi ngày" đứng đầu hàng lọc; trang admin `/admin/feed-hoc`.
- Dev: CSP `img-src` cho `http://localhost:3001` CHỈ khi không phải production (ảnh STORAGE_SANDBOX).

## Bật / chạy
| Việc | Cách |
|---|---|
| Tự đăng | `FEED_HOC_AUTOPOST=true` (MẶC ĐỊNH TẮT) + `FEED_HOC_MOI_NGAY=1..5` (mặc định 3: 07:00 · 15:00 · 22:00 VN) |
| Đăng tay / xem bài kế tiếp | `/admin/feed-hoc` hoặc `POST /api/v1/admin/feed-hoc/dang` |
| Ẩn bài bot mẫu cũ | `/admin/feed-hoc` → "Ẩn … bài mẫu cũ" (PUBLIC → PRIVATE, có nút Hiện lại; KHÔNG xoá) |
| Local | `STORAGE_SANDBOX=1 npx tsx scripts/feed-hoc-dang.ts --xem | --dang N | --id <id> | --thong-ke | --an-mau-cu [--xac-nhan]` |

## Thêm bài vào thư viện
Chép một mục trong `thuVien.ts`, giữ luật ở đầu file, rồi:
```bash
npx tsx scripts/feed-hoc-kiem.ts --url --anh /tmp/xem-anh   # chạy lại code, gõ lại URL, xuất ảnh để soát mắt
npx tsx --test src/services/techTrends/hocFeed/lichHoc.test.ts
```
Tiêu đề (emoji + chữ) ≤ 80 ký tự và KHÔNG trùng bài khác — dòng đầu là "chữ ký" để nhận ra bài đã đăng.

## Chi phí
Bài học: 0 lời gọi LLM (chỉ vẽ PNG + R2, ~40–60 KB/ảnh). Bot tin: chỉ gọi `news_bulletin` khi có tin thật
(trước đây ~7 lượt/ngày dù không có tin, nay ≤ số bản tin thật — thường 0).
Còn 30 bài ⇒ 10 ngày ở mức 3 bài/ngày; sau đó vòng lặp chờ 120 ngày mới đăng lại ⇒ cần thêm bài.
