# Use Cases
## cho Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)

Phiên bản 1.0 đã duyệt
Người soạn: **<Tên nhóm trưởng>**, Nhóm Phân tích nghiệp vụ — Nhóm <N>
Nova Retail Group (NRG)
17 tháng 9 năm 2026

---

### Lịch sử sửa đổi

| Người | Ngày | Lý do sửa | Phiên bản |
|---|---|---|---|
| Nhóm BA, Nhóm <N> | 17-09-2026 | Danh sách use case ban đầu từ các buổi khai thác 1–3 | 0.9 |
| Nhóm BA, Nhóm <N> | 17-09-2026 | Hoàn thành và rà soát chéo cả 14 đặc tả | 1.0 |

---

## 1. Actor

### 1.1 Actor chính

| Actor | Mô tả |
|---|---|
| **Nhân viên kho** | Nhặt và đóng gói đơn bên trong một trung tâm hoàn tất đơn bằng máy quét cầm tay. ~60 người dùng trên 3 FC. |
| **Quản lý hoàn tất đơn** | Chịu trách nhiệm về thông lượng của một hoặc nhiều FC. Phát các đợt nhặt hàng, xử lý ngoại lệ, ghi đè quyết định định tuyến. |
| **Kiểm soát tồn kho** | Chịu trách nhiệm về độ chính xác tồn kho. Cấu hình tồn an toàn, rà các lượt giữ tồn, điều tra sai lệch. |
| **Nhân viên CSKH** | Trả lời các liên hệ của khách. Huỷ, sửa và khởi tạo trả hàng thay mặt khách. ~25 người dùng. |
| **Quản lý logistics** | Chịu trách nhiệm về quan hệ với hãng vận chuyển và chi phí giao hàng. Cấu hình điều kiện hãng và đối soát hoá đơn 3PL. |
| **Quản lý nhãn hàng** | Phụ trách một trong năm nhãn. Đọc báo cáo hoàn tất đơn; không vận hành hệ thống hằng ngày. |
| **Quản trị hệ thống** | Cấu hình kênh bán, trung tâm hoàn tất đơn, người dùng và các tham số định tuyến. |
| **Khách hàng** | Người mua. **Chỉ** tương tác với OMFS qua trang tự tra cứu đơn hàng (UC-09). |

### 1.2 Actor phụ (hệ thống ngoài)

| Actor | Mô tả |
|---|---|
| **Kênh bán** | Storefront trên web hoặc một sàn (Shopee, Lazada, TikTok Shop). Nguồn của đơn hàng, đích của các lượt cập nhật tồn kho. |
| **Hãng 3PL** | GHN, GHTK, Viettel Post hoặc J&T Express. Cung cấp báo giá, nhãn vận chuyển và sự kiện theo dõi qua API. |
| **Cổng thanh toán** | Giữ trạng thái uỷ quyền thanh toán của một đơn. OMFS chỉ đọc. |
| **Dịch vụ Thông báo** | Gửi email và SMS tới khách hàng thay mặt OMFS. |

> **Vì sao hệ ERP / kế toán không được liệt kê là actor.** Nó nhận một lượt ghi sổ hằng
> ngày về tài chính của các đơn đã giao, nhưng nó không tham gia use case nào trong mười
> bốn cái — không actor nào làm gì để khởi động nó và không việc gì nó làm xuất hiện
> trong một luồng nào. Vì thế nó được đặc tả như một **giao tiếp phần mềm ở SRS §5.2**,
> không phải như một actor của use case. Liệt kê một hệ thống là actor khi nó không xuất
> hiện trong luồng nào là một lỗi truy vết, nên ở đây nó được loại ra một cách có chủ ý.

---

## 2. Danh sách Use Case

| Mã | Actor chính | Actor phụ | Tên use case | Mô tả |
|---|---|---|---|---|
| UC-01 | Kênh bán | — | Nhận một đơn từ kênh bán | Lấy một đơn mới từ bất kỳ kênh nào và chuẩn hoá nó thành một bản ghi đơn hàng OMFS duy nhất |
| UC-02 | OMFS (theo lịch) | Cổng thanh toán | Sàng lọc và kiểm tính hợp lệ của đơn | Kiểm địa chỉ, uỷ quyền thanh toán và dấu hiệu gian lận trước khi đơn chiếm tồn kho |
| UC-03 | OMFS (sự kiện) | — | Giữ tồn kho | Giữ tồn available-to-promise cho mọi dòng của đơn, hoặc đánh dấu đơn là chờ hàng |
| UC-04 | OMFS (sự kiện) | Quản lý hoàn tất đơn | Định tuyến và tách đơn | Chọn các trung tâm hoàn tất đơn sẽ giao từng dòng, theo một luật chấm điểm cấu hình được |
| UC-05 | Quản lý hoàn tất đơn | — | Sinh và phát một đợt nhặt hàng | Gom các đơn đã định tuyến thành một đợt nhặt cho một FC và phát nó xuống sàn kho |
| UC-06 | Nhân viên kho | — | Nhặt và đóng gói có quét xác nhận | Nhặt từng món theo máy cầm tay, xác minh bằng mã vạch, và gán món vào thùng |
| UC-07 | OMFS (sự kiện) | Hãng 3PL | So giá hãng vận chuyển và mua nhãn | So các hãng đủ điều kiện theo chi phí và mức dịch vụ, rồi mua nhãn qua API |
| UC-08 | Hãng 3PL | Dịch vụ Thông báo | Nhận một sự kiện theo dõi từ hãng | Nhận một sự kiện trạng thái của hãng và áp nó vào lô giao và đơn hàng |
| UC-09 | Khách hàng | — | Theo dõi một đơn hàng (tự phục vụ) | Cho khách xem trạng thái đơn và lô giao hiện tại, chính xác, mà không cần liên hệ hỗ trợ |
| UC-10 | Quản lý hoàn tất đơn | Kiểm soát tồn kho | Xử lý một ngoại lệ hoàn tất đơn | Giải quyết các ngoại lệ chờ hàng, tách đơn thất bại, giao thiếu và lỗi địa chỉ từ một bảng điều khiển duy nhất |
| UC-11 | Nhân viên CSKH | Kênh bán | Huỷ hoặc sửa đơn trước khi xuất hàng | Huỷ hoặc đổi một đơn khi còn chặn được, đồng thời nhả mọi tồn kho đang giữ |
| UC-12 | Nhân viên CSKH | Nhân viên kho | Xử lý trả hàng và nhập lại kho | Cho phép trả hàng, nhận hàng về, kiểm hàng, rồi nhập lại kho hoặc đưa vào khu cách ly |
| UC-13 | OMFS (sự kiện) | Kênh bán | Đồng bộ số tồn kho ra các kênh bán | Đẩy số lượng khả dụng đã thay đổi tới mọi kênh có bán SKU đó |
| UC-14 | Quản lý hoàn tất đơn | — | Xem bảng điều khiển hiệu suất hoàn tất đơn | Theo dõi thông lượng, thời gian chu kỳ, lượng ngoại lệ và chi phí vận chuyển so với mục tiêu |

> **Truy vết về các tính năng ở Vision & Scope:** UC-01→FE-1 · UC-02→FE-2 · UC-03→FE-3 · UC-04→FE-5 · UC-05→FE-6 · UC-06→FE-7 · UC-07→FE-8 · UC-08→FE-9 · UC-09→FE-10 · UC-10→FE-11 · UC-11→FE-12 · UC-12→FE-13 · UC-13→FE-4 · UC-14→FE-14

---

## 3. Đặc tả Use Case

### UC-01 — Nhận một đơn từ kênh bán

| | |
|---|---|
| **Mã và tên UC** | UC-01 — Nhận một đơn từ kênh bán |
| **Người soạn** | Thành viên 2 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Kênh bán (hệ thống) | **Actor phụ** | — |
| **Kích hoạt** | Một đơn mới đạt trạng thái "đã thanh toán" hoặc "đã đặt" trên một kênh bán, hoặc khoảng thời gian hỏi định kỳ (60 giây) trôi qua. |
| **Mô tả** | OMFS lấy các đơn mới từ từng kênh bán đã nối và chuyển mỗi đơn thành một bản ghi đơn hàng OMFS đã chuẩn hoá, bất kể định dạng dữ liệu riêng của kênh đó. Đây là điểm vào của toàn bộ vòng đời hoàn tất đơn. |
| **Tiền điều kiện** | PRE-1: Kênh bán đã được đăng ký trong OMFS và ở trạng thái Active. <br> PRE-2: Thông tin xác thực API hợp lệ của kênh đã được lưu và chưa hết hạn. |
| **Hậu điều kiện** | POST-1: Tồn tại đúng một đơn OMFS cho một đơn của kênh, với trạng thái Pending. <br> POST-2: Mọi dòng đơn hàng đều tham chiếu một SKU có trong danh mục sản phẩm gốc, hoặc đơn bị giữ lại ở hàng chờ SKU chưa ánh xạ. <br> POST-3: Mã đơn của kênh và mã đơn OMFS được liên kết với nhau, nên nhận lại cùng một đơn của kênh sẽ không tạo ra bản trùng. |
| **Luồng chính** | **1.0** <br> 1. Hệ thống hỏi kênh về các đơn tạo ra kể từ mốc nước lần nhận thành công gần nhất. <br> 2. Kênh trả về một tập đơn hàng. <br> 3. Với từng đơn, hệ thống ánh xạ các trường của kênh sang cấu trúc đơn hàng OMFS (khách hàng, địa chỉ giao, các dòng, tổng tiền, phương thức thanh toán). <br> 4. Hệ thống phân giải từng SKU của kênh sang một SKU của OMFS bằng bảng ánh xạ SKU theo kênh. <br> 5. Hệ thống tạo đơn với trạng thái Pending và ghi lại mã đơn của kênh. <br> 6. Hệ thống đẩy mốc nước lần nhận tiến lên. <br> 7. Hệ thống phát một sự kiện đơn-đã-tạo, và sự kiện đó kích hoạt UC-02. |
| **Luồng thay thế** | **1.1 — Nhận lại bằng tay.** Ở bước 1, một Quản trị hệ thống yêu cầu nhận lại một mã đơn cụ thể của kênh; hệ thống lấy riêng đơn đó và tiếp tục từ bước 3. <br> **1.2 — Lấy bù sau sự cố.** Ở bước 1, mốc nước cũ hơn 1 giờ; hệ thống duyệt danh sách đơn của kênh theo lô 100 đơn và tiếp tục từ bước 3 cho từng lô. |
| **Ngoại lệ** | **1.0.E1 — Không liên lạc được với kênh.** Ở bước 1, API của kênh không phản hồi hoặc trả về 5xx. Hệ thống thử lại theo lùi bậc mũ tối đa 5 lần, không đẩy mốc nước, và phát một cảnh báo tích hợp sau lần hỏng cuối cùng. Không ghi trạng thái dở dang nào. <br> **1.0.E2 — SKU chưa ánh xạ.** Ở bước 4, một SKU của kênh không có ánh xạ. Hệ thống tạo đơn với trạng thái Held-Unmapped, đưa nó vào hàng chờ SKU chưa ánh xạ cho Kiểm soát tồn kho, và **không** phát sự kiện đơn-đã-tạo. <br> **1.0.E3 — Đơn trùng.** Ở bước 5, mã đơn của kênh đã tồn tại trong OMFS. Hệ thống ghi nhật ký lần trùng đó và bỏ qua, không tạo đơn thứ hai. <br> **1.0.E4 — Đơn sai định dạng.** Ở bước 3 thiếu một trường bắt buộc (địa chỉ giao, ít nhất một dòng). Hệ thống tạo đơn với trạng thái Held-Invalid và phát một ngoại lệ chất lượng dữ liệu cho UC-10. |
| **Độ ưu tiên** | Cao |
| **Tần suất dùng** | Trung bình 4.500 đơn/ngày; đỉnh 18.000/ngày. Việc hỏi định kỳ chạy mỗi 60 giây cho mỗi kênh, 4 kênh. |
| **Business Rule** | BR-16 |
| **Thông tin khác** | Việc nhận đơn phải luỹ đẳng: cùng một đơn của kênh xử lý hai lần phải cho ra một đơn OMFS (POST-3). Nếu tiến trình hỏng giữa bước 5 và bước 6, lần chạy kế tiếp đọc lại đúng cửa sổ đó và dựa vào POST-3 để tránh nhân đôi. Việc ánh xạ trường theo từng kênh là cấu hình, không phải mã, nên thêm một kênh mới không cần ra bản phần mềm. |
| **Giả định** | Cả bốn kênh đều mở một API lấy đơn có hỗ trợ lọc theo dấu thời gian tạo đơn. |

