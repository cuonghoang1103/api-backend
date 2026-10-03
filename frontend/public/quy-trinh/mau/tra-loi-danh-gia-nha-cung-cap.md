# Bảng trả lời đánh giá nhà cung cấp (Vendor Security Questionnaire — Answers)

> **Mục đích:** trả lời sẵn các câu hỏi bảo mật & tuân thủ mà doanh nghiệp thường gửi trước khi ký hợp đồng phát triển phần mềm.
> **Ai dùng:** bộ phận mua hàng / bảo mật / pháp lý của khách; studio điền phần còn trống theo từng dự án.
> **Bản trực tuyến:** https://cuongthai.com/about/bao-mat
> **Nguyên tắc:** chỉ ghi những gì đang thật sự áp dụng. Thứ chưa có được ghi ở mục 5, kèm cách bù.
> ⚠️ Tài liệu này mô tả cách studio làm việc, **không phải tư vấn pháp lý**. Nghĩa vụ pháp lý cụ thể của từng dự án cần được luật sư của khách xác nhận.

---

| Khách hàng | Dự án | Người trả lời | Ngày | Phiên bản |
|---|---|---|---|---|
| | | | | |

## 1. Thông tin chung

| # | Câu hỏi | Trả lời |
|---|---|---|
| 1.1 | Quy mô đội ngũ | Một kỹ sư chính. Cộng tác viên (nếu có) chỉ tham gia khi khách chấp thuận bằng văn bản và ký NDA riêng. |
| 1.2 | Chứng nhận bảo mật (ISO/IEC 27001, SOC 2…) | **Chưa có.** Bù lại: chấp nhận audit của khách hoặc bên thứ ba khách chỉ định; có thể làm việc trên hạ tầng của khách để kế thừa các kiểm soát đã được chứng nhận. |
| 1.3 | Bảo hiểm trách nhiệm nghề nghiệp | **Chưa có.** Giới hạn trách nhiệm, bảo hành và nghiệm thu ghi rõ trong hợp đồng; thanh toán theo mốc nghiệm thu. |
| 1.4 | Kênh liên hệ bảo mật | Email ghi trong https://cuongthai.com/.well-known/security.txt |

## 2. Dữ liệu & quyền riêng tư

| # | Câu hỏi | Trả lời |
|---|---|---|
| 2.1 | Có ký NDA / DPA không? | Có. NDA ký **trước** khi khách chia sẻ tài liệu nội bộ hay dữ liệu thật. Dự án có dữ liệu cá nhân thì ký thêm DPA: khách là Bên Kiểm soát, studio là Bên Xử lý. Mẫu: `/quy-trinh/mau/nda.md`, `/quy-trinh/mau/dpa.md`. |
| 2.2 | Dữ liệu lưu ở đâu? | Theo DPA. Mặc định trên hạ tầng do khách sở hữu (tài khoản cloud/VPS của khách). Nếu studio vận hành, nhà cung cấp và vị trí được ghi trong DPA trước khi triển khai. |
| 2.3 | Tối thiểu dữ liệu | Phát triển và kiểm thử bằng dữ liệu giả hoặc đã ẩn danh. Dữ liệu thật chỉ dùng khi thật sự cần, chỉ phần cần thiết, có khách đồng ý bằng văn bản. |
| 2.4 | Ai được truy cập dữ liệu? | Kỹ sư chính của studio và những người khách chấp thuận bằng văn bản; quyền theo đúng phần việc, thu hồi khi xong. |
| 2.5 | Bên xử lý phụ (sub-processors) | Chốt trong DPA, khách duyệt từng bên; thêm bên mới phải báo trước để khách có quyền phản đối. Danh sách bên mà sản phẩm của chính studio đang dùng: xem mục 6. |
| 2.6 | Xử lý dữ liệu khi kết thúc hợp đồng | Trả lại theo định dạng thoả thuận → xoá mọi bản sao phía studio (kể cả bản sao lưu) → thu hồi khoá, tài khoản → lập biên bản xoá dữ liệu có chữ ký. Phần luật buộc lưu giữ được ghi rõ trong biên bản. Mẫu: `/quy-trinh/mau/ke-hoach-ngung-he-thong.md`. |
| 2.7 | Căn cứ pháp lý tại Việt Nam | Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP (hiệu lực 01/01/2026, thay thế Nghị định 13/2023/NĐ-CP) — yêu cầu xoá hợp lệ: phản hồi trong 2 ngày làm việc, hoàn tất trong 20 ngày. Luật An ninh mạng 2018 (24/2018/QH14) và văn bản hướng dẫn/thay thế hiện hành. |

