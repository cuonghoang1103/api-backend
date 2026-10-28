# @ Chương 16 · bài 16.8 — bài thi cuối khoá: mọi câu có tính toán được giải bằng osgcalc.py (đề MỚI).
# Q1 — FCFS ||| Câu 1 — FCFS
python3 osgcalc.py sched fcfs "A:0:5 B:0:9 C:0:2 D:0:4"
# Q2 — round robin, quantum 3 ||| Câu 2 — round robin, quantum 3
python3 osgcalc.py sched rr "P1:0:6 P2:1:4 P3:2:2" q=3
# Q3 — SRTF ||| Câu 3 — SRTF
python3 osgcalc.py sched srtf "P1:0:6 P2:2:2 P3:3:8 P4:5:3"
# Q4–Q5 — page replacement ||| Câu 4–5 — thay trang
python3 osgcalc.py page lru 4 "1 3 5 2 3 1 4 5 2 3 6 2"
python3 osgcalc.py page opt 3 "1 3 5 2 3 1 4 5 2 3 6 2"
# Q6–Q8 — addresses ||| Câu 6–8 — địa chỉ
python3 osgcalc.py addr bits=8,12,12 0xABCDE123
python3 osgcalc.py pagesize 32 4096 4
python3 osgcalc.py eat 5 50 0.9 2
# Q9 — Banker, two resource types ||| Câu 9 — Banker, hai loại tài nguyên
python3 osgcalc.py banker "1,2 2,0 0,1 1,1" "3,3 2,2 2,2 1,3" "1,1"
# Q10 — SSTF ||| Câu 10 — SSTF
python3 osgcalc.py disk sstf 50 "82 170 43 140 24 16 190"
python3 osgcalc.py disk fcfs 50 "82 170 43 140 24 16 190"
python3 osgcalc.py disk look 50 "82 170 43 140 24 16 190"
# Q6 trap — the same address split 10/10/12 ||| Câu 6, cái bẫy — cùng địa chỉ đó tách 10/10/12
python3 osgcalc.py addr bits=10,10,12 0xABCDE123
# Q1 and Q4 distractors — SJF and LRU vs FIFO with 4 frames ||| Phương án nhiễu Câu 1 và 4 — SJF, và LRU so với FIFO khi có 4 khung
python3 osgcalc.py sched sjf "A:0:5 B:0:9 C:0:2 D:0:4" | tail -3
python3 osgcalc.py page fifo 4 "1 3 5 2 3 1 4 5 2 3 6 2" | tail -1
