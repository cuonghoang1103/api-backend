# Đề cương 4 chương MỚI — khoá Linux & Bash (bổ sung 09/2026)

Đọc `_HOP-DONG.md` trước. Chương mới thì KHÔNG có bản cũ để so ⇒ chạy bộ kiểm với `--moi`.
Khoá cũ đi tới "vận hành + chẩn đoán máy chủ" (Ch11–12). Người dùng muốn **"đến chuyên gia, chuyên sâu, nâng cao…
mọi lệnh từ phổ thông tới nâng cao"** và hỏi khoá "dùng được cho macOS, Linux, Windows không" ⇒ thêm: Bash nâng cao
(ngôn ngữ), Linux chuyên sâu (nhân + hiệu năng + lưu trữ + bảo mật), Linux-kỹ-năng trên macOS & Windows, và một dự án
cuối khoá làm trọn.

Mỗi chương: N.0 slide (DOCUMENT) · 4 bài LESSON (khối VI mỗi bài 12–18k ký tự, EN tương đương, cùng khung bài cũ:
eyebrow/h2/lead/h3…, 4–6 slide nhúng, `.pitfall co-tieu-de` ≥ 1, bảng cờ khi dạy lệnh nhiều cờ, `🧪`/`🗂`/`📌`,
link-card nguồn chính thức — URL GET được 200) · N.5 quiz 10 câu. Viết theo giọng chương cũ (đọc
`s07-viet-script-production.mjs` và `s12-chan-doan-may-chu.mjs` để bắt giọng: nói thẳng, output thật, "vì sao" trước
"làm sao"). File chương: `export default { title, description, lessons }`, title dạng `'Chapter N — …|||Chương N — …'`.
Luôn `isFreePreview: true`. Hằng `REF` như chương cũ nếu dùng link-card Code Lab (chỉ trỏ `/code-lab/linux-bash`
hoặc trang tổng — KHÔNG bịa bài Code Lab cụ thể). Khoá liên quan trên site để trỏ sang thay vì dạy lại:
`/courses/docker`, `/courses/deploy-vps`, `/courses/nginx`, `/courses/git`, `/courses/github-actions`.
Mọi output chạy THẬT (Ubuntu 24.04 trong container `lxNN-…`; linux-nha Fedora cho phần cần máy thật; Mac cho macOS).

## Chương 13 — Bash nâng cao (`s13-bash-nang-cao.mjs`, deck `lx-13`)
Title: `Chapter 13 — Advanced Bash: data structures, streams & speed|||Chương 13 — Bash nâng cao: cấu trúc dữ liệu, luồng & tốc độ`
- 13.1 `lnx-13-1-mang-mang-ket-hop` — Mảng chỉ số và **mảng kết hợp** (`declare -a/-A`, `"${arr[@]}"` vs `${arr[*]}`,
  `${!arr[@]}`, `${#arr[@]}`, xoá phần tử, lặp an toàn với khoảng trắng), `mapfile -t`/`readarray`, `declare -n`
  (nameref), `local -r`, `declare -i`; bài toán thật: đếm IP trong access log bằng mảng kết hợp vs `sort|uniq -c`.
  Nói rõ bash 3.2 của macOS KHÔNG có `declare -A`/`mapfile` (chạy thật `/bin/bash` trên Mac để lấy lỗi).
- 13.2 `lnx-13-2-luong-nang-cao` — File descriptor nâng cao: `exec 3>file`, `{fd}>` tự cấp số, **process
  substitution** `<(…)` / `>(…)` (`diff <(sort a) <(sort b)`, `tee >(gzip > x.gz)`), here-string `<<<`, heredoc
  `<<-`/`<<'EOF'`, named pipe `mkfifo`, `coproc`, `read -r -d ''` với `find -print0`, `IFS` đúng cách; vì sao
  `cmd | while read` làm mất biến (subshell) và `shopt -s lastpipe`.
- 13.3 `lnx-13-3-song-song-toc-do` — Chạy song song và nhanh: `xargs -P -0 -n`, `wait -n`, giới hạn N job bằng
  semaphore tự viết, GNU `parallel` (nếu cài được trong container), `time`/`hyperfine` so đo, vì sao gọi `$(…)`/`sed`
  trong vòng lặp 10.000 lần chậm (fork) ⇒ dùng builtin/parameter expansion/`awk` một lần; `printf -v`, `$EPOCHREALTIME`.
