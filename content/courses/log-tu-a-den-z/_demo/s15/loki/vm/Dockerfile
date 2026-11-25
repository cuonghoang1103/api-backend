# "Máy Linux" của lab: Ubuntu 24.04 có systemd thật (journald, sshd) chạy trong container — thay cho máy ảo khi máy yếu.
FROM ubuntu:24.04
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends systemd systemd-sysv openssh-server \
 && rm -rf /var/lib/apt/lists/* && mkdir -p /var/log/journal \
 && useradd -m -s /bin/bash an && echo 'an:MatKhauLab-15' | chpasswd \
 && sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config && systemctl enable ssh
STOPSIGNAL SIGRTMIN+3
CMD ["/sbin/init"]
