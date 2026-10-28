# Mô phỏng còn thiếu (gom từ báo cáo agent chương) — điều phối dựng component mới vào frontend/src/components/os-lab

> **28/10 — đợt dựng mô phỏng #2:** 8 mô phỏng mới trong `/os-lab` (sysmon, eventloop, threadpool, sync, deadlock,
> cgroup, cow, pagecache). Nhúng vào bài bằng `lab('<id>', '<preset>', 'vi'|'en', 'chú thích')` từ `_lab.mjs` — preset
> ghi ở dòng ✅ dưới mỗi mục. Mục không có ✅ là CHƯA dựng.

## Theo yêu cầu điều phối (Ch2 / Ch8 / Ch12)
- Phòng máy kiểu top/htop: load vs số lõi, %CPU, us/sy/ni/wa, RES/VIRT, free (available vs free, buff/cache), df %, iowait; bơm sự cố + chẩn đoán + gợi ý "lệnh nào cho thấy".
  - ✅ **Đã dựng (28/10):** `sysmon` preset `calm` · `cpuhog` · `memleak` (cache co → swap → OOM kill, systemd tự chạy lại) · `diskfull` (rm khi tiến trình còn mở ⇒ df không giảm, lsof +L1; truncate) · `iostorm` (load cao mà CPU rảnh, trạng thái D, ionice -c3) · `forkbomb` (pids.max=512, cgroup.kill) · `zombies` (kill -9 zombie vô tác dụng, giết cha) · `mystery` (sự cố ngẫu nhiên, ẩn gợi ý tới khi trả lời). Lệnh in output: uptime, free -m, df -h, vmstat, iostat -x, ps zombie, dmesg, du, lsof +L1, pids.current.
- Dòng thời gian cgroup bộ nhớ: usage vs memory.high/memory.max → thu hồi → throttle → OOM kill, exit 137.
  - ✅ **Đã dựng (28/10):** `cgroup` preset `oom` · `high` · `cache` (chạm trần vì page cache, không OOM) · `swap` · `restart` (vòng chết–chạy lại); tab CPU: `cpuquota` · `cputhreads`.
## Từ Ch5 (28/10)
- Semaphore / pool N chỗ: hàng yêu cầu chờ.
  - ✅ **Đã dựng (28/10):** `sync` preset `semaphore` (pool N=1–4, hàng chờ, max cùng lúc) · `leak` (T3 quên release ⇒ pool cạn, treo không lỗi)
- Producer–consumer bộ đệm giới hạn + biến điều kiện (`if` vs `while`).
  - ✅ **Đã dựng (28/10):** `sync` preset `pcif` (kịch bản "cướp đánh thức" ⇒ lấy từ bộ đệm rỗng 💥) · `pcwhile` (cùng kịch bản, an toàn); có nút đánh thức giả ở chế độ "bạn chọn"
- Readers–writers / rwlock + writer bị đói.
  - ✅ **Đã dựng (28/10):** `sync` preset `readers` (ưu tiên người đọc ⇒ người ghi đói, 0 lượt ghi) · `writerpref`
- Memory ordering: store buffer, litmus SB.
- Hai phiên CSDL khoá dòng `FOR UPDATE` theo dòng thời gian.
- Khoá phân tán lease hết hạn + fencing token.
- Race trong event loop qua `await`.
  - ✅ **Đã dựng (28/10):** `eventloop` preset `race` (alice + bob cùng mua ghế cuối, đúng ch05/async-race.js) · `racelock` (mutex chuỗi Promise)
## Từ Ch3 (28/10)
- Event loop: call stack + hàng callback + pool libuv; callback dài chặn cả hàng.
  - ✅ **Đã dựng (28/10):** `eventloop` preset `order` (sync → nextTick → promise → timers → poll → check) · `block` (handler 200 ms đồng bộ: req3/req4 trễ 197/194 ms) · `offload` · `pool` (8× pbkdf2 trên pool 4 luồng: 100/200 ms; readFile 1 ms chờ tới 201 ms; https 30 ms không tốn luồng; đổi UV_THREADPOOL_SIZE 1/2/4/8)
- Thread pool theo định luật Little: N luồng, hàng chờ, timeout, pool CSDL phía sau.
  - ✅ **Đã dựng (28/10):** `threadpool` preset `healthy` · `overload` · `timeout` (goodput sập; thử "bỏ request quá hạn" và hàng đợi 64) · `dbpool` (50 luồng, 5 kết nối) · `mm1` (W = 50 ms, L = 4); đường cong thông lượng/p99 theo λ, Erlang C
