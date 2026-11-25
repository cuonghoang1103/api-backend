## [TV-122 · 1/2] Characterization test cho ReaderServlet (không đổi dòng nào trong src/main)

### 1. Nguyên nhân gốc
Không có lỗi để sửa — đây là lưới an toàn trước khi refactor (TV-122 phần 2). PR riêng vì cả ticket 219 dòng > luật 200.

### 2. Phạm vi ảnh hưởng
Chỉ thêm test: thứ tự danh sách độc giả và phiếu đang mượn, chuyển hướng khi chưa đăng nhập, lỗi bị nuốt khi thiếu tên, và bug mất dữ liệu khoá với tên _BUG_TV125 (xoá độc giả xoá luôn phiếu đang mượn).

### 3. Cách kiểm
4/4 xanh trên code cũ (đúng yêu cầu của characterization test). Cả bộ 61/61.

### 4. Rủi ro / đường lùi
Phát hiện TV-125 (P1) — ghi vào RUI-RO.md, không sửa ở đây.
