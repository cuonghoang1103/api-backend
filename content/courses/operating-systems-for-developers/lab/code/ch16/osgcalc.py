"""osgcalc.py — bộ giải bài tập tính toán kiểu đề thi OSG202, in TỪNG BƯỚC như lời giải mẫu (Chương 16).

Mọi đáp án trong bài 16.3–16.5 đều là output của chương trình này (chạy trong ảnh os-lab), và được đối chiếu lần hai
bằng các bộ máy mô phỏng của /os-lab (frontend/src/components/os-lab/engine — xem kiem-engine.mts).

  python3 osgcalc.py sched ALGO "A:0:6:2 B:0:3:4 ..." [q=2] [hi=big|small]
        ALGO = fcfs | sjf | srtf | prio | prio-p | rr       job = TÊN:đến:thời_gian_CPU[:ưu_tiên]
        quy ước: hàng đợi xếp theo thời điểm đến, hoà nhau thì theo thứ tự viết; RR: việc mới đến xếp TRƯỚC việc vừa bị cắt
  python3 osgcalc.py page ALGO FRAMES "7 2 7 3 1 ..."      ALGO = fifo | lru | opt | clock
  python3 osgcalc.py banker "alloc" "max" "avail" [Pi=req]   ma trận viết "0,1,0 2,0,0 ..."
  python3 osgcalc.py banker-x "alloc" "max" "avail-có-x"     tìm x nhỏ nhất để trạng thái an toàn
  python3 osgcalc.py detect "alloc" "request" "avail"        thuật toán PHÁT HIỆN deadlock (ma trận Request)
  python3 osgcalc.py disk ALGO HEAD "98 37 ..." [up|down] [max=199] [ms=6]
        ALGO = fcfs | sstf | scan | look | cscan | clook
  python3 osgcalc.py addr bits=10,10,12 VA                    tách địa chỉ ảo thành các trường (bảng trang nhiều cấp)
  python3 osgcalc.py pagesize VABITS PAGEBYTES PTEBYTES       số trang, số bit offset, cỡ bảng trang một cấp
  python3 osgcalc.py loglen PAGES WORDS_PER_PAGE              độ dài địa chỉ logic
  python3 osgcalc.py seg "base:limit ..." S OFFSET            dịch địa chỉ phân đoạn (có kiểm limit)
  python3 osgcalc.py eat TLB_NS MEM_NS HIT [LEVELS]           thời gian truy cập hiệu dụng có TLB
  python3 osgcalc.py skew RPM SEEK_MS SECTORS                 độ lệch trụ (cylinder skew)
  python3 osgcalc.py victim "trang:nạp:lần_cuối:R:M ..."      FIFO / LRU / NRU / second chance chọn trang nào
  python3 osgcalc.py sem                                      liệt kê MỌI cách xen kẽ của bài semaphore 16.5
"""
import sys
from fractions import Fraction
from itertools import permutations


def frac(x):
    f = Fraction(x)
    return f"{f.numerator}" if f.denominator == 1 else f"{float(f):.2f}"


# ─────────────────────────── lập lịch CPU ───────────────────────────
def parse_jobs(s):
    jobs = []
    for i, tok in enumerate(s.split()):
        p = tok.split(":")
        jobs.append(dict(n=p[0], arr=int(p[1]), burst=int(p[2]), prio=int(p[3]) if len(p) > 3 else 0, idx=i))
    return jobs


