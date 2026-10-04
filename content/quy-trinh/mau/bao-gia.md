# Báo giá (Quotation)

> ⚠️ **MẪU THAM KHẢO — CẦN KẾ TOÁN VÀ LUẬT SƯ RÀ SOÁT TRƯỚC KHI SỬ DỤNG.** Cách tính thuế, hoá đơn và hiệu lực pháp lý của báo giá phải được kế toán / luật sư kiểm tra cho từng giao dịch.
>
> **Mục đích:** biến đề xuất giải pháp đã được khách đồng ý về hướng đi thành **con số có điều kiện**: làm gì, tính theo đơn vị nào, giá dựa trên giả định nào, cái gì **không** nằm trong giá, giá còn hiệu lực đến bao giờ, và trả tiền theo mốc nào.
> **Ai điền:** Kinh doanh chủ trì; PM + Kiến trúc giải pháp cung cấp hạng mục và ước lượng (từ WBS của đề xuất); Pháp lý & Tài chính duyệt giá, thuế và điều khoản thanh toán; người có thẩm quyền ký.
> **Khi nào:** giai đoạn 03 · Đề xuất giải pháp & ước lượng — gửi **riêng** sau (hoặc kèm) bản đề xuất; con số chốt được đưa vào SOW ở giai đoạn 04. Dùng lại cho mỗi yêu cầu thay đổi (CR) có phát sinh phí và cho lộ trình v2 (giai đoạn 19).
> **Lưu ý:** mẫu **không** chứa giá. Mọi ô đơn giá, tỷ lệ % và tổng tiền để trống cho người điền. Báo giá **không công bố** ra ngoài.

---

## 0. Thông tin báo giá
| Số báo giá | Phiên bản | Ngày lập | Hiệu lực đến | Tham chiếu đề xuất |
|---|---|---|---|---|
| [...] | [v1.0] | [...] | [...] | [số / phiên bản đề xuất giải pháp] |

| | Bên nhận báo giá | Bên báo giá |
|---|---|---|
| Tên tổ chức / cá nhân | [...] | [...] |
| Mã số thuế | [...] | [...] |
| Địa chỉ | [...] | [...] |
| Người liên hệ · email · điện thoại | [...] | [...] |

## 1. Mô hình tính giá (chọn một)
- [ ] **Trọn gói (fixed price)** — giá cố định cho phạm vi đã chốt; thay đổi phạm vi đi qua CR.
- [ ] **Theo giờ công (time & materials)** — tính theo giờ thực tế, có trần ước lượng và báo cáo giờ [hằng tuần].
- [ ] **Theo sprint / đội cố định** — giá mỗi sprint [... tuần] cho một đội [thành phần ...].
- [ ] **Gói bảo trì** — phí định kỳ cho số giờ / mức SLA đã chọn.

## 2. Bảng hạng mục (Line items)
| # | Hạng mục | Mô tả / sản phẩm bàn giao | Đơn vị | Số lượng | Đơn giá | Thành tiền |
|---|---|---|---|---|---|---|
| 1 | Khảo sát & đặc tả yêu cầu | SRS, user story, tiêu chí nghiệm thu | [giờ công / gói] | [...] | [...] | [...] |
| 2 | Thiết kế UX/UI | Wireframe, prototype, design system | [giờ công / gói / màn hình] | [...] | [...] | [...] |
| 3 | Phát triển — [phân hệ / tính năng] | [...] | [giờ công / gói] | [...] | [...] | [...] |
| 4 | Phát triển — [phân hệ / tính năng] | [...] | [giờ công / gói] | [...] | [...] | [...] |
| 5 | Kiểm thử & bảo đảm chất lượng | Kế hoạch, test case, báo cáo kiểm thử | [giờ công / gói] | [...] | [...] | [...] |
| 6 | Hạ tầng, CI/CD & triển khai | [...] | [gói] | [...] | [...] | [...] |
| 7 | Chuyển dữ liệu (nếu có) | [...] | [giờ công / gói] | [...] | [...] | [...] |
| 8 | Đào tạo & bàn giao | Tài liệu, buổi đào tạo [... buổi] | [buổi / gói] | [...] | [...] | [...] |
| 9 | Quản lý dự án | [...] | [giờ công / % tổng — ghi rõ] | [...] | [...] | [...] |
| | **Cộng trước thuế** | | | | | [...] |

### 2a. Đơn giá theo vai trò (chỉ với mô hình theo giờ công / sprint)
| Vai trò | Đơn giá / giờ | Ghi chú |
|---|---|---|
| [PM / BA / Dev / QA / DevOps / Designer] | [...] | [...] |

### 2b. Chi phí bên thứ ba (thu hộ hoặc khách tự trả)
| Khoản | Nhà cung cấp | Đứng tên ai | Ai trả | Ước tính / tháng | Ghi chú |
|---|---|---|---|---|---|
| Hạ tầng cloud / máy chủ | [...] | [khách — khuyến nghị] | [...] | [...] | Giá biến động theo mức dùng |
| Tên miền, chứng chỉ | [...] | [...] | [...] | [...] | |
| Dịch vụ / API trả phí (email, SMS, bản đồ, LLM, thanh toán...) | [...] | [...] | [...] | [...] | Theo bảng giá của nhà cung cấp |
| Giấy phép phần mềm | [...] | [...] | [...] | [...] | |

