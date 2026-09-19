# Tài liệu Vision and Scope
## cho Hệ thống Học vụ và Đăng ký môn (CARS)

Phiên bản 1.0 đã duyệt
Người soạn: **<Tên nhóm trưởng>**, Nhóm Phân tích nghiệp vụ — Nhóm <N>
Northern Regional University (NRU)
17 tháng 9 năm 2026

---

### Lịch sử sửa đổi

| Người | Ngày | Lý do sửa | Phiên bản |
|---|---|---|---|
| Nhóm BA, Nhóm <N> | 17-09-2026 | Bản nháp đầu sau vòng khai thác yêu cầu thứ 1 | 0.9 |
| Nhóm BA, Nhóm <N> | 17-09-2026 | Bản cơ sở được Phó hiệu trưởng phụ trách Đào tạo duyệt | 1.0 |

---

## 1. Yêu cầu nghiệp vụ

### 1.1 Bối cảnh

Northern Regional University (NRU) là một trường đại học công lập với **12.000 sinh viên
đang theo học** ở sáu khoa, mở khoảng **1.400 lớp học phần** mỗi học kỳ. Công tác quản lý
học vụ của trường từ năm 2012 tới nay chạy trên một hệ thống thông tin sinh viên tự xây,
nay đã mười bốn năm tuổi, vốn được thiết kế cho quy mô khoảng 3.000 sinh viên và cho việc
đăng ký làm tại quầy.

Năm 2019 trường đưa việc đăng ký lên mạng mà không thiết kế lại hệ thống bên dưới. Từ đó
tới nay, số sinh viên tăng 47%, số lớp tăng 38%, và cửa sổ đăng ký bị nén từ hai tuần
xuống **72 giờ** chia ba đợt ưu tiên. Mọi thứ còn lại trong phòng học vụ — các phép kiểm
chạy trước khi xác nhận một lượt ghi danh, và các quyết định về những lớp không đủ sĩ số
— vẫn làm bằng tay, y như hồi trường có 3.000 sinh viên.

Hai học kỳ liên tiếp kết thúc bằng một lá đơn khiếu nại chính thức gửi Hiệu trưởng: một
về việc hệ thống đăng ký sập, một về việc sinh viên tới năm cuối mới phát hiện mình bỏ
sót một điều kiện tốt nghiệp. Trường cấp kinh phí cho dự án này để đáp lại.

### 1.2 Cơ hội nghiệp vụ

Năm vấn đề tách bạch, đều được gọi tên trong tình hình mà phòng học vụ mô tả:

**P1 — Hệ thống sập dưới tải đăng ký.** Cửa sổ đăng ký 72 giờ mở lúc 08:00 cho từng đợt
ưu tiên. Đo ở học kỳ 2 năm 2025–26, **số phiên đăng nhập đồng thời đỉnh đạt 4.200**,
trong khi hệ thống bắt đầu xuống cấp từ mốc 1.800 và đã sập hẳn ở ba trên bốn đợt gần
nhất. Mỗi lần sập lại kéo dài cửa sổ, đẩy việc đăng ký lấn sang tuần học và buộc phải
sửa thời khoá biểu muộn.

**P2 — Điều kiện tiên quyết được kiểm bằng tay.** Nhân viên học vụ đối chiếu từng lượt
ghi danh với bảng điểm của sinh viên một cách thủ công. Đo trong hai học kỳ gần nhất,
việc này ngốn khoảng **640 giờ-người mỗi học kỳ**, và lỗi vẫn lọt: năm 2025–26 có 61 sinh
viên được vào một môn mà chưa qua môn tiên quyết, phải rút ra sau khi đã bắt đầu học.

**P3 — Yêu cầu vượt sĩ số xử lý trên giấy.** Sinh viên muốn một chỗ trong lớp đã đầy thì
gửi email cho bộ môn, bộ môn chuyển sang phòng học vụ, phòng học vụ hỏi giảng viên. Năm
2025–26 có **2.300 yêu cầu vượt sĩ số**, và thời gian trung bình tới lúc có quyết định là
**6 ngày** — đủ lâu để tới lúc có câu trả lời thì sinh viên thường đã chốt một thời khoá
biểu thay thế. Không có bất kỳ bản ghi nào về việc ai đã quyết cái gì, và vì sao.

