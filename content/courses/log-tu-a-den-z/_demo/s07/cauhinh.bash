# 7.4 — journald.conf, giới hạn tốc độ, dung lượng, vacuum, verify (máy ảo lab7)
journalctl -b -u systemd-journald --no-pager -o cat | head -n 6
systemd-analyze cat-config systemd/journald.conf | grep -E '^#?(Storage|SystemMaxUse|SystemKeepFree|SystemMaxFileSize|MaxRetentionSec|MaxFileSec|RateLimitIntervalSec|RateLimitBurst|SyncIntervalSec|ForwardToSyslog|Seal|Compress)='
sudo mkdir -p /etc/systemd/journald.conf.d
printf '[Journal]\nSystemMaxUse=60M\nSystemMaxFileSize=8M\nMaxRetentionSec=1month\n' | sudo tee /etc/systemd/journald.conf.d/60-gioi-han.conf
sudo systemctl restart systemd-journald
journalctl -u systemd-journald -n 2 --no-pager -o cat
sudo journalctl --rotate
journalctl --disk-usage
sudo journalctl --vacuum-size=40M
sudo journalctl --vacuum-time=7d
journalctl --disk-usage
sudo journalctl --verify 2>&1 | tail -n 3
sudo journalctl --setup-keys 2>/dev/null | tee ~/fss-key.txt
sudo systemctl restart systemd-journald
logger -t thu-niem-phong 'dong ghi sau khi bat niem phong'
journalctl -u systemd-journald -n 2 --no-pager -o cat
