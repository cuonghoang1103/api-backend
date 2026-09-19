# Business Rules — Luật nghiệp vụ
## cho Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)

Phiên bản 1.0 đã duyệt
Người soạn: **<Tên nhóm trưởng>**, Nhóm Phân tích nghiệp vụ — Nhóm <N>
Nova Retail Group (NRG)
17 tháng 9 năm 2026

---

### Lịch sử sửa đổi

| Người | Ngày | Lý do sửa | Phiên bản |
|---|---|---|---|
| Nhóm BA, Nhóm <N> | 17-09-2026 | Thu thập luật từ các buổi khai thác 1–4 | 0.9 |
| Nhóm BA, Nhóm <N> | 17-09-2026 | Phân loại, khử trùng lặp và tham chiếu chéo sang use case | 1.0 |

---

## 1. Mục đích và phạm vi

Tài liệu này là catalog các luật nghiệp vụ của NRG chi phối việc hoàn tất đơn hàng. Một
**business rule** là một chính sách, quy định, chuẩn mực, phép tính hoặc định nghĩa tồn
tại trong doanh nghiệp **độc lập với mọi phần mềm**, nhưng phần mềm có thể được yêu cầu
phải cưỡng chế nó. Mỗi luật được ghi ở đây **một lần duy nhất**; mọi use case và mọi yêu
cầu chức năng cưỡng chế một luật đều chỉ tham chiếu tới nó **bằng mã**, không bao giờ
chép lại nội dung (xem §5, Truy vết).

Các luật được phân loại theo bảng năm kiểu của Wiegers & Beatty, *Software Requirements*,
tái bản lần 3, chương 9:

| Kiểu | Nghĩa |
|---|---|
| **Fact** | Một phát biểu luôn đúng về nghiệp vụ; một bất biến của lĩnh vực |
| **Constraint** | Điều phải hoặc không được xảy ra; nó hạn chế một hành động |
| **Action enabler** | Một điều kiện mà khi đúng thì kích hoạt một hành động |
| **Inference** | Tri thức mới suy ra từ các sự kiện đã có ("nếu A thì B đúng") |
| **Computation** | Một công thức sinh ra một giá trị |

**Tĩnh hay Động** ghi lại việc *bản thân luật đó* có được dự kiến sẽ thay đổi theo thời
gian hay không. Luật động phải **cấu hình được trong hệ thống**, không được biên dịch
cứng vào nó; sự phân biệt này là thứ hữu ích nhất của cả cái bảng đối với nhóm phát triển.

---

## 2. Danh mục luật