**P4 — Tình trạng học phí được đối chiếu tách rời khỏi việc ghi danh.** Hệ thống tài
chính và hệ thống học vụ không nói chuyện với nhau. Ba nhân viên mất khoảng **hai tuần
mỗi học kỳ** để xuất dữ liệu, ghép và gõ lại tình trạng thanh toán trước khi có thể xác
nhận các lượt ghi danh. Có lúc sinh viên đã đóng tiền vẫn bị chặn, và có lúc sinh viên
còn nợ vẫn được ghi danh.

**P5 — Lớp không đủ sĩ số bị phát hiện muộn.** Không ai theo dõi một cách có hệ thống xem
lớp nào không tuyển đủ. Năm 2025–26, trung bình việc huỷ lớp được xác nhận **9 ngày sau
khi đợt thêm/bớt môn mở ra**, mà tới lúc đó thì các sinh viên bị ảnh hưởng đã dựng thời
khoá biểu quanh lớp đó rồi.

**P6 — Sinh viên không thấy được vị trí của chính mình.** Không có bản kiểm tra tiến độ
tốt nghiệp thời gian thực, cũng không có số dư tài khoản hiển thị. Nên sinh viên đi hỏi:
sáu văn phòng cố vấn của các khoa ghi nhận khoảng **4.800 lượt hỏi trong năm 2025–26**,
nội dung là sinh viên hỏi mình còn phải học gì, hoặc mình còn nợ bao nhiêu. Phần lớn
những câu đó trả lời được từ dữ liệu trường đã có sẵn.

### 1.3 Mục tiêu nghiệp vụ

| Mã | Mục tiêu nghiệp vụ | Mốc hiện tại (2025–26) | Mốc đích | Hạn |
|---|---|---|---|---|
| **BO-1** | Chấm dứt sập hệ thống trong cửa sổ đăng ký và chịu được tải đỉnh | 4.200 phiên đồng thời đỉnh; 3 lần sập trong 4 đợt | 6.000 phiên đồng thời, **không** lần sập nào, p95 phản hồi ≤ 2 giây | Cửa sổ đăng ký đầu tiên sau bản 1.0 |
| **BO-2** | Tự động hoá việc kiểm môn tiên quyết | 640 giờ-người/học kỳ; 61 lượt ghi danh sai | ≥ 98% lượt đăng ký được quyết định tự động; ≤ 64 giờ-người/học kỳ; **không** lượt ghi danh sai nào | Cuối học kỳ đầu tiên sau bản 1.0 |
| **BO-3** | Đưa mọi yêu cầu vượt sĩ số vào một quy trình có theo dõi và có hạn quyết định | 2.300 yêu cầu/học kỳ, trung bình 6 ngày, không có bản ghi kiểm toán | 100% được theo dõi; ≤ 48 giờ tới lúc có quyết định cho ≥ 90% yêu cầu | Cuối học kỳ đầu tiên sau bản 1.0 |
| **BO-4** | Đánh giá điều kiện tài chính tự động ngay lúc đăng ký | ~240 giờ-người/học kỳ cho việc ghép tay | ≤ 20 giờ-người/học kỳ; **không** sinh viên nào bị chặn sai hoặc được ghi danh sai | Cuối học kỳ đầu tiên sau bản 1.0 |
| **BO-5** | Phát hiện lớp không đủ sĩ số trước khi mở đợt thêm/bớt môn | 9 ngày sau khi mở | Được đánh dấu **7 ngày trước** khi mở thêm/bớt môn, tự động | Học kỳ thứ hai sau bản 1.0 |
| **BO-6** | Cho mọi sinh viên một bản kiểm tra tiến độ và số dư tài khoản thời gian thực | ~4.800 lượt hỏi cố vấn/học kỳ | Giảm ≥ 50% (≤ 2.400/học kỳ) | Học kỳ thứ hai sau bản 1.0 |

