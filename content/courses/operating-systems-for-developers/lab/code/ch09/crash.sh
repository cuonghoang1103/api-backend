#!/bin/bash
# crash.sh <ảnh đĩa> <file…> — "rút điện" an toàn: chép NGAY ảnh đĩa đang gắn (= đúng những gì đã thật sự nằm trên
# đĩa lúc này; thứ còn trong page cache thì KHÔNG có), gắn bản chép (nhân phát lại journal y như khi khởi động lại sau
# mất điện) rồi in các file. Bản gốc vẫn chạy tiếp, không hề bị đụng.
cp "$1" /tmp/crash.img
mkdir -p /mnt/crash && mount -o loop /tmp/crash.img /mnt/crash
shift
for f in "$@"; do
  if [ -e "/mnt/crash/$f" ]; then printf '  after crash: %-12s %3s bytes  "%s"\n' "$f" "$(stat -c %s "/mnt/crash/$f")" "$(cat "/mnt/crash/$f")"
  else printf '  after crash: %-12s (no such file)\n' "$f"; fi
done
umount /mnt/crash; rm -f /tmp/crash.img
