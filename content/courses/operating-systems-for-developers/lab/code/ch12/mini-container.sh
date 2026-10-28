#!/bin/sh
# mini-container.sh NAME CMD... — a container in ~40 lines of shell (lesson 12.4). Run as root, in a throwaway lab.
#   image  : the Alpine root filesystem (a tar, exported with: docker export $(docker create alpine) > alpine.tar)
#   layers : overlayfs — the tar is the read-only lower layer, writes go to this box's upper layer
#   limits : a cgroup v2 child with memory.max / cpu.max / pids.max
#   fences : new UTS, IPC, network, PID, mount and cgroup namespaces, then pivot_root into the overlay
IMAGE=${IMAGE:-/opt/c12/alpine-3.24.tar}
NAME=$1; shift
B=/var/lib/mini/$NAME                      # everything for this box lives here
CG=/sys/fs/cgroup/mini-$NAME

# 1. layers: unpack the image once, then stack a private writable layer on top of it
#    (an upper layer cannot live on another overlay — our lab's own root — so /var/lib/mini is a tmpfs;
#     Docker keeps the same directories on ext4/xfs under /var/lib/docker)
mkdir -p /var/lib/mini; mountpoint -q /var/lib/mini || mount -t tmpfs -o size=256m mini /var/lib/mini
mkdir -p /var/lib/mini/image $B/upper $B/work $B/rootfs
[ -e /var/lib/mini/image/bin/busybox ] || tar -xf "$IMAGE" -C /var/lib/mini/image
mount -t overlay overlay -o lowerdir=/var/lib/mini/image,upperdir=$B/upper,workdir=$B/work $B/rootfs

# 2. limits: a cgroup for the box (the parent must delegate the controllers first)
mkdir -p $CG
echo "${MEM:-64M}" > $CG/memory.max; echo 0 > $CG/memory.swap.max
echo "${CPU:-50000 100000}" > $CG/cpu.max
echo "${PIDS:-32}" > $CG/pids.max

# 3. fences: join the cgroup, then unshare every namespace and pivot_root into the overlay
sh -c 'echo $$ > '$CG'/cgroup.procs; exec "$@"' sh \
  unshare --uts --ipc --net --pid --mount --cgroup --fork --kill-child \
  /bin/sh -c '
    hostname "$0"
    mount --make-rprivate /                          # our mounts must not leak back to the host
    cd "$1" && mkdir -p .old && busybox pivot_root . .old && cd /
    mount -t proc proc /proc                         # a /proc that shows only our PID namespace
    mount -t sysfs -o ro sysfs /sys
    mount -t cgroup2 -o ro cgroup2 /sys/fs/cgroup    # our own cgroup appears as "/"
    mount -t tmpfs -o mode=755,size=64k dev /dev     # a tiny /dev, not the host one
    mknod -m 666 /dev/null c 1 3; mknod -m 666 /dev/zero c 1 5; mknod -m 444 /dev/urandom c 1 9
    umount -l /.old && rmdir /.old                   # the host file system is gone from view
    shift; exec "$@"' "$NAME" "$B/rootfs" "$@"
RC=$?

# 4. cleanup: the box's processes are gone (it had PID 1 — when it exits, the kernel kills the rest)
umount $B/rootfs; rmdir $CG
exit $RC