### 1.4 Thước đo thành công

| Thước đo | Cách đo | Nguồn dữ liệu | Tần suất báo cáo |
|---|---|---|---|
| Số phiên đồng thời đỉnh chịu được | Số phiên đã xác thực đồng thời lớn nhất mà p95 phản hồi vẫn ≤ 2 giây | Giám sát hiệu năng ứng dụng | Mỗi cửa sổ đăng ký |
| Độ sẵn sàng của hệ đăng ký | Số phút không khả dụng trong một cửa sổ ÷ tổng số phút của cửa sổ | Giám sát uptime | Mỗi cửa sổ đăng ký |
| Tỉ lệ quyết định tiên quyết tự động | (Số lượt đăng ký được quyết mà không cần nhân viên can thiệp ÷ tổng số lượt) × 100 | Nhật ký kiểm toán ghi danh của CARS | Mỗi học kỳ |
| Số lượt ghi danh sai | Số sinh viên bị rút sau khi đã bắt đầu học vì chưa đạt môn tiên quyết | Hồ sơ rút học phần của Phòng Đào tạo | Mỗi học kỳ |
| Thời gian quyết định vượt sĩ số | Trung vị và percentile 90 số giờ từ lúc gửi yêu cầu tới lúc ghi nhận quyết định | Bản ghi quy trình vượt sĩ số của CARS | Hằng tuần trong đợt đăng ký |
| Số giờ ghép dữ liệu tài chính bằng tay | Số giờ nhân viên tự ghi cho việc đối soát thanh toán | Bảng chấm công phòng học vụ | Mỗi học kỳ |
| Thời gian báo trước khi huỷ lớp | Số ngày giữa lúc một lớp bị đánh dấu không đủ sĩ số và lúc mở đợt thêm/bớt môn | Bản ghi lớp học phần của CARS | Mỗi học kỳ |
| Lượng câu hỏi tư vấn | Số lượt hỏi được gắn nhãn "tiến độ tốt nghiệp" hoặc "số dư tài khoản" | Nhật ký ticket của văn phòng cố vấn | Mỗi học kỳ |

**Những yếu tố ảnh hưởng lớn nhất tới thành công (nằm trong tầm kiểm soát của NRU):**
độ chính xác của các luật chương trình đào tạo được chuyển vào bộ kiểm tra tiến độ; mức
độ sẵn sàng của các trưởng bộ môn trong việc quyết định vượt sĩ số trong 48 giờ; chất
lượng dữ liệu bảng điểm lịch sử.

**Những yếu tố ngoài tầm kiểm soát của NRU:** việc nhà cung cấp hệ tài chính có chịu mở
API hay không; các thay đổi chương trình đào tạo ở cấp Bộ giữa chừng dự án; hành vi của
sinh viên trong phút đầu tiên mở đợt đăng ký.

### 1.5 Vision Statement

> **Cho** sinh viên, cố vấn học tập, nhân viên học vụ và trưởng bộ môn của Northern
> Regional University
> **những người** phải hoàn tất việc đăng ký cho 12.000 sinh viên trong một cửa sổ 72
> giờ, đồng thời kiểm môn tiên quyết, sĩ số và tình trạng tài chính cho từng lượt ghi
> danh,
> **Hệ thống Học vụ và Đăng ký môn (CARS)** là một nền tảng quản trị học vụ
> **giúp** quyết định mọi lượt ghi danh một cách tự động theo các luật chương trình đào
> tạo, sĩ số và tài chính ngay tại thời điểm sinh viên bấm nút, và cho mỗi sinh viên
> thấy tiến độ học tập cùng số dư tài khoản của chính mình một cách liên tục thay vì
> phải đi hỏi.
> **Khác với** hệ thống mười bốn năm tuổi hiện tại, nơi việc đăng ký là một hàng chờ hay
> sập và mọi phép kiểm phía sau đều do con người làm sau đó,
> **CARS** coi quyết định ghi danh là một giao dịch tự động duy nhất, để sinh viên biết
> câu trả lời ngay lập tức còn nhân viên chỉ phải xử lý các ngoại lệ.

