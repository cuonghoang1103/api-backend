# Xếp ưu tiên yêu cầu — Phân tích
## cho Hệ thống Quản lý Đơn hàng và Hoàn tất đơn (OMFS)

Phiên bản 1.0 đã duyệt
Người soạn: **<Tên thành viên 5>**, Nhóm Phân tích nghiệp vụ — Nhóm <N>
Nova Retail Group (NRG)
17 tháng 9 năm 2026

> Bảng tính nằm ở `deliverables/07-Requirements-Prioritization.xlsx`, dựng trên template
> chương 16 của Wiegers & Beatty và giữ nguyên công thức. Tài liệu này giải thích đầu
> vào, và giải thích đầu ra có nghĩa gì — cũng như không có nghĩa gì.

---

## 1. Mô hình

Mỗi tính năng ứng viên được chấm 1–9 trên bốn chiều, và bảng tính tính ra:

```
Total Value = Benefit × w_benefit + Penalty × w_penalty
Priority    = Value %  ÷  ( Cost % × w_cost  +  Risk % × w_risk )
```

**Benefit** và **Penalty** là hai câu hỏi khác nhau, và cả hai đều được hỏi một cách có
chủ ý. Benefit là giá trị khi tính năng có mặt; penalty là thiệt hại khi nó vắng mặt. Một
tính năng có thể điểm benefit thấp mà penalty cao — FE-12 (huỷ đơn) đúng là như vậy:
chẳng ai thích thú gì với nó, nhưng thiếu nó thì tồn kho đã giữ cứ bị khoá lại và vấn đề
bán vượt tồn quay lại dưới một hình dạng khác.

## 2. Trọng số, và vì sao

| Chiều | Trọng số | Biện minh |
|---|---|---|
| Benefit | **2** | Bài toán kinh doanh của COO dựa trên việc gỡ bỏ nút thắt cản trở tăng trưởng. Giá trị tạo ra nặng hơn thiệt hại tránh được. |
| Penalty | **1** | Mốc cơ sở. |
| Cost | **1** | Mốc cơ sở. |
| Risk | **0,5** | Mọi rủi ro kỹ thuật của dự án này đều có biện pháp giảm thiểu được gọi tên ở Vision & Scope §1.6, nên rủi ro là thật nhưng đã được kiểm soát. Đặt trọng số ngang chi phí sẽ phạt quá tay hai tính năng nặng về tích hợp, mà chúng lại chính là những cái mang lại mục tiêu BO-5. |

## 3. Những mục bị loại khỏi phần chấm điểm

Wiegers nói rõ rằng các tính năng bắt buộc phải có — vì lý do chính trị, hợp đồng hay
quy định — thì không nên chấm điểm, bởi xếp hạng một thứ không thể bỏ sẽ cho ra một con
số vô nghĩa. Các mục bị loại (xem sheet *Must-do (not scored)*):

| Mục | Vì sao không đánh đổi được |
|---|---|
| **FE-1** Nhận đơn từ nhiều kênh | Không thứ gì khác trong OMFS chạy được nếu không có bản ghi đơn hàng |
| **CO-1** Nhà cung cấp định danh của tập đoàn | Chính sách an ninh của tập đoàn |
| **CO-5** Không lưu dữ liệu thẻ thanh toán | Giữ cho OMFS nằm ngoài phạm vi PCI |
| **OR-1** Lưu trữ và xoá dữ liệu cá nhân | Nghị định 13/2023/NĐ-CP |

Còn lại mười ba tính năng, được chấm trong một lượt duy nhất — điều này quan trọng vì mọi
phần trăm trong bảng tính đều là tỉ lệ trên tổng của cột.

## 4. Kết quả

| Hạng | Tính năng | Value % | Cost % | Risk % | **Priority** |
|---:|---|---:|---:|---:|---:|
| 1 | FE-10 Thông báo cho khách và trang tự tra cứu | 7,84 | 5,17 | 4,00 | **1,094** |
| 2 | FE-2 Sàng lọc và kiểm tính hợp lệ của đơn | 7,45 | 5,17 | 4,00 | **1,039** |
| 3 | FE-6 Sinh và phát đợt nhặt hàng | 6,67 | 5,17 | 4,00 | **0,929** |
| 4 | FE-12 Huỷ và sửa đơn hàng | 6,67 | 5,17 | 6,00 | **0,816** |
| 5 | FE-11 Quản lý ngoại lệ hoàn tất đơn | 7,45 | 6,90 | 6,00 | **0,753** |
| 6 | FE-3 Tồn kho thời gian thực và ATP | 10,59 | 10,34 | 10,00 | **0,690** |
| 7 | FE-7 Nhặt và đóng gói có quét xác nhận | 8,63 | 8,62 | 8,00 | **0,684** |
| 8 | FE-4 Đồng bộ tồn kho ra các kênh | 9,41 | 8,62 | 12,00 | **0,644** |
| 9 | FE-9 Nhận sự kiện theo dõi từ hãng vận chuyển | 8,24 | 6,90 | 12,00 | **0,639** |
| 10 | FE-5 Định tuyến và tách đơn tự động | 9,80 | 12,07 | 10,00 | **0,574** |
| 11 | FE-14 Bảng điều khiển và đối soát chi phí | 5,10 | 6,90 | 4,00 | **0,573** |
| 12 | FE-8 So giá vận chuyển và mua nhãn | 7,45 | 10,34 | 14,00 | **0,430** |
| 13 | FE-13 Trả hàng và nhập lại kho | 4,71 | 8,62 | 6,00 | **0,405** |

