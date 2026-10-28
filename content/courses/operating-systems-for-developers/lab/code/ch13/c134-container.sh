# @ Chương 13 · bài 13.4 — container nhìn từ bảo mật (container MẶC ĐỊNH). Chạy: docker run --rm --label oslab=1 --hostname oslab -v "$PWD/ch13":/lab/ch13 -w /lab/ch13 os-lab bash -c "phien c134-container.sh 2>&1"
# @ EN: A container is just a process. The kernel drops most of root's power before it runs. ||| VI: Container chỉ là một tiến trình. Nhân tước bớt phần lớn quyền của root trước khi nó chạy.
# @ EN: The bounding set CapBnd is NOT all-ones: dangerous capabilities are already removed. ||| VI: Tập giới hạn CapBnd KHÔNG toàn số 1: các capability nguy hiểm đã bị gỡ sẵn.
grep -E '^(CapBnd|CapEff|Seccomp|NoNewPrivs):' /proc/self/status
# @ EN: What those bits mean, decoded; a seccomp filter (2) is already loaded by Docker. ||| VI: Các bit đó nghĩa là gì, đã giải mã; một bộ lọc seccomp (2) đã được Docker nạp sẵn.
capsh --decode=$(grep CapBnd /proc/self/status | awk '{print $2}') | sed 's/^.*=//' | tr ',' '\n' | wc -l
echo "dropped vs a full set: dangerous caps like CAP_SYS_ADMIN are absent"
capsh --decode=0x000001ffffffffff | sed 's/^.*=//' | tr ',' '\n' | wc -l
# @ EN: Only a handful of device nodes are exposed — not the host's disks. ||| VI: Chỉ một nhúm device node được lộ ra — không có đĩa của máy chủ.
ls /dev | wc -l; ls /dev | tr '\n' ' '; echo
# @ EN: no_new_privs = a one-way switch: after it is set, no exec can gain privilege, so setuid is neutralised. ||| VI: no_new_privs = một công tắc một chiều: bật rồi thì không exec nào lấy thêm quyền được, nên setuid bị vô hiệu.
install -d -m 755 /srv/lab; cp greetsuid.c /srv/lab/; gcc -O2 /srv/lab/greetsuid.c -o /srv/lab/greetsuid 2>/dev/null
chown root:root /srv/lab/greetsuid; chmod 4755 /srv/lab/greetsuid
echo "== setuid works normally =="; runuser -u dev -- /srv/lab/greetsuid
echo "== same binary under no-new-privs (what Docker --security-opt no-new-privileges and systemd NoNewPrivileges= set) =="
runuser -u dev -- setpriv --no-new-privs /srv/lab/greetsuid
# @ EN: The docker socket is NOT mounted here — and must never be in a normal container. ||| VI: Socket docker KHÔNG được gắn vào đây — và không bao giờ được gắn vào một container thường.
ls -l /var/run/docker.sock 2>&1
@ rm -rf /srv/lab