### 1.6 Rủi ro nghiệp vụ

| Mã | Rủi ro | Mức độ | Xác suất | Biện pháp giảm thiểu |
|---|---|---|---|---|
| **RI-1** | Nhà cung cấp hệ tài chính không mở API, buộc phải tiếp tục ghép tay và làm hỏng BO-4 | Cao | Trung bình | Chốt lập trường của nhà cung cấp trong tuần 3; thiết kế giao tiếp tài chính nằm sau một lớp adapter để có thể thay bằng trao đổi tệp theo đêm mà không đụng tới logic ghi danh |
| **RI-2** | Dữ liệu bảng điểm và chương trình đào tạo lịch sử quá thiếu nhất quán để chạy kiểm tra tiến độ tự động | Cao | Cao | Rà soát dữ liệu luật chương trình và bảng điểm trước khi thiết kế; định nghĩa ngưỡng chấp nhận; với các nhóm sinh viên bị ảnh hưởng thì lùi về chế độ cố vấn xác nhận thay vì hiện một kết quả sai |
| **RI-3** | Tải đỉnh không được tái hiện trong khâu kiểm thử và cửa sổ chạy thật đầu tiên lại hỏng, phá huỷ niềm tin | Cao | Trung bình | Thử tải ở mức 1,5 lần đỉnh lịch sử trước cửa sổ đầu tiên; chạy cửa sổ đầu tiên theo ba đợt kèm một van tiết lưu thủ công |
| **RI-4** | Trưởng bộ môn không quyết định trong 48 giờ, nên BO-3 hỏng vì lý do phần mềm không sửa được | Trung bình | Cao | Cơ chế leo thang và hiển thị độ trễ ngay trong quy trình; Phòng Đào tạo rà các trường hợp vượt hạn hằng tuần; SLA là một quyết định chính sách của trường, được ghi nhận thành một phụ thuộc |
| **RI-5** | Cán bộ học vụ phản đối việc mất quyền quyết định vào tay một luật tự động và tiếp tục cấp ngoại lệ ngoài hệ thống | Trung bình | Trung bình | Mọi luật đều ghi đè được bởi một vai có tên, kèm lý do được ghi lại, nên quyền quyết định vẫn còn nhưng kiểm toán được |
| **RI-6** | Chương trình đào tạo thay đổi giữa chừng dự án làm vô hiệu các luật đã mã hoá | Trung bình | Trung bình | Luật chương trình là cấu hình, không phải mã; một thay đổi là một thay đổi dữ liệu |

### 1.7 Giả định và phụ thuộc nghiệp vụ

**Giả định**

- A1: NRU tiếp tục vận hành cửa sổ đăng ký 72 giờ chia ba đợt ưu tiên.
- A2: Điều kiện chương trình đào tạo diễn đạt được thành luật máy đánh giá được cho ít nhất 90% số ngành.
- A3: Dữ liệu bảng điểm trong hệ thống cũ là đầy đủ với sinh viên nhập học từ 2019 trở đi.
- A4: Việc định danh và xác thực sinh viên tiếp tục do hệ SSO hiện có của trường cung cấp.
- A5: Hệ thống thời khoá biểu và phân phòng vẫn là nơi có thẩm quyền về việc lớp học khi nào và ở đâu.
- A6: Mọi sinh viên đang theo học đều có một địa chỉ email của trường mà dịch vụ thông báo gửi tới được.

**Phụ thuộc**

- D1: Một giao tiếp tới hệ thống tài chính/học phí, hình thức phụ thuộc vào nhà cung cấp (RI-1).
- D2: Một văn bản chính sách của trường đã ký, ấn định SLA quyết định vượt sĩ số 48 giờ (BO-3).
- D3: Các hội đồng chương trình của khoa xác nhận các điều kiện tốt nghiệp đã mã hoá trước bản 1.0.
- D4: Một người quản lý dữ liệu từ Phòng Đào tạo, dành được 8 giờ mỗi tuần trong giai đoạn yêu cầu và chuyển đổi dữ liệu.

---

## 2. Phạm vi và giới hạn

