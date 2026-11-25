# 7.5 — Thông điệp của nhân trên máy ảo lab7 (nhân 6.8): quyền đọc, USB, OOM (cgroup và toàn máy), segfault, lỗi I/O đĩa
dmesg | head -n 2
sysctl kernel.dmesg_restrict
sudo dmesg | head -n 3
sudo dmesg -T | head -n 3
sudo dmesg -T --level=err,warn | head -n 5
journalctl -k -b -n 3 --no-pager
sudo dmesg -T | grep 'usb 1-1' | head -n 5
journalctl -k -b -g 'usb 1-1' --no-pager
date '+%F %T' > /tmp/moc-cg
sudo systemd-run --unit=an-ram -p MemoryMax=60M -p MemorySwapMax=0 --wait python3 -c 'import itertools; a = [bytearray(5 << 20) for _ in itertools.count()]' 2>&1 | tail -n 7
journalctl -u an-ram -b -n 4 --no-pager -o short-iso
journalctl -k -b --since "$(cat /tmp/moc-cg)" -g 'oom|Killed process' --no-pager -o short-iso
date '+%F %T' > /tmp/moc-oom
sudo systemd-run --unit=an-het-ram --wait python3 -c 'import itertools; a = [bytearray(20 << 20) for _ in itertools.count()]' 2>&1 | tail -n 7
journalctl -k -b --since "$(cat /tmp/moc-oom)" --no-pager -o short-iso | grep -E 'invoked oom-killer|Out of memory|oom-kill:|Free swap|Node 0 Normal free' | cut -c1-230
python3 -c 'import ctypes; ctypes.string_at(0)'; echo "exit=$?"
journalctl -k -b -g segfault -n 1 --no-pager -o short-iso
date '+%F %T' > /tmp/moc-io
truncate -s 64M /tmp/dia.img && sudo losetup -f --show /tmp/dia.img > /tmp/loop && cat /tmp/loop
sudo mkfs.ext4 -q $(cat /tmp/loop) && sudo dmsetup create dia-hong --table "0 131072 linear $(cat /tmp/loop) 0" && sudo mkdir -p /mnt/hong && sudo mount -o errors=remount-ro /dev/mapper/dia-hong /mnt/hong && findmnt -no SOURCE,OPTIONS /mnt/hong
sudo dmsetup suspend dia-hong && sudo dmsetup reload dia-hong --table '0 131072 error' && sudo dmsetup resume dia-hong
sudo sh -c 'echo hello > /mnt/hong/a.txt; sync'; ls /mnt/hong; sleep 10
sudo touch /mnt/hong/b.txt
journalctl -k -b --since "$(cat /tmp/moc-io)" --no-pager -o short-iso | grep -E 'I/O error|EXT4-fs|Aborting journal|Remount' | head -n 14 | cut -c1-200
sudo umount -l /mnt/hong; sudo dmsetup remove dia-hong; sudo losetup -d $(cat /tmp/loop); rm /tmp/dia.img; sudo systemctl reset-failed an-ram an-het-ram; echo don-xong
