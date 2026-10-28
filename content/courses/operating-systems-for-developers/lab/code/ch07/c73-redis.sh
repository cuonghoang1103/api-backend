# @ chạy trong container redis:7 vứt đi (os-redis7): docker run --rm --label oslab=1 --name os-redis7 --hostname oslab -v "$PWD/ch07":/lab/ch07 -v "$PWD/../moi-truong/phien.sh":/usr/local/bin/phien:ro -w /lab/ch07 redis:7 bash -c "bash /usr/local/bin/phien c73-redis.sh 2>&1"
redis-server --version | cut -c1-40
redis-server --daemonize yes --save '' --rdb-key-save-delay 1 --logfile /tmp/redis.log --dir /tmp
@ sleep 0.5
redis-benchmark -q -t set -n 600000 -r 300000 -d 1024 -P 50 --csv | tail -1
redis-cli DBSIZE
redis-cli INFO memory | grep -E '^used_memory_human'
redis-cli BGSAVE
redis-benchmark -q -t set -n 30000 -r 300000 -d 1024 --csv | tail -1
@ while redis-cli INFO persistence | grep -q 'rdb_bgsave_in_progress:1'; do sleep 0.2; done
redis-cli INFO persistence | grep -E 'rdb_last_bgsave_status|rdb_last_cow_size'
redis-cli INFO stats | grep -E '^latest_fork_usec'
grep -E 'Background saving started|Fork CoW|DB saved on disk|Background saving terminated' /tmp/redis.log | cut -d' ' -f5-
redis-cli CONFIG GET disable-thp
@ redis-cli SHUTDOWN NOSAVE > /dev/null 2>&1; rm -f /tmp/dump.rdb
