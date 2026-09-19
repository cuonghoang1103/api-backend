# Mock-up cho các use case phức tạp
## cho Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)

Phiên bản 1.0 đã duyệt
Người soạn: **<Tên thành viên 4>**, Nhóm Phân tích nghiệp vụ — Nhóm <N>
Nova Retail Group (NRG)
17 tháng 9 năm 2026

---

## 1. Mục đích và cách tiếp cận

Theo Wiegers & Beatty chương 15, đây là **mock-up dùng một lần, độ trung thực thấp**.
Nhiệm vụ của chúng là làm một quyết định thiết kế hiện ra để bên liên quan có thể phản
đối nó — chứ không phải để trông như đã hoàn thiện. Chúng cố ý để xám và không tô vẽ:
một mock-up bóng bẩy sẽ khiến bên liên quan bàn về màu sắc thay vì về hành vi, và khiến
ban lãnh đạo tưởng hệ thống sắp xong tới nơi.

**SRS vẫn là nguồn sự thật.** Các mock-up này minh hoạ cho nó. Chỗ nào mock-up và SRS
nói khác nhau thì SRS đúng còn mock-up là bản đã cũ.

## 2. Ba use case này được chọn thế nào

Đề bài yêu cầu "ít nhất 3 use case phức tạp". *Phức tạp* ở đây nghĩa là **nhiều quyết
định và nhiều trạng thái**, không phải nhiều ô nhập liệu. Các ứng viên được xếp hạng theo
luồng thay thế + ngoại lệ + số actor tham gia:

| Use case | Luồng thay thế | Ngoại lệ | Actor | Tổng | Được chọn |
|---|---|---|---|---|---|
| **UC-04** Định tuyến và tách đơn | 3 | 3 | 2 | **8** | ✅ |
| **UC-10** Xử lý một ngoại lệ hoàn tất đơn | 5 | 3 | 3 | **11** | ✅ |
| **UC-07** So giá và mua nhãn vận chuyển | 3 | 4 | 3 | **10** | ✅ |
| UC-09 Theo dõi một đơn hàng | 3 | 3 | 3 | 9 | ✅ *(cũng được vẽ — xem §3.5)* |
| UC-03 Giữ tồn kho | 2 | 4 | 2 | 8 | — đã nằm trong M1 |
| UC-12 Xử lý trả hàng | 3 | 4 | 3 | 10 | hoãn sang bản 2.0 |
| UC-06 Nhặt và đóng gói | 3 | 4 | 1 | 8 | — |

UC-12 có điểm cao nhưng bị hoãn sang bản 2.0, nên vẽ mock-up cho nó lúc này là làm bản
mẫu cho một thứ năm nay không ai dựng. UC-09 được thêm vào làm cái thứ tư vì nó là màn
hình duy nhất của hệ thống mà khách hàng nhìn thấy, và nó chính là thứ mang lại mục tiêu
nghiệp vụ BO-4.

## 3. Các mock-up

| # | Tệp | Use case | Luồng được thể hiện | Trạng thái |
|---|---|---|---|---|
| **M1** | `mockups/M1-UC04-routing-workbench.png` | UC-04 | Luồng chính 4.0 | Thành công |
| **M1b** | `mockups/M1b-UC04-split-limit-exception.png` | UC-04 → UC-10 | Ngoại lệ 4.0.E2 | **Thất bại** |
| **M2** | `mockups/M2-UC07-carrier-rate-shopping.png` | UC-07 | Luồng chính 7.0 | Thành công, có một hãng không đủ điều kiện |
| **M3** | `mockups/M3-UC10-exception-console.png` | UC-10 | Luồng chính 10.0 + luồng thay thế 10.5 | Hàng chờ đang xử lý |
| **M4** | `mockups/M4-UC09-customer-tracking.png` | UC-09 | Luồng thay thế 9.1 + ngoại lệ 9.0.E3 | **Đơn bị tách + trạng thái đã cũ** |

Bản nguồn sửa được của từng mock-up là tệp `.html` tương ứng trong thư mục `mockups/`.

### 3.1 M1 — Bàn định tuyến (UC-04, luồng chính)

Thể hiện quyết định định tuyến tự động cho một đơn hàng thật, kèm **bảng điểm đầy đủ của
từng trung tâm hoàn tất đơn ứng viên** và một dòng giải thích vì sao cái thắng lại thắng.

*Quyết định thiết kế đem đi hỏi:* Quản lý hoàn tất đơn nói trong buổi khai thác thứ 2
rằng họ sẽ không tin một quyết định định tuyến mà mình không soi được. Vì vậy UC-04
POST-2 yêu cầu phải lưu bảng điểm lại, và màn hình này là nơi đọc nó. Phương án còn lại —
chỉ hiện trung tâm được chọn — đã bị bác.

*Hiện thực:* Route-1 … Route-5. *Luật nhìn thấy được:* BR-01, BR-06, BR-08, BR-09, BR-10.

### 3.2 M1b — Vượt giới hạn tách đơn (UC-04, ngoại lệ 4.0.E2)

Trạng thái thất bại. Việc định tuyến cần tới bốn trung tâm hoàn tất đơn trong khi BR-08
chỉ cho phép ba, nên **không tạo ra gì cả và không nhả tồn kho nào** — dải thông báo nói
thẳng điều đó, vì câu hỏi đầu tiên của một người quản lý trong tình huống này là "hệ
thống đã làm những gì rồi?".

