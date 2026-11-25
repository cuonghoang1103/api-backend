# 7.1 — Lần khởi động -3 bị "rút điện" lúc 04:10:21 (docker rm -f container chạy qemu): log cuối nằm trong bộ nhớ chưa kịp ghi đĩa
sudo journalctl -b -3 -n 3 --no-pager
sudo journalctl -b -3 -u shop-api -q | wc -l
sudo journalctl -b -2 -g 'uncleanly|not properly' --no-pager
sudo journalctl -b -2 -n 2 --no-pager
