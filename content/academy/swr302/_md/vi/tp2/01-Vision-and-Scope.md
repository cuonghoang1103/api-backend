# Tài liệu Vision and Scope
## cho Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)

Phiên bản 1.0 đã duyệt
Người soạn: **<Tên nhóm trưởng>**, Nhóm Phân tích nghiệp vụ — Nhóm <N>
Nova Retail Group (NRG)
17 tháng 9 năm 2026

---

### Lịch sử sửa đổi

| Người | Ngày | Lý do sửa | Phiên bản |
|---|---|---|---|
| Nhóm BA, Nhóm <N> | 17-09-2026 | Bản nháp đầu sau vòng khai thác yêu cầu thứ 1 | 0.9 |
| Nhóm BA, Nhóm <N> | 17-09-2026 | Bản cơ sở được người tài trợ dự án duyệt | 1.0 |

---

## 1. Yêu cầu nghiệp vụ

### 1.1 Bối cảnh

Nova Retail Group (NRG) là một công ty bán lẻ đa nhãn hàng, vận hành năm nhãn tiêu dùng
trải trên thời trang, đồ gia dụng và chăm sóc cá nhân, với khoảng 12.000 SKU đang hoạt
động. Tới năm 2024, NRG chủ yếu là doanh nghiệp bán tại cửa hàng, với một kho duy nhất ở
Thành phố Hồ Chí Minh và một storefront nhỏ trên web dùng chủ yếu như một cuốn catalogue.

Trong 24 tháng qua, NRG mở rộng mạnh sang bán hàng trực tuyến. Hiện họ bán qua **bốn kênh
bán** — storefront của chính mình cộng ba sàn TMĐT (Shopee, Lazada, TikTok Shop) — và vận
hành **ba trung tâm hoàn tất đơn (FC)** ở TP.HCM, Hà Nội và Đà Nẵng, giao hàng qua **bốn
hãng logistics bên thứ ba (3PL)** (GHN, GHTK, Viettel Post, J&T Express).

Phía hướng tới khách hàng của cuộc mở rộng này đã thành công: storefront xử lý tốt việc
duyệt hàng, khuyến mãi và thanh toán, còn sản lượng đơn trung bình mỗi ngày tăng từ khoảng
600 lên **4.500 đơn/ngày**, đỉnh gần **18.000 đơn/ngày** vào các ngày chiến dịch (9.9,
11.11, 12.12).

Khối vận hành phía sau thì không lớn theo kịp. Việc hoàn tất đơn vẫn được điều phối y như
hồi NRG chỉ có một kho và một kênh: một bảng tính cho tồn kho, phiếu nhặt hàng in ra, và
việc tải dữ liệu lên hãng vận chuyển bằng tay. Mỗi kênh, mỗi FC và mỗi hãng mới đều được
chắp thêm vào cái quy trình thủ công đó chứ không được tích hợp vào một hệ thống. Ban lãnh
đạo NRG đã nhận ra rằng nút thắt của tăng trưởng bây giờ là khâu vận hành hoàn tất đơn,
không phải nhu cầu thị trường.

### 1.2 Cơ hội nghiệp vụ

Khối vận hành hoàn tất đơn của NRG đang phân mảnh và thiếu phối hợp. Bốn vấn đề cụ thể
nổi trội:

**P1 — Tồn kho không được đồng bộ theo thời gian thực.** Số tồn được đẩy từ bảng tính của
kho sang từng kênh theo lô, hai lần mỗi ngày. Giữa hai lô, cùng một đơn vị hàng vật lý có
thể được bán trên storefront và trên hai sàn. Đo trong quý 2 năm 2026, **3,8% tổng số đơn
bị bán vượt tồn** — khoảng 170 đơn mỗi ngày phải huỷ, hoãn hoặc đổi hàng. Các án phạt của
sàn với việc người bán tự huỷ đơn đã hai lần đẩy điểm người bán Shopee của NRG xuống dưới
ngưỡng Người bán Ưu tiên.

