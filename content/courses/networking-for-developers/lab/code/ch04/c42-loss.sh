# Ch4 · 4.2 — mất gói thì TCP truyền lại; cột Retr của iperf3 đếm số segment phải gửi lại
# đường qua router: trễ 25 ms + mất 3 % gói (tc netem delay 25ms loss 3%)
iperf3 -c 10.10.2.10 -t 6 -i 1