| Mã | Định nghĩa luật | Kiểu | Tĩnh/Động | Nguồn |
|---|---|---|---|---|
| **BR-01** | Một dòng đơn hàng được hoàn tất từ đúng một trung tâm hoàn tất đơn. Một dòng không bao giờ bị tách ra nhiều trung tâm; một *đơn* thì có thể bị tách, một *dòng* thì không. | Fact | Tĩnh | Quản lý hoàn tất đơn, buổi 2 |
| **BR-02** | Chỉ được giữ tồn cho một dòng đơn hàng khi số available-to-promise của SKU đó tại trung tâm được chọn lớn hơn hoặc bằng số lượng đặt. | Constraint | Tĩnh | Kiểm soát tồn kho, buổi 2 |
| **BR-03** | Mọi dòng của cùng một đơn đều giao tới một địa chỉ duy nhất. Khách muốn hai địa chỉ thì phải đặt hai đơn. | Constraint | Tĩnh | Quản lý hoàn tất đơn, buổi 2 |
| **BR-04** | Nếu việc uỷ quyền thanh toán không được xác nhận trong vòng 30 phút kể từ lúc tạo lượt giữ tồn, lượt giữ đó bị nhả ra. | Action enabler | Động | Chính sách tài chính (COO), buổi 3 |
| **BR-05** | Một đơn chỉ được huỷ hoặc sửa trước khi nhãn vận chuyển của nó được mua. Sau thời điểm đó, quy trình đúng là trả hàng. | Constraint | Tĩnh | Quản lý CSKH, buổi 3 |
| **BR-06** | Điểm định tuyến = (w₁ × độ phủ tồn kho) + (w₂ × độ gần điểm đến) + (w₃ × chi phí vận chuyển dự kiến) + (w₄ × năng lực còn lại của trung tâm), với w₁+w₂+w₃+w₄ = 1,0. Trung tâm có điểm cao nhất sẽ hoàn tất đơn. | Computation | Động | Quản lý hoàn tất đơn, buổi 2 |
| **BR-07** | Available-to-promise (ATP) = tồn thực tế − đã giữ − hỏng − tồn an toàn, tính theo từng SKU tại từng trung tâm hoàn tất đơn. | Computation | Động | Kiểm soát tồn kho, buổi 2 |
| **BR-08** | Một đơn được tách ra tối đa ba trung tâm hoàn tất đơn. Đơn cần hơn ba trung tâm trở thành một ngoại lệ hoàn tất đơn. | Constraint | Động | Quản lý hoàn tất đơn, buổi 2 |
| **BR-09** | Một đơn bị coi là "có rủi ro" khi (ngày giao đã hứa − hôm nay) nhỏ hơn thời gian vận chuyển công bố của hãng được chọn tới điểm đến đó. | Inference | Động | Quản lý logistics, buổi 3 |
| **BR-10** | Đơn được định tuyến về một trung tâm sau 14:00 giờ địa phương sẽ được xuất đi vào ngày làm việc kế tiếp. | Fact | Động | Quản lý hoàn tất đơn, buổi 2 |
| **BR-11** | Một hãng vận chuyển chỉ đủ điều kiện cho một lô giao nếu nó phục vụ mã bưu chính của điểm đến **và** kiện hàng nằm trong giới hạn khối lượng và kích thước của hãng đó **và** hãng đang ở trạng thái Active. | Constraint | Động | Quản lý logistics, buổi 3 |
| **BR-12** | Chi phí vận chuyển trọn gói = giá cơ bản theo dải khối lượng + phụ phí vùng xa (nếu có) + phụ phí nhiên liệu − chiết khấu sản lượng theo hợp đồng. | Computation | Động | Quản lý logistics, buổi 3 |
| **BR-13** | Nếu một lô giao đã phát trong một đợt nhặt hàng mà chưa được nhặt trong vòng 24 giờ kể từ lúc phát, nó được leo thang lên Quản lý hoàn tất đơn. | Action enabler | Động | Quản lý hoàn tất đơn, buổi 2 |
| **BR-14** | Việc trả hàng chỉ được chấp nhận trong vòng 30 ngày kể từ ngày giao được ghi nhận cho lô hàng đó. | Constraint | Động | Quản lý CSKH, buổi 3 |
| **BR-15** | Khi kiểm hàng trả, món được ghi nhận là còn bán được thì nhập lại vào tồn khả dụng; món được ghi nhận là hỏng thì chuyển vào khu cách ly và không được quay lại tồn bán được. | Action enabler | Tĩnh | Kiểm soát tồn kho, buổi 4 |
| **BR-16** | Đơn xuất phát từ kênh sàn TMĐT không được sửa sau khi đã nhận; chúng chỉ được huỷ toàn bộ. | Fact | Động | Thoả thuận người bán trên sàn (Quản lý nhãn hàng), buổi 3 |
| **BR-17** | Tồn an toàn được giữ theo từng SKU tại từng trung tâm hoàn tất đơn và bị loại khỏi available-to-promise. Mặc định là 2 đơn vị và cấu hình được theo từng SKU. | Constraint | Động | Kiểm soát tồn kho, buổi 2 |
| **BR-18** | Một SKU bị coi là "có nguy cơ hết hàng" khi available-to-promise của nó trên toàn bộ các trung tâm nhỏ hơn tốc độ bán trung bình mỗi ngày trong 7 ngày trước đó. | Inference | Động | Kiểm soát tồn kho, buổi 4 |
| **BR-19** | Chỉ người dùng giữ vai Quản lý hoàn tất đơn mới được ghi đè một quyết định định tuyến tự động, và mọi lần ghi đè đều phải ghi lại lý do. | Constraint | Tĩnh | COO, buổi 1 |
| **BR-20** | Khi số lượng bán được của một SKU thay đổi vì bất kỳ lý do gì, số lượng mới được công bố tới mọi kênh bán đang hoạt động có bán SKU đó trong vòng 60 giây. | Action enabler | Động | COO, buổi 1 |

### 2.1 Độ phủ theo kiểu

