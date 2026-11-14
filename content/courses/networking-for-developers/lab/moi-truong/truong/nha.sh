#!/bin/bash
# nha.sh — máy Linux để ở nhà (14.3): sau router nhà + CGNAT ⇒ không mở cổng vào được; nó TỰ đào đường hầm ra VPS (ssh -R 2222).
ip route replace default via 192.168.1.1
echo 'nameserver 198.18.0.53' > /etc/resolv.conf
useradd -m -s /bin/bash sv 2>/dev/null || true
mkdir -p /run/sshd && ssh-keygen -A >/dev/null
printf 'PasswordAuthentication no\nKbdInteractiveAuthentication no\n' > /etc/ssh/sshd_config.d/01-no-password.conf
/usr/sbin/sshd
exec sleep infinity