### UC-02 — Sàng lọc và kiểm tính hợp lệ của đơn

| | |
|---|---|
| **Mã và tên UC** | UC-02 — Sàng lọc và kiểm tính hợp lệ của đơn |
| **Người soạn** | Thành viên 2 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | OMFS (hệ thống, theo sự kiện) | **Actor phụ** | Cổng thanh toán, Nhân viên CSKH |
| **Kích hoạt** | UC-01 phát ra một sự kiện đơn-đã-tạo. |
| **Mô tả** | Trước khi một đơn được phép chiếm tồn kho, OMFS xác minh rằng địa chỉ giao hàng giao được, việc thanh toán đã được uỷ quyền (hoặc đơn là thu tiền khi nhận hàng), và đơn không khớp một mẫu gian lận nào. Sàng lọc trước khi giữ tồn chính là thứ ngăn tồn kho bị giữ cho những đơn sẽ không bao giờ giao. |
| **Tiền điều kiện** | PRE-1: Đơn tồn tại với trạng thái Pending. <br> PRE-2: Đơn có ít nhất một dòng và một địa chỉ giao. |
| **Hậu điều kiện** | POST-1: Trạng thái đơn là Validated, hoặc Held-Review, hoặc Cancelled — không bao giờ bị bỏ lại ở Pending. <br> POST-2: Mọi quyết định sàng lọc đều được ghi lại kèm mã lý do và dấu thời gian. |
| **Luồng chính** | **2.0** <br> 1. Hệ thống chuẩn hoá địa chỉ giao và xác minh rằng mã bưu chính có ít nhất một hãng phục vụ. <br> 2. Hệ thống đọc trạng thái uỷ quyền thanh toán từ cổng thanh toán. <br> 3. Hệ thống đánh giá bộ luật gian lận (giá trị đơn, lệch giữa địa chỉ và thanh toán, tần suất đặt từ cùng một khách). <br> 4. Cả ba phép kiểm đều đạt; hệ thống đặt trạng thái đơn là Validated. <br> 5. Hệ thống phát một sự kiện đã-kiểm, và sự kiện đó kích hoạt UC-03. |
| **Luồng thay thế** | **2.1 — Thu tiền khi nhận hàng.** Ở bước 2, phương thức thanh toán là COD; hệ thống bỏ qua phép kiểm uỷ quyền và tiếp tục ở bước 3. <br> **2.2 — Nhân viên ghi đè.** Từ trạng thái Held-Review, một Nhân viên CSKH xem lại đơn, ghi một lời giải trình, và thả nó ra; hệ thống đặt trạng thái Validated và tiếp tục ở bước 5. |
| **Ngoại lệ** | **2.0.E1 — Địa chỉ không giao được.** Ở bước 1, không hãng nào phục vụ mã bưu chính đó. Hệ thống đặt trạng thái Held-Review với lý do ADDRESS_UNSERVICEABLE và phát một ngoại lệ cho UC-10. <br> **2.0.E2 — Thanh toán chưa được uỷ quyền.** Ở bước 2, cổng báo bị từ chối hoặc đang chờ. Hệ thống đặt trạng thái Held-Review với lý do PAYMENT_NOT_AUTHORIZED và không giữ tồn. <br> **2.0.E3 — Cổng thanh toán không truy cập được.** Ở bước 2, cổng không phản hồi. Hệ thống thử lại trong tối đa 5 phút, rồi đặt trạng thái Held-Review với lý do PAYMENT_UNKNOWN. Nó **không** giả định là đã được uỷ quyền. <br> **2.0.E4 — Kích hoạt luật gian lận.** Ở bước 3, một luật gian lận khớp. Hệ thống đặt trạng thái Held-Review với lý do FRAUD_REVIEW và báo cho hàng chờ của CSKH. |
| **Độ ưu tiên** | Cao |
| **Tần suất dùng** | Một lần cho mỗi đơn — trung bình 4.500/ngày, đỉnh 18.000/ngày. |
| **Business Rule** | BR-03, BR-04 |
| **Thông tin khác** | Việc sàng lọc phải hoàn tất trong vòng 30 giây kể từ sự kiện đơn-đã-tạo ở mức tải bình thường, vì mỗi giây trước khi giữ tồn là một giây mà cùng số hàng đó có thể bị bán lần nữa. Nếu use case hỏng sau bước 4 nhưng trước bước 5, một tác vụ khôi phục sẽ phát lại sự kiện đã-kiểm; UC-03 luỹ đẳng theo từng đơn nên không xảy ra việc giữ tồn hai lần. |
| **Giả định** | Cổng thanh toán mở ra một truy vấn trạng thái uỷ quyền mà bản thân nó không thu tiền. |

### UC-03 — Giữ tồn kho

| | |
|---|---|
| **Mã và tên UC** | UC-03 — Giữ tồn kho |
| **Người soạn** | Thành viên 2 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | OMFS (hệ thống, theo sự kiện) | **Actor phụ** | Kiểm soát tồn kho |
| **Kích hoạt** | UC-02 phát ra một sự kiện đã-kiểm. |
| **Mô tả** | OMFS tính available-to-promise theo từng SKU tại từng trung tâm hoàn tất đơn và đặt một lượt giữ lên số hàng mà mọi dòng của đơn cần. **Đây chính là cơ chế giải quyết việc bán vượt tồn**: hàng được cam kết ngay tại thời điểm nhận đơn, không phải tại thời điểm nhặt hàng. |
| **Tiền điều kiện** | PRE-1: Trạng thái đơn là Validated. <br> PRE-2: Mọi SKU trên đơn đều tồn tại trong danh mục sản phẩm gốc. |
| **Hậu điều kiện** | POST-1: Hoặc mọi dòng đều giữ được tồn và trạng thái đơn là Reserved, hoặc không dòng nào giữ được tồn và trạng thái đơn là Backordered. Một đơn giữ tồn dở dang không bao giờ bị bỏ lại ở trạng thái đó. <br> POST-2: Mỗi lượt giữ ghi lại SKU, trung tâm hoàn tất đơn, số lượng, thời điểm tạo và thời điểm hết hạn. <br> POST-3: Một sự kiện tồn-kho-đổi được phát cho mọi SKU bị ảnh hưởng, kích hoạt UC-13. |
| **Luồng chính** | **3.0** <br> 1. Hệ thống tính ATP theo từng SKU tại từng trung tâm bằng BR-07. <br> 2. Với từng dòng, hệ thống chọn trung tâm có ATP cao nhất mà đáp ứng đủ toàn bộ số lượng của dòng đó. <br> 3. Hệ thống giữ số lượng yêu cầu tại trung tâm đó. <br> 4. Hệ thống đặt thời điểm hết hạn giữ tồn là 30 phút kể từ lúc tạo (BR-04). <br> 5. Hệ thống đặt trạng thái đơn là Reserved. <br> 6. Hệ thống phát một sự kiện tồn-kho-đổi cho mỗi SKU và một sự kiện đã-giữ-tồn, và sự kiện sau kích hoạt UC-04. |
| **Luồng thay thế** | **3.1 — Giữ tồn có tách.** Ở bước 2, không một trung tâm nào đủ ATP cho cả dòng, nhưng tổng trên các trung tâm thì đủ. Hệ thống giữ tồn cho dòng đó trên tối đa ba trung tâm (BR-08), đánh dấu đơn là Split-Required cho UC-04, và tiếp tục ở bước 4. <br> **3.2 — Giữ tồn lại sau khi đã nhả.** Đơn đang ở trạng thái Backordered và hàng nhập về; một sự kiện tồn-kho-đổi đưa riêng đơn đó quay lại use case này ở bước 1. |
| **Ngoại lệ** | **3.0.E1 — Tổng ATP không đủ.** Ở bước 1, tổng ATP trên mọi trung tâm nhỏ hơn số lượng đặt của ít nhất một dòng. Hệ thống không giữ gì cho cả đơn, đặt trạng thái Backordered, và phát một ngoại lệ cho UC-10. <br> **3.0.E2 — Vượt giới hạn tách.** Ở luồng 3.1, một dòng sẽ cần hơn ba trung tâm (BR-08). Hệ thống không giữ gì, đặt trạng thái Backordered với lý do SPLIT_LIMIT, và phát một ngoại lệ cho UC-10. <br> **3.0.E3 — Lượt giữ tồn hết hạn.** Ba mươi phút trôi qua mà chưa xác nhận thanh toán (BR-04). Hệ thống nhả mọi lượt giữ của đơn, đưa trạng thái về Pending, và phát một sự kiện tồn-kho-đổi cho mỗi SKU. <br> **3.0.E4 — Xung đột giữ tồn đồng thời.** Ở bước 3, một đơn khác giữ cùng số hàng đó trước. Hệ thống đọc lại ATP và thử lại từ bước 1, tối đa 3 lần, rồi đi theo 3.0.E1. |
| **Độ ưu tiên** | Cao |
| **Tần suất dùng** | Một lần cho mỗi đơn đã kiểm — trung bình 4.500/ngày, đỉnh 18.000/ngày, với các đợt bùng tới 60 lượt giữ tồn/giây trong các phiên sale chớp nhoáng ngày chiến dịch. |
| **Business Rule** | BR-01, BR-02, BR-04, BR-07, BR-08, BR-17 |
| **Thông tin khác** | Việc giữ tồn phải **nguyên tử theo từng đơn** (POST-1). Nếu tiến trình hỏng giữa chừng, mọi lượt giữ đã đặt cho đơn đó đều được lùi lại; đơn quay về Validated và được thử lại. Giữ tồn là thao tác có mức tranh chấp cao nhất hệ thống và chi phối các thuộc tính chất lượng về tính đồng thời ở SRS §6.2. |
| **Giả định** | Số kiểm kê tồn kho vật lý lúc chuyển đổi chính xác trong phạm vi sai số 2%; sai số lớn hơn sẽ làm ATP sai ngay từ ngày đầu, bất kể logic này thế nào. |

