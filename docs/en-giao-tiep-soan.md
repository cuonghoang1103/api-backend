# Soạn khoá "Tiếng Anh giao tiếp" (30 ngày, A2 → B2) — hướng dẫn cho agent (24/11/2026)

Người học thật: sinh viên IT Việt Nam năm 3, đọc được câu đơn nhưng gặp người nước ngoài là đứng hình. Sắp đi OJT ở FPT Software:
khách Nhật/Mỹ/Âu, đồng nghiệp nước ngoài, họp qua video. Học song song IELTS. Học ở `cuongthai.com/language/en/giao-tiep`, app iOS
CT Language và app desktop. **Mục tiêu duy nhất: NÓI và NGHE được với người thật.** Chất lượng, đầy đủ, chi tiết đặt trên hết;
mỗi câu mẫu phải là câu người bản xứ thật sự nói (tự nhiên, đúng ngữ cảnh), không phải câu sách giáo khoa.
KHÔNG chép giáo trình hay sách có bản quyền (English File, Speakout, Cambridge…): mọi hội thoại và câu ví dụ đều TỰ SOẠN.
Tự làm tuần tự, KHÔNG tách agent con. Không git add/commit. Không chạy tsc/next build toàn bộ.

## 1. Ranh giới — KHÔNG lặp
- **IELTS Tập 1–5** (`/language/en/ielts…`): thi + 4 kỹ năng học thuật. Ở khoá này không dạy dạng đề, không dạy band.
- **Technical English at Work** (Courses `/courses/tieng-anh-ky-thuat-di-lam`, do phiên khác soạn): ticket, bug report, commit/PR,
  code review, email khách, Q&A list, standup, demo, họp với khách. Ở khoá này **không dạy** các việc đó. Chạm tới thì một dòng
  `note` dẫn sang: "Phần kỹ thuật (…) ở khoá Technical English at Work".
- **interview-prep ch8**: phỏng vấn kỹ thuật. Ngày 28 chỉ dạy kể về bản thân và mục tiêu, phần câu hỏi kỹ thuật thì dẫn sang.
- Trước khi chọn tình huống, tên nhân vật, câu mẫu: grep `giao-tiep/ngay/ngay*.ts` đã có để không lặp giữa các ngày. Grep thêm
  `ielts/tap-2/ngay/` (Tập 2 có vài cảnh đời sống ở Listening Part 1) để không dựng lại y cảnh đó.

## 2. Mục lục 30 ngày
Nguồn sự thật: mảng `MUC_LUC` trong `frontend/src/app/language/[code]/giao-tiep/data.ts`. Tên bài ở đó là tên chốt, giữ nguyên ý,
được viết gọn lại cho hay hơn.

| Chặng | Ngày | Mức | Trọng tâm |
|---|---|---|---|
| 1 Sống sót | 1–6 | A2 | chào, hỏi lại khi không hiểu, small talk, ăn uống, mua sắm, đi lại |
| 2 Đời sống | 7–12 | A2+ → B1 | sức khoẻ, nhà ở, điện thoại, mời/từ chối, kể chuyện, cảm xúc |
| 3 Công sở (không kỹ thuật) | 13–18 | B1 | làm quen team, small talk công sở, nhờ việc, xin nghỉ, video call, đồng ý/không đồng ý |
| 4 Giao tiếp sâu | 19–24 | B1+ → B2 | networking, đón khách giới thiệu Việt Nam, phàn nàn, thương lượng, thời sự, khác biệt văn hoá |
| 5 Tự nhiên | 25–30 | B2 | nói nhanh/nối âm/idiom, trò chuyện dài, kể chuyện + đùa, nói về bản thân, tình huống khó, một ngày bằng tiếng Anh |

Độ khó tăng thật theo chặng: câu dài hơn, tốc độ nghe nhanh hơn (chặng 1 ~130 wpm, chặng 5 ~180 wpm), ít chú thích tiếng Việt hơn.

### 2.1 Ngữ pháp trong câu — mỗi ngày MỘT điểm, đi từ câu đơn giản nhất tới câu thông dụng nhất
User muốn: "từ câu đơn giản nhất đến câu thông dụng nhất, học thêm từ mới, cách nối câu, một câu tiếng Anh ghép thế nào (ngữ pháp),
dễ hiểu và dùng được luôn". Vì vậy bài `speaking` mỗi ngày có mục **"🧱 Câu này ghép thế nào"**:
- khối `patterns`, mỗi hàng gồm `formula` dạng S + V + O…, nghĩa tiếng Việt và 3 ví dụ lấy từ cảnh hôm nay;
- một `rule` ngắn;
- một `note` "nối câu" (từ nối hôm nay).

