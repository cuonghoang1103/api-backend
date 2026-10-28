# race.py — GIL KHÔNG phải khoá cho dữ liệu của bạn. 4 luồng, mỗi luồng nạp tiền 1 000 000 lần vào cùng một tài khoản.
#   python3 race.py inline   balance += 1                      (một dòng)
#   python3 race.py split    v = get_balance(); set_balance(v + 1)   (đọc — gọi hàm — ghi: kiểu code thật)
#   python3 race.py lock     như split nhưng bọc trong with lock:
import sys, threading

balance = 0
lock = threading.Lock()
def get_balance(): return balance
def set_balance(v):
    global balance
    balance = v

def deposit(mode, n):
    global balance
    for _ in range(n):
        if mode == 'inline':
            balance += 1
        elif mode == 'split':
            v = get_balance()
            set_balance(v + 1)
        else:
            with lock:
                v = get_balance()
                set_balance(v + 1)

mode, T, N = sys.argv[1], 4, 1_000_000
ths = [threading.Thread(target=deposit, args=(mode, N)) for _ in range(T)]
for t in ths: t.start()
for t in ths: t.join()
print(f'{mode:<6} expected {T * N:,}  got {balance:,}  lost {T * N - balance:,}')
