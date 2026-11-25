# 6.1 — log của ứng dụng tự viết: Swift Logger (subsystem/category/privacy) và logger trong shell.
swiftc -O -o shopmac shopmac.swift && ./shopmac khach@example.com
sleep 1; log show --last 1m --info --debug --style compact --predicate 'subsystem == "com.example.shopmac"'
logger -t backup-dem "Sao luu xong: 1,2 GB, 41 s"
sleep 1; log show --last 30s --style syslog --predicate 'process == "logger"'
