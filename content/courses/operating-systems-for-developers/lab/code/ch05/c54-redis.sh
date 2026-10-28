# @ chạy trong container redis:7 (os-redis5) — xem lab/README
@ redis-cli() { command redis-cli --no-raw "$@"; }
redis-cli SET lock:seat:A7 worker-A NX PX 2000
redis-cli SET lock:seat:A7 worker-B NX PX 2000
sleep 2.5; redis-cli PTTL lock:seat:A7
redis-cli SET lock:seat:A7 worker-B NX PX 2000
redis-cli DEL lock:seat:A7
redis-cli SET lock:seat:A7 worker-C NX PX 2000
redis-cli GET lock:seat:A7
redis-cli EVAL "$(cat unlock.lua)" 1 lock:seat:A7 worker-A
redis-cli GET lock:seat:A7
redis-cli EVAL "$(cat unlock.lua)" 1 lock:seat:A7 worker-C
redis-cli INCR fence:seat:A7
redis-cli INCR fence:seat:A7
redis-cli EVAL "$(cat fenced-write.lua)" 1 seat:A7 2 booked-by-B
redis-cli EVAL "$(cat fenced-write.lua)" 1 seat:A7 1 booked-by-A
redis-cli GET seat:A7
