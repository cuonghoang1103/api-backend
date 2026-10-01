# Kế hoạch quản lý dự án (Project Management Plan)

> **Mục đích:** một tài liệu cho biết dự án sẽ được điều hành thế nào: phạm vi, lịch, nguồn lực, chất lượng, rủi ro, truyền thông, cấu hình — và là **baseline** để đo tiến độ.
> **Ai điền:** PM chủ trì; PMO duyệt baseline; khách được tham vấn.
> **Khi nào:** giai đoạn 08 · Lập kế hoạch & thiết lập dự án; cập nhật khi baseline thay đổi (qua CR).
> **Chuẩn tham chiếu:** PMBOK® Guide 7th ed., ISO 21502:2020, The Scrum Guide (2020). Khung tương thích báo cáo Project Management Plan của SEP490.

---

## I. Kiểm soát tài liệu
| Phiên bản | Ngày | Người sửa | Thay đổi | Baseline? |
|---|---|---|---|---|

## 1. Tổng quan
### 1.1 Mục tiêu dự án (đo được)
### 1.2 Ước lượng công & thời gian theo gói việc (work package)
| # | Gói việc | Công ước tính (người-ngày) | Hạn |
|---|---|---|---|
### 1.3 Rủi ro chính — xem Sổ đăng ký rủi ro

## 2. Cách tiếp cận
### 2.1 Quy trình
Vòng đời 21 giai đoạn của https://cuongthai.com/about/quy-trinh, triển khai bằng sprint … tuần.
### 2.2 Definition of Ready / Definition of Done
**DoR:** story có tiêu chí chấp nhận, thiết kế đã duyệt, phụ thuộc đã rõ, ước lượng xong.
**DoD:**
- [ ] Mã đã review, CI xanh (lint, kiểm kiểu, test, build)
- [ ] Có test cho nghiệp vụ mới; đạt tiêu chí chấp nhận
- [ ] Chạy trên staging
- [ ] Tài liệu API / người dùng cập nhật
- [ ] Không log dữ liệu cá nhân / bí mật
### 2.3 Quản lý chất lượng
Cổng chất lượng mỗi giai đoạn (entry / exit criteria), review mã, kiểm thử, kiểm bảo mật.
### 2.4 Kế hoạch đào tạo đội (nếu cần)

## 3. Phân công trách nhiệm (RACI)
| Hoạt động | Sales | BA | UX | Kiến trúc | PM | Dev | QA | AppSec | DevOps | Hạ tầng | Dữ liệu | Hỗ trợ | Pháp lý | PMO | Khách |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

## 4. Truyền thông
| Thông tin | Người nhận | Kênh | Tần suất | Người gửi |
|---|---|---|---|---|
| Báo cáo tuần | Khách, PMO | Email | Hằng tuần | PM |
| Demo | Khách | Họp trực tuyến | Cuối sprint | Dev |
| Cảnh báo rủi ro cao | Nhà tài trợ | Email / gọi | Khi phát sinh | PM |

Đường leo thang: đầu mối → PM → nhà tài trợ.

## 5. Quản lý cấu hình
### 5.1 Tài liệu: nơi lưu, quy ước tên, phiên bản
### 5.2 Mã nguồn: repo, quy ước nhánh, bảo vệ main, Conventional Commits, SemVer
### 5.3 Công cụ & hạ tầng
| Công cụ | Mục đích | Đứng tên |
|---|---|---|

## 6. Môi trường
| Môi trường | URL | CSDL riêng | Ai truy cập | Dữ liệu |
|---|---|---|---|---|
| dev | | ✓ | Đội | Giả lập |
| staging | | ✓ | Đội, khách | Ẩn danh |
| production | | ✓ | Hạn chế | Thật |

## 7. Lịch sprint
| Sprint | Từ – đến | Mục tiêu | Demo |
|---|---|---|---|

## 8. Duyệt baseline
| Vai trò | Họ tên | Ngày |
|---|---|---|
| PM | | |
| PMO | | |

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh.*
