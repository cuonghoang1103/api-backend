# CuongMini Code — AI lập trình của CuongThai


**AI Code của [CuongThai](https://cuongthai.com) ngay trong VS Code** — chat một bên, AI đọc và sửa code trong thư mục bạn đang mở, chạy lệnh, dùng skill, MCP, đưa dự án lên GitHub.

**Cài là dùng:** đăng nhập bằng tài khoản cuongthai.com (Google, GitHub, Apple hoặc mật khẩu) — không cần cài thêm gì. Đã có **app desktop CuongThai** đang mở thì extension tự chạy qua app (dùng chung việc, quyền và cài đặt với app).

Bộ máy là **đúng AI Code của app CuongThai**, nên chất lượng và tính năng giống hệt:

- Skill của dự án, bộ nhớ bài học, MCP, agent phụ
- Chọn model, mức nỗ lực, 5 chế độ quyền (Lập kế hoạch → Bỏ qua tất cả)
- Cổng riêng + cổng dự phòng khi cổng chính bảo trì
- Đính kèm ảnh (dán thẳng vào ô chat, cả ảnh HEIC của iPhone)
- Tự cài git/GitHub CLI, kết nối GitHub một bước, commit + đẩy giúp người mới

## Làm việc như Claude Code

- **Lịch sử việc** (🕘 trên đầu khung): mở lại việc cũ, ghim, đổi tên, xoá
- **Gõ `/`** — đủ bộ lệnh: `/plan`, `/review`, `/init`, `/rewind`, `/compact`, `/context`, `/model`, `/effort`, `/export`, `/memory`, `/mcp`, `/kynang`, `/doctor`… + lệnh riêng của dự án (`.claude/commands`)
- **Gõ `@`** — nhắc đúng file, thư mục, hay **hàm/lớp** trong dự án (tìm mờ, có cả "đoạn đang chọn")
- **Kéo thả** file/thư mục từ Explorer (giữ **Shift** khi thả) hoặc từ Finder/Explorer của máy; dán ảnh thẳng vào ô chat
- **Chọn model, mức nỗ lực, chế độ quyền** ngay dưới ô chat; **🎤 nói thay vì gõ**
- Dòng trạng thái **"Đang suy nghĩ… / Đang đọc file… / Đang code… (12s · bước 5)"**, giờ gửi + **✓ Đã gửi**, giờ trả lời xong, nút **Chép · Ghim · Thử lại**, khối code có **Chép / Chèn vào editor**
- Bấm vào dòng lệnh để xem **lệnh + toàn bộ kết quả**

## Có thêm nhờ ở trong VS Code

- **Thư mục đang mở** tự thành dự án của AI
- **File đang mở + đoạn đang bôi đen** tự gửi kèm làm ngữ cảnh (bấm chip 📄 để tắt)
- **💡 Nhờ CuongMini sửa lỗi này** ngay trên dấu lỗi (bóng đèn vàng)
- Chuột phải đoạn code → **Hỏi AI về đoạn đang chọn** (`Cmd/Ctrl+Alt+L`)
- Bấm tên file trong câu trả lời là mở file đó
- Chuột phải file/thư mục (Explorer hoặc tab editor) → **Thêm vào CuongMini Code**

## Bắt đầu

1. Mở thư mục dự án trong VS Code → bấm biểu tượng **CuongMini Code** ở thanh bên trái (hoặc `Cmd/Ctrl+Alt+C`).
2. Đăng nhập bằng tài khoản cuongthai.com (lần đầu). Chưa có tài khoản: đăng ký ở cuongthai.com.
3. Gõ việc cần làm. Thế thôi.

AI Code cần **gói Pro** của CuongThai.

Đổi nơi chạy: cài đặt **`cuongthai.cheDo`** — `tuDong` (mặc định), `docLap` (luôn chạy trong VS Code), `app` (chỉ qua app). Đăng xuất: lệnh **CuongThai: Đăng xuất**.

> Dùng VS Code Remote (SSH/WSL/Container): đăng nhập Google/GitHub/Apple cần trình duyệt trên cùng máy với extension — hãy dùng **tên đăng nhập + mật khẩu**.

## Riêng tư & an toàn

- Phiên đăng nhập cất trong kho bí mật của VS Code (Keychain / Windows Credential Manager / libsecret), không nằm trong file cài đặt.
- Đăng nhập bằng Google/GitHub/Apple diễn ra trên **trình duyệt thật** của bạn; token quay về extension qua `127.0.0.1` kèm mã dùng một lần — không đi qua máy nào khác.
- Khi chạy qua app, extension chỉ nói chuyện với app trên **chính máy bạn** (127.0.0.1) bằng khoá ngẫu nhiên mỗi lần mở app.
- Mọi thao tác sửa file, chạy lệnh, đẩy GitHub vẫn đi qua thẻ duyệt theo chế độ quyền bạn chọn.