### UC-04 — Định tuyến và tách đơn

| | |
|---|---|
| **Mã và tên UC** | UC-04 — Định tuyến và tách đơn qua các trung tâm hoàn tất đơn |
| **Người soạn** | Thành viên 2 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | OMFS (hệ thống, theo sự kiện) | **Actor phụ** | Quản lý hoàn tất đơn |
| **Kích hoạt** | UC-03 phát ra một sự kiện đã-giữ-tồn, hoặc một Quản lý hoàn tất đơn yêu cầu định tuyến lại một đơn. |
| **Mô tả** | OMFS quyết định trung tâm nào giao những dòng nào, tách đơn thành mỗi trung tâm một lô giao khi cần. Nó chấm điểm từng trung tâm ứng viên theo độ phủ tồn kho, khoảng cách tới khách, chi phí vận chuyển dự kiến và khối lượng công việc hiện tại của trung tâm, rồi chọn điểm cao nhất. **Điều này thay thế việc in và chia phiếu đơn hàng bằng tay.** |
| **Tiền điều kiện** | PRE-1: Trạng thái đơn là Reserved. <br> PRE-2: Ít nhất một trung tâm hoàn tất đơn đang Open và còn trong hạn mức năng lực ngày của nó. |
| **Hậu điều kiện** | POST-1: Đơn được phân rã thành một hoặc nhiều lô giao, mỗi lô gán cho đúng một trung tâm (BR-01). <br> POST-2: Quyết định định tuyến ghi lại điểm của mọi trung tâm ứng viên và lý do cái thắng đã thắng, để có thể giải thích và kiểm toán về sau. <br> POST-3: Trạng thái đơn là Routed. |
| **Luồng chính** | **4.0** <br> 1. Hệ thống lấy các lượt giữ tồn do UC-03 đặt và gom các dòng theo trung tâm đang giữ hàng của chúng. <br> 2. Với từng cách gom ứng viên, hệ thống tính điểm định tuyến bằng BR-06. <br> 3. Hệ thống chọn cách gom có điểm cao nhất. <br> 4. Hệ thống kiểm trung tâm được chọn so với năng lực ngày còn lại và giờ chốt xuất hàng 14:00 (BR-10). <br> 5. Hệ thống tạo mỗi trung tâm trong cách gom thắng cuộc một lô giao. <br> 6. Hệ thống ghi lại toàn bộ bảng điểm gắn với đơn (POST-2). <br> 7. Hệ thống đặt trạng thái đơn là Routed và phát một sự kiện đã-định-tuyến, kích hoạt UC-05. |
| **Luồng thay thế** | **4.1 — Đơn một trung tâm.** Ở bước 1, mọi dòng đều đã giữ tồn tại một trung tâm; hệ thống bỏ qua phần chấm điểm và tạo một lô giao, tiếp tục ở bước 6. <br> **4.2 — Ghi đè bằng tay.** Một Quản lý hoàn tất đơn mở bàn định tuyến, xem bảng điểm, chọn một trung tâm khác, và ghi một lý do. Hệ thống tạo lại các lô giao tương ứng và đánh dấu đơn là Manually-Routed (BR-19). <br> **4.3 — Định tuyến lại sau khi đổi năng lực.** Một trung tâm bị Quản trị hệ thống đóng lại; mọi đơn Routed chưa được nhặt hàng ở trung tâm đó sẽ quay lại use case này ở bước 1. |
| **Ngoại lệ** | **4.0.E1 — Mọi trung tâm đều hết năng lực.** Ở bước 4, mọi trung tâm ứng viên đều đã dùng hết năng lực ngày. Hệ thống giữ đơn ở trạng thái Routing-Deferred và thử lại ở cửa sổ năng lực kế tiếp; nếu ngày giao đã hứa có rủi ro (BR-09) thì nó phát một ngoại lệ cho UC-10. <br> **4.0.E2 — Việc tách vượt giới hạn.** Ở bước 3, cách gom thắng cuộc cần hơn ba lô giao (BR-08). Hệ thống phát một ngoại lệ cho UC-10 thay vì tạo các lô giao. <br> **4.0.E3 — Cấu hình định tuyến không hợp lệ.** Ở bước 2, các trọng số định tuyến không cộng bằng 1,0 hoặc thiếu một trọng số. Hệ thống lùi về quy tắc trung-tâm-gần-nhất-có-hàng, ghi một cảnh báo cấu hình, và đánh dấu quyết định là Fallback-Routed. |
| **Độ ưu tiên** | Cao |
| **Tần suất dùng** | Một lần cho mỗi đơn đã giữ tồn — trung bình 4.500/ngày, đỉnh 18.000/ngày. Định tuyến lại: ~20/ngày. |
| **Business Rule** | BR-01, BR-06, BR-08, BR-09, BR-10, BR-19 |
| **Thông tin khác** | Các trọng số định tuyến ở BR-06 là cấu hình, Quản lý hoàn tất đơn chỉnh được mà không cần ra bản phần mềm; bộ trọng số riêng theo từng nhãn hàng hoãn sang bản 2.0. POST-2 tồn tại vì Quản lý hoàn tất đơn nói rõ rằng họ sẽ không tin một quyết định tự động mà mình không soi được — bảng điểm là một yêu cầu, không phải một công cụ hỗ trợ gỡ lỗi. |
| **Giả định** | Khoảng cách giữa một trung tâm hoàn tất đơn và một mã bưu chính đích lấy được từ một bảng tra cứu tĩnh do Quản lý logistics duy trì. |

### UC-05 — Sinh và phát một đợt nhặt hàng

| | |
|---|---|
| **Mã và tên UC** | UC-05 — Sinh và phát một đợt nhặt hàng |
| **Người soạn** | Thành viên 2 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Quản lý hoàn tất đơn | **Actor phụ** | Nhân viên kho |
| **Kích hoạt** | Quản lý hoàn tất đơn khởi tạo một đợt, hoặc bộ hẹn giờ đợt theo lịch nổ (mỗi giờ, và tại mốc chốt 14:00). |
| **Mô tả** | Các lô giao đã định tuyến đang chờ ở một trung tâm được gom thành một đợt nhặt hàng — một lô công việc phát xuống sàn kho cùng lúc — để nhân viên đi qua kho một lần cho nhiều đơn thay vì một lần cho mỗi đơn. |
| **Tiền điều kiện** | PRE-1: Ít nhất một lô giao tại trung tâm này có trạng thái Routed. <br> PRE-2: Quản lý hoàn tất đơn đã xác thực và được phân công cho trung tâm này. |
| **Hậu điều kiện** | POST-1: Mọi lô giao trong đợt đã phát đều có trạng thái Picking và được liên kết với đợt đó. <br> POST-2: Một lô giao thuộc tối đa một đợt đang mở. |
| **Luồng chính** | **5.0** <br> 1. Quản lý hoàn tất đơn chọn một trung tâm và các tiêu chí đợt (giờ chốt của hãng, mức dịch vụ, tuổi đơn, kích cỡ đợt tối đa). <br> 2. Hệ thống liệt kê các lô giao Routed khớp tiêu chí, kèm số lượng và thời gian nhặt ước tính. <br> 3. Quản lý hoàn tất đơn xác nhận đợt. <br> 4. Hệ thống tạo đợt, gán mọi lô giao đã chọn vào đó, và đặt trạng thái của chúng là Picking. <br> 5. Hệ thống sinh danh sách nhặt hàng, sắp theo vị trí lưu trữ để giảm quãng đường đi lại. <br> 6. Hệ thống đưa đợt ra cho các máy cầm tay tại trung tâm đó. |
| **Luồng thay thế** | **5.1 — Đợt tự động.** Bộ hẹn giờ theo lịch nổ; hệ thống áp các tiêu chí mặc định đã lưu và thực thi bước 2, 4, 5, 6 mà không cần người xác nhận. <br> **5.2 — Đợt ưu tiên.** Quản lý hoàn tất đơn đánh dấu đợt là Priority; hệ thống đặt nó lên đầu mọi hàng chờ của máy cầm tay. <br> **5.3 — Huỷ một đợt.** Trước khi bất kỳ món nào trong đợt được nhặt, Quản lý hoàn tất đơn huỷ nó; mọi lô giao quay về Routed. |
| **Ngoại lệ** | **5.0.E1 — Lô giao đã nằm trong một đợt khác.** Ở bước 4, một lô giao đã chọn bị thêm vào một đợt khác một cách đồng thời (POST-2). Hệ thống loại nó ra, hoàn tất đợt với các lô giao còn lại, và báo lại phần bị loại. <br> **5.0.E2 — Không tìm thấy hàng lúc nhặt.** Xử lý ở UC-06, không phải ở đây, nhưng đợt vẫn mở cho tới khi mọi lô giao đạt một trạng thái kết thúc. <br> **5.0.E3 — Đợt vượt kích cỡ tối đa.** Ở bước 3, phần đã chọn vượt mức tối đa đã cấu hình. Hệ thống tạo nhiều đợt thay vì một đợt quá khổ, và nói cho người quản lý biết là bao nhiêu đợt. |
| **Độ ưu tiên** | Cao |
| **Tần suất dùng** | ~12 đợt mỗi trung tâm mỗi ngày; 36/ngày trên ba trung tâm. Nhiều hơn vào ngày chiến dịch. |
| **Business Rule** | BR-10, BR-13 |
| **Thông tin khác** | Thứ tự của danh sách nhặt hàng là một đòn bẩy thông lượng, không phải một lựa chọn cho đẹp: nó là yếu tố đóng góp lớn nhất cho mục tiêu nhận-đơn-tới-xuất-hàng BO-3 ở bên trong kho. Việc tối ưu tới mức ô kệ thuộc về một hệ WMS và tường minh nằm ngoài phạm vi (EX-3); OMFS sắp theo vị trí lưu trữ thô ghi với từng SKU. |
| **Giả định** | Mỗi SKU mang một vị trí lưu trữ thô ở mỗi trung tâm, do nhân viên kho duy trì. |

