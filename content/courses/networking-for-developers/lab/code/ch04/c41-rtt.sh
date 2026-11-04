# Ch4 · 4.1 — mỗi kết nối MỚI tốn một vòng bắt tay; keep-alive dùng lại thì khỏi
# router thêm 25 ms vào chiều hồi đáp (tc netem trên cổng LAN) ⇒ mỗi kết nối mới tốn thêm một vòng
# A. BA yêu cầu, MỖI yêu cầu một kết nối riêng (curl gọi rời từng lần):
for i in 1 2 3; do
  curl -so /dev/null -w "req$i  new-conn=%{num_connects}  connect=%{time_connect}s  ttfb=%{time_starttransfer}s\n" http://10.10.2.10/
done
# B. BA yêu cầu trên MỘT kết nối (keep-alive: một lần gọi curl, nhiều URL):
curl -so /dev/null -w "keepalive new-conn=%{num_connects}  ttfb=%{time_starttransfer}s\n" http://10.10.2.10/ http://10.10.2.10/ http://10.10.2.10/
