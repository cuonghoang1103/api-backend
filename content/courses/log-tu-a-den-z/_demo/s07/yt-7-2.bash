# Bổ sung YouTube 0dG3vUYt7Uk (Learn Linux TV — journalctl Basics) — chạy thật 24/11/2026 trong container systemd lgz-c07 (podman, --network none, 2 GB). Giờ máy = UTC.
sudo usermod -aG systemd-journal hv
id -u hv
logger -t ghi-chu 'hv kiem tra cau hinh luc nua dem'
journalctl _UID=$(id -u hv) --since '1 hour ago' --no-pager
journalctl -u ssh --since yesterday --no-pager | tail -n 2