## 5. Đối chiếu thứ hạng với kế hoạch phát hành — phần quan trọng nhất

**Thứ hạng và kế hoạch phát hành mâu thuẫn nhau, và kế hoạch phát hành mới là cái đúng.**

Bản 1.0 giao FE-2, FE-3, FE-4, FE-5, FE-6, FE-7 và FE-12. Ba trong số đó — FE-3, FE-4 và
FE-5 — nằm ở hạng 6, 8 và 10. Trong khi đó FE-10, cái mà mô hình xếp **hạng nhất**, lại
bị hoãn sang bản 1.2.

Đây không phải lỗi của mô hình, cũng không phải lỗi của kế hoạch. Đây là mô hình chạy
đúng như thiết kế, rồi bị bác vì một lý do mà mô hình không nhìn thấy được:

- **Mô hình thưởng cho các tính năng rẻ, an toàn, hữu ích.** FE-10 thật sự rẻ, an toàn
  và hữu ích, nên nó thắng. FE-5 đắt và phức tạp, nên nó thua.
- **Mô hình không có khái niệm về phụ thuộc hay thứ tự.** FE-10 cho khách xem trạng thái
  đơn hàng. Cho khách xem một trạng thái sai — vì hàng đã bị bán vượt tồn (FE-3) và đơn
  sắp bị huỷ — còn tệ hơn là không cho xem gì. FE-10 chỉ mang lại giá trị *sau khi* trạng
  thái trở nên đáng tin.
- **Mô hình không có khái niệm về bài toán kinh doanh.** BO-1 và BO-2 mới là thứ COO bỏ
  tiền ra mua. FE-3, FE-4 và FE-5 là những tính năng duy nhất mang lại chúng.

**Quyết định:** kế hoạch phát hành ở Vision & Scope §2.2 giữ nguyên. Bảng tính được dùng
cho hai việc khác — xếp thứ tự **bên trong** một bản phát hành, và quyết định bỏ cái gì
nếu bản phát hành bị trễ. Với câu hỏi thứ hai thì mô hình hữu dụng trực tiếp: nếu bản 1.0
buộc phải cắt phạm vi, **FE-6 và FE-12 bỏ sau cùng** (hạng 3 và 4, rẻ và ít rủi ro, nên
giữ chúng tốn rất ít), và **FE-7 là ứng viên đầu tiên để hoãn** (hạng 7, thứ đắt nhất
trong bản 1.0 mà không phải FE-3 hay FE-5, và kho vẫn có thể dùng phiếu in thêm một bản
phát hành nữa).

> Một bảng xếp ưu tiên mà đầu ra chỉ để tuân theo là một bảng chưa ai suy nghĩ về nó. Giá
> trị của nó là ép bất đồng lộ ra và buộc ai đó phải nêu một lý do.

## 6. Độ nhạy

Hai mức chấm đã được thử để xem ảnh hưởng tới thứ hạng:

| Thay đổi | Ảnh hưởng |
|---|---|
| Nâng trọng số rủi ro từ 0,5 lên 1,0 | FE-8 rơi từ hạng 12 xuống cuối bảng, FE-4 và FE-9 mỗi cái tụt hai bậc. Bốn vị trí đầu không đổi. Kết luận ở §5 không bị ảnh hưởng. |
| Hạ benefit của FE-3 từ 9 xuống 7 | FE-3 rơi từ hạng 6 xuống hạng 9. Vẫn ở giữa bảng — xác nhận rằng vị trí của FE-3 bị chi phối bởi *chi phí* của nó chứ không phải mức chấm, và không có mức chấm hợp lý nào khiến mô hình đồng ý với kế hoạch phát hành. |

Phép thử thứ hai mới là cái quan trọng hơn. Nó cho thấy bất đồng ở §5 mang tính cấu trúc,
không phải hệ quả của một lần chấm điểm rộng tay.
