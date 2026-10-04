# Báo cáo sự cố — Postmortem (không đổ lỗi)

> **Mục đích:** hiểu vì sao sự cố xảy ra và sửa **hệ thống** để nó không lặp lại — không tìm người để trách.
> **Ai điền:** DevOps / SRE (người chỉ huy sự cố) chủ trì; Dev, Hỗ trợ đóng góp; gửi khách bản tóm tắt.
> **Khi nào:** trong … ngày làm việc sau mọi sự cố P1 / P2 — giai đoạn 18 · Bảo hành, vận hành & bảo trì.
> **Chuẩn tham chiếu:** NIST SP 800-61 Rev. 3 (sự cố an ninh mạng), ITIL® 4 (Incident & Problem management), Google SRE — Postmortem culture.

---

| Mã sự cố | Mức | Bắt đầu | Phát hiện | Khắc phục | Thời gian ảnh hưởng | Người chỉ huy |
|---|---|---|---|---|---|---|

## 1. Tóm tắt (3–5 câu)
Chuyện gì xảy ra, ai bị ảnh hưởng, bao lâu, đã khắc phục thế nào.

## 2. Ảnh hưởng
- Người dùng / chức năng bị ảnh hưởng, số lượng
- Dữ liệu: có mất / lộ không? (nếu có dữ liệu cá nhân — báo ngay Pháp lý để đánh giá nghĩa vụ thông báo)
- SLA: có vi phạm không?

## 3. Dòng thời gian (giờ địa phương, ghi múi giờ)
| Thời điểm | Sự kiện / hành động | Ai |
|---|---|---|

## 4. Nguyên nhân gốc rễ
- **Kích hoạt (trigger):**
- **Nguyên nhân gốc:**
- **Vì sao không phát hiện sớm hơn:**
- **Vì sao các lớp kiểm hiện có không chặn được:** (kiểm cả chính bộ kiểm — nó có thật sự chạy và kiểm đúng thứ không?)

## 5. Điều gì đã làm tốt / điều gì gặp may

## 6. Hành động khắc phục & phòng ngừa
| # | Hành động | Loại (phát hiện / ngăn chặn / giảm thiểu / quy trình) | Người phụ trách | Hạn | Thẻ |
|---|---|---|---|---|---|

Ưu tiên hành động biến bài học thành **kiểm tra tự động** (smoke test, chốt CI, cảnh báo) hơn là "nhớ cẩn thận hơn".

## 7. Bài học đưa vào quy trình
Cập nhật runbook / checklist / bảng "lỗi đã gặp" ở đâu.

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh.*
