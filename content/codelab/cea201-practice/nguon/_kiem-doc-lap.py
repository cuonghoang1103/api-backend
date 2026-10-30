#!/usr/bin/env python3
"""CEA201 — tính lại độc lập đáp án trong JSON đã xuất. KHÔNG dùng _sim.mjs: mọi mô phỏng viết lại ở đây bằng Python.
Chạy: python3 content/codelab/cea201-practice/nguon/_kiem-doc-lap.py   (đỏ ⇒ exit 1)"""
import glob, json, math, os, re, struct, sys

GOC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
DE = {}
for f in glob.glob(os.path.join(GOC, '*__*.json')):
    for e in json.load(open(f))['exercises']:
        DE[e['title'].split(' — ')[0]] = e
loi = 0; dem = 0

def khop(ky_vong, dap):
    ds = dap if isinstance(dap, list) else [dap]
    if isinstance(ky_vong, float):
        for x in ds:
            try:
                if abs(float(x) - ky_vong) <= 0.5 * 10 ** (-len((x.split('.') + [''])[1])) + 1e-9: return True
            except ValueError: pass
        return False
    return str(ky_vong) in ds

def bang(ten, chi_so, hang):
    """hang = [[kỳ vọng từng cột cần điền theo thứ tự cột]…]"""
    global loi, dem
    b = DE[ten]['testsJson']['bang'][chi_so]
    cot = [c['ma'] for c in b['cot']]
    if len(b['hang']) != len(hang): print('✗', ten, 'số hàng', len(b['hang']), len(hang)); loi += 1
    for h, kv in zip(b['hang'], hang):
        o = [c for c in cot if f"{h['ma']}.{c}" in b['dapAn']]
        if len(o) != len(kv): print('✗', ten, h['ma'], 'số cột'); loi += 1; continue
        for c, x in zip(o, kv):
            dem += 1
            if not khop(x, b['dapAn'][f"{h['ma']}.{c}"]):
                print('✗', ten, f"b{chi_so} {h['ma']}.{c}: tính lại {x!r}, JSON {b['dapAn'][f'{h['ma']}.{c}']!r}"); loi += 1

def cau(ten, ma, ky_vong):
    global loi, dem
    q = next(c for c in DE[ten]['testsJson']['cauHoi'] if c['ma'] == ma)
    dung = re.sub('<[^>]+>', '', next(o['noiDung'] for o in q['luaChon'] if o['ma'] == q['dapAn'][0]))
    dem += 1
    if str(ky_vong) not in dung: print('✗', ten, ma, f'tính lại {ky_vong!r}, đáp án "{dung}"'); loi += 1

clog = lambda n: math.ceil(math.log2(n))
# ── 10-1
def imm(L, N, R):
    o = clog(N); r = clog(R); k = L - o - 2 * r
    return [o, r, k, -2 ** (k - 1), 2 ** (k - 1) - 1]
bang('Instruction 2', 0, [imm(*x) for x in [(32, 64, 32), (32, 100, 16), (32, 40, 64), (16, 16, 8)]])
# chương trình ngắn nhất: tự viết, tự chạy kiểm giá trị, đếm dòng
def chay_2dc(prog, v):
    m = dict(v)
    for op, d, *s in prog:
        if op == 'MOV': m[d] = m[s[0]]
        else: m[d] = {'ADD': m[d] + m[s[0]], 'SUB': m[d] - m[s[0]], 'MUL': m[d] * m[s[0]]}[op]
    return m['X']
