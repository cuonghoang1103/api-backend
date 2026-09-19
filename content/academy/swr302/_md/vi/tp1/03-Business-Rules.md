# Business Rules — Luật nghiệp vụ
## cho Hệ thống Học vụ và Đăng ký môn (CARS)

Phiên bản 1.0 đã duyệt
Người soạn: **<Tên nhóm trưởng>**, Nhóm Phân tích nghiệp vụ — Nhóm <N>
Northern Regional University (NRU)
17 tháng 9 năm 2026

---

### Lịch sử sửa đổi

| Người | Ngày | Lý do sửa | Phiên bản |
|---|---|---|---|
| Nhóm BA, Nhóm <N> | 17-09-2026 | Thu thập luật từ các buổi khai thác 1–4 và từ Quy chế học vụ | 0.9 |
| Nhóm BA, Nhóm <N> | 17-09-2026 | Phân loại, khử trùng lặp và tham chiếu chéo sang use case | 1.0 |

---

## 1. Mục đích và phạm vi

Tài liệu này là catalog các luật nghiệp vụ của NRU chi phối việc đăng ký môn và tiến độ
học tập. Một **business rule** là một chính sách, quy định, chuẩn mực, phép tính hoặc
định nghĩa tồn tại **độc lập với mọi phần mềm** — trong trường hợp của NRU thì phần lớn
chúng nằm trong Quy chế học vụ, và đó là lý do cột *Nguồn* ở đây quan trọng hơn so với
một dự án thương mại. Mỗi luật được ghi **một lần duy nhất**; use case và yêu cầu chức
năng chỉ tham chiếu tới nó **bằng mã**.

Bảng phân loại năm kiểu lấy từ Wiegers & Beatty, chương 9:

| Kiểu | Nghĩa |
|---|---|
| **Fact** | Một phát biểu luôn đúng về nghiệp vụ; một bất biến của lĩnh vực |
| **Constraint** | Điều phải hoặc không được xảy ra; nó hạn chế một hành động |
| **Action enabler** | Một điều kiện mà khi đúng thì kích hoạt một hành động |
| **Inference** | Tri thức mới suy ra từ các sự kiện đã có |
| **Computation** | Một công thức sinh ra một giá trị |

**Tĩnh hay Động** ghi lại việc *bản thân luật đó* có được dự kiến sẽ thay đổi hay không.
Luật động phải **cấu hình được**, không được biên dịch cứng vào mã. Trong một trường đại
học, sự phân biệt này quan trọng khác thường: quy chế được hội đồng sửa theo chu kỳ hằng
năm, và một luật muốn đổi phải ra bản phần mềm mới thì trong vòng một năm sẽ lạc hậu.

---

## 2. Danh mục luật

