#!/usr/bin/env python3
# /opt/shop/api.py — app thử của Lab 7: ghi log ra stdout; tiền tố <N> là MỨC syslog mà journald hiểu (3 err, 4 warning, 6 info, 7 debug)
import http.server, json, os, random, sys, time
random.seed(7)
def log(muc, msg): print(f"<{muc}>{msg}", flush=True)
GIU = []  # bộ nhớ "báo cáo" không bao giờ được giải phóng — lỗi cố ý
class H(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def tra(self, ma, body):
        self.send_response(ma); self.send_header("Content-Type", "application/json"); self.end_headers()
        self.wfile.write(json.dumps(body).encode())
    def do_GET(self):
        p = self.path
        if p == "/api/products":
            log(6, f"GET {p} 200"); return self.tra(200, {"items": 12})
        if p.startswith("/api/orders/"):
            oid = p.rsplit("/", 1)[1]
            if random.random() < 0.08:
                log(3, f"order {oid} failed: database timeout after 5000 ms (pool 10/10 busy)"); return self.tra(500, {"error": "internal"})
            log(6, f"GET {p} 200"); return self.tra(200, {"id": oid})
        if p.startswith("/login?user="):
            u = p.split("=", 1)[1]
            log(4, f"login failed user={u} reason=bad_password"); return self.tra(401, {"error": "unauthorized"})
        if p == "/report":
            log(6, "nightly report started")
            for i in range(60):
                GIU.append(bytearray(10 * 1024 * 1024))  # 10 MiB mỗi bước
                if i % 3 == 0: log(7, f"report: loaded {len(GIU) * 10} MiB of orders")
                time.sleep(0.2)
            log(6, "nightly report done"); return self.tra(200, {"ok": True})
        log(4, f"GET {p} 404"); self.tra(404, {"error": "not found"})
log(6, f"shop-api 1.4.2 starting, pid={os.getpid()}, db={os.environ.get('DB_HOST', '?')}")
http.server.ThreadingHTTPServer(("127.0.0.1", 8080), H).serve_forever()
