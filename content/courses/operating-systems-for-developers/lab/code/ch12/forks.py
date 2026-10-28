# forks.py — fork until the kernel says no; each child just sleeps 3 s.
import os, time
for i in range(1, 31):
    try:
        if os.fork() == 0:
            time.sleep(3); os._exit(0)
    except OSError as e:
        print(f"forked {i - 1} children, fork #{i} failed: {e}")
        break
print("pids.current =", open("/sys/fs/cgroup/box/pids.current").read().strip())
