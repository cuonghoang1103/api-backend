#!/bin/bash
# sao-luu.sh — "job sao lưu": ghi 200 MB thẳng xuống đĩa (O_DIRECT, bỏ qua page cache) lặp mãi. Thủ phạm I/O của bài 2.1.
while :; do dd if=/dev/zero of=/tmp/backup.bin bs=1M count=200 oflag=direct status=none; done
