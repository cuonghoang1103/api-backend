# Nhật ký sprint 9 (mẫu)

Phân ngày theo kế hoạch ước lượng ở bài 9.1 (sprint 10 ngày). Trên bản của khoá, mọi lượt chạy thật diễn ra ngày 24/11/2026 —
output trong bài 9.2 lấy từ các lượt đó. Mỗi ngày ba dòng: **Đã làm · Sẽ làm · Vướng/rủi ro**.

| Ngày | Đã làm | Sẽ làm | Vướng / rủi ro |
|---|---|---|---|
| 1 | Đo mốc: 50 test, e2e 3/3, golden giống hệt, Checkstyle 0, Node 24. Phân tích ảnh hưởng + ước lượng 8 ticket (32,2 giờ). Planning: PO chọn bảo mật trước, demo TV-95 thứ Sáu | TV-110 | TV-110 cần khoá trên máy chủ — đã hỏi anh Phong |
| 2 | TV-110: HMAC + khoá từ biến môi trường, đỏ 6/13 trên code cũ, 54 xanh. Mở PR | TV-111 | Mọi cookie cũ mất hiệu lực — ghi vào PR và RUI-RO; TV-123 (token không hạn) mở mới |
| 3 | TV-111: JSP vào WEB-INF/jsp; e2e đỏ (books.jsp 500 thay 404) rồi xanh | TV-113 | Bookmark .jsp sẽ 404 — báo chị Hà |
| 4 | TV-113: traPhieu một giao dịch; tiêm lỗi bằng trigger MySQL | sửa test TV-113 | Lượt đỏ đầu SAI lý do (NPE do mock thiếu getWriter, cả trước lẫn sau) — chưa mở PR |
| 5 | Sửa test TV-113: đỏ đúng (phiếu đã ghi trả 1 ≠ 0), 55 xanh. TV-41 cherry-pick sạch. Demo TV-95 dời sang thứ Hai (báo PO) | TV-95 | — |
| 6 | TV-95 web (cherry-pick ch5-ncs + test qua CSDL) và API Node (24 test) | TV-117 | NCS phải đổi cả 2 repo — 2 PR cùng mã ticket |
| 7 | TV-117: golden lần 1 thừa dòng trống ⇒ gộp directive; lần 2 chỉ 6 dòng/trang, duyệt. Demo TV-95 cho PO | TV-122 | — |
| 8 | TV-122: 4 test đặc tả xanh trên code cũ (phát hiện TV-125 CASCADE); Extract Class DocGiaDAO. Đếm 219 dòng ⇒ tách 2 PR | TV-121 | TV-125 là P1 — báo trưởng nhóm |
| 9 | TV-121 Java 21 (enforcer chặn JDK 17). Golden cuối thấy form độc giả đổi do TV-95 ⇒ commit duyệt trong PR TV-95 | Bàn giao | TV-124 (không phân quyền) tìm ra khi đọc LoginServlet |
| 10 | Lượt kiểm cuối JDK 21 (test, e2e, golden, Checkstyle). README, ban-do, RUI-RO; thử clone sạch có bấm giờ. Lời nhắn bàn giao | — | P1 cho sprint 10: TV-124, TV-125, TV-123 |

## Ước lượng và thực tế
Cột "thực tế" là của BẠN — ghi số giờ thật khi làm. Trên bản của khoá chỉ đo được kích thước PR (git diff --shortstat):
tv-41 6/6 · tv-110 109/12 · tv-111 22/14 (+6 rename) · tv-113 50/7 · tv-117 19/19 (golden) · tv-95 31/4 · tv-122-dac-ta 93/0 · tv-122 86/40 · tv-121 11/9 · ban-giao 140/4.
Ticket vượt bi quan thường là ticket có rủi ro chưa ghi vào cột bi quan — xem lại bảng ba điểm và tự hỏi rủi ro đó lẽ ra nhìn thấy từ lúc nào.
