# CT Language — app iOS học 3 ngôn ngữ (Anh · Nhật · Trung)

> Soạn 12/11/2026. Đây là **bản giao việc** cho phiên làm app (Claude Code desktop) và là hợp đồng giữa
> hai phiên: **phiên APP** (làm app iOS + backend riêng của app) và **phiên NỘI DUNG** (soạn bài học
> IELTS / Nhật / Trung trên web). Đọc HẾT trước khi bắt tay. Sửa tệp này khi chốt thêm điều gì.

## 0. Người dùng đã chốt (12/11/2026)

1. App tên **CT Language**, lên App Store như CT Work. Học **3 ngôn ngữ ngang hàng**: Anh (IELTS là trục),
   Nhật (Dekiru → JLPT), Trung (HSK). Không ngôn ngữ nào "phụ".
2. Mở app lần đầu ⇒ **hỏi chọn ngôn ngữ học** (có thể kèm trình độ / mục tiêu) ⇒ vào trang chủ của ngôn ngữ
   đó. **Cài đặt** đổi được ngôn ngữ đang học bất cứ lúc nào (tiến độ mỗi ngôn ngữ giữ riêng).
3. **Gói miễn phí + gói Pro** (mua trong app bằng Apple IAP).
4. Muốn **đủ chức năng của Hanzii (Trung) + Mazii (Nhật)** và tương đương cho tiếng Anh, CỘNG phần riêng
   của mình (mục 3). Hoàn thiện đầy đủ, không làm bản sơ sài.

## 1. Đang có sẵn — TẬN DỤNG, đừng viết lại

| Thứ | Ở đâu | Ghi chú |
|---|---|---|
| Dự án iOS (2 app chung mã: CuongThai `com.cuongthai.app`, CT Work `com.cuongthai.ctwork`) | `~/Downloads/ios-app` (`project.yml`, XcodeGen) | CT Language = **target thứ 3** `CTLanguageApp`, bundle `com.cuongthai.ctlanguage`, theo mẫu `CTWorkApp/` (App/Core/Intents/Widget…). Đọc `ios-app/CLAUDE.md` + `CTWorkApp/KIEN_TRUC.md` trước |
| Mã học ngôn ngữ iOS đã có | `Shared/NgonNgu` (36 tệp ~11k dòng: từ điển, nét chữ, luyện viết, sổ tay, nghe liên tục, chấm viết, giọng đọc…), `Shared/Ielts` (17 tệp ~5k dòng: thi máy, luyện nói, kho từ…), `Shared/NgonNguApp`, `Shared/Pro` (StoreKit) | Tách/dùng lại vào target mới; app CuongThai chính vẫn build được |
| Bài học (nội dung) | `api-backend/frontend/src/app/language/[code]/`: `ielts/` (Tập 1 = 15 ngày, `tap-2/` = 24 ngày, `thi-may/` 4 đề), `dekiru/` + `jp/` (Nhật), `ch/` (Trung, mới HSK1 Bài 0–5) | Dữ liệu là TS theo **schema `frontend/src/components/sach-hoc/types.ts`** (36 loại khối) — đó là hợp đồng để app tự vẽ |
| API học IELTS | `src/routes/ielts.routes.ts`, `ielts.hoc.routes.ts` (từ vựng hôm nay/đánh giá SRS, sổ lỗi, thi máy, chấm viết/nói AI, xếp lớp), tiến độ theo `stage` (`src/services/ielts/ielts.service.ts`) | Tiến độ web ↔ app CHUNG một nguồn |
| Giọng đọc | `src/services/ielts/docTo.service.ts` (Azure Neural → Google; giọng `en-*`, `au-*`, Nhật, Trung) | |
| Apple IAP backend | `src/routes/pro.routes.ts` `POST /pro/apple/transactions`, `src/services/appleIAP/*` (kiểm chữ ký, cấp Pro) | Thêm product id của app mới vào `quyTac.ts` |
| Đăng nhập | chung tài khoản cuongthai.com (Apple/Google/email) | |

## 2. Danh mục chức năng — đối chiếu Hanzii / Mazii (phải có đủ)

