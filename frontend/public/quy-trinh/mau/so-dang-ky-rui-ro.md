# Sổ đăng ký rủi ro (Risk Register)

> **Mục đích:** viết rủi ro ra sớm, có người theo dõi và phương án — rẻ hơn nhiều so với phát hiện muộn.
> **Ai điền:** PM duy trì; mọi thành viên được thêm rủi ro; xem lại mỗi sprint.
> **Khi nào:** khởi tạo ở giai đoạn 01 (sơ bộ), hoàn chỉnh ở giai đoạn 08, sống tới khi đóng dự án.
> **Chuẩn tham chiếu:** ISO 31000:2018, PMBOK® Guide 7th ed. (miền Uncertainty).

---

**Thang điểm:** Khả năng (L) 1 rất thấp → 5 rất cao · Tác động (I) 1 không đáng kể → 5 nghiêm trọng · Mức = L × I (≥ 15 cao, 8–14 trung bình, ≤ 7 thấp).
**Chiến lược:** Tránh (Avoid) · Giảm (Mitigate) · Chuyển giao (Transfer) · Chấp nhận (Accept).

| ID | Ngày ghi | Rủi ro (nếu … thì …) | Nhóm | L | I | Mức | Chiến lược | Biện pháp | Dấu hiệu sớm (trigger) | Người theo dõi | Trạng thái | Cập nhật lần cuối |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R01 | | Nếu khách chậm cung cấp dữ liệu mẫu thì mốc chuyển dữ liệu trễ | Phụ thuộc | | | | Giảm | Chốt hạn trong SOW, nhắc trước 1 tuần | Quá hạn 2 ngày | PM | Mở | |
| R02 | | Nếu dự án phụ thuộc một người (ốm, nghỉ) thì việc dừng | Nguồn lực | | | | Giảm | Tài liệu hoá, review chéo, người dự phòng | | PM | Mở | |
| R03 | | Nếu nhà cung cấp API bên thứ ba đổi giá / giới hạn thì chi phí tăng | Bên thứ ba | | | | Giảm | Trần chi phí, đường lùi | | Kiến trúc | Mở | |
| R04 | | Nếu dữ liệu cũ kém chất lượng hơn dự kiến thì chuyển dữ liệu kéo dài | Dữ liệu | | | | Giảm | Đánh giá chất lượng sớm, chạy thử | | Dữ liệu | Mở | |

**Nhóm gợi ý:** Phạm vi · Lịch · Nguồn lực · Kỹ thuật · Bảo mật · Dữ liệu · Pháp lý · Bên thứ ba · Phụ thuộc khách.

## Nhật ký xem lại
| Ngày | Sprint | Rủi ro mới | Rủi ro đóng | Leo thang |
|---|---|---|---|---|

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh.*
