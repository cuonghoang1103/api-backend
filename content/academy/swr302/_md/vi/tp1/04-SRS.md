# Đặc tả Yêu cầu Phần mềm (SRS)
## cho Hệ thống Học vụ và Đăng ký môn (CARS)

Phiên bản 1.0 đã duyệt
Người soạn: **<Tên nhóm trưởng>**, Nhóm Phân tích nghiệp vụ — Nhóm <N>
Northern Regional University (NRU)
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
thống Học vụ và Đăng ký môn (CARS)**, hệ thống thay thế cho hệ thông tin sinh viên mười
bốn năm tuổi của Northern Regional University trong việc đăng ký môn và quản trị học vụ.

| Người đọc | Dùng tài liệu này để |
|---|---|
| Nhóm phát triển | Hiểu phải xây cái gì và "xong" nghĩa là gì với từng năng lực |
| Nhóm kiểm thử | Suy ra các ca kiểm thử; mọi yêu cầu chức năng đều được viết sao cho kiểm được đạt/không đạt |
| Quản lý dự án | Khoanh phạm vi các bản phát hành và ước lượng công sức |
| Phòng Đào tạo và phòng học vụ | Xác nhận rằng các luật đã mã hoá khớp với Quy chế học vụ |

## 1.2 Quy ước của tài liệu

**Mã yêu cầu** có dạng `<Tính năng>-<n>` — ví dụ `Enroll-4`, `Prereq-1`, `Override-3`.
Mã là vĩnh viễn; số của một yêu cầu đã bị xoá không bao giờ được dùng lại. Yêu cầu thuộc
tính chất lượng dùng mã `QA-<n>`.

**Từ "shall" (phải)** diễn đạt một nghĩa vụ. Các câu dùng "should", "may" hay "will" là
văn giải thích, không phải yêu cầu.

**Độ ưu tiên** — Cao, Trung bình hoặc Thấp — lấy từ bảng tính xếp ưu tiên yêu cầu (R6),
và bảng tính đó là bản gốc.

**Tham chiếu.** Business rule chỉ xuất hiện dưới dạng `BR-n`; nội dung luật nằm trong
tài liệu Business Rules. Use case xuất hiện dưới dạng `UC-nn`. Phần tử dữ liệu được định
nghĩa trong Data Dictionary.

**Thuộc tính chất lượng** được viết bằng Planguage (Gilb) với SCALE, METER, MUST và PLAN.

## 1.3 Phạm vi dự án

CARS là bản ghi có thẩm quyền về việc theo học của một sinh viên từ lúc nhập học tới lúc
tốt nghiệp. Nó công bố danh mục lớp, cho sinh viên lập kế hoạch và đăng ký, quyết định
từng lượt ghi danh theo luật chương trình đào tạo, sĩ số, thời khoá biểu và tài chính
trong một giao dịch duy nhất, vận hành việc vượt sĩ số và danh sách chờ, và cho mỗi sinh
viên thấy tiến độ tốt nghiệp cùng số dư tài khoản của mình.

CARS **không** thay thế hệ thống tài chính, hệ quản lý học tập, hệ thống thời khoá biểu
hay SSO của trường. Phát biểu có thẩm quyền về phạm vi, nội dung từng bản phát hành và
các loại trừ nằm ở **tài liệu Vision and Scope** §2.1–2.4.

Các mục tiêu nghiệp vụ mà CARS sinh ra để đạt được là BO-1 … BO-6 ở Vision and Scope
§1.3. Mọi tính năng hệ thống ở mục 3 đều truy vết được về ít nhất một trong số đó.

## 1.4 Tài liệu tham chiếu

| # | Tài liệu | Phiên bản | Vị trí |
|---|---|---|---|
| R1 | Vision and Scope Document for CARS | 1.0 | `deliverables/01-Vision-and-Scope.md` |
| R2 | Use Cases for CARS | 1.0 | `deliverables/02-Use-Cases.md` |
| R3 | Business Rules for CARS | 1.0 | `deliverables/03-Business-Rules.md` |
| R4 | Data Dictionary for CARS | 1.0 | `deliverables/05-Data-Dictionary.md` |
| R5 | Mock-ups for Complex Use Cases | 1.0 | `deliverables/06-Mockups.md` |
| R6 | Requirement Prioritization Worksheet | 1.0 | `deliverables/07-Requirements-Prioritization.xlsx` |
| R7 | Requirement Estimation | 1.0 | `deliverables/08-Requirements-Estimation.xlsx` |
| R8 | Quy chế học vụ NRU | Bản 2026 | Phòng Đào tạo |
| R9 | Wiegers, K. & Beatty, J., *Software Requirements*, tái bản lần 3 | 2013 | Microsoft Press |
| R10 | Ghi chép các buổi khai thác yêu cầu 1–4 | — | Thư mục chung của nhóm, `elicitation/` |

**Ghi chú về phương pháp khai thác yêu cầu.** Đầu vào từ bên liên quan đến từ bốn buổi
mô phỏng bên liên quan (R10) cộng với **phân tích tài liệu Quy chế học vụ** (R8), vốn cho
ra bảy trong hai mươi business rule. Chỗ nào không có câu trả lời thì mục đó được ghi vào
danh sách TBD (Phụ lục C) chứ không bịa ra.

---

# 2. Mô tả tổng thể

## 2.1 Góc nhìn sản phẩm

CARS là một hệ **thay thế** cho một hệ thống đang tồn tại, nên nó là một dự án nâng cấp
và thay thế theo nghĩa của Wiegers chương 21: các yêu cầu bị ràng buộc bởi một quy trình
đang có, dữ liệu đang có và quy định đang có, và việc phân tích khoảng cách quan trọng
hơn một danh sách tính năng dựng từ đầu.

Hệ thống cũ chỉ bị gỡ bỏ sau một cửa sổ đăng ký trọn vẹn và thành công (R1 §3.3). Context
diagram nằm ở Phụ lục B.

**Các hệ thống mà CARS trao đổi dữ liệu**

| Hệ thống ngoài | Chiều | Cái gì đi qua ranh giới |
|---|---|---|
| SSO của trường | Vào | Khẳng định xác thực và các khai báo vai trò |
| Hệ thống tài chính / học phí | Vào | Số dư còn nợ và trạng thái khoá chặn đăng ký |
| Hệ thống thời khoá biểu | Vào | Lịch học của lớp, phòng, giảng viên |
| Hệ quản lý học tập | Ra / vào | Lượt ghi danh đã xác nhận đi ra; điểm cuối kỳ đi vào |
| Dịch vụ thông báo | Ra | Email và SMS tới sinh viên và nhân viên |

## 2.2 Các lớp người dùng và đặc điểm

| Lớp người dùng | Quy mô | Tần suất dùng | Trình độ kỹ thuật | Được ưu tiên |
|---|---|---|---|---|
| **Sinh viên** | 12.000 | Dồn dập trong cửa sổ 72 giờ; thi thoảng ở thời gian khác | Khác nhau; giả định là không có | **Có** |
| **Nhân viên học vụ** | 14 | Liên tục trong đợt đăng ký | Trung bình | **Có** |
| **Trưởng bộ môn** | 6 | Hằng ngày trong đợt đăng ký | Thấp — họ là giảng viên, không phải cán bộ hành chính | Không |
| **Cố vấn học tập** | ~40 | Hằng tuần, cao điểm trước các cửa sổ | Trung bình | Không |
| **Phòng Đào tạo** | 2 | Hằng ngày | Cao | Không |
| **Cán bộ Tài chính** | 3 | Hằng tuần, cao điểm lúc đăng ký | Trung bình | Không |
| **Quản trị hệ thống** | 2 | Thi thoảng | Cao | Không |

**Các lớp người dùng được ưu tiên.** Sinh viên và Nhân viên học vụ. Chỗ nào nhu cầu của
họ xung đột với một lớp khác thì nhu cầu của họ thắng. Đây là quyết định của Phó hiệu
trưởng: dự án tồn tại vì sinh viên không đăng ký được và nhân viên không theo kịp.

**Hệ quả với thiết kế.** Lớp Sinh viên vừa được ưu tiên *vừa* đông nhất, ít được đào tạo
nhất và dồn cục về thời gian nhất. Đó là lý do QA-1 tới QA-4 tồn tại, và là lý do UC-02
(lập kế hoạch trước cửa sổ) nằm trong bản 1.0 thay vì bị hoãn.

## 2.3 Môi trường vận hành