- Dòng thời gian CPU quota/throttling chu kỳ 100 ms.
  - ✅ **Đã dựng (28/10):** `cgroup` preset `cpuquota` (1 luồng 120 ms CPU, quota 50/100 ⇒ xong lúc 220 ms) · `cputhreads` (4 luồng × 30 ms ⇒ 205 ms thay vì 30); cpu.stat nr_periods/nr_throttled/throttled_usec
- Giá context switch + cache nóng/nguội; chuyền việc cùng lõi vs khác lõi.
- Luồng nhân vs virtual thread (M:N, carrier).
  - ✅ **Đã dựng (28/10):** MỘT PHẦN — `threadpool` preset `virtual` (bỏ giới hạn worker, nút cổ chai dời sang pool CSDL). Chưa có hình carrier/mount–unmount M:N.
## Từ Ch6 (28/10)
- Banker's algorithm từng bước: bảng Allocation/Max/Need/Available, nút "bước tiếp", Work tăng dần, dãy an toàn; ô nhập yêu cầu (Request ≤ Need? ≤ Available? giả vờ cấp → an toàn?) — dùng ví dụ giáo trình A B C = 10 5 7 như banker.py.
  - ✅ **Đã dựng (28/10):** `deadlock` preset `banker` (dãy <P1, P3, P4, P0, P2> đúng thứ tự quét của banker.py) · `request` (P1 (1,0,2) cấp · P4 (3,3,0) chờ · P0 (0,2,0) từ chối)
- Thuật toán phát hiện (ma trận Request) + đồ thị cấp phát tài nguyên NHIỀU BẢN (pool N kết nối): có vòng nhưng chưa chắc deadlock.
  - ✅ **Đã dựng (28/10):** `deadlock` preset `detect` (A=7 B=2 C=6, có chọn "P2 xin thêm một C" ⇒ P1–P4 kẹt) · `cycle` (có vòng, không deadlock) · `pool` (pool 2 kết nối, mỗi request giữ 1 xin thêm 1); vẽ đồ thị cấp phát
- Triết gia ăn tối: 5 luồng quanh bàn, 4 chế độ (naive / ordered / waiter N−1 / trylock + nghỉ ngẫu nhiên), bộ đếm bữa từng người (thấy cả deadlock lẫn đói).
  - ✅ **Đã dựng (28/10):** `deadlock` preset `philosophers` (4 chế độ, "cùng đói một lúc"/ngẫu nhiên, bộ đếm bữa, đói lâu nhất, số lần đặt đũa xuống)
- Đảo ngược ưu tiên: dòng thời gian một lõi H/M/L, công tắc kế thừa ưu tiên (540 ms → 40 ms như pi.c), kể Mars Pathfinder.
  - ✅ **Đã dựng (28/10):** `deadlock` preset `inversion` (540 ms → 40 ms đúng pi.c; tuỳ chọn watchdog 125 ms ⇒ RESET)
- Livelock: hai luồng lịch sự cùng nhịp vs lùi ngẫu nhiên (bộ đếm việc xong / số lần nhường, đồng hồ CPU).
  - ✅ **Đã dựng (28/10):** MỘT PHẦN — `deadlock` preset `philosophers`, chế độ trylock có bộ đếm "đặt xuống". Chưa có chế độ hai luồng lùi CỐ ĐỊNH (livelock thật).
- Pool kết nối cạn: mỗi request giữ 1 và xin thêm 1 (pool.connect + pool.query lồng) → "2 in use, 0 idle, 2 waiting"; nút thời hạn / truyền client xuống.
  - ✅ **Đã dựng (28/10):** MỘT PHẦN — `deadlock` preset `pool` (thuật toán phát hiện + đồ thị) và `sync` preset `leak` (pool cạn vì quên release). Chưa có dòng thời gian "2 in use, 0 idle, 2 waiting" + nút timeout.
## Từ Ch7 (28/10)
- Bảng trang 4 cấp THẬT: địa chỉ 48 bit tách 9|9|9|9|12, duyệt L0→L3→khung (vm hiện là máy 16 bit/16 trang); bật/tắt huge page 2 MiB = dừng ở cấp L2.
- TLB reach: thanh trượt working set (1 MiB → 1 GiB) × cỡ trang (4 KiB / 2 MiB) → tỉ lệ trúng TLB và ns/truy cập (khớp bảng tlb.c 7.2).
- Copy-on-write sau fork: hai bảng trang trỏ chung khung, ghi ⇒ chép 1 trang; thanh trượt "% trang bị ghi trong lúc lưu" ⇒ MiB bị chép (Redis BGSAVE).
  - ✅ **Đã dựng (28/10):** `cow` preset `fork` · `exec` · `bgsave` (máy tính: dữ liệu GiB × lệnh ghi/s × thời gian lưu ⇒ MiB bị chép) · `hugepage` (THP 2 MiB ⇒ chép gần hết)