| Kiểu | Các luật | Số lượng |
|---|---|---|
| Fact | BR-01, BR-10, BR-16 | 3 |
| Constraint | BR-02, BR-03, BR-05, BR-08, BR-11, BR-14, BR-17, BR-19 | 8 |
| Action enabler | BR-04, BR-13, BR-15, BR-20 | 4 |
| Inference | BR-09, BR-18 | 2 |
| Computation | BR-06, BR-07, BR-12 | 3 |
| | **Tổng** | **20** |

### 2.2 Tĩnh và động — nó có nghĩa gì với việc xây dựng

Mười bốn trong hai mươi luật là **động**, nên giá trị của chúng phải nằm trong cấu hình
và do một người dùng nghiệp vụ đổi, không phải do lập trình viên. Cụ thể:

| Luật | Giá trị cấu hình được | Ai được đổi |
|---|---|---|
| BR-04 | Thời hạn giữ tồn (30 phút) | Quản trị hệ thống |
| BR-06 | Các trọng số định tuyến w₁…w₄ | Quản lý hoàn tất đơn |
| BR-07 | Những loại tồn nào bị trừ đi | Quản trị hệ thống |
| BR-08 | Số lần tách tối đa (3) | Quản lý hoàn tất đơn |
| BR-10 | Giờ chốt xuất hàng (14:00) | Quản lý hoàn tất đơn, theo từng trung tâm |
| BR-11 | Điều kiện và giới hạn của hãng vận chuyển | Quản lý logistics |
| BR-12 | Bảng giá, các phụ phí, chiết khấu | Quản lý logistics |
| BR-13 | Cửa sổ leo thang khi nhặt hàng (24 giờ) | Quản lý hoàn tất đơn |
| BR-14 | Cửa sổ trả hàng (30 ngày) | Quản lý CSKH |
| BR-17 | Tồn an toàn mặc định và ghi đè theo từng SKU | Kiểm soát tồn kho |
| BR-18 | Cửa sổ tính tốc độ bán (7 ngày) | Kiểm soát tồn kho |
| BR-20 | Mốc thời gian công bố (60 giây) | Quản trị hệ thống |

> Đây chính là lý do cột phân loại quan trọng. Một nhóm viết cứng cửa sổ trả hàng 30 ngày
> vào mã thì chưa vi phạm yêu cầu nào, nhưng đã bảo đảm chắc chắn sẽ phải sửa mã ngay lần
> đầu doanh nghiệp chạy chương trình khuyến mãi trả hàng 45 ngày dịp lễ.

---

## 3. Những luật CỐ Ý không cưỡng chế bằng phần mềm

Không phải luật nghiệp vụ nào cũng thuộc về hệ thống. Ghi lại những luật không thuộc về
nó — và vì sao — giúp chúng không bị phát hiện lại và tranh cãi lại ở một bản phát hành
sau.

| Luật | Vì sao OMFS không cưỡng chế |
|---|---|
| Hoàn tiền được thực hiện trong vòng 5 ngày làm việc sau khi chấp nhận trả hàng | Việc hoàn tiền do bộ phận tài chính thực hiện trên cổng thanh toán; OMFS chỉ ghi nhận rằng có một khoản hoàn tiền phải trả (EX-5) |
| Món hàng hỏng phải được chụp ảnh trước khi đưa vào khu cách ly | Đây là quy trình trong kho, được giám sát viên kiểm tra, không phải phần mềm |
| Điểm đánh giá người bán trên sàn phải giữ trên ngưỡng Preferred | Đây là một kết quả dự án nhắm tới, không phải một luật hệ thống cưỡng chế được |
| Vị trí ô kệ được sắp xếp lại theo quý | Thuộc về quản lý kho, đã tường minh nằm ngoài phạm vi (EX-3) |

---

## 4. Các luật được phát hiện như thế nào

