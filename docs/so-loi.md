# Sổ lỗi — mọi lỗi đã gặp khi làm app, web, tính năng, hạ tầng

> Luật chủ chốt (chủ kênh chốt 13/11/2026): **gặp lỗi nào, sửa xong là ghi ngay một mục vào đây.**
> Mục đích: học sâu lại từng lỗi, tự sửa được lần sau, và làm tư liệu "lỗi tôi từng gặp + cách sửa".
> Ngắn gọn, mỗi mục 5 dòng. Mới nhất ở TRÊN. Bài học lớn về quy trình deploy vẫn nằm ở bảng
> "Known Error Patterns" trong `CLAUDE.md` — sổ này gom MỌI lỗi, kể cả lỗi nhỏ.

Mẫu một mục:

```
### dd/mm/yyyy — <khu vực> — <tên lỗi ngắn>
- **Triệu chứng:** người dùng thấy gì
- **Nguyên nhân:** gốc rễ thật (tệp:dòng nếu có)
- **Cách sửa:** đã đổi gì (commit)
- **Ảnh hưởng:** ai/cái gì bị dính, bao lâu
- **Bài học:** điều mang theo lần sau
```

---

### 13/11/2026 — Messenger — Tab ẩn vẫn gửi "đã xem"
- **Triệu chứng:** mở cuộc trò chuyện rồi chuyển sang tab khác / thu nhỏ app, tin mới tới thì người gửi thấy "đã xem" sau ~3 ms dù chưa ai nhìn.
- **Nguyên nhân:** `frontend/src/store/messagingStore.ts` (applyIncomingMessage) gọi `markRead` chỉ dựa vào "đang mở đúng hội thoại", không kiểm `document.visibilityState`. Phép kiểm đó có sẵn vài dòng trên nhưng chỉ dùng cho tiếng báo.
- **Cách sửa:** tab ẩn ⇒ hoãn (`choDaXemKhiHien`), tab hiện lại ⇒ listener `visibilitychange` mới gọi `markRead`.
- **Ảnh hưởng:** mọi người dùng Messenger web + app desktop; lộ quyền riêng tư (báo đã xem sai).
- **Bài học:** "đang mở" ≠ "đang nhìn". Mọi tín hiệu gửi cho NGƯỜI KHÁC về hành vi của mình phải dựa trên điều chắc chắn đã xảy ra.

### 13/11/2026 — Messenger — Người đã bị chặn giữa phiên vẫn nhận "đã offline"
- **Triệu chứng:** A chặn B khi A đang online; lúc A đóng app, B vẫn nhận gói "A vừa offline".
- **Nguyên nhân:** `src/socket/messaging.socket.ts` (disconnect) phát offline cho danh sách người nhận CHỐT LÚC NỐI — danh sách đó cũ, chưa biết chuyện chặn xảy ra giữa phiên.
- **Cách sửa:** hàm mới `phatTrangThaiKhiNgat` lọc lại bằng đúng luật `presenceAudience` ngay lúc ngắt (+ đọc lại công tắc của mình; lỗi ⇒ không phát). Test trong `src/services/presencePrivacy.test.ts`.
- **Ảnh hưởng:** rò trạng thái hoạt động tới người đã bị chặn.
- **Bài học:** dữ liệu tính một lần rồi cất (cache, `socket.data`) sẽ CŨ đi — với quyết định về quyền riêng tư, kiểm lại ngay lúc dùng. Phát hiện nhờ khoá Socket.IO 4.3 dựng lại lỗi trong lab.

### 13/11/2026 — Deploy — Seed nội dung bị bộ canh ngắt giữa chừng
- **Triệu chứng:** `deploy-nha.sh` báo `[chó gác] ssh treo quá 2400s`, các bước seed sau Phòng thi (khôi phục chương + bình luận CuongMini, Deep Dive, Roadmap, IELTS…) không chạy.
- **Nguyên nhân:** cả khối seed chạy trong MỘT phiên ssh; riêng seed Academy đã 26 phút + Phòng thi 14 phút > trần `SSH_TRAN=2400` giây.
- **Cách sửa:** chạy tay phần còn lại trên VPS (chủ kênh duyệt). Lần deploy sau đặt `SSH_TRAN=5400`.
- **Ảnh hưởng:** ~1,5 giờ Phòng thi mất "học phần liên quan" + bình luận CuongMini chưa nối lại.
- **Bài học:** nội dung lớn dần ⇒ thời gian seed lớn dần; trần thời gian phải xem lại theo dữ liệu, không đặt một lần rồi quên.

