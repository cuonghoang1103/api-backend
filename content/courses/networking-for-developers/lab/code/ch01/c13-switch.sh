# Ch1 · 1.4 — nhìn VÀO cái switch ảo: bảng MAC của bridge nfd-lan (chạy trong không gian mạng của máy ảo Docker, CHỈ ĐỌC)
ip -br link show type bridge | grep -E "^$BR "
bridge fdb show br $BR | grep -v permanent
