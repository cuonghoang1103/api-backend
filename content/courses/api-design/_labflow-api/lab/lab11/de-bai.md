# Lab 11 — Phỏng vấn thử: API đăng ký và check-in sự kiện CLB

Đề người phỏng vấn đọc (nguyên văn, 45 phút):

> "Trường có khoảng 60 câu lạc bộ. Mỗi CLB tổ chức workshop, hackathon, buổi giao lưu — có sự kiện 50 chỗ,
> có sự kiện 500 chỗ. Sinh viên đăng ký trên app; hết chỗ thì vào hàng chờ. Hôm diễn ra sự kiện, ban tổ chức
> quét mã QR ở cửa để check-in, Wi-Fi hội trường hay chập chờn. Hãy thiết kế API cho hệ thống này."

Câu hỏi người phỏng vấn sẽ hỏi thêm (đừng đọc trước nếu muốn tập thật):

1. Sự kiện hot mở đăng ký lúc 12:00, 3.000 sinh viên bấm cùng phút. Chuyện gì xảy ra với API của bạn?
2. Hai người bấm "Đăng ký" cùng lúc cho chỗ cuối cùng — ai được?
3. Điện thoại của ban tổ chức mất mạng giữa lúc quét; mạng có lại thì sao? Quét hai lần một vé thì sao?
4. Một bạn huỷ đăng ký — người đầu hàng chờ biết bằng cách nào?
5. Ai được xem danh sách người tham dự? Ai được check-in?
6. Sang năm thêm "sự kiện có thu phí" — API đổi thế nào mà app cũ không vỡ?

Nộp: `design-doc.md` (6 mục như mẫu) + `openapi.yaml` (OpenAPI 3.1). Tự chấm:

    node lab/grade-lab11.mjs lab/lab11/design-doc.md lab/lab11/openapi.yaml

Rồi chấm phần "nói" bằng thang 6 tiêu chí của bài 11.1 (nhờ bạn đóng vai người phỏng vấn, bấm giờ 45 phút).
