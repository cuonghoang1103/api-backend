# spam.py — ghi 30000 dòng thật nhanh, chờ 31 giây (hết cửa sổ 30 s), rồi ghi thêm một dòng
import time
for i in range(30000): print(f"spam line {i}", flush=True)
time.sleep(31)
print("done after the window", flush=True)
