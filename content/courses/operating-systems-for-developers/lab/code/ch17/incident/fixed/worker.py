"""worker.py — ĐÃ SỬA (lời giải mẫu 17.3, sự cố 3: log làm đầy đĩa, và file đã xoá vẫn chiếm chỗ).
Hai lỗi chồng nhau:
 (1) level=DEBUG bị bỏ quên: 40 dòng ~200 byte mỗi việc ⇒ vài MB/giây vào một ổ 64 MiB.
 (2) rotate.sh XOÁ file log trong khi worker còn giữ fd mở ⇒ tên biến mất, inode vẫn còn và vẫn lớn lên:
     du thấy 0, df thấy đầy (bài 2.4 — lsof +L1). Hết chỗ ⇒ ghi kết quả việc báo ENOSPC.
Sửa: mức log lấy từ biến môi trường (mặc định INFO); WatchedFileHandler mở lại file khi nó bị đổi tên/xoá;
     rotate.sh mới giữ một bản cũ có giới hạn thay vì xoá file đang mở.
"""
import logging, logging.handlers, os, random, threading, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

LOG_DIR = "/var/log/app"
os.makedirs(LOG_DIR + "/results", exist_ok=True)
h = logging.handlers.WatchedFileHandler(LOG_DIR + "/worker.log")   # thấy inode đổi ⇒ tự đóng fd cũ, mở file mới
h.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(threadName)s %(message)s"))
log = logging.getLogger("worker"); log.addHandler(h)
log.setLevel(os.environ.get("LOG_LEVEL", "INFO"))
state = {"ok": 0, "failed": 0, "last_error": ""}

def job_loop():
    n = 0
    while True:
        n += 1
        payload = "".join(random.choice("abcdef0123456789") for _ in range(64))
        for step in range(40):
            log.debug("job=%d step=%d payload=%s state=%s", n, step, payload, "x" * 60)   # vẫn còn, nhưng tắt ở INFO
        if n % 500 == 0:
            log.info("processed %d jobs", n)
        try:
            with open(f"{LOG_DIR}/results/{n}.json", "w") as f:     # mỗi việc một file kết quả mới
                f.write('{"job": %d, "status": "done", "data": "%s"}\n' % (n, payload * 8))
            if n > 100 and os.path.exists(f"{LOG_DIR}/results/{n - 100}.json"):
                os.remove(f"{LOG_DIR}/results/{n - 100}.json")      # chỉ giữ 100 kết quả gần nhất
            state["ok"] += 1
        except OSError as e:
            state["failed"] += 1; state["last_error"] = str(e)
        time.sleep(0.002)

class H(BaseHTTPRequestHandler):
    def do_GET(self):
        bad = state["failed"] > 0 and state["last_error"]
        self.send_response(500 if bad else 200); self.end_headers()
        self.wfile.write((f"ok={state['ok']} failed={state['failed']} last_error={state['last_error']}\n").encode())
    def log_message(self, *a): pass

threading.Thread(target=job_loop, daemon=True, name="jobs").start()
print("worker listening on 3002", flush=True)
ThreadingHTTPServer(("", 3002), H).serve_forever()
