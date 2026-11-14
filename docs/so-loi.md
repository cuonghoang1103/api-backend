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
