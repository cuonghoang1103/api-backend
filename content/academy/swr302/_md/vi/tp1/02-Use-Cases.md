# Use Cases
## cho Hệ thống Học vụ và Đăng ký môn (CARS)

Phiên bản 1.0 đã duyệt
Người soạn: **<Tên nhóm trưởng>**, Nhóm Phân tích nghiệp vụ — Nhóm <N>
Northern Regional University (NRU)
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
| **Sinh viên** | 12.000 người dùng. Lập kế hoạch thời khoá biểu, đăng ký, rút môn, xin vượt sĩ số, xem bản kiểm tra tiến độ và số dư của chính mình. |
| **Cố vấn học tập** | ~40 người dùng. Tư vấn sinh viên, ghi lại lời tư vấn, đặt và gỡ khoá chặn cố vấn. |
| **Nhân viên học vụ** | 14 người dùng. Xử lý các ngoại lệ ghi danh mà luật tự động không giải quyết được. |
| **Trưởng bộ môn** | 6 người dùng. Quyết định vượt sĩ số cho các lớp của bộ môn mình; huỷ lớp không đủ sĩ số. |
| **Phòng Đào tạo** | 2 người dùng. Mở, gia hạn và đóng cửa sổ đăng ký; sở hữu phần cấu hình quy chế học vụ. |
| **Cán bộ Tài chính** | 3 người dùng. Xem xét và giải quyết các khoá chặn tài chính phát sinh lúc đăng ký. |
| **Quản trị hệ thống** | 2 người dùng. Cấu hình luật chương trình đào tạo, ngành, trần tín chỉ và các tích hợp. |

### 1.2 Actor phụ (hệ thống ngoài)

| Actor | Mô tả |
|---|---|
| **Hệ thống Tài chính / Học phí** | Giữ số dư và lịch sử thanh toán của từng sinh viên. CARS chỉ đọc (EX-2). |
| **SSO của trường** | Xác thực mọi người dùng. CARS không giữ mật khẩu sinh viên nào (EX-8). |
| **Hệ thống Thời khoá biểu** | Công bố mỗi lớp học khi nào và ở đâu. CARS tiêu thụ và không bao giờ sửa (EX-3). |
| **Hệ quản lý học tập (LMS)** | Nhận các lượt ghi danh đã xác nhận; trả điểm cuối kỳ về cho bảng điểm. |
| **Dịch vụ Thông báo** | Gửi email và SMS tới sinh viên và nhân viên thay mặt CARS. |

> **Vì sao hệ thống thông tin sinh viên gốc không được liệt kê là actor.** CARS *trở
> thành* chính hệ thống đó lúc chuyển đổi; nó không phải một bên ngoài. Dữ liệu cũ là một
> lần chuyển đổi duy nhất, mô tả ở Vision & Scope §3.3, không phải một giao tiếp lúc chạy,
> nên nó xuất hiện ở SRS §4.4 chứ không phải ở đây.

---

## 2. Danh sách Use Case

| Mã | Actor chính | Actor phụ | Tên use case | Mô tả |
|---|---|---|---|---|
| UC-01 | Sinh viên | Hệ thống Thời khoá biểu | Tra cứu và duyệt danh mục môn học | Tìm lớp theo môn, khoa, giờ học hoặc giảng viên, kèm sĩ số còn lại theo thời gian thực |
| UC-02 | Sinh viên | — | Dựng thời khoá biểu dự kiến | Lắp một thời khoá biểu tạm trước khi mở đăng ký, có đánh dấu các xung đột |
| UC-03 | Sinh viên | Hệ thống Tài chính | Đăng ký vào một lớp học phần | Giao dịch ghi danh duy nhất — tiên quyết, sĩ số, xung đột giờ và tài chính cùng được quyết một lúc |
| UC-04 | CARS (sự kiện) | — | Kiểm môn tiên quyết và môn song hành | Đánh giá bảng điểm của sinh viên theo các luật chương trình đào tạo của một môn |
| UC-05 | CARS (sự kiện) | Hệ thống Tài chính | Đánh giá điều kiện tài chính | Quyết định tình trạng tài chính của sinh viên có cho phép ghi danh hay không |
| UC-06 | Sinh viên → Trưởng bộ môn | Dịch vụ Thông báo | Xin và quyết định vượt sĩ số | Một quy trình xin-và-quyết có theo dõi, kèm hạn 48 giờ |
| UC-07 | Sinh viên | Dịch vụ Thông báo | Vào danh sách chờ và được thăng suất | Xếp hàng cho một lớp đã đầy và được mời chỗ tự động khi có chỗ nhả ra |
| UC-08 | Sinh viên | — | Rút hoặc đổi lớp | Rời một lớp, hoặc đổi lớp này lấy lớp khác một cách nguyên tử, trong thời gian thêm/bớt môn |
| UC-09 | Sinh viên | — | Xem kiểm tra tiến độ tốt nghiệp thời gian thực | Thấy điều kiện chương trình nào đã đạt, đang học và còn thiếu |
| UC-10 | Sinh viên | Hệ thống Tài chính | Xem số dư tài khoản và lịch sử thanh toán | Thấy mình nợ bao nhiêu và đã trả bao nhiêu, không cần liên hệ phòng ban nào |
| UC-11 | Trưởng bộ môn | Dịch vụ Thông báo | Phát hiện và huỷ lớp không đủ sĩ số | Phát hiện các lớp dưới sĩ số tối thiểu và huỷ chúng kịp thời |
| UC-12 | Phòng Đào tạo | — | Mở, gia hạn hoặc đóng cửa sổ đăng ký | Điều khiển cửa sổ và các đợt ưu tiên của nó |
| UC-13 | Cố vấn học tập | — | Tư vấn sinh viên và quản lý khoá chặn cố vấn | Ghi lại lời tư vấn; đặt hoặc gỡ một khoá chặn ngăn ghi danh |
| UC-14 | Phòng Đào tạo | — | Xuất báo cáo ghi danh và sĩ số | Báo cáo về ghi danh, mức sử dụng sĩ số và hoạt động vượt sĩ số |

> **Truy vết về các tính năng ở Vision & Scope:** UC-01→FE-1 · UC-02→FE-2 · UC-03→FE-3 · UC-04→FE-4 · UC-05→FE-5 · UC-06→FE-6 · UC-07→FE-7 · UC-08→FE-8 · UC-09→FE-9 · UC-10→FE-10 · UC-11→FE-11 · UC-12→FE-12 · UC-13→FE-13 · UC-14→FE-14

---

## 3. Đặc tả Use Case

### UC-01 — Tra cứu và duyệt danh mục môn học

| | |
|---|---|
| **Mã và tên UC** | UC-01 — Tra cứu và duyệt danh mục môn học |
| **Người soạn** | Thành viên 2 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Sinh viên | **Actor phụ** | Hệ thống Thời khoá biểu |
| **Kích hoạt** | Sinh viên mở danh mục môn học, từ cổng thông tin hoặc từ trình lập kế hoạch ở UC-02. |
| **Mô tả** | Sinh viên tìm các lớp mở cho mình trong học kỳ tới, lọc theo môn, khoa, giờ học, giảng viên hoặc sĩ số còn lại. Danh mục là thao tác đọc có sản lượng lớn nhất hệ thống, và phần lớn tải của cửa sổ đăng ký rơi vào đây chứ không rơi vào bản thân việc ghi danh. |
| **Tiền điều kiện** | PRE-1: Sinh viên đã xác thực qua SSO của trường. <br> PRE-2: Danh mục lớp của học kỳ đang duyệt đã được công bố. |
| **Hậu điều kiện** | POST-1: Việc duyệt không làm thay đổi trạng thái ghi danh nào. <br> POST-2: Sĩ số còn lại hiển thị được tính lúc đọc theo BR-03, không cache quá 60 giây. |
| **Luồng chính** | **1.0** <br> 1. Sinh viên mở danh mục của học kỳ đang mở đăng ký. <br> 2. Hệ thống hiển thị các lớp mà chương trình của sinh viên cho phép, kèm mã môn, tên, tín chỉ, giảng viên, lịch học và sĩ số còn lại. <br> 3. Sinh viên áp dụng bộ lọc — khoa, ngày, giờ, sĩ số còn lại lớn hơn không, từ khoá. <br> 4. Hệ thống trả về các lớp đã lọc. <br> 5. Sinh viên mở một lớp để xem môn tiên quyết, môn song hành và mô tả đầy đủ. |
| **Luồng thay thế** | **1.1 — Duyệt khi chưa mở cửa sổ.** Danh mục duyệt được bất cứ lúc nào; hệ thống đánh dấu từng lớp "mở đăng ký từ <ngày>" thay vì đưa ra nút ghi danh. <br> **1.2 — Duyệt môn của chương trình khác.** Sinh viên bỏ bộ lọc theo chương trình; hệ thống hiện mọi lớp nhưng đánh dấu những lớp ngoài chương trình là không đủ điều kiện kèm lý do. <br> **1.3 — Tìm theo giảng viên.** Sinh viên tìm theo tên giảng viên và hệ thống trả về các lớp của giảng viên đó. |
| **Ngoại lệ** | **1.0.E1 — Thời khoá biểu chưa công bố.** Ở bước 2, hệ thống thời khoá biểu chưa có lịch học cho một lớp. Hệ thống vẫn liệt kê lớp đó kèm "giờ học sẽ xác nhận sau" và cho phép lập kế hoạch nhưng không cho ghi danh. <br> **1.0.E2 — Danh mục không truy cập được.** Dịch vụ danh mục không phản hồi. Hệ thống trình ra bản danh mục cache không cũ quá 15 phút, có ghi rõ độ cũ, thay vì một trang báo lỗi. <br> **1.0.E3 — Tìm không ra kết quả.** Hệ thống nói rõ bộ lọc nào đã loại hết và mời nới lỏng nó, thay vì hiện một danh sách rỗng. |
| **Độ ưu tiên** | Cao |
| **Tần suất dùng** | Cực lớn và dồn cục: ~12.000 sinh viên, trung bình 40 lượt đọc danh mục mỗi người trong cửa sổ 72 giờ, với ~65% rơi vào 30 phút đầu của mỗi đợt trong ba đợt. Đỉnh ~2.800 lượt đọc/giây. |
| **Business Rule** | BR-03, BR-06 |
| **Thông tin khác** | Chính use case này, không phải UC-03, mới quyết định hệ thống có sống sót qua cửa sổ đăng ký hay không (mục tiêu BO-1). Hệ cũ hỏng ở đúng đây: nó tính lại sĩ số cho từng dòng ở từng lượt yêu cầu. POST-2 cho phép một khoảng cache ngắn đúng để sĩ số đọc được rẻ mà không sai tới mức gây hậu quả. |
| **Giả định** | Hệ thống thời khoá biểu công bố danh mục lớp đầy đủ ít nhất 14 ngày trước khi mở cửa sổ đăng ký. |

