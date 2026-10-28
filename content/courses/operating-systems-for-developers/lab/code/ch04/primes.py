# primes.py — cùng bài đếm số nguyên tố, ba cách của Python.
#   python3 primes.py seq 1 N | threads T N | procs T N
# threads = threading (T luồng, mỗi luồng lấy khúc từ một queue) · procs = multiprocessing (T tiến trình, Pool.map theo khúc)
import sys, time, threading, queue, multiprocessing as mp

CHUNK = 10_000

def is_prime(n):
    if n < 2: return False
    if n % 2 == 0: return n == 2
    d = 3
    while d * d <= n:
        if n % d == 0: return False
        d += 2
    return True

def count_range(lo_hi):
    lo, hi = lo_hi
    return sum(1 for n in range(lo, hi) if is_prime(n))

def chunks(n):
    return [(lo, min(lo + CHUNK, n)) for lo in range(0, n, CHUNK)]

def with_threads(t, n):
    q, total, lock = queue.Queue(), [0], threading.Lock()
    for c in chunks(n): q.put(c)
    def worker():
        while True:
            try: c = q.get_nowait()
            except queue.Empty: return
            r = count_range(c)
            with lock: total[0] += r
    ths = [threading.Thread(target=worker) for _ in range(t)]
    for th in ths: th.start()
    for th in ths: th.join()
    return total[0]

def with_procs(t, n):
    with mp.Pool(t) as pool:
        return sum(pool.map(count_range, chunks(n)))

if __name__ == '__main__':
    mode, t, n = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
    t0 = time.perf_counter()
    r = {'seq': lambda: count_range((0, n)), 'threads': lambda: with_threads(t, n), 'procs': lambda: with_procs(t, n)}[mode]()
    print(f'{mode:<7} x{t:<2} N={n} primes={r}  {(time.perf_counter() - t0) * 1000:6.0f} ms')