**Từ điển**
- Tra bằng: gõ (chữ / pinyin / romaji / kana / tiếng Việt / Hán Việt), **viết tay**, **giọng nói**, **camera/ảnh (OCR)**, dán chữ.
- Mục từ: nghĩa Việt + Anh, phiên âm (pinyin có dấu / furigana + on-kun / IPA), cấp HSK / JLPT / CEFR, từ loại,
  ví dụ có 🔊, từ đồng-trái nghĩa, so sánh từ gần nghĩa, ngữ pháp liên quan, cụm hay đi kèm.
- Chữ Hán/Kanji: bộ thủ, tách thành phần, **hoạt hình thứ tự nét**, âm Hán Việt, nguồn gốc/mẹo nhớ bằng hình/câu chuyện.
- Phồn thể (Đài Loan) bật được; giọng Bắc Kinh/Đài Loan; giọng Mỹ/Anh/Úc.
- Tra tên tiếng Việt → Trung/Nhật. Lịch sử tra, tra offline (gói dữ liệu tải về).

**Dịch + AI**
- Dịch câu/đoạn theo ngữ cảnh; dịch hội thoại 2 chiều bằng giọng nói.
- Trợ lý AI (chat + **gọi thoại**), chọn tính cách; AI sửa ngữ pháp bài viết; AI chấm phát âm từng âm/thanh điệu;
  AI chấm Writing/Speaking theo tiêu chí kỳ thi (IELTS đã có; thêm HSKK, JLPT không có nói ⇒ luyện nói hội thoại).

**Ôn từ (SRS)**
- Bộ flashcard sẵn: HSK 1–9 (HSK 3.0), JLPT N5–N1, IELTS/AWL/NGSL theo tập. Sổ từ riêng (tạo, chia sẻ bằng link,
  nhập/xuất CSV), ôn lặp ngắt quãng ưu tiên từ hay quên, quiz, ghép cặp, nghe-chọn, gõ lại, có ảnh.
- Từ mới trong mỗi bài học **tự vào hàng ôn**.

**Luyện viết chữ**: viết theo nét có chấm từng nét (PencilKit + dữ liệu nét), game thứ tự nét.

**Thi thử**: IELTS (đã có 4 đề, sẽ thêm), HSK 1–6/HSKK, JLPT N5–N1 — tính giờ như thi thật, chấm tự động, giải thích từng câu,
phiếu điểm + bài ôn gợi ý, thống kê tiến bộ.

**Game**: gõ pinyin/romaji nhanh, đấu PK với bạn, thử thách 60 giây, phần thưởng chuỗi ngày.

**Cộng đồng**: hỏi đáp/thảo luận theo ngôn ngữ, bàn luận dưới đề thi, nhắn bạn học. ⚠️ Apple 1.2: bắt buộc báo cáo,
chặn người, lọc nội dung, gỡ trong 24h — dùng lại hệ feed/messages của web nếu được.

**Giữ thói quen**: widget màn hình chính + màn khoá (từ hôm nay, chuỗi ngày), nhắc giờ học, streak, mục tiêu phút/ngày.

## 3. Phần RIÊNG của CT Language (Hanzii/Mazii không có)

1. **Lộ trình bài học là trục** — không phải app từ điển kèm bài: IELTS 0→8.0 (5 tập/129 ngày), Nhật 0→N2, Trung 0→HSK 6.
2. **"Một chữ ba ngôn ngữ"**: 学 = *xué* (Trung) · *gaku/manabu* (Nhật) · *học* (Hán Việt) — thẻ chéo khi người học có ≥2 ngôn ngữ châu Á.
3. **Màn "Hôm nay 15 phút"**: tự gom từ đến hạn + 1 bài nghe + 1 câu nói + phần dở của Ngày đang học.
4. **Giám khảo AI thi nói** (IELTS đã có trên web — `thi-may` Nói AI) đưa lên điện thoại, mở rộng HSKK.
5. **Chế độ nghe khi đi đường**: phát bài nghe/câu mẫu nền, điều khiển màn khoá, Live Activity/Dynamic Island.
6. **Phiếu điểm → đúng bài ôn** (như `thi-may/cham.ts › BAI_ON`).
7. **Tải offline từng tập** (bài + âm thanh + từ điển).
8. **Đồng bộ web ↔ app**: học dở trên web, mở app học tiếp.

## 4. Miễn phí vs Pro (ĐỀ XUẤT — hỏi user chốt con số trước khi tạo sản phẩm IAP)

