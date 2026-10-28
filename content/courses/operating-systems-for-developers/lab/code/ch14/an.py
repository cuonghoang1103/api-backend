# an.py — giữ N MiB bộ nhớ đã ghi (mỗi byte = 1, nén rất tốt) rồi ngủ, để đo RSS / footprint (Chương 14, bài 14.4).
import os, sys, time
n = int(sys.argv[1]) if len(sys.argv) > 1 else 256
buf = bytearray(b"\x01") * (n << 20)
print(f"pid {os.getpid()} holds {n} MiB", flush=True)
time.sleep(float(sys.argv[2]) if len(sys.argv) > 2 else 5)
