# Tài liệu thiết kế phần mềm (Software Design Description — SDD)

> **Mục đích:** mô tả hệ thống được chia thế nào, dữ liệu nằm ở đâu, các phần giao tiếp ra sao — đủ để đội phát triển làm song song và người sau hiểu được.
> **Ai điền:** Kiến trúc giải pháp chủ trì; Dev, Dữ liệu, Bảo mật, DevOps đóng góp.
> **Khi nào:** giai đoạn 07 · Kiến trúc & thiết kế kỹ thuật; cập nhật theo từng vòng lặp.
> **Chuẩn tham chiếu:** IEEE 1016-2009, ISO/IEC/IEEE 42010:2022, mô hình C4, OpenAPI 3.1. Khung tương thích báo cáo SDS của đồ án SEP490 (FPTU).

---

## I. Kiểm soát tài liệu
| Ngày | A/M/D | Người phụ trách | Mô tả thay đổi |
|---|---|---|---|

## II. Thiết kế

### 1. Thiết kế tổng thể (High-level design)
#### 1.1 Kiến trúc phần mềm
- **C4 mức 1 — Ngữ cảnh:** hệ thống, người dùng, hệ thống ngoài *[hình]*
- **C4 mức 2 — Container:** web, API, CSDL, hàng đợi, lưu trữ file, dịch vụ ngoài *[hình]*
- **C4 mức 3 — Component** cho container quan trọng *[hình]*
- Các tầng: trình bày · ứng dụng (xác thực/phân quyền, API, dịch vụ nghiệp vụ, thời gian thực) · truy cập dữ liệu · việc chạy nền · tích hợp ngoài · dữ liệu.
#### 1.2 Sơ đồ gói (Package diagram)
| # | Gói | Trách nhiệm |
|---|---|---|
#### 1.3 Thiết kế cơ sở dữ liệu
- ERD vật lý *[hình]*; chiến lược migration (có phiên bản, chạy lại an toàn).
- Mỗi bảng một mục:

| # | Trường | Kiểu | PK/FK | Null | Mặc định | Ghi chú (chỉ mục, ràng buộc, dữ liệu cá nhân?) |
|---|---|---|---|---|---|---|

#### 1.4 Sơ đồ triển khai (Deployment view)
Môi trường dev / staging / production, mạng, CDN, sao lưu *[hình]*.

### 2. Thiết kế chi tiết theo tính năng
Mỗi tính năng: sơ đồ tuần tự (sequence), sơ đồ lớp liên quan, xử lý lỗi.

### 3. Đặc tả lớp / mô-đun
| Lớp / mô-đun | Trách nhiệm | Phụ thuộc |
|---|---|---|

### 4. Thiết kế khác
#### 4.1 Xác thực & phân quyền
#### 4.2 Việc chạy nền (jobs) & hàng đợi
#### 4.3 Giao tiếp thời gian thực
#### 4.4 Tích hợp bên thứ ba (sandbox, khoá, giới hạn, đường lùi)
#### 4.5 Định dạng phản hồi API & mã lỗi chuẩn
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "…", "details": [] } }
```
#### 4.6 Hợp đồng API — liên kết tới tệp OpenAPI 3.1
#### 4.7 Ghi log, giám sát, chỉ số (SLI/SLO)
#### 4.8 Sao lưu & phục hồi — RPO / RTO

### 5. Đáp ứng yêu cầu phi chức năng
| NFR | Cơ chế đáp ứng trong thiết kế | Cách kiểm |
|---|---|---|

### 6. Threat model (STRIDE) — tóm tắt
| Luồng dữ liệu | Mối đe doạ (S/T/R/I/D/E) | Biện pháp | Thẻ backlog |
|---|---|---|---|

### 7. Quyết định kiến trúc
Danh sách ADR (xem mẫu ADR): ADR-001 …

### 8. Ước tính chi phí vận hành hằng tháng
| Hạng mục | Gói | Ước tính | Giả định tải |
|---|---|---|---|

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh.*
