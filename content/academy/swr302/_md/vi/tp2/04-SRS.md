# Đặc tả Yêu cầu Phần mềm (SRS)
## cho Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)

Phiên bản 1.0 đã duyệt
Người soạn: **<Tên nhóm trưởng>**, Nhóm Phân tích nghiệp vụ — Nhóm <N>
Nova Retail Group (NRG)
17 tháng 9 năm 2026

---

### Lịch sử sửa đổi

| Người | Ngày | Lý do sửa | Phiên bản |
|---|---|---|---|
| Nhóm BA, Nhóm <N> | 17-09-2026 | Bản nháp đầu — mục 1–2 lấy từ Vision & Scope, mục 3 lấy từ use case | 0.9 |
| Nhóm BA, Nhóm <N> | 17-09-2026 | Đã định lượng các thuộc tính chất lượng, hoàn tất mọi mục, chốt bản cơ sở | 1.0 |

---

## Mục lục

1. Giới thiệu · 2. Mô tả tổng thể · 3. Tính năng hệ thống · 4. Yêu cầu dữ liệu ·
5. Yêu cầu giao tiếp ngoài · 6. Thuộc tính chất lượng ·
7. Yêu cầu quốc tế hoá và bản địa hoá · 8. Yêu cầu khác ·
Phụ lục A: Bảng thuật ngữ · Phụ lục B: Mô hình phân tích · Phụ lục C: Danh sách TBD ·
Phụ lục D: Ma trận truy vết yêu cầu

---

# 1. Giới thiệu

## 1.1 Mục đích

Tài liệu này đặc tả các yêu cầu phần mềm cho các bản phát hành **1.0 tới 2.0** của **Hệ
thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)**, một nền tảng tập trung quản lý việc hoàn
tất các đơn đổ về Nova Retail Group (NRG) từ bốn kênh bán, qua ba trung tâm hoàn tất đơn
và bốn hãng logistics bên thứ ba.

Nó được viết cho bốn nhóm người đọc:

| Người đọc | Dùng tài liệu này để |
|---|---|
| Nhóm phát triển | Hiểu phải xây cái gì và "xong" nghĩa là gì với từng năng lực |
| Nhóm kiểm thử | Suy ra các ca kiểm thử; mọi yêu cầu chức năng đều được viết sao cho kiểm được đạt/không đạt |
| Quản lý dự án | Khoanh phạm vi các bản phát hành và ước lượng công sức |
| Bên liên quan phía nghiệp vụ | Xác nhận rằng thứ sắp được xây đúng là thứ họ đã yêu cầu |

Phạm vi của SRS này là **toàn bộ sản phẩm xuyên các bản 1.0–2.0**; mỗi yêu cầu chức năng
đều ghi rõ nó được giao ở bản nào.

## 1.2 Quy ước của tài liệu

**Mã yêu cầu.** Mọi yêu cầu chức năng có dạng `<Tính năng>-<n>`, trong đó `<Tính năng>`
là tên ngắn của tính năng hệ thống mà nó thuộc về (ví dụ `Reserve-2`, `Route-4`,
`Label-1`). Mã là vĩnh viễn: số của một yêu cầu đã bị xoá không bao giờ được dùng lại.
Yêu cầu thuộc tính chất lượng dùng mã `QA-<n>`.

**Từ "shall" (phải).** Mọi yêu cầu chức năng đều dùng **phải** để diễn đạt một nghĩa vụ.
Các câu dùng "should", "may" hay "will" là văn giải thích, không phải yêu cầu, và không
có gì được kiểm thử theo chúng.

**Độ ưu tiên.** Mỗi tính năng hệ thống mang mức Cao, Trung bình hoặc Thấp, lấy từ bảng
tính xếp ưu tiên yêu cầu (deliverable 7). Độ ưu tiên là động và có thể đổi; bảng tính,
chứ không phải tài liệu này, là bản gốc.

**Tham chiếu tới các tài liệu khác.** Business rule chỉ xuất hiện dưới dạng `BR-n` —
nội dung luật nằm trong tài liệu Business Rules và không bao giờ bị chép lại ở đây. Use
case xuất hiện dưới dạng `UC-nn`. Các phần tử dữ liệu được tham chiếu trong yêu cầu đều
được định nghĩa trong Data Dictionary.

**Thuộc tính chất lượng** được viết bằng Planguage (Gilb) với SCALE, METER, MUST và PLAN,
để mọi thuộc tính đều đo được.

## 1.3 Phạm vi dự án

OMFS là bản ghi có thẩm quyền về một đơn hàng, từ lúc nó được lấy về từ một kênh bán cho
tới lúc nó được giao, bị huỷ hoặc được trả lại. Nó duy trì một bức tranh tồn kho thời
gian thực duy nhất trên mọi trung tâm hoàn tất đơn, định tuyến và tách từng đơn một cách
tự động, điều khiển việc nhặt hàng có quét xác nhận, mua nhãn vận chuyển bằng cách so giá
các hãng, giữ cho trạng thái đơn luôn cập nhật từ sự kiện của hãng, và cho khách tự tra
cứu được trạng thái đó.

OMFS **không** thay thế storefront trên web, cổng thanh toán, hệ ERP/kế toán hay một hệ
quản lý kho. Phát biểu đầy đủ về phạm vi, nội dung từng bản phát hành và các loại trừ nằm
trong **tài liệu Vision and Scope**, mục 2.1–2.4, và đó là tài liệu có thẩm quyền, không
bị chép lại ở đây.

Các mục tiêu nghiệp vụ mà OMFS sinh ra để đạt được là BO-1 … BO-6 ở Vision and Scope
§1.3. Mọi tính năng hệ thống ở mục 3 đều truy vết được về ít nhất một trong số đó.

## 1.4 Tài liệu tham chiếu

| # | Tài liệu | Phiên bản | Vị trí |
|---|---|---|---|
| R1 | Vision and Scope Document for OMFS | 1.0 | `deliverables/01-Vision-and-Scope.md` |
| R2 | Use Cases for OMFS | 1.0 | `deliverables/02-Use-Cases.md` |
| R3 | Business Rules for OMFS | 1.0 | `deliverables/03-Business-Rules.md` |
| R4 | Data Dictionary for OMFS | 1.0 | `deliverables/05-Data-Dictionary.md` |
| R5 | Mock-ups for Complex Use Cases | 1.0 | `deliverables/06-Mockups.md` |
| R6 | Requirement Prioritization Worksheet | 1.0 | `deliverables/07-Requirements-Prioritization.xlsx` |
| R7 | Requirement Estimation | 1.0 | `deliverables/08-Requirements-Estimation.xlsx` |
| R8 | Wiegers, K. & Beatty, J., *Software Requirements*, tái bản lần 3 | 2013 | Microsoft Press |
| R9 | Ghi chép các buổi khai thác yêu cầu 1–4 | — | Thư mục chung của nhóm, `elicitation/` |
| R10 | Thoả thuận người bán của NRG với các sàn (Shopee, Lazada, TikTok Shop) | hiện hành | Quản lý nhãn hàng |

**Ghi chú về phương pháp khai thác yêu cầu.** Đầu vào từ bên liên quan được lấy qua bốn
buổi mô phỏng bên liên quan (R9), trong đó thành viên nhóm đóng các vai có tên và chỉ trả
lời những gì vai đó hợp lý là biết. Chỗ nào không có câu trả lời từ bên liên quan thì mục
đó được ghi vào danh sách TBD (Phụ lục C) chứ không bịa ra.

---

# 2. Mô tả tổng thể

## 2.1 Góc nhìn sản phẩm

OMFS là một **hệ thống mới thay thế một quy trình thủ công**, không phải một phiên bản
mới của một sản phẩm đang có. Quy trình mà nó thay thế — một bảng tính tồn kho dùng
chung, phiếu nhặt hàng in ra và bốn cổng web của hãng vận chuyển — vẫn còn nguyên cho tới
khi từng trung tâm được chuyển đổi, và vẫn chạy được như một đường lùi trong hai tuần sau
mỗi lần chuyển đổi (R1 §3.3).

OMFS nằm **phía sau** storefront hướng tới khách và **phía trước** nhà kho vật lý cùng
các hãng vận chuyển. Context diagram nằm ở Phụ lục B.

**Các hệ thống mà OMFS trao đổi dữ liệu**

| Hệ thống ngoài | Chiều | Cái gì đi qua ranh giới |
|---|---|---|
| Storefront trên web | Vào / ra | Đơn hàng đi vào; số lượng bán được đi ra |
| Các kênh sàn TMĐT (3) | Vào / ra | Đơn hàng đi vào; số lượng bán được đi ra; lệnh huỷ đi cả hai chiều |
| Cổng thanh toán | Vào | Trạng thái uỷ quyền thanh toán (chỉ đọc) |
| API các hãng 3PL (4) | Ra / vào | Yêu cầu báo giá và lệnh mua nhãn đi ra; sự kiện theo dõi đi vào |
| ERP / kế toán | Ra | Lượt ghi sổ hằng ngày về tài chính của các đơn đã giao |
| Dịch vụ thông báo | Ra | Email và SMS tới khách hàng |

## 2.2 Các lớp người dùng và đặc điểm

