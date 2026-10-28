# giai/hybrid.py — LỜI GIẢI bài tự viết 4.4: một chương trình asyncio làm HAI loại việc đúng chỗ của nó.
#  (1) I/O: 100 lời gọi API chậm, tối đa 10 cùng lúc nhờ asyncio.Semaphore — server phải thấy peak = 10.
#  (2) CPU: đếm số nguyên tố ở 4 TIẾN TRÌNH (ProcessPoolExecutor + run_in_executor) — trong lúc đó vòng lặp sự kiện
#      vẫn rảnh: một "nhịp tim" 100 ms vẫn đập đều (nếu đếm ngay trên vòng lặp, nhịp tim sẽ tắt).
import asyncio, time, json, urllib.request
from concurrent.futures import ProcessPoolExecutor

def count_primes(lo_hi):
    lo, hi = lo_hi
    def ok(n):
        if n < 2: return False
        if n % 2 == 0: return n == 2
        d = 3
        while d * d <= n:
            if n % d == 0: return False
            d += 2
        return True
    return sum(ok(n) for n in range(lo, hi))

async def get(sem):
    async with sem:                                   # tối đa 10 lời gọi đang bay
        r, w = await asyncio.open_connection('localhost', 9000)
        w.write(b'GET /?ms=100 HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n')
        body = await r.read(); w.close()
        return body.endswith(b'ok\n')

async def heartbeat(beats):
    while True:
        await asyncio.sleep(0.1); beats.append(time.perf_counter())

async def main():
    t0 = time.perf_counter()
    sem = asyncio.Semaphore(10)
    ok = sum(await asyncio.gather(*(get(sem) for _ in range(100))))
    peak = json.loads(urllib.request.urlopen('http://localhost:9000/stats').read())['peak']
    print(f'I/O : 100 calls, ok={ok}, server peak={peak} in flight  {(time.perf_counter() - t0) * 1000:5.0f} ms')
    beats = []; hb = asyncio.create_task(heartbeat(beats))
    t1 = time.perf_counter()
    loop = asyncio.get_running_loop()
    with ProcessPoolExecutor(4) as pool:
        parts = await asyncio.gather(*(loop.run_in_executor(pool, count_primes, (i * 500_000, (i + 1) * 500_000)) for i in range(4)))
    hb.cancel()
    gaps = [b - a for a, b in zip(beats, beats[1:])]
    print(f'CPU : primes below 2,000,000 = {sum(parts)} in 4 processes  {(time.perf_counter() - t1) * 1000:5.0f} ms;'
          f' heartbeat ticked {len(beats)} times, longest gap {max(gaps) * 1000:.0f} ms')

if __name__ == '__main__':
    asyncio.run(main())
