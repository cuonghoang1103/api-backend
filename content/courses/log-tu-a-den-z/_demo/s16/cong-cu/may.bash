#!/usr/bin/env bash
# may.bash len|xuong — "máy chủ Linux" của Chương 16: container lgz-c16-may (systemd thật, hostname may16, KHÔNG mạng ra ngoài).
# privileged: systemd làm PID 1 cần cgroup, chattr cần CAP_LINUX_IMMUTABLE — CHỈ trên máy lab.
case "$1" in
  len) docker rm -f lgz-c16-may >/dev/null 2>&1
       docker run -d --name lgz-c16-may --hostname may16 --network none --privileged --cgroupns private --tmpfs /run --tmpfs /run/lock \
         -e TZ=Asia/Ho_Chi_Minh -v "$(cd "$(dirname "$0")/.." && pwd)":/lab:ro lgz-c16-vm:1 >/dev/null
       until docker exec lgz-c16-may systemctl is-system-running 2>/dev/null | grep -qE 'running|degraded'; do sleep 1; done
       # container privileged thấy ring buffer nhân của MÁY THẬT ⇒ tắt imklog, xoá kern.log/dmesg/syslog để log chỉ là của "may16"
       docker exec lgz-c16-may sh -c 'ln -sf /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime; sed -i "s/^module(load=\"imklog\"/#&/" /etc/rsyslog.conf;
         mkdir -p /etc/systemd/journald.conf.d; printf "[Journal]\nReadKMsg=no\n" > /etc/systemd/journald.conf.d/00-lab.conf; systemctl restart systemd-journald; systemctl stop rsyslog 2>/dev/null; rm -f /var/log/kern.log /var/log/dmesg /var/log/syslog /var/log/t; : > /var/log/auth.log; journalctl --rotate -q; journalctl --vacuum-time=1s -q;
         systemctl start rsyslog; useradd -m -s /bin/bash dev; grep -q may16 /etc/hosts || echo "127.0.1.1 may16" >> /etc/hosts; echo dev:MatKhauLab-16 | chpasswd' ;;
  xuong) docker rm -f lgz-c16-may >/dev/null 2>&1 ;;
esac