V = dict(A=3, B=5, C=7, D=2)
P1 = [('MOV', 'X', 'A'), ('ADD', 'X', 'B'), ('MOV', 'T', 'C'), ('SUB', 'T', 'D'), ('MUL', 'X', 'T')]
P2 = [('MOV', 'X', 'A'), ('MUL', 'X', 'B'), ('MOV', 'T', 'C'), ('MUL', 'T', 'D'), ('ADD', 'X', 'T')]
P3 = [('MOV', 'X', 'A'), ('ADD', 'X', 'B'), ('MUL', 'X', 'C')]
assert chay_2dc(P1, V) == 8 * 5 and chay_2dc(P2, V) == 15 + 14 and chay_2dc(P3, V) == 8 * 7
bang('Instruction 3', 0, [[3, len(P1), 7, 8], [3, len(P2), 7, 8], [2, len(P3), 4, 6]])
st = []; ra = []
for l in ['PUSH 6', 'PUSH 4', 'ADD', 'PUSH 3', 'MUL', 'PUSH 5', 'SUB']:
    if l[:4] == 'PUSH': st.append(int(l[5:]))
    else:
        b_ = st.pop(); a_ = st.pop(); st.append({'ADD': a_ + b_, 'MUL': a_ * b_, 'SUB': a_ - b_}[l])
    ra.append([st[-1], len(st)])
bang('Instruction 4', 0, ra)
# ── 10-2
bang('Data 2', 0, [[format(x, 'b'), format(x, 'X')] for x in [202, 255, 1000, 4095, 45]])
bang('Data 2', 1, [[int(x, 16)] for x in ['7F', 'A3', '1C0', 'FFFF']])
bang('Data 3', 0, [[format(x & 255, '08b')] for x in [5, -5, 100, -100, -128, 127, -1]])
bang('Data 3', 1, [[int(x, 2) - (256 if x[0] == '1' else 0)] for x in ['11111111', '10000000', '10110100', '01111110', '11000001']])
bang('Data 4', 0, [[2 ** n - 1, -2 ** (n - 1), 2 ** (n - 1) - 1] for n in [4, 8, 16, 32]])
def cong8(a, b):
    t = a + b; w = t & 255; s = w - 256 if w > 127 else w
    return [format(w, '08b'), s, 'Yes' if not -128 <= t <= 127 else 'No']
bang('Data 5', 0, [cong8(*x) for x in [(100, 27), (100, 50), (-100, -28), (-100, -29), (64, 64), (-50, 50)]])
def f32(x):
    u = struct.unpack('>I', struct.pack('>f', x))[0]
    return [u >> 31, (u >> 23) & 255, format(u, '08X')]
bang('Data 6', 0, [f32(x) for x in [-118.625, 0.15625, 1, -0.1, 100, 5.75]])
# ── 11-1
M = {100: 250, 150: 300, 200: 100, 250: 77, 300: 42, 308: 9, 504: 11, 512: 33}; g = M.get
R1, R2, R3 = 200, 300, 4
bang('Addressing 2', 0, [['—', 100], [100, g(100)], [g(100), g(g(100))], ['—', R1], [R1, g(R1)], [8 + R2, g(8 + R2)], [512, g(512)], [100 + R3, g(100 + R3, 0)]])
bang('Addressing 4', 0, [[b_ + i * s + d] for b_, i, s, d in [(1000, 0, 4, 0), (1000, 5, 4, 0), (2000, 7, 8, 16), (4096, 3, 2, 0), (32768, 255, 1, 4)]])
bang('Addressing 3', 0, [[1 + k] for k in [0, 1, 2, 0, 1, 1, 2]])
# ── 12
mem = {0x300: 0x1940, 0x301: 0x5941, 0x302: 0x2941, 0x940: 3, 0x941: 2}; pc = 0x300; ac = 0; ra = []
for _ in range(3):
    ir = mem[pc]; pc += 1; ra.append([format(pc, 'X'), format(ir, '04X'), format(ac, '04X')])
    o, a = ir >> 12, ir & 0xFFF
    if o == 1: ac = mem[a]
    elif o == 5: ac += mem[a]
    else: mem[a] = ac
    ra.append([format(pc, 'X'), format(ir, '04X'), format(ac, '04X')])
