# "Máy chủ Linux" của Chương 16: Ubuntu 24.04 có systemd thật (journald, sshd, rsyslog, logrotate, cron, nginx) chạy trong container.
FROM lgz-c15-vm:1
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends rsyslog logrotate cron nginx-light jq python3 sudo acl \
 && rm -rf /var/lib/apt/lists/* && systemctl enable rsyslog cron nginx && usermod -aG sudo an
CMD ["/sbin/init"]
