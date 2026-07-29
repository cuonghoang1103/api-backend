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

## Nhạc nền — ĐÃ GỠ BỎ

Bản gốc có ba bản nhạc do **Kounine** sáng tác riêng cho portfolio của Bruno
Simon (phát hành theo **CC0**). **Fork này đã gỡ cả ba** (`Sudo.mp3`, `Boy.mp3`,
`Baguira.mp3` — 18 MB) cùng file `license.md` CC0 đi kèm, vì đây là nhạc gắn với
danh tính của trang gốc, không phải nhạc của CuongThai.

Đi kèm việc gỡ:

- `sources/data/musics.js` — **file mới**, danh sách nhạc nền, hiện để rỗng
- Danh sách rỗng ⇒ không phát nhạc, và jukebox ở khu Bowling tự ẩn nút
  "Change song" (`BowlingArea.setJukebox`)
- Đã bỏ mục "Musics" trong hộp "Behind the scene" và dòng ghi công Kounine
  trong `sources/data/consoleLog.js`

**Toàn bộ hiệu ứng âm thanh chi tiết vẫn còn nguyên** — chim hót, cú, gà, sói,
dế, chuông, mưa, gió, sóng, lửa, va chạm đá/gạch/kim loại, click, trượt, lắp
ráp, TV, đổi đĩa… Chúng nằm ở `Audio.setAmbiants()` và `Audio.setOneOffs()`,
không dính gì tới nhạc nền.

Muốn gắn nhạc riêng: xem hướng dẫn ở đầu `sources/data/musics.js`.

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

Rà lại lần hai (30/7/2026) còn phát hiện và xử lý bốn chỗ sót:

| Chỗ | Vấn đề | Đã làm |
|---|---|---|
| Hộp "Behind the scene" (`sources/index.html`) | Viết ở ngôi thứ nhất nhưng quảng bá khoá học Three.js Journey, kênh YouTube devlog và kho mã của tác giả gốc, ký tên "— Bruno" | Viết lại: thêm mục "Original project" ghi công Bruno Simon đàng hoàng, bỏ mục khoá học/devlog, ký "— Cuong" |
| Hộp thoại Discord (`sources/index.html`) | "Contact me directly" trỏ vào tài khoản Discord cá nhân của tác giả gốc; đã thành mã chết sau khi đổi khu Mạng xã hội | Gỡ hẳn, để lại chú thích cách dựng lại |
| `TimeMachineArea.js` | Nút "Time Machine" mở `2019.bruno-simon.com` | Đổi sang hằng `TIME_MACHINE_URL`, trỏ về `cuongthai.com/games` |
| `data/consoleLog.js` | Ghi công nhạc Kounine trong khi nhạc đã bị gỡ | Bỏ dòng đó |

Phần **bắt buộc giữ** vẫn nguyên: `license.md`, mục `Credits` trong
`consoleLog.js`, và nay có thêm mục "Original project" trong hộp "Behind the
scene" — ghi công rõ hơn bản trước.

## Phần thêm mới, không có trong bản gốc

- Màn chào có nút Play (`sources/index.html`)
- Câu hỏi từ vựng tiếng Anh khi xe tông vỡ tường gạch
  (`sources/Game/World/VocabQuiz.js`), dữ liệu lấy từ mục My Language của
  cuongthai.com