### UC-02 — Dựng thời khoá biểu dự kiến

| | |
|---|---|
| **Mã và tên UC** | UC-02 — Dựng thời khoá biểu dự kiến |
| **Người soạn** | Thành viên 2 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Sinh viên | **Actor phụ** | — |
| **Kích hoạt** | Sinh viên thêm một lớp vào kế hoạch của mình từ danh mục. |
| **Mô tả** | Trước khi mở cửa sổ, sinh viên lắp một thời khoá biểu tạm và hệ thống nói trước cho họ mọi thứ có thể chặn nó — xung đột giờ, thiếu môn tiên quyết, trần tín chỉ, khoá chặn. **Đây là tuyến phòng thủ chính trước vấn đề tải P1:** một sinh viên đã lập kế hoạch chỉ cần vài giây trong cửa sổ, không cần vài phút. |
| **Tiền điều kiện** | PRE-1: Sinh viên đã xác thực. <br> PRE-2: Danh mục lớp của học kỳ đã được công bố. |
| **Hậu điều kiện** | POST-1: Kế hoạch không giữ chỗ nào và không tạo ra ưu tiên nào — nó là tạm thời, và hệ thống nói thẳng điều đó. <br> POST-2: Mọi điều kiện gây chặn mà phát hiện được trước cửa sổ đều được hiện ra trên kế hoạch. |
| **Luồng chính** | **2.0** <br> 1. Sinh viên thêm một lớp vào kế hoạch. <br> 2. Hệ thống kiểm kế hoạch xem có xung đột giờ học không (BR-07) và đánh dấu nếu có. <br> 3. Hệ thống đánh giá môn tiên quyết cho từng lớp trong kế hoạch qua UC-04 và đánh dấu những cái chưa đạt. <br> 4. Hệ thống cộng tổng tín chỉ dự kiến và so với trần tín chỉ của sinh viên (BR-04). <br> 5. Hệ thống hiển thị kế hoạch dưới dạng lưới theo tuần, mỗi cảnh báo gắn vào đúng lớp đã gây ra nó. <br> 6. Sinh viên chỉnh kế hoạch và lặp lại từ bước 1. |
| **Luồng thay thế** | **2.1 — Tìm lớp thay thế.** Sinh viên hỏi các lớp khác của cùng môn; hệ thống liệt kê kèm tình trạng xung đột và sĩ số, để có sẵn phương án dự phòng trước khi mở cửa sổ. <br> **2.2 — Lưu nhiều kế hoạch.** Sinh viên lưu tối đa ba kế hoạch có tên và so sánh cạnh nhau. <br> **2.3 — Đăng ký cả kế hoạch.** Khi cửa sổ mở, sinh viên gửi cả kế hoạch; hệ thống thực thi UC-03 cho từng lớp theo thứ tự sinh viên chọn và báo kết quả theo từng lớp. |
| **Ngoại lệ** | **2.0.E1 — Lớp trong kế hoạch bị huỷ.** Một lớp trong kế hoạch bị huỷ trước khi mở cửa sổ. Hệ thống đánh dấu nó trong kế hoạch và gợi ý lớp thay thế; nó không âm thầm gỡ bỏ. <br> **2.0.E2 — Môn tiên quyết chuyển thành chưa đạt.** Một điểm được nhập sau khi lập kế hoạch biến một môn tiên quyết đã đạt thành chưa đạt. Hệ thống đánh giá lại khi mở kế hoạch và đánh dấu. <br> **2.0.E3 — Vượt trần tín chỉ.** Kế hoạch vượt trần (BR-04). Hệ thống vẫn cho lưu kế hoạch nhưng đánh dấu là không đăng ký được và nói rõ vượt bao nhiêu tín chỉ. |
| **Độ ưu tiên** | Cao |
| **Tần suất dùng** | ~9.000 sinh viên dựng ít nhất một kế hoạch mỗi học kỳ; trung bình ~2,4 lần chỉnh sửa mỗi người. Tải trải đều trong hai tuần trước cửa sổ, và đó chính là mục đích. |
| **Business Rule** | BR-02, BR-04, BR-07, BR-14, BR-20 |
| **Thông tin khác** | POST-1 là một yêu cầu, không phải một dòng miễn trừ trách nhiệm. Trong buổi khai thác thứ 2, Phòng Đào tạo nói rõ rằng kế hoạch không được tạo ra lợi thế nào, nếu không sinh viên sẽ coi việc lập kế hoạch như một hàng chờ và tính công bằng của hệ thống đợt ưu tiên (BR-06) sẽ sụp đổ. |
| **Giả định** | Sinh viên sẽ lập kế hoạch trước nếu công cụ hữu dụng; lần chuyển lên mạng năm 2019 cho thấy họ có làm khi được đưa cho một công cụ. |

### UC-03 — Đăng ký vào một lớp học phần

| | |
|---|---|
| **Mã và tên UC** | UC-03 — Đăng ký vào một lớp học phần |
| **Người soạn** | Thành viên 2 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Sinh viên | **Actor phụ** | Hệ thống Tài chính / Học phí, Hệ quản lý học tập |
| **Kích hoạt** | Sinh viên yêu cầu ghi danh vào một lớp trong đợt đăng ký đang mở của mình. |
| **Mô tả** | Giao dịch lõi của cả hệ thống. Môn tiên quyết, môn song hành, sĩ số, xung đột giờ, trần tín chỉ, khoá chặn cố vấn và tình trạng tài chính đều được đánh giá **như một quyết định duy nhất ngay tại thời điểm sinh viên bấm nút**, và sinh viên được báo câu trả lời ngay lập tức. Điều này thay thế một quy trình mà sinh viên được ghi danh trước rồi các phép kiểm mới diễn ra sau đó, bằng tay, đôi khi hàng tuần sau. |
| **Tiền điều kiện** | PRE-1: Sinh viên đã xác thực và đợt ưu tiên của họ đang mở (BR-06). <br> PRE-2: Lớp tồn tại và thuộc học kỳ đang mở. <br> PRE-3: Sinh viên chưa ghi danh vào lớp này (BR-01). |
| **Hậu điều kiện** | POST-1: Sinh viên được ghi danh vào lớp và một chỗ bị chiếm, **hoặc** không có trạng thái nào thay đổi. Không bao giờ để sót lại một lượt ghi danh làm dở. <br> POST-2: Quyết định, lý do của nó và mọi luật đã được đánh giá đều được ghi lại cho lần thử đó, dù thành công hay thất bại. <br> POST-3: Khi thành công, lượt ghi danh được công bố sang hệ quản lý học tập. |
| **Luồng chính** | **3.0** <br> 1. Sinh viên yêu cầu ghi danh vào một lớp. <br> 2. Hệ thống xác minh đợt của sinh viên đang mở (BR-06) và không có khoá chặn cố vấn nào đang hiệu lực (BR-14). <br> 3. Hệ thống đánh giá môn tiên quyết và môn song hành qua UC-04. <br> 4. Hệ thống đánh giá điều kiện tài chính qua UC-05. <br> 5. Hệ thống kiểm xung đột giờ học với các lượt ghi danh hiện có của sinh viên (BR-07). <br> 6. Hệ thống kiểm tổng tín chỉ sau khi ghi danh so với trần tín chỉ (BR-04). <br> 7. Hệ thống chiếm một chỗ, với điều kiện sĩ số còn lại lớn hơn không (BR-03). <br> 8. Hệ thống ghi nhận lượt ghi danh, không nhả gì cả, và xác nhận với sinh viên. <br> 9. Hệ thống công bố lượt ghi danh sang hệ quản lý học tập. |
| **Luồng thay thế** | **3.1 — Lớp đầy, mời vào danh sách chờ.** Ở bước 7, sĩ số còn lại bằng không. Hệ thống mời vào danh sách chờ và nếu sinh viên đồng ý thì thực thi UC-07 thay vì ghi danh. <br> **3.2 — Lớp đầy, mời xin vượt sĩ số.** Ở bước 7, sĩ số còn lại bằng không và môn đó cho phép vượt sĩ số. Hệ thống mời tạo một yêu cầu vượt sĩ số (UC-06). <br> **3.3 — Cặp môn song hành.** Môn có môn song hành (BR-20). Hệ thống ghi danh sinh viên vào cả hai lớp như một giao dịch duy nhất, hoặc không lớp nào. <br> **3.4 — Ghi danh có nhân viên hỗ trợ.** Nhân viên học vụ thực hiện việc ghi danh thay sinh viên sau khi xử lý một ngoại lệ, kèm lý do được ghi lại. |
| **Ngoại lệ** | **3.0.E1 — Chưa đạt môn tiên quyết.** Ở bước 3, một môn tiên quyết chưa đạt (BR-02). Hệ thống từ chối, gọi tên đúng môn học và mức điểm yêu cầu, rồi mời tạo yêu cầu vượt sĩ số. Không chỗ nào bị chiếm. <br> **3.0.E2 — Khoá chặn tài chính.** Ở bước 4, số dư của sinh viên vượt ngưỡng (BR-05). Hệ thống từ chối, nói rõ số tiền còn nợ, và hướng sinh viên sang UC-10. Nó không tiết lộ chi tiết thanh toán ngoài con số số dư. <br> **3.0.E3 — Xung đột giờ.** Ở bước 5, lớp trùng giờ với một lượt ghi danh hiện có (BR-07). Hệ thống từ chối và gọi tên lớp bị trùng cùng khoảng giờ chồng nhau. <br> **3.0.E4 — Vượt trần tín chỉ.** Ở bước 6, lượt ghi danh sẽ vượt trần (BR-04). Hệ thống từ chối và nói rõ trần là bao nhiêu và tổng hiện tại là bao nhiêu. <br> **3.0.E5 — Mất chỗ vào tay một yêu cầu đồng thời.** Ở bước 7, một sinh viên khác chiếm chỗ cuối cùng trước. Hệ thống đọc lại sĩ số, thử lại một lần, rồi mời vào danh sách chờ theo 3.1. **Không chỗ nào bị cấp hai lần.** <br> **3.0.E6 — Hệ thống tài chính không truy cập được.** Ở bước 4, hệ thống tài chính không phản hồi trong 5 giây. Hệ thống **từ chối lượt ghi danh** kèm một nút thử lại, chứ không giả định là đủ điều kiện, và phát một cảnh báo tích hợp. <br> **3.0.E7 — Đang có khoá chặn cố vấn.** Ở bước 2 có một khoá chặn (BR-14). Hệ thống từ chối và gọi tên cố vấn cần liên hệ. |
| **Độ ưu tiên** | Cao |
| **Tần suất dùng** | ~12.000 sinh viên × ~5,6 lớp = ~67.000 lượt ghi danh thành công mỗi học kỳ, ~85% trong số đó nằm trong cửa sổ 72 giờ, với các đợt bùng đỉnh ~180 lượt thử ghi danh mỗi giây trong phút đầu của mỗi đợt. |
| **Business Rule** | BR-01, BR-02, BR-03, BR-04, BR-05, BR-06, BR-07, BR-14, BR-20 |
| **Thông tin khác** | POST-1 làm cho đây trở thành giao dịch đòi hỏi cao nhất hệ thống: bảy phép kiểm độc lập và một lần chiếm chỗ phải cùng thành công hoặc cùng thất bại, dưới mức tải nói trên. Ngoại lệ 3.0.E6 là một lựa chọn chính sách có chủ đích, chốt với Cán bộ Tài chính ở buổi 3 — CARS từ chối chứ không đoán, vì một sinh viên bị ghi danh nhầm trong khi đang nợ tiền thì gỡ ra khó hơn nhiều so với một sinh viên được mời thử lại. |
| **Giả định** | Hệ thống tài chính trả lời được một truy vấn xét điều kiện trong dưới 5 giây ở mức đỉnh; nếu không, thiết kế adapter ở RI-1 sẽ thay bằng một bản chụp theo đêm và đường ngoại lệ đổi theo. |