| # | Yêu cầu |
|---|---|
| OE-1 | CARS phải chạy trong trung tâm dữ liệu của trường, cấp phát theo mức đỉnh của đợt đăng ký chứ không theo mức trung bình. |
| OE-2 | Các giao diện hướng tới sinh viên phải chạy trên các phiên bản hiện hành của Chrome, Edge, Safari và Firefox, ở bề rộng khung nhìn tối thiểu 360 px. |
| OE-3 | Các giao diện cho nhân viên phải chạy trên cùng những trình duyệt đó ở bề rộng khung nhìn tối thiểu 1280 px. |
| OE-4 | CARS phải vẫn dùng được trên kết nối di động 3G cho các đường danh mục, lập kế hoạch và ghi danh. |
| OE-5 | CARS phải trình bày mọi thời điểm theo múi Asia/Ho_Chi_Minh và lưu chúng kèm độ lệch UTC tường minh. |

## 2.4 Ràng buộc thiết kế và hiện thực

| # | Ràng buộc | Nguồn gốc |
|---|---|---|
| CO-1 | CARS phải xác thực mọi người dùng qua SSO của trường và không được duy trì kho mật khẩu sinh viên. | EX-8, chính sách an ninh của tổ chức |
| CO-2 | CARS không được dựng hay sửa thời khoá biểu; nó tiêu thụ thời khoá biểu đã công bố. | EX-3 |
| CO-3 | CARS không được xử lý thanh toán, hoàn tiền hay quyết định học bổng. | EX-2 |
| CO-4 | CARS không được lưu chi tiết phương tiện thanh toán ở bất kỳ thời điểm nào. | Chính sách tài chính |
| CO-5 | Mọi luật được đánh dấu Động ở R3 §2.2 phải đổi được bằng cấu hình, do đúng vai đã nêu tên, mà không cần ra bản phần mềm mới. | Business Rules §2.2 |
| CO-6 | Các luật phiên bản hoá theo năm quy chế — BR-02, BR-04, BR-13 — phải giữ lại mọi phiên bản trước, và không bao giờ được đánh giá lại một sinh viên đang học theo một phiên bản sau này. | Quy chế học vụ §9.1 |
| CO-7 | Giao tiếp tài chính phải được cô lập sau một lớp adapter, sao cho một API đồng bộ và một lượt trao đổi tệp theo đêm thay thế được cho nhau mà không đụng tới logic ghi danh. | RI-1 |

## 2.5 Giả định và phụ thuộc

**Giả định** (lấy từ R1 §1.7)

- A1: Mô hình đăng ký tiếp tục là một cửa sổ 72 giờ chia ba đợt ưu tiên.
- A2: Ít nhất 90% số ngành diễn đạt được thành luật chương trình máy đánh giá được.
- A3: Dữ liệu bảng điểm đầy đủ với sinh viên nhập học từ 2019 trở đi.
- A4: Việc xác thực sinh viên tiếp tục do SSO của trường cung cấp.
- A5: Hệ thống thời khoá biểu vẫn là nơi có thẩm quyền về việc lớp học khi nào và ở đâu.
- A6: Mọi sinh viên đang theo học đều có một địa chỉ email của trường gửi tới được.

**Phụ thuộc**

- D1: Một giao tiếp tới hệ thống tài chính, hình thức phụ thuộc vào nhà cung cấp (RI-1).
- D2: Một văn bản chính sách của trường đã ký, ấn định SLA vượt sĩ số 48 giờ (BR-12).
- D3: Các hội đồng chương trình của khoa xác nhận các điều kiện tốt nghiệp đã mã hoá trước bản 1.0.
- D4: Một người quản lý dữ liệu của Phòng Đào tạo, 8 giờ mỗi tuần trong giai đoạn yêu cầu và chuyển đổi dữ liệu.

> **Nếu A2 sai thì bản 1.0 sai.** Mọi quyết định ghi danh ở §3.3 đều phụ thuộc vào việc
> luật tiên quyết máy đánh giá được. Các ngành không diễn đạt được thì xử lý dưới dạng
> Không xác định theo thiết kế (Prereq-5), nhưng nếu tỉ lệ đó cao hơn 10% một cách đáng
> kể thì mục tiêu tiết kiệm giờ công BO-2 trở nên không thể đạt và phải xem lại phạm vi.

---

# 3. Tính năng hệ thống

## 3.1 Tra cứu và duyệt danh mục môn học

**Mô tả.** Việc công bố và tra cứu danh mục lớp. Hiện thực FE-1 · UC-01 · Mục tiêu BO-1.
**Độ ưu tiên:** Cao · **Bản phát hành:** 1.0

**Catalog-1:** Hệ thống phải hiển thị, với từng lớp, mã môn, tên môn, số tín chỉ, giảng viên, lịch học, sĩ số công bố và sĩ số còn lại.

**Catalog-2:** Hệ thống phải cho phép sinh viên lọc lớp theo khoa, mã môn, từ khoá, ngày, khoảng giờ, giảng viên và tình trạng còn chỗ.

**Catalog-3:** Hệ thống phải tính sĩ số còn lại theo đúng BR-03 và không được phục vụ con số sĩ số nào cũ quá 60 giây.

**Catalog-4:** Hệ thống phải đánh dấu là không đủ điều kiện, kèm lý do, mọi lớp mà chương trình của sinh viên đang xem không cho phép.

**Catalog-5:** Hệ thống phải hiển thị lớp mà hệ thống thời khoá biểu chưa công bố lịch học, đánh dấu là giờ học sẽ xác nhận sau, và không được cho phép ghi danh vào lớp đó.

**Catalog-6:** Hệ thống phải nói rõ bộ lọc nào đã loại hết kết quả khi một lượt tìm kiếm không trả về gì.

**Catalog-7:** Hệ thống phải phục vụ một bản danh mục cache không cũ quá 15 phút, có ghi rõ độ cũ, khi nguồn danh mục không truy cập được.

## 3.2 Lập kế hoạch thời khoá biểu

**Mô tả.** Việc dựng thời khoá biểu tạm trước khi mở cửa sổ. Hiện thực FE-2 · UC-02 ·
Mục tiêu BO-1. **Độ ưu tiên:** Cao · **Bản phát hành:** 1.0

**Plan-1:** Hệ thống phải cho phép sinh viên thêm lớp vào một kế hoạch có tên và giữ đồng thời tối đa ba kế hoạch.

**Plan-2:** Hệ thống phải phát hiện và đánh dấu mọi chỗ trùng giờ học giữa các lớp trong một kế hoạch, theo đúng BR-07.

**Plan-3:** Hệ thống phải đánh giá môn tiên quyết cho mọi lớp trong kế hoạch và phải đánh dấu từng lớp có môn tiên quyết chưa thoả.

**Plan-4:** Hệ thống phải cộng tổng tín chỉ trong một kế hoạch và phải đánh dấu kế hoạch khi tổng vượt trần tín chỉ của sinh viên, nêu rõ phần vượt.

**Plan-5:** Hệ thống không được trao cho một kế hoạch bất kỳ chỗ nào, lượt giữ nào hay quyền ưu tiên đăng ký nào, và phải nói rõ điều này với sinh viên.

**Plan-6:** Hệ thống phải đánh dấu lớp trong kế hoạch đã bị huỷ và phải gợi ý các lớp thay thế của cùng môn.

**Plan-7:** Hệ thống phải gửi từng lớp của kế hoạch đi ghi danh theo đúng thứ tự sinh viên chỉ định, và phải báo kết quả của từng lớp riêng biệt.

## 3.3 Giao dịch ghi danh

**Mô tả.** Quyết định ghi danh tự động duy nhất. Hiện thực FE-3 · UC-03 · Mục tiêu BO-1,
BO-2, BO-4. **Độ ưu tiên:** Cao · **Bản phát hành:** 1.0

**Enroll-1:** Hệ thống chỉ được nhận một yêu cầu ghi danh khi đợt ưu tiên của sinh viên gửi yêu cầu đang mở, theo đúng BR-06.

**Enroll-2:** Hệ thống phải từ chối yêu cầu ghi danh vào một lớp mà sinh viên đã có một lượt ghi danh, theo đúng BR-01.

**Enroll-3:** Hệ thống phải từ chối yêu cầu ghi danh từ một sinh viên đang mang khoá chặn cố vấn còn hiệu lực, theo đúng BR-14, và phải gọi tên cố vấn cần liên hệ.

