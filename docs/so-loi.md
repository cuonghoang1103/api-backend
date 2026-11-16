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

### 16/11/2026 — Video (điều phối) — lồng lại + render lại 27 tập ĐÃ CÓ trên web (Git, Auth)
- **Triệu chứng:** user hỏi "khoá git làm xong rồi mà?" — 20 tập git + 6 auth + 1 tst bị đọc lại giọng mới, 15 tập render lại, dù web đã có video.
- **Nguyên nhân:** danh sách "đã lồng tiếng mà chưa render" lấy từ `hang-giong-xong` trừ `hang-render-swt-xong` trên linux-nha — tập render ở chỗ khác (Mac/máy thuê cũ, hoặc đọc lại sau khi đã lên R2) không có dòng "ok" ở đó ⇒ lọt vào danh sách.
- **Cách sửa:** đối chiếu với `content/course-videos/*.mjs` (có `vi:` = đã lên web) ⇒ 27 tập; gỡ 12 tập chưa render khỏi hàng render.
- **Ảnh hưởng:** ~1–2 giờ làn giọng + ~1 giờ làn render máy thuê.
- **Bài học:** trước khi làm lại hàng loạt, lấy NGUỒN SỰ THẬT cuối (video đã gắn web) để lọc, không lấy sổ trung gian của một máy.

### 16/11/2026 — Video (điều phối) — giọng mới lồng xong 20 tập/giờ mà render đứng không
- **Triệu chứng:** sau khi chuyển sang giọng cuong6, 3 làn render nhàn rỗi suốt 1 giờ; kiem-gio báo "cho-soat 0"; sau-giong đánh "CẦN SOÁT lệch=54–68" cho tập đọc đúng.
- **Nguyên nhân:** (1) `scratchpad/swt2/lech3.mts` so `doc` với `chuDoc()` (phiên âm cũ) — giọng mới dùng `chuDocGoc()` ⇒ câu nào cũng "lệch"; (2) `.da-soat-giu` còn dấu soát của bản giọng cũ ⇒ bước soát tay bỏ qua; (3) `anh-sot.py` bắt từ Anh "sót" — giờ giữ từ Anh là cố ý; (4) `dieu-phoi-linux/sau-giong.sh` gọi `dang-ky.mts` cho TỪNG tập (~15 phút/lượt khi máy bận) ⇒ thả tối đa ~4 tập/giờ.
- **Cách sửa:** lech3 chấp nhận cả `chuDocGoc(hien)`; gỡ dấu `.da-soat-giu` của 432 tập lồng lại; tắt anh-sot trong kiem-gio.sh; sau-giong chỉ dang-ky MỘT lần mỗi vòng (biến DK); đưa 17 tập bị đánh nhầm về hàng soát lại.
- **Ảnh hưởng:** ~1 giờ máy thuê render không có việc (~$0,3).
- **Bài học:** đổi cách tạo dữ liệu (doc) thì rà MỌI chốt kiểm đọc dữ liệu đó (lech3, anh-sot, dấu đã soát) — chốt kiểm viết cho cách cũ sẽ chặn câm cách mới.

### 16/11/2026 — Video (điều phối) — đưa 432 tập về lồng tiếng giọng mới nhưng 5 tập vẫn render bằng giọng cũ
- **Triệu chứng:** gỡ dấu "ok" giọng cũ của 432 tập (đã lồng tiếng, chưa render) để đọc lại bằng giọng cuong6; 20 phút sau máy thuê render xong 5 tập (pro-lpe3-3, node-4-3, dkr-9-2, dkr-12-3, gha-14-1) bằng giọng CŨ, 400 dấu cũ đã quay lại `hang-giong-xong.txt` trên linux-nha.
- **Nguyên nhân:** dọn linux-nha TRƯỚC rồi mới dọn Mac; giữa hai bước `scratchpad/dong-bo-linux.sh` (chạy liên tục) gộp các dòng `hang-giong-xong` còn trên Mac (`.dp/keo-*` + bản Mac) sang lại Linux ⇒ làn render thấy "giọng ok" và render luôn.
- **Cách sửa:** dừng làn render, dọn lại cả hai bên (giữ dòng giọng mới ngày 16/11), canh 4 phút xác nhận dòng cũ không quay lại rồi mới bật làn; 5 tập lỡ render cũ đưa về hàng giọng (script `don-lai.sh` trong scratchpad phiên).
- **Ảnh hưởng:** 5 tập render thừa (~1 giờ máy thuê), không lên web.
- **Bài học:** sửa trạng thái hàng đợi trên NHIỀU máy có cầu đồng bộ ⇒ dọn nguồn mà cầu kéo từ đó (Mac) TRƯỚC, hoặc dừng cầu trong lúc sửa; xong phải kiểm lại sau ≥1 vòng đồng bộ, đừng tin "awk chạy xong".

### 15/11/2026 — Robot Odin (nhạc) — nói "bật bài Baby rồi" bốn lần mà không phát gì
- **Triệu chứng:** xin "bật bài gì của Justin Bieber", robot đáp đã bật, âm lượng 30/60%, rồi trách người dùng không bật loa — loa im (log robot 20:39–20:41).
- **Nguyên nhân:** bật nhạc trông HOÀN TOÀN vào việc model nhớ kèm lệnh `play_music` trong `actions` (`voiceLoop.ts › dispatchAction`); model quên lệnh nhưng vẫn nói như đã làm, và lệnh nhanh `phanXa.ts` chỉ bắt "bài tiếp/phát tiếp".
- **Cách sửa:** `musicTim.ts › khopXinNhac` (server tự bắt câu xin nhạc, tách tên bài/ca sĩ, bỏ qua "nhắc… học bài", "bài học", "tắt nhạc") + `music.playMusicOn({truocKhiPhat})` chỉ nói tên bài khi đã có bài; bài ngoài thư viện ⇒ "đợi tao tải" (commit e49645186).
- **Ảnh hưởng:** mọi lần xin nhạc mà model không kèm lệnh — từ khi có robot.
- **Bài học:** hành động có hậu quả thật (phát nhạc, đặt giờ, deploy) đừng để model "hứa bằng lời" — server bắt ý định chắc chắn và tự làm, lời nói phải đi SAU kết quả thật.

### 15/11/2026 — Robot Odin (lời nói) — robot đọc to cả "say : … actions : type : face…"
- **Triệu chứng:** thỉnh thoảng robot đọc thành tiếng nguyên khối JSON.
- **Nguyên nhân:** Claude viết ngoặc kép KHÔNG thoát trong câu nói (`"say":"…cái tên "Bậm Trợn"…"`) ⇒ `JSON.parse` hỏng ⇒ `parseRobotReply` rơi xuống nhánh "đọc hết chữ còn lại".
- **Cách sửa:** `votSayHong` vớt `say` tới dấu `"` cuối trước `,"actions"`; hợp đồng trong `persona.ts` cấm ngoặc kép trong "say" (dùng ' ' hoặc « »); test `danhThuc.test.ts`.
- **Ảnh hưởng:** câu trả lời có trích tên/câu nói.
- **Bài học:** đầu ra máy đọc từ model phải có đường vớt khi hỏng, và nói rõ ký tự cấm ngay trong hợp đồng.

### 15/11/2026 — Robot Odin (cổng gọi tên) — gọi "Hey Odin" không thưa; hỏi câu thứ hai bị bỏ
- **Triệu chứng:** nhiều lần gọi tên robot im; lần đầu trả lời được, hỏi thêm 2–3 câu thì không đáp.
- **Nguyên nhân:** Whisper nghe "Odin" thành "Hồ Đình/Hô Linh/Allin" ⇒ `danhThuc.ts` không khớp; cửa sổ thức 10 s tính từ lúc gọi tên trôi hết trong lúc robot đang nói câu trả lời dài.
- **Cách sửa:** `PHIEN_AM_CAN_CHAO` (chấp nhận các phiên âm đó khi đi sau lời chào hoặc đứng một mình); `giuThucHoiThoai` tính giờ từ lúc NÓI XONG, tối thiểu 30 s.
- **Ảnh hưởng:** mọi hội thoại bằng giọng với robot.
- **Bài học:** đo bằng chữ Whisper THẬT trong log trước khi đoán; mốc thời gian phải tính từ lúc người dùng có thể nói, không phải từ lúc bắt đầu lượt.

### 15/11/2026 — Robot Odin (chế độ) — kẹt ở chế độ tiếng Anh, nói gì cũng bị đổi chế độ
- **Triệu chứng:** robot chuyển sang tiếng Anh rồi không về được; câu dài có chữ "tiếng Anh" bị coi là lệnh đổi chế độ.
- **Nguyên nhân:** `cheDo.ts › khopDoiCheDo` khớp từ khoá trong câu dài bất kỳ; dò lệch tiếng không có đường tự về.
- **Cách sửa:** câu > ngắn chỉ nhận khi có động từ đổi (đổi/chuyển/switch/change); lệch tiếng 2 lượt liền ⇒ tự đổi chế độ; giữ giọng ElevenLabs khi đổi.
- **Ảnh hưởng:** người dùng nói lẫn Anh–Việt.
- **Bài học:** lệnh đổi trạng thái bằng giọng cần cả ý định (động từ) lẫn đối tượng, không chỉ từ khoá.

### 15/11/2026 — Robot Odin (mặt) — biểu cảm nhạt, 74/110 lượt là lim dim, mặt đổi SAU khi nói xong
- **Triệu chứng:** robot gần như lúc nào cũng mặt buồn ngủ; cảm xúc hiện ra khi câu đã nói xong.
- **Nguyên nhân:** `henNguLai` đặt mặt sleepy mỗi lần hết cửa sổ thức; lệnh `face` nằm trong `actions` ở CUỐI JSON nên chỉ tới khi model viết xong.
- **Cách sửa:** trường `camXuc` đứng ĐẦU JSON + bắt sớm bằng regex trong luồng chữ (`daBaoMatSom`), 17 cảm xúc, hết thức về `neutral` (commit 0af363ada).
- **Ảnh hưởng:** toàn bộ biểu cảm robot.
- **Bài học:** thứ tự trường trong JSON chảy dần quyết định độ trễ — thứ cần sớm phải viết trước.

### 15/11/2026 — Deploy (deploy-nha) — treo 20 phút ở "Gửi mã sang máy nhà" rồi FAIL
- **Triệu chứng:** `git push linux-nha:…/repo.git` đứng yên 20 phút (pack-objects 0% CPU), rồi bước 3 báo thất bại; production giữ bản cũ.
- **Nguyên nhân:** đường SSH qua đường hầm VPS tới máy nhà kẹt tạm thời (đo lại ngay sau: ssh 0,6 s, ls-remote 0,5 s); đổi mới chỉ 1,4 MB nên không phải do dung lượng.
- **Cách sửa:** chạy lại `deploy-nha.sh --khong-lui` khi không có lượt nào khác — qua bình thường (bd29a6e79 lên 21:24).
- **Ảnh hưởng:** lượt deploy 20:48 của phiên khác; trễ ~40 phút.
- **Bài học:** đẩy mã sang máy nhà nên có hạn giờ (vd. `timeout 300 git push`) để hỏng nhanh thay vì treo 20 phút; trước khi đổ cho mạng, đo kích thước gói và CPU của pack-objects.

### 15/11/2026 — CT Language iOS (CuongMini · Tạo thẻ ôn) — nghĩa thẻ dính câu giảng; Cộng đồng hai nút Gấu chồng nhau
- **Triệu chứng:** "Tạo thẻ ôn" ra thẻ `yesterday` — "hôm qua, hãy dùng quá khứ đơn. Vì vậy,"; màn Cộng đồng có nút trợ lý nổi toàn app nằm ngay trên nút Gấu "Đặt câu hỏi".
- **Nguyên nhân:** `ios-app/CuongThaiApp/CTLanguageApp/Modules/TroLyGau/TraLoiGauCTL.swift › DongChuGau.tachGoc` lấy nghĩa "từ — nghĩa" tới hết DÒNG, mà model hay giảng tiếp trên cùng dòng; `Modules/CongDong/CongDongCTL.swift` chưa đăng ký `DemNutGauRieng` như Tôi/hộp thư.
- **Cách sửa:** `DongChuGau.gonNghia` cắt ở cuối câu đầu, từ ngắn cắt thêm ở dấu phẩy trước mệnh đề ≥ 4 chữ (câu dịch giữ nguyên) + test `testNghiaTheOnCatCauGiang`; Cộng đồng ẩn nút nổi (ios-app `60617c3`, kiểm SE + Pro Max).
- **Ảnh hưởng:** thẻ ôn tạo từ câu trả lời CuongMini; bố cục tab Cộng đồng.
- **Bài học:** dữ liệu trích từ câu văn của AI cần ranh giới chặt hơn "hết dòng" — model không viết theo dòng.

### 15/11/2026 — CT Language iOS (sảnh game › Chọn bộ từ) — chủ đề hiện TÊN SF Symbol thay vì biểu tượng
- **Triệu chứng:** mục "Theo chủ đề" trong sheet chọn bộ từ của game ghi chữ "person.3.fill  Gia đình", "fork.knife  Ăn uống"….
- **Nguyên nhân:** `ios-app/…/TroChoi/Khung/SanhGameCTL.swift › ChonBoTuGameCTL` dựng nhãn bằng `"\(c.bieuTuong ?? "📚")  \(c.ten)"` — tưởng `bieuTuong` là emoji, thật ra máy chủ (`khamPha.ts › dsChuDe`) gửi TÊN SF Symbol.
- **Cách sửa:** truyền `bieuTuong` làm icon của hàng (`Image(systemName:)`), dòng phụ thêm tên nhóm lớn + số từ (ios-app, commit "chủ đề từ vựng mở rộng").
- **Ảnh hưởng:** mọi người mở Chọn bộ từ của game từ khi có khung game (bản nội bộ); chưa phát hành.
- **Bài học:** một trường tên `bieuTuong` có hai nghĩa trong app (emoji ở chỗ này, SF Symbol ở chỗ kia) — đọc khuôn của MÁY CHỦ trước khi hiển thị, và nhìn màn thật.

### 15/11/2026 — Bộ từ theo cấp của web (`/my-language/<nn>/vocab`) — cách đọc / nghĩa / cấp sai lẫn trong dữ liệu
- **Triệu chứng:** (phát hiện khi dựng chủ đề từ vựng CT Language, chưa ai báo) ja: 失礼します=しつれします, 化粧水=かせん, 筆箱=ふでざっぽ, 解凍=げとう, 末っ子=まっこ, ペンギン=ぺんぎん; zh: 室友=shǒuyǒu; nghĩa lẫn chữ Hán ("dù sao thì,无论如何"); 手帕/抹布 xếp HSK1.
- **Nguyên nhân:** dữ liệu `lang_vocab_words` soạn hàng loạt (AI) không đối chiếu từ điển; cấp gán theo NHÓM ("HSK1 · Đồ dùng cá nhân") chứ không theo từ.
- **Cách sửa:** chưa sửa nguồn web. Chủ đề CT Language (`scripts/ctlanguage/sinh-chu-de-tu.mts`) không tin cách đọc của web: có mục `ctl_tu` thì lấy cách đọc từ điển gần nhất; nghĩa do AI viết lại ngắn + chặn chữ Hán trong nghĩa (`chuDeTuThuan.ts › kiemTu`); cấp có SÀN theo cấp chữ Hán (`data/hanzi-levels.json.gz`) ⇒ `capUoc`. Kiểm: `scripts/ctlanguage-kiem-chu-de-tu.mts` (báo số từ đọc khác từ điển).
- **Ảnh hưởng:** người học bộ từ theo cấp trên web + gói `Resources/CapTu` của app (lấy cùng nguồn) — chưa đo bao nhiêu mục sai.
- **Bài học:** dữ liệu soạn hàng loạt phải đi qua phép đối chiếu với nguồn chuẩn (từ điển) TRƯỚC khi dùng lại; việc tiếp: chạy phép đối chiếu đó trên cả `lang_vocab_words` rồi sửa nguồn.

### 15/11/2026 — CT Language iOS (mọi màn) — lỗi máy chủ hiện nguyên văn "Route GET /api/v1/… not found"
- **Triệu chứng:** màn "Nhắn tin mới" hiện "Route GET /api/v1/ctlanguage/cong-dong/tin-nhan/tim-nguoi not found" (app mới hơn máy chủ); tương tự "Internal Server Error", "Too many requests…", "password: Password must be at least 12 characters".
- **Nguyên nhân:** `ios-app/CuongThaiApp/Shared/Network/APIClient.swift › errorDescription` + các hàm `DangNhapCTL.cauLoi`, `loiTN`, `cauLoiMatKhau`… trả thẳng `message` của máy chủ; `errorHandler.notFoundHandler` và express-validator trả câu tiếng Anh.
- **Cách sửa:** `APIError.cauTiengViet` + móc `cauHienThi` (CT Language gắn lúc khởi động) chỉ đổi CHỮ HIỆN RA, giá trị trong `case` giữ câu gốc vì Vở/CT Work phân nhánh theo nó; các hàm rút `m` đi qua `APIError.docDuoc` (ios-app `c5b3dbf`, test `TinNhanTNTests.testCauLoiMayChuThanhTiengViet`).
- **Ảnh hưởng:** mọi màn CT Language khi máy chủ lỗi/chưa deploy tuyến; chưa phát hành.
- **Bài học:** sửa câu lỗi ở CHỖ HIỂN THỊ chung, đừng đổi giá trị lỗi — đã có mã phân nhánh theo câu gốc ("not found", "404").

### 15/11/2026 — CT Language iOS (sheet + nền động) — trăng/hạt của nền "Đêm sao" vẽ đè tiêu đề "Nhắn tin mới"
- **Triệu chứng:** trong sheet, trăng khuyết + sao nằm ngay sau dòng tiêu đề; iPhone SE cũng dính ở thanh tiêu đề màn chính.
- **Nguyên nhân:** `CTLanguageApp/GiaoDien/NenDongCTL.swift › VeNenCTL.demSao` đặt trăng cố định y = 30 (tính cho thanh trạng thái màn đầy); trong sheet y = 30 chính là dải tiêu đề. Đèn lồng, cành anh đào cùng kiểu.
- **Cách sửa:** che (mask) lớp động trên dải safe-area phía trên trừ phần thanh trạng thái thật của cửa sổ; trang trí treo mép trên chỉ vẽ khi vùng thanh trạng thái ≥ 44 pt; 4 mùa tắt trang trí dải trên (ios-app `c5b3dbf`).
- **Ảnh hưởng:** mọi sheet/màn dùng `NenGiay` với nền động khác "Giấy chấm".
- **Bài học:** toạ độ "mép trên" trong nền là toạ độ của KHUNG, không phải của màn — sheet có mép trên riêng.

