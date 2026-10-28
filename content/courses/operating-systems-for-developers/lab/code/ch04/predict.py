# predict.py S n1 n2 … — speedup LÝ THUYẾT khi phần tuần tự là S% (để đặt cạnh số đo của sweep.sh).
#   Amdahl (bài toán cố định):        S(n) = 1 / (s + (1 − s)/n)
#   Gustafson (bài toán lớn theo n):  S(n) = s + (1 − s)·n
import sys
s = float(sys.argv[1]) / 100
print(f"{'cores':>5} {'Amdahl':>8} {'Gustafson':>10}")
for n in map(int, sys.argv[2:]):
    print(f'{n:5d} {1 / (s + (1 - s) / n):7.2f}x {s + (1 - s) * n:9.2f}x')
