#!/bin/bash
# frr.sh <vai> — chép cấu hình FRR của vai này rồi khởi động zebra + bgpd (+ staticd) trong container.
cp /lab/k/moi-truong/inet/frr-daemons /etc/frr/daemons
cp "/lab/k/moi-truong/inet/frr-$1.conf" /etc/frr/frr.conf
printf 'service integrated-vtysh-config\nhostname %s\n' "$1" > /etc/frr/vtysh.conf
chown -R frr:frr /etc/frr
/usr/lib/frr/frrinit.sh start >/tmp/frr-start.log 2>&1