### 15/11/2026 — CT Language iOS (CuongMini, màn Pro) — "Đăng nhập để hỏi", "Nâng cấp Pro để hỏi thêm", "Đăng nhập để đăng ký" bấm không ra gì
- **Triệu chứng:** nút trong sheet đặt `app.hienDangNhap` / `app.hienPro` = true nhưng không màn nào hiện.
- **Nguyên nhân:** hai cờ chỉ nối `.fullScreenCover`/`.sheet` ở GỐC (`App/CTLanguageAppMain.swift › GocCTL`); gốc đang trình bày sheet CuongMini/Pro nên UIKit từ chối trình bày thêm.
- **Cách sửa:** `TrinhBayNoiCTL` (`App/AppStateCTL.swift`): gốc rảnh ⇒ SwiftUI như cũ; gốc bận ⇒ trình bày UIHostingController lên màn trên cùng; nút Đóng hạ cờ (ios-app `c5b3dbf`). Thử máy ảo: khách mở CuongMini ⇒ "Đăng nhập để hỏi" hiện màn đăng nhập, đóng/mở lại được.
- **Ảnh hưởng:** khách và người dùng Free bấm từ trong sheet — đúng kiểu nút reviewer bấm thử.
- **Bài học:** một cờ "mở màn X từ bất cứ đâu" mà chỉ có một nơi trình bày ở gốc là nút chết ngay khi được bật từ trong sheet.

### 15/11/2026 — CT Language iOS (Đăng ký) — form cho gửi mật khẩu 8 ký tự, máy chủ đòi 12 + hoa/thường/số/ký hiệu
- **Triệu chứng:** nút "Tạo tài khoản" sáng với mật khẩu 8 ký tự, gửi đi nhận câu tiếng Anh "password: Password must contain…".
- **Nguyên nhân:** `CTLanguageApp/Modules/DangNhap/DangNhapCTL.swift › hopLe` chỉ kiểm `count >= 8`, gợi ý ghi "ít nhất 8 ký tự"; luật thật ở `auth.routes.ts /register`.
- **Cách sửa:** dùng `TaiKhoanThuan.matKhauDat` (đã chép luật máy chủ) + danh sách điều còn thiếu dưới ô; Return chuyển ô/gửi (ios-app `c5b3dbf`).
- **Ảnh hưởng:** mọi người tạo tài khoản bằng email trong app (reviewer hay thử luồng này).
- **Bài học:** luật kiểm hợp lệ có hai bản (app/máy chủ) thì app phải gọi đúng một hàm đã chép luật, không tự đặt ngưỡng.

### 15/11/2026 — CT Language (Gọi CuongMini) — đứng mãi "Đang kết nối" khi máy chủ trả lỗi thường; luồng lộ câu lỗi kỹ thuật
- **Triệu chứng:** 429/404/413/5xx trả JSON/chữ thay vì SSE ⇒ vòng đọc không thấy `data:` ⇒ màn gọi treo; lỗi bất ngờ ở máy chủ gửi nguyên `e.message` (tiếng Anh, có thể là câu Prisma) xuống app.
- **Nguyên nhân:** `CTLanguageApp/Modules/CuongMini/GoiCuongMiniCTL.swift › docLuong` không xét mã HTTP/Content-Type; `src/routes/ctlanguage.routes.ts` (`/ai/goi/luong`, khối catch) gửi `(e as Error).message`.
- **Cách sửa:** app đọc thân lỗi, báo `.loi(...)` qua `APIError.docDuoc` (ios-app `c5b3dbf`); máy chủ chỉ đưa câu của `AppError` 4xx, còn lại câu chung + log (commit backend này, chưa deploy).
- **Ảnh hưởng:** người gọi CuongMini khi máy chủ quá tải/lỗi.
- **Bài học:** đường SSE phải xử lý cả trường hợp máy chủ KHÔNG trả SSE — middleware (rate limit, multer, 404) trả JSON.

### 15/11/2026 — CT Language iOS (nhỏ) — "Pro tới ngày ngày 15 tháng 12", bài vừa đăng "sau 0 giây nữa", socket ghim production
- **Triệu chứng:** màn Pro lặp chữ "ngày"; bài cộng đồng vừa đăng hiện "sau 0 giây nữa"; bản DEBUG trỏ máy chủ local thì tin nhắn realtime không tới.
- **Nguyên nhân:** `Pro/ManProCTL.swift › hanPro` ghép "ngày" với `.formatted(date: .long)` (tiếng Việt đã có "ngày"); `CongDong/MoHinhCD.swift › ngayNgan` dùng RelativeDateTimeFormatter khi đồng hồ máy chủ nhanh hơn máy; `Shared/Realtime/RealtimeClient.swift` ghim "https://cuongthai.com".
- **Cách sửa:** ngày dạng số vi_VN; < 1 phút hoặc tương lai ⇒ "vừa xong"; socket dùng `APIClient.diaChiGoc` (ios-app `c5b3dbf`, `2eb125a`, `5bbcf51`).
- **Ảnh hưởng:** hiển thị; realtime chỉ ảnh hưởng thử local.
- **Bài học:** đọc lại chuỗi ghép với ngày đã định dạng theo locale; mốc thời gian máy chủ có thể "ở tương lai" vài giây.

### 15/11/2026 — CT Language (hồ sơ App Store) — hộp đồng ý AI liệt kê việc của app CuongThai, chỉ sai chỗ thu hồi
- **Triệu chứng:** hộp "Cho phép gửi dữ liệu tới AI?" trong CT Language kể Vở, AI Tiền, CV, mã nguồn… và bảo "Bật lại trong Cài đặt → Chính sách bảo mật" (CT Language không có đường đó).
- **Nguyên nhân:** `Shared/AI/DongYChiaSeAI.swift › tomTat/loiTuChoi` dùng chung cho mọi app.
- **Cách sửa:** `#if CTLANGUAGE_APP` bản riêng (CuongMini hỏi/ảnh/đọc chính tả, gọi thoại, chấm phát âm/nói/thi nói, sửa bài, Nhờ Gấu, từ điển/bài học AI; thu hồi ở Tôi › CuongMini · AI); kèm chuỗi quyền micro/speech, một địa chỉ liên hệ, PrivacyInfo thêm GameplayContent + SearchHistory, Pro bỏ "không giới hạn" + bỏ nhắc web (ios-app `2eb125a`, `70285b0`); trang chính sách mục 14 viết lại (`3bb71643f`); câu `chua_co_khoa` Phát âm thân thiện (commit backend này).
- **Ảnh hưởng:** mục 5.1.2(i)/2.3.1/3.1.1 khi duyệt; chưa nộp.
- **Bài học:** văn bản công bố trong `Shared/` phải có biến thể theo app (cờ biên dịch), như bảng màu.

### 15/11/2026 — CT Language iOS (khoá học + Phát âm) — câu lỗi kỹ thuật lộ ra người học
- **Triệu chứng:** máy chủ không trả được mục lục khoá ⇒ màn học hiện "Máy chủ trả 404 cho index.json"; Phát âm khi chưa cắm khoá Azure hiện "Máy chủ chưa bật chấm phát âm"; ôn thẻ thiếu bộ thẻ nói "sau khi web cập nhật".
- **Nguyên nhân:** `ios-app/CuongThaiApp/Shared/SachHoc/KhoSachHoc.swift › taiNguon` dựng câu lỗi cho người lập trình (mã HTTP + tên tệp); `CTLanguageApp/Modules/PhatAm/*` và `Shared/SachHoc/OnTheSH.swift` viết theo góc nhìn máy chủ/web.
- **Cách sửa:** câu cho người học ("Chưa tải được nội dung khoá học lúc này… (mã N)", "Chấm phát âm đang tạm nghỉ…", "Bộ thẻ … chưa sẵn sàng"), test `LuyenPhatAmTests` cập nhật (ios-app `934f256`, `4ffd592`). Câu `thongBao` của backend (`src/services/ctlanguage/phatAm.ts:30`) vẫn thắng câu app khi có — chưa đổi.
- **Ảnh hưởng:** chỉ hiện khi máy chủ/khoá AI trục trặc; chưa phát hành.
- **Bài học:** mọi `throw ….hong("…")` trong mã giao diện là câu NGƯỜI DÙNG đọc — viết cho họ, để chi tiết kỹ thuật (mã) ở cuối trong ngoặc.

### 15/11/2026 — CT Language iOS (khối bài học chưa hỗ trợ + chân mục lục) — còn nút "Làm phần này trên web" mở Safari tới cuongthai.com
- **Triệu chứng:** (soát trước khi nộp App Store, chưa ai báo) khối bài học app chưa hiểu (`.chuaBiet`) hiện nhãn "Sắp có trên app" + nút "Làm phần này trên web" mở Safari tới cuongthai.com — nơi có bán Pro; chân mục lục khoá ghi "Nội dung giống hệt bản web (cuongthai.com/…)".
- **Nguyên nhân:** `ios-app/CuongThaiApp/Shared/SachHoc/KhoiTuongTacSH.swift › DotHaiSH` (~dòng 630) và `MucLucSachHocView.swift › chanTrang` viết cho app CuongThai chính (có web đi kèm) rồi được kéo nguyên sang CT Language qua `Shared/SachHoc`.
- **Cách sửa:** trong `#if CTLANGUAGE_APP`: bỏ nút ra web, nhãn "Cần cập nhật app", lời "cập nhật app lên bản mới nhất trong App Store"; chân mục lục bỏ nhắc web. App chính giữ nguyên (ios-app `aec5867`).
- **Ảnh hưởng:** chỉ hiện khi máy chủ xuất loại khối mới hơn app (hôm nay 0 khối như vậy trong 5 khoá) — nhưng reviewer gặp là dính 3.1.1 (dẫn ra kênh mua ngoài IAP); chân mục lục hiện ở mọi khoá.
- **Bài học:** mã `Shared/` kéo sang app mới phải grep lại mọi chữ "web"/"cuongthai.com"/`openURL` theo luật của app MỚI — lưới đỡ ít khi hiện chính là chỗ reviewer hay vấp mà không ai thấy khi chạy thử.

### 15/11/2026 — CT Language iOS (bố cục iPhone SE) — tiêu đề bị cắt "Bảng ch…", chữ đầu trang từ bẻ "食べ / る", ô Thi thử cắt chữ, dải công cụ cắt ngang
- **Triệu chứng:** trên iPhone SE (375 pt): thẻ đầu tab Học hiện "Bảng ch…"/"Pinyin & / thanh / điệu" vì chip "Học trước tiên" chiếm chỗ; trang từ điển bẻ 食べる thành hai dòng và 3 chip (Hán Việt/Phồn thể/Thông dụng) vỡ chữ; Thi thử hiện "Vinh danh t…/Điểm cao 7 n…"; dải công cụ Từ điển bị cắt ở lề trong như nút vỡ; tiêu đề "Đọc báo · trang web" bị nhãn MỚI bẻ đôi; nút Gấu nổi che thẻ "Bài tiếp" cuối bài học.
- **Nguyên nhân:** `HStack` cứng chữ + chip/nút ở `HocCTL.theChuNen`, `ChiTietTuCTL.dau`, `TrungTamDichCTL.theDocWeb`; `lineLimit(1)` ở `PhongThiCTL.oNho`; `ScrollView(.horizontal)` nằm trong khung có lề 18 ở `TuDienCTL.congCu`; đệm đáy 60 ở `BaiSachHocView` < chiều cao nút Gấu (~84). Chỉ từng QA trên Pro Max.
- **Cách sửa:** `ViewThatFits` (không vừa ⇒ chip/nút xuống dòng), chip trang từ dùng `DongTuXuong`, ô Thi thử cho 2 dòng + cao bằng nhau, dải công cụ bù lề `-18` để cuộn tới mép màn, đệm đáy bài 110 (ios-app `2d4afd2`).
- **Ảnh hưởng:** mọi iPhone hẹp (SE 2/3, mini ở cỡ chữ lớn) ở cả 3 ngôn ngữ; chưa phát hành.
- **Bài học:** QA giao diện phải chạy cả máy HẸP NHẤT đang hỗ trợ, không chỉ máy to — và hàng có chip/nút cạnh tiêu đề nên dựng sẵn bằng `ViewThatFits` thay vì `HStack` + `lineLimit`.

### 15/11/2026 — CT Language + app CuongThai iOS (giọng đọc trong máy, vá nốt sau 0e4b5ca) — còn 11 chỗ gọi API giọng trên luồng chính lúc danh sách giọng đang nạp ⇒ cùng kiểu khoá chết
- **Triệu chứng:** (chưa ai báo — rà mã sau vụ đứng hình ở game) cùng kịch bản app treo vĩnh viễn nếu trong vài giây đầu sau khi mở app người dùng nghe Gấu khen (`CoVuGau`), gọi thoại CuongMini đọc bằng giọng máy, bấm loa ở từ điển/thẻ (`DocTu`), Máy nghe, Dịch văn bản, hay mở màn Chọn giọng.
- **Nguyên nhân:** `ios-app/CuongThaiApp/Shared/NgonNgu/CaiDatGiong.swift › giongTuDong` tự gọi `napNen()` rồi trả NGAY `AVSpeechSynthesisVoice(language:)` trên luồng chính (chính là thế khoá chết); `luaChon()` ⇒ `danhSach()` ⇒ `speechVoices()` đồng bộ trên luồng chính mỗi khi người dùng đã chọn giọng; `DocTu.doDuoc` (chạy trong `body`), `DocTu.doc/docThu`, `GiongGau.noi`, `PhienGoiCTL.giongTrenMay`, `MayNgheCTL.docTu`, `DocMayDichCTL.batTat`, `ChonGiongView.danhSach` gọi thẳng `(language:)`/`(identifier:)`/`speechVoices()`; bản vá 0e4b5ca ở `GiongSachHoc` còn sót `(identifier:)` trên luồng chính trước khi nạp xong.
- **Cách sửa:** một cửa chung `KhoGiongMay.voiGiong` / `giongDeNoi` (đã nạp ⇒ chọn ngay như cũ; chưa ⇒ chọn giọng trên hàng đợi nền nối tiếp SAU khi nạp, rồi mới về luồng chính nói, kèm bộ đếm lượt để câu cũ không nói đè), mọi lượt nạp đi qua cùng một hàng đợi; `giongTuDong` chưa nạp ⇒ `nil`; `luaChon` chưa nạp ⇒ dựng từ id đã lưu; `doDuoc` chưa nạp ⇒ tạm `true`; Chọn giọng chờ `choNap()` ở `.task` (ios-app — xem `git log -S voiGiong`).
- **Ảnh hưởng:** cả CT Language lẫn app CuongThai chính (dùng chung `Shared/NgonNgu`), chỉ trong cửa sổ vài giây lúc danh sách giọng đang nạp lần đầu; chưa kiểm trên máy ảo — mới dựng xanh cả hai scheme.
- **Bài học:** vá một chỗ thì phải `grep` TẤT CẢ lời gọi cùng API ngay lúc đó — và soi cả hàm tiện ích "an toàn" (ở đây `giongTuDong` chính là thủ phạm gốc); với API có khoá nội bộ, gom về MỘT cửa có luật rõ (chưa nạp ⇒ không chạm trên luồng chính) thay vì vá từng nơi gọi.

### 16/11/2026 — Quy trình git (game viết tay "Gấu Thư Pháp", bắt ngay sau commit) — commit bằng chỉ mục tạm để lại chỉ mục CHUNG "đang xoá" commit vừa làm
- **Triệu chứng:** sau khi commit `troChoiThuan.ts` + test bằng `GIT_INDEX_FILE` tạm (vì chỉ mục chung có `CLAUDE.md` của phiên khác đang stage), `git status` hiện `MM` cho đúng hai tệp vừa commit.
- **Nguyên nhân:** chỉ mục chung vẫn giữ blob CŨ của hai tệp ⇒ so với HEAD mới, nó chính là một thay đổi đã stage HOÀN TÁC commit của mình; phiên khác chạy `git commit` (không pathspec) là đẩy luôn bản hoàn tác đó lên.
- **Cách sửa:** ngay sau commit bằng chỉ mục tạm, `git reset -q HEAD -- <đúng các tệp vừa commit>` cho chỉ mục chung (api-backend 137210a64 / 89eabf22a, ios-app 064c8bf — tệp có đồ dở của phiên khác thì dựng blob từ `git show HEAD:<tệp>` + `hash-object`, không add cả tệp).
- **Ảnh hưởng:** không ai — bắt ngay ở `git status` sau commit.
- **Bài học:** commit bằng chỉ mục tạm KHÔNG xong ở `git commit`: phải đồng bộ lại mục của những tệp đó trong chỉ mục chung, rồi `git status` phải sạch hai cột cho đúng các tệp ấy.

### 16/11/2026 — CT Language (khung game + "Gấu Canh Trời", bắt khi đang làm — chưa lên người dùng) — pinyin sai thanh vẫn "đúng" + chữ rơi chui dưới thanh điểm
- **Triệu chứng:** (1) test `TroChoiKhungTests` — gõ `xue3` cho 学习 (xue2 xi2) được nhận là đang đúng; (2) ảnh máy ảo: chữ mới mọc nằm dưới thanh điểm/tim + tai thỏ vài giây, không đọc được.
- **Nguyên nhân:** (1) `DapAnGoCTL.swift` luôn thêm một dãy "chữ trơn bỏ số" làm lưới đỡ — dãy đó nuốt luôn số thanh SAI dù đã tách được âm tiết; (2) `CanhTroiCTL.swift` đọc `g.safeAreaInsets.top` trong GeometryReader đã `.ignoresSafeArea(edges: .top)` ⇒ luôn 0, HUD + điểm mọc chữ lọt dưới tai thỏ.
- **Cách sửa:** (1) chỉ thêm dãy chữ trơn khi KHÔNG tách được âm tiết; (2) đọc vùng an toàn từ GeometryReader NGOÀI (không bỏ vùng an toàn), chữ mọc ở `tren + 74` (ios-app 28d1798, 8838ff0).
- **Ảnh hưởng:** không ai — bắt trước khi commit đầu tiên lên TestFlight.
- **Bài học:** lưới đỡ "khớp lỏng" phải chỉ bật khi đường chặt không dùng được, không thì nó âm thầm nới luật; GeometryReader đã bỏ vùng an toàn thì `safeAreaInsets` của chính nó là 0 — lấy từ khung cha.

### 15/11/2026 — Cổng Anthropic chính hãng — lượt "nói nhanh" của Sonnet 5.5 gửi `thinking: disabled` (API trả 400)
- **Triệu chứng:** không ai thấy lỗi — CT Work / Luyện nói vẫn trả lời, chỉ chậm hơn một vòng mạng mỗi lượt Sonnet 5.5 (suy từ tài liệu API, CHƯA đối chiếu log prod).
- **Nguyên nhân:** `goiVanBanChinhHang` (`src/services/agent/anthropicChinhHang/dinhTuyen.ts`) đặt cứng `thinking: {type:'disabled'}` cho mọi model ở chế độ `nhanh`; Sonnet 5.5 từ chối `disabled` (phải `between_tools`), Opus 5.5 không tắt được thinking ⇒ 400 ⇒ `banAnToan` gửi lại bằng adaptive.
- **Cách sửa:** `thinkingNhanh(model)`: Sonnet 5.5 ⇒ `between_tools`, Opus 5.5/Fable ⇒ bỏ trường, còn lại `disabled` (commit cùng bản não Odin chính hãng).
- **Ảnh hưởng:** mọi lượt `nhanh` chạy Sonnet 5.5 — Luyện nói (từ 13/11, khi đổi Haiku → Sonnet), CT Work, chấm thi.
- **Bài học:** đổi model trong chuỗi "nói nhanh" thì soi lại bảng thinking theo model; lưới đỡ "gửi lại bản tối giản" che lỗi khỏi người dùng nhưng cũng che khỏi người vận hành — đếm số lần nó bật trong log.