Ngữ pháp chỉ để NÓI được câu của cảnh đó, không giảng như sách ngữ pháp.

| Ngày | Điểm ngữ pháp / nối câu |
|---|---|
| 1 | be + đại từ: I'm… / This is… / Nice to meet you; and |
| 2 | câu hỏi yes/no & Wh-; Could you…? Sorry? |
| 3 | hiện tại đơn (thói quen, sở thích); like/love/enjoy + V-ing; but, so |
| 4 | would like / Can I have…?; some/any; đếm được – không đếm được |
| 5 | How much / How many; this/that/these/those; so sánh đơn giản (cheaper, bigger) |
| 6 | câu mệnh lệnh; giới từ nơi chốn (next to, opposite); first, then |
| 7 | have + triệu chứng; should / shouldn't; for + thời gian |
| 8 | there is / there are; hiện tại tiếp diễn cho việc đang xảy ra (the tap is leaking) |
| 9 | will cho quyết định tức thì (I'll call back); can / could |
| 10 | be going to & hiện tại tiếp diễn cho kế hoạch; từ chối bằng I'd love to, but… |
| 11 | quá khứ đơn (động từ có quy tắc / bất quy tắc thông dụng); first, then, after that, in the end |
| 12 | hiện tại hoàn thành cơ bản (I've just heard…); so / such … that |
| 13 | câu hỏi để làm quen (What do you do here? How long have you…?); also / too |
| 14 | câu hỏi đuôi (…, isn't it?); Have you ever…? |
| 15 | câu hỏi gián tiếp (Do you know where…?); Would you mind + V-ing? |
| 16 | nêu lý do: because / since / as; won't be able to |
| 17 | điều kiện loại 1 (If you can't hear me, …); câu mệnh lệnh lịch sự (Let me…) |
| 18 | nêu ý kiến: I think / I'm not sure (that)…; however / although |
| 19 | used to; câu hỏi nối tiếp để giữ chuyện |
| 20 | bị động đơn giản (is made from, was built in) |
| 21 | tường thuật đơn giản (I was told that…); should have + V3 |
| 22 | điều kiện loại 2 (If we…, we could…); How about…? What if…? |
| 23 | tường thuật (He said that…); apparently / it seems |
| 24 | động từ khuyết thiếu làm mềm câu: might, could, would |
| 25 | dạng rút gọn khi nói (gonna, wanna, gotta, kinda); nối âm |
| 26 | từ chuyển ý: anyway, by the way, speaking of…, as I was saying |
| 27 | quá khứ hoàn thành trong kể chuyện (I had just…, when…) |
| 28 | hiện tại hoàn thành tiếp diễn (I've been working on…); I'm hoping to… |
| 29 | câu chẻ để làm rõ (What I meant was…); giữ lượt nói (Sorry, can I just finish?) |
| 30 | tổng ôn: 10 khung câu dùng nhiều nhất cả khoá |

### 2.2 Hình minh hoạ, ngôn ngữ cơ thể, trải nghiệm (BẮT BUỘC)
User: "chưa có hình ảnh 2D minh hoạ thu hút, body language, trải nghiệm người học". Hình lấy từ kho Fluent Emoji 3D (MIT) đã có
quy trình: chỉ ghi TÊN slug, web tự vẽ `media.cuongthai.com/hoc/hinh/<slug>.webp`. Danh mục slug:
`scripts/hinh/fluent-catalog.json` (khoá `hinh`, 1.595 slug). **Chỉ dùng slug có trong danh mục.** Kiểm:
`npx tsx scripts/hinh/len-r2.mts --kiem` (chạy ở gốc repo; slug lạ ⇒ báo).
- Bài `listening`: mở cảnh bằng khối **`canh`** (`anh`: 3–6 slug dựng bối cảnh, vd `['hotel','bellhop-bell','man-raising-hand','key']`,
  `caption`: ai, ở đâu, chuyện gì).
- Bài `speaking`: mục **"🙋 Ngôn ngữ cơ thể"** dùng khối `hinh` (`items`: `anh` slug cử chỉ/nét mặt + `w` câu đi kèm + `ro` để trống
  hoặc IPA + `vi` ý nghĩa). Ví dụ: `waving-hand`, `handshake`, `thumbs-up`, `folded-hands`, `person-shrugging`, `face-with-raised-eyebrow`,
  `person-bowing`, `ok-hand`, `eyes`. Phải có KHÁC BIỆT VĂN HOÁ: cử chỉ nào ở Việt Nam bình thường mà ở Anh/Mỹ/Nhật lại khác, ánh mắt,
  khoảng cách đứng, bắt tay, cúi chào, chỉ tay.
- Từ / cụm từ chỉ đồ vật trong `vocab` gắn `anh` khi có slug hợp (`coffee`, `receipt`, `taxi`, `pill`…).
- Có thể dùng `sodo` (flow: các bước một cuộc gọi; compare: thân mật và trang trọng) để người học thấy cấu trúc.

### 2.3 Nối với Podcast (không lặp)
App và web có mục **Podcast** (`content/ctlanguage/podcast/en/*.json`, 46 tập; nhóm đời sống `en-ds-*`, `en-a1/a2/b1-*`, công việc
`en-cv-*`, phần mềm `en-se-*`). Nhiều tập trùng chủ đề khoá này (A Table for Two, Checking In, Something for a Sore Throat, I'd Love To
But…, This Isn't What We Ordered, Crazy Weather, My Bag Didn't Arrive, Is the Rent Negotiable?, Can We Talk About the Noise?…).
- **Đọc tập podcast cùng chủ đề trước khi soạn**: cảnh của khoá phải KHÁC kịch bản podcast (khác chuyện, khác câu).
- Cuối bài `listening` có `note` "🎧 Nghe thêm ở Podcast": ghi tên tập + mã (vd `en-ds-a1-03 · A Table for Two`). Web sẽ có trang
  `/language/en/podcast/<mã>`.

## 3. Tệp ngày — `frontend/src/app/language/[code]/giao-tiep/ngay/ngayN.ts`
- `import type { Lesson } from '../data';` rồi `export const NGAY_N: Lesson[] = [ … ];` (chỉ `import type`).
- **Khuôn** (bộ kiểm chặn sai thứ tự): `listening` · `speaking` · `reading` (N lẻ) / `writing` (N chẵn) · `homework`,
  cộng thêm `review` với id `gtdN-kiem-tra` ở N ∈ {6, 12, 18, 24, 30}. Bài review gom 6 ngày, ngưỡng đạt ≥ 70 % từng phần,
  ghi rõ cần ôn Ngày nào.
- MỌI id bắt đầu `gtdN-` và không trùng. Mỗi ngày **đúng 1 khối `phatam`**. Mỗi bài (trừ review) mở bằng khối `recap`
  và có `goal` + `minutes`. Bôi đậm dùng `**…**`, không dùng `*nghiêng*` một sao.
- Khối có sẵn: xem `frontend/src/components/sach-hoc/types.ts` (đúng tên trường). Hay dùng: `listen` (nhiều giọng), `dialogue`,
  `vocab`, `patterns`, `table`, `note`, `examples`, `mcq`, `quiz`, `dictation`, `build`, `speak`, `phatam`, `sodo`.
  `canh` / `hinh` / `vocab.anh` dùng slug Fluent theo mục 2.2 (bắt buộc). Không dùng `figure`. Văn phong, `recap`, `rule`, dịch 💡: đọc
  `frontend/src/app/language/[code]/ielts/SOAN-BAI.md` (phần chung, bỏ qua phần riêng IELTS).
- Giọng `voice`: `uk-nu uk-nam us-nu us-nam au-nu au-nam ca-nu ca-nam nz-nu nz-nam ie-nu ie-nam`. Trộn đủ giọng trong mỗi chặng.
  Không có giọng Scotland, Ấn, Nhật: muốn nói tới thì mô tả bằng chữ trong `note` (đặc điểm, mẹo nghe), không giả giọng.

### Bài 1 — `listening` "Nghe cảnh" (25–30 phút)
1. `recap`: hôm nay ở đâu, gặp ai, cần làm được gì. Nối lại ngày trước.
2. Khối `listen`: 2–3 cảnh, mỗi cảnh 8–20 lượt, có `who` và `voice`, có `vi` (chặng 4–5 được bỏ `vi` ở câu dễ). Cảnh phải có
   chuyện thật: hiểu lầm, đổi ý, vấn đề nảy sinh. Không chỉ chào hỏi rồi thôi.
3. `mcq` hiểu ý (6–10 câu, có `why`) + `dictation` 5–8 câu khó (nối âm, số, tên riêng).
4. `table` hoặc `note` "Họ nói vậy nghĩa là gì": câu ẩn ý (vd "That's an interesting idea" = không đồng ý), mức lịch sự, văn hoá.

### Bài 2 — `speaking` "Nói" (25–30 phút)
1. Khối `vocab` **20–30 mục**, mỗi mục là cụm từ / câu mẫu dùng được ngay (`w` = cụm, `pos` = phr/n/v…, `ipa` IPA Anh-Mỹ
   `/…/`, `ex` = câu trong cảnh, `exVi`). Mẫu câu tự vào tra cứu và app.
2. `table` hoặc `patterns` **xếp mẫu câu theo mức lịch sự / thân mật**: thân (bạn bè) · trung tính (đồng nghiệp) · trang trọng
   (sếp, khách).
3. `note` **"Người Việt hay nói sai"**: ít nhất 5 lỗi thật, mỗi lỗi ghi câu sai → câu đúng → vì sao. Vd "I very like" →
   "I really like"; "Can you speak again?" → "Sorry, could you say that again?"; "open/close the light"…
4. `phatam` (đúng 1 khối/ngày): âm hay sai trong câu hôm nay, nối âm, ngữ điệu, trọng âm câu.
5. **Nhập vai**: một `dialogue` mẫu (vai `a`/`b`), rồi một bài `build` hoặc `quiz` kind `translate` để người học tự nói/viết
   lượt của mình. Cuối bài có `note` "Nhập vai với Gia sư AI", chép sẵn 1 đoạn đề bài nhập vai để dán vào trang `/language/en/roleplay`.
6. Tuỳ ngày có thể thêm `speak` với 3–5 câu hỏi để người học tự trả lời (part '1').

### Bài 3 — `reading` (lẻ) / `writing` (chẵn) (15–20 phút)
- Đọc: văn bản THẬT của đời sống (tin nhắn, email, thông báo, thực đơn, hoá đơn, biển báo, bài đăng) dựng bằng `passage` hoặc
  `examples`; `mcq` hiểu ý + hiểu giọng điệu; `note` cụm hay dùng trong loại văn bản đó.
- Viết: mẫu tin nhắn/email ngắn **thân và trang trọng đặt cạnh nhau**; `build` để sắp câu; `quiz` (fill/translate) để tự viết
  3–5 tin. Đưa đáp án gợi ý, được nhiều phương án (`alt`).

### `homework` (≥ 30 câu có đáp án)
Trộn `mcq` (chọn câu hợp cảnh / hợp mức lịch sự), `quiz` fill/translate (Việt → Anh nói tự nhiên), `dictation`, `build`
(sắp lượt hội thoại hoặc câu). Có cả câu ôn ngày trước (xoắn ốc).

## 4. Chất lượng bắt buộc
- **Thật**: số liệu, phong tục, giá, quy định nói đúng thực tế (thói quen tip ở Mỹ/Anh/Úc khác nhau; giờ làm; cách gọi Grab ở
  VN…). Không chắc thì nói chung chung, không bịa.
- **Ngữ cảnh người học**: thêm tình huống sinh viên IT / thực tập ở công ty có khách nước ngoài, đồng nghiệp Nhật, Ấn, Mỹ,
  đi công tác, đón khách ở Hà Nội / TP.HCM / Đà Nẵng.
- **Mỗi ngày ít nhất 1 bảng "khác biệt Anh – Mỹ – Úc"** khi có (từ, cách nói, phép lịch sự).
- **Mỗi ngày 1 mẹo "không nghe kịp thì làm gì"** đúng tình huống hôm đó.
- Văn tiếng Việt rõ, thân thiện, xưng "bạn". Không bôi đậm cả câu dài.

## 4b. Tiết kiệm (user dặn 24/11 — hạn mức có hạn)
- KHÔNG đọc trọn tệp lớn: Tập 3–5 mỗi ngày > 100 KB. Muốn tránh trùng thì `grep -n` từ khoá / tên cảnh, không `Read` cả tệp.
- Mẫu khuôn: đọc `giao-tiep/ngay/ngay1.ts` (lẻ) và `ngay2.ts` (chẵn) — đã soát, làm theo đúng cấu trúc đó; không cần đọc ngày IELTS.
- `SOAN-BAI.md`: chỉ đọc phần chung (văn phong, recap, rule, 💡), bỏ các mục "Soạn Tập N".

## 5. Kiểm & báo
- Kiểm: `cd frontend && node --experimental-strip-types --no-warnings scripts/ielts-kiem-ngay.mts gt <N> <N>` ⇒ ✓.
- Không sửa `index.ts` / `manifest.ts` / `data.ts` (phiên chính ghép).
- Báo lại (tiếng Việt, ≤ 200 từ): nội dung chính từng bài, số câu, số mẫu câu, giọng đã dùng, chỗ chưa chắc.