### UC-06 — Nhặt và đóng gói có quét xác nhận

| | |
|---|---|
| **Mã và tên UC** | UC-06 — Nhặt và đóng gói có quét xác nhận |
| **Người soạn** | Thành viên 2 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Nhân viên kho | **Actor phụ** | — |
| **Kích hoạt** | Nhân viên kho mở đầu việc kế tiếp từ đợt đã phát, trên một máy cầm tay. |
| **Mô tả** | Nhân viên được dẫn tới từng món một, quét món đó để chứng minh đã lấy đúng, và gán các món đã nhặt vào thùng. Việc quét thay thế phiếu in và chính là thứ xoá bỏ hoàn toàn bước chia phiếu thủ công. |
| **Tiền điều kiện** | PRE-1: Nhân viên đã xác thực trên một máy cầm tay được gán cho trung tâm này. <br> PRE-2: Tồn tại một đợt đang mở có đầu việc chưa xong tại trung tâm này. |
| **Hậu điều kiện** | POST-1: Mọi dòng của lô giao đều được nhặt và xác minh, hoặc lô giao mang một ngoại lệ nhặt thiếu. <br> POST-2: Khi hoàn tất, trạng thái lô giao là Packed và danh sách thùng, khối lượng cùng kích thước của nó được ghi lại. <br> POST-3: Số lượng đã nhặt bị trừ khỏi tồn thực tế và các lượt giữ tồn của chúng được nhả (hàng đã rời đi rồi). |
| **Luồng chính** | **6.0** <br> 1. Hệ thống trình ra đầu việc nhặt kế tiếp: SKU, mô tả, ảnh, số lượng và vị trí lưu trữ. <br> 2. Nhân viên tới vị trí đó và quét mã vạch của món hàng. <br> 3. Hệ thống xác minh mã vạch vừa quét khớp với SKU mong đợi và xác nhận lượt nhặt. <br> 4. Bước 1–3 lặp lại cho tới khi mọi dòng của lô giao đều được nhặt. <br> 5. Nhân viên quét một nhãn thùng để mở một thùng và gán các món đã nhặt vào đó. <br> 6. Nhân viên nhập hoặc quét khối lượng của thùng. <br> 7. Hệ thống đặt trạng thái lô giao là Packed và phát một sự kiện đã-đóng-gói, kích hoạt UC-07. |
| **Luồng thay thế** | **6.1 — Lô giao nhiều thùng.** Ở bước 5, nhân viên mở thêm thùng; hệ thống ghi lại việc gán món-vào-thùng cho từng cái. <br> **6.2 — Vị trí thay thế.** Ở bước 2, món hàng được tìm thấy ở một vị trí khác; nhân viên quét món đó và xác nhận vị trí thay thế, và hệ thống ghi lại một lần đính chính vị trí cho Kiểm soát tồn kho. <br> **6.3 — Bàn giao giữa đợt.** Nhân viên hết ca; các đầu việc chưa xong quay lại hàng chờ của đợt cho một nhân viên khác. |
| **Ngoại lệ** | **6.0.E1 — Quét nhầm món.** Ở bước 3, mã vạch không khớp SKU mong đợi. Hệ thống từ chối lượt nhặt, hiện ra món hàng mong đợi, và không cho đi tiếp. Ba lần lệch liên tiếp sẽ đẩy đầu việc đó lên Quản lý hoàn tất đơn. <br> **6.0.E2 — Nhặt thiếu.** Ở bước 2, số lượng vật lý ít hơn số cần. Nhân viên ghi lại số thực sự tìm thấy; hệ thống tạo một ngoại lệ nhặt thiếu cho UC-10, điều chỉnh tồn thực tế về đúng số đã đếm, và phát một sự kiện tồn-kho-đổi. <br> **6.0.E3 — Hàng bị hỏng.** Nhân viên đánh dấu món hàng là hỏng; hệ thống chuyển số lượng đó sang tồn hỏng (mà BR-07 loại khỏi ATP) và coi dòng đó là nhặt thiếu theo 6.0.E2. <br> **6.0.E4 — Máy cầm tay mất kết nối.** Thiết bị xếp hàng các lượt quét ở máy và phát lại khi nối lại được. Lượt quét luỹ đẳng theo từng đầu việc, nên một lượt quét phát lại không trừ tồn kho hai lần. |
| **Độ ưu tiên** | Cao |
| **Tần suất dùng** | Trung bình 4.500 lô giao/ngày, đỉnh 18.000/ngày; ~2,3 dòng mỗi lô giao, nên trung bình ~10.000 lượt quét/ngày. |
| **Business Rule** | BR-07, BR-13, BR-17 |
| **Thông tin khác** | Màn hình nhặt hàng phải dùng được bằng một tay, khi đeo găng, trên một máy Android cầm tay đời thấp, và phải chịu được Wi-Fi chập chờn (6.0.E4) — đó là những ràng buộc do chính Nhân viên kho nêu ra và chúng chi phối các thuộc tính chất lượng về khả dụng và hoạt động ngoại tuyến ở SRS §6.1. POST-3 là điểm mà tồn kho đang giữ trở thành tồn kho đã giao; làm sai chỗ này là đếm tồn kho hai lần. |
| **Giả định** | Mọi SKU bán được đều mang một mã vạch quét được. SKU không có mã vạch được xử lý bằng cách xác nhận tay, có giám sát viên duyệt. |

### UC-07 — So giá hãng vận chuyển và mua nhãn

| | |
|---|---|
| **Mã và tên UC** | UC-07 — So giá hãng vận chuyển và mua nhãn vận chuyển |
| **Người soạn** | Thành viên 3 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | OMFS (hệ thống, theo sự kiện) | **Actor phụ** | Hãng 3PL, Quản lý logistics |
| **Kích hoạt** | UC-06 phát ra một sự kiện đã-đóng-gói. |
| **Mô tả** | Với một lô giao đã đóng gói, OMFS xác định những hãng nào thật sự giao được nó, so chúng theo chi phí trọn gói và mức dịch vụ, chọn một hãng, và mua nhãn qua API của hãng đó. **Điều này thay thế việc mua nhãn bằng tay trên bốn cổng hãng riêng biệt** và là thứ mang lại mục tiêu chi phí vận chuyển BO-5. |
| **Tiền điều kiện** | PRE-1: Trạng thái lô giao là Packed, có ghi khối lượng và kích thước. <br> PRE-2: Ít nhất một hãng được cấu hình Active với thông tin xác thực API hợp lệ. |
| **Hậu điều kiện** | POST-1: Lô giao mang đúng một nhãn đã mua kèm mã theo dõi, hoặc nó mang một ngoại lệ dán nhãn. <br> POST-2: Các mức giá được báo từ mọi hãng đủ điều kiện đều được lưu gắn với lô giao để đối soát hoá đơn về sau. <br> POST-3: Trạng thái lô giao là Labelled và trạng thái đơn được cập nhật. |
| **Luồng chính** | **7.0** <br> 1. Hệ thống xác định điều kiện của các hãng theo mã bưu chính đích, khối lượng và kích thước (BR-11). <br> 2. Hệ thống xin báo giá từ từng hãng đủ điều kiện, song song. <br> 3. Hệ thống tính chi phí trọn gói cho từng báo giá bằng BR-12. <br> 4. Hệ thống chọn hãng rẻ nhất mà vẫn kịp ngày giao đã hứa của đơn. <br> 5. Hệ thống xin một nhãn từ hãng được chọn và nhận về mã theo dõi cùng tài liệu nhãn. <br> 6. Hệ thống lưu mọi báo giá (POST-2), nhãn đã mua và mã theo dõi. <br> 7. Hệ thống đặt trạng thái lô giao là Labelled và báo cho khách qua UC-09. |
| **Luồng thay thế** | **7.1 — Hãng ưu tiên.** Quản lý logistics đã ghim một hãng cho một vùng đích; hệ thống dùng hãng đó nếu đủ điều kiện, bỏ qua bước 3–4, và ghi lý do PREFERRED. <br> **7.2 — Đơn giao gấp.** Đơn mang mức dịch vụ express; ở bước 4, hệ thống chọn hãng nhanh nhất kịp ngày, không phải hãng rẻ nhất, và ghi lý do SERVICE_LEVEL. <br> **7.3 — In lại.** Một Nhân viên kho báo nhãn bị hỏng; hệ thống in lại đúng nhãn đó mà không mua nhãn mới. |
| **Ngoại lệ** | **7.0.E1 — Không hãng nào đủ điều kiện.** Ở bước 1, không hãng nào phục vụ điểm đến hoặc kiện hàng vượt giới hạn của mọi hãng. Hệ thống phát một ngoại lệ dán nhãn cho UC-10 và để lô giao ở trạng thái Packed. <br> **7.0.E2 — Mọi báo giá đều hỏng.** Ở bước 2, mọi API hãng đều lỗi hoặc hết giờ chờ. Hệ thống thử lại trong tối đa 10 phút, rồi phát một ngoại lệ cho UC-10; lô giao vẫn ở Packed và không bao giờ bị bỏ lại ở trạng thái dán nhãn dở dang. <br> **7.0.E3 — Mua nhãn hỏng sau khi báo giá thành công.** Ở bước 5, hãng được chọn từ chối yêu cầu nhãn. Hệ thống loại hãng đó ra và thử lại từ bước 4 với báo giá tốt kế tiếp, tối đa ba hãng, rồi đi theo 7.0.E2. <br> **7.0.E4 — Nhãn bị trùng.** Yêu cầu nhãn thành công nhưng phản hồi bị mất. Khi thử lại, hệ thống hỏi hãng xem đã có nhãn nào gắn với mã tham chiếu của lô giao chưa, trước khi mua lần nữa, nên một lô giao không bao giờ mang hai nhãn đã trả tiền (POST-1). |
| **Độ ưu tiên** | Trung bình — hoãn sang bản 1.1 |
| **Tần suất dùng** | Một lần cho mỗi lô giao — trung bình ~4.900/ngày (đơn cộng phần tách), đỉnh ~19.500/ngày. |
| **Business Rule** | BR-11, BR-12 |
| **Thông tin khác** | Việc so giá chỉ tốt bằng chất lượng khối lượng và kích thước ghi ở bước 6 của UC-06; khối lượng bị ghi thiếu một cách hệ thống sẽ sinh ra các khoản điều chỉnh hoá đơn từ hãng, xoá sạch khoản tiết kiệm 12% — và đó là lý do POST-2 lưu lại các báo giá để đối soát. Cho tới bản 1.1, nhãn vẫn tiếp tục được mua bằng tay trên cổng của hãng và mã theo dõi được nhập tay. |
| **Giả định** | Cả bốn hãng đều mở API báo giá và mua nhãn. Hãng nào không có thì được xử lý bằng phương án thủ công nằm sau cùng một giao tiếp nội bộ. |

