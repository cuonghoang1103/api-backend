# @ Chương 16 · bài 16.5 — dạng bài deadlock (Banker, phát hiện), lập lịch đĩa và semaphore. Đề MỚI, lời giải = output của osgcalc.py.
# Drill B1 — Banker: is the state safe, and can the requests be granted? ||| Bài B1 — Banker: trạng thái có an toàn không, có cấp được yêu cầu không?
python3 osgcalc.py banker "1,0,1 2,1,1 0,1,0 1,2,0 0,0,2" "4,2,3 3,2,2 2,3,1 1,3,2 3,1,4" "2,1,1" P4=1,0,1 P1=1,0,0
# Drill B2 — the smallest x that makes the state safe ||| Bài B2 — x nhỏ nhất để trạng thái an toàn
python3 osgcalc.py banker-x "1,0,1 2,1,1 0,1,0 1,2,0 0,0,2" "4,2,3 3,2,2 2,3,1 1,3,2 3,1,4" "1,x,1"
# Drill B3 — one resource type, Has/Max tables ||| Bài B3 — một loại tài nguyên, bảng Has/Max
python3 osgcalc.py banker "2 1 3 2" "7 4 5 8" "2"
python3 osgcalc.py banker "2 1 3 2" "7 4 5 8" "1"
# Drill B4 — deadlock DETECTION with a Request matrix ||| Bài B4 — PHÁT HIỆN deadlock bằng ma trận Request
python3 osgcalc.py detect "1,0,1 0,1,0 1,1,0 0,0,1" "0,1,0 1,0,1 0,0,1 1,0,0" "0,0,0"
python3 osgcalc.py detect "1,0,1 0,1,0 1,1,0 0,0,1" "0,1,0 1,0,1 0,0,1 1,0,0" "0,1,0"
# Drill K1 — disk arm scheduling, cylinders 0-199, head at 80 moving up ||| Bài K1 — lập lịch tay đĩa, trụ 0-199, đầu đọc ở 80 đang đi lên
python3 osgcalc.py disk fcfs 80 "45 132 12 98 181 67 140 30"
python3 osgcalc.py disk sstf 80 "45 132 12 98 181 67 140 30" ms=2
python3 osgcalc.py disk scan 80 "45 132 12 98 181 67 140 30"
python3 osgcalc.py disk look 80 "45 132 12 98 181 67 140 30"
python3 osgcalc.py disk cscan 80 "45 132 12 98 181 67 140 30"
python3 osgcalc.py disk clook 80 "45 132 12 98 181 67 140 30"
python3 osgcalc.py disk look 80 "45 132 12 98 181 67 140 30" down
# Drill K2 — cylinder skew ||| Bài K2 — độ lệch trụ
python3 osgcalc.py skew 7200 1 300
# Drill Y1 — which outputs can three processes with two semaphores print? ||| Bài Y1 — ba tiến trình với hai semaphore in ra được những gì?
python3 osgcalc.py sem
