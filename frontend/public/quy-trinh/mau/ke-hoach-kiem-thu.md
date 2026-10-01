# Kế hoạch kiểm thử (Test Plan)

> **Mục đích:** thống nhất kiểm cái gì, ở tầng nào, bằng cách nào, khi nào thì dừng — trước khi bắt đầu kiểm.
> **Ai điền:** QA chủ trì; PM, BA được tham vấn; khách thống nhất mức lỗi chặn phát hành.
> **Khi nào:** giai đoạn 11 · Kiểm thử (khởi tạo sớm ngay sau khi SRS được duyệt).
> **Chuẩn tham chiếu:** ISO/IEC/IEEE 29119-3, ISTQB® CTFL v4.0. Tương thích báo cáo Test Documentation của SEP490.

---

## 1. Kiểm soát tài liệu
| Phiên bản | Ngày | Người sửa | Thay đổi |
|---|---|---|---|

## 2. Phạm vi
- **Trong phạm vi:** tính năng / yêu cầu (tham chiếu FR, NFR)
- **Ngoài phạm vi:**

## 3. Chiến lược theo cấp độ
| Cấp độ | Mục tiêu | Ai làm | Công cụ | Tự động? | Tiêu chí vào | Tiêu chí ra |
|---|---|---|---|---|---|---|
| Unit | Nghiệp vụ đúng | Dev | Vitest / JUnit 5 | ✓ CI | Mã viết xong | Pass 100%, bao phủ nghiệp vụ mới |
| Integration | API + CSDL | Dev / QA | Supertest / Postman | ✓ CI | | |
| System / E2E | Luồng chính | QA | Playwright | ✓ / tay | Build staging ổn định | |
| Hồi quy | Không vỡ cái cũ | QA | CI | ✓ | | |
| Hiệu năng / tải | Đạt NFR | QA + DevOps | k6 | ✓ | | p95 ≤ … ms ở … RPS |
| Truy cập (a11y) | WCAG 2.2 AA | QA | axe + kiểm tay | Một phần | | |
| Bảo mật | ASVS L… | AppSec | xem checklist bảo mật | Một phần | | |
| UAT | Khách chấp nhận | Khách | — | Tay | Cổng system test đạt | Biên bản ký |

## 4. Kỹ thuật thiết kế test
Phân vùng tương đương, giá trị biên, bảng quyết định, chuyển trạng thái, kiểm thử dựa trên kinh nghiệm.

## 5. Môi trường & dữ liệu kiểm thử
| Môi trường | URL | Dữ liệu | Ai chuẩn bị |
|---|---|---|---|
Dữ liệu kiểm thử **không** chứa dữ liệu cá nhân thật.

## 6. Trình duyệt / thiết bị cam kết
| Nền tảng | Phiên bản | Ưu tiên |
|---|---|---|

## 7. Quản lý lỗi
| Mức độ | Định nghĩa | Chặn phát hành? |
|---|---|---|
| Critical | Mất dữ liệu, lỗ hổng bảo mật, chức năng chính không dùng được | Có |
| High | Chức năng quan trọng sai, không có cách vòng | Có |
| Medium | Sai nhưng có cách vòng | Không (thoả thuận) |
| Low | Giao diện, chính tả | Không |

Vòng đời lỗi: Mới → Đã xác nhận → Đang sửa → Đã sửa → Kiểm lại → Đóng / Mở lại.

## 8. Tiêu chí tạm dừng / tiếp tục (Suspension / Resumption)

## 9. Lịch & nguồn lực
| Hoạt động | Từ – đến | Người |
|---|---|---|

## 10. Rủi ro kiểm thử
| Rủi ro | Biện pháp |
|---|---|

## 11. Sản phẩm bàn giao
Bộ test case, báo cáo kiểm thử, báo cáo tải, RTM cập nhật kết quả.

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh. Kiểm chính bộ kiểm trước khi tin kết quả của nó.*
