# Từ điển dữ liệu
## cho Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)

Phiên bản 1.0 đã duyệt
Người soạn: **<Tên thành viên 4>**, Nhóm Phân tích nghiệp vụ — Nhóm <N>
Nova Retail Group (NRG)
Cập nhật lần cuối 17 tháng 9 năm 2026

---

### Lịch sử sửa đổi

| Người | Ngày | Lý do sửa | Phiên bản |
|---|---|---|---|
| Thành viên 4, Nhóm <N> | 17-09-2026 | Thu thập phần tử trong lúc viết use case UC-01…UC-14 | 0.9 |
| Thành viên 4, Nhóm <N> | 17-09-2026 | Hoàn thiện các cấu trúc, đối chiếu chéo với business rule | 1.0 |

---

## 1. Ký pháp

Theo *Guidance for Data Dictionaries* (Wiegers & Beatty, chương 13):

| Ký hiệu | Nghĩa |
|---|---|
| `+` | gồm có / và |
| `( )` | phần tử tuỳ chọn |
| `{ }` | nhóm lặp lại |
| `min:max` | số lần lặp cho phép; `n` nghĩa là không giới hạn |
| `[ a \| b ]` | chọn một trong các phương án |
| `" "` | chuỗi ký tự nguyên văn |

**Quy ước dùng trong tài liệu này**

- Các mục xếp theo **thứ tự bảng chữ cái** (theo tên tiếng Anh, vì đó là tên dùng trong đặc tả).
- Với một **cấu trúc dữ liệu**, cột *Độ dài* và *Giá trị* để trống — hai cột đó chỉ áp cho phần tử nguyên thuỷ.
- Mọi phần tử được gọi tên bên trong một cấu trúc đều có **mục riêng của nó** trong từ điển này.
- Chỗ nào giá trị bị một business rule chi phối thì cột *Giá trị* trích mã luật chứ không chép lại nội dung luật.

---

## 2. Từ điển dữ liệu