### UC-04 — Kiểm môn tiên quyết và môn song hành

| | |
|---|---|
| **Mã và tên UC** | UC-04 — Kiểm môn tiên quyết và môn song hành |
| **Người soạn** | Thành viên 2 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | CARS (hệ thống, được gọi) | **Actor phụ** | Nhân viên học vụ |
| **Kích hoạt** | Được UC-02 gọi lúc lập kế hoạch hoặc UC-03 gọi lúc ghi danh; hoặc nhân viên chạy hàng loạt để rà một khoá sinh viên. |
| **Mô tả** | Bộ máy luật thay thế 640 giờ-người mỗi học kỳ. Nó đánh giá bảng điểm của sinh viên theo các luật chương trình đào tạo gắn với một môn và trả về một quyết định kèm lý do. Nó cố ý là một use case tách khỏi UC-03 vì nó được gọi từ bốn chỗ và phải hành xử giống hệt nhau ở cả bốn. |
| **Tiền điều kiện** | PRE-1: Luật chương trình đào tạo của môn đó tồn tại và đã được hội đồng chương trình của khoa xác nhận (phụ thuộc D3). <br> PRE-2: Bảng điểm của sinh viên truy cập được. |
| **Hậu điều kiện** | POST-1: Kết quả là một quyết định Đạt, Chưa đạt hoặc Không xác định, không bao giờ là một lần cho qua âm thầm. <br> POST-2: Kết quả Chưa đạt phải gọi tên đúng luật chưa thoả và môn học sẽ thoả được nó. <br> POST-3: Kết quả Không xác định — thường là dữ liệu bảng điểm trước 2019, nằm ngoài giả định A3 — được chuyển tới Nhân viên học vụ chứ không giải quyết bằng cách đoán. |
| **Luồng chính** | **4.0** <br> 1. Hệ thống lấy các luật chương trình đào tạo gắn với môn học. <br> 2. Hệ thống lấy các môn đã hoàn thành và điểm của sinh viên. <br> 3. Hệ thống đánh giá từng luật tiên quyết, kể cả mức điểm tối thiểu nếu có quy định (BR-02). <br> 4. Hệ thống đánh giá các luật môn song hành theo các lượt ghi danh đang học và đang dự kiến của sinh viên (BR-20). <br> 5. Mọi luật đều thoả; hệ thống trả về Đạt. |
| **Luồng thay thế** | **4.1 — Môn tiên quyết đang học.** Một môn tiên quyết đang được học và chưa có điểm. Hệ thống trả về Đạt-tạm, cho phép ghi danh, và đánh giá lại khi điểm được nhập. <br> **4.2 — Môn tương đương.** Sinh viên đã qua một môn được ánh xạ là tương đương với môn tiên quyết; hệ thống chấp nhận sự tương đương và ghi lại đã dùng ánh xạ nào. <br> **4.3 — Tín chỉ chuyển đổi.** Môn tiên quyết đã được thoả bằng tín chỉ chuyển từ cơ sở đào tạo khác và đã được duyệt; hệ thống chấp nhận. <br> **4.4 — Rà hàng loạt.** Nhân viên chạy bộ máy này trên cả một khoá để tìm các lượt ghi danh không còn hợp lệ sau khi điểm được nhập. |
| **Ngoại lệ** | **4.0.E1 — Môn không có luật chương trình nào.** Ở bước 1, môn học không có luật nào. Hệ thống trả về Không xác định và phát một cảnh báo cấu hình — nó **không** trả về Đạt. Một luật vắng mặt là một luật bị thiếu, không phải một luật dễ dãi. <br> **4.0.E2 — Bảng điểm không đầy đủ.** Ở bước 2, bảng điểm của sinh viên có từ trước 2019 và đã bị đánh dấu (A3). Hệ thống trả về Không xác định và chuyển cho nhân viên. <br> **4.0.E3 — Môn tiên quyết tạm thời bị trượt.** Theo 4.1, điểm được nhập không thoả luật. Hệ thống phát một ngoại lệ ghi-danh-không-hợp-lệ cho nhân viên và báo cho sinh viên cùng cố vấn của họ **trước khi** bắt đầu học, nếu lịch cho phép. <br> **4.0.E4 — Môn song hành vòng tròn.** Hai môn khai nhau là môn tiên quyết thay vì môn song hành. Hệ thống trả về Không xác định và phát cảnh báo cấu hình có nêu tên cả hai môn. |
| **Độ ưu tiên** | Cao |
| **Tần suất dùng** | Được gọi khoảng 4 lần cho mỗi lượt thử ghi danh, tính cả lập kế hoạch và đăng ký: ~600.000 lượt đánh giá mỗi học kỳ, đỉnh ~700/giây. |
| **Business Rule** | BR-02, BR-20 |
| **Thông tin khác** | Ngoại lệ 4.0.E1 là dòng quan trọng nhất của cả đặc tả này. Quy trình cũ coi "không tìm thấy luật" là "không có môn tiên quyết", và đó là cách 61 sinh viên lọt vào những môn họ không đủ điều kiện. Trả về Không xác định biến một câu trả lời sai âm thầm thành một đầu việc nhìn thấy được. |
| **Giả định** | Ít nhất 90% số ngành diễn đạt được thành luật máy đánh giá được (A2); phần còn lại được xử lý dưới dạng Không xác định theo thiết kế, không phải do hỏng hóc. |

### UC-05 — Đánh giá điều kiện tài chính

| | |
|---|---|
| **Mã và tên UC** | UC-05 — Đánh giá điều kiện tài chính |
| **Người soạn** | Thành viên 3 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | CARS (hệ thống, được gọi) | **Actor phụ** | Hệ thống Tài chính / Học phí, Cán bộ Tài chính |
| **Kích hoạt** | Được UC-03 gọi lúc ghi danh; hoặc bởi lượt đánh giá lại hằng đêm với các lượt ghi danh hiện có. |
| **Mô tả** | Thay thế ba nhân viên mất hai tuần mỗi học kỳ để xuất và ghép dữ liệu thanh toán. CARS hỏi hệ thống tài chính xem tình trạng của sinh viên này có cho phép ghi danh không, và hành động theo câu trả lời ngay lập tức chứ không phải vài tuần sau. |
| **Tiền điều kiện** | PRE-1: Sinh viên tồn tại trong hệ thống tài chính. <br> PRE-2: Ngưỡng xét điều kiện và các luật ân hạn đã được cấu hình (BR-05). |
| **Hậu điều kiện** | POST-1: Kết quả là Đủ điều kiện, Bị chặn hoặc Không rõ — không bao giờ âm thầm là Đủ điều kiện. <br> POST-2: Kết quả Bị chặn ghi lại số tiền còn nợ tại thời điểm ra quyết định. <br> POST-3: CARS không lưu phương tiện thanh toán hay chi tiết giao dịch nào (EX-2, SRS CO-4). |
| **Luồng chính** | **5.0** <br> 1. Hệ thống hỏi hệ thống tài chính về số dư còn nợ và trạng thái khoá chặn của sinh viên. <br> 2. Hệ thống tài chính trả về một số dư và khoá chặn đăng ký tường minh nếu có. <br> 3. Hệ thống so số dư với ngưỡng đã cấu hình (BR-05). <br> 4. Số dư nằm trong ngưỡng và không có khoá chặn nào; hệ thống trả về Đủ điều kiện. |
| **Luồng thay thế** | **5.1 — Có kế hoạch trả góp đã duyệt.** Hệ thống tài chính báo có một kế hoạch trả góp đang hiệu lực và không vi phạm; hệ thống trả về Đủ điều kiện bất kể số dư. <br> **5.2 — Học bổng đang chờ áp dụng.** Một học bổng đã được duyệt nhưng chưa áp; hệ thống trả về Đủ điều kiện và ghi nhận rằng số dư dự kiến sẽ giảm. <br> **5.3 — Cán bộ Tài chính ghi đè.** Một Cán bộ Tài chính gỡ khoá chặn cho một sinh viên có tên, kèm lý do được ghi lại và một ngày hết hiệu lực. <br> **5.4 — Đánh giá lại hằng đêm.** Hệ thống đánh giá lại các sinh viên đã ghi danh và phát một ngoại lệ tài chính cho những ai đã rơi ra khỏi diện đủ điều kiện, chứ không tự động gỡ bỏ lượt ghi danh. |
| **Ngoại lệ** | **5.0.E1 — Số dư vượt ngưỡng.** Hệ thống trả về Bị chặn kèm số tiền còn nợ. <br> **5.0.E2 — Có khoá chặn đăng ký tường minh.** Hệ thống tài chính báo có khoá chặn bất kể số dư; hệ thống trả về Bị chặn kèm lý do khoá chặn. <br> **5.0.E3 — Hệ thống tài chính không truy cập được.** Hệ thống thử lại hai lần trong 5 giây, rồi trả về **Không rõ**, và UC-03 coi đó là một lần từ chối kèm nút thử lại. Nó không bao giờ giả định là Đủ điều kiện. <br> **5.0.E4 — Không tìm thấy sinh viên trong hệ thống tài chính.** Hệ thống trả về Không rõ và phát một ngoại lệ chất lượng dữ liệu cho Cán bộ Tài chính — chuyện này thường nghĩa là một bản ghi nhập học chưa được đồng bộ. |
| **Độ ưu tiên** | Cao |
| **Tần suất dùng** | Một lần cho mỗi lượt thử ghi danh (~90.000 mỗi học kỳ, tính cả các lần bị từ chối) cộng một lượt chạy lô hằng đêm trên toàn bộ sinh viên đã ghi danh (~12.000). |
| **Business Rule** | BR-05, BR-17 |
| **Thông tin khác** | Việc phân biệt Bị chặn với Không rõ tồn tại vì hai cái đòi hai cách phản ứng khác nhau: Bị chặn là vấn đề sinh viên phải giải quyết, Không rõ là vấn đề của nhà trường. Gộp chúng thành một lần từ chối sẽ bảo sinh viên đi trả một hoá đơn có thể không tồn tại. Luồng 5.4 cố ý phát một ngoại lệ thay vì gỡ ghi danh — loại một sinh viên khỏi lớp học vì một khoản thanh toán bị sót là một quyết định con người phải làm. |
| **Giả định** | Nhà cung cấp hệ tài chính mở ra một truy vấn số-dư-và-khoá-chặn (RI-1). Nếu không, lớp adapter sẽ thay bằng một bản chụp theo đêm và 5.0.E3 trở thành trường hợp thông thường với các khoản thanh toán trong ngày. |

