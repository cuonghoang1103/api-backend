# Kế hoạch ngừng hệ thống & biên bản xoá dữ liệu (Decommissioning Plan & Data Deletion Record)

> **Mục đích:** kết thúc vòng đời hệ thống (hoặc chuyển sang nhà cung cấp khác) mà không mất dữ liệu cần giữ, không giữ dữ liệu phải xoá, và không để lại tài nguyên "mồ côi".
> **Ai điền:** PM điều phối; Dữ liệu & AI (xuất, xoá), DevOps / Hạ tầng (tắt, huỷ), Pháp lý (nghĩa vụ lưu trữ, biên bản), AppSec (xoá an toàn, thu hồi khoá), Hỗ trợ (thông báo); khách quyết định và ký.
> **Khi nào:** giai đoạn 20 · Ngừng & chuyển giao hệ thống.
> **Chuẩn tham chiếu:** ISO/IEC/IEEE 12207:2017 (Disposal process), ISO/IEC 27001:2022 Annex A 8.10 (Information deletion), NIST SP 800-88 (Media sanitization), quy định hiện hành về dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP, Luật Bảo vệ dữ liệu cá nhân 2025 và văn bản hướng dẫn).
> ⚠️ Nghĩa vụ lưu giữ (kế toán, thuế, pháp lý) và nghĩa vụ xoá phải được luật sư / kế toán của khách xác nhận.

---

## PHẦN A — KẾ HOẠCH

| Hệ thống | Lý do ngừng | Ngày quyết định | Người quyết định | Ngày tắt dự kiến |
|---|---|---|---|---|

☐ Ngừng hẳn ☐ Chuyển sang nhà cung cấp mới: …

### A1. Kiểm kê — dữ liệu nằm ở đâu
| Nơi | Loại dữ liệu | Có dữ liệu cá nhân? | Ghi chú |
|---|---|---|---|
| CSDL production | | | |
| Lưu trữ file / object storage | | | |
| Bản sao lưu (mọi vị trí) | | | |
| Log, công cụ giám sát | | | |
| Máy dev / máy cá nhân của đội | | | |
| Bên thứ ba (email, analytics, AI, thanh toán) | | | |

### A2. Quyết định giữ / trả / xoá
| Loại dữ liệu | Hành động (trả / giữ / xoá) | Căn cứ (hợp đồng, nghĩa vụ pháp lý) | Thời hạn | Định dạng trả |
|---|---|---|---|---|

### A3. Phụ thuộc & thông báo
| Phụ thuộc (tích hợp, webhook, DNS, email, SSO) | Xử lý | Người |
|---|---|---|

| Thông báo | Đối tượng | Kênh | Trước bao lâu | Ngày gửi |
|---|---|---|---|---|

### A4. Trình tự
| # | Bước | Ngày | Người | Kiểm tra |
|---|---|---|---|---|
| 1 | Thông báo người dùng | | | |
| 2 | Xuất dữ liệu + từ điển dữ liệu + checksum (`sha256sum`) | | | Khách mở được |
| 3 | Chuyển hệ thống sang chỉ đọc | | | |
| 4 | Phiên chuyển giao cho nhà cung cấp mới (nếu có) | | | |
| 5 | Tắt dịch vụ | | | |
| 6 | Chuyển hướng / thu hồi tên miền, gỡ bản ghi DNS (chống chiếm tên miền con) | | | |
| 7 | Huỷ khoá API, webhook, chứng chỉ, giấy phép; dừng thanh toán định kỳ | | | |
| 8 | Xoá dữ liệu & bản sao lưu theo A2 | | | |
| 9 | Huỷ máy chủ / tài nguyên cloud | | | Hoá đơn kỳ sau = 0 |

## PHẦN B — BIÊN BẢN TRẢ & XOÁ DỮ LIỆU

### B1. Dữ liệu đã trả
| Gói dữ liệu | Định dạng | Kích thước | Checksum | Ngày giao | Khách xác nhận đọc được |
|---|---|---|---|---|---|

### B2. Dữ liệu đã xoá
| Nơi | Loại dữ liệu | Phương pháp xoá | Ngày | Người thực hiện | Người kiểm chứng |
|---|---|---|---|---|---|

### B3. Dữ liệu còn giữ theo nghĩa vụ
| Loại | Nơi lưu | Căn cứ | Ngày xoá dự kiến | Người chịu trách nhiệm |
|---|---|---|---|---|

### B4. Tài nguyên đã huỷ
| Tài nguyên | Nhà cung cấp | Ngày huỷ | Xác nhận |
|---|---|---|---|

| | Bên A (Khách hàng) | Bên B (Nhà cung cấp) |
|---|---|---|
| Họ tên, chức vụ | | |
| Chữ ký · ngày | | |

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh. Cần luật sư rà soát nghĩa vụ lưu giữ và xoá dữ liệu.*
