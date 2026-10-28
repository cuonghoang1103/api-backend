# fetch.py — gọi API chậm (slow.js, 100 ms mỗi lời gọi) N lần, ba cách của Python.
#   python3 fetch.py seq N | threads N T | asyncio N
import sys, time, json, asyncio, urllib.request
from concurrent.futures import ThreadPoolExecutor

URL = 'http://localhost:9000/?ms=100'

def call(_=None):
    with urllib.request.urlopen(URL) as r:          # chặn luồng — nhưng NHẢ GIL trong lúc chờ socket
        return r.read().decode()

async def acall():                                  # không thư viện ngoài: tự viết một GET bằng asyncio streams
    reader, writer = await asyncio.open_connection('localhost', 9000)
    writer.write(b'GET /?ms=100 HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n')
    body = (await reader.read()).decode().split('\r\n\r\n', 1)[1]
    writer.close()
    return body

async def run_async(n):
    return await asyncio.gather(*(acall() for _ in range(n)))

if __name__ == '__main__':
    mode, n = sys.argv[1], int(sys.argv[2])
    t = int(sys.argv[3]) if len(sys.argv) > 3 else 0
    t0 = time.perf_counter()
    if mode == 'seq': r = [call() for _ in range(n)]
    elif mode == 'threads':
        with ThreadPoolExecutor(t) as ex: r = list(ex.map(call, range(n)))
    else: r = asyncio.run(run_async(n))
    ms = (time.perf_counter() - t0) * 1000
    peak = json.loads(urllib.request.urlopen('http://localhost:9000/stats').read())['peak']
    print(f'{mode:<7} {"x" + str(t) if t else "   "} calls={n} ok={sum(x.startswith("ok") for x in r)} server saw peak={peak} in flight  {ms:6.0f} ms')
