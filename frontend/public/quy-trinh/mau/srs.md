# Đặc tả yêu cầu phần mềm (Software Requirements Specification — SRS)

> **Mục đích:** biến mong muốn thành yêu cầu kiểm chứng được; là căn cứ thiết kế, kiểm thử và nghiệm thu.
> **Ai điền:** BA chủ trì; QA bảo đảm tính kiểm thử được; Kiến trúc chốt NFR; Bảo mật đóng góp yêu cầu bảo mật; khách ký duyệt.
> **Khi nào:** giai đoạn 05 · Đặc tả yêu cầu. Cập nhật khi có CR được duyệt.
> **Chuẩn tham chiếu:** ISO/IEC/IEEE 29148:2018, ISO/IEC 25010:2023. Khung đề mục tương thích báo cáo SRS của đồ án SEP490 (FPTU).

---

## I. Kiểm soát tài liệu (Record of Changes)
| Ngày | A/M/D | Người phụ trách | Mô tả thay đổi | Tham chiếu CR |
|---|---|---|---|---|
| | A | | Bản đầu v0.1 | — |

## II. Đặc tả

### 1. Tổng quan yêu cầu
#### 1.1 Sơ đồ ngữ cảnh (Context Diagram)
#### 1.2 Luồng nghiệp vụ chính (Main Workflows)
Mỗi luồng một mục 1.2.x, mô tả từng bước và ai làm.
#### 1.3 Yêu cầu người dùng
##### 1.3.1 Tác nhân (Actors)
| # | Tác nhân | Mô tả |
|---|---|---|
##### 1.3.2 Use case
| ID | Use case | Tính năng | Tác nhân | Mô tả ngắn |
|---|---|---|---|---|
##### 1.3.3 Sơ đồ use case
#### 1.4 Chức năng hệ thống
##### 1.4.1 Màn hình & luồng màn hình (Screen flow)
##### 1.4.2 Ma trận phân quyền màn hình (Screen authorization)
| Màn hình | Tác nhân 1 | Tác nhân 2 | … |
|---|---|---|---|
#### 1.5 Sơ đồ quan hệ thực thể (ERD — mức khái niệm)

### 2. Đặc tả use case
Nhân bản cho mỗi use case:

| Trường | Nội dung |
|---|---|
| ID · Tên | UC-xx |
| Tác nhân | |
| Mô tả | |
| Điều kiện kích hoạt (Trigger) | |
| Tiền điều kiện | |
| Hậu điều kiện | |
| Luồng chính | 1. … |
| Luồng thay thế | |
| Ngoại lệ | |
| Quy tắc nghiệp vụ | BR-xx |

### 3. Yêu cầu chức năng (Functional Requirements)
| ID | Yêu cầu | Ưu tiên (MoSCoW) | Use case | Tiêu chí chấp nhận |
|---|---|---|---|---|
| FR-01 | | Must | UC-01 | Given … When … Then … |

### 4. Yêu cầu phi chức năng (Non-functional Requirements)
#### 4.1 Giao diện ngoài (External interfaces)
#### 4.2 Thuộc tính chất lượng — mỗi NFR phải có **số đo** và **cách đo**
| ID | Đặc tính (ISO/IEC 25010) | Yêu cầu | Số đo mục tiêu | Cách đo |
|---|---|---|---|---|
| NFR-01 | Hiệu năng | Trang chính tải nhanh trên 4G | LCP < 2,5 s (p75) | PageSpeed / RUM |
| NFR-02 | Khả dụng | | Uptime ≥ …% / tháng | Uptime monitor |
| NFR-03 | Bảo mật | | Đạt OWASP ASVS L… | Checklist ASVS |
| NFR-04 | Truy cập | | WCAG 2.2 AA | axe + kiểm tay |
| NFR-05 | Sao lưu & phục hồi | | RPO … / RTO … | Thử khôi phục |

### 5. Phụ lục yêu cầu
#### 5.1 Quy tắc nghiệp vụ (Business Rules)
| ID | Quy tắc |
|---|---|
#### 5.2 Thông báo hệ thống (System Messages)
| ID | Ngữ cảnh | Nội dung (vi / en) |
|---|---|---|
#### 5.3 Dữ liệu cá nhân
| Dữ liệu | Mục đích | Cơ sở xử lý | Thời hạn lưu | Ai được xem |
|---|---|---|---|---|

### 6. Ma trận truy vết (RTM)
| Yêu cầu | Use case | Thiết kế (SDD mục) | Test case | Kết quả |
|---|---|---|---|---|

## III. Ký duyệt
| Bên | Họ tên | Vai trò | Phiên bản | Ngày | Chữ ký |
|---|---|---|---|---|---|

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh. Không dùng từ mơ hồ ("nhanh", "thân thiện") khi không có số đo.*