### 13/11/2026 — Hạ tầng — `ssh host 'bash -s' < script.sh` chỉ chạy được lệnh đầu
- **Triệu chứng:** script chạy trên VPS dừng sau bước đầu, vẫn báo `EXIT=0`.
- **Nguyên nhân:** script đi vào qua stdin; lệnh `docker compose exec -T` bên trong ĐỌC stdin nên nuốt mất phần còn lại của script.
- **Cách sửa:** chép script lên máy (`scp`) rồi `bash script.sh < /dev/null`.
- **Ảnh hưởng:** tưởng đã seed xong mà chưa.
- **Bài học:** script qua stdin + lệnh con đọc stdin (docker exec, ssh, read) = mất lệnh. Luôn chạy từ TỆP.

### 13/11/2026 — AI Chat — Không xem được ảnh người dùng gửi
- **Triệu chứng:** gửi ảnh, AI trả lời như không có ảnh (app desktop + web).
- **Nguyên nhân:** bậc model mặc định CuongMini 3.11 bỏ `context.images` khi dựng yêu cầu.
- **Cách sửa:** lượt có ảnh/tệp ⇒ tài khoản Pro tự nâng lên bậc đọc được ảnh; tài khoản thường báo rõ `pro_required`; model nói thật khi không đọc được (commit bcf1bf154).
- **Ảnh hưởng:** mọi lượt chat có ảnh ở bậc mặc định.
- **Bài học:** đổi bậc/model mặc định phải thử lại cả đường có ảnh và tệp, không chỉ chữ.

### 13/11/2026 — AI Chat / AI Code — Bấm Dừng không huỷ lượt AI ở máy chủ
- **Triệu chứng:** bấm Dừng/đóng app nhưng máy chủ vẫn gọi model tới hết (tốn tiền, treo).
- **Nguyên nhân:** `req.on('close')` KHÔNG BAO GIỜ bắn sau khi `express.json()` đã đọc xong body.
- **Cách sửa:** `khiKhachDong(res, cb)` (`src/utils/khachDong.ts`) nghe `res.on('close')` + `!res.writableFinished`; truyền `signal` xuống 4 cổng model (commit 66e80823e, bcf1bf154).
- **Ảnh hưởng:** mọi lượt AI Chat/AI Code bị dừng giữa chừng.
- **Bài học:** sự kiện "client ngắt" phải nghe trên RESPONSE. Còn cùng lỗi ở `work.agents.routes.ts`, `music.routes.ts`, keepalive khoá học/ghi chú/thi — cần rà.

### 13/11/2026 — Messenger — Windows không gửi được tệp (md, zip, rar…)
- **Triệu chứng:** trên Windows chọn tệp xong không gửi được, mọi loại tệp.
- **Nguyên nhân:** `MessageInput` từ chối khi `file.type` rỗng — Windows lấy MIME từ registry nên nhiều đuôi ra rỗng; `accept=` còn giấu bớt đuôi. Máy chủ lại lưu nguyên MIME client khai (text/html lọt lên bucket công khai).
- **Cách sửa:** chính sách đính kèm chung (`chatAttachmentPolicy.ts` + `tepDinhKem.ts`): chặn tệp chạy được theo đuôi + chữ ký MZ/ELF/Mach-O, trần 25 MB (413), Content-Type theo đuôi, `Content-Disposition: attachment` (commit eba5659c2, app 0.5.229).
- **Ảnh hưởng:** người dùng Windows; thêm lỗ hổng lưu HTML trên bucket công khai.
- **Bài học:** đừng tin MIME trình duyệt gửi — tự xác định từ đuôi + nội dung ở máy chủ.

### 13/11/2026 — Video bài giảng — Chữ "e" đơn bị đọc thành "i"
- **Triệu chứng:** giọng đọc "stderr" thành "ét ti đi i", "ERROR" thành "i-rơ" (tập Linux 7.1).
- **Nguyên nhân:** luật đọc riêng ghi `ét ti đi e` / `e-rơ`; sau đó luật đánh vần chữ cái đứng riêng biến "e" ⇒ "i".
- **Cách sửa:** viết âm có dấu (`é-rơ`) để luật chữ cái không bắt; lồng tiếng lại tập.
- **Ảnh hưởng:** một tập (bắt được trước khi render).
- **Bài học:** luật đọc chạy nối nhau — đầu ra của luật trước là đầu vào của luật sau; âm tiết đọc phải có dấu.

