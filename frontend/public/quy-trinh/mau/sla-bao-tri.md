# Thoả thuận mức dịch vụ bảo hành / bảo trì (Maintenance SLA)

> ⚠️ **Mẫu tham khảo — là phụ lục hợp đồng, cần luật sư rà soát.**
> **Mục đích:** hai bên cùng hiểu sự cố được phân loại thế nào, phản hồi và khắc phục trong bao lâu, cái gì được và không được hỗ trợ.
> **Ai điền:** Hỗ trợ & Chăm sóc khách hàng + DevOps soạn; Pháp lý rà soát; khách ký cùng hợp đồng.
> **Khi nào:** chốt ở giai đoạn 04 (điều khoản bảo hành), hiệu lực từ giai đoạn 18 · Bảo hành, vận hành & bảo trì.
> **Chuẩn tham chiếu:** ITIL® 4 (Service level management, Incident management), ISO/IEC/IEEE 14764:2022.

---

## 1. Phạm vi dịch vụ
| Hạng mục | Bảo hành (miễn phí) | Bảo trì (theo hợp đồng) |
|---|---|---|
| Sửa lỗi so với đặc tả đã duyệt | ✓ | ✓ |
| Giám sát, xử lý sự cố | Theo mục 3 | ✓ |
| Cập nhật phụ thuộc, vá bảo mật | Bản vá nghiêm trọng | ✓ định kỳ |
| Gia hạn chứng chỉ / tên miền (kiểm tra) | | ✓ |
| Khôi phục thử sao lưu | | ✓ hằng … |
| Yêu cầu mới / thay đổi | ✗ (qua CR) | Theo số giờ trong gói |

**Không bao gồm:** lỗi do bên khác sửa mã / hạ tầng; môi trường không được hỗ trợ; dịch vụ bên thứ ba ngừng hoạt động; sử dụng sai hướng dẫn.

## 2. Kênh tiếp nhận & giờ hỗ trợ
| Kênh | Dùng cho | Giờ |
|---|---|---|
| Email / cổng hỗ trợ | Mọi yêu cầu | Giờ hành chính … |
| Điện thoại / chat khẩn | Chỉ P1 | … |

Yêu cầu tối thiểu khi báo: mô tả, thời điểm, người dùng bị ảnh hưởng, ảnh chụp / video, bước tái hiện.

## 3. Mức độ sự cố & thời gian
| Mức | Định nghĩa | Phản hồi đầu tiên | Khắc phục tạm thời | Khắc phục triệt để |
|---|---|---|---|---|
| P1 — Nghiêm trọng | Hệ thống ngừng / mất dữ liệu / sự cố bảo mật | … giờ | … giờ | … |
| P2 — Cao | Chức năng chính hỏng, không có cách vòng | … giờ | … | … |
| P3 — Trung bình | Có cách vòng | … ngày làm việc | — | Bản phát hành kế tiếp |
| P4 — Thấp | Giao diện, câu hỏi | … ngày làm việc | — | Theo kế hoạch |

Thời gian tính từ lúc Bên B xác nhận đã nhận đủ thông tin.

## 4. Mục tiêu khả dụng (nếu Bên B vận hành hạ tầng)
| Chỉ số (SLI) | Mục tiêu (SLO) | Cách đo | Loại trừ |
|---|---|---|---|
| Uptime trang chính | …% / tháng | Uptime monitor bên ngoài | Bảo trì có báo trước … giờ |

## 5. Báo cáo & rà soát
- Báo cáo bảo trì hằng tháng / quý: sự cố, thời gian so với SLA, cập nhật đã làm, rủi ro, chi phí hạ tầng.
- Postmortem cho mọi sự cố P1 / P2 trong … ngày làm việc.

## 6. Trách nhiệm của khách
Giữ tài khoản gốc; cấp quyền truy cập cần thiết; chỉ định đầu mối; thông báo thay đổi hạ tầng / bên thứ ba.

## 7. Thời hạn
Bảo hành: … tháng từ ngày nghiệm thu cuối. Bảo trì: theo hợp đồng riêng, gia hạn …

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh. Con số cụ thể do hai bên thoả thuận.*
