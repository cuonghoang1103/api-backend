# Đề cương 3 chương MỚI — khoá Git & GitHub (bổ sung 09/2026)

Đọc `_HOP-DONG.md` trước. Chương mới thì KHÔNG có bản cũ để so ⇒ chạy bộ kiểm với `--moi`.
Mỗi chương: N.0 slide (DOCUMENT) · 4 bài LESSON (khối VI mỗi bài 8–12k ký tự, EN tương đương, cùng khung
bài cũ: eyebrow/h2/lead/h3…, có 2–4 slide, `.pitfall co-tieu-de` ≥ 1, `🧪`/`🗂`/`📌`, link-card nguồn chính thức) ·
N.5 quiz 10 câu. Bài học mới viết theo phong cách các chương cũ (đọc `s06-pull-request.mjs` để bắt giọng).
File chương: `export default { title, description, lessons }`, title chương dạng `'Chapter N — …|||Chương N — …'`.
Luôn có `isFreePreview: true`.

## Chương 14 — Git hằng ngày trong công cụ (`s14-cong-cu-hang-ngay.mjs`, deck `git-14`)
Title: `Chapter 14 — Everyday Git in your tools: VS Code, GUIs & config|||Chương 14 — Git hằng ngày trong công cụ: VS Code, giao diện đồ hoạ & cấu hình`
- 14.1 `git-14-1-vs-code` — Git trong VS Code: Source Control view, stage từng dòng (tương đương add -p), xem diff,
  commit, đồng bộ; **merge editor 3 cột** giải xung đột; timeline; khi nào giao diện che mất điều quan trọng (nó chạy lệnh gì bên dưới).
- 14.2 `git-14-2-gitlens-desktop` — Nhìn lịch sử bằng đồ hoạ: extension Git Graph / GitLens (phần miễn phí), GitHub Desktop, lazygit
  (TUI). So sánh bảng: ai hợp việc gì. Nguyên tắc: GUI để NHÌN, terminal để HIỂU và cứu hộ.
- 14.3 `git-14-3-cau-hinh` — `.gitconfig` nâng cao: alias hữu ích (lg, st, undo…), `includeIf "gitdir:~/fpt/"` cho hai danh tính
  (email trường vs cá nhân), `pull.rebase`, `init.defaultBranch`, `rerere`, `push.autoSetupRemote`, `diff.algorithm histogram`,
  `help.autocorrect`; xem cấu hình đang hiệu lực + nguồn: `git config --list --show-origin`.
- 14.4 `git-14-4-windows-crlf` — Làm nhóm với bạn dùng Windows: CRLF/LF, `core.autocrlf`, `.gitattributes` (`* text=auto eol=lf`,
  `*.png binary`), renormalize (`git add --renormalize .`), file đổi hoa/thường (`git mv`), đường dẫn dài, quyền thực thi (`chmod +x` ⇄ `git update-index --chmod=+x`).
- 14.5 `git-14-5-quiz`.
Slide gợi ý: ảnh chụp giao diện KHÔNG có ⇒ vẽ wireframe bằng diagram()/HTML (panel Source Control, merge editor 3 cột), bảng so công cụ, sơ đồ includeIf.

## Chương 15 — GitHub cho sinh viên & hồ sơ nghề nghiệp (`s15-github-sinh-vien.mjs`, deck `git-15`)
Title: `Chapter 15 — GitHub for students: profile, portfolio & open source|||Chương 15 — GitHub cho sinh viên: hồ sơ, portfolio & mã nguồn mở`
- 15.1 `git-15-1-ho-so-github` — Profile README (repo trùng tên user), ghim 6 repo, README dự án chuẩn (ảnh chụp, demo link,
  cách chạy, công nghệ, việc mình làm trong nhóm), topics, license (MIT vs không license = không ai được dùng), nhà tuyển dụng nhìn gì trong 30 giây.
- 15.2 `git-15-2-github-pages` — GitHub Pages: site tĩnh từ nhánh/thư mục hoặc Actions; deploy một portfolio React/Vite
  (base path `/<repo>/`), domain riêng + HTTPS; giới hạn (tĩnh, dung lượng, băng thông — kiểm docs.github.com).
- 15.3 `git-15-3-student-pack-codespaces` — GitHub Student Developer Pack (xác minh bằng email/thẻ SV, quyền lợi chính — kiểm education.github.com),
  Codespaces (môi trường dev trên trình duyệt, devcontainer, hạn mức giờ miễn phí), Copilot cho sinh viên (tính đến 09/2026 — KIỂM, đừng nhớ).
- 15.4 `git-15-4-dong-gop-ma-nguon-mo` — Đóng góp mã nguồn mở lần đầu: tìm `good first issue`, đọc CONTRIBUTING/CODE_OF_CONDUCT,
  hỏi trước khi làm, fork → nhánh → PR nhỏ, ký DCO/CLA, phản hồi review, đồng bộ fork (`gh repo sync`/upstream). Nối lại Ch5.4 & Ch6.
- 15.5 `git-15-5-quiz`.

## Chương 16 — Dự án nhóm cuối khoá (`s16-du-an-nhom.mjs`, deck `git-16`)
Title: `Chapter 16 — Capstone: running a team project on GitHub|||Chương 16 — Dự án nhóm cuối khoá: vận hành một dự án nhóm trên GitHub`
Bối cảnh xuyên suốt: nhóm 4 SV làm đồ án (kiểu SWP391) "Đặt lịch phòng khám", 3 tuần, 1 trưởng nhóm.
- 16.1 `git-16-1-khoi-tao-repo-nhom` — Ngày 0: tạo repo tổ chức (Organization), README/CONTRIBUTING, `.gitignore`, `.gitattributes`,
  template issue/PR, nhãn, branch protection/ruleset cho main, CODEOWNERS, CI tối thiểu (lint + test), quy ước nhánh & commit.
- 16.2 `git-16-2-sprint-mo-phong` — Một sprint trọn vẹn, từng bước lệnh thật: 4 issue → 4 nhánh → PR → review → một xung đột
  thật giữa hai bạn sửa cùng file → giải → squash merge; Projects board chạy theo.
- 16.3 `git-16-3-phat-hanh-hotfix` — Chốt bản nộp: tag `v1.0.0`, release notes, CHANGELOG; lỗi phát hiện sau khi nộp →
  nhánh hotfix từ tag → `v1.0.1`; cherry-pick sửa lỗi về nhánh đang phát triển.
- 16.4 `git-16-4-su-co-nhom` — 8 sự cố kinh điển của nhóm SV và cách cứu (force-push đè commit bạn, commit .env/khoá API,
  merge main sai hướng, file 200MB, commit bằng tài khoản người khác/email sai, xoá nhầm nhánh, "tôi làm trên main suốt 2 tuần",
  xung đột package-lock.json) — mỗi cái: triệu chứng → lệnh chẩn đoán → cách cứu → cách phòng. Trỏ về chương liên quan.
- 16.5 `git-16-5-kiem-tra-cuoi-khoa` — **Bài thi cuối khoá: 20 câu** trải đều Ch1–16 (tình huống), mỗi câu có explanation;
  content = lời dặn + checklist năng lực cả khoá. (timeLimitSeconds 1800.)
Slide: timeline sprint (seg/flow), graph nhiều làn cho 4 thành viên, diagram luồng PR→CI→review→merge, bảng 8 sự cố.