| Phần tử dữ liệu | Mô tả | Cấu thành hoặc kiểu dữ liệu | Độ dài | Giá trị |
|---|---|---|---|---|
| Authorized Quantity | Số lượng của một SKU mà khách được cho phép trả lại | số nguyên | 4 | ≥ 1; không lớn hơn số lượng đã giao |
| Available To Promise | Số lượng của một SKU tại một trung tâm hoàn tất đơn có thể hứa cho một đơn mới | số nguyên | 6 | ≥ 0; tính theo BR-07; không được âm — một kết quả âm là lỗi dữ liệu (UC-13 ngoại lệ 13.0.E4) |
| Barcode | Mã quét được in trên món hàng vật lý, dùng để xác minh lượt nhặt | chữ và số | 20 | EAN-13 hoặc mã nội bộ; duy nhất theo từng SKU |
| Capacity Score | Thành phần của điểm định tuyến, phản ánh năng lực còn lại trong ngày của một trung tâm | số thập phân | 5 | 0,00–1,00; xem BR-06 |
| Carrier Code | Mã của một hãng logistics bên thứ ba | chữ cái | 10 | GHN, GHTK, VTP, JNT |
| Carrier Event Time | Thời điểm chính hãng vận chuyển ghi nhận một sự kiện theo dõi | ngày giờ, ISO 8601 kèm múi giờ | 25 | Dùng để sắp thứ tự sự kiện (UC-08 POST-2); có thể sớm hơn Received At |
| Carrier Quote | Một mức giá và mức dịch vụ mà một hãng chào cho một lô giao | Carrier Code + Service Level + Quoted Cost + Estimated Transit Days + Quoted At | | |
| Carrier Status Code | Giá trị trạng thái của chính hãng vận chuyển, trước khi ánh xạ | chữ và số | 30 | Riêng theo từng hãng; giá trị chưa ánh xạ sẽ sinh cảnh báo cấu hình |
| Carton | Một thùng hàng vật lý trong một lô giao | Carton ID + Carton Weight + Carton Length + Carton Width + Carton Height | | |
| Carton ID | Mã định danh duy nhất của một thùng hàng | chữ và số | 20 | Hệ thống tự sinh; in ra thành nhãn quét được |
| Carton Height | Chiều cao của một thùng đã đóng gói | số thập phân, cm | 5 | > 0 |
| Carton Length | Chiều dài của một thùng đã đóng gói | số thập phân, cm | 5 | > 0 |
| Carton Weight | Khối lượng cả bì của một thùng đã đóng gói | số thập phân, kg | 6 | > 0; quyết định điều kiện hãng theo BR-11 và chi phí theo BR-12 |
| Carton Width | Chiều rộng của một thùng đã đóng gói | số thập phân, cm | 5 | > 0 |
| Center Status | Trạng thái vận hành của một trung tâm hoàn tất đơn | chữ cái | 10 | [ Open \| Closed \| Suspended ]; chỉ trung tâm Open mới là ứng viên định tuyến |
| Channel ID | Mã định danh duy nhất của một kênh bán | chữ và số | 12 | Hệ thống gán |
| Channel Name | Tên hiển thị của một kênh bán | chữ và số | 40 | Ví dụ Web Storefront, Shopee, Lazada, TikTok Shop |
| Channel Status | OMFS hiện có trao đổi dữ liệu với kênh đó hay không | chữ cái | 10 | [ Active \| Inactive ]; chỉ kênh Active mới nhận công bố tồn kho |
| Channel Stock Publication | Bản ghi về số lượng bán được gần nhất đã gửi tới một kênh cho một SKU | SKU + Channel ID + Published Quantity + Published At | | |
| Channel Type | Loại kênh bán, quyết định chính sách sửa đơn của kênh đó | chữ cái | 12 | [ Storefront \| Marketplace ]; đơn từ Marketplace không được sửa (BR-16) |
| Cost Score | Thành phần của điểm định tuyến, phản ánh chi phí vận chuyển dự kiến | số thập phân | 5 | 0,00–1,00; xem BR-06 |
| Created At | Thời điểm một bản ghi được tạo | ngày giờ, ISO 8601 kèm múi giờ | 25 | Hệ thống tự sinh |
| Customer | Người mua có tên trên một đơn hàng | Customer Name + Email Address + (Phone Number) | | |
| Customer Name | Tên người mua do kênh bán cung cấp | chữ cái | 100 | Không để trống |
| Daily Capacity | Số lô giao mà một trung tâm hoàn tất đơn xuất được trong một ngày làm việc | số nguyên | 6 | > 0; cấu hình được theo từng trung tâm; dùng trong BR-06 và UC-04 |
| Damaged Quantity | Số lượng của một SKU tại một trung tâm được ghi nhận là hỏng, không bán được | số nguyên | 6 | ≥ 0; bị loại khỏi Available To Promise theo BR-07 |
| Decided At | Thời điểm một quyết định định tuyến được đưa ra | ngày giờ, ISO 8601 kèm múi giờ | 25 | Hệ thống tự sinh |
| Decision Mode | Cách một quyết định định tuyến được đưa ra | chữ cái | 16 | [ Automatic \| Manual \| Fallback ]; Manual bắt buộc phải có Override Reason theo BR-19 |
| Dispatch Cut Off Time | Giờ địa phương mà sau đó đơn định tuyến về trung tâm sẽ xuất vào ngày làm việc kế tiếp | giờ, HH:MM | 5 | Mặc định 14:00; cấu hình được theo từng trung tâm; xem BR-10 |
| District | Quận/huyện của địa chỉ giao hàng | chữ cái | 60 | Lấy từ danh mục đơn vị hành chính quốc gia |
| Email Address | Địa chỉ thư điện tử dùng để gửi thông báo đơn hàng | chữ và số | 254 | Phải chứa đúng một dấu "@" |
| Estimated Transit Days | Thời gian vận chuyển công bố của hãng tới điểm đến | số nguyên | 2 | ≥ 0; dùng trong BR-09 để xác định đơn có rủi ro |
| Event ID | Mã định danh duy nhất của một sự kiện theo dõi | chữ và số | 36 | Hệ thống tự sinh |
| Exception ID | Mã định danh duy nhất của một ngoại lệ hoàn tất đơn | chữ và số | 20 | Hệ thống tự sinh |
| Exception Status | Trạng thái hiện tại của một ngoại lệ hoàn tất đơn | chữ cái | 12 | [ Open \| Resolved \| Escalated ]; không bao giờ bị xoá, luôn phải được xử lý (UC-10 POST-1) |
| Exception Type | Loại ngoại lệ hoàn tất đơn, quyết định các phương án xử lý được đưa ra | chữ cái | 24 | [ Backorder \| SplitLimit \| ShortPick \| NoCarrier \| DeliveryFailure \| StalledShipment \| AddressUnserviceable \| DataQuality ] |
| Expires At | Thời điểm một lượt giữ tồn bị nhả ra nếu chưa được xác nhận | ngày giờ, ISO 8601 kèm múi giờ | 25 | Created At + cửa sổ giữ tồn; xem BR-04 |
| Fulfillment Center | Một nhà kho mà từ đó đơn hàng được giao đi | Fulfillment Center ID + Fulfillment Center Name + Ship To Address + Center Status + Daily Capacity + Dispatch Cut Off Time | | |
| Fulfillment Center ID | Mã định danh duy nhất của một trung tâm hoàn tất đơn | chữ và số | 10 | HCM, HAN, DAD |
| Fulfillment Center Name | Tên hiển thị của một trung tâm hoàn tất đơn | chữ và số | 60 | Không để trống |
| Fulfillment Exception | Một sự cố trong vòng đời hoàn tất đơn, đòi hỏi con người quyết định | Exception ID + Exception Type + Order ID + (Shipment ID) + Raised At + Exception Status + (Resolution Code) + (Resolution Reason) + (Resolved By) + (Resolved At) | | |
| Inspection Outcome | Kết quả kiểm tra một món hàng trả về | chữ cái | 10 | [ Sellable \| Damaged \| Missing ]; Damaged bắt buộc phải đưa vào khu cách ly theo BR-15 |
| Inventory Record | Vị thế tồn kho của một SKU tại một trung tâm hoàn tất đơn | SKU + Fulfillment Center ID + On Hand Quantity + Reserved Quantity + Damaged Quantity + Safety Stock Quantity + Available To Promise | | |
| Item | Một sản phẩm bán được theo cách OMFS hiểu về nó | SKU + Item Description + Item Weight + Barcode + Storage Location | | |
| Item Description | Tên sản phẩm đọc được, hiện trên màn hình nhặt hàng | chữ và số | 200 | Không để trống |
| Item Weight | Khối lượng đơn vị của một món, dùng để ước tính khối lượng thùng | số thập phân, kg | 6 | > 0 |
| Line Number | Vị trí của một dòng trong đơn hàng của nó | số nguyên | 3 | ≥ 1; duy nhất trong một đơn |
| Line Status | Trạng thái hiện tại của một dòng đơn hàng | chữ cái | 14 | [ Pending \| Reserved \| Backordered \| Picked \| Shipped \| Cancelled \| Returned ] |
| OMFS Status | Trạng thái sự kiện theo dõi sau khi ánh xạ về bộ từ vựng của OMFS | chữ cái | 20 | [ Collected \| InTransit \| OutForDelivery \| Delivered \| DeliveryFailed \| Returned \| Lost ] |
| On Hand Quantity | Số lượng vật lý của một SKU đang có tại một trung tâm hoàn tất đơn | số nguyên | 6 | ≥ 0 |
| Order | Một lượt mua của khách, nhận về từ một kênh bán | Order ID + Channel ID + Order Date + Customer + Ship To Address + Payment Method + Order Status + 1:n{Order Line} | | |
| Order Date | Thời điểm đơn được đặt trên kênh bán | ngày giờ, ISO 8601 kèm múi giờ | 25 | Do kênh cung cấp, không phải thời điểm OMFS nhận về |
| Order ID | Mã định danh đơn hàng duy nhất của OMFS | chữ và số | 20 | Hệ thống tự sinh; khác với mã đơn của chính kênh bán |
| Order Line | Một SKU kèm số lượng trong một đơn hàng | Line Number + SKU + Ordered Quantity + Unit Price + Line Status | | |
| Order Status | Vị trí hiện tại của một đơn trong vòng đời hoàn tất đơn | chữ cái | 18 | [ Pending \| HeldUnmapped \| HeldInvalid \| HeldReview \| Validated \| Reserved \| Backordered \| Routed \| Picking \| Packed \| Labelled \| Shipped \| Delivered \| Cancelled ] |
| Ordered Quantity | Số lượng của một SKU mà khách đặt trên một dòng | số nguyên | 4 | ≥ 1 |
| Override Reason | Văn bản tự do mà Quản lý hoàn tất đơn bắt buộc phải nhập khi ghi đè một quyết định định tuyến tự động | chữ và số | 500 | Bắt buộc khi Decision Mode là Manual; xem BR-19 |
| Payment Method | Cách khách đã trả hoặc sẽ trả tiền | chữ cái | 16 | [ Card \| BankTransfer \| EWallet \| COD ]; COD bỏ qua phép kiểm uỷ quyền (UC-02 luồng 2.1) |
| Phone Number | Số điện thoại liên hệ để giao hàng | "+84" + Subscriber Number | | |
| Pick Wave | Một lô các lô giao được phát xuống sàn kho cùng lúc | Wave ID + Fulfillment Center ID + Created At + (Released At) + Wave Status + 1:n{Shipment ID} | | |
| Postcode | Mã bưu chính của điểm đến giao hàng | số | 6 | Phải được ít nhất một hãng phục vụ (BR-11) |
| Proximity Score | Thành phần của điểm định tuyến, phản ánh khoảng cách từ trung tâm tới điểm đến | số thập phân | 5 | 0,00–1,00; xem BR-06 |
| Province | Tỉnh hoặc thành phố trực thuộc trung ương của địa chỉ giao hàng | chữ cái | 60 | Lấy từ danh mục đơn vị hành chính quốc gia |
| Published At | Thời điểm một số lượng tồn kho được gửi tới một kênh | ngày giờ, ISO 8601 kèm múi giờ | 25 | Dùng để đo mốc 60 giây trong BR-20 |
| Published Quantity | Số lượng bán được gần nhất đã gửi tới một kênh cho một SKU | số nguyên | 6 | ≥ 0 |
| Quoted At | Thời điểm lấy được một báo giá từ hãng vận chuyển | ngày giờ, ISO 8601 kèm múi giờ | 25 | Lưu lại để đối soát hoá đơn (UC-07 POST-2) |
| Quoted Cost | Chi phí vận chuyển trọn gói do một hãng báo | số thập phân, VND | 12 | ≥ 0; tính theo BR-12 |
| RMA Number | Số cho phép trả hàng duy nhất, cấp cho khách | chữ và số | 20 | Hệ thống tự sinh; in trên hướng dẫn trả hàng |
| RMA Status | Trạng thái hiện tại của một lượt cho phép trả hàng | chữ cái | 14 | [ Authorized \| Received \| Inspected \| Closed \| NotReceived ] |
| Raised At | Thời điểm một ngoại lệ hoàn tất đơn được tạo | ngày giờ, ISO 8601 kèm múi giờ | 25 | Hệ thống tự sinh |
| Received At | Thời điểm OMFS nhận được một sự kiện theo dõi | ngày giờ, ISO 8601 kèm múi giờ | 25 | Đem so với Carrier Event Time để đo độ trễ nhận sự kiện (thước đo của BO-4) |
| Received Quantity | Số lượng thực tế nhận lại được tại trung tâm hoàn tất đơn | số nguyên | 4 | ≥ 0; giá trị lớn hơn Authorized Quantity sẽ sinh một ngoại lệ (UC-12 ngoại lệ 12.0.E4) |
| Recipient Name | Tên người nhận hàng | chữ cái | 100 | Không để trống; có thể khác Customer Name |
| Released At | Thời điểm một đợt nhặt hàng được phát xuống sàn | ngày giờ, ISO 8601 kèm múi giờ | 25 | Để trống tới lúc phát; bắt đầu cửa sổ leo thang 24 giờ trong BR-13 |
| Reservation | Một lượt giữ tồn cho một dòng đơn hàng | Reservation ID + SKU + Fulfillment Center ID + Reserved Quantity + Created At + Expires At | | |
| Reservation ID | Mã định danh duy nhất của một lượt giữ tồn | chữ và số | 20 | Hệ thống tự sinh |
| Reserved Quantity | Số lượng của một SKU đang giữ cho các đơn và không còn khả dụng cho đơn mới | số nguyên | 6 | ≥ 0; bị loại khỏi Available To Promise theo BR-07 |
| Resolution Code | Hành động được chọn để xử lý một ngoại lệ hoàn tất đơn | chữ cái | 24 | Các giá trị hợp lệ phụ thuộc vào Exception Type (UC-10 luồng 10.1–10.4) |
| Resolution Reason | Văn bản tự do giải thích vì sao chọn cách xử lý đó | chữ và số | 500 | Bắt buộc; xem UC-10 POST-1 |
| Resolved At | Thời điểm một ngoại lệ hoàn tất đơn được xử lý xong | ngày giờ, ISO 8601 kèm múi giờ | 25 | Để trống khi ngoại lệ còn Open |
| Resolved By | Người dùng đã xử lý một ngoại lệ hoàn tất đơn | chữ và số | 60 | Để trống khi ngoại lệ còn Open |
| Return Authorization | Một lượt trả hàng được cho phép, gồm một hoặc nhiều dòng đã giao | RMA Number + Order ID + Created At + RMA Status + 1:n{Return Line} | | |
| Return Line | Một SKU kèm số lượng trong một lượt cho phép trả hàng | SKU + Authorized Quantity + (Received Quantity) + (Inspection Outcome) | | |
| Routing Decision | Bản ghi về cách một đơn được định tuyến, giữ lại để sau này giải thích được quyết định | Order ID + Decided At + Decision Mode + 1:3{Routing Score} + (Override Reason) | | |
| Routing Score | Điểm của một trung tâm hoàn tất đơn trong một quyết định định tuyến | Fulfillment Center ID + Stock Coverage Score + Proximity Score + Cost Score + Capacity Score + Total Score | | |
| SKU | Stock keeping unit — mã định danh duy nhất của một sản phẩm bán được | chữ và số | 24 | Duy nhất trên toàn bộ các nhãn hàng; là khoá nối giữa kênh bán, tồn kho và lô giao |
| Safety Stock Quantity | Số lượng của một SKU được giữ lại không bán tại một trung tâm, làm vùng đệm | số nguyên | 5 | ≥ 0; mặc định 2, cấu hình được theo từng SKU; xem BR-17 |
| Sales Channel | Một storefront hoặc một sàn mà NRG bán qua đó | Channel ID + Channel Name + Channel Type + Channel Status | | |
| Service Level | Mức tốc độ của một dịch vụ hãng vận chuyển | chữ cái | 12 | [ Standard \| Express \| SameDay ] |
| Ship To Address | Điểm đến mà một lô giao được giao tới | Recipient Name + Street Address + Ward + District + Province + Postcode + Phone Number | | |
| Shipment | Phần của một đơn được hoàn tất từ một trung tâm hoàn tất đơn | Shipment ID + Order ID + Fulfillment Center ID + Shipment Status + 1:n{Shipment Line} + (Carrier Code) + (Tracking Number) + 0:n{Carton} | | |
| Shipment ID | Mã định danh duy nhất của một lô giao | chữ và số | 20 | Hệ thống tự sinh |
| Shipment Line | Một SKU kèm số lượng trong một lô giao | SKU + Shipped Quantity | | |
| Shipment Status | Trạng thái hiện tại của một lô giao | chữ cái | 18 | [ Routed \| Picking \| Packed \| Labelled \| Collected \| InTransit \| Delivered \| DeliveryException \| Returned \| Cancelled ] |
| Shipped Quantity | Số lượng của một SKU thực sự được đóng vào một lô giao | số nguyên | 4 | ≥ 0; có thể nhỏ hơn Ordered Quantity sau một lần nhặt thiếu |
| Stock Coverage Score | Thành phần của điểm định tuyến, phản ánh một trung tâm đáp ứng được bao nhiêu phần của đơn | số thập phân | 5 | 0,00–1,00; xem BR-06 |
| Storage Location | Vị trí thô của một SKU trong một trung tâm, dùng để sắp thứ tự danh sách nhặt hàng | chữ và số | 20 | Do nhân viên kho duy trì; chi tiết tới mức ô kệ nằm ngoài phạm vi (EX-3) |
| Street Address | Số nhà và tên đường của địa chỉ giao hàng | chữ và số | 200 | Không để trống |
| Subscriber Number | Phần số thuê bao trong nước của một số điện thoại, không có số 0 đứng đầu | số | 9 | 9 chữ số |
| Total Score | Tổng có trọng số của các thành phần điểm định tuyến của một trung tâm | số thập phân | 6 | 0,00–1,00; tính theo BR-06; cao nhất thì thắng |
| Tracking Event | Một lần quét hoặc một lần cập nhật trạng thái của hãng cho một lô giao | Event ID + Tracking Number + Carrier Code + Carrier Status Code + OMFS Status + Carrier Event Time + Received At | | |
| Tracking Number | Mã của hãng vận chuyển cho một kiện hàng, dùng để khách theo dõi | chữ và số | 40 | Hãng cấp lúc mua nhãn; duy nhất trong phạm vi từng hãng |
| Unit Price | Giá một đơn vị của một SKU theo mức kênh bán thu của khách | số thập phân, VND | 12 | ≥ 0; do kênh cung cấp, OMFS không bao giờ tính lại |
| Ward | Phường/xã của địa chỉ giao hàng | chữ cái | 60 | Lấy từ danh mục đơn vị hành chính quốc gia |
| Wave ID | Mã định danh duy nhất của một đợt nhặt hàng | chữ và số | 20 | Hệ thống tự sinh |
| Wave Status | Trạng thái hiện tại của một đợt nhặt hàng | chữ cái | 12 | [ Draft \| Released \| Complete \| Cancelled ] |

