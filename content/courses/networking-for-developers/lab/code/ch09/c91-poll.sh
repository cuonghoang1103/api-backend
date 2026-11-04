# Ch9 · 9.1 — polling vs long-polling trên cùng một bộ đếm (:5100, tăng 1 mỗi 2s). Polling lặp lại nhiều câu trả lời TRÙNG;
# long-polling giữ MỘT yêu cầu tới khi có cái mới (xem time_total nó đã chờ, không quay vòng).
for i in 1 2 3; do curl -s http://10.10.2.20:5100/poll; sleep 1; done
curl -s -w "(long-poll returned after %{time_total}s)\n" "http://10.10.2.20:5100/longpoll?since=999"
