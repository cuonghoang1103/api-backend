# Đề giao (Opus): IELTS ĐỢT 1 — PHÒNG THI MÁY TÍNH THẬT + FLASHCARD 100 TỪ/NGÀY (SRS) + SỔ LỖI TỰ ĐỘNG · 07/10/2026

Repo `/Users/admin/Downloads/api-backend`. Làm MỘT MÌNH, không tách agent con. **KHÔNG commit / push / deploy** (trưởng nhóm kiểm rồi làm).
Nhiều phiên khác cùng sửa repo này — chỉ đụng tệp trong phạm vi dưới, không `git add/stash/checkout` gì.
Đọc trước: `CLAUDE.md` (Pre-Push Checklist, Prisma: migration VIẾT TAY + `npx prisma migrate deploy`, không `migrate dev`), bộ nhớ dự án
`/Users/admin/.claude/projects/-Users-admin-Downloads-api-backend/memory/project_ielts_sach_15_ngay.md` (mục TRẠNG THÁI + NÂNG CẤP IELTS),
`frontend/src/app/language/[code]/ielts/SOAN-BAI.md`. Ảnh tham khảo (Langate): `~/Documents/IELTS-tham-khao/*.jpg`.

## Người học
User (sinh viên, tiếng Anh còn yếu, mục tiêu IELTS 7.5 để đi làm + thi bằng). Giao diện tiếng Việt, nội dung đề tiếng Anh.
Bản quyền: KHÔNG chép đề Cambridge/IDP/BC, KHÔNG dùng logo/tên thương hiệu thi. Tự soạn nội dung theo đúng DẠNG câu hỏi thật.

## 0. Khảo sát (ngắn) trước khi làm
Đọc phòng thi hiện có (`/language/en/ielts/phong-thi`, kho luyện `luyen-them`, view cũ `tech-trends/ielts/*View.tsx`), app desktop mục IELTS
(`desktop/…` shim `doiDuongApp`), cách lưu tiến độ hiện có. Ghi ngắn vào cuối tệp này (mục Khảo sát) cái gì dùng lại được.

## 1. Phòng thi kiểu thi trên máy tính thật (computer-delivered)
- Thanh trên: tên bài, **đồng hồ đếm ngược** (cảnh báo 10'/5'), nút Ẩn giờ, Nộp bài; thanh dưới: **điều hướng câu theo Part/Passage** (ô số câu,
  đã làm / chưa / **cờ xem lại**), Trước/Sau.
- **Reading**: 2 cột bài đọc | câu hỏi, **kéo thanh giữa** đổi độ rộng, mỗi cột cuộn riêng; **tô sáng** (chọn chữ → highlight, xoá) + **ghi chú**
  gắn vào đoạn; đủ dạng câu hỏi: gap-fill (ONE WORD ONLY…), MCQ 1/nhiều đáp án, True/False/Not Given, Yes/No/Not Given, matching headings,
  matching information/features, sentence completion, summary completion (chọn từ ô), diagram/flow-chart label. Kéo-thả cho matching nếu hợp lý.
- **Listening**: phát MỘT lần như thi thật (có chế độ luyện cho tua), thời gian đọc trước câu hỏi, 4 Part, ô điền + MCQ + map labelling,
  2 phút kiểm tra cuối. Giọng: dùng hệ TTS hiện có (Azure/sach-hoc/audio — xem memory), nhiều giọng/giọng vùng nếu có.
- **Writing**: Task 1 (biểu đồ/bảng — vẽ bằng SVG/biểu đồ có sẵn) + Task 2, khung soạn có **đếm từ**, gợi ý thời gian 20/40'; nộp ⇒ AI chấm
  theo 4 tiêu chí band descriptors (TR/TA, CC, LR, GRA) qua cổng LLM hiện có (đúng purpose/model trong `gateway.ts`, xem CLAUDE.md mục LLM)
  — trả band từng tiêu chí + sửa lỗi cụ thể + bản viết lại band 7.5. Có trần token theo người dùng như các tính năng AI khác.
