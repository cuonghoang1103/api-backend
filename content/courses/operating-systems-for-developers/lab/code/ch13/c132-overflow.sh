# @ Chương 13 · bài 13.2 — tràn bộ đệm và các lớp phòng vệ. Chạy: docker run --rm --label oslab=1 --hostname oslab --security-opt seccomp=unconfined -v "$PWD/ch13":/lab/ch13 -w /lab/ch13 os-lab bash -c "phien c132-overflow.sh 2>&1"
# @ EN: Build the toy WITHOUT the stack canary so we can watch the mechanism. ||| VI: Dựng chương trình đồ chơi KHÔNG có canary để nhìn cơ chế.
gcc -O0 -fno-stack-protector vuln.c -o vuln
# @ EN: A short string fits; flag stays 0. ||| VI: Chuỗi ngắn thì vừa; flag vẫn 0.
./vuln hello
# @ EN: 20 bytes into a 16-byte buffer: the extra bytes land on flag. ||| VI: 20 byte vào bộ đệm 16 byte: các byte thừa rơi vào flag.
./vuln AAAAAAAAAAAAAAAAAAAA
# @ EN: Far too long, inside a called function: the saved return address is clobbered. ||| VI: Quá dài, trong một hàm được gọi: địa chỉ trả về đã lưu bị ghi đè.
gcc -O0 -fno-stack-protector retaddr.c -o retaddr
./retaddr AAAAAAAAAAAAAAAA; echo "exit $?"
./retaddr $(python3 -c "print('A'*200)"); echo "exit $?"
# @ EN: Now rebuild WITH today's default defences and read the flags with readelf (a checksec in three greps). ||| VI: Giờ dựng lại VỚI phòng vệ mặc định hôm nay và đọc cờ bằng readelf (checksec bằng ba lệnh grep).
gcc -O2 vuln.c -o vuln-hardened
# @ EN: Stack canary: the __stack_chk_fail symbol is linked in. ||| VI: Canary: ký hiệu __stack_chk_fail được liên kết vào.
readelf -s vuln-hardened | grep -c __stack_chk_fail; readelf -s vuln | grep -c __stack_chk_fail
# @ EN: NX / W^X: the stack segment GNU_STACK is RW, never RWE. ||| VI: NX / W^X: đoạn GNU_STACK của stack là RW, không bao giờ RWE.
readelf -l vuln-hardened | grep -A1 GNU_STACK
# @ EN: PIE: the ELF type is DYN, so ASLR can move the code (lesson 7.1). ||| VI: PIE: loại ELF là DYN, nên ASLR dời được mã (bài 7.1).
readelf -h vuln-hardened | grep Type
# @ EN: Full RELRO: BIND_NOW + a GNU_RELRO segment make the GOT read-only after start-up. ||| VI: Full RELRO: BIND_NOW + đoạn GNU_RELRO khiến GOT thành chỉ-đọc sau khởi động.
readelf -d vuln-hardened | grep -E 'BIND_NOW|FLAGS'; readelf -l vuln-hardened | grep -c GNU_RELRO
# @ EN: With the canary on, the SAME overflow is caught before return: abort, exit 134. ||| VI: Có canary, CHÍNH cú tràn đó bị bắt trước khi trả về: abort, exit 134.
gcc -O0 retaddr.c -o retaddr-canary
./retaddr-canary $(python3 -c "print('A'*200)") 2>&1; echo "exit $?"
# @ EN: FORTIFY_SOURCE replaces strcpy with a checked version that knows buf is 16 bytes: it aborts at runtime. ||| VI: FORTIFY_SOURCE thay strcpy bằng bản có kiểm biết buf là 16 byte: nó abort lúc chạy.
gcc -O2 -D_FORTIFY_SOURCE=3 retaddr.c -o retaddr-fortify
./retaddr-fortify $(python3 -c "print('A'*200)") 2>&1; echo "exit $?"
# @ EN: The fix: bounded copy + length check. Long input is refused, not overflowed. ||| VI: Bản sửa: sao chép có chặn + kiểm độ dài. Input dài bị từ chối, không tràn.
gcc -O2 safe.c -o safe
./safe hello
./safe $(python3 -c "print('A'*200)"); echo "exit $?"
# @ EN: Format string: passing user text as the format can leak stack words. ||| VI: Chuỗi định dạng: đưa văn bản người dùng làm format có thể rò các từ trên stack.
gcc -O2 -Wno-format-security fmt.c -o fmt
./fmt good "%p.%p.%p"
./fmt bad "%p.%p.%p"
# @ EN: Use-after-free and double-free, caught by AddressSanitizer at the exact line. ||| VI: Dùng-sau-giải-phóng và giải-phóng-hai-lần, bị AddressSanitizer bắt đúng dòng.
gcc -O0 -g -fsanitize=address uaf.c -o uaf
./uaf 2>&1 | grep -E 'ERROR|freed by|previously allocated|#0 |strlen|SUMMARY' | head -n 8; echo "exit ${PIPESTATUS[0]}"
gcc -O0 -g -fsanitize=address df.c -o df
./df 2>&1 | grep -E 'ERROR|double-free|#0 |SUMMARY' | head -n 5
@ rm -f vuln vuln-hardened retaddr retaddr-canary retaddr-fortify safe fmt uaf df rf