def sched(algo, jobs, q=2, hi="small"):
    """Mô phỏng theo từng đơn vị thời gian, trả về danh sách khúc Gantt (tên, từ, tới)."""
    rem = {j["n"]: j["burst"] for j in jobs}
    J = {j["n"]: j for j in jobs}
    better_prio = (lambda a, b: a > b) if hi == "big" else (lambda a, b: a < b)
    t, ready, run, slice_, segs, first = 0, [], None, 0, [], {}
    arrived = set()

    def key(n):  # nhỏ hơn = được chọn trước
        j = J[n]
        if algo in ("sjf", "srtf"):
            return (rem[n], j["arr"], j["idx"])
        if algo in ("prio", "prio-p"):
            return ((-j["prio"] if hi == "big" else j["prio"]), j["arr"], j["idx"])
        return (0,)

    while any(rem.values()):
        for j in sorted(jobs, key=lambda j: (j["arr"], j["idx"])):  # 1) việc mới đến
            if j["arr"] == t and j["n"] not in arrived:
                arrived.add(j["n"]); ready.append(j["n"])
        if run is not None:  # 2) cắt ngang
            cut = False
            if algo == "rr" and slice_ >= q and ready:
                cut = True
            if algo in ("srtf", "prio-p") and ready:
                best = min(ready, key=key)
                if key(best) < key(run):
                    cut = True
            if cut:
                ready.append(run); run = None
        if run is None and ready:  # 3) chọn việc
            n = ready[0] if algo in ("fcfs", "rr") else min(ready, key=key)
            ready.remove(n); run, slice_ = n, 0
            first.setdefault(n, t)
        name = run if run is not None else "idle"
        if segs and segs[-1][0] == name:
            segs[-1][2] = t + 1
        else:
            segs.append([name, t, t + 1])
        if run is not None:  # 4) chạy một đơn vị
            rem[run] -= 1; slice_ += 1
            if rem[run] == 0:
                run = None
        t += 1
    return segs, first


def gantt(segs):
    top = "|" + "|".join(f" {n:^{max(len(n), (b - a) * 2 - 1)}} " for n, a, b in segs) + "|"
    marks, pos = "", 0
    cells = [f" {n:^{max(len(n), (b - a) * 2 - 1)}} " for n, a, b in segs]
    marks = str(segs[0][1])
    for (n, a, b), c in zip(segs, cells):
        pos += len(c) + 1
        marks = marks.ljust(pos) + str(b)
    return top + "\n" + marks


def cmd_sched(args):
    algo, jobs = args[0], parse_jobs(args[1])
    opt = dict(a.split("=") for a in args[2:])
    q, hi = int(opt.get("q", 2)), opt.get("hi", "small")
    segs, first = sched(algo, jobs, q, hi)
    title = {"fcfs": "FCFS", "sjf": "SJF (non-preemptive)", "srtf": "SRTF (preemptive SJF)", "prio": "Priority (non-preemptive)",
             "prio-p": "Priority (preemptive)", "rr": f"Round robin, quantum = {q}"}[algo]
    if algo.startswith("prio"):
        title += ", " + ("bigger number = higher priority" if hi == "big" else "smaller number = higher priority")
    print(f"== {title} ==")
    print(gantt(segs))
    fin = {}
    for n, a, b in segs:
        if n != "idle":
            fin[n] = b
    print(f"{'job':<5}{'arrive':>7}{'burst':>7}{'finish':>8}{'turnaround':>12}{'waiting':>9}{'response':>10}")
    tt = wt = rt = 0
    for j in jobs:
        n = j["n"]; ta = fin[n] - j["arr"]; w = ta - j["burst"]; r = first[n] - j["arr"]
        tt += ta; wt += w; rt += r
        print(f"{n:<5}{j['arr']:>7}{j['burst']:>7}{fin[n]:>8}{ta:>12}{w:>9}{r:>10}")
    k = len(jobs)
    print(f"average turnaround = {tt}/{k} = {frac(Fraction(tt, k))}")
    print(f"average waiting    = {wt}/{k} = {frac(Fraction(wt, k))}")
    print(f"context switches (job→another job) = {sum(1 for x, y in zip(segs, segs[1:]) if x[0] != 'idle' and y[0] != 'idle')}")


