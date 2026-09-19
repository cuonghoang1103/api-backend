# Xếp ưu tiên yêu cầu — Phân tích
## cho Hệ thống Học vụ và Đăng ký môn (CARS)

Phiên bản 1.0 đã duyệt
Người soạn: **<Tên thành viên 5>**, Nhóm Phân tích nghiệp vụ — Nhóm <N>
Northern Regional University (NRU)
17 tháng 9 năm 2026

> Bảng tính nằm ở `deliverables/07-Requirements-Prioritization.xlsx`, dựng trên template
> chương 16 và giữ nguyên các công thức. Tài liệu này giải thích đầu vào, và giải thích
> đầu ra có nghĩa gì — cũng như không có nghĩa gì.

---

## 1. Mô hình

```
Total Value = Benefit × w_benefit + Penalty × w_penalty
Priority    = Value %  ÷  ( Cost % × w_cost  +  Risk % × w_risk )
```

**Benefit và Penalty là hai câu hỏi khác nhau.** Benefit là giá trị khi tính năng có mặt;
penalty là thiệt hại khi nó vắng mặt. FE-12 (quản trị cửa sổ đăng ký) là ví dụ rõ nhất
của dự án này: chẳng ai hào hứng với nó, nhưng thiếu nó thì không mở nổi một đợt đăng ký
nào — benefit 7, penalty 9.

## 2. Trọng số, và vì sao

| Chiều | Trọng số | Biện minh |
|---|---|---|
| Benefit | **2** | Phó hiệu trưởng cấp tiền cho dự án này để chấm dứt tình trạng đăng ký thất bại và giải phóng giờ công nhân viên. Giá trị tạo ra nặng hơn thiệt hại tránh được. |
| Penalty | **1** | Mốc cơ sở. |
| Cost | **1** | Mốc cơ sở. |
| Risk | **0,5** | Mọi rủi ro trong Vision & Scope §1.6 đều có biện pháp giảm thiểu được gọi tên. Đặt trọng số rủi ro ngang chi phí sẽ đẩy FE-5 và FE-9 — hai tính năng gánh RI-1 và RI-2 — xuống đáy bảng, tức là để một rủi ro *đã được kiểm soát* đứng ra quyết định phạm vi. |

## 3. Những mục bị loại khỏi phần chấm điểm

| Mục | Vì sao không đánh đổi được |
|---|---|
| **FE-3** Giao dịch ghi danh | Hệ thống sinh ra để làm cho đúng một giao dịch này chạy được |
| **CO-1** SSO của trường | Chính sách an ninh của tổ chức |
| **CO-6** Phiên bản hoá luật theo năm quy chế | Quy chế học vụ §9.1 |
| **OR-1** Lưu trữ dữ liệu cá nhân | Nghị định 13/2023/NĐ-CP |

Mười ba tính năng được chấm trong một lượt duy nhất, vì mọi phần trăm trong bảng tính
đều là tỉ lệ trên tổng của cột.

## 4. Kết quả

| Hạng | Tính năng | Value % | Cost % | Risk % | **Priority** |
|---:|---|---:|---:|---:|---:|
| 1 | FE-12 Quản trị cửa sổ đăng ký | 8,68 | 5,08 | 4,17 | **1,211** |
| 2 | FE-2 Lập kế hoạch thời khoá biểu trước đợt đăng ký | 8,30 | 6,78 | 4,17 | **0,937** |
| 3 | FE-13 Hồ sơ cố vấn và các khoá chặn | 6,04 | 5,08 | 4,17 | **0,842** |
| 4 | FE-1 Tra cứu và duyệt danh mục môn học | 8,30 | 6,78 | 6,25 | **0,838** |
| 5 | FE-8 Rút, đổi và xử lý thêm/bớt môn | 7,55 | 6,78 | 6,25 | **0,762** |
| 6 | FE-10 Số dư tài khoản và lịch sử thanh toán | 6,42 | 5,08 | 8,33 | **0,693** |
| 7 | FE-6 Quy trình xin vượt sĩ số | 8,68 | 8,47 | 8,33 | **0,687** |
| 8 | FE-11 Khả năng duy trì lớp và việc huỷ lớp | 6,04 | 6,78 | 4,17 | **0,681** |
| 9 | FE-4 Bộ luật môn tiên quyết và môn song hành | 10,19 | 11,86 | 12,50 | **0,562** |
| 10 | FE-14 Báo cáo ghi danh và sĩ số | 4,91 | 6,78 | 4,17 | **0,553** |
| 11 | FE-7 Quản lý danh sách chờ | 6,42 | 8,47 | 6,25 | **0,553** |
| 12 | FE-5 Đánh giá điều kiện tài chính | 9,06 | 8,47 | 16,67 | **0,539** |
| 13 | FE-9 Kiểm tra tiến độ tốt nghiệp thời gian thực | 9,43 | 13,56 | 14,58 | **0,452** |