- Page cache + read-ahead: đọc tuần tự vs ngẫu nhiên file nguội/ấm, major vs minor fault, mmap vs read (chép hay ánh xạ).
  - ✅ **Đã dựng (28/10):** `pagecache` preset `seq` (cửa sổ 4→8→16→32 trang) · `random` · `warm` · `mmap` (0 lần chép, lỗi minor) · `lru` (cache 200 trang, vòng 256 trang × 2 ⇒ lượt 2 trượt hết)
- Bộ cấp phát malloc: heap brk + top chunk, ngưỡng mmap động, phân mảnh (lỗ 112 B không chứa khối 200 B), khối cuối ghim đỉnh heap, malloc_trim; arena theo luồng.
- Bộ gom rác: heap thế hệ trẻ/già, mark-compact, dòng thời gian lần dừng stop-the-world của G1 vs ZGC đồng thời; heap-sau-GC tăng (rò rỉ) vs phẳng.
## Từ Ch2 (28/10) — ⭐ ưu tiên số 1: "Bảng điều khiển hệ thống" (top/htop sống)
  - ✅ **Đã nhúng vào Ch2 (28/10, sau 495d5af22):** 2.1 `sysmon calm` · 2.2 `sysmon cpuhog` + `zombies` · 2.3 `pagecache warm` + `sysmon memleak` + `cgroup oom` · 2.4 `sysmon diskfull` + `iostorm` · 2.6 `cgroup restart` · 2.7 `sysmon mystery` (thử thách cuối chương). Còn thiếu preset `deletedopen`/`inodes` riêng và hai build song song (`oom137build`) — tuỳ chọn.
Bài 2.1–2.7 dạy đọc top/vmstat/iostat/free/df bằng output tĩnh; người học cần MỘT máy ảo sống để tự bơm tải và nhìn cột đổi.
(Thấy `frontend/src/components/os-lab/SysmonSim.tsx` đang dựng với preset calm/cpuhog/memleak/diskfull/iostorm/forkbomb/zombies/mystery
— khớp gần đủ; dưới đây là những gì Ch2 cần để nhúng được, kèm số đo thật để mô phỏng "giống máy thật".)
- Màn hình: dòng đầu top (uptime + load 1/5/15, Tasks theo R/S/D/T/Z, `%Cpu(s)` us/sy/ni/id/wa/hi/si/st, MiB Mem total/free/used/buff-cache/avail),
  bảng tiến trình (PID USER PR NI VIRT RES SHR S %CPU %MEM TIME+ COMMAND, sắp theo %CPU hoặc RES), và đồ thị mini 60 s cho load, us/wa, available, disk await.
- Cấu hình máy: số lõi (2/4/10), RAM (1/6/8 GB), dung lượng đĩa + số inode; chạy "trong container" (nproc theo quota nhưng free/load là của host — bẫy bài 2.1).
- Nút bơm tải (mỗi cái là một tiến trình xuất hiện trong bảng, có PID, kill được):
  • CPU: vòng lặp đơn luồng (đúng 100% một lõi; `%Cpu(s)` chỉ tăng 100/N%), đa luồng 3 luồng (300%, như bao-cao.js), dd bs=1 (sy cao), nice 19 (ni), "6 việc trên 2 lõi" (load → 6, mỗi cái ~33%, load 1 phút tăng theo hàm mũ ~63% sau 60 s).
  • RAM: rò rỉ +200 KB/request (RSS 49→373 MB sau 1 500 request), page cache (ghi 400 MB ⇒ buff/cache +400, available gần như không đổi), hai build song song vượt trần ⇒ OOM kill: tiến trình biến mất, exit 137, dòng dmesg "Memory cgroup out of memory: Killed process … (node)".
  • Đĩa: job sao lưu O_DIRECT (wa 10–30%, vmstat b 1–4, tiến trình trạng thái D, iostat w_await ~175 ms, aqu-sz ~27), log làm đầy đĩa (df Use% → 100%, rồi Postgres giả PANIC/Restarting), file đã xoá còn mở (df ≫ du; lệnh lsof +L1 trong ô gõ lệnh), cạn inode (df -h 15% nhưng df -i 100%).
  • Tiến trình: zombie dồn đống dưới PID 1 = node (Tasks … N zombie, pids.current → pids.max, "Cannot fork"), nút "--init" để thu dọn.
