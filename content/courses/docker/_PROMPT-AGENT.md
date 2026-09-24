<!-- Mẫu nhiệm vụ giao agent từng chương khoá Docker (chép từ scratchpad 24/09/2026). Dùng lại cho khoá khác: đổi đường dẫn hợp đồng/deck/tiền tố. -->
Bạn nâng cấp **{CHUONG}** của khoá "Docker" trên cuongthai.com. Repo `/Users/admin/Downloads/api-backend`. Báo cáo bằng tiếng Việt.

**ĐỌC HẾT trước khi sửa gì:**
1. `content/courses/docker/_HOP-DONG.md` — hợp đồng (luật cứng, khung bài, chuẩn slide, an toàn docker mục 7b, Docker 29 mục 7c, thoát ký tự mục 8). Tuân theo tuyệt đối.
2. Bài MẪU đã làm xong: `content/courses/docker/s01-mo-hinh.mjs` (bài `dk-1-0-slides`, cách chèn slide sau h3, các mục 🧪/🗂/📌, phần đào sâu, quiz) + `scripts/slides-src/dk-01.mjs`. MỞ XEM bằng Read các ảnh `{RENDER}/dk-01/003.webp`, `011.webp`, `017.webp`, `018.webp`, `022.webp` — đó là chuẩn chất lượng slide.
3. File chương của bạn: `{FILE}`{BRIEF}
4. Thư viện slide: `scripts/slides-src/_dk-chung.mjs` (+ chú thích `diagram()` trong `_git-chung.mjs`), cách nhúng `content/courses/docker/_slides.mjs`.

**Người dùng nói (quan trọng nhất):** "nâng cấp toàn bộ slide từng bài chi tiết + bài giảng chi tiết để tôi dễ học nhé, slide chất lượng dễ nhìn dễ hiểu đầy đủ kiến thức nhé cả bài giảng nữa… Docker rất quan trọng để tôi làm việc và học tập." ⇒ Deck `{DECK}` 24–32 slide, mỗi bài 4–6 slide dạy từng ý bằng HÌNH + output thật; làm mục 3.4 ĐÀO SÂU nghiêm túc cho từng bài (đọc như người mới học, chỗ nào nhảy cóc thì thêm giải thích/bảng cờ/chuỗi "chạy thử từng bước" song ngữ); sửa output cũ SAI/BỊA khi phát hiện (Ch1 đã bắt được 10 chỗ).
{EXTRA}
**Môi trường:** thư mục scratch của bạn `{SCRATCH}` (kho thử, file tạm — KHÔNG trong repo). RENDER = `{RENDER}`. Tên mọi đối tượng docker `{PFX}-…`, `--label dkhoc={NN}`, cổng {PORTS}. Mac đang chạy container thật `cuong_pg_new`, `cuonghoang_redis`, `sonarqube-swt301` — KHÔNG đụng. Cấm prune không filter. `docker login` chỉ với registry cục bộ và luôn kèm `DOCKER_CONFIG=<scratch>/docker-cfg`; `docker push` chỉ tới `localhost:<cổng của bạn>/…`. Linux thật: `ssh linux-nha` (không sudo). Xong thì dọn sạch theo tên. Volume VÔ DANH (vd của ảnh postgres) chỉ được xoá theo ID mà bạn GHI LẠI ngay lúc tạo (`docker inspect -f '{{range .Mounts}}{{.Name}}{{end}}' <container>` trước khi `rm` container, hoặc dùng `--rm`/đặt tên volume) — KHÔNG đoán theo giờ tạo.

**Kiểm:** đủ mục 9 hợp đồng — `node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/{DECK}.mjs`, render vào RENDER, MỞ TỪNG ẢNH bằng Read và sửa tới khi sạch, `node scripts/dk-ghep-chuong.mjs {FILE} --render {RENDER}{MOI}` phải "✓ sạch", `node scripts/course-content-check.mjs ./content/courses/docker.mjs` không lỗi ở chương bạn (chương khác đang được agent khác sửa song song — lỗi ở file khác thì bỏ qua), `docker ps -a --filter name={PFX}-` rỗng.

Chỉ sửa `{FILE}` và `scripts/slides-src/{DECK}.mjs`. Không commit/upload/seed. Thấy thư viện thiếu gì thì ghi đề xuất vào báo cáo, đừng sửa file chung. Báo cáo theo mục 10 của hợp đồng.
