#!/usr/bin/env python3
"""use.py — bảng USE (Utilization · Saturation · Errors) cho CHÍNH container đang đứng, đo trong N giây (bài 15.1).
Mỗi tài nguyên ba câu hỏi: bận bao nhiêu %? có việc phải XẾP HÀNG chờ nó không? nó có báo lỗi không?
Đọc số của cgroup (/sys/fs/cgroup — chỉ container này) và /proc (đĩa/mạng là của cả máy ảo).
   python3 use.py [giây]"""
import os, sys, time, glob
N = float(sys.argv[1]) if len(sys.argv) > 1 else 3
CG = '/sys/fs/cgroup'
rd = lambda p: open(p).read()
def kv(p):
    out = {}
    for line in rd(p).splitlines():
        k, *v = line.split()
        if v: out[k] = int(v[0])
    return out
def psi(name):                                   # "some avg10=12.34 …" ⇒ 12.34 (% thời gian có ít nhất một tác vụ phải chờ)
    try: return float(rd(f'{CG}/{name}.pressure').split()[1].split('=')[1])
    except Exception: return float('nan')
def tasks():                                     # (pid, tid, comm) ⇒ utime+stime (tick)
    out = {}
    for st in glob.glob('/proc/[0-9]*/task/[0-9]*/stat'):
        try:
            s = rd(st); comm = s[s.index('(') + 1:s.rindex(')')]; f = s[s.rindex(')') + 2:].split()
            pid, tid = st.split('/')[2], st.split('/')[4]
            out[(pid, tid, comm)] = int(f[11]) + int(f[12])
        except Exception: pass
    return out
def disk():
    for line in rd('/proc/diskstats').splitlines():
        f = line.split()
        if f[2] == 'vda': return int(f[3]), int(f[7]), int(f[12]), int(f[13])   # reads, writes, io_ticks ms, weighted ms
def pairs(path, tag):                            # /proc/net/snmp, /proc/net/netstat: một dòng tên cột rồi một dòng số
    L = [l.split() for l in rd(path).splitlines() if l.startswith(tag)]
    return dict(zip(L[0][1:], map(int, L[1][1:])))
def net():
    tcp, ext = pairs('/proc/net/snmp', 'Tcp:'), pairs('/proc/net/netstat', 'TcpExt:')
    b = sum(int(f[1]) + int(f[9]) for f in (l.replace(':', ' ').split() for l in rd('/proc/net/dev').splitlines()[2:]))
    return {'retrans': tcp['RetransSegs'], 'inerrs': tcp['InErrs'], 'overflows': ext['ListenOverflows'], 'bytes': b}

c0, t0, d0, n0, e0 = kv(f'{CG}/cpu.stat'), tasks(), disk(), net(), kv(f'{CG}/memory.events')
time.sleep(N)
c1, t1, d1, n1, e1 = kv(f'{CG}/cpu.stat'), tasks(), disk(), net(), kv(f'{CG}/memory.events')
hz = os.sysconf('SC_CLK_TCK')
q, per = rd(f'{CG}/cpu.max').split()
limit = os.cpu_count() if q == 'max' else int(q) / int(per)
used = (c1['usage_usec'] - c0['usage_usec']) / 1e6 / N
periods = c1.get('nr_periods', 0) - c0.get('nr_periods', 0); thr = c1.get('nr_throttled', 0) - c0.get('nr_throttled', 0)
busy = sorted(((t1[k] - t0.get(k, t1[k])) / hz / N, k) for k in t1)[-1]
mem, mmax = int(rd(f'{CG}/memory.current')), rd(f'{CG}/memory.max').strip()
mmax_b = None if mmax == 'max' else int(mmax)
dr, dw, dt, dq = (b - a for a, b in zip(d0, d1))
nofile = max((len(os.listdir(f'/proc/{p}/fd')), p) for p in os.listdir('/proc') if p.isdigit() and os.path.exists(f'/proc/{p}/fd'))
soft = [l.split()[3] for l in rd(f'/proc/{nofile[1]}/limits').splitlines() if l.startswith('Max open files')][0]
pc, pm = rd(f'{CG}/pids.current').strip(), rd(f'{CG}/pids.max').strip()
rows = [
    ('CPU (container)', f'{used:.2f} of {limit:g} CPUs = {100 * used / limit:.0f}%',
     f'throttled {thr}/{periods} periods; PSI cpu some {psi("cpu"):.1f}%', '-'),
    ('CPU (one thread)', f'{busy[1][2]} pid {busy[1][0]}: {100 * busy[0]:.0f}% of one core', f'one thread can use at most 1 of the {limit:g} CPUs', '-'),
    ('memory', f'{mem >> 20} MiB of {"no limit" if mmax_b is None else f"{mmax_b >> 20} MiB"}' + ('' if mmax_b is None else f' = {100 * mem / mmax_b:.0f}%'),
     f'PSI memory some {psi("memory"):.1f}%', f'oom_kill {e1.get("oom_kill", 0)}, max hits {e1.get("max", 0) - e0.get("max", 0)}'),
    ('disk vda (whole VM)', f'busy {100 * dt / (N * 1000):.0f}% of the time',
     f'avg queue {dq / (N * 1000):.1f}; PSI io some {psi("io"):.1f}%', '-'),
    ('network (this netns)', f'{(n1["bytes"] - n0["bytes"]) / N / 1e6:.1f} MB/s', f'listen overflows {n1["overflows"] - n0["overflows"]}',
     f'retrans {n1["retrans"] - n0["retrans"]}, in errors {n1["inerrs"] - n0["inerrs"]}'),
    ('fds (max process)', f'pid {nofile[1]}: {nofile[0]} open of {soft}', '-', 'EMFILE: only in app logs'),
    ('pids', f'{pc} of {pm}', '-', '-'),
]
w = [max(len(r[i]) for r in rows + [('resource', 'utilization', 'saturation', 'errors')]) for i in range(4)]
print(f'USE over {N:g} s — cgroup {open("/proc/self/cgroup").read().strip()}')
for r in [('resource', 'utilization', 'saturation', 'errors')] + rows:
    print('  '.join(c.ljust(w[i]) for i, c in enumerate(r)).rstrip())
