# @ Chương 11 · bài 11.7 — gõ TỪ MÁY CHỦ (bash lab/code/ch09/phien-host.sh lab/code/ch11/c117-host.sh, chạy ở thư mục
# @ content/courses/operating-systems-for-developers): hồ sơ seccomp mặc định của Docker so với seccomp=unconfined, một hồ sơ
# @ tự viết, và chế độ strict. Mọi container --label oslab=1 --rm. Hồ sơ mặc định đọc từ kho github.com/moby/profiles.
docker run --rm --label oslab=1 os-lab grep -E '^Seccomp' /proc/self/status
docker run --rm --label oslab=1 --security-opt seccomp=unconfined os-lab grep -E '^Seccomp' /proc/self/status
docker run --rm --label oslab=1 os-lab unshare --user id -u; echo "exit=$?"
docker run --rm --label oslab=1 --security-opt seccomp=unconfined os-lab unshare --user id -u; echo "exit=$?"
docker run --rm --label oslab=1 os-lab bash -c 'strace -f -qq -e trace=perf_event_open perf stat -e task-clock true 2>&1 | grep -oE "^perf_event_open.{0,20}|= -1 E.*$" | head -2'
docker run --rm --label oslab=1 -v "$PWD/lab/code/ch11":/lab/ch11 os-lab bash -c 'curl -s https://raw.githubusercontent.com/moby/profiles/main/seccomp/default.json -o /tmp/d.json && python3 /lab/ch11/docker-profile.py /tmp/d.json'
cat lab/code/ch11/deny-mkdir.json
docker run --rm --label oslab=1 --security-opt seccomp="$PWD/lab/code/ch11/deny-mkdir.json" os-lab gnumkdir /tmp/uploads; echo "exit=$?"
docker run --rm --label oslab=1 -v "$PWD/lab/code/ch11":/lab/ch11 os-lab bash -c 'gcc -O2 /lab/ch11/strict.c -o /tmp/strict && /tmp/strict; echo "exit=$?"'
docker run --rm --label oslab=1 --security-opt seccomp=unconfined -v "$PWD/lab/code/ch11":/lab/ch11 os-lab bash -c 'gcc -O2 /lab/ch11/strict.c -o /tmp/strict && /tmp/strict; echo "exit=$?"'