| | Miễn phí | Pro |
|---|---|---|
| Bài học | Tập/cấp đầu mỗi ngôn ngữ (IELTS Tập 1, Nhật Bài 1–?, HSK 1) | Tất cả |
| Từ điển, tra viết tay/camera | Đủ | + offline đầy đủ, nguồn gốc chữ |
| Flashcard/SRS | Bộ sẵn cấp đầu + 1 sổ riêng | Không giới hạn |
| Thi thử | 1 đề/ngôn ngữ | Tất cả + phiếu điểm chi tiết |
| AI (chat, chấm nói/viết, dịch AI) | vài lượt/ngày | Nhiều (có trần chống lạm dụng ở server) |
| Quảng cáo | **Không có** (khác Hanzii/Mazii — đây là điểm cộng khi review) | — |

Câu hỏi cho user: Pro của CT Language có **dùng chung** với Pro web cuongthai.com không (mua 1 nơi mở cả hai)?

### ✅ User đã CHỐT (12/11/2026, phiên APP hỏi) — thắng bảng đề xuất ngay trên

1. **Pro DÙNG CHUNG** với Pro web + app CuongThai: một cờ `isPro` ở máy chủ (`isProEffective`), mua ở đâu cũng mở cả
   ba. App vẫn phải bán bằng IAP (Apple 3.1.3(b)). Backend: thêm bundle `com.cuongthai.ctlanguage` + product id mới
   vào `src/services/appleIAP/quyTac.ts` (hiện chỉ nhận đúng `BUNDLE_ID = 'com.cuongthai.app'` ⇒ phải thành danh sách).
2. **Thuê bao TỰ GIA HẠN** (Auto-Renewable, một subscription group): **49.000đ/tháng · 399.000đ/năm**, **dùng thử
   7 ngày** (introductory offer, cả hai gói). Giá thật theo bậc giá Apple gần nhất; app luôn in `product.displayPrice`.
   ⚠️ Khác app CuongThai (gói KHÔNG tự gia hạn 1/3/6/12 tháng): backend phải cấp Pro theo `expiresDate` của giao dịch
   chứ không theo số tháng, và cần **App Store Server Notifications V2** (gia hạn · tắt gia hạn · hết hạn · hoàn tiền) —
   hiện CHƯA có tuyến nào nhận thông báo này. Trang Pro phải có: giá + chu kỳ + nói rõ tự gia hạn, Khôi phục giao dịch,
   link Điều khoản (EULA) + Chính sách bảo mật, lối vào Quản lý thuê bao.
3. **Bản miễn phí RỘNG: mọi bài học + từ điển đều free.** Pro mở: AI nhiều lượt (chat, chấm nói/viết, dịch AI, gọi
   thoại), thi thử đầy đủ + phiếu điểm chi tiết, offline (bài + âm thanh + từ điển), sổ từ/flashcard không giới hạn.
   Không quảng cáo.
4. **Chỉ iPhone ở bản đầu** (`TARGETED_DEVICE_FAMILY = "1"`, đúng luật C12 kho iOS); iPad làm giao diện thật ở bản sau.

## 5. Kiến trúc đề xuất

- **App vẽ bài bằng SwiftUI gốc** từ JSON — KHÔNG nhúng WebView cả bài (Apple 4.2 "chỉ là web bọc lại" + không offline được).
- **Xuất nội dung**: script `frontend/scripts/xuat-bai-app.mts` (PHIÊN NỘI DUNG viết) đọc các khoá `defineCourse` ⇒ JSON
  theo đúng schema `types.ts` ⇒ đẩy R2 `hoc/app/<khoa>/<phienban>/…` + `manifest.json` (id bài, tiêu đề, tập, ngày, băm nội dung).
  App tải theo manifest, so băm để cập nhật. Âm thanh: URL giọng đọc sinh sẵn hoặc gọi API đọc như web.
- **Backend riêng của app** (PHIÊN APP làm): tuyến `src/routes/ctlanguage*.ts` — hồ sơ ngôn ngữ đang học, tiến độ chung
  3 ngôn ngữ, từ điển (tra/gợi ý), SRS chung, quyền Pro theo product id mới. Tiến độ IELTS dùng lại `ielts.*.routes.ts`.
