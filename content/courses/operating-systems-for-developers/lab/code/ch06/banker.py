"""banker.py — thuật toán Banker (tránh deadlock) và thuật toán phát hiện deadlock, in TỪNG BƯỚC như bài thi.

  python3 banker.py safety                     kiểm trạng thái hiện tại có an toàn không (ví dụ kinh điển 5 tiến trình, A/B/C)
  python3 banker.py request P1 1,0,2 P0 0,2,0  xét lần lượt từng yêu cầu: cấp nếu trạng thái sau đó vẫn an toàn
  python3 banker.py detect                     thuật toán PHÁT HIỆN (ma trận Request thay cho Need)
  python3 banker.py detect P2 0,0,1            … sau khi P2 xin thêm một C
  python3 banker.py pool 2 2                   pool 2 kết nối, mỗi request cần tối đa 2 — Banker cho mấy request chạy?
"""
import sys

R = "ABC"
ALLOC = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]]
MAX = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]]
AVAIL = [3, 3, 2]


def v(x):
    return "(" + ",".join(str(i) for i in x) + ")"


def le(a, b):
    return all(x <= y for x, y in zip(a, b))


def table(alloc, maxm, need, avail, names, label="Need"):
    w = 3 * len(avail) + 4
    cols = ["Allocation"] + (["Max"] if maxm else []) + [label]
    print("     " + "".join(f"{c:<{w}}" for c in cols).rstrip())
    for i, n in enumerate(names):
        cells = [v(alloc[i])] + ([v(maxm[i])] if maxm else []) + [v(need[i])]
        print(f"{n:<5}" + "".join(f"{c:<{w}}" for c in cells).rstrip())
    print(f"Available = {v(avail)}")


def safe(alloc, need, avail, names, verb="needs"):
    """Thuật toán an toàn: quét lần lượt; ai có Need <= Work thì cho chạy xong và trả hết tài nguyên."""
    work, finish = list(avail), [False] * len(names)
    order, step = [], 0
    progress = True
    while progress:
        progress = False
        for i, n in enumerate(names):
            if not finish[i] and le(need[i], work):
                step += 1
                new = [w + a for w, a in zip(work, alloc[i])]
                print(f"  step {step}: {n} {verb} {v(need[i])} <= Work {v(work)} -> runs, returns {v(alloc[i])}, Work = {v(new)}")
                work, finish[i], progress = new, True, True
                order.append(n)
    stuck = [n for i, n in enumerate(names) if not finish[i]]
    return order, stuck, work


def show_safety(alloc, need, avail, names):
    order, stuck, _ = safe(alloc, need, avail, names)
    if stuck:
        print(f"  nobody else fits: no order is guaranteed to finish {', '.join(stuck)} -> UNSAFE (deadlock possible)")
    else:
        print(f"  SAFE, safe sequence <{', '.join(order)}>")
    return not stuck


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "safety"
    names = [f"P{i}" for i in range(5)]
    alloc = [r[:] for r in ALLOC]
    need = [[m - a for m, a in zip(MAX[i], ALLOC[i])] for i in range(5)]
    avail = AVAIL[:]
    if cmd == "safety":
        table(alloc, MAX, need, avail, names)
        show_safety(alloc, need, avail, names)
    elif cmd == "request":
        args = sys.argv[2:]
        for k in range(0, len(args), 2):
            i, req = int(args[k][1:]), [int(x) for x in args[k + 1].split(",")]
            print(f"== {args[k]} requests {v(req)}; Need {v(need[i])}, Available {v(avail)}")
            if not le(req, need[i]):
                print("  ERROR: asks for more than its declared maximum -> reject"); continue
            if not le(req, avail):
                print("  not enough available right now -> WAIT"); continue
            a2 = [x - r for x, r in zip(avail, req)]
            al2 = [r[:] for r in alloc]; al2[i] = [x + r for x, r in zip(alloc[i], req)]
            n2 = [r[:] for r in need]; n2[i] = [x - r for x, r in zip(need[i], req)]
            print(f"  pretend to grant: Available {v(a2)}, {args[k]} Allocation {v(al2[i])}, Need {v(n2[i])}; run safety:")
            if show_safety(al2, n2, a2, names):
                print(f"  -> GRANT"); avail, alloc, need = a2, al2, n2
            else:
                print(f"  -> DENY, {args[k]} waits (state rolled back)")
    elif cmd == "detect":
        # Ví dụ phát hiện kinh điển: A=7, B=2, C=6. Không có Max — chỉ có yêu cầu HIỆN TẠI.
        alloc = [[0, 1, 0], [2, 0, 0], [3, 0, 3], [2, 1, 1], [0, 0, 2]]
        req = [[0, 0, 0], [2, 0, 2], [0, 0, 0], [1, 0, 0], [0, 0, 2]]
        avail = [0, 0, 0]
        if len(sys.argv) > 3:
            i = int(sys.argv[2][1:]); req[i] = [x + int(y) for x, y in zip(req[i], sys.argv[3].split(","))]
        table(alloc, None, req, avail, names, label="Request")
        order, stuck, _ = safe(alloc, req, avail, names, verb="requests")
        if stuck:
            print(f"  DEADLOCKED: {', '.join(stuck)} (each waits for something only another stuck process holds)")
        else:
            print(f"  no deadlock, all can finish: <{', '.join(order)}>")
    elif cmd == "pool":
        size, per = int(sys.argv[2]), int(sys.argv[3])
        print(f"pool of {size} connections; each request may hold up to {per} at once")
        for k in range(1, size + 1):
            names = [f"req{j}" for j in range(1, k + 1)]
            # trường hợp xấu nhất Banker phải tính: mỗi request đang giữ 1 và còn có thể xin thêm per-1
            alloc = [[1] for _ in names]; need = [[per - 1] for _ in names]; avail = [size - k]
            print(f"-- {k} request(s) each holding 1 connection, Available ({size - k}):")
            order, stuck, _ = safe(alloc, need, avail, names)
            print(f"  {'SAFE' if not stuck else 'UNSAFE: every request waits for a connection only another request can free'}")


if __name__ == "__main__":
    main()