### UC-08 — Nhận một sự kiện theo dõi từ hãng vận chuyển

| | |
|---|---|
| **Mã và tên UC** | UC-08 — Nhận một sự kiện theo dõi từ hãng vận chuyển |
| **Người soạn** | Thành viên 3 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Hãng 3PL (hệ thống) | **Actor phụ** | Dịch vụ Thông báo |
| **Kích hoạt** | Một hãng đẩy một sự kiện webhook cho một lô giao đang theo dõi, hoặc khoảng hỏi định kỳ (15 phút) trôi qua với các hãng không có webhook. |
| **Mô tả** | OMFS nhận các sự kiện quét của hãng — đã lấy hàng, đang vận chuyển, đang giao, đã giao, giao hỏng — và áp chúng vào lô giao cùng đơn hàng một cách tự động. **Điều này thay thế việc tải tệp CSV bằng tay hai lần mỗi ngày** và là thứ làm cho trang tự tra cứu (UC-09) trở nên đáng đưa ra. |
| **Tiền điều kiện** | PRE-1: Lô giao có một mã theo dõi được cấp ở UC-07. <br> PRE-2: Lô giao chưa đạt một trạng thái kết thúc (Delivered, Returned, Lost). |
| **Hậu điều kiện** | POST-1: Sự kiện được lưu gắn với lô giao, kèm dấu thời gian của chính hãng và dấu thời gian OMFS nhận được, để đo được độ trễ (thước đo thành công của BO-4). <br> POST-2: Trạng thái lô giao phản ánh sự kiện mới nhất theo **dấu thời gian của hãng**, không theo thứ tự đến. <br> POST-3: Một sự kiện tới trái thứ tự hoặc bị trùng không bao giờ được đẩy lô giao lùi lại. |
| **Luồng chính** | **8.0** <br> 1. Hệ thống nhận sự kiện và xác thực hãng. <br> 2. Hệ thống phân giải mã theo dõi thành một lô giao. <br> 3. Hệ thống ánh xạ mã trạng thái riêng của hãng sang bộ từ vựng trạng thái của OMFS. <br> 4. Hệ thống so dấu thời gian của sự kiện với sự kiện mới nhất đã lưu. <br> 5. Sự kiện mới hơn; hệ thống lưu nó và cập nhật trạng thái lô giao. <br> 6. Nếu trạng thái mới là loại khách nhìn thấy được, hệ thống xin gửi một thông báo qua Dịch vụ Thông báo. <br> 7. Nếu trạng thái là Delivered, hệ thống đóng lô giao, và khi mọi lô giao của một đơn đều đã giao thì đóng cả đơn. |
| **Luồng thay thế** | **8.1 — Hãng dùng hỏi định kỳ.** Ở bước 1, hệ thống hỏi hãng về mọi lô giao đang mở thay vì nhận đẩy, rồi tiếp tục từ bước 2 cho từng sự kiện trả về. <br> **8.2 — Lấy bù hàng loạt.** Sau một sự cố, hệ thống xin mọi sự kiện kể từ mốc nước gần nhất và xử lý chúng theo thứ tự dấu thời gian của hãng. |
| **Ngoại lệ** | **8.0.E1 — Mã theo dõi lạ.** Ở bước 2, không lô giao nào khớp. Hệ thống lưu sự kiện vào hàng chờ mồ côi trong 30 ngày và phát cảnh báo nếu số lượng mồ côi vượt một ngưỡng — nó không vứt bỏ, vì chuyện này thường nghĩa là một nhãn đã được mua bên ngoài OMFS. <br> **8.0.E2 — Trạng thái hãng chưa ánh xạ.** Ở bước 3, hãng gửi một mã mà OMFS không nhận ra. Hệ thống lưu sự kiện thô, giữ nguyên trạng thái lô giao, và phát một cảnh báo cấu hình. <br> **8.0.E3 — Sự kiện tới trái thứ tự.** Ở bước 4, sự kiện cũ hơn cái mới nhất đã lưu. Hệ thống lưu nó lại để làm vết kiểm toán nhưng không đổi trạng thái lô giao (POST-3). <br> **8.0.E4 — Giao hàng thất bại.** Hãng báo một lần giao hỏng. Hệ thống đặt lô giao thành Delivery-Exception và phát một ngoại lệ cho UC-10. <br> **8.0.E5 — Hãng im lặng.** Không có sự kiện nào cho một lô giao trong 48 giờ sau khi lấy hàng. Một bộ giám sát phát một ngoại lệ lô-giao-đứng-im cho UC-10. |
| **Độ ưu tiên** | Trung bình — hoãn sang bản 1.1 |
| **Tần suất dùng** | ~6 sự kiện mỗi lô giao; trung bình ~29.000 sự kiện/ngày, đỉnh ~117.000/ngày. |
| **Business Rule** | BR-09 |
| **Thông tin khác** | POST-2 quan trọng hơn vẻ ngoài của nó. Các hãng gửi sự kiện về muộn và trái thứ tự; sắp theo thời điểm đến sẽ làm một đơn trông như đi từ Đã giao lùi về Đang vận chuyển, và điều đó sinh ra đúng những cuộc gọi WISMO mà dự án này ra đời để xoá bỏ. Mốc nhận sự kiện p95 15 phút ở SRS §6.2 là thước đo thành công của BO-4. |
| **Giả định** | Ít nhất ba trong bốn hãng hỗ trợ webhook; số còn lại được hỏi định kỳ. |

### UC-09 — Theo dõi một đơn hàng (khách tự phục vụ)

| | |
|---|---|
| **Mã và tên UC** | UC-09 — Theo dõi một đơn hàng (khách tự phục vụ) |
| **Người soạn** | Thành viên 3 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Khách hàng | **Actor phụ** | Dịch vụ Thông báo, Nhân viên CSKH |
| **Kích hoạt** | Khách mở đường liên kết theo dõi được gửi qua email hoặc SMS, hoặc một Nhân viên CSKH mở đúng màn hình đó từ một lượt liên hệ. |
| **Mô tả** | Khách thấy trạng thái hiện tại, chính xác, của đơn hàng và từng lô giao của mình mà không phải liên hệ ai. **Đây là use case mang lại BO-4 — giảm 60% số lượt liên hệ WISMO** — và nó chỉ chạy được vì UC-08 giữ cho trạng thái luôn tươi. |
| **Tiền điều kiện** | PRE-1: Đơn tồn tại và đã được kiểm tính hợp lệ. <br> PRE-2: Yêu cầu mang một token theo dõi hợp lệ, riêng cho đơn đó. |
| **Hậu điều kiện** | POST-1: Không tiết lộ dữ liệu khách hàng nào ngoài đúng một đơn mà token tham chiếu tới. <br> POST-2: Lượt xem được ghi nhật ký, để đo được mức sử dụng tự phục vụ so với mục tiêu WISMO. |
| **Luồng chính** | **9.0** <br> 1. Khách mở đường liên kết theo dõi. <br> 2. Hệ thống kiểm token và phân giải ra đơn hàng. <br> 3. Hệ thống hiển thị tóm tắt đơn, từng lô giao, hãng vận chuyển và mã theo dõi của nó, trạng thái hiện tại và lịch sử sự kiện. <br> 4. Hệ thống hiển thị ngày giao dự kiến của từng lô giao. <br> 5. Khách có thể đi theo đường liên kết theo dõi của chính hãng để xem chi tiết phía hãng. |
| **Luồng thay thế** | **9.1 — Đơn bị tách.** Ở bước 3, đơn có nhiều lô giao; hệ thống hiện từng cái riêng kèm hãng và trạng thái của nó, và giải thích rằng đơn đã bị tách. <br> **9.2 — Màn hình của nhân viên.** Một Nhân viên CSKH mở cùng đơn đó từ bảng điều khiển hỗ trợ và thấy thêm chi tiết ngoại lệ nội bộ vốn không hiện cho khách. <br> **9.3 — Đơn chưa xuất hàng.** Đơn chưa có lô giao nào; hệ thống hiện trạng thái ở mức đơn hàng (Validated, Reserved, Routed, Picking) bằng câu chữ thân thiện với khách, thay vì một trang trắng. |
| **Ngoại lệ** | **9.0.E1 — Token sai hoặc hết hạn.** Ở bước 2, token không qua được phép kiểm. Hệ thống hiện một trang chung "liên kết không hợp lệ" và **không** tiết lộ đơn đó có tồn tại hay không. <br> **9.0.E2 — Đơn đã bị huỷ.** Đơn đã bị huỷ; hệ thống hiện việc huỷ và ngày huỷ, không hiện một lỗi. <br> **9.0.E3 — Trạng thái của hãng đã cũ.** Sự kiện gần nhất của hãng cũ hơn 48 giờ; hệ thống hiện trạng thái biết được gần nhất kèm dấu thời gian và một dòng ghi rõ "chưa có cập nhật từ", thay vì ngụ ý rằng mình đang biết hiện trạng. |
| **Độ ưu tiên** | Trung bình — hoãn sang bản 1.2 |
| **Tần suất dùng** | Giả định 35% số đơn được xem ít nhất một lần, mỗi đơn ~1,8 lượt: trung bình ~2.800 lượt xem/ngày. |
| **Business Rule** | BR-09 |
| **Thông tin khác** | Đây là bề mặt duy nhất của OMFS hướng tới khách và là bề mặt duy nhất phơi ra Internet công cộng, nên mô hình token ở PRE-2/POST-1 là một yêu cầu an ninh, không phải một tiện ích: việc đoán ra token của khách khác phải là bất khả thi (SRS §6.3). Việc không đòi đăng nhập là có chủ đích (EX-8) — đòi đăng nhập sẽ đẩy khách quay lại hàng chờ hỗ trợ. Ngoại lệ 9.0.E3 là sự trung thực có chủ đích: giả vờ như mình biết chính là thứ phá huỷ niềm tin vào một trang theo dõi. |
| **Giả định** | Khách nhận được đường liên kết theo dõi lúc xuất hàng, qua email hoặc SMS thông qua Dịch vụ Thông báo. |