**P2 — Việc định tuyến đơn làm thủ công và không tối ưu.** Nhân viên kho in mọi đơn ra,
chia phiếu bằng tay, và quyết định FC nào hoàn tất đơn nào dựa trên phán đoán cá nhân.
Không có logic định tuyến tự động, không xét tới độ phủ tồn kho, khoảng cách hay chi phí
vận chuyển, và không có khả năng tách một đơn ra nhiều FC. Riêng việc in và chia phiếu đã
ngốn của nhân viên khoảng **6 giờ mỗi ngày**, và đơn thường xuyên bị đẩy về một FC rồi FC
đó lại phải đặt hàng bù trong khi một FC khác đang có món đó trên kệ.

**P3 — Tích hợp 3PL là việc trao đổi tệp bằng tay.** Nhãn vận chuyển được mua trên cổng
web của từng hãng, còn sự kiện theo dõi quay về dưới dạng tệp CSV mà một nhân viên vận
hành tải lên hai lần mỗi ngày. Vì vậy trạng thái đơn mà khách nhìn thấy trễ so với thực
tế vật lý tới **12 giờ**, và việc mua nhãn được làm trên hãng nào tuỳ theo người vận hành
thích hãng nào, chứ không theo chi phí hay mức dịch vụ.

**P4 — Bộ phận CSKH quá tải vì câu hỏi "đơn của tôi đâu" (WISMO).** Vì trạng thái đã cũ
và không có trang tự tra cứu, **62% trong khoảng 900 ticket hỗ trợ mỗi ngày là WISMO** —
tức khoảng 560 ticket mỗi ngày mà một con người phải trả lời bằng cách mở ba cổng hãng vận
chuyển khác nhau.

Không gói phần mềm thương mại nào mà NRG đã đánh giá phủ được cả bốn kênh, cả ba FC và cả
bốn hãng vận chuyển Việt Nam mà không phải tuỳ biến nặng. Giải pháp được đề xuất là một Hệ
thống Quản lý Đơn hàng và Hoàn tất đơn tập trung, đặc tả quanh đúng mô hình vận hành thật
của NRG.

### 1.3 Mục tiêu nghiệp vụ

| Mã | Mục tiêu nghiệp vụ | Mốc hiện tại (Q2 2026) | Mốc đích | Hạn |
|---|---|---|---|---|
| **BO-1** | Giảm tỉ lệ bán vượt tồn bằng cách đồng bộ tồn kho giữa mọi kênh bán gần như thời gian thực | 3,8% số đơn | ≤ 0,5% số đơn | 6 tháng sau bản 1.0 |
| **BO-2** | Tự động hoá việc định tuyến đơn để con người can thiệp trở thành ngoại lệ, không còn là thông lệ | 0% tự động | ≥ 95% số đơn được định tuyến không cần chạm tay | 3 tháng sau bản 1.0 |
| **BO-3** | Rút ngắn thời gian từ lúc nhận đơn tới lúc xuất hàng | trung bình 26 giờ | trung bình ≤ 8 giờ | 6 tháng sau bản 1.0 |
| **BO-4** | Giảm lượng liên hệ WISMO nhờ trang tự tra cứu đơn hàng chính xác | ~560 ticket/ngày | Giảm ≥ 60% (≤ 224 ticket/ngày) | 6 tháng sau bản 1.0 |
| **BO-5** | Giảm chi phí vận chuyển trung bình trên mỗi đơn nhờ so giá hãng vận chuyển tự động | 38.000 VND/đơn | Giảm ≥ 12% (≤ 33.440 VND/đơn) | 9 tháng sau bản 1.0 |
| **BO-6** | Hấp thụ được đỉnh ngày chiến dịch mà không phải tăng nhân sự hoàn tất đơn | 18.000 đơn/ngày cần 22 nhân sự thời vụ | 20.000 đơn/ngày chỉ với nhân sự chính thức | Chiến dịch đầu tiên sau bản 1.0 |

### 1.4 Thước đo thành công