| Lớp người dùng | Quy mô | Tần suất dùng | Trình độ kỹ thuật | Được ưu tiên |
|---|---|---|---|---|
| **Nhân viên kho** | ~60 | Liên tục trong suốt ca | Thấp — được đào tạo tại chỗ, có thể không dùng máy tính ngoài công việc | **Có** |
| **Quản lý hoàn tất đơn** | 6 | Nhiều lần mỗi ngày | Trung bình | **Có** |
| **Kiểm soát tồn kho** | 3 | Vài lần mỗi ngày | Trung bình — thạo bảng tính | **Có** |
| **Nhân viên CSKH** | ~25 | Liên tục trong suốt ca | Trung bình | Không |
| **Quản lý logistics** | 2 | Hằng ngày | Trung bình | Không |
| **Quản lý nhãn hàng** | 5 | Hằng tuần | Thấp | Không |
| **Quản trị hệ thống** | 2 | Thi thoảng | Cao | Không |
| **Khách hàng** | ~90.000/tháng | Một tới hai lần cho mỗi đơn | Không rõ — giả định là không có | Không |

**Các lớp người dùng được ưu tiên.** Nhân viên kho, Quản lý hoàn tất đơn và Kiểm soát tồn
kho được ưu tiên: chỗ nào nhu cầu của họ xung đột với một lớp khác thì nhu cầu của họ
thắng. Đây là quyết định có chủ đích của COO, vì ba lớp này chính là những người mà dự án
sinh ra để xoá bỏ công sức thủ công của họ.

**Hệ quả với thiết kế.** Việc Nhân viên kho vừa được ưu tiên *vừa* là lớp ít kỹ thuật
nhất là ràng buộc đơn lẻ mạnh nhất với sản phẩm này. Đó là lý do QA-1 và QA-2 tồn tại và
là lý do luồng nhặt hàng chạy theo quét mã chứ không theo biểu mẫu.

## 2.3 Môi trường vận hành

| # | Yêu cầu |
|---|---|
| OE-1 | OMFS phải chạy trên hạ tầng đám mây sẵn có của NRG; không cần trung tâm dữ liệu mới. |
| OE-2 | Giao diện cho quản lý và nhân viên CSKH phải chạy trên các phiên bản hiện hành của Chrome, Edge và Safari trên máy để bàn, ở bề rộng khung nhìn tối thiểu 1280 px. |
| OE-3 | Giao diện nhặt và đóng gói phải chạy trên Android 10 trở lên, trên các máy quét cầm tay đời thấp hiện có (RAM 2 GB, màn hình 5 inch). |
| OE-4 | Trang theo dõi đơn của khách phải chạy trên các trình duyệt di động và máy để bàn hiện hành, ở bề rộng khung nhìn tối thiểu 360 px. |
| OE-5 | OMFS phải vận hành với dữ liệu lưu trong vùng Việt Nam và phải trình bày mọi thời điểm theo múi Asia/Ho_Chi_Minh (UTC+07), đồng thời lưu chúng kèm độ lệch tường minh. |

## 2.4 Ràng buộc thiết kế và hiện thực

| # | Ràng buộc | Nguồn gốc |
|---|---|---|
| CO-1 | OMFS phải dùng nhà cung cấp định danh sẵn có của tập đoàn để xác thực nhân viên; nó không được duy trì kho mật khẩu nhân viên của riêng mình. | Chính sách an ninh của tập đoàn |
| CO-2 | Khoá API của bên thứ ba phải được giữ dưới dạng cấu hình lúc chạy ở phía máy chủ và không bao giờ được gửi tới trình duyệt. | Chính sách an ninh của tập đoàn |
| CO-3 | Giao diện máy cầm tay phải hoạt động được ít nhất 15 phút khi không có mạng và phải đối soát các lượt quét đã xếp hàng khi nối lại được. | Độ phủ Wi-Fi trong kho (phụ thuộc D3 của R1) |
| CO-4 | Mọi luật được đánh dấu Động ở R3 §2.2 phải đổi được qua cấu hình, do đúng vai nghiệp vụ đã nêu tên, mà không cần ra bản phần mềm mới. | Business Rules §2.2 |
| CO-5 | OMFS không được lưu dữ liệu thẻ thanh toán đầy đủ ở bất kỳ thời điểm nào. | Thu hẹp phạm vi PCI |
| CO-6 | Các tích hợp kênh bán và hãng vận chuyển phải được cô lập sau một giao tiếp nội bộ, sao cho thêm một kênh hay một hãng không đòi phải sửa logic đơn hàng, tồn kho hay định tuyến. | RI-1, RI-4 |

## 2.5 Giả định và phụ thuộc

**Giả định** (lấy từ R1 §1.7, nhắc lại ở đây vì các yêu cầu phụ thuộc vào chúng)

- A1: Cả bốn sàn đều mở API lấy đơn và API cập nhật tồn kho.
- A2: NRG vận hành đúng ba trung tâm hoàn tất đơn xuyên suốt bản 1.0 và 1.1.
- A3: Số kiểm kê tồn kho vật lý lúc chuyển đổi chính xác trong phạm vi sai số 2%.
- A4: Storefront trên web vẫn là nơi khách thanh toán.
- A5: Máy quét mã vạch cầm tay có sẵn ở cả ba trung tâm hoàn tất đơn.
- A6: Mọi SKU bán được đều mang một mã vạch quét được.
- A7: Ít nhất ba trong bốn hãng hỗ trợ gửi sự kiện theo dõi qua webhook.

**Phụ thuộc**

- D1: Thông tin xác thực API của hãng và quyền truy cập môi trường thử, do Quản lý logistics lấy về.
- D2: Hệ ERP nhận được một lượt ghi sổ tài chính hằng ngày theo định dạng đã thống nhất.
- D3: Độ phủ Wi-Fi trong kho đủ để dùng máy cầm tay.
- D4: Một người quản lý dữ liệu gốc dành được 8 giờ mỗi tuần trong giai đoạn yêu cầu và chuyển đổi dữ liệu.

> **Nếu A3 sai thì SRS này sai.** Mọi yêu cầu về tồn kho ở §3.3 đều tính từ số tồn thực
> tế được chuyển ra khỏi bảng tính cũ. Vì thế việc làm sạch dữ liệu là điều kiện tiên
> quyết của việc phát hành, không phải một hoạt động chạy song song (rủi ro RI-2).

---

# 3. Tính năng hệ thống

Mỗi tính năng dưới đây hiện thực một tính năng chính ở R1 §2.1 và một hoặc nhiều use case
ở R2. Độ ưu tiên lấy từ bảng tính xếp ưu tiên (R6).

## 3.1 Nhận đơn đa kênh

**Mô tả.** OMFS lấy đơn từ mọi kênh bán đã nối và chuyển từng đơn thành một bản ghi đơn
hàng đã chuẩn hoá. Hiện thực FE-1 · Use case UC-01 · Mục tiêu BO-2.
**Độ ưu tiên:** Cao · **Bản phát hành:** 1.0 (storefront + Shopee), 1.1 (Lazada + TikTok Shop)

**Yêu cầu chức năng**

**Ingest-1:** Hệ thống phải lấy các đơn tạo ra kể từ mốc nước lần nhận thành công gần nhất từ từng kênh bán đang hoạt động, theo một khoảng thời gian cấu hình được cho từng kênh, mặc định 60 giây.

**Ingest-2:** Hệ thống phải tạo đúng một bản ghi đơn hàng cho mỗi mã đơn khác nhau của kênh, và phải bỏ qua mà không báo lỗi mọi đơn có mã kênh đã tồn tại.

**Ingest-3:** Hệ thống phải ánh xạ từng mã sản phẩm của kênh sang một SKU của OMFS bằng bảng ánh xạ SKU theo kênh, và phải đưa mọi đơn có chứa một mã chưa ánh xạ vào hàng chờ SKU chưa ánh xạ với trạng thái Held-Unmapped.

**Ingest-4:** Hệ thống phải giữ nguyên mốc nước khi một yêu cầu tới kênh thất bại, và phải thử lại yêu cầu đó tối đa năm lần với độ trễ tăng theo bậc mũ trước khi phát một cảnh báo tích hợp.

**Ingest-5:** Hệ thống phải gán trạng thái Held-Invalid cho mọi đơn lấy về mà thiếu địa chỉ giao hoặc không chứa dòng đơn hàng nào, và phải phát một ngoại lệ chất lượng dữ liệu cho đơn đó.

**Ingest-6:** Hệ thống phải cho phép một Quản trị hệ thống yêu cầu nhận lại một mã đơn cụ thể của kênh.

## 3.2 Sàng lọc và kiểm tính hợp lệ của đơn

**Mô tả.** Các phép kiểm địa chỉ, thanh toán và gian lận thực hiện trước khi một đơn được
phép chiếm tồn kho. Hiện thực FE-2 · Use case UC-02 · Mục tiêu BO-1.
**Độ ưu tiên:** Cao · **Bản phát hành:** 1.0

**Validate-1:** Hệ thống phải xác minh rằng mã bưu chính giao hàng của một đơn được ít nhất một hãng đang hoạt động phục vụ, trước khi gán cho đơn đó trạng thái Validated.

**Validate-2:** Hệ thống phải đọc trạng thái uỷ quyền thanh toán của một đơn từ cổng thanh toán, và phải gán trạng thái Held-Review với lý do PAYMENT_NOT_AUTHORIZED khi việc uỷ quyền vắng mặt hoặc bị từ chối.

**Validate-3:** Hệ thống phải từ chối mọi đơn mà các dòng của nó chỉ định nhiều hơn một địa chỉ giao hàng, theo đúng BR-03.

**Validate-4:** Hệ thống phải bỏ qua phép kiểm uỷ quyền thanh toán với các đơn có phương thức thanh toán là thu tiền khi nhận hàng.

**Validate-5:** Hệ thống phải gán trạng thái Held-Review với lý do PAYMENT_UNKNOWN khi cổng thanh toán không phản hồi trong vòng năm phút, và không được coi việc không có phản hồi là đã được uỷ quyền.

