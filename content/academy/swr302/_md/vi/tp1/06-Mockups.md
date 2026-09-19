# Mock-up cho các use case phức tạp
## cho Hệ thống Học vụ và Đăng ký môn (CARS)

Phiên bản 1.0 đã duyệt
Người soạn: **<Tên thành viên 4>**, Nhóm Phân tích nghiệp vụ — Nhóm <N>
Northern Regional University (NRU)
17 tháng 9 năm 2026

---

## 1. Mục đích và cách tiếp cận

Theo Wiegers & Beatty chương 15, đây là **mock-up dùng một lần, độ trung thực thấp**.
Nhiệm vụ của chúng là để một bên liên quan nói được câu "không, ý tôi không phải thế" —
chứ không phải để trông như đã hoàn thiện. Chúng cố ý để màu xám: một mock-up bóng bẩy
sẽ kéo câu chuyện sang màu sắc, và làm ban lãnh đạo tưởng hệ thống sắp xong tới nơi.

**SRS vẫn là nguồn sự thật.** Chỗ nào mock-up và SRS nói khác nhau thì SRS đúng.

## 2. Ba cái này được chọn thế nào

*Phức tạp* nghĩa là nhiều quyết định và nhiều trạng thái, không phải nhiều ô nhập. Các
ứng viên được xếp hạng theo: luồng thay thế + ngoại lệ + số actor tham gia:

| Use case | Luồng thay thế | Ngoại lệ | Actor | Tổng | Được chọn |
|---|---|---|---|---|---|
| **UC-03** Đăng ký vào một lớp học phần | 4 | **7** | 3 | **14** | ✅ |
| **UC-06** Xin và quyết định vượt sĩ số | 4 | 5 | 4 | **13** | ✅ |
| **UC-09** Xem kiểm tra tiến độ tốt nghiệp thời gian thực | 4 | 4 | 2 | **10** | ✅ |
| UC-07 Danh sách chờ và thăng suất | 4 | 4 | 2 | 10 | — đã được đường từ chối của M1 phủ |
| UC-11 Huỷ lớp không đủ sĩ số | 3 | 4 | 4 | 11 | hoãn sang bản 1.2 |
| UC-02 Dựng thời khoá biểu dự kiến | 3 | 3 | 1 | 7 | — |

UC-11 có điểm cao nhưng bị hoãn sang bản 1.2, nên làm bản mẫu cho nó lúc này là thiết kế
một thứ năm nay không ai dựng. UC-03 là lựa chọn hiển nhiên đứng đầu: bảy ngoại lệ, nhiều
hơn bất kỳ use case nào khác trong hệ thống, và nó chính là giao dịch mà cả dự án sinh ra
để sửa.

## 3. Các mock-up

| # | Tệp | Use case | Luồng được thể hiện | Trạng thái |
|---|---|---|---|---|
| **M1** | `mockups/M1-UC03-register-refused.png` | UC-03 | Ngoại lệ 3.0.E1 | **Từ chối** |
| **M2** | `mockups/M2-UC06-override-decision.png` | UC-06 | Luồng chính 6.0 + ngoại lệ 6.0.E1 | Màn hình người quyết định, **đã quá hạn** |
| **M3** | `mockups/M3-UC09-degree-audit.png` | UC-09 | Luồng chính 9.0 + luồng thay thế 9.1 + ngoại lệ 9.0.E1 | **Không đánh giá được một nhóm điều kiện** |

Bản nguồn sửa được của từng cái là tệp `.html` tương ứng trong thư mục `mockups/`.

### 3.1 M1 — Đăng ký bị từ chối (UC-03, ngoại lệ 3.0.E1)

Thể hiện một lần **bị từ chối**, không phải một lần thành công, vì chính lúc từ chối mới
là lúc hệ thống này hoặc xoá bớt được một lượt sinh viên đi hỏi cố vấn, hoặc tạo thêm một
lượt. Màn hình gọi tên chính xác môn học và điểm số, liệt kê từng phép kiểm kèm kết quả,
và đánh dấu những phép kiểm **chưa** được chạy vì yêu cầu đã dừng từ trước đó.

*Quyết định thiết kế đem đi hỏi:* (1) hiện đủ bảng kiểm để sinh viên thấy cái gì đã được
đánh giá và cái gì chưa; (2) gọi tên môn học và điểm cụ thể thay vì câu "chưa đạt môn tiên
quyết" — đó là câu hệ cũ nói, và lần nào nó cũng sinh ra một cuộc gọi điện.