### UC-06 — Xin và quyết định vượt sĩ số

| | |
|---|---|
| **Mã và tên UC** | UC-06 — Xin và quyết định vượt sĩ số |
| **Người soạn** | Thành viên 3 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Sinh viên (người xin), Trưởng bộ môn (người quyết) | **Actor phụ** | Dịch vụ Thông báo, Nhân viên học vụ |
| **Kích hoạt** | Một sinh viên xin một chỗ trong lớp đã đầy, hoặc trong lớp mà họ chưa đạt môn tiên quyết. |
| **Mô tả** | Thay thế một chuỗi email trung bình mất 6 ngày và không để lại bản ghi nào. Yêu cầu, lý do của nó, quyết định, người quyết và lý do quyết đều nằm trong một quy trình có theo dõi kèm hạn 48 giờ (BR-12). |
| **Tiền điều kiện** | PRE-1: Sinh viên đã xác thực và đợt của họ đang mở. <br> PRE-2: Lớp cho phép vượt sĩ số — một số lớp thì không, theo chính sách của khoa. <br> PRE-3: Sinh viên không có yêu cầu vượt sĩ số nào chưa quyết định cho cùng lớp đó. |
| **Hậu điều kiện** | POST-1: Mọi yêu cầu đều đi tới một quyết định được ghi lại là Duyệt, Từ chối hoặc Hết hạn — một yêu cầu không bao giờ bị bỏ rơi âm thầm. <br> POST-2: Một lần vượt sĩ số được duyệt dẫn tới một lượt ghi danh **hoặc** dẫn tới một lý do được ghi lại vì sao nó không thành. <br> POST-3: Người quyết, thời điểm quyết và lý do đều được ghi lại cho mọi kết cục (yêu cầu kiểm toán từ Phòng Đào tạo). |
| **Luồng chính** | **6.0** <br> 1. Sinh viên chọn lớp và nêu căn cứ xin — lớp đầy, chưa đạt tiên quyết, hoặc bắt buộc vì thời khoá biểu — kèm một lời giải trình. <br> 2. Hệ thống ghi nhận yêu cầu, đóng dấu thời gian, và bắt đầu đếm 48 giờ (BR-12). <br> 3. Hệ thống định tuyến yêu cầu tới Trưởng bộ môn sở hữu lớp đó (BR-11) và báo cho họ. <br> 4. Trưởng bộ môn mở yêu cầu và thấy trích lục bảng điểm của sinh viên, sĩ số hiện tại của lớp so với sức chứa, sức chứa phòng học, và mọi yêu cầu đang chờ khác của cùng lớp. <br> 5. Trưởng bộ môn duyệt, và ghi lại lý do. <br> 6. Hệ thống nâng sức chứa hiệu lực của lớp thêm một, chỉ dành cho sinh viên này, và ghi danh sinh viên qua UC-03 với cờ vượt sĩ số được áp. <br> 7. Hệ thống báo kết quả cho sinh viên. |
| **Luồng thay thế** | **6.1 — Từ chối.** Ở bước 5, Trưởng bộ môn từ chối kèm lý do; hệ thống báo cho sinh viên và mời vào danh sách chờ (UC-07) hoặc gợi ý lớp thay thế. <br> **6.2 — Quyết định theo lô.** Có nhiều yêu cầu cho cùng một lớp; Trưởng bộ môn thấy chúng cùng lúc kèm tác động tích luỹ lên sĩ số và quyết cả lô trong một thao tác. <br> **6.3 — Uỷ quyền.** Trưởng bộ môn uỷ quyền quyết định cho một người phó có tên trong một khoảng thời gian cố định; danh tính người được uỷ quyền được ghi là người quyết. <br> **6.4 — Rút yêu cầu.** Sinh viên rút yêu cầu trước khi có quyết định; hệ thống ghi nhận là Đã rút và dừng đồng hồ. |
| **Ngoại lệ** | **6.0.E1 — Quá hạn.** 48 giờ trôi qua mà chưa có quyết định (BR-12). Hệ thống leo thang lên Phòng Đào tạo, đánh dấu yêu cầu là Quá hạn, và tiếp tục đếm. Yêu cầu **không** bị tự duyệt và **không** bị tự từ chối — cả hai đều sẽ xoá mất đúng cái phán đoán học vụ mà quy trình này sinh ra để ghi lại. <br> **6.0.E2 — Đã duyệt nhưng không còn ghi danh được.** Ở bước 6, sinh viên từ lúc đó đã phát sinh một xung đột giờ hoặc một khoá chặn tài chính. Hệ thống ghi nhận việc đã duyệt, không ghi danh, báo cho cả hai bên kèm đúng thứ đang chặn, và giữ hiệu lực của lần duyệt đó trong 72 giờ. <br> **6.0.E3 — Vượt sức chứa phòng.** Việc duyệt sẽ đẩy sĩ số vượt quá sức chứa vật lý của phòng lấy từ hệ thống thời khoá biểu. Hệ thống cảnh báo Trưởng bộ môn **trước khi** quyết định được ghi lại và đòi phải xác nhận tường minh. <br> **6.0.E4 — Lớp bị huỷ khi yêu cầu còn treo.** Hệ thống đóng yêu cầu với trạng thái Vô hiệu, báo cho sinh viên, và gợi ý lớp thay thế. <br> **6.0.E5 — Cửa sổ đóng trước khi kịp ghi danh.** Quyết định duyệt về sau khi cửa sổ đăng ký đã đóng. Hệ thống chuyển việc ghi danh cho Nhân viên học vụ áp dụng bằng tay. |
| **Độ ưu tiên** | Cao |
| **Tần suất dùng** | ~2.300 yêu cầu mỗi học kỳ, ~78% trong số đó nằm trong cửa sổ 72 giờ; đỉnh ~90 yêu cầu/giờ. |
| **Business Rule** | BR-02, BR-03, BR-11, BR-12 |
| **Thông tin khác** | 6.0.E1 là quyết định khó nhất trong khâu khai thác yêu cầu. Phòng Đào tạo muốn tự duyệt khi quá hạn để bảo đảm SLA; các Trưởng bộ môn từ chối, với lý do khi đó phần mềm sẽ đang ban phát những ngoại lệ học vụ mà không ai đồng ý. Cách giải quyết — leo thang và tiếp tục đếm — làm cho việc quá hạn hiện ra trước mắt người sở hữu chính sách (phụ thuộc D2) mà hệ thống không phải bịa ra một quyết định học vụ. |
| **Giả định** | Một văn bản chính sách của trường ấn định SLA 48 giờ được ký trước bản 1.0 (D2). Không có nó thì BR-12 chỉ là một mốc mà không có thẩm quyền nào đứng sau. |

### UC-07 — Vào danh sách chờ và được thăng suất