## 3. Kiểm soát kỹ thuật (trên sản phẩm của chính studio)

> Mô tả ở mức nguyên tắc. Địa chỉ máy chủ, cổng, tên cấu hình và chi tiết tường lửa không công bố — có thể trình bày trực tiếp theo NDA.

| # | Câu hỏi | Trả lời |
|---|---|---|
| 3.1 | Mã hoá khi truyền | Có. HTTP chuyển hướng sang HTTPS; chỉ TLS 1.2 / 1.3; có HSTS. Lưu lượng đi qua Cloudflare rồi tới reverse proxy. |
| 3.2 | Mã hoá khi lưu | Mật khẩu băm bcrypt. Lưu trữ đối tượng Cloudflare R2 mã hoá khi lưu theo công bố của Cloudflare. Mã hoá đĩa / CSDL khi lưu phụ thuộc hạ tầng được chọn và chốt theo yêu cầu của khách — studio **không** khẳng định mặc định. |
| 3.3 | Truy cập máy chủ | SSH chỉ bằng khoá; đăng nhập mật khẩu và đăng nhập tương tác đã tắt. |
| 3.4 | Quản lý bí mật | File môi trường bị loại khỏi git; bí mật lúc chạy nằm trên máy chủ, ngoài kho mã. Khoá API bên thứ ba không đóng vào mã chạy trên trình duyệt — đi qua route proxy có xác thực ở backend. |
| 3.5 | Phân quyền | Kiểm ở máy chủ bằng middleware theo vai trò; vai trò đọc lại từ CSDL mỗi yêu cầu, có phiên bản vai trò để vô hiệu phiên khi đổi quyền. |
| 3.6 | MFA cho quản trị | **Chưa có** trên site của studio. Sản phẩm của khách có MFA cho quản trị khi yêu cầu; có thể làm việc trên tài khoản/SSO của khách. |
| 3.7 | Chống lạm dụng | Giới hạn tần suất chung cho API, chặt hơn cho đăng nhập và tải file; khoá giới hạn theo IP thật sau chuỗi proxy tin cậy. Header bảo mật bằng Helmet. |
| 3.8 | Sao lưu | CSDL sao lưu tự động mỗi đêm, giữ 30 ngày; có cơ chế gửi bản sao ra kho lưu trữ riêng tư ngoài máy chủ bằng khoá riêng cho sao lưu; có script khôi phục thử vào CSDL tạm. Với dự án khách: tần suất, thời gian giữ, RPO/RTO chốt trong hợp đồng. |
| 3.9 | Theo dõi lỗi | Có tích hợp Sentry (bật khi cấu hình); sự kiện bị lọc cookie, header xác thực, thân yêu cầu, email/IP người dùng trước khi gửi. |
| 3.10 | Vận hành | Job hằng tuần dọn ảnh/cache build cũ để tránh đầy đĩa. |

## 4. Phát triển & phát hành an toàn

| # | Câu hỏi | Trả lời |
|---|---|---|
| 4.1 | Quy trình triển khai | Đẩy mã lên nhánh chính **không** tự triển khai. Ảnh được dựng (biên dịch, kiểm kiểu) ở môi trường build riêng và phải khởi động được trước khi đẩy; máy chủ chỉ kéo về và tráo. Sau tráo có smoke-test các route lõi; cấu hình proxy kiểm cú pháp trước khi nạp, hỏng thì tự trả bản cũ; bộ kiểm thử bắt buộc phải xanh thì mã mới lên nhánh chính. |
| 4.2 | Rollback | Bằng `git revert` hoặc ảnh trước đó; không bao giờ ghi đè lịch sử (force push). |
| 4.3 | Kiểm bảo mật trước phát hành | Checklist rút gọn từ OWASP ASVS 5.0, OWASP Top 10, NIST SSDF; mỗi dòng có bằng chứng. Mẫu: `/quy-trinh/mau/checklist-bao-mat.md`. |
| 4.4 | Quyền sở hữu mã nguồn | Thuộc về khách sau khi thanh toán theo hợp đồng. Bàn giao kèm tài liệu, runbook và quyền truy cập hạ tầng để đội khác tiếp quản được. |