### UC-10 — Xử lý một ngoại lệ hoàn tất đơn

| | |
|---|---|
| **Mã và tên UC** | UC-10 — Xử lý một ngoại lệ hoàn tất đơn |
| **Người soạn** | Thành viên 3 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Quản lý hoàn tất đơn | **Actor phụ** | Kiểm soát tồn kho, Nhân viên CSKH |
| **Kích hoạt** | Bất kỳ use case nào phát ra một ngoại lệ, hoặc Quản lý hoàn tất đơn mở bảng xử lý ngoại lệ. |
| **Mô tả** | Mọi sự cố trong vòng đời hoàn tất đơn — chờ hàng, vượt giới hạn tách, nhặt thiếu, không hãng nào đủ điều kiện, giao hỏng, lô giao đứng im — đều nổi lên trong một hàng chờ duy nhất, kèm các phương án xử lý phù hợp với đúng loại của nó. Thiếu cái này thì ngoại lệ vô hình cho tới khi có khách phàn nàn. |
| **Tiền điều kiện** | PRE-1: Người dùng đã xác thực với vai Quản lý hoàn tất đơn hoặc Kiểm soát tồn kho. <br> PRE-2: Tồn tại ít nhất một ngoại lệ đang mở. |
| **Hậu điều kiện** | POST-1: Mọi ngoại lệ đều kết thúc bằng một cách xử lý được ghi lại kèm người làm, dấu thời gian và lý do — không bao giờ biến mất âm thầm. <br> POST-2: Đơn hàng hoặc lô giao bị ảnh hưởng được để lại ở một trạng thái hợp lệ và nhất quán. |
| **Luồng chính** | **10.0** <br> 1. Người quản lý mở bảng điều khiển; hệ thống liệt kê các ngoại lệ đang mở, sắp theo tuổi và mức rủi ro trễ ngày giao (BR-09). <br> 2. Người quản lý chọn một ngoại lệ; hệ thống hiện đơn hàng, nguyên nhân, và các phương án xử lý hợp lệ với đúng loại ngoại lệ đó. <br> 3. Người quản lý chọn một cách xử lý. <br> 4. Hệ thống áp dụng nó, cập nhật đơn hàng hoặc lô giao. <br> 5. Hệ thống ghi lại cách xử lý, người làm và lý do (POST-1). <br> 6. Hệ thống đóng ngoại lệ và đưa đơn quay lại vòng đời ở đúng use case tương ứng. |
| **Luồng thay thế** | **10.1 — Xử lý chờ hàng.** Các phương án: chờ hàng nhập về, lấy từ một trung tâm khác bằng cách chạy lại UC-04, đổi sang một SKU khác khi khách đồng ý, hoặc huỷ dòng đó qua UC-11. <br> **10.2 — Nhặt thiếu.** Các phương án: nhặt lại ở một vị trí khác, định tuyến lại dòng đó sang trung tâm khác, giao thiếu và hoàn lại phần chênh, hoặc huỷ dòng. <br> **10.3 — Không hãng nào đủ điều kiện.** Các phương án: đóng gói lại thành thùng nhỏ hơn rồi chạy lại UC-07, đặt một đơn vị chuyển phát thủ công bên ngoài OMFS và ghi mã theo dõi vào, hoặc huỷ. <br> **10.4 — Giao hỏng hoặc lô giao đứng im.** Các phương án: xin giao lại, chuyển hướng tới điểm nhận hàng, hoặc mở một khiếu nại với hãng. <br> **10.5 — Xử lý hàng loạt.** Người quản lý chọn nhiều ngoại lệ cùng loại và cùng nguyên nhân rồi áp một cách xử lý cho tất cả. |
| **Ngoại lệ** | **10.0.E1 — Cách xử lý không còn hợp lệ.** Ở bước 4, trạng thái nền đã đổi (hàng đã về, đơn đã bị huỷ rồi). Hệ thống từ chối cách xử lý đó, làm mới ngoại lệ, và mời người quản lý chọn lại. <br> **10.0.E2 — Cách xử lý áp dụng dở dang.** Hệ thống áp các cách xử lý theo kiểu giao dịch; nếu một bước hỏng thì không gì được áp dụng và ngoại lệ vẫn mở (POST-2). <br> **10.0.E3 — Ngoại lệ quá hạn SLA.** Một ngoại lệ mở lâu hơn SLA đã cấu hình sẽ được leo thang lên cấp trên của Quản lý hoàn tất đơn và được đánh dấu trên bảng điều khiển (UC-14). |
| **Độ ưu tiên** | Trung bình — hoãn sang bản 1.2; tới lúc đó, ngoại lệ được xử lý từ một báo cáo |
| **Tần suất dùng** | Giả định ~4% số đơn phát sinh ít nhất một ngoại lệ: trung bình ~180/ngày, đỉnh ~720/ngày. |
| **Business Rule** | BR-05, BR-09, BR-13 |
| **Thông tin khác** | Các phương án xử lý cố ý **riêng theo từng loại** (10.1–10.4): một bảng điều khiển kiểu chung chung "chuyển lại / huỷ / bỏ qua" sẽ đẩy quyết định thật về lại trí nhớ của người quản lý, mà đó đúng là quy trình thủ công dự án này đang thay thế. POST-1 làm cho nhật ký ngoại lệ trở thành nguồn của việc phân tích nguyên nhân gốc, thứ theo thời gian phải làm giảm được lượng ngoại lệ. |
| **Giả định** | Việc đổi sang một SKU khác đòi hỏi sự đồng ý của khách, do Nhân viên CSKH lấy được bên ngoài OMFS. |

### UC-11 — Huỷ hoặc sửa đơn trước khi xuất hàng

| | |
|---|---|
| **Mã và tên UC** | UC-11 — Huỷ hoặc sửa đơn trước khi xuất hàng |
| **Người soạn** | Thành viên 3 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Nhân viên CSKH | **Actor phụ** | Kênh bán, Cổng thanh toán |
| **Kích hoạt** | Khách liên hệ hỗ trợ để huỷ hoặc đổi một đơn, hoặc sàn đẩy về một lệnh huỷ. |
| **Mô tả** | Một đơn có thể bị chặn lại hoặc đổi khi nó còn chặn được. Mốc chốt là thời điểm mua nhãn vận chuyển (BR-05) — sau đó kiện hàng thuộc trách nhiệm của hãng và con đường đúng là trả hàng (UC-12). Việc huỷ bắt buộc phải nhả tồn kho đang giữ, nếu không thì vấn đề bán vượt tồn chỉ đơn giản xuất hiện lại dưới một hình dạng khác. |
| **Tiền điều kiện** | PRE-1: Đơn tồn tại và chưa ở trạng thái Labelled. <br> PRE-2: Nhân viên đã xác thực với vai Nhân viên CSKH. |
| **Hậu điều kiện** | POST-1: Mọi lượt giữ tồn của các dòng bị huỷ đều được nhả và một sự kiện tồn-kho-đổi được phát cho mỗi SKU (kích hoạt UC-13). <br> POST-2: Việc huỷ hoặc sửa được phản ánh ngược về kênh bán đã sinh ra đơn. <br> POST-3: Thay đổi được ghi lại kèm người làm, dấu thời gian và lý do. |
| **Luồng chính** | **11.0** <br> 1. Nhân viên tìm ra đơn và mở nó. <br> 2. Hệ thống hiện đơn, trạng thái hiện tại của nó, và những thao tác nào còn được phép ở trạng thái đó (BR-05). <br> 3. Nhân viên chọn Huỷ cả đơn. <br> 4. Hệ thống hỏi lý do huỷ. <br> 5. Hệ thống nhả mọi lượt giữ tồn của đơn và phát một sự kiện tồn-kho-đổi cho mỗi SKU. <br> 6. Hệ thống huỷ mọi lô giao đang mở và gỡ nó khỏi đợt nhặt hàng của nó. <br> 7. Hệ thống đặt trạng thái đơn là Cancelled và báo cho kênh bán cùng khách hàng. |
| **Luồng thay thế** | **11.1 — Huỷ một dòng.** Ở bước 3, nhân viên huỷ một dòng đơn lẻ; hệ thống chỉ nhả lượt giữ tồn của dòng đó và chạy lại UC-04 cho các dòng còn lại, vì việc định tuyến giờ có thể khác đi. <br> **11.2 — Đổi số lượng.** Nhân viên giảm số lượng của một dòng; hệ thống nhả phần chênh và tiếp tục ở bước 6. Việc tăng số lượng không được hỗ trợ — đó là một đơn mới. <br> **11.3 — Đổi địa chỉ giao.** Nhân viên sửa địa chỉ trước khi dán nhãn; hệ thống kiểm lại nó qua bước 1 của UC-02 và chạy lại UC-04, vì việc định tuyến phụ thuộc vào điểm đến. <br> **11.4 — Kênh chủ động huỷ.** Sàn đẩy về một lệnh huỷ; hệ thống thực thi bước 5–7 mà không cần nhân viên và bỏ qua phần báo cho kênh ở bước 7. |
| **Ngoại lệ** | **11.0.E1 — Đơn đã dán nhãn.** Ở bước 2, đơn đang ở Labelled hoặc sau đó. Hệ thống từ chối lệnh huỷ (BR-05), giải thích vì sao, và mời khởi tạo một lượt trả hàng theo UC-12 thay thế. <br> **11.0.E2 — Sàn cấm sửa đơn.** Ở bước 3, đơn đến từ một kênh mà chính sách của nó cấm sửa sau khi đã nhận (BR-16). Hệ thống cho phép huỷ nhưng từ chối sửa, và nói rõ luật của kênh nào đang áp dụng. <br> **11.0.E3 — Đã bắt đầu nhặt hàng.** Lô giao đang ở Picking. Hệ thống đánh dấu đơn cần chặn ngay, báo cho trung tâm hoàn tất đơn, và giữ lệnh huỷ ở trạng thái Pending-Stop cho tới khi trung tâm xác nhận; chỉ khi đó tồn kho mới được nhả. <br> **11.0.E4 — Báo cho kênh thất bại.** Ở bước 7, API của kênh lỗi. Lệnh huỷ vẫn có hiệu lực trong OMFS và việc báo cho kênh được xếp hàng chờ thử lại; đơn không bao giờ bị bỏ lại ở trạng thái đã huỷ trong hệ này mà vẫn mở ở hệ kia mà không có cảnh báo. |
| **Độ ưu tiên** | Trung bình |
| **Tần suất dùng** | Giả định 2,5% số đơn: trung bình ~110/ngày, đỉnh ~450/ngày. |
| **Business Rule** | BR-05, BR-16 |
| **Thông tin khác** | 11.0.E3 là trường hợp thật sự khó và là chủ đề của buổi khai thác thứ 4: giữa lúc phát đợt nhặt hàng và lúc mua nhãn, thế giới vật lý đang đi trước hệ thống. Câu trả lời được chọn — một lệnh dừng hai pha, do trung tâm hoàn tất đơn xác nhận — được Quản lý hoàn tất đơn ưa hơn so với một lệnh huỷ lạc quan có nguy cơ giao đi một đơn đã huỷ. |
| **Giả định** | Việc hoàn tiền do bộ phận tài chính thực hiện trên cổng thanh toán; OMFS ghi nhận rằng có một khoản hoàn tiền phải trả nhưng không chuyển tiền (EX-5). |

