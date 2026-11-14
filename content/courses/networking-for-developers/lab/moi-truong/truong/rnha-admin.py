# rnha-admin.py — "trang quản trị router" tí hon (14.6) trên 192.168.1.1:80, Basic Auth: mật khẩu MẶC ĐỊNH trùng tên đăng nhập (như router chưa đổi).
import base64, http.server
USER = 'admin'
CRED = base64.b64encode(f'{USER}:{USER}'.encode()).decode()   # mặc định chưa đổi — chỉ trong lab
class H(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        ok = self.headers.get('Authorization') == 'Basic ' + CRED
        if not ok:
            self.send_response(401); self.send_header('WWW-Authenticate', 'Basic realm="Router"'); self.end_headers(); self.wfile.write(b'401 Unauthorized\n'); return
        self.send_response(200); self.send_header('Content-Type', 'text/plain'); self.end_headers()
        self.wfile.write(b'Router admin: Wi-Fi password, port forwarding, DNS, firmware update\n')
    def log_message(self, *a): pass
http.server.ThreadingHTTPServer(('192.168.1.1', 80), H).serve_forever()
