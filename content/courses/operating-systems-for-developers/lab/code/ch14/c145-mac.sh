# @ Chương 14 · bài 14.5 — gõ TỪ MÁY MAC (chỉ đọc hệ thống; chỉ ghi trong thư mục tạm của chính mình; không sudo), từ lab/code/ch14:
# @   CH14_WORK=<thư mục tạm> bash phien-host.sh c145-mac.sh 2>&1 | CH14_WORK=… bash an-danh.sh > ../../out/c145-mac.out.txt
@ rm -rf "$CH14_WORK/fs"; mkdir -p "$CH14_WORK/fs"; cd "$CH14_WORK/fs"
mount | grep -E ' on / | on /System/Volumes/Data '
diskutil info / | grep -E 'File System Personality|Sealed'
csrutil status; spctl --status
getconf PATH_MAX /; getconf NAME_MAX /
touch Readme.md; ls readme.md; touch README.md; ls
dd if=/dev/urandom of=big.bin bs=1m count=512 2>/dev/null; df -m . | awk 'NR==2{print "free MiB:", $4}'
time cp -c big.bin clone.bin
df -m . | awk 'NR==2{print "free MiB:", $4}'
time cp big.bin copy.bin
df -m . | awk 'NR==2{print "free MiB:", $4}'
du -sm .
rm big.bin clone.bin copy.bin
echo 'echo hi' > tool.sh; echo "secret notes" > tool.sh/..namedfork/rsrc; ls -l tool.sh; cat tool.sh/..namedfork/rsrc
xattr -w com.apple.quarantine "0081;$(printf %x $(date +%s));Safari;" tool.sh; xattr -l tool.sh
xattr -d com.apple.quarantine tool.sh; xattr tool.sh
chmod +a "everyone deny delete" tool.sh; ls -le tool.sh; rm tool.sh
chmod -a "everyone deny delete" tool.sh; rm tool.sh && echo deleted
ls -lO /usr/bin/true
touch /usr/bin/x
