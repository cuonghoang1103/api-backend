# Kế hoạch soạn khoá `ide-va-do-nghe-dev` — IDE và đồ nghề dev

Khung dựng 20/11/2026: `content/courses/ide-va-do-nghe-dev.mjs` (prefix bài `ide-`, 8 phần = Mục 0 + 7 chương, 43 bài).
Ảnh bìa: `scripts/covers/ide-va-do-nghe-dev.png` (logo tự vẽ `scripts/icons/terminal-window.svg`) — **chưa đẩy R2**.
Category `backend`, level `BEGINNER`. Nguồn yêu cầu: bảng soát khoảng trống P0-5 (+ mục 3.5: regex thành chương riêng).

**Người học:** SV SE năm 3 "chưa tự gõ code" — thạo IDE là điều kiện để làm được `debug-co-phuong-phap` và `doc-code-cu-va-refactor`.
**Ranh giới:** KHÔNG dạy debugger (thuộc khoá debug ch3–5). Mỗi chương có lab "làm bằng phím" có bấm giờ (đo đầu khoá ở Mục 0, đo lại ở ch7).
**Quy trình soạn:** theo `content/courses/docker/_HOP-DONG.md`; phím tắt luôn ghi cả Windows/Linux và macOS (Ctrl/⌘). Khi soạn: thay phần tử
`sections` bằng `ide-va-do-nghe-dev/sNN-*.mjs`, **GIỮ NGUYÊN slug bài và title chương**.

## 1. Bảng phủ chủ đề bắt buộc → bài

| Chủ đề (yêu cầu) | Bài (slug) |
|---|---|
| VS Code: phím tắt, điều hướng, refactor, plugin, cấu hình chạy | `ide-1-1-dieu-huong`, `ide-1-2-chinh-sua`, `ide-1-3-cau-hinh`, `ide-1-4-extension` |
| IntelliJ IDEA: điều hướng, refactor tự động, plugin, cấu hình chạy | `ide-2-1-du-an` … `ide-2-5-cong-cu-kem` |
| Terminal hiệu quả | `ide-3-1-shell`, `ide-3-2-cong-cu-hien-dai`, `ide-3-3-tmux` |
| Regex thực dụng (tìm/thay toàn dự án) + ReDoS | `ide-4-1-cu-phap` … `ide-4-5-redos` |
| Git trong IDE | `ide-5-1-intellij-git`, `ide-5-2-xung-dot`, `ide-5-3-local-history` |
| Dotfiles / cài máy mới | `ide-6-1-dotfiles`, `ide-6-2-cai-tu-dong`, `ide-6-3-git-ssh` |
| Windows/PowerShell tiện dụng, WSL2 | `ide-6-4-windows` |
| Dự án cuối khoá + phỏng vấn | `ide-7-1-de-bai`, `ide-7-2-bang-tra`, `ide-7-3-phong-van` |
| Lab + quiz mỗi chương | `ide-N-*-lab`, `ide-N-*-quiz` (N = 1…6), tổng kết `ide-7-4-tong-ket` |

## 2. Tránh trùng — liên kết chéo

| Ở bài | Dẫn sang | Ranh giới |
|---|---|---|
| `ide-0-1-cai-dat` | `web-foundations` 1.2 | Cài VS Code nhập môn ở đó |
| `ide-4-1` | `web-foundations` 11.5, `log-tu-a-den-z` ch2, `nodejs` (ReDoS) | Regex "vừa đủ"/đọc log ở đó; ở đây đầy đủ + tìm/thay dự án |
| `ide-3-1` | `linux-bash` ch3 (grep) | Cú pháp shell đã dạy |
| `ide-5-1` | `git` ch14 | Git trong VS Code đã dạy; ở đây IntelliJ + Local History |
| `ide-6-3` | `git` 14.3 (includeIf), `agile-teamwork` ch10 | Lệnh đã dạy; an ninh tài khoản ở agile |
| `ide-2-4` | `debug-co-phuong-phap` ch4 | Debugger IntelliJ |
| `ide-6-4` | `docker` 13.x, Dev Containers | Container hoá môi trường |

