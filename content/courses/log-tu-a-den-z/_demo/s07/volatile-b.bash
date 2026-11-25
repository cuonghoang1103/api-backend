# 7.1 — Sau khi khởi động lại (lần khởi động 2): dòng ghi lúc volatile đã mất; bỏ thử nghiệm, đưa log trong RAM xuống đĩa
sudo journalctl -t thu
sudo journalctl --list-boots
sudo rm /etc/systemd/journald.conf.d/50-thu-volatile.conf
sudo systemctl restart systemd-journald
sudo journalctl --flush
sudo journalctl --disk-usage
