# Ch4 · 4.3 — slow start: cửa sổ tắc nghẽn (cwnd) lớn dần; nút cổ chai 20 Mbit + trễ 40 ms
# iperf3 chạy nền; ta chụp ss -ti vài lần để thấy cwnd và nhịp tăng
iperf3 -c 10.10.2.10 -t 6 -i 1 &
sleep 0.2; ss -tin dst 10.10.2.10 | grep -A1 ESTAB | tail -1
sleep 1.3; ss -tin dst 10.10.2.10 | grep -A1 ESTAB | tail -1
sleep 2.0; ss -tin dst 10.10.2.10 | grep -A1 ESTAB | tail -1
wait