# ─────────────────────────── thay trang ───────────────────────────
def page(algo, nf, refs):
    frames, rows, faults = [None] * nf, [], 0
    last, loaded, ref_bit, hand = {}, {}, {}, 0
    for t, r in enumerate(refs):
        hit = r in frames
        victim = None
        if hit:
            ref_bit[r] = 1
        else:
            faults += 1
            if None in frames:
                slot = frames.index(None)
            elif algo == "fifo":
                slot = min(range(nf), key=lambda i: loaded[frames[i]])
            elif algo == "lru":
                slot = min(range(nf), key=lambda i: last[frames[i]])
            elif algo == "opt":
                def nxt(p):
                    for u in range(t + 1, len(refs)):
                        if refs[u] == p:
                            return u
                    return 10 ** 9
                # trang không còn dùng nữa ⇒ đuổi; hoà nhau ⇒ đuổi trang ở khung nhỏ nhất (quy ước giáo trình)
                slot = max(range(nf), key=lambda i: (nxt(frames[i]), -i))
            else:  # clock (second chance)
                while ref_bit.get(frames[hand], 0):
                    ref_bit[frames[hand]] = 0
                    hand = (hand + 1) % nf
                slot = hand
                hand = (hand + 1) % nf
            victim = frames[slot]
            frames[slot] = r
            loaded[r] = t
            ref_bit[r] = 1 if algo != "clock" else 1
        last[r] = t
        rows.append((r, list(frames), hit, victim))
    return rows, faults


def cmd_page(args):
    algo, nf = args[0], int(args[1])
    refs = [int(x) for x in args[2].replace(",", " ").split()]
    rows, faults = page(algo, nf, refs)
    print(f"== {algo.upper()}, {nf} frames, {len(refs)} references ==")
    w = 4
    print("ref    " + "".join(f"{r:>{w}}" for r, *_ in rows))
    for k in range(nf):
        print(f"frame{k} " + "".join(f"{(fr[k] if fr[k] is not None else '-'):>{w}}" for _, fr, _, _ in rows))
    print("fault  " + "".join(f"{('' if h else 'F'):>{w}}" for _, _, h, _ in rows))
    print("out    " + "".join(f"{('' if v is None else v):>{w}}" for *_, v in rows))
    print(f"page faults = {faults}, hits = {len(refs) - faults}, fault rate = {faults}/{len(refs)} = {faults / len(refs):.0%}")


# ─────────────────────────── Banker / phát hiện ───────────────────────────
def mat(s):
    return [[int(x) for x in row.split(",")] for row in s.split()]


def vec(s):
    return [int(x) for x in s.split(",")]


def V(x):
    return "(" + ",".join(str(i) for i in x) + ")"


def safety(alloc, need, avail, names, verb="Need"):
    work, fin, order, step = list(avail), [False] * len(names), [], 0
    moved = True
    while moved:
        moved = False
        for i, n in enumerate(names):
            if not fin[i] and all(a <= b for a, b in zip(need[i], work)):
                step += 1
                new = [w + a for w, a in zip(work, alloc[i])]
                print(f"  step {step}: {n} {verb} {V(need[i])} <= Work {V(work)} -> finishes, Work = {V(new)}")
                work, fin[i], moved = new, True, True
                order.append(n)
    stuck = [n for i, n in enumerate(names) if not fin[i]]
    return order, stuck


def cmd_banker(args):
    alloc, mx, avail = mat(args[0]), mat(args[1]), vec(args[2])
    names = [f"P{i}" for i in range(len(alloc))]
    need = [[m - a for m, a in zip(mr, ar)] for mr, ar in zip(mx, alloc)]
    total = [sum(c) + a for c, a in zip(zip(*alloc), avail)]
    print(f"Total = {V(total)}   Available = {V(avail)}")
    print(f"{'':5}{'Allocation':<12}{'Max':<12}{'Need = Max - Allocation'}")
    for i, n in enumerate(names):
        print(f"{n:<5}{V(alloc[i]):<12}{V(mx[i]):<12}{V(need[i])}")
    order, stuck = safety(alloc, need, avail, names)
    print("  SAFE, safe sequence <" + ", ".join(order) + ">" if not stuck else f"  UNSAFE: {', '.join(stuck)} can never be guaranteed to finish")
    for a in args[3:]:
        who, r = a.split("="); i = names.index(who); req = vec(r)
        print(f"Request {who} {V(req)}:")
        if any(x > y for x, y in zip(req, need[i])):
            print(f"  ERROR: request > Need {V(need[i])} (asks more than it declared)"); continue
        if any(x > y for x, y in zip(req, avail)):
            print(f"  WAIT: request > Available {V(avail)}"); continue
        a2 = [row[:] for row in alloc]; a2[i] = [x + y for x, y in zip(alloc[i], req)]
        n2 = [row[:] for row in need]; n2[i] = [x - y for x, y in zip(need[i], req)]
        av2 = [x - y for x, y in zip(avail, req)]
        print(f"  pretend to grant: Allocation[{who}] = {V(a2[i])}, Need[{who}] = {V(n2[i])}, Available = {V(av2)}")
        order, stuck = safety(a2, n2, av2, names)
        if stuck:
            print(f"  -> unsafe ({', '.join(stuck)} stuck): DENY, {who} must wait")
        else:
            print(f"  -> still safe <{', '.join(order)}>: GRANT")
            alloc, need, avail = a2, n2, av2