- Ô gõ lệnh (đã có trong SysmonSim) nên trả lời được: uptime, nproc, vmstat 1, mpstat -P ALL, pidstat, pidstat -d, iostat -x, free -m, df -h, df -i, du -sh, lsof +L1, ss -s, dmesg | tail, ps -eo … --sort.
- Chế độ "thủ phạm bí ẩn" (preset mystery): máy cài sẵn 1–2 thủ phạm ngẫu nhiên, người học phải trả lời theo khung USE và chỉ ra dòng bằng chứng.
- Chỗ sẽ nhúng khi có trong registry + `_lab.mjs` SIMS (thêm tên `sysmon`): 2.1 `lab('sysmon','mystery')` (thay/kèm latency), 2.2 `cpuhog` + `zombies`,
  2.3 `memleak`, 2.4 `diskfull` + `iostorm`, 2.7 `calm` (đọc từng cột). Cần thêm preset: `deletedopen`, `inodes`, `oom137build` (hai build song song).
## Từ Ch2 (28/10) — các mô phỏng nhỏ khác
- Bảng file descriptor của một tiến trình: fd 0/1/2, socket nghe, file mở; nút "request rò rỉ" làm bảng đầy tới RLIMIT_NOFILE ⇒ EMFILE; công tắc soft/hard (Node tự nâng soft = hard).
- Tên ↔ inode ↔ fd: `rm` xoá tên nhưng fd còn giữ inode (df không giảm); logrotate `create` đổi tên ⇒ app vẫn ghi vào app.log.1; `copytruncate` cắt tại chỗ.
- Ai giữ cổng: bảng socket (ss) với Local Address, process, fd; tiến trình đổi tên (process.title = "next-server (v…)") ⇒ pkill -f trượt, lsof Linux trượt, ss/fuser trúng.
## Từ Ch8 (28/10) — đã nhúng cgroup (oom/high/cache/swap/restart), pagecache (warm/lru), sysmon (memleak/mystery), cow (bgsave); còn thiếu:
- Overcommit: đồng hồ CommitLimit (= swap + ratio% × RAM) vs Committed_AS; công tắc chế độ 0/1/2; nút malloc(N GiB) ⇒ OK/NULL theo chế độ, rồi "chạm từng trang" ⇒ chết muộn (137) vs thất bại sớm (NULL). Số thật: VM 7,9 GB + swap 1 GiB, CommitLimit 4.991 MiB, Committed_AS 4.911 MiB, malloc 4 TiB "OK" ở chế độ 1.
- Bộ chọn nạn nhân OOM: 2–5 tiến trình với thanh trượt RSS và oom_score_adj; hiện oom_score = (1000 + adj + 1000·dùng/(RAM+swap))·2/3 (666 shell, 676 postgres 140 MiB) và điểm trong memcg (rss+swap+bảng trang)/giới hạn (postgres 554‰ vs api 447‰ ⇒ postgres chết dù api gây ra); công tắc phạm vi máy/cgroup, memory.oom.group, "tất cả −1000 ⇒ kẹt".
- swappiness là mức giá: hai kho anon/file của một cgroup + ô "memory.reclaim N swappiness=S" ⇒ kho nào trả (0: chỉ file, hết file ⇒ EAGAIN; 200: anon ra swap 11 MiB). Khớp c82-swap.
- PSI sống: đồ thị some/full theo giây với avg10/avg60/avg300 (trung bình mũ — vì sao avg10 trễ 10 s), total µs; ngưỡng kiểu systemd-oomd (60%/30 s) hoặc mini-oomd (20%) ⇒ giết sớm trong khi oom_kill của nhân không nhích. Số thật: file thrash 34,87%, memory.high 99,76%.
- Watermark min/low/high của zone + kswapd thức/ngủ + direct reclaim (allocstall); trong cgroup ở memory.max luôn direct (pgscan_kswapd 0). Số thật zone Normal: 31,8 / 39,7 / 47,7 MiB.
- Hai bản build song song vs tuần tự trên một trần (512 MiB ≈ VPS 6 GB thu nhỏ): hai đường bộ nhớ chồng nhau, memory.peak 512 vs 310 MiB, ai bị giết là cuộc đua; exit 0 + OOMKilled=true khi PID 1 sống (Ch2 cũng xin preset sysmon `oom137build`).
- Heap runtime trong container: thanh giới hạn container chia heap / ngoài heap (Buffer, sharp, ONNX, metaspace, stack luồng); Node 22 mặc định ≈ ½ giới hạn, sàn 259 MB (> hộp 256 MiB); JVM MaxRAMPercentage 25→75; kết quả 134 / 133 (PID 1 arm64) / 137 / OOME exit 1 / ExitOnOOME exit 3.
- Kubernetes requests/limits: node với các pod, QoS Guaranteed/Burstable/BestEffort ⇒ oom_score_adj (−997 / công thức / 1000), kubelet eviction (memory.available < 100Mi) trước OOM của nhân.
