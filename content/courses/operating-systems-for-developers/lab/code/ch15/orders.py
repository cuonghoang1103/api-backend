# orders.py — cùng dịch vụ báo cáo đơn hàng bằng Python (bài 15.4). FIX=1 ⇒ dùng set. NODELAY=1 ⇒ bật TCP_NODELAY.
#   python3 orders.py [cổng]       (ThreadingHTTPServer của thư viện chuẩn)
import json, os, sys
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
FIX = os.environ.get('FIX') == '1'
ORDERS = [{'id': i, 'customer': 'C-%05d' % ((i * 7919) % 2500), 'cents': 1000 + (i * 104729) % 90000} for i in range(20000)]

def unique_customers(lst):
    if FIX:
        return list({o['customer'] for o in lst})
    seen = []                      # ⚠ list: "x in seen" quét từ đầu mỗi lần ⇒ O(n²)
    for o in lst:
        if o['customer'] not in seen:
            seen.append(o['customer'])
    return seen

def totals(lst):
    t = {}
    for o in lst:
        t[o['customer']] = t.get(o['customer'], 0) + o['cents']
    return t

def money(c):
    return f'{c / 100:.2f}'

def report(n):
    lst = ORDERS[:n]
    customers = unique_customers(lst)
    t = totals(lst)
    top = sorted(t.items(), key=lambda kv: -kv[1])[:5]
    return json.dumps({'n': n, 'customers': len(customers), 'total': money(sum(o['cents'] for o in lst)),
                       'top': [{'customer': c, 'total': money(v)} for c, v in top]})

class H(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'
    disable_nagle_algorithm = os.environ.get('NODELAY') == '1'   # TCP_NODELAY (bài 15.4: header và body là HAI lần ghi)
    def do_GET(self):
        u = urlparse(self.path)
        if u.path != '/report':
            self.send_response(404); self.send_header('content-length', '0'); self.end_headers(); return
        n = min(20000, int(parse_qs(u.query).get('n', ['4000'])[0]))
        body = report(n).encode()
        self.send_response(200)
        self.send_header('content-type', 'application/json'); self.send_header('content-length', str(len(body)))
        self.end_headers(); self.wfile.write(body)
    def log_message(self, *a):
        pass

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    print(f'orders.py pid {os.getpid()} on :{port}' + (' (FIX=1: set)' if FIX else ' (list in)'), flush=True)
    ThreadingHTTPServer(('', port), H).serve_forever()