### 13/11/2026 — CT Language — Bài ghim "CuongMini_Kana Practice" KHÔNG có trong app
- **Triệu chứng:** web Dekiru ghim trang luyện bảng chữ ở đầu mục lục (4 cách: gõ romaji · chọn chữ · nghe · bảng tiến độ), app iOS không thấy mục đó ở đâu — người dùng báo "chưa thấy mục này ở app".
- **Nguyên nhân:** hai lớp. (1) `frontend/scripts/sach-hoc-xuat.mts` xuất các BUỔI, không xuất bài ghim ⇒ `cuongthai.com/sach-hoc/dekiru/index.json` không có `cuongmini-kana`. (2) Trình vẽ của app (`Shared/SachHoc`) chưa biết khối `luyenKana` — chỉ có `alphabet` là bảng TĨNH chạm-để-nghe.
- **Cách sửa:** làm bản native trong app thay vì chờ xuất JSON — `CTLanguageApp/Modules/ChuNen/` (dữ liệu đóng trong app, chạy offline, thêm cách "viết theo nét" web không có) + lối vào ở Học · Luyện · Hôm nay · widget (commit ios-app `780e3e4`). Mở rộng luôn cho tiếng Trung (pinyin + thanh điệu) và tiếng Anh (44 âm IPA) vì hai thứ đó chưa có ở ĐÂU, kể cả web.
- **Ảnh hưởng:** người học tiếng Nhật từ số 0 trên app — thiếu đúng công cụ cần nhất ở tuần đầu.
- **Bài học:** nội dung "ghim ngoài danh sách buổi" là chỗ mù của đường xuất JSON. Thêm bài ghim trên web thì phải kiểm `index.json` có nó không, đừng tin là app tự thấy.

### 13/11/2026 — CT Language / app CuongThai — Ôn thẻ viết cứng cho tiếng Nhật
- **Triệu chứng (bắt trước khi người dùng gặp):** bộ thẻ mới của IELTS/Trung chạy trên khối `onthe` của app sẽ đọc từ tiếng Anh bằng giọng Nhật, đổi "account" sang kana rồi so ⇒ gõ đúng vẫn bị chấm sai; chế độ Nghe của bộ Trung rỗng; tiến độ thẻ `jp` và `dekiru` ghi chung một ngăn.
- **Nguyên nhân:** `ios-app/CuongThaiApp/Shared/SachHoc/OnTheSH.swift` — `noi()` cứng `giong: "ja-nu"`, gõ so bằng `khopJp` (romaji→kana), Nghe lọc `!kana.isEmpty`, kho trạng thái + tuỳ chọn cứng khoá `dekiru-onthe-v1`/`dekiru-onthe-opt-v1` trong khi id thẻ (`t:2:わたし`) có thể trùng giữa khoá.
- **Cách sửa:** đọc `ngonNgu/giong/soKhop` ở gốc on-the.json (thiếu ⇒ ja, Dekiru y cũ); `GapOnThe.foldEn/foldZh/khop` chép đúng `sach-hoc-xuat.mts`; tên buổi theo `nhom`; trạng thái/tuỳ chọn tách theo khoá (dekiru giữ khoá cũ). Kiểm thử `OnTheKhopTests` 4/4. Commit ios-app `6a6f0d2`.
- **Ảnh hưởng:** người học IELTS/Trung trên app (chưa ai gặp — app chỉ mở ôn thẻ cho Dekiru tới bản này).
- **Bài học:** khối dùng chung sinh ra cho MỘT khoá thì mang giả định ngầm của khoá đó (giọng, bảng chữ, khoá lưu). Đổi khuôn dữ liệu ⇒ soát mọi chỗ đọc dữ liệu đó, kể cả chỗ lưu trạng thái. Còn một lỗi nhỏ phía WEB chưa sửa: `foldZh` đổi `lǜ` thành `luv` (u + ̈→v) — app tạm chịu cả `lv` lẫn `luv`.