| | |
|---|---|
| **Mã và tên UC** | UC-07 — Vào danh sách chờ và được thăng suất |
| **Người soạn** | Thành viên 3 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Sinh viên | **Actor phụ** | Dịch vụ Thông báo |
| **Kích hoạt** | Một sinh viên vào danh sách chờ của một lớp đã đầy, hoặc một chỗ được nhả ra trong lớp có danh sách chờ. |
| **Mô tả** | Phương án công bằng thay cho việc xin vượt sĩ số: một hàng chờ mà chính hệ thống tự vận hành. Khi một chỗ được nhả, sinh viên đủ điều kiện đứng đầu danh sách được mời tự động và có 24 giờ để nhận (BR-08, BR-09). |
| **Tiền điều kiện** | PRE-1: Lớp đã đầy (BR-03). <br> PRE-2: Sinh viên thoả mọi luật ghi danh trừ sĩ số — một sinh viên không học được môn đó thì không được chiếm một vị trí trong hàng chờ. |
| **Hậu điều kiện** | POST-1: Mỗi sinh viên giữ tối đa một vị trí chờ cho mỗi môn. <br> POST-2: Một chỗ được nhả ra chỉ được mời cho đúng một sinh viên tại một thời điểm; không bao giờ hai sinh viên được mời cùng một chỗ. <br> POST-3: Vị trí trong hàng chờ được xác định theo thời điểm vào hàng trong phạm vi đợt ưu tiên, và không bao giờ bị thay đổi ngoài các luật nêu ở đây. |
| **Luồng chính** | **7.0** <br> 1. Sinh viên xin vào danh sách chờ của một lớp đã đầy. <br> 2. Hệ thống xác minh mọi luật trừ sĩ số qua UC-04 và UC-05. <br> 3. Hệ thống thêm sinh viên vào hàng chờ và nói rõ vị trí của họ. <br> 4. Một chỗ được nhả — do rút môn (UC-08), do một lần vượt sĩ số bị huỷ, hoặc do một thay đổi hành chính. <br> 5. Hệ thống xác định sinh viên đầu tiên trong hàng mà vẫn thoả mọi luật. <br> 6. Hệ thống giữ chỗ cho sinh viên đó và báo cho họ, bắt đầu đếm đồng hồ 24 giờ của lời mời (BR-09). <br> 7. Sinh viên nhận; hệ thống ghi danh họ qua UC-03 và gỡ họ khỏi hàng chờ. |
| **Luồng thay thế** | **7.1 — Từ chối lời mời.** Sinh viên từ chối; hệ thống nhả chỗ ngay lập tức và mời sinh viên đủ điều kiện kế tiếp. <br> **7.2 — Rời hàng chờ.** Sinh viên tự rời; mọi người phía sau tiến lên. <br> **7.3 — Tự động nhận.** Sinh viên đã chọn tự động nhận lúc vào hàng; hệ thống ghi danh họ ngay ở bước 6 mà không chờ, rồi báo sau. <br> **7.4 — Không đủ điều kiện lúc được thăng suất.** Ở bước 5, sinh viên kế tiếp nay đã có xung đột hoặc khoá chặn; hệ thống bỏ qua họ **mà không gỡ họ khỏi hàng chờ**, báo cho họ vì sao bị bỏ qua, và mời chỗ đó cho sinh viên kế tiếp. |
| **Ngoại lệ** | **7.0.E1 — Lời mời hết hạn.** 24 giờ trôi qua không có phản hồi (BR-09). Hệ thống nhả chỗ, gỡ sinh viên khỏi hàng chờ, và báo cho họ. <br> **7.0.E2 — Mất chỗ giữa lúc mời và lúc nhận.** Lớp bị huỷ, hoặc sĩ số bị giảm, trong khi một lời mời còn treo. Hệ thống vô hiệu lời mời và báo cho sinh viên kèm lý do. <br> **7.0.E3 — Xung đột giờ lúc nhận.** Sinh viên nhận nhưng từ lúc đó đã ghi danh một lớp trùng giờ (BR-07). Hệ thống từ chối, gọi tên chỗ trùng, và mời chỗ đó cho sinh viên kế tiếp sau 1 giờ, cho sinh viên đầu một cơ hội rút lớp gây xung đột. <br> **7.0.E4 — Cửa sổ đăng ký đóng khi còn lời mời treo.** Các lời mời còn treo vẫn hiệu lực trọn 24 giờ của chúng; các lượt nhận sau khi cửa sổ đóng vẫn được hệ thống áp dụng, và hệ thống ghi lại rằng chúng diễn ra sau cửa sổ. |
| **Độ ưu tiên** | Trung bình |
| **Tần suất dùng** | ~3.400 lượt vào danh sách chờ mỗi học kỳ trên khoảng 290 lớp; ~1.100 lượt được thăng suất. |
| **Business Rule** | BR-03, BR-07, BR-08, BR-09 |
| **Thông tin khác** | POST-2 và ngoại lệ 7.0.E3 đi cùng nhau mới là thứ làm cho danh sách chờ trở nên công bằng chứ không chỉ là tự động. Khoảng dừng một giờ ở 7.0.E3 do đại diện Hội Sinh viên yêu cầu ở buổi 4: trường hợp phổ biến là sinh viên giữ tạm một lớp lót chỗ mà họ định rút ngay khi lớp thật sự mình muốn mở ra, và chuyển chỗ đi ngay lập tức chính là trừng phạt đúng cái hành vi mà danh sách chờ đáng ra phải khuyến khích. |
| **Giả định** | Sinh viên kiểm email của trường ít nhất mỗi ngày một lần trong đợt đăng ký; cửa sổ 24 giờ ở BR-09 dựa trên điều này và cấu hình được nếu hoá ra giả định sai. |

### UC-08 — Rút hoặc đổi lớp

| | |
|---|---|
| **Mã và tên UC** | UC-08 — Rút hoặc đổi lớp |
| **Người soạn** | Thành viên 3 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Sinh viên | **Actor phụ** | Hệ quản lý học tập, Dịch vụ Thông báo |
| **Kích hoạt** | Sinh viên rút một lớp đã ghi danh, hoặc đổi lớp này lấy lớp khác. |
| **Mô tả** | Rời một lớp sẽ nhả ra một chỗ, và đó chính là thứ nuôi danh sách chờ. **Đổi lớp** mới là trường hợp quan trọng: rút A rồi thêm B thành hai thao tác riêng có thể làm mất chỗ ở A mà không lấy được B, và đó đúng là cái bẫy sinh viên hay sa vào trong một cửa sổ 72 giờ. |
| **Tiền điều kiện** | PRE-1: Sinh viên đang ghi danh lớp đó. <br> PRE-2: Ngày hiện tại nằm trong một giai đoạn cho phép thao tác đó (BR-16). |
| **Hậu điều kiện** | POST-1: Một lần đổi lớp hoặc hoàn tất trọn vẹn, hoặc không thay đổi gì — sinh viên không bao giờ kết thúc mà không có lớp nào. <br> POST-2: Một chỗ được nhả ra sẽ được mời cho danh sách chờ trong vòng 60 giây (BR-08). <br> POST-3: Việc rút được công bố sang hệ quản lý học tập và được ghi nhận trên bảng điểm theo đúng giai đoạn mà nó diễn ra (BR-16). |
| **Luồng chính** | **8.0** <br> 1. Sinh viên chọn một lớp đã ghi danh và chọn Rút. <br> 2. Hệ thống nói rõ hệ quả ở giai đoạn hiện tại — không để lại dấu, hay ghi nhận là rút học phần (BR-16) — và hỏi xác nhận. <br> 3. Sinh viên xác nhận. <br> 4. Hệ thống gỡ lượt ghi danh và nhả chỗ. <br> 5. Hệ thống kích hoạt việc thăng suất danh sách chờ ở UC-07. <br> 6. Hệ thống công bố thay đổi sang hệ quản lý học tập. |
| **Luồng thay thế** | **8.1 — Đổi lớp.** Sinh viên chọn một lớp đã ghi danh và một lớp thay thế. Hệ thống kiểm toàn bộ lớp thay thế (UC-04, UC-05, BR-07, BR-04) **trước khi** nhả chỗ cũ, rồi thực hiện cả hai thao tác như một giao dịch duy nhất. Nếu lớp thay thế không qua được phép kiểm, lượt ghi danh gốc không bị đụng tới. <br> **8.2 — Rút một cặp môn song hành.** Rút một nửa của cặp môn song hành (BR-20) sẽ rút cả hai; hệ thống nói rõ điều đó trước khi xác nhận. <br> **8.3 — Rút có nhân viên hỗ trợ.** Nhân viên học vụ rút cho sinh viên sau khi giai đoạn đã đóng, kèm lý do và thẩm quyền được ghi lại. |
| **Ngoại lệ** | **8.0.E1 — Ngoài giai đoạn cho phép.** Đợt thêm/bớt môn đã đóng (BR-16). Hệ thống từ chối và giải thích quy trình rút học phần, vốn nằm ngoài CARS ở các bản 1.0–1.2. <br> **8.0.E2 — Lớp muốn đổi sang đã hết chỗ.** Ở luồng 8.1, lớp thay thế đầy lên giữa lúc kiểm và lúc thực hiện giao dịch. Hệ thống bỏ dở việc đổi, giữ nguyên lượt ghi danh gốc, và mời vào danh sách chờ của lớp muốn đổi sang. <br> **8.0.E3 — Rút sẽ phá vỡ một cặp môn song hành.** Sinh viên rút một nửa và từ chối rút nửa kia. Hệ thống từ chối và giải thích BR-20. <br> **8.0.E4 — Rút sẽ làm sinh viên xuống dưới số tín chỉ tối thiểu.** Hệ thống cảnh báo, nêu rõ hệ quả với học bổng hoặc tình trạng thị thực nếu có đánh dấu, và đòi xác nhận tường minh. Nó không từ chối — đó là quyết định của sinh viên. |
| **Độ ưu tiên** | Cao |
| **Tần suất dùng** | ~18.000 lượt rút và ~7.000 lượt đổi lớp mỗi học kỳ; ~60% nằm trong cửa sổ 72 giờ. |
| **Business Rule** | BR-04, BR-07, BR-08, BR-16, BR-20 |
| **Thông tin khác** | Luồng 8.1 tồn tại vì một lời phàn nàn cụ thể được ghi lại ở buổi 1: với hệ cũ, sinh viên phải rút trước rồi mới thêm được, và trong một cửa sổ đông đúc thì chỗ họ muốn thường xuyên bị người khác lấy mất trong đúng mấy giây ở giữa. Làm cho việc đổi lớp trở nên nguyên tử là thay đổi được Hội Sinh viên yêu cầu nhiều nhất. |
| **Giả định** | Lịch năm học định nghĩa các giai đoạn thêm/bớt môn và rút học phần cho từng học kỳ, và được cấu hình trước khi mở một cửa sổ. |

### UC-09 — Xem kiểm tra tiến độ tốt nghiệp thời gian thực

