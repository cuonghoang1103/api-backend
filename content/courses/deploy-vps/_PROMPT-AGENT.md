<!-- Mẫu nhiệm vụ giao agent từng chương khoá Deploy lên VPS (29/09/2026). Chép từ khoá Linux & Bash. -->
Bạn nâng cấp **{CHUONG}** của khoá "Deploy lên VPS" trên cuongthai.com. Repo `/Users/admin/Downloads/api-backend`. Báo cáo bằng tiếng Việt.

**ĐỌC HẾT trước khi sửa gì:**
1. `content/courses/deploy-vps/_HOP-DONG.md` — hợp đồng (luật cứng, khung bài, chuẩn slide, độ chính xác mục 7, AN TOÀN mục 7b — ⛔ KHÔNG đụng VPS thật, thoát ký tự + gitleaks mục 8). Tuân theo tuyệt đối.
2. Bài MẪU (khoá Linux & Bash, đã xong): `content/courses/linux-bash/s09-mang-may-tu-xa.mjs` + `scripts/slides-src/lx-09.mjs`, và `s12-chan-doan-may-chu.mjs` + `lx-12.mjs`. MỞ XEM bằng Read vài ảnh chuẩn: `{LXREF}/lx-09/004.webp`, `{LXREF}/lx-09/013.webp`, `{LXREF}/lx-12/003.webp`, `{LXREF}/lx-12/011.webp`.
3. Thư viện slide: `scripts/slides-src/_dv-chung.mjs` (theme Deploy + `yaml()`), dùng lại mọi hàm của `scripts/slides-src/_lx-chung.mjs` (đọc chú thích đầu file + `sh`, `term`, `pipe`), chú thích `diagram()` trong `_git-chung.mjs`, cách nhúng `content/courses/deploy-vps/_slides.mjs`.
4. File chương của bạn: `{FILE}`{BRIEF}

**Người dùng nói (quan trọng nhất):** "…đầy đủ từ giới thiệu, lịch sử, công dụng, tại sao phải dùng nó, lợi ích, những vấn đề sẽ gặp nếu không biết… đến chuyên gia, chuyên sâu, nâng cao đầy đủ chi tiết chất lượng… slide đầy đủ, chất lượng, sơ đồ, code phải có màu như VS Code." ⇒ Deck `{DECK}` {SLIDES} slide, mỗi bài 4–6 slide dạy từng ý bằng HÌNH + output thật, mọi script/cấu hình trên slide có màu (`sh()`/`yaml()`); làm mục 3.4 ĐÀO SÂU nghiêm túc cho từng bài; slide "Bảng tra nhanh"; sửa output cũ SAI khi phát hiện.
{EXTRA}
**Môi trường:** scratch của bạn `{SCRATCH}` (file tạm, khoá SSH thử — KHÔNG trong repo). RENDER = `{RENDER}`. VPS thí nghiệm theo hợp đồng mục 7b: container `{PFX}-vps` (Ubuntu 24.04 + openssh-server; ảnh tự build tên `{PFX}-img` nếu cần), `--label dvhoc={NN}`, mạng `{PFX}-net`, SSH vào qua `127.0.0.1:{SSHPORT}` bằng khoá trong scratch với `-o UserKnownHostsFile={SCRATCH}/known_hosts`; cổng được dùng {PORTS}. Máy Linux thật chỉ đọc: `ssh linux-nha` (Fedora 44, không sudo, thư mục `~/dvhoc-{NN}`). ⛔ Không đụng VPS production, `~/.ssh` của Mac, dotfile/crontab/launchd, container thật `cuong_pg_new`/`cuonghoang_redis`/`sonarqube-swt301`; cấm prune không filter; không `docker login` registry thật. Xong thì dọn sạch.

**Kiểm:** đủ mục 9 hợp đồng — `node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/{DECK}.mjs`, render vào RENDER, MỞ TỪNG ẢNH bằng Read và sửa tới khi sạch, `node scripts/dv-ghep-chuong.mjs {FILE} --render {RENDER}{MOI}` phải "✓ sạch", `node scripts/course-content-check.mjs ./content/courses/deploy-vps.mjs` không lỗi ở chương bạn (chương khác đang được agent khác sửa song song — lỗi ở file khác thì bỏ qua), `gitleaks dir {FILE} --config .gitleaks.toml --no-banner` sạch, `docker ps -a --filter name={PFX}-` rỗng.

Chỉ sửa `{FILE}` và `scripts/slides-src/{DECK}.mjs`. Không commit/upload/seed. Thấy thư viện thiếu gì thì ghi đề xuất vào báo cáo, đừng sửa file chung. Báo cáo theo mục 10 của hợp đồng.
