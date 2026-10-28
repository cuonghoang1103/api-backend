# @ chạy TỪ MÁY CHỦ: bash ch02/phien-host.sh ch02/c22-zombie.sh — mọi container có --label oslab=1, tên os-c22z*
docker run -d --name os-c22z --label oslab=1 --pids-limit 60 -v "$PWD/ch02":/lab/ch02 os-lab node /lab/ch02/chup-anh.js > /dev/null; sleep 1.5
docker exec os-c22z ps -eo pid,ppid,stat,comm | head -6
docker exec os-c22z sh -c "ps -eo stat | grep -c '^Z'"
docker exec os-c22z top -b -n 1 | sed -n 2p
docker exec os-c22z sh -c 'Z=$(ps -eo pid,stat | awk "\$2 ~ /^Z/ {print \$1; exit}"); kill -9 $Z; sleep 0.2; ps -o pid,ppid,stat,comm -p $Z'
sleep 8; docker logs os-c22z 2>&1 | tail -4
docker exec os-c22z cat /sys/fs/cgroup/pids.current; echo "exit=$?"
@ docker rm -f os-c22z > /dev/null
docker run -d --name os-c22z-init --label oslab=1 --init --pids-limit 60 -v "$PWD/ch02":/lab/ch02 os-lab node /lab/ch02/chup-anh.js > /dev/null; sleep 6
docker exec os-c22z-init ps -eo pid,ppid,stat,comm | head -4
docker exec os-c22z-init sh -c "ps -eo stat | grep -c '^Z'; cat /sys/fs/cgroup/pids.current"
docker logs os-c22z-init 2>&1 | tail -1
@ docker rm -f os-c22z-init > /dev/null
