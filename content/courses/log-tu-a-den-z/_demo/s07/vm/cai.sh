#!/bin/bash
# cai.sh — chạy TRONG máy ảo (sudo bash cai.sh): cài app thử + các unit của Lab 7
set -e
id shop >/dev/null 2>&1 || useradd --system --no-create-home --shell /usr/sbin/nologin shop
install -d /opt/shop /etc/shop; install -m 644 api.py /opt/shop/api.py
install -m 644 shop-*.service shop-report.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now shop-api.service shop-traffic.service shop-report.timer
systemctl enable shop-worker.service; systemctl start shop-worker.service || true
