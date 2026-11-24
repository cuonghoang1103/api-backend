# 🎯 Huấn luyện học kỳ (`/hoc-tap`) — kế hoạch

Yêu cầu của người dùng (02/10/2026, tuần 4/10 kỳ Fall 2026, 6 môn: JPD123 · FER202 · LAB211 · SWT301 · SWR302 · ITE):
một mục quản lý việc học **do AI quản lý**: kế hoạch theo môn/tuần/ngày, mỗi việc có **thời lượng bấm giờ**,
người học **không tự tích được**. Họ nộp bằng chứng, rồi AI (gpt-6-sol) hoặc Claude Code chấm, tích và ghi điểm kèm lỗi.
Màn hình hiện **% tiến độ thật** và một **báo động tỷ lệ trượt** cho từng môn và cho cả kỳ. Đồng bộ trên web, desktop,
iOS và iPad.

Đã chốt với người dùng:
- Làm web trước, rồi desktop (dùng lại trang web), rồi iOS/iPad (SwiftUI).
- Chỉ AI hoặc Claude được tích.
- Tỷ lệ trượt do **mã tính theo công thức cố định**; AI chỉ viết lời cảnh báo.
- Mọi tài khoản đều dùng được; AI chấm có hạn mức, gói Pro được nhiều hơn, admin không giới hạn.

## Dùng lại, không viết lại
- Kỳ học và lịch thi: `HocKy` / `LichThi` (`/api/v1/hoc-ky`). iOS đã có `HocKyView`.
- Academy: `Course` (FPT = `semesterId != null`) → `CourseSection` → `Lesson`; tiến độ đọc từ `LessonProgress`.
- Nền tảng cần học trước: `frontend/src/components/courses/roadmapData.ts` (`BuocHoc.academy`).
- Chấm ảnh: `visionComplete` (`src/services/docTools/vision.ts`), làm theo mẫu `lichHoc/docAnhLich.ts`.
- Tải file: `POST /files/upload` (R2).
- Token cá nhân `ctw_…` (`work/apiTokens.service.ts`): mở rộng để dùng được cho `/api/v1/hoc-tap`, giúp Claude Code chấm hộ.
- Thông báo: `guiThongBao` (APNs) và notification qua socket. Cron đặt theo giờ UTC.

## Mô hình dữ liệu (migration viết tay)
- `mon_hoc_ky`: userId, hocKyId, maMon, ten, courseId? (Academy), trinhDo (người học tự mô tả), mucTieu, nenTang JSON, mau.
- `nhiem_vu_hoc`: monId, tuan, ngay?, loai (`NEN_TANG|BAI_HOC|BAI_TAP|LAB|QUIZ|PE|FE|ON_TAP|GHI_CHU`),
  tieuDe, huongDan (md), lienKet, thoiLuongPhut, hanChot, trongSo, thuTu,
  trangThai (`CHUA_LAM|DANG_LAM|CHO_CHAM|DAT|CHUA_DAT`), batDauLuc, nopLuc, diem, nhanXet, loiCanSua JSON,
  nguoiCham (`AI|CLAUDE|ADMIN`), chamLuc, yeuCauBangChung.
- `bang_chung_hoc`: nhiemVuId, lanNop, noiDung, lienKet JSON, tep JSON (R2), ketQua JSON, diem, dat, nguoiCham.
- `rui_ro_hoc_ngay`: userId, ngay, monId?, tyLeTruot, chiTiet JSON (để vẽ biểu đồ theo ngày).

## Công thức tỷ lệ trượt (thuần, có test)
Tính cho từng môn, phần trăm:
- `kyVong` = tuần đã qua ÷ tuần thi (so với LỊCH, không so với hạn từng việc — xem đầu `ruiRo.ts`)
- `thucTe` = trọng số các việc đã `DAT` ÷ tổng trọng số
- `tre` = max(0, kyVong − thucTe)
- `gap` = 1 + (tuần đã qua ÷ tuần thi), tức là càng gần ngày thi thì càng nặng
- `rủi ro` = 5 + 70·tre·gap + 3·(số việc quá hạn, tối đa 8) + 2·(số lần nộp trễ giờ, tối đa 5)
  + phạt điểm luyện (QUIZ/PE/FE có điểm trung bình < 5 thì cộng tối đa 20). Kết quả kẹp trong khoảng 1–99.
- Cả kỳ = trung bình các môn, nhưng **không thấp hơn môn tệ nhất trừ 10**.
- Mức màu: < 15 xanh · 15–30 vàng · 30–50 cam · ≥ 50 **đỏ, nhấp nháy**.

## Đợt
- [x] **Đ0. Schema**: thêm 4 bảng, migration SQL viết tay, `migrate deploy`, đo drift.
- [x] **Đ1. Backend**: `src/routes/hocTap.routes.ts`, `src/services/hocTap/`:
  - [x] CRUD môn và việc (người học được sửa ghi chú và bắt đầu bấm giờ, KHÔNG được đổi trạng thái DAT)
  - [x] `ruiRo.ts` (hàm thuần) + test
  - [x] AI soạn kế hoạch (`study_plan`, gpt-6-sol): đọc mục lục môn trên Academy, tuần hiện tại và trình độ tự mô tả,
    trả JSON danh sách việc; mã kiểm lại rồi mới cho áp dụng (xem trước → Áp dụng)
  - [x] AI chấm bằng chứng (`study_verify`, gpt-6-sol, đọc được ảnh): trả JSON gồm đạt/điểm/nhận xét/lỗi/cần cải thiện; mã quyết định trạng thái
  - [x] AI viết lời cảnh báo rủi ro (`study_coach`)
  - [x] Token `ctw_…` dùng được cho `/hoc-tap`, endpoint chấm thủ công `nguoiCham=CLAUDE`
  - [x] Cron 07:00: chụp số rủi ro trong ngày, nhắc việc hôm nay và việc quá hạn (push + thông báo)
  - [x] Hạn mức AI: thường 20 lượt/24h, Pro 150, admin không giới hạn
