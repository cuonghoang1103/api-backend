# Ước lượng yêu cầu — Ngân sách BA và số lượng BA
## cho Hệ thống Học vụ và Đăng ký môn (CARS)

Phiên bản 1.0 đã duyệt
Người soạn: **<Tên thành viên 5>**, Nhóm Phân tích nghiệp vụ — Nhóm <N>
Northern Regional University (NRU)
17 tháng 9 năm 2026

> Công cụ là `deliverables/08-Requirements-Estimation.xlsx`, chính là Requirements
> Estimation Tool của chương 19, giữ nguyên công thức. Chỉ các ô nhập màu vàng được
> điền; mỗi ô có một chú thích ghi rõ giá trị đó lấy từ đâu.

---

## 1. Đầu vào, và từng con số lấy từ đâu

**Những con số đếm này lấy từ chính các deliverable của nhóm.** Một con số mâu thuẫn với
tài liệu mà nó mô tả sẽ làm hỏng toàn bộ phần phía sau.

| Đầu vào | Giá trị | Nguồn |
|---|---|---|
| Số trang tài liệu hiện có phải đọc rà | 120 | Tài liệu hệ cũ + Quy chế học vụ NRU 2026 + ghi chép hiện trạng |
| Số hệ thống đang có bị nâng cấp hoặc thay thế | 1 | Hệ thống thông tin sinh viên cũ |
| Bên liên quan | 20 | Những người có tên tham dự các buổi khai thác yêu cầu 1–4 |
| Hệ thống giao tiếp — nhỏ | 2 | SSO của trường, dịch vụ thông báo |
| Hệ thống giao tiếp — vừa | 3 | Tài chính/học phí, thời khoá biểu, hệ quản lý học tập (SRS §5.2) |
| Hệ thống giao tiếp — lớn | 0 | Không có lúc chạy; phần chuyển đổi từ hệ cũ đã tính ở trên |
| **Luồng quy trình và/hoặc use case** | **14** | **Đếm từ Deliverable 2 — UC-01 … UC-14** |
| Sơ đồ dữ liệu nghiệp vụ | 2 | Context diagram + mô hình dữ liệu logic |
| **Màn hình / giao diện người dùng** | **26** | Sinh viên 10 + nhân viên 6 + trưởng bộ môn 4 + cố vấn 3 + phòng đào tạo 3 |
| **Báo cáo** | **7** | RPT-1 … RPT-7, đếm từ SRS §4.3 |
| Tổng ngân sách dự án | 950.000 USD | Vision & Scope §3.2 |
| Đơn giá BA bình quân theo giờ | 125 USD | Mặc định của công cụ, giữ nguyên — xem §5 |
| Loại dự án | Standard | Xây riêng để thay thế một hệ thống cũ |
| Số lập trình viên | 10 | Ràng buộc nhân sự, Vision & Scope §3.2 |
| Nhóm có làm từ xa không? | Không | Nhóm ngồi cùng chỗ trong trường |
| Thời lượng dự án | 40 tuần | Bản 1.0 chạy thật kịp đợt đăng ký học kỳ 1 |
| Thời lượng phần việc yêu cầu | 14 tuần | Tuần 1–14 |

## 2. Ba đáp số

| Phương pháp | Số BA | Ngân sách BA — giai đoạn yêu cầu | Ngân sách BA — cả dự án |
|---|---:|---:|---:|
| **A** — 15% tổng ngân sách dự án | **2,04** | 143.000 USD | 407.000 USD |
| **B** — 6 lập trình viên trên 1 BA (Standard) | **1,67** | 117.000 USD | 333.000 USD |
| **C** — Theo hoạt động, 893 giờ | **1,59** | 112.000 USD | 319.000 USD |

893 giờ ÷ 40 giờ ÷ 14 tuần = **1,59 BA**. Không áp dụng phần đệm cho làm từ xa — nhóm
ngồi cùng chỗ.

## 3. Đọc khoảng chênh lệch

Ba đáp số gần nhau bất thường (1,59 đến 2,04), và lý do đáng nói ra: **CARS là một hệ
thống cỡ vừa với ít giao tiếp.** Mười bốn use case, hai mươi sáu màn hình và chỉ năm hệ
thống giao tiếp, không cái nào lớn. Ba phương pháp đo những thứ khác nhau, nhưng trên một
hệ thống có hình dạng như thế này, chúng rơi vào cùng một chỗ.

Đó là một phát hiện thật chứ không phải trùng hợp, và nó cắt về cả hai phía:

