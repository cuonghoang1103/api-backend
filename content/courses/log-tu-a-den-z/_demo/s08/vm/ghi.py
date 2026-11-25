# ghi.py <tệp> <dòng/giây> <giây> — giả một ứng dụng: MỞ tệp log MỘT lần rồi ghi mãi (như đa số ứng dụng thật).
# Nhận SIGHUP ⇒ đóng và mở lại tệp theo TÊN (cái postrotate cần). Mỗi dòng mang số thứ tự để đếm dòng mất.
import signal, sys, time
duong, toc, giay = sys.argv[1], int(sys.argv[2]), float(sys.argv[3])
f = open(duong, "a", buffering=1)
def mo_lai(*_):
    global f
    f.close(); f = open(duong, "a", buffering=1)
signal.signal(signal.SIGHUP, mo_lai)
n, t0 = 0, time.time()
while time.time() - t0 < giay:
    for _ in range(toc // 100):
        n += 1; f.write(f"{time.strftime('%H:%M:%S')} shop dong {n}\n")
    time.sleep(0.01)
f.close(); open(duong + ".tong", "w").write(f"{n}\n")