## 3. Giả định (Assumptions)
Giá chỉ đúng khi các giả định sau đúng. Giả định sai → đánh giá lại qua CR.
- Phạm vi đúng như đề xuất giải pháp / SRS phiên bản [...]; tổng số màn hình / tính năng: [...].
- Khách cung cấp đầu mối ra quyết định, phản hồi trong [...] ngày làm việc; tài liệu, dữ liệu mẫu, quyền truy cập đúng hạn.
- Số vòng chỉnh sửa thiết kế: [...] vòng / màn hình.
- Nền tảng hỗ trợ: [trình duyệt / phiên bản iOS / Android ...].
- Tích hợp với hệ thống bên thứ ba [...] có tài liệu API và môi trường thử.
- Ngôn ngữ giao diện: [...]. Dữ liệu cần chuyển: [... bản ghi, định dạng ...].
- [...]

## 4. Ngoài phạm vi (Out of scope)
Không nằm trong giá trừ khi được ghi ở bảng hạng mục:
- Tính năng / yêu cầu mới phát sinh sau khi chốt phạm vi (đi qua CR, báo giá riêng);
- Nội dung (bài viết, hình ảnh, bản dịch), nhập liệu thủ công;
- Chi phí bên thứ ba ở mục 2b;
- Vận hành, bảo trì sau thời gian bảo hành (báo giá gói bảo trì riêng);
- Chứng nhận / kiểm định bởi bên thứ ba (pentest độc lập, chứng nhận tiêu chuẩn...);
- [...]

## 5. Lịch thực hiện (ước tính)
| Mốc | Sản phẩm bàn giao | Thời gian dự kiến |
|---|---|---|
| M1 | [...] | [... tuần từ ngày ký] |
| M2 | [...] | [...] |
| M3 — Nghiệm thu cuối | [...] | [...] |

## 6. Lịch thanh toán theo mốc (Payment schedule)
| Đợt | Điều kiện (gắn biên bản nghiệm thu mốc) | Tỷ lệ | Số tiền |
|---|---|---|---|
| Tạm ứng | Ký hợp đồng | [...]% | [...] |
| Đợt 2 | Nghiệm thu M1 | [...]% | [...] |
| Đợt 3 | Nghiệm thu M2 | [...]% | [...] |
| Đợt cuối | Nghiệm thu cuối & bàn giao | [...]% | [...] |
| | **Tổng** | 100% | [...] |

Thời hạn thanh toán: [...] ngày kể từ ngày nhận hoá đơn hợp lệ. Hình thức: chuyển khoản vào tài khoản [...]. Chậm thanh toán: [điều khoản trong hợp đồng].

## 7. Thuế (VAT) & hoá đơn
- Đơn giá trên **[chưa bao gồm / đã bao gồm]** thuế giá trị gia tăng (GTGT).
- Thuế suất áp dụng: **[... % / không chịu thuế — kế toán xác định theo từng hạng mục]**. Sản phẩm và dịch vụ phần mềm, dịch vụ hạ tầng, đào tạo, thiết bị có thể có cách xử lý thuế khác nhau — **không tự áp một mức cho cả bảng**.
- Hoá đơn điện tử phát hành theo quy định hiện hành, tại thời điểm [...].
- Thuế nhà thầu / khấu trừ tại nguồn (nếu bên báo giá là cá nhân hoặc tổ chức nước ngoài): [kế toán xác định].

| | Số tiền |
|---|---|
| Cộng trước thuế | [...] |
| Thuế GTGT [...]% | [...] |
| **Tổng cộng** | [...] |
| Bằng chữ | [...] |

## 8. Hiệu lực & điều kiện
- Báo giá có hiệu lực **[...] ngày** kể từ ngày lập. Sau thời hạn, giá và lịch có thể thay đổi.
- Báo giá không phải hợp đồng; quan hệ hai bên chỉ phát sinh khi ký hợp đồng / SOW.
- Bảo hành: [... tháng] sau nghiệm thu cuối, theo chính sách bảo hành đính kèm (xem `chinh-sach-bao-hanh.md`).
- Quyền sở hữu sản phẩm: theo hợp đồng (thường chuyển giao khi thanh toán đủ).

| | Người lập | Người duyệt |
|---|---|---|
| Họ tên, chức vụ | | |
| Chữ ký | | |
| Ngày | | |

---

### Checklist nội bộ trước khi gửi
- [ ] Mỗi hạng mục truy được về WBS / ước lượng trong đề xuất (không có con số "bịa cho tròn")
- [ ] Giả định và ngoài phạm vi đã được PM + Kiến trúc giải pháp đọc lại
- [ ] Kế toán xác nhận thuế suất từng hạng mục
- [ ] Tổng % lịch thanh toán = 100%; đợt cuối gắn nghiệm thu, không gắn ngày
- [ ] Ngày hết hiệu lực đã ghi vào lịch theo dõi bán hàng

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh. Con số cụ thể do hai bên thoả thuận; kế toán / luật sư rà soát trước khi gửi.*