- 13.4 `lnx-13-4-script-chuyen-nghiep` — Script mức chuyên gia: `getopts` + tham số dài tự viết, `trap` ERR với
  `$BASH_COMMAND`/`$LINENO`/`caller` in stack, `set -E`, log có mức (INFO/WARN/ERR) ra stderr, khoá chống chạy chồng
  (`flock`), file tạm an toàn `mktemp` + dọn, idempotent, dry-run `--dry-run`, test bằng `bats-core`, lint `shellcheck`
  + format `shfmt`; nối tiếp Ch7 chứ không lặp lại (đọc Ch7 trước). Khi nào nên CHUYỂN sang Python.
- 13.5 `lnx-13-5-quiz`.

## Chương 14 — Linux chuyên sâu (`s14-linux-chuyen-sau.mjs`, deck `lx-14`)
Title: `Chapter 14 — Linux in depth: kernel, performance, storage & security|||Chương 14 — Linux chuyên sâu: nhân, hiệu năng, lưu trữ & bảo mật`
- 14.1 `lnx-14-1-ben-trong-nhan` — Bên trong: syscall (đọc `strace -c` tổng kết), `/proc` và `/sys`, **namespaces**
  (`unshare`, `lsns`, `nsenter` — chính là thứ Docker dùng, trỏ `/courses/docker`), **cgroups v2** (`/sys/fs/cgroup`,
  `systemd-cgls`, `systemd-run --scope -p MemoryMax=`), capabilities (`getcap`, `capsh`), `ulimit`, OOM killer và
  `oom_score_adj`. Chạy trong container `--privileged` ngắn hạn hoặc đọc trên linux-nha.
- 14.2 `lnx-14-2-hieu-nang` — Hiệu năng theo phương pháp **USE** (Brendan Gregg — dẫn nguồn): CPU (`mpstat`,
  `pidstat`, `perf top/record` nếu có quyền, flame graph là gì), bộ nhớ (`vmstat`, page cache, `free` đọc đúng cột
  available), đĩa (`iostat -x`, `iotop`, `fio` đo nhẹ trong container), mạng (`sar -n DEV`, `ss -s`, `iperf3` giữa hai
  container); `sysstat`. Không chạy tải nặng quá 30 giây.
- 14.3 `lnx-14-3-luu-tru` — Đĩa và hệ thống file: `lsblk -f`, `blkid`, phân vùng GPT (`fdisk`/`parted` trên **file
  loop** `truncate -s 1G` + `losetup` trong container privileged — KHÔNG đụng đĩa thật), `mkfs.ext4`/`xfs`, `mount`
  + `/etc/fstab` + `UUID=`, **LVM** (pv/vg/lv, mở rộng không tắt máy), swap file, inode đầy dù còn dung lượng
  (`df -i`), `sha256sum`/`b3sum` kiểm file tải về, `rsync --checksum`.
- 14.4 `lnx-14-4-bao-mat-sau` — Bảo mật sâu: SSH cứng (khoá ed25519, `sshd -T` nghiệm thu, thứ tự drop-in — chuyện
  thật ở hợp đồng mục 1), `fail2ban`, tường lửa hiện đại `nftables` (`ufw`/`firewalld` là lớp bọc), SELinux (Fedora,
  `getenforce`, `ls -Z`, `audit2why` — đọc trên linux-nha) vs AppArmor (Ubuntu), `auditd`, cập nhật tự động
  (`unattended-upgrades`/`dnf-automatic`), `lynis` quét cứng hoá trong container, nguyên tắc quyền tối thiểu với sudoers.
- 14.5 `lnx-14-5-quiz`.

## Chương 15 — Kỹ năng Linux trên macOS & Windows (`s15-macos-windows.mjs`, deck `lx-15`)
Title: `Chapter 15 — Your Linux skills on macOS and Windows|||Chương 15 — Dùng kỹ năng Linux trên macOS và Windows`
- 15.1 `lnx-15-1-macos-zsh-bsd` — macOS là Unix (Darwin/XNU, chứng nhận UNIX 03) nhưng: **zsh mặc định từ Catalina
  2019** (vì sao: bash mới là GPLv3), `/bin/bash` 3.2 (2007); khác biệt zsh vs bash hay vấp (mảng đánh số từ 1,
  word splitting không tự tách, `setopt`, glob không khớp báo lỗi), `~/.zshrc`/`~/.zprofile`; **BSD vs GNU** (bảng:
  `sed -i ''`, `date -v`/`-d`, `stat -f`/`-c`, `grep -P`, `readlink -f`, `xargs -r`, `find -printf`, không có `timeout`)
  — mọi dòng CHẠY THẬT trên Mac; cách viết script chạy cả hai (`#!/usr/bin/env bash`, kiểm `uname`, `command -v gsed`).