**Enroll-4:** Hệ thống phải từ chối yêu cầu ghi danh mà lớp của nó trùng giờ học với bất kỳ lớp nào sinh viên đã ghi danh, theo đúng BR-07, và phải gọi tên lớp bị trùng.

**Enroll-5:** Hệ thống phải từ chối yêu cầu ghi danh sẽ đưa sinh viên vượt trần tín chỉ của năm học của họ, theo đúng BR-04, và phải nói rõ trần là bao nhiêu và tổng hiện tại là bao nhiêu.

**Enroll-6:** Hệ thống chỉ được chiếm một chỗ khi sĩ số còn lại tính theo BR-03 lớn hơn không, và không bao giờ được cấp cùng một chỗ cho hai sinh viên.

**Enroll-7:** Hệ thống phải ghi danh sinh viên vào cả hai lớp của một cặp môn song hành như một giao dịch duy nhất, hoặc không lớp nào, theo đúng BR-20.

**Enroll-8:** Hệ thống phải hoàn tất trọn vẹn một lượt ghi danh hoặc không thay đổi trạng thái nào, và phải ghi lại quyết định, lý do của nó cùng mọi luật đã đánh giá, dù yêu cầu thành công hay thất bại.

**Enroll-9:** Hệ thống phải công bố một lượt ghi danh đã xác nhận sang hệ quản lý học tập.

**Enroll-10:** Hệ thống phải mời vào danh sách chờ hoặc mời tạo yêu cầu vượt sĩ số, nếu môn đó cho phép, khi một lượt ghi danh bị từ chối vì hết chỗ.

## 3.4 Bộ luật môn tiên quyết và môn song hành

**Mô tả.** Việc đánh giá tự động các luật chương trình đào tạo. Hiện thực FE-4 · UC-04 ·
Mục tiêu BO-2. **Độ ưu tiên:** Cao · **Bản phát hành:** 1.0

**Prereq-1:** Hệ thống phải đánh giá các môn đã hoàn thành của sinh viên theo mọi luật tiên quyết gắn với một môn học, kể cả mức điểm tối thiểu đã quy định, theo đúng BR-02.

**Prereq-2:** Hệ thống phải trả về kết quả Đạt, Chưa đạt hoặc Không xác định cho mọi lượt đánh giá, và phải gọi tên đúng luật chưa thoả với kết quả Chưa đạt.

**Prereq-3:** Hệ thống phải coi một môn tiên quyết đang được học là đạt tạm thời, và phải đánh giá lại lượt ghi danh khi điểm cuối kỳ được nhập.

**Prereq-4:** Hệ thống phải đánh giá các luật môn song hành theo các lượt ghi danh đang học và đang dự kiến của sinh viên, theo đúng BR-20.

**Prereq-5:** Hệ thống phải trả về Không xác định, và phải phát một cảnh báo cấu hình, khi một môn học không có luật chương trình nào gắn vào, và không được trả về Đạt.

**Prereq-6:** Hệ thống phải trả về Không xác định với sinh viên có bảng điểm bị đánh dấu là không đầy đủ, và phải chuyển lượt đánh giá đó tới Nhân viên học vụ.

**Prereq-7:** Hệ thống phải chấp nhận một môn được ghi nhận là tương đương với môn tiên quyết, và phải ghi lại đã áp dụng ánh xạ tương đương nào.

**Prereq-8:** Hệ thống phải đánh giá luật chương trình bằng phiên bản có hiệu lực theo năm quy chế của sinh viên, theo đúng CO-6.

**Prereq-9:** Hệ thống phải phát một ngoại lệ ghi-danh-không-hợp-lệ, và phải báo cho sinh viên cùng cố vấn của họ, khi một điểm được nhập làm cho một môn tiên quyết đạt tạm thời trở thành chưa đạt.

## 3.5 Đánh giá điều kiện tài chính

**Mô tả.** Phép kiểm tình trạng tài chính tự động lúc ghi danh. Hiện thực FE-5 · UC-05 ·
Mục tiêu BO-4. **Độ ưu tiên:** Cao · **Bản phát hành:** 1.0

**Finance-1:** Hệ thống phải lấy số dư còn nợ và trạng thái khoá chặn đăng ký của sinh viên từ hệ thống tài chính trước khi xác nhận một lượt ghi danh, theo đúng BR-05.

**Finance-2:** Hệ thống phải trả về kết quả Đủ điều kiện, Bị chặn hoặc Không rõ, và phải ghi lại số tiền còn nợ tại thời điểm cho ra kết quả Bị chặn.

**Finance-3:** Hệ thống phải coi kết quả Không rõ là một lần từ chối kèm nút thử lại, và không được coi nó là Đủ điều kiện.

**Finance-4:** Hệ thống phải coi sinh viên có kế hoạch trả góp đang hiệu lực và không vi phạm là Đủ điều kiện, bất kể số dư còn nợ.

**Finance-5:** Hệ thống phải cho phép một Cán bộ Tài chính gỡ khoá chặn cho một sinh viên có tên, và phải ghi lại cán bộ đó, lý do và một ngày hết hiệu lực.

**Finance-6:** Hệ thống phải đánh giá lại tình trạng tài chính của mọi sinh viên đã ghi danh mỗi đêm, và phải phát một ngoại lệ tài chính chứ không được gỡ bỏ lượt ghi danh nào.

**Finance-7:** Hệ thống không được lưu chi tiết phương tiện thanh toán nào và bản ghi giao dịch nào, theo đúng CO-4.

## 3.6 Quy trình vượt sĩ số

**Mô tả.** Việc xin và quyết định có theo dõi cho một chỗ mà bình thường sinh viên không
vào được. Hiện thực FE-6 · UC-06 · Mục tiêu BO-3. **Độ ưu tiên:** Cao · **Bản phát hành:** 1.0

**Override-1:** Hệ thống phải cho phép sinh viên gửi một yêu cầu vượt sĩ số có nêu căn cứ và lời giải trình, cho một lớp có cho phép vượt sĩ số.

**Override-2:** Hệ thống phải định tuyến yêu cầu tới Trưởng bộ môn sở hữu lớp đó, và chỉ được nhận quyết định từ chính Trưởng bộ môn đó hoặc người được họ uỷ quyền có tên, theo đúng BR-11.

**Override-3:** Hệ thống phải ghi lại thời gian trôi qua từ lúc gửi tới lúc có quyết định cho mọi yêu cầu, đo theo hạn đặt ra ở BR-12.

**Override-4:** Hệ thống phải trình cho người quyết định trích lục bảng điểm của sinh viên, sĩ số hiện tại của lớp so với sức chứa, sức chứa phòng học và mọi yêu cầu đang chờ khác của cùng lớp đó.

**Override-5:** Hệ thống phải ghi lại người quyết, thời điểm quyết và một lý do bắt buộc cho mọi lần duyệt và mọi lần từ chối.

**Override-6:** Hệ thống phải leo thang lên Phòng Đào tạo mọi yêu cầu chưa được quyết sau thời hạn ở BR-12, và không được tự duyệt cũng không được tự từ chối.

**Override-7:** Hệ thống phải nâng sức chứa hiệu lực của lớp thêm một, chỉ dành cho sinh viên gửi yêu cầu, khi một lần vượt sĩ số được duyệt, và phải ghi danh sinh viên đó.

**Override-8:** Hệ thống phải ghi lại một lần duyệt mà không ghi danh được, phải báo cho sinh viên và người quyết định kèm đúng điều kiện đang chặn, và phải giữ hiệu lực của lần duyệt đó trong 72 giờ.

**Override-9:** Hệ thống phải đòi người quyết định xác nhận tường minh khi một lần duyệt sẽ đẩy sĩ số vượt quá sức chứa phòng học do hệ thống thời khoá biểu công bố.

## 3.7 Quản lý danh sách chờ

**Mô tả.** Một hàng chờ công bằng cho các lớp đã đầy, do hệ thống tự vận hành. Hiện thực
FE-7 · UC-07 · Mục tiêu BO-3. **Độ ưu tiên:** Trung bình · **Bản phát hành:** 1.0

**Wait-1:** Hệ thống chỉ được cho phép sinh viên vào danh sách chờ của một lớp đã đầy khi sinh viên đó thoả mọi luật ghi danh khác ngoài sĩ số.

**Wait-2:** Hệ thống phải giữ tối đa một vị trí chờ cho mỗi sinh viên với mỗi môn học.

