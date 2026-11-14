# 14.3 · "nếu…" — trường soi gói (DPI): mọi gói có chuỗi "SSH-2.0" (lời chào của giao thức SSH) bị cắt, BẤT KỂ cổng
iptables -I CHAN -p tcp -m string --string "SSH-2.0" --algo bm -j REJECT --reject-with tcp-reset