### 15/11/2026 — CT Language (Hỏi Gấu đợt 4 — đọc ảnh, bắt khi đang làm) — model tin đáp án in sẵn trong ảnh + trần ra thiếu loại "đọc ảnh"
- **Triệu chứng:** (1) đo thật với ảnh bài tập giả có dòng "こたえ" in sẵn: model chép đúng chữ nhưng khen "bạn làm đúng cả 3 câu" theo đáp án in sẵn (câu 1 chưa chuẩn); (2) `tsc` báo `TRAN_RA` thiếu khoá `doc-anh` — test vẫn xanh vì so `maxTokens` với chính `TRAN_RA['doc-anh']` (cả hai `undefined`) ⇒ lượt có ảnh chạy trần mặc định 1500.
- **Nguyên nhân:** (1) khung `doc-anh` (`src/services/ctlanguage/hoiGau.ts › KHUNG`) chưa dặn tự kiểm lời giải có sẵn; (2) thêm khoá vào `KIEU_CAU` mà sót bảng `TRAN_RA`, và test đối chiếu với chính hằng số đang kiểm.
- **Cách sửa:** (1) thêm dòng "đáp án in sẵn có thể sai — TỰ KIỂM; không thấy bài làm thì đừng nói bạn làm đúng" (đo lại: model sửa câu 1 và nói rõ đáp án in sẵn sai); (2) thêm `'doc-anh': 2600`, test so với số cụ thể (commit đợt 4).
- **Ảnh hưởng:** không ai — chưa deploy.
- **Bài học:** test so với chính hằng số đang kiểm là test rỗng (undefined === undefined) — so với GIÁ TRỊ cụ thể. Lời nhắc đọc ảnh phải tính tới chữ trong ảnh là DỮ LIỆU có thể sai, không phải sự thật.

### 15/11/2026 — CT Language (Hỏi Gấu đợt 3 — stream, bắt khi đang làm) — nháp đang viết chỉ hiện khối đầu tiên
- **Triệu chứng:** màn xem thử giả lập stream (`CT_XEM_MAN=tro-ly-luong`) hiện thẻ câu trả lời TRỐNG dù nháp đã 700 ký tự; với luồng thật sẽ chỉ thấy đúng số khối của mẩu đầu tiên tới khi xong.
- **Nguyên nhân:** `TraLoiGauView` (`ios-app …/TroLyGau/TraLoiGauCTL.swift`) cắt khối theo `@State soHien`; `State(initialValue:)` chỉ có tác dụng LẦN DỰNG ĐẦU — nháp lớn dần (cùng view, `hienDan = false`) vẫn bị cắt theo số khối lúc nháp còn rỗng.
- **Cách sửa:** chỉ dùng `soHien` khi `hienDan`; còn lại hiện mọi khối (commit đợt 3).
- **Ảnh hưởng:** không ai — chưa lên app.
- **Bài học:** `@State` khởi tạo từ tham số init là "ảnh chụp lần đầu"; view có dữ liệu đổi liên tục (stream) phải tự tính từ tham số. Một màn xem thử giả lập luồng bắt lỗi mà test thuần không thấy.

### 15/11/2026 — CT Language (Hỏi Gấu đợt 2/2b, bắt khi đang làm — chưa lên người dùng) — regex ICU sập app + tổng thời gian chờ vượt mức Cloudflare
- **Triệu chứng:** (1) test iOS `TroLyGauTests` sập `Fatal error: 'try!' … NSCocoaErrorDomain 2048` ngay khi vẽ câu trả lời đầu tiên; (2) đo thật một lượt "dịch & phân tích" mất 116 s.
- **Nguyên nhân:** (1) `TraLoiGauCTL.swift` viết `\u{00A0}` trong chuỗi thô `#"…"#` cho `NSRegularExpression` — đó là cú pháp Swift, ICU chỉ hiểu `\x{00A0}`/`\u00A0` ⇒ `try!` sập; (2) `hoiGau.ts` đặt `timeoutMs 75 s` + `maxRetries 1` cho tuyến KHÔNG stream ⇒ tối đa ~150 s, quá 125 s Cloudflare cắt (524).
- **Cách sửa:** (1) đổi sang `\x{00A0}`; (2) 55 s × 2 lần ≈ 110 s, ghi chú ngay chỗ đặt (cùng commit đợt 2b).
- **Ảnh hưởng:** không ai — bắt bằng test + đo thật trước khi commit.
- **Bài học:** regex trong chuỗi thô Swift là cú pháp ICU, không phải Swift; mọi `try! NSRegularExpression` phải có ít nhất một test chạm tới. Tuyến AI không stream: tính `timeout × số lần thử` so với 125 s mỗi khi nâng trần token.

### 15/11/2026 — CT Language (Hỏi Gấu / CuongMini) — câu trả lời "thô, khó nhìn, ngắn quá" (chữ trắng trơn, không tiêu đề, không màu)
- **Triệu chứng:** bấm "Tóm tắt bài này" ở Dekiru Bài 1 ⇒ một khối chữ trơn vài gạch "•", không đậm, không tiêu đề, không phân biệt chữ Nhật với chữ Việt, cụt ở ~200 chữ.
- **Nguyên nhân:** bốn chỗ cùng chặn: (1) lời nhắc `nhacHoiGau` (`src/services/ctlanguage/hoiGau.ts`) đòi "tối đa khoảng 200 chữ" và CẤM tiêu đề/**đậm**/bảng; (2) `lamSachGau` (`congDongGau.ts:57`) xoá `**`/`#` còn sót và cắt 2000 ký tự; (3) `maxTokens: 900`; (4) app vẽ `Text(t.noiDung)` trơn (`TroLyGauCTL.swift › bongTin`). Thêm: ngữ cảnh bài cắt 3000 ký tự và `NguCanhGau.baiSach` dùng `PhanTichChuSH.tron` ⇒ model mất furigana của mọi kanji trong bài.
- **Cách sửa:** app gửi `dinhDang: 2` ⇒ lời nhắc theo loại câu (`phanLoaiCau`: tóm tắt/ngữ pháp/từ/chữa câu/đố/ví dụ/câu thi/tự do) + cú pháp hiển thị (`##`, `` `từ` ``, `{漢字|かな}`, hộp `> 💡/⚠️/✅`, `Đáp án:` ẩn), trần ra 1600–2600 theo loại, ngữ cảnh 6000 giữ furigana, khối `[[goi-y]]` ⇒ chip hỏi tiếp; app có bộ vẽ `TraLoiGauCTL.swift` (màu ngôn ngữ, furigana ruby, chạm từ để nghe, bảng, hộp màu, hiện dần). App cũ không gửi `dinhDang` ⇒ giữ đường cũ. Trong lúc làm, test bắt `/\bđố\b/` không bao giờ khớp "Đố mình" (`\b` của JS chỉ ASCII) ⇒ đổi `(?<!\p{L})…(?!\p{L})` + cờ `u`.
- **Ảnh hưởng:** mọi câu Hỏi Gấu của app CT Language từ khi ra tính năng (15/11) tới bản này; câu trả lời vẫn đúng, chỉ khó đọc và thiếu.
- **Bài học:** lời nhắc "ngắn gọn, đừng định dạng" là quyết định của TẦNG HIỂN THỊ — khi app chỉ có `Text` trơn thì đúng, nhưng phải sửa cùng lúc cả ba tầng (lời nhắc · làm sạch · bộ vẽ) và gắn cờ phiên bản (`dinhDang`) để app cũ không thấy cú pháp thô. Ngữ cảnh đưa AI phải giữ thông tin (cách đọc), không dùng hàm "chữ trơn để so đáp án".

### 15/11/2026 — App iOS CT Language (SachHoc) — thiếu 6 loại khối web đã có ⇒ thẻ "chưa hỗ trợ · Làm phần này trên web"
- **Triệu chứng:** mở Dekiru Bài 1 trên iPhone thấy hàng loạt thẻ "Khối “hinh” — Bản app này chưa hiểu loại nội dung này — Làm phần này trên web"; các bài có slide, sơ đồ, hình Writing Task 1 và Luyện bảng chữ (Bài 0) cũng vậy.
- **Nguyên nhân:** web thêm `hinh/canh/slides/sodo/figure/luyenKana` (09–12/11, `frontend/src/components/sach-hoc/types.ts`) và `sach-hoc-xuat.mts` gửi nguyên `blocks` cho app, nhưng bộ giải mã app (`ios-app/CuongThaiApp/Shared/SachHoc/MoHinhSachHoc.swift` › `KhoiBoc.giai`) dừng ở 27 loại ⇒ `default: .chuaBiet(t)`. Kèm theo: app bỏ qua `vocab.anh`, `onthe.bai`, `dictation.alt`.
- **Cách sửa:** vẽ native cả 6 loại (KhoiHinhSH · SoDoSH · LuyenKanaSH), kho hình đệm đĩa + tải sẵn khi mở buổi / "Tải hết để học ngoại tuyến" (AnhSachHoc), đọc thêm 3 trường bị bỏ, test `KhoiSachHocDuTests` quét toàn bộ bản xuất mọi khoá ⇒ 0 `.chuaBiet`/`.loi` (ios-app commit 08afee8).
- **Ảnh hưởng:** người học app CT Language/CuongThai ở 5 khoá kiểu sách (~970 khối) từ khi web thêm các khối này tới 15/11; nội dung vẫn đúng trên web.
- **Bài học:** thêm loại khối ở web là thay đổi HỢP ĐỒNG với app — phải có phép kiểm quét bản xuất thật bên app (giờ là `KhoiSachHocDuTests.testQuetToanBoNoiDung`) chứ không chỉ lưới đỡ `.chuaBiet` lặng lẽ.

### 15/11/2026 — Xoá tài khoản — hồ sơ học CT Language không bị xoá dù màn Xoá tài khoản của app hứa xoá
- **Triệu chứng:** app CT Language (Tôi › Xoá tài khoản) ghi "Dữ liệu cá nhân bị xoá: … hồ sơ học, tiến độ, sổ từ", nhưng sau khi yêu cầu có hiệu lực dòng `ctlanguage_profiles` của người đó vẫn còn.
- **Nguyên nhân:** `anonymizeAccount` (`src/services/dataRights.service.ts`) chỉ ẩn danh hoá user (không xoá hàng `users`) ⇒ mọi FK `onDelete: Cascade` KHÔNG chạy; bảng nào không được liệt kê `deleteMany` trong giao dịch thì nằm lại. `ctlanguage_profiles` còn không có FK.
- **Cách sửa:** thêm `ctlSoTuMuc.deleteMany` (sổ tay đồng bộ mới) + `ctLanguageProfile.deleteMany` vào giao dịch; test `soTuDongBo.db.test.ts` gọi `anonymizeAccount` rồi kiểm sổ trống (commit đồng bộ sổ tay 15/11).
- **Ảnh hưởng:** người dùng app CT Language đã xoá tài khoản trước 15/11 (hồ sơ học còn trên máy chủ); không lộ ra ngoài.
- **Bài học:** bảng dữ liệu NGƯỜI DÙNG mới ⇒ thêm vào `anonymizeAccount` cùng commit — "FK CASCADE" không cứu được vì tài khoản không bị xoá hẳn.

### 15/11/2026 — Prisma / migration viết tay — cột `nextval` của dãy số rời bị `migrate diff` đòi xoá dãy số
- **Triệu chứng:** sau `migrate deploy` migration `ctl_so_tu_muc`, `npx prisma migrate diff --from-schema-datasource … --to-schema-datamodel …` vẫn in `ALTER COLUMN "phien_ban" DROP DEFAULT; DROP SEQUENCE "ctl_so_tu_phien_ban_seq"` (lệch).
- **Nguyên nhân:** SQL tạo `CREATE SEQUENCE` riêng + `DEFAULT nextval(...)`, schema khai `@default(dbgenerated("nextval(...)"))` — Prisma đọc dãy số KHÔNG thuộc (OWNED BY) cột nên coi là lệch.
- **Cách sửa:** migration chưa deploy nơi nào ⇒ gỡ ở CSDL local, viết lại cột thành `BIGSERIAL` + schema `@default(autoincrement())` (dãy `ctl_so_tu_muc_phien_ban_seq` thuộc cột) ⇒ diff không còn dòng nào của bảng này.
- **Ảnh hưởng:** chỉ CSDL local trong lúc làm; production chưa nhận migration.
- **Bài học:** cột số tăng không phải khoá chính ⇒ `BIGSERIAL` + `autoincrement()`; viết tay migration xong LUÔN chạy `migrate diff` (khuôn trong CLAUDE.md) trước khi coi là xong.

### 15/11/2026 — Video bài giảng (công cụ demo chay.py) — tệp Markdown trong @file làm vỡ kịch bản demo (IndexError)
- **Triệu chứng:** `python3 scratchpad/aic/chay.py n0-9` chết giữa chừng `IndexError: list index out of range` ở vòng tìm `@end`; khối demo trước đó đã chạy nhưng `demo/out/n0-9.json` KHÔNG được ghi (json chỉ ghi cuối hàm) ⇒ mất cả output khối đã chạy.
- **Nguyên nhân:** `scratchpad/obj/chay.py` (và mọi bản chép: sio/obj/aic) tách khối bằng MỌI dòng bắt đầu `## ` TRƯỚC khi đọc `@file…@end` ⇒ tiêu đề `## Cài đặt` của README.md viết trong `@file` bị coi là khối mới, `@file` mất `@end`.
- **Cách sửa:** bản `scratchpad/aic/chay.py` theo dõi trạng thái trong-@file khi tách khối (dòng `## ` trong thân tệp là nội dung) — thử lại bằng tệp có `## B` trong @file: in đúng. Bản obj/sio CHƯA sửa (chưa ai viết Markdown trong @file).
- **Ảnh hưởng:** chỉ người soạn demo (khoá ai-coding, 15/11); không lọt lên web.
- **Bài học:** bộ phân tích dòng có "khối lồng" (thân tệp) phải tách theo trạng thái, không theo tiền tố dòng; và ghi kết quả dần (mỗi khối) để một lỗi giữa chừng không xoá kết quả đã có.

### 15/11/2026 — App CT Language (thi thử) — Bài nghe chung của nhóm tắt khi lật sang câu kế, không nghe lại được
- **Triệu chứng:** IELTS Mini Listening (một băng cho 10 câu, nghe MỘT lần): vừa bấm "Sau" sang câu 2 là băng tắt, nút nghe báo "Đã hết lượt nghe" ⇒ không cách nào nghe hết part trừ khi đứng yên ở câu 1.
- **Nguyên nhân:** `LamBaiThiVM.den()` gọi `GiongSachHoc.chung.dung()` VÔ ĐIỀU KIỆN mỗi lần lật câu, kể cả khi câu mới dùng chung bài nghe của nhóm (`thi-g-…`) mà lượt nghe đã bị trừ.
- **Cách sửa:** chỉ dừng khi câu mới KHÁC bài nghe (so `baiNghe(...).khoa`) — commit ios-app đợt mở rộng thi thử 15/11.
- **Ảnh hưởng:** 2 đề IELTS Mini trên TestFlight build 7 (đề HSK/JLPT nghe theo từng câu nên không dính); đề IELTS đủ 40 câu mới thêm sẽ hỏng hoàn toàn nếu không sửa.
- **Bài học:** đề có bài nghe CHUNG phải được thử bằng cách lật câu trong lúc băng chạy; "nghe được câu 1" chưa phải là nghe được bài.

### 15/11/2026 — Backend CT Language (thi thử) — Đề mang cấp chưa khai trong danh mục sẽ vỡ SAU khi đã lưu bài nộp
- **Triệu chứng:** (bắt được lúc soát mã, chưa lên prod) thêm đề với `cap` mới mà quên khai `CAP_THEO_NN` ⇒ đề qua `kiemDe`, không hiện ở phòng thi, và nếu nộp được thì `nop()` ném 400 "Cấp độ không hợp lệ" từ `vinhDanh` SAU khi đã ghi điểm.
- **Nguyên nhân:** `thi.ts › phieu()` gọi `vinhDanh(nn, cap)` — hàm này từ chối cấp ngoài `CAP_THEO_NN`; `kiemDe` không đối chiếu cấp với danh mục.
- **Cách sửa:** thêm `kiemCap` (thiThuan.ts) — `napDe` bỏ đề cấp lạ, script `ctlanguage-kiem-de-thi.mts` báo đỏ; khai đủ HSK4 / N3 / IELTS / IELTS-VIET (66d079b93).
- **Ảnh hưởng:** không (chặn trước khi thêm 14 đề mới).
- **Bài học:** hai bảng phải khớp nhau (đề ↔ danh mục cấp) thì cho máy kiểm ngay lúc nạp, đừng để lộ ra ở bước cuối của người dùng.

### 15/11/2026 — Nội dung thi thử CT Language — 70 câu phải sửa sau khi soát đủ 1.247 câu tự soạn
- **Triệu chứng:** soát từng câu 16 đề cũ (843 câu) + 4 đề mới (404 câu): không đáp án nào ghi sai, nhưng 4 câu có phương án nhiễu cũng đúng / dữ kiện hở, 6 câu sắp xếp thiếu hoặc thừa trật tự chấp nhận, 8 câu điền nhận biến thể vượt giới hạn từ, 14 giải thích chép lệch lời nghe, 16 câu dùng kanji/từ vượt cấp, 22 câu trùng ý giữa hai đề soạn song song, 4 chỗ TTS dễ đọc nhầm (十分, 方が, 辛い).
- **Nguyên nhân:** đề soạn một lượt không có người đọc lại độc lập; hai đề cùng cấp soạn song song không thấy nhau; `kiemDe` chỉ kiểm khuôn, không kiểm nội dung.
- **Cách sửa:** sửa tại chỗ (88e8bc8e0, 66d079b93) + script `scripts/ctlanguage-soat-de-thi.mts` (giải thích ngược đáp án, lời nghe lẫn chữ lạ, đáp án điền không có trong bài, câu trùng giữa các đề, pinyin/kana lệch từ điển `ctl_tu`).
- **Ảnh hưởng:** 16 đề đã lên TestFlight build 7 mang các lỗi nhỏ trên tới lần deploy kế.
- **Bài học:** đề mới = soạn → máy soát → MỘT lượt người/agent khác làm bài như thí sinh rồi mới so đáp án; đề cùng cấp soạn song song phải chạy bộ soát trùng trước khi nhận.

