# 14.3 · nft-nha: rớt mạng THẬT — router nhà mất Internet 45 giây (dung-output-ch14b.sh cắt ở nft-rnha 2 giây sau dòng date đầu tiên)
date +%T; pgrep -a -x ssh | cut -c1-40
sleep 100
grep "exited" /tmp/autossh.log | head -1 | cut -d' ' -f2,4-
grep -c "restarting ssh" /tmp/autossh.log
tail -2 /tmp/autossh.log | cut -d' ' -f2,4-
date +%T; pgrep -a -x ssh | cut -c1-40
