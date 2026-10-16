# CuongThai AI Code cho VS Code


**AI Code của [CuongThai](https://cuongthai.com) ngay trong VS Code** — chat một bên, AI đọc và sửa code trong thư mục bạn đang mở, chạy lệnh, dùng skill, MCP, đưa dự án lên GitHub.

Extension là khung chat; bộ máy là **app desktop CuongThai** đang chạy trên máy bạn. Vì vậy chất lượng và tính năng **giống hệt AI Code trong app**:

- Skill của dự án, bộ nhớ bài học, MCP, agent phụ
- Chọn model, mức nỗ lực, 5 chế độ quyền (Lập kế hoạch → Bỏ qua tất cả)
- Cổng riêng + **tự chuyển cổng dự phòng** khi cổng chính bảo trì
- Đính kèm ảnh (dán thẳng vào ô chat, cả ảnh HEIC của iPhone)
- Tự cài git/GitHub CLI, kết nối GitHub một bước, commit + đẩy giúp người mới

## Có thêm nhờ ở trong VS Code

- **Thư mục đang mở** tự thành dự án của AI
- **File đang mở + đoạn đang bôi đen** tự gửi kèm làm ngữ cảnh (bấm chip 📄 để tắt)
- **💡 Nhờ CuongThai AI sửa lỗi này** ngay trên dấu lỗi (bóng đèn vàng)
- Chuột phải đoạn code → **Hỏi AI về đoạn đang chọn** (`Cmd/Ctrl+Alt+L`)
- Bấm tên file trong câu trả lời là mở file đó

## Bắt đầu

1. Cài và đăng nhập app desktop CuongThai (cuongthai.com/download), để app chạy.
2. Mở thư mục dự án trong VS Code → bấm biểu tượng **CuongThai** ở thanh bên trái (hoặc `Cmd/Ctrl+Alt+C`).
3. Gõ việc cần làm. Thế thôi.

## Riêng tư & an toàn

Extension chỉ nói chuyện với app trên **chính máy bạn** (127.0.0.1), bằng khoá ngẫu nhiên mỗi lần mở app. Trang web hay máy khác không gọi được vào. Mọi thao tác sửa file, chạy lệnh, đẩy GitHub vẫn đi qua thẻ duyệt theo chế độ quyền bạn chọn.