### 15/11/2026 — App CT Language — Bấm giữa nút Gấu nổi không ăn
- **Triệu chứng:** máy ảo: chạm vào hình Gấu ở nút nổi (trợ lý theo màn; có thể cả nút "Đặt câu hỏi" ở Cộng đồng) không mở gì, chỉ chạm mép viền mới ăn.
- **Nguyên nhân:** `LinhVat/GauPixel.swift` LUÔN gắn `.contentShape(Rectangle()).onTapGesture { if chamDuoc {…} }` — kể cả `chamDuoc = false` cử chỉ vẫn nằm đó và nuốt cú chạm của `Button` bọc ngoài.
- **Cách sửa:** `.allowsHitTesting(false)` cho GauPixel nằm TRONG nút (`TroLyGauCTL.NutTroLyGau`, `CongDongCTL.nutGau`) — commit đợt ảnh + Gấu trợ lý 15/11.
- **Ảnh hưởng:** nút mới (chưa phát hành); nút "Đặt câu hỏi" ở Cộng đồng bản TestFlight có thể dính cùng lỗi (chưa đo trên máy thật).
- **Bài học:** view tự xử lý chạm đặt trong `Button` phải tắt hit-testing; kiểm nút bằng cú chạm GIỮA hình trên máy ảo, không chỉ "build xanh".

### 15/11/2026 — App CT Language — Móc môi trường gắn ở mục lục không tới màn bài đã đẩy
- **Triệu chứng:** gắn `.environment(\.troLyBaiSH)` lên `MucLucSachHocView` (HocCTL) để màn bài nổi nút trợ lý — mở bài trên máy ảo không thấy nút.
- **Nguyên nhân:** bài đẩy bằng `NavigationLink { BaiSachHocView }` ở nhiều chỗ (mục lục, "bài tiếp", Luyện viết, Luyện thêm); đo thật thì giá trị môi trường gắn trên view mục lục (đích của một NavigationLink khác) không truyền xuống đích đã đẩy.
- **Cách sửa:** đổi sang móc TĨNH `MocTroLySH.nut` (Shared/SachHoc/MucLucSachHocView.swift), CT Language gắn một lần ở `GocCTL` (`NutTroLyGau.ganVaoSachHoc()`); app CuongThai không gắn ⇒ không đổi gì.
- **Ảnh hưởng:** chỉ trong lúc làm (chưa phát hành).
- **Bài học:** móc từ app vào màn dùng chung qua NHIỀU lối điều hướng ⇒ dùng biến tĩnh/đối tượng chung, đừng trông vào environment truyền qua NavigationLink; nghiệm thu bằng cách mở màn thật.

### 14/11/2026 — Hạ tầng (CI) — backend `tsc --noEmit` hết bộ nhớ ngẫu nhiên
- **Triệu chứng:** `npx tsc --noEmit` chết "Reached heap limit / allocation failure" sau ~58 s, không có lỗi kiểu nào; lượt khác cùng mã lại qua.
- **Nguyên nhân:** backend 3.5k tệp cần ~4,1 GB heap — sát trần mặc định của Node (~4 GB). `Dockerfile.backend` đã đặt 6144 từ 22/10, nhưng `scripts/kiem-ci-truoc-push.sh` (bước kiểm của deploy-nha) và `ci-lint.yml` chạy không nới.
- **Cách sửa:** `NODE_OPTIONS=--max-old-space-size=8192` cho bước backend tsc trong script kiểm (như frontend), 6144 cho bước tương ứng của `ci-lint.yml`.
- **Ảnh hưởng:** chưa chặn deploy nào (lượt 14/11 qua sát nút), nhưng sẽ làm đỏ CI / bỏ push ngẫu nhiên.
- **Bài học:** trần heap phải đặt ĐỒNG BỘ ở mọi chỗ chạy cùng một lệnh (Docker, script kiểm, CI) — đặt một chỗ thì chỗ kia hỏng sau.

### 14/11/2026 — App CT Language — Bấm loa / mở trang từ / màn thi treo hàng chục giây trên máy vừa cài
- **Triệu chứng:** máy ảo mới (và có thể máy thật vừa cài): mở trang từ trắng >30 s; màn thi đứng hình khi tự phát bài nghe.
- **Nguyên nhân:** `Shared/NgonNgu/CaiDatGiong.swift › giongTuDong` gọi `AVSpeechSynthesisVoice.speechVoices()` ĐỒNG BỘ trên luồng chính mỗi lần đọc; lần đầu dịch vụ TTS của iOS chưa thức ⇒ treo. Bản làm nóng mới (`GiongSachHoc.lamNongGiongMay`) còn gọi đúng hàm đó.
- **Cách sửa:** `KhoGiongMay` nạp danh sách ở nền một lần (khởi động app gọi `napNen`), `giongTuDong` chưa có danh sách thì dùng ngay giọng mặc định của vùng, không chờ; màn chọn giọng (người dùng chủ động mở) mới nạp đồng bộ. Kèm: dấu `"` chưa escape trong chuỗi `PhapLyCTL.swift` (commit 56d37a0) làm hỏng build — đổi sang ngoặc “ ”.
- **Ảnh hưởng:** mọi nút đọc to của CT Language + khoá kiểu sách app CuongThai, lần dùng đầu sau khi cài.
- **Bài học:** API hệ thống "trả mảng" vẫn có thể là lời gọi liên tiến trình — không gọi trên luồng chính trong đường bấm; build lại SAU MỖI sửa chuỗi, kể cả sửa một câu chữ.

### 14/11/2026 — App CT Language (đọc to) — Mở trang từ treo trắng cả màn: `speechVoices()` chạy trên luồng chính
- **Triệu chứng:** vừa cài app (máy ảo mới, iOS 27), mở một trang từ / màn có nút loa ⇒ màn trắng, app không phản hồi > 30 giây; không có yêu cầu nào tới máy chủ.
- **Nguyên nhân:** `ios-app/…/Shared/SachHoc/GiongSachHoc.swift` `lamNongGiongMay()` (thêm 14/11 để "bấm là kêu") gọi `CaiDatGiong.giongTuDong` ⇒ `AVSpeechSynthesisVoice.speechVoices()` ngay trên luồng chính, trong `napTruoc` của `.task` màn. Hàm đó hỏi dịch vụ TTS của hệ thống ĐỒNG BỘ (`axUnsafeForcedSync` + semaphore); dịch vụ chưa dựng xong danh sách giọng thì luồng chính đứng chờ (mẫu `sample`: 850/850 mẫu nằm ở `semaphore_wait_trap`).
- **Cách sửa:** lần hỏi danh sách giọng ĐẦU TIÊN chạy ở `Task.detached`, xong mới về luồng chính chọn giọng + nói câu câm (`noiCauCam`). Commit ios-app cùng đợt "trang từ dày".
- **Ảnh hưởng:** mọi màn gọi `DocToCTL.napTruoc` / `GiongSachHoc.napTruoc` (từ điển, bảng chữ, thẻ ôn, khoá kiểu sách) ở lần mở đầu sau khi cài — máy thật thường chỉ khựng vài trăm ms nên không ai thấy; máy ảo mới thì treo hẳn. Chưa lên App Store.
- **Bài học:** API "lấy danh sách" của AVSpeech / Accessibility là IPC đồng bộ — không gọi trên luồng chính ở đường mở màn; nghiệm thu trên máy ảo MỚI TẠO (trạng thái "vừa cài"), không chỉ máy đã dùng lâu; màn trắng không lỗi ⇒ `sample <pid>` xem luồng chính trước khi đoán.

### 14/11/2026 — Backend test (CT Language Dịch) — Test tuyến chạy xanh rồi TREO 3 phút, node:test báo "cancelled"
- **Triệu chứng:** `npx tsx --test src/routes/ctlanguage.dich.routes.test.ts` — cả 3 phép kiểm ✔ nhưng tiến trình không thoát, tới `timeout` thì báo `cancelled 1` / "Promise resolution is still pending but the event loop has already resolved".
- **Nguyên nhân:** router dùng `express-rate-limit` + `RedisStore`; `new RedisStore(...)` nạp script ngay lúc NẠP router ⇒ gọi `getRedis()` ⇒ mở kết nối Redis giữ vòng lặp sự kiện sống mãi (`src/routes/ctlanguage.dich.routes.ts`, hàm `gioiHan`).
- **Cách sửa:** test gắn `after(() => setTimeout(() => process.exit(process.exitCode ?? 0), 200).unref())` — xong hết thì thoát hẳn, giữ mã thoát (commit Đợt D màn Dịch).
- **Ảnh hưởng:** chỉ bộ test mới (chưa vào CI); không ảnh hưởng người dùng.
- **Bài học:** test nào nạp router có `RedisStore` (hoặc thứ gì mở kết nối lúc nạp) phải tự đóng/thoát; "pass hết mà không thoát" là dấu hiệu handle mở, không phải test chậm.

### 14/11/2026 — Backend CT Language (cộng đồng) — "Người đã chặn" luôn trống: GET /cong-dong/chan bị `:nn` nuốt
- **Triệu chứng:** app CT Language › Tôi › Người đã chặn không bao giờ hiện ai (đã chặn vẫn "Bạn chưa chặn ai"); máy chủ trả 400 `CTL_NN_SAI` "Ngôn ngữ không hỗ trợ".
- **Nguyên nhân:** `src/routes/ctlanguage.routes.ts` khai `GET /cong-dong/:nn` (công khai) TRƯỚC `GET /cong-dong/chan` (sau `router.use(authenticate)`) ⇒ Express khớp "chan" vào `:nn` ⇒ `kiemNn('chan')` ném 400; app nuốt lỗi (`try?`) nên chỉ thấy danh sách rỗng.
- **Cách sửa:** mọi GET `/cong-dong/<chữ cố định>` (chan, thong-bao, luot-gau, nguoi/…) dời lên TRÊN `/cong-dong/:nn`, gắn `authenticate` từng tuyến; test `src/routes/ctlanguage.congDong.routes.test.ts` đọc `router.stack` và đỏ nếu có tuyến `/cong-dong/<chữ>` cùng phương thức khai sau `:nn`. App: màn hiện lỗi thay vì "chưa chặn ai".
- **Ảnh hưởng:** mọi người dùng app CT Language từ bước 6 (13/11, chưa lên App Store) — chặn VẪN có hiệu lực ở máy chủ, chỉ màn danh sách/bỏ chặn hỏng.
- **Bài học:** tuyến tham số một đoạn (`/x/:p`) nuốt mọi tuyến chữ cố định cùng độ sâu khai sau nó — khai tuyến cố định trước, và có test thứ tự; app đừng `try?` rồi hiện "trống" cho một lỗi.

### 14/11/2026 — App CT Language (đọc to) — Chạm từ / chữ cái / bài đọc phải chờ 3–5 giây mới nghe
- **Triệu chứng:** chạm loa ở từ điển, bảng chữ cái, thẻ ôn, bài học ⇒ im 3–5 s rồi mới đọc, người dùng tưởng hỏng.
- **Nguyên nhân:** `ios-app/…/Shared/SachHoc/GiongSachHoc.swift` mỗi lần bấm làm HAI vòng mạng nối tiếp: `POST /ielts/doc` (máy chủ tổng hợp Azure + lưu R2 nếu chưa có) rồi AVPlayer tải mp3 từ CDN; chỉ nhớ URL trong RAM, không lưu tệp, không tải trước; giọng trong máy chỉ dùng khi lỗi.
- **Cách sửa:** lưu tệp tiếng trên máy (Caches/giong-sach-hoc, theo băm giọng|tốc|chữ) ⇒ lần sau phát tức thì cả khi offline; `napTruoc` tải sẵn khi nút loa/ô chữ/thẻ hiện ra (hàng đợi 3 lượt); chưa có tệp thì chờ tối đa 0,6 s (chuỗi 1,2 s) rồi đọc ngay bằng giọng iPhone, tệp vẫn tải tiếp; làm nóng AVSpeechSynthesizer bằng một câu câm.
- **Ảnh hưởng:** mọi nút đọc của app CT Language và khoá kiểu sách của app CuongThai, từ khi có giọng máy chủ.
- **Bài học:** âm thanh "bấm là kêu" không được đi mạng trên đường bấm — tải trước + đệm trên máy + đường lùi tức thì; đo bằng tay trên 4G thật, không trên Wi-Fi nhà.

### 14/11/2026 — App CT Language (gọi CuongMini) — Gọi lần đầu kẹt, nghe ra "Thank you for watching", giọng Việt lơ lớ
- **Triệu chứng:** (1) bấm gọi có lúc kẹt "Đang gọi CuongMini…" mãi, phải tắt gọi lại; khi đã báo lỗi thì nút mic bị khoá dù chữ bảo "bấm mic để thử lại". (2) Nói tiếng Nhật mà máy ghi ra tiếng Anh, hoặc ra "Thank you for watching." (3) Phần tiếng Việt hướng dẫn nghe như người Tây đọc.
- **Nguyên nhân:** (1) `GoiCuongMiniCTL.swift` hỏi đồng ý AI + quyền micro trong `.task` của màn toàn hình đang trượt lên — hộp thoại có lúc không hiện, lời chờ không trả về; `.disabled` của mic không gồm `.loi`. (2) `troChuyenLuong.service.ts` gọi Whisper `language: ''` (tự dò) ⇒ giọng Nhật của người Việt bị dò thành tiếng Anh; ghi âm im lặng (phiên âm thanh bị "Nghe lại"/hiệu ứng đổi sang `.ambient`) ⇒ Whisper bịa câu phụ đề YouTube. (3) Giọng mặc định `en-GB-AdaMultilingualNeural` đọc cả tiếng Việt.
- **Cách sửa:** app hỏi quyền TRƯỚC khi mở màn gọi, canh 25 s tự gọi lại câu mở đầu, mic dùng được ở trạng thái lỗi, đặt lại phiên `.playAndRecord` trước mỗi lượt ghi, không gửi bản ghi im lặng (đỉnh < −42 dB); máy chủ `ngheHocVien.ts`: tự dò → dò lệch thì ép `language` = ngoại ngữ đang học → lọc câu bịa (mẫu phụ đề 4 thứ tiếng + `no_speech_prob`); giọng mới `hoai-my`/`nam-minh` (giọng Việt bản xứ Azure, nhiều `<voice>` trong một SSML) + "Giọng iPhone" (`giong: 'may'`, máy chủ không đọc, app đọc giọng tốt nhất đã tải).
- **Ảnh hưởng:** mọi người dùng gọi CuongMini trên app CT Language từ bản đầu (13/11); phần STT cũng áp cho phòng trò chuyện của web.
- **Bài học:** Whisper không bao giờ nói "không nghe thấy" — luôn kiểm ngôn ngữ dò được + mẫu câu bịa trước khi tin chữ; hộp thoại hệ thống không hỏi lúc màn đang chuyển cảnh; chữ hướng dẫn "bấm X" phải đi kèm X bấm được.

### 14/11/2026 — Web (SEO) — Trang khoá học /courses/[slug] trả HTML không có nội dung khoá
- **Triệu chứng:** `curl -s https://cuongthai.com/courses/nextjs -A Googlebot | grep -c '<h1'` ⇒ 0. Máy tìm kiếm / bot xem trước link / AI đọc trang chỉ thấy spinner: không tên khoá trong thân trang, không mô tả, không mục lục (chỉ có `<title>`/og/JSON-LD trong `<head>`). Áp cho MỌI khoá Courses + Academy.
- **Nguyên nhân:** `frontend/src/app/courses/[slug]/page.tsx` ĐÃ tải khoá phía server (cho `generateMetadata` + JSON-LD) nhưng vứt đi, trả `<CoursePageClient />` không props; `CoursePageClient.tsx` khởi đầu `loading = true` và vẽ spinner cho tới khi JS tự gọi `GET /courses/:slug?gon=1` — `<h1>` chỉ có sau khi JS chạy.
- **Cách sửa:** `page.tsx` tải bản CÔNG KHAI (`?gon=1`, KHÔNG gửi cookie ⇒ cache `revalidate 300` không mang cờ ghi danh/tiến độ của ai) và truyền `initialCourse` xuống; client khởi tạo `course`/`loading`/chương đầu mở từ đó (render đầu trùng HTML server ⇒ không lệch hydrate), rồi tải lại LẶNG bằng phiên người xem cho phần theo người; server lỗi/404 ⇒ `initialCourse = null` ⇒ y như cũ. JSON-LD `Course` thêm `courseCode`, `inLanguage` (mã BCP 47), `offers`/`isAccessibleForFree` (theo `accessType`), `hasCourseInstance` (Online + thời lượng), `syllabusSections`.
- **Ảnh hưởng:** SEO + xem trước link của toàn bộ trang khoá từ khi trang chuyển sang client (chưa rõ ngày). Người dùng thật không thấy lỗi (chỉ một nhịp spinner).
- **Bài học:** "có `generateMetadata`" ≠ "trang có nội dung cho bot" — kiểm bằng `curl … | grep -c '<h1'`, không bằng mắt trên trình duyệt (JS đã chạy). Dữ liệu SSR dùng chung cache phải là bản ẩn danh; phần theo người chỉ đọc sau mount.

### 14/11/2026 — Web (CSS) — Huy hiệu ngôn ngữ ở /repos và vòng ở /creator mất màu
- **Triệu chứng:** trang /repos: huy hiệu Shell mất cả 3 màu, Swift/C++/C# mất màu nền, JavaScript mất màu chữ; /creator thiếu vòng `ring-cyan-500/30`.
- **Nguyên nhân:** `frontend/tailwind.config.ts` chỉ quét `src/pages|components|app` — lớp Tailwind khai trong `src/lib/repos.ts`, `src/lib/studio-meta.ts` không bao giờ được sinh ra CSS (8 lớp vắng khỏi CSS prod).
- **Cách sửa:** thêm `./src/lib/**/*.{js,ts,jsx,tsx}` vào `content`.
- **Ảnh hưởng:** /repos và /creator, từ khi bảng màu dời sang src/lib.
- **Bài học:** Tailwind 3 chỉ sinh lớp nó THẤY trong đường quét — dời chuỗi lớp sang thư mục mới phải thêm đường quét; kiểm bằng cách grep lớp đó trong CSS build. Phát hiện nhờ khoá Next.js 13.x (`doi-css-kho.py`).

### 14/11/2026 — Realtime (frontend) — Sau proxy bỏ header Upgrade, client không bao giờ lùi về polling
- **Triệu chứng:** người dùng sau mạng/proxy chặn WebSocket (trường, công ty) không có tin nhắn, thông báo, gọi thoại realtime; console lặp "websocket error" 400.
- **Nguyên nhân:** `frontend/src/lib/socket.ts:117` đặt `transports: ['websocket','polling']` mà không bật `tryAllTransports` ⇒ engine.io-client chỉ thử lại websocket, không chuyển sang polling (trái chú thích ở `src/socket/messaging.socket.ts`). Đo bằng chính engine.io-client 6.6.5 của frontend: 3 lần/8 s đều lỗi.
- **Cách sửa:** thêm `tryAllTransports: true` (socket.io-client 4.8+).
- **Ảnh hưởng:** chỉ người dùng ở mạng chặn WebSocket — nhưng chính là nhóm sinh viên dùng mạng trường.
- **Bài học:** cấu hình "dự phòng" phải được thử bằng cách làm hỏng đường chính thật (proxy cắt Upgrade), không chỉ đọc tài liệu. Phát hiện nhờ khoá Socket.IO 10.2.