- **Kết quả**: điểm thô → band theo bảng quy đổi phổ biến (ghi rõ "ước tính"), xem lại từng câu có giải thích VI + vị trí bằng chứng trong bài (tô sáng).
- Chế độ: **Luyện từng dạng** (Practice) / **Thi đủ đề** (Full test) / **Kết quả** — như trang chọn đề trong ảnh.
- Nội dung: ít nhất **1 đề Reading đủ 3 passage (40 câu)** + **1 đề Listening 4 part (40 câu)** + **1 bộ Writing** tự soạn chất lượng (tiếng Anh tự
  nhiên, độ khó band 6–7.5, đáp án kiểm chéo kỹ) — kiến trúc dữ liệu để thêm đề sau chỉ là thêm tệp.

## 2. Flashcard 100 từ/ngày (SRS)
- Bộ từ: dùng từ vựng các Ngày đã soạn + danh sách từ học thuật/IELTS theo chủ đề (tự soạn: từ, loại từ, phát âm IPA, nghĩa VI, ví dụ EN, collocation).
  Đủ cho ≥ 30 ngày × 100 từ hoặc nói rõ số hiện có.
- **Mục tiêu ngày** (mặc định 100 từ mới, chỉnh được) + **ôn lặp lại ngắt quãng** (SM-2 hoặc FSRS đơn giản) — ôn đến hạn hiện TRƯỚC từ mới.
- Thẻ: mặt trước từ + nghe phát âm; lật: nghĩa, ví dụ; nút **Quên / Khó / Nhớ / Dễ** (phím 1–4, Space lật). Chế độ **Match** (ghép từ–nghĩa có
  giờ), **Gõ lại** (nghe → gõ chính tả).
- Thống kê: Tổng từ / Đã thuộc / Cần học / Đến hạn hôm nay, chuỗi ngày, biểu đồ 30 ngày, "nhớ sau 7 ngày" (tỷ lệ thật — điều người học cần).
- Lưu MÁY CHỦ theo user (đồng bộ web + app desktop): model Prisma mới (vd. `IeltsVocabCard` trạng thái SRS theo user+từ, `IeltsDailyGoal`)
  + migration viết tay chỉ-thêm + API `/api/v1/ielts/vocab/*` (auth, kiểm tra đầu vào, giới hạn tần suất như route khác).

## 3. Sổ lỗi tự động (thay Google Sheet)
- Mỗi câu sai trong phòng thi/luyện ⇒ tự vào **Sổ lỗi** theo kỹ năng (Reading/Listening/Writing/Speaking/Từ vựng): câu, đáp án mình chọn,
  đáp án đúng, **dạng câu hỏi**, **lý do sai** (chọn nhanh: bẫy paraphrase, không đọc kỹ yêu cầu số từ, chính tả, ngữ pháp, hết giờ…) + ô
  **"công thức rút ra"** người học tự viết; AI gợi ý lý do/công thức (tuỳ chọn, có trần).
- Lọc theo kỹ năng/dạng/lý do; **"Ôn sổ lỗi"** = làm lại các câu sai, **giãn cách** (không cho làm lại ngay — sau ≥ 2 ngày, rồi 7 ngày) để
  tránh nhớ đáp án; thống kê dạng hay sai nhất. Lưu máy chủ (model + API như trên). Xuất CSV.

## 4. Web + app desktop
Mọi trang mới chạy cả trong app desktop (mục IELTS riêng — thêm tuyến tương ứng, xem `feedback_trang_work_moi_can_tuyen_app_desktop` ý tương tự;
dùng `moiTruong.ts`). Giao diện sạch, dễ đọc lâu (chữ bài đọc serif/sans rõ, cỡ chữ chỉnh được, chế độ sáng như phòng thi + tối tuỳ chọn),
cửa sổ hẹp vẫn dùng được, bàn phím đầy đủ.

## Kiểm trước khi báo (CLAUDE.md)
`npx tsc --noEmit` · `npm run typecheck:seed` · `(cd frontend && npx tsc --noEmit && npm run build)` · test mới (SRS tính hạn, quy đổi band,
chấm từng dạng câu) · migration áp lên DB local bằng `npx prisma migrate deploy` + `migrate diff` rỗng · desktop typecheck (2 config — xem memory
`feedback_desktop_typecheck_hai_config`) · CHẠY THẬT trên trình duyệt local (Playwright/ảnh chụp): làm 1 đề Reading đủ, nộp, xem kết quả, sổ lỗi,
flashcard 20 thẻ + Match. Ảnh chụp vào `scratchpad` rồi liệt kê đường dẫn.