### 2.1 Các tính năng chính

| Mã | Tính năng | Giải quyết |
|---|---|---|
| **FE-1** | Tra cứu danh mục môn học và duyệt lớp học phần | P1 |
| **FE-2** | Lập kế hoạch thời khoá biểu trước khi mở đăng ký ("giỏ hàng") | P1 |
| **FE-3** | Giao dịch ghi danh — một quyết định tự động duy nhất về tiên quyết, sĩ số và tài chính | P1, P2, P4 |
| **FE-4** | Bộ luật môn tiên quyết và môn song hành | P2 |
| **FE-5** | Đánh giá điều kiện tài chính ngay lúc đăng ký | P4 |
| **FE-6** | Quy trình xin và quyết định vượt sĩ số | P3 |
| **FE-7** | Quản lý danh sách chờ và tự động thăng suất | P3 |
| **FE-8** | Rút, đổi môn và xử lý đợt thêm/bớt môn | — |
| **FE-9** | Kiểm tra tiến độ tốt nghiệp thời gian thực | P6 |
| **FE-10** | Màn hình số dư tài khoản và lịch sử thanh toán của sinh viên | P6 |
| **FE-11** | Phát hiện lớp không đủ sĩ số và huỷ lớp | P5 |
| **FE-12** | Quản trị cửa sổ đăng ký và các đợt ưu tiên | P1 |
| **FE-13** | Hồ sơ cố vấn và các khoá chặn cố vấn | P6 |
| **FE-14** | Báo cáo ghi danh, sĩ số và khối lượng công việc | P5, tất cả |

### 2.2 Phạm vi bản phát hành đầu tiên (bản 1.0)

Bản 1.0 nhắm tới **BO-1, BO-2, BO-3 và BO-4** — tức bản thân cửa sổ đăng ký và ba phép
kiểm nằm phía sau nó. Nó phải chạy thật được cho trọn một cửa sổ đăng ký.

Bao gồm: **FE-1, FE-2, FE-3, FE-4, FE-5, FE-6, FE-7, FE-8, FE-12**.

Ranh giới phạm vi của bản 1.0:
- Cả sáu khoa ngay từ ngày đầu. Việc đăng ký không thể chạy thí điểm trên một phần sinh viên, vì các lớp được dùng chung giữa các khoa.
- Kiểm tra tiến độ tốt nghiệp (FE-9) **không** nằm trong bản này; phần kiểm môn tiên quyết (FE-4) thì có, và hai thứ dùng chung bộ luật chương trình đào tạo, nên FE-9 ở bản 1.1 phần lớn chỉ còn là cấu hình.
- Việc đánh giá điều kiện tài chính dùng bất kỳ giao tiếp nào mà nhà cung cấp mở ra (RI-1).

### 2.3 Phạm vi các bản phát hành tiếp theo

| Bản | Mốc | Nội dung |
|---|---|---|
| **1.1** | +1 học kỳ | **FE-9** kiểm tra tiến độ tốt nghiệp thời gian thực và **FE-10** màn hình số dư tài khoản. Đạt BO-6. |
| **1.2** | +2 học kỳ | **FE-11** phát hiện và huỷ lớp không đủ sĩ số; **FE-13** hồ sơ cố vấn và khoá chặn. Đạt BO-5. |
| **2.0** | +3 học kỳ | **FE-14** báo cáo và phân tích; đăng ký xét tốt nghiệp; cấp bảng điểm; quy trình chuyển ngành. |

### 2.4 Giới hạn và loại trừ