| | |
|---|---|
| **Mã và tên UC** | UC-09 — Xem kiểm tra tiến độ tốt nghiệp thời gian thực |
| **Người soạn** | Thành viên 2 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Sinh viên | **Actor phụ** | Cố vấn học tập |
| **Kích hoạt** | Sinh viên mở bản kiểm tra tiến độ của mình, hoặc cố vấn mở bản của một sinh viên từ hồ sơ tư vấn. |
| **Mô tả** | Hiện mọi điều kiện của chương trình sinh viên đang học ở trạng thái Đã đạt, Đang học hoặc Còn thiếu, tính từ chính bộ luật chương trình mà bộ máy ghi danh dùng. **Đây là use case xoá đi khoảng 4.800 lượt hỏi cố vấn mỗi học kỳ** (mục tiêu BO-6), và là mô hình đọc phức tạp nhất hệ thống. |
| **Tiền điều kiện** | PRE-1: Người xem đã xác thực và là chính sinh viên đó hoặc một cố vấn được phân công cho họ. <br> PRE-2: Chương trình của sinh viên có luật chương trình đã được xác nhận (D3). |
| **Hậu điều kiện** | POST-1: Bản kiểm tra phản ánh các lượt ghi danh và điểm tính tới đúng thời điểm xem; không phục vụ từ cache cũ quá 5 phút. <br> POST-2: Mọi điều kiện hiện ra đều nói rõ những môn cụ thể nào đã thoả nó. <br> POST-3: Điều kiện mà bộ máy không đánh giá nổi được hiện là **Cần xem lại** kèm lý do, không bao giờ là Đã đạt hay Còn thiếu. |
| **Luồng chính** | **9.0** <br> 1. Người xem mở bản kiểm tra. <br> 2. Hệ thống lấy chương trình của sinh viên và các nhóm điều kiện của nó — cơ sở ngành, chuyên ngành, tự chọn, đại cương, tổng tín chỉ. <br> 3. Hệ thống đánh giá từng nhóm theo các môn đã hoàn thành, các lượt ghi danh đang học và tín chỉ chuyển đổi đã duyệt. <br> 4. Hệ thống tính tỉ lệ hoàn thành tổng thể (BR-13). <br> 5. Hệ thống hiển thị từng nhóm kèm trạng thái, các môn đã thoả nó, và phần còn lại. <br> 6. Hệ thống hiển thị số tín chỉ còn lại và học kỳ dự kiến tốt nghiệp. |
| **Luồng thay thế** | **9.1 — Lập kế hoạch "nếu như".** Sinh viên thêm một môn dự kiến; hệ thống đánh giá lại và cho thấy môn đó sẽ thoả những điều kiện nào, **mà không thay đổi trạng thái nào**. <br> **9.2 — "Nếu như" đổi ngành.** Sinh viên chọn một chương trình khác; hệ thống đánh giá hồ sơ hiện có của họ theo luật của chương trình đó và cho thấy khoảng cách. <br> **9.3 — Màn hình của cố vấn.** Cố vấn thấy đúng bản kiểm tra đó cộng thêm ghi chú tư vấn và trạng thái khoá chặn, và xuất được ra để dùng trong buổi gặp. <br> **9.4 — Tính cả các lớp dự kiến.** Sinh viên đưa cả kế hoạch ở UC-02 vào; hệ thống đánh dấu kế hoạch đó sẽ đẩy tiến độ của những điều kiện nào. |
| **Ngoại lệ** | **9.0.E1 — Không đánh giá được một điều kiện.** Một luật tham chiếu tới một môn không còn tồn tại, hoặc hồ sơ sinh viên có từ trước 2019 (A3). Hệ thống hiện **Cần xem lại** kèm lý do và mời liên hệ cố vấn. Nó không bao giờ đoán. <br> **9.0.E2 — Luật chương trình đổi giữa chừng khoá học.** Luật theo năm quy chế của sinh viên khác với luật hiện hành. Hệ thống đánh giá theo **năm quy chế lúc sinh viên nhập học** và ghi rõ đã dùng năm nào. <br> **9.0.E3 — Điểm đang bị phúc khảo.** Một điểm còn tạm trong khi chờ phúc khảo. Hệ thống đánh giá theo điểm hiện tại, đánh dấu điều kiện bị ảnh hưởng là tạm, và gọi tên môn học đó. <br> **9.0.E4 — Phép tính vượt quá ngân sách thời gian.** Hệ thống hiện các nhóm điều kiện đã tính xong và đánh dấu phần còn lại là đang chờ kèm nút thử lại, thay vì làm hỏng cả trang. |
| **Độ ưu tiên** | Trung bình — hoãn sang bản 1.1 |
| **Tần suất dùng** | Giả định 70% sinh viên xem hai lần mỗi học kỳ, cộng các lượt cố vấn xem: ~19.000 lượt mỗi học kỳ, dồn vào trước các cửa sổ đăng ký. |
| **Business Rule** | BR-02, BR-13, BR-18, BR-20 |
| **Thông tin khác** | POST-3 và ngoại lệ 9.0.E1 tồn tại vì một bản kiểm tra tiến độ *sai* còn tệ hơn là không có: một sinh viên bị báo rằng mình đã thoả một điều kiện mà thực ra chưa chính là kiểu hỏng đã sinh ra lá đơn gửi Hiệu trưởng mô tả ở Vision & Scope §1.1. Ngoại lệ 9.0.E2 — đánh giá theo năm quy chế lúc nhập học — là một quy định của trường, không phải một sở thích thiết kế. |
| **Giả định** | Luật chương trình được phiên bản hoá theo năm quy chế và năm quy chế của sinh viên có được ghi lại. |

### UC-10 — Xem số dư tài khoản và lịch sử thanh toán

| | |
|---|---|
| **Mã và tên UC** | UC-10 — Xem số dư tài khoản và lịch sử thanh toán |
| **Người soạn** | Thành viên 2 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Sinh viên | **Actor phụ** | Hệ thống Tài chính / Học phí |
| **Kích hoạt** | Sinh viên mở màn hình tài khoản, hoặc đi theo đường dẫn từ một lần ghi danh bị từ chối (UC-03 ngoại lệ 3.0.E2). |
| **Mô tả** | Cho thấy sinh viên nợ gì, đã trả gì, và một khoá chặn hiện tại nghĩa là gì — nửa còn lại của mục tiêu BO-6. CARS hiển thị dữ liệu này; nó không sở hữu và không thu tiền (EX-2). |
| **Tiền điều kiện** | PRE-1: Người xem đã xác thực và chính là sinh viên đó. <br> PRE-2: Sinh viên tồn tại trong hệ thống tài chính. |
| **Hậu điều kiện** | POST-1: Không sinh viên nào thấy dữ liệu tài chính của sinh viên khác. <br> POST-2: CARS không lưu chi tiết phương tiện thanh toán nào. <br> POST-3: Mọi con số đều hiển thị thời điểm nó được lấy về từ hệ thống tài chính. |
| **Luồng chính** | **10.0** <br> 1. Sinh viên mở màn hình tài khoản. <br> 2. Hệ thống hỏi hệ thống tài chính về số dư, các khoản phải nộp và lịch sử thanh toán. <br> 3. Hệ thống hiển thị số dư hiện tại, các khoản cấu thành nó, các lần đã nộp, và ngưỡng đủ điều kiện đăng ký (BR-05). <br> 4. Nếu đang có khoá chặn, hệ thống nói rõ số tiền phải nộp để gỡ. <br> 5. Hệ thống dẫn tới kênh thanh toán của trường, vốn nằm ngoài CARS. |
| **Luồng thay thế** | **10.1 — Kế hoạch trả góp.** Có một kế hoạch đang hiệu lực; hệ thống hiện lịch trả và ngày tới hạn kế tiếp. <br> **10.2 — Học bổng đã áp.** Một học bổng làm giảm số dư; hệ thống hiện nó thành một dòng riêng. <br> **10.3 — Ước tính cho một kế hoạch thời khoá biểu.** Sinh viên hỏi kế hoạch ở UC-02 sẽ tốn bao nhiêu; hệ thống tính theo BR-17 và ghi rõ đó là **ước tính**, không phải một khoản phải nộp. |
| **Ngoại lệ** | **10.0.E1 — Hệ thống tài chính không truy cập được.** Hệ thống hiện các con số lấy về gần nhất kèm dấu thời gian và một dòng ghi rõ rằng chúng có thể đã cũ. Nó không hiện một trang trắng và không hiện số dư bằng không. <br> **10.0.E2 — Không tìm thấy sinh viên trong hệ thống tài chính.** Hệ thống nói rằng không lấy được tài khoản và đưa thông tin liên hệ Phòng Tài chính; nó phát một ngoại lệ chất lượng dữ liệu thay vì hiện số dư bằng không. <br> **10.0.E3 — Số dư đang bị khiếu nại.** Có một khiếu nại được đánh dấu; hệ thống hiện số tiền đang tranh chấp riêng ra và nói rõ khoá chặn vẫn còn cho tới khi giải quyết xong. |
| **Độ ưu tiên** | Trung bình — hoãn sang bản 1.1 |
| **Tần suất dùng** | ~12.000 sinh viên × ~3 lượt xem mỗi học kỳ, tăng vọt sau mỗi lần ghi danh bị từ chối vì khoá chặn tài chính. |
| **Business Rule** | BR-05, BR-17 |
| **Thông tin khác** | Ngoại lệ 10.0.E1 cùng một nguyên tắc với UC-09 POST-3: hiện một con số cũ kèm độ cũ của nó là trung thực, hiện số không là một lời nói dối sẽ sinh ra đúng cuộc gọi điện mà tính năng này ra đời để ngăn. |
| **Giả định** | Hệ thống tài chính mở ra cả các khoản phải nộp và các lần đã nộp, không chỉ một số dư ròng; nếu không thì luồng 10.1 và 10.2 thoái hoá thành một con số duy nhất. |

### UC-11 — Phát hiện và huỷ lớp không đủ sĩ số