*Quyết định thiết kế đem đi hỏi:* bốn phương án xử lý kèm một phương án được khuyến nghị,
thay vì một thông báo lỗi trơ trọi. Ô nhập lý do bắt buộc chính là hiện thực của UC-10
POST-1.

*Hiện thực:* Route-4, Except-1.

### 3.3 M2 — So giá vận chuyển (UC-07)

Bốn hãng báo giá, ba hãng đủ điều kiện, một hãng được hiện **mờ đi kèm lý do bị loại**
thay vì bị giấu. Luật chọn — hãng rẻ nhất mà vẫn kịp ngày đã hứa — được ghi ngay trên
màn hình cùng với khoản tiết kiệm so với lựa chọn mặc định thủ công trước đây.

*Quyết định thiết kế đem đi hỏi:* việc hiện ra hãng không đủ điều kiện. Giấu nó đi sẽ làm
bảng so sánh ngắn hơn nhưng không kiểm toán được; Quản lý logistics đối chiếu các báo giá
này với hoá đơn 3PL hằng tháng, và đó là cách chứng minh mục tiêu BO-5.

*Hiện thực:* Label-1, Label-2. *Luật nhìn thấy được:* BR-09, BR-11, BR-12.

### 3.4 M3 — Bảng xử lý ngoại lệ (UC-10)

Hàng chờ công việc: mọi ngoại lệ đang mở, sắp xếp theo mức rủi ro trễ ngày giao, có đánh
dấu các trường hợp vượt SLA, và — khi chọn một dòng — hiện ra **chỉ những phương án xử lý
hợp lệ với đúng loại ngoại lệ đó**.

*Quyết định thiết kế đem đi hỏi:* phương án xử lý theo từng loại (UC-10 luồng 10.1–10.4)
thay vì một danh sách chung kiểu chuyển-lại / huỷ / bỏ qua. Một bảng điều khiển kiểu chung
chung sẽ đẩy quyết định thật về lại trí nhớ của người quản lý, mà đó đúng là quy trình thủ
công dự án này đang thay thế.

*Hiện thực:* Except-1 … Except-3. *Luật nhìn thấy được:* BR-08, BR-09.

### 3.5 M4 — Trang theo dõi đơn hàng cho khách (UC-09)

Màn hình duy nhất khách hàng nhìn thấy. Thể hiện một **đơn bị tách** thành hai kiện hàng
có giải thích, và một lô giao mà hãng vận chuyển đã im lặng 46 giờ, kèm dòng thông báo rõ
ràng "chưa có cập nhật từ" và việc NRG sẽ làm gì với chuyện đó.

*Quyết định thiết kế đem đi hỏi:* hai cái. Thứ nhất, đơn bị tách phải được **giải thích**
— một lần giao thiếu mà không giải thích sẽ sinh ra đúng cái cuộc gọi "đơn tôi đâu" mà
trang này sinh ra để ngăn. Thứ hai, trạng thái cũ phải được **thừa nhận** kèm mốc thời
gian, chứ không hiển thị như thể nó đang mới; giả vờ như mình biết chính là thứ phá huỷ
niềm tin vào một trang theo dõi đơn.

*Hiện thực:* Track-1 … Track-4. *Luật nhìn thấy được:* BR-09.

## 4. Những câu hỏi mà các mock-up này sinh ra để chốt

Mỗi câu đã được mang tới đúng bên liên quan. Câu trả lời chảy vào SRS.

| # | Câu hỏi | Hỏi ai | Trả lời |
|---|---|---|---|
| Q1 | Bảng điểm có đủ để một quyết định định tuyến tự động trở nên đáng tin không, hay cần một bước duyệt tay cho mọi đơn? | Quản lý hoàn tất đơn | Bảng điểm là đủ; chỉ cần duyệt với các trường hợp ghi đè. Xác nhận UC-04 chạy không cần người trực. |
| Q2 | Hãng vận chuyển không đủ điều kiện nên giấu đi hay hiện ra kèm lý do? | Quản lý logistics | Hiện ra kèm lý do — cần cho việc đối chiếu hoá đơn. |
| Q3 | Bảng xử lý ngoại lệ nên cho nhập lý do tự do, hay đưa một danh sách cố định theo từng loại? | Quản lý hoàn tất đơn | Danh sách cố định theo loại, cộng thêm một ô lý do bắt buộc. |
| Q4 | Khách hàng có nên thấy đơn của mình đã bị tách không? | Quản lý CSKH | Có, và phải giải thích trong một câu. |
| Q5 | Trang theo dõi nên hiện gì khi hãng vận chuyển im lặng? | Quản lý CSKH | Trạng thái biết được gần nhất, độ cũ của nó, và việc NRG sẽ làm — **còn treo TBD-4**: câu chữ chính xác cần thống nhất với bộ phận thương hiệu. |

**TBD-4** được mang sang danh sách TBD của SRS. Ở giai đoạn này, để nó treo và có theo
dõi là đúng; bịa ra câu chữ mà bộ phận thương hiệu chưa duyệt thì tệ hơn.
