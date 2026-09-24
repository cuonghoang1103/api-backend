<!-- Mẫu nhiệm vụ giao agent từng chương (chép từ scratchpad 24/09/2026 để không mất khi hết phiên). Người điều phối thay các biến {…} rồi giao; tối đa 2 agent cùng lúc. RENDER/SCRATCH: đặt thư mục scratch của phiên mới. -->
Bạn nâng cấp **{CHUONG}** của khoá "GitHub Actions" trên cuongthai.com. Repo `/Users/admin/Downloads/api-backend`. Báo cáo bằng tiếng Việt.

**ĐỌC trước khi sửa gì (có chọn lọc, tiết kiệm token — người dùng dặn giữ token):**
1. `content/courses/github-actions/_HOP-DONG.md` — hợp đồng (luật cứng, khung bài, slide, sân tập ga-san-tap, thoát ký tự `&#36;{{`). Tuân theo tuyệt đối.
2. Chuẩn chất lượng: khoá Docker vừa làm xong — một bài mẫu trong `content/courses/docker/s01-mo-hinh.mjs` (tìm `<h3>🧪`, `dk-1-0-slides`, quiz cuối) và vài slide của `scripts/slides-src/dk-01.mjs`. Đừng đọc cả file lớn; dùng grep/`node -e` để lấy phần cần.
3. File chương của bạn: `{FILE}`{BRIEF}
4. Thư viện slide `scripts/slides-src/_ga-chung.mjs` (đọc chú thích đầu file + các hàm `pipe`, `yaml`, `term`, `sv/R/T/A`; `diagram()` xem chú thích trong `_git-chung.mjs`), cách nhúng `content/courses/github-actions/_slides.mjs`.
5. Workflow THẬT của repo người học trong `.github/workflows/` (chỉ đọc) — ví dụ quý.

**Người dùng nói:** công ty phỏng vấn bảo nếu nắm vững môn này "từ cơ bản đến chuyên gia" thì sẽ nhận; và trước đó: "slide chi tiết từng bài, bài giảng chi tiết để tôi dễ học". ⇒ Deck `{DECK}` 24–32 slide, mỗi bài 4–6 slide bằng HÌNH + log thật; ĐÀO SÂU từng bài (bài cũ chỉ ~15–20k — mục tiêu ~40–55k), thêm "Câu hỏi phỏng vấn hay gặp"; sửa chỗ cũ SAI khi phát hiện.
{EXTRA}
**Môi trường:** scratch của bạn `{SCRATCH}` (clone sân tập vào đây: `gh repo clone cuonghoang1103/ga-san-tap`). Nhánh của bạn trên sân tập: `{BRANCH}`; workflow đặt tên `{PFX}-*.yml`, chỉ trigger trên nhánh của bạn hoặc `workflow_dispatch`. RENDER = `{RENDER}`. Docker (nếu cần): tên `{PFX}-…`, cổng {PORTS}, không đụng container thật `cuong_pg_new`/`cuonghoang_redis`/`sonarqube-swt301`, cấm prune không filter.

**Kiểm:** `node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/{DECK}.mjs`; render vào RENDER; MỞ TỪNG ẢNH bằng Read và sửa tới khi sạch; `node scripts/ga-ghep-chuong.mjs {FILE} --render {RENDER}{MOI}` phải "✓ sạch"; `node scripts/course-content-check.mjs ./{FILE}` 0 lỗi. Workflow cron/lịch của bạn đã tắt khi xong.

Chỉ sửa `{FILE}` và `scripts/slides-src/{DECK}.mjs`. Không commit repo api-backend, không upload R2, không seed. Báo cáo theo mục 10 hợp đồng (ngắn gọn).