**Validate-6:** Hệ thống phải cho phép một Nhân viên CSKH thả một đơn từ Held-Review sang Validated, và phải ghi lại nhân viên đó, thời điểm và một lời giải trình bắt buộc.

## 3.3 Tồn kho thời gian thực và available-to-promise

**Mô tả.** Vị thế tồn kho có thẩm quyền duy nhất, và việc giữ tồn ngay khi nhận đơn.
Hiện thực FE-3 · Use case UC-03 · Mục tiêu BO-1.
**Độ ưu tiên:** Cao · **Bản phát hành:** 1.0

**Reserve-1:** Hệ thống phải tính available-to-promise theo từng SKU tại từng trung tâm hoàn tất đơn theo đúng BR-07, mỗi khi số tồn thực tế, số đang giữ, số hỏng hoặc số tồn an toàn của SKU đó tại trung tâm đó thay đổi.

**Reserve-2:** Hệ thống chỉ được giữ tồn cho một dòng đơn hàng khi available-to-promise của SKU đó tại trung tâm được chọn lớn hơn hoặc bằng số lượng đặt, theo đúng BR-01 và BR-02.

**Reserve-3:** Hệ thống phải nhả mọi lượt giữ tồn thuộc về một đơn chưa được xác nhận bằng uỷ quyền thanh toán trong cửa sổ giữ tồn định ra ở BR-04, và phải đưa đơn đó về trạng thái Pending.

**Reserve-4:** Hệ thống phải giữ tồn cho mọi dòng của một đơn hoặc không dòng nào, và phải gán trạng thái Backordered cho đơn mà tổng available-to-promise trên mọi trung tâm nhỏ hơn số lượng đặt của bất kỳ dòng nào.

**Reserve-5:** Hệ thống phải giữ tồn cho một dòng đơn hàng trải trên nhiều trung tâm khi không một trung tâm nào đủ available-to-promise, trong giới hạn tách nêu ở BR-08.

**Reserve-6:** Hệ thống phải cho phép một Kiểm soát tồn kho đặt số tồn an toàn theo từng SKU tại từng trung tâm, và phải loại số lượng đó khỏi available-to-promise theo đúng BR-17.

**Reserve-7:** Hệ thống phải thử giữ tồn lại cho một đơn đang chờ hàng khi available-to-promise của bất kỳ SKU nào trên đơn đó tăng lên.

## 3.4 Đồng bộ tồn kho ra các kênh

**Mô tả.** Việc công bố số lượng bán được tới mọi kênh có bán một SKU.
Hiện thực FE-4 · Use case UC-13 · Mục tiêu BO-1.
**Độ ưu tiên:** Cao · **Bản phát hành:** 1.0

**Sync-1:** Hệ thống phải công bố số lượng bán được của một SKU, tính theo đúng BR-07, tới mọi kênh bán đang hoạt động có bán SKU đó, mỗi khi số lượng đó thay đổi.

**Sync-2:** Hệ thống phải áp một số lượng đệm riêng theo từng kênh, do Kiểm soát tồn kho cấu hình, khi tính số lượng công bố tới kênh đó, theo đúng BR-17.

**Sync-3:** Hệ thống phải hoàn tất việc công bố một số lượng đã thay đổi trong khoảng thời gian định ra ở BR-20, tính từ thời điểm thay đổi tồn kho nền được ghi nhận.

**Sync-4:** Hệ thống phải gộp nhiều thay đổi tồn kho ảnh hưởng tới một SKU trong cùng một cửa sổ gom thành một lượt công bố duy nhất mang số lượng mới nhất.

**Sync-5:** Hệ thống phải so, theo một khoảng thời gian cấu hình được và mặc định là một giờ, số lượng mà từng kênh đang hoạt động báo về với số lượng OMFS đang giữ, và phải công bố lại mọi SKU nào hai con số lệch nhau.

**Sync-6:** Hệ thống phải công bố số lượng bằng không, và phải phát một cảnh báo chất lượng dữ liệu có nêu tên SKU và trung tâm hoàn tất đơn, khi số lượng bán được tính ra nhỏ hơn không.

**Sync-7:** Hệ thống phải xếp hàng các lượt công bố bị một kênh từ chối vì bóp băng thông, và phải tiếp tục chúng sau khoảng thời gian mà kênh đó nêu ra, không được bỏ lượt công bố nào.

## 3.5 Định tuyến và tách đơn tự động

**Mô tả.** Việc chọn trung tâm hoặc các trung tâm sẽ giao từng dòng. Hiện thực FE-5 ·
Use case UC-04 · Mục tiêu BO-2, BO-3.
**Độ ưu tiên:** Cao · **Bản phát hành:** 1.0

**Route-1:** Hệ thống phải gán mọi dòng của một đơn cho đúng một trung tâm hoàn tất đơn, theo đúng BR-01.

**Route-2:** Hệ thống phải tính điểm định tuyến cho mọi trung tâm ứng viên theo đúng BR-06, và phải chọn cách gom có tổng điểm cao nhất.

**Route-3:** Hệ thống phải ghi lại, gắn với từng đơn đã định tuyến, điểm của mọi trung tâm ứng viên cùng với từng thành phần điểm và lý do cái thắng đã được chọn.

**Route-4:** Hệ thống phải phát một ngoại lệ hoàn tất đơn, và không được tạo lô giao nào, với mọi đơn mà việc định tuyến sẽ đòi nhiều trung tâm hơn giới hạn nêu ở BR-08.

**Route-5:** Hệ thống phải gán ngày xuất hàng là ngày làm việc kế tiếp cho mọi đơn được định tuyến về một trung tâm sau giờ chốt xuất hàng của trung tâm đó, theo đúng BR-10.

**Route-6:** Hệ thống chỉ được cho phép người dùng giữ vai Quản lý hoàn tất đơn ghi đè một quyết định định tuyến tự động, và phải đòi ghi lại một lý do với mọi lần ghi đè, theo đúng BR-19.

**Route-7:** Hệ thống phải định tuyến lại mọi đơn đã định tuyến mà chưa vào giai đoạn nhặt hàng, khi trung tâm mà nó được định tuyến tới bị một Quản trị hệ thống đóng lại.

**Route-8:** Hệ thống phải cho phép một Quản lý hoàn tất đơn đổi các trọng số điểm định tuyến mà không cần ra bản phần mềm mới, và phải từ chối mọi bộ trọng số mà các thành phần không cộng bằng một.

## 3.6 Sinh và phát đợt nhặt hàng

**Mô tả.** Việc gom các lô giao đã định tuyến thành những lô công việc phát xuống sàn kho.
Hiện thực FE-6 · Use case UC-05 · Mục tiêu BO-3.
**Độ ưu tiên:** Cao · **Bản phát hành:** 1.0

**Wave-1:** Hệ thống phải cho phép một Quản lý hoàn tất đơn tạo một đợt nhặt hàng từ các lô giao đã định tuyến tại một trung tâm, lọc theo giờ chốt của hãng, mức dịch vụ, tuổi đơn và kích cỡ đợt tối đa.

**Wave-2:** Hệ thống phải đưa vào một đợt, khi bộ hẹn giờ đợt tự động chạy, mọi lô giao đã định tuyến có ngày xuất hàng là hôm nay và chưa quá giờ chốt của hãng, theo đúng BR-10.

**Wave-3:** Hệ thống phải gán mỗi lô giao vào tối đa một đợt đang mở, và phải loại khỏi đợt đang được tạo mọi lô giao đã được gán cho một đợt đang mở khác.

**Wave-4:** Hệ thống phải leo thang lên Quản lý hoàn tất đơn mọi lô giao trong một đợt đã phát mà chưa được nhặt trong khoảng thời gian nêu ở BR-13.

**Wave-5:** Hệ thống phải sắp thứ tự danh sách nhặt hàng của một đợt theo vị trí lưu trữ ghi với từng SKU.

**Wave-6:** Hệ thống phải tạo nhiều đợt thay vì một đợt vượt kích cỡ tối đa đã cấu hình, và phải báo số đợt đã tạo.

**Wave-7:** Hệ thống phải cho phép một Quản lý hoàn tất đơn huỷ một đợt mà chưa món nào được nhặt, và phải đưa mọi lô giao trong đợt đó về trạng thái Routed.

## 3.7 Nhặt và đóng gói có quét xác nhận

**Mô tả.** Việc nhặt hàng điều khiển bằng máy cầm tay, có xác minh mã vạch và gán thùng.
Hiện thực FE-7 · Use case UC-06 · Mục tiêu BO-2, BO-3.
**Độ ưu tiên:** Cao · **Bản phát hành:** 1.0

**Pick-1:** Hệ thống phải trình ra cho nhân viên, với từng đầu việc nhặt, mã SKU, mô tả món hàng, ảnh món hàng, số lượng cần và vị trí lưu trữ.

**Pick-2:** Hệ thống chỉ được xác nhận một lượt nhặt khi mã vạch nhân viên quét khớp với mã vạch ghi với SKU mong đợi.

**Pick-3:** Hệ thống phải leo thang một đầu việc nhặt lên Quản lý hoàn tất đơn sau ba lần quét lệch mã vạch liên tiếp trên đầu việc đó.

**Pick-4:** Hệ thống phải cho phép nhân viên ghi một số lượng đã nhặt thấp hơn số lượng cần, phải điều chỉnh số tồn thực tế của SKU đó về đúng số đã đếm, và phải phát một ngoại lệ nhặt thiếu.

