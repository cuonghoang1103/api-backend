# dem.py — in một dòng mỗi giây. Chạy trong container KHÔNG có -u / PYTHONUNBUFFERED thì docker logs trống.
import time
for i in range(1, 6):
    print(f"tick {i}")
    time.sleep(1)
