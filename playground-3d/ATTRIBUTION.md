# Ghi công và giấy phép

Thư mục này là một **bản fork** của portfolio mã nguồn mở `folio-2025`.

| | |
|---|---|
| Tác giả gốc | **Bruno Simon** |
| Bản quyền | Copyright (c) 2025 Bruno Simon |
| Giấy phép | **MIT** — xem `license.md` (giữ nguyên, không sửa) |
| Kho gốc | https://github.com/brunosimon/folio-2025 |
| Trang của tác giả | https://bruno-simon.com |

Giấy phép MIT cho phép dùng, sửa và phân phối lại, với **một điều kiện bắt buộc**:
phải giữ lại thông báo bản quyền và nội dung giấy phép. Vì vậy:

- **KHÔNG xoá `license.md`.**
- **KHÔNG xoá mục "Credits" trong `sources/data/consoleLog.js`** — đó là chỗ ghi
  công hiện ra cho người dùng.

## Nhạc nền

Ba bản nhạc trong `static/sounds/musics/` do **Kounine** sáng tác riêng cho
portfolio gốc, nay phát hành theo **CC0**. Bản `.wav` gốc đã bị bỏ khỏi fork này
để giảm dung lượng (130 MB); mã chỉ nạp bản `.mp3`, và bản `.wav` vẫn tải được
từ kho gốc nếu cần.

## Phông chữ

Chữ 3D trên mặt đất dựng bằng **`static/fonts/Pally-Bold.ttf`**, phông đã có sẵn
trong kho gốc.

⚠️ Bản gốc dùng phông **Neue Montreal Bold** cho chữ này — đó là phông **thương
mại**, tác giả cài riêng trên máy và **không** đóng gói vào kho. Đừng cố dùng lại
nó: máy sẽ không có phông, và kể cả có cũng vướng giấy phép.

## Những gì đã thay so với bản gốc

Toàn bộ **danh tính cá nhân** của tác giả gốc đã được thay bằng nội dung của
CuongThai — đây là phần giấy phép MIT *không* phủ, nên bắt buộc phải đổi:

- Tên hiển thị, tiêu đề trang, thẻ meta, ảnh chia sẻ mạng xã hội
- Bảng giới thiệu, khu Dự án, khu Lab, khu Sự nghiệp, khu Mạng xã hội
- Thông điệp console (giữ lại mục ghi công ở trên)
- Chữ 3D trên mặt đất: "BRUNO SIMON" → "CUONG THAI"

Đã **cố ý bỏ** những thứ thuộc riêng tác giả: cúp giải thưởng (Awwwards, FWA,
CSSDA), ảnh dự án khách hàng, và mọi liên hệ cá nhân.

## Phần thêm mới, không có trong bản gốc

- Màn chào có nút Play (`sources/index.html`)
- Câu hỏi từ vựng tiếng Anh khi xe tông vỡ tường gạch
  (`sources/Game/World/VocabQuiz.js`), dữ liệu lấy từ mục My Language của
  cuongthai.com
