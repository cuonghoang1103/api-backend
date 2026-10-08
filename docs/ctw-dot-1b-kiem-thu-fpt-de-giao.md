# Đề giao (Opus): CT WORK ĐỢT 1b — KIỂM THỬ CHUẨN FPT (Unit Test Report 5.1 + Integration Test Report 5.2) · 08/10/2026

Repo `/Users/admin/Downloads/api-backend`. Đọc `CLAUDE.md` (Prisma: migration VIẾT TAY + `migrate deploy`; KHÔNG migrate dev/resolve), bộ nhớ
`project_ct_work_kieu_jira.md`. Làm MỘT MÌNH. **KHÔNG commit/push/deploy.** Song song agent "đợt 1a sửa lỗi" — không đụng tệp của nó.

## Bối cảnh
Khách (sinh viên FPT) + các nhóm đồ án (SEP490/ISP490, Lab 2) phải nộp tài liệu kiểm thử ĐÚNG MẪU FPT. Mẫu bài làm nhóm khoá trước:
`~/Downloads/7692_APHL_ISP490_G1_Report5.1_Unit_Test_Report.xlsx` và `..._Report5.2_Integration_Test_Report.xlsx` — ĐỌC KỸ cấu trúc (dùng openpyxl,
có venv ở scratchpad `vx/bin/python` hoặc tự tạo): 5.1 = sheet Guideline, Cover (thông tin dự án + Record of change A/D/M), Functions (No, Module,
Method, Sheet, Description, Pre-Condition; "Normal number of Test cases/KLOC"=100; Test Environment), Statistics (mỗi hàm Passed/Failed/Untested/N/A/B/
Total), mỗi hàm 1 sheet MA TRẬN: đầu (Code Module, Method, Created/Executed By, Test requirement, tổng), cột UTCID01..n; dòng Condition (Precondition,
các tham số đầu vào + giá trị), Confirmation (Return, Exception, Log message…), Result (Type N/A/B, Passed/Failed, Executed Date, Defect ID), dấu "O".
5.2 = Cover, Test Cases (danh sách module + mô tả + Pre-Condition), Test Statistics (Passed/Failed/Pending/N/A theo module), mỗi module 1 sheet
(ID, mô tả, bước thủ tục, kết quả mong đợi, dữ liệu, kết quả thực tế/Pass-Fail, ngày, người kiểm, ghi chú) — đọc đúng cột thật trong tệp.
Bản quyền: mẫu là mẫu tài liệu trường, chỉ tái tạo CẤU TRÚC; không chép dữ liệu nhóm khác.

## Làm (mở rộng phần quản lý kiểm thử Xray-like đang có trong CT Work — khảo sát trước)
1. Dữ liệu: Unit test theo HÀM (module/lớp, method, mô tả, tiền điều kiện, tham chiếu mã); test case UTCID với tập Condition/Confirmation dạng ma trận (dòng điều
   kiện/kết quả có nhóm + giá trị; ô đánh dấu theo UTCID), loại N/A/B, kết quả, ngày chạy, người chạy, defect liên kết; KLOC + chỉ tiêu 100 TC/KLOC cảnh báo.
   Integration test theo MODULE/luồng: bước, dữ liệu, mong đợi, thực tế, trạng thái Passed/Failed/Pending/N/A. Record of change (phiên bản tài liệu).
   Migration chỉ-thêm viết tay.
2. Giao diện web (trong dự án CT Work, mục Kiểm thử): bảng ma trận UTCID chỉnh trực tiếp (bấm ô đặt "O", thêm điều kiện/kết quả, nhân bản test case),
   thống kê tự động, lọc theo module; Integration: bảng bước. Đẹp, nhanh, dùng được trên app desktop (tuyến app — xem bộ nhớ feedback_trang_work_moi_can_tuyen_app_desktop).
3. **Xuất Excel đúng mẫu 5.1 và 5.2** (định dạng, gộp ô, màu, công thức tổng như mẫu; sheet theo hàm/module; Cover lấy thông tin dự án) + **nhập Excel** từ
   đúng mẫu (để nhóm đang làm Excel chuyển lên CT Work). Dùng thư viện đang có trong repo (kiểm package.json; nếu cần thêm exceljs — hỏi trưởng nhóm qua báo cáo
   trước khi thêm dependency, theo CLAUDE.md).
4. AI hỗ trợ (tuỳ chọn, có trần): gợi ý điều kiện/biên (N/A/B) cho một hàm từ mô tả/chữ ký hàm.
## Kiểm
Test (unit + DB) cho dữ liệu/thống kê/xuất-nhập (xuất xong đọc lại bằng openpyxl so cấu trúc với tệp mẫu: tên sheet, tiêu đề cột, ma trận), tsc gốc + seed,
frontend tsc + build, migration diff sạch, chạy thật trên trình duyệt local (ảnh chụp). Báo lại ngắn: thiết kế, tệp, migration, ảnh, tệp Excel mẫu xuất ra.