**Pick-5:** Hệ thống phải cho phép nhân viên ghi một số lượng là hàng hỏng, phải chuyển số lượng đó sang số hỏng của SKU và trung tâm đó, và phải loại nó khỏi available-to-promise theo đúng BR-07.

**Pick-6:** Hệ thống phải ghi lại việc gán từng món đã nhặt vào một thùng, cùng với khối lượng của từng thùng.

**Pick-7:** Hệ thống phải trừ số lượng đã nhặt khỏi tồn thực tế và nhả các lượt giữ tồn của chúng ngay tại thời điểm lô giao được ghi nhận là đã đóng gói.

**Pick-8:** Hệ thống phải nhận các lượt quét mà một máy cầm tay ghi lại trong lúc máy đó không có mạng, và phải áp dụng mỗi lượt quét như vậy đúng một lần khi nối lại được.

## 3.8 So giá hãng vận chuyển và mua nhãn

**Mô tả.** Việc so các hãng đủ điều kiện và mua nhãn vận chuyển. Hiện thực FE-8 ·
Use case UC-07 · Mục tiêu BO-5.
**Độ ưu tiên:** Trung bình · **Bản phát hành:** 1.1

**Label-1:** Hệ thống chỉ được coi một hãng là đủ điều kiện cho một lô giao khi hãng đó đang hoạt động, phục vụ mã bưu chính đích, và chấp nhận khối lượng cùng kích thước của mọi thùng trong lô giao, theo đúng BR-11.

**Label-2:** Hệ thống phải tính chi phí trọn gói của từng báo giá theo đúng BR-12.

**Label-3:** Hệ thống phải chọn hãng đủ điều kiện có chi phí trọn gói thấp nhất mà thời gian vận chuyển công bố của nó không vượt quá số ngày còn lại tới ngày giao đã hứa.

**Label-4:** Hệ thống phải chọn hãng đủ điều kiện có thời gian vận chuyển ngắn nhất, thay vì chi phí thấp nhất, với các lô giao mà đơn của nó mang mức dịch vụ express.

**Label-5:** Hệ thống phải lưu báo giá lấy được từ mọi hãng đủ điều kiện gắn với lô giao, kể cả những báo giá không được chọn.

**Label-6:** Hệ thống phải mua đúng một nhãn cho mỗi lô giao, và phải hỏi hãng được chọn xem đã có nhãn nào gắn với mã tham chiếu của lô giao chưa, trước khi mua, trong trường hợp một lần mua trước đó không trả về phản hồi nào.

**Label-7:** Hệ thống phải loại ra hãng nào từ chối một yêu cầu nhãn và phải thử báo giá tốt kế tiếp, tối đa ba hãng, trước khi phát một ngoại lệ dán nhãn.

**Label-8:** Hệ thống phải phát một ngoại lệ dán nhãn, và phải để lô giao ở trạng thái Packed, khi không hãng nào đủ điều kiện hoặc khi mọi yêu cầu báo giá đều thất bại.

## 3.9 Nhận sự kiện theo dõi từ hãng vận chuyển

**Mô tả.** Việc tự động nhận và áp dụng các sự kiện trạng thái của hãng. Hiện thực FE-9 ·
Use case UC-08 · Mục tiêu BO-4.
**Độ ưu tiên:** Trung bình · **Bản phát hành:** 1.1

**Event-1:** Hệ thống phải nhận các sự kiện theo dõi do một hãng đẩy tới và phải xác thực hãng gửi trước khi áp dụng bất kỳ sự kiện nào.

**Event-2:** Hệ thống phải xin các sự kiện theo dõi cho mọi lô giao đang mở của bất kỳ hãng nào không đẩy sự kiện, theo một khoảng thời gian cấu hình được và mặc định là 15 phút.

**Event-3:** Hệ thống phải ánh xạ từng mã trạng thái của hãng sang một trạng thái của OMFS, và phải lưu lại mà không áp dụng mọi sự kiện có mã trạng thái hãng chưa được ánh xạ, đồng thời phát một cảnh báo cấu hình.

**Event-4:** Hệ thống phải sắp thứ tự các sự kiện theo dõi theo thời điểm sự kiện mà hãng ghi nhận, và không được đổi trạng thái lô giao khi nhận một sự kiện cũ hơn sự kiện mới nhất đã áp cho lô giao đó.

**Event-5:** Hệ thống phải lưu, với mọi sự kiện theo dõi, cả thời điểm sự kiện của hãng lẫn thời điểm OMFS nhận được nó.

**Event-6:** Hệ thống phải giữ trong một hàng chờ mồ côi, trong 30 ngày, mọi sự kiện theo dõi có mã theo dõi không khớp lô giao nào.

**Event-7:** Hệ thống phải phát một ngoại lệ hoàn tất đơn cho mọi lô giao đã được lấy hàng mà không nhận được sự kiện theo dõi nào trong 48 giờ.

**Event-8:** Hệ thống phải đóng một đơn khi mọi lô giao thuộc đơn đó đều đã đạt trạng thái Delivered.

## 3.10 Thông báo cho khách và trang tự tra cứu

**Mô tả.** Màn hình hướng tới khách về trạng thái đơn và lô giao. Hiện thực FE-10 ·
Use case UC-09 · Mục tiêu BO-4.
**Độ ưu tiên:** Trung bình · **Bản phát hành:** 1.2

**Track-1:** Hệ thống phải phát ra, vào thời điểm một lô giao được dán nhãn, một đường liên kết theo dõi chứa một token duy nhất cho một đơn, và phải gửi đường liên kết đó tới khách qua dịch vụ thông báo.

**Track-2:** Hệ thống chỉ được tiết lộ, khi trả lời một yêu cầu theo dõi, thông tin liên quan tới đúng một đơn mà token trong yêu cầu đó chỉ tới.

**Track-3:** Hệ thống phải trình ra từng lô giao của một đơn bị tách một cách riêng biệt, kèm hãng, mã theo dõi, trạng thái hiện tại và lịch sử sự kiện của nó, cùng một lời giải thích rằng đơn đã bị tách.

**Track-4:** Hệ thống phải hiển thị, với mọi lô giao mà sự kiện gần nhất của hãng cũ hơn 48 giờ, thời điểm của sự kiện đó và một câu nói rõ rằng chưa nhận được thông tin nào mới hơn, theo đúng BR-09.

**Track-5:** Hệ thống phải trả về phản hồi giống hệt nhau cho một token sai và cho một token trỏ tới một đơn không tồn tại.

**Track-6:** Hệ thống phải trình ra trạng thái ở mức đơn hàng, diễn đạt bằng câu chữ hướng tới khách, với một đơn chưa có lô giao nào.

**Track-7:** Hệ thống phải ghi lại từng lượt xem theo dõi, để đo được mức sử dụng tự phục vụ so với mục tiêu nghiệp vụ BO-4.

## 3.11 Quản lý ngoại lệ hoàn tất đơn

**Mô tả.** Một hàng chờ duy nhất cho mọi sự cố trong vòng đời hoàn tất đơn. Hiện thực
FE-11 · Use case UC-10 · Mục tiêu BO-1, BO-2.
**Độ ưu tiên:** Trung bình · **Bản phát hành:** 1.2

**Except-1:** Hệ thống phải trình ra các ngoại lệ hoàn tất đơn đang mở, sắp theo mức rủi ro trễ ngày giao tính theo đúng BR-09, và phải chỉ ra những ngoại lệ đã vượt mức dịch vụ định ra cho loại của chúng.

**Except-2:** Hệ thống chỉ được đưa ra, với một ngoại lệ được chọn, những phương án xử lý đã định ra cho đúng loại ngoại lệ đó.

**Except-3:** Hệ thống phải ghi lại, với mọi cách xử lý được áp dụng, người dùng đã xử lý, thời điểm, cách xử lý được chọn và một lý do bắt buộc.

**Except-4:** Hệ thống phải áp một cách xử lý trọn vẹn hoặc không áp gì cả, và phải để ngoại lệ vẫn mở khi bất kỳ phần nào của cách xử lý thất bại.

**Except-5:** Hệ thống phải từ chối một cách xử lý mà tiền điều kiện của nó không còn đúng, và phải trình ra cho người dùng phiên bản ngoại lệ đã được làm mới.

**Except-6:** Hệ thống phải cho phép một Quản lý hoàn tất đơn áp một cách xử lý cho nhiều ngoại lệ đã chọn mà cùng loại và cùng nguyên nhân.

**Except-7:** Hệ thống phải leo thang lên cấp trên của Quản lý hoàn tất đơn được phân công mọi ngoại lệ mở lâu hơn mức dịch vụ định ra cho loại của nó.

## 3.12 Huỷ và sửa đơn hàng

**Mô tả.** Việc chặn hoặc đổi một đơn khi nó còn chặn được. Hiện thực FE-12 ·
Use case UC-11 · Mục tiêu BO-1.
**Độ ưu tiên:** Trung bình · **Bản phát hành:** 1.0

**Cancel-1:** Hệ thống chỉ được cho phép huỷ hoặc sửa một đơn trước khi một nhãn vận chuyển được mua cho bất kỳ lô giao nào của nó, theo đúng BR-05.

**Cancel-2:** Hệ thống phải nhả mọi lượt giữ tồn thuộc về một đơn bị huỷ hoặc một dòng đơn bị huỷ, theo đúng BR-05, và phải công bố thay đổi tồn kho kết quả tới mọi kênh bán bị ảnh hưởng.

**Cancel-3:** Hệ thống phải định tuyến lại các dòng còn lại của một đơn sau khi một dòng bị huỷ hoặc bị giảm số lượng.

