# @ Chương 16 · bài 16.3 — dạng bài lập lịch CPU (Gantt) kiểu đề OSG202. Đề MỚI, lời giải = output của osgcalc.py.
# Drill S1 — five batch jobs, all arrive at time 0 ||| Bài S1 — năm việc theo lô, cùng đến lúc 0
python3 osgcalc.py sched fcfs "A:0:6:4 B:0:3:1 C:0:8:5 D:0:2:2 E:0:5:3"
python3 osgcalc.py sched sjf "A:0:6:4 B:0:3:1 C:0:8:5 D:0:2:2 E:0:5:3"
python3 osgcalc.py sched prio "A:0:6:4 B:0:3:1 C:0:8:5 D:0:2:2 E:0:5:3" hi=big
python3 osgcalc.py sched rr "A:0:6:4 B:0:3:1 C:0:8:5 D:0:2:2 E:0:5:3" q=2
# Drill S2 — five processes with arrival times ||| Bài S2 — năm tiến trình có thời điểm đến
python3 osgcalc.py sched sjf "P1:0:7 P2:1:4 P3:2:1 P4:4:4 P5:6:3"
python3 osgcalc.py sched srtf "P1:0:7 P2:1:4 P3:2:1 P4:4:4 P5:6:3"
python3 osgcalc.py sched rr "P1:0:7 P2:1:4 P3:2:1 P4:4:4 P5:6:3" q=3
# Drill S3 — preemptive priority, smaller number = higher priority ||| Bài S3 — ưu tiên có cắt ngang, số nhỏ = ưu tiên cao
python3 osgcalc.py sched prio-p "P1:0:6:3 P2:2:3:1 P3:3:4:4 P4:5:2:2"
python3 osgcalc.py sched prio "P1:0:6:3 P2:2:3:1 P3:3:4:4 P4:5:2:2"
