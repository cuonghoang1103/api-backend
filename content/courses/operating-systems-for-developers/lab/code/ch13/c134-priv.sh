# @ Chương 13 · bài 13.4 — vì sao --privileged nguy hiểm (CONTAINER ĐẶC QUYỀN, chỉ container vứt đi). Chạy: docker run --rm --label oslab=1 --hostname oslab --privileged os-lab bash -c "phien c134-priv.sh 2>&1"
# @ EN: With --privileged the kernel gives the container EVERY capability and no seccomp filter. ||| VI: Với --privileged, nhân trao container MỌI capability và không có bộ lọc seccomp.
grep -E '^(CapBnd|CapEff|Seccomp|NoNewPrivs):' /proc/self/status
# @ EN: CapBnd is now all-ones — every capability, including CAP_SYS_ADMIN. ||| VI: CapBnd giờ toàn số 1 — mọi capability, kể cả CAP_SYS_ADMIN.
capsh --decode=$(grep CapBnd /proc/self/status | awk '{print $2}') | sed 's/^.*=//' | tr ',' '\n' | wc -l
# @ EN: And the HOST's block devices are visible inside the container — the disk behind the whole machine. ||| VI: Và các thiết bị khối của MÁY CHỦ hiện ra trong container — chính cái đĩa đứng sau cả máy.
ls /dev | wc -l
ls /dev | grep -E '^(vd|sd|nvme|mem|kmsg)' | tr '\n' ' '; echo
# @ EN: That combination — full caps + host devices + no seccomp — is why a --privileged container is effectively root on the host. We only READ the flags here; no escape is demonstrated. ||| VI: Tổ hợp đó — đủ caps + thiết bị máy chủ + không seccomp — là lý do một container --privileged gần như là root trên máy chủ. Ở đây ta chỉ ĐỌC các cờ; không trình diễn cách thoát nào.
echo "lesson: never run application workloads with --privileged"