**Cancel-4:** Hệ thống phải cho phép huỷ nhưng phải từ chối sửa một đơn xuất phát từ một kênh có loại là Marketplace, theo đúng BR-16, và phải nói rõ chính sách của kênh nào đang áp dụng.

**Cancel-5:** Hệ thống phải kiểm lại một địa chỉ giao hàng đã thay đổi và phải định tuyến lại đơn trước khi chấp nhận thay đổi đó.

**Cancel-6:** Hệ thống phải giữ một lệnh huỷ xin cho một lô giao đã vào giai đoạn nhặt hàng ở trạng thái Pending-Stop, và chỉ được nhả các lượt giữ tồn sau khi trung tâm hoàn tất đơn xác nhận rằng việc nhặt hàng đã dừng.

**Cancel-7:** Hệ thống phải xếp hàng chờ thử lại mọi thông báo huỷ mà một kênh bán từ chối, và phải phát một cảnh báo khi thông báo vẫn chưa gửi được sau ba lần thử.

## 3.13 Trả hàng và nhập lại kho

**Mô tả.** Việc cho phép, nhận, kiểm tra và nhập lại kho hàng trả về. Hiện thực FE-13 ·
Use case UC-12.
**Độ ưu tiên:** Thấp · **Bản phát hành:** 2.0

**Return-1:** Hệ thống chỉ được tạo một lượt cho phép trả hàng cho các dòng mà ngày giao của chúng nằm trong cửa sổ trả hàng định ra ở BR-14.

**Return-2:** Hệ thống phải cho phép một giám sát viên duyệt một lượt trả hàng ngoài cửa sổ trả hàng, và phải ghi lại giám sát viên đó cùng một lý do bắt buộc.

**Return-3:** Hệ thống phải ghi lại, với từng dòng hàng trả về, số lượng nhận được và kết quả kiểm hàng mà nhân viên ghi nhận.

**Return-4:** Hệ thống phải tăng số tồn thực tế của một món hàng trả về được ghi nhận là còn bán được, và phải chuyển vào khu cách ly số lượng của mọi món được ghi nhận là hỏng, theo đúng BR-15.

**Return-5:** Hệ thống phải đóng với trạng thái không-nhận-được mọi lượt cho phép trả hàng mà không có hàng nào tới trong vòng 30 ngày kể từ lúc cho phép.

**Return-6:** Hệ thống phải đưa vào hàng chờ hàng-trả-không-rõ mọi kiện hàng trả về không mang mã cho phép trả hàng hay mã lô giao nào đọc được.

**Return-7:** Hệ thống phải phát một ngoại lệ hoàn tất đơn với mọi số lượng nhận được vượt quá số lượng đã cho phép.

## 3.14 Bảng điều khiển hiệu suất hoàn tất đơn và đối soát chi phí

**Mô tả.** Việc nhìn thấy sáu mục tiêu nghiệp vụ một cách liên tục. Hiện thực FE-14 ·
Use case UC-14 · Mọi mục tiêu.
**Độ ưu tiên:** Thấp · **Bản phát hành:** 2.0

**Dash-1:** Hệ thống phải trình ra số đơn đã giao, thời gian từ nhận đơn tới xuất hàng, tỉ lệ bán vượt tồn, tỉ lệ định tuyến tự động, số ngoại lệ đang mở và chi phí vận chuyển mỗi đơn, mỗi chỉ số đặt cạnh mục tiêu của nó.

**Dash-2:** Hệ thống phải tính mọi chỉ số trên bảng điều khiển bằng đúng định nghĩa đã ghi cho thước đo thành công tương ứng ở tài liệu Vision and Scope §1.4.

**Dash-3:** Hệ thống phải nhận diện mọi SKU mà available-to-promise của nó thoả điều kiện có-nguy-cơ-hết-hàng định ra ở BR-18.

**Dash-4:** Hệ thống phải giới hạn các trung tâm hoàn tất đơn, kênh bán và nhãn hàng mà một người dùng nhìn thấy được, theo đúng những gì vai của người đó cho phép.

**Dash-5:** Hệ thống phải hiển thị, cùng với mọi chỉ số, giai đoạn nó phủ và thời điểm dữ liệu nền được làm mới lần cuối.

**Dash-6:** Hệ thống phải trình ra các báo giá đã lưu gắn với các lô giao, đặt cạnh số tiền mà từng hãng đã xuất hoá đơn, cho một giai đoạn do Quản lý logistics chọn.

**Dash-7:** Hệ thống phải trình ra một trạng thái cho biết không có dữ liệu nào cho giai đoạn được chọn, khác biệt với trạng thái mà giá trị chỉ số bằng không.

**Dash-8:** Hệ thống phải trình ra các chỉ số đã tính xong, và phải chỉ ra những chỉ số chưa xong, khi việc tính bất kỳ chỉ số nào không hoàn tất.

---

# 4. Yêu cầu dữ liệu

## 4.1 Mô hình dữ liệu logic

Mô hình thực thể-quan hệ nằm ở **Phụ lục B**, Hình B-2. Nó là một mô hình *logic* — nó mô
tả dữ liệu mà doanh nghiệp làm việc cùng, không phải một schema cơ sở dữ liệu. Thiết kế
bảng, đánh chỉ mục và lưu trữ vật lý là các quyết định thiết kế nằm ngoài phạm vi tài
liệu này.

Các thực thể và quan hệ chính:

| Thực thể | Quan hệ |
|---|---|
| Sales Channel | 1 → n Order |
| Order | 1 → n Order Line · 1 → n Shipment · 1 → 0..n Fulfillment Exception · 1 → 0..n Return Authorization |
| Order Line | 1 → 0..n Reservation |
| Fulfillment Center | 1 → n Inventory Record · 1 → n Shipment · 1 → n Pick Wave |
| Item | 1 → n Inventory Record · 1 → n Order Line |
| Shipment | 1 → n Shipment Line · 1 → 0..n Carton · 1 → 0..n Tracking Event · n → 0..1 Pick Wave |
| Routing Decision | 1 → 1..3 Routing Score, 1 → 1 Order |
| Return Authorization | 1 → n Return Line |

Quan hệ ràng buộc thiết kế nhiều nhất là **Order → Shipment**: một đơn có thể có nhiều lô
giao (BR-08) trong khi một *dòng* đơn hàng thì không được tách qua nhiều trung tâm
(BR-01). Gộp lô giao vào đơn hàng — một phép đơn giản hoá rất hấp dẫn — sẽ làm cho một
đơn bị tách trở nên không biểu diễn nổi.

## 4.2 Từ điển dữ liệu

Định nghĩa, cấu thành, kiểu, độ dài và các giá trị cho phép của từng phần tử dữ liệu nằm
trong tài liệu **Data Dictionary** riêng (R4), gồm 110 mục. Nó được duy trì riêng để các
dự án sau dùng lại được và để nó đổi được mà không phải chốt lại bản cơ sở của SRS này.

## 4.3 Báo cáo

| Mã | Báo cáo | Nội dung và thứ tự sắp xếp | Đối tượng đọc | Tần suất |
|---|---|---|---|---|
| RPT-1 | Tổng kết hoàn tất đơn hằng ngày | Số đơn nhận, giao, huỷ và chờ hàng; thời gian chu kỳ; theo từng trung tâm; sắp theo trung tâm | Quản lý hoàn tất đơn | Hằng ngày 07:00 |
| RPT-2 | Sự cố bán vượt tồn | Mọi đơn bị huỷ hoặc giao thiếu vì không đủ hàng, kèm SKU, kênh và dấu thời gian; sắp theo ngày giảm dần | Kiểm soát tồn kho | Hằng tuần |
| RPT-3 | Tuổi của ngoại lệ | Ngoại lệ đang mở theo loại và dải tuổi, kèm các lần vượt mức dịch vụ; sắp theo tuổi giảm dần | Quản lý hoàn tất đơn | Hằng ngày |
| RPT-4 | Đối soát chi phí hãng vận chuyển | Giá đã báo so với giá trên hoá đơn theo từng hãng từng tháng, kèm chênh lệch; sắp theo chênh lệch giảm dần | Quản lý logistics | Hằng tháng |
| RPT-5 | Tồn kho có rủi ro | Các SKU thoả điều kiện ở BR-18, kèm tốc độ bán và available-to-promise; sắp theo số ngày còn đủ hàng tăng dần | Kiểm soát tồn kho | Hằng ngày |
| RPT-6 | Độ trôi đồng bộ theo kênh | Các SKU mà số lượng trên kênh lệch với OMFS lúc đối soát; sắp theo kênh | Quản trị hệ thống | Hằng ngày |
| RPT-7 | Hiệu suất hoàn tất đơn theo nhãn hàng | Thời gian chu kỳ, tỉ lệ huỷ đơn và tỉ lệ giao thành công theo từng nhãn; sắp theo nhãn | Quản lý nhãn hàng | Hằng tuần |

Bố cục báo cáo để lại cho khâu thiết kế. Mục này chỉ đặc tả nội dung, thứ tự sắp xếp, đối
tượng đọc và tần suất.

## 4.4 Thu thập, toàn vẹn, lưu trữ và huỷ dữ liệu