| Buổi | Ngày | Vai bên liên quan được đóng | Kỹ thuật | Luật thu được |
|---|---|---|---|---|
| 1 | 08-09-2026 | COO (người tài trợ dự án) | Phỏng vấn có cấu trúc, 8 câu hỏi chuẩn bị sẵn | BR-19, BR-20 |
| 2 | 09-09-2026 | Quản lý hoàn tất đơn + Kiểm soát tồn kho | Workshop có điều phối, đi lại quy trình hiện trạng | BR-01, BR-02, BR-03, BR-06, BR-07, BR-08, BR-10, BR-13, BR-17 |
| 3 | 11-09-2026 | Quản lý logistics + Quản lý CSKH + Quản lý nhãn hàng | Phỏng vấn có cấu trúc | BR-04, BR-05, BR-09, BR-11, BR-12, BR-14, BR-16 |
| 4 | 12-09-2026 | Kiểm soát tồn kho | Hỏi tiếp các câu còn treo từ buổi 2 | BR-15, BR-18 |

**Ghi chú về kỹ thuật.** Nguồn giàu nhất là **buổi đi lại quy trình hiện trạng** ở buổi
2: cứ hỏi "rồi sau đó thì sao?" xuyên suốt quy trình hoàn tất đơn thủ công đang chạy đã
làm lộ ra chín luật, mà phần lớn chưa từng được ai viết xuống — chúng chỉ tồn tại dưới
dạng thói quen của những nhân viên lâu năm. Các luật tìm ra theo cách này (BR-01, BR-08,
BR-10) đều được Quản lý hoàn tất đơn xác nhận trước khi ghi vào, vì một thói quen không
mặc nhiên là một chính sách.

**Những câu hỏi còn treo, mang sang danh sách TBD của SRS**

| # | Câu hỏi | Người chịu trách nhiệm | Hạn |
|---|---|---|---|
| TBD-1 | Cửa sổ trả hàng 30 ngày (BR-14) tính từ lúc giao hay từ lúc xuất hàng? Hai bên liên quan trả lời khác nhau. | Quản lý CSKH | Tuần 7 |
| TBD-2 | Các trọng số định tuyến (BR-06) dùng chung cho cả năm nhãn hàng ở bản 1.0, hay theo từng nhãn? | Quản lý hoàn tất đơn | Tuần 6 |
| TBD-3 | Tồn an toàn (BR-17) có áp theo từng kênh bán nữa không, hay chỉ theo trung tâm hoàn tất đơn? | Kiểm soát tồn kho | Tuần 7 |

---

## 5. Truy vết: luật → use case → yêu cầu

Mỗi luật được một hoặc nhiều use case cưỡng chế, và thông qua chúng, được các yêu cầu
chức năng cụ thể trong SRS cưỡng chế. **Nội dung luật chỉ xuất hiện trong tài liệu này**;
mọi nơi khác đều tham chiếu bằng mã.

| Luật | Được cưỡng chế trong use case | Yêu cầu chức năng trong SRS |
|---|---|---|
| BR-01 | UC-03, UC-04 | Reserve-2, Route-1 |
| BR-02 | UC-03 | Reserve-2 |
| BR-03 | UC-02 | Validate-3 |
| BR-04 | UC-02, UC-03 | Reserve-3 |
| BR-05 | UC-10, UC-11 | Cancel-1, Cancel-2 |
| BR-06 | UC-04, UC-14 | Route-2, Route-3 |
| BR-07 | UC-03, UC-06, UC-13 | Reserve-1, Sync-1 |
| BR-08 | UC-03, UC-04 | Route-4 |
| BR-09 | UC-04, UC-08, UC-09, UC-10, UC-14 | Track-4, Except-1 |
| BR-10 | UC-04, UC-05 | Route-5, Wave-2 |
| BR-11 | UC-07 | Label-1 |
| BR-12 | UC-07 | Label-2 |
| BR-13 | UC-05, UC-06, UC-10 | Wave-4 |
| BR-14 | UC-12 | Return-1 |
| BR-15 | UC-12 | Return-4 |
| BR-16 | UC-01, UC-11 | Cancel-4 |
| BR-17 | UC-03, UC-06, UC-13 | Reserve-1, Sync-2 |
| BR-18 | UC-14 | Dash-3 |
| BR-19 | UC-04 | Route-6 |
| BR-20 | UC-13 | Sync-3 |

**Mọi luật trong catalog này đều được ít nhất một use case cưỡng chế.** Một luật không có
use case nào cưỡng chế thì hoặc nằm ngoài phạm vi (xem §3), hoặc là một lỗ hổng trong bộ
use case — phép kiểm này đã chạy trước khi chốt bản cơ sở và được chạy lại trước khi nộp.
