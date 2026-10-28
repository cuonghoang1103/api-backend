"""worker.py — tiến trình xử lý việc nền (ảnh, email…). Ghi log ra /var/log/app/worker.log, kết quả ra /var/log/app/results/."""
import logging, os, random, threading, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

LOG_DIR = "/var/log/app"
os.makedirs(LOG_DIR + "/results", exist_ok=True)
logging.basicConfig(filename=LOG_DIR + "/worker.log", level=logging.DEBUG,          # ai đó bật DEBUG lúc gỡ lỗi rồi quên tắt
                    format="%(asctime)s %(levelname)s %(threadName)s %(message)s")
log = logging.getLogger("worker")
state = {"ok": 0, "failed": 0, "last_error": ""}

def job_loop():
    n = 0
    while True:
        n += 1
        payload = "".join(random.choice("abcdef0123456789") for _ in range(64))
        for step in range(40):                       # mỗi việc ghi 40 dòng DEBUG chi tiết
            log.debug("job=%d step=%d payload=%s state=%s", n, step, payload, "x" * 60)
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
