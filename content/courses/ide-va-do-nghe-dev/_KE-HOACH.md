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
| Terminal hiệu quả (zsh/bash/PowerShell, terminal trong IDE, rg/fd/fzf/bat/jq/tldr, tmux + Windows Terminal, lịch sử chứa mật khẩu) | `ide-3-1-shell`, `ide-3-2-cong-cu-hien-dai`, `ide-3-3-tmux` (ĐÃ SOẠN 24/11) |
| Regex thực dụng (tìm/thay toàn dự án) + ReDoS | `ide-4-1-cu-phap` … `ide-4-5-redos` (ĐÃ SOẠN 24/11) |
| Git trong IDE + dòng lệnh (lệnh tương đương cạnh mỗi nút) | `ide-5-1-intellij-git`, `ide-5-2-xung-dot`, `ide-5-3-local-history`, `ide-5-4-lab` (ĐÃ SOẠN 24/11) |
| Dotfiles / cài máy mới | `ide-6-1-dotfiles`, `ide-6-2-cai-tu-dong`, `ide-6-3-git-ssh` |
| Windows/PowerShell tiện dụng, WSL2 | `ide-6-4-windows` |
| Dự án cuối khoá + phỏng vấn | `ide-7-1-de-bai`, `ide-7-2-bang-tra`, `ide-7-3-phong-van` (ĐÃ SOẠN 24/11) |
| Lab + quiz mỗi chương | `ide-N-*-lab`, `ide-N-*-quiz` (N = 1…6), tổng kết `ide-7-4-tong-ket` |
| Debugger IntelliJ "đủ dùng ngày đầu" (sâu ở debug ch4) | `ide-2-4-chay-test` |
| Postman/Bruno + HTTP Client IDE, DBeaver/pgAdmin + Database IDE | `ide-2-5-cong-cu-kem` |
| AI trợ lý trong IDE dùng có trách nhiệm (không dán bí mật công ty) | `ide-2-8-ai-tro-ly` (bài THÊM 24/11, đứng sau 2.5) |
| Docker Desktop | `ide-6-2-cai-tu-dong` (cài, giấy phép >250 người/>10 triệu USD, lựa chọn thay thế) + `ide-6-4-windows` (WSL2 backend) |
| Checklist máy dev ngày đầu OJT | `ide-6-5-lab` (docs/ojt-ngay-dau.md trong dotfiles, phần A–E) + `ide-7-3-phong-van` (tuần đầu từng ngày, câu hỏi mentor, 5 điều đừng làm) |

