<!-- Mẫu nhiệm vụ giao agent từng chương khoá "Operating Systems for Developers" (28/10/2026). -->
Bạn soạn **{CHUONG}** của khoá "Operating Systems for Developers" trên cuongthai.com. Repo `/Users/admin/Downloads/api-backend`. Báo cáo bằng tiếng Việt.

**ĐỌC HẾT trước khi sửa gì:**
1. `content/courses/operating-systems-for-developers/_HOP-DONG.md` — hợp đồng (luật cứng, khung bài, AN TOÀN mục 5, thoát ký tự mục 6, mô phỏng mục 7). Tuân theo tuyệt đối.
2. Bài MẪU đã xong: `content/courses/operating-systems-for-developers/s00-gioi-thieu.mjs` và `s01-tien-trinh.mjs` — bắt chước y hệt cấu trúc (eyebrow/h2/lead/h3, output chạy thật qua `run()`, `${lab()}` ≥1/bài, `.pitfall co-tieu-de`, 🧪/🗂/📌, link-card, quiz 10 câu có giải thích). Đọc helper `_ui.mjs` và `_lab.mjs` (chú thích đầu file).
3. Kịch bản output mẫu: `lab/code/s00/*`, `lab/code/ch01/*` + `lab/out/*.out.txt` — cách viết chương trình + `.sh` + chạy bằng `phien` ra output thật.
4. Slide: khuôn `scripts/slides-src/_pg-chung.mjs`, mẫu đầy đủ `scripts/slides-src/osg-cs1.mjs`…`osg-cs8.mjs` (deck ⭐ OSG202, cùng chủ đề); nhúng bằng `walk()` của `_slides.mjs`. File chương của bạn: `{FILE}`.

**Người học + trọng tâm (quan trọng nhất):** SV FPT học OSG202, muốn làm backend/bảo mật, nói "môn này khó vì tôi KHÔNG THẤY được thứ mình học". ⇒ MỖI khái niệm trừu tượng phải (a) THẤY được bằng mô phỏng `${lab()}` và (b) ĐO được bằng output chạy thật trong lab. Nối mọi thứ về code/máy chủ thật (Node event loop, luồng Java/Spring, pool, OOM exit 137, sự cố của chính cuongthai.com). Trỏ sang OSG202 khi hữu ích thay vì chép lại.

**Môi trường:** ảnh lab `os-lab` (xem `_HOP-DONG.md` mục 5). Chạy output trong container `os-…` `--label oslab=1`; lệnh phá huỷ CHỈ trong container vứt đi. Mac ngoài container chỉ đọc; KHÔNG đụng `cuong_pg_new`/`cuonghoang_redis`/`labflow*`; cấm prune không filter. Xong thì `docker ps -a --filter label=oslab=1` phải rỗng.

**Kiểm:** `node scripts/course-content-check.mjs ./content/courses/operating-systems-for-developers.mjs` (0 lỗi) · `node scripts/_kiem-tran-slide.mjs --deck …` mỗi deck · render + MỞ TỪNG ẢNH bằng Read, sửa tới khi sạch · đọc lại quiz/bài tập (con số khớp, đáp án đúng thật đúng).

Chỉ sửa `{FILE}` + `scripts/slides-src/os-NN-*.mjs` + `content/courses/operating-systems-for-developers/giang/os-NN-*.mjs` + `lab/code/{chNN}/**`. KHÔNG commit/upload/seed trừ khi điều phối bảo. Cần một mô phỏng chưa có trong registry ⇒ ghi vào báo cáo, đừng tự chế HTML/JS (bị lọc). Báo cáo theo mục 9 hợp đồng.