bang('Processor 2', 0, ra)
cpi = .45 * 4 + .25 * 5 + .1 * 4 + .2 * 3
bang('Processor 4', 0, [[cpi, 1e9 * cpi * 2e-9], [1.0, 10.0]])
bang('Processor 4', 1, [[10 / (1e9 * cpi * 2e-9)]])
bang('Pipeline 2', 0, [[k + n - 1, n * k, n * k / (k + n - 1)] for k, n in [(5, 10), (5, 1000), (8, 100), (12, 1000000)]])
def ong(ds, fw):
    """ds = [(op, ghi, [đọc])]; mô phỏng theo chu kỳ: trả chu kỳ WB cuối."""
    wb = {}; ex_x = {}; mem_ = {}; prev_id_end = 1; kq = 0; ghi_gan = {}
    for i, (op, w, rs) in enumerate(ds):
        id_ = prev_id_end + 1
        for r in rs:
            if r in ghi_gan:
                j = ghi_gan[r]
                if not fw: id_ = max(id_, wb[j])
                else: id_ = max(id_, (mem_[j] if ds[j][0] == 'lw' else ex_x[j]))
        ex_x[i] = id_ + 1; mem_[i] = id_ + 2; wb[i] = id_ + 3
        prev_id_end = id_; kq = wb[i]
        if w: ghi_gan[w] = i
    return kq
S1 = [('alu', 'r1', ['r2', 'r3']), ('alu', 'r4', ['r1', 'r5']), ('alu', 'r6', ['r1', 'r7']), ('alu', 'r8', ['r1', 'r9'])]
S2 = [('lw', 'r1', ['r2']), ('alu', 'r3', ['r1', 'r4']), ('alu', 'r5', ['r3', 'r6']), ('sw', None, ['r5', 'r2'])]
S3 = [('lw', 'r1', ['r2']), ('lw', 'r3', ['r2']), ('alu', 'r5', ['r1', 'r3']), ('sw', None, ['r5', 'r2'])]
bang('Pipeline 3', 0, [[ong(s, False), ong(s, True)] for s in (S1, S2, S3)])
cau('FE mock A', 'a16', ong([('lw', 'r1', ['r2']), ('alu', 'r3', ['r1', 'r4']), ('alu', 'r5', ['r3', 'r6'])], True))
bang('Pipeline 5', 0, [[1 + f * p * (1 - a), (1 + f * p * (1 - a)) / 2] for f, p, a in [(.2, 3, 0), (.2, 3, .8), (.2, 3, .9), (.15, 5, .95), (.25, 10, .9)]])
# ── 13
def rs(cc, cf, ir, rc, rf):
    a = 1e9 * cc / (cf * 1e9); b = 1e9 * ir * rc / (rf * 1e9)
    return [a, b, max(a, b) / min(a, b)]
bang('RISC 2', 0, [rs(*x) for x in [(4, 2, 1.4, 1.3, 2), (3.5, 2, 1.5, 1.2, 2), (3, 2, 2.4, 2, 2)]])
bang('RISC 3', 0, [[G + 16 * W, G + 24, max(0, D - W + 1)] for G, W, D in [(8, 4, 3), (8, 8, 10), (8, 8, 7), (8, 16, 20)]])
# ── 14
DEP = [[], [0], [0], [1, 2], [], [4], [3, 5], [], [7], [6, 8]]
def phat(w, ooo):
    n = len(DEP); xong = {}; c = 0; ke = 0
    while len(xong) < n:
        c += 1; cho = w
        if ooo:
            for i in range(n):
                if cho and i not in xong and all(d in xong and xong[d] < c for d in DEP[i]): xong[i] = c; cho -= 1
        else:
            while cho and ke < n and all(d in xong and xong[d] < c for d in DEP[ke]): xong[ke] = c; ke += 1; cho -= 1
    return [c, n / c]
bang('ILP 3', 0, [phat(1, False), phat(2, False), phat(2, True), phat(4, False), phat(4, True)])
# ── 15
def mesi(n, ev):
    s = ['I'] * n; ra = []
    for c, op in ev:
        bus = '—'
        if op == 'R' and s[c] == 'I':
            bus = 'BusRd'
            if any(x != 'I' for x in s): s = ['S' if x != 'I' else 'I' for x in s]; s[c] = 'S'
            else: s[c] = 'E'
        elif op == 'W':
            bus = {'I': 'BusRdX', 'S': 'BusUpgr'}.get(s[c], '—')
            s = ['I'] * n; s[c] = 'M'
        ra.append([''.join(s), bus])
    return ra
