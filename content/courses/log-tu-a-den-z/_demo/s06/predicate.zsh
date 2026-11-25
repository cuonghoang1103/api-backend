# 6.4 — predicate: trường, toán tử, AND/OR/NOT, [c][d], dạng viết tắt; công thức hay dùng.
log show --last 15m --style compact --predicate 'subsystem == "com.example.shopmac" AND category == "db"'
log show --last 15m --style compact --predicate 'subsystem == "com.example.shopmac" AND messageType >= error'
log show --last 15m --style compact --predicate 'p=shopmac AND type>=error'
log show --last 15m --style compact --predicate 'subsystem == "com.example.shopmac" AND eventMessage CONTAINS "csdl"'
log show --last 15m --style compact --predicate 'subsystem == "com.example.shopmac" AND eventMessage CONTAINS[c] "csdl"'
log show --last 15m --style compact --predicate 'subsystem == "com.example.shopmac" AND eventMessage CONTAINS[cd] "het thoi gian"'
log show --last 15m --style compact --predicate 'eventMessage CONTAINS "csdl"' | cut -c1-230
log show --last 15m --style compact --predicate 'subsystem BEGINSWITH "com.example." AND NOT category IN {"network", "demo"}'
log show --last 15m --style compact --predicate 'subsystem == "com.example.shopmac" AND eventMessage MATCHES ".* [0-9]+ s .*"'
log show --last 15m --style compact --predicate 'senderImagePath ENDSWITH "libswiftCore.dylib" AND eventMessage CONTAINS "Fatal error"' | cut -c1-200
log show --last 15m --style compact --predicate 'subsystem = "com.example.shopmac" and category = db'
log show --last 15m --style compact --predicate 'subsystem == com.example.shopmac'
time (log show --last 3h --style compact --predicate 'eventMessage CONTAINS "screenIsLocked"' | wc -l)
time (log show --last 3h --style compact --predicate 'process == "loginwindow" AND eventMessage CONTAINS "screenIsLocked"' | wc -l)
