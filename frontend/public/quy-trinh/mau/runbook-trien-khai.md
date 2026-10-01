# Runbook triển khai & quay lui (Deployment & Roll-back Runbook)

> **Mục đích:** ai trực cũng làm được việc triển khai, kiểm tra và quay lui theo đúng trình tự — không phụ thuộc trí nhớ của một người.
> **Ai điền:** DevOps / SRE chủ trì; Dev, Hạ tầng đóng góp; bàn giao cho khách và bộ phận hỗ trợ.
> **Khi nào:** dựng ở giai đoạn 13 · Hạ tầng & DevOps; dùng ở giai đoạn 15 · Quản lý phát hành và 16 · Triển khai & bàn giao; cập nhật sau mỗi sự cố.
> **Chuẩn tham chiếu:** ITIL® 4 (Deployment management), Google SRE (SLI / SLO), The Twelve-Factor App.

---

## 1. Tổng quan hệ thống
| Thành phần | Công nghệ | Nơi chạy | Cổng | Health check | Chủ sở hữu |
|---|---|---|---|---|---|

Sơ đồ hạ tầng: *[hình / link]*

## 2. Truy cập
| Tài nguyên | Cách truy cập | Ai có quyền | Nơi giữ bí mật |
|---|---|---|---|
Không ghi bí mật vào runbook — chỉ ghi **nơi** lấy bí mật.

## 3. Trước khi triển khai (Pre-flight)
- [ ] Biên bản duyệt phát hành đã ký; phiên bản: `vX.Y.Z` (tag git: `…`)
- [ ] Ảnh / bản cài dựng từ commit đã gắn tag, có checksum
- [ ] Backup CSDL mới nhất đã tạo **và đọc lại được**
- [ ] Migration đã chạy thử trên staging; tương thích ngược hoặc có kịch bản khôi phục
- [ ] Đủ dung lượng đĩa trên máy chủ (≥ …%)
- [ ] Người trực & kênh liên lạc khẩn đã thông báo; cửa sổ triển khai được duyệt

## 4. Các bước triển khai
| # | Bước | Lệnh / thao tác | Kết quả mong đợi | Thời gian |
|---|---|---|---|---|
| 1 | Kéo ảnh phiên bản mới | `…` | Ảnh có digest đúng | |
| 2 | Chạy migration | `…` | Không lỗi | |
| 3 | Thay container | `…` | Container healthy | |
| 4 | Smoke test | `curl -s -o /dev/null -w "%{http_code}" https://…/api/…` | 200 / 401 (không 404 / 5xx) | |
| 5 | Kiểm phiên bản đang chạy | `…` | Đúng `vX.Y.Z` | |
| 6 | Theo dõi log & số đo 30 phút | dashboard … | Không tăng lỗi | |

## 5. Smoke test
| Route / chức năng | Mong đợi |
|---|---|
| `GET /health` | 200 |
| `GET /api/…` (cần đăng nhập) | 401 khi chưa đăng nhập |

> 404 trên route lẽ ra phải có = bản build cũ / thiếu. Kiểm bộ smoke test định kỳ — công cụ dùng bên trong container phải thật sự có trong ảnh.

## 6. Quay lui (Roll-back)
**Khi nào bắt buộc quay lui:** smoke test đỏ · tỉ lệ lỗi 5xx > …% trong … phút · mất dữ liệu · người duyệt yêu cầu.

| # | Bước | Lệnh | Kiểm tra |
|---|---|---|---|
| 1 | Gắn lại ảnh phiên bản trước (còn giữ trên máy / registry) | `…` | |
| 2 | Khởi động lại dịch vụ với ảnh cũ | `…` | Smoke test xanh |
| 3 | Khôi phục CSDL (chỉ khi migration không tương thích ngược) | `…` | Đối soát số bản ghi |
| 4 | Thông báo người liên quan | | |

## 7. Cấu hình nằm ngoài ảnh
Liệt kê tệp cấu hình gắn ngoài (bind-mount), cách cập nhật **tại chỗ** và cách kiểm từ bên trong container (vd so `sha256sum`). Đẩy ảnh mới **không** cập nhật các tệp này.

## 8. Sao lưu & khôi phục
| Dữ liệu | Tần suất | Giữ bao lâu | Nơi lưu (3-2-1) | Lần thử khôi phục gần nhất |
|---|---|---|---|---|

Thủ tục khôi phục: …

## 9. Giám sát & cảnh báo
| Cảnh báo | Ngưỡng | Gửi tới | Việc cần làm |
|---|---|---|---|
| Dịch vụ không phản hồi | … | | Mục 6 |
| Đĩa > 80% | | | Dọn log / ảnh cũ |
| Chứng chỉ sắp hết hạn | 14 ngày | | Kiểm gia hạn tự động |

## 10. Liên hệ khẩn
| Vai trò | Họ tên | Kênh | Giờ |
|---|---|---|---|

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh. "Lệnh trả về 0" không có nghĩa là "đã có hiệu lực" — luôn kiểm kết quả thật.*