**Wait-3:** Hệ thống phải mời chỗ được nhả ra cho sinh viên đứng cao nhất trong danh sách chờ mà vẫn thoả mọi luật ghi danh, theo đúng BR-08, và chỉ được mời một chỗ cho một sinh viên tại một thời điểm.

**Wait-4:** Hệ thống phải cho hết hạn một lời mời danh sách chờ không được trả lời sau khoảng thời gian định ra ở BR-09 và phải mời chỗ đó cho sinh viên đủ điều kiện kế tiếp.

**Wait-5:** Hệ thống phải giữ nguyên vị trí trong hàng chờ của sinh viên bị bỏ qua vì không đủ điều kiện, và phải báo cho sinh viên đó vì sao họ bị bỏ qua.

**Wait-6:** Hệ thống phải ghi danh sinh viên đã chọn tự động nhận mà không chờ phản hồi, và phải báo cho họ sau đó.

**Wait-7:** Hệ thống phải hoãn một giờ trước khi mời lại chỗ bị từ chối vì xung đột giờ học, để sinh viên đó có thể rút lớp gây xung đột.

**Wait-8:** Hệ thống phải vô hiệu một lời mời còn treo, và phải báo cho sinh viên kèm lý do, khi lớp bị huỷ hoặc sĩ số của nó bị giảm.

## 3.8 Rút, đổi và xử lý đợt thêm/bớt môn

**Mô tả.** Việc rời một lớp, và việc đổi lớp này lấy lớp khác một cách nguyên tử. Hiện
thực FE-8 · UC-08. **Độ ưu tiên:** Cao · **Bản phát hành:** 1.0

**Drop-1:** Hệ thống chỉ được cho phép rút mà không để lại dấu trên bảng điểm trong thời gian thêm/bớt môn, theo đúng BR-16, và phải nói rõ hệ quả trước khi hỏi xác nhận.

**Drop-2:** Hệ thống phải nhả chỗ của lớp bị rút và phải kích hoạt việc thăng suất danh sách chờ trong vòng 60 giây.

**Drop-3:** Hệ thống phải kiểm toàn bộ lớp thay thế trước khi nhả chỗ của lớp bị thay, và phải hoàn tất trọn vẹn một lần đổi lớp hoặc không thay đổi gì.

**Drop-4:** Hệ thống phải rút cả hai lớp của một cặp môn song hành khi một trong hai bị rút, theo đúng BR-20, và phải nói rõ điều này trước khi xác nhận.

**Drop-5:** Hệ thống phải cảnh báo sinh viên mà việc rút sẽ đưa họ xuống dưới số tín chỉ tối thiểu, phải gọi tên hệ quả đã được ghi nhận, và chỉ được tiến hành khi có xác nhận tường minh.

**Drop-6:** Hệ thống phải công bố mọi lượt rút sang hệ quản lý học tập.

## 3.9 Kiểm tra tiến độ tốt nghiệp thời gian thực

**Mô tả.** Việc nhìn thấy tiến độ chương trình một cách liên tục. Hiện thực FE-9 · UC-09 ·
Mục tiêu BO-6. **Độ ưu tiên:** Trung bình · **Bản phát hành:** 1.1

**Audit-1:** Hệ thống phải đánh giá mọi nhóm điều kiện của chương trình sinh viên đang học theo các môn đã hoàn thành, các lượt ghi danh đang học và tín chỉ chuyển đổi đã duyệt.

**Audit-2:** Hệ thống phải gán cho mỗi nhóm điều kiện một trạng thái Satisfied, InProgress, Outstanding hoặc NeedsReview, và phải gọi tên các môn đã thoả nó.

**Audit-3:** Hệ thống phải tính tỉ lệ hoàn thành tổng thể theo đúng BR-13.

**Audit-4:** Hệ thống phải gán NeedsReview, kèm lý do, cho mọi điều kiện nó không đánh giá nổi, và không được gán Satisfied hay Outstanding cho điều kiện đó.

**Audit-5:** Hệ thống phải đánh giá điều kiện chương trình của sinh viên bằng bộ luật có hiệu lực theo năm quy chế của họ, và phải nói rõ đã dùng năm quy chế nào, theo đúng CO-6.

**Audit-6:** Hệ thống phải nhận diện sinh viên có nguy cơ tốt nghiệp trễ theo đúng BR-18.

**Audit-7:** Hệ thống phải cho phép sinh viên đánh giá thử một môn dự kiến hoặc một chương trình dự kiến theo hồ sơ của mình mà không làm thay đổi bất kỳ trạng thái lưu trữ nào.

**Audit-8:** Hệ thống không được phục vụ kết quả kiểm tra nào được tính từ hơn 5 phút trước.

**Audit-9:** Hệ thống phải đánh dấu là tạm mọi điều kiện mà việc đánh giá nó phụ thuộc vào một điểm đang bị phúc khảo, và phải gọi tên môn học đó.

**Audit-10:** Hệ thống phải trình ra các nhóm điều kiện đã tính xong, và phải đánh dấu phần còn lại là đang chờ kèm nút thử lại, khi việc đánh giá không hoàn tất trong ngân sách thời gian của nó.

## 3.10 Số dư tài khoản và lịch sử thanh toán

**Mô tả.** Màn hình sinh viên xem mình nợ gì. Hiện thực FE-10 · UC-10 · Mục tiêu BO-6.
**Độ ưu tiên:** Trung bình · **Bản phát hành:** 1.1

**Account-1:** Hệ thống phải trình ra số dư còn nợ của sinh viên, các khoản cấu thành nó, và các lần đã nộp, lấy về từ hệ thống tài chính.

**Account-2:** Hệ thống phải tính chi phí ước tính cho một kế hoạch thời khoá biểu theo đúng BR-17, và phải ghi rõ đó là một ước tính.

**Account-3:** Hệ thống phải nói rõ, khi đang có một khoá chặn đăng ký, số tiền phải nộp để gỡ nó.

**Account-4:** Hệ thống chỉ được tiết lộ thông tin tài chính liên quan tới chính sinh viên đã xác thực.

**Account-5:** Hệ thống phải trình ra thời điểm các con số tài chính được lấy về từ hệ thống tài chính.

**Account-6:** Hệ thống phải trình ra các con số lấy về gần nhất kèm độ cũ của chúng khi hệ thống tài chính không truy cập được, và không được trình ra số dư bằng không trong hoàn cảnh đó.

## 3.11 Khả năng duy trì lớp và việc huỷ lớp

**Mô tả.** Việc tìm ra và huỷ kịp thời các lớp không đủ sĩ số. Hiện thực FE-11 · UC-11 ·
Mục tiêu BO-5. **Độ ưu tiên:** Thấp · **Bản phát hành:** 1.2

**Viability-1:** Hệ thống phải đánh giá mọi lớp so với sĩ số tối thiểu duy trì được của nó tại mốc kiểm định ra ở BR-10 và phải đánh dấu những lớp thấp hơn mức đó.

**Viability-2:** Hệ thống phải áp sĩ số tối thiểu duy trì được đã cấu hình cho lớp, hoặc của khoa nếu lớp chưa cấu hình, theo đúng BR-15.

**Viability-3:** Hệ thống phải nhả mọi lượt ghi danh và báo cho mọi sinh viên đã ghi danh và đang chờ khi một lớp bị huỷ, theo đúng BR-19, và chỉ được hoàn tất việc huỷ khi mọi lượt nhả đã được áp dụng.

**Viability-4:** Hệ thống phải trình ra các sinh viên bị ảnh hưởng bởi một đề xuất huỷ lớp, và những ai sẽ rơi xuống dưới số tín chỉ tối thiểu, trước khi quyết định được xác nhận.

**Viability-5:** Hệ thống phải nhận diện, trước khi xác nhận việc huỷ, mọi sinh viên mà lớp đó là bắt buộc để họ hoàn thành chương trình ngay học kỳ này, theo đúng BR-18, và phải đòi xác nhận tường minh.

**Viability-6:** Hệ thống phải ghi lại người quyết, thời điểm và một lý do cho mọi lần huỷ lớp và mọi quyết định vẫn mở lớp dưới mức tối thiểu.

**Viability-7:** Hệ thống chỉ được chuyển sinh viên giữa các lớp được gộp ở nơi không phát sinh xung đột giờ học, và phải liệt kê những ai không chuyển được.

**Viability-8:** Hệ thống phải phát một đầu việc theo dõi cho phòng học vụ khi một thông báo huỷ lớp không gửi tới nơi được.

## 3.12 Quản trị cửa sổ đăng ký