bang('Multicore 3', 0, mesi(3, [(0, 'R'), (1, 'R'), (2, 'R'), (0, 'W'), (1, 'R'), (2, 'W'), (2, 'R'), (0, 'R')]))
cau('FE mock B', 'b16', mesi(2, [(0, 'R'), (1, 'R'), (0, 'W')])[-1][0])
bang('Multicore 4', 0, [[1 / (1 - f + f / n), 100 / (1 - f + f / n) / n, 1 / (1 - f)] for f, n in [(.9, 4), (.9, 16), (.95, 8), (.95, 64), (.5, 8)]])
# ── 2
bang('History 2', 0, [[int(round(2 ** (t / T)))] for t, T in [(10, 2), (20, 2), (15, 1.5), (30, 2.5), (12, 3)]])
bang('History 2', 1, [[T * math.log2(1000)] for T in [1, 2, 3]])
bang('Performance 2', 0, [[ic * c / (f * 1e9)] for ic, c, f in [(2e9, 1.5, 3), (5e8, 2, 2), (1.2e10, .8, 4), (3e9, 4, 1.5)]])
for i_, mix in enumerate([[(.5, 1), (.3, 2), (.2, 4)], [(.4, 1), (.4, 3), (.2, 5)], [(.6, 1), (.25, 2), (.1, 3), (.05, 8)]]): pass
bang('Performance 3', 0, [[sum(a * b for a, b in m), 2000 / sum(a * b for a, b in m)] for m in [[(.5, 1), (.3, 2), (.2, 4)], [(.4, 1), (.4, 3), (.2, 5)], [(.6, 1), (.25, 2), (.1, 3), (.05, 8)]]])
bang('Performance 4', 0, [[1 / (1 - f + f / s), 1 / (1 - f)] for f, s in [(.5, 2), (.8, 4), (.9, 10), (.95, 20)]])
tA = 1e9 * 1.6 / 2.5e9; tB = .9e9 * 2.4 / 3.2e9
bang('Performance 5', 0, [[tA, 2500 / 1.6], [tB, 3200 / 2.4]])
bang('Performance 5', 1, [[max(tA, tB) / min(tA, tB)]])
# ── 3
bang('Cycle 3', 0, [[12, '101'], [42, '102'], [35, '103'], [35, '104'], [35, '105']])
bang('Cycle 4', 0, [[1 + 1], [1 + 2], [1 + 1], [1], [1 + 2]])
bang('Bus 2', 0, [[w / 8 * c * k] for w, c, k in [(32, 100, 1), (64, 133, 1), (16, 800, 2), (64, 1066, 2)]])
bang('Bus 2', 1, [[f'2^{a}', f'{2 ** (a % 10)} {"MiB" if a < 30 else "GiB"}'] for a in [20, 24, 32, 36]])
bang('Bus 4', 0, [[clog(m * 2 ** 30), l // (w // 8)] for m, w, l in [(4, 32, 64), (8, 64, 256), (16, 32, 1024), (2, 16, 64)]])
# ── cache (mô phỏng riêng)
def cache(addrs, kb, dong, duong, cs):
    bo = dong // duong; T = [[] for _ in range(bo)]; h = ''
    for a in addrs:
        k = a // kb; s = T[k % bo]
        if k in s:
            h += 'H'
            if cs == 'LRU': s.remove(k); s.append(k)
        else:
            h += 'M'
            if len(s) == duong: s.pop(0)
            s.append(k)
    return h
bang('Locality 2', 0, [[h * c + (1 - h) * m] for h, c, m in [(.95, 2, 80), (.9, 1, 100), (.99, 2, 150), (.8, 3, 60)]])
bang('Locality 3', 0, [[t1 + (1 - h1) * (t2 + (1 - h2) * m)] for h1, t1, h2, t2, m in [(.9, 1, .8, 10, 100), (.95, 2, .9, 12, 200), (.85, 1, .5, 8, 120)]])
bang('Locality 3', 1, [[(100 - t) / 98] for t in [10, 5, 3]])
hang = [4 * (16 * i + j) for i in range(16) for j in range(16)]
cot_ = [4 * (16 * i + j) for j in range(16) for i in range(16)]
buoc = [4 * ((k * 8) % 256) for k in range(256)]
bang('Locality 4', 0, [[x.count('H'), x.count('M')] for x in (cache(hang, 32, 16, 1, 'LRU'), cache(cot_, 32, 16, 1, 'LRU'), cache(buoc, 32, 16, 1, 'LRU'))])
def hh(a, c, kb, w):
    bo = c // kb // w; o = clog(kb); i = clog(bo) if bo > 1 else 0
    return [o, i, a - o - i, bo]
bang('Mapping 2', 0, [hh(*x) for x in [(24, 65536, 4, 1), (32, 16384, 64, 1), (32, 32768, 32, 4), (16, 1024, 16, 2), (32, 8192, 64, 128)]])
bang('Mapping 3', 0, [[a & 15, (a >> 4) & 7, format(a >> 7, 'X')] for a in [0x1A2C, 0x0B50, 0x3FF7, 0x1A20, 0xC001]])
REF = [32, 96, 64, 80, 96, 32, 32, 48, 96, 80, 32, 16]
tr = cache(REF, 16, 4, 1, 'LRU')
bang('Mapping 4', 0, [['Hit' if c == 'H' else 'Miss'] for c in tr]); bang('Mapping 4', 1, [[tr.count('M')]])
bang('Mapping 5', 0, [[cache(REF, 16, 4, w, p).count('M')] for w, p in [(1, 'LRU'), (2, 'LRU'), (2, 'FIFO'), (4, 'LRU')]])
bang('Mapping 5', 1, [[cache(REF, 16, 4, 2, 'LRU')]])
def m6(w, d):
    t = 32 - 6 - clog(256 // w); bl = 512 + t + 1 + d; tong = bl * 256; return [t, bl, tong, (tong - 8 * 16384) / (8 * 16384) * 100]
bang('Mapping 6', 0, [m6(1, 0), m6(2, 0), m6(4, 1), m6(4, 0)])
# ── 5
K = 2 ** 10; Mi = 2 ** 20
bang('Memory 2', 0, [[W // w * (B // b), clog(W), clog(w), clog(W) - clog(w)] for W, B, w, b in [(Mi, 8, 256 * K, 8), (4 * Mi, 32, Mi, 8), (16 * Mi, 16, 4 * Mi, 4), (64 * Mi, 64, 16 * Mi, 8)]])
bang('Memory 3', 0, [[r * t * 1e-9 / (p * 1e-3) * 100] for r, p, t in [(8192, 64, 50), (16384, 64, 45), (32768, 32, 40)]])
bang('Memory 3', 1, [[f'2^{clog(c * Mi // b)}', math.ceil(clog(c * Mi // b) / 2)] for c, b in [(16, 4), (64, 8), (256, 16)]])
def rr(m):
    r = 1
    while 2 ** r < m + r + 1: r += 1
    return r
bang('ECC 2', 0, [[rr(m), m + rr(m), rr(m) + 1] for m in [4, 8, 16, 32, 64, 128]])
def ham(d):
    r = rr(len(d)); n = len(d) + r; w = [0] * (n + 1); it = iter(d)
    for i in range(1, n + 1):
        if i & (i - 1): w[i] = int(next(it))
    for p in range(r):
        w[1 << p] = sum(w[i] for i in range(1, n + 1) if i & (1 << p) and i != 1 << p) % 2
    return ''.join(map(str, w[1:]))
bang('ECC 3', 0, [[ham(d)] for d in ['1011', '0110', '1111', '10110010', '01101001']])
def sua(s):
    x = 0
    for i, c in enumerate(s, 1):
        if c == '1': x ^= i
    l = list(s)
    if x: l[x - 1] = '0' if l[x - 1] == '1' else '1'
    return [x, ''.join(c for i, c in enumerate(l, 1) if i & (i - 1))]
bang('ECC 4', 0, [sua(s) for s in ['101001110010', '100001110010', '101101110010', '101001111010', '101001110011']])
# ── 6
bang('Disk 2', 0, [[P * 2 * C * S * B / 1e9, P * 2 * S * B // 1024] for P, C, S, B in [(2, 100000, 500, 512), (4, 200000, 800, 4096), (1, 50000, 256, 512)]])
def dia(s, r, b, t):
    v = 60000 / r; return [v, v / 2, s + v / 2 + b / t * v]
bang('Disk 3', 0, [dia(*x) for x in [(4, 7200, 512, 204800), (9, 5400, 4096, 819200), (3, 15000, 512, 307200), (12, 7200, 65536, 512000)]])
v = 60000 / 7200; seq = 8 + v / 2 + 1048576 / 256000 * v; rnd = 256 * (8 + v / 2 + 4096 / 256000 * v)
bang('Disk 4', 0, [[seq, 1.048576 / seq * 1000], [rnd, 1.048576 / rnd * 1000]]); bang('Disk 4', 1, [[rnd / seq]])
bang('RAID 2', 0, [[4 * u, g_] for u, g_ in [(4, 0), (2, 1), (3, 1), (4, 2), (4, 1)]])
def xo(*a):
    x = 0
    for v_ in a: x ^= v_
    return x
SD = [(178, 108, 225, 31), (165, 60, 15, 129), (201, 17, 96, 130)]
bang('RAID 3', 0, [[xo(*s)] for s in SD])
bang('RAID 3', 1, [[xo(*[x for j, x in enumerate(s) if j != i], xo(*s))] for i, s in enumerate(SD)])
bang('RAID 4', 0, [[n * 150, n * 150 / c] for n, c in [(4, 1), (4, 2), (6, 4), (8, 6), (8, 2)]])
# ── 7–8
bang('I/O 2', 0, [[100.0], [8e6 / 4 * 600 / 2e9 * 100], [8e6 / 4096 * 2000 / 2e9 * 100], [8e6 / 65536 * 2000 / 2e9 * 100]])
reg = lambda a: 'RAM' if a <= 0xBFFF else 'ROM' if a <= 0xEFFF else 'I/O'
bang('I/O 4', 0, [[reg(a)] for a in [0, 0xBFFF, 0xC000, 0xEF00, 0xF000, 0xFF10]]); bang('I/O 4', 1, [[0x10000 - 0xC000]])
def os2(V_, P, Mb, E):
    o = clog(P); return [o, V_ - o, f'2^{Mb - o}', f'2^{V_ - o + clog(E)}']
bang('OS support 2', 0, [os2(*x) for x in [(32, 4096, 30, 4), (32, 8192, 28, 4), (48, 4096, 32, 8), (16, 1024, 20, 2)]])
PT = {0: 5, 1: 2, 3: 7, 5: 0}
bang('OS support 3', 0, [[PT[a // 1024] * 1024 + a % 1024 if a // 1024 in PT else 'Fault'] for a in [100, 1030, 2100, 3071, 4200, 5120, 6144, 5000]])
def loi_trang(c, r, n):
    k = []; d = 0
    for p in r:
        if p in k:
            if c == 'LRU': k.remove(p); k.append(p)
        else:
            d += 1
            if len(k) == n: k.pop(0)
            k.append(p)
    return d
RS = [2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2, 1, 6, 3, 2, 1]
bang('OS support 4', 0, [[loi_trang(c, RS, n)] for c, n in [('FIFO', 3), ('LRU', 3), ('FIFO', 4), ('LRU', 4)]])
cau('FE mock B', 'b15', loi_trang('LRU', [1, 2, 3, 1, 4, 2, 5, 1, 2, 3], 3))
eat = lambda h, t, m: h * (t + m) + (1 - h) * (t + 2 * m)
bang('OS support 5', 0, [[eat(.8, 20, 100)], [eat(.95, 20, 100)], [eat(.98, 10, 80)], [.999 * eat(.9, 20, 100) + .001 * 8e6]])
# ── 9
TT = [(a, b, c) for a in (0, 1) for b in (0, 1) for c in (0, 1)]
bang('Logic 2', 0, [[(a & b) | (1 - c)] for a, b, c in TT]); bang('Logic 2', 1, [[(1 - (a | b)) & c] for a, b, c in TT])
bang('Logic 2', 2, [[a ^ b ^ c] for a, b, c in TT]); bang('Logic 2', 3, [[(a & b) | (b & c) | (a & c)] for a, b, c in TT])
nand = lambda a, b: 1 - (a & b)
for a in (0, 1):
    for b in (0, 1):
        n1 = nand(a, a); assert n1 == 1 - a
        assert nand(nand(a, b), nand(a, b)) == a & b
        assert nand(nand(a, a), nand(b, b)) == a | b
        t = nand(a, b); assert nand(nand(a, t), nand(b, t)) == a ^ b
bang('Logic 4', 0, [[1], [2], [3], [4], [4]])
def l5(a, b, c):
    x = nand(a, b); y = 1 - (x | c); z = y ^ a; return [y, z, z & c]
bang('Logic 5', 0, [l5(*x) for x in [(0, 0, 0), (0, 1, 1), (1, 1, 0), (1, 0, 1), (1, 1, 1)]])
bang('Circuits 2', 0, [[a ^ b ^ c, (a + b + c) // 2] for a, b, c in TT])
def cong4(a, b):
    x, y = int(a, 2), int(b, 2); t = x + y; w = t & 15
    return [format(w, '04b'), t >> 4, int(a[0] == b[0] and format(w, '04b')[0] != a[0])]
bang('Circuits 3', 0, [cong4(*x) for x in [('0110', '0011'), ('1011', '0101'), ('0111', '0001'), ('1000', '1000'), ('1111', '0001')]])
q_ = 0; ra = []
for d in [1, 1, 0, 1, 0, 0, 1]: q_ = d; ra.append([q_])
bang('Circuits 4', 0, ra)
q_ = 0; ra = []
for t in [1, 0, 1, 1, 1, 0, 1]: q_ ^= t; ra.append([q_])
bang('Circuits 4', 1, ra)
q_ = 0; ra = []
for j, k in [(1, 0), (0, 0), (1, 1), (1, 1), (0, 1), (0, 0), (1, 0)]:
    q_ = (1 - q_) if j and k else 1 if j else 0 if k else q_; ra.append([q_])
bang('Circuits 4', 2, ra)
# ── MARIE: máy riêng
def marie(src, ci=None):
    nh = {}; vt = []; loc = 0
    for dong in src:
        l = dong.split('/')[0].strip()
        if not l: continue
        if l.startswith('ORG'): loc = int(l.split()[1], 16); continue
        if ',' in l:
            n, l = l.split(',', 1); nh[n.strip()] = loc; l = l.strip()
        vt.append((loc, l.split())); loc += 1
    m = {}
    MA = dict(Load=1, Store=2, Add=3, Subt=4, Output=6, Halt=7, Skipcond=8, Jump=9, Clear=10)
    for a, t in vt:
        if t[0] == 'Dec': m[a] = int(t[1])
        else: m[a] = (MA[t[0]], (nh.get(t[1], int(t[1], 16) if t[1:] and t[1] not in nh else 0) if t[1:] else 0))
    pc = vt[0][0]; ac = 0; ra = []; buoc_ = 0; vet = []
    while True:
        o, a = m[pc]; pc0 = pc; pc += 1; buoc_ += 1
        if o == 1: ac = m[a]
        elif o == 2: m[a] = ac
        elif o == 3: ac += m[a]
        elif o == 4: ac -= m[a]
        elif o == 6: ra.append(ac)
        elif o == 7: break
        elif o == 8:
            c = a >> 10
            if (c == 0 and ac < 0) or (c == 1 and ac == 0) or (c == 2 and ac > 0): pc += 1
        elif o == 9: pc = a
        vet.append([ac, format(pc, 'X')])
    return ra, buoc_, vet
def nhan(x, c):
    return ['ORG 100', 'Loop, Load Ctr', 'Skipcond 400', 'Jump Body', 'Jump Done', 'Body, Load Sum', 'Add X', 'Store Sum', 'Load Ctr', 'Subt One', 'Store Ctr', 'Jump Loop', 'Done, Load Sum', 'Output', 'Halt 000', f'X, Dec {x}', f'Ctr, Dec {c}', 'Sum, Dec 0', 'One, Dec 1']
bang('MARIE 3', 0, [[marie(nhan(*x))[0][0], marie(nhan(*x))[1]] for x in [(5, 4), (7, 3), (9, 0), (2, 10), (6, 6)]])
dem_ = ['ORG 100', 'Start, Load N', 'Skipcond 800', 'Halt', 'Output', 'Subt One', 'Store N', 'Jump Start', 'N, Dec 3', 'One, Dec 1']
bang('MARIE 4', 0, marie(dem_)[2][:12])
assert marie(dem_)[0] == [3, 2, 1] and marie(dem_)[1] == 21
# ── dự đoán
def hai_bit(s, kd=0):
    c = kd; ra = []
    for x in s:
        p = 'T' if c >= 2 else 'N'; ra.append(p); c = min(3, c + 1) if x == 'T' else max(0, c - 1)
    return ra
s = 'TTTTNTTTTN'; p = hai_bit(s)
bang('Prediction 2', 0, [[a, 'Yes' if a == b else 'No'] for a, b in zip(p, s)]); bang('Prediction 2', 1, [[sum(a != b for a, b in zip(p, s))]])
def mot_bit(s):
    l = 'N'; d = 0
    for x in s: d += l != x; l = x
    return d
bang('Prediction 3', 0, [[s.count('N'), mot_bit(s), sum(a != b for a, b in zip(hai_bit(s), s))] for s in ['TTTTNTTTTNTTTTNTTTTN', 'TNTNTNTNTN', 'TTTTTTTTTT', 'NNNTTTTTTT']])
cau('FE mock B', 'b17', sum(a != b for a, b in zip(hai_bit('TTNTTNTTN'), 'TTNTTNTTN')))
# ── FE mock số
cau('FE mock A', 'a11', f'{3e9 * 1.2 / 2.4e9:.2f}'); cau('FE mock A', 'a12', f'{.96 * 2 + .04 * 100:.2f}')
cau('FE mock A', 'a13', hh(32, 16384, 64, 4)[2]); cau('FE mock A', 'a15', rr(32)); cau('FE mock A', 'a17', format(-37 & 255, '08b'))
cau('FE mock A', 'a19', f'{1 / (.1 + .9 / 8):.2f}'); cau('FE mock A', 'a20', f'{60000 / 5400 / 2:.2f}')
cau('FE mock B', 'b11', int(4 * 133 * 2)); cau('FE mock B', 'b12', cache([0, 16, 32, 48, 0, 64, 16, 80, 32], 16, 4, 1, 'LRU').count('M'))
cau('FE mock B', 'b13', format(struct.unpack('>I', struct.pack('>f', -5.0))[0], '08X')); cau('FE mock B', 'b14', f'{2000 / 1.6:.2f}')
cau('FE mock B', 'b19', f'{8e6 / 4096 * 2000 / 2e9 * 100:.2f}'); cau('FE mock B', 'b20', f'{6 + 3 + 4096 / 200000 * 6:.2f}')
print(f'{"✓" if not loi else "✗"} tính lại độc lập {dem} ô/câu, {loi} lệch')
sys.exit(1 if loi else 0)
