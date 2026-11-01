#!/bin/bash
# Lab 3 · Sự cố A (chạy trên nfi-tld) — ĐỪNG ĐỌC trước khi chẩn đoán xong.
# Nhà đăng ký "cập nhật máy chủ tên" theo một phiếu gõ sai: ns2 bị thay bằng ns3.labflow.test (203.0.113.55 — không có máy nào).
sed -i -e 's/^labflow.test.         172800  IN NS  ns2.labflow.test./labflow.test.         172800  IN NS  ns3.labflow.test./' \
       -e 's/^ns2.labflow.test.     172800  IN A   203.0.113.54/ns3.labflow.test.     172800  IN A   203.0.113.55/' \
       -e 's/2026110101 1800 900 604800 900/2026110102 1800 900 604800 900/' /dnsz/src/test.zone
bash /lab/k/moi-truong/dns/ky.sh test && rndc reload test >/dev/null
