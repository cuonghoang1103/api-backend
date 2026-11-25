# 7.4 — Sau khi đặt SystemMaxUse=60M và chạy các bài thử làm ngập log: lịch sử các lần khởi động cũ còn không?
journalctl --list-boots
journalctl --disk-usage
journalctl -u spam -u spam-mac-dinh -u spam-1000 -u lu-mac-dinh -u lu-1000 -q | wc -l