### UC-12 — Xử lý trả hàng và nhập lại kho

| | |
|---|---|
| **Mã và tên UC** | UC-12 — Xử lý trả hàng và nhập lại kho (RMA) |
| **Người soạn** | Thành viên 3 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Nhân viên CSKH | **Actor phụ** | Nhân viên kho, Hãng 3PL |
| **Kích hoạt** | Khách xin trả hàng, hoặc một hãng trả về một kiện hàng không giao được cho trung tâm hoàn tất đơn. |
| **Mô tả** | Một lượt trả hàng được cho phép, hàng quay về, được kiểm tra, và tồn kho hoặc được đưa lại lên kệ hoặc bị đưa vào khu cách ly. Việc nhập lại kho quan trọng với dự án này vì những đơn vị hàng trả về mà không bao giờ quay lại ATP chính là tồn kho vô hình — và điều đó đẩy tỉ lệ bán vượt tồn đi sai hướng. |
| **Tiền điều kiện** | PRE-1: Đơn chứa ít nhất một dòng đã giao. <br> PRE-2: Việc trả hàng được xin trong cửa sổ trả hàng (BR-14). |
| **Hậu điều kiện** | POST-1: Mọi đơn vị hàng trả về đều kết thúc ở đúng một trong ba trạng thái: nhập lại kho bán được, đưa vào khu cách ly, hoặc ghi giảm. <br> POST-2: Các đơn vị nhập lại kho xuất hiện trong ATP và một sự kiện tồn-kho-đổi được phát (kích hoạt UC-13). <br> POST-3: Kết quả trả hàng được ghi lại gắn với dòng đơn hàng gốc. |
| **Luồng chính** | **12.0** <br> 1. Nhân viên mở đơn đã giao và chọn các dòng cần trả. <br> 2. Hệ thống kiểm cửa sổ trả hàng (BR-14) và tạo một RMA kèm số cho phép trả hàng. <br> 3. Hệ thống phát ra hướng dẫn trả hàng và, ở nơi hãng hỗ trợ, một nhãn trả hàng. <br> 4. Khách gửi hàng về; hãng giao hàng tới trung tâm hoàn tất đơn. <br> 5. Một Nhân viên kho quét số RMA và các món hàng trả về. <br> 6. Nhân viên kiểm từng món và ghi lại kết quả: còn bán được, hỏng, hoặc thiếu. <br> 7. Với món còn bán được, hệ thống tăng tồn thực tế và phát một sự kiện tồn-kho-đổi (BR-15). Với món hỏng, nó chuyển số lượng đó vào khu cách ly. <br> 8. Hệ thống đóng RMA và ghi nhận rằng có một khoản hoàn tiền phải trả. |
| **Luồng thay thế** | **12.1 — Kiện hàng bị hãng trả về vì không giao được.** Kiện hàng quay về mà không có yêu cầu của khách; hệ thống tự tạo RMA ở bước 5 khi nhân viên quét nhãn lô giao gốc, rồi tiếp tục từ bước 6. <br> **12.2 — Trả một phần.** Khách trả ít món hơn số đã được cho phép; hệ thống ghi lại phần chênh và chỉ đóng RMA cho số lượng thực nhận. <br> **12.3 — Đổi hàng.** Nhân viên tạo một đơn thay thế liên kết với RMA; đơn thay thế đi theo vòng đời bình thường từ UC-02. |
| **Ngoại lệ** | **12.0.E1 — Hết cửa sổ trả hàng.** Ở bước 2, ngày giao nằm ngoài cửa sổ (BR-14). Hệ thống từ chối tạo RMA và hiện ngày giao cùng cửa sổ; một giám sát viên có thể ghi đè kèm lý do được ghi lại. <br> **12.0.E2 — Hàng không bao giờ về.** RMA mở lâu hơn 30 ngày kể từ lúc cho phép. Hệ thống đóng nó với trạng thái Not-Received và không phát sinh khoản hoàn tiền nào. <br> **12.0.E3 — Hàng trả về không nhận dạng được.** Ở bước 5, kiện hàng không mang RMA hay mã lô giao nào đọc được. Nhân viên ghi nó vào hàng chờ hàng-trả-không-rõ cho Nhân viên CSKH thay vì đoán ra một đơn nào đó. <br> **12.0.E4 — Lệch số lượng.** Số lượng nhận về vượt số lượng đã cho phép. Hệ thống nhận đúng số đã cho phép và phát một ngoại lệ cho UC-10 với phần dư. |
| **Độ ưu tiên** | Thấp — hoãn sang bản 2.0 |
| **Tần suất dùng** | Giả định 6% số đơn đã giao: trung bình ~270 RMA/ngày. |
| **Business Rule** | BR-14, BR-15 |
| **Thông tin khác** | Việc kiểm hàng (bước 6) là một phán đoán của con người mà OMFS ghi lại chứ không tự đưa ra. Luật duy nhất hệ thống cưỡng chế là BR-15: một món hàng hỏng không được âm thầm quay lại tồn kho bán được. Việc thực hiện hoàn tiền nằm ngoài phạm vi (EX-5); OMFS ghi nhận nghĩa vụ đó và bộ phận tài chính hành động theo. |
| **Giả định** | Mỗi trung tâm hoàn tất đơn có một khu nhận hàng trả về và một vị trí cách ly được chỉ định. |

### UC-13 — Đồng bộ số tồn kho ra các kênh bán

| | |
|---|---|
| **Mã và tên UC** | UC-13 — Đồng bộ số tồn kho ra các kênh bán |
| **Người soạn** | Thành viên 2 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | OMFS (hệ thống, theo sự kiện) | **Actor phụ** | Kênh bán |
| **Kích hoạt** | UC-03, UC-06, UC-11 hoặc UC-12 phát ra một sự kiện tồn-kho-đổi, hoặc bộ hẹn giờ đối soát nổ (mỗi giờ). |
| **Mô tả** | Mỗi khi số lượng bán được của một SKU thay đổi vì bất kỳ lý do gì, OMFS đẩy con số mới tới mọi kênh có bán nó. Đi cùng với việc giữ tồn ở UC-03, đây là thứ khép lại lỗ hổng bán vượt tồn: giữ tồn chặn được lần bán thứ hai, còn đồng bộ chặn được việc kênh bán vẫn chào bán số hàng không còn tồn tại. |
| **Tiền điều kiện** | PRE-1: SKU được ánh xạ tới ít nhất một kênh bán đang Active. <br> PRE-2: Thông tin xác thực API của kênh còn hợp lệ. |
| **Hậu điều kiện** | POST-1: Mọi kênh Active có bán SKU đó đều đã được gửi số lượng bán được hiện tại, hoặc một lần đồng bộ thất bại được ghi lại cho đúng kênh và SKU đó. <br> POST-2: Số lượng đã gửi và dấu thời gian gửi được ghi lại theo từng kênh và từng SKU, để phát hiện được độ trôi. |
| **Luồng chính** | **13.0** <br> 1. Hệ thống nhận một sự kiện tồn-kho-đổi cho một SKU. <br> 2. Hệ thống tính số lượng bán được để công bố: tổng ATP trên mọi trung tâm đang Open (BR-07), trừ đi phần đệm riêng theo kênh nếu có. <br> 3. Hệ thống xác định những kênh Active nào bán SKU đó. <br> 4. Hệ thống gom các lượt cập nhật theo từng kênh để nằm trong hạn mức gọi của kênh. <br> 5. Hệ thống gửi lượt cập nhật và lưu số lượng đã gửi cùng dấu thời gian (POST-2). |
| **Luồng thay thế** | **13.1 — Đối soát hằng giờ.** Bộ hẹn giờ nổ; hệ thống đọc số lượng mà từng kênh hiện đang tin là mình có, so với OMFS, và đẩy lại mọi SKU nào lệch. Việc này bắt được các lượt cập nhật bị rơi âm thầm. <br> **13.2 — Gộp các lượt cập nhật.** Nhiều sự kiện tồn-kho-đổi tới cho cùng một SKU trong cửa sổ gom; hệ thống chỉ gửi số lượng mới nhất, không gửi mỗi sự kiện một lượt. <br> **13.3 — Kích hoạt kênh.** Một kênh vừa được kích hoạt; hệ thống đẩy đầy đủ mọi SKU đã ánh xạ. |
| **Ngoại lệ** | **13.0.E1 — Kênh từ chối lượt cập nhật.** Kênh trả về lỗi cho một SKU. Hệ thống ghi lại lần hỏng, thử lại theo lùi bậc, và sau ba lần hỏng thì phát một cảnh báo tích hợp có nêu tên SKU và kênh. <br> **13.0.E2 — Chạm hạn mức gọi.** Ở bước 4, kênh báo hiệu đang bóp băng thông. Hệ thống xếp hàng các lượt cập nhật còn lại và tiếp tục sau khoảng thời gian thử lại mà kênh nêu ra; không lượt cập nhật nào bị bỏ. <br> **13.0.E3 — Không liên lạc được với kênh.** API của kênh chết. Hệ thống xếp hàng các lượt cập nhật và, khi sự cố vượt 15 phút, phát một cảnh báo, vì tồn kho cũ trên kênh chính là nguyên nhân trực tiếp của việc bán vượt tồn. <br> **13.0.E4 — Số lượng tính ra bị âm.** Ở bước 2, phép tính cho ra một số âm, và điều đó cho thấy có lỗi dữ liệu. Hệ thống công bố số không, phát một cảnh báo chất lượng dữ liệu cho Kiểm soát tồn kho, và không công bố giá trị âm. |
| **Độ ưu tiên** | Cao |
| **Tần suất dùng** | Trung bình ~25.000 sự kiện tồn-kho-đổi/ngày, gộp lại thành ~9.000 lượt cập nhật kênh/ngày; ~4 lần con số đó vào ngày đỉnh. |
| **Business Rule** | BR-07, BR-17, BR-20 |
| **Thông tin khác** | Mốc công bố 60 giây ở BR-20 là yêu cầu độ trễ chặt nhất của cả hệ thống và là lý do UC-13 chạy theo sự kiện chứ không theo lịch. Phần đối soát hằng giờ ở 13.1 tồn tại vì nhóm không thể giả định rằng mọi lượt đẩy đều thành công — quy trình hiện tại hỏng một cách âm thầm và không ai để ý cho tới khi xảy ra một lần bán vượt tồn. |
| **Giả định** | Mọi kênh đều mở cả một endpoint cập nhật tồn kho lẫn một endpoint đọc tồn kho; không có endpoint đọc thì 13.1 thoái hoá thành một lượt đẩy lại mù. |

