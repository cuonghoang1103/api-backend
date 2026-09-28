<!-- Mẫu nhiệm vụ giao agent từng chương khoá Linux & Bash (28/09/2026). Chép từ khoá Docker. -->
Bạn nâng cấp **{CHUONG}** của khoá "Linux & Bash" trên cuongthai.com. Repo `/Users/admin/Downloads/api-backend`. Báo cáo bằng tiếng Việt.

**ĐỌC HẾT trước khi sửa gì:**
1. `content/courses/linux-bash/_HOP-DONG.md` — hợp đồng (luật cứng, khung bài, chuẩn slide, độ chính xác mục 7, AN TOÀN mục 7b, thoát ký tự mục 8). Tuân theo tuyệt đối.
2. Bài MẪU (khoá Docker, đã xong): `content/courses/docker/s01-mo-hinh.mjs` (bài `dk-1-0-slides`, cách chèn slide sau h3, các mục 🧪/🗂/📌, phần đào sâu, quiz) + `scripts/slides-src/dk-01.mjs`. MỞ XEM bằng Read các ảnh `{DKREF}/dk-01/003.webp`, `011.webp`, `017.webp`, `018.webp`, `022.webp` — đó là chuẩn chất lượng slide.
3. Thư viện slide của khoá này: `scripts/slides-src/_lx-chung.mjs` (ĐỌC chú thích đầu file + các hàm `sh`, `perms`, `pipe`, `term`), chú thích `diagram()` trong `_git-chung.mjs`, cách nhúng `content/courses/linux-bash/_slides.mjs`.
4. File chương của bạn: `{FILE}`{BRIEF}

**Người dùng nói (quan trọng nhất):** "…đầy đủ từ giới thiệu, lịch sử, công dụng, tại sao phải dùng nó, lợi ích, những vấn đề sẽ gặp nếu không biết… đến chuyên gia, chuyên sâu, nâng cao đầy đủ chi tiết chất lượng (đủ mọi kiến thức, mọi lệnh từ phổ thông hay dùng nhất đến nâng cao)… slide đầy đủ, chất lượng, sơ đồ, code phải có màu như VS Code." ⇒ Deck `{DECK}` {SLIDES} slide, mỗi bài 4–6 slide dạy từng ý bằng HÌNH + output thật, mọi script/lệnh nhiều cờ trên slide dùng `sh()` (tô màu VS Code); làm mục 3.4 ĐÀO SÂU nghiêm túc cho từng bài (bảng cờ, "chạy thử từng bước", "macOS/WSL khác gì" chạy thật trên Mac); slide "Bảng tra nhanh" đủ lệnh của chương; sửa output cũ SAI khi phát hiện.
{EXTRA}
**Môi trường:** thư mục scratch của bạn `{SCRATCH}` (file tạm — KHÔNG trong repo). RENDER = `{RENDER}`. Chạy lệnh Linux chuẩn trong container `docker run --rm --name {PFX}-u --label lxhoc={NN} --memory 512m ubuntu:24.04 …` (ảnh đã có sẵn); lệnh phá huỷ/đổi hệ thống CHỈ trong container của bạn. macOS: chạy trên Mac, chỉ lệnh đọc hoặc trong scratch. Linux thật: `ssh linux-nha` (Fedora 44, không sudo, thư mục riêng `~/lxhoc-{NN}`). Cổng {PORTS}. Mac có container thật `cuong_pg_new`, `cuonghoang_redis`, `sonarqube-swt301` — KHÔNG đụng; cấm prune không filter; không sửa dotfile/crontab/launchd của máy. Xong thì dọn sạch.

**Kiểm:** đủ mục 9 hợp đồng — `node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/{DECK}.mjs`, render vào RENDER, MỞ TỪNG ẢNH bằng Read và sửa tới khi sạch, `node scripts/lx-ghep-chuong.mjs {FILE} --render {RENDER}{MOI}` phải "✓ sạch", `node scripts/course-content-check.mjs ./content/courses/linux-bash.mjs` không lỗi ở chương bạn (chương khác đang được agent khác sửa song song — lỗi ở file khác thì bỏ qua), `docker ps -a --filter name={PFX}-` rỗng.

Chỉ sửa `{FILE}` và `scripts/slides-src/{DECK}.mjs`. Không commit/upload/seed. Thấy thư viện thiếu gì thì ghi đề xuất vào báo cáo, đừng sửa file chung. Báo cáo theo mục 10 của hợp đồng.
