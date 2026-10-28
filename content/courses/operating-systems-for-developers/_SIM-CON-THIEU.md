# Mô phỏng còn thiếu (gom từ báo cáo agent chương) — điều phối dựng component mới vào frontend/src/components/os-lab
## Từ Ch5 (28/10)
- Semaphore / pool N chỗ: hàng yêu cầu chờ.
- Producer–consumer bộ đệm giới hạn + biến điều kiện (`if` vs `while`).
- Readers–writers / rwlock + writer bị đói.
- Memory ordering: store buffer, litmus SB.
- Hai phiên CSDL khoá dòng `FOR UPDATE` theo dòng thời gian.
- Khoá phân tán lease hết hạn + fencing token.
- Race trong event loop qua `await`.
## Từ Ch3 (28/10)
- Event loop: call stack + hàng callback + pool libuv; callback dài chặn cả hàng.
- Thread pool theo định luật Little: N luồng, hàng chờ, timeout, pool CSDL phía sau.
- Dòng thời gian CPU quota/throttling chu kỳ 100 ms.
- Giá context switch + cache nóng/nguội; chuyền việc cùng lõi vs khác lõi.
- Luồng nhân vs virtual thread (M:N, carrier).
## Từ Ch6 (28/10)
- Banker's algorithm từng bước: bảng Allocation/Max/Need/Available, nút "bước tiếp", Work tăng dần, dãy an toàn; ô nhập yêu cầu (Request ≤ Need? ≤ Available? giả vờ cấp → an toàn?) — dùng ví dụ giáo trình A B C = 10 5 7 như banker.py.
- Thuật toán phát hiện (ma trận Request) + đồ thị cấp phát tài nguyên NHIỀU BẢN (pool N kết nối): có vòng nhưng chưa chắc deadlock.
- Triết gia ăn tối: 5 luồng quanh bàn, 4 chế độ (naive / ordered / waiter N−1 / trylock + nghỉ ngẫu nhiên), bộ đếm bữa từng người (thấy cả deadlock lẫn đói).
- Đảo ngược ưu tiên: dòng thời gian một lõi H/M/L, công tắc kế thừa ưu tiên (540 ms → 40 ms như pi.c), kể Mars Pathfinder.
- Livelock: hai luồng lịch sự cùng nhịp vs lùi ngẫu nhiên (bộ đếm việc xong / số lần nhường, đồng hồ CPU).
- Pool kết nối cạn: mỗi request giữ 1 và xin thêm 1 (pool.connect + pool.query lồng) → "2 in use, 0 idle, 2 waiting"; nút thời hạn / truyền client xuống.