- **EX-1** CARS không thay thế hệ quản lý học tập. Nội dung môn học, bài tập và điểm do giảng viên nhập vẫn nằm ở đó; CARS chỉ tiêu thụ điểm cuối cùng.
- **EX-2** CARS không thay thế hệ thống tài chính/học phí. Nó đọc điều kiện đủ và không xử lý thanh toán, hoàn tiền hay học bổng.
- **EX-3** CARS không dựng thời khoá biểu và không phân phòng. Nó tiêu thụ thời khoá biểu đã công bố.
- **EX-4** CARS không quản lý tuyển sinh hay hồ sơ thí sinh. Một sinh viên tồn tại trong CARS kể từ lúc nhập học.
- **EX-5** CARS không quản lý hồ sơ nhân sự, hợp đồng khối lượng giảng dạy hay bảng lương.
- **EX-6** CARS không cấp bảng điểm chính thức hay bằng tốt nghiệp trong các bản 1.0–1.2.
- **EX-7** CARS không hỗ trợ đăng ký hộ — nhân viên đăng ký thay sinh viên — trừ qua đường vượt sĩ số đã được tài liệu hoá.
- **EX-8** CARS không thay thế hệ SSO của trường và không tự lưu kho mật khẩu sinh viên.

---

## 3. Bối cảnh nghiệp vụ

### 3.1 Hồ sơ các bên liên quan

| Bên liên quan | Giá trị lớn nhất | Thái độ | Mối quan tâm chính | Ràng buộc |
|---|---|---|---|---|
| **Phó hiệu trưởng phụ trách Đào tạo** (người tài trợ) | Không còn sự cố đăng ký nào tới tai Hiệu trưởng | Ủng hộ mạnh; sở hữu bài toán kinh doanh | BO-1 trên hết; một cửa sổ đăng ký nhìn thấy được và không sập | Ngân sách tối đa 950.000 USD; phải chạy thật kịp cửa sổ học kỳ 1 |
| **Phòng Đào tạo** | Luật học vụ được cưỡng chế nhất quán thay vì dựa vào trí nhớ | Ủng hộ nhưng giữ gìn quyền quyết định học vụ | Mọi quyết định tự động phải ghi đè được và kiểm toán được | Không thể sửa quy chế học vụ của trường cho vừa phần mềm |
| **Nhân viên học vụ** (14 người dùng) | 640 giờ kiểm tay mỗi học kỳ biến mất | Dè dặt — một số lo rằng vai trò co lại theo khối lượng công việc | Việc xử lý ngoại lệ phải thật sự dễ hơn, không chỉ là khác đi | Giờ làm thêm mùa cao điểm đã kịch trần hợp đồng |
| **Cố vấn học tập** (~40 người dùng) | Sinh viên tới gặp khi đã tự xem bản kiểm tra tiến độ của mình | Rất tiếp nhận; là nhóm hào hứng nhất | Độ chính xác của bản kiểm tra; khả năng ghi lại lời tư vấn và đặt khoá chặn | Hoãn sang bản 1.1; cần một màn hình chỉ-đọc ở bản 1.0 |
| **Trưởng bộ môn** (6 người dùng) | Quyết định vượt sĩ số về trong một hàng chờ thay vì một chuỗi email | Pha trộn — hoan nghênh tính minh bạch, phản đối SLA 48 giờ | Sĩ số lớp và tác động khối lượng công việc của từng quyết định | Khối lượng giảng dạy khiến thời gian hạn chế; SLA phụ thuộc vào chính sách trường (D2) |
| **Sinh viên** (12.000) | Việc đăng ký chạy được, và biết mình đang ở đâu | Hiện đang bất mãn và lên tiếng | Tốc độ và sự công bằng của cửa sổ đăng ký; độ chính xác của bản kiểm tra tiến độ | Được Hội Sinh viên đại diện với vai trò người bảo vệ sản phẩm |
| **Cán bộ Tài chính** (3 người dùng) | Hai tuần gõ lại dữ liệu mỗi học kỳ biến mất | Ủng hộ nhưng hoài nghi việc nhà cung cấp sẽ hợp tác | Tính đúng đắn của luật xét điều kiện; một vết kiểm toán rõ ràng | Bị ràng buộc bởi hợp đồng với nhà cung cấp hệ tài chính (RI-1) |
| **Vận hành CNTT** | Một nền tảng được hỗ trợ thay vì một hệ mười bốn năm tuổi | Trung lập; lo về hình dạng tải | Giám sát, năng lực, triển khai và lưu trữ dữ liệu | Phải chạy trong trung tâm dữ liệu hiện có và theo chính sách an ninh của trường |

### 3.2 Ưu tiên dự án

