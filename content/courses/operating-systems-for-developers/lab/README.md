# Phòng lab — Operating Systems for Developers

Một máy Linux thật VỨT ĐI ĐƯỢC cho mọi lệnh/chương trình của khoá. Mọi output trong bài học được chạy ở đây rồi
đọc thẳng từ `out/*.out.txt` (không chép tay).

## Dựng và vào
```bash
docker build -t os-lab moi-truong            # ~3–6 phút lần đầu, ~1,8 GB
docker run -it --rm --name os-lab --hostname oslab os-lab
docker run -it --rm --cpus 2 --memory 1g os-lab      # cỡ một VPS nhỏ (tái hiện OOM, throttling)
docker run -it --rm --privileged os-lab              # cho namespaces/cgroups/bảo mật — CHỈ container vứt đi
```
Có: gcc 15, g++, make, gdb, strace, ltrace, valgrind, binutils; procps, psmisc, util-linux, lsof, sysstat, htop,
stress-ng, hyperfine; libcap2-bin, acl, e2fsprogs; Java 21, Node 22, Python 3.14; man-db. Người dùng `dev` (uid 1001,
không sudo) cho bài về quyền; root là mặc định.

> Trên macOS/Windows, Docker chạy một VM Linux (`uname -r` = `…-linuxkit`). Gần như giống Linux trần; ngoại lệ: bộ đếm
> phần cứng của `perf` bị hạn chế (chỉ sự kiện phần mềm), vài giá trị `/proc`·`/sys` và thời gian đĩa/mạng là của VM.
> Thứ cần nhân thật đầy đủ ⇒ một VPS Linux hoặc WSL2.

## Chạy output cho một bài (quy trình soạn)
```bash
# 1) viết chương trình: code/chNN/*.{c,js,java,py}
# 2) viết kịch bản gõ lệnh: code/chNN/cNN-x.sh   (phien in "$ lệnh" rồi output)
docker run --rm --label oslab=1 --hostname oslab -v "$PWD/code/chNN":/lab/chNN -w /lab/chNN \
  os-lab bash -c "phien cNN-x.sh 2>&1" > out/cNN-x.out.txt
# 3) bài học: ${run('cNN-x', 'tiền tố lệnh', n)}  — cắt nguyên văn từ out/cNN-x.out.txt
```
Dọn khi xong: `docker rm -f $(docker ps -aq --filter label=oslab=1) 2>/dev/null`.

## Cây thư mục
- `moi-truong/Dockerfile`, `moi-truong/phien.sh` — ảnh lab + bộ chạy "phiên terminal".
- `code/s00/`, `code/ch01/` — chương trình thật của Mục 0 và Chương 1 (bài mẫu).
- `out/*.out.txt` — output ĐÃ CHẠY, bài học đọc từ đây qua `_ui.mjs`.