## Báo lại (ngắn)
Tệp đã đổi/mới, migration + endpoint, nội dung đã soạn (số đề/câu/từ), ảnh chụp, việc còn lại, rủi ro.

## Khảo sát

---
# ĐỢT 2 (xếp sau đợt 1 — KHÔNG làm trong đợt 1): TEST ĐẦU VÀO + KẾT QUẢ + CHỌN LỘ TRÌNH + KHOÁ PHÒNG THI (yêu cầu khách 07/10)
1. **Test đầu vào nghiêm túc** ở mục đầu tiên của IELTS: đủ 4 kỹ năng, đúng thời gian thật (L 30' 40 câu · R 60' 40 câu · W 60' T1+T2 ·
   S 11–14' giám khảo AI gọi thoại Part 1/2/3, 1' chuẩn bị Part 2 — dùng lại hạ tầng 📞 goiGiaSu: Whisper + Azure chấm âm + LLM theo
   band descriptors). Đề tự soạn, độ khó trải 4.0–8.0 để phân loại được.
2. **Trang công bố điểm**: band từng kỹ năng + Overall (quy tắc làm tròn chính thức), giải thích từng câu sai + bằng chứng, điểm mạnh/yếu,
   dạng câu hay sai, nhận xét 4 tiêu chí W/S kèm câu sửa; lỗi tự vào Sổ lỗi; ghi rõ L/R ~±0.5, W/S do AI chấm là ƯỚC TÍNH (±0.5–1).
3. **Chọn lộ trình**: "Học từ con số 0" hoặc "Học theo trình độ hiện tại" ⇒ ánh xạ vào lộ trình đã có (Ngày N sách, chặng luyện thêm),
   mục tiêu từ/ngày, kỹ năng ưu tiên; lưu máy chủ; làm lại test định kỳ (mỗi 4–6 tuần) để đo tiến bộ.
4. **Khoá phòng thi kiểu SEB**: app desktop (Electron main): kiosk + alwaysOnTop mức screen-saver, macOS presentation options ẩn Dock/menu +
   chặn chuyển app, chặn ⌘Tab/⌘Q/⌘W/copy/paste, tắt DevTools, `setContentProtection(true)` chống chụp/quay, chặn điều hướng ra ngoài, ghi
   mọi lần mất tiêu điểm; LUÔN có lối thoát (Nộp bài / "Thoát khẩn cấp" có xác nhận + ghi vào kết quả) — không bao giờ khoá cứng máy.
   Web: buộc fullscreen, đếm rời tab/cửa sổ, chặn copy/paste, "độ nghiêm túc" trên kết quả; khuyên dùng app để thi nghiêm túc.
   Tham khảo mã hiện có: `frontend/src/app/exam/[examId]/ExamRoomClient.tsx`, `desktop/src/renderer/features/exam/LamBai.tsx` (đếm blur).
(07/10/2026, phiên Opus làm đợt 1)
- `phong-thi/PhongThi.tsx`: đề dựng ở máy chủ từ kho 4 chặng (~30 câu/đề, 1 cột) — GIỮ NGUYÊN; phòng thi máy tính mới là trang riêng `thi-may/` (đề tĩnh 40 câu).
- Dùng lại: `components/sach-hoc/audio.ts` (`play`/giọng uk/us nam-nữ + `dan`, Azure/Google qua `/ielts/doc`), `moiTruong.ts` (`docTruyVan/ghiTruyVan` cho app desktop), `useLangUser`, `quyDoiBand` (deThi.service), `llmComplete`/`checkTokenQuota`/`extractJson`.
- Từ vựng có sẵn: chặng 1–3 (`tech-trends/ielts/data/stage*/vocab*.ts`, ~680 từ có IPA+ví dụ) + khối `vocab` của Ngày 1–6 ⇒ flashcard gom lại + 600 từ học thuật mới.
- Tiến độ cũ: `ielts_progress` (stage/kind/muc) không hợp cho SRS/sổ lỗi ⇒ 5 bảng mới.
- App desktop: `dinhTuyenWeb.ts` (2 đường mỗi trang: `/ielts/<x>` + `/language/:code/ielts/<x>`), shim `doiDuongApp` tự đổi link web.