| | |
|---|---|
| **Mã và tên UC** | UC-11 — Phát hiện và huỷ lớp không đủ sĩ số |
| **Người soạn** | Thành viên 3 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Trưởng bộ môn | **Actor phụ** | Phòng Đào tạo, Dịch vụ Thông báo, Hệ thống Thời khoá biểu |
| **Kích hoạt** | Phép kiểm sĩ số theo lịch chạy, hoặc một Trưởng bộ môn mở màn hình khả năng duy trì lớp. |
| **Mô tả** | Tìm ra các lớp sẽ không đạt sĩ số tối thiểu duy trì được **trước khi** mở đợt thêm/bớt môn, để sinh viên bị ảnh hưởng còn kịp dựng lại thời khoá biểu thay vì phát hiện việc huỷ lớp khi đã vào đợt được chín ngày. |
| **Tiền điều kiện** | PRE-1: Người dùng giữ vai Trưởng bộ môn của bộ môn sở hữu lớp, hoặc vai Phòng Đào tạo. <br> PRE-2: Sĩ số tối thiểu duy trì được đã cấu hình cho lớp hoặc kế thừa từ khoa (BR-15). |
| **Hậu điều kiện** | POST-1: Một lớp bị huỷ thì mọi sinh viên đã ghi danh đều được báo và mọi chỗ đều được nhả, hoặc việc huỷ không hoàn tất (BR-19). <br> POST-2: Việc huỷ ghi lại ai quyết định, lúc nào và vì sao. <br> POST-3: Lớp bị huỷ được gỡ khỏi danh mục và khỏi mọi kế hoạch sinh viên có tham chiếu tới nó. |
| **Luồng chính** | **11.0** <br> 1. Hệ thống đánh giá mọi lớp so với sĩ số tối thiểu duy trì được, 7 ngày trước khi mở thêm/bớt môn (BR-10, BR-15). <br> 2. Hệ thống liệt kê các lớp bị đánh dấu cho Trưởng bộ môn, kèm sĩ số hiện tại, mức tối thiểu, độ dài danh sách chờ và giảng viên. <br> 3. Trưởng bộ môn xem xét một lớp bị đánh dấu và chọn huỷ. <br> 4. Hệ thống cho thấy chính xác ai bị ảnh hưởng — sinh viên đã ghi danh, sinh viên đang chờ — và ai trong số đó sẽ rơi xuống dưới số tín chỉ tối thiểu do việc này. <br> 5. Trưởng bộ môn xác nhận và ghi lại lý do. <br> 6. Hệ thống nhả mọi lượt ghi danh, báo cho từng sinh viên bị ảnh hưởng kèm các phương án thay thế, và gỡ lớp khỏi danh mục (BR-19). <br> 7. Hệ thống báo cho Phòng Đào tạo và hệ thống thời khoá biểu rằng phòng học và khung giờ đã trống. |
| **Luồng thay thế** | **11.1 — Giữ lớp lại.** Trưởng bộ môn quyết định vẫn mở lớp dù dưới mức tối thiểu và ghi lại lý do; lớp được gỡ khỏi danh sách đánh dấu cho học kỳ đó. <br> **11.2 — Gộp lớp.** Hai lớp không đủ sĩ số của cùng một môn được gộp; hệ thống chuyển sinh viên từ lớp này sang lớp kia, kiểm xung đột giờ cho từng người (BR-07) và báo lại những ai nó không chuyển được. <br> **11.3 — Phòng Đào tạo chủ động huỷ.** Phòng Đào tạo huỷ xuyên các bộ môn, ví dụ khi một giảng viên không còn dạy được. |
| **Ngoại lệ** | **11.0.E1 — Một sinh viên không chuyển được khi gộp lớp.** Ở luồng 11.2, một sinh viên bị xung đột giờ với lớp còn lại. Hệ thống hoàn tất việc gộp cho tất cả những người khác và phát một ngoại lệ liệt kê những sinh viên phải xử lý riêng. Nó không âm thầm gỡ ghi danh của họ. <br> **11.0.E2 — Việc huỷ sẽ khiến một sinh viên không tốt nghiệp được.** Một sinh viên cần lớp này để hoàn thành chương trình ngay học kỳ này (BR-18). Hệ thống cảnh báo **trước** khi xác nhận, gọi tên các sinh viên đó, và đòi phải xác nhận tường minh. <br> **11.0.E3 — Gửi thông báo thất bại.** Thông báo tới một sinh viên không gửi được. Việc huỷ vẫn có hiệu lực nhưng hệ thống phát một đầu việc theo dõi cho phòng học vụ; không sinh viên nào bị bỏ mặc mà không được báo và không được ghi nhận. <br> **11.0.E4 — Xin huỷ sau khi đã bắt đầu dạy.** Hệ thống từ chối và chuyển yêu cầu tới Phòng Đào tạo, vì đây là một quyết định học vụ chịu quy định, nằm ngoài quy trình này. |
| **Độ ưu tiên** | Thấp — hoãn sang bản 1.2 |
| **Tần suất dùng** | ~1.400 lớp được đánh giá mỗi học kỳ; ~70 lớp bị đánh dấu; ~45 lớp bị huỷ. |
| **Business Rule** | BR-07, BR-10, BR-15, BR-18, BR-19 |
| **Thông tin khác** | Ngoại lệ 11.0.E2 mới là lý do use case này đáng được tự động hoá. Quy trình cũ tìm ra các lớp không đủ sĩ số muộn và huỷ chúng mà không kiểm xem ai cần chúng để tốt nghiệp; xác định được sinh viên đó *trước* khi ra quyết định chính là khác biệt giữa một hành động hành chính và một hành động học vụ. |
| **Giả định** | Sĩ số tối thiểu duy trì được là một chính sách cấp khoa, có thể ghi đè theo từng lớp, và được cấu hình trước khi mở cửa sổ. |

### UC-12 — Mở, gia hạn hoặc đóng cửa sổ đăng ký

| | |
|---|---|
| **Mã và tên UC** | UC-12 — Mở, gia hạn hoặc đóng cửa sổ đăng ký |
| **Người soạn** | Thành viên 2 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Phòng Đào tạo | **Actor phụ** | Dịch vụ Thông báo |
| **Kích hoạt** | Phòng Đào tạo cấu hình một cửa sổ, hoặc một ranh giới đợt theo lịch tới hạn. |
| **Mô tả** | Điều khiển ai được đăng ký và khi nào. Cửa sổ 72 giờ chạy theo ba đợt ưu tiên (BR-06); use case này là cách các đợt đó được định nghĩa, mở ra, gia hạn khi có sự cố và đóng lại. |
| **Tiền điều kiện** | PRE-1: Người dùng giữ vai Phòng Đào tạo. <br> PRE-2: Danh mục lớp của học kỳ đã tồn tại. |
| **Hậu điều kiện** | POST-1: Tại bất kỳ thời điểm nào, hệ thống nói được, với bất kỳ sinh viên nào, rằng đợt của họ có đang mở hay không — không có trạng thái mập mờ. <br> POST-2: Mọi thay đổi với một cửa sổ đều được ghi lại kèm người làm, thời điểm và lý do. <br> POST-3: Việc gia hạn cửa sổ không bao giờ làm vô hiệu ngược một lượt ghi danh đã thực hiện. |
| **Luồng chính** | **12.0** <br> 1. Phòng Đào tạo định nghĩa cửa sổ của học kỳ: thời điểm bắt đầu, kết thúc, và ba đợt ưu tiên kèm luật xét điều kiện của chúng (BR-06). <br> 2. Hệ thống kiểm rằng các đợt không chồng nhau và chúng phủ mỗi sinh viên đúng một lần. <br> 3. Phòng Đào tạo công bố cửa sổ; hệ thống báo cho sinh viên giờ đợt của mình. <br> 4. Ở mỗi ranh giới đợt, hệ thống mở đăng ký cho nhóm đó. <br> 5. Khi cửa sổ kết thúc, hệ thống đóng đăng ký và báo cáo kết quả — số lượt ghi danh, số lượt bị từ chối theo lý do, các yêu cầu vượt sĩ số còn treo và các danh sách chờ. |
| **Luồng thay thế** | **12.1 — Gia hạn khi có sự cố.** Phòng Đào tạo gia hạn cửa sổ; hệ thống báo cho mọi sinh viên bị ảnh hưởng và ghi lại lý do. <br> **12.2 — Mở lại cho một nhóm.** Một nhóm không đăng ký được — vì một lớp bị huỷ, vì một lỗi hệ thống. Phòng Đào tạo mở lại chỉ cho những sinh viên có tên. <br> **12.3 — Đóng khẩn cấp.** Phòng Đào tạo đóng đăng ký ngay lập tức; các giao dịch đang bay được phép hoàn tất, không giao dịch mới nào được bắt đầu. |
| **Ngoại lệ** | **12.0.E1 — Các đợt không phủ hết sinh viên.** Ở bước 2, một số sinh viên không rơi vào đợt nào. Hệ thống từ chối công bố và liệt kê họ ra. <br> **12.0.E2 — Các đợt chồng nhau.** Hệ thống từ chối công bố và gọi tên chỗ chồng, vì một chỗ chồng sẽ âm thầm phá huỷ tính công bằng mà BR-06 sinh ra để tạo. <br> **12.0.E3 — Mở cửa sổ khi chưa có danh mục.** Chưa có lớp nào được công bố cho học kỳ. Hệ thống từ chối mở. <br> **12.0.E4 — Xin gia hạn sau khi đã đóng.** Hệ thống coi đó là một lần mở lại (luồng 12.2), đòi phải nêu tên sinh viên, chứ không âm thầm mở lại cho tất cả mọi người. |
| **Độ ưu tiên** | Cao |
| **Tần suất dùng** | 2 cửa sổ mỗi năm, mỗi cửa sổ 3 đợt; theo lịch sử thì gia hạn 1–2 lần mỗi năm. |
| **Business Rule** | BR-06 |
| **Thông tin khác** | Sản lượng thấp nhưng hệ quả cao: mọi use case khác trong hệ thống đều đọc cái trạng thái mà use case này ghi. POST-1 chính là thứ làm cho bước 2 của UC-03 trả lời được trong vài mili giây ở mức tải đỉnh. |
| **Giả định** | Lịch năm học ấn định ngày mở cửa sổ; Phòng Đào tạo cấu hình các đợt bên trong khoảng đó. |

### UC-13 — Tư vấn sinh viên và quản lý khoá chặn cố vấn

