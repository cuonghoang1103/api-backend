# @ Chương 10 · bài 10.4 — C10K đo thật: mỗi kết nối một luồng (echo-thread) vs một vòng epoll (echo-epoll) ở 1k/5k/10k
# @ kết nối, máy tạo tải tai.c chạy CÙNG container (10 lõi, Docker Desktop arm64).
# @ Tải BẬN chạy trước, tải NHẸ sau (để tiền tố lệnh "… 100" không trùng "… 1000" khi bài cắt output bằng run()).
# @ docker run --rm --label oslab=1 --name os-c104 --hostname oslab -v "$PWD/ch10":/lab/ch10 -w /lab/ch10 os-lab-ch10 bash -c "phien c104-c10k.sh 2>&1"
gcc -O2 -Wall -o tai tai.c && gcc -O2 -Wall -o echo-epoll echo-epoll.c && gcc -O2 -Wall -pthread -o echo-thread echo-thread.c && echo built
nproc; free -m | head -2
# Busy load: every connection sends 64 bytes 10 times a second ||| Tải bận: mỗi kết nối gửi 64 byte 10 lần mỗi giây
./c10k.sh echo-thread 1000 100
./c10k.sh echo-epoll 1000 100
./c10k.sh echo-thread 5000 100
./c10k.sh echo-epoll 5000 100
./c10k.sh echo-thread 10000 100
./c10k.sh echo-epoll 10000 100
# Light load ("chat app"): every connection sends 64 bytes once a second ||| Tải nhẹ ("ứng dụng chat"): mỗi kết nối gửi 64 byte mỗi giây một lần
./c10k.sh echo-thread 1000 1000
./c10k.sh echo-epoll 1000 1000
./c10k.sh echo-thread 5000 1000
./c10k.sh echo-epoll 5000 1000
./c10k.sh echo-thread 10000 1000
./c10k.sh echo-epoll 10000 1000