**Mô tả.** Việc điều khiển cửa sổ và các đợt ưu tiên của nó. Hiện thực FE-12 · UC-12 ·
Mục tiêu BO-1. **Độ ưu tiên:** Cao · **Bản phát hành:** 1.0

**Window-1:** Hệ thống phải xác định được, với bất kỳ sinh viên nào tại bất kỳ thời điểm nào, rằng đợt ưu tiên của họ có đang mở hay không, theo đúng BR-06.

**Window-2:** Hệ thống phải từ chối một cấu hình cửa sổ mà các đợt chồng nhau hoặc các đợt không bao gồm mỗi sinh viên đang hoạt động đúng một lần, và phải gọi tên các sinh viên hoặc chỗ chồng liên quan.

**Window-3:** Hệ thống phải từ chối việc mở cửa sổ cho một học kỳ chưa có danh mục lớp được công bố.

**Window-4:** Hệ thống phải ghi lại người làm, thời điểm và một lý do cho mọi thay đổi với một cửa sổ.

**Window-5:** Hệ thống phải cho phép Phòng Đào tạo gia hạn một cửa sổ đang mở, và phải báo cho mọi sinh viên bị ảnh hưởng.

**Window-6:** Hệ thống phải cho phép Phòng Đào tạo mở lại đăng ký chỉ cho những sinh viên có tên.

**Window-7:** Hệ thống phải cho các giao dịch ghi danh đang bay hoàn tất, và không được nhận giao dịch mới nào, khi một cửa sổ bị đóng.

**Window-8:** Hệ thống phải sinh ra, vào lúc cửa sổ đóng, một bản tổng kết về lượt ghi danh, lượt bị từ chối theo lý do, yêu cầu vượt sĩ số còn treo và độ dài danh sách chờ.

## 3.13 Hồ sơ cố vấn và khoá chặn

**Mô tả.** Việc ghi lại lời tư vấn và điều khiển khoá chặn cố vấn. Hiện thực FE-13 ·
UC-13. **Độ ưu tiên:** Thấp · **Bản phát hành:** 1.2

**Advise-1:** Hệ thống phải cho phép cố vấn được phân công cho một sinh viên ghi lại lời tư vấn đã đưa ra và kế hoạch đã thống nhất nếu có.

**Advise-2:** Hệ thống phải ngăn việc ghi danh của sinh viên đang mang khoá chặn cố vấn còn hiệu lực, theo đúng BR-14.

**Advise-3:** Hệ thống phải ghi lại người làm, thời điểm và một lý do mỗi khi một khoá chặn cố vấn được đặt hoặc được gỡ.

**Advise-4:** Hệ thống phải cho phép đặt một khoá chặn kèm ngày hết hiệu lực, sau ngày đó nó thôi áp dụng.

**Advise-5:** Hệ thống phải trình ra cho sinh viên việc có tồn tại một khoá chặn, phân loại lý do của nó và cố vấn cần liên hệ, và không được trình ra nội dung ghi chú tư vấn cho sinh viên.

**Advise-6:** Hệ thống chỉ được áp khoá chặn lên việc ghi danh trong tương lai, và không được đảo ngược các lượt ghi danh đã thực hiện.

**Advise-7:** Hệ thống phải báo cho Phòng Đào tạo, 72 giờ trước khi một cửa sổ mở, số lượng sinh viên còn đang mang khoá chặn chưa được gỡ.

## 3.14 Báo cáo ghi danh và sĩ số

**Mô tả.** Việc báo cáo theo sáu mục tiêu nghiệp vụ. Hiện thực FE-14 · UC-14.
**Độ ưu tiên:** Thấp · **Bản phát hành:** 2.0

**Report-1:** Hệ thống phải trình ra số lượt ghi danh, mức sử dụng sĩ số, lý do từ chối và hoạt động vượt sĩ số cho một giai đoạn và phạm vi được chọn.

**Report-2:** Hệ thống phải tính mọi con số được báo cáo bằng đúng định nghĩa đã ghi cho thước đo thành công tương ứng ở Vision and Scope §1.4.

**Report-3:** Hệ thống phải giới hạn các khoa, bộ môn và chương trình nhìn thấy được trong một báo cáo theo đúng những gì vai của người yêu cầu cho phép, và phải nói rõ khi một kết quả đã bị giới hạn bởi quyền hạn.

**Report-4:** Hệ thống phải trình ra thời gian quyết định vượt sĩ số đo theo hạn ở BR-12, theo từng bộ môn.

**Report-5:** Hệ thống phải trình ra một trạng thái cho biết không có dữ liệu nào cho giai đoạn được chọn, khác biệt với một giá trị bằng không.

**Report-6:** Hệ thống phải loại chi tiết tài chính của từng sinh viên ra khỏi mọi báo cáo mà người dùng khối học vụ truy cập được.

**Report-7:** Hệ thống phải tự sinh một bản tổng kết cửa sổ đăng ký khi một cửa sổ đóng.

---

# 4. Yêu cầu dữ liệu

## 4.1 Mô hình dữ liệu logic

Mô hình thực thể-quan hệ nằm ở **Phụ lục B**, Hình B-2. Nó là một mô hình *logic* mô tả
dữ liệu mà nhà trường làm việc cùng, không phải một schema cơ sở dữ liệu.

| Thực thể | Quan hệ |
|---|---|
| Programme | 1 → n Requirement Group · 1 → n Student |
| Requirement Group | n → n Course |
| Course | 1 → n Section · 1 → 0..n Prerequisite Rule · n → 0..n Course (môn song hành) |
| Section | 1 → n Meeting Pattern · 1 → n Enrollment · 1 → 0..n Waitlist Entry · 1 → 0..n Override Request |
| Student | 1 → n Enrollment · 1 → n Transcript Entry · 1 → 0..n Advising Hold · 1 → 0..n Advising Record · 1 → 0..1 Financial Standing |
| Registration Window | 1 → 3 Priority Wave |
| Degree Audit Result | 1 → n Requirement Group Result · 1 → 1 Student |

Có hai quan hệ ràng buộc thiết kế nhiều hơn những cái còn lại. **Course → Course (môn
song hành)** là quan hệ đối xứng và phải được lưu như vậy, nếu không BR-20 sẽ không cưỡng
chế nổi theo một chiều. Và **luật chương trình được phiên bản hoá theo năm quy chế**
(CO-6), nên quan hệ Programme → Requirement Group không đơn thuần là trạng thái hiện tại:
mọi phiên bản trước đều phải lấy lại được.

## 4.2 Từ điển dữ liệu

Định nghĩa, cấu thành, kiểu, độ dài và các giá trị cho phép của từng phần tử dữ liệu nằm
trong tài liệu **Data Dictionary** riêng (R4), gồm 91 mục.

## 4.3 Báo cáo

| Mã | Báo cáo | Nội dung và thứ tự sắp xếp | Đối tượng đọc | Tần suất |
|---|---|---|---|---|
| RPT-1 | Tổng kết cửa sổ đăng ký | Lượt ghi danh, lượt từ chối theo lý do, vượt sĩ số còn treo, độ dài danh sách chờ; theo khoa | Phòng Đào tạo, Phó hiệu trưởng | Lúc cửa sổ đóng |
| RPT-2 | Mức sử dụng sĩ số | Sĩ số so với sức chứa theo từng lớp; sắp theo mức sử dụng tăng dần | Trưởng bộ môn | Hằng tuần trong đợt đăng ký |
| RPT-3 | Hoạt động vượt sĩ số và SLA | Số yêu cầu, số quyết định, thời gian quyết định trung vị và percentile 90 so với BR-12; theo bộ môn | Phòng Đào tạo | Hằng tuần trong đợt đăng ký |
| RPT-4 | Khả năng duy trì lớp | Các lớp dưới sĩ số tối thiểu kèm số ngày còn lại tới thêm/bớt môn; sắp theo mức thiếu hụt | Trưởng bộ môn | Hằng ngày kể từ mốc kiểm BR-10 |
| RPT-5 | Ngoại lệ môn tiên quyết | Các lượt ghi danh trả về Không xác định hoặc bị vô hiệu; sắp theo ngày | Nhân viên học vụ | Hằng ngày trong đợt đăng ký |
| RPT-6 | Tác động của khoá chặn tài chính | Sinh viên bị chặn lúc đăng ký, số tiền còn nợ chia theo dải; **không hiện số tiền của từng cá nhân cho người dùng khối học vụ** | Cán bộ Tài chính | Hằng ngày trong đợt đăng ký |
| RPT-7 | Nguy cơ tốt nghiệp trễ | Các sinh viên được nhận diện có nguy cơ tốt nghiệp trễ theo BR-18; sắp theo mức thiếu hụt | Cố vấn học tập | Mỗi học kỳ |

