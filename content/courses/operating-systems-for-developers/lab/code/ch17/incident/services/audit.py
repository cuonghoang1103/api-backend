"""audit.py — nhật ký kiểm toán (cổng 3004). Luật: mỗi sự kiện PHẢI nằm trên đĩa trước khi trả lời 200 (không được mất)."""
import os, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PATH = "/data/audit.log"

def append_event(line: bytes):
    fd = os.open(PATH, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o644)
    try:
        for i in range(len(line)):            # ghi từng byte cho "chắc", và fsync từng byte cho "an toàn tuyệt đối"
            os.write(fd, line[i:i + 1])
            os.fsync(fd)
    finally:
        os.close(fd)

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
