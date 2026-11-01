# LabFlow API — SLO và hành vi khi có sự cố (bản 2.2.0)

| Nhóm endpoint | SLI (đo từ ngoài, như người dùng) | SLO / 30 ngày | Ngân sách lỗi |
|---|---|---|---|
| GET /v2/labs, /v2/labs/{id} | 2xx và < 300 ms | 99,9% | 43,2 phút |
| POST /v2/bookings, /cancel, /check-in | 2xx/4xx đúng hợp đồng và < 1 s | 99,5% | 3,6 giờ |
| POST /v2/auth/login | có câu trả lời (200/401/503 kèm Retry-After) trong < 1 s | 99,5% | 3,6 giờ |
| GET /v2/reports/usage (Lab 8) | 2xx và < 1 s | 99,5% | 3,6 giờ |

## Khi quá tải
- Đăng nhập: tối đa 8 lượt đang xử lý mỗi instance; dư ⇒ `503 OVERLOADED` + `Retry-After: 1`.
- Báo cáo dùng phòng: tối đa 2 lượt tính cùng lúc mỗi instance; kết quả có thể cũ tới 60 s (`Age`).

## Khi cơ sở dữ liệu gặp sự cố
- `GET /v2/labs`: trả bản tốt gần nhất, `200` + `Age` + `LabFlow-Degraded: stale-data`.
- Mọi lệnh ghi: `503 DEPENDENCY_DOWN` + `Retry-After: 30`. Không bao giờ trả 2xx cho thứ chưa lưu.
- `/ready` trả 503 (load balancer bớt gửi); `/health` vẫn 200 (không khởi động lại).

## Client nên làm gì
- Timeout 10 s mỗi request; thử lại tối đa 3 lần, lùi dần có jitter (Chương 5); luôn theo `Retry-After`.
- Lệnh ghi luôn gửi `Idempotency-Key`, giữ nguyên khoá khi gửi lại.
- `Retry-After` dài hơn thời gian màn hình chịu chờ ⇒ dừng và báo người dùng, đừng quay vòng.

Trang trạng thái: https://status.labflow.example (ví dụ)
