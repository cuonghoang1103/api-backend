#!/usr/bin/env bash
# chay-s07.bash — trình tự đã dùng để sinh output thật của Chương 7 (24/11/2026). THỨ TỰ LÀ MỘT PHẦN CỦA BÀI: lịch sử khởi động của máy ảo.
# Lưu ý trung thực: các bước dưới đã được chạy TAY đúng thứ tự này; tệp này ghi lại trình tự, chưa chạy lại một lèo từ đầu.
# Cần: Docker, /dev/kvm, ảnh lgz-qemu:1 (cong-cu/Dockerfile), ảnh cloud noble minimal (SHA256 so với SHA256SUMS) ở ~/.rtq-lgz/vm/noble-min.img.
set -euo pipefail
S=$(cd "$(dirname "$0")" && pwd); CC=$S/cong-cu; VM="ssh -F $CC/ssh.cfg lab7"; R="python3 $CC/chay-vm.py"
cho_boot_moi() { local b=$1; until n=$($VM cat /proc/sys/kernel/random/boot_id 2>/dev/null) && [ -n "$n" ] && [ "$n" != "$b" ]; do sleep 3; done; until $VM test -f /var/tmp/san-sang 2>/dev/null; do sleep 2; done; }
bash $CC/may.bash len                                   # lần khởi động "-3": cài app + unit
scp -F $CC/ssh.cfg -q $S/vm/* lab7:/home/hv/ && $VM 'sudo bash cai.sh'
sleep 120; B=$($VM cat /proc/sys/kernel/random/boot_id)
bash $CC/may.bash bat; cho_boot_moi "$B"                # RÚT ĐIỆN (dừng container qemu) → lần "-2"
$R $S/volatile-a.bash; B=$($VM cat /proc/sys/kernel/random/boot_id); $VM 'sudo systemctl reboot' || true; cho_boot_moi "$B"   # → lần "-1"
$R $S/volatile-b.bash; sleep 90; B=$($VM cat /proc/sys/kernel/random/boot_id); $VM 'sudo systemctl reboot' || true; cho_boot_moi "$B"   # → lần 0
$R $S/mat-dien.bash; $R $S/luu.bash                       # luu.bash cần hv CHƯA ở nhóm systemd-journal (chạy lại: sudo gpasswd -d hv systemd-journal)
sleep 240; $R $S/loc.bash; $R $S/xuat.bash
$R $S/cauhinh.bash; $R $S/gioi-toc.bash; $R $S/niem-phong.bash   # cauhinh chạy lại: xoá trước .../fss và journald.conf.d/60-gioi-han.conf
$R $S/nhan.bash; $R $S/nhan-bang.bash
$VM "sudo timedatectl set-ntp false && sudo timedatectl set-time \"$(date -d tomorrow +%F) 03:11:40\""
until $VM "journalctl -q -u shop-api --since '03:12:00' | grep -q starting" 2>/dev/null; do sleep 5; done
$R $S/lab7.bash; $R $S/lab7-dong-ho.bash; $R $S/mat-lich-su.bash
echo "xong — chạy lại thì số liệu (PID, giờ, số dòng, cỡ tệp) đổi: soát lại số trong lời bài 7.1–7.6"
