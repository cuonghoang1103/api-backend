# mr.py — map-reduce trên MỘT máy: đếm từ trong một file văn bản, bốn cách. Cùng kết quả, khác nhau ở chỗ dữ liệu đi đâu.
#   python3 mr.py gen FILE LINES          tạo file thử (từ ngẫu nhiên, hạt giống cố định)
#   python3 mr.py one FILE                một tiến trình: Counter
#   python3 mr.py lines1 FILE T           Pool.map trên TỪNG DÒNG (chunksize=1): mỗi dòng gửi sang worker qua pipe
#   python3 mr.py lines FILE T            Pool.map trên từng dòng nhưng chunksize=10 000
#   python3 mr.py ranges FILE T           chỉ gửi (offset, độ dài): worker TỰ đọc khúc file của mình — map; cộng Counter — reduce
import os, sys, time, random
from collections import Counter
from multiprocessing import Pool

def count_line(line): return Counter(line.split())
def count_lines(lines): return Counter(w for l in lines for w in l.split())

def count_range(arg):                       # MAP: khúc [start, end) của file, căn theo ranh giới dòng
    path, start, end = arg
    with open(path, 'rb') as f:
        if start: f.seek(start - 1); f.readline()   # bỏ nửa dòng đầu (nó thuộc khúc trước)
        c = Counter()
        while f.tell() < end:
            line = f.readline()
            if not line: break
            c.update(line.split())
        return c

def ranges(path, t):
    size = os.path.getsize(path)
    return [(path, size * i // t, size * (i + 1) // t) for i in range(t)]

if __name__ == '__main__':
    mode, path = sys.argv[1], sys.argv[2]
    if mode == 'gen':
        rnd = random.Random(42)
        vocab = [f'w{i}' for i in range(5000)]
        weights = [1 / (i + 1) for i in range(5000)]          # kiểu Zipf: vài từ rất phổ biến
        with open(path, 'w') as f:
            for _ in range(int(sys.argv[3])):
                f.write(' '.join(rnd.choices(vocab, weights, k=8)) + '\n')
        print(f'{path}: {os.path.getsize(path) / 1e6:.1f} MB'); sys.exit()
    t = int(sys.argv[3]) if len(sys.argv) > 3 else 1
    t0 = time.perf_counter()
    if mode == 'one':
        with open(path, 'rb') as f: total = count_lines(f)
    else:
        with Pool(t) as pool:
            if mode == 'ranges':
                parts = pool.map(count_range, ranges(path, t))
            else:
                with open(path, 'rb') as f: lines = f.readlines()
                if mode == 'lines1': parts = pool.map(count_line, lines, chunksize=1)
                else: parts = pool.map(count_lines, [lines[i:i + 10_000] for i in range(0, len(lines), 10_000)])
        total = Counter()
        for p in parts: total.update(p)       # REDUCE: cộng các Counter
    ms = (time.perf_counter() - t0) * 1000
    top = ' '.join(f'{w.decode()}={n}' for w, n in total.most_common(3))
    print(f'{mode:<7} x{t:<2} words={sum(total.values()):,}  top: {top}  {ms:6.0f} ms')