### 14/11/2026 — Web khoá học — ~1.700 video bài giảng bị YouTube che, người học "không thấy video"
- **Triệu chứng:** mở bài học chỉ thấy video YouTube tuyển chọn; video bài giảng của kênh (đã lên R2, đã gắn) nằm ở tab phụ — chủ kênh vào web tưởng chưa có video.
- **Nguyên nhân:** `scripts/course-video-seed.mjs:132` chọn track mặc định theo thứ tự entry → `map.defaultVideoTrack` → có `vi` thì VI. 27 tệp `content/course-videos/*.mjs` đặt `defaultVideoTrack: 'YT'` ở cấp khoá (từ thời chỉ có YouTube) nên thắng luôn video bài giảng.
- **Cách sửa:** thứ tự mới: entry → có `vi.url` thì VI → map → YT. Có hiệu lực ở lượt seed video của deploy kế tiếp.
- **Ảnh hưởng:** 27 khoá (Software Requirements 139, React 132, DSA 114, Software Testing 111, DBI 102, Git 102, Node.js 94, PostgreSQL 86, Auth 77, TypeScript 76…) từ khi gắn video tới deploy sửa.
- **Bài học:** "đã gắn" ≠ "người học thấy". Nghiệm thu phải mở trang thật như người học (track nào phát đầu), không chỉ kiểm map/DB có URL.

### 14/11/2026 — Video bài giảng — Giọng đọc phát âm tục ("-địt") trong 71 tập
- **Triệu chứng:** các từ như audit, succeeded, added, embedded, exceeded được đọc thành "o-địt", "xắc-xi-địt", "át-địt"… — TTS đọc đúng âm tục; 64 tập đã render (API Design, Git, Node/SDN302, Auth, Docker, Networking, PRO192…).
- **Nguyên nhân:** bảng luật đọc (`src/khung/*/doc.ts`, luật `W()` trong `kichban.ts`) phiên âm đuôi "-ded/-dit" bằng chữ "địt"; nhiều agent chép lại của nhau (117 tệp). Bộ kiểm chỉ bắt chữ Anh sót/đánh vần, không bắt từ tục trong lời đọc.
- **Cách sửa:** đổi toàn bộ "địt" ⇒ "đìt" trên Mac + máy nhà — nhưng bộ chấm Whisper vẫn nghe ra "địt" ở 12 tập lồng lại (thanh huyền và thanh nặng đều thấp, máy đọc dễ lẫn) ⇒ đổi tiếp sang "đít" (thanh sắc, tách hẳn; kênh vốn đọc Redis là "rê-đít"); lồng tiếng lại 72 tập rồi render + đẩy lại; lượt soát hằng giờ kiểm trường lời đọc (không lấy trường `nghe` của Whisper làm chuẩn).
- **Ảnh hưởng:** người học nghe âm tục trong video trên web từ khi các tập đó lên tới khi bản mới thay.
- **Bài học:** phiên âm phải soát cả nghĩa tiếng Việt của âm tiết sinh ra, không chỉ "đọc giống". Luật dùng chung bị chép sẽ nhân lỗi — kiểm bằng máy (danh sách âm cấm) chứ không dựa vào mắt.

### 14/11/2026 — App CT Language — Tab Hôm nay chào "Chào buổi sáng!" lúc nửa đêm
- **Triệu chứng:** mở app lúc 00:21, đầu tab Hôm nay ghi "Chào buổi sáng!" — ngay cạnh lời Gấu mới "Khuya rồi…".
- **Nguyên nhân:** `ios-app/CuongThaiApp/CTLanguageApp/Modules/HomNay/HomNayCTL.swift` `loiChao` chỉ xét `h < 11` ⇒ 0–4 giờ sáng rơi vào "buổi sáng".
- **Cách sửa:** 23:00–04:59 ⇒ "Khuya rồi", khớp `LoiGau.chao` (ios-app `48dd18d`). Kèm: `HangDoiChiaSeCTL.traLai` khử trùng cả trong danh sách trả lại (test bắt trước khi phát hành).
- **Ảnh hưởng:** mọi người mở app sau nửa đêm, từ bản đầu tới bản 1.0.0 (4); chỉ là chữ.
- **Bài học:** chào theo giờ phải có khung "khuya"; hai chỗ cùng nói về giờ (tiêu đề + lời Gấu) phải dùng chung một ngưỡng — chụp màn hình lúc nửa đêm mới thấy.

### 14/11/2026 — Video / máy thuê — Máy Vast đẩy video lên R2 bị 400 "Missing x-amz-content-sha256"
- **Triệu chứng:** token R2 mới đúng (Mac PUT 200), nhưng trên máy thuê Vast (Ubuntu 22.04) mọi lệnh PUT/HEAD tới R2 trả 400, thêm header tay thì 403.
- **Nguyên nhân:** `curl --aws-sigv4` bản < 7.86 (Ubuntu 22.04 có 7.81) không gửi và không ký `x-amz-content-sha256` mà R2 bắt buộc. Máy thuê cũ (Ubuntu 24.04, curl 8.5) không dính nên `xuat/len-r2-thue.sh` chưa từng lộ.
- **Cách sửa:** `xuat/r2-ky.py` (repo video) ký SigV4 bằng thư viện chuẩn Python; `len-r2-thue.sh` tự chọn nó khi curl < 7.86, curl mới giữ đường cũ.
- **Ảnh hưởng:** chỉ máy thuê Ubuntu 22.04; bắt được bằng tệp thử trước khi chạy thật nên không video nào hỏng.
- **Bài học:** thử công cụ trên ĐÚNG máy sẽ chạy (bản hệ điều hành, bản curl) bằng một phép thử nhỏ PUT/HEAD/DELETE trước khi giao việc thật.

### 13/11/2026 — App CT Language — Upload TestFlight báo "Unable to find Apple ID for Bundle ID" (lỗi 19)
- **Triệu chứng:** `phat-hanh-ctlanguage.sh` dựng + ký + kiểm IPA xanh, tới bước altool thì dừng: không tìm thấy Apple ID cho `com.cuongthai.ctlanguage`, dù app đã có trên App Store Connect (mã 6834209813).
- **Nguyên nhân:** `ios-app/scripts/phat-hanh-ctlanguage.sh` gọi `altool --upload-app` không kèm `--apple-id`; altool tự tra app theo bundle id và không ra với app mới tạo (tài khoản chưa chấp nhận thoả thuận Apple Developer Program càng không tra được).
- **Cách sửa:** thêm `--apple-id 6834209813` vào lệnh upload trong script. Lượt sau lỗi đổi thành `FORBIDDEN.REQUIRED_AGREEMENTS_MISSING_OR_EXPIRED` — đó mới là chặn thật, chỉ chủ tài khoản mở developer.apple.com/account chấp nhận được.
- **Ảnh hưởng:** chỉ bước upload; bản 1.0.0 (4) đã dựng sẵn ở /tmp/ctlanguage-export, chưa lên TestFlight.
- **Bài học:** script upload luôn ghi thẳng mã app ASC, đừng để altool đoán. Đọc kỹ lỗi thứ HAI — lỗi đầu có khi chỉ che lỗi gốc.

### 13/11/2026 — Web — Nút "Thử lại" ở trang lỗi bấm mãi vẫn lỗi
- **Triệu chứng:** trang khoá học / trang bất kỳ gặp lỗi phía máy chủ (API chập chờn), bấm "Thử lại" vẫn hiện trang lỗi dù máy chủ đã ổn.
- **Nguyên nhân:** `frontend/src/app/error.tsx` và `frontend/src/app/courses/[slug]/error.tsx` chỉ gọi `reset()` — React vẽ lại ở trình duyệt với dữ liệu Server Component CŨ, không xin lại máy chủ.
- **Cách sửa:** hook `useThuLai` (`frontend/src/lib/thuLai.ts`): `startTransition(() => { router.refresh(); reset(); })`.
- **Ảnh hưởng:** mọi trang dùng hai ranh giới lỗi đó; người dùng phải tự tải lại trang.
- **Bài học:** `reset()` chỉ gỡ ranh giới lỗi, không lấy dữ liệu mới. Lỗi máy chủ cần `router.refresh()`. Phát hiện nhờ khoá Next.js 8.2 đo thật (trên Next 16; repo chạy 14 — cùng cơ chế).

### 13/11/2026 — Realtime — Redis lên muộn lúc khởi động ⇒ tin realtime biến mất, không log
- **Triệu chứng:** backend khởi động khi Redis chưa sẵn sàng; vài giây sau Redis lên thì người đang online không nhận tin nhắn/thông báo realtime nữa, log không có cảnh báo nào.
- **Nguyên nhân:** `src/socket/messaging.socket.ts` attachRedisAdapter chờ `getRedis()` — mà `src/config/redis.ts` thử lại MÃI (reconnectStrategy) nên khối catch không bao giờ chạy. Khi Redis lên, `io.adapter(...)` thay bằng adapter MỚI trống ⇒ mọi socket đã nối mất room (`socket.rooms` vẫn báo `user:7` nhưng phát vào `user:7` ⇒ 0 người nhận).
- **Cách sửa:** hạn 5 giây; quá hạn ⇒ ở lại adapter trong RAM cả đời tiến trình (một instance vẫn đúng), bản sao tạo muộn bị đóng, không bao giờ gắn muộn; thêm listener `error` cho bản sao pub/sub. Test `src/socket/redisAdapterGan.test.ts` (commit 82084b1e2).
- **Ảnh hưởng:** mỗi lần Redis khởi động chậm hơn backend (deploy, khởi động lại VPS).
- **Bài học:** thay "bộ máy" bên dưới một hệ đang chạy (adapter, pool, client) là mất trạng thái của nó. Lời gọi có thử lại vô hạn phải có hạn giờ ở chỗ gọi. Phát hiện nhờ khoá Socket.IO 5.3 tắt Redis thật trong lab.

### 13/11/2026 — Deploy — Backend bị giết cưỡng bức (SIGKILL) mỗi lần deploy
- **Triệu chứng:** mỗi lần tráo container, backend cũ chờ đủ 10 giây rồi bị Docker giết; không đóng Prisma, không đẩy Sentry.
- **Nguyên nhân:** `src/index.ts` (setupGracefulShutdown) gọi `server.close()` — nhưng WebSocket đã nâng cấp không tự kết thúc nên callback không bao giờ chạy; hạn ép 30 giây lại dài hơn hạn 10 giây của Docker.
- **Cách sửa:** đóng Socket.IO engine ngay khi nhận SIGTERM (client thấy "transport close" và TỰ NỐI LẠI vào container mới — khác `disconnectSockets(true)` làm client KHÔNG nối lại); đường ép 8 giây vẫn dọn dẹp (commit 82084b1e2).
- **Ảnh hưởng:** mọi lần deploy; chậm tráo thêm ~10 giây, mất sự kiện Sentry cuối.
- **Bài học:** "graceful shutdown" phải tính cả kết nối dài (WebSocket, SSE); hạn ép của mình phải NGẮN HƠN hạn của Docker/systemd.
- **Bổ sung 14/11:** bản sửa đầu chỉ đóng Socket.IO — hai kênh đồng soạn thảo Hocuspocus (ghi chú + Docs CT Work) vẫn giữ WebSocket ⇒ vẫn chờ hết 8 s, mã 1. Nay gọi `closeConnections()` cả hai (`dongKetNoiCongTacGhiChu/Docs`) — đo ở khoá Socket.IO 8.4: 8.003 ms ⇒ 2 ms, lưu ngay. Bài học: liệt kê MỌI máy chủ WebSocket gắn vào cùng HTTP server (kho có 4) trước khi tuyên bố đã tắt êm.

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
- **Cách sửa:** chạy tay phần còn lại trên VPS (chủ kênh duyệt) — lần 2 cùng ngày lúc 23:04 (lượt deploy của phiên khác, mặc định cũ) cũng chạy tay như vậy. Mặc định `SSH_TRAN` trong `deploy-nha.sh` nâng 2400 → 5400 giây.
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
- **Bài học:** khối dùng chung sinh ra cho MỘT khoá thì mang giả định ngầm của khoá đó (giọng, bảng chữ, khoá lưu). Đổi khuôn dữ liệu ⇒ soát mọi chỗ đọc dữ liệu đó, kể cả chỗ lưu trạng thái. Lỗi nhỏ phía web — `foldZh` đổi `lǜ` thành `luv` — đã sửa ở commit web `102c5d6cf` (ra `lv`); app vẫn chịu cả hai nên bản app cũ lẫn bộ thẻ cũ đều khớp.

### 13/11/2026 — CuongMini (Luyện nói / gọi thoại) — Cuộc gọi kẹt "đang nghĩ", chạy cổng dự phòng thay vì Anthropic chính hãng
- **Triệu chứng:** app CT Language gọi CuongMini, câu trả lời kẹt ở "đang nghĩ" rồi bỏ; log prod cho thấy lượt đi `du-phong` (`gpt-6-sol`, chữ đầu 7,8 s) chứ không đi cổng chính hãng.
- **Nguyên nhân:** `src/services/agent/anthropicChinhHang/khoKey.ts › keyKhaDung()` chỉ lấy key `hoatDong|hetCredit` — admin bấm "Tắt" key (trạng thái `tat`) để chặn AI Code thì CuongMini ngôn ngữ + CT Work cũng mất cổng; thêm nữa `troChuyenLuong.service.ts` gọi `MODEL_HESHIN` (Haiku) chứ không phải Sonnet.
- **Cách sửa:** `VIEC_DUNG_CA_KEY_TAT` = {`language_tutor`, `work_ai`, `work_setup`} dùng được cả key `tat` (vẫn bỏ `loi`/hết hạn/chạm ngân sách); `coKeyKhaDung(viec)` + `guiChinhHang` theo việc; model gọi thoại = `modelTroChuyen()` (`claude-sonnet-5-5`, đè bằng `LANGUAGE_TUTOR_MODEL_CHINH_HANG`), hỏng/chạm trần ⇒ `gpt-6-sol` như cũ. Test CSDL mới trong `chinhHang.db.test.ts`.
- **Ảnh hưởng:** mọi người dùng Luyện nói/gọi CuongMini (app + web My Language) và CuongMini trong CT Work khi admin tắt key.
- **Bài học:** công tắc "tắt key" là công tắc CHUNG cho mọi việc dùng bảng key — thêm việc mới vào cổng thì phải quyết rõ việc đó có chịu công tắc hay không. Lưu ý: Sonnet đắt gấp ~20× Haiku ⇒ trần `cuongmini_ngon_ngu.tranNgayUsd` (0,5 $/người/ngày) chạm sớm hơn, chạm thì tự lùi `gpt-6-sol`. (10 test luồng AI Code trong `chinhHang.db.test.ts` đã đỏ SẴN trước bản sửa — chưa xử lý.)

### 14/11/2026 — Web (đăng nhập) — `isHydrated` không bao giờ lật, trang "Đang tải…" mãi
- **Triệu chứng:** các trang chờ `useAuthStore().isHydrated` (forum nút admin, image-to-doc, my-courses…) đứng "Đang tải…"; nhiều trang đã tự chế đồng hồ an toàn / ghi chú "isHydrated never flips" để né (dashboard, profile, settings, LearnPageClient).
- **Nguyên nhân:** `frontend/src/store/authStore.ts:179-199` — `onRehydrateStorage` gọi `useAuthStore.setState`, nhưng localStorage đồng bộ ⇒ persist nạp xong NGAY trong `create()` khi `useAuthStore` chưa gán ⇒ ReferenceError; nhánh catch gọi lại và ném lần nữa, lỗi bị nuốt trong promise của persist. Agent Next.js Ch14 tái hiện bằng zustand 4.5.7 (`~/.rtq-nxj/lab/z4/tdz2.mjs co` ⇒ user có, isHydrated=false, isLoading=true).
- **Cách sửa:** bỏ callback; sau `create()` gọi `markHydrated()` qua `persist.hasHydrated()` / `persist.onFinishHydration`. Kiểm `tdz-sua.mjs` (có/không dữ liệu ⇒ isHydrated=true, isLoading=false) + `tsc` frontend xanh. Cùng commit: `frontend/src/app/saved/page.tsx` xoá bộ sưu tập lỗi thì quay lui bằng nguyên mục cache (trước ghi MẢNG vào chỗ object `{collections,…}` ⇒ danh sách trống tới khi F5) + `cancelQueries` trước.
- **Ảnh hưởng:** mọi người dùng web từ khi có `onRehydrateStorage` kiểu này — cờ chưa từng đúng; các mẹo né ở từng trang có thể gỡ dần.
- **Bài học:** callback của middleware chạy ĐỒNG BỘ trong `create()` thì không được tham chiếu biến đang được gán bằng chính `create()` — dùng `state` callback nhận hoặc API sau-tạo (`onFinishHydration`). Lỗi bị nuốt trong promise là lỗi câm: khi thấy nhiều trang cùng "né" một cờ, đi tìm gốc thay vì thêm mẹo né thứ N.

### 14/11/2026 — Backend/Web (R2) — xoá hàng loạt hỏng một phần trôi qua im lặng; sai khoá trông như "chưa có tệp"; URL ảnh dự phòng trỏ endpoint API
- **Triệu chứng:** (bắt khi soạn khoá Object Storage Ch1, chưa ai báo) xoá bài/ghi chú kèm nhiều tệp mà một số key xoá hỏng thì không có dấu vết, tệp mồ côi nằm lại; `objectExists` trả false cả khi sai khoá 403; thiếu `NEXT_PUBLIC_R2_PUBLIC_URL` lúc build thì ảnh trỏ `https://<account>.r2.cloudflarestorage.com/…` ⇒ 403.
- **Nguyên nhân:** `src/config/r2.ts:252-272` `deleteObjects()` gửi `Quiet:true` và không đọc `res.Errors` (S3/R2 trả HTTP 200 dù có key hỏng — tái hiện trên MinIO: token chỉ xoá được `images/*`, xoá [images/a.jpg, docs/b.pdf] ⇒ 200 + Errors[docs/b.pdf AccessDenied]); `r2.ts:280` `objectExists` nuốt mọi lỗi; `frontend/src/lib/utils.ts:202` dự phòng là endpoint API (cần chữ ký, không CDN, lộ account id).
- **Cách sửa:** đọc `res.Errors` và `console.warn` số key hỏng + 5 key đầu (không ném — người gọi là việc dọn dẹp); `objectExists` ghi warn với lỗi khác 404 (vẫn trả false); dự phòng `getMediaUrl` = `https://media.cuongthai.com`. `tsc` xanh, `storageSandbox.test.ts` 5/5.
- **Ảnh hưởng:** voInk, notes (xoá tệp), TTS / IELTS gia sư (kiểm tệp có sẵn) — trước đây lỗi quyền/khoá vô hình trong log.
- **Bài học:** API "hàng loạt" của S3 báo thành công ở tầng HTTP và báo lỗi từng phần trong body — luôn đọc mảng lỗi. Hàm "trả false khi lỗi" phải phân biệt "không có" với "không hỏi được".

