# Checklist bảo mật trước phát hành (Pre-release Security Checklist)

> **Mục đích:** kiểm bảo mật theo danh mục có sẵn, có bằng chứng — không dựa vào trí nhớ.
> **Ai điền:** AppSec chủ trì; Dev, DevOps cung cấp bằng chứng; Pháp lý phần dữ liệu cá nhân.
> **Khi nào:** giai đoạn 12 · Bảo mật; chạy lại trước mỗi bản phát hành lớn.
> **Chuẩn tham chiếu:** OWASP ASVS 5.0 (chọn mức L1 / L2 / L3 theo rủi ro), OWASP Top 10, NIST SP 800-218 (SSDF), CWE Top 25. Checklist này là bản rút gọn — với yêu cầu cao, kiểm theo đầy đủ ASVS.

---

| Dự án | Phiên bản | Mức ASVS mục tiêu | Người kiểm | Ngày |
|---|---|---|---|---|

Cột **KQ**: ✓ đạt · ✗ không đạt · N/A — kèm **bằng chứng** (link PR, ảnh, log, báo cáo quét).

## 1. Xác thực & phiên
| # | Kiểm | KQ | Bằng chứng |
|---|---|---|---|
| 1.1 | Mật khẩu băm bằng thuật toán chậm (Argon2id / bcrypt), không tự chế | | |
| 1.2 | Giới hạn thử đăng nhập / rate limit | | |
| 1.3 | Phiên hết hạn, đăng xuất huỷ phiên; cookie `HttpOnly`, `Secure`, `SameSite` | | |
| 1.4 | Đặt lại mật khẩu bằng token một lần, có hạn | | |
| 1.5 | MFA cho tài khoản quản trị (nếu yêu cầu) | | |

## 2. Phân quyền
| # | Kiểm | KQ | Bằng chứng |
|---|---|---|---|
| 2.1 | Mọi API kiểm quyền ở server (không chỉ ẩn nút trên giao diện) | | |
| 2.2 | Chặn truy cập đối tượng của người khác (IDOR) | | |
| 2.3 | Quyền tối thiểu cho tài khoản dịch vụ / CSDL | | |

## 3. Nhập liệu & đầu ra
| # | Kiểm | KQ | Bằng chứng |
|---|---|---|---|
| 3.1 | Validate ở server (schema), truy vấn tham số hoá | | |
| 3.2 | Mã hoá đầu ra / làm sạch HTML chống XSS | | |
| 3.3 | Upload: kiểm loại, kích thước, tên tệp; lưu ngoài web root / object storage | | |
| 3.4 | Chống SSRF khi server gọi URL do người dùng cung cấp | | |

## 4. Bí mật & cấu hình
| # | Kiểm | KQ | Bằng chứng |
|---|---|---|---|
| 4.1 | Không có bí mật trong repo / lịch sử git (gitleaks) | | |
| 4.2 | Khoá API bên thứ ba chỉ ở server, không trong mã gửi về trình duyệt | | |
| 4.3 | Bí mật trong biến môi trường / kho bí mật, có quy trình xoay vòng | | |
| 4.4 | Chế độ debug tắt trên production; lỗi không lộ stack trace | | |

## 5. Giao vận & header
| # | Kiểm | KQ | Bằng chứng |
|---|---|---|---|
| 5.1 | HTTPS bắt buộc, HSTS | | |
| 5.2 | CSP, X-Content-Type-Options, Referrer-Policy, frame-ancestors | | |
| 5.3 | CORS chỉ mở cho origin cần thiết | | |

## 6. Phụ thuộc & chuỗi cung ứng
| # | Kiểm | KQ | Bằng chứng |
|---|---|---|---|
| 6.1 | Quét SCA (npm audit / Dependabot / Trivy) — không còn CVE nghiêm trọng đã có bản vá | | |
| 6.2 | SAST (Semgrep…) chạy trong CI | | |
| 6.3 | Ảnh container quét lỗ hổng, dùng ảnh nền chính thức | | |

## 7. Ghi log & giám sát
| # | Kiểm | KQ | Bằng chứng |
|---|---|---|---|
| 7.1 | Log sự kiện bảo mật (đăng nhập, đổi quyền) | | |
| 7.2 | Log không chứa mật khẩu, token, dữ liệu cá nhân | | |
| 7.3 | Cảnh báo bất thường tới người trực | | |

## 8. Dữ liệu cá nhân
| # | Kiểm | KQ | Bằng chứng |
|---|---|---|---|
| 8.1 | Chỉ thu thập dữ liệu cần thiết; có thông báo và đồng ý khi cần | | |
| 8.2 | Hồ sơ đánh giá tác động xử lý dữ liệu cá nhân (nếu áp dụng) | | |
| 8.3 | Có cách xuất / xoá dữ liệu theo yêu cầu chủ thể | | |

## 9. AI / LLM (nếu có)
| # | Kiểm | KQ | Bằng chứng |
|---|---|---|---|
| 9.1 | Chống prompt injection: tách chỉ dẫn hệ thống, không tin nội dung từ người dùng / tài liệu | | |
| 9.2 | Trần chi phí theo ngày / người dùng | | |
| 9.3 | Không gửi dữ liệu mật / cá nhân tới dịch vụ AI khi chưa được đồng ý | | |

## 10. Quét động (DAST)
| # | Kiểm | KQ | Bằng chứng |
|---|---|---|---|
| 10.1 | OWASP ZAP (baseline / full) trên staging — kết quả đã xử lý | | |

## Kết luận
| Lỗ hổng còn mở | Mức | Hướng xử lý | Chấp nhận rủi ro bởi (văn bản) |
|---|---|---|---|

☐ Đạt cổng bảo mật ☐ Chưa đạt

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh.*
