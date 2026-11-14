# 14.3 · nft-win: ssh -L — kéo cổng 6379 của VPS về cổng 16379 trên laptop
nc -vz -w 3 vps.example 6379
ssh -f -N -L 16379:127.0.0.1:6379 vps
ss -4tlnp | grep 16379
redis-cli -p 16379 ping
redis-cli -p 16379 get diem:SE12345
