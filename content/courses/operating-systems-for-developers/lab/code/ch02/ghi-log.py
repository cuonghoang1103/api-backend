# ghi-log.py — "ứng dụng" mở file log một lần rồi ghi mãi vào đó (như mọi app ghi log ra file). Ghi 30 MB rồi giữ file mở.
import sys, time
f = open(sys.argv[1], 'ab')            # fd 3: mở MỘT lần, giữ suốt đời tiến trình
for _ in range(30):
    f.write(b'x' * 1024 * 1024); f.flush()
print(f'pid {__import__("os").getpid()} wrote 30 MB to {sys.argv[1]}, keeping it open', flush=True)
time.sleep(3600)