Bố cục báo cáo để lại cho khâu thiết kế; mục này đặc tả nội dung, thứ tự sắp xếp, đối
tượng đọc và tần suất.

## 4.4 Thu thập, toàn vẹn, lưu trữ và huỷ dữ liệu

| # | Yêu cầu |
|---|---|
| DA-1 | Hệ thống phải thu nạp dữ liệu sinh viên, bảng điểm, chương trình đào tạo và danh mục từ hệ thống cũ bằng một lần chuyển đổi duy nhất, có đối chiếu với các tổng kiểm soát trước khi gỡ đóng băng hệ cũ. |
| DA-2 | Hệ thống phải đánh dấu là không đầy đủ mọi bảng điểm có từ trước 2019, và phải khiến việc đánh giá môn tiên quyết dựa trên nó trả về Không xác định, theo đúng giả định A3. |
| DA-3 | Hệ thống phải ghi lại, với mọi quyết định ghi danh, thời điểm, kết cục, lý do và mọi luật đã đánh giá, dù quyết định thành công hay thất bại. |
| DA-4 | Hệ thống phải lưu giữ hồ sơ ghi danh và hồ sơ học vụ suốt vòng đời của bản ghi sinh viên và không được xoá một mục bảng điểm nào. |
| DA-5 | Hệ thống phải lưu giữ ghi chú tư vấn trong 7 năm sau khi sinh viên tốt nghiệp hoặc thôi học, sau đó phải xoá chúng. |
| DA-6 | Hệ thống phải lưu giữ nhật ký kiểm toán đăng ký trong 3 năm. |
| DA-7 | Hệ thống phải kiểm hằng ngày rằng mọi chỗ đã bị chiếm đều khớp với đúng một lượt ghi danh hoặc đúng một lần vượt sĩ số đã duyệt, và phải phát cảnh báo chất lượng dữ liệu với mọi sai lệch. |
| DA-8 | Hệ thống phải lưu giữ mọi phiên bản trước của một luật được phiên bản hoá theo năm quy chế, theo đúng CO-6. |

---

# 5. Yêu cầu giao tiếp ngoài

## 5.1 Giao diện người dùng

| # | Yêu cầu |
|---|---|
| UI-1 | Hệ thống phải cung cấp bốn giao diện: giao diện sinh viên, giao diện nhân viên học vụ, giao diện trưởng bộ môn và giao diện cố vấn. |
| UI-2 | Giao diện sinh viên phải dùng được trên thiết bị di động ở bề rộng khung nhìn 360 px cho các màn hình danh mục, lập kế hoạch, ghi danh, kiểm tra tiến độ và tài khoản. |
| UI-3 | Mọi lần từ chối phải nói rõ luật cụ thể nào đã từ chối yêu cầu, giá trị nào gây ra điều đó, và người dùng làm được gì tiếp theo. |
| UI-4 | Mọi hành động không đảo ngược được phải đòi một lần xác nhận có gọi tên đối tượng bị tác động và nêu rõ hệ quả. |
| UI-5 | Hệ thống không được đòi hỏi tài liệu đào tạo nào cho giao diện sinh viên; một sinh viên phải hoàn tất được một lượt ghi danh mà không cần hướng dẫn. |
| UI-6 | Thiết kế màn hình cho ba use case phức tạp nhất được minh hoạ ở R5; chỗ nào R5 và tài liệu này khác nhau thì tài liệu này có thẩm quyền. |

## 5.2 Giao tiếp phần mềm

| Mã | Giao tiếp | Chiều | Nội dung | Mức dịch vụ |
|---|---|---|---|---|
| SI-1 | SSO của trường — xác thực | Vào | Khẳng định xác thực và khai báo vai trò (CO-1) | Theo chuẩn của trường |
| SI-2 | Hệ tài chính — truy vấn điều kiện | Vào | Số dư còn nợ và khoá chặn đăng ký (CO-7) | Phản hồi trong 5 giây; Không rõ sau khi thử lại (Finance-3) |
| SI-3 | Hệ tài chính — chi tiết tài khoản | Vào | Các khoản phải nộp, các lần đã nộp, kế hoạch trả góp | Nỗ lực tốt nhất; cho phép hiển thị dữ liệu cũ (Account-6) |
| SI-4 | Hệ thời khoá biểu — danh mục lớp | Vào | Lớp, lịch học, phòng, giảng viên | Công bố ít nhất 14 ngày trước một cửa sổ |
| SI-5 | Hệ thời khoá biểu — sức chứa phòng | Vào | Sức chứa vật lý của phòng theo từng lớp | Đọc lúc ra quyết định vượt sĩ số (Override-9) |
| SI-6 | Hệ quản lý học tập — công bố ghi danh | Ra | Lượt ghi danh đã xác nhận và lượt rút | Trong vòng 5 phút kể từ khi thay đổi |
| SI-7 | Hệ quản lý học tập — nhập điểm | Vào | Điểm cuối kỳ theo từng sinh viên, từng lớp | Hằng đêm; kích hoạt việc đánh giá lại Prereq-9 |
| SI-8 | Dịch vụ thông báo — tin nhắn cho sinh viên và nhân viên | Ra | Mở đợt, kết quả vượt sĩ số, lời mời danh sách chờ, việc huỷ lớp | Trong vòng 5 phút kể từ sự kiện kích hoạt |

**SI-2 và SI-3 phải được cô lập sau một lớp adapter** sao cho một API đồng bộ và một lượt
trao đổi tệp theo đêm thay thế được cho nhau (CO-7, rủi ro RI-1).

## 5.3 Giao tiếp phần cứng

| # | Yêu cầu |
|---|---|
| HI-1 | Hệ thống không được đòi hỏi phần cứng chuyên dụng nào. |
| HI-2 | Hệ thống phải hoạt động được trên các thiết bị cá nhân của sinh viên đang dùng phổ biến tại NRU, kể cả thiết bị đã bốn năm tuổi trên kết nối 3G (OE-4). |

## 5.4 Giao tiếp truyền thông

| # | Yêu cầu |
|---|---|
| CI-1 | Mọi liên lạc giữa trình duyệt và CARS phải dùng HTTPS với TLS 1.2 trở lên. |
| CI-2 | Mọi liên lạc giữa CARS và bất kỳ hệ thống ngoài nào phải dùng HTTPS với TLS 1.2 trở lên. |
| CI-3 | Hệ thống không được đặt mã định danh sinh viên và dữ liệu cá nhân nào vào chuỗi truy vấn của URL, vốn được ghi vào nhật ký truy cập. |
| CI-4 | Thông báo không được chứa số tiền nào và ghi chú tư vấn nào; chúng phải dẫn tới màn hình đã xác thực thay vì chứa nội dung đó. |

---

# 6. Thuộc tính chất lượng

Viết bằng Planguage: SCALE, METER, MUST, PLAN. Một thuộc tính không có con số là một ý
kiến, không phải một yêu cầu.

## 6.1 Hiệu năng và khả năng mở rộng

#### QA-1 — Tải đăng ký đồng thời ở mức đỉnh
| | |
|---|---|
| **SCALE** | Số phiên đã xác thực đồng thời chịu được với percentile 95 phản hồi ≤ 2 giây trên các màn hình danh mục, lập kế hoạch và ghi danh |
| **METER** | Thử tải ở buổi tổng duyệt, rồi quan sát khi chạy thật |
| **MUST** | 4.200 phiên đồng thời — mức đỉnh lịch sử mà hệ cũ không phục vụ nổi |
| **PLAN** | 6.000 phiên đồng thời (mục tiêu BO-1) |
| **Lý do** | Hệ cũ xuống cấp từ mốc 1.800 và sập ở ba trên bốn cửa sổ gần nhất. Đây là con số duy nhất mà dự án bị đem ra đánh giá. |

#### QA-2 — Độ trễ của giao dịch ghi danh
| | |
|---|---|
| **SCALE** | Số giây từ lúc sinh viên gửi yêu cầu ghi danh tới lúc nhận được quyết định |
| **METER** | Đo bằng công cụ đo thời gian, percentile 95, theo từng lần mở đợt |
| **MUST** | ≤ 4 giây ở mức đỉnh |
| **PLAN** | ≤ 1,5 giây ở mức đỉnh; ≤ 0,8 giây ngoài mức đỉnh |
| **Lý do** | Bảy lượt đánh giá luật và một lần chiếm chỗ diễn ra bên trong con số này. Một quyết định chậm lúc mở đợt sẽ sinh ra các lần thử lại, và chúng nhân lên chính cái tải đã gây ra nó. |

