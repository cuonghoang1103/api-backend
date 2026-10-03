# Chính sách bảo hành sau bàn giao (Post-delivery Warranty Policy)

> ⚠️ **Mẫu tham khảo — là phụ lục hợp đồng, cần luật sư rà soát trước khi dùng.**
> **Mục đích:** khách biết rõ sau khi nghiệm thu thì **cái gì được sửa miễn phí, trong bao lâu, nhanh đến mức nào**, và cái gì không thuộc bảo hành — để tránh tranh cãi "đây là lỗi hay yêu cầu mới".
> **Ai điền:** Hỗ trợ & Chăm sóc khách hàng soạn cùng PM; DevOps + QA góp phần mức độ và quy trình; Pháp lý rà soát; khách ký kèm hợp đồng / biên bản bàn giao.
> **Khi nào:** chốt điều khoản ở giai đoạn 04 (hợp đồng), **trao cho khách ở giai đoạn 16 · Triển khai & bàn giao**, có hiệu lực suốt giai đoạn 18 · Bảo hành, vận hành & bảo trì.
> **Quan hệ với SLA:** chính sách này viết cho **người dùng phía khách** đọc hiểu; con số cam kết chi tiết (phản hồi, khả dụng) nằm trong SLA bảo trì (`sla-bao-tri.md`). Hai tài liệu phải khớp số với nhau.
> **Chuẩn tham chiếu:** ITIL® 4 (Incident management), ISO/IEC/IEEE 14764:2022 (corrective maintenance).

---

## 1. Thông tin
| Dự án / sản phẩm | Hợp đồng / SOW | Ngày nghiệm thu cuối | Phiên bản bàn giao |
|---|---|---|---|
| [...] | [...] | [...] | [...] |

## 2. Thời hạn bảo hành
- **[...] tháng** kể từ ngày ký biên bản nghiệm thu cuối (hoặc nghiệm thu từng mốc — ghi rõ: [...]).
- Lỗi được báo **trong** thời hạn mà sửa xong sau thời hạn vẫn được bảo hành.
- Sau thời hạn: hỗ trợ theo gói bảo trì (nếu có) hoặc báo giá theo vụ việc.

## 3. Phạm vi bảo hành
**Lỗi (defect)** = sản phẩm hoạt động **khác với đặc tả / tiêu chí nghiệm thu đã được hai bên duyệt** (SRS phiên bản [...], các CR đã duyệt), trên môi trường được hỗ trợ.

| Được bảo hành ✓ | Không được bảo hành ✗ |
|---|---|
| Chức năng chạy sai so với đặc tả đã duyệt | **Yêu cầu mới** hoặc thay đổi hành vi so với đặc tả → đi qua Phiếu yêu cầu thay đổi (CR) |
| Lỗi dữ liệu do mã của Bên B gây ra (kèm khôi phục từ sao lưu nếu Bên B vận hành) | Lỗi do **bên thứ ba**: dịch vụ / API ngoài thay đổi hoặc ngừng, nhà cung cấp hạ tầng sự cố, thư viện bên ngoài thay đổi hành vi |
| Lỗ hổng bảo mật trong mã do Bên B viết | Lỗi phát sinh do **khách hoặc bên khác tự sửa** mã, cấu hình, cơ sở dữ liệu, hạ tầng |
| Lỗi hiển thị trên trình duyệt / thiết bị trong danh sách hỗ trợ | Môi trường **ngoài** danh sách hỗ trợ (trình duyệt cũ, hệ điều hành chưa cam kết...) |
| Tài liệu bàn giao sai với hệ thống thật | Sử dụng sai hướng dẫn, nhập dữ liệu sai, mất tài khoản do lộ mật khẩu phía khách |
| | Nâng cấp phiên bản nền tảng / thư viện theo kế hoạch, tối ưu hiệu năng vượt chỉ tiêu đã chốt |
| | Nội dung, dữ liệu nghiệp vụ, đào tạo bổ sung |