| Thước đo | Cách đo | Nguồn dữ liệu | Tần suất báo cáo |
|---|---|---|---|
| Tỉ lệ bán vượt tồn | (Số đơn bị huỷ hoặc giao thiếu do không đủ hàng ÷ tổng số đơn) × 100 | Bản ghi đơn hàng và ngoại lệ của OMFS | Hằng tuần |
| Tỉ lệ định tuyến tự động | (Số đơn được định tuyến mà người vận hành không ghi đè ÷ tổng số đơn) × 100 | Nhật ký kiểm toán định tuyến của OMFS | Hằng tuần |
| Thời gian từ nhận đơn tới xuất hàng | Trung vị và trung bình số giờ từ lúc nhận đơn tới lúc hãng quét lấy hàng | Mốc thời gian của OMFS + sự kiện từ hãng vận chuyển | Hằng ngày |
| Tỉ trọng ticket WISMO | Số ticket gắn nhãn WISMO ÷ tổng số ticket hỗ trợ | Việc gắn nhãn ở bộ phận hỗ trợ | Hằng tuần |
| Chi phí vận chuyển mỗi đơn | Tổng hoá đơn 3PL ÷ số đơn đã giao, theo tháng | Đối soát hoá đơn 3PL | Hằng tháng |
| Độ tươi của thông tin theo dõi | Percentile 95 của độ trễ giữa thời điểm sự kiện của hãng và lúc OMFS cập nhật trạng thái | Nhật ký nhận sự kiện của OMFS | Hằng ngày |

**Những yếu tố ảnh hưởng lớn nhất tới thành công (nằm trong tầm kiểm soát của NRG):**
chất lượng dữ liệu SKU gốc được chuyển vào OMFS; mức độ sẵn sàng của các giám sát FC
trong việc từ bỏ phiếu giấy; việc cung cấp kịp thời thông tin xác thực API của các hãng
vận chuyển.

**Những yếu tố ngoài tầm kiểm soát của NRG:** hạn mức gọi và các thay đổi phá vỡ tương
thích của API các sàn; mức độ sẵn sàng và độ chính xác sự kiện của API các hãng 3PL;
lượng truy cập ngày chiến dịch từ chính các sàn.

### 1.5 Vision Statement

> **Cho** các đội vận hành, kho và chăm sóc khách hàng của Nova Retail Group
> **những người** phải hoàn tất các đơn hàng đổ về từ bốn kênh bán, qua ba trung tâm hoàn
> tất đơn và bốn hãng vận chuyển,
> **Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)** là một nền tảng quản lý đơn hàng
> và hoàn tất đơn tập trung
> **giúp** duy trì một bức tranh tồn kho duy nhất theo thời gian thực, định tuyến và tách
> mọi đơn một cách tự động về trung tâm giao được nhanh nhất và rẻ nhất, đồng thời giữ
> trạng thái đơn chính xác từ đầu tới cuối mà không cần tải tệp bằng tay.
> **Khác với** mớ hỗn hợp bảng tính, phiếu nhặt hàng in ra và cổng web của từng hãng vận
> chuyển hiện nay,
> **OMFS** coi *đơn hàng* — chứ không phải kênh bán, cũng không phải nhà kho — là đơn vị
> công việc, để tồn kho, định tuyến, vận chuyển và liên lạc với khách đều được điều khiển
> từ một bản ghi có thẩm quyền duy nhất.

### 1.6 Rủi ro nghiệp vụ

