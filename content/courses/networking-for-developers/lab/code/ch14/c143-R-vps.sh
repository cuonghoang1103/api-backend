# 14.3 · nft-vps: đường hầm -R mặc định chỉ mở 127.0.0.1 trên VPS — muốn cho người ngoài vào phải bật GatewayPorts
ss -4tlnp | grep 8080
echo "GatewayPorts clientspecified" > /etc/ssh/sshd_config.d/10-gateway.conf
systemctl reload ssh993
