# 14.3 · nft-vps: cách an toàn — THÊM một dịch vụ riêng nghe 993, không đụng ssh.socket (cổng 22 đứng yên, hỏng thì 22 vẫn còn)
cat > /etc/systemd/system/ssh993.service <<'UNIT'
[Unit]
Description=OpenSSH them cong 993 (mang truong chi mo 80/443/587/993)
After=network.target

[Service]
ExecStartPre=/usr/sbin/sshd -t
ExecStart=/usr/sbin/sshd -D -p 993
ExecReload=/bin/kill -HUP $MAINPID
RuntimeDirectory=sshd
RuntimeDirectoryPreserve=yes
Restart=on-failure

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload; systemctl enable --now ssh993 2>&1 | tail -1
@ sleep 1
ss -4tlnp | grep -E ':(22|993) '