---

## 3. Ghi chú cho vài mục đáng chú ý

**Available To Promise** là mục quan trọng nhất trong từ điển này. Nó không phải dữ liệu
được lưu — nó được suy ra, và chính cách suy ra nó (BR-07) là thứ khép lại lỗ hổng bán
vượt tồn vốn là động cơ của cả dự án. Mọi chỗ mà một con số lượng được hiện ra cho một
kênh, một người vận hành hay một khách hàng, thì con số đó là nó, không phải On Hand
Quantity.

**Order Status và Shipment Status** cố ý là hai bộ từ vựng khác nhau. Một đơn có thể được
giao một phần khi nó bị tách (BR-08), nên trạng thái của nó không đơn giản là trạng thái
của các lô giao. Gộp hai danh sách lại — một phép đơn giản hoá rất hấp dẫn — sẽ làm cho
một đơn bị tách trở nên không biểu diễn nổi.

**Carrier Event Time và Received At** tồn tại thành một cặp để đo được độ trễ nhận sự
kiện. Mốc p95 15 phút mang lại mục tiêu nghiệp vụ BO-4 được tính từ hiệu số của hai cái,
và UC-08 sắp thứ tự sự kiện theo Carrier Event Time chứ không theo Received At, đúng vì
các hãng vận chuyển gửi sự kiện về không theo thứ tự.

**Override Reason và Resolution Reason** là văn bản tự do bắt buộc. Chúng tồn tại vì
BR-19 và UC-10 POST-1 đòi hỏi một quyết định của con người phải giải thích được về sau;
thiếu chúng thì vết kiểm toán ghi lại *cái gì* đã xảy ra nhưng không bao giờ ghi *vì sao*.
