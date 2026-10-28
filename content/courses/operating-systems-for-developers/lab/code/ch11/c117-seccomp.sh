# @ Chương 11 · bài 11.7 — seccomp thực hành: tự gắn bộ lọc (BPF viết tay) ⇒ EPERM / ENOSYS / SIGSYS (exit 159); chuyện
# @ clone3 + glibc; chế độ strict (bị Docker chặn, chạy được khi seccomp=unconfined — xem kịch bản host); danh sách cho
# @ phép rút từ strace -c của máy chủ Node. Mọi thứ trong container vứt đi, file thử trong /tmp của container.
# @ docker run --rm --label oslab=1 --name os-c117 --hostname oslab -v "$PWD/ch11":/lab/ch11 -w /lab/ch11 os-lab bash -c "phien c117-seccomp.sh 2>&1"
grep -E '^(Seccomp|Seccomp_filters|NoNewPrivs):' /proc/self/status
gcc -O2 -Wall sandbox.c -o sandbox && ./sandbox eperm:mkdirat gnumkdir /tmp/uploads; echo "exit=$?"
strace -f -qq -e trace=prctl,mkdirat ./sandbox eperm:mkdirat gnumkdir /tmp/uploads 2>&1 | grep -v '^gnumkdir'
./sandbox eperm:mkdirat grep -E '^(Seccomp|Seccomp_filters|NoNewPrivs):' /proc/self/status
./sandbox kill:mkdirat gnumkdir /tmp/uploads; echo "exit=$?"
./sandbox eperm:socket curl -sS http://example.com/; echo "exit=$?"
./sandbox eperm:clone3 python3 -c 'import threading; t = threading.Thread(target=print, args=("thread ok",)); t.start(); t.join()' 2>&1 | tail -1
./sandbox eperm:clone3 java -version 2>&1 | head -2 | cut -c1-120
./sandbox enosys:clone3 python3 -c 'import threading; t = threading.Thread(target=print, args=("thread ok",)); t.start(); t.join()'
strace -f -qq -e trace=clone,clone3 ./sandbox enosys:clone3 python3 -c 'import threading; threading.Thread(target=len, args=("",)).start()' 2>&1 | sed -E 's/\(.*\) +=/(…) =/'
gcc -O2 -Wall strict.c -o strict && ./strict; echo "exit=$?"
echo '#include <asm/unistd.h>' | gcc -dM -E - | awk '$2 ~ /^__NR_[a-z]/ && $3 ~ /^[0-9]+$/ {print "{\"" substr($2,6) "\", " $3 "},"}' > nrtable.h; wc -l < nrtable.h
gcc -O2 -Wall allow.c -o allow
strace -f -qq -c -o node.sc node server.js & ST=$!; sleep 1.5
curl -s -o /dev/null "http://127.0.0.1:3000/[1-100]"; pkill -f '^node server.js'; wait $ST
awk 'NR>2 && $NF != "total" && $NF !~ /^-/ {print $NF}' node.sc | sort > names.txt; wc -l < names.txt; tr '\n' ' ' < names.txt; echo
./allow node.sc node server.js & sleep 1.5
curl -s http://127.0.0.1:3000/; pkill -f '^node server.js'; sleep 0.5
timeout 8 ./allow node.sc node -e 'require("fs").mkdirSync("/tmp/uploads")' 2>&1 | grep -E '^Error|allow:'; echo "exit=${PIPESTATUS[0]}"
timeout 8 strace -f -qq -o hang.txt ./allow node.sc node -e 'require("fs").mkdirSync("/tmp/uploads")' > /dev/null 2>&1; grep -m3 'exit resumed' hang.txt
echo exit >> node.sc; timeout 8 ./allow node.sc node -e 'require("fs").mkdirSync("/tmp/uploads")' 2>&1 | grep -E '^Error|allow:'; echo "exit=${PIPESTATUS[0]}"
