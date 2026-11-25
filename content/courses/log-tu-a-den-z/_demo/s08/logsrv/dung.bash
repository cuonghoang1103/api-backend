#!/bin/bash
# dung.bash — dựng máy chủ log trung tâm của lab: container lgz-logsrv CHUNG mạng với lgz-vm (lab7 thấy nó ở 10.0.2.2).
# --init: tiến trình rsyslogd bị giết được dọn ngay (không thành zombie). CA + chứng chỉ logsrv.lab tự ký, hạn 30 ngày.
set -e; cd "$(dirname "$0")"
docker rm -f lgz-logsrv >/dev/null 2>&1 || true
docker run -d --init --name lgz-logsrv --label lgz=1 --network container:lgz-vm ubuntu:24.04 sleep infinity >/dev/null
docker exec lgz-logsrv bash -c 'export DEBIAN_FRONTEND=noninteractive; apt-get update -q >/dev/null && apt-get install -y -q --no-install-recommends rsyslog rsyslog-gnutls rsyslog-relp openssl jq procps >/dev/null 2>&1
mkdir -p /etc/rsyslog-tls /var/spool/rsyslog /var/log/remote && cd /etc/rsyslog-tls
openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes -days 30 -subj "/CN=Lab Log CA" -keyout ca.key -out ca.pem 2>/dev/null
openssl req -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes -subj "/CN=logsrv.lab" -keyout logsrv.key -out logsrv.csr 2>/dev/null
printf "subjectAltName=DNS:logsrv.lab\n" > ext && openssl x509 -req -in logsrv.csr -CA ca.pem -CAkey ca.key -CAcreateserial -days 30 -extfile ext -out logsrv.pem 2>/dev/null'
docker cp rsyslog.conf lgz-logsrv:/etc/rsyslog.conf
docker exec lgz-logsrv bash -c 'rsyslogd -N1 2>&1 | tail -1; rsyslogd -i /run/rsyslogd.pid'
echo "lgz-logsrv chạy; CA: docker exec lgz-logsrv cat /etc/rsyslog-tls/ca.pem"