| # | Yêu cầu |
|---|---|
| DA-1 | Hệ thống chỉ được thu nạp dữ liệu đơn hàng từ các kênh bán đã nối, và không được cho phép tạo một đơn bằng tay. |
| DA-2 | Hệ thống phải thu nạp dữ liệu sản phẩm gốc và tồn kho đầu kỳ bằng một lần chuyển đổi duy nhất, và phải từ chối mọi bản ghi không qua được các luật kiểm đã thống nhất, thay vì nhập nó vào một cách dở dang. |
| DA-3 | Hệ thống phải ghi lại, với mọi thay đổi của một lượt giữ tồn hay một số tồn thực tế, thời điểm, nguyên nhân và người hoặc tiến trình chịu trách nhiệm. |
| DA-4 | Hệ thống phải lưu giữ dữ liệu đơn hàng, lô giao và theo dõi trong 24 tháng, sau đó phải lưu trữ lâu dài và gỡ khỏi kho dữ liệu vận hành. |
| DA-5 | Hệ thống phải lưu giữ bản ghi kiểm toán các lượt dịch chuyển tồn kho trong 7 năm, theo đúng chính sách lưu trữ của kế toán. |
| DA-6 | Hệ thống phải gỡ tên khách hàng, địa chỉ, số điện thoại và địa chỉ email khỏi các đơn đã lưu trữ lâu dài sau 24 tháng, vẫn giữ lại đơn hàng và số lượng của nó. |
| DA-7 | Hệ thống phải kiểm hằng ngày rằng tổng số lượng đang giữ bằng tổng các lượt giữ tồn đang mở, và phải phát cảnh báo chất lượng dữ liệu với mọi sai lệch. |

---

# 5. Yêu cầu giao tiếp ngoài

## 5.1 Giao diện người dùng

| # | Yêu cầu |
|---|---|
| UI-1 | Hệ thống phải cung cấp bốn giao diện tách biệt: giao diện nhặt và đóng gói trên máy cầm tay, giao diện web cho quản lý, giao diện web cho nhân viên CSKH, và trang theo dõi đơn công khai cho khách. |
| UI-2 | Giao diện máy cầm tay phải thao tác được bằng một tay, phải có vùng chạm ít nhất 48 × 48 pixel độc lập thiết bị, và phải vẫn đọc được khi nhân viên đang đeo găng. |
| UI-3 | Mọi giao diện phải trình ra một thông báo lỗi nói rõ chuyện gì đã xảy ra, hệ thống đã làm gì với nó, và người dùng làm được gì tiếp theo. |
| UI-4 | Mọi hành động có tính phá huỷ phải đòi một lần xác nhận có gọi tên đối tượng bị tác động. |
| UI-5 | Trang theo dõi đơn của khách phải dùng được mà không cần đăng nhập và không được hỏi bất kỳ dữ liệu cá nhân nào từ khách. |
| UI-6 | Thiết kế màn hình cho ba use case phức tạp nhất được minh hoạ ở R5; chỗ nào R5 và tài liệu này khác nhau thì tài liệu này có thẩm quyền. |

## 5.2 Giao tiếp phần mềm

| Mã | Giao tiếp | Chiều | Nội dung | Mức dịch vụ |
|---|---|---|---|---|
| SI-1 | Kênh bán — lấy đơn | Vào | Các đơn tạo ra kể từ một mốc nước | Khoảng hỏi ≤ 60 giây; thử lại theo Ingest-4 |
| SI-2 | Kênh bán — cập nhật tồn kho | Ra | SKU và số lượng bán được | Công bố trong vòng 60 giây kể từ khi thay đổi (Sync-3) |
| SI-3 | Kênh bán — huỷ đơn | Cả hai | Việc huỷ một đơn hàng | Xếp hàng và thử lại theo Cancel-7 |
| SI-4 | Cổng thanh toán — trạng thái uỷ quyền | Vào | Trạng thái uỷ quyền của một đơn; **không có dữ liệu thẻ** (CO-5) | Kỳ vọng phản hồi trong 5 giây; hết giờ chờ ở mốc 5 phút (Validate-5) |
| SI-5 | Hãng vận chuyển — báo giá | Ra / vào | Điểm đi, điểm đến, khối lượng, kích thước → chi phí và số ngày vận chuyển | Xin báo giá song song; hết giờ chờ tổng thể 10 phút (Label-8) |
| SI-6 | Hãng vận chuyển — mua nhãn | Ra / vào | Chi tiết lô giao → mã theo dõi và tài liệu nhãn | Đúng-một-lần cho mỗi lô giao (Label-6) |
| SI-7 | Hãng vận chuyển — sự kiện theo dõi | Vào | Các sự kiện trạng thái, đẩy tới hoặc hỏi định kỳ | Áp dụng trong vòng 15 phút ở p95 (QA-6) |
| SI-8 | ERP / kế toán — ghi sổ tài chính | Ra | Tổng các đơn đã giao trong ngày, theo nhãn hàng và kênh | Một lần mỗi ngày; thất bại thì phát cảnh báo |
| SI-9 | Dịch vụ thông báo — tin nhắn cho khách | Ra | Email và SMS kèm đường liên kết theo dõi đơn | Gửi trong vòng 5 phút kể từ sự kiện kích hoạt |
| SI-10 | Nhà cung cấp định danh — xác thực nhân viên | Vào | Khẳng định xác thực và khai báo vai trò (CO-1) | Theo chuẩn của tập đoàn |

**SI-1 tới SI-7 phải được cô lập sau một giao tiếp nội bộ**, sao cho thêm một kênh hoặc
một hãng không đòi phải sửa logic đơn hàng, tồn kho hay định tuyến (CO-6).

## 5.3 Giao tiếp phần cứng

| # | Yêu cầu |
|---|---|
| HI-1 | Hệ thống phải nhận đầu vào mã vạch từ máy quét tích hợp của các máy Android cầm tay đang triển khai ở các trung tâm, đưa vào dưới dạng gõ phím. |
| HI-2 | Hệ thống phải sinh ra nhãn vận chuyển ở định dạng mà máy in nhãn nhiệt lắp tại từng trung tâm chấp nhận. |
| HI-3 | Hệ thống phải hoạt động được trên máy cầm tay có bộ nhớ 2 GB và màn hình 5 inch (OE-3). |

## 5.4 Giao tiếp truyền thông

| # | Yêu cầu |
|---|---|
| CI-1 | Mọi liên lạc giữa OMFS và bất kỳ hệ thống ngoài nào phải dùng HTTPS với TLS 1.2 trở lên. |
| CI-2 | Mọi liên lạc giữa một trình duyệt hoặc máy cầm tay và OMFS phải dùng HTTPS với TLS 1.2 trở lên. |
| CI-3 | Hệ thống phải xác thực mọi webhook của hãng gửi tới trước khi áp dụng sự kiện mà nó mang theo (Event-1). |
| CI-4 | Thông báo cho khách phải được gửi qua dịch vụ thông báo và không được chứa dữ liệu cá nhân nào ngoài chính đơn hàng của người nhận. |
| CI-5 | Hệ thống không được đặt mã đơn hàng, token theo dõi hay bất kỳ dữ liệu cá nhân nào vào chuỗi truy vấn của URL, vốn được ghi vào nhật ký truy cập. |

---

# 6. Thuộc tính chất lượng

Mọi thuộc tính dưới đây đều viết bằng **Planguage** (Gilb): SCALE nói đo cái gì, METER nói
đo bằng cách nào, MUST là mức mà dưới đó bản phát hành không chấp nhận được, PLAN là mức
đang được thiết kế nhắm tới. Một thuộc tính không có con số thì không phải một yêu cầu —
nó là một ý kiến, và nó không kiểm thử được.

## 6.1 Khả dụng

#### QA-1 — Mức dễ học của giao diện nhặt và đóng gói
| | |
|---|---|
| **SCALE** | Số phút trôi qua để một Nhân viên kho chưa từng dùng OMFS hoàn tất đúng đầu việc nhặt đầu tiên của mình mà không cần trợ giúp |
| **METER** | Quan sát có bấm giờ với 10 nhân viên trong đợt thí điểm ở Đà Nẵng |
| **MUST** | ≤ 20 phút với 9 trên 10 nhân viên |
| **PLAN** | ≤ 15 phút với 9 trên 10 nhân viên |
| **Lý do** | Nhân viên kho là một lớp người dùng được ưu tiên (§2.2) với trình độ kỹ thuật thấp và mức luân chuyển theo ca. Việc đào tạo trên lớp không làm được ở quy mô này. |

#### QA-2 — Độ phản hồi của bước nhặt trên máy cầm tay
| | |
|---|---|
| **SCALE** | Số giây từ lúc quét mã vạch tới lúc đầu việc nhặt kế tiếp hiện ra, trên đúng phần cứng cầm tay đang triển khai |
| **METER** | Đo bằng công cụ trên máy, percentile 95 trong một ca |
| **MUST** | ≤ 1,5 giây |
| **PLAN** | ≤ 0,8 giây |
| **Lý do** | Một nhân viên thực hiện khoảng 170 lượt quét mỗi ca. Thêm một giây độ trễ cho mỗi lượt quét tốn ba phút mỗi nhân viên mỗi ca, và đi ngược thẳng vào mục tiêu BO-3. |

#### QA-3 — Khả năng hồi phục sau lỗi ở giao diện quản lý
| | |
|---|---|
| **SCALE** | Tỉ lệ phần trăm các trạng thái lỗi mà từ đó người dùng đi tiếp được mà không phải rời trang hay mất dữ liệu đã nhập |
| **METER** | Rà soát theo danh sách ngoại lệ ở R2, trong quá trình thẩm định yêu cầu |
| **MUST** | 100% với các cách xử lý ở bảng ngoại lệ |
| **PLAN** | 100% với mọi giao diện quản lý |

## 6.2 Hiệu năng