| | |
|---|---|
| **Mã và tên UC** | UC-13 — Tư vấn sinh viên và quản lý khoá chặn cố vấn |
| **Người soạn** | Thành viên 3 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Cố vấn học tập | **Actor phụ** | Dịch vụ Thông báo |
| **Kích hoạt** | Một buổi tư vấn diễn ra, hoặc một chính sách đòi phải đặt khoá chặn lên một nhóm sinh viên. |
| **Mô tả** | Ghi lại sinh viên đã được tư vấn những gì và, ở nơi chính sách đòi hỏi, đặt một khoá chặn ngăn ghi danh cho tới khi sinh viên đã gặp cố vấn (BR-14). Khoá chặn chính là cơ chế làm cho việc tư vấn diễn ra trước khi đăng ký chứ không phải sau đó. |
| **Tiền điều kiện** | PRE-1: Cố vấn đã xác thực và được phân công cho sinh viên. <br> PRE-2: Sinh viên đang theo học một chương trình. |
| **Hậu điều kiện** | POST-1: Một khoá chặn hoặc tồn tại hoặc không; không có khoá chặn nửa vời. <br> POST-2: Cả việc đặt lẫn việc gỡ khoá chặn đều ghi lại người làm, thời điểm và lý do. <br> POST-3: Sinh viên luôn thấy được rằng có một khoá chặn và cần liên hệ ai, dù họ không xem được nội dung ghi chú tư vấn. |
| **Luồng chính** | **13.0** <br> 1. Cố vấn mở hồ sơ của sinh viên và xem bản kiểm tra tiến độ của họ (UC-09). <br> 2. Cố vấn ghi lại lời tư vấn đã đưa ra và kế hoạch đã thống nhất nếu có. <br> 3. Cố vấn gỡ khoá chặn cho cửa sổ đăng ký sắp tới. <br> 4. Hệ thống ghi nhận việc gỡ và báo cho sinh viên rằng họ đã có thể đăng ký. |
| **Luồng thay thế** | **13.1 — Đặt khoá chặn cho cả một nhóm.** Phòng Đào tạo hoặc một cố vấn đặt khoá chặn lên toàn bộ sinh viên một nhóm — ví dụ mọi sinh viên năm nhất trước cửa sổ đầu tiên của họ. <br> **13.2 — Đặt khoá chặn cá nhân.** Cố vấn đặt khoá chặn lên một sinh viên, chẳng hạn sau khi bị cảnh cáo học vụ. <br> **13.3 — Khoá chặn có hạn.** Một khoá chặn được đặt kèm ngày tự hết hiệu lực, để nó không sống lâu hơn mục đích của mình chỉ vì bị quên. <br> **13.4 — Sinh viên xem trạng thái khoá chặn.** Sinh viên thấy rằng có một khoá chặn, thấy phân loại lý do và thấy cố vấn cần liên hệ — nhưng không thấy nội dung ghi chú tư vấn. |
| **Ngoại lệ** | **13.0.E1 — Cố vấn không được phân công.** Cố vấn không phải người được phân công cho sinh viên này. Hệ thống từ chối và mời xin quyền truy cập tạm thời, có ghi lại yêu cầu đó. <br> **13.0.E2 — Khoá chặn được gỡ giữa lúc cửa sổ đang mở.** Sinh viên đang đăng ký dở. Việc gỡ có hiệu lực ngay lập tức; hệ thống báo cho sinh viên để họ tiếp tục mà không phải kiểm lại. <br> **13.0.E3 — Khoá chặn được đặt giữa lúc cửa sổ đang mở.** Hệ thống đặt khoá chặn nhưng **không** đảo ngược các lượt ghi danh đã thực hiện — khoá chặn chỉ hạn chế hành động trong tương lai. <br> **13.0.E4 — Mọi cố vấn đều không có mặt trước một cửa sổ.** Các khoá chặn vẫn còn nguyên và cửa sổ sẽ loại những sinh viên đó ra. Hệ thống báo số lượng cho Phòng Đào tạo 72 giờ trước cửa sổ, để một quyết định chính sách còn kịp được đưa ra. |
| **Độ ưu tiên** | Thấp — hoãn sang bản 1.2 |
| **Tần suất dùng** | ~40 cố vấn × ~55 sinh viên mỗi người, ~2 buổi gặp mỗi học kỳ: ~4.400 bản ghi tư vấn, ~6.000 giao dịch khoá chặn. |
| **Business Rule** | BR-14 |
| **Thông tin khác** | Ngoại lệ 13.0.E3 là một ranh giới có chủ đích: khoá chặn là một cánh cổng chặn việc ghi danh trong tương lai, không phải một lệnh huỷ hồi tố. Làm cho nó hồi tố sẽ trao cho một cố vấn quyền gỡ ghi danh của sinh viên giữa cửa sổ, điều mà không bên liên quan nào yêu cầu và Phòng Đào tạo đã bác thẳng ở buổi 2. |
| **Giả định** | Mỗi sinh viên tại một thời điểm có đúng một cố vấn được phân công. |

### UC-14 — Xuất báo cáo ghi danh và sĩ số

| | |
|---|---|
| **Mã và tên UC** | UC-14 — Xuất báo cáo ghi danh và sĩ số |
| **Người soạn** | Thành viên 2 | **Ngày soạn** | 17-09-2026 |
| **Actor chính** | Phòng Đào tạo | **Actor phụ** | Trưởng bộ môn, Phó hiệu trưởng |
| **Kích hoạt** | Người dùng mở một báo cáo, hoặc một báo cáo theo lịch được sinh ra. |
| **Mô tả** | Báo cáo về ghi danh, mức sử dụng sĩ số, hoạt động vượt sĩ số và các mục tiêu trong tài liệu Vision & Scope. Mục đích của nó là làm cho sáu mục tiêu nghiệp vụ đo được liên tục thay vì phải dựng lại vào cuối học kỳ. |
| **Tiền điều kiện** | PRE-1: Người dùng giữ một vai có quyền truy cập báo cáo. <br> PRE-2: Ít nhất một cửa sổ đăng ký đã kết thúc. |
| **Hậu điều kiện** | POST-1: Người dùng chỉ thấy những khoa và bộ môn mà vai của họ cho phép. <br> POST-2: Mọi con số đều nói rõ nó phủ giai đoạn nào và dữ liệu được làm mới lần cuối lúc nào. <br> POST-3: Không báo cáo nào tiết lộ chi tiết tài chính của một sinh viên cụ thể cho một người dùng khối học vụ. |
| **Luồng chính** | **14.0** <br> 1. Người dùng mở danh sách báo cáo và chọn một báo cáo cùng một giai đoạn. <br> 2. Hệ thống áp phạm vi dữ liệu của người dùng (POST-1). <br> 3. Hệ thống tính và hiển thị báo cáo, kèm các định nghĩa nhìn thấy được. <br> 4. Người dùng lọc theo khoa, bộ môn, chương trình hoặc lớp. <br> 5. Hệ thống tính lại và hiển thị lại. |
| **Luồng thay thế** | **14.1 — Đào sâu.** Người dùng bấm vào một con số và thấy các lớp hoặc lượt ghi danh nằm dưới nó. <br> **14.2 — Xuất dữ liệu.** Người dùng xuất màn hình hiện tại ra CSV. <br> **14.3 — Báo cáo cửa sổ theo lịch.** Hệ thống tự sinh bản tổng kết cửa sổ đăng ký khi một cửa sổ đóng và gửi cho Phòng Đào tạo và Phó hiệu trưởng. <br> **14.4 — Báo cáo hoạt động vượt sĩ số.** Một Trưởng bộ môn xem lại các quyết định vượt sĩ số của chính mình, thời gian quyết định so với SLA 48 giờ (BR-12) và tỉ lệ duyệt. |
| **Ngoại lệ** | **14.0.E1 — Không có dữ liệu cho giai đoạn đó.** Hệ thống nói rõ rằng không có dữ liệu cho giai đoạn đó, khác hẳn với việc hiện một con số bằng không. <br> **14.0.E2 — Phép tính quá hạn thời gian.** Hệ thống hiện các phần đã tính xong và đánh dấu phần còn lại kèm nút thử lại, thay vì làm hỏng cả trang. <br> **14.0.E3 — Xin báo cáo vượt ranh giới quyền.** Hệ thống chỉ trả về phần được phép và nói rõ rằng kết quả đã bị giới hạn bởi quyền hạn. |
| **Độ ưu tiên** | Thấp — hoãn sang bản 2.0 |
| **Tần suất dùng** | ~15 người dùng thường xuyên, mỗi người ~3 lượt xem/tuần, cộng 2 báo cáo cửa sổ theo lịch mỗi năm. |
| **Business Rule** | BR-03, BR-10, BR-12, BR-13 |
| **Thông tin khác** | Định nghĩa báo cáo phải **giống hệt** các thước đo thành công ở Vision & Scope §1.4. Nếu báo cáo hoạt động vượt sĩ số đo thời gian quyết định khác với thước đo thành công của BO-3, nhà trường không chứng minh được mục tiêu đã đạt. Đặc tả báo cáo nằm ở SRS §4.3. |
| **Giả định** | Việc tổng hợp gần-thời-gian-thực là chấp nhận được; các con số có thể trễ so với dữ liệu sống tới 15 phút. |

---

## 4. Use Case Diagram

Xem `diagrams/use-case-diagram.drawio` (sửa được) và `diagrams/use-case-diagram.png` (dùng cho SRS Phụ lục B).

**Cách đọc sơ đồ**

- Actor chính nằm bên **trái**, actor phụ (hệ thống) nằm bên **phải**.
- Hình chữ nhật là **ranh giới hệ thống**. Hệ thống tài chính, SSO, hệ thống thời khoá biểu và LMS nằm ngoài nó một cách có chủ đích (Vision & Scope §2.4).
- Mũi tên `«include»` đi **từ** use case cơ sở **tới** use case luôn luôn được thực thi.
- Mũi tên `«extend»` đi **từ** use case tuỳ chọn **tới** use case cơ sở mà nó mở rộng.

**Các quan hệ được thể hiện**

| Quan hệ | Từ | Tới | Vì sao |
|---|---|---|---|
| «include» | UC-03 Đăng ký vào một lớp | UC-04 Kiểm môn tiên quyết | Mọi lượt ghi danh đều đánh giá môn tiên quyết, luôn luôn |
| «include» | UC-03 Đăng ký vào một lớp | UC-05 Đánh giá điều kiện tài chính | Mọi lượt ghi danh đều đánh giá tài chính, luôn luôn |
| «include» | UC-02 Dựng thời khoá biểu dự kiến | UC-04 Kiểm môn tiên quyết | Việc lập kế hoạch luôn cảnh báo về môn tiên quyết |
| «include» | UC-08 Rút hoặc đổi lớp | UC-07 Thăng suất danh sách chờ | Một chỗ được nhả ra luôn kích hoạt việc thăng suất |
| «include» | UC-11 Huỷ một lớp | UC-08 Rút hoặc đổi lớp | Việc huỷ lớp luôn nhả mọi lượt ghi danh |
| «extend» | UC-06 Xin vượt sĩ số | UC-03 Đăng ký vào một lớp | Chỉ khi lớp đã đầy hoặc chưa đạt môn tiên quyết |
| «extend» | UC-07 Vào danh sách chờ | UC-03 Đăng ký vào một lớp | Chỉ khi lớp đã đầy |
| «extend» | UC-09 Kiểm tra tiến độ tốt nghiệp | UC-13 Tư vấn sinh viên | Chỉ khi một cố vấn xem lại tiến độ trong buổi tư vấn |