| Mã | Rủi ro | Mức độ | Xác suất | Biện pháp giảm thiểu |
|---|---|---|---|---|
| **RI-1** | API của sàn thay đổi hoặc bóp băng thông mà không báo trước, làm hỏng việc nhận đơn hoặc đẩy tồn kho | Cao | Trung bình | Dựng một lớp adapter chống ăn mòn cho từng kênh; xếp hàng và thử lại kèm cảnh báo; thoả thuận với account manager của sàn về việc thông báo trước |
| **RI-2** | Dữ liệu SKU gốc và tồn kho quá bẩn để chuyển đổi, khiến OMFS khởi đầu với bức tranh tồn kho sai và không sửa được P1 | Cao | Cao | Chạy một đợt rà soát và làm sạch dữ liệu *trước* khi chuyển đổi; định nghĩa ngưỡng chấp nhận cho việc chuyển dữ liệu |
| **RI-3** | Nhân viên FC phản đối việc bỏ phiếu giấy, tiếp tục lách hệ thống | Trung bình | Trung bình | Đưa giám sát FC vào vai người bảo vệ sản phẩm ngay từ khâu khai thác yêu cầu; triển khai từng FC một; cơ chế quét xác nhận làm cho phiếu giấy trở nên không cần thiết chứ không phải bị cấm |
| **RI-4** | Một hãng 3PL không thể hoặc không chịu cung cấp API nhãn/theo dõi dùng được | Trung bình | Trung bình | Xác minh mức độ sẵn có của API với cả bốn hãng trong giai đoạn phân tích bản 1.0; giữ phương án thủ công cho hãng nào không có API, cô lập sau cùng một giao tiếp nội bộ |
| **RI-5** | Sản lượng ngày đỉnh vượt quá thông lượng thiết kế, gây ra sự cố còn tệ hơn quy trình thủ công hiện tại | Cao | Thấp | Đặt tường minh các thuộc tính chất lượng về tải đỉnh; thử tải ở mức 1,5 lần đỉnh lịch sử trước ngày chiến dịch đầu tiên |
| **RI-6** | Vượt chi phí hoặc trễ tiến độ dẫn tới huỷ dự án trước khi bản 1.0 mang lại lợi ích đo được | Trung bình | Trung bình | Phạm vi bản 1.0 chỉ nhắm hai mục tiêu giá trị nhất (BO-1, BO-2); các tính năng được xếp ưu tiên theo bảng tính ở Deliverable 7 |

### 1.7 Giả định và phụ thuộc nghiệp vụ

**Giả định**

- A1: Cả bốn sàn đều mở API lấy đơn và API cập nhật tồn kho theo các thoả thuận người bán hiện có của NRG.
- A2: NRG tiếp tục vận hành đúng ba FC trong suốt bản 1.0 và 1.1.
- A3: Số kiểm kê tồn kho vật lý ở mỗi FC chính xác trong phạm vi sai số 2% tại thời điểm chuyển đổi dữ liệu.
- A4: Storefront hiện có tiếp tục là nơi khách thanh toán; OMFS không thay thế nó.
- A5: Nhân viên kho đã có, hoặc sẽ được cấp, máy quét mã vạch cầm tay ở cả ba FC.

**Phụ thuộc**

- D1: Thông tin xác thực API và quyền truy cập môi trường thử từ cả bốn hãng 3PL, do Quản lý logistics của NRG lấy về.
- D2: Hệ thống ERP/kế toán hiện có phải nhận được một lượt ghi sổ hằng ngày về tài chính của các đơn đã giao.
- D3: Hạ tầng mạng và Wi-Fi đủ phủ cho máy quét cầm tay trong toàn bộ từng FC (là một dự án cơ sở vật chất, theo dõi riêng).
- D4: Người quản lý dữ liệu gốc phải dành được 8 giờ mỗi tuần trong giai đoạn yêu cầu và chuyển đổi dữ liệu.

---

## 2. Phạm vi và giới hạn

### 2.1 Các tính năng chính