#### QA-4 — Độ trễ tới lúc nhận đơn
| | |
|---|---|
| **SCALE** | Số giây từ lúc một đơn được lấy về từ một kênh tới lúc việc giữ tồn của nó được xác nhận hoặc bị từ chối |
| **METER** | Các dấu thời gian ghi trên đơn; percentile 95, đo hằng ngày |
| **MUST** | ≤ 90 giây ở mức tải trung bình |
| **PLAN** | ≤ 30 giây ở mức tải trung bình; ≤ 90 giây ở mức tải đỉnh |
| **Lý do** | Mỗi giây giữa lúc lấy đơn về và lúc giữ tồn là một giây mà cùng đơn vị hàng đó có thể bị bán lần nữa. Thuộc tính này là nửa "độ trễ" của mục tiêu BO-1. |

#### QA-5 — Thông lượng giữ tồn dưới tải sale chớp nhoáng
| | |
|---|---|
| **SCALE** | Số lượt giữ tồn được xác nhận mỗi giây mà không lượt giữ nào bị mất hay bị nhân đôi |
| **METER** | Thử tải ở mức 1,5 lần đỉnh lịch sử, trước ngày chiến dịch đầu tiên |
| **MUST** | 60 lượt giữ tồn/giây, duy trì trong 10 phút |
| **PLAN** | 90 lượt giữ tồn/giây, duy trì trong 10 phút |
| **Lý do** | Các đợt bùng ngày chiến dịch (rủi ro RI-5). Giữ tồn là thao tác có mức tranh chấp cao nhất hệ thống. |

#### QA-6 — Độ trễ công bố tồn kho
| | |
|---|---|
| **SCALE** | Số giây từ lúc một số tồn thực tế hoặc số đang giữ thay đổi tới lúc số lượng bán được mới được một kênh bán chấp nhận |
| **METER** | Hiệu giữa thời điểm tồn kho đổi và thời điểm công bố; percentile 95, đo hằng ngày |
| **MUST** | ≤ 120 giây |
| **PLAN** | ≤ 60 giây (mốc ở BR-20) |

#### QA-7 — Độ trễ nhận sự kiện theo dõi
| | |
|---|---|
| **SCALE** | Số phút từ dấu thời gian sự kiện của chính hãng tới lúc trạng thái đơn trong OMFS phản ánh sự kiện đó |
| **METER** | Hiệu giữa Carrier Event Time và Received At; percentile 95, đo hằng ngày |
| **MUST** | ≤ 30 phút |
| **PLAN** | ≤ 15 phút |
| **Lý do** | Đây là tiêu chí thành công đo được của mục tiêu BO-4. Một trang theo dõi chỉ đáng đưa ra nếu thứ nó hiển thị là hiện hành. |

#### QA-8 — Độ phản hồi của giao diện quản lý
| | |
|---|---|
| **SCALE** | Số giây tới lúc hiển thị có nghĩa đầu tiên của bàn định tuyến, bảng ngoại lệ và bảng điều khiển |
| **METER** | Giám sát tổng hợp từ mạng văn phòng; percentile 95 |
| **MUST** | ≤ 4 giây |
| **PLAN** | ≤ 2 giây |

## 6.3 An ninh

#### QA-9 — Khả năng chống đoán của token theo dõi
| | |
|---|---|
| **SCALE** | Số lần đoán kỳ vọng để lấy được một token theo dõi hợp lệ cho bất kỳ đơn nào |
| **METER** | Phân tích entropy của token cộng với một phép thử giới hạn tần suất |
| **MUST** | ≥ 2⁶⁴ lần đoán, kèm giới hạn tần suất theo từng địa chỉ nguồn |
| **PLAN** | ≥ 2¹²⁸ lần đoán |
| **Lý do** | Trang theo dõi là bề mặt duy nhất vào được từ công cộng và nó mang tên, địa chỉ cùng nội dung đơn hàng của khách. Yêu cầu Track-2 trở nên vô nghĩa nếu thiếu con số này. |

#### QA-10 — Việc cưỡng chế phân quyền
| | |
|---|---|
| **SCALE** | Tỉ lệ phần trăm các thao tác có đặc quyền mà việc kiểm vai được cưỡng chế ở phía máy chủ, không chỉ ở giao diện |
| **METER** | Rà soát an ninh mọi thao tác liệt kê ở mục 3, trước khi phát hành |
| **MUST** | 100% |
| **PLAN** | 100%, kèm các phép kiểm tự động phủ việc ghi đè định tuyến (BR-19), việc xử lý ngoại lệ và việc đổi cấu hình |
| **Lý do** | Giấu một nút điều khiển trong giao diện không phải là phân quyền. BR-19 chỉ cưỡng chế được ở phía máy chủ. |

#### QA-11 — Tính đầy đủ của vết kiểm toán
| | |
|---|---|
| **SCALE** | Tỉ lệ phần trăm các lượt dịch chuyển tồn kho, ghi đè định tuyến và xử lý ngoại lệ mà truy xuất được người làm, thời điểm và lý do |
| **METER** | Lấy mẫu 50 bản ghi mỗi loại trong quá trình thẩm định yêu cầu |
| **MUST** | 100% |
| **PLAN** | 100%, truy xuất được trong vòng 5 giây |

#### QA-12 — Việc xử lý thông tin xác thực
| | |
|---|---|
| **SCALE** | Số khoá API của bên thứ ba hoặc thông tin xác thực thanh toán lấy ra được từ một trình duyệt hoặc máy cầm tay |
| **METER** | Soi các gói đã giao và lưu lượng mạng |
| **MUST** | 0 |
| **PLAN** | 0 (ràng buộc CO-2, CO-5) |

## 6.4 An toàn và toàn vẹn

#### QA-13 — Bảo toàn tồn kho
| | |
|---|---|
| **SCALE** | Số đơn vị hàng bị hệ thống tạo ra hoặc phá huỷ mà không phải do một sự kiện vật lý được ghi nhận, mỗi tháng |
| **METER** | Đối soát hằng ngày theo DA-7 |
| **MUST** | 0 |
| **PLAN** | 0, và mọi sai lệch đều được cảnh báo trong vòng 24 giờ |
| **Lý do** | Một lần trừ kép hoặc một lượt giữ tồn bị mất sẽ đưa trở lại đúng vấn đề bán vượt tồn mà dự án sinh ra để xoá bỏ, và nó làm điều đó một cách âm thầm. |

#### QA-14 — Tính nguyên tử của các thay đổi trạng thái đơn hàng
| | |
|---|---|
| **SCALE** | Số đơn bị bỏ lại ở trạng thái dở dang — giữ tồn một phần, định tuyến một phần, dán nhãn một phần — sau một lần tiến trình hỏng |
| **METER** | Kiểm thử tiêm lỗi cho việc giữ tồn, định tuyến và dán nhãn |
| **MUST** | 0 |
| **PLAN** | 0 (hậu điều kiện UC-03 POST-1, UC-04 POST-1, UC-07 POST-1) |

## 6.5 Độ sẵn sàng, khả năng mở rộng và khả năng bảo trì

#### QA-15 — Độ sẵn sàng trong ngày làm việc hoàn tất đơn
| | |
|---|---|
| **SCALE** | Tỉ lệ phần trăm số phút trong khoảng 06:00 tới 22:00 giờ địa phương mà việc nhận đơn, giữ tồn và nhặt hàng đều khả dụng |
| **METER** | Giám sát tổng hợp, đo hằng tháng |
| **MUST** | 99,5% |
| **PLAN** | 99,9%, và 99,95% vào năm ngày chiến dịch mỗi năm |

#### QA-16 — Năng lực ở mức đỉnh
| | |
|---|---|
| **SCALE** | Số đơn được nhận, giữ tồn, định tuyến và nhặt hàng trong một ngày mà không cần thêm nhân sự |
| **METER** | Thử tải trước ngày chiến dịch đầu tiên, rồi quan sát vào đúng ngày đó |
| **MUST** | 18.000 đơn/ngày (mức đỉnh lịch sử) |
| **PLAN** | 20.000 đơn/ngày (mục tiêu BO-6) |

#### QA-17 — Thời gian khôi phục
| | |
|---|---|
| **SCALE** | Số phút từ lúc phát hiện một sự cố ngoài kế hoạch tới lúc hoạt động hoàn tất đơn chạy lại được |
| **METER** | Diễn tập khôi phục thảm hoạ, hai lần mỗi năm |
| **MUST** | ≤ 60 phút, không mất đơn nào |
| **PLAN** | ≤ 20 phút, không mất đơn nào |

#### QA-18 — Chi phí để thêm một kênh hoặc một hãng vận chuyển
| | |
|---|---|
| **SCALE** | Số ngày-công lập trình viên để thêm một kênh bán nữa hoặc một hãng vận chuyển nữa |
| **METER** | Đo khi thêm kênh thứ tư ở bản 1.1 |
| **MUST** | ≤ 10 ngày-công, không sửa logic đơn hàng, tồn kho hay định tuyến |
| **PLAN** | ≤ 5 ngày-công (ràng buộc CO-6) |
| **Lý do** | NRG đã thêm bốn kênh trong 24 tháng và dự kiến còn thêm nữa. Chi phí tích hợp là một ràng buộc kinh doanh, không phải một sở thích kỹ thuật. |

---

# 7. Yêu cầu quốc tế hoá và bản địa hoá