### UC-14 — Xem bảng điều khiển hiệu suất hoàn tất đơn

| | |
|---|---|
| **Mã và tên UC** | UC-14 — Xem bảng điều khiển hiệu suất hoàn tất đơn |
| **Người soạn** | Thành viên 2 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Quản lý hoàn tất đơn | **Actor phụ** | Quản lý nhãn hàng, Quản lý logistics |
| **Kích hoạt** | Người dùng mở bảng điều khiển, hoặc bản tóm tắt hằng ngày theo lịch được sinh ra. |
| **Mô tả** | Một màn hình duy nhất cho thấy khâu hoàn tất đơn có đạt mục tiêu hay không: thông lượng, thời gian từ nhận đơn tới xuất hàng, tỉ lệ bán vượt tồn, lượng ngoại lệ và chi phí vận chuyển mỗi đơn. Mục đích của nó là làm cho sáu mục tiêu nghiệp vụ trong tài liệu Vision & Scope nhìn thấy được liên tục thay vì phải dựng lại vào cuối quý. |
| **Tiền điều kiện** | PRE-1: Người dùng đã xác thực với một vai có quyền truy cập bảng điều khiển. <br> PRE-2: Có ít nhất một ngày dữ liệu vận hành. |
| **Hậu điều kiện** | POST-1: Người dùng chỉ thấy những trung tâm, kênh bán và nhãn hàng mà vai của họ cho phép. <br> POST-2: Mọi con số đều hiển thị giai đoạn nó phủ và thời điểm nó được làm mới lần cuối. |
| **Luồng chính** | **14.0** <br> 1. Người dùng mở bảng điều khiển. <br> 2. Hệ thống áp phạm vi dữ liệu của người dùng (POST-1). <br> 3. Hệ thống hiển thị các chỉ số đầu bảng so với mục tiêu của chúng: số đơn đã giao, thời gian từ nhận đơn tới xuất hàng, tỉ lệ bán vượt tồn, tỉ lệ định tuyến tự động, số ngoại lệ đang mở và chi phí vận chuyển mỗi đơn. <br> 4. Hệ thống hiển thị xu hướng của từng chỉ số trong giai đoạn được chọn. <br> 5. Người dùng đổi bộ lọc theo giai đoạn, trung tâm, kênh bán hoặc nhãn hàng. <br> 6. Hệ thống tính lại và hiển thị lại. |
| **Luồng thay thế** | **14.1 — Đào sâu.** Người dùng bấm vào một chỉ số; hệ thống liệt kê các đơn hàng hoặc ngoại lệ nằm dưới nó. <br> **14.2 — Xuất dữ liệu.** Người dùng xuất màn hình hiện tại ra CSV để phân tích ngoại tuyến. <br> **14.3 — Tóm tắt theo lịch.** Hệ thống gửi email một bản tóm tắt hằng ngày tới các quản lý đã đăng ký, lúc 07:00 giờ địa phương. <br> **14.4 — Màn hình chi phí theo hãng.** Quản lý logistics mở phần bóc tách chi phí theo từng hãng, so mức giá đã báo (UC-07 POST-2) với số tiền trên hoá đơn. |
| **Ngoại lệ** | **14.0.E1 — Không đủ dữ liệu.** Giai đoạn được chọn không có dữ liệu nào. Hệ thống hiện một trạng thái tường minh "không có dữ liệu cho giai đoạn này" thay vì hiện số không, vì số không sẽ bị đọc thành một kết quả thảm hoạ. <br> **14.0.E2 — Phép tính chỉ số quá hạn thời gian.** Hệ thống hiển thị các chỉ số đã tính xong và đánh dấu phần còn lại là không khả dụng kèm nút thử lại, thay vì làm hỏng cả trang. <br> **14.0.E3 — Số liệu tổng hợp đã cũ.** Tác vụ tổng hợp chưa chạy gần đây. Hệ thống hiện dấu thời gian làm mới lần cuối thật nổi bật (POST-2) và cảnh báo rằng các con số đã cũ. |
| **Độ ưu tiên** | Thấp — hoãn sang bản 2.0 |
| **Tần suất dùng** | ~15 người dùng, mỗi người ~4 lượt xem/ngày: ~60 lượt xem/ngày. Bản tóm tắt hằng ngày: 1/ngày. |
| **Business Rule** | BR-06, BR-09, BR-18 |
| **Thông tin khác** | Định nghĩa các chỉ số phải **giống hệt** các thước đo thành công ở Vision & Scope §1.4 — nếu bảng điều khiển tính tỉ lệ bán vượt tồn khác với tiêu chí thành công của dự án thì dự án không chứng minh được là mình đã thành công. Bố cục báo cáo được đặc tả ở SRS §4.3. |
| **Giả định** | Việc tổng hợp gần-thời-gian-thực là chấp nhận được; các con số có thể trễ so với dữ liệu sống tới 15 phút. |

---

## 4. Use Case Diagram

Xem `diagrams/use-case-diagram.drawio` (sửa được) và `diagrams/use-case-diagram.png` (dùng cho SRS Phụ lục B).

**Cách đọc sơ đồ**

- Actor chính nằm bên **trái**, actor phụ (hệ thống) nằm bên **phải**.
- Hình chữ nhật là **ranh giới hệ thống** — mọi thứ bên trong nó thuộc trách nhiệm của OMFS; storefront trên web, cổng thanh toán và ERP nằm ngoài một cách có chủ đích (xem Vision & Scope §2.4 Giới hạn và loại trừ).
- Mũi tên `«include»` đi **từ** use case cơ sở **tới** use case luôn luôn được thực thi.
- Mũi tên `«extend»` đi **từ** use case tuỳ chọn **tới** use case cơ sở mà nó mở rộng.

**Các quan hệ được thể hiện**

| Quan hệ | Từ | Tới | Vì sao |
|---|---|---|---|
| «include» | UC-01 Nhận một đơn | UC-02 Sàng lọc và kiểm tính hợp lệ | Mọi đơn nhận vào đều được sàng lọc trước khi nó chiếm được tồn kho |
| «include» | UC-02 Sàng lọc và kiểm tính hợp lệ | UC-03 Giữ tồn kho | Mọi đơn đã kiểm đều giữ tồn |
| «include» | UC-03 Giữ tồn kho | UC-04 Định tuyến và tách đơn | Mọi đơn đã giữ tồn đều được định tuyến |
| «include» | UC-06 Nhặt và đóng gói | UC-07 So giá và mua nhãn | Mọi lô giao đã đóng gói đều được dán nhãn |
| «include» | UC-03 Giữ tồn kho | UC-13 Đồng bộ tồn kho | Mọi lượt giữ tồn đều làm đổi số hàng bán được, luôn luôn |
| «include» | UC-06 Nhặt và đóng gói | UC-13 Đồng bộ tồn kho | Việc nhặt hàng trừ tồn thực tế, luôn luôn |
| «include» | UC-11 Huỷ hoặc sửa đơn | UC-13 Đồng bộ tồn kho | Việc huỷ nhả tồn kho ra, luôn luôn |
| «include» | UC-07 So giá và mua nhãn | UC-09 Theo dõi một đơn hàng | Việc dán nhãn luôn phát ra đường liên kết theo dõi cho khách |
| «extend» | UC-10 Xử lý ngoại lệ | UC-03 Giữ tồn kho | Chỉ khi việc giữ tồn thất bại |
| «extend» | UC-10 Xử lý ngoại lệ | UC-04 Định tuyến và tách đơn | Chỉ khi việc định tuyến thất bại |
| «extend» | UC-10 Xử lý ngoại lệ | UC-07 So giá và mua nhãn | Chỉ khi không hãng nào đủ điều kiện |
| «extend» | UC-12 Xử lý trả hàng | UC-08 Nhận sự kiện theo dõi | Chỉ khi hãng trả về một kiện hàng không giao được |