| Mã | Định nghĩa luật | Kiểu | Tĩnh/Động | Nguồn |
|---|---|---|---|---|
| **BR-01** | Tại một thời điểm, một sinh viên chỉ được giữ tối đa một lượt ghi danh trong cùng một lớp học phần. | Fact | Tĩnh | Phòng Đào tạo, buổi 2 |
| **BR-02** | Sinh viên chỉ được ghi danh một môn nếu đã hoàn thành mọi môn tiên quyết với ít nhất mức điểm tối thiểu quy định cho môn tiên quyết đó. | Constraint | Động | Quy chế học vụ §7.2 |
| **BR-03** | Sức chứa còn lại của một lớp = sĩ số công bố − số ghi danh đã xác nhận − số vượt sĩ số đã duyệt mà chưa ghi danh. | Computation | Tĩnh | Phòng Đào tạo, buổi 2 |
| **BR-04** | Sinh viên không được ghi danh vượt quá trần tín chỉ của năm học của mình trong một học kỳ. Trần mặc định là 24 tín chỉ. | Constraint | Động | Quy chế học vụ §5.1 |
| **BR-05** | Sinh viên có công nợ vượt ngưỡng đăng ký, hoặc đang mang một khoá chặn tài chính tường minh, không được ghi danh cho tới khi gỡ được khoá chặn đó. | Action enabler | Động | Cán bộ Tài chính, buổi 3; Quy chế học vụ §11.4 |
| **BR-06** | Cửa sổ đăng ký mở theo ba đợt ưu tiên, thứ tự: sinh viên năm cuối, rồi sinh viên năm hai và năm ba, rồi sinh viên năm nhất. | Fact | Động | Phòng Đào tạo, buổi 1 |
| **BR-07** | Sinh viên không được giữ hai lượt ghi danh có giờ học trùng nhau dù chỉ một phần. | Constraint | Tĩnh | Phòng Đào tạo, buổi 2 |
| **BR-08** | Khi một chỗ trong lớp có danh sách chờ được nhả ra, nó được mời cho sinh viên đứng cao nhất trong danh sách chờ đó mà vẫn thoả mọi luật ghi danh khác. | Action enabler | Tĩnh | Phòng Đào tạo, buổi 2 |
| **BR-09** | Lời mời từ danh sách chờ hết hạn sau 24 giờ kể từ lúc phát ra, sau đó chỗ được mời cho sinh viên đủ điều kiện kế tiếp. | Constraint | Động | Phòng Đào tạo, buổi 2 |
| **BR-10** | Một lớp bị coi là "không đủ sĩ số" khi số ghi danh đã xác nhận thấp hơn sĩ số tối thiểu duy trì được, tính tại mốc kiểm 7 ngày trước khi mở đợt thêm/bớt môn. | Inference | Động | Các Trưởng bộ môn, buổi 3 |
| **BR-11** | Chỉ Trưởng bộ môn sở hữu lớp đó, hoặc người được họ uỷ quyền có tên, mới được duyệt vượt sĩ số cho lớp đó. | Constraint | Tĩnh | Quy chế học vụ §7.6 |
| **BR-12** | Một yêu cầu vượt sĩ số phải có quyết định được ghi nhận trong vòng 48 giờ kể từ lúc gửi. | Constraint | Động | Chính sách của trường (đang chờ ký — phụ thuộc D2) |
| **BR-13** | Tỉ lệ hoàn thành chương trình = số tín chỉ đã tích luỹ cho ngành ÷ tổng tín chỉ ngành yêu cầu × 100. | Computation | Tĩnh | Quy chế học vụ §9.1 |
| **BR-14** | Sinh viên đang mang khoá chặn cố vấn còn hiệu lực không được ghi danh vào bất kỳ lớp nào cho tới khi một cố vấn có thẩm quyền gỡ khoá. | Constraint | Động | Quy chế học vụ §6.3 |
| **BR-15** | Sĩ số tối thiểu duy trì được của một lớp là 15 sinh viên, cấu hình được theo từng khoa và ghi đè được theo từng lớp. | Fact | Động | Phó hiệu trưởng, buổi 1 |
| **BR-16** | Sinh viên chỉ được rút một lớp mà không để lại dấu trên bảng điểm trong thời gian thêm/bớt môn. Sau thời hạn đó, việc rút được ghi nhận là rút học phần. | Constraint | Động | Quy chế học vụ §8.2 |
| **BR-17** | Học phí phải nộp = Σ (số tín chỉ của lớp × đơn giá mỗi tín chỉ theo ngành của sinh viên) + các khoản phí bắt buộc − học bổng được áp dụng. | Computation | Động | Cán bộ Tài chính, buổi 3 |
| **BR-18** | Sinh viên bị coi là "có nguy cơ tốt nghiệp trễ" khi số tín chỉ còn phải học vượt quá lượng có thể học hết trong số học kỳ còn lại ở mức trần tín chỉ tối đa. | Inference | Động | Cố vấn học tập, buổi 4 |
| **BR-19** | Khi một lớp bị huỷ, mọi sinh viên đã ghi danh và đang trong danh sách chờ đều được thông báo, và mọi chỗ đều được nhả ra. | Action enabler | Tĩnh | Phòng Đào tạo, buổi 2 |
| **BR-20** | Các môn được khai là môn song hành phải được ghi danh trong cùng một học kỳ; sinh viên ghi danh cả hai hoặc không môn nào. | Constraint | Tĩnh | Quy chế học vụ §7.4 |

### 2.1 Độ phủ theo kiểu

| Kiểu | Các luật | Số lượng |
|---|---|---|
| Fact | BR-01, BR-06, BR-15 | 3 |
| Constraint | BR-02, BR-04, BR-07, BR-09, BR-11, BR-12, BR-14, BR-16, BR-20 | 9 |
| Action enabler | BR-05, BR-08, BR-19 | 3 |
| Inference | BR-10, BR-18 | 2 |
| Computation | BR-03, BR-13, BR-17 | 3 |
| | **Tổng** | **20** |