| Mã | Tính năng | Giải quyết |
|---|---|---|
| **FE-1** | Nhận đơn đa kênh — kéo về và chuẩn hoá đơn từ storefront và mọi sàn vào một bản ghi đơn hàng duy nhất | P2, P4 |
| **FE-2** | Sàng lọc và kiểm tính hợp lệ của đơn — kiểm địa chỉ, thanh toán và gian lận trước khi đơn chiếm tồn kho | P1 |
| **FE-3** | Quản lý tồn kho và ATP (available-to-promise) thời gian thực trên các FC, giữ tồn ngay khi nhận đơn | P1, BO-1 |
| **FE-4** | Đồng bộ tồn kho ra các kênh — đẩy số lượng khả dụng trở lại mọi kênh bán mỗi khi có thay đổi | P1, BO-1 |
| **FE-5** | Định tuyến và tách đơn tự động — chọn FC hoàn tất từng dòng đơn bằng một luật chấm điểm cấu hình được | P2, BO-2, BO-3 |
| **FE-6** | Sinh và phát đợt nhặt hàng — gom các đơn đã định tuyến thành từng đợt nhặt theo FC | P2, BO-3 |
| **FE-7** | Nhặt và đóng gói có quét xác nhận — nhặt hàng điều khiển bằng máy cầm tay, có xác minh món hàng và gán thùng | P2, BO-3 |
| **FE-8** | So giá hãng vận chuyển và mua nhãn — so các hãng đủ điều kiện theo chi phí và mức dịch vụ, rồi mua nhãn qua API | P3, BO-5 |
| **FE-9** | Nhận sự kiện theo dõi từ hãng vận chuyển — nhận và áp dụng trạng thái của hãng một cách tự động | P3, BO-4 |
| **FE-10** | Thông báo cho khách và trang tự tra cứu đơn hàng | P4, BO-4 |
| **FE-11** | Quản lý ngoại lệ hoàn tất đơn — xử lý đặt hàng bù, tách đơn, giao thiếu và lỗi địa chỉ trong một bảng điều khiển duy nhất | P1, P2 |
| **FE-12** | Huỷ và sửa đơn trước khi xuất hàng | P1 |
| **FE-13** | Trả hàng và nhập lại kho (RMA) | — |
| **FE-14** | Bảng điều khiển hiệu suất hoàn tất đơn và đối soát hoá đơn 3PL | BO-5, tất cả |

### 2.2 Phạm vi bản phát hành đầu tiên (bản 1.0)

Bản 1.0 nhắm tới **BO-1 (bán vượt tồn), BO-2 (tự động định tuyến) và BO-3 (thời gian chu
kỳ)** — những mục tiêu gỡ nút thắt tăng trưởng — đồng thời dựng lên bản ghi đơn hàng mà
mọi tính năng sau này đều phụ thuộc vào.

Bao gồm: **FE-1, FE-2, FE-3, FE-4, FE-5, FE-6, FE-7**, cộng với việc mua nhãn thủ công
giữ nguyên như hiện tại.

Ranh giới phạm vi của bản 1.0:
- Chỉ kênh storefront và Shopee; Lazada và TikTok Shop theo sau ở bản 1.1.
- Cả ba FC ngay từ ngày đầu (định tuyến trở nên vô nghĩa nếu chỉ có một FC).
- Luật định tuyến cấu hình được bởi quản trị viên vận hành, nhưng chỉ với một công thức
  chấm điểm duy nhất; việc định tuyến nhiều công thức theo từng nhãn hàng thì hoãn lại.

### 2.3 Phạm vi các bản phát hành tiếp theo

| Bản | Mốc | Nội dung |
|---|---|---|
| **1.1** | +3 tháng | **FE-8** so giá hãng vận chuyển và mua nhãn qua API; **FE-9** nhận thông tin theo dõi tự động; hai kênh sàn còn lại (Lazada, TikTok Shop). Đạt BO-5 và tạo ra dữ liệu cần cho BO-4. |
| **1.2** | +6 tháng | **FE-10** thông báo cho khách và trang tự tra cứu; **FE-11** bảng xử lý ngoại lệ. Đạt BO-4. |
| **2.0** | +12 tháng | **FE-13** trả hàng và nhập lại kho; **FE-14** bảng điều khiển và đối soát hoá đơn 3PL; công thức định tuyến theo từng nhãn; giao thẳng từ nhà cung cấp như một FC ảo. |

### 2.4 Giới hạn và loại trừ

Những mục sau đây tường minh **không** nằm trong phạm vi của bất kỳ bản phát hành nào mà
tài liệu này phủ tới:

- **EX-1** OMFS không thay thế storefront trên web, catalogue, giá, khuyến mãi hay khâu thanh toán của nó.
- **EX-2** OMFS không thay thế hệ ERP/kế toán; nó chỉ ghi sổ sang đó.
- **EX-3** OMFS không phải hệ quản lý kho (WMS). Nó không quản lý vị trí ô kệ, việc xếp hàng vào kho, kiểm kê luân phiên hay xếp ca lao động bên trong một FC.
- **EX-4** OMFS không quản lý mua hàng, đơn đặt hàng nhà cung cấp hay việc nhận hàng vào kho.
- **EX-5** OMFS không xử lý thanh toán. Nó chỉ đọc trạng thái uỷ quyền từ cổng thanh toán.
- **EX-6** OMFS không cung cấp dự báo nhu cầu hay lập kế hoạch bổ sung hàng.
- **EX-7** Đơn tại cửa hàng (POS) và nhận hàng tại cửa hàng nằm ngoài phạm vi của các bản 1.0–2.0.
- **EX-8** OMFS không vận hành một cổng tài khoản cho khách; trang tự tra cứu (FE-10) chỉ vào được bằng một đường liên kết riêng cho từng đơn.