## 1b. Nhật ký soạn
- 24/11/2026 (agent ide, máy nhà): Chương 7 soạn xong (`s07-du-an-cuoi.mjs`, 4 bài theo khung, giữ slug + title chương) ⇒ khoá hết bài "Đang soạn". 7.1: tao-speedrun.sh + 20 việc (01–05 trùng phiếu Mục 0) + kiem71.sh chấm kết quả; lời giải terminal (cả jdb) 20/20, lượt làm ẩu 5/20 (đếm bằng chữ, thay cả test/, ba method available(), quên server, commit thẳng main). 7.2: bảng tra mẫu Markdown + kiem-bang-tra.sh (chạy thử từng dòng trên bản sao, quét bí mật) + in-mot-trang.mjs (Chrome headless, đếm trang = 1). 7.3: tám câu hỏi + trình diễn thật (TypeScript Language Service bỏ sót lời gọi động ⇒ rename làm test đỏ; ReDoS 8→515 ms), tuần đầu, Uber 2016 (FTC). 7.4: quiz 20 câu.
- 24/11/2026 (agent ide, máy nhà): Chương 6 soạn xong (`s06-may-moi.mjs`, 6 bài theo khung, giữ slug). Repo dotfiles mẫu `lab/ch6/dotfiles` (install.sh symlink + sao lưu + -n, bootstrap.sh apt/brew + Node ghim sha256, gitconfig không danh tính + include .gitconfig.local + includeIf ~/work/, ssh/config.example, congty.inc.example, windows/profile.ps1 + bootstrap.ps1 -WhatIf, packages/apt.txt/Brewfile/winget.json, docs/ojt-ngay-dau.md). "Máy mới" = ảnh ide-ch6-moi (Ubuntu 24.04 + sudo + curl). 6.3 dùng máy chủ giả lập github.test (OpenSSH 9.6, một user git, authorized_keys command= chọn tài khoản theo khoá). Lab 6.5: kiem65.sh 10 mục + loi-giai65.sh (54 giây, 10/10) + lần làm ẩu 6/10. Phát hiện thật đưa vào bài: sed -i thay symlink bằng tệp thường, gitleaks dir bỏ sót token đã xoá (git bắt), tên gói sai ⇒ apt exit 100, engines không strict chỉ cảnh báo + exit 0, đưa nhầm khoá ⇒ "Repository not found", 7 khoá ⇒ Too many authentication failures, gitdir: không khớp ở chính ~/work, allowed_signers thiếu ⇒ chữ ký không biết của ai, đổi khoá host ⇒ REMOTE HOST IDENTIFICATION HAS CHANGED, alias r = Invoke-History phá hàm cùng tên, Test-NetConnection không có trên PS 7 Linux.
- 24/11/2026 (agent ide, máy nhà): Chương 4 soạn xong (`s04-regex.mjs`, 7 bài theo khung). Dữ liệu: `tao-log.mjs` (log 300 dòng có bẫy user=500, /tasks/500, 1500ms, stack trace) và `tao-kho-cu.mjs` (LabFlow v1 CommonJS: 194 chỗ getUserById cạnh getUserByIdOrNull/getUserByIds, CHANGELOG, node_modules) — cả hai nhúng trong bài để tự dựng lại. Lab 4.6 có `kiem.mjs` chấm từng việc + so từng byte (ky-vong.json). Chạy thật: Node 22.21.1, rg 14.1.0, perl 5.38, Java 21.0.13.1, Java 1.8.0_504, jsoup 1.10.2, Hibernate Validator 9.1.5. Phát hiện thật đưa vào bài: (?i) Java chỉ ASCII (đức/ĐỨC), lookbehind \d+ Java 8 lỗi/Java 21 chạy, Java 21 không nổ với (a+)+ nhưng nổ với (a+)+\1 và mẫu cắt khoảng trắng Stack Overflow (7,5 s/40.000), /[^=]*=/ không neo mất 4 s trên 100.000 ký tự, cờ l của V8, PCRE2 match limit.
- 24/11/2026 (agent ide, máy nhà): Chương 5 soạn xong (`s05-git-ide.mjs`, 5 bài theo khung). Repo `gear` dựng bằng `tao-repo.sh` (in trong bài 5.1) từ lời giải mẫu lab 2.7: 5 commit của An/Bình/Chi, tên + giờ cố định ⇒ mã băm trùng bài; có commit định dạng lại (tab → dấu cách) để dạy blame -w / .git-blame-ignore-revs. 5.2 dựng bằng `tao-xung-dot.sh` (3 xung đột + xung đột ngữ nghĩa đổi tên loanLimit→maxLoans). Lab 5.4: `pre-receive` giả lập GitLab (main được bảo vệ, mẫu lời nhắn, chặn .env/workspace.xml), `dong-nghiep.sh`, `kiem54.sh` (10 mục, build mã đã push). IntelliJ không chạy được trên máy soạn ⇒ tên nút theo tài liệu JetBrains, bài dạy tự kiểm bằng tab Console. Chạy thật: git 2.55.0, git 2.43.0 (container), Spring Boot 4.2.0 + temurin 21. Phát hiện thật đưa vào bài: “lấy cả hai” làm rơi dấu } (Git đặt } ngoài vùng xung đột), rebase đảo ours/theirs, git commit được cả dấu xung đột (diff --check chỉ cảnh báo), merge bị chặn bởi dòng debug chưa commit (cần stash/Smart merge), core.fsmonitor trong repo nén chạy lệnh khi git status, safe.directory chỉ chặn repo của người khác, bí mật đã add rồi gỡ vẫn đọc được qua fsck, GEAR-46 ném IllegalArgumentException ⇒ GET /api/gears/0 trả 500.
- 24/11/2026 (agent ide, máy nhà): Chương 3 soạn xong (`s03-terminal.mjs`, 5 bài theo khung). Dữ liệu chương: `tao-ch3.sh` (front-end React 19 + Vite 7 thật, node_modules 118 MB, log 4 ngày tất định, 3 TODO/FIXME, .env giả). Output chạy thật trong container Ubuntu 24.04 (rg 14.1.0, fd 9.0.0, fzf 0.44.1, bat 0.24.0, jq 1.7, tmux 3.4, zsh 5.9, Node 22.21.1), PowerShell 7.4.2/PSReadLine 2.3.5, Temurin 21. Màn hình tương tác chụp bằng tmux capture-pane. Bẫy thật đưa vào bài: rg không đường dẫn đọc stdin (treo/exit 1), `$1h` trong -r, chỉ số ô tmux đổi theo vị trí, fzf Ctrl+T mặc định lẫn node_modules, tldr apt 0.9.2 không cập nhật được.
- 24/11/2026 (agent ide, máy nhà): Chương 2 soạn xong (`s02-intellij.mjs`, 8 bài). Dự án mẫu `gear-mini` + `tao-gear-ch2.sh` (bài 2.1). Mọi output chạy thật: Temurin 17/21, Gradle 9.9.2, IntelliJ HTTP Client CLI 2025.3, PostgreSQL 17.12, JaCoCo 0.8.14, gitleaks 8.30.1. Phím tắt đối chiếu IntelliJ Reference Card (Windows/Linux + macOS). `ghep()` ở tệp khoá được mở rộng cho bài thêm ngoài khung.

## 2. Tránh trùng — liên kết chéo

| Ở bài | Dẫn sang | Ranh giới |
|---|---|---|
| `ide-0-1-cai-dat` | `web-foundations` 1.2 | Cài VS Code nhập môn ở đó |
| `ide-4-1` | `web-foundations` 11.5, `log-tu-a-den-z` ch2, `nodejs` (ReDoS) | Regex "vừa đủ"/đọc log ở đó; ở đây đầy đủ + tìm/thay dự án |
| `ide-3-1` … `ide-3-3` | `linux-bash` 3.3 (grep), 8.2 (file khởi động), 8.4 (alias/HISTCONTROL), 5.4 + 9.3 (tmux sống sót SSH), 15.3–15.4 (CRLF, PowerShell); `log-tu-a-den-z` 2.4 (jq trên log) | Ở đây: quy trình dev + IDE + công cụ hiện đại, vẫn dạy đủ phần dùng; linux-bash chỉ để đọc thêm |
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
