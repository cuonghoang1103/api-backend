# 7.1 — Thử Storage=volatile (máy ảo lab7, lần khởi động 1): log chỉ còn trong RAM (/run) — rồi khởi động lại
sudo mkdir -p /etc/systemd/journald.conf.d
printf '[Journal]\nStorage=volatile\n' | sudo tee /etc/systemd/journald.conf.d/50-thu-volatile.conf
sudo systemctl restart systemd-journald
sudo journalctl --disk-usage
sudo ls /run/log/journal/
logger -t thu 'GHI-TRUOC-KHI-KHOI-DONG-LAI'
sudo journalctl -t thu -n 1
