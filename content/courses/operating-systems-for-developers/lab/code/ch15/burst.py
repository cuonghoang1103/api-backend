#!/usr/bin/env python3
"""burst.py — mở N kết nối TCP CÙNG LÚC tới 127.0.0.1:CỔNG, đo thời gian connect() của từng cái, giữ chúng H giây (bài 15.7).
In: bao nhiêu kết nối được, bao nhiêu lỗi, thời gian connect p50/p99/max và số kết nối phải chờ ≥ 1 s (SYN bị bỏ, gửi lại).
   python3 burst.py CỔNG N [giữ-giây]"""
import asyncio, sys, time
port, n, hold = int(sys.argv[1]), int(sys.argv[2]), float(sys.argv[3]) if len(sys.argv) > 3 else 0
async def one():
    t = time.perf_counter()
    try:
        r, w = await asyncio.wait_for(asyncio.open_connection('127.0.0.1', port), 15)
        dt = time.perf_counter() - t
        if hold: await asyncio.sleep(hold)
        w.close()
        return dt, None
    except Exception as e:
        return time.perf_counter() - t, type(e).__name__
async def main():
    res = await asyncio.gather(*[one() for _ in range(n)])
    ok = sorted(d for d, e in res if e is None); errs = {}
    for d, e in res:
        if e: errs[e] = errs.get(e, 0) + 1
    p = lambda q: ok[min(len(ok) - 1, int(-(-q * len(ok) // 100)) - 1)] * 1000 if ok else float('nan')
    print(f'{n} connects: {len(ok)} ok, errors {errs or 0}; connect time p50 {p(50):.1f} ms, p99 {p(99):.0f} ms, '
          f'max {max(ok) * 1000 if ok else 0:.0f} ms; waited >= 1 s: {sum(1 for d in ok if d >= 1)}')
asyncio.run(main())
