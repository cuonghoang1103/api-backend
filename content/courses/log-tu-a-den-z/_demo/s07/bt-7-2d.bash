# Lời giải 🧪 bài 7.2 câu 4 (phần 2) — cùng máy ảo, lần này "rút điện": giết tiến trình qemu (docker rm -f lgz-vm) rồi bật lại.
journalctl --list-boots | tail -n 3
journalctl -b -1 -n 4 --no-pager
journalctl -b -g 'uncleanly|corrupted' --no-pager
journalctl -b -2 -t sudo -g reboot --no-pager