def cmd_banker_x(args):
    alloc, mx = mat(args[0]), mat(args[1])
    tmpl = args[2].split(",")
    names = [f"P{i}" for i in range(len(alloc))]
    need = [[m - a for m, a in zip(mr, ar)] for mr, ar in zip(mx, alloc)]
    for x in range(0, 10):
        avail = [x if c == "x" else int(c) for c in tmpl]
        print(f"x = {x}: Available = {V(avail)}")
        order, stuck = safety(alloc, need, avail, names)
        if not stuck:
            print(f"  SAFE <{', '.join(order)}>  => smallest x = {x}")
            return
        print(f"  stuck: {', '.join(stuck)} -> unsafe")


def cmd_detect(args):
    alloc, req, avail = mat(args[0]), mat(args[1]), vec(args[2])
    names = [f"P{i}" for i in range(len(alloc))]
    print(f"{'':5}{'Allocation':<12}{'Request':<12}")
    for i, n in enumerate(names):
        print(f"{n:<5}{V(alloc[i]):<12}{V(req[i]):<12}")
    print(f"Available = {V(avail)}")
    order, stuck = safety(alloc, req, avail, names, verb="Request")
    print("  no deadlock, every process can finish <" + ", ".join(order) + ">" if not stuck else f"  DEADLOCKED: {', '.join(stuck)}")


# ─────────────────────────── lập lịch đĩa ───────────────────────────
def disk(algo, head, reqs, up=True, mx=199):
    pend, order, pos = list(reqs), [head], head
    if algo == "fcfs":
        order += pend
    elif algo == "sstf":
        while pend:
            nxt = min(pend, key=lambda c: (abs(c - pos), c)); pend.remove(nxt); order.append(nxt); pos = nxt
    else:
        hi = sorted(c for c in pend if c >= head); lo = sorted((c for c in pend if c < head), reverse=True)
        if not up:
            hi, lo = sorted((c for c in pend if c <= head), reverse=True), sorted(c for c in pend if c > head)
        edge_a, edge_b = (mx, 0) if up else (0, mx)
        if algo == "look":
            order += hi + lo
        elif algo == "scan":
            order += hi + ([edge_a] if lo else []) + lo
        elif algo == "clook":
            order += hi + (sorted(lo) if up else sorted(lo, reverse=True))
        elif algo == "cscan":
            order += hi + ([edge_a, edge_b] if lo else []) + (sorted(lo) if up else sorted(lo, reverse=True))
    return order


def cmd_disk(args):
    algo, head = args[0], int(args[1])
    reqs = [int(x) for x in args[2].replace(",", " ").split()]
    opt = dict(a.split("=") for a in args[3:] if "=" in a)
    up = "down" not in args[3:]
    mx, ms = int(opt.get("max", 199)), float(opt.get("ms", 0))
    order = disk(algo, head, reqs, up, mx)
    steps = [abs(b - a) for a, b in zip(order, order[1:])]
    name = {"fcfs": "FCFS", "sstf": "SSTF (shortest seek first)", "scan": "SCAN (elevator, to the edge)", "look": "LOOK (elevator, turn at last request)",
            "cscan": "C-SCAN (to the edge, jump back to 0)", "clook": "C-LOOK (jump back to lowest request)"}[algo]
    print(f"== {name}, head at {head}" + ("" if algo in ("fcfs", "sstf") else f", moving {'up' if up else 'down'}") + " ==")
    print("order: " + " -> ".join(map(str, order)))
    print("moves: " + " + ".join(map(str, steps)) + f" = {sum(steps)} cylinders")
    if algo == "cscan":
        print("  (the return jump from the edge to 0 is counted here; some books leave it out - say which rule you use)")
    if ms:
        print(f"seek time = {sum(steps)} x {ms:g} ms = {sum(steps) * ms:g} ms")