### 14/11/2026 — Web (Tailwind) — icon cỡ `w-4.5`/`h-4.5`/`w-5.5` hiện to 24px
- **Triệu chứng:** icon lucide ở trang creator/ideas, hoc-sql LabPanel, StatsSection, UploadTrackModal, SimulationStudio, ScriptVersionPanel hiện 24px thay vì 18px/22px (bắt khi soạn khoá Tailwind Ch1).
- **Nguyên nhân:** `frontend/tailwind.config.ts` — Tailwind 3.4.19 không có khe spacing 4.5/5.5 (Tailwind 4 mới sinh tự động) ⇒ 16 lượt trong 7 tệp không sinh luật nào; `.w-4\.5{` trong CSS build = 0. `DigitalShopTermsGate.tsx:80` từng tự vá bằng `style={{ width: 18 }}`.
- **Cách sửa:** thêm `theme.extend.spacing` `'4.5': '1.125rem'`, `'5.5': '1.375rem'`; build CLI kiểm `.w-4\.5{width:1.125rem}` có mặt.
- **Ảnh hưởng:** 7 tệp nói trên (bố cục lệch nhẹ, icon to).
- **Bài học:** lớp viết đúng cú pháp mà không có trong thang thì Tailwind im lặng bỏ qua — không lỗi build. Khi nghi lớp "không ăn", grep CSS build chứ đừng nhìn mã nguồn.

### 14/11/2026 — Web (admin) — dấu tích ở /admin/user-codes không bao giờ hiện khi rê chuột
- **Triệu chứng:** gõ tìm user ở /admin/user-codes, rê chuột lên dòng kết quả — icon dấu tích không hiện.
- **Nguyên nhân:** `frontend/src/app/admin/user-codes/page.tsx:102` `<Check className="… opacity-0 group-hover:opacity-100">` nằm trong `<button>` dòng 95 không có lớp `group` (bắt khi soạn khoá Tailwind 2.5).
- **Cách sửa:** thêm `group` vào className của nút dòng 95.
- **Ảnh hưởng:** chỉ admin, thẩm mỹ/phản hồi khi chọn user.
- **Bài học:** `group-*` cần tổ tiên có `group` — Tailwind không báo lỗi khi thiếu; grep `group-hover` rồi đối chiếu tổ tiên khi sửa giao diện.

### 14/11/2026 — Web (nhạc) — khung danh sách phát của trình phát nhạc lệch thêm 24px trên màn ≥ sm
- **Triệu chứng:** từ 640px trở lên, khung danh sách phát nổi phía trên thanh nhạc thụt vào 24px so với ý đồ dính mép phải (đo Chromium 800px: margin 24px).
- **Nguyên nhân:** `frontend/src/components/music/GlobalMusicPlayer.tsx:178` có cả `sm:mx-6` lẫn `sm:mx-0` trong một className. Hai lớp cùng biến thể, cùng thuộc tính ⇒ thắng theo THỨ TỰ TRONG CSS chứ không theo thứ tự viết; Tailwind 3 sắp `mx-0` trước `mx-6` ⇒ `sm:mx-6` thắng, `sm:mx-0` chết (bắt khi soạn khoá Tailwind Ch3).
- **Cách sửa:** bỏ `sm:mx-6` (giữ `mx-3` cho mobile, `sm:mx-0` + `sm:right-6` cho màn lớn).
- **Ảnh hưởng:** mọi người dùng trình phát nhạc trên máy tính/tablet — lệch bố cục nhẹ.
- **Bài học:** hai lớp xung đột cùng biến thể trong một className là lỗi chắc chắn — thứ tự viết KHÔNG quyết định. Dùng `tailwind-merge`/lint xung đột (eslint-plugin-tailwindcss `no-contradicting-classname`) để bắt sớm.

### 14/11/2026 — Backend (upload R2) — 2 luồng URL ký sẵn ký nguyên kiểu tệp client khai; "complete" nhận key của người khác
- **Triệu chứng:** (bắt khi soạn khoá Object Storage Ch4, tái hiện trên MinIO lab, chưa thấy khai thác trên prod) Hub và đính kèm CT Work cho tải lên tệp nội dung chủ động (HTML/SVG/JS) với đúng kiểu đó, vào chung bucket của tên miền media; `/files/upload/presign-r2/complete` chấp nhận key video không thuộc người gọi ⇒ tạo hàng chờ đứng tên mình ⇒ cron dọn hàng hết hạn có thể xoá object của người khác; tệp quá cỡ bị từ chối nhưng object nằm lại vĩnh viễn.
- **Nguyên nhân:** `src/routes/hub.routes.ts` `POST /files/presign` và `src/services/work/issues.service.ts presignAttachment` ký `ContentType` do client khai, không qua `assertSafeUploadType`; `src/routes/upload.routes.ts` complete chỉ kiểm regex `^video/…`, không kiểm chủ; `cron.service.ts` xoá theo key không đối chiếu chủ.
- **Cách sửa:** `safePresignContentType()` (uploadService) hạ HTML/SVG/JS/XML (theo kiểu HOẶC đuôi) thành `application/octet-stream` trước khi ký — không từ chối, tệp vẫn tải về được; Hub trả `contentType` đã ký và HubUploadModal PUT đúng kiểu đó (CT Work vốn PUT theo `headers` trả về); complete kiểm `keyBelongsToUser` (403 `KEY_NOT_OWNED`) và xoá object quá cỡ; cron bỏ qua hàng chờ có key không thuộc người tạo. `tsc` xanh, test work portal/permissions 66/66.
- **Ảnh hưởng:** mọi người dùng Hub / CT Work / đăng video; tệp nội dung chủ động tải lên TRƯỚC 14/11 vẫn nằm trên bucket với kiểu cũ — cần rà prefix `hub-files/` + đính kèm work theo Content-Type (việc tay).
- **Bài học:** mọi đường tải lên (multer, URL ký sẵn, nhập từ URL) phải đi qua CÙNG một chốt kiểm kiểu tệp; comment "rejected on every upload path" không thay được grep các chỗ gọi. Mọi tuyến nhận "key" từ client phải kiểm chủ trước khi ghi hàng/xoá.

### 14/11/2026 — Web (Tailwind) — cn() không gộp được bóng tuỳ biến: shadow-neon luôn thắng
- **Triệu chứng:** `cn('shadow-neon', 'shadow-lg')` giữ cả hai lớp; bóng neon luôn thắng bất kể thứ tự ⇒ component nhận `className="shadow-lg"` để đè bóng mặc định không đè được (52 lượt shadow-neon/premium-card trong 43 tệp).
- **Nguyên nhân:** `frontend/src/lib/utils.ts` dùng `twMerge` mặc định — tailwind-merge không đọc `tailwind.config.ts`, nên không biết `theme.extend.boxShadow` (neon, neon-lg, neon-cyan, premium-card(-hover), studio-card(-hover)) thuộc nhóm `shadow` (bắt khi soạn khoá Tailwind Ch3).
- **Cách sửa:** `extendTailwindMerge({ extend: { classGroups: { shadow: [{ shadow: [...7 tên] }] } } })`; thử: `cn('shadow-neon','shadow-lg')` ⇒ `shadow-lg`, đảo thứ tự ⇒ `shadow-neon`; tsc frontend xanh.
- **Ảnh hưởng:** mọi component nhận className qua `cn()` mà có bóng tuỳ biến.
- **Bài học:** thêm khoá mới vào theme (boxShadow, fontSize, colors có tên trùng tiền tố) ⇒ khai luôn cho tailwind-merge. Khi nâng Tailwind 4 phải nâng tailwind-merge 3 cùng lúc (2.6 xoá nhầm `bg-red-500` khi gặp `bg-linear-to-r`).

### 14/11/2026 — Web (admin) — Section của trang admin không cho người gọi đè đệm
- **Triệu chứng:** `<Section className="p-0">` (hay `p-2`…) vẫn ra 20px đệm — người gọi không đè được (bắt khi soạn khoá Tailwind 4.3; hôm nay người gọi chỉ truyền `mb-8` nên chưa ai thấy).
- **Nguyên nhân:** `frontend/src/components/admin/ui.tsx:54` nối chuỗi `` `… p-5 ${className}` `` — hai lớp padding cùng có mặt, thắng theo thứ tự trong CSS chứ không theo thứ tự viết.
- **Cách sửa:** `cn('… p-5', className)` (tailwind-merge bỏ `p-5` khi người gọi truyền padding); tsc frontend xanh.
- **Ảnh hưởng:** trang admin dùng `Section` (phơi nhiễm, chưa hỏng).
- **Bài học:** component nhận `className` để người gọi tuỳ biến phải gộp bằng `cn()`, không nối chuỗi.

### 14/11/2026 — CT Language (thi thử) — lượt free "1 đề/cấp/tuần" đếm cả lượt của tuần SAU
- **Triệu chứng:** test DB: người dùng free đã mở đề 1 tuần này + một lượt đề 2 có `batDauLuc` rơi vào tuần sau ⇒ danh mục báo đề 2 `duocThi = true` ngay trong tuần này (lẽ ra bị khoá).
- **Nguyên nhân:** `src/services/ctlanguage/thi.ts` lọc `batDauLuc: { gte: dauTuanVn(bayGio) }` — chỉ có cận dưới, nên mọi lượt từ đầu tuần TRỞ ĐI (kể cả tương lai / đồng hồ lệch) đều tính là "đã thi tuần này".
- **Cách sửa:** `trongTuan()` trả `{ gte: thứ Hai 00:00 VN, lt: thứ Hai kế }`, dùng ở cả `deDaThiTuanNay` lẫn `danhMuc`; `thi.db.test.ts` có ca "tuần sau có lượt mới".
- **Ảnh hưởng:** chưa lên prod (bắt trong test trước khi commit).
- **Bài học:** "trong tuần/ngày này" là một KHOẢNG hai đầu — viết luôn cả `gte` lẫn `lt`, và test bằng `bayGio` tiêm vào chứ không dựa `new Date()`.

### 14/11/2026 — Hạ tầng (nginx) — 404 của tệp tĩnh bị dán lệnh cache 1 năm (immutable)
- **Triệu chứng:** xin một chunk `/_next/static/...` không tồn tại ⇒ 404 KÈM `Cache-Control: public, max-age=31536000, immutable` (đo thật trên cuongthai.com, bắt khi soạn khoá Next.js 20.4). Trình duyệt/CDN có thể giữ 404 đó cả năm — nếu một lần deploy lệch nhịp làm chunk tạm thiếu, người dùng kẹt trang hỏng tới khi xoá cache.
- **Nguyên nhân:** `nginx/nginx.conf:228`, `:453`, `:510` — `add_header Cache-Control "… immutable" always;` — cờ `always` dán header cho MỌI mã trạng thái, kể cả 4xx/5xx.
- **Cách sửa:** bỏ `always` ở 3 dòng đó (nginx mặc định chỉ thêm header cho 200/201/204/206/301/302/303/304/307/308). Kiểm cú pháp bằng `nginx -t` trong container (chỉ còn lỗi thiếu chứng chỉ — bình thường ngoài VPS); deploy-nha bước 6c tự `nginx -t` trên VPS và trả bản cũ nếu hỏng.
- **Ảnh hưởng:** mọi người dùng tải tệp tĩnh `/_next/static`, ảnh/tài nguyên bất biến.
- **Bài học:** `always` chỉ dùng cho header phải có ở cả trang lỗi (CORS, bảo mật); header cache dài hạn tuyệt đối không `always`. Kiểm bằng `curl -I` một URL 404, đừng chỉ kiểm URL 200.

### 14/11/2026 — Prisma (CT Language Đợt C+E) — migration viết tay hỏng cú pháp ⇒ CSDL local kẹt P3009
- **Triệu chứng:** `npx prisma migrate deploy` trên CSDL local báo `42601 syntax error at or near "CREATE"` ở `20261114220000_ctlanguage_kham_pha_bai_ai_su_kien`; từ đó mọi `migrate deploy` local (kể cả migration thi thử của Đợt B) bị chặn P3009.
- **Nguyên nhân:** script tách đầu ra `migrate diff --script` theo dòng trống (`split('\n\n')`) — `CREATE TABLE` có dòng trống trước `CONSTRAINT … PRIMARY KEY` nên bị cắt đôi, câu sau dính vào câu trước. 0 câu được áp (`applied_steps_count = 0`, không bảng nào được tạo).
- **Cách sửa:** tách theo tiêu đề khối `-- CreateTable` / `-- AddForeignKey` (`re.split(r'\n(?=-- [A-Z][A-Za-z]+\n)')`); kiểm trên CSDL TRẮNG bằng `node scripts/db-test-tu-migration.mjs` (cả 20261114200000 lẫn 20261114220000 áp sạch). Bản ghi hỏng trên CSDL local CHƯA gỡ: `prisma migrate resolve` cần người dùng duyệt (CLAUDE.md).
- **Ảnh hưởng:** chỉ CSDL local (migration chưa deploy); chặn `migrate deploy` local của mọi phiên tới khi gỡ bản ghi hỏng.
- **Bài học:** migration viết tay phải chạy thử trên CSDL TRẮNG (`db-test-tu-migration.mjs`) TRƯỚC khi `migrate deploy` lên CSDL dùng chung; đừng chế biến SQL bằng tách chuỗi ngây thơ.

### 14/11/2026 — App CT Language (Đợt C) — khối trên Hôm nay không bao giờ gọi máy chủ
- **Triệu chứng:** trên máy ảo, khối Sự kiện / Từ vựng theo chủ đề / Từ được tra nhiều không hiện; nhật ký máy chủ không có lấy một lượt gọi `kham-pha/*` từ app.
- **Nguyên nhân:** `KhoiSuKienCTL`, `KhoiChuDeTuCTL`, `KhoiTraNhieuCTL` gắn `.task` lên `Group { if !ds.isEmpty { … } }` — khi chưa có dữ liệu Group rỗng không bao giờ "xuất hiện" nên `.task` không chạy, dữ liệu không bao giờ tới (con gà – quả trứng).
- **Cách sửa:** dữ liệu vào kho dùng chung (`KhoKhamPhaCTL`, `KhoSuKienCTL`), tải từ `.task(id: nn)` của `HomNayCTL` (và Cộng đồng cho thẻ sự kiện); khối chỉ đọc kho. Kiểm lại trên máy ảo trỏ backend local: đủ khối, có dữ liệu.
- **Ảnh hưởng:** chưa phát hành (bắt khi tự soát ảnh chụp).
- **Bài học:** đừng đặt `.task`/`.onAppear` lên view có thể rỗng; tải dữ liệu ở view cha luôn hiện, hoặc ở kho.

### 14/11/2026 — Video — công cụ soát giọng báo nhầm "chữ Anh sót" (component/props/state…)
- **Triệu chứng:** lượt kiểm 21:20 giữ lại 5 tập Next.js (nxj-0-2/0-3/0-4/0-9/1-1) vì `anh-sot.py` báo sót `component`, `props`, `state`, `render`, `hook`, `export`; 20:20 đã sửa luật đọc trong kichban nxj-0-9 rồi lồng tiếng lại (thừa).
- **Nguyên nhân:** `~/agent-nha/anh-sot.py` quét trường `doc` của thoigian.json, nhưng `giong/phienAmBai.ts` áp `giong/doc-tay.json` (đã có các chữ đó) SAU bước tạo `doc`, ngay lúc lồng tiếng ⇒ `doc` còn chữ Anh mà giọng đọc vẫn đúng (trường `nghe` của Whisper khớp).
- **Cách sửa:** `anh-sot.py` nạp khoá `doc-tay.json` và bỏ qua các chữ đó; bỏ qua tập chưa có thoigian.json (trước đây in ra traceback). 16 tập đạt được thả sang render.
- **Ảnh hưởng:** chậm render vài tập + 1 lượt lồng tiếng lại thừa; không tập lỗi nào lên web.
- **Bài học:** bộ soát phải dùng CÙNG từ điển với bước lồng tiếng; báo "sót" thì đối chiếu trường `nghe` trước khi sửa luật.

### 15/11/2026 — CT Language (Thư viện ngữ pháp) — tra chữ Latin ngắn khớp bừa hàng loạt điểm ngữ pháp
- **Triệu chứng:** test `diemKhop(d, 'i')` trả 50 thay vì 0 — gõ một chữ "i" / "le" ở ô tra là ra gần như mọi điểm ngữ pháp.
- **Nguyên nhân:** `src/services/ctlanguage/nguPhapThuan.ts › diemKhop` — nhánh từ khoá dùng `x.includes(k) || k.includes(x)` không giới hạn độ dài: chuỗi Latin 1–2 ký tự nằm trong mọi từ khoá romaji/pinyin, và từ khoá ngắn ("le") nằm trong mọi câu tra dài ("table").
- **Cách sửa:** Latin 1 ký tự ⇒ chỉ nhận khớp NGUYÊN; 2 ký tự ⇒ chỉ khớp ĐẦU tiêu đề / từ khoá; "nằm trong câu tra" chỉ tính khi chuỗi đủ dài (Latin ≥ 4, chữ Hán/kana ≥ 2). Thêm chế độ `chac=1` (≥ 45 điểm) cho ô tra tab Từ điển. Cùng commit với tính năng.
- **Ảnh hưởng:** chưa phát hành (bắt trong test trước khi commit).
- **Bài học:** tìm kiếm "chứa chuỗi" trên dữ liệu trộn chữ Latin với chữ Hán/kana phải có ngưỡng độ dài RIÊNG cho từng loại chữ — 1 chữ Hán đủ nghĩa, 1 chữ Latin thì không.

### 15/11/2026 — CT Language (Thư viện ngữ pháp) — bộ kiểm nội dung báo nhầm câu dịch "không phải tiếng Việt"
- **Triệu chứng:** agent soạn N5 phải đổi lời dịch 3 câu vì `ctlanguage-kiem-ngu-phap.mts` báo `viDu[i].v có vẻ không phải tiếng Việt có dấu` với câu chỉ có dấu huyền/sắc trên a/e/i/o/u/y ("Tôi là …" thì qua, "Bạn có thích trà không?" kiểu chỉ có à/á/ì/ò thì trượt).
- **Nguyên nhân:** `nguPhapThuan.ts` — biểu thức `CHU_VIET_RIENG` liệt kê thiếu `àáãèéìíĩòóõùúũý` (chỉ có các nguyên âm mang mũ/móc + hỏi/nặng); lại dùng chung biểu thức đó để bắt "câu tiếng Anh lẫn tiếng Việt" nên nếu thêm đủ sẽ bắt nhầm café/naïve.
- **Cách sửa:** thêm đủ nguyên âm có dấu vào `CHU_VIET_RIENG`; phép kiểm "câu Anh lẫn tiếng Việt" dùng biểu thức riêng chỉ gồm chữ chắc chắn là tiếng Việt (ă đ ơ ư + dấu hỏi/nặng/tổ hợp). Cùng commit với tính năng.
- **Ảnh hưởng:** chỉ lúc soạn (3 câu dịch bị viết vòng, nghĩa vẫn đúng).
- **Bài học:** bộ kiểm heuristics phải thử trên câu ĐÚNG tối giản trước khi giao cho người/agent soạn — báo nhầm làm người soạn sửa nội dung đúng thành nội dung gượng.

