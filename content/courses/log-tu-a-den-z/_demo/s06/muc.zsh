# 6.1 — năm mức log: cái nào được lưu, cái nào chỉ thấy khi đang stream, và vì sao thông điệp hiện <private>.
for t in debug info default error fault; do log emit --subsystem com.example.loglab --category demo --type $t "muc $t: don hang 1042 da thanh toan"; done
log emit --subsystem com.example.loglab --category demo --public "muc default, co --public: don hang 1042"
sleep 2; log show --last 1m --style compact --predicate 'subsystem == "com.example.loglab"'
log show --last 1m --info --debug --style compact --predicate 'subsystem == "com.example.loglab"'
( log stream --style compact --level debug --predicate 'subsystem == "com.example.loglab"' & P=$!; sleep 2; log emit --subsystem com.example.loglab --category demo --type debug --public "debug: chi thay khi dang stream"; log emit --subsystem com.example.loglab --category demo --type info --public "info: luu trong bo nho"; sleep 2; kill $P )
sleep 1; log show --last 1m --info --debug --style compact --predicate 'subsystem == "com.example.loglab" AND eventMessage CONTAINS "stream"'