| # | Yêu cầu |
|---|---|
| IL-1 | Hệ thống phải trình bày mọi giao diện cho nhân viên và khách hàng bằng tiếng Việt, kèm tiếng Anh chỉ cho giao diện Quản trị hệ thống. |
| IL-2 | Hệ thống phải lưu mọi số tiền theo đồng Việt Nam, không có phần thập phân, và phải trình bày chúng nhóm theo hàng nghìn dùng dấu chấm. |
| IL-3 | Hệ thống phải trình bày ngày theo dạng DD/MM/YYYY và giờ theo dạng 24 giờ. |
| IL-4 | Hệ thống phải lưu mọi dấu thời gian kèm độ lệch UTC tường minh và trình bày theo múi Asia/Ho_Chi_Minh. |
| IL-5 | Hệ thống phải nhận và lưu đúng dấu tiếng Việt ở mọi trường tên và địa chỉ, và phải truyền chúng tới các hãng vận chuyển theo đúng bảng mã mà từng hãng đòi hỏi. |
| IL-6 | Hệ thống phải sắp xếp văn bản tiếng Việt theo luật đối chiếu tiếng Việt, không theo thứ tự byte. |

Việc hỗ trợ thêm ngôn ngữ hay đơn vị tiền tệ khác không bắt buộc với các bản 1.0–2.0.
Điều này được ghi lại chứ không bỏ qua, vì một lần mở rộng ra ngoài Việt Nam sau này sẽ
làm IL-1 và IL-2 trở nên lỗi thời chứ không chỉ là thiếu sót.

---

# 8. Yêu cầu khác

| # | Yêu cầu |
|---|---|
| OR-1 | Hệ thống phải lưu giữ dữ liệu cá nhân theo đúng Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, và phải cho phép xoá dữ liệu cá nhân của một khách khỏi các đơn đã lưu trữ lâu dài khi có yêu cầu (DA-6). |
| OR-2 | Hệ thống phải cài đặt được vào một môi trường mới từ cấu hình đã đưa vào quản lý phiên bản, không có bước thủ công nào chưa được tài liệu hoá. |
| OR-3 | Hệ thống phải được bàn giao kèm sổ tay vận hành mà bộ phận hỗ trợ CNTT của NRG cần để chẩn đoán việc nhận đơn thất bại, việc công bố thất bại và các lô giao đứng im. |
| OR-4 | Hệ thống phải cho phép thực thi việc chuyển đổi dữ liệu lặp lại nhiều lần trên một môi trường không phải production mà không còn dư lại gì từ các lần chạy trước. |
| OR-5 | Mọi thư viện của bên thứ ba được dùng đều phải mang một giấy phép tương thích với việc dùng nội bộ có tính thương mại; không được dùng các giấy phép copyleft đòi phải phân phối mã nguồn. |

---

# Phụ lục A: Bảng thuật ngữ

| Thuật ngữ | Định nghĩa |
|---|---|
| **ATP** | Available to promise — số lượng của một SKU có thể hứa cho một đơn mới; xem BR-07 và Data Dictionary |
| **Backorder** — Chờ hàng | Một đơn đã nhận nhưng chưa hoàn tất được từ tồn kho hiện tại |
| **Carton** — Thùng | Một hộp vật lý trong một lô giao |
| **Cut-off** — Giờ chốt | Giờ trong ngày mà sau đó đơn xuất đi vào ngày làm việc kế tiếp; BR-10 |
| **Fulfillment center (FC)** — Trung tâm hoàn tất đơn | Một nhà kho mà từ đó đơn hàng được giao đi |
| **Landed cost** — Chi phí trọn gói | Tổng chi phí vận chuyển gồm cả phụ phí và chiết khấu; BR-12 |
| **Order** — Đơn hàng | Một lượt mua của khách nhận về từ một kênh bán |
| **Oversell** — Bán vượt tồn | Việc nhận một đơn cho số hàng không tồn tại |
| **Pick wave** — Đợt nhặt hàng | Một lô các lô giao được phát xuống sàn kho cùng lúc |
| **Rate shopping** — So giá vận chuyển | Việc so các hãng theo chi phí và mức dịch vụ trước khi mua nhãn |
| **Reservation** — Lượt giữ tồn | Một lượt giữ hàng đặt cho một dòng đơn hàng |
| **RMA** | Return merchandise authorization — lượt cho phép trả hàng |
| **Routing** — Định tuyến | Việc quyết định trung tâm nào giao những dòng nào |
| **Shipment** — Lô giao | Phần của một đơn được hoàn tất từ một trung tâm hoàn tất đơn |
| **Short pick** — Nhặt thiếu | Việc tìm thấy trên kệ ít đơn vị hơn số mà đầu việc nhặt đòi hỏi |
| **SKU** | Stock keeping unit — mã định danh duy nhất của một sản phẩm bán được |
| **Split order** — Đơn bị tách | Một đơn được hoàn tất từ nhiều hơn một trung tâm hoàn tất đơn |
| **3PL** | Third-party logistics — một hãng vận chuyển bên ngoài |
| **WISMO** | "Đơn của tôi đâu?" — một lượt khách liên hệ hỏi trạng thái đơn |

# Phụ lục B: Mô hình phân tích

| Hình | Mô hình | Vị trí |
|---|---|---|
| B-1 | Context diagram của hệ thống | `diagrams/use-case-diagram.png` (ranh giới và các actor ngoài) |
| B-2 | Mô hình dữ liệu logic (ERD) | *sẽ dựng ở khâu thiết kế; thực thể và quan hệ liệt kê ở §4.1* |
| B-3 | Use case diagram | `diagrams/use-case-diagram.png` · bản nguồn sửa được `diagrams/use-case-diagram.drawio` |
| B-4 | Mô hình trạng thái đơn hàng | Các trạng thái liệt kê ở mục *Order Status* trong Data Dictionary; chuyển tiếp cho bởi hậu điều kiện của các use case |
| B-5 | Mock-up màn hình | `mockups/` — xem R5 |

# Phụ lục C: Danh sách TBD

Một SRS không còn mục nào treo ở giai đoạn này thì không phải là đã xong; nó là chưa được
soi xét. Những mục dưới đây đều có theo dõi, có người chịu trách nhiệm và có hạn.

| # | Câu hỏi còn treo | Ảnh hưởng tới | Người chịu trách nhiệm | Hạn |
|---|---|---|---|---|
| TBD-1 | Cửa sổ trả hàng ở BR-14 tính từ lúc giao hay từ lúc xuất hàng? Hai bên liên quan trả lời khác nhau. | Return-1 | Quản lý CSKH | Tuần 7 |
| TBD-2 | Các trọng số định tuyến ở BR-06 dùng chung cho cả năm nhãn hàng ở bản 1.0, hay theo từng nhãn? | Route-2, Route-8 | Quản lý hoàn tất đơn | Tuần 6 |
| TBD-3 | Tồn an toàn ở BR-17 có áp theo từng kênh nữa không, hay chỉ theo trung tâm hoàn tất đơn? | Reserve-6, Sync-2 | Kiểm soát tồn kho | Tuần 7 |
| TBD-4 | Câu chữ chính xác hướng tới khách khi một hãng vận chuyển im lặng. | Track-4 | Quản lý nhãn hàng | Tuần 8 |
| TBD-5 | Lượt ghi sổ sang ERP ở SI-8 cần bóc tách theo nhãn hàng hay theo kênh, hay cả hai? | SI-8 | Tài chính | Tuần 7 |

# Phụ lục D: Ma trận truy vết yêu cầu

| Tính năng (R1 §2.1) | Mục SRS | Use case (R2) | Yêu cầu chức năng | Business rule (R3) | Mục tiêu |
|---|---|---|---|---|---|
| FE-1 Nhận đơn | 3.1 | UC-01 | Ingest-1 … Ingest-6 | BR-16 | BO-2 |
| FE-2 Sàng lọc và kiểm hợp lệ | 3.2 | UC-02 | Validate-1 … Validate-6 | BR-03, BR-04 | BO-1 |
| FE-3 Tồn kho và ATP | 3.3 | UC-03 | Reserve-1 … Reserve-7 | BR-01, BR-02, BR-04, BR-07, BR-08, BR-17 | BO-1 |
| FE-4 Đồng bộ tồn kho ra kênh | 3.4 | UC-13 | Sync-1 … Sync-7 | BR-07, BR-17, BR-20 | BO-1 |
| FE-5 Định tuyến và tách đơn | 3.5 | UC-04 | Route-1 … Route-8 | BR-01, BR-06, BR-08, BR-09, BR-10, BR-19 | BO-2, BO-3 |
| FE-6 Đợt nhặt hàng | 3.6 | UC-05 | Wave-1 … Wave-7 | BR-10, BR-13 | BO-3 |
| FE-7 Nhặt hàng có quét xác nhận | 3.7 | UC-06 | Pick-1 … Pick-8 | BR-07, BR-13, BR-17 | BO-2, BO-3 |
| FE-8 So giá và mua nhãn | 3.8 | UC-07 | Label-1 … Label-8 | BR-11, BR-12 | BO-5 |
| FE-9 Nhận sự kiện theo dõi | 3.9 | UC-08 | Event-1 … Event-8 | BR-09 | BO-4 |
| FE-10 Thông báo và trang theo dõi | 3.10 | UC-09 | Track-1 … Track-7 | BR-09 | BO-4 |
| FE-11 Quản lý ngoại lệ | 3.11 | UC-10 | Except-1 … Except-7 | BR-05, BR-09, BR-13 | BO-1, BO-2 |
| FE-12 Huỷ và sửa đơn | 3.12 | UC-11 | Cancel-1 … Cancel-7 | BR-05, BR-16 | BO-1 |
| FE-13 Trả hàng và nhập lại kho | 3.13 | UC-12 | Return-1 … Return-7 | BR-14, BR-15 | — |
| FE-14 Bảng điều khiển và đối soát | 3.14 | UC-14 | Dash-1 … Dash-8 | BR-06, BR-09, BR-18 | Tất cả |
