# Ch4 · 4.1 — gửi SYN vào hố đen (router DROP mọi gói tới 10.10.2.99): SYN truyền lại, giãn GẤP ĐÔI, rồi bỏ cuộc
curl -s --max-time 30 http://10.10.2.99/ ; echo "exit=$? (28 = hết giờ, chưa kết nối được)"
