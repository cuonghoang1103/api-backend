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
