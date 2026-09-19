# Từ điển dữ liệu
## cho Hệ thống Học vụ và Đăng ký môn (CARS)

Phiên bản 1.0 đã duyệt
Người soạn: **<Tên thành viên 4>**, Nhóm Phân tích nghiệp vụ — Nhóm <N>
Northern Regional University (NRU)
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

Các mục xếp theo **thứ tự bảng chữ cái** (theo tên tiếng Anh, vì đó là tên dùng trong
đặc tả). Các cấu trúc để trống cột *Độ dài* và *Giá trị*. Mọi phần tử được gọi tên bên
trong một cấu trúc đều có **mục riêng của nó**. Chỗ nào giá trị bị một business rule chi
phối thì cột *Giá trị* trích mã luật chứ không chép lại nội dung luật.

---

## 2. Từ điển dữ liệu

| Phần tử dữ liệu | Mô tả | Cấu thành hoặc kiểu dữ liệu | Độ dài | Giá trị |
|---|---|---|---|---|
| Advice Notes | Nội dung cố vấn ghi lại trong một buổi tư vấn | chữ và số | 4000 | Cố vấn và các cố vấn khác của sinh viên xem được; sinh viên **không** xem được (UC-13 luồng 13.4) |
| Advising Hold | Khoá chặn đặt lên một sinh viên, ngăn ghi danh cho tới khi cố vấn gỡ | Hold Identifier + Student Identifier + Hold Reason + Placed By + Placed At + (Expires At) + (Lifted By) + (Lifted At) | | |
| Advising Record | Bản ghi của một buổi tư vấn | Record Identifier + Student Identifier + Advisor Identifier + Meeting Date + Advice Notes | | |
| Advisor Identifier | Mã định danh duy nhất của một cố vấn học tập | chữ và số | 12 | Phải tồn tại dưới dạng một hồ sơ nhân sự |
| Catalog Year | Năm học mà sinh viên được đánh giá theo quy chế của năm đó | số, YYYY | 4 | Đặt lúc nhập học và không bao giờ đổi; chi phối BR-02, BR-04 và BR-13 (UC-09 ngoại lệ 9.0.E2) |
| Completion Percentage | Tỉ lệ chương trình mà sinh viên đã hoàn thành | số thập phân | 5 | 0,00–100,00; tính theo BR-13 |
| Corequisite Course Code | Môn phải học trong cùng học kỳ với một môn khác | chữ và số | 12 | Phải tồn tại dưới dạng một Course Code; xem BR-20 |
| Course | Một đơn vị học tập do một khoa mở | Course Code + Course Title + Credits + Faculty Code + 0:n{Prerequisite Rule} + 0:n{Corequisite Course Code} | | |
| Course Code | Mã định danh duy nhất của một môn học | chữ và số | 12 | Định dạng: ba tới bốn chữ cái rồi ba chữ số, ví dụ SWR302 |
| Course Title | Tên môn học đọc được | chữ và số | 200 | Không để trống |
| Credits | Số tín chỉ của một môn | số nguyên | 2 | 1–6 |
| Credits Applied | Số tín chỉ được tính cho một nhóm điều kiện | số nguyên | 3 | ≥ 0 |
| Credits Earned | Số tín chỉ sinh viên đạt được từ một môn đã hoàn thành | số nguyên | 2 | Bằng 0 nếu môn đó trượt |
| Credits Required | Số tín chỉ mà một nhóm điều kiện yêu cầu | số nguyên | 3 | > 0 |
| Day Of Week | Ngày trong tuần lớp học | chữ cái | 10 | [ Monday \| Tuesday \| Wednesday \| Thursday \| Friday \| Saturday ] |
| Decided At | Thời điểm một quyết định vượt sĩ số được ghi nhận | ngày giờ, ISO 8601 kèm múi giờ | 25 | Để trống khi yêu cầu còn chờ; là mốc đo 48 giờ trong BR-12 |
| Decided By | Trưởng bộ môn hoặc người được uỷ quyền đã quyết định vượt sĩ số | chữ và số | 12 | Phải giữ vai Trưởng bộ môn của bộ môn sở hữu lớp đó (BR-11) |
| Decision Reason | Văn bản tự do giải thích một quyết định vượt sĩ số | chữ và số | 1000 | Bắt buộc cho cả duyệt lẫn từ chối (UC-06 POST-3) |
| Degree Audit Result | Trạng thái đã đánh giá của tiến độ sinh viên với chương trình của mình | Student Identifier + Programme Code + Catalog Year + Completion Percentage + 1:n{Requirement Group Result} | | |
| Eligibility Rule | Biểu thức xác định sinh viên nào thuộc một đợt ưu tiên | chữ và số | 500 | Đánh giá theo Year Of Study và Programme Code; các đợt không được chồng nhau (UC-12 ngoại lệ 12.0.E2) |
| Email Address | Địa chỉ email của trường dùng để gửi thông báo | chữ và số | 254 | Phải chứa đúng một dấu "@"; giả định A6 |
| End Time | Giờ kết thúc một buổi học của lớp | giờ, HH:MM | 5 | Muộn hơn Start Time |
| Enrolled At | Thời điểm một lượt ghi danh được ghi nhận | ngày giờ, ISO 8601 kèm múi giờ | 25 | Hệ thống tự sinh |
| Enrollment | Việc một sinh viên đăng ký vào một lớp | Enrollment Identifier + Student Identifier + Section Identifier + Enrollment Status + Enrolled At + (Override Request Identifier) | | |
| Enrollment Identifier | Mã định danh duy nhất của một lượt ghi danh | chữ và số | 20 | Hệ thống tự sinh |
| Enrollment Status | Trạng thái hiện tại của một lượt ghi danh | chữ cái | 14 | [ Enrolled \| Dropped \| Withdrawn \| Cancelled \| Invalidated ]; Invalidated sinh ra từ UC-04 ngoại lệ 4.0.E3 |
| Expires At | Thời điểm một khoá chặn hoặc một lời mời hết hiệu lực | ngày giờ, ISO 8601 kèm múi giờ | 25 | Với lời mời danh sách chờ là 24 giờ sau khi phát ra (BR-09) |
| Faculty Code | Mã của khoa sở hữu một môn học hoặc một ngành | chữ và số | 8 | Một trong sáu khoa của NRU |
| Final Grade | Điểm được cấp cho một môn đã hoàn thành | chữ và số | 4 | [ A \| B+ \| B \| C+ \| C \| D+ \| D \| F \| P \| W ]; đem so với Minimum Grade cho BR-02 |
| Financial Standing | Tình trạng tài chính của sinh viên do hệ thống tài chính báo về | Student Identifier + Outstanding Balance + Finance Hold Flag + Retrieved At | | |
| Finance Hold Flag | Hệ thống tài chính có đặt khoá chặn đăng ký tường minh hay không | chữ cái | 3 | [ Yes \| No ]; chặn ghi danh bất kể số dư là bao nhiêu (BR-05) |
| Full Name | Họ tên sinh viên như đã ghi lúc nhập học | chữ cái | 100 | Không để trống; lưu được dấu tiếng Việt |
| Group Name | Tên của một nhóm điều kiện trong một chương trình | chữ và số | 100 | Ví dụ "Cơ sở ngành", "Tự chọn chuyên ngành", "Đại cương" |
| Group Status | Trạng thái đã đánh giá của một nhóm điều kiện | chữ cái | 14 | [ Satisfied \| InProgress \| Outstanding \| NeedsReview ]; NeedsReview theo UC-09 POST-3 |
| Group Type | Loại nhóm điều kiện | chữ cái | 14 | [ Core \| Major \| Elective \| General \| CreditTotal ] |
| Hold Identifier | Mã định danh duy nhất của một khoá chặn cố vấn | chữ và số | 20 | Hệ thống tự sinh |
| Hold Reason | Phân loại và lời giải thích của một khoá chặn cố vấn | chữ và số | 500 | Sinh viên thấy được phần phân loại; không thấy lời giải thích (UC-13 luồng 13.4) |
| Joined At | Thời điểm sinh viên vào danh sách chờ | ngày giờ, ISO 8601 kèm múi giờ | 25 | Quyết định vị trí trong hàng chờ, bên trong cùng một đợt ưu tiên |
| Justification | Lý do sinh viên nêu ra khi xin vượt sĩ số | chữ và số | 1000 | Bắt buộc; hiện cho Trưởng bộ môn ở UC-06 bước 4 |
| Lecturer Name | Tên giảng viên dạy lớp | chữ cái | 100 | Do hệ thống thời khoá biểu cung cấp |
| Lifted At | Thời điểm một khoá chặn cố vấn được gỡ | ngày giờ, ISO 8601 kèm múi giờ | 25 | Để trống khi khoá chặn còn hiệu lực |
| Lifted By | Cố vấn đã gỡ khoá chặn | chữ và số | 12 | Phải là cố vấn được phân công cho sinh viên đó |
| Meeting Date | Ngày diễn ra buổi tư vấn | ngày, YYYY-MM-DD | 10 | Không được ở tương lai |
| Meeting Pattern | Một buổi học theo lịch của một lớp | Day Of Week + Start Time + End Time + Room Code | | |
| Minimum Grade | Mức điểm thấp nhất thoả một môn tiên quyết | chữ và số | 4 | Một giá trị của Final Grade; mặc định "D" |
| Minimum Viable Enrollment | Mức sĩ số mà dưới đó lớp bị coi là không đủ sĩ số | số nguyên | 3 | Mặc định 15, cấu hình được theo khoa và theo lớp (BR-15) |
| Outstanding Balance | Số tiền sinh viên đang nợ | số thập phân, VND | 12 | ≥ 0; đem so với ngưỡng đăng ký trong BR-05 |
| Override Request | Yêu cầu của sinh viên xin một chỗ trong lớp mà bình thường họ không vào được | Override Request Identifier + Student Identifier + Section Identifier + Request Ground + Justification + Submitted At + Request Status + (Decided By) + (Decided At) + (Decision Reason) | | |
| Override Request Identifier | Mã định danh duy nhất của một yêu cầu vượt sĩ số | chữ và số | 20 | Hệ thống tự sinh |
| Placed At | Thời điểm một khoá chặn cố vấn được đặt | ngày giờ, ISO 8601 kèm múi giờ | 25 | Hệ thống tự sinh |
| Placed By | Cố vấn hoặc cán bộ phòng đào tạo đã đặt khoá chặn | chữ và số | 12 | Phải giữ một vai có thẩm quyền |
| Prerequisite Course Code | Môn phải hoàn thành trước một môn khác | chữ và số | 12 | Phải tồn tại dưới dạng một Course Code |
| Prerequisite Rule | Một điều kiện tiên quyết gắn vào một môn học | Prerequisite Course Code + Minimum Grade | | |
| Priority Wave | Khoảng thời gian mở đăng ký của một nhóm sinh viên | Wave Name + Wave Start + Wave End + Eligibility Rule | | |
| Programme | Một chương trình đào tạo mà sinh viên theo học | Programme Code + Programme Name + Faculty Code + Total Credits Required + 1:n{Requirement Group} | | |
| Programme Code | Mã định danh duy nhất của một chương trình đào tạo | chữ và số | 12 | Được phiên bản hoá theo Catalog Year |
| Programme Name | Tên chương trình đào tạo đọc được | chữ và số | 200 | Không để trống |
| Published Capacity | Số chỗ một lớp mở ra | số nguyên | 4 | > 0; dùng trong BR-03 |
| Queue Position | Vị trí của sinh viên trong một danh sách chờ | số nguyên | 4 | ≥ 1; gán theo Joined At bên trong đợt ưu tiên; không bao giờ bị đổi trừ trường hợp ở UC-07 |
| Record Identifier | Mã định danh duy nhất của một bản ghi tư vấn | chữ và số | 20 | Hệ thống tự sinh |
| Request Ground | Căn cứ để xin vượt sĩ số | chữ cái | 20 | [ SectionFull \| PrerequisiteUnmet \| TimetableNecessity ] |
| Request Status | Trạng thái hiện tại của một yêu cầu vượt sĩ số | chữ cái | 12 | [ Pending \| Approved \| Declined \| Expired \| Withdrawn \| Void ]; một yêu cầu không bao giờ rời trạng thái Pending một cách âm thầm (UC-06 POST-1) |
| Requirement Group | Một nhóm điều kiện của chương trình | Group Name + Group Type + Credits Required + 1:n{Course Code} | | |
| Requirement Group Result | Trạng thái đã đánh giá của một nhóm điều kiện với một sinh viên | Group Name + Group Status + Credits Applied + 1:n{Course Code} | | |
| Retrieved At | Thời điểm dữ liệu tài chính được đọc về từ hệ thống tài chính | ngày giờ, ISO 8601 kèm múi giờ | 25 | Hiển thị kèm với các con số (UC-10 POST-3) |
| Room Code | Mã phòng học nơi lớp diễn ra | chữ và số | 12 | Do hệ thống thời khoá biểu cung cấp; CARS không bao giờ sửa nó (EX-3) |
| Section | Một lần mở lớp theo lịch của một môn trong một học kỳ | Section Identifier + Course Code + Semester Code + Lecturer Name + Published Capacity + Minimum Viable Enrollment + Section Status + 1:n{Meeting Pattern} | | |
| Section Identifier | Mã định danh duy nhất của một lớp học phần | chữ và số | 20 | Hệ thống tự sinh |
| Section Status | Trạng thái hiện tại của một lớp | chữ cái | 14 | [ Planned \| Open \| Full \| Cancelled \| Closed ] |
| Semester Code | Mã của một học kỳ | chữ và số | 10 | Định dạng YYYY-S, ví dụ 2026-1 |
| Start Time | Giờ bắt đầu một buổi học của lớp | giờ, HH:MM | 5 | Sớm hơn End Time |
| Student | Một người đang theo học một chương trình tại trường | Student Identifier + Full Name + Email Address + Programme Code + Catalog Year + Year Of Study + Advisor Identifier + Student Status | | |
| Student Identifier | Mã định danh duy nhất của một sinh viên | chữ và số | 12 | Gán lúc nhập học; là khoá nối giữa CARS, hệ thống tài chính và hệ quản lý học tập |
| Student Status | Tình trạng theo học hiện tại của sinh viên | chữ cái | 14 | [ Active \| Suspended \| Graduated \| Withdrawn \| OnLeave ]; chỉ sinh viên Active mới được đăng ký |
| Submitted At | Thời điểm một yêu cầu vượt sĩ số được gửi | ngày giờ, ISO 8601 kèm múi giờ | 25 | Bắt đầu đếm đồng hồ 48 giờ trong BR-12 |
| Total Credits Required | Số tín chỉ cần để hoàn thành một chương trình | số nguyên | 3 | > 0; là mẫu số trong BR-13 |
| Transcript Entry | Một môn đã hoàn thành trên bảng điểm của sinh viên | Student Identifier + Course Code + Semester Code + Final Grade + Credits Earned + (Transfer Institution) | | |
| Transfer Institution | Cơ sở đào tạo nơi tín chỉ được chuyển đổi từ đó | chữ và số | 200 | Chỉ có mặt với tín chỉ chuyển đổi đã được duyệt (UC-04 luồng 4.3) |
| Waitlist Entry | Vị trí của sinh viên trong danh sách chờ của một lớp | Waitlist Entry Identifier + Student Identifier + Section Identifier + Queue Position + Joined At + Waitlist Status + (Expires At) | | |
| Waitlist Entry Identifier | Mã định danh duy nhất của một mục trong danh sách chờ | chữ và số | 20 | Hệ thống tự sinh |
| Waitlist Status | Trạng thái hiện tại của một mục danh sách chờ | chữ cái | 12 | [ Queued \| Offered \| Accepted \| Declined \| Expired \| Removed ] |
| Wave End | Thời điểm một đợt ưu tiên đóng lại | ngày giờ, ISO 8601 kèm múi giờ | 25 | Muộn hơn Wave Start |
| Wave Name | Tên của một đợt ưu tiên | chữ và số | 40 | Ví dụ "Đợt 1 — năm cuối" |
| Wave Start | Thời điểm một đợt ưu tiên mở ra | ngày giờ, ISO 8601 kèm múi giờ | 25 | Các đợt không được chồng nhau (BR-06) |
| Window End | Thời điểm cửa sổ đăng ký đóng lại | ngày giờ, ISO 8601 kèm múi giờ | 25 | Muộn hơn Window Start |
| Window Start | Thời điểm cửa sổ đăng ký mở ra | ngày giờ, ISO 8601 kèm múi giờ | 25 | Ấn định theo lịch năm học |
| Year Of Study | Năm thứ mấy của sinh viên trong chương trình | số nguyên | 1 | 1–6; quyết định đợt ưu tiên (BR-06) và trần tín chỉ (BR-04) |

