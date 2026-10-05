# Checklist Spec Fidelity cho đặc tả (Spec Fidelity Checklist)

> **Mục đích:** trước khi ký duyệt SRS và trước khi giao yêu cầu cho AI sinh mã hay sinh test, chấm từng yêu cầu theo bốn chiều — đầy đủ, nhất quán, một nghĩa, kiểm chứng được. AI làm đúng theo chữ viết ra, kể cả chỗ thiếu; checklist này bắt chỗ thiếu trước khi nó thành mã.
> **Ai điền:** BA viết đặc tả; **một người khác người viết** (QA hoặc BA thứ hai) chấm; Kiến trúc chấm phần NFR; khách hàng xác nhận ngưỡng đạt.
> **Khi nào:** giai đoạn 05 · Đặc tả yêu cầu — trước khi ký SRS; chấm lại phần yêu cầu bị đổi sau mỗi phiếu CR.
> **Chuẩn tham chiếu:** ISO/IEC/IEEE 29148:2018 (đặc tính của yêu cầu tốt và của bộ yêu cầu: unambiguous, complete, consistent, verifiable, ...). Bốn chiều "Spec Fidelity" theo báo cáo kỹ thuật SDAD — Vu Hung Nguyen & Thanh Nguyen, arXiv:2608.20341 (technical report, chưa bình duyệt).

---

| Dự án | Phiên bản SRS | Người viết | Người chấm | Ngày |
|---|---|---|---|---|
| [...] | [v...] | [...] | [...] | [...] |

**Ngưỡng đạt (hai bên thoả thuận, ghi trong SOW):** [vd: mọi yêu cầu của sprint đầu đạt cả 4 chiều; yêu cầu còn lại không có lỗi ở chiều Kiểm chứng được]. Không có ngưỡng mặc định — chọn theo rủi ro dự án.

Cột **KQ**: ✓ đạt · ✗ không đạt · N/A — kèm ghi chú / ID yêu cầu cần sửa.

## 1. Đầy đủ (Completeness)
Có cả trường hợp biên và lúc hỏng, không chỉ đường thuận.

| # | Kiểm | KQ | Ghi chú |
|---|---|---|---|
| 1.1 | Mỗi yêu cầu có ID duy nhất và nằm trong RTM | | |
| 1.2 | Mỗi luồng chính có kịch bản lỗi: dữ liệu sai, hết quyền, trùng, hết hạn, mất kết nối | | |
| 1.3 | Giá trị biên được nêu (tối thiểu / tối đa / rỗng / quá dài) | | |
| 1.4 | Mỗi vai trò trong ma trận phân quyền có quy định cho mọi màn hình / API liên quan | | |
| 1.5 | Thông báo hệ thống và lỗi được liệt kê, có ID (vd MSG-07) | | |
| 1.6 | NFR đủ nhóm: hiệu năng, khả dụng, bảo mật, truy cập, sao lưu, thiết bị hỗ trợ | | |
| 1.7 | Dữ liệu cá nhân: thu gì, vì sao, giữ bao lâu, ai xem | | |

## 2. Nhất quán (Consistency)
Các yêu cầu không cãi nhau, cũng không cãi tài liệu khác.

| # | Kiểm | KQ | Ghi chú |
|---|---|---|---|
| 2.1 | Không có hai quy tắc nghiệp vụ mâu thuẫn (đọc chéo theo đối tượng: lịch, đơn, tài khoản, ...) | | |
| 2.2 | Cùng một khái niệm dùng cùng một tên trong toàn bộ SRS (có bảng thuật ngữ) | | |
| 2.3 | Yêu cầu khớp phạm vi trong SOW; phần ngoài phạm vi được ghi rõ | | |
| 2.4 | Ma trận phân quyền khớp use case và user story | | |
| 2.5 | NFR không xung đột nhau (vd thời gian phản hồi vs mức mã hoá / sao lưu) — nếu có thì ghi ưu tiên | | |

## 3. Một nghĩa (Unambiguity)
Hai người đọc hiểu giống nhau, đọc lại tuần sau vẫn hiểu như cũ.

| # | Kiểm | KQ | Ghi chú |
|---|---|---|---|
| 3.1 | Không có từ mơ hồ thiếu số đo: "nhanh", "thân thiện", "dễ dùng", "nhiều", "hợp lý", "v.v." | | |
| 3.2 | Mỗi câu yêu cầu chỉ nói một điều (không gộp nhiều yêu cầu bằng "và / hoặc") | | |
| 3.3 | Chủ ngữ rõ: ai / hệ thống nào làm hành động | | |
| 3.4 | Đơn vị, múi giờ, định dạng số / tiền / ngày được ghi rõ | | |
| 3.5 | Yêu cầu nói "cái gì", không trộn giải pháp giao diện ("nút màu xanh ở góc phải") trừ khi đó là ràng buộc thật | | |

## 4. Kiểm chứng được (Verifiability)
Viết được phép kiểm đạt / không đạt khách quan — tốt nhất là tự động.

| # | Kiểm | KQ | Ghi chú |
|---|---|---|---|
| 4.1 | Mỗi story có tiêu chí chấp nhận Given / When / Then | | |
| 4.2 | Mỗi NFR có số mục tiêu **và** cách đo (công cụ, điều kiện, phân vị) | | |
| 4.3 | Mỗi yêu cầu ánh xạ được tới ít nhất một test case trong RTM | | |
| 4.4 | Kết quả mong đợi quan sát được từ bên ngoài (giao diện, API, CSDL, email) | | |

## Ví dụ viết lại
| Chiều | Viết chưa tốt | Viết tốt |
|---|---|---|
| Đầy đủ | Sinh viên đặt lịch dùng phòng lab. | Sinh viên đặt lịch phòng còn trống. Nếu khung giờ đã kín, hệ thống từ chối và hiện MSG-07. Nếu mất kết nối giữa chừng, không tạo lịch dở dang. |
| Nhất quán | BR-03: được huỷ lịch bất cứ lúc nào · BR-11: không được huỷ trong 24 giờ trước giờ dùng. | BR-03: sinh viên huỷ được đến 24 giờ trước giờ dùng; sau mốc đó chỉ quản lý lab huỷ được (xem BR-11). |
| Một nghĩa | Trang danh sách thiết bị phải tải nhanh. | Trang danh sách thiết bị (500 thiết bị) có LCP dưới 2,5 giây ở phân vị 75 trên mạng 4G. |
| Kiểm chứng được | Hệ thống thân thiện với người dùng. | Given sinh viên đã đăng nhập, When đặt một phòng còn trống, Then lịch hiện trong "Lịch của tôi" và email xác nhận được gửi trong vòng 1 phút. |

## Kết luận
| Chiều | Số yêu cầu chấm | Số không đạt | ID cần sửa |
|---|---|---|---|
| Đầy đủ | | | |
| Nhất quán | | | |
| Một nghĩa | | | |
| Kiểm chứng được | | | |

☐ Đạt ngưỡng — được ký SRS và giao việc (kể cả giao cho AI) ☐ Chưa đạt — trả BA sửa, chấm lại

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh.*
