# pyserver.py — máy chủ "hello" bằng thư viện chuẩn Python, HTTP/1.1 keep-alive như Node và Java.
# NODELAY=1 ⇒ bật TCP_NODELAY trên socket của mỗi kết nối (thuộc tính có sẵn của StreamRequestHandler).
import os
from http.server import BaseHTTPRequestHandler, HTTPServer

class Hello(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    disable_nagle_algorithm = os.environ.get("NODELAY") == "1"
    def do_GET(self):
        body = b"hello\n"
        self.send_response(200)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
    def log_message(self, *args):
        pass

HTTPServer(("", 3000), Hello).serve_forever()