- 15.2 `lnx-15-2-macos-cong-cu` — Homebrew (`brew install/upgrade/bundle` + Brewfile, bash 5 và coreutils `g*`,
  `/opt/homebrew` trên Apple Silicon), **launchd** thay systemd/cron (`~/Library/LaunchAgents/*.plist`, `launchctl
  bootstrap/bootout/print` — CHỈ in ví dụ + đọc `launchctl list` chứ không nạp agent thật trên máy người dùng),
  `pbcopy/pbpaste`, `open`, `mdfind`, `caffeinate`, `defaults`, Keychain (`security`) — thứ macOS có mà Linux không.
- 15.3 `lnx-15-3-windows-wsl2` — Windows: **WSL2** (VM Linux thật, `wsl --install`, `wsl -l -v`, distro, đặt mã TRONG
  `~` của Linux chứ không `/mnt/c` vì chậm, `\\wsl$`, `wslpath`, systemd trong WSL qua `/etc/wsl.conf`, mạng
  mirrored), Git Bash/MSYS2 khác WSL thế nào, **CRLF** (`$'\r': command not found`, `dos2unix`,
  `git config core.autocrlf`, `.gitattributes` `*.sh text eol=lf`) — kiểm mọi lệnh trên docs chính thức
  learn.microsoft.com (không có Windows để chạy ⇒ ghi rõ output lấy từ tài liệu chính thức).
- 15.4 `lnx-15-4-powershell-cho-nguoi-biet-bash` — PowerShell cho người biết bash: đối tượng thay vì văn bản trong
  ống dẫn, bảng tương đương (`ls`→`Get-ChildItem`, `grep`→`Select-String`, `ps`/`kill`, `curl`→`Invoke-RestMethod`,
  `$env:PATH`, `&&` từ PS 7), execution policy, chạy script `.ps1`; PowerShell 7 chạy được trên Mac/Linux (`pwsh`) —
  nếu cài được trong container `mcr.microsoft.com/powershell` thì chạy thật, không thì ghi rõ. Khi nào dùng cái nào.
- 15.5 `lnx-15-5-quiz`.

## Chương 16 — Dự án cuối khoá (`s16-du-an-cuoi-khoa.mjs`, deck `lx-16`)
Title: `Chapter 16 — Capstone: build, automate and run a real server|||Chương 16 — Dự án cuối khoá: dựng, tự động hoá và vận hành một máy chủ thật`
Bối cảnh xuyên suốt: nhóm đồ án cần một máy chủ Ubuntu chạy API "Đặt lịch phòng khám" (một app nhỏ bất kỳ: Python
`http.server` hoặc Node đơn giản). Dựng THẬT trong container Ubuntu 24.04 có systemd (hoặc linux-nha ở mức user) để
mọi output là output thật.
- 16.1 `lnx-16-1-dung-may` — Ngày 1: người dùng riêng cho app (không root), cây thư mục chuẩn (`/opt/app`, `/etc/app`,
  `/var/log/app`), quyền đúng, SSH chỉ khoá, tường lửa mở đúng cổng — script `bootstrap.sh` idempotent chạy lại không hỏng.
- 16.2 `lnx-16-2-deploy-script` — Script `deploy.sh` mức production: kiểm tham số, `set -Eeuo pipefail`, `trap` dọn dẹp,
  khoá `flock`, bản phát hành theo thư mục thời gian + symlink `current` (quay lui = đổi symlink), health check,
  log có mức; systemd unit cho app (`Restart=`, `User=`, giới hạn bộ nhớ, `EnvironmentFile=`).
- 16.3 `lnx-16-3-tu-dong-hoa-giam-sat` — Tự động hoá: systemd timer sao lưu + xoay vòng (giữ 7 bản), logrotate,
  giám sát đĩa/RAM/dịch vụ bằng script gửi cảnh báo (ghi file/webhook giả lập), `journalctl` lọc lỗi, báo cáo sáng.
- 16.4 `lnx-16-4-su-co-tuan-dau` — Tuần đầu trên production: 8 sự cố kinh điển (đĩa đầy, inode đầy, OOM, cổng bị
  chiếm, `Permission denied` vì quyền/SELinux, cron chạy lệch múi giờ, script CRLF, sửa config không có hiệu lực vì
  thứ tự nạp/inode) — mỗi cái: triệu chứng → lệnh chẩn đoán → cách cứu → cách phòng → chương liên quan.
- 16.5 `lnx-16-5-kiem-tra-cuoi-khoa` — **Bài thi cuối khoá: 20 câu** trải đều Mục 0 → Ch16 (tình huống, nhiều câu
  "lệnh này in ra gì"), mỗi câu có explanation, đáp án rải 5/5/5/5; content = lời dặn + checklist năng lực cả khoá.
  `timeLimitSeconds: 1800`.
