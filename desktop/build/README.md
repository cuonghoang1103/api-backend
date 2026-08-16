# Tài nguyên đóng gói

## `icon.png` (1024×1024)

Sinh ra từ **favicon của website** để app và web dùng chung một nhận diện.

Nguồn: `frontend/public/favicon.png` (512×512, nền trong suốt) — đây là favicon
thật mà `frontend/src/app/layout.tsx` khai báo. **Không** dùng
`frontend/public/favicon.svg`: file đó là placeholder gradient chữ "C" do công
cụ sinh mã tạo ra, và chính `layout.tsx` ghi chú rằng nó đã bị loại bỏ.

Dựng lại khi favicon web đổi:

```bash
cd desktop
node -e "
const sharp = require('sharp');
sharp('../frontend/public/favicon.png')
  .resize(904, 904, { kernel: 'lanczos3', fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } })
  .extend({ top: 60, bottom: 60, left: 60, right: 60, background: { r:0,g:0,b:0,alpha:0 } })
  .png().toFile('build/icon.png');
"
```

Hai chi tiết trong lệnh trên là có lý do:

- **Phóng 512 → 1024.** Nguồn chỉ có 512px nên đây là phóng to 2×, ảnh mềm đi
  một chút. Chấp nhận được vì icon thực tế hiển thị ở 128px trở xuống (Dock,
  taskbar, Start menu). Nếu sau này có bản gốc lớn hơn thì dùng bản đó.
- **Chừa lề 6%** (904px hình + 60px mỗi bên). macOS bo thêm góc icon trên Dock;
  hình sát mép sẽ bị cắt mất phần rìa.

electron-builder tự sinh `.icns` (macOS) và `.ico` (Windows) từ file PNG này —
không cần tạo tay hai định dạng đó.