# ─────────────────────────── địa chỉ ───────────────────────────
def cmd_addr(args):
    bits = [int(b) for b in args[0].split("=")[1].split(",")]
    va = int(args[1], 0)
    total = sum(bits)
    b = format(va, f"0{total}b")
    names = [f"PT{i + 1}" for i in range(len(bits) - 1)] + ["offset"]
    print(f"VA = {args[1]} = {' '.join(b[i:i + 4] for i in range(0, total, 4))} ({total} bits)")
    pos = 0
    for n, w in zip(names, bits):
        part = b[pos:pos + w]; pos += w
        print(f"  {n:<7} {w:>2} bits  {part:>{max(bits)}}  = {int(part, 2)}" + (f"  (0x{int(part, 2):x})" if n == "offset" else ""))
    print(f"page size = 2^{bits[-1]} = {2 ** bits[-1]} bytes ({2 ** bits[-1] // 1024} KiB)" if bits[-1] >= 10 else f"page size = 2^{bits[-1]} bytes")
    print(f"pages in the address space = 2^{total - bits[-1]} = {2 ** (total - bits[-1]):,}")


def cmd_pagesize(args):
    va, pg, pte = int(args[0]), int(args[1]), int(args[2])
    off = pg.bit_length() - 1
    n = 2 ** (va - off)
    print(f"offset bits = log2({pg}) = {off}; page-number bits = {va} - {off} = {va - off}")
    print(f"pages = 2^{va - off} = {n:,}; single-level table = {n:,} x {pte} B = {n * pte:,} B = {n * pte / 2**20:g} MiB")


def cmd_loglen(args):
    p, w = int(args[0]), int(args[1])
    a, b = p.bit_length() - 1, w.bit_length() - 1
    print(f"page number: log2({p}) = {a} bits; offset: log2({w}) = {b} bits; logical address = {a} + {b} = {a + b} bits")


def cmd_seg(args):
    table = [tuple(int(x) for x in t.split(":")) for t in args[0].split()]
    s, off = int(args[1]), int(args[2])
    base, limit = table[s]
    print(f"segment {s}: base = {base}, limit = {limit}; offset = {off}")
    if off >= limit:
        print(f"  {off} >= {limit} -> TRAP: segmentation fault (addressing error)")
    else:
        print(f"  {off} < {limit} -> physical = {base} + {off} = {base + off}")


def cmd_eat(args):
    tlb, mem, hit = float(args[0]), float(args[1]), Fraction(args[2])
    lv = int(args[3]) if len(args) > 3 else 1
    h = tlb + mem
    m = tlb + mem * (lv + 1)
    eat = hit * Fraction(h) + (1 - hit) * Fraction(m)
    print(f"hit:  TLB {tlb:g} + memory {mem:g} = {h:g} ns")
    print(f"miss: TLB {tlb:g} + {lv} page-table read(s) {mem:g} x {lv} + memory {mem:g} = {m:g} ns")
    print(f"EAT = {float(hit):g} x {h:g} + {float(1 - hit):g} x {m:g} = {float(eat):g} ns (vs {mem:g} ns with no paging)")


def cmd_skew(args):
    rpm, seek, sec = float(args[0]), Fraction(args[1]), int(args[2])
    rot = Fraction(60_000) / Fraction(rpm).limit_denominator()
    per = rot / sec
    import math
    k = math.ceil(seek / per)
    print(f"one rotation = 60000 / {rpm:g} = {float(rot):.4f} ms; one sector passes in {float(rot):.4f} / {sec} = {float(per):.5f} ms")
    print(f"sectors passing during a {float(seek):g} ms track-to-track seek = {float(seek / per):.2f} -> skew = {k} sectors")