| Chiều | Động lực (nêu mục tiêu) | Ràng buộc (nêu giới hạn) | Bậc tự do (nêu khoảng cho phép) |
|---|---|---|---|
| **Tiến độ** | Bản 1.0 chạy thật kịp **cửa sổ đăng ký học kỳ 1** | Lịch năm học do quy định của Bộ ấn định và sẽ không dời | — |
| **Tính năng** | — | FE-1 … FE-8 và FE-12 là bắt buộc cho bản 1.0 | FE-7 danh sách chờ có thể ra ở dạng rút gọn nếu tiến độ bị đe doạ |
| **Chất lượng** | **Không lần sập nào trong đợt đăng ký** là tiêu chí chấp nhận của bài toán kinh doanh | Không được để một quyết định tự động cho phép bất kỳ lượt ghi danh sai nào | 90–95% số phép kiểm chấp nhận của người dùng phải đạt cho bản 1.0 |
| **Nhân sự** | — | Quy mô nhóm tối đa là 1 PM, 3 BA, 10 lập trình viên, 4 kiểm thử viên | Số BA có thể dao động từ 2 tới 3 trong giai đoạn làm yêu cầu |
| **Chi phí** | — | Tổng ngân sách dự án 950.000 USD | Vượt ngân sách tới 10% vẫn chấp nhận được mà không cần người tài trợ xem lại |

### 3.3 Cân nhắc khi triển khai

- **Môi trường.** CARS được triển khai vào trung tâm dữ liệu hiện có của trường, với năng lực cấp phát theo mức đỉnh của đợt đăng ký chứ không theo mức trung bình — hình dạng tải ở đây cực đoan và ngắn, và chính việc tính theo trung bình đã làm hỏng hệ thống cũ.
- **Chiến lược triển khai.** Khác với một kho hàng hay một chuỗi cửa hàng, việc đăng ký **không thể chạy thí điểm trên một phần dân số**: các lớp được dùng chung giữa các khoa, nên triển khai một phần sẽ chia sĩ số của cùng một lớp ra hai hệ thống. Vì thế bản 1.0 chạy thật cho cả 12.000 sinh viên trong một cửa sổ. Rủi ro do điều này tạo ra được quản lý bằng buổi tổng duyệt song song nói dưới đây, chứ không bằng cách chia giai đoạn.
- **Tổng duyệt.** Một cửa sổ đăng ký giả lập quy mô đầy đủ được chạy với sinh viên tình nguyện, hai tuần trước cửa sổ thật, ở mức 1,5 lần tải đỉnh dự kiến. Đây là một cổng chặn phát hành, không phải một phép kiểm thử.
- **Cửa sổ chuyển đổi.** Hệ thống cũ bị đóng băng trong 48 giờ trước khi cửa sổ mở. Dữ liệu ghi danh được chuyển sang và đối chiếu với các tổng kiểm soát trước khi gỡ đóng băng.
- **Chuyển đổi dữ liệu.** Hồ sơ sinh viên, bảng điểm từ 2019 trở đi, luật chương trình đào tạo và danh mục lớp được chuyển sang. Bảng điểm trước 2019 được chuyển ở chế độ chỉ-đọc và có đánh dấu, vì giả định A3 không phủ tới chúng.
- **Đào tạo.** Sinh viên không được đào tạo gì — một hệ thống đăng ký mà cần đào tạo là một hệ thống đã thất bại. Nhân viên học vụ và trưởng bộ môn được tập huấn nửa ngày theo từng khoa trước cửa sổ đầu tiên.
- **Hỗ trợ.** Trực mở rộng phủ trọn cửa sổ 72 giờ, phòng học vụ có người suốt thời gian đó, kèm một phương án dự phòng thủ công đã được tài liệu hoá cho một lượt ghi danh đơn lẻ.
- **Phương án lùi.** Hệ thống cũ vẫn đọc được và vẫn nhận ghi danh thủ công trong suốt cửa sổ đầu tiên. Nó chỉ bị gỡ bỏ sau khi đã có một cửa sổ trọn vẹn và thành công.