---

## 3. Ghi chú cho vài mục đáng chú ý

**Catalog Year** là mục có hệ quả lớn nhất trong từ điển này và cũng là mục dễ bỏ sót
nhất. Sinh viên được đánh giá theo quy chế có hiệu lực lúc họ nhập học, không phải quy
chế hiện hành. Thiếu phần tử này thì mỗi lần sửa chương trình đào tạo hằng năm sẽ âm thầm
đánh giá lại toàn bộ sinh viên đang học — vừa sai, vừa không được phép theo Quy chế học
vụ §9.1. Ba luật động (BR-02, BR-04, BR-13) bắt buộc phải phiên bản hoá theo nó.

**Group Status có thêm giá trị NeedsReview** chứ không chỉ có Satisfied, InProgress và
Outstanding. Ba giá trị hiển nhiên kia ép bộ xử lý phải đoán khi nó không đánh giá nổi
một điều kiện — mà một bản kiểm tra tiến độ biết đoán chính là kiểu hỏng đã sinh ra lá
đơn khiếu nại mô tả ở Vision & Scope §1.1.

**Queue Position tồn tại dưới dạng dữ liệu được lưu, không phải thứ hạng tính ra.** Tính
vị trí từ Joined At mỗi lần đọc sẽ tương đương — cho tới khi một sinh viên bị bỏ qua vì
không đủ điều kiện (UC-07 luồng 7.4) mà vẫn phải giữ nguyên chỗ của mình. Lưu vị trí lại
mới làm cho luật công bằng đó diễn đạt được.

**Financial Standing mang theo Retrieved At** vì CARS không sở hữu dữ liệu này. Khi hệ
thống tài chính không liên lạc được (UC-10 ngoại lệ 10.0.E1), các con số vẫn được hiển
thị kèm theo độ cũ của chúng, thay vì bị giấu đi hoặc bị thay bằng số không.
