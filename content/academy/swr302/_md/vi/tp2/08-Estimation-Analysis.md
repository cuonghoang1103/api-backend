# Ước lượng yêu cầu — Ngân sách BA và số lượng BA
## cho Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)

Phiên bản 1.0 đã duyệt
Người soạn: **<Tên thành viên 5>**, Nhóm Phân tích nghiệp vụ — Nhóm <N>
Nova Retail Group (NRG)
17 tháng 9 năm 2026

> Công cụ là `deliverables/08-Requirements-Estimation.xlsx`, chính là Requirements
> Estimation Tool ở chương 19 của Wiegers & Beatty, giữ nguyên công thức. Chỉ các ô nhập
> màu vàng được điền; mỗi ô vàng đều có một chú thích ghi rõ giá trị lấy từ đâu.

---

## 1. Đầu vào, và từng con số lấy từ đâu

**Những con số đếm này lấy từ chính các deliverable của nhóm, không phải ước chừng.** Một
con số mâu thuẫn với tài liệu mà nó tự nhận là đang mô tả sẽ làm hỏng toàn bộ phần phía
sau.

| Đầu vào | Giá trị | Nguồn |
|---|---|---|
| Số trang tài liệu hiện có phải đọc rà | 40 | Tài liệu bảng tính tồn kho cũ, 4 hướng dẫn cổng hãng vận chuyển, ghi chép quy trình hiện trạng |
| Số hệ thống đang có bị nâng cấp hoặc thay thế | 1 | Quy trình hoàn tất đơn thủ công — bảng tính, phiếu in, cổng hãng vận chuyển |
| Bên liên quan | 16 | COO, 3 Quản lý hoàn tất đơn, 3 Kiểm soát tồn kho, 2 Logistics, 5 Quản lý nhãn hàng, 2 Quản trị hệ thống |
| Hệ thống giao tiếp — nhỏ | 3 | Cổng thanh toán, dịch vụ thông báo, nhà cung cấp định danh (SRS §5.2) |
| Hệ thống giao tiếp — vừa | 8 | 4 kênh bán + 4 hãng 3PL (SRS SI-1 … SI-7) |
| Hệ thống giao tiếp — lớn | 1 | ERP / kế toán (SRS SI-8) |
| **Luồng quy trình và/hoặc use case** | **14** | **Đếm từ Deliverable 2 — UC-01 … UC-14** |
| Sơ đồ dữ liệu nghiệp vụ | 2 | Context diagram + mô hình dữ liệu logic (SRS Phụ lục B) |
| **Màn hình / giao diện người dùng** | **20** | Máy cầm tay 6 + quản lý 7 + nhân viên CSKH 4 + khách hàng 3 — SRS §5.1 và Deliverable 6 |
| **Báo cáo** | **7** | **RPT-1 … RPT-7, đếm từ SRS §4.3** |
| Tổng ngân sách dự án | 1.200.000 USD | Vision & Scope §3.2, ràng buộc chi phí |
| Đơn giá BA bình quân theo giờ | 125 USD | Mặc định của công cụ, giữ nguyên — xem §4 |
| Loại dự án | Standard | Xây riêng, không phải triển khai gói phần mềm có sẵn |
| Số lập trình viên | 12 | Vision & Scope §3.2, ràng buộc nhân sự |
| Nhóm có làm từ xa không? | Có | Nhóm chia giữa TP.HCM và Hà Nội → công cụ cộng thêm 10% đệm |
| Thời lượng dự án | 44 tuần | Bản 1.0 phải kịp trước chiến dịch 11.11 |
| Thời lượng phần việc yêu cầu | 16 tuần | Tuần 1–16 |

## 2. Ba đáp số

Công cụ ước lượng cùng hai con số đó theo ba cách độc lập. Chúng không đồng ý với nhau,
và chính chỗ bất đồng mới là phần hữu ích.

| Phương pháp | Số BA | Ngân sách BA — giai đoạn yêu cầu | Ngân sách BA — cả dự án |
|---|---:|---:|---:|
| **A** — 15% tổng ngân sách dự án | **2,25** | 180.000 USD | 495.000 USD |
| **B** — 6 lập trình viên trên 1 BA (Standard) | **2,00** | 160.000 USD | 440.000 USD |
| **C** — Theo hoạt động, +10% đệm làm từ xa | **1,71** | 137.000 USD | 377.000 USD |

### Số giờ của phương pháp C đến từ đâu

| Hạng mục | Số giờ |
|---|---:|
| Khởi động và quản lý dự án | 140,6 |
| Mô hình hoá yêu cầu — phần người (use case, user story, sơ đồ tổ chức) | 360,0 |
| Mô hình hoá yêu cầu — phần hệ thống (context, mô hình giao tiếp, display-action-response) | 300,8 |
| Mô hình hoá yêu cầu — phần dữ liệu (sơ đồ dữ liệu, từ điển dữ liệu, bảng báo cáo) | 195,5 |
| **Tổng phần việc yêu cầu** | **997,0** |
| Đệm cho nhóm làm từ xa (+10%) | 99,7 |
| **Tổng cộng** | **1.096,7** |

1.096,7 giờ ÷ 40 giờ ÷ 16 tuần = **1,71 BA**.

## 3. Đọc khoảng chênh lệch — vì sao C thấp nhất