> Trường hợp chưa rõ là lỗi hay yêu cầu mới: Bên B phân tích và trả lời kèm căn cứ (đoạn đặc tả liên quan) trong [...] ngày làm việc; hai bên không thống nhất thì đưa lên PM hai bên theo kế hoạch giao tiếp & leo thang.

## 4. Mức độ nghiêm trọng & thời gian phản hồi
Thời gian **để trống cho hai bên thoả thuận**; phải khớp với SLA bảo trì.

| Mức | Định nghĩa | Ví dụ | Phản hồi đầu tiên | Khắc phục tạm thời | Khắc phục triệt để |
|---|---|---|---|---|---|
| **P1 — Nghiêm trọng** | Hệ thống ngừng, mất / lộ dữ liệu, sự cố bảo mật, không có cách vòng | Không đăng nhập được toàn hệ thống | [...] | [...] | [...] |
| **P2 — Cao** | Chức năng chính hỏng, ảnh hưởng nhiều người dùng, không có cách vòng | Không thanh toán được đơn hàng | [...] | [...] | [...] |
| **P3 — Trung bình** | Chức năng hỏng nhưng có cách vòng, hoặc ảnh hưởng ít người | Xuất báo cáo sai định dạng, có thể xuất lại thủ công | [...] | — | [...] |
| **P4 — Thấp** | Giao diện, chính tả, câu hỏi cách dùng | Lệch căn lề trên một màn hình | [...] | — | [...] |

*Cột "Ví dụ" chỉ là **ví dụ minh hoạ** để phân loại — không phải cam kết. Cách đo thời gian: tính từ lúc Bên B xác nhận đã nhận đủ thông tin; [giờ hành chính / 24×7] đối với từng mức: [...].*

Phân loại mức do Bên B đề xuất khi tiếp nhận; khách có quyền yêu cầu nâng mức kèm lý do.

## 5. Quy trình báo lỗi
1. **Báo** qua kênh chính thức: [cổng hỗ trợ / email ... / số điện thoại khẩn chỉ cho P1]. Báo qua kênh khác (tin nhắn cá nhân...) chưa được tính giờ.
2. **Thông tin tối thiểu:** mô tả, thời điểm, tài khoản / người dùng bị ảnh hưởng, bước tái hiện, kết quả mong đợi vs thực tế, ảnh chụp / video, mức độ đề xuất.
3. **Tiếp nhận:** Bên B cấp mã phiếu, xác nhận mức độ, phản hồi trong thời gian ở mục 4.
4. **Xử lý:** khắc phục tạm thời (nếu cần) → sửa triệt để → kiểm thử hồi quy → phát hành theo quy trình phát hành.
5. **Xác nhận:** khách xác nhận đã khắc phục trong [...] ngày làm việc; quá hạn không phản hồi thì phiếu được đóng [thoả thuận].
6. **Sau sự cố P1 / P2:** Bên B gửi báo cáo sự cố (postmortem) trong [...] ngày làm việc — xem `bao-cao-su-co-postmortem.md`.

## 6. Trách nhiệm của khách để bảo hành có hiệu lực
- Cử đầu mối tiếp nhận và xác nhận; cung cấp quyền truy cập cần cho chẩn đoán;
- Không tự sửa mã / cấu hình trên môi trường do Bên B bàn giao khi chưa báo Bên B (hoặc ghi lại thay đổi);
- Duy trì các dịch vụ bên thứ ba đứng tên khách (tên miền, cloud, API trả phí) còn hiệu lực.

## 7. Giới hạn
- Bảo hành là sửa lỗi; không bao gồm bồi thường thiệt hại gián tiếp — giới hạn trách nhiệm theo hợp đồng chính.
- Chính sách này không làm giảm quyền của khách theo pháp luật.

| | Đại diện khách | Đại diện Bên B |
|---|---|---|
| Họ tên, chức vụ | | |
| Chữ ký | | |
| Ngày | | |

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh. Thời hạn và thời gian phản hồi do hai bên thoả thuận.*