### 15/11/2026 — CT Language — giọng đọc Trung/Nhật/Anh "rất khó nghe và nghe sai"
- **Triệu chứng:** user báo giọng đọc mặc định trong app (từ, chữ cái, bài đọc) khó nghe, đọc sai — nghe rõ là giọng máy.
- **Nguyên nhân:** (1) `ielts.routes.ts › POST /ielts/doc` bắt đăng nhập ⇒ khách (app cho học không tài khoản) luôn đọc bằng giọng iPhone mặc định bản "Compact"; (2) `GiongSachHoc.swift › CHO_TOI_DA = 0.6` (đặt hôm 14/11 để "bấm là đọc") ngắn hơn thời gian Azure sinh + tải một từ (~0,7–1,3 s) ⇒ gần như MỌI lần bấm đầu rơi về giọng iPhone; (3) `CaiDatGiong.giongTuDong` lọc tiền tố "zh" nên giọng zh-HK Enhanced (Quảng Đông) có thể thắng zh-CN Compact; (4) giọng iPhone đọc kanji đứng một mình hay sai âm.
- **Cách sửa:** `POST /ctlanguage/doc` (optionalAuth, trần sinh mới theo user hoặc IP — `ctlanguage.doc.routes.ts`, ea42a3fef) + app bật `GiongSachHoc.choPhepKhach`; chờ 1,6 s; tiếng Trung chỉ zh-CN; `ClipSH.docMay` = kana cho từ tiếng Nhật khi phải đọc bằng giọng máy; tải sẵn bớt (40/màn) đỡ ăn trần 400 câu mới/ngày (ios f5e71db).
- **Ảnh hưởng:** mọi người dùng CT Language trên TestFlight bản 1–7, nặng nhất là khách chưa đăng nhập.
- **Bài học:** "phản hồi ngay" bằng đường dự phòng kém chất lượng là đổi lỗi chậm lấy lỗi nghe tệ — ngưỡng chờ phải đo theo thời gian thật của đường chính; và tính năng mở cho khách thì mọi tài nguyên nó dùng (ở đây giọng máy chủ) cũng phải mở cho khách.

### 15/11/2026 — CT Language (Thư viện ngữ pháp) — đáp án quiz dồn về các lựa chọn đầu
- **Triệu chứng:** N3 / HSK3 / HSK4 gần như không có câu nào đáp án ở lựa chọn thứ 4 (N3: 2/237, HSK4: 1/135); A1–A2 lệch về lựa chọn 1–2 — đoán theo vị trí là đúng.
- **Nguyên nhân:** 7 agent con soạn `content/ctlanguage/ngu-phap/**` theo thói quen đặt đáp án đúng lên đầu; `scripts/ctlanguage-kiem-ngu-phap.mts` chỉ chặn "3 câu cùng một vị trí", không kiểm phân bố.
- **Cách sửa:** đảo thứ tự lựa chọn theo hạt giống cố định (băm id + số câu), đảo lại câu cuối nếu cả 3 câu trùng vị trí; không câu nào tham chiếu vị trí (đã quét "phương án A", "cả hai"…) — 318d06e39.
- **Ảnh hưởng:** chưa phát hành (bắt khi soát bàn giao).
- **Bài học:** nội dung trắc nghiệm do người/AI soạn luôn lệch vị trí đáp án — xáo bằng máy sau khi soạn, đừng tin người soạn tự rải.

### 15/11/2026 — CT Language (viết tay trên máy) — gói nét 8 bit cho ứng viên lệch máy chủ
- **Triệu chứng:** bản đầu gói nét viết tay cho app (lượng tử 8 bit, toạ độ thô) ra chữ hạng 1 KHÁC máy chủ ở 4/164 mẫu so khớp (3/70 mẫu tiếng Nhật), dù cùng thuật toán.
- **Nguyên nhân:** `scripts/ctlanguage/goi-net-viet-tay.mts` bản nháp làm tròn toạ độ về 1/255 — sai số ~0,002 mỗi điểm đủ đảo thứ hạng giữa các kanji gần giống nét (khoảng cách chênh nhau < 0,005), mà phá hoà tần suất chỉ ≤ 0,03.
- **Cách sửa:** lượng tử 10 bit + ghi HIỆU giữa các điểm (zigzag varint) ⇒ 3,3 MB nén (8 bit thô là 3,9 MB), 164/164 trùng hạng 1, Swift trùng TỪNG ứng viên với bản TS chạy trên cùng gói (`NhanNetMayTests`) — commit backend + ios cùng đợt.
- **Ảnh hưởng:** chưa phát hành (bắt bằng mẫu so khớp trước khi đóng gói).
- **Bài học:** port thuật toán xếp hạng sang máy khách thì đo "trùng máy chủ" bằng MẪU THẬT ngay từ đầu, kể cả phần nén dữ liệu — lượng tử trông vô hại vẫn đảo hạng ở thế gần hoà; và ghi hiệu toạ độ nén tốt hơn hẳn hạ độ chính xác.

### 15/11/2026 — App iOS — `xcodebuild` báo "command failed with exit code 0" khi nhiều phiên cùng dựng
- **Triệu chứng:** dựng `CTLanguageApp` vào `DerivedData/CuongHoangIOS` ra hàng loạt `error: the following command failed with exit code 0 but produced no further output`, không chỉ ra tệp lỗi nào.
- **Nguyên nhân:** hai–ba agent dựng song song cùng MỘT thư mục DerivedData ⇒ tranh nhau tệp trung gian / build database.
- **Cách sửa:** agent dựng + chạy test vào `-derivedDataPath` RIÊNG trong thư mục tạm của mình (xong thì xoá); bản cài để soi vẫn lấy đúng sản phẩm vừa dựng (`ls -l` nhị phân trước khi cài — luật C1).
- **Ảnh hưởng:** chỉ làm chậm phiên dựng; mã không lỗi.
- **Bài học:** DerivedData dùng chung là tài nguyên chung như git index — phiên song song phải tách đường dẫn dựng, đừng đọc lỗi "exit code 0" như lỗi mã.

### 15/11/2026 — Git — commit theo pathspec kéo theo dòng của phiên song song trong `src/index.ts`
- **Triệu chứng:** commit luyện phát âm (4bedd513d, chưa push) mang theo 5 dòng gắn router `ctlanguage.soTu` / `soChuyenNganh` của agent sổ tay — hai tệp route đó CHƯA commit ⇒ HEAD khởi động sẽ chết ở `await import(...)` (tsc không bắt vì đường dẫn động).
- **Nguyên nhân:** `git commit -- src/index.ts` lấy NGUYÊN tệp trong cây làm việc; agent kia sửa `index.ts` trong khoảng giữa lúc kiểm `git diff --numstat` (3 dòng) và lúc commit (8 dòng).
- **Cách sửa:** dựng lại commit bằng chỉ mục tạm (`GIT_INDEX_FILE`: HEAD~1 + đúng 3 dòng của mình) ⇒ `commit-tree` + `update-ref` có kiểm giá trị cũ ⇒ c393136d8; trả mục `src/index.ts` của chỉ mục chung về HEAD (dòng của agent kia vẫn nằm nguyên trong cây làm việc).
- **Ảnh hưởng:** không — bắt bằng `git show --stat` ngay sau commit, trước mọi push/deploy.
- **Bài học:** tệp chung đang có phiên khác sửa thì kiểm diff NGAY trong cùng lệnh commit và đọc `git show --stat HEAD` sau commit; số dòng lệch là dấu hiệu đã kéo theo đồ của người khác.

### 15/11/2026 — CT Language (Thư viện ngữ pháp) — lời giải quiz nhắc "câu 1 / hai câu đầu" sai sau lần xáo lựa chọn trước
- **Triệu chứng:** 3 câu quiz (`ja-n3-tame-ni-nguyen-nhan`, `ja-n4-ka-dou-ka`, `ja-n4-demo-reiji`) giải thích "Hai câu đầu là mục đích…", "Câu 1 có từ để hỏi… Câu 3 đúng" trong khi đáp án đúng đang nằm ở vị trí khác — người học đọc lời giải thấy ngược với đáp án.
- **Nguyên nhân:** lần xáo 318d06e39 quét lời nhắc vị trí bằng mẫu "phương án A / cả hai…" nên sót dạng "câu 1", "hai câu đầu", "câu thứ ba" trong `content/ctlanguage/ngu-phap/ja/n3-3.json`, `n4-4.json`; không có script xáo nằm trong repo để chặn lại.
- **Cách sửa:** viết lại 4 lời giải theo NỘI DUNG (trích chữ của lựa chọn); thêm `scripts/ctlanguage-xao-quiz-ngu-phap.mts` + `xaoQuizDiem` (hạt giống cố định, idempotent) DỪNG khi lời giải / lựa chọn nhắc vị trí; bộ kiểm thêm phép kiểm phân bố vị trí đáp án theo cấp (≥ 15%); test đỏ nếu có điểm chưa xáo. Cùng commit với đợt ngữ pháp cấp cao.
- **Ảnh hưởng:** 3 câu trong bản nội dung từ 318d06e39 (lời giải khó hiểu, đáp án chấm vẫn đúng).
- **Bài học:** dữ liệu sẽ bị máy đảo thứ tự thì lời văn không được tham chiếu thứ tự — và phép chặn phải nằm TRONG công cụ đảo, không dựa vào một lần quét tay.


### 15/11/2026 — Object Storage Chương 7 (bài web 7.1–7.3) — số liệu chi phí và tính năng Cloudflare sai/bịa
- **Triệu chứng:** bài 7.1 ghi "20 TB/tháng: S3 ~$1,842 vs R2 ~$306", "không egress thì hai bên trong 30%", "free tier S3 > R2"; bài 7.2 ghi dựng lại hằng tuần $30/hằng ngày $210, Instagram 8,4 triệu PUT, "srcset 3 biến thể ⇒ ×3 lượt GET"; bài 7.3 dạy "Billing → Notifications projected", "Cloudflare Analytics alarm cho R2", "R2 request log qua Logpush, giữ 30 ngày" + output forensic 4.217.880 bịa; quiz os-7-4 câu 3 trỏ Logpush.
- **Nguyên nhân:** `content/courses/object-storage/s07-cost.mjs` (os-7-1/7-2/7-3) viết theo trí nhớ, không chạy phép tính, không đọc tài liệu: 20 TB thiếu giả định lưu trữ; tuần/ngày lấy sai cấp số ($0,63 × 4,33 = $2,73); cộng lượt dựng lại hai lần; srcset chỉ tải một ứng viên; R2 không có dataset Logpush, Data Access Logs giữ 7 ngày và bỏ mọi mã ≥ 400; budget alert là ngưỡng USD cả tài khoản, một email, không chặn dùng.
- **Cách sửa:** đo lại bằng giá AWS Price List (09/11) + trang R2, MinIO đếm request, Chromium thật đếm request srcset, MinIO audit webhook + jq; sửa EN/VI + quiz câu 3 bằng `scratchpad/obj/w/w7-{1,2,3}.py`; commit content(object-storage) Chương 7.
- **Ảnh hưởng:** người học bài 7.x trên prod (chưa deploy bản sửa) đọc số tiền sai 3–11 lần và tìm một tính năng Logpush/alarm R2 không tồn tại.
- **Bài học:** con số tiền phải ra từ một phép tính chạy được (có ghi giả định), tính năng nhà cung cấp phải dẫn trang docs kèm ngày đọc — "trông hợp lý" không phải nguồn.

### 15/11/2026 — Video bài giảng (công cụ demo `chay.py` khoá Object Storage) — `@dung` làm sập cả lượt chạy khi tiến trình nền đã tự thoát
- **Triệu chứng:** `python3 scratchpad/obj/chay.py n7-3` dừng giữa khối `bao` với `PermissionError: [Errno 1] Operation not permitted`; các khối sau không chạy, PID mồ côi còn lại trong `~/.rtq-obj/nen-*.pid`.
- **Nguyên nhân:** `~/Documents/video-bai-giang/scratchpad/obj/chay.py:94` gọi `os.killpg(pid)` cho tiến trình nền (lưu lượng 36 s) đã tự kết thúc; macOS trả EPERM (không phải ESRCH) cho nhóm tiến trình đã mất, mà mã chỉ bắt `ProcessLookupError`.
- **Cách sửa:** bắt cả `(ProcessLookupError, PermissionError)` ở `@dung` (dòng 95) rồi chạy lại toàn bộ demo n7-3 (dựng → báo động → điều tra → vòng lặp).
- **Ảnh hưởng:** chỉ phiên soạn bài (mất một lượt chạy demo); không đụng web/prod.
- **Bài học:** dừng tiến trình theo PID phải chịu được trường hợp tiến trình đã tự kết thúc — trên macOS lỗi đó có thể là EPERM.

### 15/11/2026 — Video bài giảng (điều phối máy thuê vast1) — 5 video render xong nằm kẹt 16 giờ, làn treo 14 giờ, 4 bộ render mồ côi ăn CPU
- **Triệu chứng:** obs-6-5, rds-5-4, gha-3-1, gha-3-5, gha-4-3 có `video.mp4` đầy đủ trên vast1 từ trưa 14/11 nhưng không có dòng `ok`, khoá `render-khoa/<id>` còn giữ nên không ai làm lại; làn `vbg-render@t9` đứng ở `▶ gha-6-2` từ 14:44; sau khi "gỡ" 5 tập chậm khỏi vast1 vẫn còn 4 cây `remotion render` (osd-2-2, dkr-9-2, gha-10-4, net-8-1) chạy, cha là init.
- **Nguyên nhân:** `~/vbg-dp/dieu-phoi-linux/render.sh:19` gọi `out=$(ssh "$H" … lam-bai.mts …)` không có giới hạn thời gian — kết nối tới máy thuê đứt kiểu treo thì làn chờ mãi, kết quả của máy thuê không bao giờ được kéo về; còn lúc gỡ tập chỉ giết `lam-bai.mts`, cây `remotion`/`chrome-headless-shell`/`ffmpeg` con mồ côi và chạy tiếp.
- **Cách sửa:** lam-bai chạy TÁCH khỏi ssh trên máy thuê (`xuat/lam-bai-nen.sh`: setsid, log `/tmp/r-<id>.log` + pid; đang chạy hoặc đã xong ⇒ không chạy lại), `render_thue` chỉ hỏi log mỗi phút (trần 7 h), chờ máy tối đa 3 h khi proxy rớt (`cho_may`) và thử lại các bước đẩy — sửa cả bản Mac `~/Documents/video-bai-giang/dieu-phoi-linux/render.sh` vì cầu đồng bộ đẩy đè sang Linux; thay tệp nguyên khối để không phá làn đang chạy. Sáng 15/11 proxy ssh8.vast.ai của vast3 rớt nhiều lần ⇒ 28 tập LOI trong 20 phút, trả lại hàng. Kéo tay 5 video về + ghi `ok`; giết cả cây tiến trình theo `pgrep -P`; vast1 đã trả.
- **Ảnh hưởng:** chỉ hệ thống làm video (5 video trễ ~16 giờ, máy thuê trả tiền cho CPU chạy việc vô ích); không đụng web/prod.
- **Bài học:** mọi lệnh chờ máy từ xa phải có trần thời gian; "gỡ" một việc phải giết cả cây tiến trình và kiểm lại bằng `ps` — tiến trình mồ côi không báo lỗi, chỉ lặng lẽ ăn tài nguyên.

### 15/11/2026 — CT Language (đồng bộ sổ tay) — từ lưu từ màn Dịch / nút Chia sẻ không bao giờ lên tài khoản
- **Triệu chứng:** thẻ từ lưu từ màn Dịch hoặc gửi vào qua Chia sẻ chỉ nằm trên một máy; máy khác cùng tài khoản không thấy, app không báo lỗi gì.
- **Nguyên nhân:** `src/services/ctlanguage/soTuDongBoThuan.ts:111` (`KHOA_THE` tối đa 10 chữ số) + `:64` (`muc.id` trong ±9.999.999.999) — app cấp id −2e12… (`BoDichCTL.swift:160`) và −1e12… (`NhanChiaSeCTL.swift:126`) ⇒ máy chủ bỏ bản ghi; app (`DongBoSoTuCTL.swift › xongDay`) vẫn xoá chúng khỏi hàng chờ vì chỉ xem `success`.
- **Cách sửa:** máy chủ nhận id tới `Number.MAX_SAFE_INTEGER` (khoá 16 chữ số) + test; app một lần đưa lại vào hàng chờ mọi thẻ id vượt trần cũ (`GopSoTu.dayLaiIdNgoai`), chỉ đánh dấu xong khi lô đẩy về `soLoi == 0` (máy chủ chưa deploy ⇒ lần sau thử lại) + test `DongBoSoTuTests`.
- **Ảnh hưởng:** mọi người dùng CT Language đăng nhập có từ lưu từ Dịch/Chia sẻ, từ khi có đồng bộ (deploy f2944c174, 15/11) tới bản sửa; không mất dữ liệu trên máy.
- **Bài học:** hai đầu cấp id phải dùng chung một khoảng có test giữ; bên nhận lô mà "bỏ bản sai, nhận bản đúng" thì bên gửi phải đọc số lỗi trả về, không được coi `success` là đã nhận đủ.

### 15/11/2026 — CT Language iOS (màn Dịch, nguồn "Liên kết") — gom khoảng trắng của trang web không bao giờ chạy
- **Triệu chứng:** chữ tải từ một liên kết (Dịch văn bản › Liên kết) giữ nguyên chuỗi dấu cách, `&nbsp;`, dấu cách toàn khổ `　` giữa các từ — ô nhập đầy khoảng trống, đoạn dịch bị ngắt lạ.
- **Nguyên nhân:** `ios-app/CuongThaiApp/CTLanguageApp/Modules/Dich/DichVanBanCTL.swift:536` (`boThe`) dùng biểu thức `#"[ \u{00A0}\u{3000}]+"#` — `\u{…}` là cú pháp chuỗi Swift, KHÔNG phải ICU regex; trong chuỗi thô nó thành mẫu sai ⇒ `replacingOccurrences(.regularExpression)` lặng lẽ trả nguyên chuỗi (đo: "a \u{00A0}\u{3000} b" ra y nguyên, kể cả dấu cách thường).
- **Cách sửa:** bỏ hẳn đường "đổ cả trang thô vào ô nhập" — "Liên kết" nay mở màn Đọc trang web (`DocLinkCTL` + bộ rút bài `RutBaiWebCTL`), gom khoảng trắng bằng mẫu ICU đúng `[ \t\r\n 　]+` + test `RutBaiWebTests.testThucTheVaKhoangTrang` (ios-app c54ab21).
- **Ảnh hưởng:** người dùng CT Language iOS dùng Dịch › Liên kết từ đợt D (14/11) — chưa phát hành App Store, chỉ TestFlight.
- **Bài học:** trong chuỗi thô `#"…"#` của Swift, ký tự Unicode trong regex phải viết kiểu ICU (`\uXXXX` / `\x{…}`); regex sai không ném lỗi với `replacingOccurrences` — mỗi regex cần một test có dữ liệu thật đi qua.

