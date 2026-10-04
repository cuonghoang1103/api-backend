# Bộ test case (Test Cases)

> **Mục đích:** mỗi yêu cầu có ít nhất một test case truy vết được; ai cũng chạy lại được và ra cùng kết quả.
> **Ai điền:** QA (system / E2E), Dev (unit / integration — có thể ở dạng mã).
> **Khi nào:** giai đoạn 11 · Kiểm thử; thiết kế ngay khi tiêu chí chấp nhận được duyệt.
> **Gợi ý:** với bảng tính (Excel / Google Sheets) giữ mỗi tính năng một sheet và một sheet thống kê — như khung Unit / Integration / System Test của SEP490.

---

## Thông tin bộ test
| Tính năng / mô-đun | Phiên bản build | Người thiết kế | Ngày |
|---|---|---|---|

## Danh sách test case
| ID | Yêu cầu (FR / NFR / UC) | Tiêu đề | Tiền điều kiện | Dữ liệu kiểm | Các bước | Kết quả mong đợi | Ưu tiên | Loại (chức năng / biên / lỗi / bảo mật / a11y) | Kết quả (Pass / Fail / Blocked / N/A) | Mã lỗi | Người chạy · ngày |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-001 | FR-01 | Đăng nhập thành công | Có tài khoản hoạt động | email hợp lệ, mật khẩu đúng | 1. Mở trang đăng nhập 2. Nhập … 3. Bấm Đăng nhập | Vào trang chủ, hiện tên người dùng | Cao | Chức năng | | | |
| TC-002 | FR-01 | Sai mật khẩu 5 lần | | | | Khoá tạm thời, thông báo nói cách mở | Cao | Bảo mật | | | |
| TC-003 | FR-01 | Email dài đúng 254 ký tự | | | | Chấp nhận | Trung bình | Biên | | | |

## Thống kê
| Tổng | Pass | Fail | Blocked | N/A | Chưa chạy | % hoàn thành |
|---|---|---|---|---|---|---|

## Gherkin (khi viết tự động)
```gherkin
Feature: Đăng nhập
  Scenario: Đăng nhập thành công
    Given người dùng có tài khoản đang hoạt động
    When người dùng đăng nhập bằng email và mật khẩu đúng
    Then người dùng thấy trang chủ với tên của mình
```

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh.*
