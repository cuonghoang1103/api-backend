/**
 * agile-teamwork/_mau.mjs — DỮ LIỆU DÙNG CHUNG cho bộ tài liệu mẫu của Chương 9 (soạn 24/11/2026, agent agl).
 * Một nguồn duy nhất cho: (1) bảng HTML trong bài, (2) khối TSV "chép dán vào Excel", (3) tệp .xlsx tải về
 * (scratchpad/agl/web/mau/nguon/tao-xlsx.py đọc tệp này qua node rồi để LibreOffice dựng + tính công thức).
 * Dự án "Phòng khám An Tâm" và khách "Sakura Medical Systems" là HƯ CẤU; khuôn tài liệu theo thông lệ dự án Nhật
 * (基本設計/詳細設計, テスト仕様書, QA表, 日報), không phải mẫu nội bộ của một công ty cụ thể.
 */
import { esc } from '../spring-boot/_chung.mjs';

/* ───── DD màn hình đăng ký bệnh nhân SCR-PAT-REG-01 ───── */
export const DD_BIA = [
  ['Dự án / Project', 'Phòng khám An Tâm — hệ thống đặt lịch khám (khách: Sakura Medical Systems, hư cấu)'],
  ['Tài liệu / Document', 'Thiết kế chi tiết (DD, 詳細設計書) — màn hình SCR-PAT-REG-01 "Đăng ký tài khoản bệnh nhân"'],
  ['Mã tài liệu / Doc ID', 'AT-DD-PAT-REG-01'],
  ['Phiên bản / Version', '1.2'],
  ['Tài liệu gốc / Based on', 'AT-BD-PAT-01 v1.1 (thiết kế cơ bản: danh sách màn hình, luồng đăng ký) · AT-BD-SEC-02 (chuẩn băm mật khẩu)'],
];
export const DD_LICH_SU = {
  cot: ['Phiên bản / Ver', 'Ngày / Date', 'Sheet', 'Nội dung sửa / Change', 'Người sửa / By', 'Người duyệt / Reviewed'],
  hang: [
    ['1.0', '2026-11-10', 'Tất cả', 'Tạo mới', 'Dev A', 'Leader B'],
    ['1.1', '2026-11-14', 'Định nghĩa mục', 'ITM-03: bỏ chấp nhận số 11 chữ số (theo QA-0xx của BD)', 'Dev A', 'Leader B'],
    ['1.2', '2026-11-18', 'Xử lý sự kiện', 'BTN-01 bước 1: hiện TẤT CẢ lỗi một lần, không dừng ở lỗi đầu', 'Dev A', 'BrSE C'],
  ],
};
export const DD_MUC = {
  cot: ['No', 'Mã mục / Item ID', 'Tên mục / Name', 'Loại / Control', 'Bắt buộc / Req.', 'Kiểu / Type', 'Độ dài / Length', 'Định dạng, giá trị / Format', 'Mặc định / Default', 'Ghi chú / Note'],
  hang: [
    [1, 'ITM-01', 'Họ và tên', 'TextBox', '○', 'Chuỗi', '1–50', '—', '(rỗng)', 'Bỏ khoảng trắng đầu/cuối trước khi kiểm'],
    [2, 'ITM-02', 'Email', 'TextBox', '○', 'Chuỗi', '≤ 254', 'Ghi chú 1', '(rỗng)', 'Không được trùng (BTN-01 bước 3)'],
    [3, 'ITM-03', 'Số điện thoại', 'TextBox', '○', 'Chuỗi số', '10', 'Bắt đầu bằng 0', '(rỗng)', ''],
    [4, 'ITM-04', 'Ngày sinh', 'DatePicker', '○', 'Ngày', '—', 'yyyy-MM-dd, không sau ngày hệ thống', '(rỗng)', ''],
    [5, 'ITM-05', 'Mật khẩu', 'Password', '○', 'Chuỗi', '8–64', 'Có ít nhất 1 chữ cái và 1 chữ số', '(rỗng)', 'Hiện dạng ●●●'],
    [6, 'ITM-06', 'Nhập lại mật khẩu', 'Password', '○', 'Chuỗi', '8–64', 'Phải trùng ITM-05', '(rỗng)', ''],
    [7, 'ITM-07', 'Đồng ý điều khoản', 'CheckBox', '○', '—', '—', '—', 'Chưa chọn', 'Liên kết "điều khoản" mở SCR-CMN-TERM-01 ở tab mới'],
    [8, 'BTN-01', 'Đăng ký', 'Button', '—', '—', '—', '—', '—', 'Xem sheet "Xử lý sự kiện"'],
    [9, 'LNK-01', 'Đã có tài khoản? Đăng nhập', 'Link', '—', '—', '—', '—', '—', 'Chuyển SCR-AUTH-LOGIN-01'],
  ],
  ghiChu: 'Ghi chú 1 (định dạng email): có đúng một ký tự @, có dấu chấm sau @, không chứa khoảng trắng.',
};
export const DD_SU_KIEN = {
  cot: ['Sự kiện / Event', 'Bước / Step', 'Xử lý / Processing', 'Khi lỗi / On error'],
  hang: [
    ['BTN-01 bấm', '1', 'Kiểm tra đơn mục ITM-01 → ITM-07 theo sheet "Định nghĩa mục". Hiện TẤT CẢ mục lỗi một lần.', 'Hiện thông báo đỏ dưới từng mục lỗi, giữ nguyên dữ liệu đã nhập (trừ 2 ô mật khẩu). Dừng.'],
    ['', '2', 'Kiểm tra tương quan: ITM-06 = ITM-05.', 'MSG-E007 dưới ITM-06. Dừng.'],
    ['', '3', 'Kiểm tra trùng: SELECT COUNT(*) FROM patient WHERE email = :ITM-02', '> 0 ⇒ MSG-E005 dưới ITM-02. Dừng.'],
    ['', '4', 'INSERT INTO patient (…, password_hash = băm(ITM-05) theo AT-BD-SEC-02, status = 0)', 'Lỗi DB ⇒ MSG-E999 (hộp thoại), ghi log mức ERROR. Dừng.'],
    ['', '5', 'Chuyển SCR-PAT-REG-02, hiện MSG-I001.', '—'],
    ['LNK-01 bấm', '1', 'Chuyển SCR-AUTH-LOGIN-01 (không kiểm tra dữ liệu).', '—'],
  ],
};
export const DD_THONG_BAO = {
  cot: ['Mã / ID', 'Loại / Type', 'Nội dung / Text', 'Tham số / Params'],
  hang: [
    ['MSG-E001', 'Lỗi', '{0} là bắt buộc.', '{0} = tên mục'],
    ['MSG-E002', 'Lỗi', '{0} tối đa {1} ký tự.', '{0} = tên mục, {1} = độ dài tối đa'],
    ['MSG-E003', 'Lỗi', 'Email không đúng định dạng.', '—'],
    ['MSG-E004', 'Lỗi', 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.', '—'],
    ['MSG-E005', 'Lỗi', 'Email này đã được đăng ký.', '—'],
    ['MSG-E006', 'Lỗi', 'Mật khẩu từ 8 đến 64 ký tự, gồm cả chữ và số.', '—'],
    ['MSG-E007', 'Lỗi', 'Mật khẩu nhập lại không khớp.', '—'],
    ['MSG-E008', 'Lỗi', 'Ngày sinh không hợp lệ.', '—'],
    ['MSG-E009', 'Lỗi', 'Bạn cần đồng ý với điều khoản sử dụng.', '—'],
    ['MSG-E999', 'Lỗi hệ thống', 'Hệ thống đang bận. Vui lòng thử lại sau.', '—'],
    ['MSG-I001', 'Thông tin', 'Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.', '—'],
  ],
};
export const DD_BANG = {
  cot: ['No', 'Cột / Column', 'Kiểu / Type', 'NULL', 'Khoá / Key', 'Mặc định / Default', 'Lấy từ / Source'],
  hang: [
    [1, 'id', 'BIGINT', 'NOT NULL', 'PK (tự tăng)', '—', '—'],
    [2, 'full_name', 'VARCHAR(50)', 'NOT NULL', '', '—', 'ITM-01 (đã trim)'],
    [3, 'email', 'VARCHAR(254)', 'NOT NULL', 'UNIQUE', '—', 'ITM-02 (đã trim)'],
    [4, 'phone', 'CHAR(10)', 'NOT NULL', '', '—', 'ITM-03'],
    [5, 'birth_date', 'DATE', 'NOT NULL', '', '—', 'ITM-04'],
    [6, 'password_hash', 'VARCHAR(200)', 'NOT NULL', '', '—', 'băm(ITM-05)'],
    [7, 'status', 'SMALLINT', 'NOT NULL', '', '0', '0 = chưa kích hoạt, 1 = đang dùng, 9 = khoá'],
    [8, 'created_at', 'TIMESTAMP', 'NOT NULL', '', 'CURRENT_TIMESTAMP', '—'],
  ],
};

/* ───── Q&A list (QA表) ───── */
export const QA = {
  cot: ['No', 'Mã / ID', 'Tài liệu, vị trí / Doc & location', 'Câu hỏi / Question', 'Đề xuất của đội / Our proposal', 'Mức / Priority', 'Hạn trả lời / Due', 'Người hỏi / Asked by', 'Ngày hỏi / Asked', 'Trả lời / Answer', 'Người trả lời / By', 'Ngày trả lời / Answered', 'Trạng thái / Status', 'Ảnh hưởng / Impact'],
  hang: [
    [1, 'QA-001', 'AT-DD-PAT-REG-01 v1.2, Xử lý sự kiện, BTN-01 bước 3', 'Khi kiểm trùng email, "An.Nguyen@Example.com" và "an.nguyen@example.com" có coi là cùng một email không?', 'Chúng tôi đề xuất so KHÔNG phân biệt hoa/thường, lưu nguyên như người dùng gõ. Nếu đồng ý, không cần sửa tài liệu khác.', 'Cao', '2026-11-25', 'Dev A', '2026-11-24', 'Đồng ý với đề xuất.', 'Khách (Tanaka)', '2026-11-25', 'Đã đóng', 'Sửa DD v1.3 bước 3; thêm TC-REG-019'],
    [2, 'QA-002', 'AT-DD-PAT-REG-01 v1.2, Định nghĩa mục, ITM-03', 'Người dùng gõ "090 123 4567" hoặc "090-123-4567" thì báo lỗi hay tự bỏ dấu cách/gạch?', 'Đề xuất báo MSG-E004 (giữ đúng tài liệu hiện tại), thêm chữ gợi ý "Ví dụ: 0901234567" trong ô.', 'Trung bình', '2026-11-26', 'Dev A', '2026-11-24', 'Báo lỗi. Thêm chữ gợi ý như đề xuất.', 'Khách (Tanaka)', '2026-11-26', 'Đã đóng', 'Sửa DD (placeholder ITM-03)'],
    [3, 'QA-003', 'AT-DD-PAT-REG-01 v1.2, Định nghĩa mục, ITM-04', 'Ngày sinh bằng đúng ngày hệ thống (trẻ sơ sinh) có hợp lệ không? Có giới hạn tuổi tối đa không?', 'Đề xuất: hôm nay hợp lệ (bố mẹ đăng ký cho con); không giới hạn tối đa ở giai đoạn này.', 'Trung bình', '2026-11-26', 'Dev A', '2026-11-24', '', '', '', 'Đang chờ', ''],
    [4, 'QA-004', 'AT-DD-PAT-REG-01 v1.2, Định nghĩa mục, ITM-01', '"50 ký tự" tính theo ký tự hiển thị hay theo byte? Chữ Việt có dấu nhập từ máy Mac có thể ở dạng tổ hợp (NFD).', 'Đề xuất: chuẩn hoá NFC rồi đếm ký tự hiển thị; cột DB VARCHAR(50) theo ký tự (utf8mb4/PostgreSQL) nên vừa.', 'Cao', '2026-11-25', 'Dev A', '2026-11-24', 'Đồng ý.', 'Khách (Tanaka)', '2026-11-25', 'Đã đóng', 'Thêm TC-REG-006'],
    [5, 'QA-005', 'AT-DD-PAT-REG-01 v1.2, Thông báo', 'Email dài hơn 254 ký tự: dùng MSG-E002 hay MSG-E003? Tài liệu chưa nói.', 'Đề xuất MSG-E002 ("Email tối đa 254 ký tự.") vì rõ nguyên nhân hơn.', 'Thấp', '2026-11-27', 'Dev A', '2026-11-24', 'Dùng MSG-E002.', 'BrSE C (đã hỏi khách)', '2026-11-25', 'Đã đóng', 'Thêm TC-REG-008'],
    [6, 'QA-006', 'AT-DD-PAT-REG-01 v1.2, Định nghĩa mục, ITM-05', 'Mật khẩu có bỏ khoảng trắng đầu/cuối như ITM-01 không? Có cho ký tự đặc biệt không?', 'Đề xuất KHÔNG trim mật khẩu (khoảng trắng là một phần mật khẩu), cho mọi ký tự in được.', 'Trung bình', '2026-11-26', 'Dev A', '2026-11-24', 'Đồng ý.', 'Khách (Tanaka)', '2026-11-25', 'Đã đóng', ''],
    [7, 'QA-007', 'AT-DD-PAT-REG-01 v1.2, Xử lý sự kiện, BTN-01 bước 1–2', 'Khi ITM-05 đã lỗi MSG-E006, có kiểm tiếp ITM-06 = ITM-05 (MSG-E007) không?', 'Đề xuất không: bước 2 chỉ chạy khi bước 1 không có lỗi ở ITM-05, ITM-06.', 'Thấp', '2026-11-27', 'Dev A', '2026-11-24', 'Đồng ý.', 'BrSE C', '2026-11-24', 'Đã đóng', ''],
    [8, 'QA-008', 'AT-DD-PAT-REG-01 v1.2, Thông báo, MSG-I001', 'MSG-I001 nói "kiểm tra email để kích hoạt", nhưng không tài liệu nào mô tả việc gửi email kích hoạt. Việc gửi email có thuộc phạm vi ticket này không?', 'Theo hợp đồng giai đoạn 1, gửi email không có trong danh sách chức năng. Đề xuất: giai đoạn này đổi MSG-I001 thành "Đăng ký thành công."; gửi email làm CR riêng nếu khách cần.', 'Cao', '2026-11-25', 'Leader B', '2026-11-24', 'Cần gửi email. Bên khách sẽ gửi yêu cầu thay đổi.', 'Khách (Tanaka)', '2026-11-26', 'Chuyển CR', 'CR-003 (ước lượng 2,5 MD)'],
  ],
};

/* ───── Test spec (テスト仕様書) — kết quả lần chạy 2, sau khi sửa BUG-001 ───── */
export const TS_COT = ['No', 'TC ID', 'Màn hình, mục / Target', 'Quan điểm kiểm / Viewpoint', 'Điều kiện trước / Precondition', 'Bước / Steps', 'Dữ liệu / Data', 'Kết quả mong đợi / Expected', 'Kết quả thực tế / Actual', 'Trạng thái / Status', 'Evidence', 'Người test / Tester', 'Ngày / Date', 'Bug ID', 'Ghi chú / Note'];
const tc = (no, id, muc, qd, dk, buoc, dl, mong, tt = 'Pass', ev = '', bug = '', gc = '') =>
  [no, id, muc, qd, dk, buoc, dl, mong, tt === 'Pass' ? 'Như mong đợi' : '', tt, ev, 'Dev A', '2026-11-25', bug, gc];
const DK0 = 'Bảng patient rỗng';
const DK1 = 'Đã có patient email an.nguyen@example.com';
const BUOC = '1. Mở SCR-PAT-REG-01\n2. Nhập dữ liệu\n3. Bấm BTN-01';
export const TS = {
  cot: TS_COT,
  hang: [
    tc(1, 'TC-REG-001', 'BTN-01', 'Bình thường: đủ 7 mục hợp lệ', DK0, BUOC, 'Bộ dữ liệu chuẩn D0', 'Chuyển SCR-PAT-REG-02, hiện MSG-I001; patient có 1 dòng, status = 0', 'Pass', 'EV_TC-REG-001_01'),
    tc(2, 'TC-REG-002', 'ITM-01…07', 'Bỏ trống tất cả', DK0, BUOC, 'Tất cả rỗng, không tích ITM-07', '7 lỗi cùng lúc: E001 × 6 (đúng tên mục) + E009', 'Pass', 'EV_TC-REG-002_01'),
    tc(3, 'TC-REG-003', 'ITM-01', 'Chỉ có khoảng trắng', DK0, BUOC, 'ITM-01 = "   "', 'MSG-E001 "Họ và tên là bắt buộc."'),
    tc(4, 'TC-REG-004', 'ITM-01', 'Biên trên: 50 ký tự', DK0, BUOC, 'ITM-01 = "A" × 50', 'Đăng ký thành công'),
    tc(5, 'TC-REG-005', 'ITM-01', 'Biên trên + 1: 51 ký tự', DK0, BUOC, 'ITM-01 = "A" × 51', 'MSG-E002 "Họ và tên tối đa 50 ký tự."'),
    tc(6, 'TC-REG-006', 'ITM-01', 'Chữ Việt dạng tổ hợp NFD, 50 ký tự hiển thị (QA-004)', DK0, BUOC, '"Nguyễn …" 50 ký tự, mã hoá NFD', 'Đăng ký thành công'),
    tc(7, 'TC-REG-007', 'ITM-02', 'Sai định dạng: thiếu @', DK0, BUOC, 'an.nguyen.example.com', 'MSG-E003'),
    tc(8, 'TC-REG-008', 'ITM-02', 'Quá dài: 255 ký tự (QA-005)', DK0, BUOC, '"a" × 243 + "@example.com"', 'MSG-E002 "Email tối đa 254 ký tự."'),
    tc(9, 'TC-REG-009', 'ITM-03', 'Thiếu chữ số: 9 chữ số', DK0, BUOC, '090123456', 'MSG-E004'),
    tc(10, 'TC-REG-010', 'ITM-03', 'Có dấu gạch (QA-002)', DK0, BUOC, '090-123-4567', 'MSG-E004'),
    tc(11, 'TC-REG-011', 'ITM-04', 'Ngày không có thật', DK0, BUOC, '2026-02-30', 'MSG-E008'),
    tc(12, 'TC-REG-012', 'ITM-04', 'Biên: bằng ngày hệ thống (QA-003 đang chờ)', DK0 + '; ngày hệ thống 2026-11-24', BUOC, '2026-11-24', 'Đăng ký thành công', 'Pass', '', '', 'Theo đề xuất QA-003; chạy lại khi khách trả lời'),
    tc(13, 'TC-REG-013', 'ITM-04', 'Sau ngày hệ thống', DK0 + '; ngày hệ thống 2026-11-24', BUOC, '2026-11-25', 'MSG-E008'),
    tc(14, 'TC-REG-014', 'ITM-05', 'Biên dưới − 1: 7 ký tự', DK0, BUOC, 'abc1234 (cả ITM-06)', 'MSG-E006'),
    tc(15, 'TC-REG-015', 'ITM-05', 'Không có chữ số', DK0, BUOC, 'matkhaudai (cả ITM-06)', 'MSG-E006'),
    tc(16, 'TC-REG-016', 'ITM-06', 'Tương quan: khác ITM-05', DK0, BUOC, 'ITM-05 = matkhau123, ITM-06 = matkhau124', 'MSG-E007 dưới ITM-06'),
    tc(17, 'TC-REG-017', 'ITM-07', 'Không tích đồng ý', DK0, BUOC, 'ITM-07 bỏ trống', 'MSG-E009'),
    tc(18, 'TC-REG-018', 'BTN-01 bước 3', 'Email trùng y hệt', DK1, BUOC, 'ITM-02 = an.nguyen@example.com', 'MSG-E005, không thêm dòng'),
    tc(19, 'TC-REG-019', 'BTN-01 bước 3', 'Email trùng khác hoa/thường (QA-001)', DK1, BUOC, 'ITM-02 = An.Nguyen@Example.com', 'MSG-E005, không thêm dòng', 'Pass', 'EV_TC-REG-019_01', 'BUG-001', 'Lần 1 (24/11) Fail: đăng ký được (201). Sửa ở BUG-001, chạy lại 25/11 Pass'),
    tc(20, 'TC-REG-020', 'BTN-01 bước 4', 'An toàn: mật khẩu lưu dạng băm', DK0, BUOC + '\n4. Xem bảng patient', 'Bộ D0', 'password_hash dạng scrypt$…; không chứa "matkhau123"'),
    [21, 'TC-REG-021', 'BTN-01 bước 4', 'Lỗi DB khi INSERT', 'Tắt DB giữa bước 3 và 4', BUOC, 'Bộ D0', 'Hộp thoại MSG-E999; log ERROR', '', 'Blocked', '', 'Dev A', '2026-11-25', '', 'Môi trường dev chưa giả lập được lỗi DB — chờ IT test'],
    [22, 'TC-REG-022', 'LNK-01', 'Chuyển màn hình', DK0, '1. Mở SCR-PAT-REG-01\n2. Bấm LNK-01', '—', 'Chuyển SCR-AUTH-LOGIN-01', '', 'N/A', '', 'Dev A', '2026-11-25', '', 'Lab chỉ có API, không có giao diện — kiểm ở IT'],
  ],
};
export const LOI = {
  cot: ['Bug ID', 'TC ID', 'Tóm tắt / Summary', 'Các bước tái hiện / Steps', 'Mong đợi / Expected', 'Thực tế / Actual', 'Mức / Severity', 'Ưu tiên / Priority', 'Nguyên nhân / Cause', 'Loại / Type', 'Người sửa / Fixed by', 'Trạng thái / Status'],
  hang: [
    ['BUG-001', 'TC-REG-019', 'Đăng ký được email đã có khi khác hoa/thường', '1. Có patient an.nguyen@example.com\n2. Đăng ký với An.Nguyen@Example.com', '409, MSG-E005', '201, tạo patient thứ hai', 'Major', 'Cao', 'kho.demEmail so sánh === phân biệt hoa/thường', 'Lỗi code (không làm theo QA-001)', 'Dev A', 'Đã đóng (retest Pass 25/11)'],
  ],
};
/** Sheet "Tổng hợp" của test spec: công thức COUNTIF trên cột J (Trạng thái) sheet "Test case". */
export const TS_TONG_HOP = [
  ['Chỉ số / Metric', 'Giá trị / Value'],
  ['Tổng số test case', '=COUNTA([$\'Test case\'.B2:.B23])'],
  ['Pass', '=COUNTIF([$\'Test case\'.J2:.J23];"Pass")'],
  ['Fail', '=COUNTIF([$\'Test case\'.J2:.J23];"Fail")'],
  ['Blocked', '=COUNTIF([$\'Test case\'.J2:.J23];"Blocked")'],
  ['N/A', '=COUNTIF([$\'Test case\'.J2:.J23];"N/A")'],
  ['Chưa chạy (Untested)', '=COUNTIF([$\'Test case\'.J2:.J23];"")'],
  ['Tỉ lệ Pass trên số đã chạy (%)', '=ROUND(100*B3/(B3+B4);1)'],
  ['Số bug tìm được', '=COUNTA([$\'Danh sách lỗi\'.A2:.A50])'],
];

/* ───── Ước lượng man-day (工数見積) — chức năng "Quản lý lịch khám": 4 màn hình CRUD ───── */
export const UL_COT = ['No', 'WBS', 'Hạng mục / Work item', 'Lạc quan O (h)', 'Khả dĩ M (h)', 'Bi quan P (h)', 'Kỳ vọng E = (O+4M+P)/6 (h)', 'Độ lệch σ = (P−O)/6 (h)', 'Ghi chú / Note'];
const ul = (no, wbs, ten, o, m, p, gc = '') => [no, wbs, ten, o, m, p, `=ROUND((D${no + 1}+4*E${no + 1}+F${no + 1})/6;1)`, `=ROUND((F${no + 1}-D${no + 1})/6;2)`, gc];
export const UL = {
  cot: UL_COT,
  hang: [
    ul(1, '1.1', 'Đọc DD 4 màn hình, lập Q&A', 3, 4, 8, 'Phụ thuộc chất lượng DD'),
    ul(2, '1.2', 'Họp làm rõ với BrSE, cập nhật Q&A', 1, 2, 4),
    ul(3, '2.1', 'SCR-APT-LIST-01 danh sách: tìm kiếm, phân trang — backend', 4, 6, 10),
    ul(4, '2.2', 'SCR-APT-LIST-01 — frontend', 4, 6, 12, 'Lọc theo bác sĩ + ngày'),
    ul(5, '2.3', 'SCR-APT-ADD-01 thêm lịch — backend (kiểm trùng giờ)', 4, 6, 12, 'Rủi ro: quy tắc trùng giờ chưa rõ'),
    ul(6, '2.4', 'SCR-APT-ADD-01 — frontend', 3, 5, 8),
    ul(7, '2.5', 'SCR-APT-EDIT-01 sửa lịch — backend + frontend', 4, 6, 10, 'Dùng lại form thêm'),
    ul(8, '2.6', 'SCR-APT-DTL-01 chi tiết + huỷ lịch — backend + frontend', 3, 4, 6),
    ul(9, '3.1', 'Viết test case UT (≈ 60 case) + checklist', 4, 6, 9),
    ul(10, '3.2', 'Chạy UT, chụp evidence, ghi kết quả', 4, 6, 10, 'Evidence chiếm thời gian hơn bạn nghĩ'),
    ul(11, '3.3', 'Sửa lỗi UT + chạy lại', 2, 4, 10),
    ul(12, '4.1', 'Tự review + nhận review, sửa theo nhận xét', 2, 4, 8),
    ul(13, '4.2', 'Cập nhật tài liệu (DD nếu có sửa theo Q&A), báo cáo', 1, 2, 3),
  ],
};
/** Dòng tổng + dự phòng (công thức trên sheet). Hàng 2–14 là 13 hạng mục. */
export const UL_TONG = [
  ['', '', 'Tổng kỳ vọng ΣE (h)', '', '', '', '=SUM(G2:G14)', '', ''],
  ['', '', 'σ tổng = √Σσ² (h)', '', '', '', '', '=ROUND(SQRT(SUMSQ(H2:H14));2)', ''],
  ['', '', 'Mức ~84 %: ΣE + 1σ (h)', '', '', '', '=ROUND(G15+H16;1)', '', 'Xác suất xong trong mức này ≈ 84 % (giả định phân phối chuẩn)'],
  ['', '', 'Man-day (÷ 8 h, làm tròn 0,5 lên)', '', '', '', '=CEILING(G17/8;0.5)', '', '1 MD = 8 h công; ngày làm thật thường chỉ 6–6,5 h tập trung'],
];

/* ───── Daily report (日報) ───── */
export const DR = {
  cot: ['Mục / Item', 'Nội dung / Content'],
  hang: [
    ['Ngày / Date', '2026-11-25 (Thứ Tư)'],
    ['Người báo cáo / Reporter', 'Dev A — nhóm Đăng ký (dự án Phòng khám An Tâm)'],
    ['Đã làm hôm nay / Done', '1. AT-123 Đăng ký bệnh nhân: sửa BUG-001 (email trùng khác hoa/thường), chạy lại 20/20 UT Pass\n2. Điền test spec + evidence TC-REG-001…022\n3. Cập nhật Q&A: QA-001/004/005/006/007 đã đóng'],
    ['Tiến độ / Progress', 'AT-123: 85 % (kế hoạch hôm nay 90 %) — chậm 0,5 MD'],
    ['Thời gian / Effort', 'Kế hoạch 12 h · Thực tế 13,5 h · Còn lại ước 3 h'],
    ['Vấn đề, rủi ro / Issues & risks', '1. QA-003 (ngày sinh = hôm nay) chưa có trả lời, hạn 26/11 — TC-REG-012 tạm chạy theo đề xuất\n2. QA-008 chuyển CR-003 (gửi email kích hoạt) — chờ PM xác nhận có đưa vào sprint này không\n3. TC-REG-021 Blocked: dev chưa giả lập được lỗi DB'],
    ['Cần hỗ trợ / Need help', 'Nhờ Leader B nhắc khách QA-003 trong buổi họp sáng 26/11 với BrSE'],
    ['Kế hoạch ngày mai / Plan', '1. Gửi PR AT-123 để review (sáng)\n2. Sửa theo nhận xét review\n3. Bắt đầu AT-124 (đăng nhập): đọc DD, lập Q&A'],
  ],
};

/* ───── Hiển thị trong bài ───── */
/** Bảng HTML từ { cot, hang }. Ô chứa \n ⇒ <br>. Ô công thức (bắt đầu '=') thay bằng giá trị trong tinh[r][c] nếu có. */
export function bangHtml(b, { chiCot, tinh } = {}) {
  const idx = chiCot ?? b.cot.map((_, i) => i);
  const o = (v) => esc(String(v ?? '')).replace(/\n/g, '<br>');
  return `<div class="table-wrap"><table>
<thead><tr>${idx.map((i) => `<th>${esc(b.cot[i])}</th>`).join('')}</tr></thead>
<tbody>
${b.hang.map((h, r) => `<tr>${idx.map((i) => `<td>${o(String(h[i]).startsWith('=') ? (tinh?.[r]?.[i] ?? '') : h[i])}</td>`).join('')}</tr>`).join('\n')}
</tbody>
</table></div>`;
}
/** Khối TSV để chép dán vào ô A1 của Excel/Google Sheets (mỗi tab là một cột). Ô có xuống dòng ⇒ thay bằng " · ". */
export function tsv(b, chiCot) {
  const idx = chiCot ?? b.cot.map((_, i) => i);
  const dong = [idx.map((i) => b.cot[i]), ...b.hang.map((h) => idx.map((i) => String(h[i] ?? '').replace(/\n/g, ' · ')))];
  return `<pre><code>${esc(dong.map((d) => d.join('\t')).join('\n'))}</code></pre>`;
}