### 15/11/2026 — Video bài giảng (máy thuê vast4, 48 làn render) — hơn 1 giờ không ra tập nào, rồi 14 tập LOI vì font quá hạn
- **Triệu chứng:** dựng vast4 (EPYC ~61 nhân) + bật 48 làn t1–t48: 70 phút sau `/tmp/r-<id>.log` vẫn rỗng, không có tiến trình `remotion render`, load 103; sau khi sửa thì 14 tập LOI với `delayRender() "Fetching Mona Sans font" … not cleared after 58000ms`.
- **Nguyên nhân:** (1) `video-bai-giang/xuat/lam-bai.mts:22` luôn chạy `xuat/dang-ky.mts` (nạp lại ~3.700 kịch bản để sinh `_danhSach.ts`) trước mỗi render — 48 làn chung `~/vbg` cùng chạy ⇒ 96 tiến trình giành CPU, mỗi lượt > 20 phút, trong khi render đi qua `src/_vao/<id>.ts` (một bài) không cần `_danhSach` mới; (2) 48 làn × `LAM_BAI_CONC=12` tab Chrome ⇒ load 180–190 trên 61 nhân, Chrome không tải xong font trong 58 s; (3) — nguyên nhân CHÍNH của 48 tập LOI sau đó — container Vast giới hạn `pids.max` = 15.616 luồng (đo `/sys/fs/cgroup/pids.max`), 30+ render × 12 tab Chrome chạm trần ⇒ `pthread_create: Resource temporarily unavailable` ⇒ `Failed to launch the browser process`.
- **Cách sửa:** `LAM_BAI_BO_DANG_KY=1` (đặt trong `xuat/lam-bai-nen.sh`, chỉ máy thuê) ⇒ `lam-bai.mts` bỏ `dang-ky` khi `_danhSach.ts` đã có; giảm còn 20 làn (cờ `hang-render.dung-linux-t21..48`) cho vừa trần luồng, trả 62 tập LOI về hàng. Vết xe đổ khi chữa: đặt `OMP_NUM_THREADS=4` vào `/etc/environment` để numpy bớt luồng ⇒ GNU `nproc` báo 4 nhân ⇒ Remotion từ chối `--concurrency 12` ("Available CPU cores: 4") ⇒ thêm 42 tập LOI; chỉ giữ `OPENBLAS/MKL/NUMEXPR_NUM_THREADS`.
- **Ảnh hưởng:** ~1,5 giờ thuê vast4 (~0,3 $) không ra video; 14 tập phải render lại. Không lỗi nội dung.
- **Bài học:** bước "chuẩn bị chung" chạy lại trong MỖI việc là vô hại khi 1–16 làn nhưng thành bão khi 48 làn chung một thư mục — tăng làn phải tăng dần và đo (CPU cgroup, `pids.current`/`pids.max`, log có tiến) sau mỗi nấc, không nhảy thẳng lên mức "theo số nhân".

### 15/11/2026 — CT Language iOS (game "Gấu Chạy Ghép Câu", lúc soạn) — HUD + nút làn bị đẩy tràn mép phải
- **Triệu chứng:** ảnh chụp máy ảo đầu tiên: thẻ nghĩa, thanh câu cắt ở mép phải; tim, đồng hồ/chặng và nút ⬆︎ biến mất; mọi thứ lệch trái ~12 điểm.
- **Nguyên nhân:** `ios-app/…/Modules/TroChoi/ChayGhepCau/CanhNenChayCTL.swift` (`LopCuonChayCTL`) đặt dải ảnh parallax (HStack nhiều bản ảnh, rộng > màn) TRỰC TIẾP trong `ZStack` ⇒ ZStack nhận bề rộng của con rộng nhất, cả màn chơi (HUD, thanh câu, nút) dàn theo bề rộng đó rồi bị cắt; thêm vào đó hàng HUD 6 món vượt 375 điểm.
- **Cách sửa:** lớp cuộn nằm trong `Color.clear.overlay(alignment: .topLeading) { … }.clipped()` (không nong khung cha), ZStack màn chơi `.frame(width:height:)` theo GeometryReader, combo thành huy hiệu dính góc điểm — trước commit đầu của game (ios-app 160c118).
- **Ảnh hưởng:** không ai dùng phải — bắt được trên máy ảo trước khi commit.
- **Bài học:** trong SwiftUI một view con rộng hơn màn (dải ảnh cuộn, HStack lặp) làm cả `ZStack` cha rộng theo — nội dung cuộn/tràn phải nằm trong `overlay`/`background` hoặc khung cố định; và luôn chụp màn trên máy ảo trước khi tin bố cục.

### 15/11/2026 — CT Language iOS (giọng đọc trong máy, lộ ra ở game "Bếp Gấu" / "Gấu Câu Chữ") — app đứng hình vĩnh viễn ngay câu đọc to đầu tiên
- **Triệu chứng:** cài mới trên máy ảo iOS 27, mở game, vài giây sau màn chơi đóng băng (khách chưa kịp vào quầy / cá chưa hiện), không chạm được gì, không crash; `sample` thấy luồng chính kẹt mãi ở `semaphore_wait_trap`.
- **Nguyên nhân:** `ios-app/CuongThaiApp/Shared/SachHoc/GiongSachHoc.swift › noiTrongMay` gọi `CaiDatGiong.giongTuDong` ⇒ `AVSpeechSynthesisVoice(language:)` TRÊN LUỒNG CHÍNH đúng lúc `KhoGiongMay.napNen()` đang chạy `speechVoices()` ở nền — TextToSpeech `axUnsafeForcedSync` ở hai đầu chờ nhau ⇒ khoá chết (giọng Azure của máy chủ chưa về kịp nên rơi xuống giọng trong máy ngay câu đầu).
- **Cách sửa:** danh sách giọng chưa nạp xong ⇒ dựng giọng vùng trong `Task.detached` rồi `await` (luồng chính rảnh, nạp nền chạy xong); đã nạp thì như cũ (ios-app 0e4b5ca).
- **Ảnh hưởng:** mọi chỗ đọc to qua `DocToCTL`/`GiongSachHoc` trong vài giây đầu sau khi mở app lần đầu (game, từ điển); chưa rõ máy thật có dính không — máy ảo dính 3/3 lần. Các chỗ khác còn gọi `giongTuDong … ?? AVSpeechSynthesisVoice(language:)` trên luồng chính (`CoVuGau`, `GoiCuongMiniCTL`, `DocTu`) CHƯA vá.
- **Bài học:** "đưa việc chậm ra nền" chưa đủ khi API kia cũng có bản đồng bộ trên luồng chính dùng chung khoá nội bộ — mọi lời gọi `AVSpeechSynthesisVoice` lúc danh sách giọng đang nạp phải ở nền; ảnh màn "đứng im" thì `sample <pid>` trước, đừng đoán do vẽ.

### 15/11/2026 — Tin nhắn (backend, lộ ra khi làm "Lời mời" cho app CT Language) — vẫn đẩy thông báo cho hội thoại người nhận đã "Xoá cho riêng tôi"
- **Triệu chứng:** xoá một cuộc trò chuyện (hoặc nay: Từ chối lời mời của người lạ), người kia nhắn tiếp ⇒ máy vẫn kêu + hiện thông báo, chạm vào không mở được gì vì hội thoại không còn trong hộp thư (tin mới KHÔNG đưa nó về).
- **Nguyên nhân:** `src/services/messages.service.ts › dayThongBaoTinMoi` chỉ bỏ người đã tắt tiếng (`mutedUntil`), không nhìn `preferences[người nhận].deletedAt` — trong khi `listThreadsForUser` / `getUnreadCount` đã lọc `deletedAt` từ 09/09.
- **Cách sửa:** `if (pref?.deletedAt) continue;` trong vòng đẩy — cùng commit với tính năng lời mời nhắn tin (`loiMoiTinNhan.ts`, tuyến `POST /messages/threads/:id/accept`).
- **Ảnh hưởng:** mọi người dùng app iOS chính đã xoá một cuộc trò chuyện mà người kia còn nhắn; không mất dữ liệu.
- **Bài học:** "ẩn khỏi danh sách" có ba đường đọc (danh sách, huy hiệu, đẩy) — thêm một cờ ẩn thì soát cả ba, như bài học huy hiệu 09/09 đã nói cho đường thứ hai.

### 15/11/2026 — CT Language iOS (game "Gấu Câu Chữ" + "Bếp Gấu", ngay sau commit đầu) — lớp game đứng hình: không thấy cá, không thấy khách
- **Triệu chứng:** điểm, đề, giỏ cá trên HUD vẫn chạy (người máy câu được), nhưng cá dưới hồ không bao giờ hiện, dây câu đứng yên, hạt nổ không có; ở Bếp không thấy khách ở quầy dù bong bóng gọi món đổi liên tục.
- **Nguyên nhân:** `ios-app/…/TroChoi/CauChu/CauChuCTL.swift › LopGameCauChuCTL` (và `LopKhachBepCTL`, `LopKhayBepCTL`, `ThanhGioCauCTL`) viết `let _ = dc.khung` trong `body` rồi `Canvas { … }` chỉ bắt `dc` (cùng một tham chiếu) ⇒ mỗi khung SwiftUI dựng lại body nhưng closure của Canvas giống hệt lần trước nên nó KHÔNG vẽ lại — lớp game giữ mãi khung đầu tiên.
- **Cách sửa:** `let khung = dc.khung` và `_ = khung` NGAY TRONG closure Canvas (closure khác nhau mỗi khung ⇒ Canvas vẽ lại) — ios-app b0774c9.
- **Ảnh hưởng:** chỉ bản trong cây (a03c020, 0e4b5ca), chưa phát hành; bắt được khi chụp máy ảo đủ 3 ngôn ngữ.
- **Bài học:** Canvas điều khiển bằng bộ đếm khung phải BẮT giá trị đếm vào closure (như "Gấu Canh Trời" đọc `dc.khung` bên trong Canvas); đọc ở `body` rồi bỏ đi không đủ. Ảnh "HUD chạy mà cảnh đứng" ⇒ nghi Canvas không vẽ lại trước khi nghi động cơ.

### 15/11/2026 — CT Language iOS (Tin nhắn, bắt trên máy ảo trước commit) — hội thoại ngắn mở ra không thấy tin nào, chỉ thấy ảnh đại diện người kia
- **Triệu chứng:** màn trò chuyện của một lời mời (2 tin) hiện ảnh đại diện + "Hôm nay" giữa màn, hai tin nằm khuất dưới thanh Chấp nhận / Từ chối; hội thoại dài thì bình thường.
- **Nguyên nhân:** `ios-app/…/CTLanguageApp/Modules/TinNhan/TroChuyenTN.swift › khungTin` dùng `ScrollView` + `LazyVStack` + `.defaultScrollAnchor(.bottom)`: lần dựng đầu SwiftUI tính vị trí đáy theo chiều cao ƯỚC LƯỢNG của hàng lười ⇒ nội dung ngắn bị ghim lệch; `onChange(of: tin.last?.id)` bắn trước khi bố cục xong nên không cứu được.
- **Cách sửa:** tải xong (`daTai`) ⇒ chờ một nhịp bố cục (80 ms) rồi `scrollTo("day", anchor: .bottom)` — cùng commit tính năng Tin nhắn của app CT Language.
- **Ảnh hưởng:** không ai dùng phải — chụp màn trên máy ảo trước khi commit.
- **Bài học:** `defaultScrollAnchor(.bottom)` với `LazyVStack` không đủ cho khung chat — luôn cuộn tay xuống đáy sau lần tải đầu, và chụp cả ca hội thoại NGẮN lẫn DÀI.

### 15/11/2026 — Web (đăng nhập OAuth) — kẻ xấu đăng ký trước bằng email người khác rồi dùng được mật khẩu của hắn sau khi chủ email đăng nhập Google
- **Triệu chứng:** (chưa xảy ra thật — agent soạn khoá dsa-interview đọc mã và phát hiện) tài khoản lập bằng email + mật khẩu, CHƯA xác thực email (login bị chặn `EMAIL_NOT_VERIFIED`); khi chủ thật của email đó đăng nhập Google/Facebook/Apple thì tài khoản được gộp, đánh dấu đã xác thực, và mật khẩu của người lập trước bỗng đăng nhập được.
- **Nguyên nhân:** `src/services/auth.service.ts › oauthRegister` (~dòng 520) gộp OAuth vào user cùng email, đặt `emailVerified: true` nhưng GIỮ `password` cũ, không phân biệt tài khoản đã hay chưa xác thực (kiểu tấn công "pre-account hijacking"). Kèm lỗi nhỏ: route `/role` (`src/routes/auth.routes.ts` ~318) so `X-Internal-Token` bằng `===` (lộ secret dần qua thời gian phản hồi).
- **Cách sửa:** gộp vào tài khoản CHƯA xác thực ⇒ `password: null` (chủ thật muốn mật khẩu thì đặt lại qua email); tài khoản đã xác thực giữ nguyên. `/role` so bằng `timingSafeEqual` (so độ dài byte trước). Test `src/routes/auth.oauthGop.db.test.ts` (2 ca, CSDL thật).
- **Ảnh hưởng:** mọi tài khoản web có email từng bị người khác đăng ký mà chưa xác thực, từ khi có đăng nhập OAuth; không thấy dấu hiệu bị khai thác (chưa kiểm log).
- **Bài học:** "nhà cung cấp OAuth đã xác thực email" chỉ chứng minh người ĐANG đăng nhập sở hữu email — không chứng minh mọi thứ gắn sẵn vào tài khoản cùng email (mật khẩu, phiên) là của họ; gộp tài khoản thì phải coi dữ liệu xác thực cũ của tài khoản chưa xác thực là của người lạ.

### 15/11/2026 — Đăng nhập (dùng chung web + mọi app) — đổi mật khẩu không đăng xuất được máy khác, token cũ còn được gia hạn 30 ngày
- **Triệu chứng:** đổi / đặt lại mật khẩu (hoặc admin đổi vai trò) xong, máy khác đang đăng nhập — kể cả kẻ cầm token lộ — vẫn gọi API bình thường, và `/auth/refresh` còn cấp token mới cho nó tới 30 ngày.
- **Nguyên nhân:** `src/middleware/auth.ts › authenticate` (và `taoRequireAdmin`, `services/auth.service.ts › refreshToken`, `routes/embedJobs.routes.ts`) chỉ kiểm `enabled`/`accountNonLocked`; mọi đường đổi mật khẩu đã TĂNG `roleVersion` nhưng không chỗ REST nào so `roleVersion` trong JWT với CSDL (chỉ socket tin nhắn + cộng tác Docs có so).
- **Cách sửa:** `services/phienDangNhap.ts` (`phienConHieuLuc` + 401 `SESSION_REVOKED`) gắn vào 4 chỗ trên; thêm `POST /auth/logout-all` (tăng phiên bản, trả cặp token mới cho máy đang bấm); app CT Language: nút "Đăng xuất mọi thiết bị khác" + tự đăng nhập lại bằng mật khẩu mới sau khi đổi; test `phienDangNhap.test.ts`, `auth.mfa.test.ts`, `auth.thuHoiPhien.db.test.ts`.
- **Ảnh hưởng:** mọi tài khoản trên web cuongthai.com, app CuongThai, CT Language, CT Work từ trước tới bản sửa; sau deploy, ai đã đổi mật khẩu mà còn token cũ ở máy khác sẽ bị đăng xuất một lần (đúng ý).
- **Bài học:** "đã tăng số phiên bản" chưa phải "đã thu hồi" — phải có chỗ ĐỌC số đó trên đường đi của mọi request (và đường làm mới token), kèm test CSDL chứng minh token cũ chết.

### 15/11/2026 — CT Language iOS (màn Pro) — gói năm quy ra tháng hiện "≈ 33 ₫/tháng" thay vì 33.250 ₫
- **Triệu chứng:** thẻ "Gói năm" ở màn Pro ghi "7 ngày miễn phí · ≈ 33 ₫/tháng" (đúng phải ~33.250 ₫); ảnh duyệt IAP gửi Apple mang con số sai — rủi ro 3.1.2 (giá trên màn mua sai).
- **Nguyên nhân:** `ios-app/CuongThaiApp/CTLanguageApp/Pro/ManProCTL.swift › dongPhu` tính `sp.price / 12` rồi định dạng bằng `priceFormatStyle.precision(.fractionLength(0))`; StoreKit thử nghiệm (máy ảo/test, storefront VNM) trả `price = 399` cho gói hiển thị "399.000 ₫" với tiền 0 số lẻ.
- **Cách sửa:** `ManProCTL.giaMoiThang` tự dựng `Decimal.FormatStyle.Currency` theo mã tiền + locale của gói, làm tròn theo số lẻ của loại tiền, và với tiền 0 số lẻ thì tin số trong `displayPrice` khi nó lớn hơn hẳn `price`; test `ProCTLTests.testGiaQuyRaThang` + kiểm trong `testNapGoiVaCauGia`; ảnh duyệt 2 gói thuê bao đã chụp lại + tải lại lên ASC (ios-app 61582f7).
- **Ảnh hưởng:** chưa lên người dùng (bắt được khi tạo gói thuê bao trên App Store Connect trước lần nộp đầu).
- **Bài học:** đừng tin `Product.price` của StoreKit thử nghiệm với tiền không có phần lẻ; con số hiển thị trên màn mua phải có test so với chuỗi `displayPrice`.

### 15/11/2026 — CT Language (từ vựng chủ đề tiếng Nhật) — 真面目 đọc sai thành しんめんもく
- **Triệu chứng:** chủ đề "Tính cách" tiếng Nhật hiện 真面目 với cách đọc しんめんもく; người học sẽ đọc/nghe sai một từ N5 rất thông dụng.
- **Nguyên nhân:** `content/ctlanguage/chu-de-tu/ja/tinh-cach.json:4` ghi `"doc":"しんめんもく"` (đọc âm On từng chữ), đúng phải là まじめ (jukujikun).
- **Cách sửa:** đổi `doc` thành まじめ; `npx tsx --test src/services/ctlanguage/*.test.ts` 152/152 (cùng commit bổ sung nội dung 15/11).
- **Ảnh hưởng:** người dùng app CT Language đã thấy cách đọc sai ở chủ đề Tính cách (web không dùng tệp này).
- **Bài học:** từ đọc kiểu jukujikun (真面目, 今日, 大人…) không suy được từ âm của từng chữ — bộ kiểm chủ đề nên đối chiếu `doc` với từ điển `ctl_tu` (`scripts/ctlanguage-kiem-chu-de-tu.mts ja`) trước khi đẩy.

### 16/11/2026 — CT Work OKR — dashboard mất tuần hiện tại từ 0h tới 7h sáng thứ Hai
- **Triệu chứng:** deploy 4fd1eb26a (00:44 16/11) bỏ push vì `work.ctw7a.db.test.ts` O4 đỏ: `dashboard.weeks.at(-1).actual` = null dù vừa check-in; chạy riêng vẫn đỏ (không phải chập chờn).
- **Nguyên nhân:** `src/services/work/okr.service.ts:380` dừng vòng tuần bằng `t > now` với `t` = 00:00Z thứ Hai (= 07:00 giờ VN), còn check-in lưu `weekStartVN(now)` ⇒ trong 7 giờ đầu tuần, tuần của check-in chưa có trên biểu đồ.
- **Cách sửa:** so theo ngày VN: `if (w > weekStartVN(now)) break;` — test ctw7a xanh lại lúc 01:00 thứ Hai.
- **Ảnh hưởng:** biểu đồ tiến độ OKR thiếu cột tuần mới mỗi sáng thứ Hai 0h–7h; dữ liệu không mất.
- **Bài học:** ranh giới tuần/ngày phải so cùng một múi giờ — trộn mili-giây UTC với ngày VN là lỗi chỉ hiện ở vài giờ trong tuần, test xanh cả tuần rồi đỏ đúng đêm Chủ nhật.
