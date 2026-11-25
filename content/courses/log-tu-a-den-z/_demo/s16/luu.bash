# 16.1 — mỗi tầng log đang giữ bao lâu, logrotate xoá đúng hạn, kế hoạch lưu theo mục đích (máy may16: cong-cu/may.bash len; BASH_ENV=cong-cu/env.bash)
may 'grep -vE "^#|^$" /etc/logrotate.conf | head -6; echo "--- rsyslog:"; grep -vE "^#|^$" /etc/logrotate.d/rsyslog | head -12'
may 'systemd-analyze cat-config systemd/journald.conf | grep -E "^#?(SystemMaxUse|MaxRetentionSec|MaxFileSec)="; journalctl --disk-usage'
docker run --rm grafana/loki:3.7.10 -config.file=/etc/loki/local-config.yaml -print-config-stderr -verify-config 2>&1 | grep -E "^\s+(retention_period|retention_enabled|delete_request_store):" | sort -u
docker create --name lgz-c16-thu alpine >/dev/null; docker inspect -f "{{.HostConfig.LogConfig.Type}} {{.HostConfig.LogConfig.Config}}" lgz-c16-thu; docker rm lgz-c16-thu >/dev/null
may 'mkdir -p /var/log/thu; printf "/var/log/thu/app.log {\n  daily\n  rotate 3\n  compress\n  missingok\n  dateext\n  dateformat -%%Y%%m%%d-%%s\n}\n" > /etc/logrotate.d/thu; for ngay in 1 2 3 4 5; do echo "dòng log ngày $ngay" >> /var/log/thu/app.log; logrotate -f /etc/logrotate.d/thu; sleep 1; done; ls /var/log/thu/ | sed "s/-[0-9]\{10\}/-<giây>/"'
may 'for f in /var/log/thu/*.gz; do zcat $f; done'
python3 luu/ke-hoach-luu.py
