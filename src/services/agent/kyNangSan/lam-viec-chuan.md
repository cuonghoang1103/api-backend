---
name: lam-viec-chuan
description: Quy trình làm việc của một kỹ sư giỏi cho MỌI việc lập trình khó hoặc nhiều bước — hiểu đúng yêu cầu, đọc mã trước khi sửa, lập kế hoạch, sửa nhỏ và kiểm bằng chạy thật, gỡ lỗi có hệ thống tới nguyên nhân gốc, không đoán, báo cáo trung thực. Dùng khi việc lớn, lỗi khó tìm, hoặc khi đã thử sửa một lần mà chưa được.
---

# KỸ NĂNG: LÀM VIỆC CHUẨN

## 1. Hiểu đúng việc
- Nhắc lại mục tiêu trong một câu. Việc có nhiều cách hiểu mà hậu quả khác nhau ⇒ hỏi MỘT câu gọn; còn lại tự chọn mặc định hợp lý và nói ra.
- Xác định "xong" nghĩa là gì và kiểm bằng cách nào — trước khi bắt đầu.

## 2. Đọc trước, sửa sau
- Tìm chỗ liên quan bằng tìm kiếm (tên hàm, chuỗi thông báo lỗi, route), đọc đủ để hiểu luồng: ai gọi, dữ liệu đi đâu.
- Đọc hướng dẫn của dự án (README, AGENTS.md/CLAUDE.md, ghi chú dự án) và làm theo quy ước sẵn có: đặt tên, cấu trúc thư mục,
  thư viện đang dùng. Viết giống mã xung quanh, không mang phong cách riêng vào.
- Không thêm thư viện khi thư viện sẵn có làm được. Không hạ phiên bản phụ thuộc để "chữa" lỗi kiểu.

## 3. Kế hoạch cho việc nhiều bước
Việc chạm ≥ 3 file hoặc nhiều chặng ⇒ lập kế hoạch ngắn (cập nhật kế hoạch khi làm), làm từng bước, kiểm sau mỗi bước.
Tách việc độc lập cho agent phụ khi được phép.

## 4. Sửa nhỏ, kiểm ngay
- Mỗi thay đổi nhỏ nhất đủ giải quyết vấn đề. Không "tiện tay" sửa thứ không được nhờ.
- Sau khi sửa: chạy đúng công cụ kiểm của dự án — kiểu (`tsc --noEmit`, `mypy`, `dotnet build`), test liên quan, lint, build.
  Giao diện ⇒ chạy lên và xem. API ⇒ gọi thật (`curl`) và đọc mã trạng thái + nội dung.
- "Build xanh" không có nghĩa "chạy đúng"; "lệnh trả về 0" không có nghĩa "đã có hiệu lực". Kiểm ĐẦU RA thật: dữ liệu đã vào DB chưa,
  trang có hiện đúng không, cấu hình mới đã được nạp chưa.

## 5. Gỡ lỗi có hệ thống
1. Tái hiện lỗi chắc chắn, đọc thông báo lỗi NGUYÊN VĂN (stack trace, log) — đừng đoán từ triệu chứng.
2. Khoanh vùng: lỗi ở đâu trong luồng? So sánh trường hợp chạy đúng và sai. Thêm log tạm có đánh dấu, xoá sau.
3. Nêu giả thuyết cụ thể, kiểm từng cái bằng một thí nghiệm nhỏ. Sửa NGUYÊN NHÂN GỐC, không bịt triệu chứng
   (không `try/catch` nuốt lỗi, không tăng timeout cho đỡ, không tắt test).
4. Đã sửa hai lần cùng một hướng mà không ăn ⇒ dừng lại, xét lại giả định — vấn đề nằm ở tầng khác.
5. Câu hỏi về DỮ LIỆU thì hỏi dữ liệu (truy vấn DB, gọi API) — mã chỉ nói điều CÓ THỂ xảy ra, dữ liệu nói điều ĐÃ xảy ra.

## 6. An toàn
- Hành động khó đảo ngược (xoá file/dữ liệu, `git push --force`, `reset --hard`, migration phá dữ liệu, gửi ra dịch vụ ngoài,
  đổi cấu hình máy đang chạy sản xuất) ⇒ nói rõ tác động và chờ người dùng đồng ý.
- Không bao giờ in/commit bí mật. Không tắt kiểm tra bảo mật để cho qua.
- Trước khi ghi đè/xoá, xem thứ sắp mất là gì.

## 7. Báo cáo trung thực
- Nói điều đã làm, đã kiểm bằng gì, và kết quả thật. Test đỏ thì nói đỏ, kèm đầu ra. Bước nào bỏ qua thì nói bỏ qua.
- Tách rõ "đã kiểm" với "chưa kiểm được / cần người dùng thử".
- Ngắn gọn: kết quả trước, chi tiết sau; đưa đường dẫn file và lệnh để người dùng tự kiểm lại.
