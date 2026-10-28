# repl.py — count page faults for FIFO, LRU, Clock and OPT on a reference string (the exam exercise).
#   python3 repl.py FRAMES PAGE PAGE PAGE ...
import sys

def run(refs, n, algo):
    frames, faults, last, ref_bit, hand = [], 0, {}, {}, 0
    for t, p in enumerate(refs):
        last[p] = t
        if p in frames:
            ref_bit[p] = 1
            continue
        faults += 1
        if len(frames) < n:
            frames.append(p)
        elif algo == 'FIFO':                       # oldest arrival leaves
            frames.pop(0); frames.append(p)
        elif algo == 'LRU':                        # least recently used leaves
            victim = min(frames, key=lambda q: last[q]); frames[frames.index(victim)] = p
        elif algo == 'Clock':                      # second chance: skip pages whose bit is set (and clear it)
            while ref_bit.get(frames[hand]):
                ref_bit[frames[hand]] = 0; hand = (hand + 1) % n
            frames[hand] = p; hand = (hand + 1) % n
        elif algo == 'OPT':                        # the page needed farthest in the future leaves
            future = refs[t + 1:]
            victim = max(frames, key=lambda q: future.index(q) if q in future else len(refs))
            frames[frames.index(victim)] = p
        ref_bit[p] = 1                             # just used (Clock: a newly loaded page gets its bit set too)
    return faults

n, refs = int(sys.argv[1]), [int(x) for x in sys.argv[2:]]
print(f"{len(refs)} references, {n} frames: " + "   ".join(f"{a} {run(refs, n, a)}" for a in ('FIFO', 'LRU', 'Clock', 'OPT')))
