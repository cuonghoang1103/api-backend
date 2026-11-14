# 14.3 · nft-vps (Ubuntu + systemd thật, như VPS mới thuê): ai đang giữ cổng 22?
systemctl is-enabled ssh.socket ssh.service
ss -4tlnp | grep -E ':(22|993) '
# bẫy 1 — làm như mọi hướng dẫn cũ: thêm "Port 993" vào sshd_config rồi khởi động lại sshd
echo "Port 993" >> /etc/ssh/sshd_config
systemctl restart ssh
ss -4tlnp | grep -E ':(22|993) '
# bẫy 2 — generator của systemd đọc Port khi daemon-reload + restart ssh.socket: 993 THAY cổng 22, không thêm
systemctl daemon-reload; systemctl restart ssh.socket
ss -4tlnp | grep -E ':(22|993) '
cat /run/systemd/generator/ssh.socket.d/*.conf
# trả lại như cũ — trên VPS thật, đang SSH bằng cổng 22 mà làm bước trên là tự khoá mình ngoài cửa
sed -i '/^Port 993/d' /etc/ssh/sshd_config; systemctl daemon-reload; systemctl restart ssh.socket
ss -4tlnp | grep -E ':(22|993) '
