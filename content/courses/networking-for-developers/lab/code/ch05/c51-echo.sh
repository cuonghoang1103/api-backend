# Ch5 · 5.1 — UDP không bắt tay: gửi "ECHO", nhận vọng lại ngay; không SYN, không cú thiết lập kết nối
printf ECHO | timeout 2 socat - UDP:10.10.2.10:9999