---

## 3. Bối cảnh nghiệp vụ

### 3.1 Hồ sơ các bên liên quan

| Bên liên quan | Giá trị lớn nhất | Thái độ | Mối quan tâm chính | Ràng buộc |
|---|---|---|---|---|
| **Giám đốc vận hành (COO)** (người tài trợ dự án) | Tăng trưởng không còn bị năng lực hoàn tất đơn giới hạn | Ủng hộ mạnh; sở hữu bài toán kinh doanh | BO-1 và BO-3 trên hết; ROI nhìn thấy được trong 2 quý | Ngân sách tối đa 1,2 triệu USD; bản 1.0 phải kịp trước chiến dịch 11.11 |
| **Quản lý hoàn tất đơn** | Định tuyến tự động thay cho các phán đoán hằng ngày; nhìn xuyên suốt cả ba FC | Ủng hộ nhưng hoài nghi việc phần mềm định tuyến giỏi hơn nhân viên lâu năm | Luật định tuyến phải soi được và ghi đè được; cách xử lý đơn bị tách | Không thể dừng vận hành để chuyển đổi; tối đa 4 giờ ngưng hoạt động |
| **Nhân viên kho** (3 FC, ~60 người dùng) | Không còn phải chia phiếu in; máy quét bảo họ nhặt gì | Dè dặt; sợ bị đo lường và sợ một hệ thống làm mình chậm đi | Tốc độ của màn hình nhặt hàng; dùng được khi đeo găng và trên máy cầm tay đời thấp | Máy Android cầm tay đời thấp; Wi-Fi chập chờn trong các lối đi FC; làm theo ca, ít chịu được đào tạo dài |
| **Kiểm soát tồn kho** | Một con số tồn kho có thẩm quyền thay vì phải đối chiếu bốn nguồn | Rất tiếp nhận — vai trò này tồn tại chỉ vì chính vấn đề hiện tại | Độ chính xác của ATP; khả năng kiểm toán từng lượt giữ và nhả tồn | Phải duy trì bảng tính cũ chạy song song trong tháng đầu |
| **Nhân viên CSKH** (~25 người dùng) | Thôi phải trả lời 560 ticket WISMO mỗi ngày bằng tay | Rất tiếp nhận | Trạng thái chính xác trên một màn hình; trả lời được mà không cần mở cổng hãng vận chuyển | Hoãn sang bản 1.2; cần một màn hình chỉ-đọc tạm thời ở bản 1.0 |
| **Quản lý nhãn hàng** (5 nhãn) | Ít lần huỷ đơn hơn, điểm người bán trên sàn được bảo vệ | Quan tâm nhưng không tham gia hằng ngày | SLA hoàn tất đơn và báo cáo theo từng nhãn | Muốn có luật định tuyến riêng theo nhãn, đã hoãn sang bản 2.0 |
| **Quản lý logistics** | Chi phí hãng vận chuyển trở thành một con số được quản lý thay vì sở thích của người vận hành | Ủng hộ; sở hữu BO-5 | Logic so giá; việc đối soát hoá đơn | Quyền truy cập API của hãng phụ thuộc vào việc đàm phán lại hợp đồng |
| **Vận hành CNTT / Quản trị hệ thống** | Bớt được các lượt chuyển tệp thủ công phải trông chừng | Trung lập; lo phải vận hành thêm một hệ thống nữa | Giám sát, cảnh báo, triển khai và lưu trữ dữ liệu | Phải chạy trên hạ tầng đám mây sẵn có của NRG và theo chính sách an ninh của tập đoàn |
| **Khách hàng** (gián tiếp) | Kỳ vọng giao hàng chính xác; tự tra cứu được | Hiện đang bất mãn | Trạng thái đúng; không bị huỷ đơn sau khi đã mua | Không được hỏi ý trực tiếp; do Nhân viên CSKH đại diện với vai trò người bảo vệ sản phẩm |