- **Dữ liệu từ điển — CHỈ nguồn mở có giấy phép, ghi công trong app**: CC-CEDICT (Trung–Anh, CC BY-SA), JMdict/KANJIDIC
  (Nhật, CC BY-SA), KanjiVG (nét Kanji, CC BY-SA), Make Me a Hanzi (nét Hán, LGPL/Arphic), Unihan (âm Hán Việt), WordNet /
  Wiktionary-Kaikki (Anh). Nghĩa tiếng Việt: AI dịch theo lô rồi soát mẫu. ⛔ KHÔNG cào/chép dữ liệu, giao diện, tên của Hanzii/Mazii.
- **Trên máy (miễn phí, offline)**: Vision OCR (zh/ja/en), Speech (nhận giọng en/ja/zh), Translation framework, PencilKit, AVSpeech dự phòng.

## 6. Chia việc hai phiên — LUẬT PHỐI HỢP

| | Phiên APP (Claude Code desktop) | Phiên NỘI DUNG (CLI hiện tại) |
|---|---|---|
| Làm | Thiết kế + code app (`~/Downloads/ios-app`), backend `ctlanguage*`, IAP, dữ liệu từ điển, App Store | Soạn bài 3 ngôn ngữ, đề thi, script xuất JSON, sửa schema `sach-hoc` |
| Không đụng | `frontend/src/app/language/[code]/**` (nội dung), `components/sach-hoc/**` | `ios-app/**`, `src/routes/ctlanguage*` |

- Cần đổi **schema khối** ⇒ ghi yêu cầu vào mục 8 của tệp này, phiên NỘI DUNG làm (để web không vỡ).
- `api-backend` có **git index dùng chung** ⇒ commit CHỈ bằng pathspec: `git add -- <tệp> && git commit -m … -- <tệp>`. Không `git add -A`.
- **Deploy: mỗi lúc MỘT phiên.** 12/11 08:21 hai deploy chồng nhau, ảnh của phiên này tráo đè ảnh phiên kia. Trước khi
  `deploy-nha.sh` ⇒ kiểm không có deploy đang chạy (`pgrep -f deploy-nha`), hỏi user. Deploy = push (xem CLAUDE.md).
- Tối đa 3 agent/phiên; agent iOS dùng **1 simulator**, xoá simulator khi xong (máy từng quá tải load 500+).
- TestFlight / App Store: **hỏi user trước** khi tải lên (`altool` thường bị bộ lọc quyền chặn ⇒ user chạy bằng `! …`).
- Commit không kèm Co-Authored-By Claude.

## 7. Thứ tự làm (phiên APP)

1. **Khung**: target `CTLanguageApp`, onboarding chọn ngôn ngữ (+ trình độ/mục tiêu/giờ nhắc), trang chủ theo ngôn ngữ,
   Cài đặt đổi ngôn ngữ, đăng nhập, tab (gợi ý: Hôm nay · Học · Từ điển · Luyện · Tôi).
2. **Học**: trình vẽ 36 loại khối từ JSON (bắt đầu IELTS Tập 1–2), tiến độ đồng bộ, nghe/nói/viết, thi máy.
3. **Từ điển + SRS + viết tay/camera/giọng + nét chữ**, widget, nhắc học, streak.
4. **Pro + IAP**, trang Pro, khôi phục mua.
5. Nhật (Dekiru/JP), Trung (CH) vào cùng trình vẽ; thẻ "một chữ ba ngôn ngữ"; offline.
6. Game, cộng đồng (có kiểm duyệt), AI gọi thoại.
7. QA iPhone (sáng/tối; iPad để bản sau — mục 4), ảnh App Store, ghi chú review (giải thích khác app CuongThai — Apple 4.3), chính sách bảo mật
   (mic, camera, speech, dữ liệu học), TestFlight ⇒ hỏi user ⇒ nộp.

## 8. Yêu cầu qua lại giữa hai phiên (ghi nối tiếp, có ngày)

