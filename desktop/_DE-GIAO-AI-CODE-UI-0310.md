# Đề giao — AI Code: bố cục co giãn + giao diện chuyên nghiệp + lệnh `/` (03/10/2026)

Chạy SAU khi gói "AI ngoại tuyến" xong (cùng file `AgentMode.tsx`, `ChatMode.tsx`). Làm trong `desktop/` (+ backend nếu
một lệnh cần route mới — ghi rõ). Không commit, không phát hành, không tự tách agent con.

## A. Lỗi bố cục user chụp (3 ảnh, 03/10)
1. Sidebar dự án bị cắt chữ bên TRÁI khi kéo hẹp: "iệc · 12 dự án", icon đầu dòng mất nửa, nút "Mở tất cả" chồng dòng đếm.
2. Khung AI Code KHÔNG co theo cửa sổ/sidebar: thanh công cụ (Bỏ qua tất cả · Trình duyệt · Khung web · Terminal · Ghi chú ·
   model · vòng ngữ cảnh · còn ~N việc · Hook · Bộ nhớ…), dải kế hoạch, khối output lệnh, ô nhập đều bị cắt ở mép phải thay vì
   xuống dòng/co; nút biến mất.
3. Chữ tin nhắn mất ký tự đầu ("ản local…" = "Bản…", "avaScript").
4. Nút mở lại sidebar khi ẩn là mẩu nhỏ trôi giữa mép trái.
5. Hàng "Welcome to CuongMini AI" + robot chiếm một hàng mà ít thông tin.
⇒ Đọc `desktop/BO-CUC.md` (4 luật: `min-width:0` cho mọi flex item nội dung · hàng nút `flex-wrap` · co theo bề rộng dùng
`@container` KHÔNG `@media` · thứ dài vô hạn `overflow-x:auto`) và memory `feedback_moi_trang_phai_chiu_duoc_cua_so_hep`
(user báo lỗi này 3 lần ở 3 trang). Sửa TẬN GỐC cho AI Code + Chat + sidebar; thanh công cụ hẹp thì gom nút ít dùng vào menu
"⋯" (giữ phím tắt). Đo bằng `npm run do:bo-cuc` (và chụp tự động) ở: sidebar mở rộng / kéo hẹp tối thiểu / ẩn hẳn × cửa sổ
1440 / 1100 / 820 / 640px — 0 phần tử bị cắt, 0 cuộn ngang ngoài vùng chủ ý.

## B. Giao diện chuyên nghiệp hơn
Dùng skill `hallmark` (`.claude/skills/hallmark/SKILL.md`): chạy `hallmark audit` trên khung AI Code trước (danh sách lỗi xếp
hạng), rồi sửa trong ranh giới hiện có (không đổi cấu trúc dữ liệu/IPC): nhịp khoảng cách thống nhất, phân cấp chữ (tin nhắn
agent / dòng tool / output lệnh / trạng thái), khối tool call gọn & dễ quét, khối output lệnh có tiêu đề lệnh + nút chép + thu
gọn, dải kế hoạch rõ bước đang làm, ô nhập đẹp hơn, trạng thái "đang chạy lệnh/bước N" bớt chiếm chỗ. Giữ theme sáng/tối,
font hiện có của app. Ghi kết quả audit (trước/sau) trong báo cáo.

## C. Lệnh `/` — làm CẢ 3 nhóm, phải HOẠT ĐỘNG THẬT (không lệnh nào chỉ hiện chữ "sắp có")
Hiện có: /clear /undo /cost /diff /kynang /quyen /help (`GoiYLenh.tsx`, `AgentMode.tsx` ~dòng 460–610, test `goiYLenh.test.ts`).
Thêm (mỗi lệnh có tên Anh + bí danh Việt, mô tả tiếng Việt trong gợi ý, tự hoàn thành; /help liệt kê đủ):
- Nhóm 1: **/model** (chọn model ngay trong khung, gồm cổng dự phòng & ngoại tuyến nếu có) · **/usage** (hạn mức 5 giờ: đã
  dùng/còn/lúc hồi, trần tiền ngày, key gia hạn: có/không + nút nhập key — dùng `GET /api/v1/agent/usage` có sẵn trường
  `tranGoc/giaHan/coKeyGiaHan`) · **/context** (ngữ cảnh k/600k, chia đề bài/lịch sử/kết quả tool/ảnh, số lượt đã cắt, có bản tóm
  tắt chưa) · **/compact [ghi chú]** (chủ động tóm tắt phần cũ NGAY — cần route máy chủ mới dùng `ghiNhoLuotDaBo` trong
  `src/services/agent/tomTatLuotCu.ts`; app thay phần cũ bằng bản tóm tắt trong hội thoại gửi lên, vẫn giữ bản đầy đủ để người dùng
  cuộn đọc) · **/status** (phiên bản app, cổng đang dùng: chính/dự phòng/ngoại tuyến, mạng, dự án, nhánh git).
- Nhóm 2: **/plan** (chế độ chỉ lập kế hoạch: tắt tool ghi/chạy lệnh qua capabilities, duyệt xong mới cho làm) · **/review** (soát
  diff hiện tại, liệt kê lỗi có file:dòng, không sửa) · **/init** (quét dự án, tạo/cập nhật file quy ước dự án mà agent tự đọc mỗi
  lượt) · **/resume** (danh sách việc cũ để mở lại) · **/rewind** (quay về một tin nhắn trước: khôi phục hội thoại + file theo điểm
  lưu đã có của /undo, nếu chưa có điểm lưu theo từng lượt thì thêm) · **/memory** (xem/sửa bộ nhớ agent).
- Nhóm 3: **/export** (xuất hội thoại Markdown ra file) · **/doctor** (chẩn đoán: mạng, máy chủ, cổng, AI ngoại tuyến đã cài,
  quyền thư mục, phiên bản) · **/offline** (bật/tắt AI ngoại tuyến tay — nối với gói ngoại tuyến) · **/effort** (đổi mức nỗ lực) ·
  **/hooks**, **/mcp** (mở quản lý hook / máy chủ MCP sẵn có).
Mỗi lệnh có test (vitest) cho phần logic; lệnh cần máy chủ thì test với fetch giả.

## D. Gốc của lỗi 413 phía app
App gửi lại toàn bộ lịch sử mỗi lượt, kể cả ảnh tool tự chụp ⇒ việc dài vượt trần thân yêu cầu (máy chủ đã nới /api/v1/agent lên
48MB, commit 03/10). Trước khi gửi: chỉ giữ ảnh của N lượt gần nhất (gỡ ảnh cũ thành dòng chữ "[ảnh đã gỡ]" — giống
`src/services/agent/compact.ts`), ước kích thước thân trước khi gửi và tự gỡ thêm nếu > ~30MB; lỗi 413 còn lại thì hiện câu đúng
("hội thoại quá lớn — đã tự gỡ ảnh cũ, gửi lại") và tự thử lại một lần thay vì dừng việc.

## Kiểm
`cd desktop && npm run typecheck` (2 tsconfig) + `npx vitest run` sạch; `npm run do:bo-cuc` sạch; ảnh chụp trước/sau ở các độ rộng
trên (sáng + tối) lưu `~/Desktop/ai-code-ui/`; backend nếu đụng: `npx tsc --noEmit` + test.
