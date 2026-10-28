#!/usr/bin/env python3
"""offcpu2folded.py — đổi output nhiều dòng của offcputime (libbpf-tools: mỗi khối = các khung ngăn xếp NHÂN, dòng
"-  comm (tid)", rồi số µs bị chặn) thành folded stacks "comm;khung-gốc;…;khung-lá µs" cho folded.py / flamegraph.pl.
Bỏ các khung của chính công cụ đo (bpf_prog_*, bpf_trace_run*, __bpf_trace_*) và các khung lá chung của mọi lần ngủ
(__schedule, schedule…) để lá còn lại nói LÝ DO chờ: futex (khoá), nanosleep, đọc đĩa, chờ mạng.   offcputime-libbpf -p PID 3 | python3 offcpu2folded.py"""
import sys, re, collections
acc, frames = collections.Counter(), []
for line in sys.stdin:
    s = line.strip()
    if not s: frames = []; continue
    m = re.match(r'^-\s+(\S+) \(\d+\)$', s)
    if m: comm = m.group(1); continue
    if s.isdigit():
        if frames: acc[';'.join([comm] + frames[::-1])] += int(s)
        frames = []; continue
    if s.startswith('Tracing '): continue                 # dòng tiêu đề của công cụ
    if re.match(r'^(bpf_prog_|bpf_trace_run|__bpf_trace_)', s): continue
    if not frames and re.match(r'^(__schedule|schedule|schedule_hrtimeout_range|__switch_to|finish_task_switch)', s): continue  # lá chung của mọi lần ngủ
    frames.append(s)
for k, v in acc.items(): print(k, v)