Kỳ vọng thường gặp nhất là phương pháp theo hoạt động sẽ ra **cao nhất**, vì nó đếm từng
sản phẩm cụ thể. Ở đây nó ra **thấp nhất**, và lý do đáng nói cho thật chính xác:

- **OMFS là hệ thống ít sản phẩm nhưng nặng tích hợp.** Chỉ 14 use case và 20 màn hình —
  những con số khiêm tốn mà mô hình hoạt động định giá rẻ — nhưng có tới **12 hệ thống
  giao tiếp**, một con số lớn với một dự án cỡ này. Phần phân tích tích hợp dồn vào 300,8
  giờ mô hình hoá hệ thống; nó không tăng theo số use case, mà số use case mới là thứ chi
  phối mô hình ở những chỗ khác.
- **Mô hình hoạt động định giá sản phẩm, không định giá các cuộc trao đổi.** Nó có tính
  buổi khởi động dự án, việc báo cáo tiến độ và các liên kết truy vết, nhưng không định
  giá bốn buổi khai thác yêu cầu, các buổi rà soát yêu cầu mà chương 17 khuyến nghị, hay
  việc kiểm soát thay đổi sẽ chạy từ bản cơ sở tuần 8 cho tới lúc phát hành.
- **Phương pháp A và B không hề nhạy với việc hệ thống thật sự là cái gì.** Phương pháp A
  là hàm của riêng ngân sách; phương pháp B là hàm của riêng số lập trình viên. Không cái
  nào nhìn vào OMFS cả. Việc chúng rơi gần nhau là trùng hợp, không phải sự xác nhận lẫn
  nhau.

## 4. Chúng tôi cam kết gì, và điều gì sẽ làm thay đổi

> **Bố trí 2 BA cho 16 tuần của giai đoạn yêu cầu, ngân sách 160.000 USD.**

**Vì sao là 2 chứ không phải 1,71.** Phương pháp C là cái bám thực tế nhất trong ba cái,
nhưng nó chỉ định giá những sản phẩm ta đã liệt kê. Các buổi khai thác yêu cầu, các buổi
rà soát chéo và việc kiểm soát thay đổi từ tuần 8 trở đi đều là công việc thật mà mô hình
của nó không chứa. Làm tròn 1,71 lên 2 hấp thụ phần đó, và nó tình cờ trùng với phương
pháp B — đó là sự yên tâm, không phải bằng chứng.

**Vì sao không phải 2,25.** Con số của phương pháp A là cận trên, suy ra từ một quy tắc
ngón tay cái 15% vốn chưa hề nhìn vào hệ thống này. Cam kết theo nó nghĩa là cấp tiền cho
một phần ba BA chỉ dựa trên một con số trung bình ngành.

**Điều gì sẽ khiến chúng tôi đổi ý — nói trước:**

| Ngưỡng kích hoạt | Cam kết sửa lại |
|---|---|
| Danh sách TBD ở SRS Phụ lục C tới tuần 10 vẫn còn từ 3 mục trở lên | Nâng lên 2,25 BA; yêu cầu chưa chốt ngốn thời gian analyst với tốc độ tăng dần |
| Lazada và TikTok Shop bị kéo từ bản 1.1 lên bản 1.0 | Nâng lên 2,5 BA; việc đó thêm 2 hệ thống giao tiếp cỡ vừa và khoảng 60 giờ mô hình hoá giao tiếp |
| Phạm vi bản 1.0 bị cắt xuống chỉ còn storefront | Giảm còn 1,5 BA |
| Giai đoạn yêu cầu bị nén từ 16 tuần xuống 12 | Nâng lên 2,5 BA — khối lượng công việc không co lại theo lịch |

**Chi phí BA cho cả dự án, không chỉ giai đoạn yêu cầu:** 440.000 USD với 2 BA trong 44
tuần. Đây là con số trung thực để trình người tài trợ. Analyst không dừng lại khi SRS
chốt bản cơ sở — họ còn trả lời câu hỏi, chạy kiểm soát thay đổi và duy trì truy vết cho
tới lúc phát hành, mà đó đúng là thứ cả ba phương pháp A, B và C đều tính vào dòng thứ ba
của mình.

## 5. Độ nhạy: đơn giá theo giờ

Đơn giá bình quân 125 USD là mặc định của công cụ, mang từ bối cảnh Mỹ của cuốn sách. Với
đơn giá BA bình quân ở Việt Nam khoảng 45 USD/giờ:

| Phương pháp | Số BA ở 125 USD/h | Số BA ở 45 USD/h |
|---|---:|---:|
| A — 15% ngân sách | 2,25 | **6,25** |
| B — tỉ lệ theo lập trình viên | 2,00 | 2,00 |
| C — theo hoạt động | 1,71 | 1,71 |

**Phương pháp A là cái duy nhất nhúc nhích, và nó nhúc nhích rất xa.** Điều này phơi ra
thứ phương pháp A thật sự đo: không phải dự án cần bao nhiêu phân tích, mà 15% ngân sách
tình cờ mua được bao nhiêu giờ công analyst. Ở đơn giá nội địa, nó mua được nhiều giờ hơn
hẳn so với lượng công việc đòi hỏi. Vì vậy chúng tôi coi phương pháp A là cận trên của
công sức *chi trả nổi*, không bao giờ coi nó là ước lượng của công sức *cần thiết* — và
đây là lý do mạnh nhất để ưu tiên sự bám thực tế của phương pháp C hơn phép tính số học
của phương pháp A.
