# @ Chương 13 · bài 13.3 — leo thang đặc quyền. Chạy: docker run --rm --label oslab=1 --hostname oslab --sysctl net.ipv4.ip_unprivileged_port_start=1024 -v "$PWD/ch13":/lab/ch13 -w /lab/ch13 os-lab bash -c "phien c133-dacquyen.sh 2>&1"
# @ EN: The mounted lab dir is nosuid+no_xattr, so build the privileged demos on the container's own fs. ||| VI: Thư mục lab gắn vào là nosuid+no_xattr, nên dựng các demo đặc quyền trên fs riêng của container.
install -d -m 755 /srv/lab /srv/evil
cp greetsuid.c greetexec.c greetfix.c bind80.c euidcmd.c /srv/lab/
# @ EN: ---- 1. A setuid-root helper ---- ||| VI: ---- 1. Một helper setuid-root ----
gcc -O2 /srv/lab/greetsuid.c -o /srv/lab/greetsuid 2>/dev/null
gcc -O2 /srv/lab/greetexec.c -o /srv/lab/greetexec
gcc -O2 /srv/lab/greetfix.c  -o /srv/lab/greetfix
gcc -O2 /srv/lab/euidcmd.c   -o /srv/evil/hostname
chown root:root /srv/lab/greet*; chmod 4755 /srv/lab/greet*
ls -l /srv/lab/greetsuid
# @ EN: Normal use by the unprivileged user "dev": the setuid bit makes euid 0. ||| VI: Dùng bình thường bởi người dùng không đặc quyền "dev": bit setuid khiến euid thành 0.
runuser -u dev -- /srv/lab/greetsuid
# @ EN: Attacker puts a fake "hostname" first in PATH. With system(), /bin/sh is dash, which drops privilege when euid != uid — so here the planted binary runs as 1001, not root. A safety net you must never rely on. ||| VI: Kẻ tấn công đặt "hostname" giả đứng đầu PATH. Với system(), /bin/sh là dash — nó bỏ đặc quyền khi euid != uid — nên ở đây tệp cài vào chạy với uid 1001, không phải root. Một lưới đỡ KHÔNG được dựa vào.
runuser -u dev -- env PATH=/srv/evil /srv/lab/greetsuid
# @ EN: Exec a bare command NAME instead: execlp searches PATH with NO shell to drop privilege — the planted binary now runs as root (euid 0). ||| VI: Đổi sang exec một TÊN lệnh trần: execlp tìm PATH mà KHÔNG qua shell nào để bỏ đặc quyền — tệp cài vào giờ chạy với quyền root (euid 0).
runuser -u dev -- env PATH=/srv/evil /srv/lab/greetexec
# @ EN: The fix: drop privilege, then execle an absolute path with an empty environment — no shell, no PATH search. ||| VI: Bản sửa: bỏ đặc quyền, rồi execle một đường dẫn tuyệt đối với môi trường rỗng — không shell, không tìm PATH.
runuser -u dev -- env PATH=/srv/evil /srv/lab/greetfix
# @ EN: ---- 2. One capability instead of full root ---- ||| VI: ---- 2. Một capability thay cho toàn quyền root ----
gcc -O2 /srv/lab/bind80.c -o /srv/lab/bind80
# @ EN: Binding port 80 as dev fails — it is a privileged port. ||| VI: Bind cổng 80 với tư cách dev thất bại — đó là cổng đặc quyền.
runuser -u dev -- /srv/lab/bind80
# @ EN: Grant EXACTLY CAP_NET_BIND_SERVICE to the file; getcap shows it. ||| VI: Cấp ĐÚNG CAP_NET_BIND_SERVICE cho tệp; getcap hiện ra.
setcap cap_net_bind_service=+ep /srv/lab/bind80; getcap /srv/lab/bind80
# @ EN: Now dev binds :80 with no root at all — one privilege, not all of them. ||| VI: Giờ dev bind :80 mà không cần root — một đặc quyền, không phải tất cả.
runuser -u dev -- /srv/lab/bind80   # now with the capability
# @ EN: The capabilities a process actually holds live in /proc/<pid>/status; capsh decodes them. ||| VI: Capability một tiến trình đang giữ nằm ở /proc/<pid>/status; capsh giải mã.
grep -E '^Cap(Prm|Eff):' /proc/self/status
capsh --decode=$(grep CapEff /proc/self/status | awk '{print $2}') | sed 's/^.*=//' | tr ',' '\n' | head -n 5
# @ EN: ---- 3. Misconfigured permissions ---- ||| VI: ---- 3. Quyền bị cấu hình sai ----
install -d -m 755 /srv/app; echo 'DB_PASSWORD=prod-secret' > /srv/app/config.env
chmod 666 /srv/app/config.env            # world-writable: anyone can rewrite your config
ls -l /srv/app/config.env
# @ EN: Find world-writable files under a tree — a standard audit. ||| VI: Tìm các tệp ai-cũng-ghi-được trong một cây — một phép rà soát chuẩn.
find /srv/app -type f -perm -0002
# @ EN: List the setuid-root binaries present (each is attack surface to review). ||| VI: Liệt kê các tệp setuid-root đang có (mỗi cái là bề mặt tấn công cần soát).
find /usr/bin -perm -4000 -type f 2>/dev/null | head -n 6
# @ EN: ---- 4. TOCTOU: check-then-use race ---- ||| VI: ---- 4. TOCTOU: cuộc đua kiểm-rồi-dùng ----
cd /lab/ch13; gcc -O2 toctou.c -o /tmp/toctou
echo 'public quarterly report' > report.txt; echo 'TOP SECRET salaries' > secret.txt; ln -sf report.txt link
# @ EN: The link points at the public file; the vulnerable path opens it. ||| VI: Liên kết trỏ tới tệp công khai; đường dễ bị khai thác mở nó.
/tmp/toctou vuln link
# @ EN: An attacker repoints the symlink between the check and the open; the vulnerable path follows it to the secret. ||| VI: Kẻ tấn công trỏ lại liên kết giữa lúc kiểm và lúc mở; đường dễ bị khai thác theo nó tới tệp bí mật.
ln -sf secret.txt link; /tmp/toctou vuln link
# @ EN: The fix opens with O_NOFOLLOW: a symlink at the final component is refused outright (ELOOP). ||| VI: Bản sửa mở với O_NOFOLLOW: một symlink ở thành phần cuối bị từ chối thẳng (ELOOP).
/tmp/toctou fixed link; echo "exit $?"
# @ EN: ---- 5. Secrets leaking through /proc ---- ||| VI: ---- 5. Bí mật rò qua /proc ----
gcc -O2 sleeper.c -o /tmp/api-server
DB_PASSWORD=prod-db-s3cret sleep 30 & SP=$!
sleep 0.4
# @ EN: /proc/<pid>/environ is mode 0400, owner-only — but a process running as the SAME user reads it. ||| VI: /proc/<pid>/environ là mode 0400, chỉ chủ sở hữu — nhưng một tiến trình chạy dưới CÙNG người dùng đọc được.
ls -l /proc/$SP/environ; tr '\0' '\n' < /proc/$SP/environ | grep DB_PASSWORD
kill $SP 2>/dev/null
# @ EN: A secret passed as an ARGUMENT is worse: /proc/<pid>/cmdline and ps show it to EVERY user. ||| VI: Bí mật truyền làm THAM SỐ còn tệ hơn: /proc/<pid>/cmdline và ps cho MỌI người dùng thấy.
/tmp/api-server --token=AKIA-leaky-prod-token & AP=$!
sleep 0.4
tr '\0' ' ' < /proc/$AP/cmdline; echo
runuser -u dev -- ps -eo pid,user,args | grep -- '--token' | grep -v grep
kill $AP 2>/dev/null
@ wait 2>/dev/null
@ rm -f report.txt secret.txt link /tmp/toctou /tmp/api-server; rm -rf /srv/lab /srv/evil /srv/app