## 3. Nguồn chính thống

VS Code Docs (Keyboard shortcuts PDF, settings, tasks, Workspace Trust, Dev Containers) • JetBrains IntelliJ IDEA Docs + Reference Card • JetBrains Free
Educational Licenses • README chính thức ripgrep, fd, fzf, bat, jq, tldr • MDN Regular expressions • java.util.regex.Pattern Javadoc • regular-expressions.info •
OWASP ReDoS • Cloudflare blog 12/07/2019, Stack Overflow status post-mortem 20/07/2016 • Microsoft Learn: PowerShell, PSReadLine, winget, Windows Terminal, WSL •
Homebrew Bundle, SDKMAN, nvm/fnm docs • gitleaks README.

## 4. Môi trường lab

Hai dự án mẫu dùng chung với các khoá khác: Spring Boot (Maven) + Express/React (LabFlow mini). Mac M1 (zsh, Homebrew) và Windows 11 (PowerShell 7,
winget, WSL2 Ubuntu). Lab ch6 chạy trên máy ảo/tài khoản người dùng mới để không phá máy thật. Dotfiles quét gitleaks trước khi push.

## 5. Mục lục khung (tự sinh từ tệp khoá)

| Chương | Slug bài | Tiêu đề (VI) |
|---|---|---|
| **Mục 0 — Đồ nghề quyết định tốc độ** | | |
| | `ide-0-8-bat-dau-tai-day` | Bắt đầu tại đây (1/2) — Vì sao thạo đồ nghề quan trọng hơn gõ nhanh |
| | `ide-0-9-bat-dau-khi-khong-co` | Bắt đầu tại đây (2/2) — Làm việc không có đồ nghề: tìm bằng mắt, đổi tên bằng tay |
| | `ide-0-1-cai-dat` | 0.1 — Cài VS Code và IntelliJ IDEA (giấy phép sinh viên miễn phí), trên Mac và Windows |
| **Chương 1 — VS Code chuyên sâu cho Node.js, TypeScript và React** | | |
| | `ide-1-1-dieu-huong` | 1.1 — Điều hướng: Quick Open, Command Palette, Go to Symbol/Definition/References |
| | `ide-1-2-chinh-sua` | 1.2 — Chỉnh sửa nhanh: đa con trỏ, di chuyển dòng, snippet, đổi tên và quick fix |
| | `ide-1-3-cau-hinh` | 1.3 — Settings, workspace settings và thư mục .vscode cho cả nhóm; tasks.json |
| | `ide-1-4-extension` | 1.4 — Extension đáng cài — và rủi ro bảo mật của extension |
| | `ide-1-5-lab` | 1.5 — Lab: Danh sách việc làm bằng bàn phím có bấm giờ trong ứng dụng Express + React mẫu |
| | `ide-1-6-quiz` | 1.6 — Kiểm tra Chương 1 |
| **Chương 2 — IntelliJ IDEA cho Java và Spring Boot** | | |
| | `ide-2-1-du-an` | 2.1 — Mở dự án cho đúng: import Maven/Gradle, Project SDK, language level, lập chỉ mục |
| | `ide-2-2-dieu-huong` | 2.2 — Điều hướng: Search Everywhere, Find Usages, Call và Type Hierarchy |
| | `ide-2-3-refactor-sinh-code` | 2.3 — Refactor tự động, sinh code và live template |
| | `ide-2-4-chay-test` | 2.4 — Run configuration cho Spring Boot và Tomcat, biến môi trường, test và độ phủ |
| | `ide-2-5-cong-cu-kem` | 2.5 — Công cụ đi kèm và plugin: HTTP Client, Database, Maven, SonarLint, Lombok |
| | `ide-2-6-lab` | 2.6 — Lab: Danh sách việc Spring Boot có bấm giờ: điều hướng, refactor, chạy test |
| | `ide-2-7-quiz` | 2.7 — Kiểm tra Chương 2 |
| **Chương 3 — Terminal làm việc thay bạn** | | |
| | `ide-3-1-shell` | 3.1 — Nền tảng shell: tìm lịch sử, alias, hàm, prompt, terminal tích hợp trong IDE |
| | `ide-3-2-cong-cu-hien-dai` | 3.2 — Công cụ dòng lệnh hiện đại: ripgrep, fd, fzf, bat, jq, tldr |
| | `ide-3-3-tmux` | 3.3 — Phiên và ô chia: tmux cơ bản hoặc chia ô Windows Terminal |
| | `ide-3-4-lab` | 3.4 — Lab: Mười việc hằng ngày, mỗi việc một dòng lệnh |
| | `ide-3-5-quiz` | 3.5 — Kiểm tra Chương 3 |
| **Chương 4 — Regex thực dụng: tìm và thay trên toàn dự án** | | |
| | `ide-4-1-cu-phap` | 4.1 — Cú pháp đầy đủ: lớp ký tự, lượng từ, tham lam/lười, nhóm, tham chiếu ngược, cờ |
| | `ide-4-2-lookaround` | 4.2 — Lookahead, lookbehind, và khi nào KHÔNG nên dùng regex |
| | `ide-4-3-trong-ngon-ngu` | 4.3 — Regex trong Java và JavaScript: Pattern/Matcher, thoát ký tự, replaceAll |
| | `ide-4-4-tim-thay` | 4.4 — Tìm/thay toàn dự án trong VS Code, IntelliJ và rg |
| | `ide-4-5-redos` | 4.5 — Góc hacker: ReDoS và quay lui thảm hoạ |
| | `ide-4-6-lab` | 4.6 — Lab: Mười lăm việc thay thế bằng regex thật |
| | `ide-4-7-quiz` | 4.7 — Kiểm tra Chương 4 |
| **Chương 5 — Git trong IDE** | | |
| | `ide-5-1-intellij-git` | 5.1 — Git trong IntelliJ: cửa sổ commit, commit từng đoạn, shelve, annotate, so nhánh |
| | `ide-5-2-xung-dot` | 5.2 — Giải xung đột bằng công cụ merge ba bên |
| | `ide-5-3-local-history` | 5.3 — Local History: cứu file mà Git chưa từng thấy |
| | `ide-5-4-lab` | 5.4 — Lab: Một nhánh tính năng từ đầu tới khi merge, hoàn toàn trong IDE |
| | `ide-5-5-quiz` | 5.5 — Kiểm tra Chương 5 |
| **Chương 6 — Cài máy mới trong một giờ: dotfiles, Windows và WSL2** | | |
| | `ide-6-1-dotfiles` | 6.1 — Dotfiles trong một repo Git: shell, cấu hình Git, cài đặt editor, symlink |
| | `ide-6-2-cai-tu-dong` | 6.2 — Cài tự động bằng script: Brewfile Homebrew, winget/scoop, SDKMAN, nvm/fnm |
| | `ide-6-3-git-ssh` | 6.3 — Thiết lập danh tính: cấu hình Git, SSH key có passphrase, ký commit, hai danh tính |
| | `ide-6-4-windows` | 6.4 — Windows cho lập trình viên: Terminal, PowerShell, winget, WSL2, Dev Containers |
| | `ide-6-5-lab` | 6.5 — Lab: Dựng lại máy dev từ repo dotfiles của bạn |
| | `ide-6-6-quiz` | 6.6 — Kiểm tra Chương 6 |
| **Chương 7 — Dự án cuối khoá: bộ đồ nghề của riêng bạn, có bằng chứng** | | |
| | `ide-7-1-de-bai` | 7.1 — Đề bài: repo dotfiles, cài đặt IDE, bảng tra nhanh và một lượt chạy đua có bấm giờ |
| | `ide-7-2-bang-tra` | 7.2 — Bảng tra một trang của bạn cho VS Code, IntelliJ, terminal và regex |
| | `ide-7-3-phong-van` | 7.3 — Câu hỏi phỏng vấn và tuần đầu đi làm về đồ nghề |
| | `ide-7-4-tong-ket` | 7.4 — Kiểm tra tổng kết |