## 5. Sự cố

| # | Câu hỏi | Trả lời |
|---|---|---|
| 5.1 | Thời gian phản hồi sự cố | **Theo SLA trong hợp đồng / hợp đồng bảo trì.** Điền: P1 … · P2 … · P3 … |
| 5.2 | Thông báo vi phạm dữ liệu cá nhân | Studio (Bên Xử lý) báo ngay cho khách (Bên Kiểm soát) để khách thực hiện nghĩa vụ thông báo theo luật. |
| 5.3 | Sau sự cố | Báo cáo postmortem không đổ lỗi: dòng thời gian, nguyên nhân gốc, việc sửa hệ thống. Mẫu: `/quy-trinh/mau/bao-cao-su-co-postmortem.md`. |

## 6. Bên xử lý phụ mà sản phẩm của studio (cuongthai.com) đang dùng

> Với dự án của khách, danh sách được chốt riêng trong hợp đồng/DPA.

| Bên | Dùng cho | Dữ liệu đi qua |
|---|---|---|
| VPS thuê | Chạy ứng dụng, CSDL PostgreSQL, bản sao lưu cục bộ | Toàn bộ dữ liệu ứng dụng |
| Cloudflare | DNS, proxy/CDN; R2 lưu file tải lên và bản sao lưu ngoài máy chủ | Lưu lượng HTTPS; file người dùng tải lên |
| GitHub | Mã nguồn, CI, job vận hành | Mã nguồn (không có dữ liệu người dùng) |
| modelapi.vn | Cổng LLM chính cho tính năng AI | Nội dung người dùng gửi vào tính năng AI |
| rambo.ai.vn | Cổng LLM thứ hai (trợ lý lập trình, một số việc AI tương tác) | Nội dung gửi vào các tính năng đó |
| Groq | Một số tính năng giọng nói / AI phụ | Âm thanh hoặc văn bản gửi vào tính năng đó |
| Resend | Email giao dịch | Địa chỉ email, nội dung thư |
| PayOS, VNPay | Cổng thanh toán | Mã đơn, số tiền (studio không lưu số thẻ) |
| Sentry | Theo dõi lỗi (khi bật) | Dấu vết lỗi đã lọc dữ liệu cá nhân |

## 7. AI & dữ liệu

| # | Câu hỏi | Trả lời |
|---|---|---|
| 7.1 | Dữ liệu có đi qua LLM không? | Chỉ với tính năng AI được ghi trong đặc tả, và chỉ phần dữ liệu tính năng đó cần. Dự án không có AI thì không có dữ liệu nào đi qua LLM. |
| 7.2 | Tắt được không? | Có — tính năng AI tắt bằng cấu hình, không cần sửa mã. Trên site của studio, việc AI chạy nền mặc định tắt, có trần token theo người và trần chi phí theo ngày. |
| 7.3 | Dữ liệu có dùng để huấn luyện mô hình? | Studio không dùng. Việc nhà cung cấp LLM lưu giữ / dùng dữ liệu phụ thuộc chính sách của họ — studio không bảo đảm thay được; vì vậy nhà cung cấp được chọn theo DPA, hoặc dùng tài khoản AI của chính khách. |
| 7.4 | Chạy AI cục bộ được không? | Có thể chạy mô hình mở trên máy của khách bằng llama.cpp (studio đã làm thật trong app desktop của mình — chế độ AI ngoại tuyến). Đổi lại: mô hình nhỏ hơn, chất lượng thấp hơn mô hình đám mây. |

## 8. Báo lỗ hổng (responsible disclosure)

- Kênh: email trong https://cuongthai.com/.well-known/security.txt, tiêu đề bắt đầu bằng `[Bảo mật]`.
- Chỉ thử trên tài khoản của chính bạn; không truy cập/sửa/xoá dữ liệu người khác; không DoS, spam, lừa đảo kỹ thuật xã hội.
- Cho studio thời gian hợp lý để sửa trước khi công bố. Chưa có chương trình thưởng tiền; người báo được ghi nhận nếu muốn.

---

## Chữ ký

| Đại diện nhà cung cấp | Đại diện khách hàng |
|---|---|
| Họ tên: … | Họ tên: … |
| Ngày: … | Ngày: … |
