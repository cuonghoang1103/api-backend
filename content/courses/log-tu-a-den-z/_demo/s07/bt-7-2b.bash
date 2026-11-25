# Bẫy container (THÊM cho lời giải 7.2 câu 4) — trong lgz-c07: `sudo systemctl reboot` (container dừng) rồi `podman start lgz-c07` ⇒ boot ID vẫn là của nhân máy chủ + podman gắn tmpfs vào /var/log/journal ⇒ chỉ một lần khởi động, lần trước biến mất.
journalctl --list-boots
journalctl -b -1 -n 6 --no-pager
