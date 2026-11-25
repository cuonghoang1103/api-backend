# Chuẩn bị Chương 8 (chạy một lần, trên lab7 trừ dòng @keodo). LAB THÔI: bật đăng nhập bằng mật khẩu để có cái mà đọc.
# Máy chủ thật: PasswordAuthentication no (xem netsec-4-2-sshd-config).
ls /etc/ssh/sshd_config.d/; cat /etc/ssh/sshd_config.d/60-cloudimg-settings.conf
printf 'PasswordAuthentication yes\nKbdInteractiveAuthentication no\n' | sudo tee /etc/ssh/sshd_config.d/10-lab.conf
sudo systemctl restart ssh && sudo sshd -T | grep -i '^passwordauthentication'
@keodo ssh -tt -b 192.168.56.20 hv@192.168.56.10 'sleep 2; exit' >/dev/null; echo "phiên tương tác của hv xong"