## 5. Đối chiếu thứ hạng với kế hoạch phát hành — phần quan trọng nhất

**Thứ hạng và kế hoạch phát hành mâu thuẫn nhau, và kế hoạch phát hành mới là cái đúng.**

Hãy nhìn xem mô hình thưởng cho cái gì và phạt cái gì:

- **FE-4, FE-5 và FE-9 giữ ba điểm Value % cao nhất bảng** — 10,19, 9,06 và 9,43. Chúng
  là những thứ giá trị nhất của dự án, và mô hình biết điều đó. Chúng vẫn xếp hạng 9, 12
  và 13, vì chúng đồng thời cũng đắt nhất và rủi ro nhất.
- **FE-12 thắng** nhờ rẻ, an toàn và không thể né — chứ không phải nhờ quan trọng.
- **FE-13 xếp hạng 3** mà lại bị hoãn sang bản 1.2, và không ai tranh cãi chuyện đó.

Đây là mô hình chạy đúng, rồi bị bác vì những lý do nó không nhìn thấy được:

1. **Mô hình không có khái niệm về bài toán kinh doanh.** BO-2 (640 giờ-người) và BO-4
   (240 giờ-người) mới là thứ Phó hiệu trưởng bỏ tiền ra mua. Chỉ FE-4 và FE-5 mang lại
   chúng. Một bản 1.0 dựng từ đỉnh bảng xếp hạng này sẽ mở được cửa sổ đăng ký rất đẹp mà
   vẫn kiểm từng môn tiên quyết bằng tay.
2. **Mô hình coi rủi ro là lý do để hoãn.** Rủi ro 8 của FE-5 hoàn toàn là RI-1 — nhà
   cung cấp hệ tài chính. Hoãn FE-5 không làm rủi ro đó giảm đi; nó chỉ làm ta phát hiện
   muộn hơn, lúc còn ít thời gian để vòng tránh. Ràng buộc CO-7 (lớp adapter) tồn tại
   đúng để dự án bắt đầu FE-5 được *trước khi* biết câu trả lời của nhà cung cấp.
3. **Mô hình không nhìn thấy quan hệ phụ thuộc.** FE-10 xếp hạng 6 nhưng vô giá trị nếu
   thiếu FE-5: nó hiển thị chính dữ liệu mà FE-5 lấy về.

**Quyết định:** kế hoạch phát hành ở Vision & Scope §2.2 giữ nguyên. Bảng tính được dùng
cho hai câu hỏi hẹp hơn:

- **Xếp thứ tự bên trong bản 1.0.** Dựng FE-12, FE-1 và FE-2 trước — chúng rẻ, ít rủi ro,
  và chúng là những thứ một đợt đăng ký thử cần có thì mới thử tải được bất cứ điều gì.
- **Bỏ cái gì nếu trễ tiến độ.** Theo thứ hạng thì **FE-7 (danh sách chờ) bỏ trước** —
  hạng 11, và cơ chế vượt sĩ số ở UC-06 phủ được cùng nhu cầu đó, kém công bằng hơn nhưng
  đủ dùng cho một học kỳ. **FE-4 và FE-5 thì không được bỏ**, vì bỏ chúng nghĩa là dự án
  giao ra một cửa sổ đăng ký nhanh hơn và không có chút tiết kiệm giờ công nào — mà chính
  phần tiết kiệm đó mới là lý do dự án được duyệt.

> Một bảng xếp ưu tiên mà đầu ra chỉ để tuân theo là một bảng chưa ai suy nghĩ về nó.

## 6. Độ nhạy

| Thay đổi | Ảnh hưởng |
|---|---|
| Nâng trọng số rủi ro từ 0,5 lên 1,0 | FE-5 rơi xuống cuối bảng và FE-9 xuống hạng 12. Những tính năng gánh giá trị của dự án còn chìm sâu hơn — xác nhận rằng trong mô hình này, thứ chôn chúng là *rủi ro* chứ không phải *chi phí*. |
| Hạ rủi ro của FE-5 từ 8 xuống 4 (tức nhà cung cấp xác nhận có API) | FE-5 leo từ hạng 12 lên hạng 5. Việc giá trị nhất mà nhóm có thể làm trong tuần 3 là đi lấy cho được câu trả lời đó, và cái bảng này định lượng lý do. |

Dòng thứ hai mới là đầu ra hữu ích của cả bài tập: nó biến câu "chắc phải đi thúc nhà
cung cấp hệ tài chính" thành câu "giải quyết xong RI-1 thì tính năng giá trị thứ tư của
chúng ta nhảy lên bảy bậc".