- 12/11 (NỘI DUNG): sẽ viết `xuat-bai-app.mts` + manifest R2 khi phiên APP xong bước 1 — báo đường dẫn ở đây.
- 12/11 (APP): **bước 1 XONG** — backend `9e8f1a86c` (`GET/PUT /api/v1/ctlanguage/me`, chưa deploy), ios-app `47448d4` + `94bacc6`.
  Bước 2: **KHÔNG cần viết `xuat-bai-app.mts` nữa** — đường xuất ĐÃ CÓ và đang chạy trên production:
  `frontend/scripts/sach-hoc-xuat.mts` (`npm run sach-hoc:xuat`, chạy lúc build web) ⇒ `public/sach-hoc/<khoa>/index.json`
  + `bai-<n>.json` + `phu-<id>.json` (+ `chia.json`, `tu-vung.json`, `on-the.json`), phục vụ ở
  `https://cuongthai.com/sach-hoc/<khoa>/`. App iOS đã có trình vẽ đủ khối (`ios-app/CuongThaiApp/Shared/SachHoc`, gộp
  từ nhánh ios-gop vào main 12/11, commit `1612558`); CT Language dùng lại nguyên bộ đó. Hiện xuất: `ielts` (Tập 1),
  `dekiru`, `jp`, `ch`.
  **Xin phiên NỘI DUNG:** thêm vào `sach-hoc-xuat.mts` các khoá CT Language cần mà chưa xuất — `ielts` Tập 2
  (`language/[code]/ielts/tap-2`, đề xuất mã khoá `ielts-tap2`), các tập sau khi soạn, và HSK 2+ khi có. Đổi schema
  khối ⇒ giữ `SCHEMA` của script (app báo "cần cập nhật app" khi schema mới hơn) và ghi lại đây.
- 12/11 22:00 (NỘI DUNG): ✅ đã thêm khoá **`ielts-tap2`** vào `sach-hoc-xuat.mts` (export `IELTS_T2`, `ielts/tap-2/data.ts`):
  24 buổi · 99 bài · 2 mục tra cứu · 28 tệp, `--nghiem` xanh. Lên `https://cuongthai.com/sach-hoc/ielts-tap2/` ở lượt deploy kế
  (script chạy ở `prebuild`). Không đổi schema khối. Id bài dạng `t2dN-…` (khác Tập 1 `dN-…`); khoá có giọng `au-nu`/`au-nam`.
  Tập 3+ / HSK 2+: mỗi khoá mới phiên NỘI DUNG tự thêm dòng SPECS và ghi lại đây.
- 12/11 (APP): **bước 3 + 4 XONG** (chưa deploy). Bước 3: từ điển `/api/v1/ctlanguage/tu-dien/*` (1af4f0545, f9629c158) —
  sau deploy chạy `npx tsx scripts/ctlanguage/nhap-tu-dien.mts --tai` trên VPS. Bước 4: thuê bao Pro (backend 3f75ea1d7:
  `quyTac.ts` nhận bundle CT Language, `/pro/apple/notifications` V2; ios-app 9b7173f). Việc làm tay trên App Store Connect
  (sản phẩm, URL thông báo, App Group): `ios-app/CTLANGUAGE_APP_REVIEW_NOTES.md` mục 1.
- 12/11 23:55 (APP): **bước 5 XONG** (chưa deploy). Backend `610710735` + commit sau nó: `GET /tu-dien/chu-ngay?ngay=` (công khai —
  một chữ Hán đủ Hán Việt/pinyin/on, từ Trung–Nhật xếp theo **cùng âm Hán Việt**: 历史↔歴史 "lịch sử"), `GET /tu-dien/:nn/goi-offline`
  (Pro, 403 `CTL_CAN_PRO`; zh 32k từ ≈1,9 MB gzip). Bộ nhập: từ thông dụng tiếng Trung theo Unihan `kHanyuPinlu`, tân tự thể Nhật →
  giản thể qua `kJapaneseOldVariant` ⇒ **sau deploy chạy lại `nhap-tu-dien.mts --tai`** (đã nằm trong việc sau deploy của bước 3).
  ios-app `6116977`: thẻ "Một chữ · ba ngôn ngữ" thật ở Hôm nay, Tôi › Học offline (tải từ điển từng ngôn ngữ; mất mạng thì tra
  cục bộ), "Tải hết để học ngoại tuyến" của khoá học thành Pro qua móc `chanTaiHetSH` (app CuongThai không gắn ⇒ không đổi).
  Khoá Nhật/Trung (`dekiru` 1.241 bài, `jp`, `ch`) mở được trong CT Language. Bước kế: 6 (game, cộng đồng, AI gọi thoại).