#### QA-3 — Thông lượng đọc danh mục
| | |
|---|---|
| **SCALE** | Số lượt đọc danh mục phục vụ được mỗi giây với percentile 95 phản hồi ≤ 1 giây |
| **METER** | Thử tải ở mức 1,5 lần đỉnh dự phóng |
| **MUST** | 2.800 lượt đọc/giây |
| **PLAN** | 4.200 lượt đọc/giây |
| **Lý do** | Sản lượng nằm ở việc duyệt, không nằm ở việc ghi danh (UC-01). Hệ cũ tính lại sĩ số cho từng dòng ở từng lượt yêu cầu; Catalog-3 cho phép cache 60 giây đúng vì lý do này. |

#### QA-4 — Tính toàn vẹn của chỗ dưới tranh chấp
| | |
|---|---|
| **SCALE** | Số chỗ bị cấp cho nhiều hơn một sinh viên, hoặc bị mất mà không được cấp cho ai, trong một cửa sổ đăng ký |
| **METER** | Đối soát theo DA-7, cộng với kiểm thử tiêm lỗi ở mức đồng thời đỉnh |
| **MUST** | 0 |
| **PLAN** | 0 |
| **Lý do** | Yêu cầu Enroll-6. Một chỗ bị cấp hai lần sẽ bị phát hiện bởi một sinh viên tới lớp và thấy phòng đã đầy, tức là thời điểm tốn kém nhất có thể để phát hiện ra nó. |

## 6.2 Độ sẵn sàng và độ tin cậy

#### QA-5 — Độ sẵn sàng trong một cửa sổ đăng ký
| | |
|---|---|
| **SCALE** | Tỉ lệ phần trăm số phút trong một cửa sổ đăng ký đang mở mà cả danh mục, lập kế hoạch và ghi danh đều khả dụng |
| **METER** | Giám sát uptime, theo từng cửa sổ |
| **MUST** | 99,5% |
| **PLAN** | 100% — **không lần sập nào** là tiêu chí chấp nhận ở Vision and Scope §3.2 |

#### QA-6 — Thời gian khôi phục trong một cửa sổ
| | |
|---|---|
| **SCALE** | Số phút từ lúc phát hiện một sự cố ngoài kế hoạch tới lúc việc đăng ký chạy lại được |
| **METER** | Diễn tập khôi phục thảm hoạ trước mỗi cửa sổ |
| **MUST** | ≤ 30 phút mà không mất lượt ghi danh nào |
| **PLAN** | ≤ 10 phút mà không mất lượt ghi danh nào |

#### QA-7 — Tính nguyên tử của các giao dịch học vụ
| | |
|---|---|
| **SCALE** | Số sinh viên bị bỏ lại ở trạng thái dở dang — nửa cặp môn song hành, một lần đổi lớp mà không có lớp nào, một lần vượt sĩ số đã duyệt mà không được ghi danh cũng không được ghi nhận |
| **METER** | Kiểm thử tiêm lỗi cho việc ghi danh, đổi lớp và vượt sĩ số |
| **MUST** | 0 |
| **PLAN** | 0 (Enroll-8, Drop-3, Override-8) |

## 6.3 Khả dụng và khả năng tiếp cận

#### QA-8 — Ghi danh không cần hướng dẫn
| | |
|---|---|
| **SCALE** | Tỉ lệ phần trăm sinh viên lần đầu hoàn tất được một lượt ghi danh mà không cần trợ giúp, ngay lần thử đầu tiên |
| **METER** | Buổi quan sát có 20 sinh viên năm nhất tình nguyện, trước buổi tổng duyệt |
| **MUST** | ≥ 90% |
| **PLAN** | ≥ 97% |
| **Lý do** | Yêu cầu UI-5. Có 12.000 sinh viên và một cửa sổ 72 giờ; một giao diện cần hỗ trợ là một giao diện không hỗ trợ nổi. |

#### QA-9 — Mức độ hiểu được của một lần từ chối
| | |
|---|---|
| **SCALE** | Tỉ lệ phần trăm sinh viên bị từ chối mà nói được, không cần gợi ý, vì sao họ bị từ chối và cần làm gì tiếp theo |
| **METER** | Cùng buổi quan sát đó, với các kịch bản bị từ chối |
| **MUST** | ≥ 90% |
| **PLAN** | ≥ 95% |
| **Lý do** | Một lần từ chối không ai hiểu sẽ trở thành một lượt hỏi cố vấn, tức là đúng cái chi phí mà mục tiêu BO-6 sinh ra để giảm. |

#### QA-10 — Khả năng tiếp cận
| | |
|---|---|
| **SCALE** | Mức tuân thủ đạt được so với WCAG 2.1 cho giao diện sinh viên |
| **METER** | Quét tự động cộng với rà soát thủ công đường ghi danh |
| **MUST** | Mức A, không có vấn đề gây chặn nào trên đường ghi danh |
| **PLAN** | Mức AA |

#### QA-11 — Hiệu năng trên di động
| | |
|---|---|
| **SCALE** | Số giây tới lúc tương tác được với danh mục trên một máy Android tầm trung đã bốn năm tuổi, dùng kết nối 3G |
| **METER** | Kiểm thử trên máy tham chiếu |
| **MUST** | ≤ 6 giây |
| **PLAN** | ≤ 3 giây |

## 6.4 An ninh và quyền riêng tư

#### QA-12 — Việc cưỡng chế phân quyền
| | |
|---|---|
| **SCALE** | Tỉ lệ phần trăm các thao tác có đặc quyền mà việc kiểm vai được cưỡng chế ở phía máy chủ chứ không chỉ ở giao diện |
| **METER** | Rà soát an ninh mọi thao tác ở mục 3 trước khi phát hành |
| **MUST** | 100% |
| **PLAN** | 100%, kèm các phép kiểm tự động phủ việc quyết định vượt sĩ số (BR-11), quản lý khoá chặn và cấu hình cửa sổ |

#### QA-13 — Cách ly dữ liệu giữa các sinh viên
| | |
|---|---|
| **SCALE** | Số lượt yêu cầu mà một sinh viên lấy được bảng điểm, bản kiểm tra tiến độ, ghi chú tư vấn hay dữ liệu tài chính của sinh viên khác |
| **METER** | Kiểm thử xâm nhập mọi endpoint hướng tới sinh viên, kể cả việc thay thế mã định danh |
| **MUST** | 0 |
| **PLAN** | 0 |

#### QA-14 — Tính đầy đủ của vết kiểm toán
| | |
|---|---|
| **SCALE** | Tỉ lệ phần trăm các quyết định ghi danh, quyết định vượt sĩ số và thay đổi khoá chặn mà truy xuất được người làm, thời điểm và lý do |
| **METER** | Lấy mẫu 50 bản ghi mỗi loại trong quá trình thẩm định yêu cầu |
| **MUST** | 100% |
| **PLAN** | 100%, truy xuất được trong vòng 5 giây |

## 6.5 Khả năng bảo trì

#### QA-15 — Chi phí của một lần đổi quy chế
| | |
|---|---|
| **SCALE** | Số ngày làm việc để áp một thay đổi lên bất kỳ luật nào được đánh dấu Động ở R3 §2.2, cho năm quy chế kế tiếp, mà không cần ra bản phần mềm mới |
| **METER** | Đo khi áp Quy chế học vụ 2027 |
| **MUST** | ≤ 3 ngày, không sửa mã |
| **PLAN** | ≤ 1 ngày (ràng buộc CO-5, CO-6) |
| **Lý do** | Quy chế được sửa hằng năm. Một hệ thống cần ra bản mới mới hấp thụ nổi điều đó sẽ lạc hậu trong vòng một năm kể từ lúc chạy thật. |

---

# 7. Yêu cầu quốc tế hoá và bản địa hoá

