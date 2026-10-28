# @ Chương 13 · bài 13.1 — đọc một tệp nhị phân. Chạy: docker run --rm --label oslab=1 --hostname oslab --security-opt seccomp=unconfined -v "$PWD/ch13":/lab/ch13 -w /lab/ch13 os-lab bash -c "phien c131-doc.sh 2>&1"
uname -m
gcc -O0 -g add.c -o add
./add 100 3
# @ EN: What kind of file is this, and for which machine? ||| VI: Đây là tệp loại gì, cho máy nào?
file add
# @ EN: The ELF header: entry point, type (PIE = DYN), architecture. ||| VI: Phần đầu ELF: điểm vào, loại (PIE = DYN), kiến trúc.
readelf -h add | head -n 14
# @ EN: The sections — where code (.text), constants (.rodata) and globals (.data/.bss) live. ||| VI: Các phần — mã (.text), hằng (.rodata) và biến toàn cục (.data/.bss) nằm đâu.
readelf -S add | grep -E 'Nr|\.text|\.rodata|\.data|\.bss|\.plt|\.got' | head
# @ EN: nm lists the symbols — our two functions among them. ||| VI: nm liệt kê ký hiệu — hai hàm của ta nằm trong đó.
nm add | grep -E ' T | t ' | grep -iE 'total|main'
# @ EN: Disassemble just total() — the whole function in machine code. ||| VI: Tháo rời riêng total() — cả hàm ra mã máy.
objdump -d --no-show-raw-insn add | sed -n '/<total>:/,/^$/p'
# @ EN: Step through it in gdb: break, run, registers, frame, backtrace. ||| VI: Đi từng bước trong gdb: break, run, thanh ghi, khung, backtrace.
gdb -q -batch -ex 'break total' -ex 'run 100 3' -ex 'info args' -ex 'bt' -ex 'info frame' -ex 'x/4i $pc' -ex 'stepi 6' -ex 'info registers x0 x1 sp' ./add
# @ EN: The same idea without debug info — just addresses and instructions. ||| VI: Cùng ý đó mà không có thông tin gỡ lỗi — chỉ còn địa chỉ và lệnh.
gcc -O2 greet.c -o greet
objdump -d --no-show-raw-insn greet | sed -n '/<main>:/,/^$/p' | head -n 16
@ rm -f add greet
