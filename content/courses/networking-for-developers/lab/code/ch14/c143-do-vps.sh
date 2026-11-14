# 14.3 · nft-vps: vì sao bot không có cửa — và cái bẫy thứ tự drop-in
sshd -T | grep -E '^(passwordauthentication|kbdinteractiveauthentication|permitrootlogin) '
ls /etc/ssh/sshd_config.d/
journalctl -u ssh993 --no-pager -o cat | grep -E "authenticating user" | tail -3
# cùng nội dung, nhưng đặt tên 70- ⇒ 50-cloud-init.conf ("yes") được đọc trước và THẮNG
mv /etc/ssh/sshd_config.d/01-no-password.conf /etc/ssh/sshd_config.d/70-no-password.conf
sshd -T | grep -E '^passwordauthentication '
mv /etc/ssh/sshd_config.d/70-no-password.conf /etc/ssh/sshd_config.d/01-no-password.conf
sshd -T | grep -E '^passwordauthentication '