- [x] **Đ2. Web `/hoc-tap`**:
  - [x] Đầu trang: tuần X/10 và đồng hồ đo rủi ro cả kỳ (đỏ khi ≥ 50)
  - [x] Thẻ cho từng môn: % tiến độ, % rủi ro, đếm ngược ngày thi, việc kế tiếp
  - [x] "Hôm nay": việc có nút Bắt đầu, đồng hồ đếm ngược, nút Nộp bằng chứng (chữ, link, ảnh, file)
  - [x] Trang môn: các việc theo tuần, lịch sử chấm, nợ quá hạn tô đỏ
  - [x] Thiết lập: chọn kỳ, thêm môn (tìm trên Academy), tự mô tả trình độ, AI soạn kế hoạch → xem trước → áp dụng
  - [x] Biểu đồ rủi ro theo ngày; mục nav; chạy được ở bề ngang 390px
- [ ] **Đ3. Nạp dữ liệu thật cho người dùng**: 6 môn của kỳ; FER202 gồm nền web (WF Ch1–3, JS) → FER202 → Lab3 rev,
  kèm bộ `~/Documents/FER202/Luyen-Lab` A–D; các việc đã chấm hôm nay (Lab3 6/8).
- [ ] **Đ4. Kiểm**: tsc, test, `next build`, Playwright luồng nộp → chấm → tích. Deploy bằng `deploy-nha.sh`
  (lệnh này PUSH main nên phải hỏi người dùng trước).
- [ ] **Đ5. Desktop**: dùng lại trang web qua `dinhTuyenWeb`, thêm vào thanh bên, `phat-hanh`.
- [ ] **Đ6. iOS/iPad**: module SwiftUI `Shared/HocTap/` (xem tiến độ, rủi ro, bấm giờ, nộp ảnh bằng camera), TestFlight.

## Nhật ký
- 02/10/2026: Đ0–Đ2 xong. Đã kiểm: 7 test rủi ro + 2 test lọc trong `npm test` (517/517 xanh), 5 test DB
  (`HOC_TAP_DB_TEST=1 npx tsx --test src/routes/hocTap.routes.db.test.ts`), tsc BE/FE, typecheck:seed, `npm run build`.
  Chạy thật cục bộ: tuần 4 chưa học ⇒ 40%; AI chấm bài mkdir thử ⇒ 4/10 CHƯA ĐẠT, lý do đúng;
  AI soạn SWT301 ⇒ 42 việc, liên kết đúng bài Academy, mất ~6 phút (nên chạy nền + hỏi lại).
  Hạn mức env: HOC_TAP_AI_FREE_DAILY (20), HOC_TAP_AI_PRO_DAILY (150); admin không giới hạn.

## 24/11/2026 — CT Work → Của tôi → Học tập & Lịch + việc cá nhân + CuongMini `/hoc`
- **Trang** `/work/hoc-tap` (+ `/work/hoc-tap/mon/:id`, dùng lại `TrangMon` với `nhung`): lưới giờ Ngày/7 ngày gộp lớp
  (ClassSchedule) + khối tự học (xepLich) + **việc cá nhân** + hạn thẻ / họp dự án (`GET /work/me/agenda`, chỉ đọc —
  không đổi hợp đồng agenda của app iOS). Mục "Học tập & Lịch" ở thanh bên CT Work; tuyến desktop ở `tuyenCtWork.ts`.
- **Việc cá nhân** = bảng mới `viec_ca_nhan` (migration `20261124180000_viec_ca_nhan`, chỉ THÊM bảng): không thuộc môn,
  KHÔNG chấm, KHÔNG tính tỷ lệ trượt, tự đánh dấu xong. Có giờ ⇒ `xepLich` né khung đó (coDinh) + cron 5' nhắc APNs
  (`nhacViecCaNhan`). Thêm/sửa có giờ chồng khối tự học ⇒ xếp lại (`xepLaiNeuChong`).
  REST: `GET /hoc-tap/hom-nay` · `GET /hoc-tap/tuan` · `GET|POST /hoc-tap/ca-nhan` · `PATCH|DELETE /hoc-tap/ca-nhan/:id` ·
  `POST /hoc-tap/ca-nhan/:id/xong {xong}`.
- **MCP `hoc_tap`** (một lệnh, action today|week|list_personal|start|add|edit|done|undone; personOnly, chỉ MCP, không xoá):
  mã `H<n>` việc học (chỉ `start` — luật không tự tích GIỮ NGUYÊN), `C<n>` việc cá nhân. Vẽ markdown ở `veHocTap.ts`.
- **CuongMini** `/hoc` (CLI + app, chung `desktop/.../chat/hocTapLenh.ts`; lõi `agent/ctworkHocTap.ts` qua `agent:ctworkHe`
  viec `hocTap`): `/hoc` · `/hoc tuan` · `/hoc them "Ôn kana" mai 20:00 45` · `/hoc xong C5` · `/hoc bat-dau H12` ·
  `/hoc sua C5 khong-gio` · `/hoc ds 26/11 30/11`. Hỏi tự nhiên ("hôm nay mình học gì") ⇒ model gọi MCP `hoc_tap`.
- Test: `npx tsx --test src/services/hocTap/viecCaNhan.test.ts` · `HOC_TAP_DB_TEST=1 … hocTap.routes.db.test.ts` (8) ·
  registry.test · desktop vitest `hocTapLenh.test.ts`, `ctworkHocTap.test.ts`, `dinhTuyenWeb.test.ts` (219 tuyến).