| # | Yêu cầu |
|---|---|
| IL-1 | Hệ thống phải trình bày các giao diện hướng tới sinh viên bằng tiếng Việt, kèm tiếng Anh cho các chương trình dạy bằng tiếng Anh. |
| IL-2 | Hệ thống phải nhận và lưu được dấu tiếng Việt ở mọi trường tên, và phải sắp xếp văn bản tiếng Việt theo luật đối chiếu tiếng Việt. |
| IL-3 | Hệ thống phải trình bày ngày theo dạng DD/MM/YYYY và giờ theo dạng 24 giờ. |
| IL-4 | Hệ thống phải trình bày số tiền theo đồng Việt Nam, không có phần thập phân. |
| IL-5 | Hệ thống phải lưu mọi dấu thời gian kèm độ lệch UTC tường minh và trình bày theo múi Asia/Ho_Chi_Minh. |

---

# 8. Yêu cầu khác

| # | Yêu cầu |
|---|---|
| OR-1 | Hệ thống phải lưu giữ và xoá dữ liệu cá nhân theo đúng Nghị định 13/2023/NĐ-CP và lịch lưu trữ hồ sơ của trường (DA-4 tới DA-6). |
| OR-2 | Hệ thống phải cài đặt được vào một môi trường mới từ cấu hình đã đưa vào quản lý phiên bản, không có bước thủ công nào chưa được tài liệu hoá. |
| OR-3 | Hệ thống phải được bàn giao kèm một sổ tay vận hành phủ việc mở cửa sổ, các sự cố về tải và phương án ghi danh thủ công dự phòng. |
| OR-4 | Việc chuyển đổi dữ liệu ở DA-1 phải lặp lại được trên một môi trường không phải production mà không còn dư lại gì từ các lần chạy trước. |
| OR-5 | Hệ thống phải cung cấp một phương án dự phòng thủ công đã được tài liệu hoá, cho phép Nhân viên học vụ ghi nhận một lượt ghi danh đơn lẻ trong lúc có sự cố, có đối soát về sau. |

---

# Phụ lục A: Bảng thuật ngữ

| Thuật ngữ | Định nghĩa |
|---|---|
| **Add/drop period** — Đợt thêm/bớt môn | Giai đoạn sau một cửa sổ, trong đó sinh viên được rút mà không để lại dấu trên bảng điểm; BR-16 |
| **Advising hold** — Khoá chặn cố vấn | Một khoá chặn ngăn ghi danh cho tới khi cố vấn gỡ nó; BR-14 |
| **Catalog year** — Năm quy chế | Năm học mà sinh viên được đánh giá theo quy chế của năm đó; CO-6 |
| **Co-requisite** — Môn song hành | Môn phải học trong cùng học kỳ với một môn khác; BR-20 |
| **Credit limit** — Trần tín chỉ | Số tín chỉ tối đa sinh viên được ghi danh mỗi học kỳ; BR-04 |
| **Degree audit** — Kiểm tra tiến độ tốt nghiệp | Việc đánh giá hồ sơ của sinh viên theo các điều kiện của chương trình họ học |
| **Minimum viable enrollment** — Sĩ số tối thiểu duy trì được | Mức sĩ số mà dưới đó lớp bị coi là không đủ sĩ số; BR-15 |
| **Override** — Vượt sĩ số | Việc cho phép sinh viên vào một lớp mà bình thường họ không vào được; UC-06 |
| **Prerequisite** — Môn tiên quyết | Môn phải hoàn thành trước một môn khác; BR-02 |
| **Priority wave** — Đợt ưu tiên | Khoảng thời gian mở đăng ký của một nhóm sinh viên; BR-06 |
| **Registration window** — Cửa sổ đăng ký | Khoảng 72 giờ mà việc đăng ký được mở |
| **Remaining capacity** — Sĩ số còn lại | Số chỗ vẫn còn trong một lớp; BR-03 |
| **Section** — Lớp học phần | Một lần mở lớp theo lịch của một môn trong một học kỳ |
| **Waitlist** — Danh sách chờ | Hàng chờ của một lớp đã đầy; BR-08, BR-09 |

# Phụ lục B: Mô hình phân tích

| Hình | Mô hình | Vị trí |
|---|---|---|
| B-1 | Context diagram của hệ thống | `diagrams/use-case-diagram.png` (ranh giới và các actor ngoài) |
| B-2 | Mô hình dữ liệu logic (ERD) | *sẽ dựng ở khâu thiết kế; thực thể và quan hệ liệt kê ở §4.1* |
| B-3 | Use case diagram | `diagrams/use-case-diagram.png` · bản nguồn sửa được `diagrams/use-case-diagram.drawio` |
| B-4 | Mô hình trạng thái của lượt ghi danh | Các trạng thái liệt kê ở mục *Enrollment Status* trong Data Dictionary; chuyển tiếp cho bởi hậu điều kiện của các use case |
| B-5 | Mô hình trạng thái của yêu cầu vượt sĩ số | Các trạng thái liệt kê ở mục *Request Status*; chuyển tiếp cho bởi UC-06 |
| B-6 | Mock-up màn hình | `mockups/` — xem R5 |

# Phụ lục C: Danh sách TBD

| # | Câu hỏi còn treo | Ảnh hưởng tới | Người chịu trách nhiệm | Hạn |
|---|---|---|---|---|
| TBD-1 | Trần tín chỉ ở BR-04 có tính các môn học lại đang trong tiến trình không, hay chỉ tính các lượt ghi danh mới? | Enroll-5 | Phòng Đào tạo | Tuần 6 |
| TBD-2 | SLA 48 giờ ở BR-12 là giờ làm việc hay giờ theo lịch? | Override-3, Override-6 | Phòng Đào tạo | Tuần 6 |
| TBD-3 | Khi một cặp môn song hành bị phá vỡ do huỷ lớp, lớp còn lại bị tự động rút hay chuyển cho cố vấn xử lý? | Drop-4, Viability-3 | Phòng Đào tạo | Tuần 7 |
| TBD-4 | Ngưỡng tài chính ở BR-05 áp theo từng học kỳ hay cộng dồn? | Finance-1 | Cán bộ Tài chính | Tuần 7 |
| TBD-5 | Những ngành nào không diễn đạt được thành luật máy đánh giá được, và chúng ảnh hưởng tới bao nhiêu sinh viên? | Prereq-5, giả định A2 | Phòng Đào tạo, các hội đồng chương trình | Tuần 8 — **chặn cam kết BO-2** |

# Phụ lục D: Ma trận truy vết yêu cầu

| Tính năng (R1 §2.1) | Mục SRS | Use case (R2) | Yêu cầu chức năng | Business rule (R3) | Mục tiêu |
|---|---|---|---|---|---|
| FE-1 Tra cứu danh mục | 3.1 | UC-01 | Catalog-1 … Catalog-7 | BR-03, BR-06 | BO-1 |
| FE-2 Lập kế hoạch thời khoá biểu | 3.2 | UC-02 | Plan-1 … Plan-7 | BR-02, BR-04, BR-07, BR-14, BR-20 | BO-1 |
| FE-3 Giao dịch ghi danh | 3.3 | UC-03 | Enroll-1 … Enroll-10 | BR-01, BR-03, BR-04, BR-06, BR-07, BR-14, BR-20 | BO-1, BO-2, BO-4 |
| FE-4 Bộ luật môn tiên quyết | 3.4 | UC-04 | Prereq-1 … Prereq-9 | BR-02, BR-20 | BO-2 |
| FE-5 Điều kiện tài chính | 3.5 | UC-05 | Finance-1 … Finance-7 | BR-05, BR-17 | BO-4 |
| FE-6 Quy trình vượt sĩ số | 3.6 | UC-06 | Override-1 … Override-9 | BR-02, BR-03, BR-11, BR-12 | BO-3 |
| FE-7 Danh sách chờ | 3.7 | UC-07 | Wait-1 … Wait-8 | BR-03, BR-07, BR-08, BR-09 | BO-3 |
| FE-8 Rút và đổi lớp | 3.8 | UC-08 | Drop-1 … Drop-6 | BR-04, BR-07, BR-08, BR-16, BR-20 | — |
| FE-9 Kiểm tra tiến độ tốt nghiệp | 3.9 | UC-09 | Audit-1 … Audit-10 | BR-02, BR-13, BR-18, BR-20 | BO-6 |
| FE-10 Số dư tài khoản | 3.10 | UC-10 | Account-1 … Account-6 | BR-05, BR-17 | BO-6 |
| FE-11 Khả năng duy trì lớp | 3.11 | UC-11 | Viability-1 … Viability-8 | BR-07, BR-10, BR-15, BR-18, BR-19 | BO-5 |
| FE-12 Quản trị cửa sổ đăng ký | 3.12 | UC-12 | Window-1 … Window-8 | BR-06 | BO-1 |