- **Nó nâng độ tin cậy của con số.** Ba phương pháp độc lập đồng ý với nhau trong phạm vi
  0,45 BA là bằng chứng mạnh hơn bất kỳ phương pháp đơn lẻ nào.
- **Nó KHÔNG có nghĩa là ước lượng đã đầy đủ.** Cả ba phương pháp đều định giá *sản phẩm
  và nhân sự*. Không phương pháp nào định giá hai thứ mà chính sổ rủi ro của dự án này
  nói là sẽ ngốn thời gian analyst: **RI-2**, việc rà soát dữ liệu luật chương trình đào
  tạo, và **TBD-5**, việc tìm ra ngành nào không diễn đạt được thành luật máy đánh giá
  được.

## 4. Chúng tôi cam kết gì, và điều gì sẽ làm thay đổi

> **Bố trí 2 BA cho 14 tuần của giai đoạn yêu cầu, ngân sách 143.000 USD.**

**Vì sao là 2 chứ không phải 1,59 hay 1,67.** Phương pháp B và C định giá hệ thống đúng
như đã đặc tả. Chúng không chứa phần rà soát luật chương trình đào tạo — thứ mà giả định
A2 đặt làm điều kiện tiên quyết của bản 1.0, và nhóm không thể bắt đầu nếu không có BA.
Con số 2,04 của phương pháp A là con số duy nhất còn dư chỗ cho việc đó, và làm tròn lên
2 khiến phần dư đó trở nên tường minh thay vì tình cờ.

**Điều gì sẽ khiến chúng tôi đổi ý — nói trước:**

| Ngưỡng kích hoạt | Cam kết sửa lại |
|---|---|
| TBD-5 cho thấy hơn 10% số ngành không diễn đạt được thành luật | Nâng lên 3 BA; giả định A2 đổ, phần việc về luật phình ra đáng kể |
| Nhà cung cấp hệ tài chính xác nhận có API đồng bộ trong tuần 3 (RI-1 đóng) | Giữ 2 BA; phần việc adapter ở CO-7 co lại nhưng không biến mất |
| Nhà cung cấp từ chối, buộc phải trao đổi tệp theo đêm | Giữ 2 BA, nhưng lập lại kế hoạch UC-05 — các đường ngoại lệ nhân lên và Finance-3 trở thành trường hợp bình thường |
| Giai đoạn yêu cầu bị nén từ 14 tuần xuống 10 | Nâng lên 2,5 BA — khối lượng công việc không co lại theo lịch |

**Chi phí BA cho cả dự án:** 407.000 USD với 2 BA trong 40 tuần. Đây là con số trung thực
để trình người tài trợ. Analyst không dừng lại ở bản cơ sở — họ còn trả lời câu hỏi, chạy
quy trình kiểm soát thay đổi và duy trì truy vết cho tới lúc phát hành.

## 5. Độ nhạy: đơn giá theo giờ

Đơn giá bình quân 125 USD là mặc định của công cụ, lấy từ bối cảnh Mỹ của cuốn sách. Với
đơn giá BA bình quân ở Việt Nam khoảng 45 USD/giờ:

| Phương pháp | Số BA ở 125 USD/h | Số BA ở 45 USD/h |
|---|---:|---:|
| A — 15% ngân sách | 2,04 | **5,66** |
| B — tỉ lệ theo lập trình viên | 1,67 | 1,67 |
| C — theo hoạt động | 1,59 | 1,59 |

**Chỉ phương pháp A nhúc nhích.** Điều đó phơi ra thứ nó thật sự đo: không phải dự án cần
bao nhiêu phân tích, mà 15% ngân sách tình cờ mua được bao nhiêu giờ công analyst. Ở đơn
giá nội địa, sự đồng thuận mô tả ở §3 biến mất hoàn toàn, và phương pháp A trở thành cận
trên của công sức *chi trả nổi* chứ không phải ước lượng của công sức *cần thiết*.

Điều này quan trọng với cam kết ở §4. Chúng tôi đã dùng phần dư của phương pháp A để biện
minh cho việc làm tròn lên 2 BA — nhưng phần dư ấy là hệ quả của một đơn giá Mỹ. Nếu NRU
bố trí nhân sự theo đơn giá nội địa, biện minh trung thực cho BA thứ hai là **RI-2 và
TBD-5**, không phải quy tắc 15%. Chúng tôi nói thẳng như vậy thay vì để một giả định về
đơn giá gánh lập luận thay mình.