*Hiện thực:* Enroll-1 … Enroll-8, Prereq-1, Prereq-2. *Luật nhìn thấy được:* BR-02, BR-06, BR-14.

### 3.2 M2 — Quyết định vượt sĩ số (UC-06, luồng 6.0 kèm ngoại lệ 6.0.E1)

Hàng chờ của Trưởng bộ môn và một lần ra quyết định, với mọi thứ họ cần bày ngay trước
mắt: sĩ số lớp, sức chứa phòng, các yêu cầu đang chờ khác của cùng lớp đó, hồ sơ sinh
viên, và hậu quả với việc tốt nghiệp nếu từ chối.

*Quyết định thiết kế đem đi hỏi:* dải thông báo. Khi hạn 48 giờ bị vượt, hệ thống **leo
thang và tiếp tục đếm giờ** — nó không tự duyệt, cũng không tự từ chối. Đây là bất đồng
khó nhất trong quá trình khai thác yêu cầu: Trưởng phòng Đào tạo muốn tự duyệt để bảo đảm
SLA, còn các Trưởng bộ môn từ chối để phần mềm ban phát ngoại lệ học vụ. Màn hình nói
thẳng ra cách giải quyết thay vì giấu nó đi.

*Hiện thực:* Override-1 … Override-9. *Luật nhìn thấy được:* BR-03, BR-11, BR-12.

### 3.3 M3 — Kiểm tra tiến độ tốt nghiệp với một nhóm không đánh giá được (UC-09)

Từng nhóm điều kiện kèm trạng thái, cộng thêm một dòng **Cần xem lại** cho tín chỉ chuyển
đổi được ghi nhận trước năm 2019, cộng thêm phần dự báo "nếu như".

*Quyết định thiết kế đem đi hỏi:* (1) trạng thái **Cần xem lại** — một bản kiểm tra tiến
độ mà lại đoán mò chính là kiểu hỏng đã sinh ra lá đơn khiếu nại gửi Hiệu trưởng nhắc ở
Vision & Scope §1.1, nên màn hình nói thẳng là nó không biết và chỉ ra phải hỏi ai;
(2) ghi rõ **năm quy chế đang áp dụng**, vốn là một quy định (Quy chế học vụ §9.1), không
phải một chi tiết cho đẹp.

*Hiện thực:* Audit-1 … Audit-7. *Luật nhìn thấy được:* BR-02, BR-13, BR-18.

## 4. Những câu hỏi mà các mock-up này sinh ra để chốt

| # | Câu hỏi | Hỏi ai | Trả lời |
|---|---|---|---|
| Q1 | Sinh viên bị từ chối nên thấy mọi phép kiểm, hay chỉ thấy phép kiểm đã hỏng? | Nhân viên học vụ | Mọi phép kiểm, có đánh dấu cái chưa chạy — nó chặn được cuộc gọi hỏi tiếp kiểu "thế còn…" |
| Q2 | Khi quá hạn quyết định vượt sĩ số, hệ thống có nên tự quyết không? | Trưởng phòng Đào tạo, các Trưởng bộ môn | Không. Leo thang và tiếp tục đếm giờ (UC-06 ngoại lệ 6.0.E1) |
| Q3 | Bản kiểm tra tiến độ nên hiện ra điều kiện mà nó không đánh giá được, hay giấu đi? | Cố vấn học tập | Hiện ra ở trạng thái Cần xem lại, kèm lý do và người cần liên hệ |
| Q4 | Phần dự báo "nếu như" có nên cho thấy cái giá của việc *không* học một môn? | Cố vấn học tập | Có — đó là câu hỏi tư vấn phổ biến nhất |
| Q5 | Sinh viên có nên thấy GPA của chính mình trên màn hình vượt sĩ số mà Trưởng bộ môn nhìn? | Trưởng phòng Đào tạo | **Còn treo — TBD-6.** Một câu hỏi về quyền riêng tư mà Trưởng phòng muốn hỏi ý kiến pháp chế |

**TBD-6** được mang sang danh sách TBD của SRS. Để nó treo và có theo dõi là đúng; bịa ra
một lập trường về quyền riêng tư mà Trưởng phòng Đào tạo chưa hề đưa ra thì tệ hơn nhiều.
