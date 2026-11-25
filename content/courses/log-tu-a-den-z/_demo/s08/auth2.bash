# 8.3 (phần 2) — bẫy "lệnh điều tra tự ghi vào log": sudo ghi cả dòng lệnh vào auth.log, nên grep đếm luôn chính nó.
sudo grep -c 'Failed password' /var/log/auth.log; sudo grep -c 'Failed password' /var/log/auth.log; sudo grep -c 'Failed password' /var/log/auth.log
sudo grep 'Failed password' /var/log/auth.log | tail -1 | cut -c1-150
sudo awk '$1>="2026-11-24T05:15:30" && $1<"2026-11-24T05:15:56"' /var/log/auth.log > a83.log; wc -l < a83.log; grep -c 'Failed password' a83.log; grep -c 'sshd\[[0-9]*\]: Failed password' a83.log
grep 'sshd\[[0-9]*\]: Failed password' a83.log | grep -oE 'from [0-9.]+' | sort | uniq -c | sort -rn
grep 'sshd\[[0-9]*\]: Failed password' a83.log | awk '{for(i=1;i<=NF;i++) if($i=="for"){u=($(i+1)=="invalid")?$(i+3):$(i+1)}; print u}' | sort | uniq -c | sort -rn
grep 'sshd\[[0-9]*\]: Failed password' a83.log | grep -oE 'sshd\[[0-9]+\]' | sort | uniq -c
grep -E 'sshd\[[0-9]+\]: Invalid user' a83.log | cut -c1-120
awk '/sshd\[[0-9]+\]: Failed password/{for(i=1;i<=NF;i++) if($i=="from") sai[$(i+1)]++} /sshd\[[0-9]+\]: Accepted/{for(i=1;i<=NF;i++) if($i=="from"){ip=$(i+1); if(sai[ip]>0) print "ĐỎ: " ip " vào được sau " sai[ip] " lần sai —", substr($0,1,26), $(i-3), $(i-1)}}' a83.log
rm a83.log
