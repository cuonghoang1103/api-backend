# Lời giải 🧪 bài 7.2 câu 4 (phần 1) — máy ảo lab7 THẬT (KVM), sau `ssh lab7 sudo systemctl reboot` (24/11/2026).
journalctl --list-boots | tail -n 3
journalctl -b -1 -n 6 --no-pager