### 2.2 Tĩnh và động — nó có nghĩa gì với việc xây dựng

Mười hai trong hai mươi luật là **động**. Ở một trường đại học, đây không phải một ghi
chú kỹ thuật vặt: Quy chế học vụ được hội đồng sửa hằng năm, và vài giá trị trong số này
đúng là những thứ hội đồng hay thay đổi.

| Luật | Giá trị cấu hình được | Ai được đổi |
|---|---|---|
| BR-02 | Mức điểm tối thiểu của từng môn tiên quyết; và chính các luật đó | Hội đồng chương trình của khoa, thông qua Phòng Đào tạo |
| BR-04 | Trần tín chỉ, theo năm học và theo ngành | Phòng Đào tạo |
| BR-05 | Ngưỡng công nợ để đăng ký; các luật ân hạn | Cán bộ Tài chính |
| BR-06 | Định nghĩa các đợt và thứ tự của chúng | Phòng Đào tạo |
| BR-09 | Thời hạn giữ lời mời danh sách chờ (24 giờ) | Phòng Đào tạo |
| BR-10 | Mốc kiểm 7 ngày | Phòng Đào tạo |
| BR-12 | SLA quyết định vượt sĩ số (48 giờ) | Phòng Đào tạo, sau khi D2 được ký |
| BR-14 | Nhóm sinh viên nào bị khoá chặn tự động | Phòng Đào tạo |
| BR-15 | Sĩ số tối thiểu duy trì được, theo khoa và theo lớp | Trưởng bộ môn |
| BR-16 | Ngày mở/đóng đợt thêm-bớt môn, theo từng học kỳ | Phòng Đào tạo |
| BR-17 | Đơn giá tín chỉ, các khoản phí | Cán bộ Tài chính |
| BR-18 | Giả định về số học kỳ còn lại | Cố vấn học tập |

> **Vấn đề năm quy chế (catalog year).** BR-02, BR-04 và BR-13 vừa động *vừa* phải được
> **phiên bản hoá theo năm quy chế**: sinh viên được đánh giá theo quy chế có hiệu lực
> lúc họ nhập học (UC-09 ngoại lệ 9.0.E2). Một mô hình cấu hình chỉ đơn giản ghi đè giá
> trị hiện tại sẽ âm thầm đánh giá lại mọi sinh viên đang học theo luật mới — vừa sai,
> vừa không được phép theo Quy chế học vụ §9.1.

---

## 3. Những luật CỐ Ý không cưỡng chế bằng phần mềm

| Luật | Vì sao CARS không cưỡng chế |
|---|---|
| Sinh viên phải gặp cố vấn ít nhất một lần mỗi học kỳ | CARS cưỡng chế *khoá chặn* (BR-14); còn cuộc gặp có diễn ra hay không là phán đoán của cố vấn |
| Giảng viên phải nộp điểm trong vòng 14 ngày sau kỳ đánh giá cuối | Phòng Đào tạo cưỡng chế bằng biện pháp hành chính; CARS báo cáo tình trạng trễ nhưng không chặn |
| Sinh viên đang bị cảnh cáo học vụ phải giảm khối lượng tín chỉ | Áp dụng bằng cách đặt một trần tín chỉ riêng cho cá nhân theo BR-04, không phải bằng một luật riêng |
| Tiêu chí xét học bổng | Thuộc hoàn toàn về hệ thống tài chính (EX-2); CARS chỉ đọc kết quả |
| Không được vượt sức chứa phòng học | Thuộc về hệ thống thời khoá biểu (EX-3); CARS cảnh báo ở UC-06 ngoại lệ 6.0.E3 nhưng không cưỡng chế |

---

## 4. Các luật được phát hiện như thế nào

| Buổi | Ngày | Vai bên liên quan được đóng | Kỹ thuật | Luật thu được |
|---|---|---|---|---|
| 1 | 08-09-2026 | Phó hiệu trưởng (người tài trợ) + Phòng Đào tạo | Phỏng vấn có cấu trúc, 9 câu hỏi chuẩn bị sẵn | BR-06, BR-15 |
| 2 | 09-09-2026 | Phòng Đào tạo + Nhân viên học vụ | Workshop có điều phối, đi lại hiện trạng của một lượt ghi danh | BR-01, BR-03, BR-07, BR-08, BR-09, BR-19 |
| 3 | 11-09-2026 | Cán bộ Tài chính + các Trưởng bộ môn | Phỏng vấn có cấu trúc | BR-05, BR-10, BR-12, BR-17 |
| 4 | 12-09-2026 | Cố vấn học tập | Hỏi tiếp về các vấn đề kiểm tra tiến độ tốt nghiệp | BR-18 |
| — | 10-09-2026 | — | **Phân tích tài liệu** Quy chế học vụ | BR-02, BR-04, BR-11, BR-13, BR-14, BR-16, BR-20 |

