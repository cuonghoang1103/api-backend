# @ Chương 16 · bài 16.4 — dạng bài bộ nhớ: thay trang, dịch địa chỉ, bảng trang, TLB. Đề MỚI, lời giải = output của osgcalc.py.
# Drill M1 — one reference string, four algorithms, 3 frames ||| Bài M1 — một chuỗi tham chiếu, bốn thuật toán, 3 khung
python3 osgcalc.py page fifo 3 "7 2 7 3 1 2 4 2 7 3 2 1 5 2"
python3 osgcalc.py page lru 3 "7 2 7 3 1 2 4 2 7 3 2 1 5 2"
python3 osgcalc.py page opt 3 "7 2 7 3 1 2 4 2 7 3 2 1 5 2"
python3 osgcalc.py page clock 3 "7 2 7 3 1 2 4 2 7 3 2 1 5 2"
python3 osgcalc.py page lru 4 "7 2 7 3 1 2 4 2 7 3 2 1 5 2"
python3 osgcalc.py page fifo 4 "7 2 7 3 1 2 4 2 7 3 2 1 5 2" | tail -1
# Drill M2 — Belady's anomaly: more frames, more faults (FIFO only) ||| Bài M2 — nghịch lý Belady: thêm khung, thêm lỗi trang (chỉ FIFO)
python3 osgcalc.py page fifo 3 "1 2 3 4 1 2 5 1 2 3 4 5" | tail -1
python3 osgcalc.py page fifo 4 "1 2 3 4 1 2 5 1 2 3 4 5" | tail -1
python3 osgcalc.py page lru 4 "1 2 3 4 1 2 5 1 2 3 4 5" | tail -1
# Drill M3 — which page is evicted? ||| Bài M3 — trang nào bị đuổi?
python3 osgcalc.py victim "0:126:279:0:0 1:230:260:1:0 2:120:272:1:1 3:160:280:1:1"
# Drill M4 — address arithmetic ||| Bài M4 — tính địa chỉ
python3 osgcalc.py addr bits=10,10,12 0x12345678
python3 osgcalc.py addr bits=9,11,12 0x00C02ABC
python3 osgcalc.py pagesize 32 8192 4
python3 osgcalc.py loglen 128 8192
python3 osgcalc.py seg "2100:500 3800:120 900:300 5000:750" 2 250
python3 osgcalc.py seg "2100:500 3800:120 900:300 5000:750" 1 130
# Drill M5 — effective access time with a TLB ||| Bài M5 — thời gian truy cập hiệu dụng có TLB
python3 osgcalc.py eat 10 80 0.95
python3 osgcalc.py eat 10 80 0.95 4
python3 osgcalc.py eat 10 80 0.80 4
