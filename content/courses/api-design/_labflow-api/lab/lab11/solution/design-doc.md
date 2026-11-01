# Design doc — ClubHub API (đăng ký và check-in sự kiện CLB)

> Lời giải tham khảo Lab 11. Mọi "số đo" dẫn về bài đã đo trong khoá API Design; mọi "giả định" là giả định, nói to khi phỏng vấn.

## 1. Requirements

Người dùng: sinh viên (xem sự kiện, đăng ký, huỷ, xem vé QR), ban tổ chức CLB (tạo sự kiện, xem danh sách, quét vé ở cửa).
Use case chính: đăng ký một chỗ; hết chỗ thì vào hàng chờ (waitlist) có giới hạn; huỷ thì người đầu hàng chờ được lên;
check-in bằng mã vé, kể cả khi Wi-Fi hội trường rớt. Ngoài phạm vi: thanh toán, chat, gợi ý sự kiện.
Phi chức năng: không bao giờ vượt số chỗ (đúng tuyệt đối); đăng ký p99 < 500 ms lúc đỉnh; check-in p99 < 300 ms
khi có mạng; mất mạng tối đa 30 phút vẫn quét được; sẵn sàng 99,5% trong giờ sự kiện.

## 2. Estimates

Giả định: 60 CLB, ~8 sự kiện/tuần, 20.000 sinh viên dùng app. Ngày thường: vài nghìn lượt đọc, trung bình < 1 req/s.
Đỉnh: sự kiện hot mở đăng ký lúc 12:00, 3.000 người trong 60 giây ⇒ ~50 lượt đăng ký/s và ~500 đọc/s (mỗi người F5 ~10 lần).
Check-in: 500 người qua 4 cửa trong 20 phút ⇒ < 1 lượt/s — nhỏ, khó ở chỗ mất mạng chứ không ở tải.
Lưu trữ: ~400 sự kiện/năm × 300 đăng ký × ~200 byte ≈ 24 MB/năm (bảng 1 triệu lượt đặt của LabFlow đo 168 byte/dòng kể cả chỉ mục, bài 11.1).
Một tiến trình Node đọc ~8.000 req/s (đo bài 11.1) ⇒ đỉnh đọc dùng ~6% — nút thắt không phải thông lượng mà là tranh chấp chỗ cuối.

## 3. Resources and endpoints

Tài nguyên: events, registrations (con của event), check-ins (con của event), me/registrations.
- `GET /v1/events`, `POST /v1/events` (ban tổ chức), `GET /v1/events/{id}` (có seatsLeft, ETag).
- `POST /v1/events/{id}/registrations` ⇒ 201 với `status` CONFIRMED (kèm ticketCode) hoặc WAITLISTED (kèm waitlistPosition tính khi đọc).
- `DELETE /v1/events/{id}/registrations/{rid}` ⇒ 204, idempotent, đôn người đầu hàng chờ trong cùng transaction.
- `GET /v1/events/{id}/registrations` (danh sách người tham dự, chỉ ban tổ chức), `GET /v1/me/registrations`.
- `POST /v1/events/{id}/check-ins` ⇒ 201 lần đầu, 200 nếu vé đã check-in (ở cửa đó không phải lỗi); `GET …/check-ins`.

## 4. Errors and pagination

Mọi lỗi là `application/problem+json` (RFC 9457) có `code` máy đọc: ALREADY_REGISTERED (409), REGISTRATION_CLOSED và
WAITLIST_FULL (422), TICKET_NOT_CONFIRMED (422), RATE_LIMITED (429), INVALID_CURSOR (400). Ẩn đối tượng của người khác bằng 404 (bài 6.2).
Mọi danh sách phân trang bằng cursor (`limit` 1–100, `cursor`, `page.next`) vì danh sách check-in đổi liên tục trong lúc
đang đọc — offset sẽ lặp hoặc bỏ sót dòng (đo trên feed bài 11.4: lặp 1 bài khi có bài mới chen vào).

## 5. Auth, rate limits, versioning

JWT 15 phút (bài 6.1); vai trò lấy từ token: chỉ ORGANIZER của đúng CLB được tạo sự kiện, xem danh sách, check-in (403 nếu không).
Vé là mã ngẫu nhiên 128 bit, không phải mã số sinh viên (không đoán được, không lộ ai đi đâu).
Giới hạn: 10 lượt đăng ký/phút/sinh viên, 429 + Retry-After (bài 5.3); đọc giới hạn theo IP nhưng đủ rộng cho phòng máy sau một NAT.
Idempotency-Key trên POST đăng ký và POST check-in: mạng di động rớt phản hồi thì app gửi lại mà không tạo bản trùng
(chat bài 11.5: không khoá 66 tin trùng / 200, có khoá 0). Phiên bản trong URL `/v1`; "sự kiện thu phí" thêm trường tuỳ chọn
và trạng thái mới PENDING_PAYMENT chỉ trả cho client gửi `ClubHub-Version: 2` — app cũ không thấy giá trị enum lạ (bài 4.1).

## 6. Scale and trade-offs

Không vượt số chỗ: ràng buộc trong PostgreSQL, không phải kiểm trong code. Trong một transaction:
`UPDATE events SET seats_left = seats_left - 1 WHERE id = $1 AND seats_left > 0` — 0 dòng ⇒ thêm vào hàng chờ;
`UNIQUE (event_id, user_id)` chặn đăng ký hai lần. Bài 11.6 đo kiểu "kiểm rồi ghi": 50 người bấm, 50 người "thành công";
ràng buộc trong CSDL: đúng 1.
Đỉnh 12:00: một CSDL chịu được ~50 lượt ghi/s; nếu sự kiện lớn hơn nhiều, đưa đăng ký vào hàng đợi (202 + job, bài 10.1) và
trả kết quả qua thông báo — đánh đổi: người dùng chờ vài giây thay vì biết ngay. Ở quy mô CLB, KHÔNG làm (thêm độ phức tạp vô ích).
Check-in mất mạng: app tải trước danh sách vé của sự kiện (vài chục KB), quét offline, xếp hàng các lượt quét kèm
Idempotency-Key và scannedAt, có mạng thì gửi lại theo thứ tự; cùng vé quét ở hai cửa ⇒ lượt sau nhận 200 + lượt đầu.
Đôn hàng chờ: khi huỷ, cùng transaction đôn người đầu hàng chờ, ghi sự kiện vào outbox (bài 10.3) để gửi thông báo đẩy/email.
Màn hình "đã vào bao nhiêu người" ở cửa: SSE (bài 10.4: ~1 ms so với polling 2 s trễ 1,1 s).
Đã cân nhắc mà không chọn: giữ chỗ tạm (hold) 5 phút như bán vé — không cần vì sự kiện miễn phí, đăng ký là xong.
