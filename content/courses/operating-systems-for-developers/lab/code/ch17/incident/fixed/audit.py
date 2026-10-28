"""audit.py — ĐÃ SỬA (lời giải mẫu 17.3, sự cố 5: I/O chậm — và hỏng dữ liệu).
Lỗi: mỗi sự kiện ~80 byte = ~80 lần write() + ~80 lần fsync(). fsync là lời gọi đắt nhất của cả hệ thống file
(chờ thiết bị xác nhận, bài 9.3). Thêm nữa, ghi TỪNG BYTE từ nhiều luồng ⇒ byte của các sự kiện xen vào nhau.
Sửa: dựng nguyên dòng, MỘT write() với O_APPEND (nguyên tử cho một lần ghi nhỏ), rồi gom fsync: các luồng chờ
một lần fdatasync chung ("group commit", như WAL của PostgreSQL) — vẫn đúng luật "nằm trên đĩa trước khi trả lời 200".
"""
import os, threading, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PATH = "/data/audit.log"
fd = os.open(PATH, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o644)   # mở MỘT lần, không mở/đóng mỗi sự kiện
lock = threading.Condition()
written = 0      # số sự kiện đã write()
synced = 0       # số sự kiện chắc chắn đã nằm trên đĩa
syncing = False

def append_event(line: bytes):
    global written, synced, syncing
    with lock:
        os.write(fd, line)                     # một lần ghi trọn dòng
        written += 1; mine = written
        while synced < mine:
            if not syncing:                    # chưa ai fsync ⇒ mình làm "người gom": một fdatasync cho cả nhóm
                syncing = True; upto = written
                lock.release()
                try: os.fdatasync(fd)
                finally: lock.acquire()
                synced = max(synced, upto); syncing = False; lock.notify_all()
            else:
                lock.wait()                    # đã có người fsync ⇒ chờ lần đó (hoặc lần kế) phủ tới sự kiện của mình

class H(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/event"):
            t0 = time.perf_counter()
            append_event(f"{time.time():.6f} {self.path} user=42 action=transfer amount=1\n".encode())
            ms = (time.perf_counter() - t0) * 1000
            self.send_response(200); self.end_headers(); self.wfile.write(f"stored in {ms:.1f} ms\n".encode())
        else:
            self.send_response(200); self.end_headers(); self.wfile.write(b"ok\n")
    def log_message(self, *a): pass

print("audit listening on 3004", flush=True)
ThreadingHTTPServer(("", 3004), H).serve_forever()