# ─────────────────────────── chọn trang nạn nhân từ bảng Loaded / Last-ref / R / M ───────────────────────────
def cmd_victim(args):
    rows = [tuple(int(x) for x in r.split(":")) for r in args[0].split()]  # trang:nạp:lần_cuối:R:M
    print(f"{'page':>4}{'loaded':>8}{'last ref':>10}{'R':>3}{'M':>3}   NRU class")
    for p, ld, lr, r, m in rows:
        print(f"{p:>4}{ld:>8}{lr:>10}{r:>3}{m:>3}   {2 * r + m}")
    fifo = min(rows, key=lambda x: x[1]); lru = min(rows, key=lambda x: x[2])
    nru = min(rows, key=lambda x: (2 * x[3] + x[4], x[0]))
    q = sorted(rows, key=lambda x: x[1]); sc = None
    for x in q:  # second chance: đi theo thứ tự nạp; R = 1 thì xoá R, đưa xuống cuối hàng
        if x[3] == 0:
            sc = x; break
    sc = sc or q[0]
    print(f"FIFO evicts page {fifo[0]} (loaded earliest, t={fifo[1]})")
    print(f"LRU evicts page {lru[0]} (last used earliest, t={lru[2]})")
    print(f"NRU evicts page {nru[0]} (lowest class {2 * nru[3] + nru[4]} = R{nru[3]}M{nru[4]})")
    print(f"Second chance evicts page {sc[0]} (oldest with R = 0)")


# ─────────────────────────── semaphore: liệt kê mọi xen kẽ ───────────────────────────
def cmd_sem(args):
    # Bài 16.5: S = 1, T = 0.  P1: wait(S); print A; signal(T); print B;      P2: wait(T); print C; signal(S);   P3: wait(S); print D;
    progs = {
        "P1": [("wait", "S"), ("print", "A"), ("signal", "T"), ("print", "B")],
        "P2": [("wait", "T"), ("print", "C"), ("signal", "S")],
        "P3": [("wait", "S"), ("print", "D")],
    }
    outs, stuck = set(), set()

    def go(pc, sem, out):
        moved = False
        for p, code in progs.items():
            i = pc[p]
            if i == len(code):
                continue
            op, x = code[i]
            if op == "wait" and sem[x] == 0:
                continue
            moved = True
            s2 = dict(sem); o2 = out
            if op == "wait":
                s2[x] -= 1
            elif op == "signal":
                s2[x] += 1
            else:
                o2 = out + x
            go({**pc, p: i + 1}, s2, o2)
        if not moved:
            (outs if all(pc[p] == len(c) for p, c in progs.items()) else stuck).add(out)

    go({p: 0 for p in progs}, {"S": 1, "T": 0}, "")
    print("S = 1, T = 0")
    for p, code in progs.items():
        print(f"  {p}: " + "; ".join(f"{op}({x})" if op != "print" else f"print {x}" for op, x in code))
    print(f"complete outputs ({len(outs)}): " + ", ".join(sorted(outs)))
    print(f"runs that block forever ({len(stuck)}): " + (", ".join(sorted(stuck)) if stuck else "none"))
    for cand in ["ACBD", "ABCD", "DACB", "ACDB", "CABD", "ABDC"]:
        print(f"  {cand}: {'possible' if cand in outs else 'impossible'}")


CMDS = {"sched": cmd_sched, "page": cmd_page, "banker": cmd_banker, "banker-x": cmd_banker_x, "detect": cmd_detect, "disk": cmd_disk,
        "addr": cmd_addr, "pagesize": cmd_pagesize, "loglen": cmd_loglen, "seg": cmd_seg, "eat": cmd_eat, "skew": cmd_skew, "sem": cmd_sem, "victim": cmd_victim}

if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in CMDS:
        print(__doc__); sys.exit(2)
    CMDS[sys.argv[1]](sys.argv[2:])