- 13/11 (APP): **bước 6 XONG** (chưa deploy). Backend `572a35ae7` + `aa9165ea4`: migration `20261113090000_ctlanguage_cong_dong`
  (bảng `ctl_bai`, `ctl_tra_loi`, FK CASCADE users) — **deploy chạy `migrate deploy`**; cộng đồng `/cong-dong/*` (lọc từ xấu,
  báo cáo ⇒ BAO_CAO admin + tự ẩn khi 3 người báo, chặn hai chiều qua `user_blocks`, admin gỡ được — `kiemDuyetAdmin` thêm
  `ctl_bai`/`ctl_tra_loi`); đề trò chơi `/tu-dien/:nn/tro-choi` (chỉ kho soạn tay có nghĩa Việt); gọi thoại `/ai/goi/*` bọc phòng
  trò chuyện web (`ielts/troChuyen`), free 10 lượt nói/ngày (hoàn lượt khi không nghe được/AI lỗi), chấm buổi = Pro.
  ios-app `f75ce9e`: Trò chơi, Cộng đồng, Gọi CuongMini (tab Luyện; "Nói một câu" ở Hôm nay). ⚠️ Máy local không có khoá
  Groq/Azure ⇒ chưa nghe thật lượt nói + tiếng của CuongMini — **thử trên TestFlight/production**. Đấu PK chưa làm (cần thời
  gian thực). Còn tấm "đang xây" (`SapCoCTL`) ở Luyện nghe · Luyện viết chữ · Thi thử ⇒ phải xong trước khi nộp (bước 7).
- 13/11 (APP): **ba màn "đang xây" XONG — app không còn `SapCoCTL`** (ios-app `4da8d19`, không cần backend mới). Luyện viết chữ =
  màn Luyện viết của từng khoá (`Shared/SachHoc/LuyenVietSH`, chấm từng nét) + chính tả nghe–gõ; Luyện nghe = nghe–chọn nghĩa,
  chép chính tả, "nghe khi đi đường" (AVSpeech, `UIBackgroundModes: audio` — đã ghi lý do trong review notes), bài `kind:
  listening` của các khoá; Thi thử = thi nhanh 30 câu/12 phút/3 phần (free 1 lần/ngày, tổng điểm; Pro: phiếu điểm từng phần +
  từ cần ôn) + đề kiểm tra trong khoá (lọc tiêu đề "Đề tổng hợp/kiểm tra…", "Kiểm tra chặng", "Bài kiểm tra"). Đề nhanh dùng
  `/tu-dien/:nn/tro-choi` (bước 6) ⇒ cần deploy. IELTS thi máy 4 đề của web CHƯA lên app (trình vẽ riêng — để bản sau).
- 13/11 (APP): **bước 7 phần chuẩn bị XONG** (ios-app `9240243`, web `d9b14a4e6`). QA iPhone 17 Pro Max sáng + tối (8 màn chính); sửa:
  màn Pro chỉ hứa tính năng đang có (3.1.2), bỏ mục "Sắp lên app" (2.1), từ loại JMdict → tiếng Việt. Chính sách bảo mật web thêm
  **mục 14 CT Language** (`/chinh-sach-bao-mat#ct-language`, Việt + Anh). Ảnh App Store 6.9" `ios-app/thiet-ke-ctl/app-store/`, hồ sơ
  store `ios-app/CTLANGUAGE_APP_STORE_LISTING.md` (tên, mô tả, từ khoá, độ tuổi, nhãn quyền riêng tư), review notes thêm phần 4.3.
  Số phiên bản app + widget chung `PhienBanCTL.xcconfig`; **phát hành: `bash scripts/phat-hanh-ctlanguage.sh`** (`--thu` đã xanh —
  archive Release không ký qua mọi phép kiểm). **CHƯA**: deploy backend + nhập từ điển VPS, việc tay trên ASC/Developer portal,
  upload TestFlight (hỏi user), nộp duyệt.
- 13/11 08:38 (APP): **app CT Language đã tạo trên App Store Connect** (Apple ID `6834209813`, SKU `ctlanguage-ios`, ngôn ngữ chính
  Vietnamese) và **build 1.0.0 (2) đã upload** (Delivery `da9d81b5-…`). ⚠️ Banner ASC: *Apple Developer Program License Agreement
  Updated* — chủ tài khoản phải chấp nhận ở developer.apple.com/account trước khi nộp duyệt / cập nhật app.
