# 8.4 (phần 4) — giải mã bản ghi thô bằng tay: số syscall và PROCTITLE dạng hex (ausearch -i làm hộ việc này)
ausyscall 257; ausyscall 59
echo 7375646F0067726570002D45006B65793D22736861646F7722002F7661722F6C6F672F61756469742F61756469742E6C6F67 | xxd -r -p | tr '\0' ' '; echo
sudo ausearch --input-logs -k shadow --format text 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i=="using") print $(i+1)}' | sort | uniq -c | sort -rn