### 3.2 Ưu tiên dự án

| Chiều | Động lực (nêu mục tiêu) | Ràng buộc (nêu giới hạn) | Bậc tự do (nêu khoảng cho phép) |
|---|---|---|---|
| **Tiến độ** | Bản 1.0 chạy thật và ổn định **trước chiến dịch 11.11** | Đây là mốc cứng; chiến dịch sẽ không dời | — |
| **Tính năng** | — | FE-1 … FE-7 là bắt buộc cho bản 1.0 | 70–80% số tính năng ưu tiên cao phải ra ở bản 1.0; loại ưu tiên trung bình và thấp có thể dời sang 1.1 |
| **Chất lượng** | Tỉ lệ bán vượt tồn ≤ 0,5% là tiêu chí chấp nhận của bài toán kinh doanh | Tuyệt đối không chấp nhận mất đơn hay nhân đôi đơn | 90–95% số phép kiểm chấp nhận của người dùng phải đạt cho bản 1.0; 95–98% cho bản 1.1 |
| **Nhân sự** | — | Quy mô nhóm tối đa là 1 PM, 3 BA, 12 lập trình viên, 4 kiểm thử viên | Số BA có thể dao động từ 2 tới 3 trong giai đoạn làm yêu cầu |
| **Chi phí** | — | Tổng ngân sách dự án 1.200.000 USD | Vượt ngân sách tới 10% vẫn chấp nhận được mà không cần người tài trợ xem lại |

### 3.3 Cân nhắc khi triển khai

- **Môi trường.** OMFS được triển khai lên hạ tầng đám mây sẵn có của NRG. Không cần trung tâm dữ liệu mới hay phần cứng đặt tại chỗ, ngoài các máy quét cầm tay vốn đã nằm trong một dự án cơ sở vật chất riêng (D3).
- **Chiến lược triển khai.** Lần lượt từng FC, bắt đầu từ Đà Nẵng (sản lượng thấp nhất, ~8% số đơn) làm nơi thí điểm, rồi tới Hà Nội, rồi TP.HCM. Mỗi FC chạy OMFS song song với bảng tính cũ trong hai tuần đầu, với Kiểm soát tồn kho đối chiếu hằng ngày.
- **Chiến lược theo kênh.** Storefront trước, rồi tới Shopee, theo đúng thứ tự đó. Một kênh chỉ được chuyển hẳn sang sau khi độ chính xác đồng bộ tồn kho của nó được quan sát ở mức ≥ 99,5% trong năm ngày liên tiếp.
- **Cửa sổ chuyển đổi.** Tối đa 4 giờ ngưng hoạt động hoàn tất đơn, xếp vào tối Chủ nhật, ngoài mọi giai đoạn chiến dịch.
- **Chuyển đổi dữ liệu.** Dữ liệu SKU gốc và số dư tồn kho đầu kỳ được chuyển từ bảng tính cũ sau khi hoàn thành đợt làm sạch (RI-2). Đơn hàng lịch sử **không** được chuyển; bản ghi cũ vẫn đọc được trong 24 tháng.
- **Đào tạo.** Nhân viên kho không cần đào tạo trên lớp — luồng quét xác nhận được thiết kế để học ngay trên máy cầm tay trong dưới 15 phút (xem các thuộc tính chất lượng về khả dụng trong SRS). Quản lý hoàn tất đơn và Kiểm soát tồn kho được tập huấn nửa ngày tại từng FC.
- **Hỗ trợ.** Dùng bộ phận hỗ trợ CNTT tiêu chuẩn của NRG, kèm lịch trực nâng cao phủ 30 ngày đầu sau khi mỗi FC chuyển đổi và phủ mọi ngày chiến dịch.
- **Phương án lùi.** Trong hai tuần đầu chuyển đổi của mỗi FC, quy trình bảng tính cũ vẫn chạy được, nên một FC có thể quay lại trong vòng một ca làm việc.