**Ghi chú về kỹ thuật.** Bảy trong hai mươi luật đến từ **phân tích tài liệu**, không phải
từ phỏng vấn — chúng đã được viết sẵn trong Quy chế học vụ và không ai nhắc tới, vì ai
cũng cho rằng chúng hiển nhiên. Đây là điều ngược hẳn với tình huống của TP2, nơi các luật
chỉ tồn tại dưới dạng thói quen của nhân viên. Bài học rút ra có tính tổng quát: trong một
tổ chức chịu quy định, hãy đọc quy định *trước* buổi phỏng vấn đầu tiên, nếu không bạn sẽ
ngồi cả buổi để nghe kể những thứ mình có thể tự đọc, mà vẫn bỏ sót đúng những luật không
ai nghĩ tới việc nói thành lời.

**Những câu hỏi còn treo, mang sang danh sách TBD của SRS**

| # | Câu hỏi | Người chịu trách nhiệm | Hạn |
|---|---|---|---|
| TBD-1 | Trần tín chỉ ở BR-04 có tính các môn học lại đang trong tiến trình không, hay chỉ tính các lượt ghi danh mới? | Phòng Đào tạo | Tuần 6 |
| TBD-2 | SLA 48 giờ ở BR-12 là giờ làm việc hay giờ theo lịch? Các Trưởng bộ môn và Phòng Đào tạo trả lời khác nhau. | Phòng Đào tạo | Tuần 6 |
| TBD-3 | Khi một cặp môn song hành (BR-20) bị phá vỡ do một lớp bị huỷ, lượt ghi danh còn lại bị tự động rút hay chuyển cho cố vấn xử lý? | Phòng Đào tạo | Tuần 7 |
| TBD-4 | Ngưỡng tài chính ở BR-05 áp theo từng học kỳ hay cộng dồn? | Cán bộ Tài chính | Tuần 7 |

---

## 5. Truy vết: luật → use case → yêu cầu

| Luật | Được cưỡng chế trong use case | Yêu cầu chức năng trong SRS |
|---|---|---|
| BR-01 | UC-03 | Enroll-2 |
| BR-02 | UC-02, UC-03, UC-04, UC-06, UC-09 | Prereq-1, Prereq-2 |
| BR-03 | UC-01, UC-03, UC-06, UC-07, UC-14 | Catalog-3, Enroll-6 |
| BR-04 | UC-02, UC-03, UC-08 | Enroll-5 |
| BR-05 | UC-03, UC-05, UC-10 | Finance-1, Finance-2 |
| BR-06 | UC-01, UC-03, UC-12 | Window-1, Enroll-1 |
| BR-07 | UC-02, UC-03, UC-07, UC-08, UC-11 | Enroll-4, Plan-2 |
| BR-08 | UC-07, UC-08 | Wait-3 |
| BR-09 | UC-07 | Wait-4 |
| BR-10 | UC-11, UC-14 | Viability-1 |
| BR-11 | UC-06 | Override-2 |
| BR-12 | UC-06, UC-14 | Override-3, Override-6 |
| BR-13 | UC-09, UC-14 | Audit-3 |
| BR-14 | UC-02, UC-03, UC-13 | Enroll-3, Advise-2 |
| BR-15 | UC-11 | Viability-2 |
| BR-16 | UC-08 | Drop-1 |
| BR-17 | UC-05, UC-10 | Account-2 |
| BR-18 | UC-09, UC-11 | Audit-6, Viability-5 |
| BR-19 | UC-11 | Viability-3 |
| BR-20 | UC-02, UC-03, UC-04, UC-08, UC-09 | Prereq-4, Enroll-7 |

**Mọi luật trong catalog này đều được ít nhất một use case cưỡng chế.** Phép kiểm đó đã
chạy trước khi chốt bản cơ sở, và được chạy lại trước khi nộp.
