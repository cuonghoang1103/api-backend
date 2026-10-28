# ghi-mai.py — app ghi log ra file: mở MỘT lần lúc khởi động, rồi cứ 20 ms thêm một dòng (giống mọi logger ghi file).
import sys, time, datetime
f = open(sys.argv[1], 'a', buffering=1)          # mở một lần ⇒ fd bám theo INODE, không bám theo tên file
n = 0
while True:
    n += 1
    f.write(f'{datetime.datetime.now():%H:%M:%S.%f} GET /api/v1/feed 200 request={n}\n')
    time.sleep(0.02)
