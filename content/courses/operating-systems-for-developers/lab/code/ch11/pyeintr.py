# pyeintr.py — cùng tình huống eintr.c, bằng Python: tín hiệu cắt ngang os.read() — Python tự hỏi lại (PEP 475).
import os, signal, time

r, w = os.pipe()
if os.fork() == 0:
    time.sleep(2); os.write(w, b"data\n"); os._exit(0)
signal.signal(signal.SIGALRM, lambda sig, frame: print("handler ran"))
t0 = time.monotonic()
signal.alarm(1)
data = os.read(r, 64)
print(f"{time.monotonic() - t0:.1f}s os.read() returned {data!r}")
