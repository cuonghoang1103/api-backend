#!/bin/bash
# chay-c173.sh — tạo lại output bài 17.3 trên máy soạn bài (cần Docker Desktop + ảnh os-lab). ~5 phút.
cd "$(dirname "$0")"; H=../ch02/phien-host.sh; O=../../out
bash $H c173-cham-loi.sh  > $O/c173-cham-loi.out.txt 2>&1      # bật bản lỗi, chịu tải 75 s, chấm, GIỮ chạy
bash $H c173-chan-doan.sh > $O/c173-chan-doan.out.txt 2>&1     # điều tra từng sự cố trên hệ thống đang hỏng
docker compose -p os17 down -v --remove-orphans > /dev/null 2>&1
bash $H c173-cham-sua.sh  > $O/c173-cham-sua.out.txt 2>&1      # bật lời giải mẫu, chịu tải 75 s, chấm, dọn
