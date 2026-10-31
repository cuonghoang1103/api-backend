# Ch1 · 1.5 — máy client gọi sang máy api
nc -w 1 10.10.2.20 4000; echo "exit code $?"
nc -w 1 -v 10.10.2.20 4000
nc -w 1 10.10.2.20 4001
